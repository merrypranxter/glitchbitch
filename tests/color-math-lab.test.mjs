import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {
 colorMathModes,colorMathFamilies,colorMathDescriptions,colorMathPresets,
 applyColorMathPreset,remixColorMath,disableColorMath,specializeColorMathGLSL
} from "../src/color-math-lab.js";
import {initial,validateRecipe,recipeDocument,parseDocument,randomize} from "../src/data.js";
import {sections,findControls} from "../src/ui-index.js";

const src=(name)=>readFileSync(new URL("../src/"+name,import.meta.url),"utf8");
const selected=[
 "RGB Cube Folding","OKLab Opponent Mirror","Hue Origami",
 "Modular Color Arithmetic","Möbius Chroma","Julia Set Color Dynamics",
 "Strange Attractor Dye","Chromatic Bifurcation","Color-Space Kaleidoscope",
 "Spectral Counterfeit","Recursive Color Automaton"
];
const signatures=[
 "cmFold(p.r","float theta=spin","float hue=atan(ab","float scale=1.5",
 "vec2 den=cmComplexMul","vec2 c=vec2(-.75","float a=-2.0",
 "float rate=3.1","vec3 p=original-.5","float spectral=fract","float count=5.0"
];
const balance=s=>(s.match(/\{/g)||[]).length-(s.match(/\}/g)||[]).length;
test("all 11 selected color laws are present, distinct, described, and offered once",()=>{
 assert.deepEqual(colorMathModes,["Off",...selected]);
 assert.deepEqual([...new Set(colorMathFamilies.flatMap(g=>g.modes))],colorMathModes);
 assert.equal(colorMathFamilies.flatMap(g=>g.modes).length,colorMathModes.length);
 assert.equal(colorMathPresets.length,11);
 for(const name of colorMathModes)assert.ok(colorMathDescriptions[name],name);
 for(const name of selected)assert.equal(
   colorMathPresets.filter(p=>p.colorMathMode===name).length,1,name);
});
test("one selected shader law at a time: Off is absent, no untouched alternate modes",()=>{
 assert.equal(specializeColorMathGLSL(0),"");
 assert.equal(specializeColorMathGLSL(-1),"");
 assert.equal(specializeColorMathGLSL(12),"");
 for(let i=1;i<colorMathModes.length;i++){
   const shader=specializeColorMathGLSL(i);
   assert.ok(shader.includes(signatures[i-1]),"selected signature "+i);
   assert.ok(!shader.includes("/* COLOR_MATH_LAW */"));
   assert.ok(!shader.includes("colorMathModes"));
   assert.ok(shader.includes("cmToLab("));
   assert.ok(shader.includes("colorMathPreserveLuma"));
   assert.ok(shader.includes("return mix(base,altered"),"slider mix");
   assert.equal(balance(shader),0,"GLSL braces "+i);
   for(let j=0;j<signatures.length;j++)
     if(j!==i-1)assert.ok(!shader.includes(signatures[j]),"unselected law "+(j+1)+" leaked into "+i);
 }
});
test("presets retain the rest of the artwork and validate, including older recipes",()=>{
 const original={...initial,filamentAmount:87,filamentSpecies:"Möbius cable",
   colors:["#ff11ee","#00fafa"],lettering:"LET COLOR RUN WILD"};
 assert.equal(original.colorMathMode,"Off");
 assert.equal(original.colorMathAmount,0);
 const old={...original};
 for(const key of ["colorMathMode","colorMathAmount","colorMathDepth",
   "colorMathMotion","colorMathVariation","colorMathPreserveLuma"])delete old[key];
 const restored=validateRecipe(old);
 assert.equal(restored.colorMathMode,"Off");
 assert.equal(restored.colorMathAmount,0);
 for(const p of colorMathPresets){
   const changed=applyColorMathPreset(original,p.name);
   assert.equal(changed.filamentSpecies,original.filamentSpecies);
   assert.equal(changed.filamentAmount,original.filamentAmount);
   assert.deepEqual(changed.colors,original.colors);
   assert.equal(changed.lettering,original.lettering);
   assert.equal(validateRecipe(changed).colorMathMode,p.colorMathMode);
   const doc=recipeDocument(changed,"Chromatic test",{time:1.25,colorTime:.8,textTime:0});
   assert.equal(parseDocument(doc).state.colorMathMode,p.colorMathMode);
   assert.equal(parseDocument(doc).state.colorMathAmount,p.colorMathAmount);
   assert.equal(disableColorMath(changed).colorMathAmount,0);
   assert.equal(disableColorMath(changed).filamentAmount,87);
 }
 assert.throws(()=>validateRecipe({...original,colorMathMode:"dangerous invalid shader"}),/Unknown colorMathMode/);
 assert.throws(()=>validateRecipe({...original,colorMathAmount:101}),/Invalid colorMathAmount/);
});
test("independent color-law shuffles are bounded, can target wild modes, preserve structure",()=>{
 for(const n of [0,.19,.55,.99999]){
  for(const wild of [true,false]){
    const original={...initial,filamentAmount:82,seed:12345,lettering:"VIBRATE",colorMathMode:"Off"};
    const s=remixColorMath(original,()=>n,wild);
    assert.ok(colorMathModes.includes(s.colorMathMode));
    if(wild)assert.ok(colorMathModes.slice(5).includes(s.colorMathMode));
    assert.ok(s.colorMathAmount>0&&s.colorMathAmount<=100);
    assert.equal(s.seed,original.seed);
    assert.equal(s.lettering,original.lettering);
    assert.equal(s.filamentAmount,original.filamentAmount);
    assert.equal(validateRecipe(s).colorMathMode,s.colorMathMode);
  }
 }
 assert.equal(applyColorMathPreset(initial,"not a preset"),initial);
});
test("Color tab, Find, Reset, Surprise and Mutate are connected",()=>{
 const meta=sections.find(s=>s.id==="colorMath");
 assert.equal(meta.tab,"Color");
 assert.ok(meta.reset.includes("colorMathMode"));
 assert.ok(meta.reset.includes("colorMathPreserveLuma"));
 assert.ok(findControls("mobius chroma").some(x=>x.id==="colorMath"));
 assert.ok(findControls("lut").some(x=>x.id==="colorMath"));
 const ui=src("components/ColorLab.jsx"),data=src("data.js");
 for(const needle of ["id=\"colorMath\"","applyColorMathPreset(","remixColorMath(",
   "Restore original colors","colorMathPreserveLuma","colorMathVariation"])
   assert.ok(ui.includes(needle),needle);
 for(const needle of ["colorMathMode=random()<.45","colorMathAmount=s.colorMathMode",
   "colorMathMode: colorMathModes","key.startsWith(\"colorMath\")"])
   assert.ok(data.includes(needle),needle);
 const changed=applyColorMathPreset(initial,colorMathPresets[0].name);
 const mutated=randomize(changed,{},true,()=>.42);
 assert.equal(mutated.colorMathMode,changed.colorMathMode);
 assert.ok(mutated.colorMathAmount>0);
});
test("same strict shader pipeline for live and PNG/GIF/MP4 with no alternate color pass",()=>{
 const renderer=src("renderer.js");
 assert.ok(renderer.includes('withColorMath = s.colorMathAmount>0 && s.colorMathMode!=="Off"'));
 assert.ok(renderer.includes("specializeColorMathGLSL(colorMathModes.indexOf(s.colorMathMode))"));
 assert.ok(renderer.includes('withColorMath?"col=applyColorMath(col);":""'));
 assert.ok(renderer.includes("/* COLOR_MATH_MODULE */"));
 assert.ok(renderer.includes("/* COLOR_MATH_POST */"));
 assert.ok(renderer.includes('gl.uniform1f(loc("colorMathPreserveLuma")'));
 for(const k of ["colorMathAmount","colorMathDepth","colorMathMotion","colorMathVariation"])
   assert.ok(renderer.includes('"'+k+'"'),k);
 // The post runs after appearance, so all shader-based artwork participates.
 assert.ok(renderer.indexOf("col=applyAppearance(col,uv);")<
           renderer.indexOf("/* COLOR_MATH_POST */"));
 assert.ok(renderer.includes("exactEffects"));
 assert.ok(renderer.includes("specializeFilamentGeometry"));
 const exportCode=src("export.js");
 assert.ok(exportCode.includes("exactEffects"),"strict export contract must remain");
});
