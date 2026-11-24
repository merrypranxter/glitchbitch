import test from "node:test";
import assert from "node:assert/strict";
import {initial,validateRecipe,recipeDocument,parseDocument} from "../src/data.js";
import {colonyAnatomyModes,colonyPoreModes,shuffleColonyAnatomy,colonyAnatomyGLSL} from "../src/colony-anatomy.js";
import {colonyCortexModes,shuffleColonyCortex} from "../src/colony-cortex.js";
test("all new shapes and perforations round-trip while preserving older modes",()=>{
 assert.equal(colonyAnatomyModes.length,21);assert.equal(colonyPoreModes.length,12);assert.equal(colonyCortexModes.length,16);
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
 assert.equal(a.colonyShapeA,"Mixed kingdoms");assert.equal(a.colonyPoreMode,"Diatom perforation mix");assert.equal(c.colonyCortexA,"Microbial cytoplasm mix");
 assert.deepEqual(a.habitatStamps,s.habitatStamps);assert.deepEqual(c.habitatStamps,s.habitatStamps);
});
