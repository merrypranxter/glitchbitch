import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {GIFEncoder} from "../src/vendor/gifenc.js";
import {
  selectMotionSamples,measureMotionFrames,analyzeClipMotion,
  decodeOwnGifSamples,verifyMotionDecodeTimes,motionForensicsReport
} from "../src/clip-motion-forensics.js";
const src=p=>readFileSync(new URL("../src/"+p,import.meta.url),"utf8");
function canvasFrame(color,width=32,height=20){
  const data=new Uint8ClampedArray(width*height*4);
  for(let i=0;i<width*height;i++){
    data.set([color[0],color[1],color[2],255],i*4);
  }
  return {width,height,data};
}
function gifWithFrames(width=96,height=64,count=9,pattern=(i,j)=>((Math.floor(i/3)+Math.floor(j/7))%4)){
  const gif=GIFEncoder();
  const palette=[[0,0,0],[250,10,20],[0,245,60],[25,30,240]];
  for(let i=0;i<count;i++){
    const indexed=new Uint8Array(width*height);
    for(let j=0;j<indexed.length;j++)indexed[j]=pattern(i,j);
    gif.writeFrame(indexed,width,height,{palette,delay:67,repeat:0});
  }
  gif.finish();
  return {bytes:gif.bytes(),palette,pattern};
}
test("sample 3 unique opening/middle/final frames at exact GIF/MP4 encoder clocks",()=>{
  assert.deepEqual(selectMotionSamples(91,30),[
    {label:"Opening",index:0,seconds:0},
    {label:"Middle",index:45,seconds:1.5},
    {label:"Final",index:90,seconds:3}
  ]);
  assert.deepEqual(selectMotionSamples(3,15).map(s=>s.index),[0,1,2]);
  assert.throws(()=>selectMotionSamples(2,30),/at least three/);
  assert.throws(()=>selectMotionSamples(91,0),/at least three/);
});
test("real bundled gifenc GIF frames decode at opening/middle/final, including palette changes",()=>{
  const {bytes,palette,pattern}=gifWithFrames(96,64,9);
  const frames=decodeOwnGifSamples(bytes,[0,4,8]);
  assert.deepEqual(frames.map(f=>f.index),[0,4,8]);
  assert.equal(frames[0].encodedDisplayTime,0);
  assert.ok(Math.abs(frames[1].encodedDisplayTime-.28)<.000001);
  assert.ok(Math.abs(frames[2].encodedDisplayTime-.56)<.000001);
  assert.notDeepEqual([...frames[0].data.slice(0,3)],
    [...frames[1].data.slice(0,3)],"Actual GIF frames must change");
  for(const frame of frames){
    assert.equal(frame.width,96);assert.equal(frame.height,64);
    assert.equal(frame.encodedDisplayDuration,.07);
    assert.equal(frame.data.length,96*64*4);
    for(const px of [0,4,32,223,1300,6000]){
      const expected=palette[pattern(frame.index,px)];
      assert.deepEqual([...frame.data.slice(px*4,px*4+4)],
        [...expected,255],"frame="+frame.index+" pixel="+px);
    }
  }
});
test("real GIF LZW decoder correctly handles long repeated runs and complex changing patterns",()=>{
  const {bytes,palette,pattern}=gifWithFrames(128,96,10,(i,j)=>(i*j+i)%4);
  const frames=decodeOwnGifSamples(bytes,[1,5,9]);
  for(const frame of frames){
    for(let j=0;j<frame.width*frame.height;j+=53){
      assert.equal(frame.data[j*4],palette[pattern(frame.index,j)][0]);
      assert.equal(frame.data[j*4+1],palette[pattern(frame.index,j)][1]);
      assert.equal(frame.data[j*4+2],palette[pattern(frame.index,j)][2]);
    }
  }
});
test("GIF inspection refuses invalid indices, truncated bytes, partial/interlaced garbage",()=>{
  const {bytes}=gifWithFrames(12,12,9);
  assert.throws(()=>decodeOwnGifSamples(bytes,[0,0,8]),/unique/);
  assert.throws(()=>decodeOwnGifSamples(bytes,[0,4,99]),/missing/);
  assert.throws(()=>decodeOwnGifSamples(new Uint8Array([1,2,3]),[0,4,8]),/Not a supported/);
  const truncated=bytes.slice(0,bytes.length-35);
  assert.throws(()=>decodeOwnGifSamples(truncated,[0,4,8]));
});
test("severely frozen encoded clips are flagged ONLY when strict PNG references actually move",()=>{
  const reference=[
    canvasFrame([250,0,0]),canvasFrame([0,250,0]),canvasFrame([0,0,250])
  ];
  const encoded=[reference[0],reference[0],reference[0]];
  const analysis=analyzeClipMotion(reference,encoded);
  assert.equal(analysis.expectedMotion,true);
  assert.equal(analysis.possibleMotionLoss,true);
  assert.match(analysis.status,/Possible frozen/);
  assert.equal(analysis.encodedMeanRGBMotion,0);
  assert.equal(analysis.betweenSamples.length,2);
  assert.equal(analysis.frameDifferences.length,3);
  assert.ok(analysis.referenceMeanRGBMotion>50);
});
test("unchanging artwork is never wrongly accused of frozen export",()=>{
  const stable=canvasFrame([70,60,50]);
  const motion=analyzeClipMotion([stable,stable,stable],[stable,stable,stable]);
  assert.equal(motion.expectedMotion,false);
  assert.equal(motion.possibleMotionLoss,false);
  assert.equal(motion.motionRetention,null);
  assert.match(motion.status,/No reliable motion expected/);
});
test("when real encoded frames move like PNG, motion is preserved and retention is near 1",()=>{
  const samples=[
    canvasFrame([230,30,60]),canvasFrame([30,230,60]),canvasFrame([50,80,240])
  ];
  const m=analyzeClipMotion(samples,samples);
  assert.equal(m.expectedMotion,true);
  assert.equal(m.possibleMotionLoss,false);
  assert.equal(m.motionRetention,1);
  assert.match(m.status,/Motion detected/);
  const diff=measureMotionFrames(samples[0],samples[1]);
  assert.ok(diff.meanRGBChange>0);
  assert.ok(diff.changedPixelsPercent>50);
});
test("shape-mismatched/invalid motion comparisons fail visibly",()=>{
  const a=canvasFrame([10,20,30]);
  assert.throws(()=>analyzeClipMotion([a,a],[a,a,a]),/exactly three/);
  assert.throws(()=>analyzeClipMotion([a,a,a],[a,a,canvasFrame([1,2,3],2,2)]),
    /different dimensions/);
});
test("decoder seek artifacts cannot falsely accuse a correctly changing MP4 of frozen output",()=>{
  const png=[canvasFrame([250,0,0]),canvasFrame([0,250,0]),canvasFrame([0,0,250])];
  const stuck=[png[0],png[0],png[0]];
  const samples=selectMotionSamples(91,30);
  const motion=analyzeClipMotion(png,stuck);
  assert.equal(motion.possibleMotionLoss,true);
  const badTimes=verifyMotionDecodeTimes(motion,
    [{mediaTime:0},{mediaTime:0},{mediaTime:.001}],samples,"mp4");
  assert.equal(badTimes.possibleMotionLoss,false);
  assert.equal(badTimes.decoderTimeWarning,true);
  assert.match(badTimes.status,/Inconclusive: decoder timestamps/);
  const good=verifyMotionDecodeTimes(motion,
    [{mediaTime:0},{mediaTime:1.5},{mediaTime:3}],samples,"mp4");
  assert.equal(good.possibleMotionLoss,true);
  assert.equal(good.decoderTimeWarning,false);
  const gif=verifyMotionDecodeTimes(motion,
    [{mediaTime:0},{mediaTime:0},{mediaTime:0}],samples,"gif");
  assert.equal(gif.possibleMotionLoss,true);
});
test("motion JSON report contains only timing, coarse metrics and encoder metadata",()=>{
  const state=[
    canvasFrame([100,10,20]),canvasFrame([10,100,20]),canvasFrame([10,20,100])
  ];
  const motion=analyzeClipMotion(state,state);
  const rows=selectMotionSamples(90,30).map(s=>({...s,referenceTime:s.seconds,
    decodedTime:s.seconds+.002,discrepancy:"low"}));
  const report=motionForensicsReport({
    samples:rows,motion,format:"mp4",method:"h264",seed:88,
    size:{width:406,height:720}
  });
  assert.equal(report.type,"glitchbitch-full-clip-motion-forensics");
  assert.equal(report.samples.length,3);
  assert.equal(report.samples[1].label,"Middle");
  assert.deepEqual(report.size,{width:406,height:720});
  const encoded=JSON.stringify(report);
  assert.ok(!encoded.includes("MY PRIVATE WORDS"));
  assert.ok(!encoded.includes("#ff00ff"));
  assert.ok(!encoded.includes("Uint8ClampedArray"));
  assert.ok(!encoded.includes("data:"));
});
test("UI decodes the ACTUAL blob, uses matched strict PNG clocks, and lets user choose a sample",()=>{
  const ui=src("components/ExportDialog.jsx");
  const decoder=src("clip-motion-forensics.js");
  const exporter=src("export.js");
  assert.match(ui,/selectMotionSamples\(ready\.frames,ready\.fps\)/);
  assert.match(ui,/decodeGifMotionSamples\(ready\.blob,samples\)/);
  assert.match(ui,/decodeMp4MotionSamples\(ready\.blob,samples,ready\.fps\)/);
  assert.match(ui,/const seconds=ready\.format==="gif"\?sample\.seconds:picture\.mediaTime/);
  assert.match(ui,/const originalSeconds=playbackTimeForMediaTime\(/);
  assert.match(ui,/clockAt\(ready\.snapshot,ready\.timeline,originalSeconds\)/);
  assert.match(ui,/exactEffects:true,outputSize:ready\.frameSize/);
  assert.match(ui,/analyzeClipMotion\(references,decoded\)/);
  assert.match(ui,/verifyMotionDecodeTimes\(/);
  assert.match(ui,/selectedMotionIndex===i/);
  assert.match(ui,/Full-Clip Motion Forensics/);
  assert.match(ui,/Math\.max\(ready\.frameSize\.width,ready\.frameSize\.height\)>720/);
  assert.match(ui,/motionAuditUrls\.current\.forEach\(url=>URL\.revokeObjectURL\(url\)\)/);
  assert.match(decoder,/gifLzw\(compressed\.bytes,minCodeSize,width\*height\)/);
  assert.match(decoder,/video\.currentTime=seek===0\?0\.001:seek/);
  assert.match(exporter,/const frameClock = clockAt\(state, timeline, seconds\)/);
});
