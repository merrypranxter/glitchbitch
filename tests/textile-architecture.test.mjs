import test from "node:test";
import assert from "node:assert/strict";
import {initial,validateRecipe,recipeDocument,parseDocument} from "../src/data.js";
import {textileArchitectureModes,textileArchitectureControls,remixTextileArchitecture,filamentGLSL} from "../src/filament-forge.js";
import {textileGroup,protectWeaving} from "../src/weaving-wardrobe.js";
import {remixWeavingSystem} from "../src/weaving-randomizer.js";
import {readFileSync} from "node:fs";
test("parasitic architecture is opt-in, separately lockable and recipe-safe",()=>{
 assert.equal(initial.filamentArchitecture,"Bare architecture");
 assert.equal(textileArchitectureModes.length,17);
 assert.deepEqual(textileArchitectureModes.slice(9),["Möbius membrane","Klein bottle labyrinth","Gyroid labyrinth","Riemann branched sheets","Hopf fiber bundle","Hyperbolic skeletal net","Rotating tesseract lattice","Torus knot cathedral"]);
 for(let i=1;i<textileArchitectureModes.length;i++){
  const s=remixTextileArchitecture(initial,()=>((i-.5)/(textileArchitectureModes.length-1)));
  assert.equal(s.filamentArchitecture,textileArchitectureModes[i]);
  assert.doesNotThrow(()=>validateRecipe(s));
  assert.deepEqual(parseDocument(recipeDocument(s,"architecture",{time:0,colorTime:0})).state,s);
  assert.ok(filamentGLSL.includes("arMode=="+i+"){"));
  for(const k of Object.keys(initial).filter(k=>!textileArchitectureControls.includes(k)))assert.deepEqual(s[k],initial[k],k);
  assert.deepEqual(protectWeaving(initial,s,["architecture"]),initial);
 }
 for(const k of textileArchitectureControls)assert.equal(textileGroup(k),"architecture");
 assert.deepEqual(remixWeavingSystem(initial,"architecture",()=>.5),remixTextileArchitecture(initial,()=>.5));
});
test("architecture shader has independent specialization, carrier support and uniforms",()=>{
 const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
 assert.match(renderer,/withTextileArchitecture\?"textile-architecture"/);
 assert.match(renderer,/#define FILAMENT_ARCHITECTURE 1/);
 assert.match(renderer,/#define filamentArchitecture /);
 assert.match(filamentGLSL,/arSupport\*=reveal/);
 assert.match(filamentGLSL,/arWeight=arSupport\*arVisible\*filamentArchitectureAmount\*amount/);
 for(const k of textileArchitectureControls.slice(1))assert.ok(renderer.includes('"'+k+'"'),k);
});

test("topology shaders retain bounded support and WebGL1-compatible projected edges",()=>{
 assert.match(filamentGLSL,/sin\(v\.x\)\*cos\(v\.y\)\+sin\(v\.y\)\*cos\(v\.z\)\+sin\(v\.z\)\*cos\(v\.x\)/);
 const edge=filamentGLSL.split("else if(arMode==15){")[1].split("else if(arMode==16){")[0];
 assert.match(edge,/ei<4/);
 assert.match(edge,/vi<8/);
 assert.doesNotMatch(edge,/>>|<</);
 assert.match(edge,/dot\(d,e\)\/max\(dot\(e,e\),\.00001\)/);
});
