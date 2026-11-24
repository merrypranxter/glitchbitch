import test from "node:test";
import assert from "node:assert/strict";
import {initial,validateRecipe,recipeDocument,parseDocument} from "../src/data.js";
import {glassMaterialModes,glassMaterialControls,shuffleMathematicalGlass,schlierenFragment,applySchlierenPreset,mathematicalGlassPresets} from "../src/schlieren-glass.js";
test("all optical materials save and reload; legacy defaults remain original",()=>{
 assert.equal(initial.schlierenMaterial,"Original glass");
 for(const mode of glassMaterialModes){
  const state={...initial,schlierenAmount:90,schlierenMode:"Gyroid membranes",schlierenMaterial:mode};
  assert.deepEqual(parseDocument(recipeDocument(state,"glass",{time:2,colorTime:5})).state,state);
 }
 assert.throws(()=>validateRecipe({...initial,schlierenMaterial:"unknown"}));
 assert.throws(()=>validateRecipe({...initial,schlierenFilmThickness:101}));
 assert.match(schlierenFragment,/glassMaterial==0\?0\.:glassMaterialAmount\*localMask/);
 assert.match(schlierenFragment,/glassThinFilm/);
});
test("material shuffle preserves all geometry, coupling, motion and artwork",()=>{
 const state={...initial,schlierenAmount:95,schlierenMaterial:"Polished prism",schlierenMode:"Quasicrystal glass",schlierenCoupling:"Interpenetrating gyroids"};
 const next=shuffleMathematicalGlass(state,()=>.65,"material");
 assert.notEqual(next.schlierenMaterial,state.schlierenMaterial);
 assert.deepEqual(validateRecipe(next),next);
 for(const k of Object.keys(state).filter(k=>!glassMaterialControls.includes(k)))assert.deepEqual(next[k],state[k],k);
 assert.equal(applySchlierenPreset(next,mathematicalGlassPresets[0].name).schlierenMaterial,"Original glass");
});
