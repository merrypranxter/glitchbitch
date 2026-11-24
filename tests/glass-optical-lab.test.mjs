import test from "node:test";
import assert from "node:assert/strict";
import {initial,validateRecipe,recipeDocument,parseDocument} from "../src/data.js";
import {opticalSpecimens,glassLabGroups,applyOpticalSpecimen,remixOpticalLab,glassLabLockedKeys} from "../src/glass-optical-lab.js";
const base={...initial,schlierenAmount:90,schlierenMode:"Gyroid membranes",schlierenMaterial:"Dichroic film"};
test("all curated specimens preserve non-glass state and validate",()=>{
 assert.equal(opticalSpecimens.length,10);
 for(const p of opticalSpecimens){
  const s=applyOpticalSpecimen(base,p.name);
  assert.deepEqual(validateRecipe(s),s);
  assert.deepEqual(parseDocument(recipeDocument(s,p.name,{time:0,colorTime:0})).state,s);
  for(const k of Object.keys(base).filter(k=>!k.startsWith("schlieren")))assert.deepEqual(s[k],base[k],k);
 }
});
test("each lock protects its whole parameter group for both actions",()=>{
 for(const g of glassLabGroups)for(const style of ["Curated","Experimental"])for(const intensity of ["Gentle","Balanced","Wild"]){
  const locks=[g.id];
  for(const next of [applyOpticalSpecimen(base,opticalSpecimens[2].name,locks),remixOpticalLab(base,()=>.72,{locks,style,intensity})]){
   for(const k of glassLabLockedKeys(locks))assert.deepEqual(next[k],base[k],k);
   assert.deepEqual(validateRecipe(next),next);
  }
 }
 const all=glassLabGroups.map(g=>g.id);
 assert.equal(remixOpticalLab(base,()=>.5,{locks:all}),base);
 assert.deepEqual(applyOpticalSpecimen(base,opticalSpecimens[0].name,all),base);
});
test("every glass control belongs to exactly one lock group",()=>{
 const keys=glassLabGroups.flatMap(g=>g.keys);
 assert.equal(new Set(keys).size,keys.length);
 assert.deepEqual([...keys].sort(),Object.keys(initial).filter(k=>k.startsWith("schlieren")).sort());
});
