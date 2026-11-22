import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {
  LOOP_MODES,loopClosureFrames,loopClosureMix,weftRevealRects,irisRevealRadius
} from "../src/loop-closure.js";
const source=path=>readFileSync(new URL("../src/"+path,import.meta.url),"utf8");

test("both new artistic closure choices retain the same exact bounded frame schedule",()=>{
  assert.deepEqual(LOOP_MODES,["Off","Soft closure","Weft zipper","Iris portal"]);
  for(const mode of LOOP_MODES.slice(1)){
    const count=150,frames=loopClosureFrames(mode,.75,30,count);
    assert.equal(frames,23);
    assert.equal(loopClosureMix(count-frames-1,count,frames),0);
    assert.equal(loopClosureMix(count-1,count,frames),1);
  }
});
test("weft zipper opens no mask at zero; at full progress covers every pixel exactly once",()=>{
  const width=360,height=640;
  assert.deepEqual(weftRevealRects(width,height,0),[]);
  const full=weftRevealRects(width,height,1);
  assert.ok(full.length>=8&&full.length<=48);
  assert.equal(full.reduce((sum,r)=>sum+r.width*r.height,0),width*height);
  assert.equal(full[0].y,0);
  assert.equal(full[full.length-1].y+full[full.length-1].height,height);
  for(let i=0;i<full.length;i++){
    assert.equal(full[i].width,width);
    assert.equal(full[i].x,0);
    assert.ok(full[i].height>0);
    if(i)assert.equal(full[i-1].y+full[i-1].height,full[i].y);
  }
});
test("partial weft closure produces alternating, staggered ribbon reveals, not a global fade",()=>{
  const width=320,height=480;
  const first=weftRevealRects(width,height,.46);
  const later=weftRevealRects(width,height,.74);
  const area=a=>a.reduce((sum,r)=>sum+r.width*r.height,0);
  assert.ok(area(first)>0&&area(first)<width*height);
  assert.ok(area(later)>area(first)&&area(later)<width*height);
  assert.ok(first.some(r=>r.row%2===0&&r.x===0&&r.width<width));
  assert.ok(first.some(r=>r.row%2===1&&r.x===width-r.width&&r.x>0));
  assert.ok(new Set(first.map(r=>r.width)).size>1,"ribbons have phased starts");
  const tiny=weftRevealRects(2,2,1);
  assert.equal(area(tiny),4);
});
test("iris portal begins at zero and expands past all four corners",()=>{
  for(const [w,h] of [[320,480],[480,320],[1,1]]){
    assert.equal(irisRevealRadius(w,h,0),0);
    const middle=irisRevealRadius(w,h,.5);
    const last=irisRevealRadius(w,h,1);
    assert.ok(middle>0&&middle<last);
    assert.ok(last>Math.hypot(w,h)/2);
  }
  assert.throws(()=>weftRevealRects(0,480,.5),/Invalid/);
  assert.throws(()=>irisRevealRadius(320,480,-1),/Invalid/);
  assert.throws(()=>weftRevealRects(320,480,2),/Invalid/);
});
test("actual export render function chooses a masked one-draw reveal, and full source frame at 100%",async()=>{
  const exportCode=source("export.js");
  const from=exportCode.indexOf("function createFrameWorkspace("),
    to=exportCode.indexOf("/** Deterministic fixed-rate H.264",from);
  assert.ok(from>=0&&to>from);
  const calls=[];
  const document={createElement(){
    const canvas={width:0,height:0,_pixels:null,_ctx:null,
      getContext(kind){
        assert.equal(kind,"2d");
        if(this._ctx)return this._ctx;
        const ctx={
          globalAlpha:1,globalCompositeOperation:"source-over",_save:[],
          createImageData(w,h){return {data:new Uint8ClampedArray(w*h*4)};},
          putImageData(img){canvas._pixels=new Uint8ClampedArray(img.data);},
          getImageData(){return {data:new Uint8ClampedArray(canvas._pixels)};},
          save(){this._save.push([
            this.globalAlpha,this.globalCompositeOperation,this._clip
          ]);},
          restore(){const [alpha,operation,clip]=this._save.pop();
            this.globalAlpha=alpha;this.globalCompositeOperation=operation;
            this._clip=clip;},
          beginPath(){calls.push("beginPath");this._path=[];},
          rect(x,y,width,height){
            calls.push("rect");
            this._path.push({type:"rect",x,y,width,height});
          },
          arc(cx,cy,radius){
            calls.push("arc");
            this._path.push({type:"circle",cx,cy,radius});
          },
          clip(){calls.push("clip");this._clip=[...this._path];},
          drawImage(other){
            calls.push("drawImage");
            if(!canvas._pixels)canvas._pixels=new Uint8ClampedArray(other._pixels.length);
            for(let k=0;k<canvas._pixels.length;k+=4){
              const pixel=k/4,x=pixel%canvas.width+.5;
              const y=Math.floor(pixel/canvas.width)+.5;
              const inside=!this._clip||this._clip.some(shape=>
                shape.type==="rect"?
                  x>=shape.x&&x<shape.x+shape.width&&
                  y>=shape.y&&y<shape.y+shape.height:
                  Math.hypot(x-shape.cx,y-shape.cy)<=shape.radius);
              if(!inside)continue;
              for(let c=0;c<3;c++)canvas._pixels[k+c]=Math.round(
                (other._pixels[k+c]*this.globalAlpha)+
                canvas._pixels[k+c]*(1-this.globalAlpha));
              canvas._pixels[k+3]=255;
            }
          }
        };
        return this._ctx=ctx;
      }
    };
    return canvas;
  }};
  const renderer=()=>{let red=0;return{
    draw(_,clock){red=Math.round(clock.time*50);return true;},
    ready(){return true;},
    readFrame(data){for(let i=0;i<data.length;i+=4)
      data.set([red,110,255-red,255],i);},
    destroy(){}
  }};
  const build=new Function("document","createRenderer","loopClosureFrames",
    "loopClosureMix","weftRevealRects","irisRevealRadius",
    "hasVisibleLettering","primeFrameHistory","clockAt","checkExport",
    "waitForGraphics","paintLettering","artworkParityError",
    exportCode.slice(from,to)+"return createFrameWorkspace;");
  const make=build(document,renderer,loopClosureFrames,loopClosureMix,
    weftRevealRects,irisRevealRadius,()=>false,async()=>{},
    (_,__,seconds)=>({time:seconds,colorTime:seconds,textTime:seconds}),
    ()=>{},async()=>{},()=>{},msg=>Error(msg));
  for(const [mode,expected] of [["Weft zipper","rect"],["Iris portal","arc"]]){
    calls.length=0;
    const workspace=make({},{time:0},{width:32,height:32},null,
      {fps:10,frameCount:20,loopMode:mode,loopBlendSeconds:.5});
    const first=new Uint8Array(await workspace.render(0,true));
    const mid=new Uint8Array(await workspace.render(1.7,true));
    assert.ok(calls.includes(expected),mode+" should use its actual Canvas2D mask");
    assert.ok(calls.includes("clip"),"mask must be applied by Canvas2D clip");
    assert.notDeepEqual([...mid],[...first],
      "intermediate frame still shows evolving original shader");
    const final=new Uint8Array(await workspace.render(1.9,true));
    assert.deepEqual([...final],[...first],
      "first and last source frames identical in "+mode);
    workspace.destroy();
  }
});
test("all three encoders still quantize/capture the post-closure composite; Off never allocates anchor",()=>{
  const exporter=source("export.js");
  const ui=source("components/ExportDialog.jsx");
  assert.match(exporter,/const loopAnchor=closureFrames>0\?document.createElement\("canvas"\):null/);
  assert.match(exporter,/loopMode==="Soft closure"\|\|closureMix>=1/);
  assert.match(exporter,/weftRevealRects\(size.width,size.height,closureMix\)/);
  assert.match(exporter,/irisRevealRadius\(size.width,size.height,closureMix\)/);
  assert.match(exporter,/return includePixels && \(lettered\|\|closureMix>0\)/);
  assert.match(exporter,/const rgba=await work.render\(i\/fps, true\)/);
  assert.match(exporter,/source = new CanvasSource\(work.capture/);
  assert.match(exporter,/stream=work.capture.captureStream\(fps\)/);
  assert.match(ui,/mode==="Weft zipper"/);
  assert.match(ui,/Weft zipper · alternating woven reveal/);
  assert.match(ui,/Iris portal · circular reveal to frame one/);
  assert.match(ui,/-weftloop/);
  assert.match(ui,/-irisloop/);
});
