import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,validateRecipe,recipeDocument,parseDocument} from "../src/data.js";
import {
 filamentSpecies,filamentSpeciesFamilies,xenoVascularSpecies,
 filamentPresets,filamentHybridPresets,filamentGLSL,
 remixXenoVascular,applyFilamentPreset,applyFilamentHybrid,
 specializeFilamentGeometry,
 nextFilamentSpecies,breedFilaments
} from "../src/filament-forge.js";
import {findControls} from "../src/ui-index.js";

const originalNames=["Fivefold brocade","Poincaré crochet",
  "Truchet knotwork","Voronoi lace","Spiral appliqué","Fractal veinwork"];
const additions=["Alien lattice","Alien scriptwork","Glyph swarm",
  "Xeno filament","Capillary bloom","Mycelial veinwork","Lightning lace",
  "Root filigree","Coral vasculature","Nerve net"];
test("preserves original indices while grouping every new mode exactly once",()=>{
 assert.deepEqual(filamentSpecies.slice(0,6),originalNames);
 assert.deepEqual(filamentSpecies.slice(6),additions);
 assert.deepEqual(xenoVascularSpecies,additions);
 const all=filamentSpeciesFamilies.flatMap(g=>g.species);
 assert.equal(all.length,16);
 assert.equal(new Set(all).size,16);
 assert.deepEqual(new Set(all),new Set(filamentSpecies));
 assert.equal(filamentPresets.length,16);
 assert.equal(new Set(filamentPresets.map(p=>p.species)).size,16);
});
test("all new presets are animated on selection and retain authored work",()=>{
 const original={...initial,seed:87832,engine:17,ratio:"9:16",
   lettering:"OTHERWORLDLY EMBROIDERY",
   colors:["#e600ff","#00ffff","#ffee00"],filamentMaterial:"Opaline glass",
   filamentCrossbreed:0};
 for(const mode of additions){
   const preset=filamentPresets.find(p=>p.species===mode);
   assert.ok(preset,"missing preset: "+mode);
   assert.ok(preset.filamentMotion>=40,mode);
   const applied=applyFilamentPreset(original,preset.name);
   assert.equal(applied.filamentSpecies,mode);
   assert.ok(applied.filamentAmount>=90);
   for(const key of ["lettering","colors","ratio","engine","seed","filamentMaterial"])
     assert.deepEqual(applied[key],original[key],mode+" "+key);
   assert.deepEqual(validateRecipe(applied),applied);
   assert.deepEqual(parseDocument(recipeDocument(applied,"Xeno",
     {time:3,colorTime:8})).state,applied);
 }
});
test("new species have distinct GLSL branches and drive original animation clock",()=>{
 const structure=filamentGLSL;
 for(let id=0;id<16;id++){
   const opening=id===0?"if(species==0)":"else if(species=="+id+")";
   assert.ok(structure.includes(opening),"missing geometry "+id);
 }
 for(let id=6;id<16;id++){
   const start=structure.indexOf("}else if(species=="+id+")");
   const next=id===15?structure.indexOf("}else{",start):
     structure.indexOf("}else if(species=="+(id+1)+")",start);
   assert.ok(start>=0&&next>start,"geometry section "+id);
   const body=structure.slice(start,next);
   assert.ok(/\bt\b|\btime\b/.test(body),"time-driven geometry "+id);
   assert.ok(body.includes("threadD="),"thread contour "+id);
   assert.ok(body.includes("phase="),"flow field "+id);
   assert.ok(body.includes("highlight="),"light cues "+id);
 }
 assert.ok(structure.includes("float t=time*(.14+filamentMotion*.72)+phaseOffset;"));
 assert.ok(!/\bactive\b|texture2D|texelFetch|fwidth/.test(structure));
 assert.equal([...structure].reduce((n,c)=>n+(c==="{")-(c==="}"),0),0);
});
test("targeted alien/vascular shuffle stays seeded and preserves artist choices",()=>{
 const original={...initial,filamentAmount:0,filamentMotion:0,
   filamentSpecies:"Alien lattice",lettering:"TEXT IS SACRED",
   colors:["#f000f0","#00ffee"],ratio:"9:16"};
 for(const n of [0,.11,.44,.88,.99]){
   const first=remixXenoVascular(original,()=>n);
   assert.deepEqual(first,remixXenoVascular(original,()=>n));
   assert.ok(additions.includes(first.filamentSpecies));
   assert.notEqual(first.filamentSpecies,original.filamentSpecies);
   assert.ok(first.filamentMotion>=36);
   assert.ok(first.filamentAmount>=73);
   assert.equal(first.lettering,original.lettering);
   assert.deepEqual(first.colors,original.colors);
   assert.equal(first.ratio,original.ratio);
   assert.deepEqual(validateRecipe(first),first);
 }
 const all=nextFilamentSpecies({...initial,filamentSpecies:"Fractal veinwork"},()=>.99);
 assert.ok(additions.includes(all.filamentSpecies));
 const bred=breedFilaments({...initial,filamentSpecies:"Alien scriptwork"},()=>.9);
 assert.ok(filamentSpecies.includes(bred.filamentSpecies));
 assert.ok(filamentSpecies.includes(bred.filamentSecondSpecies));
 assert.notEqual(bred.filamentSpecies,bred.filamentSecondSpecies);
});
test("new crossbreeding presets work without touching old art",()=>{
 assert.equal(filamentHybridPresets.length,8);
 for(const p of filamentHybridPresets.slice(-2)){
   assert.ok(additions.includes(p.first)&&additions.includes(p.second));
   const changed=applyFilamentHybrid({...initial,lettering:"HELLO ALIENS"},p.name);
   assert.equal(changed.lettering,"HELLO ALIENS");
   assert.deepEqual(validateRecipe(changed),changed);
 }
});
test("family controls and Find discover new species on mobile without extra shader system",()=>{
 const ui=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
 const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
 assert.ok(ui.includes("filamentSpeciesFamilies.map(family=>"));
 assert.ok(ui.includes("Shuffle alien + veinwork"));
 assert.ok(ui.includes("remixXenoVascular(x)"));
 assert.ok(findControls("alien scriptwork").some(x=>x.id==="filament"));
 assert.ok(findControls("coral vasculature").some(x=>x.id==="filament"));
 assert.ok(renderer.includes('filamentSpecies.indexOf(s.filamentSpecies)'));
 assert.ok(renderer.includes('filamentSpecies.indexOf(s.filamentSecondSpecies)'));
 assert.ok(renderer.includes('filamentUnavailable=true'));
});

test("Safari shaders include only the selected species, not sixteen at once",()=>{
 const one=specializeFilamentGeometry(filamentGLSL,5);
 assert.ok(one.includes("if(species==5){"));
 assert.ok(!one.includes("species==0"));
 assert.ok(!one.includes("species==6"));
 assert.ok(one.includes("vec3 livingFilamentForge"));
 assert.ok(one.length<filamentGLSL.length);
 const both=specializeFilamentGeometry(filamentGLSL,6,11);
 assert.ok(both.includes("if(species==6){"));
 assert.ok(both.includes("}else if(species==11){"));
 assert.ok(!both.includes("species==5"));
 assert.equal([...both].reduce((n,c)=>n+(c==="{")-(c==="}"),0),0);
 const same=specializeFilamentGeometry(filamentGLSL,8,8);
 assert.equal((same.match(/if\(species==8\)/g)||[]).length,1);
 assert.equal(specializeFilamentGeometry(filamentGLSL,-1),filamentGLSL);
 const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
 assert.ok(renderer.includes("specializeFilamentGeometry(rawFilament"));
 assert.ok(renderer.includes("const rawFilament=withFilament"));
});
