import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {GIFEncoder} from "../src/vendor/gifenc.js";
import {decodeOwnGifSamples,decodeGifMotionSamples} from "../src/clip-motion-forensics.js";
import {selectSeamSamples,assessSeamDecoderTiming,analyzeSeamContinuity,
  seamForensicsReport} from "../src/loop-seam-forensics.js";

const source=p=>readFileSync(new URL("../src/"+p,import.meta.url),"utf8");
function frame(v,width=24,height=16){
  const data=new Uint8ClampedArray(width*height*4);
  for(let i=0;i<width*height;i++)data.set([v,v,v,255],i*4);
  return {width,height,data};
}
function frames(values){return values.map(v=>frame(v));}
const loops=selectSeamSamples(15,15);

test("seven unique beginning/mid/end indices follow exact encoded frame clocks",()=>{
  assert.deepEqual(selectSeamSamples(15,15).map(x=>x.index),[0,1,6,7,8,13,14]);
  assert.deepEqual(selectSeamSamples(7,24).map(x=>x.index),[0,1,2,3,4,5,6]);
  assert.equal(loops[6].seconds,14/15);
  assert.equal(loops[0].label,"Start");
  assert.throws(()=>selectSeamSamples(6,30),/seven or more/);
  assert.throws(()=>selectSeamSamples(30,0),/seven or more/);
});
test("static clips are not flagged as broken loops",()=>{
  const result=analyzeSeamContinuity(frames([50,50,50,50,50,50,50]));
  assert.equal(result.possibleSeam,false);
  assert.equal(result.possibleMidJump,false);
  assert.equal(result.seamMeanRGB,0);
  assert.equal(result.status,"No strong boundary jump detected at sampled checkpoints");
});
test("a true cyclic ramp whose endpoint transition matches local motion is not flagged",()=>{
  const out=analyzeSeamContinuity(frames([0,10,25,30,35,20,10]));
  assert.equal(out.possibleSeam,false);
  assert.equal(out.possibleMidJump,false);
  assert.equal(out.seamMeanRGB,out.openingStep.meanRGBChange);
  assert.ok(out.seamToEdgeRatio<3);
});
test("a large end-to-start step versus gentle boundary motion indicates possible loop snap",()=>{
  const out=analyzeSeamContinuity(frames([5,10,30,32,34,230,235]));
  assert.equal(out.possibleSeam,true);
  assert.equal(out.possibleMidJump,false);
  assert.match(out.status,/Possible visible loop seam/);
  assert.ok(out.seamToEdgeRatio>20);
  assert.ok(out.seamChangedPixelsPercent>=99);
});
test("a deliberate hard-cut midpoint gets an abrupt-transition clue, not an encoder-failure claim",()=>{
  const out=analyzeSeamContinuity(frames([5,8,10,220,224,7,10]));
  assert.equal(out.possibleSeam,false);
  assert.equal(out.possibleMidJump,true);
  assert.match(out.status,/Abrupt midpoint transition \(may be intentional\)/);
});
test("fast but ordinary adjacent motion is not miscalled a seam simply because RGB moves",()=>{
  const out=analyzeSeamContinuity(frames([10,80,20,100,30,100,170]));
  assert.equal(out.possibleSeam,false);
  assert.ok(out.seamMeanRGB>40);
  assert.ok(out.seamToEdgeRatio<3);
});
test("MP4 stalled or inaccurate seek timestamps make any seam accusation inconclusive",()=>{
  const samples=selectSeamSamples(15,30);
  const seeked=samples.map(s=>({mediaTime:s.seconds}));
  const good=assessSeamDecoderTiming(seeked,samples,"mp4",30);
  assert.equal(good.trust,"best-effort-media-time");
  const repeated=seeked.map(v=>({...v}));
  repeated[1].mediaTime=repeated[0].mediaTime;
  const failed=assessSeamDecoderTiming(repeated,samples,"mp4",30);
  assert.equal(failed.trust,"inconclusive");
  const badJump=seeked.map(v=>({...v}));
  badJump[4].mediaTime+=.6;
  assert.equal(assessSeamDecoderTiming(badJump,samples,"mp4",30).trust,"inconclusive");
  const out=analyzeSeamContinuity(frames([5,10,30,32,34,230,235]),
    {format:"mp4",timing:failed});
  assert.equal(out.possibleSeam,false);
  assert.match(out.status,/Inconclusive/);
  assert.equal(assessSeamDecoderTiming(seeked,samples,"gif",15).trust,"frame-index");
});
test("the real bundled GIF encoder round-trips seven distinct frames, including last-to-first",()=>{
  const gif=GIFEncoder();
  const palette=[[0,0,0],[245,25,35],[20,225,55],[50,55,240]];
  for(let i=0;i<15;i++){
    const data=new Uint8Array(80*64);
    for(let j=0;j<data.length;j++)data[j]=(i+Math.floor(j/13))%4;
    gif.writeFrame(data,80,64,{palette,delay:67,repeat:0});
  }
  gif.finish();
  const selected=decodeOwnGifSamples(gif.bytes(),loops.map(s=>s.index));
  assert.equal(selected.length,7);
  for(const decoded of selected){
    assert.equal(decoded.width,80);
    assert.equal(decoded.height,64);
    assert.ok(decoded.encodedDisplayTime>=0);
    for(const px of [0,43,400,5000]){
      const want=palette[(decoded.index+Math.floor(px/13))%4];
      assert.deepEqual([...decoded.data.slice(px*4,px*4+4)],[...want,255]);
    }
  }
  assert.notDeepEqual([...selected[0].data.slice(0,3)],
    [...selected[1].data.slice(0,3)]);
  assert.throws(()=>decodeOwnGifSamples(gif.bytes(),[0,1,2,3,4,5,5]),/unique/);
  // Existing 3-frame motion-audit decoder remains supported.
  assert.equal(decodeOwnGifSamples(gif.bytes(),[0,7,14]).length,3);
});
test("seven-checkpoint report contains no wording, RGB pixels, or palette",()=>{
  const samples=selectSeamSamples(15,15);
  const decoded=samples.map(s=>({...frame(20),mediaTime:s.seconds}));
  const results=analyzeSeamContinuity(decoded);
  const report=seamForensicsReport({
    samples,frames:decoded,results,format:"gif",encoderMethod:"gif",
    seed:321,size:{width:270,height:480},fps:15
  });
  assert.equal(report.type,"glitchbitch-loop-seam-forensics");
  assert.equal(report.checkpoints.length,7);
  assert.equal(report.checkpoints[6].index,14);
  const serialized=JSON.stringify(report);
  assert.ok(!serialized.includes("PRIVATE QUOTE"));
  assert.ok(!serialized.includes("#fe22cc"));
  assert.ok(!serialized.includes("Uint8ClampedArray"));
  assert.ok(!serialized.includes("data:"));
});
test("safety guards reject missing decoded frames, mixed dimensions and unsupported GIF index lengths",()=>{
  assert.throws(()=>analyzeSeamContinuity(frames([0,0,0])),/seven/);
  const arr=frames([1,2,3,4,5,6,7]);
  arr[4]=frame(4,2,3);
  assert.throws(()=>analyzeSeamContinuity(arr),/different dimensions/);
  const gif=GIFEncoder();
  for(let i=0;i<8;i++)gif.writeFrame(new Uint8Array(16),4,4,{
    palette:[[0,0,0],[255,255,255]],delay:66,repeat:0
  });
  gif.finish();
  assert.throws(()=>decodeOwnGifSamples(gif.bytes(),[0,1,2,3]),/three or seven/);
  assert.throws(()=>decodeOwnGifSamples(gif.bytes(),[0,1,2,3,4,5,99]),/missing/);
});
test("UI uses real exported Blob and never re-encodes or creates seven expensive strict PNGs",()=>{
  const ui=source("components/ExportDialog.jsx");
  const decoder=source("clip-motion-forensics.js");
  const scanner=source("loop-seam-forensics.js");
  assert.match(ui,/selectSeamSamples\(ready\.frames,ready\.fps\)/);
  assert.match(ui,/decodeGifMotionSamples\(ready\.blob,samples\)/);
  assert.match(ui,/decodeMp4MotionSamples\(ready\.blob,samples,ready\.fps\)/);
  assert.match(ui,/assessSeamDecoderTiming\(decoded,samples,ready\.format,ready\.fps\)/);
  assert.match(ui,/analyzeSeamContinuity\(decoded,\{format:ready\.format,timing\}\)/);
  assert.match(ui,/differenceHeatmap\(left,right\)/);
  assert.match(ui,/frameBlob\(diff\)/);
  assert.match(ui,/Loop Seam Scanner/);
  assert.match(ui,/seamAuditUrls\.current\.forEach\(url=>URL\.revokeObjectURL\(url\)\)/);
  assert.match(ui,/Math\.max\(ready\.frameSize\.width,ready\.frameSize\.height\)>720/);
  assert.match(ui,/Save loop-seam report/);
  assert.match(decoder,/\!\[3,7\]\.includes\(indices\.length\)/);
  // A previous seek bug accepted the still-ready OLD frame for close targets.
  // The helper must demand a NEW decoder event before sampling another frame.
  assert.match(decoder,/requireNewEvent=false/);
  assert.match(decoder,/if\(!requireNewEvent&&check\(\)\)return Promise\.resolve\(\)/);
  assert.match(decoder,/Math\.max\(\.012,\.45\/fps\),\s*12000,true/);
  assert.match(ui,/End → Start/);
  assert.match(scanner,/seamToEdgeRatio/);
  const fn=ui.slice(ui.indexOf("async function inspectLoopSeam"),ui.indexOf("function saveSeamAudit"));
  assert.doesNotMatch(fn,/renderImage\(/);
  assert.doesNotMatch(fn,/recordClip\(/);
});
