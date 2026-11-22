import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial} from "../src/data.js";
import {hasSemanticLettering} from "../src/semantic-gravity.js";
import {paintLettering} from "../src/text-compositor.js";

const read=p=>readFileSync(new URL("../src/"+p,import.meta.url),"utf8");
const live=read("ArtCanvas.jsx");
const output=read("export.js");
const shader=read("renderer.js");
const sample={...initial,lettering:"I AM MOVING",letteringAmount:92,
  letteringMotion:85,letteringWarp:63,
  filamentAmount:91,semanticGravityMode:"Typographic vortex",
  semanticGravityAmount:88,freezeGeometry:true,freezeColor:true,
  speed:0,colorSpeed:0};

test("a real authored word and active semantic force require independent text clock redraw",()=>{
  assert.ok(hasSemanticLettering(sample));
  assert.match(live,/import \{hasSemanticLettering\} from "\.\/semantic-gravity\.js"/);
  assert.match(live,/const textDrivenFilaments=hasSemanticLettering\(state\)/);
  assert.match(live,/\(!state\.freezeColor && state\.colorSpeed > 0\) \|\|\s*textDrivenFilaments/);
  assert.match(live,/timelineRef\.current\.textTime=\(timelineRef\.current\.textTime \|\| 0\)\+dt/);
});
test("scrubbing just text time redraws the GPU while paused/frozen",()=>{
  assert.match(live,/lastTextTime = -1/);
  assert.match(live,/lastTextTime !== \(timelineRef\.current\.textTime \|\| 0\)/);
  assert.match(live,/lastTextTime = timelineRef\.current\.textTime \|\| 0;/);
  assert.match(live,/lastTime !== timelineRef\.current\.time/);
  assert.match(live,/lastColorTime !== timelineRef\.current\.colorTime/);
});
test("no visible author glyphs preserves the old still-frame performance path",()=>{
  assert.equal(hasSemanticLettering({...sample,letteringAmount:0}),false);
  assert.equal(hasSemanticLettering({...sample,semanticGravityMode:"Off"}),false);
  assert.equal(hasSemanticLettering({...sample,filamentAmount:0}),false);
  assert.equal(hasSemanticLettering({...sample,lettering:"  "}),false);
  assert.equal(hasSemanticLettering({...sample,letteringAmount:0,
    letteringLayers:[{visible:true,text:"SECOND LAYER",letteringAmount:70}]}),true);
});
test("live/export share textTime and the same author-glyph source",()=>{
  assert.equal(typeof paintLettering,"function");
  assert.match(shader,/paintLettering\(semanticGlyphContext,glyphLayoutState,timeline,maskW,maskH,true\)/);
  assert.match(output,/textTime: Math\.max\(0, \(timeline\.textTime \|\| 0\) \+ seconds\)/);
  assert.match(output,/work\.render\(i \/ fps\)/);
  assert.match(output,/paintLettering\(ctx, state, frameClock, size\.width, size\.height\)/);
  assert.match(live,/renderer\.draw\(state, timelineRef\.current, dims\.width, dims\.height\)/);
});
test("preview still throttles recoverable GPU errors instead of retry-spinning",()=>{
  assert.match(live,/retryAllowed &&\s*renderer\.ready\(\)/);
  assert.match(live,/renderRetryAt=now\+1800/);
  assert.match(live,/frame=requestAnimationFrame\(tick\);\s*return;/);
  assert.match(live,/failedFontRevision!==fontRevision/);
});
