import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,randomize,validateRecipe} from "../src/data.js";
import {hasSemanticLettering} from "../src/semantic-gravity.js";
import {normalTextBlendState} from "../src/text-blend-proof.js";

const code=path=>readFileSync(new URL("../src/"+path,import.meta.url),"utf8");
const sample={...initial,
  lettering:"HONEST PIXELS ONLY",letteringAmount:93,
  letteringBlendMode:"Difference",letteringBlendStrength:70,
  filamentAmount:92,filamentSpecies:"Quasicrystal Brocade",
  filamentSecondSpecies:"Feral Jacquard",filamentCrossbreed:77,
  filamentStitchMode:"Retrocausal Embroidery",filamentStitchAmount:94,
  filamentOpticsMode:"Soap-film opal",filamentOpticsAmount:83,
  semanticGravityMode:"Orbital script",semanticGravityAmount:90};

test("real authored glyph geometry is active in A/B, even if final letters are omitted",()=>{
  assert.ok(hasSemanticLettering(sample));
  const normal=normalTextBlendState(sample);
  assert.ok(hasSemanticLettering(normal));
  assert.equal(normal.lettering,sample.lettering);
  assert.equal(normal.letteringAmount,sample.letteringAmount);
  assert.equal(normal.filamentAmount,sample.filamentAmount);
  assert.equal(normal.semanticGravityMode,sample.semanticGravityMode);
  assert.equal(normal.semanticGravityAmount,sample.semanticGravityAmount);
  assert.equal(normal.letteringBlendMode,"Normal");
  assert.equal(sample.letteringBlendMode,"Difference");
});
test("still-frame API can suppress JUST composited letters, never changing shader state",()=>{
  const exporter=code("export.js"),ui=code("components/ExportDialog.jsx");
  assert.match(exporter,/renderImage\(state, timeline, longEdge = 2160,/);
  assert.match(exporter,/exactEffects=true,compositeLettering=true/);
  assert.match(exporter,/if \(compositeLettering && hasVisibleLettering\(state\)\)/);
  assert.match(exporter,/renderer\.draw\(state, timeline, width, height\)/);
  assert.match(ui,/renderImage\(snapshot,timeline,480,\s*"image\/png",\{compositeLettering:false\}\)/);
  assert.doesNotMatch(ui,/renderImage\(withoutTextForExport\(snapshot\),timeline,480\)/);
  assert.match(ui,/analyzeTextExportFrames\(/);
  assert.match(ui,/Text overlay hidden · thread physics preserved/);
});
test("semantic shader uses same compositor but stable Normal geometry mask for all visible text blends",()=>{
  const renderer=code("renderer.js");
  assert.match(renderer,/normalTextBlendState\(state\)/);
  assert.match(renderer,/paintLettering\(semanticGlyphContext,glyphLayoutState,timeline,maskW,maskH,true\)/);
  assert.match(renderer,/if\(hasSemanticLettering\(compiledState\)\)/);
  assert.match(renderer,/gl\.uniform1i\(loc\("semanticGlyphTex"\),6\)/);
  assert.match(renderer,/withSemantic\?semanticGravityGLSL/);
  assert.match(renderer,/if\(exactEffects\)throw artworkParityError\(/);
  assert.match(renderer,/gl\.texImage2D\(gl\.TEXTURE_2D,0,gl\.RGBA,gl\.RGBA,gl\.UNSIGNED_BYTE,/);
});
test("a failed preview draw cannot permanently kill requestAnimationFrame",()=>{
  const canvas=code("ArtCanvas.jsx");
  assert.match(canvas,/if\(!renderer\.draw\(state, timelineRef\.current, dims\.width, dims\.height\)\)/);
  assert.match(canvas,/renderRetryAt=now\+1800/);
  assert.match(canvas,/frame=requestAnimationFrame\(tick\);\s*return;\s*\}\s*if \(/);
  assert.match(canvas,/failedState!==state \|\| failedSize!==sizeKey/);
  assert.match(canvas,/failedFontRevision!==fontRevision/);
  assert.match(canvas,/setError\(""\)/);
  // The user must also be able to force a new renderer even after repeated GPU errors.
  assert.match(canvas,/onClick=\{\(\) => setRetry\(\(x\) => x \+ 1\)\}/);
});
test("Mutate does not secretly alter dormant Feral or Chladni controls",()=>{
  const inactive={...initial,filamentAmount:0,
    filamentSpecies:"Feral Jacquard",
    filamentSecondSpecies:"Feral Jacquard",
    filamentCrossbreed:0,
    filamentStitchMode:"Chladni Needle Orchestra",
    filamentStitchAmount:90};
  const unseen=randomize(inactive,{},true,()=>.81);
  for(const key of ["filamentFeralCorruption","filamentFeralMigration",
    "filamentFeralOrder","filamentFeralKnots","filamentFeralMutation",
    "filamentChladniOrder","filamentChladniResonance",
    "filamentChladniDensity","filamentChladniPhase","filamentChladniDetune"])
    assert.equal(unseen[key],inactive[key],key);
  const hiddenSecond={...initial,filamentAmount:80,
    filamentSpecies:"Fivefold brocade",filamentSecondSpecies:"Feral Jacquard",
    filamentCrossbreed:0};
  const noHybrid=randomize(hiddenSecond,{},true,()=>.81);
  for(const key of ["filamentFeralCorruption","filamentFeralMigration",
    "filamentFeralOrder","filamentFeralKnots","filamentFeralMutation"])
    assert.equal(noHybrid[key],hiddenSecond[key],key);
  const active={...initial,filamentAmount:90,filamentSpecies:"Feral Jacquard",
    filamentStitchMode:"Chladni Needle Orchestra",filamentStitchAmount:80};
  const edited=randomize(active,{},true,()=>.81);
  assert.notEqual(edited.filamentFeralMigration,active.filamentFeralMigration);
  assert.notEqual(edited.filamentChladniOrder,active.filamentChladniOrder);
  assert.equal(validateRecipe(edited).filamentSpecies,"Feral Jacquard");
});
