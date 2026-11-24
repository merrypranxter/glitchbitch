import test from "node:test";
import assert from "node:assert/strict";
import {initial,validateRecipe} from "../src/data.js";
import {shuffleLivingWorld} from "../src/ecosystem-randomizer.js";
import {advanceLivingTimeline,ecosystemCensus,evolutionRhythms} from "../src/ecosystem-timeline.js";
const rng=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
test("timeline is deterministic, bounded and preserves original positions and artwork",()=>{
 for(const rhythm of evolutionRhythms)for(const allowDual of [true,false]){
  const before=shuffleLivingWorld({...initial,ratio:"9:16"},rng(50),{allowDual});
  const snapshot=structuredClone(before);
  const next=advanceLivingTimeline(before,rng(25),{steps:12,rhythm});
  assert.deepEqual(next,advanceLivingTimeline(before,rng(25),{steps:12,rhythm}));
  assert.deepEqual(before,snapshot);
  assert.doesNotThrow(()=>validateRecipe(next));
  for(const k of ["engine","seed","palette","colors","lettering","marks","ratio","atmoMode","atmoBMode"])assert.deepEqual(next[k],before[k]);
  for(const m of before.habitatStamps){const n=next.habitatStamps.find(x=>x.id===m.id);assert.ok(n);assert.deepEqual([n.x,n.y,n.parent],[m.x,m.y,m.parent]);}
  assert.ok(next.habitatStamps.length<=16);
  if(!allowDual)assert.ok(next.habitatStamps.every(m=>m.parent===0));
  const a=ecosystemCensus(before),b=ecosystemCensus(next);
  for(const k of ["feeding","adaptation","generations","climate","soil","fossils"])assert.ok(b[k]>=a[k]);
 }
});
test("disabled modules stay dormant; invalid steps and empty worlds are no-ops",()=>{
 assert.equal(advanceLivingTimeline(initial,rng(1),{steps:12}),initial);
 const world=shuffleLivingWorld(initial,rng(9));
 assert.equal(advanceLivingTimeline(world,rng(1),{steps:13}),world);
 const off={...world,foodWebAmount:0,geneAmount:0,selectionPressure:0,sporeAmount:0,apocalypseAmount:0,successionAmount:0,fossilAmount:0};
 assert.equal(advanceLivingTimeline(off,()=>0,{steps:12}),off);
});
