import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,numericRanges,validateRecipe,recipeDocument,parseDocument,randomize} from "../src/data.js";
import {findControls,sectionMeta} from "../src/ui-index.js";
import {filamentSpecies,filamentStitchModes,filamentStitchFamilies,
  filamentStitchPresets,filamentStitchControls,filamentGLSL,
  specializeFilamentGeometry,specializeFilamentStitchMotion,
  retrocausalEmbroideryControls,retrocausalEmbroideryPresets,
  applyRetrocausalEmbroideryPreset,remixRetrocausalEmbroidery
} from "../src/filament-forge.js";

const read=path=>readFileSync(new URL("../src/"+path,import.meta.url),"utf8");
const balance=s=>(s.match(/\{/g)||[]).length-(s.match(/\}/g)||[]).length;
const selectedModes=s=>[...s.matchAll(/if\(filamentStitchMode==(\d+)\)/g)].map(x=>+x[1]);
const art={...initial,engine:14,ratio:"9:16",seed:911823,
  colors:["#ff00ff","#00eaff","#ffe000"],lettering:"THE FUTURE ALREADY SEWED THIS",
  filamentAmount:89,filamentSpecies:"Quasicrystal Brocade",
  filamentSecondSpecies:"Feral Jacquard",filamentCrossbreed:77,
  filamentMaterial:"Original thread",filamentSecondMaterial:"Velvet flock",
  filamentOpticsMode:"Soap-film opal",filamentOpticsAmount:76,
  filamentSecondOpticsMode:"Anisotropic chrome",filamentSecondOpticsAmount:82,
  filamentStitchMode:"Chladni Needle Orchestra",filamentStitchAmount:83};

test("append-only temporal stitch #32; none of the 32 pre-existing modes change",()=>{
  assert.equal(filamentSpecies.length,24);
  assert.equal(filamentStitchModes.length,33);
  assert.equal(new Set(filamentStitchModes).size,33);
  assert.equal(filamentStitchModes[31],"Chladni Needle Orchestra");
  assert.equal(filamentStitchModes[32],"Retrocausal Embroidery");
  assert.equal(filamentStitchFamilies.flatMap(f=>f.modes).length,33);
  assert.equal(new Set(filamentStitchFamilies.flatMap(f=>f.modes)).size,33);
  assert.equal(filamentStitchPresets.length,42);
  assert.equal(retrocausalEmbroideryPresets.length,6);
  assert.deepEqual(filamentStitchControls,[
    "filamentStitchAmount","filamentStitchSpeed",
    "filamentStitchLength","filamentStitchGlow"
  ],"the four original universal sliders must not change");
});
test("six parameters validated with safe legacy defaults and no auto-activation",()=>{
  assert.equal(initial.filamentStitchMode,"Needle chase");
  assert.equal(initial.filamentStitchAmount,0);
  const legacy={...art};
  for(const key of retrocausalEmbroideryControls)delete legacy[key];
  const restored=validateRecipe(legacy);
  for(const key of retrocausalEmbroideryControls){
    assert.deepEqual(numericRanges[key],[0,100],key);
    assert.equal(restored[key],initial[key],key);
    assert.throws(()=>validateRecipe({...art,[key]:101}),new RegExp("Invalid "+key));
    assert.throws(()=>validateRecipe({...art,[key]:-1}),new RegExp("Invalid "+key));
  }
  assert.equal(restored.filamentStitchMode,"Chladni Needle Orchestra");
  assert.equal(validateRecipe({...art,filamentStitchMode:"Retrocausal Embroidery"}).filamentStitchMode,
    "Retrocausal Embroidery");
});
test("six unique named time scores can pair with every current fiber material, palette and hybrid",()=>{
  const specs=new Set();
  for(const score of retrocausalEmbroideryPresets){
    const s=applyRetrocausalEmbroideryPreset(art,score.name);
    assert.equal(s.filamentStitchMode,"Retrocausal Embroidery");
    assert.equal(s.filamentAmount,art.filamentAmount);
    for(const key of retrocausalEmbroideryControls)assert.equal(s[key],score[key],key);
    for(const key of ["seed","ratio","engine","colors","lettering",
      "filamentSpecies","filamentSecondSpecies","filamentCrossbreed",
      "filamentMaterial","filamentSecondMaterial","filamentOpticsMode",
      "filamentSecondOpticsMode","filamentOpticsAmount","filamentSecondOpticsAmount"])
      assert.deepEqual(s[key],art[key],score.name+" "+key);
    assert.deepEqual(validateRecipe(s),s);
    const doc=recipeDocument(s,"Temporal seam",{time:2,colorTime:4,textTime:.5});
    assert.deepEqual(parseDocument(doc).state,s);
    specs.add(retrocausalEmbroideryControls.map(k=>s[k]).join(":"));
  }
  assert.equal(specs.size,6);
  assert.equal(applyRetrocausalEmbroideryPreset(art,"missing"),art);
});
test("normal/feral chronology shuffles are deterministic and never rewrite the source art",()=>{
  for(const n of [0,.13,.53,.999999,NaN]){
    const random=()=>n;
    for(const feral of [false,true]){
      const updated=remixRetrocausalEmbroidery(art,random,feral);
      assert.deepEqual(updated,remixRetrocausalEmbroidery(art,random,feral));
      assert.equal(updated.filamentStitchMode,"Retrocausal Embroidery");
      assert.ok(updated.filamentStitchAmount>=88);
      for(const key of retrocausalEmbroideryControls)
        assert.ok(updated[key]>=0&&updated[key]<=100,key);
      for(const key of ["seed","colors","lettering",
        "filamentSpecies","filamentSecondSpecies","filamentMaterial",
        "filamentSecondMaterial","filamentOpticsMode","filamentSecondOpticsMode"])
        assert.deepEqual(updated[key],art[key],key);
      assert.deepEqual(validateRecipe(updated),updated);
    }
  }
});
test("Mutate touches temporal settings only while retrocausal stitch is active",()=>{
  const dormant=randomize(art,{},true,()=>.78);
  for(const key of retrocausalEmbroideryControls)
    assert.equal(dormant[key],art[key],"inactive control "+key);
  const selected=applyRetrocausalEmbroideryPreset(art,retrocausalEmbroideryPresets[0].name);
  const alive=randomize(selected,{},true,()=>.78);
  assert.equal(alive.filamentStitchMode,"Retrocausal Embroidery");
  assert.notEqual(alive.filamentRetroLead,selected.filamentRetroLead);
  assert.notEqual(alive.filamentRetroEcho,selected.filamentRetroEcho);
  assert.equal(alive.lettering,art.lettering);
});
test("temporal previews compute future analytic phase in the actual stitch mask",()=>{
  const trimmed=specializeFilamentStitchMotion(
    specializeFilamentGeometry(filamentGLSL,23,22),32);
  assert.deepEqual(selectedModes(trimmed),[32]);
  assert.equal(balance(trimmed),0);
  assert.ok(trimmed.length<filamentGLSL.length);
  assert.doesNotMatch(trimmed,/\bprecision\s*=|\bactive\b|texture2D|texelFetch|\bfwidth\b/,
    "no iOS-problematic GLSL identifiers");
  for(const fragment of [
    "float future=sweep+lead;",
    "float prePulse=.5+.5*cos(phi-future);",
    "float reversePulse=.5+.5*cos(phi+backwards",
    "float predictedKnot=knots*knotStation*filamentRetroKnots;",
    "visibleStitch=.045+.955*clamp",
    "float reveal=mix(1.0,visibleStitch,filamentStitchAmount);",
    "core*=reveal;","halo*=reveal;","edge*=reveal;",
    "needle=clamp(pow(prePulse,15.0)"
  ])assert.ok(trimmed.includes(fragment),fragment);
  for(let id=0;id<33;id++){
    const shader=specializeFilamentStitchMotion(filamentGLSL,id);
    assert.deepEqual(selectedModes(shader),[id],"stitch "+id);
    assert.equal(balance(shader),0,id);
  }
  assert.deepEqual([...trimmed.matchAll(/if\(species==(\d+)\)/g)].map(x=>+x[1]),[22,23]);
});
test("UI controls, Find, Reset, renderer and strict exports all use one time source",()=>{
  const inspector=read("components/Inspectors.jsx");
  const renderer=read("renderer.js");
  const exportCode=read("export.js");
  const meta=sectionMeta("filament");
  assert.ok(findControls("retrocausal embroidery").some(s=>s.id==="filament"));
  assert.ok(findControls("ghost seam").some(s=>s.id==="filament"));
  for(const k of retrocausalEmbroideryControls){
    assert.ok(inspector.includes('name="'+k+'"'),k+" UI");
    assert.ok(meta.reset.includes(k),k+" reset");
    assert.ok(renderer.includes('"'+k+'"'),k+" uniform");
  }
  for(const phrase of ["Temporal embroidery score","Sew selected temporal score",
    "Shuffle future seams","Feral chronology shuffle",
    "applyRetrocausalEmbroideryPreset","remixRetrocausalEmbroidery"])
    assert.ok(inspector.includes(phrase),phrase);
  assert.ok(renderer.includes("specializeFilamentStitchMotion("));
  assert.ok(renderer.includes("filamentStitchModes.indexOf(s.filamentStitchMode)"));
  assert.ok(renderer.includes("withStitch ?"));
  assert.ok(renderer.includes('col=livingFilamentForge(col,uv,p,v);'));
  assert.ok(exportCode.includes("exactEffects"),
    "no export-specific CPU approximation allowed");
});
