import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,numericRanges,validateRecipe,recipeDocument,parseDocument,randomize} from "../src/data.js";
import {sectionMeta,findControls} from "../src/ui-index.js";
import {polesModes,polesControls,polesPresets,polesGLSL,
  applyPolesPreset,shufflePoles,hidePoles} from "../src/complex-poles.js";
const read=file=>readFileSync(new URL("../src/"+file,import.meta.url),"utf8");
const source={...initial,seed:813793,engine:14,ratio:"9:16",
  filamentAmount:86,filamentSpecies:"Quasicrystal Brocade",
  filamentMaterial:"Velvet flock",
  schlierenAmount:69,schlierenMode:"Prismatic blossoms",
  hexagramAmount:72,lettering:"POLES ARE ASSHOLES",
  colors:["#ff00c8","#03e7ef","#ffee16"]};

test("five new pole species and eleven fields are dormant and validated in old recipes",()=>{
  assert.equal(polesModes.length,5);
  assert.equal(polesPresets.length,5);
  assert.equal(polesControls.length,11);
  assert.equal(new Set(polesControls).size,11);
  assert.equal(new Set(polesModes).size,5);
  assert.equal(initial.polesAmount,0);
  const vintage={...source};delete vintage.polesMode;
  for(const k of polesControls)delete vintage[k];
  const parsed=validateRecipe(vintage);
  assert.equal(parsed.polesAmount,0);
  assert.equal(parsed.polesMode,initial.polesMode);
  for(const k of polesControls){
    assert.deepEqual(numericRanges[k],[0,100],k);
    assert.equal(parsed[k],initial[k]);
    for(const value of [-1,101,NaN,Infinity])
      assert.throws(()=>validateRecipe({...source,[k]:value}),new RegExp("Invalid "+k));
  }
  assert.throws(()=>validateRecipe({...source,polesMode:"RGB fake"}),/Unknown polesMode/);
  assert.equal(sectionMeta("complex-poles").tab,"Math");
  assert.deepEqual(sectionMeta("complex-poles").on,["polesAmount"]);
  assert.ok(findControls("singularity").some(x=>x.id==="complex-poles"));
});

test("presets, shuffle and hide retain palettes, words, optics and exporting clocks",()=>{
  for(const p of polesPresets){
    const active=applyPolesPreset(source,p.name);
    assert.equal(active.polesMode,p.polesMode);
    assert.ok(active.polesAmount>0);
    for(const k of polesControls)assert.equal(active[k],p[k]);
    for(const k of ["engine","ratio","seed","colors","lettering",
      "filamentAmount","filamentSpecies","filamentMaterial","hexagramAmount",
      "schlierenAmount","schlierenMode"])
      assert.deepEqual(active[k],source[k],k);
    const doc=recipeDocument(active,p.name,{time:5.5,colorTime:2.25,textTime:9.75});
    const parsed=parseDocument(JSON.parse(JSON.stringify(doc)));
    assert.deepEqual(parsed.timeline,doc.timeline);
    for(const k of polesControls)assert.equal(parsed.state[k],active[k]);
    assert.equal(parsed.state.polesMode,active.polesMode);
    assert.equal(hidePoles(active).polesAmount,0);
  }
  assert.equal(applyPolesPreset(source,"Nonexistent"),source);
  for(const v of [0,.19,.59,.999999,NaN]){
    const random=()=>v;
    const shuffled=shufflePoles(source,random);
    assert.deepEqual(shuffled,shufflePoles(source,random));
    assert.ok(polesModes.includes(shuffled.polesMode));
    assert.ok(shuffled.polesAmount>=35&&shuffled.polesAmount<=100);
    for(const k of polesControls)assert.ok(shuffled[k]>=0&&shuffled[k]<=100);
    for(const k of ["seed","colors","lettering","engine","filamentAmount",
      "hexagramAmount","schlierenAmount"])
      assert.deepEqual(shuffled[k],source[k]);
  }
});

test("mutate never wakes hidden poles but nudges actively selected fields",()=>{
  const dormant=randomize(source,{},true,()=>.77);
  for(const k of polesControls)assert.equal(dormant[k],source[k],k);
  const live=applyPolesPreset(source,polesPresets[0].name);
  const changed=randomize(live,{},true,()=>.77);
  assert.equal(changed.polesMode,live.polesMode);
  assert.ok(changed.polesAmount>0);
  assert.ok(polesControls.some(k=>changed[k]!==live[k]));
});

test("source is a real bounded moving rational map with Newton root correction",()=>{
  assert.match(polesGLSL,/vec2 z2=pzMultiply\(z,z\)/);
  assert.match(polesGLSL,/vec2 z4=pzMultiply\(z2,z2\)/);
  assert.match(polesGLSL,/vec2 z5=pzMultiply\(z4,z\)/);
  assert.match(polesGLSL,/vec2 numerator=z5-vec2\(1\.0,0\.0\)/);
  assert.match(polesGLSL,/vec2 denominator=z2\+movingPole/);
  assert.match(polesGLSL,/vec2 newton=pzDivide\(numerator,5\.0\*z4,safeRadius\)/);
  assert.match(polesGLSL,/max\(dot\(denominator,denominator\),safeRadius\*safeRadius\)/);
  assert.match(polesGLSL,/return v\/\(1\.0\+length\(v\)\*tension\)/);
  assert.match(polesGLSL,/return p\+delta/);
  assert.match(polesGLSL,/vec3 ink=palette\(/);
  assert.match(polesGLSL,/colorTime/);
  for(const mode of ["polesMode==1","polesMode==2","polesMode==3","polesMode==4"])
    assert.ok(polesGLSL.includes(mode),mode);
});

test("renderer specializes optional poles into geometry and fails exact export visibly",()=>{
  const renderer=read("renderer.js");
  for(const marker of ["POLES_MODULE","POLES_PRE","POLES_POST"])
    assert.ok(renderer.includes("/* "+marker+" */"),marker);
  assert.match(renderer,/withPoles = s\.polesAmount>0/);
  assert.match(renderer,/withPoles\?"complex-poles":"no-complex-poles"/);
  assert.match(renderer,/p=pzWarpPoint\(p,polesData\)/);
  assert.match(renderer,/col=pzDressColor\(col,polesData\)/);
  assert.match(renderer,/polesUnavailable \? \{polesAmount:0\}/);
  assert.match(renderer,/if\(candidate\.polesAmount>0 && !polesUnavailable\)/);
  assert.match(renderer,/if\(exactEffects\)throw artworkParityError\("Full-effect shader failed to compile",e\)/);
  assert.match(renderer,/polesModes.indexOf\(compiledState.polesMode\)/);
  for(const k of polesControls)assert.ok(renderer.includes('"'+k+'"'),k);
  const pre=renderer.indexOf("/* POLES_PRE */");
  const field=renderer.indexOf("float v=composed(p);");
  assert.ok(pre>=0&&field>pre);
  const ui=read("components/Inspectors.jsx");
  assert.match(ui,/id="complex-poles"/);
  assert.match(ui,/applyPolesPreset\(s,polesPreset\)/);
  assert.match(ui,/shufflePoles\(s\)/);
  assert.match(ui,/history\.change\(hidePoles\)/);
});
