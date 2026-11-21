import test from "node:test";
import assert from "node:assert/strict";
import {initial,validateRecipe,recipeDocument,parseDocument} from "../src/data.js";
import {evolveSporeGeneration} from "../src/spore-dynasties.js";
import {branchSpecies,contestTerritory,lineageCensus,speciationModes} from "../src/speciation-lab.js";
import {shuffleEcosystem} from "../src/ecosystem-randomizer.js";
const original={...initial,seed:741,sporeGeneration:2,sporeFertility:100,geneAmount:90,
  atmoAmount:85,atmoBAmount:85,atmoMaskMode:"Painted colonies",
  atmoBMaskMode:"Painted colonies",habitatStamps:[
    {id:"one",x:.35,y:.5,radius:.22,parent:0,gene:10,generation:0},
    {id:"two",x:.55,y:.5,radius:.23,parent:1,gene:90,generation:0}]};
test("branches are deterministic, bounded and round-trip through recipes",()=>{
  for(const mode of speciationModes){
    const a=branchSpecies(original,mode,80);
    assert.deepEqual(a,branchSpecies(original,mode,80));
    assert.equal(a.habitatStamps.length,4);
    assert.deepEqual(a.habitatStamps.slice(0,2).map(x=>x.id),["one","two"]);
    assert.ok(a.habitatStamps.every(m=>m.clade&&Number.isInteger(m.gene)));
    assert.notEqual(a.habitatStamps[0].clade,a.habitatStamps[2].clade);
    assert.deepEqual(validateRecipe(a),a);
    assert.deepEqual(parseDocument(recipeDocument(a,"Species",{time:0,colorTime:0})).state,a);
  }
});
test("subsequent spore births inherit clade ancestry",()=>{
  const b=branchSpecies(original,"Chromatic divergence",80);
  const descendants=evolveSporeGeneration(b);
  assert.ok(descendants.habitatStamps.length>b.habitatStamps.length);
  assert.equal(descendants.habitatStamps[4].clade,b.habitatStamps[0].clade);
  assert.equal(lineageCensus(descendants).reduce((n,x)=>n+x.count,0),
    descendants.habitatStamps.length);
});
test("territory contest changes overlapping radii, not colors or population",()=>{
  const result=contestTerritory(original,100);
  assert.notEqual(result,original);
  assert.equal(result.habitatStamps.length,original.habitatStamps.length);
  assert.deepEqual(result.colors,original.colors);
  assert.ok(result.habitatStamps.some((m,i)=>m.radius!==original.habitatStamps[i].radius));
  assert.deepEqual(validateRecipe(result),result);
  const far={...original,habitatStamps:[original.habitatStamps[0],
    {...original.habitatStamps[1],x:.98,y:.98}]};
  assert.equal(contestTerritory(far,100),far);
});
test("cap, empty state, and invalid clade are safely handled",()=>{
  const empty={...original,habitatStamps:[]};assert.equal(branchSpecies(empty),empty);
  const full={...original,habitatStamps:Array.from({length:16},(_,i)=>({
    id:"seed"+i,x:(i%4+.5)/4,y:(Math.floor(i/4)+.5)/4,radius:.1,parent:i%2}))};
  assert.equal(branchSpecies(full).habitatStamps.length,16);
  assert.deepEqual(validateRecipe(branchSpecies(full)),branchSpecies(full));
  assert.equal(branchSpecies(original,"invalid"),original);
  assert.throws(()=>validateRecipe({...original,habitatStamps:[
    {...original.habitatStamps[0],clade:"evil<script>"},original.habitatStamps[1]]}),/clade/);
});
test("weighted ecosystem shuffle can make saved clades without destroying its recipe",()=>{
  const s=shuffleEcosystem(original,()=>.1,{allowDual:true,allowHeavy:false});
  assert.ok(s.habitatStamps.length<=16);
  assert.ok(s.habitatStamps.some(m=>m.clade));
  assert.deepEqual(validateRecipe(s),s);
  const single=shuffleEcosystem(original,()=>.1,{allowDual:false,allowHeavy:false});
  assert.equal(single.atmoBAmount,0);
});
