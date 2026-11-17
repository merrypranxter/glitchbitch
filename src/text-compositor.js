/**
 * Shared Canvas2D lettering compositor for PNG, GIF and MP4.
 * Text materials and kinetic motion are rendered AFTER the art shader.
 * Never require the GL text shader: Safari should retain the artwork.
 */
import { glyphCanvas } from "./kinetic-type.js";
import { ensureRetroFontLoaded, retroFontRevision } from "./retro-fonts.js";
import { letteringMaterial, textMotion } from "./lettering-materials.js";
import { getLetteringBlendRecipe, letteringBlendPulse } from "./lettering-blends.js";

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
    material.gradientType, material.gradientAngle, layer.letteringStrokes
  ]);
  if (glyphCache.has(key)) return glyphCache.get(key);
  const style = {...layer,
    letteringFill:material.ink,
    letteringFillMode:material.stops ? material.gradientType : "Solid",
    letteringGradient:material.stops || [],
    letteringGradientAngle:material.gradientAngle
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
  const entry = {image,material,tints:new Map()};
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
function drawLiquidImage(ctx,image,width,height,curve,warp,motion,seconds,dx=0,dy=0) {
  if(warp < .001 && motion < .001 && Math.abs(curve) < .001) {
    ctx.drawImage(image,-width/2+dx,-height/2+dy,width,height);
    return;
  }
  // Distortion scales with the canvas, not with a tiny fixed .009 UV offset.
  // At 100%, letters visibly deform by multiple tens of pixels at phone size.
  const bands=32;
  for(let i=0;i<bands;i++) {
    const y0=Math.round(image.height*i/bands);
    const y1=Math.round(image.height*(i+1)/bands);
    if(y1<=y0)continue;
    const fy=(i+.5)/bands, cy=fy-.5;
    const bend=curve*.18*(cy*cy-.065)*width;
    const wave=warp*.064*width*Math.sin(fy*15.3+seconds*3.1);
    const eddy=warp*.021*width*Math.cos(fy*27.1-seconds*1.7);
    const local=motion*.018*width*Math.sin(fy*8.2+seconds*2.4);
    ctx.drawImage(image,0,y0,image.width,y1-y0,
      -width/2+dx+bend+wave+eddy+local,
      -height/2+dy+height*y0/image.height,
      width,height*(y1-y0)/image.height+.8);
  }
}
/** Paint at a specific deterministic timeline step; no growing frame history. */
export function paintLettering(ctx,state,timeline,width,height,clear=false) {
  if(!ctx||width<1||height<1)return;
  ctx.save();
  ctx.setTransform(1,0,0,1,0,0);
  if(clear)ctx.clearRect(0,0,width,height);
  if(!hasVisibleLettering(state)) { ctx.restore();return; }
  // Renderer time advances at speed / 30 per wall second.
  const seconds=(Number(timeline?.time)||0)*30;
  for(const layer of layersOf(state)) {
    if(!active(layer))continue;
    const {image,material,tints}=glyphFor(layer,width/height,state.colors||[]);
    const {motion,warp:sliderWarp}=textMotion(layer);
    const warp=Math.max(sliderWarp,material.preset==="Heatwave" ? .23 : 0);
    const opacity=Math.max(0,Math.min(1,Number(layer.letteringAmount)/100));
    const zoom=Math.max(0,Math.min(1,Number(layer.letteringScale??48)/100));
    const scale=.63+.34*zoom;
    const stretchX=Math.max(.25,Number(layer.letteringStretchX??100)/100);
    const stretchY=Math.max(.25,Number(layer.letteringStretchY??100)/100);
    const positionX=(Number(layer.letteringX??50)/100)*width;
    const positionY=(1-Number(layer.letteringY??50)/100)*height;
    const moveX=motion*.089*width*Math.sin(seconds*2.4);
    const moveY=motion*.051*height*Math.cos(seconds*2.1);
    const angle=(Number(layer.letteringRotation??0)+motion*11*Math.sin(seconds*1.75))*Math.PI/180;
    const curve=Number(layer.letteringCurve||0)/100;

    const blend=getLetteringBlendRecipe(layer.letteringBlendMode,layer.letteringBlendStrength);
    const intensity=blend.mode==="Normal" ? 0 : blend.strength;
    ctx.save();
    ctx.translate(positionX+moveX,positionY+moveY);
    ctx.rotate(angle);
    ctx.scale(scale*stretchX,scale*stretchY);

    function pass(recipe,weight,options={}) {
      if(weight<=0)return;
      ctx.save();
      const mode=recipe.canvasBlend||"source-over";
      ctx.globalCompositeOperation=mode;
      ctx.globalAlpha=opacity*weight*letteringBlendPulse(recipe.animation,seconds);
      const source=recipe.whiteInk ? tint({image,tints},"#ffffff")
        : options.tint ? tint({image,tints},options.tint) : image;
      if(recipe.filter && recipe.filter!=="none" && typeof ctx.filter==="string")
        ctx.filter=recipe.filter;
      if(!recipe.whiteInk && !options.extra && !options.tint) {
        for(const echo of material.echoes){
          ctx.save();
          ctx.globalAlpha*=echo.alpha;
          drawLiquidImage(ctx,tint({image,tints},echo.color),width,height,curve,warp,motion,seconds,
            echo.x*(width/430),echo.y*(height/430));
          ctx.restore();
        }
        if(material.preset==="Soft shadow"){
          ctx.shadowColor="#0a051b";
          ctx.shadowBlur=Math.min(50,12*width/430);
          ctx.shadowOffsetX=7*width/430;
          ctx.shadowOffsetY=9*height/430;
        }else if(material.glow!=="none"){
          ctx.shadowColor=material.stops?.[1]||"#00eeff";
          ctx.shadowBlur=Math.min(48,14*width/430);
        }
        if(material.hueAnimation && typeof ctx.filter==="string")
          ctx.filter=(recipe.filter && recipe.filter!=="none" ? recipe.filter+" ":"")+
            `hue-rotate(${(28*Math.sin(seconds*2.1)).toFixed(1)}deg) saturate(1.35)`;
      }
      const offsetX=Number(options.offsetX||0)*width/430;
      const offsetY=Number(options.offsetY||0)*height/430;
      drawLiquidImage(ctx,source,width,height,curve,warp,motion,seconds,offsetX,offsetY);
      ctx.restore();
    }

    // Strength = 0 is ordinary text, not invisible text.
    if(intensity<1)pass({canvasBlend:"source-over"},1-intensity);
    if(intensity>0){
      pass(blend,intensity);
      for(const extra of blend.passes)
        pass(extra,intensity*(extra.alpha??1),{...extra,extra:true});
    }
    ctx.restore();
  }
  ctx.restore();
}
