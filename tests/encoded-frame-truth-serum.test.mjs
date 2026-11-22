import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {
  auditMaxEdge,analyzeEncodedFrame,differenceHeatmap,frameAuditReport,
  decodeStaticExport,decodeMp4Export,frameBlob
} from "../src/encoded-frame-truth-serum.js";
import {clockAt,dimensions,videoDimensions} from "../src/export.js";

function frame(rgb,width=rgb.length,height=1){
  return {width,height,
    data:new Uint8ClampedArray(rgb.flatMap(c=>[...c,255]))};
}
const code=p=>readFileSync(new URL("../src/"+p,import.meta.url),"utf8");

test("identical decoded vs PNG frame must have absolutely no discrepancy",()=>{
  const sample=frame([[255,3,170],[25,45,230],[0,0,0],[231,204,0]]);
  const result=analyzeEncodedFrame(sample,sample);
  assert.equal(result.width,4);
  assert.equal(result.meanRGBDifference,0);
  assert.equal(result.meanPeakChannelDifference,0);
  assert.equal(result.pixelsOverThresholdPercent,0);
  assert.equal(result.p95PeakDifference,0);
  assert.equal(result.discrepancy,"low");
  assert.equal(result.samples,4);
});
test("actual numeric pixel changes are detected with per-channel and p95 statistics",()=>{
  const original=frame([[0,0,0],[100,100,100],[10,20,30],[255,0,80]]);
  const changed=frame([[0,0,0],[130,80,100],[10,20,30],[100,30,80]]);
  const result=analyzeEncodedFrame(original,changed,{format:"gif",threshold:36});
  assert.equal(result.codec,"GIF (palette-quantized)");
  assert.equal(result.samples,4);
  assert.equal(result.pixelsOverThresholdPercent,25);
  assert.equal(result.pixelsOver96Percent,25);
  assert.equal(result.p95PeakDifference,155);
  assert.equal(result.averageChannelDifference.red,46.25);
  assert.equal(result.averageChannelDifference.green,12.5);
  assert.ok(result.meanRGBDifference>0);
  assert.equal(result.discrepancy,"moderate");
});
test("severe color/geometry loss is flagged as a high discrepancy, not falsely passed",()=>{
  const original=frame(Array.from({length:20},(_,i)=>[i*8,255-i*8,60]));
  const unrelated=frame(Array.from({length:20},()=>[255,0,255]));
  const metrics=analyzeEncodedFrame(original,unrelated);
  assert.equal(metrics.discrepancy,"high");
  assert.ok(metrics.pixelsOverThresholdPercent>=80);
  assert.ok(metrics.meanRGBDifference>50);
});
test("dimension and pixel format failures never get compared or resampled silently",()=>{
  const reference=frame([[20,30,40],[70,60,50]]);
  const shorter=frame([[20,30,40]]);
  assert.throws(()=>analyzeEncodedFrame(reference,shorter),/different dimensions/);
  assert.throws(()=>analyzeEncodedFrame(reference,{width:2,height:1,data:new Uint8Array(3)}),
    /complete RGBA frames/);
  assert.throws(()=>analyzeEncodedFrame(reference,reference,{threshold:300}),
    /Invalid frame-difference threshold/);
  assert.throws(()=>differenceHeatmap(reference,shorter),/different frame dimensions/);
});
test("visual difference heatmap amplifies mismatches while retaining identical pixels dark",()=>{
  const reference=frame([[0,0,0],[10,200,30]]);
  const decoded=frame([[0,0,0],[210,40,30]]);
  const heat=differenceHeatmap(reference,decoded);
  assert.equal(heat.width,2);
  assert.equal(heat.data.length,8);
  assert.equal(heat.data[0],11);
  assert.equal(heat.data[4],255);
  assert.equal(heat.data[7],255);
  assert.ok(heat.data[5]>heat.data[1]);
});
test("aggregate report contains no quote, pixels or palette colors",()=>{
  const m=analyzeEncodedFrame(frame([[0,0,0]]),frame([[6,7,9]]));
  const rep=frameAuditReport({
    metrics:m,mediaTime:.0333333,decoder:"first playable decoded video frame",
    encoderMethod:"h264",format:"mp4",seed:4242,
    requestedSize:{width:270,height:480},actualSize:{width:270,height:480}
  });
  assert.equal(rep.type,"glitchbitch-encoded-frame-truth-serum");
  assert.equal(rep.firstDecodedFrameSeconds,.0333);
  assert.equal(rep.metrics.meanRGBDifference,7.33);
  const string=JSON.stringify(rep);
  assert.ok(!string.includes("THE USER'S WORDS"));
  assert.ok(!string.includes("#ff00ff"));
  assert.ok(!string.includes("data:"));
});
test("low-memory image decoder samples only a 480px long-edge frame",()=>{
  assert.equal(auditMaxEdge,480);
  assert.equal(typeof decodeStaticExport,"function");
  assert.equal(typeof decodeMp4Export,"function");
  assert.equal(typeof frameBlob,"function");
  assert.match(code("encoded-frame-truth-serum.js"),/Math\.min\(1,longEdge\/Math\.max\(width,height\)\)/);
  assert.match(code("encoded-frame-truth-serum.js"),/requestVideoFrameCallback/);
  assert.match(code("encoded-frame-truth-serum.js"),/video\.videoWidth/);
  assert.match(code("encoded-frame-truth-serum.js"),/URL\.revokeObjectURL\(url\)/);
});
test("one shared clock is used to match a real video frame with its PNG reference",()=>{
  const state={speed:30,colorSpeed:12,freezeGeometry:false,freezeColor:false};
  assert.deepEqual(clockAt(state,{time:3,colorTime:7,textTime:9},.25),
    {time:3.25,colorTime:7.1,textTime:9.25});
  assert.deepEqual(clockAt({...state,freezeGeometry:true,freezeColor:true},
    {time:3,colorTime:7,textTime:9},.25),
    {time:3,colorTime:7,textTime:9.25});
  assert.deepEqual(videoDimensions("9:16",720),{width:406,height:720});
  assert.deepEqual(dimensions("9:16",720),{width:405,height:720});
});
test("diagnostic output uses video EXACT dimensions; normal PNG, GIF and MP4 remain unchanged",()=>{
  const exporter=code("export.js");
  const UI=code("components/ExportDialog.jsx");
  assert.match(exporter,/export function clockAt\(state, timeline, seconds\)/);
  assert.match(exporter,/exactEffects=true,compositeLettering=true,outputSize=null/);
  assert.match(exporter,/outputSize \|\| dimensions\(state\.ratio, longEdge\)/);
  assert.match(exporter,/renderer\.draw\(state, timeline, width, height\)/);
  assert.match(UI,/const decoded=gif\?await decodeStaticExport\(ready\.blob\):\s*await decodeMp4Export\(ready\.blob\)/);
  assert.match(UI,/const matchedClock=clockAt\(ready\.snapshot,ready\.timeline,seconds\)/);
  assert.match(UI,/exactEffects:true,outputSize:ready\.frameSize/);
  assert.match(UI,/analyzeEncodedFrame\(reference,decoded,/);
  assert.match(UI,/differenceHeatmap\(reference,decoded\)/);
  assert.match(UI,/frameAuditReport\(\{/);
  assert.match(UI,/frameAuditUrls\.current\.forEach\(url=>URL\.revokeObjectURL\(url\)\)/);
  assert.match(UI,/Math\.max\(ready\.frameSize\.width,ready\.frameSize\.height\)>1080/);
  assert.match(UI,/Inspect REAL \{ready\.format\.toUpperCase\(\)\} frame vs PNG/);
  assert.match(exporter,/await work\.render\(i \/ fps\)/);
  assert.match(exporter,/const rgba=await work\.render\(i\/fps, true\)/);
  assert.match(exporter,/source = new CanvasSource\(work\.capture/);
});
