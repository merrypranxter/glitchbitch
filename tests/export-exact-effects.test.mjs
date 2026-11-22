import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {artworkParityError,isArtworkParityError} from "../src/export-parity.js";

const text=path=>readFileSync(new URL(path,import.meta.url),"utf8");
const renderer=text("../src/renderer.js"), exporter=text("../src/export.js");
const dialog=text("../src/components/ExportDialog.jsx");

test("parity errors are non-retryable and safe to show the artist",()=>{
  const err=artworkParityError("Full-effect shader compile",new Error("Fragment out of resources"));
  assert.equal(err.name,"ArtworkParityError");
  assert.equal(isArtworkParityError(err),true);
  assert.equal(isArtworkParityError(new Error("Codec issue")),false);
  assert.match(err.message,/Export stopped rather than remove your special effects/);
  assert.match(err.message,/GPU detail: Fragment out of resources/);
  assert.match(err.message,/Your art and settings are unchanged/);
});

test("GLSL reserved-word failures explain why lowering resolution cannot help",()=>{
  const err=artworkParityError("Full-effect shader failed to compile",
    new Error("ERROR: 0:1650: 'resource' : Illegal use of reserved word"));
  assert.equal(err.name,"ArtworkParityError");
  assert.match(err.message,/Resolution and bitrate cannot fix a shader syntax error/);
  assert.match(err.message,/update the app code and retry/);
  assert.match(err.message,/resource/);
  assert.doesNotMatch(err.message,/Try a smaller export resolution/);
});

test("the live editor may recover but exact export refuses shader downgrades",()=>{
  assert.match(renderer,/export function createRenderer\(canvas, \{exactEffects=false\} = \{\}\)/);
  assert.match(renderer,/if\(exactEffects\)throw artworkParityError\("Full-effect shader failed to compile",e\)/);
  assert.match(renderer,/if\(candidate\.injuryAmount>0 && !injuryUnavailable\)/);
  assert.match(renderer,/if\(candidate\.alchemyAmount>0 && !alchemyUnavailable\)/);
  assert.match(renderer,/if\(candidate\.filamentAmount>0\)/);
  assert.match(renderer,/if\(candidate\.photonAmount>0\)/);
});

test("downloadable PNG, GIF and MP4 share the exact-effect renderer",()=>{
  assert.match(exporter,/renderer = createRenderer\(canvas,\{exactEffects\}\)/);
  assert.match(exporter,/try \{ renderer = createRenderer\(canvas,\{exactEffects:true\}\); \}/);
  assert.match(exporter,/type = "image\/png", \{exactEffects=true\} = \{\}\)/);
  assert.match(exporter,/await primeFrameHistory\(renderer,state,timeline,\{width,height\}\)/);
  assert.match(exporter,/await primeFrameHistory\(renderer,state,timeline,size,signal\)/);
  assert.match(exporter,/renderer\.readFrame\(bytes\)/);
});

test("codec fallback cannot swallow an artwork-parity failure",()=>{
  const catches=exporter.match(/if\(e\.name==="AbortError" \|\| isArtworkParityError\(e\)\)throw e;/g)||[];
  assert.equal(catches.length,2,"Both WebCodecs and native MP4 catches must preserve parity errors");
  assert.match(exporter,/if\(typeof VideoEncoder!=="undefined"/);
  assert.match(exporter,/if\(nativeMp4Mime\(\)\)/);
});

test("biology, afterimage, datamosh and GPU pixel failures are not silently dropped",()=>{
  for(const pattern of [
    /if\(exactEffects\)throw artworkParityError\("Biological growth failed",error\)/,
    /if\(exactEffects\)throw artworkParityError\("Frame-memory effects could not initialize",e\)/,
    /if\(exactEffects\)throw artworkParityError\("Frame-memory composite failed",e\)/,
    /artworkParityError\("GPU could not read back the finished effects"\)/,
    /artworkParityError\("GPU reported a failed completed frame"\)/,
    /artworkParityError\("GPU context lost before capture"\)/
  ])assert.match(renderer,pattern);
});

test("PNG and clip begin with the SAME deterministic pre-roll history",()=>{
  assert.match(exporter,/async function primeFrameHistory\(renderer,state,timeline,size,signal\)/);
  assert.match(exporter,/for\(let i=5;i>=1;i--\)/);
  assert.match(exporter,/clockAt\(state,timeline,-i\/20\)/);
  assert.match(exporter,/if\(!historyPrimed\)/);
  assert.match(exporter,/historyPrimed=true/);
  assert.match(exporter,/await waitForGraphics\(renderer,signal\)/);
});

test("bookmarks still save recipes when only their tiny thumbnail degrades",()=>{
  assert.match(exporter,/renderImage\(state, timeline, 240, "image\/jpeg",\s*\{exactEffects:false\}\)/);
  assert.match(exporter,/export async function thumbnail\(/);
});

test("export UI explicitly explains that video effects cannot disappear quietly",()=>{
  assert.match(dialog,/deceptively simplified MP4/);
  assert.match(dialog,/same strict-effects\s*renderer as PNG\/GIF\/MP4/);
  assert.match(dialog,/onClick=\{makeProof\}/);
});

test("preview GPU is released before exact-effect capture and resumed afterward",()=>{
  const main=text("../src/main.jsx");
  assert.match(main,/\{exportRendererBusy \? \(/);
  assert.match(main,/canvasRef\.current\.toDataURL\("image\/png"\)/);
  assert.match(main,/setExportRendererBusy\(Boolean\(value\)\)/);
  assert.match(main,/onExportBusy=\{onExportBusy\}/);
  assert.match(dialog,/onExportBusy\?\.\(true\)/);
  assert.match(dialog,/onExportBusy\?\.\(false\)/);
  const starts=dialog.match(/onExportBusy\?\.\(true\)/g)||[];
  const stops=dialog.match(/onExportBusy\?\.\(false\)/g)||[];
  assert.equal(starts.length,3,"PNG/MP4, quick proof and blend proof each park preview");
  assert.ok(stops.length>=4,"all finally/cleanup routes restore the preview");
  assert.match(dialog,/requestAnimationFrame\(\(\)=>requestAnimationFrame\(resolve\)\)/);
});

test("Vite JSX transform parses the live Preview/Export control updates",async()=>{
  const {transformWithEsbuild}=await import("vite");
  for(const path of ["../src/main.jsx","../src/components/ExportDialog.jsx"]){
    const source=text(path);
    const result=await transformWithEsbuild(source,path,{loader:"jsx"});
    assert.ok(result.code.length>1000);
  }
});

test("all the new source still parses as JavaScript",()=>{
  assert.match(renderer,/readFrame\(target\)/);
  assert.match(exporter,/export async function recordClip\(/);
  assert.match(text("../src/export-parity.js"),/export function artworkParityError/);
});
