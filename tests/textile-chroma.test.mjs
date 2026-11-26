import test from "node:test";
import assert from "node:assert/strict";
import {initial,validateRecipe,recipeDocument,parseDocument} from "../src/data.js";
import {textileChromaModes,textileChromaControls,remixTextileChroma,filamentGLSL} from "../src/filament-forge.js";
import {textileGroup} from "../src/weaving-wardrobe.js";
test("chromatic laws round trip and have separate lock",()=>{
 assert.equal(initial.filamentChroma,"Original pigment");
 for(const mode of textileChromaModes){
  const s={...initial,filamentChroma:mode};
  assert.deepEqual(parseDocument(recipeDocument(s,"chroma",{time:0,colorTime:0})).state,s);
 }
 for(const k of textileChromaControls)assert.equal(textileGroup(k),"chroma");
 const next=remixTextileChroma(initial,()=>.61);
 assert.doesNotThrow(()=>validateRecipe(next));
 for(const k of Object.keys(initial).filter(k=>!textileChromaControls.includes(k)))assert.deepEqual(next[k],initial[k],k);
 assert.match(filamentGLSL,/incomingPigment-pigmentPhase/);
 assert.match(filamentGLSL,/outgoingPigment=pigmentPhase/);
});
