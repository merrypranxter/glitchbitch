import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,numericRanges,validateRecipe,recipeDocument,parseDocument,randomize} from "../src/data.js";
import {sectionMeta,findControls} from "../src/ui-index.js";
import {filamentSpecies,filamentStitchModes,filamentGLSL,specializeFilamentGeometry,
  specializeFilamentStitchMotion} from "../src/filament-forge.js";
import {semanticGravityModes,semanticGravityDescriptions,semanticGravityPresets,
  semanticGravityControls,hasSemanticLettering,applySemanticGravityPreset,
  remixSemanticGravity,disableSemanticGravity,semanticGravityGLSL
} from "../src/semantic-gravity.js";
const code=p=>readFileSync(new URL("../src/"+p,import.meta.url),"utf8");
const bal=s=>(s.match(/\{/g)||[]).length-(s.match(/\}/g)||[]).length;
const artwork={...initial,seed:371920,engine:6,ratio:"9:16",
  colors:["#ff00ff","#00eaff","#eeff00"],lettering:"MY WORDS BEND THIS LOOM",
  letteringAmount:96,letteringFont:"original",letteringX:40,letteringY:53,
  filamentAmount:90,filamentSpecies:"Quasicrystal Brocade",
  filamentSecondSpecies:"Feral Jacquard",filamentCrossbreed:76,
  filamentStitchMode:"Retrocausal Embroidery",filamentStitchAmount:85,
  filamentOpticsMode:"Soap-film opal",filamentOpticsAmount:85};

test("seven glyph-responsive laws, seven recipes, no new fiber IDs",()=>{
  assert.equal(semanticGravityModes.length,8);
  assert.equal(semanticGravityModes[0],"Off");
  assert.equal(semanticGravityPresets.length,7);
  assert.equal(new Set(semanticGravityPresets.map(p=>p.name)).size,7);
  assert.equal(filamentSpecies.length,24);
  assert.equal(filamentStitchModes.length,33);
  for(const name of semanticGravityModes)assert.ok(semanticGravityDescriptions[name],name);
  assert.deepEqual(semanticGravityPresets.map(p=>p.semanticGravityMode),
    semanticGravityModes.slice(1));
});
test("all six fields save, validate and default Off for legacy art",()=>{
  assert.equal(initial.semanticGravityMode,"Off");
  assert.equal(initial.semanticGravityAmount,0);
  assert.equal(semanticGravityControls.length,6);
  const legacy={...artwork};
  delete legacy.semanticGravityMode;
  for(const name of semanticGravityControls)delete legacy[name];
  const loaded=validateRecipe(legacy);
  assert.equal(loaded.semanticGravityMode,"Off");
  assert.equal(loaded.semanticGravityAmount,0);
  for(const name of semanticGravityControls){
    assert.deepEqual(numericRanges[name],[0,100],name);
    assert.equal(loaded[name],initial[name],name);
    assert.throws(()=>validateRecipe({...artwork,[name]:101}),new RegExp("Invalid "+name));
    assert.throws(()=>validateRecipe({...artwork,[name]:-1}),new RegExp("Invalid "+name));
  }
  assert.throws(()=>validateRecipe({...artwork,semanticGravityMode:"Impossible"}),
    /Unknown semanticGravityMode/);
});
test("visible author text gates the GPU field; extra layers work, hidden text does not",()=>{
  assert.ok(!hasSemanticLettering({...artwork,semanticGravityMode:"Off",
    semanticGravityAmount:100}));
  assert.ok(!hasSemanticLettering({...artwork,letteringAmount:0,semanticGravityAmount:89,
    semanticGravityMode:"Glyph attraction"}));
  assert.ok(!hasSemanticLettering({...artwork,lettering:"  ",semanticGravityAmount:89,
    semanticGravityMode:"Glyph attraction"}));
  assert.ok(!hasSemanticLettering({...artwork,filamentAmount:0,semanticGravityAmount:89,
    semanticGravityMode:"Glyph attraction"}));
  assert.ok(hasSemanticLettering({...artwork,semanticGravityAmount:89,
    semanticGravityMode:"Glyph attraction"}));
  assert.ok(hasSemanticLettering({...artwork,lettering:"",letteringAmount:0,
    letteringLayers:[{text:"EXTRA FONT",visible:true,letteringAmount:81}],
    semanticGravityMode:"Orbital script",semanticGravityAmount:89}));
  assert.ok(!hasSemanticLettering({...artwork,lettering:"",letteringAmount:0,
    letteringLayers:[{text:"EXTRA",visible:false,letteringAmount:81}],
    semanticGravityMode:"Orbital script",semanticGravityAmount:89}));
  assert.ok(!hasSemanticLettering({...artwork,lettering:"",letteringAmount:0,
    letteringLayers:[{text:"EXTRA",visible:true,letteringAmount:0}],
    semanticGravityMode:"Orbital script",semanticGravityAmount:89}));
});
test("all seven word-warping presets preserve user's actual words and textile configurations",()=>{
  for(const preset of semanticGravityPresets){
    const applied=applySemanticGravityPreset(artwork,preset.name);
    assert.equal(applied.semanticGravityMode,preset.semanticGravityMode);
    assert.ok(hasSemanticLettering(applied));
    for(const key of semanticGravityControls)assert.equal(applied[key],preset[key],key);
    for(const key of ["lettering","letteringAmount","letteringFont","letteringX",
      "letteringY","colors","filamentSpecies","filamentSecondSpecies",
      "filamentCrossbreed","filamentOpticsMode","filamentOpticsAmount",
      "filamentStitchMode","seed","ratio"])
      assert.deepEqual(applied[key],artwork[key],key);
    const valid=validateRecipe(applied);
    assert.deepEqual(valid,applied);
    assert.deepEqual(parseDocument(recipeDocument(applied,"Letter gravity",
      {time:1.7,colorTime:3.2,textTime:4.4})).state,applied);
  }
  assert.equal(applySemanticGravityPreset(artwork,"no such option"),artwork);
});
test("targeted shuffles do not generate words, change a font or overwrite palette/hybrids",()=>{
  for(const n of [0,.17,.56,.999999,NaN]){
    for(const feral of [false,true]){
      const f=()=>n;
      const changed=remixSemanticGravity(artwork,f,feral);
      assert.deepEqual(changed,remixSemanticGravity(artwork,f,feral));
      assert.ok(semanticGravityModes.includes(changed.semanticGravityMode));
      assert.notEqual(changed.semanticGravityMode,"Off");
      for(const key of ["lettering","letteringAmount","letteringFont","colors","seed",
        "filamentSpecies","filamentSecondSpecies","filamentStitchMode",
        "filamentOpticsMode"])
        assert.deepEqual(changed[key],artwork[key],key);
      for(const key of semanticGravityControls)
        assert.ok(changed[key]>=0&&changed[key]<=100,key);
      assert.deepEqual(validateRecipe(changed),changed);
    }
  }
  const switched=disableSemanticGravity(applySemanticGravityPreset(artwork,
    semanticGravityPresets[0].name));
  assert.equal(switched.semanticGravityMode,"Off");
  assert.equal(switched.semanticGravityAmount,0);
  assert.equal(switched.lettering,artwork.lettering);
});
test("Mutate changes semantic parameters only while genuine visible authored words interact",()=>{
  const invisible=randomize(artwork,{},true,()=>.84);
  for(const key of semanticGravityControls)
    assert.equal(invisible[key],artwork[key],"old art changes? "+key);
  const applied=applySemanticGravityPreset(artwork,semanticGravityPresets[0].name);
  const changed=randomize(applied,{},true,()=>.84);
  assert.equal(changed.semanticGravityMode,applied.semanticGravityMode);
  assert.notEqual(changed.semanticGravityAmount,applied.semanticGravityAmount);
  assert.notEqual(changed.semanticGravityRadius,applied.semanticGravityRadius);
  assert.equal(changed.lettering,applied.lettering);
});
test("actual glyph alpha gradients act on fiber geometry before species + stitches",()=>{
  assert.equal(bal(semanticGravityGLSL),0);
  assert.equal(bal(filamentGLSL),0);
  assert.match(semanticGravityGLSL,/uniform sampler2D semanticGlyphTex/);
  assert.match(semanticGravityGLSL,/texture2D\(semanticGlyphTex/);
  assert.match(semanticGravityGLSL,/vec2 gradient=vec2\(right-left,above-below\)/);
  assert.match(semanticGravityGLSL,/if\(semanticGravityMode==7\)/);
  assert.match(filamentGLSL,/#ifdef FILAMENT_SEMANTIC_GRAVITY/);
  assert.match(filamentGLSL,/semanticGlyphForce\(uv,phaseOffset\)/);
  assert.match(filamentGLSL,/q-=vec2\(semanticTug\.x/);
  assert.match(filamentGLSL,/mask\*=1\.0-semanticGravityAmount/);
  const hybrid=specializeFilamentStitchMotion(specializeFilamentGeometry(
    filamentGLSL,22,23),32);
  assert.equal(bal(hybrid),0);
  assert.deepEqual([...hybrid.matchAll(/if\(species==(\d+)\)/g)].map(m=>+m[1]),[22,23]);
  assert.deepEqual([...hybrid.matchAll(/if\(filamentStitchMode==(\d+)\)/g)]
    .map(m=>+m[1]),[32]);
  assert.ok(hybrid.indexOf("semanticGlyphForce(uv,phaseOffset)") <
    hybrid.indexOf("if(species==22)"),
    "text field must bend underlying yarn before its selected geometry");
  assert.doesNotMatch(semanticGravityGLSL,/\bactive\b|\bprecision\b|texelFetch|\bfwidth\b/);
});
test("the same export text compositor supplies the GL force mask at matched time",()=>{
  const renderer=code("renderer.js");
  const exportPath=code("export.js");
  const compositor=code("text-compositor.js");
  const UI=code("components/Inspectors.jsx");
  const metadata=sectionMeta("filament");
  assert.ok(findControls("semantic gravity").some(x=>x.id==="filament"));
  assert.ok(findControls("typographic vortex").some(x=>x.id==="filament"));
  assert.ok(compositor.includes("export function paintLettering("));
  assert.ok(renderer.includes('import {paintLettering} from "./text-compositor.js"'));
  assert.ok(renderer.includes("paintLettering(semanticGlyphContext,state,timeline,maskW,maskH,true)"));
  assert.ok(exportPath.includes("paintLettering(ctx, state, frameClock, size.width, size.height)"));
  assert.ok(renderer.includes("gl.TEXTURE6"));
  assert.ok(renderer.includes('gl.uniform1i(loc("semanticGlyphTex"),6)'));
  assert.ok(renderer.includes("withSemantic?semanticGravityGLSL"));
  assert.ok(renderer.includes("FILAMENT_SEMANTIC_GRAVITY 1"));
  assert.ok(renderer.includes('withSemantic?"semantic-glyph":"no-semantic-glyph"'));
  assert.ok(renderer.includes('if(exactEffects)throw artworkParityError('));
  for(const k of ["semanticGravityMode",...semanticGravityControls]){
    assert.ok(metadata.reset.includes(k),k+" reset");
    assert.ok(renderer.includes(k),k+" shader");
    if(k!=="semanticGravityMode")assert.ok(UI.includes('name="'+k+'"'),k+" slider");
  }
  assert.ok(exportPath.includes("exactEffects:true"));
  assert.ok(exportPath.includes("waitForLetteringFonts(state)"));
});
