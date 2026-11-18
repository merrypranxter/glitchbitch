import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,validateRecipe,randomize,numericRanges} from "../src/data.js";
import {
 filamentSculptModes,filamentSculptControls,filamentSculptPresets,
 applyFilamentSculptPreset,disableFilamentSculpt,filamentGLSL
} from "../src/filament-forge.js";
import {sectionMeta,findControls} from "../src/ui-index.js";

test("Five tactile modes and presets have five bounded sculpt parameters",()=>{
 assert.deepEqual(filamentSculptModes,[
   "Raised satin","Trapunto quilting","Recessed engraving",
   "Chased metal","Shadow cutwork"
 ]);
 assert.equal(filamentSculptPresets.length,5);
 assert.equal(new Set(filamentSculptPresets.map(p=>p.name)).size,5);
 for(const p of filamentSculptPresets){
   assert.ok(filamentSculptModes.includes(p.filamentSculptMode),p.name);
   for(const key of filamentSculptControls){
     assert.deepEqual(numericRanges[key],[0,100],key);
     assert.ok(Number.isFinite(p[key])&&p[key]>=0&&p[key]<=100,p.name+" "+key);
   }
 }
});
test("Opening old recipes never activates relief or changes existing thread appearance",()=>{
 const old={...initial};
 delete old.filamentSculptMode;
 for(const key of filamentSculptControls)delete old[key];
 const result=validateRecipe(old);
 assert.equal(result.filamentSculptMode,"Raised satin");
 assert.equal(result.filamentSculptAmount,0);
 assert.equal(result.filamentAmount,old.filamentAmount);
 assert.equal(result.filamentStitchAmount,old.filamentStitchAmount);
 assert.equal(result.lettering,old.lettering);
});
test("Presets preserve original art, materials, stitching, parent geometry and words",()=>{
 const state={...initial,engine:12,seed:10203,
   lettering:"MY MATHEMATICAL WITCHCRAFT",colors:["#ff00bb","#00eeff","#bbff22"],
   filamentAmount:0,filamentSpecies:"Voronoi lace",
   filamentSecondSpecies:"Poincaré crochet",filamentCrossbreed:83,
   filamentStitchMode:"Needle chase",filamentStitchAmount:80,
   filamentMaterial:"Opaline glass",filamentSecondMaterial:"Velvet flock",
   filamentNap:76,filamentBeads:52,photonAmount:73};
 for(const p of filamentSculptPresets){
   const next=applyFilamentSculptPreset(state,p.name);
   assert.equal(next.filamentSculptMode,p.filamentSculptMode);
   assert.ok(next.filamentSculptAmount>0);
   assert.ok(next.filamentAmount>=55);
   for(const key of ["engine","seed","lettering","letteringFormats","letteringLayers",
     "colors","marks","ratio","filamentSpecies","filamentSecondSpecies",
     "filamentCrossbreed","filamentStitchMode","filamentStitchAmount",
     "filamentMaterial","filamentSecondMaterial","filamentBeads","photonAmount"])
     assert.deepEqual(next[key],state[key],p.name+" must retain "+key);
   const saved=validateRecipe(next);
   assert.equal(saved.filamentSculptMode,p.filamentSculptMode);
   assert.equal(saved.filamentSculptAmount,p.filamentSculptAmount);
 }
 assert.equal(applyFilamentSculptPreset(state,"unknown"),state);
});
test("Flatten Relief disables ONLY sculpt lighting and retains thread settings",()=>{
 const state={...initial,filamentAmount:79,filamentSculptAmount:94,
   filamentMaterial:"Molten chrome",filamentStitchAmount:70,
   filamentCrossbreed:83,lettering:"WORDS STAY PUT"};
 const result=disableFilamentSculpt(state);
 assert.equal(result.filamentSculptAmount,0);
 for(const key of ["filamentMaterial","filamentStitchAmount","filamentCrossbreed",
   "filamentAmount","lettering","filamentSculptMode"])
   assert.deepEqual(result[key],state[key]);
 assert.equal(validateRecipe(result).filamentSculptAmount,0);
});
test("Validator rejects unknown relief style and invalid controls",()=>{
 assert.throws(()=>validateRecipe({...initial,filamentSculptMode:"evil shader"}),
   /Unknown filamentSculptMode/);
 assert.throws(()=>validateRecipe({...initial,filamentSculptAmount:101}),
   /Invalid filamentSculptAmount/);
 assert.throws(()=>validateRecipe({...initial,filamentSculptLight:-2}),
   /Invalid filamentSculptLight/);
});
test("Surprise and Mutate work with relief without overwriting authored words",()=>{
 const source={...initial,filamentAmount:81,filamentSculptAmount:62,
   filamentSculptDepth:23,filamentSculptMode:"Raised satin",
   lettering:"THOSE ARE MY WORDS"};
 const surprise=randomize(source,{},false,()=>.5);
 assert.ok(filamentSculptModes.includes(surprise.filamentSculptMode));
 assert.ok(surprise.filamentSculptAmount>=0&&surprise.filamentSculptAmount<=100);
 const mutant=randomize(source,{},true,()=>.8);
 assert.equal(mutant.filamentSculptMode,source.filamentSculptMode);
 assert.notEqual(mutant.filamentSculptDepth,source.filamentSculptDepth);
 assert.equal(mutant.lettering,source.lettering);
});
test("Relief shader is opt-in, thread-bound, and honors unfinished stitch reveals",()=>{
 assert.match(filamentGLSL,/#ifdef FILAMENT_SCULPT/);
 assert.match(filamentGLSL,/float sculptReveal=1\.0/);
 assert.match(filamentGLSL,/sculptReveal=reveal/);
 assert.match(filamentGLSL,/shadowRegion\*=sculptReveal/);
 assert.match(filamentGLSL,/filamentSculptLight\*6\.2831853/);
 assert.match(filamentGLSL,/Shadow cutwork: dark relieved edge/);
 assert.match(filamentGLSL,/threadD\/max\(width\+aa/);
 assert.doesNotMatch(filamentGLSL,/texture2D|texelFetch|\bfwidth\b/);
 const balance=filamentGLSL.split("{").length-filamentGLSL.split("}").length;
 assert.equal(balance,0);
});
test("Shader compile switch and fallback preserve original hybrid, material and moving lace",()=>{
 const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
 assert.match(renderer,/withSculpt = withFilament && s\.filamentSculptAmount>0/);
 assert.match(renderer,/FILAMENT_SCULPT 1/);
 assert.match(renderer,/filamentSculptModes\.indexOf\(s\.filamentSculptMode\)/);
 assert.match(renderer,/filamentSculptUnavailable=true/);
 assert.match(renderer,/\{filamentSculptAmount:0\}/);
 assert.match(renderer,/attempt<15/);
 for(const k of filamentSculptControls)
   assert.ok(renderer.includes('"'+k+'"'),k+" must have a uniform");
});
test("Compact Effects UI exposes sculpt controls, presets and indexed reset",()=>{
 const inspector=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
 const meta=sectionMeta("filament");
 assert.ok(meta);
 for(const k of ["filamentSculptMode",...filamentSculptControls])
   assert.ok(meta.reset.includes(k),"reset must include "+k);
 for(const k of filamentSculptControls)
   assert.ok(inspector.includes('name="'+k+'"'),"missing slider "+k);
 for(const text of ["SCULPTED THREADS","Sculpt selected preset","Flatten relief (keep threads)"])
   assert.ok(inspector.includes(text),text);
 assert.ok(findControls("trapunto").some(x=>x.id==="filament"));
 assert.ok(findControls("shadow cutwork").some(x=>x.id==="filament"));
});
