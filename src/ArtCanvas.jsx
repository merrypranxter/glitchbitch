import React, { useRef, useEffect, useState } from "react";
import { createRenderer, previewDimensions } from "./renderer";
import { retroFontRevision } from "./retro-fonts";
import LiveTextOverlay from "./LiveTextOverlay.jsx";
import {hasSemanticLettering} from "./semantic-gravity.js";
import { TouchSession } from "./gestures";
import { HabitatSession, habitatTools } from "./habitat-painter.js";
import { ratios, touchModes } from "./data";

export default function ArtCanvas({
  history,
  playing,
  timelineRef,
  canvasRef,
  quality,
  onStatus,
  onTime,
  tool,
  showHandles,
  selected,
  onSelect,
}) {
  const stageRef = useRef(null),
    session = useRef(null),
    runtime = useRef({ playing, quality, tool }),
    [size, setSize] = useState({ width: 1, height: 1 });
  const [error, setError] = useState(""),
    [fallbackNotice, setFallbackNotice] = useState(""),
    [recovering, setRecovering] = useState(false),
    [retry, setRetry] = useState(0);
  runtime.current = { playing, quality, tool };
  const actions = useRef(history);
  actions.current = history;
  const ratio = ratios.find((r) => r.id === history.state.ratio)?.value || 1;
  const cancel = () => {
    if(textDrag.current){textDrag.current=null;actions.current.cancel();}
    if (session.current) {
      session.current = null;
      actions.current.cancel();
    }
  };
  useEffect(() => {
    const element = stageRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      cancel();
      const b = entry.contentRect,
        w = Math.max(1, Math.min(b.width, b.height * ratio));
      setSize({ width: w, height: w / ratio });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ratio]);
  useEffect(() => {
    const canvas = canvasRef.current;
    let renderer,
      frame,
      last = performance.now(),
      lastDraw = 0,
      lastReport = 0,
      hidden = document.hidden,
      lost = false,
      lastState = null,
      lastW = 0,
      lastH = 0,
      lastTime = -1,
      lastColorTime = -1,
      lastTextTime = -1,
      lastFontRevision = -1,
      // Keep the preview alive through an optional-effect shader failure.
      renderRetryAt = 0,
      failedState = null,
      failedSize = "",
      failedFontRevision = -1;
    let intervals = [],
      previewScale = 1,
      lastAdjust = 0,
      lastFallbackNotice = "";
    function setup() {
      try {
        renderer = createRenderer(canvas);
        lastFallbackNotice="";
        setFallbackNotice("");
        setError("");
        setRecovering(false);
        lost = false;
        last = performance.now();
        frame = requestAnimationFrame(tick);
      } catch (e) {
        setError(e.message);
        onStatus({ error: true });
      }
    }
    function tick(now) {
      if (lost) return;
      const dt = Math.max(0, (now - last) / 1000);
      last = now;
      const state = actions.current.current.current,
        rt = runtime.current;
      if (!hidden && rt.playing) {
        // Independent, wall-clock text phase (not tied to geometry speed).
        timelineRef.current.textTime=(timelineRef.current.textTime || 0)+dt;
        if (!state.freezeGeometry)
          timelineRef.current.time += (dt * state.speed) / 30;
        if (!state.freezeColor)
          timelineRef.current.colorTime += (dt * state.colorSpeed) / 30;
      }
      // The words have their own textTime clock. Semantic Gravity's glyph
      // alpha texture follows THAT clock, even if geometry and palette are
      // frozen. Otherwise the CSS letters move but the real yarn stays stuck.
      const textDrivenFilaments=hasSemanticLettering(state);
      const animated =
        rt.playing &&
        ((!state.freezeGeometry && state.speed > 0) ||
          (!state.freezeColor && state.colorSpeed > 0) ||
          textDrivenFilaments);
      const cssW = canvas.clientWidth,
        cssH = canvas.clientHeight;
      const dims = previewDimensions(cssW, cssH, rt.quality, previewScale);
      const fontRevision=retroFontRevision();
      const sizeKey=dims.width+"x"+dims.height;
      // Retry at once when state/font/resolution changes, otherwise throttle
      // a failed GPU compile to one attempt per 1.8s (not 60 attempts/sec).
      const retryAllowed=now>=renderRetryAt ||
        failedState!==state || failedSize!==sizeKey ||
        failedFontRevision!==fontRevision;
      const seeked =
        !animated &&
        (lastTime !== timelineRef.current.time ||
          lastColorTime !== timelineRef.current.colorTime ||
          (textDrivenFilaments &&
            lastTextTime !== (timelineRef.current.textTime || 0)));
      if (
        !hidden &&
        retryAllowed &&
        renderer.ready() &&
        ((animated && now - lastDraw >= 1000 / 30 - 1) ||
          lastState !== state ||
          lastFontRevision !== fontRevision ||
          lastW !== dims.width ||
          lastH !== dims.height ||
          seeked)
      ) {
        const drawInterval = now - lastDraw;
        try {
          if(!renderer.draw(state, timelineRef.current, dims.width, dims.height))
            throw Error("Artwork frame did not complete; retrying the renderer.");
          // Warning, not a destructive redraw: source art and all controls
          // remain untouched while the GPU reports unsupported optional FX.
          const notice=renderer.fallbackNotice(state);
          if(notice!==lastFallbackNotice){
            lastFallbackNotice=notice;
            setFallbackNotice(notice);
          }
          if(failedState!==null){
            failedState=null;renderRetryAt=0;
            setError("");
          }
          lastState = state;
          lastFontRevision = fontRevision;
          lastW = dims.width;
          lastH = dims.height;
          lastDraw = now;
          lastTime = timelineRef.current.time;
          lastColorTime = timelineRef.current.colorTime;
          lastTextTime = timelineRef.current.textTime || 0;
        } catch (e) {
          failedState=state;
          failedSize=sizeKey;
          failedFontRevision=fontRevision;
          renderRetryAt=now+1800;
          setError(e?.message||"Artwork frame could not render.");
          onStatus({error:true});
          // Do not permanently kill the RAF after one WebGL failure.
          // The existing Retry button can still recreate the GPU context.
          frame=requestAnimationFrame(tick);
          return;
        }
        if (
          animated &&
          lastDraw > 0 &&
          drawInterval > 0 &&
          drawInterval < 10000
        ) {
          intervals.push(drawInterval);
          if (intervals.length > 90) intervals.shift();
        }
      }
      if (now - lastReport > 1000) {
        const sorted = intervals.slice(-90).sort((a, b) => a - b),
          median = sorted[Math.floor(sorted.length / 2)] || 16.67;
        onStatus({
          width: dims.width,
          height: dims.height,
          fps:
            animated && sorted.length ? Math.round(10000 / median) / 10 : null,
          quality: rt.quality,
          scale: previewScale,
        });
        onTime({ ...timelineRef.current });
        lastReport = now;
        if (
          rt.quality === "Auto" &&
          animated &&
          sorted.length >= 8 &&
          now - lastAdjust > 5000
        ) {
          if (median > 45 && previewScale > 0.55) {
            previewScale = previewScale === 1 ? 0.75 : 0.55;
            lastAdjust = now;
          } else if (
            median < 36 &&
            previewScale < 1 &&
            now - lastAdjust > 15000
          ) {
            previewScale = previewScale === 0.55 ? 0.75 : 1;
            lastAdjust = now;
          }
          intervals = [];
        }
      }
      frame = requestAnimationFrame(tick);
    }
    function visibility() {
      hidden = document.hidden;
      last = performance.now();
      intervals = [];
      if (hidden) cancel();
    }
    function loss(e) {
      e.preventDefault();
      lost = true;
      cancelAnimationFrame(frame);
      cancel();
      setRecovering(true);
    }
    function restore() {
      renderer?.destroy();
      setup();
    }
    function interrupt(e) {
      if (e.type === "blur" || e.key === "Escape") cancel();
    }
    document.addEventListener("visibilitychange", visibility);
    canvas.addEventListener("webglcontextlost", loss);
    canvas.addEventListener("webglcontextrestored", restore);
    window.addEventListener("blur", interrupt);
    window.addEventListener("keydown", interrupt);
    setup();
    return () => {
      cancelAnimationFrame(frame);
      cancel();
      renderer?.destroy(true);
      document.removeEventListener("visibilitychange", visibility);
      canvas.removeEventListener("webglcontextlost", loss);
      canvas.removeEventListener("webglcontextrestored", restore);
      window.removeEventListener("blur", interrupt);
      window.removeEventListener("keydown", interrupt);
    };
  }, [retry]);
  function point(e) {
    const r = canvasRef.current.getBoundingClientRect();
    return {
      id: e.pointerId,
      x: Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)),
      y: 1 - Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)),
    };
  }
  function preview() {
    const s = session.current;
    if (!s) return;
    history.preview(s.draft);
    if (s.target >= 0) onSelect(s instanceof HabitatSession
      ? s.draft.habitatStamps?.[s.target]?.id || null
      : s.draft.marks[s.target]?.id || null);
  }
  const textDrag = useRef(null);
  function down(e) {
    if (e.button !== 0) return;
    if(history.state.letteringDrag && history.state.lettering.trim() &&
       !habitatTools.includes(runtime.current.tool)){
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      history.begin();
      const origin=point(e);
      textDrag.current={id:e.pointerId,x:origin.x,y:origin.y,
        startX:history.state.letteringX,startY:history.state.letteringY};
      return;
    }
    e.preventDefault();
    const p = point(e),
      surface = e.currentTarget;
    surface.setPointerCapture(e.pointerId);
    if (session.current) {
      session.current.add(p);
    } else {
      history.begin();
      let activeTool = runtime.current.tool;
      if(habitatTools.includes(activeTool)){
        const colonyHandle=e.target.closest("[data-colony]");
        let targetId=null;
        if(colonyHandle && activeTool!=="Erase Colony"){
          const seed=history.current.current.habitatStamps?.find(x=>x.id===colonyHandle.dataset.colony);
          if(seed){
            targetId=seed.id;
            activeTool="Move Colony";
            p.x=seed.x;p.y=seed.y;
          }
        }
        session.current=new HabitatSession(
          history.current.current,activeTool,p,ratio,targetId);
      }else{
      const handle = e.target.closest("[data-force]");
      if (handle && activeTool !== "Erase") {
        const mark = history.current.current.marks.find(
          (m) => m.id === handle.dataset.force,
        );
        if (mark) {
          p.x = mark.x;
          p.y = mark.y;
          activeTool = "Move";
        }
      }
      session.current = new TouchSession(
        history.current.current,
        activeTool,
        p,
        ratio,
      );
      }
    }
    preview();
  }
  function move(e) {
    if(textDrag.current && e.pointerId===textDrag.current.id){
      const start=textDrag.current,now=point(e);
      history.preview(s=>({...s,
        letteringX:Math.max(0,Math.min(100,start.startX+(now.x-start.x)*100)),
        letteringY:Math.max(0,Math.min(100,start.startY+(now.y-start.y)*100))}));
      return;
    }
    if (session.current) {
      session.current.move(point(e));
      preview();
    }
  }
  function up(e) {
    if(textDrag.current && e.pointerId===textDrag.current.id){
      textDrag.current=null;history.end();return;
    }
    if (!session.current) return;
    if (session.current.release(e.pointerId)) {
      session.current = null;
      history.end();
    }
  }
  const handles = showHandles || (tool !== "Paint" && !habitatTools.includes(tool));
  const colonyHandles=showHandles||habitatTools.includes(tool);
  return (
    <div className="art-stage" ref={stageRef}>
      <div
        className="art-surface"
        style={{ width: size.width, height: size.height }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={cancel}
        onLostPointerCapture={(e) => {
          if (textDrag.current?.id===e.pointerId || session.current?.pointers.has(e.pointerId)) cancel();
        }}
      >
        <canvas
          ref={canvasRef}
          aria-label="Animated artwork. Plant living colonies using the habitat touch tools, or drag with the normal brush to warp the artwork."
        />
        <LiveTextOverlay state={history.state} width={size.width} height={size.height} playing={playing} timelineRef={timelineRef} />
        {handles &&
          history.state.marks.map((m, i) => (
            <button
              key={m.id}
              data-force={m.id}
              className={"force-handle " + (selected === m.id ? "active" : "")}
              style={{ left: `${m.x * 100}%`, top: `${(1 - m.y) * 100}%` }}
              aria-label={`${touchModes[m.mode]} force ${i + 1}`}
              onFocus={() => onSelect(m.id)}
              onKeyDown={(e) => {
                if (
                  ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(
                    e.key,
                  )
                ) {
                  e.preventDefault();
                  history.change((s) => ({
                    ...s,
                    marks: s.marks.map((x) =>
                      x.id === m.id
                        ? {
                            ...x,
                            x: Math.max(
                              0,
                              Math.min(
                                1,
                                x.x +
                                  (e.key === "ArrowLeft"
                                    ? -0.01
                                    : e.key === "ArrowRight"
                                      ? 0.01
                                      : 0),
                              ),
                            ),
                            y: Math.max(
                              0,
                              Math.min(
                                1,
                                x.y +
                                  (e.key === "ArrowDown"
                                    ? -0.01
                                    : e.key === "ArrowUp"
                                      ? 0.01
                                      : 0),
                              ),
                            ),
                          }
                        : x,
                    ),
                  }));
                }
              }}
            >
              <span>{i + 1}</span>
            </button>
          ))}
        {colonyHandles && (history.state.habitatStamps||[]).map((m,i) => (
          <button
            type="button"
            key={m.id}
            data-colony={m.id}
            className={"habitat-handle " +(m.parent===0?"habitat-a":"habitat-b")+
              (selected===m.id?" active":"")}
            style={{left:`${m.x*100}%`,top:`${(1-m.y)*100}%`,
              "--habitat-halo":`${Math.max(20,m.radius*size.height*2)}px`}}
            aria-label={`Habitat ${m.parent===0?"A":"B"} colony ${i+1}. Drag to move, arrow keys to nudge, plus/minus to resize.`}
            title={`Colony ${i+1} · parent ${m.parent===0?"A":"B"}`}
            onFocus={()=>onSelect(m.id)}
            onKeyDown={e=>{
              if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","+","=","-"].includes(e.key)){
                e.preventDefault();
                history.change(state=>({...state,
                  habitatStamps:state.habitatStamps.map(x=>x.id===m.id?{
                    ...x,
                    x:Math.min(1,Math.max(0,x.x+(e.key==="ArrowLeft"?-.01:e.key==="ArrowRight"?.01:0))),
                    y:Math.min(1,Math.max(0,x.y+(e.key==="ArrowDown"?-.01:e.key==="ArrowUp"?.01:0))),
                    radius:Math.min(.45,Math.max(.05,x.radius+(e.key==="+"||e.key==="="? .01:e.key==="-"?-.01:0))),
                  }:x)}));
              }
            }}
          >{m.parent===0?"A":"B"}</button>
        ))}
        <div className="canvas-tag">
          <i />
          {playing ? "LIVE GENERATIVE ART" : "A MOMENT, HELD STILL"}
        </div>
        {fallbackNotice && !error && !recovering && (
          <div className="render-parity-warning" role="status">
            <strong>Preview simplified by this GPU:</strong> {fallbackNotice}.
            Exact MP4/GIF export will not silently omit these effects.
            Try reducing heavy layers or use a stronger device.
          </div>
        )}
        {(error || recovering) && (
          <div className="render-error" role="alert">
            <strong>
              {recovering
                ? "Restoring your artwork…"
                : "The renderer needs a hand."}
            </strong>
            <p>
              {error || "Rebuilding graphics while preserving your recipe."}
            </p>
            {error && (
              <button className="button" onClick={() => setRetry((x) => x + 1)}>
                Retry renderer
              </button>
            )}
          </div>
        )}
      </div>
      <button
        className="fullscreen-exit"
        onClick={() => document.exitFullscreen?.()}
      >
        Exit fullscreen
      </button>
    </div>
  );
}
