import {protectCategorySettings} from "./category-locks.js";
import { PALETTE_VAULT } from "./palette-vault.js";
import { generateRandomPalette, shuffleColorStops } from "./palette-actions.js";
import { retroFontIds } from "./retro-fonts.js";
import { letteringBlendModes } from "./lettering-blends.js";
import { letteringMotionPaths } from "./lettering-motion.js";
import { microModes } from "./microstructure.js";
import { substanceModes } from "./substance.js";
export { microModes, substanceModes };
import { photonSpecies } from "./photon-zoo.js";
import { alchemyModes } from "./chromatic-alchemy.js";
import { injuryModes } from "./print-spectrum-injury.js";
export { injuryModes };
export { alchemyModes };
import { backdropModes } from "./backdrops.js";
export { backdropModes };
import { filamentSpecies, filamentMaterials, fiberConstructionModes, fiberConstructionControls, remixFiberConstruction, microloomModes, microloomControls, remixMicroloom, textilePhysicsModes, textilePhysicsControls, remixTextilePhysics, textileChromaModes, textileChromaControls, remixTextileChroma, textileEcologyModes, textileEcologyControls, remixTextileEcology, textileArchitectureModes, textileArchitectureControls, remixTextileArchitecture, textileDimensionModes, textileDimensionTargets, textileDimensionControls, remixTextileDimension, textileMetaModes, textileMetaControls, remixTextileMeta, textileEngravingModes, textileEngravingControls, remixTextileEngraving, textileAlchemyModes, textileAlchemyTargets, textileAlchemyControls, remixTextileAlchemy, filamentStitchModes, filamentSculptModes, filamentAdornmentModes, jewelryPlacementModes, jewelryKineticModes, remixJewelryChoreography, jewelryFinishModes, jewelryFinishControls, remixJewelryFinish, jewelryInteriorModes, jewelryInteriorControls, remixJewelryInterior, jewelryColonyModes, jewelryColonyControls, remixJewelryColony, filamentMorphModes, filamentContagionModes, filamentNeuralModes, filamentPlasticModes, filamentScarModes, filamentRegenModes } from "./filament-forge.js";
import { underlayModes } from "./living-underlay.js";
import {semanticGravityModes,hasSemanticLettering} from "./semantic-gravity.js";
import {structuralOpticsModes} from "./structural-thread-optics.js";
import {schlierenModes,mathematicalGlassModes,glassEtchingModes,glassMotionModes,glassCouplingModes,glassCouplingRules,randomGlassCoupling,glassMaterialModes,randomGlassMaterial,glassTransportModes,randomGlassTransport} from "./schlieren-glass.js";
import {polesModes} from "./complex-poles.js";
import {qdModes,qdOrders,qdControls} from "./quasicrystal-dissolution.js";
import {velvetModes,crochetModes,velvetControls,crochetControls} from "./living-textiles-wave5.js";
import {breedModes,breedControls,breedRequiredParents} from "./crossbreed-lab.js";
import {g2Modes,g2Controls} from "./g2-torsion-membranes.js";
import {spxModes,spxControls} from "./subpixel-moire-wave11.js";
import {psModes,psControls} from "./prismatic-scale-matrix-wave12.js";
import {kdModes,kdControls} from "./kleinian-dither-wave13.js";
import {vcModes,vcControls} from "./curlwave-witchcraft-wave14.js";
import { atmosphereModes, hybridAtmospherePresets } from "./mutant-atmospheres.js";
import { colonyLifeModes, colonyLifePresets } from "./colony-lifecycle.js";
import { colonyAnatomyModes, colonyAnatomyPresets, colonyPoreModes } from "./colony-anatomy.js";
import { colonyCortexModes, colonyCortexPresets } from "./colony-cortex.js";
import { sporeModes, sporePresets } from "./spore-dynasties.js";
import { substrateModes, substratePresets } from "./substrate-alchemy.js";
import { symbiosisModes, symbiosisPresets, ensureSymbioticContact } from "./symbiosis-lab.js";
import { genePresets } from "./colony-genetics.js";
import {selectionModes,selectionPresets} from "./selection-chamber.js";
import {successionModes,successionControls,MAX_SUCCESSION} from "./ecological-succession.js";
import {foodWebModes,foodWebControls} from "./living-food-web.js";
import {apocalypseModes,apocalypsePresets} from "./apocalypse-clock.js";
import {fossilModes,fossilPresets,MAX_FOSSILS} from "./fossil-record.js";
import { mixEcosystemIntoSurprise, generateHabitatStamps } from "./ecosystem-randomizer.js";
import { atmosphereHabitats, atmosphereSecondHabitats, atmosphereBlendModes } from "./atmosphere-habitats.js";
import { normalizeTextFormats } from "./text-formatting.js";
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
  ["Schottky Lace", "Breathing Kleinian circle inversions produce neon fractal filigree and clustered boundaries.", "Non-Euclidean"],
  ["Sigil Glass", "Animated triangle, hexagon and orbital SDFs etch refractive-looking prismatic geometry.", "Optical"],
  ["Moiré DNA", "Three detuned petal gratings generate flowing chromatic rosettes and optical interference.", "Interference"],
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
// Backdrop names and numeric shader IDs live beside the GLSL implementation.
// Keep mode IDs alongside their actual Microtexture shader implementations.
// Keep mode IDs alongside their actual Substance shader implementations.
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
  topperIsland: [0, 100],
  topperIslandDensity: [0, 100],
  topperIslandScale: [0, 100],
  topperIslandMotion: [0, 100],
  topperIslandForm: [0, 100],
  topperIslandMapping: [0, 100],
  topperIslandHue: [0, 100],
  topperIslandFeather: [0, 100],
  topperVoronoi: [0, 100],
  topperVoronoiDensity: [0, 100],
  topperVoronoiScale: [0, 100],
  topperVoronoiMotion: [0, 100],
  topperVoronoiGap: [0, 100],
  topperVoronoiTexture: [0, 100],
  topperVoronoiHue: [0, 100],
  topperVoronoiBlend: [0, 100],
  topperTape: [0, 100],
  topperTapeDensity: [0, 100],
  topperTapeScale: [0, 100],
  topperTapeMotion: [0, 100],
  topperTapeWidth: [0, 100],
  topperTapeDispersion: [0, 100],
  topperTapeHue: [0, 100],
  topperTapePalette: [0, 100],
  topperPortal: [0, 100],
  topperPortalDensity: [0, 100],
  topperPortalScale: [0, 100],
  topperPortalMotion: [0, 100],
  topperPortalZoom: [0, 100],
  topperPortalForm: [0, 100],
  topperPortalWarp: [0, 100],
  topperPortalHue: [0, 100],
  topperTime: [0, 100],
  topperTimeDensity: [0, 100],
  topperTimeScale: [0, 100],
  topperTimeMotion: [0, 100],
  topperTimeHold: [0, 100],
  topperTimeSlip: [0, 100],
  topperTimeForm: [0, 100],
  topperTimeChroma: [0, 100],
  topperIslandPulse: [0, 100],
  topperIslandPulseRate: [0, 100],
  topperIslandTwinkle: [0, 100],
  topperIslandTwinkleRate: [0, 100],
  topperIslandSpin: [0, 100],
  topperIslandSpinRate: [0, 100],
  topperIslandSpinDirection: [0, 100],
  topperIslandIndependence: [0, 100],
  topperJewelPulse: [0, 100],
  topperJewelPulseRate: [0, 100],
  topperJewelTwinkle: [0, 100],
  topperJewelTwinkleRate: [0, 100],
  topperJewelSpin: [0, 100],
  topperJewelSpinRate: [0, 100],
  topperJewelDirection: [0, 100],
  topperJewelIndependence: [0, 100],
  topperJewelOutline: [0, 100],
  topperHex: [0, 100],
  topperHexDensity: [0, 100],
  topperHexScale: [0, 100],
  topperHexMotion: [0, 100],
  topperHexGap: [0, 100],
  topperHexTexture: [0, 100],
  topperHexHue: [0, 100],
  topperHexBlend: [0, 100],
  topperTri: [0, 100],
  topperTriDensity: [0, 100],
  topperTriScale: [0, 100],
  topperTriMotion: [0, 100],
  topperTriGap: [0, 100],
  topperTriTexture: [0, 100],
  topperTriHue: [0, 100],
  topperTriBlend: [0, 100],
  topperTriPulse: [0, 100],
  topperTriTwinkle: [0, 100],
  topperKagome: [0, 100],
  topperKagomeDensity: [0, 100],
  topperKagomeScale: [0, 100],
  topperKagomeMotion: [0, 100],
  topperKagomeGap: [0, 100],
  topperKagomeTexture: [0, 100],
  topperKagomeHue: [0, 100],
  topperKagomeBlend: [0, 100],
  topperKagomePulse: [0, 100],
  topperKagomeTwinkle: [0, 100],
  topperKagomeBalance: [0, 100],
  topperJewel: [0, 100],
  topperJewelDensity: [0, 100],
  topperJewelScale: [0, 100],
  topperJewelMotion: [0, 100],
  topperJewelDetail: [0, 100],
  topperJewelHue: [0, 100],
  topperJewelForm: [0, 100],
  topperJewelBlend: [0, 100],
  topperShrapnel: [0, 100],
  topperDensity: [0, 100],
  topperScale: [0, 100],
  topperMotion: [0, 100],
  topperHue: [0, 100],
  topperShape: [0, 100],
  topperBlend: [0, 100],
  misregister: [0, 100],
  afterimage: [0, 100],
  datamosh: [0, 100],
  memoryDrift: [0, 100],
  memoryDecay: [0, 100],
  hyperbolicFold: [0, 100],
  fractalZoom: [0, 100],
  juliaMix: [0, 100],
  quasiDensity: [0, 100],
  hexagramAmount: [0, 100],
  hexagramScale: [0, 100],
  hexagramWarp: [0, 100],
  hexagramMotion: [0, 100],
  hexagramRelief: [0, 100],
  hexagramBorder: [0, 100],
  hexagramHue: [0, 100],
  hexagramCoupling: [0, 100],
  hexagramVariation: [0, 100],
  hexagramThreshold: [0, 100],
  schlierenAmount: [0, 100],
  schlierenScale: [0, 100],
  schlierenBend: [0, 100],
  schlierenMotion: [0, 100],
  schlierenDispersion: [0, 100],
  schlierenRim: [0, 100],
  schlierenRipple: [0, 100],
  schlierenVariation: [0, 100],
  schlierenMask: [0, 100],
  schlierenFocus: [0, 100],
  schlierenStructure: [0, 100],
  schlierenDetail: [0, 100],
  schlierenCaustics: [0, 100],
  schlierenLayerAmount: [0, 100],
  schlierenLayerAngle: [0, 100],
  schlierenLayerRatio: [0, 100],
  schlierenMaterialAmount: [0, 100],
  schlierenFilmThickness: [0, 100],
  schlierenMicrograin: [0, 100],
  schlierenPolish: [0, 100],
  schlierenTransportAmount: [0, 100],
  schlierenLightFocus: [0, 100],
  schlierenLightSharpness: [0, 100],
  schlierenOpticalShadow: [0, 100],
  polesAmount: [0, 100],
  polesScale: [0, 100],
  polesWarp: [0, 100],
  polesOrbit: [0, 100],
  polesMotion: [0, 100],
  polesSoftness: [0, 100],
  polesZeroPull: [0, 100],
  polesFiligree: [0, 100],
  polesGlow: [0, 100],
  polesHue: [0, 100],
  polesVariation: [0, 100],
  qdAmount: [0, 100],
  qdDissolve: [0, 100],
  qdAuto: [0, 100],
  qdRate: [0, 100],
  qdDensity: [0, 100],
  qdTear: [0, 100],
  qdPixel: [0, 100],
  qdWarp: [0, 100],
  qdFiligree: [0, 100],
  qdHue: [0, 100],
  qdVariation: [0, 100],
  qdEdge: [0, 100],
  vldAmount: [0, 100],
  vldScale: [0, 100],
  vldGrowth: [0, 100],
  vldRelief: [0, 100],
  vldNap: [0, 100],
  vldGloss: [0, 100],
  vldHue: [0, 100],
  vldVariation: [0, 100],
  vldDensity: [0, 100],
  hcrAmount: [0, 100],
  hcrScale: [0, 100],
  hcrRuffles: [0, 100],
  hcrDepth: [0, 100],
  hcrLace: [0, 100],
  hcrMotion: [0, 100],
  hcrYarn: [0, 100],
  hcrIridescence: [0, 100],
  hcrQuality: [0, 100],
  hcrHue: [0, 100],
  breedAmount: [0, 100],
  breedCoupling: [0, 100],
  breedWarp: [0, 100],
  breedFiligree: [0, 100],
  breedGlow: [0, 100],
  breedMotion: [0, 100],
  breedHue: [0, 100],
  breedTension: [0, 100],
  breedVariation: [0, 100],
  breedResonance: [0, 100],
  g2Amount: [0, 100],
  g2Scale: [0, 100],
  g2Warp: [0, 100],
  g2Motion: [0, 100],
  g2Torsion: [0, 100],
  g2Fracture: [0, 100],
  g2Veins: [0, 100],
  g2Sheen: [0, 100],
  g2Hue: [0, 100],
  g2Variation: [0, 100],
  g2Dispersion: [0, 100],
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
  letteringBlendStrength: [0, 100],
  letteringScale: [0, 100],
  letteringTracking: [-20, 100],
  letteringLineSpacing: [60, 300],
  letteringWarp: [0, 100],
  letteringMotion: [0, 100],
  letteringMotionSpeed: [1, 4],
  letteringMotionStagger: [0, 100],
  letteringMotionMix: [0, 100],
  letteringGradientAngle: [0, 360],
  letteringX: [0, 100],
  letteringY: [0, 100],
  letteringRotation: [-180, 180],
  letteringStretchX: [25, 250],
  letteringStretchY: [25, 250],
  letteringCurve: [-100, 100],
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
  spxAmount: [0, 100],
  spxDensity: [0, 100],
  spxMismatch: [0, 100],
  spxAngle: [0, 100],
  spxDrift: [0, 100],
  spxCurvature: [0, 100],
  spxFlicker: [0, 100],
  spxCross: [0, 100],
  spxRelief: [0, 100],
  spxHue: [0, 100],
  spxBleed: [0, 100],
  spxVariation: [0, 100],
  psAmount: [0, 100],
  psScale: [0, 100],
  psOverlap: [0, 100],
  psLift: [0, 100],
  psMotion: [0, 100],
  psFilm: [0, 100],
  psDiffraction: [0, 100],
  psHue: [0, 100],
  psWarp: [0, 100],
  psVariation: [0, 100],
  psSheen: [0, 100],
  psEdge: [0, 100],
  psDomain: [0, 100],
  kdAmount: [0, 100],
  kdScale: [0, 100],
  kdLayers: [0, 100],
  kdInversion: [0, 100],
  kdSpin: [0, 100],
  kdParallax: [0, 100],
  kdDither: [0, 100],
  kdChroma: [0, 100],
  kdHue: [0, 100],
  kdInk: [0, 100],
  kdGlow: [0, 100],
  kdWarp: [0, 100],
  kdVariation: [0, 100],
  vcAmount: [0, 100],
  vcScale: [0, 100],
  vcSpeed: [0, 100],
  vcAdvection: [0, 100],
  vcCrest: [0, 100],
  vcFilm: [0, 100],
  vcDust: [0, 100],
  vcGlow: [0, 100],
  vcHue: [0, 100],
  vcDepth: [0, 100],
  vcTurbulence: [0, 100],
  vcVariation: [0, 100],
  vcStrands: [0, 100],
  filamentAmount: [0, 100],
  filamentScale: [0, 100],
  filamentDensity: [0, 100],
  filamentMotion: [0, 100],
  filamentWidth: [0, 100],
  filamentRelief: [0, 100],
  filamentHue: [0, 100],
  filamentVariation: [0, 100],
  // Feral Jacquard controls are dormant for all 22 original geometries.
  filamentFeralCorruption: [0, 100],
  filamentFeralMigration: [0, 100],
  filamentFeralOrder: [0, 100],
  filamentFeralKnots: [0, 100],
  filamentFeralMutation: [0, 100],
  filamentQuasiSpacing: [0, 100],
  filamentQuasiPhason: [0, 100],
  filamentQuasiDrift: [0, 100],
  filamentQuasiRelief: [0, 100],
  filamentQuasiElevation: [0, 100],
  filamentQuasiOrnament: [0, 100],
  // Opt-in only: actual visible author text required.
  semanticGravityAmount: [0, 100],
  semanticGravityRadius: [0, 100],
  semanticGravityFalloff: [0, 100],
  semanticGravitySwirl: [0, 100],
  semanticGravityPulse: [0, 100],
  semanticGravityVariation: [0, 100],
  filamentCrossbreed: [0, 100],
  filamentInterlace: [0, 100],
  filamentTwist: [0, 100],
  filamentPhase: [0, 100],
  filamentNap: [0, 100],
  filamentLuster: [0, 100],
  filamentBeads: [0, 100],
  filamentBeadSize: [0, 100],
  filamentConstructionAmount: [0, 100],
  filamentConstructionPitch: [0, 100],
  filamentConstructionGap: [0, 100],
  filamentConstructionMotion: [0, 100],
  filamentConstructionRelief: [0, 100],
  filamentMicroloomAmount: [0, 100],
  filamentMicroloomScale: [0, 100],
  filamentMicroloomDepth: [0, 100],
  filamentMicroloomOpenwork: [0, 100],
  filamentMicroloomMotion: [0, 100],
  filamentMicroloomColor: [0, 100],
  filamentPhysicsAmount: [0, 100],
  filamentPhysicsScale: [0, 100],
  filamentPhysicsReach: [0, 100],
  filamentPhysicsSpeed: [0, 100],
  filamentPhysicsRepair: [0, 100],
  filamentPhysicsGlow: [0, 100],
  filamentChromaAmount: [0, 100],
  filamentChromaScale: [0, 100],
  filamentChromaSpread: [0, 100],
  filamentChromaSpeed: [0, 100],
  filamentChromaContrast: [0, 100],
  filamentChromaExchange: [0, 100],
  filamentEngraveAmount: [0, 100],
  filamentEngraveScale: [0, 100],
  filamentEngraveDepth: [0, 100],
  filamentEngraveWidth: [0, 100],
  filamentEngraveMotion: [0, 100],
  filamentEngraveHue: [0, 100],
  filamentAlchAmount: [0, 100],
  filamentAlchProgress: [0, 100],
  filamentAlchSpeed: [0, 100],
  filamentAlchScale: [0, 100],
  filamentAlchGlow: [0, 100],
  filamentMetaAmount: [0, 100],
  filamentMetaFrequency: [0, 100],
  filamentMetaThickness: [0, 100],
  filamentMetaDispersion: [0, 100],
  filamentMetaMotion: [0, 100],
  filamentMetaPolish: [0, 100],
  filamentDimAmount: [0, 100],
  filamentDimProgress: [0, 100],
  filamentDimSpeed: [0, 100],
  filamentDimWarp: [0, 100],
  filamentDimFusion: [0, 100],
  filamentArchitectureAmount: [0, 100],
  filamentArchitectureScale: [0, 100],
  filamentArchitectureReach: [0, 100],
  filamentArchitectureOpenwork: [0, 100],
  filamentArchitectureSpeed: [0, 100],
  filamentArchitectureHue: [0, 100],
  filamentEcologyAmount: [0, 100],
  filamentEcologyScale: [0, 100],
  filamentEcologyCoverage: [0, 100],
  filamentEcologySpeed: [0, 100],
  filamentEcologyRelief: [0, 100],
  filamentEcologyHue: [0, 100],
  filamentSecondHue: [0, 100],
  // Independent thin-film/polarization-inspired fiber optical coats.
  filamentOpticsAmount: [0, 100],
  filamentOpticsThickness: [0, 100],
  filamentOpticsDispersion: [0, 100],
  filamentOpticsAnisotropy: [0, 100],
  filamentOpticsCurvature: [0, 100],
  filamentOpticsPearl: [0, 100],
  filamentOpticsPhase: [0, 100],
  filamentSecondOpticsAmount: [0, 100],
  filamentSecondOpticsThickness: [0, 100],
  filamentSecondOpticsDispersion: [0, 100],
  filamentSecondOpticsAnisotropy: [0, 100],
  filamentSecondOpticsCurvature: [0, 100],
  filamentSecondOpticsPearl: [0, 100],
  filamentSecondOpticsPhase: [0, 100],
  filamentMorphAmount: [0, 100],
  filamentMorphScale: [0, 100],
  filamentMorphSpeed: [0, 100],
  filamentMorphSharpness: [0, 100],
  filamentMorphGlow: [0, 100],
  filamentContagionAmount: [0, 100],
  filamentContagionReach: [0, 100],
  filamentContagionSpeed: [0, 100],
  filamentContagionLag: [0, 100],
  filamentContagionGlow: [0, 100],
  filamentNeuralAmount: [0, 100],
  filamentNeuralSpeed: [0, 100],
  filamentNeuralCoupling: [0, 100],
  filamentNeuralThreshold: [0, 100],
  filamentNeuralGlow: [0, 100],
  filamentPlasticAmount: [0, 100],
  filamentPlasticRate: [0, 100],
  filamentPlasticInhibition: [0, 100],
  filamentPlasticRetention: [0, 100],
  filamentPlasticGlow: [0, 100],
  filamentScarAmount: [0, 100],
  filamentScarDensity: [0, 100],
  filamentScarPersistence: [0, 100],
  filamentScarRoughness: [0, 100],
  filamentScarGlow: [0, 100],
  filamentRegenAmount: [0, 100],
  filamentRegenBranches: [0, 100],
  filamentRegenSpeed: [0, 100],
  filamentRegenHealing: [0, 100],
  filamentRegenGlow: [0, 100],
  filamentAdornmentAmount: [0, 100],
  filamentAdornmentSpacing: [0, 100],
  filamentAdornmentSize: [0, 100],
  filamentAdornmentMotion: [0, 100],
  filamentAdornmentGlow: [0, 100],
  filamentAdornmentPopulation: [0, 100],
  filamentAdornmentRhythm: [0, 100],
  filamentAdornmentFinishAmount: [0, 100],
  filamentAdornmentFilm: [0, 100],
  filamentAdornmentFacet: [0, 100],
  filamentAdornmentPolish: [0, 100],
  filamentAdornmentInteriorAmount: [0, 100],
  filamentAdornmentInteriorDensity: [0, 100],
  filamentAdornmentInteriorOpenwork: [0, 100],
  filamentAdornmentInteriorDrift: [0, 100],
  filamentAdornmentDiversity: [0, 100],
  filamentAdornmentSizeVariance: [0, 100],
  filamentAdornmentFinishVariance: [0, 100],
  filamentAdornmentAnatomyVariance: [0, 100],
  filamentStitchAmount: [0, 100],
  filamentStitchSpeed: [0, 100],
  filamentStitchLength: [0, 100],
  filamentStitchGlow: [0, 100],
  // Chladni Needle Orchestra parameters are dormant for all 31 old stitch laws.
  filamentChladniOrder: [0, 100],
  filamentChladniResonance: [0, 100],
  filamentChladniDensity: [0, 100],
  filamentChladniPhase: [0, 100],
  filamentChladniDetune: [0, 100],
  // Analytic future-looking stitch parameters; inactive for all legacy modes.
  filamentRetroLead: [0, 100],
  filamentRetroEcho: [0, 100],
  filamentRetroParadox: [0, 100],
  filamentRetroKnots: [0, 100],
  filamentRetroReversal: [0, 100],
  filamentRetroCoherence: [0, 100],
  filamentSculptAmount: [0, 100],
  filamentSculptDepth: [0, 100],
  filamentSculptLight: [0, 100],
  filamentSculptShadow: [0, 100],
  filamentSculptPuff: [0, 100],
  underlayAmount: [0, 100],
  underlayScale: [0, 100],
  underlayDensity: [0, 100],
  underlayMotion: [0, 100],
  underlayRelief: [0, 100],
  underlayHue: [0, 100],
  underlayContrast: [0, 100],
  underlayVariation: [0, 100],
  photonAmount: [0, 100],
  photonScale: [0, 100],
  photonMotion: [0, 100],
  photonDensity: [0, 100],
  photonRelief: [0, 100],
  photonHue: [0, 100],
  photonVariation: [0, 100],
  alchemyAmount: [0, 100],
  alchemyScale: [0, 100],
  alchemyMotion: [0, 100],
  alchemySeparation: [0, 100],
  alchemySoftness: [0, 100],
  alchemyWhite: [0, 100],
  alchemyVariation: [0, 100],
  injuryAmount: [0, 100],
  injuryScale: [0, 100],
  injuryMotion: [0, 100],
  injurySeparation: [0, 100],
  injuryGrain: [0, 100],
  injuryGlow: [0, 100],
  injuryVariation: [0, 100],
  substanceAmount: [0, 100],
  substanceScale: [0, 100],
  substanceMotion: [0, 100],
  substanceRelief: [0, 100],
  substanceEdge: [0, 100],
  substanceHue: [0, 100],
  substanceVariation: [0, 100],
  atmoAmount: [0, 100],
  atmoScale: [0, 100],
  atmoDensity: [0, 100],
  atmoMotion: [0, 100],
  atmoGlow: [0, 100],
  atmoHue: [0, 100],
  atmoVariation: [0, 100],
  atmoBAmount: [0, 100],
  atmoBScale: [0, 100],
  atmoBDensity: [0, 100],
  atmoBMotion: [0, 100],
  atmoBGlow: [0, 100],
  atmoBHue: [0, 100],
  atmoBVariation: [0, 100],
  atmoMaskScale: [0, 100],
  atmoMaskFeather: [0, 100],
  atmoMaskMotion: [0, 100],
  atmoMaskVariation: [0, 100],
  habitatBrushRadius: [5, 45],
  colonyLifeAmount: [0, 100],
  colonyLifeSpeed: [0, 100],
  colonyFrontGlow: [0, 100],
  colonyCompetition: [0, 100],
  colonyAnatomyAmount: [0, 100],
  colonyAnatomyDetail: [0, 100],
  colonyAnatomyMotion: [0, 100],
  colonyAnatomyPores: [0, 100],
  colonyPoreDensity: [0, 100],
  colonyPoreSize: [0, 100],
  colonyAnatomyRim: [0, 100],
  colonyCortexAmount: [0, 100],
  colonyCortexDetail: [0, 100],
  colonyCortexMotion: [0, 100],
  colonyCortexRelief: [0, 100],
  sporeAmount: [0, 100],
  sporeSpeed: [0, 100],
  sporeReach: [0, 100],
  sporeFertility: [0, 100],
  sporeGlow: [0, 100],
  substrateAmount: [0, 100],
  substrateScale: [0, 100],
  substrateMotion: [0, 100],
  substratePressure: [0, 100],
  substrateAffinityA: [0, 100],
  substrateAffinityB: [0, 100],
  substrateGlow: [0, 100],
  substrateHue: [0, 100],
  symbiosisAmount: [0, 100],
  symbiosisDetail: [0, 100],
  symbiosisMotion: [0, 100],
  symbiosisGlow: [0, 100],
  symbiosisDominance: [0, 100],
  geneAmount: [0, 100],
  geneMutation: [0, 100],
  geneCrossbreed: [0, 100],
  geneGlow: [0, 100],
  selectionPressure: [0, 100],
  selectionSeverity: [0, 100],
  selectionBrood: [0, 100],
  selectionGlow: [0, 100],
  apocalypseAmount: [0, 100],
  apocalypseScale: [0, 100],
  apocalypseMotion: [0, 100],
  apocalypsePressure: [0, 100],
  apocalypseGlow: [0, 100],
  apocalypseHue: [0, 100],
  fossilAmount: [0, 100],
  fossilDepth: [0, 100],
  fossilMotion: [0, 100],
  fossilGlow: [0, 100],
  fossilHue: [0, 100],
  fossilBurial: [0, 100],
  successionAmount: [0, 100],
  successionDepth: [0, 100],
  successionSpread: [0, 100],
  successionMotion: [0, 100],
  successionGlow: [0, 100],
  successionHue: [0, 100],
  successionBurial: [0, 100],
  foodWebAmount: [0, 100],
  foodWebReach: [0, 100],
  foodWebPressure: [0, 100],
  foodWebPulse: [0, 100],
  foodWebWidth: [0, 100],
  foodWebGlow: [0, 100],
  foodWebHue: [0, 100],
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
  topperIsland: 0,
  topperIslandDensity: 30,
  topperIslandScale: 35,
  topperIslandMotion: 30,
  topperIslandForm: 20,
  topperIslandMapping: 20,
  topperIslandHue: 50,
  topperIslandFeather: 20,
  topperVoronoi: 0,
  topperVoronoiDensity: 20,
  topperVoronoiScale: 45,
  topperVoronoiMotion: 35,
  topperVoronoiGap: 55,
  topperVoronoiTexture: 25,
  topperVoronoiHue: 50,
  topperVoronoiBlend: 25,
  topperTape: 0,
  topperTapeDensity: 25,
  topperTapeScale: 35,
  topperTapeMotion: 40,
  topperTapeWidth: 35,
  topperTapeDispersion: 65,
  topperTapeHue: 50,
  topperTapePalette: 15,
  topperPortal: 0,
  topperPortalDensity: 20,
  topperPortalScale: 35,
  topperPortalMotion: 30,
  topperPortalZoom: 25,
  topperPortalForm: 20,
  topperPortalWarp: 45,
  topperPortalHue: 30,
  topperTime: 0,
  topperTimeDensity: 20,
  topperTimeScale: 40,
  topperTimeMotion: 35,
  topperTimeHold: 70,
  topperTimeSlip: 25,
  topperTimeForm: 20,
  topperTimeChroma: 30,
  topperIslandPulse: 0,
  topperIslandPulseRate: 35,
  topperIslandTwinkle: 0,
  topperIslandTwinkleRate: 35,
  topperIslandSpin: 0,
  topperIslandSpinRate: 35,
  topperIslandSpinDirection: 85,
  topperIslandIndependence: 100,
  topperJewelPulse: 0,
  topperJewelPulseRate: 35,
  topperJewelTwinkle: 0,
  topperJewelTwinkleRate: 35,
  topperJewelSpin: 0,
  topperJewelSpinRate: 35,
  topperJewelDirection: 85,
  topperJewelIndependence: 100,
  topperJewelOutline: 0,
  topperHex: 0,
  topperHexDensity: 30,
  topperHexScale: 45,
  topperHexMotion: 35,
  topperHexGap: 25,
  topperHexTexture: 20,
  topperHexHue: 50,
  topperHexBlend: 25,
  topperTri: 0,
  topperTriDensity: 30,
  topperTriScale: 45,
  topperTriMotion: 35,
  topperTriGap: 25,
  topperTriTexture: 20,
  topperTriHue: 50,
  topperTriBlend: 25,
  topperTriPulse: 0,
  topperTriTwinkle: 0,
  topperKagome: 0,
  topperKagomeDensity: 30,
  topperKagomeScale: 45,
  topperKagomeMotion: 35,
  topperKagomeGap: 25,
  topperKagomeTexture: 20,
  topperKagomeHue: 50,
  topperKagomeBlend: 25,
  topperKagomePulse: 0,
  topperKagomeTwinkle: 0,
  topperKagomeBalance: 50,
  topperJewel: 0,
  topperJewelDensity: 25,
  topperJewelScale: 40,
  topperJewelMotion: 40,
  topperJewelDetail: 50,
  topperJewelHue: 50,
  topperJewelForm: 25,
  topperJewelBlend: 20,
  topperShrapnel: 0,
  topperDensity: 35,
  topperScale: 45,
  topperMotion: 45,
  topperHue: 50,
  topperShape: 25,
  topperBlend: 25,
  misregister: 0,
  afterimage: 0,
  datamosh: 0,
  memoryDrift: 20,
  memoryDecay: 28,
  hyperbolicFold: 70,
  fractalZoom: 25,
  juliaMix: 0,
  quasiDensity: 50,
  hexagramAmount: 0,
  hexagramScale: 56,
  hexagramWarp: 38,
  hexagramMotion: 46,
  hexagramRelief: 78,
  hexagramBorder: 58,
  hexagramHue: 42,
  hexagramCoupling: 73,
  hexagramVariation: 38,
  hexagramThreshold: 50,
  schlierenMode: "Molten portholes",
  schlierenEtching: "Native architecture",
  schlierenKinetics: "Original drift",
  schlierenCoupling: "Single field",
  schlierenMaterial: "Original glass",
  schlierenTransport: "Original highlights",
  schlierenTransportAmount: 80,
  schlierenLightFocus: 60,
  schlierenLightSharpness: 65,
  schlierenOpticalShadow: 45,
  schlierenMaterialAmount: 80,
  schlierenFilmThickness: 55,
  schlierenMicrograin: 40,
  schlierenPolish: 70,
  schlierenCouplingRule: "Superposition",
  schlierenLayerAmount: 65,
  schlierenLayerAngle: 35,
  schlierenLayerRatio: 50,
  schlierenAmount: 0,
  schlierenScale: 45,
  schlierenBend: 68,
  schlierenMotion: 55,
  schlierenDispersion: 61,
  schlierenRim: 65,
  schlierenRipple: 67,
  schlierenVariation: 43,
  schlierenMask: 72,
  schlierenFocus: 67,
  schlierenStructure: 72,
  schlierenDetail: 65,
  schlierenCaustics: 60,
  polesMode: "Rational Bloom",
  polesAmount: 0,
  polesScale: 55,
  polesWarp: 70,
  polesOrbit: 46,
  polesMotion: 58,
  polesSoftness: 51,
  polesZeroPull: 65,
  polesFiligree: 77,
  polesGlow: 73,
  polesHue: 43,
  polesVariation: 34,
  qdMode: "Crystal Clockwork",
  qdOrder: "Sevenfold",
  qdAmount: 0,
  qdDissolve: 35,
  qdAuto: 0,
  qdRate: 55,
  qdDensity: 53,
  qdTear: 65,
  qdPixel: 52,
  qdWarp: 62,
  qdFiligree: 82,
  qdHue: 42,
  qdVariation: 36,
  qdEdge: 79,
  velvetMode: "Royal Bio-Damask",
  vldAmount: 0,
  vldScale: 56,
  vldGrowth: 48,
  vldRelief: 60,
  vldNap: 78,
  vldGloss: 67,
  vldHue: 46,
  vldVariation: 33,
  vldDensity: 65,
  crochetMode: "Hyperbolic Coral",
  hcrAmount: 0,
  hcrScale: 60,
  hcrRuffles: 76,
  hcrDepth: 65,
  hcrLace: 76,
  hcrMotion: 57,
  hcrYarn: 69,
  hcrIridescence: 73,
  hcrQuality: 35,
  hcrHue: 45,
  breedMode: "Oracle Singularity Brocade",
  breedAmount: 0,
  breedCoupling: 68,
  breedWarp: 63,
  breedFiligree: 74,
  breedGlow: 73,
  breedMotion: 49,
  breedHue: 36,
  breedTension: 47,
  breedVariation: 55,
  breedResonance: 77,
  g2Mode: "Torsion Silk",
  g2Amount: 0,
  g2Scale: 59,
  g2Warp: 55,
  g2Motion: 45,
  g2Torsion: 68,
  g2Fracture: 72,
  g2Veins: 75,
  g2Sheen: 80,
  g2Hue: 44,
  g2Variation: 50,
  g2Dispersion: 78,
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
  letteringBlendMode: "Normal",
  letteringBlendStrength: 100,
  letteringFont: "original",
  letteringAmount: 0,
  letteringScale: 48,
  letteringTracking: 0,
  letteringLineSpacing: 118,
  letteringFormats: [],
  letteringWarp: 40,
  letteringMotion: 55,
  letteringMotionPath: "Classic drift",
  letteringMotionPath2: "None",
  letteringMotionMix: 65,
  letteringMotionSpeed: 1,
  letteringMotionStagger: 10,
  letteringMotionDirection: "Forward",
  letteringFillMode: "Solid",
  letteringFill: "#ffffff",
  letteringGradient: ["#ff2fbf","#00f5ff","#fff36a"],
  letteringGradientAngle: 0,
  letteringStrokes: [],
  letteringX: 50,
  letteringY: 50,
  letteringRotation: 0,
  letteringStretchX: 100,
  letteringStretchY: 100,
  letteringCurve: 0,
  letteringDrag: false,
  letteringLayers: [],
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
  spxMode: "Shadowmask Silk",
  spxAmount: 0,
  spxDensity: 58,
  spxMismatch: 55,
  spxAngle: 41,
  spxDrift: 40,
  spxCurvature: 48,
  spxFlicker: 25,
  spxCross: 68,
  spxRelief: 71,
  spxHue: 49,
  spxBleed: 67,
  spxVariation: 48,
  psMode: "Diamondback Prisms",
  psAmount: 0,
  psScale: 62,
  psOverlap: 70,
  psLift: 77,
  psMotion: 52,
  psFilm: 84,
  psDiffraction: 72,
  psHue: 44,
  psWarp: 50,
  psVariation: 55,
  psSheen: 82,
  psEdge: 68,
  psDomain: 48,
  kdMode: "Schottky Lace Press",
  kdAmount: 0,
  kdScale: 57,
  kdLayers: 61,
  kdInversion: 64,
  kdSpin: 45,
  kdParallax: 55,
  kdDither: 74,
  kdChroma: 66,
  kdHue: 49,
  kdInk: 68,
  kdGlow: 70,
  kdWarp: 52,
  kdVariation: 42,
  vcMode: "Violet Curl Sea",
  vcAmount: 0,
  vcScale: 56,
  vcSpeed: 49,
  vcAdvection: 48,
  vcCrest: 70,
  vcFilm: 71,
  vcDust: 32,
  vcGlow: 68,
  vcHue: 52,
  vcDepth: 66,
  vcTurbulence: 55,
  vcVariation: 48,
  vcStrands: 62,
  filamentSpecies: "Fivefold brocade",
  filamentAmount: 0,
  filamentScale: 54,
  filamentDensity: 62,
  filamentMotion: 50,
  filamentWidth: 33,
  filamentRelief: 77,
  filamentHue: 43,
  filamentVariation: 38,
  filamentFeralCorruption: 49,
  filamentFeralMigration: 48,
  filamentFeralOrder: 59,
  filamentFeralKnots: 52,
  filamentFeralMutation: 46,
  filamentQuasiSpacing: 48,
  filamentQuasiPhason: 32,
  filamentQuasiDrift: 37,
  filamentQuasiRelief: 79,
  filamentQuasiElevation: 76,
  filamentQuasiOrnament: 58,
  semanticGravityMode: "Off",
  semanticGravityAmount: 0,
  semanticGravityRadius: 57,
  semanticGravityFalloff: 62,
  semanticGravitySwirl: 61,
  semanticGravityPulse: 35,
  semanticGravityVariation: 47,
  filamentSecondSpecies: "Truchet knotwork",
  filamentCrossbreed: 0,
  filamentInterlace: 72,
  filamentTwist: 22,
  filamentPhase: 35,
  filamentMaterial: "Original thread",
  filamentSecondMaterial: "Original thread",
  filamentNap: 0,
  filamentLuster: 55,
  filamentBeads: 0,
  filamentBeadSize: 45,
  filamentConstruction: "Original strand",
  filamentConstructionAmount: 80,
  filamentConstructionPitch: 55,
  filamentConstructionGap: 60,
  filamentConstructionMotion: 50,
  filamentConstructionRelief: 75,
  filamentMicroloom: "Plain strand interior",
  filamentMicroloomAmount: 80,
  filamentMicroloomScale: 50,
  filamentMicroloomDepth: 55,
  filamentMicroloomOpenwork: 48,
  filamentMicroloomMotion: 55,
  filamentMicroloomColor: 65,
  filamentPhysics: "Stable threads",
  filamentPhysicsAmount: 80,
  filamentPhysicsScale: 55,
  filamentPhysicsReach: 60,
  filamentPhysicsSpeed: 50,
  filamentPhysicsRepair: 55,
  filamentPhysicsGlow: 65,
  filamentChroma: "Original pigment",
  filamentChromaAmount: 80,
  filamentChromaScale: 55,
  filamentChromaSpread: 65,
  filamentChromaSpeed: 50,
  filamentChromaContrast: 55,
  filamentChromaExchange: 75,
  filamentEngraveMode: "Unengraved",
  filamentEngraveAmount: 85,
  filamentEngraveScale: 50,
  filamentEngraveDepth: 70,
  filamentEngraveWidth: 45,
  filamentEngraveMotion: 35,
  filamentEngraveHue: 50,
  filamentAlchMode: "Stable material",
  filamentAlchTarget: "Bioluminescent gelatin",
  filamentAlchAmount: 100,
  filamentAlchProgress: 50,
  filamentAlchSpeed: 45,
  filamentAlchScale: 50,
  filamentAlchGlow: 65,
  filamentMeta: "Natural scaffold",
  filamentMetaAmount: 82,
  filamentMetaFrequency: 45,
  filamentMetaThickness: 55,
  filamentMetaDispersion: 85,
  filamentMetaMotion: 50,
  filamentMetaPolish: 75,
  filamentDimMode: "Static architecture",
  filamentDimTarget: "Gyroid labyrinth",
  filamentDimAmount: 100,
  filamentDimProgress: 50,
  filamentDimSpeed: 45,
  filamentDimWarp: 55,
  filamentDimFusion: 65,
  filamentArchitecture: "Bare architecture",
  filamentArchitectureAmount: 80,
  filamentArchitectureScale: 45,
  filamentArchitectureReach: 70,
  filamentArchitectureOpenwork: 60,
  filamentArchitectureSpeed: 50,
  filamentArchitectureHue: 40,
  filamentEcology: "Clean fibers",
  filamentEcologyAmount: 82,
  filamentEcologyScale: 45,
  filamentEcologyCoverage: 68,
  filamentEcologySpeed: 55,
  filamentEcologyRelief: 75,
  filamentEcologyHue: 40,
  filamentSecondHue: 0,
  filamentOpticsMode: "Off",
  filamentOpticsAmount: 0,
  filamentOpticsThickness: 60,
  filamentOpticsDispersion: 75,
  filamentOpticsAnisotropy: 58,
  filamentOpticsCurvature: 66,
  filamentOpticsPearl: 60,
  filamentOpticsPhase: 35,
  filamentSecondOpticsMode: "Off",
  filamentSecondOpticsAmount: 0,
  filamentSecondOpticsThickness: 70,
  filamentSecondOpticsDispersion: 77,
  filamentSecondOpticsAnisotropy: 60,
  filamentSecondOpticsCurvature: 64,
  filamentSecondOpticsPearl: 67,
  filamentSecondOpticsPhase: 75,
  filamentMorphMode: "Off",
  filamentMorphTarget: "Opaline glass",
  filamentSecondMorphTarget: "Bioluminescent mycelium",
  filamentMorphAmount: 0,
  filamentMorphScale: 55,
  filamentMorphSpeed: 50,
  filamentMorphSharpness: 58,
  filamentMorphGlow: 70,
  filamentContagionMode: "Off",
  filamentContagionAmount: 0,
  filamentContagionReach: 54,
  filamentContagionSpeed: 52,
  filamentContagionLag: 42,
  filamentContagionGlow: 67,
  filamentNeuralMode: "Off",
  filamentNeuralAmount: 0,
  filamentNeuralSpeed: 52,
  filamentNeuralCoupling: 48,
  filamentNeuralThreshold: 39,
  filamentNeuralGlow: 74,
  filamentPlasticMode: "Off",
  filamentPlasticAmount: 0,
  filamentPlasticRate: 49,
  filamentPlasticInhibition: 45,
  filamentPlasticRetention: 61,
  filamentPlasticGlow: 75,
  filamentScarMode: "Off",
  filamentScarAmount: 0,
  filamentScarDensity: 61,
  filamentScarPersistence: 66,
  filamentScarRoughness: 49,
  filamentScarGlow: 78,
  filamentRegenMode: "Off",
  filamentRegenAmount: 0,
  filamentRegenBranches: 59,
  filamentRegenSpeed: 48,
  filamentRegenHealing: 63,
  filamentRegenGlow: 76,
  filamentAdornmentMode: "Bare threads",
  filamentAdornmentPlacement: "Original stations",
  filamentAdornmentKinetics: "Original movement",
  filamentAdornmentPopulation: 70,
  filamentAdornmentRhythm: 60,
  filamentAdornmentFinish: "Original jewelry",
  filamentAdornmentFinishAmount: 82,
  filamentAdornmentFilm: 52,
  filamentAdornmentFacet: 65,
  filamentAdornmentPolish: 72,
  filamentAdornmentInterior: "Native ornament",
  filamentAdornmentInteriorAmount: 80,
  filamentAdornmentInteriorDensity: 65,
  filamentAdornmentInteriorOpenwork: 55,
  filamentAdornmentInteriorDrift: 60,
  filamentAdornmentColony: "Uniform jewelry",
  filamentAdornmentDiversity: 72,
  filamentAdornmentSizeVariance: 55,
  filamentAdornmentFinishVariance: 55,
  filamentAdornmentAnatomyVariance: 55,
  filamentSecondAdornmentMode: "Bare threads",
  filamentAdornmentAmount: 0,
  filamentAdornmentSpacing: 56,
  filamentAdornmentSize: 55,
  filamentAdornmentMotion: 48,
  filamentAdornmentGlow: 70,
  filamentStitchMode: "Needle chase",
  filamentStitchAmount: 0,
  filamentStitchSpeed: 52,
  filamentStitchLength: 46,
  filamentStitchGlow: 76,
  filamentChladniOrder: 48,
  filamentChladniResonance: 72,
  filamentChladniDensity: 67,
  filamentChladniPhase: 41,
  filamentChladniDetune: 27,
  filamentRetroLead: 60,
  filamentRetroEcho: 64,
  filamentRetroParadox: 39,
  filamentRetroKnots: 58,
  filamentRetroReversal: 30,
  filamentRetroCoherence: 72,
  filamentSculptMode: "Raised satin",
  filamentSculptAmount: 0,
  filamentSculptDepth: 60,
  filamentSculptLight: 16,
  filamentSculptShadow: 66,
  filamentSculptPuff: 45,
  underlayMode: "Ornamental jacquard",
  underlayAmount: 0,
  underlayScale: 55,
  underlayDensity: 64,
  underlayMotion: 41,
  underlayRelief: 77,
  underlayHue: 37,
  underlayContrast: 68,
  underlayVariation: 29,
  photonSpecies: "Prism rosettes",
  photonAmount: 0,
  photonScale: 53,
  photonMotion: 57,
  photonDensity: 66,
  photonRelief: 76,
  photonHue: 48,
  photonVariation: 33,
  alchemyMode: "OKLab Chroma Oracle",
  alchemyAmount: 0,
  alchemyScale: 56,
  alchemyMotion: 58,
  alchemySeparation: 75,
  alchemySoftness: 57,
  alchemyWhite: 53,
  alchemyVariation: 39,
  alchemyPalette: true,
  injuryMode: "Rainbow XOR Ditherscape",
  injuryAmount: 0,
  injuryScale: 53,
  injuryMotion: 60,
  injurySeparation: 75,
  injuryGrain: 55,
  injuryGlow: 69,
  injuryVariation: 41,
  injuryPalette: true,
  substanceMode: "CMY lithogenesis",
  substanceAmount: 0,
  substanceScale: 54,
  substanceMotion: 54,
  substanceRelief: 62,
  substanceEdge: 68,
  substanceHue: 43,
  substanceVariation: 41,
  atmoMode: "Prismatic mycelium",
  atmoAmount: 0,
  atmoScale: 57,
  atmoDensity: 66,
  atmoMotion: 51,
  atmoGlow: 75,
  atmoHue: 43,
  atmoVariation: 38,
  atmoBMode: "Mandala gas leak",
  atmoBAmount: 0,
  atmoBScale: 63,
  atmoBDensity: 70,
  atmoBMotion: 68,
  atmoBGlow: 73,
  atmoBHue: 69,
  atmoBVariation: 53,
  atmoMaskMode: "Everywhere",
  atmoBMaskMode: "Everywhere",
  atmoBBlendMode: "Over",
  atmoMaskScale: 52,
  atmoMaskFeather: 51,
  atmoMaskMotion: 47,
  atmoMaskVariation: 38,
  habitatBrushRadius: 19,
  habitatStamps: [],
  colonyLifeMode: "Still",
  colonyLifeAmount: 0,
  colonyLifeSpeed: 47,
  colonyFrontGlow: 0,
  colonyCompetition: 0,
  colonyShapeA: "Classic disks",
  colonyShapeB: "Classic disks",
  colonyAnatomyAmount: 0,
  colonyAnatomyDetail: 57,
  colonyAnatomyMotion: 47,
  colonyAnatomyPores: 0,
  colonyPoreMode: "Classic pores",
  colonyPoreDensity: 50,
  colonyPoreSize: 50,
  colonyAnatomyRim: 0,
  colonyCortexA: "Bare cortex",
  colonyCortexB: "Bare cortex",
  colonyCortexAmount: 0,
  colonyCortexDetail: 55,
  colonyCortexMotion: 45,
  colonyCortexRelief: 50,
  sporeMode: "Dormant",
  sporeAmount: 0,
  sporeSpeed: 57,
  sporeReach: 58,
  sporeFertility: 64,
  sporeGlow: 73,
  sporeGeneration: 0,
  coevoRound: 0,
  substrateMode: "Bare canvas",
  substrateAmount: 0,
  substrateScale: 55,
  substrateMotion: 50,
  substratePressure: 0,
  substrateAffinityA: 90,
  substrateAffinityB: 10,
  substrateGlow: 67,
  substrateHue: 48,
  symbiosisMode: "Dormant",
  symbiosisAmount: 0,
  symbiosisDetail: 62,
  symbiosisMotion: 47,
  symbiosisGlow: 71,
  symbiosisDominance: 50,
  geneAmount: 0,
  geneMutation: 57,
  geneCrossbreed: 44,
  geneGlow: 72,
  selectionMode: "Dormant",
  selectionPressure: 0,
  selectionSeverity: 35,
  selectionBrood: 58,
  selectionGlow: 80,
  apocalypseMode: "Dormant",
  apocalypseAmount: 0,
  apocalypseScale: 54,
  apocalypseMotion: 58,
  apocalypsePressure: 66,
  apocalypseGlow: 85,
  apocalypseHue: 47,
  apocalypseEpoch: 0,
  fossilMode: "Dormant",
  fossilAmount: 0,
  fossilDepth: 73,
  fossilMotion: 54,
  fossilGlow: 80,
  fossilHue: 46,
  fossilBurial: 58,
  fossilRecords: [],
  successionMode: "Pioneer enrichment",
  successionAmount: 0,
  successionDepth: 70,
  successionSpread: 58,
  successionMotion: 54,
  successionGlow: 76,
  successionHue: 45,
  successionBurial: 60,
  successionEpoch: 0,
  successionRecords: [],
  foodWebMode: "Mutualist exchange",
  foodWebAmount: 0,
  foodWebReach: 58,
  foodWebPressure: 67,
  foodWebPulse: 55,
  foodWebWidth: 35,
  foodWebGlow: 70,
  foodWebHue: 65,
  foodWebRound: 0,
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
  "alchemyPalette",
  "injuryPalette",
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
    schlierenMode: schlierenModes,
    schlierenEtching: glassEtchingModes,
    schlierenKinetics: glassMotionModes,
    schlierenCoupling: glassCouplingModes,
    schlierenMaterial: glassMaterialModes,
    schlierenTransport: glassTransportModes,
    schlierenCouplingRule: glassCouplingRules,
    polesMode: polesModes,
    qdMode: qdModes,
    qdOrder: qdOrders,
    velvetMode: velvetModes,
    crochetMode: crochetModes,
    breedMode: breedModes,
    g2Mode: g2Modes,
    tunnelMode: tunnelModes,
    stereoShape: stereoShapes,
    wiggleMode: wiggleModes,
    letteringStyle: letteringStyles,
    letteringBlendMode: letteringBlendModes,
    letteringMotionPath: letteringMotionPaths,
    letteringMotionPath2: ["None",...letteringMotionPaths],
    letteringMotionDirection: ["Forward","Reverse"],
    letteringFont: retroFontIds,
    letteringFillMode: ["Solid","Linear gradient","Radial gradient"],
    compositionMode: compositionModes,
    backdropMode: backdropModes,
    microMode: microModes,
    spxMode: spxModes,
    psMode: psModes,
    kdMode: kdModes,
    vcMode: vcModes,
    substanceMode: substanceModes,
    photonSpecies: photonSpecies,
    alchemyMode: alchemyModes,
    injuryMode: injuryModes,
    filamentSpecies: filamentSpecies,
    semanticGravityMode: semanticGravityModes,
    filamentSecondSpecies: filamentSpecies,
    filamentMaterial: filamentMaterials,
    filamentConstruction: fiberConstructionModes,
    filamentMicroloom: microloomModes,
    filamentPhysics: textilePhysicsModes,
    filamentChroma: textileChromaModes,
    filamentEngraveMode: textileEngravingModes,
    filamentAlchMode: textileAlchemyModes,
    filamentAlchTarget: textileAlchemyTargets,
    filamentMeta: textileMetaModes,
    filamentDimMode: textileDimensionModes,
    filamentDimTarget: textileDimensionTargets,
    filamentArchitecture: textileArchitectureModes,
    filamentEcology: textileEcologyModes,
    filamentSecondMaterial: filamentMaterials,
    filamentOpticsMode: structuralOpticsModes,
    filamentSecondOpticsMode: structuralOpticsModes,
    filamentStitchMode: filamentStitchModes,
    filamentMorphMode: filamentMorphModes,
    filamentContagionMode: filamentContagionModes,
    filamentNeuralMode: filamentNeuralModes,
    filamentPlasticMode: filamentPlasticModes,
    filamentScarMode: filamentScarModes,
    filamentRegenMode: filamentRegenModes,
    filamentMorphTarget: filamentMaterials,
    filamentSecondMorphTarget: filamentMaterials,
    filamentAdornmentMode: filamentAdornmentModes,
    filamentAdornmentPlacement: jewelryPlacementModes,
    filamentAdornmentKinetics: jewelryKineticModes,
    filamentAdornmentFinish: jewelryFinishModes,
    filamentAdornmentInterior: jewelryInteriorModes,
    filamentAdornmentColony: jewelryColonyModes,
    filamentSecondAdornmentMode: filamentAdornmentModes,
    filamentSculptMode: filamentSculptModes,
    underlayMode: underlayModes,
    atmoMode: atmosphereModes,
    atmoBMode: atmosphereModes,
    atmoMaskMode: atmosphereHabitats,
    atmoBMaskMode: atmosphereSecondHabitats,
    atmoBBlendMode: atmosphereBlendModes,
    colonyLifeMode: colonyLifeModes,
    colonyShapeA: colonyAnatomyModes,
    colonyShapeB: colonyAnatomyModes,
    colonyPoreMode: colonyPoreModes,
    colonyCortexA: colonyCortexModes,
    colonyCortexB: colonyCortexModes,
    sporeMode: sporeModes,
    substrateMode: substrateModes,
    symbiosisMode: symbiosisModes,
    selectionMode: selectionModes,
    apocalypseMode: apocalypseModes,
    fossilMode: fossilModes,
    successionMode: successionModes,
    foodWebMode: foodWebModes,
  })) {
    if (x[key] !== undefined) {
      if (!choices.includes(x[key])) throw Error(`Unknown ${key}.`);
      s[key] = x[key];
    }
  }
  if(x.letteringLayers!==undefined){
    if(!Array.isArray(x.letteringLayers)||x.letteringLayers.length>2)throw Error("Maximum two additional text layers.");
    const ids=new Set();
    s.letteringLayers=x.letteringLayers.map((layer,i)=>{
      if(!layer||typeof layer!=="object"||typeof layer.text!=="string"||
         layer.text.length>280||/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(layer.text))
        throw Error("Invalid text layer.");
      const id=typeof layer.id==="string"?layer.id.slice(0,60):"layer-"+i;
      if(ids.has(id))throw Error("Duplicate text layer.");
      ids.add(id);
      const out={id,text:layer.text,visible:layer.visible!==false};
      if(typeof layer.visible!=="undefined"&&typeof layer.visible!=="boolean")throw Error("Invalid text layer visibility.");
      for(const key of ["letteringAmount","letteringScale","letteringTracking","letteringLineSpacing","letteringWarp","letteringMotion","letteringBlendStrength","letteringMotionSpeed","letteringMotionStagger","letteringMotionMix",
        "letteringX","letteringY","letteringRotation","letteringStretchX","letteringStretchY","letteringCurve"]){
        const value=layer[key]??initial[key],range=numericRanges[key];
        if(!Number.isFinite(value)||value<range[0]||value>range[1])throw Error("Invalid text layer "+key);
        out[key]=value;
      }
      for(const [key,choices] of Object.entries({letteringFont:retroFontIds,letteringStyle:letteringStyles,letteringBlendMode:letteringBlendModes,
        letteringMotionPath:letteringMotionPaths,letteringMotionPath2:["None",...letteringMotionPaths],letteringMotionDirection:["Forward","Reverse"],
        letteringFillMode:["Solid","Linear gradient","Radial gradient"]})){
        const value=layer[key]??initial[key];
        if(!choices.includes(value))throw Error("Invalid text layer "+key);
        out[key]=value;
      }
      if(layer.letteringFormats!==undefined){
        if(!Array.isArray(layer.letteringFormats)||layer.letteringFormats.length>280)
          throw Error("Invalid layer rich text.");
        for(const run of layer.letteringFormats){
          if(!run||!Number.isInteger(run.start)||!Number.isInteger(run.end)||
            run.start<0||run.end>layer.text.length||run.end<=run.start)
            throw Error("Invalid layer text format range.");
          for(const field of ["bold","italic","underline","strike","caps","rainbow"])
            if(run[field]!==undefined&&typeof run[field]!=="boolean")
              throw Error("Invalid layer text format property.");
          if(run.ink!==undefined && (typeof run.ink!=="string"||!colorRE.test(run.ink)))
            throw Error("Invalid layer text ink color.");
        }
      }
      out.letteringFormats=normalizeTextFormats(layer.text,layer.letteringFormats);
      out.letteringFill=layer.letteringFill??initial.letteringFill;
      if(typeof out.letteringFill!=="string"||!colorRE.test(out.letteringFill))throw Error("Invalid text layer fill.");
      out.letteringGradient=layer.letteringGradient??initial.letteringGradient;
      if(!Array.isArray(out.letteringGradient)||out.letteringGradient.length<2||
        out.letteringGradient.length>8||!out.letteringGradient.every(c=>typeof c==="string"&&colorRE.test(c)))
        throw Error("Invalid text layer gradient.");
      out.letteringGradientAngle=layer.letteringGradientAngle??0;
      if(!Number.isFinite(out.letteringGradientAngle)||out.letteringGradientAngle<0||out.letteringGradientAngle>360)
        throw Error("Invalid gradient angle.");
      out.letteringStrokes=layer.letteringStrokes??[];
      if(!Array.isArray(out.letteringStrokes)||out.letteringStrokes.length>5||
        !out.letteringStrokes.every(x=>x&&typeof x.color==="string"&&colorRE.test(x.color)&&
          Number.isFinite(x.width)&&x.width>=0&&x.width<=40&&typeof x.enabled==="boolean"))
        throw Error("Invalid text layer outlines.");
      return out;
    });
  }
  if(x.letteringFormats!==undefined){
    if(!Array.isArray(x.letteringFormats) || x.letteringFormats.length>280)
      throw Error("Invalid rich text formatting.");
    for(const run of x.letteringFormats){
      if(!run||!Number.isInteger(run.start)||!Number.isInteger(run.end)||
        run.start<0||run.end>String(x.lettering||"").length||run.end<=run.start)
        throw Error("Invalid rich text range.");
      for(const field of ["bold","italic","underline","strike","caps","rainbow"])
        if(run[field]!==undefined && typeof run[field]!=="boolean")
          throw Error("Invalid rich text property.");
      if(run.ink!==undefined && (typeof run.ink!=="string"||!colorRE.test(run.ink)))
        throw Error("Invalid rich text ink color.");
    }
    s.letteringFormats=normalizeTextFormats(String(x.lettering||""),x.letteringFormats);
  }
  if(x.letteringDrag!==undefined){
    if(typeof x.letteringDrag!=="boolean")throw Error("Invalid lettering drag setting.");
    s.letteringDrag=x.letteringDrag;
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
  if(x.apocalypseEpoch!==undefined){
    if(!Number.isInteger(x.apocalypseEpoch)||
       x.apocalypseEpoch<0||x.apocalypseEpoch>4095)
      throw Error("Invalid geological epoch.");
    s.apocalypseEpoch=x.apocalypseEpoch;
  }
  // This counter is not a randomizable visual slider: it is the version
  // of committed, permanently editable biological offspring in this work.
  if(x.sporeGeneration!==undefined){
    if(!Number.isInteger(x.sporeGeneration)||x.sporeGeneration<0||
      x.sporeGeneration>4095)throw Error("Invalid spore generation.");
    s.sporeGeneration=x.sporeGeneration;
  }
  if(x.coevoRound!==undefined){
    if(!Number.isInteger(x.coevoRound)||x.coevoRound<0||
      x.coevoRound>4095)throw Error("Invalid coevolution round.");
    s.coevoRound=x.coevoRound;
  }
  if(x.foodWebRound!==undefined){
    if(!Number.isInteger(x.foodWebRound)||x.foodWebRound<0||x.foodWebRound>4095)
      throw Error("Invalid food web feeding round.");
    s.foodWebRound=x.foodWebRound;
  }
  if(x.successionEpoch!==undefined){
    if(!Number.isInteger(x.successionEpoch)||x.successionEpoch<0||
       x.successionEpoch>4095)throw Error("Invalid succession epoch.");
    s.successionEpoch=x.successionEpoch;
  }
  if(x.successionRecords!==undefined){
    if(!Array.isArray(x.successionRecords)||
       x.successionRecords.length>MAX_SUCCESSION)
      throw Error("Maximum six ecological soil records.");
    const ids=new Set();
    s.successionRecords=x.successionRecords.map(record=>{
      if(!record||typeof record!=="object"||
         typeof record.id!=="string"||!record.id||record.id.length>120||
         typeof record.origin!=="string"||!record.origin||
         record.origin.length>80||
         ids.has(record.id)||
         !Number.isFinite(record.x)||record.x<0||record.x>1||
         !Number.isFinite(record.y)||record.y<0||record.y>1||
         !Number.isFinite(record.radius)||record.radius<.05||record.radius>.45||
         (record.parent!==0&&record.parent!==1)||
         !Number.isInteger(record.epoch)||record.epoch<0||
         record.epoch>4095||
         !successionModes.includes(record.mode))
        throw Error("Invalid ecological soil record.");
      ids.add(record.id);
      return {id:record.id,origin:record.origin,x:record.x,
        y:record.y,radius:record.radius,parent:record.parent,
        epoch:record.epoch,mode:record.mode};
    });
  }
  // Painted habitats are independent of touch deformation marks.
  // Bounded storage and strict validation prevent bogus GPU uniform arrays.
  if(x.habitatStamps!==undefined){
    if(!Array.isArray(x.habitatStamps)||x.habitatStamps.length>16)
      throw Error("Maximum 16 planted habitat colonies.");
    const ids=new Set();
    s.habitatStamps=x.habitatStamps.map((m,i)=>{
      if(!m||!Number.isFinite(m.x)||m.x<0||m.x>1||
         !Number.isFinite(m.y)||m.y<0||m.y>1||
         !Number.isFinite(m.radius)||m.radius<.05||m.radius>.45||
         !Number.isInteger(m.parent)||(m.parent!==0&&m.parent!==1))
        throw Error("Invalid habitat colony.");
      if(typeof m.id!=="string"||!m.id||m.id.length>80)
        throw Error("Invalid habitat colony identity.");
      if(ids.has(m.id))throw Error("Duplicate habitat colony.");
      ids.add(m.id);
      // Optional bloodline fields: old seeds stay byte-for-byte identical.
      // Each new offspring retains a real, human-readable ancestor ID.
      if(m.gene!==undefined&&(!Number.isInteger(m.gene)||
         m.gene<0||m.gene>100))
        throw Error("Invalid colony DNA allele.");
      if(m.generation!==undefined&&(!Number.isInteger(m.generation)||
         m.generation<0||m.generation>4095))
        throw Error("Invalid colony genetic generation.");
      if(m.ancestor!==undefined&&
         (typeof m.ancestor!=="string"||!m.ancestor||
          m.ancestor.length>80))
        throw Error("Invalid colony ancestor.");
      if(m.mate!==undefined&&
         (typeof m.mate!=="string"||!m.mate||m.mate.length>80))
        throw Error("Invalid colony genetic mate.");
      if(m.webEnergy!==undefined&&(!Number.isInteger(m.webEnergy)||
         m.webEnergy<0||m.webEnergy>100))
        throw Error("Invalid colony nutrient reserve.");
      if(m.clade!==undefined&&
         (typeof m.clade!=="string"||!/^[AB]-[a-z0-9-]{1,30}$/.test(m.clade)))
        throw Error("Invalid colony clade.");
      return {id:m.id,x:m.x,y:m.y,radius:m.radius,parent:m.parent,
        ...(m.clade!==undefined?{clade:m.clade}:{}),
        ...(m.gene!==undefined?{gene:m.gene}:{}),
        ...(m.webEnergy!==undefined?{webEnergy:m.webEnergy}:{}),
        ...(m.generation!==undefined?{generation:m.generation}:{}),
        ...(m.ancestor!==undefined?{ancestor:m.ancestor}:{}),
        ...(m.mate!==undefined?{mate:m.mate}:{})};
    });
  }
  // Historical impressions are independent of the live 16-seed limit.
  // The fossil archive is compact, validated, and saved with each document.
  if(x.fossilRecords!==undefined){
    if(!Array.isArray(x.fossilRecords)||
       x.fossilRecords.length>MAX_FOSSILS)
      throw Error("Maximum eight geological fossils.");
    const ids=new Set();
    s.fossilRecords=x.fossilRecords.map(record=>{
      if(!record||typeof record!=="object"||
         typeof record.id!=="string"||!record.id||
         record.id.length>120||ids.has(record.id)||
         typeof record.origin!=="string"||!record.origin||
         record.origin.length>80||
         !Number.isFinite(record.x)||record.x<0||record.x>1||
         !Number.isFinite(record.y)||record.y<0||record.y>1||
         !Number.isFinite(record.radius)||record.radius<.05||
         record.radius>.45||
         (record.parent!==0&&record.parent!==1)||
         !Number.isInteger(record.epoch)||record.epoch<0||
         record.epoch>4095||
         !Number.isInteger(record.gene)||record.gene<0||
         record.gene>100)
        throw Error("Invalid fossil record.");
      ids.add(record.id);
      return {id:record.id,origin:record.origin,x:record.x,y:record.y,
        radius:record.radius,parent:record.parent,epoch:record.epoch,
        gene:record.gene};
    });
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
    colorTime = input.timeline?.colorTime ?? time,
    textTime = input.timeline?.textTime ?? 0;
  if (
    !Number.isFinite(time) ||
    time < 0 ||
    time > 1e8 ||
    !Number.isFinite(colorTime) ||
    colorTime < 0 ||
    colorTime > 1e8 ||
    !Number.isFinite(textTime) ||
    textTime < 0 ||
    textTime > 1e8
  )
    throw Error("Invalid animation time.");
  return {
    state,
    title:
      typeof input.title === "string"
        ? input.title.slice(0, 100)
        : "Untitled exploration",
    timeline: { time, colorTime, textTime },
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
      "hexagramAmount","hexagramScale","hexagramWarp","hexagramMotion",
      "hexagramRelief","hexagramBorder","hexagramHue","hexagramCoupling",
      "hexagramVariation","hexagramThreshold",
      "schlierenAmount","schlierenScale","schlierenBend","schlierenMotion",
      "schlierenDispersion","schlierenRim","schlierenRipple",
      "schlierenVariation","schlierenMask","schlierenFocus","schlierenStructure","schlierenDetail","schlierenCaustics","schlierenLayerAmount","schlierenLayerAngle","schlierenLayerRatio","schlierenMaterialAmount","schlierenFilmThickness","schlierenMicrograin","schlierenPolish","schlierenTransportAmount","schlierenLightFocus","schlierenLightSharpness","schlierenOpticalShadow",
      "polesAmount","polesScale","polesWarp","polesOrbit","polesMotion",
      "polesSoftness","polesZeroPull","polesFiligree","polesGlow",
      "polesHue","polesVariation",
      ...qdControls,
      ...velvetControls,
      ...crochetControls,
      ...breedControls,
      ...g2Controls,
      ...spxControls,
      ...psControls,
      ...kdControls,
      ...vcControls,
      "tunnelTwist","tunnelDepth","tunnelRidges","tunnelPulse",
      "tunnelAperture","tunnelVariation",
      "motionAmount","motionRate","lightMotion","bioAmount","bioFeed","bioKill",
      "bioSpeed","bioVeins","wiggleAmount","wiggleDepth","wiggleSpeed","wiggleLayers",
      "stereoAmount","stereoDepth","stereoParallax",
      "stereoMorph","stereoGlow","stereoWiggle","stereoQuality",
      "filmAmount","filmThickness","opalAmount","prismAmount","foilRelief","foilMotion",
      "alchemyAmount","alchemyScale","alchemyMotion","alchemySeparation",
      "alchemySoftness","alchemyWhite","alchemyVariation",
      "injuryAmount","injuryScale","injuryMotion","injurySeparation",
      "injuryGrain","injuryGlow","injuryVariation",
      "letteringAmount","letteringScale","letteringWarp","letteringMotion",
      "compositionAmount","compositionScale","compositionFeather",
      "compositionMotion","compositionColorShift","compositionVariation",
      "backdropAmount","backdropDepth","backdropDensity","backdropMotion",
      "backdropGlow","backdropHue","backdropVariation",
      "microAmount","microScale","microMotion","microRelief",
      "microDensity","microHue","microVariation",
      "filamentAmount","filamentScale","filamentMotion","filamentDensity",
      "filamentWidth","filamentRelief","filamentHue","filamentVariation",
      "filamentFeralCorruption","filamentFeralMigration","filamentFeralOrder",
      "filamentFeralKnots","filamentFeralMutation",
      "filamentQuasiSpacing","filamentQuasiPhason","filamentQuasiDrift",
      "filamentQuasiRelief","filamentQuasiElevation","filamentQuasiOrnament",
      "semanticGravityAmount","semanticGravityRadius","semanticGravityFalloff",
      "semanticGravitySwirl","semanticGravityPulse","semanticGravityVariation",
      "filamentCrossbreed","filamentInterlace","filamentTwist","filamentPhase",
      "filamentNap","filamentLuster","filamentBeads","filamentBeadSize","filamentConstructionAmount","filamentConstructionPitch","filamentConstructionGap","filamentConstructionMotion","filamentConstructionRelief","filamentMicroloomAmount","filamentMicroloomScale","filamentMicroloomDepth","filamentMicroloomOpenwork","filamentMicroloomMotion","filamentMicroloomColor","filamentPhysicsAmount","filamentPhysicsScale","filamentPhysicsReach","filamentPhysicsSpeed","filamentPhysicsRepair","filamentPhysicsGlow","filamentChromaAmount","filamentChromaScale","filamentChromaSpread","filamentChromaSpeed","filamentChromaContrast","filamentChromaExchange","filamentEcologyAmount","filamentEcologyScale","filamentEcologyCoverage","filamentEcologySpeed","filamentEcologyRelief","filamentEcologyHue","filamentArchitectureAmount","filamentArchitectureScale","filamentArchitectureReach","filamentArchitectureOpenwork","filamentArchitectureSpeed","filamentArchitectureHue","filamentDimAmount","filamentDimProgress","filamentDimSpeed","filamentDimWarp","filamentDimFusion","filamentMetaAmount","filamentMetaFrequency","filamentMetaThickness","filamentMetaDispersion","filamentMetaMotion","filamentMetaPolish","filamentEngraveAmount","filamentEngraveScale","filamentEngraveDepth","filamentEngraveWidth","filamentEngraveMotion","filamentEngraveHue","filamentAlchAmount","filamentAlchProgress","filamentAlchSpeed","filamentAlchScale","filamentAlchGlow",
      "filamentSecondHue",
      "filamentOpticsAmount","filamentOpticsThickness","filamentOpticsDispersion",
      "filamentOpticsAnisotropy","filamentOpticsCurvature","filamentOpticsPearl","filamentOpticsPhase",
      "filamentSecondOpticsAmount","filamentSecondOpticsThickness","filamentSecondOpticsDispersion",
      "filamentSecondOpticsAnisotropy","filamentSecondOpticsCurvature",
      "filamentSecondOpticsPearl","filamentSecondOpticsPhase",
      "filamentAdornmentAmount","filamentAdornmentSpacing","filamentAdornmentSize",
      "filamentAdornmentMotion","filamentAdornmentGlow","filamentAdornmentPopulation","filamentAdornmentRhythm","filamentAdornmentFinishAmount","filamentAdornmentFilm","filamentAdornmentFacet","filamentAdornmentPolish","filamentAdornmentInteriorAmount","filamentAdornmentInteriorDensity","filamentAdornmentInteriorOpenwork","filamentAdornmentInteriorDrift","filamentAdornmentDiversity","filamentAdornmentSizeVariance","filamentAdornmentFinishVariance","filamentAdornmentAnatomyVariance",
      "filamentMorphAmount","filamentMorphScale","filamentMorphSpeed",
      "filamentMorphSharpness","filamentMorphGlow",
      "filamentContagionAmount","filamentContagionReach","filamentContagionSpeed",
      "filamentContagionLag","filamentContagionGlow",
      "filamentNeuralAmount","filamentNeuralSpeed","filamentNeuralCoupling",
      "filamentNeuralThreshold","filamentNeuralGlow",
      "filamentPlasticAmount","filamentPlasticRate","filamentPlasticInhibition",
      "filamentPlasticRetention","filamentPlasticGlow",
      "filamentScarAmount","filamentScarDensity","filamentScarPersistence",
      "filamentScarRoughness","filamentScarGlow",
      "filamentRegenAmount","filamentRegenBranches","filamentRegenSpeed",
      "filamentRegenHealing","filamentRegenGlow",
      "filamentStitchAmount","filamentStitchSpeed",
      "filamentStitchLength","filamentStitchGlow",
      "filamentChladniOrder","filamentChladniResonance","filamentChladniDensity",
      "filamentChladniPhase","filamentChladniDetune",
      "filamentRetroLead","filamentRetroEcho","filamentRetroParadox",
      "filamentRetroKnots","filamentRetroReversal","filamentRetroCoherence",
      "filamentSculptAmount","filamentSculptDepth",
      "filamentSculptLight","filamentSculptShadow","filamentSculptPuff",
      "underlayAmount","underlayScale","underlayDensity","underlayMotion",
      "underlayRelief","underlayHue","underlayContrast","underlayVariation",
      "photonAmount","photonScale","photonMotion","photonDensity",
      "photonRelief","photonHue","photonVariation",
      "substanceAmount","substanceScale","substanceMotion",
      "substanceRelief","substanceEdge","substanceHue","substanceVariation",
      "atmoAmount","atmoScale","atmoDensity","atmoMotion",
      "atmoGlow","atmoHue","atmoVariation",
      "atmoBAmount","atmoBScale","atmoBDensity","atmoBMotion",
      "atmoBGlow","atmoBHue","atmoBVariation",
      "atmoMaskScale","atmoMaskFeather","atmoMaskMotion","atmoMaskVariation",
      "habitatBrushRadius","colonyLifeAmount","colonyLifeSpeed",
      "colonyFrontGlow","colonyCompetition",
      "colonyAnatomyAmount","colonyAnatomyDetail","colonyAnatomyMotion",
      "colonyAnatomyPores","colonyAnatomyRim",
      "colonyCortexAmount","colonyCortexDetail",
      "colonyCortexMotion","colonyCortexRelief",
      "sporeAmount","sporeSpeed","sporeReach","sporeFertility","sporeGlow",
      "substrateAmount","substrateScale","substrateMotion","substratePressure",
      "substrateAffinityA","substrateAffinityB","substrateGlow","substrateHue",
      "symbiosisAmount","symbiosisDetail","symbiosisMotion",
      "symbiosisGlow","symbiosisDominance",
      "geneAmount","geneMutation","geneCrossbreed","geneGlow",
      "selectionPressure","selectionSeverity","selectionBrood","selectionGlow",
      "apocalypseAmount","apocalypseScale","apocalypseMotion",
      "apocalypsePressure","apocalypseGlow","apocalypseHue",
      "fossilAmount","fossilDepth","fossilMotion",
      "fossilGlow","fossilHue","fossilBurial",
      ...successionControls,
      ...foodWebControls,
      "saturation","contrast","brightness","colorOffset",
      "colorRepeat","colorAmount","speed","colorSpeed"];
    for(const key of nudges){
      // New behavior settings do not mutate old artwork or wake hidden modes.
      if(key.startsWith("hexagram") && state.hexagramAmount<=0)continue;
      if(key.startsWith("schlieren") && state.schlierenAmount<=0)continue;
      if(key.startsWith("poles") && state.polesAmount<=0)continue;
      if(key.startsWith("qd") && state.qdAmount<=0)continue;
      if(key.startsWith("vld") && state.vldAmount<=0)continue;
      if(key.startsWith("hcr") && state.hcrAmount<=0)continue;
      if(key.startsWith("breed") && state.breedAmount<=0)continue;
      if(key.startsWith("g2") && state.g2Amount<=0)continue;
      if(key.startsWith("spx") && state.spxAmount<=0)continue;
      if(key.startsWith("ps") && state.psAmount<=0)continue;
      if(key.startsWith("kd") && state.kdAmount<=0)continue;
      if(key.startsWith("vc") && state.vcAmount<=0)continue;
      if(key.startsWith("semanticGravity") && !hasSemanticLettering(state))continue;
      // Do not silently activate optical coats on previously saved artwork.
      if(key.startsWith("filamentOptics") && (state.filamentAmount<=0 ||
        state.filamentOpticsMode==="Off" || state.filamentOpticsAmount<=0))continue;
      if(key.startsWith("filamentSecondOptics") && (state.filamentAmount<=0 ||
        state.filamentCrossbreed<=0 || state.filamentSecondOpticsMode==="Off" ||
        state.filamentSecondOpticsAmount<=0))continue;
      if(key.startsWith("filamentQuasi") && (state.filamentAmount<=0 ||
        (state.filamentSpecies!=="Quasicrystal Brocade" &&
          !(state.filamentCrossbreed>0 && state.filamentSecondSpecies==="Quasicrystal Brocade"))))continue;
      if(key.startsWith("filamentFeral") && (state.filamentAmount<=0 ||
        (state.filamentSpecies!=="Feral Jacquard" &&
          !(state.filamentCrossbreed>0 && state.filamentSecondSpecies==="Feral Jacquard"))))continue;
      if(key.startsWith("filamentRetro") && (state.filamentAmount<=0 ||
        state.filamentStitchMode!=="Retrocausal Embroidery" ||
        state.filamentStitchAmount<=0))continue;
      if(key.startsWith("filamentChladni") && (state.filamentAmount<=0 ||
        state.filamentStitchMode!=="Chladni Needle Orchestra" ||
        state.filamentStitchAmount<=0))continue;
      if(key==="atmoBAmount" && state.atmoBAmount<=0)continue; // Never wake a hidden second parent by mutating old art.
      if(["colonyLifeAmount","colonyFrontGlow","colonyCompetition"].includes(key)
        && state.colonyLifeAmount<=0)continue; // Keep old artwork dormant.
      if(["colonyAnatomyAmount","colonyAnatomyPores","colonyAnatomyRim"].includes(key)
        && state.colonyAnatomyAmount<=0)continue; // Morph stays opt-in.
      if(key==="colonyCortexAmount"&&state.colonyCortexAmount<=0)continue; // Cortex stays dormant.
      if(key==="sporeAmount"&&state.sporeAmount<=0)continue; // Spores stay opt-in.
      if(key==="substrateAmount"&&state.substrateAmount<=0)continue; // Terrain stays dormant.
      if(key==="symbiosisAmount"&&state.symbiosisAmount<=0)continue; // Contact chemistry stays dormant.
      if(key==="geneAmount"&&state.geneAmount<=0)continue; // No spontaneous ancestry on old art.
      if(key==="selectionPressure"&&state.selectionPressure<=0)continue; // No silent Darwin on old art.
      if(key==="apocalypseAmount"&&state.apocalypseAmount<=0)continue; // Geology stays stable on old art.
      if(key==="fossilAmount"&&state.fossilAmount<=0)continue; // Burying the past remains opt-in.
      if(key==="successionAmount"&&state.successionAmount<=0)continue; // Soil memory stays opt-in.
      if(key==="foodWebAmount"&&state.foodWebAmount<=0)continue; // Food webs stay opt-in.
      const [lo,hi]=numericRanges[key];
      s[key]=clamp(state[key]+(random()-.5)*(hi-lo)*.22,lo,hi);
    }
    return protectCategorySettings(state,s);
  }
  // A full Surprise is a replacement, not a mutation. Ratio and the
  // explicitly locked engine/palette are preserved; transport stays separate.
  // Instrument explicit assignments, then randomize any new numeric sliders
  // automatically. No future feature gets accidentally left out of Surprise Me.
  const randomizedKeys = new Set();
  const s = new Proxy({...initial, ratio:state.ratio}, {
    set(target,key,value) { randomizedKeys.add(key); target[key]=value; return true; }
  });
  // Rotate to a different mathematical FAMILY, even with a fixed RNG test stub.
  const family=engineInfo[state.engine]?.family;
  const otherFamilies=engineInfo.filter(e=>e.id!==state.engine && e.family!==family);
  s.engine=locks.engine ? state.engine :
    sample(otherFamilies.length?otherFamilies:engineInfo.filter(e=>e.id!==state.engine),random).id;
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
  s.hexagramAmount=random()<.32?35+random()*65:0;
  s.schlierenMode=sample(schlierenModes,random);
  s.schlierenAmount=random()<.28?40+random()*60:0;
  if(s.schlierenAmount>0&&mathematicalGlassModes.includes(s.schlierenMode)){
    s.schlierenEtching=sample(glassEtchingModes,random);
    s.schlierenKinetics=sample(glassMotionModes,random);
    Object.assign(s,randomGlassCoupling(random),randomGlassMaterial(random),randomGlassTransport(random));
  }
  s.polesMode=sample(polesModes,random);
  s.polesAmount=random()<.34?40+random()*60:0;
  s.qdMode=sample(qdModes,random);
  s.qdOrder=sample(qdOrders,random);
  s.qdAmount=random()<.34?40+random()*60:0;
  for(const key of qdControls)if(key!=="qdAmount"){
    s[key]=key==="qdAuto"?(random()<.5?0:30+random()*70):random()*100;
  }
  s.velvetMode=sample(velvetModes,random);
  s.vldAmount=random()<.38?40+random()*60:0;
  for(const key of velvetControls)if(key!=="vldAmount")s[key]=random()*100;
  s.crochetMode=sample(crochetModes,random);
  s.hcrAmount=random()<.32?40+random()*60:0;
  for(const key of crochetControls)if(key!=="hcrAmount")s[key]=random()*100;
  s.breedMode=sample(breedModes,random);
  s.breedAmount=random()<.29?40+random()*60:0;
  for(const key of breedControls)if(key!=="breedAmount")s[key]=random()*100;
  s.g2Mode=sample(g2Modes,random);
  s.g2Amount=random()<.35?40+random()*60:0;
  for(const key of g2Controls)if(key!=="g2Amount")s[key]=random()*100;
  if(s.breedAmount>0){
    // Surprise may breed the actual shader fields, not pick a sterile
    // preset with missing parents. Only a full Surprise can wake parents.
    for(const key of breedRequiredParents(s.breedMode)){
      if(!(s[key]>0))s[key]=40+random()*55;
    }
    if(s.breedMode==="Five-Way Chimera")s.hcrQuality=Math.min(s.hcrQuality,35);
  }
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
  const ornaments=["phosphor","dither","riso","windowCascade","glitter","broadcast","topperShrapnel","topperJewel","topperIsland","topperVoronoi","topperTape","topperPortal","topperTime","topperHex","topperTri","topperKagome"];
  for(const key of ornaments)s[key]=0;
  const available=ornaments.filter(k=>k!=="topperPortal"&&k!=="topperTime");
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
  // Opt-in color sorcery: weighted to stay off in most full surprises.
  // This does not rewrite a user's palette; color movement stays in the shader.
  s.alchemyMode=different(alchemyModes,state.alchemyMode,random);
  s.alchemyAmount=random()<.38?38+random()*59:0;
  s.alchemyScale=18+random()*76;
  s.alchemyMotion=20+random()*79;
  s.alchemySeparation=32+random()*66;
  s.alchemySoftness=20+random()*78;
  s.alchemyWhite=10+random()*86;
  s.alchemyVariation=random()*100;
  s.alchemyPalette=true;
  // Animated print/spectrum injury is optional; full Surprise uses it
  // selectively instead of stacking every expensive effect.
  s.injuryMode=different(injuryModes,state.injuryMode,random);
  s.injuryAmount=random()<.36?35+random()*62:0;
  s.injuryScale=17+random()*78;
  s.injuryMotion=19+random()*80;
  s.injurySeparation=34+random()*65;
  s.injuryGrain=18+random()*80;
  s.injuryGlow=20+random()*78;
  s.injuryVariation=random()*100;
  s.injuryPalette=true;
  // Surprise Me NEVER generates a slogan. Words belong to the artist.
  s.letteringStyle=different(letteringStyles,state.letteringStyle,random);
  s.letteringBlendMode="Normal";
  s.letteringBlendStrength=100;
  s.letteringFont=different(retroFontIds,state.letteringFont,random);
  s.lettering="";
  s.letteringFormats=[];
  // Full Surprise never creates user words, therefore semantic letter gravity
  // cannot be active. Targeted semantic shuffle preserves existing words.
  s.semanticGravityMode="Off";
  s.semanticGravityAmount=0;
  s.letteringAmount=0;
  s.letteringScale=20+random()*54;
  s.letteringWarp=0;
  s.letteringMotion=15+random()*45;
  s.letteringMotionPath="Classic drift";
  s.letteringMotionPath2="None";
  s.letteringMotionMix=65;
  s.letteringMotionSpeed=1;
  s.letteringMotionStagger=10;
  s.letteringMotionDirection="Forward";
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
  s.spxMode=sample(spxModes,random);
  s.spxAmount=random()<.43?35+random()*65:0;
  for(const key of spxControls)if(key!=="spxAmount")s[key]=random()*100;
  s.psMode=sample(psModes,random);
  s.psAmount=random()<.41?38+random()*62:0;
  for(const key of psControls)if(key!=="psAmount")s[key]=random()*100;
  s.kdMode=sample(kdModes,random);
  s.kdAmount=random()<.38?39+random()*61:0;
  for(const key of kdControls)if(key!=="kdAmount")s[key]=random()*100;
  s.vcMode=sample(vcModes,random);
  s.vcAmount=random()<.50?36+random()*64:0;
  for(const key of vcControls)if(key!=="vcAmount")s[key]=random()*100;
  s.filamentSpecies=different(filamentSpecies,state.filamentSpecies,random);
  s.filamentAmount=random()<.64?39+random()*58:0;
  s.filamentScale=20+random()*78;
  s.filamentMotion=16+random()*78;
  s.filamentDensity=26+random()*72;
  s.filamentWidth=12+random()*65;
  s.filamentRelief=35+random()*64;
  s.filamentHue=random()*100;
  s.filamentVariation=random()*100;
  s.filamentSecondSpecies=different(
    filamentSpecies.filter(x=>x!==s.filamentSpecies),state.filamentSecondSpecies,random);
  s.filamentCrossbreed=s.filamentAmount>0 && random()<.56 ? 36+random()*63 : 0;
  s.filamentInterlace=32+random()*66;
  s.filamentTwist=random()*100;
  s.filamentPhase=random()*100;
  s.filamentMaterial=different(filamentMaterials,state.filamentMaterial,random);
  s.filamentSecondMaterial=different(filamentMaterials,state.filamentSecondMaterial,random);
  s.filamentNap=random()*100;
  s.filamentLuster=25+random()*74;
  s.filamentBeads=random()<.6 ? 21+random()*78 : 0;
  s.filamentBeadSize=14+random()*83;
  s.filamentArchitecture="Bare architecture";
  if(s.filamentAmount>0&&random()<.34){const architecture=remixTextileArchitecture(s,random);for(const key of textileArchitectureControls)s[key]=architecture[key];}
  s.filamentDimMode="Static architecture";
  if(s.filamentArchitecture!=="Bare architecture"&&random()<.45){const dim=remixTextileDimension(s,random);for(const key of textileDimensionControls)s[key]=dim[key];}
  s.filamentMeta="Natural scaffold";
  if(s.filamentArchitecture!=="Bare architecture"&&random()<.7){const meta=remixTextileMeta(s,random);for(const key of textileMetaControls)s[key]=meta[key];}
  s.filamentEngraveMode="Unengraved";
  if(s.filamentArchitecture!=="Bare architecture"&&random()<.60){const engraved=remixTextileEngraving(s,random);for(const key of textileEngravingControls)s[key]=engraved[key];}
  s.filamentAlchMode="Stable material";
  if(s.filamentArchitecture!=="Bare architecture"&&s.filamentMeta!=="Natural scaffold"&&random()<.48){const alch=remixTextileAlchemy(s,random);for(const key of textileAlchemyControls)s[key]=alch[key];}
  s.filamentEcology="Clean fibers";
  if(s.filamentAmount>0&&random()<.42){const ecology=remixTextileEcology(s,random);for(const key of textileEcologyControls)s[key]=ecology[key];}
  s.filamentChroma="Original pigment";
  if(s.filamentAmount>0&&random()<.55){const chroma=remixTextileChroma(s,random);for(const key of textileChromaControls)s[key]=chroma[key];}
  s.filamentPhysics="Stable threads";
  if(s.filamentAmount>0&&random()<.38){const physics=remixTextilePhysics(s,random);for(const key of textilePhysicsControls)s[key]=physics[key];}
  s.filamentMicroloom="Plain strand interior";
  if(s.filamentAmount>0&&random()<.40){const micro=remixMicroloom(s,random);for(const key of microloomControls)s[key]=micro[key];}
  s.filamentConstruction="Original strand";
  if(s.filamentAmount>0&&random()<.48){const construction=remixFiberConstruction(s,random);for(const key of fiberConstructionControls)s[key]=construction[key];}
  s.filamentSecondHue=random()*100;
  // Selectively awaken new optical fiber coats in full Surprise, only if
  // the corresponding actual geometry is present. Keep both parents independent.
  s.filamentOpticsMode=s.filamentAmount>0&&random()<.33
    ?different(structuralOpticsModes.slice(1),state.filamentOpticsMode,random):"Off";
  s.filamentOpticsAmount=s.filamentOpticsMode==="Off"?0:57+random()*42;
  s.filamentSecondOpticsMode=s.filamentCrossbreed>0&&random()<.42
    ?different(structuralOpticsModes.slice(1),state.filamentSecondOpticsMode,random):"Off";
  s.filamentSecondOpticsAmount=s.filamentSecondOpticsMode==="Off"?0:55+random()*44;
  for(const name of ["Thickness","Dispersion","Anisotropy","Curvature","Pearl","Phase"]){
    s["filamentOptics"+name]=random()*100;
    s["filamentSecondOptics"+name]=random()*100;
  }
  s.filamentAdornmentMode=different(filamentAdornmentModes,state.filamentAdornmentMode,random);
  s.filamentSecondAdornmentMode=different(filamentAdornmentModes,state.filamentSecondAdornmentMode,random);
  s.filamentAdornmentAmount=s.filamentAmount>0 && random()<.58?39+random()*59:0;
  s.filamentAdornmentSpacing=22+random()*76;
  s.filamentAdornmentSize=24+random()*75;
  s.filamentAdornmentMotion=18+random()*80;
  s.filamentAdornmentGlow=32+random()*66;
  s.filamentAdornmentColony="Uniform jewelry";
  if(s.filamentAdornmentAmount>0&&random()<.45){const colony=remixJewelryColony(s,random);for(const key of jewelryColonyControls)s[key]=colony[key];}
  s.filamentAdornmentInterior="Native ornament";
  if(s.filamentAdornmentAmount>0&&random()<.6){const interior=remixJewelryInterior(s,random);for(const key of jewelryInteriorControls)s[key]=interior[key];}
  s.filamentAdornmentFinish="Original jewelry";
  if(s.filamentAdornmentAmount>0&&random()<.7){const finish=remixJewelryFinish(s,random);for(const key of jewelryFinishControls)s[key]=finish[key];}
  s.filamentAdornmentPlacement="Original stations";s.filamentAdornmentKinetics="Original movement";
  if(s.filamentAdornmentAmount>0&&random()<.6){
    const choreo=remixJewelryChoreography(s,random);
    for(const key of ["filamentAdornmentPlacement","filamentAdornmentKinetics","filamentAdornmentPopulation","filamentAdornmentRhythm"])s[key]=choreo[key];
  }
  s.filamentMorphMode=different(filamentMorphModes,state.filamentMorphMode,random);
  s.filamentMorphTarget=different(filamentMaterials,state.filamentMorphTarget,random);
  s.filamentSecondMorphTarget=different(filamentMaterials,state.filamentSecondMorphTarget,random);
  s.filamentMorphAmount=s.filamentAmount>0 && random()<.54 ? 43+random()*56:0;
  s.filamentMorphScale=20+random()*79;
  s.filamentMorphSpeed=16+random()*81;
  s.filamentMorphSharpness=25+random()*74;
  s.filamentMorphGlow=30+random()*69;
  s.filamentContagionMode=different(filamentContagionModes,state.filamentContagionMode,random);
  s.filamentContagionAmount=s.filamentMorphAmount>0 && random()<.55?46+random()*53:0;
  s.filamentContagionReach=22+random()*77;
  s.filamentContagionSpeed=16+random()*83;
  s.filamentContagionLag=10+random()*89;
  s.filamentContagionGlow=26+random()*73;
  s.filamentNeuralMode=different(filamentNeuralModes,state.filamentNeuralMode,random);
  s.filamentNeuralAmount=s.filamentAmount>0 && random()<.58?42+random()*57:0;
  s.filamentNeuralSpeed=12+random()*87;
  s.filamentNeuralCoupling=16+random()*83;
  s.filamentNeuralThreshold=13+random()*76;
  s.filamentNeuralGlow=24+random()*75;
  s.filamentPlasticMode=different(filamentPlasticModes,state.filamentPlasticMode,random);
  s.filamentPlasticAmount=s.filamentNeuralAmount>0 && random()<.57?42+random()*57:0;
  s.filamentPlasticRate=20+random()*79;
  s.filamentPlasticInhibition=10+random()*89;
  s.filamentPlasticRetention=12+random()*87;
  s.filamentPlasticGlow=27+random()*72;
  s.filamentScarMode=different(filamentScarModes,state.filamentScarMode,random);
  s.filamentScarAmount=s.filamentNeuralAmount>0 && random()<.55?50+random()*49:0;
  s.filamentScarDensity=25+random()*74;
  s.filamentScarPersistence=22+random()*77;
  s.filamentScarRoughness=18+random()*81;
  s.filamentScarGlow=31+random()*68;
  s.filamentRegenMode=different(filamentRegenModes,state.filamentRegenMode,random);
  s.filamentRegenAmount=s.filamentScarAmount>0 && random()<.55?48+random()*51:0;
  s.filamentRegenBranches=24+random()*75;
  s.filamentRegenSpeed=17+random()*82;
  s.filamentRegenHealing=24+random()*75;
  s.filamentRegenGlow=26+random()*73;
  s.filamentStitchMode=different(filamentStitchModes,state.filamentStitchMode,random);
  s.filamentStitchAmount=s.filamentAmount>0 && random()<.58 ? 45+random()*54 : 0;
  s.filamentStitchSpeed=15+random()*84;
  s.filamentStitchLength=18+random()*80;
  s.filamentStitchGlow=25+random()*74;
  s.filamentRetroLead=random()*100;
  s.filamentRetroEcho=20+random()*80;
  s.filamentRetroParadox=random()*100;
  s.filamentRetroKnots=random()*100;
  s.filamentRetroReversal=random()*100;
  s.filamentRetroCoherence=20+random()*80;
  s.filamentSculptMode=different(filamentSculptModes,state.filamentSculptMode,random);
  s.filamentSculptAmount=s.filamentAmount>0 && random()<.59?40+random()*58:0;
  s.filamentSculptDepth=20+random()*78;
  s.filamentSculptLight=random()*100;
  s.filamentSculptShadow=20+random()*79;
  s.filamentSculptPuff=12+random()*85;
  s.underlayMode=different(underlayModes,state.underlayMode,random);
  s.underlayAmount=random()<.72?37+random()*62:0;
  s.underlayScale=22+random()*76;
  s.underlayDensity=21+random()*77;
  s.underlayMotion=16+random()*82;
  s.underlayRelief=28+random()*70;
  s.underlayHue=random()*100;
  s.underlayContrast=20+random()*79;
  s.underlayVariation=random()*100;
  s.photonSpecies=different(photonSpecies,state.photonSpecies,random);
  s.photonAmount=random()<.85?39+random()*58:0;
  s.photonScale=17+random()*79;
  s.photonMotion=20+random()*79;
  s.photonDensity=23+random()*75;
  s.photonRelief=30+random()*68;
  s.photonHue=random()*100;
  s.photonVariation=random()*100;
  s.substanceMode=different(substanceModes,state.substanceMode,random);
  s.substanceAmount=random()<.67 ? 45+random()*52 : 0;
  s.substanceScale=20+random()*77;
  s.substanceMotion=24+random()*74;
  s.substanceRelief=27+random()*70;
  s.substanceEdge=19+random()*79;
  s.substanceHue=10+random()*88;
  s.substanceVariation=random()*100;
  s.atmoMode=different(atmosphereModes,state.atmoMode,random);
  s.atmoAmount=random()<.63 ? 38+random()*61 : 0;
  s.atmoScale=20+random()*77;
  s.atmoDensity=25+random()*74;
  s.atmoMotion=21+random()*76;
  s.atmoGlow=30+random()*69;
  s.atmoHue=random()*100;
  s.atmoVariation=random()*100;
  s.atmoBMode=different(atmosphereModes,s.atmoMode,random);
  s.atmoBAmount=s.atmoAmount>0&&random()<.38?30+random()*64:0;
  s.atmoBScale=20+random()*77;
  s.atmoBDensity=25+random()*74;
  s.atmoBMotion=21+random()*76;
  s.atmoBGlow=30+random()*69;
  s.atmoBHue=random()*100;
  s.atmoBVariation=random()*100;
  s.atmoMaskMode=s.atmoAmount>0&&random()<.55
    ?sample(atmosphereHabitats.slice(1),random):"Everywhere";
  s.atmoBMaskMode=s.atmoBAmount>0&&s.atmoMaskMode!=="Everywhere"&&random()<.56
    ?"Inverse first":s.atmoBAmount>0&&random()<.6
    ?sample(atmosphereHabitats.slice(1),random):"Everywhere";
  s.atmoBBlendMode=different(atmosphereBlendModes,state.atmoBBlendMode,random);
  s.atmoMaskScale=20+random()*75;
  s.atmoMaskFeather=16+random()*74;
  s.atmoMaskMotion=18+random()*76;
  s.atmoMaskVariation=random()*100;
  // Surprise makes new artwork, not unexpected infinite GPU ecology work.
  // Life can be enabled explicitly or via a Painted Habitats Lookbook preset.
  s.colonyLifeMode="Still";
  s.colonyLifeAmount=0;
  s.colonyLifeSpeed=47;
  s.colonyFrontGlow=0;
  s.colonyCompetition=0;
  // New anatomy is randomized in the ecosystem-aware pass only, avoiding
  // dead morph sliders on ordinary non-planted Surprise artwork.
  s.colonyShapeA="Classic disks";s.colonyShapeB="Classic disks";
  s.colonyAnatomyAmount=0;s.colonyAnatomyDetail=57;
  s.colonyAnatomyMotion=47;s.colonyAnatomyPores=0;s.colonyAnatomyRim=0;
  s.colonyPoreMode="Classic pores";s.colonyPoreDensity=50;s.colonyPoreSize=50;
  s.colonyCortexA="Bare cortex";s.colonyCortexB="Bare cortex";
  s.colonyCortexAmount=0;s.colonyCortexDetail=55;
  s.colonyCortexMotion=45;s.colonyCortexRelief=50;
  s.sporeMode="Dormant";s.sporeAmount=0;
  s.sporeSpeed=57;s.sporeReach=58;s.sporeFertility=64;
  s.sporeGlow=73;s.sporeGeneration=0;s.coevoRound=0;
  s.substrateMode="Bare canvas";s.substrateAmount=0;
  s.substrateScale=55;s.substrateMotion=50;s.substratePressure=0;
  s.substrateAffinityA=90;s.substrateAffinityB=10;
  s.substrateGlow=67;s.substrateHue=48;
  s.symbiosisMode="Dormant";s.symbiosisAmount=0;
  s.symbiosisDetail=62;s.symbiosisMotion=47;
  s.symbiosisGlow=71;s.symbiosisDominance=50;
  s.geneAmount=0;s.geneMutation=57;
  s.geneCrossbreed=44;s.geneGlow=72;
  s.selectionMode="Dormant";s.selectionPressure=0;
  s.selectionSeverity=35;s.selectionBrood=58;s.selectionGlow=80;
  s.apocalypseMode="Dormant";s.apocalypseAmount=0;
  s.apocalypseScale=54;s.apocalypseMotion=58;
  s.apocalypsePressure=66;s.apocalypseGlow=85;
  s.apocalypseHue=47;s.apocalypseEpoch=0;
  s.fossilMode="Dormant";s.fossilAmount=0;
  s.fossilDepth=73;s.fossilMotion=54;
  s.fossilGlow=80;s.fossilHue=46;s.fossilBurial=58;
  s.fossilRecords=[];
  s.successionMode="Pioneer enrichment";s.successionAmount=0;
  s.successionDepth=70;s.successionSpread=58;s.successionMotion=54;
  s.successionGlow=76;s.successionHue=45;s.successionBurial=60;
  s.successionEpoch=0;s.successionRecords=[];
  s.foodWebMode="Mutualist exchange";s.foodWebAmount=0;
  s.foodWebReach=58;s.foodWebPressure=67;s.foodWebPulse=55;
  s.foodWebWidth=35;s.foodWebGlow=70;s.foodWebHue=65;s.foodWebRound=0;
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
  // Smart Surprise deliberately participates in the whole new ecology:
  // seeded Painted colonies, actual A/B territory wars and weighted growth.
  // The regular Mutate path above remains conservative and undo-friendly.
  return protectCategorySettings(state,mixEcosystemIntoSurprise({...s},random,{
    preserveColors:!!locks.color,original:state
  }));
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

  {
    name: "Schottky Candy Chapel",
    note: "Kleinian inversion lace, impossible neon boundary-work and iridescent contour loops",
    family: "Mathematical Mutants",
    state: {...initial,engine:17,palette:1,colors:palettes[1].colors,
      complexity:81,scale:21,warp:72,motionAmount:44,lightMotion:67,
      filmAmount:48,colorAmount:49,seed:639105},
  },
  {
    name: "Inversion Organism",
    note: "Fractal circle inversions breeding with living Voronoi membranes",
    family: "Mathematical Mutants",
    state: {...initial,engine:17,secondaryEngine:7,blend:58,
      blendMode:"Difference",palette:9,colors:palettes[9].colors,
      compositionMode:"Cell colonies",compositionAmount:73,
      complexity:83,scale:29,warp:84,microMode:"Opal granulation",
      microAmount:53,motionAmount:61,lightMotion:80,seed:402915},
  },
  {
    name: "Prismatic Sigil Glass",
    note: "Breathing stained-glass geometry with neon hexagons and etched geometric halos",
    family: "Mathematical Mutants",
    state: {...initial,engine:18,palette:10,colors:palettes[10].colors,
      complexity:77,scale:18,warp:67,filmAmount:62,
      prismAmount:49,opalAmount:48,colorAmount:57,
      motionAmount:49,lightMotion:88,seed:518924},
  },
  {
    name: "Hexagram Broadcast Temple",
    note: "Glowing glass sigils mixed with aperiodic fivefold diffraction",
    family: "Mathematical Mutants",
    state: {...initial,engine:18,secondaryEngine:14,blend:60,
      palette:7,colors:palettes[7].colors,complexity:73,scale:24,
      compositionMode:"Iris portals",compositionAmount:71,
      phosphor:28,prismAmount:52,motionAmount:72,seed:240182},
  },
  {
    name: "Floral Moiré Fever",
    note: "Counter-rotating RGB-petal waves in a dense kinetic optical rosette",
    family: "Mathematical Mutants",
    state: {...initial,engine:19,palette:6,colors:palettes[6].colors,
      complexity:92,scale:12,warp:79,split:22,phosphor:18,
      colorAmount:87,colorMode:"Phase vortex",motionAmount:54,
      lightMotion:92,seed:827134},
  },
  {
    name: "Birefringent DNA Garden",
    note: "Optical flower grids crossbred with Schottky fractal lace and silk filaments",
    family: "Mathematical Mutants",
    state: {...initial,engine:19,secondaryEngine:17,blend:46,
      blendMode:"Difference",palette:11,colors:palettes[11].colors,
      complexity:87,scale:19,warp:83,filamentAmount:38,
      filamentSpecies:"Fivefold brocade",filamentMotion:77,
      colorAmount:73,motionAmount:69,lightMotion:79,seed:730624},
  },
  // Five fully editable two-parent composites, derived from the artist's own
  // shader-vault references rather than image backgrounds.
  ...hybridAtmospherePresets.map((preset,i)=>{
    const {name,...atmosphere}=preset;
    const palette=[9,10,1,7,11][i];
    return {
      name,
      note:[
        "Fungal lattice trades territories with a heartbeat CRT storm",
        "CMY registration ink colonizes an opening cosmic flower",
        "Glowing capillaries thread the atmosphere inside a constrained lunar nebula",
        "Riso interference cracks into neon fungal stained glass",
        "Pulsing optical rings entwine with drifting multicolor print screens",
      ][i],
      family:"Atmospheric Hybrids",
      state:{
        ...initial,...atmosphere,
        engine:[7,8,11,3,6][i],
        palette,colors:palettes[palette].colors,
        complexity:[68,72,49,87,64][i],
        scale:[28,19,26,24,30][i],
        warp:[63,74,56,38,77][i],
        motionAmount:[63,70,47,54,62][i],
        lightMotion:[81,88,92,73,95][i],
        colorAmount:[59,78,45,64,85][i],
        seed:[348172,647913,511284,907338,225173][i],
      },
    };
  }),

  {
    name:"Fungal Territory War",
    note:"Hand-planted pink fungal colonies fight against cyan halftone invaders",
    family:"Painted Habitats",
    state:{...initial,engine:7,palette:9,colors:palettes[9].colors,
      complexity:72,scale:28,warp:66,motionAmount:59,lightMotion:87,
      atmoMode:"Prismatic mycelium",atmoAmount:92,atmoScale:55,atmoDensity:82,
      atmoMotion:72,atmoGlow:95,atmoHue:18,atmoVariation:43,
      atmoBMode:"Misprint rosette",atmoBAmount:86,atmoBScale:69,
      atmoBDensity:78,atmoBMotion:60,atmoBGlow:75,atmoBHue:83,
      atmoBVariation:56,atmoBBlendMode:"Spectral difference",
      atmoMaskMode:"Painted colonies",atmoBMaskMode:"Painted colonies",
      habitatStamps:[
        {id:"painted-war-a1",x:.21,y:.29,radius:.21,parent:0},
        {id:"painted-war-a2",x:.66,y:.74,radius:.29,parent:0},
        {id:"painted-war-a3",x:.15,y:.83,radius:.15,parent:0},
        {id:"painted-war-b1",x:.71,y:.23,radius:.20,parent:1},
        {id:"painted-war-b2",x:.29,y:.66,radius:.20,parent:1},
        {id:"painted-war-b3",x:.87,y:.87,radius:.13,parent:1},
      ],atmoMaskFeather:45,atmoMaskMotion:70,atmoMaskVariation:68,
      seed:482105},
  },
  {
    name:"Phosphor Petri Sky",
    note:"Eight celestial spore colonies pulse through an electric CRT night",
    family:"Painted Habitats",
    state:{...initial,engine:19,palette:10,colors:palettes[10].colors,
      complexity:81,scale:19,warp:51,motionAmount:45,lightMotion:89,
      atmoMode:"Heartbeat phosphor",atmoAmount:84,
      atmoScale:43,atmoDensity:83,atmoMotion:83,atmoGlow:98,
      atmoHue:60,atmoVariation:23,
      atmoBMode:"Mandala gas leak",atmoBAmount:80,atmoBScale:57,
      atmoBDensity:73,atmoBMotion:40,atmoBGlow:97,
      atmoBHue:31,atmoBVariation:86,atmoBBlendMode:"Light bloom",
      atmoMaskMode:"Painted colonies",atmoBMaskMode:"Inverse first",
      habitatStamps:[
        {id:"petri-a1",x:.17,y:.25,radius:.13,parent:0},
        {id:"petri-a2",x:.36,y:.48,radius:.18,parent:0},
        {id:"petri-a3",x:.57,y:.78,radius:.20,parent:0},
        {id:"petri-a4",x:.81,y:.33,radius:.16,parent:0},
        {id:"petri-a5",x:.79,y:.87,radius:.09,parent:0},
      ],atmoMaskFeather:31,atmoMaskMotion:67,
      atmoMaskVariation:74,seed:207914},
  },
  {
    name:"Cathedral Colonization",
    note:"Neon fungal platelets climb through separate stained-glass and gaseous chambers",
    family:"Painted Habitats",
    state:{...initial,engine:18,palette:11,colors:palettes[11].colors,
      complexity:63,scale:27,warp:57,motionAmount:48,lightMotion:92,
      atmoMode:"Prismatic mycelium",atmoAmount:90,atmoScale:73,
      atmoDensity:90,atmoMotion:39,atmoGlow:91,
      atmoHue:41,atmoVariation:79,
      atmoBMode:"Mandala gas leak",atmoBAmount:86,atmoBScale:42,
      atmoBDensity:79,atmoBMotion:72,atmoBGlow:92,
      atmoBHue:83,atmoBVariation:51,atmoBBlendMode:"Over",
      atmoMaskMode:"Painted colonies",atmoBMaskMode:"Painted colonies",
      habitatStamps:[
        {id:"cathedral-a1",x:.25,y:.24,radius:.23,parent:0},
        {id:"cathedral-a2",x:.28,y:.57,radius:.28,parent:0},
        {id:"cathedral-a3",x:.36,y:.88,radius:.16,parent:0},
        {id:"cathedral-b1",x:.73,y:.19,radius:.19,parent:1},
        {id:"cathedral-b2",x:.73,y:.54,radius:.25,parent:1},
        {id:"cathedral-b3",x:.77,y:.86,radius:.20,parent:1},
      ],atmoMaskFeather:61,atmoMaskMotion:46,
      atmoMaskVariation:40,seed:819647},
  },

  // Every colony is editable touch data, not baked art; lifecycle is just
  // deterministic time and mask geometry on the shared export renderer.
  ...colonyLifePresets.slice(0,4).map((preset,i)=>{
    const {name:ignored,...life}=preset;
    const palette=[9,11,10,1][i];
    const planted=[
      [[.22,.28,.26,0],[.57,.72,.24,0],[.82,.44,.20,0],
        [.65,.30,.22,1],[.37,.54,.21,1],[.78,.84,.16,1]],
      [[.17,.19,.13,0],[.31,.50,.21,0],[.65,.63,.22,0],
        [.83,.26,.19,0],[.54,.88,.15,0]],
      [[.21,.24,.19,0],[.31,.69,.23,0],[.69,.76,.25,0],
        [.76,.34,.20,1],[.56,.54,.22,1],[.87,.92,.12,1]],
      [[.18,.32,.18,0],[.46,.67,.25,0],[.82,.24,.21,0],
        [.27,.83,.17,1],[.69,.61,.24,1],[.85,.89,.14,1]],
    ][i].map(([x,y,radius,parent],j)=>({
      id:"colony-wars-"+i+"-"+j,x,y,radius,parent,
    }));
    return {
      name:["Fungal Border Apocalypse","Germination Cathedral",
        "Breathing Petri Quilt","Withering Neon Reef"][i],
      note:[
        "Six planted thalli wage glowing territorial war across their live boundaries",
        "Tiny colony seeds unfurl across stained-glass sigils; the nebula claims the gaps",
        "Optical organisms swell and exhale beneath a living RGB petri sky",
        "Prismatic ink colonies collapse to spores and regenerate through crystal screens",
      ][i],
      family:"Colony Wars",
      state:{
        ...initial,...life,engine:[7,18,19,11][i],
        palette,colors:palettes[palette].colors,
        complexity:[79,63,83,71][i],scale:[27,24,21,29][i],
        warp:[62,47,73,59][i],
        atmoMode:["Prismatic mycelium","Prismatic mycelium",
          "Heartbeat phosphor","Misprint rosette"][i],
        atmoBMode:["Misprint rosette","Mandala gas leak",
          "Prismatic mycelium","Prismatic mycelium"][i],
        atmoAmount:90,atmoBAmount:[90,72,75,84][i],
        atmoScale:[58,72,44,66][i],atmoBScale:[74,39,58,46][i],
        atmoDensity:88,atmoBDensity:83,atmoMotion:67,atmoBMotion:52,
        atmoGlow:88,atmoBGlow:92,atmoHue:[18,46,83,36][i],
        atmoBHue:[80,16,45,76][i],
        atmoBBlendMode:["Spectral difference","Light bloom","Over","Ink stain"][i],
        atmoMaskMode:"Painted colonies",
        atmoBMaskMode:i===1?"Inverse first":"Painted colonies",
        atmoMaskFeather:[31,57,53,48][i],
        atmoMaskMotion:[72,41,63,48][i],
        atmoMaskVariation:[51,87,23,67][i],
        motionAmount:[59,48,71,62][i],
        lightMotion:[88,94,86,92][i],
        colorAmount:[74,51,82,64][i],
        habitatStamps:planted,
        seed:[821947,503196,772381,612944][i],
      },
    };
  }),

  // Paintable morphology specimens. These are seed data plus maths,
  // not baked image assets, so every lobe, territory and palette can change.
  ...colonyAnatomyPresets.map((specimen,i)=>{
    const {name,...anatomy}=specimen;
    const seed=[637921,721883,194752,851609][i];
    const palette=[9,11,10,1][i];
    const layout=["Twin clusters","Ring","Corner islands","Diagonal invasion"][i];
    const population=generateHabitatStamps({seed},
      ()=>[.25,.38,.51,.68][i],
      {layout,count:[8,9,8,10][i],needA:true,needB:true});
    return {
      name,
      note:[
        "Scalloped lichen thalli collide with faceted crystalline petals",
        "Coral spines and slender fungal fans colonize a living phosphor reef",
        "Prismatic glass petals perforated by luminous spores and lichen plates",
        "Radiating hyphal filaments tear through energetic coral margins",
      ][i],
      family:"Mutant Anatomy",
      state:{
        ...initial,...anatomy,seed,
        engine:[18,7,19,11][i],
        palette,colors:palettes[palette].colors,
        complexity:[78,87,65,82][i],warp:[59,73,47,82][i],
        scale:[26,22,32,24][i],
        atmoMode:["Prismatic mycelium","Mandala gas leak",
          "Heartbeat phosphor","Prismatic mycelium"][i],
        atmoBMode:["Mandala gas leak","Prismatic mycelium",
          "Prismatic mycelium","Misprint rosette"][i],
        atmoAmount:88,atmoBAmount:81,
        atmoScale:[48,75,62,73][i],atmoBScale:[69,46,33,52][i],
        atmoDensity:89,atmoBDensity:81,
        atmoMotion:73,atmoBMotion:62,
        atmoGlow:91,atmoBGlow:95,
        atmoHue:[21,68,39,77][i],atmoBHue:[75,17,83,29][i],
        atmoBBlendMode:["Light bloom","Spectral difference","Over","Ink stain"][i],
        atmoMaskMode:"Painted colonies",atmoBMaskMode:"Painted colonies",
        atmoMaskFeather:[45,61,36,42][i],
        atmoMaskVariation:[74,93,51,85][i],
        atmoMaskMotion:[43,77,64,81][i],
        habitatStamps:population,
        colonyLifeMode:["Germinate & bloom","Territory war","Breathe","Wither & return"][i],
        colonyLifeAmount:[82,92,63,89][i],
        colonyLifeSpeed:[48,72,34,81][i],
        colonyFrontGlow:[81,72,62,89][i],
        colonyCompetition:i===1?84:0,
        lightMotion:[71,86,93,75][i],
        motionAmount:[57,68,51,83][i],
        colorAmount:[77,84,59,92][i],
      }
    };
  }),

  // Material worlds: actual editable, planted colonies with tissue layers
  // calculated in the same pixel path as their parent silhouettes.
  ...colonyCortexPresets.map((specimen,i)=>{
    const {name,...cortex}=specimen;
    const seed=[278145,871693,349108,729853][i];
    const palette=[9,11,10,1][i];
    const layouts=["Ring","Twin clusters","Diagonal invasion","Corner islands"];
    return {
      name,
      family:"Living Cortex",
      note:[
        "Concentric time-strata embedded in lichen sheets, rivaled by webbed fungal veins",
        "Raised-looking fruiting discs crawl across a bright membranous fungal atmosphere",
        "Vascular fungal branches twist through crystal lichen fronts and glowing borders",
        "Full microanatomical relief: growth rings, veins and apothecia-like spore cups",
      ][i],
      state:{
        ...initial,...cortex,seed,
        engine:[18,19,7,11][i],
        palette,colors:palettes[palette].colors,
        complexity:[71,88,76,93][i],scale:[33,21,27,25][i],
        warp:[62,74,59,84][i],
        atmoMode:["Prismatic mycelium","Heartbeat phosphor",
          "Prismatic mycelium","Mandala gas leak"][i],
        atmoBMode:["Mandala gas leak","Prismatic mycelium",
          "Misprint rosette","Prismatic mycelium"][i],
        atmoAmount:91,atmoBAmount:83,
        atmoScale:[61,38,74,54][i],atmoBScale:[49,73,44,79][i],
        atmoDensity:85,atmoBDensity:87,
        atmoMotion:69,atmoBMotion:61,
        atmoGlow:91,atmoBGlow:90,
        atmoHue:[17,79,36,85][i],atmoBHue:[72,30,83,44][i],
        atmoBBlendMode:["Light bloom","Over","Spectral difference","Ink stain"][i],
        atmoMaskMode:"Painted colonies",atmoBMaskMode:"Painted colonies",
        atmoMaskFeather:[34,29,51,37][i],
        atmoMaskMotion:[53,70,46,83][i],
        atmoMaskVariation:[64,39,86,73][i],
        colonyShapeA:["Lichen lobes","Coral fringe","Hyphal fans","Crystal petals"][i],
        colonyShapeB:["Hyphal fans","Crystal petals","Lichen lobes","Coral fringe"][i],
        colonyAnatomyAmount:[93,87,95,97][i],
        colonyAnatomyDetail:[68,82,76,94][i],
        colonyAnatomyMotion:[48,61,73,64][i],
        colonyAnatomyPores:[26,38,17,62][i],
        colonyAnatomyRim:[71,84,91,89][i],
        colonyLifeMode:["Germinate & bloom","Breathe",
          "Territory war","Wither & return"][i],
        colonyLifeAmount:[86,67,93,82][i],
        colonyLifeSpeed:[38,61,73,48][i],
        colonyFrontGlow:[65,78,89,75][i],
        colonyCompetition:i===2?81:0,
        habitatStamps:generateHabitatStamps({seed},
          ()=>[.22,.41,.58,.79][i],
          {layout:layouts[i],count:[9,8,10,8][i],needA:true,needB:true}),
        colorAmount:[68,84,72,91][i],
        lightMotion:[81,74,88,96][i],
      },
    };
  }),

  // Reproductive ecosystems with permanent, editable origin colonies and
  // deterministic spore trajectories. Four ready-made genetics specimens.
  ...sporePresets.map((preset,i)=>{
    const {name,...repro}=preset;
    const seed=[318471,726219,491380,852137][i];
    const palette=[9,11,10,1][i];
    return {
      name,
      note:[
        "Electric reproductive dust drifts between lichen and coral colonies",
        "Generations of spores slowly disperse over striped cortical thalli",
        "Spiral spores flee opposite populations of violet crystal petals",
        "Fruiting cups launch prismatic daughter colonies into a glowing microbial sky",
      ][i],
      family:"Spore Dynasties",
      state:{
        ...initial,...repro,seed,
        engine:[19,18,7,11][i],
        palette,colors:palettes[palette].colors,
        complexity:[79,71,84,88][i],scale:[27,30,23,28][i],
        warp:[68,54,77,69][i],
        atmoMode:["Heartbeat phosphor","Prismatic mycelium",
          "Mandala gas leak","Prismatic mycelium"][i],
        atmoBMode:["Prismatic mycelium","Mandala gas leak",
          "Prismatic mycelium","Misprint rosette"][i],
        atmoAmount:90,atmoBAmount:77,
        atmoScale:[55,67,40,72][i],atmoBScale:[75,44,70,52][i],
        atmoDensity:88,atmoBDensity:80,
        atmoMotion:72,atmoBMotion:63,
        atmoGlow:95,atmoBGlow:89,
        atmoHue:[23,77,41,87][i],atmoBHue:[71,32,78,30][i],
        atmoBBlendMode:["Light bloom","Over","Spectral difference","Ink stain"][i],
        atmoMaskMode:"Painted colonies",atmoBMaskMode:"Painted colonies",
        atmoMaskFeather:[37,46,33,55][i],
        atmoMaskMotion:[66,30,72,54][i],
        atmoMaskVariation:[64,47,83,78][i],
        colonyShapeA:["Lichen lobes","Lichen lobes","Crystal petals","Hyphal fans"][i],
        colonyShapeB:["Coral fringe","Hyphal fans","Hyphal fans","Coral fringe"][i],
        colonyAnatomyAmount:[89,93,90,86][i],
        colonyAnatomyDetail:[78,67,88,81][i],
        colonyAnatomyMotion:[56,39,75,57][i],
        colonyAnatomyPores:[26,39,31,47][i],
        colonyAnatomyRim:[84,75,93,88][i],
        colonyCortexA:["Fruiting cups","Growth bands","Hyphal veins","Living cortex"][i],
        colonyCortexB:["Living cortex","Hyphal veins","Fruiting cups","Fruiting cups"][i],
        colonyCortexAmount:[89,78,94,97][i],
        colonyCortexDetail:[68,54,86,90][i],
        colonyCortexMotion:[71,30,73,66][i],
        colonyCortexRelief:[88,65,91,96][i],
        colonyLifeMode:["Germinate & bloom","Wither & return",
          "Breathe","Territory war"][i],
        colonyLifeAmount:[87,77,66,94][i],
        colonyLifeSpeed:[75,27,63,82][i],
        colonyFrontGlow:[75,64,91,84][i],
        colonyCompetition:i===3?87:0,
        habitatStamps:generateHabitatStamps({seed},
          ()=>[.19,.38,.54,.72][i],
          {layout:["Ring","Twin clusters","Diagonal invasion","Corner islands"][i],
            count:[7,8,8,9][i],needA:true,needB:true}),
        colorAmount:[87,68,79,92][i],lightMotion:[91,80,87,95][i],
      }
    };
  }),

  // Lithobiological petri worlds: geology really shapes the planted
  // territory fronts and serves as the nutrient map for future generations.
  ...substratePresets.map((specimen,i)=>{
    const {name,...geology}=specimen;
    const seed=[382714,926051,491283,615927,738260][i];
    const palette=[9,11,10,1,9][i];
    const layouts=["Diagonal invasion","Twin clusters","Corner islands",
      "Ring","Spore field"];
    return {
      name,
      family:"Substrate Alchemy",
      note:[
        "Fissured mineral veins carry fluorescent A/B colonies into an ancient basalt world",
        "Rivers of chemical nutrients feed competing lichen organisms and reproductive pollen",
        "Crystal tesserae form faceted nutrient islands under spore-filled growing thalli",
        "Glowing acidic pools select opposing fluorescent species across a moving chemical bed",
        "The stone itself contains fossil-looking fungal veins, guiding renewed lichen reproduction",
      ][i],
      state:{
        ...initial,...geology,seed,
        engine:[18,19,7,11,17][i],
        palette,colors:palettes[palette].colors,
        complexity:[76,91,82,79,89][i],
        scale:[28,22,30,26,23][i],warp:[68,77,61,82,73][i],
        atmoMode:["Prismatic mycelium","Heartbeat phosphor",
          "Mandala gas leak","Prismatic mycelium","Misprint rosette"][i],
        atmoBMode:["Heartbeat phosphor","Prismatic mycelium",
          "Misprint rosette","Mandala gas leak","Prismatic mycelium"][i],
        atmoAmount:91,atmoBAmount:[76,88,79,87,82][i],
        atmoScale:[61,44,72,58,39][i],
        atmoBScale:[49,79,42,72,66][i],
        atmoDensity:89,atmoBDensity:82,
        atmoMotion:[54,68,48,74,62][i],
        atmoBMotion:[69,45,78,61,70][i],
        atmoGlow:93,atmoBGlow:87,
        atmoHue:[29,73,19,84,36][i],
        atmoBHue:[79,21,84,33,91][i],
        atmoBBlendMode:["Light bloom","Spectral difference",
          "Over","Ink stain","Light bloom"][i],
        atmoMaskMode:"Painted colonies",atmoBMaskMode:"Painted colonies",
        atmoMaskFeather:[33,55,38,47,39][i],
        atmoMaskVariation:[75,48,66,91,73][i],
        colonyShapeA:["Lichen lobes","Coral fringe",
          "Crystal petals","Hyphal fans","Lichen lobes"][i],
        colonyShapeB:["Hyphal fans","Lichen lobes",
          "Coral fringe","Crystal petals","Hyphal fans"][i],
        colonyAnatomyAmount:[89,95,84,97,93][i],
        colonyAnatomyDetail:[77,84,72,91,89][i],
        colonyAnatomyMotion:[40,61,43,74,57][i],
        colonyAnatomyPores:[43,29,51,30,62][i],
        colonyAnatomyRim:[89,95,82,91,85][i],
        colonyCortexA:["Growth bands","Hyphal veins",
          "Fruiting cups","Living cortex","Living cortex"][i],
        colonyCortexB:["Hyphal veins","Fruiting cups",
          "Growth bands","Growth bands","Fruiting cups"][i],
        colonyCortexAmount:[87,95,78,92,97][i],
        colonyCortexDetail:[78,85,64,91,82][i],
        colonyCortexMotion:[48,62,39,67,59][i],
        colonyCortexRelief:[84,94,79,91,88][i],
        colonyLifeMode:["Territory war","Germinate & bloom",
          "Wither & return","Territory war","Breathe"][i],
        colonyLifeAmount:[92,85,80,94,72][i],
        colonyLifeSpeed:[57,78,44,85,61][i],
        colonyCompetition:[84,0,0,87,0][i],
        colonyFrontGlow:[80,93,84,88,92][i],
        sporeMode:["Windborne","Helical drift","Burst scatter",
          "Windborne","Helical drift"][i],
        sporeAmount:[80,96,88,91,94][i],
        sporeSpeed:[36,78,67,52,81][i],
        sporeReach:[66,83,54,78,91][i],
        sporeFertility:[66,83,73,92,86][i],
        sporeGlow:[79,95,87,93,89][i],
        habitatStamps:generateHabitatStamps({seed},
          ()=>[.14,.33,.48,.62,.79][i],
          {layout:layouts[i],count:[8,9,7,8,10][i],needA:true,needB:true}),
        colorAmount:[84,91,72,88,97][i],
        lightMotion:[78,96,81,94,91][i],
      },
    };
  }),

  // Every new third-kingdom specimen starts with BOTH populated habitats
  // in actual contact. Nothing is baked: all seeds and effect genes remain
  // draggable, shuffleable, reversible and independently colorable.
  ...symbiosisPresets.map((specimen,i)=>{
    const {name,...relationship}=specimen;
    const seed=[613284,937151,275908,826441][i];
    const palette=[9,11,10,1][i];
    const originalStamps=generateHabitatStamps({seed},
      ()=>[.19,.37,.55,.73][i],
      {layout:["Twin clusters","Diagonal invasion","Ring","Corner islands"][i],
        count:[8,9,8,10][i],needA:true,needB:true});
    const living=ensureSymbioticContact({
      ...initial,...relationship,seed,
      engine:[18,19,7,11][i],palette,colors:palettes[palette].colors,
      complexity:[84,91,79,88][i],scale:[26,23,29,21][i],
      warp:[68,81,74,91][i],
      atmoMode:["Prismatic mycelium","Heartbeat phosphor",
        "Mandala gas leak","Prismatic mycelium"][i],
      atmoBMode:["Mandala gas leak","Prismatic mycelium",
        "Prismatic mycelium","Misprint rosette"][i],
      atmoAmount:92,atmoBAmount:88,
      atmoScale:[56,72,41,63][i],
      atmoBScale:[68,43,75,49][i],
      atmoDensity:87,atmoBDensity:85,atmoMotion:72,atmoBMotion:59,
      atmoGlow:93,atmoBGlow:89,
      atmoHue:[16,79,34,85][i],atmoBHue:[75,25,82,33][i],
      atmoBBlendMode:["Light bloom","Ink stain","Spectral difference","Over"][i],
      atmoMaskMode:"Painted colonies",atmoBMaskMode:"Painted colonies",
      atmoMaskFeather:[34,27,46,39][i],
      atmoMaskVariation:[67,83,94,78][i],atmoMaskMotion:[64,76,45,85][i],
      colonyShapeA:["Lichen lobes","Coral fringe","Crystal petals","Hyphal fans"][i],
      colonyShapeB:["Hyphal fans","Crystal petals","Lichen lobes","Coral fringe"][i],
      colonyAnatomyAmount:[94,97,88,95][i],
      colonyAnatomyDetail:[75,84,68,91][i],
      colonyAnatomyMotion:[48,67,54,78][i],
      colonyAnatomyPores:[28,57,39,45][i],
      colonyAnatomyRim:[93,86,96,91][i],
      colonyCortexA:["Hyphal veins","Fruiting cups","Living cortex","Growth bands"][i],
      colonyCortexB:["Living cortex","Hyphal veins","Growth bands","Fruiting cups"][i],
      colonyCortexAmount:[89,93,83,95][i],
      colonyCortexDetail:[83,79,64,91][i],
      colonyCortexMotion:[62,81,53,77][i],
      colonyCortexRelief:[88,95,84,91][i],
      colonyLifeMode:["Germinate & bloom","Territory war","Breathe","Wither & return"][i],
      colonyLifeAmount:[77,92,70,89][i],
      colonyLifeSpeed:[48,74,39,83][i],
      colonyCompetition:i===1?84:0,
      colonyFrontGlow:[77,87,73,93][i],
      substrateMode:["Nutrient rivers","Fractured basalt",
        "Quartz tesserae","Chemical tidepools"][i],
      substrateAmount:[72,84,78,91][i],
      substrateScale:[61,83,53,67][i],
      substrateMotion:[48,72,39,81][i],
      substratePressure:[41,82,69,76][i],
      substrateAffinityA:[83,95,54,23][i],
      substrateAffinityB:[21,9,87,97][i],
      substrateGlow:[73,81,94,88][i],
      substrateHue:[16,71,39,91][i],
      sporeMode:["Windborne","Burst scatter","Helical drift","Windborne"][i],
      sporeAmount:[70,89,75,82][i],
      sporeSpeed:[43,87,58,72][i],
      sporeReach:[64,81,54,73][i],
      sporeFertility:[62,81,73,91][i],
      sporeGlow:[83,94,86,91][i],
      habitatStamps:originalStamps,
      colorAmount:[81,94,84,92][i],
      lightMotion:[86,93,81,95][i],
    });
    return {
      name,
      family:"Symbiosis Lab",
      note:[
        "Interlocking lichen mycelium grows a prismatic lace membrane where two species meet",
        "Black crystalline parasites breach fluorescent coral borders across fractured basalt",
        "A third chromatic tissue emerges from two incompatible parents on quartz islands",
        "Synaptic bioelectric arcs ignite at every touching fungal-coral boundary",
      ][i],
      state:living,
    };
  }),

  // Heritable genomes are stored on INDIVIDUAL editable habitat stamps.
  // Ancient looks retain their original naked seeds and byte-identical DNA.
  ...genePresets.map((specimen,i)=>{
    const {name,...genes}=specimen;
    const seed=[327194,718026,493137,851742][i];
    const palette=[9,11,10,1][i];
    const habitatStamps=generateHabitatStamps({seed},
      ()=>[.16,.31,.52,.74][i],
      {layout:["Ring","Twin clusters","Corner islands","Diagonal invasion"][i],
        count:[8,10,9,11][i],needA:true,needB:true})
      .map((m,j)=>({...m,gene:(13+j*31+i*23)%101,generation:0}));
    return {
      name,
      family:"Mutation Bloodlines",
      note:[
        "Sibling colonies grow wildly different scalloped outlines, sharing a fluorescent ancestral gene pool",
        "A/B organisms exchange traits in chemical symbiosis and inherit spectacular pigment changes",
        "Crystalline Petri-dish lichen evolves variable edges and glowing cortical bands on mineral rock",
        "Fungal spores carry hereditary pigment and fringe variation through a living reproductive civilization",
      ][i],
      state:{
        ...initial,...genes,seed,
        engine:[18,19,7,11][i],
        palette,colors:palettes[palette].colors,
        complexity:[82,93,76,88][i],scale:[27,20,31,24][i],
        warp:[74,86,58,91][i],
        atmoMode:["Prismatic mycelium","Heartbeat phosphor",
          "Mandala gas leak","Prismatic mycelium"][i],
        atmoBMode:["Mandala gas leak","Prismatic mycelium",
          "Prismatic mycelium","Misprint rosette"][i],
        atmoAmount:93,atmoBAmount:86,
        atmoScale:[56,74,43,65][i],atmoBScale:[70,42,78,51][i],
        atmoDensity:87,atmoBDensity:88,atmoMotion:71,atmoBMotion:65,
        atmoGlow:94,atmoBGlow:91,
        atmoHue:[21,76,38,83][i],atmoBHue:[78,26,87,35][i],
        atmoBBlendMode:["Light bloom","Spectral difference",
          "Over","Ink stain"][i],
        atmoMaskMode:"Painted colonies",atmoBMaskMode:"Painted colonies",
        atmoMaskFeather:[32,38,51,43][i],
        atmoMaskVariation:[74,88,67,91][i],
        colonyShapeA:["Lichen lobes","Coral fringe","Crystal petals","Hyphal fans"][i],
        colonyShapeB:["Hyphal fans","Lichen lobes","Coral fringe","Crystal petals"][i],
        colonyAnatomyAmount:[94,99,89,96][i],
        colonyAnatomyDetail:[77,92,68,87][i],
        colonyAnatomyMotion:[57,78,41,84][i],
        colonyAnatomyPores:[31,47,52,29][i],
        colonyAnatomyRim:[83,96,92,88][i],
        colonyCortexA:["Hyphal veins","Living cortex","Growth bands","Fruiting cups"][i],
        colonyCortexB:["Growth bands","Fruiting cups","Hyphal veins","Living cortex"][i],
        colonyCortexAmount:[84,96,78,93][i],
        colonyCortexDetail:[75,89,61,87][i],
        colonyCortexMotion:[48,73,35,82][i],
        colonyCortexRelief:[85,94,78,89][i],
        colonyLifeMode:["Germinate & bloom","Territory war",
          "Breathe","Wither & return"][i],
        colonyLifeAmount:[85,92,74,90][i],
        colonyLifeSpeed:[49,76,42,81][i],
        colonyCompetition:i===1?86:0,
        colonyFrontGlow:[72,91,81,94][i],
        sporeMode:["Windborne","Helical drift","Burst scatter","Windborne"][i],
        sporeAmount:[86,93,80,91][i],
        sporeSpeed:[47,83,58,74][i],
        sporeReach:[57,76,69,84][i],
        sporeFertility:[76,88,65,94][i],
        sporeGlow:[84,97,83,96][i],
        substrateMode:["Nutrient rivers","Chemical tidepools",
          "Quartz tesserae","Petrified mycelium"][i],
        substrateAmount:[65,89,74,81][i],
        substrateScale:[58,69,81,63][i],
        substrateMotion:[39,87,42,67][i],
        substratePressure:[46,74,61,87][i],
        substrateGlow:[81,96,87,92][i],
        substrateHue:[24,81,47,91][i],
        symbiosisMode:["Mutualistic lace","Hybrid membrane",
          "Dormant","Electric synapse"][i],
        symbiosisAmount:[70,94,0,83][i],
        symbiosisDetail:[62,88,57,81][i],
        symbiosisMotion:[43,76,47,85][i],
        symbiosisGlow:[80,97,71,91][i],
        habitatStamps,
        colorAmount:[82,96,69,91][i],lightMotion:[85,96,75,91][i],
      }
    };
  }),

  // Genuine individual evolutionary fitness: alive, editable bloodlines
  // standing in resource-specific mineral environments. No automatic cull.
  ...selectionPresets.map((preset,i)=>{
    const {name,...selection}=preset;
    const seed=[581273,907162,243795,716842][i];
    const palette=[9,11,10,1][i];
    const habitatStamps=generateHabitatStamps({seed},
      ()=>[.18,.37,.54,.72][i],
      {layout:["Ring","Twin clusters","Diagonal invasion","Corner islands"][i],
        count:[10,8,9,11][i],needA:true,needB:true})
      .map((m,j)=>({...m,gene:(i*19+j*37)%101,generation:0}));
    return {
      name,
      family:"Selection Chamber",
      note:[
        "A fluorescent reef of individually adapted genes grows preferentially across winding nutrient rivers",
        "Crystalline specialist organisms compete for nutrient-rich and nutrient-poor mineral niches",
        "Opposing alleles exploit toxic mineral conditions under luminous chemical tides",
        "Crossbred midrange alleles radiate through a symbiotic third-kingdom nursery on prismatic quartz",
      ][i],
      state:{
        ...initial,...selection,seed,
        engine:[19,18,7,11][i],palette,colors:palettes[palette].colors,
        complexity:[89,75,93,84][i],scale:[24,31,21,27][i],
        warp:[79,68,87,71][i],
        atmoMode:["Prismatic mycelium","Mandala gas leak",
          "Heartbeat phosphor","Prismatic mycelium"][i],
        atmoBMode:["Heartbeat phosphor","Prismatic mycelium",
          "Misprint rosette","Mandala gas leak"][i],
        atmoAmount:94,atmoBAmount:88,
        atmoScale:[59,73,44,64][i],
        atmoBScale:[70,48,81,53][i],
        atmoDensity:87,atmoBDensity:85,
        atmoMotion:[72,49,83,61][i],atmoBMotion:[61,74,56,79][i],
        atmoGlow:92,atmoBGlow:90,
        atmoHue:[17,77,39,84][i],atmoBHue:[81,24,89,30][i],
        atmoBBlendMode:["Light bloom","Over","Ink stain","Spectral difference"][i],
        atmoMaskMode:"Painted colonies",atmoBMaskMode:"Painted colonies",
        atmoMaskFeather:[32,41,35,49][i],
        atmoMaskVariation:[71,63,89,76][i],
        colonyShapeA:["Lichen lobes","Crystal petals","Coral fringe","Hyphal fans"][i],
        colonyShapeB:["Hyphal fans","Lichen lobes","Crystal petals","Coral fringe"][i],
        colonyAnatomyAmount:[89,95,97,91][i],
        colonyAnatomyDetail:[79,84,89,75][i],
        colonyAnatomyMotion:[61,48,81,67][i],
        colonyAnatomyPores:[34,49,26,57][i],
        colonyAnatomyRim:[85,92,94,89][i],
        colonyCortexA:["Hyphal veins","Growth bands","Fruiting cups","Living cortex"][i],
        colonyCortexB:["Fruiting cups","Hyphal veins","Living cortex","Growth bands"][i],
        colonyCortexAmount:[85,91,95,92][i],
        colonyCortexDetail:[77,84,89,72][i],
        colonyCortexMotion:[58,44,81,68][i],
        colonyCortexRelief:[87,92,95,81][i],
        colonyLifeMode:["Germinate & bloom","Breathe","Territory war","Wither & return"][i],
        colonyLifeAmount:[84,70,91,78][i],
        colonyLifeSpeed:[57,69,81,41][i],
        colonyCompetition:i===2?87:0,
        colonyFrontGlow:[85,78,92,87][i],
        geneAmount:[93,88,100,97][i],
        geneMutation:[62,84,71,91][i],
        geneCrossbreed:[39,48,27,96][i],
        geneGlow:[91,86,95,100][i],
        substrateMode:["Nutrient rivers","Quartz tesserae",
          "Chemical tidepools","Petrified mycelium"][i],
        substrateAmount:[93,97,95,86][i],
        substrateScale:[58,83,69,76][i],
        substrateMotion:[59,47,84,64][i],
        substratePressure:[75,91,88,77][i],
        substrateAffinityA:[83,92,17,57][i],
        substrateAffinityB:[21,11,91,67][i],
        substrateGlow:[93,84,91,96][i],
        substrateHue:[32,66,81,21][i],
        sporeMode:["Windborne","Helical drift","Burst scatter","Windborne"][i],
        sporeAmount:[82,91,87,95][i],
        sporeSpeed:[47,73,89,62][i],
        sporeReach:[67,81,53,75][i],
        sporeFertility:[78,85,68,94][i],
        sporeGlow:[92,81,94,97][i],
        symbiosisMode:["Mutualistic lace","Dormant",
          "Parasitic rot","Hybrid membrane"][i],
        symbiosisAmount:[74,0,85,93][i],
        symbiosisDetail:[71,55,89,95][i],
        symbiosisMotion:[64,48,76,91][i],
        symbiosisGlow:[79,68,87,99][i],
        habitatStamps,
        colorAmount:[87,80,92,98][i],lightMotion:[91,78,95,89][i],
      }
    };
  }),

  // Epoch-driven ecosystems with 5 different chemical catastrophes.
  // The event changes the real mineral resource field; the individual
  // genes, spores and selection chamber respond to that same field.
  ...apocalypsePresets.map((preset,i)=>{
    const {name,...disaster}=preset;
    const seed=[630471,792638,416927,953108,274165][i];
    const palette=[9,11,10,1,9][i];
    const habitatStamps=generateHabitatStamps({seed},
      ()=>[.17,.32,.47,.61,.78][i],
      {layout:["Twin clusters","Ring","Diagonal invasion",
        "Corner islands","Spore field"][i],
        count:[8,9,10,8,11][i],needA:true,needB:true})
      .map((m,j)=>({...m,gene:(j*29+i*17+13)%101,generation:0}));
    return {
      name,
      family:"Apocalypse Clock",
      note:[
        "Frozen crystalline chemistry starves some opal-thallus colonies while luminescent specialists persist",
        "Iridescent acidic rains rewrite nutrient channels and breed corrosion-resistant fungal lace",
        "A radiant mineral solar burn creates alternating survival zones for two luminous populations",
        "Tectonic faults open mineral pathways through which altered lichen colonies and spores spread",
        "Radiation-like rings create blooming niches that favor unusual genes inside a violet fungal nursery",
      ][i],
      state:{
        ...initial,...disaster,seed,
        apocalypseEpoch:[0,2,1,3,4][i],
        engine:[19,18,7,11,17][i],
        palette,colors:palettes[palette].colors,
        complexity:[87,92,82,89,93][i],
        scale:[28,24,30,25,21][i],
        warp:[69,77,85,72,91][i],
        atmoMode:["Prismatic mycelium","Heartbeat phosphor",
          "Mandala gas leak","Prismatic mycelium","Misprint rosette"][i],
        atmoBMode:["Mandala gas leak","Prismatic mycelium",
          "Heartbeat phosphor","Misprint rosette","Prismatic mycelium"][i],
        atmoAmount:92,atmoBAmount:[76,82,79,85,77][i],
        atmoScale:[55,67,44,61,72][i],
        atmoBScale:[71,49,81,55,46][i],
        atmoDensity:85,atmoBDensity:79,
        atmoMotion:[67,78,59,81,74][i],atmoBMotion:[71,55,84,65,81][i],
        atmoGlow:93,atmoBGlow:84,
        atmoHue:[19,82,39,71,94][i],
        atmoBHue:[79,24,86,32,18][i],
        atmoBBlendMode:["Light bloom","Ink stain",
          "Spectral difference","Over","Light bloom"][i],
        atmoMaskMode:"Painted colonies",
        atmoBMaskMode:"Painted colonies",
        atmoMaskFeather:[32,44,37,51,34][i],
        atmoMaskVariation:[73,89,65,82,94][i],
        colonyShapeA:["Crystal petals","Lichen lobes",
          "Hyphal fans","Coral fringe","Lichen lobes"][i],
        colonyShapeB:["Lichen lobes","Hyphal fans",
          "Coral fringe","Crystal petals","Hyphal fans"][i],
        colonyAnatomyAmount:[94,87,90,97,91][i],
        colonyAnatomyDetail:[82,77,68,91,86][i],
        colonyAnatomyMotion:[41,71,64,80,55][i],
        colonyAnatomyPores:[49,28,57,34,61][i],
        colonyAnatomyRim:[94,87,91,85,98][i],
        colonyCortexA:["Growth bands","Fruiting cups",
          "Hyphal veins","Living cortex","Fruiting cups"][i],
        colonyCortexB:["Hyphal veins","Living cortex",
          "Fruiting cups","Growth bands","Hyphal veins"][i],
        colonyCortexAmount:[72,88,0,82,91][i],
        colonyCortexDetail:[81,73,49,92,86][i],
        colonyCortexMotion:[38,67,55,81,74][i],
        colonyCortexRelief:[84,93,75,89,95][i],
        colonyLifeMode:["Wither & return","Germinate & bloom",
          "Breathe","Territory war","Germinate & bloom"][i],
        colonyLifeAmount:[74,89,70,92,83][i],
        colonyLifeSpeed:[31,73,59,82,67][i],
        colonyCompetition:i===3?85:0,
        colonyFrontGlow:[82,94,88,91,96][i],
        sporeMode:["Dormant","Windborne","Helical drift",
          "Burst scatter","Windborne"][i],
        sporeAmount:[0,87,72,81,92][i],
        sporeSpeed:[58,73,62,90,79][i],
        sporeReach:[63,81,70,89,67][i],
        sporeFertility:[64,83,71,87,94][i],
        sporeGlow:[74,92,88,94,97][i],
        substrateMode:["Quartz tesserae","Chemical tidepools",
          "Fractured basalt","Petrified mycelium","Nutrient rivers"][i],
        substrateAmount:[97,92,95,89,98][i],
        substrateScale:[79,63,85,71,58][i],
        substrateMotion:[36,80,74,57,71][i],
        substratePressure:[89,92,88,94,83][i],
        substrateAffinityA:[85,12,89,78,39][i],
        substrateAffinityB:[14,92,23,17,94][i],
        substrateGlow:[92,85,96,91,97][i],
        substrateHue:[27,82,43,68,91][i],
        symbiosisMode:["Dormant","Parasitic rot","Dormant",
          "Electric synapse","Hybrid membrane"][i],
        symbiosisAmount:[0,76,0,84,73][i],
        symbiosisDetail:[67,83,57,91,79][i],
        symbiosisMotion:[43,78,52,87,74][i],
        symbiosisGlow:[79,88,73,95,91][i],
        geneAmount:[91,94,83,98,96][i],
        geneMutation:[69,84,62,92,81][i],
        geneCrossbreed:[31,76,43,81,95][i],
        geneGlow:[85,96,88,94,100][i],
        selectionMode:["Specialist advantage","Adversarial niche",
          "Nutrient matching","Hybrid vigor","Nutrient matching"][i],
        selectionPressure:[87,93,84,95,91][i],
        selectionSeverity:[31,44,28,39,47][i],
        selectionBrood:[61,82,58,78,91][i],
        selectionGlow:[89,92,85,95,100][i],
        habitatStamps,
        colorAmount:[88,93,84,96,99][i],
        lightMotion:[86,94,82,91,96][i],
      }
    };
  }),

  // Geological imprints from earlier epochs, with individual archived
  // genetic ancestry. All five worlds show actual archive-derived nutrient
  // changes, not just ancient-looking color palettes.
  ...fossilPresets.map((specimen,i)=>{
    const {name,...burial}=specimen;
    const seed=[384710,592816,715243,927654,263981][i];
    const palette=[9,11,10,1,9][i];
    const epoch=[3,4,2,5,6][i];
    const habitatStamps=generateHabitatStamps({seed},
      ()=>[.18,.33,.52,.68,.81][i],
      {layout:["Ring","Twin clusters","Corner islands",
        "Diagonal invasion","Spore field"][i],
        count:[9,10,8,11,12][i],needA:true,needB:true})
      .map((m,j)=>({...m,gene:(31*j+17*i+13)%101,generation:0}));
    const archive=habitatStamps.slice(0,[4,5,4,6,5][i])
      .map((m,j)=>({
        id:"relic-"+seed+"-"+j,
        origin:m.id,x:m.x,y:m.y,radius:m.radius,
        parent:m.parent,epoch:Math.max(0,epoch-1-(j%3)),
        gene:m.gene,
      }));
    return {
      name,
      family:"Fossil Record",
      note:[
        "Ancestral lichen remains enrich future mycelium through shimmering, nutrient-rich fossil plates",
        "A buried generation leaves toxic mineral scars that alter descendants' fitness and spore settlement",
        "Opalescent gene-bearing fossils preserve ancient pigment information inside fluorescent stone",
        "Ghost root systems turn two vanished fungal families into opposing fertile and barren chemical zones",
        "Alternating fossil layers reverse environmental nutrients as a new biosphere grows through geological time",
      ][i],
      state:{
        ...initial,...burial,seed,
        fossilRecords:archive,
        apocalypseEpoch:epoch,
        engine:[18,19,7,11,17][i],
        palette,colors:palettes[palette].colors,
        complexity:[85,94,82,89,97][i],
        scale:[29,22,31,24,21][i],warp:[76,91,68,83,94][i],
        atmoMode:["Prismatic mycelium","Heartbeat phosphor",
          "Mandala gas leak","Prismatic mycelium","Misprint rosette"][i],
        atmoBMode:["Mandala gas leak","Prismatic mycelium",
          "Heartbeat phosphor","Misprint rosette","Prismatic mycelium"][i],
        atmoAmount:92,atmoBAmount:[83,88,76,91,86][i],
        atmoScale:[61,75,43,69,55][i],
        atmoBScale:[78,45,81,53,73][i],
        atmoDensity:86,atmoBDensity:83,
        atmoMotion:[58,76,52,81,69][i],atmoBMotion:[71,47,84,60,77][i],
        atmoGlow:91,atmoBGlow:86,
        atmoHue:[23,79,38,84,52][i],
        atmoBHue:[79,24,86,31,89][i],
        atmoBBlendMode:["Light bloom","Ink stain","Over",
          "Spectral difference","Light bloom"][i],
        atmoMaskMode:"Painted colonies",atmoBMaskMode:"Painted colonies",
        atmoMaskFeather:[43,29,55,37,47][i],
        atmoMaskVariation:[72,89,61,95,83][i],
        colonyShapeA:["Lichen lobes","Hyphal fans",
          "Crystal petals","Coral fringe","Lichen lobes"][i],
        colonyShapeB:["Hyphal fans","Coral fringe",
          "Lichen lobes","Crystal petals","Hyphal fans"][i],
        colonyAnatomyAmount:[89,94,83,95,90][i],
        colonyAnatomyDetail:[73,92,63,86,79][i],
        colonyAnatomyMotion:[55,81,39,76,66][i],
        colonyAnatomyPores:[31,48,39,59,43][i],
        colonyAnatomyRim:[85,91,83,96,92][i],
        colonyCortexA:["Growth bands","Fruiting cups",
          "Hyphal veins","Living cortex","Growth bands"][i],
        colonyCortexB:["Hyphal veins","Living cortex",
          "Growth bands","Fruiting cups","Hyphal veins"][i],
        colonyCortexAmount:[72,82,0,87,73][i],
        colonyCortexDetail:[76,90,54,89,83][i],
        colonyCortexMotion:[45,71,39,81,59][i],
        colonyCortexRelief:[84,92,71,95,86][i],
        colonyLifeMode:["Germinate & bloom","Wither & return",
          "Breathe","Territory war","Germinate & bloom"][i],
        colonyLifeAmount:[84,91,68,89,94][i],
        colonyLifeSpeed:[57,77,43,82,65][i],
        colonyCompetition:i===3?86:0,
        colonyFrontGlow:[89,95,81,97,88][i],
        sporeMode:["Windborne","Helical drift","Dormant",
          "Burst scatter","Windborne"][i],
        sporeAmount:[75,88,0,91,84][i],
        sporeSpeed:[57,79,56,87,71][i],
        sporeReach:[72,86,58,65,91][i],
        sporeFertility:[69,85,61,92,78][i],
        sporeGlow:[83,94,78,97,91][i],
        substrateMode:["Nutrient rivers","Fractured basalt",
          "Quartz tesserae","Petrified mycelium","Chemical tidepools"][i],
        substrateAmount:[95,91,98,89,97][i],
        substrateScale:[73,85,61,76,68][i],
        substrateMotion:[54,73,42,68,82][i],
        substratePressure:[82,91,73,89,96][i],
        substrateAffinityA:[83,16,78,97,42][i],
        substrateAffinityB:[27,94,37,12,91][i],
        substrateGlow:[93,84,97,88,94][i],
        substrateHue:[28,82,43,67,94][i],
        symbiosisMode:["Mutualistic lace","Parasitic rot",
          "Dormant","Electric synapse","Hybrid membrane"][i],
        symbiosisAmount:[67,89,0,91,78][i],
        symbiosisDetail:[72,87,52,94,81][i],
        symbiosisMotion:[64,83,45,75,67][i],
        symbiosisGlow:[84,91,71,96,87][i],
        geneAmount:[89,97,84,95,93][i],
        geneMutation:[61,83,49,91,78][i],
        geneCrossbreed:[42,76,25,94,87][i],
        geneGlow:[87,96,78,94,91][i],
        selectionMode:["Nutrient matching","Adversarial niche",
          "Hybrid vigor","Specialist advantage","Nutrient matching"][i],
        selectionPressure:[85,93,76,97,89][i],
        selectionSeverity:[34,46,27,43,38][i],
        selectionBrood:[62,84,57,91,77][i],
        selectionGlow:[89,95,83,96,92][i],
        apocalypseMode:["Crystal winter","Acid monsoon",
          "Dormant","Tectonic rupture","Radiation garden"][i],
        apocalypseAmount:[70,85,0,77,91][i],
        apocalypseScale:[67,79,54,83,62][i],
        apocalypsePressure:[72,89,64,86,93][i],
        apocalypseMotion:[46,78,41,71,64][i],
        apocalypseGlow:[80,95,71,92,96][i],
        apocalypseHue:[34,83,42,68,97][i],
        habitatStamps,
        colorAmount:[86,95,79,92,97][i],
        lightMotion:[91,97,81,94,99][i],
      },
    };
  }),

];
