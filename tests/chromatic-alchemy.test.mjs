import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {transformWithEsbuild} from "vite";
import {initial,validateRecipe,parseDocument,recipeDocument,numericRanges,
  randomize} from "../src/data.js";
import {sectionMeta,sectionActive,findControls} from "../src/ui-index.js";
import {alchemyModes,alchemyFamilies,alchemyDescriptions,alchemyControls,
  alchemyPresets,alchemyGLSL,specializeAlchemyGLSL,applyAlchemyPreset,
  shuffleAlchemy,hideAlchemy} from "../src/chromatic-alchemy.js";

const original={...initial,seed:876543,engine:8,ratio:"9:16",
 colors:["#ff00fe","#00ffee","#ddee00"],lettering:"ALIEN RADIO",
 filamentAmount:79,filamentSpecies:"Fractal veinwork",
 photonAmount:93,underlayAmount:56,alchemyAmount:0};
const protectedKeys=["seed","engine","ratio","colors","lettering",
 "filamentAmount","filamentSpecies","photonAmount","underlayAmount"];
const preserve=(next)=>protectedKeys.forEach(key=>
 assert.deepEqual(next[key],original[key],key));
const brace=(s)=>[...s].reduce((n,c)=>n+(c==="{")-(c==="}"),0);
const branchIds=(s)=>[...s.matchAll(
 /(?:if|else if)\(alchemyMode==(\d+)\)/g
)].map(x=>+x[1]);
test("four unique mechanisms, grouped exactly once, and eight complete presets",()=>{
 assert.deepEqual(alchemyModes,["OKLab Chroma Oracle","Birefringent Cellophane",
   "Chromadepth Risograph","Phosphene Gem"]);
 const entries=alchemyFamilies.flatMap(f=>f.modes);
 assert.deepEqual(new Set(entries),new Set(alchemyModes));
 assert.equal(entries.length,4);
 assert.equal(alchemyPresets.length,8);
 for(const m of alchemyModes)assert.ok(alchemyDescriptions[m]);
 for(const preset of alchemyPresets){
   assert.ok(alchemyModes.includes(preset.mode));
   assert.equal(typeof preset.alchemyPalette,"boolean");
   assert.ok(preset.alchemyAmount>0);
   for(const key of alchemyControls)
     assert.ok(Number.isFinite(preset[key])&&preset[key]>=0&&
       preset[key]<=100,preset.name+" "+key);
 }
});
test("the source has four distinct animated field/color engines",()=>{
 const unique=["vec3 lab=caToLab(original)","float retarder=",
   "float c=caInkDot(","float bloom=pow("];
 for(let id=0;id<4;id++){
   const start=id===0?"  if(alchemyMode==0){":
     "  }else if(alchemyMode=="+id+"){";
   const end=id===3?"  }else{ // Unsupported alchemy mode":
     "  }else if(alchemyMode=="+(id+1)+"){";
   const a=alchemyGLSL.indexOf(start),b=alchemyGLSL.indexOf(end,a);
   assert.ok(a>=0&&b>a);
   const body=alchemyGLSL.slice(a,b);
   assert.ok(body.includes(unique[id]),alchemyModes[id]);
   assert.match(body,/\bt\b/);
   assert.ok(body.length>320);
 }
 assert.match(alchemyGLSL,/return mix\(original,clamp\(crafted,0\.,1\.3\),alchemyAmount\)/);
 assert.match(alchemyGLSL,/float t=colorTime\*/);
});
test("WebGL1 compiler can receive exactly one mode with valid balanced syntax",()=>{
 for(let id=0;id<4;id++){
   const withId=alchemyGLSL.replace("uniform int alchemyMode;",
      "#define alchemyMode "+id);
   const src=specializeAlchemyGLSL(withId,id);
   assert.deepEqual(branchIds(src),[id]);
   assert.equal(brace(src),0);
   assert.ok(src.length<alchemyGLSL.length);
   assert.match(src,/vec3 livingColorAlchemy\(/);
   assert.doesNotMatch(src,/\bactive\b|\buint\b|texelFetch|texture2D|\bfwidth\b|sampler2D/);
 }
 for(const bad of [-1,4,1.2,NaN])
   assert.equal(specializeAlchemyGLSL(alchemyGLSL,bad),alchemyGLSL);
});
test("all eight presets and full 9:16 recipes round-trip unchanged",()=>{
 for(const preset of alchemyPresets){
   const next=applyAlchemyPreset(original,preset.name);
   assert.equal(next.alchemyMode,preset.mode);
   assert.equal(next.alchemyAmount,preset.alchemyAmount);
   preserve(next);
   assert.deepEqual(validateRecipe(next),next);
   assert.deepEqual(parseDocument(recipeDocument(next,"Color witch",
     {time:3.1,colorTime:6,textTime:2})).state,next);
 }
 assert.equal(applyAlchemyPreset(original,"not here"),original);
 assert.deepEqual(hideAlchemy({...original,alchemyAmount:91}),
   {...original,alchemyAmount:0});
});
test("full and funky color shuffles change engine, respect palette, and are seeded",()=>{
 for(const k of ["all","funky"])
   for(const n of [0,.11,.49,.72,.99]){
     const next=shuffleAlchemy(original,()=>n,k);
     assert.ok(alchemyModes.includes(next.alchemyMode));
     assert.notEqual(next.alchemyMode,original.alchemyMode);
     assert.deepEqual(next,shuffleAlchemy(original,()=>n,k));
     preserve(next);
     assert.deepEqual(validateRecipe(next),next);
   }
});
test("old recipes default to OFF and bad state cannot pass validation",()=>{
 assert.equal(initial.alchemyAmount,0);
 assert.equal(initial.alchemyMode,alchemyModes[0]);
 assert.equal(initial.alchemyPalette,true);
 const legacy={...original};
 for(const key of ["alchemyMode","alchemyPalette",...alchemyControls])
   delete legacy[key];
 const restored=validateRecipe(legacy);
 assert.equal(restored.alchemyAmount,0);
 assert.equal(restored.alchemyPalette,true);
 assert.equal(restored.alchemyMode,alchemyModes[0]);
 assert.throws(()=>validateRecipe({...original,alchemyMode:"Alien typo"}),
   /Unknown alchemyMode/);
 assert.throws(()=>validateRecipe({...original,alchemyAmount:200}),
   /Invalid alchemyAmount/);
 assert.throws(()=>validateRecipe({...original,alchemyPalette:"yes"}),
   /Invalid alchemyPalette/);
 for(const key of alchemyControls)
   assert.deepEqual(numericRanges[key],[0,100]);
});
test("preview and GIF/MP4 follow the same compiled shader and clocks",()=>{
 const r=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
 const exportSource=readFileSync(new URL("../src/export.js",import.meta.url),"utf8");
 assert.match(r,/withAlchemy = s\.alchemyAmount>0/);
 assert.match(r,/withAlchemy \? "alchemy"\+alchemyModes\.indexOf\(s\.alchemyMode\)/);
 assert.match(r,/specializeAlchemyGLSL\(/);
 assert.match(r,/source=source\.replace\("\/\* ALCHEMY_MODULE \*\/"\,opticalColor\)/);
 assert.match(r,/col=livingColorAlchemy\(col,uv,p,v\)/);
 assert.match(r,/alchemyUnavailable \? \{alchemyAmount:0\}/);
 assert.match(r,/candidate\.alchemyAmount>0 && !alchemyUnavailable/);
 assert.match(r,/gl\.uniform1f\(loc\("alchemyPalette"\), s\.alchemyPalette \? 1 : 0\)/);
 const start=r.indexOf("/* ALCHEMY_POST */"),after=r.indexOf("col=applyAppearance(col,uv)");
 assert.ok(start>=0&&after>start);
 assert.match(exportSource,/const frameClock = clockAt\(state, timeline, seconds\)/);
 assert.match(exportSource,/renderer\.draw\(state, frameClock, size\.width, size\.height\)/);
 assert.match(exportSource,/renderer\.draw\(state, timeline, width, height\)/);
 const surprise=randomize(original,{},false,()=>.45);
 assert.ok(alchemyModes.includes(surprise.alchemyMode));
 assert.ok(surprise.alchemyAmount>=0&&surprise.alchemyAmount<=100);
});
test("the full Inspector JSX actually parses using Vite's JSX transformer",async()=>{
 const text=readFileSync(new URL("../src/components/ColorLab.jsx",import.meta.url),"utf8");
 for(const key of ["alchemy: <>","alchemyFamilies.map(family=>",
   "Use my current palette","Shuffle color sorcery","Shuffle funky colors",
   "Summon this color","Hide color sorcery",
   "alchemyDescriptions[s.alchemyMode]"]){
   assert.ok(text.includes(key),key);
 }
 const transformed=await transformWithEsbuild(text,
   "src/components/ColorLab.jsx",{loader:"jsx"});
 assert.ok(transformed.code.includes("Shuffle funky colors"));
 assert.ok(transformed.code.length>1000);
 assert.equal(sectionMeta("alchemy").tab,"Color");
 assert.equal(sectionActive(sectionMeta("alchemy"),initial),false);
 for(const name of alchemyModes)
   assert.ok(findControls(name).some(x=>x.id==="alchemy"),name);
});
