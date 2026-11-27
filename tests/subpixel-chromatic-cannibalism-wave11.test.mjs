import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,numericRanges,validateRecipe,recipeDocument,parseDocument,randomize}
  from "../src/data.js";
import {sectionMeta,findControls} from "../src/ui-index.js";
import {effectEntries,directoryEntries} from "../src/effects-navigation.js";
import {spxModes,spxControls,spxPresets,spxGLSL,
  applySpxPreset,shuffleSpx,hideSpx} from "../src/subpixel-moire-wave11.js";

const read=path=>readFileSync(new URL("../src/"+path,import.meta.url),"utf8");
const prior={...initial,seed:518282,engine:14,ratio:"9:16",
  colors:["#fc18bb","#05c7fd","#ffff22"],lettering:"DON'T EAT MY TYPOGRAPHY",
  filamentAmount:81,filamentSpecies:"Quasicrystal Brocade",
  g2Amount:72,breedAmount:68,schlierenAmount:64,
  hexagramAmount:81,polesAmount:71,qdAmount:68,
  hcrAmount:53,vldAmount:73,afterimage:19};

test("Wave 11: five species, six presets and twelve independent, bounded controls",()=>{
  assert.equal(spxModes.length,5);
  assert.equal(new Set(spxModes).size,5);
  assert.equal(spxPresets.length,6);
  assert.equal(spxControls.length,12);
  assert.equal(new Set(spxControls).size,12);
  assert.equal(initial.spxAmount,0);
  assert.equal(initial.spxMode,"Shadowmask Silk");
  for(const key of spxControls){
    assert.deepEqual(numericRanges[key],[0,100],key);
    assert.ok(Number.isFinite(initial[key]),key);
    for(const invalid of [-1,101,NaN,Infinity])
      assert.throws(()=>validateRecipe({...prior,[key]:invalid}),
        new RegExp("Invalid "+key));
  }
  assert.throws(()=>validateRecipe({...prior,spxMode:"Nonsense"}),/Unknown spxMode/);
});

test("Wave 11: old artwork is genuinely inactive and gains valid neutral defaults",()=>{
  const vintage={...prior};delete vintage.spxMode;
  for(const key of spxControls)delete vintage[key];
  const restored=validateRecipe(vintage);
  assert.equal(restored.spxAmount,0);
  assert.equal(restored.spxMode,"Shadowmask Silk");
  assert.deepEqual(restored.colors,prior.colors);
  assert.equal(restored.lettering,prior.lettering);
  for(const key of spxControls)assert.equal(restored[key],initial[key]);
  assert.equal(hideSpx(prior).spxAmount,0);
});

test("Wave 11: every recipe preserves words, all parent shaders and animation clocks",()=>{
  const seen=new Set();
  for(const preset of spxPresets){
    const active=applySpxPreset(prior,preset.name);
    seen.add(active.spxMode);
    assert.equal(active.spxMode,preset.spxMode);
    assert.ok(active.spxAmount>0);
    for(const key of spxControls){
      assert.equal(active[key],preset[key],preset.name+" "+key);
      assert.ok(Number.isFinite(active[key])&&active[key]>=0&&active[key]<=100);
    }
    for(const key of ["engine","ratio","seed","colors","lettering",
      "filamentAmount","filamentSpecies","g2Amount","breedAmount",
      "schlierenAmount","hexagramAmount","polesAmount","qdAmount",
      "hcrAmount","vldAmount","afterimage"])
      assert.deepEqual(active[key],prior[key],key);
    const times={time:6.25,colorTime:3.75,textTime:1.85};
    const json=recipeDocument(active,preset.name,times);
    const back=parseDocument(JSON.parse(JSON.stringify(json)));
    assert.deepEqual(back.timeline,times);
    assert.equal(back.state.spxMode,active.spxMode);
    for(const key of spxControls)assert.equal(back.state[key],active[key]);
  }
  assert.equal(seen.size,5);
  assert.equal(applySpxPreset(prior,"Imaginary preset"),prior);
});

test("Wave 11: seeded shuffle never changes palette, text, math or other shaders",()=>{
  for(const value of [0,.18,.38,.72,.999999,NaN,Infinity,-Infinity]){
    const rand=()=>value;
    const next=shuffleSpx(prior,rand);
    assert.deepEqual(next,shuffleSpx(prior,rand));
    assert.ok(spxModes.includes(next.spxMode));
    for(const key of spxControls)
      assert.ok(Number.isFinite(next[key])&&next[key]>=0&&next[key]<=100,key);
    for(const key of ["seed","engine","colors","lettering",
      "filamentAmount","hcrAmount","g2Amount","breedAmount","ratio"])
      assert.deepEqual(next[key],prior[key],key);
    assert.ok(next.spxAmount>=38);
  }
});

test("Wave 11: Mutate does not awaken dormant moire, but can nudge active moire",()=>{
  const dormant=randomize(prior,{},true,()=>.77);
  assert.equal(dormant.spxAmount,0);
  for(const key of spxControls)assert.equal(dormant[key],prior[key],key);
  const live=applySpxPreset(prior,"Cross-Channel Carnivore");
  const changed=randomize(live,{},true,()=>.77);
  assert.equal(changed.spxMode,live.spxMode);
  assert.ok(changed.spxAmount>0);
  assert.ok(spxControls.some(key=>changed[key]!==live[key]));
  const data=read("data.js");
  assert.match(data,/if\(key\.startsWith\("spx"\) && state\.spxAmount<=0\)continue/);
  assert.match(data,/s\.spxMode=sample\(spxModes,random\)/);
  assert.match(data,/s\.spxAmount=random\(\)<\.43\?35\+random\(\)\*65:0/);
  assert.match(data,/for\(const key of spxControls\)if\(key!=="spxAmount"\)/);
});

test("Wave 11: shader really samples two differently rotated RGB triad masks and their cross-products",()=>{
  assert.match(spxGLSL,/vec3 spxTriad\(vec2 q\)/);
  assert.match(spxGLSL,/vec3 a=spxTriad\(rotate\(t\*\.018\)\*q\*cells\+shiftA\)/);
  assert.match(spxGLSL,/vec3 b=spxTriad\(rotate\(tilt\+t\*\.014\)\*q\*cells\*unequal\+shiftB\)/);
  assert.match(spxGLSL,/float rg=a\.r\*b\.g\+a\.g\*b\.r/);
  assert.match(spxGLSL,/float rb=a\.r\*b\.b\+a\.b\*b\.r/);
  assert.match(spxGLSL,/float gb=a\.g\*b\.b\+a\.b\*b\.g/);
  assert.match(spxGLSL,/vec3 chroma=\(inkA\*rg\+inkB\*rb\+inkC\*gb\)/);
  assert.match(spxGLSL,/vec3 inkA=palette/);
  assert.match(spxGLSL,/colorTime/);
  assert.match(spxGLSL,/float cells=min\(/);
  for(let mode=0;mode<4;mode++)assert.ok(spxGLSL.includes("spxMode=="+mode));
  assert.doesNotMatch(spxGLSL,/sampler2D|framebuffer|readPixels|raymarch/i);
  assert.ok(spxGLSL.length<12000);
});

test("Wave 11: main exact renderer inserts optional moire after color grade and validates every uniform",()=>{
  const renderer=read("renderer.js");
  assert.match(renderer,/withSpx = s\.spxAmount>0/);
  assert.match(renderer,/withSpx\?"subpixel-"\+spxModes\.indexOf\(s\.spxMode\):"no-subpixel"/);
  assert.match(renderer,/withSpx \? spxGLSL : ""/);
  assert.match(renderer,/col=spxInterference\(uv,p,v,col\);/);
  assert.match(renderer,/spxUnavailable \? \{spxAmount:0\}/);
  assert.match(renderer,/if\(candidate\.spxAmount>0 && !spxUnavailable\)/);
  assert.match(renderer,/if\(exactEffects\)throw artworkParityError\("Full-effect shader failed to compile",e\)/);
  assert.match(renderer,/spxModes\.indexOf\(s\.spxMode\)/);
  assert.match(renderer,/missing\.push\("Subpixel Moiré"\)/);
  for(const key of spxControls)assert.ok(renderer.includes('"'+key+'"'),key);
  const module=renderer.indexOf("/* SPX_MODULE */");
  const post=renderer.indexOf("/* SPX_POST */");
  const appearance=renderer.indexOf("col=applyAppearance(col,uv);");
  assert.ok(module>0 && module<post && post<appearance);
  const exporter=read("export.js");
  assert.match(exporter,/renderer = createRenderer\(canvas,\{exactEffects:true\}\)/);
  assert.match(exporter,/await waitForGraphics\(renderer,signal\)/);
});

test("Wave 11: searchable Controls Room has full sliders, Active, Favorites and Signal grouping",()=>{
  const ui=read("components/ColorLab.jsx");
  const meta=sectionMeta("subpixel-moire");
  assert.ok(meta);
  assert.equal(meta.tab,"Color");
  assert.equal(meta.group,"Signal");
  assert.deepEqual(meta.on,["spxAmount"]);
  assert.deepEqual(meta.reset.slice(1),spxControls);
  assert.ok(effectEntries.some(x=>x.id==="subpixel-moire"));
  assert.ok(findControls("chromatic cannibalism",30).some(x=>x.id==="subpixel-moire"));
  assert.ok(findControls("shadow mask",30).some(x=>x.id==="subpixel-moire"));
  assert.match(ui,/"subpixel-moire": <>/);
  assert.match(ui,/applySpxPreset\(x,spxPreset\)/);
  assert.match(ui,/shuffleSpx\(x\)/);
  assert.match(ui,/history\.change\(hideSpx\)/);
  for(const key of spxControls)assert.ok(ui.includes('name="'+key+'"'),key);
  const favorites=directoryEntries({view:"favorites",category:"Signal",
    query:"",favorites:["subpixel-moire"],state:initial});
  assert.ok(favorites.some(x=>x.id==="subpixel-moire"));
  const active=directoryEntries({view:"active",category:"Signal",
    query:"",favorites:[],state:applySpxPreset(initial,spxPresets[0].name)});
  assert.ok(active.some(x=>x.id==="subpixel-moire"));
  const inactive=directoryEntries({view:"active",category:"Signal",
    query:"",favorites:[],state:initial});
  assert.ok(!inactive.some(x=>x.id==="subpixel-moire"));
});
