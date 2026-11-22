import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,numericRanges,validateRecipe,recipeDocument,parseDocument,randomize} from "../src/data.js";
import {sectionMeta,findControls} from "../src/ui-index.js";
import {
 filamentScarModes,filamentScarFamilies,filamentScarDescriptions,
 filamentScarControls,filamentScarPresets,applyFilamentScarPreset,
 remixFilamentScars,filamentGLSL,specializeFilamentScars,
 filamentSpecies,filamentStitchModes,
 specializeFilamentGeometry,specializeFilamentStitchMotion,
 specializeFilamentMaterials,specializeFilamentMorphMaterials,
 specializeFilamentAdornments,specializeFilamentContagion,
 specializeFilamentNeural,specializeFilamentPlasticity
} from "../src/filament-forge.js";

const scarNames=["Off","Phosphor aftertrace","Lichtenberg burn",
 "Kintsugi sutures","Spectral bruising","Ghost knot fossils",
 "Mycelial nerve scars"];
const artwork={...initial,seed:12468,ratio:"9:16",engine:12,
 lettering:"I AM A GHOST IN THE LOOM",
 colors:["#ff00ff","#00f0ff","#ffff00"],
 filamentAmount:84,filamentSpecies:"Bobbin lace",
 filamentSecondSpecies:"Möbius cable",filamentCrossbreed:84,
 filamentMaterial:"Iridescent silk",
 filamentSecondMaterial:"Oil-slick latex",
 filamentStitchMode:"Cross-stitch",filamentStitchAmount:87,
 filamentMorphMode:"Seam sweep",filamentMorphAmount:82,
 filamentContagionMode:"Crossing fever",filamentContagionAmount:82,
 filamentNeuralMode:"Synaptic handshake",filamentNeuralAmount:95,
 filamentPlasticMode:"Hebbian bloom",filamentPlasticAmount:83,
 filamentAdornmentMode:"Watching eyes",filamentAdornmentAmount:81};
const protectedKeys=["seed","ratio","engine","lettering","colors",
 "filamentSpecies","filamentSecondSpecies","filamentCrossbreed",
 "filamentMaterial","filamentSecondMaterial","filamentStitchMode",
 "filamentStitchAmount","filamentMorphMode","filamentMorphAmount",
 "filamentContagionMode","filamentContagionAmount","filamentAdornmentMode",
 "filamentAdornmentAmount"];
const brace=s=>[...s].reduce((n,c)=>n+(c==="{")-(c==="}"),0);

test("six scar laws, descriptive groups, bounded numeric controls and six looks",()=>{
 assert.deepEqual(filamentScarModes,scarNames);
 assert.equal(filamentScarPresets.length,6);
 assert.deepEqual(filamentScarFamilies.flatMap(f=>f.modes),scarNames);
 for(const name of scarNames)assert.ok(filamentScarDescriptions[name],name);
 for(const field of filamentScarControls)
   assert.deepEqual(numericRanges[field],[0,100],field);
 for(const p of filamentScarPresets){
   assert.notEqual(p.filamentScarMode,"Off");
   for(const key of filamentScarControls)
     assert.ok(p[key]>=0&&p[key]<=100,p.name+" "+key);
 }
});

test("new scars default off, and old artworks load without material changes",()=>{
 assert.equal(initial.filamentScarMode,"Off");
 assert.equal(initial.filamentScarAmount,0);
 const legacy={...artwork};
 for(const k of ["filamentScarMode",...filamentScarControls])delete legacy[k];
 const restored=validateRecipe(legacy);
 assert.equal(restored.filamentScarMode,"Off");
 assert.equal(restored.filamentScarAmount,0);
 for(const k of protectedKeys)assert.deepEqual(restored[k],artwork[k],k);
 assert.throws(()=>validateRecipe({...artwork,filamentScarMode:"illegal"}),
   /Unknown filamentScarMode/);
 assert.throws(()=>validateRecipe({...artwork,filamentScarAmount:101}),
   /Invalid filamentScarAmount/);
});

test("scar recipes preserve everything already authored and survive save/reload",()=>{
 for(const preset of filamentScarPresets){
   const updated=applyFilamentScarPreset({...artwork,
     filamentNeuralMode:"Off",filamentNeuralAmount:0},preset.name);
   assert.equal(updated.filamentNeuralMode,"Axon train");
   assert.ok(updated.filamentNeuralAmount>=82);
   assert.equal(updated.filamentScarMode,preset.filamentScarMode);
   for(const k of protectedKeys)
     assert.deepEqual(updated[k],artwork[k],preset.name+" "+k);
   assert.deepEqual(validateRecipe(updated),updated);
   const doc=recipeDocument(updated,"Ghost scar",{time:3,colorTime:2});
   assert.deepEqual(parseDocument(doc).state,updated);
 }
 assert.equal(applyFilamentScarPreset(artwork,"unknown"),artwork);
});

test("shuffle only scars and dormant nerves; weird-only always selects weird scars",()=>{
 for(const value of [0,.32,.78,.99999,NaN]){
   for(const weird of [false,true]){
     const a=remixFilamentScars(artwork,()=>value,weird);
     const b=remixFilamentScars(artwork,()=>value,weird);
     assert.deepEqual(a,b);
     assert.ok(a.filamentScarAmount>=78);
     assert.ok(scarNames.slice(1).includes(a.filamentScarMode));
     if(weird)assert.ok(scarNames.slice(4).includes(a.filamentScarMode));
     for(const k of protectedKeys)assert.deepEqual(a[k],artwork[k],k);
     assert.deepEqual(validateRecipe(a),a);
   }
 }
});

test("6 shader branches prune to one and preserve stitched core gating",()=>{
 for(let i=1;i<scarNames.length;i++){
   const src=specializeFilamentScars(filamentGLSL,i);
   const selected=[...src.matchAll(/(?:if|else if)\(filamentScarMode==(\d+)\)/g)]
     .map(x=>Number(x[1]));
   assert.deepEqual(selected,[i]);
   assert.equal(brace(src),0);
   assert.ok(src.includes("float scarInk=clamp(scarPresence*scarRough,0.0,1.0)*core;"));
   assert.ok(src.includes("float contactNeural=clamp(incomingCore*core*incomingNeural"));
   assert.ok(src.includes("scarClock=nerveClock"));
 }
 assert.equal(specializeFilamentScars(filamentGLSL,null),filamentGLSL);
 assert.equal(specializeFilamentScars(filamentGLSL,99),filamentGLSL);
});

test("682 geometry-stitch combinations preserve neural, plasticity, fiber, ornament, scar GLSL",()=>{
 for(let geom=0;geom<filamentSpecies.length;geom++){
   const geometry=specializeFilamentGeometry(filamentGLSL,geom,(geom+3)%filamentSpecies.length);
   for(let sew=0;sew<filamentStitchModes.length;sew++){
     let shader=specializeFilamentStitchMotion(geometry,sew);
     shader=specializeFilamentMaterials(shader,2,12);
     shader=specializeFilamentMorphMaterials(shader,3,13);
     shader=specializeFilamentAdornments(shader,9,10);
     shader=specializeFilamentContagion(shader,1+(sew%6));
     shader=specializeFilamentNeural(shader,1+(sew%8));
     shader=specializeFilamentPlasticity(shader,1+(sew%6));
     shader=specializeFilamentScars(shader,1+(sew%6));
     assert.equal(brace(shader),0,geom+"/"+sew);
     assert.ok(shader.includes("float scarClock=nerveClock"),geom+"/"+sew);
     assert.ok(shader.includes("float scarInk=clamp(scarPresence"),geom+"/"+sew);
   }
 }
});

test("UI, save/reset, strict PNG/GIF/MP4 renderer remain wired and old GPU fix stays",()=>{
 const render=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
 const ui=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
 const exp=readFileSync(new URL("../src/export.js",import.meta.url),"utf8");
 for(const phrase of ["SYNAPTIC PLASTICITY","GHOST SCARS","Scar the threads",
   "Shuffle scar tissue","Shuffle haunted scars","Heal all scars",
   "filamentScarPresets.map"])assert.ok(ui.includes(phrase),phrase);
 for(const phrase of ["withScars = withNeural","FILAMENT_GHOST_SCARS 1",
   "specializeFilamentScars(","filamentScarUnavailable=true",
   'if(exactEffects)throw artworkParityError("Full-effect shader failed to compile",e)',
   "memory.readIndex=writeIndex"])assert.ok(render.includes(phrase),phrase);
 assert.ok(exp.includes("createRenderer(canvas,{exactEffects:true})"));
 assert.ok(sectionMeta("filament").reset.includes("filamentScarAmount"));
 for(const name of scarNames.slice(1))
   assert.ok(findControls(name).some(v=>v.id==="filament"),name);
 const surprise=randomize(artwork,{},false,()=>.73);
 assert.ok(scarNames.includes(surprise.filamentScarMode));
});
