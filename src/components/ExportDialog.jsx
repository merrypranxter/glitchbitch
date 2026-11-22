import React, { useEffect, useRef, useState } from "react";
import { Download, Image, Film, Braces, Check, Square, LoaderCircle, Share2 } from "lucide-react";
import Modal from "./Modal";
import { Select } from "./Controls";
import { ratios, recipeDocument } from "../data";
import { dimensions, videoDimensions, renderImage, download, recordClip, videoFormat, clockAt } from "../export";
import {LOOP_MODES,LOOP_BLEND_SECONDS} from "../loop-closure.js";
import {analyzeEncodedFrame,differenceHeatmap,decodeStaticExport,
  decodeMp4Export,frameBlob,frameAuditReport} from "../encoded-frame-truth-serum.js";
import {selectMotionSamples,analyzeClipMotion,decodeGifMotionSamples,
  decodeMp4MotionSamples,verifyMotionDecodeTimes,motionForensicsReport} from "../clip-motion-forensics.js";
import {selectSeamSamples,assessSeamDecoderTiming,analyzeSeamContinuity,
  seamForensicsReport} from "../loop-seam-forensics.js";
import { hasVisibleLettering } from "../text-compositor.js";
import { normalTextBlendState } from "../text-blend-proof.js";
import { canvasImageFiltersWork } from "../lettering-filter-fallback.js";
import { exportBlobPixels, analyzeTextExportFrames,
  exportDiagnosticReport } from "../text-export-diagnostics.js";
export default function ExportDialog({ state, title, timelineRef, onClose, onNotice, onExportBusy }) {
  const [tab,setTab]=useState("Image"),
    [longEdge,setLongEdge]=useState(2160),
    [videoSize,setVideoSize]=useState(720),
    [gifSize,setGifSize]=useState(480),
    [clipFormat,setClipFormat]=useState("mp4"),
    [duration,setDuration]=useState(6),
    [frameRate,setFrameRate]=useState(30),
    [bitrate,setBitrate]=useState(16000000),
    [loopMode,setLoopMode]=useState("Off"),
    [loopBlendSeconds,setLoopBlendSeconds]=useState(.75),
    [ratio,setRatio]=useState(state.ratio),
    [busy,setBusy]=useState(false),
    [progress,setProgress]=useState(0),
    [error,setError]=useState(""),
    [proof,setProof]=useState(null),
    [blendProof,setBlendProof]=useState(null),
    [diagnostics,setDiagnostics]=useState(null),
    [ready,setReady]=useState(null),
    [frameAudit,setFrameAudit]=useState(null),
    [motionAudit,setMotionAudit]=useState(null),
    [selectedMotionIndex,setSelectedMotionIndex]=useState(0),
    [seamAudit,setSeamAudit]=useState(null),
    [selectedSeamView,setSelectedSeamView]=useState("wrap"),
    [motionAuditStage,setMotionAuditStage]=useState(""),
    [auditing,setAuditing]=useState(false);
  const controller=useRef(null), mounted=useRef(true), proofUrl=useRef(null), blendUrls=useRef([]),
    frameAuditUrls=useRef([]),motionAuditUrls=useRef([]),seamAuditUrls=useRef([]);
  function clearFrameAudit(){
    frameAuditUrls.current.forEach(url=>URL.revokeObjectURL(url));
    frameAuditUrls.current=[];
    setFrameAudit(null);
  }
  function clearMotionAudit(){
    motionAuditUrls.current.forEach(url=>URL.revokeObjectURL(url));
    motionAuditUrls.current=[];
    setMotionAudit(null);
    setSelectedMotionIndex(0);
    setMotionAuditStage("");
  }
  function clearSeamAudit(){
    seamAuditUrls.current.forEach(url=>URL.revokeObjectURL(url));
    seamAuditUrls.current=[];
    setSeamAudit(null);
    setSelectedSeamView("wrap");
  }
  const capability=videoFormat();
  useEffect(()=>()=>{mounted.current=false;controller.current?.abort();
    onExportBusy?.(false);
    if(proofUrl.current) URL.revokeObjectURL(proofUrl.current);
    blendUrls.current.forEach(url=>URL.revokeObjectURL(url));
    frameAuditUrls.current.forEach(url=>URL.revokeObjectURL(url));
    motionAuditUrls.current.forEach(url=>URL.revokeObjectURL(url));
    seamAuditUrls.current.forEach(url=>URL.revokeObjectURL(url));
  },[]);
  const size=tab==="Video" ? clipFormat==="mp4"
    ? videoDimensions(ratio,videoSize) : dimensions(ratio,gifSize)
    : dimensions(ratio,longEdge);
  const fps=clipFormat==="gif" ? 15 : frameRate;
  const clipDuration=clipFormat==="gif"?Math.min(duration,10):duration;
  async function makeProof(){
    if(busy)return;
    setBusy(true);setError("");setProof(null);
    const snapshot={...state,ratio},timeline={...timelineRef.current};
    try {
      onExportBusy?.(true);
      await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
      // This is the SAME compositing function used by the PNG and video
      // workspace, not a screenshot of the CSS live preview.
      const blob=await renderImage(snapshot,timeline,480);
      if(!mounted.current)return;
      const url=URL.createObjectURL(blob);
      if(proofUrl.current)URL.revokeObjectURL(proofUrl.current);
      proofUrl.current=url;
      setProof({url,ratio,seed:state.seed,stateAt:state});
    }catch(e){
      if(mounted.current)setError("Export proof could not render: "+e.message);
    }finally{
      onExportBusy?.(false);
      if(mounted.current)setBusy(false);
    }
  }
  async function compareBlends(){
    if(busy||!hasVisibleLettering(state))return;
    setBusy(true);setError("");setDiagnostics(null);setBlendProof(null);
    const snapshot={...state,ratio},timeline={...timelineRef.current};
    const temporary=[];
    try{
      onExportBusy?.(true);
      await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
      // Sequential 480px renders bound mobile WebGL memory. Both captures
      // use the identical timeline and Canvas compositor used by actual MP4.
      const normal=await renderImage(normalTextBlendState(snapshot),timeline,480);
      const selected=await renderImage(snapshot,timeline,480);
      // Third reference frame: exact SAME math, textile effects, and authored
      // glyph gravity, but skip only the final 2D text compositing pass.
      // Turning the words off in state would also remove Semantic Gravity
      // and contaminate what was supposed to be a text-blend-only comparison.
      const background=await renderImage(snapshot,timeline,480,
        "image/png",{compositeLettering:false});
      if(!mounted.current)return;
      let metrics=null,analysisError="";
      try{
        const basePixels=await exportBlobPixels(background);
        const normalPixels=await exportBlobPixels(normal);
        const selectedPixels=await exportBlobPixels(selected);
        metrics=analyzeTextExportFrames({
          background:basePixels,normal:normalPixels,selected:selectedPixels
        });
      }catch(e){
        // Pixel inspection may be blocked on certain iPhones, but the
        // visual A/B comparison must still work even if statistics cannot.
        analysisError=e.message||"Pixel inspection is unavailable.";
      }
      if(!mounted.current)return;
      const normalUrl=URL.createObjectURL(normal);
      const selectedUrl=URL.createObjectURL(selected);
      const backgroundUrl=URL.createObjectURL(background);
      temporary.push(normalUrl,selectedUrl,backgroundUrl);
      blendUrls.current.forEach(url=>URL.revokeObjectURL(url));
      blendUrls.current=[normalUrl,selectedUrl,backgroundUrl];
      setBlendProof({normal:normalUrl,selected:selectedUrl,background:backgroundUrl,
        ratio,seed:state.seed,stateAt:state,
        mode:state.letteringBlendMode||"Normal"});
      setDiagnostics({...exportDiagnosticReport({
        state:snapshot,ratio,timeline,metrics,
        canvasFilterSupported:canvasImageFiltersWork(),
        mp4Available:!!capability,
        userAgent:typeof navigator!=="undefined"?navigator.userAgent:"unavailable"
      }),analysisError});
    }catch(e){
      if(mounted.current)setError("Blend comparison failed: "+e.message);
    }finally{
      onExportBusy?.(false);
      if(!mounted.current)temporary.forEach(url=>URL.revokeObjectURL(url));
      if(mounted.current)setBusy(false);
    }
  }
  function saveDiagnostics(){
    if(!diagnostics)return;
    const {analysisError,...report}=diagnostics;
    download(new Blob([JSON.stringify({
      ...report,analysisError:analysisError||undefined
    },null,2)],{type:"application/json"}),
      `glitchbitch-export-truth-${state.seed}.json`);
  }
  async function run() {
    clearFrameAudit();
    clearMotionAudit();
    clearSeamAudit();
    setError("");setProgress(0);setBusy(true);setReady(null);
    if(tab==="Video")controller.current=new AbortController();
    const snapshot={...state,ratio},timeline={...timelineRef.current};
    try {
      if(tab!=="Recipe")onExportBusy?.(true);
      // Let React unmount and free the live WebGL context before opening
      // the capture context on Safari/iPhone; preview resumes afterwards.
      await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
      if(tab==="Image"){
        const blob=await renderImage(snapshot,timeline,longEdge);
        download(blob,`glitch-${state.seed}-${size.width}x${size.height}.png`);
        onNotice("Full-resolution PNG exported.");
      } else if(tab==="Video"){
        const result=await recordClip(snapshot,timeline,{
          format:clipFormat,longEdge:clipFormat==="gif"?gifSize:videoSize,
          duration:clipDuration,fps,bitrate,loopMode,loopBlendSeconds,
          onProgress:p=>{if(mounted.current)setProgress(p);},
          signal:controller.current.signal,
        });
        const filename=`glitch-${state.seed}-${size.width}x${size.height}-${Math.round(clipDuration)}s${loopMode!=="Off"?"-softloop":""}.${result.extension}`;
        download(result.blob,filename);
        if(mounted.current)setReady({blob:result.blob,filename,type:result.mime,
          snapshot,timeline,frameSize:{...size},method:result.method,
          duration:clipDuration,fps:result.fps,frames:result.frames,
          loopMode,loopBlendSeconds,format:clipFormat});
        onNotice(`${result.extension.toUpperCase()} exported. No WebM conversion necessary.`);
      } else {
        download(new Blob([JSON.stringify(recipeDocument(snapshot,title,timeline),null,2)],{type:"application/json"}),
          `glitch-${state.seed}.json`);
        onNotice("Recipe exported.");
      }
    } catch(e) {
      if(mounted.current)setError(e.name==="AbortError"?"Export cancelled; your artwork is unchanged.":e.message);
    } finally {
      onExportBusy?.(false);
      if(mounted.current)setBusy(false);
      controller.current=null;
    }
  }
  async function checkEncodedFrame(){
    if(!ready||busy)return;
    if(Math.max(ready.frameSize.width,ready.frameSize.height)>1080){
      setError("Frame-integrity inspection is capped at 1080px to protect iPhone memory. Export a 480p, 720p, or 1080p sample to inspect.");
      return;
    }
    setBusy(true);setAuditing(true);setError("");clearFrameAudit();
    const fresh=[];
    try{
      // Free the preview GPU before decoding and rendering one exact PNG.
      onExportBusy?.(true);
      await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
      const gif=ready.format==="gif";
      const decoded=gif?await decodeStaticExport(ready.blob):
        await decodeMp4Export(ready.blob);
      const seconds=Math.max(0,Math.min(Number(decoded.mediaTime)||0,ready.duration));
      const matchedClock=clockAt(ready.snapshot,ready.timeline,seconds);
      const png=await renderImage(ready.snapshot,matchedClock,
        Math.max(ready.frameSize.width,ready.frameSize.height),"image/png",
        {exactEffects:true,outputSize:ready.frameSize});
      const reference=await decodeStaticExport(png);
      const metrics=analyzeEncodedFrame(reference,decoded,
        {format:gif?"gif":"mp4"});
      const delta=differenceHeatmap(reference,decoded);
      const previews=await Promise.all([frameBlob(reference),
        frameBlob(decoded),frameBlob(delta)]);
      if(!mounted.current)return;
      const urls=previews.map(blob=>URL.createObjectURL(blob));
      fresh.push(...urls);
      const report=frameAuditReport({
        metrics,mediaTime:seconds,decoder:decoded.decoder,
        encoderMethod:ready.method,requestedSize:ready.frameSize,
        actualSize:{width:decoded.sourceWidth,height:decoded.sourceHeight},
        format:ready.format,seed:ready.snapshot.seed
      });
      frameAuditUrls.current=urls;
      setFrameAudit({urls,report,filename:ready.filename});
    }catch(e){
      if(mounted.current)setError("Encoded frame inspection failed: "+e.message);
    }finally{
      if(!mounted.current)fresh.forEach(url=>URL.revokeObjectURL(url));
      onExportBusy?.(false);
      if(mounted.current){setBusy(false);setAuditing(false);}
    }
  }
  function saveFrameAudit(){
    if(!frameAudit)return;
    download(new Blob([JSON.stringify(frameAudit.report,null,2)],
      {type:"application/json"}),
      "glitchbitch-frame-integrity-"+frameAudit.report.seed+".json");
  }
  async function inspectClipMotion(){
    if(!ready||busy)return;
    // Three exact-resolution PNG renders plus three decoded frame comparisons.
    // Cap at 720px so iPhone Safari has space to open the reference GPU.
    if(Math.max(ready.frameSize.width,ready.frameSize.height)>720){
      setError("Full-Clip Motion Forensics supports 480px and 720px clips. Export a smaller diagnostic clip; your original high-resolution file is unchanged.");
      return;
    }
    setBusy(true);setAuditing(true);clearMotionAudit();setError("");
    const created=[];
    try{
      onExportBusy?.(true);
      await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
      const samples=selectMotionSamples(ready.frames,ready.fps);
      setMotionAuditStage("Decoding three frames from the actual exported file…");
      const decoded=ready.format==="gif"?
        await decodeGifMotionSamples(ready.blob,samples):
        await decodeMp4MotionSamples(ready.blob,samples,ready.fps);
      // Decode ALL samples and close the video before allocating a new WebGL
      // renderer. This reduces simultaneous iOS graphics/video pressure.
      const references=[],rows=[];
      for(let i=0;i<samples.length;i++){
        const sample=samples[i],picture=decoded[i];
        // GIF delays are quantized to 10ms (67ms => 70ms). The encoder
        // rendered the logical frame at index/fps, not its GIF display time.
        const seconds=ready.format==="gif"?sample.seconds:picture.mediaTime;
        setMotionAuditStage("Rendering strict PNG reference "+(i+1)+" / 3…");
        const clock=clockAt(ready.snapshot,ready.timeline,seconds);
        const png=await renderImage(ready.snapshot,clock,
          Math.max(ready.frameSize.width,ready.frameSize.height),"image/png",
          {exactEffects:true,outputSize:ready.frameSize});
        const ref=await decodeStaticExport(png);
        // All per-frame measurements use identical downscaled dimensions.
        const delta=differenceHeatmap(ref,picture);
        const difference=analyzeEncodedFrame(ref,picture,{format:ready.format});
        const three=await Promise.all([frameBlob(ref),frameBlob(picture),
          frameBlob(delta)]);
        const urls=three.map(blob=>URL.createObjectURL(blob));
        created.push(...urls);
        references.push(ref);
        rows.push({
          label:sample.label,index:sample.index,
          referenceTime:seconds,decodedTime:picture.mediaTime,
          discrepancy:difference.discrepancy,
          difference,urls,
          sourceWidth:picture.sourceWidth,
          sourceHeight:picture.sourceHeight
        });
      }
      const measured=verifyMotionDecodeTimes(
        analyzeClipMotion(references,decoded),decoded,samples,ready.format);
      // The existing full-clip audit compares plain strict PNGs. Once the
      // user explicitly crossfades the tail those reference pixels no longer
      // describe what the last encoded frame SHOULD look like. Do not claim
      // that intentional Loop Surgery is lost motion or encoder corruption.
      const motion=ready.loopMode!=="Off"&&measured.possibleMotionLoss?
        {...measured,possibleMotionLoss:false,
          status:"Inconclusive: Loop Surgery intentionally changes ending frames",
          closureAdjusted:true}:
        {...measured,closureAdjusted:ready.loopMode!=="Off"};
      const report=motionForensicsReport({
        samples:rows,motion,format:ready.format,method:ready.method,
        seed:ready.snapshot.seed,size:ready.frameSize
      });
      if(!mounted.current)return;
      motionAuditUrls.current=created.slice();
      setMotionAudit({rows,motion,report,filename:ready.filename});
      setSelectedMotionIndex(0);
      setMotionAuditStage("");
    }catch(e){
      created.forEach(url=>URL.revokeObjectURL(url));
      if(mounted.current)setError("Full-clip motion inspection failed: "+e.message);
    }finally{
      if(!mounted.current)created.forEach(url=>URL.revokeObjectURL(url));
      onExportBusy?.(false);
      if(mounted.current){setBusy(false);setAuditing(false);setMotionAuditStage("");}
    }
  }
  function saveMotionAudit(){
    if(!motionAudit)return;
    download(new Blob([JSON.stringify(motionAudit.report,null,2)],
      {type:"application/json"}),
      "glitchbitch-motion-forensics-"+motionAudit.report.seed+".json");
  }
  async function inspectLoopSeam(){
    if(!ready||busy)return;
    if(Math.max(ready.frameSize.width,ready.frameSize.height)>720){
      setError("Loop Seam Scanner supports 480px and 720px diagnostic clips to protect iPhone memory.");
      return;
    }
    if(ready.frames<7){
      setError("Loop Seam Scanner needs at least seven video frames.");
      return;
    }
    setBusy(true);setAuditing(true);clearSeamAudit();setError("");
    const created=[];
    try{
      onExportBusy?.(true);
      await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
      const samples=selectSeamSamples(ready.frames,ready.fps);
      setMotionAuditStage("Decoding seven real encoded frames (no second render)…");
      const decoded=ready.format==="gif"?
        await decodeGifMotionSamples(ready.blob,samples):
        await decodeMp4MotionSamples(ready.blob,samples,ready.fps);
      const timing=assessSeamDecoderTiming(decoded,samples,ready.format,ready.fps);
      const results=analyzeSeamContinuity(decoded,{format:ready.format,timing});
      const report=seamForensicsReport({
        samples,frames:decoded,results,format:ready.format,
        encoderMethod:ready.method,seed:ready.snapshot.seed,
        size:ready.frameSize,fps:ready.fps
      });
      // View A and B are ACTUAL decoded media frames, never generated PNGs.
      // The heatmap highlights the discontinuity between these two frames.
      const pairs=[
        {key:"wrap",label:"End → Start · loop seam",left:6,right:0},
        {key:"midIn",label:"Mid - 1 → Middle",left:2,right:3},
        {key:"midOut",label:"Middle → Mid + 1",left:3,right:4}
      ];
      const views={};
      for(let i=0;i<pairs.length;i++){
        const pair=pairs[i];
        setMotionAuditStage("Preparing seam and midpoint heatmaps "+(i+1)+" / 3…");
        const left=decoded[pair.left],right=decoded[pair.right];
        const diff=differenceHeatmap(left,right);
        const images=await Promise.all([frameBlob(left),frameBlob(right),frameBlob(diff)]);
        const urls=images.map(blob=>URL.createObjectURL(blob));
        created.push(...urls);
        views[pair.key]={label:pair.label,urls,
          leftIndex:samples[pair.left].index,rightIndex:samples[pair.right].index};
      }
      if(!mounted.current)return;
      seamAuditUrls.current=created.slice();
      setSeamAudit({filename:ready.filename,results,report,views});
      setSelectedSeamView("wrap");
    }catch(e){
      created.forEach(url=>URL.revokeObjectURL(url));
      if(mounted.current)setError("Loop-seam inspection failed: "+e.message);
    }finally{
      if(!mounted.current)created.forEach(url=>URL.revokeObjectURL(url));
      onExportBusy?.(false);
      if(mounted.current){setBusy(false);setAuditing(false);setMotionAuditStage("");}
    }
  }
  function saveSeamAudit(){
    if(!seamAudit)return;
    download(new Blob([JSON.stringify(seamAudit.report,null,2)],
      {type:"application/json"}),
      "glitchbitch-loop-seam-"+seamAudit.report.seed+".json");
  }
  function canShare() {
    if(!ready || typeof File==="undefined" || typeof navigator==="undefined" || !navigator.canShare)return false;
    try {
      const file=new File([ready.blob],ready.filename,{type:ready.type});
      return navigator.canShare({files:[file]});
    } catch { return false; }
  }
  async function share() {
    if(!canShare())return;
    try {
      const file=new File([ready.blob],ready.filename,{type:ready.type});
      await navigator.share({files:[file],title:"GLITCHBITCH animation"});
    } catch(e) {
      if(e.name!=="AbortError")setError("Sharing failed; the downloaded file is still available.");
    }
  }
  return (
    <Modal title="Take the chaos with you." subtitle="Real MP4. Animated GIF. PNG. Recipes. No WebM nonsense." onClose={onClose} busy={busy}>
      <div className="export-tabs">
        {[[Image,"Image"],[Film,"Video"],[Braces,"Recipe"]].map(([Icon,name])=>(
          <button disabled={busy} className={tab===name?"selected":""}
            onClick={()=>{setTab(name);setError("");setReady(null);clearFrameAudit();clearMotionAudit();clearSeamAudit();}} key={name}>
            <Icon size={17}/>{name}
          </button>
        ))}
      </div>
      <fieldset disabled={busy} className="export-options">
        {tab!=="Recipe"?<>
          {tab==="Video"&&<Select label="Output format" value={clipFormat}
            onChange={v=>{setClipFormat(v);setReady(null);clearFrameAudit();clearMotionAudit();clearSeamAudit();}}>
            <option value="mp4">MP4 · H.264 (real video)</option>
            <option value="gif">GIF · animated image</option>
          </Select>}
          <div className="export-format">
            <span>{tab==="Image"?"PNG / LOSSLESS":
              clipFormat==="mp4"?"MP4 · H.264 / NO WEBM":"ANIMATED GIF / LOOPS"}</span>
            <strong>{size.width} <span>×</span> {size.height}</strong>
          </div>
          <div className="export-fields">
            <Select label="Aspect ratio" value={ratio} onChange={setRatio}>
              {ratios.map(r=><option key={r.id}>{r.id}</option>)}
            </Select>
            <Select label="Longest edge" value={tab==="Image"?longEdge:clipFormat==="mp4"?videoSize:gifSize}
              onChange={v=>tab==="Image"?setLongEdge(+v):clipFormat==="mp4"?setVideoSize(+v):setGifSize(+v)}>
              {(tab==="Image"?[1080,2160,4096]:clipFormat==="mp4"?[480,720,1080,1440,2160]:[360,480,720,1080])
                .map(v=><option key={v} value={v}>{v.toLocaleString()} px</option>)}
            </Select>
          </div>
          {tab==="Video"?<>
            <Select label="Clip duration" value={clipDuration} onChange={v=>{
                const next=+v;
                setDuration(next);
                const allowed=LOOP_BLEND_SECONDS.filter(n=>
                  n<=Math.min(next,clipFormat==="gif"?10:30)*.75);
                setLoopBlendSeconds(old=>allowed.includes(old)?old:
                  (allowed[allowed.length-1]||.25));
              }}>
              {(clipFormat==="gif"?[2,3,5,10]:[2,3,5,6,10,15,30])
                .map(v=><option key={v} value={v}>{v} seconds</option>)}
            </Select>
            <Select label="Loop surgery" value={loopMode}
              onChange={v=>{setLoopMode(v);setReady(null);clearFrameAudit();clearMotionAudit();clearSeamAudit();}}>
              {LOOP_MODES.map(mode=><option key={mode} value={mode}>
                {mode==="Off"?"Off · untouched original":"Soft closure · fade ending into the opening"}
              </option>)}
            </Select>
            {loopMode!=="Off"&&<>
              <Select label="Tail-to-opening blend" value={loopBlendSeconds}
                onChange={v=>{setLoopBlendSeconds(+v);setReady(null);}}>
                {LOOP_BLEND_SECONDS.filter(n=>n<=clipDuration*.75)
                  .map(n=><option key={n} value={n}>{n} seconds</option>)}
              </Select>
              <p className="export-note">Loop Surgery stores the first FULL artwork frame
                (all thread effects and text), then gradually blends the final
                {loopBlendSeconds}s back to it. The last raw frame meets the first.
                This softens visible loop jumps, but moving patterns may briefly
                ghost or slow near the seam. It is NOT reversible physics or
                guaranteed perfect velocity. Works for real MP4 and GIF.</p>
            </>}
            {clipFormat==="mp4"&&<>
              <Select label="Frame rate" value={frameRate} onChange={v=>setFrameRate(+v)}>
                {[24,30].map(v=><option key={v} value={v}>{v} fps</option>)}
              </Select>
              <Select label="Video bitrate" value={bitrate} onChange={v=>setBitrate(+v)}>
                <option value={8000000}>8 Mbps · balanced</option>
                <option value={16000000}>16 Mbps · high quality</option>
                <option value={24000000}>24 Mbps · maximum</option>
              </Select>
            </>}
            <p className="export-note">
              {clipFormat==="mp4"
                ?"Encodes H.264 video at explicit frame times when WebCodecs is available; Safari can use native MP4 recording as fallback. Larger clips demand more processing and storage."
                :"Real looping GIF, 15 fps, up to 1080px and 10 seconds. For smoother, longer high-resolution motion choose MP4."}
              {" "}Keep this tab visible while rendering.
              {" "}If your device can't reproduce all active shader effects,
              the exporter now stops with an error instead of downloading a
              deceptively simplified MP4. Try a lower resolution.
            </p>
            {clipFormat==="mp4"&&!capability&&<p className="field-error">
              This browser doesn't expose an MP4 encoder. GIF, PNG and recipes still work.
            </p>}
          </>:<p className="export-note"><Check size={13}/> Full-resolution render, no UI or touch handles.</p>}
        </>:<div className="recipe-explainer">
          <Braces size={34}/><h3>A tiny file. Your whole universe.</h3>
          <p>Seed, 12-stop palettes, math layers, effects, touch marks, aspect ratio and animation clocks.</p>
          <span>BACKWARD COMPATIBLE WITH OLDER RECIPES</span>
        </div>}
      </fieldset>
      {tab!=="Recipe"&&<div className="export-proof-panel">
        <button type="button" className="button secondary" disabled={busy}
          onClick={makeProof}>See flattened export proof (480px)</button>
        {proof&&proof.ratio===ratio&&proof.seed===state.seed&&proof.stateAt===state&&
          <img src={proof.url}
            alt="Flattened frame from the actual PNG/GIF/MP4 compositing engine" />}
        {hasVisibleLettering(state)&&<>
          <button type="button" className="button secondary" disabled={busy}
            onClick={compareBlends}>Compare actual blend vs Normal (A/B)</button>
          {blendProof&&blendProof.ratio===ratio&&blendProof.seed===state.seed&&blendProof.stateAt===state&&
            <div className="blend-proof-grid" aria-label="Export blend A/B comparison">
              <figure><img src={blendProof.normal} alt="Same artwork with all text layers set to Normal blend"/>
                <figcaption>A · Normal</figcaption></figure>
              <figure><img src={blendProof.selected} alt="Same artwork with the actual selected text blend modes"/>
                <figcaption>B · Selected blends</figcaption></figure>
            </div>}
          {blendProof&&blendProof.ratio===ratio&&blendProof.seed===state.seed&&
            blendProof.stateAt===state&&diagnostics&&
            <details className="export-truth-panel">
              <summary>🧪 Export Truth Serum — measurements & device</summary>
              <p className="export-note">Three matching 480px frames: same full artwork (including any text-driven fiber gravity) without the final visible lettering, Normal text,
                and selected blends. This measures the PNG compositor's pixels—not the
                browser's live CSS preview or MP4 compression.</p>
              <div className="export-truth-metrics">
                {diagnostics.measurements?<>
                  <div><strong>{diagnostics.measurements.textCoveragePercent}%</strong>
                    <span>Pixels visibly affected by text</span></div>
                  <div><strong>{diagnostics.measurements.blendChangedPercent}%</strong>
                    <span>Text-region pixels changed by the blend</span></div>
                  <div><strong>{diagnostics.measurements.meanBlendDifference}</strong>
                    <span>Mean blend color difference / 255</span></div>
                  <div><strong>{diagnostics.measurements.chromaChange>0?"+":""}{diagnostics.measurements.chromaChange}</strong>
                    <span>Colorfulness change vs Normal</span></div>
                </>:<p className="export-note">Pixel analysis unavailable: {diagnostics.analysisError}</p>}
              </div>
              <p className="export-note">Canvas 2D filters: <b>{diagnostics.browser.canvas2dFilter}</b>.
                MP4 available: <b>{diagnostics.browser.mp4Available?"yes":"no"}</b>.
                {diagnostics.browser.canvas2dFilter==="fallback"&&
                  " This browser uses the cached-color fallback for native text blends."}
              </p>
              <p className="export-note">Some blends legitimately resemble Normal over certain colors.
                A small difference is evidence to investigate—not automatic proof of a bug.</p>
              <figure className="export-truth-background">
                <img src={blendProof.background} alt="Reference frame with text-driven thread geometry intact, but no final lettering overlay"/>
                <figcaption>Text overlay hidden · thread physics preserved</figcaption>
              </figure>
              <button type="button" className="button secondary" disabled={busy}
                onClick={saveDiagnostics}>Save diagnostic report (JSON)</button>
              <p className="export-note">The report includes browser capabilities, blend settings,
                and aggregate color measurements—but no artwork pixels or text wording.
                Attach it here if the export still looks wrong.</p>
            </details>}
        </>}
        <p className="export-note">These previews are rendered by the same strict-effects
          renderer as PNG/GIF/MP4, not by the browser text overlay. If an effect
          cannot be rendered, an error appears rather than a downgraded proof.
          The A/B pair uses the exact same frame and colors. Modes like Screen on a bright backdrop
          can appear subtle; try Difference or Multiply to verify the effect.</p>
      </div>}
      {error&&<p className="field-error" role="alert">{error}</p>}
      {busy&&auditing&&<p className="export-note">{motionAuditStage||"Inspecting decoded video frames and comparing real pixels…"}</p>}
      {busy&&!auditing&&tab==="Video"&&<div className="record-progress">
        <div><span style={{width:`${progress*100}%`}}/></div>
        <p><i/>{Math.round(progress*clipDuration*fps)} / {Math.round(clipDuration*fps)} frames{" "}
          <button onClick={()=>controller.current?.abort()}><Square size={10}/> Cancel render</button>
        </p>
      </div>}
      {ready&&ready.format&&tab==="Video"&&<div className="export-proof-panel">
        <button type="button" className="button secondary" disabled={busy}
          onClick={checkEncodedFrame}>
          <Film size={15}/> Inspect REAL {ready.format.toUpperCase()} frame vs PNG
        </button>
        <p className="export-note">Checks the already-exported <strong>{ready.filename}</strong>, not a pretend video test.
          Decodes an actual compressed frame, renders a matched-clock strict PNG,
          and compares their pixels. 1080px maximum for this diagnostic.
          This does not compare the DOM text overlay or certify the whole clip.</p>
        {frameAudit&&frameAudit.filename===ready.filename&&<div className="export-truth-panel">
          <strong>🧪 Encoded Frame Truth Serum — {frameAudit.report.metrics.discrepancy} discrepancy</strong>
          <div className="export-truth-metrics">
            <div><strong>{frameAudit.report.metrics.meanRGBDifference}</strong>
              <span>Mean RGB difference / 255</span></div>
            <div><strong>{frameAudit.report.metrics.pixelsOverThresholdPercent}%</strong>
              <span>Pixels with any channel more than 36/255 apart</span></div>
            <div><strong>{frameAudit.report.metrics.p95PeakDifference}</strong>
              <span>95th-percentile peak channel difference</span></div>
            <div><strong>{frameAudit.report.firstDecodedFrameSeconds}s</strong>
              <span>Actual decoded MP4/GIF frame time</span></div>
          </div>
          <div className="blend-proof-grid" aria-label="Real decoded video-frame pixel comparison">
            <figure><img src={frameAudit.urls[0]} alt="Matched-timestamp strict PNG reference"/>
              <figcaption>A · Same-clock strict PNG</figcaption></figure>
            <figure><img src={frameAudit.urls[1]} alt="Decoded first GIF or MP4 frame, not a renderer simulation"/>
              <figcaption>B · REAL decoded {ready.format.toUpperCase()}</figcaption></figure>
            <figure><img src={frameAudit.urls[2]} alt="Amplified pixel differences: bright orange means stronger disagreement"/>
              <figcaption>C · Difference heatmap (4× amplified)</figcaption></figure>
          </div>
          <p className="export-note">{frameAudit.report.actualSize.width} × {frameAudit.report.actualSize.height} decoded using {frameAudit.report.decoder}.
            {frameAudit.report.actualSize.width!==frameAudit.report.requestedSize.width||
              frameAudit.report.actualSize.height!==frameAudit.report.requestedSize.height?
              " The codec changed output dimensions; inspect cropping or padding.":""}
            {" "}High discrepancy warrants investigation; H.264 compression, GIF palettes,
            native-recorder timing and frame-memory effects can legitimately shift pixels.
            It's a single-frame comparison, not automatic proof of missing effects.</p>
          <button type="button" className="button secondary" disabled={busy}
            onClick={saveFrameAudit}>Save frame-integrity report (JSON; no art/text)</button>
        </div>}
      </div>}
      {ready&&ready.format&&tab==="Video"&&<div className="export-proof-panel">
        <button type="button" className="button secondary" disabled={busy}
          onClick={inspectClipMotion}>
          <Film size={15}/> Full-Clip Motion Forensics · opening / middle / final
        </button>
        <p className="export-note">Samples THREE frames from the actual saved {ready.format.toUpperCase()} file,
          compares each with its true-clock strict PNG, and checks whether motion
          survived encoding. 480/720px clips only, to protect iPhone memory.
          It never re-encodes your work or generates replacement art.</p>
        {motionAudit&&motionAudit.filename===ready.filename&&<div className="export-truth-panel">
          <strong>🕵️ {motionAudit.motion.status}</strong>
          <div className="export-truth-metrics">
            <div><strong>{motionAudit.motion.referenceMeanRGBMotion}</strong>
              <span>Reference motion · mean RGB change / 255</span></div>
            <div><strong>{motionAudit.motion.encodedMeanRGBMotion}</strong>
              <span>Actual encoded motion · mean RGB change / 255</span></div>
            <div><strong>{motionAudit.motion.motionRetention===null?"—":
              Math.round(motionAudit.motion.motionRetention*100)+"%"}</strong>
              <span>Encoded/reference motion ratio (not an accuracy score)</span></div>
            <div><strong>3</strong>
              <span>Real decoded frames inspected</span></div>
          </div>
          <div className="pane-actions" aria-label="Choose the decoded frame to inspect">
            {motionAudit.rows.map((row,i)=><button type="button"
              key={row.label} disabled={busy}
              className={selectedMotionIndex===i?"button primary":"button secondary"}
              onClick={()=>setSelectedMotionIndex(i)}>
              {row.label} · {row.referenceTime.toFixed(2)}s
            </button>)}
          </div>
          <div className="blend-proof-grid" aria-label="Three-frame full-clip export inspection">
            <figure><img src={motionAudit.rows[selectedMotionIndex].urls[0]}
              alt="Strict PNG rendered at the corresponding video frame's clock"/>
              <figcaption>Strict PNG · {motionAudit.rows[selectedMotionIndex].label}</figcaption></figure>
            <figure><img src={motionAudit.rows[selectedMotionIndex].urls[1]}
              alt="Frame actually decoded from the exported GIF or MP4"/>
              <figcaption>Actual decoded {ready.format.toUpperCase()}</figcaption></figure>
            <figure><img src={motionAudit.rows[selectedMotionIndex].urls[2]}
              alt="Amplified encoded-versus-PNG pixel discrepancy heatmap"/>
              <figcaption>Difference heatmap (4×)</figcaption></figure>
          </div>
          <p className="export-note">Reference shader time:
            {" "+motionAudit.rows[selectedMotionIndex].referenceTime.toFixed(3)}s.
            Decoded presentation time:
            {" "+motionAudit.rows[selectedMotionIndex].decodedTime.toFixed(3)}s.
            GIF display delays are rounded to 10ms; the shader renders
            at exact frame-index/FPS time.</p>
          <p className="export-note">Selected frame: mean RGB difference
            {" "+motionAudit.rows[selectedMotionIndex].difference.meanRGBDifference}/255;
            {" "+motionAudit.rows[selectedMotionIndex].difference.pixelsOverThresholdPercent}%
            of pixels have a color channel more than 36/255 apart.</p>
          <p className="export-note">Motion intervals:
            {motionAudit.motion.betweenSamples.map(step=>
              <span key={step.between}> {step.between}: PNG {step.reference.meanRGBChange}
                {" / "} encoded {step.encoded.meanRGBChange};</span>)}
          </p>
          {ready.loopMode!=="Off"&&<p className="export-note">
            Loop Surgery was enabled for this clip. The strict PNG references
            do not include the optional closing blend, so the final-frame
            difference is intentional; use Loop Seam Scanner to check the
            actual encoded wrap instead of treating tail differences as export loss.
          </p>}
          <p className="export-note">A possible freeze warning requires the reference to
            demonstrate meaningful motion while the encoded frames barely change.
            Static artwork, H.264 compression, GIF palette reduction, native-recorder
            frame timing and GPU feedback history can distort these results.
            If the MP4 decoder returns repeated timestamps, the audit marks
            motion inconclusive rather than falsely accusing the encoder.
            This checks three sampled frames—not every frame, seamless loops or
            DOM/CSS live-preview typography.</p>
          <button type="button" className="button secondary" disabled={busy}
            onClick={saveMotionAudit}>Save motion-forensics report (JSON; no artwork pixels)</button>
        </div>}
      </div>}
      {ready&&ready.format&&tab==="Video"&&<div className="export-proof-panel">
        <button type="button" className="button secondary" disabled={busy}
          onClick={inspectLoopSeam}>
          <Film size={15}/> Loop Seam Scanner · seven decoded checkpoints
        </button>
        <p className="export-note">Does the last frame snap back to the first?
          This samples seven ACTUAL encoded GIF/MP4 frames and compares the
          loop jump with normal frame-to-frame motion. Also checks transitions
          around the midpoint. No new video encoding or shader rendering;
          480/720px clips only to protect mobile memory.</p>
        {seamAudit&&seamAudit.filename===ready.filename&&<div className="export-truth-panel">
          <strong>🪡 {seamAudit.results.status}</strong>
          <div className="export-truth-metrics">
            <div><strong>{seamAudit.results.seamMeanRGB}</strong>
              <span>Last → first · mean RGB jump / 255</span></div>
            <div><strong>{seamAudit.results.edgeBaselineRGB}</strong>
              <span>Ordinary one-frame edge motion / 255</span></div>
            <div><strong>{seamAudit.results.seamToEdgeRatio}×</strong>
              <span>Seam jump vs adjacent edge motion</span></div>
            <div><strong>{seamAudit.results.largestMidpointRGB}</strong>
              <span>Largest midpoint one-frame change / 255</span></div>
          </div>
          <div className="pane-actions" aria-label="Choose loop seam or midpoint frame comparison">
            {["wrap","midIn","midOut"].map(key=><button type="button" key={key}
              disabled={busy}
              className={selectedSeamView===key?"button primary":"button secondary"}
              onClick={()=>setSelectedSeamView(key)}>
              {seamAudit.views[key].label}
            </button>)}
          </div>
          <div className="blend-proof-grid" aria-label="Actual encoded frame-to-frame discontinuity">
            <figure><img src={seamAudit.views[selectedSeamView].urls[0]}
              alt="Earlier actual encoded MP4 or GIF frame of selected pair"/>
              <figcaption>Real frame {seamAudit.views[selectedSeamView].leftIndex}</figcaption></figure>
            <figure><img src={seamAudit.views[selectedSeamView].urls[1]}
              alt="Later actual encoded MP4 or GIF frame of selected pair"/>
              <figcaption>Real frame {seamAudit.views[selectedSeamView].rightIndex}</figcaption></figure>
            <figure><img src={seamAudit.views[selectedSeamView].urls[2]}
              alt="Amplified heatmap of differences between those two real encoded frames"/>
              <figcaption>Discontinuity heatmap (4×)</figcaption></figure>
          </div>
          {seamAudit.results.decodedTimingWarning&&
            <p className="field-error">Decoder uncertainty: {seamAudit.results.decodedTimingWarning}.
              This is NOT proof that the exported animation is broken.</p>}
          <p className="export-note">Actual opening step:
            {" "+seamAudit.results.openingStep.meanRGBChange}/255.
            Actual ending step:
            {" "+seamAudit.results.endingStep.meanRGBChange}/255.
            Midpoint before/after:
            {" "+seamAudit.results.midpointBefore.meanRGBChange} /
            {" "+seamAudit.results.midpointAfter.meanRGBChange}/255.
            A strong loop snap means the end-to-start transition is unusually
            different from the normal changes near both ends.</p>
          {ready.loopMode!=="Off"&&<p className="export-note">
            Loop Surgery softened this exported loop using a
            {" "+ready.loopBlendSeconds}s tail crossfade to the actual opening
            frame. End→Start should be much gentler. MP4 codec differences,
            moving textures and temporary ghosting can still be visible.
          </p>}
          <p className="export-note">An intentional glitch, camera cut, rhythmic
            pulse or abrupt transformation may trigger a warning on purpose.
            This is a visual clue, not automatic proof of an encoder bug or
            a mathematically perfect seamless loop. MP4 seeking is approximate;
            GIF playback delays are quantized to 10ms. Seven checkpoints
            cannot reveal every possible jump elsewhere in the clip.</p>
          <button type="button" className="button secondary" disabled={busy}
            onClick={saveSeamAudit}>Save loop-seam report (JSON; no image pixels)</button>
        </div>}
      </div>}
      {ready&&!busy&&canShare()&&<button className="button secondary export-submit" onClick={share}>
        <Share2 size={17}/> Share finished {ready.type==="image/gif"?"GIF":"MP4"} to Photos / apps
      </button>}
      <button className="button primary export-submit"
        disabled={busy||(tab==="Video"&&clipFormat==="mp4"&&!capability)} onClick={run}>
        {busy?<LoaderCircle className="spin" size={17}/>:<Download size={17}/>}{" "}
        {busy?"Rendering your creation…":
          tab==="Image"?"Export PNG":tab==="Recipe"?"Export recipe":
          clipFormat==="mp4"?"Render & download MP4":"Render & download GIF"}
      </button>
    </Modal>
  );
}
