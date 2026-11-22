import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {
  LOOP_MODES,loopClosureFrames,loopClosureMix,quiltReassemblyTiles,
  clockworkSweep,crystalBloomDiamonds
} from "../src/loop-closure.js";

const source=path=>readFileSync(new URL("../src/"+path,import.meta.url),"utf8");
const newcomers=["Quilt Reassembly","Clockwork Sweep","Crystal Bloom"];

test("three new loop finishes are real opt-in choices with the same frame window and exact endpoint",()=>{
  for(const mode of newcomers){
    assert.ok(LOOP_MODES.includes(mode));
    const window=loopClosureFrames(mode,.75,30,150);
    assert.equal(window,23);
    assert.equal(loopClosureMix(149,150,window),1);
    assert.equal(loopClosureMix(0,150,window),0);
  }
  assert.equal(LOOP_MODES[0],"Off");
  assert.ok(LOOP_MODES.includes("Soft closure"));
  assert.ok(LOOP_MODES.includes("Weft zipper"));
  assert.ok(LOOP_MODES.includes("Iris portal"));
});
test("Quilt Reassembly reveals distinct staggered center-out tiles without overlap",()=>{
  const width=360,height=640;
  const zero=quiltReassemblyTiles(width,height,0);
  const middle=quiltReassemblyTiles(width,height,.5);
  const full=quiltReassemblyTiles(width,height,1);
  assert.deepEqual(zero,[]);
  const area=tiles=>tiles.reduce((sum,t)=>sum+t.width*t.height,0);
  assert.ok(area(middle)>0&&area(middle)<width*height);
  assert.equal(area(full),width*height);
  assert.ok(middle.some(t=>t.width<Math.floor(width/4)));
  assert.ok(middle.some(t=>t.width>Math.floor(width/12)));
  assert.ok(new Set(middle.map(t=>t.width)).size>2);
  const seen=new Uint8Array(width*height);
  for(const tile of full){
    for(let y=tile.y;y<tile.y+tile.height;y++)
      for(let x=tile.x;x<tile.x+tile.width;x++)
        seen[y*width+x]++;
  }
  assert.ok(seen.every(x=>x===1),"full quilt must cover every source pixel once");
});
test("Clockwork Sweep is a real rotating 0→360° radial wedge",()=>{
  const a=clockworkSweep(320,480,0),
    b=clockworkSweep(320,480,.5),
    c=clockworkSweep(320,480,1);
  assert.equal(a.cx,160);assert.equal(a.cy,240);
  assert.equal(a.start,a.end);
  assert.ok(Math.abs(b.end-b.start-Math.PI)<1e-10);
  assert.ok(Math.abs(c.end-c.start-2*Math.PI)<1e-10);
  assert.ok(c.radius>Math.hypot(320,480)/2);
});
test("Crystal Bloom grows a bounded diamond lattice outward from the center",()=>{
  const width=360,height=640;
  assert.deepEqual(crystalBloomDiamonds(width,height,0),[]);
  const early=crystalBloomDiamonds(width,height,.33);
  const middle=crystalBloomDiamonds(width,height,.66);
  const final=crystalBloomDiamonds(width,height,1);
  assert.ok(early.length>0);
  assert.ok(middle.length>=early.length);
  assert.ok(middle.length<=9*12);
  assert.equal(final.length,Math.min(width,3)*Math.min(height,5));
  assert.ok(final.every(d=>d.rx>0&&d.ry>0));
  const mid=d=>Math.hypot((d.col+.5)/3-.5,(d.row+.5)/5-.5);
  assert.ok(early.some(d=>mid(d)<.25),"center crystals appear early");
});
test("new masks reject bad geometry, nonfinite progress or out-of-range values",()=>{
  const shapes=[quiltReassemblyTiles,clockworkSweep,crystalBloomDiamonds];
  for(const shape of shapes){
    assert.throws(()=>shape(0,480,.5),/Invalid/);
    assert.throws(()=>shape(480,-1,.5),/Invalid/);
    assert.throws(()=>shape(480,480,Number.NaN),/Invalid/);
    assert.throws(()=>shape(480,480,-.1),/Invalid/);
    assert.throws(()=>shape(480,480,1.1),/Invalid/);
  }
});
test("all new modes reveal the SAME actual composited opening frame without changing encoder selection",()=>{
  const e=source("export.js"),ui=source("components/ExportDialog.jsx");
  assert.match(e,/loopMode==="Quilt Reassembly"/);
  assert.match(e,/loopMode==="Clockwork Sweep"/);
  assert.match(e,/loopMode==="Crystal Bloom"/);
  assert.match(e,/quiltReassemblyTiles\(size.width,size.height,closureMix\)/);
  assert.match(e,/clockworkSweep\(size.width,size.height,closureMix\)/);
  assert.match(e,/crystalBloomDiamonds\(size.width,size.height,closureMix\)/);
  assert.match(e,/if\(loopMode==="Soft closure"\|\|closureMix>=1\)/);
  assert.match(e,/ctx\.drawImage\(loopAnchor,0,0\)/);
  assert.match(e,/return includePixels && \(lettered\|\|closureMix>0\)/);
  assert.match(e,/const rgba=await player\.render\(i,true\)/);
  assert.match(e,/source = new CanvasSource\(work\.capture/);
  assert.match(e,/stream=work\.capture.captureStream\(fps\)/);
  for(const mode of newcomers)assert.ok(ui.includes(mode));
  assert.match(ui,/-quiltloop/);assert.match(ui,/-clockloop/);assert.match(ui,/-crystalloop/);
});
test("production workspace retains animated color and lettering through each spatial mask",async()=>{
  const exporter=source("export.js");
  const start=exporter.indexOf("function createFrameWorkspace("),
    end=exporter.indexOf("/** Deterministic fixed-rate H.264",start);
  assert.ok(start>=0&&end>start);
  const calls=[];
  const insidePolygon=(points,x,y)=>{
    let yes=false;
    for(let i=0,j=points.length-1;i<points.length;j=i++){
      const a=points[i],b=points[j];
      if(((a.y>y)!==(b.y>y))&&
          x<(b.x-a.x)*(y-a.y)/(b.y-a.y)+a.x)yes=!yes;
    }
    return yes;
  };
  const document={createElement(type){
    assert.equal(type,"canvas");
    const canvas={width:0,height:0,_pixels:null,_ctx:null,
      getContext(kind){
        assert.equal(kind,"2d");
        if(this._ctx)return this._ctx;
        const ctx={
          globalAlpha:1,globalCompositeOperation:"source-over",
          _saved:[],_path:[],_polygon:null,_clip:null,
          createImageData(w,h){return {data:new Uint8ClampedArray(w*h*4)};},
          putImageData(img){canvas._pixels=new Uint8ClampedArray(img.data);},
          getImageData(){return {data:new Uint8ClampedArray(canvas._pixels)};},
          save(){this._saved.push([this.globalAlpha,this._clip]);},
          restore(){[this.globalAlpha,this._clip]=this._saved.pop();},
          beginPath(){calls.push("begin");this._path=[];this._polygon=null;},
          rect(x,y,w,h){calls.push("rect");this._path.push([
            {x,y},{x:x+w,y},{x:x+w,y:y+h},{x,y:y+h}
          ]);},
          moveTo(x,y){
            if(this._polygon?.length)this._path.push(this._polygon);
            this._polygon=[{x,y}];calls.push("moveTo");
          },
          lineTo(x,y){this._polygon.push({x,y});calls.push("lineTo");},
          arc(cx,cy,r,start,end){
            calls.push("arc");
            const steps=Math.max(2,Math.ceil(Math.abs(end-start)/.055));
            if(!this._polygon)this._polygon=[];
            for(let i=0;i<=steps;i++){
              const angle=start+(end-start)*i/steps;
              this._polygon.push({x:cx+Math.cos(angle)*r,y:cy+Math.sin(angle)*r});
            }
          },
          closePath(){
            calls.push("closePath");
            if(this._polygon?.length){this._path.push(this._polygon);this._polygon=null;}
          },
          clip(){
            calls.push("clip");
            if(this._polygon?.length)this._path.push(this._polygon);
            this._clip=[...this._path];
          },
          drawImage(other){
            if(!canvas._pixels)canvas._pixels=new Uint8ClampedArray(other._pixels.length);
            for(let i=0;i<canvas._pixels.length;i+=4){
              const p=i/4,x=p%canvas.width+.5,y=Math.floor(p/canvas.width)+.5;
              if(this._clip&&!this._clip.some(poly=>insidePolygon(poly,x,y)))continue;
              for(let channel=0;channel<3;channel++)
                canvas._pixels[i+channel]=Math.round(
                  other._pixels[i+channel]*this.globalAlpha+
                  canvas._pixels[i+channel]*(1-this.globalAlpha));
              canvas._pixels[i+3]=255;
            }
          }
        };
        return this._ctx=ctx;
      }
    };
    return canvas;
  }};
  const renderer=()=>{let color=0;return{
    draw(_,clock){color=Math.round(clock.time*68);return true;},
    readFrame(bytes){for(let i=0;i<bytes.length;i+=4)
      bytes.set([color,70,255-color,255],i);},
    ready(){return true;},destroy(){}
  }};
  const build=new Function(
    "document","createRenderer","loopClosureFrames","loopClosureMix",
    "weftRevealRects","irisRevealRadius","quiltReassemblyTiles",
    "clockworkSweep","crystalBloomDiamonds","hasVisibleLettering",
    "primeFrameHistory","clockAt","checkExport","waitForGraphics",
    "paintLettering","artworkParityError",
    exporter.slice(start,end)+"return createFrameWorkspace;");
  const make=build(document,renderer,loopClosureFrames,loopClosureMix,
    ()=>[],()=>1,quiltReassemblyTiles,clockworkSweep,crystalBloomDiamonds,
    ()=>true,async()=>{},
    (_,__,seconds)=>({time:seconds,colorTime:seconds,textTime:seconds}),
    ()=>{},async()=>{},ctx=>{
      const img=ctx.getImageData(0,0,80,80);
      img.data[0]=243;img.data[1]=26;img.data[2]=174;
      ctx.putImageData(img,0,0);
    },msg=>Error(msg));
  for(const [mode,pathMethod] of [
    ["Quilt Reassembly","rect"],["Clockwork Sweep","arc"],["Crystal Bloom","lineTo"]
  ]){
    calls.length=0;
    const work=make({},{time:0},{width:80,height:80},null,
      {fps:10,frameCount:20,loopMode:mode,loopBlendSeconds:.5});
    const first=new Uint8Array(await work.render(0,true));
    const middle=new Uint8Array(await work.render(1.7,true));
    const ending=new Uint8Array(await work.render(1.9,true));
    assert.ok(calls.includes(pathMethod),mode+" must use actual path geometry");
    assert.ok(calls.includes("clip"),mode+" needs real Canvas2D clipping");
    assert.notDeepEqual([...middle],[...first],
      mode+" must preserve continuing original animation under its mask");
    assert.deepEqual([...ending],[...first],
      mode+" must exactly restore the opening composite (including text)");
    assert.equal(ending[0],243);
    work.destroy();
  }
});
