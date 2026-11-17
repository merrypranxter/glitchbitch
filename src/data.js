import { PALETTE_VAULT } from "./palette-vault.js";
import { generateRandomPalette, shuffleColorStops } from "./palette-actions.js";
import { retroFontIds } from "./retro-fonts.js";
export const engineInfo = [
  ["Plasma flow", "Liquid sine fields folded into neon ribbons.", "Fluid"],
  [
    "Acid bloom",
    "Two orbiting ring systems collide in an interference field.",
    "Signal",
  ],
  [
    "Fractal melt",
    "Iterative folds build endlessly intricate alien geometry.",
    "Fractal",
  ],
  [
    "Moiré field",
    "Crossed gratings weave drifting optical interference.",
    "Signal",
  ],
  [
    "Pixel rot",
    "Seeded digital cells disintegrate into restless blocks.",
    "Digital",
  ],
  [
    "Tunnel vision",
    "Six seamless animated polar geometries: infinite spiral, conch, braid, moiré, iris and vortex.",
    "Radial",
  ],
  [
    "Liquid marble",
    "Nested noise currents carve soft organic contours.",
    "Fluid",
  ],
  [
    "Cellular dream",
    "Drifting Voronoi cells grow luminous membranes.",
    "Organic",
  ],
  [
    "Orbit lace",
    "Harmonic petals trace a rotating mathematical rosette.",
    "Radial",
  ],
  [
    "Contour planet",
    "Layered noise becomes a moving topographic map.",
    "Organic",
  ],
  [
    "Chroma weave",
    "Warped crossing threads form an electric woven fabric.",
    "Signal",
  ],
  [
    "Crystal shards",
    "Angular distance fields cut a prismatic kaleidoscope.",
    "Radial",
  ],
  ["Hyperbolic CRT", "Poincaré-disk inversions crowd the geometry toward impossible edges.", "Non-Euclidean"],
  ["Candy fractal portal", "Actual Mandelbrot/Julia orbit traps and deep complex-plane boundaries.", "Fractal"],
  ["Fivefold diffraction", "Aperiodic five-direction wave interference with irrational overtones.", "Quasicrystal"],
  ["Chromatic infection", "Persistent Gray–Scott coral, labyrinth and spore growth, with palette-mapped chemistry.", "Biological"],
  ["Stereo Ghost Machine", "Raymarched gyroid, metaballs, opal rings, crystals and floating ribbons with true depth.", "Spatial"],
].map(([name, description, family], id) => ({ id, name, description, family }));
export const engines = engineInfo.map((e) => e.name);
export const originalPalettes = [
  {
    name: "Toxic candy",
    colors: ["#140827", "#6b21f0", "#ff32b8", "#ff826d", "#e6ff45", "#65ffd2"],
  },
  {
    name: "Hyperpop",
    colors: ["#160e30", "#ec36ff", "#ff335c", "#ffe856", "#18d9fe", "#3b32f4"],
  },
  {
    name: "Acid bath",
    colors: ["#091f24", "#075a57", "#43ffa0", "#caff15", "#ffea99", "#e56aff"],
  },
  {
    name: "After hours",
    colors: ["#0a0820", "#30269b", "#7071ff", "#f471ff", "#ff2a70", "#ff9f72"],
  },
  {
    name: "Solar flare",
    colors: ["#21113d", "#9321ad", "#ff315c", "#ff6c19", "#ffd23f", "#fff4b3"],
  },
  {
    name: "Bubblegum Shock",
    colors: ["#2a001d", "#ff4fcf", "#ff8ae2", "#ffffff"],
  },
  {
    name: "Barbie Reactor",
    colors: ["#111111", "#ff2bb8", "#ff66f0", "#ffd8f7"],
  },
  {
    name: "Kiss Badge Pop",
    colors: ["#3b0012", "#ff3b6b", "#ff79a8", "#fff1f6"],
  },
  {
    name: "Cyber sherbet",
    colors: ["#160b38", "#7047ff", "#ff48c7", "#ffb987", "#f8fa9b", "#65f5dc"],
  },
  {
    name: "Poison garden",
    colors: ["#091812", "#376128", "#adfa35", "#fff79e", "#e64b94", "#652b73"],
  },
  {
    name: "Digital koi",
    colors: ["#131a39", "#224fa8", "#6fe4e9", "#faf1d0", "#ff824e", "#da3056"],
  },
  {
    name: "Ultraviolet bruise",
    colors: ["#070a28", "#262363", "#663abb", "#af45de", "#fc55b9", "#8dffda"],
  },
  {
    name: "Traffic jam",
    colors: ["#10121c", "#fd2949", "#fe8d2b", "#f8e723", "#e6eeed", "#497eff"],
  },
  {
    name: "Laser lagoon",
    colors: ["#071e2e", "#073c5d", "#126fbb", "#22e4db", "#b7ff78", "#f8ecb4"],
  },
  {
    name: "Soft apocalypse",
    colors: ["#312844", "#9a5c8f", "#fba0b0", "#ffd1b0", "#f7ebcd", "#94c8c0"],
  },
  {
    name: "Printer tantrum",
    colors: ["#080811", "#fa19ac", "#03e7ef", "#f6ff2e", "#fbf6ef"],
  },
];
/** Shared studio vault: full original stop orders (including all 12-stop sets). */
export const palettes = [
  ...originalPalettes,
  ...PALETTE_VAULT.map(p => ({
    id: p.id, name: p.name, group: p.group, source: p.source,
    colors: [...p.colors],
  })),
];
export const ratios = [
  { id: "1:1", value: 1 },
  { id: "9:16", value: 9 / 16 },
  { id: "16:9", value: 16 / 9 },
  { id: "3:4", value: 3 / 4 },
  { id: "4:3", value: 4 / 3 },
];
export const touchModes = ["Warp", "Vortex", "Repel", "Chroma"];
export const motionModes = ["Liquid flow", "Breathing", "Orbital", "Traveling waves", "Internal turbulence"];
export const tunnelModes = ["Infinite spiral","Conch cathedral","Braided wormhole","Moiré throat","Living iris","Liquid vortex"];
export const stereoShapes = ["Gyroid Cathedral", "Metaball Choir", "Opal Knot", "Crystal Lattice", "Ribbon Wormhole"];
export const wiggleModes = ["Flipbook", "Smooth orbit", "Hold left", "Hold right"];
export const letteringStyles = ["Neon bling","RGB split","Chrome foil","Void stencil","Custom ink","Holographic","Electric glow","Liquid candy","Ghost echo","Chromatic shimmer","Heatwave","Glitter ink","Prism pulse","Soft shadow"];
export const compositionModes = [
  "Iris portals", "Braided ribbons", "Cell colonies", "Patchwork",
  "Orbital archipelagos", "Woven windows",
];
export const backdropModes = [
  "Nebula veils", "Cosmic pollen", "Caustic undercurrent", "Ghost architecture",
  "Phosphor jacquard", "Opal cell fog",
];
export const microModes = [
  "Living embroidery", "Opal granulation", "Gel caustics", "Point lace",
  "Glass filaments", "Crystalline cilia",
];
export const substanceModes = [
  "CMY lithogenesis", "Chromatophore reef",
  "Chitin interference", "Conformal chromasoup",
];
export const chaosPhrases = ["ERROR ANGEL", "GLITCHBITCH", "LOVE.exe", "U R CUTE", "SOFT APOCALYPSE",
  "INFINITE TRASH", "COSMIC STATIC", "NEON FUNERAL", "NO SIGNAL", "DIVINE MALFUNCTION",
  "HYPERSPACE", "TOXIC DREAM", "BLESSED ERROR", "404 REALITY", "SWEET CORRUPTION"];
export const numericRanges = {
  complexity: [0, 100],
  scale: [0, 100],
  warp: [0, 100],
  speed: [0, 100],
  split: [0, 100],
  scan: [0, 100],
  grain: [0, 100],
  glitch: [0, 100],
  strength: [0, 100],
  radius: [5, 60],
  rotation: [0, 360],
  symmetry: [1, 12],
  blend: [0, 100],
  block: [0, 100],
  pixel: [0, 100],
  vignette: [0, 100],
  phosphor: [0, 100],
  dither: [0, 100],
  riso: [0, 100],
  windowCascade: [0, 100],
  glitter: [0, 100],
  broadcast: [0, 100],
  misregister: [0, 100],
  afterimage: [0, 100],
  datamosh: [0, 100],
  memoryDrift: [0, 100],
  memoryDecay: [0, 100],
  hyperbolicFold: [0, 100],
  fractalZoom: [0, 100],
  juliaMix: [0, 100],
  quasiDensity: [0, 100],
  tunnelTwist: [0, 100],
  tunnelDepth: [0, 100],
  tunnelRidges: [0, 100],
  tunnelPulse: [0, 100],
  tunnelAperture: [0, 100],
  tunnelVariation: [0, 100],
  motionAmount: [0, 100],
  motionRate: [0, 100],
  lightMotion: [0, 100],
  bioAmount: [0, 100],
  bioFeed: [0, 100],
  bioKill: [0, 100],
  bioSpeed: [0, 100],
  bioVeins: [0, 100],
  wiggleAmount: [0, 100],
  wiggleDepth: [0, 100],
  wiggleSpeed: [0, 100],
  wiggleLayers: [0, 100],
  stereoAmount: [0, 100],
  stereoDepth: [0, 100],
  stereoParallax: [0, 100],
  stereoMorph: [0, 100],
  stereoGlow: [0, 100],
  stereoWiggle: [0, 100],
  stereoQuality: [0, 100],
  filmAmount: [0, 100],
  filmThickness: [0, 100],
  opalAmount: [0, 100],
  prismAmount: [0, 100],
  foilRelief: [0, 100],
  foilMotion: [0, 100],
  letteringAmount: [0, 100],
  letteringScale: [0, 100],
  letteringWarp: [0, 100],
  letteringMotion: [0, 100],
  letteringGradientAngle: [0, 360],
  compositionAmount: [0, 100],
  compositionScale: [0, 100],
  compositionFeather: [0, 100],
  compositionMotion: [0, 100],
  compositionColorShift: [0, 100],
  compositionVariation: [0, 100],
  backdropAmount: [0, 100],
  backdropDepth: [0, 100],
  backdropDensity: [0, 100],
  backdropMotion: [0, 100],
  backdropGlow: [0, 100],
  backdropHue: [0, 100],
  backdropVariation: [0, 100],
  microAmount: [0, 100],
  microScale: [0, 100],
  microMotion: [0, 100],
  microRelief: [0, 100],
  microDensity: [0, 100],
  microHue: [0, 100],
  microVariation: [0, 100],
  substanceAmount: [0, 100],
  substanceScale: [0, 100],
  substanceMotion: [0, 100],
  substanceRelief: [0, 100],
  substanceEdge: [0, 100],
  substanceHue: [0, 100],
  substanceVariation: [0, 100],
  saturation: [0, 100],
  contrast: [0, 100],
  brightness: [0, 100],
  colorOffset: [0, 100],
  colorRepeat: [0, 100],
  colorSpeed: [0, 100],
  colorAmount: [0, 100],
};
export const initial = {
  engine: 0,
  palette: 0,
  colors: palettes[0].colors,
  complexity: 62,
  scale: 42,
  warp: 65,
  speed: 30,
  split: 12,
  scan: 16,
  grain: 8,
  glitch: 24,
  bloom: true,
  posterize: false,
  mirror: false,
  seed: 82491,
  marks: [],
  touchMode: "Warp",
  strength: 60,
  radius: 22,
  rotation: 0,
  symmetry: 1,
  secondaryEngine: 6,
  blend: 0,
  blendMode: "Mix",
  block: 0,
  pixel: 0,
  vignette: 0,
  phosphor: 0,
  dither: 0,
  riso: 0,
  windowCascade: 0,
  glitter: 0,
  broadcast: 0,
  misregister: 0,
  afterimage: 0,
  datamosh: 0,
  memoryDrift: 20,
  memoryDecay: 28,
  hyperbolicFold: 70,
  fractalZoom: 25,
  juliaMix: 0,
  quasiDensity: 50,
  tunnelMode: "Infinite spiral",
  tunnelTwist: 52,
  tunnelDepth: 61,
  tunnelRidges: 48,
  tunnelPulse: 49,
  tunnelAperture: 35,
  tunnelVariation: 27,
  motionAmount: 0,
  motionRate: 50,
  lightMotion: 0,
  motionMode: "Liquid flow",
  bioAmount: 0,
  bioFeed: 44,
  bioKill: 42,
  bioSpeed: 53,
  bioVeins: 54,
  wiggleMode: "Flipbook",
  wiggleAmount: 0,
  wiggleDepth: 65,
  wiggleSpeed: 45,
  wiggleLayers: 52,
  stereoAmount: 0,
  stereoDepth: 55,
  stereoParallax: 28,
  stereoMorph: 44,
  stereoGlow: 62,
  stereoWiggle: 38,
  stereoQuality: 45,
  stereoShape: "Gyroid Cathedral",
  filmAmount: 0,
  filmThickness: 54,
  opalAmount: 0,
  prismAmount: 0,
  foilRelief: 0,
  foilMotion: 47,
  lettering: "",
  letteringStyle: "Neon bling",
  letteringFont: "original",
  letteringAmount: 0,
  letteringScale: 48,
  letteringWarp: 40,
  letteringMotion: 55,
  letteringFillMode: "Solid",
  letteringFill: "#ffffff",
  letteringGradient: ["#ff2fbf","#00f5ff","#fff36a"],
  letteringGradientAngle: 0,
  letteringStrokes: [],
  compositionMode: "Iris portals",
  compositionAmount: 0,
  compositionScale: 54,
  compositionFeather: 38,
  compositionMotion: 52,
  compositionColorShift: 47,
  compositionVariation: 50,
  backdropMode: "Nebula veils",
  backdropAmount: 0,
  backdropDepth: 65,
  backdropDensity: 55,
  backdropMotion: 58,
  backdropGlow: 72,
  backdropHue: 47,
  backdropVariation: 50,
  microMode: "Living embroidery",
  microAmount: 0,
  microScale: 50,
  microMotion: 52,
  microRelief: 55,
  microDensity: 57,
  microHue: 48,
  microVariation: 50,
  substanceMode: "CMY lithogenesis",
  substanceAmount: 0,
  substanceScale: 54,
  substanceMotion: 54,
  substanceRelief: 62,
  substanceEdge: 68,
  substanceHue: 43,
  substanceVariation: 41,
  invert: false,
  saturation: 50,
  contrast: 50,
  brightness: 50,
  colorOffset: 0,
  colorRepeat: 50,
  colorSpeed: 30,
  colorAmount: 0,
  colorMode: "Traveling wave",
  freezeGeometry: false,
  freezeColor: false,
  ratio: "1:1",
};
const bools = [
  "bloom",
  "posterize",
  "mirror",
  "invert",
  "freezeGeometry",
  "freezeColor",
];
const colorRE = /^#[0-9a-f]{6}$/i;
export function validateRecipe(input) {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw Error("This is not an art recipe.");
  const x = input.state || input,
    s = { ...initial };
  for (const key of Object.keys(numericRanges)) {
    if (x[key] === undefined) continue;
    const [min, max] = numericRanges[key];
    if (!Number.isFinite(x[key]) || x[key] < min || x[key] > max)
      throw Error(`Invalid ${key}.`);
    s[key] = x[key];
  }
  for (const key of ["engine", "secondaryEngine"]) {
    if (x[key] === undefined && key === "secondaryEngine") continue;
    if (!Number.isInteger(x[key]) || x[key] < 0 || x[key] >= engines.length)
      throw Error("Unknown mathematical engine.");
    s[key] = x[key];
  }
  if (!Number.isInteger(x.seed) || x.seed < 0 || x.seed > 999999999)
    throw Error("The seed must be a whole number from 0 to 999999999.");
  if (
    !Array.isArray(x.colors) ||
    x.colors.length < 2 ||
    x.colors.length > 12 ||
    !x.colors.every((c) => typeof c === "string" && colorRE.test(c))
  )
    throw Error("A palette needs 2–12 valid hex colors.");
  s.seed = x.seed;
  s.colors = x.colors.map((c) => c.toLowerCase());
  s.palette =
    Number.isInteger(x.palette) && x.palette >= 0 && x.palette < palettes.length
      ? x.palette
      : -1;
  for (const key of bools) {
    if (x[key] !== undefined) {
      if (typeof x[key] !== "boolean") throw Error(`Invalid ${key}.`);
      s[key] = x[key];
    }
  }
  for (const [key, choices] of Object.entries({
    touchMode: touchModes,
    ratio: ratios.map((r) => r.id),
    blendMode: ["Mix", "Multiply", "Difference"],
    colorMode: ["Traveling wave", "Color canon", "Phase vortex"],
    motionMode: motionModes,
    tunnelMode: tunnelModes,
    stereoShape: stereoShapes,
    wiggleMode: wiggleModes,
    letteringStyle: letteringStyles,
    letteringFont: retroFontIds,
    letteringFillMode: ["Solid","Linear gradient","Radial gradient"],
    compositionMode: compositionModes,
    backdropMode: backdropModes,
    microMode: microModes,
    substanceMode: substanceModes,
  })) {
    if (x[key] !== undefined) {
      if (!choices.includes(x[key])) throw Error(`Unknown ${key}.`);
      s[key] = x[key];
    }
  }
  if(x.letteringFill !== undefined){
    if(typeof x.letteringFill!=="string"||!colorRE.test(x.letteringFill))throw Error("Invalid text fill color.");
    s.letteringFill=x.letteringFill.toLowerCase();
  }
  if(x.letteringGradient !== undefined){
    if(!Array.isArray(x.letteringGradient)||x.letteringGradient.length<2||x.letteringGradient.length>8||
       !x.letteringGradient.every(c=>typeof c==="string"&&colorRE.test(c)))throw Error("Invalid text gradient.");
    s.letteringGradient=x.letteringGradient.map(c=>c.toLowerCase());
  }
  if(x.letteringStrokes !== undefined){
    if(!Array.isArray(x.letteringStrokes)||x.letteringStrokes.length>5)throw Error("Too many outlines.");
    s.letteringStrokes=x.letteringStrokes.map(layer=>{
      if(!layer||typeof layer.color!=="string"||!colorRE.test(layer.color)||
         !Number.isFinite(layer.width)||layer.width<0||layer.width>40||
         typeof layer.enabled!=="boolean")throw Error("Invalid text outline.");
      return {color:layer.color.toLowerCase(),width:layer.width,enabled:layer.enabled};
    });
  }
  if(x.lettering !== undefined) {
    if(typeof x.lettering !== "string" || x.lettering.length>280 ||
       /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(x.lettering))
      throw Error("Your quote must be 280 characters or fewer (line breaks allowed).");
    s.lettering=x.lettering.replace(/\r\n?/g,"\n");
  }
  if (x.marks !== undefined) {
    if (!Array.isArray(x.marks) || x.marks.length > 32)
      throw Error("A recipe can hold up to 32 touch forces.");
    const ids = new Set();
    s.marks = x.marks.map((m, i) => {
      if (
        !m ||
        !["x", "y", "power", "mode"].every((k) => Number.isFinite(m[k])) ||
        m.x < 0 ||
        m.x > 1 ||
        m.y < 0 ||
        m.y > 1 ||
        Math.abs(m.power) > 2 ||
        !Number.isInteger(m.mode) ||
        m.mode < 0 ||
        m.mode > 3
      )
        throw Error("Invalid touch force.");
      const id = typeof m.id === "string" ? m.id.slice(0, 80) : `legacy-${i}`;
      if (ids.has(id)) throw Error("Duplicate touch force.");
      ids.add(id);
      const radius = m.radius ?? 0.22,
        angle = m.angle ?? 0;
      if (
        !Number.isFinite(radius) ||
        radius < 0.05 ||
        radius > 0.6 ||
        !Number.isFinite(angle) ||
        Math.abs(angle) > 1000
      )
        throw Error("Invalid force size or angle.");
      return {
        id,
        x: m.x,
        y: m.y,
        power: m.power,
        mode: m.mode,
        radius,
        angle,
      };
    });
  }
  return s;
}
export function parseDocument(input) {
  const state = validateRecipe(input);
  const time = input.timeline?.time ?? input.time ?? 0,
    colorTime = input.timeline?.colorTime ?? time;
  if (
    !Number.isFinite(time) ||
    time < 0 ||
    time > 1e8 ||
    !Number.isFinite(colorTime) ||
    colorTime < 0 ||
    colorTime > 1e8
  )
    throw Error("Invalid animation time.");
  return {
    state,
    title:
      typeof input.title === "string"
        ? input.title.slice(0, 100)
        : "Untitled exploration",
    timeline: { time, colorTime },
  };
}
export function recipeDocument(state, title, timeline) {
  return {
    app: "glitchhhhhh-art",
    version: 2,
    title,
    state,
    timeline: { ...timeline },
  };
}
export function parsePalette(text) {
  let source = text.trim();
  if (/^https?:\/\/coolors\.co\//i.test(source))
    source = source.split("/").pop().split("?")[0].replaceAll("-", " ");
  const colors = source
    .split(/[\s,;]+/)
    .filter(Boolean)
    .map((c) => (c.startsWith("#") ? c : `#${c}`));
  if (
    colors.length < 2 ||
    colors.length > 12 ||
    !colors.every((c) => colorRE.test(c))
  )
    throw Error(
      "Paste 2–12 six-digit hex colors, separated by spaces or commas.",
    );
  return colors.map((c) => c.toLowerCase());
}
export function paletteName(state) {
  return (
    palettes.find(
      (p) =>
        p.colors.length === state.colors.length &&
        p.colors.every(
          (c, i) => c.toLowerCase() === state.colors[i].toLowerCase(),
        ),
    )?.name || "Custom mix"
  );
}
export function makeMark(state, x = 0.5, y = 0.5) {
  return {
    id:
      globalThis.crypto?.randomUUID?.() ||
      `force-${Date.now()}-${Math.random()}`,
    x,
    y,
    power: state.strength / 100,
    mode: touchModes.indexOf(state.touchMode),
    radius: state.radius / 100,
    angle: 0,
  };
}
const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, n));
const sample = (a, random) => a[Math.min(a.length-1, Math.floor(random()*a.length))];
const different = (list, current, random) =>
  sample(list.filter(x => x !== current),random) ?? current;

export function randomize(state, locks={}, mutate=false, random=Math.random) {
  if (mutate) {
    // Mutate is a nudge. Preserve brushwork, palette, geometry and lock intentions.
    const s={...state};
    const nudges=["complexity","scale","warp","split","scan","grain","glitch","rotation",
      "blend","block","pixel","vignette","phosphor","dither","riso","windowCascade",
      "glitter","broadcast","misregister","afterimage","datamosh","memoryDrift",
      "memoryDecay","hyperbolicFold","fractalZoom","juliaMix","quasiDensity",
      "tunnelTwist","tunnelDepth","tunnelRidges","tunnelPulse",
      "tunnelAperture","tunnelVariation",
      "motionAmount","motionRate","lightMotion","bioAmount","bioFeed","bioKill",
      "bioSpeed","bioVeins","wiggleAmount","wiggleDepth","wiggleSpeed","wiggleLayers",
      "stereoAmount","stereoDepth","stereoParallax",
      "stereoMorph","stereoGlow","stereoWiggle","stereoQuality",
      "filmAmount","filmThickness","opalAmount","prismAmount","foilRelief","foilMotion",
      "letteringAmount","letteringScale","letteringWarp","letteringMotion",
      "compositionAmount","compositionScale","compositionFeather",
      "compositionMotion","compositionColorShift","compositionVariation",
      "backdropAmount","backdropDepth","backdropDensity","backdropMotion",
      "backdropGlow","backdropHue","backdropVariation",
      "microAmount","microScale","microMotion","microRelief",
      "microDensity","microHue","microVariation",
      "substanceAmount","substanceScale","substanceMotion",
      "substanceRelief","substanceEdge","substanceHue","substanceVariation",
      "saturation","contrast","brightness","colorOffset",
      "colorRepeat","colorAmount","speed","colorSpeed"];
    for(const key of nudges){
      const [lo,hi]=numericRanges[key];
      s[key]=clamp(state[key]+(random()-.5)*(hi-lo)*.22,lo,hi);
    }
    return s;
  }
  // A full Surprise is a replacement, not a mutation. Ratio is the sole
  // retained visual constraint. Paused transport lives outside recipe state.
  // Instrument explicit assignments, then randomize any new numeric sliders
  // automatically. No future feature gets accidentally left out of Surprise Me.
  const randomizedKeys = new Set();
  const s = new Proxy({...initial, ratio:state.ratio}, {
    set(target,key,value) { randomizedKeys.add(key); target[key]=value; return true; }
  });
  // Rotate to a different mathematical FAMILY, even with a fixed RNG test stub.
  const family=engineInfo[state.engine]?.family;
  const otherFamilies=engineInfo.filter(e=>e.id!==state.engine && e.family!==family);
  s.engine=sample(otherFamilies.length?otherFamilies:engineInfo.filter(e=>e.id!==state.engine),random).id;
  s.secondaryEngine=sample(engineInfo.filter(e=>e.id!==s.engine && e.id!==state.secondaryEngine),random).id;
  s.seed=Math.floor(random()*1000000000);
  if(s.seed===state.seed)s.seed=(s.seed+1)%1000000000;
  // Most surprises select a different vault palette; some invent fresh colors.
  // All generated palettes remain user-editable, reversible and recipe-safe.
  if(random()<.22){
    s.palette=-1;
    s.colors=generateRandomPalette(random);
  }else{
    const paletteChoices=palettes.map((p,i)=>i).filter(i=>i!==state.palette);
    s.palette=sample(paletteChoices,random);
    s.colors=random()<.4
      ? shuffleColorStops(palettes[s.palette].colors,random)
      : [...palettes[s.palette].colors];
    if(s.colors.some((c,i)=>c!==palettes[s.palette].colors[i]))s.palette=-1;
  }
  s.blendMode=different(["Mix","Multiply","Difference"],state.blendMode,random);
  s.blend=random()<.18?0:22+random()*70;
  s.complexity=20+random()*80; s.scale=8+random()*80; s.warp=12+random()*88;
  s.rotation=random()*360;
  s.symmetry=sample([1,1,2,3,4,5,6,8,10,12],random);
  s.mirror=random()<.43;s.bloom=random()<.8;s.posterize=random()<.27;s.invert=random()<.12;
  s.split=random()<.65?random()*60:0;
  s.scan=random()<.5?random()*40:0;
  s.grain=random()<.6?random()*32:0;
  s.glitch=random()<.53?random()*48:0;
  s.block=random()<.42?random()*65:0;
  s.pixel=random()<.3?random()*58:0;
  s.vignette=random()<.5?random()*32:0;
  const ornaments=["phosphor","dither","riso","windowCascade","glitter","broadcast"];
  for(const key of ornaments)s[key]=0;
  const available=[...ornaments];
  const count=1+Math.floor(random()*3);
  for(let i=0;i<count;i++){
    const index=Math.min(available.length-1,Math.floor(random()*available.length));
    const key=available.splice(index,1)[0];
    s[key]=25+random()*70;
  }
  s.misregister=s.riso>0?random()*70:0;
  s.afterimage=random()<.45?20+random()*62:0;
  s.datamosh=random()<.35?22+random()*64:0;
  s.memoryDrift=10+random()*76;s.memoryDecay=10+random()*60;
  s.tunnelMode=different(tunnelModes,state.tunnelMode,random);
  s.tunnelTwist=12+random()*87;
  s.tunnelDepth=19+random()*79;
  s.tunnelRidges=11+random()*88;
  s.tunnelPulse=21+random()*77;
  s.tunnelAperture=8+random()*90;
  s.tunnelVariation=random()*100;
  s.hyperbolicFold=15+random()*85;s.fractalZoom=random()*90;
  s.juliaMix=random()*100;s.quasiDensity=12+random()*83;
  s.bioFeed=22+random()*55;s.bioKill=22+random()*57;
  s.bioSpeed=25+random()*75;s.bioVeins=random()*100;
  s.bioAmount=(s.engine===15||s.secondaryEngine===15&&s.blend>0||random()<.35)
    ? 30+random()*69:0;
  // Surprise may opt into a lightweight 2D parallax illusion.
  s.wiggleMode=different(wiggleModes,state.wiggleMode,random);
  s.wiggleAmount=random()<.54 ? 30+random()*63 : 0;
  s.wiggleDepth=22+random()*76;
  s.wiggleSpeed=16+random()*73;
  s.wiggleLayers=17+random()*80;
  s.stereoShape=different(stereoShapes,state.stereoShape,random);
  s.stereoAmount=(s.engine===16 || s.secondaryEngine===16 && s.blend>0 || random()<.27)
    ? 32+random()*65 : 0;
  s.stereoDepth=28+random()*70;
  s.stereoParallax=18+random()*66;
  s.stereoMorph=10+random()*89;
  s.stereoGlow=37+random()*62;
  s.stereoWiggle=22+random()*75;
  s.stereoQuality=24+random()*55;
  s.filmAmount=random()<.65 ? 32+random()*67:0;
  s.filmThickness=10+random()*90;
  s.opalAmount=random()<.47 ? 24+random()*72:0;
  s.prismAmount=random()<.49 ? 24+random()*75:0;
  s.foilRelief=random()<.55 ? 20+random()*70:0;
  s.foilMotion=31+random()*67;
  // Surprise Me NEVER generates a slogan. Words belong to the artist.
  s.letteringStyle=different(letteringStyles,state.letteringStyle,random);
  s.letteringFont=different(retroFontIds,state.letteringFont,random);
  s.lettering="";
  s.letteringAmount=0;
  s.letteringScale=20+random()*54;
  s.letteringWarp=0;
  s.letteringMotion=15+random()*45;
  // Composition is a separately randomized spatial design, not a palette shuffle.
  s.compositionMode=different(compositionModes,state.compositionMode,random);
  s.compositionAmount=random()<.84 ? 53+random()*46 : 0;
  s.compositionScale=18+random()*78;
  s.compositionFeather=12+random()*68;
  s.compositionMotion=30+random()*70;
  s.compositionColorShift=18+random()*77;
  s.compositionVariation=random()*100;
  if(s.compositionAmount>0 && s.blend<.2) s.blend=25+random()*65;
  s.backdropMode=different(backdropModes,state.backdropMode,random);
  s.backdropAmount=42+random()*57;
  s.backdropDepth=24+random()*74;
  s.backdropDensity=15+random()*81;
  s.backdropMotion=32+random()*67;
  s.backdropGlow=35+random()*64;
  s.backdropHue=12+random()*86;
  s.backdropVariation=random()*100;
  s.microMode=different(microModes,state.microMode,random);
  s.microAmount=random()<.82?27+random()*60:0;
  s.microScale=16+random()*78;
  s.microMotion=32+random()*65;
  s.microRelief=20+random()*77;
  s.microDensity=20+random()*74;
  s.microHue=11+random()*87;
  s.microVariation=random()*100;
  s.substanceMode=different(substanceModes,state.substanceMode,random);
  s.substanceAmount=random()<.67 ? 45+random()*52 : 0;
  s.substanceScale=20+random()*77;
  s.substanceMotion=24+random()*74;
  s.substanceRelief=27+random()*70;
  s.substanceEdge=19+random()*79;
  s.substanceHue=10+random()*88;
  s.substanceVariation=random()*100;
  s.motionMode=different(motionModes,state.motionMode,random);
  s.motionAmount=42+random()*58;s.motionRate=28+random()*72;
  s.lightMotion=38+random()*62;
  s.speed=25+random()*70;s.colorSpeed=22+random()*75;
  s.freezeGeometry=false;s.freezeColor=false;
  s.colorMode=different(["Traveling wave","Color canon","Phase vortex"],state.colorMode,random);
  s.colorAmount=15+random()*85;s.colorRepeat=12+random()*88;
  s.colorOffset=random()*100;s.saturation=34+random()*66;
  s.contrast=28+random()*72;s.brightness=30+random()*70;
  s.touchMode=different(touchModes,state.touchMode,random);
  s.strength=18+random()*78;s.radius=8+random()*47;
  // No old strokes may survive. Some surprises spawn entirely new touch forces.
  const markCount=random()<.30?0:1+Math.floor(random()*4);
  s.marks=Array.from({length:markCount},(_,i)=>({
    id:`surprise-${s.seed}-${i}`,
    x:.1+random()*.8,y:.1+random()*.8,
    power:(.25+random()*.72)*(random()<.14?-1:1),
    mode:Math.floor(random()*4),
    radius:.06+random()*.38,
    angle:random()*Math.PI*2,
  }));
  // General-purpose coverage contract: every numeric setting that exists in
  // numericRanges MUST get a fresh value. Purpose-built distributions above
  // win; any newly added numeric field gets a safe, editable fallback.
  for (const [key,[min,max]] of Object.entries(numericRanges))
    if(!randomizedKeys.has(key))s[key]=min+random()*(max-min);
  return {...s};
}
export const looks = [
  {
    name: "Toxic tides",
    note: "Liquid marble / neon currents",
    state: {
      ...initial,
      engine: 6,
      warp: 82,
      complexity: 73,
      scale: 32,
      glitch: 39,
      seed: 76042,
    },
  },
  {
    name: "Cathedral FM",
    note: "Crystal shards / chroma canon",
    state: {
      ...initial,
      engine: 11,
      palette: 8,
      colors: palettes[8].colors,
      complexity: 49,
      scale: 18,
      symmetry: 5,
      split: 28,
      colorMode: "Color canon",
      colorAmount: 65,
      seed: 27182,
    },
  },
  {
    name: "Spore party",
    note: "Cellular dream / poison garden",
    state: {
      ...initial,
      engine: 7,
      palette: 9,
      colors: palettes[9].colors,
      complexity: 38,
      scale: 20,
      warp: 40,
      grain: 16,
      scan: 0,
      seed: 62091,
    },
  },
  {
    name: "Velvet interference",
    note: "Moiré × orbit lace / digital koi",
    state: {
      ...initial,
      engine: 3,
      secondaryEngine: 8,
      blend: 58,
      blendMode: "Difference",
      palette: 10,
      colors: palettes[10].colors,
      scale: 18,
      complexity: 32,
      glitch: 10,
      seed: 8841,
    },
  },
  {
    name: "Arcade mulch",
    note: "Pixel rot / printer tantrum",
    state: {
      ...initial,
      engine: 4,
      palette: 15,
      colors: palettes[15].colors,
      scale: 22,
      complexity: 26,
      block: 50,
      glitch: 57,
      pixel: 20,
      seed: 41020,
    },
  },
  {
    name: "Electric tapestry",
    note: "Chroma weave / ultraviolet bruise",
    state: {
      ...initial,
      engine: 10,
      palette: 11,
      colors: palettes[11].colors,
      complexity: 58,
      warp: 40,
      scale: 26,
      split: 32,
      scan: 8,
      colorAmount: 45,
      colorMode: "Traveling wave",
      seed: 99014,
    },
  },
  {
    name: "CRT Bloomquake",
    note: "Macro subpixels against an electric interference field",
    family: "CRT",
    state: { ...initial, engine: 3, palette: 10, colors: palettes[10].colors, phosphor: 95, glitter: 30, scale: 24, complexity: 68, scan: 12, split: 14, seed: 27611 },
  },
  {
    name: "Bayer Funeral",
    note: "Pixel-locked ordered dithering and crushed color",
    family: "Print",
    state: { ...initial, engine: 4, palette: 15, colors: palettes[15].colors, dither: 96, riso: 20, pixel: 28, grain: 10, block: 34, scale: 17, seed: 67142 },
  },
  {
    name: "CMY Print Riot",
    note: "Angled cyan/magenta/yellow ink misregistration",
    family: "Print",
    state: { ...initial, engine: 9, palette: 15, colors: palettes[15].colors, riso: 95, misregister: 65, dither: 24, phosphor: 0, scale: 22, complexity: 70, seed: 23145 },
  },
  {
    name: "GeoCities Afterparty",
    note: "Animated desktop windows with flickering bling",
    family: "Old Web",
    state: { ...initial, engine: 3, palette: 1, colors: palettes[1].colors, windowCascade: 95, glitter: 88, glitch: 30, scale: 35, complexity: 61, seed: 76524 },
  },
  {
    name: "Lost Transmission",
    note: "Retro test bars, head-switch damage and phosphor",
    family: "Broadcast",
    state: { ...initial, engine: 5, palette: 4, colors: palettes[4].colors, broadcast: 88, phosphor: 66, glitch: 72, scan: 50, block: 36, scale: 26, seed: 43181 },
  },
  {
    name: "Haunted Desktop",
    note: "Floating error popups over impossible math",
    family: "Old Web",
    state: { ...initial, engine: 2, palette: 7, colors: palettes[7].colors, windowCascade: 95, phosphor: 52, broadcast: 28, glitter: 14, scale: 42, seed: 18813 },
  },
  {
    name: "Rainbow Snowstorm",
    note: "Cellular sparkle storms and glowing screen dots",
    family: "CRT",
    state: { ...initial, engine: 7, palette: 1, colors: palettes[1].colors, glitter: 95, phosphor: 80, riso: 24, grain: 25, scale: 28, seed: 62491 },
  },
  {
    name: "Acid Newsprint",
    note: "Printed moiré with crawling halftone rosettes",
    family: "Print",
    state: { ...initial, engine: 10, palette: 15, colors: palettes[15].colors, dither: 88, riso: 93, misregister: 62, scale: 32, complexity: 66, seed: 20819 },
  },
  {
    name: "Pixel Cemetery",
    note: "Decaying digital blocks and ghostly browser windows",
    family: "Digital",
    state: { ...initial, engine: 4, palette: 8, colors: palettes[8].colors, dither: 92, windowCascade: 55, pixel: 36, glitch: 64, scale: 13, seed: 52783 },
  },
  {
    name: "TV Church",
    note: "Prismatic geometry trapped in a dying CRT",
    family: "Broadcast",
    state: { ...initial, engine: 11, palette: 11, colors: palettes[11].colors, phosphor: 96, broadcast: 64, windowCascade: 35, glitch: 49, symmetry: 7, scale: 24, seed: 12798 },
  },
  {
    name: "Candy Error Message",
    note: "Acidic bubbles and animated UI jewelry",
    family: "Old Web",
    state: { ...initial, engine: 1, palette: 6, colors: palettes[6].colors, glitter: 82, windowCascade: 89, riso: 28, scale: 31, seed: 83791 },
  },
  {
    name: "Ghost Signal Wallpaper",
    note: "Layered print, subpixel grids and haunted fabric",
    family: "Mixed",
    state: { ...initial, engine: 10, palette: 9, colors: palettes[9].colors, phosphor: 74, riso: 60, dither: 42, glitter: 35, blend: 43, secondaryEngine: 3, scale: 31, seed: 51408 },
  },
  {
    name: "Neon Afterimage Séance",
    note: "Ghostly plasma trails with real previous-frame persistence",
    family: "Memory",
    state: { ...initial, engine: 0, palette: 1, colors: palettes[1].colors, afterimage: 86, datamosh: 9, memoryDrift: 49, memoryDecay: 13, scale: 29, warp: 77, colorAmount: 45, split: 12, seed: 97124 },
  },
  {
    name: "Codec Reef",
    note: "Living-looking chroma cells trapped in corrupted video blocks",
    family: "Memory",
    state: { ...initial, engine: 7, palette: 9, colors: palettes[9].colors, afterimage: 39, datamosh: 83, memoryDrift: 37, memoryDecay: 17, complexity: 76, scale: 21, block: 13, seed: 64517 },
  },
  {
    name: "Spectral Tape Apparition",
    note: "Iridescent moiré haunted by a dragged video memory",
    family: "Memory",
    state: { ...initial, engine: 3, palette: 8, colors: palettes[8].colors, afterimage: 77, datamosh: 45, memoryDrift: 65, memoryDecay: 18, phosphor: 42, glitter: 20, scale: 17, seed: 33572 },
  },
  {
    name: "Magenta Mosh Cathedral",
    note: "Crystal geometry liquefied into lingering fractured frames",
    family: "Memory",
    state: { ...initial, engine: 11, palette: 15, colors: palettes[15].colors, afterimage: 43, datamosh: 96, memoryDrift: 83, memoryDecay: 9, riso: 18, complexity: 80, symmetry: 6, scale: 24, seed: 87231 },
  },
  {
    name: "Poincaré Phosphor Cathedral",
    note: "A living hyperbolic chapel of glowing subpixel geometry",
    family: "Non-Euclidean",
    state: { ...initial, engine: 12, palette: 11, colors: palettes[11].colors, hyperbolicFold: 92, phosphor: 65, scale: 18, complexity: 62, glitch: 3, motionMode: "Orbital", motionAmount: 67, motionRate: 61, lightMotion: 81, seed: 80127 },
  },
  {
    name: "Sevenfold Signal Chapel",
    note: "Hyperbolic edges breathing through analog ghost light",
    family: "Non-Euclidean",
    state: { ...initial, engine: 12, palette: 13, colors: palettes[13].colors, hyperbolicFold: 85, phosphor: 89, afterimage: 23, scale: 13, motionMode: "Breathing", motionAmount: 56, motionRate: 47, lightMotion: 74, seed: 74129 },
  },
  {
    name: "Impossible Wallpaper",
    note: "Non-Euclidean tiles crossed with hostile moiré",
    family: "Non-Euclidean",
    state: { ...initial, engine: 12, palette: 15, colors: palettes[15].colors, hyperbolicFold: 74, secondaryEngine: 3, blend: 49, blendMode: "Difference", riso: 43, scale: 12, glitch: 0, motionMode: "Traveling waves", motionAmount: 64, motionRate: 54, lightMotion: 69, seed: 61124 },
  },
  {
    name: "Candy Seahorse Portal",
    note: "Mandelbrot filaments slowly folding into luminous candy rivers",
    family: "Fractal",
    state: { ...initial, engine: 13, palette: 1, colors: palettes[1].colors, fractalZoom: 64, juliaMix: 0, complexity: 93, scale: 30, motionMode: "Internal turbulence", motionAmount: 29, motionRate: 38, lightMotion: 88, seed: 70215 },
  },
  {
    name: "Julia Meltdown",
    note: "Complex Julia geometry dragged through actual codec memory",
    family: "Fractal",
    state: { ...initial, engine: 13, palette: 15, colors: palettes[15].colors, fractalZoom: 21, juliaMix: 100, complexity: 86, datamosh: 47, afterimage: 35, motionMode: "Orbital", motionAmount: 57, motionRate: 49, lightMotion: 71, seed: 78364 },
  },
  {
    name: "Orbit Trap Candy Glass",
    note: "Pink and cyan fractal boundary gloss crawling over geometric glass",
    family: "Fractal",
    state: { ...initial, engine: 13, palette: 10, colors: palettes[10].colors, fractalZoom: 47, juliaMix: 42, complexity: 93, phosphor: 32, motionMode: "Breathing", motionAmount: 28, motionRate: 42, lightMotion: 96, seed: 34511 },
  },
  {
    name: "Fivefold Laser Garden",
    note: "A nonrepeating diffraction jungle with pulsing neon pigment",
    family: "Quasicrystal",
    state: { ...initial, engine: 14, palette: 1, colors: palettes[1].colors, quasiDensity: 54, complexity: 75, scale: 33, motionMode: "Liquid flow", motionAmount: 67, motionRate: 62, lightMotion: 76, seed: 87154 },
  },
  {
    name: "Riso Aperiodic Witchcraft",
    note: "Fivefold wave geometry quantized into faulty CMY printing",
    family: "Quasicrystal",
    state: { ...initial, engine: 14, palette: 15, colors: palettes[15].colors, quasiDensity: 77, dither: 76, riso: 81, misregister: 43, scale: 19, motionMode: "Traveling waves", motionAmount: 74, motionRate: 68, lightMotion: 51, seed: 41638 },
  },
  {
    name: "Diffraction Memory Cathedral",
    note: "Irrational interference leaving illuminated temporal fingerprints",
    family: "Quasicrystal",
    state: { ...initial, engine: 14, palette: 8, colors: palettes[8].colors, quasiDensity: 36, phosphor: 58, afterimage: 61, memoryDrift: 32, motionMode: "Orbital", motionAmount: 46, motionRate: 39, lightMotion: 86, seed: 91834 },
  },
  {
    name: "Psychedelic Breathing Room",
    note: "Soft organic contours gently inflating and changing illumination",
    family: "Motion",
    state: { ...initial, engine: 9, palette: 8, colors: palettes[8].colors, scale: 32, warp: 35, motionMode: "Breathing", motionAmount: 73, motionRate: 46, lightMotion: 83, glitch: 0, seed: 98107 },
  },
  {
    name: "Liquid Circuit Migration",
    note: "Woven neon electrical pathways flowing without losing their structure",
    family: "Motion",
    state: { ...initial, engine: 10, palette: 1, colors: palettes[1].colors, scale: 19, warp: 57, motionMode: "Liquid flow", motionAmount: 87, motionRate: 67, lightMotion: 72, seed: 67120 },
  },
  {
    name: "Orbital Jelly Dream",
    note: "Color membranes with nonrigid orbital motion and drifting highlights",
    family: "Motion",
    state: { ...initial, engine: 7, palette: 9, colors: palettes[9].colors, scale: 27, complexity: 77, motionMode: "Orbital", motionAmount: 80, motionRate: 55, lightMotion: 67, seed: 11782 },
  },
  {
    name: "Interference Ballet",
    note: "Multiple wavefronts traveling through a mathematical moiré field",
    family: "Motion",
    state: { ...initial, engine: 3, palette: 15, colors: palettes[15].colors, scale: 21, complexity: 67, motionMode: "Traveling waves", motionAmount: 85, motionRate: 73, lightMotion: 81, seed: 91525 },
  },
  {
    name: "Feral Velvet Current",
    note: "Fine rotating harmonic lace filled with internal light movement",
    family: "Motion",
    state: { ...initial, engine: 8, palette: 11, colors: palettes[11].colors, scale: 25, symmetry: 5, motionMode: "Internal turbulence", motionAmount: 76, motionRate: 51, lightMotion: 93, seed: 22867 },
  },
  {
    name: "Glowing Haunted Marble",
    note: "Marble contours that stay composed but never stop stirring",
    family: "Motion",
    state: { ...initial, engine: 6, palette: 10, colors: palettes[10].colors, scale: 33, warp: 79, afterimage: 35, motionMode: "Liquid flow", motionAmount: 59, motionRate: 35, lightMotion: 90, seed: 50732 },
  },
  {
    name: "Coral Codec Shrine",
    note: "Living reaction-diffusion reefs glowing through a broken tape signal",
    family: "Biology",
    state: { ...initial, engine: 15, palette: 9, colors: palettes[9].colors, bioFeed: 35, bioKill: 46, bioSpeed: 64, bioVeins: 83, bioAmount: 54, afterimage: 22, datamosh: 18, scale: 29, glitch: 4, motionMode: "Liquid flow", motionAmount: 62, lightMotion: 79, seed: 23879 },
  },
  {
    name: "Violet Mycelial Modem",
    note: "Underground spores spreading through shimmering CRT pigment",
    family: "Biology",
    state: { ...initial, engine: 15, palette: 11, colors: palettes[11].colors, bioFeed: 42, bioKill: 32, bioSpeed: 75, bioVeins: 95, phosphor: 41, bioAmount: 48, scale: 25, motionMode: "Internal turbulence", motionAmount: 41, lightMotion: 91, seed: 90271 },
  },
  {
    name: "Bubblegum Spore Riot",
    note: "Candy-colored growing chemistry with bright pixel confetti",
    family: "Biology",
    state: { ...initial, engine: 15, palette: 6, colors: palettes[6].colors, bioFeed: 53, bioKill: 52, bioSpeed: 74, bioVeins: 86, bioAmount: 34, glitter: 61, dither: 34, scale: 28, motionMode: "Breathing", motionAmount: 62, lightMotion: 83, seed: 67104 },
  },
  {
    name: "Fungal GeoCities",
    note: "Animated old-web popups overtaken by self-organizing coral chemistry",
    family: "Biology",
    state: { ...initial, engine: 6, palette: 1, colors: palettes[1].colors, bioFeed: 36, bioKill: 44, bioSpeed: 73, bioAmount: 88, bioVeins: 82, windowCascade: 70, glitter: 48, scale: 32, motionMode: "Orbital", motionAmount: 47, lightMotion: 79, seed: 57824 },
  },
  {
    name: "Infected Diffraction",
    note: "Fivefold mathematical interference colonized by branching spores",
    family: "Biology",
    state: { ...initial, engine: 14, palette: 15, colors: palettes[15].colors, bioFeed: 44, bioKill: 57, bioSpeed: 82, bioAmount: 89, bioVeins: 72, dither: 28, riso: 22, quasiDensity: 69, scale: 24, motionMode: "Traveling waves", motionAmount: 61, lightMotion: 71, seed: 14886 },
  },
  {
    name: "Neon Media Rot",
    note: "Digital blocks consumed by an organism with a persistent chemical history",
    family: "Biology",
    state: { ...initial, engine: 4, palette: 8, colors: palettes[8].colors, bioFeed: 29, bioKill: 36, bioSpeed: 86, bioAmount: 95, bioVeins: 91, block: 44, datamosh: 32, afterimage: 29, scale: 27, motionMode: "Internal turbulence", motionAmount: 68, lightMotion: 74, seed: 22681 },
  },
  {
    name: "Gyroid Signal Cathedral",
    note: "3D periodic minimal surfaces with glowing depth and phosphor ghosts",
    family: "Spatial",
    state: { ...initial, engine: 16, palette: 11, colors: palettes[11].colors, stereoShape: "Gyroid Cathedral", stereoAmount: 96, stereoDepth: 68, stereoMorph: 47, stereoGlow: 89, stereoParallax: 72, stereoWiggle: 41, stereoQuality: 60, motionMode: "Orbital", motionAmount: 19, motionRate: 42, lightMotion: 71, phosphor: 25, seed: 59174 },
  },
  {
    name: "Metaball Ghost Choir",
    note: "Breathing holographic blobs that swell, collide and reflect rainbow light",
    family: "Spatial",
    state: { ...initial, engine: 16, palette: 6, colors: palettes[6].colors, stereoShape: "Metaball Choir", stereoAmount: 98, stereoDepth: 43, stereoMorph: 78, stereoGlow: 93, stereoParallax: 50, stereoWiggle: 37, stereoQuality: 62, motionMode: "Breathing", motionAmount: 24, motionRate: 53, lightMotion: 75, seed: 75092 },
  },
  {
    name: "Opal Knot Apparition",
    note: "Interlinked 3D opalescent rings with a wavering stereoscopic camera",
    family: "Spatial",
    state: { ...initial, engine: 16, palette: 8, colors: palettes[8].colors, stereoShape: "Opal Knot", stereoAmount: 98, stereoDepth: 55, stereoMorph: 72, stereoGlow: 98, stereoParallax: 79, stereoWiggle: 56, stereoQuality: 68, motionMode: "Internal turbulence", motionAmount: 14, motionRate: 41, lightMotion: 94, seed: 16872 },
  },
  {
    name: "Crystal Radio Crypt",
    note: "Refractive-looking crystalline 3D cells consumed by CRT signal artifacts",
    family: "Spatial",
    state: { ...initial, engine: 16, palette: 15, colors: palettes[15].colors, stereoShape: "Crystal Lattice", stereoAmount: 92, stereoDepth: 84, stereoMorph: 43, stereoGlow: 88, stereoParallax: 61, stereoWiggle: 47, stereoQuality: 57, phosphor: 41, datamosh: 18, motionMode: "Orbital", motionAmount: 12, motionRate: 44, lightMotion: 79, seed: 59186 },
  },
  {
    name: "Ribbon Wormhole Wake",
    note: "Spiraling 3D ribbons, trailing afterimages and screaming iridescence",
    family: "Spatial",
    state: { ...initial, engine: 16, palette: 1, colors: palettes[1].colors, stereoShape: "Ribbon Wormhole", stereoAmount: 100, stereoDepth: 81, stereoMorph: 71, stereoGlow: 91, stereoParallax: 78, stereoWiggle: 63, stereoQuality: 59, afterimage: 41, memoryDrift: 37, motionMode: "Traveling waves", motionAmount: 18, motionRate: 49, lightMotion: 83, seed: 32617 },
  },
  {
    name: "Opal Diffraction Parasite",
    note: "Fivefold 2D interference invaded by a parallax-shifting opal structure",
    family: "Spatial",
    state: { ...initial, engine: 14, palette: 10, colors: palettes[10].colors, stereoShape: "Opal Knot", stereoAmount: 73, stereoDepth: 71, stereoMorph: 58, stereoGlow: 96, stereoParallax: 67, stereoWiggle: 39, stereoQuality: 54, quasiDensity: 76, motionMode: "Liquid flow", motionAmount: 43, motionRate: 58, lightMotion: 89, seed: 81935 },
  },
  {
    name: "Prismatic Tape Oracle",
    note: "Living thin-film iridescence and deep holographic diffraction over crossed signals",
    family: "Materials",
    state: { ...initial, engine: 10, palette: 1, colors: palettes[1].colors, filmAmount: 96, filmThickness: 76, opalAmount: 63, prismAmount: 88, foilRelief: 53, foilMotion: 77, scale: 23, motionMode: "Traveling waves", motionAmount: 63, motionRate: 59, lightMotion: 84, seed: 71634 },
  },
  {
    name: "Beetle Chrome Communion",
    note: "Chitin-like spectral glints over soft mathematical membranes",
    family: "Materials",
    state: { ...initial, engine: 7, palette: 8, colors: palettes[8].colors, filmAmount: 85, filmThickness: 64, opalAmount: 77, prismAmount: 43, foilRelief: 89, foilMotion: 61, scale: 26, motionMode: "Breathing", motionAmount: 66, lightMotion: 91, seed: 25881 },
  },
  {
    name: "Oil Slick Underworld",
    note: "Oil-film colors sliding through amorphous liquid marble",
    family: "Materials",
    state: { ...initial, engine: 6, palette: 11, colors: palettes[11].colors, filmAmount: 100, filmThickness: 89, opalAmount: 54, prismAmount: 77, foilRelief: 50, foilMotion: 91, scale: 35, motionMode: "Liquid flow", motionAmount: 88, lightMotion: 82, seed: 19171 },
  },
  {
    name: "Dichroic Ghost Cathedral",
    note: "3D gyroid sculpture drenched in animated spectral foil",
    family: "Materials",
    state: { ...initial, engine: 16, palette: 10, colors: palettes[10].colors, stereoShape: "Gyroid Cathedral", stereoAmount: 92, filmAmount: 79, filmThickness: 78, opalAmount: 85, prismAmount: 74, foilRelief: 31, foilMotion: 55, lightMotion: 80, seed: 74117 },
  },
  {
    name: "Velvet Neon Circuit",
    note: "Glowing CRT ribbons and layered phosphor fibers, without typography",
    family: "Materials",
    state: { ...initial, engine: 3, palette: 1, colors: palettes[1].colors, windowCascade: 41, glitter: 75, filmAmount: 55, opalAmount: 53, motionAmount: 60, lightMotion: 75, seed: 33171 },
  },
  {
    name: "Dichroic Fractal Altar",
    note: "Liquid-metal color interference along fractal escape boundaries",
    family: "Materials",
    state: { ...initial, engine: 13, palette: 15, colors: palettes[15].colors, filmAmount: 81, opalAmount: 76, prismAmount: 67, fractalZoom: 48, motionAmount: 47, lightMotion: 87, seed: 51839 },
  },
  {
    name: "Cathode Bloom Cathedral",
    note: "Radioactive cathode glow and floating frequency structures",
    family: "Materials",
    state: { ...initial, engine: 4, palette: 7, colors: palettes[7].colors, phosphor: 75, broadcast: 34, afterimage: 29, filmAmount: 42, lightMotion: 81, seed: 67491 },
  },
  {
    name: "Chromatic Quasicrystal Static",
    note: "Interference lattice and prismatic caustics collide",
    family: "Materials",
    state: { ...initial, engine: 14, palette: 6, colors: palettes[6].colors, prismAmount: 92, opalAmount: 67, filmAmount: 84, quasiDensity: 57, motionAmount: 79, lightMotion: 84, seed: 71691 },
  },
  {
    name: "Iris Portal Surgery",
    note: "Four breathing iris worlds reveal a different mathematical cosmos",
    family: "Composition",
    state: { ...initial, engine: 12, secondaryEngine: 3,
      palette: 8, colors: palettes[8].colors,
      compositionMode: "Iris portals", compositionAmount: 97, compositionScale: 44, compositionFeather: 34, compositionMotion: 74, compositionColorShift: 68, blend: 88, blendMode: "Difference", filmAmount: 42, opalAmount: 25, motionAmount: 60, lightMotion: 75, seed: 287114 },
  },
  {
    name: "Braided Broadcast Coven",
    note: "Multiple undulating signal ribbons cross over living cellular boundaries",
    family: "Composition",
    state: { ...initial, engine: 3, secondaryEngine: 7,
      palette: 1, colors: palettes[1].colors,
      compositionMode: "Braided ribbons", compositionAmount: 100, compositionScale: 53, compositionFeather: 30, compositionMotion: 86, compositionColorShift: 77, blend: 92, blendMode: "Mix", phosphor: 37, scan: 18, motionAmount: 79, lightMotion: 72, seed: 675123 },
  },
  {
    name: "Petri Dish Cathedral",
    note: "Cell colonies sprout a second hyperbolic universe inside the first",
    family: "Composition",
    state: { ...initial, engine: 15, secondaryEngine: 12,
      palette: 11, colors: palettes[11].colors,
      compositionMode: "Cell colonies", compositionAmount: 96, compositionScale: 71, compositionFeather: 49, compositionMotion: 65, compositionColorShift: 66, blend: 93, bioAmount: 43, bioSpeed: 74, filmAmount: 67, motionAmount: 35, lightMotion: 73, seed: 817354 },
  },
  {
    name: "Patchwork Nervous Breakdown",
    note: "A deliberately ragged collage of quiltlike mathematical print territories",
    family: "Composition",
    state: { ...initial, engine: 10, secondaryEngine: 11,
      palette: 15, colors: palettes[15].colors,
      compositionMode: "Patchwork", compositionAmount: 100, compositionScale: 68, compositionFeather: 12, compositionMotion: 52, compositionColorShift: 84, blend: 91, riso: 74, misregister: 34, motionAmount: 63, lightMotion: 84, seed: 702511 },
  },
  {
    name: "Orbital Ghost Islands",
    note: "An opalescent 3D apparition rises from moving orbit-shaped portals",
    family: "Composition",
    state: { ...initial, engine: 16, secondaryEngine: 6,
      palette: 8, colors: palettes[8].colors,
      compositionMode: "Orbital archipelagos", compositionAmount: 88, compositionScale: 39, compositionFeather: 29, compositionMotion: 81, compositionColorShift: 62, blend: 75, stereoShape: "Metaball Choir", stereoAmount: 76, opalAmount: 74, filmAmount: 69, motionAmount: 45, lightMotion: 83, seed: 246718 },
  },
  {
    name: "Woven Window Malfunction",
    note: "Rounded browser-like windows exchange mathematical fields on the beat",
    family: "Composition",
    state: { ...initial, engine: 4, secondaryEngine: 14,
      palette: 1, colors: palettes[1].colors,
      compositionMode: "Woven windows", compositionAmount: 100, compositionScale: 76, compositionFeather: 16, compositionMotion: 66, compositionColorShift: 75, blend: 100, windowCascade: 42, glitter: 47, dither: 52, motionAmount: 57, lightMotion: 69, seed: 503947 },
  },
  {
    name: "Quasicrystal Retina Detachment",
    note: "Aperiodic interference rosettes embedded in migrating circular apertures",
    family: "Composition",
    state: { ...initial, engine: 14, secondaryEngine: 13,
      palette: 6, colors: palettes[6].colors,
      compositionMode: "Iris portals", compositionAmount: 98, compositionScale: 82, compositionFeather: 43, compositionMotion: 93, compositionColorShift: 91, blend: 91, prismAmount: 87, foilMotion: 76, motionAmount: 67, lightMotion: 91, seed: 618273 },
  },
  {
    name: "Candy Riot Channel Weave",
    note: "Acid fractals flow in and out of braided color channels",
    family: "Composition",
    state: { ...initial, engine: 13, secondaryEngine: 0,
      palette: 10, colors: palettes[10].colors,
      compositionMode: "Braided ribbons", compositionAmount: 96, compositionScale: 61, compositionFeather: 46, compositionMotion: 86, compositionColorShift: 89, blend: 81, filmAmount: 95, opalAmount: 68, prismAmount: 73, motionAmount: 86, lightMotion: 94, seed: 861420 },
  },
  {
    name: "Cellular Newsprint Petri",
    note: "A retro print experiment with drifting chemical territories",
    family: "Composition",
    state: { ...initial, engine: 9, secondaryEngine: 15,
      palette: 15, colors: palettes[15].colors,
      compositionMode: "Cell colonies", compositionAmount: 96, compositionScale: 86, compositionFeather: 24, compositionMotion: 73, compositionColorShift: 63, blend: 88, blendMode: "Multiply", riso: 90, dither: 53, bioAmount: 74, motionAmount: 59, lightMotion: 80, seed: 982245 },
  },
  {
    name: "Impossible Lace Quilt",
    note: "Orbit lace fragments and crystalline cutouts inside animated textile blocks",
    family: "Composition",
    state: { ...initial, engine: 8, secondaryEngine: 11,
      palette: 7, colors: palettes[7].colors,
      compositionMode: "Patchwork", compositionAmount: 99, compositionScale: 78, compositionFeather: 29, compositionMotion: 58, compositionColorShift: 79, blend: 91, foilRelief: 46, filmAmount: 44, motionAmount: 73, lightMotion: 78, seed: 120957 },
  },
  {
    name: "Nebula Underworld",
    note: "Distant luminous fog drifts through negative space while liquid math breathes",
    family: "Backdrop",
    state: { ...initial, engine: 6, palette: 8, colors: palettes[8].colors,
      backdropMode: "Nebula veils", backdropAmount: 93, backdropDepth: 83, backdropDensity: 39, backdropMotion: 75, backdropGlow: 93, backdropHue: 76, backdropVariation: 32, motionMode: "Liquid flow", motionAmount: 71, lightMotion: 86, scale: 27, warp: 77, seed: 315687 },
  },
  {
    name: "Cosmic Pollen Static",
    note: "A shallow CRT world suspended before drifting microscopic star swarms",
    family: "Backdrop",
    state: { ...initial, engine: 3, palette: 1, colors: palettes[1].colors,
      backdropMode: "Cosmic pollen", backdropAmount: 100, backdropDepth: 89, backdropDensity: 80, backdropMotion: 85, backdropGlow: 100, backdropHue: 68, backdropVariation: 73, phosphor: 61, glitter: 37, scale: 25, motionMode: "Orbital", motionAmount: 42, lightMotion: 80, seed: 552831 },
  },
  {
    name: "Caustic Drowned Palace",
    note: "Moving waves of refracted-looking light underneath crystalline architecture",
    family: "Backdrop",
    state: { ...initial, engine: 11, palette: 10, colors: palettes[10].colors,
      backdropMode: "Caustic undercurrent", backdropAmount: 97, backdropDepth: 77, backdropDensity: 73, backdropMotion: 82, backdropGlow: 95, backdropHue: 84, backdropVariation: 29, filmAmount: 66, prismAmount: 77, motionAmount: 65, lightMotion: 82, seed: 831952 },
  },
  {
    name: "Ghost Wallpaper Colony",
    note: "Soft translucent architectural shadows emerging behind living Voronoi membranes",
    family: "Backdrop",
    state: { ...initial, engine: 7, palette: 11, colors: palettes[11].colors,
      backdropMode: "Ghost architecture", backdropAmount: 94, backdropDepth: 80, backdropDensity: 47, backdropMotion: 79, backdropGlow: 87, backdropHue: 51, backdropVariation: 93, bioAmount: 32, motionMode: "Breathing", motionAmount: 74, lightMotion: 88, seed: 119375 },
  },
  {
    name: "Phosphor Velvet Brocade",
    note: "Woven luminous microthreads drift under a fivefold interference field",
    family: "Backdrop",
    state: { ...initial, engine: 14, palette: 15, colors: palettes[15].colors,
      backdropMode: "Phosphor jacquard", backdropAmount: 98, backdropDepth: 75, backdropDensity: 75, backdropMotion: 62, backdropGlow: 100, backdropHue: 53, backdropVariation: 14, phosphor: 35, foilRelief: 47, filmAmount: 32, motionAmount: 63, lightMotion: 93, seed: 240175 },
  },
  {
    name: "Opal Cell Cathedral",
    note: "Shimmering cellular membranes and moving fog under 3D opal torus rings",
    family: "Backdrop",
    state: { ...initial, engine: 16, palette: 6, colors: palettes[6].colors,
      backdropMode: "Opal cell fog", backdropAmount: 93, backdropDepth: 74, backdropDensity: 55, backdropMotion: 78, backdropGlow: 89, backdropHue: 90, backdropVariation: 41, stereoAmount: 92, stereoShape: "Opal Knot", opalAmount: 86, filmAmount: 58, motionAmount: 40, lightMotion: 92, seed: 706314 },
  },
  {
    name: "Petri Nebula Mutation",
    note: "A growing chemical organism against two drifting luminous gas layers",
    family: "Backdrop",
    state: { ...initial, engine: 15, palette: 9, colors: palettes[9].colors,
      backdropMode: "Nebula veils", backdropAmount: 99, backdropDepth: 91, backdropDensity: 59, backdropMotion: 67, backdropGlow: 100, backdropHue: 21, backdropVariation: 63, bioAmount: 71, bioSpeed: 76, afterimage: 22, motionAmount: 57, lightMotion: 78, seed: 913048 },
  },
  {
    name: "Radioactive Weaver's Dream",
    note: "Braided math territories on top of radioactive moving luminous textile",
    family: "Backdrop",
    state: { ...initial, engine: 10, palette: 1, colors: palettes[1].colors,
      secondaryEngine: 13, blend: 87, compositionMode: "Braided ribbons", compositionAmount: 96, compositionScale: 61, backdropMode: "Phosphor jacquard", backdropAmount: 95, backdropDepth: 64, backdropDensity: 79, backdropMotion: 88, backdropGlow: 92, backdropHue: 66, backdropVariation: 88, motionAmount: 84, lightMotion: 86, seed: 481296 },
  },
  {
    name: "Haunted Electroluminescence",
    note: "Old-web signal corruption floating over drifting luminous starlight",
    family: "Backdrop",
    state: { ...initial, engine: 4, palette: 8, colors: palettes[8].colors,
      windowCascade: 62, glitter: 43, opalAmount: 75, filmAmount: 55, backdropMode: "Cosmic pollen", backdropAmount: 100, backdropDepth: 95, backdropDensity: 77, backdropMotion: 82, backdropGlow: 100, backdropHue: 71, backdropVariation: 47, motionAmount: 63, lightMotion: 81, seed: 592702 },
  },
  {
    name: "Electrified Embroidery",
    note: "Sewn threads that rearrange themselves across moving chromatic circuitry",
    family: "Microtexture",
    state: {...initial,engine:10,palette:1,colors:palettes[1].colors,microMode:"Living embroidery",microAmount:87,microScale:60,microMotion:74,microRelief:82,microDensity:76,microHue:49,microVariation:31,backdropMode:"Phosphor jacquard",backdropAmount:64,motionAmount:74,lightMotion:79,seed:932174},
  },
  {
    name: "Pearl Granulation Organism",
    note: "Living glassy beads creep through fluid color fields",
    family: "Microtexture",
    state: {...initial,engine:6,palette:8,colors:palettes[8].colors,microMode:"Opal granulation",microAmount:94,microScale:51,microMotion:62,microRelief:95,microDensity:67,microHue:56,microVariation:70,opalAmount:81,filmAmount:55,motionAmount:71,lightMotion:81,seed:248173},
  },
  {
    name: "Gel Caustic Meltdown",
    note: "Moving gelatinous caustic lines on an animated cell membrane",
    family: "Microtexture",
    state: {...initial,engine:7,palette:10,colors:palettes[10].colors,microMode:"Gel caustics",microAmount:96,microScale:44,microMotion:90,microRelief:91,microDensity:86,microHue:64,microVariation:11,prismAmount:73,motionAmount:83,lightMotion:94,seed:361728},
  },
  {
    name: "Particle Lace Exorcism",
    note: "Fine living point lace interrupted by a fivefold crystalline lattice",
    family: "Microtexture",
    state: {...initial,engine:14,palette:15,colors:palettes[15].colors,microMode:"Point lace",microAmount:85,microScale:70,microMotion:65,microRelief:74,microDensity:87,microHue:32,microVariation:65,compositionAmount:49,blend:67,secondaryEngine:8,motionAmount:62,lightMotion:86,seed:462791},
  },
  {
    name: "Glass Filament Apparition",
    note: "Iridescent luminous hairline streams orbiting behind a translucent 3D sculpture",
    family: "Microtexture",
    state: {...initial,engine:16,palette:6,colors:palettes[6].colors,microMode:"Glass filaments",microAmount:92,microScale:57,microMotion:85,microRelief:96,microDensity:79,microHue:80,microVariation:43,stereoAmount:69,stereoShape:"Opal Knot",filmAmount:44,opalAmount:57,motionAmount:41,lightMotion:97,seed:713942},
  },
  {
    name: "Crystalline Cilia Reef",
    note: "Self-aligning fluorescent microscopic rods growing through a chemical reef",
    family: "Microtexture",
    state: {...initial,engine:15,palette:11,colors:palettes[11].colors,microMode:"Crystalline cilia",microAmount:95,microScale:63,microMotion:80,microRelief:87,microDensity:85,microHue:51,microVariation:89,bioAmount:77,bioSpeed:78,backdropAmount:54,motionAmount:68,lightMotion:73,seed:318642},
  },
  {
    name: "Moiré Tape Microscopy",
    note: "Signal interference viewed through moving fluorescent woven filaments",
    family: "Microtexture",
    state: {...initial,engine:3,palette:7,colors:palettes[7].colors,microMode:"Living embroidery",microAmount:91,microScale:79,microMotion:78,microRelief:79,microDensity:71,microHue:48,microVariation:82,glitch:38,phosphor:45,afterimage:25,motionAmount:74,lightMotion:85,seed:610293},
  },
  {
    name: "Opal Membrane Crawlers",
    note: "Fractal boundary lenses nested inside swimming pearlescent ringlets",
    family: "Microtexture",
    state: {...initial,engine:13,palette:9,colors:palettes[9].colors,microMode:"Opal granulation",microAmount:86,microScale:67,microMotion:64,microRelief:88,microDensity:82,microHue:74,microVariation:58,fractalZoom:55,opalAmount:84,filmAmount:93,backdropAmount:63,motionAmount:64,lightMotion:95,seed:527174},
  },
  {
    name: "Infinite Slinky Cathedral",
    note: "A seamless radio-color vortex of animated spiraling ridges",
    family: "Tunnel",
    state: {...initial,engine:5,palette:1,colors:palettes[1].colors,tunnelMode:"Infinite spiral",tunnelTwist:79,tunnelDepth:92,tunnelRidges:62,tunnelPulse:81,tunnelAperture:21,tunnelVariation:16,motionAmount:33,motionRate:76,lightMotion:94,seed:361745},
  },
  {
    name: "Conch Cathedral Signal",
    note: "Opalescent shell ribs spiraling inward without tearing",
    family: "Tunnel",
    state: {...initial,engine:5,palette:10,colors:palettes[10].colors,tunnelMode:"Conch cathedral",tunnelTwist:66,tunnelDepth:75,tunnelRidges:44,tunnelPulse:72,tunnelAperture:37,tunnelVariation:44,filmAmount:75,opalAmount:65,motionAmount:41,lightMotion:83,seed:741630},
  },
  {
    name: "Braided Wormhole Afterparty",
    note: "Countertwisting fluorescent helices with animated afterimages",
    family: "Tunnel",
    state: {...initial,engine:5,palette:15,colors:palettes[15].colors,tunnelMode:"Braided wormhole",tunnelTwist:92,tunnelDepth:82,tunnelRidges:73,tunnelPulse:91,tunnelAperture:31,tunnelVariation:64,afterimage:31,memoryDrift:35,motionAmount:25,lightMotion:78,seed:520843},
  },
  {
    name: "Moiré Throat Peacock",
    note: "Polar standing-wave interference with iridescent ridges",
    family: "Tunnel",
    state: {...initial,engine:5,palette:8,colors:palettes[8].colors,tunnelMode:"Moiré throat",tunnelTwist:86,tunnelDepth:71,tunnelRidges:80,tunnelPulse:61,tunnelAperture:41,tunnelVariation:79,prismAmount:56,phosphor:36,motionAmount:49,lightMotion:88,seed:940173},
  },
  {
    name: "Living Iris Reactor",
    note: "Organism-like aperture contracting inside rotating petals",
    family: "Tunnel",
    state: {...initial,engine:5,palette:6,colors:palettes[6].colors,tunnelMode:"Living iris",tunnelTwist:51,tunnelDepth:89,tunnelRidges:28,tunnelPulse:86,tunnelAperture:16,tunnelVariation:38,bioAmount:39,bioSpeed:54,opalAmount:47,motionAmount:54,lightMotion:83,seed:395162},
  },
  {
    name: "Liquid Vortex Witchery",
    note: "Swirling mathematical liquid carrying thin-film colors",
    family: "Tunnel",
    state: {...initial,engine:5,palette:11,colors:palettes[11].colors,tunnelMode:"Liquid vortex",tunnelTwist:68,tunnelDepth:81,tunnelRidges:56,tunnelPulse:76,tunnelAperture:45,tunnelVariation:71,filmAmount:69,opalAmount:77,backdropAmount:54,motionAmount:83,lightMotion:90,seed:836024},
  },
  {
    name: "Opal Tunnel Parasite",
    note: "Spiral material and chemical organisms trade inside moving portals",
    family: "Tunnel",
    state: {...initial,engine:5,palette:3,colors:palettes[3].colors,tunnelMode:"Braided wormhole",secondaryEngine:15,blend:71,compositionMode:"Iris portals",compositionAmount:82,tunnelTwist:75,tunnelDepth:79,tunnelRidges:58,tunnelPulse:73,tunnelAperture:24,tunnelVariation:55,bioAmount:43,opalAmount:78,motionAmount:56,lightMotion:91,seed:570326},
  },
  {
    name: "Chromatic Iris Feedback",
    note: "Animated iris with 360-degree color vortex and feedback",
    family: "Tunnel",
    state: {...initial,engine:5,palette:7,colors:palettes[7].colors,tunnelMode:"Living iris",secondaryEngine:14,blend:66,compositionMode:"Orbital archipelagos",compositionAmount:60,tunnelTwist:72,tunnelDepth:84,tunnelRidges:67,tunnelPulse:83,tunnelAperture:38,tunnelVariation:89,colorMode:"Phase vortex",colorAmount:75,afterimage:29,motionAmount:72,lightMotion:94,seed:648291},
  },
  {
    name: "CMY Mutation Chamber",
    note: "Morphing CMY Bragg-frequency cells illuminate a second mathematical membrane",
    family: "Substance",
    state: {...initial,engine:7,palette:1,colors:palettes[1].colors,substanceMode:"CMY lithogenesis",substanceAmount:96,substanceScale:72,substanceMotion:77,substanceRelief:77,substanceEdge:82,substanceHue:49,substanceVariation:19,motionAmount:56,lightMotion:88,seed:152978},
  },
  {
    name: "Opal Ink Lithogenesis",
    note: "Tectonic pigment separation and luminous interference along crystal boundaries",
    family: "Substance",
    state: {...initial,engine:11,palette:10,colors:palettes[10].colors,substanceMode:"CMY lithogenesis",substanceAmount:91,substanceScale:61,substanceMotion:55,substanceRelief:90,substanceEdge:95,substanceHue:78,substanceVariation:44,opalAmount:53,filmAmount:47,motionAmount:62,lightMotion:87,seed:744902},
  },
  {
    name: "Phosphor Chromatophore Reef",
    note: "Inflating color organelles breathe under neon electronic plant tissues",
    family: "Substance",
    state: {...initial,engine:15,palette:8,colors:palettes[8].colors,substanceMode:"Chromatophore reef",substanceAmount:93,substanceScale:80,substanceMotion:83,substanceRelief:64,substanceEdge:74,substanceHue:58,substanceVariation:81,bioAmount:53,bioSpeed:66,motionAmount:61,lightMotion:91,seed:473921},
  },
  {
    name: "Blooming Codec Organelles",
    note: "Hundreds of migratory pigment membranes drift across a synthetic analog ocean",
    family: "Substance",
    state: {...initial,engine:6,palette:6,colors:palettes[6].colors,substanceMode:"Chromatophore reef",substanceAmount:99,substanceScale:93,substanceMotion:88,substanceRelief:82,substanceEdge:96,substanceHue:63,substanceVariation:27,backdropMode:"Nebula veils",backdropAmount:58,motionAmount:74,lightMotion:91,seed:280413},
  },
  {
    name: "Void Chitin Broadcast",
    note: "Layered beetle-shell film phase shifts through a blacklight spectral landscape",
    family: "Substance",
    state: {...initial,engine:3,palette:15,colors:palettes[15].colors,substanceMode:"Chitin interference",substanceAmount:100,substanceScale:51,substanceMotion:79,substanceRelief:91,substanceEdge:83,substanceHue:73,substanceVariation:12,filmAmount:57,prismAmount:66,motionAmount:56,lightMotion:93,seed:710259},
  },
  {
    name: "Holographic Cuticle Cathedral",
    note: "Prismatic organic foil cascades over liquid marble with film-bright wrinkles",
    family: "Substance",
    state: {...initial,engine:6,palette:11,colors:palettes[11].colors,substanceMode:"Chitin interference",substanceAmount:94,substanceScale:72,substanceMotion:73,substanceRelief:87,substanceEdge:92,substanceHue:29,substanceVariation:58,opalAmount:71,motionAmount:85,lightMotion:89,seed:396205},
  },
  {
    name: "Chromasoup Worm Palace",
    note: "Log-warped cell mosaics and shimmering radial structures drift within living tape",
    family: "Substance",
    state: {...initial,engine:5,palette:7,colors:palettes[7].colors,substanceMode:"Conformal chromasoup",substanceAmount:95,substanceScale:65,substanceMotion:82,substanceRelief:75,substanceEdge:94,substanceHue:59,substanceVariation:92,tunnelMode:"Liquid vortex",tunnelPulse:64,motionAmount:77,lightMotion:95,seed:627019},
  },
  {
    name: "Mosaic Reality Failure",
    note: "Quasicrystal geometry and animated conformal stained-glass cells fight over the palette",
    family: "Substance",
    state: {...initial,engine:14,palette:1,colors:palettes[1].colors,substanceMode:"Conformal chromasoup",substanceAmount:97,substanceScale:85,substanceMotion:72,substanceRelief:80,substanceEdge:94,substanceHue:87,substanceVariation:45,microMode:"Glass filaments",microAmount:43,motionAmount:73,lightMotion:88,seed:803961},
  },
];
