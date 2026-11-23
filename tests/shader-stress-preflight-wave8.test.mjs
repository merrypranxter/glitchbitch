import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {STRESS_FRAME_FRACTIONS,rgbaFrameMiB,summarizeStressSamples,
  runShaderStressPreflight} from "../src/shader-stress-preflight.js";
import {initial} from "../src/data.js";
import {activateBreed} from "../src/crossbreed-lab.js";
import {playbackTimeForMediaTime} from "../src/boomerang-playback.js";

const code=p=>readFileSync(new URL("../src/"+p,import.meta.url),"utf8");
function instrument({
  failDrawAt=-1,backend="webgl2-fence",ready=true,drawSucceeds=true
}={}){
  const calls={draws:[],waits:0,disposed:0,samples:[],size:null,canvas:null};
  let tick=0;
  const createCanvas=()=>{
    calls.canvas={width:0,height:0};
    return calls.canvas;
  };
  const createGpuRenderer=(canvas,{exactEffects})=>{
    assert.equal(canvas,calls.canvas);
    assert.equal(exactEffects,true);
    return {
      backend,maxSize:4096,
      ready(){return ready;},
      draw(state,time,w,h){
        assert.ok(state);
        if(calls.draws.length===failDrawAt)throw Error("Failure in shader sample");
        calls.draws.push({time,w,h});
        return drawSucceeds;
      },
      destroy(release){assert.equal(release,true);calls.disposed++;}
    };
  };
  const awaitGpu=async renderer=>{
    assert.ok(renderer);
    calls.waits++;
  };
  const now=()=>{tick+=12;return tick;};
  const onSample=(i,total)=>calls.samples.push([i,total]);
  return {calls,createCanvas,createGpuRenderer,awaitGpu,now,onSample};
}
const time={time:2.5,colorTime:11,textTime:5};
const chimera=activateBreed({...initial,seed:104}, "Five-Way Chimera");
const fixture=(fake,opts={})=>runShaderStressPreflight(chimera,time,
  {width:720,height:1280}, {...fake,...opts});

test("Wave 8: four deterministic exact-effects frames after one unmeasured warmup, 30 fps",async()=>{
  const fake=instrument();
  const out=await fixture(fake,{fps:30,duration:6});
  assert.equal(out.type,"glitchbitch-shader-stress-preflight");
  assert.equal(out.backend,"webgl2-fence");
  assert.equal(out.sampleCount,4);
  assert.equal(out.medianFrameMs,12);
  assert.equal(out.minimumFrameMs,12);
  assert.equal(out.maximumFrameMs,12);
  assert.equal(out.referenceFrameBudgetMs,33.3);
  assert.equal(out.pressure,"moderate");
  assert.equal(out.encodedOutputChecked,false);
  assert.equal(out.frameBufferMiB,rgbaFrameMiB({width:720,height:1280}));
  assert.equal(fake.calls.waits,5);
  assert.equal(fake.calls.draws.length,5);
  assert.equal(fake.calls.samples.length,5);
  assert.deepEqual(fake.calls.samples[0],[0,5]);
  assert.deepEqual(fake.calls.samples[4],[4,5]);
  assert.equal(fake.calls.disposed,1);
  assert.equal(fake.calls.canvas.width,1);
  assert.equal(fake.calls.canvas.height,1);
  for(const frame of fake.calls.draws){
    assert.equal(frame.w,720);assert.equal(frame.h,1280);
    assert.ok(frame.time.time>=time.time);
    assert.ok(frame.time.colorTime>=time.colorTime);
  }
  assert.equal(fake.calls.draws[0].time.time,time.time);
  const frames=STRESS_FRAME_FRACTIONS.map(f=>Math.round((180-1)*f));
  assert.equal(fake.calls.draws[4].time.time,
    time.time+frames[4]/30*chimera.speed/30);
});

test("Wave 8: Boomerang sampling uses source-frame time and never changes user recipe",async()=>{
  const state=JSON.stringify(chimera);
  const fake=instrument({backend:"webgl1-no-fence"});
  const out=await fixture(fake,{fps:15,duration:2,playbackMode:"Boomerang"});
  assert.equal(out.playbackMode,"Boomerang");
  assert.equal(out.backend,"webgl1-no-fence");
  assert.match(out.measurementScope,/CPU submission\/readiness timing only/);
  const frameCount=30;
  const samples=STRESS_FRAME_FRACTIONS.map(f=>Math.round((frameCount-1)*f));
  for(let i=0;i<samples.length;i++){
    const seconds=playbackTimeForMediaTime(samples[i]/15,30,15,"Boomerang");
    assert.equal(fake.calls.draws[i].time.time,time.time+seconds*chimera.speed/30);
  }
  assert.equal(JSON.stringify(chimera),state);
  assert.equal(fake.calls.disposed,1);
});

test("Wave 8: median and outlier warnings are based on measured data, not predictions",()=>{
  assert.equal(summarizeStressSamples([11,13,12,14],30).pressure,"moderate");
  assert.equal(summarizeStressSamples([42,36,55,42],30).pressure,"heavy");
  assert.equal(summarizeStressSamples([86,66,77,95],30).pressure,"very heavy");
  assert.equal(summarizeStressSamples([10,12,9,180],30).pressure,"very heavy");
  assert.deepEqual(summarizeStressSamples([10,10],20).sampleCount,2);
  assert.equal(rgbaFrameMiB({width:1,height:1}),0);
  assert.equal(rgbaFrameMiB({width:2160,height:2160}),17.8);
  assert.throws(()=>summarizeStressSamples([NaN,8]),/valid measured/);
  assert.throws(()=>summarizeStressSamples([4]),/At least two/);
  assert.throws(()=>summarizeStressSamples([3,4],0),/Target frame rate/);
  for(const size of [
    {width:0,height:100},{width:4097,height:80},{width:17.5,height:90}
  ])assert.throws(()=>rgbaFrameMiB(size),/valid 1–4096px/);
});

test("Wave 8: export failure, context loss, no GPU and cancellation clean every transient resource",async()=>{
  const bad=instrument({failDrawAt:2});
  await assert.rejects(fixture(bad),/Failure in shader sample/);
  assert.equal(bad.calls.disposed,1);
  assert.equal(bad.calls.canvas.width,1);
  const lost=instrument({drawSucceeds:false});
  await assert.rejects(fixture(lost),/GPU context lost.*strict shader stress check/);
  assert.equal(lost.calls.disposed,1);
  const abort=new AbortController(),stop=instrument();
  stop.onSample=()=>abort.abort();
  await assert.rejects(fixture(stop,{signal:abort.signal}),
    e=>e?.name==="AbortError");
  assert.equal(stop.calls.disposed,1);
  await assert.rejects(fixture(instrument(),{duration:0}),/duration must be/);
  await assert.rejects(fixture(instrument(),{fps:0}),/fps must be/);
});

test("Wave 8: GPU and MP4 export both keep exact shaders, and preflight is cancellable",()=>{
  const source=code("shader-stress-preflight.js");
  const ui=code("components/ExportDialog.jsx");
  const renderer=code("renderer.js");
  assert.match(source,/createGpuRenderer\(canvas,\{exactEffects:true\}\)/);
  assert.match(source,/if\(!renderer\.draw\(state,frameClock,size\.width,size\.height\)\)/);
  assert.match(source,/await awaitGpu\(renderer,signal\)/);
  assert.match(source,/renderer\?\.destroy\(true\)/);
  assert.match(source,/clockAt\(state,timeline,offsets\[i\]\)/);
  assert.match(ui,/onExportBusy\?\.\(true\)/);
  assert.match(ui,/runShaderStressPreflight\(snapshot,timeline,selectedSize/);
  assert.match(ui,/onClick=\{stressTest\}/);
  assert.match(ui,/controller\.current\?\.abort\(\)/);
  assert.match(ui,/Save shader stress report \(JSON\)/);
  assert.match(ui,/Full-Clip Motion Forensics/);
  assert.match(ui,/Inspect REAL \{ready\.format\.toUpperCase\(\)\} frame vs PNG/);
  assert.match(renderer,/backend:gl2\?"webgl2-fence":"webgl1-no-fence"/);
  assert.match(renderer,/if\(exactEffects\)throw artworkParityError\("Full-effect shader failed to compile",e\)/);
  const exporter=code("export.js");
  assert.match(exporter,/createRenderer\(canvas,\{exactEffects:true\}\)/);
  assert.match(exporter,/await waitForGraphics\(renderer,signal\)/);
  assert.match(exporter,/gif\.writeFrame\(indexed,size\.width,size\.height/);
  assert.match(exporter,/source = new CanvasSource\(work\.capture/);
});

test("Wave 8: no background upload, encoder simulation, or automatic recipe changes",()=>{
  const source=code("shader-stress-preflight.js");
  assert.doesNotMatch(source,/fetch\(|localStorage|indexedDB|MediaRecorder|VideoEncoder|source\.add\(/);
  assert.match(source,/encodedOutputChecked:false/);
  assert.match(source,/not a sustained benchmark/);
  const ui=code("components/ExportDialog.jsx");
  assert.match(ui,/stressReport\.recipeAt===state/);
  assert.match(ui,/stressReport\.ratioAt===ratio/);
  assert.match(ui,/stressReport\.playbackMode===playbackMode/);
  assert.match(ui,/stressReport\.duration===clipDuration/);
  assert.match(ui,/stressReport\.size\.width===size\.width/);
  assert.match(ui,/The test cannot certify H\.264\/GIF encoding, playback speed or matching pixels/);
  assert.doesNotMatch(ui,/history\.change\(.*stress/i);
});
