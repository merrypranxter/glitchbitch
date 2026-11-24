import test from "node:test";
import assert from "node:assert/strict";
import {initial,validateRecipe} from "../src/data.js";
import {shuffleLivingWorld} from "../src/ecosystem-randomizer.js";
import {foodWebActive} from "../src/living-food-web.js";
import {entriesForScope,effectEntries,isEcosystemEntry} from "../src/effects-navigation.js";
const rng=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
test("dedicated shuffle creates living connected worlds without changing the base art",()=>{
 for(const allowDual of [true,false])for(let seed=1;seed<=40;seed++){
  const state={...initial,ratio:"9:16",lettering:"KEEP MY WORDS"};
  const result=shuffleLivingWorld(state,rng(seed),{allowDual});
  assert.doesNotThrow(()=>validateRecipe(result));
  assert.deepEqual(result,shuffleLivingWorld(state,rng(seed),{allowDual}));
  for(const key of ["seed","engine","ratio","palette","colors","lettering","marks","filamentAmount"])assert.deepEqual(result[key],state[key],key);
  assert.ok(result.habitatStamps.length>=2&&result.habitatStamps.length<=16);
  assert.ok(foodWebActive(result));
  assert.ok(result.foodWebRound>0);
  assert.ok(result.coevoRound>0);
  if(!allowDual){assert.equal(result.atmoBAmount,0);assert.equal(result.symbiosisAmount,0);assert.ok(result.habitatStamps.every(m=>m.parent===0));}
  else assert.ok(result.symbiosisAmount>0);
 }
});
test("ecosystem and effects directory partition every original control including nested labs",()=>{
 const eco=entriesForScope("ecosystem"),fx=entriesForScope("effects");
 assert.equal(new Set([...eco,...fx].map(e=>e.id)).size,effectEntries.length);
 assert.equal(eco.length+fx.length,effectEntries.length);
 for(const id of ["living-food-web","coevolution-lab","symbiosis-lab","fossil-resurrection","atmosphere-habitats"])assert.ok(isEcosystemEntry(id),id);
 assert.ok(!isEcosystemEntry("filament-neural"));
});
