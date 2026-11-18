import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,validateRecipe,randomize,numericRanges} from "../src/data.js";
import {filamentStitchModes,filamentStitchControls,filamentStitchPresets,
 applyFilamentStitchPreset,stopFilamentStitching,filamentGLSL} from "../src/filament-forge.js";
import {sectionMeta,findControls} from "../src/ui-index.js";

test("Five distinct self-weaving patterns use the same four controllable parameters",()=>{
 assert.equal(filamentStitchModes.length,5);
 assert.equal(new Set(filamentStitchModes).size,5);
 assert.equal(filamentStitchPresets.length,5);
 for(const p of filamentStitchPresets){
  assert.ok(filamentStitchModes.includes(p.filamentStitchMode),p.name);
  for(const k of filamentStitchControls){
   assert.deepEqual(numericRanges[k],[0,100],k);
   assert.ok(Number.isFinite(p[k])&&p[k]>=0&&p[k]<=100,k+" in "+p.name);
  }
 }
});
test("Legacy saved art never starts self-weaving unexpectedly",()=>{
 const old={...initial};
 delete old.filamentStitchMode;
 for(const k of filamentStitchControls)delete old[k];
 const r=validateRecipe(old);
 assert.equal(r.filamentStitchMode,"Needle chase");
 assert.equal(r.filamentStitchAmount,0);
 assert.equal(r.filamentAmount,old.filamentAmount);
 assert.equal(r.lettering,old.lettering);
});
test("One-tap self-weaving recipes preserve existing art, text, materials and parents",()=>{
 const art={...initial,engine:12,seed:92018,lettering:"DO NOT CHANGE MY QUOTE",
  colors:["#ff11cc","#22eeff","#ddff11"],filamentMaterial:"Velvet flock",
  filamentSecondMaterial:"Opaline glass",filamentSpecies:"Truchet knotwork",
  filamentSecondSpecies:"Voronoi lace",filamentCrossbreed:86,photonAmount:72,
  filamentBeads:57,filamentAmount:0};
 for(const p of filamentStitchPresets){
  const changed=applyFilamentStitchPreset(art,p.name);
  assert.equal(changed.filamentStitchMode,p.filamentStitchMode);
  assert.ok(changed.filamentStitchAmount>0);
  assert.ok(changed.filamentAmount>=55);
  for(const k of ["seed","engine","lettering","letteringFormats","letteringLayers",
   "colors","marks","filamentSpecies","filamentSecondSpecies","filamentCrossbreed",
   "filamentMaterial","filamentSecondMaterial","filamentBeads","photonAmount","ratio"])
   assert.deepEqual(changed[k],art[k],p.name+" altered "+k);
  const saved=validateRecipe(changed);
  assert.equal(saved.filamentStitchMode,p.filamentStitchMode);
  assert.equal(saved.filamentStitchAmount,p.filamentStitchAmount);
 }
 assert.equal(applyFilamentStitchPreset(art,"unknown"),art);
});
test("Hold Fabric turns off only stitching; leaves lace, materials and text intact",()=>{
 const original={...initial,filamentAmount:84,filamentStitchAmount:91,
  filamentStitchMode:"Unfurl & resew",filamentMaterial:"Molten chrome",
  filamentCrossbreed:67,lettering:"UNCHANGED"};
 const held=stopFilamentStitching(original);
 assert.equal(held.filamentStitchAmount,0);
 assert.equal(held.filamentStitchMode,original.filamentStitchMode);
 for(const k of ["filamentAmount","filamentMaterial","filamentCrossbreed","lettering","seed"])
  assert.deepEqual(held[k],original[k]);
 assert.equal(validateRecipe(held).filamentStitchAmount,0);
});
test("Saved recipes reject unknown stitch modes and out-of-range values",()=>{
 assert.throws(()=>validateRecipe({...initial,filamentStitchMode:"Injected shader"}),
  /Unknown filamentStitchMode/);
 assert.throws(()=>validateRecipe({...initial,filamentStitchAmount:101}),
  /Invalid filamentStitchAmount/);
 assert.throws(()=>validateRecipe({...initial,filamentStitchGlow:-1}),
  /Invalid filamentStitchGlow/);
});
test("Surprise and Mutate keep stitching parameters valid and never change authored text on Mutate",()=>{
 const original={...initial,filamentAmount:79,filamentStitchAmount:52,
  filamentStitchMode:"Needle chase",filamentStitchSpeed:38,lettering:"NOT YOUR WORDS"};
 const surprise=randomize(original,{},false,()=>.5);
 assert.ok(filamentStitchModes.includes(surprise.filamentStitchMode));
 assert.ok(surprise.filamentStitchAmount>=0&&surprise.filamentStitchAmount<=100);
 const mutant=randomize(original,{},true,()=>.8);
 assert.equal(mutant.filamentStitchMode,original.filamentStitchMode);
 assert.equal(mutant.lettering,original.lettering);
 assert.notEqual(mutant.filamentStitchSpeed,original.filamentStitchSpeed);
});
test("Stitching is compiled out of old/paused work and uses deterministic same-frame time",()=>{
 assert.match(filamentGLSL,/#ifdef FILAMENT_STITCHING/);
 assert.match(filamentGLSL,/if\(filamentStitchMode==0\)/);
 assert.match(filamentGLSL,/filamentStitchMode==3/);
 assert.match(filamentGLSL,/sewClock=time\*/);
 assert.match(filamentGLSL,/movingWindow/);
 assert.match(filamentGLSL,/core\*=reveal/);
 assert.match(filamentGLSL,/halo\*=reveal/);
 assert.match(filamentGLSL,/maskCore=core/);
 assert.doesNotMatch(filamentGLSL,/texelFetch|texture2D|\bfwidth\b/);
 let balance=0;
 for(const char of filamentGLSL){if(char==="{")balance++;if(char==="}")balance--;}
 assert.equal(balance,0);
});
test("Renderer keys stitch-mode programs separately and disables only stitching on GPU failure",()=>{
 const src=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
 assert.match(src,/withStitch = withFilament && s\.filamentStitchAmount>0/);
 assert.match(src,/FILAMENT_STITCHING 1/);
 assert.match(src,/filamentStitchModes\.indexOf\(s\.filamentStitchMode\)/);
 assert.match(src,/filamentStitchUnavailable=true/);
 assert.match(src,/\{filamentStitchAmount:0\}/);
 assert.match(src,/filamentMaterialUnavailable=true/);
 assert.match(src,/attempt<16/);
 for(const k of filamentStitchControls)assert.ok(src.includes('"'+k+'"'),k+" missing uniform");
});
test("Mobile editing UI has stitch presets, Hold Fabric and searchable resets",()=>{
 const inspector=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
 const meta=sectionMeta("filament");
 assert.ok(meta);
 for(const k of ["filamentStitchMode",...filamentStitchControls])assert.ok(meta.reset.includes(k),k);
 for(const k of filamentStitchControls)assert.ok(inspector.includes('name="'+k+'"'),k);
 for(const marker of ["SELF-WEAVING LOOM","Start weaving","Hold finished fabric"])
  assert.ok(inspector.includes(marker),marker);
 assert.ok(findControls("needle chase").some(x=>x.id==="filament"));
 assert.ok(findControls("unfurl").some(x=>x.id==="filament"));
});
