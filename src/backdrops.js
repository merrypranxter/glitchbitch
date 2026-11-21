// Palette-linked moving backgrounds; no new GPU passes, textures or clocks.
export const backdropModes=[
  "Nebula veils",
  "Cosmic pollen",
  "Caustic undercurrent",
  "Ghost architecture",
  "Phosphor jacquard",
  "Opal cell fog",
  "Smog cathedral",
  "Luminous dustfall",
  "Aurora static",
  "Echo chamber mist",
  "Candle plasma haze",
  "Velvet signal fog",
  "Mold heaven",
  "TV séance",
  "Hallucinogenic wallpaper",
  "Synthetic dusk ooze",
  "Afterimage swamp",
  "Ghost mall aquarium"
];
export const newBackdropModes=backdropModes.slice(6);
export const funkyBackdropModes=backdropModes.slice(12);
export const backdropFamilies=[
  {name:"Original atmospheric landscapes",modes:backdropModes.slice(0,6)},
  {name:"Luminous weather & haunted architecture",modes:backdropModes.slice(6,12)},
  {name:"Funky paranormal atmospheres",modes:backdropModes.slice(12)},
];
export const backdropDescriptions={
  "Smog cathedral":"Dimensional cathedral arches materialize inside rolling volume fog.",
  "Luminous dustfall":"Descending phosphor grains hang between near and far parallax layers.",
  "Aurora static":"Magnetic curtains buckle through glowing optical interference.",
  "Echo chamber mist":"Concentric spatial reflections drift in repeating vapor shells.",
  "Candle plasma haze":"Flickering warm plasma tongues bend behind liquid atmospheric glass.",
  "Velvet signal fog":"Radio-like scan ghosts crawl through fuzzy velvet nap and particulate haze.",
  "Mold heaven":"Branching multi-scale fungal corridors brighten and dissolve.",
  "TV séance":"Ghostly broadcast scanlines pierce a hovering phosphor cloud.",
  "Hallucinogenic wallpaper":"Recursive ornament breathes through shifting wall-sized patterns.",
  "Synthetic dusk ooze":"Thick iridescent sunset strata slowly slither across the horizon.",
  "Afterimage swamp":"Phosphor echoes ripple inside swampy warped geometric reflections.",
  "Ghost mall aquarium":"Abandoned glass corridors fill with refracted aquarium light.",
};
export const backdropPresets=[
  {
    "name": "Nebula Dreamfall",
    "mode": "Nebula veils",
    "backdropAmount": 85,
    "backdropDepth": 45,
    "backdropDensity": 48,
    "backdropMotion": 44,
    "backdropGlow": 59,
    "backdropHue": 17,
    "backdropVariation": 23
  },
  {
    "name": "Galactic Dust Dancer",
    "mode": "Cosmic pollen",
    "backdropAmount": 89,
    "backdropDepth": 56,
    "backdropDensity": 57,
    "backdropMotion": 51,
    "backdropGlow": 64,
    "backdropHue": 30,
    "backdropVariation": 40
  },
  {
    "name": "Underwater Caustic Motion",
    "mode": "Caustic undercurrent",
    "backdropAmount": 93,
    "backdropDepth": 67,
    "backdropDensity": 66,
    "backdropMotion": 58,
    "backdropGlow": 69,
    "backdropHue": 43,
    "backdropVariation": 57
  },
  {
    "name": "Phantom Atrium",
    "mode": "Ghost architecture",
    "backdropAmount": 97,
    "backdropDepth": 78,
    "backdropDensity": 75,
    "backdropMotion": 65,
    "backdropGlow": 74,
    "backdropHue": 56,
    "backdropVariation": 74
  },
  {
    "name": "Electric Jacquard Haze",
    "mode": "Phosphor jacquard",
    "backdropAmount": 85,
    "backdropDepth": 89,
    "backdropDensity": 84,
    "backdropMotion": 72,
    "backdropGlow": 79,
    "backdropHue": 69,
    "backdropVariation": 91
  },
  {
    "name": "Opal Bubble Chamber",
    "mode": "Opal cell fog",
    "backdropAmount": 89,
    "backdropDepth": 46,
    "backdropDensity": 93,
    "backdropMotion": 79,
    "backdropGlow": 84,
    "backdropHue": 82,
    "backdropVariation": 8
  },
  {
    "name": "Gothic Smog Machine",
    "mode": "Smog cathedral",
    "backdropAmount": 93,
    "backdropDepth": 57,
    "backdropDensity": 54,
    "backdropMotion": 86,
    "backdropGlow": 89,
    "backdropHue": 95,
    "backdropVariation": 25
  },
  {
    "name": "Falling Neon Star Dust",
    "mode": "Luminous dustfall",
    "backdropAmount": 97,
    "backdropDepth": 68,
    "backdropDensity": 63,
    "backdropMotion": 93,
    "backdropGlow": 94,
    "backdropHue": 8,
    "backdropVariation": 42
  },
  {
    "name": "Magnetospheric Disco",
    "mode": "Aurora static",
    "backdropAmount": 85,
    "backdropDepth": 79,
    "backdropDensity": 72,
    "backdropMotion": 46,
    "backdropGlow": 59,
    "backdropHue": 21,
    "backdropVariation": 59
  },
  {
    "name": "Infinite Mirror Fog",
    "mode": "Echo chamber mist",
    "backdropAmount": 89,
    "backdropDepth": 90,
    "backdropDensity": 81,
    "backdropMotion": 53,
    "backdropGlow": 64,
    "backdropHue": 34,
    "backdropVariation": 76
  },
  {
    "name": "Candle Jellyfire",
    "mode": "Candle plasma haze",
    "backdropAmount": 93,
    "backdropDepth": 47,
    "backdropDensity": 90,
    "backdropMotion": 60,
    "backdropGlow": 69,
    "backdropHue": 47,
    "backdropVariation": 93
  },
  {
    "name": "Velvet Signal Possession",
    "mode": "Velvet signal fog",
    "backdropAmount": 97,
    "backdropDepth": 58,
    "backdropDensity": 51,
    "backdropMotion": 67,
    "backdropGlow": 74,
    "backdropHue": 60,
    "backdropVariation": 10
  },
  {
    "name": "Celestial Mildew",
    "mode": "Mold heaven",
    "backdropAmount": 85,
    "backdropDepth": 69,
    "backdropDensity": 60,
    "backdropMotion": 74,
    "backdropGlow": 79,
    "backdropHue": 73,
    "backdropVariation": 27
  },
  {
    "name": "Channel Zero Séance",
    "mode": "TV séance",
    "backdropAmount": 89,
    "backdropDepth": 80,
    "backdropDensity": 69,
    "backdropMotion": 81,
    "backdropGlow": 84,
    "backdropHue": 86,
    "backdropVariation": 44
  },
  {
    "name": "Wallpaper from the Wrong Dimension",
    "mode": "Hallucinogenic wallpaper",
    "backdropAmount": 93,
    "backdropDepth": 91,
    "backdropDensity": 78,
    "backdropMotion": 88,
    "backdropGlow": 89,
    "backdropHue": 99,
    "backdropVariation": 61
  },
  {
    "name": "Toxic Synthetic Sunset",
    "mode": "Synthetic dusk ooze",
    "backdropAmount": 97,
    "backdropDepth": 48,
    "backdropDensity": 87,
    "backdropMotion": 95,
    "backdropGlow": 94,
    "backdropHue": 12,
    "backdropVariation": 78
  },
  {
    "name": "Phosphor Ghost Marsh",
    "mode": "Afterimage swamp",
    "backdropAmount": 85,
    "backdropDepth": 59,
    "backdropDensity": 48,
    "backdropMotion": 48,
    "backdropGlow": 59,
    "backdropHue": 25,
    "backdropVariation": 95
  },
  {
    "name": "Abandoned Aquarium Mall",
    "mode": "Ghost mall aquarium",
    "backdropAmount": 89,
    "backdropDepth": 70,
    "backdropDensity": 57,
    "backdropMotion": 55,
    "backdropGlow": 64,
    "backdropHue": 38,
    "backdropVariation": 12
  }
];
export function applyBackdropPreset(state,name){
  const p=backdropPresets.find(x=>x.name===name);
  if(!p)return state;
  const {name:unused,mode,...params}=p;
  return {...state,backdropMode:mode,...params};
}
export function remixBackdrop(state,rng=Math.random,selection="all"){
  const n=Number(rng());
  const value=Number.isFinite(n)?Math.max(0,Math.min(1-Number.EPSILON,n)):0;
  const modes=selection==="funky"?funkyBackdropModes:
    selection==="new"?newBackdropModes:backdropModes;
  const candidates=modes.filter(mode=>mode!==state.backdropMode);
  const pool=candidates.length?candidates:modes;
  const selected=pool[Math.floor(value*pool.length)];
  const preset=backdropPresets.find(p=>p.mode===selected);
  return preset?applyBackdropPreset(state,preset.name):state;
}
// The background is already cached per selected mode in the renderer;
// extracting its branch avoids passing 18 atmospheres to mobile Safari.
export function specializeBackdropGLSL(source,id){
  if(!Number.isInteger(id)||id<0||id>=backdropModes.length)return source;
  const opener=i=>i===0?"  if(backdropMode==0){":
    "  }else if(backdropMode=="+i+"){";
  const starts=backdropModes.map((_,i)=>source.indexOf(opener(i)));
  if(starts.some((v,i)=>v<0||(i>0&&v<=starts[i-1])))return source;
  const fallback=source.indexOf("  }else{ // Unsupported backdrop mode",starts[starts.length-1]);
  const end=source.indexOf("  float primary=clamp(",fallback);
  if(fallback<0||end<=fallback)return source;
  const stop=id===starts.length-1?fallback:starts[id+1];
  const body=source.slice(starts[id]+opener(id).length,stop);
  return source.slice(0,starts[0])+
    "  if(backdropMode=="+id+"){"+body+
    source.slice(fallback,end)+source.slice(end);
}
export const backdropGLSL="\n// Living negative-space underpainting: palette-derived, stereo-like far/near motion.\n// Deliberately bounded procedural fields; 18 distinctive visual species.\nuniform int backdropMode;\nuniform float backdropAmount,backdropDepth,backdropDensity,backdropMotion;\nuniform float backdropGlow,backdropHue,backdropVariation;\nvec3 livingBackdrop(vec3 original, vec2 uv, float fieldValue){\n  if(backdropAmount<.001)return original;\n  float t=time*(.10+backdropMotion*1.42);\n  float ct=colorTime*(.15+backdropMotion*.71);\n  vec2 ar=vec2(res.x/res.y,1.);\n  vec2 u=(uv-.5)*ar;\n  float phase=backdropVariation*6.2831853;\n  float z=2.1+backdropDensity*10.4;\n  vec2 farPlane=u*z+vec2(sin(phase),cos(phase))*.8;\n  farPlane+=backdropDepth*.54*vec2(t*.12,-t*.085);\n  vec2 nearPlane=u*z*1.49+vec2(cos(phase*1.7),sin(phase*.83))*1.1;\n  nearPlane+=backdropDepth*.67*vec2(-t*.16,t*.105);\n  float a=0.,b=0.,detail=0.;\n  if(backdropMode==0){ // Nebula veils, layered deep soft volumes.\n    a=fbm(farPlane*.57+vec2(t*.12,-t*.083));\n    b=fbm(nearPlane*.63-vec2(t*.097,t*.13));\n    detail=.5+.5*sin((a+b)*9.+ct*.33);\n  }else if(backdropMode==1){ // Cosmic pollen, animated particle constellations.\n    vec2 g=nearPlane*1.15;\n    vec2 cell=floor(g),q=fract(g)-.5;\n    vec2 point=(vec2(hash(cell+3.7),hash(cell+14.1))-.5)*.47;\n    float star=1.-smoothstep(.028,.19,length(q-point));\n    a=star;\n    b=1.-smoothstep(.04,.23,length(fract(farPlane*.7)-.5));\n    detail=.5+.5*sin(t*.9+length(q)*16.);\n  }else if(backdropMode==2){ // Caustic undercurrent, flowing thin bright lines.\n    float w=sin(farPlane.x*2.7+sin(farPlane.y*1.7+t*.7)*1.1-t*.51)\n           +cos(farPlane.y*3.8+sin(farPlane.x*1.3-t*.8));\n    a=pow(.5+.5*sin(w*4.+t*.49),9.);\n    b=pow(.5+.5*cos(w*3.1-t*.27),6.);\n    detail=.5+.5*sin(w*2.1+ct*.48);\n  }else if(backdropMode==3){ // Soft translucent ghost architecture.\n    vec2 q=farPlane*.71;\n    float d=6.;\n    for(int i=0;i<4;i++){\n      float n=float(i);\n      vec2 c=vec2(sin(n*2.4+t*.24),cos(n*2.4-t*.19))*.83;\n      float radius=.63+.19*sin(t*.4+n);\n      d=min(d,length(q-c)-radius);\n    }\n    a=1.-smoothstep(-.24,.62,d);\n    b=.5+.5*sin(length(nearPlane)*2.4-t*.35);\n    detail=1.-smoothstep(.05,.45,abs(d));\n  }else if(backdropMode==4){ // Jacquard phosphor: moving luminous woven microfilaments.\n    float threadX=sin(nearPlane.x*12.+.7*sin(farPlane.y*2.+t*.7));\n    float threadY=sin(nearPlane.y*10.+.6*cos(farPlane.x*1.8-t*.6));\n    a=pow(.5+.5*threadX,12.);\n    b=pow(.5+.5*threadY,12.);\n    detail=.5+.5*cos(nearPlane.x*2.-nearPlane.y*1.5+ct*.31);\n  }else if(backdropMode==5){ // Original bubble-cell phantom fog.\n    float n=fbm(farPlane*.58+vec2(t*.12,-t*.09));\n    float m=fbm(nearPlane*.72+vec2(-t*.065,t*.15));\n    a=smoothstep(.28,.64,abs(sin(n*10.+t*.23)));\n    b=pow(1.-abs(sin(m*11.7-t*.37)),3.);\n    detail=.5+.5*sin((n-m)*17.+ct*.26);\n  }else if(backdropMode==6){ // SMOG CATHEDRAL: volumetric gothic vault haze.\n    vec2 g=farPlane*.68;\n    float arches=abs(sin(g.x*2.2+sin(g.y*.9+t*.17)));\n    float vault=cos(g.y*2.8-arches*3.6+t*.28);\n    float haze=fbm(g*.59+vec2(t*.11,-t*.084));\n    a=1.-smoothstep(.08,.44,abs(vault*.6+arches*.5-.34));\n    b=smoothstep(.29,.69,haze);\n    detail=.5+.5*cos(vault*5.3+haze*4.1+ct*.22);\n  }else if(backdropMode==7){ // LUMINOUS DUSTFALL: stratified falling particles.\n    vec2 plane=nearPlane*1.28+vec2(0.,t*.46);\n    vec2 cell=floor(plane),d=fract(plane)-.5;\n    float h=hash(cell+vec2(phase,3.2));\n    vec2 dotPosition=.25*vec2(sin(t*.27+h*6.283),cos(t*.19+h*6.283));\n    float grain=length(d-dotPosition);\n    a=1.-smoothstep(.015,.13,grain);\n    float distant=length(fract(farPlane*.92+vec2(0.,t*.16))-.5);\n    b=1.-smoothstep(.02,.22,distant);\n    detail=.5+.5*sin(t*.69+grain*19.+h*7.);\n  }else if(backdropMode==8){ // AURORA STATIC: magnetospheric ripples.\n    vec2 g=farPlane*.47;\n    float curtain=sin(g.x*1.9+sin(g.y*.69+t*.32)*2.0);\n    float folds=sin(g.y*2.6+curtain*2.1-t*.49);\n    a=pow(.5+.5*curtain,5.)*(.6+.4*folds*folds);\n    b=pow(.5+.5*cos(g.x*4.4+folds*3.-t*.55),8.);\n    detail=.5+.5*sin(folds*4.8+curtain*2.4+ct*.38);\n  }else if(backdropMode==9){ // ECHO CHAMBER MIST: spatial reflection shells.\n    vec2 g=nearPlane*.64;\n    float mirrorWave=sin(g.x*2.3+t*.2)*cos(g.y*1.8-t*.24);\n    float radius=length(g+vec2(.21*sin(t*.3),.16*cos(t*.26)));\n    float echo=cos(radius*(8.+backdropDensity*8.)-t*.68+mirrorWave*2.3);\n    a=pow(.5+.5*echo,8.);\n    b=.5+.5*cos((g.x-g.y)*3.2+mirrorWave*3.3-t*.39);\n    detail=.5+.5*sin(echo*6.+ct*.27);\n  }else if(backdropMode==10){ // CANDLE PLASMA HAZE: flame tongues and wax-like caustics.\n    vec2 g=farPlane*.43;\n    float flame=sin(g.x*3.5+sin(g.y*2.4-t*.63)*1.4);\n    float plume=sin(g.y*3.2+flame*2.5-t*.53);\n    float wax=fbm(nearPlane*.62+vec2(.0,t*.12));\n    a=pow(.5+.5*plume,4.)*(.47+.53*flame*flame);\n    b=pow(.5+.5*cos(wax*8.+t*.29),9.);\n    detail=.5+.5*sin(plume*4.3+flame*2.6+ct*.24);\n  }else if(backdropMode==11){ // VELVET SIGNAL FOG: granular fabric radio ghosts.\n    vec2 g=nearPlane*.8;\n    float nap=sin(g.x*13.2+sin(g.y*2.1+t*.39)*2.0);\n    float noise=sin(g.y*17.-t*.76+nap*1.4);\n    float radio=fbm(farPlane*.41+vec2(t*.08,-t*.14));\n    a=pow(.5+.5*nap,10.)*(.5+.5*noise*noise);\n    b=smoothstep(.29,.71,radio);\n    detail=.5+.5*sin(noise*3.2+radio*5.9+ct*.38);\n  }else if(backdropMode==12){ // MOLD HEAVEN: vascular petri cloud colonies.\n    vec2 g=farPlane*.71;\n    float f=0.,branch=0.,amp=.57;\n    for(int k=0;k<3;k++){\n      f+=amp*sin(g.x*1.7+sin(g.y*1.2+t*.35)*2.0);\n      branch+=amp*cos(g.y*1.9+cos(g.x*.96-t*.29)*2.4);\n      g=mat2(.81,-.59,.59,.81)*g*1.87+vec2(.77,1.11);\n      amp*=.53;\n    }\n    a=pow(.5+.5*cos(f*9.1+t*.31),7.);\n    b=pow(.5+.5*sin(branch*8.2-t*.57),9.);\n    detail=.5+.5*sin((f-branch)*4.4+ct*.37);\n  }else if(backdropMode==13){ // TV SÉANCE: CRT scan ghosts move through fog.\n    vec2 g=nearPlane*.82;\n    float signal=sin(g.y*(23.+backdropDensity*32.)-t*1.24+\n      sin(g.x*1.3+t*.32)*2.1);\n    float spirit=fbm(farPlane*.6+vec2(t*.2,-t*.13));\n    a=pow(.5+.5*signal,13.);\n    b=pow(.5+.5*cos(spirit*10.+g.x*1.2-t*.49),6.);\n    detail=.5+.5*sin(signal*4.8+spirit*3.1+ct*.41);\n  }else if(backdropMode==14){ // HALLUCINOGENIC WALLPAPER: breathing recursive tiling.\n    vec2 g=farPlane*.57;\n    float a1=sin(g.x*2.4+t*.44+sin(g.y*.81)*1.6);\n    float a2=cos(g.y*2.7-t*.31+sin(g.x*.73)*1.8);\n    float rosette=cos((a1+a2)*6.3+t*.21);\n    a=pow(.5+.5*rosette,8.);\n    b=pow(.5+.5*sin((a1-a2)*9.2-t*.65),10.);\n    detail=.5+.5*sin(rosette*5.3+a1*2.1+ct*.26);\n  }else if(backdropMode==15){ // SYNTHETIC DUSK OOZE: thick oil against horizon.\n    vec2 g=farPlane*.42;\n    float horizon=g.y+sin(g.x*1.7-t*.37)*.31;\n    float ooze=sin(horizon*9.+sin(g.x*3.1+t*.4)*2.-t*.65);\n    float flow=cos(g.x*2.3+sin(g.y*2.1-t*.51)*2.2);\n    a=pow(.5+.5*ooze,4.);\n    b=.5+.5*flow*ooze;\n    detail=.5+.5*sin((horizon+flow)*6.4+ct*.2);\n  }else if(backdropMode==16){ // AFTERIMAGE SWAMP: phantom phosphor layer echoes.\n    vec2 g=farPlane*.47;\n    float pond=sin(g.x*2.3+sin(g.y*1.8+t*.32)*2.1);\n    float echo=cos(g.y*3.4-t*.43+pond*2.7);\n    float memory=fbm(nearPlane*.51+vec2(-t*.12,t*.06));\n    a=pow(.5+.5*echo,7.)*(.5+.5*pond*pond);\n    b=smoothstep(.24,.67,memory);\n    detail=.5+.5*cos(memory*8.+echo*2.6+ct*.33);\n  }else if(backdropMode==17){ // GHOST MALL AQUARIUM: underwater glass corridors.\n    vec2 g=nearPlane*.59;\n    float corridor=abs(sin(g.x*2.1+sin(g.y*.91+t*.23)*1.1));\n    float tank=sin(g.y*2.8+sin(g.x*.77-t*.28)*1.9);\n    float caustic=sin((corridor+tank)*6.8-t*.63);\n    a=pow(.5+.5*caustic,9.);\n    b=pow(.5+.5*cos(g.x*4.8+g.y*3.1-t*.49),8.);\n    detail=.5+.5*cos(tank*4.1+corridor*2.7+ct*.3);\n  }else{ // Unsupported backdrop mode: leave the original artwork.\n    return original;\n  }\n  float primary=clamp(a,0.,1.), secondary=clamp(b,0.,1.);\n  float pattern=clamp(primary*.72+secondary*.54,0.,1.);\n  vec3 distant=palette(fract(backdropHue*.93+detail*.34+ct*.012));\n  vec3 nearHue=palette(fract(backdropHue+.36+pattern*.22-ct*.008));\n  vec3 colored=distant*(.39+.63*pattern)+nearHue*\n    backdropGlow*(.08+.53*primary+.42*secondary);\n  // Structure-aware negative space: underlying math stays crisp, but\n  // subdued/empty regions receive visible living depth instead of flat black.\n  float ink=.5+.5*sin(fieldValue*15.6+seed*.00017);\n  float empty=pow(1.-ink,1.15);\n  float layer=backdropAmount*(.28+.72*empty);\n  float depthShade=mix(.80,.36,backdropDepth);\n  vec3 underpainting=original*depthShade+colored*(.85+.49*backdropGlow);\n  return mix(original,underpainting,layer);\n}";
