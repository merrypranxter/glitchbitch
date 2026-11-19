// One map of every control group in the studio.
// - `title`: the short header shown in the inspector
// - `on`: keys that mean "this is currently changing the artwork" (lime dot)
// - `reset`: keys restored to their defaults by the section's Reset link
// - `keywords`: words people actually type into Find (labels, synonyms)
// - `pane`: for Text, which sub-tab holds it
// Pure data: no React, so tests and Find can read it without rendering.

export const effectGroups = ["Glitch", "Texture", "Light", "Depth", "Scene"];

export const sections = [
  // ---- Math ---------------------------------------------------------------
  { id: "engine", tab: "Math", title: "Engine",
    keywords: ["engine", "plasma flow", "acid bloom", "fractal melt", "moiré", "pixel rot",
      "tunnel vision", "liquid marble", "cellular dream", "orbit lace", "contour planet",
      "chroma weave", "crystal shards", "hyperbolic crt", "candy fractal portal",
      "fivefold diffraction", "chromatic infection", "stereo ghost machine",
      "schottky lace", "kleinian", "circle inversion", "sigil glass", "prismatic sigil",
      "moiré dna", "moire dna", "flower moire", "optical interference",
      "lock engine", "lookbook"] },
  { id: "shape", tab: "Math", title: "Shape",
    reset: ["complexity", "scale", "warp", "rotation", "symmetry", "mirror"],
    keywords: ["complexity", "scale", "zoom", "domain warp", "rotation", "kaleidoscope", "symmetry", "folds", "mirror"] },
  { id: "tunnel", tab: "Math", title: "Tunnel shape",
    reset: ["tunnelMode", "tunnelTwist", "tunnelDepth", "tunnelRidges", "tunnelPulse", "tunnelAperture", "tunnelVariation"],
    keywords: ["tunnel species", "spiral twist", "tunnel depth", "ridges", "spiral arms", "pulse", "aperture", "reshape tunnel"] },
  { id: "extras", tab: "Math", title: "Engine extras",
    reset: ["hyperbolicFold", "fractalZoom", "juliaMix", "quasiDensity"],
    keywords: ["hyperbolic fold", "fractal zoom", "deep zoom", "mandelbrot", "julia", "diffraction density"] },
  { id: "motion", tab: "Math", title: "Motion",
    on: ["motionAmount", "lightMotion"],
    reset: ["speed", "motionMode", "motionAmount", "motionRate", "lightMotion", "freezeGeometry"],
    keywords: ["animation speed", "ambient motion", "structure movement", "motion pace", "living light", "shimmer", "freeze geometry", "freeze shape"] },

  // ---- Color --------------------------------------------------------------
  { id: "palettes", tab: "Color", title: "Palettes",
    keywords: ["palette", "palette vault", "shuffle palette", "random palette", "find palette", "import palette", "export palette"] },
  { id: "stops", tab: "Color", title: "Edit colors",
    keywords: ["color stops", "add color", "remove color", "shuffle stops", "reverse stops", "rotate", "save palette", "paste hex", "coolors"] },
  { id: "rhythm", tab: "Color", title: "Color motion",
    on: ["colorAmount"],
    reset: ["colorMode", "colorAmount", "colorSpeed", "colorOffset", "colorRepeat", "freezeColor"],
    keywords: ["rhythm", "traveling wave", "color canon", "phase vortex", "rhythm amount", "color tempo", "color speed", "palette offset", "repetition", "freeze color"] },
  { id: "grade", tab: "Color", title: "Color grade",
    reset: ["saturation", "contrast", "brightness"],
    keywords: ["saturation", "contrast", "brightness", "grade"] },

  // ---- Effects ------------------------------------------------------------
  { id: "fx-toggles", tab: "Effects", group: "Glitch", title: "Bloom · Posterize · Invert",
    keywords: ["bloom", "phosphor bloom", "posterize", "invert", "negative"] },
  { id: "signal", tab: "Effects", group: "Glitch", title: "Signal break",
    on: ["split", "glitch", "block", "pixel"], reset: ["split", "glitch", "block", "pixel"],
    keywords: ["chromatic split", "rgb split", "chromatic aberration", "signal drift", "glitch", "block corruption", "pixelation", "pixelate"] },
  { id: "analog", tab: "Effects", group: "Glitch", title: "Analog",
    on: ["scan", "grain", "vignette"], reset: ["scan", "grain", "vignette"],
    keywords: ["scanlines", "film grain", "noise", "vignette", "vhs"] },
  { id: "screen", tab: "Effects", group: "Glitch", title: "CRT screen",
    on: ["phosphor", "broadcast"], reset: ["phosphor", "broadcast"],
    keywords: ["crt", "phosphor subpixels", "shadow mask", "broadcast bars", "color bars"] },
  { id: "print", tab: "Effects", group: "Glitch", title: "Print damage",
    on: ["dither", "riso", "misregister"], reset: ["dither", "riso", "misregister"],
    keywords: ["dither", "bayer", "risograph", "riso", "cmy", "misregistration", "ink"] },
  { id: "memory", tab: "Effects", group: "Glitch", title: "Frame memory",
    on: ["afterimage", "datamosh"], reset: ["afterimage", "datamosh", "memoryDrift", "memoryDecay"],
    hint: "Feedback from the previous frame. Watch it build while things move.",
    keywords: ["afterimage", "trails", "datamosh", "feedback", "memory drift", "memory decay"] },
  { id: "oldweb", tab: "Effects", group: "Glitch", title: "Old web",
    on: ["windowCascade", "glitter"], reset: ["windowCascade", "glitter"],
    keywords: ["error windows", "windows 95", "cascade", "glitter", "starburst"] },
  { id: "micro", tab: "Effects", group: "Texture", title: "Microtexture",
    on: ["microAmount"],
    reset: ["microMode", "microAmount", "microScale", "microMotion", "microRelief", "microDensity", "microHue", "microVariation"],
    hint: "Moving textures that ride your shapes. Presence 0 = off.",
    keywords: ["microstructure", "embroidery", "granules", "caustics", "lace", "glass hairlines", "cilia", "texture"] },
  { id: "substance", tab: "Effects", group: "Texture", title: "Substance",
    on: ["substanceAmount"],
    reset: ["substanceMode", "substanceAmount", "substanceScale", "substanceMotion", "substanceRelief", "substanceEdge", "substanceHue", "substanceVariation"],
    hint: "Living materials from the shader sample vault. Strength 0 = off.",
    keywords: ["substance", "bragg cells", "chromatophores", "chitin", "voronoi", "sample vault"] },
  { id: "foil", tab: "Effects", group: "Texture", title: "Prism foil",
    on: ["filmAmount", "opalAmount", "prismAmount", "foilRelief"],
    reset: ["filmAmount", "filmThickness", "opalAmount", "prismAmount", "foilRelief", "foilMotion"],
    keywords: ["thin film", "iridescent", "film thickness", "opal", "dichroic", "prism", "foil", "relief", "holographic"] },
  { id: "bio", tab: "Effects", group: "Texture", title: "Bio rot",
    on: ["bioAmount"], reset: ["bioAmount", "bioFeed", "bioKill", "bioSpeed", "bioVeins"],
    hint: "Real reaction-diffusion growing over any engine.",
    keywords: ["biological", "organism", "reaction diffusion", "feed", "kill", "growth", "veins", "membrane"] },
  { id: "underlay", tab: "Effects", group: "Texture", title: "Living underlay",
    on: ["underlayAmount"],
    reset: ["underlayMode","underlayAmount","underlayScale","underlayDensity",
      "underlayMotion","underlayRelief","underlayHue","underlayContrast",
      "underlayVariation"],
    hint: "Animated mathematical textile ground behind Filament Forge or on its own. Presence 0 = off.",
    keywords: ["underlay","fabric ground","fabric background","woven background",
      "jacquard","moire","moiré","organza","quasicrystal twill","velvet pile",
      "opal damask","cellular gauze","loom ground","cloth","weaving",
      "fabric motion","pile density","yarn contrast","reseed ground",
      "textile backdrop","ornamental fabric","iridescent fabric"] },
  { id: "filament", tab: "Effects", group: "Texture", title: "Filament forge",
    on: ["filamentAmount"],
    reset: ["filamentSpecies","filamentAmount","filamentScale","filamentDensity",
      "filamentMotion","filamentWidth","filamentRelief","filamentHue","filamentVariation",
      "filamentSecondSpecies","filamentCrossbreed","filamentInterlace","filamentTwist","filamentPhase",
      "filamentMaterial","filamentSecondMaterial","filamentNap","filamentLuster",
      "filamentBeads","filamentBeadSize","filamentSecondHue",
      "filamentStitchMode","filamentStitchAmount","filamentStitchSpeed",
      "filamentStitchLength","filamentStitchGlow",
      "filamentSculptMode","filamentSculptAmount","filamentSculptDepth",
      "filamentSculptLight","filamentSculptShadow","filamentSculptPuff"],
    hint: "Six moving lace and embroidery geometries. Presence 0 = off.",
    keywords: ["filament", "lace", "weaving", "embroidery", "thread", "brocade", "quasicrystal",
      "crochet", "poincare", "knotwork", "truchet", "cellular filigree", "voronoi", "applique",
      "fractal veins", "needlework", "thread width", "seam", "ornamental",
      "crossbreed", "hybrid", "dual weave", "two parents", "under over", "crossings",
      "interlace", "thread rotation", "phase lag", "breed wild", "swap parents",
      "thread alchemy", "fiber", "silk", "chrome thread", "opal glass",
      "velvet", "flock", "fuzz", "nap", "luster", "metallic",
      "glowing yarn", "seed beads", "pearls", "beadwork", "beads",
      "thread materials", "dress the threads",
      "self weaving", "stitch animation", "loom", "needle chase", "loom sweep",
      "purl breathing", "running stitch", "unfurl", "resew", "sew itself",
      "stitch travel", "stitch speed", "tail length", "needle glow",
      "sculpted threads", "embossed embroidery", "3d thread", "raised satin",
      "trapunto", "puffed quilting", "recessed engraving", "chased metal",
      "shadow cutwork", "thread shadows", "directional lighting", "tactile relief"] },
  { id: "photon", tab: "Effects", group: "Light", title: "Photon zoo",
    on: ["photonAmount"],
    reset: ["photonSpecies", "photonAmount", "photonScale", "photonDensity", "photonMotion", "photonRelief", "photonHue", "photonVariation"],
    hint: "Eight living optical creatures over your art. Presence 0 = off.",
    keywords: ["photon zoo", "optical", "prism flowers", "lens", "interference", "sculpture", "creature", "rosettes"] },
  { id: "wiggle", tab: "Effects", group: "Depth", title: "Wiggle 3D",
    on: ["wiggleAmount"], reset: ["wiggleMode", "wiggleAmount", "wiggleDepth", "wiggleSpeed", "wiggleLayers"],
    hint: "Two-view wiggle-gram depth illusion. Wiggle 0 = off.",
    keywords: ["wiggle", "stereoscopy", "flipbook", "wigglegram", "parallax", "view separation"] },
  { id: "stereo", tab: "Effects", group: "Depth", title: "Stereo 3D",
    on: ["stereoAmount"],
    reset: ["stereoShape", "stereoAmount", "stereoDepth", "stereoParallax", "stereoMorph", "stereoGlow", "stereoWiggle", "stereoQuality"],
    hint: "Raymarched 3D shapes. Higher detail costs more GPU.",
    keywords: ["3d", "raymarch", "gyroid", "metaball", "opal knot", "crystal lattice", "wormhole", "depth fog", "camera"] },
  { id: "backdrop", tab: "Effects", group: "Scene", title: "Backdrop",
    on: ["backdropAmount"],
    reset: ["backdropMode", "backdropAmount", "backdropDepth", "backdropDensity", "backdropMotion", "backdropGlow", "backdropHue", "backdropVariation"],
    hint: "Animated background behind the math. Presence 0 = off.",
    keywords: ["background", "backdrop", "nebula", "negative space", "parallax depth", "luminous"] },

  { id: "chaos-lab", tab: "Effects", group: "Scene", title: "Chaos Lab",
    hint: "Weighted remixing of old and new effects, with palette/text protection and mobile GPU limits.",
    keywords: ["chaos lab","full weird shuffle","freakshow","weird shuffle",
      "shuffle all","shuffle everything","smart randomizer","ecosystem randomizer",
      "weighted chaos","chaos intensity","preserve colors","preserve text",
      "shuffle ecosystem","allow two parents","heavyweight gpu","maximum freakshow"] },
  { id: "colony-anatomy", tab: "Effects", group: "Scene", title: "Mutant Anatomy",
    on: ["colonyAnatomyAmount","colonyAnatomyPores","colonyAnatomyRim"],
    reset: ["colonyShapeA","colonyShapeB","colonyAnatomyAmount",
      "colonyAnatomyDetail","colonyAnatomyMotion","colonyAnatomyPores",
      "colonyAnatomyRim"],
    hint: "Living plated lichen, coral, petal and hyphal silhouettes; default off for old artworks.",
    keywords: ["mutant anatomy","colony anatomy","colony shapes",
      "lichen lobes","foliose lichen","lichen plate","scalloped edges",
      "coral fringe","living coral","coral spikes","crystal petals",
      "fractal glass","petal edges","hyphal fans","fungal branching",
      "radial filaments","micropores","pores","perforation",
      "colony rim","luminous rim","shape mutations","mutant colony",
      "shuffle anatomy","spawn anatomy","anatomy pair","restore classic outlines",
      "anatomy specimen","fractal thallus cathedral","coral signal reef",
      "glass spore lace","mutant ribbon plague"] },
  { id: "colony-life", tab: "Effects", group: "Scene", title: "Colony Wars",
    on: ["colonyLifeAmount","colonyFrontGlow","colonyCompetition"],
    reset: ["colonyLifeMode","colonyLifeAmount","colonyLifeSpeed",
      "colonyFrontGlow","colonyCompetition"],
    hint: "Opt-in planted colony growth, decay and A/B border competition. Stops without erasing painted seeds.",
    keywords: ["colony wars","colony lifecycle","ecology","living colonies",
      "growth front","growth fronts","morphological growth",
      "germinate","bloom","spore germination","breathing colonies",
      "wither","retreat","decay","regrow","territorial war",
      "competition","battle","compete","glowing boundaries",
      "luminous edges","front glow","freeze growth","stop ecology",
      "petri conquest","biological animation","seamless colony pulse","shuffle colony wars","randomize life cycle",
      "randomize colony wars","random colony growth","mutant anatomy","shapeshifting colony"] },
  { id: "atmosphere", tab: "Effects", group: "Scene", title: "Mutant atmospheres",
    on: ["atmoAmount","atmoBAmount"],
    reset: ["atmoMode","atmoAmount","atmoScale","atmoDensity",
      "atmoMotion","atmoGlow","atmoHue","atmoVariation",
      "atmoBMode","atmoBAmount","atmoBScale","atmoBDensity",
      "atmoBMotion","atmoBGlow","atmoBHue","atmoBVariation",
      "atmoBBlendMode","atmoMaskMode","atmoBMaskMode","atmoMaskScale",
      "atmoMaskFeather","atmoMaskMotion","atmoMaskVariation"],
    hint: "Two palette-linked shader worlds with four blend modes and five animated territory masks. Both presences 0 = off.",
    keywords: ["mutant atmosphere","atmospheres","atmosphere","prismatic mycelium",
      "fungal stained glass","fungus","hyphae","stained glass",
      "mandala gas leak","nebula","gas leak","lotus",
      "heartbeat phosphor","led","heartbeat","double pulse","moire",
      "misprint rosette","cmy print","misregistration","ink rosette",
      "background overlay","living scene","shader vault","ambient world",
      "reseed atmosphere","spawn atmosphere","crossbreed","hybrid",
      "two-parent atmosphere","breed wild","swap parents","second parent",
      "fungal broadcast storm","printed cosmic rupture","riso fungal infestation",
      "living habitats","masks","territory","territories","bloom iris","cell colonies",
      "flowing ribbons","fractured mosaic","inverse first","spatial mask",
      "painted colonies","finger paint","habitat graffiti","plant a","plant b"] },

  // ---- Text (sub-tabs, not collapsible sections) --------------------------
  { id: "text-words", tab: "Text", pane: null, title: "Your words",
    keywords: ["text", "words", "quote", "message", "type", "bold", "italic", "underline", "strike", "caps",
      "word color", "rainbow", "size", "opacity", "text layer", "add layer", "hide text"] },
  { id: "text-font", tab: "Text", pane: "Font", title: "Font & material",
    keywords: ["font", "typeface", "retro font", "shuffle font", "material", "neon bling", "chrome", "holographic", "lettering style"] },
  { id: "text-color", tab: "Text", pane: "Color", title: "Text fill & outlines",
    keywords: ["text color", "fill", "gradient", "gradient stop", "outline", "stroke", "border"] },
  { id: "text-layout", tab: "Text", pane: "Layout", title: "Text layout",
    keywords: ["position", "move text", "rotate text", "stretch", "curve", "bend", "letter spacing", "tracking",
      "line spacing", "leading", "drag text", "center text", "readable"] },
  { id: "text-motion", tab: "Text", pane: "Motion", title: "Text motion",
    keywords: ["text motion", "movement path", "second path", "stagger", "liquid", "warp text", "direction", "loops", "speed"] },
  { id: "text-blend", tab: "Text", pane: "Blend", title: "Text blending",
    keywords: ["blend mode", "text blend", "difference", "screen", "overlay", "intensity"] },
  { id: "text-recipes", tab: "Text", pane: "Recipes", title: "Text recipes",
    keywords: ["choreography", "choreographer", "recipe", "preset", "surprise text", "remix", "mutate"] },

  // ---- Touch --------------------------------------------------------------
  { id: "habitat-paint", tab: "Touch", title: "Habitat Graffiti",
    reset: ["habitatBrushRadius","habitatStamps"],
    keywords: ["habitat graffiti","habitat painter","plant a","plant b",
      "plant colonies","finger paint","finger painting","plant fungal colonies",
      "painted colonies","planted colonies","colonize","colonization",
      "move colony","erase colony","colony size","colony radius",
      "habitat seeds","paint habitat","touch painting","stamp colony","shuffle colonies",
      "random colonies","random habitat map","composed colony layouts",
      "clear seeds","clear planted colonies","move planted habitat",
      "ring colonies","twin clusters","left right territory","diagonal invasion"] },
  { id: "brush", tab: "Touch", title: "Brush",
    keywords: ["brush", "paint", "move", "erase", "force", "warp", "vortex", "repel", "chroma", "strength", "radius", "handles", "add force"] },
  { id: "forces", tab: "Touch", title: "Placed forces",
    keywords: ["sources", "selected source", "source strength", "source radius", "source angle", "remove source", "clear touch"] },

  // ---- Layers -------------------------------------------------------------
  { id: "second", tab: "Layers", title: "Second engine",
    on: ["blend"], reset: ["blend", "blendMode"],
    keywords: ["second engine", "secondary field", "layer", "mix", "multiply", "difference", "field blend", "combine"] },
  { id: "territories", tab: "Layers", title: "Territories",
    on: ["compositionAmount"],
    reset: ["compositionMode", "compositionAmount", "compositionScale", "compositionFeather", "compositionMotion", "compositionColorShift", "compositionVariation"],
    hint: "Lets the second engine live inside moving shapes. Needs Second engine on.",
    keywords: ["composition", "territory", "portals", "ribbons", "cells", "quilt", "islands", "swap worlds"] },
];

// Things that aren't inspector sections but people still go looking for.
export const actions = [
  { id: "export", title: "Export PNG / MP4 / GIF", where: "Export", keywords: ["export", "download", "png", "mp4", "gif", "video", "recipe json"] },
  { id: "lookbook", title: "Lookbook presets", where: "Starting points", keywords: ["lookbook", "presets", "starting point", "recipes", "looks"] },
  { id: "save", title: "Save to vault", where: "Saved works", keywords: ["save", "bookmark", "vault", "keep"] },
  { id: "surprise", title: "Surprise me", where: "Randomize everything", keywords: ["surprise", "random", "randomize", "chaos", "mutate"] },
  { id: "help", title: "How to play", where: "Guide & shortcuts", keywords: ["help", "guide", "shortcuts", "keyboard"] },
];

const byId = Object.fromEntries(sections.map((s) => [s.id, s]));
export const sectionMeta = (id) => byId[id];
export const sectionActive = (meta, state) =>
  Boolean(meta?.on?.some((k) => Boolean(state?.[k])));

/** Rank sections + actions for a query. Returns up to `limit` hits. */
export function findControls(query, limit = 8) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const score = (entry) => {
    const title = entry.title.toLowerCase();
    if (title === q) return 100;
    if (title.startsWith(q)) return 80;
    const exact = entry.keywords.find((k) => k === q);
    if (exact) return 70;
    const prefix = entry.keywords.find((k) => k.startsWith(q) || k.split(" ").some((w) => w.startsWith(q)));
    if (prefix) return 50;
    if (title.includes(q)) return 40;
    if (entry.keywords.some((k) => k.includes(q))) return 25;
    if ((entry.tab || "").toLowerCase() === q) return 10;
    return 0;
  };
  const match = (entry) =>
    entry.keywords.find((k) => k.includes(q) || k.split(" ").some((w) => w.startsWith(q)));
  return [
    ...sections.map((s) => ({ kind: "section", ...s })),
    ...actions.map((a) => ({ kind: "action", ...a })),
  ]
    .map((entry) => ({ entry, s: score(entry) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map(({ entry }) => ({ ...entry, matched: match(entry) }));
}
