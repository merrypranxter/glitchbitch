import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { initial, numericRanges, validateRecipe, recipeDocument, parseDocument, randomize } from "../src/data.js";
import { atmosphereModes, atmosphereControls, atmospherePresets,
  applyAtmospherePreset, nextAtmosphereMode, hideAtmosphere,
  atmosphereGLSL } from "../src/mutant-atmospheres.js";
import { sectionMeta, sectionActive, findControls } from "../src/ui-index.js";

test("four atmosphere species and five bounded presets",()=>{
  assert.deepEqual(atmosphereModes,[
    "Prismatic mycelium","Mandala gas leak","Heartbeat phosphor","Misprint rosette"
  ]);
  assert.equal(new Set(atmosphereModes).size,4);
  assert.equal(atmospherePresets.length,5);
  for(const p of atmospherePresets){
    assert.ok(atmosphereModes.includes(p.atmoMode));
    for(const key of atmosphereControls) {
      assert.deepEqual(numericRanges[key],[0,100],key);
      assert.ok(Number.isFinite(p[key]) && p[key]>=0 && p[key]<=100,p.name+" "+key);
    }
  }
});
test("legacy recipes keep original content and atmosphere remains opt-in",()=>{
  const original={...initial,engine:17,secondaryEngine:19,blend:55,
    colors:["#111111","#00ffaa","#ffee00"],lettering:"FUCK YEAH",
    filmAmount:59,microAmount:43,underlayAmount:48,filamentAmount:70,
    atmoAmount:0};
  const older={...original};
  delete older.atmoMode;
  for(const key of atmosphereControls)delete older[key];
  const restored=validateRecipe(older);
  assert.equal(restored.atmoMode,atmosphereModes[0]);
  assert.equal(restored.atmoAmount,0);
  for(const key of ["engine","secondaryEngine","blend","colors","lettering",
    "filmAmount","microAmount","underlayAmount","filamentAmount"])
    assert.deepEqual(restored[key],original[key]);
});
test("atmosphere presets edit only atmosphere; never artwork, words or colors",()=>{
  const art={...initial,engine:18,secondaryEngine:17,blend:61,
    seed:43871,ratio:"9:16",colors:["#ffff00","#ff00ff","#00bbff"],
    lettering:"MY PERSONAL QUOTE",marks:[],letteringLayers:[],
    underlayAmount:87,filamentAmount:66,photonAmount:80,
    atmoAmount:0};
  for(const p of atmospherePresets){
    const next=applyAtmospherePreset(art,p.name);
    assert.equal(next.atmoMode,p.atmoMode);
    assert.ok(next.atmoAmount>0);
    for(const key of ["engine","secondaryEngine","blend","seed","ratio","colors",
      "lettering","letteringLayers","marks","underlayAmount","filamentAmount","photonAmount"])
      assert.deepEqual(next[key],art[key],p.name+" changed "+key);
    const output=parseDocument(recipeDocument(next,p.name,{time:2,colorTime:7}));
    assert.equal(output.state.atmoMode,p.atmoMode);
    assert.equal(output.state.atmoAmount,p.atmoAmount);
  }
  assert.equal(applyAtmospherePreset(art,"not a preset"),art);
});
test("mode selection, hide, validation, and shuffle have reversible semantics",()=>{
  const base={...initial,atmoAmount:0,lettering:"NEVER DELETE MY WORDS"};
  assert.equal(sectionActive(sectionMeta("atmosphere"),base),false);
  const next=nextAtmosphereMode(base,()=>0);
  assert.notEqual(next.atmoMode,base.atmoMode);
  assert.ok(next.atmoAmount>=60);
  assert.equal(next.lettering,base.lettering);
  assert.equal(sectionActive(sectionMeta("atmosphere"),next),true);
  assert.equal(hideAtmosphere(next).atmoAmount,0);
  assert.equal(hideAtmosphere(next).atmoMode,next.atmoMode);
  assert.throws(()=>validateRecipe({...initial,atmoMode:"untrusted shader"}),/Unknown atmoMode/);
  assert.throws(()=>validateRecipe({...initial,atmoAmount:101}),/Invalid atmoAmount/);
  assert.throws(()=>validateRecipe({...initial,atmoScale:NaN}),/Invalid atmoScale/);
  for(const rng of [()=>0,()=>0.5,()=>.99999,()=>NaN]){
    const m=nextAtmosphereMode(base,rng);
    assert.ok(atmosphereModes.includes(m.atmoMode));
    assert.notEqual(m.atmoMode,base.atmoMode);
  }
  assert.equal(findControls("fungal stained glass")[0].id,"atmosphere");
  assert.equal(findControls("heartbeat phosphor")[0].id,"atmosphere");
  assert.equal(findControls("misprint rosette")[0].id,"atmosphere");
});
test("full Surprise and Mutate keep new numeric controls valid",()=>{
  const seed={...initial,atmoAmount:41};
  const mutated=randomize(seed,{},true,()=>.67);
  const surprised=randomize(seed,{},false,()=>.68);
  for(const result of [mutated,surprised]){
    assert.ok(atmosphereModes.includes(result.atmoMode));
    for(const key of atmosphereControls){
      assert.ok(result[key]>=0 && result[key]<=100,key);
    }
    assert.doesNotThrow(()=>validateRecipe(result));
  }
});
test("one atmospheric shader compiles per mode, uses existing palette and timeline",()=>{
  for(const s of ["#if ATMO_MODE == 0","#elif ATMO_MODE == 1",
    "#elif ATMO_MODE == 2","#elif ATMO_MODE == 3",
    "atmoAmount","atmoDensity","atmoMotion","atmoGlow","atmoHue","atmoVariation",
    "palette(","time","gl_FragCoord","displayMask"])
    assert.ok(atmosphereGLSL.includes(s),s);
  assert.doesNotMatch(atmosphereGLSL, /sampler2D|texture2D|uint\b|GLSL3/);
  const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
  assert.match(renderer,/withAtmosphere = s\.atmoAmount>0/);
  assert.match(renderer,/atmosphereGLSL\.replace\("\/\* ATMOSPHERE_VARIANT \*\/"/);
  assert.match(renderer,/livingMutantAtmosphere\(col,uv,p,v\)/);
  assert.match(renderer,/atmosphereUnavailable=true/);
  assert.match(renderer,/atmoAmount:0/);
  assert.match(renderer,/atmoAmount","atmoScale"/);
});
test("Scene inspector exposes actual wired controls, five presets and hide",()=>{
  const ui=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
  assert.match(ui,/atmosphere: <>/);
  for(const field of atmosphereControls)assert.ok(ui.includes('name="'+field+'"'),field);
  assert.match(ui,/applyAtmospherePreset\(x,atmoPreset\)/);
  assert.match(ui,/history\.change\(hideAtmosphere\)/);
  assert.equal(sectionMeta("atmosphere").group,"Scene");
});
