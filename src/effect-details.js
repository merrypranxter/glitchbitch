import { hasSemanticLettering } from "./semantic-gravity.js";

// Navigation metadata for laboratories nested inside an Effects section.
// These predicates follow renderer activation gates; stored settings alone do
// not mean a dependent system is currently contributing to the artwork.
const filament = (s) => s.filamentAmount > 0;
const hybrid = (s) => filament(s) && s.filamentCrossbreed > 0;
const mode = (s, stem) => s[`${stem}Amount`] > 0 && s[`${stem}Mode`] !== "Off";
const neural = (s) => filament(s) && mode(s, "filamentNeural");
const scars = (s) => neural(s) && mode(s, "filamentScar");
const morph = (s) => filament(s) && mode(s, "filamentMorph") && (
  s.filamentMorphTarget !== s.filamentMaterial ||
  hybrid(s) && s.filamentSecondMorphTarget !== s.filamentSecondMaterial
);
const species = (s, name) => filament(s) && (
  s.filamentSpecies === name || hybrid(s) && s.filamentSecondSpecies === name
);
const opticsA = (s) => filament(s) && mode(s, "filamentOptics");
const opticsB = (s) => hybrid(s) && mode(s, "filamentSecondOptics");
const stitch = (s) => filament(s) && s.filamentStitchAmount > 0;
const lab = (id, title, keywords, active, on = []) => ({
  id, sectionId: "filament", title, keywords, active, on,
});

export const effectDetails = [
  lab("filament-semantic", "Semantic gravity",
    ["semantic gravity", "words bend weave", "letter attraction", "typographic vortex", "word gravitational strength", "text influence radius", "letter-shaped void"],
    (s) => filament(s) && hasSemanticLettering(s), ["semanticGravityAmount"]),
  lab("filament-quasi", "Quasicrystal brocade",
    ["quasicrystal brocade", "pentagrid", "phason", "embroidery", "thread elevation", "star-point collar ornaments"],
    (s) => species(s, "Quasicrystal Brocade")),
  lab("filament-feral", "Feral jacquard",
    ["feral jacquard", "controlled corruption", "warp weft migration", "knot collars", "structural corruption"],
    (s) => species(s, "Feral Jacquard")),
  lab("filament-sculpt", "Sculpted threads",
    ["sculpted threads", "tactile relief", "thread height depth", "light direction", "soft border shadows", "pillowy crown"],
    (s) => filament(s) && s.filamentSculptAmount > 0, ["filamentSculptAmount"]),
  lab("filament-stitch", "Self-weaving loom",
    ["self-weaving loom", "stitch motion", "stitch travel speed", "stitch tail length", "traveling needle glow", "sewing"],
    stitch, ["filamentStitchAmount"]),
  lab("filament-chladni", "Chladni needle orchestra",
    ["chladni needle orchestra", "cymatic stitches", "eigenmode", "overtone order", "resonance", "nodal needle density", "detune"],
    (s) => stitch(s) && s.filamentStitchMode === "Chladni Needle Orchestra"),
  lab("filament-retrocausal", "Retrocausal embroidery",
    ["retrocausal embroidery", "future seams", "needle future lookahead", "pre-echo ghost stitches", "paradox seam crossings", "reverse-time stitch wave"],
    (s) => stitch(s) && s.filamentStitchMode === "Retrocausal Embroidery"),
  lab("filament-meta", "Optical metamaterials",
    ["diffraction grating","photonic crystal","dichroic membrane","thin film","prismatic chambers","birefringence","bragg domains","impossible materials","aerogel","ferrofluid","liquid crystal","dichroic glass","gelatin","cellular foam","crystalline velvet","liquid metal"],
    s=>filament(s)&&s.filamentArchitecture!=="Bare architecture"&&s.filamentArchitectureAmount>0&&s.filamentMeta!=="Natural scaffold"&&s.filamentMetaAmount>0,["filamentMetaAmount"]),
  lab("filament-dimension", "Dimensional metamorphosis",
    ["topology morph","dimensional collapse","fold and unfold","traveling topology","architecture transition"],
    s=>filament(s)&&s.filamentArchitecture!=="Bare architecture"&&s.filamentArchitectureAmount>0&&s.filamentDimMode!=="Static architecture"&&s.filamentDimAmount>0&&s.filamentDimTarget!==s.filamentArchitecture,["filamentDimAmount"]),
  lab("filament-architecture", "Parasitic architecture",
    ["silica tunnels","microbial lace","crystal scaffolds","hyperbolic membranes","cellular bridges","radiolarian vaults","impossible topology","möbius membrane","klein bottle","gyroid","riemann","hopf","tesseract","torus knot"],
    s=>filament(s)&&s.filamentArchitecture!=="Bare architecture"&&s.filamentArchitectureAmount>0,["filamentArchitectureAmount"]),
  lab("filament-ecology", "Textile surface ecology",
    ["fiber microbiome","diatoms","lichen crust","yeast","mycelium","mineral deposits","surface ecology"],
    s=>filament(s)&&s.filamentEcology!=="Clean fibers"&&s.filamentEcologyAmount>0,["filamentEcologyAmount"]),
  lab("filament-chroma", "Chromatic weaving",
    ["pigment","spectral braid","color exchange","traveling dye","chromosomal bands","chromatic weaving"],
    s=>filament(s)&&s.filamentChroma!=="Original pigment"&&s.filamentChromaAmount>0&&(s.filamentChroma!=="Crossing pigment exchange"||hybrid(s)),["filamentChromaAmount"]),
  lab("filament-physics", "Impossible textile physics",
    ["unzip","split","fray","rejoin","rupture","graft","textile physics"],
    s=>filament(s)&&s.filamentPhysics!=="Stable threads"&&s.filamentPhysicsAmount>0&&(s.filamentPhysics!=="Crossbreed grafts"||hybrid(s)),["filamentPhysicsAmount"]),
  lab("filament-microloom", "Recursive microloom",
    ["fabric inside fabric","nested weaving","microloom","recursive lace","micro-openwork"],
    s=>filament(s)&&s.filamentMicroloom!=="Plain strand interior"&&s.filamentMicroloomAmount>0,["filamentMicroloomAmount"]),
  lab("filament-construction", "Fiber construction",
    ["braid","cable","hollow yarn","microfilament","wire wrapping","fiber construction"],
    s=>filament(s)&&s.filamentConstruction!=="Original strand"&&s.filamentConstructionAmount>0,["filamentConstructionAmount"]),
  lab("filament-materials", "Thread alchemy",
    ["thread alchemy", "fiber material", "materials beads", "fuzzy fiber nap", "specular luster", "seed bead presence", "second parent color offset", "cotton", "chenille"],
    (s) => filament(s) && (morph(s) || s.filamentMaterial !== "Original thread" ||
      hybrid(s) && s.filamentSecondMaterial !== "Original thread" ||
      s.filamentNap > 0 || s.filamentBeads > 0)),
  lab("filament-optics", "Structural-color optics",
    ["structural-color optics", "structural color", "optical coats", "twin fiber", "spectral wardrobe", "thread interference"],
    (s) => opticsA(s) || opticsB(s)),
  lab("filament-optics-a", "First fiber optics",
    ["first fiber optics", "parent a optics", "first parent optical law", "first fiber structural-color strength", "first fiber film thickness", "first fiber dispersion", "first fiber optical anisotropy", "first fiber curvature response", "first fiber pearlescent layer", "first fiber spectral phase"],
    opticsA, ["filamentOpticsAmount"]),
  lab("filament-optics-b", "Second fiber optics",
    ["second fiber optics", "parent b optics", "second parent optical law", "second fiber structural-color strength", "second fiber film thickness", "second fiber dispersion", "second fiber optical anisotropy", "second fiber curvature response", "second fiber pearlescent layer", "second fiber spectral phase"],
    opticsB, ["filamentSecondOpticsAmount"]),
  lab("filament-morph", "Thread metamorphosis",
    ["thread metamorphosis", "morph law", "material transformation", "morph intensity", "seam sweep", "crystal contagion", "molten migration"],
    morph, ["filamentMorphAmount"]),
  lab("filament-contagion", "Contagion loom",
    ["contagion loom", "thread infection", "transmission law", "infection reach", "crossing fever", "mycelial bridge", "spark jump"],
    (s) => morph(s) && mode(s, "filamentContagion"), ["filamentContagionAmount"]),
  lab("filament-neural", "Neural loom",
    ["neural loom", "nervous system", "neural pulse", "axon train", "synaptic handshake", "nerve", "neural signaling"],
    neural, ["filamentNeuralAmount"]),
  lab("filament-plasticity", "Synaptic plasticity",
    ["synaptic plasticity", "synaptic behavior", "adaptation rhythm", "inhibition damping", "echo persistence", "synapse glow"],
    (s) => neural(s) && mode(s, "filamentPlastic"), ["filamentPlasticAmount"]),
  lab("filament-scars", "Ghost scars",
    ["ghost scars", "scar morphology", "scar intensity", "scar spacing", "aftertrace lifetime", "fracture roughness", "scar phosphor glow"],
    scars, ["filamentScarAmount"]),
  lab("filament-regeneration", "Regeneration loom",
    ["regeneration loom", "regrowth anatomy", "daughter-thread presence", "branching frequency", "growth repair cycle", "fresh fiber glow"],
    (s) => scars(s) && mode(s, "filamentRegen"), ["filamentRegenAmount"]),
  lab("filament-jewelry", "Thread jewelry",
    ["thread jewelry", "charms fringe weird shit", "first parent jewelry", "second parent jewelry", "ornament spacing", "jewelry size", "living ornaments", "jewel shine"],
    (s) => filament(s) && s.filamentAdornmentAmount > 0 && (
      s.filamentAdornmentMode !== "Bare threads" ||
      hybrid(s) && s.filamentSecondAdornmentMode !== "Bare threads"
    ), ["filamentAdornmentAmount"]),
  lab("filament-crossbreed", "Thread crossbreeder",
    ["thread crossbreeder", "crossbreed two thread species", "second thread parent", "second parent presence", "under over crossing depth", "secondary thread rotation", "secondary motion phase"],
    hybrid, ["filamentCrossbreed"]),
  { id: "atmosphere-breeder", sectionId: "atmosphere", title: "Atmosphere breeder",
    keywords: ["two-parent atmosphere breeder", "second atmosphere parent", "second parent pattern size", "second parent density", "second parent motion", "second parent glow", "parents mix", "atmosphere hybrid"],
    on: ["atmoBAmount"], active: (s) => s.atmoBAmount > 0 },
  { id: "atmosphere-habitats", sectionId: "atmosphere", title: "Living habitats",
    keywords: ["living habitats", "masks territories", "first parent habitat", "second parent habitat", "habitat coverage", "soft edges", "habitat drift", "habitat mutations", "inverse first"],
    active: (s) => (s.atmoAmount > 0 && s.atmoMaskMode !== "Everywhere") ||
      (s.atmoBAmount > 0 && s.atmoBMaskMode !== "Everywhere") },
  { id: "fossil-resurrection", sectionId: "fossil-record", title: "Resurrection chamber",
    keywords: ["resurrection chamber", "raise ancient bloodlines", "revival method", "revive oldest ancestor", "raise whole graveyard", "faithful echo", "ancestral crossover", "adaptive comeback", "kingdom inversion"],
    active: () => false },
  { id: "fossil-echoes", sectionId: "fossil-record", title: "Ancestral echoes",
    keywords: ["ancestral echoes", "evolve civilizations", "evolutionary pressure", "ancestral influence", "atavism", "adaptive memory", "rebel descendants", "evolve ancestral generation"],
    active: () => false },
];
