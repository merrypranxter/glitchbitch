import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,numericRanges,validateRecipe,recipeDocument,parseDocument,randomize} from "../src/data.js";
import {sectionMeta,findControls} from "../src/ui-index.js";
import {
  filamentSpecies,filamentStitchModes,filamentMaterials,
  filamentContagionModes,filamentContagionFamilies,filamentContagionControls,
  filamentContagionDescriptions,filamentContagionPresets,
  applyFilamentContagionPreset,remixFilamentContagion,
  filamentGLSL,specializeFilamentContagion,specializeFilamentGeometry,
  specializeFilamentStitchMotion,specializeFilamentMaterials,
  specializeFilamentMorphMaterials,specializeFilamentAdornments
} from "../src/filament-forge.js";

const names=["Off","Stitch relay","Crossing fever","Mycelial bridge",
  "Spark jump","Knot epidemic","Spore drift"];
const original={...initial,seed:18572,engine:12,ratio:"9:16",lettering:"THIS IS MY ART",
  colors:["#ff00ff","#00ff00","#fffa00"],filamentAmount:85,
  filamentSpecies:"Bobbin lace",filamentSecondSpecies:"Chevron herringbone",
  filamentCrossbreed:87,filamentMaterial:"Iridescent silk",
  filamentSecondMaterial:"Oil-slick latex",filamentStitchMode:"Fractal mending",
  filamentStitchAmount:97,filamentMorphMode:"Fungal takeover",
  filamentMorphAmount:86,filamentMorphTarget:"Opaline glass",
  filamentSecondMorphTarget:"Bioluminescent mycelium",
  filamentAdornmentMode:"Watching eyes",filamentAdornmentAmount:92,
  filamentSculptAmount:88};
const unchanged=["seed","engine","ratio","lettering","colors","filamentSpecies",
  "filamentSecondSpecies","filamentCrossbreed","filamentMaterial",
  "filamentSecondMaterial","filamentStitchMode","filamentStitchAmount",
  "filamentAdornmentMode","filamentAdornmentAmount","filamentSculptAmount"];
const brace=s=>[...s].reduce((n,c)=>n+(c==="{")-(c==="}"),0);

test("six distinct transmission modes plus Off, with complete families and presets",()=>{
  assert.deepEqual(filamentContagionModes,names);
  assert.deepEqual(filamentContagionFamilies.flatMap(g=>g.modes),names);
  assert.equal(filamentContagionPresets.length,6);
  assert.equal(new Set(filamentContagionPresets.map(p=>p.name)).size,6);
  for(const mode of names)assert.ok(filamentContagionDescriptions[mode],mode);
  for(const c of filamentContagionControls)assert.deepEqual(numericRanges[c],[0,100]);
  for(const preset of filamentContagionPresets){
    assert.ok(names.includes(preset.filamentContagionMode));
    assert.notEqual(preset.filamentContagionMode,"Off");
    for(const field of filamentContagionControls)
      assert.ok(preset[field]>=0&&preset[field]<=100,field);
    assert.ok(filamentMaterials.includes(preset.filamentMorphTarget));
    assert.ok(filamentMaterials.includes(preset.filamentSecondMorphTarget));
  }
});

test("old artwork and unknown modes validate without involuntary infection",()=>{
  assert.equal(initial.filamentContagionMode,"Off");
  assert.equal(initial.filamentContagionAmount,0);
  const old={...original};
  for(const key of ["filamentContagionMode",...filamentContagionControls])delete old[key];
  const migrated=validateRecipe(old);
  assert.equal(migrated.filamentContagionMode,"Off");
  assert.equal(migrated.filamentContagionAmount,0);
  for(const key of unchanged)assert.deepEqual(migrated[key],original[key],key);
  assert.throws(()=>validateRecipe({...original,filamentContagionMode:"evil shader"}),
    /Unknown filamentContagionMode/);
  assert.throws(()=>validateRecipe({...original,filamentContagionAmount:-1}),
    /Invalid filamentContagionAmount/);
});

test("all 6 contagion recipes preserve geometry, text, base dressing and stitch laws",()=>{
  for(const preset of filamentContagionPresets){
    const state=applyFilamentContagionPreset({...original,filamentMorphMode:"Off",
      filamentMorphAmount:0},preset.name);
    assert.ok(state.filamentMorphAmount>=82);
    assert.equal(state.filamentMorphMode,"Seam sweep");
    assert.ok(state.filamentContagionAmount>0);
    assert.equal(state.filamentContagionMode,preset.filamentContagionMode);
    for(const key of unchanged)assert.deepEqual(state[key],original[key],key);
    assert.deepEqual(validateRecipe(state),state);
    const doc=recipeDocument(state,"Contagion",{time:3,colorTime:6});
    assert.deepEqual(parseDocument(doc).state,state);
  }
  assert.equal(applyFilamentContagionPreset(original,"not a recipe"),original);
});

test("shuffles preserve the artist's authored geometry and allow only bizarre infections",()=>{
  for(const x of [0,.27,.61,.9999,NaN]){
    for(const weird of [false,true]){
      const rng=()=>x;
      const first=remixFilamentContagion(original,rng,weird);
      const second=remixFilamentContagion(original,rng,weird);
      assert.deepEqual(first,second);
      for(const key of unchanged)assert.deepEqual(first[key],original[key],key);
      assert.ok(first.filamentContagionAmount>=72);
      assert.ok(first.filamentMorphAmount>=83);
      assert.notEqual(first.filamentMorphTarget,original.filamentMaterial);
      assert.notEqual(first.filamentSecondMorphTarget,original.filamentSecondMaterial);
      if(weird)assert.ok(names.slice(3).includes(first.filamentContagionMode));
      assert.deepEqual(validateRecipe(first),first);
    }
  }
});

test("shader compiles exactly one contagion law while preserving GLSL braces",()=>{
  for(let mode=1;mode<7;mode++){
    const slim=specializeFilamentContagion(filamentGLSL,mode);
    const selected=[...slim.matchAll(/(?:if|else if)\(filamentContagionMode==(\d+)\)/g)]
      .map(x=>Number(x[1]));
    assert.deepEqual(selected,[mode],names[mode]);
    assert.equal(brace(slim),0);
    assert.ok(slim.includes("outgoingCarrier=clamp(coverage*core"));
    assert.ok(slim.includes("incomingCore*core*incomingCarrier"));
  }
  assert.equal(specializeFilamentContagion(filamentGLSL,null),filamentGLSL);
  assert.equal(specializeFilamentContagion(filamentGLSL,999),filamentGLSL);
});

test("contact transfer is gated by actual sewn thread cores and a donor signal",()=>{
  assert.match(filamentGLSL,/float incomingCore,float incomingCarrier,/);
  assert.match(filamentGLSL,/float firstCore=0\.0,firstCarrier=0\.0/);
  assert.match(filamentGLSL,/0\.0,0\.0,0\.0,0\.0,0\.0,firstCore,firstCarrier/);
  assert.match(filamentGLSL,/firstCore,firstCarrier,secondCore,secondCarrier/);
  assert.match(filamentGLSL,/float contactTransfer=clamp\(incomingCore\*core\*incomingCarrier,0\.0,1\.0\)/);
  assert.match(filamentGLSL,/outgoingCarrier=clamp\(coverage\*core,0\.0,1\.0\)/);
  assert.match(filamentGLSL,/core\*=reveal/);
  // No hidden stateful simulation or additional feedback framebuffer.
  assert.doesNotMatch(filamentGLSL,/copyTexSubImage2D|sampler2D/);
});

test("all 22 × 31 actual weave/stitch variants retain compatible infectious shader code",()=>{
  for(let a=0;a<filamentSpecies.length;a++){
    const geom=specializeFilamentGeometry(filamentGLSL,a,(a+11)%filamentSpecies.length);
    for(let b=0;b<filamentStitchModes.length;b++){
      let shader=specializeFilamentStitchMotion(geom,b);
      shader=specializeFilamentMaterials(shader,2,12);
      shader=specializeFilamentMorphMaterials(shader,3,13);
      shader=specializeFilamentAdornments(shader,8,9);
      shader=specializeFilamentContagion(shader,1+(b%6));
      assert.equal(brace(shader),0,a+"/"+b);
      assert.match(shader,/vec3 livingFilamentForge/);
      assert.match(shader,/float contagionClock=time\*/);
      assert.match(shader,/float contactTransfer=clamp/);
      assert.deepEqual([...shader.matchAll(/(?:if|else if)\(filamentContagionMode==(\d+)\)/g)]
        .map(m=>Number(m[1])),[1+(b%6)]);
    }
  }
});

test("shared strict export, preview fallback, undo/reset, and mobile UI all include contagion",()=>{
  const render=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
  const ui=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
  const exporter=readFileSync(new URL("../src/export.js",import.meta.url),"utf8");
  assert.ok(render.includes("withContagion = withMorph"));
  assert.ok(render.includes("FILAMENT_CONTAGION 1"));
  assert.ok(render.includes("specializeFilamentContagion("));
  assert.ok(render.includes("filamentContagionUnavailable=true"));
  assert.ok(render.includes("memory.readIndex=writeIndex"));
  assert.ok(render.includes('if(exactEffects)throw artworkParityError("Full-effect shader failed to compile",e)'));
  assert.ok(exporter.includes("createRenderer(canvas,{exactEffects:true})"));
  assert.ok(sectionMeta("filament").reset.includes("filamentContagionAmount"));
  for(const mode of names.slice(1))
    assert.ok(findControls(mode).some(x=>x.id==="filament"),mode);
  for(const label of ["CONTAGION LOOM","Infect the loom","Shuffle contagions",
    "Shuffle cursed infections","Quarantine","filamentContagionPresets.map"])
    assert.ok(ui.includes(label),label);
  const surprise=randomize(original,{},false,()=>.75);
  assert.ok(names.includes(surprise.filamentContagionMode));
});
