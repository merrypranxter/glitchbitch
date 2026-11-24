import test from "node:test";
import assert from "node:assert/strict";
import {initial,validateRecipe,recipeDocument,parseDocument} from "../src/data.js";
import {colonyAnatomyModes,colonyPoreModes,shuffleColonyAnatomy,colonyAnatomyGLSL} from "../src/colony-anatomy.js";
import {colonyCortexModes,shuffleColonyCortex} from "../src/colony-cortex.js";
test("all new shapes and perforations round-trip while preserving older modes",()=>{
 assert.equal(colonyAnatomyModes.length,17);assert.equal(colonyPoreModes.length,10);assert.equal(colonyCortexModes.length,13);
 for(const shape of colonyAnatomyModes)for(const pore of colonyPoreModes){
  const s={...initial,colonyShapeA:shape,colonyPoreMode:pore,colonyPoreSize:72,colonyPoreDensity:33};
  assert.deepEqual(parseDocument(recipeDocument(s,"microbes",{time:0,colorTime:0})).state,s);
 }
 for(const mode of colonyCortexModes)assert.equal(validateRecipe({...initial,colonyCortexA:mode}).colonyCortexA,mode);
 assert.throws(()=>validateRecipe({...initial,colonyPoreMode:"unknown"}));
 assert.throws(()=>validateRecipe({...initial,colonyPoreDensity:101}));
 assert.match(colonyAnatomyGLSL,/microbialPore/);
});
test("shuffles reach expanded forms and preserve the original colony map",()=>{
 const s={...initial,habitatStamps:[{id:"a",x:.4,y:.4,radius:.2,parent:0}]};
 const a=shuffleColonyAnatomy(s,()=>.99),c=shuffleColonyCortex(s,()=>.99);
 assert.equal(a.colonyShapeA,"Squishy amoebae");assert.equal(a.colonyPoreMode,"Silica windows");assert.equal(c.colonyCortexA,"Bacterial granules");
 assert.deepEqual(a.habitatStamps,s.habitatStamps);assert.deepEqual(c.habitatStamps,s.habitatStamps);
});
