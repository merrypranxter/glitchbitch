import test from "node:test";
import assert from "node:assert/strict";
import {initial,validateRecipe,recipeDocument,parseDocument} from "../src/data.js";
import {glassEtchingModes,glassMotionModes,mathematicalGlassModes,shuffleMathematicalGlass,schlierenFragment} from "../src/schlieren-glass.js";
test("all independent etching and motion combinations save and reload",()=>{
 for(const etching of glassEtchingModes)for(const motion of glassMotionModes){
  const state={...initial,schlierenMode:"Gyroid membranes",schlierenAmount:95,schlierenEtching:etching,schlierenKinetics:motion};
  assert.deepEqual(parseDocument(recipeDocument(state,"glass",{time:2,colorTime:5})).state,state);
 }
 assert.throws(()=>validateRecipe({...initial,schlierenEtching:"unknown"}));
 assert.throws(()=>validateRecipe({...initial,schlierenKinetics:"unknown"}));
});
test("architecture shuffle leaves the independent interior and motion untouched",()=>{
 const state={...initial,schlierenMode:mathematicalGlassModes[0],schlierenAmount:91,schlierenEtching:"Schwarz diamond",schlierenKinetics:"Phason shear"};
 const next=shuffleMathematicalGlass(state,()=>.7,"architecture");
 assert.notEqual(next.schlierenMode,state.schlierenMode);
 for(const k of Object.keys(state).filter(k=>k!=="schlierenMode"))assert.deepEqual(next[k],state[k],k);
 assert.match(schlierenFragment,/if\(glassEtching>0\)return interferenceEtching/);
 assert.match(schlierenFragment,/q=opticalKinetics\(q,t\)/);
});
