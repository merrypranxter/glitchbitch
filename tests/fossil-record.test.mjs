import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,looks,numericRanges,validateRecipe,randomize,
  recipeDocument,parseDocument} from "../src/data.js";
import {MAX_FOSSILS,fossilModes,fossilControls,fossilPresets,
  fossilGLSL,fossilEnabled,fossilRadiusWeight,fossilResourceAt,
  packedFossil,unpackageFossil,archiveFossils,archiveAndAdvance,
  applyFossilPreset,shuffleFossils,hideFossils,clearFossilArchive}
  from "../src/fossil-record.js";
import {substrateResourceAt,substrateGLSL}
  from "../src/substrate-alchemy.js";
import {colonyFitness,rankSelection}
  from "../src/selection-chamber.js";
import {daughterSite,evolveSporeGeneration}
  from "../src/spore-dynasties.js";
import {shuffleEcosystem,fullWeirdShuffle}
  from "../src/ecosystem-randomizer.js";
import {sectionMeta,sectionActive,findControls}
  from "../src/ui-index.js";

const base={...initial,engine:18,seed:317921,ratio:"9:16",
  colors:["#ff00aa","#08ffff","#f9ff00"],palette:-1,
  lettering:"GHOSTS DON'T GET TO ERASE MY LETTERING"};
const populated={...base,
  atmoMaskMode:"Painted colonies",atmoAmount:92,
  atmoBMaskMode:"Painted colonies",atmoBAmount:81,
  substrateMode:"Nutrient rivers",substrateAmount:94,
  substrateScale:63,substratePressure:88,
  selectionMode:"Nutrient matching",selectionPressure:91,
  geneAmount:95,
  sporeMode:"Windborne",sporeAmount:90,
  sporeReach:65,sporeFertility:91,
  apocalypseMode:"Acid monsoon",apocalypseAmount:87,
  apocalypsePressure:81,apocalypseEpoch:3,
  fossilMode:"Ancestral compost",fossilAmount:91,
  fossilDepth:95,fossilBurial:77,
  habitatStamps:[
    {id:"A0",x:.17,y:.28,radius:.22,parent:0,gene:10,generation:0},
    {id:"B1",x:.33,y:.46,radius:.19,parent:1,gene:90,generation:1,ancestor:"B-elder"},
    {id:"A2",x:.49,y:.61,radius:.23,parent:0,gene:50,generation:1,ancestor:"A0"},
    {id:"B3",x:.67,y:.74,radius:.21,parent:1,gene:73,generation:2,ancestor:"B1"},
    {id:"A4",x:.79,y:.32,radius:.19,parent:0,gene:30,generation:0},
    {id:"B5",x:.59,y:.24,radius:.17,parent:1,gene:62,generation:0},
  ],
};
const fossilized=archiveFossils(populated);
const sampleHistory={...fossilized,fossilMode:"Ancestral compost",
  fossilDepth:95,fossilAmount:91};

test("all old recipes have empty, invisible fossil archives and retain old paint",()=>{
  assert.equal(MAX_FOSSILS,8);
  assert.deepEqual(fossilModes,[
    "Dormant","Ancestral compost","Toxic reliquary","Opal reliquary",
    "Ghost mycelium","Stratigraphic mirror"]);
  assert.equal(initial.fossilMode,"Dormant");
  assert.equal(initial.fossilAmount,0);
  assert.deepEqual(initial.fossilRecords,[]);
  assert.equal(fossilEnabled(initial),false);
  for(const key of fossilControls)assert.deepEqual(numericRanges[key],[0,100],key);
  const prior=looks.find(x=>x.family==="Apocalypse Clock").state;
  const old={...prior};
  for(const key of ["fossilMode","fossilRecords",...fossilControls])delete old[key];
  const restored=validateRecipe(old);
  for(const key of ["fossilMode","fossilRecords",...fossilControls])
    assert.deepEqual(restored[key],initial[key],key);
  assert.deepEqual(restored.habitatStamps,prior.habitatStamps);
  assert.deepEqual(restored.colors,prior.colors);
  assert.equal(restored.lettering,prior.lettering);
});

test("burial preserves every living organism, gene and text while saving actual ancestors",()=>{
  assert.ok(fossilized.fossilRecords.length>=2);
  assert.ok(fossilized.fossilRecords.length<=MAX_FOSSILS);
  assert.deepEqual(fossilized.habitatStamps,populated.habitatStamps);
  assert.deepEqual(fossilized.colors,populated.colors);
  assert.equal(fossilized.lettering,populated.lettering);
  assert.equal(fossilized.apocalypseEpoch,populated.apocalypseEpoch);
  for(const record of fossilized.fossilRecords){
    const parent=populated.habitatStamps.find(x=>x.id===record.origin);
    assert.ok(parent);
    assert.equal(record.x,parent.x);
    assert.equal(record.y,parent.y);
    assert.equal(record.radius,parent.radius);
    assert.equal(record.parent,parent.parent);
    assert.equal(record.gene,parent.gene);
    assert.equal(record.epoch,populated.apocalypseEpoch);
  }
  assert.ok(fossilized.fossilRecords.some(x=>x.parent===0));
  assert.ok(fossilized.fossilRecords.some(x=>x.parent===1));
  assert.deepEqual(validateRecipe(fossilized),fossilized);
  assert.deepEqual(parseDocument(recipeDocument(fossilized,
    "buried civilisations",{time:4,colorTime:8})).state,fossilized);
});

test("archive never duplicates an ancestor in one epoch; later epochs create distinct layers",()=>{
  const original=archiveFossils(populated);
  const again=archiveFossils(original);
  assert.ok(again.fossilRecords.length>=original.fossilRecords.length);
  const third=archiveFossils(again);
  assert.deepEqual(third,again);
  assert.equal(new Set(third.fossilRecords.map(x=>x.id)).size,
    third.fossilRecords.length);
  const next=archiveAndAdvance(original);
  assert.equal(next.apocalypseEpoch,populated.apocalypseEpoch+1);
  assert.deepEqual(next.habitatStamps,populated.habitatStamps);
  assert.deepEqual(next.colors,populated.colors);
  assert.deepEqual(validateRecipe(next),next);
  const after=archiveFossils(next);
  assert.ok(after.fossilRecords.length<=MAX_FOSSILS);
  assert.ok(after.fossilRecords.some(x=>x.epoch===next.apocalypseEpoch));
  assert.deepEqual(parseDocument(recipeDocument(after,
    "geological stack",{time:2,colorTime:7})).state,after);
  const maxed={...populated,apocalypseEpoch:4095};
  assert.equal(archiveAndAdvance(maxed),maxed);
  const empty={...populated,habitatStamps:[]};
  assert.equal(archiveFossils(empty),empty);
  assert.equal(archiveAndAdvance(empty),empty);
  // Already-archived organisms still allow geological time to pass.
  const already=archiveAndAdvance(third);
  assert.equal(already.apocalypseEpoch,third.apocalypseEpoch+1);
  assert.deepEqual(already.fossilRecords,third.fossilRecords);
  const full={...third,fossilRecords:[...third.fossilRecords,
    ...Array.from({length:MAX_FOSSILS-third.fossilRecords.length},(_,i)=>({
      ...third.fossilRecords[0],id:"older-"+i,
    }))]};
  assert.equal(archiveAndAdvance(full).apocalypseEpoch,full.apocalypseEpoch+1);
});

test("hard archive cap of eight does not evict ancient impressions",()=>{
  let state={...populated,fossilBurial:100};
  for(let n=0;n<9;n++){
    state=archiveFossils(state);
    state={...state,apocalypseEpoch:state.apocalypseEpoch+1};
  }
  assert.equal(state.fossilRecords.length,8);
  const originals=state.fossilRecords;
  assert.equal(archiveFossils(state),state);
  assert.deepEqual(state.fossilRecords,originals);
  assert.equal(new Set(originals.map(x=>x.id)).size,8);
});

test("encoded eight-slot GPU marker preserves species, gene and epoch",()=>{
  for(const epoch of [0,1,24,300,4095])
    for(const parent of [0,1])
      for(const gene of [0,13,50,89,100]){
        const record={parent,epoch,gene};
        const packed=packedFossil(record);
        const unpacked=unpackageFossil(packed);
        assert.equal(unpacked.parent,parent);
        assert.equal(unpacked.epoch,epoch);
        assert.equal(unpacked.gene,gene);
        assert.ok(Number.isFinite(packed));
      }
  assert.match(fossilGLSL,/uniform vec4 fossilStamps\[8\]/);
  assert.match(fossilGLSL,/float fossilResource\(vec2 uv,float base\)/);
  assert.match(fossilGLSL,/float fossilTrace=0\./);
  assert.doesNotMatch(fossilGLSL,/sampler|texture2D|discard|uint\b/);
});

test("five fossil chemistries alter REAL finite, deterministic nutrients",()=>{
  for(const mode of fossilModes.slice(1)){
    const state={...sampleHistory,fossilMode:mode};
    assert.ok(fossilEnabled(state));
    const baseState=hideFossils(state);
    let changed=0;
    for(let i=0;i<35;i++){
      const x=(i*.159)%1,y=(i*.277)%1;
      const original=substrateResourceAt(baseState,x,y);
      const resource=substrateResourceAt(state,x,y);
      assert.ok(Number.isFinite(resource)&&resource>=0&&resource<=1);
      assert.equal(resource,substrateResourceAt(state,x,y));
      assert.equal(substrateResourceAt(baseState,x,y),original);
      if(Math.abs(resource-original)>1e-8)changed++;
    }
    assert.ok(changed>0,mode+" must alter at least some actual mineral nutrient locations");
    assert.deepEqual(validateRecipe(state),state);
  }
});

test("earlier DNA and burial age determine fossil nutrient inheritance",()=>{
  const record=sampleHistory.fossilRecords[0];
  const source=substrateResourceAt(hideFossils(sampleHistory),record.x,record.y);
  const younger={...sampleHistory,apocalypseEpoch:record.epoch};
  const older={...sampleHistory,apocalypseEpoch:record.epoch+8};
  const young=substrateResourceAt(younger,record.x,record.y);
  const old=substrateResourceAt(older,record.x,record.y);
  // Compare against each epoch's own baseline because climate can change.
  const youngOriginal=substrateResourceAt(hideFossils(younger),record.x,record.y);
  const oldOriginal=substrateResourceAt(hideFossils(older),record.x,record.y);
  assert.ok(Math.abs(young-youngOriginal)>=Math.abs(old-oldOriginal)-.005);
  const geneA={...sampleHistory,fossilMode:"Opal reliquary",
    fossilRecords:[{...record,gene:0}]};
  const geneB={...geneA,fossilRecords:[{...record,gene:100}]};
  assert.ok(substrateResourceAt(geneB,record.x,record.y)>
    substrateResourceAt(geneA,record.x,record.y));
  assert.ok(fossilRadiusWeight(sampleHistory,record,record.x,record.y)>.99);
  assert.equal(fossilRadiusWeight(sampleHistory,record,0,1),0);
  assert.ok(Number.isFinite(source));
});

test("fossil memory changes which descendants are adapted and where spores land",()=>{
  const rich={...sampleHistory,fossilMode:"Opal reliquary",
    fossilDepth:100,fossilAmount:100};
  const bare=hideFossils(rich);
  const scores1=rankSelection(rich).map(s=>s.fitness);
  const scores2=rankSelection(bare).map(s=>s.fitness);
  assert.ok(scores1.some((n,i)=>Math.abs(n-scores2[i])>1e-8));
  let shifted=0;
  for(let i=0;i<rich.habitatStamps.length;i++){
    const first=daughterSite(rich,i),second=daughterSite(bare,i);
    if(Math.hypot(first.x-second.x,first.y-second.y)>1e-8)shifted++;
  }
  // Different nutrient fields can have the same local optimum by chance.
  // Scan multiple distinct chemical worlds to verify a real changed choice.
  if(shifted===0){
    for(const mode of fossilModes.slice(1)){
      const variant={...rich,fossilMode:mode};
      for(let i=0;i<variant.habitatStamps.length;i++){
        const first=daughterSite(variant,i),second=daughterSite(bare,i);
        if(Math.hypot(first.x-second.x,first.y-second.y)>1e-8)shifted++;
      }
    }
  }
  assert.ok(shifted>0,"some fossil chemistry must choose a different offspring landing");
  const baby=evolveSporeGeneration(rich);
  assert.ok(baby.habitatStamps.length>rich.habitatStamps.length);
  assert.deepEqual(baby.fossilRecords,rich.fossilRecords);
  assert.deepEqual(parseDocument(recipeDocument(baby,"fossil children",
    {time:3,colorTime:4})).state,baby);
});

test("preset, random and reversible controls preserve artist content",()=>{
  assert.equal(fossilPresets.length,5);
  for(const p of fossilPresets){
    const s=applyFossilPreset(sampleHistory,p.name);
    assert.equal(s.fossilMode,p.fossilMode);
    assert.equal(s.fossilAmount,p.fossilAmount);
    assert.deepEqual(s.habitatStamps,sampleHistory.habitatStamps);
    assert.deepEqual(s.fossilRecords,sampleHistory.fossilRecords);
    assert.equal(s.lettering,sampleHistory.lettering);
    assert.deepEqual(validateRecipe(s),s);
  }
  assert.equal(applyFossilPreset(sampleHistory,"a nonexisting specimen"),
    sampleHistory);
  for(const n of [0,.13,.34,.52,.79,.99]){
    const s=shuffleFossils(sampleHistory,()=>n);
    assert.ok(fossilEnabled(s));
    assert.deepEqual(s.habitatStamps,sampleHistory.habitatStamps);
    assert.deepEqual(s.fossilRecords,sampleHistory.fossilRecords);
    assert.deepEqual(s.colors,sampleHistory.colors);
    assert.deepEqual(validateRecipe(s),s);
  }
  assert.equal(hideFossils(sampleHistory).fossilAmount,0);
  assert.deepEqual(clearFossilArchive(sampleHistory).habitatStamps,
    sampleHistory.habitatStamps);
  assert.deepEqual(clearFossilArchive(sampleHistory).fossilRecords,[]);
});

test("bad fossils and numeric controls are rejected without silently truncating records",()=>{
  const first=sampleHistory.fossilRecords[0];
  for(const bad of [
    {...first,id:""}, {...first,origin:""},
    {...first,x:-1},{...first,y:2},{...first,radius:.01},
    {...first,parent:2},{...first,epoch:-1},{...first,epoch:4096},
    {...first,gene:101},{...first,gene:2.2},{...first,gene:NaN},
  ])assert.throws(()=>validateRecipe({...sampleHistory,fossilRecords:[bad]}));
  assert.throws(()=>validateRecipe({...sampleHistory,
    fossilRecords:Array.from({length:9},(_,i)=>({...first,id:"r"+i}))}));
  assert.throws(()=>validateRecipe({...sampleHistory,
    fossilRecords:[first,{...first}]}));
  assert.throws(()=>validateRecipe({...sampleHistory,
    fossilMode:"Haunted IRS"}));
  for(const key of fossilControls){
    assert.throws(()=>validateRecipe({...sampleHistory,[key]:101}));
    assert.throws(()=>validateRecipe({...sampleHistory,[key]:NaN}));
  }
});

test("smart shuffle creates optional fossils but heavy-off Freakshow is safe",()=>{
  for(const n of [0,.09,.2,.39,.51,.75,.92,.99]){
    const world=shuffleEcosystem(base,()=>n);
    assert.deepEqual(validateRecipe(world),world);
    if(world.fossilAmount>0){
      assert.ok(fossilEnabled(world));
      assert.ok(world.fossilRecords.length>0);
      assert.ok(world.fossilRecords.length<=MAX_FOSSILS);
    }
    const light=fullWeirdShuffle(base,()=>n,{allowHeavy:false});
    assert.equal(light.fossilAmount,0);
    assert.deepEqual(light.fossilRecords,[]);
    assert.deepEqual(validateRecipe(light),light);
  }
  assert.equal(randomize(base,{},true,()=>.79).fossilAmount,0);
  assert.deepEqual(validateRecipe(randomize(base,{},false,()=>.4)),
    randomize(base,{},false,()=>.4));
});

test("all 157 Lookbook worlds serialize exactly, including real ancestral fossils",()=>{
  assert.equal(looks.length,157);
  assert.equal(new Set(looks.map(x=>x.name)).size,157);
  const history=looks.filter(x=>x.family==="Fossil Record");
  assert.equal(history.length,5);
  for(const look of looks){
    assert.deepEqual(validateRecipe(look.state),look.state,look.name);
    assert.deepEqual(parseDocument(recipeDocument(look.state,look.name,
      {time:7,colorTime:11})).state,look.state,look.name);
  }
  for(const look of history){
    const s=look.state;
    assert.ok(fossilEnabled(s),look.name);
    assert.ok(s.fossilRecords.length>=4);
    assert.ok(s.fossilRecords.length<=MAX_FOSSILS);
    assert.ok(s.fossilRecords.every(r=>Number.isInteger(r.gene)));
    assert.ok(s.fossilRecords.every(r=>r.epoch<s.apocalypseEpoch));
    assert.ok(s.fossilRecords.every(r=>s.habitatStamps.some(m=>m.id===r.origin)));
  }
});

test("renderer geology hook is opt-in, before selection and compatible with export",()=>{
  const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
  const ui=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
  assert.match(renderer,/withFossil = fossilEnabled\(s\)/);
  assert.match(renderer,/withFossil\?fossilGLSL:""/);
  assert.match(renderer,/withFossil \? "fossils" : "no-fossils"/);
  assert.match(renderer,/withFossil\?"fossilResource\(uv,":""/);
  assert.match(renderer,/withFossil\?"col=shadeFossilRelics\(col,uv\);":""/);
  assert.match(renderer,/fossilBuffer = new Float32Array\(32\)/);
  assert.match(renderer,/packedFossil\(m\)/);
  assert.match(renderer,/fossilUnavailable = false/);
  assert.match(renderer,/if\(fossilEnabled\(candidate\)&&!fossilUnavailable\)/);
  assert.match(renderer,/fossilUnavailable \? \{fossilAmount:0\}/);
  assert.match(renderer,/daughterSite\(s,i\)/);
  assert.match(renderer,/gl\.uniform4fv\(loc\("fossilStamps\[0\]"\),fossilBuffer\)/);
  assert.match(substrateGLSL,/\/\* FOSSIL_RESOURCE \*\/ \/\* APOCALYPSE_RESOURCE \*\/n \/\* FOSSIL_RESOURCE_END \*\//);
  assert.match(fossilGLSL,/uniform vec4 fossilStamps\[8\]/);
  assert.match(fossilGLSL,/vec3 shadeFossilRelics/);
  assert.doesNotMatch(fossilGLSL,/sampler|texture2D|discard|uint\b/);
  for(const key of fossilControls)assert.ok(ui.includes('name="'+key+'"'),key);
  for(const name of ["Summon fossils","Shuffle ancient chemistry",
    "Archive this generation","Bury and advance epoch",
    "Hide fossils","Clear fossil archive"])
    assert.ok(ui.includes(name),name);
  assert.ok(ui.includes("window.confirm"));
  assert.equal(sectionMeta("fossil-record").group,"Scene");
  assert.equal(sectionActive(sectionMeta("fossil-record"),initial),false);
  assert.equal(findControls("opal necropolis")[0].id,"fossil-record");
});
