// Shader Vault Wave 8 — opt-in exact-resolution GPU preflight.
// Measures THIS browser's actual requested shader, not a guessed quality tier.
// Deliberately does not encode, decode or certify MP4/GIF frame accuracy.
import {createRenderer} from "./renderer.js";
import {clockAt,waitForGraphics} from "./export.js";
import {playbackTimeForMediaTime} from "./boomerang-playback.js";
import {artworkParityError} from "./export-parity.js";

export const STRESS_FRAME_FRACTIONS=[0,.17,.43,.71,.95];
const round=v=>Math.round(v*10)/10;

function validateSize(size){
  if(!size||!Number.isInteger(size.width)||!Number.isInteger(size.height)||
    size.width<1||size.height<1||size.width>4096||size.height>4096)
    throw Error("Shader stress test needs a valid 1–4096px frame size.");
}
function assertPresent(signal){
  if(signal?.aborted)throw new DOMException("Stress test cancelled.","AbortError");
  if(typeof document!=="undefined"&&document.hidden)
    throw Error("Keep this tab visible during shader stress testing.");
}
export function rgbaFrameMiB(size){
  validateSize(size);
  return round(size.width*size.height*4/1048576);
}
export function summarizeStressSamples(samples,fps=30){
  if(!Array.isArray(samples)||samples.length<2||
    samples.some(v=>!Number.isFinite(v)||v<0))
    throw Error("At least two valid measured frames are required.");
  if(!Number.isFinite(fps)||fps<=0||fps>120)
    throw Error("Target frame rate must be valid.");
  const ordered=[...samples].sort((a,b)=>a-b);
  const n=ordered.length;
  const median=n%2?ordered[(n-1)/2]:
    (ordered[n/2-1]+ordered[n/2])/2;
  const maximum=ordered[n-1],minimum=ordered[0],budget=1000/fps;
  const pressure=median>budget*2||maximum>budget*4?"very heavy":
    median>budget||maximum>budget*2?"heavy":"moderate";
  return {
    sampleCount:n,
    medianFrameMs:round(median),
    minimumFrameMs:round(minimum),
    maximumFrameMs:round(maximum),
    referenceFrameBudgetMs:round(budget),
    pressure
  };
}
/**
 * Strict WebGL shader-render preflight at the selected output resolution.
 * First frame pays the compilation/warm-up cost but is NOT included in
 * steady-state statistics. Four following frames advance the same export
 * clocks as actual MP4/GIF without encoding or modifying the user recipe.
 *
 * WebGL2 fences give meaningful draw+GPU completion latency. On WebGL1
 * renderer.ready() has no fence; the timing is submission-only and the
 * caller must not infer actual GPU performance from it.
 */
export async function runShaderStressPreflight(state,timeline,size,{
  fps=30,duration=6,playbackMode="Forward",signal,onSample=()=>{},
  createCanvas=()=>document.createElement("canvas"),
  createGpuRenderer=createRenderer,awaitGpu=waitForGraphics,
  now=()=>performance.now()
}={}){
  validateSize(size);
  if(!Number.isFinite(duration)||duration<1||duration>30)
    throw Error("Shader stress test duration must be 1–30 seconds.");
  if(!Number.isInteger(fps)||fps<10||fps>60)
    throw Error("Shader stress test fps must be 10–60.");
  assertPresent(signal);
  if(!state||!timeline)throw Error("A recipe and timeline are required.");
  const canvas=createCanvas();
  let renderer=null;
  const measured=[];
  const frameCount=Math.round(duration*fps);
  const sampledFrames=STRESS_FRAME_FRACTIONS.map(f=>
    Math.min(frameCount-1,Math.round((frameCount-1)*f)));
  const offsets=sampledFrames.map(index=>
    playbackTimeForMediaTime(index/fps,frameCount,fps,playbackMode));
  try{
    renderer=createGpuRenderer(canvas,{exactEffects:true});
    if(!renderer||typeof renderer.draw!=="function"||
      typeof renderer.ready!=="function")
      throw Error("The exact-effects GPU renderer is unavailable.");
    if(size.width>renderer.maxSize||size.height>renderer.maxSize)
      throw Error("This GPU supports at most "+renderer.maxSize+"px per side.");
    const backend=renderer.backend||"unknown";
    for(let i=0;i<offsets.length;i++){
      assertPresent(signal);
      const frameClock=clockAt(state,timeline,offsets[i]);
      const t0=now();
      if(!renderer.draw(state,frameClock,size.width,size.height))
        throw artworkParityError("GPU context lost during strict shader stress check");
      await awaitGpu(renderer,signal);
      assertPresent(signal);
      const elapsed=Math.max(0,now()-t0);
      if(i>0)measured.push(elapsed);
      onSample(i,offsets.length);
    }
    return {
      type:"glitchbitch-shader-stress-preflight",
      version:1,
      size:{...size},fps,duration,playbackMode,backend,
      frameBufferMiB:rgbaFrameMiB(size),
      ...summarizeStressSamples(measured,fps),
      // WebGL1 cannot signal real GPU completion. CPU submission can look
      // fast while the GPU is badly overloaded: never assign a safe tier.
      pressure:backend==="webgl2-fence"
        ?summarizeStressSamples(measured,fps).pressure:"GPU unmeasured",
      // No promise that timings imply export fidelity or codec availability.
      measurementScope:backend==="webgl2-fence"
        ?"Exact-effect shader draw through WebGL2 GPU fence, no video encoding"
        :"CPU submission/readiness timing only; GPU completion cannot be measured here",
      encodedOutputChecked:false,
      explanation:"Four sampled exact-effect source frames after warm-up, matched to selected clip duration and direction; not a sustained benchmark, encoder test, decoded-file comparison or guarantee of FPS."
    };
  }finally{
    try{renderer?.destroy(true);}finally{
      if(canvas){canvas.width=canvas.height=1;}
    }
  }
}
