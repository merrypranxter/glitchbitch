import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { initial,looks,numericRanges,validateRecipe,randomize,
  parseDocument,recipeDocument } from "../src/data.js";
import { substrateModes,substrateControls,substratePresets,
  substrateGLSL,substrateEnabled,substrateResourceAt,
  substratePreference,optimizeLandingSite,
  shuffleSubstrate,applySubstratePreset,clearSubstrate }
  from "../src/substrate-alchemy.js";
import { daughterSite,evolveSporeGeneration } from "../src/spore-dynasties.js";
import { habitatGLSL } from "../src/atmosphere-habitats.js";
import { shuffleEcosystem,fullWeirdShuffle } from "../src/ecosystem-randomizer.js";
import { sectionMeta,sectionActive,findControls } from "../src/ui-index.js";

const painted=looks.find(l=>l.family==="Painted Habitats").state;
const base={...initial,engine:18,seed:389514,ratio:"9:16",
  palette:-1,colors:["#ff00bb","#05eaff","#efff03"],
  lettering:"DON'T EAT MY TEXT"};
const rng=x=>()=>x;
const near=(a,b,epsilon=1e-9)=>assert.ok(Math.abs(a-b)<=epsilon,
  `expected ${a} ≈ ${b}`);

test("mineral biome is opt-in, with exact legacy recipe migration",()=>{
  assert.deepEqual(substrateModes,[
    "Bare canvas","Fractured basalt","Nutrient rivers","Quartz tesserae",
    "Chemical tidepools","Petrified mycelium"]);
  assert.equal(initial.substrateAmount,0);
  assert.equal(initial.substrateMode,"Bare canvas");
  assert.equal(substrateEnabled(initial),false);
  assert.equal(substrateResourceAt(initial,.23,.78),.5);
  for(const field of substrateControls)
    assert.deepEqual(numericRanges[field],[0,100],field);
  const legacy={...painted};
  for(const key of [...substrateControls,"substrateMode"])delete legacy[key];
  const restored=validateRecipe(legacy);
  for(const key of [...substrateControls,"substrateMode"])
    assert.deepEqual(restored[key],initial[key],key);
  for(const key of ["marks","habitatStamps","engine","colors",
    "colonyLifeMode","colonyAnatomyAmount","sporeGeneration"])
    assert.deepEqual(restored[key],painted[key],key);
});

test("five actual nutrient fields remain finite and spatially varied",()=>{
  for(const mode of substrateModes.slice(1)){
    const substrate={...base,substrateMode:mode,
      substrateAmount:92,substrateScale:57,substratePressure:81};
    const values=[];
    for(let i=0;i<=12;i++)for(let j=0;j<=12;j++){
      const n=substrateResourceAt(substrate,i/12,j/12);
      assert.ok(Number.isFinite(n)&&n>=0&&n<=1,mode);
      values.push(n);
      near(n,substrateResourceAt(substrate,i/12,j/12));
    }
    assert.ok(Math.max(...values)-Math.min(...values)>.35,mode);
    assert.deepEqual(validateRecipe(substrate),substrate);
  }
  assert.equal(substrateResourceAt({...base,substrateMode:"Bare canvas",
    substrateAmount:91},.25,.75),.5);
});

test("each parent can favor opposing nutritional niches",()=>{
  const state={...base,substrateMode:"Nutrient rivers",
    substrateAmount:94,substratePressure:95,
    substrateAffinityA:100,substrateAffinityB:0};
  assert.equal(substratePreference(state,.9,0),.9);
  near(substratePreference(state,.9,1),.1);
  assert.ok(substratePreference(state,.8,0)>
    substratePreference(state,.2,0));
  assert.ok(substratePreference(state,.8,1)<
    substratePreference(state,.2,1));
});

test("daughter sites seek favorable mineral nutrients and commit those exact positions",()=>{
  const settings=applySubstratePreset({
    ...painted,ratio:"16:9",sporeMode:"Windborne",
    sporeAmount:90,sporeReach:70,sporeFertility:100
  },"Electric Nutrient Delta");
  assert.ok(settings.habitatStamps.length>0);
  const unpressured={...settings,substratePressure:0};
  let moved=0;
  for(let i=0;i<settings.habitatStamps.length;i++){
    const origin=daughterSite(unpressured,i);
    const mineral=daughterSite(settings,i);
    assert.ok(mineral.x>=.055&&mineral.x<=.945);
    assert.ok(mineral.y>=.055&&mineral.y<=.945);
    if(Math.hypot(origin.x-mineral.x,origin.y-mineral.y)>1e-8)moved++;
    const stamp=settings.habitatStamps[i];
    const low=substratePreference(settings,
      substrateResourceAt(settings,origin.x,origin.y),stamp.parent);
    const high=substratePreference(settings,
      substrateResourceAt(settings,mineral.x,mineral.y),stamp.parent);
    assert.ok(high+1e-10>=low,"nutrient-biased selection never worsens parent fitness");
  }
  assert.ok(moved>0,"at least some spores should choose a better nearby site");
  const evolved=evolveSporeGeneration(settings);
  assert.ok(evolved.habitatStamps.length>settings.habitatStamps.length);
  for(let i=0;i<evolved.habitatStamps.length-settings.habitatStamps.length;i++){
    const baby=evolved.habitatStamps[settings.habitatStamps.length+i];
    assert.deepEqual({x:baby.x,y:baby.y},daughterSite(settings,i));
  }
  assert.deepEqual(parseDocument(recipeDocument(evolved,"mineral children",
    {time:4,colorTime:2})).state,evolved);
});

test("substrate controls and five presets never erase artist's original work",()=>{
  assert.equal(substratePresets.length,5);
  for(const preset of substratePresets){
    const next=applySubstratePreset(painted,preset.name);
    assert.ok(next.substrateAmount>=90);
    assert.ok(substrateEnabled(next));
    for(const key of ["engine","seed","ratio","marks","colors","palette",
      "habitatStamps","lettering","colonyCortexA","sporeGeneration"])
      assert.deepEqual(next[key],painted[key],key);
    assert.deepEqual(validateRecipe(next),next);
  }
  assert.equal(applySubstratePreset(painted,"not a geological preset"),painted);
  for(const n of [0,.12,.25,.52,.78,.99]){
    const next=shuffleSubstrate(painted,rng(n));
    assert.ok(substrateEnabled(next));
    assert.ok(substrateModes.includes(next.substrateMode));
    assert.deepEqual(next.habitatStamps,painted.habitatStamps);
    assert.deepEqual(next.lettering,painted.lettering);
    assert.deepEqual(next.colors,painted.colors);
    assert.deepEqual(validateRecipe(next),next);
  }
  const bare=clearSubstrate(applySubstratePreset(painted,substratePresets[0].name));
  assert.equal(bare.substrateAmount,0);
  assert.deepEqual(bare.habitatStamps,painted.habitatStamps);
});

test("smart Surprise and Freakshow can awaken terrain without waking dormant Mutate",()=>{
  for(const n of [0,.05,.14,.27,.46,.61,.83,.99]){
    const a=shuffleEcosystem(base,rng(n));
    const b=fullWeirdShuffle(base,rng(n));
    assert.deepEqual(validateRecipe(a),a);
    assert.deepEqual(validateRecipe(b),b);
    assert.equal(b.lettering,base.lettering);
    assert.deepEqual(b.colors,base.colors);
    if(a.substrateAmount>0)assert.notEqual(a.substrateMode,"Bare canvas");
    if(b.substrateAmount>0)assert.notEqual(b.substrateMode,"Bare canvas");
  }
  assert.equal(randomize(base,{},true,rng(.64)).substrateAmount,0);
  const surprise=randomize(base,{},false,rng(.42));
  assert.deepEqual(validateRecipe(surprise),surprise);
});

test("validator rejects unknown mineral modes and invalid ecological numbers",()=>{
  for(const [key,val] of [
    ["substrateMode","Sulfur Death Valley"],["substrateAmount",101],
    ["substrateScale",-1],["substratePressure",Infinity],
    ["substrateAffinityA",-1],["substrateAffinityB",NaN],
    ["substrateGlow",102],["substrateHue",101],
  ])assert.throws(()=>validateRecipe({...base,[key]:val}),undefined,key);
});

test("all 157 Lookbook designs including five mineral worlds validate and round-trip",()=>{
  assert.equal(looks.length,157);
  assert.equal(new Set(looks.map(l=>l.name)).size,157);
  const rocks=looks.filter(l=>l.family==="Substrate Alchemy");
  assert.equal(rocks.length,5);
  for(const look of looks){
    assert.deepEqual(validateRecipe(look.state),look.state,look.name);
    assert.deepEqual(parseDocument(recipeDocument(look.state,look.name,
      {time:2,colorTime:6})).state,look.state,look.name);
  }
  for(const look of rocks){
    assert.ok(look.state.substrateAmount>=90);
    assert.ok(look.state.substratePressure>70);
    assert.ok(look.state.habitatStamps.length>=7);
    assert.equal(look.state.atmoMaskMode,"Painted colonies");
    assert.equal(look.state.atmoBMaskMode,"Painted colonies");
    assert.ok(look.state.sporeAmount>0);
  }
});

test("GPU substrate gates preserve old shaders and spore landing buffer matches saved descendants",()=>{
  const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
  const spore=readFileSync(new URL("../src/spore-dynasties.js",import.meta.url),"utf8");
  const ui=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
  assert.ok(substrateGLSL.includes("float substrateResource(vec2 uv)"));
  assert.ok(substrateGLSL.includes("vec3 shadeSubstrate"));
  assert.ok(habitatGLSL.includes("/* SUBSTRATE_EDGE */"));
  assert.ok(habitatGLSL.includes("/* SUBSTRATE_GATE */"));
  assert.match(renderer,/withSubstrate = substrateEnabled\(s\)/);
  assert.match(renderer,/withSubstrate\?substrateGLSL:""/);
  assert.match(renderer,/withSubstrate\?"col=shadeSubstrate\(col,uv\);":""/);
  assert.match(renderer,/substratePressure\*substrateAmount/);
  assert.match(renderer,/gl\.uniform1i\(loc\("substrateMode"\),substrateModes\.indexOf\(s\.substrateMode\)\)/);
  assert.match(renderer,/sporeLandingBuffer = new Float32Array\(32\)/);
  assert.match(renderer,/gl\.uniform2fv\(loc\("daughterLandings\[0\]"\),sporeLandingBuffer\)/);
  assert.match(spore,/uniform vec2 daughterLandings\[16\]/);
  assert.match(spore,/return daughterLandings\[int\(index\)\]/);
  assert.doesNotMatch(substrateGLSL,/sampler|texture2D|uint\b|discard/);
  for(const key of substrateControls)
    assert.ok(ui.includes('name="'+key+'"'),key);
  assert.ok(ui.includes("Shuffle geology"));
  assert.ok(ui.includes("Colonize rock"));
  assert.equal(sectionMeta("substrate-alchemy").group,"Worlds");
  assert.equal(sectionActive(sectionMeta("substrate-alchemy"),initial),false);
  assert.equal(sectionActive(sectionMeta("substrate-alchemy"),
    {...initial,substrateAmount:91}),true);
  assert.equal(findControls("nutrient rivers")[0].id,"substrate-alchemy");
});
