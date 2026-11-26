import test from "node:test";
import assert from "node:assert/strict";
import {initial,validateRecipe} from "../src/data.js";
import {microloomModes,microloomControls,remixMicroloom,filamentGLSL} from "../src/filament-forge.js";
import {textileGroup} from "../src/weaving-wardrobe.js";
test("microloom modes and isolated shuffle are valid and separately lockable",()=>{
 assert.equal(initial.filamentMicroloom,"Plain strand interior");
 for(const mode of microloomModes)assert.doesNotThrow(()=>validateRecipe({...initial,filamentMicroloom:mode}));
 const next=remixMicroloom(initial,()=>.61);
 assert.doesNotThrow(()=>validateRecipe(next));
 for(const k of microloomControls)assert.equal(textileGroup(k),"microloom");
 for(const k of Object.keys(initial).filter(k=>!microloomControls.includes(k)))assert.deepEqual(next[k],initial[k],k);
 assert.match(filamentGLSL,/mlCoarse\.x\*mlFine\.x/);
 assert.match(filamentGLSL,/mlFineVisible/);
 for(let i=1;i<=8;i++)assert.ok(filamentGLSL.includes("filamentMicroloom=="+i));
});
