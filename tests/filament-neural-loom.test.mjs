import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {
  initial,numericRanges,validateRecipe,recipeDocument,parseDocument,randomize
} from "../src/data.js";
import {findControls,sectionMeta} from "../src/ui-index.js";
import {
 filamentSpecies,filamentStitchModes,filamentMaterials,
 filamentNeuralModes,filamentNeuralFamilies,filamentNeuralDescriptions,
 filamentNeuralControls,filamentNeuralPresets,
 applyFilamentNeuralPreset,remixFilamentNeural,
 filamentGLSL,specializeFilamentGeometry,specializeFilamentStitchMotion,
 specializeFilamentMaterials,specializeFilamentMorphMaterials,
 specializeFilamentAdornments,specializeFilamentContagion,specializeFilamentNeural
} from "../src/filament-forge.js";

const modes=["Off","Axon train","Chromatic reflex","Synaptic handshake",
 "Ganglion chorus","Reflex arc","Myelin skip","Nerve storm","Resting potential"];
const oldArt={...initial,engine:12,seed:19624,ratio:"9:16",
  lettering:"THIS ART REMAINS MINE",colors:["#ff00ff","#22ffff","#ffee00"],
  filamentAmount:90,filamentSpecies:"Macramé diamonds",
  filamentSecondSpecies:"Poincaré crochet",filamentCrossbreed:91,
  filamentMaterial:"Iridescent silk",filamentSecondMaterial:"Oil-slick latex",
  filamentStitchMode:"Chain stitch",filamentStitchAmount:92,
  filamentAdornmentMode:"Watching eyes",filamentAdornmentAmount:85,
  filamentMorphMode:"Fungal takeover",filamentMorphAmount:80,
  filamentMorphTarget:"Opaline glass",
  filamentSecondMorphTarget:"Bioluminescent mycelium",
  filamentContagionMode:"Crossing fever",filamentContagionAmount:74};
const protectedFields=["engine","seed","ratio","lettering","colors",
  "filamentSpecies","filamentSecondSpecies","filamentCrossbreed",
  "filamentMaterial","filamentSecondMaterial",
  "filamentStitchMode","filamentStitchAmount","filamentAdornmentMode",
  "filamentAdornmentAmount","filamentMorphMode","filamentMorphTarget",
  "filamentSecondMorphTarget","filamentMorphAmount","filamentContagionMode",
  "filamentContagionAmount"];
const braces=s=>[...s].reduce((a,c)=>a+(c==="{")-(c==="}"),0);

test("eight independent neural laws plus dormant state and complete presets",()=>{
 assert.deepEqual(filamentNeuralModes,modes);
 assert.deepEqual(filamentNeuralFamilies.flatMap(x=>x.modes),modes);
 assert.equal(filamentNeuralPresets.length,8);
 assert.equal(new Set(filamentNeuralPresets.map(x=>x.name)).size,8);
 for(const name of modes)assert.ok(filamentNeuralDescriptions[name],name);
 for(const key of filamentNeuralControls)
   assert.deepEqual(numericRanges[key],[0,100],key);
 for(const p of filamentNeuralPresets){
   assert.ok(modes.includes(p.filamentNeuralMode));
   assert.notEqual(p.filamentNeuralMode,"Off");
   for(const key of filamentNeuralControls)
     assert.ok(p[key]>=0&&p[key]<=100,p.name+" "+key);
 }
});

test("legacy art never fires involuntary neural activity",()=>{
 assert.equal(initial.filamentNeuralMode,"Off");
 assert.equal(initial.filamentNeuralAmount,0);
 const legacy={...oldArt};
 for(const k of ["filamentNeuralMode",...filamentNeuralControls])delete legacy[k];
 const restored=validateRecipe(legacy);
 assert.equal(restored.filamentNeuralMode,"Off");
 assert.equal(restored.filamentNeuralAmount,0);
 for(const k of protectedFields)assert.deepEqual(restored[k],oldArt[k],k);
 assert.throws(()=>validateRecipe({...oldArt,filamentNeuralMode:"dangerous"}),
   /Unknown filamentNeuralMode/);
 assert.throws(()=>validateRecipe({...oldArt,filamentNeuralSpeed:101}),
   /Invalid filamentNeuralSpeed/);
});

test("all one-click neurons preserve artist's fabric, typography and dressing",()=>{
 for(const p of filamentNeuralPresets){
   const result=applyFilamentNeuralPreset(oldArt,p.name);
   assert.equal(result.filamentNeuralMode,p.filamentNeuralMode);
   assert.ok(result.filamentNeuralAmount>0);
   for(const key of protectedFields)
     assert.deepEqual(result[key],oldArt[key],p.name+" "+key);
   assert.deepEqual(validateRecipe(result),result);
   const saved=recipeDocument(result,"Neural Loom",{time:2,colorTime:3});
   assert.deepEqual(parseDocument(saved).state,result);
 }
 assert.equal(applyFilamentNeuralPreset(oldArt,"nonexistent"),oldArt);
});

test("nervous-system shuffles can isolate weird behavior without touching existing art",()=>{
 for(const value of [0,.24,.73,.9999,NaN]){
   for(const feral of [false,true]){
     const a=remixFilamentNeural(oldArt,()=>value,feral);
     const b=remixFilamentNeural(oldArt,()=>value,feral);
     assert.deepEqual(a,b);
     assert.ok(a.filamentNeuralAmount>=72);
     assert.ok(modes.includes(a.filamentNeuralMode));
     if(feral)assert.ok(modes.slice(4,8).includes(a.filamentNeuralMode));
     for(const key of protectedFields)assert.deepEqual(a[key],oldArt[key],key);
     assert.deepEqual(validateRecipe(a),a);
   }
 }
});

test("every selected neural law compiles down to just its own branch",()=>{
 for(let id=1;id<modes.length;id++){
   const slim=specializeFilamentNeural(filamentGLSL,id);
   assert.deepEqual([...slim.matchAll(/(?:if|else if)\(filamentNeuralMode==(\d+)\)/g)]
    .map(x=>Number(x[1])),[id]);
   assert.equal(braces(slim),0,id);
   assert.ok(slim.includes("float contactNeural=clamp(incomingCore*core*incomingNeural"));
   assert.ok(slim.includes("outgoingNeural=clamp(nerveStrength*core"));
   assert.ok(slim.includes("thread=mix(thread,thread*.42+nerveChromatic*.96"));
 }
 assert.equal(specializeFilamentNeural(filamentGLSL,null),filamentGLSL);
 assert.equal(specializeFilamentNeural(filamentGLSL,-1),filamentGLSL);
 assert.equal(specializeFilamentNeural(filamentGLSL,999),filamentGLSL);
});

test("color reflex senses local palette contrast and parent cross-luma at real intersections",()=>{
 assert.match(filamentGLSL,/neighborLuma=dot\(palette\(fract\(pigmentPhase\+\.045\)\)/);
 assert.match(filamentGLSL,/stimulusGate=smoothstep/);
 assert.match(filamentGLSL,/contactNeural=clamp\(incomingCore\*core\*incomingNeural/);
 assert.match(filamentGLSL,/contactChromatic=contactNeural\*/);
 assert.match(filamentGLSL,/outgoingLuma=colorLuma/);
 assert.match(filamentGLSL,/outgoingNeural=clamp\(nerveStrength\*core/);
 assert.match(filamentGLSL,/firstNeural,firstLuma/);
 assert.match(filamentGLSL,/firstNeural,firstLuma,\s*secondCore/);
 assert.match(filamentGLSL,/core\*=reveal/);
 assert.match(filamentGLSL,/q\+=nerveDisplacement\*filamentNeuralAmount/);
 // Neural shader performs no readback, feedback or cross-frame accumulation.
 assert.doesNotMatch(filamentGLSL,/copyTexSubImage2D|sampler2D/);
});

test("22 geometries × 31 stitch modes compose with previous material/jewelry/morph/contagion",()=>{
 for(let g=0;g<filamentSpecies.length;g++){
   let code=specializeFilamentGeometry(filamentGLSL,g,(g+3)%filamentSpecies.length);
   for(let stitch=0;stitch<filamentStitchModes.length;stitch++){
     let chosen=specializeFilamentStitchMotion(code,stitch);
     chosen=specializeFilamentMaterials(chosen,2,12);
     chosen=specializeFilamentMorphMaterials(chosen,3,13);
     chosen=specializeFilamentAdornments(chosen,9,11);
     chosen=specializeFilamentContagion(chosen,2);
     chosen=specializeFilamentNeural(chosen,1+stitch%8);
     assert.equal(braces(chosen),0,g+"/"+stitch);
     assert.match(chosen,/vec3 livingFilamentForge/);
     assert.deepEqual([...chosen.matchAll(/(?:if|else if)\(filamentNeuralMode==(\d+)\)/g)]
       .map(x=>Number(x[1])),[1+stitch%8]);
   }
 }
});

test("preview/export, saved UI, reset, and previous GPU history repair remain intact",()=>{
 const render=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
 const inspector=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
 const exporter=readFileSync(new URL("../src/export.js",import.meta.url),"utf8");
 assert.match(render,/withNeural = withFilament/);
 assert.ok(render.includes("#define FILAMENT_NEURAL 1"));
 assert.ok(render.includes("specializeFilamentNeural("));
 assert.ok(render.includes("filamentNeuralUnavailable=true"));
 assert.ok(render.includes("memory.readIndex=writeIndex"));
 assert.ok(render.includes('if(exactEffects)throw artworkParityError("Full-effect shader failed to compile",e)'));
 assert.ok(exporter.includes("createRenderer(canvas,{exactEffects:true})"));
 for(const label of ["NEURAL LOOM","Electrify the threads",
   "Shuffle nervous systems","Shuffle feral synapses",
   "Sedate the weave","filamentNeuralPresets.map"])
   assert.ok(inspector.includes(label),label);
 assert.ok(sectionMeta("filament").reset.includes("filamentNeuralAmount"));
 for(const mode of modes.slice(1))
   assert.ok(findControls(mode).some(x=>x.id==="filament"),mode);
 const random=randomize(oldArt,{},false,()=>.78);
 assert.ok(modes.includes(random.filamentNeuralMode));
});
