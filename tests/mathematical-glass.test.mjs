import test from "node:test";
import assert from "node:assert/strict";
import {initial,validateRecipe,recipeDocument,parseDocument} from "../src/data.js";
import {schlierenModes,mathematicalGlassModes,mathematicalGlassPresets,mathematicalGlassControls,schlierenFragment,applySchlierenPreset,shuffleMathematicalGlass} from "../src/schlieren-glass.js";
test("new glass modes are additive and every preset round-trips",()=>{
 assert.deepEqual(schlierenModes.slice(0,5),["Molten portholes","Filament glass","Prismatic blossoms","Ruffled organza","Schlieren pockets"]);
 assert.equal(mathematicalGlassModes.length,8);
 for(const preset of mathematicalGlassPresets){
  const next=applySchlierenPreset(initial,preset.name);
  assert.deepEqual(validateRecipe(next),next);
  assert.deepEqual(parseDocument(recipeDocument(next,preset.name,{time:0,colorTime:0})).state,next);
 }
 assert.match(schlierenFragment,/if\(glassMode>=5 && glassStructure/);
 assert.match(schlierenFragment,/displacement\+=gradient/);
 assert.match(schlierenFragment,/mathematicalGlassRelief/);
});
test("focused glass shuffles do not change any unrelated artwork",()=>{
 const state=applySchlierenPreset(initial,mathematicalGlassPresets[0].name);
 for(const part of ["all","motion","interior"]){
  const next=shuffleMathematicalGlass(state,()=>.83,part);
  assert.deepEqual(validateRecipe(next),next);
  for(const k of Object.keys(state).filter(k=>!k.startsWith("schlieren")))assert.deepEqual(next[k],state[k],k);
  if(part==="interior")for(const k of Object.keys(state).filter(k=>!mathematicalGlassControls.includes(k)))assert.deepEqual(next[k],state[k],k);
  if(part==="motion")for(const k of Object.keys(state).filter(k=>!["schlierenMotion","schlierenRipple"].includes(k)))assert.deepEqual(next[k],state[k],k);
 }
});
