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
    "A polar spiral falls through an infinite color tunnel.",
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
].map(([name, description, family], id) => ({ id, name, description, family }));
export const engines = engineInfo.map((e) => e.name);
export const palettes = [
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
export const ratios = [
  { id: "1:1", value: 1 },
  { id: "9:16", value: 9 / 16 },
  { id: "16:9", value: 16 / 9 },
  { id: "3:4", value: 3 / 4 },
  { id: "4:3", value: 4 / 3 },
];
export const touchModes = ["Warp", "Vortex", "Repel", "Chroma"];
export const motionModes = ["Liquid flow", "Breathing", "Orbital", "Traveling waves", "Internal turbulence"];
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
  motionAmount: [0, 100],
  motionRate: [0, 100],
  lightMotion: [0, 100],
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
  motionAmount: 0,
  motionRate: 50,
  lightMotion: 0,
  motionMode: "Liquid flow",
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
    x.colors.length > 8 ||
    !x.colors.every((c) => typeof c === "string" && colorRE.test(c))
  )
    throw Error("A palette needs 2–8 valid hex colors.");
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
  })) {
    if (x[key] !== undefined) {
      if (!choices.includes(x[key])) throw Error(`Unknown ${key}.`);
      s[key] = x[key];
    }
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
    colors.length > 8 ||
    !colors.every((c) => colorRE.test(c))
  )
    throw Error(
      "Paste 2–8 six-digit hex colors, separated by spaces or commas.",
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
export function randomize(
  state,
  locks = {},
  mutate = false,
  random = Math.random,
) {
  const next = { ...state };
  if (!mutate && !locks.engine)
    next.engine = Math.floor(random() * engines.length);
  if (!mutate && !locks.color) {
    next.palette = Math.floor(random() * palettes.length);
    next.colors = palettes[next.palette].colors;
  }
  if (!mutate) next.seed = Math.floor(random() * 999999999);
  for (const key of [
    "complexity",
    "scale",
    "warp",
    "split",
    "scan",
    "grain",
    "glitch",
    "rotation",
    "blend",
    "block",
  ]) {
    const [min, max] = numericRanges[key];
    if (mutate)
      next[key] = clamp(
        state[key] + (random() - 0.5) * (max - min) * 0.22,
        min,
        max,
      );
    else
      next[key] =
        key === "rotation"
          ? random() * 360
          : ({ complexity: 35, scale: 15, warp: 25 }[key] || 0) +
            random() *
              ({
                complexity: 55,
                scale: 60,
                warp: 70,
                scan: 30,
                grain: 25,
                glitch: 38,
                split: 45,
                blend: 50,
                block: 35,
              }[key] || 50);
  }
  // Choose a few compatible appearances rather than maxing out every overlay.
  const appearances = ["phosphor", "dither", "riso", "windowCascade", "glitter", "broadcast", "misregister"];
  if (mutate) {
    for (const key of [...appearances, "afterimage", "datamosh", "memoryDrift", "memoryDecay"])
      next[key] = clamp(state[key] + (random() - .5) * 24);
  } else {
    for (const key of appearances) next[key] = 0;
    const count = 1 + Math.floor(random() * 3);
    for (let i = 0; i < count; i++) {
      const key = appearances[Math.floor(random() * (appearances.length - 1))];
      next[key] = 35 + random() * 60;
    }
    if (next.riso > 0) next.misregister = random() * 70;
    next.afterimage = random() < .38 ? 28 + random() * 56 : 0;
    next.datamosh = random() < .32 ? 25 + random() * 60 : 0;
    next.memoryDrift = 8 + random() * 70;
    next.memoryDecay = 12 + random() * 48;
    next.afterimage = random() < .38 ? 28 + random() * 56 : 0;
    next.datamosh = random() < .32 ? 25 + random() * 60 : 0;
    next.memoryDrift = 8 + random() * 70;
    next.memoryDecay = 12 + random() * 48;
  }
  for (const key of ["hyperbolicFold","fractalZoom","juliaMix","quasiDensity"])
    next[key] = mutate ? clamp(state[key]+(random()-.5)*22) : 10+random()*85;
  if(mutate){
    for(const key of ["motionAmount","motionRate","lightMotion"])
      next[key]=clamp(state[key]+(random()-.5)*20);
  }else{
    next.motionMode=motionModes[Math.floor(random()*motionModes.length)];
    next.motionAmount=35+random()*57;
    next.motionRate=32+random()*53;
    next.lightMotion=30+random()*67;
  }
  if (!mutate) {
    next.secondaryEngine = Math.floor(random() * engines.length);
    next.symmetry = [1, 1, 1, 3, 5, 6][Math.floor(random() * 6)];
  }
  return next;
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
];
