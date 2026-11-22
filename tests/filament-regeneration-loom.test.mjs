import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,numericRanges,validateRecipe,recipeDocument,parseDocument,randomize} from "../src/data.js";
import {sectionMeta,findControls} from "../src/ui-index.js";
import {
 filamentSpecies,filamentStitchModes,
 filamentRegenModes,filamentRegenFamilies,filamentRegenDescriptions,
 filamentRegenControls,filamentRegenPresets,applyFilamentRegenPreset,
 remixFilamentRegeneration,filamentGLSL,specializeFilamentRegeneration,
 specializeFilamentGeometry,specializeFilamentStitchMotion,
 specializeFilamentMaterials,specializeFilamentMorphMaterials,
 specializeFilamentAdornments,specializeFilamentContagion,
 specializeFilamentNeural,specializeFilamentPlasticity,specializeFilamentScars
} from "../src/filament-forge.js";

const modes=["Off","Forked nerve shoots","Wound bridges","Mycelial fan",
 "Pearly callus","Gold repair vines","Synaptic grafts"];
const art={...initial,engine:12,ratio:"9:16",seed:89648,
 lettering:"DO NOT EAT THE LOOM",colors:["#ff00ee","#00fafa","#ffff08"],
 filamentAmount:79,filamentSpecies:"Bobbin lace",
 filamentSecondSpecies:"Möbius cable",filamentCrossbreed:83,
 filamentMaterial:"Iridescent silk",filamentSecondMaterial:"Molten chrome",
 filamentStitchMode:"Cross-stitch",filamentStitchAmount:87,
 filamentMorphMode:"Fungal takeover",filamentMorphAmount:81,
 filamentContagionMode:"Crossing fever",filamentContagionAmount:73,
 filamentNeuralMode:"Synaptic handshake",filamentNeuralAmount:89,
 filamentPlasticMode:"Hebbian bloom",filamentPlasticAmount:84,
 filamentScarMode:"Mycelial nerve scars",filamentScarAmount:93,
 filamentAdornmentMode:"Watching eyes",filamentAdornmentAmount:92};
const preserve=["engine","ratio","seed","lettering","colors",
 "filamentSpecies","filamentSecondSpecies","filamentCrossbreed",
 "filamentMaterial","filamentSecondMaterial","filamentStitchMode",
 "filamentStitchAmount","filamentMorphMode","filamentMorphAmount",
 "filamentContagionMode","filamentContagionAmount",
 "filamentPlasticMode","filamentPlasticAmount","filamentAdornmentMode",
 "filamentAdornmentAmount"];
const braces=s=>[...s].reduce((n,c)=>n+(c==="{")-(c==="}"),0);

test("six geometry-creation modes, six presets and bounded sliders",()=>{
 assert.deepEqual(filamentRegenModes,modes);
 assert.deepEqual(filamentRegenFamilies.flatMap(x=>x.modes),modes);
 assert.equal(filamentRegenPresets.length,6);
 for(const mode of modes)assert.ok(filamentRegenDescriptions[mode]);
 for(const k of filamentRegenControls)assert.deepEqual(numericRanges[k],[0,100]);
 for(const p of filamentRegenPresets){
   assert.ok(modes.includes(p.filamentRegenMode));
   assert.notEqual(p.filamentRegenMode,"Off");
   for(const key of filamentRegenControls)
     assert.ok(p[key]>=0&&p[key]<=100,p.name+" "+key);
 }
});

test("legacy artwork remains 100% unchanged until regrowth is explicitly enabled",()=>{
 assert.equal(initial.filamentRegenMode,"Off");
 assert.equal(initial.filamentRegenAmount,0);
 const old={...art};
 for(const k of ["filamentRegenMode",...filamentRegenControls])delete old[k];
 const actual=validateRecipe(old);
 assert.equal(actual.filamentRegenMode,"Off");
 assert.equal(actual.filamentRegenAmount,0);
 for(const k of preserve)assert.deepEqual(actual[k],art[k],k);
 assert.throws(()=>validateRecipe({...art,filamentRegenMode:"forbidden GLSL"}),
   /Unknown filamentRegenMode/);
 assert.throws(()=>validateRecipe({...art,filamentRegenBranches:101}),
   /Invalid filamentRegenBranches/);
});

test("six regeneration recipes can enable scars/neurons without changing underlying art",()=>{
 for(const p of filamentRegenPresets){
   const updated=applyFilamentRegenPreset({...art,
     filamentNeuralMode:"Off",filamentNeuralAmount:0,
     filamentScarMode:"Off",filamentScarAmount:0},p.name);
   assert.equal(updated.filamentRegenMode,p.filamentRegenMode);
   assert.equal(updated.filamentNeuralMode,"Axon train");
   assert.equal(updated.filamentScarMode,"Phosphor aftertrace");
   assert.ok(updated.filamentScarAmount>=65);
   assert.ok(updated.filamentRegenAmount>=70);
   for(const k of preserve)assert.deepEqual(updated[k],art[k],k);
   assert.deepEqual(validateRecipe(updated),updated);
   const snap=recipeDocument(updated,"Regrown threads",{time:3,colorTime:4});
   assert.deepEqual(parseDocument(snap).state,updated);
 }
 assert.equal(applyFilamentRegenPreset(art,"invalid"),art);
});

test("regrowth shuffles respect protected work, deterministic RNG and weird-only modes",()=>{
 for(const n of [0,.35,.73,.99999,NaN]){
   for(const weird of [false,true]){
     const next=remixFilamentRegeneration(art,()=>n,weird);
     assert.deepEqual(next,remixFilamentRegeneration(art,()=>n,weird));
     assert.ok(next.filamentRegenAmount>=74);
     assert.ok(next.filamentNeuralAmount>=82);
     assert.ok(next.filamentScarAmount>=65);
     assert.notEqual(next.filamentRegenMode,"Off");
     if(weird)assert.ok(modes.slice(3).includes(next.filamentRegenMode));
     for(const k of preserve)assert.deepEqual(next[k],art[k],k);
     assert.deepEqual(validateRecipe(next),next);
   }
 }
});

test("all six regeneration geometry GLSL branches specialize individually",()=>{
 for(let i=1;i<modes.length;i++){
   const shader=specializeFilamentRegeneration(filamentGLSL,i);
   assert.deepEqual([...shader.matchAll(/(?:if|else if)\(filamentRegenMode==(\d+)\)/g)]
     .map(v=>Number(v[1])),[i]);
   assert.equal(braces(shader),0);
   assert.ok(shader.includes("float childCore="));
   assert.ok(shader.includes("core=max(core,childCore);"));
   assert.ok(shader.includes("maskCore=core;"));
   assert.ok(shader.includes("float tip=smoothstep("));
 }
 assert.equal(specializeFilamentRegeneration(filamentGLSL,null),filamentGLSL);
 assert.equal(specializeFilamentRegeneration(filamentGLSL,99),filamentGLSL);
});

test("new geometry is constructed before material, neural, and export coloring",()=>{
 const a=filamentGLSL.indexOf("float childCore=");
 const b=filamentGLSL.indexOf("core=max(core,childCore);");
 const c=filamentGLSL.indexOf("float pigmentPhase=");
 const d=filamentGLSL.indexOf("float scarInk=");
 assert.ok(a>=0&&b>a&&c>b&&d>c);
 assert.match(filamentGLSL,/childCore\*=reveal/);
 assert.match(filamentGLSL,/maskCore=core;/);
 assert.match(filamentGLSL,/float scarInk=clamp\(scarPresence\*scarRough,0.0,1.0\)\*core;/);
 assert.doesNotMatch(filamentGLSL,/copyTexSubImage2D|sampler2D/);
});

test("all 682 geometry/stitch combinations keep growth, nerve, scar and fiber code valid structurally",()=>{
 for(let geom=0;geom<filamentSpecies.length;geom++){
   const geometry=specializeFilamentGeometry(filamentGLSL,geom,(geom+3)%filamentSpecies.length);
   for(let stitch=0;stitch<filamentStitchModes.length;stitch++){
     let shader=specializeFilamentStitchMotion(geometry,stitch);
     shader=specializeFilamentMaterials(shader,2,12);
     shader=specializeFilamentMorphMaterials(shader,3,13);
     shader=specializeFilamentAdornments(shader,9,10);
     shader=specializeFilamentContagion(shader,1+(stitch%6));
     shader=specializeFilamentNeural(shader,1+(stitch%8));
     shader=specializeFilamentPlasticity(shader,1+(stitch%6));
     shader=specializeFilamentScars(shader,1+(stitch%6));
     shader=specializeFilamentRegeneration(shader,1+(stitch%6));
     assert.equal(braces(shader),0,geom+"/"+stitch);
     assert.ok(shader.includes("core=max(core,childCore);"),geom+"/"+stitch);
     assert.ok(shader.includes("maskCore=core;"),geom+"/"+stitch);
     assert.deepEqual(
       [...shader.matchAll(/(?:if|else if)\(filamentRegenMode==(\d+)\)/g)]
         .map(x=>Number(x[1])),[1+(stitch%6)]);
   }
 }
});

test("mobile UI and strict frame-accurate export still use the same regrowth shader",()=>{
 const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
 const ui=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
 const exportJs=readFileSync(new URL("../src/export.js",import.meta.url),"utf8");
 for(const text of ["REGENERATION LOOM","Regrow the weave","Shuffle alien healing",
   "Stop growing — keep scars","filamentRegenPresets.map"])
   assert.ok(ui.includes(text),text);
 for(const t of ["withRegen = withScars","specializeFilamentRegeneration(",
   "FILAMENT_REGENERATION 1","filamentRegenUnavailable=true",
   'if(exactEffects)throw artworkParityError("Full-effect shader failed to compile",e)',
   "memory.readIndex=writeIndex"])
   assert.ok(renderer.includes(t),t);
 assert.ok(exportJs.includes("createRenderer(canvas,{exactEffects:true})"));
 assert.ok(sectionMeta("filament").reset.includes("filamentRegenAmount"));
 for(const mode of modes.slice(1))
   assert.ok(findControls(mode).some(x=>x.id==="filament"),mode);
 assert.ok(modes.includes(randomize(art,{},false,()=>.77).filamentRegenMode));
});
