import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {selectionGLSL} from "../src/selection-chamber.js";
import {successionGLSL} from "../src/ecological-succession.js";
import {symbiosisGLSL} from "../src/symbiosis-lab.js";

// These words are illegal GLSL ES identifiers, even though they work in JS.
// The export renderer concatenates many GLSL modules into one large shader;
// a single illegal name prevents ALL selected effects from compiling.
const reserved=new Set([
  "resource","active","input","output","filter","partition","common",
  "class","union","enum","typedef","template","this","packed",
  "goto","inline","noinline","volatile","public","static","extern",
  "external","interface","long","short","double","half","fixed",
  "unsigned","superp","sizeof","cast","namespace","using",
  "buffer","shared","coherent","restrict","readonly","writeonly",
  "subroutine","patch","sample"
]);
function cleanGLSL(text){
  return text.replace(/\/\*[\s\S]*?\*\//g," ").replace(/\/\/[^\n]*/g," ");
}
function declarations(glsl){
  const stripped=cleanGLSL(glsl), names=[];
  // Match typed variable declarations and typed function parameters,
  // excluding ordinary English prose and valid JS identifiers.
  const declaration=/\b(?:float|int|uint|bool|vec[234]|ivec[234]|bvec[234]|mat[234](?:x[234])?|sampler\w*)\s+([A-Za-z_]\w*)/g;
  for(const m of stripped.matchAll(declaration))
    if(reserved.has(m[1]))names.push({name:m[1],position:m.index});
  return names;
}
test("all static exported GLSL modules avoid reserved identifiers",()=>{
  // Audit exactly the modules assembled by the shared preview/export renderer.
  const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
  const imports=[...new Set([...renderer.matchAll(/from ["']\.\/([^"']+\.js)["']/g)]
    .map(m=>m[1]))];
  // The renderer also builds GLSL in inline template literals.
  assert.deepEqual(declarations(renderer),[],
    "renderer.js inline GLSL contains a reserved variable");
  let scanned=0;
  for(const file of imports){
    const source=readFileSync(new URL("../src/"+file,import.meta.url),"utf8");
    const glslDefs=/\b(?:export\s+)?(?:const|let)\s+(\w*GLSL)\s*=\s*\x60([\s\S]*?)\x60/g;
    for(const match of source.matchAll(glslDefs)){
      scanned++;
      assert.deepEqual(declarations(match[2]),[],
        file+" / "+match[1]+" contains a GLSL reserved variable");
    }
  }
  assert.ok(scanned>=15,"shader audit must actually scan modules");
});
test("Selection Chamber's fitness calculation has unchanged algebra and legal names",()=>{
  assert.match(selectionGLSL,/float adaptiveFitness\(float allele,float nutrientLevel,float parent\)/);
  assert.match(selectionGLSL,/1\.-abs\(allele-nutrientLevel\)/);
  assert.match(selectionGLSL,/mix\(1\.-nutrientLevel,nutrientLevel,affinity\)/);
  assert.deepEqual(declarations(selectionGLSL),[]);
});
test("Ecological Succession keeps the same nutrient evolution math with legal names",()=>{
  assert.match(successionGLSL,/float successionResource\(vec2 uv,float original\)/);
  assert.match(successionGLSL,/float nutrientLevel=original;/);
  assert.match(successionGLSL,/polarity=\(1\.-2\.\*nutrientLevel\)\*\.78;/);
  assert.match(successionGLSL,/nutrientLevel=clamp\(nutrientLevel\+weight\*pressure\*polarity,0\.,1\.\);/);
  assert.match(successionGLSL,/return nutrientLevel;/);
  assert.deepEqual(declarations(successionGLSL),[]);
});
test("Symbiosis' contact shading keeps its identical formula with legal names",()=>{
  assert.match(symbiosisGLSL,/float contactRim=4\.\*a\*\(1\.-a\)\+4\.\*b\*\(1\.-b\);/);
  assert.match(symbiosisGLSL,/tissue=lesions\*\(\.35\+\.65\*contactRim\*\.40\)/);
  assert.deepEqual(declarations(symbiosisGLSL),[]);
});
test("reserved-word regression catches resource and active before export",()=>{
  assert.deepEqual(declarations("float resource=0.; float active=1.; float interface=2.;").map(x=>x.name),
    ["resource","active","interface"]);
  assert.deepEqual(declarations("float safeNutrient=0.; // float resource=1.\n"),[]);
  assert.deepEqual(declarations("/* float active=1.; */ float validSignal=0.;"),[]);
});
