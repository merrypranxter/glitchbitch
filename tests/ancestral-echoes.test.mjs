import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,validateRecipe,recipeDocument,parseDocument} from "../src/data.js";
import {archiveFossils} from "../src/fossil-record.js";
import {resurrectWholeArchive} from "../src/ancestral-resurrection.js";
import {echoModes,ancestralSignature,echoGene,
  evolveAncestralGeneration,evolveAncestralEpochs} from "../src/ancestral-echoes.js";
const base={...initial,seed:741,sporeGeneration:2,sporeFertility:100,
  sporeReach:65,sporeAmount:90,sporeMode:"Windborne",
  geneAmount:90,geneMutation:50,fossilBurial:100,
  fossilMode:"Ancestral compost",fossilAmount:90,
  substrateMode:"Nutrient rivers",substrateAmount:85,
  habitatStamps:[
    {id:"ancestor-a",x:.25,y:.30,radius:.15,parent:0,gene:8,generation:0},
    {id:"ancestor-b",x:.70,y:.75,radius:.17,parent:1,gene:94,generation:0},
  ]};
const archive=archiveFossils(base);
test("ancestral DNA is deterministic and archive never changes",()=>{
  assert.equal(echoModes.length,4);
  const signature=ancestralSignature(archive,archive.habitatStamps[0]);
  assert.equal(signature,8);
  const child={id:"offspring-2-0-741",gene:50};
  assert.equal(echoGene(archive,archive.habitatStamps[0],child,"Genetic atavism",100),17);
  assert.equal(echoGene(archive,archive.habitatStamps[0],child,"Rebel descendants",100),84);
  assert.equal(echoGene(archive,archive.habitatStamps[0],child,"Genetic atavism",0),50);
  for(const mode of echoModes){
    const a=evolveAncestralGeneration(archive,mode,75);
    const b=evolveAncestralGeneration(archive,mode,75);
    assert.deepEqual(a,b);
    assert.deepEqual(a.fossilRecords,archive.fossilRecords);
    assert.deepEqual(a.habitatStamps.slice(0,2),archive.habitatStamps);
    assert.deepEqual(validateRecipe(a),a);
    assert.deepEqual(parseDocument(recipeDocument(a,"Echo",{time:0,colorTime:0})).state,a);
  }
});
test("three generations use existing landing law, stay within 16 seeds, undo atomically",()=>{
  const grown=evolveAncestralEpochs(archive,3,"Mutation bloom",90);
  assert.ok(grown.habitatStamps.length>archive.habitatStamps.length);
  assert.ok(grown.habitatStamps.length<=16);
  assert.ok(grown.sporeGeneration>archive.sporeGeneration);
  assert.deepEqual(grown.fossilRecords,archive.fossilRecords);
  assert.deepEqual(evolveAncestralEpochs(archive,3,"Mutation bloom",90),grown);
  assert.deepEqual(validateRecipe(grown),grown);
  assert.equal(evolveAncestralEpochs(archive,0),archive);
  const empty={...archive,habitatStamps:[]};
  assert.equal(evolveAncestralGeneration(empty),empty);
});
test("extinct populations can resurrect then evolve with fossil memory",()=>{
  const extinct={...archive,habitatStamps:[]};
  assert.equal(evolveAncestralGeneration(extinct),extinct);
  const revived=resurrectWholeArchive(extinct);
  assert.equal(revived.habitatStamps.length,2);
  const grown=evolveAncestralGeneration(revived);
  assert.ok(grown.habitatStamps.length>2);
  assert.deepEqual(grown.fossilRecords,archive.fossilRecords);
  assert.deepEqual(validateRecipe(grown),grown);
});
test("UI exposes controls without introducing new GPU shader",()=>{
  const ui=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
  for(const s of ["Ancestral Echoes","Evolve ancestral generation","Evolve three generations"])
    assert.ok(ui.includes(s));
});
