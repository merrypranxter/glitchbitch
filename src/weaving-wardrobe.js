// A wardrobe operates only on existing textile recipe fields.
import {initial} from "./data.js";
import {shuffleWeavingWorld} from "./weaving-randomizer.js";
export const weavingLocks=[
 ["geometry","Weave shape, scale & thickness"],
 ["hybrid","Second weave & interlacing"],
 ["fiber","Fiber materials & color"],
 ["construction","Fiber construction"],
 ["microloom","Recursive microloom"],
 ["physics","Impossible textile physics"],
 ["chroma","Chromatic weaving"],
 ["jewelry","Jewelry & ornaments"],
 ["optics","Structural-color coats"],
 ["motion","Stitch animation & needle laws"],
 ["relief","Sculpted relief"],
 ["living","Living thread behaviors"],
 ["ground","Woven fabric ground"],
 ["velvet","Living velvet"],
 ["crochet","Hyperbolic crochet"],
 ["semantic","Text-driven weaving"],
 ["presence","Thread visibility"],
].map(([id,label])=>({id,label}));
export function textileGroup(key){
 if(key==="filamentAmount")return "presence";
 if(key.startsWith("filamentConstruction"))return "construction";
 if(key.startsWith("filamentMicroloom"))return "microloom";
 if(key.startsWith("filamentPhysics"))return "physics";
 if(key.startsWith("filamentChroma"))return "chroma";
 if(key.startsWith("semanticGravity"))return "semantic";
 if(key.startsWith("underlay"))return "ground";
 if(key==="velvetMode"||key.startsWith("vld"))return "velvet";
 if(key==="crochetMode"||key.startsWith("hcr"))return "crochet";
 if(/^filament(SecondOptics|Optics)/.test(key))return "optics";
 if(/^filament(SecondAdornment|Adornment)/.test(key))return "jewelry";
 if(/^filament(Stitch|Chladni|Retro)/.test(key)||key==="filamentMotion")return "motion";
 if(key.startsWith("filamentSculpt")||key==="filamentRelief")return "relief";
 if(/^filament(Morph|SecondMorph|Contagion|Neural|Plastic|Scar|Regen)/.test(key))return "living";
 if(["filamentSecondSpecies","filamentCrossbreed","filamentInterlace","filamentTwist","filamentPhase"].includes(key))return "hybrid";
 if(/^filament(Material|SecondMaterial|Nap|Luster|Beads|BeadSize|Hue|SecondHue)$/.test(key))return "fiber";
 if(/^filament(Species|Scale|Density|Width|Variation|Feral.*|Quasi.*)$/.test(key))return "geometry";
 return null;
}
export function protectWeaving(state,candidate,locks=[]){
 const next={...state};
 for(const key of Object.keys(initial)){
   const group=textileGroup(key);
   if(group&&!locks.includes(group)&&Object.hasOwn(candidate,key))next[key]=candidate[key];
 }
 return next;
}
const baseline={filamentAmount:94,filamentScale:57,filamentDensity:67,filamentWidth:39,
 filamentRelief:80,filamentMotion:65,filamentLuster:86,filamentNap:18,
 filamentStitchAmount:82,filamentStitchSpeed:66,filamentStitchLength:66,
 filamentAdornmentAmount:82,filamentAdornmentSize:52,filamentAdornmentGlow:68,
 filamentSculptAmount:68,filamentSculptDepth:64,filamentOpticsAmount:77,
 filamentOpticsThickness:62,filamentOpticsDispersion:76};
const rows=[
 ["Alien bridal couture","Bobbin lace","Opaline glass","Pearl stations","Purl breathing","Pearlescent floss","Raised satin",{filamentWidth:27,filamentDensity:83,filamentBeads:38},"Delicate open lace with luminous pearl jewelry."],
 ["Forbidden disco brocade","Quasicrystal Brocade","Metallic tinsel","Sequin chain","Hologram darning","Diffraction grating","Gilded repoussé",{filamentQuasiOrnament:90,filamentOpticsDispersion:98,filamentSecondSpecies:"Fivefold brocade",filamentCrossbreed:64,filamentSecondMaterial:"Iridescent silk"},"Five-direction embroidery and bright spectral sequins."],
 ["Cathedral of glass bugs","Voronoi lace","Opaline glass","Glass bugles","Chladni Needle Orchestra","Soap-film opal","Beaded emboss",{filamentChladniDensity:81,filamentAdornmentSpacing:75,filamentScale:69},"Geometric glass beadwork arranged by animated resonant needle patterns."],
 ["Mercury macramé","Macramé diamonds","Molten chrome","Orbiting halos","Cable knit","Anisotropic chrome","Chased metal",{filamentWidth:57,filamentLuster:98,filamentAdornmentSize:38},"Metallic knotwork with moving reflective collars."],
 ["Haunted grandma's quilt","Basket twill","Chenille plush","French knots","Chain stitch","Off","Trapunto quilting",{filamentOpticsAmount:0,filamentNap:89,filamentSculptDepth:89,underlayMode:"Ghost quilt",underlayAmount:61},"Soft raised quilting on a ghostly woven ground."],
 ["Neon nervous system","Nerve net","Gelatin nerve cord","Electric thorns","Synaptic firing","Bioluminescent nacre","Alien scar tissue",{filamentNeuralMode:"Nerve storm",filamentNeuralAmount:81,filamentScarMode:"Lichtenberg burn",filamentScarAmount:68,filamentRegenMode:"Forked nerve shoots",filamentRegenAmount:65},"Living electrical embroidery with scar and repair patterns."],
 ["Mushroom seamstress","Mycelial veinwork","Bioluminescent mycelium","Mycelium spores","Fractal infestation","Bioluminescent nacre","Fossil stitching",{filamentMorphMode:"Fungal takeover",filamentMorphTarget:"Pearl embroidery floss",filamentMorphAmount:72,filamentNap:54,underlayMode:"Cellular gauze",underlayAmount:48},"Spore-covered evolving threads and fibrous cellular ground."],
 ["Time-traveling tapestry","Feral Jacquard","Fiber-optic rainbow","Neon teeth","Retrocausal Embroidery","Holographic organza","Carved appliqué",{filamentFeralCorruption:76,filamentFeralMigration:80,filamentRetroParadox:79,filamentRetroEcho:83,filamentMotion:90},"Mutating warp and weft with time-displaced sewing."],
 ["Opal witch's loom","Poincaré crochet","Iridescent silk","Opal barnacles","Wormhole crochet","Quantum mother-of-pearl","Melted jewelry",{filamentSecondSpecies:"Möbius cable",filamentSecondMaterial:"Oil-slick latex",filamentCrossbreed:69,filamentSecondOpticsMode:"Soap-film opal",filamentSecondOpticsAmount:70},"Hybrid hyperbolic knotwork with pearlescent optical coats."],
 ["Quiet heirloom","Chevron herringbone","Mercerized cotton","Lace picots","Running stitch","Off","Raised satin",{filamentAmount:62,filamentOpticsAmount:0,filamentAdornmentAmount:45,filamentSculptAmount:35,filamentStitchAmount:50,filamentMotion:35},"A restrained textile layer with room for the underlying art."],
];
export const weavingWardrobe=rows.map(([name,geometry,fiber,jewelry,motion,optics,relief,extra,note])=>({name,note,settings:{...baseline,
 filamentSpecies:geometry,filamentMaterial:fiber,filamentAdornmentMode:jewelry,
 filamentStitchMode:motion,filamentOpticsMode:optics,filamentSculptMode:relief,...extra}}));
export function applyWeavingWardrobe(state,name,locks=[]){
 const specimen=weavingWardrobe.find(p=>p.name===name);
 return specimen?protectWeaving(state,{...initial,...specimen.settings},locks):state;
}
export function remixWeavingWardrobe(state,rng=Math.random,{locks=[],...options}={}){
 if(weavingLocks.every(g=>locks.includes(g.id)))return state;
 const n=Number(rng());const u=Number.isFinite(n)?Math.max(0,Math.min(1-Number.EPSILON,n)):0;
 return applyWeavingWardrobe(state,weavingWardrobe[Math.floor(u*weavingWardrobe.length)].name,locks);
}
export function shuffleLockedWeaving(state,rng=Math.random,options={}){
 return protectWeaving(state,shuffleWeavingWorld(state,rng,options),options.locks||[]);
}
