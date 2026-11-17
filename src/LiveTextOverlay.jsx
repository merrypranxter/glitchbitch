import React from "react";
import { getRetroFont } from "./retro-fonts.js";
import { letteringMaterial, textMotion } from "./lettering-materials.js";

const asPercent = (value, fallback=50) => Math.max(0, Math.min(100, Number(value ?? fallback)));
const inkText = (style, text, key) => <span key={key} style={style}>{text}</span>;

function TextFace({ text, fontStyle, material, strokes }) {
  const base = {
    ...fontStyle, whiteSpace: "pre-wrap", overflowWrap: "anywhere",
    textAlign: "center", width: "100%", display: "block"
  };
  let thickness = 0;
  const outlines = strokes.map((stroke, i) => {
    thickness += Math.max(0, Number(stroke.width || 0));
    return { ...stroke, thickness, key: i };
  }).reverse();
  const fill = {
    ...base, position: "relative",
    color: material.gradient ? "transparent" : material.ink,
    WebkitTextFillColor: material.gradient ? "transparent" : material.ink,
    backgroundImage: material.gradient || "none",
    backgroundSize: material.hueAnimation ? "280% 280%" : "100% 100%",
    backgroundClip: material.gradient ? "text" : "border-box",
    WebkitBackgroundClip: material.gradient ? "text" : "border-box",
    textShadow: material.gradient ? "none" : material.previewShadow,
    WebkitTextStroke: material.preset === "Void stencil" ? "1.5px #f5e8ff" : "0px transparent",
    animationName: material.hueAnimation ? "live-type-spectral-shift"
      : material.pulseAnimation ? "live-type-light-pulse" : "none",
    animationDuration: material.pulseAnimation ? "1.85s" : "3.3s",
    animationTimingFunction: "ease-in-out", animationIterationCount: "infinite",
    animationDirection: "alternate"
  };
  return (
    <div className="live-type-face" style={{ position:"relative", width:"100%" }}>
      {material.echoes.map((echo,i) =>
        inkText({
          ...base, position:"absolute", inset:0,
          transform: `translate(${echo.x}px, ${echo.y}px)`,
          color:echo.color, WebkitTextFillColor:echo.color,
          opacity:echo.alpha, filter:"blur(.8px)"
        },text,`echo-${i}`))}
      {outlines.map(ring =>
        inkText({
          ...base, position:"absolute", inset:0,
          color:ring.color || "#000000", WebkitTextFillColor:ring.color || "#000000",
          WebkitTextStroke:`${ring.thickness*2}px ${ring.color || "#000000"}`,
        },text,`ring-${ring.key}`))}
      <span className="live-type-ink" style={fill}>{text}</span>
      {/* Gradients need a separate luminous pass: text-shadow cannot affect transparent fill. */}
      {material.gradient && material.glow !== "none" &&
        inkText({
          ...base, position:"absolute", inset:0, zIndex:-1,
          color:material.stops?.[1] || "#fff", WebkitTextFillColor:material.stops?.[1] || "#fff",
          textShadow:material.glow, opacity:0.65
        },text,"luminous")}
    </div>
  );
}

function TextLayer({ layer, palette, width, height, playing, index }) {
  const text = layer.text;
  const opacity = Math.max(0, Math.min(1, Number(layer.letteringAmount ?? 46) / 100));
  if (!text?.trim() || layer.visible === false || opacity <= 0) return null;
  const material = letteringMaterial(layer, palette);
  const { motion, warp } = textMotion(layer);
  const font = getRetroFont(layer.letteringFont);
  const minEdge = Math.max(1, Math.min(width || 1, height || 1));
  const zoom = asPercent(layer.letteringScale,48) / 100;
  const size = Math.max(13, Math.min(minEdge * 0.24, 132) * (0.63 + 0.34 * zoom));
  const x = asPercent(layer.letteringX);
  const y = asPercent(layer.letteringY);
  const angle = Number(layer.letteringRotation || 0);
  const sx = Math.max(0.25, Number(layer.letteringStretchX ?? 100) / 100);
  const sy = Math.max(0.25, Number(layer.letteringStretchY ?? 100) / 100);
  const curve = Number(layer.letteringCurve || 0) / 100;
  const strokes = (layer.letteringStrokes || []).filter(s => s?.enabled && Number(s.width)>0).slice(0,5);
  const fontStyle = {
    fontFamily:font.family, fontWeight:font.weight, fontSize:size,
    lineHeight:1.18, letterSpacing:0
  };
  const face = <TextFace text={text} material={material} fontStyle={fontStyle} strokes={strokes}/>;
  const strips = warp > .015 ? 12 : 0;
  const stripAmplitude = Math.round((4 + 31 * warp) * (minEdge / 430));
  const activity = playing ? "running" : "paused";
  return (
    <div className="live-type-layer" key={layer.id || index}
      style={{
        position:"absolute", zIndex:index+1, left:`${x}%`, top:`${100-y}%`,
        width:"70%", transform:`translate(-50%,-50%) rotate(${angle}deg) scale(${sx},${sy}) skewX(${curve*8}deg)`,
        transformOrigin:"center center", opacity,
        pointerEvents:"none", userSelect:"none", WebkitUserSelect:"none",
      }}>
      <div className="live-type-kinetic" style={{
        position:"relative", width:"100%",
        "--motion-x": `${Math.round(39*motion)}px`,
        "--motion-y": `${Math.round(22*motion)}px`,
        "--motion-rotation":`${(11*motion).toFixed(2)}deg`,
        animationName: motion > .01 ? "live-type-kinetic" : "none",
        animationDuration:`${(5 - 3.1*motion).toFixed(2)}s`,
        animationTimingFunction:"ease-in-out", animationIterationCount:"infinite",
        animationPlayState:activity
      }}>
        <div className="live-type-material-motion" style={{ animationPlayState:activity }}>
          <div style={{visibility:strips ? "hidden" : "visible"}}>{face}</div>
          {Array.from({length:strips}, (_,i) => {
            const start = i*100/strips, end = (strips-i-1)*100/strips;
            const polarity = (i%2===0 ? 1 : -1);
            const amount = polarity * stripAmplitude * (0.65 + 0.35*Math.sin(i*2.3));
            return (
              <div className="live-type-slice" key={i} style={{
                position:"absolute", inset:0,
                clipPath:`inset(${start.toFixed(4)}% 0 ${end.toFixed(4)}% 0)`,
                WebkitClipPath:`inset(${start.toFixed(4)}% 0 ${end.toFixed(4)}% 0)`,
                "--slice-x":`${amount.toFixed(2)}px`,
                "--slice-neg-x":`${(-amount*.72).toFixed(2)}px`,
                "--slice-skew":`${(polarity*warp*14).toFixed(1)}deg`,
                animationName:"live-type-liquid-slice",
                animationDuration:`${(3.3-2.05*warp).toFixed(2)}s`,
                animationDelay:`${(-i*.145).toFixed(3)}s`,
                animationTimingFunction:"ease-in-out",
                animationIterationCount:"infinite", animationDirection:"alternate",
                animationPlayState:activity
              }}>{face}</div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Native DOM preview remains readable even when iPhone WebGL fails.
 * Styles and both motion sliders are now actually wired to the visible words.
 */
export default function LiveTextOverlay({state, width, height, playing=true}) {
  const layers = [
    {...state, text:state.lettering, visible:true},
    ...(state.letteringLayers || []).slice(0,2)
  ];
  return (
    <div className="live-type-root" aria-hidden="true"
      style={{position:"absolute", inset:0, pointerEvents:"none", zIndex:3, overflow:"hidden"}}>
      {layers.map((layer,i) =>
        <TextLayer key={layer.id || i} layer={layer} index={i}
          palette={state.colors || []} width={width} height={height} playing={playing}/>)}
    </div>
  );
}
