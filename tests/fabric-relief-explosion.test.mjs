import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,validateRecipe,recipeDocument,parseDocument,randomize}
  from "../src/data.js";
import {findControls,sectionMeta,sectionActive} from "../src/ui-index.js";
import {
 underlayModes,newUnderlayModes,underlayFamilies,underlayDescriptions,
 underlayPresets,underlayGLSL,specializeUnderlayGLSL,
 applyUnderlayPreset,remixUnderlay,disableUnderlay
} from "../src/living-underlay.js";
import {
 filamentStitchModes,filamentStitchFamilies,filamentStitchPresets,
 filamentStitchDescriptions,ritualFilamentStitchModes,
 remixRitualStitches,applyFilamentStitchPreset,
 filamentSculptModes,newFilamentSculptModes,filamentSculptFamilies,
 filamentSculptPresets,applyFilamentSculptPreset,remixFilamentSculpt,
 specializeFilamentSculptMotion,specializeFilamentStitchMotion,
 specializeFilamentGeometry,filamentGLSL
} from "../src/filament-forge.js";
const originalFabric=["Ornamental jacquard","Breathing moiré organza",
 "Quasicrystal twill","Velvet pile","Opalescent damask","Cellular gauze"];
const originalSculpt=["Raised satin","Trapunto quilting","Recessed engraving",
 "Chased metal","Shadow cutwork"];
const originalStitch=["Needle chase","Loom sweep","Running stitch",
 "Purl breathing","Unfurl & resew","Helix handoff","Knot cascade",
 "Synaptic firing","Alien Morse","Coral accretion","Tidal darning",
 "Fractal infestation","Reverse unpick","Ricochet needle",
 "Wormhole crochet"];
const artwork={...initial,seed:87645,engine:12,ratio:"9:16",
 lettering:"THIS IS MY ART — DO NOT TOUCH",colors:["#ff00ee","#00eeff","#ddee00"],
 filamentAmount:68,filamentSpecies:"Alien scriptwork",
 filamentSecondSpecies:"Fractal veinwork",filamentCrossbreed:78,
 filamentMaterial:"Opaline glass",photonAmount:69,underlayAmount:0,
 filamentStitchAmount:0,filamentSculptAmount:0};
const protectedKeys=["seed","engine","ratio","lettering","colors",
 "filamentSpecies","filamentSecondSpecies","filamentCrossbreed",
 "filamentMaterial","photonAmount"];
const conserved=(next)=>protectedKeys.forEach(k=>
 assert.deepEqual(next[k],artwork[k],"must preserve "+k));
const brace=s=>[...s].reduce((n,c)=>n+(c==="{")-(c==="}"),0);

test("all legacy names/indices are preserved, grouped exactly once",()=>{
 assert.deepEqual(underlayModes.slice(0,6),originalFabric);
 assert.deepEqual(filamentSculptModes.slice(0,5),originalSculpt);
 assert.deepEqual(filamentStitchModes.slice(0,15),originalStitch);
 assert.equal(underlayModes.length,16);
 assert.equal(filamentSculptModes.length,15);
 assert.equal(filamentStitchModes.length,31);
 assert.deepEqual(newUnderlayModes,underlayModes.slice(6));
 assert.deepEqual(newFilamentSculptModes,filamentSculptModes.slice(5));
 assert.deepEqual(ritualFilamentStitchModes,filamentStitchModes.slice(15,21));
 for(const [modes,groups] of [[underlayModes,underlayFamilies],
   [filamentSculptModes,filamentSculptFamilies],
   [filamentStitchModes,filamentStitchFamilies]]){
   const values=groups.flatMap(g=>g.modes);
   assert.equal(values.length,modes.length);
   assert.deepEqual(new Set(values),new Set(modes));
 }
 assert.equal(underlayPresets.length,16);
 assert.equal(filamentSculptPresets.length,15);
 assert.equal(filamentStitchPresets.length,31);
 for(const mode of newUnderlayModes)assert.ok(underlayDescriptions[mode]);
 for(const mode of filamentStitchModes)assert.ok(filamentStitchDescriptions[mode]);
});
test("ten genuinely animated fabric grounds have distinct shader branches",()=>{
 for(let id=0;id<16;id++){
   const src=specializeUnderlayGLSL(underlayGLSL,id);
   assert.equal(brace(src),0);
   assert.ok(src.length<underlayGLSL.length);
   const start=src.indexOf("  if(underlayMode=="+id+"){");
   const end=src.indexOf("  }else{ // Unsupported textile mode");
   assert.ok(start>=0&&end>start,id);
   const found=[...src.slice(start,end).matchAll(
    /(?:if|else if)\(underlayMode==(\d+)\)/g)];
   assert.deepEqual(found.map(x=>+x[1]),[id]);
   assert.ok(src.includes("vec3 livingTextileUnderlay"));
   assert.ok(src.includes("palette(hue)"));
 }
 for(let id=6;id<16;id++){
   const source=underlayGLSL;
   const first="  }else if(underlayMode=="+id+"){";
   const last=id===15?"  }else{ // Unsupported textile mode":
      "  }else if(underlayMode=="+(id+1)+"){";
   const start=source.indexOf(first),stop=source.indexOf(last,start);
   const body=source.slice(start,stop);
   assert.ok(body.length>400,id);
   for(const token of ["fiber=","ornament=","shimmer=","shadow=","phase="])
     assert.ok(body.includes(token),id+" "+token);
   assert.match(body,/\bt\b/);
 }
 assert.equal(specializeUnderlayGLSL(underlayGLSL,-1),underlayGLSL);
});
test("fabric presets round-trip without altering art or overlapping layers",()=>{
 for(const p of underlayPresets.slice(6)){
   assert.ok(newUnderlayModes.includes(p.underlayMode));
   assert.ok(p.underlayMotion>=40);
   const x=applyUnderlayPreset(artwork,p.name);
   conserved(x);
   assert.equal(x.underlayMode,p.underlayMode);
   assert.deepEqual(validateRecipe(x),x);
   assert.deepEqual(parseDocument(recipeDocument(x,"Haunted fabric",
     {time:2,colorTime:4})).state,x);
 }
 const hidden=disableUnderlay({...artwork,underlayAmount:98});
 assert.equal(hidden.underlayAmount,0);
 assert.equal(hidden.filamentAmount,artwork.filamentAmount);
});
test("sculpted relief has fifteen independent 2.5D shading branches",()=>{
 const names=["core","rounded","shadowStrength","lightStrength"];
 for(let id=0;id<15;id++){
   const src=specializeFilamentSculptMotion(filamentGLSL,id);
   const start=src.indexOf("  if(filamentSculptMode=="+id+"){");
   const stop=src.indexOf("  }else{ // Unsupported sculpt mode",start);
   assert.ok(stop>start);
   const found=[...src.slice(start,stop).matchAll(
      /(?:if|else if)\(filamentSculptMode==(\d+)\)/g)];
   assert.deepEqual(found.map(x=>+x[1]),[id]);
   assert.equal(brace(src),0);
   assert.ok(src.length<filamentGLSL.length);
   for(const term of ["filamentSculptLight*6.2831853","shadowRegion*=sculptReveal"])
     assert.ok(src.includes(term));
 }
 for(let id=5;id<15;id++){
   const first="  }else if(filamentSculptMode=="+id+"){";
   const next=id===14?"  }else{ // Unsupported sculpt mode":
     "  }else if(filamentSculptMode=="+(id+1)+"){";
   const a=filamentGLSL.indexOf(first),b=filamentGLSL.indexOf(next,a);
   const body=filamentGLSL.slice(a,b);
   assert.ok(body.length>300,id);
   assert.ok(body.includes("result+="),id);
   assert.ok(body.includes("shadowStrength"),id);
 }
 for(const p of filamentSculptPresets.slice(5)){
   const next=applyFilamentSculptPreset(artwork,p.name);
   conserved(next);
   assert.equal(next.filamentSculptMode,p.filamentSculptMode);
   assert.deepEqual(validateRecipe(next),next);
 }
});
test("all 21 sewing motions can prune to a single selected needle system",()=>{
 for(let id=0;id<21;id++){
   const src=specializeFilamentStitchMotion(filamentGLSL,id);
   const start=src.indexOf("  if(filamentStitchMode=="+id+"){");
   const stop=src.indexOf("  }else{ // Invalid stored mode",start);
   assert.ok(stop>start);
   const found=[...src.slice(start,stop).matchAll(
     /(?:if|else if)\(filamentStitchMode==(\d+)\)/g)];
   assert.deepEqual(found.map(x=>+x[1]),[id]);
   assert.equal(brace(src),0);
   assert.ok(src.includes("needle*filamentStitchGlow*core"));
 }
 for(const mode of ritualFilamentStitchModes){
   const p=filamentStitchPresets.find(x=>x.filamentStitchMode===mode);
   assert.ok(p,mode);
   const updated=applyFilamentStitchPreset(artwork,p.name);
   conserved(updated);
   assert.deepEqual(validateRecipe(updated),updated);
   assert.deepEqual(parseDocument(recipeDocument(updated,"Alien knitting",
     {time:3,colorTime:2})).state,updated);
 }
});
test("shader pruning composes safely with every geometry and hybrid sewing",()=>{
 for(let i=0;i<16;i++){
   const geom=specializeFilamentGeometry(filamentGLSL,i,(i+3)%16);
   for(let stitch=0;stitch<21;stitch++){
     const trimmed=specializeFilamentStitchMotion(geom,stitch);
     const final=specializeFilamentSculptMotion(trimmed,stitch%15);
     assert.equal(brace(final),0,i+"/"+stitch);
     assert.ok(final.includes("vec3 livingFilamentForge"));
     assert.ok(final.includes("needle*filamentStitchGlow*core"));
     assert.ok(final.includes("shadowRegion*=sculptReveal"));
   }
 }
});
test("three targeted shuffles keep the user's art and are deterministic",()=>{
 for(const n of [0,.17,.51,.77,.999]){
   const rand=()=>n;
   for(const [fn,mode] of [[remixUnderlay,"underlayMode"],
     [remixFilamentSculpt,"filamentSculptMode"],
     [remixRitualStitches,"filamentStitchMode"]]){
     const x=fn(artwork,rand);
     assert.deepEqual(x,fn(artwork,rand));
     conserved(x);
     assert.notEqual(x[mode],artwork[mode]);
     assert.deepEqual(validateRecipe(x),x);
   }
   assert.ok(newUnderlayModes.includes(remixUnderlay(artwork,rand,true).underlayMode));
   assert.ok(newFilamentSculptModes.includes(remixFilamentSculpt(artwork,rand,true).filamentSculptMode));
   assert.ok(ritualFilamentStitchModes.includes(remixRitualStitches(artwork,rand).filamentStitchMode));
 }
});
test("UI Find, renderer cache, optional GPU fallback and Surprise are wired",()=>{
 const ui=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
 const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
 for(const term of ["Shuffle haunted fabrics","Shuffle textile grounds",
   "Shuffle sculpted relief","Shuffle alien relic relief",
   "Shuffle ritual stitches","underlayFamilies.map",
   "filamentSculptFamilies.map","filamentStitchFamilies.map"]){
   assert.ok(ui.includes(term),term);
 }
 for(const term of ["specializeUnderlayGLSL(","specializeFilamentSculptMotion(",
   "specializeFilamentStitchMotion(","underlayUnavailable=true",
   "filamentSculptUnavailable=true"]){
   assert.ok(renderer.includes(term),term);
 }
 for(const [term,id] of [["ghost quilt","underlay"],
   ["alien scar tissue","filament"],["witch-knot relay","filament"]])
   assert.ok(findControls(term).some(x=>x.id===id),term);
 assert.equal(sectionMeta("underlay").tab,"Effects");
 assert.equal(sectionActive(sectionMeta("underlay"),initial),false);
 assert.equal(sectionActive(sectionMeta("filament"),initial),false);
 const shuffled=randomize(artwork,{},false,()=>.44);
 assert.ok(underlayModes.includes(shuffled.underlayMode));
 assert.ok(filamentSculptModes.includes(shuffled.filamentSculptMode));
 assert.ok(filamentStitchModes.includes(shuffled.filamentStitchMode));
});
