// Shader Vault Wave 2: opt-in REAL post-composite UV refraction.
// Source inspiration: shaderslop_designs/prismatic_sigil_glass_20260624_004811.html
// No standalone Three.js, no simulation claiming to be real optics.
export const schlierenModes=[
  "Molten portholes","Filament glass","Prismatic blossoms",
  "Ruffled organza","Schlieren pockets"
];
export const schlierenControls=[
  "schlierenAmount","schlierenScale","schlierenBend","schlierenMotion",
  "schlierenDispersion","schlierenRim","schlierenRipple",
  "schlierenVariation","schlierenMask","schlierenFocus"
];
export const schlierenPresets=[
  {name:"Liquid Lens Choir",schlierenMode:"Molten portholes",
    schlierenAmount:92,schlierenScale:38,schlierenBend:78,
    schlierenMotion:64,schlierenDispersion:42,schlierenRim:71,
    schlierenRipple:74,schlierenVariation:22,schlierenMask:72,schlierenFocus:78},
  {name:"Glass Thread Witch",schlierenMode:"Filament glass",
    schlierenAmount:89,schlierenScale:66,schlierenBend:91,
    schlierenMotion:51,schlierenDispersion:71,schlierenRim:54,
    schlierenRipple:46,schlierenVariation:59,schlierenMask:67,schlierenFocus:55},
  {name:"Crystal Bloom Refraction",schlierenMode:"Prismatic blossoms",
    schlierenAmount:95,schlierenScale:43,schlierenBend:83,
    schlierenMotion:48,schlierenDispersion:97,schlierenRim:93,
    schlierenRipple:62,schlierenVariation:80,schlierenMask:88,schlierenFocus:72},
  {name:"Witch's Organza",schlierenMode:"Ruffled organza",
    schlierenAmount:85,schlierenScale:47,schlierenBend:76,
    schlierenMotion:65,schlierenDispersion:63,schlierenRim:87,
    schlierenRipple:60,schlierenVariation:43,schlierenMask:74,schlierenFocus:64},
  {name:"Heat Ghosts",schlierenMode:"Schlieren pockets",
    schlierenAmount:76,schlierenScale:39,schlierenBend:89,
    schlierenMotion:82,schlierenDispersion:36,schlierenRim:43,
    schlierenRipple:92,schlierenVariation:14,schlierenMask:60,schlierenFocus:61},
];
export function applySchlierenPreset(state,name){
  const preset=schlierenPresets.find(p=>p.name===name);
  return preset?{...state,...Object.fromEntries(Object.entries(preset).filter(([key])=>key!=="name"))}:state;
}
const unit=random=>{
  const n=Number(random());return Number.isFinite(n)?Math.max(0,Math.min(n,1-Number.EPSILON)):0;
};
export function shuffleSchlieren(state,random=Math.random){
  const mode=schlierenModes[Math.floor(unit(random)*schlierenModes.length)];
  const next={...state,schlierenMode:mode};
  for(const key of schlierenControls)
    next[key]=key==="schlierenAmount"?40+unit(random)*60:8+unit(random)*92;
  return next;
}
export const hideSchlieren=state=>({...state,schlierenAmount:0});

export const schlierenFragment = "precision highp float;\nuniform sampler2D artTex;\nuniform vec2 resolution;\nuniform float time;\nuniform int glassMode;\nuniform float glassAmount,glassScale,glassBend,glassMotion;\nuniform float glassDispersion,glassRim,glassRipple,glassVariation;\nuniform float glassMask,glassFocus;\n\nfloat glassHash(vec2 q){return fract(sin(dot(q,vec2(127.1,311.7)))*43758.5453);}\nfloat glassNoise(vec2 q){\n  vec2 c=floor(q),f=fract(q);f=f*f*(3.0-2.0*f);\n  return mix(mix(glassHash(c),glassHash(c+vec2(1.0,0.0)),f.x),\n             mix(glassHash(c+vec2(0.0,1.0)),glassHash(c+1.0),f.x),f.y);\n}\nfloat glassHaze(vec2 q){\n  return .65*glassNoise(q)+.35*glassNoise(q*2.09+vec2(9.4,3.7));\n}\nfloat glassSdf(vec2 p){\n  float t=time*(.16+glassMotion*.8);\n  float detail=glassVariation*6.28318530718;\n  if(glassMode==0){\n    vec2 lattice=p*.87;\n    vec2 cell=fract(lattice+.5)-.5;\n    cell+=.045*vec2(sin(t+floor(lattice.y)*2.1+detail),\n                    cos(t*.9+floor(lattice.x)*1.7+detail));\n    return length(cell)-mix(.20,.39,glassFocus);\n  }\n  if(glassMode==1){\n    float thread=p.y+.20*sin(p.x*2.7+t+detail)\n      +.075*sin(p.x*7.3-t*.7);\n    float group=abs(fract(thread*1.8+.5)-.5);\n    return group-mix(.07,.19,glassFocus);\n  }\n  if(glassMode==2){\n    vec2 cell=fract(p*.72+.5)-.5;\n    float angle=atan(cell.y,cell.x)+t*.14;\n    float petals=6.0+floor(glassVariation*6.0);\n    float r=.29+.13*cos(petals*angle+t*.36);\n    return length(cell)-r*mix(.70,1.15,glassFocus);\n  }\n  if(glassMode==3){\n    vec2 cell=fract(p*.53+.5)-.5;\n    float a=atan(cell.y,cell.x);\n    float scallop=sin(a*(9.0+floor(glassVariation*7.0))+t*.31);\n    float shell=.26+.105*scallop;\n    return abs(length(cell)-shell)-mix(.025,.12,glassFocus);\n  }\n  float h=glassHaze(p*1.3+vec2(t*.15,-t*.08));\n  return abs(h-.5)-mix(.07,.25,glassFocus);\n}\nvoid main(){\n  vec2 uv=gl_FragCoord.xy/resolution;\n  vec2 aspect=vec2(resolution.x/resolution.y,1.0);\n  float t=time*(.15+glassMotion*.72);\n  vec2 p=(uv-.5)*aspect*(1.5+glassScale*5.0);\n  p+=vec2(glassVariation*10.13,-glassVariation*8.41);\n  float haze=glassHaze(p*.71+vec2(t*.11,-t*.13));\n  float sdf=glassSdf(p)+glassRipple*.092*(haze-.5);\n  float eps=.008;\n  float dx=glassSdf(p+vec2(eps,0.0))-glassSdf(p-vec2(eps,0.0));\n  float dy=glassSdf(p+vec2(0.0,eps))-glassSdf(p-vec2(0.0,eps));\n  vec2 normal=normalize(vec2(dx,dy)+vec2(.00001));\n  float core=1.0-smoothstep(-.025,.028,sdf);\n  float rim=1.0-smoothstep(.008,.085,abs(sdf));\n  float localMask=clamp(core+rim*glassMask*.38,0.0,1.0);\n  vec2 flow=vec2(haze-.5,glassNoise(p*.82+vec2(11.3,t*.2))-.5);\n  vec2 displacement=(normal*(.006+.060*glassBend)\n     +flow*(.004+.024*glassRipple))*localMask;\n  // Coordinates are real sampled pixels from the FULL precomposited artwork.\n  // Dividing by aspect keeps the lens circular on portrait and landscape.\n  vec2 shifted=displacement/aspect;\n  vec2 texel=.5/resolution;\n  vec2 coord=clamp(uv+shifted,texel,1.0-texel);\n  vec4 original=texture2D(artTex,uv);\n  vec2 rgbEdge=(normal/aspect)*localMask*glassDispersion*.009;\n  vec3 glass=vec3(\n    texture2D(artTex,clamp(coord+rgbEdge,texel,1.0-texel)).r,\n    texture2D(artTex,coord).g,\n    texture2D(artTex,clamp(coord-rgbEdge,texel,1.0-texel)).b);\n  float fresnel=pow(clamp(.52+.48*dot(normal,normalize(vec2(-.6,.8))),0.0,1.0),3.0);\n  vec3 outColor=mix(original.rgb,glass,glassAmount*localMask);\n  outColor+=glassAmount*glassRim*rim*(.12+.43*fresnel)*vec3(1.0,.96,1.0);\n  gl_FragColor=vec4(clamp(outColor,0.0,1.0),1.0);\n}";
