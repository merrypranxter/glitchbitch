import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,validateRecipe,recipeDocument,parseDocument,randomize} from "../src/data.js";
import {findControls} from "../src/ui-index.js";
import {
 filamentStitchModes,filamentStitchFamilies,filamentStitchDescriptions,
 filamentStitchPresets,newFilamentStitchModes,remixFilamentStitchMotion,
 specializeFilamentStitchMotion,applyFilamentStitchPreset,filamentGLSL
} from "../src/filament-forge.js";

const originals=["Needle chase","Loom sweep","Running stitch",
  "Purl breathing","Unfurl & resew"];
const newModes=["Helix handoff","Knot cascade","Synaptic firing",
  "Alien Morse","Coral accretion","Tidal darning",
  "Fractal infestation","Reverse unpick",
  "Ricochet needle","Wormhole crochet",
  "Parasite hem","Oracle tacking","Spasm tatting",
  "Hologram darning","Ritual overlock","Witch-knot relay",
  "Chain stitch","Cross-stitch","Satin fill","Blanket stitch",
  "Feather stitch","Cable knit","Ghost bobbin","Quantum unpick",
  "Mutant zipper","Fractal mending"];
const authored={...initial,engine:17,ratio:"9:16",seed:98736,
  filamentSpecies:"Alien scriptwork",filamentSecondSpecies:"Nerve net",
  filamentCrossbreed:87,filamentMaterial:"Opaline glass",
  filamentSecondMaterial:"Iridescent silk",filamentStitchAmount:0,
  filamentAmount:75,lettering:"NOTHING IS BORING",colors:["#fe00f5","#00ffff","#ffdd00"]};

test("original five modes keep their exact saved identities and source order",()=>{
 assert.deepEqual(filamentStitchModes.slice(0,5),originals);
 assert.deepEqual(filamentStitchModes.slice(5),newModes);
 assert.deepEqual(newFilamentStitchModes,newModes);
 assert.equal(filamentStitchModes.length,31);
 assert.equal(new Set(filamentStitchModes).size,31);
 assert.equal(filamentStitchPresets.length,31);
 assert.deepEqual(filamentStitchPresets.slice(0,5).map(x=>x.filamentStitchMode),originals);
 assert.deepEqual(filamentStitchFamilies.flatMap(f=>f.modes).length,31);
 assert.equal(new Set(filamentStitchFamilies.flatMap(f=>f.modes)).size,31);
 for(const mode of filamentStitchModes)assert.ok(filamentStitchDescriptions[mode],mode);
});

test("every new species-specific stitch mode saves, reloads and preserves the authored artwork",()=>{
 for(const mode of newModes){
   const preset=filamentStitchPresets.find(x=>x.filamentStitchMode===mode);
   assert.ok(preset,mode);
   const current=applyFilamentStitchPreset(authored,preset.name);
   assert.equal(current.filamentStitchMode,mode);
   assert.ok(current.filamentStitchAmount>=90);
   for(const k of ["engine","ratio","seed","colors","lettering",
    "filamentSpecies","filamentSecondSpecies","filamentCrossbreed",
    "filamentMaterial","filamentSecondMaterial"]){
    assert.deepEqual(current[k],authored[k],mode+" "+k);
   }
   assert.deepEqual(validateRecipe(current),current);
   assert.deepEqual(parseDocument(recipeDocument(current,"Living threads",
     {time:2,colorTime:3})).state,current);
 }
});

test("each of thirty-one motion shader branches can be isolated for mobile GPU compilation",()=>{
 const branchIds=s=>[...s.matchAll(/(?:if|else if)\(filamentStitchMode==(\d+)\)/g)]
   .map(match=>Number(match[1]));
 const balance=s=>[...s].reduce((n,c)=>n+(c==="{")-(c==="}"),0);
 for(let i=0;i<31;i++){
   const selected=specializeFilamentStitchMotion(filamentGLSL,i);
   assert.deepEqual(branchIds(selected),[i],"motion index "+i);
   assert.equal(balance(selected),0,"motion braces "+i);
   assert.ok(selected.includes("float sewClock=time*"));
   assert.ok(selected.includes("core*=reveal"));
   assert.ok(selected.includes("maskCore=core"));
   assert.ok(selected.includes("needle*filamentStitchGlow*core"));
   assert.ok(selected.length<filamentGLSL.length,"small shader "+i);
   assert.ok(!/\bactive\b|texelFetch|texture2D|\bfwidth\b/.test(selected));
 }
 assert.equal(specializeFilamentStitchMotion(filamentGLSL,null),filamentGLSL);
 assert.equal(specializeFilamentStitchMotion(filamentGLSL,-1),filamentGLSL);
 assert.equal(specializeFilamentStitchMotion(filamentGLSL,99),filamentGLSL);
});

test("twenty-six new modes have unique time-dependent mask AND needle behavior",()=>{
 const start=i=>i===0?"  if(filamentStitchMode==0){":
   "  }else if(filamentStitchMode=="+i+"){";
 const raw=filamentGLSL;
 for(let i=5;i<31;i++){
   const begin=raw.indexOf(start(i));
   const end=raw.indexOf(i===30?"  }else{ // Invalid stored mode":
     start(i+1),begin);
   assert.ok(begin>=0&&end>begin,"branch "+i);
   const body=raw.slice(begin,end);
   assert.ok(body.includes("sewClock"),"time-driven "+i);
   assert.ok(body.includes("visibleStitch="),"reveal "+i);
   assert.ok(body.includes("needle="),"tip "+i);
   assert.ok(body.length>200,"substantial mechanism "+i);
 }
});

test("two targeted stitch shuffles are deterministic and do not change colors, text or geometry",()=>{
 const base={...authored,filamentStitchMode:"Synaptic firing"};
 for(const newOnly of [false,true]){
   for(const n of [0,.10,.49,.87,.9999]){
     const first=remixFilamentStitchMotion(base,()=>n,newOnly);
     assert.deepEqual(first,remixFilamentStitchMotion(base,()=>n,newOnly));
     const choices=newOnly?newModes:filamentStitchModes;
     assert.ok(choices.includes(first.filamentStitchMode));
     assert.notEqual(first.filamentStitchMode,base.filamentStitchMode);
     assert.ok(first.filamentStitchAmount>=78&&first.filamentAmount>=65);
     assert.ok(first.filamentStitchSpeed>=24&&first.filamentStitchSpeed<=98);
     for(const k of ["ratio","seed","engine","colors","lettering",
       "filamentSpecies","filamentSecondSpecies","filamentMaterial",
       "filamentSecondMaterial","filamentCrossbreed"])
       assert.deepEqual(first[k],base[k],k);
     assert.deepEqual(validateRecipe(first),first);
   }
 }
});

test("Surprise, typed schema, search and mobile control wiring include new motions",()=>{
 for(const mode of newModes){
   assert.equal(validateRecipe({...authored,filamentStitchMode:mode}).filamentStitchMode,mode);
   assert.ok(findControls(mode).some(x=>x.id==="filament"),mode);
 }
 const s=randomize(authored,{},false,()=>.99);
 assert.ok(filamentStitchModes.includes(s.filamentStitchMode));
 const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
 const ui=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
 assert.ok(renderer.includes("specializeFilamentStitchMotion("));
 assert.ok(renderer.includes("filamentStitchModes.indexOf(s.filamentStitchMode)"));
 assert.ok(renderer.includes("withStitch?filamentStitchModes.indexOf"));
 assert.ok(renderer.includes("filamentStitchUnavailable=true"));
 assert.ok(ui.includes("filamentStitchFamilies.map(family=>"));
 assert.ok(ui.includes("filamentStitchDescriptions[s.filamentStitchMode]"));
 assert.ok(ui.includes("Shuffle stitch motions"));
 assert.ok(ui.includes("Shuffle new weird stitches"));
 assert.ok(ui.includes("remixFilamentStitchMotion(x,Math.random,true)"));
});
