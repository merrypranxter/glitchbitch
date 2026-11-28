// Studio 6 contract: the iPhone layout gives the editor room by TUCKING
// controls away (⋯ More sheet, one-row tab bar, zoom pill), never by
// deleting them. These checks fail loudly if a future change drops one.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (p) => readFileSync(new URL("../src/" + p, import.meta.url), "utf8");
const app = read("main.jsx");
const canvas = read("ArtCanvas.jsx");
const css = read("style.css");
const sheetStart = app.indexOf("{moreOpen && isPhone && (");
const sheetEnd = app.indexOf('{modal === "new-canvas" && (');
const sheet = app.slice(sheetStart, sheetEnd);

test("phones get a ⋯ More sheet holding every control that left the screen", () => {
  assert.ok(sheetStart > 0 && sheetEnd > sheetStart, "More sheet is rendered by the app");
  assert.match(app, /className="icon-button more-button"/);
  assert.match(app, /aria-label="More options"/);
  for (const [what, pattern] of [
    ["title", /\{titleField\}/],
    ["seed", /\{seedField\}/],
    ["reseed", /\{reseedButton\}/],
    ["aspect ratio", /\{ratioField\}/],
    ["preview quality", /\{qualityField\}/],
    ["fps readout", /\{fpsReadout\}/],
    ["restart clocks", /onClick=\{restartClocks\}/],
    ["Lookbook", /setModal\("lookbook"\)/],
    ["New Canvas (still confirmed)", /aria-label="New Canvas \(confirmation required\)"[\s\S]*setModal\("new-canvas"\)/],
    ["Load recipe", /fileRef\.current\.click\(\)/],
    ["palette lock", /setLocks\(\(l\) => \(\{ \.\.\.l, color: !l\.color \}\)\)/],
    ["focus / big art", /setFocus\(\(x\) => !x\)/],
    ["fullscreen", /fromSheet\(fullscreen\)/],
    ["help guide", /setModal\("help"\)/],
    ["find a control", /setModal\("find"\)/],
  ]) assert.match(sheet, pattern, `${what} is reachable from the More sheet`);
});

test("wide screens keep the same controls exactly where they were", () => {
  for (const marker of [
    '{!isPhone && (\n              <div className="workspace-heading">',
    '{!isPhone && (\n              <div className="canvas-context">',
    '{!isPhone && (\n              <div className="workspace-bottom">',
    'className="button secondary load-button"',
    'className="icon-button help-button"',
    'className="new-canvas-button"',
    'title="Restart animation clocks"',
    'title="Fullscreen artwork"',
  ]) assert.ok(app.includes(marker), marker);
  // Each moved control renders in ONE place at a time (no duplicate ids).
  assert.equal(app.split("{seedField}").length - 1, 2);
  assert.equal(app.split('id="seed"').length - 1, 1);
});

test("phone play row carries Mutate, Weird and Surprise me; Save sits by Export", () => {
  const transport = app.slice(app.indexOf('<div className="transport">'), app.indexOf("{!isPhone && (\n              <div className=\"workspace-bottom\">"));
  assert.match(transport, /\{isPhone && \(\s*<div className="mobile-chaos">/);
  assert.match(transport, /onClick=\{\(\) => surprise\(true\)\}/);
  assert.match(transport, /onClick=\{freakshow\}/);
  assert.match(transport, /Surprise me/);
  assert.match(transport, /title="Undo"/);
  assert.match(transport, /title="Redo"/);
  assert.match(app, /\{isPhone && page === "Studio" && saveButton\}/);
  assert.match(app, /\{!isPhone && saveButton\}/);
});

test("all ten categories fit in ONE tab row with distinct icons and full accessible names", () => {
  const bar = app.slice(app.indexOf('<div className="mobile-controls"'), app.indexOf('className={\n              "right-panel inspector'));
  const names = [...bar.matchAll(/\["(\w+)", (\w+)\]/g)].map((m) => [m[1], m[2]]);
  assert.deepEqual(names.map((n) => n[0]), ["Math", "Color", "Effects", "Ecosystem", "Weaving", "Toppers", "Lifeforms", "Text", "Touch", "Layers"]);
  assert.equal(new Set(names.map((n) => n[1])).size, 10, "every category has its own icon");
  assert.match(bar, /aria-label=\{t\}/);
  assert.match(css, /\.studio-page>\.studio-main>\.mobile-controls\{order:3;flex:none;display:grid;grid-template-columns:repeat\(10,minmax\(0,1fr\)\)/);
  assert.doesNotMatch(css, /mobile-controls\{grid-template-columns:repeat\(4,/, "no more three-row grid");
});

test("artwork preview zooms and pans without touching recipes or exports", () => {
  assert.match(canvas, /from "\.\/view-zoom\.js"/);
  assert.match(canvas, /translate3d\(\$\{view\.x\}px, \$\{view\.y\}px, 0\) scale\(\$\{view\.zoom\}\)/);
  assert.match(canvas, /aria-label="Pan and zoom mode"/);
  assert.match(canvas, /aria-label="Zoom in"/);
  assert.match(canvas, /aria-label="Zoom out"/);
  assert.match(canvas, /if \(panModeRef\.current \|\| viewGesture\.current\) return;/, "pan mode yields the canvas");
  assert.match(canvas, /stage\.addEventListener\("wheel", wheel, \{ passive: false \}\)/);
  // Zoom never writes into the artwork document.
  assert.doesNotMatch(canvas, /history\.(change|preview)\([^)]*zoom/);
  assert.match(css, /\.art-stage \{\n  touch-action: none;/);
});
