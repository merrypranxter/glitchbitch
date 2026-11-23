import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,validateRecipe,recipeDocument,parseDocument,randomize,
  backdropModes as savedBackdropModes} from "../src/data.js";
import {sectionMeta,sectionActive,findControls} from "../src/ui-index.js";
import {photonSpecies,photonSpeciesFamilies,funkyPhotonSpecies,
  photonPresets,photonGLSL,photonPresetState,remixFunkyPhoton,
  specializePhotonGeometry} from "../src/photon-zoo.js";
import {backdropModes,newBackdropModes,funkyBackdropModes,backdropFamilies,
  backdropDescriptions,backdropPresets,backdropGLSL,applyBackdropPreset,
  remixBackdrop,specializeBackdropGLSL} from "../src/backdrops.js";

const legacyPhotons=[
 "Prism rosettes","Cathedral halos","Liquid lenses","Diffraction flowers",
 "Interference organisms","Chromatic ribbons","Op-art shockwaves",
 "Starburst engines","Caustic anemones","Opal gyroid ghosts",
 "Gravitational lensworms","Lenticular chrysalis","Quasicrystal halos",
 "Plasma jellybells","Moiré pollen","Spectral manta wings",
 "Nerve pearls","Temporal diffraction comb"];
const legacyBackdrop=["Nebula veils","Cosmic pollen","Caustic undercurrent",
 "Ghost architecture","Phosphor jacquard","Opal cell fog"];
const weirdPhotons=["Candy singularity","Pollen eclipse","Jelly cathedral",
 "Haunted lenticules","Iridescent spore halo","Prism amoeba",
 "Neon diffraction fungus","Opal thunder lattice"];
const weirdBackdrops=["Smog cathedral","Luminous dustfall","Aurora static",
 "Echo chamber mist","Candle plasma haze","Velvet signal fog","Mold heaven",
 "TV séance","Hallucinogenic wallpaper","Synthetic dusk ooze",
 "Afterimage swamp","Ghost mall aquarium"];
const state={...initial,seed:89762,engine:15,ratio:"9:16",
 lettering:"THE OLD ART MUST SURVIVE",colors:["#ff00ff","#00ffff","#fff400"],
 filamentAmount:91,filamentSpecies:"Fractal veinwork",underlayAmount:64,
 photonAmount:0,backdropAmount:0,photonSpecies:"Prism rosettes",
 backdropMode:"Nebula veils"};
const protectedKeys=["engine","seed","ratio","colors","lettering",
 "filamentAmount","filamentSpecies","underlayAmount"];
const preserve=next=>protectedKeys.forEach(key=>
  assert.deepEqual(next[key],state[key],key));
const balanced=src=>[...src].reduce((n,c)=>n+(c==="{")-(c==="}"),0);
const ids=(src,field)=>[...src.matchAll(
  new RegExp("(?:if|else if)\\("+field+"==(\\d+)\\)","g")
)].map(x=>Number(x[1]));

test("all legacy optical and atmospheric names retain saved shader IDs",()=>{
 assert.deepEqual(photonSpecies.slice(0,18),legacyPhotons);
 assert.deepEqual(photonSpecies.slice(18),weirdPhotons);
 assert.deepEqual(funkyPhotonSpecies,weirdPhotons);
 assert.equal(photonPresets.length,26);
 assert.deepEqual(backdropModes.slice(0,6),legacyBackdrop);
 assert.deepEqual(backdropModes.slice(6),weirdBackdrops);
 assert.deepEqual(backdropModes,savedBackdropModes);
 assert.equal(backdropPresets.length,18);
 assert.deepEqual(newBackdropModes,weirdBackdrops);
 assert.deepEqual(funkyBackdropModes,weirdBackdrops.slice(6));
 for(const [modes,groups] of [[photonSpecies,photonSpeciesFamilies],
   [backdropModes,backdropFamilies]]){
   const all=groups.flatMap(x=>x.species||x.modes);
   assert.deepEqual(new Set(all),new Set(modes));
   assert.equal(new Set(all).size,modes.length);
   assert.equal(all.length,modes.length);
 }
});
test("all 26 optical sources specialize to a single branch and preserve pigment",()=>{
 for(let id=0;id<26;id++){
   const src=specializePhotonGeometry(photonGLSL,id);
   assert.deepEqual(ids(src,"photonSpecies"),[id],String(id));
   assert.equal(balanced(src),0,String(id));
   assert.ok(src.length<photonGLSL.length);
   assert.ok(src.includes("vec3 pigment=palette("));
   assert.ok(src.includes("return clamp(result,0.0,1.5);"));
   assert.doesNotMatch(src,/\bactive\b|\buint\b|texture2D|texelFetch|\bfwidth\b/);
 }
 assert.equal(specializePhotonGeometry(photonGLSL,-1),photonGLSL);
 assert.equal(specializePhotonGeometry(photonGLSL,26),photonGLSL);
});
test("the eight funky optics have distinct time-driven shape, rim and glow",()=>{
 for(let id=18;id<26;id++){
   const start="  }else if(photonSpecies=="+id+"){";
   const end=id===25?"  }else{ // Unsupported photon species":
      "  }else if(photonSpecies=="+(id+1)+"){";
   const a=photonGLSL.indexOf(start),b=photonGLSL.indexOf(end,a);
   assert.ok(a>=0&&b>a);
   const shape=photonGLSL.slice(a,b);
   assert.ok(shape.length>400,String(id));
   for(const key of ["shape=","rim=","glint=","phase=","alpha="])
     assert.ok(shape.includes(key),id+" "+key);
   assert.match(shape,/\bt\b/);
 }
});
test("all eighteen backdrops are isolated, balanced and visibly time-driven",()=>{
 for(let id=0;id<18;id++){
   const src=specializeBackdropGLSL(backdropGLSL,id);
   assert.deepEqual(ids(src,"backdropMode"),[id],String(id));
   assert.equal(balanced(src),0,String(id));
   assert.ok(src.length<backdropGLSL.length);
   assert.ok(src.includes("vec3 livingBackdrop"));
   assert.ok(src.includes("palette(fract(backdropHue"));
   assert.ok(src.includes("return mix(original,underpainting,layer);"));
 }
 for(let id=6;id<18;id++){
   const start="  }else if(backdropMode=="+id+"){";
   const end=id===17?"  }else{ // Unsupported backdrop mode":
     "  }else if(backdropMode=="+(id+1)+"){";
   const a=backdropGLSL.indexOf(start),b=backdropGLSL.indexOf(end,a);
   const part=backdropGLSL.slice(a,b);
   assert.ok(b>a && part.length>320,id);
   for(const key of ["a=","b=","detail="])
      assert.ok(part.includes(key),id+" "+key);
   assert.match(part,/\bt\b/);
 }
 assert.equal(specializeBackdropGLSL(backdropGLSL,19),backdropGLSL);
});
test("each optical and atmospheric preset round-trips without changing existing art",()=>{
 for(const mode of weirdPhotons){
   const p=photonPresets.find(x=>x.species===mode);
   assert.ok(p,mode);
   const next=photonPresetState(state,p.name);
   assert.equal(next.photonSpecies,mode);
   preserve(next);
   assert.deepEqual(validateRecipe(next),next);
   assert.deepEqual(parseDocument(recipeDocument(next,"Optic preset",
     {time:3,colorTime:1})).state,next);
 }
 for(const mode of backdropModes){
   const p=backdropPresets.find(x=>x.mode===mode);
   assert.ok(p,mode);
   assert.ok(p.backdropAmount>0&&p.backdropMotion>0);
   const next=applyBackdropPreset(state,p.name);
   assert.equal(next.backdropMode,mode);
   preserve(next);
   assert.deepEqual(validateRecipe(next),next);
   assert.deepEqual(parseDocument(recipeDocument(next,"Ghost atmosphere",
     {time:3,colorTime:1})).state,next);
 }
 assert.equal(applyBackdropPreset(state,"missing"),state);
});
test("targeted randomizers preserve text, palette and unrelated art",()=>{
 for(const v of [0,.1,.39,.73,.99]){
   const optic=remixFunkyPhoton(state,()=>v);
   assert.ok(weirdPhotons.includes(optic.photonSpecies));
   assert.ok(optic.photonAmount>=90);
   assert.deepEqual(optic,remixFunkyPhoton(state,()=>v));
   preserve(optic);
   for(const kind of ["all","new","funky"]){
     const scene=remixBackdrop(state,()=>v,kind);
     assert.ok((kind==="all"?backdropModes:kind==="new"?
       newBackdropModes:funkyBackdropModes).includes(scene.backdropMode));
     assert.notEqual(scene.backdropMode,state.backdropMode);
     assert.ok(scene.backdropAmount>0);
     preserve(scene);
     assert.deepEqual(scene,remixBackdrop(state,()=>v,kind));
     assert.deepEqual(validateRecipe(scene),scene);
   }
 }
});
test("renderer cache keys, optional GLSL fallback, mobile pickers and Find are connected",()=>{
 const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
 const ui=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
 assert.ok(renderer.includes('withBackdrop ? "backdrop"+backdropModes.indexOf(s.backdropMode)'));
 assert.ok(renderer.includes('specializeBackdropGLSL('));
 assert.ok(renderer.includes('specializePhotonGeometry('));
 assert.ok(renderer.includes('backdropUnavailable=true'));
 assert.ok(renderer.includes('photonUnavailable=true'));
 assert.ok(renderer.includes('col=livingBackdrop(col,uv,v);'));
 assert.ok(renderer.includes('col=livingPhotonZoo(col,uv,p,v);'));
 for(const term of ["backdropFamilies.map(family=>",
   "photonSpeciesFamilies.map(family=>",
   "backdropDescriptions[s.backdropMode]",
   "Shuffle all backdrops","Shuffle new atmospheres",
   "Shuffle paranormal habitats","Shuffle funky cosmic optics",
   "Spawn this atmosphere"]){
   assert.ok(ui.includes(term),term);
 }
 for(const name of weirdPhotons)
   assert.ok(findControls(name).some(x=>x.id==="photon"),name);
 for(const name of weirdBackdrops)
   assert.ok(findControls(name).some(x=>x.id==="backdrop"),name);
 assert.equal(sectionMeta("backdrop").group,"Worlds");
 assert.equal(sectionActive(sectionMeta("backdrop"),initial),false);
 assert.equal(sectionActive(sectionMeta("photon"),initial),false);
 const surprise=randomize(state,{},false,()=>.55);
 assert.ok(photonSpecies.includes(surprise.photonSpecies));
 assert.ok(backdropModes.includes(surprise.backdropMode));
});
test("new modes are off by default: old art does not grow effects by itself",()=>{
 assert.equal(initial.backdropAmount,0);
 assert.equal(initial.photonAmount,0);
 const old={...initial};
 for(const key of ["backdropMode","backdropAmount","photonSpecies","photonAmount"])
   delete old[key];
 const restored=validateRecipe(old);
 assert.equal(restored.backdropAmount,0);
 assert.equal(restored.photonAmount,0);
 assert.equal(restored.backdropMode,legacyBackdrop[0]);
 assert.equal(restored.photonSpecies,legacyPhotons[0]);
});
