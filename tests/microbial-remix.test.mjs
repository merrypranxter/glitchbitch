import test from "node:test";
import assert from "node:assert/strict";
import {initial,validateRecipe} from "../src/data.js";
import {microbialCollections,applyMicrobialCollection,remixMicrobes,microbialVisible} from "../src/microbial-remix.js";
const state={...initial,atmoAmount:90,atmoMaskMode:"Painted colonies",colonyAnatomyAmount:80,colonyAnatomyPores:50,colonyCortexAmount:65,habitatStamps:[{id:"a",x:.3,y:.4,radius:.2,parent:0,gene:50,webEnergy:70},{id:"b",x:.4,y:.4,radius:.2,parent:0,gene:60,webEnergy:30}]};
const groups={shapes:["colonyShapeA","colonyShapeB","colonyAnatomyAmount"],pores:["colonyPoreMode","colonyPoreDensity","colonyPoreSize","colonyAnatomyPores","colonyAnatomyAmount"],tissue:["colonyCortexA","colonyCortexB","colonyCortexAmount"]};
test("isolated shuffles change only their own fields and preserve the exact population",()=>{
 assert.ok(microbialVisible(state));
 for(const [part,keys] of Object.entries(groups)){
  const next=remixMicrobes(state,part,()=>.72);
  assert.notDeepEqual(next,state);
  for(const key of Object.keys(state))if(!keys.includes(key))assert.deepEqual(next[key],state[key],key);
  assert.doesNotThrow(()=>validateRecipe(next));
 }
});
test("mixed collections remain recipe-valid without awakening another parent or mutating colonies",()=>{
 for(const p of microbialCollections){
  const next=applyMicrobialCollection(state,p.name);
  assert.deepEqual(next.habitatStamps,state.habitatStamps);
  assert.equal(next.atmoBAmount,state.atmoBAmount);
  assert.doesNotThrow(()=>validateRecipe(next));
 }
 assert.equal(remixMicrobes(initial,"shapes",()=>.8),initial);
 assert.equal(applyMicrobialCollection(initial,microbialCollections[0].name),initial);
});
