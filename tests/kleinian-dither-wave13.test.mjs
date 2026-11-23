import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,numericRanges,validateRecipe,recipeDocument,parseDocument,randomize}
  from "../src/data.js";
import {kdModes,kdControls,kdPresets,kdGLSL,
  applyKdPreset,shuffleKd,hideKd} from "../src/kleinian-dither-wave13.js";
import {sectionMeta,findControls} from "../src/ui-index.js";
import {effectEntries,directoryEntries} from "../src/effects-navigation.js";
import {createNewCanvas} from "../src/new-canvas.js";
const read=path=>readFileSync(new URL("../src/"+path,import.meta.url),"utf8");
const old={...initial,seed:448899,ratio:"9:16",engine:14,
  colors:["#ee00bb","#05ccfa","#fbed21"],lettering:"NEVER DELETE THE TEXT",
  g2Amount:48,psAmount:80,spxAmount:75,breedAmount:70,
  filamentAmount:86,hexagramAmount:44,afterimage:35};

test("Wave 13: five printable Kleinian anatomies, thirteen bounded sliders and six presets",()=>{
  assert.equal(kdModes.length,5);
  assert.equal(new Set(kdModes).size,5);
  assert.equal(kdControls.length,13);
  assert.equal(new Set(kdControls).size,13);
  assert.equal(kdPresets.length,6);
  assert.ok(kdModes.every(mode=>kdPresets.some(p=>p.kdMode===mode)));
  assert.equal(initial.kdMode,"Schottky Lace Press");
  assert.equal(initial.kdAmount,0);
  for(const key of kdControls){
    assert.deepEqual(numericRanges[key],[0,100],key);
    assert.ok(Number.isFinite(initial[key]),key);
    for(const v of [-1,101,NaN,Infinity])
      assert.throws(()=>validateRecipe({...old,[key]:v}),
        new RegExp("Invalid "+key));
  }
  assert.throws(()=>validateRecipe({...old,kdMode:"Not a real print mode"}),/Unknown kdMode/);
});

test("Wave 13: imported legacy recipes gain dormant ink and preserve real colors and text",()=>{
  const prior={...old};delete prior.kdMode;
  for(const key of kdControls)delete prior[key];
  const next=validateRecipe(prior);
  assert.equal(next.kdMode,initial.kdMode);
  assert.equal(next.kdAmount,0);
  for(const key of kdControls)assert.equal(next[key],initial[key]);
  assert.deepEqual(next.colors,old.colors);
  assert.equal(next.lettering,old.lettering);
  assert.equal(createNewCanvas().state.kdAmount,0);
});

test("Wave 13: presets never change prior engines, scales, words or animated clocks",()=>{
  for(const p of kdPresets){
    const after=applyKdPreset(old,p.name);
    assert.equal(after.kdMode,p.kdMode);
    assert.ok(after.kdAmount>0);
    for(const key of kdControls)assert.equal(after[key],p[key],p.name+" "+key);
    for(const key of ["seed","ratio","engine","colors","lettering",
      "g2Amount","psAmount","spxAmount","breedAmount","filamentAmount",
      "hexagramAmount","afterimage"])
      assert.deepEqual(after[key],old[key],key);
    const clocks={time:24.4,colorTime:10.25,textTime:16.3};
    const doc=recipeDocument(after,p.name,clocks);
    const restored=parseDocument(JSON.parse(JSON.stringify(doc)));
    assert.deepEqual(restored.timeline,clocks);
    for(const key of kdControls)assert.equal(restored.state[key],after[key]);
    assert.equal(restored.state.kdMode,after.kdMode);
    assert.equal(hideKd(after).kdAmount,0);
  }
  assert.equal(applyKdPreset(old,"nonexistent"),old);
});

test("Wave 13: deterministic targeted shuffle changes only inversion-print settings",()=>{
  for(const v of [0,.12,.49,.76,.999999,NaN,Infinity,-Infinity]){
    const rand=()=>v,next=shuffleKd(old,rand);
    assert.deepEqual(next,shuffleKd(old,rand));
    assert.ok(kdModes.includes(next.kdMode));
    assert.ok(next.kdAmount>=35&&next.kdAmount<=100);
    for(const key of kdControls)
      assert.ok(Number.isFinite(next[key])&&next[key]>=0&&next[key]<=100,key);
    for(const key of ["seed","engine","ratio","colors","lettering",
      "g2Amount","psAmount","spxAmount","breedAmount","filamentAmount",
      "hexagramAmount","afterimage"])
      assert.deepEqual(next[key],old[key],key);
  }
});

test("Wave 13: Mutate cannot awaken inactive art; Surprise Me includes the new species",()=>{
  const dormant=randomize(old,{},true,()=>.77);
  assert.equal(dormant.kdAmount,0);
  for(const key of kdControls)assert.equal(dormant[key],old[key]);
  const active=applyKdPreset(old,kdPresets[0].name);
  const mutated=randomize(active,{},true,()=>.77);
  assert.equal(mutated.kdMode,active.kdMode);
  assert.ok(mutated.kdAmount>0);
  assert.ok(kdControls.some(key=>mutated[key]!==active[key]));
  const data=read("data.js");
  assert.match(data,/if\(key\.startsWith\("kd"\) && state\.kdAmount<=0\)continue/);
  assert.match(data,/s\.kdMode=sample\(kdModes,random\)/);
  assert.match(data,/s\.kdAmount=random\(\)<\.38\?39\+random\(\)\*61:0/);
  assert.match(data,/for\(const key of kdControls\)if\(key!=="kdAmount"\)/);
});

test("Wave 13: source-grounded Möbius, Schottky inversion and 4x4 Bayer print are real GLSL",()=>{
  assert.match(kdGLSL,/vec2 kdMultiply\(vec2 a,vec2 b\)/);
  assert.match(kdGLSL,/vec2 kdDivide\(vec2 a,vec2 b\)/);
  assert.match(kdGLSL,/float kdBayer\(vec2 pixel\)/);
  assert.match(kdGLSL,/return \(rank\+\.5\)\/16\.0;/);
  assert.match(kdGLSL,/for\(int stepIndex=0;stepIndex<7;stepIndex\+\+\)/);
  assert.match(kdGLSL,/if\(d2<radius\*radius\)/);
  assert.match(kdGLSL,/z=center\+delta\*min\(16\.0,radius\*radius\/max\(\.016,d2\)\)/);
  assert.match(kdGLSL,/for\(int plane=0;plane<3;plane\+\+\)/);
  assert.match(kdGLSL,/thresholdG=kdBayer\(gl_FragCoord\.xy\+vec2\(2\.0,3\.0\)\)/);
  assert.match(kdGLSL,/thresholdB=kdBayer\(gl_FragCoord\.xy\+vec2\(3\.0,1\.0\)\)/);
  assert.match(kdGLSL,/vec3 pigment=palette\(phase\)/);
  assert.match(kdGLSL,/colorTime/);
  assert.match(kdGLSL,/res\.y/);
  for(let i=0;i<5;i++)assert.ok(kdGLSL.includes("kdMode=="+i),String(i));
  assert.equal((kdGLSL.match(/for\(/g)||[]).length,2);
  assert.doesNotMatch(kdGLSL,/sampler2D|framebuffer|readPixels|raymarch|texture2D|fwidth|int\[16\]|cosh/i);
  assert.ok(kdGLSL.length<12000);
});

test("Wave 13: same strict preview/export renderer, shader key and GPU fallback notice",()=>{
  const r=read("renderer.js");
  assert.match(r,/withKd = s\.kdAmount>0/);
  assert.match(r,/withKd\?"klein-dither-"\+kdModes\.indexOf\(s\.kdMode\):"no-klein-dither"/);
  assert.match(r,/withKd \? kdGLSL : ""/);
  assert.match(r,/col=kdDress\(col,uv,p,v\);/);
  assert.match(r,/kdUnavailable \? \{kdAmount:0\}/);
  assert.match(r,/if\(candidate\.kdAmount>0 && !kdUnavailable\)/);
  assert.match(r,/missing\.push\("Kleinian Dither Cathedral"\)/);
  assert.match(r,/gl\.uniform1i\(loc\("kdMode"\),kdModes\.indexOf\(s\.kdMode\)\)/);
  assert.match(r,/if\(exactEffects\)throw artworkParityError\("Full-effect shader failed to compile",e\)/);
  for(const key of kdControls)assert.ok(r.includes('"'+key+'"'),key);
  const module=r.indexOf("/* KD_MODULE */"),post=r.indexOf("/* KD_POST */"),
    appearance=r.indexOf("col=applyAppearance(col,uv);"),
    light=r.indexOf("col=animateLight(col,uv,v);");
  assert.ok(module>0&&module<post&&post<light&&light<appearance);
  const exp=read("export.js");
  assert.match(exp,/renderer = createRenderer\(canvas,\{exactEffects:true\}\)/);
});

test("Wave 13: Codex control-room Signal lab includes Active, Favorites, Find and complete reset",()=>{
  const meta=sectionMeta("kleinian-dither");
  assert.ok(meta);
  assert.equal(meta.tab,"Effects");
  assert.equal(meta.group,"Signal");
  assert.deepEqual(meta.on,["kdAmount"]);
  assert.deepEqual(meta.reset.slice(1),kdControls);
  assert.ok(effectEntries.some(e=>e.id==="kleinian-dither"));
  assert.ok(findControls("circle inversion",30).some(e=>e.id==="kleinian-dither"));
  assert.ok(findControls("cantor dust",30).some(e=>e.id==="kleinian-dither"));
  const jsx=read("components/Inspectors.jsx");
  assert.match(jsx,/"kleinian-dither": <>/);
  assert.match(jsx,/applyKdPreset\(x,kdPreset\)/);
  assert.match(jsx,/shuffleKd\(x\)/);
  assert.match(jsx,/history\.change\(hideKd\)/);
  for(const key of kdControls)assert.ok(jsx.includes('name="'+key+'"'),key);
  const active=directoryEntries({view:"active",category:"Signal",
    query:"",favorites:[],state:applyKdPreset(initial,kdPresets[0].name)});
  assert.ok(active.some(e=>e.id==="kleinian-dither"));
  const inactive=directoryEntries({view:"active",category:"Signal",
    query:"",favorites:[],state:initial});
  assert.ok(!inactive.some(e=>e.id==="kleinian-dither"));
  const favorites=directoryEntries({view:"favorites",category:"Signal",
    query:"",favorites:["kleinian-dither"],state:initial});
  assert.ok(favorites.some(e=>e.id==="kleinian-dither"));
});
