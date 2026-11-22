import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {LOOP_MODES,LOOP_BLEND_SECONDS,loopClosureFrames,loopClosureMix}
  from "../src/loop-closure.js";

const source=p=>readFileSync(new URL("../src/"+p,import.meta.url),"utf8");

test("original format stays Off by default; new time options have bounded artist controls",()=>{
  assert.deepEqual(LOOP_MODES,["Off","Soft closure"]);
  assert.ok(LOOP_BLEND_SECONDS.includes(.75));
  assert.equal(loopClosureFrames("Off",.75,30,180),0);
  assert.equal(loopClosureMix(179,180,0),0);
  assert.equal(loopClosureMix(0,180,0),0);
});
test("soft closure stays off in the opening, fades gently and ends exactly at 1",()=>{
  const count=90,fps=30;
  const frames=loopClosureFrames("Soft closure",.75,fps,count);
  assert.equal(frames,23);
  const start=count-frames;
  assert.equal(loopClosureMix(start-1,count,frames),0);
  assert.equal(loopClosureMix(start,count,frames),0);
  assert.equal(loopClosureMix(count-1,count,frames),1);
  let previous=0;
  for(let i=start;i<count;i++){
    const alpha=loopClosureMix(i,count,frames);
    assert.ok(alpha>=previous&&alpha<=1);
    previous=alpha;
  }
  assert.ok(loopClosureMix(start+1,count,frames)<.03);
  assert.ok(loopClosureMix(count-2,count,frames)>.97);
});
test("closure never consumes the entire animation, even on short 1-second exports",()=>{
  const frames=loopClosureFrames("Soft closure",2,10,10);
  assert.equal(frames,8);
  assert.equal(loopClosureMix(0,10,frames),0);
  assert.equal(loopClosureMix(2,10,frames),0);
  assert.equal(loopClosureMix(9,10,frames),1);
});
test("invalid modes, FPS, durations and frame indices throw instead of silently degrading",()=>{
  assert.throws(()=>loopClosureFrames("Perfect and magical",.75,30,180),/Unknown/);
  assert.throws(()=>loopClosureFrames("Soft closure",0,30,180),/duration/);
  assert.throws(()=>loopClosureFrames("Soft closure",3,30,180),/duration/);
  assert.throws(()=>loopClosureFrames("Soft closure",.5,0,180),/fixed-rate/);
  assert.throws(()=>loopClosureFrames("Soft closure",.5,30,2),/fixed-rate/);
  assert.throws(()=>loopClosureMix(-1,20,6),/Invalid/);
  assert.throws(()=>loopClosureMix(20,20,6),/Invalid/);
});
test("default GIF, H264 and native export paths all use one opt-in post-lettering closure canvas",()=>{
  const code=source("export.js");
  const ui=source("components/ExportDialog.jsx");
  assert.match(code,/import \{loopClosureFrames,loopClosureMix\} from "\.\/loop-closure\.js"/);
  assert.match(code,/loopMode="Off",loopBlendSeconds=\.75/);
  assert.match(code,/const closureFrames=loopClosureFrames\(loopMode,loopBlendSeconds,fps,frameCount\)/);
  assert.match(code,/if \(lettered\) paintLettering\(ctx, state, frameClock, size\.width, size\.height\)/);
  assert.match(code,/loopContext\.drawImage\(capture,0,0\)/);
  assert.match(code,/const closureMix=loopClosureMix\(index,frameCount,closureFrames\)/);
  assert.match(code,/ctx\.drawImage\(loopAnchor,0,0\)/);
  assert.match(code,/return includePixels && \(lettered\|\|closureMix>0\)/);
  assert.match(code,/ctx\.getImageData\(0,0,size\.width,size\.height\)\.data:frame\.data/);
  assert.match(code,/if\(i>0\|\|!work\.hasClosure\)await work\.render\(i\/fps\)/);
  assert.match(code,/work = createFrameWorkspace\(state, timeline, size, signal,/);
  assert.match(code,/work=createFrameWorkspace\(state,timeline,size,signal,/);
  assert.match(code,/const work=createFrameWorkspace\(state,timeline,size,signal,/);
  assert.match(ui,/loopMode,setLoopMode/);
  assert.match(ui,/loopBlendSeconds,setLoopBlendSeconds/);
  assert.match(ui,/loopMode,loopBlendSeconds,/);
  assert.match(ui,/label="Loop surgery"/);
  assert.match(ui,/label="Tail-to-opening blend"/);
  assert.match(ui,/-softloop/);
});
test("export diagnostics explicitly disclose intentional soft-loop tail modifications",()=>{
  const ui=source("components/ExportDialog.jsx");
  assert.match(ui,/Loop Surgery was enabled for this clip/);
  assert.match(ui,/Inconclusive: Loop Surgery intentionally changes ending frames/);
  assert.match(ui,/Loop Surgery softened this exported loop/);
});
test("production render workspace under a simulated Canvas2D produces equal first and last raw frames",async()=>{
  const exporter=source("export.js");
  const start=exporter.indexOf("function createFrameWorkspace(");
  const end=exporter.indexOf("/** Deterministic fixed-rate H.264",start);
  assert.ok(start>=0&&end>start);
  // Tiny Canvas2D mock: models the real source-over and globalAlpha used by
  // browsers. This exercises the production createFrameWorkspace function,
  // not a rewritten approximation of the loop algorithm.
  const drawContexts=[];
  const fakeDocument={createElement(type){
    assert.equal(type,"canvas");
    const canvas={width:0,height:0,_pixels:null,_ctx:null,
      getContext(kind){
        assert.equal(kind,"2d");
        if(this._ctx)return this._ctx;
        const ctx={globalCompositeOperation:"source-over",globalAlpha:1,_saved:[],
          createImageData(w,h){return {width:w,height:h,data:new Uint8ClampedArray(w*h*4)};},
          putImageData(frame){canvas._pixels=new Uint8ClampedArray(frame.data);},
          getImageData(){return {data:new Uint8ClampedArray(canvas._pixels)};},
          save(){this._saved.push([this.globalAlpha,this.globalCompositeOperation]);},
          restore(){const [alpha,op]=this._saved.pop();this.globalAlpha=alpha;this.globalCompositeOperation=op;},
          drawImage(other){
            const input=other._pixels;
            assert.ok(input);
            if(!canvas._pixels)canvas._pixels=new Uint8ClampedArray(input.length);
            for(let i=0;i<input.length;i+=4){
              const alpha=this.globalAlpha;
              for(let channel=0;channel<3;channel++)
                canvas._pixels[i+channel]=Math.round(
                  input[i+channel]*alpha+canvas._pixels[i+channel]*(1-alpha));
              canvas._pixels[i+3]=255;
            }
          }
        };
        this._ctx=ctx;drawContexts.push(ctx);return ctx;
      }};
    return canvas;
  }};
  const mockRenderer=()=>{let red=0;return {
    draw(_,clock){red=Math.max(0,Math.min(255,Math.round(clock.time*60)));return true;},
    readFrame(data){for(let i=0;i<data.length;i+=4)
      data.set([red,30,255-red,255],i);},
    ready(){return true;},destroy(){}
  }};
  const build=new Function("document","createRenderer","loopClosureFrames",
    "loopClosureMix","hasVisibleLettering","primeFrameHistory","clockAt",
    "checkExport","waitForGraphics","paintLettering","artworkParityError",
    exporter.slice(start,end)+"return createFrameWorkspace;");
  const make=build(fakeDocument,mockRenderer,loopClosureFrames,loopClosureMix,
    ()=>false,async()=>{},(_,__,seconds)=>({time:seconds,colorTime:seconds,textTime:seconds}),
    ()=>{},async()=>{},()=>{},message=>Error(message));
  const size={width:2,height:2},state={};
  const enabled=make(state,{time:0},size,null,
    {fps:10,frameCount:20,loopMode:"Soft closure",loopBlendSeconds:.5});
  assert.equal(enabled.hasClosure,true);
  const first=new Uint8Array(await enabled.render(0,true));
  const middle=new Uint8Array(await enabled.render(1,true));
  let penultimate;
  for(let i=11;i<20;i++){
    const rgba=new Uint8Array(await enabled.render(i/10,true));
    if(i===18)penultimate=rgba;
    if(i===19)assert.deepEqual([...rgba],[...first],
      "last source pixel buffer must be identical to the actual first frame");
  }
  assert.notDeepEqual([...middle],[...first],"middle must retain animation");
  assert.notDeepEqual([...penultimate],[...middle],"tail must continue changing");
  enabled.destroy();
  const raw=make(state,{time:0},size,null,
    {fps:10,frameCount:20,loopMode:"Off",loopBlendSeconds:.5});
  assert.equal(raw.hasClosure,false);
  const rawStart=new Uint8Array(await raw.render(0,true));
  const rawEnd=new Uint8Array(await raw.render(1.9,true));
  assert.notDeepEqual([...rawStart],[...rawEnd],
    "default Off must not secretly blend or rewrite the last frame");
  raw.destroy();
  // Verify the anchor is taken AFTER the real lettering compositor, not
  // from the unlettered WebGL pixel array. No white text export regression.
  const letteredFactory=build(fakeDocument,mockRenderer,loopClosureFrames,loopClosureMix,
    ()=>true,async()=>{},
    (_,__,seconds)=>({time:seconds,colorTime:seconds,textTime:seconds}),
    ()=>{},async()=>{},ctx=>{
      const image=ctx.getImageData(0,0,size.width,size.height);
      image.data[0]=224;
      ctx.putImageData(image,0,0);
    },message=>Error(message));
  const withText=letteredFactory(state,{time:0},size,null,
    {fps:10,frameCount:20,loopMode:"Soft closure",loopBlendSeconds:.5});
  const firstWithText=new Uint8Array(await withText.render(0,true));
  assert.equal(firstWithText[0],224,"the authored text pass must be visible in the saved anchor");
  const finalWithText=new Uint8Array(await withText.render(1.9,true));
  assert.deepEqual([...finalWithText],[...firstWithText],
    "end-frame closure must include all composited lettering and optical pixels");
  withText.destroy();
});
