/**
 * Stable Canvas2D text compositor.
 * Text never participates in the optional artwork GLSL program, and is painted
 * after it in preview, PNG, GIF and MP4 using the same geometry.
 */
import { glyphCanvas } from "./kinetic-type.js";
import { ensureRetroFontLoaded, retroFontRevision } from "./retro-fonts.js";

const glyphCache = new Map();
const glyphCacheLimit = 8;

function textLayers(state) {
  return [{ ...state, text: state.lettering, visible: true }, ...(state.letteringLayers || []).slice(0, 2)];
}
function enabled(layer) {
  return layer && layer.visible !== false &&
    typeof layer.text === "string" && layer.text.trim().length > 0 &&
    Number(layer.letteringAmount) > 0;
}
export function hasVisibleLettering(state) {
  return textLayers(state).some(enabled);
}
export async function waitForLetteringFonts(state) {
  const fonts = [...new Set(textLayers(state).filter(enabled).map(l => l.letteringFont || "original"))];
  await Promise.all(fonts.map(id => ensureRetroFontLoaded(id)));
}
function cachedGlyphs(layer, aspect) {
  const key = JSON.stringify([
    layer.text, layer.letteringFont || "original", aspect.toFixed(4), retroFontRevision(),
    layer.letteringFillMode, layer.letteringFill, layer.letteringGradient,
    layer.letteringGradientAngle, layer.letteringStrokes
  ]);
  if (glyphCache.has(key)) return glyphCache.get(key);
  const glyph = glyphCanvas(layer.text, aspect, layer.letteringFont || "original", layer);
  glyphCache.set(key, glyph);
  while (glyphCache.size > glyphCacheLimit) glyphCache.delete(glyphCache.keys().next().value);
  return glyph;
}

/**
 * Paint in CSS/bitmap canvas coordinates. clear=true only for the transparent
 * preview layer; exports already contain the fully rendered background.
 */
export function paintLettering(ctx, state, timeline, width, height, clear = false) {
  if (!ctx || width < 1 || height < 1) return;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (clear) ctx.clearRect(0, 0, width, height);
  if (!hasVisibleLettering(state)) { ctx.restore(); return; }
  const t = Number(timeline?.time) || 0;
  for (const layer of textLayers(state)) {
    if (!enabled(layer)) continue;
    const glyph = cachedGlyphs(layer, width / height);
    const opacity = Math.max(0, Math.min(1, Number(layer.letteringAmount) / 100));
    const zoom = Math.max(0, Math.min(1, (layer.letteringScale ?? 48) / 100));
    const scale = 0.63 + 0.34 * zoom;
    const stretchX = Math.max(0.25, (layer.letteringStretchX ?? 100) / 100);
    const stretchY = Math.max(0.25, (layer.letteringStretchY ?? 100) / 100);
    const pivotX = ((layer.letteringX ?? 50) / 100) * width;
    const pivotY = (1 - (layer.letteringY ?? 50) / 100) * height;
    const angle = ((layer.letteringRotation ?? 0) * Math.PI) / 180;
    const curve = (layer.letteringCurve ?? 0) / 100;
    const warp = Math.max(0, (layer.letteringWarp ?? 0) / 100);
    const motion = Math.max(0, (layer.letteringMotion ?? 0) / 100);

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(pivotX, pivotY);
    ctx.rotate(angle);
    ctx.scale(scale * stretchX, scale * stretchY);
    if (Math.abs(curve) < 0.001 && warp < 0.001 && motion < 0.001) {
      ctx.drawImage(glyph, -width / 2, -height / 2, width, height);
    } else {
      // Bounded horizontal strip distortion; no shader compile, no frame allocations.
      const bands = 32;
      for (let i = 0; i < bands; i++) {
        const top = Math.round(glyph.height * i / bands);
        const bottom = Math.round(glyph.height * (i + 1) / bands);
        if (bottom <= top) continue;
        const fy = (i + 0.5) / bands;
        const centeredY = fy - 0.5;
        const bend = curve * 0.18 * (centeredY * centeredY - 0.065) * width;
        const wobble = warp * 0.009 * Math.sin(fy * 13 + t * 0.81) * width;
        const kinetic = motion * 0.009 * Math.sin(fy * 8 + t * 0.61) * width;
        ctx.drawImage(glyph, 0, top, glyph.width, bottom - top,
          -width / 2 + bend + wobble + kinetic,
          -height / 2 + height * top / glyph.height,
          width, height * (bottom - top) / glyph.height + 0.8);
      }
    }
    ctx.restore();
  }
  ctx.restore();
}
