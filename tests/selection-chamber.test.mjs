import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,looks,numericRanges,validateRecipe,randomize,
  recipeDocument,parseDocument} from "../src/data.js";
import {selectionModes,selectionControls,selectionPresets,selectionGLSL,
  selectionActive,fitnessFromEnvironment,colonyFitness,
  rankSelection,applySelectionPreset,prepareSelection,shuffleSelection,
  stopSelection,cullWeakest,breedFittest,selectionCycle}
  from "../src/selection-chamber.js";
import {geneEnabled} from "../src/colony-genetics.js";
import {substrateResourceAt} from "../src/substrate-alchemy.js";
import {daughterSite} from "../src/spore-dynasties.js";
import {habitatGLSL} from "../src/atmosphere-habitats.js";
import {shuffleEcosystem,fullWeirdShuffle} from "../src/ecosystem-randomizer.js";
import {sectionMeta,sectionActive,findControls} from "../src/ui-index.js";

const painted=looks.find(l=>l.family==="Painted Habitats").state;
const base={...initial,seed:784312,engine:17,
  lettering:"DO NOT SELECT MY FUCKING WORDS",ratio:"9:16",
  palette:-1,colors:["#ff0095","#00f5ef","#ffff06"]};
const sample={
  ...base,substrateMode:"Nutrient rivers",substrateAmount:91,
  atmoMaskMode:"Painted colonies",atmoAmount:90,
  geneAmount:95,selectionMode:"Nutrient matching",
  selectionPressure:87,selectionSeverity:49,selectionBrood:60,
  habitatStamps:[
    {id:"A-0",x:.13,y:.31,radius:.20,parent:0,gene:0,generation:0},
    {id:"B-1",x:.32,y:.44,radius:.18,parent:1,gene:100,generation:0},
    {id:"A-2",x:.51,y:.53,radius:.22,parent:0,gene:50,generation:0},
    {id:"B-3",x:.75,y:.71,radius:.24,parent:1,gene:35,generation:0},
    {id:"A-4",x:.83,y:.26,radius:.19,parent:0,gene:80,generation:0},
    {id:"B-5",x:.63,y:.82,radius:.17,parent:1,gene:15,generation:0},
  ],
};

test("old recipes, parent marker DNA and all historical backgrounds remain selection-free",()=>{
  assert.deepEqual(selectionModes,[
    "Dormant","Nutrient matching","Specialist advantage",
    "Adversarial niche","Hybrid vigor"]);
  for(const field of selectionControls)
    assert.deepEqual(numericRanges[field],[0,100],field);
  assert.equal(initial.selectionMode,"Dormant");
  assert.equal(initial.selectionPressure,0);
  assert.equal(selectionActive(initial),false);
  const old={...painted};
  for(const key of [...selectionControls,"selectionMode"])delete old[key];
  const loaded=validateRecipe(old);
  for(const key of [...selectionControls,"selectionMode"])
    assert.deepEqual(loaded[key],initial[key],key);
  assert.deepEqual(loaded.habitatStamps,painted.habitatStamps);
  assert.deepEqual(loaded.colors,painted.colors);
  assert.equal(loaded.lettering,painted.lettering);
});

test("fitness is grounded in local nutrient field, genetics and parent preference",()=>{
  assert.ok(selectionActive(sample));
  const a=sample.habitatStamps[0];
  const resource=substrateResourceAt(sample,a.x,a.y);
  const affinity=sample.substrateAffinityA/100;
  const correct=fitnessFromEnvironment(a.gene/100,resource,
    affinity,sample.selectionMode);
  assert.ok(correct>=0&&correct<=1);
  assert.ok(Math.abs(correct-colonyFitness(sample,a))<1e-9);
  for(const mode of selectionModes.slice(1)){
    for(const allele of [0,.12,.5,.85,1]){
      for(const resource of [0,.15,.33,.5,.83,1]){
        const fitness=fitnessFromEnvironment(allele,resource,.72,mode);
        assert.ok(Number.isFinite(fitness)&&fitness>=0&&fitness<=1,mode);
      }
    }
  }
  assert.ok(fitnessFromEnvironment(.2,.2,1,"Nutrient matching")>
    fitnessFromEnvironment(.2,.9,1,"Nutrient matching"));
  assert.ok(fitnessFromEnvironment(.5,.5,.5,"Hybrid vigor")>
    fitnessFromEnvironment(0,.5,.5,"Hybrid vigor"));
});

test("preparing selection activates real visible terrain and fills only unassigned genes",()=>{
  const first=sample.habitatStamps[0];
  const legacy={...sample,substrateMode:"Bare canvas",substrateAmount:0,
    selectionMode:"Dormant",selectionPressure:0,geneAmount:0,
    habitatStamps:[first,
      {id:"unassigned",x:.52,y:.5,radius:.21,parent:1}]};
  const prepared=prepareSelection(legacy);
  assert.equal(prepared.substrateMode,"Nutrient rivers");
  assert.ok(prepared.substrateAmount>=72);
  assert.ok(prepared.geneAmount>=75);
  assert.ok(selectionActive(prepared));
  assert.equal(prepared.habitatStamps[0].gene,first.gene);
  assert.ok(Number.isInteger(prepared.habitatStamps[1].gene));
  assert.equal(prepared.habitatStamps[1].generation,0);
  assert.deepEqual(prepared.habitatStamps.map(m=>m.id),
    legacy.habitatStamps.map(m=>m.id));
  assert.deepEqual(legacy.habitatStamps[1].gene,undefined);
  assert.deepEqual(prepareSelection(prepared),prepared);
  assert.deepEqual(validateRecipe(prepared),prepared);
});

test("selection ranks by actual fitness, stable for ties, and manual cull keeps species alive",()=>{
  const ranked=rankSelection(sample);
  assert.equal(ranked.length,sample.habitatStamps.length);
  assert.ok(ranked.every((v,i)=>i===0||v.fitness<=ranked[i-1].fitness));
  assert.deepEqual(ranked,rankSelection(sample));
  const cull=cullWeakest(sample);
  const expected=Math.floor(sample.habitatStamps.length*sample.selectionSeverity/100);
  assert.equal(cull.habitatStamps.length,sample.habitatStamps.length-expected);
  assert.ok(cull.habitatStamps.some(s=>s.parent===0));
  assert.ok(cull.habitatStamps.some(s=>s.parent===1));
  assert.deepEqual(cull.habitatStamps,
    sample.habitatStamps.filter(s=>cull.habitatStamps.some(x=>x.id===s.id)));
  assert.deepEqual(sample.habitatStamps[0].id,"A-0");
  assert.equal(cull.lettering,sample.lettering);
  assert.deepEqual(cull.colors,sample.colors);
  assert.deepEqual(validateRecipe(cull),cull);
  const noPressure={...sample,selectionPressure:0};
  assert.equal(cullWeakest(noPressure),noPressure);
  const noSeverity={...sample,selectionSeverity:0};
  assert.equal(cullWeakest(noSeverity),noSeverity);
});

test("culling does not delete last remaining parent species even at 100 percent severity",()=>{
  const harsh={...sample,selectionSeverity:100};
  const culled=cullWeakest(harsh);
  assert.equal(culled.habitatStamps.length,2);
  assert.equal(culled.habitatStamps.filter(m=>m.parent===0).length,1);
  assert.equal(culled.habitatStamps.filter(m=>m.parent===1).length,1);
  const single={...sample,habitatStamps:[sample.habitatStamps[0]]};
  assert.equal(cullWeakest(single),single);
  const onlyOneSpecies={...sample,selectionSeverity:100,
    habitatStamps:sample.habitatStamps
    .filter(x=>x.parent===0)};
  assert.equal(cullWeakest(onlyOneSpecies).habitatStamps.length,1);
});

test("selectively bred offspring come from highest-fitness parents with real DNA ancestry",()=>{
  const gen=breedFittest(sample);
  assert.notEqual(gen,sample);
  const n=Math.ceil(sample.habitatStamps.length*sample.selectionBrood/100);
  assert.equal(gen.habitatStamps.length,sample.habitatStamps.length+n);
  assert.equal(gen.sporeGeneration,1);
  const ranked=rankSelection(sample).slice(0,n);
  for(let i=0;i<n;i++){
    const ancestor=ranked[i].stamp;
    const baby=gen.habitatStamps[sample.habitatStamps.length+i];
    assert.equal(baby.ancestor,ancestor.id);
    assert.equal(baby.parent,ancestor.parent);
    assert.equal(baby.generation,ancestor.generation+1);
    assert.ok(Number.isInteger(baby.gene)&&baby.gene>=0&&baby.gene<=100);
    const pos=daughterSite(sample,ranked[i].index);
    assert.deepEqual({x:baby.x,y:baby.y},pos);
    assert.ok(baby.radius>=.05&&baby.radius<=.28);
  }
  assert.deepEqual(gen.habitatStamps.slice(0,sample.habitatStamps.length),
    sample.habitatStamps);
  assert.deepEqual(gen.colors,sample.colors);
  assert.equal(gen.lettering,sample.lettering);
  assert.deepEqual(validateRecipe(gen),gen);
  assert.deepEqual(parseDocument(recipeDocument(gen,"selected genes",
    {time:3,colorTime:7})).state,gen);
});

test("one-click evolutionary cycle breeds survivors, supports grandchildren and enforces 16",()=>{
  const one=selectionCycle(sample);
  assert.ok(one.habitatStamps.length>0&&one.habitatStamps.length<=16);
  assert.ok(one.habitatStamps.some(m=>m.generation===1));
  const two=selectionCycle(one);
  assert.ok(two.sporeGeneration>one.sporeGeneration);
  assert.ok(two.habitatStamps.length<=16);
  const next=selectionCycle(two);
  assert.ok(next.habitatStamps.length<=16);
  assert.ok(new Set(next.habitatStamps.map(m=>m.id)).size===
    next.habitatStamps.length);
  assert.deepEqual(validateRecipe(next),next);
  const full={...sample,habitatStamps:Array.from({length:16},(_,i)=>({
    ...sample.habitatStamps[i%sample.habitatStamps.length],
    id:"full-"+i,
  }))};
  assert.equal(breedFittest(full),full);
  assert.equal(breedFittest({...sample,selectionBrood:0}).sporeGeneration,0);
  const exhausted={...sample,sporeGeneration:4095};
  assert.equal(breedFittest(exhausted),exhausted);
});

test("selection presets and shuffle preserve all planted art and user typography",()=>{
  assert.equal(selectionPresets.length,4);
  for(const preset of selectionPresets){
    const s=applySelectionPreset(sample,preset.name);
    assert.equal(s.selectionMode,preset.selectionMode);
    assert.ok(s.selectionPressure>0);
    assert.deepEqual(s.habitatStamps,sample.habitatStamps);
    assert.equal(s.lettering,sample.lettering);
    assert.deepEqual(s.colors,sample.colors);
    assert.deepEqual(validateRecipe(s),s);
  }
  assert.equal(applySelectionPreset(sample,"fake preset"),sample);
  for(const n of [0,.1,.24,.43,.75,.99]){
    const s=shuffleSelection(sample,()=>n);
    assert.ok(s.selectionPressure>0);
    assert.notEqual(s.selectionMode,"Dormant");
    assert.deepEqual(s.habitatStamps,sample.habitatStamps);
    assert.deepEqual(validateRecipe(s),s);
    assert.deepEqual(stopSelection(s).habitatStamps,s.habitatStamps);
  }
});

test("Surprise and Freakshow awaken adaptation only when real genes and minerals coexist",()=>{
  for(const n of [0,.13,.29,.44,.62,.79,.99]){
    const eco=shuffleEcosystem(base,()=>n);
    const full=fullWeirdShuffle(base,()=>n);
    for(const s of [eco,full]){
      assert.deepEqual(validateRecipe(s),s);
      if(s.selectionPressure>0){
        assert.ok(selectionActive(s));
        assert.ok(s.habitatStamps.some(m=>Number.isInteger(m.gene)));
        assert.ok(s.substrateAmount>0);
      }
    }
    assert.equal(full.lettering,base.lettering);
    assert.deepEqual(full.colors,base.colors);
  }
  assert.equal(randomize(base,{},true,()=>.75).selectionPressure,0);
  const surprised=randomize(base,{},false,()=>.43);
  assert.deepEqual(validateRecipe(surprised),surprised);
});

test("bad selection settings never enter the GPU or saved recipes",()=>{
  for(const [key,value] of [
    ["selectionMode","kill them all"],["selectionPressure",101],
    ["selectionSeverity",-1],["selectionBrood",NaN],
    ["selectionGlow",Infinity]
  ])assert.throws(()=>validateRecipe({...base,[key]:value}),undefined,key);
  assert.equal(selectionActive({...sample,substrateAmount:0}),false);
  assert.equal(selectionActive({...sample,geneAmount:0}),false);
  assert.equal(selectionActive({...sample,selectionMode:"Dormant"}),false);
  assert.equal(selectionActive({...sample,habitatStamps:[]}),false);
});

test("all 157 Lookbook specimens are genuine saved ecology with preserved history",()=>{
  assert.equal(looks.length,157);
  assert.equal(new Set(looks.map(l=>l.name)).size,157);
  const selections=looks.filter(x=>x.family==="Selection Chamber");
  assert.equal(selections.length,4);
  for(const look of looks){
    assert.deepEqual(validateRecipe(look.state),look.state,look.name);
    assert.deepEqual(parseDocument(recipeDocument(look.state,look.name,
      {time:1,colorTime:7})).state,look.state,look.name);
  }
  for(const look of selections){
    const s=look.state;
    assert.ok(selectionActive(s),look.name);
    assert.ok(geneEnabled(s),look.name);
    assert.ok(s.habitatStamps.length>=8);
    assert.ok(s.habitatStamps.every(m=>Number.isInteger(m.gene)));
    const scores=rankSelection(s).map(m=>m.fitness);
    assert.ok(scores.every(n=>Number.isFinite(n)&&n>=0&&n<=1));
    assert.ok(Math.max(...scores)-Math.min(...scores)>.03);
  }
});

test("GPU uses same CPU fitness law, reuses masks, and omits dormant code",()=>{
  const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
  const ui=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
  assert.match(renderer,/withSelection = selectionActive\(s\)/);
  assert.match(renderer,/withSelection \? selectionGLSL : ""/);
  assert.match(renderer,/withSelection \? "survival" : "no-survival"/);
  assert.match(renderer,/selectionFieldA=max\(selectionFieldA,localFitness\*disk\)/);
  assert.match(renderer,/selectionFieldB=max\(selectionFieldB,localFitness\*disk\)/);
  assert.match(renderer,/tintAdaptiveSurvival\(col,atmoAMask,selectionFieldA/);
  assert.match(renderer,/tintAdaptiveSurvival\(col,atmoBMask,selectionFieldB/);
  assert.match(renderer,/gl\.uniform1i\(loc\("selectionMode"\),selectionModes\.indexOf\(s\.selectionMode\)\)/);
  assert.match(selectionGLSL,/vec3 tintAdaptiveSurvival/);
  assert.match(selectionGLSL,/float adaptiveFitness\(float allele,float nutrientLevel,float parent\)/);
  assert.doesNotMatch(selectionGLSL,/sampler|texture2D|discard|uniform\s+vec[234]\s+\w+\s*\[/);
  assert.ok(habitatGLSL.includes("/* SELECTION_MODULE */"));
  assert.ok(habitatGLSL.includes("/* SELECTION_EDGE */"));
  assert.ok(habitatGLSL.includes("/* SELECTION_SAMPLE */"));
  for(const key of selectionControls)
    assert.ok(ui.includes('name="'+key+'"'),key);
  for(const label of ["Breed the fittest","Cull weakest","Select + reproduce",
    "Fitness scoreboard","Stop selection"])
    assert.ok(ui.includes(label),label);
  assert.ok(ui.includes("window.confirm"));
  assert.equal(sectionMeta("selection-chamber").group,"Scene");
  assert.equal(sectionActive(sectionMeta("selection-chamber"),initial),false);
  assert.equal(findControls("selective breeding")[0].id,"selection-chamber");
});
