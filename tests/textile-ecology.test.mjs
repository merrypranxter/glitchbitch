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


test("microbial couture appends eight compatible morphologies and samples each",()=>{
 const names=["Pennate diatom frustules","Desmid mirror cells","Coccolith rosettes","Armored dinoflagellates","Spirillum ribbons","Vorticella bells","Foraminifer chambers","Silica spicule stars"];
 assert.deepEqual(textileEcologyModes.slice(9),names);
 assert.equal(textileEcologyModes[8],"Radiolarian colonies");
 for(let i=0;i<names.length;i++){
  const mode=names[i];
  const next=remixTextileEcology(initial,()=>((i+8+.5)/16));
  assert.equal(next.filamentEcology,mode);
  assert.doesNotThrow(()=>validateRecipe(next));
  assert.ok(filamentGLSL.includes("filamentEcology=="+(i+9)+"){"));
  for(const k of Object.keys(initial).filter(k=>!textileEcologyControls.includes(k)))assert.deepEqual(next[k],initial[k],k);
 }
});
