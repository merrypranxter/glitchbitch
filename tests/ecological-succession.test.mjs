import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,validateRecipe,recipeDocument,parseDocument} from "../src/data.js";
import {successionModes,successionControls,MAX_SUCCESSION,
  successionEnabled,prepareSuccession,advanceSuccession,advanceSuccessionAges,
  successionResourceAt,packedSuccession,successionCensus,shuffleSuccession,
  hideSuccession,clearSuccession,successionGLSL} from "../src/ecological-succession.js";
import {substrateResourceAt} from "../src/substrate-alchemy.js";
import {evolveSporeGeneration,daughterSite} from "../src/spore-dynasties.js";
import {colonyFitness,prepareSelection} from "../src/selection-chamber.js";
import {shuffleEcosystem} from "../src/ecosystem-randomizer.js";
import {sectionMeta,sectionActive,findControls} from "../src/ui-index.js";

const base={...initial,engine:18,seed:7331,ratio:"1:1",
  substrateMode:"Nutrient rivers",substrateAmount:91,substrateScale:62,
  substratePressure:90,substrateAffinityA:96,substrateAffinityB:7,
  sporeMode:"Windborne",sporeAmount:90,sporeReach:68,sporeFertility:100,
  geneAmount:85,atmoAmount:85,atmoBAmount:82,
  atmoMaskMode:"Painted colonies",atmoBMaskMode:"Painted colonies",
  habitatStamps:[
    {id:"mother",x:.31,y:.42,radius:.20,parent:0,gene:15,generation:0},
    {id:"rival",x:.72,y:.65,radius:.21,parent:1,gene:86,generation:0},
  ],
  lettering:"I INHERITED THIS PLANET"};
const change=s=>advanceSuccession({...s,successionBurial:100});
test("opt-in old art remains unchanged; new schema defaults are safe",()=>{
  assert.equal(initial.successionAmount,0);
  assert.deepEqual(initial.successionRecords,[]);
  assert.equal(successionEnabled(initial),false);
  assert.equal(successionResourceAt(initial,.4,.5,.36),.36);
  assert.equal(successionModes.length,5);
  assert.equal(MAX_SUCCESSION,6);
  for(const key of successionControls)assert.ok(Object.hasOwn(initial,key),key);
  const legacy={...base};
  for(const key of [...successionControls,"successionMode","successionEpoch","successionRecords"])
    delete legacy[key];
  const restored=validateRecipe(legacy);
  assert.equal(restored.successionAmount,0);
  assert.deepEqual(restored.successionRecords,[]);
  assert.deepEqual(restored.habitatStamps,base.habitatStamps);
});
test("five chemical legacies respond locally and deterministically",()=>{
  for(const mode of successionModes){
    const world=change({...base,successionMode:mode});
    assert.equal(world.successionEpoch,1);
    assert.equal(world.successionRecords.length,2);
    assert.ok(successionEnabled(world));
    const a=successionResourceAt(world,.31,.42,.4);
    const b=successionResourceAt(world,.72,.65,.4);
    assert.ok(a>=0&&a<=1&&b>=0&&b<=1,mode);
    assert.deepEqual(change({...base,successionMode:mode}),world);
    assert.deepEqual(validateRecipe(world),world);
    assert.deepEqual(parseDocument(recipeDocument(world,"Soil",
      {time:0,colorTime:0})).state,world);
    if(mode==="Pioneer enrichment"||mode==="Symbiotic compost")assert.ok(a>.4,mode);
    if(mode==="Nutrient exhaustion")assert.ok(a<.4,mode);
    if(mode==="Allelopathic scars"){assert.ok(a<.4);assert.ok(b>.4);}
    if(mode==="Niche inversion"){
      assert.ok(successionResourceAt(world,.31,.42,.2)>.2);
      assert.ok(successionResourceAt(world,.31,.42,.8)<.8);
    }
  }
});
test("centuries retain last six local memories without deleting organisms or fossils",()=>{
  const world=change(base);
  const aged=advanceSuccessionAges(world,8);
  assert.equal(aged.successionRecords.length,6);
  assert.equal(aged.successionEpoch,9);
  assert.deepEqual(aged.habitatStamps,base.habitatStamps);
  assert.deepEqual(aged.fossilRecords,base.fossilRecords);
  assert.equal(aged.lettering,base.lettering);
  assert.deepEqual(aged.colors,base.colors);
  assert.equal(new Set(aged.successionRecords.map(r=>r.id)).size,6);
  assert.ok(aged.successionRecords.every(r=>r.epoch>=6&&r.epoch<=8));
  assert.deepEqual(validateRecipe(aged),aged);
  const blocked={...base,successionBurial:0};assert.equal(advanceSuccession(blocked),blocked);
});
test("hide and clear are separate, explicit reversible operations",()=>{
  const active=change(base);
  assert.equal(successionEnabled(hideSuccession(active)),false);
  assert.deepEqual(hideSuccession(active).successionRecords,active.successionRecords);
  const cleared=clearSuccession(active);
  assert.deepEqual(cleared.successionRecords,[]);
  assert.equal(cleared.successionEpoch,0);
  assert.deepEqual(cleared.habitatStamps,base.habitatStamps);
});
test("buried chemistry actually reaches substrate-dependent fitness and spore landing",()=>{
  const world=change({...base,successionDepth:100,successionAmount:100});
  const before={...world,successionAmount:0};
  const sample=world.habitatStamps[0];
  assert.notEqual(substrateResourceAt(before,sample.x,sample.y),
    substrateResourceAt(world,sample.x,sample.y));
  const census=successionCensus(world,substrateResourceAt);
  assert.equal(census.length,2);
  assert.ok(census.some(x=>Math.abs(x.before-x.after)>1e-5));
  const fitnessBefore=colonyFitness(prepareSelection(before),sample);
  const fitnessAfter=colonyFitness(prepareSelection(world),sample);
  assert.notEqual(fitnessBefore,fitnessAfter);
  for(let i=0;i<world.habitatStamps.length;i++){
    const location=daughterSite(world,i);
    assert.ok(location.x>=.055&&location.x<=.945);
    assert.ok(location.y>=.055&&location.y<=.945);
  }
  const offspring=evolveSporeGeneration(world);
  assert.ok(offspring.habitatStamps.length>world.habitatStamps.length);
  assert.deepEqual({x:offspring.habitatStamps[2].x,y:offspring.habitatStamps[2].y},daughterSite(world,0));
  assert.deepEqual(validateRecipe(offspring),offspring);
});
test("bounded packing, validators and legacy lookbook state remain safe",()=>{
  const one=change(base);
  assert.equal(packedSuccession(one.successionRecords[0]),9);
  assert.equal(packedSuccession(one.successionRecords[1]),-9);
  assert.throws(()=>validateRecipe({...base,successionEpoch:4096}),/succession/);
  assert.throws(()=>validateRecipe({...base,successionEpoch:-1}),/succession/);
  assert.throws(()=>validateRecipe({...base,successionMode:"Unknown soil"}));
  assert.throws(()=>validateRecipe({...base,successionRecords:[
    {...one.successionRecords[0],mode:"inject"}]}));
  assert.throws(()=>validateRecipe({...base,successionRecords:
    Array.from({length:7},(_,i)=>({...one.successionRecords[0],id:"s"+i}))}));
  assert.deepEqual(validateRecipe(one),one);
});
test("renderer shader compiles only when soil is active; CPU/GPU nesting order matches",()=>{
  const shader=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
  const geology=readFileSync(new URL("../src/substrate-alchemy.js",import.meta.url),"utf8");
  const ui=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
  assert.ok(successionGLSL.includes("float successionResource(vec2 uv,float original)"));
  assert.ok(successionGLSL.includes("for(int i=0;i<6;i++)"));
  assert.match(geology,/return successionResourceAt\(state,x,y,fossilResourceAt/);
  assert.match(shader,/withSuccession = successionEnabled\(s\)/);
  assert.match(shader,/withSuccession\?successionGLSL:""/);
  assert.match(shader,/withSuccession\?"successionResource\(uv,":""/);
  assert.match(shader,/col=shadeSuccession\(col,uv\)/);
  assert.match(shader,/successionUnavailable=true/);
  assert.match(shader,/gl\.uniform4fv\(loc\("successionStamps\[0\]"\),successionBuffer\)/);
  for(const key of successionControls)assert.ok(ui.includes('name="'+key+'"'),key);
  assert.equal(sectionMeta("ecological-succession").group,"Time");
  assert.equal(sectionActive(sectionMeta("ecological-succession"),initial),false);
  assert.equal(findControls("pioneer enrichment")[0].id,"ecological-succession");
  assert.ok(ui.includes("Century + descendants"));
});
test("smart shuffles produce valid, bounded recipes even with fixed RNG inputs",()=>{
  for(const value of [.03,.13,.35,.63,.97]){
    const shuffled=shuffleEcosystem(base,()=>value,{allowDual:true});
    assert.ok(shuffled.successionRecords.length<=MAX_SUCCESSION);
    assert.deepEqual(validateRecipe(shuffled),shuffled);
    const sampled=shuffleSuccession(base,()=>value);
    assert.deepEqual(validateRecipe(sampled),sampled);
  }
});
