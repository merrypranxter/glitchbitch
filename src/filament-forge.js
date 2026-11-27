/**
 * FILAMENT FORGE — sixteen procedural filament geometries.
 * True lines, stitches and crossings rather than a color/screen overlay.
 * All species run in WebGL 1.0 / WebGL2 fragment GLSL; they are selected
 * at program compile so inactive geometry does not burden iPhone GPUs.
 */
export const filamentSpecies = [
  "Fivefold brocade",
  "Poincaré crochet",
  "Truchet knotwork",
  "Voronoi lace",
  "Spiral appliqué",
  "Fractal veinwork",
  "Alien lattice",
  "Alien scriptwork",
  "Glyph swarm",
  "Xeno filament",
  "Capillary bloom",
  "Mycelial veinwork",
  "Lightning lace",
  "Root filigree",
  "Coral vasculature",
  "Nerve net",
  "Basket twill",
  "Chevron herringbone",
  "Macramé diamonds",
  "Bobbin lace",
  "Möbius cable",
  "Parasitic ladder",
  "Feral Jacquard",
  "Quasicrystal Brocade",
];

// Named families are UI/grouping metadata, never GPU or saved-state data.
// Every species remains valid as a primary or secondary parent in hybrids.
export const filamentSpeciesFamilies=[
  {name:"Original mathematical lace",species:filamentSpecies.slice(0,5)},
  {name:"Living veins & neural structures",species:[
    "Fractal veinwork","Capillary bloom","Mycelial veinwork",
    "Lightning lace","Root filigree","Coral vasculature","Nerve net"]},
  {name:"Alien inscriptions & nonhuman ornaments",species:[
    "Alien lattice","Alien scriptwork","Glyph swarm","Xeno filament"]},
  {name:"Traditional woven cloth & lace",species:filamentSpecies.slice(16,20)},
  {name:"Impossible and parasitic textiles",species:filamentSpecies.slice(20)},
];
export const xenoVascularSpecies=[...filamentSpecies.slice(6,16),...filamentSpecies.slice(20)];
export const freshFilamentSpecies=filamentSpecies.slice(16);
export function remixFreshFilaments(state,rng=Math.random){
  const pool=freshFilamentSpecies.filter(name=>name!==state.filamentSpecies);
  const value=Number(rng());
  const n=Number.isFinite(value)?Math.min(.999999,Math.max(0,value)):0;
  return {...state,filamentSpecies:pool[Math.floor(n*pool.length)],
    filamentAmount:Math.max(70,state.filamentAmount||0),
    filamentScale:35+n*55,filamentDensity:55+n*42,
    filamentMotion:30+n*68};
}


// Ship just the selected structural branches to the iPhone GPU.
// Even in a hybrid, no more than two species paths are needed.
export function specializeFilamentGeometry(source,first,second=null){
  const ids=[first,...(second==null?[]:[second])];
  if(!ids.length||ids.some(n=>!Number.isInteger(n)||n<0||n>=filamentSpecies.length))
    return source;
  const chosen=[...new Set(ids)].sort((a,b)=>a-b);
  const opening=id=>id===0?"  if(species==0){":
    "  }else if(species=="+id+"){";
  const starts=filamentSpecies.map((_,id)=>source.indexOf(opening(id)));
  if(starts.some((pos,id)=>pos<0||(id>0&&pos<=starts[id-1])))return source;
  const fallback=source.indexOf(
    "  }else{\n    // The branch is intentionally unreachable",starts[starts.length-1]);
  const geometryEnd=source.indexOf("  // Signed-distance-like threads:",fallback);
  if(fallback<0||geometryEnd<=fallback)return source;
  const branches=chosen.map((id,k)=>{
    const end=id===starts.length-1?fallback:starts[id+1];
    const body=source.slice(starts[id]+opening(id).length,end);
    return (k===0?"  if(species=="+id+"){":
      "  }else if(species=="+id+"){")+body;
  }).join("");
  return source.slice(0,starts[0])+branches+
    source.slice(fallback,geometryEnd)+source.slice(geometryEnd);
}

/** Keep iPhone shaders lean: compile only the actually dressed fiber(s).
 * The Original thread (index 0) does not require a material branch.
 * Works for solo and hybrid fabrics without introducing new uniforms.
 */
export function specializeFilamentMaterials(source,first,second=null){
  if(first==null||!Number.isInteger(first)||first<0||
    first>=filamentMaterials.length)return source;
  const ids=[first,...(second==null?[]:[second])];
  if(ids.some(i=>!Number.isInteger(i)||i<0||i>=filamentMaterials.length))
    return source;
  const opener=n=>n===1?"  if(fiberMaterial==1){":
    "  }else if(fiberMaterial=="+n+"){";
  const starts=filamentMaterials.slice(1).map((_,k)=>source.indexOf(opener(k+1)));
  if(starts.some((pos,n)=>pos<0||(n>0&&pos<=starts[n-1])))return source;
  const end=source.indexOf("  // Edge nap is geometric:",starts[starts.length-1]);
  if(end<0)return source;
  const close=source.lastIndexOf("  }\n",end);
  if(close<starts[starts.length-1])return source;
  const chosen=[...new Set(ids.filter(i=>i>0))].sort((a,b)=>a-b);
  const replacements=chosen.map((id,k)=>{
    const endOfBranch=id===filamentMaterials.length-1?close:starts[id];
    const body=source.slice(starts[id-1]+opener(id).length,endOfBranch);
    return (k===0?"  if(fiberMaterial=="+id+"){":
      "  }else if(fiberMaterial=="+id+"){")+body;
  }).join("");
  return source.slice(0,starts[0])+replacements+
    (chosen.length?"  }\n":"")+source.slice(end);
}

export function remixXenoVascular(state,rng=Math.random){
  const safe=()=>{const x=Number(rng());return Number.isFinite(x)?
    Math.max(0,Math.min(1-Number.EPSILON,x)):0;};
  const candidates=xenoVascularSpecies.filter(x=>x!==state.filamentSpecies);
  const list=candidates.length?candidates:xenoVascularSpecies;
  const species=list[Math.floor(safe()*list.length)];
  return {...state,filamentSpecies:species,
    filamentAmount:Math.max(73,state.filamentAmount||0),
    filamentScale:30+Math.floor(safe()*61),
    filamentDensity:48+Math.floor(safe()*49),
    filamentMotion:36+Math.floor(safe()*65),
    filamentWidth:12+Math.floor(safe()*39),
    filamentRelief:59+Math.floor(safe()*42),
    filamentHue:Math.floor(safe()*101),
    filamentVariation:Math.floor(safe()*101)};
}

export const filamentMaterials = [
  "Original thread",
  "Iridescent silk",
  "Molten chrome",
  "Opaline glass",
  "Velvet flock",
  "Electroluminescent yarn",
  "Mercerized cotton",
  "Metallic tinsel",
  "Chenille plush",
  "Pearl embroidery floss",
  "Fiber-optic rainbow",
  "Gelatin nerve cord",
  "Oil-slick latex",
  "Bioluminescent mycelium",
];
export const unusualFilamentMaterials=filamentMaterials.slice(10);
export function remixUnusualFilamentMaterials(state,rng=Math.random){
  const unit=()=>{const x=Number(rng());return Number.isFinite(x)?
    Math.min(.999999,Math.max(0,x)):0;};
  const take=old=>{const p=unusualFilamentMaterials.filter(x=>x!==old);
    return p[Math.floor(unit()*p.length)];};
  return {...state,filamentAmount:Math.max(65,state.filamentAmount||0),
    filamentMaterial:take(state.filamentMaterial),
    filamentSecondMaterial:take(state.filamentSecondMaterial),
    filamentNap:15+unit()*82,filamentLuster:38+unit()*62,
    filamentBeads:unit()*75};
}


// Projected thread-local construction; not a literal 3D yarn mesh.
// Analytic time-dependent deformation of projected carrier distances.
// Procedural surface colonization, independent of the painted ecosystem.
export const textileEcologyModes=["Clean fibers","Diatom biofilm","Budding yeast","Mycelial tendrils","Lichen crust","Crystal accretion","Bacterial chains","Iridescent slime film","Radiolarian colonies","Pennate diatom frustules","Desmid mirror cells","Coccolith rosettes","Armored dinoflagellates","Spirillum ribbons","Vorticella bells","Foraminifer chambers","Silica spicule stars","Silica consortium","Bacterial fungal mutualism","Patchwork microbiome","Tidal succession","Core and fringe symbiosis","Complete microbial carnival"];
export const textileEcologyControls=["filamentEcology","filamentEcologyAmount","filamentEcologyScale","filamentEcologyCoverage","filamentEcologySpeed","filamentEcologyRelief","filamentEcologyHue"];
export function remixTextileEcology(state,rng=Math.random){
 const unit=()=>{const n=Number(rng());return Number.isFinite(n)?Math.max(0,Math.min(1-Number.EPSILON,n)):0;};
 const pool=textileEcologyModes.slice(1).filter(x=>x!==state.filamentEcology);
 return {...state,filamentEcology:pool[Math.floor(unit()*pool.length)],
 filamentEcologyAmount:65+35*unit(),filamentEcologyScale:15+75*unit(),
 filamentEcologyCoverage:30+65*unit(),filamentEcologySpeed:25+75*unit(),
 filamentEcologyRelief:35+65*unit(),filamentEcologyHue:100*unit()};
}
export const textileMetaModes=["Natural scaffold","Diffraction grating","Photonic crystal","Dichroic membrane","Spectral thin film","Prismatic chambers","Iridescent mineral skeleton","Birefringent lattice","Opal Bragg domains","Liquid crystal membrane","Translucent aerogel","Ferrofluid embroidery","Fractal dichroic glass","Anisotropic liquid metal","Bioluminescent gelatin","Opalescent cellular foam","Iridescent crystalline velvet"];
export const textileMetaControls=["filamentMeta","filamentMetaAmount","filamentMetaFrequency","filamentMetaThickness","filamentMetaDispersion","filamentMetaMotion","filamentMetaPolish"];
export function remixTextileMeta(state,rng=Math.random){
 const unit=()=>{const n=Number(rng());return Number.isFinite(n)?Math.max(0,Math.min(1-Number.EPSILON,n)):0;};
 const pool=textileMetaModes.slice(1).filter(x=>x!==state.filamentMeta);
 return {...state,filamentMeta:pool[Math.floor(unit()*pool.length)],filamentMetaAmount:65+35*unit(),
 filamentMetaFrequency:15+70*unit(),filamentMetaThickness:15+80*unit(),
 filamentMetaDispersion:45+55*unit(),filamentMetaMotion:15+75*unit(),filamentMetaPolish:35+65*unit()};
}
export const textileArchitectureModes=["Bare architecture","Dendritic crystal scaffolds","Microbial lace","Perforated silica tubes","Hyperbolic membranes","Mineral crust terraces","Iridescent cellular bridges","Radiolarian vaults","Quasicrystal exoskeleton","Möbius membrane","Klein bottle labyrinth","Gyroid labyrinth","Riemann branched sheets","Hopf fiber bundle","Hyperbolic skeletal net","Rotating tesseract lattice","Torus knot cathedral"];
export const textileDimensionModes=["Static architecture","Manual morph","Breathing dimensions","Traveling topology front","Patchwise mutation","Dimensional collapse","Fold and unfold","Counterphase territories"];
export const textileDimensionTargets=textileArchitectureModes.slice(1);
export const textileDimensionControls=["filamentDimMode","filamentDimTarget","filamentDimAmount","filamentDimProgress","filamentDimSpeed","filamentDimWarp","filamentDimFusion"];
export function remixTextileDimension(state,rng=Math.random){
 const unit=()=>{const n=Number(rng());return Number.isFinite(n)?Math.max(0,Math.min(1-Number.EPSILON,n)):0;};
 const modes=textileDimensionModes.slice(2).filter(x=>x!==state.filamentDimMode);
 const targets=textileDimensionTargets.filter(x=>x!==state.filamentArchitecture&&x!==state.filamentDimTarget);
 return {...state,filamentDimMode:modes[Math.floor(unit()*modes.length)],
 filamentDimTarget:targets[Math.floor(unit()*targets.length)],filamentDimAmount:75+25*unit(),
 filamentDimProgress:100*unit(),filamentDimSpeed:20+65*unit(),filamentDimWarp:20+65*unit(),filamentDimFusion:40+55*unit()};
}
export const textileArchitectureControls=["filamentArchitecture","filamentArchitectureAmount","filamentArchitectureScale","filamentArchitectureReach","filamentArchitectureOpenwork","filamentArchitectureSpeed","filamentArchitectureHue"];
export function remixTextileArchitecture(state,rng=Math.random){
 const unit=()=>{const n=Number(rng());return Number.isFinite(n)?Math.max(0,Math.min(1-Number.EPSILON,n)):0;};
 const pool=textileArchitectureModes.slice(1).filter(x=>x!==state.filamentArchitecture);
 return {...state,filamentArchitecture:pool[Math.floor(unit()*pool.length)],
 filamentArchitectureAmount:60+40*unit(),filamentArchitectureScale:15+75*unit(),
 filamentArchitectureReach:35+65*unit(),filamentArchitectureOpenwork:20+75*unit(),
 filamentArchitectureSpeed:15+75*unit(),filamentArchitectureHue:100*unit()};
}
export const textileChromaModes=["Original pigment","Spectral braid","Traveling dye fronts","Chromatic counterflow","Quasiperiodic dye work","Pigment standing waves","Chromosomal banding","Interference brocade","Crossing pigment exchange"];
export const textileChromaControls=["filamentChroma","filamentChromaAmount","filamentChromaScale","filamentChromaSpread","filamentChromaSpeed","filamentChromaContrast","filamentChromaExchange"];
export function remixTextileChroma(state,rng=Math.random){
 const unit=()=>{const n=Number(rng());return Number.isFinite(n)?Math.max(0,Math.min(1-Number.EPSILON,n)):0;};
 const pool=textileChromaModes.slice(1).filter(x=>x!==state.filamentChroma&&(x!=="Crossing pigment exchange"||state.filamentCrossbreed>0));
 return {...state,filamentChroma:pool[Math.floor(unit()*pool.length)],
 filamentChromaAmount:65+35*unit(),filamentChromaScale:15+75*unit(),
 filamentChromaSpread:35+65*unit(),filamentChromaSpeed:20+80*unit(),
 filamentChromaContrast:25+75*unit(),filamentChromaExchange:45+55*unit()};
}
export const textilePhysicsModes=["Stable threads","Unzipping seams","Fission & fusion","Fraying wavefront","Unravel & rewind","Living splice","Braided convergence","Tension rupture","Crossbreed grafts"];
export const textilePhysicsControls=["filamentPhysics","filamentPhysicsAmount","filamentPhysicsScale","filamentPhysicsReach","filamentPhysicsSpeed","filamentPhysicsRepair","filamentPhysicsGlow"];
export function remixTextilePhysics(state,rng=Math.random){
 const unit=()=>{const n=Number(rng());return Number.isFinite(n)?Math.max(0,Math.min(1-Number.EPSILON,n)):0;};
 const pool=textilePhysicsModes.slice(1).filter(x=>x!==state.filamentPhysics&&(x!=="Crossbreed grafts"||state.filamentCrossbreed>0));
 return {...state,filamentPhysics:pool[Math.floor(unit()*pool.length)],
 filamentPhysicsAmount:55+45*unit(),filamentPhysicsScale:20+75*unit(),
 filamentPhysicsReach:30+70*unit(),filamentPhysicsSpeed:20+80*unit(),
 filamentPhysicsRepair:30+70*unit(),filamentPhysicsGlow:20+80*unit()};
}
export const microloomModes=["Plain strand interior","Nested basket weave","Microscopic herringbone","Recursive Truchet lace","Quasiperiodic brocade","Fractal crochet seams","Interlocking diamond mesh","Nested cellular gauze","Counterwoven helices"];
export const microloomControls=["filamentMicroloom","filamentMicroloomAmount","filamentMicroloomScale","filamentMicroloomDepth","filamentMicroloomOpenwork","filamentMicroloomMotion","filamentMicroloomColor"];
export function remixMicroloom(state,rng=Math.random){
 const unit=()=>{const n=Number(rng());return Number.isFinite(n)?Math.max(0,Math.min(1-Number.EPSILON,n)):0;};
 const pool=microloomModes.slice(1).filter(x=>x!==state.filamentMicroloom);
 return {...state,filamentMicroloom:pool[Math.floor(unit()*pool.length)],
 filamentMicroloomAmount:65+35*unit(),filamentMicroloomScale:15+70*unit(),
 filamentMicroloomDepth:25+75*unit(),filamentMicroloomOpenwork:15+65*unit(),
 filamentMicroloomMotion:25+75*unit(),filamentMicroloomColor:25+75*unit()};
}
export const fiberConstructionModes=["Original strand","Double helix cable","Three-ply braid","Nested helical bundle","Hollow tubular yarn","Wire-wrapped core","Ribbed ribbon","Microfilament rope","Cellular optical cable"];
export const fiberConstructionControls=["filamentConstruction","filamentConstructionAmount","filamentConstructionPitch","filamentConstructionGap","filamentConstructionMotion","filamentConstructionRelief"];
export function remixFiberConstruction(state,rng=Math.random){
 const unit=()=>{const n=Number(rng());return Number.isFinite(n)?Math.max(0,Math.min(1-Number.EPSILON,n)):0;};
 const pool=fiberConstructionModes.slice(1).filter(x=>x!==state.filamentConstruction);
 return {...state,filamentConstruction:pool[Math.floor(unit()*pool.length)],
 filamentConstructionAmount:65+35*unit(),filamentConstructionPitch:20+80*unit(),
 filamentConstructionGap:20+75*unit(),filamentConstructionMotion:20+80*unit(),
 filamentConstructionRelief:45+55*unit()};
}
export const filamentMaterialControls=[
  "filamentNap","filamentLuster","filamentBeads","filamentBeadSize",
  "filamentSecondHue"
];

export function remixFilamentMaterials(state,rng=Math.random){
  const pick=old=>{
    const possibilities=filamentMaterials.filter(x=>x!==old);
    const number=Number(rng());
    return possibilities[Math.floor(Math.max(0,Math.min(.999999,Number.isFinite(number)?number:0))*possibilities.length)];
  };
  return {...state,filamentMaterial:pick(state.filamentMaterial),
    filamentSecondMaterial:pick(state.filamentSecondMaterial),
    filamentNap:Math.max(10,Math.min(100,Number(rng())*100||0)),
    filamentLuster:35+Math.min(.999999,Math.max(0,Number(rng())||0))*65,
    filamentBeads:Math.min(100,Math.max(0,Number(rng())*100||0)),
    filamentAmount:Math.max(50,state.filamentAmount||0)};
}

export const filamentMaterialPresets=[
  {name:"Silk cathedral",filamentMaterial:"Iridescent silk",
    filamentSecondMaterial:"Molten chrome",filamentNap:16,
    filamentLuster:85,filamentBeads:8,filamentBeadSize:32,filamentSecondHue:28},
  {name:"Mercury embroidery",filamentMaterial:"Molten chrome",
    filamentSecondMaterial:"Opaline glass",filamentNap:3,
    filamentLuster:98,filamentBeads:24,filamentBeadSize:58,filamentSecondHue:36},
  {name:"Opal spiderweb",filamentMaterial:"Opaline glass",
    filamentSecondMaterial:"Iridescent silk",filamentNap:18,
    filamentLuster:94,filamentBeads:53,filamentBeadSize:64,filamentSecondHue:47},
  {name:"Feral velvet tapestry",filamentMaterial:"Velvet flock",
    filamentSecondMaterial:"Iridescent silk",filamentNap:93,
    filamentLuster:23,filamentBeads:7,filamentBeadSize:34,filamentSecondHue:18},
  {name:"Electric nerve fiber",filamentMaterial:"Electroluminescent yarn",
    filamentSecondMaterial:"Molten chrome",filamentNap:32,
    filamentLuster:91,filamentBeads:33,filamentBeadSize:48,filamentSecondHue:72},
  {name:"Alien seed-bead couture",filamentMaterial:"Iridescent silk",
    filamentSecondMaterial:"Opaline glass",filamentNap:10,
    filamentLuster:96,filamentBeads:99,filamentBeadSize:82,filamentSecondHue:62},
  {name:"Heirloom cotton work",filamentMaterial:"Mercerized cotton",
    filamentSecondMaterial:"Pearl embroidery floss",filamentNap:22,
    filamentLuster:63,filamentBeads:11,filamentBeadSize:34,filamentSecondHue:24},
  {name:"Disco tinsel embroidery",filamentMaterial:"Metallic tinsel",
    filamentSecondMaterial:"Iridescent silk",filamentNap:7,
    filamentLuster:97,filamentBeads:45,filamentBeadSize:52,filamentSecondHue:58},
  {name:"Rainbow chenille shrine",filamentMaterial:"Chenille plush",
    filamentSecondMaterial:"Mercerized cotton",filamentNap:89,
    filamentLuster:22,filamentBeads:6,filamentBeadSize:23,filamentSecondHue:16},
  {name:"Mother-of-pearl floss",filamentMaterial:"Pearl embroidery floss",
    filamentSecondMaterial:"Opaline glass",filamentNap:11,
    filamentLuster:87,filamentBeads:53,filamentBeadSize:66,filamentSecondHue:43},
  {name:"Fiber-optic disco veins",filamentMaterial:"Fiber-optic rainbow",
    filamentSecondMaterial:"Molten chrome",filamentNap:13,
    filamentLuster:100,filamentBeads:31,filamentBeadSize:54,filamentSecondHue:84},
  {name:"Glassy nerve couture",filamentMaterial:"Gelatin nerve cord",
    filamentSecondMaterial:"Pearl embroidery floss",filamentNap:32,
    filamentLuster:82,filamentBeads:17,filamentBeadSize:41,filamentSecondHue:73},
  {name:"Petroleum wedding lace",filamentMaterial:"Oil-slick latex",
    filamentSecondMaterial:"Metallic tinsel",filamentNap:9,
    filamentLuster:99,filamentBeads:20,filamentBeadSize:53,filamentSecondHue:68},
  {name:"Mycelium after midnight",filamentMaterial:"Bioluminescent mycelium",
    filamentSecondMaterial:"Fiber-optic rainbow",filamentNap:71,
    filamentLuster:89,filamentBeads:62,filamentBeadSize:59,filamentSecondHue:57}
];

export function applyFilamentMaterialPreset(state,name){
  const preset=filamentMaterialPresets.find(p=>p.name===name);
  if(!preset)return state;
  const {name:label,...material}=preset;
  // Material presets don't change an existing geometry, palette, quote,
  // second parent, crossbreed amount, or anything else in the artwork.
  return {...state,...material,filamentAmount:Math.max(50,state.filamentAmount||0)};
}

export const filamentControls = [
  "filamentAmount","filamentScale","filamentDensity","filamentMotion",
  "filamentWidth","filamentRelief","filamentHue","filamentVariation",
];

export const filamentPresets = [
  {name:"Alien bridal lace",species:"Fivefold brocade",
    filamentAmount:94,filamentScale:47,filamentDensity:75,filamentMotion:31,
    filamentWidth:31,filamentRelief:77,filamentHue:62,filamentVariation:13},
  {name:"Crochet in impossible space",species:"Poincaré crochet",
    filamentAmount:93,filamentScale:54,filamentDensity:64,filamentMotion:41,
    filamentWidth:29,filamentRelief:92,filamentHue:24,filamentVariation:48},
  {name:"Witch's woven circuitry",species:"Truchet knotwork",
    filamentAmount:90,filamentScale:59,filamentDensity:67,filamentMotion:39,
    filamentWidth:42,filamentRelief:87,filamentHue:84,filamentVariation:71},
  {name:"Cellular heirloom",species:"Voronoi lace",
    filamentAmount:88,filamentScale:69,filamentDensity:73,filamentMotion:55,
    filamentWidth:33,filamentRelief:72,filamentHue:35,filamentVariation:38},
  {name:"Spiral organ embroidery",species:"Spiral appliqué",
    filamentAmount:92,filamentScale:50,filamentDensity:72,filamentMotion:61,
    filamentWidth:34,filamentRelief:83,filamentHue:52,filamentVariation:29},
  {name:"Bioluminescent needlework",species:"Fractal veinwork",
    filamentAmount:95,filamentScale:65,filamentDensity:79,filamentMotion:68,
    filamentWidth:29,filamentRelief:81,filamentHue:73,filamentVariation:91},
  {name:"Xeno transmission lace",species:"Alien lattice",
    filamentAmount:96,filamentScale:56,filamentDensity:83,filamentMotion:76,
    filamentWidth:22,filamentRelief:86,filamentHue:64,filamentVariation:48},
  {name:"Inscription of the Others",species:"Alien scriptwork",
    filamentAmount:93,filamentScale:62,filamentDensity:74,filamentMotion:67,
    filamentWidth:26,filamentRelief:91,filamentHue:81,filamentVariation:73},
  {name:"Oracle glyph infestation",species:"Glyph swarm",
    filamentAmount:94,filamentScale:58,filamentDensity:84,filamentMotion:89,
    filamentWidth:21,filamentRelief:88,filamentHue:93,filamentVariation:51},
  {name:"Xenobiological cable loom",species:"Xeno filament",
    filamentAmount:97,filamentScale:60,filamentDensity:86,filamentMotion:84,
    filamentWidth:18,filamentRelief:93,filamentHue:72,filamentVariation:57},
  {name:"Carnivorous capillary lace",species:"Capillary bloom",
    filamentAmount:97,filamentScale:63,filamentDensity:85,filamentMotion:85,
    filamentWidth:20,filamentRelief:89,filamentHue:61,filamentVariation:76},
  {name:"Mycelial nerve cathedral",species:"Mycelial veinwork",
    filamentAmount:96,filamentScale:57,filamentDensity:85,filamentMotion:82,
    filamentWidth:18,filamentRelief:92,filamentHue:79,filamentVariation:66},
  {name:"Electrical heirloom lace",species:"Lightning lace",
    filamentAmount:94,filamentScale:64,filamentDensity:89,filamentMotion:91,
    filamentWidth:18,filamentRelief:98,filamentHue:82,filamentVariation:62},
  {name:"Root oracle tapestry",species:"Root filigree",
    filamentAmount:94,filamentScale:59,filamentDensity:82,filamentMotion:79,
    filamentWidth:19,filamentRelief:88,filamentHue:43,filamentVariation:64},
  {name:"Bioluminescent coral veins",species:"Coral vasculature",
    filamentAmount:96,filamentScale:53,filamentDensity:89,filamentMotion:88,
    filamentWidth:23,filamentRelief:96,filamentHue:36,filamentVariation:79},
  {name:"Neural signal embroidery",species:"Nerve net",
    filamentAmount:97,filamentScale:58,filamentDensity:85,filamentMotion:94,
    filamentWidth:20,filamentRelief:91,filamentHue:96,filamentVariation:84},
  {name:"Traditional basket twill",species:"Basket twill",
    filamentAmount:91,filamentScale:43,filamentDensity:68,filamentMotion:42,
    filamentWidth:32,filamentRelief:73,filamentHue:21,filamentVariation:17},
  {name:"Chromatic herringbone",species:"Chevron herringbone",
    filamentAmount:92,filamentScale:48,filamentDensity:72,filamentMotion:51,
    filamentWidth:30,filamentRelief:77,filamentHue:32,filamentVariation:30},
  {name:"Electric macramé diamonds",species:"Macramé diamonds",
    filamentAmount:93,filamentScale:53,filamentDensity:76,filamentMotion:60,
    filamentWidth:28,filamentRelief:81,filamentHue:43,filamentVariation:43},
  {name:"Bobbin-made fairy lace",species:"Bobbin lace",
    filamentAmount:94,filamentScale:58,filamentDensity:80,filamentMotion:69,
    filamentWidth:26,filamentRelief:85,filamentHue:54,filamentVariation:56},
  {name:"Möbius cable infestation",species:"Möbius cable",
    filamentAmount:95,filamentScale:63,filamentDensity:84,filamentMotion:78,
    filamentWidth:24,filamentRelief:89,filamentHue:65,filamentVariation:69},
  {name:"Parasitic ladder loom",species:"Parasitic ladder",
    filamentAmount:96,filamentScale:68,filamentDensity:88,filamentMotion:87,
    filamentWidth:22,filamentRelief:93,filamentHue:76,filamentVariation:82}
];

export function applyFilamentPreset(state,name){
  const recipe=filamentPresets.find(p=>p.name===name);
  if(!recipe)return state;
  const {name:unused,species,...controls}=recipe;
  return {...state,filamentSpecies:species,...controls,filamentCrossbreed:0};
}

export function nextFilamentSpecies(state,rng=Math.random){
  const others=filamentSpecies.filter(x=>x!==state.filamentSpecies);
  const v=Number(rng());
  const index=Math.min(others.length-1,Math.max(0,Math.floor((Number.isFinite(v)?v:0)*others.length)));
  return {...state,filamentSpecies:others[index],filamentAmount:Math.max(55,state.filamentAmount||0)};
}

/** Two parents produce one optical fabric; no base-art parameters are touched. */
export const filamentHybridPresets = [
  {name:"Cathedral circuit lace",first:"Poincaré crochet",second:"Truchet knotwork",
    filamentAmount:94,filamentCrossbreed:88,filamentInterlace:80,filamentTwist:12,filamentPhase:23},
  {name:"Quasicrystal cell garden",first:"Fivefold brocade",second:"Voronoi lace",
    filamentAmount:95,filamentCrossbreed:82,filamentInterlace:74,filamentTwist:21,filamentPhase:44},
  {name:"Living nervous embroidery",first:"Fractal veinwork",second:"Spiral appliqué",
    filamentAmount:91,filamentCrossbreed:90,filamentInterlace:63,filamentTwist:43,filamentPhase:76},
  {name:"Alien bridal knot",first:"Truchet knotwork",second:"Fivefold brocade",
    filamentAmount:92,filamentCrossbreed:77,filamentInterlace:93,filamentTwist:33,filamentPhase:55},
  {name:"Psychedelic cellular crochet",first:"Voronoi lace",second:"Poincaré crochet",
    filamentAmount:89,filamentCrossbreed:85,filamentInterlace:87,filamentTwist:14,filamentPhase:68},
  {name:"Spiral crown mycelium",first:"Spiral appliqué",second:"Fractal veinwork",
    filamentAmount:96,filamentCrossbreed:91,filamentInterlace:51,filamentTwist:62,filamentPhase:37},
  {name:"Xeno-vascular communion",first:"Alien scriptwork",second:"Mycelial veinwork",
    filamentAmount:97,filamentCrossbreed:89,filamentInterlace:74,filamentTwist:39,filamentPhase:68},
  {name:"Nerve lightning brocade",first:"Nerve net",second:"Lightning lace",
    filamentAmount:98,filamentCrossbreed:90,filamentInterlace:78,filamentTwist:24,filamentPhase:59},
];
export const filamentHybridControls=[
  "filamentCrossbreed","filamentInterlace","filamentTwist","filamentPhase"
];
export function applyFilamentHybrid(state,name){
 const p=filamentHybridPresets.find(x=>x.name===name);
 if(!p)return state;
 const {name:label,first,second,...controls}=p;
 return {...state,filamentSpecies:first,filamentSecondSpecies:second,...controls};
}
export function breedFilaments(state,rng=Math.random){
 const unit=()=>{const n=Number(rng());return Number.isFinite(n)?Math.max(0,Math.min(.999999,n)):0;};
 const choices=filamentSpecies.filter(x=>x!==state.filamentSpecies);
 const first=choices[Math.floor(unit()*choices.length)];
 const other=filamentSpecies.filter(x=>x!==first);
 const second=other[Math.floor(unit()*other.length)];
 return {...state,filamentSpecies:first,filamentSecondSpecies:second,
   filamentAmount:Math.max(55,state.filamentAmount||0),
   filamentCrossbreed:52+unit()*46,filamentInterlace:34+unit()*64,
   filamentTwist:unit()*100,filamentPhase:unit()*100};
}

/**
 * SELF-WEAVING LOOM — deterministic procedural stitch sequencing.
 * The stitch reveal is driven by the same render clock in preview, PNG,
 * GIF and MP4. No accumulated GPU state, feedback textures or random
 * state can drift between captures.
 */

/**
 * THREAD TRINKET CABINET: decorations grow from the *actual* filament path.
 * Not screen-space stickers. Kept separate from geometry, stitch dynamics,
 * materials and 2.5D thread sculpting so old recipes stay exactly as drawn.
 */

/** Existing dressing becomes the first material in a time-varying blend.
 * The second is independently chosen per filament parent. */
export const filamentMorphModes=["Off","Seam sweep","Crystal contagion","Molten migration","Moth-eaten portals","Checker metamorph","Strange attractor","Morse rethreading","Fungal takeover","Chromatic tide"];
export const filamentMorphFamilies=[
  {name:"Dormant",modes:filamentMorphModes.slice(0,1)},
  {name:"Seams and phase transformations",modes:filamentMorphModes.slice(1,4)},
  {name:"Weird mutations",modes:filamentMorphModes.slice(4,9)},
  {name:"Optical tides",modes:filamentMorphModes.slice(9)}
];
export const filamentMorphDescriptions={
  "Off": "No morphing, original materials unchanged.",
  "Seam sweep": "A moving seam front hands one true fiber material to another.",
  "Crystal contagion": "Faceted islands crystallize through the threads.",
  "Molten migration": "Liquid waves melt the cloth into its second material.",
  "Moth-eaten portals": "Flickering holes open in the original yarn.",
  "Checker metamorph": "Checkered fabric patches alternate their materials.",
  "Strange attractor": "Two orbiting mathematical attractors recolor the filaments.",
  "Morse rethreading": "Morse-like packets change the yarn one signal at a time.",
  "Fungal takeover": "Living hyphae take over the original material.",
  "Chromatic tide": "Slow rolling tides sweep new optical materials through the cloth."
};
export const filamentMorphControls=["filamentMorphAmount","filamentMorphScale",
  "filamentMorphSpeed","filamentMorphSharpness","filamentMorphGlow"];
export const filamentMorphPresets=[
  {
    "name": "Opaline seam sweep",
    "filamentMorphMode": "Seam sweep",
    "filamentMorphTarget": "Opaline glass",
    "filamentSecondMorphTarget": "Pearl embroidery floss",
    "filamentMorphAmount": 80,
    "filamentMorphScale": 35,
    "filamentMorphSpeed": 38,
    "filamentMorphSharpness": 26,
    "filamentMorphGlow": 46
  },
  {
    "name": "Molten oil-slick",
    "filamentMorphMode": "Crystal contagion",
    "filamentMorphTarget": "Oil-slick latex",
    "filamentSecondMorphTarget": "Molten chrome",
    "filamentMorphAmount": 86,
    "filamentMorphScale": 42,
    "filamentMorphSpeed": 47,
    "filamentMorphSharpness": 37,
    "filamentMorphGlow": 59
  },
  {
    "name": "Fungal couture",
    "filamentMorphMode": "Molten migration",
    "filamentMorphTarget": "Bioluminescent mycelium",
    "filamentSecondMorphTarget": "Fiber-optic rainbow",
    "filamentMorphAmount": 92,
    "filamentMorphScale": 49,
    "filamentMorphSpeed": 56,
    "filamentMorphSharpness": 48,
    "filamentMorphGlow": 72
  },
  {
    "name": "Velvet infection",
    "filamentMorphMode": "Moth-eaten portals",
    "filamentMorphTarget": "Velvet flock",
    "filamentSecondMorphTarget": "Chenille plush",
    "filamentMorphAmount": 98,
    "filamentMorphScale": 56,
    "filamentMorphSpeed": 65,
    "filamentMorphSharpness": 59,
    "filamentMorphGlow": 85
  },
  {
    "name": "Moth-eaten starlight",
    "filamentMorphMode": "Checker metamorph",
    "filamentMorphTarget": "Fiber-optic rainbow",
    "filamentSecondMorphTarget": "Gelatin nerve cord",
    "filamentMorphAmount": 80,
    "filamentMorphScale": 63,
    "filamentMorphSpeed": 74,
    "filamentMorphSharpness": 70,
    "filamentMorphGlow": 98
  },
  {
    "name": "Metallic checkerfall",
    "filamentMorphMode": "Strange attractor",
    "filamentMorphTarget": "Metallic tinsel",
    "filamentSecondMorphTarget": "Opaline glass",
    "filamentMorphAmount": 86,
    "filamentMorphScale": 70,
    "filamentMorphSpeed": 83,
    "filamentMorphSharpness": 81,
    "filamentMorphGlow": 57
  },
  {
    "name": "Twin-attractor nerves",
    "filamentMorphMode": "Morse rethreading",
    "filamentMorphTarget": "Gelatin nerve cord",
    "filamentSecondMorphTarget": "Oil-slick latex",
    "filamentMorphAmount": 92,
    "filamentMorphScale": 77,
    "filamentMorphSpeed": 92,
    "filamentMorphSharpness": 92,
    "filamentMorphGlow": 70
  },
  {
    "name": "Morse-code opal",
    "filamentMorphMode": "Fungal takeover",
    "filamentMorphTarget": "Opaline glass",
    "filamentSecondMorphTarget": "Mercerized cotton",
    "filamentMorphAmount": 98,
    "filamentMorphScale": 84,
    "filamentMorphSpeed": 44,
    "filamentMorphSharpness": 31,
    "filamentMorphGlow": 83
  },
  {
    "name": "Spore takeover",
    "filamentMorphMode": "Chromatic tide",
    "filamentMorphTarget": "Bioluminescent mycelium",
    "filamentSecondMorphTarget": "Pearl embroidery floss",
    "filamentMorphAmount": 80,
    "filamentMorphScale": 91,
    "filamentMorphSpeed": 53,
    "filamentMorphSharpness": 42,
    "filamentMorphGlow": 96
  }
];
export function applyFilamentMorphPreset(state,name){
  const preset=filamentMorphPresets.find(p=>p.name===name);
  if(!preset)return state;
  const {name:unused,...params}=preset;
  return {...state,...params,filamentAmount:Math.max(72,state.filamentAmount||0)};
}
export function remixFilamentMorph(state,rng=Math.random,onlyWeird=false){
  const unit=()=>{const n=Number(rng());return Number.isFinite(n)?
    Math.min(1-Number.EPSILON,Math.max(0,n)):0;};
  const pick=(options,old)=>{const pool=options.filter(x=>x!==old);
    const values=pool.length?pool:options;return values[Math.floor(unit()*values.length)];};
  return {...state,
    filamentMorphMode:pick(onlyWeird?filamentMorphModes.slice(4,9):
      filamentMorphModes.slice(1),state.filamentMorphMode),
    filamentMorphTarget:pick(filamentMaterials.slice(1),state.filamentMaterial),
    filamentSecondMorphTarget:pick(filamentMaterials.slice(1),state.filamentSecondMaterial),
    filamentMorphAmount:72+unit()*27,filamentMorphScale:24+unit()*74,
    filamentMorphSpeed:15+unit()*83,filamentMorphSharpness:20+unit()*79,
    filamentMorphGlow:31+unit()*68,filamentAmount:Math.max(72,state.filamentAmount||0)};
}
/** Compile only the active target fiber laws (at most two) on mobile. */
export function specializeFilamentMorphMaterials(source,first,second=null){
  if(first==null||!Number.isInteger(first)||first<0||
    first>=filamentMaterials.length)return source;
  const ids=[first,...(second==null?[]:[second])];
  if(ids.some(n=>!Number.isInteger(n)||n<0||n>=filamentMaterials.length))
    return source;
  const opener=id=>id===1?"  if(morphMaterial==1){":
    "  }else if(morphMaterial=="+id+"){";
  const starts=filamentMaterials.slice(1).map((_,i)=>source.indexOf(opener(i+1)));
  if(starts.some((pos,i)=>pos<0||(i&&pos<=starts[i-1])))return source;
  const ending=source.indexOf("  // Blend actual fiber material appearances",starts.at(-1));
  if(ending<0)return source;
  const close=source.lastIndexOf("  }\n",ending);
  if(close<starts.at(-1))return source;
  const selected=[...new Set(ids.filter(x=>x>0))].sort((a,b)=>a-b);
  const blocks=selected.map((id,i)=>(
    (i===0?"  if(morphMaterial=="+id+"){":
      "  }else if(morphMaterial=="+id+"){")+
    source.slice(starts[id-1]+opener(id).length,
      id===filamentMaterials.length-1?close:starts[id])));
  return source.slice(0,starts[0])+blocks.join("")+
    (selected.length?"  }\n":"")+source.slice(ending);
}


/**
 * THREAD CONTAGION: analytic infection waves travel along live fiber phase.
 * When both parents exist, the second can receive a signal only at genuine
 * overlapping stitch cores. No simulation framebuffer or export-only pass.
 */
export const filamentContagionModes=[
  "Off",
  "Stitch relay",
  "Crossing fever",
  "Mycelial bridge",
  "Spark jump",
  "Knot epidemic",
  "Spore drift"
];
export const filamentContagionFamilies=[
  {name:"Dormant",modes:filamentContagionModes.slice(0,1)},
  {name:"Sewn transmission",modes:filamentContagionModes.slice(1,3)},
  {name:"Strange growths and charge",modes:filamentContagionModes.slice(3)}
];
export const filamentContagionDescriptions={
  "Off": "Existing material transformations remain unchanged.",
  "Stitch relay": "Animated stitch-local packets pass a transformed finish along each thread.",
  "Crossing fever": "Real overlaps between hybrid parent cores light up and transfer the first parent's active morph to the second.",
  "Mycelial bridge": "Branching wavefronts travel from seeded cells through the living weave.",
  "Spark jump": "Transient electric pulses leap between nearby sections of the thread field.",
  "Knot epidemic": "Seeded knot clusters exchange their transformed appearance in a cyclic relay.",
  "Spore drift": "Soft clouds of spores ride traveling strands and settle in rhythmic bursts."
};
export const filamentContagionControls=[
  "filamentContagionAmount","filamentContagionReach","filamentContagionSpeed",
  "filamentContagionLag","filamentContagionGlow"
];
export const filamentContagionPresets=[
  {
    "name": "Satin epidemic",
    "filamentContagionMode": "Stitch relay",
    "filamentMorphTarget": "Opaline glass",
    "filamentSecondMorphTarget": "Pearl embroidery floss",
    "filamentContagionAmount": 85,
    "filamentContagionReach": 47,
    "filamentContagionSpeed": 62,
    "filamentContagionLag": 28,
    "filamentContagionGlow": 58
  },
  {
    "name": "Contact fever",
    "filamentContagionMode": "Crossing fever",
    "filamentMorphTarget": "Gelatin nerve cord",
    "filamentSecondMorphTarget": "Bioluminescent mycelium",
    "filamentContagionAmount": 97,
    "filamentContagionReach": 42,
    "filamentContagionSpeed": 73,
    "filamentContagionLag": 19,
    "filamentContagionGlow": 86
  },
  {
    "name": "Possessed fungus",
    "filamentContagionMode": "Mycelial bridge",
    "filamentMorphTarget": "Bioluminescent mycelium",
    "filamentSecondMorphTarget": "Opaline glass",
    "filamentContagionAmount": 92,
    "filamentContagionReach": 68,
    "filamentContagionSpeed": 45,
    "filamentContagionLag": 67,
    "filamentContagionGlow": 83
  },
  {
    "name": "Jumping voltage",
    "filamentContagionMode": "Spark jump",
    "filamentMorphTarget": "Fiber-optic rainbow",
    "filamentSecondMorphTarget": "Molten chrome",
    "filamentContagionAmount": 97,
    "filamentContagionReach": 64,
    "filamentContagionSpeed": 86,
    "filamentContagionLag": 13,
    "filamentContagionGlow": 98
  },
  {
    "name": "Knot plague",
    "filamentContagionMode": "Knot epidemic",
    "filamentMorphTarget": "Oil-slick latex",
    "filamentSecondMorphTarget": "Velvet flock",
    "filamentContagionAmount": 91,
    "filamentContagionReach": 83,
    "filamentContagionSpeed": 57,
    "filamentContagionLag": 53,
    "filamentContagionGlow": 78
  },
  {
    "name": "Soft spore weather",
    "filamentContagionMode": "Spore drift",
    "filamentMorphTarget": "Bioluminescent mycelium",
    "filamentSecondMorphTarget": "Iridescent silk",
    "filamentContagionAmount": 89,
    "filamentContagionReach": 49,
    "filamentContagionSpeed": 38,
    "filamentContagionLag": 80,
    "filamentContagionGlow": 61
  }
];
export function applyFilamentContagionPreset(state,name){
  const preset=filamentContagionPresets.find(x=>x.name===name);
  if(!preset)return state;
  const {name:unused,...newValues}=preset;
  return {...state,...newValues,filamentAmount:Math.max(70,state.filamentAmount||0),
    filamentMorphMode:state.filamentMorphMode==="Off"?"Seam sweep":state.filamentMorphMode,
    filamentMorphAmount:Math.max(82,state.filamentMorphAmount||0)};
}
export function remixFilamentContagion(state,rng=Math.random,onlyWeird=false){
  const unit=()=>{const x=Number(rng());return Number.isFinite(x)?
    Math.min(1-Number.EPSILON,Math.max(0,x)):0;};
  const modes=onlyWeird?filamentContagionModes.slice(3):filamentContagionModes.slice(1);
  const candidates=modes.filter(x=>x!==state.filamentContagionMode);
  const pool=candidates.length?candidates:modes;
  const mode=pool[Math.floor(unit()*pool.length)];
  const alternatives=filamentMaterials.slice(1);
  const pick=old=>{const eligible=alternatives.filter(x=>x!==old);
    return eligible[Math.floor(unit()*eligible.length)];};
  return {...state,filamentContagionMode:mode,
    filamentContagionAmount:72+unit()*27,
    filamentContagionReach:25+unit()*74,
    filamentContagionSpeed:16+unit()*83,
    filamentContagionLag:10+unit()*88,
    filamentContagionGlow:35+unit()*64,
    filamentMorphTarget:pick(state.filamentMaterial),
    filamentSecondMorphTarget:pick(state.filamentSecondMaterial),
    filamentMorphAmount:Math.max(83,state.filamentMorphAmount||0),
    filamentMorphMode:state.filamentMorphMode==="Off"?"Seam sweep":state.filamentMorphMode,
    filamentAmount:Math.max(70,state.filamentAmount||0)};
}

/** Narrow contagion compilation to the selected transmission law on iOS. */
export function specializeFilamentContagion(source,index){
  if(index==null||!Number.isInteger(index)||index<1||
    index>=filamentContagionModes.length)return source;
  const opener=id=>id===1?"  if(filamentContagionMode==1){":
    "  }else if(filamentContagionMode=="+id+"){";
  const starts=filamentContagionModes.slice(1)
    .map((_,k)=>source.indexOf(opener(k+1)));
  if(starts.some((p,k)=>p<0||(k>0&&p<=starts[k-1])))return source;
  const end=source.indexOf("  // Link flux is zero",starts.at(-1));
  if(end<0)return source;
  const close=source.lastIndexOf("  }\n",end);
  if(close<starts.at(-1))return source;
  const stop=index===filamentContagionModes.length-1?close:starts[index];
  const body=source.slice(starts[index-1]+opener(index).length,stop);
  return source.slice(0,starts[0])+
    "  if(filamentContagionMode=="+index+"){"+body+
    "  }\n"+source.slice(end);
}


/**
 * NEURAL LOOM — deterministic electric signaling across procedurally moving
 * woven fibers. Cross-parent coupling comes from actual already-sewn
 * intersection masks and the first parent's palette luminance/pulse.
 * Not a temporal memory buffer or physically trained neural network.
 */
export const filamentNeuralModes=[
  "Off",
  "Axon train",
  "Chromatic reflex",
  "Synaptic handshake",
  "Ganglion chorus",
  "Reflex arc",
  "Myelin skip",
  "Nerve storm",
  "Resting potential"
];
export const filamentNeuralFamilies=[
  {name:"Quiet",modes:filamentNeuralModes.slice(0,1)},
  {name:"Classic neural signaling",modes:filamentNeuralModes.slice(1,4)},
  {name:"Strange textile brains",modes:filamentNeuralModes.slice(4,8)},
  {name:"Slow meditative currents",modes:filamentNeuralModes.slice(8)}
];
export const filamentNeuralDescriptions={
  "Off": "No nervous-system activity. Existing artworks and material dressing stay unchanged.",
  "Axon train": "Bright action-potential packets move in chains along the current animated filaments.",
  "Chromatic reflex": "The textile reacts to its own palette gradients and fires at strong neighboring-color contrasts.",
  "Synaptic handshake": "The second parent reacts to a pulse arriving from the first only at their actual stitched crossings.",
  "Ganglion chorus": "Seeded ganglion clusters synchronize nearby thread motion and rhythmic flashes.",
  "Reflex arc": "Electrical impulses turn around periodically and travel back along the fibers.",
  "Myelin skip": "Saltatory spikes appear to jump between regularly spaced myelin-like nodes.",
  "Nerve storm": "Seeded, irregular bursts of optical electricity erupt along the woven network.",
  "Resting potential": "Slow glow pulses drift across a calm fabric without constant harsh flashing."
};
export const filamentNeuralControls=["filamentNeuralAmount","filamentNeuralSpeed",
  "filamentNeuralCoupling","filamentNeuralThreshold","filamentNeuralGlow"];
export const filamentNeuralPresets=[
  {
    "name": "Silk axon railway",
    "filamentNeuralMode": "Axon train",
    "filamentNeuralAmount": 85,
    "filamentNeuralSpeed": 61,
    "filamentNeuralCoupling": 63,
    "filamentNeuralThreshold": 32,
    "filamentNeuralGlow": 74
  },
  {
    "name": "Chromatic synesthesia",
    "filamentNeuralMode": "Chromatic reflex",
    "filamentNeuralAmount": 95,
    "filamentNeuralSpeed": 47,
    "filamentNeuralCoupling": 72,
    "filamentNeuralThreshold": 28,
    "filamentNeuralGlow": 87
  },
  {
    "name": "Contact synapse",
    "filamentNeuralMode": "Synaptic handshake",
    "filamentNeuralAmount": 94,
    "filamentNeuralSpeed": 69,
    "filamentNeuralCoupling": 82,
    "filamentNeuralThreshold": 24,
    "filamentNeuralGlow": 91
  },
  {
    "name": "Ganglion choir",
    "filamentNeuralMode": "Ganglion chorus",
    "filamentNeuralAmount": 91,
    "filamentNeuralSpeed": 42,
    "filamentNeuralCoupling": 79,
    "filamentNeuralThreshold": 38,
    "filamentNeuralGlow": 82
  },
  {
    "name": "Reversing reflex arc",
    "filamentNeuralMode": "Reflex arc",
    "filamentNeuralAmount": 94,
    "filamentNeuralSpeed": 67,
    "filamentNeuralCoupling": 58,
    "filamentNeuralThreshold": 35,
    "filamentNeuralGlow": 81
  },
  {
    "name": "Saltatory electric lace",
    "filamentNeuralMode": "Myelin skip",
    "filamentNeuralAmount": 97,
    "filamentNeuralSpeed": 79,
    "filamentNeuralCoupling": 68,
    "filamentNeuralThreshold": 23,
    "filamentNeuralGlow": 100
  },
  {
    "name": "Voltage panic",
    "filamentNeuralMode": "Nerve storm",
    "filamentNeuralAmount": 98,
    "filamentNeuralSpeed": 89,
    "filamentNeuralCoupling": 87,
    "filamentNeuralThreshold": 17,
    "filamentNeuralGlow": 100
  },
  {
    "name": "Dreaming fabric",
    "filamentNeuralMode": "Resting potential",
    "filamentNeuralAmount": 79,
    "filamentNeuralSpeed": 25,
    "filamentNeuralCoupling": 53,
    "filamentNeuralThreshold": 61,
    "filamentNeuralGlow": 62
  }
];
export function applyFilamentNeuralPreset(state,name){
  const preset=filamentNeuralPresets.find(x=>x.name===name);
  if(!preset)return state;
  const {name:unused,...selected}=preset;
  return {...state,...selected,filamentAmount:Math.max(72,state.filamentAmount||0)};
}
export function remixFilamentNeural(state,rng=Math.random,onlyWeird=false){
  const unit=()=>{const x=Number(rng());return Number.isFinite(x)?
    Math.max(0,Math.min(1-Number.EPSILON,x)):0;};
  const options=onlyWeird?filamentNeuralModes.slice(4,8):
    filamentNeuralModes.slice(1);
  const alternatives=options.filter(x=>x!==state.filamentNeuralMode);
  const pool=alternatives.length?alternatives:options;
  return {...state,
    filamentNeuralMode:pool[Math.floor(unit()*pool.length)],
    filamentNeuralAmount:72+unit()*27,
    filamentNeuralSpeed:16+unit()*83,
    filamentNeuralCoupling:19+unit()*80,
    filamentNeuralThreshold:12+unit()*77,
    filamentNeuralGlow:40+unit()*59,
    filamentAmount:Math.max(72,state.filamentAmount||0)};
}
/** iPhone shader specialization strips 7 of the 8 unused neural laws. */
export function specializeFilamentNeural(source,index){
  if(index==null||!Number.isInteger(index)||index<1||
    index>=filamentNeuralModes.length)return source;
  const opener=i=>i===1?"  if(filamentNeuralMode==1){":
    "  }else if(filamentNeuralMode=="+i+"){";
  const starts=filamentNeuralModes.slice(1).map((_,i)=>source.indexOf(opener(i+1)));
  if(starts.some((p,i)=>p<0||(i>0&&p<=starts[i-1])))return source;
  const end=source.indexOf("  // Real contact is never approximated by screen neighbors.",starts.at(-1));
  if(end<0)return source;
  const close=source.lastIndexOf("  }\n",end);
  if(close<starts.at(-1))return source;
  const next=index===filamentNeuralModes.length-1?close:starts[index];
  const body=source.slice(starts[index-1]+opener(index).length,next);
  return source.slice(0,starts[0])+"  if(filamentNeuralMode=="+index+"){"+
    body+"  }\n"+source.slice(end);
}


/**
 * SYNAPTIC PLASTICITY: mathematical gain and inhibition in the existing
 * Neural Loom, informed by local palette gradients and real donor crossings.
 * Stateless analytic adaptation (not persistent learning / true Hebbian
 * weights): deterministic for the exact same preview and export timeline.
 */
export const filamentPlasticModes=[
  "Off",
  "Hebbian bloom",
  "Inhibitory lace",
  "Echo synapses",
  "Resonant choir",
  "Pruning wave",
  "Dream consolidation"
];
export const filamentPlasticFamilies=[
  {name:"Dormant",modes:filamentPlasticModes.slice(0,1)},
  {name:"Excitation and inhibition",modes:filamentPlasticModes.slice(1,3)},
  {name:"Temporal synapses",modes:filamentPlasticModes.slice(3,5)},
  {name:"Pruning and dream states",modes:filamentPlasticModes.slice(5)}
];
export const filamentPlasticDescriptions={
  "Off": "Leaves the existing nervous-system look completely untouched.",
  "Hebbian bloom": "Coincident local color response and real crossing impulses amplify bright synaptic patches.",
  "Inhibitory lace": "Dark suppressive bands quiet overexcited threads and their actual junctions.",
  "Echo synapses": "Delayed wave packets repeat earlier-shaped signals without storing extra GPU frames.",
  "Resonant choir": "Seeded thread clusters entrain their pulse timing, with real crossings strengthening the sync.",
  "Pruning wave": "Weak pathways dim as a changing pruning front trims the electrical network.",
  "Dream consolidation": "Slow, dreamlike pulse envelopes relax, brighten, and reshape neural responses."
};
export const filamentPlasticControls=[
  "filamentPlasticAmount","filamentPlasticRate","filamentPlasticInhibition",
  "filamentPlasticRetention","filamentPlasticGlow"
];
export const filamentPlasticPresets=[
  {
    "name": "Electric orchid brain",
    "filamentPlasticMode": "Hebbian bloom",
    "filamentPlasticAmount": 93,
    "filamentPlasticRate": 65,
    "filamentPlasticInhibition": 22,
    "filamentPlasticRetention": 61,
    "filamentPlasticGlow": 93
  },
  {
    "name": "Negative-space synapses",
    "filamentPlasticMode": "Inhibitory lace",
    "filamentPlasticAmount": 96,
    "filamentPlasticRate": 39,
    "filamentPlasticInhibition": 90,
    "filamentPlasticRetention": 55,
    "filamentPlasticGlow": 68
  },
  {
    "name": "Afterthought lightning",
    "filamentPlasticMode": "Echo synapses",
    "filamentPlasticAmount": 89,
    "filamentPlasticRate": 72,
    "filamentPlasticInhibition": 34,
    "filamentPlasticRetention": 83,
    "filamentPlasticGlow": 91
  },
  {
    "name": "Alien textile choir",
    "filamentPlasticMode": "Resonant choir",
    "filamentPlasticAmount": 94,
    "filamentPlasticRate": 49,
    "filamentPlasticInhibition": 36,
    "filamentPlasticRetention": 73,
    "filamentPlasticGlow": 95
  },
  {
    "name": "Fractal synapse pruning",
    "filamentPlasticMode": "Pruning wave",
    "filamentPlasticAmount": 91,
    "filamentPlasticRate": 58,
    "filamentPlasticInhibition": 79,
    "filamentPlasticRetention": 48,
    "filamentPlasticGlow": 86
  },
  {
    "name": "Sleepwalking neurons",
    "filamentPlasticMode": "Dream consolidation",
    "filamentPlasticAmount": 85,
    "filamentPlasticRate": 23,
    "filamentPlasticInhibition": 31,
    "filamentPlasticRetention": 92,
    "filamentPlasticGlow": 77
  }
];
export function applyFilamentPlasticPreset(state,name){
  const preset=filamentPlasticPresets.find(p=>p.name===name);
  if(!preset)return state;
  const {name:unused,...values}=preset;
  return {...state,...values,
    filamentAmount:Math.max(70,state.filamentAmount||0),
    filamentNeuralMode:state.filamentNeuralMode==="Off"?"Axon train":
      state.filamentNeuralMode,
    filamentNeuralAmount:Math.max(80,state.filamentNeuralAmount||0)};
}
export function remixFilamentPlastic(state,rng=Math.random,onlyWeird=false){
  const unit=()=>{const x=Number(rng());return Number.isFinite(x)?
    Math.max(0,Math.min(1-Number.EPSILON,x)):0;};
  const options=onlyWeird?filamentPlasticModes.slice(4):
    filamentPlasticModes.slice(1);
  const pool=options.filter(x=>x!==state.filamentPlasticMode);
  const choices=pool.length?pool:options;
  return {...state,
    filamentPlasticMode:choices[Math.floor(unit()*choices.length)],
    filamentPlasticAmount:75+unit()*24,
    filamentPlasticRate:18+unit()*81,
    filamentPlasticInhibition:10+unit()*88,
    filamentPlasticRetention:18+unit()*80,
    filamentPlasticGlow:45+unit()*54,
    filamentAmount:Math.max(70,state.filamentAmount||0),
    filamentNeuralMode:state.filamentNeuralMode==="Off"?"Axon train":
      state.filamentNeuralMode,
    filamentNeuralAmount:Math.max(80,state.filamentNeuralAmount||0)};
}
/** Prune five unused plasticity modes from a selected iPhone shader. */
export function specializeFilamentPlasticity(source,index){
  if(index==null||!Number.isInteger(index)||index<1||
    index>=filamentPlasticModes.length)return source;
  const opener=i=>i===1?"  if(filamentPlasticMode==1){":
    "  }else if(filamentPlasticMode=="+i+"){";
  const starts=filamentPlasticModes.slice(1)
    .map((_,i)=>source.indexOf(opener(i+1)));
  if(starts.some((p,i)=>p<0||(i>0&&p<=starts[i-1])))return source;
  const end=source.indexOf("  // Apply analytic synaptic gain",starts.at(-1));
  if(end<0)return source;
  const close=source.lastIndexOf("  }\n",end);
  if(close<starts.at(-1))return source;
  const stop=index===filamentPlasticModes.length-1?close:starts[index];
  const body=source.slice(starts[index-1]+opener(index).length,stop);
  return source.slice(0,starts[0])+"  if(filamentPlasticMode=="+index+"){"+
    body+"  }\n"+source.slice(end);
}


/**
 * GHOST SCARS — six opt-in, deterministic optical scar behaviors,
 * mapped onto existing filament geometry and neural contact masks.
 * A phase-offset pulse looks like an afterimage but does NOT preserve past
 * frames or require the repaired iPhone feedback compositor.
 */
export const filamentScarModes=[
  "Off",
  "Phosphor aftertrace",
  "Lichtenberg burn",
  "Kintsugi sutures",
  "Spectral bruising",
  "Ghost knot fossils",
  "Mycelial nerve scars"
];
export const filamentScarFamilies=[
  {name:"Dormant",modes:filamentScarModes.slice(0,1)},
  {name:"Electrically burned fibers",modes:filamentScarModes.slice(1,3)},
  {name:"Repaired and chromatic scars",modes:filamentScarModes.slice(3,5)},
  {name:"Ghost imprints and biological oddities",modes:filamentScarModes.slice(5)}
];
export const filamentScarDescriptions={
  "Off": "No traces; leave Neural Loom and every existing filament effect unchanged.",
  "Phosphor aftertrace": "Bright electrical trails slide behind recent-looking impulses along the living stitch.",
  "Lichtenberg burn": "Dark branching lightning marks crawl along activated woven fibers.",
  "Kintsugi sutures": "Fractured lines appear stitched back together with iridescent metallic light.",
  "Spectral bruising": "Soft multilayered prismatic halos make the moving nerves look chromatically bruised.",
  "Ghost knot fossils": "Tiny concentric impressions linger like nerve pulses buried in the thread.",
  "Mycelial nerve scars": "Fuzzy branching scarlets and spore-like points take over the conductive thread."
};
export const filamentScarControls=["filamentScarAmount","filamentScarDensity",
  "filamentScarPersistence","filamentScarRoughness","filamentScarGlow"];
export const filamentScarPresets=[
  {
    "name": "Afterburn silk",
    "filamentScarMode": "Phosphor aftertrace",
    "filamentScarAmount": 90,
    "filamentScarDensity": 57,
    "filamentScarPersistence": 81,
    "filamentScarRoughness": 38,
    "filamentScarGlow": 96
  },
  {
    "name": "Black lightning velvet",
    "filamentScarMode": "Lichtenberg burn",
    "filamentScarAmount": 91,
    "filamentScarDensity": 72,
    "filamentScarPersistence": 63,
    "filamentScarRoughness": 78,
    "filamentScarGlow": 55
  },
  {
    "name": "Gold-healed nervous lace",
    "filamentScarMode": "Kintsugi sutures",
    "filamentScarAmount": 93,
    "filamentScarDensity": 46,
    "filamentScarPersistence": 69,
    "filamentScarRoughness": 38,
    "filamentScarGlow": 95
  },
  {
    "name": "Opaline bruises",
    "filamentScarMode": "Spectral bruising",
    "filamentScarAmount": 95,
    "filamentScarDensity": 54,
    "filamentScarPersistence": 86,
    "filamentScarRoughness": 55,
    "filamentScarGlow": 88
  },
  {
    "name": "Ghost bobbin fossils",
    "filamentScarMode": "Ghost knot fossils",
    "filamentScarAmount": 92,
    "filamentScarDensity": 76,
    "filamentScarPersistence": 76,
    "filamentScarRoughness": 70,
    "filamentScarGlow": 77
  },
  {
    "name": "Fungal lightning scars",
    "filamentScarMode": "Mycelial nerve scars",
    "filamentScarAmount": 96,
    "filamentScarDensity": 69,
    "filamentScarPersistence": 69,
    "filamentScarRoughness": 91,
    "filamentScarGlow": 90
  }
];
export function applyFilamentScarPreset(state,name){
  const preset=filamentScarPresets.find(x=>x.name===name);
  if(!preset)return state;
  const {name:unused,...values}=preset;
  return {...state,...values,
    filamentAmount:Math.max(72,state.filamentAmount||0),
    filamentNeuralMode:state.filamentNeuralMode==="Off"?"Axon train":state.filamentNeuralMode,
    filamentNeuralAmount:Math.max(82,state.filamentNeuralAmount||0)};
}
export function remixFilamentScars(state,rng=Math.random,oddOnly=false){
  const unit=()=>{const n=Number(rng());return Number.isFinite(n)?
    Math.max(0,Math.min(1-Number.EPSILON,n)):0;};
  const choices=oddOnly?filamentScarModes.slice(4):filamentScarModes.slice(1);
  const pool=choices.filter(x=>x!==state.filamentScarMode);
  const list=pool.length?pool:choices;
  return {...state,
    filamentScarMode:list[Math.floor(unit()*list.length)],
    filamentScarAmount:78+unit()*21,
    filamentScarDensity:23+unit()*76,
    filamentScarPersistence:19+unit()*80,
    filamentScarRoughness:19+unit()*80,
    filamentScarGlow:35+unit()*64,
    filamentAmount:Math.max(72,state.filamentAmount||0),
    filamentNeuralMode:state.filamentNeuralMode==="Off"?"Axon train":state.filamentNeuralMode,
    filamentNeuralAmount:Math.max(82,state.filamentNeuralAmount||0)};
}
/** Keep only the chosen scar morphology in GPU fragment source. */
export function specializeFilamentScars(source,index){
  if(index==null||!Number.isInteger(index)||index<1||
    index>=filamentScarModes.length)return source;
  const opener=i=>i===1?"  if(filamentScarMode==1){":
    "  }else if(filamentScarMode=="+i+"){";
  const starts=filamentScarModes.slice(1).map((_,i)=>source.indexOf(opener(i+1)));
  if(starts.some((p,i)=>p<0||(i>0&&p<=starts[i-1])))return source;
  const ending=source.indexOf("  // Ghost traces are strictly confined",starts.at(-1));
  if(ending<0)return source;
  const close=source.lastIndexOf("  }\n",ending);
  if(close<starts.at(-1))return source;
  const stop=index===filamentScarModes.length-1?close:starts[index];
  const body=source.slice(starts[index-1]+opener(index).length,stop);
  return source.slice(0,starts[0])+"  if(filamentScarMode=="+index+"){"+
    body+"  }\n"+source.slice(ending);
}


/**
 * REGENERATION LOOM: deterministic daughter-fiber geometry generated from
 * the original strand distance field. Growth occurs BEFORE palette, neuro,
 * material, ornament, and surface shading. No extra history framebuffer.
 */
export const filamentRegenModes=[
  "Off",
  "Forked nerve shoots",
  "Wound bridges",
  "Mycelial fan",
  "Pearly callus",
  "Gold repair vines",
  "Synaptic grafts",
  "Darning ladders",
  "Sashiko crosshatch",
  "Coral anastomosis",
  "Axolotl frills",
  "Opal vesicle lattice",
  "Impossible graft loops"
];
export const filamentRegenFamilies=[
  {name:"Dormant",modes:filamentRegenModes.slice(0,1)},
  {name:"Mending and bifurcation",modes:filamentRegenModes.slice(1,3)},
  {name:"Biological regrowth",modes:filamentRegenModes.slice(3,5)},
  {name:"Strange repair rituals",modes:filamentRegenModes.slice(5,7)},
  {name:"Real-world mending",modes:filamentRegenModes.slice(7,9)},
  {name:"Exotic regenerative anatomy",modes:filamentRegenModes.slice(9)}
];
export const filamentRegenDescriptions={
  "Off": "Keep existing nerve scars and textile geometry untouched.",
  "Forked nerve shoots": "Bifurcating fine daughter strands sprout from the original scarred thread paths.",
  "Wound bridges": "New thin repair threads stitch across periodic breaks around stressed fibers.",
  "Mycelial fan": "Branching fungal-looking filaments fan out from existing nerve-bearing strands.",
  "Pearly callus": "Small pearl-like healing buds thicken the actual woven thread contours.",
  "Gold repair vines": "Metallic-looking tendrils grow like kintsugi repair veins from damaged fibers.",
  "Synaptic grafts": "Graft strands respond to contact with the second interwoven parent.",
  "Darning ladders": "Paired newly grown rails are stitched together by small perpendicular rescue-rungs.",
  "Sashiko crosshatch": "Diagonal X stitches grow from the damaged fiber toward a freshly formed outer rail.",
  "Coral anastomosis": "Two arched daughter filaments leave the original strand, separate, and reconnect.",
  "Axolotl frills": "A comb of translucent regenerative frills sprouts from active nerve-bearing threads.",
  "Opal vesicle lattice": "Hollow mineral vesicle loops nucleate along the living filament fringe.",
  "Impossible graft loops": "Paired countercurving daughter loops twist through each other without changing the original fabric."
};
export const filamentRegenControls=[
  "filamentRegenAmount","filamentRegenBranches","filamentRegenSpeed",
  "filamentRegenHealing","filamentRegenGlow"
];
export const filamentRegenPresets=[
  {
    "name": "Electric bifurcation",
    "filamentRegenMode": "Forked nerve shoots",
    "filamentRegenAmount": 91,
    "filamentRegenBranches": 73,
    "filamentRegenSpeed": 58,
    "filamentRegenHealing": 46,
    "filamentRegenGlow": 78
  },
  {
    "name": "Stitch the rupture",
    "filamentRegenMode": "Wound bridges",
    "filamentRegenAmount": 93,
    "filamentRegenBranches": 54,
    "filamentRegenSpeed": 52,
    "filamentRegenHealing": 91,
    "filamentRegenGlow": 71
  },
  {
    "name": "Nerve fungus bloom",
    "filamentRegenMode": "Mycelial fan",
    "filamentRegenAmount": 96,
    "filamentRegenBranches": 84,
    "filamentRegenSpeed": 37,
    "filamentRegenHealing": 54,
    "filamentRegenGlow": 92
  },
  {
    "name": "Opal callus garden",
    "filamentRegenMode": "Pearly callus",
    "filamentRegenAmount": 88,
    "filamentRegenBranches": 64,
    "filamentRegenSpeed": 43,
    "filamentRegenHealing": 76,
    "filamentRegenGlow": 82
  },
  {
    "name": "Repair witch gold",
    "filamentRegenMode": "Gold repair vines",
    "filamentRegenAmount": 94,
    "filamentRegenBranches": 78,
    "filamentRegenSpeed": 62,
    "filamentRegenHealing": 75,
    "filamentRegenGlow": 96
  },
  {
    "name": "Hybrid nerve graft",
    "filamentRegenMode": "Synaptic grafts",
    "filamentRegenAmount": 91,
    "filamentRegenBranches": 72,
    "filamentRegenSpeed": 65,
    "filamentRegenHealing": 85,
    "filamentRegenGlow": 90
  },
  {
    "name": "Ladder of the seam witch",
    "filamentRegenMode": "Darning ladders",
    "filamentRegenAmount": 90,
    "filamentRegenBranches": 55,
    "filamentRegenSpeed": 54,
    "filamentRegenHealing": 79,
    "filamentRegenGlow": 75
  },
  {
    "name": "Repair by starlight",
    "filamentRegenMode": "Sashiko crosshatch",
    "filamentRegenAmount": 94,
    "filamentRegenBranches": 64,
    "filamentRegenSpeed": 63,
    "filamentRegenHealing": 64,
    "filamentRegenGlow": 85
  },
  {
    "name": "Electric coral arteries",
    "filamentRegenMode": "Coral anastomosis",
    "filamentRegenAmount": 96,
    "filamentRegenBranches": 74,
    "filamentRegenSpeed": 46,
    "filamentRegenHealing": 89,
    "filamentRegenGlow": 92
  },
  {
    "name": "Axolotl funeral frills",
    "filamentRegenMode": "Axolotl frills",
    "filamentRegenAmount": 97,
    "filamentRegenBranches": 88,
    "filamentRegenSpeed": 35,
    "filamentRegenHealing": 86,
    "filamentRegenGlow": 95
  },
  {
    "name": "Vesicles in velvet",
    "filamentRegenMode": "Opal vesicle lattice",
    "filamentRegenAmount": 93,
    "filamentRegenBranches": 76,
    "filamentRegenSpeed": 43,
    "filamentRegenHealing": 81,
    "filamentRegenGlow": 94
  },
  {
    "name": "Graft from nowhere",
    "filamentRegenMode": "Impossible graft loops",
    "filamentRegenAmount": 97,
    "filamentRegenBranches": 68,
    "filamentRegenSpeed": 58,
    "filamentRegenHealing": 91,
    "filamentRegenGlow": 99
  }
];
export function applyFilamentRegenPreset(state,name){
  const preset=filamentRegenPresets.find(x=>x.name===name);
  if(!preset)return state;
  const {name:unused,...args}=preset;
  return {...state,...args,
    filamentAmount:Math.max(72,state.filamentAmount||0),
    filamentNeuralMode:state.filamentNeuralMode==="Off"?"Axon train":state.filamentNeuralMode,
    filamentNeuralAmount:Math.max(82,state.filamentNeuralAmount||0),
    filamentScarMode:state.filamentScarMode==="Off"?"Phosphor aftertrace":state.filamentScarMode,
    filamentScarAmount:Math.max(65,state.filamentScarAmount||0)};
}
export function remixFilamentRegeneration(state,rng=Math.random,strange=false){
  const unit=()=>{const n=Number(rng());return Number.isFinite(n)?
    Math.min(1-Number.EPSILON,Math.max(0,n)):0;};
  const modes=strange
    ? [...filamentRegenModes.slice(3,7),...filamentRegenModes.slice(9)]
    : filamentRegenModes.slice(1);
  const pool=modes.filter(x=>x!==state.filamentRegenMode);
  const choices=pool.length?pool:modes;
  return {...state,
    filamentRegenMode:choices[Math.floor(unit()*choices.length)],
    filamentRegenAmount:74+unit()*25,
    filamentRegenBranches:27+unit()*72,
    filamentRegenSpeed:18+unit()*81,
    filamentRegenHealing:26+unit()*73,
    filamentRegenGlow:35+unit()*64,
    filamentAmount:Math.max(72,state.filamentAmount||0),
    filamentNeuralMode:state.filamentNeuralMode==="Off"?"Axon train":state.filamentNeuralMode,
    filamentNeuralAmount:Math.max(82,state.filamentNeuralAmount||0),
    filamentScarMode:state.filamentScarMode==="Off"?"Phosphor aftertrace":state.filamentScarMode,
    filamentScarAmount:Math.max(65,state.filamentScarAmount||0)};
}
/** Compile only the selected geometry-creation case for Safari. */
export function specializeFilamentRegeneration(source,index){
  if(index==null||!Number.isInteger(index)||index<1||
    index>=filamentRegenModes.length)return source;
  const opener=i=>i===1?"  if(filamentRegenMode==1){":
    "  }else if(filamentRegenMode=="+i+"){";
  const starts=filamentRegenModes.slice(1).map((_,i)=>source.indexOf(opener(i+1)));
  if(starts.some((p,i)=>p<0||(i&&p<=starts[i-1])))return source;
  const ending=source.indexOf("  // Attach the new daughter geometry",starts.at(-1));
  if(ending<0)return source;
  const close=source.lastIndexOf("  }\n",ending);
  if(close<starts.at(-1))return source;
  const stop=index===filamentRegenModes.length-1?close:starts[index];
  const body=source.slice(starts[index-1]+opener(index).length,stop);
  return source.slice(0,starts[0])+
    "  if(filamentRegenMode=="+index+"){"+body+"  }\n"+
    source.slice(ending);
}

export const filamentAdornmentModes=[
  "Bare threads",
  "Pearl stations",
  "Sequin chain",
  "French knots",
  "Tassel fringe",
  "Lace picots",
  "Glass bugles",
  "Opal barnacles",
  "Electric thorns",
  "Watching eyes",
  "Mycelium spores",
  "Neon teeth",
  "Orbiting halos",
  "Diatom valves",
  "Radiolarian cages",
  "Quasicrystal jewels",
  "Prism lozenges",
  "Möbius clasps",
  "Fresnel cabochons",
  "Articulated linklets",
  "Silica honeycomb",
  "Diffraction sequins",
  "Fractal branch charms"
];
// Fixed, deliberately small species pools preserve mobile shader pruning.
// IDs are stable indices in filamentAdornmentModes.
export const jewelryColonyModes=["Uniform jewelry","Silica aquarium","Crystal carnival","Alien microbiome","Mathematical reliquary","Haunted haberdashery","Mixed optical zoo"];
export const jewelryColonyPools=[[],[13,14,20],[15,16,21],[7,10,22],[17,18,19],[3,4,9],[13,16,22]];
export const jewelryColonyControls=["filamentAdornmentColony","filamentAdornmentDiversity","filamentAdornmentSizeVariance","filamentAdornmentFinishVariance","filamentAdornmentAnatomyVariance"];
export function remixJewelryColony(state,rng=Math.random){
 const unit=()=>{const n=Number(rng());return Number.isFinite(n)?Math.max(0,Math.min(1-Number.EPSILON,n)):0;};
 const pool=jewelryColonyModes.slice(1).filter(x=>x!==state.filamentAdornmentColony);
 return {...state,filamentAdornmentColony:pool[Math.floor(unit()*pool.length)],
   filamentAdornmentDiversity:55+unit()*45,filamentAdornmentSizeVariance:25+unit()*75,
   filamentAdornmentFinishVariance:25+unit()*75,filamentAdornmentAnatomyVariance:25+unit()*75};
}
export const jewelryInteriorModes=["Native ornament","Diatom puncta","Hexagonal fenestrae","Radiolarian ribs","Nested crystal chambers","Gyroid windows","Quasicrystal tracery","Moiré engraving","Fractal vein inlay","Fresnel microgrooves"];
export const jewelryInteriorControls=["filamentAdornmentInterior","filamentAdornmentInteriorAmount","filamentAdornmentInteriorDensity","filamentAdornmentInteriorOpenwork","filamentAdornmentInteriorDrift"];
export function remixJewelryInterior(state,rng=Math.random){
 const unit=()=>{const n=Number(rng());return Number.isFinite(n)?Math.max(0,Math.min(1-Number.EPSILON,n)):0;};
 const pool=jewelryInteriorModes.slice(1).filter(x=>x!==state.filamentAdornmentInterior);
 return {...state,filamentAdornmentInterior:pool[Math.floor(unit()*pool.length)],
   filamentAdornmentInteriorAmount:65+unit()*35,filamentAdornmentInteriorDensity:28+unit()*72,
   filamentAdornmentInteriorOpenwork:15+unit()*85,filamentAdornmentInteriorDrift:25+unit()*75};
}
export const jewelryFinishModes=["Original jewelry","Dichroic enamel","Opal cabochon","Faceted zircon","Brushed mercury","Frosted silica","Nacre scales","Diffraction foil","Spectral obsidian"];
export const jewelryFinishControls=["filamentAdornmentFinish","filamentAdornmentFinishAmount","filamentAdornmentFilm","filamentAdornmentFacet","filamentAdornmentPolish"];
export function remixJewelryFinish(state,rng=Math.random){
 const unit=()=>{const n=Number(rng());return Number.isFinite(n)?Math.max(0,Math.min(1-Number.EPSILON,n)):0;};
 const pool=jewelryFinishModes.slice(1).filter(x=>x!==state.filamentAdornmentFinish);
 return {...state,filamentAdornmentFinish:pool[Math.floor(unit()*pool.length)],
   filamentAdornmentFinishAmount:60+unit()*40,filamentAdornmentFilm:12+unit()*88,
   filamentAdornmentFacet:20+unit()*80,filamentAdornmentPolish:25+unit()*75};
}
export const jewelryPlacementModes=["Original stations","Alternating links","Quasiperiodic necklace","Clustered constellations","Graduated bead runs","Migrating clusters","Resonant nodes"];
export const jewelryKineticModes=["Original movement","Traveling procession","Counterflow relay","Breathing collars","Pendulum swing","Phase shimmer","Stop-and-go stitching"];
export const jewelryChoreographyControls=["filamentAdornmentPlacement","filamentAdornmentKinetics","filamentAdornmentPopulation","filamentAdornmentRhythm"];
export function remixJewelryChoreography(state,rng=Math.random,part="all"){
  const unit=()=>{const n=Number(rng());return Number.isFinite(n)?Math.max(0,Math.min(1-Number.EPSILON,n)):0;};
  const pick=(modes,old)=>{const pool=modes.slice(1).filter(x=>x!==old);return pool[Math.floor(unit()*pool.length)];};
  const next={...state};
  if(part!=="motion"){
    next.filamentAdornmentPlacement=pick(jewelryPlacementModes,state.filamentAdornmentPlacement);
    next.filamentAdornmentPopulation=35+unit()*65;
  }
  if(part!=="placement"){
    next.filamentAdornmentKinetics=pick(jewelryKineticModes,state.filamentAdornmentKinetics);
    next.filamentAdornmentRhythm=35+unit()*65;
  }
  return next;
}
export const mathematicalAdornmentModes=filamentAdornmentModes.slice(13);
export const filamentAdornmentFamilies=[
  {name:"Unadorned",modes:filamentAdornmentModes.slice(0,1)},
  {name:"Classic haberdashery",modes:filamentAdornmentModes.slice(1,7)},
  {name:"Gothic alien couture",modes:filamentAdornmentModes.slice(7,13)},
  {name:"Mathematical glass & micro-jewelry",modes:mathematicalAdornmentModes}
];
export const filamentAdornmentDescriptions={
  "Bare threads":"No additional objects are attached to the fibers.",
  "Pearl stations":"Small glossy pearl mounts decorate the real thread path.",
  "Sequin chain":"Alternating foil discs flash as the stitched fabric moves.",
  "French knots":"Raised twisted knots collect in a lively pointillist rhythm.",
  "Tassel fringe":"Threadlike tassel tips comb the sides of the woven filaments.",
  "Lace picots":"Tiny open loops and picots embellish the lace edge.",
  "Glass bugles":"Long narrow glass beads glint along their stitched carrier.",
  "Opal barnacles":"Pearlescent ringed shells accrete on the seam.",
  "Electric thorns":"Voltage-sharp needles sprout along each living filament.",
  "Watching eyes":"Little chromatic iris-and-pupil charms track the passing light.",
  "Mycelium spores":"Fungal spores bud and pulse at seeded fiber junctions.",
  "Neon teeth":"A tiny luminous zipper jaw snaps open and shut.",
  "Orbiting halos":"Phase-shifted halo collars pass along the moving thread.",
  "Diatom valves":"Ribbed silica capsules with alternating tiny perforations.",
  "Radiolarian cages":"Nested geometric silica rims and moving spoke junctions.",
  "Quasicrystal jewels":"Five-direction interference etched into angular bead stations.",
  "Prism lozenges":"Faceted diamond beads with traveling spectral highlights.",
  "Möbius clasps":"Twisting paired ribbon loops that exchange apparent depth.",
  "Fresnel cabochons":"Nested optical rings with moving focal bands.",
  "Articulated linklets":"Linked angular collars that bend with a traveling phase.",
  "Silica honeycomb":"Tiny hexagonal window lattices on the thread.",
  "Diffraction sequins":"Fine crossed gratings with changing colored flashes.",
  "Fractal branch charms":"Nested branching filigree with pulsing junctions."
};
export const filamentAdornmentControls=[
  "filamentAdornmentAmount","filamentAdornmentSpacing",
  "filamentAdornmentSize","filamentAdornmentMotion","filamentAdornmentGlow"
];
export const filamentAdornmentPresets=[
  {name:"Pearl heirloom",filamentAdornmentMode:"Pearl stations",
    filamentSecondAdornmentMode:"Lace picots",filamentAdornmentAmount:84,
    filamentAdornmentSpacing:46,filamentAdornmentSize:43,
    filamentAdornmentMotion:18,filamentAdornmentGlow:70},
  {name:"Disco sequin blizzard",filamentAdornmentMode:"Sequin chain",
    filamentSecondAdornmentMode:"Glass bugles",filamentAdornmentAmount:96,
    filamentAdornmentSpacing:79,filamentAdornmentSize:69,
    filamentAdornmentMotion:81,filamentAdornmentGlow:99},
  {name:"French-knot tapestry",filamentAdornmentMode:"French knots",
    filamentSecondAdornmentMode:"Pearl stations",filamentAdornmentAmount:89,
    filamentAdornmentSpacing:75,filamentAdornmentSize:36,
    filamentAdornmentMotion:34,filamentAdornmentGlow:71},
  {name:"Possessed tassels",filamentAdornmentMode:"Tassel fringe",
    filamentSecondAdornmentMode:"Neon teeth",filamentAdornmentAmount:95,
    filamentAdornmentSpacing:56,filamentAdornmentSize:88,
    filamentAdornmentMotion:72,filamentAdornmentGlow:84},
  {name:"Picot wedding veil",filamentAdornmentMode:"Lace picots",
    filamentSecondAdornmentMode:"French knots",filamentAdornmentAmount:80,
    filamentAdornmentSpacing:82,filamentAdornmentSize:48,
    filamentAdornmentMotion:24,filamentAdornmentGlow:65},
  {name:"Crystal buglework",filamentAdornmentMode:"Glass bugles",
    filamentSecondAdornmentMode:"Sequin chain",filamentAdornmentAmount:97,
    filamentAdornmentSpacing:51,filamentAdornmentSize:71,
    filamentAdornmentMotion:61,filamentAdornmentGlow:92},
  {name:"Barnacle bride",filamentAdornmentMode:"Opal barnacles",
    filamentSecondAdornmentMode:"Mycelium spores",filamentAdornmentAmount:93,
    filamentAdornmentSpacing:67,filamentAdornmentSize:83,
    filamentAdornmentMotion:37,filamentAdornmentGlow:91},
  {name:"Voltage crown",filamentAdornmentMode:"Electric thorns",
    filamentSecondAdornmentMode:"Orbiting halos",filamentAdornmentAmount:96,
    filamentAdornmentSpacing:57,filamentAdornmentSize:92,
    filamentAdornmentMotion:91,filamentAdornmentGlow:100},
  {name:"A thousand tiny witnesses",filamentAdornmentMode:"Watching eyes",
    filamentSecondAdornmentMode:"Opal barnacles",filamentAdornmentAmount:94,
    filamentAdornmentSpacing:77,filamentAdornmentSize:72,
    filamentAdornmentMotion:65,filamentAdornmentGlow:78},
  {name:"Fungal bridal jewelry",filamentAdornmentMode:"Mycelium spores",
    filamentSecondAdornmentMode:"Lace picots",filamentAdornmentAmount:97,
    filamentAdornmentSpacing:85,filamentAdornmentSize:62,
    filamentAdornmentMotion:83,filamentAdornmentGlow:95},
  {name:"Teeth of the machine",filamentAdornmentMode:"Neon teeth",
    filamentSecondAdornmentMode:"Electric thorns",filamentAdornmentAmount:99,
    filamentAdornmentSpacing:66,filamentAdornmentSize:92,
    filamentAdornmentMotion:77,filamentAdornmentGlow:100},
  {name:"Sacred halo relay",filamentAdornmentMode:"Orbiting halos",
    filamentSecondAdornmentMode:"Watching eyes",filamentAdornmentAmount:94,
    filamentAdornmentSpacing:56,filamentAdornmentSize:84,
    filamentAdornmentMotion:71,filamentAdornmentGlow:98},
  ...mathematicalAdornmentModes.map((mode,n)=>({name:["Diatom bridal filigree","Radiolarian reliquary","Aperiodic crown","Prism chain","Impossible clasps","Fresnel heirloom","Mechanical lace","Honeycomb reliquary","Diffraction disco","Fractal trinkets"][n],filamentAdornmentMode:mode,
    filamentSecondAdornmentMode:mathematicalAdornmentModes[(n+3)%mathematicalAdornmentModes.length],
    filamentAdornmentAmount:92,filamentAdornmentSpacing:48+n%4*11,filamentAdornmentSize:55+n%3*13,
    filamentAdornmentMotion:55+n%4*10,filamentAdornmentGlow:84}))
];
export function applyFilamentAdornmentPreset(state,name){
  const preset=filamentAdornmentPresets.find(x=>x.name===name);
  if(!preset)return state;
  const {name:label,...adornment}=preset;
  return {...state,filamentAdornmentPlacement:"Original stations",filamentAdornmentKinetics:"Original movement",filamentAdornmentFinish:"Original jewelry",filamentAdornmentInterior:"Native ornament",filamentAdornmentColony:"Uniform jewelry",...adornment,filamentAmount:Math.max(60,state.filamentAmount||0)};
}
export function remixFilamentAdornments(state,rng=Math.random,onlyWeird=false){
  const unit=()=>{const n=Number(rng());return Number.isFinite(n)?
    Math.min(1-Number.EPSILON,Math.max(0,n)):0;};
  const set=onlyWeird==="mathematical"?mathematicalAdornmentModes:onlyWeird?filamentAdornmentModes.slice(7):filamentAdornmentModes.slice(1);
  const pick=old=>{const pool=set.filter(x=>x!==old);
    return pool[Math.floor(unit()*pool.length)];};
  return {...state,filamentAdornmentMode:pick(state.filamentAdornmentMode),
    filamentSecondAdornmentMode:pick(state.filamentSecondAdornmentMode),
    filamentAmount:Math.max(65,state.filamentAmount||0),
    filamentAdornmentAmount:Math.max(82,state.filamentAdornmentAmount||0),
    filamentAdornmentSpacing:28+unit()*70,
    filamentAdornmentSize:36+unit()*62,
    filamentAdornmentMotion:20+unit()*78,
    filamentAdornmentGlow:54+unit()*45};
}
/** One press dresses and jewels BOTH parents without changing their pattern,
 * clocks, thread species, text, colors or underlying mathematical artwork. */
export function remixThreadCouture(state,rng=Math.random,onlyWeird=false){
  const fibers=onlyWeird?remixUnusualFilamentMaterials(state,rng):
    remixFilamentMaterials(state,rng);
  return remixFilamentAdornments(fibers,rng,onlyWeird);
}

export function specializeFilamentAdornments(source,first,second=null,colony=0){
  if(first==null||!Number.isInteger(first)||first<0||
    first>=filamentAdornmentModes.length)return source;
  const ids=[first,...(second==null?[]:[second])];
  if(ids.some(n=>!Number.isInteger(n)||n<0||n>=filamentAdornmentModes.length))
    return source;
  const opener=n=>n===1?"  if(adornmentMode==1){":
    "  }else if(adornmentMode=="+n+"){";
  const starts=filamentAdornmentModes.slice(1)
    .map((_,i)=>source.indexOf(opener(i+1)));
  if(starts.some((n,i)=>n<0||(i>0&&n<=starts[i-1])))return source;
  const fallback=source.indexOf("  }else{ // Unsupported adornment mode",starts.at(-1));
  const end=source.indexOf("  // Paint trinkets on real filament geometry",fallback);
  if(fallback<0||end<=fallback)return source;
  const chosen=[...new Set([...ids.filter(n=>n>0),...(ids.some(n=>n>0)?jewelryColonyPools[colony]||[]:[])])].sort((a,b)=>a-b);
  if(!chosen.length)return source.slice(0,starts[0])+
    "  trinket=0.0;\n  sparkle=0.0;\n"+source.slice(end);
  const branches=chosen.map((n,k)=>{
    const finish=n===filamentAdornmentModes.length-1?fallback:starts[n];
    return (k===0?"  if(adornmentMode=="+n+"){":
      "  }else if(adornmentMode=="+n+"){")+
      source.slice(starts[n-1]+opener(n).length,finish);
  }).join("");
  return source.slice(0,starts[0])+branches+source.slice(fallback,end)+source.slice(end);
}


/** A five-grid de Bruijn-inspired quasiperiodic thread family, not the old sine-sum brocade. */
export const quasicrystalBrocadeControls=[
  "filamentQuasiSpacing","filamentQuasiPhason","filamentQuasiDrift",
  "filamentQuasiRelief","filamentQuasiElevation","filamentQuasiOrnament"
];
export const quasicrystalBrocadePresets=[
  {name:"Quasi — Heirloom pentagrid",filamentQuasiSpacing:41,filamentQuasiPhason:13,
    filamentQuasiDrift:12,filamentQuasiRelief:63,filamentQuasiElevation:48,filamentQuasiOrnament:33},
  {name:"Quasi — Golden cathedral",filamentQuasiSpacing:62,filamentQuasiPhason:38,
    filamentQuasiDrift:27,filamentQuasiRelief:90,filamentQuasiElevation:82,filamentQuasiOrnament:74},
  {name:"Quasi — Alien silk circuit",filamentQuasiSpacing:77,filamentQuasiPhason:67,
    filamentQuasiDrift:63,filamentQuasiRelief:77,filamentQuasiElevation:61,filamentQuasiOrnament:91},
  {name:"Quasi — Phason ghost lace",filamentQuasiSpacing:29,filamentQuasiPhason:85,
    filamentQuasiDrift:92,filamentQuasiRelief:52,filamentQuasiElevation:39,filamentQuasiOrnament:76},
  {name:"Quasi — Opal star-brocade",filamentQuasiSpacing:55,filamentQuasiPhason:48,
    filamentQuasiDrift:46,filamentQuasiRelief:100,filamentQuasiElevation:100,filamentQuasiOrnament:100},
  {name:"Quasi — Impossible textile ruin",filamentQuasiSpacing:96,filamentQuasiPhason:99,
    filamentQuasiDrift:86,filamentQuasiRelief:98,filamentQuasiElevation:86,filamentQuasiOrnament:96},
];
export function applyQuasicrystalBrocadePreset(state,name){
  const p=quasicrystalBrocadePresets.find(p=>p.name===name);
  if(!p)return state;
  const {name:label,...settings}=p;
  return {...state,...settings,filamentSpecies:"Quasicrystal Brocade",
    filamentAmount:Math.max(70,state.filamentAmount||0)};
}
export function remixQuasicrystalBrocade(state,rng=Math.random){
  const unit=()=>{const n=Number(rng());return Number.isFinite(n)?Math.max(0,Math.min(.999999,n)):0;};
  return {...state,filamentSpecies:"Quasicrystal Brocade",
    filamentAmount:Math.max(75,state.filamentAmount||0),
    filamentQuasiSpacing:20+unit()*80,filamentQuasiPhason:unit()*100,
    filamentQuasiDrift:unit()*100,filamentQuasiRelief:35+unit()*65,
    filamentQuasiElevation:30+unit()*70,filamentQuasiOrnament:unit()*100};
}

export const filamentStitchModes=[
  "Needle chase",
  "Loom sweep",
  "Running stitch",
  "Purl breathing",
  "Unfurl & resew",
  "Helix handoff",
  "Knot cascade",
  "Synaptic firing",
  "Alien Morse",
  "Coral accretion",
  "Tidal darning",
  "Fractal infestation",
  "Reverse unpick",
  "Ricochet needle",
  "Wormhole crochet",
  "Parasite hem",
  "Oracle tacking",
  "Spasm tatting",
  "Hologram darning",
  "Ritual overlock",
  "Witch-knot relay",
  "Chain stitch",
  "Cross-stitch",
  "Satin fill",
  "Blanket stitch",
  "Feather stitch",
  "Cable knit",
  "Ghost bobbin",
  "Quantum unpick",
  "Mutant zipper",
  "Fractal mending",
  "Chladni Needle Orchestra",
  "Retrocausal Embroidery",
];
// Human-facing organization only; saved names and numerical shader IDs
// for the original five motions are preserved exactly.
export const filamentStitchFamilies=[
  {name:"Classic self-weaving",modes:filamentStitchModes.slice(0,5)},
  {name:"Alien signals & impossible crochet",modes:[
    "Synaptic firing","Alien Morse","Fractal infestation","Wormhole crochet"]},
  {name:"Organic growth & living stitches",modes:[
    "Knot cascade","Coral accretion","Tidal darning"]},
  {name:"Kinetic sewing machines",modes:[
    "Helix handoff","Reverse unpick","Ricochet needle"]},
  {name:"Funky ritual & parasite stitching",modes:filamentStitchModes.slice(15,21)},
  {name:"Traditional embroidery & knitting",modes:filamentStitchModes.slice(21,27)},
  {name:"Haunted sewing machines",modes:filamentStitchModes.slice(27)},
];
export const ritualFilamentStitchModes=filamentStitchModes.slice(15,21);
export function remixRitualStitches(state,rng=Math.random){
  const unit=()=>{const n=Number(rng());return Number.isFinite(n)?
    Math.min(1-Number.EPSILON,Math.max(0,n)):0;};
  const options=ritualFilamentStitchModes.filter(x=>x!==state.filamentStitchMode);
  const pool=options.length?options:ritualFilamentStitchModes;
  return {...state,filamentStitchMode:pool[Math.floor(unit()*pool.length)],
    filamentAmount:Math.max(65,state.filamentAmount||0),
    filamentStitchAmount:Math.max(83,state.filamentStitchAmount||0),
    filamentStitchSpeed:40+Math.floor(unit()*59),
    filamentStitchLength:26+Math.floor(unit()*73),
    filamentStitchGlow:67+Math.floor(unit()*32)};
}

export const newFilamentStitchModes=filamentStitchModes.slice(5);
export const filamentStitchDescriptions={
  "Needle chase":"A bright needle tip advances along a short traveling thread.",
  "Loom sweep":"A broad shuttle draws fibers through the cloth in waves.",
  "Running stitch":"Separate stitched segments chase along the existing paths.",
  "Purl breathing":"The stitch loops inhale and exhale along the actual yarn.",
  "Unfurl & resew":"The fabric builds edge-to-edge, then gracefully unwinds.",
  "Helix handoff":"Two alternating helical needle carriers pass luminous thread.",
  "Knot cascade":"Individual sewn knots fire in a cascading sequence.",
  "Synaptic firing":"Axonal bursts travel through the lace with luminous afterglow.",
  "Alien Morse":"An encoded procession of long and short light stitches.",
  "Coral accretion":"Nested living reef rings build and dissolve across the fiber.",
  "Tidal darning":"Interfering oceanic wavefronts stitch crossing soft seams.",
  "Fractal infestation":"Small growth fronts spark within larger recursive advances.",
  "Reverse unpick":"A migrating repair gap unravels and stitches itself back.",
  "Ricochet needle":"One needle races back and forth, bouncing at seam ends.",
  "Wormhole crochet":"Logarithmic spiral sutures travel around impossible loops.",
  "Parasite hem":"A crawling invasion front branches and overtakes the sewn edge.",
  "Oracle tacking":"Ritual seed-coded knots blink in rotating radial sequences.",
  "Spasm tatting":"Nervous thread pulses twitch between irregularly spaced loops.",
  "Hologram darning":"Two phase-shifted virtual stitch grids alternate in shimmering scans.",
  "Ritual overlock":"Countermoving serpentine edge stitches overtake the yarn.",
  "Witch-knot relay":"Sequential knotted signal packets pass through a cyclic chain.",
  "Chain stitch":"Interlocking loops climb along the real yarn in a rhythmic procession.",
  "Cross-stitch":"Alternating X-shaped stitch beats sew a classic patterned rhythm.",
  "Satin fill":"Closely packed satin strokes shimmer as the thread is laid down.",
  "Blanket stitch":"Edge-wrapping loops tighten around the filament in rows.",
  "Feather stitch":"Feathery mirrored needle passes zigzag along the strand.",
  "Cable knit":"Interleaved cable stitches seem to roll over and under each other.",
  "Ghost bobbin":"An invisible shuttle intermittently reveals luminous absent stitches.",
  "Quantum unpick":"Sutures flicker between sewn and unsewn states in a double-beat wave.",
  "Mutant zipper":"Two serrated lips latch and unlatch with a hunting metal tooth.",
  "Fractal mending":"Repairs recursively split into miniature repairs along each thread.",
  "Chladni Needle Orchestra":"Actual needles and thread reveal follow moving standing-wave nodes, detuned into vibrating Chladni embroidery.",
  "Retrocausal Embroidery":"Future-looking analytic stitch echoes appear BEFORE a needle arrives, with temporally reversed seam packets and anticipatory knots. Deterministic, not real time travel.",
};
export function remixFilamentStitchMotion(state,rng=Math.random,onlyNew=false){
  const unit=()=>{
    const n=Number(rng());
    return Number.isFinite(n)?Math.max(0,Math.min(1-Number.EPSILON,n)):0;
  };
  const set=onlyNew?newFilamentStitchModes:filamentStitchModes;
  const candidates=set.filter(mode=>mode!==state.filamentStitchMode);
  const choices=candidates.length?candidates:set;
  return {...state,
    filamentStitchMode:choices[Math.floor(unit()*choices.length)],
    filamentStitchAmount:Math.max(78,state.filamentStitchAmount||0),
    filamentAmount:Math.max(65,state.filamentAmount||0),
    filamentStitchSpeed:24+unit()*74,
    filamentStitchLength:18+unit()*79,
    filamentStitchGlow:55+unit()*44};
}
/**
 * Keep Safari's shader size approximately constant as the stitch zoo grows.
 * Only the *selected* stitch-motion branch is compiled (or none if disabled).
 * Existing geometry specialization and dual-filament hybrid shader remain.
 */
export function specializeFilamentStitchMotion(source,index){
  if(index==null||!Number.isInteger(index)||index<0||
     index>=filamentStitchModes.length)return source;
  const opener=n=>n===0?"  if(filamentStitchMode==0){":
    "  }else if(filamentStitchMode=="+n+"){";
  const starts=filamentStitchModes.map((_,n)=>source.indexOf(opener(n)));
  if(starts.some((pos,n)=>pos<0||(n>0&&pos<=starts[n-1])))return source;
  const fallback=source.indexOf(
    "  }else{ // Invalid stored mode",starts[starts.length-1]);
  const end=source.indexOf("  // Apply to all three geometry masks",fallback);
  if(fallback<0||end<=fallback)return source;
  const stop=index===starts.length-1?fallback:starts[index+1];
  const body=source.slice(starts[index]+opener(index).length,stop);
  return source.slice(0,starts[0])+
    "  if(filamentStitchMode=="+index+"){"+body+
    source.slice(fallback,end)+source.slice(end);
}
export const filamentStitchControls=[
  // Four universal stitch controls, maintained for every legacy preset.
  "filamentStitchAmount","filamentStitchSpeed",
  "filamentStitchLength","filamentStitchGlow"
];
export const filamentStitchPresets=[
  {name:"Electric needle chase",filamentStitchMode:"Needle chase",
    filamentStitchAmount:92,filamentStitchSpeed:62,
    filamentStitchLength:31,filamentStitchGlow:95},
  {name:"Witch's loom shuttle",filamentStitchMode:"Loom sweep",
    filamentStitchAmount:94,filamentStitchSpeed:43,
    filamentStitchLength:44,filamentStitchGlow:70},
  {name:"Running stitch pulse",filamentStitchMode:"Running stitch",
    filamentStitchAmount:89,filamentStitchSpeed:77,
    filamentStitchLength:61,filamentStitchGlow:81},
  {name:"Velvet breathing lattice",filamentStitchMode:"Purl breathing",
    filamentStitchAmount:84,filamentStitchSpeed:36,
    filamentStitchLength:73,filamentStitchGlow:61},
  {name:"Unfurl the impossible",filamentStitchMode:"Unfurl & resew",
    filamentStitchAmount:97,filamentStitchSpeed:47,
    filamentStitchLength:55,filamentStitchGlow:91},
  {name:"Twisted signal relay",filamentStitchMode:"Helix handoff",
    filamentStitchAmount:94,filamentStitchSpeed:68,
    filamentStitchLength:45,filamentStitchGlow:96},
  {name:"Knot infestation",filamentStitchMode:"Knot cascade",
    filamentStitchAmount:95,filamentStitchSpeed:79,
    filamentStitchLength:56,filamentStitchGlow:89},
  {name:"Electric synapse embroidery",filamentStitchMode:"Synaptic firing",
    filamentStitchAmount:97,filamentStitchSpeed:83,
    filamentStitchLength:32,filamentStitchGlow:99},
  {name:"Signals from the Others",filamentStitchMode:"Alien Morse",
    filamentStitchAmount:96,filamentStitchSpeed:59,
    filamentStitchLength:74,filamentStitchGlow:97},
  {name:"Reef skeleton tapestry",filamentStitchMode:"Coral accretion",
    filamentStitchAmount:92,filamentStitchSpeed:50,
    filamentStitchLength:78,filamentStitchGlow:88},
  {name:"Drowned velvet repair",filamentStitchMode:"Tidal darning",
    filamentStitchAmount:91,filamentStitchSpeed:41,
    filamentStitchLength:80,filamentStitchGlow:84},
  {name:"Recursive organism stitches",filamentStitchMode:"Fractal infestation",
    filamentStitchAmount:97,filamentStitchSpeed:77,
    filamentStitchLength:35,filamentStitchGlow:95},
  {name:"Unpick the universe",filamentStitchMode:"Reverse unpick",
    filamentStitchAmount:93,filamentStitchSpeed:64,
    filamentStitchLength:44,filamentStitchGlow:93},
  {name:"Ricochet couture",filamentStitchMode:"Ricochet needle",
    filamentStitchAmount:96,filamentStitchSpeed:87,
    filamentStitchLength:32,filamentStitchGlow:99},
  {name:"Crochet through a portal",filamentStitchMode:"Wormhole crochet",
    filamentStitchAmount:94,filamentStitchSpeed:72,
    filamentStitchLength:67,filamentStitchGlow:96},
  {"name":"Invasive Hem Organism","filamentStitchMode":"Parasite hem","filamentStitchAmount":92,"filamentStitchSpeed":62,"filamentStitchLength":38,"filamentStitchGlow":82},
  {"name":"Prophet's Needle","filamentStitchMode":"Oracle tacking","filamentStitchAmount":94,"filamentStitchSpeed":69,"filamentStitchLength":49,"filamentStitchGlow":89},
  {"name":"Spasm Lace Possession","filamentStitchMode":"Spasm tatting","filamentStitchAmount":96,"filamentStitchSpeed":76,"filamentStitchLength":60,"filamentStitchGlow":96},
  {"name":"Darning a Hologram","filamentStitchMode":"Hologram darning","filamentStitchAmount":92,"filamentStitchSpeed":83,"filamentStitchLength":71,"filamentStitchGlow":85},
  {"name":"Ritual Seam Summons","filamentStitchMode":"Ritual overlock","filamentStitchAmount":94,"filamentStitchSpeed":90,"filamentStitchLength":82,"filamentStitchGlow":92},
  {"name":"Witch Knot Transmission","filamentStitchMode":"Witch-knot relay","filamentStitchAmount":96,"filamentStitchSpeed":63,"filamentStitchLength":93,"filamentStitchGlow":99},
  {name:"Gilded chain couture",
    filamentStitchMode:"Chain stitch",filamentStitchAmount:90,
    filamentStitchSpeed:38,filamentStitchLength:38,filamentStitchGlow:65},
  {name:"Pixel cross-stitch",
    filamentStitchMode:"Cross-stitch",filamentStitchAmount:93,
    filamentStitchSpeed:43,filamentStitchLength:43,filamentStitchGlow:68},
  {name:"Spectral satin work",
    filamentStitchMode:"Satin fill",filamentStitchAmount:96,
    filamentStitchSpeed:48,filamentStitchLength:48,filamentStitchGlow:71},
  {name:"Heirloom blanket hem",
    filamentStitchMode:"Blanket stitch",filamentStitchAmount:90,
    filamentStitchSpeed:53,filamentStitchLength:53,filamentStitchGlow:74},
  {name:"Feathered alien sampler",
    filamentStitchMode:"Feather stitch",filamentStitchAmount:93,
    filamentStitchSpeed:58,filamentStitchLength:58,filamentStitchGlow:77},
  {name:"Cabled sweater nebula",
    filamentStitchMode:"Cable knit",filamentStitchAmount:96,
    filamentStitchSpeed:63,filamentStitchLength:63,filamentStitchGlow:80},
  {name:"The ghost bobbin",
    filamentStitchMode:"Ghost bobbin",filamentStitchAmount:90,
    filamentStitchSpeed:68,filamentStitchLength:68,filamentStitchGlow:83},
  {name:"Quantum seam ripper",
    filamentStitchMode:"Quantum unpick",filamentStitchAmount:93,
    filamentStitchSpeed:73,filamentStitchLength:73,filamentStitchGlow:86},
  {name:"Zipper beast",
    filamentStitchMode:"Mutant zipper",filamentStitchAmount:96,
    filamentStitchSpeed:78,filamentStitchLength:78,filamentStitchGlow:89},
  {name:"Recursive repair ritual",
    filamentStitchMode:"Fractal mending",filamentStitchAmount:90,
    filamentStitchSpeed:83,filamentStitchLength:83,filamentStitchGlow:92},
  {name:"Chladni — Violin plate",filamentStitchMode:"Chladni Needle Orchestra",
    filamentStitchAmount:93,filamentStitchSpeed:38,filamentStitchLength:55,filamentStitchGlow:80,
    filamentChladniOrder:22,filamentChladniResonance:72,filamentChladniDensity:78,
    filamentChladniPhase:16,filamentChladniDetune:8},
  {name:"Chladni — Cymatic samplers",filamentStitchMode:"Chladni Needle Orchestra",
    filamentStitchAmount:96,filamentStitchSpeed:51,filamentStitchLength:46,filamentStitchGlow:88,
    filamentChladniOrder:52,filamentChladniResonance:89,filamentChladniDensity:66,
    filamentChladniPhase:39,filamentChladniDetune:33},
  {name:"Chladni — Detuned bell choir",filamentStitchMode:"Chladni Needle Orchestra",
    filamentStitchAmount:97,filamentStitchSpeed:73,filamentStitchLength:63,filamentStitchGlow:94,
    filamentChladniOrder:43,filamentChladniResonance:98,filamentChladniDensity:82,
    filamentChladniPhase:68,filamentChladniDetune:78},
  {name:"Chladni — Broken eigenmode",filamentStitchMode:"Chladni Needle Orchestra",
    filamentStitchAmount:100,filamentStitchSpeed:82,filamentStitchLength:32,filamentStitchGlow:97,
    filamentChladniOrder:92,filamentChladniResonance:96,filamentChladniDensity:96,
    filamentChladniPhase:84,filamentChladniDetune:97},
  {name:"Chladni — Ghost diapason",filamentStitchMode:"Chladni Needle Orchestra",
    filamentStitchAmount:86,filamentStitchSpeed:24,filamentStitchLength:81,filamentStitchGlow:70,
    filamentChladniOrder:72,filamentChladniResonance:56,filamentChladniDensity:89,
    filamentChladniPhase:11,filamentChladniDetune:17},

  {name:"Retrocausal — Ghost of tomorrow",filamentStitchMode:"Retrocausal Embroidery",
    filamentStitchAmount:94,filamentStitchSpeed:41,filamentStitchLength:52,filamentStitchGlow:88,
    filamentRetroLead:76,filamentRetroEcho:71,filamentRetroParadox:29,
    filamentRetroKnots:43,filamentRetroReversal:12,filamentRetroCoherence:81},
  {name:"Retrocausal — Knots before thread",filamentStitchMode:"Retrocausal Embroidery",
    filamentStitchAmount:97,filamentStitchSpeed:53,filamentStitchLength:35,filamentStitchGlow:98,
    filamentRetroLead:61,filamentRetroEcho:47,filamentRetroParadox:71,
    filamentRetroKnots:100,filamentRetroReversal:19,filamentRetroCoherence:62},
  {name:"Retrocausal — Reverse causality loom",filamentStitchMode:"Retrocausal Embroidery",
    filamentStitchAmount:96,filamentStitchSpeed:72,filamentStitchLength:62,filamentStitchGlow:91,
    filamentRetroLead:79,filamentRetroEcho:89,filamentRetroParadox:94,
    filamentRetroKnots:66,filamentRetroReversal:91,filamentRetroCoherence:55},
  {name:"Retrocausal — Phantom seam ledger",filamentStitchMode:"Retrocausal Embroidery",
    filamentStitchAmount:91,filamentStitchSpeed:29,filamentStitchLength:84,filamentStitchGlow:65,
    filamentRetroLead:52,filamentRetroEcho:96,filamentRetroParadox:18,
    filamentRetroKnots:36,filamentRetroReversal:48,filamentRetroCoherence:94},
  {name:"Retrocausal — Paradox cathedral",filamentStitchMode:"Retrocausal Embroidery",
    filamentStitchAmount:100,filamentStitchSpeed:83,filamentStitchLength:70,filamentStitchGlow:100,
    filamentRetroLead:99,filamentRetroEcho:98,filamentRetroParadox:100,
    filamentRetroKnots:90,filamentRetroReversal:77,filamentRetroCoherence:27},
  {name:"Retrocausal — Quiet predestination",filamentStitchMode:"Retrocausal Embroidery",
    filamentStitchAmount:87,filamentStitchSpeed:20,filamentStitchLength:69,filamentStitchGlow:61,
    filamentRetroLead:41,filamentRetroEcho:31,filamentRetroParadox:7,
    filamentRetroKnots:27,filamentRetroReversal:2,filamentRetroCoherence:97},
];
export function applyFilamentStitchPreset(state,name){
 const preset=filamentStitchPresets.find(p=>p.name===name);
 if(!preset)return state;
 const {name:label,...stitch}=preset;
 return {...state,...stitch,filamentAmount:Math.max(55,state.filamentAmount||0)};
}

/** Structure-only Jacquard manipulation, leaving existing 22 species untouched. */
export const feralJacquardControls=[
  "filamentFeralCorruption","filamentFeralMigration","filamentFeralOrder",
  "filamentFeralKnots","filamentFeralMutation"
];
export const feralJacquardPresets=[
  {name:"Feral — Heirloom gone feral",filamentFeralCorruption:14,
    filamentFeralMigration:24,filamentFeralOrder:93,filamentFeralKnots:28,filamentFeralMutation:16},
  {name:"Feral — Crawling damask",filamentFeralCorruption:41,
    filamentFeralMigration:76,filamentFeralOrder:67,filamentFeralKnots:37,filamentFeralMutation:39},
  {name:"Feral — Knot parliament",filamentFeralCorruption:58,
    filamentFeralMigration:61,filamentFeralOrder:52,filamentFeralKnots:94,filamentFeralMutation:62},
  {name:"Feral — Warp eating weft",filamentFeralCorruption:84,
    filamentFeralMigration:93,filamentFeralOrder:24,filamentFeralKnots:56,filamentFeralMutation:87},
  {name:"Feral — Textile structural collapse",filamentFeralCorruption:99,
    filamentFeralMigration:99,filamentFeralOrder:7,filamentFeralKnots:99,filamentFeralMutation:100},
];
export function applyFeralJacquardPreset(state,name){
  const p=feralJacquardPresets.find(p=>p.name===name);
  if(!p)return state;
  const {name:label,...settings}=p;
  return {...state,...settings,filamentSpecies:"Feral Jacquard",
    filamentAmount:Math.max(70,state.filamentAmount||0)};
}
export function remixFeralJacquard(state,rng=Math.random){
  const unit=()=>{const n=Number(rng());return Number.isFinite(n)?Math.max(0,Math.min(.999999,n)):0;};
  return {...state,filamentSpecies:"Feral Jacquard",
    filamentAmount:Math.max(75,state.filamentAmount||0),
    filamentFeralCorruption:12+unit()*88,
    filamentFeralMigration:15+unit()*85,
    filamentFeralOrder:unit()*100,
    filamentFeralKnots:unit()*100,
    filamentFeralMutation:unit()*100};
}

/** A deterministic analytic future-sample of the stitch wave, not stored frames. */
export const retrocausalEmbroideryControls=[
  "filamentRetroLead","filamentRetroEcho","filamentRetroParadox",
  "filamentRetroKnots","filamentRetroReversal","filamentRetroCoherence"
];
export const retrocausalEmbroideryPresets=filamentStitchPresets.filter(
  p=>p.filamentStitchMode==="Retrocausal Embroidery");
export function applyRetrocausalEmbroideryPreset(state,name){
  const chosen=retrocausalEmbroideryPresets.find(p=>p.name===name);
  if(!chosen)return state;
  const {name:label,...seams}=chosen;
  return {...state,...seams,filamentAmount:Math.max(65,state.filamentAmount||0)};
}
export function remixRetrocausalEmbroidery(state,rng=Math.random,chaos=false){
  const unit=()=>{const n=Number(rng());return Number.isFinite(n)?
    Math.max(0,Math.min(.999999,n)):0;};
  return {...state,filamentStitchMode:"Retrocausal Embroidery",
    filamentAmount:Math.max(65,state.filamentAmount||0),
    filamentStitchAmount:Math.max(88,state.filamentStitchAmount||0),
    filamentRetroLead:chaos?70+unit()*30:20+unit()*80,
    filamentRetroEcho:chaos?76+unit()*24:15+unit()*85,
    filamentRetroParadox:chaos?78+unit()*22:unit()*100,
    filamentRetroKnots:unit()*100,filamentRetroReversal:unit()*100,
    filamentRetroCoherence:chaos?unit()*42:35+unit()*65};
}

export const chladniNeedleControls=[
  "filamentChladniOrder","filamentChladniResonance","filamentChladniDensity",
  "filamentChladniPhase","filamentChladniDetune"
];
export const chladniNeedlePresets=filamentStitchPresets.filter(
  p=>p.filamentStitchMode==="Chladni Needle Orchestra");
export function applyChladniNeedlePreset(state,name){
  const p=chladniNeedlePresets.find(p=>p.name===name);
  if(!p)return state;
  const {name:label,...settings}=p;
  return {...state,...settings,
    filamentAmount:Math.max(65,state.filamentAmount||0)};
}
export function remixChladniNeedles(state,rng=Math.random){
  const unit=()=>{const n=Number(rng());return Number.isFinite(n)?Math.max(0,Math.min(.999999,n)):0;};
  return {...state,filamentStitchMode:"Chladni Needle Orchestra",
    filamentAmount:Math.max(65,state.filamentAmount||0),
    filamentStitchAmount:Math.max(88,state.filamentStitchAmount||0),
    filamentChladniOrder:12+unit()*88,filamentChladniResonance:32+unit()*68,
    filamentChladniDensity:25+unit()*75,filamentChladniPhase:unit()*100,
    filamentChladniDetune:unit()*100};
}

export function stopFilamentStitching(state){
 return {...state,filamentStitchAmount:0};
}

/**
 * SCULPTED THREADS — optional 2.5D lighting of actual filament masks.
 * This is deliberately shading, not a claim of a true 3D mesh. It follows
 * the same math paths as the stitched and hybrid material pass.
 */
export const filamentSculptModes=[
  "Raised satin",
  "Trapunto quilting",
  "Recessed engraving",
  "Chased metal",
  "Shadow cutwork",
  "Beaded emboss",
  "Cushion stitch",
  "Gilded repoussé",
  "Bas-relief threadwork",
  "Carved appliqué",
  "Bone inlay",
  "Melted jewelry",
  "Alien scar tissue",
  "Fossil stitching",
  "Ruin filigree"
];
export const newFilamentSculptModes=filamentSculptModes.slice(5);
export const filamentSculptFamilies=[
  {name:"Original tactile crafts",modes:filamentSculptModes.slice(0,5)},
  {name:"Embossed fabrics & jewelry",modes:filamentSculptModes.slice(5,10)},
  {name:"Alien artifacts & fossil scars",modes:filamentSculptModes.slice(10)},
];
export function remixFilamentSculpt(state,rng=Math.random,newOnly=false){
  const rnd=()=>{const v=Number(rng());return Number.isFinite(v)?
    Math.min(1-Number.EPSILON,Math.max(0,v)):0;};
  const group=newOnly?newFilamentSculptModes:filamentSculptModes;
  const choices=group.filter(x=>x!==state.filamentSculptMode);
  const pool=choices.length?choices:group;
  return {...state,filamentSculptMode:pool[Math.floor(rnd()*pool.length)],
    filamentAmount:Math.max(65,state.filamentAmount||0),
    filamentSculptAmount:Math.max(80,state.filamentSculptAmount||0),
    filamentSculptDepth:48+Math.floor(rnd()*51),
    filamentSculptLight:Math.floor(rnd()*100),
    filamentSculptShadow:42+Math.floor(rnd()*57),
    filamentSculptPuff:24+Math.floor(rnd()*75)};
}
/** Only the active relief branch reaches the actual GPU compiler. */
export function specializeFilamentSculptMotion(source,index){
  if(index==null||!Number.isInteger(index)||index<0||
    index>=filamentSculptModes.length)return source;
  const opener=id=>id===0?"  if(filamentSculptMode==0){":
    "  }else if(filamentSculptMode=="+id+"){";
  const starts=filamentSculptModes.map((_,id)=>source.indexOf(opener(id)));
  if(starts.some((x,i)=>x<0||(i&&x<=starts[i-1])))return source;
  const fallback=source.indexOf("  }else{ // Unsupported sculpt mode",starts[14]);
  const end=source.indexOf("#endif\n  return clamp(result",fallback);
  if(fallback<0||end<0)return source;
  const body=source.slice(starts[index]+opener(index).length,
    index===14?fallback:starts[index+1]);
  return source.slice(0,starts[0])+
    "  if(filamentSculptMode=="+index+"){"+body+
    source.slice(fallback,end)+source.slice(end);
}

export const filamentSculptControls=[
  "filamentSculptAmount","filamentSculptDepth",
  "filamentSculptLight","filamentSculptShadow","filamentSculptPuff",
];
export const filamentSculptPresets=[
  {name:"Opal satin relief",filamentSculptMode:"Raised satin",
    filamentSculptAmount:91,filamentSculptDepth:72,
    filamentSculptLight:14,filamentSculptShadow:53,filamentSculptPuff:34},
  {name:"Psychedelic trapunto",filamentSculptMode:"Trapunto quilting",
    filamentSculptAmount:95,filamentSculptDepth:89,
    filamentSculptLight:31,filamentSculptShadow:77,filamentSculptPuff:93},
  {name:"Ancient signal engraving",filamentSculptMode:"Recessed engraving",
    filamentSculptAmount:88,filamentSculptDepth:64,
    filamentSculptLight:75,filamentSculptShadow:64,filamentSculptPuff:21},
  {name:"Mercury chased jewelry",filamentSculptMode:"Chased metal",
    filamentSculptAmount:93,filamentSculptDepth:82,
    filamentSculptLight:9,filamentSculptShadow:81,filamentSculptPuff:19},
  {name:"Cutwork cathedral",filamentSculptMode:"Shadow cutwork",
    filamentSculptAmount:91,filamentSculptDepth:85,
    filamentSculptLight:60,filamentSculptShadow:96,filamentSculptPuff:46},
  {"name":"Embossed Glass Pearls","filamentSculptMode":"Beaded emboss","filamentSculptAmount":92,"filamentSculptDepth":67,"filamentSculptLight":17,"filamentSculptShadow":60,"filamentSculptPuff":35},
  {"name":"Opal Cushion Temple","filamentSculptMode":"Cushion stitch","filamentSculptAmount":94,"filamentSculptDepth":72,"filamentSculptLight":28,"filamentSculptShadow":67,"filamentSculptPuff":44},
  {"name":"Gilded Phantom Repoussé","filamentSculptMode":"Gilded repoussé","filamentSculptAmount":96,"filamentSculptDepth":77,"filamentSculptLight":39,"filamentSculptShadow":74,"filamentSculptPuff":53},
  {"name":"Carved Moonstone Bas Relief","filamentSculptMode":"Bas-relief threadwork","filamentSculptAmount":92,"filamentSculptDepth":82,"filamentSculptLight":50,"filamentSculptShadow":81,"filamentSculptPuff":62},
  {"name":"Satin Cathedral Appliqué","filamentSculptMode":"Carved appliqué","filamentSculptAmount":94,"filamentSculptDepth":87,"filamentSculptLight":61,"filamentSculptShadow":88,"filamentSculptPuff":71},
  {"name":"Fossil Bone Jewelry","filamentSculptMode":"Bone inlay","filamentSculptAmount":96,"filamentSculptDepth":92,"filamentSculptLight":72,"filamentSculptShadow":95,"filamentSculptPuff":80},
  {"name":"Molten Treasure Hem","filamentSculptMode":"Melted jewelry","filamentSculptAmount":92,"filamentSculptDepth":97,"filamentSculptLight":83,"filamentSculptShadow":64,"filamentSculptPuff":89},
  {"name":"Xeno Scar Sutures","filamentSculptMode":"Alien scar tissue","filamentSculptAmount":94,"filamentSculptDepth":70,"filamentSculptLight":94,"filamentSculptShadow":71,"filamentSculptPuff":35},
  {"name":"Petrified Threadworms","filamentSculptMode":"Fossil stitching","filamentSculptAmount":96,"filamentSculptDepth":75,"filamentSculptLight":5,"filamentSculptShadow":78,"filamentSculptPuff":44},
  {"name":"Ruined Oracle Filigree","filamentSculptMode":"Ruin filigree","filamentSculptAmount":92,"filamentSculptDepth":80,"filamentSculptLight":16,"filamentSculptShadow":85,"filamentSculptPuff":53}
];
export function applyFilamentSculptPreset(state,name){
  const preset=filamentSculptPresets.find(p=>p.name===name);
  if(!preset)return state;
  const {name:label,...relief}=preset;
  return {...state,...relief,filamentAmount:Math.max(55,state.filamentAmount||0)};
}
export function disableFilamentSculpt(state){
  return {...state,filamentSculptAmount:0};
}

export const filamentGLSL = `
// Independent structural geometry with stitched, shaded filament ribbons.
uniform int filamentSpecies;
uniform int filamentSecondSpecies;
uniform int filamentMaterial,filamentSecondMaterial;
uniform int filamentOpticsMode,filamentSecondOpticsMode;
uniform float filamentOpticsAmount,filamentOpticsThickness,filamentOpticsDispersion;
uniform float filamentOpticsAnisotropy,filamentOpticsCurvature,filamentOpticsPearl,filamentOpticsPhase;
uniform float filamentSecondOpticsAmount,filamentSecondOpticsThickness,filamentSecondOpticsDispersion;
uniform float filamentSecondOpticsAnisotropy,filamentSecondOpticsCurvature,filamentSecondOpticsPearl,filamentSecondOpticsPhase;
uniform int filamentStitchMode;
uniform int filamentSculptMode;
uniform int filamentAdornmentMode,filamentSecondAdornmentMode;
uniform int filamentAdornmentPlacement,filamentAdornmentKinetics;
uniform float filamentAdornmentPopulation,filamentAdornmentRhythm;
uniform int filamentAdornmentFinish;
uniform float filamentAdornmentFinishAmount,filamentAdornmentFilm,filamentAdornmentFacet,filamentAdornmentPolish;
uniform int filamentAdornmentInterior;
uniform float filamentAdornmentInteriorAmount,filamentAdornmentInteriorDensity,filamentAdornmentInteriorOpenwork,filamentAdornmentInteriorDrift;
uniform int filamentAdornmentColony;
uniform float filamentAdornmentDiversity,filamentAdornmentSizeVariance,filamentAdornmentFinishVariance,filamentAdornmentAnatomyVariance;
uniform int filamentMorphMode;
uniform int filamentContagionMode;
uniform int filamentNeuralMode;
uniform int filamentPlasticMode;
uniform int filamentScarMode;
uniform int filamentRegenMode;
uniform float filamentRegenAmount,filamentRegenBranches;
uniform float filamentRegenSpeed,filamentRegenHealing,filamentRegenGlow;
uniform float filamentScarAmount,filamentScarDensity;
uniform float filamentScarPersistence,filamentScarRoughness,filamentScarGlow;
uniform float filamentPlasticAmount,filamentPlasticRate;
uniform float filamentPlasticInhibition,filamentPlasticRetention,filamentPlasticGlow;
uniform float filamentNeuralAmount,filamentNeuralSpeed;
uniform float filamentNeuralCoupling,filamentNeuralThreshold,filamentNeuralGlow;
uniform float filamentContagionAmount,filamentContagionReach;
uniform float filamentContagionSpeed,filamentContagionLag,filamentContagionGlow;
uniform int filamentMorphTarget,filamentSecondMorphTarget;
uniform float filamentMorphAmount,filamentMorphScale;
uniform float filamentMorphSpeed,filamentMorphSharpness,filamentMorphGlow;
uniform float filamentAdornmentAmount,filamentAdornmentSpacing;
uniform float filamentAdornmentSize,filamentAdornmentMotion,filamentAdornmentGlow;
uniform float filamentSculptAmount,filamentSculptDepth;
uniform float filamentSculptLight,filamentSculptShadow,filamentSculptPuff;
uniform float filamentStitchAmount,filamentStitchSpeed;
uniform float filamentStitchLength,filamentStitchGlow;
uniform float filamentFeralCorruption,filamentFeralMigration,filamentFeralOrder;
uniform float filamentFeralKnots,filamentFeralMutation;
uniform float filamentQuasiSpacing,filamentQuasiPhason,filamentQuasiDrift;
uniform float filamentQuasiRelief,filamentQuasiElevation,filamentQuasiOrnament;
uniform float filamentChladniOrder,filamentChladniResonance,filamentChladniDensity;
uniform float filamentChladniPhase,filamentChladniDetune;
uniform float filamentRetroLead,filamentRetroEcho,filamentRetroParadox;
uniform float filamentRetroKnots,filamentRetroReversal,filamentRetroCoherence;
uniform float filamentNap,filamentLuster,filamentBeads,filamentBeadSize,filamentSecondHue;
#ifdef FILAMENT_ARCH_META
uniform int filamentMeta;
uniform float filamentMetaAmount,filamentMetaFrequency,filamentMetaThickness,filamentMetaDispersion,filamentMetaMotion,filamentMetaPolish;
#endif
#ifdef FILAMENT_ARCH_DIMENSION
uniform int filamentDimMode;
uniform int filamentDimTarget;
uniform float filamentDimAmount,filamentDimProgress,filamentDimSpeed,filamentDimWarp,filamentDimFusion;
#endif
#ifdef FILAMENT_ARCHITECTURE
uniform int filamentArchitecture;
uniform float filamentArchitectureAmount,filamentArchitectureScale,filamentArchitectureReach,filamentArchitectureOpenwork,filamentArchitectureSpeed,filamentArchitectureHue;
#endif
#ifdef FILAMENT_SURFACE_ECOLOGY
uniform int filamentEcology;
uniform float filamentEcologyAmount,filamentEcologyScale,filamentEcologyCoverage,filamentEcologySpeed,filamentEcologyRelief,filamentEcologyHue;
#endif
#ifdef FILAMENT_CHROMA
uniform int filamentChroma;
uniform float filamentChromaAmount,filamentChromaScale,filamentChromaSpread,filamentChromaSpeed,filamentChromaContrast,filamentChromaExchange;
#endif
#ifdef FILAMENT_PHYSICS
uniform int filamentPhysics;
uniform float filamentPhysicsAmount,filamentPhysicsScale,filamentPhysicsReach,filamentPhysicsSpeed,filamentPhysicsRepair,filamentPhysicsGlow;
#endif
#ifdef FILAMENT_MICROLOOM
uniform int filamentMicroloom;
uniform float filamentMicroloomAmount,filamentMicroloomScale,filamentMicroloomDepth,filamentMicroloomOpenwork,filamentMicroloomMotion,filamentMicroloomColor;
// Each family returns a yarn coverage, raised crossing highlight and weave phase.
// All coordinates are local projections, not signed arclength or 3D topology.
vec3 microloomField(vec2 v,float clock){
  vec2 cell=floor(v),f=fract(v)-.5;
  float a=abs(f.x),b=abs(f.y);
  float warp=.0,weft=.0,top=.5;
  if(filamentMicroloom==1){
    warp=1.-smoothstep(.10,.22,a);
    weft=1.-smoothstep(.10,.22,b);
    top=mod(cell.x+cell.y,2.);
  }else if(filamentMicroloom==2){
    float flip=2.*mod(floor(v.y*.5),2.)-1.;
    warp=1.-smoothstep(.07,.19,abs(fract(v.x+flip*v.y*.68)-.5));
    weft=1.-smoothstep(.08,.20,b);
    top=mod(cell.x+2.*cell.y,3.)*.5;
  }else if(filamentMicroloom==3){
    float flip=step(.5,fract(sin(dot(cell,vec2(13.7,79.3)))*43758.5453));
    vec2 c=mix(vec2(0.),vec2(1.,0.),flip);
    vec2 p=fract(v);
    warp=1.-smoothstep(.045,.15,abs(length(p-c)-.5));
    weft=1.-smoothstep(.045,.15,abs(length(p-(1.-c))-.5));
    top=flip;
  }else if(filamentMicroloom==4){
    float m=1.,n=1.;
    for(int j=0;j<5;j++){
      float angle=float(j)*1.25663706;
      vec2 axis=vec2(cos(angle),sin(angle));
      float v0=dot(v,axis)*3.7+sin(clock*.35+float(j)*1.7)*.24;
      m=min(m,abs(sin(v0)));
      n=min(n,abs(cos(v0*1.618034+.6)));
    }
    warp=1.-smoothstep(.08,.30,m);weft=1.-smoothstep(.07,.25,n);
    top=.5+.5*cos(v.x*2.3-v.y*1.7);
  }else if(filamentMicroloom==5){
    float r=length(f);
    float angle=atan(f.y,f.x+.00001);
    warp=1.-smoothstep(.06,.17,abs(r-.26-.045*cos(angle*5.+clock)));
    weft=1.-smoothstep(.08,.24,abs(sin(angle*5.+r*13.))*r);
    top=.5+.5*cos(angle*5.);
  }else if(filamentMicroloom==6){
    warp=1.-smoothstep(.06,.19,abs(a+b-.34));
    weft=1.-smoothstep(.055,.17,min(abs(f.x+f.y),abs(f.x-f.y)));
    top=mod(cell.x+cell.y,2.);
  }else if(filamentMicroloom==7){
    vec2 basis=vec2(1.,1.7320508);
    vec2 h1=mod(v+basis*.5,basis)-basis*.5;
    vec2 h2=mod(v,basis)-basis*.5;
    vec2 h=abs(dot(h1,h1)<dot(h2,h2)?h1:h2);
    float hex=max(h.x,dot(h,vec2(.5,.8660254)));
    warp=1.-smoothstep(.035,.11,abs(hex-.42));
    weft=1.-smoothstep(.025,.09,abs(hex-.23));
    top=.5+.5*cos(v.y*2.1);
  }else if(filamentMicroloom==8){
    float a0=abs(fract(v.y+.23*sin(v.x*4.-clock))-.5);
    float b0=abs(fract(v.y-.23*sin(v.x*4.+clock)+.5)-.5);
    warp=1.-smoothstep(.07,.19,a0);weft=1.-smoothstep(.07,.19,b0);
    top=.5+.5*cos(v.x*4.);
  }
  float cover=max(warp,weft);
  float crossing=mix(weft,warp,top);
  float glint=clamp(crossing*.75+min(warp,weft)*.25,0.,1.);
  return vec3(cover,glint,top);
}
#endif
#ifdef FILAMENT_CONSTRUCTION
uniform int filamentConstruction;
uniform float filamentConstructionAmount,filamentConstructionPitch,filamentConstructionGap,filamentConstructionMotion,filamentConstructionRelief;
#endif
uniform float filamentCrossbreed,filamentInterlace,filamentTwist,filamentPhase;
uniform float filamentAmount,filamentScale,filamentDensity,filamentMotion;
uniform float filamentWidth,filamentRelief,filamentHue,filamentVariation;

#ifdef FILAMENT_ARCHITECTURE
// Distances are projected unsigned line fields; the morph combines these,
// not a homeomorphism or a literal 3D topology transformation.
vec3 architectureField(int arMode,vec2 arP,float arAlong,float arClock,float arRand,float arLife,float arAA){
  float arD=4.,arFill=0.,arShine=0.;
  if(arMode==1){
    // Dendritic scaffold: a central trunk and paired branching veins.
    float trunk=abs(arP.x)*.8;
    float branch=abs(abs(arP.x)-.48*fract(arP.y*3.));
    float twigs=abs(abs(fract(arP.x*2.5+.5)-.5)-.65*fract(arP.y*6.));
    arD=min(trunk,min(branch,twigs+.018));
    arShine=.4+.6*cos(arP.y*13.)*.5+.3;
  }else if(arMode==2){
    // Interconnected diamond and trefoil open lace.
    vec2 v=vec2(arP.x*2.,arP.y*3.);
    float loops=abs(length(fract(v)-.5)-.36);
    float diamonds=abs(abs(fract(v.x+.5)-.5)+abs(fract(v.y+.5)-.5)-.50);
    arD=min(loops,diamonds*.72);
    arShine=.45+.55*pow(abs(cos(v.y*6.2831853)),3.);
  }else if(arMode==3){
    // Porous projected silica tube ribs with elliptical windows.
    vec2 v=vec2(arP.x*3.,arP.y*4.);
    float holes=length((fract(v)-.5)*vec2(.94,1.35));
    arD=abs(holes-.35);
    arFill=smoothstep(.34,.44,holes)*.48;
    arShine=1.-smoothstep(.025,.13,abs(holes-.37));
  }else if(arMode==4){
    // Rapidly multiplying, fluted membrane folds toward the edge.
    float fold=sin(arP.x*12.56637+sin(arP.y*8.+arClock)*.65);
    float flutes=sin(arP.y*(7.+10.*arP.y)+fold*2.);
    arD=abs(flutes)*.20;
    arFill=smoothstep(-.2,.8,fold*flutes)*.42;
    arShine=pow(abs(fold),4.);
  }else if(arMode==5){
    // Mineral accretion terraces, angular nested crystalline contours.
    vec2 v=abs(vec2(arP.x,arP.y-.33));
    float facet=max(v.x,dot(v,vec2(.5,.8660254)));
    arD=abs(fract(facet*7.+arLife*.35)-.5)*.24;
    arFill=(1.-smoothstep(.27,.50,facet))*.64;
    arShine=.35+.65*step(v.x,v.y);
  }else if(arMode==6){
    // Cellular bridges from repeating arched ribs and linked elliptical nodes.
    float arch=.25+.65*sqrt(max(0.,1.-4.*arP.x*arP.x));
    float rib=abs(arP.y-arch);
    float tie=abs(arP.x)*.6;
    float nodes=abs(length(vec2(arP.x*2.,(arP.y-.35)*1.4))-.26);
    arD=min(rib,min(tie,nodes));
    arShine=.5+.5*cos(arP.y*19.+arClock);
  }else if(arMode==7){
    // Radial silica vaults with spokes and concentric ribs.
    vec2 v=vec2(arP.x*1.8,arP.y-.42);
    float r=length(v);
    float a=atan(v.y,v.x+.00001);
    arD=min(abs(fract(r*4.)-.5)*.22,abs(sin(a*6.))*r*.35);
    arShine=.35+.65*pow(abs(cos(a*6.)),6.);
  }else if(arMode==8){
    // Five directional quasiperiodic scaffold without screen-space stamping.
    vec2 v=vec2(arAlong*.45,arP.y)*9.;
    float lattice=0.;
    for(int ai=0;ai<5;ai++){
      float a=float(ai)*1.2566371;
      lattice+=cos(dot(v,vec2(cos(a),sin(a)))+arClock*.25);
    }
    arD=abs(lattice)*.13;
    arShine=.3+.7*clamp(abs(lattice)*.4,0.,1.);
  }else if(arMode==9){
    // Mobius strip: the transverse parameter reverses after one circuit.
    // Orthographic cross-section curves, not a 3D surface mesh.
    float u=6.2831853*arAlong+arClock*.45;
    float twist=cos(u*.5);
    float y=arP.y-.5-.14*sin(u);
    float a=.30*twist;
    float rail=min(abs(y-a),abs(y+a));
    float ribs=abs(fract(arAlong*8.)-.5)*.16;
    float interior=1.-smoothstep(abs(a),abs(a)+arAA,abs(y));
    arD=min(rail,ribs+(1.-interior)*2.);
    arFill=interior*.48;
    arShine=.3+.7*abs(sin(u*.5));
  }else if(arMode==10){
    // Immersed Klein bottle figure-eight section:
    // (r+cos(u/2)sin(v)-sin(u/2)sin(2v), sin(u/2)sin(v)+cos(u/2)sin(2v)).
    float u=6.2831853*arAlong+arClock*.35;
    float ct=cos(u*.5),st=sin(u*.5);
    float y=arP.y-.5;
    arD=3.;
    for(int ki=0;ki<8;ki++){
      float v=float(ki)*.78539816;
      float a=sin(v),b=sin(2.*v);
      float h=.25*(st*a+ct*b);
      float depth=ct*a-st*b;
      arD=min(arD,abs(y-h)*(.75+.25*abs(depth)));
    }
    arShine=.3+.7*abs(cos(u*.5+arP.y*5.));
  }else if(arMode==11){
    // Standard gyroid implicit nodal surface, animated 2D slice.
    vec3 v=vec3(arAlong*6.2831853,arP.y*12.5663706,arClock*.55+arRand*.8);
    float g=sin(v.x)*cos(v.y)+sin(v.y)*cos(v.z)+sin(v.z)*cos(v.x);
    arD=abs(g)*.16;
    arFill=smoothstep(.05,.6,g)*.34;
    arShine=.25+.75*abs(cos(v.x)*cos(v.y)-sin(v.z)*sin(v.x));
  }else if(arMode==12){
    // Both sheets of sqrt(z), with a branch point at the station center.
    vec2 v=vec2(arP.x,arP.y-.5);
    float r=sqrt(length(v));
    float theta=.5*atan(v.y,v.x+.00001)+arClock*.25;
    vec2 root=r*vec2(cos(theta),sin(theta));
    float sheets=min(abs(fract(root.y*7.+.5)-.5),abs(fract(-root.y*7.+.25)-.5));
    float rings=abs(fract(r*6.+.5)-.5);
    arD=min(sheets,rings*.7)*.27;
    arShine=.28+.72*abs(cos(theta));
  }else if(arMode==13){
    // Hopf fibers on S3: (cos(eta)e^it,sin(eta)e^i(t+phi)).
    // The sampled height is a stereographic projection, bounded away from pole.
    float t=6.2831853*arAlong+arClock*.36;
    float y=arP.y-.5;
    arD=3.;
    for(int hi=0;hi<7;hi++){
      float phi=float(hi)*.8975979;
      float eta=.43+.035*float(hi);
      float w=sin(eta)*sin(t+phi);
      float height=.21*cos(eta)*sin(t)/max(.25,1.-w);
      height+=.12*sin(eta)*cos(t+phi);
      arD=min(arD,abs(y-height));
    }
    arShine=.35+.65*abs(cos(t+arP.y*5.));
  }else if(arMode==14){
    // Poincare disk metric: radial geodesics plus orthogonal boundary arcs.
    vec2 v=vec2(arP.x*1.75,(arP.y-.5)*1.75);
    float r=min(length(v),.985);
    float angle=atan(v.y,v.x+.00001)+arClock*.12;
    float spokes=abs(sin(angle*6.))*r;
    float hyper=.5*log((1.+r)/max(.015,1.-r));
    float rings=abs(fract(hyper*2.6)-.5)*(1.-r*r);
    float arcs=3.;
    for(int gi=0;gi<6;gi++){
      float a=float(gi)*1.04719755+arClock*.12;
      vec2 center=1.35*vec2(cos(a),sin(a));
      arcs=min(arcs,abs(length(v-center)-sqrt(1.35*1.35-1.)));
    }
    arD=min(min(spokes*.40,rings*.30),arcs*.50);
    arD+=smoothstep(.94,.99,length(v));
    arShine=.3+.7*(1.-r);
  }else if(arMode==15){
    // All 32 edges of a 4D hypercube, projected by a rotating 4D basis.
    float t=arClock*.35;
    float c=cos(t),si=sin(t),c2=cos(t*.71),s2=sin(t*.71);
    vec2 b0=vec2(.15,.03)*c+vec2(.07,-.10)*si;
    vec2 b3=-vec2(.15,.03)*si+vec2(.07,-.10)*c;
    vec2 b1=vec2(-.04,.15)*c2+vec2(.10,.07)*s2;
    vec2 b2=-vec2(-.04,.15)*s2+vec2(.10,.07)*c2;
    vec2 p=vec2(arP.x,arP.y-.5);
    arD=3.;
    // Each of four directions has eight edges. No GLSL ES 3-only bit ops.
    for(int ei=0;ei<4;ei++){
      vec2 e=2.*(ei==0?b0:ei==1?b1:ei==2?b2:b3);
      vec2 a=ei==0?b1:ei==1?b2:ei==2?b3:b0;
      vec2 b=ei==0?b2:ei==1?b3:ei==2?b0:b1;
      vec2 c3=ei==0?b3:ei==1?b0:ei==2?b1:b2;
      for(int vi=0;vi<8;vi++){
        float bits=float(vi);
        vec2 vertex=-.5*e+a*(2.*mod(bits,2.)-1.)+
          b*(2.*mod(floor(bits*.5),2.)-1.)+
          c3*(2.*floor(bits*.25)-1.);
        vec2 d=p-vertex;
        float along=clamp(dot(d,e)/max(dot(e,e),.00001),0.,1.);
        arD=min(arD,length(d-e*along));
      }
    }
    arShine=.35+.65*abs(cos(t+arP.y*9.));
  }else if(arMode==16){
    // (3,2) and (5,3) torus-knot projections share an axial carrier.
    float t=6.2831853*arAlong+arClock*.35;
    float y=arP.y-.5;
    float r=.22+.10*cos(3.*t);
    float a=r*sin(2.*t)+.06*sin(3.*t);
    float b=(.22+.08*cos(5.*t))*sin(3.*t+.9)+.05*sin(5.*t);
    arD=min(abs(y-a),abs(y-b));
    arShine=.3+.7*abs(cos(3.*t));
  }
  return vec3(arD,arFill,arShine);
}
#endif

vec3 filamentField(vec3 background,vec2 uv,vec2 fieldP,float fieldV,
    int species,int fiberMaterial,int adornmentMode,int morphMaterial,float phaseOffset,float twist,float hueOffset,
    int opticalLaw,float opticalAmount,float opticalThickness,float opticalDispersion,
    float opticalAnisotropy,float opticalCurvature,float opticalPearl,float opticalPhase,
    float incomingCore,float incomingCarrier,
    float incomingNeural,float incomingLuma,float incomingPigment,
    out float maskCore,out float outgoingCarrier,
    out float outgoingNeural,out float outgoingLuma,out float outgoingPigment){
  outgoingPigment=0.0;
  outgoingCarrier=0.0;
  outgoingNeural=0.0;
  outgoingLuma=0.0;
  float t=time*(.14+filamentMotion*.72)+phaseOffset;
  float ct=colorTime*.12+phaseOffset*.18;
  float freq=3.0+filamentScale*11.0;
  // Artboard UVs are aspect-correct and do not inherit the base engine's
  // kaleidoscope warp. The field modulates color and local movement instead.
  vec2 aspect=vec2(res.x/res.y,1.0);
  vec2 centered=(uv-.5)*aspect;
  vec2 rotated=mat2(cos(twist),-sin(twist),sin(twist),cos(twist))*centered;
  vec2 localUV=.5+rotated/aspect;
  vec2 q=rotated*freq;
  q+=.14*filamentMotion*vec2(sin(q.y*.81+t*.53),cos(q.x*.93-t*.44));
#ifdef FILAMENT_SEMANTIC_GRAVITY
  // The actual visible glyph silhouette bends *geometry* before species
  // evaluation. Both hybrid parents independently react to the same words.
  vec3 semanticTug=semanticGlyphForce(uv,phaseOffset);
  // Inverse field sampling: subtract force so the drawn yarn moves TOWARD glyphs.
  q-=vec2(semanticTug.x*(res.x/res.y),semanticTug.y)*
    (.45+.12*freq);
#endif
  float density=filamentDensity;
  float seedPhase=filamentVariation*6.28318+seed*.000013+phaseOffset*.61;
#ifdef FILAMENT_NEURAL
  // A very small true geometry perturbation that travels with the threads.
  // Both parents share the clock; local coordinates retain individual shape.
  float nerveClock=time*(.15+filamentNeuralSpeed*1.31);
  float nerveSpacing=1.0+filamentNeuralCoupling*2.4;
  vec2 nerveDisplacement=vec2(
    sin(q.y*.73*nerveSpacing-nerveClock+seedPhase*.37),
    cos(q.x*.62*nerveSpacing+nerveClock*.87+seedPhase*.29));
  q+=nerveDisplacement*filamentNeuralAmount*.064;
#endif
  float threadD=1.0,phase=0.0,mask=1.0,highlight=0.0;
  // These remain zero for ALL old thread geometries.
  float quasiLift=0.0,quasiJunction=0.0;
  if(species==0){
    // Two five-axis quasiperiodic thread families, never a repeating tile.
    float a=0.0,b=0.0;
    for(int i=0;i<5;i++){
      float fi=float(i);
      float angle=fi*1.256637;
      vec2 axis=vec2(cos(angle),sin(angle));
      float w=dot(q,axis)*(1.4+density*2.7);
      a+=sin(w+t*.19*sin(fi*2.27)+seedPhase*.41);
      b+=cos(w*1.61803-t*.23+fi*1.8+seedPhase*.12);
    }
    a*=.2;b*=.2;
    threadD=min(abs(sin(a*(8.0+density*11.0)+fieldV*.27)),
                abs(sin(b*(8.0+density*9.0)-fieldV*.2)));
    threadD*=.095;
    phase=a*2.4+b*1.8;
    highlight=.5+.5*sin(a*10.0+b*9.0+t*.6);
  }else if(species==1){
    // Poincaré-disk metric: rings contract visually toward the boundary.
    vec2 z=(localUV-.5)*vec2(res.x/res.y,1.0)*(1.25+filamentScale*1.05);
    z+=.065*filamentMotion*vec2(sin(t*.36),cos(t*.32));
    float r=length(z);
    float safeR=min(r,.978);
    float h=log((1.0+safeR)/(1.0-safeR));
    float a=atan(z.y,z.x);
    float sectors=5.0+floor(density*13.0);
    float radial=h*(3.0+density*6.0)-t*.46;
    float lace=sin(a*sectors+radial*.28+seedPhase);
    threadD=min(abs(sin(radial+lace*1.4)),abs(sin(a*sectors+sin(radial*.75))));
    threadD*=.075;
    mask=1.0-smoothstep(.82,.975,r);
    phase=radial*.19+a*.7;
    highlight=.5+.5*cos(radial*.8-a*sectors*.4);
  }else if(species==2){
    // Two arc threads through each deterministic Truchet tile.
    vec2 stitchQ=q*(.72+density*1.35);
    vec2 cell=floor(stitchQ),local=fract(stitchQ);
    float flip=step(.5,hash(cell+seedPhase));
    vec2 cornerA=mix(vec2(0.0,0.0),vec2(1.0,0.0),flip);
    vec2 cornerB=mix(vec2(1.0,1.0),vec2(0.0,1.0),flip);
    // Fixed half-tile arc radius keeps both ends meeting precisely at cell
    // boundaries. Motion happens in the continuous coordinate warp above.
    float radius=.5;
    float arcA=abs(length(local-cornerA)-radius);
    float arcB=abs(length(local-cornerB)-radius);
    threadD=min(arcA,arcB);
    // Faint parallel seams preserve the woven-thread character.
    threadD=min(threadD,abs(min(arcA,arcB)-.12)*.73);
    phase=hash(cell)*1.3+local.x*.4+local.y*.3;
    highlight=.5+.5*cos((local.x+local.y)*6.28+t*.54);
  }else if(species==3){
    // Moving Voronoi stitch boundaries, plus a small stitched rosette in cells.
    vec2 cell=floor(q),local=fract(q);
    float nearD=5.0,secondD=5.0,chosen=0.0;
    for(int j=-1;j<=1;j++){
      for(int i=-1;i<=1;i++){
        vec2 id=cell+vec2(float(i),float(j));
        float h=hash(id+seedPhase);
        vec2 center=vec2(float(i),float(j))+.5+
          .2*filamentMotion*vec2(sin(t*.45+h*6.283),cos(t*.38+h*6.283));
        float dist=length(local-center);
        if(dist<nearD){secondD=nearD;nearD=dist;chosen=h;}
        else secondD=min(secondD,dist);
      }
    }
    float border=max(0.0,secondD-nearD);
    float beaded=abs(sin(nearD*(10.0+density*15.0)+t*.44+chosen*6.28))*.12;
    threadD=min(border*.53,beaded+.018);
    phase=chosen+nearD*.62+fieldV*.13;
    highlight=.5+.5*cos(nearD*13.0+t*.43);
  }else if(species==4){
    // Independent logarithmic curls inside repeatable embroidery hoops.
    vec2 cell=floor(q),local=fract(q)-.5;
    float rand=hash(cell+seedPhase);
    vec2 z=local+.06*filamentMotion*vec2(sin(t*.43+rand*6.28),cos(t*.39+rand*6.28));
    float radius=length(z);
    float angle=atan(z.y,z.x);
    float spirals=3.0+floor(density*5.0);
    float spin=angle*spirals-radius*(29.0+density*35.0)+t*.62+rand*6.28;
    threadD=abs(sin(spin))*.095;
    mask=1.0-smoothstep(.39,.62,radius);
    phase=rand+angle*.17-radius*2.0;
    highlight=.5+.5*cos(spin*.33);
  }else if(species==5){
    // Original Fractal veinwork is preserved verbatim.
    vec2 z=q*.76;
    float f=0.0,g=0.0;
    float amp=.55;
    for(int i=0;i<3;i++){
      f+=amp*sin(z.y*(1.3+density*1.9)+sin(z.x*1.2+t*.29)*1.4);
      g+=amp*cos(z.x*(1.4+density*1.8)-sin(z.y*.96-t*.26)*1.2);
      z=mat2(.78,-.62,.62,.78)*z*1.93+vec2(1.13,-.78);
      amp*=.54;
    }
    threadD=min(abs(sin(f*(8.0+density*10.0)+fieldV*.48)),
                abs(cos(g*(9.0+density*9.0)-fieldV*.31)))*.092;
    phase=f*1.5+g*.95;
    highlight=.5+.5*sin((f+g)*8.0+t*.6);
  }else if(species==6){
    // ALIEN LATTICE: drifting quasihexagonal signal mesh with living junctions.
    vec2 r=q*(.68+density*.46);
    vec2 axes=vec2(dot(r,vec2(.866025,.5)),dot(r,vec2(-.866025,.5)));
    float a=sin(axes.x*4.15+t*.61+sin(axes.y*1.2+t*.2));
    float b=sin(axes.y*4.15-t*.47+cos(axes.x*1.13-t*.29));
    float c=sin((axes.x+axes.y)*4.15+t*.31);
    float junction=pow(max(0.0,1.0-max(abs(a),abs(b))),.7);
    threadD=min(min(abs(a),abs(b)),abs(c))*.081;
    threadD=min(threadD,.13*(1.0-junction));
    phase=axes.x*.31+axes.y*.42+sin(t*.42);
    highlight=.5+.5*cos(a*7.0+b*7.0+t*1.4);
  }else if(species==7){
    // ALIEN SCRIPTWORK: skewed strokes, loops and translating angular runes.
    vec2 tile=q*(.45+density*.48);
    vec2 id=floor(tile),p=fract(tile)-.5;
    float h=hash(id+seedPhase),h2=hash(id+vec2(7.3,3.9)+seedPhase);
    p+=.08*vec2(sin(t*.6+h*6.28),cos(t*.48+h2*6.28));
    float slant=mix(-.7,.7,h);
    float stem=abs(p.x-p.y*slant);
    float bar=abs(p.y-(h2-.5)*.6)-.02;
    float hoop=abs(length(p-vec2((h-.5)*.2,(h2-.5)*.2))-
      (.18+.12*h));
    float gate=step(.13,abs(p.y));
    threadD=min(min(stem*.8+(.014+abs(p.y)*.028),
      abs(bar)*(.6+.4*gate)),hoop)*.64;
    mask=1.0-smoothstep(.38,.58,max(abs(p.x),abs(p.y)));
    phase=h*2.5+h2+tile.y*.21+t*.24;
    highlight=.5+.5*sin(phase*6.2+t*.93);
  }else if(species==8){
    // GLYPH SWARM: orbiting, changing incomplete runes confined to cells.
    vec2 tile=q*(.58+density*.38),id=floor(tile);
    vec2 p=fract(tile)-.5;
    float h=hash(id+seedPhase),angle=t*(.32+.43*h)+h*6.28318;
    p=mat2(cos(angle),-sin(angle),sin(angle),cos(angle))*p;
    float a=atan(p.y,p.x),r=length(p);
    float ring=abs(r-(.20+.085*sin(t*.57+h*5.0)));
    float bar=abs(p.x-.11*sin(p.y*6.0+t+h));
    float opening=1.0-smoothstep(.0,.25,sin(a*3.0+h*6.0-t*.45));
    threadD=min(ring+opening*.15,bar*.52+abs(p.y)*.04);
    mask=1.0-smoothstep(.38,.57,r);
    phase=a*.7+r*2.5+h+t*.33;
    highlight=.5+.5*cos(a*5.0-t*1.5);
  }else if(species==9){
    // XENO FILAMENT: migrating twisted double helix and segmented rungs.
    vec2 r=q*(.76+density*.38);
    float center=.29*sin(r.y*.62+t*.35+sin(r.y*.23));
    float helix=.18*sin(r.y*2.6-t*1.25+seedPhase);
    float strandA=abs(r.x-center-helix);
    float strandB=abs(r.x-center+helix);
    float rung=abs(sin(r.y*5.2-t*.8))*abs(r.x-center)*.68;
    float within=1.0-smoothstep(.15,.29,abs(r.x-center));
    threadD=min(min(strandA,strandB),rung+(1.0-within)*.2)*.42;
    phase=r.y*.49+center*.7+t*.7;
    highlight=.5+.5*cos(r.y*5.2-t*1.9);
  }else if(species==10){
    // CAPILLARY BLOOM: growing radial blood vessels with recursive forks.
    vec2 cell=floor(q*.7),p=fract(q*.7)-.5;
    float h=hash(cell+seedPhase),a=atan(p.y,p.x);
    float r=length(p),fork=7.0+floor(density*6.0);
    float spokes=abs(sin(a*fork+r*9.0+t*.38+h*6.283));
    float secondary=abs(sin(a*fork*2.0-r*17.0-t*.55));
    float vessel=min(spokes*.048,secondary*.071);
    float lobes=.035*abs(sin(r*26.0-t*.78));
    threadD=min(vessel+lobes,abs(r-(.25+.06*sin(t*.6+h*6.0)))*.39);
    mask=1.0-smoothstep(.43,.65,r);
    phase=r*3.5+a*.54+h;
    highlight=.5+.5*sin(r*22.0-t*1.18);
  }else if(species==11){
    // MYCELIAL VEINWORK: recursively displaced rhizomorphic pathways.
    vec2 z=q*.66;
    float f=0.0,g=0.0,amp=.62;
    for(int i=0;i<3;i++){
      float n=sin(z.y*1.47+cos(z.x*.83+t*.27)*1.6);
      float m=cos(z.x*1.61-sin(z.y*.71-t*.33)*1.9);
      f+=amp*n;g+=amp*m;
      z=mat2(.82,-.57,.57,.82)*z*1.87+vec2(.73,1.13);
      amp*=.58;
    }
    float branch=sin(f*(9.0+density*13.0)+t*.16);
    float cross=sin(g*(9.0+density*12.0)-t*.23);
    threadD=min(abs(branch)*.073,abs(cross)*.067);
    phase=f*2.6+g*1.6+t*.21;
    highlight=.5+.5*cos(f*13.0-g*8.0+t*.92);
  }else if(species==12){
    // LIGHTNING LACE: jagged branching stroke fronts with traveling sparks.
    vec2 r=q*(.6+density*.42);
    float stepY=floor(r.y*3.5);
    float zig=hash(vec2(stepY,seedPhase))-.5;
    float zigNext=hash(vec2(stepY+1.0,seedPhase))-.5;
    float front=mix(zig,zigNext,smoothstep(0.0,1.0,fract(r.y*3.5)));
    float arc=sin(r.y*1.7-t*.83+seedPhase)*.36;
    float trunk=abs(sin((r.x-front*.72-arc)*4.1));
    float twig=abs(sin((r.x+front*.55+r.y*.64)*7.2+t*.59));
    float spark=pow(.5+.5*sin(r.y*18.0-t*3.1),12.0);
    threadD=min(trunk*.078,twig*.071+.006*(1.0-spark));
    phase=r.y*.75+front+t*.65;
    highlight=.5+.5*spark;
  }else if(species==13){
    // ROOT FILIGREE: gravity-biased curling root fans with lateral hairs.
    vec2 r=q*(.66+density*.39);
    float drift=sin(r.y*.54+t*.39+sin(r.y*.15))* .43;
    float trunk=abs(sin((r.x-drift)*3.7+sin(r.y*.62+t*.31)));
    float laterals=abs(sin(r.x*7.3+r.y*3.8+
      sin(r.y*1.6-t*.5)*1.2));
    float taper=.55+.45*abs(sin(r.y*1.13+seedPhase));
    threadD=min(trunk*.075,laterals*.075*taper);
    phase=r.y*.49+r.x*.13+drift;
    highlight=.5+.5*cos(r.y*8.0-t*1.14);
  }else if(species==14){
    // CORAL VASCULATURE: branching, pulsing radial reef cups and pores.
    vec2 tile=q*.56,id=floor(tile),p=fract(tile)-.5;
    float h=hash(id+seedPhase),r=length(p),a=atan(p.y,p.x);
    float branches=6.0+floor(density*6.0);
    float fan=abs(sin(a*branches-r*15.0+t*.46+h*6.0));
    float twigs=abs(sin(a*branches*2.0+r*24.0-t*.68));
    float cup=abs(r-(.25+.05*sin(t*.36+h*5.0)));
    threadD=min(min(fan*.07,twigs*.09),cup*.38);
    mask=1.0-smoothstep(.43,.63,r);
    phase=r*4.0+a*.61+h;
    highlight=.5+.5*sin(r*19.0-t*1.2+h*4.0);
  }else if(species==15){
    // NERVE NET: oscillating dendrite spokes and migrating synapse pulses.
    vec2 tile=q*(.56+density*.36),id=floor(tile);
    vec2 p=fract(tile)-.5;
    float h=hash(id+seedPhase);
    p+=.045*vec2(sin(t*.39+h*6.2),cos(t*.47+h*6.2));
    float r=length(p),a=atan(p.y,p.x);
    float dendrite=abs(sin(a*(5.0+floor(density*5.0))+
      sin(r*16.0-t*.65)*.7+h*6.283));
    float synapse=abs(r-(.095+.035*sin(t*.8+h*5.0)));
    float cross=abs(sin((p.x+p.y)*7.1-t*.35+h*4.0));
    threadD=min(min(dendrite*.068+r*.016,synapse*.48),
      cross*.062+abs(p.x-p.y)*.014);
    mask=1.0-smoothstep(.41,.61,r);
    phase=r*3.7+a*.7+h+t*.19;
    highlight=pow(.5+.5*sin(r*29.0-t*2.8+a*3.0),4.0);
  }else if(species==16){ // BASKET TWILL: alternating over-under warp and weft.
    vec2 loom=q*(.8+density*.78);
    vec2 cell=floor(loom),f=fract(loom)-.5;
    float twill=mod(cell.x+2.0*cell.y,4.0);
    float warp=abs(f.x),weft=abs(f.y);
    threadD=min(warp,weft)*.16;
    phase=loom.x*1.7+loom.y*1.37;
    highlight=.5+.5*cos(twill*1.5708+phase*.12+t*.32);
  }else if(species==17){ // HERRINGBONE: mirrored directional woven chevrons.
    vec2 loom=q*(.62+density*.84);
    float stripe=floor(loom.y*.42);
    float direction=mix(-1.0,1.0,mod(stripe,2.0));
    float v=abs(fract(loom.x+direction*loom.y*.58)-.5);
    float cross=abs(fract(loom.y*.79)-.5);
    threadD=min(v*.15,cross*.19);
    phase=loom.x*.82+direction*loom.y*.63;
    highlight=.5+.5*sin(phase*5.2+t*.45+stripe);
  }else if(species==18){ // MACRAMÉ: symmetric diamond loops and knots.
    vec2 loom=q*(.56+density*.54),cell=floor(loom);
    vec2 p=fract(loom)-.5;
    float diamond=abs(abs(p.x)+abs(p.y)-.34);
    float crossings=abs(p.x*p.y);
    float knot=abs(length(p)-.095);
    threadD=min(min(diamond*.28,crossings*.75),knot*.22);
    phase=(p.x-p.y)*9.0+cell.x*1.9-cell.y*1.4;
    highlight=.5+.5*cos(phase*1.7+t*.38);
  }else if(species==19){ // BOBBIN LACE: diagonal pairs and pinhole rosettes.
    vec2 loom=q*(.65+density*.66);
    vec2 p=fract(loom)-.5;
    float crossing=min(abs(p.x+p.y),abs(p.x-p.y));
    float rosette=abs(length(p)-.27);
    float pins=abs(sin(atan(p.y,p.x)*8.0+t*.16));
    threadD=min(crossing*.16,rosette*(.18+.06*pins));
    phase=(loom.x+loom.y)*.93+atan(p.y,p.x);
    highlight=.5+.5*cos(phase*4.3+t*.27);
  }else if(species==20){ // MOBIUS CABLE: twisting paired strands on a spiral band.
    float angle=atan(q.y,q.x),radial=length(q);
    float cablePhase=angle*2.0+log(1.0+radial)*9.0+t*.31;
    float cable=sin(cablePhase*3.0+sin(angle*2.0)*1.8);
    float partner=cos(cablePhase*3.0-angle*2.0+t*.23);
    threadD=min(abs(cable)*.081,abs(partner)*.083);
    mask=1.0-smoothstep(7.0,11.5,radial);
    phase=cablePhase*1.3;
    highlight=.5+.5*sin(cablePhase*6.0+t*.74);
  }else if(species==21){ // PARASITIC LADDER: rungs crawl over a growing scaffold.
    vec2 loom=q*(.54+density*.67);
    float serpent=sin(loom.y*.7+t*.55+sin(loom.x*.41)*.5);
    float rail=abs(abs(fract(loom.x*.28+serpent*.13)-.5)-.29);
    float rung=abs(fract(loom.y*.79+sin(loom.x*.4+t*.32)*.16)-.5);
    float bar=min(rail*.19,rung*.21+rail*.13);
    float parasite=abs(sin(loom.x*1.3+loom.y*.61-t*.94));
    threadD=min(bar,parasite*.073+.015);
    phase=loom.y*.73+serpent*2.1;
    highlight=.5+.5*cos(phase*4.0-t*1.3);
  }else if(species==22){ // FERAL JACQUARD: migration and actual warp/weft corruption.
    // Two crossing families move independently, instead of a screen-space noise overlay.
    vec2 loom=q*(.59+density*.88);
    float migration=t*(.19+filamentFeralMigration*1.38);
    float wild=filamentFeralCorruption;
    float mutation=filamentFeralMutation;
    float warpCoord=loom.x+wild*(.13+.49*mutation)*
      sin(loom.y*.69+migration+seedPhase*.37);
    float weftCoord=loom.y+wild*(.13+.49*mutation)*
      cos(loom.x*.74-migration*.88+seedPhase*.28);
    warpCoord+=wild*mutation*.26*sin(weftCoord*1.87+migration*.31);
    weftCoord+=wild*mutation*.26*cos(warpCoord*1.63-migration*.39);
    float w=fract(warpCoord)-.5;
    float f=fract(weftCoord)-.5;
    float order=filamentFeralOrder;
    // Parity migrates and shears: actual threads exchange over-under precedence.
    float crossing=sin((floor(warpCoord)+floor(weftCoord))*3.14159265+
      migration*(.3+wild*2.4)+mutation*sin(loom.x*.27+loom.y*.43));
    float warpAbove=smoothstep(-.16-.22*order,.16+.22*order,crossing);
    float overUnder=abs(w)-abs(f);
    float gap=.06+wild*.13;
    float crossingNear=(1.0-smoothstep(.12,.39,max(abs(w),abs(f))));
    float warpGap=crossingNear*warpAbove*(1.0-order)*gap;
    float weftGap=crossingNear*(1.0-warpAbove)*(1.0-order)*gap;
    float warpD=abs(w)*.18+warpGap;
    float weftD=abs(f)*.18+weftGap;
    threadD=min(warpD,weftD);
    vec2 cell=vec2(w,f);
    float collar=abs(length(cell)-(.10+.045*sin(migration*.34+seedPhase)));
    float knotSeed=.5+.5*cos((floor(warpCoord)*5.17+floor(weftCoord)*3.71)+seedPhase);
    float knotMask=smoothstep(.3,.83,knotSeed)*filamentFeralKnots;
    threadD=min(threadD,collar*(.15+.08*(1.0-knotMask))+
      (1.0-knotMask)*.16);
    phase=warpCoord*.93+weftCoord*.82+warpAbove*1.71;
    highlight=clamp(.30+.53*warpAbove+.17*sin(phase*5.2+migration),0.0,1.0);
  }else if(species==23){ // QUASICRYSTAL BROCADE — 5-grid intersection embroidery.
    // de Bruijn-inspired multigrid: five angular line families with distinct
    // phason offsets. NOT the original Fivefold brocade's sinusoidal sum.
    // Irrationally related line directions yield quasiperiodic intersections.
    vec2 grid=q*(.32+filamentQuasiSpacing*.70);
    float phason=filamentQuasiPhason*6.2831853+seedPhase*.23;
    float drift=filamentQuasiDrift;
    float nearest=1.0,runnerUp=1.0,nearPhase=0.0,neighborPhase=0.0;
    float variation=0.0;
    for(int i=0;i<5;i++){
      float fi=float(i);
      float angle=fi*1.2566370614;
      vec2 normal=vec2(cos(angle),sin(angle));
      float move=drift*.27*sin(t*(.15+.34*drift)+fi*2.39996323+phason*.63);
      float offset=(.21+.43*filamentQuasiPhason)*sin(fi*2.39996323+phason);
      float coord=dot(grid,normal)*( .85+.42*filamentQuasiSpacing )+offset+move;
      // Smooth distance to one infinitely extended yarn line of this family.
      float signedLine=fract(coord+.5)-.5;
      float distance=abs(signedLine);
      if(distance<nearest){
        runnerUp=nearest;neighborPhase=nearPhase;
        nearest=distance;nearPhase=coord+fi*.618034;
      }else if(distance<runnerUp){
        runnerUp=distance;neighborPhase=coord+fi*.618034;
      }
      variation+=sin(coord*6.2831853+fi*1.256637)*.2;
    }
    // The primary yarn line follows whichever of the five families is closest.
    // At overlaps, introduce rare fivefold picot collars anchored to *two*
    // crossing yarn families, not a periodic overlay or checkerboard.
    float junction=(1.0-smoothstep(.015,.17,runnerUp))*
      (1.0-smoothstep(.035,.19,nearest));
    float piquet=abs(sin((nearPhase-neighborPhase)*5.0+variation*2.0));
    float ornament=filamentQuasiOrnament;
    float collar=abs(nearest-(.09+.055*piquet))*.49+.02*(1.0-junction);
    float extra=collar+(1.0-junction*ornament)*.3;
    threadD=min(nearest*(.19+.07*(1.0-filamentQuasiSpacing)),extra);
    quasiJunction=junction;
    quasiLift=clamp((.48+.52*cos(nearPhase*6.2831853+variation))* 
      (.38+.62*junction)+ornament*junction*.42,0.0,1.0);
    phase=nearPhase*.67+neighborPhase*.21+variation*.38;
    highlight=.5+.5*cos(phase*3.3+variation*2.4+t*.23);
  }else{
    // The branch is intentionally unreachable for validated species IDs.
    threadD=1.0;
    mask=0.0;
  }
#ifdef FILAMENT_SEMANTIC_GRAVITY
  // In the letter-cutout law, the very same glyph silhouette subtracts
  // fiber coverage before stitching, material, relief or hybrid contacts.
  if(semanticGravityMode==5){
    mask*=1.0-semanticGravityAmount*
      smoothstep(.18,.76,semanticTug.z);
  }
#endif
  // Signed-distance-like threads: sharp high-resolution core, wider translucent
  // halo and directional raised relief. The majority of pixels stay untouched.
  float aa=max(.005,1.2*freq/min(res.x,res.y));
  float width=.009+filamentWidth*.070;
#ifdef FILAMENT_PHYSICS
  // The unsigned distance is a projected carrier coordinate, not a signed
  // 3D centerline. Re-map it before core, construction, microloom and stitch
  // coverage are computed so they all follow the deformed yarn.
  float fpOriginal=threadD/max(width,.003);
  float fpClock=time*filamentPhysicsSpeed*1.5;
  float fpRate=mix(2.0,12.0,filamentPhysicsScale);
  float fpPhase=(phase+(q.x*.13+q.y*.09))*fpRate+seedPhase*.19;
  float fpReach=filamentPhysicsReach*2.2;
  float fpRepair=filamentPhysicsRepair;
  float fpWave=.5+.5*sin(fpPhase-fpClock);
  float fpGate=smoothstep(.23,.72,fpWave);
  float fpTarget=fpOriginal;
  float fpFlash=0.;
  if(filamentPhysics==1){ // Moving zipper opening and closing.
    float zip=fpReach*smoothstep(.30,.78,fpWave);
    fpTarget=abs(fpOriginal-zip)*(1.+zip*.6);
    fpFlash=1.-smoothstep(.02,.18,abs(fpWave-.53));
  }else if(filamentPhysics==2){ // Parent lane splits into nested daughter lanes.
    float split=fpReach*fpGate;
    float daughter=abs(fpOriginal-split)*1.65;
    float inner=abs(fpOriginal-split*.44)*1.9;
    fpTarget=mix(fpOriginal,min(daughter,inner),fpGate);
    fpFlash=4.*fpGate*(1.-fpGate);
  }else if(filamentPhysics==3){ // Thin, tapering hairs peel from the carrier.
    float fray=fpReach*fpGate;
    float fine=.5+.5*sin(fpPhase*3.3-fpClock*1.9);
    float hair=abs(fpOriginal-fray*(.45+.55*fine))*3.2;
    fpTarget=min(fpOriginal,hair+(1.-fpGate)*2.);
    fpFlash=fpGate*fine*.7;
  }else if(filamentPhysics==4){ // Sequential loose loops rejoin the core.
    float unwind=.5+.5*cos(fpPhase-fpClock);
    float loop=fpReach*unwind*(.6+.4*sin(fpPhase*2.+fpClock));
    float loose=abs(fpOriginal-loop)*1.6;
    fpTarget=mix(fpOriginal,loose,smoothstep(.2,.85,unwind));
    fpFlash=4.*unwind*(1.-unwind);
  }else if(filamentPhysics==5){ // Traveling splice joining alternate seam ends.
    float splice=sin(fpPhase*.7-fpClock);
    float gate=abs(splice);
    float lane=fpReach*gate*.72;
    fpTarget=mix(abs(fpOriginal-lane)*1.55,fpOriginal,1.-smoothstep(.08,.62,gate));
    fpFlash=1.-smoothstep(.04,.28,gate);
  }else if(filamentPhysics==6){ // Two opposing fiber fronts converge.
    float a=fpReach*(.5+.5*sin(fpPhase-fpClock));
    float b=fpReach*(.5+.5*sin(fpPhase+fpClock+1.57));
    fpTarget=min(abs(fpOriginal-a),abs(fpOriginal-b))*1.8;
    fpFlash=1.-smoothstep(.06,.48,abs(a-b));
  }else if(filamentPhysics==7){ // Rupture gaps travel through tension nodes.
    float stress=pow(.5+.5*sin(fpPhase-fpClock),5.);
    float rupture=smoothstep(.56,.88,stress);
    fpTarget=fpOriginal+rupture*(1.+fpReach)*(1.-fpRepair*.62);
    fpFlash=1.-smoothstep(.06,.20,abs(stress-.57));
  }else if(filamentPhysics==8){ // Second parent reacts to actual incoming core.
    float contact=clamp(incomingCore,0.,1.);
    float bridge=fpGate*contact;
    float lane=fpReach*bridge;
    fpTarget=min(fpOriginal,abs(fpOriginal-lane)*1.6+(1.-bridge)*2.);
    fpFlash=bridge;
  }
  // Repair closes portions of the opening over a bounded periodic cycle.
  float fpHeal=fpRepair*smoothstep(.50,.95,.5+.5*cos(fpPhase*.63-fpClock*.81));
  float fpBlend=filamentPhysicsAmount*(1.-fpHeal);
  threadD=max(0.,mix(fpOriginal,fpTarget,fpBlend))*width;
  fpFlash*=fpBlend;
#endif
  float core=(1.0-smoothstep(width,width+aa,threadD))*mask;
#ifdef FILAMENT_CONSTRUCTION
  // Unsigned carrier distance: mirrored projected fiber lanes, not 3D paths.
  float yr=threadD/max(width,.003);
  float ya=clamp(aa/max(width,.003),.025,.38);
  float yp=phase*mix(5.,29.,filamentConstructionPitch)+(q.x+q.y*.63)*.55+
    time*filamentConstructionMotion*1.8+seedPhase*.13;
  float yg=filamentConstructionGap;
  float yl=mix(.35,.075,yg);
  float yarnCoverage=1.,yarnShine=.5,yarnShade=0.;
  if(filamentConstruction==1){
    float a=sin(yp),b=cos(yp);
    float sa=1.-smoothstep(yl,yl+ya,abs(yr-(.19+.58*abs(a))));
    float sb=1.-smoothstep(yl,yl+ya,abs(yr-(.19+.58*abs(b))));
    yarnCoverage=max(sa,sb);
    yarnShine=max(sa*(.45+.55*a*a),sb*(.45+.55*b*b));yarnShade=min(sa,sb)*.6;
  }else if(filamentConstruction==2){
    yarnCoverage=0.;yarnShine=0.;
    for(int ply=0;ply<3;ply++){
      float a=yp+float(ply)*2.0943951;
      float body=1.-smoothstep(yl*.82,yl*.82+ya,abs(yr-(.16+.66*abs(sin(a)))));
      yarnShade=max(yarnShade,min(yarnCoverage,body)*.52);
      yarnCoverage=max(yarnCoverage,body);yarnShine=max(yarnShine,body*(.5+.5*cos(a)));
    }
  }else if(filamentConstruction==3){
    float lane=.24+.48*abs(sin(yp))+.11*sin(yp*3.+yr*4.);
    float body=1.-smoothstep(yl*.85,yl*.85+ya,abs(yr-lane));
    float fine=.5+.5*cos(yp*4.+yr*12.);
    yarnCoverage=body*(.55+.45*fine);yarnShine=body*pow(fine,3.);yarnShade=body*(1.-fine)*.4;
  }else if(filamentConstruction==4){
    float hole=mix(.19,.66,yg);yarnCoverage=smoothstep(hole-ya,hole+ya,yr);
    yarnShine=yarnCoverage*(1.-smoothstep(.04,.28,abs(yr-hole-.15)))*(.65+.35*cos(yp*.45));
    yarnShade=yarnCoverage*(1.-yarnShine)*.32;
  }else if(filamentConstruction==5){
    float wrap=pow(.5+.5*cos(yp*1.5+yr*5.5),mix(2.,12.,yg));
    float rail=smoothstep(.22,.78,yr);
    yarnCoverage=mix(.64,1.,max(wrap,1.-rail));yarnShine=wrap*(.5+.5*rail);yarnShade=(1.-wrap)*rail*.38;
  }else if(filamentConstruction==6){
    float rib=pow(.5+.5*cos(yr*mix(8.,24.,filamentConstructionPitch)),mix(2.,8.,yg));
    yarnCoverage=mix(.33,1.,rib);yarnShine=rib*(.72+.28*cos(yp*.35));yarnShade=(1.-rib)*.43;
  }else if(filamentConstruction==7){
    float micro=abs(fract(yr*mix(3.,7.,filamentConstructionPitch)+.25*sin(yp))-.5);
    float ridge=1.-smoothstep(yl*.5,yl*.5+max(.05,ya*.55),micro);
    yarnCoverage=mix(.22,1.,ridge);yarnShine=ridge*(.65+.35*cos(yp+yr*8.));yarnShade=(1.-ridge)*.43;
  }else if(filamentConstruction==8){
    vec2 grid=vec2(yp*.32,yr*mix(2.,5.,filamentConstructionPitch));
    grid.x+=.5*mod(floor(grid.y),2.);
    float pr=length((fract(grid)-.5)*vec2(.85,1.2));
    float radius=mix(.12,.37,yg);
    yarnCoverage=smoothstep(radius-.06,radius+.06,pr);
    yarnShine=1.-smoothstep(.035,.13,abs(pr-radius-.07));yarnShade=(1.-yarnShine)*.24;
  }
  float yarnMix=filamentConstructionAmount;
  core*=mix(1.,clamp(yarnCoverage,0.,1.),yarnMix);
#endif
#ifdef FILAMENT_MICROLOOM
  // Two bounded nested scales; no recursive shader calls or extra passes.
  // Fade detail below pixel footprint to reduce shimmer in phone previews.
  float mlAcross=threadD/max(width,.003);
  float mlClock=time*filamentMicroloomMotion*.85;
  float mlScale=mix(1.2,4.5,filamentMicroloomScale);
  vec2 mlCoord=vec2(phase*3.1+(q.x+q.y*.71)*.65,mlAcross)*mlScale;
  mlCoord+=vec2(mlClock*.42,.14*sin(mlClock));
  vec3 mlCoarse=microloomField(mlCoord,mlClock);
  float mlRatio=mix(1.8,3.5,filamentMicroloomDepth);
  vec2 mlFineCoord=mlCoord*mlRatio+vec2(.17*sin(mlClock*.7),-.23*mlClock);
  vec3 mlFine=microloomField(mlFineCoord,-mlClock*.72);
  float mlFoot=aa/max(width,.003)*mlScale;
  float mlCoarseVisible=1.-smoothstep(.22,.85,mlFoot);
  float mlFineVisible=1.-smoothstep(.18,.75,mlFoot*mlRatio);
  float mlDepth=filamentMicroloomDepth*mlFineVisible;
  float mlStrength=filamentMicroloomAmount*mlCoarseVisible;
  float mlCover=mix(mlCoarse.x,mlCoarse.x*mlFine.x,mlDepth);
  float mlLight=mix(mlCoarse.y,mlCoarse.y*(.35+.65*mlFine.y),mlDepth);
  float mlPigment=mix(mlCoarse.z,mlFine.z,mlDepth*.7);
  core*=mix(1.,clamp(mlCover,0.,1.),mlStrength*filamentMicroloomOpenwork);
#endif
  maskCore=core;
#ifdef FILAMENT_SCULPT
  float sculptReveal=1.0;
#endif
  float halo=(1.0-smoothstep(width*2.0,width*5.5+aa,threadD))*mask;
  float edge=(1.0-smoothstep(width*.5,width*2.5+aa,abs(threadD-width*1.25)))*mask;
#ifdef FILAMENT_STITCHING
  // Continuous procedural arclength proxy. No sawtooth resets of accumulated
  // geometry: periodic moving windows fade at both ends of their stitch.
  // Secondary parent has its own phase offset and rotated thread coordinates.
  float sewClock=time*(.08+filamentStitchSpeed*1.12);
  float localProgress=phase*.27+q.x*.11+q.y*.07+
    seedPhase*.093+phaseOffset*.14;
  float span=mix(.055,.47,filamentStitchLength);
  float travel=fract(localProgress-sewClock);
  float movingWindow=smoothstep(.02,.105,travel)*
    (1.0-smoothstep(span,span+.09,travel));
  float visibleStitch=1.0;
  float needle=0.0;
  if(filamentStitchMode==0){ // Sharp migrating tip with short stitched tail.
    visibleStitch=.12+.88*movingWindow;
    needle=pow(clamp(1.0-abs(travel-.11)*10.0,0.0,1.0),2.0);
  }else if(filamentStitchMode==1){ // Wide shuttle crossing the cloth.
    float shuttle=fract(q.x*.093+q.y*.014-sewClock*.53+
      phaseOffset*.08+seedPhase*.031);
    visibleStitch=.08+.92*smoothstep(.025,.12,shuttle)*
      (1.0-smoothstep(.45+span*.67,.58+span*.67,shuttle));
    needle=pow(max(0.0,1.0-abs(shuttle-.13)*7.0),2.0);
  }else if(filamentStitchMode==2){ // Classic separated running stitches.
    float running=.5+.5*cos(6.2831853*travel);
    visibleStitch=.08+.92*smoothstep(.42,.68,running);
    needle=pow(running,14.0);
  }else if(filamentStitchMode==3){ // Thread loops inhale and exhale.
    float breathing=.5+.5*cos(6.2831853*travel);
    visibleStitch=.25+.75*breathing;
    needle=pow(breathing,7.0);
  }else if(filamentStitchMode==4){ // Original unfurl & resew, unchanged.
    float build=.5+.5*cos(sewClock*.78+phaseOffset*.25);
    float position=clamp(uv.x+.065*sin(uv.y*11.0+seedPhase*.18),0.0,1.0);
    float reveal=1.0-smoothstep(build-.055,build+.055,position);
    visibleStitch=.05+.95*reveal;
    needle=pow(max(0.0,1.0-abs(position-build)*11.0),3.0);
  }else if(filamentStitchMode==5){ // HELIX HANDOFF: counter-moving carriers.
    float strand=.5+.5*sin(localProgress*27.0-sewClock*2.2);
    float crossing=.5+.5*sin(localProgress*27.0+sewClock*1.7+seedPhase);
    float first=pow(strand,6.0);
    float second=pow(crossing,6.0);
    float baton=max(first,second);
    visibleStitch=.11+.89*smoothstep(.05,.81,baton);
    needle=pow(baton,2.0);
  }else if(filamentStitchMode==6){ // KNOT CASCADE: local nodes fire sequentially.
    float position=localProgress*14.0;
    float node=floor(position);
    float within=fract(position);
    float activation=.5+.5*sin(sewClock*1.7-node*.84+seedPhase*.3);
    float tied=pow(max(0.0,1.0-abs(within-.5)*3.2),3.0);
    visibleStitch=.13+.87*(.16+.84*activation*(.28+.72*tied));
    needle=pow(activation,12.0)*tied;
  }else if(filamentStitchMode==7){ // SYNAPTIC FIRING: traveling spike and wake.
    float position=fract(localProgress*.72-sewClock*.49);
    float spike=exp(-pow((position-.19)*14.0,2.0));
    float wake=exp(-pow((position-.42)*4.9,2.0));
    visibleStitch=.09+.91*clamp(.11+wake*.49+spike*.82,0.0,1.0);
    needle=spike;
  }else if(filamentStitchMode==8){ // ALIEN MORSE: seeded short/long packets.
    float symbol=localProgress*16.0-sewClock*.75;
    float symbolId=floor(symbol);
    float slot=fract(symbol);
    float letter=hash(vec2(symbolId,seedPhase*3.7));
    float duration=mix(.23,.72,step(.5,letter));
    float envelope=smoothstep(.02,.11,slot)*
      (1.0-smoothstep(duration,duration+.12,slot));
    visibleStitch=.10+.90*envelope;
    needle=pow(max(0.0,1.0-abs(slot-duration)*10.0),3.0)*
      (.35+.65*envelope);
  }else if(filamentStitchMode==9){ // CORAL ACCRETION: expanding reef growth rings.
    vec2 colony=fract(q*.35+vec2(seedPhase*.037,phaseOffset*.019))-.5;
    float radial=length(colony);
    float mainRing=.5+.5*cos(radial*26.0-sewClock*1.07);
    float tinyRing=.5+.5*cos(radial*51.0-sewClock*.61+seedPhase*.29);
    float budding=mainRing*.78+tinyRing*.22;
    visibleStitch=.11+.89*smoothstep(.27,.77,budding);
    needle=pow(mainRing,11.0)*(.25+.75*tinyRing);
  }else if(filamentStitchMode==10){ // TIDAL DARNING: interfering seam waves.
    float tide=sin(q.x*.62+sewClock*.78+
      sin(q.y*.86+seedPhase*.18)*.9)*
      cos(q.y*.54-sewClock*.51);
    float cross=.5+.5*sin(localProgress*18.0+sewClock*.97);
    visibleStitch=.11+.89*smoothstep(-.17,.45,tide)*
      (.52+.48*cross);
    needle=pow(.5+.5*tide,8.0)*pow(cross,5.0);
  }else if(filamentStitchMode==11){ // FRACTAL INFESTATION: nested growth fronts.
    float coarse=sin(localProgress*6.0-sewClock*.42);
    float middle=sin(localProgress*19.0+
      sin(q.x*.8+seedPhase)*1.5-sewClock*1.08);
    float fine=sin(localProgress*51.0+seedPhase*.7-sewClock*2.7);
    float growth=.49*coarse+.33*middle+.18*fine;
    visibleStitch=.09+.91*smoothstep(-.31,.42,growth);
    needle=pow(max(0.0,1.0-abs(growth-.24)*3.9),4.0);
  }else if(filamentStitchMode==12){ // REVERSE UNPICK: traveling stitch removal gap.
    float position=fract(localProgress*.67+sewClock*.69);
    float tear=smoothstep(.12,.24,position)*
      (1.0-smoothstep(.49,.65,position));
    visibleStitch=1.0-.94*tear;
    needle=pow(max(0.0,1.0-abs(position-.5)*12.0),4.0);
  }else if(filamentStitchMode==13){ // RICOCHET NEEDLE: ping-pong seam head.
    float bounce=1.0-abs(2.0*fract(sewClock*.19+phaseOffset*.032)-1.0);
    float position=fract(localProgress*.15+seedPhase*.027);
    float gap=abs(position-bounce);
    gap=min(gap,1.0-gap);
    float radius=.055+span*.26;
    visibleStitch=.09+.91*(1.0-smoothstep(radius,radius+.13,gap));
    needle=pow(max(0.0,1.0-gap*18.0),3.0);
  }else if(filamentStitchMode==14){ // WORMHOLE CROCHET: spiral intake of stitches.
    float angle=atan(q.y,q.x);
    float radial=log(1.0+length(q));
    float spiral=angle*2.0+radial*14.0-sewClock*.96+seedPhase*.12;
    float curl=.5+.5*cos(spiral);
    float gate=.5+.5*cos(localProgress*11.0-sewClock*.49);
    visibleStitch=.10+.90*smoothstep(.35,.73,curl)*
      (.46+.54*gate);
    needle=pow(curl,15.0)*pow(gate,5.0);
  }else if(filamentStitchMode==15){ // PARASITE HEM: irregular invasive fronts.
    float tendril=sin(localProgress*8.1+
      sin(q.y*1.4+sewClock*.48)*2.0);
    float invasion=fract(localProgress*.64-sewClock*.42+
      tendril*.11+seedPhase*.017);
    float invasionMask=1.0-smoothstep(.21,.39,invasion);
    float capillary=pow(.5+.5*cos(tendril*8.4-sewClock*.91),7.0);
    visibleStitch=.12+.88*clamp(invasionMask*(.42+.58*capillary),0.0,1.0);
    needle=pow(max(0.0,1.0-abs(invasion-.26)*12.0),5.0);
  }else if(filamentStitchMode==16){ // ORACLE TACKING: seeded order of sewn symbols.
    float index=floor(localProgress*17.0);
    float symbol=hash(vec2(index,seedPhase));
    float slot=fract(localProgress*17.0);
    float onset=fract(sewClock*.24+symbol);
    float oracle=pow(max(0.0,.5+.5*cos((slot-onset)*6.2831853)),13.0);
    float gate=step(.31,symbol);
    visibleStitch=.14+.86*oracle*(.26+.74*gate);
    needle=pow(oracle,2.0)*gate;
  }else if(filamentStitchMode==17){ // SPASM TATTING: mixed frequency nervous impulses.
    float spasms=sin(localProgress*21.0-sewClock*1.9+
      sin(localProgress*7.0+seedPhase)*2.7);
    float shaking=sin(localProgress*47.0+sewClock*3.3+
      sin(q.x*3.2+sewClock*.73));
    float twitch=.57*spasms+.43*shaking;
    visibleStitch=.08+.92*smoothstep(-.25,.62,twitch);
    needle=pow(.5+.5*twitch,11.0);
  }else if(filamentStitchMode==18){ // HOLOGRAM DARNING: phase-shifted spectral mesh.
    float lightA=sin(localProgress*16.0-sewClock*.64+q.y*.41);
    float lightB=cos(localProgress*18.0+sewClock*.79+q.x*.31);
    float scan=sin((q.x-q.y)*4.3-sewClock*.36+seedPhase*.18);
    float hologram=.44*lightA+.39*lightB+.17*scan;
    visibleStitch=.09+.91*smoothstep(-.43,.55,hologram);
    needle=pow(.5+.5*cos((lightA-lightB)*4.3+sewClock),11.0);
  }else if(filamentStitchMode==19){ // RITUAL OVERLOCK: serpentine over-under edge.
    float edgeWave=sin(localProgress*11.0+sewClock*.84);
    float braid=cos(localProgress*29.0-sewClock*1.31+
      sin(q.y*.84+seedPhase)*.63);
    float seam=.49*edgeWave+.51*braid;
    visibleStitch=.15+.85*smoothstep(-.3,.41,seam);
    needle=pow(.5+.5*cos(seam*6.1+sewClock*.44),9.0);
  }else if(filamentStitchMode==20){ // WITCH-KNOT RELAY: handoff between packet nodes.
    float position=localProgress*12.0;
    float node=floor(position),between=fract(position);
    float awake=.5+.5*cos(sewClock*1.21-node*1.7+seedPhase*.28);
    float knot=pow(max(0.0,1.0-abs(between-.5)*2.9),4.0);
    float relay=pow(awake,5.0);
    visibleStitch=.12+.88*(.15+.85*relay*knot);
    needle=pow(awake,16.0)*knot;
  }else if(filamentStitchMode==21){ // CHAIN STITCH: interlocking loop waves.
    float loop=.5+.5*cos(localProgress*21.0-sewClock*.78);
    float chain=.5+.5*cos(localProgress*10.5+sewClock*.36);
    visibleStitch=.13+.87*smoothstep(.28,.71,loop)*(.55+.45*chain);
    needle=pow(loop,15.0)*pow(chain,3.0);
  }else if(filamentStitchMode==22){ // CROSS STITCH: alternating X passes.
    float cross=.5+.5*cos(localProgress*32.0-sewClock*.48);
    float reverse=.5+.5*cos(localProgress*32.0+sewClock*.51+1.5708);
    visibleStitch=.12+.88*smoothstep(.29,.79,max(cross,reverse)*.82);
    needle=pow(max(cross,reverse),17.0);
  }else if(filamentStitchMode==23){ // SATIN FILL: dense comb of fine strokes.
    float comb=.5+.5*cos(localProgress*69.0-sewClock*.59);
    float sweep=.5+.5*sin(q.y*.47+sewClock*.27);
    visibleStitch=.17+.83*smoothstep(.32,.64,comb)*(.6+.4*sweep);
    needle=pow(comb,22.0)*sweep;
  }else if(filamentStitchMode==24){ // BLANKET STITCH: hems advance around edges.
    float hem=.5+.5*cos(localProgress*24.0-sewClock*.65);
    float wrap=.5+.5*sin(q.y*1.4+sewClock*.26+seedPhase*.17);
    visibleStitch=.12+.88*smoothstep(.3,.72,hem)*(.45+.55*wrap);
    needle=pow(hem,13.0)*pow(wrap,4.0);
  }else if(filamentStitchMode==25){ // FEATHER STITCH: branching mirrored passes.
    float feather=sin(localProgress*28.0-sewClock*.65+
      sin(q.y*.85+t*.22)*1.2);
    float branch=.5+.5*cos(localProgress*12.0+sewClock*.21);
    visibleStitch=.1+.9*smoothstep(-.25,.61,feather)*(.49+.51*branch);
    needle=pow(.5+.5*feather,10.0)*branch;
  }else if(filamentStitchMode==26){ // CABLE KNIT: crossing rolling stitches.
    float cableA=.5+.5*cos(localProgress*19.0-sewClock*.59);
    float cableB=.5+.5*cos(localProgress*19.0+sewClock*.43+2.094);
    float knitting=max(cableA,cableB);
    visibleStitch=.14+.86*smoothstep(.31,.79,knitting);
    needle=pow(cableA*cableB+.5*knitting,12.0);
  }else if(filamentStitchMode==27){ // GHOST BOBBIN: transparent missing stitches.
    float haunt=.5+.5*sin(localProgress*15.0-sewClock*.61);
    float echo=.5+.5*cos(localProgress*47.0+sewClock*.91+seedPhase);
    visibleStitch=.04+.96*smoothstep(.13,.75,haunt*.7+echo*.3);
    needle=pow(echo,19.0)*pow(haunt,4.0);
  }else if(filamentStitchMode==28){ // QUANTUM UNPICK: superposed stitch gaps.
    float pair=cos(localProgress*17.0-sewClock*.87);
    float alternate=sin(localProgress*31.0+sewClock*.77+seedPhase*.4);
    float superposed=abs(pair*.57+alternate*.43);
    visibleStitch=.06+.94*smoothstep(.11,.74,superposed);
    needle=pow(superposed,12.0);
  }else if(filamentStitchMode==29){ // MUTANT ZIPPER: locking luminous teeth.
    float teeth=.5+.5*cos(localProgress*57.0-sewClock*.42);
    float jaws=.5+.5*sin(localProgress*8.0-sewClock*.94+q.x*.42);
    visibleStitch=.11+.89*smoothstep(.28,.83,teeth)*(.25+.75*jaws);
    needle=pow(teeth,17.0)*pow(jaws,7.0);
  }else if(filamentStitchMode==30){ // FRACTAL MENDING: repairs within repairs.
    float mother=sin(localProgress*7.0-sewClock*.41);
    float child=sin(localProgress*27.0-sewClock*1.19+mother*2.2);
    float grandchild=sin(localProgress*81.0-sewClock*2.1+child*2.0);
    float repair=.49*mother+.33*child+.18*grandchild;
    visibleStitch=.1+.9*smoothstep(-.28,.49,repair);
    needle=pow(.5+.5*repair,12.0);
  }else if(filamentStitchMode==31){ // CHLADNI NEEDLE ORCHESTRA — nodal seam geometry.
    // Standing-wave eigenmode proxy in the *thread's own local coordinates*.
    // No history buffers; both hybrid parents inherit their own q/phase offset.
    float nx=2.0+floor(filamentChladniOrder*6.0);
    float ny=nx+1.0+floor(filamentChladniDetune*3.0);
    float resonance=filamentChladniResonance;
    float modeTime=sewClock*(.11+.37*resonance);
    float phaseBias=filamentChladniPhase*6.2831853+phaseOffset*.23;
    vec2 plate=q*(.40+filamentChladniDensity*.42);
    float harmonicA=sin(nx*plate.x+phaseBias+sin(modeTime)*resonance)*
      sin(ny*plate.y-phaseBias*.43);
    float harmonicB=sin(ny*plate.x-phaseBias*.37)*
      sin(nx*plate.y+phaseBias*.53-cos(modeTime*1.11)*filamentChladniDetune);
    float mode=abs(harmonicA-harmonicB);
    float nodalBand=1.0-smoothstep(.035,.12+.22*(1.0-filamentChladniDensity),mode);
    float stitchPulse=.5+.5*cos(localProgress*(8.0+filamentChladniDensity*13.0)-
      sewClock*(.27+resonance*.91)+mode*9.0);
    // Needle only fires along nodal strands. Reveal masks the *real fiber*.
    visibleStitch=.07+.93*nodalBand*(.19+.81*smoothstep(.26,.78,stitchPulse));
    needle=nodalBand*pow(stitchPulse,12.0)*( .3+.7*resonance);

  }else if(filamentStitchMode==32){ // RETROCAUSAL EMBROIDERY: analytic future-looking needlework.
    // Deterministic sampling of the seam's analytic phase at t, t+lead
    // and a backwards-running counter-wave. No history buffers or CPU state.
    // All signals live in local thread coordinates for both hybrid parents.
    float lead=.17+filamentRetroLead*2.7;
    float phi=localProgress*(12.0+filamentStitchLength*13.0)+seedPhase*.41;
    float sweep=sewClock*(.47+.29*filamentStitchSpeed);
    float future=sweep+lead;
    float backwards=sewClock*(.39+.26*filamentRetroReversal);
    float nowPulse=.5+.5*cos(phi-sweep);
    float prePulse=.5+.5*cos(phi-future);
    float secondPre=.5+.5*cos(phi-future*(1.0+.22*filamentRetroParadox));
    float reversePulse=.5+.5*cos(phi+backwards+phaseOffset*.27);
    float seamSharpness=mix(.24,.74,filamentRetroCoherence);
    float nowSewn=smoothstep(.19,seamSharpness,nowPulse);
    float approaching=smoothstep(.19,seamSharpness,prePulse);
    float phantom=smoothstep(.22,seamSharpness+.08,secondPre);
    float reversed=smoothstep(.2,seamSharpness,reversePulse);
    // A future knot flashes at a seed-anchored seam station BEFORE the
    // traveling present-time stitch pulse reaches it.
    float knotIndex=floor(localProgress*(5.0+filamentStitchLength*9.0)+seedPhase*.071);
    float knots=pow(.5+.5*cos(knotIndex*2.39996323-
      future*(.53+.29*filamentRetroParadox)),7.0);
    float knotStation=pow(.5+.5*cos(localProgress*6.2831853*
      (5.0+filamentStitchLength*9.0)+seedPhase*.071),11.0);
    float predictedKnot=knots*knotStation*filamentRetroKnots;
    float anticipatory=filamentRetroEcho*(.65*approaching+.35*phantom);
    float timeParadox=filamentRetroParadox*
      (.52*min(approaching,reversed)+.48*abs(approaching-reversed));
    float backwardGate=filamentRetroReversal*reversed;
    // Both revelation and the needle glow are clipped downstream by real
    // existing core/halo/edge fiber masks — NEVER a loose screen overlay.
    visibleStitch=.045+.955*clamp(.52*nowSewn+
      .63*anticipatory+.36*backwardGate+.41*timeParadox+
      .46*predictedKnot,0.0,1.0);
    needle=clamp(pow(prePulse,15.0)*(.28+.72*filamentRetroLead)*
      filamentRetroEcho+pow(nowPulse,18.0)*.65+
      predictedKnot*.8+pow(reversePulse,18.0)*filamentRetroReversal*.38,
      0.0,1.0);
  }else{ // Invalid stored mode: leave the drawn thread untouched.
    visibleStitch=1.0;
    needle=0.0;
  }
  // Apply to all three geometry masks, including crossbred contact. The
  // underlying art remains visible where the stitch is not yet "sewn".
  float reveal=mix(1.0,visibleStitch,filamentStitchAmount);
  core*=reveal;
  halo*=reveal;
  edge*=reveal;
  maskCore=core;
#ifdef FILAMENT_SCULPT
  sculptReveal=reveal;
#endif
#endif

#ifdef FILAMENT_REGENERATION
  // Daughter threads are new signed-distance fiber masks. Construct
  // BEFORE the palette, neural response, fiber material and ornament passes.
  // Site phases are anchored to each existing animated thread's own path.
  float growthClock=time*(.14+filamentRegenSpeed*1.22)+phaseOffset*.17;
  float growthFreq=1.4+filamentRegenBranches*5.9;
  float scarSite=floor(phase*growthFreq*.29+seedPhase*.14);
  float localArc=fract(phase*growthFreq*.29+seedPhase*.14)-.5;
  float siteNoise=fract(sin(scarSite*74.17+seedPhase)*17319.37);
  float age=fract(growthClock*.21+siteNoise*.71);
  // Grow forward, dwell at full reach, then fade BEFORE the cycle wraps.
  // At age 0 and age 1 the daughter opacity is zero, so no popped frames.
  float tip=smoothstep(.025,.67,age);
  float senescence=1.0-smoothstep(.79,.985,age);
  float rootToTip=clamp((localArc+.5)*1.3,0.0,1.0);
  float drawn=1.0-smoothstep(tip-.06,tip+.055,rootToTip);
  float footprint=(1.0-smoothstep(.12,.47,abs(localArc)))*
    drawn*senescence;
  float sproutReach=width*(.65+filamentRegenHealing*1.8)*
    pow(max(0.0,1.0-abs(localArc)*1.8),1.2)*tip;
  float curl=sin(localArc*15.0+growthClock*.67+siteNoise*6.28318);
  float fibRadius=max(width*(.11+.20*filamentRegenHealing),aa*.55);
  float newDist=1.0e3;
  float newAccent=0.0;
  if(filamentRegenMode==1){ // FORKED NERVE SHOOTS
    float forkA=abs(threadD-sproutReach*(.84+.22*curl));
    float forkB=abs(threadD-sproutReach*(1.18-.21*curl));
    newDist=min(forkA,forkB);
    newAccent=.54+.46*abs(curl);
  }else if(filamentRegenMode==2){ // WOUND BRIDGES
    float gap=1.0-smoothstep(.09,.37,abs(localArc));
    float bridge=width*(.55+filamentRegenHealing*1.45)*gap*tip;
    newDist=abs(threadD-bridge);
    footprint*=gap;
    newAccent=.6;
  }else if(filamentRegenMode==3){ // MYCELIAL FAN
    float filamentA=abs(threadD-sproutReach*(.54+.19*sin(localArc*23.0+growthClock*.29)));
    float filamentB=abs(threadD-sproutReach*(1.0+.17*cos(localArc*32.0-growthClock*.41)));
    float filamentC=abs(threadD-sproutReach*(1.38+.16*sin(localArc*39.0+siteNoise*6.28)));
    newDist=min(filamentA,min(filamentB,filamentC));
    newAccent=.58+.42*siteNoise;
  }else if(filamentRegenMode==4){ // PEARLY CALLUS
    float node=pow(.5+.5*cos(localArc*20.0+siteNoise*6.28),5.0);
    newDist=abs(threadD-width*(.85+filamentRegenHealing*1.7*node*tip));
    newAccent=.41+.59*node;
  }else if(filamentRegenMode==5){ // GOLD REPAIR VINES
    float vein=sin(localArc*29.0+sin(localArc*13.0+growthClock*.24)*2.1);
    newDist=abs(threadD-sproutReach*(.91+.23*vein));
    newAccent=.55+.45*abs(vein);
  }else if(filamentRegenMode==6){ // SYNAPTIC GRAFTS
    // Only enhance the graft near a REAL crossing of parent cores;
    // solo threads can still form a thin unconnected sprout.
    float contact=clamp(incomingCore*mask,0.0,1.0);
    newDist=abs(threadD-sproutReach*(.67+.7*contact));
    newAccent=.34+.66*contact;
  }else if(filamentRegenMode==7){ // DARNING LADDERS
    float railA=abs(threadD-sproutReach*.53);
    float railB=abs(threadD-sproutReach*1.21);
    // A cross-rung is bounded in BOTH thread-distance and arclength.
    float rungRadial=abs(threadD-sproutReach*.87)-sproutReach*.34;
    float rungArc=abs(localArc*width*11.0);
    float rung=max(rungRadial,rungArc);
    newDist=min(min(railA,railB),max(0.0,rung));
    newAccent=.49+.51*(1.0-smoothstep(0.0,width*.8,rungArc));
  }else if(filamentRegenMode==8){ // SASHIKO CROSSHATCH
    float along=clamp(localArc+.5,0.0,1.0);
    float diagonalA=abs(threadD-sproutReach*(.11+.94*along));
    float diagonalB=abs(threadD-sproutReach*(1.05-.94*along));
    newDist=min(diagonalA,diagonalB);
    newAccent=.56+.44*abs(along-.5)*2.0;
  }else if(filamentRegenMode==9){ // CORAL ANASTOMOSIS
    float a=clamp(localArc+.5,0.0,1.0);
    float arch=sin(a*3.1415926);
    float armA=abs(threadD-sproutReach*(.15+.9*arch));
    float armB=abs(threadD-sproutReach*(.15+.57*arch));
    newDist=min(armA,armB);
    newAccent=.55+.45*arch;
  }else if(filamentRegenMode==10){ // AXOLOTL FRILLS
    float fingers=5.0+floor(filamentRegenBranches*7.0);
    float station=fract((localArc+.5)*fingers);
    float hair=abs(station-.5)*width*(3.5+filamentRegenHealing*1.5);
    float reach=sproutReach*(.39+.61*max(0.0,1.0-abs(station-.5)*2.0));
    newDist=length(vec2(hair,threadD-reach))*.68;
    newAccent=.47+.53*max(0.0,1.0-abs(station-.5)*2.0);
  }else if(filamentRegenMode==11){ // OPAL VESICLE LATTICE
    float beads=3.0+floor(filamentRegenBranches*6.0);
    float station=fract((localArc+.5)*beads)-.5;
    vec2 centered=vec2(station*width*(3.1+filamentRegenHealing*1.5),
      threadD-sproutReach*.9);
    float ring=length(centered);
    newDist=abs(ring-width*(.39+.29*filamentRegenHealing));
    newAccent=.46+.54*(1.0-smoothstep(0.0,width*1.6,abs(ring-width*.57)));
  }else if(filamentRegenMode==12){ // IMPOSSIBLE GRAFT LOOPS
    float arc=localArc+.5;
    float twist=cos(arc*6.2831853+growthClock*.21);
    float loopA=abs(threadD-sproutReach*(.65+.37*twist));
    float loopB=abs(threadD-sproutReach*(.65-.37*twist));
    newDist=min(loopA,loopB);
    newAccent=.55+.45*abs(twist);
  }
  // Attach the new daughter geometry to the moving original line; its
  // visibility is built from a NEW distance field, not a painted overlay.
  float childCore=(1.0-smoothstep(fibRadius,fibRadius+aa,newDist))*
    footprint*filamentRegenAmount*mask;
#ifdef FILAMENT_STITCHING
  childCore*=reveal;
#endif
  float childHalo=(1.0-smoothstep(fibRadius*2.0,fibRadius*5.0+aa,newDist))*
    footprint*filamentRegenAmount*mask;
#ifdef FILAMENT_STITCHING
  childHalo*=reveal;
#endif
  // Preserve the original fiber and its crossings while letting daughter
  // branches and their halos occupy genuinely NEW regions of the canvas.
  core=max(core,childCore);
  halo=max(halo,childHalo*.73);
  edge=max(edge,childCore*(.5+.5*newAccent));
  maskCore=core;
#endif
  float pigmentPhase=fract(phase*.17+filamentHue*.88+hueOffset+
    seedPhase*.047+ct*(.023+.017*filamentMotion)+fieldV*.06);
#ifdef FILAMENT_CHROMA
  // Modulate the existing palette coordinate on the carrier, before fiber
  // materials, neural stimuli and jewelry use it. Projected radial bands
  // can distinguish subfibers without claiming true signed 3D strand IDs.
  float chAcross=threadD/max(width,.003);
  float chRate=mix(2.,19.,filamentChromaScale);
  float chAlong=(phase+q.x*.13+q.y*.09)*chRate;
  float chClock=time*filamentChromaSpeed*1.75;
  float chDepth=filamentChromaSpread*.48;
  float chWave=0.;
  if(filamentChroma==1){
    float strand=chAcross*mix(2.,7.,filamentChromaScale)+.42*sin(chAlong-chClock);
    chWave=2.*fract(strand)-1.;
  }else if(filamentChroma==2){
    float front=.5+.5*sin(chAlong-chClock);
    chWave=2.*smoothstep(.28,.72,front)-1.;
  }else if(filamentChroma==3){
    float a=sin(chAlong-chClock+chAcross*4.);
    float b=sin(chAlong+chClock-chAcross*4.);
    chWave=mix(a,b,smoothstep(.18,.82,chAcross));
  }else if(filamentChroma==4){
    chWave=(sin(chAlong-chClock*.43)+sin(chAlong*1.618034+chClock*.61+chAcross*3.))*.5;
  }else if(filamentChroma==5){
    chWave=sin(chAlong+chAcross*5.)*cos(chClock);
  }else if(filamentChroma==6){
    float bands=chAlong*.58-chClock*.24;
    float bandId=floor(bands);
    float h=fract(sin(bandId*17.731+seedPhase)*43758.5453);
    float prev=fract(sin((bandId-1.)*17.731+seedPhase)*43758.5453);
    chWave=2.*mix(prev,h,smoothstep(0.,.19,fract(bands)))-1.;
  }else if(filamentChroma==7){
    chWave=sin(chAlong-chClock)*sin(chAlong*1.13+chClock*.77+chAcross*7.);
  }else if(filamentChroma==8){
    // Real incoming first-parent pigment coordinate, not composited RGB or
    // a guessed neighbor. Wrap the difference across the palette seam.
    float contact=clamp(incomingCore*core,0.,1.);
    float delta=fract(incomingPigment-pigmentPhase+.5)-.5;
    pigmentPhase=fract(pigmentPhase+delta*contact*filamentChromaExchange*filamentChromaAmount);
    chWave=sin(chAlong-chClock)*contact*.6;
  }
  float chSharpen=mix(1.,3.5,filamentChromaContrast);
  chWave=clamp(chWave*chSharpen,-1.,1.);
  // Attenuate extremely fine transverse bands at low preview resolution.
  float chFoot=aa/max(width,.003);
  float chVisible=1.-smoothstep(.24,.85,chFoot);
  float chWeight=filamentChroma==1?chVisible:1.;
  pigmentPhase=fract(pigmentPhase+chWave*chDepth*filamentChromaAmount*chWeight);
#endif
  outgoingPigment=pigmentPhase;
  vec3 ink=palette(pigmentPhase);
  vec3 glimmer=palette(fract(pigmentPhase+.23+.16*filamentRelief));
#ifdef FILAMENT_NEURAL
  // Nearby color is the neighboring palette position, NOT a fabricated
  // color histogram; real cross-parent color arrives through incomingLuma.
  vec3 lumaWeights=vec3(.2126,.7152,.0722);
  float colorLuma=dot(ink,lumaWeights);
  float neighborLuma=dot(palette(fract(pigmentPhase+.045)),lumaWeights);
  float chromaGradient=clamp(abs(colorLuma-neighborLuma)*6.0,0.0,1.0);
  float stimulusGate=smoothstep(max(0.0,filamentNeuralThreshold-.14),
    min(1.0,filamentNeuralThreshold+.18),chromaGradient);
  float contactNeural=clamp(incomingCore*core*incomingNeural,0.0,1.0);
  float contactChromatic=contactNeural*
    clamp(abs(incomingLuma-colorLuma)*2.2,0.0,1.0);
  float axonPhase=phase*(2.4+filamentNeuralCoupling*6.3)+
    q.x*.17+q.y*.11+seedPhase*.16;
  float neuralSignal=0.0;
  if(filamentNeuralMode==1){ // AXON TRAIN
    neuralSignal=pow(.5+.5*cos(axonPhase*2.6-nerveClock*2.2),7.0);
  }else if(filamentNeuralMode==2){ // CHROMATIC REFLEX
    float pulse=.5+.5*sin(axonPhase*2.1-nerveClock*1.5);
    neuralSignal=stimulusGate*pow(pulse,3.0)+
      contactChromatic*filamentNeuralCoupling;
  }else if(filamentNeuralMode==3){ // SYNAPTIC HANDSHAKE
    float donor=pow(.5+.5*cos(axonPhase*1.5-nerveClock*1.3),8.0);
    neuralSignal=clamp(donor*.38+
      contactNeural*filamentNeuralCoupling*.93,0.0,1.0);
  }else if(filamentNeuralMode==4){ // GANGLION CHORUS
    vec2 cluster=floor(q*(.18+filamentNeuralCoupling*.28));
    float ganglion=fract(sin(dot(cluster,vec2(21.1,91.7))+seedPhase)*48372.19);
    neuralSignal=.5+.5*cos(nerveClock*1.6+ganglion*2.5+
      sin(axonPhase*.49)*.24);
  }else if(filamentNeuralMode==5){ // REFLEX ARC
    float cycle=sin(nerveClock*.35);
    neuralSignal=pow(.5+.5*cos(axonPhase*2.9-
      nerveClock*(.65+.7*cycle)),6.0);
  }else if(filamentNeuralMode==6){ // MYELIN SKIP
    float node=pow(.5+.5*cos(axonPhase*4.7),9.0);
    float spike=pow(.5+.5*cos(nerveClock*2.9-
      floor(axonPhase*1.5)*.91),7.0);
    neuralSignal=node*spike;
  }else if(filamentNeuralMode==7){ // NERVE STORM
    float site=floor(axonPhase*1.8);
    float seedFire=fract(sin(site*71.13+seedPhase)*14731.37);
    float storm=pow(.5+.5*cos(nerveClock*(1.4+seedFire*.91)-
      site*.91),13.0);
    neuralSignal=storm*smoothstep(.18,.78,seedFire)+
      contactNeural*.48;
  }else if(filamentNeuralMode==8){ // RESTING POTENTIAL
    neuralSignal=.26+.38*(.5+.5*cos(axonPhase*.63-nerveClock*.32));
  }
  // Real contact is never approximated by screen neighbors.
  neuralSignal=clamp(neuralSignal+
    contactNeural*filamentNeuralCoupling*.28,0.0,1.0);

#ifdef FILAMENT_PLASTICITY
  // All "adaptation" is a deterministic function of current fiber geometry,
  // real palette stimulus, incoming crossing signal and the export clock.
  // This is NOT persistent learned neural state.
  float plasticClock=time*(.13+filamentPlasticRate*1.47)+phaseOffset*.17;
  float plasticPhase=axonPhase*(.74+filamentPlasticRetention*2.6);
  float coincidence=clamp(neuralSignal*stimulusGate,0.0,1.0);
  float donorCoincidence=clamp(contactNeural*neuralSignal,0.0,1.0);
  float plasticDelta=0.0;
  if(filamentPlasticMode==1){ // HEBBIAN BLOOM: synchronized responses brighten.
    float localPair=.5+.5*cos(plasticPhase*1.7-plasticClock);
    plasticDelta=(.32+.61*coincidence)*pow(localPair,3.0)+
      donorCoincidence*.55;
  }else if(filamentPlasticMode==2){ // INHIBITORY LACE: negative gain at junctions.
    float brake=.5+.5*sin(plasticPhase*2.1-plasticClock*.82);
    plasticDelta=-(.27+.69*filamentPlasticInhibition)*
      brake*(.62+.38*contactNeural);
  }else if(filamentPlasticMode==3){ // ECHO SYNAPSES: delayed-shaped twin pulse.
    float phaseDelay=filamentPlasticRetention*5.4+.4;
    float echo=pow(.5+.5*cos(plasticPhase*2.3-plasticClock*1.3+phaseDelay),5.0);
    plasticDelta=echo*(.36+.39*coincidence)-
      neuralSignal*filamentPlasticInhibition*.16;
  }else if(filamentPlasticMode==4){ // RESONANT CHOIR: entrained cluster phases.
    vec2 tile=floor(q*(.12+.25*filamentPlasticRetention));
    float cluster=fract(sin(dot(tile,vec2(13.7,79.3))+seedPhase)*43758.5453);
    float choir=.5+.5*cos(plasticClock*1.2+cluster*2.9-
      plasticPhase*.33);
    plasticDelta=choir*(.36+.4*filamentPlasticRetention)+
      donorCoincidence*.61;
  }else if(filamentPlasticMode==5){ // PRUNING WAVE: weaken less-coincident links.
    float prune=.5+.5*cos(plasticPhase*.83-plasticClock*.66);
    float inactivity=1.0-coincidence;
    plasticDelta=-(.25+.69*filamentPlasticInhibition)*prune*inactivity+
      donorCoincidence*.29;
  }else if(filamentPlasticMode==6){ // DREAM CONSOLIDATION: slow waves of recovery.
    float dream=.5+.5*cos(plasticClock*.24+plasticPhase*.42+
      sin(q.y*.2+seedPhase*.11));
    float recover=.5+.5*sin(plasticClock*.19-plasticPhase*.39);
    plasticDelta=dream*(.27+.4*filamentPlasticRetention)*
      (.55+.45*recover)-neuralSignal*filamentPlasticInhibition*.17;
  }
  // Apply analytic synaptic gain to the ACTUAL existing neural signal,
  // never to unstitched background or a disconnected sticker layer.
  float preplastic=neuralSignal;
  neuralSignal=mix(preplastic,clamp(preplastic+plasticDelta,0.0,1.0),
    filamentPlasticAmount);
  float plasticEdge=clamp(max(0.0,neuralSignal-preplastic)*2.3,0.0,1.0);
  float plasticShadow=clamp(max(0.0,preplastic-neuralSignal)*2.1,0.0,1.0);
#endif
  float nerveStrength=filamentNeuralAmount*neuralSignal;
  outgoingNeural=clamp(nerveStrength*core,0.0,1.0);
  outgoingLuma=colorLuma;
#endif
#ifdef FILAMENT_REGENERATION
  // Newly formed fibers inherit the same palette, but reveal the birth
  // frontier with a little nerve-driven phosphor.
  float regenFlash=clamp(childCore*(.3+.7*newAccent)*
    filamentRegenGlow*(.5+.5*neuralSignal),0.0,1.0);
#endif
  float sheen=(.38+.62*highlight)*(.3+.7*filamentRelief);
  vec3 thread=ink*(.75+.55*sheen)+glimmer*.21*filamentRelief;
#ifdef FILAMENT_STITCHING
  // Bright traveling needle tip follows the line's own local coordinates.
  // It cannot paint into the background when the line mask is absent.
  thread+=mix(ink,vec3(1.0,.98,.92),.71)*
    needle*filamentStitchGlow*core*(.42+1.25*filamentStitchAmount);
#endif
  // Raised fibers are described in thread-local coordinates, so relief,
  // anisotropic light, and fraying move WITH the stitch rather than sliding
  // over the finished picture as a separate texture.
#ifdef FILAMENT_FIBER_DETAIL
  float luster=filamentLuster;
  float nap=filamentNap;
  float across=clamp(threadD/max(width,.002),0.0,2.0);
  float cord=1.0-smoothstep(.18,1.2,across);
  float twistWave=sin(phase*18.0+q.x*9.0-q.y*6.0+t*.28);
  float spun=.5+.5*twistWave;
  float fibers=.5+.5*sin(q.x*91.0+q.y*54.0+
    sin(q.y*17.0+t*.28)*2.0+seedPhase*1.7);
  float glisten=pow(clamp(.5+.5*cos(across*5.2-1.0+t*.07),0.0,1.0),
    mix(12.0,3.0,luster));
  float extraHalo=0.0;
  if(fiberMaterial==1){ // Iridescent silk: striations and grazing-angle sheen.
    vec3 irid=.5+.5*cos(vec3(0.0,2.094,4.188)+
      pigmentPhase*8.4+across*4.5+spun*2.2+colorTime*.08);
    thread=mix(thread,ink*.53+irid*.75,
      .2+.43*luster);
    thread+=glimmer*(.14+.48*luster)*glisten*cord;
    thread*=.75+.32*spun;
  }else if(fiberMaterial==2){ // Metallic thread: sharp specular core, dark sides.
    float chrome=pow(max(0.0,1.0-abs(across-.38)*1.5),3.0);
    float darkness=.24+.45*abs(twistWave);
    thread=thread*darkness+vec3(.95,1.0,1.0)*chrome*(.37+1.45*luster);
    thread+=glimmer*.3*pow(spun,10.0);
  }else if(fiberMaterial==3){ // Opal glass: thin-film rim and transparent body.
    vec3 spectral=.5+.5*cos(vec3(0.0,2.094,4.188)+
      (pigmentPhase+across*.2)*12.0+spun*.8+colorTime*.06);
    thread=mix(thread*.45,glimmer*.38+spectral*.95,.3+.57*luster);
    thread+=vec3(1.0,.94,1.0)*glisten*cord*(.16+.42*luster);
    extraHalo=.08+.15*luster;
  }else if(fiberMaterial==4){ // Velvet pile: low specularity and fuzzy nap.
    thread=mix(thread*.48,ink*(.55+.37*fibers),.45+.4*nap);
    thread*=.65+.3*spun;
  }else if(fiberMaterial==5){ // Electroluminescent twisted fiber.
    float helix=.5+.5*cos(phase*28.0+t*.39+q.x*7.0+seedPhase);
    thread=ink*.58+glimmer*.48+
      vec3(.92,.97,1.0)*helix*(.23+.6*luster);
    thread*=.75+.3*spun;
    extraHalo=.18+.33*luster;
  }else if(fiberMaterial==6){ // MERCERIZED COTTON: fine dry twisted matte staple.
    float staple=.5+.5*sin(phase*34.0+q.y*11.0+t*.18);
    thread=mix(thread*.68,ink*(.72+.24*staple),.72);
    thread+=glimmer*cord*glisten*luster*.19;
    extraHalo=.012+.035*nap;
  }else if(fiberMaterial==7){ // METALLIC TINSEL: flat reflective foil facets.
    float foil=.5+.5*cos(phase*43.0+q.x*13.0-t*.62);
    float flash=pow(max(0.0,.5+.5*cos(across*4.2-foil*3.0)),13.0);
    thread=ink*.33+glimmer*(.32+.63*foil)+vec3(1.0,.99,.94)*flash*luster;
    extraHalo=.08+.1*luster;
  }else if(fiberMaterial==8){ // CHENILLE PLUSH: soft bulky crushed pile.
    float shag=.5+.5*cos(phase*62.0+q.y*31.0+t*.21);
    thread=ink*(.4+.38*fibers+.2*shag)+glimmer*.08;
    thread*=.84+.13*spun;
    extraHalo=.06+.1*nap;
  }else if(fiberMaterial==9){ // PEARL FLOSS: satin-pearl diffraction stripes.
    vec3 pearl=.5+.5*cos(vec3(0.0,2.094,4.188)+
      phase*3.1+across*2.2+colorTime*.04);
    thread=mix(ink*.7+glimmer*.29,pearl*.65+vec3(.53,.57,.63),.45+.32*luster);
    thread+=vec3(1.0,.98,.94)*glisten*cord*.3;
  }else if(fiberMaterial==10){ // FIBER OPTIC: bright travelling rainbow light.
    vec3 ray=.5+.5*cos(vec3(0.0,2.094,4.188)+
      phase*2.7-t*1.9+across*4.5);
    float pulse=pow(.5+.5*cos(phase*9.0-t*2.3),7.0);
    thread=ink*.3+ray*(.57+.55*pulse)+vec3(.92,.97,1.0)*pulse*luster*.5;
    extraHalo=.22+.28*luster;
  }else if(fiberMaterial==11){ // GELATIN NERVE: translucent internal axonal waves.
    float axon=.5+.5*sin(phase*22.0-t*1.23+sin(q.y*2.0));
    vec3 gel=ink*.45+glimmer*(.17+.32*axon)+vec3(.73,.96,.94)*axon*.26;
    thread=mix(thread*.28,gel,.76);
    thread+=vec3(1.0,.96,1.0)*glisten*.36*luster;
    extraHalo=.14+.2*luster;
  }else if(fiberMaterial==12){ // OIL SLICK LATEX: spectral reflective viscous skin.
    vec3 oil=.5+.5*cos(vec3(0.0,2.094,4.188)+
      across*8.1+phase*.73-t*.58+seedPhase*.21);
    float wet=pow(max(0.0,.5+.5*sin(spun*3.0+across*3.7)),8.0);
    thread=ink*.19+oil*(.37+.67*luster)+vec3(.98,.99,1.0)*wet*.42;
    extraHalo=.1+.18*luster;
  }else if(fiberMaterial==13){ // BIOLUMINESCENT MYCELIUM: pulsing spore-laced hyphae.
    float hyphae=.5+.5*sin(phase*43.0+sin(q.x*4.0)*2.1-t*.71);
    float spores=pow(hyphae,18.0);
    thread=ink*.48+glimmer*(.3+.4*hyphae)+vec3(.84,1.0,.82)*spores*.58;
    thread*=.7+.32*fibers;
    extraHalo=.15+.28*hyphae;
  }
  // Edge nap is geometric: it expands only near the actual stitch edge.
  float fuzz=nap*((fiberMaterial==4||fiberMaterial==8)?1.0:
    (fiberMaterial==13?.81:.53));
  float fray=(1.0-smoothstep(width,width*3.2+aa,threadD))*
    (1.0-core)*fibers*fuzz*filamentAmount;
  // Beads are pearls separated along the local filament path, not a
  // full-frame dot texture. They work for single and hybrid geometry.
  float beadPeriod=8.0+filamentBeadSize*18.0;
  float pearl=pow(max(0.0,.5+.5*cos(phase*beadPeriod+
    q.x*.3+seedPhase*.17)),mix(24.0,9.0,filamentBeadSize));
  float bead=filamentBeads*pearl*pow(max(0.0,core),1.4)*filamentAmount;

#ifdef FILAMENT_METAMORPH
  // Base material already shaded above. Restore the exact original starting
  // light, shade the target with the SAME 14 material laws, then blend.
  vec3 primaryDress=thread;
  float primaryHalo=extraHalo;
  thread=ink*(.75+.55*sheen)+glimmer*.21*filamentRelief;
#ifdef FILAMENT_STITCHING
  thread+=mix(ink,vec3(1.0,.98,.92),.71)*
    needle*filamentStitchGlow*core*(.42+1.25*filamentStitchAmount);
#endif
  extraHalo=0.0;
  if(morphMaterial==1){ // Iridescent silk: striations and grazing-angle sheen.
    vec3 irid=.5+.5*cos(vec3(0.0,2.094,4.188)+
      pigmentPhase*8.4+across*4.5+spun*2.2+colorTime*.08);
    thread=mix(thread,ink*.53+irid*.75,
      .2+.43*luster);
    thread+=glimmer*(.14+.48*luster)*glisten*cord;
    thread*=.75+.32*spun;
  }else if(morphMaterial==2){ // Metallic thread: sharp specular core, dark sides.
    float chrome=pow(max(0.0,1.0-abs(across-.38)*1.5),3.0);
    float darkness=.24+.45*abs(twistWave);
    thread=thread*darkness+vec3(.95,1.0,1.0)*chrome*(.37+1.45*luster);
    thread+=glimmer*.3*pow(spun,10.0);
  }else if(morphMaterial==3){ // Opal glass: thin-film rim and transparent body.
    vec3 spectral=.5+.5*cos(vec3(0.0,2.094,4.188)+
      (pigmentPhase+across*.2)*12.0+spun*.8+colorTime*.06);
    thread=mix(thread*.45,glimmer*.38+spectral*.95,.3+.57*luster);
    thread+=vec3(1.0,.94,1.0)*glisten*cord*(.16+.42*luster);
    extraHalo=.08+.15*luster;
  }else if(morphMaterial==4){ // Velvet pile: low specularity and fuzzy nap.
    thread=mix(thread*.48,ink*(.55+.37*fibers),.45+.4*nap);
    thread*=.65+.3*spun;
  }else if(morphMaterial==5){ // Electroluminescent twisted fiber.
    float helix=.5+.5*cos(phase*28.0+t*.39+q.x*7.0+seedPhase);
    thread=ink*.58+glimmer*.48+
      vec3(.92,.97,1.0)*helix*(.23+.6*luster);
    thread*=.75+.3*spun;
    extraHalo=.18+.33*luster;
  }else if(morphMaterial==6){ // MERCERIZED COTTON: fine dry twisted matte staple.
    float staple=.5+.5*sin(phase*34.0+q.y*11.0+t*.18);
    thread=mix(thread*.68,ink*(.72+.24*staple),.72);
    thread+=glimmer*cord*glisten*luster*.19;
    extraHalo=.012+.035*nap;
  }else if(morphMaterial==7){ // METALLIC TINSEL: flat reflective foil facets.
    float foil=.5+.5*cos(phase*43.0+q.x*13.0-t*.62);
    float flash=pow(max(0.0,.5+.5*cos(across*4.2-foil*3.0)),13.0);
    thread=ink*.33+glimmer*(.32+.63*foil)+vec3(1.0,.99,.94)*flash*luster;
    extraHalo=.08+.1*luster;
  }else if(morphMaterial==8){ // CHENILLE PLUSH: soft bulky crushed pile.
    float shag=.5+.5*cos(phase*62.0+q.y*31.0+t*.21);
    thread=ink*(.4+.38*fibers+.2*shag)+glimmer*.08;
    thread*=.84+.13*spun;
    extraHalo=.06+.1*nap;
  }else if(morphMaterial==9){ // PEARL FLOSS: satin-pearl diffraction stripes.
    vec3 pearl=.5+.5*cos(vec3(0.0,2.094,4.188)+
      phase*3.1+across*2.2+colorTime*.04);
    thread=mix(ink*.7+glimmer*.29,pearl*.65+vec3(.53,.57,.63),.45+.32*luster);
    thread+=vec3(1.0,.98,.94)*glisten*cord*.3;
  }else if(morphMaterial==10){ // FIBER OPTIC: bright travelling rainbow light.
    vec3 ray=.5+.5*cos(vec3(0.0,2.094,4.188)+
      phase*2.7-t*1.9+across*4.5);
    float pulse=pow(.5+.5*cos(phase*9.0-t*2.3),7.0);
    thread=ink*.3+ray*(.57+.55*pulse)+vec3(.92,.97,1.0)*pulse*luster*.5;
    extraHalo=.22+.28*luster;
  }else if(morphMaterial==11){ // GELATIN NERVE: translucent internal axonal waves.
    float axon=.5+.5*sin(phase*22.0-t*1.23+sin(q.y*2.0));
    vec3 gel=ink*.45+glimmer*(.17+.32*axon)+vec3(.73,.96,.94)*axon*.26;
    thread=mix(thread*.28,gel,.76);
    thread+=vec3(1.0,.96,1.0)*glisten*.36*luster;
    extraHalo=.14+.2*luster;
  }else if(morphMaterial==12){ // OIL SLICK LATEX: spectral reflective viscous skin.
    vec3 oil=.5+.5*cos(vec3(0.0,2.094,4.188)+
      across*8.1+phase*.73-t*.58+seedPhase*.21);
    float wet=pow(max(0.0,.5+.5*sin(spun*3.0+across*3.7)),8.0);
    thread=ink*.19+oil*(.37+.67*luster)+vec3(.98,.99,1.0)*wet*.42;
    extraHalo=.1+.18*luster;
  }else if(morphMaterial==13){ // BIOLUMINESCENT MYCELIUM: pulsing spore-laced hyphae.
    float hyphae=.5+.5*sin(phase*43.0+sin(q.x*4.0)*2.1-t*.71);
    float spores=pow(hyphae,18.0);
    thread=ink*.48+glimmer*(.3+.4*hyphae)+vec3(.84,1.0,.82)*spores*.58;
    thread*=.7+.32*fibers;
    extraHalo=.15+.28*hyphae;
  }

  // Blend actual fiber material appearances with deterministic, moving
  // thread-local phase fields. No screen-wide stickers, frames, or textures.
  float morphClock=time*(.12+filamentMorphSpeed*1.43)+phaseOffset*.29;
  float morphFreq=2.0+filamentMorphScale*16.0;
  float seamPhase=phase*.34+seedPhase*.11;
  float morphField=0.0;
  if(filamentMorphMode==1){ // SEAM SWEEP
    morphField=sin(seamPhase*morphFreq*.42-morphClock);
  }else if(filamentMorphMode==2){ // CRYSTAL CONTAGION
    vec2 cell=floor(q*(.27+.07*morphFreq));
    float facets=abs(sin(cell.x*1.31+cell.y*.89+seedPhase*.23));
    morphField=sin(phase*morphFreq*.34-morphClock*.7)*.47+facets-.5;
  }else if(filamentMorphMode==3){ // MOLTEN MIGRATION
    morphField=sin(q.x*.73+sin(q.y*.63+morphClock*.47)*2.1+
      seamPhase*.53-morphClock*.87);
  }else if(filamentMorphMode==4){ // MOTH-EATEN PORTALS
    vec2 holes=floor(q*(.36+.045*morphFreq)+sin(morphClock*.24));
    float n=fract(sin(dot(holes,vec2(17.31,83.7))+seedPhase)*43758.5453);
    float portal=length(fract(q*(.36+.045*morphFreq))-.5);
    morphField=(.35+sin(morphClock*.41+n*6.28318)*.23)-portal;
  }else if(filamentMorphMode==5){ // CHECKER METAMORPH
    vec2 chk=floor(q*(.21+.03*morphFreq)+morphClock*.22);
    float parity=mod(chk.x+chk.y,2.0);
    morphField=(parity-.5)*1.3+.23*sin(morphClock+seamPhase);
  }else if(filamentMorphMode==6){ // STRANGE ATTRACTOR
    vec2 aa=q*.19;
    vec2 nodeA=vec2(sin(morphClock*.23),cos(morphClock*.31))*2.3;
    vec2 nodeB=vec2(cos(morphClock*.17),sin(morphClock*.27))*2.6;
    float basin=min(length(aa-nodeA),length(aa-nodeB));
    morphField=1.2-basin+sin(seamPhase*morphFreq*.22)*.27;
  }else if(filamentMorphMode==7){ // MORSE RETHREADING
    float packet=sin(seamPhase*morphFreq*1.4-morphClock*1.23);
    float key=sin(seamPhase*morphFreq*.39+morphClock*.24);
    morphField=.58*packet+.45*key;
  }else if(filamentMorphMode==8){ // FUNGAL TAKEOVER
    float branching=sin(q.x*.73+sin(q.y*.82+morphClock*.28)*2.3);
    morphField=.54*branching+.48*sin(seamPhase*morphFreq*.35-morphClock*.39);
  }else if(filamentMorphMode==9){ // CHROMATIC TIDE
    morphField=.55*sin(q.y*.37+seamPhase*.4-morphClock*.73)+
      .45*cos(q.x*.46-seamPhase*.31+morphClock*.56);
  }

#ifdef FILAMENT_CONTAGION
  // A deterministic thread-local propagation phase, not a fullscreen
  // overlay. The moving stitch clock is identical in preview and exports.
  float contagionClock=time*(.2+filamentContagionSpeed*1.34)+phaseOffset*.27;
  float contagionAlong=phase*(1.2+filamentContagionReach*5.8)+seedPhase*.13;
  float contagionSignal=0.0;
  if(filamentContagionMode==1){ // STITCH RELAY
    float packet=.5+.5*cos(contagionAlong*3.2-contagionClock*1.5);
    contagionSignal=packet*packet;
  }else if(filamentContagionMode==2){ // CROSSING FEVER
    // Hybrid-specific transfer enters ONLY where both parent thread
    // cores actually meet, then its phase wave runs along recipient yarn.
    float link=clamp(incomingCore*core*incomingCarrier,0.0,1.0);
    contagionSignal=.34*(.5+.5*sin(contagionAlong*2.8-contagionClock))+
      link*(.68+.32*cos(contagionClock*.8));
  }else if(filamentContagionMode==3){ // MYCELIAL BRIDGE
    vec2 site=floor(q*(.13+.06*filamentContagionReach));
    vec2 offset=fract(q*(.13+.06*filamentContagionReach))-.5;
    float spore=fract(sin(dot(site,vec2(17.1,83.7))+seedPhase)*43758.5453);
    float ring=cos(length(offset)*12.0-contagionClock*(.54+.32*spore));
    contagionSignal=.5+.5*ring;
  }else if(filamentContagionMode==4){ // SPARK JUMP
    float spark=.5+.5*cos(contagionAlong*8.0-contagionClock*3.1);
    float pin=step(.72,fract(sin(floor(contagionAlong*1.7)+seedPhase)*7381.123));
    contagionSignal=pow(spark,3.0)*(.28+.72*pin);
  }else if(filamentContagionMode==5){ // KNOT EPIDEMIC
    float knot=fract(contagionAlong*.43);
    float cluster=1.0-smoothstep(.06,.47,abs(knot-.5));
    contagionSignal=cluster*(.5+.5*cos(contagionClock*.82+
      floor(contagionAlong*.43)*1.618));
  }else if(filamentContagionMode==6){ // SPORE DRIFT
    float mist=sin(q.x*.48+contagionClock*.39)+
      sin(q.y*.68-contagionClock*.31)+
      sin(contagionAlong*.83-contagionClock*.69);
    contagionSignal=smoothstep(-1.2,1.4,mist);
  }
  // Link flux is zero when there's no real first-parent donor or contact.
  // The phase delay makes recipient fibers respond after their donor.
  float contactTransfer=clamp(incomingCore*core*incomingCarrier,0.0,1.0);
  // Lag shifts the recipient's response in PHASE instead of merely
  // changing its animation speed.
  float delayed=.5+.5*cos(contagionAlong*1.4-contagionClock+
    filamentContagionLag*3.1415926);
  float neighborhood=clamp(contagionSignal*(.56+.44*delayed)+
    contactTransfer*filamentContagionReach*delayed,0.0,1.0);
  morphField=mix(morphField,max(morphField,neighborhood*2.0-1.0),
    filamentContagionAmount);
#endif
  float transitionWidth=mix(.64,.06,filamentMorphSharpness);
  float morphMask=smoothstep(-transitionWidth,transitionWidth,morphField);
  float coverage=filamentMorphAmount*morphMask*(morphMaterial==fiberMaterial?0.0:1.0);
#ifdef FILAMENT_CONTAGION
  // Parent A can infect B only when its live, already-sewn core overlaps.
  outgoingCarrier=clamp(coverage*core,0.0,1.0);
#endif
  vec3 secondDress=thread;
  float secondHalo=extraHalo;
  thread=mix(primaryDress,secondDress,coverage);
  extraHalo=mix(primaryHalo,secondHalo,coverage);
  // A glint marks the seam on existing, sewn filament—not the background.
  float border=1.0-smoothstep(transitionWidth*.28,
    transitionWidth*1.7+.005,abs(morphField));
  thread+=mix(glimmer,vec3(1.0),.41)*border*filamentMorphGlow*
    coverage*(.23+.57*cord);
#ifdef FILAMENT_CONTAGION
  // Infection glints exist on stitched fiber only, never bare background.
  float infectionGlint=pow(clamp(contagionSignal,0.0,1.0),5.0);
  thread+=mix(glimmer,vec3(1.0),.56)*infectionGlint*
    filamentContagionGlow*coverage*.24*cord;
#endif
#endif

#endif
#ifdef FILAMENT_NEURAL
  // Color + irradiance AND actual fiber geometry respond; this only paints
  // the already-revealed thread core. No effect on free background pixels.
  float nerveFlash=pow(clamp(neuralSignal,0.0,1.0),6.0);
  vec3 nerveChromatic=palette(fract(pigmentPhase+.31+
    neuralSignal*.19+contactChromatic*.16));
  float nerveResponse=clamp(nerveStrength*core,0.0,1.0);
  thread=mix(thread,thread*.42+nerveChromatic*.96,
    nerveResponse*(.2+.38*filamentNeuralCoupling));
  thread+=mix(nerveChromatic,vec3(.95,.97,1.0),.56)*
    nerveResponse*nerveFlash*filamentNeuralGlow*.78;
#ifdef FILAMENT_PLASTICITY
  // Accentuate changing synaptic weights on real sewn cores.
  // Inhibitory and pruning waves remove light (real dark lace) instead of
  // paradoxically flashing brightly at their suppressed synapses.
  thread*=1.0-plasticShadow*(.15+.43*filamentPlasticInhibition)*core;
  thread+=mix(ink,glimmer,.62)*core*filamentPlasticAmount*
    filamentPlasticGlow*plasticEdge*.42;
#endif
#ifdef FILAMENT_GHOST_SCARS
  // The "old" pulse is an analytic phase offset, not a saved video frame.
  // Both current and delayed pulses use the same deterministic export clock.
  float scarClock=nerveClock*(.74+.68*filamentScarPersistence);
  float scarFreq=3.0+filamentScarDensity*13.0;
  float scarAxis=axonPhase*.65+q.x*.13-q.y*.08;
  float scarNoise=fract(sin(dot(floor(q*(.2+.05*scarFreq)),
    vec2(43.71,19.43))+seedPhase)*43758.5453);
  float delayedPulse=pow(.5+.5*cos(scarAxis*scarFreq*.31-
    scarClock*1.3+filamentScarPersistence*4.4),5.0);
  float olderPulse=pow(.5+.5*cos(scarAxis*scarFreq*.31-
    scarClock*1.3+filamentScarPersistence*7.8),5.0);
  float electricTrace=max(delayedPulse,olderPulse*.69);
  float scarPattern=0.0;
  float scarBurn=0.0;
  float scarTint=0.0;
  if(filamentScarMode==1){ // PHOSPHOR AFTERTRACE
    float grain=.5+.5*sin(scarAxis*scarFreq*1.7+scarNoise*4.3);
    scarPattern=electricTrace*(.46+.54*grain);
    scarTint=.18;
  }else if(filamentScarMode==2){ // LICHTENBERG BURN
    float fork=sin(q.x*scarFreq*.41+
      sin(q.y*scarFreq*.33+scarClock*.27)*2.3);
    float branch=1.0-smoothstep(.08,.45,abs(fork));
    scarPattern=branch*(.35+.65*electricTrace);
    scarBurn=.9;
  }else if(filamentScarMode==3){ // KINTSUGI SUTURES
    float fracture=sin(scarAxis*scarFreq*1.9+
      sin(q.x*.9+scarClock*.13)*1.7);
    scarPattern=(1.0-smoothstep(.02,.21,abs(fracture)))*
      (.36+.64*electricTrace);
    scarTint=.74;
  }else if(filamentScarMode==4){ // SPECTRAL BRUISING
    float bruise=sin(scarAxis*scarFreq*.34-
      scarClock*.23+sin(q.y*.61)*1.3);
    scarPattern=(.5+.5*bruise)*(.42+.58*electricTrace);
    scarTint=.58;
    scarBurn=.3;
  }else if(filamentScarMode==5){ // GHOST KNOT FOSSILS
    vec2 site=fract(q*(.14+.038*scarFreq))-.5;
    float rings=abs(sin(length(site)*32.0-scarClock*.21));
    scarPattern=(1.0-smoothstep(.11,.43,rings))*
      (.27+.73*electricTrace);
    scarBurn=.34;
    scarTint=.36;
  }else if(filamentScarMode==6){ // MYCELIAL NERVE SCARS
    float hypha=sin(q.x*.42*scarFreq+
      sin(q.y*.29*scarFreq-scarClock*.38)*2.7);
    float filaments=1.0-smoothstep(.09,.46,abs(hypha));
    float spores=pow(.5+.5*cos(scarAxis*scarFreq*2.1-
      scarClock*.53+scarNoise*6.28318),8.0);
    scarPattern=filaments*.73+spores*.43;
    scarTint=.41;
  }
  // Ghost traces are strictly confined to the current sewn filament mask.
  // Changing history depth is an optical phase approximation, not a cache.
  float scarAge=clamp(.27+.73*electricTrace,0.0,1.0);
  float scarPresence=clamp(scarPattern*scarAge*
    (.52+.48*neuralSignal+contactNeural*.31)*
    filamentScarAmount,0.0,1.0);
  float scarRough=clamp(mix(1.0,.55+scarNoise*.92,
    filamentScarRoughness),0.0,1.55);
  float scarInk=clamp(scarPresence*scarRough,0.0,1.0)*core;
  vec3 scarColor=mix(glimmer,
    palette(fract(pigmentPhase+.33+scarNoise*.17)),scarTint);
  // Bruised/burnt regions dim first; only the positive scar seam glows.
  thread*=1.0-scarInk*scarBurn*.67;
  thread+=scarColor*scarInk*filamentScarGlow*
    (.23+.75*(.45+.55*delayedPulse));
#endif
#endif
#ifdef FILAMENT_REGENERATION
  thread+=mix(ink,glimmer,.68)*regenFlash*.7;
#endif

#ifdef FILAMENT_STRUCTURAL_OPTICS
  // Optical coats shade the actual moving fiber AFTER its selected material,
  // morphs, neural light and scars; no screen-space pass and no frame history.
  // opticalLaw and parameters are separately supplied for BOTH hybrid parents.
  if(opticalLaw>0 && opticalAmount>.0001){
    // Local yarn width (a faux cross-sectional normal) and signed strand
    // orientation approximate grazing view. A flat artboard cannot supply
    // physically measured view-dependent reflectance or true wavelengths.
    float yarnAcross=clamp(threadD/max(width+aa,.003),0.0,2.5);
    float crown=1.0-smoothstep(.04,1.28,yarnAcross);
    float grazing=smoothstep(.29,1.55,yarnAcross)*
      (1.0-smoothstep(1.55,2.35,yarnAcross));
    float fiberTangent=phase*(.79+opticalAnisotropy*1.61)+
      q.x*.13-q.y*.09+seedPhase*.14;
    float orientation=sin(fiberTangent)*.6+cos(fiberTangent*.83)*.4;
    float bend=sin(phase*(1.1+opticalCurvature*2.1)+
      q.x*.3+q.y*.21+t*.28);
    float pseudoView=clamp(.48+.26*orientation*opticalAnisotropy+
      .19*bend*opticalCurvature+.25*(1.0-crown),.03,.98);
    float opticalTravel=time*(.045+.16*filamentMotion)+
      colorTime*.027+phaseOffset*.31+opticalPhase*6.2831853;
    // Three different pseudo-optical path lengths represent spectral hues.
    float film=(1.4+opticalThickness*11.0)*
      (1.0+.49*pseudoView+.17*opticalCurvature*bend);
    vec3 waveLength=vec3(.66,.53,.42);
    vec3 interference=.5+.5*cos(vec3(6.2831853)*film/
      waveLength+opticalTravel*(.06+.2*opticalDispersion)+
      vec3(0.0,1.12,2.18));
    float groove=fiberTangent*(7.0+opticalDispersion*23.0)+
      opticalTravel*.46;
    float comb=pow(.5+.5*cos(groove),mix(19.0,6.0,opticalDispersion));
    float brushed=pow(.5+.5*cos(fiberTangent*2.1+pseudoView*3.2-
      opticalTravel*.21),mix(23.0,7.0,opticalAnisotropy));
    vec3 paletteTint=palette(fract(pigmentPhase+.08+.4*opticalPhase+
      pseudoView*.17+interference.g*.06));
    vec3 pearlBase=mix(ink,vec3(.94,.96,1.0),.21+.6*opticalPearl);
    vec3 spectral=mix(interference,interference.brg,
      .16+.46*opticalDispersion);
    vec3 dressed=thread;
    float shining=.27+.73*crown;
    if(opticalLaw==1){ // SOAP-FILM OPAL: thin-film prismatic grazing fringes.
      dressed=thread*.42+spectral*(.42+.65*grazing)+
        paletteTint*.22+pearlBase*.2*shining;
    }else if(opticalLaw==2){ // PEARLESCENT FLOSS: pearl plus soft iridescence.
      dressed=thread*.48+pearlBase*(.35+.56*crown)+
        spectral*(.15+.39*grazing)+paletteTint*.17;
    }else if(opticalLaw==3){ // DIFFRACTION GRATING: embossed microgroove combs.
      float grating=comb*(.24+.76*pseudoView);
      dressed=thread*.31+spectral*(.32+.8*grating)+
        vec3(.97,.97,1.0)*grating*.62+paletteTint*.16;
    }else if(opticalLaw==4){ // ANISOTROPIC CHROME: directional polished metal.
      float metal=clamp(brushed*(.32+.68*grazing),0.0,1.0);
      dressed=thread*.32+mix(paletteTint,vec3(1.0),.77)*metal*.91+
        spectral*(.24+.46*metal)+pearlBase*.13;
    }else if(opticalLaw==5){ // HOLOGRAPHIC ORGANZA: two crossed optical lattices.
      float crossGrating=.5+.5*cos(groove*.57+pseudoView*7.4);
      vec3 second=interference.gbr;
      dressed=thread*.29+mix(spectral,second,crossGrating)*
        (.43+.67*comb)+paletteTint*.27;
    }else if(opticalLaw==6){ // BIOLUMINESCENT NACRE: light in the fiber body.
      float living=.5+.5*sin(phase*4.7-opticalTravel*.61+bend*.8);
      dressed=thread*.41+pearlBase*.31+
        mix(spectral,paletteTint,.48)*(.37+.53*living)*shining;
    }else if(opticalLaw==7){ // QUANTUM MOTHER-OF-PEARL: competing interference.
      vec3 echo=.5+.5*cos(vec3(5.7,7.4,9.1)*film+
        opticalTravel*.2+fiberTangent*.39);
      dressed=thread*.23+mix(spectral,echo,.42+.29*comb)*
        (.54+.67*shining)+paletteTint*.23+
        vec3(1.0)*brushed*.12;
    }
    // A soft additive edge flash stays subordinate to the selected material.
    // Core/halo/edge masks are applied later by the existing filament renderer.
    float opticalMix=clamp(opticalAmount*(.45+.55*shining)*
      (.79+.21*opticalPearl),0.0,1.0);
    thread=mix(thread,dressed,opticalMix);
    thread+=spectral*grazing*opticalAmount*opticalDispersion*.13;
  }
#endif
#ifdef FILAMENT_CONSTRUCTION
  float yarnLight=filamentConstructionRelief*yarnMix;
  thread*=1.-clamp(yarnShade*yarnLight*.48,0.,.55);
  thread+=mix(glimmer,vec3(.92,.97,1.),.42)*clamp(yarnShine,0.,1.)*yarnLight*.43;
#endif
#ifdef FILAMENT_MICROLOOM
  // Preserve the existing material and tint the woven ribs with the palette.
  vec3 mlTint=palette(fract(pigmentPhase+mlPigment*.36+.12));
  thread*=1.-mlStrength*(1.-mlLight)*.32;
  thread+=mix(glimmer,mlTint,filamentMicroloomColor)*mlLight*mlStrength*.44;
#endif
#ifdef FILAMENT_PHYSICS
  thread+=mix(glimmer,vec3(.93,.98,1.),.55)*fpFlash*filamentPhysicsGlow*.64;
#endif
  float amount=filamentAmount;
  vec3 result=mix(background,background*.48+thread*1.06,core*amount*.91);
  if(species==23 && filamentQuasiRelief>0.0){ // Embossed quasicrystal thread, no separate post pass.
    float lift=filamentQuasiRelief*filamentQuasiElevation;
    float crown=pow(clamp(1.0-threadD/max(width+aa,.002),0.0,1.0),.56);
    float sheen=.45+.55*highlight;
    float shoulder=(1.0-crown)*edge;
    result*=1.0-core*lift*(.08+.14*(1.0-sheen));
    result+=mix(ink,glimmer,.34+.4*quasiLift)*core*amount*
      lift*(.19+.45*crown)*sheen;
    result+=vec3(.94,.97,1.0)*core*amount*lift*
      pow(max(0.0,.26+.74*crown*sheen),9.0)*.37;
    result+=glimmer*shoulder*amount*lift*(.08+.18*quasiJunction);
    // Soft dark channel directly beside raised embroidered strand.
    result*=1.0-shoulder*lift*.11;
  }
  result+=glimmer*halo*amount*(.045+.115*filamentRelief);
  result+=vec3(.89,.95,1.0)*edge*amount*filamentRelief*.11;
#ifdef FILAMENT_STITCHING
  result+=mix(ink,vec3(.94,.98,1.0),.65)*
    needle*core*amount*filamentStitchGlow*.32;
#endif
#ifdef FILAMENT_FIBER_DETAIL
  result+=thread*fray*.36+glimmer*halo*amount*extraHalo;
  if(filamentBeads>.001){
    // Rounded bead interior, tiny directional white highlight, dark
    // attachment socket. All confined to the exact filament mask.
    vec3 pearlColor=mix(ink,glimmer,.46+.3*glisten);
    result=mix(result,pearlColor*.68,bead*.65);
    result+=vec3(1.0,.98,.92)*bead*(.3+.7*luster)*glisten;
  }
#endif

#ifdef FILAMENT_ARCHITECTURE
  // Projected carrier-local overgrowth; independent of microbial deposits.
  // Stable station identities, bounded support and reversible growth.
  float arReach=mix(1.20,3.75,filamentArchitectureReach);
  float arAcross=threadD/max(width,.003);
  float arScale=mix(2.,7.,filamentArchitectureScale);
  float arClock=time*filamentArchitectureSpeed*.8;
  float arAlong=phase*arScale+q.x*.22+q.y*.17;
  float arStation=floor(arAlong);
  float arRand=hash(vec2(arStation,seedPhase*.37+phaseOffset*.13));
  float arLife=.5+.5*cos(arClock+arRand*6.2831853);
  float arGrow=mix(.36,1.,arLife);
  float arExtent=mix(1.05,arReach,arGrow);
  vec2 arP=vec2(fract(arAlong)-.5,arAcross/max(arExtent,.01));
  float arAA=clamp(aa/max(width,.003)*arScale*.32,.025,.22);
  float arLine=mix(.105,.025,filamentArchitectureOpenwork);
  float arBlend=0.;
  vec3 arForm;
#ifdef FILAMENT_ARCH_DIMENSION
  float dmClock=time*filamentDimSpeed*1.2+filamentDimProgress*6.2831853;
  float dmWave=.5-.5*cos(dmClock);
  if(filamentDimMode==1){
    arBlend=filamentDimProgress;
  }else if(filamentDimMode==2){
    arBlend=dmWave;
  }else if(filamentDimMode==3){
    arBlend=smoothstep(.12,.88,.5+.5*sin(arAlong*.85-dmClock));
  }else if(filamentDimMode==4){
    float patch=hash(vec2(floor(arAlong/3.),seedPhase*.41+phaseOffset*.17));
    arBlend=smoothstep(patch-.22,patch+.22,dmWave);
  }else if(filamentDimMode==5){
    arBlend=dmWave;
  }else if(filamentDimMode==6){
    arBlend=.5-.5*cos(dmClock+arP.y*3.14159265);
  }else if(filamentDimMode==7){
    arBlend=.5-.5*cos(dmClock+mod(arStation,2.)*3.14159265);
  }
  arBlend=clamp(arBlend*filamentDimAmount,0.,1.);
  float dmMid=4.*arBlend*(1.-arBlend);
  float dmWarp=filamentDimWarp*dmMid;
  vec2 dmP=arP;
  float dmAlong=arAlong;
  if(filamentDimMode==5){
    dmP.y=.5+(dmP.y-.5)/max(.22,1.-.72*dmWarp);
  }else if(filamentDimMode==6){
    dmP.x+=sin(dmP.y*9.+dmClock)*dmWarp*.13;
    dmP.y+=cos(dmP.x*8.-dmClock)*dmWarp*.14;
    dmAlong+=sin(arP.y*9.+dmClock)*dmWarp*.13;
  }else{
    dmP.y+=sin(arAlong*2.+dmClock)*dmWarp*.13;
    dmP.x+=cos(arP.y*7.-dmClock)*dmWarp*.09;
    dmAlong+=cos(arP.y*7.-dmClock)*dmWarp*.09;
  }
  // Skip the inactive field entirely at exact endpoints.
  if(arBlend<=.00001){
    arForm=architectureField(filamentArchitecture,arP,arAlong,arClock,arRand,arLife,arAA);
  }else if(arBlend>=.99999){
    arForm=architectureField(filamentDimTarget,arP,arAlong,arClock,arRand,arLife,arAA);
  }else{
    vec3 arPrimary=architectureField(filamentArchitecture,dmP,dmAlong,arClock,arRand,arLife,arAA);
    vec3 arTarget=architectureField(filamentDimTarget,dmP,dmAlong,arClock,arRand,arLife,arAA);
    arForm=mix(arPrimary,arTarget,arBlend);
    // Optional union bridge prevents thin unsigned fields vanishing at midpoint.
    float dmNear=min(arPrimary.x,arTarget.x);
    arForm.x=mix(arForm.x,dmNear,filamentDimFusion*dmMid);
  }
#else
  arForm=architectureField(filamentArchitecture,arP,arAlong,arClock,arRand,arLife,arAA);
#endif
  float arD=arForm.x,arFill=arForm.y,arShine=arForm.z;
  float arSupport=(1.-smoothstep(arExtent*.87,arExtent,arAcross))*mask;
#ifdef FILAMENT_STITCHING
  arSupport*=reveal;
#endif
  float arVisible=1.-smoothstep(.35,1.1,aa/max(width,.003)*arScale);
  float arWeight=arSupport*arVisible*filamentArchitectureAmount*amount;
  float arMesh=max(1.-smoothstep(arLine,arLine+arAA,arD),arFill*(1.-filamentArchitectureOpenwork));
  vec3 arInk=palette(fract(pigmentPhase+filamentArchitectureHue*.85+arRand*.18+arP.y*.22));
  float arIridescent=filamentArchitecture==6?1.:0.;
#ifdef FILAMENT_ARCH_DIMENSION
  arIridescent=mix(arIridescent,filamentDimTarget==6?1.:0.,arBlend);
#endif
  arInk=mix(arInk,.5+.5*cos(vec3(0.,2.094,4.188)+arP.y*18.+arClock),.45*arIridescent);
#ifdef FILAMENT_ARCH_META
  // Local optical approximations in scaffold coordinates. Three sampled
  // wavelengths, no secondary screen pass or literal optical ray tracing.
  float mtClock=time*filamentMetaMotion*.55;
  float mtFreq=mix(2.,18.,filamentMetaFrequency);
  float mtFoot=aa/max(width,.003)*arScale*mtFreq*.38;
  float mtVisible=1.-smoothstep(.45,1.45,mtFoot);
  float mtAngle=atan(arP.y-.35,arP.x+.00001);
  float mtFacing=clamp(.22+.78*abs(cos(mtAngle+arClock*.23)),0.,1.);
  float mtThickness=mix(.30,3.8,filamentMetaThickness);
  float mtPhase=mtClock+arRand*6.2831853;
  vec3 mtLambda=vec3(.650,.530,.460);
  vec3 mtBands=vec3(.5);
  float mtFlash=0.;
  float mtOpacity=1.,mtSpecular=0.,mtEmission=0.;
  if(filamentMeta==1){
    // Grating orders with local orientation and wavelength-dependent phase.
    float groove=arP.x*mtFreq+arP.y*mtFreq*.37+mtPhase*.2;
    vec3 orderPhase=(groove+mtThickness*mtFacing)/mtLambda;
    mtBands=pow(.5+.5*cos(orderPhase*6.2831853),vec3(3.));
    mtFlash=max(mtBands.r,max(mtBands.g,mtBands.b));
  }else if(filamentMeta==2){
    // Three directional lattice planes approximate a photonic stop band.
    vec2 v=arP*mtFreq;
    float lattice=(cos(v.x*6.2831853)+cos(dot(v,vec2(.5,.8660254))*6.2831853)+cos(dot(v,vec2(-.5,.8660254))*6.2831853))/3.;
    float center=.47+.14*mtFacing+.055*lattice+.025*sin(mtPhase);
    vec3 delta=(mtLambda-vec3(center))/mix(.095,.035,filamentMetaPolish);
    mtBands=exp(-delta*delta);mtFlash=abs(lattice);
  }else if(filamentMeta==3){
    // Opposed reflected/transmitted bands, using a projected facing proxy.
    float path=mtThickness*(.45+.55*mtFacing)+.16*sin(arP.y*mtFreq+mtPhase);
    vec3 reflected=.5+.5*cos(12.5663706*path/mtLambda);
    mtBands=mix(1.-reflected,reflected,smoothstep(.28,.76,mtFacing));
    mtFlash=pow(1.-mtFacing,2.);
  }else if(filamentMeta==4){
    // Thin-film phase delay varies with projected thickness and incidence.
    float path=mtThickness*(.65+.35*cos(arP.x*mtFreq+mtPhase))*(.5+.5*mtFacing);
    mtBands=.5+.5*cos(12.5663706*path/mtLambda);
    mtFlash=pow(mtFacing,5.);
  }else if(filamentMeta==5){
    // Faceted microscopic chambers with wavelength-sheared highlights.
    vec2 v=fract(arP*mtFreq*.42)-.5;
    float facet=atan(v.y,v.x+.00001);
    float plane=floor((facet+3.14159265)*.95492966);
    float split=plane*.39+mtPhase*.2+length(v)*mtThickness;
    mtBands=pow(.5+.5*cos(6.2831853*(split/mtLambda+vec3(0.,.16,.32))),vec3(2.));
    mtFlash=1.-smoothstep(.025,.13,abs(abs(v.x)-abs(v.y)));
  }else if(filamentMeta==6){
    // Nacre-like terrace thickness with bright mineral ridge reflections.
    float ridge=fract((arP.y+abs(arP.x)*.42)*mtFreq);
    float path=mtThickness*(.55+.45*ridge)*mtFacing;
    mtBands=.5+.5*cos(12.5663706*path/mtLambda+mtPhase*.30);
    mtFlash=1.-smoothstep(.06,.24,ridge);
  }else if(filamentMeta==7){
    // Retardation between two projected polarization axes.
    float axis=mtAngle+arP.y*mtFreq*.4+mtPhase*.2;
    float polarAxis=sin(2.*axis);
    float polar=polarAxis*polarAxis;
    vec3 retard=sin(3.14159265*mtThickness*(.5+.5*mtFacing)/mtLambda);
    mtBands=polar*retard*retard;mtFlash=polar;
  }else if(filamentMeta==8){
    // Bragg-like reflection shifts across stable microcrystalline domains.
    vec2 domain=floor(vec2(arAlong,arP.y*4.)*mtFreq*.22);
    float dh=hash(domain+vec2(seedPhase*.17,17.2));
    float center=.43+.22*mtFacing+.055*sin(dh*6.2831853+mtPhase*.35);
    vec3 delta=(mtLambda-vec3(center))/mix(.085,.028,filamentMetaPolish);
    mtBands=exp(-delta*delta);mtFlash=pow(mtFacing,4.);
  }else if(filamentMeta==9){
    // Nematic director field with half-angle defects and optical retardance.
    vec2 v=vec2(arAlong*.42,arP.y)*mtFreq*.55;
    vec2 cell=floor(v),p=fract(v)-.5;
    float director=.5*atan(p.y,p.x+.00001)+mtPhase*.28+
      .40*sin(v.x*2.+v.y*3.);
    float polar=sin(2.*director);polar*=polar;
    float path=mtThickness*(.65+.35*mtFacing)*(.75+.25*cos(director*2.));
    vec3 retard=sin(3.14159265*path/mtLambda);
    mtBands=mix(vec3(.08),retard*retard,polar);
    mtFlash=pow(abs(cos(director-mtAngle)),7.);
    mtOpacity=.50+.42*polar;mtSpecular=.24*mtFlash;
  }else if(filamentMeta==10){
    // Aerogel: nested pores, blue-biased scattering and grazing rim.
    vec2 v=vec2(arAlong*.36,arP.y)*mtFreq*.72;
    float grain=0.,rim=0.;
    for(int ag=0;ag<3;ag++){
      float scale=pow(2.03,float(ag));
      vec2 p=fract(v*scale+float(ag)*.37)-.5;
      float r=length(p);
      float weight=pow(.55,float(ag));
      grain+=weight*(1.-smoothstep(.17,.32,r));
      rim+=weight*(1.-smoothstep(.025,.11,abs(r-.30)));
    }
    float scatter=clamp(grain*.65,0.,1.);
    vec3 haze=mix(vec3(.12,.31,.63),vec3(.80,.91,1.),scatter);
    mtBands=mix(haze,vec3(.91,.62,.29),pow(mtFacing,4.)*.28);
    mtFlash=clamp(rim*.55,0.,1.);
    mtOpacity=.22+.43*scatter+.24*(1.-mtFacing);
    mtSpecular=.15*mtFlash;
  }else if(filamentMeta==11){
    // Rosensweig-inspired magnetic peaks, radial facets and oily glints.
    vec2 v=vec2(arAlong*.42,arP.y)*mtFreq*.65;
    float field=(cos(v.x*6.2831853)+cos(dot(v,vec2(.5,.8660254))*6.2831853+mtPhase)+
      cos(dot(v,vec2(-.5,.8660254))*6.2831853-mtPhase))/3.;
    float peak=pow(clamp(.5+.5*field,0.,1.),3.);
    float ridge=pow(1.-abs(field),5.);
    vec3 film=.5+.5*cos(12.5663706*(mtThickness*(.45+.55*peak))/mtLambda);
    mtBands=mix(vec3(.022,.018,.045),film,.22+.55*peak);
    mtFlash=pow(peak,mix(2.,7.,filamentMetaPolish));
    mtOpacity=.75+.25*peak;mtSpecular=.55*max(mtFlash,.45*ridge);
  }else if(filamentMeta==12){
    // Three bounded recursive folds model layered dichroic glass facets.
    vec2 v=fract(vec2(arAlong*.35,arP.y)*mtFreq*.30)-.5;
    float facet=0.,edge=0.;
    for(int fg=0;fg<3;fg++){
      v=abs(v)-vec2(.24,.19);
      float a=.55+float(fg)*.19+mtClock*.08;
      v=mat2(cos(a),-sin(a),sin(a),cos(a))*v*1.65;
      facet+=length(v)*pow(.55,float(fg));
      edge=max(edge,1.-smoothstep(.025,.10,min(abs(v.x),abs(v.y))));
    }
    vec3 bands=.5+.5*cos(12.5663706*(mtThickness*.32+facet*.36+mtFacing*.19)/mtLambda);
    mtBands=mix(1.-bands,bands,smoothstep(.25,.75,mtFacing));
    mtFlash=edge;mtOpacity=.37+.48*edge;mtSpecular=.48*edge;
  }else if(filamentMeta==13){
    // Directional reflection lobes across flowing brushed-metal grooves.
    float v=arP.y*mtFreq*1.8+.40*sin(arAlong*.65-mtClock);
    float groove=cos(v*6.2831853);
    float streak=pow(abs(cos(mtAngle+groove*.35+mtPhase*.12)),mix(3.,16.,filamentMetaPolish));
    vec3 metal=.5+.5*cos(vec3(.2,1.5,3.1)+groove*.65+mtPhase*.18);
    mtBands=mix(vec3(.09,.12,.18),metal,.24+.62*streak);
    mtFlash=streak;mtOpacity=.96;mtSpecular=.65*streak;
  }else if(filamentMeta==14){
    // Soft gel body, subsurface-like gradients and rhythmic internal light.
    vec2 v=vec2(arAlong*.35,arP.y)*mtFreq*.55;
    vec2 p=fract(v)-.5;
    float body=exp(-dot(p,p)*7.);
    float pulse=.5+.5*sin(mtClock+v.x*.63+arRand*6.2831853);
    vec3 inner=.5+.5*cos(vec3(0.,2.094,4.188)+body*3.+mtThickness+mtPhase*.25);
    mtBands=mix(inner*.28,inner,body);
    mtFlash=pow(mtFacing,6.)*.65;
    mtOpacity=.38+.45*body;mtSpecular=.22*mtFlash;
    mtEmission=body*(.20+.80*pulse)*.45;
  }else if(filamentMeta==15){
    // Local Voronoi nearest/second nearest distance defines bubble walls.
    vec2 v=vec2(arAlong*.33,arP.y)*mtFreq*.55;
    vec2 cell=floor(v),p=fract(v);
    float d1=10.,d2=10.;
    for(int fy=-1;fy<=1;fy++){
      for(int fx=-1;fx<=1;fx++){
        vec2 offset=vec2(float(fx),float(fy)),id=cell+offset;
        vec2 jitter=vec2(hash(id+vec2(13.1,seedPhase*.14)),hash(id+vec2(5.3,19.7)));
        vec2 delta=offset+.20+.60*jitter-p;
        float d=dot(delta,delta);
        if(d<d1){d2=d1;d1=d;}else if(d<d2){d2=d;}
      }
    }
    float wall=1.-smoothstep(.035,.18,d2-d1);
    float path=mtThickness*(.45+.55*clamp(sqrt(d1),0.,1.))+.10*sin(mtPhase);
    vec3 film=.5+.5*cos(12.5663706*path/mtLambda);
    mtBands=mix(vec3(.43,.54,.69),film,.35+.65*wall);
    mtFlash=wall;mtOpacity=.30+.64*wall;mtSpecular=.44*wall;
  }else if(filamentMeta==16){
    // Faceted microfibers with velvet grazing scatter and spectral glitter.
    vec2 v=vec2(arAlong*.65,arP.y)*mtFreq;
    vec2 cell=floor(v),p=fract(v)-.5;
    float grain=hash(cell+vec2(seedPhase*.23,8.1));
    float tip=1.-smoothstep(.035,.22,length(p*vec2(1.8,.85)));
    float grazing=pow(1.-mtFacing,.65);
    vec3 spectral=.5+.5*cos(vec3(0.,2.094,4.188)+grain*6.2831853+mtThickness*mtFacing+mtPhase*.25);
    mtBands=mix(spectral*.28,spectral,.3+.7*grazing);
    mtFlash=tip*pow(.5+.5*cos(grain*6.2831853+mtClock),6.);
    mtOpacity=.70+.22*grazing;mtSpecular=.55*mtFlash;
  }
  float mtMix=filamentMetaAmount*mtVisible;
  vec3 mtColor=mix(arInk,mtBands,filamentMetaDispersion);
  arInk=mix(arInk,mtColor,mtMix);
  arShine=mix(arShine,clamp(mtFlash,0.,1.),mtMix*filamentMetaPolish);
  // Material opacity only modifies the scaffold, not its carrier or colonies.
  arWeight*=mix(1.,clamp(mtOpacity,0.,1.),mtMix);
  result+=mix(arInk,vec3(.94,.97,1.),.65)*arMesh*arWeight*mtSpecular*mtMix*filamentMetaPolish;
  result+=arInk*arMesh*arWeight*mtEmission*mtMix;
#endif
  result=mix(result,result*.55+arInk*(.7+.3*arShine),clamp(arMesh*arWeight*.78,0.,.85));
  result+=mix(arInk,vec3(.92,.97,1.),.50)*arMesh*arWeight*clamp(arShine,0.,1.)*.32;
#endif

#ifdef FILAMENT_SURFACE_ECOLOGY
  // Stable local cells on the projected yarn. Growth is analytic and
  // reversible, not a stateful population simulation. The underlying
  // core remains intact; this is a separate attached surface deposit.
  float ecoAcross=threadD/max(width,.003);
  float ecoClock=time*filamentEcologySpeed*.85;
  float ecoScale=mix(1.2,4.4,filamentEcologyScale);
  vec2 ecoCoord=vec2(phase*3.2+q.x*.22+q.y*.17,ecoAcross)*ecoScale;
  ecoCoord.y+=.18*sin(ecoCoord.x*.8+seedPhase);
  vec2 ecoId=floor(ecoCoord);
  vec2 ep=fract(ecoCoord)-.5;
  float eh=hash(ecoId+vec2(seedPhase*.31,phaseOffset*.19));
  float eh2=hash(ecoId+vec2(7.31,seedPhase*.27));
  float ecoLife=.5+.5*sin(ecoClock+eh*6.2831853);
  float ecoGate=smoothstep(1.-filamentEcologyCoverage-.15,1.-filamentEcologyCoverage+.15,eh);
  float ecoGrowth=mix(.24,1.,smoothstep(.12,.84,ecoLife));
  // Mixed cultures assign one stable morphology per local cell.
  // Time modulates growth and visibility, never the station's identity.
  int ecoSpecies=filamentEcology;
  float ecoSpeciesHue=0.;
  if(filamentEcology>=17){
    float mixHash=hash(ecoId+vec2(31.7+seedPhase*.29,12.3+phaseOffset*.31));
    float patchHash=hash(floor(ecoId/vec2(4.,2.))+vec2(8.4,seedPhase*.23));
    float ecoZone=ecoId.y+.5;
    if(filamentEcology==17){
      // Silica consortium: complementary mineral forms.
      int slot=int(floor(min(mixHash,.999999)*6.));
      ecoSpecies=slot==0?1:slot==1?8:slot==2?9:slot==3?11:slot==4?15:16;
    }else if(filamentEcology==18){
      // Stable fungal territories with bacteria and yeast at their margins.
      ecoSpecies=patchHash<.32?(mixHash<.72?3:6):
        patchHash<.65?(mixHash<.60?6:2):(mixHash<.62?7:13);
      float sharedPulse=.5+.5*sin(ecoClock+patchHash*6.2831853);
      ecoGrowth=mix(ecoGrowth,mix(.24,1.,sharedPulse),.65);
    }else if(filamentEcology==19){
      // Patchy colonies with a seeded dominant species and rarer neighbors.
      int dominant=1+int(floor(min(patchHash,.999999)*16.));
      ecoSpecies=mixHash<.76?dominant:1+int(floor(min(eh2,.999999)*16.));
    }else if(filamentEcology==20){
      // Alternating growth windows; residents fade in and out rather than morph.
      int cohort=int(mod(ecoId.x+2.*ecoId.y,4.));
      ecoSpecies=cohort==0?10:cohort==1?14:cohort==2?12:15;
      float tide=.5+.5*cos(ecoClock+float(cohort)*1.5707963);
      ecoGate*=mix(.12,1.,smoothstep(.15,.85,tide));
      ecoGrowth=mix(.24,1.,tide);
    }else if(filamentEcology==21){
      // Distinct bands measured from the carrier, not screen height.
      ecoSpecies=ecoZone<ecoScale*.55?(mixHash<.5?9:10):
        ecoZone<ecoScale*1.1?(mixHash<.5?11:12):(mixHash<.5?14:3);
    }else if(filamentEcology==22){
      ecoSpecies=1+int(floor(min(mixHash,.999999)*16.));
    }
    // Golden-ratio palette offsets give species recognizable pigments.
    ecoSpeciesHue=fract(float(ecoSpecies)*.61803398875)*.44;
  }
  float ecoAA=clamp(aa/max(width,.003)*ecoScale*.35,.025,.20);
  float ecBody=0.,ecRib=0.,ecShadow=0.;
  float er=length(ep);
  if(ecoSpecies==1){ // Diatom valves, dotted silica ribs.
    vec2 v=ep*vec2(.95,1.8);
    float d=length(v);
    float radius=.44*ecoGrowth;
    ecBody=1.-smoothstep(radius,radius+ecoAA,d);
    float puncta=length(fract(v*9.)-.5);
    ecRib=ecBody*max(1.-smoothstep(.03,.13,abs(d-radius*.80)),
      .75*(1.-smoothstep(.13,.28,puncta)));
    ecShadow=ecBody*(1.-ecRib)*.5;
  }else if(ecoSpecies==2){ // Budding yeast, mother and daughter cells.
    float mother=length(ep+vec2(.11,.0))-.30*ecoGrowth;
    vec2 budPos=vec2(.22,.12*sin(eh2*6.28));
    float bud=length(ep-budPos)-.21*ecoGrowth*ecoLife;
    float d=min(mother,bud);
    ecBody=1.-smoothstep(-ecoAA,ecoAA,d);
    ecRib=ecBody*(1.-smoothstep(.06,.22,length(ep+vec2(.18,.10))));
    ecShadow=ecBody*smoothstep(.04,.30,er);
  }else if(ecoSpecies==3){ // Branching mycelial threads, tapered tips.
    float trunk=abs(ep.x-.12*sin(ep.y*9.+eh*6.28));
    float branch=abs(abs(ep.x)-abs(ep.y)*.72-.04*sin(ep.y*18.));
    float fine=abs(abs(ep.x)*.63-abs(ep.y+.16)*.93);
    float d=min(trunk,min(branch+.018,fine+.035));
    float extent=1.-smoothstep(.30*ecoGrowth,.49*ecoGrowth,er);
    ecBody=(1.-smoothstep(.025,.025+ecoAA,d))*extent;
    ecRib=ecBody*pow(.5+.5*cos(ep.y*14.-ecoClock),4.);
    ecShadow=ecBody*.3;
  }else if(ecoSpecies==4){ // Ruffled lichen crust and tiny granular lobes.
    float angle=atan(ep.y,ep.x+.00001);
    float radius=ecoGrowth*(.31+.07*sin(angle*7.+eh*6.28)+.025*cos(angle*13.));
    ecBody=1.-smoothstep(radius,radius+ecoAA,er);
    float gran=length(fract(ep*11.+eh)-.5);
    ecRib=ecBody*max(1.-smoothstep(.035,.12,abs(er-radius*.82)),
      .65*(1.-smoothstep(.12,.29,gran)));
    ecShadow=ecBody*(1.-ecRib)*.6;
  }else if(ecoSpecies==5){ // Faceted mineral growth.
    vec2 h=abs(ep);
    float facet=max(h.x,dot(h,vec2(.5,.8660254)));
    float radius=.37*ecoGrowth;
    ecBody=1.-smoothstep(radius,radius+ecoAA,facet);
    ecRib=ecBody*max(1.-smoothstep(.02,.09,abs(facet-radius*.68)),
      .7*(1.-smoothstep(.02,.12,abs(ep.x+ep.y*.4))));
    ecShadow=ecBody*(.25+.55*step(0.,ep.x-ep.y));
  }else if(ecoSpecies==6){ // Small aligned bacterial capsules.
    float angle=eh*6.2831853;
    vec2 b=mat2(cos(angle),-sin(angle),sin(angle),cos(angle))*ep;
    b.x=fract(b.x*2.1+.5)-.5;
    float d=length(vec2(max(abs(b.x)-.12,0.),b.y));
    ecBody=1.-smoothstep(.13*ecoGrowth,.13*ecoGrowth+ecoAA,d);
    ecRib=ecBody*(1.-smoothstep(.025,.11,abs(b.y+.035)));
    ecShadow=ecBody*smoothstep(.03,.12,d);
  }else if(ecoSpecies==7){ // Interfering mucilage films.
    float wave=.5+.5*sin(ep.x*10.+sin(ep.y*8.+ecoClock)*2.+eh*6.28);
    float membrane=.5+.5*cos(ep.y*13.-ep.x*5.-ecoClock*.7);
    ecBody=smoothstep(.18,.62,wave*membrane)*ecoGrowth;
    ecRib=ecBody*pow(membrane,6.);
    ecShadow=ecBody*(1.-wave)*.28;
  }else if(ecoSpecies==8){ // Radiolarian shell, rings and spokes.
    float angle=atan(ep.y,ep.x+.00001);
    float radius=.43*ecoGrowth;
    float shell=1.-smoothstep(.025,.025+ecoAA,abs(er-radius));
    float ribs=pow(abs(cos(angle*7.+eh*6.28)),10.);
    float inner=1.-smoothstep(.025,.025+ecoAA,abs(er-radius*.54));
    ecBody=max(shell,max(inner,ribs*(1.-smoothstep(radius,radius+ecoAA,er))));
    ecRib=max(shell,inner);
    ecShadow=ecBody*(1.-ecRib)*.48;
  }else if(ecoSpecies==9){ // Pennate silica valve, axial raphe and transverse striae.
    vec2 v=ep*vec2(1.,1.85);
    float r=.45*ecoGrowth;
    float d=length(v);
    ecBody=1.-smoothstep(r,r+ecoAA,d);
    float raphe=1.-smoothstep(.012,.012+ecoAA,abs(v.y));
    float striae=1.-smoothstep(.11,.11+ecoAA*4.,abs(fract(v.x*14.+.5)-.5));
    float rim=1.-smoothstep(.02,.02+ecoAA,abs(d-r*.86));
    ecRib=ecBody*max(rim,max(raphe,.75*striae));
    ecShadow=ecBody*(1.-ecRib)*.52;
  }else if(ecoSpecies==10){ // Desmid: mirrored scalloped semicells with central isthmus.
    vec2 v=vec2(abs(ep.x)-.19,ep.y*1.12);
    float a=atan(v.y,v.x+.00001);
    float r=ecoGrowth*(.22+.045*cos(a*5.));
    float d=length(v);
    float lobes=1.-smoothstep(r,r+ecoAA,d);
    float bridge=(1.-smoothstep(.07,.07+ecoAA,abs(ep.y)))*(1.-smoothstep(.19,.19+ecoAA,abs(ep.x)));
    ecBody=max(lobes,bridge);
    ecRib=lobes*max(1.-smoothstep(.018,.018+ecoAA,abs(d-r*.75)),.6*pow(abs(cos(a*5.)),8.));
    ecShadow=ecBody*(1.-ecRib)*.48;
  }else if(ecoSpecies==11){ // Coccolith: a calcite rosette of radial overlapping plates.
    float a=atan(ep.y,ep.x+.00001)+ecoClock*.14;
    float petal=abs(fract(a*1.9098593+.5)-.5)*2.;
    float r=ecoGrowth*(.33+.07*cos(a*12.));
    float ann=(1.-smoothstep(r,r+ecoAA,er))*smoothstep(r*.36,r*.36+ecoAA,er);
    ecBody=ann;
    ecRib=ann*max(1.-smoothstep(.09,.09+ecoAA*3.,petal),1.-smoothstep(.018,.018+ecoAA,abs(er-r*.83)));
    ecShadow=ann*(.25+.5*petal);
  }else if(ecoSpecies==12){ // Dinoflagellate armor, girdle and paired horns.
    vec2 v=ep*vec2(1.,1.24);
    float r=.32*ecoGrowth;
    float body=1.-smoothstep(r,r+ecoAA,length(v));
    float hornDist=abs(abs(ep.x)-.19*ecoGrowth-.22*abs(ep.y));
    float horns=(1.-smoothstep(.028,.028+ecoAA,hornDist))*smoothstep(.15,.22,abs(ep.y))*(1.-smoothstep(.34*ecoGrowth,.43*ecoGrowth,abs(ep.y)));
    ecBody=max(body,horns);
    float girdle=1.-smoothstep(.025,.025+ecoAA,abs(v.y+.08*sin(v.x*12.)));
    float plates=1.-smoothstep(.035,.035+ecoAA,abs(sin(v.x*17.)+sin(v.y*16.)));
    ecRib=max(horns*.7,body*max(girdle,plates*.7));
    ecShadow=body*(1.-ecRib)*.55;
  }else if(ecoSpecies==13){ // Spirillum: traveling corkscrew ribbon with raised ridge.
    float theta=ep.x*25.-ecoClock*1.8+eh*6.2831853;
    float center=.17*ecoGrowth*sin(theta);
    float d=abs(ep.y-center);
    float endMask=1.-smoothstep(.34*ecoGrowth,.48*ecoGrowth,abs(ep.x));
    ecBody=(1.-smoothstep(.042,.042+ecoAA,d))*endMask;
    ecRib=ecBody*(.25+.75*pow(.5+.5*cos(theta),3.));
    ecShadow=ecBody*(.25+.55*(.5-.5*cos(theta)));
  }else if(ecoSpecies==14){ // Vorticella: contractile stalk and ciliated bell.
    float sway=.055*sin(ecoClock+eh*6.28);
    float y=ep.y+.05;
    float h=.22*ecoGrowth;
    float bellWidth=.065+.16*smoothstep(0.,max(h,.01),y);
    float bell=(1.-smoothstep(bellWidth,bellWidth+ecoAA,abs(ep.x-sway)))*smoothstep(-ecoAA,0.,y)*(1.-smoothstep(h,h+ecoAA,y));
    float stalk=(1.-smoothstep(.016,.016+ecoAA,abs(ep.x-.045*sin(y*24.+ecoClock))))*(1.-smoothstep(0.,ecoAA,y))*smoothstep(-.42*ecoGrowth,-.28*ecoGrowth,y);
    float lip=bell*(1.-smoothstep(.02,.02+ecoAA,abs(y-h*.86)));
    float cilia=bell*pow(abs(sin(ep.x*55.+ecoClock*2.)),6.)*smoothstep(h*.55,max(h*.9,.01),y);
    ecBody=max(bell,stalk);
    ecRib=max(stalk*.7,max(lip,cilia));
    ecShadow=bell*(1.-ecRib)*.52;
  }else if(ecoSpecies==15){ // Foraminifer: logarithmic spiral of individual chambers.
    float d=10.;
    float rim=0.;
    for(int fi=0;fi<7;fi++){
      float j=float(fi);
      float a=j*1.36+eh*6.2831853;
      float arm=.032*exp(j*.30)*ecoGrowth;
      float radius=.049*exp(j*.19)*ecoGrowth;
      float chamber=length(ep-vec2(cos(a),sin(a))*arm);
      d=min(d,chamber-radius);
      rim=max(rim,1.-smoothstep(.014,.014+ecoAA,abs(chamber-radius*.82)));
    }
    ecBody=1.-smoothstep(-ecoAA,ecoAA,d);
    ecRib=ecBody*rim;
    ecShadow=ecBody*(1.-ecRib)*.57;
  }else if(ecoSpecies==16){ // Siliceous sponge spicules: angular, pointed mineral needles.
    float a=atan(ep.y,ep.x+.00001)+eh*6.2831853+ecoClock*.09;
    float spokes=abs(sin(a*3.))*er;
    float radius=.43*ecoGrowth;
    float taper=.012+.04*(1.-clamp(er/max(radius,.01),0.,1.));
    ecBody=(1.-smoothstep(taper,taper+ecoAA,spokes))*(1.-smoothstep(radius,radius+ecoAA,er));
    ecRib=ecBody*max(.45,1.-smoothstep(.012,.012+ecoAA,spokes));
    ecShadow=ecBody*.25;
  }
  // Colonies may spread a little beyond the core, but remain attached to
  // the same carrier envelope and respect stitch reveal and geometry mask.
  float ecAttach=max(core,.78*(1.-smoothstep(width*.70,width*1.85+aa,threadD))*mask);
#ifdef FILAMENT_STITCHING
  ecAttach*=reveal;
#endif
  float ecVisible=1.-smoothstep(.28,.95,aa/max(width,.003)*ecoScale);
  float ecAmount=filamentEcologyAmount*ecoGate*ecAttach*ecVisible*amount;
  vec3 ecInk=palette(fract(pigmentPhase+filamentEcologyHue*.88+eh2*.24+ecoLife*.12+ecoSpeciesHue));
  vec3 ecLight=mix(ecInk,vec3(.96,.98,1.),.46);
  if(ecoSpecies==7){
    ecInk=mix(ecInk,.5+.5*cos(vec3(0.,2.094,4.188)+er*18.+ecoClock+eh*6.28),.56);
    ecLight=mix(ecInk,vec3(1.),.35);
  }
  result=mix(result,result*.52+ecInk*(.78+.24*ecoGrowth),clamp(ecBody*ecAmount*.86,0.,.9));
  result*=1.-clamp(ecShadow*ecAmount*filamentEcologyRelief*.35,0.,.35);
  result+=ecLight*ecRib*ecAmount*filamentEcologyRelief*.55;
#endif

#ifdef FILAMENT_ADORNMENT
  // Local phase is attached to the actual moving fiber, not UV-screen dots.
  // The soft radial collar is restricted to the thread's own distance mask.
  float adornClock=time*(.18+filamentAdornmentMotion*1.5)+phaseOffset*.32;
  float adornPhase=phase*(7.0+filamentAdornmentSpacing*27.0)+
    q.x*.29+seedPhase*.17;
  // Choreograph ornaments in carrier coordinates. Original modes leave
  // the historical phase and clock exactly unchanged. No screen-space stickers.
  float choreo=filamentAdornmentRhythm;
  float movement=filamentAdornmentMotion*choreo;
  float originalStation=floor(adornPhase/6.2831853+.5);
  if(filamentAdornmentKinetics==1){
    adornPhase-=adornClock*2.4*movement;
  }else if(filamentAdornmentKinetics==2){
    adornPhase+=sin(originalStation*3.14159265*.5+phaseOffset)*adornClock*1.2*movement;
  }else if(filamentAdornmentKinetics==3){
    adornPhase+=sin(adornPhase*.34+adornClock)*movement*1.8;
  }else if(filamentAdornmentKinetics==4){
    adornPhase+=sin(adornClock*1.7+originalStation*.61)*movement*1.7;
  }else if(filamentAdornmentKinetics==5){
    adornClock+=sin(adornPhase*.7+adornClock*.4)*movement*2.;
  }else if(filamentAdornmentKinetics==6){
    adornPhase-= (adornClock+sin(adornClock*2.)*.45)*movement*1.9;
  }
  float stationId=floor(adornPhase/6.2831853+.5);
  float occupancy=1.;
  float population=filamentAdornmentPopulation;
  if(filamentAdornmentPlacement==1){
    occupancy=mix(.08,1.,step(.5,mod(stationId,2.)));
  }else if(filamentAdornmentPlacement==2){
    occupancy=smoothstep(1.-population-.12,1.-population+.12,fract(stationId*.61803398875+.23));
  }else if(filamentAdornmentPlacement==3){
    occupancy=smoothstep(.55-population*.48,.85-population*.48,.5+.5*cos(stationId*.93+seedPhase));
  }else if(filamentAdornmentPlacement==4){
    occupancy=mix(.14,1.,smoothstep(0.,1.,fract(stationId*.137+seedPhase*.11)));
  }else if(filamentAdornmentPlacement==5){
    occupancy=smoothstep(.72-population*.55,.92-population*.55,.5+.5*cos(stationId*.73-adornClock*.6*movement));
  }else if(filamentAdornmentPlacement==6){
    occupancy=pow(.5+.5*cos(stationId*1.618+sin(phaseOffset)*2.),mix(8.,1.,population));
  }
  if(filamentAdornmentPlacement>0)occupancy=mix(occupancy,1.,population*.22);
  // Deterministic station identity follows the moving carrier phase, not
  // frame number. Bare parents stay bare. The selected species is retained
  // at stations outside the diversity threshold.
  int stationFinish=filamentAdornmentFinish;
  int stationInterior=filamentAdornmentInterior;
  float stationSize=filamentAdornmentSize;
  if(filamentAdornmentColony>0 && adornmentMode>0){
    float stationKey=stationId+seedPhase*3.17+phaseOffset*5.31;
    float hShape=fract(sin(stationKey*12.9898+1.71)*43758.5453);
    float hKind=fract(sin(stationKey*23.417+4.13)*15731.743);
    float hSize=fract(sin(stationKey*8.731+7.9)*23147.321);
    float hFinish=fract(sin(stationKey*17.137+3.2)*19341.123);
    float hAnatomy=fract(sin(stationKey*31.817+8.2)*29131.421);
    if(hShape<filamentAdornmentDiversity){
      int variant=int(floor(hKind*3.0));
      if(filamentAdornmentColony==1)adornmentMode=variant==0?13:(variant==1?14:20);
      else if(filamentAdornmentColony==2)adornmentMode=variant==0?15:(variant==1?16:21);
      else if(filamentAdornmentColony==3)adornmentMode=variant==0?7:(variant==1?10:22);
      else if(filamentAdornmentColony==4)adornmentMode=variant==0?17:(variant==1?18:19);
      else if(filamentAdornmentColony==5)adornmentMode=variant==0?3:(variant==1?4:9);
      else if(filamentAdornmentColony==6)adornmentMode=variant==0?13:(variant==1?16:22);
    }
    stationSize=clamp(stationSize+(hSize-.5)*filamentAdornmentSizeVariance*.85,.02,1.);
    if(hFinish<filamentAdornmentFinishVariance)
      stationFinish=1+int(floor(fract(hKind*.71+hSize*.83+.19)*8.));
    if(hAnatomy<filamentAdornmentAnatomyVariance)
      stationInterior=1+int(floor(fract(hSize*.67+hShape*.91+.31)*9.));
  }
  float beadBeat=.5+.5*cos(adornPhase);
  float beadStation=pow(beadBeat,mix(18.0,6.0,stationSize));
  float fiberRadial=threadD/max(width,.003);
  if(filamentAdornmentColony>0 && adornmentMode>0)
    fiberRadial*=mix(1.,(1.0+filamentAdornmentSize)/(1.0+stationSize),filamentAdornmentSizeVariance);
  float collar=(1.0-smoothstep(width*.55,
    width*(1.9+stationSize*3.0)+aa,threadD))*mask;
#ifdef FILAMENT_STITCHING
  // An unwoven portion cannot grow charms before its stitch exists.
  collar*=reveal;
#endif
  float trinket=0.0;
  float sparkle=0.0;
  float shadow=.0;
  float colorShift=0.0;
  if(adornmentMode==1){ // PEARL STATIONS: round luster and attachment socket.
    float roundness=1.0-smoothstep(.22,1.85,fiberRadial);
    trinket=beadStation*roundness;
    sparkle=pow(max(0.0,1.0-abs(fiberRadial-.38)*1.25),7.0)*beadStation;
    shadow=beadStation*pow(1.0-roundness,2.0);
    colorShift=.04;
  }else if(adornmentMode==2){ // SEQUIN CHAIN: alternating flashing foil facets.
    float facet=step(.5,fract(adornPhase/6.2831853));
    float flash=pow(.5+.5*cos(adornClock*1.42+facet*2.47+phase*.7),12.0);
    trinket=beadStation*(.58+.42*facet);
    sparkle=trinket*(.28+.72*flash);
    shadow=.11*trinket;
    colorShift=.26;
  }else if(adornmentMode==3){ // FRENCH KNOTS: multiple wrapped helical loops.
    float wrap=.5+.5*cos(adornPhase*2.0+
      fiberRadial*9.0+adornClock*.43);
    trinket=beadStation*(.42+.58*wrap);
    sparkle=pow(wrap,10.0)*beadStation;
    shadow=(1.0-wrap)*beadStation*.42;
    colorShift=.09;
  }else if(adornmentMode==4){ // TASSEL FRINGE: hanging comb of split threadlets.
    float comb=pow(.5+.5*cos(adornPhase*1.5),6.0);
    float split=.5+.5*cos(q.x*12.0+fiberRadial*7.0-adornClock*.62);
    trinket=comb*split*smoothstep(.33,1.7,fiberRadial);
    sparkle=pow(split,9.0)*comb*.42;
    shadow=comb*.13;
    colorShift=.16;
  }else if(adornmentMode==5){ // LACE PICOTS: open chained edge loops.
    float arc=abs(fiberRadial-(1.35+.3*sin(adornPhase*.5)));
    float ring=1.0-smoothstep(.12,.55,arc);
    trinket=beadStation*ring;
    sparkle=pow(max(0.0,1.0-arc*2.6),8.0)*beadStation;
    shadow=.13*beadStation;
    colorShift=.33;
  }else if(adornmentMode==6){ // GLASS BUGLES: narrow faceted bars.
    float bar=pow(.5+.5*cos(adornPhase*.5),5.0);
    float glass=pow(.5+.5*cos(fiberRadial*4.7+adornClock*.32),9.0);
    trinket=bar*(.4+.6*glass);
    sparkle=bar*glass;
    shadow=bar*(1.0-glass)*.24;
    colorShift=.18;
  }else if(adornmentMode==7){ // OPAL BARNACLES: concentric growing mineral lips.
    float shell=.5+.5*cos(fiberRadial*13.0-
      sin(adornClock*.27+adornPhase*.3)*1.6);
    float growth=.5+.5*cos(adornClock*.41-adornPhase*.13);
    trinket=beadStation*(.25+.75*shell)*(.5+.5*growth);
    sparkle=beadStation*pow(shell,14.0);
    shadow=beadStation*(1.0-shell)*.32;
    colorShift=.41;
  }else if(adornmentMode==8){ // ELECTRIC THORNS: narrow living points.
    float tip=pow(.5+.5*cos(adornPhase*1.6),10.0);
    float volts=.5+.5*sin(adornClock*3.1+phase*9.0);
    trinket=tip*(1.0-smoothstep(1.4,4.4,fiberRadial))*volts;
    sparkle=pow(volts,10.0)*tip;
    shadow=tip*.15;
    colorShift=.54;
  }else if(adornmentMode==9){ // WATCHING EYES: socket, iris and pupil.
    float socket=beadStation*(1.0-smoothstep(.6,2.2,fiberRadial));
    float iris=exp(-pow((fiberRadial-1.0)*2.1,2.0));
    float pupil=exp(-pow((fiberRadial-.28)*4.0,2.0));
    trinket=socket*(.43+.57*iris);
    sparkle=socket*pow(iris,2.0)*(.48+.52*sin(adornClock+phase));
    shadow=socket*pupil*.91;
    colorShift=.62;
  }else if(adornmentMode==10){ // MYCELIUM SPORES: seeded pulses along a hyphal line.
    float spore=pow(.5+.5*cos(adornPhase*2.7+sin(q.y*.91)*.9),13.0);
    float germination=.5+.5*sin(adornClock*.76+
      floor(adornPhase/6.2831853)*1.71);
    trinket=spore*(.16+.84*germination);
    sparkle=spore*pow(germination,12.0);
    shadow=spore*.18;
    colorShift=.7;
  }else if(adornmentMode==11){ // NEON TEETH: interlocking zipper bite.
    float tooth=pow(.5+.5*cos(adornPhase*2.6),8.0);
    float jaw=.5+.5*sin(adornClock*1.4+phase*3.8);
    trinket=tooth*jaw*(1.0-smoothstep(1.2,4.6,fiberRadial));
    sparkle=tooth*pow(jaw,8.0);
    shadow=tooth*(1.0-jaw)*.42;
    colorShift=.81;
  }else if(adornmentMode==12){ // ORBITING HALOS: traveling optical collars.
    float orbit=sin(adornClock*.82+phase*.8+seedPhase*.12);
    float ring=exp(-pow((fiberRadial-(1.35+.75*orbit))*2.4,2.0));
    float relay=pow(.5+.5*cos(adornPhase*.68-adornClock*.47),7.0);
    trinket=ring*relay;
    sparkle=ring*pow(relay,1.7);
    shadow=relay*.1;
    colorShift=.93;
  }else if(adornmentMode==13){ // DIATOM VALVES
    float station=fract(adornPhase/6.2831853+.5)-.5;
    vec2 v=vec2(station*2.7,fiberRadial*.56);
    float shell=length(v*vec2(.84,1.18));
    float body=1.0-smoothstep(.77,.96,shell);
    float lip=1.0-smoothstep(.045,.15,abs(shell-.73));
    float ribs=pow(.5+.5*cos(v.x*28.0),5.0);
    float pores=smoothstep(.45,.82,.5+.5*cos(v.y*24.0))*ribs;
    trinket=body*(.16+.48*ribs+.35*lip)*(1.0-.7*pores);
    sparkle=body*(lip*.7+.3*ribs)*(.45+.55*(.5+.5*sin(adornClock+v.x*8.0)));
    shadow=body*pores*.65;
    colorShift=.12+.12*sin(adornClock*.48+v.x*4.0);
  }else if(adornmentMode==14){ // RADIOLARIAN CAGES
    vec2 v=vec2((fract(adornPhase/6.2831853+.5)-.5)*3.0,fiberRadial*.6);
    float r=length(v);
    float a=atan(v.y,v.x+.00001)+adornClock*.18;
    float polygon=r*(.94+.06*cos(a*6.0));
    float shell=1.0-smoothstep(.035,.14,abs(polygon-.72));
    float inner=1.0-smoothstep(.025,.12,abs(polygon-.42));
    float spoke=pow(abs(cos(a*3.0)),16.0)*(1.0-smoothstep(.66,.81,r));
    trinket=clamp(shell+inner*.65+spoke*.55,0.0,1.0);
    sparkle=trinket*(.34+.66*pow(.5+.5*cos(a*6.0-adornClock),5.0));
    shadow=(1.0-trinket)*(1.0-smoothstep(.68,.86,r))*.4;
    colorShift=.29;
  }else if(adornmentMode==15){ // QUASICRYSTAL JEWELS
    vec2 v=vec2((fract(adornPhase/6.2831853+.5)-.5)*3.0,fiberRadial*.6);
    float field=0.0;
    for(int axisIndex=0;axisIndex<5;axisIndex++){
      float a=float(axisIndex)*1.25663706;
      field+=cos(dot(v,vec2(cos(a),sin(a)))*18.0+sin(adornClock*.4+float(axisIndex)*1.7));
    }
    float grid=pow(.5+.5*cos(field*2.2),7.0);
    float envelope=1.0-smoothstep(.64,.9,length(v));
    trinket=envelope*(.19+.81*grid);
    sparkle=envelope*grid;
    shadow=envelope*(1.0-grid)*.28;
    colorShift=.45+.1*sin(field);
  }else if(adornmentMode==16){ // PRISM LOZENGES
    vec2 v=vec2((fract(adornPhase/6.2831853+.5)-.5)*2.8,fiberRadial*.58);
    float diamond=abs(v.x)+abs(v.y);
    float body=1.0-smoothstep(.75,.95,diamond);
    float ridge=1.0-smoothstep(.025,.13,abs(abs(v.x)-v.y));
    float flash=pow(.5+.5*cos(adornClock*1.3+v.x*7.0+v.y*4.0),6.0);
    trinket=body*(.3+.7*ridge);
    sparkle=body*(ridge*.46+flash*.54);
    shadow=body*(1.0-ridge)*.35;
    colorShift=.52+.2*sin(adornClock*.7+v.x*6.0);
  }else if(adornmentMode==17){ // MOBIUS CLASPS
    float x=(fract(adornPhase/6.2831853+.5)-.5)*2.8;
    float twist=sin(x*5.0+adornClock*.85);
    float r1=abs(fiberRadial-(1.1+.52*twist));
    float r2=abs(fiberRadial-(1.1-.52*twist));
    float a=1.0-smoothstep(.08,.28,r1);
    float b=1.0-smoothstep(.08,.28,r2);
    float station=1.0-smoothstep(.72,1.15,abs(x));
    trinket=station*max(a,b*.8);
    sparkle=station*max(a*(.55+.45*twist),b*(.55-.45*twist));
    shadow=station*min(a,b)*.4;
    colorShift=.65+.1*twist;
  }else if(adornmentMode==18){ // FRESNEL CABOCHONS
    vec2 v=vec2((fract(adornPhase/6.2831853+.5)-.5)*2.8,fiberRadial*.58);
    float r=length(v);
    float dome=1.0-smoothstep(.72,.93,r);
    float rings=pow(.5+.5*cos(r*33.0-adornClock*.8),8.0);
    float focus=pow(max(0.0,1.0-r),3.0);
    trinket=dome*(.21+.79*rings);
    sparkle=dome*(rings*.65+focus*.35);
    shadow=dome*(1.0-rings)*.3;
    colorShift=.74+.15*sin(r*14.0-adornClock*.6);
  }else if(adornmentMode==19){ // ARTICULATED LINKLETS
    float station=fract(adornPhase/6.2831853+.5)-.5;
    float bend=.38*sin(adornClock+floor(adornPhase/6.2831853+.5)*.8);
    vec2 v=vec2(station*2.6,fiberRadial*.55);
    float link=max(abs(v.x),abs(v.y-.42-bend*v.x));
    float ring=1.0-smoothstep(.055,.16,abs(link-.48));
    float pin=1.0-smoothstep(.07,.18,length(v-vec2(.42,.42+bend*.42)));
    trinket=max(ring,pin);
    sparkle=ring*(.3+.7*(.5+.5*cos(adornClock+v.x*5.0)))+pin*.4;
    shadow=ring*.17;
    colorShift=.18;
  }else if(adornmentMode==20){ // SILICA HONEYCOMB
    vec2 v=vec2((fract(adornPhase/6.2831853+.5)-.5)*2.8,fiberRadial*.58);
    vec2 grid=v*3.8+vec2(0.0,.12*sin(adornClock*.7));
    vec2 basis=vec2(1.0,1.7320508);
    vec2 a=mod(grid+basis*.5,basis)-basis*.5;
    vec2 b=mod(grid,basis)-basis*.5;
    vec2 cell=abs(dot(a,a)<dot(b,b)?a:b);
    float hex=max(cell.x,dot(cell,vec2(.5,.8660254)));
    float rim=1.0-smoothstep(.035,.11,abs(hex-.46));
    float env=1.0-smoothstep(.68,.93,length(v));
    trinket=env*rim;
    sparkle=trinket*(.38+.62*pow(.5+.5*cos(adornClock+v.x*9.0),4.0));
    shadow=env*(1.0-rim)*.36;
    colorShift=.35;
  }else if(adornmentMode==21){ // DIFFRACTION SEQUINS
    vec2 v=vec2((fract(adornPhase/6.2831853+.5)-.5)*2.8,fiberRadial*.58);
    float disc=1.0-smoothstep(.7,.91,length(v));
    float lines=pow(.5+.5*cos(v.x*39.0+v.y*17.0+adornClock*.6),5.0);
    float crossLines=pow(.5+.5*cos(v.x*38.0-v.y*16.0-adornClock*.45),5.0);
    trinket=disc*(.24+.76*max(lines,crossLines));
    sparkle=disc*clamp(lines+crossLines,0.0,1.0);
    shadow=disc*(1.0-max(lines,crossLines))*.22;
    colorShift=.5+.25*sin(v.x*12.0+v.y*7.0+adornClock*.8);
  }else if(adornmentMode==22){ // FRACTAL BRANCH CHARMS
    vec2 v=vec2((fract(adornPhase/6.2831853+.5)-.5)*2.8,fiberRadial*.58);
    float stem=1.0-smoothstep(.035,.11,abs(v.x));
    float branch=1.0-smoothstep(.035,.1,abs(abs(v.x)-.64*abs(fract(v.y*3.0)-.5)));
    float finer=1.0-smoothstep(.025,.075,abs(abs(fract(v.x*4.0)-.5)-.7*abs(fract(v.y*6.0)-.5)));
    float env=1.0-smoothstep(.68,.94,length(v));
    trinket=env*max(stem,max(branch*.8,finer*.55));
    sparkle=trinket*pow(.5+.5*cos(v.y*16.0-adornClock),4.0);
    shadow=env*(1.0-trinket)*.25;
    colorShift=.8+.08*sin(adornClock*.5+v.y*6.0);
  }else{ // Unsupported adornment mode: no accessory rendered.
    trinket=0.0;
    sparkle=0.0;
  }
  // Paint trinkets on real filament geometry, obeying stitch-reveal and
  // each parent's individual material/geometry. No full-frame sticker pass.
  vec3 accent=palette(fract(pigmentPhase+colorShift));
  float jewelry=collar*filamentAdornmentAmount*occupancy;
  float opacity=clamp(jewelry*trinket,0.0,.9);
  vec3 jewelBody=accent;
  vec3 jewelLight=mix(accent,vec3(1.0,.98,1.0),.67);
  float jewelSpark=sparkle;
  float jewelShade=shadow;
  // Independent finish in the local carrier coordinates. No texture taps
  // or changes to the underlying yarn, station distribution or ornament mask.
  if(stationFinish>0 && filamentAdornmentFinishAmount>.001){
    float jStrength=filamentAdornmentFinishAmount;
    float jStation=fract(adornPhase/6.2831853+.5)-.5;
    vec2 jUV=vec2(jStation*2.0,fiberRadial*.55);
    float jDetail=mix(5.0,28.0,filamentAdornmentFacet);
    float jSlope=.5+.5*cos(jUV.x*3.7+jUV.y*2.1+adornClock*.28);
    float jFilm=mix(.16,1.6,filamentAdornmentFilm)*(.65+.35*jSlope)
      +.055*filamentAdornmentMotion*sin(adornClock*.64+jUV.y*5.0);
    // Three representative optical wavelengths, an artistic thin-film model.
    vec3 jSpectrum=.5+.5*cos(6.2831853*jFilm/vec3(.650,.535,.450));
    float jGrain=.5+.5*cos(jUV.x*jDetail+jUV.y*jDetail*.73);
    float jFlash=pow(clamp(jSlope,0.0,1.0),mix(2.0,20.0,filamentAdornmentPolish));
    vec3 jBody=accent;
    vec3 jLight=jewelLight;
    float jSpark=sparkle;
    float jShade=shadow;
    if(stationFinish==1){ // Dichroic enamel
      jBody=accent*(.34+.74*jSpectrum)+jSpectrum*.28;
      jLight=mix(jSpectrum,vec3(1.0),.28+.38*jFlash);
      jSpark*=.62+.72*jFlash;
    }else if(stationFinish==2){ // Opal cabochon
      float jCloud=.5+.5*sin(jUV.x*jDetail*.65+sin(jUV.y*jDetail)*1.3);
      jBody=mix(accent,vec3(.84,.9,.96),.48)+jSpectrum*jCloud*.24;
      jLight=mix(jSpectrum,vec3(.98,1.,1.),.58);
      jSpark*=.65+.55*jFlash;
    }else if(stationFinish==3){ // Faceted zircon
      float jFacet=abs(fract(jUV.x*jDetail*.4+jUV.y*jDetail*.31)-.5);
      float jRidge=1.-smoothstep(.04,.16,jFacet);
      jBody=accent*(.4+.6*jSlope)+jSpectrum*jRidge*.24;
      jLight=mix(jSpectrum,vec3(1.),.6);
      jSpark=clamp(sparkle*(.4+.7*jFlash)+trinket*jRidge*.46,0.,1.);
    }else if(stationFinish==4){ // Brushed mercury
      float jBrush=pow(.5+.5*cos(jUV.y*jDetail*.8+adornClock*.35),5.);
      jBody=mix(accent,vec3(.64,.72,.83),.74)*(.5+.5*jSlope);
      jLight=vec3(.88,.96,1.);
      jSpark=clamp(sparkle*(.3+.9*jFlash)+trinket*jBrush*.23,0.,1.);
    }else if(stationFinish==5){ // Frosted silica
      jBody=mix(accent,vec3(.78,.85,.9),.50)*(.78+.22*jGrain);
      jLight=mix(accent,vec3(.94,.97,1.),.8);
      jSpark*=.32+.38*(1.-filamentAdornmentPolish)+.25*jGrain;
      jShade*=.45;
    }else if(stationFinish==6){ // Nacre scales
      float jLayer=.5+.5*cos(jUV.y*jDetail*.9+sin(jUV.x*8.)+adornClock*.4);
      jBody=mix(accent,vec3(.92,.88,.96),.46)+jSpectrum*jLayer*.23;
      jLight=mix(jSpectrum,vec3(1.,.96,.98),.55);
      jSpark=clamp(sparkle*.68+trinket*jLayer*jFlash*.46,0.,1.);
    }else if(stationFinish==7){ // Diffraction foil
      float jComb=pow(.5+.5*cos(jUV.x*jDetail*1.7+jUV.y*jDetail*.8-adornClock*.5),7.);
      jBody=accent*.46+jSpectrum*(.35+.4*jComb);
      jLight=mix(jSpectrum,vec3(1.),.15);
      jSpark=clamp(sparkle*.75+trinket*jComb*.5,0.,1.);
    }else{ // Spectral obsidian
      jBody=accent*.14+jSpectrum*(.07+.34*jFlash);
      jLight=mix(jSpectrum,vec3(1.),.21);
      jSpark*=.5+.75*jFlash;
      jShade=clamp(shadow+.35*trinket,0.,1.);
    }
    jewelBody=mix(accent,clamp(jBody,0.,1.4),jStrength);
    jewelLight=mix(jewelLight,jLight,jStrength);
    jewelSpark=mix(sparkle,jSpark,jStrength);
    jewelShade=mix(shadow,jShade,jStrength);
  }
  // Microarchitecture is an independent local ornament stencil. A window
  // removes ornament shading, revealing the already rendered yarn/art,
  // never cutting holes in the entire image or creating a new screen layer.
  float ornamentWindow=1.0;
  if(stationInterior>0 && filamentAdornmentInteriorAmount>.001){
    float imix=filamentAdornmentInteriorAmount;
    float density=mix(1.4,5.8,filamentAdornmentInteriorDensity);
    float drift=time*filamentAdornmentInteriorDrift*filamentAdornmentMotion*.55;
    float station=fract(adornPhase/6.2831853+.5)-.5;
    vec2 local=vec2(station*2.0,fiberRadial*.55);
    vec2 lattice=local*density;
    float openwork=filamentAdornmentInteriorOpenwork;
    float rim=0.0;
    float pore=0.0;
    if(stationInterior==1){ // Ribbed diatom perforations.
      lattice.x+=.23*floor(lattice.y*2.0);
      vec2 cell=fract(lattice*vec2(1.0,1.8)+vec2(.12*sin(drift),.0))-.5;
      float pr=length(cell*vec2(1.0,1.3));
      pore=1.-smoothstep(.18,.27,pr);
      rim=1.-smoothstep(.035,.11,abs(pr-.28));
      rim=max(rim,.6*pow(.5+.5*cos(lattice.x*6.2831853),10.));
    }else if(stationInterior==2){ // Hexagonal window cells.
      vec2 basis=vec2(1.0,1.7320508);
      vec2 a=mod(lattice+basis*.5,basis)-basis*.5;
      vec2 b=mod(lattice,basis)-basis*.5;
      vec2 cell=abs(dot(a,a)<dot(b,b)?a:b);
      float h=max(cell.x,dot(cell,vec2(.5,.8660254)));
      float edge=.41+.035*sin(drift);
      pore=1.-smoothstep(edge-.12,edge-.04,h);
      rim=1.-smoothstep(.035,.11,abs(h-edge));
    }else if(stationInterior==3){ // Radial skeleton with cross ribs.
      float rad=length(local);
      float angle=atan(local.y,local.x+.00001)+drift*.18;
      float spokes=pow(abs(cos(angle*mix(3.0,9.0,filamentAdornmentInteriorDensity))),14.);
      float rings=pow(.5+.5*cos(rad*density*7.0+sin(drift)),8.);
      rim=max(spokes,rings);
      pore=1.-smoothstep(.15,.55,rim);
    }else if(stationInterior==4){ // Polygon chamber walls.
      vec2 a=abs(local);
      float h=max(a.x,dot(a,vec2(.5,.8660254)));
      float contour=abs(fract(h*density+.13*sin(drift))-.5);
      rim=1.-smoothstep(.055,.17,contour);
      pore=smoothstep(.17,.32,contour);
    }else if(stationInterior==5){ // Moving 2D slice of gyroid field.
      vec2 a=lattice*2.3;
      float z=1.2+sin(drift*.7)*1.1;
      float f=sin(a.x)*cos(a.y)+sin(a.y)*cos(z)+sin(z)*cos(a.x);
      rim=1.-smoothstep(.09,.32,abs(f));
      pore=smoothstep(.35,.85,abs(f));
    }else if(stationInterior==6){ // Five-direction wave interference.
      float sum=0.;
      for(int axis=0;axis<5;axis++){
        float angle=float(axis)*1.25663706;
        sum+=cos(dot(lattice,vec2(cos(angle),sin(angle)))*4.2+.65*sin(drift+float(axis)*1.9));
      }
      rim=pow(.5+.5*cos(sum*2.1),7.);
      pore=1.-smoothstep(.10,.65,rim);
    }else if(stationInterior==7){ // Two gently shearing gratings.
      float a=cos(lattice.x*8.0+lattice.y*.9);
      float b=cos(lattice.x*8.4-lattice.y*(1.1+.35*sin(drift)));
      rim=pow(clamp(.5+.25*(a+b),0.,1.),6.);
      pore=1.-smoothstep(.12,.55,rim);
    }else if(stationInterior==8){ // Bounded multiscale branching inlay.
      float a=abs(fract(lattice.x+.65*abs(fract(lattice.y)-.5))-.5);
      float b=abs(fract(lattice.x*2.0-.8*abs(fract(lattice.y*2.0)-.5))-.5);
      float c=abs(fract(lattice.x*4.0+.7*abs(fract(lattice.y*4.0)-.5)+.12*sin(drift))-.5);
      rim=max(1.-smoothstep(.045,.14,a),max(.8*(1.-smoothstep(.045,.13,b)),.58*(1.-smoothstep(.04,.10,c))));
      pore=1.-smoothstep(.20,.65,rim);
    }else{ // Concentric optical microgrooves.
      float rad=length(local);
      float wave=.5+.5*cos(rad*density*9.0+.8*sin(drift));
      rim=pow(wave,8.);
      pore=1.-smoothstep(.18,.68,wave);
    }
    ornamentWindow=1.-imix*openwork*.96*clamp(pore,0.,1.);
    float engraving=imix*clamp(rim,0.,1.);
    jewelBody=mix(jewelBody,jewelBody*.53+accent*.38,imix*(1.-rim)*.38);
    jewelSpark=clamp(jewelSpark+trinket*engraving*.52,0.,1.);
  }
  result=mix(result,result*.46+jewelBody*.94,opacity*ornamentWindow*.78);
  result+=jewelLight*jewelry*jewelSpark*ornamentWindow*filamentAdornmentGlow*.59;
  result*=1.0-clamp(jewelry*jewelShade*ornamentWindow*.3,0.0,.25);
#endif
#ifdef FILAMENT_SCULPT
  // Geometry-constrained 2.5D emboss: a rounded cross-section, directional
  // grazing highlight and soft darkening immediately around stitch boundaries.
  // It is deliberately not a screen-wide drop shadow or a fake depth texture.
  float sculptPower=filamentSculptAmount;
  float sculptDepth=filamentSculptDepth;
  float sculptPuff=filamentSculptPuff;
  float sculptShadow=filamentSculptShadow;
  float lampAngle=filamentSculptLight*6.2831853;
  vec2 lamp=vec2(cos(lampAngle),sin(lampAngle));
  // The local phase is a stable tangent proxy; it travels with the actual
  // procedural thread rather than remaining fixed on the display pixels.
  float tangent=phase*2.1+q.x*.11-q.y*.07+seedPhase*.04;
  vec2 facing=vec2(-sin(tangent),cos(tangent));
  float incidence=dot(facing,lamp);
  float acrossThread=clamp(threadD/max(width+aa,.002),0.0,1.0);
  float crown=sqrt(max(0.0,1.0-acrossThread*acrossThread));
  float rounded=pow(crown,mix(1.5,.32,sculptPuff));
  float shadowWidth=width*(1.6+2.6*sculptDepth)+aa;
  float shadowRegion=max(0.0,
    (1.0-smoothstep(width,shadowWidth,threadD))*mask-core);
  // Unfinished parts must cast NO thread shadow.
  shadowRegion*=sculptReveal;
  float shadowSide=.38+.62*(.5-.5*incidence);
  float shadowStrength=shadowRegion*shadowSide*
    sculptShadow*(.14+.54*sculptDepth)*sculptPower;
  float litSide=.5+.5*incidence;
  float brightCrown=rounded*(.29+.71*litSide);
  float grazing=pow(clamp(.2+.8*brightCrown,0.0,1.0),
    mix(14.0,3.0,sculptPuff));
  float lightStrength=(.14+.48*sculptDepth)*sculptPower;
  if(filamentSculptMode==0){ // Raised satin stitch.
    result*=1.0-shadowStrength;
    result+=mix(ink,vec3(1.0,.98,1.0),.49)*core*
      (grazing*.62+rounded*.22)*lightStrength;
  }else if(filamentSculptMode==1){ // Trapunto: broad quilted swelling.
    float pillow=pow(rounded,.42);
    result*=1.0-shadowStrength*1.25;
    result+=mix(ink,glimmer,.56)*core*
      (.24+pillow*(.42+.34*litSide))*lightStrength*1.25;
  }else if(filamentSculptMode==2){ // Concave engraved etch.
    float trench=pow(1.0-rounded,1.5);
    result*=1.0-(core*(.21+.28*sculptDepth)+
      shadowStrength*.42)*sculptPower;
    result+=glimmer*edge*(.3+.7*litSide)*sculptPower*.22;
    result+=ink*core*trench*sculptPower*.14;
  }else if(filamentSculptMode==3){ // Hard metallic chased line.
    float spec=pow(clamp(.22+.78*rounded*litSide,0.0,1.0),19.0);
    result*=1.0-shadowStrength*1.38;
    result+=vec3(1.0,.95,.94)*core*spec*lightStrength*1.8;
    result+=glimmer*edge*lightStrength*.49;
  }else if(filamentSculptMode==4){ // Shadow cutwork: dark relieved edge and luminous rim.
    result*=1.0-shadowStrength*1.6;
    result*=1.0-core*sculptPower*(.12+.19*sculptDepth);
    result+=glimmer*edge*(.43+.57*litSide)*sculptPower*.42;
  }else if(filamentSculptMode==5){ // BEADED EMBOSS: raised pearls sewn on the path.
    float beadPhase=phase*(15.0+sculptPuff*9.0)+t*.24;
    float pearl=pow(.5+.5*cos(beadPhase),16.0);
    float socket=pow(.5+.5*cos(beadPhase+1.1),9.0);
    float beadCrown=pow(rounded,.56)*pearl;
    result*=1.0-shadowStrength*(1.15+.3*socket);
    result+=mix(glimmer,vec3(1.0,.95,.98),.56)*core*
      beadCrown*(.47+.53*litSide)*lightStrength*1.76;
    result+=ink*edge*sculptPower*socket*.13;
  }else if(filamentSculptMode==6){ // CUSHION STITCH: plush swelling segments.
    float pillow=.5+.5*cos(phase*8.1-t*.17);
    float bulge=pow(rounded,.25+.38*(1.0-pillow));
    float seam=pow(1.0-rounded,2.2)*(.45+.55*pillow);
    result*=1.0-shadowStrength*(1.5+.35*pillow);
    result+=mix(ink,glimmer,.4)*core*
      (bulge*(.43+.43*litSide)+seam*.11)*lightStrength*1.27;
  }else if(filamentSculptMode==7){ // GILDED REPOUSSÉ: crisp metallic chased repoussé.
    float chased=.5+.5*sin(phase*11.4+q.x*2.2-t*.33);
    float crest=pow(clamp(rounded*(.24+.76*litSide),0.0,1.0),13.0);
    float flank=pow(1.0-rounded,2.1);
    result*=1.0-shadowStrength*1.43;
    result+=mix(ink,vec3(1.0,.88,.59),.67)*core*
      (crest*1.7+chased*.23)*lightStrength;
    result+=glimmer*edge*flank*sculptPower*.43;
  }else if(filamentSculptMode==8){ // BAS-RELIEF: carved architectural channeling.
    float channel=.5+.5*cos(phase*4.2-t*.22);
    float stepRelief=smoothstep(.1,.67,rounded)*channel;
    float trench=pow(1.0-rounded,1.25);
    result*=1.0-shadowStrength*(1.11+.28*channel);
    result+=glimmer*core*(.16+.54*stepRelief)*lightStrength;
    result+=ink*edge*sculptPower*trench*.17;
  }else if(filamentSculptMode==9){ // CARVED APPLIQUÉ: stacked cut fabric edges.
    float ornament=.5+.5*sin(phase*6.8+t*.31+seedPhase*.2);
    float perimeter=pow(1.0-rounded,.9);
    float lift=pow(rounded,.38)*(.6+.4*ornament);
    result*=1.0-shadowStrength*1.35;
    result+=mix(ink,glimmer,.57)*core*lift*lightStrength*.95;
    result+=glimmer*edge*sculptPower*perimeter*.48;
  }else if(filamentSculptMode==10){ // BONE INLAY: opaline ivory grooves.
    float marrow=sin(phase*8.7+sin(q.y*.9+t*.26)*2.0);
    float ridge=pow(.5+.5*marrow,10.0);
    float fracture=pow(1.0-rounded,2.0);
    result*=1.0-(shadowStrength*.93+core*sculptPower*.12);
    result+=mix(ink,vec3(.97,.89,.74),.69)*core*
      (rounded*.6+ridge*.42)*lightStrength;
    result+=glimmer*edge*fracture*sculptPower*.25;
  }else if(filamentSculptMode==11){ // MELTED JEWELRY: crawling molten metal beads.
    float melt=.5+.5*sin(phase*7.6-t*.94+q.x*.43);
    float droplet=pow(melt,8.0)*pow(rounded,.64);
    float spec=pow(.45+.55*rounded*litSide,18.0);
    result*=1.0-shadowStrength*(1.0+.56*melt);
    result+=mix(glimmer,vec3(1.0,.96,.9),.7)*core*
      (droplet*.9+spec*.8)*lightStrength*1.21;
  }else if(filamentSculptMode==12){ // ALIEN SCAR TISSUE: hypertrophic seam growth.
    float scar=sin(phase*9.1+sin(q.y*.88+t*.47)*2.2);
    float keloid=.5+.5*scar;
    float raisedScar=pow(rounded,.32)*pow(keloid,.57);
    result*=1.0-shadowStrength*(1.25+.42*keloid);
    result+=mix(ink,glimmer,.32)*core*raisedScar*
      (lightStrength*.74+.22*sculptPower);
    result+=glimmer*edge*sculptPower*.14*keloid;
  }else if(filamentSculptMode==13){ // FOSSIL STITCHING: layered mineralized strata.
    float layer=.5+.5*cos(phase*12.0-q.y*.6+t*.18);
    float calcite=pow(layer,12.0);
    float petrify=pow(1.0-rounded,1.3);
    result*=1.0-shadowStrength*1.5;
    result+=mix(ink,glimmer,.73)*core*
      (rounded*.3+calcite*.61)*lightStrength*.93;
    result+=glimmer*edge*sculptPower*petrify*.31;
  }else if(filamentSculptMode==14){ // RUIN FILIGREE: fractured arc highlights.
    float arch=sin(phase*5.9+q.x*.36+t*.3);
    float fissure=pow(.5+.5*cos(arch*8.2-t*.53),11.0);
    float broken=pow(1.0-rounded,1.52);
    result*=1.0-shadowStrength*(1.25+.5*fissure);
    result+=glimmer*core*(rounded*.37+fissure*.41)*
      lightStrength*(.52+.48*litSide);
    result+=ink*edge*sculptPower*broken*.37;
  }else{ // Unsupported sculpt mode: no relief added.
    result=result;
  }
#endif
  return clamp(result,0.0,1.6);
}
vec3 livingFilamentForge(vec3 background,vec2 uv,vec2 fieldP,float fieldV){
  if(filamentAmount<.001)return background;
  float firstCore=0.0,firstCarrier=0.0,firstNeural=0.0,firstLuma=0.0,firstPigment=0.0;
  vec3 first=filamentField(background,uv,fieldP,fieldV,
    filamentSpecies,filamentMaterial,filamentAdornmentMode,filamentMorphTarget,
    0.0,0.0,0.0,
    filamentOpticsMode,filamentOpticsAmount,filamentOpticsThickness,filamentOpticsDispersion,
    filamentOpticsAnisotropy,filamentOpticsCurvature,filamentOpticsPearl,filamentOpticsPhase,
    0.0,0.0,0.0,0.0,0.0,firstCore,firstCarrier,firstNeural,firstLuma,firstPigment);
#ifdef FILAMENT_HYBRID
  if(filamentCrossbreed<.001)return first;
  float secondCore=0.0,secondCarrier=0.0,secondNeural=0.0,secondLuma=0.0,secondPigment=0.0;
  vec3 second=filamentField(first,uv,fieldP,fieldV,
    filamentSecondSpecies,filamentSecondMaterial,filamentSecondAdornmentMode,
    filamentSecondMorphTarget,filamentPhase*6.2831853,filamentTwist*6.2831853,
    filamentSecondHue*.9,
    filamentSecondOpticsMode,filamentSecondOpticsAmount,
    filamentSecondOpticsThickness,filamentSecondOpticsDispersion,
    filamentSecondOpticsAnisotropy,filamentSecondOpticsCurvature,
    filamentSecondOpticsPearl,filamentSecondOpticsPhase,
    firstCore,firstCarrier,firstNeural,firstLuma,firstPigment,
    secondCore,secondCarrier,secondNeural,secondLuma,secondPigment);
  // True under/over crossings: only where two threads overlap. Different
  // paths remain distinct rather than dissolving into a flat opacity mix.
  float contact=clamp(firstCore*secondCore,0.0,1.0);
  float alternating=step(0.0,sin((uv.x*res.x+uv.y*res.y)*.053+
    seed*.000021+filamentPhase*6.2831853+time*.07));
  float tuck=filamentInterlace*contact*(1.0-alternating);
  second=mix(second,first*.82,tuck*.88);
  vec3 crossed=mix(first,second,filamentCrossbreed);
#ifdef FILAMENT_FIBER_DETAIL
  if(filamentBeads>.001){
    // Extra knots exactly where the two genuine thread cores meet.
    float node=pow(clamp(contact,0.0,1.0),.6)*
      filamentBeads*(.6+.4*filamentBeadSize);
    crossed=mix(crossed,crossed*.72+vec3(.8,.89,1.0)*.63,
      clamp(node*.6,0.0,.7));
  }
#endif
  return clamp(crossed,0.0,1.6);
#else
  // Compiled-out secondary layer: original single-thread performance.
  return first;
#endif
}
`;
