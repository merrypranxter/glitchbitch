/**
 * EXPORT TRUTH SERUM
 *
 * A deterministic three-frame diagnostic of the actual flattened exporter:
 * (A) identical artwork without text, (B) text at Normal, and (C) text
 * with its selected blend(s). Sampling exported PNGs avoids making claims
 * based on the CSS preview, which is a separate rendering technology.
 *
 * This module never uploads artwork or quotes. The report contains modes,
 * material settings, browser capability and aggregate color measurements,
 * but NOT the user's wording, pixel data or palette values.
 */
export function withoutTextForExport(state){
  return {...state,letteringAmount:0,
    letteringLayers:(state.letteringLayers||[]).map(layer=>({...layer,visible:false}))};
}

export function exportTextLayerSummary(state){
  return [{...state,text:state.lettering,visible:true},
    ...(state.letteringLayers||[]).slice(0,2)].map((layer,i)=>({
      layer:i+1,
      enabled:layer.visible!==false && typeof layer.text==="string" &&
        layer.text.trim().length>0 && Number(layer.letteringAmount)>0,
      blend:String(layer.letteringBlendMode||"Normal"),
      strength:Number(layer.letteringBlendStrength??100),
      material:String(layer.letteringStyle||"Custom ink"),
      fillMode:String(layer.letteringFillMode||"Solid"),
      opacity:Number(layer.letteringAmount??0),
      font:String(layer.letteringFont||"original")
    }));
}

const round=(v,places=1)=>Number(v.toFixed(places));
function frameData(frame){
  if(!frame || !Number.isInteger(frame.width) || !Number.isInteger(frame.height) ||
     frame.width<=0 || frame.height<=0 ||
     !frame.data || frame.data.length!==frame.width*frame.height*4)
    throw Error("Export diagnostic frame is missing or malformed.");
  return frame;
}
function maxColorDiff(a,b,i){
  return Math.max(Math.abs(a[i]-b[i]),Math.abs(a[i+1]-b[i+1]),
    Math.abs(a[i+2]-b[i+2]));
}
function chroma(data,i){
  return Math.max(data[i],data[i+1],data[i+2]) -
    Math.min(data[i],data[i+1],data[i+2]);
}
function brightness(data,i){
  return data[i]*.2126+data[i+1]*.7152+data[i+2]*.0722;
}

export function analyzeTextExportFrames({background,normal,selected},threshold=12){
  const bg=frameData(background),nm=frameData(normal),se=frameData(selected);
  if(bg.width!==nm.width || bg.height!==nm.height ||
     bg.width!==se.width || bg.height!==se.height)
    throw Error("Export comparison frames must have identical dimensions.");
  const pixels=bg.width*bg.height;
  const stride=Math.max(1,Math.floor(pixels/120000));
  const cutoff=Math.max(0,Math.min(255,Number(threshold)||0));
  let sampled=0,affected=0,different=0,normalChroma=0,
    selectedChroma=0,normalBrightness=0,selectedBrightness=0,
    meanDelta=0,normalTextDelta=0,selectedTextDelta=0;
  for(let p=0;p<pixels;p+=stride){
    sampled++;
    const i=p*4;
    const nImpact=maxColorDiff(bg.data,nm.data,i);
    const sImpact=maxColorDiff(bg.data,se.data,i);
    if(Math.max(nImpact,sImpact)<=cutoff)continue;
    affected++;
    const diff=maxColorDiff(nm.data,se.data,i);
    if(diff>cutoff)different++;
    meanDelta+=diff;
    normalChroma+=chroma(nm.data,i);
    selectedChroma+=chroma(se.data,i);
    normalBrightness+=brightness(nm.data,i);
    selectedBrightness+=brightness(se.data,i);
    normalTextDelta+=nImpact;
    selectedTextDelta+=sImpact;
  }
  const safe=Math.max(1,affected);
  return {
    width:bg.width,height:bg.height,samples:sampled,
    textAffectedPixels:affected,
    textCoveragePercent:round(affected*100/sampled,2),
    blendChangedPercent:round(different*100/safe,2),
    meanBlendDifference:round(meanDelta/safe,2), // 0..255 RGB difference
    normalChroma:round(normalChroma/safe,2),
    selectedChroma:round(selectedChroma/safe,2),
    chromaChange:round((selectedChroma-normalChroma)/safe,2),
    normalBrightness:round(normalBrightness/safe,2),
    selectedBrightness:round(selectedBrightness/safe,2),
    normalTextImpact:round(normalTextDelta/safe,2),
    selectedTextImpact:round(selectedTextDelta/safe,2)
  };
}

export async function exportBlobPixels(blob){
  if(!blob || !blob.size)throw Error("Cannot inspect an empty export frame.");
  let image=null,temporaryUrl=null,canvas=null;
  try{
    if(typeof createImageBitmap==="function"){
      try{image=await createImageBitmap(blob);}catch{ /* Safari fallback below */ }
    }
    if(!image){
      temporaryUrl=URL.createObjectURL(blob);
      image=new Image();
      image.src=temporaryUrl;
      if(typeof image.decode==="function")await image.decode();
      else await new Promise((resolve,reject)=>{
        image.onload=resolve;image.onerror=()=>reject(Error("Image decode failed."));
        if(image.complete&&image.naturalWidth)resolve();
      });
    }
    const width=image.naturalWidth||image.width;
    const height=image.naturalHeight||image.height;
    canvas=document.createElement("canvas");
    canvas.width=width;canvas.height=height;
    const ctx=canvas.getContext("2d",{willReadFrequently:true}) ||
      canvas.getContext("2d");
    if(!ctx)throw Error("Canvas pixel inspection is unavailable.");
    ctx.drawImage(image,0,0,width,height);
    return {width,height,data:ctx.getImageData(0,0,width,height).data};
  }finally{
    image?.close?.();
    if(temporaryUrl)URL.revokeObjectURL(temporaryUrl);
    if(canvas)canvas.width=canvas.height=1;
  }
}

export function exportDiagnosticReport({state,ratio,timeline,metrics,
  canvasFilterSupported,mp4Available,userAgent}){
  return {
    type:"glitchbitch-export-truth-serum",
    version:1,
    generatedAt:new Date().toISOString(),
    image:{width:metrics?.width||0,height:metrics?.height||0},
    ratio,
    seed:state.seed,
    frameClock:{
      time:Number(timeline?.time??0),
      colorTime:Number(timeline?.colorTime??0),
      textTime:Number(timeline?.textTime??0)
    },
    browser:{
      userAgent:String(userAgent||"unavailable").slice(0,280),
      canvas2dFilter:canvasFilterSupported===true?"working":
        canvasFilterSupported===false?"fallback":"unknown",
      mp4Available:!!mp4Available
    },
    textLayers:exportTextLayerSummary(state),
    measurements:metrics||null,
    interpretation:"Pixel comparisons cover a single actual PNG-compositor frame, not the CSS preview or video compression. Low blend difference can be expected for Normal or some blends/backgrounds. No personal quote or image pixels are included."
  };
}
