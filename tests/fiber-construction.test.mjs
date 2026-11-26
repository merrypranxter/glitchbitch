import test from "node:test";
import assert from "node:assert/strict";
import {initial,validateRecipe} from "../src/data.js";
import {fiberConstructionModes,fiberConstructionControls,remixFiberConstruction,filamentGLSL} from "../src/filament-forge.js";
import {textileGroup} from "../src/weaving-wardrobe.js";
test("construction is independently validated and locked",()=>{
 assert.equal(initial.filamentConstruction,"Original strand");
 for(const mode of fiberConstructionModes)assert.doesNotThrow(()=>validateRecipe({...initial,filamentConstruction:mode}));
 const n=remixFiberConstruction(initial,()=>.6);
 assert.doesNotThrow(()=>validateRecipe(n));
 for(const k of fiberConstructionControls)assert.equal(textileGroup(k),"construction");
 for(const k of Object.keys(initial).filter(k=>!fiberConstructionControls.includes(k)))assert.deepEqual(n[k],initial[k],k);
 assert.match(filamentGLSL,/core\*=mix\(1\.,clamp\(yarnCoverage/);
 for(let n=1;n<=8;n++)assert.ok(filamentGLSL.includes("filamentConstruction=="+n));
});
