import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,recipeDocument,parseDocument} from "../src/data.js";
import {STARTER_TITLE,createNewCanvas} from "../src/new-canvas.js";

const read=path=>readFileSync(new URL("../src/"+path,import.meta.url),"utf8");

test("New Canvas restores the exact canonical starter, including marks, colors and all opt-in effects",()=>{
  const fresh=createNewCanvas();
  assert.notStrictEqual(fresh.state,initial);
  assert.deepEqual(fresh.state,initial);
  assert.equal(fresh.title,STARTER_TITLE);
  assert.equal(STARTER_TITLE,"Untitled exploration");
  assert.deepEqual(fresh.timeline,{time:0,colorTime:0,textTime:0});
  assert.equal(fresh.state.marks.length,0);
  assert.equal(fresh.state.g2Amount,0);
  assert.equal(fresh.state.breedAmount,0);
  assert.equal(fresh.state.hexagramAmount,0);
  assert.equal(fresh.state.seed,82491);
});

test("The starter is a deep fresh copy and cannot mutate canonical palettes or future canvases",()=>{
  const before=JSON.stringify(initial),first=createNewCanvas();
  first.state.colors[0]="#ffffff";
  first.state.marks.push({x:1,y:1,mode:"Warp"});
  first.state.seed=123;
  const second=createNewCanvas();
  assert.equal(JSON.stringify(initial),before);
  assert.deepEqual(second.state,initial);
  assert.notDeepEqual(first.state,second.state);
  assert.notStrictEqual(second.state.colors,initial.colors);
  assert.notStrictEqual(first.state.colors,second.state.colors);
  assert.notStrictEqual(first.state.marks,second.state.marks);
});

test("Fresh canvas saves and restores with a zeroed timeline through real recipe serialization",()=>{
  const fresh=createNewCanvas();
  const doc=recipeDocument(fresh.state,fresh.title,fresh.timeline);
  const fromJson=parseDocument(JSON.parse(JSON.stringify(doc)));
  assert.deepEqual(fromJson.state,fresh.state);
  assert.deepEqual(fromJson.timeline,fresh.timeline);
  assert.equal(fromJson.title,fresh.title);
});

test("New document reset clears both editing stacks and pending transactions",()=>{
  const history=read("useHistory.js");
  assert.match(history,/const reset = useCallback\(\(next\) => \{/);
  assert.match(history,/transaction\.current = null;/);
  assert.match(history,/stacks\.current = \{ past: \[\], future: \[\] \};/);
  assert.match(history,/update\(typeof next === "function" \? next\(current\.current\) : next\)/);
  assert.match(history,/\n    reset,\n    begin,/);
  assert.match(history,/setRevision\(\(x\) => x \+ 1\);/);
});

test("Reset is gated by a native confirmation dialog and never changes saved libraries",()=>{
  const app=read("main.jsx"),css=read("style.css");
  assert.match(app,/className="new-canvas-button"/);
  assert.match(app,/onClick=\{\(\) => setModal\("new-canvas"\)\}/);
  assert.match(app,/\{modal === "new-canvas" && \(/);
  assert.match(app,/title="Start a NEW CANVAS\?"/);
  assert.match(app,/Cancel — keep my art/);
  assert.match(app,/onClick=\{confirmNewCanvas\}/);
  assert.match(app,/history\.reset\(fresh\.state\)/);
  assert.match(app,/timelineRef\.current=\{\.\.\.fresh\.timeline\}/);
  assert.match(app,/setTitle\(fresh\.title\)/);
  assert.match(app,/saveDraft\(fresh\.state,fresh\.title,fresh\.timeline\)/);
  assert.match(app,/setTool\("Paint"\)/);
  assert.match(app,/setHandles\(false\)/);
  assert.match(app,/setSelected\(null\)/);
  assert.doesNotMatch(app,/storeCollection\(\[\]\)/);
  assert.doesNotMatch(app,/setSaved\(\[\]\)/);
  assert.doesNotMatch(app,/localStorage\.removeItem\("glitch-saved"\)/);
  assert.match(css,/\.workspace-bottom > \.new-canvas-button/);
  assert.match(css,/\.new-canvas-confirm-actions/);
});
