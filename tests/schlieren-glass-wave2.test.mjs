import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,numericRanges,validateRecipe,recipeDocument,parseDocument,randomize} from "../src/data.js";
import {sectionMeta,findControls} from "../src/ui-index.js";
import {schlierenModes,schlierenControls,schlierenPresets,schlierenFragment,
  applySchlierenPreset,shuffleSchlieren,hideSchlieren} from "../src/schlieren-glass.js";
import {createSchlierenPass} from "../src/schlieren-pass.js";
const source=path=>readFileSync(new URL("../src/"+path,import.meta.url),"utf8");
const previous={...initial,engine:6,filamentAmount:89,
  filamentSpecies:"Feral Jacquard",filamentMaterial:"Velvet flock",
  afterimage:39,datamosh:22,lettering:"BEND THE FUCKING LIGHT",
  colors:["#fa19ac","#03e7ef","#ffdd44"],ratio:"9:16",seed:912311};

test("old recipes keep glass off, five modes and ten bounded controls",()=>{
  assert.equal(schlierenModes.length,5);
  assert.equal(new Set(schlierenModes).size,5);
  assert.equal(schlierenControls.length,10);
  assert.equal(new Set(schlierenControls).size,10);
  assert.equal(initial.schlierenAmount,0);
  const vintage={...previous};delete vintage.schlierenMode;
  for(const k of schlierenControls)delete vintage[k];
  const parsed=validateRecipe(vintage);
  assert.equal(parsed.schlierenAmount,0);
  assert.equal(parsed.schlierenMode,initial.schlierenMode);
  for(const k of schlierenControls){
    assert.deepEqual(numericRanges[k],[0,100]);
    assert.equal(parsed[k],initial[k]);
    assert.throws(()=>validateRecipe({...previous,[k]:101}),new RegExp("Invalid "+k));
  }
  assert.throws(()=>validateRecipe({...previous,schlierenMode:"Fake blur"}),/Unknown schlierenMode/);
  assert.equal(sectionMeta("schlieren").group,"Light");
  assert.ok(findControls("schlieren").some(x=>x.id==="schlieren"));
  assert.ok(findControls("refraction").some(x=>x.id==="schlieren"));
});

test("presets preserve palettes, lettering, filament, feedback and export clocks",()=>{
  assert.equal(schlierenPresets.length,5);
  for(const p of schlierenPresets){
    const out=applySchlierenPreset(previous,p.name);
    assert.equal(out.schlierenMode,p.schlierenMode);
    for(const k of schlierenControls)assert.equal(out[k],p[k]);
    for(const k of ["seed","colors","lettering","ratio","engine",
      "filamentAmount","filamentSpecies","filamentMaterial","afterimage","datamosh"])
      assert.deepEqual(out[k],previous[k],p.name+" "+k);
    const roundTrip=parseDocument(recipeDocument(out,p.name,{time:2,colorTime:5,textTime:3}));
    for(const k of schlierenControls)assert.equal(roundTrip.state[k],out[k]);
    assert.deepEqual(roundTrip.timeline,{time:2,colorTime:5,textTime:3});
  }
  assert.equal(applySchlierenPreset(previous,"No such glass"),previous);
});

test("shuffle is deterministic; mutate never awakens old glass",()=>{
  for(const n of [0,.19,.51,.99999,NaN]){
    const random=()=>n,out=shuffleSchlieren(previous,random);
    assert.deepEqual(out,shuffleSchlieren(previous,random));
    assert.ok(schlierenModes.includes(out.schlierenMode));
    assert.ok(out.schlierenAmount>=40);
    for(const k of schlierenControls){
      assert.ok(out[k]>=0&&out[k]<=100,k);
      assert.ok(Number.isFinite(out[k]),k);
    }
    for(const k of ["seed","colors","lettering","ratio","engine",
      "filamentAmount","filamentSpecies","filamentMaterial","afterimage","datamosh"])
      assert.deepEqual(out[k],previous[k],k);
    assert.equal(hideSchlieren(out).schlierenAmount,0);
  }
  const mutant=randomize(previous,{},true,()=>.77);
  for(const k of schlierenControls)assert.equal(mutant[k],previous[k],k);
  const active=applySchlierenPreset(previous,schlierenPresets[0].name);
  const changed=randomize(active,{},true,()=>.77);
  assert.ok(schlierenControls.some(k=>changed[k]!==active[k]));
});

test("GLSL reads actual full artwork pixels and displaces with SDF surface normals",()=>{
  assert.match(schlierenFragment,/uniform sampler2D artTex/);
  assert.match(schlierenFragment,/float glassSdf/);
  assert.match(schlierenFragment,/glassSdf\(p\+vec2\(eps,0\.0\)\)/);
  assert.match(schlierenFragment,/vec2 shifted=displacement\/aspect/);
  assert.match(schlierenFragment,/texture2D\(artTex,uv\)/);
  assert.match(schlierenFragment,/texture2D\(artTex,clamp\(coord\+rgbEdge/);
  assert.match(schlierenFragment,/texture2D\(artTex,clamp\(coord-rgbEdge/);
  assert.doesNotMatch(schlierenFragment,/uniform vec3 colors/);
  const pass=source("schlieren-pass.js");
  assert.match(pass,/createSchlierenPass/);
  assert.match(pass,/createTexture\(w,h\)/);
  assert.match(pass,/gl\.framebufferTexture2D/);
  assert.match(pass,/gl\.bindFramebuffer\(gl\.FRAMEBUFFER,null\)/);
  assert.match(pass,/assertGl\("Schlieren refraction draw failed"\)/);
  assert.doesNotMatch(pass,/copyTexSubImage2D|readPixels|setInterval|Date\.now/);
  assert.equal(typeof createSchlierenPass,"function");
});

test("the feedback presentation reuses finished history and strict export fails visibly",()=>{
  const renderer=source("renderer.js");
  assert.match(renderer,/compositeFeedback\(s,timeline,w,h,withSchlieren=false\)/);
  assert.match(renderer,/glassPass\(\)\.present\(memory\.history\[writeIndex\],s,timeline,w,h\)/);
  assert.match(renderer,/if\(drawWithSchlieren && !drawWithMemory\)/);
  assert.match(renderer,/drawWithSchlieren \? glassPass\(\)\.prepareBuffer/);
  assert.match(renderer,/if\(exactEffects\)throw artworkParityError\(/);
  assert.match(renderer,/Schlieren glass failed to refract the full artwork/);
  assert.match(renderer,/schlieren\?\.destroy\(\)/);
  const ui=source("components/Inspectors.jsx");
  assert.match(ui,/"schlieren": <>/);
  assert.match(ui,/applySchlierenPreset\(x,schlierenPreset\)/);
  assert.match(ui,/shuffleSchlieren\(x\)/);
  assert.match(ui,/onClick=\{\(\)=>history\.change\(hideSchlieren\)\}/);
});
