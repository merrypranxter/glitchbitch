import test from "node:test";
import assert from "node:assert/strict";
import {initial,validateRecipe,recipeDocument,parseDocument} from "../src/data.js";
import {jewelryInteriorModes,jewelryInteriorControls,remixJewelryInterior,filamentGLSL,applyFilamentAdornmentPreset,filamentAdornmentPresets} from "../src/filament-forge.js";
import {textileGroup} from "../src/weaving-wardrobe.js";
test("microarchitecture saves, validates and is covered by the existing jewelry lock",()=>{
 assert.equal(initial.filamentAdornmentInterior,"Native ornament");
 for(const mode of jewelryInteriorModes){
  const s={...initial,filamentAdornmentInterior:mode};
  assert.deepEqual(parseDocument(recipeDocument(s,"microjewel",{time:0,colorTime:0})).state,s);
 }
 for(const k of jewelryInteriorControls)assert.equal(textileGroup(k),"jewelry");
 assert.match(filamentGLSL,/float ornamentWindow=1.0/);
 assert.match(filamentGLSL,/opacity\*ornamentWindow/);
});
test("interior-only shuffle preserves every other parameter and preset restores native interior",()=>{
 const s={...initial,filamentAdornmentMode:"Diatom valves",filamentAdornmentAmount:90,filamentAdornmentFinish:"Dichroic enamel"};
 const n=remixJewelryInterior(s,()=>.7);
 assert.doesNotThrow(()=>validateRecipe(n));
 assert.notEqual(n.filamentAdornmentInterior,s.filamentAdornmentInterior);
 for(const k of Object.keys(s).filter(k=>!jewelryInteriorControls.includes(k)))assert.deepEqual(n[k],s[k],k);
 assert.equal(applyFilamentAdornmentPreset(n,filamentAdornmentPresets[0].name).filamentAdornmentInterior,"Native ornament");
});
