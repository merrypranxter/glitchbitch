import test from "node:test";
import assert from "node:assert/strict";
import {initial,validateRecipe,recipeDocument,parseDocument} from "../src/data.js";
import {textileEcologyModes,textileEcologyControls,remixTextileEcology,filamentGLSL} from "../src/filament-forge.js";
import {textileGroup} from "../src/weaving-wardrobe.js";
test("fiber ecology settings round trip and remain independent",()=>{
 assert.equal(initial.filamentEcology,"Clean fibers");
 for(const mode of textileEcologyModes){
  const s={...initial,filamentEcology:mode};
  assert.deepEqual(parseDocument(recipeDocument(s,"ecology",{time:0,colorTime:0})).state,s);
 }
 for(const k of textileEcologyControls)assert.equal(textileGroup(k),"surface-ecology");
 const next=remixTextileEcology(initial,()=>.61);
 assert.doesNotThrow(()=>validateRecipe(next));
 for(const k of Object.keys(initial).filter(k=>!textileEcologyControls.includes(k)))assert.deepEqual(next[k],initial[k],k);
 assert.match(filamentGLSL,/ecAttach\*=reveal/);
 assert.match(filamentGLSL,/ecAmount=filamentEcologyAmount\*ecoGate\*ecAttach/);
});
