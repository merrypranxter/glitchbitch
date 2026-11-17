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
