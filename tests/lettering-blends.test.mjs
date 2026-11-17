import test from "node:test";
import assert from "node:assert/strict";
import {letteringBlendGroups, letteringBlendModes, getLetteringBlendRecipe, letteringBlendPulse} from "../src/lettering-blends.js";
import {validateRecipe, initial} from "../src/data.js";

test("All 44 mode names are unique and categorized",()=>{
  assert.equal(letteringBlendModes.length,44);
  assert.equal(new Set(letteringBlendModes).size,44);
  assert.deepEqual(letteringBlendGroups.flatMap(g=>g.modes),letteringBlendModes);
});
test("Standard blend modes are native CSS + Canvas, not fake filters",()=>{
  for(const mode of ["Multiply","Overlay","Difference","Screen","Soft light","Hard light","Color dodge","Color burn","Exclusion","Hue","Color","Luminosity"]){
    const r=getLetteringBlendRecipe(mode);
    assert.equal(r.exact,true,mode);
    assert.equal(typeof r.cssBlend,"string");
    assert.equal(typeof r.canvasBlend,"string");
    assert.equal(r.filter,"none");
  }
});
test("Every experimental mode has an explicit recipe",()=>{
  for(const mode of letteringBlendModes){
    const r=getLetteringBlendRecipe(mode,72);
    assert.equal(r.mode,mode);
    assert.equal(r.strength,.72);
    assert.ok(r.cssBlend);
    assert.ok(r.canvasBlend);
    assert.ok(Array.isArray(r.passes));
  }
});
test("0 strength leaves ordinary text visible and missing values use 100%",()=>{
  assert.equal(getLetteringBlendRecipe("Difference",0).strength,0);
  assert.equal(getLetteringBlendRecipe("Difference",100).strength,1);
  assert.equal(getLetteringBlendRecipe("Difference").strength,1);
  assert.equal(getLetteringBlendRecipe("Strange old mode").mode,"Normal");
});
test("Negative and strobe modes change deterministically over time",()=>{
  assert.notEqual(letteringBlendPulse("negative-blink",0),letteringBlendPulse("negative-blink",.5));
  assert.notEqual(letteringBlendPulse("strobe-xor",0),letteringBlendPulse("strobe-xor",.3));
  assert.equal(letteringBlendPulse(null,5),1);
});
test("Blend modes round-trip through recipes and support extra text layers",()=>{
  const obj={...initial,engine:0,lettering:"Hi",
    letteringBlendMode:"Vivid light",letteringBlendStrength:63,
    letteringLayers:[{id:"one",text:"Second",visible:true,
      letteringBlendMode:"Difference",letteringBlendStrength:44}]};
  const saved=validateRecipe(obj);
  assert.equal(saved.letteringBlendMode,"Vivid light");
  assert.equal(saved.letteringBlendStrength,63);
  assert.equal(saved.letteringLayers[0].letteringBlendMode,"Difference");
  assert.equal(saved.letteringLayers[0].letteringBlendStrength,44);
  assert.equal(validateRecipe({...initial,engine:0,lettering:"Old"}).letteringBlendMode,"Normal");
  assert.throws(()=>validateRecipe({...obj,letteringBlendMode:"garbage"}),/Unknown letteringBlendMode/);
});
