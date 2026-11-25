import test from "node:test";
import assert from "node:assert/strict";
import {initial,validateRecipe,recipeDocument,parseDocument} from "../src/data.js";
import {jewelryPlacementModes,jewelryKineticModes,jewelryChoreographyControls,remixJewelryChoreography,filamentGLSL} from "../src/filament-forge.js";
import {textileGroup} from "../src/weaving-wardrobe.js";
test("all jewelry choreography modes round trip and preserve legacy defaults",()=>{
 assert.equal(initial.filamentAdornmentPlacement,"Original stations");
 assert.equal(initial.filamentAdornmentKinetics,"Original movement");
 for(const placement of jewelryPlacementModes)for(const kinetics of jewelryKineticModes){
  const s={...initial,filamentAdornmentPlacement:placement,filamentAdornmentKinetics:kinetics};
  assert.deepEqual(parseDocument(recipeDocument(s,"jewels",{time:0,colorTime:0})).state,s);
 }
 for(const k of jewelryChoreographyControls)assert.equal(textileGroup(k),"jewelry");
 assert.match(filamentGLSL,/float jewelry=collar\*filamentAdornmentAmount\*occupancy/);
});
test("targeted choreography leaves ornament species and all other artwork unchanged",()=>{
 const s={...initial,filamentAdornmentMode:"Diatom valves",filamentAmount:90,filamentAdornmentAmount:95};
 for(const part of ["all","placement","motion"]){
  const n=remixJewelryChoreography(s,()=>.73,part);
  assert.doesNotThrow(()=>validateRecipe(n));
  for(const k of Object.keys(s).filter(k=>!jewelryChoreographyControls.includes(k)))assert.deepEqual(n[k],s[k],k);
  if(part==="motion")assert.equal(n.filamentAdornmentPlacement,s.filamentAdornmentPlacement);
  if(part==="placement")assert.equal(n.filamentAdornmentKinetics,s.filamentAdornmentKinetics);
 }
});
