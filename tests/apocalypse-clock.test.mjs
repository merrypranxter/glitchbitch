import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,looks,numericRanges,validateRecipe,randomize,
  recipeDocument,parseDocument} from "../src/data.js";
import {apocalypseModes,apocalypseControls,apocalypsePresets,
  apocalypseGLSL,apocalypseActive,apocalypseSignal,apocalypseResource,
  advanceApocalypseEpoch,applyApocalypsePreset,shuffleApocalypse,
  haltApocalypse} from "../src/apocalypse-clock.js";
import {substrateEnabled,substrateResourceAt,substrateGLSL}
  from "../src/substrate-alchemy.js";
import {colonyFitness,rankSelection,selectionActive,selectionCycle}
  from "../src/selection-chamber.js";
import {daughterSite,evolveSporeGeneration}
  from "../src/spore-dynasties.js";
import {shuffleEcosystem,fullWeirdShuffle}
  from "../src/ecosystem-randomizer.js";
import {sectionMeta,sectionActive,findControls}
  from "../src/ui-index.js";

const painted=looks.find(l=>l.family==="Painted Habitats").state;
const base={...initial,seed:792351,engine:18,ratio:"9:16",
  palette:-1,colors:["#ff00aa","#00ffff","#ffff00"],
  lettering:"DON'T YOU DARE ERASE MY TEXT"};
const population={
  ...base,substrateMode:"Nutrient rivers",substrateAmount:92,
  substrateScale:65,substratePressure:91,
  atmoAmount:90,atmoMaskMode:"Painted colonies",
  atmoBAmount:82,atmoBMaskMode:"Painted colonies",
  geneAmount:94,selectionMode:"Nutrient matching",
  selectionPressure:92,sporeMode:"Windborne",sporeAmount:91,
  sporeReach:76,sporeFertility:100,
  habitatStamps:[
    {id:"A0",x:.15,y:.22,radius:.18,parent:0,gene:15,generation:0},
    {id:"B1",x:.33,y:.48,radius:.19,parent:1,gene:86,generation:0},
    {id:"A2",x:.66,y:.31,radius:.22,parent:0,gene:58,generation:0},
    {id:"B3",x:.81,y:.68,radius:.15,parent:1,gene:34,generation:0},
    {id:"A4",x:.48,y:.82,radius:.17,parent:0,gene:93,generation:0},
  ]
};
const isDiff=(a,b)=>Math.abs(a-b)>1e-8;

test("legacy art has no apocalypse shader, chemistry or hidden epoch",()=>{
  assert.deepEqual(apocalypseModes,[
    "Dormant","Crystal winter","Acid monsoon","Solar flare",
    "Tectonic rupture","Radiation garden"]);
  assert.equal(initial.apocalypseMode,"Dormant");
  assert.equal(initial.apocalypseAmount,0);
  assert.equal(initial.apocalypseEpoch,0);
  for(const control of apocalypseControls)
    assert.deepEqual(numericRanges[control],[0,100],control);
  assert.equal(apocalypseActive(initial),false);
  const previous={...painted};
  for(const key of [...apocalypseControls,"apocalypseMode",
    "apocalypseEpoch"])delete previous[key];
  const restored=validateRecipe(previous);
  for(const key of [...apocalypseControls,"apocalypseMode",
    "apocalypseEpoch"])
    assert.deepEqual(restored[key],initial[key],key);
  assert.deepEqual(restored.habitatStamps,painted.habitatStamps);
  assert.deepEqual(restored.colors,painted.colors);
  assert.equal(restored.lettering,painted.lettering);
});

test("five catastrophes produce varied, finite and deterministic resource shocks",()=>{
  for(const mode of apocalypseModes.slice(1)){
    const s={...population,apocalypseMode:mode,
      apocalypseAmount:96,apocalypsePressure:94,
      apocalypseScale:78,apocalypseEpoch:2};
    assert.ok(apocalypseActive(s));
    const values=[],resources=[];
    for(let i=0;i<=9;i++)for(let j=0;j<=9;j++){
      const x=i/9,y=j/9;
      const shock=apocalypseSignal(s,x,y);
      const resource=substrateResourceAt(s,x,y);
      assert.ok(Number.isFinite(shock)&&shock>=0&&shock<=1);
      assert.ok(Number.isFinite(resource)&&resource>=0&&resource<=1);
      assert.equal(shock,apocalypseSignal(s,x,y));
      assert.equal(resource,substrateResourceAt(s,x,y));
      values.push(shock);
      resources.push(resource);
    }
    assert.ok(Math.max(...values)-Math.min(...values)>.4,mode);
    assert.ok(Math.max(...resources)-Math.min(...resources)>.10,mode);
    assert.deepEqual(validateRecipe(s),s);
  }
});

test("turning catastrophe off restores exact original mineral chemistry",()=>{
  const s={...population,apocalypseMode:"Crystal winter",
    apocalypseAmount:95,apocalypsePressure:87,apocalypseEpoch:5};
  let disturbed=0;
  for(let i=0;i<30;i++){
    const x=(i*.172)%1,y=(i*.237)%1;
    const before=substrateResourceAt(population,x,y);
    const after=substrateResourceAt(s,x,y);
    if(isDiff(before,after))disturbed++;
    assert.equal(substrateResourceAt(haltApocalypse(s),x,y),before);
    assert.equal(substrateResourceAt({...s,apocalypsePressure:0},x,y),before);
    assert.equal(apocalypseResource({...s,apocalypseAmount:0},x,y,before),before);
  }
  assert.ok(disturbed>24);
  assert.equal(apocalypseActive({...s,substrateAmount:0}),false);
  assert.equal(apocalypseActive({...s,substrateMode:"Bare canvas"}),false);
});

test("one explicit epoch changes chemistry, without touching a single colony",()=>{
  const s={...population,apocalypseMode:"Radiation garden",
    apocalypseAmount:94,apocalypsePressure:91,apocalypseEpoch:0};
  const next=advanceApocalypseEpoch(s);
  assert.equal(next.apocalypseEpoch,1);
  assert.deepEqual(next.habitatStamps,s.habitatStamps);
  assert.deepEqual(next.colors,s.colors);
  assert.equal(next.lettering,s.lettering);
  assert.equal(next.seed,s.seed);
  assert.equal(next.geneAmount,s.geneAmount);
  assert.ok(isDiff(apocalypseSignal(s,.43,.28),
    apocalypseSignal(next,.43,.28)));
  assert.notDeepEqual(
    [colonyFitness(s,s.habitatStamps[0]),
      colonyFitness(s,s.habitatStamps[1])],
    [colonyFitness(next,next.habitatStamps[0]),
      colonyFitness(next,next.habitatStamps[1])]);
  assert.deepEqual(validateRecipe(next),next);
  assert.deepEqual(parseDocument(recipeDocument(next,
    "geological time machine",{time:11,colorTime:18})).state,next);
  assert.equal(advanceApocalypseEpoch({...s,apocalypseEpoch:4095}).apocalypseEpoch,4095);
  const inactive={...s,apocalypseAmount:0};
  assert.equal(advanceApocalypseEpoch(inactive),inactive);
});

test("static epochs affect actual spore landing, birth lineage, and survival scores",()=>{
  const s={...population,apocalypseMode:"Acid monsoon",
    apocalypseAmount:100,apocalypsePressure:100,
    apocalypseScale:74,apocalypseEpoch:0};
  let shifted=0;
  for(let i=0;i<s.habitatStamps.length;i++){
    const now=daughterSite(s,i);
    const future=daughterSite({...s,apocalypseEpoch:3},i);
    if(Math.hypot(now.x-future.x,now.y-future.y)>1e-7)shifted++;
  }
  assert.ok(shifted>0,"epoch change must affect actual dispersal selection");
  const born=evolveSporeGeneration(s);
  assert.ok(born.habitatStamps.length>s.habitatStamps.length);
  for(let i=0;i<born.habitatStamps.length-s.habitatStamps.length;i++){
    const baby=born.habitatStamps[s.habitatStamps.length+i];
    assert.deepEqual({x:baby.x,y:baby.y},daughterSite(s,i));
    assert.equal(baby.ancestor,s.habitatStamps[i].id);
  }
  assert.deepEqual(validateRecipe(born),born);
  assert.deepEqual(parseDocument(recipeDocument(born,"chemical children",
    {time:5,colorTime:2})).state,born);
});

test("five catastrophe specimens and seeded shuffles preserve artist's entire original art",()=>{
  assert.equal(apocalypsePresets.length,5);
  for(const preset of apocalypsePresets){
    const s=applyApocalypsePreset(population,preset.name);
    assert.ok(apocalypseActive(s));
    assert.equal(s.apocalypseMode,preset.apocalypseMode);
    assert.equal(s.apocalypseAmount,preset.apocalypseAmount);
    for(const key of ["habitatStamps","colors","lettering",
      "engine","palette","marks","selectionMode"])
      assert.deepEqual(s[key],population[key],key);
    assert.deepEqual(validateRecipe(s),s);
  }
  assert.equal(applyApocalypsePreset(population,"fake apocalypse"),population);
  for(const n of [0,.12,.26,.48,.69,.99]){
    const s=shuffleApocalypse(population,()=>n);
    assert.ok(apocalypseActive(s));
    assert.deepEqual(s.habitatStamps,population.habitatStamps);
    assert.deepEqual(s.colors,population.colors);
    assert.equal(s.lettering,population.lettering);
    assert.deepEqual(validateRecipe(s),s);
  }
});

test("Surprise and Freakshow only awaken valid real geological disasters",()=>{
  for(const n of [0,.15,.29,.44,.57,.73,.91,.99]){
    for(const s of [shuffleEcosystem(base,()=>n),
      fullWeirdShuffle(base,()=>n)]){
      assert.deepEqual(validateRecipe(s),s);
      if(s.apocalypseAmount>0){
        assert.ok(apocalypseActive(s));
        assert.ok(substrateEnabled(s));
        assert.notEqual(s.apocalypseMode,"Dormant");
      }
    }
  }
  const mutated=randomize(base,{},true,()=>.76);
  assert.equal(mutated.apocalypseAmount,0);
  const surprised=randomize(base,{},false,()=>.39);
  assert.deepEqual(validateRecipe(surprised),surprised);
});

test("epoch validation rejects invalid modes, counters and toxic slider values",()=>{
  for(const [key,value] of [
    ["apocalypseMode","The Galactic IRS"],
    ["apocalypseAmount",101],["apocalypseScale",-1],
    ["apocalypseMotion",NaN],["apocalypsePressure",Infinity],
    ["apocalypseGlow",101],["apocalypseHue",-4],
    ["apocalypseEpoch",-1],["apocalypseEpoch",4096],
    ["apocalypseEpoch",1.1]
  ])assert.throws(()=>validateRecipe({...base,[key]:value}),undefined,key);
});

test("all 152 unique Lookbook recipes survive unchanged, including five epoched worlds",()=>{
  assert.equal(looks.length,152);
  assert.equal(new Set(looks.map(x=>x.name)).size,152);
  const family=looks.filter(x=>x.family==="Apocalypse Clock");
  assert.equal(family.length,5);
  for(const look of looks){
    assert.deepEqual(validateRecipe(look.state),look.state,look.name);
    assert.deepEqual(parseDocument(recipeDocument(look.state,look.name,
      {time:7,colorTime:12})).state,look.state,look.name);
  }
  for(const look of family){
    const s=look.state;
    assert.ok(apocalypseActive(s));
    assert.ok(selectionActive(s));
    assert.ok(s.habitatStamps.length>=8);
    assert.ok(s.habitatStamps.every(m=>Number.isInteger(m.gene)));
    assert.ok(rankSelection(s).every(p=>p.fitness>=0&&p.fitness<=1));
  }
});

test("renderer compiles disaster shaders only when substrate is visible and enabled",()=>{
  const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
  const ui=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
  assert.match(renderer,/withApocalypse = apocalypseActive\(s\)/);
  assert.match(renderer,/withApocalypse\?apocalypseGLSL:""/);
  assert.match(renderer,/withApocalypse \? "apocalypse" : "no-apocalypse"/);
  assert.match(renderer,/withApocalypse\?"col=shadeApocalypse\(col,uv\);":""/);
  assert.match(renderer,/withApocalypse\?"apocalypseResource\(uv,n\)":"n"/);
  assert.match(renderer,/gl\.uniform1i\(loc\("apocalypseMode"\),apocalypseModes\.indexOf\(s\.apocalypseMode\)\)/);
  assert.match(renderer,/gl\.uniform1f\(loc\("apocalypseEpoch"\),s\.apocalypseEpoch\)/);
  assert.match(substrateGLSL,/\/\* APOCALYPSE_RESOURCE \*\/n/);
  assert.match(apocalypseGLSL,/float apocalypseResource\(vec2 uv,float original\)/);
  assert.match(apocalypseGLSL,/float apocalypseSignal\(vec2 uv\)/);
  assert.doesNotMatch(apocalypseGLSL,/sampler|texture2D|discard|uniform\s+vec[234]\s+\w+\s*\[/);
  for(const key of apocalypseControls)
    assert.ok(ui.includes('name="'+key+'"'),key);
  for(const name of ["Summon catastrophe","Shuffle disasters",
    "Advance epoch","Epoch + selection cycle","Hide catastrophe"])
    assert.ok(ui.includes(name),name);
  assert.ok(ui.includes("window.confirm"));
  assert.equal(sectionMeta("apocalypse-clock").group,"Scene");
  assert.equal(sectionActive(sectionMeta("apocalypse-clock"),initial),false);
  assert.equal(findControls("radiation garden")[0].id,"apocalypse-clock");
});
