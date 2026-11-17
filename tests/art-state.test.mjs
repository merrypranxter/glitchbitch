import test from "node:test";
import assert from "node:assert/strict";
import {
  initial,
  parseDocument,
  recipeDocument,
  parsePalette,
  randomize,
  makeMark,
  palettes,
  looks,
} from "../src/data.js";
import { TouchSession } from "../src/gestures.js";
import { dimensions } from "../src/export.js";
test("old recipes retain all original values and gain editable touch-source identities", () => {
  const old = { ...initial, marks: [{ x: 0.4, y: 0.6, power: 0.6, mode: 1 }] };
  delete old.radius;
  delete old.blend;
  const doc = parseDocument({ state: old, time: 12.5 });
  assert.equal(doc.timeline.colorTime, 12.5);
  assert.equal(doc.state.marks[0].id, "legacy-0");
  assert.equal(doc.state.colors.join(), palettes[0].colors.join());
  assert.equal(doc.state.blend, 0);
});
test("complete recipe round trip preserves clocks, title, custom colors, and source shape", () => {
  const doc = recipeDocument(
    {
      ...initial,
      engine: 11,
      colors: ["#fa19ac", "#080811"],
      marks: [makeMark(initial)],
    },
    "Moon jelly",
    { time: 34.23, colorTime: 5.43 },
  );
  assert.deepEqual(parseDocument(JSON.parse(JSON.stringify(doc))), {
    state: doc.state,
    title: doc.title,
    timeline: doc.timeline,
  });
});
test("invalid seed, clock, color and source data cannot enter the renderer", () => {
  for (const bad of [
    { ...initial, seed: -1 },
    { ...initial, colors: ["#abc", "javascript:bad"] },
    { ...initial, marks: [{ ...makeMark(initial), radius: 8 }] },
    { ...initial, engine: 12 },
    { ...initial, blend: NaN },
  ])
    assert.throws(() => parseDocument(bad));
  assert.throws(() => parseDocument({ state: initial, time: Infinity }));
  const m = makeMark(initial);
  assert.throws(() => parseDocument({ ...initial, marks: [m, m] }));
});
test("palette import accepts hex lists and Coolors, preserves order, rejects extra garbage", () => {
  assert.deepEqual(parsePalette("#fa19ac, #080811\n#03e7ef"), [
    "#fa19ac",
    "#080811",
    "#03e7ef",
  ]);
  assert.deepEqual(parsePalette("https://coolors.co/fa19ac-080811-03e7ef"), [
    "#fa19ac",
    "#080811",
    "#03e7ef",
  ]);
  assert.throws(() => parsePalette("#ffcc00 nonsense #000000"));
});
test("randomization respects locks and preserves touch work and composition", () => {
  const source = { ...initial, marks: [makeMark(initial)], ratio: "9:16" },
    next = randomize(source, { engine: true, color: true }, false, () => 0.7);
  assert.equal(next.engine, source.engine);
  assert.deepEqual(next.colors, source.colors);
  assert.equal(next.marks, source.marks);
  assert.equal(next.ratio, source.ratio);
  assert.notEqual(next.seed, source.seed);
});
test("pinch enlarges and twists a real source; releasing one finger never paints a stray stroke", () => {
  const start = { ...initial, marks: [] },
    s = new TouchSession(start, "Paint", { id: 1, x: 0.4, y: 0.5 });
  s.add({ id: 2, x: 0.6, y: 0.5 });
  const before = s.draft.marks.at(-1);
  s.move({ id: 2, x: 0.7, y: 0.7 });
  const after = s.draft.marks.at(-1);
  assert.ok(after.radius > before.radius);
  assert.notEqual(after.angle, before.angle);
  const count = s.draft.marks.length;
  assert.equal(s.release(2), false);
  s.move({ id: 1, x: 0.2, y: 0.2 });
  assert.equal(s.draft.marks.length, count);
  assert.equal(s.release(1), true);
  assert.deepEqual(start.marks, []);
});
test("move and erase edit existing sources without changing their identity or creating new ones", () => {
  const m = makeMark(initial, 0.5, 0.5),
    base = { ...initial, marks: [m] },
    s = new TouchSession(base, "Move", { id: 1, x: 0.5, y: 0.5 });
  s.move({ id: 1, x: 0.7, y: 0.4 });
  assert.equal(s.draft.marks[0].id, m.id);
  assert.equal(s.draft.marks[0].x, 0.7);
  const erase = new TouchSession(s.draft, "Erase", { id: 2, x: 0.7, y: 0.4 });
  assert.equal(erase.draft.marks.length, 0);
  assert.equal(base.marks.length, 1);
});
test("export dimensions keep their exact long edge across every artwork ratio", () => {
  assert.deepEqual(dimensions("9:16", 2160), { width: 1215, height: 2160 });
  assert.deepEqual(dimensions("16:9", 4096), { width: 4096, height: 2304 });
  assert.deepEqual(dimensions("1:1", 1080), { width: 1080, height: 1080 });
});

test("appearance sliders round trip, reject invalid numbers and keep vintage recipes unchanged", () => {
  const appearanceKeys = ["phosphor","dither","riso","windowCascade","glitter","broadcast","misregister"];
  for (const key of appearanceKeys) {
    assert.equal(initial[key], 0);
    const state = { ...initial, [key]: 77 };
    assert.equal(parseDocument(recipeDocument(state, "Test", {time:1,colorTime:1})).state[key], 77);
    assert.throws(() => parseDocument({ ...state, [key]: 101 }));
  }
  const old = {...initial};
  for (const key of appearanceKeys) delete old[key];
  assert.deepEqual(appearanceKeys.map(key => parseDocument(old).state[key]), appearanceKeys.map(() => 0));
});
test("lookbook contains 22 valid distinct entries covering new materials and memory", () => {
  assert.equal(looks.length, 22);
  assert.equal(new Set(looks.map(look => look.name)).size, looks.length);
  for (const look of looks) assert.deepEqual(parseDocument(look.state).state, look.state);
  assert.ok(looks.some(look => look.state.windowCascade > 0));
  assert.ok(looks.some(look => look.state.riso > 0));
  assert.ok(looks.some(look => look.state.phosphor > 0));
  assert.ok(looks.some(look => look.state.afterimage > 0));
  assert.ok(looks.some(look => look.state.datamosh > 0));
});

test("signal drift stays free of hard band discontinuities", async () => {
  const { readFileSync } = await import("node:fs");
  const shader = readFileSync(new URL("../src/renderer.js", import.meta.url), "utf8");
  assert.match(shader, /smoothstep\(0\.,1\.,fract\(bandPos\)\)/);
  assert.doesNotMatch(shader, /float band=floor\(uv\.y\*90\.\)/);
});

test("frame memory remains opt-in and survives round-trip with validation", () => {
  for (const key of ["afterimage", "datamosh", "memoryDrift", "memoryDecay"]) {
    assert.ok(initial[key] >= 0 && initial[key] <= 100);
    const input = { ...initial, [key]: 73 };
    assert.equal(parseDocument(recipeDocument(input, "Memory", {time:2,colorTime:3})).state[key], 73);
    assert.throws(() => parseDocument({ ...input, [key]: -2 }));
    assert.throws(() => parseDocument({ ...input, [key]: NaN }));
  }
  const old = { ...initial };
  for (const key of ["afterimage", "datamosh", "memoryDrift", "memoryDecay"]) delete old[key];
  const restored = parseDocument(old).state;
  assert.equal(restored.afterimage, 0);
  assert.equal(restored.datamosh, 0);
});
test("memory renderer only activates when explicitly enabled", async () => {
  const { readFileSync } = await import("node:fs");
  const shader = readFileSync(new URL("../src/renderer.js", import.meta.url), "utf8");
  const memory = readFileSync(new URL("../src/feedback.js", import.meta.url), "utf8");
  assert.match(shader, /s.afterimage > 0 \|\| s.datamosh > 0/);
  assert.match(shader, /gl.copyTexSubImage2D/);
  assert.match(shader, /resetFeedback\(\)/);
  assert.match(memory, /uniform sampler2D sceneTex, historyTex/);
});
