import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { engineInfo, engines, initial, looks, parseDocument, randomize } from "../src/data.js";
import { strangeFieldsGLSL } from "../src/strange-fields.js";
import { findControls } from "../src/ui-index.js";

const newNames = ["Schottky Lace", "Sigil Glass", "Moiré DNA"];
const newLooks = [
  "Schottky Candy Chapel",
  "Inversion Organism",
  "Prismatic Sigil Glass",
  "Hexagram Broadcast Temple",
  "Floral Moiré Fever",
  "Birefringent DNA Garden",
];

test("shader-vault mutants append three engines without renumbering the original seventeen", () => {
  assert.deepEqual(engines.slice(17), newNames);
  assert.equal(engines.length, 20);
  assert.equal(engineInfo[16].name, "Stereo Ghost Machine");
  for (const kind of [17, 18, 19]) {
    const recipe = parseDocument({ ...initial, engine: kind }).state;
    assert.equal(recipe.engine, kind);
    const secondary = parseDocument({ ...initial, secondaryEngine: kind, blend: 50 }).state;
    assert.equal(secondary.secondaryEngine, kind);
  }
  assert.throws(() => parseDocument({ ...initial, engine: 20 }));
});

test("six editable looks round-trip, inherit palette, and never generate captions", () => {
  for (const name of newLooks) {
    const look = looks.find((l) => l.name === name);
    assert.ok(look, name);
    assert.equal(look.family, "Mathematical Mutants");
    assert.deepEqual(parseDocument(look.state).state, look.state);
    assert.equal(look.state.lettering, "");
    assert.ok(look.state.engine >= 17);
  }
  assert.equal(looks.length, 152);
  const surprised = randomize(initial, {}, false, () => 0.6);
  assert.ok(engines.includes(engines[surprised.engine]));
  assert.equal(surprised.lettering, "");
});

test("new fields have bounded mobile loops, shared time, and full palette-independent scalar output", () => {
  for (const fn of ["strangeSchottky", "strangeSigil", "strangeMoireDNA", "strangeField"]) {
    assert.match(strangeFieldsGLSL, new RegExp("float " + fn + "\\("));
  }
  assert.match(strangeFieldsGLSL, /for\(int i=0;i<8;i\+\+\)/);
  assert.match(strangeFieldsGLSL, /max\(rr,\.025\)/);
  assert.match(strangeFieldsGLSL, /time/);
  assert.doesNotMatch(strangeFieldsGLSL, /sampler2D|texture2D|gl_FragColor/);
});

test("new engines use the normal drawing/export pipeline with defensive compile fallback", () => {
  const code = readFileSync(new URL("../src/renderer.js", import.meta.url), "utf8");
  assert.match(code, /import \{ strangeFieldsGLSL \} from "\.\/strange-fields\.js"/);
  assert.match(code, /kind==17 \|\| kind==18 \|\| kind==19/);
  assert.match(code, /withStrange \? strangeFieldsGLSL/);
  assert.match(code, /strangeUnavailable=true/);
  assert.match(code, /secondaryEngine: source\.secondaryEngine>=17/);
  assert.match(code, /gl\.drawArrays\(gl\.TRIANGLES, 0, 6\)/);
  for (const q of ["kleinian", "sigil glass", "moiré dna"])
    assert.ok(findControls(q).some((x) => x.id === "engine"), q);
});
