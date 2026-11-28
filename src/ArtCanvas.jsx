import React, { useRef, useEffect, useState, useMemo } from "react";
import { Move, ZoomIn, ZoomOut, Maximize, Minimize } from "lucide-react";
import { createRenderer, previewDimensions } from "./renderer";
import { retroFontRevision } from "./retro-fonts";
import LiveTextOverlay from "./LiveTextOverlay.jsx";
import {hasSemanticLettering} from "./semantic-gravity.js";
import { TouchSession } from "./gestures";
import { HabitatSession, habitatTools } from "./habitat-painter.js";
import { ratios, touchModes } from "./data";
import {
  FIT_VIEW, MIN_ZOOM, MAX_ZOOM, clampView, zoomAt, pinchView, panBy, stepZoom,
  isFit, zoomLabel, renderScaleForZoom,
} from "./view-zoom.js";

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
  focus = false,
  onFocusToggle = null,
}) {
  const stageRef = useRef(null),
    session = useRef(null),
    runtime = useRef({ playing, quality, tool }),
    [size, setSize] = useState({ width: 1, height: 1 });
  // Preview-only zoom/pan (a CSS transform; exports and recipes never see it).
  const [view, setView] = useState(FIT_VIEW),
    [panMode, setPanMode] = useState(false);
  const viewRef = useRef(FIT_VIEW),
    sizeRef = useRef(size),
    panModeRef = useRef(false),
    viewGesture = useRef(null),
    lastTap = useRef(null),
    viewFrame = useRef(0),
    renderZoomRef = useRef(1),
    renderZoomTimer = useRef(0);
  sizeRef.current = size;
  panModeRef.current = panMode;
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
      // Dragging the divider or rotating the phone keeps the zoomed view on
      // the artwork instead of stranding it off the edge.
      const kept = clampView(viewRef.current, {
        stageW: b.width, stageH: b.height, surfaceW: w, surfaceH: w / ratio,
      });
      viewRef.current = kept;
      setView(kept);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ratio]);
  // A new aspect ratio is a different picture: start that one at Fit.
  useEffect(() => {
    viewRef.current = FIT_VIEW;
    setView(FIT_VIEW);
    renderZoomRef.current = 1;
  }, [ratio]);
  useEffect(() => () => {
    cancelAnimationFrame(viewFrame.current);
    clearTimeout(renderZoomTimer.current);
  }, []);
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
      // While zoomed in, render more backing pixels so the close-up is not a
      // blurry stretch. The quality budget in previewDimensions still caps it.
      const renderZoom = renderZoomRef.current;
      const cssW = canvas.clientWidth * renderZoom,
        cssH = canvas.clientHeight * renderZoom;
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
  // ---- Preview zoom & pan ------------------------------------------------
  function stageBounds() {
    const stage = stageRef.current;
    if (!stage) return null;
    return {
      stageW: stage.clientWidth, stageH: stage.clientHeight,
      surfaceW: sizeRef.current.width, surfaceH: sizeRef.current.height,
    };
  }
  function applyView(next) {
    viewRef.current = next;
    // One React update per frame keeps a fast pinch smooth on iPhone.
    if (!viewFrame.current)
      viewFrame.current = requestAnimationFrame(() => {
        viewFrame.current = 0;
        setView(viewRef.current);
      });
    // Re-render at a sharper resolution only once the gesture settles, so the
    // GPU is not reallocating buffers on every finger movement.
    clearTimeout(renderZoomTimer.current);
    renderZoomTimer.current = setTimeout(() => {
      renderZoomRef.current = renderScaleForZoom(viewRef.current.zoom);
    }, 180);
  }
  const zoomStep = (dir) =>
    applyView(zoomAt(viewRef.current, stepZoom(viewRef.current.zoom, dir), { x: 0, y: 0 }, stageBounds()));
  const zoomFit = () => applyView(FIT_VIEW);
  function stagePoint(e) {
    const r = stageRef.current.getBoundingClientRect();
    return { x: e.clientX - r.left - r.width / 2, y: e.clientY - r.top - r.height / 2 };
  }
  function gestureBase(g) {
    const pts = [...g.pointers.values()];
    if (pts.length >= 2) {
      const [a, b] = pts;
      return { mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
        dist: Math.max(10, Math.hypot(a.x - b.x, a.y - b.y)), view: viewRef.current };
    }
    return { mid: pts[0], dist: 0, view: viewRef.current };
  }
  // Pan/zoom gestures start on the stage: anywhere in Pan & zoom mode, or on
  // the dark margin around the artwork at any time. Painting is untouched.
  function viewDown(e) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (session.current || textDrag.current) return;
    if (e.target.closest(".view-controls, .view-focus, .render-error, .fullscreen-exit")) return;
    e.preventDefault();
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* pointer already gone */ }
    const p = stagePoint(e);
    if (!viewGesture.current)
      viewGesture.current = { pointers: new Map(), moved: 0, startedAt: performance.now(), origin: p };
    const g = viewGesture.current;
    if (g.pointers.size >= 2) return;
    g.pointers.set(e.pointerId, p);
    if (g.pointers.size === 2) g.moved = Infinity; // a pinch is never a tap
    g.base = gestureBase(g);
  }
  function viewMove(e) {
    const g = viewGesture.current;
    if (!g || !g.pointers.has(e.pointerId)) return;
    const p = stagePoint(e);
    g.pointers.set(e.pointerId, p);
    const bounds = stageBounds();
    if (g.pointers.size >= 2) {
      const [a, b] = [...g.pointers.values()];
      applyView(pinchView(g.base.view, g.base.mid, g.base.dist,
        { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, Math.hypot(a.x - b.x, a.y - b.y), bounds));
    } else {
      g.moved = Math.max(g.moved, Math.hypot(p.x - g.origin.x, p.y - g.origin.y));
      applyView(panBy(g.base.view, p.x - g.base.mid.x, p.y - g.base.mid.y, bounds));
    }
  }
  function viewUp(e) {
    const g = viewGesture.current;
    if (!g || !g.pointers.has(e.pointerId)) return;
    g.pointers.delete(e.pointerId);
    if (g.pointers.size) {
      g.base = gestureBase(g); // lifting one finger of a pinch keeps panning smoothly
      return;
    }
    viewGesture.current = null;
    if (e.type !== "pointerup" || g.moved > 8 || performance.now() - g.startedAt > 320) return;
    // Double-tap: zoom in right there; double-tap again to fit everything.
    const p = stagePoint(e), now = performance.now(), prev = lastTap.current;
    if (prev && now - prev.t < 340 && Math.hypot(p.x - prev.x, p.y - prev.y) < 32) {
      lastTap.current = null;
      applyView(viewRef.current.zoom < 1.5
        ? zoomAt(viewRef.current, 2.5, p, stageBounds())
        : FIT_VIEW);
    } else lastTap.current = { t: now, x: p.x, y: p.y };
  }
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    // Mouse wheel / trackpad pinch zooms around the cursor; two-finger
    // trackpad swipes pan. Non-passive so the page itself never zooms.
    function wheel(e) {
      e.preventDefault();
      const r = stage.getBoundingClientRect();
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? r.height : 1;
      if (!e.ctrlKey && Math.abs(e.deltaX) > 0.5) {
        applyView(panBy(viewRef.current, -e.deltaX * unit, -e.deltaY * unit, stageBounds()));
        return;
      }
      const focal = { x: e.clientX - r.left - r.width / 2, y: e.clientY - r.top - r.height / 2 };
      const factor = Math.exp(-e.deltaY * unit * (e.ctrlKey ? 0.01 : 0.0015));
      applyView(zoomAt(viewRef.current, viewRef.current.zoom * factor, focal, stageBounds()));
    }
    // Keyboard: + / − zoom, 0 fits. Ignored while typing or inside dialogs.
    function key(e) {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target;
      if (t?.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t?.tagName)) return;
      if (document.querySelector("dialog[open]")) return;
      if (e.key === "+" || e.key === "=") zoomStep(1);
      else if (e.key === "-" || e.key === "_") zoomStep(-1);
      else if (e.key === "0") zoomFit();
      else return;
      e.preventDefault();
    }
    // iOS Safari also fires its own gesture events for pinches; block them on
    // the stage so a pinch zooms the artwork, never the whole web page.
    const noPageZoom = (e) => e.preventDefault();
    stage.addEventListener("wheel", wheel, { passive: false });
    stage.addEventListener("gesturestart", noPageZoom);
    stage.addEventListener("gesturechange", noPageZoom);
    window.addEventListener("keydown", key);
    return () => {
      stage.removeEventListener("wheel", wheel);
      stage.removeEventListener("gesturestart", noPageZoom);
      stage.removeEventListener("gesturechange", noPageZoom);
      window.removeEventListener("keydown", key);
    };
  }, []);
  function down(e) {
    // Pan & zoom mode (or a pinch that began on the margin) owns the stage.
    if (panModeRef.current || viewGesture.current) return;
    // Keep paint strokes from also starting a stage pan.
    e.stopPropagation();
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
  // Panning re-renders this component up to once per frame; the type layer
  // only needs to re-render when the artwork or its size actually changes.
  const textOverlay = useMemo(
    () => <LiveTextOverlay state={history.state} width={size.width} height={size.height} playing={playing} timelineRef={timelineRef} />,
    [history.state, size.width, size.height, playing, timelineRef],
  );
  const fitted = isFit(view);
  return (
    <div
      className={"art-stage" + (panMode ? " is-panning" : "")}
      ref={stageRef}
      onPointerDown={viewDown}
      onPointerMove={viewMove}
      onPointerUp={viewUp}
      onPointerCancel={viewUp}
      onLostPointerCapture={viewUp}
    >
      <div
        className={"art-surface" + (panMode ? " pan-mode" : "")}
        style={{
          width: size.width,
          height: size.height,
          transform: fitted ? undefined : `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.zoom})`,
          "--view-zoom": view.zoom,
        }}
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
        {textOverlay}
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
      </div>
      {/* Status overlays sit on the stage, not the zoomed artwork, so they
          stay readable at any zoom level. */}
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
      {panMode && (
        <div className="view-mode-badge" role="status">
          <Move size={12} /> PAN &amp; ZOOM · drag to move · pinch to zoom
        </div>
      )}
      {onFocusToggle && (
        <button
          type="button"
          className="view-focus"
          aria-pressed={focus}
          title={focus ? "Show the controls again" : "Big art: hide the controls"}
          aria-label={focus ? "Show the controls again" : "Big art: hide the controls"}
          onClick={onFocusToggle}
        >
          {focus ? <Minimize size={16} /> : <Maximize size={16} />}
        </button>
      )}
      <div className="view-controls" role="toolbar" aria-label="Zoom and pan the preview">
        <button
          type="button"
          className={"view-pan" + (panMode ? " on" : "")}
          aria-pressed={panMode}
          title={panMode
            ? "Pan & zoom is ON: drag moves around, pinch zooms. Tap to paint again."
            : "Pan & zoom: drag to move around, pinch to zoom (pauses painting)"}
          aria-label="Pan and zoom mode"
          onClick={() => setPanMode((x) => !x)}
        >
          <Move size={16} />
        </button>
        <button
          type="button"
          className="zoom-out"
          title="Zoom out"
          aria-label="Zoom out"
          disabled={view.zoom <= MIN_ZOOM + 1e-3}
          onClick={() => zoomStep(-1)}
        >
          <ZoomOut size={16} />
        </button>
        <button
          type="button"
          className="zoom-readout"
          title="Fit the whole artwork"
          aria-label={`Zoom ${zoomLabel(view.zoom)}. Fit the whole artwork`}
          onClick={zoomFit}
        >
          {fitted ? "FIT" : zoomLabel(view.zoom)}
        </button>
        <button
          type="button"
          className="zoom-in"
          title="Zoom in"
          aria-label="Zoom in"
          disabled={view.zoom >= MAX_ZOOM - 1e-3}
          onClick={() => zoomStep(1)}
        >
          <ZoomIn size={16} />
        </button>
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
