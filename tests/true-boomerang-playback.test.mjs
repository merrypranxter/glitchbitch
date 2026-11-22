import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {
  PLAYBACK_MODES,BOOMERANG_CACHE_LIMIT,boomerangFrameIndex,
  playbackFrameSeconds,playbackTimeForMediaTime,boomerangMemoryBytes,
  validateBoomerangCache,createPlaybackFrames
} from "../src/boomerang-playback.js";
import {GIFEncoder} from "../src/vendor/gifenc.js";
import {decodeOwnGifSamples} from "../src/clip-motion-forensics.js";

const source=p=>readFileSync(new URL("../src/"+p,import.meta.url),"utf8");
test("actual source-frame index sequence is a continuous true boomerang on even counts",()=>{
  assert.deepEqual(PLAYBACK_MODES,["Forward","Boomerang"]);
  assert.deepEqual(Array.from({length:10},(_,i)=>boomerangFrameIndex(i,10)),
    [0,1,2,3,4,5,4,3,2,1]);
  assert.equal(playbackFrameSeconds(6,10,30,"Boomerang"),4/30);
  assert.equal(playbackFrameSeconds(6,10,30,"Forward"),6/30);
  assert.equal(playbackTimeForMediaTime(6/30,10,30,"Boomerang"),4/30);
  assert.equal(playbackTimeForMediaTime(.0341,90,30,"Forward"),.0341,
    "existing forward diagnostics must retain their sub-frame precision");
});
test("odd GIF frame counts hold apex once, but never repeat opening at wrap",()=>{
  assert.deepEqual(Array.from({length:9},(_,i)=>boomerangFrameIndex(i,9)),
    [0,1,2,3,4,4,3,2,1]);
  assert.deepEqual(Array.from({length:7},(_,i)=>boomerangFrameIndex(i,7)),
    [0,1,2,3,3,2,1]);
  assert.equal(boomerangFrameIndex(8,9),1);
  assert.throws(()=>boomerangFrameIndex(-1,9),/valid indexed/);
  assert.throws(()=>boomerangFrameIndex(9,9),/valid indexed/);
});
test("bounded source-frame cache is computed BEFORE any WebGL/encoder is allocated",()=>{
  const size={width:720,height:406};
  assert.equal(BOOMERANG_CACHE_LIMIT,128*1024*1024);
  assert.equal(boomerangMemoryBytes(size,180,"Forward"),0);
  assert.equal(boomerangMemoryBytes(size,180,"Boomerang"),90*720*406*4);
  assert.equal(validateBoomerangCache(size,180,"Boomerang"),90*720*406*4);
  assert.throws(()=>validateBoomerangCache({width:2160,height:1216},180,"Boomerang"),
    /safety limit/);
  assert.throws(()=>validateBoomerangCache(size,180,"FOOBAR"),/Unknown/);
  assert.throws(()=>boomerangMemoryBytes({width:0,height:10},90,"Boomerang"),
    /Invalid/);
});
test("video/GIF exact reverse uses frozen finished pixel copies even with stateful renderer feedback",async()=>{
  const count=10,original=[];
  const shared=new Uint8ClampedArray(8);
  let renders=0,restores=0,captured=new Uint8ClampedArray(8);
  const work={
    async render(seconds,includePixels){
      assert.equal(includePixels,true);
      renders++;
      // Color depends on prior render count, not just timeline seconds:
      // a shader-time ping-pong would NOT reproduce these reverse frames.
      for(let k=0;k<8;k++)shared[k]=(renders*17+k)%256;
      captured=new Uint8ClampedArray(shared);
      original.push({seconds,pixels:[...captured]});
      return shared;
    },
    restoreFrame(pixels,includePixels){
      restores++;
      assert.equal(includePixels,true);
      captured=new Uint8ClampedArray(pixels);
      shared.set(pixels);
      return shared;
    }
  };
  const playback=createPlaybackFrames(work,
    {frameCount:count,fps:10,playbackMode:"Boomerang"});
  const output=[];
  for(let i=0;i<count;i++){
    output.push([...await playback.render(i,true)]);
  }
  assert.equal(renders,6,"each forward sample rendered only once");
  assert.equal(restores,4,"reverse samples came from cached composited pixels");
  assert.deepEqual(output.map(x=>x[0]),[17,34,51,68,85,102,85,68,51,34]);
  assert.deepEqual(output[8],output[2]);
  assert.deepEqual(output[9],output[1]);
  assert.notDeepEqual(output[9],output[0],"no duplicated opening frame at wrap");
  await assert.rejects(()=>playback.render(9,true),/sequentially/);
  playback.destroy();
});
test("forward playback preserves all original render times without reverse or cache allocation",async()=>{
  let draws=0;
  const work={render(seconds,includePixels){draws++;return [seconds,includePixels];}};
  const playback=createPlaybackFrames(work,
    {frameCount:10,fps:10,playbackMode:"Forward"});
  assert.equal(playback.cached,false);
  const out=[];
  for(let i=0;i<10;i++)out.push(await playback.render(i,false));
  assert.deepEqual(out.map(x=>x[0]),[0,.1,.2,.3,.4,.5,.6,.7,.8,.9]);
  assert.equal(draws,10);
  playback.destroy();
});
test("actual bundled GIF encoder stores genuinely reversed finished frames, without shader rerender",async()=>{
  const total=10;
  const palette=[[0,0,0],[255,0,0],[0,255,0],[0,0,255]];
  const pixel=new Uint8ClampedArray(16*4);
  let renders=0,current=0;
  const work={
    async render(seconds){
      current=++renders%4;
      for(let p=0;p<16;p++)pixel.set([...palette[current],255],p*4);
      return pixel;
    },
    restoreFrame(saved){pixel.set(saved);return pixel;}
  };
  const clip=createPlaybackFrames(work,
    {fps:10,frameCount:total,playbackMode:"Boomerang"});
  const gif=GIFEncoder();
  for(let i=0;i<total;i++){
    const rgba=await clip.render(i,true);
    const indexed=new Uint8Array(16);
    for(let p=0;p<16;p++)
      indexed[p]=palette.findIndex(c=>c[0]===rgba[p*4]&&c[1]===rgba[p*4+1]);
    gif.writeFrame(indexed,4,4,{palette,delay:100,repeat:0});
  }
  gif.finish();
  const samples=decodeOwnGifSamples(gif.bytes(),[1,3,9]);
  assert.deepEqual([...samples[0].data],[...samples[2].data],
    "actual encoded GIF source frame 9 must repeat frame 1");
  assert.notDeepEqual([...samples[1].data],[...samples[2].data]);
  assert.equal(renders,6);
  clip.destroy();
});
test("export backends all feed the SAME compositor output into shared boomerang controller",()=>{
  const exporter=source("export.js");
  const ui=source("components/ExportDialog.jsx");
  assert.match(exporter,/import \{createPlaybackFrames,validateBoomerangCache\} from "\.\/boomerang-playback\.js"/);
  assert.match(exporter,/return \{ capture, render, restoreFrame, destroy, hasClosure:/);
  assert.match(exporter,/frame\.data\.set\(pixels\)/);
  assert.match(exporter,/ctx\.putImageData\(frame,0,0\)/);
  assert.match(exporter,/player=createPlaybackFrames\(work,\{fps,frameCount:Math\.round\(duration\*fps\),playbackMode\}\)/);
  assert.match(exporter,/const player=createPlaybackFrames\(work,\{fps,frameCount:count,playbackMode\}\)/);
  assert.match(exporter,/await player\.render\(i\)/);
  assert.match(exporter,/await player\.render\(i,true\)/);
  assert.match(exporter,/await player\.render\(0\)/);
  assert.match(exporter,/source\.add\(i \/ fps, 1 \/ fps\)/);
  assert.match(exporter,/gif\.writeFrame\(indexed/);
  assert.match(exporter,/validateBoomerangCache\(size,Math\.round\(duration\*fps\),playbackMode\)/);
  assert.match(exporter,/if\(playbackMode==="Boomerang"&&loopMode!=="Off"\)/);
  assert.match(exporter,/player\?\.destroy\(\)/);
  assert.match(ui,/label="Playback direction"/);
  assert.match(ui,/boomerangCacheMiB/);
  assert.match(ui,/tab==="Video"&&playbackMode==="Boomerang"&&boomerangTooLarge/);
  assert.match(ui,/-boomerang/);
});
test("strict export diagnostics use mirrored source clock and retain real decoded media timestamps",()=>{
  const ui=source("components/ExportDialog.jsx");
  assert.match(ui,/playbackTimeForMediaTime\(seconds,ready\.frames,ready\.fps,/);
  assert.match(ui,/const originalSeconds=playbackTimeForMediaTime\(/);
  assert.match(ui,/referenceTime:originalSeconds,decodedTime:picture\.mediaTime/);
  assert.match(ui,/feedback-dependent artwork may still differ/);
  assert.match(ui,/setLoopMode\("Off"\)/);
});

test("PRODUCTION capture workspace reverses complete GPU+styled-lettering pixels exactly",async()=>{
  const exporter=source("export.js");
  const from=exporter.indexOf("function createFrameWorkspace(");
  const to=exporter.indexOf("/** Deterministic fixed-rate H.264",from);
  assert.ok(from>0&&to>from);
  const document={createElement(type){
    assert.equal(type,"canvas");
    const canvas={width:0,height:0,_pixels:null,_ctx:null,
      getContext(kind){
        assert.equal(kind,"2d");
        if(this._ctx)return this._ctx;
        return this._ctx={
          createImageData(w,h){return {data:new Uint8ClampedArray(w*h*4)};},
          putImageData(image){canvas._pixels=new Uint8ClampedArray(image.data);},
          getImageData(){return {data:new Uint8ClampedArray(canvas._pixels)};}
        };
      }
    };return canvas;
  }};
  let renders=0,letteringPasses=0;
  const createRenderer=()=>({
    draw(){renders++;return true;},
    readFrame(data){
      for(let i=0;i<data.length;i+=4)
        data.set([(renders*31)%256,89,(200+renders*7)%256,255],i);
    },
    ready(){return true;},destroy(){}
  });
  const closure=new Function(source("loop-closure.js").replace(/\bexport\s+(?=(const|function)\b)/g,"")+
    "return {loopClosureFrames,loopClosureMix,weftRevealRects,irisRevealRadius};")();
  const make=new Function("document","createRenderer","loopClosureFrames",
    "loopClosureMix","weftRevealRects","irisRevealRadius",
    "hasVisibleLettering","primeFrameHistory","clockAt","checkExport",
    "waitForGraphics","paintLettering","artworkParityError",
    exporter.slice(from,to)+"return createFrameWorkspace;");
  const work=make(document,createRenderer,
    closure.loopClosureFrames,closure.loopClosureMix,
    closure.weftRevealRects,closure.irisRevealRadius,
    ()=>true,async()=>{},
    (_,__,seconds)=>({time:seconds,colorTime:seconds,textTime:seconds}),
    ()=>{},async()=>{},ctx=>{
      letteringPasses++;
      const img=ctx.getImageData(0,0,2,2);
      img.data[0]=255;
      img.data[1]=letteringPasses*8;
      ctx.putImageData(img,0,0);
    },message=>Error(message))({}, {time:0}, {width:2,height:2}, null,
      {fps:10,frameCount:10,loopMode:"Off"});
  const playback=createPlaybackFrames(work,
    {fps:10,frameCount:10,playbackMode:"Boomerang"});
  const encoded=[];
  for(let i=0;i<10;i++)
    encoded.push([...await playback.render(i,true)]);
  assert.equal(renders,6,"GPU + feedback advanced only on the forward leg");
  assert.equal(letteringPasses,6,"authored styled lettering was not repainted on reverse");
  for(const [a,b] of [[4,6],[3,7],[2,8],[1,9]])
    assert.deepEqual(encoded[a],encoded[b],
      "forward and backward source pixels must match for ALL effects, including text");
  assert.notDeepEqual(encoded[0],encoded[9]);
  assert.equal(encoded[0][0],255);
  assert.equal(encoded[1][0],255);
  playback.destroy();work.destroy();
});
