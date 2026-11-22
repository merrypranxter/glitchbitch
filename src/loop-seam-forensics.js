/**
 * Loop Seam & Temporal Jump Scanner.
 *
 * Seven explicitly indexed frames from the user's ACTUAL saved GIF or MP4.
 * Quantifies last->first discontinuity against normal adjacent movement at
 * both ends, plus abrupt changes across two adjacent midpoint transitions.
 * Never changes, re-encodes, repairs or labels a loop "perfect".
 */
import {measureMotionFrames} from "./clip-motion-forensics.js";

const round=(n,d=2)=>Number(n.toFixed(d));
export function selectSeamSamples(frameCount,fps){
  if(!Number.isInteger(frameCount)||frameCount<7||
    !Number.isFinite(fps)||fps<=0)
    throw Error("Loop seam inspection needs seven or more encoded frames.");
  const last=frameCount-1,middle=Math.floor(last/2);
  return [
    {label:"Start",index:0},
    {label:"Start + 1",index:1},
    {label:"Middle - 1",index:middle-1},
    {label:"Middle",index:middle},
    {label:"Middle + 1",index:middle+1},
    {label:"End - 1",index:last-1},
    {label:"End",index:last}
  ].map(s=>({...s,seconds:s.index/fps}));
}
export function assessSeamDecoderTiming(frames,samples,format,fps){
  if(format==="gif")
    return {trust:"frame-index",warning:null};
  if(!Array.isArray(frames)||!Array.isArray(samples)||
    frames.length!==7||samples.length!==7)
    return {trust:"inconclusive",warning:"MP4 decoder did not return seven indexed frames."};
  const tolerance=Math.max(.11,2.5/Math.max(fps,10));
  for(let i=0;i<7;i++){
    const time=Number(frames[i]?.mediaTime);
    if(!Number.isFinite(time)||Math.abs(time-samples[i].seconds)>tolerance)
      return {trust:"inconclusive",warning:"MP4 seek time differs from the requested checkpoint."};
    if(i>0){
      const expected=samples[i].seconds-samples[i-1].seconds;
      const elapsed=time-Number(frames[i-1].mediaTime);
      if(!Number.isFinite(elapsed)||elapsed<
        Math.min(expected*.5,.5/Math.max(fps,10)))
        return {trust:"inconclusive",warning:"MP4 decoder timestamps did not advance reliably."};
    }
  }
  return {trust:"best-effort-media-time",warning:null};
}
export function analyzeSeamContinuity(frames,{format="gif",timing=null}={}){
  if(!Array.isArray(frames)||frames.length!==7)
    throw Error("Loop seam analysis requires seven decoded frames.");
  const movement=(a,b)=>measureMotionFrames(frames[a],frames[b],12);
  const open=movement(0,1),midBefore=movement(2,3);
  const midAfter=movement(3,4),close=movement(5,6);
  const wrap=movement(6,0);
  // The wrapped step represents one logical frame, not a jump over the whole
  // video. Compare against two actual one-frame transitions at the endpoints.
  const edgeBaseline=(open.meanRGBChange+close.meanRGBChange)/2;
  const seamRatio=wrap.meanRGBChange/Math.max(1.5,edgeBaseline);
  const possibleSeam=wrap.meanRGBChange>=12 &&
    seamRatio>=3 && wrap.changedPixelsPercent>=15;
  const midPeak=Math.max(midBefore.meanRGBChange,midAfter.meanRGBChange);
  const midCoverage=Math.max(midBefore.changedPixelsPercent,midAfter.changedPixelsPercent);
  // Midpoint acceleration may be a deliberate glitch. Only call it an
  // abrupt change and let the artist inspect the relevant two-frame pair.
  const possibleMidJump=midPeak>=24 &&
    midPeak/Math.max(2,edgeBaseline)>=3.5 && midCoverage>=20;
  const uncertain=timing?.trust==="inconclusive";
  let status;
  if(uncertain)status="Inconclusive: MP4 frame seeking was unreliable";
  else if(possibleSeam&&possibleMidJump)
    status="Possible loop snap and abrupt midpoint transition";
  else if(possibleSeam)status="Possible visible loop seam";
  else if(possibleMidJump)status="Abrupt midpoint transition (may be intentional)";
  else status="No strong boundary jump detected at sampled checkpoints";
  return {
    status,possibleSeam:!uncertain&&possibleSeam,
    possibleMidJump:!uncertain&&possibleMidJump,
    decodedTiming:timing?.trust||(format==="gif"?"frame-index":"unverified"),
    decodedTimingWarning:timing?.warning||null,
    testedAdjacentPairs:4,
    seamMeanRGB:wrap.meanRGBChange,
    seamChangedPixelsPercent:wrap.changedPixelsPercent,
    edgeBaselineRGB:round(edgeBaseline),
    seamToEdgeRatio:round(seamRatio,2),
    openingStep:open,endingStep:close,
    midpointBefore:midBefore,midpointAfter:midAfter,
    largestMidpointRGB:midPeak,
    notes:"The final-to-first seam is compared with ordinary one-frame motion at the clip boundaries; midpoint jumps may be deliberately glitchy. Lossy codecs, periodic motion and imprecise MP4 seeking limit certainty."
  };
}
export function seamForensicsReport({samples,frames,results,format,encoderMethod,
  seed,size,fps}){
  return {
    type:"glitchbitch-loop-seam-forensics",version:1,
    generatedAt:new Date().toISOString(),
    format,encoderMethod,seed,size,fps,
    checkpoints:samples.map((sample,i)=>({
      name:sample.label,index:sample.index,
      intendedShaderSeconds:round(sample.seconds,4),
      decodedMediaSeconds:round(Number(frames[i].mediaTime)||0,4)
    })),
    results,
    interpretation:"Seven real encoded frames were sampled at the start, middle and end. The wrap metric compares last->first with adjacent boundary-frame motion, not preview screenshots. Strong jumps are clues, not proof of broken encoding: intentional glitch motion, GIF 10ms delay rounding, H.264 compression, playback seeking and periodic patterns all matter. No original words, palette colors or image pixels are included."
  };
}
