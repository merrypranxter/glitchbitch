import { createRenderer } from "./renderer.js";
import { isArtworkParityError, artworkParityError } from "./export-parity.js";
import { ratios } from "./data.js";
import { hasVisibleLettering, paintLettering, waitForLetteringFonts } from "./text-compositor.js";
import {loopClosureFrames,loopClosureMix,weftRevealRects,irisRevealRadius} from "./loop-closure.js";
import {createPlaybackFrames,validateBoomerangCache} from "./boomerang-playback.js";

export function dimensions(ratio, longEdge) {
  const r = ratios.find((x) => x.id === ratio)?.value || 1;
  return r >= 1
    ? { width: longEdge, height: Math.round(longEdge / r) }
    : { width: Math.round(longEdge * r), height: longEdge };
}
// H.264 encoders require even dimensions. Keep the requested aspect ratio
// within one pixel, rather than failing on 9:16 at 720p (405px).
export function videoDimensions(ratio, longEdge) {
  const base = dimensions(ratio, longEdge);
  return {
    width: Math.max(2, Math.round(base.width / 2) * 2),
    height: Math.max(2, Math.round(base.height / 2) * 2),
  };
}
export function download(blob, name) {
  const a = document.createElement("a");
  const url = URL.createObjectURL(blob);
  a.href = url; a.download = name;
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 20000);
}
function hasFeedback(state) {
  return state.afterimage > 0 || state.datamosh > 0 ||
    state.engine === 15 || state.bioAmount > 0 ||
    (state.secondaryEngine === 15 && state.blend > 0);
}
export function clockAt(state, timeline, seconds) {
  return {
    time: Math.max(0, timeline.time + (state.freezeGeometry ? 0 : seconds * state.speed / 30)),
    colorTime: Math.max(0, timeline.colorTime + (state.freezeColor ? 0 : seconds * state.colorSpeed / 30)),
    textTime: Math.max(0, (timeline.textTime || 0) + seconds),
  };
}
// Use an identical deterministic short history before PNG, GIF and MP4.
// The live preview's accumulated GPU feedback cannot be cloned into a fresh
// renderer, but export should not start cold while PNG starts pre-warmed.
async function primeFrameHistory(renderer,state,timeline,size,signal){
  if(!hasFeedback(state))return;
  for(let i=5;i>=1;i--){
    checkExport(signal);
    if(!renderer.draw(state,clockAt(state,timeline,-i/20),size.width,size.height))
      throw artworkParityError("GPU context lost during feedback preparation");
    await waitForGraphics(renderer,signal);
  }
}
export async function renderImage(state, timeline, longEdge = 2160,
  type = "image/png", {exactEffects=true,compositeLettering=true,outputSize=null} = {}) {
  await waitForLetteringFonts(state);
  const canvas = document.createElement("canvas");
  let renderer;
  try {
    renderer = createRenderer(canvas,{exactEffects});
    // Encoder diagnostics can request the exact MP4 canvas dimensions,
    // including the one-pixel H.264 even-size rounding. The default PNG
    // resolution and its 1:1 / 9:16 export contract are unchanged.
    const { width, height } = outputSize || dimensions(state.ratio, longEdge);
    if(!Number.isInteger(width)||!Number.isInteger(height)||
       width<1||height<1||width>4096||height>4096)
      throw Error("Invalid exact-sized PNG reference dimensions.");
    await primeFrameHistory(renderer,state,timeline,{width,height});
    if(!renderer.draw(state, timeline, width, height))
      throw artworkParityError("GPU context lost during PNG capture");
    // PNG should wait for the exact same GPU fence used by GIF/MP4.
    // Otherwise toBlob may race a newly compiled/large shader frame.
    await waitForGraphics(renderer);
    // Rasterize the same type overlay used by the live preview onto exports.
    // In diagnostic-only compositeLettering:false mode, keep ALL glyph-driven
    // geometry in the WebGL shader while omitting ONLY the final 2D text layer.
    // Never mutate the recipe or disable Semantic Gravity to obtain a clean base.
    // The original WebGL pixels remain untouched when the recipe has no words.
    let output = canvas;
    if (compositeLettering && hasVisibleLettering(state)) {
      const composite = document.createElement("canvas");
      composite.width = width;
      composite.height = height;
      const ctx = composite.getContext("2d", { alpha: false });
      if (!ctx) throw Error("Canvas 2D is unavailable for lettering export.");
      ctx.drawImage(canvas, 0, 0);
      paintLettering(ctx, state, timeline, width, height);
      output = composite;
    }
    const blob = await new Promise((resolve, reject) =>
      output.toBlob(b => b ? resolve(b) : reject(Error("Image encoding failed.")), type, 0.9));
    if (output !== canvas) output.width = output.height = 1;
    return blob;
  } finally {
    renderer?.destroy(true);
    canvas.width = canvas.height = 1;
  }
}
export async function thumbnail(state, timeline) {
  // Thumbnails are previews, not downloadable originals; never block a
  // saved recipe merely because its tiny 240px preview needed a GPU fallback.
  const blob = await renderImage(state, timeline, 240, "image/jpeg",
    {exactEffects:false});
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(Error("Thumbnail unavailable."));
    reader.readAsDataURL(blob);
  });
}
export function nativeMp4Mime() {
  if (typeof MediaRecorder === "undefined" || typeof MediaRecorder.isTypeSupported !== "function")
    return null;
  for (const mime of ['video/mp4;codecs="avc1.42E01E"', "video/mp4;codecs=avc1.42E01E", "video/mp4"]) {
    try { if (MediaRecorder.isTypeSupported(mime)) return mime; } catch { /* unsupported */ }
  }
  return null;
}
export function videoFormat() {
  const webcodecs = typeof VideoEncoder !== "undefined" && typeof VideoFrame !== "undefined";
  return webcodecs || nativeMp4Mime() ? { mime: "video/mp4", extension: "mp4" } : null;
}
function checkExport(signal) {
  if (signal?.aborted) throw new DOMException("Rendering cancelled.", "AbortError");
  if (document.hidden) throw Error("Keep this tab visible during export.");
}
const yieldUI = () => new Promise(resolve => setTimeout(resolve, 0));
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, Math.max(0, ms)));
/** Wait for the frame's GPU fence before copying it into PNG, GIF or MP4.
 * Bounded, cancellable and shared between single-frame and video exports.
 * Rendering itself is not cancelled; its canvas is cleaned in the caller. */
export async function waitForGraphics(renderer, signal, timeoutMs=30000) {
  checkExport(signal);
  const start=performance.now();
  while(!renderer.ready()) {
    checkExport(signal);
    if(performance.now()-start>=timeoutMs)
      throw Error("The graphics processor timed out. Reduce export resolution or turn off a heavy effect.");
    await sleep(8);
  }
  checkExport(signal);
}
// A reusable, bounded renderer: only one RGBA frame, one WebGL canvas and one 2D canvas.
function createFrameWorkspace(state, timeline, size, signal,
  {fps=30,frameCount=180,loopMode="Off",loopBlendSeconds=.75}={}) {
  const canvas = document.createElement("canvas");
  const capture = document.createElement("canvas");
  capture.width = size.width; capture.height = size.height;
  const ctx = capture.getContext("2d", { alpha: false });
  if (!ctx) throw Error("Canvas 2D is unavailable for video capture.");
  let renderer;
  try { renderer = createRenderer(canvas,{exactEffects:true}); }
  catch (e) { capture.width = capture.height = 1; throw e; }
  const frame = ctx.createImageData(size.width, size.height);
  const bytes = new Uint8Array(size.width * size.height * 4);
  const stride = size.width * 4;
  const lettered = hasVisibleLettering(state);
  const closureFrames=loopClosureFrames(loopMode,loopBlendSeconds,fps,frameCount);
  // A single additional opaque canvas holds the exact FIRST composited
  // frame (shader effects AND text). No second GL context or simplified pass.
  const loopAnchor=closureFrames>0?document.createElement("canvas"):null;
  if(loopAnchor){loopAnchor.width=size.width;loopAnchor.height=size.height;}
  const loopContext=loopAnchor?.getContext("2d",{alpha:false});
  if(loopAnchor&&!loopContext)throw Error("Canvas2D loop closure is unavailable.");
  let historyPrimed=false,anchorSaved=false;
  async function render(seconds, includePixels = false) {
    checkExport(signal);
    if(!historyPrimed){
      await primeFrameHistory(renderer,state,timeline,size,signal);
      historyPrimed=true;
    }
    const frameClock = clockAt(state, timeline, seconds);
    if(!renderer.draw(state, frameClock, size.width, size.height))
      throw artworkParityError("GPU context lost during video capture");
    await waitForGraphics(renderer,signal);
    renderer.readFrame(bytes);
    for(let y=0;y<size.height;y++)
      frame.data.set(bytes.subarray((size.height-1-y)*stride,(size.height-y)*stride), y*stride);
    ctx.putImageData(frame,0,0);
    if (lettered) paintLettering(ctx, state, frameClock, size.width, size.height);
    const index=Math.min(frameCount-1,Math.max(0,Math.round(seconds*fps)));
    if(closureFrames>0 && index===0 && !anchorSaved){
      loopContext.drawImage(capture,0,0);
      anchorSaved=true;
    }
    const closureMix=loopClosureMix(index,frameCount,closureFrames);
    if(closureMix>0){
      if(!anchorSaved)
        throw artworkParityError("Soft loop anchor was never captured at frame zero");
      ctx.save();
      ctx.globalCompositeOperation="source-over";
      // Soft keeps the exact historical alpha crossfade. The other two
      // options reveal the same complete opening frame through a moving
      // spatial mask — NO fallback shader or missing special effects.
      if(loopMode==="Soft closure"||closureMix>=1){
        ctx.globalAlpha=loopMode==="Soft closure"?closureMix:1;
        ctx.drawImage(loopAnchor,0,0);
      }else if(loopMode==="Weft zipper"){
        const rectangles=weftRevealRects(size.width,size.height,closureMix);
        if(rectangles.length){
          ctx.beginPath();
          for(const rect of rectangles)
            ctx.rect(rect.x,rect.y,rect.width,rect.height);
          ctx.clip();
          ctx.drawImage(loopAnchor,0,0);
        }
      }else if(loopMode==="Iris portal"){
        const radius=irisRevealRadius(size.width,size.height,closureMix);
        ctx.beginPath();
        ctx.arc(size.width/2,size.height/2,radius,0,Math.PI*2);
        ctx.clip();
        ctx.drawImage(loopAnchor,0,0);
      }
      ctx.restore();
    }
    // GIF must quantize the ACTUAL post-closure pixels. Previous raw GPU
    // frame.data remains valid only when no letters and no loop blend exist.
    return includePixels && (lettered||closureMix>0)
      ?ctx.getImageData(0,0,size.width,size.height).data:frame.data;
  }
  function restoreFrame(pixels,includePixels=false) {
    checkExport(signal);
    if(!(pixels instanceof Uint8Array||pixels instanceof Uint8ClampedArray)||
       pixels.length!==frame.data.length)
      throw Error("Boomerang cached frame has invalid RGBA dimensions.");
    frame.data.set(pixels);
    ctx.putImageData(frame,0,0);
    return includePixels?frame.data:null;
  }
  function destroy() {
    renderer.destroy(true);
    canvas.width = canvas.height = 1;
    capture.width = capture.height = 1;
    if(loopAnchor)loopAnchor.width=loopAnchor.height=1;
  }
  return { capture, render, restoreFrame, destroy, hasClosure:closureFrames>0 };
}
/** Deterministic fixed-rate H.264 MP4. No WebM output or mislabeled codecs. */
async function encodeMp4WebCodecs(state, timeline, opts) {
  const { Output, Mp4OutputFormat, BufferTarget, CanvasSource, Quality, canEncodeVideo } = await import("mediabunny");
  const { fps, duration, bitrate, size, signal, onProgress,loopMode,loopBlendSeconds,playbackMode } = opts;
  const quality = new Quality({ bitrate });
  const supported = await canEncodeVideo("avc", {
    width: size.width, height: size.height, frameRate: fps, quality, latencyMode: "quality",
  });
  if (!supported) throw Error("H.264 WebCodecs encoding is unavailable.");
  let work, player, output, source, encoded = 0;
  try {
    checkExport(signal);
    work = createFrameWorkspace(state, timeline, size, signal,
      {fps,frameCount:Math.round(duration*fps),loopMode,loopBlendSeconds});
    player=createPlaybackFrames(work,{fps,frameCount:Math.round(duration*fps),playbackMode});
    const target = new BufferTarget();
    output = new Output({format: new Mp4OutputFormat(), target});
    source = new CanvasSource(work.capture, {
      codec: "avc", quality, latencyMode: "quality", contentHint: "detail",
      onEncodedPacket: () => encoded++,
    });
    output.addVideoTrack(source, {frameRate: fps});
    await output.start();
    const count = Math.round(duration * fps);
    for(let i=0;i<count;i++) {
      await player.render(i);
      await source.add(i / fps, 1 / fps);
      onProgress((i+1)/count);
      if(i%3===0)await yieldUI();
    }
    checkExport(signal);
    source.close();
    await output.finalize();
    if(encoded !== count) throw Error("MP4 encoder dropped frames. Try a smaller export.");
    return { blob:new Blob([target.buffer],{type:"video/mp4"}), extension:"mp4",
      mime:"video/mp4", seconds:duration, frames:count, fps, method:"h264" };
  } finally {
    if(output && output.state!=="finalized" && output.state!=="canceled")
      await output.cancel().catch(()=>{});
    player?.destroy();
    work?.destroy();
  }
}
/** Safari native H.264 recorder fallback when WebCodecs H.264 cannot encode.
 * Records in wall-clock time, unlike the deterministic WebCodecs path. */
async function encodeMp4Recorder(state, timeline, opts) {
  const {fps,duration,bitrate,size,signal,onProgress,loopMode,loopBlendSeconds,playbackMode}=opts;
  const mime=nativeMp4Mime();
  if(!mime)throw Error("This browser cannot encode H.264 MP4. Try current Safari or Chrome with hardware video encoding.");
  let work,player,recorder, stream;
  const chunks=[];
  try{
    work=createFrameWorkspace(state,timeline,size,signal,
      {fps,frameCount:Math.round(duration*fps),loopMode,loopBlendSeconds});
    player=createPlaybackFrames(work,{fps,frameCount:Math.round(duration*fps),playbackMode});
    if(typeof work.capture.captureStream!=="function")
      throw Error("This browser cannot record a canvas as MP4.");
    await player.render(0);
    stream=work.capture.captureStream(fps);
    recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:bitrate});
    const done=new Promise((resolve,reject)=>{
      recorder.addEventListener("dataavailable",e=>{if(e.data?.size)chunks.push(e.data);});
      recorder.addEventListener("error",e=>reject(e.error||Error("Native MP4 recorder failed.")));
      recorder.addEventListener("stop",resolve,{once:true});
    });
    recorder.start();
    const count=Math.round(duration*fps), start=performance.now();
    for(let i=0;i<count;i++){
      checkExport(signal);
      const target=start+i*1000/fps;
      if(performance.now()<target)await sleep(target-performance.now());
      // A native recorder pre-renders frame zero for captureStream.
      // In soft-closure mode we must not render it a second time: doing so
      // would advance feedback, making the saved loop anchor differ from the
      // actual first encoded frame. Legacy "Off" timing is unchanged.
      if(i>0)await player.render(i);
      // Preserve the untouched legacy Forward recorder behavior: only the
      // original Off mode used a redundant first render. For Boomerang the
      // exact first rendered frame has already been cached/captured.
      else if(playbackMode==="Forward"&&!work.hasClosure)
        await work.render(0);
      stream.getVideoTracks()[0]?.requestFrame?.();
      onProgress((i+1)/count);
    }
    checkExport(signal);
    await sleep(1000/fps);
    recorder.stop();
    await done;
    const blob=new Blob(chunks,{type:"video/mp4"});
    if(!blob.size || !recorder.mimeType.toLowerCase().startsWith("video/mp4"))
      throw Error("Native recorder did not produce a valid MP4 container.");
    return {blob,extension:"mp4",mime:"video/mp4",seconds:duration,frames:count,fps,method:"native"};
  } finally {
    if(recorder?.state==="recording")recorder.stop();
    stream?.getTracks().forEach(track=>track.stop());
    player?.destroy();
    work?.destroy();
  }
}
/** Locally encoded real animated GIF, with individually quantized color tables. */
async function encodeGif(state, timeline, opts) {
  const {GIFEncoder,quantize,applyPalette}=await import("./vendor/gifenc.js");
  const {fps,duration,size,signal,onProgress,loopMode,loopBlendSeconds,playbackMode}=opts;
  const work=createFrameWorkspace(state,timeline,size,signal,
    {fps,frameCount:Math.round(duration*fps),loopMode,loopBlendSeconds});
  const gif=GIFEncoder();
  const count=Math.round(duration*fps);
  const player=createPlaybackFrames(work,{fps,frameCount:count,playbackMode});
  try {
    for(let i=0;i<count;i++) {
      const rgba=await player.render(i,true);
      const palette=quantize(rgba,256,{format:"rgb565"});
      const indexed=applyPalette(rgba,palette,"rgb565");
      gif.writeFrame(indexed,size.width,size.height,{palette,delay:Math.round(1000/fps),repeat:0});
      onProgress((i+1)/count);
      await yieldUI();
    }
    checkExport(signal);
    gif.finish();
    return {blob:new Blob([gif.bytes()],{type:"image/gif"}),extension:"gif",
      mime:"image/gif",seconds:duration,frames:count,fps,method:"gif"};
  } finally { player.destroy();work.destroy(); }
}
export async function recordClip(state, timeline, {
  format="mp4", longEdge=720, duration=6, fps=30, bitrate=16000000,
  loopMode="Off",loopBlendSeconds=.75,playbackMode="Forward",
  onProgress=()=>{}, signal,
} = {}) {
  if(!["mp4","gif"].includes(format))throw Error("Only MP4 and GIF formats are available.");
  if(!Number.isFinite(duration)||duration<1||duration>30)throw Error("Clip duration must be 1–30 seconds.");
  if(!Number.isInteger(fps)||fps<10||fps>60)throw Error("Invalid frame rate.");
  if(!Number.isFinite(bitrate)||bitrate<1000000||bitrate>50000000)throw Error("Invalid bitrate.");
  if(!Number.isInteger(longEdge)||longEdge<240||longEdge>2160)throw Error("Invalid export resolution.");
  if(format==="gif" && (longEdge>1080||duration>10))
    throw Error("GIF is limited to 1080px and 10 seconds to protect mobile memory. Use MP4 for larger clips.");
  const size=format==="mp4"?videoDimensions(state.ratio,longEdge):dimensions(state.ratio,longEdge);
  // Validate before starting either encoder. "Off" performs zero extra
  // canvas work and remains byte-for-byte equivalent in the render path.
  loopClosureFrames(loopMode,loopBlendSeconds,fps,Math.round(duration*fps));
  if(playbackMode==="Boomerang"&&loopMode!=="Off")
    throw Error("Exact Boomerang and Loop Surgery are separate video modes. Choose Loop Surgery Off.");
  validateBoomerangCache(size,Math.round(duration*fps),playbackMode);
  const opts={fps,duration,bitrate,size,onProgress,signal,
    loopMode,loopBlendSeconds,playbackMode};
  checkExport(signal);
  // Export must NOT silently rasterize a fallback font while the chosen face
  // is still loading. This also applies to iPhone-native MP4 recording.
  await waitForLetteringFonts(state);
  checkExport(signal);
  if(format==="gif")return encodeGif(state,timeline,opts);
  let firstError;
  if(typeof VideoEncoder!=="undefined" && typeof VideoFrame!=="undefined") {
    try {return await encodeMp4WebCodecs(state,timeline,opts);}
    catch(e) {
      // H.264 fallback is okay; silently losing artwork is never okay.
      if(e.name==="AbortError" || isArtworkParityError(e))throw e;
      firstError=e;
    }
  }
  if(nativeMp4Mime()) {
    try {return await encodeMp4Recorder(state,timeline,opts);}
    catch(e) {
      // H.264 fallback is okay; silently losing artwork is never okay.
      if(e.name==="AbortError" || isArtworkParityError(e))throw e;
      firstError=e;
    }
  }
  throw Error("MP4 H.264 export isn't supported on this device" +
    (firstError ? ": " + firstError.message : ". Try Safari or Chrome with hardware encoding.") +
    " Your original artwork is unchanged. No WebM has been generated.");
}
