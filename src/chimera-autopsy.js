// Wave 9: optional Chimera Autopsy — performance ablations, never art edits.
import {createRenderer} from "./renderer.js";
import {clockAt,waitForGraphics} from "./export.js";
import {playbackTimeForMediaTime} from "./boomerang-playback.js";
import {breedActive} from "./crossbreed-lab.js";
import {summarizeStressSamples,rgbaFrameMiB} from "./shader-stress-preflight.js";
import {artworkParityError} from "./export-parity.js";

export const AUTOPSY_MAX_EDGE=720;
export const AUTOPSY_FRAMES=[0,.37,.83]; // first warms each specialized shader.
export const AUTOPSY_PARENTS=[
  {key:"hexagramAmount",id:"hexagram",label:"Hexagram Terraces"},
  {key:"polesAmount",id:"poles",label:"Complex Poles & Zeros"},
  {key:"qdAmount",id:"quasicrystal",label:"Quasicrystal Dissolution"},
  {key:"vldAmount",id:"velvet",label:"Living Velvet Damask"},
  {key:"hcrAmount",id:"crochet",label:"Hyperbolic Crochet"}
];
const round=x=>Math.round(x*10)/10;
const positiveInteger=n=>Number.isInteger(n)&&n>0;
export function autopsySize(size,maxEdge=AUTOPSY_MAX_EDGE){
  if(!size||!positiveInteger(size.width)||!positiveInteger(size.height)||
    !Number.isFinite(maxEdge)||maxEdge<64||maxEdge>1080)
    throw Error("Autopsy requires valid output dimensions and a bounded size limit.");
  const scale=Math.min(1,maxEdge/Math.max(size.width,size.height));
  return {width:Math.max(1,Math.round(size.width*scale)),
    height:Math.max(1,Math.round(size.height*scale))};
}
export function makeAutopsyPlan(state){
  if(!state)throw Error("No artwork recipe to inspect.");
  const enabled=AUTOPSY_PARENTS.filter(p=>Number(state[p.key])>0);
  if(enabled.length===0)return [];
  const parents={...state,breedAmount:0};
  const hasChild=breedActive(state);
  const plan=hasChild?[{id:"original",label:"Complete original art",
    role:"full",state:{...state}}]:[];
  plan.push({id:"parents",label:"All active parents, child off",
    role:"anchor",state:parents});
  for(const p of enabled)plan.push({
    id:"without-"+p.id,label:"Without "+p.label,role:"parent",
    parentId:p.id,parentLabel:p.label,state:{...parents,[p.key]:0}
  });
  plan.push({id:"repeat",label:"Parents repeated (thermal drift check)",
    role:"repeat",state:{...parents}});
  return plan;
}
export function analyzeAutopsyRows(rows,backend){
  if(!Array.isArray(rows)||rows.length<3)
    throw Error("Autopsy needs its reference and repeat samples.");
  const anchor=rows.find(r=>r.id==="parents");
  const repeat=rows.find(r=>r.id==="repeat");
  if(!anchor||!repeat)throw Error("Missing autopsy anchor or drift control.");
  const base=anchor.medianFrameMs;
  const drift=round(repeat.medianFrameMs-base);
  const driftLimit=Math.max(3,base*.2);
  const stable=Math.abs(drift)<=driftLimit;
  const gpuMeasured=backend==="webgl2-fence";
  const comparisons=rows.filter(r=>r.role==="parent").map(r=>{
    const saved=round(base-r.medianFrameMs);
    const percent=base>0?round(saved/base*100):null;
    const threshold=Math.max(2,base*.12,Math.abs(drift)*1.5);
    const interpretation=!gpuMeasured?"GPU timing unavailable":
      !stable?"inconclusive: device drift":
      saved>threshold?"possible performance contributor":
      saved<(-threshold)?"removal measured slower":"no clear difference";
    return {id:r.parentId,label:r.parentLabel,
      withoutMedianMs:r.medianFrameMs,
      observedReductionMs:saved,
      observedReductionPercent:percent,interpretation};
  });
  const full=rows.find(r=>r.id==="original");
  const child=full?{
    observedReductionMs:round(full.medianFrameMs-base),
    observedReductionPercent:base>0?round((full.medianFrameMs-base)/base*100):null,
    interpretation:!gpuMeasured?"GPU timing unavailable":
      !stable?"inconclusive: device drift":"with vs without child (not a causal proof)"
  }:null;
  return {stable,gpuMeasured,driftMs:drift,
    anchorMedianMs:base,child,comparisons};
}
function checkStopped(signal){
  if(signal?.aborted)throw new DOMException("Autopsy cancelled.","AbortError");
  if(typeof document!=="undefined"&&document.hidden)
    throw Error("Keep this tab visible while profiling shaders.");
}
/**
 * Sequential, independent-program GPU ablation samples.
 * All variants are EPHEMERAL shallow clones. Never pass them to history.
 * One fresh context, at most 720px, three frames per variant, with each
 * first frame excluded as compile/warmup. No encoder, media readback or copies.
 * Deltas are descriptive: shader order, caching and thermal drift still vary.
 */
export async function runChimeraAutopsy(state,timeline,requestedSize,{
  fps=30,duration=6,playbackMode="Forward",
  signal,onVariant=()=>{},
  createCanvas=()=>document.createElement("canvas"),
  createGpuRenderer=createRenderer,awaitGpu=waitForGraphics,
  now=()=>performance.now(),
  yieldToBrowser=()=>new Promise(resolve=>setTimeout(resolve,0))
}={}){
  const size=autopsySize(requestedSize);
  if(!timeline)throw Error("Autopsy needs an animation timeline.");
  if(!Number.isInteger(fps)||fps<10||fps>60||
     !Number.isFinite(duration)||duration<1||duration>30||
     !["Forward","Boomerang"].includes(playbackMode))
    throw Error("Invalid Autopsy FPS, duration or playback mode.");
  const plan=makeAutopsyPlan(state);
  if(plan.length===0)throw Error("Enable at least one of the five Shader Vault parent effects first.");
  checkStopped(signal);
  const canvas=createCanvas();
  let renderer=null;
  const count=Math.round(duration*fps),samples=[];
  const offsets=AUTOPSY_FRAMES.map(f=>{
    const index=Math.min(count-1,Math.round((count-1)*f));
    return playbackTimeForMediaTime(index/fps,count,fps,playbackMode);
  });
  try{
    renderer=createGpuRenderer(canvas,{exactEffects:true});
    if(!renderer||!positiveInteger(renderer.maxSize)||
      size.width>renderer.maxSize||size.height>renderer.maxSize)
      throw Error("This GPU cannot profile at the selected diagnostic resolution.");
    const backend=renderer.backend||"unknown";
    for(let index=0;index<plan.length;index++){
      checkStopped(signal);
      const variant=plan[index];
      // Reset only the throwaway rendering context, never the live artwork.
      renderer.resetFeedback?.();
      renderer.resetBiology?.();
      const timings=[];
      for(let frame=0;frame<offsets.length;frame++){
        checkStopped(signal);
        const frameTime=clockAt(variant.state,timeline,offsets[frame]);
        const start=now();
        if(!renderer.draw(variant.state,frameTime,size.width,size.height))
          throw artworkParityError("GPU context lost during shader autopsy");
        await awaitGpu(renderer,signal);
        checkStopped(signal);
        if(frame>0)timings.push(Math.max(0,now()-start));
      }
      const metrics=summarizeStressSamples(timings,fps);
      samples.push({id:variant.id,role:variant.role,label:variant.label,
        parentId:variant.parentId,parentLabel:variant.parentLabel,
        medianFrameMs:metrics.medianFrameMs,
        maximumFrameMs:metrics.maximumFrameMs});
      onVariant(index+1,plan.length,variant.label);
      // Let the cancel button and Safari UI update between experiments.
      await yieldToBrowser();
    }
    checkStopped(signal);
    return {
      type:"glitchbitch-chimera-autopsy",version:1,
      backend,size,requestedSize:{...requestedSize},fps,duration,playbackMode,
      frameBufferMiB:rgbaFrameMiB(size),
      threeFramesPerVariant:true,
      rows:samples.map(({parentId,parentLabel,...publicRow})=>publicRow),
      ...analyzeAutopsyRows(samples,backend),
      encodedOutputChecked:false,
      interpretation:"Observed changes after disabling one family at a time, with the crossbreed child disabled for parent comparisons. Compilation is excluded; results vary with GPU, thermal state and shader interactions. This does not measure encoded video or prove a causal speedup."
    };
  }finally{
    try{renderer?.destroy(true);}finally{
      canvas.width=canvas.height=1;
    }
  }
}
