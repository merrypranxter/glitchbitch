import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,numericRanges,validateRecipe,recipeDocument,parseDocument,randomize}
  from "../src/data.js";
import {psModes,psControls,psPresets,psGLSL,applyPsPreset,shufflePs,hidePs}
  from "../src/prismatic-scale-matrix-wave12.js";
import {sectionMeta,findControls} from "../src/ui-index.js";
import {directoryEntries,effectEntries} from "../src/effects-navigation.js";
import {createNewCanvas} from "../src/new-canvas.js";
const read=path=>readFileSync(new URL("../src/"+path,import.meta.url),"utf8");
const prior={...initial,seed:49103,engine:12,ratio:"9:16",
  colors:["#ff10ab","#26fcce","#fff122"],lettering:"SAVE MY FUCKING TEXT",
  filamentAmount:65,filamentSpecies:"Quasicrystal Brocade",
  spxAmount:62,g2Amount:84,breedAmount:61,qdAmount:41,sculpture:39,
  hexagramAmount:88,afterimage:24};

test("Wave 12: five geometric scale anatomies, 13 bounded knobs, six ready-to-use recipes",()=>{
  assert.equal(psModes.length,5);
  assert.equal(new Set(psModes).size,5);
  assert.equal(psControls.length,13);
  assert.equal(new Set(psControls).size,13);
  assert.equal(psPresets.length,6);
  assert.ok(psModes.every(mode=>psPresets.some(p=>p.psMode===mode)));
  assert.equal(initial.psMode,"Diamondback Prisms");
  assert.equal(initial.psAmount,0);
  for(const key of psControls){
    assert.deepEqual(numericRanges[key],[0,100],key);
    assert.ok(Number.isFinite(initial[key]));
    for(const v of [-1,101,NaN,Infinity])
      assert.throws(()=>validateRecipe({...prior,[key]:v}),
        new RegExp("Invalid "+key));
  }
  assert.throws(()=>validateRecipe({...prior,psMode:"Imaginary plate"}),/Unknown psMode/);
});

test("Wave 12: old artwork has dormant scale skin and inherits clean defaults",()=>{
  const old={...prior};delete old.psMode;
  for(const key of psControls)delete old[key];
  const migrated=validateRecipe(old);
  assert.equal(migrated.psAmount,0);
  assert.equal(migrated.psMode,initial.psMode);
  for(const key of psControls)assert.equal(migrated[key],initial[key]);
  assert.deepEqual(migrated.colors,prior.colors);
  assert.equal(migrated.lettering,prior.lettering);
  assert.equal(createNewCanvas().state.psAmount,0);
});

test("Wave 12: all six presets preserve every unrelated effect and round-trip timeline",()=>{
  for(const preset of psPresets){
    const activated=applyPsPreset(prior,preset.name);
    assert.equal(activated.psMode,preset.psMode);
    assert.ok(activated.psAmount>0);
    for(const key of psControls) {
      assert.equal(activated[key],preset[key],key);
      assert.ok(Number.isFinite(activated[key])&&activated[key]>=0&&activated[key]<=100);
    }
    for(const key of ["seed","engine","ratio","colors","lettering",
      "filamentAmount","filamentSpecies","spxAmount","g2Amount",
      "breedAmount","qdAmount","afterimage","hexagramAmount"])
      assert.deepEqual(activated[key],prior[key]);
    const clocks={time:32.4,colorTime:4.2,textTime:18.8};
    const doc=recipeDocument(activated,preset.name,clocks);
    const restored=parseDocument(JSON.parse(JSON.stringify(doc)));
    assert.deepEqual(restored.timeline,clocks);
    assert.equal(restored.state.psMode,activated.psMode);
    for(const key of psControls)assert.equal(restored.state[key],activated[key]);
    assert.equal(hidePs(activated).psAmount,0);
  }
  assert.equal(applyPsPreset(prior,"nonexistent"),prior);
});

test("Wave 12: targeted shuffle is finite and preserves seed, typography, gallery state and parent shaders",()=>{
  for(const v of [0,.25,.55,.75,.999999,NaN,Infinity,-Infinity]){
    const rand=()=>v,shuffled=shufflePs(prior,rand);
    assert.deepEqual(shuffled,shufflePs(prior,rand));
    assert.ok(psModes.includes(shuffled.psMode));
    assert.ok(shuffled.psAmount>=40);
    for(const key of psControls)
      assert.ok(Number.isFinite(shuffled[key])&&shuffled[key]>=0&&shuffled[key]<=100,key);
    for(const key of ["seed","colors","lettering","ratio",
      "filamentAmount","spxAmount","g2Amount","breedAmount","afterimage"])
      assert.deepEqual(shuffled[key],prior[key],key);
  }
});

test("Wave 12: Mutate never awakens an off-scale organism; Surprise Me may spawn it",()=>{
  const dormant=randomize(prior,{},true,()=>.77);
  assert.equal(dormant.psAmount,0);
  for(const key of psControls)assert.equal(dormant[key],prior[key]);
  const active=applyPsPreset(prior,psPresets[0].name);
  const changed=randomize(active,{},true,()=>.77);
  assert.equal(changed.psMode,active.psMode);
  assert.ok(changed.psAmount>0);
  assert.ok(psControls.some(key=>changed[key]!==active[key]));
  const data=read("data.js");
  assert.match(data,/if\(key\.startsWith\("ps"\) && state\.psAmount<=0\)continue/);
  assert.match(data,/s\.psMode=sample\(psModes,random\)/);
  assert.match(data,/s\.psAmount=random\(\)<\.41\?38\+random\(\)\*62:0/);
  assert.match(data,/for\(const key of psControls\)if\(key!=="psAmount"\)/);
});

test("Wave 12: real 3x3 shingle priority, 5 packing laws, film and relief lighting",()=>{
  assert.match(psGLSL,/struct PsTile \{/);
  assert.match(psGLSL,/float psDistance\(vec2 local\)/);
  assert.match(psGLSL,/for\(int j=-1;j<=1;j\+\+\)/);
  assert.match(psGLSL,/for\(int i=-1;i<=1;i\+\+\)/);
  assert.match(psGLSL,/float z=h-local\.y\*/);
  assert.match(psGLSL,/if\(h>-.13 && z>best\.depth\)/);
  assert.match(psGLSL,/vec3 N=normalize/);
  assert.match(psGLSL,/float specular=pow/);
  assert.match(psGLSL,/vec3 interference=\.5\+\.5\*cos/);
  assert.match(psGLSL,/float grating=pow/);
  assert.match(psGLSL,/palette\(phase\)/);
  assert.match(psGLSL,/float domainPhase=atan/);
  assert.match(psGLSL,/res\.y/);
  for(let m=0;m<4;m++)assert.ok(psGLSL.includes("psMode=="+m));
  assert.doesNotMatch(psGLSL,/sampler2D|readPixels|framebuffer|raymarch|texture2D/i);
  assert.ok(psGLSL.length<12000);
});

test("Wave 12: exact-effects preview/MP4/GIF engine uses same opt-in coating",()=>{
  const renderer=read("renderer.js");
  assert.match(renderer,/withPs = s\.psAmount>0/);
  assert.match(renderer,/withPs\?"prism-scales-"\+psModes\.indexOf\(s\.psMode\):"no-prism-scales"/);
  assert.match(renderer,/withPs \? psGLSL : ""/);
  assert.match(renderer,/col=psDress\(col,uv,p,v\);/);
  assert.match(renderer,/psUnavailable \? \{psAmount:0\}/);
  assert.match(renderer,/if\(candidate\.psAmount>0 && !psUnavailable\)/);
  assert.match(renderer,/missing\.push\("Prismatic Scale Matrix"\)/);
  assert.match(renderer,/psModes\.indexOf\(s\.psMode\)/);
  assert.match(renderer,/if\(exactEffects\)throw artworkParityError\("Full-effect shader failed to compile",e\)/);
  const coat=renderer.indexOf("/* PS_POST */"),light=renderer.indexOf("col=animateLight(col,uv,v);"),
    label=renderer.indexOf("/* LETTERING_POST */");
  assert.ok(coat>0&&coat<light&&light<label,"Shader skin before final lettering");
  for(const key of psControls)assert.ok(renderer.includes('"'+key+'"'),key);
  const exporter=read("export.js");
  assert.match(exporter,/renderer = createRenderer\(canvas,\{exactEffects:true\}\)/);
  assert.match(exporter,/await waitForGraphics\(renderer,signal\)/);
});

test("Wave 12: new control-room Materials lab includes active, favorites, Find, Reset and advanced groups",()=>{
  const meta=sectionMeta("prismatic-scales");
  assert.equal(meta.tab,"Effects");
  assert.equal(meta.group,"Materials");
  assert.deepEqual(meta.on,["psAmount"]);
  assert.deepEqual(meta.reset.slice(1),psControls);
  assert.ok(effectEntries.some(e=>e.id==="prismatic-scales"));
  assert.ok(findControls("koi armor",30).some(e=>e.id==="prismatic-scales"));
  assert.ok(findControls("dragon scales",30).some(e=>e.id==="prismatic-scales"));
  const ui=read("components/Inspectors.jsx");
  assert.match(ui,/"prismatic-scales": <>/);
  assert.match(ui,/applyPsPreset\(x,psPreset\)/);
  assert.match(ui,/shufflePs\(x\)/);
  assert.match(ui,/history\.change\(hidePs\)/);
  assert.match(ui,/Optical alchemy · advanced/);
  assert.match(ui,/Living surface · advanced/);
  for(const key of psControls)assert.ok(ui.includes('name="'+key+'"'),key);
  const favorites=directoryEntries({view:"favorites",category:"Materials",
    query:"",favorites:["prismatic-scales"],state:initial});
  assert.ok(favorites.some(e=>e.id==="prismatic-scales"));
  const active=directoryEntries({view:"active",category:"Materials",
    query:"",favorites:[],state:applyPsPreset(initial,psPresets[0].name)});
  assert.ok(active.some(e=>e.id==="prismatic-scales"));
  const inactive=directoryEntries({view:"active",category:"Materials",
    query:"",favorites:[],state:initial});
  assert.ok(!inactive.some(e=>e.id==="prismatic-scales"));
});
