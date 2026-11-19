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
    { time: 34.23, colorTime: 5.43, textTime: 0 },
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
    { ...initial, engine: 20 },
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
test("lookbook contains 111 distinct entries including mutants and atmospheric hybrids", () => {
  assert.equal(looks.length, 111);
  assert.equal(looks.filter(l=>l.family==="Atmospheric Hybrids").length,5);
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
  assert.equal(engines.length, 20);
  assert.deepEqual(engines.slice(12,15), ["Hyperbolic CRT", "Candy fractal portal", "Fivefold diffraction"]);
  assert.equal(engines[15], "Chromatic infection");
  assert.equal(engines[16], "Stereo Ghost Machine");
  assert.deepEqual(engines.slice(17), ["Schottky Lace","Sigil Glass","Moiré DNA"]);
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
  assert.match(shader,/stereoUnavailable\s*=\s*true/);
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
  assert.equal(letteringStyles.length,14);assert.ok(chaosPhrases.length>=10);
  assert.throws(()=>parseDocument({...initial,lettering:"a".repeat(281)}));
  assert.throws(()=>parseDocument({...initial,letteringStyle:"Not real"}));
  const manual={...initial,lettering:"I make my own magic.\nAnd I choose my own words.",letteringAmount:49};
  assert.equal(parseDocument(manual).state.lettering,manual.lettering);
  assert.ok(looks.every(x=>!x.state.lettering && !x.state.letteringAmount));
  const born=randomize({...initial,lettering:"OLD WORDS"},{},false,()=>.7);
  assert.equal(born.lettering,"");
  assert.equal(born.letteringAmount,0);
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
  assert.match(renderer,/for\(let attempt=0;attempt<16;attempt\+\+\)/);
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
  assert.ok(looks.every(l=>l.family!=="Backdrop" || !l.state.letteringAmount));
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

test("multiline user quotes wrap inside portrait and landscape frames", async () => {
  const {wrapQuote,glyphCanvas}=await import("../src/kinetic-type.js");
  const lines=wrapQuote("The stars are not in the sky.\nThey are in the goddamn circuits.",210,t=>t.length*12);
  assert.ok(lines.length>=3);
  assert.ok(lines.every(l=>l.length*12<=210));
  const drawings=[];
  let canvas;
  const ctx={
    font:"",
    measureText(t){const font=Number((this.font.match(/(\d+)px/)||[])[1]||20);return {width:t.length*font*.52};},
    clearRect(){},strokeText(){},
    fillText(t,x,y,maxWidth){drawings.push({t,x,y,maxWidth});}
  };
  const originalDocument=globalThis.document;
  globalThis.document={createElement(){
    canvas={width:0,height:0,getContext(){return ctx;}};
    return canvas;
  }};
  try{
    const portrait=glyphCanvas("The stars are not in the sky.\nThey are in the goddamn circuits.",9/16);
    assert.equal(portrait.height,1024);
    assert.ok(portrait.width < portrait.height);
    assert.ok(drawings.length>=2);
    assert.ok(drawings.every(v=>v.maxWidth<=portrait.width*.76+1));
    assert.ok(drawings.every(v=>v.y>=0 && v.y<=portrait.height));
    drawings.length=0;
    const landscape=glyphCanvas("A beautifully strange quote that should not be cropped by any screen.",16/9);
    assert.equal(landscape.width,1024);
    assert.ok(landscape.height<landscape.width);
    assert.ok(drawings.every(v=>v.y>=0 && v.y<=landscape.height));
  }finally{
    if(originalDocument===undefined)delete globalThis.document;
    else globalThis.document=originalDocument;
  }
});
test("no Surprise Me RNG result is allowed to insert decorative typography", () => {
  for(const value of [0,.08,.16,.43,.7,.99]){
    const s=randomize({...initial,lettering:"MY PREVIOUS WORDS",letteringAmount:97},{},false,()=>value);
    assert.equal(s.lettering,"");
    assert.equal(s.letteringAmount,0);
  }
  assert.ok(looks.every(l=>l.state.lettering==="" && l.state.letteringAmount===0));
});

test("six living microstructure species are opt-in and fully covered by Surprise", async () => {
  const {microModes,numericRanges}=await import("../src/data.js");
  assert.equal(microModes.length,6);
  const knobs=["microAmount","microScale","microMotion","microRelief","microDensity","microHue","microVariation"];
  for(const key of knobs){
    const s={...initial,[key]:68};
    assert.equal(parseDocument(recipeDocument(s,"Under microscope",{time:2,colorTime:4})).state[key],68);
    assert.throws(()=>parseDocument({...initial,[key]:108}));
    assert.ok(numericRanges[key],key);
  }
  const old={...initial};
  for(const key of knobs)delete old[key];
  delete old.microMode;
  assert.equal(parseDocument(old).state.microAmount,0);
  assert.equal(looks.filter(l=>l.family==="Microtexture").length,8);
  assert.ok(looks.every(l=>!l.state.lettering && l.state.letteringAmount===0));
  for(const v of [.11,.43,.73,.91]){
    const random=randomize({...initial,microMode:"Living embroidery"}, {}, false,()=>v);
    assert.notEqual(random.microMode,"Living embroidery");
    assert.ok(random.microMotion>0);
    assert.ok(Number.isFinite(random.microVariation));
    assert.equal(random.lettering,"");
  }
});
test("opt-in microstructure can be disabled on unsupported devices without blanking the old art", async () => {
  const {readFileSync}=await import("node:fs");
  const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
  const micro=readFileSync(new URL("../src/microstructure.js",import.meta.url),"utf8");
  assert.match(renderer,/withMicro = s\.microAmount>0/);
  assert.match(renderer,/movingMicrostructure\(col,p,uv,v\)/);
  assert.match(renderer,/microUnavailable=true/);
  assert.match(micro,/microMode==5/);
});


test("retro MySpace font closet is licensed, self-hosted, and has 39 distinct styles", async () => {
  const {retroFonts,retroFontIds,retroFontGroups,getRetroFont,quoteFontCSS}=
    await import("../src/retro-fonts.js");
  const {readFileSync,statSync} = await import("node:fs");
  assert.equal(retroFonts.length,39);
  assert.equal(new Set(retroFontIds).size,retroFonts.length);
  assert.equal(retroFontGroups.length,5);
  assert.ok(retroFonts.some(f=>f.label.includes("Comic Sans")));
  assert.ok(retroFonts.some(f=>f.label.includes("Papyrus")));
  assert.ok(retroFonts.some(f=>f.label.includes("Impact")));
  assert.ok(retroFonts.some(f=>f.label.includes("Courier")));
  assert.match(quoteFontCSS("pressstart2p",32),/Retro Press Start 2P/);
  assert.equal(getRetroFont("bogus id").id,"original");
  const css=readFileSync(new URL("../src/retro-fonts.css",import.meta.url),"utf8");
  const embedded=[...new Set(retroFonts.filter(f=>f.bundle).map(f=>f.bundle))];
  assert.equal(embedded.length,20);
  for(const font of embedded){
    assert.ok(css.includes('retro-'+font+'.ttf'),"CSS missing "+font);
    const size=statSync(new URL("../public/fonts/retro-"+font+".ttf",import.meta.url)).size;
    assert.ok(size>10000,"Invalid binary font "+font);
  }
  for(const file of ["licenses-pixel.txt","licenses-gothic.txt",
    "licenses-classic.txt","licenses-script.txt"]){
    assert.ok(statSync(new URL("../public/fonts/"+file,import.meta.url)).size>2000);
  }
});
test("font choice is saved with the quote but Surprise Me never invents words", async () => {
  const {retroFontIds}=await import("../src/retro-fonts.js");
  const legacy={...initial};delete legacy.letteringFont;
  assert.equal(parseDocument(legacy).state.letteringFont,"original");
  assert.throws(()=>parseDocument({...initial,letteringFont:"url(javascript:bad)"}));
  for(const fontId of ["comicneue","vt323","rubikglitch","unifrakturcook","times"]){
    const saved={...initial,lettering:"My words.\nMy rules.",letteringFont:fontId,letteringAmount:64};
    assert.equal(parseDocument(recipeDocument(saved,"MySpace",{time:2,colorTime:3})).state.letteringFont,fontId);
  }
  for(const v of [0,.15,.25,.43,.68,.98]){
    const next=randomize({...initial,lettering:"ME, NOT RANDOM",letteringAmount:92,
      letteringFont:"original"},{},false,()=>v);
    assert.ok(retroFontIds.includes(next.letteringFont));
    assert.notEqual(next.letteringFont,"original");
    assert.equal(next.lettering,"");
    assert.equal(next.letteringAmount,0);
  }
  assert.ok(looks.every(l=>!l.state.lettering));
});
test("font selections are measured and fitted without clipping across ratios", async () => {
  const {glyphCanvas}=await import("../src/kinetic-type.js");
  const originalDocument=globalThis.document;
  const draw=[];
  let face="";
  const ctx={
    set font(v){face=v;},get font(){return face;},
    measureText(s){return {width:s.length*Number(face.match(/(\d+)px/)?.[1]||16)*.61};},
    clearRect(){},strokeText(){},fillText(s,x,y,maxWidth){draw.push({s,x,y,maxWidth});}
  };
  globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};
  try{
    const sample="The internet is my neon spellbook.\nAnd I write my own goddamn quotes.";
    for(const [ratio,font] of [[9/16,"pressstart2p"],[1,"rubikglitch"],[16/9,"sacramento"]]){
      draw.length=0;
      const canvas=glyphCanvas(sample,ratio,font);
      assert.ok(draw.length>=2);
      assert.ok(draw.every(d=>d.x>=0&&d.x<=canvas.width));
      assert.ok(draw.every(d=>d.maxWidth<=canvas.width*.76+1));
      assert.ok(draw.every(d=>d.y>=0&&d.y<=canvas.height));
    }
  }finally{if(originalDocument===undefined)delete globalThis.document;
    else globalThis.document=originalDocument;}
});
test("fonts load lazily once, and still frames refresh when fonts arrive", async () => {
  const {ensureRetroFontLoaded,retroFontRevision}=await import("../src/retro-fonts.js");
  const originalDocument=globalThis.document;let calls=0;
  globalThis.document={fonts:{load:async()=>{calls++;return [{}];}}};
  try{
    const before=retroFontRevision();
    await Promise.all([ensureRetroFontLoaded("nosifer"),ensureRetroFontLoaded("nosifer")]);
    assert.equal(calls,1);
    assert.equal(retroFontRevision(),before+1);
    await ensureRetroFontLoaded("nosifer");
    assert.equal(calls,1);
  }finally{if(originalDocument===undefined)delete globalThis.document;
    else globalThis.document=originalDocument;}
  const {readFileSync}=await import("node:fs");
  const canvas=readFileSync(new URL("../src/ArtCanvas.jsx",import.meta.url),"utf8");
  const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
  const exporter=readFileSync(new URL("../src/export.js",import.meta.url),"utf8");
  assert.match(canvas,/lastFontRevision !== retroFontRevision\(\)/);
  assert.match(renderer,/glyphCanvas\(s\.lettering,aspect,fontId(?:,s)?\)/);
  assert.match(renderer,/retroFontRevision\(\)/);
  assert.match(exporter,/await waitForLetteringFonts\(state\)/);
});

test("mobile studio keeps one canvas above resize divider and independent scrollable editor", async () => {
  const {readFileSync}=await import("node:fs");
  const main=readFileSync(new URL("../src/main.jsx",import.meta.url),"utf8");
  const style=readFileSync(new URL("../src/style.css",import.meta.url),"utf8");
  const controls=readFileSync(new URL("../src/components/Controls.jsx",import.meta.url),"utf8");
  const inspectors=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
  assert.equal(main.split("<ArtCanvas").length-1,1,"Only one live artwork canvas");
  assert.match(main,/className="studio-splitter"/);
  assert.match(main,/role="separator"/);
  assert.match(main,/setPointerCapture\(e\.pointerId\)/);
  assert.match(main,/onPointerMove=\{resizeDividerMove\}/);
  assert.match(main,/onKeyDown=\{resizeDividerKey\}/);
  assert.match(main,/localStorage\.setItem\("glitch-studio-pane-v1"/);
  assert.match(main,/\["Text", Type\]/);
  assert.match(main,/<TextInspector history=\{history\}/);
  const text=readFileSync(new URL("../src/components/TextInspector.jsx",import.meta.url),"utf8");
  assert.match(inspectors,/export \{ TextInspector \} from "\.\/TextInspector"/);
  assert.match(text,/export function TextInspector/);
  assert.equal(text.split('className="text-input"').length-1,1,"One words box drives every text layer");
  assert.match(style,/\.studio-page \.inspector-scroll\{flex:1 1 auto;min-height:0;max-height:none;overflow-y:auto/);
  assert.match(style,/flex:0 0 min\(var\(--canvas-pane-ratio,58%\),calc\(100% - 175px\)\)/);
  assert.match(controls,/aria-expanded=\{expanded\}/);
  assert.match(controls,/section-disclosure/);
});

test("Tunnel Vision and the global Phase vortex do not contain raw angular branch cuts", async () => {
  const {readFileSync}=await import("node:fs");
  const shader=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
  const tunnels=readFileSync(new URL("../src/tunnels.js",import.meta.url),"utf8");
  const composition=readFileSync(new URL("../src/composition.js",import.meta.url),"utf8");
  assert.ok(shader.includes("else if(kind==5){f=seamlessTunnel(p);}"));
  assert.ok(!shader.includes("atan(p.y,p.x)*(.7+complexity)"));
  assert.ok(!shader.includes("atan(s.y,s.x)/TAU"));
  assert.ok(!shader.includes("atan(z.y,z.x)*.1"));
  assert.ok(shader.includes("sin(angle*2.+radial*3.1"));
  assert.ok(shader.includes("float angle=atan(s.y,s.x)"));
  assert.ok(shader.includes("withTunnel ? tunnelGLSL"));
  assert.ok(shader.includes("tunnelGLSL"));
  assert.ok(tunnels.includes("float seamlessTunnel(vec2 p)"));
  assert.ok(tunnels.includes("floor(tunnelRidges*10.)"));
  assert.ok(tunnels.includes("if(tunnelMode==4)"));
  assert.ok(composition.includes("sin(angle*5.+radius"));
});
test("Tunnel morphology recipes, Surprise and Mutate cover all six modes and controls", async () => {
  const {tunnelModes,numericRanges}=await import("../src/data.js");
  assert.equal(tunnelModes.length,6);
  const knobs=["tunnelTwist","tunnelDepth","tunnelRidges",
    "tunnelPulse","tunnelAperture","tunnelVariation"];
  const legacy={...initial};delete legacy.tunnelMode;
  for(const key of knobs)delete legacy[key];
  assert.equal(parseDocument(legacy).state.tunnelMode,"Infinite spiral");
  for(const key of knobs){
    assert.deepEqual(numericRanges[key],[0,100]);
    const stored=recipeDocument({...initial,engine:5,[key]:72},"tunnel",{time:2,colorTime:3});
    assert.equal(parseDocument(stored).state[key],72);
    assert.throws(()=>parseDocument({...initial,[key]:103}));
  }
  assert.throws(()=>parseDocument({...initial,tunnelMode:"Unreal"}));
  assert.equal(looks.filter(l=>l.family==="Tunnel").length,8);
  assert.ok(looks.filter(l=>l.family==="Tunnel").every(l=>!l.state.lettering));
  for(const v of [0,.09,.37,.63,.91,.99]){
    const s=randomize({...initial,engine:5,tunnelMode:"Infinite spiral"},{},false,()=>v);
    assert.ok(tunnelModes.includes(s.tunnelMode));
    assert.notEqual(s.tunnelMode,"Infinite spiral");
    assert.ok(s.tunnelPulse>=21&&s.tunnelTwist>=12);
    assert.equal(s.lettering,"");
  }
  const mutation=randomize({...initial,engine:5,tunnelMode:"Moiré throat"},{},true,()=>.83);
  assert.equal(mutation.tunnelMode,"Moiré throat");
  assert.notEqual(mutation.tunnelTwist,initial.tunnelTwist);
});
test("all polar tunnel building blocks match at ±π for all permitted ridge counts",()=>{
  const tau=2*Math.PI;
  const angles=[-Math.PI,Math.PI];
  for(let n=2;n<=12;n++){
    for(const r of [.1,.7,1.8,4.3]){
      for(const t of [0,.7,2.1,8.9]){
        const tw=.63,depth=.74,phase=.41*tau;
        const radial=Math.log(1+r*(.65+depth*3.2));
        const values=angles.map(a=>{
          const turn=a*n+radial*(3+tw*7)-t*.87+phase;
          const counter=a*(n+2)-radial*(2.8+tw*5.2)+t*.62-phase*.7;
          const shell=Math.sin(radial*(14+tw*10)+Math.sin(a*n-t*.57)*1.3-t*.43);
          const scallop=.62+.38*Math.cos(a*n+t*.46);
          return [
            Math.sin(turn),
            Math.cos(counter),
            Math.sin(a*(n+1)+radial*5.4+t*.34),
            shell,
            Math.cos(a*n+radial*3.6+t*.41),
            Math.sin(turn)*Math.cos(counter),
            Math.sin((turn+counter)*.5),
            Math.sin((turn-counter)*.5),
            Math.sin(r*(8+tw*9)/scallop-t*.66+phase),
            Math.cos(a*(n+2)-radial*3.9+t*.33),
          ];
        });
        for(let j=0;j<values[0].length;j++){
          assert.ok(Math.abs(values[0][j]-values[1][j])<1e-9,
            "Polar branch discontinuity at ridge "+n+", harmonic "+j);
        }
      }
    }
  }
  for(const r of [.3,1,3]){
    const colorVoice=a=>.27*Math.sin(a*2+r*3.1-.9)+.22*Math.cos(a*3-r*2.2+.4);
    assert.ok(Math.abs(colorVoice(-Math.PI)-colorVoice(Math.PI))<1e-9);
  }
});

test("Color tab palette shuffle loads a different vault or saved custom palette", async () => {
  const {pickDifferentPalette}=await import("../src/palette-actions.js");
  const choices=[
    {name:"Vault",colors:["#ff0000","#00ff00"]},
    {name:"User palette",colors:["#e624bc","#f4ef0c","#3212ce"]},
    {name:"Other",colors:["#080909","#99eeff"]}
  ];
  const first=pickDifferentPalette(choices,choices[0].colors,()=>0);
  assert.equal(first.index,1,"saved custom palette is included");
  assert.deepEqual(first.colors,choices[1].colors);
  first.colors[0]="#aabbcc";
  assert.equal(choices[1].colors[0],"#e624bc","vault entries must not be mutated");
  const last=pickDifferentPalette(choices,choices[2].colors,()=>.999);
  assert.notDeepEqual(last.colors,choices[2].colors);
  assert.equal(pickDifferentPalette([choices[0]],choices[0].colors),null);
});
test("Shuffle and reverse color stops keep the same colors and survive Undo/recipe round-trip", async () => {
  const {shuffleColorStops,reverseColorStops}=await import("../src/palette-actions.js");
  const original=["#fa19ac","#03e7ef","#f6ff2e","#080811"];
  const shuffled=shuffleColorStops(original,()=>.999);
  assert.notDeepEqual(shuffled,original,"even unlucky random draws must change the order");
  assert.deepEqual([...shuffled].sort(),[...original].sort());
  assert.deepEqual(reverseColorStops(original),[...original].reverse());
  assert.deepEqual(original,["#fa19ac","#03e7ef","#f6ff2e","#080811"]);
  for(const colors of [shuffled,reverseColorStops(original)]){
    const doc=recipeDocument({...initial,palette:-1,colors},"Stops",{time:2,colorTime:4});
    assert.deepEqual(parseDocument(doc).state.colors,colors);
    assert.equal(parseDocument(doc).state.palette,-1);
  }
});
test("Random palette generates vivid, valid and editable 4-8-stop hex colors",async()=>{
  const {generateRandomPalette}=await import("../src/palette-actions.js");
  for(const value of [0,.01,.19,.43,.74,.999]){
    const colors=generateRandomPalette(()=>value);
    assert.ok(colors.length>=4 && colors.length<=8);
    assert.ok(colors.every(c=>/^#[0-9a-f]{6}$/.test(c)));
    assert.ok(new Set(colors).size>=3);
    const doc=recipeDocument({...initial,palette:-1,colors},"Custom colors",{time:3,colorTime:5});
    assert.deepEqual(parseDocument(doc).state.colors,colors);
  }
  // Surprise Me can now invent new palettes without ever generating words.
  const surprise=randomize({...initial,lettering:"MY QUOTE"},{},false,()=>.01);
  assert.equal(surprise.palette,-1);
  assert.ok(surprise.colors.length>=4 && surprise.colors.length<=8);
  assert.equal(surprise.lettering,"");
});
test("All four color actions live in the Color tab and stay undoable via history.change",async()=>{
  const {readFileSync}=await import("node:fs");
  const ui=readFileSync(new URL("../src/components/ColorLab.jsx",import.meta.url),"utf8");
  for(const label of ["Shuffle palette","Random palette","Shuffle stops","Reverse stops"])
    assert.ok(ui.includes(label),label);
  for(const handler of ["shufflePalette","makeRandomPalette","shuffleStops","reverseStops"])
    assert.match(ui,new RegExp("function "+handler+"\\(\\)\\s*\\{\\s*history\\.change\\("));
  assert.match(ui,/customPalettes\],s\.colors/);
  assert.match(ui,/colors:reverseColorStops\(s\.colors\)/);
});

test("Substance Lab modes migrate safely and all seven knobs save via recipes", async()=>{
  const {substanceModes,numericRanges}=await import("../src/data.js");
  assert.equal(substanceModes.length,4);
  const keys=["substanceAmount","substanceScale","substanceMotion",
    "substanceRelief","substanceEdge","substanceHue","substanceVariation"];
  const old={...initial};delete old.substanceMode;
  for(const key of keys)delete old[key];
  const restored=parseDocument(old).state;
  assert.equal(restored.substanceMode,"CMY lithogenesis");
  assert.equal(restored.substanceAmount,0);
  for(const key of keys){
    assert.deepEqual(numericRanges[key],[0,100]);
    const s={...initial,[key]:73};
    assert.equal(parseDocument(recipeDocument(s,"Substance",{time:2,colorTime:4})).state[key],73);
    assert.throws(()=>parseDocument({...s,[key]:101}));
  }
  assert.throws(()=>parseDocument({...initial,substanceMode:"Imaginary"}));
  assert.equal(looks.filter(l=>l.family==="Substance").length,8);
  assert.equal(new Set(looks.filter(l=>l.family==="Substance").map(l=>l.state.substanceMode)).size,4);
  assert.ok(looks.filter(l=>l.family==="Substance").every(l=>!l.state.lettering));
});
test("Substance Lab changes species in Surprise Me but keeps manual quote empty",async()=>{
  for(const v of [.1,.27,.49,.81,.99]){
    const s=randomize({...initial,substanceMode:"CMY lithogenesis",lettering:"I OWN THE WORDS"},{},false,()=>v);
    assert.notEqual(s.substanceMode,"CMY lithogenesis");
    assert.ok(s.substanceScale>=20 && s.substanceMotion>=24);
    assert.ok(Number.isFinite(s.substanceVariation));
    assert.equal(s.lettering,"");
  }
  const m=randomize({...initial,substanceMode:"Chitin interference",substanceAmount:80},{},true,()=>.8);
  assert.equal(m.substanceMode,"Chitin interference");
  assert.notEqual(m.substanceAmount,80);
});
test("Substance shader is opt-in, palette-linked and uses safe mobile fallback",async()=>{
  const {readFileSync}=await import("node:fs");
  const code=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
  const source=readFileSync(new URL("../src/substance.js",import.meta.url),"utf8");
  assert.match(code,/withSubstance = s\.substanceAmount>0/);
  assert.match(code,/livingSubstance\(col,uv,p,v\)/);
  assert.match(code,/substanceUnavailable=true/);
  assert.match(code,/substanceMode/);
  assert.match(source,/Pigment organelles/);
  assert.match(source,/float mink=mix\(length\(delta\)/);
  assert.match(source,/vec3 pigment=palette\(gradient\)/);
});
