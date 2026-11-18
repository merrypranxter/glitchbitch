import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {initial,validateRecipe,randomize} from "../src/data.js";
import {photonSpecies,photonPresets,photonControlNames,photonPresetState,nextPhotonSpecies,photonGLSL} from "../src/photon-zoo.js";
test("Eight different optical art species and presets are defined",()=>{
 assert.equal(photonSpecies.length,8);
 assert.equal(new Set(photonSpecies).size,8);
 assert.equal(photonPresets.length,8);
 for(const p of photonPresets){
  assert.ok(photonSpecies.includes(p.species),p.name);
  for(const key of photonControlNames){
   assert.ok(Number.isFinite(p[key]),p.name+" "+key);
   assert.ok(p[key]>=0 && p[key]<=100,p.name+" range "+key);
  }
 }
});
test("Legacy artwork is never overpainted until photon intensity is enabled",()=>{
 assert.equal(initial.photonAmount,0);
 assert.equal(initial.photonSpecies,"Prism rosettes");
 const old={...initial};
 delete old.photonAmount;delete old.photonSpecies;delete old.photonScale;
 const result=validateRecipe(old);
 assert.equal(result.photonAmount,0);
 assert.equal(result.photonSpecies,"Prism rosettes");
});
test("Optical species changes and presets never damage existing art, words or palettes",()=>{
 const state={...initial,engine:5,seed:131,colors:["#00ffcc","#ed12cf"],marks:[{id:"m",x:.5,y:.5,power:.2,mode:0,radius:.3,angle:.4}],
   lettering:"NO ONE TOUCHES MY WORDS",photonAmount:0,photonSpecies:"Prism rosettes"};
 for(const p of photonPresets){
  const result=photonPresetState(state,p.name);
  assert.equal(result.photonSpecies,p.species);
  assert.ok(result.photonAmount>0);
  for(const key of ["engine","seed","colors","marks","lettering","ratio","letteringFormats"])
   assert.deepEqual(result[key],state[key],p.name+" should preserve "+key);
  const validated=validateRecipe(result);
  assert.equal(validated.photonSpecies,p.species);
 }
 assert.equal(photonPresetState(state,"unknown"),state);
 const next=nextPhotonSpecies(state,()=>0);
 assert.notEqual(next.photonSpecies,state.photonSpecies);
 assert.ok(next.photonAmount>=50);
});
test("Photon numeric values reject invalid values and species reject unknown names",()=>{
 assert.throws(()=>validateRecipe({...initial,photonAmount:102}),/Invalid photonAmount/);
 assert.throws(()=>validateRecipe({...initial,photonSpecies:"malicious shader"}),/Unknown photonSpecies/);
 assert.throws(()=>validateRecipe({...initial,photonRelief:NaN}),/Invalid photonRelief/);
});
test("Full Surprise and Mutate include new optical family and preserve existing state constraints",()=>{
 const state={...initial,photonSpecies:"Prism rosettes",photonAmount:82,photonVariation:10};
 const random=()=>.5;
 const surprise=randomize(state,{},false,random);
 assert.notEqual(surprise.photonSpecies,state.photonSpecies);
 assert.ok(surprise.photonAmount>0);
 const mutated=randomize(state,{},true,()=>.8);
 assert.ok(mutated.photonAmount>=state.photonAmount);
 assert.equal(mutated.photonSpecies,state.photonSpecies);
 assert.equal(mutated.lettering,state.lettering);
});
test("Shader code has eight species and uses existing time, palette and math coordinates",()=>{
 assert.match(photonGLSL,/vec3 livingPhotonZoo\(/);
 assert.match(photonGLSL,/uniform int photonSpecies;/);
 assert.match(photonGLSL,/uniform float photonAmount,photonScale,photonMotion,photonDensity/);
 assert.match(photonGLSL,/if\(photonSpecies==0\)/);
 assert.match(photonGLSL,/photonSpecies==6/);
 assert.match(photonGLSL,/vec3 pigment=palette\(/);
 assert.match(photonGLSL,/time\*/);
 assert.match(photonGLSL,/colorTime/);
 assert.doesNotMatch(photonGLSL,/texture2D\(/);
 assert.doesNotMatch(photonGLSL,/\bactive\b/);
});
test("Shader is optional, compiled per species, with a reversible failure fallback",()=>{
 const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
 const inspector=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
 assert.match(renderer,/withPhoton = s.photonAmount>0/);
 assert.match(renderer,/replace\("uniform int photonSpecies;"/);
 assert.match(renderer,/photonSpecies.indexOf\(s.photonSpecies\)/);
 assert.match(renderer,/photonUnavailable=true/);
 assert.match(renderer,/\{photonAmount:0\}/);
 assert.match(renderer,/col=livingPhotonZoo\(col,uv,p,v\);/);
 assert.match(inspector,/PHOTON ZOO — EIGHT LIVING OPTICAL CREATURES/);
 assert.match(inspector,/Spawn selected sculpture/);
 assert.match(inspector,/New creature, keep art/);
});
