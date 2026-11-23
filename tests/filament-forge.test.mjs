import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,validateRecipe,randomize,numericRanges} from "../src/data.js";
import {filamentSpecies,filamentPresets,filamentControls,
  applyFilamentPreset,nextFilamentSpecies,filamentGLSL} from "../src/filament-forge.js";
import {sections,sectionMeta,sectionActive,findControls} from "../src/ui-index.js";

test("Filament Forge retains its 22 legacy geometries and appends Feral Jacquard",()=>{
 assert.equal(filamentSpecies.length,24);
 assert.equal(new Set(filamentSpecies).size,24);
 assert.equal(filamentPresets.length,22);
 for(const p of filamentPresets){
   assert.ok(filamentSpecies.includes(p.species),p.name);
   for(const key of filamentControls){
     assert.deepEqual(numericRanges[key],[0,100],key);
     assert.ok(Number.isFinite(p[key])&&p[key]>=0&&p[key]<=100,p.name+" "+key);
   }
 }
});
test("Opt-in default preserves every old artwork and recipe",()=>{
 assert.equal(initial.filamentAmount,0);
 assert.equal(initial.filamentSpecies,"Fivefold brocade");
 const legacy={...initial};
 for(const key of ["filamentSpecies",...filamentControls])delete legacy[key];
 const loaded=validateRecipe(legacy);
 assert.equal(loaded.filamentAmount,0);
 assert.equal(loaded.filamentSpecies,filamentSpecies[0]);
});
test("Every preset preserves authored geometry, palette, touch marks and quote",()=>{
 const original={...initial,engine:7,seed:7331,lettering:"MY ART MY WORDS",
   colors:["#ff00ff","#00ffff","#eeff00"],photonAmount:40,
   marks:[{id:"marker",x:.5,y:.5,radius:.15,angle:0,mode:0,power:.8}]};
 for(const preset of filamentPresets){
   const next=applyFilamentPreset(original,preset.name);
   assert.equal(next.filamentSpecies,preset.species);
   assert.ok(next.filamentAmount>0);
   for(const key of ["lettering","marks","colors","seed","engine","photonAmount",
     "letteringFormats","letteringLayers","ratio"])
     assert.deepEqual(next[key],original[key],preset.name+" changed "+key);
   assert.equal(validateRecipe(next).filamentSpecies,preset.species);
 }
 assert.equal(applyFilamentPreset(original,"unknown"),original);
});
test("Select-new-species does not repeat, and leaving off remains reversible",()=>{
 const original={...initial,filamentAmount:0};
 const next=nextFilamentSpecies(original,()=>0);
 assert.notEqual(next.filamentSpecies,original.filamentSpecies);
 assert.ok(next.filamentAmount>=55);
 assert.equal(next.lettering,original.lettering);
 assert.equal(validateRecipe({...next,filamentAmount:0}).filamentAmount,0);
});
test("Invalid filament species and numeric values are rejected",()=>{
 assert.throws(()=>validateRecipe({...initial,filamentSpecies:"evil shader"}),/Unknown filamentSpecies/);
 assert.throws(()=>validateRecipe({...initial,filamentAmount:105}),/Invalid filamentAmount/);
 assert.throws(()=>validateRecipe({...initial,filamentWidth:-5}),/Invalid filamentWidth/);
});
test("Surprise and Mutate incorporate filament settings without generating words",()=>{
 const s={...initial,filamentAmount:61,filamentSpecies:filamentSpecies[0],
   lettering:"my own words",filamentScale:52};
 const surprised=randomize(s,{},false,()=>.5);
 assert.notEqual(surprised.filamentSpecies,s.filamentSpecies);
 assert.ok(surprised.filamentAmount>0);
 assert.equal(surprised.lettering,"");
 const mutated=randomize(s,{},true,()=>.8);
 assert.equal(mutated.filamentSpecies,s.filamentSpecies);
 assert.ok(mutated.filamentAmount>s.filamentAmount);
 assert.equal(mutated.lettering,s.lettering);
});
test("Shader has twenty-two geometric branches and no WebGL2-only requirements",()=>{
 assert.match(filamentGLSL,/vec3 livingFilamentForge/);
 assert.match(filamentGLSL,/uniform int filamentSpecies;/);
 assert.match(filamentGLSL,/if\(species==0\)/);
 assert.match(filamentGLSL,/species==4/);
 assert.match(filamentGLSL,/palette\(pigmentPhase\)/);
 assert.match(filamentGLSL,/return clamp\(result,0\.0,1\.6\);/);
 assert.doesNotMatch(filamentGLSL,/texture2D|texelFetch|\bfwidth\b/);
 assert.doesNotMatch(filamentGLSL,/\bactive\b/);
 const braces=[...filamentGLSL].reduce((n,x)=>n+(x==="{")-(x==="}"),0);
 assert.equal(braces,0);
});
test("Shader is optional, specialized per species and has GPU fallback",()=>{
 const src=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
 assert.match(src,/withFilament = s\.filamentAmount>0/);
 assert.match(src,/filamentGLSL\.replace\("uniform int filamentSpecies;"/);
 assert.match(src,/filamentSpecies\.indexOf\(s\.filamentSpecies\)/);
 assert.match(src,/col=livingFilamentForge\(col,uv,p,v\);/);
 assert.match(src,/filamentUnavailable=true/);
 assert.match(src,/\{filamentAmount:0\}/);
});
test("Claude's redesigned UI exposes all controls, presets and hide/reset",()=>{
 const inspector=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
 const meta=sectionMeta("filament");
 assert.equal(meta.tab,"Effects");
 assert.equal(meta.group,"Materials");
 assert.ok(sections.includes(meta));
 assert.ok(findControls("embroidery").some(x=>x.id==="filament"));
 assert.equal(sectionActive(meta,initial),false);
 assert.equal(sectionActive(meta,{...initial,filamentAmount:70}),true);
 for(const key of filamentControls)
   assert.ok(inspector.includes('name="'+key+'"'),"Missing Filament UI "+key);
 for(const label of ["filament: <>","Weave selected preset","New stitch species",
   "Reseed threads","Hide threads"])
   assert.ok(inspector.includes(label),label);
});
