import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { initial } from "../src/data.js";
import { sections, actions, findControls, sectionActive, sectionMeta, effectGroups } from "../src/ui-index.js";

test("every section's on/reset keys exist in the default state", () => {
  for (const s of sections)
    for (const k of [...(s.on || []), ...(s.reset || [])])
      assert.notEqual(initial[k], undefined, `${s.id}: ${k}`);
});

test("section ids are unique and every inspector section id is indexed", () => {
  const ids = sections.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
  const ui = ["Inspectors.jsx", "ColorLab.jsx"].map((f) =>
    readFileSync(new URL(`../src/components/${f}`, import.meta.url), "utf8")).join("\n");
  for (const [, id] of ui.matchAll(/<Section[^>]*?\bid="([^"]+)"/gs))
    assert.ok(sectionMeta(id), `Section id="${id}" missing from ui-index`);
  const effects = readFileSync(new URL("../src/components/Inspectors.jsx", import.meta.url), "utf8");
  for (const s of sections.filter((x) => x.tab === "Effects" && x.id !== "fx-toggles")) {
    assert.ok(effectGroups.includes(s.group), `${s.id} has a filter group`);
    assert.match(effects, new RegExp(`\\b${s.id}: <>`), `${s.id} has controls`);
  }
});

test("headers stay short enough to scan", () => {
  for (const s of sections) assert.ok(s.title.length <= 26, s.title);
});

test("Find ranks real controls for the words people type", () => {
  assert.equal(findControls("scanlines")[0].id, "analog");
  assert.equal(findControls("outline")[0].id, "text-color");
  assert.equal(findControls("kaleidoscope")[0].id, "shape");
  assert.equal(findControls("gradient")[0].pane, "Color");
  assert.equal(findControls("export")[0].kind, "action");
  assert.deepEqual(findControls("   "), []);
  assert.deepEqual(findControls("zzqqxx"), []);
  assert.ok(actions.every((a) => a.keywords.length));
});

test("ON dots reflect the actual state", () => {
  const photon = sectionMeta("photon");
  assert.equal(sectionActive(photon, { ...initial, photonAmount: 0 }), false);
  assert.equal(sectionActive(photon, { ...initial, photonAmount: 40 }), true);
  assert.equal(sectionActive(sectionMeta("shape"), initial), false, "no `on` keys = never dotted");
});
