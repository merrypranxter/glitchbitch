import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,validateRecipe,recipeDocument,parseDocument} from "../src/data.js";
import {foodWebModes,foodWebControls,MAX_FOOD_WEB_LINKS,
 foodWebLinks,foodWebActive,prepareFoodWeb,stageFoodWeb,
 feedFoodWeb,hideFoodWeb,shuffleFoodWeb,foodWebLedger,foodWebGLSL}
 from "../src/living-food-web.js";
import {shuffleEcosystem} from "../src/ecosystem-randomizer.js";
import {sectionMeta,sectionActive,findControls} from "../src/ui-index.js";
import {evolveSporeGeneration} from "../src/spore-dynasties.js";

const members=[
  {id:"a",x:.33,y:.50,radius:.20,parent:0,gene:13,generation:0,webEnergy:20},
  {id:"b",x:.56,y:.50,radius:.20,parent:1,gene:86,generation:0,webEnergy:80},
];
const start={...initial,seed:739,ratio:"1:1",
  foodWebMode:"Mutualist exchange",foodWebAmount:90,foodWebReach:66,
  foodWebPressure:95,atmoAmount:85,atmoBAmount:83,
  atmoMaskMode:"Painted colonies",atmoBMaskMode:"Painted colonies",
  habitatStamps:members,lettering:"THE FUNGUS HAS A BANK ACCOUNT"};
const sum=s=>s.habitatStamps.reduce((x,m)=>x+m.webEnergy,0);

test("old art is opt-in and earlier documents migrate without nutrient reserves",()=>{
  assert.equal(initial.foodWebAmount,0);
  assert.equal(initial.foodWebRound,0);
  assert.equal(foodWebActive(initial),false);
  assert.equal(foodWebLinks({...initial,habitatStamps:[]}).length,0);
  assert.equal(feedFoodWeb(initial),initial);
  const legacy={...start};delete legacy.foodWebMode;delete legacy.foodWebRound;
  for(const key of foodWebControls)delete legacy[key];
  legacy.habitatStamps=members.map(({webEnergy,...m})=>m);
  const validated=validateRecipe(legacy);
  assert.equal(validated.foodWebAmount,0);
  assert.deepEqual(validated.habitatStamps,legacy.habitatStamps);
});
test("network pairs are deterministic, bounded and aspect-aware",()=>{
  assert.deepEqual(foodWebLinks(start),foodWebLinks(start));
  assert.equal(foodWebLinks(start).length,1);
  const full={...start,foodWebReach:100,habitatStamps:
    Array.from({length:16},(_,i)=>({id:"node"+i,parent:i%2,
      x:.2+(i%4)*.17,y:.2+Math.floor(i/4)*.17,
      radius:.1,gene:i*5,webEnergy:20+(i%7)*10}))};
  const links=foodWebLinks(full);
  assert.ok(links.length<=MAX_FOOD_WEB_LINKS);
  assert.equal(new Set(links.map(x=>x.from+"_"+x.to)).size,links.length);
  assert.ok(links.every(x=>x.i!==x.j&&x.strength>=0&&x.strength<=1));
  assert.deepEqual(validateRecipe(full),full);
  const wide={...start,ratio:"16:9",foodWebReach:0};
  assert.equal(foodWebLinks(wide).length,0);
});
test("feeding conserves stored resources and cannot erase living species",()=>{
  for(const mode of foodWebModes){
    const world={...start,foodWebMode:mode};
    const after=feedFoodWeb(world,3);
    assert.deepEqual(after,feedFoodWeb(world,3));
    assert.ok(after.foodWebRound>=1&&after.foodWebRound<=3,mode);
    if(mode==="Trophic cascade"&&after.foodWebRound<3)
      assert.ok(after.habitatStamps.some(m=>m.webEnergy===0||m.webEnergy===100),
        "trophic chain stops naturally when resources saturate");
    assert.equal(sum(after),sum(world),mode);
    assert.deepEqual(after.habitatStamps.map(x=>x.id),members.map(x=>x.id));
    assert.ok(after.habitatStamps.every(m=>Number.isInteger(m.webEnergy)&&
      m.webEnergy>=0&&m.webEnergy<=100&&m.radius>=.05&&m.radius<=.45));
    assert.ok(after.habitatStamps.some((m,i)=>m.webEnergy!==members[i].webEnergy),mode);
    assert.deepEqual(after.colors,start.colors);
    assert.equal(after.lettering,start.lettering);
    assert.deepEqual(after.fossilRecords,start.fossilRecords);
    assert.deepEqual(validateRecipe(after),after,mode);
    assert.deepEqual(parseDocument(recipeDocument(after,"Web",
      {time:0,colorTime:0})).state,after,mode);
  }
});
test("mutualist balances, parasitic siphon and trophic strongman have real outcomes",()=>{
  const mutual=feedFoodWeb(start);
  assert.ok(mutual.habitatStamps[0].webEnergy>members[0].webEnergy);
  assert.ok(mutual.habitatStamps[1].webEnergy<members[1].webEnergy);
  const parasite=feedFoodWeb({...start,foodWebMode:"Parasitic siphon"});
  assert.ok(parasite.habitatStamps[1].webEnergy>members[1].webEnergy);
  const chain=feedFoodWeb({...start,foodWebMode:"Trophic cascade"});
  assert.ok(chain.habitatStamps.some((m,i)=>m.gene!==members[i].gene||
    m.radius!==members[i].radius));
});
test("stage makes a genuine connection; hiding freezes feeding but saves biology",()=>{
  const far={...start,habitatStamps:[members[0],
    {...members[1],x:.96,y:.96}]};
  assert.equal(foodWebLinks(far).length,0);
  assert.equal(feedFoodWeb(far),far);
  const moved=stageFoodWeb(far);
  assert.ok(foodWebLinks(moved).length>0);
  assert.deepEqual(moved.habitatStamps[0],members[0]);
  assert.equal(stageFoodWeb(moved),moved);
  const hidden=hideFoodWeb(moved);
  assert.equal(foodWebActive(hidden),false);
  assert.equal(feedFoodWeb(hidden),hidden);
  assert.deepEqual(hidden.habitatStamps,moved.habitatStamps);
  const expired={...start,foodWebRound:4095};
  assert.equal(feedFoodWeb(expired),expired);
});
test("strict recipe validation of mode, round, reserve and controls",()=>{
  for(const value of [-1,101,1.5,NaN,Infinity]){
    assert.throws(()=>validateRecipe({...start,habitatStamps:[
      {...members[0],webEnergy:value},members[1]]}),/nutrient reserve/);
  }
  assert.throws(()=>validateRecipe({...start,foodWebMode:"Hacked web"}));
  assert.throws(()=>validateRecipe({...start,foodWebRound:4096}),/feeding round/);
  assert.throws(()=>validateRecipe({...start,foodWebRound:-1}),/feeding round/);
  assert.throws(()=>validateRecipe({...start,foodWebAmount:101}));
  assert.deepEqual(validateRecipe(start),start);
});
test("shuffle produces bounded valid worlds without waking second parent",()=>{
  for(const n of [.05,.13,.37,.73,.98]){
    const shuffled=shuffleFoodWeb(start,()=>n);
    assert.deepEqual(validateRecipe(shuffled),shuffled);
    const ecosystem=shuffleEcosystem(start,()=>n,{allowDual:false,allowHeavy:false});
    assert.equal(ecosystem.atmoBAmount,0);
    assert.deepEqual(validateRecipe(ecosystem),ecosystem);
  }
  const ledger=foodWebLedger(start);
  assert.equal(ledger[0].energy,20);
});
test("new scene is indexed and renderer uses optional GPU path and fallback",()=>{
  const ui=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
  const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
  assert.equal(foodWebModes.length,4);
  assert.equal(sectionMeta("living-food-web").group,"Scene");
  assert.equal(sectionActive(sectionMeta("living-food-web"),initial),false);
  assert.equal(findControls("parasitic siphon")[0].id,"living-food-web");
  for(const key of foodWebControls)assert.ok(ui.includes('name="'+key+'"'),key);
  assert.ok(ui.includes("Feed three rounds"));
  assert.ok(ui.includes("Stored nutrient reserves"));
  assert.ok(renderer.includes("withFoodWeb = foodWebActive(s)"));
  assert.ok(renderer.includes('withFoodWeb?foodWebGLSL:""'));
  assert.ok(renderer.includes('withFoodWeb?"col=shadeFoodWeb(col,uv);":""'));
  assert.ok(renderer.includes("foodWebUnavailable=true"));
  assert.ok(renderer.includes('gl.uniform4fv(loc("foodWebPairs[0]"),foodWebBuffer)'));
  assert.ok(foodWebGLSL.includes("for(int i=0;i<6;i++)"));
  assert.ok(!foodWebGLSL.includes("sampler2D"));
});
