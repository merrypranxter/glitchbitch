import test from "node:test";
import assert from "node:assert/strict";
import {initial,validateRecipe,recipeDocument,parseDocument} from "../src/data.js";
import {jewelryColonyModes,jewelryColonyPools,jewelryColonyControls,remixJewelryColony,filamentGLSL,specializeFilamentAdornments,filamentAdornmentModes} from "../src/filament-forge.js";
import {textileGroup} from "../src/weaving-wardrobe.js";
test("population modes save and are part of the existing jewelry lock",()=>{
 assert.equal(initial.filamentAdornmentColony,"Uniform jewelry");
 for(const mode of jewelryColonyModes){
  const s={...initial,filamentAdornmentColony:mode};
  assert.deepEqual(parseDocument(recipeDocument(s,"charms",{time:0,colorTime:0})).state,s);
 }
 for(const key of jewelryColonyControls)assert.equal(textileGroup(key),"jewelry");
 const n=remixJewelryColony(initial,()=>.61);
 assert.doesNotThrow(()=>validateRecipe(n));
 for(const k of Object.keys(initial).filter(k=>!jewelryColonyControls.includes(k)))assert.deepEqual(n[k],initial[k],k);
});
test("mobile branch pruning keeps selected parents and only the active pool",()=>{
 for(let c=0;c<jewelryColonyPools.length;c++){
  const shader=specializeFilamentAdornments(filamentGLSL,1,2,c);
  const kept=new Set([1,2,...jewelryColonyPools[c]]);
  for(let k=1;k<filamentAdornmentModes.length;k++)assert.equal(shader.includes("if(adornmentMode=="+k+"){"),kept.has(k),String(k));
 }
 assert.match(filamentGLSL,/stationFinish>0/);
 assert.match(filamentGLSL,/stationInterior>0/);
});
