import React, { useEffect, useRef, useState } from "react";
import { Download, Image, Film, Braces, Check, Square, LoaderCircle, Share2 } from "lucide-react";
import Modal from "./Modal";
import { Select } from "./Controls";
import { ratios, recipeDocument } from "../data";
import { dimensions, videoDimensions, renderImage, download, recordClip, videoFormat } from "../export";
export default function ExportDialog({ state, title, timelineRef, onClose, onNotice }) {
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
    [ready,setReady]=useState(null);
  const controller=useRef(null), mounted=useRef(true), proofUrl=useRef(null);
  const capability=videoFormat();
  useEffect(()=>()=>{mounted.current=false;controller.current?.abort();
    if(proofUrl.current) URL.revokeObjectURL(proofUrl.current);
  },[]);
  const size=tab==="Video" ? clipFormat==="mp4"
    ? videoDimensions(ratio,videoSize) : dimensions(ratio,gifSize)
    : dimensions(ratio,longEdge);
  const fps=clipFormat==="gif" ? 15 : frameRate;
  const clipDuration=clipFormat==="gif"?Math.min(duration,10):duration;
  async function makeProof(){
    if(busy)return;
    setBusy(true);setError("");
    const snapshot={...state,ratio},timeline={...timelineRef.current};
    try {
      // This is the SAME compositing function used by the PNG and video
      // workspace, not a screenshot of the CSS live preview.
      const blob=await renderImage(snapshot,timeline,480);
      if(!mounted.current)return;
      const url=URL.createObjectURL(blob);
      if(proofUrl.current)URL.revokeObjectURL(proofUrl.current);
      proofUrl.current=url;
      setProof({url,ratio,seed:state.seed});
    }catch(e){
      if(mounted.current)setError("Export proof could not render: "+e.message);
    }finally{
      if(mounted.current)setBusy(false);
    }
  }
  async function run() {
    setError("");setProgress(0);setBusy(true);setReady(null);
    if(tab==="Video")controller.current=new AbortController();
    const snapshot={...state,ratio},timeline={...timelineRef.current};
    try {
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
        if(mounted.current)setReady({blob:result.blob,filename,type:result.mime});
        onNotice(`${result.extension.toUpperCase()} exported. No WebM conversion necessary.`);
      } else {
        download(new Blob([JSON.stringify(recipeDocument(snapshot,title,timeline),null,2)],{type:"application/json"}),
          `glitch-${state.seed}.json`);
        onNotice("Recipe exported.");
      }
    } catch(e) {
      if(mounted.current)setError(e.name==="AbortError"?"Export cancelled; your artwork is unchanged.":e.message);
    } finally {if(mounted.current)setBusy(false);controller.current=null;}
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
        {proof&&proof.ratio===ratio&&proof.seed===state.seed&&
          <img src={proof.url}
            alt="Flattened frame from the actual PNG/GIF/MP4 compositing engine" />}
        <p className="export-note">Proof uses the export renderer—not the live browser text overlay.
          Check the color and glow here before posting your GIF or MP4.
          It's a single frame; animations and feedback may change through the clip.</p>
      </div>}
      {error&&<p className="field-error" role="alert">{error}</p>
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
