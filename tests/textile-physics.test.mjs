import test from "node:test";
import assert from "node:assert/strict";
import {initial,validateRecipe} from "../src/data.js";
import {textilePhysicsModes,textilePhysicsControls,remixTextilePhysics,filamentGLSL} from "../src/filament-forge.js";
import {textileGroup} from "../src/weaving-wardrobe.js";
test("physics modes and isolated shuffle remain valid and separately lockable",()=>{
 assert.equal(initial.filamentPhysics,"Stable threads");
 for(const mode of textilePhysicsModes)assert.doesNotThrow(()=>validateRecipe({...initial,filamentPhysics:mode}));
 const next=remixTextilePhysics(initial,()=>.61);
 assert.doesNotThrow(()=>validateRecipe(next));
 for(const k of textilePhysicsControls)assert.equal(textileGroup(k),"physics");
 for(const k of Object.keys(initial).filter(k=>!textilePhysicsControls.includes(k)))assert.deepEqual(next[k],initial[k],k);
 assert.match(filamentGLSL,/threadD=max\(0\.,mix\(fpOriginal,fpTarget,fpBlend\)\)\*width/);
 for(let i=1;i<=8;i++)assert.ok(filamentGLSL.includes("filamentPhysics=="+i));
});
