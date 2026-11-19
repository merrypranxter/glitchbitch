// Mutant Colony Anatomy — opt-in noncircular morphology for painted habitats.
// Species are independent for A and B, with no extra textures or GPU passes.
export const colonyAnatomyModes=[
  "Classic disks","Lichen lobes","Coral fringe","Crystal petals","Hyphal fans",
];
export const colonyAnatomyControls=[
  "colonyAnatomyAmount","colonyAnatomyDetail","colonyAnatomyMotion",
  "colonyAnatomyPores","colonyAnatomyRim",
];
export const colonyAnatomyPresets=[
  {name:"Fractal Thallus Cathedral",
    colonyShapeA:"Lichen lobes",colonyShapeB:"Crystal petals",
    colonyAnatomyAmount:95,colonyAnatomyDetail:76,
    colonyAnatomyMotion:51,colonyAnatomyPores:66,colonyAnatomyRim:74},
  {name:"Coral Signal Reef",
    colonyShapeA:"Coral fringe",colonyShapeB:"Hyphal fans",
    colonyAnatomyAmount:97,colonyAnatomyDetail:87,
    colonyAnatomyMotion:72,colonyAnatomyPores:29,colonyAnatomyRim:83},
  {name:"Glass Spore Lace",
    colonyShapeA:"Crystal petals",colonyShapeB:"Lichen lobes",
    colonyAnatomyAmount:92,colonyAnatomyDetail:49,
    colonyAnatomyMotion:32,colonyAnatomyPores:74,colonyAnatomyRim:96},
  {name:"Mutant Ribbon Plague",
    colonyShapeA:"Hyphal fans",colonyShapeB:"Coral fringe",
    colonyAnatomyAmount:100,colonyAnatomyDetail:92,
    colonyAnatomyMotion:90,colonyAnatomyPores:39,colonyAnatomyRim:84},
];
export function applyColonyAnatomyPreset(state,name){
  const found=colonyAnatomyPresets.find(p=>p.name===name);
  if(!found)return state;
  const {name:ignored,...settings}=found;
  return {...state,...settings};
}
export function clearColonyAnatomy(state){
  return {...state,colonyAnatomyAmount:0,colonyAnatomyPores:0,colonyAnatomyRim:0};
}
const clamp=(value,lo,hi)=>Math.min(hi,Math.max(lo,value));
const unit=rng=>{
  const n=Number(rng());
  return Number.isFinite(n)?clamp(n,0,1-Number.EPSILON):0;
};
const pick=(array,rng)=>array[Math.floor(unit(rng)*array.length)];
// Pure selection: does not alter the seeded layout, palettes, words, engines,
// wars or preexisting force brush. Feeds the existing smart shufflers.
export function shuffleColonyAnatomy(state,rng=Math.random){
  const modeA=pick(colonyAnatomyModes.slice(1),rng);
  const modeB=pick(colonyAnatomyModes.filter(s=>s!==modeA && s!=="Classic disks"),rng);
  return {...state,
    colonyShapeA:modeA,colonyShapeB:modeB,
    colonyAnatomyAmount:59+unit(rng)*41,
    colonyAnatomyDetail:22+unit(rng)*76,
    colonyAnatomyMotion:15+unit(rng)*81,
    colonyAnatomyPores:unit(rng)<.55?19+unit(rng)*72:0,
    colonyAnatomyRim:unit(rng)<.82?31+unit(rng)*69:0,
  };
}

// Injection is limited to active habitat shaders; classic/old shapes
// take the original code path exactly. Source is GLSL ES 1.00 compatible.
export const colonyAnatomyGLSL=`
uniform int colonyShapeA,colonyShapeB;
uniform float colonyAnatomyAmount,colonyAnatomyDetail;
uniform float colonyAnatomyMotion,colonyAnatomyPores,colonyAnatomyRim;
// Analytic radial silhouette. Dramatically different forms without
// needing path tessellation, 3D assets, FBO feedback, or frame history.
float mutantColonyRadius(float angle,float index,float parent){
  int species=parent<.5?colonyShapeA:colonyShapeB;
  if(species==0)return 1.;
  float t=time*(.045+colonyAnatomyMotion*.48)+index*1.21+parent*1.71;
  float detail=colonyAnatomyDetail;
  if(species==1){
    // Foliose thallus: scalloped sheets with a second wavy cortex.
    float lobes=5.+floor(detail*8.);
    return clamp(.88+.24*sin(angle*lobes+t*.28)
      +.11*cos(angle*(lobes*2.+1.)-t*.36),.50,1.36);
  }
  if(species==2){
    // Coral: thin branching tips radiating from a connected central mass.
    float arms=8.+floor(detail*13.);
    float tips=pow(max(0.,cos(angle*arms+t*.25
      +.28*sin(angle*3.+t*.16))),7.);
    return clamp(.62+.71*tips+.06*sin(angle*3.-t*.12),.50,1.40);
  }
  if(species==3){
    // Faceted lens petals: rotating ridges, crystalline gaps.
    float petals=4.+floor(detail*10.);
    float facets=pow(abs(cos(angle*petals*.5+t*.14)),2.5);
    return clamp(.64+.61*facets+.05*cos(angle*petals*2.-t*.23),.55,1.32);
  }
  // Hyphal fan: delicate pinched fans and long directional filaments.
  float rays=7.+floor(detail*12.);
  float filaments=pow(max(0.,cos(angle*rays-t*.21
    +.61*sin(angle*2.+t*.17))),10.);
  return clamp(.54+.72*filaments+.09*cos(angle*rays*.5+t*.13),.46,1.39);
}
`;
