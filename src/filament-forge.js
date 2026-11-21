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
    "name": "Silk turns crystal",
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
    "name": "Chrome melts into glass",
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
    "name": "Pixelated seam witch",
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
    "name": "Twin-attractor silk",
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
    "name": "Morse-code platinum",
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
  "Orbiting halos"
];
export const filamentAdornmentFamilies=[
  {name:"Unadorned",modes:filamentAdornmentModes.slice(0,1)},
  {name:"Classic haberdashery",modes:filamentAdornmentModes.slice(1,7)},
  {name:"Gothic alien couture",modes:filamentAdornmentModes.slice(7)}
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
  "Orbiting halos":"Phase-shifted halo collars pass along the moving thread."
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
    filamentAdornmentMotion:71,filamentAdornmentGlow:98}
];
export function applyFilamentAdornmentPreset(state,name){
  const preset=filamentAdornmentPresets.find(x=>x.name===name);
  if(!preset)return state;
  const {name:label,...adornment}=preset;
  return {...state,...adornment,filamentAmount:Math.max(60,state.filamentAmount||0)};
}
export function remixFilamentAdornments(state,rng=Math.random,onlyWeird=false){
  const unit=()=>{const n=Number(rng());return Number.isFinite(n)?
    Math.min(1-Number.EPSILON,Math.max(0,n)):0;};
  const set=onlyWeird?filamentAdornmentModes.slice(7):filamentAdornmentModes.slice(1);
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

export function specializeFilamentAdornments(source,first,second=null){
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
  const chosen=[...new Set(ids.filter(n=>n>0))].sort((a,b)=>a-b);
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
    filamentStitchSpeed:83,filamentStitchLength:83,filamentStitchGlow:92}
];
export function applyFilamentStitchPreset(state,name){
 const preset=filamentStitchPresets.find(p=>p.name===name);
 if(!preset)return state;
 const {name:label,...stitch}=preset;
 return {...state,...stitch,filamentAmount:Math.max(55,state.filamentAmount||0)};
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
uniform int filamentStitchMode;
uniform int filamentSculptMode;
uniform int filamentAdornmentMode,filamentSecondAdornmentMode;
uniform float filamentAdornmentAmount,filamentAdornmentSpacing;
uniform float filamentAdornmentSize,filamentAdornmentMotion,filamentAdornmentGlow;
uniform float filamentSculptAmount,filamentSculptDepth;
uniform float filamentSculptLight,filamentSculptShadow,filamentSculptPuff;
uniform float filamentStitchAmount,filamentStitchSpeed;
uniform float filamentStitchLength,filamentStitchGlow;
uniform float filamentNap,filamentLuster,filamentBeads,filamentBeadSize,filamentSecondHue;
uniform float filamentCrossbreed,filamentInterlace,filamentTwist,filamentPhase;
uniform float filamentAmount,filamentScale,filamentDensity,filamentMotion;
uniform float filamentWidth,filamentRelief,filamentHue,filamentVariation;

vec3 filamentField(vec3 background,vec2 uv,vec2 fieldP,float fieldV,
    int species,int fiberMaterial,int adornmentMode,float phaseOffset,float twist,float hueOffset,
    out float maskCore){
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
  float density=filamentDensity;
  float seedPhase=filamentVariation*6.28318+seed*.000013+phaseOffset*.61;
  float threadD=1.0,phase=0.0,mask=1.0,highlight=0.0;
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
  }else{
    // The branch is intentionally unreachable for validated species IDs.
    threadD=1.0;
    mask=0.0;
  }
  // Signed-distance-like threads: sharp high-resolution core, wider translucent
  // halo and directional raised relief. The majority of pixels stay untouched.
  float aa=max(.005,1.2*freq/min(res.x,res.y));
  float width=.009+filamentWidth*.070;
  float core=(1.0-smoothstep(width,width+aa,threadD))*mask;
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
  float pigmentPhase=fract(phase*.17+filamentHue*.88+hueOffset+
    seedPhase*.047+ct*(.023+.017*filamentMotion)+fieldV*.06);
  vec3 ink=palette(pigmentPhase);
  vec3 glimmer=palette(fract(pigmentPhase+.23+.16*filamentRelief));
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
#endif
  float amount=filamentAmount;
  vec3 result=mix(background,background*.48+thread*1.06,core*amount*.91);
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

#ifdef FILAMENT_ADORNMENT
  // Local phase is attached to the actual moving fiber, not UV-screen dots.
  // The soft radial collar is restricted to the thread's own distance mask.
  float adornClock=time*(.18+filamentAdornmentMotion*1.5)+phaseOffset*.32;
  float adornPhase=phase*(7.0+filamentAdornmentSpacing*27.0)+
    q.x*.29+seedPhase*.17;
  float beadBeat=.5+.5*cos(adornPhase);
  float beadStation=pow(beadBeat,mix(18.0,6.0,filamentAdornmentSize));
  float fiberRadial=threadD/max(width,.003);
  float collar=(1.0-smoothstep(width*.55,
    width*(1.9+filamentAdornmentSize*3.0)+aa,threadD))*mask;
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
  }else{ // Unsupported adornment mode: no accessory rendered.
    trinket=0.0;
    sparkle=0.0;
  }
  // Paint trinkets on real filament geometry, obeying stitch-reveal and
  // each parent's individual material/geometry. No full-frame sticker pass.
  vec3 accent=palette(fract(pigmentPhase+colorShift));
  float jewelry=collar*filamentAdornmentAmount;
  float opacity=clamp(jewelry*trinket,0.0,.9);
  result=mix(result,result*.46+accent*.94,opacity*.78);
  result+=mix(accent,vec3(1.0,.98,1.0),.67)*
    jewelry*sparkle*filamentAdornmentGlow*.59;
  result*=1.0-clamp(jewelry*shadow*.3,0.0,.25);
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
  float firstCore=0.0;
  vec3 first=filamentField(background,uv,fieldP,fieldV,
    filamentSpecies,filamentMaterial,filamentAdornmentMode,0.0,0.0,0.0,firstCore);
#ifdef FILAMENT_HYBRID
  if(filamentCrossbreed<.001)return first;
  float secondCore=0.0;
  vec3 second=filamentField(first,uv,fieldP,fieldV,
    filamentSecondSpecies,filamentSecondMaterial,filamentSecondAdornmentMode,
    filamentPhase*6.2831853,filamentTwist*6.2831853,
    filamentSecondHue*.9,secondCore);
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
