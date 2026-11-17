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
    { ...initial, engine: 16 },
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
test("lookbook contains 43 valid distinct entries across original, math, motion and biology", () => {
  assert.equal(looks.length, 43);
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

test("new math and ambient movement preserve valid recipe and clock semantics", async () => {
  const {engines, motionModes} = await import("../src/data.js");
  assert.equal(engines.length, 16);
  assert.deepEqual(engines.slice(12,15), ["Hyperbolic CRT", "Candy fractal portal", "Fivefold diffraction"]);
  assert.equal(engines[15], "Chromatic infection");
  assert.equal(motionModes.length, 5);
  for(const name of ["hyperbolicFold","fractalZoom","juliaMix","quasiDensity","motionAmount","motionRate","lightMotion"]){
    const value=73, s={...initial,[name]:value};
    assert.equal(parseDocument(recipeDocument(s,"Motion",{time:2,colorTime:3})).state[name],value);
    assert.throws(()=>parseDocument({...s,[name]:101}));
  }
  assert.throws(()=>parseDocument({...initial,motionMode:"Bogus"}));
  const legacy={...initial};
  delete legacy.motionAmount;delete legacy.lightMotion;delete legacy.motionRate;delete legacy.motionMode;
  assert.equal(parseDocument(legacy).state.motionAmount,0);
  assert.equal(parseDocument(legacy).state.lightMotion,0);
  assert.ok(looks.some(l=>l.family==="Motion" && l.state.motionAmount>0 && l.state.lightMotion>0));
  const surprised=randomize({...initial,motionAmount:0,lightMotion:0},{},false,()=>.51);
  assert.ok(surprised.motionAmount>0 && surprised.lightMotion>0);
});
test("math and motion shader modules wire the original render and secondary composition", async () => {
  const {readFileSync}=await import("node:fs");
  const shader=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
  const geom=readFileSync(new URL("../src/geometry.js",import.meta.url),"utf8");
  const motion=readFileSync(new URL("../src/motion.js",import.meta.url),"utf8");
  for(const id of [12,13,14])assert.match(shader,new RegExp("kind=="+id));
  assert.match(geom,/hyperbolicCRT/);
  assert.match(geom,/candyFractalPortal/);
  assert.match(geom,/fivefoldDiffraction/);
  assert.match(motion,/animateCoordinates/);
  assert.match(motion,/animateLight/);
  assert.match(shader,/p=animateCoordinates\(p\)/);
  assert.match(shader,/col=animateLight\(col,uv,v\)/);
});

test("Surprise Me brings animation clocks back from zero and leaves paused transport alone", () => {
  const immobile = {...initial,speed:0,colorSpeed:0,freezeGeometry:true,freezeColor:true,motionAmount:0,lightMotion:0};
  const next = randomize(immobile,{},false,()=>.5);
  assert.ok(next.speed>0 && next.colorSpeed>0);
  assert.ok(next.motionAmount>0 && next.lightMotion>0);
  assert.equal(next.freezeGeometry,false);
  assert.equal(next.freezeColor,false);
  const mutated = randomize(immobile,{},true,()=>.5);
  assert.equal(mutated.freezeGeometry,true);
  assert.equal(mutated.freezeColor,true);
});

test("genuine Gray–Scott biology is seeded, grows, and responds to different chemistry", async () => {
  const { createBiology, BIO_SIZE } = await import("../src/biology.js");
  const a = createBiology(31827), b = createBiology(31827);
  assert.equal(a.size, BIO_SIZE);
  assert.equal(a.pixels().length, BIO_SIZE * BIO_SIZE * 4);
  assert.deepEqual(a.pixels(), b.pixels());
  const before = a.pixels().slice();
  a.advance(75, 45, 45);
  b.advance(75, 45, 45);
  const after = a.pixels().slice();
  assert.notDeepEqual(after, before);
  assert.deepEqual(after, b.pixels());
  const mutant = createBiology(31827);
  mutant.advance(75, 65, 32);
  assert.notDeepEqual(after, mutant.pixels());
  a.reset(); assert.deepEqual(a.pixels(), before);
  const unrelated = createBiology(53123);
  assert.notDeepEqual(unrelated.pixels(), before);
});
test("biology recipe migration, stacking and Surprise Me remain safe", () => {
  const old = {...initial};
  for (const key of ["bioAmount","bioFeed","bioKill","bioSpeed","bioVeins"]) delete old[key];
  assert.equal(parseDocument(old).state.bioAmount, 0);
  const keys=["bioAmount","bioFeed","bioKill","bioSpeed","bioVeins"];
  for(const key of keys) {
    const item={...initial,[key]:76};
    assert.equal(parseDocument(recipeDocument(item,"Rot",{time:0,colorTime:0})).state[key],76);
    assert.throws(()=>parseDocument({...item,[key]:101}));
  }
  const look = looks.find(l=>l.name==="Coral Codec Shrine");
  assert.equal(look.state.engine,15);
  assert.ok(looks.some(l=>l.state.engine!==15 && l.state.bioAmount>0));
  assert.ok(looks.some(l=>l.family==="Biology" && l.state.motionAmount>0));
});
test("biology shader is available as primary or secondary with a fallback", async () => {
  const { readFileSync } = await import("node:fs");
  const shader=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
  const bio=readFileSync(new URL("../src/bio-shader.js",import.meta.url),"utf8");
  assert.match(shader,/kind==15/);
  assert.match(shader,/bioAvailable/);
  assert.match(shader,/updateBiology/);
  assert.match(shader,/gl\.texSubImage2D/);
  assert.match(bio,/stainWithBiology/);
  assert.match(bio,/biologicalField/);
});
