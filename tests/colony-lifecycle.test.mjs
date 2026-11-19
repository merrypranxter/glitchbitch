import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { initial, looks, numericRanges, validateRecipe,
  recipeDocument, parseDocument, randomize } from "../src/data.js";
import { colonyLifeModes, colonyLifeControls, colonyLifePresets,
  applyColonyLifePreset, stopColonyLife, colonyGrowthMultiplier }
  from "../src/colony-lifecycle.js";
import { habitatGLSL } from "../src/atmosphere-habitats.js";
import { sectionMeta, sectionActive, findControls } from "../src/ui-index.js";

const painted=looks.find(l=>l.family==="Painted Habitats");
test("colony lifecycle is entirely opt-in and old states remain identical",()=>{
  assert.equal(initial.colonyLifeMode,"Still");
  assert.equal(initial.colonyLifeAmount,0);
  assert.equal(initial.colonyFrontGlow,0);
  assert.equal(initial.colonyCompetition,0);
  const old={...painted.state};
  for(const key of [...colonyLifeControls,"colonyLifeMode"])delete old[key];
  const migrated=validateRecipe(old);
  for(const key of [...colonyLifeControls,"colonyLifeMode"])
    assert.deepEqual(migrated[key],initial[key],key);
  for(const key of ["engine","seed","ratio","lettering","colors","marks",
    "habitatStamps","atmoMaskMode","atmoBMaskMode","atmoAmount","atmoBAmount"])
    assert.deepEqual(migrated[key],painted.state[key],key);
});
test("five ecology recipes preserve existing seeds, fonts, palette and engines",()=>{
  assert.equal(colonyLifeModes.length,5);
  assert.equal(colonyLifePresets.length,5);
  const controlNames=["colonyLifeAmount","colonyLifeSpeed",
    "colonyFrontGlow","colonyCompetition"];
  assert.deepEqual(colonyLifeControls,controlNames);
  for(const key of colonyLifeControls)
    assert.deepEqual(numericRanges[key],[0,100],key);
  for(const p of colonyLifePresets){
    assert.ok(colonyLifeModes.includes(p.colonyLifeMode));
    const edited=applyColonyLifePreset(painted.state,p.name);
    for(const key of ["colors","engine","secondaryEngine","marks","lettering",
      "habitatStamps","atmoMode","atmoBMode","atmoMaskMode","atmoBMaskMode"])
      assert.deepEqual(edited[key],painted.state[key],key);
    for(const key of colonyLifeControls){
      assert.equal(edited[key],p[key]);
      assert.ok(p[key]>=0&&p[key]<=100,key);
    }
    const round=parseDocument(recipeDocument(edited,p.name,{time:3,colorTime:7})).state;
    assert.deepEqual(round,edited);
  }
  assert.equal(applyColonyLifePreset(painted.state,"not real"),painted.state);
});
test("stop ecology reverses animation but never removes the planted seeds",()=>{
  const live=applyColonyLifePreset(painted.state,colonyLifePresets[0].name);
  assert.ok(live.colonyLifeAmount>0);
  const stopped=stopColonyLife(live);
  assert.equal(stopped.colonyLifeAmount,0);
  assert.equal(stopped.colonyFrontGlow,0);
  assert.equal(stopped.colonyCompetition,0);
  assert.deepEqual(stopped.habitatStamps,live.habitatStamps);
  assert.deepEqual(stopped.colors,live.colors);
  assert.equal(stopped.colonyLifeMode,live.colonyLifeMode);
  assert.equal(colonyGrowthMultiplier(stopped,32.1,3,0),1);
});
test("all four moving life modes share a mathematically exact continuous period",()=>{
  const period=2*Math.PI/(.2+initial.colonyLifeSpeed/100*1.8);
  for(const mode of colonyLifeModes.slice(1)){
    const state={...initial,colonyLifeMode:mode,colonyLifeAmount:100};
    for(const parent of [0,1])for(const index of [0,2,15])
      for(const t of [0,.17,1.81,13.19]){
        const r1=colonyGrowthMultiplier(state,t,index,parent);
        const r2=colonyGrowthMultiplier(state,t+period,index,parent);
        assert.ok(Number.isFinite(r1)&&r1>.044,mode);
        assert.ok(Math.abs(r1-r2)<1e-10,mode+" cyclical continuity");
      }
  }
  assert.equal(colonyGrowthMultiplier(initial,1.4,7,0),1);
  assert.notEqual(
    colonyGrowthMultiplier({...initial,colonyLifeMode:"Territory war",colonyLifeAmount:100},1.1,2,0),
    colonyGrowthMultiplier({...initial,colonyLifeMode:"Territory war",colonyLifeAmount:100},1.1,2,1));
});
test("invalid ecology data is refused, and Mutate cannot activate dormant life",()=>{
  for(const [key,v] of [
    ["colonyLifeMode","Not an ecosystem"],
    ["colonyLifeAmount",101],["colonyLifeSpeed",-1],
    ["colonyFrontGlow",NaN],["colonyCompetition",Infinity]]){
    assert.throws(()=>validateRecipe({...initial,[key]:v}),undefined,key);
  }
  const preserved=randomize(initial,{},true,()=>.66);
  assert.equal(preserved.colonyLifeAmount,0);
  assert.equal(preserved.colonyFrontGlow,0);
  assert.equal(preserved.colonyCompetition,0);
  assert.equal(preserved.colonyLifeMode,"Still");
  const surprised=randomize(initial,{},false,()=>.53);
  assert.doesNotThrow(()=>validateRecipe(surprised));
  // New smart Surprise is ALLOWED to awaken ecology; Mutate above cannot.
  if(surprised.colonyLifeAmount>0){
    assert.ok(surprised.habitatStamps.length>0);
    assert.ok(surprised.atmoAmount>0);
  }
});
test("four live Colony Wars looks are unique, valid and preserve touch control",()=>{
  assert.equal(looks.length,118);
  const wars=looks.filter(l=>l.family==="Colony Wars");
  assert.equal(wars.length,4);
  assert.equal(new Set(wars.map(w=>w.name)).size,4);
  for(const look of wars){
    const s=look.state;
    assert.ok(s.habitatStamps.length>=4);
    assert.equal(s.atmoMaskMode,"Painted colonies");
    assert.ok(s.colonyLifeAmount>0);
    assert.ok(s.colonyFrontGlow>0);
    assert.ok(s.atmoAmount>0);
    assert.ok(s.atmoBAmount>0);
    assert.deepEqual(validateRecipe(s),s);
  }
});
test("shared renderer grows masks before compositing both parents with palette edges",()=>{
  const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
  const ui=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
  assert.match(habitatGLSL,/uniform int colonyLifeMode/);
  assert.match(habitatGLSL,/float lifeTime=time\*/);
  assert.match(habitatGLSL,/colonyLifeMode==1/);
  assert.match(habitatGLSL,/colonyLifeMode==4/);
  assert.match(renderer,/colonyLifeModes\.indexOf\(s\.colonyLifeMode\)/);
  assert.match(renderer,/float atmoAMask=/);
  assert.match(renderer,/maskedA\?"atmosphereMaskForA\(uv\)"/);
  assert.match(renderer,/float atmoBMask=/);
  assert.match(renderer,/maskedB\?"atmosphereMaskForB\(uv\)"/);
  assert.match(renderer,/float pressure=\.22\*sin/);
  assert.match(renderer,/vec3 atmoChild=livingMutantAtmosphereB/);
  assert.match(renderer,/palette\(atmoHue\+colorTime/);
  assert.match(renderer,/palette\(atmoBHue\+\.28\+colorTime/);
  assert.match(renderer,/colonyLifeAmount","colonyLifeSpeed"/);
  assert.match(ui,/COLONY WARS/);
  for(const key of colonyLifeControls)
    assert.ok(ui.includes('name="'+key+'"'),key);
  assert.equal(sectionMeta("colony-life").group,"Scene");
  assert.equal(sectionActive(sectionMeta("colony-life"),initial),false);
  assert.equal(sectionActive(sectionMeta("colony-life"),{
    ...initial,colonyLifeAmount:90}),true);
  assert.equal(findControls("colony wars")[0].id,"colony-life");
});
