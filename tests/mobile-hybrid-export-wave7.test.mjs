import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {webglReadbackView,flipRgbaRowsInPlace} from "../src/frame-buffer-memory.js";
import {crochetGLSL,velvetGLSL} from "../src/living-textiles-wave5.js";

const codeOf=path=>readFileSync(new URL("../src/"+path,import.meta.url),"utf8");
function referenceFlip(input,w,h){
  const stride=w*4,out=[];
  for(let y=h-1;y>=0;y--)
    out.push(...input.slice(y*stride,(y+1)*stride));
  return out;
}

test("memory: readPixels typed view aliases ImageData, including nonzero subview offset",()=>{
  const frame={data:new Uint8ClampedArray(48)};
  const bytes=webglReadbackView(frame);
  assert.ok(bytes instanceof Uint8Array);
  assert.ok(!(bytes instanceof Uint8ClampedArray));
  assert.equal(bytes.buffer,frame.data.buffer);
  assert.equal(bytes.byteOffset,frame.data.byteOffset);
  assert.equal(bytes.byteLength,frame.data.byteLength);
  bytes[0]=27;assert.equal(frame.data[0],27);
  frame.data[1]=144;assert.equal(bytes[1],144);
  const backing=new Uint8ClampedArray(64);
  const sub=backing.subarray(8,40),alias=webglReadbackView({data:sub});
  assert.equal(alias.byteOffset,sub.byteOffset);
  assert.equal(alias.byteLength,sub.byteLength);
  alias[2]=248;assert.equal(backing[10],248);
  assert.throws(()=>webglReadbackView({data:new Uint8Array(8)}),/ImageData RGBA/);
});

test("memory: in-place WebGL bottom-up flip is bit-exact for portrait/square/odd and even heights",()=>{
  for(const [w,h] of [[1,1],[1,2],[1,3],[2,2],[2,3],[3,4],[11,7],[16,9],[216,384]]){
    const frame={data:new Uint8ClampedArray(w*h*4)};
    const bytes=webglReadbackView(frame),row=new Uint8Array(w*4);
    for(let i=0;i<bytes.length;i++)bytes[i]=(i*73+(i>>3)*41)%256;
    const original=[...bytes],expected=referenceFlip(original,w,h);
    assert.equal(flipRgbaRowsInPlace(bytes,w,h,row),bytes);
    assert.deepEqual([...frame.data],expected, w+"x"+h+" flipped output");
    flipRgbaRowsInPlace(bytes,w,h,row);
    assert.deepEqual([...frame.data],original,w+"x"+h+" flipping twice");
  }
});

test("memory: repeated frames reuse the same readback view and row scratch",()=>{
  const w=19,h=37,frame={data:new Uint8ClampedArray(w*h*4)};
  const bytes=webglReadbackView(frame),row=new Uint8Array(w*4);
  for(let epoch=0;epoch<12;epoch++){
    for(let i=0;i<bytes.length;i++)bytes[i]=(i+epoch*61)%256;
    const expected=referenceFlip([...bytes],w,h);
    flipRgbaRowsInPlace(bytes,w,h,row);
    assert.deepEqual([...bytes],expected);
    assert.equal(bytes.buffer,frame.data.buffer);
  }
  assert.throws(()=>flipRgbaRowsInPlace(bytes,w,h,row.subarray(1)),/row buffer/);
  assert.throws(()=>flipRgbaRowsInPlace(bytes,w,h+1,row),/buffer size/);
  assert.throws(()=>flipRgbaRowsInPlace(bytes,0,h,row),/dimensions/);
});

test("export GIF and MP4 share the original exact renderer but no longer allocate another full RGBA frame",()=>{
  const exporter=codeOf("export.js");
  assert.match(exporter,/import \{webglReadbackView,flipRgbaRowsInPlace\} from "\.\/frame-buffer-memory\.js"/);
  assert.match(exporter,/const frame = ctx\.createImageData\(size\.width, size\.height\)/);
  assert.match(exporter,/const bytes=webglReadbackView\(frame\)/);
  assert.match(exporter,/const rowBuffer=new Uint8Array\(size\.width\*4\)/);
  assert.match(exporter,/renderer\.readFrame\(bytes\)/);
  assert.match(exporter,/flipRgbaRowsInPlace\(bytes,size\.width,size\.height,rowBuffer\)/);
  assert.match(exporter,/ctx\.putImageData\(frame,0,0\)/);
  assert.doesNotMatch(exporter,/new Uint8Array\(size\.width \* size\.height \* 4\)/);
  assert.match(exporter,/return includePixels && \(lettered\|\|closureMix>0\)/);
  assert.match(exporter,/ctx\.getImageData\(0,0,size\.width,size\.height\)\.data:frame\.data/);
  assert.match(exporter,/source = new CanvasSource\(work\.capture/);
  assert.match(exporter,/gif\.writeFrame\(indexed,size\.width,size\.height/);
  assert.match(exporter,/await waitForGraphics\(renderer,signal\)/);
  assert.match(exporter,/renderer = createRenderer\(canvas,\{exactEffects:true\}\)/);
});

test("crochet: a conservative surface z slab removes empty raymarch steps without losing fabric thickness",()=>{
  assert.match(crochetGLSL,/float invRayZ=1\.0\/max\(-rd\.z,\.01\)/);
  assert.match(crochetGLSL,/float travel=max\(0\.0,\(ro\.z-\.20\)\*invRayZ\)/);
  assert.match(crochetGLSL,/float farTravel=min\(2\.8,\(ro\.z\+\.20\)\*invRayZ\)/);
  assert.match(crochetGLSL,/if\(travel>farTravel\)break/);
  assert.match(crochetGLSL,/for\(int i=0;i<20;i\+\+\)/);
  assert.match(crochetGLSL,/if\(i>=steps\)break/);
  assert.match(crochetGLSL,/for\(int i=0;i<3;i\+\+\)/);
  assert.match(crochetGLSL,/return max\(fabric,web\)\+yarn/);
  assert.match(crochetGLSL,/hcrIridescence/);
  assert.match(velvetGLSL,/float vldField\(vec2 p\)/);
  // Max raw fabric half-depth = z undulation .112 + material .075 +
  // hit threshold .007 + possible yarn perturbation .002 <= .196.
  assert.ok(.012+.1+.075+.007+.002<=.20);
});

test("preview warns when a GPU silently drops a heavy effect; exact export stays fail-loud",()=>{
  const renderer=codeOf("renderer.js"),canvas=codeOf("ArtCanvas.jsx"),css=codeOf("style.css");
  assert.match(renderer,/fallbackNotice\(state\)/);
  for(const name of ["Crossbreed Lab","Hyperbolic Crochet","Living Velvet",
    "Quasicrystal Dissolution","Complex Poles","Hexagram Terraces","Schlieren Glass"])
    assert.ok(renderer.includes('missing.push("'+name+'")'),name);
  assert.match(canvas,/const notice=renderer\.fallbackNotice\(state\)/);
  assert.match(canvas,/if\(notice!==lastFallbackNotice\)/);
  assert.match(canvas,/fallbackNotice && !error && !recovering/);
  assert.match(canvas,/Preview simplified by this GPU/);
  assert.match(canvas,/Exact MP4\/GIF export will not silently omit these effects/);
  assert.match(css,/\.render-parity-warning/);
  assert.match(css,/pointer-events: none/);
  assert.match(renderer,/if\(exactEffects\)throw artworkParityError\("Full-effect shader failed to compile",e\)/);
});
