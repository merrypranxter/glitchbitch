import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {activateBreed} from "../src/crossbreed-lab.js";
import {initial} from "../src/data.js";
import {autopsySize,makeAutopsyPlan,analyzeAutopsyRows,runChimeraAutopsy,
  AUTOPSY_PARENTS,AUTOPSY_MAX_EDGE,AUTOPSY_FRAMES} from "../src/chimera-autopsy.js";

const read=p=>readFileSync(new URL("../src/"+p,import.meta.url),"utf8");
const pristine={...initial,seed:3344,ratio:"9:16",
  lettering:"THIS SHOULD NOT GO AWAY",hexagramAmount:0,polesAmount:0,
  qdAmount:0,vldAmount:0,hcrAmount:0,breedAmount:0};
const chimera=activateBreed(pristine,"Five-Way Chimera");
function fakeSession({backend="webgl2-fence",failAt=-1,loseAt=-1,
  abortAt=-1,drawMs=12}={}){
  const calls={draws:[],resets:0,waits:0,destroyed:0,steps:[],canvas:null};
  let currentTime=0;
  const createCanvas=()=>{calls.canvas={width:1,height:1};return calls.canvas};
  const createGpuRenderer=(canvas,opts)=>{
    assert.strictEqual(canvas,calls.canvas);
    assert.equal(opts.exactEffects,true);
    return {
      backend,maxSize:4096,ready:()=>true,
      draw(state,clock,w,h){
        if(calls.draws.length===failAt)throw Error("Synthetic shader compile exploded");
        calls.draws.push({state,clock,w,h});
        return calls.draws.length!==loseAt;
      },
      resetFeedback(){calls.resets++;},
      resetBiology(){calls.resets++;},
      destroy(force){assert.equal(force,true);calls.destroyed++;}
    };
  };
  const awaitGpu=async()=>{calls.waits++;};
  const now=()=>{currentTime+=drawMs;return currentTime;};
  const onVariant=(index,total,label)=>{
    calls.steps.push({index,total,label});
    if(index===abortAt)calls.controller.abort();
  };
  const yieldToBrowser=async()=>{};
  calls.controller=new AbortController();
  const args={createCanvas,createGpuRenderer,awaitGpu,now,onVariant,
    yieldToBrowser,signal:calls.controller.signal,fps:30,duration:6};
  return {calls,args};
}

test("Wave 9: exact variant plan leaves all original fields and parent modes unchanged",()=>{
  const saved=JSON.stringify(chimera);
  const plan=makeAutopsyPlan(chimera);
  assert.equal(plan.length,8);
  assert.deepEqual(plan.map(x=>x.id),[
    "original","parents","without-hexagram","without-poles",
    "without-quasicrystal","without-velvet","without-crochet","repeat"
  ]);
  assert.ok(plan[0].state.breedAmount>0);
  for(const item of plan.slice(1))assert.equal(item.state.breedAmount,0);
  for(const item of plan.filter(x=>x.role==="parent")){
    const key=AUTOPSY_PARENTS.find(x=>x.id===item.parentId)?.key;
    assert.equal(item.state[key],0);
    for(const other of AUTOPSY_PARENTS.filter(x=>x.key!==key)){
      assert.equal(item.state[other.key],chimera[other.key]);
    }
  }
  assert.deepEqual(plan[1].state,plan[7].state);
  for(const variant of plan){
    assert.equal(variant.state.seed,chimera.seed);
    assert.equal(variant.state.lettering,chimera.lettering);
    assert.deepEqual(variant.state.colors,chimera.colors);
    assert.equal(variant.state.ratio,chimera.ratio);
  }
  assert.equal(JSON.stringify(chimera),saved);
});

test("Wave 9: dormant or single-parent art generates only relevant tests",()=>{
  assert.deepEqual(makeAutopsyPlan(pristine),[]);
  const only={...pristine,hcrAmount:70};
  assert.deepEqual(makeAutopsyPlan(only).map(x=>x.id),
    ["parents","without-crochet","repeat"]);
  const hidden={...chimera,breedAmount:0};
  assert.equal(makeAutopsyPlan(hidden).some(x=>x.id==="original"),false);
  assert.equal(makeAutopsyPlan(hidden).length,7);
  assert.throws(()=>makeAutopsyPlan(null),/No artwork/);
});

test("Wave 9: diagnostic cap holds aspect while full-res exporter stays untouched",()=>{
  assert.equal(AUTOPSY_MAX_EDGE,720);
  assert.deepEqual(autopsySize({width:1216,height:2160}),{width:405,height:720});
  assert.deepEqual(autopsySize({width:2160,height:2160}),{width:720,height:720});
  assert.deepEqual(autopsySize({width:480,height:720}),{width:480,height:720});
  assert.deepEqual(autopsySize({width:1080,height:1920}),{width:405,height:720});
  assert.equal(AUTOPSY_FRAMES.length,3);
  for(const width of [0,-1,NaN,3.14])
    assert.throws(()=>autopsySize({width,height:720}),/valid output/);
  const exporter=read("export.js");
  assert.match(exporter,/const size=format==="mp4"\?videoDimensions/);
  assert.match(exporter,/if\(format==="gif"\)return encodeGif/);
});

test("Wave 9: real relative timings compare against parents-only anchor, not original child",()=>{
  const rows=[
    {id:"original",role:"full",medianFrameMs:27},
    {id:"parents",role:"anchor",medianFrameMs:18},
    {id:"without-hexagram",role:"parent",parentId:"hexagram",
      parentLabel:"Hexagram Terraces",medianFrameMs:9},
    {id:"without-poles",role:"parent",parentId:"poles",
      parentLabel:"Complex Poles",medianFrameMs:19},
    {id:"without-crochet",role:"parent",parentId:"crochet",
      parentLabel:"Crochet",medianFrameMs:10},
    {id:"repeat",role:"repeat",medianFrameMs:19}
  ];
  const result=analyzeAutopsyRows(rows,"webgl2-fence");
  assert.equal(result.gpuMeasured,true);
  assert.equal(result.stable,true);
  assert.equal(result.driftMs,1);
  assert.equal(result.anchorMedianMs,18);
  assert.equal(result.child.observedReductionMs,9);
  assert.equal(result.comparisons[0].observedReductionMs,9);
  assert.equal(result.comparisons[0].interpretation,"possible performance contributor");
  assert.equal(result.comparisons[1].observedReductionMs,-1);
  assert.equal(result.comparisons[1].interpretation,"no clear difference");
  assert.equal(result.comparisons[2].observedReductionMs,8);
  const drift=analyzeAutopsyRows([...rows.slice(0,-1),
    {id:"repeat",role:"repeat",medianFrameMs:90}],"webgl2-fence");
  assert.equal(drift.stable,false);
  assert.ok(drift.comparisons.every(x=>x.interpretation.includes("inconclusive")));
  const gl1=analyzeAutopsyRows(rows,"webgl1-no-fence");
  assert.equal(gl1.gpuMeasured,false);
  assert.equal(gl1.child.interpretation,"GPU timing unavailable");
  assert.ok(gl1.comparisons.every(x=>x.interpretation==="GPU timing unavailable"));
  assert.throws(()=>analyzeAutopsyRows([],"webgl2-fence"),/needs its reference/);
});

test("Wave 9: one real exact-effects renderer, all expected frames, samples and cleanup",async()=>{
  const {calls,args}=fakeSession();
  const original=JSON.stringify(chimera);
  const out=await runChimeraAutopsy(chimera,{time:2,colorTime:8},
    {width:1216,height:2160},args);
  assert.equal(out.type,"glitchbitch-chimera-autopsy");
  assert.equal(out.version,1);
  assert.equal(out.gpuMeasured,true);
  assert.equal(out.rows.length,8);
  assert.deepEqual(out.size,{width:405,height:720});
  assert.equal(out.requestedSize.height,2160);
  assert.equal(out.encodedOutputChecked,false);
  assert.equal(calls.draws.length,24);
  assert.equal(calls.waits,24);
  assert.equal(calls.resets,16);
  assert.equal(calls.destroyed,1);
  assert.equal(calls.steps.length,8);
  assert.equal(calls.canvas.width,1);
  assert.equal(calls.canvas.height,1);
  assert.deepEqual(calls.steps[7],{
    index:8,total:8,label:"Parents repeated (thermal drift check)"
  });
  for(const d of calls.draws){
    assert.equal(d.w,405);assert.equal(d.h,720);
    assert.ok(d.clock.time>=2);
    assert.equal(d.state.lettering,chimera.lettering);
  }
  assert.equal(JSON.stringify(chimera),original);
});

test("Wave 9: context loss, cancellation and shader failures never leave GPU resources",async()=>{
  for(const options of [{failAt:3},{loseAt:2},{abortAt:1}]){
    const {calls,args}=fakeSession(options);
    await assert.rejects(
      runChimeraAutopsy(chimera,{time:0,colorTime:0},
        {width:1080,height:1920},args),
      options.abortAt>=0
        ?e=>e?.name==="AbortError"
        :/shader|GPU context lost/i);
    assert.equal(calls.destroyed,1);
    assert.equal(calls.canvas.width,1);
    assert.equal(calls.canvas.height,1);
  }
  const error=fakeSession();
  await assert.rejects(runChimeraAutopsy(pristine,{time:0,colorTime:0},
    {width:720,height:720},error.args),/Enable at least one/);
  assert.equal(error.calls.destroyed,0);
});

test("Wave 9: same-clocks Boomerang source remap and WebGL1 no invented speed ranking",async()=>{
  const {calls,args}=fakeSession({backend:"webgl1-no-fence"});
  const out=await runChimeraAutopsy(chimera,{time:5,colorTime:3},
    {width:2160,height:2160},{...args,playbackMode:"Boomerang"});
  assert.equal(out.gpuMeasured,false);
  assert.ok(out.comparisons.every(x=>x.interpretation==="GPU timing unavailable"));
  assert.equal(out.child.interpretation,"GPU timing unavailable");
  const firstThree=calls.draws.slice(0,3).map(x=>x.clock.time);
  assert.equal(firstThree[0],5);
  assert.ok(firstThree[1]>5);
  assert.ok(firstThree[2]<firstThree[1]);
  assert.equal(calls.destroyed,1);
});

test("Wave 9: export UI is genuinely wired, cancellable, and JSON omits recipe",()=>{
  const ui=read("components/ExportDialog.jsx");
  const autopsy=read("chimera-autopsy.js");
  const stress=read("shader-stress-preflight.js");
  assert.match(ui,/import \{runChimeraAutopsy,makeAutopsyPlan,AUTOPSY_MAX_EDGE\}/);
  assert.match(ui,/onClick=\{autopsy\}/);
  assert.match(ui,/runChimeraAutopsy\(snapshot,timeline,selectedSize/);
  assert.match(ui,/controller\.current\?\.abort\(\)/);
  assert.match(ui,/Save Chimera Autopsy report \(JSON\)/);
  assert.match(ui,/autopsyReport\.recipeAt===state/);
  assert.match(ui,/autopsyReport\.requestedSize\.height===size\.height/);
  assert.match(ui,/const \{recipeAt,ratioAt,formatAt,\.\.\.report\}=autopsyReport/);
  assert.match(ui,/Full-Clip Motion Forensics/);
  assert.match(stress,/exactEffects:true/);
  assert.match(autopsy,/createGpuRenderer\(canvas,\{exactEffects:true\}\)/);
  assert.match(autopsy,/renderer\.resetFeedback\?\.\(\)/);
  assert.match(autopsy,/renderer\.resetBiology\?\.\(\)/);
  assert.doesNotMatch(autopsy,/localStorage|fetch\(|indexedDB|MediaRecorder|VideoEncoder|recipeDocument/);
});
