/**
 * A true shadow-only glow atlas for Canvas2D lettering exports.
 *
 * DOM text-shadow paints BEHIND the actual letter face. Earlier export code
 * drew opaque white/cyan copies of each glyph ON TOP of the chosen ink and
 * blend, flattening gradients and hiding Difference/Multiply. This renders
 * all the colored optical halos into one transparent bitmap, then punches
 * out the actual glyph alpha. Only light OUTSIDE the glyph survives.
 *
 * The resulting bitmap can be cached and moved with the text/sprite without
 * another huge full-frame framebuffer in an iPhone MP4 export.
 */
export function createLetteringHalo(source,layers,pixelScale=1) {
  if(!source || !source.width || !source.height ||
     !Array.isArray(layers) || layers.length===0)return null;
  const canvas=document.createElement("canvas");
  canvas.width=source.width;
  canvas.height=source.height;
  const ctx=canvas.getContext("2d");
  if(!ctx)return null;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const unit=Math.max(.05,Math.min(5,Number(pixelScale)||1));
  for(let i=0;i<layers.length;i++){
    const layer=layers[i];
    if(!layer || typeof layer.color!=="string" ||
       !Number.isFinite(Number(layer.blur)))continue;
    ctx.save();
    ctx.globalCompositeOperation="source-over";
    ctx.shadowColor=layer.color;
    ctx.shadowBlur=Math.max(.5,Math.min(84,Number(layer.blur)*unit));
    ctx.shadowOffsetX=0;
    ctx.shadowOffsetY=0;
    // Each colored shadow contributes to the aura; the glyph face is
    // removed only after ALL the shadows have accumulated.
    ctx.globalAlpha=i===0?.56:i===layers.length-1?.74:.7;
    ctx.drawImage(source,0,0);
    ctx.restore();
  }
  ctx.save();
  ctx.globalAlpha=1;
  ctx.globalCompositeOperation="destination-out";
  ctx.shadowBlur=0;
  ctx.shadowOffsetX=0;
  ctx.shadowOffsetY=0;
  ctx.drawImage(source,0,0);
  ctx.restore();
  return canvas;
}
