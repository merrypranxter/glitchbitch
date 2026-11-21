import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,numericRanges,validateRecipe,recipeDocument,parseDocument,randomize} from "../src/data.js";
import {sectionMeta,findControls} from "../src/ui-index.js";
import {
  filamentSpecies,filamentStitchModes,filamentMaterials,
  filamentPlasticModes,filamentPlasticFamilies,filamentPlasticControls,
  filamentPlasticDescriptions,filamentPlasticPresets,
  applyFilamentPlasticPreset,remixFilamentPlastic,
  filamentGLSL,specializeFilamentGeometry,specializeFilamentStitchMotion,
  specializeFilamentMaterials,specializeFilamentMorphMaterials,
  specializeFilamentAdornments,specializeFilamentContagion,
  specializeFilamentNeural,specializeFilamentPlasticity
} from "../src/filament-forge.js";

const modes=["Off","Hebbian bloom","Inhibitory lace","Echo synapses",
  "Resonant choir","Pruning wave","Dream consolidation"];
const art={...initial,engine:12,seed:79315,ratio:"9:16",
  lettering:"DO NOT TOUCH THESE WORDS",colors:["#ff00ff","#00ffee","#faff00"],
  filamentAmount:83,filamentSpecies:"Bobbin lace",
  filamentSecondSpecies:"Möbius cable",filamentCrossbreed:87,
  filamentMaterial:"Iridescent silk",filamentSecondMaterial:"Oil-slick latex",
  filamentStitchMode:"Cross-stitch",filamentStitchAmount:97,
  filamentAdornmentMode:"Watching eyes",filamentAdornmentAmount:84,
  filamentMorphMode:"Fungal takeover",filamentMorphAmount:88,
  filamentMorphTarget:"Opaline glass",
  filamentSecondMorphTarget:"Bioluminescent mycelium",
  filamentContagionMode:"Crossing fever",filamentContagionAmount:81,
  filamentNeuralMode:"Synaptic handshake",filamentNeuralAmount:92};
const protectedKeys=["engine","seed","ratio","lettering","colors","filamentSpecies",
  "filamentSecondSpecies","filamentCrossbreed","filamentMaterial",
  "filamentSecondMaterial","filamentStitchMode","filamentStitchAmount",
  "filamentAdornmentMode","filamentAdornmentAmount","filamentMorphMode",
  "filamentMorphAmount","filamentMorphTarget","filamentSecondMorphTarget",
  "filamentContagionMode","filamentContagionAmount"];
const braces=s=>[...s].reduce((n,c)=>n+(c==="{")-(c==="}"),0);

test("six adaptive nerve behaviors and six complete presets",()=>{
  assert.deepEqual(filamentPlasticModes,modes);
  assert.deepEqual(filamentPlasticFamilies.flatMap(f=>f.modes),modes);
  assert.equal(filamentPlasticPresets.length,6);
  assert.equal(new Set(filamentPlasticPresets.map(p=>p.name)).size,6);
  for(const name of modes)assert.ok(filamentPlasticDescriptions[name],name);
  for(const field of filamentPlasticControls)
    assert.deepEqual(numericRanges[field],[0,100]);
  for(const p of filamentPlasticPresets){
    assert.notEqual(p.filamentPlasticMode,"Off");
    for(const key of filamentPlasticControls)
      assert.ok(p[key]>=0&&p[key]<=100,p.name+" "+key);
  }
});

test("legacy art is fully inert and invalid plasticity settings are rejected",()=>{
  assert.equal(initial.filamentPlasticMode,"Off");
  assert.equal(initial.filamentPlasticAmount,0);
  const previous={...art};
  for(const k of ["filamentPlasticMode",...filamentPlasticControls])
    delete previous[k];
  const restored=validateRecipe(previous);
  assert.equal(restored.filamentPlasticMode,"Off");
  assert.equal(restored.filamentPlasticAmount,0);
  for(const k of protectedKeys)
    assert.deepEqual(restored[k],art[k],k);
  assert.throws(()=>validateRecipe({...art,filamentPlasticMode:"bad GLSL"}),
    /Unknown filamentPlasticMode/);
  assert.throws(()=>validateRecipe({...art,filamentPlasticRate:101}),
    /Invalid filamentPlasticRate/);
});

test("one-tap recipes enable neural activity but preserve authored art and dresses",()=>{
  for(const preset of filamentPlasticPresets){
    const result=applyFilamentPlasticPreset({...art,filamentNeuralMode:"Off",
      filamentNeuralAmount:0},preset.name);
    assert.equal(result.filamentPlasticMode,preset.filamentPlasticMode);
    assert.equal(result.filamentNeuralMode,"Axon train");
    assert.ok(result.filamentPlasticAmount>0);
    assert.ok(result.filamentNeuralAmount>=80);
    for(const k of protectedKeys)
      assert.deepEqual(result[k],art[k],preset.name+" "+k);
    assert.deepEqual(validateRecipe(result),result);
    const doc=recipeDocument(result,"Plastic nerve art",{time:3,colorTime:2});
    assert.deepEqual(parseDocument(doc).state,result);
  }
  assert.equal(applyFilamentPlasticPreset(art,"missing"),art);
});

test("shuffles are deterministic, support strange-only choices and don't alter original work",()=>{
  for(const value of [0,.3,.71,.99999,NaN]){
    for(const weird of [false,true]){
      const a=remixFilamentPlastic(art,()=>value,weird);
      const b=remixFilamentPlastic(art,()=>value,weird);
      assert.deepEqual(a,b);
      assert.ok(a.filamentPlasticAmount>=75);
      assert.ok(modes.includes(a.filamentPlasticMode));
      if(weird)assert.ok(modes.slice(4).includes(a.filamentPlasticMode));
      for(const key of protectedKeys)assert.deepEqual(a[key],art[key],key);
      assert.deepEqual(validateRecipe(a),a);
    }
  }
});

test("shader compiles only one selected synaptic plasticity law",()=>{
  for(let id=1;id<modes.length;id++){
    const shader=specializeFilamentPlasticity(filamentGLSL,id);
    const selected=[...shader.matchAll(/(?:if|else if)\(filamentPlasticMode==(\d+)\)/g)]
      .map(x=>Number(x[1]));
    assert.deepEqual(selected,[id],modes[id]);
    assert.equal(braces(shader),0,id);
    assert.ok(shader.includes("float contactNeural=clamp(incomingCore*core*incomingNeural"));
    assert.ok(shader.includes("neuralSignal=mix(preplastic,clamp(preplastic+plasticDelta"));
    assert.ok(shader.includes("outgoingNeural=clamp(nerveStrength*core"));
    assert.ok(shader.includes("thread+=mix(ink,glimmer,.62)*core*filamentPlasticAmount"));
  }
  assert.equal(specializeFilamentPlasticity(filamentGLSL,null),filamentGLSL);
  assert.equal(specializeFilamentPlasticity(filamentGLSL,99),filamentGLSL);
});

test("contact-based plasticity uses the real stitched crossing rather than screen dots",()=>{
  assert.match(filamentGLSL,/float contactNeural=clamp\(incomingCore\*core\*incomingNeural/);
  assert.match(filamentGLSL,/float donorCoincidence=clamp\(contactNeural\*neuralSignal/);
  assert.match(filamentGLSL,/outgoingNeural=clamp\(nerveStrength\*core/);
  assert.match(filamentGLSL,/core\*=reveal/);
  assert.doesNotMatch(filamentGLSL,/copyTexSubImage2D|sampler2D/);
});

test("all 22×31 woven/stitch pairings compose with neural, material, ornaments, and plasticity",()=>{
  for(let geom=0;geom<filamentSpecies.length;geom++){
    const geometry=specializeFilamentGeometry(filamentGLSL,geom,
      (geom+7)%filamentSpecies.length);
    for(let sewing=0;sewing<filamentStitchModes.length;sewing++){
      let shader=specializeFilamentStitchMotion(geometry,sewing);
      shader=specializeFilamentMaterials(shader,2,12);
      shader=specializeFilamentMorphMaterials(shader,3,13);
      shader=specializeFilamentAdornments(shader,8,9);
      shader=specializeFilamentContagion(shader,1+(sewing%6));
      shader=specializeFilamentNeural(shader,1+(sewing%8));
      shader=specializeFilamentPlasticity(shader,1+(sewing%6));
      assert.equal(braces(shader),0,geom+"/"+sewing);
      assert.deepEqual(
        [...shader.matchAll(/(?:if|else if)\(filamentPlasticMode==(\d+)\)/g)]
          .map(x=>Number(x[1])),[1+(sewing%6)]);
      assert.ok(shader.includes("vec3 livingFilamentForge"));
      assert.ok(shader.includes("float plasticClock=time*"));
    }
  }
});

test("shared renderer and strict video export keep this exact neural shader",()=>{
  const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
  const ui=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
  const exportSource=readFileSync(new URL("../src/export.js",import.meta.url),"utf8");
  for(const token of ["withPlastic = withNeural","FILAMENT_PLASTICITY 1",
    "specializeFilamentPlasticity(","filamentPlasticUnavailable=true",
    "filamentNeuralAmount","memory.readIndex=writeIndex",
    'if(exactEffects)throw artworkParityError("Full-effect shader failed to compile",e)'])
    assert.ok(renderer.includes(token),token);
  assert.ok(exportSource.includes("createRenderer(canvas,{exactEffects:true})"));
  for(const token of ["SYNAPTIC PLASTICITY","Sculpt synapses",
    "Shuffle plasticity","Shuffle strange synapses",
    "Quiet synapses — keep the nerves","filamentPlasticPresets.map"])
    assert.ok(ui.includes(token),token);
  assert.ok(sectionMeta("filament").reset.includes("filamentPlasticAmount"));
  for(const name of modes.slice(1))
    assert.ok(findControls(name).some(x=>x.id==="filament"),name);
  const newArt=randomize(art,{},false,()=>.71);
  assert.ok(modes.includes(newArt.filamentPlasticMode));
});
