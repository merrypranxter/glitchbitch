import test from "node:test";
import assert from "node:assert/strict";
import {initial,validateRecipe} from "../src/data.js";
import {weavingRemixGroups,remixWeavingSystem,shuffleWeavingWorld} from "../src/weaving-randomizer.js";
import {entriesForScope,isWeavingEntry,isEcosystemEntry} from "../src/effects-navigation.js";
const rng=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const isTextile=k=>/^(filament|underlay|semanticGravity|vld|hcr)/.test(k)||["velvetMode","crochetMode"].includes(k);
const state={...initial,filamentAmount:90,lettering:"test",letteringAmount:90};
function check(next){assert.doesNotThrow(()=>validateRecipe(next));for(const k of Object.keys(state).filter(k=>!isTextile(k)))assert.deepEqual(next[k],state[k],k);}
test("full weave randomizer is deterministic, bounded and unrelated artwork is intact",()=>{
 for(let seed=1;seed<=30;seed++)for(const allowHeavy of [false,true])for(const allowHybrid of [false,true]){
  const opts={allowHeavy,allowHybrid};const s=shuffleWeavingWorld(state,rng(seed),opts);
  check(s);assert.deepEqual(s,shuffleWeavingWorld(state,rng(seed),opts));
  assert.ok(s.filamentAmount>0&&s.filamentAdornmentAmount>0&&s.filamentStitchAmount>0);
  if(!allowHybrid)assert.equal(s.filamentCrossbreed,0);
  if(s.hcrAmount>0)assert.ok(s.hcrQuality<=48);
  if(s.filamentRegenAmount>0)assert.ok(s.filamentScarAmount>0&&s.filamentNeuralAmount>0);
 }
});
test("targeted remixes retain art; dress and stitch preserve geometry",()=>{
 for(const g of weavingRemixGroups)check(remixWeavingSystem(state,g.id,rng(13)));
 for(const id of ["dress","fiber","jewelry","optics","stitch","relief"]){
  const next=remixWeavingSystem(state,id,rng(9));assert.equal(next.filamentSpecies,state.filamentSpecies);assert.equal(next.filamentCrossbreed,state.filamentCrossbreed);
 }
 assert.equal(remixWeavingSystem({...state,lettering:"",letteringLayers:[]},"semantic",rng(1)).semanticGravityAmount,0);
});
test("weaving directory is isolated, nested labs follow their parent",()=>{
 for(const id of ["filament","filament-materials","filament-jewelry","filament-stitch","underlay","hyperbolic-crochet","living-velvet"])assert.ok(isWeavingEntry(id));
 assert.ok(entriesForScope("weaving").some(e=>e.id==="filament-jewelry"));
 assert.ok(entriesForScope("weaving").every(e=>!isEcosystemEntry(e.id)));
 assert.ok(entriesForScope("effects").every(e=>!isWeavingEntry(e.id)));
});
