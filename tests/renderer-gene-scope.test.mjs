import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {geneEnabled,packGeneMarker} from "../src/colony-genetics.js";

// This is an EXECUTING regression, not a source-only regex check. It lifts the
// actual draw-time habitat upload block into an isolated function; any
// out-of-scope reference (like the original 'withGene' crash) will throw.
const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
const drawStart=renderer.indexOf("    draw(s, timeline,");
assert.ok(drawStart>=0,"must extract from renderer.draw, not programFor");
const start=renderer.indexOf("      const geneMarkersEnabled=geneEnabled(compiledState);",drawStart);
assert.ok(start>drawStart,"gene mode must be defined inside renderer.draw");
const end=renderer.indexOf('      gl.uniform1i(loc("colonyLifeMode")',start);
assert.ok(end>start,"must include exactly the real habitat seed upload loop");
const uploadBlock=renderer.slice(start,end);
const upload=new Function("s","compiledState","habitatBuffer",
  "geneEnabled","packGeneMarker",
  uploadBlock+"\nreturn habitatBuffer.slice(0,8);"
);
const origin=[
  {id:"green",x:.23,y:.48,radius:.19,parent:0,gene:12},
  {id:"pink",x:.74,y:.55,radius:.23,parent:1,gene:93},
];
const activeState={
  seed:31831,geneAmount:92,atmoAmount:81,atmoBAmount:78,
  atmoMaskMode:"Painted colonies",atmoBMaskMode:"Painted colonies",
  habitatStamps:origin,
};
const draw=(state,compiled)=>upload(state,compiled,
  new Float32Array(64),geneEnabled,packGeneMarker);

test("actual renderer.draw habitat upload executes without undefined withGene",()=>{
  assert.doesNotThrow(()=>draw(activeState,activeState));
  const encoded=draw(activeState,activeState);
  assert.ok(Math.abs(encoded[0]-origin[0].x)<1e-6);
});

test("genetic shader receives encoded parent marker for A and B",()=>{
  const encoded=draw(activeState,activeState);
  assert.ok(Math.abs(encoded[3]-(.010+.075*.12))<1e-6);
  assert.ok(Math.abs(encoded[7]-(1+.010+.075*.93))<1e-6);
  assert.deepEqual(activeState.habitatStamps,origin);
});

test("dormant gene shader receives original unmodified parent marker",()=>{
  const sleepy={...activeState,geneAmount:0};
  const encoded=draw(sleepy,sleepy);
  assert.equal(encoded[3],0);
  assert.equal(encoded[7],1);
});

test("shader fallback matches compiled program rather than unmodified requested state",()=>{
  const fallback={...activeState,atmoAmount:0,atmoBAmount:0};
  assert.equal(geneEnabled(activeState),true);
  assert.equal(geneEnabled(fallback),false);
  const encoded=draw(activeState,fallback);
  assert.equal(encoded[3],0);
  assert.equal(encoded[7],1);
});

test("shader and upload gating both use same successfully compiled candidate",()=>{
  assert.match(renderer,/let compiledState=s;/);
  assert.match(renderer,/active=programFor\(candidate\);\s*compiledState=candidate;/);
  assert.match(renderer,/const geneMarkersEnabled=geneEnabled\(compiledState\);/);
  assert.match(renderer,/packGeneMarker\(m,geneMarkersEnabled\)/);
  assert.doesNotMatch(uploadBlock,/\bwithGene\b/);
});
