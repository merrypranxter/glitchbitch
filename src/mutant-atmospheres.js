// Four palette-linked, deterministic, opt-in atmospheric materials.
// Reimagined from the artist's own shader vault, not pasted Three.js demos.
// Source sketches (shaderslop_designs/GLITCHY/05-psychedelic-glitch-art):
// prismatic-mycelium_20260623_132723.js, tibetan-nebula_20260617_091030.js,
// neon-heartbeat.js, structural-moire.js.
// All visuals run inside the shared WebGL renderer, including PNG/GIF/MP4.
export const atmosphereModes = [
  "Prismatic mycelium",
  "Mandala gas leak",
  "Heartbeat phosphor",
  "Misprint rosette",
];
export const atmosphereControls = [
  "atmoAmount","atmoScale","atmoDensity","atmoMotion",
  "atmoGlow","atmoHue","atmoVariation",
];
export const atmospherePresets = [
  { name: "Fungal stained glass", atmoMode:atmosphereModes[0], atmoAmount:85,
    atmoScale:53,atmoDensity:76,atmoMotion:64,atmoGlow:83,atmoHue:41,atmoVariation:28 },
  { name: "Luminous hyphal skeleton", atmoMode:atmosphereModes[0], atmoAmount:94,
    atmoScale:70,atmoDensity:91,atmoMotion:82,atmoGlow:99,atmoHue:67,atmoVariation:81 },
  { name: "Nebula breaks the mandala", atmoMode:atmosphereModes[1], atmoAmount:88,
    atmoScale:44,atmoDensity:81,atmoMotion:77,atmoGlow:69,atmoHue:49,atmoVariation:56 },
  { name: "The machine has a pulse", atmoMode:atmosphereModes[2], atmoAmount:91,
    atmoScale:64,atmoDensity:79,atmoMotion:83,atmoGlow:96,atmoHue:83,atmoVariation:17 },
  { name: "CMY registration riot", atmoMode:atmosphereModes[3], atmoAmount:90,
    atmoScale:66,atmoDensity:94,atmoMotion:73,atmoGlow:61,atmoHue:31,atmoVariation:47 },
];
export function applyAtmospherePreset(state, name) {
  const preset=atmospherePresets.find(x=>x.name===name);
  if(!preset)return state;
  const {name:ignored,...settings}=preset;
  return {...state,...settings};
}
export function nextAtmosphereMode(state,rng=Math.random){
  const candidates=atmosphereModes.filter(x=>x!==state.atmoMode);
  const t=Number(rng());
  const index=Math.max(0,Math.min(candidates.length-1,Math.floor((Number.isFinite(t)?t:0)*candidates.length)));
  return {...state,atmoMode:candidates[index],atmoAmount:Math.max(60,state.atmoAmount||0)};
}
export function hideAtmosphere(state) {
  return {...state,atmoAmount:0};
}

// Crossbreed options keep the first-parent workflow intact when second presence=0.
export const hybridAtmosphereControls = [
  "atmoBAmount","atmoBScale","atmoBDensity","atmoBMotion",
  "atmoBGlow","atmoBHue","atmoBVariation",
  "atmoMaskScale","atmoMaskFeather","atmoMaskMotion","atmoMaskVariation",
];
export const hybridAtmospherePresets = [
  {
    name:"Fungal Broadcast Storm",
    atmoMode:"Prismatic mycelium",atmoAmount:88,atmoScale:54,atmoDensity:82,atmoMotion:43,atmoGlow:79,atmoHue:18,atmoVariation:42,
    atmoBMode:"Heartbeat phosphor",atmoBAmount:81,atmoBScale:63,atmoBDensity:86,atmoBMotion:87,atmoBGlow:94,atmoBHue:68,atmoBVariation:71,
    atmoMaskMode:"Cell colonies",atmoBMaskMode:"Inverse first",atmoBBlendMode:"Light bloom",
    atmoMaskScale:58,atmoMaskFeather:32,atmoMaskMotion:67,atmoMaskVariation:54,
  },
  {
    name:"Printed Cosmic Rupture",
    atmoMode:"Mandala gas leak",atmoAmount:83,atmoScale:36,atmoDensity:67,atmoMotion:62,atmoGlow:85,atmoHue:41,atmoVariation:25,
    atmoBMode:"Misprint rosette",atmoBAmount:92,atmoBScale:73,atmoBDensity:90,atmoBMotion:49,atmoBGlow:65,atmoBHue:79,atmoBVariation:81,
    atmoMaskMode:"Bloom iris",atmoBMaskMode:"Inverse first",atmoBBlendMode:"Ink stain",
    atmoMaskScale:42,atmoMaskFeather:41,atmoMaskMotion:38,atmoMaskVariation:81,
  },
  {
    name:"Mycelium Inside The Moon",
    atmoMode:"Mandala gas leak",atmoAmount:90,atmoScale:52,atmoDensity:78,atmoMotion:38,atmoGlow:72,atmoHue:66,atmoVariation:74,
    atmoBMode:"Prismatic mycelium",atmoBAmount:88,atmoBScale:72,atmoBDensity:94,atmoBMotion:64,atmoBGlow:98,atmoBHue:20,atmoBVariation:43,
    atmoMaskMode:"Bloom iris",atmoBMaskMode:"Bloom iris",atmoBBlendMode:"Light bloom",
    atmoMaskScale:58,atmoMaskFeather:66,atmoMaskMotion:49,atmoMaskVariation:72,
  },
  {
    name:"Riso Fungal Infestation",
    atmoMode:"Misprint rosette",atmoAmount:95,atmoScale:65,atmoDensity:85,atmoMotion:40,atmoGlow:66,atmoHue:27,atmoVariation:63,
    atmoBMode:"Prismatic mycelium",atmoBAmount:87,atmoBScale:45,atmoBDensity:90,atmoBMotion:91,atmoBGlow:98,atmoBHue:73,atmoBVariation:30,
    atmoMaskMode:"Fractured mosaic",atmoBMaskMode:"Inverse first",atmoBBlendMode:"Spectral difference",
    atmoMaskScale:76,atmoMaskFeather:22,atmoMaskMotion:52,atmoMaskVariation:85,
  },
  {
    name:"Cardiac Moire Organism",
    atmoMode:"Heartbeat phosphor",atmoAmount:88,atmoScale:48,atmoDensity:92,atmoMotion:69,atmoGlow:92,atmoHue:76,atmoVariation:14,
    atmoBMode:"Misprint rosette",atmoBAmount:86,atmoBScale:68,atmoBDensity:88,atmoBMotion:47,atmoBGlow:91,atmoBHue:22,atmoBVariation:53,
    atmoMaskMode:"Flowing ribbons",atmoBMaskMode:"Cell colonies",atmoBBlendMode:"Over",
    atmoMaskScale:59,atmoMaskFeather:52,atmoMaskMotion:70,atmoMaskVariation:44,
  },
];
export function applyAtmosphereHybridPreset(state,name){
  const preset=hybridAtmospherePresets.find(x=>x.name===name);
  if(!preset)return state;
  const {name:ignored,...settings}=preset;
  return {...state,...settings};
}
export function nextAtmosphereBMode(state,rng=Math.random){
  const candidates=atmosphereModes.filter(x=>x!==state.atmoBMode);
  const n=Number(rng());
  const i=Math.max(0,Math.min(candidates.length-1,Math.floor((Number.isFinite(n)?n:0)*candidates.length)));
  return {...state,atmoBMode:candidates[i],atmoBAmount:Math.max(62,state.atmoBAmount||0)};
}
export function breedAtmospheres(state,rng=Math.random){
  const candidates=atmosphereModes.filter(x=>x!==state.atmoMode);
  const choose=(low=0,high=1)=>{
    const n=Number(rng());
    return low+(high-low)*(Number.isFinite(n)?Math.min(1,Math.max(0,n)):0);
  };
  return {
    ...state,
    atmoAmount:Math.max(65,state.atmoAmount||0),
    atmoBMode:candidates[Math.min(candidates.length-1,Math.floor(choose(0,candidates.length)))],
    atmoBAmount:choose(60,97),atmoBScale:choose(19,91),atmoBDensity:choose(36,98),
    atmoBMotion:choose(23,94),atmoBGlow:choose(43,100),atmoBHue:choose(0,100),
    atmoBVariation:choose(0,100),
  };
}
export function swapAtmosphereParents(state){
  const fields=["Mode","Amount","Scale","Density","Motion","Glow","Hue","Variation"];
  const out={...state};
  for(const key of fields){
    const a="atmo"+key,b="atmoB"+key;
    out[a]=state[b];out[b]=state[a];
  }
  return out;
}
export function hideAtmospherePair(state){
  return {...state,atmoAmount:0,atmoBAmount:0};
}
export function specializeAtmosphereVariant(mode,secondary=false){
  const id=Math.max(0,atmosphereModes.indexOf(mode));
  let shader=atmosphereGLSL.replace("/* ATMOSPHERE_VARIANT */","#define ATMO_MODE "+id);
  if(secondary){
    shader=shader.replace(/\batmo(Amount|Scale|Density|Motion|Glow|Hue|Variation)\b/g,
      (_all,key)=>"atmoB"+key).replace(/\blivingMutantAtmosphere\b/g,"livingMutantAtmosphereB");
  }
  return shader;
}

export const atmosphereGLSL = `
/* ATMOSPHERE_VARIANT */
uniform float atmoAmount,atmoScale,atmoDensity,atmoMotion,atmoGlow,atmoHue,atmoVariation;

vec3 livingMutantAtmosphere(vec3 original,vec2 uv,vec2 p,float fieldValue){
  float t=time*(.12+atmoMotion*1.18);
  vec2 aspect=vec2(res.x/res.y,1.);
  vec2 q=(uv-.5)*aspect*(2.6+atmoScale*8.4);
  q+=vec2(sin(atmoVariation*8.3),cos(atmoVariation*6.1))*.37;
  float body=0.,rims=0.,spark=0.,shadow=0.;
  vec3 displayMask=vec3(1.);
#if ATMO_MODE == 0
  // Prismatic mycelium: mathematical gyroid section, capillary network and
  // spore pearls. Animating the coordinates keeps growth continuous.
  vec2 z=q+.23*vec2(sin(q.y*1.3+t*.53),cos(q.x*1.2-t*.39));
  float g=sin(z.x*2.12+t*.31)*cos(z.y*2.38-t*.21)
         +sin(z.y*2.38-t*.21)*cos(z.x*2.12+t*.31);
  float glass=exp(-abs(g)*(4.5+atmoDensity*8.));
  float capillary=sin(z.x*(5.+atmoDensity*5.)+2.2*sin(z.y*1.36+t*.6));
  float thread=exp(-abs(capillary)*(9.+atmoDensity*20.));
  float stems=sin(z.y*8.+sin(z.x*2.-t*.3)*2.4);
  float cross=exp(-abs(stems)*(13.+atmoDensity*12.));
  vec2 cell=floor(z*3.4),local=fract(z*3.4)-.5;
  float spore=exp(-length(local-vec2(hash(cell+4.)-.5,hash(cell+8.)-.5)*.4)
    *(12.+atmoDensity*11.))*step(.84,hash(cell+21.));
  body=clamp(glass*.65+thread*.34+cross*.18+spore*.65,0.,1.);
  rims=pow(clamp(1.-abs(g)*2.,0.,1.),4.);
  spark=spore*(.65+.35*sin(t*2.+hash(cell)*TAU));
  shadow=clamp((1.-glass)*.26,0.,.26);
#elif ATMO_MODE == 1
  // The leaking nebula: an angular lotus / diamond constraint fights a
  // continuously animated noise volume (not an unbounded raymarch).
  float rad=length(q*.55),ang=atan(q.y,q.x);
  float petals=7.+floor(atmoDensity*11.);
  float lotus=cos(ang*petals+t*.15)*.15;
  float boundary=rad-(.62+lotus+.06*sin(t*.3));
  float shell=exp(-abs(boundary)*(8.+atmoDensity*15.));
  vec2 flow=q*.67+vec2(.43*sin(t*.17),t*.15);
  float cloud=fbm(flow+vec2(fbm(flow*1.2+t*.07),fbm(flow*1.1-t*.09)));
  float constrained=1.-smoothstep(-.24,.65,boundary);
  float escaping=exp(-abs(boundary)*3.5)*smoothstep(.31,.88,cloud);
  float square=max(abs(q.x),abs(q.y))*.46;
  float frame=exp(-abs(square-.89)*(16.+atmoDensity*17.));
  body=clamp((cloud*.75+shell*.56)*constrained+escaping*.8+frame*.32,0.,1.);
  rims=clamp(shell*.85+frame*.46,0.,1.);
  spark=pow(clamp(cloud,0.,1.),4.)*(.3+.7*shell);
  shadow=constrained*.22*(1.-cloud);
#elif ATMO_MODE == 2
  // Double heartbeat, three detuned optical carriers and true screen-space
  // phosphor masks. No discontinuous temporal frame jumps.
  float beat=pow(max(0.,sin(t*5.2)),12.);
  beat+=.48*pow(max(0.,sin(t*5.2-1.24)),18.);
  beat=clamp(beat,0.,1.);
  vec2 w=q*(1.-beat*.065);
  float r1=length(w+vec2(.23*sin(t*.27),.26*cos(t*.23)));
  float r2=length(w+vec2(.31*cos(t*.21),.19*sin(t*.3)));
  float r3=length(w+vec2(.24*sin(t*.33),-.25*cos(t*.24)));
  float freq=18.+atmoDensity*38.;
  float pulseR=sin(r1*freq-t*2.4);
  float pulseG=sin(r2*(freq*1.023)-t*2.29);
  float pulseB=sin(r3*(freq*.975)-t*2.52);
  float moire=(pulseR*pulseG+pulseG*pulseB+pulseR*pulseB)/3.;
  float pitch=max(1.,res.y/(95.+atmoDensity*175.));
  float triad=mod(floor(gl_FragCoord.x/pitch),3.);
  displayMask=vec3(triad<.5?1.:.25,
    triad>.5&&triad<1.5?1.:.25,
    triad>1.5?1.:.25);
  float screenStripe=.65+.35*sin(gl_FragCoord.y/pitch*PI);
  float mask=mix(.38,1.,step(.5,triad))*screenStripe;
  body=clamp((.5+.45*moire)*mask*(.78+beat*.43),0.,1.);
  rims=pow(.5+.5*sin((r1+r2)*freq*.48-t*2.),6.);
  spark=beat*rims;
  shadow=(1.-screenStripe)*.14;
#elif ATMO_MODE == 3
  // Four angled, slightly misregistered spot / line screens move at unequal
  // frequencies, creating large-scale CMY rosettes instead of static grain.
  vec2 z=q+vec2(.11*sin(t*.29),.09*cos(t*.34));
  float chirp=14.+atmoDensity*35.+length(z)*5.;
  vec2 a=rotate(.26+t*.006)*z;
  vec2 b=rotate(1.22-t*.008)*z;
  vec2 c=rotate(-.68+t*.005)*z;
  vec2 d=rotate(.83-t*.003)*z;
  float cm=sin(a.x*chirp+t*.93)*sin(b.y*chirp*1.027-t*.81);
  float yy=sin(c.x*chirp*.972-t*.73)*sin(d.y*chirp*1.051+t*.67);
  vec2 dots=fract(a*(3.+atmoDensity*8.))-vec2(.5);
  float spot=exp(-dot(dots,dots)*(18.+atmoDensity*24.));
  float rosette=.5+.5*cm*yy;
  body=clamp(rosette*.77+spot*.23,0.,1.);
  rims=pow(rosette,5.);
  spark=spot*pow(rosette,3.);
  shadow=(1.-rosette)*.26;
#endif
  // Pure palette-derived pigment: never locks users to a particular color set.
  vec3 pigment=palette(fract(atmoHue+.17*fieldValue+
    .08*dot(q,vec2(.43,-.27))+.012*t+atmoVariation*.27));
  vec3 highlight=palette(fract(atmoHue+.25+atmoVariation*.21+.02*t));
  pigment*=mix(vec3(1.),displayMask,(atmoDensity*.46+.25));
  float amount=clamp(atmoAmount,0.,1.);
  vec3 veiled=original*(1.-body*.38-shadow*.25)
    +pigment*body*(.35+.42*atmoGlow);
  vec3 result=mix(original,veiled,amount*.88);
  result+=amount*(.25+.65*atmoGlow)*
    (pigment*rims*.21+highlight*spark*.28);
  return clamp(result,vec3(0.),vec3(2.));
}
`;
