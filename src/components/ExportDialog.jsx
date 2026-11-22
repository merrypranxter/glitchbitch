import React, { useEffect, useRef, useState } from "react";
import { Download, Image, Film, Braces, Check, Square, LoaderCircle, Share2 } from "lucide-react";
import Modal from "./Modal";
import { Select } from "./Controls";
import { ratios, recipeDocument } from "../data";
import { dimensions, videoDimensions, renderImage, download, recordClip, videoFormat, clockAt } from "../export";
import {analyzeEncodedFrame,differenceHeatmap,decodeStaticExport,
  decodeMp4Export,frameBlob,frameAuditReport} from "../encoded-frame-truth-serum.js";
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
    [ratio,setRatio]=useState(state.ratio),
    [busy,setBusy]=useState(false),
    [progress,setProgress]=useState(0),
    [error,setError]=useState(""),
    [proof,setProof]=useState(null),
    [blendProof,setBlendProof]=useState(null),
    [diagnostics,setDiagnostics]=useState(null),
    [ready,setReady]=useState(null),
    [frameAudit,setFrameAudit]=useState(null);
  const controller=useRef(null), mounted=useRef(true), proofUrl=useRef(null), blendUrls=useRef([]),
    frameAuditUrls=useRef([]);
  function clearFrameAudit(){
    frameAuditUrls.current.forEach(url=>URL.revokeObjectURL(url));
    frameAuditUrls.current=[];
    setFrameAudit(null);
  }
  const capability=videoFormat();
  useEffect(()=>()=>{mounted.current=false;controller.current?.abort();
    onExportBusy?.(false);
    if(proofUrl.current) URL.revokeObjectURL(proofUrl.current);
    blendUrls.current.forEach(url=>URL.revokeObjectURL(url));
    frameAuditUrls.current.forEach(url=>URL.revokeObjectURL(url));
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
          duration:clipDuration,fps,bitrate,
          onProgress:p=>{if(mounted.current)setProgress(p);},
          signal:controller.current.signal,
        });
        const filename=`glitch-${state.seed}-${size.width}x${size.height}-${Math.round(clipDuration)}s.${result.extension}`;
        download(result.blob,filename);
        if(mounted.current)setReady({blob:result.blob,filename,type:result.mime,
          snapshot,timeline,frameSize:{...size},method:result.method,
          duration:clipDuration,fps:result.fps,format:clipFormat});
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
            onClick={()=>{setTab(name);setError("");setReady(null);}} key={name}>
            <Icon size={17}/>{name}
          </button>
        ))}
      </div>
      <fieldset disabled={busy} className="export-options">
        {tab!=="Recipe"?<>
          {tab==="Video"&&<Select label="Output format" value={clipFormat}
            onChange={v=>{setClipFormat(v);setReady(null);}}>
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
            <Select label="Clip duration" value={clipDuration} onChange={v=>setDuration(+v)}>
              {(clipFormat==="gif"?[2,3,5,10]:[2,3,5,6,10,15,30])
                .map(v=><option key={v} value={v}>{v} seconds</option>)}
            </Select>
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
      {busy&&tab==="Video"&&<div className="record-progress">
        <div><span style={{width:`${progress*100}%`}}/></div>
        <p><i/>{Math.round(progress*clipDuration*fps)} / {Math.round(clipDuration*fps)} frames{" "}
          <button onClick={()=>controller.current?.abort()}><Square size={10}/> Cancel render</button>
        </p>
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
