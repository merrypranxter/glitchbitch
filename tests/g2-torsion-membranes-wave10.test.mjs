import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,numericRanges,validateRecipe,recipeDocument,parseDocument,randomize}
  from "../src/data.js";
import {sectionMeta,findControls} from "../src/ui-index.js";
import {g2Modes,g2Controls,g2Presets,g2GLSL,
  applyG2Preset,shuffleG2,hideG2} from "../src/g2-torsion-membranes.js";

const read=path=>readFileSync(new URL("../src/"+path,import.meta.url),"utf8");
const original={...initial,seed:284174,engine:14,ratio:"9:16",
  colors:["#fd27da","#03e7ef","#ffdd44"],lettering:"MY MATHEMATICAL MONSTER",
  filamentAmount:72,filamentSpecies:"Quasicrystal Brocade",
  breedAmount:65,schlierenAmount:68,afterimage:27,datamosh:11,
  hexagramAmount:77,polesAmount:84,qdAmount:41,vldAmount:55,hcrAmount:61};

test("Wave 10: five G2-inspired modes, eleven bounded controls, six presets and dormant defaults",()=>{
  assert.equal(g2Modes.length,5);
  assert.equal(g2Controls.length,11);
  assert.equal(g2Presets.length,6);
  assert.equal(new Set(g2Modes).size,5);
  assert.equal(new Set(g2Controls).size,11);
  assert.equal(initial.g2Amount,0);
  assert.equal(initial.g2Mode,g2Modes[0]);
  const vintage={...original};
  delete vintage.g2Mode;
  for(const key of g2Controls)delete vintage[key];
  const parsed=validateRecipe(vintage);
  assert.equal(parsed.g2Amount,0);
  assert.equal(parsed.g2Mode,initial.g2Mode);
  for(const key of g2Controls){
    assert.deepEqual(numericRanges[key],[0,100],key);
    assert.equal(parsed[key],initial[key]);
    for(const invalid of [-1,101,NaN,Infinity])
      assert.throws(()=>validateRecipe({...original,[key]:invalid}),
        new RegExp("Invalid "+key));
  }
  assert.throws(()=>validateRecipe({...original,g2Mode:"Fictional G2"}),/Unknown g2Mode/);
});

test("Wave 10: six visually distinct presets survive document/clock roundtrip",()=>{
  const variants=new Set();
  for(const preset of g2Presets){
    const updated=applyG2Preset(original,preset.name);
    variants.add(updated.g2Mode);
    assert.equal(updated.g2Mode,preset.g2Mode);
    assert.ok(updated.g2Amount>0);
    for(const key of g2Controls){
      assert.equal(updated[key],preset[key]);
      assert.ok(Number.isFinite(updated[key])&&updated[key]>=0&&updated[key]<=100);
    }
    for(const key of ["engine","ratio","seed","colors","lettering",
      "filamentAmount","breedAmount","schlierenAmount","afterimage",
      "hexagramAmount","polesAmount","qdAmount","vldAmount","hcrAmount"])
      assert.deepEqual(updated[key],original[key]);
    const clock={time:3.75,colorTime:11.2,textTime:7.4};
    const saved=recipeDocument(updated,"Chromatic Torsion",clock);
    const loaded=parseDocument(JSON.parse(JSON.stringify(saved)));
    assert.deepEqual(loaded.timeline,clock);
    assert.equal(loaded.state.g2Mode,updated.g2Mode);
    for(const key of g2Controls)assert.equal(loaded.state[key],updated[key]);
    const hidden=hideG2(updated);
    assert.equal(hidden.g2Amount,0);
    assert.equal(hidden.polesAmount,original.polesAmount);
    assert.equal(hidden.vldAmount,original.vldAmount);
    assert.equal(hidden.lettering,original.lettering);
  }
  assert.equal(variants.size,5);
  assert.equal(applyG2Preset(original,"missing"),original);
});

test("Wave 10: targeted shuffle is finite even for invalid pseudo RNG and preserves all legacy art",()=>{
  for(const value of [0,.12,.333333,.659,.999999,NaN,Infinity,-Infinity]){
    const random=()=>value;
    const shuffled=shuffleG2(original,random);
    assert.deepEqual(shuffled,shuffleG2(original,random));
    assert.ok(g2Modes.includes(shuffled.g2Mode));
    assert.ok(shuffled.g2Amount>=40&&shuffled.g2Amount<=100);
    for(const key of g2Controls)
      assert.ok(Number.isFinite(shuffled[key])&&shuffled[key]>=0&&shuffled[key]<=100,key);
    for(const key of ["engine","colors","ratio","seed","lettering",
      "filamentAmount","breedAmount","hcrAmount","schlierenAmount"])
      assert.deepEqual(shuffled[key],original[key],key);
  }
});

test("Wave 10: Mutate cannot wake dormant G2 and Surprise Me can generate it",()=>{
  const dormant=randomize(original,{},true,()=>.77);
  for(const key of g2Controls)
    assert.equal(dormant[key],original[key],key);
  assert.equal(dormant.g2Mode,original.g2Mode);
  const active=applyG2Preset(original,g2Presets[0].name);
  const after=randomize(active,{},true,()=>.77);
  assert.equal(after.g2Mode,active.g2Mode);
  assert.ok(after.g2Amount>0);
  assert.ok(g2Controls.some(key=>after[key]!==active[key]));
  const data=read("data.js");
  assert.match(data,/if\(key\.startsWith\("g2"\) && state\.g2Amount<=0\)continue/);
  assert.match(data,/s\.g2Mode=sample\(g2Modes,random\)/);
  assert.match(data,/s\.g2Amount=random\(\)<\.35\?40\+random\(\)\*60:0/);
  assert.match(data,/for\(const key of g2Controls\)if\(key!=="g2Amount"\)/);
});

test("Wave 10: physically inspired source geometry is real, bounded and palette-derived",()=>{
  assert.match(g2GLSL,/vec4 g2Membrane\(inout vec2 p\)/);
  assert.match(g2GLSL,/vec3 phi=normalize/);
  assert.match(g2GLSL,/vec3 dual=normalize/);
  assert.match(g2GLSL,/abs\(dot\(phi,dual\)\)/);
  assert.match(g2GLSL,/for\(int i=0;i<2;i\+\+\)/);
  assert.match(g2GLSL,/float fracture=smoothstep/);
  assert.match(g2GLSL,/p\+=bend\*g2Warp\*g2Amount/);
  assert.match(g2GLSL,/vec3 g2Dress\(vec3 col,vec4 field,vec2 p\)/);
  assert.match(g2GLSL,/vec3 film=palette\(chromaPhase\)/);
  assert.match(g2GLSL,/vec3 prism=palette\(chromaPhase\+separation\*\.13\)/);
  for(let i=0;i<4;i++)assert.ok(g2GLSL.includes("g2Mode=="+i));
  assert.doesNotMatch(g2GLSL,/sampler2D|readPixels|framebuffer|raymarch/i);
  assert.doesNotMatch(g2GLSL,/\b(?:coherent|active|resource)\b\s*=/);
  assert.ok(g2GLSL.length<12000);
});

test("Wave 10: shader compiles only when enabled, ahead of geometry, and uses same exact export renderer",()=>{
  const renderer=read("renderer.js");
  for(const marker of ["G2_MODULE","G2_PRE","G2_POST"])
    assert.ok(renderer.includes("/* "+marker+" */"),marker);
  assert.match(renderer,/withG2 = s\.g2Amount>0/);
  assert.match(renderer,/withG2\?"g2-torsion":"no-g2"/);
  assert.match(renderer,/withG2 \? g2GLSL : ""/);
  assert.match(renderer,/vec4 g2Data=g2Membrane\(p\)/);
  assert.match(renderer,/col=g2Dress\(col,g2Data,p\)/);
  assert.match(renderer,/g2Unavailable \? \{g2Amount:0\}/);
  assert.match(renderer,/if\(candidate\.g2Amount>0 && !g2Unavailable\)/);
  assert.match(renderer,/if\(exactEffects\)throw artworkParityError\("Full-effect shader failed to compile",e\)/);
  assert.match(renderer,/g2Modes\.indexOf\(s\.g2Mode\)/);
  assert.match(renderer,/missing\.push\("G2 Torsion Membranes"\)/);
  for(const key of g2Controls)
    assert.ok(renderer.includes('"'+key+'"'),key);
  const pre=renderer.indexOf("/* G2_PRE */");
  const scene=renderer.indexOf("float v=composed(p);");
  const post=renderer.indexOf("/* G2_POST */");
  assert.ok(pre>0 && pre<scene && scene<post);
  const exporter=read("export.js");
  assert.match(exporter,/renderer = createRenderer\(canvas,\{exactEffects:true\}\)/);
  assert.match(exporter,/await waitForGraphics\(renderer,signal\)/);
  assert.match(exporter,/gif\.writeFrame\(indexed,size\.width,size\.height/);
  assert.match(exporter,/source = new CanvasSource\(work\.capture/);
});

test("Wave 10: actual controls and find/reset connect to Math inspector",()=>{
  const ui=read("components/Inspectors.jsx");
  assert.match(ui,/id="g2-membrane"/);
  assert.match(ui,/Torsion membrane organism/);
  assert.match(ui,/applyG2Preset\(s,g2Preset\)/);
  assert.match(ui,/shuffleG2\(s\)/);
  assert.match(ui,/history\.change\(hideG2\)/);
  for(const key of g2Controls)
    assert.match(ui,new RegExp('name="'+key+'"'));
  assert.equal(sectionMeta("g2-membrane").tab,"Math");
  assert.deepEqual(sectionMeta("g2-membrane").on,["g2Amount"]);
  assert.ok(findControls("holonomy",30).some(x=>x.id==="g2-membrane"));
  assert.ok(findControls("kintsugi",30).some(x=>x.id==="g2-membrane"));
});
