// Curated optical specimens and lock-aware remixes. No new renderer state.
import {mathematicalGlassPresets,mathematicalGlassModes,applySchlierenPreset,shuffleMathematicalGlass,glassCouplingControls,glassMaterialControls,glassTransportControls,mathematicalGlassControls} from "./schlieren-glass.js";
export const glassLabGroups=[
 {id:"architecture",label:"Architecture & scale",keys:["schlierenMode","schlierenScale","schlierenFocus","schlierenMask","schlierenVariation"]},
 {id:"interior",label:"Etching & relief",keys:["schlierenEtching",...mathematicalGlassControls]},
 {id:"motion",label:"Optical motion",keys:["schlierenMotion","schlierenRipple","schlierenKinetics"]},
 {id:"coupling",label:"Second optical field",keys:glassCouplingControls},
 {id:"material",label:"Material & finish",keys:glassMaterialControls},
 {id:"transport",label:"Focal lighting",keys:glassTransportControls},
 {id:"strength",label:"Presence & dispersion",keys:["schlierenAmount","schlierenBend","schlierenDispersion","schlierenRim"]},
];
const shared={schlierenLayerAmount:66,schlierenLayerAngle:42,schlierenLayerRatio:56,
 schlierenMaterialAmount:82,schlierenFilmThickness:58,schlierenMicrograin:32,schlierenPolish:82,
 schlierenTransportAmount:76,schlierenLightFocus:62,schlierenLightSharpness:73,schlierenOpticalShadow:36};
const specimens=[
 ["Alien silica slide","Silica frustules","Fractal silica","Section sweep","Nested silica lattice","Superposition","Opalescent silica","Darkfield microscopy","Fine perforated-looking silica ribs and pale spectral light.",{schlierenDetail:93,schlierenScale:53,schlierenOpticalShadow:66}],
 ["Penrose light engine","Quasicrystal glass","Decagonal interference","Phason shear","Quasicrystal counterlattice","Beat envelope","Dichroic film","Spectral focal split","Countermoving quasiperiodic lattices and colored focal networks.",{schlierenLayerRatio:66,schlierenDispersion:93,schlierenLayerAngle:29}],
 ["Gyroid ghost cathedral","Gyroid membranes","Schwarz diamond","Section sweep","Interpenetrating gyroids","Differential relief","Black spectral obsidian","Fold caustic web","Dark interlocking membrane slices with bright caustic edges.",{schlierenOpticalShadow:68,schlierenLightFocus:80,schlierenLayerAmount:82}],
 ["Prismatic circuit board","Triangular prism tessellation","Interlocking waveguides","Optical conveyor","Crossed crystal gratings","Phase modulation","Polished prism","Luminous waveguides","Angular light paths that travel through a geometric network.",{schlierenDetail:87,schlierenMotion:90,schlierenPolish:94}],
 ["Fresnel vault","Hexagonal lens vaults","Fresnel zone plates","Standing-wave breath","Harmonic lens mesh","Superposition","Birefringent crystal","Astigmatic focal lines","Nested lenses with directional double images and breathing rings.",{schlierenBend:77,schlierenFilmThickness:80,schlierenLayerRatio:39}],
 ["Impossible moire machine","Diffraction grating glass","Moiré diffraction","Grating precession","Crossed crystal gratings","Beat envelope","Dichroic film","Spectral focal split","Slipping fine gratings produce large traveling interference beats.",{schlierenLayerRatio:36,schlierenLayerAngle:5,schlierenMotion:76}],
 ["Mercury hyperlattice","Kaleidoscopic microfacets","Dodecagonal lattice","Phase counterflow","Chiral wave collision","Differential relief","Liquid mercury glass","Cusp glints","Metallic microfacets and bright focal junctions in motion.",{schlierenPolish:96,schlierenLightSharpness:91,schlierenRipple:44}],
 ["Etched glass labyrinth","Nested polygon chambers","Interlocking waveguides","Optical conveyor","Nested silica lattice","Phase modulation","Iridescent etched enamel","Luminous waveguides","Fine nested chambers with moving luminous optical tracks.",{schlierenDetail:96,schlierenStructure:92,schlierenMicrograin:59}],
 ["Frozen diffraction fossil","Silica frustules","Dodecagonal lattice","Standing-wave breath","Single field","Superposition","Frosted microglass","Darkfield microscopy","Soft frosted transmission with crisp microscopic focal lines.",{schlierenMotion:39,schlierenPolish:24,schlierenMicrograin:83,schlierenTransportAmount:85}],
 ["Quiet crystalline ink","Nested polygon chambers","Native architecture","Original drift","Single field","Superposition","Original glass","Cusp glints","A quieter, low-intensity geometric overlay that leaves more art visible.",{schlierenAmount:48,schlierenBend:32,schlierenDispersion:35,schlierenTransportAmount:38,schlierenMotion:42,schlierenRim:38}],
];
export const opticalSpecimens=specimens.map(([name,mode,etching,kinetics,coupling,rule,material,transport,note,extra])=>({name,note,settings:{
 ...shared,schlierenMode:mode,schlierenEtching:etching,schlierenKinetics:kinetics,
 schlierenCoupling:coupling,schlierenCouplingRule:rule,schlierenMaterial:material,schlierenTransport:transport,...extra}}));
const unit=rng=>{const n=Number(rng());return Number.isFinite(n)?Math.max(0,Math.min(1-Number.EPSILON,n)):0;};
const pick=(xs,rng)=>xs[Math.floor(unit(rng)*xs.length)];
export function glassLabLockedKeys(locks=[]){
 return new Set(glassLabGroups.filter(g=>locks.includes(g.id)).flatMap(g=>g.keys));
}
function protect(state,candidate,locks){
 const locked=glassLabLockedKeys(locks);
 const result={...state};
 for(const g of glassLabGroups)for(const k of g.keys)if(!locked.has(k)&&Object.hasOwn(candidate,k))result[k]=candidate[k];
 return result;
}
export function applyOpticalSpecimen(state,name,locks=[]){
 const specimen=opticalSpecimens.find(p=>p.name===name);
 if(!specimen)return state;
 const preset=mathematicalGlassPresets.find(p=>p.schlierenMode===specimen.settings.schlierenMode);
 return protect(state,{...applySchlierenPreset(state,preset.name),...specimen.settings},locks);
}
export function remixOpticalLab(state,rng=Math.random,{locks=[],style="Curated",intensity="Wild"}={}){
 const available=glassLabGroups.filter(g=>!locks.includes(g.id));
 if(!available.length)return state;
 let next=state;
 if(style==="Curated"){
   const specimen=pick(opticalSpecimens,rng);
   next=applyOpticalSpecimen(state,specimen.name,locks);
 }else{
   next=protect(state,shuffleMathematicalGlass(state,rng),locks);
 }
 // In gentle mode keep all numeric settings near their current values;
 // mode selections remain discrete. Strong modes retain their full range.
 const blend=intensity==="Gentle"?.36:intensity==="Balanced"?.70:1;
 if(blend<1){
   const locked=glassLabLockedKeys(locks);
   for(const g of available)for(const k of g.keys){
     if(!locked.has(k)&&typeof next[k]==="number"&&Number.isFinite(state[k])){
       next[k]=Math.max(0,Math.min(100,state[k]+(next[k]-state[k])*blend));
     }
   }
 }
 return next;
}
export function glassLabNotice(state,locks=[]){
 if(locks.length===glassLabGroups.length)return "All seven layers are locked. Unlock one to remix.";
 if(locks.includes("architecture")&&!mathematicalGlassModes.includes(state.schlierenMode))return "Architecture is locked to a classic glass mode. Some mathematical layers will remain dormant.";
 if(locks.includes("strength")&&!(state.schlierenAmount>0))return "Presence is locked at zero. Unlock presence or raise it to see the result.";
 return "";
}
