import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,numericRanges,validateRecipe,randomize,recipeDocument,parseDocument} from "../src/data.js";
import {sectionMeta,findControls} from "../src/ui-index.js";
import {
  filamentAdornmentModes,filamentAdornmentFamilies,filamentAdornmentDescriptions,
  filamentAdornmentControls,filamentAdornmentPresets,
  applyFilamentAdornmentPreset,remixFilamentAdornments,
  specializeFilamentAdornments,specializeFilamentGeometry,
  specializeFilamentStitchMotion,specializeFilamentMaterials,filamentGLSL,
  filamentSpecies,filamentStitchModes,filamentMaterials
} from "../src/filament-forge.js";
const classics=["Pearl stations","Sequin chain","French knots","Tassel fringe",
  "Lace picots","Glass bugles"];
const weird=["Opal barnacles","Electric thorns","Watching eyes",
  "Mycelium spores","Neon teeth","Orbiting halos"];
const full=["Bare threads",...classics,...weird];
const artwork={...initial,ratio:"9:16",seed:47235,engine:12,
  lettering:"DO NOT ERASE THIS TEXT",
  colors:["#ff00ff","#00eeff","#faff00"],filamentAmount:0,
  filamentSpecies:"Chevron herringbone",
  filamentSecondSpecies:"Möbius cable",
  filamentMaterial:"Fiber-optic rainbow",
  filamentSecondMaterial:"Oil-slick latex",
  filamentCrossbreed:78,filamentStitchAmount:84,
  filamentStitchMode:"Cross-stitch",filamentSculptAmount:67};
const protectedKeys=["ratio","seed","engine","lettering","colors",
  "filamentSpecies","filamentSecondSpecies","filamentCrossbreed",
  "filamentMaterial","filamentSecondMaterial","filamentStitchMode",
  "filamentStitchAmount","filamentSculptAmount"];
const brace=s=>[...s].reduce((n,c)=>n+(c==="{")-(c==="}"),0);

test("all 12 ornament laws, presets, UI families and bounded controls",()=>{
  assert.deepEqual(filamentAdornmentModes,full);
  assert.equal(filamentAdornmentPresets.length,12);
  assert.deepEqual(filamentAdornmentFamilies.flatMap(g=>g.modes),full);
  assert.equal(new Set(filamentAdornmentPresets.map(x=>x.name)).size,12);
  for(const name of full)assert.ok(filamentAdornmentDescriptions[name],name);
  for(const p of filamentAdornmentPresets){
    for(const key of filamentAdornmentControls){
      assert.deepEqual(numericRanges[key],[0,100],key);
      assert.ok(p[key]>=0&&p[key]<=100,p.name+" "+key);
    }
    assert.ok(filamentAdornmentModes.includes(p.filamentAdornmentMode));
    assert.ok(filamentAdornmentModes.includes(p.filamentSecondAdornmentMode));
  }
});

test("old recipes stay unchanged when ornaments are dormant",()=>{
  assert.equal(initial.filamentAdornmentMode,"Bare threads");
  assert.equal(initial.filamentSecondAdornmentMode,"Bare threads");
  assert.equal(initial.filamentAdornmentAmount,0);
  const old={...artwork};
  for(const k of ["filamentAdornmentMode","filamentSecondAdornmentMode",
    ...filamentAdornmentControls])delete old[k];
  const restored=validateRecipe(old);
  assert.equal(restored.filamentAdornmentAmount,0);
  assert.equal(restored.filamentAdornmentMode,"Bare threads");
  assert.equal(restored.filamentSecondAdornmentMode,"Bare threads");
  for(const k of protectedKeys)assert.deepEqual(restored[k],artwork[k],k);
  assert.throws(()=>validateRecipe({...initial,filamentAdornmentMode:"unsafe GLSL"}),
    /Unknown filamentAdornmentMode/);
  assert.throws(()=>validateRecipe({...initial,filamentAdornmentSize:201}),
    /Invalid filamentAdornmentSize/);
});

test("every one-tap adornment recipe keeps BOTH parents, dressed fibers, palettes and authored lettering",()=>{
  for(const p of filamentAdornmentPresets){
    const updated=applyFilamentAdornmentPreset(artwork,p.name);
    assert.ok(updated.filamentAdornmentAmount>=80);
    assert.equal(updated.filamentAdornmentMode,p.filamentAdornmentMode);
    assert.equal(updated.filamentSecondAdornmentMode,p.filamentSecondAdornmentMode);
    for(const k of protectedKeys)assert.deepEqual(updated[k],artwork[k],k);
    assert.deepEqual(validateRecipe(updated),updated);
    const doc=recipeDocument(updated,"Thread jewelry",{time:2,colorTime:1});
    assert.deepEqual(parseDocument(doc).state,updated);
  }
  assert.equal(applyFilamentAdornmentPreset(artwork,"unknown"),artwork);
});

test("new jewelry randomizers only change jewelry and can target the weird six",()=>{
  const rand=[()=>0,()=>.24,()=>.51,()=>.81,()=>.99999,()=>NaN];
  for(const fn of rand)for(const unusual of [false,true]){
    const next=remixFilamentAdornments(artwork,fn,unusual);
    assert.notEqual(next.filamentAdornmentMode,artwork.filamentAdornmentMode);
    assert.notEqual(next.filamentSecondAdornmentMode,artwork.filamentSecondAdornmentMode);
    for(const k of protectedKeys)assert.deepEqual(next[k],artwork[k],k);
    if(unusual){
      assert.ok(weird.includes(next.filamentAdornmentMode));
      assert.ok(weird.includes(next.filamentSecondAdornmentMode));
    }
    assert.deepEqual(next,remixFilamentAdornments(artwork,fn,unusual));
    assert.deepEqual(validateRecipe(next),next);
  }
});

test("13×13 parent jewelry combinations specialize to exactly selected GLSL branches",()=>{
  for(let a=0;a<filamentAdornmentModes.length;a++)
    for(let b=0;b<filamentAdornmentModes.length;b++){
      const trimmed=specializeFilamentAdornments(filamentGLSL,a,b);
      const ids=[...trimmed.matchAll(/(?:if|else if)\(adornmentMode==(\d+)\)/g)]
        .map(x=>+x[1]);
      const selected=[...new Set([a,b].filter(x=>x>0))].sort((x,y)=>x-y);
      assert.deepEqual(ids,selected,a+"/"+b);
      assert.equal(brace(trimmed),0,a+"/"+b);
      assert.ok(trimmed.includes("collar*=reveal;"));
      assert.ok(trimmed.includes("result=mix(result,result*.46+accent*.94"));
      assert.ok(trimmed.length<filamentGLSL.length);
    }
  assert.equal(specializeFilamentAdornments(filamentGLSL,null),filamentGLSL);
  assert.equal(specializeFilamentAdornments(filamentGLSL,99),filamentGLSL);
});

test("new jewels compose with old geometries, animated stitching and separately dressed parents",()=>{
  for(let geo=0;geo<filamentSpecies.length;geo++){
    const geometry=specializeFilamentGeometry(filamentGLSL,geo,(geo+5)%filamentSpecies.length);
    for(let sew=0;sew<filamentStitchModes.length;sew++){
      const stitching=specializeFilamentStitchMotion(geometry,sew);
      const wardrobe=specializeFilamentMaterials(stitching,10,12);
      const jewels=specializeFilamentAdornments(wardrobe,1+sew%6,7+sew%6);
      assert.equal(brace(jewels),0,geo+"/"+sew);
      assert.ok(jewels.includes("vec3 livingFilamentForge"));
      assert.ok(jewels.includes("FILAMENT_ADORNMENT"));
      assert.ok(jewels.includes("needle*filamentStitchGlow*core"));
    }
  }
});

test("same main shader covers preview and export, Find and Reset recognize every ornament",()=>{
  const ui=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
  const render=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
  for(const token of ["FILAMENT_ADORNMENT 1","specializeFilamentAdornments(",
    "filamentAdornmentUnavailable=true","withAdornment",
    "filamentSecondAdornmentMode","col=livingFilamentForge(col,uv,p,v);"])
    assert.ok(render.includes(token),token);
  for(const token of ["THREAD JEWELRY","Adorn the threads",
    "Shuffle all thread jewelry","Shuffle cursed jewelry",
    "Strip jewelry (keep materials)","filamentAdornmentFamilies.map"])
    assert.ok(ui.includes(token),token);
  assert.ok(sectionMeta("filament").reset.includes("filamentAdornmentAmount"));
  for(const mode of filamentAdornmentModes.slice(1))
    assert.ok(findControls(mode).some(x=>x.id==="filament"),mode);
  const random=randomize(artwork,{},false,()=>.78);
  assert.ok(filamentAdornmentModes.includes(random.filamentAdornmentMode));
  assert.ok(filamentAdornmentModes.includes(random.filamentSecondAdornmentMode));
});
