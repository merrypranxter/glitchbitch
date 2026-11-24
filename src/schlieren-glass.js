// Shader Vault Wave 2: opt-in REAL post-composite UV refraction.
// Source inspiration: shaderslop_designs/prismatic_sigil_glass_20260624_004811.html
// No standalone Three.js, no simulation claiming to be real optics.
export const schlierenModes=[
  "Molten portholes","Filament glass","Prismatic blossoms",
  "Ruffled organza","Schlieren pockets",
  "Silica frustules","Triangular prism tessellation","Hexagonal lens vaults",
  "Quasicrystal glass","Gyroid membranes","Kaleidoscopic microfacets",
  "Nested polygon chambers","Diffraction grating glass"
];
export const mathematicalGlassModes=schlierenModes.slice(5);
export const mathematicalGlassControls=["schlierenStructure","schlierenDetail","schlierenCaustics"];
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
export const mathematicalGlassPresets=mathematicalGlassModes.map((mode,n)=>({name:mode+" · optical architecture",schlierenMode:mode,schlierenAmount:90,schlierenScale:35+n%4*10,schlierenBend:65,schlierenMotion:70+n%3*10,schlierenDispersion:72,schlierenRim:60,schlierenRipple:35,schlierenVariation:27+n*8,schlierenMask:92,schlierenFocus:72,schlierenStructure:78,schlierenDetail:65+n%3*12,schlierenCaustics:68}));
export function applySchlierenPreset(state,name){
  const preset=[...schlierenPresets,...mathematicalGlassPresets].find(p=>p.name===name);
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
  if(mathematicalGlassModes.includes(mode))for(const key of mathematicalGlassControls)next[key]=40+unit(random)*60;
  return next;
}
export function shuffleMathematicalGlass(state,random=Math.random,part="all"){
  if(part==="motion")return {...state,schlierenMotion:45+unit(random)*55,schlierenRipple:15+unit(random)*70};
  if(part==="interior")return {...state,schlierenStructure:50+unit(random)*50,schlierenDetail:20+unit(random)*80,schlierenCaustics:35+unit(random)*65};
  const choices=mathematicalGlassModes.filter(m=>m!==state.schlierenMode);
  const mode=choices[Math.floor(unit(random)*choices.length)];
  const recipe=mathematicalGlassPresets.find(p=>p.schlierenMode===mode);
  const next=applySchlierenPreset(state,recipe.name);
  return {...next,schlierenVariation:unit(random)*100,schlierenScale:25+unit(random)*65,schlierenMotion:45+unit(random)*55,schlierenDetail:30+unit(random)*70};
}
export const hideSchlieren=state=>({...state,schlierenAmount:0});

export const schlierenFragment = "precision highp float;\nuniform sampler2D artTex;\nuniform vec2 resolution;\nuniform float time;\nuniform int glassMode;\nuniform float glassAmount,glassScale,glassBend,glassMotion;\nuniform float glassDispersion,glassRim,glassRipple,glassVariation;\nuniform float glassMask,glassFocus;\nuniform float glassStructure,glassDetail,glassCaustics;\n\nfloat glassHash(vec2 q){return fract(sin(dot(q,vec2(127.1,311.7)))*43758.5453);}\nfloat glassNoise(vec2 q){\n  vec2 c=floor(q),f=fract(q);f=f*f*(3.0-2.0*f);\n  return mix(mix(glassHash(c),glassHash(c+vec2(1.0,0.0)),f.x),\n             mix(glassHash(c+vec2(0.0,1.0)),glassHash(c+1.0),f.x),f.y);\n}\nfloat glassHaze(vec2 q){\n  return .65*glassNoise(q)+.35*glassNoise(q*2.09+vec2(9.4,3.7));\n}\n// Continuous, aspect-correct optical architecture. No radial flower\n// profiles in the new modes. Each field has moving optical geometry.\nconst float GLASS_PI=3.14159265359;\nconst float GLASS_TAU=6.28318530718;\nvec2 glassRotate(vec2 q,float a){\n  return mat2(cos(a),-sin(a),sin(a),cos(a))*q;\n}\nfloat glassHex(vec2 q){\n  q=abs(q);\n  return max(q.x,dot(q,vec2(.5,.8660254)));\n}\nfloat glassTriangleGrid(vec2 q){\n  float a=abs(sin(q.x*GLASS_PI));\n  float b=abs(sin(dot(q,vec2(.5,.8660254))*GLASS_PI));\n  float c=abs(sin(dot(q,vec2(-.5,.8660254))*GLASS_PI));\n  return min(a,min(b,c));\n}\nfloat glassQuasi(vec2 q,float t){\n  float v=0.;\n  for(int j=0;j<5;j++){\n    float a=float(j)*GLASS_TAU/5.;\n    v+=cos(dot(q,vec2(cos(a),sin(a)))+sin(t*.37+float(j)*1.7)*.9);\n  }\n  return v*.2;\n}\nfloat mathematicalGlassSdf(vec2 p,float t){\n  float focus=mix(.19,.45,glassFocus);\n  vec2 q=glassRotate(p,.13*sin(t*.22)+glassVariation*.8);\n  if(glassMode==5){\n    vec2 tile=fract(q*vec2(.62,1.23)+.5)-.5;\n    // Long silica valves with blunt, rounded ends.\n    return (length(tile*vec2(.75,1.65))-focus)*.72;\n  }\n  if(glassMode==6){\n    return glassTriangleGrid(q*.88+vec2(.12*sin(t*.31),.08*cos(t*.27)))-mix(.09,.32,glassFocus);\n  }\n  if(glassMode==7){\n    vec2 h=q*.78;\n    vec2 basis=vec2(1.,1.7320508);\n    vec2 a=mod(h+basis*.5,basis)-basis*.5;\n    vec2 b=mod(h,basis)-basis*.5;\n    vec2 tile=dot(a,a)<dot(b,b)?a:b;\n    return glassHex(tile)-focus;\n  }\n  if(glassMode==8){\n    return abs(glassQuasi(q*4.8,t)-.13*sin(t*.31))-mix(.13,.39,glassFocus);\n  }\n  if(glassMode==9){\n    vec2 x=q*2.7;\n    float z=.65*sin(t*.38)+glassVariation*2.;\n    float field=sin(x.x)*cos(x.y)+sin(x.y)*cos(z)+sin(z)*cos(x.x);\n    return abs(field)*.48-mix(.09,.28,glassFocus);\n  }\n  if(glassMode==10){\n    vec2 x=abs(fract(q*.9+.5)-.5);\n    float facet=max(x.x,x.y)+.45*min(x.x,x.y);\n    return facet-focus;\n  }\n  if(glassMode==11){\n    vec2 tile=fract(q*.66+.5)-.5;\n    float poly=glassHex(tile);\n    float bands=abs(sin(poly*(15.+glassVariation*12.)-.45*sin(t*.4)));\n    return max(poly-focus,bands*.37-.19);\n  }\n  vec2 x=glassRotate(q,t*.12);\n  float beat=sin(x.x*4.8+.8*sin(x.y*2.4+t*.45));\n  return abs(beat)*.42-mix(.10,.30,glassFocus);\n}\n// Signed interior relief changes actual sample coordinates, not just tint.\n// All functions use the same clock as the original refraction pass.\nfloat mathematicalGlassRelief(vec2 p,float t){\n  float f=mix(8.,35.,glassDetail);\n  vec2 q=glassRotate(p,.13*sin(t*.22)+glassVariation*.8);\n  if(glassMode==5){\n    return .55*cos(q.y*f+t*.42)+.45*cos(q.x*f*.48+.7*sin(q.y*f*.5));\n  }\n  if(glassMode==6)return cos(glassTriangleGrid(q*f*.18)*GLASS_PI*2.+t*.38);\n  if(glassMode==7)return cos(q.x*f)+cos(dot(q,vec2(.5,.8660254))*f+t*.34);\n  if(glassMode==8)return glassQuasi(q*f,t)*1.7;\n  if(glassMode==9)return sin(q.x*f*.55)*cos(q.y*f*.55)+.45*sin((q.x+q.y)*f*.4+t*.65);\n  if(glassMode==10)return cos(q.x*f)*cos(q.y*f)+.4*cos((q.x-q.y)*f*.73+t*.42);\n  if(glassMode==11)return cos(glassHex(fract(q*.66+.5)-.5)*f*2.-t*.65);\n  return cos(q.x*f+t*.8)+.55*cos(dot(q,vec2(.94,.342))*f-t*.54);\n}\nfloat glassSdf(vec2 p){\n  float t=time*(.16+glassMotion*.8);\n  float detail=glassVariation*6.28318530718;\n  if(glassMode==0){\n    vec2 lattice=p*.87;\n    vec2 cell=fract(lattice+.5)-.5;\n    cell+=.045*vec2(sin(t+floor(lattice.y)*2.1+detail),\n                    cos(t*.9+floor(lattice.x)*1.7+detail));\n    return length(cell)-mix(.20,.39,glassFocus);\n  }\n  if(glassMode==1){\n    float thread=p.y+.20*sin(p.x*2.7+t+detail)\n      +.075*sin(p.x*7.3-t*.7);\n    float group=abs(fract(thread*1.8+.5)-.5);\n    return group-mix(.07,.19,glassFocus);\n  }\n  if(glassMode==2){\n    vec2 cell=fract(p*.72+.5)-.5;\n    float angle=atan(cell.y,cell.x)+t*.14;\n    float petals=6.0+floor(glassVariation*6.0);\n    float r=.29+.13*cos(petals*angle+t*.36);\n    return length(cell)-r*mix(.70,1.15,glassFocus);\n  }\n  if(glassMode==3){\n    vec2 cell=fract(p*.53+.5)-.5;\n    float a=atan(cell.y,cell.x);\n    float scallop=sin(a*(9.0+floor(glassVariation*7.0))+t*.31);\n    float shell=.26+.105*scallop;\n    return abs(length(cell)-shell)-mix(.025,.12,glassFocus);\n  }\n  if(glassMode>=5)return mathematicalGlassSdf(p,t);\n  float h=glassHaze(p*1.3+vec2(t*.15,-t*.08));\n  return abs(h-.5)-mix(.07,.25,glassFocus);\n}\nvoid main(){\n  vec2 uv=gl_FragCoord.xy/resolution;\n  vec2 aspect=vec2(resolution.x/resolution.y,1.0);\n  float t=time*(.15+glassMotion*.72);\n  vec2 p=(uv-.5)*aspect*(1.5+glassScale*5.0);\n  p+=vec2(glassVariation*10.13,-glassVariation*8.41);\n  float haze=glassHaze(p*.71+vec2(t*.11,-t*.13));\n  float sdf=glassSdf(p)+glassRipple*.092*(haze-.5);\n  float eps=.008;\n  float dx=glassSdf(p+vec2(eps,0.0))-glassSdf(p-vec2(eps,0.0));\n  float dy=glassSdf(p+vec2(0.0,eps))-glassSdf(p-vec2(0.0,eps));\n  vec2 normal=normalize(vec2(dx,dy)+vec2(.00001));\n  float core=1.0-smoothstep(-.025,.028,sdf);\n  float rim=1.0-smoothstep(.008,.085,abs(sdf));\n  float localMask=clamp(glassMask*(core+rim*.38),0.0,1.0);\n  vec2 flow=vec2(haze-.5,glassNoise(p*.82+vec2(11.3,t*.2))-.5);\n  vec2 displacement=(normal*(.006+.060*glassBend)\n     +flow*(.004+.024*glassRipple))*localMask;\n  // Coordinates are real sampled pixels from the FULL precomposited artwork.\n  // Dividing by aspect keeps the lens circular on portrait and landscape.\n  if(glassMode>=5 && glassStructure>.001){\n    float rx=mathematicalGlassRelief(p+vec2(eps,0.),t)-mathematicalGlassRelief(p-vec2(eps,0.),t);\n    float ry=mathematicalGlassRelief(p+vec2(0.,eps),t)-mathematicalGlassRelief(p-vec2(0.,eps),t);\n    // Bounded slopes prevent dense lattices from exploding into static.\n    vec2 gradient=clamp(vec2(rx,ry)*1.6,vec2(-1.),vec2(1.));\n    displacement+=gradient*glassStructure*glassBend*.026*localMask;\n  }\n  vec2 shifted=displacement/aspect;\n  vec2 texel=.5/resolution;\n  vec2 coord=clamp(uv+shifted,texel,1.0-texel);\n  vec4 original=texture2D(artTex,uv);\n  vec2 rgbEdge=(normal/aspect)*localMask*glassDispersion*.009;\n  vec3 glass=vec3(\n    texture2D(artTex,clamp(coord+rgbEdge,texel,1.0-texel)).r,\n    texture2D(artTex,coord).g,\n    texture2D(artTex,clamp(coord-rgbEdge,texel,1.0-texel)).b);\n  float fresnel=pow(clamp(.52+.48*dot(normal,normalize(vec2(-.6,.8))),0.0,1.0),3.0);\n  vec3 outColor=mix(original.rgb,glass,glassAmount*localMask);\n  outColor+=glassAmount*glassRim*rim*(.12+.43*fresnel)*vec3(1.0,.96,1.0);\n  if(glassMode>=5 && glassCaustics>.001){\n    float relief=mathematicalGlassRelief(p,t);\n    float contour=pow(max(0.,cos(relief*4.5-t*.72)),9.);\n    float opticalFocus=contour*(.28+.72*fresnel);\n    vec3 spectrum=.65+.35*cos(vec3(0.,2.0944,4.18879)+relief*2.8+t*.55);\n    outColor+=glassAmount*localMask*glassCaustics*opticalFocus*.24*mix(vec3(1.),spectrum,glassDispersion);\n    outColor*=1.-glassAmount*localMask*glassCaustics*.09*(1.-contour);\n  }\n  gl_FragColor=vec4(clamp(outColor,0.0,1.0),1.0);\n}";
