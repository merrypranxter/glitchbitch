import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,validateRecipe,recipeDocument,parseDocument,
  microModes as dataMicroModes,substanceModes as dataSubstanceModes,
  randomize} from "../src/data.js";
import {sectionMeta,sectionActive,findControls} from "../src/ui-index.js";
import {microModes,microFamilies,microPresets,microGLSL,
  specializeMicroGLSL,applyMicroPreset,remixMicro}
  from "../src/microstructure.js";
import {substanceModes,substanceFamilies,substancePresets,substanceGLSL,
  specializeSubstanceGLSL,applySubstancePreset,remixSubstance}
  from "../src/substance.js";
import {bioRotPresets,applyBioRotPreset,remixBioRot}
  from "../src/bio-rot-presets.js";

const originalMicro=["Living embroidery","Opal granulation","Gel caustics",
  "Point lace","Glass filaments","Crystalline cilia"];
const originalSubstance=["CMY lithogenesis","Chromatophore reef",
  "Chitin interference","Conformal chromasoup"];
const state={...initial,seed:729125,engine:7,ratio:"9:16",
  lettering:"DON'T TOUCH MY FUCKING COLORS",
  filamentAmount:72,filamentSpecies:"Fractal veinwork",
  photonAmount:61,photonSpecies:"Opal gyroid ghosts",
  colors:["#ff00ff","#00ffff","#ffff00"]};
const protectedKeys=["lettering","colors","ratio","seed","engine",
  "filamentAmount","filamentSpecies","photonAmount","photonSpecies"];
const assertPreserved=(next)=>{
  for(const key of protectedKeys)assert.deepEqual(next[key],state[key],key);
};
const brace=(source)=>[...source].reduce((n,c)=>n+(c==="{")-(c==="}"),0);
test("original mode indices remain stable while families cover all new species",()=>{
  assert.deepEqual(microModes.slice(0,6),originalMicro);
  assert.deepEqual(substanceModes.slice(0,4),originalSubstance);
  assert.equal(microModes.length,16);
  assert.equal(substanceModes.length,12);
  assert.equal(microPresets.length,10);
  assert.equal(substancePresets.length,8);
  assert.deepEqual(microModes,dataMicroModes);
  assert.deepEqual(substanceModes,dataSubstanceModes);
  for(const [modes,families] of [[microModes,microFamilies],
    [substanceModes,substanceFamilies]]){
    const all=families.flatMap(x=>x.modes);
    assert.deepEqual(new Set(all),new Set(modes));
    assert.equal(all.length,new Set(all).size);
  }
});
test("all sixteen micro modes specialize to a single distinct motion branch",()=>{
  for(let id=0;id<16;id++){
    const source=specializeMicroGLSL(microGLSL,id);
    const start=source.indexOf("  if(microMode=="+id+"){");
    const stop=source.indexOf("  }else{ // Unknown mode:");
    assert.ok(start>=0&&stop>start,id);
    assert.deepEqual([...source.slice(start,stop).matchAll(
      /(?:if|else if)\(microMode==(\d+)\)/g)].map(x=>Number(x[1])),[id]);
    assert.equal(brace(source),0,id);
    assert.ok(source.length<microGLSL.length,id);
    assert.ok(source.includes("vec3 pigments=palette("));
    assert.ok(source.includes("float t=time*"));
  }
});
test("all twelve substance modes compile to single material branches",()=>{
  for(let id=0;id<12;id++){
    const source=specializeSubstanceGLSL(substanceGLSL,id);
    const start=source.indexOf("  if(substanceMode=="+id+"){");
    const stop=source.indexOf("  }else{ // Unsupported mode:");
    assert.ok(start>=0&&stop>start,id);
    assert.deepEqual([...source.slice(start,stop).matchAll(
      /(?:if|else if)\(substanceMode==(\d+)\)/g)].map(x=>Number(x[1])),[id]);
    assert.equal(brace(source),0,id);
    assert.ok(source.length<substanceGLSL.length,id);
    assert.ok(source.includes("vec3 pigment=palette("));
    assert.ok(source.includes("float t=time*"));
  }
  assert.equal(specializeMicroGLSL(microGLSL,99),microGLSL);
  assert.equal(specializeSubstanceGLSL(substanceGLSL,-1),substanceGLSL);
});
test("each new micro mode has independent changing geometry and a full preset",()=>{
  for(let i=6;i<16;i++){
    const prefix="  }else if(microMode=="+i+"){";
    const next=i===15?"  }else{ // Unknown mode:":
      "  }else if(microMode=="+(i+1)+"){";
    const start=microGLSL.indexOf(prefix),end=microGLSL.indexOf(next,start);
    assert.ok(end-start>450,i);
    const body=microGLSL.slice(start,end);
    for(const prop of ["coverage=","edge=","hue="])
      assert.ok(body.includes(prop),i+" "+prop);
    assert.match(body,/\bt\b/);
    const preset=microPresets.find(p=>p.mode===microModes[i]);
    assert.ok(preset);
    const applied=applyMicroPreset(state,preset.name);
    assert.equal(applied.microMode,microModes[i]);
    assert.ok(applied.microAmount>=89&&applied.microMotion>=64);
    assertPreserved(applied);
    assert.deepEqual(validateRecipe(applied),applied);
    assert.deepEqual(parseDocument(recipeDocument(applied,"Living dust",
      {time:0,colorTime:0})).state,applied);
  }
});
test("all eight new materials are distinct and save/restore correctly",()=>{
  for(let i=4;i<12;i++){
    const first="  }else if(substanceMode=="+i+"){";
    const after=i===11?"  }else{ // Unsupported mode:":
      "  }else if(substanceMode=="+(i+1)+"){";
    const start=substanceGLSL.indexOf(first);
    const end=substanceGLSL.indexOf(after,start);
    const body=substanceGLSL.slice(start,end);
    assert.ok(end-start>350,i);
    for(const prop of ["layer=","opacity=","halo="])
      assert.ok(body.includes(prop),i+" "+prop);
    assert.match(body,/\bt\b/);
    const preset=substancePresets.find(p=>p.mode===substanceModes[i]);
    assert.ok(preset);
    const applied=applySubstancePreset(state,preset.name);
    assert.equal(applied.substanceMode,substanceModes[i]);
    assertPreserved(applied);
    assert.deepEqual(validateRecipe(applied),applied);
    assert.deepEqual(parseDocument(recipeDocument(applied,"Living matter",
      {time:0,colorTime:0})).state,applied);
  }
});
test("targeted shuffles change only texture/matter properties, seeded and safely",()=>{
  for(const n of [0,.14,.43,.81,.999]){
    for(const newOnly of [false,true]){
      const a=remixMicro(state,()=>n,newOnly);
      const b=remixSubstance(state,()=>n,newOnly);
      assert.deepEqual(a,remixMicro(state,()=>n,newOnly));
      assert.deepEqual(b,remixSubstance(state,()=>n,newOnly));
      assert.notEqual(a.microMode,state.microMode);
      assert.notEqual(b.substanceMode,state.substanceMode);
      assert.ok(a.microAmount>=72&&b.substanceAmount>=77);
      if(newOnly){
        assert.ok(microModes.slice(6).includes(a.microMode));
        assert.ok(substanceModes.slice(4).includes(b.substanceMode));
      }
      assertPreserved(a);assertPreserved(b);
      assert.deepEqual(validateRecipe(a),a);
      assert.deepEqual(validateRecipe(b),b);
    }
  }
});
test("Bio Rot has actual Gray-Scott feed/kill regimes, not invented shader modes",()=>{
  assert.equal(bioRotPresets.length,8);
  assert.equal(new Set(bioRotPresets.map(p=>p.name)).size,8);
  for(const p of bioRotPresets){
    const updated=applyBioRotPreset(state,p.name);
    assert.equal(updated.bioFeed,p.bioFeed);
    assert.equal(updated.bioKill,p.bioKill);
    assert.equal(updated.bioSpeed,p.bioSpeed);
    assert.equal(updated.bioVeins,p.bioVeins);
    assert.ok(updated.bioAmount>0);
    assertPreserved(updated);
    assert.deepEqual(validateRecipe(updated),updated);
  }
  assert.equal(applyBioRotPreset(state,"Not a recipe"),state);
  for(const n of [0,.25,.49,.78,.999]){
    const result=remixBioRot(state,()=>n);
    assertPreserved(result);
    assert.deepEqual(result,remixBioRot(state,()=>n));
  }
});
test("UI, search, engine randomizer and GPU cache use the expanded IDs",()=>{
  const ui=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
  const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
  for(const button of ["Shuffle microtextures","Shuffle new contaminants",
    "Shuffle substances","Shuffle mutant matter","Shuffle the petri dish",
    "Cultivate selected growth"]){
    assert.ok(ui.includes(button),button);
  }
  for(const term of ["microFamilies.map(","substanceFamilies.map(",
    "microPresets.map(","substancePresets.map(","bioRotPresets.map("]){
    assert.ok(ui.includes(term),term);
  }
  for(const part of ["specializeMicroGLSL(","specializeSubstanceGLSL(",
    'withMicro ? "micro"+microModes.indexOf(s.microMode)',
    'withSubstance ? "substance"+substanceModes.indexOf(s.substanceMode)']){
    assert.ok(renderer.includes(part),part);
  }
  for(const [term,section,group] of [["alien dandruff","micro","Materials"],
    ["radioactive sherbet","substance","Materials"],["witch agar","bio","Organisms"]]){
    assert.ok(findControls(term).some(x=>x.id===section),term);
    assert.equal(sectionMeta(section).group,group);
  }
  assert.equal(sectionActive(sectionMeta("micro"),initial),false);
  assert.equal(sectionActive(sectionMeta("substance"),initial),false);
  assert.equal(sectionActive(sectionMeta("bio"),initial),false);
  const surprise=randomize(state,{},false,()=>.7);
  assert.ok(microModes.includes(surprise.microMode));
  assert.ok(substanceModes.includes(surprise.substanceMode));
});
