import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,numericRanges,validateRecipe,recipeDocument,parseDocument,randomize} from "../src/data.js";
import {sectionMeta,findControls} from "../src/ui-index.js";
import {hexagramControls,hexagramPresets,hexagramGLSL,
  applyHexagramPreset,remixHexagram,disableHexagram} from "../src/hexagram-terraces.js";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const controls=new Set(hexagramControls);
const original={...initial,seed:947421,ratio:"9:16",engine:14,
  filamentAmount:85,filamentSpecies:"Quasicrystal Brocade",
  filamentMaterial:"Velvet flock",colors:["#fa19ac","#080811","#03e7ef"],
  lettering:"GHOST TERRACES"};

test("Wave 1 is opt-in: old scenes are unchanged and all ten bounded controls deserialize",()=>{
  assert.equal(hexagramControls.length,10);
  assert.equal(controls.size,10);
  assert.equal(initial.hexagramAmount,0);
  const legacy={...original};
  for(const key of hexagramControls)delete legacy[key];
  const restored=validateRecipe(legacy);
  assert.equal(restored.hexagramAmount,0);
  for(const key of hexagramControls){
    assert.deepEqual(numericRanges[key],[0,100],key);
    assert.equal(restored[key],initial[key],key);
    assert.throws(()=>validateRecipe({...original,[key]:101}),new RegExp("Invalid "+key));
    assert.throws(()=>validateRecipe({...original,[key]:-1}),new RegExp("Invalid "+key));
  }
  assert.equal(sectionMeta("hexagram").tab,"Math");
  assert.equal(sectionMeta("hexagram").on[0],"hexagramAmount");
  assert.ok(findControls("hexagram").some(x=>x.id==="hexagram"));
  assert.ok(findControls("terrace").some(x=>x.id==="hexagram"));
});

test("five isolated presets preserve palettes, lettering, engines, textiles and recipe/export clocks",()=>{
  assert.equal(hexagramPresets.length,5);
  for(const preset of hexagramPresets){
    const changed=applyHexagramPreset(original,preset.name);
    for(const key of ["seed","colors","lettering","filamentSpecies",
      "filamentMaterial","filamentAmount","engine","ratio"])
      assert.deepEqual(changed[key],original[key],preset.name+": "+key);
    assert.ok(changed.hexagramAmount>0);
    for(const key of hexagramControls)
      assert.equal(changed[key],preset[key],preset.name+": "+key);
    const doc=recipeDocument(changed,"Bit terrain",
      {time:3.5,colorTime:4.75,textTime:1.5});
    const parsed=parseDocument(JSON.parse(JSON.stringify(doc)));
    assert.deepEqual(parsed.timeline,doc.timeline);
    for(const key of hexagramControls)assert.equal(parsed.state[key],changed[key]);
  }
  assert.equal(applyHexagramPreset(original,"missing"),original);
});

test("one-click shuffle and hide do not mutate other art; mutate does not awaken dormant terraces",()=>{
  for(const n of [0,.15,.57,.99999,NaN]){
    const random=()=>n;
    const shuffled=remixHexagram(original,random);
    assert.deepEqual(shuffled,remixHexagram(original,random));
    for(const key of hexagramControls){
      assert.ok(Number.isFinite(shuffled[key]),key);
      assert.ok(shuffled[key]>=0&&shuffled[key]<=100,key);
    }
    for(const key of ["seed","engine","colors","lettering","ratio",
      "filamentSpecies","filamentMaterial","filamentAmount"])
      assert.deepEqual(shuffled[key],original[key],key);
    assert.equal(disableHexagram(shuffled).hexagramAmount,0);
  }
  const muted=randomize(original,{},true,()=>.69);
  for(const key of hexagramControls)assert.equal(muted[key],original[key],key);
  const live=applyHexagramPreset(original,hexagramPresets[0].name);
  const mutated=randomize(live,{},true,()=>.69);
  assert.ok(hexagramControls.some(key=>mutated[key]!==live[key]));
  assert.equal(mutated.hexagramAmount>0,true);
});

test("real six-bit coupled geometry lives in an optional shader path",()=>{
  assert.match(hexagramGLSL,/for\(int i=0;i<6;i\+\+\)/);
  assert.match(hexagramGLSL,/hexId\+=bit\*exp2\(fi\)/);
  assert.match(hexagramGLSL,/q\+=hexagramCoupling/);
  assert.match(hexagramGLSL,/hexagramTerraceWarp/);
  assert.match(hexagramGLSL,/hexagramTerraceColor/);
  assert.match(hexagramGLSL,/palette\(/);
  assert.match(hexagramGLSL,/colorTime/);
  const renderer=read("src/renderer.js");
  for(const marker of ["HEXAGRAM_MODULE","HEXAGRAM_PRE","HEXAGRAM_VALUE","HEXAGRAM_POST"])
    assert.ok(renderer.includes("/* "+marker+" */"),marker);
  assert.match(renderer,/withHexagram = s\.hexagramAmount>0/);
  assert.match(renderer,/withHexagram\?"hexagram":"no-hexagram"/);
  assert.match(renderer,/if\(candidate\.hexagramAmount>0 && !hexagramUnavailable\)/);
  assert.match(renderer,/if\(exactEffects\)throw artworkParityError\("Full-effect shader failed to compile",e\)/);
  for(const key of hexagramControls)assert.ok(renderer.includes('"'+key+'"'),key);
  const ui=read("src/components/Inspectors.jsx");
  assert.match(ui,/id="hexagram"/);
  assert.match(ui,/applyHexagramPreset\(s,v\)/);
  assert.match(ui,/remixHexagram\(s,Math\.random\)/);
});
