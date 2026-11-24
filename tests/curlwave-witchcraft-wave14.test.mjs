import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,numericRanges,validateRecipe,recipeDocument,parseDocument,randomize}
  from "../src/data.js";
import {vcModes,vcControls,vcPresets,vcGLSL,
  applyVcPreset,shuffleVc,hideVc} from "../src/curlwave-witchcraft-wave14.js";
import {sectionMeta,findControls} from "../src/ui-index.js";
import {effectEntries,directoryEntries} from "../src/effects-navigation.js";
import {createNewCanvas} from "../src/new-canvas.js";
const read=path=>readFileSync(new URL("../src/"+path,import.meta.url),"utf8");
const earlier={...initial,engine:15,seed:761283,ratio:"9:16",
  colors:["#f600be","#09c9ff","#fdfa38"],lettering:"KEEP MY FUCKING QUOTES",
  psAmount:77,kdAmount:67,spxAmount:78,g2Amount:90,
  filamentAmount:86,breedAmount:81,afterimage:28,
  marks:[...initial.marks]};
const untouched=["engine","seed","ratio","colors","lettering","psAmount",
  "kdAmount","spxAmount","g2Amount","filamentAmount","breedAmount","afterimage","marks"];

test("Wave 14: five species, six recipes, thirteen real validated controls",()=>{
  assert.equal(vcModes.length,5);
  assert.equal(new Set(vcModes).size,5);
  assert.equal(vcPresets.length,6);
  assert.equal(vcControls.length,13);
  assert.equal(new Set(vcControls).size,13);
  assert.ok(vcModes.every(mode=>vcPresets.some(p=>p.vcMode===mode)));
  assert.equal(initial.vcMode,"Violet Curl Sea");
  assert.equal(initial.vcAmount,0);
  for(const key of vcControls){
    assert.deepEqual(numericRanges[key],[0,100],key);
    assert.ok(Number.isFinite(initial[key]),key);
    for(const invalid of [-1,101,NaN,Infinity])
      assert.throws(()=>validateRecipe({...earlier,[key]:invalid}),
        new RegExp("Invalid "+key));
  }
  assert.throws(()=>validateRecipe({...earlier,vcMode:"Warped banana"}),/Unknown vcMode/);
});

test("Wave 14: original and imported recipes remain dormant; starter reset is intact",()=>{
  const vintage={...earlier};delete vintage.vcMode;
  for(const key of vcControls)delete vintage[key];
  const restored=validateRecipe(vintage);
  assert.equal(restored.vcAmount,0);
  assert.equal(restored.vcMode,initial.vcMode);
  for(const key of vcControls)assert.equal(restored[key],initial[key],key);
  for(const key of untouched)assert.deepEqual(restored[key],earlier[key],key);
  assert.equal(createNewCanvas().state.vcAmount,0);
});

test("Wave 14: all six presets round-trip with other shader species and animation clocks",()=>{
  const seen=new Set();
  for(const p of vcPresets){
    const active=applyVcPreset(earlier,p.name);
    seen.add(active.vcMode);
    assert.equal(active.vcMode,p.vcMode);
    assert.ok(active.vcAmount>0);
    for(const key of vcControls)assert.equal(active[key],p[key],key);
    for(const key of untouched)assert.deepEqual(active[key],earlier[key],key);
    const clock={time:32.81,colorTime:9.78,textTime:11.2};
    const doc=recipeDocument(active,p.name,clock);
    const back=parseDocument(JSON.parse(JSON.stringify(doc)));
    assert.deepEqual(back.timeline,clock);
    assert.equal(back.state.vcMode,active.vcMode);
    for(const key of vcControls)assert.equal(back.state[key],active[key]);
    assert.equal(hideVc(active).vcAmount,0);
  }
  assert.equal(seen.size,vcModes.length);
  assert.equal(applyVcPreset(earlier,"Imaginary Current"),earlier);
});

test("Wave 14: standalone current shuffle stays bounded and leaves palette/typography/other effects untouched",()=>{
  for(const v of [0,.15,.36,.61,.999999,NaN,Infinity,-Infinity]){
    const next=shuffleVc(earlier,()=>v);
    assert.deepEqual(next,shuffleVc(earlier,()=>v));
    assert.ok(vcModes.includes(next.vcMode));
    assert.ok(next.vcAmount>=35&&next.vcAmount<=100);
    for(const key of vcControls)
      assert.ok(Number.isFinite(next[key])&&next[key]>=0&&next[key]<=100,key);
    for(const key of untouched)assert.deepEqual(next[key],earlier[key],key);
  }
});

test("Wave 14: Mutate respects dormant currents while Surprise Me can awaken them",()=>{
  const unchanged=randomize(earlier,{},true,()=>.77);
  assert.equal(unchanged.vcAmount,0);
  for(const key of vcControls)assert.equal(unchanged[key],earlier[key],key);
  const active=applyVcPreset(earlier,vcPresets[1].name);
  const changed=randomize(active,{},true,()=>.77);
  assert.equal(changed.vcMode,active.vcMode);
  assert.ok(changed.vcAmount>0);
  assert.ok(vcControls.some(key=>changed[key]!==active[key]));
  const source=read("data.js");
  assert.match(source,/if\(key\.startsWith\("vc"\) && state\.vcAmount<=0\)continue/);
  assert.match(source,/s\.vcMode=sample\(vcModes,random\)/);
  assert.match(source,/s\.vcAmount=random\(\)<\.50\?36\+random\(\)\*64:0/);
  assert.match(source,/for\(const key of vcControls\)if\(key!=="vcAmount"\)/);
});

// Numerical cross-check of the exact stream-function equations carried
// into GLSL: the curl (d psi / d y, -d psi / d x) has zero divergence.
const psi=(x,y,t,turb)=>Math.sin(x*1.9+t*.48)*Math.cos(y*2.1-t*.31)
  +.48*Math.sin(x*2.8+y*1.5-t*.73)*turb
  +.29*Math.cos(x*.9-y*3.1+t*.57);
function curl(x,y,t,turb) {
  const e=.042,dx=(psi(x+e,y,t,turb)-psi(x-e,y,t,turb))/(2*e),
    dy=(psi(x,y+e,t,turb)-psi(x,y-e,t,turb))/(2*e);
  return [dy,-dx];
}
test("Wave 14: the source-grounded curl velocity is numerically divergence-free",()=>{
  for(const [x,y,t] of [[.1,.3,0],[-.7,1.1,2.3],[1.8,-.22,7.4],[-2.4,-1.6,13.2]]){
    const h=.004;
    const div=(curl(x+h,y,t,.68)[0]-curl(x-h,y,t,.68)[0])/(2*h)+
      (curl(x,y+h,t,.68)[1]-curl(x,y-h,t,.68)[1])/(2*h);
    assert.ok(Math.abs(div)<.002,"div="+div);
    assert.ok(curl(x,y,t,.68).every(Number.isFinite));
  }
  assert.match(vcGLSL,/return vec2\(dy,-dx\)/);
  assert.match(vcGLSL,/vec2 vcWarpPoint\(vec2 p\)/);
  assert.match(vcGLSL,/float vcHeight\(vec2 z,float t\)/);
  assert.match(vcGLSL,/float lap=\(hxp\+hxm\+hyp\+hym-4\.0\*h\)\/\(e\*e\)/);
  assert.match(vcGLSL,/vec3 thinFilm=palette/);
  assert.match(vcGLSL,/colorTime/);
  for(let i=0;i<5;i++)assert.ok(vcGLSL.includes("vcMode=="+i));
  assert.doesNotMatch(vcGLSL,/sampler2D|framebuffer|readPixels|texture2D|raymarch|fwidth/i);
  assert.equal((vcGLSL.match(/for\(/g)||[]).length,0);
});

test("Wave 14: real shared renderer injects warp before field and colors after prior materials",()=>{
  const r=read("renderer.js");
  assert.match(r,/withVc = s\.vcAmount>0/);
  assert.match(r,/withVc\?"curlwave-"\+vcModes\.indexOf\(s\.vcMode\):"no-curlwave"/);
  assert.match(r,/withVc \? vcGLSL : ""/);
  assert.match(r,/p\+=vcWarpPoint\(p\);/);
  assert.match(r,/col=vcDress\(col,uv,p,v\);/);
  assert.match(r,/vcUnavailable \? \{vcAmount:0\}/);
  assert.match(r,/if\(candidate\.vcAmount>0 && !vcUnavailable\)/);
  assert.match(r,/missing\.push\("Curlwave Witchcraft"\)/);
  assert.match(r,/gl\.uniform1i\(loc\("vcMode"\),vcModes\.indexOf\(s\.vcMode\)\)/);
  assert.match(r,/if\(exactEffects\)throw artworkParityError\("Full-effect shader failed to compile",e\)/);
  for(const key of vcControls)assert.ok(r.includes('"'+key+'"'),key);
  const before=r.indexOf("/* VC_PRE */"),field=r.indexOf("float v=composed(p);"),
    after=r.indexOf("/* VC_POST */"),light=r.indexOf("col=animateLight(col,uv,v);");
  assert.ok(before>0&&before<field&&field<after&&after<light);
  assert.match(read("export.js"),/renderer = createRenderer\(canvas,\{exactEffects:true\}\)/);
});

test("Wave 14: Codex Materials Control Room supports search, favorite, active and reset",()=>{
  const meta=sectionMeta("curlwave-witchcraft");
  assert.ok(meta);
  assert.equal(meta.tab,"Effects");
  assert.equal(meta.group,"Materials");
  assert.deepEqual(meta.on,["vcAmount"]);
  assert.deepEqual(meta.reset.slice(1),vcControls);
  assert.ok(effectEntries.some(x=>x.id==="curlwave-witchcraft"));
  assert.ok(findControls("violet curl waves",30).some(x=>x.id==="curlwave-witchcraft"));
  assert.ok(findControls("fluid advection",30).some(x=>x.id==="curlwave-witchcraft"));
  const inspector=read("components/Inspectors.jsx");
  assert.match(inspector,/"curlwave-witchcraft": <>/);
  assert.match(inspector,/applyVcPreset\(x,vcPreset\)/);
  assert.match(inspector,/shuffleVc\(x\)/);
  assert.match(inspector,/history\.change\(hideVc\)/);
  for(const key of vcControls)assert.ok(inspector.includes('name="'+key+'"'),key);
  const favorites=directoryEntries({view:"favorites",category:"Materials",
    query:"",favorites:["curlwave-witchcraft"],state:initial});
  assert.ok(favorites.some(x=>x.id==="curlwave-witchcraft"));
  const active=directoryEntries({view:"active",category:"Materials",
    query:"",favorites:[],state:applyVcPreset(initial,vcPresets[0].name)});
  assert.ok(active.some(x=>x.id==="curlwave-witchcraft"));
  const inactive=directoryEntries({view:"active",category:"Materials",
    query:"",favorites:[],state:initial});
  assert.ok(!inactive.some(x=>x.id==="curlwave-witchcraft"));
});
