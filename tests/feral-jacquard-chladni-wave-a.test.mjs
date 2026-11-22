import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,numericRanges,validateRecipe,recipeDocument,parseDocument,randomize} from "../src/data.js";
import {findControls,sectionMeta} from "../src/ui-index.js";
import {
  filamentSpecies,filamentStitchModes,filamentStitchControls,
  filamentGLSL,specializeFilamentGeometry,specializeFilamentStitchMotion,
  feralJacquardControls,feralJacquardPresets,applyFeralJacquardPreset,remixFeralJacquard,
  chladniNeedleControls,chladniNeedlePresets,applyChladniNeedlePreset,remixChladniNeedles
} from "../src/filament-forge.js";

const read=(file)=>readFileSync(new URL("../src/"+file,import.meta.url),"utf8");
const balance=s=>[...s].reduce((n,c)=>n+(c==="{")-(c==="}"),0);
const original={...initial,seed:291182,engine:6,ratio:"9:16",
  filamentAmount:82,filamentSpecies:"Bobbin lace",
  filamentSecondSpecies:"Voronoi lace",filamentSecondMaterial:"Velvet flock",
  filamentCrossbreed:71,filamentStitchMode:"Cross-stitch",filamentStitchAmount:80,
  lettering:"DONT EAT MY NEON",colors:["#ff00ff","#00eeff","#ffff22"]};

test("new species and stitch append exactly after legacy IDs",()=>{
  assert.equal(filamentSpecies.length,24);
  assert.equal(filamentSpecies[21],"Parasitic ladder");
  assert.equal(filamentSpecies[22],"Feral Jacquard");
  assert.equal(filamentStitchModes.length,32);
  assert.equal(filamentStitchModes[30],"Fractal mending");
  assert.equal(filamentStitchModes[31],"Chladni Needle Orchestra");
  assert.deepEqual(filamentStitchControls,["filamentStitchAmount","filamentStitchSpeed",
    "filamentStitchLength","filamentStitchGlow"],"old presets still share four universal sliders");
  assert.equal(feralJacquardPresets.length,5);
  assert.equal(chladniNeedlePresets.length,5);
  for(const k of [...feralJacquardControls,...chladniNeedleControls])
    assert.deepEqual(numericRanges[k],[0,100],k);
});
test("all ten controls survive recipe validation and preserve legacy work",()=>{
  const old={...original};
  for(const k of [...feralJacquardControls,...chladniNeedleControls])delete old[k];
  const validated=validateRecipe(old);
  assert.equal(validated.filamentSpecies,"Bobbin lace");
  assert.equal(validated.filamentStitchMode,"Cross-stitch");
  for(const k of [...feralJacquardControls,...chladniNeedleControls])
    assert.equal(validated[k],initial[k],k);
  for(const k of [...feralJacquardControls,...chladniNeedleControls]){
    assert.throws(()=>validateRecipe({...original,[k]:101}),new RegExp("Invalid "+k));
    assert.throws(()=>validateRecipe({...original,[k]:-1}),new RegExp("Invalid "+k));
  }
  assert.equal(validateRecipe({...original,filamentSpecies:"Feral Jacquard"}).filamentSpecies,
    "Feral Jacquard");
  assert.equal(validateRecipe({...original,filamentStitchMode:"Chladni Needle Orchestra"}).filamentStitchMode,
    "Chladni Needle Orchestra");
});
test("feral and Chladni presets can layer without clobbering artwork or each other",()=>{
  for(const p of feralJacquardPresets){
    const switched=applyFeralJacquardPreset(original,p.name);
    assert.equal(switched.filamentSpecies,"Feral Jacquard");
    for(const k of ["seed","engine","ratio","colors","lettering",
      "filamentStitchMode","filamentStitchAmount","filamentMaterial",
      "filamentSecondSpecies","filamentSecondMaterial","filamentCrossbreed"])
      assert.deepEqual(switched[k],original[k],k);
    for(const k of feralJacquardControls)assert.equal(switched[k],p[k],p.name+" "+k);
    for(const score of chladniNeedlePresets){
      const duo=applyChladniNeedlePreset(switched,score.name);
      assert.equal(duo.filamentSpecies,"Feral Jacquard");
      assert.equal(duo.filamentStitchMode,"Chladni Needle Orchestra");
      for(const k of feralJacquardControls)assert.equal(duo[k],p[k]);
      for(const k of chladniNeedleControls)assert.equal(duo[k],score[k]);
      for(const k of ["seed","engine","ratio","colors","lettering",
        "filamentMaterial","filamentSecondSpecies","filamentCrossbreed"])
        assert.deepEqual(duo[k],original[k],k);
      const doc=recipeDocument(duo,"Haunted Loom",{time:4,colorTime:2});
      assert.deepEqual(parseDocument(doc).state,validateRecipe(duo));
    }
  }
  assert.equal(applyFeralJacquardPreset(original,"not there"),original);
  assert.equal(applyChladniNeedlePreset(original,"not there"),original);
});
test("targeted shuffles preserve authored work and keep both new systems independent",()=>{
  for(const n of [0,.13,.4,.78,.999999,NaN]){
    const random=()=>n;
    const feral=remixFeralJacquard(original,random);
    const chladni=remixChladniNeedles(feral,random);
    assert.equal(feral.filamentSpecies,"Feral Jacquard");
    assert.equal(chladni.filamentStitchMode,"Chladni Needle Orchestra");
    assert.equal(feral.filamentStitchMode,original.filamentStitchMode);
    assert.equal(chladni.filamentSpecies,feral.filamentSpecies);
    for(const k of feralJacquardControls)assert.deepEqual(chladni[k],feral[k]);
    for(const k of ["seed","colors","lettering","filamentSecondSpecies","filamentSecondMaterial"])
      assert.deepEqual(chladni[k],original[k],k);
    assert.deepEqual(validateRecipe(chladni),chladni);
  }
  const edited=applyChladniNeedlePreset(
    applyFeralJacquardPreset(original,feralJacquardPresets[1].name),
    chladniNeedlePresets[1].name);
  const mutated=randomize(edited,{},true,()=>.72);
  assert.equal(mutated.filamentSpecies,"Feral Jacquard");
  assert.equal(mutated.filamentStitchMode,"Chladni Needle Orchestra");
  assert.notEqual(mutated.filamentFeralCorruption,edited.filamentFeralCorruption);
  assert.notEqual(mutated.filamentChladniOrder,edited.filamentChladniOrder);
  assert.equal(mutated.lettering,edited.lettering);
});
test("Feral / Chladni are real isolated GLSL geometry and stitch branches",()=>{
  const originalSpecies=filamentSpecies.slice(0,22);
  const originalStitches=filamentStitchModes.slice(0,31);
  assert.equal(new Set(originalSpecies).size,22);
  assert.equal(new Set(originalStitches).size,31);
  const solo=specializeFilamentGeometry(filamentGLSL,22);
  const score=specializeFilamentStitchMotion(filamentGLSL,31);
  const duo=specializeFilamentStitchMotion(solo,31);
  const hybrid=specializeFilamentGeometry(filamentGLSL,0,22);
  const extract=(s,regex)=>[...s.matchAll(regex)].map(m=>Number(m[1]));
  assert.deepEqual(extract(solo,/if\(species==(\d+)\)/g),[22]);
  assert.deepEqual(extract(score,/if\(filamentStitchMode==(\d+)\)/g),[31]);
  assert.deepEqual(extract(duo,/if\(species==(\d+)\)/g),[22]);
  assert.deepEqual(extract(duo,/if\(filamentStitchMode==(\d+)\)/g),[31]);
  assert.deepEqual(extract(hybrid,/if\(species==(\d+)\)/g),[0,22]);
  for(const s of [filamentGLSL,solo,score,duo,hybrid]){
    assert.equal(balance(s),0);
    assert.doesNotMatch(s,/\bactive\b|texture2D|texelFetch|\bfwidth\b/);
  }
  assert.ok(duo.length<filamentGLSL.length);
  for(const needle of ["warpCoord","weftCoord","warpAbove","knotMask","threadD=min"])
    assert.ok(duo.includes(needle),needle);
  for(const needle of ["harmonicA","harmonicB","nodalBand","visibleStitch=",
    "needle=nodalBand","core*=reveal","halo*=reveal"])
    assert.ok(duo.includes(needle),needle);
  assert.ok(duo.includes("sewClock=time*"));
});
test("UI controls, reset, search, rendering, strict export share the saved state",()=>{
  const ui=read("components/Inspectors.jsx");
  const renderer=read("renderer.js");
  const exportCode=read("export.js");
  const meta=sectionMeta("filament");
  for(const term of ["feral jacquard","chladni","cymatic",
    "structural corruption","needle orchestra"])
    assert.ok(findControls(term).some(x=>x.id==="filament"),term);
  for(const k of [...feralJacquardControls,...chladniNeedleControls]){
    assert.ok(meta.reset.includes(k),k);
    assert.ok(ui.includes('name="'+k+'"'),k);
    assert.ok(renderer.includes('"'+k+'"'),k);
  }
  for(const needle of ["applyFeralJacquardPreset","remixFeralJacquard",
    "applyChladniNeedlePreset","remixChladniNeedles"])
    assert.ok(ui.includes(needle),needle);
  assert.ok(renderer.includes("specializeFilamentGeometry(rawFilament"));
  assert.ok(renderer.includes("specializeFilamentStitchMotion("));
  assert.ok(renderer.includes("withStitch?filamentStitchModes.indexOf(s.filamentStitchMode)"));
  assert.ok(renderer.includes('withFilament?"col=livingFilamentForge(col,uv,p,v);":""'));
  assert.ok(exportCode.includes("exactEffects"),"preview and export must keep the shared GPU shader");
});
