/**
 * Shared Canvas2D lettering compositor for PNG, GIF and MP4.
 * Text materials and kinetic motion are rendered AFTER the art shader.
 * Never require the GL text shader: Safari should retain the artwork.
 */
import { glyphCanvas } from "./kinetic-type.js";
import { ensureRetroFontLoaded, retroFontRevision } from "./retro-fonts.js";
import { letteringMaterial, textMotion, letteringExportGlowLayers } from "./lettering-materials.js";
import { createLetteringHalo } from "./lettering-halo.js";
import { getLetteringBlendRecipe, letteringBlendPulse } from "./lettering-blends.js";
import { createLetteringSprites } from "./lettering-sprites.js";
import { letteringMotionCombinedAt, letteringLiquidAt, letteringComposeGlyph,
  letteringMotionNeedsGlyphs } from "./lettering-motion.js";

const glyphCache = new Map();
const LIMIT = 8;
function layersOf(state) {
  return [{...state, text:state.lettering, visible:true}, ...(state.letteringLayers || []).slice(0,2)];
}
function active(layer) {
  return layer && layer.visible !== false && typeof layer.text === "string" &&
    layer.text.trim().length > 0 && Number(layer.letteringAmount) > 0;
}
export function hasVisibleLettering(state) {
  return layersOf(state).some(active);
}
export async function waitForLetteringFonts(state) {
  const fonts = [...new Set(layersOf(state).filter(active).map(l => l.letteringFont || "original"))];
  await Promise.all(fonts.map(id=>ensureRetroFontLoaded(id)));
}
function glyphFor(layer, aspect, artworkPalette) {
  const material = letteringMaterial(layer, artworkPalette);
  const key = JSON.stringify([
    layer.text, aspect.toFixed(4), layer.letteringFont || "original",
    retroFontRevision(), material.preset, material.ink, material.stops,
    material.gradientType, material.gradientAngle, layer.letteringStrokes,
    layer.letteringFormats,layer.letteringTracking,layer.letteringLineSpacing
  ]);
  if (glyphCache.has(key)) return glyphCache.get(key);
  const style = {...layer,
    letteringFill:material.ink,
    letteringFillMode:material.stops ? material.gradientType : "Solid",
    letteringGradient:material.stops || [],
    letteringGradientAngle:material.gradientAngle,
    letteringHaloPadding:material.glow!=="none"?.28:0
  };
  if (material.preset === "Void stencil" && !style.letteringStrokes?.some(s=>s.enabled))
    style.letteringStrokes = [{color:"#eae7ff",width:2,enabled:true}];
  const image=glyphCanvas(layer.text,aspect,layer.letteringFont || "original",style);
  if (material.preset === "Glitter ink") {
    const glints=image.getContext("2d");
    if (glints) {
      // Deterministic twinkling micro-facets, confined to the actual letter shapes.
      // Their glints stay crisp even in a high-resolution MP4 export.
      glints.save();
      glints.globalCompositeOperation="source-atop";
      let seed=layer.text.split("").reduce((n,ch)=>((n*31+ch.charCodeAt(0))>>>0),17);
      const random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};
      for(let i=0;i<200;i++){
        const x=Math.floor(random()*image.width),y=Math.floor(random()*image.height);
        const size=1+Math.floor(random()*3);
        glints.fillStyle=i%4===0?"#ffffff":i%4===1?"#fffbb3":"#98faff";
        glints.fillRect(x,y,size,size);
      }
      glints.restore();
    }
  }
  const entry = {image,material,style,tints:new Map(),sprites:undefined,spriteTints:new Map(),
    staticHalo:undefined,spriteHalos:undefined};
  glyphCache.set(key,entry);
  while(glyphCache.size>LIMIT)glyphCache.delete(glyphCache.keys().next().value);
  return entry;
}
function tint(entry,color) {
  if(entry.tints.has(color))return entry.tints.get(color);
  const image=document.createElement("canvas");
  image.width=entry.image.width;image.height=entry.image.height;
  const c=image.getContext("2d");
  if(!c)return entry.image;
  c.drawImage(entry.image,0,0);
  c.globalCompositeOperation="source-in";
  c.fillStyle=color;c.fillRect(0,0,image.width,image.height);
  c.globalCompositeOperation="source-over";
  entry.tints.set(color,image);
  return image;
}
function tintedSpriteImages(entry,color) {
 if(entry.spriteTints.has(color))return entry.spriteTints.get(color);
 const tinted=(entry.sprites?.sprites||[]).map(item=>{
   const canvas=document.createElement("canvas");
   canvas.width=item.image.width;canvas.height=item.image.height;
   const ctx=canvas.getContext("2d");
   if(!ctx)return item.image;
   ctx.drawImage(item.image,0,0);
   ctx.globalCompositeOperation="source-in";
   ctx.fillStyle=color;ctx.fillRect(0,0,canvas.width,canvas.height);
   return canvas;
 });
 entry.spriteTints.set(color,tinted);
 return tinted;
}
/**
 * The same closed-loop paths are used in the DOM preview and exports.
 * Every letter is drawn whole; no horizontal clipping, strips, or seams.
 */
export function paintLettering(ctx,state,timeline,width,height,clear=false){
 if(!ctx||width<1||height<1)return;
 ctx.save();
 ctx.setTransform(1,0,0,1,0,0);
 if(clear)ctx.clearRect(0,0,width,height);
 if(!hasVisibleLettering(state)){ctx.restore();return;}
 const seconds=Number.isFinite(Number(timeline?.textTime)) ? Number(timeline.textTime)
   : (Number(timeline?.time)||0)*30;
 for(const layer of layersOf(state)){
   if(!active(layer))continue;
   const entry=glyphFor(layer,width/height,state.colors||[]);
   const {image,material}=entry;
   const opacity=Math.max(0,Math.min(1,Number(layer.letteringAmount)/100));
   const zoom=Math.max(0,Math.min(1,Number(layer.letteringScale??48)/100));
   const scale=.63+.34*zoom;
   const stretchX=Math.max(.25,Number(layer.letteringStretchX??100)/100);
   const stretchY=Math.max(.25,Number(layer.letteringStretchY??100)/100);
   const factorX=Math.max(.05,scale*stretchX),factorY=Math.max(.05,scale*stretchY);
   const positionX=(Number(layer.letteringX??50)/100)*width;
   const positionY=(1-Number(layer.letteringY??50)/100)*height;
   const curve=(Number(layer.letteringCurve)||0)/100;
   const warp=Math.max(Number(layer.letteringWarp)||0,material.preset==="Heatwave"?23:0);
   const liquidLayer=warp===Number(layer.letteringWarp)?layer:{...layer,letteringWarp:warp};
   const glyphMode=warp>.01 || letteringMotionNeedsGlyphs(layer) ||
     (Array.isArray(layer.letteringFormats)&&layer.letteringFormats.length>0) ||
     Number(layer.letteringTracking||0)!==0 ||
     Number(layer.letteringLineSpacing??118)!==118;
   if(glyphMode && entry.sprites===undefined){
     entry.sprites=createLetteringSprites(layer.text,width/height,layer.letteringFont||"original",entry.style);
   }
   const spriteScene=glyphMode?entry.sprites:null;
   // Match the mobile preview's font-em amplitude at export resolution.
   const minEdge=Math.min(width,height),resolutionScale=minEdge/430;
   const em=Math.max(13*resolutionScale,
     Math.min(minEdge*.24,132*resolutionScale)*(0.63+0.34*zoom));
   const whole=letteringMotionCombinedAt(layer,seconds,width,height,-1,1,em);
   const blend=getLetteringBlendRecipe(layer.letteringBlendMode,layer.letteringBlendStrength);
   const glowLayers=letteringExportGlowLayers(material);
   // These are alpha-only halos, not opaque white glyphs. Both bitmaps
   // are created once per text/material recipe and reused for video frames.
   if(glowLayers.length && entry.staticHalo===undefined)
     entry.staticHalo=createLetteringHalo(image,glowLayers,
       Math.min(image.width,image.height)/430);
   if(glowLayers.length && spriteScene && entry.spriteHalos===undefined){
     // Avoid doubling a 180-glyph atlas on memory-constrained iPhones.
     entry.spriteHalos=spriteScene.sprites.length<=80
       ?spriteScene.sprites.map(item=>createLetteringHalo(item.image,glowLayers,
         Math.min(spriteScene.width,spriteScene.height)/430))
       :null;
   }
   const intensity=blend.mode==="Normal"?0:blend.strength;

   ctx.save();
   ctx.translate(positionX+whole.dx,positionY+whole.dy);
   ctx.rotate((Number(layer.letteringRotation||0)+whole.rotation)*Math.PI/180);
   ctx.scale(factorX*whole.scaleX,factorY*whole.scaleY);
   if(Math.abs(curve)>.001)ctx.transform(1,0,curve*.11,1,0,0);
   function paintShape(options={}){
     if(spriteScene && spriteScene.sprites.length){
       const colored=!options.halo&&options.tint?tintedSpriteImages(entry,options.tint):null;
       const ratioX=width/spriteScene.width,ratioY=height/spriteScene.height;
       const baseOpacity=ctx.globalAlpha;
       for(let i=0;i<spriteScene.sprites.length;i++){
         const item=spriteScene.sprites[i];
         const moving=letteringMotionCombinedAt(layer,seconds,width,height,item.index,item.total,em);
         const liquid=letteringLiquidAt(liquidLayer,seconds,item.index,item.total,em);
         const pose=letteringComposeGlyph(moving,liquid);
         ctx.save();
         ctx.globalAlpha=baseOpacity*(pose.alpha??1);
         // Echo offsets must work even when liquid/glyph choreography is on.
         // Previous export ignored paintShape({dx,dy}) for sprite glyphs.
         const echoX=Number(options.dx||0)/Math.max(.05,factorX*whole.scaleX);
         const echoY=Number(options.dy||0)/Math.max(.05,factorY*whole.scaleY);
         ctx.translate(
           (item.x/spriteScene.width-.5)*width+(pose.dx/(factorX*whole.scaleX))+echoX,
           (item.y/spriteScene.height-.5)*height+(pose.dy/(factorY*whole.scaleY))+echoY
         );
         ctx.rotate(pose.rotation*Math.PI/180);
         if(pose.skewX)ctx.transform(1,0,Math.tan(pose.skewX*Math.PI/180),1,0,0);
         ctx.scale(pose.scaleX,pose.scaleY);
         const sprite=options.halo?entry.spriteHalos?.[i]:colored?.[i]||item.image;
         if(!sprite){ctx.restore();continue;}
         const sw=sprite.width*ratioX*item.widthScale,sh=sprite.height*ratioY;
         ctx.drawImage(sprite,-sw/2,-sh/2,sw,sh);
         ctx.restore();
       }
     }else{
       // Long quotes use one smooth whole-word transform (memory-safe fallback).
       ctx.save();
       if(warp>.01){
         const wobble=Math.sin(seconds*2.1)*warp/100;
         ctx.transform(1,0,.13*wobble,1,0,0);
         ctx.rotate(.045*wobble);
       }
       const source=options.halo?entry.staticHalo:options.tint?tint(entry,options.tint):image;
       if(!source){ctx.restore();return;}
       ctx.drawImage(source,-width/2+Number(options.dx||0)/Math.max(.05,factorX*whole.scaleX),
         -height/2+Number(options.dy||0)/Math.max(.05,factorY*whole.scaleY),width,height);
       ctx.restore();
     }
   }
   function pass(recipe,amount,opts={}){
     if(amount<=0)return;
     ctx.save();
     ctx.globalCompositeOperation=recipe.canvasBlend||"source-over";
     ctx.globalAlpha=opacity*amount*letteringBlendPulse(recipe.animation,seconds);
     if(recipe.filter && recipe.filter!=="none"&&typeof ctx.filter==="string")
       ctx.filter=recipe.filter;
     if(!recipe.whiteInk && !opts.extra && !opts.tint){
       for(const echo of material.echoes){
         ctx.save();ctx.globalAlpha*=echo.alpha;
         paintShape({tint:echo.color,dx:echo.x*width/430,dy:echo.y*height/430});
         ctx.restore();
       }
       if(material.preset==="Soft shadow"){
         ctx.shadowColor="#0a051b";ctx.shadowBlur=Math.min(50,12*width/430);
         ctx.shadowOffsetX=7*width/430;ctx.shadowOffsetY=9*height/430;
       }
       if(material.hueAnimation&&typeof ctx.filter==="string")
         ctx.filter=(recipe.filter&&recipe.filter!=="none"?recipe.filter+" ":"")+
           "hue-rotate("+(28*Math.sin(seconds*2.1)).toFixed(1)+"deg) saturate(1.35)";
     }
     const shiftX=Number(opts.offsetX||0)*width/430;
     const shiftY=Number(opts.offsetY||0)*height/430;
     ctx.translate(shiftX/Math.max(.05,factorX*whole.scaleX),shiftY/Math.max(.05,factorY*whole.scaleY));
     paintShape({tint:recipe.whiteInk?"#ffffff":opts.tint});
     ctx.restore();
   }
   // Paint ONLY the halo beyond the glyph outline. It goes underneath
   // the selected letter face and blending, exactly as CSS text-shadow does.
   // The old implementation painted three bright opaque glyph copies OVER
   // Difference/Multiply and the user's gradients, making exports look white.
   if(glowLayers.length){
     ctx.save();
     ctx.globalCompositeOperation="screen";
     ctx.globalAlpha=opacity*(material.pulseAnimation
       ? .87+.13*Math.sin(seconds*3.4) : 1);
     paintShape({halo:true});
     ctx.restore();
   }
   if(intensity<1)pass({canvasBlend:"source-over"},1-intensity);
   if(intensity>0){
     pass(blend,intensity);
     for(const p of blend.passes)pass(p,intensity*(p.alpha??1),{...p,extra:true});
   }
   ctx.restore();
 }
 ctx.restore();
}
