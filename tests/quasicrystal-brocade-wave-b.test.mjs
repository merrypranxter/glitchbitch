import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,numericRanges,validateRecipe,recipeDocument,parseDocument,randomize} from "../src/data.js";
import {sectionMeta,findControls} from "../src/ui-index.js";
import {
  filamentSpecies,filamentStitchModes,filamentGLSL,
  specializeFilamentGeometry,specializeFilamentStitchMotion,
  quasicrystalBrocadeControls,quasicrystalBrocadePresets,
  applyQuasicrystalBrocadePreset,remixQuasicrystalBrocade,
  applyChladniNeedlePreset,chladniNeedlePresets,
} from "../src/filament-forge.js";
const source=file=>readFileSync(new URL("../src/"+file,import.meta.url),"utf8");
const balance=str=>[...str].reduce((n,c)=>n+(c==="{")-(c==="}"),0);
const ids=(str)=>[...str.matchAll(/if\(species==(\d+)\)/g)].map(m=>Number(m[1]));
const saveArt={...initial,seed:461173,ratio:"9:16",engine:12,
  colors:["#ff22cc","#00eaff","#ffee11"],lettering:"WEAVE THE IMPOSSIBLE",
  filamentAmount:74,filamentSpecies:"Feral Jacquard",
  filamentSecondSpecies:"Voronoi lace",filamentCrossbreed:62,
  filamentMaterial:"Molten chrome",filamentSecondMaterial:"Velvet flock",
  filamentStitchMode:"Chladni Needle Orchestra",filamentStitchAmount:93};

test("Quasicrystal Brocade is append-only species 23; no old IDs change",()=>{
  assert.equal(filamentSpecies.length,24);
  assert.equal(filamentSpecies[22],"Feral Jacquard");
  assert.equal(filamentSpecies[23],"Quasicrystal Brocade");
  assert.equal(filamentStitchModes[31],"Chladni Needle Orchestra");
  assert.equal(new Set(filamentSpecies).size,24);
  assert.equal(quasicrystalBrocadePresets.length,6);
  assert.equal(quasicrystalBrocadeControls.length,6);
  assert.equal(new Set(quasicrystalBrocadePresets.map(p=>p.name)).size,6);
});
test("Six valid control ranges are recipe-safe; legacy art never opts in",()=>{
  assert.equal(initial.filamentSpecies,"Fivefold brocade");
  assert.equal(initial.filamentAmount,0);
  const old={...saveArt};
  for(const key of quasicrystalBrocadeControls)delete old[key];
  const loaded=validateRecipe(old);
  assert.equal(loaded.filamentSpecies,saveArt.filamentSpecies);
  for(const key of quasicrystalBrocadeControls){
    assert.deepEqual(numericRanges[key],[0,100]);
    assert.equal(loaded[key],initial[key]);
    assert.throws(()=>validateRecipe({...saveArt,[key]:-1}),new RegExp("Invalid "+key));
    assert.throws(()=>validateRecipe({...saveArt,[key]:101}),new RegExp("Invalid "+key));
  }
});
test("Six named specimens are real distinct parameter sets; no palette/text/crossbreed destruction",()=>{
  const snapshots=new Set();
  for(const preset of quasicrystalBrocadePresets){
    const applied=applyQuasicrystalBrocadePreset(saveArt,preset.name);
    assert.equal(applied.filamentSpecies,"Quasicrystal Brocade");
    assert.ok(applied.filamentAmount>=70);
    for(const key of quasicrystalBrocadeControls){
      assert.equal(applied[key],preset[key],key);
      assert.ok(preset[key]>=0&&preset[key]<=100,key);
    }
    for(const key of ["seed","engine","ratio","colors","lettering",
      "filamentSecondSpecies","filamentMaterial","filamentSecondMaterial",
      "filamentStitchMode","filamentStitchAmount","filamentCrossbreed"])
      assert.deepEqual(applied[key],saveArt[key],key);
    assert.deepEqual(validateRecipe(applied),applied);
    assert.deepEqual(parseDocument(recipeDocument(applied,"Five-grid",
      {time:1.25,colorTime:2.5})).state,applied);
    const duo=applyChladniNeedlePreset(applied,chladniNeedlePresets[1].name);
    assert.equal(duo.filamentSpecies,"Quasicrystal Brocade");
    assert.equal(duo.filamentStitchMode,"Chladni Needle Orchestra");
    snapshots.add(quasicrystalBrocadeControls.map(k=>preset[k]).join(":"));
  }
  assert.equal(snapshots.size,6);
  assert.equal(applyQuasicrystalBrocadePreset(saveArt,"bad preset"),saveArt);
});
test("Targeted shuffle works at all RNG extremes and keeps the other systems intact",()=>{
  for(const n of [0,.17,.57,.999999,NaN]){
    const random=()=>n;
    const shuffled=remixQuasicrystalBrocade(saveArt,random);
    assert.deepEqual(shuffled,remixQuasicrystalBrocade(saveArt,random));
    assert.equal(shuffled.filamentSpecies,"Quasicrystal Brocade");
    for(const key of ["colors","lettering","seed","filamentSecondSpecies",
      "filamentMaterial","filamentSecondMaterial","filamentStitchMode"])
      assert.deepEqual(shuffled[key],saveArt[key]);
    for(const key of quasicrystalBrocadeControls)
      assert.ok(shuffled[key]>=0&&shuffled[key]<=100,key);
    assert.deepEqual(validateRecipe(shuffled),shuffled);
  }
  const using=applyQuasicrystalBrocadePreset(saveArt,quasicrystalBrocadePresets[0].name);
  const changed=randomize(using,{},true,()=>.79);
  assert.equal(changed.filamentSpecies,"Quasicrystal Brocade");
  assert.equal(changed.filamentStitchMode,using.filamentStitchMode);
  assert.notEqual(changed.filamentQuasiSpacing,using.filamentQuasiSpacing);
  assert.equal(changed.lettering,using.lettering);
  const dormant=randomize(saveArt,{},true,()=>.79);
  for(const key of quasicrystalBrocadeControls)
    assert.equal(dormant[key],saveArt[key],"must not mutate dormant parameter "+key);
});
test("selected geometry is genuine compact five-grid, not old sine-sum Fivefold branch",()=>{
  const solo=specializeFilamentGeometry(filamentGLSL,23);
  const hybrid=specializeFilamentGeometry(filamentGLSL,0,23);
  const sewn=specializeFilamentStitchMotion(solo,31);
  assert.deepEqual(ids(solo),[23]);
  assert.deepEqual(ids(hybrid),[0,23]);
  assert.deepEqual(ids(sewn),[23]);
  assert.deepEqual([...sewn.matchAll(/if\(filamentStitchMode==(\d+)\)/g)].map(m=>+m[1]),[31]);
  assert.ok(solo.length<filamentGLSL.length);
  assert.ok(hybrid.length<filamentGLSL.length);
  for(const src of [filamentGLSL,solo,hybrid,sewn]){
    assert.equal(balance(src),0,"balanced GLSL");
    assert.doesNotMatch(src,/\bactive\b|texelFetch|texture2D|\bfwidth\b/);
  }
  for(const needle of ["for(int i=0;i<5;i++)","vec2 normal=vec2(cos(angle),sin(angle))",
    "float signedLine=fract(coord+.5)-.5","runnerUp",
    "quasiJunction=junction","quasiLift=clamp",
    "if(species==23 && filamentQuasiRelief>0.0)",
    "result+=mix(ink,glimmer","core*amount*lift"])
    assert.ok(solo.includes(needle),needle);
  assert.ok(sewn.includes("core*=reveal"));
  assert.ok(sewn.includes("nodalBand"));
  for(let id=0;id<23;id++){
    const old=specializeFilamentGeometry(filamentGLSL,id);
    assert.deepEqual(ids(old),[id],"old geometry "+id);
  }
});
test("Find, Reset, six sliders and shared exact-effects export all contain the law",()=>{
  const meta=sectionMeta("filament");
  const renderer=source("renderer.js"),ui=source("components/Inspectors.jsx"),
    exportCode=source("export.js");
  assert.ok(findControls("quasicrystal brocade").some(e=>e.id==="filament"));
  assert.ok(findControls("phason").some(e=>e.id==="filament"));
  assert.ok(ui.includes("remixQuasicrystalBrocade"));
  assert.ok(ui.includes("applyQuasicrystalBrocadePreset"));
  for(const key of quasicrystalBrocadeControls){
    assert.ok(ui.includes('name="'+key+'"'),key+" inspector");
    assert.ok(renderer.includes('"'+key+'"'),key+" uniform");
    assert.ok(meta.reset.includes(key),key+" reset");
  }
  assert.ok(renderer.includes("specializeFilamentGeometry(rawFilament"));
  assert.ok(renderer.includes("withHybrid?filamentSpecies.indexOf(s.filamentSecondSpecies)"));
  assert.ok(exportCode.includes("exactEffects"),"same scene-shader path for strict export");
});
