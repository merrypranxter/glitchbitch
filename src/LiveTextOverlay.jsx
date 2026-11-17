import React, { useEffect, useRef } from "react";
import { getRetroFont } from "./retro-fonts.js";
import { letteringMaterial, textMotion } from "./lettering-materials.js";
import { getLetteringBlendRecipe } from "./lettering-blends.js";
import { letteringMotionAt, letteringLiquidAt, letteringComposeGlyph,
  letteringMotionCss, letteringMotionIsPerLetter } from "./lettering-motion.js";

const asPercent = (value, fallback=50) => Math.max(0, Math.min(100, Number(value ?? fallback)));
const inkText = (style, text, key) => <span key={key} style={style}>{text}</span>;
// Words stay unbroken when wrapping; each character receives a continuous
// transform. This replaces the old clipped horizontal slices entirely.
function MovingGlyphs({text}) {
  const parts=String(text).split(/(\s+)/u), total=Array.from(text).filter(c=>!(/\s/u.test(c))).length;
  let index=0;
  return <>{parts.map((part,k)=>(/^(?:\s)+$/u.test(part))
    ? <React.Fragment key={k}>{part}</React.Fragment>
    : <span key={k} style={{display:"inline-block",whiteSpace:"nowrap"}}>
        {Array.from(part).map((char,j)=>
          <span key={j} className="live-type-glyph" data-text-glyph=""
            data-index={index++} data-total={total}
            style={{display:"inline-block",whiteSpace:"pre",transformOrigin:"50% 70%"}}>{char}</span>)}
      </span>)}</>;
}

function TextFace({ text, fontStyle, material, strokes, dynamicGlyphs=false }) {
  const display=()=>dynamicGlyphs ? <MovingGlyphs text={text}/> : text;
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
    backgroundSize: material.preset === "Glitter ink" ? "19px 19px, 29px 31px, 280% 280%" : material.hueAnimation ? "280% 280%" : "100% 100%",
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
    <div className="live-type-face" style={{ position:"relative", width:"100%", isolation:"isolate", zIndex:0 }}>
      {material.echoes.map((echo,i) =>
        inkText({
          ...base, position:"absolute", inset:0,
          transform: `translate(${echo.x}px, ${echo.y}px)`,
          color:echo.color, WebkitTextFillColor:echo.color,
          opacity:echo.alpha, filter:"blur(.8px)"
        },display(),`echo-${i}`))}
      {outlines.map(ring =>
        inkText({
          ...base, position:"absolute", inset:0,
          color:ring.color || "#000000", WebkitTextFillColor:ring.color || "#000000",
          WebkitTextStroke:`${ring.thickness*2}px ${ring.color || "#000000"}`,
        },display(),`ring-${ring.key}`))}
      <span className="live-type-ink" style={fill}>{display()}</span>
      {/* Gradients need a separate luminous pass: text-shadow cannot affect transparent fill. */}
      {material.gradient && material.glow !== "none" &&
        inkText({
          ...base, position:"absolute", inset:0, zIndex:-1,
          color:material.stops?.[1] || "#fff", WebkitTextFillColor:material.stops?.[1] || "#fff",
          textShadow:material.glow, opacity:0.65
        },display(),"luminous")}
    </div>
  );
}

function TextLayer({ layer, palette, width, height, playing, index }) {
  const text = layer.text;
  const opacity = Math.max(0, Math.min(1, Number(layer.letteringAmount ?? 46) / 100));
  if (!text?.trim() || layer.visible === false || opacity <= 0) return null;
  const material = letteringMaterial(layer, palette);
  const { motion, warp:sliderWarp } = textMotion(layer);
  const warp = Math.max(sliderWarp, material.preset === "Heatwave" ? 0.23 : 0);
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
  const dynamicGlyphs=warp>.001 || letteringMotionIsPerLetter(layer.letteringMotionPath);
  const face = <TextFace text={text} material={material} fontStyle={fontStyle}
    strokes={strokes} dynamicGlyphs={dynamicGlyphs}/>;
  const activity = playing ? "running" : "paused";

  // Strength crossfades NORMAL text with the full composited effect. At 0
  // the text stays visible and ordinary rather than disappearing.
  const blend=getLetteringBlendRecipe(layer.letteringBlendMode, layer.letteringBlendStrength);
  const intensity=blend.mode==="Normal" ? 0 : blend.strength;
  const passes=[
    ...(intensity < 1 ? [{id:"normal",cssBlend:"normal",alpha:1-intensity,filter:"none"}] : []),
    ...(intensity > 0 ? [
      {id:"effect",cssBlend:blend.cssBlend,alpha:intensity,filter:blend.filter,
        animation:blend.animation,whiteInk:blend.whiteInk},
      ...blend.passes.map((p,i)=>({...p,id:"extra-"+i,alpha:intensity*(p.alpha??1),extra:true}))
    ]:[])
  ];
  return <>
    {passes.map(pass=>{
      const look=pass.whiteInk
        ? {...material,gradient:null,ink:"#ffffff",previewShadow:"none",glow:"none",echoes:[]}
        : pass.tint
          ? {...material,gradient:null,ink:pass.tint,previewShadow:"none",glow:"none",echoes:[]}
          : material;
      const passFace=pass.id==="normal" || pass.id==="effect" ? face
        : <TextFace text={text} material={look} fontStyle={fontStyle} strokes={strokes} dynamicGlyphs={dynamicGlyphs}/>;
      const showFace=pass.whiteInk
        ? <TextFace text={text} material={look} fontStyle={fontStyle} strokes={strokes}/>
        : passFace;
      const passOpacity=Math.min(1,Math.max(0,opacity*pass.alpha));
      const offsetX=(pass.offsetX||0)*minEdge/430;
      const offsetY=(pass.offsetY||0)*minEdge/430;
      return (
        <div className="live-type-layer" key={(layer.id || index)+"-"+pass.id}
          style={{
            position:"absolute", zIndex:index*5+(pass.extra?4:pass.id==="effect"?3:2),
            left:`${x}%`,top:`${100-y}%`,width:"70%",
            transform:`translate(calc(-50% + ${offsetX}px),calc(-50% + ${offsetY}px)) rotate(${angle}deg) scale(${sx},${sy}) skewX(${curve*8}deg)`,
            transformOrigin:"center center",opacity:passOpacity,
            mixBlendMode:pass.cssBlend || "normal",
            filter:pass.filter && pass.filter!=="none" ? pass.filter : undefined,
            pointerEvents:"none",userSelect:"none",WebkitUserSelect:"none"
          }}>
          <div className="live-type-kinetic" data-text-motion="" data-layer-index={index}
            data-em={size} style={{position:"relative",width:"100%",transformOrigin:"center center"}}>
            <div className={pass.animation?"live-type-material-motion live-type-blend-"+pass.animation:"live-type-material-motion"}
              style={{animationPlayState:activity}}>
              {showFace}
            </div>
          </div>
        </div>
      );
    })}
  </>;
}

/**
 * Native DOM preview remains readable even when iPhone WebGL fails.
 * Styles and both motion sliders are now actually wired to the visible words.
 */
export default function LiveTextOverlay({state, width, height, playing=true, timelineRef}) {
  const rootRef=useRef(null);
  const layers = [
    {...state, text:state.lettering, visible:true},
    ...(state.letteringLayers || []).slice(0,2)
  ];
  useEffect(()=>{
    const root=rootRef.current;
    if(!root)return;
    const targets=Array.from(root.querySelectorAll("[data-text-motion]"));
    const groups=targets.map(node=>({
      node,
      layerIndex:Number(node.dataset.layerIndex),
      em:Number(node.dataset.em)||40,
      glyphs:Array.from(node.querySelectorAll("[data-text-glyph]"))
    }));
    let frame=0,last=-Infinity;
    function update(now){
      const seconds=Number(timelineRef?.current?.textTime)||0;
      if(!playing || now-last >= 1000/30-1) {
        last=now;
        for(const group of groups) {
          const layer=layers[group.layerIndex];
          if(!layer)continue;
          const whole=letteringMotionAt(layer,seconds,width,height,-1,1,group.em);
          group.node.style.transform=letteringMotionCss(whole);
          group.node.style.opacity=String(whole.alpha);
          for(const glyph of group.glyphs){
            const i=Number(glyph.dataset.index),count=Number(glyph.dataset.total)||1;
            const motion=letteringMotionAt(layer,seconds,width,height,i,count,group.em);
            const liquid=letteringLiquidAt(layer,seconds,i,count,group.em);
            const final=letteringComposeGlyph(motion,liquid);
            glyph.style.transform=letteringMotionCss(final);
            glyph.style.opacity=String(final.alpha);
          }
        }
      }
      if(playing)frame=requestAnimationFrame(update);
    }
    update(performance.now());
    return ()=>cancelAnimationFrame(frame);
  },[state,width,height,playing,timelineRef]);
  return (
    <div ref={rootRef} className="live-type-root" aria-hidden="true" data-playing={playing ? "true" : "false"}
      style={{position:"absolute", inset:0, pointerEvents:"none", zIndex:3, overflow:"hidden", isolation:"auto"}}>
      {layers.map((layer,i) =>
        <TextLayer key={layer.id || i} layer={layer} index={i}
          palette={state.colors || []} width={width} height={height} playing={playing}/>)}
    </div>
  );
}
