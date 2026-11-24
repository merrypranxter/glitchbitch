import test from "node:test";
import assert from "node:assert/strict";
import {initial,validateRecipe} from "../src/data.js";
import {shuffleLivingWorld,remixLivingSystem,livingRemixGroups,livingRemixDisabled} from "../src/ecosystem-randomizer.js";
const rng=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const state=shuffleLivingWorld({...initial,ratio:"9:16",lettering:"KEEP THIS"},rng(80));
const positions=s=>s.habitatStamps.map(({id,x,y,parent})=>({id,x,y,parent}));
test("each focused remix is deterministic, bounded, non-destructive and recipe-valid",()=>{
 for(const group of livingRemixGroups)for(const advance of [false,true]){
  const original=structuredClone(state);
  const a=remixLivingSystem(state,group.id,rng(66),{advance});
  const b=remixLivingSystem(state,group.id,rng(66),{advance});
  assert.deepEqual(a,b,group.id);
  assert.deepEqual(state,original);
  assert.doesNotThrow(()=>validateRecipe(a));
  for(const key of ["engine","seed","ratio","colors","palette","lettering","marks","filamentAmount"])assert.deepEqual(a[key],state[key],key);
  for(const pos of positions(state))assert.deepEqual(positions(a).find(p=>p.id===pos.id),pos,group.id);
  assert.ok(a.habitatStamps.length<=16);
  if(group.id!=="history"){assert.deepEqual(a.fossilRecords,state.fossilRecords);assert.deepEqual(a.successionRecords,state.successionRecords);}
  if(group.id!=="feeding")assert.equal(a.foodWebRound,state.foodWebRound);
  if(group.id!=="adaptation")assert.equal(a.coevoRound,state.coevoRound);
  if(group.id!=="climate"||!advance)assert.equal(a.apocalypseEpoch,state.apocalypseEpoch);
 }
});
test("settings-only feeding and adaptation preserve the ecological ledger and positions",()=>{
 for(const id of ["feeding","adaptation"]){
  const next=remixLivingSystem(state,id,rng(10));
  assert.deepEqual(next.habitatStamps,state.habitatStamps);
  assert.equal(next.foodWebRound,state.foodWebRound);
  assert.equal(next.coevoRound,state.coevoRound);
 }
});
test("empty worlds and dual-parent restriction have explicit guardrails",()=>{
 const empty={...initial,habitatStamps:[]};
 assert.ok(livingRemixDisabled(empty,"feeding"));
 assert.equal(remixLivingSystem(empty,"feeding",rng(10)),empty);
 assert.ok(livingRemixDisabled(state,"symbiosis",{allowDual:false}));
 assert.equal(remixLivingSystem(state,"symbiosis",rng(10),{allowDual:false}),state);
});
