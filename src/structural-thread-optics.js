/**
 * STRUCTURAL COLOR OPTICS — independent thread-local optical coats for both
 * textile parents. Never renumber or replace any of the 14 base fiber materials.
 * This model uses pseudo-view/curvature proxies in a flat WebGL artboard, not
 * physically calibrated thin-film interference or measured diffraction.
 */
export const structuralOpticsModes=[
  "Off",
  "Soap-film opal",
  "Pearlescent floss",
  "Diffraction grating",
  "Anisotropic chrome",
  "Holographic organza",
  "Bioluminescent nacre",
  "Quantum mother-of-pearl",
];
export const structuralOpticsDescriptions={
  Off:"No structural-color calculations. Underlying fiber dressing remains identical.",
  "Soap-film opal":"Thin-film interference with curvature-sensitive prismatic rims and pearl sheen.",
  "Pearlescent floss":"A soft nacre body with grazing-angle spectral fiber ribbons.",
  "Diffraction grating":"Micro-groove line interference and razor-bright iridescent combs.",
  "Anisotropic chrome":"Directionally brushed metallic flashes that run along the thread.",
  "Holographic organza":"Angle- and phase-sensitive dichroic textile gloss with doubled spectra.",
  "Bioluminescent nacre":"Gentle nacreous layers with fluorescent chroma traveling inside fibers.",
  "Quantum mother-of-pearl":"Multiple competing pseudo-optical interference bands on raised yarn.",
};
const parameters=[
  ["Amount","Amount"],
  ["Thickness","Thickness"],
  ["Dispersion","Dispersion"],
  ["Anisotropy","Anisotropy"],
  ["Curvature","Curvature"],
  ["Pearl","Pearl"],
  ["Phase","Phase"],
];
export const structuralOpticsFirstControls=parameters.map(([,key])=>"filamentOptics"+key);
export const structuralOpticsSecondControls=parameters.map(([,key])=>"filamentSecondOptics"+key);
const specimen=(name,first,second,amount,thickness,dispersion,anisotropy,curvature,pearl,phase)=>({
  name,filamentOpticsMode:first,filamentSecondOpticsMode:second,
  filamentOpticsAmount:amount,
  filamentOpticsThickness:thickness,
  filamentOpticsDispersion:dispersion,
  filamentOpticsAnisotropy:anisotropy,
  filamentOpticsCurvature:curvature,
  filamentOpticsPearl:pearl,
  filamentOpticsPhase:phase,
  filamentSecondOpticsAmount:Math.max(45,amount-8),
  filamentSecondOpticsThickness:(thickness+37)%101,
  filamentSecondOpticsDispersion:Math.min(100,dispersion+12),
  filamentSecondOpticsAnisotropy:(anisotropy+29)%101,
  filamentSecondOpticsCurvature:(curvature+19)%101,
  filamentSecondOpticsPearl:Math.min(100,pearl+15),
  filamentSecondOpticsPhase:(phase+43)%101,
});
export const structuralOpticsPresets=[
  specimen("Abalone ghost thread","Soap-film opal","Pearlescent floss",94,67,75,48,72,83,11),
  specimen("Peacock nacre brocade","Pearlescent floss","Diffraction grating",91,55,78,71,58,99,26),
  specimen("Diffraction guillotine","Diffraction grating","Anisotropic chrome",98,88,99,92,65,33,74),
  specimen("Anodized spider silk","Anisotropic chrome","Soap-film opal",94,52,73,99,45,49,35),
  specimen("Holographic bridal fungus","Holographic organza","Bioluminescent nacre",96,79,94,72,83,76,61),
  specimen("Biophoton pearl rot","Bioluminescent nacre","Quantum mother-of-pearl",95,64,86,55,91,99,44),
  specimen("Quantum soap disaster","Quantum mother-of-pearl","Holographic organza",100,99,99,96,100,91,90),
];
export function applyStructuralOpticsPreset(state,name){
  const chosen=structuralOpticsPresets.find(p=>p.name===name);
  if(!chosen)return state;
  const {name:label,...optics}=chosen;
  return {...state,...optics,filamentAmount:Math.max(62,state.filamentAmount||0)};
}
function randomUnit(rng){
  const n=Number(rng());
  return Number.isFinite(n)?Math.max(0,Math.min(.999999,n)):0;
}
export function remixStructuralOptics(state,rng=Math.random,parent="both",weird=false){
  const pool=weird?structuralOpticsModes.slice(3):structuralOpticsModes.slice(1);
  const choose=old=>{
    const available=pool.filter(mode=>mode!==old);
    return available[Math.floor(randomUnit(rng)*(available.length||pool.length))]||pool[0];
  };
  const result={...state,filamentAmount:Math.max(68,state.filamentAmount||0)};
  for(const prefix of parent==="first"?["filamentOptics"]:
      parent==="second"?["filamentSecondOptics"]:["filamentOptics","filamentSecondOptics"]){
    result[prefix+"Mode"]=choose(result[prefix+"Mode"]);
    result[prefix+"Amount"]=weird?83+randomUnit(rng)*17:60+randomUnit(rng)*40;
    result[prefix+"Thickness"]=20+randomUnit(rng)*80;
    result[prefix+"Dispersion"]=30+randomUnit(rng)*70;
    result[prefix+"Anisotropy"]=randomUnit(rng)*100;
    result[prefix+"Curvature"]=randomUnit(rng)*100;
    result[prefix+"Pearl"]=randomUnit(rng)*100;
    result[prefix+"Phase"]=randomUnit(rng)*100;
  }
  return result;
}
export function disableStructuralOptics(state,parent="both"){
  return {...state,
    ...(parent!=="second"?{filamentOpticsAmount:0,filamentOpticsMode:"Off"}:{}),
    ...(parent!=="first"?{filamentSecondOpticsAmount:0,filamentSecondOpticsMode:"Off"}:{})};
}
export function swapStructuralOptics(state){
  const out={...state};
  for(const key of ["Mode",...parameters.map(([,key])=>key)]){
    out["filamentOptics"+key]=state["filamentSecondOptics"+key];
    out["filamentSecondOptics"+key]=state["filamentOptics"+key];
  }
  return out;
}
