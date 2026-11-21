import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,validateRecipe,recipeDocument,parseDocument} from "../src/data.js";
import {findControls} from "../src/ui-index.js";
import {
  filamentSpecies,filamentSpeciesFamilies,filamentPresets,filamentMaterials,
  filamentMaterialPresets,filamentStitchModes,filamentStitchPresets,
  filamentStitchFamilies,filamentStitchDescriptions,filamentGLSL,
  remixFreshFilaments,remixUnusualFilamentMaterials,
  applyFilamentMaterialPreset,applyFilamentStitchPreset,applyFilamentPreset,
  specializeFilamentGeometry,specializeFilamentStitchMotion,
  specializeFilamentMaterials
} from "../src/filament-forge.js";

const originalGeometry=["Fivefold brocade","Poincaré crochet","Truchet knotwork",
  "Voronoi lace","Spiral appliqué","Fractal veinwork","Alien lattice",
  "Alien scriptwork","Glyph swarm","Xeno filament","Capillary bloom",
  "Mycelial veinwork","Lightning lace","Root filigree","Coral vasculature","Nerve net"];
const extraGeometry=["Basket twill","Chevron herringbone","Macramé diamonds",
  "Bobbin lace","Möbius cable","Parasitic ladder"];
const originalDress=["Original thread","Iridescent silk","Molten chrome",
  "Opaline glass","Velvet flock","Electroluminescent yarn"];
const extraDress=["Mercerized cotton","Metallic tinsel","Chenille plush",
  "Pearl embroidery floss","Fiber-optic rainbow","Gelatin nerve cord",
  "Oil-slick latex","Bioluminescent mycelium"];
const extraStitch=["Chain stitch","Cross-stitch","Satin fill","Blanket stitch",
  "Feather stitch","Cable knit","Ghost bobbin","Quantum unpick",
  "Mutant zipper","Fractal mending"];
const balance=source=>[...source].reduce((n,c)=>n+(c==="{")-(c==="}"),0);
const artwork={...initial,seed:18493,engine:12,lettering:"HANDS OFF MY WORDS",
  colors:["#ff00aa","#00ffff","#ffff00"],ratio:"9:16",
  filamentAmount:73,filamentSpecies:"Voronoi lace",
  filamentSecondSpecies:"Nerve net",filamentCrossbreed:79,
  filamentMaterial:"Iridescent silk",filamentSecondMaterial:"Opaline glass"};
const protectedKeys=["seed","engine","lettering","colors","ratio","marks",
  "filamentCrossbreed","filamentSecondSpecies"];
test("existing saved IDs never change; every new textile is a real option",()=>{
  assert.deepEqual(filamentSpecies.slice(0,16),originalGeometry);
  assert.deepEqual(filamentSpecies.slice(16),extraGeometry);
  assert.deepEqual(filamentMaterials.slice(0,6),originalDress);
  assert.deepEqual(filamentMaterials.slice(6),extraDress);
  assert.deepEqual(filamentStitchModes.slice(21),extraStitch);
  assert.equal(filamentSpecies.length,22);
  assert.equal(filamentMaterials.length,14);
  assert.equal(filamentStitchModes.length,31);
  assert.equal(filamentPresets.length,22);
  assert.equal(filamentMaterialPresets.length,14);
  assert.equal(filamentStitchPresets.length,31);
  for(const [modes,groups] of [[filamentSpecies,filamentSpeciesFamilies],
    [filamentStitchModes,filamentStitchFamilies]]){
    const members=groups.flatMap(group=>group.species||group.modes);
    assert.deepEqual(new Set(members),new Set(modes));
    assert.equal(members.length,modes.length);
  }
  for(const name of extraStitch)assert.ok(filamentStitchDescriptions[name],name);
});
test("dressing and sewing do not overwrite art, colors, text or parent shapes",()=>{
  for(const preset of filamentMaterialPresets.slice(6)){
    const changed=applyFilamentMaterialPreset(artwork,preset.name);
    for(const key of [...protectedKeys,"filamentSpecies","filamentStitchMode"])
      assert.deepEqual(changed[key],artwork[key],key);
    assert.equal(validateRecipe(changed).filamentMaterial,preset.filamentMaterial);
    assert.deepEqual(parseDocument(recipeDocument(changed,"Dressed",{time:2,
      colorTime:3})).state,changed);
  }
  for(const preset of filamentStitchPresets.slice(21)){
    const changed=applyFilamentStitchPreset(artwork,preset.name);
    for(const key of [...protectedKeys,"filamentSpecies","filamentMaterial"])
      assert.deepEqual(changed[key],artwork[key],key);
    assert.equal(validateRecipe(changed).filamentStitchMode,preset.filamentStitchMode);
  }
  for(const preset of filamentPresets.slice(16)){
    const changed=applyFilamentPreset(artwork,preset.name);
    for(const key of ["seed","engine","lettering","colors","ratio","marks","filamentMaterial"])
      assert.deepEqual(changed[key],artwork[key],key);
    assert.equal(validateRecipe(changed).filamentSpecies,preset.species);
  }
});
test("fresh structure / bizarre dressing shuffles are bounded and independent",()=>{
  for(const random of [()=>0,()=>.35,()=>.72,()=>.999999,()=>NaN]){
    const structure=remixFreshFilaments(artwork,random);
    assert.ok(extraGeometry.includes(structure.filamentSpecies));
    const dressed=remixUnusualFilamentMaterials(artwork,random);
    assert.ok(extraDress.slice(4).includes(dressed.filamentMaterial));
    assert.ok(extraDress.slice(4).includes(dressed.filamentSecondMaterial));
    for(const key of [...protectedKeys,"filamentSpecies"])
      assert.deepEqual(dressed[key],artwork[key],key);
    assert.deepEqual(validateRecipe(dressed),dressed);
  }
});
test("every fiber material specializes to only selected GLSL branches",()=>{
  for(let first=0;first<14;first++){
    for(let second=0;second<14;second++){
      const slim=specializeFilamentMaterials(filamentGLSL,first,second);
      const actual=[...slim.matchAll(/if\(fiberMaterial==(\d+)\)/g)]
        .map(x=>Number(x[1]));
      const expected=[...new Set([first,second].filter(x=>x>0))].sort((a,b)=>a-b);
      assert.deepEqual(actual,expected,first+"/"+second);
      assert.equal(balance(slim),0,first+"/"+second);
      assert.ok(slim.includes("filamentBeads*pearl"));
      assert.ok(slim.length<filamentGLSL.length);
    }
  }
  assert.equal(specializeFilamentMaterials(filamentGLSL,null),filamentGLSL);
  assert.equal(specializeFilamentMaterials(filamentGLSL,25),filamentGLSL);
});
test("all new geometries and sewing branches can compile in isolation",()=>{
  for(let i=0;i<22;i++){
    const geometry=specializeFilamentGeometry(filamentGLSL,i,(i+7)%22);
    const species=[...geometry.matchAll(/(?:if|else if)\(species==(\d+)\)/g)]
      .map(x=>Number(x[1]));
    assert.deepEqual(species,[...new Set([i,(i+7)%22])].sort((a,b)=>a-b));
    for(let id=0;id<31;id++){
      const sew=specializeFilamentStitchMotion(geometry,id);
      const trimmed=specializeFilamentMaterials(sew,10,13);
      assert.deepEqual([...trimmed.matchAll(/if\(filamentStitchMode==(\d+)\)/g)]
        .map(x=>Number(x[1])),[id]);
      assert.equal(balance(trimmed),0,i+"/"+id);
      assert.ok(trimmed.includes("core*=reveal"));
      assert.ok(trimmed.includes("vec3 livingFilamentForge"));
    }
  }
});
test("new choices are findable and travel through the unchanged export pipeline",()=>{
  for(const name of [...extraGeometry,...extraDress,...extraStitch])
    assert.ok(findControls(name).some(x=>x.id==="filament"),name);
  const render=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
  const inspector=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
  assert.ok(render.includes("specializeFilamentMaterials("));
  assert.ok(render.includes("withFiberDetail&&withHybrid?"));
  assert.ok(render.includes("col=livingFilamentForge(col,uv,p,v);"));
  for(const title of ["Dress the threads","Dress in weird shit",
    "Shuffle fresh textile geometries","Shuffle stitch motions"])
    assert.ok(inspector.includes(title),title);
});
