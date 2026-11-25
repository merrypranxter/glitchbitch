import test from "node:test";
import assert from "node:assert/strict";
import {initial,validateRecipe} from "../src/data.js";
import {weavingLocks,textileGroup,weavingWardrobe,applyWeavingWardrobe,remixWeavingWardrobe,shuffleLockedWeaving} from "../src/weaving-wardrobe.js";
const state={...initial,filamentAmount:91,filamentSpecies:"Feral Jacquard",filamentMaterial:"Molten chrome",filamentCrossbreed:0,lettering:"KEEP"};
const keys=Object.keys(initial);
test("all textile settings have a lock and only textile settings are classified",()=>{
 for(const k of keys)assert.equal(Boolean(textileGroup(k)),/^(filament|underlay|semanticGravity|vld|hcr)/.test(k)||["velvetMode","crochetMode"].includes(k),k);
});
test("outfits use valid existing modes and preserve unrelated artwork",()=>{
 for(const p of weavingWardrobe){
  const s=applyWeavingWardrobe(state,p.name);
  assert.doesNotThrow(()=>validateRecipe(s));
  for(const k of keys.filter(k=>!textileGroup(k)))assert.deepEqual(s[k],state[k],k);
 }
});
test("every lock preserves its state through both outfit and master randomizers",()=>{
 for(const g of weavingLocks){
  for(const s of [applyWeavingWardrobe(state,weavingWardrobe[2].name,[g.id]),remixWeavingWardrobe(state,()=>.6,{locks:[g.id]}),shuffleLockedWeaving(state,()=>.6,{locks:[g.id]})]){
   for(const k of keys.filter(k=>textileGroup(k)===g.id||!textileGroup(k)))assert.deepEqual(s[k],state[k],k);
  }
 }
 assert.deepEqual(shuffleLockedWeaving(state,()=>.6,{locks:weavingLocks.map(g=>g.id)}),state);
});
