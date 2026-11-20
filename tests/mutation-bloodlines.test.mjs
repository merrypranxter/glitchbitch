import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,looks,numericRanges,validateRecipe,randomize,
  parseDocument,recipeDocument} from "../src/data.js";
import {geneControls,genePresets,geneGLSL,geneEnabled,founderGene,
  packGeneMarker,seedGenePool,mutateGenePool,mutateSelectedGene,
  inheritColonyGene,applyGenePreset,hideGenetics} from "../src/colony-genetics.js";
import {evolveSporeGeneration} from "../src/spore-dynasties.js";
import {makeColony} from "../src/habitat-painter.js";
import {habitatGLSL} from "../src/atmosphere-habitats.js";
import {shuffleEcosystem,fullWeirdShuffle} from "../src/ecosystem-randomizer.js";
import {sectionMeta,sectionActive,findControls} from "../src/ui-index.js";

const painted=looks.find(l=>l.family==="Painted Habitats").state;
const base={...initial,seed:813792,ratio:"9:16",
  engine:18,lettering:"ARTIST WORDS ARE NOT INHERITED",
  palette:-1,colors:["#ff0088","#00ffff","#fcff05"]};
const r=number=>()=>number;
const sequence=seed=>()=>{
  seed=(Math.imul(seed,1664525)+1013904223)>>>0;
  return seed/4294967296;
};
test("all old seeds and initial art are genome-free until opt in",()=>{
  assert.deepEqual(geneControls,
    ["geneAmount","geneMutation","geneCrossbreed","geneGlow"]);
  for(const key of geneControls)
    assert.deepEqual(numericRanges[key],[0,100],key);
  assert.equal(initial.geneAmount,0);
  assert.equal(geneEnabled(initial),false);
  const old={...painted};
  for(const key of geneControls)delete old[key];
  const restored=validateRecipe(old);
  for(const key of geneControls)
    assert.deepEqual(restored[key],initial[key],key);
  assert.deepEqual(restored.habitatStamps,painted.habitatStamps);
  assert.deepEqual(restored.colors,painted.colors);
  assert.deepEqual(restored.marks,painted.marks);
  assert.equal(restored.lettering,painted.lettering);
  assert.equal(geneEnabled(restored),false);
});
test("founder alleles are deterministic, seeded populations keep all original coordinates",()=>{
  const one=seedGenePool(painted,sequence(27));
  const two=seedGenePool(painted,sequence(27));
  assert.deepEqual(one,two);
  assert.ok(one.geneAmount>=65);
  assert.ok(one.habitatStamps.every((s,i)=>
    Number.isInteger(s.gene)&&s.gene>=0&&s.gene<=100&&
    s.generation===0&&s.x===painted.habitatStamps[i].x&&
    s.y===painted.habitatStamps[i].y&&s.radius===painted.habitatStamps[i].radius));
  assert.ok(new Set(one.habitatStamps.map(s=>s.gene)).size>1);
  assert.deepEqual(validateRecipe(one),one);
  assert.equal(founderGene(base,{id:"founder",parent:0}),
    founderGene(base,{id:"founder",parent:0}));
  assert.equal(seedGenePool(base,r(.5)),base); // no invisible new seeds
});
test("every gene survives save/reload, including manually edited genealogy",()=>{
  const s=seedGenePool({...painted,geneAmount:95},sequence(149));
  const assigned={...s,habitatStamps:s.habitatStamps.map((m,i)=>i===0
    ?{...m,gene:0,generation:11,ancestor:"super-parent"}:m)};
  assert.deepEqual(validateRecipe(assigned),assigned);
  assert.deepEqual(parseDocument(recipeDocument(assigned,
    "freakish ancestry",{time:7,colorTime:6})).state,assigned);
  assert.equal(assigned.habitatStamps[0].gene,0);
  assert.equal(assigned.habitatStamps[0].ancestor,"super-parent");
  assert.deepEqual(painted.habitatStamps,
    looks.find(l=>l.family==="Painted Habitats").state.habitatStamps);
});
test("genetic mutation and selected-DNA edits never erase the parent artwork",()=>{
  const s=seedGenePool(painted,sequence(99));
  const mutated=mutateGenePool({...s,geneMutation:93},sequence(18));
  assert.notDeepEqual(mutated.habitatStamps.map(m=>m.gene),
    s.habitatStamps.map(m=>m.gene));
  assert.deepEqual(mutated.habitatStamps.map(m=>m.id),
    s.habitatStamps.map(m=>m.id));
  assert.deepEqual(mutated.colors,s.colors);
  assert.deepEqual(mutated.marks,s.marks);
  assert.equal(mutated.lettering,s.lettering);
  assert.equal(mutated.engine,s.engine);
  const id=s.habitatStamps[0].id;
  const selected=mutateSelectedGene(s,id,r(.99));
  assert.deepEqual(selected.habitatStamps.slice(1),s.habitatStamps.slice(1));
  assert.equal(mutateSelectedGene(s,"nonexistent",r(.3)),s);
  assert.deepEqual(validateRecipe(selected),selected);
  const hidden=hideGenetics(mutated);
  assert.equal(hidden.geneAmount,0);
  assert.deepEqual(hidden.habitatStamps,mutated.habitatStamps);
});
test("daughter inherits actual alleles and nearby opposite parent can recombine",()=>{
  const parent={id:"A",x:.4,y:.5,radius:.2,parent:0,gene:10,generation:2};
  const opposite={id:"B",x:.42,y:.52,radius:.21,parent:1,gene:90,generation:0};
  const site={x:.44,y:.53};
  const state={...base,ratio:"1:1",habitatStamps:[parent,opposite],
    geneAmount:92,geneMutation:0,geneCrossbreed:0,sporeGeneration:2};
  const alone=inheritColonyGene(state,parent,0,site);
  const crossed=inheritColonyGene({...state,geneCrossbreed:100},parent,0,site);
  assert.ok(alone.gene>=0&&alone.gene<=100);
  assert.ok(crossed.gene>alone.gene);
  assert.equal(crossed.ancestor,"A");
  assert.equal(crossed.mate,"B");
  assert.equal(alone.mate,undefined);
  assert.equal(crossed.generation,3);
  assert.deepEqual(inheritColonyGene({...state,geneAmount:0},parent,0,site),{});
  assert.deepEqual(crossed,
    inheritColonyGene({...state,geneCrossbreed:100},parent,0,site));
  const far=inheritColonyGene({...state,geneCrossbreed:100},parent,0,
    {x:.95,y:.95});
  assert.equal(far.gene,alone.gene);
});
test("Evolve Generation commits mutated genetic descendants and grandchildren",()=>{
  const parent={id:"founder-A",x:.40,y:.43,radius:.20,parent:0,
    gene:34,generation:0};
  const other={id:"founder-B",x:.58,y:.51,radius:.20,parent:1,
    gene:88,generation:0};
  const s={...base,ratio:"1:1",habitatStamps:[parent,other],
    atmoAmount:90,atmoBAmount:80,atmoMaskMode:"Painted colonies",
    atmoBMaskMode:"Painted colonies",geneAmount:95,geneMutation:92,
    geneCrossbreed:90,sporeGeneration:0,sporeMode:"Windborne",
    sporeFertility:100,sporeReach:30,sporeAmount:90};
  const born=evolveSporeGeneration(s);
  assert.equal(born.habitatStamps.length,4);
  assert.equal(born.sporeGeneration,1);
  assert.equal(born.habitatStamps[2].ancestor,parent.id);
  assert.equal(born.habitatStamps[2].generation,1);
  assert.equal(born.habitatStamps[3].ancestor,other.id);
  assert.ok(born.habitatStamps.slice(2).every(m=>Number.isInteger(m.gene)));
  assert.deepEqual(validateRecipe(born),born);
  const grand=evolveSporeGeneration(born);
  assert.ok(grand.habitatStamps.length>born.habitatStamps.length);
  assert.ok(grand.habitatStamps.some(m=>m.generation===2));
  assert.deepEqual(parseDocument(recipeDocument(grand,"grandchildren",
    {time:5,colorTime:4})).state,grand);
  const sterile={...s,geneAmount:0};
  assert.ok(evolveSporeGeneration(sterile).habitatStamps.slice(2)
    .every(m=>m.gene===undefined&&m.ancestor===undefined));
});
test("DNA packs into existing parent marker without any new GPU arrays",()=>{
  for(const parent of [0,1]){
    assert.equal(packGeneMarker({parent},true),parent);
    assert.equal(packGeneMarker({parent,gene:100},false),parent);
    for(const gene of [0,12,50,77,100]){
      const marker=packGeneMarker({parent,gene},true);
      assert.ok(Math.abs(marker-parent)<.1);
      assert.ok(Math.abs(marker-parent)>=.010-1e-7);
      const decoded=((marker-parent)-.010)/.075*100;
      assert.ok(Math.abs(decoded-gene)<1e-8);
    }
  }
  assert.match(geneGLSL,/geneAllele\(float marker\)/);
  assert.match(geneGLSL,/geneEdgeFactor\(float marker/);
  assert.match(geneGLSL,/vec3 tintColonyGenome/);
  assert.doesNotMatch(geneGLSL,/uniform\s+(vec[234]|float)\s+\w+\s*\[|sampler|texture2D|uint\b|discard/);
});
test("invalid allele, ancestor and generation are rejected",()=>{
  const original=painted.habitatStamps[0];
  for(const bad of [
    {...original,gene:-1},{...original,gene:101},
    {...original,gene:1.4},{...original,gene:NaN},
    {...original,generation:-1},{...original,generation:4096},
    {...original,generation:1.2},
    {...original,ancestor:""},{...original,ancestor:"x".repeat(81)},
    {...original,ancestor:44},
    {...original,mate:""},{...original,mate:22},
    {...original,mate:"x".repeat(81)}
  ])assert.throws(()=>validateRecipe({
    ...painted,habitatStamps:[bad]
  }));
  for(const key of geneControls){
    assert.throws(()=>validateRecipe({...base,[key]:101}));
    assert.throws(()=>validateRecipe({...base,[key]:NaN}));
  }
});
test("Freakshow and Surprise breed genes, Mutate never awakens legacy DNA",()=>{
  for(const n of [0,.12,.26,.42,.57,.74,.91,.99]){
    const eco=shuffleEcosystem(base,r(n));
    const full=fullWeirdShuffle(base,r(n));
    for(const s of [eco,full]){
      assert.deepEqual(validateRecipe(s),s);
      if(s.geneAmount>0){
        assert.ok(s.habitatStamps.length>0);
        assert.ok(s.habitatStamps.every(m=>Number.isInteger(m.gene)));
      }
    }
    assert.equal(full.lettering,base.lettering);
    assert.deepEqual(full.colors,base.colors);
  }
  assert.equal(randomize(base,{},true,r(.75)).geneAmount,0);
  assert.deepEqual(validateRecipe(randomize(base,{},false,r(.43))),
    randomize(base,{},false,r(.43)));
});
test("all 152 Lookbook states stay valid including four actual genetic worlds",()=>{
  assert.equal(looks.length,152);
  assert.equal(new Set(looks.map(l=>l.name)).size,152);
  assert.equal(genePresets.length,4);
  const family=looks.filter(l=>l.family==="Mutation Bloodlines");
  assert.equal(family.length,4);
  for(const look of looks){
    assert.deepEqual(validateRecipe(look.state),look.state,look.name);
    assert.deepEqual(parseDocument(recipeDocument(look.state,look.name,
      {time:5,colorTime:9})).state,look.state,look.name);
  }
  for(const look of family){
    assert.ok(geneEnabled(look.state));
    assert.ok(look.state.habitatStamps.every(m=>
      Number.isInteger(m.gene)&&m.generation===0));
    assert.ok(new Set(look.state.habitatStamps.map(m=>m.gene)).size>2);
    assert.equal(look.state.atmoMaskMode,"Painted colonies");
  }
});
test("shader gates + one-touch DNA inspector preserve old source path",()=>{
  const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
  const ui=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
  assert.match(renderer,/withGene = geneEnabled\(s\)/);
  assert.match(renderer,/withGene \? geneGLSL : ""/);
  assert.match(renderer,/packGeneMarker\(m,geneMarkersEnabled\)/);
  assert.match(renderer,/const geneMarkersEnabled=geneEnabled\(compiledState\)/);
  assert.match(renderer,/withGene \? "bloodlines" : "no-bloodlines"/);
  assert.match(renderer,/tintColonyGenome\(col,atmoAMask,genomeSignalA/);
  assert.match(renderer,/tintColonyGenome\(col,atmoBMask,genomeSignalB/);
  assert.match(renderer,/withGene\?"\*1\.34":""/);
  assert.ok(habitatGLSL.includes("/* GENE_MODULE */"));
  assert.ok(habitatGLSL.includes("/* GENE_EDGE */"));
  assert.ok(habitatGLSL.includes("/* GENE_SAMPLE */"));
  assert.ok(ui.includes("Individual DNA allele"));
  assert.ok(ui.includes("Mutate this colony"));
  assert.ok(ui.includes("Seed this gene pool"));
  assert.ok(ui.includes("Shuffle all DNA"));
  assert.ok(ui.includes("Hide DNA (keep ancestry)"));
  assert.equal(sectionMeta("mutation-bloodlines").group,"Scene");
  assert.equal(sectionActive(sectionMeta("mutation-bloodlines"),initial),false);
  assert.equal(findControls("gene expression")[0].id,"mutation-bloodlines");
});
