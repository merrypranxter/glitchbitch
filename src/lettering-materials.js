/**
 * Shared lettering material recipes for live DOM text and export rasterization.
 * No shader dependency. Every named preset produces its own optical treatment.
 */
export const LETTERING_MATERIALS = [
  "Neon bling", "RGB split", "Chrome foil", "Void stencil", "Custom ink",
  "Holographic", "Electric glow", "Liquid candy", "Ghost echo",
  "Chromatic shimmer", "Heatwave", "Glitter ink", "Prism pulse", "Soft shadow"
];
const hex = value => typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);
export const textMotion = layer => ({
  motion: Math.min(1, Math.max(0, Number(layer.letteringMotion || 0) / 100)),
  warp: Math.min(1, Math.max(0, Number(layer.letteringWarp || 0) / 100))
});
export function letteringMaterial(layer = {}, artworkColors = []) {
  const preset = LETTERING_MATERIALS.includes(layer.letteringStyle)
    ? layer.letteringStyle : "Custom ink";
  const fill = hex(layer.letteringFill) ? layer.letteringFill : "#ffffff";
  const palette = artworkColors.filter(hex);
  const P = n => palette[n % Math.max(1, palette.length)] || ["#ff44bb", "#00f5ff", "#d6ff62", "#ffe45e", "#b284ff"][n % 5];
  let ink = fill, stops = null, glow = "none", shadow = "none";
  let echoes = [], softBlur = 0, gradientType = "Linear gradient", gradientAngle = 115;
  switch (preset) {
    case "Neon bling":
      stops = ["#ffffff", "#fffca0", P(2), P(0), "#fff9d5"];
      glow = "0 0 3px #ffffff, 0 0 9px #fff56b, 0 0 21px #ff22b7, 0 0 35px #00eaff";
      break;
    case "RGB split":
      ink = "#fefeff";
      echoes = [{ color:"#ff005e", x:-7, y:1, alpha:0.85 }, { color:"#00efff", x:7, y:-1, alpha:0.85 }];
      shadow = "0 0 6px #2222ff";
      break;
    case "Chrome foil":
      stops = ["#ffffff", "#cdeeff", "#34324f", "#ffffff", "#839df7", "#202035", "#fafaff"];
      shadow = "1px 2px 0 #17142a, 0 0 13px #b9f3ff";
      break;
    case "Void stencil":
      ink = "#080519";
      glow = "0 0 4px #ffffff, 0 0 12px #ff37df";
      break;
    case "Custom ink":
      break;
    case "Holographic":
      stops = ["#94ffff", "#ff8af8", "#fcff9e", "#7effba", "#7d91ff", "#f4b2ff"];
      glow = "0 0 7px #a3faff, 0 0 19px #ea68ff";
      break;
    case "Electric glow":
      ink = "#f1ffff";
      glow = "0 0 4px #ffffff, 0 0 12px #2affeb, 0 0 27px #00aaff, 0 0 44px #b0ff1a";
      break;
    case "Liquid candy":
      stops = ["#fff0ff", "#ff42ad", "#ff954d", "#faff8f", "#8dfdff", "#ff6af1"];
      glow = "0 2px 0 #ce146f, 0 7px 5px #48005f, 0 0 12px #ff87e7";
      break;
    case "Ghost echo":
      ink = "#e1faff";
      echoes = [{ color:"#a54cff", x:-13, y:-7, alpha:0.5 }, { color:"#21ffe7", x:11, y:6, alpha:0.5 }];
      glow = "0 0 15px #b2efff";
      break;
    case "Chromatic shimmer":
      stops = ["#ff32a6", "#ffe96b", "#a5ff60", "#54fbff", "#8676ff", "#ff32a6"];
      glow = "0 0 8px #ff7ff0";
      break;
    case "Heatwave":
      stops = ["#fffce2", "#ffe36a", "#ff7a23", "#ec1648", "#fff09b"];
      glow = "0 0 7px #ff9c34, 0 0 25px #ef2830";
      break;
    case "Glitter ink":
      stops = ["#ffffff", "#ff54ed", "#fff89e", "#5ff8fc", "#ffffff", "#af75ff"];
      glow = "0 0 5px #ffffff, 0 0 13px #fb73e0";
      break;
    case "Prism pulse":
      stops = ["#ff4da7", "#ffd862", "#62ff9d", "#68e7ff", "#a46bff", "#ff4da7"];
      glow = "0 0 10px #fe5aff, 0 0 24px #65eaff";
      break;
    case "Soft shadow":
      ink = fill;
      shadow = "3px 4px 3px #07041fc9, 8px 11px 14px #090314d9";
      softBlur = 12;
      break;
  }
  // User-selected solid fill still changes preset materials: it becomes a
  // dominant highlight or core color without erasing the chosen optical effect.
  if (preset !== "Custom ink" && fill.toLowerCase() !== "#ffffff") {
    if (stops && stops.length >= 2) stops = [fill, ...stops.slice(1,-1), fill];
    else ink = fill;
  }
  const userStops = Array.isArray(layer.letteringGradient) ? layer.letteringGradient.filter(hex).slice(0, 8) : [];
  if (layer.letteringFillMode !== "Solid" && userStops.length >= 2) {
    stops = userStops; gradientType = layer.letteringFillMode;
    gradientAngle = Number(layer.letteringGradientAngle || 0);
  }
  const gradient = stops && stops.length >= 2
    ? gradientType === "Radial gradient"
      ? `radial-gradient(circle, ${stops.join(", ")})`
      : `linear-gradient(${gradientAngle + 90}deg, ${stops.join(", ")})`
    : null;
  const previewShadow = [shadow, glow].filter(s => s && s !== "none").join(", ") || "none";
  const glitterGradient = preset === "Glitter ink" && gradient
    ? `radial-gradient(circle, #ffffff 0px, #ffffff 1.35px, transparent 2px), radial-gradient(circle, #fff7ab 0px, #fff7ab .9px, transparent 1.6px), ${gradient}`
    : gradient;
  return {
    preset, ink, stops, gradient:glitterGradient, gradientType, gradientAngle, glow,
    previewShadow, echoes, softBlur,
    hueAnimation: ["Chrome foil","Holographic","Chromatic shimmer","Glitter ink","Prism pulse"].includes(preset),
    pulseAnimation: ["Neon bling","Electric glow","Prism pulse","Heatwave"].includes(preset)
  };
}

/**
 * Export-side approximation of the same stacked CSS text-shadow halos used
 * by LiveTextOverlay. The old Canvas2D exporter collapsed 2–4 neon lights to
 * one faint shadow *inside* the selected blend operation, making bright
 * typography turn dark on saturated artwork.
 *
 * Parse the existing material's glow definition instead of inventing a
 * second palette that can drift from the live preview.
 */
export function letteringExportGlowLayers(material) {
  if(!material?.glow || material.glow==="none")return [];
  const source=String(material.glow).split(",").map(part=>part.trim());
  const layers=source.map(part=>{
    const found=part.match(/([0-9]+(?:\.[0-9]+)?)px\s+(#[0-9a-f]{6}(?:[0-9a-f]{2})?)$/i);
    return found?{blur:Math.max(0,Math.min(64,Number(found[1]))),color:found[2]}:null;
  }).filter(Boolean).filter(item=>item.blur>0);
  // Keep a white/cyan highlight, colored aura and wide halo, without drawing
  // all four shadows for every moving letter on iPhone.
  if(layers.length<=3)return layers;
  return [layers[0],layers[Math.floor(layers.length/2)],layers[layers.length-1]];
}

/**
 * The live DOM overlay animates brightness + saturation on its ink face.
 * The ordinary Canvas exporter previously kept only a weak hue-rotate,
 * so native/first-two-group blends looked pale beside the preview.
 * Evaluate CSS-like keyframes from the export's deterministic text clock.
 * This is applied ONLY to the classic and Add/Subtract blend families
 * while preserving the already-working experimental render recipes.
 */
export function letteringExportColorFilter(material,seconds=0) {
  if(!material?.hueAnimation && !material?.pulseAnimation)return "none";
  const t=Math.max(0,Number(seconds)||0);
  const spectral=Boolean(material.hueAnimation); // Matches live overlay precedence.
  const duration=spectral?3.3:1.85;
  const fraction=(t/duration)%2;
  const forward=fraction<=1?fraction:2-fraction;
  const frames=spectral
    ? [[0,1,1.2],[.5,1.36,1.7],[1,1.08,1.4]]
    : [[0,1,1],[.48,1.6,1.7],[1,1.08,1.3]];
  let left=frames[0],right=frames[1];
  if(forward>frames[1][0]){left=frames[1];right=frames[2];}
  const raw=Math.max(0,Math.min(1,(forward-left[0])/(right[0]-left[0])));
  const eased=.5-.5*Math.cos(Math.PI*raw);
  const brightness=left[1]+(right[1]-left[1])*eased;
  const saturation=left[2]+(right[2]-left[2])*eased;
  // CSS's animated background-position cannot move a Canvas2D gradient
  // cheaply on iPhone. Gently rotate its color wheel instead.
  const hue=spectral?Math.round(12*Math.sin(t*1.24)):0;
  return `brightness(${brightness.toFixed(3)}) saturate(${saturation.toFixed(3)})`+
    (hue?` hue-rotate(${hue}deg)`:"");
}
