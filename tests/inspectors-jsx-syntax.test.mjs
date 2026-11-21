import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {transformWithEsbuild} from "vite";

test("Inspectors JSX compiles, including the Underlay description guard",async()=>{
  const jsx=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
  assert.match(jsx,
    /\{underlayDescriptions\[s\.underlayMode\]\s*&&\s*\(\s*<p className="control-note">\{underlayDescriptions\[s\.underlayMode\]\}<\/p>\s*\)\}/);
  const result=await transformWithEsbuild(jsx,"src/components/Inspectors.jsx",
    {loader:"jsx"});
  assert.ok(result.code.length>1000,"Inspector component should transform");
});
