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
    { ...initial, engine: 17 },
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
    next = randomize(source, { engine: true, color: true }, true, () => 0.7);
  assert.equal(next.engine, source.engine);
  assert.deepEqual(next.colors, source.colors);
  assert.equal(next.marks, source.marks);
  assert.equal(next.ratio, source.ratio);
  assert.equal(next.seed, source.seed);
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
test("lookbook contains 76 valid distinct entries including living-background worlds", () => {
  assert.equal(looks.length, 76);
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
  assert.equal(engines.length, 17);
  assert.deepEqual(engines.slice(12,15), ["Hyperbolic CRT", "Candy fractal portal", "Fivefold diffraction"]);
  assert.equal(engines[15], "Chromatic infection");
  assert.equal(engines[16], "Stereo Ghost Machine");
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

test("full Surprise is a visual rebirth, with new marks and a different math family", async () => {
  const { engineInfo }=await import("../src/data.js");
  const old = {...initial,engine:10,palette:2,ratio:"9:16",marks:[makeMark(initial)],speed:0,colorSpeed:0,freezeGeometry:true,freezeColor:true};
  const fresh=randomize(old,{engine:true,color:true},false,()=>.7);
  assert.notEqual(fresh.engine,old.engine);
  assert.notEqual(engineInfo[fresh.engine].family,engineInfo[old.engine].family);
  assert.notEqual(fresh.palette,old.palette);
  assert.notEqual(fresh.seed,old.seed);
  assert.equal(fresh.ratio,old.ratio);
  assert.ok(fresh.marks.every(m=>m.id!==old.marks[0].id));
  assert.equal(fresh.freezeGeometry,false);
  assert.ok(fresh.motionAmount>0 && fresh.lightMotion>0 && fresh.speed>0);
  assert.deepEqual(parseDocument(fresh).state,fresh);
  const tweak=randomize(old,{},true,()=>.7);
  assert.deepEqual(tweak.marks,old.marks);
  assert.equal(tweak.engine,old.engine);
});

test("shared palette vault keeps every 12-stop set and imports/exports portable palette files", async () => {
  const { palettes }=await import("../src/data.js");
  const {parsePaletteLibrary,paletteLibraryDocument,mergePalettes}=await import("../src/palette-io.js");
  assert.ok(palettes.length>=192);
  assert.ok(palettes.some(p=>p.colors.length===12));
  const original=palettes.find(p=>p.colors.length===12);
  assert.equal(parseDocument({...initial,colors:original.colors}).state.colors.length,12);
  const serial=JSON.stringify(paletteLibraryDocument(palettes));
  const parsed=parsePaletteLibrary(serial);
  assert.ok(parsed.length>100);
  const imported=mergePalettes([],parsed,128);
  assert.equal(imported.palettes.length,128);
  assert.throws(()=>parsePaletteLibrary('[{"name":"bad","colors":["#xyz"]}]'));
});

test("MP4 exports use even-sized H.264 frames and never silently produce WebM", async () => {
  const { videoDimensions } = await import("../src/export.js");
  assert.deepEqual(videoDimensions("9:16",720),{width:406,height:720});
  for(const ratio of ["1:1","9:16","16:9","3:4","4:3"]) {
    const s=videoDimensions(ratio,1080);
    assert.equal(s.width%2,0);assert.equal(s.height%2,0);
  }
  const {readFileSync}=await import("node:fs");
  const exporter=readFileSync(new URL("../src/export.js",import.meta.url),"utf8");
  assert.match(exporter,/Mp4OutputFormat/);
  assert.match(exporter,/codec: "avc"/);
  assert.doesNotMatch(exporter,/WebMOutputFormat/);
  assert.match(exporter,/GIFEncoder/);
});

test("Stereo Ghost Machine validates five 3D forms and preserves old recipes", async () => {
  const {stereoShapes}=await import("../src/data.js");
  assert.equal(stereoShapes.length,5);
  const props=["stereoAmount","stereoDepth","stereoParallax","stereoMorph","stereoGlow","stereoWiggle","stereoQuality"];
  for(const key of props){
    const s={...initial,[key]:82};
    assert.equal(parseDocument(recipeDocument(s,"Ghost",{time:1,colorTime:3})).state[key],82);
    assert.throws(()=>parseDocument({...s,[key]:103}));
  }
  assert.throws(()=>parseDocument({...initial,stereoShape:"Not a real shape"}));
  const old={...initial};
  for(const key of props)delete old[key];
  delete old.stereoShape;
  assert.equal(parseDocument(old).state.stereoAmount,0);
  const scene=looks.find(x=>x.name==="Opal Knot Apparition");
  assert.equal(scene.state.engine,16);
  assert.ok(scene.state.stereoParallax>0 && scene.state.lightMotion>0);
  assert.ok(looks.some(x=>x.state.engine!==16 && x.state.stereoAmount>0));
  const born=randomize({...initial,engine:16,stereoAmount:0},{},false,()=>.61);
  assert.notEqual(born.engine,16);
  assert.ok(stereoShapes.includes(born.stereoShape));
});
test("stereo code loads only for 3D engine or explicit overlay", async () => {
  const {readFileSync}=await import("node:fs");
  const shader=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
  const spatial=readFileSync(new URL("../src/stereo.js",import.meta.url),"utf8");
  assert.match(shader,/kind==16/);
  assert.match(shader,/withStereo/);
  assert.match(shader,/source = source\.replace\("\/\* STEREO_MODULE \*\//);
  assert.match(shader,/ghostTrace\(p,uv\)/);
  assert.match(spatial,/ghostMap\(/);
  assert.match(spatial,/ghostNormal\(/);
  assert.match(spatial,/float budget=20\./);
});

test("unsupported 3D compilation falls back to the existing 2D renderer", async () => {
  const {readFileSync}=await import("node:fs");
  const shader=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
  assert.match(shader,/stereoUnavailable = true/);
  assert.match(shader,/safe2DSelection\(s\)/);
  assert.match(shader,/engine: s.engine === 16 \? 6/);
});

test("prismatic materials and live text validate, survive recipe round trip and leave legacy off", async () => {
  const {letteringStyles,chaosPhrases}=await import("../src/data.js");
  const keys=["filmAmount","filmThickness","opalAmount","prismAmount","foilRelief",
   "foilMotion","letteringAmount","letteringScale","letteringWarp","letteringMotion"];
  for(const key of keys){
    const art={...initial,[key]:73};
    assert.equal(parseDocument(recipeDocument(art,"Type",{time:2,colorTime:3})).state[key],73);
    assert.throws(()=>parseDocument({...art,[key]:105}));
  }
  const old={...initial};
  for(const key of keys)delete old[key];
  delete old.lettering;delete old.letteringStyle;
  const restored=parseDocument(old).state;
  assert.equal(restored.filmAmount,0);assert.equal(restored.letteringAmount,0);
  assert.equal(restored.lettering,"");
  assert.equal(letteringStyles.length,4);assert.ok(chaosPhrases.length>=10);
  assert.throws(()=>parseDocument({...initial,lettering:"a".repeat(57)}));
  assert.throws(()=>parseDocument({...initial,letteringStyle:"Not real"}));
  const type=looks.find(x=>x.name==="DIVINE MALFUNCTION");
  assert.equal(type.state.lettering,"DIVINE MALFUNCTION");
  const born=randomize({...initial,lettering:"OLD WORDS"},{},false,()=>.7);
  assert.notEqual(born.lettering,"OLD WORDS");
});
test("material and lettering GL shaders are opt-in, but complete in normal render and exports", async () => {
  const {readFileSync}=await import("node:fs");
  const shader=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
  const material=readFileSync(new URL("../src/materials.js",import.meta.url),"utf8");
  const kinetic=readFileSync(new URL("../src/kinetic-type.js",import.meta.url),"utf8");
  assert.match(shader,/withMaterial/);assert.match(shader,/withLettering/);
  assert.match(shader,/prismaticTape\(col,uv,p,v\)/);
  assert.match(shader,/drawKineticLetters\(col,uv\)/);
  assert.match(material,/wavelengths/);
  assert.match(kinetic,/glyphCanvas/);
  assert.match(shader,/texImage2D\(gl\.TEXTURE_2D,0,gl\.RGBA,gl\.RGBA,gl\.UNSIGNED_BYTE,glyphs\)/);
});

test("opt-in material or type compile failures progressively retain the old 2D art", async () => {
  const {readFileSync}=await import("node:fs");
  const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
  assert.match(renderer,/materialUnavailable=true/);
  assert.match(renderer,/typeShaderUnavailable=true/);
  assert.match(renderer,/compatibleShaderState\(s\)/);
  assert.match(renderer,/for\(let attempt=0;attempt<5;attempt\+\+\)/);
});

test("composition regions are independently editable and migrate from legacy full-canvas blends", async () => {
  const {compositionModes}=await import("../src/data.js");
  assert.equal(compositionModes.length,6);
  const keys=["compositionAmount","compositionScale","compositionFeather","compositionMotion","compositionColorShift","compositionVariation"];
  for(const key of keys){
    const recipe={...initial,[key]:79};
    assert.equal(parseDocument(recipeDocument(recipe,"Territories",{time:2,colorTime:3})).state[key],79);
    assert.throws(()=>parseDocument({...recipe,[key]:101}));
  }
  const legacy={...initial};
  for(const key of keys)delete legacy[key];
  delete legacy.compositionMode;
  const restored=parseDocument(legacy).state;
  assert.equal(restored.compositionAmount,0);
  assert.equal(restored.compositionMode,"Iris portals");
  assert.throws(()=>parseDocument({...initial,compositionMode:"Unreal mask"}));
  const created=randomize({...initial,compositionMode:"Iris portals",engine:3},{},false,()=>.72);
  assert.notEqual(created.compositionMode,"Iris portals");
  assert.ok(created.compositionAmount>0 && created.blend>0);
  assert.ok(looks.filter(l=>l.family==="Composition").length===10);
  assert.ok(looks.every(l=>parseDocument(l.state).state.engine===l.state.engine));
});
test("composition GLSL uses distinct masked second-field color and only compiles when enabled", async () => {
  const {readFileSync}=await import("node:fs");
  const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
  const composition=readFileSync(new URL("../src/composition.js",import.meta.url),"utf8");
  assert.match(renderer,/withComposition = blended && s\.compositionAmount>0/);
  assert.match(renderer,/territoryComposite\(col,p,uv,source\)/);
  assert.match(renderer,/if\(withComposition\)source=source\.replace/);
  assert.match(composition,/territoryMask\(vec2 uv\)/);
  assert.match(composition,/field\(rotate\(\.43\)\*p/);
  assert.match(composition,/palette\(phaseOf\(c,uv,touchSource\)/);
});

test("territory variation remains independent of the base seed; 3D secondary is spatially masked", async () => {
  const {readFileSync}=await import("node:fs");
  const composition=readFileSync(new URL("../src/composition.js",import.meta.url),"utf8");
  const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
  assert.match(composition,/compositionVariation/);
  assert.match(composition,/variation\*1\.73/);
  assert.match(renderer,/ghostOpacity\*=territoryMask\(uv\)\*compositionAmount/);
  const varied={...initial,compositionVariation:91,seed:initial.seed};
  assert.equal(parseDocument(varied).state.seed,initial.seed);
  assert.equal(parseDocument(varied).state.compositionVariation,91);
});

test("unsupported spatial composition recompiles using legacy full-canvas blend", async () => {
  const {readFileSync}=await import("node:fs");
  const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
  const composition=readFileSync(new URL("../src/composition.js",import.meta.url),"utf8");
  assert.match(renderer,/compositionUnavailable=true/);
  assert.match(renderer,/compositionUnavailable \? \{compositionAmount:0\}/);
  assert.match(composition,/export const compositionGLSL/);
});

test("living backdrops are opt-in, use six species, migrate safely and save in recipes", async () => {
  const {backdropModes,numericRanges}=await import("../src/data.js");
  assert.equal(backdropModes.length,6);
  const old={...initial};
  const knobs=["backdropAmount","backdropDepth","backdropDensity","backdropMotion",
    "backdropGlow","backdropHue","backdropVariation"];
  for(const key of knobs)delete old[key];
  delete old.backdropMode;
  assert.equal(parseDocument(old).state.backdropAmount,0);
  for(const key of knobs){
    assert.ok(numericRanges[key]);
    const a={...initial,[key]:76};
    assert.equal(parseDocument(recipeDocument(a,"Backdrop",{time:2,colorTime:3})).state[key],76);
    assert.throws(()=>parseDocument({...a,[key]:110}));
  }
  assert.throws(()=>parseDocument({...initial,backdropMode:"Fake"}));
  assert.ok(looks.filter(l=>l.family==="Backdrop").length===9);
  assert.ok(looks.some(l=>l.family==="Backdrop" && l.state.letteringAmount>0));
  const s=randomize({...initial,backdropMode:"Nebula veils",backdropAmount:0},{},false,()=>.67);
  assert.notEqual(s.backdropMode,"Nebula veils");
  assert.ok(s.backdropAmount>=42 && s.backdropAmount<=99);
  assert.ok(s.backdropMotion>0 && s.backdropGlow>0);
});
test("Surprise Me covers present AND future numeric sliders automatically", async () => {
  const {numericRanges}=await import("../src/data.js");
  numericRanges.__testSurpriseCoverage=[0,100];
  try{
    const state=randomize(initial,{},false,()=>.73);
    assert.equal(state.__testSurpriseCoverage,73);
    for(const [key,[lo,hi]] of Object.entries(numericRanges)){
      assert.ok(Number.isFinite(state[key]),key+" missing from Surprise Me");
      assert.ok(state[key]>=lo && state[key]<=hi,key+" out of bounds");
    }
    assert.notEqual(state.engine,initial.engine);
    assert.notEqual(state.backdropMode,initial.backdropMode);
    assert.notEqual(state.compositionMode,initial.compositionMode);
    assert.notEqual(state.motionMode,initial.motionMode);
    assert.notEqual(state.blendMode,initial.blendMode);
    assert.notEqual(state.colorMode,initial.colorMode);
    assert.notEqual(state.touchMode,initial.touchMode);
  }finally{delete numericRanges.__testSurpriseCoverage;}
});
test("negative-space shader is only compiled when enabled and has a mobile fallback", async () => {
  const {readFileSync}=await import("node:fs");
  const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
  const backdrop=readFileSync(new URL("../src/backdrops.js",import.meta.url),"utf8");
  assert.match(renderer,/withBackdrop = s\.backdropAmount>0/);
  assert.match(renderer,/livingBackdrop\(col,uv,v\)/);
  assert.match(renderer,/backdropUnavailable=true/);
  assert.match(backdrop,/backdropMode==4/);
  assert.match(backdrop,/vec3 livingBackdrop/);
});
