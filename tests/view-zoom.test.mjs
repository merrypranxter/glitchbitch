import test from "node:test";
import assert from "node:assert/strict";
import {
  MIN_ZOOM, MAX_ZOOM, FIT_VIEW, clampZoom, clampView, zoomAt, pinchView, panBy, stepZoom,
  isFit, zoomLabel, renderScaleForZoom,
} from "../src/view-zoom.js";

// A square 300px artwork in a wide 400×300 stage (like a phone pane).
const bounds = { stageW: 400, stageH: 300, surfaceW: 300, surfaceH: 300 };

test("zoom is clamped to a sane range and bad input falls back to fit", () => {
  assert.equal(clampZoom(0.01), MIN_ZOOM);
  assert.equal(clampZoom(99), MAX_ZOOM);
  assert.equal(clampZoom(NaN), 1);
  assert.equal(clampZoom(undefined), 1);
  assert.deepEqual(clampView(undefined, bounds), FIT_VIEW);
});

test("at fit (or smaller) the artwork stays centered and cannot be dragged away", () => {
  assert.deepEqual(panBy(FIT_VIEW, 120, -80, bounds), { zoom: 1, x: 0, y: 0 });
  assert.deepEqual(panBy({ zoom: 0.5, x: 0, y: 0 }, 50, 50, bounds), { zoom: 0.5, x: 0, y: 0 });
});

test("zoomed in, panning stops exactly at the artwork edges", () => {
  // 2× → 600px surface in a 400×300 stage: ±100 horizontally, ±150 vertically.
  const v = panBy({ zoom: 2, x: 0, y: 0 }, 9999, -9999, bounds);
  assert.deepEqual(v, { zoom: 2, x: 100, y: -150 });
});

test("pinch/wheel zoom keeps the pixel under the finger fixed", () => {
  // Huge artwork in a tiny stage so edge clamping never interferes.
  const roomy = { stageW: 10, stageH: 10, surfaceW: 1000, surfaceH: 1000 };
  const focal = { x: 60, y: -40 };
  const before = { zoom: 1.5, x: 10, y: 5 };
  const after = zoomAt(before, 3, focal, roomy);
  // The artwork-local point under the finger is identical before and after.
  const local = (v) => ({ x: (focal.x - v.x) / v.zoom, y: (focal.y - v.y) / v.zoom });
  assert.equal(after.zoom, 3);
  assert.ok(Math.abs(local(after).x - local(before).x) < 1e-9);
  assert.ok(Math.abs(local(after).y - local(before).y) < 1e-9);
});

test("pinch spreads to zoom and drags with the fingers' midpoint", () => {
  const roomy = { stageW: 10, stageH: 10, surfaceW: 1000, surfaceH: 1000 };
  const start = { zoom: 1, x: 0, y: 0 };
  // Fingers start 100px apart around (20,10), end 200px apart around (50,30).
  const v = pinchView(start, { x: 20, y: 10 }, 100, { x: 50, y: 30 }, 200, roomy);
  assert.equal(v.zoom, 2);
  // The artwork point that was under the starting midpoint is now under the new one.
  assert.ok(Math.abs((50 - v.x) / v.zoom - 20) < 1e-9);
  assert.ok(Math.abs((30 - v.y) / v.zoom - 10) < 1e-9);
  // Pinching closed past the minimum just clamps, it never flips or explodes.
  assert.equal(pinchView(start, { x: 0, y: 0 }, 100, { x: 0, y: 0 }, 1, bounds).zoom, MIN_ZOOM);
});

test("zooming back out to fit always re-centers the artwork", () => {
  const zoomed = zoomAt(FIT_VIEW, 4, { x: 150, y: 120 }, bounds);
  assert.ok(zoomed.x !== 0 || zoomed.y !== 0);
  assert.deepEqual(zoomAt(zoomed, 1, { x: -150, y: 0 }, bounds), FIT_VIEW);
  assert.ok(isFit(zoomAt(zoomed, 1, { x: 0, y: 0 }, bounds)));
});

test("+/− buttons walk friendly stops and stop at the limits", () => {
  assert.equal(stepZoom(1, +1), 1.5);
  assert.equal(stepZoom(1.5, +1), 2);
  assert.equal(stepZoom(1.7, +1), 2);
  assert.equal(stepZoom(1.7, -1), 1.5);
  assert.equal(stepZoom(1, -1), 0.75);
  assert.equal(stepZoom(MAX_ZOOM, +1), MAX_ZOOM);
  assert.equal(stepZoom(MIN_ZOOM, -1), MIN_ZOOM);
});

test("labels and render sharpness follow zoom without exceeding limits", () => {
  assert.equal(zoomLabel(1), "100%");
  assert.equal(zoomLabel(2.5), "250%");
  assert.equal(renderScaleForZoom(0.5), 1);
  assert.equal(renderScaleForZoom(2), 2);
  assert.equal(renderScaleForZoom(8), 4);
});
