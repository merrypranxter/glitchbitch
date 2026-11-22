/**
 * Soft Loop Closure — compositing a finite, artist-controlled fade to frame 0.
 *
 * Works on complete WebGL + Canvas2D composited frames, not a simplified
 * shader or a fake "seamless" timebase. Opt-in and never alters the recipe.
 * The last SOURCE frame equals the saved first SOURCE frame, while lossy
 * H.264/GIF playback and temporal velocity can still reveal a transition.
 */
export const LOOP_MODES=["Off","Soft closure"];
export const LOOP_BLEND_SECONDS=[0.25,0.5,0.75,1,1.5,2];
export function loopClosureFrames(mode,seconds,fps,count){
  if(!LOOP_MODES.includes(mode))throw Error("Unknown video loop closure mode.");
  if(!Number.isFinite(seconds)||seconds<.25||seconds>2)
    throw Error("Loop closure duration must be between 0.25 and 2 seconds.");
  if(!Number.isInteger(fps)||fps<10||fps>60||
    !Number.isInteger(count)||count<4)
    throw Error("Loop closure needs a real fixed-rate encoded clip.");
  if(mode==="Off")return 0;
  // Preserve an opening segment and leave at least one original movement
  // frame before the blend. Even a two-second test clip remains usable.
  return Math.max(2,Math.min(count-2,Math.round(seconds*fps)));
}
export function loopClosureMix(index,count,closureFrames){
  if(!Number.isInteger(index)||!Number.isInteger(count)||
     !Number.isInteger(closureFrames)||index<0||index>=count||
     closureFrames<0||closureFrames>Math.max(0,count-2))
    throw Error("Invalid loop frame index or blend window.");
  if(closureFrames===0)return 0;
  const start=count-closureFrames;
  if(index<start)return 0;
  const t=(index-start)/Math.max(1,count-1-start);
  // Smoothstep keeps the onset and tail of the crossfade gentle, and makes
  // the last source frame exactly identical to the first source frame.
  return t*t*(3-2*t);
}
