import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {transformWithEsbuild} from "vite";
import {initial,validateRecipe,recipeDocument,parseDocument,numericRanges,
  randomize} from "../src/data.js";
import {findControls,sectionMeta,sectionActive} from "../src/ui-index.js";
import {injuryModes,injuryFamilies,injuryDescriptions,injuryControls,
  injuryPresets,injuryGLSL,specializeInjuryGLSL,applyInjuryPreset,
  shuffleInjury,hideInjury} from "../src/print-spectrum-injury.js";
import {alchemyModes} from "../src/chromatic-alchemy.js";

const art={...initial,seed:315731,engine:7,ratio:"9:16",
 colors:["#ff00ff","#00ffff","#ffee00"],lettering:"WEIRD IS A VIRTUE",
 filamentAmount:87,filamentSpecies:"Fractal veinwork",
 photonAmount:76,underlayAmount:59,alchemyMode:alchemyModes[3],
 alchemyAmount:81,injuryAmount:0};
const untouched=["seed","engine","ratio","colors","lettering",
 "filamentAmount","filamentSpecies","photonAmount","underlayAmount",
 "alchemyMode","alchemyAmount"];
function preserved(next){
 for(const k of untouched)assert.deepEqual(next[k],art[k],k);
}
function braces(s){return [...s].reduce((n,c)=>n+(c==="{")-(c==="}"),0);}
function branches(s){return [...s.matchAll(/(?:if|else if)\(injuryMode==(\d+)\)/g)].map(x=>+x[1]);}

test("four unique moving print species, all families and eight presets",()=>{
 assert.deepEqual(injuryModes,[
   "Rainbow XOR Ditherscape","Caustic Ink-Dot Erosion",
   "Hypercolor Damage Reactor","Spectral Fracture Comb"]);
 const grouped=injuryFamilies.flatMap(x=>x.modes);
 assert.deepEqual(grouped,injuryModes);
 assert.equal(new Set(grouped).size,4);
 assert.equal(injuryPresets.length,8);
 assert.equal(new Set(injuryPresets.map(x=>x.name)).size,8);
 for(const mode of injuryModes)assert.ok(injuryDescriptions[mode]);
 for(const p of injuryPresets){
   assert.ok(injuryModes.includes(p.mode));
   assert.equal(typeof p.injuryPalette,"boolean");
   assert.ok(p.injuryAmount>0);
   for(const key of injuryControls){
     assert.ok(Number.isFinite(p[key])&&p[key]>=0&&p[key]<=100,
       p.name+" "+key);
   }
 }
});
test("every moving color law has its own distinct mathematics",()=>{
 const signatures=["float parity=piXor(","float c=piInkDot(",
   "vec3 hsv=piRgbToHsv(","vec3 passbands=.5+.5*cos("];
 for(let i=0;i<4;i++){
   const start=i===0?"  if(injuryMode==0){":
     "  }else if(injuryMode=="+i+"){";
   const end=i===3?"  }else{ // Unsupported print injury mode":
     "  }else if(injuryMode=="+(i+1)+"){";
   const a=injuryGLSL.indexOf(start),b=injuryGLSL.indexOf(end,a);
   assert.ok(a>=0&&b>a);
   const body=injuryGLSL.slice(a,b);
   assert.ok(body.includes(signatures[i]),injuryModes[i]);
   assert.match(body,/\bt\b/);
   assert.ok(body.length>450);
 }
 assert.match(injuryGLSL,/float t=colorTime\*/);
 assert.match(injuryGLSL,/return mix\(original,clamp\(crafted,0\.,1\.35\),injuryAmount\)/);
});
test("all four modes prune to one WebGL1-safe shader branch",()=>{
 for(let i=0;i<4;i++){
   const src=specializeInjuryGLSL(
     injuryGLSL.replace("uniform int injuryMode;","#define injuryMode "+i),i);
   assert.deepEqual(branches(src),[i]);
   assert.equal(braces(src),0);
   assert.ok(src.length<injuryGLSL.length);
   assert.ok(src.includes("vec3 livingPrintInjury("));
   assert.doesNotMatch(src,/\bactive\b|\buint\b|sampler2D|texelFetch|texture2D|\bfwidth\b/);
 }
 for(const bad of [-1,4,2.5,NaN])
   assert.equal(specializeInjuryGLSL(injuryGLSL,bad),injuryGLSL);
});
test("presets round-trip with existing Color Sorcery and artist's artwork",()=>{
 for(const p of injuryPresets){
   const next=applyInjuryPreset(art,p.name);
   assert.equal(next.injuryMode,p.mode);
   assert.ok(next.injuryAmount>0);
   preserved(next);
   assert.deepEqual(validateRecipe(next),next);
   assert.deepEqual(parseDocument(recipeDocument(next,"Spectrum Mutant",
     {time:3,colorTime:7,textTime:2})).state,next);
 }
 assert.equal(applyInjuryPreset(art,"not real"),art);
 assert.deepEqual(hideInjury({...art,injuryAmount:97}),
   {...art,injuryAmount:0});
});
test("shuffles are deterministic, distinct and don't replace artwork",()=>{
 for(const type of ["all","funky"])
   for(const n of [0,.12,.48,.75,.999]){
     const next=shuffleInjury(art,()=>n,type);
     assert.notEqual(next.injuryMode,art.injuryMode);
     assert.deepEqual(next,shuffleInjury(art,()=>n,type));
     preserved(next);
     assert.deepEqual(validateRecipe(next),next);
   }
});
test("old files remain disabled and invalid options are rejected",()=>{
 assert.equal(initial.injuryAmount,0);
 assert.equal(initial.injuryPalette,true);
 assert.equal(initial.injuryMode,injuryModes[0]);
 const old={...art};
 for(const key of ["injuryMode","injuryPalette",...injuryControls])
   delete old[key];
 const legacy=validateRecipe(old);
 assert.equal(legacy.injuryAmount,0);
 assert.equal(legacy.injuryMode,injuryModes[0]);
 assert.equal(legacy.injuryPalette,true);
 assert.throws(()=>validateRecipe({...art,injuryMode:"Not real"}),
   /Unknown injuryMode/);
 assert.throws(()=>validateRecipe({...art,injuryAmount:101}),
   /Invalid injuryAmount/);
 assert.throws(()=>validateRecipe({...art,injuryPalette:"true"}),
   /Invalid injuryPalette/);
 for(const key of injuryControls)assert.deepEqual(numericRanges[key],[0,100]);
});
test("renderer caches per mode and disables injury before other layers on GPU failure",()=>{
 const render=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
 const exporter=readFileSync(new URL("../src/export.js",import.meta.url),"utf8");
 assert.ok(render.includes('withInjury = s.injuryAmount>0'));
 assert.ok(render.includes('withInjury ? "injury"+injuryModes.indexOf(s.injuryMode) : "no-injury"'));
 assert.ok(render.includes('specializeInjuryGLSL('));
 assert.ok(render.includes('source=source.replace("/* INJURY_MODULE */",printSource)'));
 assert.ok(render.includes('withInjury?"col=livingPrintInjury(col,uv,p,v);":""'));
 assert.ok(render.includes('injuryUnavailable ? {injuryAmount:0}'));
 assert.ok(render.includes('if(candidate.injuryAmount>0 && !injuryUnavailable)'));
 assert.ok(render.includes('gl.uniform1f(loc("injuryPalette"), s.injuryPalette ? 1 : 0)'));
 const a=render.indexOf("/* ALCHEMY_POST */");
 const b=render.indexOf("/* INJURY_POST */");
 const c=render.indexOf("col=applyAppearance(col,uv);");
 assert.ok(a>=0&&b>a&&c>b);
 assert.ok(exporter.includes("renderer.draw(state, frameClock, size.width, size.height)"));
 assert.ok(exporter.includes("renderer.draw(state, timeline, width, height)"));
 const surprise=randomize(art,{},false,()=>.44);
 assert.ok(injuryModes.includes(surprise.injuryMode));
 assert.ok(surprise.injuryAmount>=0&&surprise.injuryAmount<=100);
});
test("the actual Inspector source parses with Vite and exposes searchable controls",async()=>{
 const ui=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
 for(const label of ['"print-injury": <>',"injuryFamilies.map(family=>",
   "Use my current palette","Shuffle print injury","Shuffle extreme damage",
   "Summon print mutation","Hide print injury"])
   assert.ok(ui.includes(label),label);
 const transformed=await transformWithEsbuild(ui,
   "src/components/Inspectors.jsx",{loader:"jsx"});
 assert.ok(transformed.code.length>1000);
 assert.equal(sectionMeta("print-injury").group,"Glitch");
 assert.equal(sectionActive(sectionMeta("print-injury"),initial),false);
 for(const name of injuryModes)
   assert.ok(findControls(name).some(x=>x.id==="print-injury"),name);
});
