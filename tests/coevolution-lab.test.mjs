import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,validateRecipe,recipeDocument,parseDocument} from "../src/data.js";
import {coevolutionModes,encounterNetwork,stageEncounter,evolveCoevolution} from "../src/coevolution-lab.js";
import {evolveSporeGeneration} from "../src/spore-dynasties.js";
import {shuffleEcosystem} from "../src/ecosystem-randomizer.js";

const seeds=[
  {id:"alpha",x:.32,y:.50,radius:.18,parent:0,gene:15,
    generation:2,clade:"A-red"},
  {id:"beta",x:.52,y:.50,radius:.18,parent:1,gene:85,
    generation:2,clade:"B-blue"},
];
const base={...initial,seed:741,coevoRound:0,sporeGeneration:4,
  sporeFertility:100,sporeAmount:88,geneAmount:90,
  atmoAmount:86,atmoBAmount:81,
  atmoMaskMode:"Painted colonies",atmoBMaskMode:"Painted colonies",
  habitatStamps:seeds,lettering:"ALIEN LOVE",fossilRecords:[]};

test("all coevolution modes are deterministic and preserve artwork",()=>{
  assert.equal(coevolutionModes.length,4);
  for(const mode of coevolutionModes){
    const out=evolveCoevolution(base,mode,95,3);
    assert.deepEqual(out,evolveCoevolution(base,mode,95,3),mode);
    assert.equal(out.coevoRound,3,mode);
    assert.equal(out.habitatStamps.length,seeds.length,mode);
    assert.deepEqual(out.habitatStamps.map(m=>m.id),seeds.map(m=>m.id));
    assert.deepEqual(out.habitatStamps.map(m=>m.clade),seeds.map(m=>m.clade));
    assert.deepEqual(out.colors,base.colors,mode);
    assert.equal(out.lettering,base.lettering,mode);
    assert.deepEqual(out.fossilRecords,base.fossilRecords,mode);
    assert.ok(out.habitatStamps.some((m,i)=>
      m.gene!==seeds[i].gene||m.radius!==seeds[i].radius),mode);
    assert.deepEqual(validateRecipe(out),out,mode);
    assert.deepEqual(parseDocument(recipeDocument(out,"Coevolution",
      {time:0,colorTime:0})).state,out,mode);
  }
});
test("distant rivals are inert until the artist stages an encounter",()=>{
  const far={...base,habitatStamps:[seeds[0],
    {...seeds[1],x:.94,y:.94}]};
  assert.equal(encounterNetwork(far).length,0);
  assert.equal(evolveCoevolution(far,"Mimicry",90),far);
  const stage=stageEncounter(far);
  assert.notEqual(stage,far);
  assert.ok(encounterNetwork(stage).length>0);
  assert.deepEqual(stage.habitatStamps[0],far.habitatStamps[0]);
  assert.deepEqual(validateRecipe(stage),stage);
  const evolved=evolveCoevolution(stage,"Mimicry",90);
  assert.equal(evolved.coevoRound,1);
  assert.equal(stageEncounter(stage),stage); // already in contact
});
test("mutualists grow, mimics converge, arms races diverge",()=>{
  const pair=base.habitatStamps;
  const mimic=evolveCoevolution(base,"Mimicry",100);
  const war=evolveCoevolution(base,"Defensive arms race",100);
  const friends=evolveCoevolution(base,"Mutualism",100);
  assert.ok(Math.abs(mimic.habitatStamps[0].gene-mimic.habitatStamps[1].gene)<
    Math.abs(pair[0].gene-pair[1].gene));
  assert.ok(Math.abs(war.habitatStamps[0].gene-war.habitatStamps[1].gene)>=
    Math.abs(pair[0].gene-pair[1].gene));
  assert.ok(friends.habitatStamps.every((m,i)=>m.radius>pair[i].radius));
});
test("old recipes, no-op guards and the 16-colony ceiling",()=>{
  assert.equal(validateRecipe({...base,coevoRound:undefined}).coevoRound,0);
  assert.equal(evolveCoevolution(base,"unknown",100),base);
  assert.equal(evolveCoevolution(base,"Mimicry",0),base);
  assert.equal(evolveCoevolution(base,"Mimicry",50,0),base);
  assert.equal(evolveCoevolution({...base,coevoRound:4095},"Mimicry",100).coevoRound,4095);
  assert.throws(()=>validateRecipe({...base,coevoRound:4096}),/coevolution/);
  assert.throws(()=>validateRecipe({...base,coevoRound:-1}),/coevolution/);
  const full={...base,habitatStamps:Array.from({length:16},(_,i)=>({
    id:"line"+i,x:.24+(i%4)*.1,y:.24+Math.floor(i/4)*.1,
    radius:.1,parent:i%2,gene:15+4*i,clade:(i%2?"B-":"A-")+"cl"+i}))};
  const evolve=evolveCoevolution(full,"Mutualism",85,3);
  assert.equal(evolve.habitatStamps.length,16);
  assert.deepEqual(validateRecipe(evolve),evolve);
});
test("offspring keep clade and coevolution has no hidden playback changes",()=>{
  const after=evolveCoevolution(base,"Mutualism",70);
  const grown=evolveSporeGeneration(after);
  assert.ok(grown.habitatStamps.length>after.habitatStamps.length);
  assert.equal(grown.habitatStamps[2].clade,after.habitatStamps[0].clade);
  assert.deepEqual(after,evolveCoevolution(base,"Mutualism",70));
});
test("Coevolution controls are searchable and shuffles preserve constraints",()=>{
  const ui=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
  for(const name of ["Coevolution Lab","Stage closest rivals",
    "Evolve one encounter","Evolve three encounters","Encounter network"]){
    const joined=ui+readFileSync(new URL("../src/ui-index.js",import.meta.url),"utf8");
    assert.ok(joined.toLowerCase().includes(name.toLowerCase()),name);
  }
  const shuffled=shuffleEcosystem(base,()=>.1,{allowDual:true});
  assert.ok(shuffled.habitatStamps.length<=16);
  assert.deepEqual(validateRecipe(shuffled),shuffled);
  const single=shuffleEcosystem(base,()=>.1,{allowDual:false});
  assert.equal(single.atmoBAmount,0);
});
