/**
 * True Boomerang: reverse the ALREADY COMPOSITED source frames.
 * Unlike reversing shader time, this preserves nonreversible feedback,
 * Afterimage, Semantic Gravity, filaments, optics and authored lettering.
 * The cache has a strict cap because mobile Safari can die from RGBA OOM.
 */
export const PLAYBACK_MODES=["Forward","Boomerang"];
export const BOOMERANG_CACHE_LIMIT=128*1024*1024; // 128 MiB
export function boomerangFrameIndex(index,count){
  if(!Number.isInteger(count)||count<4||
     !Number.isInteger(index)||index<0||index>=count)
    throw Error("Boomerang needs a valid indexed clip with at least four frames.");
  // For even counts: 0,1,..,peak,..,2,1 (no duplicated turnaround).
  // For odd counts: 0,1,..,peak,peak,..,2,1 (one apex hold).
  // The final -> first wrap is always ONE real source-frame step.
  return Math.min(index,count-index);
}
export function playbackFrameSeconds(index,count,fps,mode="Forward"){
  if(!PLAYBACK_MODES.includes(mode))throw Error("Unknown animation playback mode.");
  if(!Number.isInteger(count)||count<4||
    !Number.isInteger(index)||index<0||index>=count||
    !Number.isFinite(fps)||fps<=0)
    throw Error("Invalid animation playback frame clock.");
  return (mode==="Boomerang"?boomerangFrameIndex(index,count):index)/fps;
}
export function playbackTimeForMediaTime(mediaSeconds,count,fps,mode="Forward"){
  if(!Number.isFinite(mediaSeconds))throw Error("Video timestamp must be finite.");
  const frame=Math.max(0,Math.min(count-1,Math.round(mediaSeconds*fps)));
  return playbackFrameSeconds(frame,count,fps,mode);
}
export function boomerangMemoryBytes(size,count,mode="Forward"){
  if(!PLAYBACK_MODES.includes(mode))throw Error("Unknown animation playback mode.");
  if(!size||!Number.isInteger(size.width)||!Number.isInteger(size.height)||
    size.width<1||size.height<1||!Number.isInteger(count)||count<4)
    throw Error("Invalid boomerang frame dimensions or duration.");
  // Frames 1..peak are retained, and discarded after their reverse use.
  const bytes=Math.floor(count/2)*size.width*size.height*4;
  if(!Number.isSafeInteger(bytes))throw Error("Boomerang cache size overflow.");
  return mode==="Boomerang"?bytes:0;
}
export function validateBoomerangCache(size,count,mode="Forward"){
  const bytes=boomerangMemoryBytes(size,count,mode);
  if(bytes>BOOMERANG_CACHE_LIMIT){
    const mb=Math.ceil(bytes/1048576);
    throw Error("Exact Boomerang would need about "+mb+
      " MiB of raw frames (128 MiB safety limit). Reduce video length, resolution or FPS. "+
      "Original artwork and untouched Forward export are still available.");
  }
  return bytes;
}
/**
 * A lightweight controller shared by both MP4 encoders and GIF.
 *
 * work.render(index / fps,true) captures the EXACT finished RGB+A canvas,
 * including 2D lettering. Reverse frames are reintroduced using
 * work.restoreFrame rather than rerendering a shader at a reversed clock.
 */
export function createPlaybackFrames(work,{fps,frameCount,playbackMode="Forward"}){
  if(!PLAYBACK_MODES.includes(playbackMode)||!Number.isFinite(fps)||fps<=0||
    !Number.isInteger(frameCount)||frameCount<4)
    throw Error("Invalid boomerang playback configuration.");
  const reverse=playbackMode==="Boomerang";
  const peak=Math.floor(frameCount/2);
  const cache=reverse?new Array(peak+1):null;
  let last=-1;
  async function render(index,includePixels=false){
    if(!Number.isInteger(index)||index!==last+1||index>=frameCount)
      throw Error("Boomerang frames must be rendered sequentially.");
    last=index;
    const source=reverse?boomerangFrameIndex(index,frameCount):index;
    if(!reverse)return work.render(index/fps,includePixels);
    if(index<=peak){
      const rgba=await work.render(source/fps,true);
      // Never hold a mutable workspace.data view: the next readFrame and GIF
      // palette quantization may overwrite it.
      if(source>0)cache[source]=new Uint8ClampedArray(rgba);
      return includePixels?rgba:null;
    }
    const sourceFrame=cache[source];
    if(!sourceFrame)throw Error("Missing exact reverse-frame cache at "+source);
    const result=work.restoreFrame(sourceFrame,includePixels);
    // The reverse traversal only needs each stored frame once, except the
    // odd-count apex which was stored to serve its one-frame hold.
    cache[source]=null;
    return result;
  }
  function destroy(){
    if(cache)cache.fill(null);
  }
  return {render,destroy,peak,mode:playbackMode,cached:reverse};
}
