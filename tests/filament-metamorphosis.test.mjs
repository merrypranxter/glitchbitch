import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,validateRecipe,recipeDocument,parseDocument,randomize,numericRanges} from "../src/data.js";
import {sectionMeta,findControls} from "../src/ui-index.js";
import {
 filamentMaterials,filamentSpecies,filamentStitchModes,filamentAdornmentModes,
 filamentMorphModes,filamentMorphFamilies,filamentMorphControls,
 filamentMorphPresets,filamentMorphDescriptions,
 applyFilamentMorphPreset,remixFilamentMorph,
 filamentGLSL,specializeFilamentGeometry,specializeFilamentStitchMotion,
 specializeFilamentMaterials,specializeFilamentMorphMaterials,
 specializeFilamentAdornments,specializeFilamentSculptMotion,
 filamentSculptModes
} from "../src/filament-forge.js";

const modes=["Off","Seam sweep","Crystal contagion","Molten migration",
 "Moth-eaten portals","Checker metamorph","Strange attractor",
 "Morse rethreading","Fungal takeover","Chromatic tide"];
const art={...initial,ratio:"9:16",engine:12,seed:149257,
 lettering:"MY ART STAYS MY ART",colors:["#ff00ff","#00ffff","#eaff00"],
 filamentSpecies:"Bobbin lace",filamentSecondSpecies:"Möbius cable",
 filamentCrossbreed:88,filamentAmount:73,filamentMaterial:"Iridescent silk",
 filamentSecondMaterial:"Oil-slick latex",filamentStitchMode:"Cross-stitch",
 filamentStitchAmount:94,filamentAdornmentMode:"Watching eyes",
 filamentAdornmentAmount:87,filamentSculptAmount:61};
const protectedKeys=["engine","seed","ratio","lettering","colors",
 "filamentSpecies","filamentSecondSpecies","filamentCrossbreed",
 "filamentMaterial","filamentSecondMaterial","filamentStitchMode",
 "filamentStitchAmount","filamentAdornmentMode","filamentAdornmentAmount",
 "filamentSculptAmount"];
const brace=s=>[...s].reduce((x,c)=>x+(c==="{")-(c==="}"),0);

test("nine distinct morph clocks + opt-out and nine ready-made recipes",()=>{
 assert.deepEqual(filamentMorphModes,modes);
 assert.equal(filamentMorphPresets.length,9);
 assert.deepEqual(filamentMorphFamilies.flatMap(x=>x.modes),modes);
 for(const mode of modes)assert.ok(filamentMorphDescriptions[mode],mode);
 for(const preset of filamentMorphPresets){
  assert.ok(modes.includes(preset.filamentMorphMode));
  assert.notEqual(preset.filamentMorphMode,"Off");
  assert.ok(filamentMaterials.includes(preset.filamentMorphTarget));
  assert.ok(filamentMaterials.includes(preset.filamentSecondMorphTarget));
  for(const field of filamentMorphControls){
   assert.deepEqual(numericRanges[field],[0,100]);
   assert.ok(preset[field]>=0&&preset[field]<=100,field);
  }
 }
});

test("legacy recipes preserve their unmorphing original artwork",()=>{
 assert.equal(initial.filamentMorphMode,"Off");
 assert.equal(initial.filamentMorphAmount,0);
 const legacy={...art};
 for(const key of ["filamentMorphMode","filamentMorphTarget",
  "filamentSecondMorphTarget",...filamentMorphControls])delete legacy[key];
 const restored=validateRecipe(legacy);
 assert.equal(restored.filamentMorphMode,"Off");
 assert.equal(restored.filamentMorphAmount,0);
 for(const key of protectedKeys)
  assert.deepEqual(restored[key],art[key],key);
 assert.throws(()=>validateRecipe({...art,filamentMorphTarget:"nonexistent"}),
  /Unknown filamentMorphTarget/);
 assert.throws(()=>validateRecipe({...art,filamentMorphSpeed:101}),
  /Invalid filamentMorphSpeed/);
});

test("morph presets never overwrite weave, outfits, lettering or color",()=>{
 for(const preset of filamentMorphPresets){
  const updated=applyFilamentMorphPreset(art,preset.name);
  for(const key of protectedKeys)assert.deepEqual(updated[key],art[key],key);
  assert.equal(updated.filamentMorphMode,preset.filamentMorphMode);
  assert.equal(updated.filamentMorphTarget,preset.filamentMorphTarget);
  assert.deepEqual(validateRecipe(updated),updated);
  const doc=recipeDocument(updated,"Living cloth",{time:4,colorTime:4});
  assert.deepEqual(parseDocument(doc).state,updated);
 }
 assert.equal(applyFilamentMorphPreset(art,"invalid"),art);
});

test("material-growth shuffles can be deterministic and target strange variants",()=>{
 for(const rng of [()=>0,()=>.3,()=>.7,()=>.9999,()=>NaN]){
  for(const weird of [false,true]){
   const a=remixFilamentMorph(art,rng,weird);
   const b=remixFilamentMorph(art,rng,weird);
   assert.deepEqual(a,b);
   assert.ok(a.filamentMorphAmount>=72&&a.filamentMorphAmount<=100);
   assert.notEqual(a.filamentMorphMode,"Off");
   if(weird)assert.ok(filamentMorphModes.slice(4,9).includes(a.filamentMorphMode));
   assert.ok(filamentMaterials.includes(a.filamentMorphTarget));
   for(const key of protectedKeys)assert.deepEqual(a[key],art[key],key);
   assert.deepEqual(validateRecipe(a),a);
  }
 }
});

test("all 14×14 target material pairs prune to only their selected fiber laws",()=>{
 for(let a=0;a<14;a++)for(let b=0;b<14;b++){
  const s=specializeFilamentMorphMaterials(filamentGLSL,a,b);
  const actual=[...s.matchAll(/(?:if|else if)\(morphMaterial==(\d+)\)/g)]
   .map(x=>Number(x[1]));
  const expected=[...new Set([a,b].filter(i=>i>0))].sort((x,y)=>x-y);
  assert.deepEqual(actual,expected,a+"/"+b);
  assert.equal(brace(s),0,a+"/"+b);
  assert.ok(s.includes("vec3 primaryDress=thread"));
  assert.ok(s.includes("thread=mix(primaryDress,secondDress,coverage)"));
 }
 assert.equal(specializeFilamentMorphMaterials(filamentGLSL,null),filamentGLSL);
 assert.equal(specializeFilamentMorphMaterials(filamentGLSL,21),filamentGLSL);
});

test("full shader pruning preserves 22 geometry × 31 stitch pairs and two truly dressed parents",()=>{
 for(let geometry=0;geometry<filamentSpecies.length;geometry++){
  let rendered=specializeFilamentGeometry(filamentGLSL,geometry,(geometry+7)%22);
  for(let stitch=0;stitch<filamentStitchModes.length;stitch++){
   let code=specializeFilamentStitchMotion(rendered,stitch);
   code=specializeFilamentSculptMotion(code,stitch%filamentSculptModes.length);
   code=specializeFilamentMaterials(code,2,12);
   code=specializeFilamentAdornments(code,9,10);
   code=specializeFilamentMorphMaterials(code,3,13);
   assert.equal(brace(code),0,geometry+"/"+stitch);
   assert.ok(code.includes("float morphClock=time*"));
   assert.ok(code.includes("vec3 livingFilamentForge"));
   assert.ok(code.includes("filamentMorphTarget"));
   const targetIds=[...code.matchAll(/(?:if|else if)\(morphMaterial==(\d+)\)/g)]
    .map(x=>Number(x[1]));
   assert.deepEqual(targetIds,[3,13]);
  }
 }
});

test("new metamorphosis is found, undoable, optional and rendered in the same strict export shader",()=>{
 const ui=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
 const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
 const exportSource=readFileSync(new URL("../src/export.js",import.meta.url),"utf8");
 for(const text of ["THREAD METAMORPHOSIS","Metamorphose threads",
  "Shuffle transformations","Shuffle fungal & impossible",
  "Stop morphing — keep fabric","filamentMorphPresets.map"])
  assert.ok(ui.includes(text),text);
 for(const text of ["withMorph = withFilament",
  "#define FILAMENT_METAMORPH 1","specializeFilamentMorphMaterials(",
  "filamentMorphUnavailable=true","filamentSecondMorphTarget",
  "col=livingFilamentForge(col,uv,p,v);"])
  assert.ok(renderer.includes(text),text);
 assert.ok(exportSource.includes("createRenderer(canvas,{exactEffects:true})"));
 assert.ok(sectionMeta("filament").reset.includes("filamentMorphAmount"));
 for(const m of modes.slice(1))assert.ok(findControls(m).some(x=>x.id==="filament"),m);
 const rnd=randomize(art,{},false,()=>.99);
 assert.ok(filamentMorphModes.includes(rnd.filamentMorphMode));
 assert.ok(filamentMaterials.includes(rnd.filamentMorphTarget));
});
