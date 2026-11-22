/**
 * Encoded Frame Truth Serum.
 *
 * A visual comparison of the actual decoded GIF/MP4 against a newly rendered
 * same-clock, same-resolution strict PNG. The media must really be decoded:
 * shader path presence, encoder success and file extension do not count.
 *
 * This does NOT claim to prove the CSS preview or every video frame matches.
 * H.264 chroma subsampling, GIF palette quantization and video time sampling
 * can create legitimate pixel differences.
 */
export const auditMaxEdge=480;
function assertFrame(frame){
  if(!frame||!Number.isInteger(frame.width)||!Number.isInteger(frame.height)||
    frame.width<1||frame.height<1||
    !frame.data||frame.data.length!==frame.width*frame.height*4)
    throw Error("Frame-integrity check requires complete RGBA frames.");
}
export function analyzeEncodedFrame(reference,encoded,{format="mp4",threshold=36}={}){
  assertFrame(reference);assertFrame(encoded);
  if(reference.width!==encoded.width||reference.height!==encoded.height)
    throw Error("The encoded and PNG sample frames have different dimensions.");
  if(!Number.isFinite(threshold)||threshold<0||threshold>255)
    throw Error("Invalid frame-difference threshold.");
  const count=reference.width*reference.height;
  const stride=Math.max(1,Math.floor(count/80000));
  const bins=new Uint32Array(256);
  let sampled=0,changed=0,sumMax=0,sumChannels=0;
  let lossR=0,lossG=0,lossB=0,shifted=0;
  for(let px=0;px<count;px+=stride){
    const i=px*4;
    const dr=Math.abs(reference.data[i]-encoded.data[i]);
    const dg=Math.abs(reference.data[i+1]-encoded.data[i+1]);
    const db=Math.abs(reference.data[i+2]-encoded.data[i+2]);
    const maximum=Math.max(dr,dg,db);
    bins[maximum]++;
    sampled++;sumMax+=maximum;sumChannels+=dr+dg+db;
    lossR+=dr;lossG+=dg;lossB+=db;
    if(maximum>threshold)changed++;
    if(maximum>96)shifted++;
  }
  const percentile=p=>{
    const target=Math.ceil(sampled*p);
    let seen=0;
    for(let i=0;i<bins.length;i++){
      seen+=bins[i];
      if(seen>=target)return i;
    }
    return 255;
  };
  const round=(v,n=2)=>Number(v.toFixed(n));
  const meanRGB=round(sumChannels/(3*sampled));
  const pct=round(changed*100/sampled);
  const severePct=round(shifted*100/sampled);
  const p95=percentile(.95);
  // Deliberately descriptive, never a categorical pass/fail. Lossy codecs
  // may exceed these heuristics without losing a single shader effect.
  const discrepancy=meanRGB<7&&pct<7?"low":
    meanRGB<22&&pct<26?"moderate":"high";
  return {
    width:reference.width,height:reference.height,
    codec:format==="gif"?"GIF (palette-quantized)":"H.264 MP4 (lossy)",
    samples:sampled,threshold,
    meanRGBDifference:meanRGB,
    meanPeakChannelDifference:round(sumMax/sampled),
    pixelsOverThresholdPercent:pct,
    pixelsOver96Percent:severePct,
    p95PeakDifference:p95,
    averageChannelDifference:{
      red:round(lossR/sampled),green:round(lossG/sampled),blue:round(lossB/sampled)
    },
    discrepancy
  };
}
export function differenceHeatmap(reference,encoded){
  assertFrame(reference);assertFrame(encoded);
  if(reference.width!==encoded.width||reference.height!==encoded.height)
    throw Error("Cannot heatmap different frame dimensions.");
  const result=new Uint8ClampedArray(reference.width*reference.height*4);
  for(let i=0;i<result.length;i+=4){
    const delta=Math.max(
      Math.abs(reference.data[i]-encoded.data[i]),
      Math.abs(reference.data[i+1]-encoded.data[i+1]),
      Math.abs(reference.data[i+2]-encoded.data[i+2]));
    const lit=Math.min(255,Math.round(delta*4));
    result[i]=Math.max(11,lit);
    result[i+1]=Math.round(lit*.31);
    result[i+2]=Math.round(24+(255-lit)*.12);
    result[i+3]=255;
  }
  return {width:reference.width,height:reference.height,data:result};
}
function sampleImage(source,width,height,longEdge=auditMaxEdge){
  const scale=Math.min(1,longEdge/Math.max(width,height));
  const w=Math.max(1,Math.round(width*scale));
  const h=Math.max(1,Math.round(height*scale));
  const canvas=document.createElement("canvas");
  canvas.width=w;canvas.height=h;
  try{
    const ctx=canvas.getContext("2d",{willReadFrequently:true})||
      canvas.getContext("2d");
    if(!ctx)throw Error("Canvas2D frame inspection is unavailable.");
    ctx.drawImage(source,0,0,w,h);
    const data=ctx.getImageData(0,0,w,h).data;
    return {width:w,height:h,data,sourceWidth:width,sourceHeight:height};
  }finally{canvas.width=canvas.height=1;}
}
function promiseEvent(target,events,check,timeoutMs=12000){
  if(check())return Promise.resolve();
  return new Promise((resolve,reject)=>{
    let timer;
    const cleanup=()=>{
      clearTimeout(timer);
      for(const event of events)target.removeEventListener(event,verify);
      target.removeEventListener("error",fail);
    };
    const verify=()=>{if(check()){cleanup();resolve();}};
    const fail=()=>{cleanup();reject(Error("Media decoder could not open the recorded file."));};
    for(const event of events)target.addEventListener(event,verify);
    target.addEventListener("error",fail);
    timer=setTimeout(()=>{
      cleanup();reject(Error("Media decoder timed out on the recorded file."));
    },timeoutMs);
    verify();
  });
}
/** A PNG or the first GIF frame. Prefer createImageBitmap: it freezes animation. */
export async function decodeStaticExport(blob,longEdge=auditMaxEdge){
  if(!blob?.size)throw Error("The exported image file is empty.");
  let image=null,url=null,method="createImageBitmap";
  try{
    if(typeof createImageBitmap==="function"){
      try{image=await createImageBitmap(blob);}
      catch{image=null;}
    }
    if(!image){
      method="HTMLImageElement fallback (first-frame timing not guaranteed)";
      url=URL.createObjectURL(blob);
      image=new Image();
      image.src=url;
      if(typeof image.decode==="function")await image.decode();
      else await promiseEvent(image,["load"],()=>image.complete&&image.naturalWidth>0);
    }
    const width=image.naturalWidth||image.width;
    const height=image.naturalHeight||image.height;
    const frame=sampleImage(image,width,height,longEdge);
    return {...frame,mediaTime:0,decoder:method};
  }finally{
    image?.close?.();
    if(url)URL.revokeObjectURL(url);
  }
}
/**
 * Capture a *decoded* real MP4 frame from a hidden muted inline video element.
 * Native Safari may require muted playback to decode its first visible frame.
 * The actual video mediaTime is returned for matched-clock PNG rendering.
 */
export async function decodeMp4Export(blob,longEdge=auditMaxEdge){
  if(!blob?.size)throw Error("The exported MP4 file is empty.");
  const url=URL.createObjectURL(blob);
  const video=document.createElement("video");
  let attached=false;
  video.playsInline=true;video.muted=true;video.preload="auto";
  video.setAttribute("playsinline","");
  video.style.position="fixed";video.style.left="-9999px";
  video.style.top="0";video.style.width="1px";video.style.height="1px";
  video.style.pointerEvents="none";video.style.opacity="0";
  try{
    document.body.appendChild(video);attached=true;
    video.src=url;
    video.load();
    await promiseEvent(video,["loadedmetadata","loadeddata","canplay"],
      ()=>video.readyState>=video.HAVE_METADATA);
    if(!video.videoWidth||!video.videoHeight)
      throw Error("Recorded MP4 has no decodable video dimensions.");
    let mediaTime=0;
    let decoder="paused first frame";
    if(video.readyState<video.HAVE_CURRENT_DATA){
      decoder="first playable decoded video frame";
      // Register before play so no frame notification is missed.
      const first=new Promise((resolve,reject)=>{
        let timer;
        let frameId=null;
        const cleanup=()=>{
          clearTimeout(timer);
          if(frameId!==null)video.cancelVideoFrameCallback?.(frameId);
          video.removeEventListener("error",bad);
          video.removeEventListener("loadeddata",onLoaded);
        };
        const done=t=>{cleanup();resolve(t);};
        const bad=()=>{cleanup();reject(Error("MP4 video decoding failed."));};
        const onLoaded=()=>{
          if(typeof video.requestVideoFrameCallback!=="function")
            done(video.currentTime||0);
        };
        video.addEventListener("error",bad);
        if(typeof video.requestVideoFrameCallback==="function")
          frameId=video.requestVideoFrameCallback((_,meta)=>
            done(Number(meta?.mediaTime)||video.currentTime||0));
        else video.addEventListener("loadeddata",onLoaded);
        timer=setTimeout(()=>{
          cleanup();
          if(video.readyState>=video.HAVE_CURRENT_DATA)
            resolve(video.currentTime||0);
          else reject(Error("This browser could not decode an MP4 frame for inspection."));
        },12000);
        if(typeof video.requestVideoFrameCallback!=="function"&&
          video.readyState>=video.HAVE_CURRENT_DATA)done(video.currentTime||0);
      });
      try{await video.play();}
      catch(e){first.catch(()=>{});throw Error("Safari cannot play the muted MP4 for frame inspection: "+e.message);}
      mediaTime=await first;
      video.pause();
    }
    if(video.readyState<video.HAVE_CURRENT_DATA)
      await promiseEvent(video,["loadeddata","canplay","seeked"],
        ()=>video.readyState>=video.HAVE_CURRENT_DATA);
    const frame=sampleImage(video,video.videoWidth,video.videoHeight,longEdge);
    return {...frame,mediaTime,decoder};
  }finally{
    video.pause();video.removeAttribute("src");video.load();
    if(attached)video.remove();
    URL.revokeObjectURL(url);
  }
}
export async function frameBlob(frame,type="image/png"){
  assertFrame(frame);
  const c=document.createElement("canvas");
  c.width=frame.width;c.height=frame.height;
  try{
    const ctx=c.getContext("2d");
    if(!ctx)throw Error("Cannot present the decoded frame comparison.");
    ctx.putImageData(new ImageData(new Uint8ClampedArray(frame.data),
      frame.width,frame.height),0,0);
    return await new Promise((resolve,reject)=>c.toBlob(
      b=>b?resolve(b):reject(Error("Diagnostic image encoding failed.")),type));
  }finally{c.width=c.height=1;}
}
export function frameAuditReport({metrics,mediaTime,decoder,encoderMethod,
  requestedSize,actualSize,format,seed}){
  return {
    type:"glitchbitch-encoded-frame-truth-serum",version:1,
    generatedAt:new Date().toISOString(),
    format,encoderMethod,decoder,
    firstDecodedFrameSeconds:Number((mediaTime||0).toFixed(4)),
    requestedSize,actualSize,seed,
    metrics,
    interpretation:"This compares one decoded real GIF/MP4 frame against a separate strict-effects PNG render at its reported media time. H.264 compression, GIF quantization, native recorder timing and accumulated feedback can produce legitimate differences. This does not certify the live CSS preview or every frame. No user's words, pixel arrays or palette colors are included."
  };
}
