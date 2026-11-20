import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { initial, wiggleModes, numericRanges, parseDocument, recipeDocument, randomize, looks } from "../src/data.js";

test("pseudo-stereo remains off for legacy art and all 143 lookbook recipes", () => {
  const old={...initial};
  for(const key of ["wiggleAmount","wiggleDepth","wiggleSpeed","wiggleLayers","wiggleMode"])
    delete old[key];
  const migrated=parseDocument(old).state;
  assert.equal(migrated.wiggleAmount,0);
  assert.equal(migrated.wiggleMode,"Flipbook");
  assert.equal(looks.length,143);
  assert.ok(looks.every(look=>parseDocument(look.state).state.wiggleAmount>=0));
});

test("all wiggle modes, bounds and timeline survive saved recipe round trips", () => {
  for(const mode of wiggleModes) {
    const art={...initial,wiggleMode:mode,wiggleAmount:67,
      wiggleDepth:72,wiggleSpeed:48,wiggleLayers:62};
    const doc=recipeDocument(art,"My own words",{time:2.5,colorTime:9.1});
    assert.equal(parseDocument(doc).state.wiggleMode,mode);
    assert.equal(parseDocument(doc).state.wiggleAmount,67);
    assert.equal(parseDocument(doc).timeline.time,2.5);
  }
  assert.deepEqual(wiggleModes,["Flipbook","Smooth orbit","Hold left","Hold right"]);
  for(const key of ["wiggleAmount","wiggleDepth","wiggleSpeed","wiggleLayers"]){
    assert.deepEqual(numericRanges[key],[0,100]);
    assert.throws(()=>parseDocument({...initial,[key]:-1}));
    assert.throws(()=>parseDocument({...initial,[key]:101}));
  }
  assert.throws(()=>parseDocument({...initial,wiggleMode:"Broken view"}));
});

test("Surprise Me can activate stereo, while Mutate preserves artist words", () => {
  const input={...initial,lettering:"MY WORDS",wiggleMode:"Flipbook"};
  const surprise=randomize(input,{},false,()=>.42);
  assert.ok(surprise.wiggleAmount>0);
  assert.notEqual(surprise.wiggleMode,input.wiggleMode);
  assert.equal(surprise.lettering,"");
  const mutated=randomize({...input,wiggleAmount:50},{},true,()=>.8);
  assert.equal(mutated.lettering,"MY WORDS");
  assert.ok(mutated.wiggleAmount>50);
});

test("shader is opt-in with a GPU fallback, shared by PNG/GIF/MP4 exports", () => {
  const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
  const shader=readFileSync(new URL("../src/wiggle.js",import.meta.url),"utf8");
  const exports=readFileSync(new URL("../src/export.js",import.meta.url),"utf8");
  assert.match(renderer,/withWiggle = s.wiggleAmount > 0/);
  assert.match(renderer,/wiggleCoordinates\(p\)/);
  assert.match(renderer,/wiggleUnavailable=true/);
  assert.match(renderer,/loc\("wiggleMode"\)/);
  assert.match(shader,/sin\(phase\)>=0\. \? 1\. : -1\./);
  assert.match(shader,/noise\(p\*density/);
  assert.match(exports,/createRenderer/);
  assert.doesNotMatch(shader,/sampler2D|raymarch|texture2D/);
});
