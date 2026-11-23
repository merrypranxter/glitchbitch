// Shader Vault Wave 6 — Crossbreed Lab
// Real paired mathematical interactions, not duplicated passes or shuffled
// presets wearing a fancy label. All GLSL parent diagnostics are reused.

export const breedModes=[
  "Oracle Singularity Brocade",
  "Dissolving Crochet",
  "Velvet Event Horizon",
  "Hexagram Bio-Jacquard",
  "Five-Way Chimera"
];
export const breedParents={
  "Oracle Singularity Brocade":["hexagramAmount","polesAmount"],
  "Dissolving Crochet":["qdAmount","hcrAmount"],
  "Velvet Event Horizon":["polesAmount","vldAmount"],
  "Hexagram Bio-Jacquard":["hexagramAmount","vldAmount"],
  "Five-Way Chimera":[
    "hexagramAmount","polesAmount","qdAmount","vldAmount","hcrAmount"
  ]
};
export const breedControls=[
  "breedAmount","breedCoupling","breedWarp","breedFiligree","breedGlow",
  "breedMotion","breedHue","breedTension","breedVariation","breedResonance"
];
const neededStrength={
  hexagramAmount:65,polesAmount:68,qdAmount:62,vldAmount:70,hcrAmount:56
};
export const breedRequiredParents=mode=>breedParents[mode]||[];
export function breedActive(state){
  return !!state && state.breedAmount>0 &&
    breedRequiredParents(state.breedMode).length>=2 &&
    breedRequiredParents(state.breedMode).every(k=>state[k]>0);
}
export function activateBreed(state,mode=state.breedMode){
  if(!breedParents[mode])return state;
  const next={...state,breedMode:mode,
    breedAmount:Math.max(state.breedAmount||0,66)};
  for(const key of breedParents[mode]){
    if(!(next[key]>0)){
      next[key]=neededStrength[key];
      // Use mobile-safe sampling when activating an otherwise dormant
      // full-scene raymarch; never override an already-active user's choice.
      if(key==="hcrAmount" && mode==="Five-Way Chimera")
        next.hcrQuality=Math.min(next.hcrQuality??35,32);
    }
  }
  return next;
}
export const breedPresets=[
  {name:"Oracle Silk Event Horizon",breedMode:"Oracle Singularity Brocade",
    breedAmount:87,breedCoupling:79,breedWarp:68,breedFiligree:82,
    breedGlow:79,breedMotion:49,breedHue:24,breedTension:38,
    breedVariation:44,breedResonance:86},
  {name:"Chladni Faultline Crochet",breedMode:"Dissolving Crochet",
    breedAmount:91,breedCoupling:91,breedWarp:78,breedFiligree:91,
    breedGlow:88,breedMotion:72,breedHue:83,breedTension:52,
    breedVariation:59,breedResonance:81},
  {name:"Five Roots of Velvet",breedMode:"Velvet Event Horizon",
    breedAmount:96,breedCoupling:85,breedWarp:59,breedFiligree:93,
    breedGlow:96,breedMotion:57,breedHue:67,breedTension:46,
    breedVariation:72,breedResonance:93},
  {name:"Biological Oracle Brocade",breedMode:"Hexagram Bio-Jacquard",
    breedAmount:95,breedCoupling:82,breedWarp:52,breedFiligree:73,
    breedGlow:84,breedMotion:60,breedHue:39,breedTension:68,
    breedVariation:46,breedResonance:77},
  {name:"Five-Way Mutant Cathedral",breedMode:"Five-Way Chimera",
    breedAmount:89,breedCoupling:76,breedWarp:69,breedFiligree:88,
    breedGlow:93,breedMotion:49,breedHue:76,breedTension:63,
    breedVariation:87,breedResonance:87},
  {name:"Opalescent Neuro-Textile",breedMode:"Velvet Event Horizon",
    breedAmount:72,breedCoupling:55,breedWarp:36,breedFiligree:78,
    breedGlow:95,breedMotion:32,breedHue:91,breedTension:70,
    breedVariation:42,breedResonance:61},
  {name:"Ruptured Alien Lace",breedMode:"Dissolving Crochet",
    breedAmount:100,breedCoupling:97,breedWarp:93,breedFiligree:100,
    breedGlow:89,breedMotion:93,breedHue:45,breedTension:34,
    breedVariation:81,breedResonance:100}
];
export function applyBreedPreset(state,name){
  const preset=breedPresets.find(x=>x.name===name);
  if(!preset)return state;
  const {name:_label,...values}=preset;
  return activateBreed({...state,...values},preset.breedMode);
}
const randomUnit=random=>{
  const value=Number(random());
  return Number.isFinite(value)
    ?Math.max(0,Math.min(value,1-Number.EPSILON)):0;
};
export function shuffleBreed(state,random=Math.random){
  const mode=breedModes[Math.floor(randomUnit(random)*breedModes.length)];
  const out={...state,breedMode:mode};
  for(const key of breedControls)
    out[key]=key==="breedAmount"
      ?40+randomUnit(random)*60:randomUnit(random)*100;
  return activateBreed(out,mode);
}
export const hideBreed=state=>({...state,breedAmount:0});

export const breedGLSL = "uniform int breedMode;\nuniform float breedAmount,breedCoupling,breedWarp,breedFiligree,breedGlow;\nuniform float breedMotion,breedHue,breedTension,breedVariation,breedResonance;\n\n// Wave 6: reuses diagnostics computed by five prior Shader Vault families.\n// No duplicate cellular loops, raymarch, textures, or GPU feedback buffers.\n// The field is coupled: parent A changes the effect of parent B on geometry.\nvec4 breedInterlock(inout vec2 p,inout vec4 tissue,\n                   vec4 oracle,vec4 poles,vec4 crystal,vec2 crochet){\n  float t=time*(.025+.19*breedMotion);\n  float variance=TAU*(breedVariation+seed*.00013);\n  vec2 flow=vec2(0.0);\n  float bond=0.0;\n  float fracture=0.0;\n  float phase=0.0;\n\n  if(breedMode==0){\n    // Oracle borders guide a complex-pole angle; no original source\n    // can yield this flow without the OTHER parent's moving phase.\n    phase=TAU*(oracle.x*.81+poles.x*.63)+t*.45+variance;\n    bond=clamp(oracle.y*(.3+.7*poles.y)+oracle.w*poles.w,0.0,1.0);\n    fracture=clamp(oracle.y*(1.0-poles.z)+poles.w*oracle.w,0.0,1.0);\n    flow=vec2(cos(phase),sin(phase))*bond*(.35+.7*breedResonance);\n  }else if(breedMode==1){\n    // The quasicrystal's computed dissolution drives crochet ruffle\n    // deflection; the crochet displacement is real, not a color swatch.\n    phase=TAU*(crystal.x+.23*crystal.w)+t*.41+variance;\n    bond=clamp(crystal.y*(.35+.65*length(crochet))+\n      crystal.z*.5,0.0,1.0);\n    fracture=clamp(crystal.z*(.2+.8*length(crochet)),0.0,1.0);\n    flow=crochet*(.3+1.35*crystal.y)+\n         vec2(cos(phase),sin(phase))*fracture*.41;\n  }else if(breedMode==2){\n    // Actual rendered biological tissue height is changed by the\n    // nearby pole and zero intensities BEFORE velvet shading.\n    phase=TAU*poles.x+t*.37+variance;\n    bond=clamp(poles.y*.8+poles.z*.52,0.0,1.0);\n    fracture=clamp(poles.w*tissue.x*.85,0.0,1.0);\n    float growth=breedAmount*breedCoupling*(poles.z*.77+poles.y*.34);\n    tissue.x=clamp(tissue.x+growth*.72,0.0,2.4);\n    tissue.yz=clamp(tissue.yz+growth*.29*vec2(cos(phase),sin(phase)),\n                    vec2(-1.0),vec2(1.0));\n    flow=vec2(cos(phase),sin(phase))*bond+tissue.yz*.45*fracture;\n  }else if(breedMode==3){\n    // Six binary fields seed biological proliferation specifically\n    // along changing-line borders and shared terrain levels.\n    phase=TAU*(oracle.x*.9+tissue.x*.11)+t*.32+variance;\n    bond=clamp(oracle.y*(.44+.56*tissue.x*.65),0.0,1.0);\n    fracture=clamp(oracle.w*(.25+.75*tissue.x),0.0,1.0);\n    float growth=breedAmount*breedCoupling*\n      (oracle.y*.69+oracle.w*.41)*(1.0+.24*sin(phase));\n    tissue.x=clamp(tissue.x+growth*.77,0.0,2.4);\n    flow=vec2(cos(phase),sin(phase))*bond+\n      tissue.yz*fracture*.37;\n  }else{\n    // The five parents all materially participate: oracle border,\n    // complex zero/pole distances, crystal damage, velvet growth,\n    // and the original ruffled crochet geometry.\n    phase=TAU*(oracle.x*.39+poles.x*.47+crystal.x*.22)+t*.32+variance;\n    float organ=clamp(tissue.x*.48,0.0,1.0);\n    bond=clamp((oracle.y*poles.y+crystal.z*organ+\n      length(crochet)*.41)*(.55+.4*breedResonance),0.0,1.0);\n    fracture=clamp(crystal.y*(oracle.w*.55+poles.w*.45)+\n      organ*poles.z*.47,0.0,1.0);\n    tissue.x=clamp(tissue.x+breedAmount*breedCoupling*\n      (oracle.y*poles.z+crystal.z*.42)*.68,0.0,2.4);\n    flow=crochet*(.33+.65*crystal.y)+\n      vec2(cos(phase),sin(phase))*(oracle.y*poles.y+\n        crystal.z*organ)*(.28+.47*breedResonance);\n  }\n  // Zero when off; bounded in every active mode, even on extreme fields.\n  flow=flow/(1.0+length(flow)*(1.0+.9*breedTension));\n  p+=flow*breedAmount*breedCoupling*(.025+.31*breedWarp);\n  return vec4(fract(phase/TAU),bond,fracture,\n    clamp((bond*.58+fracture*.42)*(.4+.6*breedResonance),0.0,1.0));\n}\nvec3 breedDress(vec3 col,vec4 dna,vec2 p){\n  float phase=dna.x, bond=dna.y, fracture=dna.z, signal=dna.w;\n  float ripples=pow(.5+.5*cos(phase*TAU*(3.0+breedFiligree*13.0)+\n      length(p)*(4.0+breedFiligree*8.0)-\n      time*(.12+.26*breedMotion)),mix(3.0,11.0,breedFiligree));\n  float vitality=breedAmount*breedGlow*signal;\n  vec3 ink=palette(fract(phase*.71+breedHue+.25*fracture+\n    colorTime*.004));\n  vec3 counterInk=palette(fract(breedHue+.37+phase*.5+\n    colorTime*.002));\n  float luminous=vitality*(.13+.58*ripples);\n  col=mix(col,col*(.81+.35*bond)+ink*(.31+.36*fracture),\n    clamp(vitality*(.15+.19*breedResonance),0.0,.42));\n  col+=ink*luminous*.47+counterInk*fracture*vitality*.15;\n  return col;\n}\n";
