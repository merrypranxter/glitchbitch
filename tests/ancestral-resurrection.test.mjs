import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,validateRecipe,recipeDocument,parseDocument} from "../src/data.js";
import {archiveFossils,archiveAndAdvance,MAX_FOSSILS} from "../src/fossil-record.js";
import {resurrectionModes,revivalId,canResurrectRecord,resurrectFossil,
  resurrectOldest,resurrectWholeArchive} from "../src/ancestral-resurrection.js";

const base={...initial,seed:1234,ratio:"9:16",
  substrateMode:"Nutrient rivers",substrateAmount:85,
  substrateScale:72,substratePressure:80,
  fossilMode:"Opal reliquary",fossilAmount:95,fossilDepth:87,
  apocalypseEpoch:4,sporeGeneration:2,geneMutation:84,
  atmoAmount:0,atmoBAmount:0,geneAmount:0,
  habitatStamps:[
    {id:"A-ancestor",x:.3,y:.27,radius:.19,parent:0,gene:17,generation:1},
    {id:"B-ancestor",x:.7,y:.78,radius:.21,parent:1,gene:81,generation:2},
  ],fossilBurial:100};
const buried=archiveFossils(base);
const emptyWorld={...buried,habitatStamps:[]};
const ancientA=buried.fossilRecords.find(r=>r.parent===0);
const ancientB=buried.fossilRecords.find(r=>r.parent===1);

test("fossil archive is a readable immutable input for real new colonies",()=>{
  assert.equal(MAX_FOSSILS,8);
  assert.deepEqual(resurrectionModes,[
    "Faithful echo","Ancestral crossover","Adaptive comeback","Kingdom inversion",
  ]);
  const frozen=structuredClone(emptyWorld);
  const risen=resurrectFossil(emptyWorld,ancientA.id);
  assert.deepEqual(emptyWorld,frozen);
  assert.deepEqual(risen.fossilRecords,frozen.fossilRecords);
  assert.equal(risen.habitatStamps.length,1);
  const baby=risen.habitatStamps[0];
  assert.equal(baby.ancestor,ancientA.origin);
  assert.equal(baby.gene,ancientA.gene);
  assert.equal(baby.parent,ancientA.parent);
  assert.equal(baby.id,revivalId(emptyWorld,ancientA));
  assert.ok(baby.id.length<=80);
  assert.ok(baby.radius>=.05&&baby.radius<=.45);
  assert.ok(baby.x>=0&&baby.x<=1&&baby.y>=0&&baby.y<=1);
  assert.equal(risen.atmoMaskMode,"Painted colonies");
  assert.ok(risen.atmoAmount>=77);
  assert.ok(risen.geneAmount>=78);
  assert.deepEqual(validateRecipe(risen),risen);
  assert.deepEqual(parseDocument(recipeDocument(risen,"dead again",
    {time:0,colorTime:0})).state,risen);
});

test("each fossil can be revived once per epoch, then again in later epochs",()=>{
  const once=resurrectFossil(emptyWorld,ancientA.id);
  assert.equal(resurrectFossil(once,ancientA.id),once);
  assert.equal(canResurrectRecord(once,ancientA),false);
  const next=archiveAndAdvance(once);
  assert.equal(next.apocalypseEpoch,emptyWorld.apocalypseEpoch+1);
  assert.ok(canResurrectRecord(next,ancientA));
  const twice=resurrectFossil(next,ancientA.id);
  assert.equal(twice.habitatStamps.length,2);
  assert.notEqual(twice.habitatStamps[0].id,twice.habitatStamps[1].id);
  assert.deepEqual(twice.fossilRecords,next.fossilRecords);
});

test("all four distinct resurrection algorithms preserve legal genetic ancestry",()=>{
  const echo=resurrectFossil(buried,ancientB.id,"Faithful echo");
  const graft=resurrectFossil(buried,ancientB.id,"Ancestral crossover");
  const adaptive=resurrectFossil(buried,ancientB.id,"Adaptive comeback");
  const inverted=resurrectFossil(buried,ancientB.id,"Kingdom inversion");
  const descendant=x=>x.habitatStamps.at(-1);
  assert.equal(descendant(echo).gene,ancientB.gene);
  assert.equal(descendant(graft).mate,"B-ancestor");
  assert.equal(descendant(inverted).gene,100-ancientB.gene);
  assert.equal(descendant(inverted).parent,0);
  assert.equal(inverted.atmoMaskMode,"Painted colonies");
  for(const variation of [echo,graft,adaptive,inverted]){
    const baby=descendant(variation);
    assert.ok(baby.gene>=0&&baby.gene<=100);
    assert.equal(baby.ancestor,ancientB.origin);
    assert.ok(baby.generation>ancientB.epoch);
    assert.deepEqual(validateRecipe(variation),variation);
  }
  assert.deepEqual(resurrectFossil(buried,ancientB.id,"unknown"),buried);
});

test("whole archive obeys 16 live seed cap, replay is idempotent and deterministic",()=>{
  let full={...buried,habitatStamps:[
    ...base.habitatStamps,
    ...Array.from({length:13},(_,i)=>({
      id:"extra-"+i,x:(i%6+.5)/6,y:(Math.floor(i/6)+.5)/4,
      radius:.06,parent:i%2,gene:i*7%101,generation:0,
    })),
  ]};
  assert.equal(full.habitatStamps.length,15);
  const raised=resurrectWholeArchive(full,"Adaptive comeback");
  assert.equal(raised.habitatStamps.length,16);
  assert.deepEqual(resurrectWholeArchive(raised,"Adaptive comeback"),raised);
  assert.deepEqual(resurrectWholeArchive(full,"Adaptive comeback"),raised);
  assert.deepEqual(raised.fossilRecords,full.fossilRecords);
  assert.deepEqual(validateRecipe(raised),raised);
  assert.equal(canResurrectRecord(raised,ancientA),false);
  assert.equal(resurrectFossil(raised,ancientA.id),raised);
});

test("extinction comeback raises all A/B species and keeps existing artwork",()=>{
  const risen=resurrectWholeArchive(emptyWorld,"Faithful echo");
  assert.equal(risen.habitatStamps.length,2);
  assert.deepEqual(risen.habitatStamps.map(s=>s.parent).sort(),[0,1]);
  assert.equal(risen.atmoMaskMode,"Painted colonies");
  assert.equal(risen.atmoBMaskMode,"Painted colonies");
  assert.ok(risen.atmoAmount>0&&risen.atmoBAmount>0);
  assert.deepEqual(risen.colors,base.colors);
  assert.deepEqual(risen.marks,base.marks);
  assert.equal(resurrectWholeArchive(risen),risen);
  assert.deepEqual(resurrectOldest(emptyWorld),resurrectFossil(
    emptyWorld,ancientA.id));
});

test("UI and renderer hook to historic ecology without introducing new shaders",()=>{
  const jsx=readFileSync(new URL("../src/components/Inspectors.jsx",
    import.meta.url),"utf8");
  const gpu=readFileSync(new URL("../src/renderer.js",
    import.meta.url),"utf8");
  for(const name of ["Resurrection Chamber","Faithful echo","Revive oldest ancestor",
    "Raise the whole graveyard","Revive"]){
    // The strategy strings may live in the pure model rather than JSX.
    assert.ok((jsx+resurrectionModes.join(" ")).includes(name),name);
  }
  assert.match(jsx,/resurrectFossil\(/);
  assert.match(jsx,/resurrectWholeArchive\(/);
  assert.match(gpu,/daughterSite\(s,i\)/);
  assert.doesNotMatch(gpu,/resurrectionGLSL|resurrectionStamps/);
});
