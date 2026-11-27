import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const rendererPath=fileURLToPath(new URL("../src/renderer.js",import.meta.url));
test("Renderer parses as an ES module, including distinct imported shader bindings",()=>{
 const result=spawnSync(process.execPath,["--check",rendererPath],{encoding:"utf8"});
 assert.equal(result.status,0,result.stderr||String(result.error||""));
});
test("Chromatic and biological symbiosis retain independent shader insertion sites",()=>{
 const source=readFileSync(rendererPath,"utf8");
 assert.ok(source.includes('symbiosisGLSL as chromaticSymbiosisGLSL} from "./chromatic-symbiosis.js"'));
 assert.ok(source.includes('${chromaticSymbiosisGLSL}'));
 assert.ok(source.includes('withSymbiosis?symbiosisGLSL:""'));
 assert.ok(source.includes('chromaticFragmentRow=chromaticStructuralRow(chromaticFragmentRow,v,p);'));
});
