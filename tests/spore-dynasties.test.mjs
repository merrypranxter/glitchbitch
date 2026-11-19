import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { initial,looks,numericRanges,validateRecipe,randomize,
  parseDocument,recipeDocument } from "../src/data.js";
import { sporeModes,sporeControls,sporePresets,sporeDynastyGLSL,
  daughterSite,evolveSporeGeneration,sporeParticipatingCount,
  shuffleSporeDynasty,applySporePreset,stopSpores }
  from "../src/spore-dynasties.js";
import { habitatGLSL } from "../src/atmosphere-habitats.js";
import { shuffleEcosystem,fullWeirdShuffle } from "../src/ecosystem-randomizer.js";
import { sectionMeta,sectionActive,findControls } from "../src/ui-index.js";

const painted=looks.find(l=>l.family==="Painted Habitats").state;
const base={...initial,engine:18,seed:791443,ratio:"9:16",
  palette:-1,colors:["#ff00aa","#00fafa","#fffa00"],
  lettering:"DO NOT EAT THE ARTIST'S WORDS"};

test("Spore Dynasties is entirely opt-in for legacy art",()=>{
  assert.deepEqual(sporeModes,
    ["Dormant","Windborne","Helical drift","Burst scatter"]);
  assert.equal(initial.sporeMode,"Dormant");
  assert.equal(initial.sporeAmount,0);
  assert.equal(initial.sporeGeneration,0);
  for(const key of sporeControls)assert.deepEqual(numericRanges[key],[0,100],key);
  const old={...painted};
  for(const key of [...sporeControls,"sporeMode","sporeGeneration"])
    delete old[key];
  const loaded=validateRecipe(old);
  for(const key of [...sporeControls,"sporeMode","sporeGeneration"])
    assert.deepEqual(loaded[key],initial[key],key);
  for(const key of ["colors","lettering","engine","seed","marks",
    "habitatStamps","colonyCortexAmount","colonyAnatomyAmount"])
    assert.deepEqual(loaded[key],painted[key],key);
});

test("daughter coordinates are aspect-aware, bounded and deterministic",()=>{
  const s={...painted,ratio:"9:16",sporeGeneration:0,sporeReach:64};
  const coords=s.habitatStamps.map((_,i)=>daughterSite(s,i));
  assert.deepEqual(coords,s.habitatStamps.map((_,i)=>daughterSite(s,i)));
  assert.equal(daughterSite(s,900),null);
  assert.ok(coords.every(p=>p.x>=.055&&p.x<=.945&&p.y>=.055&&p.y<=.945));
  assert.notDeepEqual(coords,
    s.habitatStamps.map(x=>({x:x.x,y:x.y})));
  const next={...s,sporeGeneration:1};
  assert.notDeepEqual(daughterSite(s,0),daughterSite(next,0));
  const portrait=daughterSite(s,0);
  const landscape=daughterSite({...s,ratio:"16:9"},0);
  assert.notEqual(portrait.x,landscape.x);
});

test("Evolve generation commits real, unique, editable offspring with same parent genetics",()=>{
  const parentState={...painted,sporeMode:"Windborne",
    sporeAmount:91,sporeFertility:60,sporeReach:76,
    sporeGeneration:0,ratio:"1:1"};
  const n=sporeParticipatingCount(parentState);
  assert.ok(n>0);
  const born=evolveSporeGeneration(parentState);
  assert.notEqual(born,parentState);
  assert.equal(born.sporeGeneration,1);
  assert.equal(born.habitatStamps.length,
    Math.min(16,parentState.habitatStamps.length+n));
  const before=parentState.habitatStamps.length;
  for(let i=0;i<born.habitatStamps.length-before;i++){
    const baby=born.habitatStamps[before+i];
    const origin=parentState.habitatStamps[i];
    assert.equal(baby.parent,origin.parent);
    assert.deepEqual({x:baby.x,y:baby.y},daughterSite(parentState,i));
    assert.ok(baby.radius>=.05&&baby.radius<=.28);
  }
  assert.equal(new Set(born.habitatStamps.map(s=>s.id)).size,
    born.habitatStamps.length);
  for(const key of ["engine","ratio","colors","palette","marks","lettering",
    "atmoMode","atmoBMode","colonyShapeA","colonyShapeB",
    "colonyCortexA","colonyCortexB"])
    assert.deepEqual(born[key],parentState[key],key);
  assert.deepEqual(parentState.habitatStamps,painted.habitatStamps);
  assert.deepEqual(validateRecipe(born),born);
  assert.deepEqual(parseDocument(recipeDocument(born,"first daughter",
    {time:2,colorTime:3})).state,born);
});

test("generation 2 is genuinely new, remains undoable, and stops at 16",()=>{
  const s={...painted,sporeMode:"Helical drift",
    sporeFertility:100,sporeAmount:100,
    sporeGeneration:0};
  const born=evolveSporeGeneration(s);
  const twice=evolveSporeGeneration(born);
  assert.ok(born.habitatStamps.length>s.habitatStamps.length);
  assert.equal(twice.habitatStamps.length,16);
  assert.deepEqual(evolveSporeGeneration(twice),twice);
  assert.notEqual(born.sporeGeneration,s.sporeGeneration);
  assert.deepEqual(validateRecipe(twice),twice);
  const sterile={...s,sporeFertility:0};
  assert.equal(evolveSporeGeneration(sterile),sterile);
  const maxed={...s,sporeGeneration:4095};
  assert.equal(evolveSporeGeneration(maxed),maxed);
  assert.equal(evolveSporeGeneration({...s,habitatStamps:[]}).habitatStamps.length,0);
});

test("all four presets and shufflers preserve text, math, palette and placed colonies",()=>{
  assert.equal(sporePresets.length,4);
  for(const preset of sporePresets){
    const s=applySporePreset(painted,preset.name);
    assert.equal(s.sporeMode,preset.sporeMode);
    assert.ok(s.sporeAmount>0);
    for(const key of ["engine","seed","marks","habitatStamps","lettering",
      "colors","colonyShapeA","colonyCortexB"])
      assert.deepEqual(s[key],painted[key],key);
    assert.deepEqual(validateRecipe(s),s);
  }
  assert.equal(applySporePreset(painted,"Unknown spores"),painted);
  for(const rand of [0,.14,.41,.73,.99]){
    const s=shuffleSporeDynasty(painted,()=>rand);
    assert.ok(sporeModes.includes(s.sporeMode));
    assert.notEqual(s.sporeMode,"Dormant");
    assert.deepEqual(s.habitatStamps,painted.habitatStamps);
    assert.deepEqual(s.colors,painted.colors);
    assert.deepEqual(validateRecipe(s),s);
  }
  const inactive=stopSpores(applySporePreset(painted,sporePresets[0].name));
  assert.equal(inactive.sporeAmount,0);
  assert.deepEqual(inactive.habitatStamps,painted.habitatStamps);
});

test("smart Surprise can generate spores but Mutate keeps them dormant",()=>{
  for(const n of [0,.1,.19,.28,.42,.63,.83,.99]){
    const states=[shuffleEcosystem(base,()=>n),fullWeirdShuffle(base,()=>n)];
    for(const s of states){
      assert.deepEqual(validateRecipe(s),s);
      if(s.sporeAmount>0){
        assert.notEqual(s.sporeMode,"Dormant");
        assert.ok(s.habitatStamps.length>0);
        assert.ok(s.atmoMaskMode==="Painted colonies"||
          s.atmoBMaskMode==="Painted colonies");
      }
    }
    assert.deepEqual(states[1].colors,base.colors);
    assert.equal(states[1].lettering,base.lettering);
  }
  const tweak=randomize(base,{},true,()=>.76);
  assert.equal(tweak.sporeAmount,0);
  const surprised=randomize(base,{},false,()=>.45);
  assert.deepEqual(validateRecipe(surprised),surprised);
});

test("invalid generation/mode/settings are rejected",()=>{
  for(const [key,value] of [
    ["sporeMode","Flaming spores"],["sporeAmount",101],
    ["sporeReach",Infinity],["sporeFertility",-1],
    ["sporeSpeed",NaN],["sporeGlow",101],
    ["sporeGeneration",-1],["sporeGeneration",4096],
    ["sporeGeneration",.5]
  ])assert.throws(()=>validateRecipe({...base,[key]:value}),undefined,key);
});

test("all 130 saved Looks including four reproductive worlds have valid serializable states",()=>{
  assert.equal(looks.length,130);
  assert.equal(new Set(looks.map(x=>x.name)).size,130);
  const family=looks.filter(x=>x.family==="Spore Dynasties");
  assert.equal(family.length,4);
  for(const look of looks){
    assert.deepEqual(validateRecipe(look.state),look.state,look.name);
    assert.deepEqual(parseDocument(recipeDocument(look.state,look.name,
      {time:5,colorTime:9})).state,look.state,look.name);
  }
  for(const look of family){
    const s=look.state;
    assert.ok(s.habitatStamps.length>=6);
    assert.ok(s.sporeAmount>=80);
    assert.ok(s.atmoAmount>0&&s.atmoBAmount>0);
    assert.equal(s.atmoMaskMode,"Painted colonies");
    assert.equal(s.atmoBMaskMode,"Painted colonies");
  }
});

test("shader inclusion and A/B spore glows follow the same export clock without buffers",()=>{
  const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
  const ui=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
  assert.ok(habitatGLSL.includes("/* SPORE_MODULE */"));
  assert.ok(habitatGLSL.includes("/* SPORE_SAMPLE */"));
  assert.match(renderer,/withSpore = s\.sporeAmount>0/);
  assert.match(renderer,/withSpore \? sporeDynastyGLSL : ""/);
  assert.match(renderer,/withSpore \? "spores" : "no-spores"/);
  assert.match(renderer,/tintSporeCloud\(col,sporeFlightA,atmoHue\)/);
  assert.match(renderer,/tintSporeCloud\(col,sporeFlightB,atmoBHue\)/);
  assert.match(renderer,/gl\.uniform1f\(loc\("sporeGeneration"\),s\.sporeGeneration\)/);
  assert.match(sporeDynastyGLSL,/float phase=fract\(cycle\)/);
  assert.match(sporeDynastyGLSL,/daughterLanding\(stamp.xy,index,canvasAspect\)/);
  assert.doesNotMatch(sporeDynastyGLSL,/sampler|texture2D|uint\b|discard/);
  assert.ok(ui.includes("Evolve generation"));
  assert.ok(ui.includes("Awaken spores"));
  assert.ok(ui.includes("Shuffle spores"));
  for(const key of sporeControls)
    assert.ok(ui.includes('name="'+key+'"'),key);
  assert.equal(sectionMeta("spore-dynasty").group,"Scene");
  assert.equal(sectionActive(sectionMeta("spore-dynasty"),initial),false);
  assert.equal(findControls("evolve generation")[0].id,"spore-dynasty");
});
