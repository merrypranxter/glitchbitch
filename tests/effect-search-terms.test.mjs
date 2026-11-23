import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { effectSearchTerms } from "../src/effect-search-terms.js";
import { effectDetails } from "../src/effect-details.js";
import { sections } from "../src/ui-index.js";

const source = readFileSync(new URL("../src/components/Inspectors.jsx", import.meta.url), "utf8");
const inspector = source.slice(source.indexOf("export function EffectsInspector"));
const bodyStart = inspector.indexOf("  const body = {");
const body = inspector.slice(bodyStart, inspector.indexOf("\n  };", bodyStart));
const vocabulary = new Set(Object.values(effectSearchTerms).flat());

test("every Effects label and original bound field is included in global search vocabulary", () => {
  const expected = new Set([
    ...[...body.matchAll(/\b(?:label|name)="([^"]+)"/g)].map((match) => match[1]),
    ...[...body.matchAll(/\b(?:value|checked)=\{s\.([a-zA-Z]\w*)/g)].map((match) => match[1]),
  ]);
  assert.ok(expected.size > 600, "audit covers the full Effects inspector");
  for (const term of expected) assert.ok(vocabulary.has(term), `Unsearchable control: ${term}`);
  for (const term of ["bloom", "posterize", "invert", "Bloom", "Posterize", "Invert"])
    assert.ok(effectSearchTerms["fx-toggles"].includes(term), term);
});

test("search terms have real destinations and every Effects section is represented", () => {
  const effectSections = sections.filter((section) => section.tab === "Effects");
  const destinations = new Set([...effectSections, ...effectDetails].map((entry) => entry.id));
  for (const [id, terms] of Object.entries(effectSearchTerms)) {
    assert.ok(destinations.has(id), `Unknown destination: ${id}`);
    assert.equal(new Set(terms).size, terms.length, `Duplicate terms in ${id}`);
    assert.ok(terms.every((term) => typeof term === "string" && term.trim()), id);
  }
  for (const entry of [...effectSections, ...effectDetails])
    assert.ok(effectSearchTerms[entry.id]?.length, `No search vocabulary: ${entry.id}`);
});

test("specialist controls resolve to the deepest existing laboratory", () => {
  const cases = [
    ["filamentRetroLead", "Needle future lookahead", "filament-retrocausal"],
    ["filamentChladniDetune", "Detune / broken symmetry", "filament-chladni"],
    ["filamentOpticsThickness", "First fiber film thickness", "filament-optics-a"],
    ["filamentSecondOpticsDispersion", "Second fiber dispersion", "filament-optics-b"],
    ["filamentNeuralCoupling", "Synaptic coupling / thread synchrony", "filament-neural"],
    ["atmoBAmount", "Second parent presence", "atmosphere-breeder"],
    ["atmoMaskScale", "Habitat coverage / scale", "atmosphere-habitats"],
    ["bioFeed", "Feed", "bio"],
  ];
  for (const [field, label, id] of cases) {
    assert.ok(effectSearchTerms[id].includes(field), `${field} targets ${id}`);
    // Field names are unique, so a direct field query has one precise route.
    assert.deepEqual(Object.keys(effectSearchTerms).filter((key) => effectSearchTerms[key].includes(field)), [id]);
    assert.ok(effectSearchTerms[id].includes(label), label);
  }
});

test("actions and local recipe controls remain searchable alongside sliders", () => {
  for (const [id, terms] of [
    ["fossil-resurrection", ["Revival method", "Revive oldest ancestor", "Raise the whole graveyard"]],
    ["fossil-echoes", ["Evolutionary pressure", "Ancestral influence · %", "Evolve ancestral generation"]],
    ["chaos-lab", ["Preserve my colors", "Full weird shuffle"]],
    ["filament-retrocausal", ["Temporal embroidery score", "Sew selected temporal score"]],
  ]) for (const term of terms) assert.ok(effectSearchTerms[id].includes(term), `${id}: ${term}`);
});
