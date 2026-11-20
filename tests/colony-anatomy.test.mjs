import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { initial,looks,numericRanges,validateRecipe,randomize,
  recipeDocument,parseDocument } from "../src/data.js";
import { colonyAnatomyModes,colonyAnatomyControls,colonyAnatomyPresets,
  colonyAnatomyGLSL,applyColonyAnatomyPreset,shuffleColonyAnatomy,
  clearColonyAnatomy } from "../src/colony-anatomy.js";
import { shuffleEcosystem,fullWeirdShuffle,ensureValidEcosystemState }
  from "../src/ecosystem-randomizer.js";
import { habitatGLSL } from "../src/atmosphere-habitats.js";
import { sectionMeta,sectionActive,findControls } from "../src/ui-index.js";
const base={...initial,engine:18,seed:691572,ratio:"9:16",
  colors:["#ff008e","#00eaff","#d4ff00"],palette:-1,
  lettering:"DO NOT ERASE MY WEIRD WORDS"};
const planted=looks.find(l=>l.family==="Painted Habitats").state;
test("classic disks remain original default; legacy files gain zero-intensity settings",()=>{
  assert.deepEqual(colonyAnatomyModes,
    ["Classic disks","Lichen lobes","Coral fringe","Crystal petals","Hyphal fans"]);
  assert.equal(initial.colonyShapeA,"Classic disks");
  assert.equal(initial.colonyShapeB,"Classic disks");
  assert.equal(initial.colonyAnatomyAmount,0);
  assert.equal(initial.colonyAnatomyPores,0);
  assert.equal(initial.colonyAnatomyRim,0);
  const legacy={...planted};
  for(const key of [...colonyAnatomyControls,"colonyShapeA","colonyShapeB"])
    delete legacy[key];
  const restored=validateRecipe(legacy);
  for(const key of [...colonyAnatomyControls,"colonyShapeA","colonyShapeB"])
    assert.equal(restored[key],initial[key],key);
  assert.deepEqual(restored.habitatStamps,planted.habitatStamps);
  assert.deepEqual(restored.colors,planted.colors);
});
test("specimen recipes and manual anatomy shuffles never overwrite planted art",()=>{
  assert.equal(colonyAnatomyPresets.length,4);
  for(const key of colonyAnatomyControls)
    assert.deepEqual(numericRanges[key],[0,100],key);
  for(const preset of colonyAnatomyPresets){
    const next=applyColonyAnatomyPreset(planted,preset.name);
    for(const key of ["engine","seed","ratio","marks","lettering","colors",
      "atmoMode","atmoBMode","habitatStamps","colonyLifeMode"])
      assert.deepEqual(next[key],planted[key],key);
    assert.ok(next.colonyAnatomyAmount>0);
    assert.ok(colonyAnatomyModes.includes(next.colonyShapeA));
    assert.ok(colonyAnatomyModes.includes(next.colonyShapeB));
    assert.deepEqual(validateRecipe(next),next);
  }
  assert.equal(applyColonyAnatomyPreset(planted,"Unknown recipe"),planted);
  for(const number of [0,.15,.5,.72,.99]){
    const next=shuffleColonyAnatomy(planted,()=>number);
    assert.notEqual(next.colonyShapeA,"Classic disks");
    assert.notEqual(next.colonyShapeB,"Classic disks");
    assert.notEqual(next.colonyShapeA,next.colonyShapeB);
    assert.deepEqual(next.habitatStamps,planted.habitatStamps);
    assert.deepEqual(next.colors,planted.colors);
    assert.deepEqual(next.marks,planted.marks);
    assert.equal(next.lettering,planted.lettering);
    assert.deepEqual(validateRecipe(next),next);
  }
});
test("restore classical silhouette reverses modification without deleting any seeds",()=>{
  const weird=shuffleColonyAnatomy(planted,()=>.41);
  const original=clearColonyAnatomy(weird);
  for(const key of ["colonyAnatomyAmount","colonyAnatomyPores","colonyAnatomyRim"])
    assert.equal(original[key],0,key);
  assert.deepEqual(original.habitatStamps,planted.habitatStamps);
  assert.deepEqual(original.colors,planted.colors);
  assert.equal(original.colonyShapeA,weird.colonyShapeA);
});
test("shuffles and Surprise mix real morphologies only where planted colonies exist",()=>{
  for(const rand of [0,.1,.25,.44,.63,.79,.99]){
    const s=shuffleEcosystem(base,()=>rand);
    assert.deepEqual(validateRecipe(s),s);
    if(s.colonyAnatomyAmount>0){
      assert.ok(s.atmoMaskMode==="Painted colonies"||
        s.atmoBMaskMode==="Painted colonies");
      assert.ok(s.habitatStamps.length>0);
    }
    const crazy=fullWeirdShuffle(base,()=>rand);
    assert.deepEqual(validateRecipe(crazy),crazy);
    assert.deepEqual(crazy.colors,base.colors);
    assert.equal(crazy.lettering,base.lettering);
  }
  const mutation=randomize(base,{},true,()=>.78);
  assert.equal(mutation.colonyAnatomyAmount,0);
  assert.equal(mutation.colonyAnatomyPores,0);
  assert.equal(mutation.colonyAnatomyRim,0);
  const surprise=randomize(base,{},false,()=>.38);
  assert.deepEqual(validateRecipe(surprise),surprise);
  if(surprise.colonyAnatomyAmount>0)
    assert.ok(surprise.habitatStamps.length>0);
});
test("invalid morphology names and values are refused before WebGL",()=>{
  for(const [key,value] of [
    ["colonyShapeA","Polygon Hell"],["colonyShapeB","Unknown creature"],
    ["colonyAnatomyAmount",101],["colonyAnatomyDetail",-1],
    ["colonyAnatomyPores",NaN],["colonyAnatomyRim",Infinity]
  ])assert.throws(()=>validateRecipe({...base,[key]:value}),undefined,key);
});
test("all 157 Lookbook states, including four new specimens, survive JSON round trip",()=>{
  assert.equal(looks.length,157);
  assert.equal(new Set(looks.map(l=>l.name)).size,157);
  const specimens=looks.filter(l=>l.family==="Mutant Anatomy");
  assert.equal(specimens.length,4);
  for(const look of looks){
    assert.deepEqual(validateRecipe(look.state),look.state,look.name);
    const restored=parseDocument(recipeDocument(look.state,look.name,
      {time:2,colorTime:5})).state;
    assert.deepEqual(restored,look.state,look.name);
  }
  for(const look of specimens){
    const s=look.state;
    assert.equal(s.atmoMaskMode,"Painted colonies");
    assert.equal(s.atmoBMaskMode,"Painted colonies");
    assert.ok(s.habitatStamps.some(m=>m.parent===0));
    assert.ok(s.habitatStamps.some(m=>m.parent===1));
    assert.ok(s.colonyAnatomyAmount>=90);
  }
});
test("shader wiring uses only an optional ES1 analytic silhouette and shared export clock",()=>{
  const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
  const ui=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
  assert.match(colonyAnatomyGLSL,/float mutantColonyRadius/);
  assert.match(colonyAnatomyGLSL,/species==1/);
  assert.match(colonyAnatomyGLSL,/species==2/);
  assert.match(colonyAnatomyGLSL,/species==3/);
  assert.match(habitatGLSL,/if\(colonyAnatomyAmount>\.001\)/);
  assert.match(habitatGLSL,/float pores|float pore/);
  assert.match(habitatGLSL,/mutantColonyRadius\(angle,index,parent\)/);
  assert.doesNotMatch(colonyAnatomyGLSL,/sampler|texture2D|uint\b|discard/);
  assert.match(renderer,/colonyAnatomyModes\.indexOf\(s\.colonyShapeA\)/);
  assert.match(renderer,/colonyAnatomyModes\.indexOf\(s\.colonyShapeB\)/);
  assert.match(renderer,/colonyAnatomyAmount","colonyAnatomyDetail"/);
  assert.match(renderer,/colonyAnatomyRim\*colonyAnatomyAmount/);
  for(const key of colonyAnatomyControls)
    assert.ok(ui.includes('name="'+key+'"'),key);
  assert.ok(ui.includes("Spawn anatomy pair"));
  assert.ok(ui.includes("Shuffle anatomy"));
  assert.equal(sectionMeta("colony-anatomy").group,"Scene");
  assert.equal(sectionActive(sectionMeta("colony-anatomy"),initial),false);
  assert.equal(sectionActive(sectionMeta("colony-anatomy"),
    {...initial,colonyAnatomyAmount:88}),true);
  assert.equal(findControls("coral fringe")[0].id,"colony-anatomy");
});
