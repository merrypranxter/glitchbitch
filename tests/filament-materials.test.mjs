import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,numericRanges,validateRecipe,randomize} from "../src/data.js";
import {
 filamentMaterials,filamentMaterialControls,filamentMaterialPresets,
 applyFilamentMaterialPreset,remixFilamentMaterials,filamentGLSL
} from "../src/filament-forge.js";
import {sectionMeta,findControls} from "../src/ui-index.js";

test("Six distinct material modes and six independent material recipes",()=>{
 assert.deepEqual(filamentMaterials,[
   "Original thread","Iridescent silk","Molten chrome","Opaline glass",
   "Velvet flock","Electroluminescent yarn"
 ]);
 assert.equal(filamentMaterialPresets.length,6);
 assert.equal(new Set(filamentMaterialPresets.map(p=>p.name)).size,6);
 for(const p of filamentMaterialPresets){
   assert.ok(filamentMaterials.includes(p.filamentMaterial),p.name);
   assert.ok(filamentMaterials.includes(p.filamentSecondMaterial),p.name);
   for(const key of filamentMaterialControls){
     assert.deepEqual(numericRanges[key],[0,100],key);
     assert.ok(Number.isFinite(p[key])&&p[key]>=0&&p[key]<=100,p.name+" "+key);
   }
 }
});
test("Old artworks have no textile surface detail enabled",()=>{
 const legacy={...initial};
 for(const k of ["filamentMaterial","filamentSecondMaterial",...filamentMaterialControls])
   delete legacy[k];
 const loaded=validateRecipe(legacy);
 assert.equal(loaded.filamentMaterial,"Original thread");
 assert.equal(loaded.filamentSecondMaterial,"Original thread");
 assert.equal(loaded.filamentNap,0);
 assert.equal(loaded.filamentBeads,0);
 assert.equal(loaded.filamentSecondHue,0);
 assert.equal(loaded.filamentCrossbreed,initial.filamentCrossbreed);
 assert.equal(loaded.lettering,legacy.lettering);
});
test("Dressing the fiber never changes shape, parent choice, palettes, text or optical effects",()=>{
 const art={...initial,engine:12,seed:18272,colors:["#fa12db","#3efef1","#ddff33"],
   lettering:"THE WORDS STAY HERE",filamentSpecies:"Voronoi lace",
   filamentSecondSpecies:"Poincaré crochet",filamentCrossbreed:81,
   photonAmount:58,filamentAmount:0};
 for(const recipe of filamentMaterialPresets){
   const next=applyFilamentMaterialPreset(art,recipe.name);
   assert.equal(next.filamentMaterial,recipe.filamentMaterial);
   assert.equal(next.filamentSecondMaterial,recipe.filamentSecondMaterial);
   assert.ok(next.filamentAmount>=50);
   for(const k of ["engine","seed","colors","lettering","letteringFormats",
     "letteringLayers","filamentSpecies","filamentSecondSpecies","filamentCrossbreed",
     "filamentScale","filamentPhase","photonAmount","marks","ratio"])
     assert.deepEqual(next[k],art[k],recipe.name+" altered "+k);
   const saved=validateRecipe(next);
   assert.equal(saved.filamentMaterial,recipe.filamentMaterial);
   assert.equal(saved.filamentSecondMaterial,recipe.filamentSecondMaterial);
 }
 assert.equal(applyFilamentMaterialPreset(art,"bogus"),art);
});
test("Every material and parameter roundtrips, and invalid colors/materials fail",()=>{
 const sample=validateRecipe({...initial,
   filamentMaterial:"Velvet flock",
   filamentSecondMaterial:"Opaline glass",
   filamentNap:92,filamentBeads:100,filamentLuster:21,
   filamentBeadSize:83,filamentSecondHue:49});
 assert.equal(sample.filamentMaterial,"Velvet flock");
 assert.equal(sample.filamentSecondMaterial,"Opaline glass");
 assert.equal(sample.filamentBeads,100);
 assert.equal(sample.filamentSecondHue,49);
 assert.throws(()=>validateRecipe({...initial,filamentMaterial:"free CSS injection"}),
   /Unknown filamentMaterial/);
 assert.throws(()=>validateRecipe({...initial,filamentSecondMaterial:"nonexistent"}),
   /Unknown filamentSecondMaterial/);
 assert.throws(()=>validateRecipe({...initial,filamentNap:120}),/Invalid filamentNap/);
 assert.throws(()=>validateRecipe({...initial,filamentBeadSize:-1}),/Invalid filamentBeadSize/);
});
test("Material remix always changes at least the two material choices, not the artwork",()=>{
 const art={...initial,filamentAmount:0,filamentMaterial:"Original thread",
   filamentSecondMaterial:"Velvet flock",lettering:"MY QUOTE"};
 for(const rng of [()=>0,()=>.5,()=>.999999,()=>NaN]){
   const next=remixFilamentMaterials(art,rng);
   assert.notEqual(next.filamentMaterial,art.filamentMaterial);
   assert.notEqual(next.filamentSecondMaterial,art.filamentSecondMaterial);
   assert.ok(next.filamentAmount>=50);
   assert.equal(next.lettering,art.lettering);
   assert.equal(next.seed,art.seed);
   assert.equal(next.filamentSpecies,art.filamentSpecies);
   assert.equal(validateRecipe(next).filamentMaterial,next.filamentMaterial);
 }
});
test("Surprise/Mutate integrate material controls without overwriting authored words",()=>{
 const source={...initial,filamentAmount:86,filamentBeads:34,
   filamentMaterial:"Iridescent silk",lettering:"NO BOTS MAY WRITE HERE"};
 const next=randomize(source,{},false,()=>.5);
 assert.ok(filamentMaterials.includes(next.filamentMaterial));
 assert.ok(filamentMaterials.includes(next.filamentSecondMaterial));
 assert.equal(next.lettering,"");
 assert.ok(next.filamentLuster<=100);
 const altered=randomize(source,{},true,()=>.8);
 assert.equal(altered.filamentMaterial,source.filamentMaterial);
 assert.notEqual(altered.filamentBeads,source.filamentBeads);
 assert.equal(altered.lettering,source.lettering);
});
test("Expensive fiber calculations and beadwork are guarded out for classic shaders",()=>{
 assert.match(filamentGLSL,/#ifdef FILAMENT_FIBER_DETAIL/);
 assert.match(filamentGLSL,/fiberMaterial==1/);
 assert.match(filamentGLSL,/fiberMaterial==2/);
 assert.match(filamentGLSL,/fiberMaterial==3/);
 assert.match(filamentGLSL,/fiberMaterial==4/);
 assert.match(filamentGLSL,/fiberMaterial==5/);
 assert.match(filamentGLSL,/filamentBeads\*pearl/);
 assert.match(filamentGLSL,/float node=pow\(clamp\(contact/);
 assert.match(filamentGLSL,/filamentSecondHue\*\.9/);
 assert.doesNotMatch(filamentGLSL,/texelFetch|texture2D|\bfwidth\b/);
 let braces=0;
 for(const c of filamentGLSL){if(c==="{")braces++;if(c==="}")braces--;}
 assert.equal(braces,0);
 assert.equal(filamentGLSL.split("(").length,filamentGLSL.split(")").length);
});
test("Optional surface fallback preserves primary/hybrid geometry when GPU rejects material",()=>{
 const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
 assert.match(renderer,/withFiberDetail = withFilament &&/);
 assert.match(renderer,/FILAMENT_FIBER_DETAIL 1/);
 assert.match(renderer,/filamentMaterialUnavailable=true/);
 assert.match(renderer,/filamentMaterial:"Original thread",filamentSecondMaterial:"Original thread"/);
 assert.match(renderer,/filamentHybridUnavailable=true/);
 assert.match(renderer,/attempt<16/);
 for(const key of filamentMaterialControls)
   assert.ok(renderer.includes('"'+key+'"'),"renderer uniform "+key);
});
test("Mobile Effects UI and search expose material mixer and its reset semantics",()=>{
 const inspector=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
 const filament=sectionMeta("filament");
 for(const key of ["filamentMaterial","filamentSecondMaterial",...filamentMaterialControls])
   assert.ok(filament.reset.includes(key),"Reset "+key);
 for(const key of filamentMaterialControls)
   assert.ok(inspector.includes('name="'+key+'"'),"UI "+key);
 for(const name of ["THREAD ALCHEMY","Dress the threads","Remix fibers",
   "Restore classic threads"])
   assert.ok(inspector.includes(name),name);
 assert.ok(findControls("velvet").some(x=>x.id==="filament"));
 assert.ok(findControls("seed beads").some(x=>x.id==="filament"));
});
