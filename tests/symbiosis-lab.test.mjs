import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { initial,looks,numericRanges,validateRecipe,randomize,
  parseDocument,recipeDocument } from "../src/data.js";
import { symbiosisModes,symbiosisControls,symbiosisPresets,
  symbiosisGLSL,symbiosisActive,ensureSymbioticContact,
  applySymbiosisPreset,shuffleSymbiosis,stopSymbiosis }
  from "../src/symbiosis-lab.js";
import { shuffleEcosystem,fullWeirdShuffle } from "../src/ecosystem-randomizer.js";
import { sectionMeta,sectionActive,findControls } from "../src/ui-index.js";

const painted=looks.find(x=>x.family==="Painted Habitats").state;
const base={...initial,engine:18,ratio:"9:16",
  seed:829134,lettering:"YOUR WORDS ARE SACRED",
  palette:-1,colors:["#ff008a","#00ffff","#fdff03"]};
const rng=n=>()=>n;
const touching=(stamps,aspect)=>{
  const A=stamps.filter(x=>x.parent===0);
  const B=stamps.filter(x=>x.parent===1);
  return A.some(a=>B.some(b=>Math.hypot((a.x-b.x)*aspect,a.y-b.y)<
    .66*(a.radius+b.radius)));
};

test("symbiosis is off by default and legacy recipes load identically",()=>{
  assert.deepEqual(symbiosisModes,[
    "Dormant","Mutualistic lace","Parasitic rot",
    "Hybrid membrane","Electric synapse"]);
  assert.equal(initial.symbiosisMode,"Dormant");
  assert.equal(initial.symbiosisAmount,0);
  assert.equal(symbiosisActive(initial),false);
  for(const key of symbiosisControls)
    assert.deepEqual(numericRanges[key],[0,100],key);
  const old={...painted};
  for(const key of [...symbiosisControls,"symbiosisMode"])delete old[key];
  const restored=validateRecipe(old);
  for(const key of [...symbiosisControls,"symbiosisMode"])
    assert.deepEqual(restored[key],initial[key],key);
  for(const key of ["engine","seed","colors","marks","habitatStamps",
    "colonyShapeA","colonyCortexA","atmoMaskMode","lettering"])
    assert.deepEqual(restored[key],painted[key],key);
});

test("relationship presets become visible by planting real contact without destroying art",()=>{
  assert.equal(symbiosisPresets.length,4);
  for(const p of symbiosisPresets){
    const state=applySymbiosisPreset(base,p.name);
    assert.ok(symbiosisActive(state));
    assert.ok(state.habitatStamps.length>=2);
    assert.ok(state.atmoAmount>=70&&state.atmoBAmount>=70);
    assert.ok(touching(state.habitatStamps,9/16),p.name+" seeds must touch");
    assert.equal(state.engine,base.engine);
    assert.equal(state.lettering,base.lettering);
    assert.deepEqual(state.colors,base.colors);
    assert.deepEqual(validateRecipe(state),state);
  }
  assert.equal(applySymbiosisPreset(base,"No such fungi"),base);
});

test("contact spawning preserves ALL hand-painted seeds and does not invent a 17th",()=>{
  const first=[{id:"a",x:.13,y:.15,radius:.14,parent:0},
    {id:"b",x:.88,y:.84,radius:.16,parent:1}];
  const disjoint={...base,habitatStamps:first};
  const contact=ensureSymbioticContact(disjoint);
  assert.equal(contact.habitatStamps.length,3);
  assert.deepEqual(contact.habitatStamps.slice(0,2),first);
  assert.ok(touching(contact.habitatStamps,9/16));
  const repeat=ensureSymbioticContact(contact);
  assert.deepEqual(repeat.habitatStamps,contact.habitatStamps);
  const full={...base,habitatStamps:[
    ...first,...Array.from({length:14},(_,i)=>({
      id:"fill-"+i,x:.20+i*.035,y:.76,radius:.05,parent:0,
    }))
  ]};
  const capped=ensureSymbioticContact(full);
  assert.equal(capped.habitatStamps.length,16);
  assert.deepEqual(capped.habitatStamps,full.habitatStamps);
  const nearly={...base,habitatStamps:[
    ...first,...Array.from({length:13},(_,i)=>({
      id:"extra-"+i,x:.20+i*.04,y:.8,radius:.06,parent:0,
    }))
  ]};
  assert.equal(ensureSymbioticContact(nearly).habitatStamps.length,16);
});

test("shuffle symbiosis is always visible, within numeric bounds, and reversible",()=>{
  for(const n of [0,.12,.27,.41,.63,.78,.99]){
    const s=shuffleSymbiosis(base,rng(n));
    assert.ok(symbiosisActive(s));
    assert.notEqual(s.symbiosisMode,"Dormant");
    assert.ok(touching(s.habitatStamps,9/16));
    for(const key of symbiosisControls)
      assert.ok(s[key]>=0&&s[key]<=100,key);
    assert.deepEqual(s.colors,base.colors);
    assert.equal(s.lettering,base.lettering);
    assert.equal(s.engine,base.engine);
    assert.deepEqual(validateRecipe(s),s);
    const quiet=stopSymbiosis(s);
    assert.equal(quiet.symbiosisAmount,0);
    assert.deepEqual(quiet.habitatStamps,s.habitatStamps);
    assert.deepEqual(quiet.colors,s.colors);
  }
});

test("smart full ecosystem and Surprise breed contact chemistry only with both parents",()=>{
  for(const x of [0,.1,.19,.28,.44,.57,.71,.9,.99]){
    const single=shuffleEcosystem(base,rng(x),{
      allowDual:false,lifeChance:1
    });
    assert.equal(single.symbiosisAmount,0);
    assert.equal(single.atmoBAmount,0);
    const dual=shuffleEcosystem(base,rng(x),{
      allowDual:true,dualChance:1
    });
    assert.deepEqual(validateRecipe(dual),dual);
    if(dual.symbiosisAmount>0){
      assert.ok(symbiosisActive(dual));
      assert.ok(touching(dual.habitatStamps,9/16));
    }
    const full=fullWeirdShuffle(base,rng(x));
    assert.deepEqual(validateRecipe(full),full);
    assert.deepEqual(full.colors,base.colors);
    assert.equal(full.lettering,base.lettering);
  }
  const mutate=randomize(base,{},true,rng(.75));
  assert.equal(mutate.symbiosisAmount,0);
  const surprise=randomize(base,{},false,rng(.43));
  assert.deepEqual(validateRecipe(surprise),surprise);
});

test("invalid relationship mode/values are rejected before compiling GPU shaders",()=>{
  for(const [key,val] of [
    ["symbiosisMode","Cosmic violence"],
    ["symbiosisAmount",101],["symbiosisDetail",-1],
    ["symbiosisMotion",NaN],["symbiosisGlow",Infinity],
    ["symbiosisDominance",101]
  ])assert.throws(()=>validateRecipe({...base,[key]:val}),undefined,key);
});

test("all 139 Looks including actual touching relationships validate and round trip",()=>{
  assert.equal(looks.length,139);
  assert.equal(new Set(looks.map(x=>x.name)).size,139);
  const family=looks.filter(x=>x.family==="Symbiosis Lab");
  assert.equal(family.length,4);
  for(const look of looks){
    assert.deepEqual(validateRecipe(look.state),look.state,look.name);
    assert.deepEqual(parseDocument(recipeDocument(look.state,look.name,
      {time:2,colorTime:3})).state,look.state,look.name);
  }
  for(const look of family){
    const s=look.state;
    assert.ok(symbiosisActive(s));
    assert.ok(touching(s.habitatStamps,1));
    assert.equal(s.atmoMaskMode,"Painted colonies");
    assert.equal(s.atmoBMaskMode,"Painted colonies");
    assert.ok(s.colonyAnatomyAmount>0);
    assert.ok(s.substrateAmount>0);
  }
});

test("shader uses existing masks and cached, optional single pass with both parent pigments",()=>{
  const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
  const ui=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
  assert.match(symbiosisGLSL,/vec3 livingSymbiosis/);
  assert.match(symbiosisGLSL,/float symbioticContact/);
  assert.match(symbiosisGLSL,/min\(a,b\)/);
  assert.match(symbiosisGLSL,/symbiosisMode==1/);
  assert.match(symbiosisGLSL,/symbiosisMode==2/);
  assert.match(symbiosisGLSL,/symbiosisMode==3/);
  assert.match(symbiosisGLSL,/symbiosisMode==4/);
  assert.match(renderer,/withSymbiosis = symbiosisActive\(s\)/);
  assert.match(renderer,/withSymbiosis\?symbiosisGLSL:""/);
  assert.match(renderer,/float symbioticAMask=atmoAMask/);
  assert.match(renderer,/float symbioticBMask=atmoBMask/);
  assert.match(renderer,/livingSymbiosis\(col,uv,symbioticAMask,symbioticBMask\)/);
  assert.match(renderer,/withSymbiosis \? "symbiosis" : "no-symbiosis"/);
  assert.match(renderer,/gl\.uniform1i\(loc\("symbiosisMode"\),symbiosisModes\.indexOf\(s\.symbiosisMode\)\)/);
  assert.doesNotMatch(symbiosisGLSL,/sampler|texture2D|uint\b|discard/);
  for(const key of symbiosisControls)
    assert.ok(ui.includes('name="'+key+'"'),key);
  for(const name of ["Spawn symbiosis","Shuffle symbiosis","Plant contact pair",
    "Disable reaction"])
    assert.ok(ui.includes(name),name);
  assert.equal(sectionMeta("symbiosis-lab").group,"Scene");
  assert.equal(sectionActive(sectionMeta("symbiosis-lab"),initial),false);
  assert.equal(findControls("parasitic rot")[0].id,"symbiosis-lab");
});
