// Weaving workspace: compose existing, recipe-safe textile helpers only.
// No full-art randomization, new shaders, seed changes or ecological mutations.
import * as F from "./filament-forge.js";
import {remixStructuralOptics} from "./structural-thread-optics.js";
import {remixUnderlay} from "./living-underlay.js";
import {shuffleVelvet,shuffleCrochet} from "./living-textiles-wave5.js";
import {remixSemanticGravity,hasSemanticLettering} from "./semantic-gravity.js";
const unit=rng=>{const n=Number(rng());return Number.isFinite(n)?Math.max(0,Math.min(1-Number.EPSILON,n)):0;};
const pick=(xs,rng)=>xs[Math.floor(unit(rng)*xs.length)];
const roll=(p,rng)=>unit(rng)<p;
const range=(lo,hi,rng)=>lo+(hi-lo)*unit(rng);
const visible=s=>({...s,filamentAmount:Math.max(65,s.filamentAmount||0)});
export const weavingRemixGroups=[
 {id:"weave",label:"Weave geometry & scale",note:"Pattern, thickness, density and geometry-specific controls; keeps the thread wardrobe."},
 {id:"dress",label:"Dress the threads",note:"Fiber materials, beads, nap, sheen and thread jewelry together."},
 {id:"surface-engraving",label:"Surface engraving only",note:"Etch existing scaffold without changing architecture or material."},
 {id:"material-alchemy",label:"Material alchemy only",note:"Change material transition law and destination; requires a visible optical scaffold."},
 {id:"metamaterials",label:"Optical metamaterials only",note:"Change light behavior on the architecture; requires a visible scaffold."},
 {id:"dimension",label:"Dimensional metamorphosis only",note:"Change transition laws and destination geometry; requires a visible scaffold."},
 {id:"architecture",label:"Parasitic architecture only",note:"Change projected mineral and microbial structures around the threads."},
 {id:"surface-ecology",label:"Textile surface ecology only",note:"Change the microscopic organisms and deposits attached to the fabric."},
 {id:"chroma",label:"Chromatic weaving only",note:"Change traveling color bands and pigment behavior without replacing the palette."},
 {id:"physics",label:"Impossible textile physics only",note:"Animate splitting, fraying, unzipping and rejoining the thread carrier."},
 {id:"microloom",label:"Recursive microloom only",note:"Weave smaller fabric patterns inside existing strands, without changing their outline or wardrobe."},
 {id:"construction",label:"Fiber construction only",note:"Change the projected internal braid, cable or strand cross-section."},
 {id:"fiber",label:"Fiber materials only",note:"Change the yarn without changing its jewelry or stitch motion."},
 {id:"jewelry",label:"Jewelry & ornament only",note:"Decorate existing thread paths."},
 {id:"jewel-colony",label:"Mixed charm populations only",note:"Change station-by-station diversity in shape, size, finish and anatomy."},
 {id:"jewel-interior",label:"Ornament microarchitecture only",note:"Change tiny internal perforations, ribs and engraved patterns without changing the jewelry shape or yarn."},
 {id:"finish",label:"Jewelry optical finish only",note:"Change ornament materials and optical coatings without changing the yarn, shape or motion."},
 {id:"choreography",label:"Jewelry choreography only",note:"Redistribute and animate the current ornaments without changing their shapes."},
 {id:"optics",label:"Structural-color coats",note:"Thin-film and iridescent fiber optics."},
 {id:"stitch",label:"Stitch motion & needle laws",note:"Animated sewing, including the Chladni and retrocausal systems."},
 {id:"relief",label:"Sculpted thread relief",note:"Puffy, engraved or embossed-looking stitches."},
 {id:"hybrid",label:"Second weave / crossbreed",note:"Introduce a different second pattern, retaining the first."},
 {id:"living",label:"Living thread behavior",note:"Metamorphosis, contagion, neural activity, plasticity, scars or regeneration; required parent effects activate."},
 {id:"ground",label:"Woven fabric ground",note:"Change the fabric underneath your threads."},
 {id:"velvet",label:"Living velvet damask",note:"Shuffle only the independent velvet layer."},
 {id:"crochet",label:"Hyperbolic crochet & lace",note:"Shuffle only fractal crochet; conservative raymarch quality."},
 {id:"semantic",label:"Semantic gravity",note:"Let your existing visible text bend the weave; no words are generated."},
];
function textVisible(s){return hasSemanticLettering({...s,filamentAmount:1,semanticGravityMode:"Attract",semanticGravityAmount:1});}
function weave(s,rng){
 let next=F.nextFilamentSpecies(s,rng);
 if(next.filamentSpecies==="Feral Jacquard")next=F.remixFeralJacquard(next,rng);
 if(next.filamentSpecies==="Quasicrystal Brocade")next=F.remixQuasicrystalBrocade(next,rng);
 return {...next,filamentScale:range(22,88,rng),filamentDensity:range(35,92,rng),filamentWidth:range(18,78,rng),filamentVariation:range(0,100,rng)};
}
function stitch(s,rng){
 let next=F.remixFilamentStitchMotion(s,rng);
 if(next.filamentStitchMode==="Chladni Needle Orchestra")next=F.remixChladniNeedles(next,rng);
 if(next.filamentStitchMode==="Retrocausal Embroidery")next=F.remixRetrocausalEmbroidery(next,rng);
 return {...next,filamentMotion:range(40,98,rng)};
}
const livingFns=[F.remixFilamentMorph,F.remixFilamentContagion,F.remixFilamentNeural,F.remixFilamentPlastic,F.remixFilamentScars,F.remixFilamentRegeneration];
export function weavingRemixDisabled(s,id){return id==="semantic"&&!textVisible(s)?"Add visible text first.":"";}
export function remixWeavingSystem(state,id,rng=Math.random){
 switch(id){
 case "weave":return weave(state,rng);
 case "dress":return {...F.remixJewelryInterior(F.remixJewelryFinish(F.remixThreadCouture(state,rng),rng),rng),filamentBeadSize:range(15,95,rng),filamentSecondHue:range(0,100,rng)};
 case "surface-engraving":return F.remixTextileEngraving(state,rng);
 case "material-alchemy":return F.remixTextileAlchemy(state,rng);
 case "metamaterials":return F.remixTextileMeta(state,rng);
 case "dimension":return F.remixTextileDimension(state,rng);
 case "architecture":return F.remixTextileArchitecture(state,rng);
 case "surface-ecology":return F.remixTextileEcology(state,rng);
 case "chroma":return F.remixTextileChroma(state,rng);
 case "physics":return F.remixTextilePhysics(state,rng);
 case "microloom":return F.remixMicroloom(state,rng);
 case "construction":return F.remixFiberConstruction(state,rng);
 case "fiber":return {...F.remixFilamentMaterials(state,rng),filamentBeadSize:range(15,95,rng),filamentSecondHue:range(0,100,rng)};
 case "jewelry":return F.remixJewelryColony(F.remixJewelryInterior(F.remixJewelryFinish(F.remixJewelryChoreography(F.remixFilamentAdornments(state,rng),rng),rng),rng),rng);
 case "jewel-interior":return F.remixJewelryInterior(state,rng);
 case "jewel-colony":return F.remixJewelryColony(state,rng);
 case "finish":return F.remixJewelryFinish(state,rng);
 case "choreography":return F.remixJewelryChoreography(state,rng);
 case "optics":return remixStructuralOptics(state,rng);
 case "stitch":return stitch(state,rng);
 case "relief":return F.remixFilamentSculpt(state,rng);
 case "hybrid":return {...F.breedFilaments(state,rng),filamentSpecies:state.filamentSpecies,filamentSecondSpecies:pick(F.filamentSpecies.filter(x=>x!==state.filamentSpecies),rng)};
 case "living":return pick(livingFns,rng)(state,rng);
 case "ground":return remixUnderlay(state,rng);
 case "velvet":return shuffleVelvet(state,rng);
 case "crochet":{const next=shuffleCrochet(state,rng);return {...next,hcrQuality:Math.min(48,next.hcrQuality)};}
 case "semantic":return textVisible(state)?remixSemanticGravity(state,rng):state;
 default:return state;
 }
}
const optionalAmounts=["filamentMorphAmount","filamentContagionAmount","filamentNeuralAmount","filamentPlasticAmount","filamentScarAmount","filamentRegenAmount","filamentOpticsAmount","filamentSecondOpticsAmount","filamentSculptAmount","filamentStitchAmount","filamentAdornmentAmount","semanticGravityAmount","underlayAmount","vldAmount","hcrAmount"];
export function shuffleWeavingWorld(state,rng=Math.random,{intensity="Wild",allowHybrid=true,allowHeavy=false}={}){
 const p=intensity==="Gentle"?.28:intensity==="Balanced"?.55:.82;
 // Reset only textile layer presences, then rebuild a coherent wardrobe.
 let s={...state};for(const key of optionalAmounts)s[key]=0;
 s=weave(s,rng);
 s={...s,filamentAmount:range(76,100,rng),filamentRelief:range(40,96,rng),filamentHue:range(0,100,rng),filamentCrossbreed:0};
 if(allowHybrid&&roll(p,rng))s=remixWeavingSystem(s,"hybrid",rng);
 if(s.filamentSecondSpecies==="Feral Jacquard"&&s.filamentCrossbreed>0){const a=s.filamentSpecies;s={...F.remixFeralJacquard(s,rng),filamentSpecies:a};}
 if(s.filamentSecondSpecies==="Quasicrystal Brocade"&&s.filamentCrossbreed>0){const a=s.filamentSpecies;s={...F.remixQuasicrystalBrocade(s,rng),filamentSpecies:a};}
 s=remixWeavingSystem(s,"dress",rng);
 if(roll(p*.48,rng))s=F.remixTextileArchitecture(s,rng);
 else s={...s,filamentArchitecture:"Bare architecture"};
 if(s.filamentArchitecture!=="Bare architecture"&&roll(p*.55,rng))s=F.remixTextileDimension(s,rng);
 else s={...s,filamentDimMode:"Static architecture"};
 if(s.filamentArchitecture!=="Bare architecture"&&roll(p*.85,rng))s=F.remixTextileMeta(s,rng);
 else s={...s,filamentMeta:"Natural scaffold"};
 if(s.filamentArchitecture!=="Bare architecture"&&roll(p*.85,rng))s=F.remixTextileEngraving(s,rng);
 else s={...s,filamentEngraveMode:"Unengraved"};
 if(s.filamentMeta!=="Natural scaffold"&&roll(p*.65,rng))s=F.remixTextileAlchemy(s,rng);
 else s={...s,filamentAlchMode:"Stable material"};
 if(roll(p*.62,rng))s=F.remixTextileEcology(s,rng);
 else s={...s,filamentEcology:"Clean fibers"};
 if(roll(p*.75,rng))s=F.remixTextileChroma(s,rng);
 else s={...s,filamentChroma:"Original pigment"};
 if(roll(p*.55,rng))s=F.remixTextilePhysics(s,rng);
 else s={...s,filamentPhysics:"Stable threads"};
 if(roll(p*.6,rng))s=F.remixMicroloom(s,rng);
 else s={...s,filamentMicroloom:"Plain strand interior"};
 if(roll(p*.7,rng))s=F.remixFiberConstruction(s,rng);
 else s={...s,filamentConstruction:"Original strand"};
 if(roll(p*.65,rng))s=F.remixJewelryColony(s,rng);
 else s={...s,filamentAdornmentColony:"Uniform jewelry"};
 if(!roll(p,rng))s={...s,filamentAdornmentInterior:"Native ornament"};
 if(roll(p,rng))s=F.remixJewelryFinish(s,rng);
 else s={...s,filamentAdornmentFinish:"Original jewelry"};
 if(roll(p,rng))s=F.remixJewelryChoreography(s,rng);
 else s={...s,filamentAdornmentPlacement:"Original stations",filamentAdornmentKinetics:"Original movement"};
 s=stitch(s,rng);
 if(roll(p,rng))s=remixStructuralOptics(s,rng);
 if(roll(p,rng))s=F.remixFilamentSculpt(s,rng);
 if(roll(p,rng))s=remixUnderlay(s,rng);
 // The optional living families have real shader dependencies. Existing
 // helpers activate their prerequisites; don't blindly enable every branch.
 if(roll(p,rng))s=remixWeavingSystem(s,"living",rng);
 if(allowHeavy){
   s=F.remixFilamentContagion(s,rng);
   s=F.remixFilamentPlastic(s,rng);
   s=F.remixFilamentRegeneration(s,rng);
   s=remixStructuralOptics(s,rng);
   s=F.remixFilamentSculpt(s,rng);
   s=remixUnderlay(s,rng);
   s=shuffleVelvet(s,rng);
   s=remixWeavingSystem(s,"crochet",rng);
 }else if(roll(p*.55,rng))s=remixWeavingSystem(s,pick(["velvet","crochet"],rng),rng);
 if(textVisible(s)&&roll(p*.45,rng))s=remixSemanticGravity(s,rng);
 if(!s.filamentCrossbreed)s.filamentSecondOpticsAmount=0;
 return visible(s);
}
