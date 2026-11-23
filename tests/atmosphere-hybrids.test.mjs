import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { initial, numericRanges, validateRecipe, randomize,
  parseDocument, recipeDocument } from "../src/data.js";
import { atmosphereModes, atmosphereControls, hybridAtmosphereControls,
  hybridAtmospherePresets, applyAtmosphereHybridPreset,
  specializeAtmosphereVariant, nextAtmosphereBMode, breedAtmospheres,
  swapAtmosphereParents, hideAtmospherePair } from "../src/mutant-atmospheres.js";
import { atmosphereHabitats, atmosphereSecondHabitats,
  atmosphereBlendModes, habitatGLSL, atmosphereHybridGLSL } from "../src/atmosphere-habitats.js";
import { sectionMeta, sectionActive, findControls } from "../src/ui-index.js";

const untouchedKeys=["seed","engine","secondaryEngine","blend","ratio",
  "colors","lettering","letteringLayers","letteringFormats","marks","filmAmount",
  "photonAmount","filamentAmount","underlayAmount","microAmount","backdropAmount"];
const base={...initial,engine:18,secondaryEngine:12,blend:51,ratio:"9:16",
  seed:12394,colors:["#ffffff","#fd20ae","#00ccee"],lettering:"KEEP MY WORDS",
  marks:[],letteringLayers:[],letteringFormats:[],filmAmount:72,
  filamentAmount:85,photonAmount:60,underlayAmount:34,microAmount:39,
  backdropAmount:66};
function artPreserved(before,after){
  for(const key of untouchedKeys)assert.deepEqual(after[key],before[key],key);
}
test("single parent legacy work is unchanged, dual parent opt-in",()=>{
  const legacy={...base};
  for(const k of [...hybridAtmosphereControls,
    "atmoBMode","atmoMaskMode","atmoBMaskMode","atmoBBlendMode"])delete legacy[k];
  const restored=validateRecipe(legacy);
  assert.equal(restored.atmoBAmount,0);
  assert.equal(restored.atmoMaskMode,"Everywhere");
  assert.equal(restored.atmoBMaskMode,"Everywhere");
  assert.equal(restored.atmoBBlendMode,"Over");
  assert.equal(restored.atmoAmount,base.atmoAmount);
  artPreserved(base,restored);
  const dormant=randomize(restored,{},true,()=>.7);
  assert.equal(dormant.atmoBAmount,0,
    "Mutate must not unexpectedly wake second GPU shader in old art");
});
test("every hybrid preset uses valid controls and editable, exportable recipes",()=>{
  assert.equal(hybridAtmospherePresets.length,5);
  assert.deepEqual(atmosphereHabitats,["Everywhere","Bloom iris",
    "Cell colonies","Flowing ribbons","Fractured mosaic","Painted colonies"]);
  assert.equal(atmosphereSecondHabitats.at(-1),"Inverse first");
  assert.deepEqual(atmosphereBlendModes,
    ["Over","Light bloom","Ink stain","Spectral difference"]);
  for(const k of hybridAtmosphereControls)
    assert.deepEqual(numericRanges[k],[0,100],k);
  for(const preset of hybridAtmospherePresets){
    const hybrid=applyAtmosphereHybridPreset(base,preset.name);
    assert.ok(atmosphereModes.includes(hybrid.atmoMode));
    assert.ok(atmosphereModes.includes(hybrid.atmoBMode));
    assert.ok(atmosphereBlendModes.includes(hybrid.atmoBBlendMode));
    assert.ok(atmosphereHabitats.includes(hybrid.atmoMaskMode));
    assert.ok(atmosphereSecondHabitats.includes(hybrid.atmoBMaskMode));
    assert.ok(hybrid.atmoAmount>0 && hybrid.atmoBAmount>0);
    artPreserved(base,hybrid);
    for(const key of [...atmosphereControls,...hybridAtmosphereControls]){
      assert.ok(Number.isFinite(hybrid[key]),preset.name+" "+key);
      assert.ok(hybrid[key]>=0 && hybrid[key]<=100,preset.name+" "+key);
    }
    const saved=recipeDocument(hybrid,preset.name,{time:3,colorTime:6});
    const restored=parseDocument(saved).state;
    assert.deepEqual(restored.atmoMode,hybrid.atmoMode);
    assert.deepEqual(restored.atmoBMode,hybrid.atmoBMode);
    assert.deepEqual(restored.atmoBMaskMode,hybrid.atmoBMaskMode);
    assert.equal(restored.atmoBAmount,hybrid.atmoBAmount);
    artPreserved(base,restored);
  }
  assert.equal(applyAtmosphereHybridPreset(base,"invalid recipe"),base);
});
test("breeding, swapping and hiding never touch underlying artwork",()=>{
  const bred=breedAtmospheres(base,()=>.6);
  assert.notEqual(bred.atmoBMode,base.atmoMode);
  assert.ok(bred.atmoBAmount>=60 && bred.atmoBAmount<=97);
  assert.ok(bred.atmoAmount>=65);
  artPreserved(base,bred);
  const swapped=swapAtmosphereParents(bred);
  assert.equal(swapped.atmoAmount,bred.atmoBAmount);
  assert.equal(swapped.atmoBAmount,bred.atmoAmount);
  assert.equal(swapped.atmoMode,bred.atmoBMode);
  assert.equal(swapped.atmoBMode,bred.atmoMode);
  artPreserved(base,swapped);
  const twice=swapAtmosphereParents(swapped);
  assert.deepEqual(twice,bred);
  const hidden=hideAtmospherePair(bred);
  assert.equal(hidden.atmoAmount,0);
  assert.equal(hidden.atmoBAmount,0);
  assert.equal(hidden.atmoBMode,bred.atmoBMode);
  artPreserved(base,hidden);
  const different=nextAtmosphereBMode(bred,()=>0);
  assert.notEqual(different.atmoBMode,bred.atmoBMode);
  artPreserved(base,different);
});
test("recipe validator rejects unknown masks, modes and invalid amounts",()=>{
  for(const [key,value] of [
    ["atmoBMode","unknown beast"],["atmoMaskMode","external shader"],
    ["atmoBMaskMode","evil"],["atmoBBlendMode","malicious"],
    ["atmoBAmount",-1],["atmoBMotion",101],
    ["atmoMaskFeather",NaN],["atmoMaskScale",Infinity]]){
    assert.throws(()=>validateRecipe({...base,[key]:value}),undefined,key);
  }
  const surprise=randomize(base,{},false,()=>.41);
  assert.ok(atmosphereModes.includes(surprise.atmoBMode));
  assert.ok(atmosphereHabitats.includes(surprise.atmoMaskMode));
  assert.ok(atmosphereSecondHabitats.includes(surprise.atmoBMaskMode));
  assert.doesNotThrow(()=>validateRecipe(surprise));
});
test("both shader variants have independent uniforms and named functions",()=>{
  const A=specializeAtmosphereVariant(atmosphereModes[0]);
  const B=specializeAtmosphereVariant(atmosphereModes[2],true);
  assert.ok(A.includes("#define ATMO_MODE 0"));
  assert.ok(B.includes("#define ATMO_MODE 2"));
  assert.ok(A.includes("uniform float atmoAmount,atmoScale"));
  assert.ok(B.includes("uniform float atmoBAmount,atmoBScale"));
  assert.doesNotMatch(B,/uniform float atmoAmount,/);
  assert.match(B,/vec3 livingMutantAtmosphereB\(/);
  assert.doesNotMatch(B,/vec3 livingMutantAtmosphere\(/);
  assert.ok(B.includes("atmoBMotion")&&B.includes("atmoBVariation"));
  assert.match(habitatGLSL,/float atmosphereMaskForA/);
  assert.match(habitatGLSL,/float atmosphereMaskForB/);
  assert.match(habitatGLSL,/kind==0\)return 1/);
  assert.match(habitatGLSL,/ATM_MASK_B==6/);
  assert.match(atmosphereHybridGLSL,/vec3 delta=child-base/);
  assert.doesNotMatch(habitatGLSL+atmosphereHybridGLSL,
    /sampler2D|texture2D|discard|uint\b/);
});
test("shared shader renderer includes isolated fallback and deterministic export path",()=>{
  const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
  assert.match(renderer,/withAtmosphereB = s\.atmoBAmount>0/);
  assert.match(renderer,/withHabitat = /);
  assert.match(renderer,/specializeAtmosphereVariant\(s\.atmoBMode,true\)/);
  assert.match(renderer,/#define ATM_BLEND_B /);
  assert.match(renderer,/livingMutantAtmosphereB\(col,uv,p,v\)/);
  assert.match(renderer,/atmosphereMaskForA\(uv\)/);
  assert.match(renderer,/atmosphereMaskForB\(uv\)/);
  assert.match(renderer,/atmosphereBUnavailable=true/);
  assert.match(renderer,/habitatUnavailable=true/);
  assert.match(renderer,/atmoBAmount:0/);
  assert.match(renderer,/atmoBAmount","atmoBScale"/);
  assert.match(renderer,/atmoMaskScale","atmoMaskFeather"/);
  assert.match(renderer,/undef ATMO_MODE/);
});
test("scene controls show nested breeder and mask panels, fully reversible",()=>{
  const ui=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
  assert.ok(ui.includes("TWO-PARENT ATMOSPHERE BREEDER"));
  assert.ok(ui.includes("LIVING HABITATS"));
  for(const key of hybridAtmosphereControls)
    assert.ok(ui.includes('name="'+key+'"'),key);
  assert.match(ui,/applyAtmosphereHybridPreset\(x,hybridAtmoPreset\)/);
  assert.match(ui,/history\.change\(breedAtmospheres\)/);
  assert.match(ui,/history\.change\(hideAtmospherePair\)/);
  assert.equal(sectionMeta("atmosphere").group,"Worlds");
  assert.ok(sectionMeta("atmosphere").on.includes("atmoBAmount"));
  assert.ok(sectionActive(sectionMeta("atmosphere"),{...initial,
    atmoAmount:0,atmoBAmount:50}));
  for(const query of ["second parent","fractured mosaic","inverse first"])
    assert.equal(findControls(query)[0].id,"atmosphere");
});
