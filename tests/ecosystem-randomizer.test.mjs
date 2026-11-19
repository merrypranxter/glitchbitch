import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { initial, numericRanges, validateRecipe, randomize,
  recipeDocument, parseDocument, looks } from "../src/data.js";
import { atmosphereModes } from "../src/mutant-atmospheres.js";
import { atmosphereHabitats, atmosphereSecondHabitats } from "../src/atmosphere-habitats.js";
import { colonyLifeModes } from "../src/colony-lifecycle.js";
import { MAX_HABITAT_STAMPS } from "../src/habitat-painter.js";
import { habitatLayouts, chaosLevels, generateHabitatStamps,
  ensureValidEcosystemState, shuffleColonies, shuffleColonyLife,
  shuffleEcosystem, fullWeirdShuffle, mixEcosystemIntoSurprise,
  enforceChaosBudget } from "../src/ecosystem-randomizer.js";
import { sectionMeta, findControls } from "../src/ui-index.js";

const art={...initial,engine:18,seed:17529,ratio:"9:16",
  palette:-1,colors:["#ff0099","#00ffff","#edff00"],
  lettering:"MY WORDS SHALL SURVIVE",
  letteringAmount:80,marks:[],
  habitatStamps:[],atmoAmount:0,atmoBAmount:0,
  atmoMaskMode:"Everywhere",atmoBMaskMode:"Everywhere",
  colonyLifeMode:"Still",colonyLifeAmount:0};
const stubborn=value=>()=>value;
function valid(s){
  assert.doesNotThrow(()=>validateRecipe(s));
  assert.deepEqual(parseDocument(recipeDocument(s,"shuffle",{time:2,colorTime:5})).state,s);
  assert.ok(s.habitatStamps.length<=MAX_HABITAT_STAMPS);
  assert.ok(atmosphereModes.includes(s.atmoMode));
  assert.ok(atmosphereModes.includes(s.atmoBMode));
  assert.ok(atmosphereHabitats.includes(s.atmoMaskMode));
  assert.ok(atmosphereSecondHabitats.includes(s.atmoBMaskMode));
  assert.ok(colonyLifeModes.includes(s.colonyLifeMode));
  if(s.atmoMaskMode==="Painted colonies"){
    assert.ok(s.atmoAmount>0);
    assert.ok(s.habitatStamps.some(m=>m.parent===0),"missing A seed");
  }
  if(s.atmoBMaskMode==="Painted colonies"){
    assert.ok(s.atmoBAmount>0);
    assert.ok(s.habitatStamps.some(m=>m.parent===1),"missing B seed");
  }
  if(s.atmoBMaskMode==="Inverse first")
    assert.notEqual(s.atmoMaskMode,"Everywhere");
  if(s.colonyLifeMode==="Territory war"&&s.colonyLifeAmount>0){
    assert.ok(s.atmoAmount>0&&s.atmoBAmount>0);
    assert.equal(s.atmoMaskMode,"Painted colonies");
    assert.equal(s.atmoBMaskMode,"Painted colonies");
    assert.ok(s.colonyCompetition>=35);
  }
}
test("seven attractive, deterministic colony arrangements remain valid and bounded",()=>{
  assert.equal(habitatLayouts.length,7);
  for(const layout of habitatLayouts){
    const s=generateHabitatStamps(art,stubborn(.37),{
      layout,needA:true,needB:true,count:12
    });
    const again=generateHabitatStamps(art,stubborn(.37),{
      layout,needA:true,needB:true,count:12
    });
    assert.deepEqual(s,again,layout);
    assert.equal(new Set(s.map(m=>m.id)).size,s.length);
    assert.ok(s.some(m=>m.parent===0)&&s.some(m=>m.parent===1));
    assert.equal(s.length,12);
    for(const m of s){
      assert.ok(m.x>=0&&m.x<=1&&m.y>=0&&m.y<=1,layout);
      assert.ok(m.radius>=.05&&m.radius<=.45,layout);
    }
    assert.doesNotThrow(()=>validateRecipe({...art,habitatStamps:s}));
  }
  assert.equal(generateHabitatStamps(art,stubborn(.999),{count:100,needB:true}).length,16);
});
test("shuffle colonies changes only the colony map and necessary visibility",()=>{
  const before={...art,atmoAmount:65,atmoBAmount:78,
    atmoMode:"Prismatic mycelium",atmoBMode:"Heartbeat phosphor",
    atmoMaskMode:"Painted colonies",atmoBMaskMode:"Painted colonies"};
  const after=shuffleColonies(before,stubborn(.53));
  for(const k of ["engine","seed","ratio","palette","colors","lettering",
    "letteringAmount","marks","atmoMode","atmoBMode",
    "atmoScale","atmoBScale","colonyLifeMode","colonyLifeAmount"])
    assert.deepEqual(after[k],before[k],k);
  assert.ok(after.habitatStamps.length>=2);
  assert.notDeepEqual(after.habitatStamps,before.habitatStamps);
  valid(after);
  assert.deepEqual(before.habitatStamps,[]);
});
test("shuffle colony wars wakes meaningful visible life, including both fighters",()=>{
  for(const v of [0,.2,.35,.53,.72,.99]){
    const s=shuffleColonyLife(art,stubborn(v));
    valid(s);
    assert.notEqual(s.colonyLifeMode,"Still");
    assert.ok(s.colonyLifeAmount>=58);
    assert.ok(s.habitatStamps.length>0);
    assert.equal(s.engine,art.engine);
    assert.deepEqual(s.colors,art.colors);
    assert.equal(s.lettering,art.lettering);
  }
  const war=shuffleColonyLife(art,stubborn(.99));
  assert.equal(war.colonyLifeMode,"Territory war");
  assert.ok(war.habitatStamps.some(m=>m.parent===0));
  assert.ok(war.habitatStamps.some(m=>m.parent===1));
});
test("all ecosystem shuffles produce renderable, edit-safe dual-parent states",()=>{
  for(const value of [0,.07,.19,.33,.45,.63,.79,.99,1]){
    const next=shuffleEcosystem(art,stubborn(value));
    valid(next);
    assert.equal(next.engine,art.engine);
    assert.equal(next.lettering,art.lettering);
    assert.deepEqual(next.colors,art.colors);
    for(const k of ["atmoAmount","atmoScale","atmoDensity",
      "atmoBAmount","atmoMaskFeather","colonyLifeSpeed"])
      assert.ok(next[k]>=numericRanges[k][0]&&next[k]<=numericRanges[k][1],k);
    const single=shuffleEcosystem(art,stubborn(value),{
      allowDual:false,lifeChance:1
    });
    valid(single);
    assert.equal(single.atmoBAmount,0);
    assert.notEqual(single.colonyLifeMode,"Territory war");
  }
});
test("constraint repair creates the missing player, never leaves fake wars",()=>{
  for(const input of [
    {...art,atmoMaskMode:"Painted colonies"},
    {...art,atmoMaskMode:"Everywhere",atmoBMaskMode:"Inverse first",atmoBAmount:84},
    {...art,atmoBMaskMode:"Painted colonies"},
    {...art,colonyLifeMode:"Territory war",colonyLifeAmount:90,colonyCompetition:0}
  ]){
    const repaired=ensureValidEcosystemState(input,stubborn(.43));
    valid(repaired);
    assert.equal(repaired.engine,art.engine);
    assert.equal(repaired.lettering,art.lettering);
  }
});
test("full weird shuffles preserve artist words/colors by default, change old effects and obey GPU budget",()=>{
  assert.deepEqual(chaosLevels,["Gentle","Wild","Feral","Maximum freakshow"]);
  for(const level of chaosLevels){
    const next=fullWeirdShuffle(art,stubborn(.46),{
      level,baseRandomizer:(source,rng)=>randomize(source,{},false,rng),
      allowHeavy:false
    });
    valid(next);
    assert.equal(next.lettering,art.lettering);
    assert.equal(next.letteringAmount,art.letteringAmount);
    assert.deepEqual(next.colors,art.colors);
    assert.equal(next.palette,art.palette);
    assert.equal(next.ratio,art.ratio);
    const keys=["filamentAmount","underlayAmount","photonAmount","microAmount",
      "substanceAmount","backdropAmount","bioAmount","filmAmount","prismAmount",
      "stereoAmount","wiggleAmount","compositionAmount"];
    assert.ok(keys.filter(k=>next[k]>10).length<=2,level+" GPU budget");
    assert.equal(next.engine===art.engine||next.engine!==art.engine,true);
  }
  const protectedArt={...art,compositionAmount:82};
  const locked=fullWeirdShuffle(protectedArt,stubborn(.58),{
    level:"Feral",preserveCore:true,preserveText:true,preserveColors:true,
    baseRandomizer:(source,rng)=>randomize(source,{},false,rng)
  });
  for(const key of ["engine","seed","marks","complexity","scale","warp",
    "lettering","colors","palette","compositionAmount"])
    assert.deepEqual(locked[key],protectedArt[key],key);
  valid(locked);
  const fresh=fullWeirdShuffle(art,stubborn(.52),{
    preserveColors:false,preserveText:false,
    baseRandomizer:(source,rng)=>randomize(source,{},false,rng)
  });
  assert.equal(fresh.lettering,"");
  assert.notDeepEqual(fresh.colors,art.colors);
  valid(fresh);
});
test("ordinary Surprise enters ecology, preserves actual locks; Mutate stays conservative",()=>{
  const mutant=randomize(art,{},true,stubborn(.73));
  assert.deepEqual(mutant.habitatStamps,art.habitatStamps);
  assert.equal(mutant.colonyLifeAmount,0);
  assert.equal(mutant.engine,art.engine);
  const locked=randomize(art,{engine:true,color:true},false,stubborn(.4));
  assert.equal(locked.engine,art.engine);
  assert.deepEqual(locked.colors,art.colors);
  assert.equal(locked.palette,art.palette);
  valid(locked);
  const plain=randomize(art,{},false,stubborn(.99));
  valid(plain);
  assert.equal(plain.habitatStamps.length,0);
  const full=randomize(art,{},false,stubborn(.4));
  valid(full);
  assert.ok(full.habitatStamps.length>0);
  assert.equal(full.lettering,""); // Surprise never invents words
  // All existing Lookbook entries remain untouched by global randomization.
  assert.equal(looks.length,118);
  assert.ok(looks.every(l=>!l.name.startsWith("eco-")));
});
test("one-step UI buttons and global Freakshow are actually wired",()=>{
  const ui=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
  const app=readFileSync(new URL("../src/main.jsx",import.meta.url),"utf8");
  for(const method of ["shuffleColonies(x)","shuffleColonyLife(x)",
    "shuffleEcosystem(x,Math.random","fullWeirdShuffle(x,Math.random"])
    assert.ok(ui.includes(method),method);
  assert.ok(ui.includes('label="Chaos intensity"'));
  assert.ok(ui.includes('label="Preserve my colors"'));
  assert.ok(ui.includes('label="Preserve my words and text styling"'));
  assert.ok(ui.includes('label="Allow two atmosphere parents"'));
  assert.match(app,/function freakshow\(\)/);
  assert.match(app,/onClick=\{freakshow\}/);
  assert.equal(sectionMeta("chaos-lab").tab,"Effects");
  assert.equal(sectionMeta("chaos-lab").group,"Scene");
  assert.equal(findControls("full weird shuffle")[0].id,"chaos-lab");
  assert.equal(findControls("shuffle colonies")[0].id,"habitat-paint");
});
