import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,numericRanges,validateRecipe,recipeDocument,parseDocument,randomize}
  from "../src/data.js";
import {sectionMeta,findControls} from "../src/ui-index.js";
import {breedModes,breedParents,breedRequiredParents,breedControls,
  breedPresets,breedGLSL,breedActive,activateBreed,applyBreedPreset,
  shuffleBreed,hideBreed} from "../src/crossbreed-lab.js";

const read=path=>readFileSync(new URL("../src/"+path,import.meta.url),"utf8");
const knownParents=["hexagramAmount","polesAmount","qdAmount","vldAmount","hcrAmount"];
const original={...initial,seed:932130,engine:14,ratio:"9:16",
  colors:["#ff00cc","#00ddff","#f9d400"],
  lettering:"MATHEMATICS WANTS GRANDCHILDREN",
  filamentAmount:86,filamentSpecies:"Quasicrystal Brocade",
  schlierenAmount:64,afterimage:24,datamosh:0};
const pristine={...original,
  hexagramAmount:0,polesAmount:0,qdAmount:0,vldAmount:0,hcrAmount:0,
  breedAmount:0};

test("Wave 6: five real compatible parents, five offspring, 10 safe controls, off by default",()=>{
  assert.equal(breedModes.length,5);
  assert.equal(new Set(breedModes).size,5);
  assert.equal(breedControls.length,10);
  assert.equal(new Set(breedControls).size,10);
  assert.equal(breedPresets.length,7);
  assert.equal(initial.breedAmount,0);
  for(const mode of breedModes){
    const parents=breedRequiredParents(mode);
    assert.ok(parents.length>=2 && parents.length<=5);
    assert.equal(new Set(parents).size,parents.length);
    assert.ok(parents.every(x=>knownParents.includes(x)));
    assert.deepEqual(parents,breedParents[mode]);
  }
  assert.deepEqual(breedRequiredParents("bogus"),[]);
  assert.equal(breedActive(pristine),false);
  assert.equal(breedActive({...pristine,breedAmount:100}),false);
  const old={...original};delete old.breedMode;
  for(const k of breedControls)delete old[k];
  const parsed=validateRecipe(old);
  assert.equal(parsed.breedAmount,0);
  assert.equal(parsed.breedMode,initial.breedMode);
  for(const k of breedControls){
    assert.deepEqual(numericRanges[k],[0,100]);
    assert.equal(parsed[k],initial[k]);
    for(const value of [-1,101,NaN,Infinity])
      assert.throws(()=>validateRecipe({...original,[k]:value}),
        new RegExp("Invalid "+k));
  }
  assert.throws(()=>validateRecipe({...original,breedMode:"Vacuum Face"}),
    /Unknown breedMode/);
  assert.equal(sectionMeta("crossbreed-lab").tab,"Math");
  assert.deepEqual(sectionMeta("crossbreed-lab").on,["breedAmount"]);
  assert.ok(findControls("crossbreed").some(x=>x.id==="crossbreed-lab"));
});

test("activation requires actual parent fields and retains all unrelated art",()=>{
  const labels={
    "Oracle Singularity Brocade":["hexagramAmount","polesAmount"],
    "Dissolving Crochet":["qdAmount","hcrAmount"],
    "Velvet Event Horizon":["polesAmount","vldAmount"],
    "Hexagram Bio-Jacquard":["hexagramAmount","vldAmount"],
    "Five-Way Chimera":knownParents
  };
  for(const mode of breedModes){
    const active=activateBreed(pristine,mode);
    assert.deepEqual(breedRequiredParents(mode),labels[mode]);
    assert.equal(active.breedMode,mode);
    assert.ok(active.breedAmount>=66);
    assert.ok(breedActive(active));
    for(const k of knownParents){
      if(labels[mode].includes(k))assert.ok(active[k]>0,k);
      else assert.equal(active[k],0,k);
    }
    for(const k of ["colors","seed","engine","ratio","lettering",
      "filamentAmount","filamentSpecies","schlierenAmount","afterimage"])
      assert.deepEqual(active[k],pristine[k],k);
    for(const required of labels[mode]){
      assert.equal(breedActive({...active,[required]:0}),false,
        mode+" requires "+required);
    }
    assert.equal(breedActive(hideBreed(active)),false);
    assert.equal(hideBreed(active).breedAmount,0);
    assert.equal(hideBreed(active).hexagramAmount,active.hexagramAmount);
    assert.equal(hideBreed(active).polesAmount,active.polesAmount);
  }
  assert.equal(activateBreed(pristine,"Invalid offspring"),pristine);
  const chimera=activateBreed({...pristine,hcrQuality:99},"Five-Way Chimera");
  assert.ok(chimera.hcrQuality<=32);
  const protectedQuality=activateBreed({
    ...pristine,hcrAmount:50,hcrQuality:90
  },"Five-Way Chimera");
  assert.equal(protectedQuality.hcrQuality,90);
});

test("seven crossbreeds validate, serialize, and preserve all earlier effects and clocks",()=>{
  for(const preset of breedPresets){
    const active=applyBreedPreset(pristine,preset.name);
    assert.ok(breedActive(active),preset.name);
    assert.equal(active.breedMode,preset.breedMode);
    for(const key of breedControls){
      assert.equal(active[key],preset[key],preset.name+" "+key);
      assert.ok(active[key]>=0&&active[key]<=100);
    }
    for(const key of ["engine","colors","seed","ratio","lettering",
      "filamentAmount","filamentSpecies","schlierenAmount","afterimage"])
      assert.deepEqual(active[key],pristine[key],key);
    const timeline={time:3.75,colorTime:11.25,textTime:6.5};
    const doc=recipeDocument(active,"Unholy brocade",timeline);
    const imported=parseDocument(JSON.parse(JSON.stringify(doc)));
    assert.deepEqual(imported.timeline,timeline);
    assert.ok(breedActive(imported.state));
    for(const key of breedControls)assert.equal(imported.state[key],active[key]);
    assert.equal(imported.state.breedMode,active.breedMode);
  }
  assert.equal(applyBreedPreset(pristine,"unknown preset"),pristine);
});

test("targeted breeding shuffles are seeded, bounded, and leave original words/palette alone",()=>{
  for(const n of [0,.13,.37,.65,.999999,NaN,Infinity]){
    const rng=()=>n;
    const out=shuffleBreed(pristine,rng);
    assert.deepEqual(out,shuffleBreed(pristine,rng));
    assert.ok(breedModes.includes(out.breedMode));
    assert.ok(breedActive(out));
    for(const key of breedControls)
      assert.ok(Number.isFinite(out[key]) && out[key]>=0 && out[key]<=100,key);
    assert.ok(out.breedAmount>=40);
    for(const key of ["seed","colors","engine","lettering",
      "filamentAmount","filamentSpecies","schlierenAmount"])
      assert.deepEqual(out[key],pristine[key],key);
  }
});

test("old art Mutation stays dormant; Surprise enables actual parent fields",()=>{
  const mutated=randomize(pristine,{},true,()=>.77);
  assert.equal(mutated.breedAmount,0);
  for(const key of breedControls)
    assert.equal(mutated[key],pristine[key],key);
  const living=activateBreed(pristine,"Oracle Singularity Brocade");
  const next=randomize(living,{},true,()=>.77);
  assert.equal(next.breedMode,living.breedMode);
  assert.ok(next.breedAmount>0);
  assert.ok(breedControls.some(k=>next[k]!==living[k]));
  const data=read("data.js");
  assert.match(data,/if\(key\.startsWith\("breed"\) && state\.breedAmount<=0\)continue/);
  assert.match(data,/s\.breedMode=sample\(breedModes,random\)/);
  assert.match(data,/for\(const key of breedRequiredParents\(s\.breedMode\)\)/);
});

test("real field coupling uses both parent outputs, changes geometry and biological height",()=>{
  assert.match(breedGLSL,/vec4 breedInterlock\(inout vec2 p,inout vec4 tissue/);
  assert.match(breedGLSL,/oracle\.y\*\(\.3\+\.7\*poles\.y\)/);
  assert.match(breedGLSL,/flow=crochet\*\(\.3\+1\.35\*crystal\.y\)/);
  assert.match(breedGLSL,/tissue\.x=clamp\(tissue\.x\+growth\*\.72/);
  assert.match(breedGLSL,/oracle\.y\*\.69\+oracle\.w\*\.41/);
  assert.match(breedGLSL,/oracle\.y\*poles\.y\+crystal\.z\*organ/);
  assert.match(breedGLSL,/flow=flow\/\(1\.0\+length\(flow\)/);
  assert.match(breedGLSL,/p\+=flow\*breedAmount\*breedCoupling/);
  assert.match(breedGLSL,/vec3 ink=palette\(fract/);
  assert.match(breedGLSL,/colorTime/);
  assert.doesNotMatch(breedGLSL,/sampler2D|readPixels|framebuffer|raymarch/i);
  for(const n of [0,1,2,3])
    assert.ok(breedGLSL.includes("breedMode=="+n));
});

test("renderer reuses precomputed parent diagnostics and preserves strict export failures",()=>{
  const renderer=read("renderer.js");
  assert.match(renderer,/withBreed = breedActive\(s\)/);
  assert.match(renderer,/withBreed\?"crossbreed":"no-crossbreed"/);
  assert.match(renderer,/withBreed \? breedGLSL : ""/);
  assert.match(renderer,/vec4 breedData=breedInterlock\(p,breedTissue/);
  assert.match(renderer,/withHexagram\?"hexagramData"/);
  assert.match(renderer,/withPoles\?"polesData"/);
  assert.match(renderer,/withQd\?"qdData"/);
  assert.match(renderer,/withCrochet\?"crochetDelta"/);
  assert.match(renderer,/velvetData=breedTissue/);
  assert.match(renderer,/col=breedDress\(col,breedData,p\)/);
  assert.match(renderer,/breedUnavailable \? \{breedAmount:0\}/);
  assert.match(renderer,/if\(breedActive\(candidate\) && !breedUnavailable\)/);
  assert.match(renderer,/if\(exactEffects\)throw artworkParityError\("Full-effect shader failed to compile",e\)/);
  assert.match(renderer,/breedModes\.indexOf\(compiledState\.breedMode\)/);
  for(const key of breedControls)assert.ok(renderer.includes('"'+key+'"'),key);
  const sourcePre=renderer.indexOf("/* CROSSBREED_PRE */");
  const scene=renderer.indexOf("float v=composed(p);");
  const sourcePost=renderer.indexOf("/* CROSSBREED_POST */");
  assert.ok(sourcePre>0 && sourcePre<scene && scene<sourcePost);
  const inspector=read("components/Inspectors.jsx");
  assert.match(inspector,/id="crossbreed-lab"/);
  assert.match(inspector,/history\.change\(s=>activateBreed\(s,mode\)\)/);
  assert.match(inspector,/applyBreedPreset\(s,breedPreset\)/);
  assert.match(inspector,/shuffleBreed\(s\)/);
  assert.match(inspector,/history\.change\(hideBreed\)/);
});
