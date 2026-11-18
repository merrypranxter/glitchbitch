import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,numericRanges,validateRecipe,randomize} from "../src/data.js";
import {underlayModes,underlayControls,underlayPresets,
  applyUnderlayPreset,changeUnderlayMode,nextUnderlayMode,
  disableUnderlay,underlayGLSL} from "../src/living-underlay.js";
import {sectionMeta,sectionActive,findControls} from "../src/ui-index.js";

test("Living Underlay has six procedural cloth types and eight bounded controls",()=>{
 assert.deepEqual(underlayModes,[
  "Ornamental jacquard","Breathing moiré organza","Quasicrystal twill",
  "Velvet pile","Opalescent damask","Cellular gauze"
 ]);
 assert.equal(underlayPresets.length,6);
 assert.equal(new Set(underlayPresets.map(x=>x.name)).size,6);
 for(const p of underlayPresets){
  assert.ok(underlayModes.includes(p.underlayMode),p.name);
  for(const k of underlayControls){
   assert.deepEqual(numericRanges[k],[0,100],k);
   assert.ok(Number.isFinite(p[k])&&p[k]>=0&&p[k]<=100,p.name+" "+k);
  }
 }
});

test("Old artwork loads with its original background and underlay disabled",()=>{
 const old={...initial};
 delete old.underlayMode;
 for(const k of underlayControls)delete old[k];
 const saved=validateRecipe(old);
 assert.equal(saved.underlayMode,"Ornamental jacquard");
 assert.equal(saved.underlayAmount,0);
 assert.equal(saved.filamentAmount,old.filamentAmount);
 assert.equal(saved.lettering,old.lettering);
});

test("Presets only set the fabric ground; no intrusive changes to geometry, words or filament",()=>{
 const art={...initial,seed:20811,engine:12,lettering:"MY WORDS STAY",
  colors:["#ff00aa","#00ccff","#bbee33"],filamentAmount:0,
  filamentMaterial:"Opaline glass",filamentStitchAmount:72,
  filamentSculptAmount:86,filamentCrossbreed:63,photonAmount:79};
 for(const preset of underlayPresets){
  const next=applyUnderlayPreset(art,preset.name);
  assert.equal(next.underlayMode,preset.underlayMode);
  assert.ok(next.underlayAmount>0);
  for(const k of ["seed","engine","lettering","letteringFormats","letteringLayers",
    "colors","marks","filamentAmount","filamentSpecies",
    "filamentMaterial","filamentStitchAmount","filamentSculptAmount",
    "filamentCrossbreed","photonAmount","ratio"])
   assert.deepEqual(next[k],art[k],preset.name+" changed "+k);
  const checked=validateRecipe(next);
  assert.equal(checked.underlayMode,preset.underlayMode);
 }
 assert.equal(applyUnderlayPreset(art,"nope"),art);
});

test("Underlay can run alone and its hide action never affects threads",()=>{
 const state={...initial,filamentAmount:0,lettering:"MY QUOTE",underlayAmount:0};
 const selected=changeUnderlayMode(state,"Cellular gauze");
 assert.ok(selected.underlayAmount>=55);
 assert.equal(selected.filamentAmount,0);
 assert.equal(selected.lettering,state.lettering);
 const hidden=disableUnderlay({...selected,filamentAmount:80});
 assert.equal(hidden.underlayAmount,0);
 assert.equal(hidden.underlayMode,"Cellular gauze");
 assert.equal(hidden.filamentAmount,80);
 assert.equal(changeUnderlayMode(state,"unknown"),state);
 for(const r of [()=>0,()=>.5,()=>.999999,()=>NaN]){
  const n=nextUnderlayMode(state,r);
  assert.ok(underlayModes.includes(n.underlayMode));
  assert.notEqual(n.underlayMode,state.underlayMode);
  assert.equal(n.filamentAmount,0);
  assert.ok(n.underlayAmount>=55);
 }
});

test("Recipe import validates underlay modes and all controls",()=>{
 assert.throws(()=>validateRecipe({...initial,underlayMode:"untrusted GLSL"}),
  /Unknown underlayMode/);
 assert.throws(()=>validateRecipe({...initial,underlayAmount:101}),
  /Invalid underlayAmount/);
 assert.throws(()=>validateRecipe({...initial,underlayScale:-1}),
  /Invalid underlayScale/);
 assert.throws(()=>validateRecipe({...initial,underlayContrast:NaN}),
  /Invalid underlayContrast/);
});

test("Surprise and Mutate include ground settings, preserving authored text in Mutate",()=>{
 const state={...initial,underlayAmount:71,underlayMode:"Velvet pile",
  underlayScale:55,lettering:"HUMAN AUTHORED"};
 const surprise=randomize(state,{},false,()=>.5);
 assert.ok(underlayModes.includes(surprise.underlayMode));
 assert.ok(surprise.underlayAmount>=0&&surprise.underlayAmount<=100);
 const mutated=randomize(state,{},true,()=>.8);
 assert.equal(mutated.underlayMode,state.underlayMode);
 assert.notEqual(mutated.underlayScale,state.underlayScale);
 assert.equal(mutated.lettering,state.lettering);
});

test("Underlay GLSL uses the existing palette/timeline, is compact and WebGL1-compatible",()=>{
 assert.match(underlayGLSL,/vec3 livingTextileUnderlay\(/);
 assert.match(underlayGLSL,/uniform int underlayMode;/);
 assert.match(underlayGLSL,/underlayMode==0/);
 assert.match(underlayGLSL,/underlayMode==4/);
 assert.match(underlayGLSL,/time\*/);
 assert.match(underlayGLSL,/colorTime/);
 assert.match(underlayGLSL,/palette\(/);
 assert.match(underlayGLSL,/return clamp\(mix\(original,cloth,underlayAmount\*\.93\)/);
 assert.doesNotMatch(underlayGLSL,/texture2D|texelFetch|\bfwidth\b|\bactive\b/);
 assert.equal(underlayGLSL.split("{").length,underlayGLSL.split("}").length);
 assert.equal(underlayGLSL.split("(").length,underlayGLSL.split(")").length);
});

test("Renderer makes this a stand-alone layer between Photon Zoo and embroidered threads",()=>{
 const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
 assert.match(renderer,/withUnderlay = s\.underlayAmount>0/);
 assert.match(renderer,/underlayGLSL\.replace\("uniform int underlayMode;"/);
 assert.match(renderer,/underlayModes\.indexOf\(s\.underlayMode\)/);
 assert.match(renderer,/livingTextileUnderlay\(col,uv,v\);/);
 const photon=renderer.indexOf("/* PHOTON_POST */");
 const underlay=renderer.indexOf("/* UNDERLAY_POST */");
 const filament=renderer.indexOf("/* FILAMENT_POST */");
 assert.ok(photon>=0&&underlay>photon&&filament>underlay);
 assert.match(renderer,/underlayUnavailable=true/);
 assert.match(renderer,/\{underlayAmount:0\}/);
 assert.match(renderer,/attempt<16/);
 for(const k of underlayControls)
  assert.ok(renderer.includes('"'+k+'"'),"missing shader uniform "+k);
});

test("Claude Effects UI indexes and resets this independent fabric family",()=>{
 const ui=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
 const meta=sectionMeta("underlay");
 assert.equal(meta.tab,"Effects");
 assert.equal(meta.group,"Texture");
 assert.equal(sectionActive(meta,initial),false);
 assert.equal(sectionActive(meta,{...initial,underlayAmount:80}),true);
 for(const k of ["underlayMode",...underlayControls])
  assert.ok(meta.reset.includes(k),"reset "+k);
 for(const k of underlayControls)
  assert.ok(ui.includes('name="'+k+'"'),"UI slider "+k);
 for(const label of ["underlay: <>","Weave this ground","New fabric","Hide underlay"])
  assert.ok(ui.includes(label),label);
 assert.ok(findControls("jacquard").some(x=>x.id==="underlay"));
 assert.ok(findControls("moire").some(x=>x.id==="underlay"));
 assert.ok(findControls("velvet pile").some(x=>x.id==="underlay"));
});
