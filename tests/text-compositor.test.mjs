import test from "node:test";
import assert from "node:assert/strict";
import { hasVisibleLettering, paintLettering } from "../src/text-compositor.js";

// Minimal Canvas2D harness. A real browser/iPhone runs the same compositor.
function fakeCanvas() {
  const drawn = [];
  const ctx = {
    font: "", lineJoin: "", textAlign: "", textBaseline: "",
    measureText: text => ({ width: String(text).length * 32 }),
    clearRect() {},
    fillText(text) { drawn.push(text); },
    strokeText() {},
    drawImage() { drawn.push("composite"); },
    save() {}, restore() {}, translate() {}, scale() {}, rotate() {}, setTransform() {},
  };
  return { drawn, ctx, canvas: { width: 0, height: 0, getContext: () => ctx } };
}
const base = {
  lettering: "Yo", letteringFont: "old-english", letteringAmount: 46,
  letteringFillMode: "Solid", letteringFill: "#ffffff", letteringStrokes: [],
  letteringScale: 48, letteringX: 50, letteringY: 50, letteringRotation: 0,
  letteringStretchX: 100, letteringStretchY: 100, letteringCurve: 0,
  letteringWarp: 40, letteringMotion: 55, letteringLayers: []
};
test("typed words paint over artwork using a 2D layer, even with distortion enabled", () => {
  const glyph = fakeCanvas(), preview = fakeCanvas();
  const original = globalThis.document;
  globalThis.document = { createElement: () => glyph.canvas };
  try {
    assert.equal(hasVisibleLettering(base), true);
    paintLettering(preview.ctx, base, { time: 1.7 }, 431, 431, true);
    assert.ok(glyph.drawn.includes("Yo"));
    assert.ok(preview.drawn.filter(x => x === "composite").length > 0);
  } finally { globalThis.document = original; }
});
test("empty and zero-opacity text are truly invisible", () => {
  assert.equal(hasVisibleLettering({ ...base, lettering: "", letteringAmount: 0 }), false);
  assert.equal(hasVisibleLettering({ ...base, letteringAmount: 0 }), false);
});
test("independent text layers remain visible when the first layer is empty", () => {
  const state = { ...base, lettering: "", letteringAmount: 0,
    letteringLayers: [{ ...base, text: "SECOND LINE", visible: true, letteringAmount: 85 }] };
  assert.equal(hasVisibleLettering(state), true);
});
