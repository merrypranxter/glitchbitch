/**
 * Loop Surgery — artist-controlled composited closure to the first frame.
 *
 * Works on complete WebGL + Canvas2D composited frames, not a simplified
 * shader or a fake "seamless" timebase. Opt-in and never alters the recipe.
 * The last SOURCE frame equals the saved first SOURCE frame, while lossy
 * H.264/GIF playback and temporal velocity can still reveal a transition.
 */
export const LOOP_MODES=["Off","Soft closure","Weft zipper","Iris portal","Quilt Reassembly","Clockwork Sweep","Crystal Bloom"];
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

/**
 * Spatial-reveal masks for *fully composited* video. These do not alter any
 * shader, typography, palette or feedback simulation. Only the rasterized
 * opening frame is revealed through Canvas2D clipping at the tail.
 */
function clamp01(value){return Math.max(0,Math.min(1,value));}
export function weftRevealRects(width,height,mix){
  if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||
     !Number.isFinite(mix)||mix<0||mix>1)throw Error("Invalid weave loop mask.");
  const bandCount=Math.min(48,Math.max(8,Math.round(height/36)));
  const rectangles=[];
  for(let row=0;row<bandCount;row++){
    const y0=Math.floor(row*height/bandCount);
    const y1=Math.floor((row+1)*height/bandCount);
    if(y1<=y0)continue;
    // Stagger rows with a tiny deterministic phase so alternating strips
    // braid into place without injecting random seed or hidden pixels.
    const stagger=((row*7)%11)/10*.13;
    const t=clamp01((mix-stagger)/(1-stagger));
    const eased=t*t*(3-2*t);
    const w=Math.min(width,Math.max(0,Math.round(width*eased)));
    if(w>0)rectangles.push({
      x:row%2===0?0:width-w,
      y:y0,width:w,height:y1-y0,row
    });
  }
  return rectangles;
}
export function irisRevealRadius(width,height,mix){
  if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||
     !Number.isFinite(mix)||mix<0||mix>1)throw Error("Invalid iris loop mask.");
  // Expanded beyond the farthest corner to account for Canvas2D antialiasing.
  return mix*Math.hypot(width,height)*.5+ (mix>0?2*mix:0);
}


/**
 * Loop Surgery III: deterministic spatial masks. They reveal the real,
 * post-text, post-optics first frame and do NOT change any shader state.
 * No per-frame random values, persistent mask buffers or extra WebGL.
 */
function validateLoopMask(width,height,mix){
  if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||
    !Number.isFinite(mix)||mix<0||mix>1)
    throw Error("Invalid loop surgery mask dimensions or progress.");
}
function easeLoopMask(x){x=clamp01(x);return x*x*(3-2*x);}
export function quiltReassemblyTiles(width,height,mix){
  validateLoopMask(width,height,mix);
  const cols=Math.min(width,Math.min(12,Math.max(4,Math.round(width/88))));
  const rows=Math.min(height,Math.min(16,Math.max(4,Math.round(height/80))));
  const result=[];
  for(let row=0;row<rows;row++){
    const y0=Math.floor(row*height/rows),y1=Math.floor((row+1)*height/rows);
    for(let col=0;col<cols;col++){
      const x0=Math.floor(col*width/cols),x1=Math.floor((col+1)*width/cols);
      // A reproducible checkerboard scramble. Tiles grow from their center
      // with slightly different arrival times, as if sewn into place.
      const arrival=((row*11+col*17+(row^col)*7)%23)/22*.48;
      const t=easeLoopMask((mix-arrival)/(1-arrival));
      const w=Math.max(0,Math.round((x1-x0)*t));
      const h=Math.max(0,Math.round((y1-y0)*t));
      if(w===0||h===0)continue;
      result.push({
        x:x0+Math.floor((x1-x0-w)/2),
        y:y0+Math.floor((y1-y0-h)/2),
        width:w,height:h,row,col
      });
    }
  }
  return result;
}
export function clockworkSweep(width,height,mix){
  validateLoopMask(width,height,mix);
  const cx=width/2,cy=height/2;
  return {
    cx,cy,
    radius:Math.hypot(width,height)/2+2,
    start:-Math.PI/2,
    end:-Math.PI/2+2*Math.PI*easeLoopMask(mix)
  };
}
export function crystalBloomDiamonds(width,height,mix){
  validateLoopMask(width,height,mix);
  const cols=Math.min(width,Math.min(9,Math.max(3,Math.round(width/120))));
  const rows=Math.min(height,Math.min(12,Math.max(3,Math.round(height/120))));
  const result=[];
  for(let row=0;row<rows;row++){
    const y0=row*height/rows,y1=(row+1)*height/rows;
    for(let col=0;col<cols;col++){
      const x0=col*width/cols,x1=(col+1)*width/cols;
      // Bloom from the center outward in mirrored crystalline rings.
      const nx=(col+.5)/cols-.5,ny=(row+.5)/rows-.5;
      const arrival=Math.hypot(nx,ny)/Math.SQRT1_2*.4;
      const growth=easeLoopMask((mix-arrival)/(1-arrival));
      if(growth<=0)continue;
      const cx=(x0+x1)/2,cy=(y0+y1)/2;
      result.push({
        cx,cy,rx:(x1-x0)*growth,ry:(y1-y0)*growth,row,col
      });
    }
  }
  return result;
}
