import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,numericRanges,validateRecipe,recipeDocument,parseDocument,randomize} from "../src/data.js";
import {sectionMeta,findControls} from "../src/ui-index.js";
import {
  velvetModes,crochetModes,velvetControls,crochetControls,textilePresets,
  velvetGLSL,crochetGLSL,applyTextilePreset,
  shuffleVelvet,shuffleCrochet,hideVelvet,hideCrochet
} from "../src/living-textiles-wave5.js";

const read=path=>readFileSync(new URL("../src/"+path,import.meta.url),"utf8");
const original={...initial,seed:9162441,engine:14,ratio:"9:16",
  colors:["#fa19ac","#03e7ef","#ffdd44"],lettering:"VELVET IS WITCHCRAFT",
  filamentAmount:88,filamentSpecies:"Quasicrystal Brocade",
  hexagramAmount:72,polesAmount:81,qdAmount:45,schlierenAmount:69,
  afterimage:42,datamosh:27};
const all=[...velvetControls,...crochetControls];

test("Wave 5: 2 independent opt-in shader species with 19 bounded controls and searchable Math groups",()=>{
  assert.equal(velvetModes.length,5);
  assert.equal(crochetModes.length,5);
  assert.equal(new Set(velvetModes).size,5);
  assert.equal(new Set(crochetModes).size,5);
  assert.equal(velvetControls.length,9);
  assert.equal(crochetControls.length,10);
  assert.equal(new Set(all).size,19);
  assert.equal(initial.vldAmount,0);
  assert.equal(initial.hcrAmount,0);
  const vintage={...original};
  delete vintage.velvetMode;delete vintage.crochetMode;
  for(const key of all)delete vintage[key];
  const parsed=validateRecipe(vintage);
  assert.equal(parsed.vldAmount,0);
  assert.equal(parsed.hcrAmount,0);
  assert.equal(parsed.velvetMode,initial.velvetMode);
  assert.equal(parsed.crochetMode,initial.crochetMode);
  for(const key of all){
    assert.deepEqual(numericRanges[key],[0,100],key);
    assert.equal(parsed[key],initial[key]);
    for(const value of [-1,101,NaN,Infinity])
      assert.throws(()=>validateRecipe({...original,[key]:value}),
        new RegExp("Invalid "+key));
  }
  assert.throws(()=>validateRecipe({...original,velvetMode:"Fake Velvet"}),
    /Unknown velvetMode/);
  assert.throws(()=>validateRecipe({...original,crochetMode:"Pretend Crochet"}),
    /Unknown crochetMode/);
  for(const [id,q] of [["living-velvet","velvet"],["hyperbolic-crochet","crochet"]]){
    assert.equal(sectionMeta(id).tab,"Math");
    assert.ok(findControls(q,20).some(s=>s.id===id));
  }
});

test("source presets and isolated shuffles preserve legacy art and recipe animation clocks",()=>{
  assert.equal(textilePresets.length,6);
  for(const preset of textilePresets){
    const updated=applyTextilePreset(original,preset.name);
    assert.equal(updated.velvetMode,preset.velvetMode);
    assert.equal(updated.crochetMode,preset.crochetMode);
    for(const key of all){
      assert.equal(updated[key],preset[key]);
      assert.ok(Number.isFinite(updated[key])&&updated[key]>=0&&updated[key]<=100);
    }
    for(const key of ["engine","seed","ratio","colors","lettering","filamentAmount",
      "filamentSpecies","hexagramAmount","polesAmount","qdAmount",
      "schlierenAmount","afterimage","datamosh"])
      assert.deepEqual(updated[key],original[key],key);
    const frame={time:4.5,colorTime:5.25,textTime:3.75};
    const doc=recipeDocument(updated,"Biological wedding dress",frame);
    const restored=parseDocument(JSON.parse(JSON.stringify(doc)));
    assert.deepEqual(restored.timeline,frame);
    assert.equal(restored.state.velvetMode,preset.velvetMode);
    assert.equal(restored.state.crochetMode,preset.crochetMode);
    for(const key of all)assert.equal(restored.state[key],preset[key]);
    assert.equal(hideVelvet(updated).vldAmount,0);
    assert.equal(hideCrochet(updated).hcrAmount,0);
  }
  assert.equal(applyTextilePreset(original,"Unknown"),original);
  for(const value of [0,.19,.53,.999999,NaN]){
    const random=()=>value;
    const v=shuffleVelvet(original,random);
    const c=shuffleCrochet(original,random);
    assert.deepEqual(v,shuffleVelvet(original,random));
    assert.deepEqual(c,shuffleCrochet(original,random));
    assert.ok(velvetModes.includes(v.velvetMode));
    assert.ok(crochetModes.includes(c.crochetMode));
    assert.ok(v.vldAmount>=35&&v.vldAmount<=100);
    assert.ok(c.hcrAmount>=35&&c.hcrAmount<=100);
    for(const key of velvetControls)assert.ok(Number.isFinite(v[key])&&v[key]>=0&&v[key]<=100,key);
    for(const key of crochetControls)assert.ok(Number.isFinite(c[key])&&c[key]>=0&&c[key]<=100,key);
    assert.equal(v.hcrAmount,original.hcrAmount);
    assert.equal(c.vldAmount,original.vldAmount);
    assert.deepEqual(v.colors,original.colors);
    assert.deepEqual(c.colors,original.colors);
    assert.equal(v.seed,original.seed);
    assert.equal(c.seed,original.seed);
  }
});

test("Mutate keeps both sleeping engines dormant; Surprise Me may enable them",()=>{
  const dormant=randomize(original,{},true,()=>.77);
  for(const key of all)assert.equal(dormant[key],original[key],key);
  const active=applyTextilePreset(original,"Biological Wedding Dress");
  const after=randomize(active,{},true,()=>.77);
  assert.ok(velvetControls.some(key=>after[key]!==active[key]));
  assert.ok(crochetControls.some(key=>after[key]!==active[key]));
  assert.equal(after.velvetMode,active.velvetMode);
  assert.equal(after.crochetMode,active.crochetMode);
  const data=read("data.js");
  assert.match(data,/if\(key\.startsWith\("vld"\) && state\.vldAmount<=0\)continue/);
  assert.match(data,/if\(key\.startsWith\("hcr"\) && state\.hcrAmount<=0\)continue/);
  assert.match(data,/s\.velvetMode=sample\(velvetModes,random\)/);
  assert.match(data,/s\.crochetMode=sample\(crochetModes,random\)/);
});

test("velvet really contains source p4m mirror, seven orbit cells, membranes, nap and illuminated normals",()=>{
  assert.match(velvetGLSL,/vec2 local=abs\(fract\(uv\)-\.5\)\*2\.0/);
  assert.match(velvetGLSL,/if\(local\.x<local\.y\)local=local\.yx/);
  assert.match(velvetGLSL,/for\(int i=0;i<7;i\+\+\)/);
  assert.match(velvetGLSL,/membrane=exp/);
  assert.match(velvetGLSL,/inner=exp/);
  assert.match(velvetGLSL,/core=exp/);
  assert.match(velvetGLSL,/vldField\(p\+vec2\(eps,0\.0\)\)/);
  assert.match(velvetGLSL,/vldField\(p\+vec2\(0\.0,eps\)\)/);
  assert.match(velvetGLSL,/float wet=pow\(ndh/);
  assert.match(velvetGLSL,/vec2 nap=vec2/);
  assert.match(velvetGLSL,/p\+=slope\*vldAmount\*vldRelief/);
  assert.match(velvetGLSL,/vec3 base=palette/);
  assert.doesNotMatch(velvetGLSL,/sampler2D|framebuffer|readPixels/);
});

test("crochet uses source 3D SDF inversion and bounded <=20-step marching, not original 150 steps",()=>{
  assert.match(crochetGLSL,/float hcrMap\(vec3 point\)/);
  assert.match(crochetGLSL,/p\.xy=hcrRuffle\(p\.xy\)/);
  assert.match(crochetGLSL,/for\(int i=0;i<3;i\+\+\)/);
  assert.match(crochetGLSL,/q=-1\.0\+2\.0\*fract/);
  assert.match(crochetGLSL,/float k=clamp\(1\.25\/r2,\.33,3\.6\)/);
  assert.match(crochetGLSL,/return max\(fabric,web\)\+yarn/);
  assert.match(crochetGLSL,/int steps=int\(8\.0\+12\.0\*hcrQuality\)/);
  assert.match(crochetGLSL,/for\(int i=0;i<20;i\+\+\)/);
  assert.match(crochetGLSL,/if\(i>=steps\)break/);
  assert.doesNotMatch(crochetGLSL,/for\(int i=0;i<150/);
  assert.match(crochetGLSL,/vec3 normal=normalize/);
  assert.match(crochetGLSL,/palette\(fract\(hcrHue/);
  assert.match(crochetGLSL,/hcrIridescence/);
  assert.doesNotMatch(crochetGLSL,/sampler2D|framebuffer|readPixels/);
});

test("two separately opt-in programs, full-effect export safety and independent UI controls",()=>{
  const renderer=read("renderer.js");
  assert.match(renderer,/withVelvet = s\.vldAmount>0/);
  assert.match(renderer,/withCrochet = s\.hcrAmount>0/);
  assert.match(renderer,/withVelvet\?"velvet":"no-velvet"/);
  assert.match(renderer,/withCrochet\?"crochet":"no-crochet"/);
  assert.match(renderer,/withVelvet \? velvetGLSL : ""/);
  assert.match(renderer,/withCrochet \? crochetGLSL : ""/);
  assert.match(renderer,/vec4 velvetData=vldPrepare\(p\)/);
  assert.match(renderer,/col=vldDress\(col,p,uv,velvetData\)/);
  assert.match(renderer,/col=hcrDress\(col,uv,p\)/);
  assert.match(renderer,/velvetUnavailable \? \{vldAmount:0\}/);
  assert.match(renderer,/crochetUnavailable \? \{hcrAmount:0\}/);
  assert.match(renderer,/if\(exactEffects\)throw artworkParityError\("Full-effect shader failed to compile",e\)/);
  for(const key of all)assert.ok(renderer.includes('"'+key+'"'),key);
  const inspector=read("components/Inspectors.jsx");
  assert.match(inspector,/id="living-velvet"/);
  assert.match(inspector,/id="hyperbolic-crochet"/);
  assert.match(inspector,/applyTextilePreset\(s,textilePreset\)/);
  assert.match(inspector,/shuffleVelvet\(s\)/);
  assert.match(inspector,/shuffleCrochet\(s\)/);
  assert.match(inspector,/history\.change\(hideVelvet\)/);
  assert.match(inspector,/history\.change\(hideCrochet\)/);
});
