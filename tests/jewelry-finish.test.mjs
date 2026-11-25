import test from "node:test";
import assert from "node:assert/strict";
import {initial,validateRecipe,recipeDocument,parseDocument} from "../src/data.js";
import {jewelryFinishModes,jewelryFinishControls,remixJewelryFinish,filamentGLSL} from "../src/filament-forge.js";
import {textileGroup} from "../src/weaving-wardrobe.js";
test("all jewelry finishes round trip with original legacy default",()=>{
 assert.equal(initial.filamentAdornmentFinish,"Original jewelry");
 for(const finish of jewelryFinishModes){
  const s={...initial,filamentAdornmentFinish:finish};
  assert.deepEqual(parseDocument(recipeDocument(s,"jewel finish",{time:0,colorTime:0})).state,s);
 }
 for(const k of jewelryFinishControls)assert.equal(textileGroup(k),"jewelry");
 assert.match(filamentGLSL,/if\(filamentAdornmentFinish>0 && filamentAdornmentFinishAmount/);
 assert.match(filamentGLSL,/float jewelry=collar\*filamentAdornmentAmount\*occupancy/);
});
test("finish-only shuffle preserves thread material, geometry, shape, choreography and all other art",()=>{
 const state={...initial,filamentAdornmentMode:"Diatom valves",filamentAdornmentAmount:90,filamentMaterial:"Iridescent silk"};
 const next=remixJewelryFinish(state,()=>.7);
 assert.doesNotThrow(()=>validateRecipe(next));
 assert.notEqual(next.filamentAdornmentFinish,state.filamentAdornmentFinish);
 for(const k of Object.keys(state).filter(k=>!jewelryFinishControls.includes(k)))assert.deepEqual(next[k],state[k],k);
});
