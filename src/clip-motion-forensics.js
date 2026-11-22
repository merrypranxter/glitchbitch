/**
 * Full Clip Motion Forensics. The exported encoded frames are the witnesses.
 * This module never re-encodes the video, guesses PNG timestamps from playback
 * wall time, or declares perfect preview / all-frame parity.
 */
import {analyzeEncodedFrame,auditMaxEdge} from "./encoded-frame-truth-serum.js";

const round=(v,n=2)=>Number(v.toFixed(n));
export function selectMotionSamples(frameCount,fps){
  if(!Number.isInteger(frameCount)||frameCount<3||
     !Number.isFinite(fps)||fps<=0)throw Error("Need at least three valid encoded frames.");
  const last=frameCount-1;
  const indices=[0,Math.floor(last/2),last];
  return indices.map((index,i)=>({
    label:["Opening","Middle","Final"][i],
    index,seconds:index/fps
  }));
}
export function measureMotionFrames(a,b,threshold=12){
  const result=analyzeEncodedFrame(a,b,{threshold});
  return {
    meanRGBChange:result.meanRGBDifference,
    changedPixelsPercent:result.pixelsOverThresholdPercent,
    p95Change:result.p95PeakDifference
  };
}
export function analyzeClipMotion(referenceFrames,encodedFrames){
  if(!Array.isArray(referenceFrames)||!Array.isArray(encodedFrames)||
    referenceFrames.length!==3||encodedFrames.length!==3)
    throw Error("Full-clip comparison requires exactly three PNG and encoded frames.");
  const perFrame=referenceFrames.map((ref,i)=>
    analyzeEncodedFrame(ref,encodedFrames[i],{threshold:36}));
  const steps=[0,1].map(i=>{
    const expected=measureMotionFrames(referenceFrames[i],referenceFrames[i+1]);
    const actual=measureMotionFrames(encodedFrames[i],encodedFrames[i+1]);
    return {between:i===0?"Opening → Middle":"Middle → Final",
      reference:expected,encoded:actual,
      retention:expected.meanRGBChange>0?
        round(actual.meanRGBChange/expected.meanRGBChange,3):null
    };
  });
  const refMean=(steps[0].reference.meanRGBChange+steps[1].reference.meanRGBChange)/2;
  const encMean=(steps[0].encoded.meanRGBChange+steps[1].encoded.meanRGBChange)/2;
  const refAffected=(steps[0].reference.changedPixelsPercent+
    steps[1].reference.changedPixelsPercent)/2;
  const actualAffected=(steps[0].encoded.changedPixelsPercent+
    steps[1].encoded.changedPixelsPercent)/2;
  const expectedToMove=refMean>=5 && refAffected>=8;
  const suspicious=expectedToMove &&
    ((encMean<Math.max(1.8,refMean*.17)&&actualAffected<refAffected*.22)||
      (encMean<1.3&&refMean>=9));
  return {
    status:!expectedToMove?"No reliable motion expected from these PNG samples":
      suspicious?"Possible frozen or lost encoded motion":
      "Motion detected in the encoded samples",
    expectedMotion:expectedToMove,
    possibleMotionLoss:suspicious,
    referenceMeanRGBMotion:round(refMean),
    encodedMeanRGBMotion:round(encMean),
    motionRetention:expectedToMove?round(encMean/refMean,3):null,
    samplesCompared:3,betweenSamples:steps,
    frameDifferences:perFrame.map((metric,i)=>({
      label:["Opening","Middle","Final"][i],
      meanRGBDifference:metric.meanRGBDifference,
      pixelsOverThresholdPercent:metric.pixelsOverThresholdPercent,
      p95PeakDifference:metric.p95PeakDifference,
      discrepancy:metric.discrepancy
    }))
  };
}
function read16(data,p){return data[p]|data[p+1]<<8;}
function takeSubBlocks(data,start,collect){
  const blocks=[];let p=start,length=0;
  while(p<data.length){
    const len=data[p++];
    if(len===0){
      if(!collect)return {next:p};
      const bytes=new Uint8Array(length);let n=0;
      for(const block of blocks){bytes.set(block,n);n+=block.length;}
      return {next:p,bytes};
    }
    if(p+len>data.length)throw Error("GIF sub-block extends beyond the file.");
    if(collect){blocks.push(data.subarray(p,p+len));length+=len;}
    p+=len;
  }
  throw Error("GIF sub-block is truncated.");
}
function gifLzw(bytes,minCodeSize,count){
  if(minCodeSize<2||minCodeSize>8)throw Error("Unsupported GIF LZW code size.");
  const clear=1<<minCodeSize,end=clear+1;
  const prefix=new Int16Array(4096),suffix=new Uint8Array(4096);
  const stack=new Uint8Array(4097),pixels=new Uint8Array(count);
  let bit=0,codeSize=minCodeSize+1,next=end+1,previous=-1,first=0,written=0;
  const read=()=>{
    if(bit+codeSize>bytes.length*8)return -1;
    const bi=bit>>3,shift=bit&7;
    const word=(bytes[bi]||0)|((bytes[bi+1]||0)<<8)|((bytes[bi+2]||0)<<16);
    bit+=codeSize;
    return (word>>shift)&((1<<codeSize)-1);
  };
  let iteration=0;
  while(written<count && bit<bytes.length*8){
    if(++iteration>count*4+4096)throw Error("GIF LZW expansion exceeded a safe bound.");
    let code=read();
    if(code===-1)break;
    if(code===clear){codeSize=minCodeSize+1;next=end+1;previous=-1;continue;}
    if(code===end)break;
    const received=code;let top=0;
    if(code>=next){
      if(code!==next||previous<0)throw Error("Corrupt GIF LZW dictionary.");
      stack[top++]=first;code=previous;
    }
    let guard=0;
    while(code>=clear){
      if(code>=next||++guard>4096)throw Error("Invalid GIF LZW prefix chain.");
      stack[top++]=suffix[code];
      code=prefix[code];
    }
    first=code;
    stack[top++]=first;
    while(top){
      if(written>=count)throw Error("GIF frame has more pixels than expected.");
      pixels[written++]=stack[--top];
    }
    if(previous>=0&&next<4096){
      prefix[next]=previous;
      suffix[next]=first;
      next++;
      if(next===1<<codeSize&&codeSize<12)codeSize++;
    }
    previous=received;
  }
  if(written!==count)throw Error("GIF frame did not contain all expected pixels.");
  return pixels;
}
/**
 * Decode independent full-canvas, noninterlaced frames written by our bundled
 * gifenc encoder. Refuse unfamiliar disposal/subrect layouts instead of
 * presenting a silently wrong multi-frame comparison.
 */
export function decodeOwnGifSamples(bytes,indices){
  if(!(bytes instanceof Uint8Array)||bytes.length<20||
     String.fromCharCode(...bytes.subarray(0,3))!=="GIF")
    throw Error("Not a supported GIF89a animation.");
  if(!Array.isArray(indices)||indices.length!==3||
     indices.some(n=>!Number.isInteger(n)||n<0)||new Set(indices).size!==3)
    throw Error("Select three unique GIF frame indices.");
  const width=read16(bytes,6),height=read16(bytes,8);
  if(!width||!height||width>1080||height>1080)
    throw Error("GIF motion audit supports frames up to 1080px.");
  const packed=bytes[10],hasGct=!!(packed&128);
  let pos=13;
  const readColors=length=>{
    const palette=bytes.subarray(pos,pos+length*3);
    if(palette.length!==length*3)throw Error("GIF color palette is incomplete.");
    pos+=length*3;return palette;
  };
  const globalColors=hasGct?readColors(1<<((packed&7)+1)):null;
  const selected=new Map();
  const selectedSet=new Set(indices);
  let frameIndex=0,displayTime=0,delay=0,transparency=false,disposal=0;
  while(pos<bytes.length){
    const token=bytes[pos++];
    if(token===0x3b)break;
    if(token===0x21){
      const label=bytes[pos++];
      if(label===0xf9){
        const count=bytes[pos++];
        if(count!==4||pos+count>=bytes.length)throw Error("Invalid GIF frame control.");
        const flags=bytes[pos];
        disposal=(flags>>2)&7;
        transparency=!!(flags&1);
        delay=read16(bytes,pos+1)*.01;
        pos+=count+1; // Skip control bytes and zero terminator.
      }else{
        const block=takeSubBlocks(bytes,pos,false);
        pos=block.next;
      }
      continue;
    }
    if(token!==0x2c)throw Error("Unexpected GIF image block.");
    if(pos+9>bytes.length)throw Error("GIF frame descriptor is truncated.");
    const left=read16(bytes,pos),top=read16(bytes,pos+2);
    const w=read16(bytes,pos+4),h=read16(bytes,pos+6),flags=bytes[pos+8];
    pos+=9;
    if(left!==0||top!==0||w!==width||h!==height||
       (flags&64)||transparency||disposal>1)
      throw Error("Animated GIF uses partial, interlaced or transparent frames; this audit only supports Glitchbitch's full-frame GIF output.");
    const colors=(flags&128)?readColors(1<<((flags&7)+1)):globalColors;
    if(!colors)throw Error("GIF frame has no color table.");
    if(pos>=bytes.length)throw Error("Missing GIF LZW data.");
    const minCodeSize=bytes[pos++],wanted=selectedSet.has(frameIndex);
    const compressed=takeSubBlocks(bytes,pos,wanted);pos=compressed.next;
    if(wanted){
      const index=gifLzw(compressed.bytes,minCodeSize,width*height);
      const rgba=new Uint8ClampedArray(width*height*4);
      for(let i=0;i<index.length;i++){
        const j=index[i]*3;
        if(j+2>=colors.length)throw Error("GIF pixel references a missing palette color.");
        rgba[4*i]=colors[j];rgba[4*i+1]=colors[j+1];
        rgba[4*i+2]=colors[j+2];rgba[4*i+3]=255;
      }
      selected.set(frameIndex,{width,height,data:rgba,index:frameIndex,
        encodedDisplayTime:displayTime,encodedDisplayDuration:delay,
        decoder:"Glitchbitch full-frame GIF LZW"});
    }
    displayTime+=delay;
    frameIndex++;delay=0;transparency=false;disposal=0;
  }
  if(selected.size!==3)throw Error("GIF file is missing one or more requested animation frames.");
  return indices.map(index=>selected.get(index));
}
export function downsampleFrame(frame,longEdge=auditMaxEdge){
  const ratio=Math.min(1,longEdge/Math.max(frame.width,frame.height));
  const w=Math.max(1,Math.round(frame.width*ratio)),h=Math.max(1,Math.round(frame.height*ratio));
  const input=document.createElement("canvas"),output=document.createElement("canvas");
  input.width=frame.width;input.height=frame.height;
  output.width=w;output.height=h;
  try{
    const a=input.getContext("2d"),b=output.getContext("2d",{willReadFrequently:true});
    if(!a||!b)throw Error("GIF motion inspection needs Canvas2D.");
    a.putImageData(new ImageData(frame.data,frame.width,frame.height),0,0);
    b.drawImage(input,0,0,w,h);
    return {width:w,height:h,data:b.getImageData(0,0,w,h).data,
      sourceWidth:frame.width,sourceHeight:frame.height,
      mediaTime:frame.mediaTime||0,index:frame.index,decoder:frame.decoder};
  }finally{input.width=input.height=output.width=output.height=1;}
}
export async function decodeGifMotionSamples(blob,samples){
  if(!blob?.size||blob.size>40_000_000)
    throw Error("GIF file is empty or too large for an on-device motion audit.");
  const bytes=new Uint8Array(await blob.arrayBuffer());
  const decoded=decodeOwnGifSamples(bytes,samples.map(s=>s.index));
  // Two distinct clocks: GIF presentation time includes 10ms GIF delay
  // rounding; shader reference time remains index/fps. Never conflate them.
  return decoded.map(frame=>downsampleFrame({
    ...frame,mediaTime:frame.encodedDisplayTime
  }));
}
function waitForVideo(video,event,check,timeout=12000){
  if(check())return Promise.resolve();
  return new Promise((resolve,reject)=>{
    let timer;
    const cleanup=()=>{
      clearTimeout(timer);
      video.removeEventListener(event,done);
      video.removeEventListener("error",fail);
    };
    const done=()=>{if(check()){cleanup();resolve();}};
    const fail=()=>{cleanup();reject(Error("MP4 decoding failed during multi-frame audit."));};
    video.addEventListener(event,done);video.addEventListener("error",fail);
    timer=setTimeout(()=>{cleanup();reject(Error("Timed out reading a recorded video frame."));},timeout);
  });
}
/**
 * Sequential seeks on ONE paused muted HTMLVideoElement.
 * seeked + HAVE_CURRENT_DATA ensure drawImage targets the frame at the
 * reported playback timestamp (subject to codec seek/keyframe precision).
 */
export async function decodeMp4MotionSamples(blob,samples,fps=30){
  if(!blob?.size)throw Error("MP4 file is empty.");
  const url=URL.createObjectURL(blob);
  const video=document.createElement("video");
  video.playsInline=true;video.muted=true;video.preload="auto";
  video.setAttribute("playsinline","");
  video.style.position="fixed";video.style.left="0";video.style.top="0";
  video.style.width="1px";video.style.height="1px";video.style.opacity="0";
  video.style.pointerEvents="none";
  let appended=false;
  try{
    document.body.appendChild(video);appended=true;
    video.src=url;video.load();
    await waitForVideo(video,"loadedmetadata",()=>video.readyState>=video.HAVE_METADATA);
    if(video.videoWidth<1||video.videoHeight<1)
      throw Error("Encoded MP4 has no video dimensions.");
    if(video.videoWidth>1080||video.videoHeight>1080)
      throw Error("MP4 motion audit supports a maximum 1080px output.");
    const out=[];
    for(const sample of samples){
      // Last encoded frame begins at (count - 1)/fps. Seeking exactly to
      // end-of-file may return a blank canvas, so keep one frame of margin.
      const maximum=Number.isFinite(video.duration)&&video.duration>0?
        Math.max(0,video.duration-1/Math.max(10,fps)):sample.seconds;
      const seek=Math.max(0,Math.min(sample.seconds,maximum));
      if(Math.abs(video.currentTime-seek)>.0001||
         video.readyState<video.HAVE_CURRENT_DATA){
        const pending=waitForVideo(video,"seeked",()=>
          !video.seeking&&video.readyState>=video.HAVE_CURRENT_DATA&&
          Math.abs(video.currentTime-seek)<.12);
        // Safari sometimes doesn't trigger seeked for a zero-time reset.
        video.currentTime=seek===0?0.001:seek;
        await pending;
      }
      if(video.readyState<video.HAVE_CURRENT_DATA)
        throw Error("MP4 media frame has not decoded at the requested time.");
      const decodedTime=video.currentTime;
      const sampleCanvas=document.createElement("canvas");
      const scale=Math.min(1,auditMaxEdge/Math.max(video.videoWidth,video.videoHeight));
      const w=Math.max(1,Math.round(video.videoWidth*scale));
      const h=Math.max(1,Math.round(video.videoHeight*scale));
      sampleCanvas.width=w;sampleCanvas.height=h;
      try{
        const ctx=sampleCanvas.getContext("2d",{willReadFrequently:true});
        if(!ctx)throw Error("Cannot read decoded MP4 frame pixels.");
        ctx.drawImage(video,0,0,w,h);
        out.push({width:w,height:h,data:ctx.getImageData(0,0,w,h).data,
          sourceWidth:video.videoWidth,sourceHeight:video.videoHeight,
          mediaTime:decodedTime,index:sample.index,
          decoder:"HTMLVideoElement seeked + decoded frame"});
      }finally{sampleCanvas.width=sampleCanvas.height=1;}
    }
    return out;
  }finally{
    video.pause();video.removeAttribute("src");video.load();
    if(appended)video.remove();
    URL.revokeObjectURL(url);
  }
}
export function verifyMotionDecodeTimes(motion,decoded,requested,format){
  if(format==="gif")return motion;
  if(!Array.isArray(decoded)||decoded.length!==3)return motion;
  for(let i=1;i<3;i++){
    const expectedGap=requested[i].seconds-requested[i-1].seconds;
    const actualGap=decoded[i].mediaTime-decoded[i-1].mediaTime;
    if(!Number.isFinite(actualGap)||actualGap<
      Math.min(.15,expectedGap*.3)){
      return {...motion,possibleMotionLoss:false,
        status:"Inconclusive: decoder timestamps did not advance across samples",
        decoderTimeWarning:true};
    }
  }
  return {...motion,decoderTimeWarning:false};
}
export function motionForensicsReport({samples,motion,format,method,seed,size}){
  return {type:"glitchbitch-full-clip-motion-forensics",version:1,
    generatedAt:new Date().toISOString(),
    format,encoderMethod:method,seed,size,
    samples:samples.map(s=>({label:s.label,encodedFrameIndex:s.index,
      referenceClockSeconds:round(s.referenceTime??s.seconds,4),
      decodedMediaSeconds:round(s.decodedTime??s.seconds,4),
      discrepancy:s.discrepancy})),
    motion,
    interpretation:"Three decoded frames (opening, middle, final) from the REAL exported GIF/MP4 are compared to three freshly rendered strict PNGs. Motion metrics are descriptive, not proof of full-clip fidelity. PNG history/feedback, native MP4 variable frame timing and lossy codecs can diverge. No user words, image pixels or palette colors are included."
  };
}
