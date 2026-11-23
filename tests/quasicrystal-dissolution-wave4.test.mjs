import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,numericRanges,validateRecipe,recipeDocument,parseDocument,randomize} from "../src/data.js";
import {sectionMeta,findControls} from "../src/ui-index.js";
import {qdModes,qdOrders,qdControls,qdPresets,qdGLSL,
  applyQdPreset,shuffleQd,hideQd} from "../src/quasicrystal-dissolution.js";

const read=path=>readFileSync(new URL("../src/"+path,import.meta.url),"utf8");
const old={...initial,seed:1439801,engine:14,ratio:"9:16",
  colors:["#fa19ac","#03e7ef","#ffdd44"],lettering:"ORDER IS BORING",
  filamentAmount:88,filamentSpecies:"Quasicrystal Brocade",
  hexagramAmount:72,polesAmount:81,schlierenAmount:69,
  afterimage:42,datamosh:27};

test("Wave 4: five modes, 5/7/9-fold wave orders, twelve numeric controls and opt-in state",()=>{
  assert.equal(qdModes.length,5);
  assert.equal(new Set(qdModes).size,5);
  assert.deepEqual(qdOrders,["Fivefold","Sevenfold","Ninefold"]);
  assert.equal(qdControls.length,12);
  assert.equal(new Set(qdControls).size,12);
  assert.equal(qdPresets.length,6);
  assert.equal(initial.qdAmount,0);
  assert.equal(initial.qdOrder,"Sevenfold");
  const vintage={...old};delete vintage.qdMode;delete vintage.qdOrder;
  for(const key of qdControls)delete vintage[key];
  const parsed=validateRecipe(vintage);
  assert.equal(parsed.qdAmount,0);
  assert.equal(parsed.qdMode,initial.qdMode);
  assert.equal(parsed.qdOrder,initial.qdOrder);
  for(const key of qdControls){
    assert.deepEqual(numericRanges[key],[0,100],key);
    assert.equal(parsed[key],initial[key]);
    for(const value of [-1,101,Infinity,NaN])
      assert.throws(()=>validateRecipe({...old,[key]:value}),new RegExp("Invalid "+key));
  }
  assert.throws(()=>validateRecipe({...old,qdMode:"Fake Blur"}),/Unknown qdMode/);
  assert.throws(()=>validateRecipe({...old,qdOrder:"Twelvefold"}),/Unknown qdOrder/);
  assert.equal(sectionMeta("quasi-dissolution").tab,"Math");
  assert.deepEqual(sectionMeta("quasi-dissolution").on,["qdAmount"]);
  assert.ok(findControls("quasicrystal").some(s=>s.id==="quasi-dissolution"));
});

test("presets and dedicated shuffles preserve original art, frames, palette and other waves",()=>{
  for(const preset of qdPresets){
    const updated=applyQdPreset(old,preset.name);
    assert.equal(updated.qdMode,preset.qdMode);
    assert.equal(updated.qdOrder,preset.qdOrder);
    for(const key of qdControls)assert.equal(updated[key],preset[key]);
    for(const key of ["engine","seed","ratio","colors","lettering","filamentAmount",
      "filamentSpecies","hexagramAmount","polesAmount","schlierenAmount",
      "afterimage","datamosh"])
      assert.deepEqual(updated[key],old[key],key);
    const frame={time:4.5,colorTime:5.25,textTime:3.75};
    const doc=recipeDocument(updated,"Quasicrystal",frame);
    const restored=parseDocument(JSON.parse(JSON.stringify(doc)));
    assert.deepEqual(restored.timeline,frame);
    assert.equal(restored.state.qdMode,updated.qdMode);
    assert.equal(restored.state.qdOrder,updated.qdOrder);
    for(const key of qdControls)assert.equal(restored.state[key],updated[key]);
    assert.equal(hideQd(updated).qdAmount,0);
  }
  assert.equal(applyQdPreset(old,"No such pattern"),old);
  for(const n of [0,.19,.54,.999999,NaN]){
    const random=()=>n,out=shuffleQd(old,random);
    assert.deepEqual(out,shuffleQd(old,random));
    assert.ok(qdModes.includes(out.qdMode));
    assert.ok(qdOrders.includes(out.qdOrder));
    for(const key of qdControls)assert.ok(
      Number.isFinite(out[key])&&out[key]>=0&&out[key]<=100,key);
    assert.ok(out.qdAmount>=35);
    for(const key of ["engine","colors","lettering","ratio","hexagramAmount",
      "polesAmount","schlierenAmount","filamentSpecies","afterimage"])
      assert.deepEqual(out[key],old[key],key);
  }
});

test("Mutate never wakes hidden crystal decay; full Surprise registers it",()=>{
  const dormant=randomize(old,{},true,()=>.77);
  for(const key of qdControls)assert.equal(dormant[key],old[key],key);
  assert.equal(dormant.qdAmount,0);
  const active=applyQdPreset(old,qdPresets[1].name);
  const changed=randomize(active,{},true,()=>.77);
  assert.ok(qdControls.some(k=>changed[k]!==active[k]));
  assert.equal(changed.qdMode,active.qdMode);
  assert.ok(changed.qdAmount>0);
  const data=read("data.js");
  assert.match(data,/s\.qdMode=sample\(qdModes,random\)/);
  assert.match(data,/s\.qdOrder=sample\(qdOrders,random\)/);
  assert.match(data,/if\(key\.startsWith\("qd"\) && state\.qdAmount<=0\)continue/);
});

test("the oscillator really fractures a five/seven/nine-wave interference lattice",()=>{
  assert.match(qdGLSL,/for\(int i=0;i<9;i\+\+\)/);
  assert.match(qdGLSL,/if\(i<qdOrder\)/);
  assert.match(qdGLSL,/TAU\*float\(i\)\/arms/);
  assert.match(qdGLSL,/q\+=cos\(bands\)/);
  assert.match(qdGLSL,/q\/=arms/);
  assert.match(qdGLSL,/float entropy=qdPhase\(\)/);
  assert.match(qdGLSL,/float tear=step/);
  assert.match(qdGLSL,/float mosaics=step/);
  assert.match(qdGLSL,/x\.x\+=tearOffset\*entropy/);
  assert.match(qdGLSL,/p\+=qdAmount\*qdWarp/);
  assert.match(qdGLSL,/col=mix\(col/);
  assert.match(qdGLSL,/palette\(fract/);
  assert.doesNotMatch(qdGLSL,/sampler2D|framebuffer|readPixels|texture2D/);
  for(const mode of [1,2,3,4])assert.ok(qdGLSL.includes("qdMode=="+mode));
});

test("shader injection is truly opt-in, shares preview/exports and has GPU failure fallback",()=>{
  const renderer=read("renderer.js");
  assert.match(renderer,/withQd = s\.qdAmount>0/);
  assert.match(renderer,/withQd\?"quasi-dissolve":"no-quasi-dissolve"/);
  assert.match(renderer,/source=source\.replace\("\/\* QUASI_DECAY_MODULE \*\/",withQd \? qdGLSL : ""\)/);
  assert.match(renderer,/vec4 qdData=qdInterfere\(p\)/);
  assert.match(renderer,/col=qdDress\(col,qdData\)/);
  assert.match(renderer,/qdUnavailable \? \{qdAmount:0\}/);
  assert.match(renderer,/if\(candidate\.qdAmount>0 && !qdUnavailable\)/);
  assert.match(renderer,/if\(exactEffects\)throw artworkParityError\("Full-effect shader failed to compile",e\)/);
  assert.match(renderer,/qdModes\.indexOf\(compiledState\.qdMode\)/);
  assert.match(renderer,/5\+2\*Math\.max\(0,qdOrders\.indexOf\(compiledState\.qdOrder\)\)/);
  for(const key of qdControls)assert.ok(renderer.includes('"'+key+'"'),key);
  const main=renderer.indexOf("float v=composed(p);");
  assert.ok(renderer.indexOf("/* QUASI_DECAY_PRE */")<main);
  assert.ok(renderer.indexOf("/* QUASI_DECAY_POST */")>main);
  const ui=read("components/Inspectors.jsx");
  assert.match(ui,/id="quasi-dissolution"/);
  assert.match(ui,/applyQdPreset\(s,qdPreset\)/);
  assert.match(ui,/shuffleQd\(s\)/);
  assert.match(ui,/history\.change\(hideQd\)/);
});
