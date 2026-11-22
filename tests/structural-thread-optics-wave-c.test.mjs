import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,validateRecipe,numericRanges,randomize,recipeDocument,parseDocument} from "../src/data.js";
import {sectionMeta,findControls} from "../src/ui-index.js";
import {filamentMaterials,filamentSpecies,filamentGLSL,
  specializeFilamentMaterials,specializeFilamentGeometry,
  specializeFilamentStitchMotion} from "../src/filament-forge.js";
import {structuralOpticsModes,structuralOpticsDescriptions,structuralOpticsPresets,
  structuralOpticsFirstControls,structuralOpticsSecondControls,
  applyStructuralOpticsPreset,remixStructuralOptics,
  disableStructuralOptics,swapStructuralOptics} from "../src/structural-thread-optics.js";
const read=file=>readFileSync(new URL("../src/"+file,import.meta.url),"utf8");
const balanced=s=>[...s].reduce((x,c)=>x+(c==="{")-(c==="}"),0);
const art={...initial,filamentAmount:90,filamentSpecies:"Quasicrystal Brocade",
  filamentSecondSpecies:"Feral Jacquard",filamentCrossbreed:89,
  filamentMaterial:"Velvet flock",filamentSecondMaterial:"Molten chrome",
  filamentStitchMode:"Chladni Needle Orchestra",filamentStitchAmount:82,
  seed:734224,ratio:"9:16",lettering:"THREAD GHOSTS",
  colors:["#ff00ff","#00eeff","#ffee00"]};

test("all 14 original fiber dresses and 24 geometries retain their identities",()=>{
  assert.equal(filamentMaterials.length,14);
  assert.equal(filamentSpecies.length,24);
  assert.equal(filamentMaterials[0],"Original thread");
  assert.equal(filamentMaterials[13],"Bioluminescent mycelium");
  assert.equal(filamentSpecies[22],"Feral Jacquard");
  assert.equal(filamentSpecies[23],"Quasicrystal Brocade");
  assert.equal(structuralOpticsModes.length,8);
  assert.equal(structuralOpticsModes[0],"Off");
  for(const mode of structuralOpticsModes)assert.ok(structuralOpticsDescriptions[mode],mode);
});
test("both parents get seven valid bounded optical coat controls, old art defaults Off",()=>{
  assert.equal(structuralOpticsFirstControls.length,7);
  assert.equal(structuralOpticsSecondControls.length,7);
  assert.equal(initial.filamentOpticsMode,"Off");
  assert.equal(initial.filamentSecondOpticsMode,"Off");
  assert.equal(initial.filamentOpticsAmount,0);
  assert.equal(initial.filamentSecondOpticsAmount,0);
  const old={...art};
  for(const key of ["filamentOpticsMode","filamentSecondOpticsMode",
    ...structuralOpticsFirstControls,...structuralOpticsSecondControls])delete old[key];
  const parsed=validateRecipe(old);
  assert.equal(parsed.filamentOpticsAmount,0);
  assert.equal(parsed.filamentSecondOpticsAmount,0);
  for(const key of [...structuralOpticsFirstControls,...structuralOpticsSecondControls]){
    assert.deepEqual(numericRanges[key],[0,100],key);
    assert.equal(parsed[key],initial[key],key);
    assert.throws(()=>validateRecipe({...art,[key]:101}),new RegExp("Invalid "+key));
  }
  assert.throws(()=>validateRecipe({...art,filamentOpticsMode:"Not GLSL"}),
    /Unknown filamentOpticsMode/);
  assert.throws(()=>validateRecipe({...art,filamentSecondOpticsMode:"Not GLSL"}),
    /Unknown filamentSecondOpticsMode/);
});
test("seven paired presets retain all authored geometry, materials, text, palettes and other effects",()=>{
  assert.equal(structuralOpticsPresets.length,7);
  const seen=new Set();
  for(const p of structuralOpticsPresets){
    assert.ok(structuralOpticsModes.includes(p.filamentOpticsMode));
    assert.ok(structuralOpticsModes.includes(p.filamentSecondOpticsMode));
    seen.add(p.filamentOpticsMode);
    const changed=applyStructuralOpticsPreset(art,p.name);
    for(const key of ["seed","ratio","lettering","colors","filamentSpecies",
      "filamentSecondSpecies","filamentMaterial","filamentSecondMaterial",
      "filamentCrossbreed","filamentStitchMode","filamentStitchAmount"])
      assert.deepEqual(changed[key],art[key],p.name+" "+key);
    for(const key of [...structuralOpticsFirstControls,...structuralOpticsSecondControls])
      assert.equal(changed[key],p[key],p.name+" "+key);
    assert.equal(validateRecipe(changed).filamentOpticsMode,p.filamentOpticsMode);
    const snapshot=parseDocument(recipeDocument(changed,"Structural coat",
      {time:2.5,colorTime:3.75})).state;
    assert.deepEqual(snapshot,validateRecipe(changed));
  }
  assert.equal(seen.size,7,"all seven distinct laws offered in preset bank");
  assert.equal(applyStructuralOpticsPreset(art,"invalid"),art);
});
test("Shuffle A, Shuffle B and both work independently and never rewrite thread dressing",()=>{
  const coated=applyStructuralOpticsPreset(art,structuralOpticsPresets[0].name);
  for(const n of [0,.13,.51,.999999,NaN]){
    const random=()=>n;
    for(const parent of ["first","second","both"]){
      const mutated=remixStructuralOptics(coated,random,parent,n>.5);
      assert.deepEqual(mutated,remixStructuralOptics(coated,random,parent,n>.5));
      assert.ok(structuralOpticsModes.includes(mutated.filamentOpticsMode));
      assert.ok(structuralOpticsModes.includes(mutated.filamentSecondOpticsMode));
      for(const key of ["seed","colors","lettering","filamentSpecies",
        "filamentMaterial","filamentSecondMaterial","filamentSecondSpecies",
        "filamentCrossbreed","filamentStitchMode"])
        assert.deepEqual(mutated[key],coated[key],key);
      if(parent==="first")
        for(const key of ["Mode",...structuralOpticsSecondControls.map(k=>k.slice("filamentSecondOptics".length))])
          assert.deepEqual(mutated["filamentSecondOptics"+key],
            coated["filamentSecondOptics"+key],"unchanged B "+key);
      if(parent==="second")
        for(const key of ["Mode",...structuralOpticsFirstControls.map(k=>k.slice("filamentOptics".length))])
          assert.deepEqual(mutated["filamentOptics"+key],
            coated["filamentOptics"+key],"unchanged A "+key);
      assert.deepEqual(validateRecipe(mutated),mutated);
    }
  }
});
test("swap optical coats is involutive; Off restores exactly original materials",()=>{
  const coated=applyStructuralOpticsPreset(art,structuralOpticsPresets[4].name);
  assert.deepEqual(swapStructuralOptics(swapStructuralOptics(coated)),coated);
  const first=disableStructuralOptics(coated,"first");
  assert.equal(first.filamentOpticsMode,"Off");
  assert.equal(first.filamentOpticsAmount,0);
  assert.equal(first.filamentSecondOpticsAmount,coated.filamentSecondOpticsAmount);
  const off=disableStructuralOptics(coated);
  assert.equal(off.filamentOpticsMode,"Off");
  assert.equal(off.filamentSecondOpticsMode,"Off");
  assert.equal(off.filamentOpticsAmount,0);
  assert.equal(off.filamentSecondOpticsAmount,0);
  assert.equal(off.filamentMaterial,coated.filamentMaterial);
  assert.equal(off.filamentSecondMaterial,coated.filamentSecondMaterial);
  assert.deepEqual(off.colors,coated.colors);
  assert.equal(off.lettering,coated.lettering);
});
test("Surprise opt-in / Mutate guarded for both disabled and active parents",()=>{
  const old=randomize(art,{},true,()=>.87);
  assert.equal(old.filamentOpticsMode,art.filamentOpticsMode);
  assert.equal(old.filamentSecondOpticsMode,art.filamentSecondOpticsMode);
  for(const key of [...structuralOpticsFirstControls,...structuralOpticsSecondControls])
    assert.equal(old[key],art[key],"disabled optic parameter must not mutate "+key);
  const fresh=applyStructuralOpticsPreset(art,structuralOpticsPresets[1].name);
  const mutant=randomize(fresh,{},true,()=>.87);
  assert.equal(mutant.filamentOpticsMode,fresh.filamentOpticsMode);
  assert.equal(mutant.filamentSecondOpticsMode,fresh.filamentSecondOpticsMode);
  assert.notEqual(mutant.filamentOpticsThickness,fresh.filamentOpticsThickness);
  assert.notEqual(mutant.filamentSecondOpticsThickness,fresh.filamentSecondOpticsThickness);
  assert.equal(mutant.lettering,fresh.lettering);
  const newArt=randomize(art,{},false,()=>.45);
  assert.ok(structuralOpticsModes.includes(newArt.filamentOpticsMode));
  assert.ok(structuralOpticsModes.includes(newArt.filamentSecondOpticsMode));
});
test("GPU optics are opt-in, operate on dressed thread and use both parents' inputs",()=>{
  const shader=filamentGLSL;
  assert.equal(balanced(shader),0);
  assert.match(shader,/#ifdef FILAMENT_STRUCTURAL_OPTICS/);
  assert.match(shader,/if\(opticalLaw==1\)/);
  assert.match(shader,/if\(opticalLaw==7\)/);
  assert.match(shader,/vec3 interference/);
  assert.match(shader,/float pseudoView/);
  assert.match(shader,/float yarnAcross/);
  assert.match(shader,/thread=mix\(thread,dressed,opticalMix\);/);
  assert.match(shader,/filamentOpticsMode,filamentOpticsAmount/);
  assert.match(shader,/filamentSecondOpticsMode,filamentSecondOpticsAmount/);
  assert.doesNotMatch(shader,/\bactive\b|texture2D|texelFetch|\bfwidth\b/);
  const solo=specializeFilamentMaterials(specializeFilamentGeometry(shader,23),12);
  const both=specializeFilamentStitchMotion(
    specializeFilamentMaterials(specializeFilamentGeometry(shader,22,23),6,13),31);
  for(const s of [solo,both])assert.equal(balanced(s),0);
  assert.ok(both.length<shader.length);
  for(const id of [1,2,3,4,5,6,7])assert.ok(shader.includes("if(opticalLaw=="+id+")"),id);
});
test("Find, Reset, UI, shared renderer and strict PNG/GIF/MP4 path are fully wired",()=>{
  const ui=read("components/Inspectors.jsx");
  const render=read("renderer.js");
  const exportCode=read("export.js");
  const meta=sectionMeta("filament");
  assert.ok(findControls("structural color optics").some(i=>i.id==="filament"));
  assert.ok(findControls("nacre").some(i=>i.id==="filament"));
  for(const key of ["filamentOpticsMode","filamentSecondOpticsMode",
    ...structuralOpticsFirstControls,...structuralOpticsSecondControls]){
    assert.ok(meta.reset.includes(key),key+" reset");
    assert.ok(render.includes(key),key+" renderer");
  }
  for(const key of [...structuralOpticsFirstControls,...structuralOpticsSecondControls])
    assert.ok(ui.includes('name="'+key+'"'),key+" UI");
  for(const needle of ["Swap optical coats A ↔ B","Wild spectral wardrobe",
    "Remix fibers","Restore original thread colors"])
    assert.ok(ui.includes(needle),needle);
  assert.match(render,/withOptics = withOpticsA \|\| withOpticsB/);
  assert.match(render,/FILAMENT_STRUCTURAL_OPTICS 1/);
  assert.match(render,/structuralOpticsModes\.indexOf\(s\.filamentOpticsMode\)/);
  assert.match(render,/structuralOpticsModes\.indexOf\(s\.filamentSecondOpticsMode\)/);
  assert.match(render,/withOptics \? "struct-opt"/);
  assert.match(render,/col=livingFilamentForge\(col,uv,p,v\);/);
  assert.ok(exportCode.includes("exactEffects"));
});
