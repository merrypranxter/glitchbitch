import test from "node:test";
import assert from "node:assert/strict";
import {initial,validateRecipe,recipeDocument,parseDocument} from "../src/data.js";
import {glassTransportModes,glassTransportControls,shuffleMathematicalGlass,schlierenFragment,applySchlierenPreset,mathematicalGlassPresets} from "../src/schlieren-glass.js";
test("focal light settings round-trip and older recipes keep original highlights",()=>{
 assert.equal(initial.schlierenTransport,"Original highlights");
 for(const mode of glassTransportModes){
  const state={...initial,schlierenAmount:92,schlierenMode:"Gyroid membranes",schlierenTransport:mode};
  assert.deepEqual(parseDocument(recipeDocument(state,"focal glass",{time:2,colorTime:5})).state,state);
 }
 assert.throws(()=>validateRecipe({...initial,schlierenTransport:"unknown"}));
 assert.throws(()=>validateRecipe({...initial,schlierenLightFocus:101}));
 assert.match(schlierenFragment,/float det=ja\*jb/);
 assert.match(schlierenFragment,/corner-xPlus-yPlus\+focalField/);
 assert.match(schlierenFragment,/if\(transportStrength>\.001\)outColor=glassFocalNetwork/);
});
test("focal light shuffle never changes other glass or artwork fields",()=>{
 const state={...initial,schlierenAmount:95,schlierenTransport:"Fold caustic web",schlierenMode:"Quasicrystal glass",schlierenMaterial:"Dichroic film"};
 const next=shuffleMathematicalGlass(state,()=>.65,"transport");
 assert.notEqual(next.schlierenTransport,state.schlierenTransport);
 assert.deepEqual(validateRecipe(next),next);
 for(const k of Object.keys(state).filter(k=>!glassTransportControls.includes(k)))assert.deepEqual(next[k],state[k],k);
 assert.equal(applySchlierenPreset(next,mathematicalGlassPresets[0].name).schlierenTransport,"Original highlights");
});
