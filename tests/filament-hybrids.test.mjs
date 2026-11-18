import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,validateRecipe,randomize,numericRanges} from "../src/data.js";
import {
 filamentSpecies,filamentPresets,filamentHybridPresets,filamentHybridControls,
 applyFilamentPreset,applyFilamentHybrid,breedFilaments,filamentGLSL
} from "../src/filament-forge.js";
import {sectionMeta,findControls} from "../src/ui-index.js";

test("Six hybrid recipes have two valid distinct parent geometries",()=>{
 assert.equal(filamentHybridPresets.length,6);
 assert.equal(new Set(filamentHybridPresets.map(x=>x.name)).size,6);
 for(const preset of filamentHybridPresets){
   assert.ok(filamentSpecies.includes(preset.first),preset.name+" parent A");
   assert.ok(filamentSpecies.includes(preset.second),preset.name+" parent B");
   assert.notEqual(preset.first,preset.second,preset.name);
   assert.ok(preset.filamentAmount>0);
   for(const name of filamentHybridControls){
     assert.deepEqual(numericRanges[name],[0,100],name);
     assert.ok(Number.isFinite(preset[name])&&preset[name]>=0&&preset[name]<=100,name);
   }
 }
});
test("Older saves get no surprise hybrid shader and retain their first species",()=>{
 const old={...initial};
 delete old.filamentSecondSpecies;
 for(const key of filamentHybridControls)delete old[key];
 const state=validateRecipe(old);
 assert.equal(state.filamentSpecies,initial.filamentSpecies);
 assert.equal(state.filamentSecondSpecies,"Truchet knotwork");
 assert.equal(state.filamentCrossbreed,0);
 assert.equal(state.filamentInterlace,72);
 assert.equal(state.filamentPhase,35);
});
test("Hybrid presets preserve original math, touch, text, palette and optics",()=>{
 const original={...initial,engine:12,seed:39102,lettering:"DO NOT TOUCH MY WORDS",
   letteringFormats:[{start:0,end:2,bold:true}],
   colors:["#fa22cc","#00ddff","#bbff44"],photonAmount:63,
   filamentCrossbreed:0};
 for(const p of filamentHybridPresets){
   const result=applyFilamentHybrid(original,p.name);
   assert.equal(result.filamentSpecies,p.first);
   assert.equal(result.filamentSecondSpecies,p.second);
   assert.ok(result.filamentCrossbreed>0);
   for(const key of ["engine","seed","lettering","letteringFormats","colors",
     "marks","photonAmount","letteringLayers","ratio","backdropAmount"])
     assert.deepEqual(result[key],original[key],p.name+" damaged "+key);
   const saved=validateRecipe(result);
   assert.equal(saved.filamentSecondSpecies,p.second);
   assert.equal(saved.filamentCrossbreed,p.filamentCrossbreed);
 }
 assert.equal(applyFilamentHybrid(original,"missing"),original);
});
test("Single-parent presets turn hybrid off, but preserve the selected first pattern",()=>{
 const hybrid=applyFilamentHybrid(initial,filamentHybridPresets[0].name);
 assert.ok(hybrid.filamentCrossbreed>0);
 const plain=applyFilamentPreset(hybrid,filamentPresets[3].name);
 assert.equal(plain.filamentSpecies,filamentPresets[3].species);
 assert.equal(plain.filamentCrossbreed,0);
 assert.equal(plain.filamentSecondSpecies,hybrid.filamentSecondSpecies);
 assert.equal(plain.lettering,hybrid.lettering);
});
test("Wild breeding yields two distinct parents, preserves the artwork, and is bounded",()=>{
 const original={...initial,filamentAmount:0,lettering:"MY WORDS",seed:98765};
 for(const rng of [()=>0,()=>.5,()=>.999999,()=>NaN]){
   const b=breedFilaments(original,rng);
   assert.ok(filamentSpecies.includes(b.filamentSpecies));
   assert.ok(filamentSpecies.includes(b.filamentSecondSpecies));
   assert.notEqual(b.filamentSpecies,b.filamentSecondSpecies);
   assert.ok(b.filamentCrossbreed>=52&&b.filamentCrossbreed<=98);
   assert.ok(b.filamentInterlace>=34&&b.filamentInterlace<=98);
   assert.ok(b.filamentAmount>=55);
   assert.equal(b.lettering,original.lettering);
   assert.equal(b.seed,original.seed);
   assert.equal(validateRecipe(b).filamentSecondSpecies,b.filamentSecondSpecies);
 }
});
test("Validator rejects invalid parents and hybrid intensities",()=>{
 assert.throws(()=>validateRecipe({...initial,filamentSecondSpecies:"garbage"}),
   /Unknown filamentSecondSpecies/);
 assert.throws(()=>validateRecipe({...initial,filamentCrossbreed:101}),
   /Invalid filamentCrossbreed/);
 assert.throws(()=>validateRecipe({...initial,filamentInterlace:-5}),
   /Invalid filamentInterlace/);
});
test("Surprise generates distinct parents and Mutate perturbs hybrid settings safely",()=>{
 const original={...initial,filamentAmount:80,filamentCrossbreed:75,
   filamentSpecies:"Fivefold brocade",filamentSecondSpecies:"Truchet knotwork",
   filamentInterlace:69,lettering:"PERSONAL HAND-TYPED ART"};
 const surprise=randomize(original,{},false,()=>.5);
 assert.notEqual(surprise.filamentSpecies,surprise.filamentSecondSpecies);
 assert.ok(surprise.filamentCrossbreed>=0&&surprise.filamentCrossbreed<=100);
 assert.equal(surprise.lettering,"");
 const mutated=randomize(original,{},true,()=>.8);
 assert.equal(mutated.filamentSpecies,original.filamentSpecies);
 assert.equal(mutated.filamentSecondSpecies,original.filamentSecondSpecies);
 assert.notEqual(mutated.filamentCrossbreed,original.filamentCrossbreed);
 assert.equal(mutated.lettering,original.lettering);
});
test("Second geometry is preprocessor-guarded and only compounds at genuine crossings",()=>{
 assert.match(filamentGLSL,/#ifdef FILAMENT_HYBRID/);
 assert.match(filamentGLSL,/#else\s+\/\/ Compiled-out secondary layer/);
 assert.match(filamentGLSL,/filamentField\(/);
 assert.match(filamentGLSL,/float contact=clamp\(firstCore\*secondCore/);
 assert.match(filamentGLSL,/filamentInterlace\*contact/);
 assert.match(filamentGLSL,/filamentSecondSpecies/);
 assert.match(filamentGLSL,/return first;/);
 let balance=0;
 for(const char of filamentGLSL){if(char==="{")balance++;if(char==="}")balance--;}
 assert.equal(balance,0);
});
test("Renderer specializes the hybrid shader and disables only hybrid on GPU failure",()=>{
 const r=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
 assert.match(r,/withHybrid = withFilament && s\.filamentCrossbreed>0/);
 assert.match(r,/FILAMENT_HYBRID 1/);
 assert.match(r,/filamentSecondSpecies/);
 assert.match(r,/filamentHybridUnavailable=true/);
 assert.match(r,/\{filamentCrossbreed:0\}/);
 assert.match(r,/hybrid\$\{filamentSpecies\.indexOf\(s\.filamentSecondSpecies\)\}/);
 assert.match(r,/attempt<15/);
});
test("Find a Control, undoable presets and section reset expose every hybrid option",()=>{
 const ui=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
 const meta=sectionMeta("filament");
 assert.ok(meta);
 for(const key of ["filamentSecondSpecies",...filamentHybridControls])
   assert.ok(meta.reset.includes(key),key);
 for(const key of filamentHybridControls)
   assert.ok(ui.includes('name="'+key+'"'),key);
 for(const label of ["CROSSBREED TWO THREAD SPECIES","Spawn hybrid","Breed wild",
   "Swap parents","Unbreed (keep first)"])
   assert.ok(ui.includes(label),label);
 assert.ok(findControls("crossbreed").some(x=>x.id==="filament"));
 assert.ok(findControls("under over").some(x=>x.id==="filament"));
});
