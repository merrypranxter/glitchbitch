import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { effectDetails } from "../src/effect-details.js";
import { initial } from "../src/data.js";

const active = (id, state) => effectDetails.find((entry) => entry.id === id).active(state);

test("every nested effect target has one real inspector anchor", () => {
  const source = readFileSync(new URL("../src/components/Inspectors.jsx", import.meta.url), "utf8");
  const anchors = [...source.matchAll(/data-effect-detail="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(effectDetails.map((entry) => entry.id)).size, effectDetails.length);
  for (const entry of effectDetails) {
    assert.equal(anchors.filter((id) => id === entry.id).length, 1, entry.id);
    assert.ok(entry.keywords.length, entry.id);
    assert.equal(entry.active(initial), false, entry.id);
  }
});

test("dependent filament systems are inactive when a required parent is dormant", () => {
  const configured = {
    ...initial, filamentAmount: 80,
    filamentNeuralMode: "Axon train", filamentNeuralAmount: 80,
    filamentPlasticMode: "Hebbian bloom", filamentPlasticAmount: 80,
    filamentScarMode: "Phosphor aftertrace", filamentScarAmount: 80,
    filamentRegenMode: "Darning ladder", filamentRegenAmount: 80,
  };
  for (const id of ["filament-neural", "filament-plasticity", "filament-scars", "filament-regeneration"]) {
    assert.equal(active(id, configured), true, id);
    assert.equal(active(id, { ...configured, filamentAmount: 0 }), false, id);
    assert.equal(active(id, { ...configured, filamentNeuralMode: "Off" }), false, id);
  }
  assert.equal(active("filament-regeneration", { ...configured, filamentScarAmount: 0 }), false);
  assert.equal(active("filament-regeneration", { ...configured, filamentScarMode: "Off" }), false);
});

test("morphing and contagion require a material change, not just stored strength", () => {
  const configured = {
    ...initial, filamentAmount: 80, filamentMorphMode: "Seam sweep", filamentMorphAmount: 80,
    filamentMorphTarget: initial.filamentMaterial,
    filamentContagionMode: "Stitch relay", filamentContagionAmount: 80,
  };
  for (const id of ["filament-morph", "filament-contagion"]) {
    assert.equal(active(id, configured), false, id);
    assert.equal(active(id, { ...configured, filamentMorphTarget: "Pearl floss" }), true, id);
    assert.equal(active(id, { ...configured, filamentMorphTarget: "Pearl floss", filamentMorphMode: "Off" }), false, id);
  }
});

test("second fiber optics require a visible hybrid parent", () => {
  const configured = {
    ...initial, filamentAmount: 80, filamentSecondOpticsMode: "Thin-film iridescence",
    filamentSecondOpticsAmount: 80,
  };
  assert.equal(active("filament-optics-b", configured), false);
  assert.equal(active("filament-optics-b", { ...configured, filamentCrossbreed: 70 }), true);
  assert.equal(active("filament-optics-b", { ...configured, filamentCrossbreed: 70, filamentSecondOpticsMode: "Off" }), false);
});

test("specialized geometry and stitch labs follow the selected law", () => {
  const configured = { ...initial, filamentAmount: 80, filamentStitchAmount: 80 };
  assert.equal(active("filament-feral", configured), false);
  assert.equal(active("filament-feral", { ...configured, filamentSpecies: "Feral Jacquard" }), true);
  assert.equal(active("filament-quasi", { ...configured, filamentSecondSpecies: "Quasicrystal Brocade", filamentCrossbreed: 70 }), true);
  assert.equal(active("filament-chladni", { ...configured, filamentStitchMode: "Chladni Needle Orchestra" }), true);
  assert.equal(active("filament-retrocausal", { ...configured, filamentStitchMode: "Retrocausal Embroidery" }), true);
  assert.equal(active("filament-retrocausal", { ...configured, filamentStitchMode: "Retrocausal Embroidery", filamentStitchAmount: 0 }), false);
});

test("semantic gravity requires visible words and one-shot fossil actions are not active effects", () => {
  const configured = { ...initial, filamentAmount: 80, semanticGravityMode: "Letter attraction", semanticGravityAmount: 80 };
  assert.equal(active("filament-semantic", configured), false);
  assert.equal(active("filament-semantic", { ...configured, lettering: "weird", letteringAmount: 80 }), true);
  assert.equal(active("filament-semantic", { ...configured, letteringLayers: [{ text: "weird", letteringAmount: 80, visible: true }] }), true);
  assert.equal(active("filament-semantic", { ...configured, letteringLayers: [{ text: "weird", letteringAmount: 80, visible: false }] }), false);
  assert.equal(active("fossil-resurrection", configured), false);
  assert.equal(active("fossil-echoes", configured), false);
});

test("atmosphere habitat and second-parent activity follow visible parents", () => {
  assert.equal(active("atmosphere-breeder", { ...initial, atmoBAmount: 70 }), true);
  assert.equal(active("atmosphere-habitats", { ...initial, atmoMaskMode: "Bloom iris" }), false);
  assert.equal(active("atmosphere-habitats", { ...initial, atmoMaskMode: "Bloom iris", atmoAmount: 70 }), true);
});
