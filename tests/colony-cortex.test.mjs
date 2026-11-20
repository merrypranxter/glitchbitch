import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { initial,looks,numericRanges,validateRecipe,randomize,
  parseDocument,recipeDocument } from "../src/data.js";
import { colonyCortexModes,colonyCortexControls,colonyCortexPresets,
  colonyCortexGLSL,applyColonyCortexPreset,clearColonyCortex,
  shuffleColonyCortex } from "../src/colony-cortex.js";
import { habitatGLSL } from "../src/atmosphere-habitats.js";
import { shuffleEcosystem,fullWeirdShuffle } from "../src/ecosystem-randomizer.js";
import { sectionMeta,sectionActive,findControls } from "../src/ui-index.js";

const painted=looks.find(l=>l.family==="Painted Habitats").state;
const base={...initial,engine:18,seed:731290,
  palette:-1,colors:["#ff00aa","#00ffff","#faff00"],
  lettering:"NOTHING EATS MY WORDS"};
test("bare cortex is a completely opt-in migration for old painted artworks",()=>{
  assert.deepEqual(colonyCortexModes,[
    "Bare cortex","Growth bands","Hyphal veins","Fruiting cups","Living cortex"]);
  assert.equal(initial.colonyCortexA,"Bare cortex");
  assert.equal(initial.colonyCortexB,"Bare cortex");
  assert.equal(initial.colonyCortexAmount,0);
  const old={...painted};
  for(const key of [...colonyCortexControls,"colonyCortexA","colonyCortexB"])
    delete old[key];
  const restored=validateRecipe(old);
  for(const key of [...colonyCortexControls,"colonyCortexA","colonyCortexB"])
    assert.deepEqual(restored[key],initial[key],key);
  for(const key of ["marks","habitatStamps","engine","seed","colors",
    "colonyLifeMode","atmoMaskMode","atmoBMaskMode"])
    assert.deepEqual(restored[key],painted[key],key);
});
test("manual cortex choices and all four presets keep every original seed, word and palette",()=>{
  assert.equal(colonyCortexPresets.length,4);
  for(const key of colonyCortexControls)
    assert.deepEqual(numericRanges[key],[0,100],key);
  for(const preset of colonyCortexPresets){
    const next=applyColonyCortexPreset(painted,preset.name);
    assert.ok(next.colonyCortexAmount>0);
    assert.ok(colonyCortexModes.includes(next.colonyCortexA));
    assert.ok(colonyCortexModes.includes(next.colonyCortexB));
    for(const key of ["engine","seed","ratio","lettering","marks",
      "habitatStamps","colors","atmoMode","atmoBMode","colonyLifeMode"])
      assert.deepEqual(next[key],painted[key],key);
    assert.deepEqual(validateRecipe(next),next);
  }
  assert.equal(applyColonyCortexPreset(painted,"No such preset"),painted);
});
test("shuffling tissue changes only cortex fields and keeps A/B choices distinct",()=>{
  for(const x of [0,.12,.31,.51,.77,.99]){
    const next=shuffleColonyCortex(painted,()=>x);
    assert.notEqual(next.colonyCortexA,"Bare cortex");
    assert.notEqual(next.colonyCortexB,"Bare cortex");
    assert.notEqual(next.colonyCortexA,next.colonyCortexB);
    assert.ok(next.colonyCortexAmount>=64);
    assert.deepEqual(next.habitatStamps,painted.habitatStamps);
    assert.deepEqual(next.colors,painted.colors);
    assert.deepEqual(next.marks,painted.marks);
    assert.deepEqual(validateRecipe(next),next);
  }
  const hidden=clearColonyCortex(shuffleColonyCortex(painted,()=>.43));
  assert.equal(hidden.colonyCortexAmount,0);
  assert.deepEqual(hidden.habitatStamps,painted.habitatStamps);
});
test("Surprise and Freakshow can invent living cortex without waking dormant Mutate",()=>{
  for(const x of [0,.08,.17,.28,.41,.56,.74,.91,.99]){
    const eco=shuffleEcosystem(base,()=>x);
    const full=fullWeirdShuffle(base,()=>x);
    for(const s of [eco,full]){
      assert.deepEqual(validateRecipe(s),s);
      if(s.colonyCortexAmount>0){
        assert.ok(s.habitatStamps.length>0);
        assert.ok(s.atmoMaskMode==="Painted colonies"||
          s.atmoBMaskMode==="Painted colonies");
      }
    }
    assert.deepEqual(full.colors,base.colors);
    assert.equal(full.lettering,base.lettering);
  }
  const mutation=randomize(base,{},true,()=>.81);
  assert.equal(mutation.colonyCortexAmount,0);
  const surprise=randomize(base,{},false,()=>.37);
  assert.deepEqual(validateRecipe(surprise),surprise);
  if(surprise.colonyCortexAmount>0)
    assert.ok(surprise.habitatStamps.length>0);
});
test("unknown cortex modes and invalid numbers cannot enter the WebGL renderer",()=>{
  for(const [key,value] of [
    ["colonyCortexA","Fungus from Mars"],["colonyCortexB","Extruded teeth"],
    ["colonyCortexAmount",101],["colonyCortexDetail",-1],
    ["colonyCortexMotion",NaN],["colonyCortexRelief",Infinity]
  ])assert.throws(()=>validateRecipe({...base,[key]:value}),undefined,key);
});
test("all 147 Lookbook artworks including the four new cortex specimens survive JSON",()=>{
  assert.equal(looks.length,147);
  assert.equal(new Set(looks.map(l=>l.name)).size,147);
  const cortex=looks.filter(l=>l.family==="Living Cortex");
  assert.equal(cortex.length,4);
  for(const look of looks){
    assert.deepEqual(validateRecipe(look.state),look.state,look.name);
    assert.deepEqual(parseDocument(recipeDocument(look.state,look.name,
      {time:7,colorTime:11})).state,look.state,look.name);
  }
  for(const look of cortex){
    const s=look.state;
    assert.equal(s.atmoMaskMode,"Painted colonies");
    assert.equal(s.atmoBMaskMode,"Painted colonies");
    assert.ok(s.habitatStamps.some(x=>x.parent===0));
    assert.ok(s.habitatStamps.some(x=>x.parent===1));
    assert.ok(s.colonyCortexAmount>=90);
  }
});
test("Cortex shaders reuse seed search and do not require new textures or GPU memory",()=>{
  const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
  const ui=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
  for(const marker of ["uniform int colonyCortexA,colonyCortexB",
    "colonyCortexFieldA","colonyCortexFieldB","float band=",
    "float spokes=","float radialBelt=","vec3 tintColonyCortex"])
    assert.ok(colonyCortexGLSL.includes(marker),marker);
  assert.ok(habitatGLSL.includes("/* CORTEX_MODULE */"));
  assert.ok(habitatGLSL.includes("/* CORTEX_SAMPLE */"));
  assert.match(renderer,/colonyCortexSample\(cortexCell,angle,cortexRadial,index,parent\)/);
  assert.match(renderer,/colonyCortexFieldA=max/);
  assert.match(renderer,/colonyCortexFieldB=max/);
  assert.match(renderer,/withCortex = s\.colonyCortexAmount>0/);
  assert.match(renderer,/withCortex \? colonyCortexGLSL : ""/);
  assert.match(renderer,/withCortex \? "cortex" : "no-cortex"/);
  assert.doesNotMatch(colonyCortexGLSL,/sampler|texture2D|uint\b|discard/);
  assert.match(renderer,/colonyCortexModes\.indexOf\(s\.colonyCortexA\)/);
  assert.match(renderer,/colonyCortexModes\.indexOf\(s\.colonyCortexB\)/);
  assert.match(renderer,/colonyCortexAmount","colonyCortexDetail"/);
  assert.match(renderer,/tintColonyCortex\(col,atmoAMask,colonyCortexFieldA/);
  assert.match(renderer,/tintColonyCortex\(col,atmoBMask,colonyCortexFieldB/);
  for(const key of colonyCortexControls)
    assert.ok(ui.includes('name="'+key+'"'),key);
  assert.ok(ui.includes("Spawn cortex pair"));
  assert.ok(ui.includes("Shuffle cortex"));
  assert.equal(sectionMeta("colony-cortex").group,"Scene");
  assert.equal(sectionActive(sectionMeta("colony-cortex"),initial),false);
  assert.equal(sectionActive(sectionMeta("colony-cortex"),
    {...initial,colonyCortexAmount:85}),true);
  assert.equal(findControls("growth rings")[0].id,"colony-cortex");
});
