import test from "node:test";
import assert from "node:assert/strict";
import { effectActivity } from "../src/effect-activity.js";

const colony = {atmoAmount:80, atmoMaskMode:"Painted colonies",
  habitatStamps:[{id:"a",parent:0,x:.4,y:.5,radius:.2,gene:42}],
  geneAmount:80};

test("activity includes quick switches and engine-driven stereo", () => {
  assert.equal(effectActivity("fx-toggles", {bloom:true}), true);
  assert.equal(effectActivity("fx-toggles", {}), false);
  assert.equal(effectActivity("bio", {engine:15,bioAmount:0}), true);
  assert.equal(effectActivity("bio", {engine:0,blend:40,secondaryEngine:15}), true);
  assert.equal(effectActivity("stereo", {engine:16,stereoAmount:0}), true);
  assert.equal(effectActivity("stereo", {engine:0,blend:20,secondaryEngine:16}), true);
});

test("unused ecological tuning and historical counters are not active", () => {
  for (const id of ["colony-life", "colony-cortex", "colony-anatomy", "spore-dynasty",
    "mutation-bloodlines", "speciation-lab", "coevolution-lab"])
    assert.equal(effectActivity(id, {colonyLifeAmount:80,colonyCortexAmount:80,
      colonyAnatomyAmount:80,sporeAmount:80,geneAmount:80,coevoRound:4}), false, id);
  assert.equal(effectActivity("apocalypse-clock", {apocalypseAmount:90,
    apocalypseMode:"Dormant",substrateAmount:80,substrateMode:"Nutrient rivers"}), false);
  assert.equal(effectActivity("fossil-record", {fossilAmount:80,
    fossilMode:"Ancestral compost",substrateAmount:80,substrateMode:"Nutrient rivers"}), false);
});

test("living systems follow the existing renderer prerequisites", () => {
  assert.equal(effectActivity("mutation-bloodlines", colony), true);
  assert.equal(effectActivity("colony-life", {...colony,colonyLifeAmount:80,colonyLifeMode:"Breathe"}), true);
  assert.equal(effectActivity("colony-life", {...colony,colonyLifeAmount:80,colonyLifeMode:"Still"}), false);
  assert.equal(effectActivity("colony-cortex", {...colony,colonyCortexAmount:80}), true);
  assert.equal(effectActivity("spore-dynasty", {...colony,sporeAmount:80,sporeMode:"Dormant"}), false);
  assert.equal(effectActivity("speciation-lab", colony), false);
  assert.equal(effectActivity("speciation-lab", {...colony,habitatStamps:[{...colony.habitatStamps[0],clade:"A-1"}]}), true);
  assert.equal(effectActivity("coevolution-lab", {...colony,coevoRound:1}), true);
  assert.equal(effectActivity("signal", colony), undefined);
  assert.equal(effectActivity("chaos-lab", colony), false);
});
