// Mutant Colony Anatomy — opt-in noncircular morphology for painted habitats.
// Species are independent for A and B, with no extra textures or GPU passes.
export const colonyAnatomyModes=[
  "Classic disks","Lichen lobes","Coral fringe","Crystal petals","Hyphal fans",
  "Pennate diatoms","Centric diatoms","Bacillus rods","Coccoid twins",
  "Desmid crescents","Dinoflagellate horns","Radiolarian stars","Silica triangles",
  "Glass hexagons","Ciliate slippers","Budding yeast","Squishy amoebae",
  "Mixed microbial soup","Diatom assemblage","Bacterial culture","Mixed kingdoms",
];
export const colonyPoreModes=["Classic pores","Polka dots","Staggered pits","Diatom striae","Concentric pits","Random freckles","Bacterial dashes","Hollow rings","Radial rosettes","Silica windows","Mixed perforations","Diatom perforation mix"];
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
    colonyAnatomyPores:unit(rng)<.75?19+unit(rng)*72:0,
    colonyPoreMode:pick(colonyPoreModes,rng),
    colonyPoreDensity:18+unit(rng)*78,colonyPoreSize:20+unit(rng)*70,
    colonyAnatomyRim:unit(rng)<.82?31+unit(rng)*69:0,
  };
}

// Injection is limited to active habitat shaders; classic/old shapes
// take the original code path exactly. Source is GLSL ES 1.00 compatible.
export const colonyAnatomyGLSL=`
uniform int colonyShapeA,colonyShapeB;
uniform float colonyAnatomyAmount,colonyAnatomyDetail;
uniform float colonyAnatomyMotion,colonyAnatomyPores,colonyAnatomyRim;
uniform int colonyPoreMode;
uniform float colonyPoreDensity,colonyPoreSize;
// Analytic radial silhouette. Dramatically different forms without
// needing path tessellation, 3D assets, FBO feedback, or frame history.
float mutantColonyRadius(float angle,float index,float parent){
  int species=parent<.5?colonyShapeA:colonyShapeB;
  // Stable for a given seed ordering; no time-based species switching.
  // Only concrete modes reach the radius formulas below.
  if(species==17)species=5+int(mod(index*5.+parent*3.,12.));
  else if(species==18){
    int variant=int(mod(index*3.+parent,5.));
    species=variant==0?5:variant==1?6:variant==2?12:variant==3?13:11;
  }else if(species==19){
    int variant=int(mod(index*3.+parent,5.));
    species=variant==0?7:variant==1?8:variant==2?15:variant==3?16:14;
  }else if(species==20)species=1+int(mod(index*7.+parent*5.,16.));
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
  // New microbes: rotated analytic radial curves, bounded for the
  // existing mask gate. Original species 0–4 retain their exact indices.
  float axis=angle-index*2.399963-parent*.64-t*.035;
  float cs=cos(axis),sn=sin(axis);
  if(species==5){ // elongated pennate silica frustule
    return 1./sqrt(cs*cs/(1.43*1.43)+sn*sn/(.49*.49));
  }
  if(species==6){ // centric diatom with a softly scalloped valve
    float n=10.+floor(detail*18.);
    return 1.+.085*cos(axis*n)+.035*cos(axis*n*2.);
  }
  if(species==7){ // rounded bacterial rod, superellipse approximation
    return min(1.48,pow(pow(abs(cs)/1.43,4.)+pow(abs(sn)/.47,4.),-.25));
  }
  if(species==8){ // dividing pair, figure-eight waist
    return .57+.70*pow(abs(cs),2.)+.07*cos(axis*4.);
  }
  if(species==9){ // desmid crescent / asymmetric curved cell
    return clamp(.83+.28*cos(axis)+.25*cos(axis*2.+.85)+.12*sin(axis*3.),.39,1.42);
  }
  if(species==10){ // horned dinoflagellate
    return .62+.77*pow(max(0.,cos(axis*3.+.44*sin(axis))),7.);
  }
  if(species==11){ // radiolarian star with strong tapered spines
    float n=5.+floor(detail*9.);
    return .55+.85*pow(max(0.,cos(axis*n)),4.);
  }
  if(species==12 || species==13){ // rounded triangular / hexagonal frustules
    float n=species==12?3.:6.;
    float sector=TAU/n;
    float p=mod(axis+sector*.5,sector)-sector*.5;
    return clamp(.70/max(.5,cos(p)),.70,1.40);
  }
  if(species==14){ // asymmetric slipper ciliate
    float ellipse=1./sqrt(cs*cs/(1.37*1.37)+sn*sn/(.66*.66));
    return clamp(ellipse*(1.+.15*sin(axis)+.10*cos(axis*3.)),.42,1.47);
  }
  if(species==15){ // yeast bud, a connected smaller lobe
    return clamp(.86+.47*pow(max(0.,cs),6.)-.24*pow(abs(sn),8.),.55,1.36);
  }
  if(species==16){ // soft irregular pseudopods
    return clamp(.92+.22*sin(axis*3.+t*.12)+.15*cos(axis*5.-t*.16)+.10*sin(axis*8.),.48,1.42);
  }
  // Hyphal fan: delicate pinched fans and long directional filaments.
  float rays=7.+floor(detail*12.);
  float filaments=pow(max(0.,cos(angle*rays-t*.21
    +.61*sin(angle*2.+t*.17))),10.);
  return clamp(.54+.72*filaments+.09*cos(angle*rays*.5+t*.13),.46,1.39);
}

// Perforation motifs remove pigment from the same living silhouette.
// No extra passes; all coordinates are local to each colony.
float microbialPore(vec2 cell,float index,float parent,float clockPhase){
  int poreStyle=colonyPoreMode;
  if(poreStyle==10)poreStyle=1+int(mod(index*5.+parent*2.,9.));
  else if(poreStyle==11){
    int variant=int(mod(index*3.+parent,4.));
    poreStyle=variant==0?2:variant==1?3:variant==2?7:9;
  }
  float density=mix(3.,18.,colonyPoreDensity);
  float size=mix(.09,.43,colonyPoreSize);
  float a=index*2.399963+parent*.64;
  vec2 q=mat2(cos(a),-sin(a),sin(a),cos(a))*cell;
  vec2 grid=q*density+vec2(index*.137,clockPhase*.014);
  if(poreStyle==2)grid.x+=.5*mod(floor(grid.y),2.);
  if(poreStyle==3)grid*=vec2(.62,1.75);
  if(poreStyle==4 || poreStyle==8){
    float theta=atan(q.y,q.x);
    grid=vec2(length(q)*density,theta*(3.+floor(colonyPoreDensity*9.))/TAU);
    if(poreStyle==8)grid.y+=.5*mod(floor(grid.x),2.);
  }
  vec2 poreCell=fract(grid)-.5;
  if(poreStyle==5){
    vec2 id=floor(grid);
    float j=fract(sin(dot(id,vec2(127.1,311.7))+index*9.1)*43758.5453);
    float k=fract(sin(dot(id,vec2(269.5,183.3))+index*2.7)*43758.5453);
    poreCell-=vec2(j-.5,k-.5)*.32;
    size*=.45+.6*j;
  }
  float dist=length(poreCell);
  if(poreStyle==6)dist=length(poreCell*vec2(.62,2.3));
  if(poreStyle==7)return 1.-smoothstep(.035,.085,abs(dist-size*.72));
  if(poreStyle==9)dist=max(abs(poreCell.x),abs(poreCell.y));
  return 1.-smoothstep(size*.76,size,dist);
}
`;
