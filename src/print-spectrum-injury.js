// Four source-grounded color/print behaviors. Single fragment only: no feedback buffers.
// WebGL1-safe moving XOR is arithmetic (mod/floor), not bitwise GLSL operators.
export const injuryModes=[
  "Rainbow XOR Ditherscape",
  "Caustic Ink-Dot Erosion",
  "Hypercolor Damage Reactor",
  "Spectral Fracture Comb"
];
export const injuryFamilies=[
  {name:"Pixel decisions & living print",modes:injuryModes.slice(0,2)},
  {name:"Damaged color & spectral interference",modes:injuryModes.slice(2)}
];
export const injuryDescriptions={
  "Rainbow XOR Ditherscape":"Moving XOR-checker thresholds decide which spectral pigments survive at each pixel, with smooth color drift and crunchy micro-patterns.",
  "Caustic Ink-Dot Erosion":"Three rotating print plates deform under liquid-light caustics; dot gain and ink edges pulse over the existing composition.",
  "Hypercolor Damage Reactor":"A warped HSV signal reacts to local brightness, burning and cross-modulating color channels without rewriting the geometry.",
  "Spectral Fracture Comb":"Three moving wave-combs alternately suppress and amplify spectral channels, producing crossing bands of prismatic color injury."
};
export const injuryControls=[
  "injuryAmount","injuryScale","injuryMotion","injurySeparation",
  "injuryGrain","injuryGlow","injuryVariation"
];
export const injuryPresets=[
  {name:"XOR Glitter Funeral",mode:injuryModes[0],injuryAmount:93,injuryScale:75,injuryMotion:68,injurySeparation:89,injuryGrain:72,injuryGlow:61,injuryVariation:23,injuryPalette:true},
  {name:"Rainbow Pixel Possession",mode:injuryModes[0],injuryAmount:82,injuryScale:43,injuryMotion:87,injurySeparation:72,injuryGrain:84,injuryGlow:45,injuryVariation:70,injuryPalette:true},
  {name:"Caustic Riso Meltdown",mode:injuryModes[1],injuryAmount:91,injuryScale:59,injuryMotion:58,injurySeparation:83,injuryGrain:77,injuryGlow:67,injuryVariation:38,injuryPalette:true},
  {name:"Printing Press Poltergeist",mode:injuryModes[1],injuryAmount:87,injuryScale:82,injuryMotion:73,injurySeparation:96,injuryGrain:51,injuryGlow:39,injuryVariation:82,injuryPalette:true},
  {name:"Hypercolor Nervous Breakdown",mode:injuryModes[2],injuryAmount:96,injuryScale:66,injuryMotion:92,injurySeparation:89,injuryGrain:69,injuryGlow:73,injuryVariation:49,injuryPalette:true},
  {name:"Toxic Channel Sunburn",mode:injuryModes[2],injuryAmount:88,injuryScale:38,injuryMotion:54,injurySeparation:96,injuryGrain:87,injuryGlow:45,injuryVariation:15,injuryPalette:false},
  {name:"Spectral Comb Séance",mode:injuryModes[3],injuryAmount:91,injuryScale:74,injuryMotion:57,injurySeparation:83,injuryGrain:39,injuryGlow:85,injuryVariation:62,injuryPalette:true},
  {name:"RGB Lightning Ossuary",mode:injuryModes[3],injuryAmount:95,injuryScale:88,injuryMotion:84,injurySeparation:94,injuryGrain:55,injuryGlow:96,injuryVariation:9,injuryPalette:false}
];
export function applyInjuryPreset(state,name){
  const p=injuryPresets.find(x=>x.name===name);
  if(!p)return state;
  const {name:unused,mode,...settings}=p;
  return {...state,injuryMode:mode,...settings};
}
export function shuffleInjury(state,rng=Math.random,kind="all"){
  const n=Number(rng()),unit=Number.isFinite(n)
    ?Math.min(1-Number.EPSILON,Math.max(0,n)):0;
  const choices=kind==="funky"?injuryPresets.filter(x=>
    ["XOR Glitter Funeral","Printing Press Poltergeist",
      "Hypercolor Nervous Breakdown","RGB Lightning Ossuary"].includes(x.name))
    :injuryPresets;
  const different=choices.filter(p=>p.mode!==state.injuryMode);
  const pool=different.length?different:choices;
  return applyInjuryPreset(state,pool[Math.floor(unit*pool.length)].name);
}
export function hideInjury(state){return {...state,injuryAmount:0};}
export function specializeInjuryGLSL(source,id){
  if(!Number.isInteger(id)||id<0||id>=injuryModes.length)return source;
  const opener=i=>i===0?"  if(injuryMode==0){":
    "  }else if(injuryMode=="+i+"){";
  const starts=injuryModes.map((_,i)=>source.indexOf(opener(i)));
  if(starts.some((n,i)=>n<0||(i>0&&n<=starts[i-1])))return source;
  const fallback=source.indexOf("  }else{ // Unsupported print injury mode",starts[3]);
  const tail=source.indexOf("  return mix(original,",fallback);
  if(fallback<0||tail<=fallback)return source;
  return source.slice(0,starts[0])+
    "  if(injuryMode=="+id+"){"+
    source.slice(starts[id]+opener(id).length,id===3?fallback:starts[id+1])+
    source.slice(fallback,tail)+source.slice(tail);
}
export const injuryGLSL=`
uniform int injuryMode;
uniform float injuryAmount,injuryScale,injuryMotion,injurySeparation;
uniform float injuryGrain,injuryGlow,injuryVariation,injuryPalette;
float piXor(float x,float y){
  return abs(mod(floor(x),2.)-mod(floor(y),2.));
}
float piInkDot(vec2 uv,float angle,float density,float ink,float distortion){
  vec2 q=rotate(angle)*(uv-.5)*vec2(res.x/res.y,1.)*density;
  q+=.16*vec2(sin(q.y*.27+distortion),cos(q.x*.23-distortion));
  float radius=(.09+.35*sqrt(clamp(ink,0.,1.)));
  return 1.-smoothstep(radius-.045,radius+.045,length(fract(q)-.5));
}
vec3 piRgbToHsv(vec3 rgb){
  vec4 k=vec4(0.,-1./3.,2./3.,-1.);
  vec4 p=mix(vec4(rgb.bg,k.wz),vec4(rgb.gb,k.xy),step(rgb.b,rgb.g));
  vec4 q=mix(vec4(p.xyw,rgb.r),vec4(rgb.r,p.yzx),step(p.x,rgb.r));
  float d=q.x-min(q.w,q.y),e=1.e-7;
  return vec3(abs(q.z+(q.w-q.y)/(6.*d+e)),d/(q.x+e),q.x);
}
vec3 piHsvToRgb(vec3 c){
  vec3 rgb=clamp(abs(mod(c.x*6.+vec3(0.,4.,2.),6.)-3.)-1.,0.,1.);
  return c.z*mix(vec3(1.),rgb,c.y);
}
vec3 livingPrintInjury(vec3 original,vec2 uv,vec2 p,float v){
  float t=colorTime*(.06+injuryMotion*1.24);
  float phase=injuryVariation*8.31+seed*.00021;
  float field=v*(3.1+injuryScale*12.)+
    .23*sin(p.x*2.1-p.y*1.7+phase);
  float lum=dot(clamp(original,0.,1.),vec3(.2126,.7152,.0722));
  vec3 crafted=original;
  if(injuryMode==0){ // RAINBOW XOR DITHERSCAPE: moving arithmetic parity, not fixed Bayer.
    vec2 canvas=(uv-.5)*vec2(res.x/res.y,1.)*
      (110.+injuryScale*710.);
    vec2 warped=canvas+injurySeparation*vec2(
      sin(canvas.y*.037+field+t*.44),
      cos(canvas.x*.043-field-t*.39))*8.;
    float beat=sin(field*1.8+t*.81+phase*.29);
    vec2 cell=floor(warped+vec2(t*.19,-t*.16));
    float parity=piXor(cell.x+floor(beat*3.),cell.y+floor(
      .5+.5*sin(t*.41+field*1.4))*3.);
    float threshold=fract(dot(cell,vec2(.06711,.17837))+
      .17*sin(field*2.7+t*.64));
    float ink=step(threshold,clamp(lum+injuryGrain*.46*beat,0.,1.));
    float bands=.5+.5*sin(field*3.9+parity*3.14159+t*.53);
    vec3 spectral=palette(fract(field*.081+t*.028+
      parity*.35+injuryVariation*.017));
    vec3 neon=.5+.5*cos(vec3(0.,2.094,4.189)+
      field*1.13+t*.39+parity*1.57);
    vec3 pigment=mix(neon,spectral,injuryPalette);
    float lattice=.24+.76*ink*(.32+.68*bands);
    crafted=mix(original*(.29+.45*ink),
      pigment*(.65+.35*parity),lattice*injurySeparation);
    crafted+=vec3(1.)*injuryGlow*pow(bands*ink,9.)*.27;
  }else if(injuryMode==1){ // CAUSTIC INK-DOT EROSION: three liquid-warped print plates.
    vec2 g=p*(.8+injuryScale*.4);
    float wave=sin(g.x*3.3+sin(g.y*1.9-t*.56)*2.1)+
      cos(g.y*4.1+cos(g.x*2.4+t*.45)*2.5);
    float caustic=pow(.5+.5*sin(wave*6.3+t*.64),12.);
    float radius=29.+injuryScale*87.;
    vec3 target=mix(original,palette(fract(field*.082+t*.032+
      .15*caustic)),injuryPalette*.59);
    float c=piInkDot(uv,.2618,radius,1.-target.r+.09*wave,
      t*.19+wave*injurySeparation);
    float m=piInkDot(uv,.7854,radius,1.-target.g+.08*wave,
      -t*.17+wave*injurySeparation);
    float y=piInkDot(uv,1.309,radius,1.-target.b+.07*wave,
      t*.21-wave*injurySeparation);
    float dotGain=.19+.73*injuryGrain;
    vec3 printCol=vec3(1.-c*dotGain,1.-m*dotGain,1.-y*dotGain);
    float coverage=(c+m+y)/3.;
    crafted=mix(target,printCol,(.3+.52*injurySeparation)*coverage);
    crafted=mix(crafted,original,.19+.16*lum);
    crafted+=vec3(1.)*caustic*injuryGlow*.34;
  }else if(injuryMode==2){ // HYPERCOLOR DAMAGE REACTOR: luminance-reactive HSV phase injury.
    vec3 hsv=piRgbToHsv(clamp(original,0.,1.));
    float signal=sin(field*3.1+t*.87+phase*.53);
    float burn=pow(.5+.5*sin(field*6.9-
      cos(p.y*2.2+t*.31)*2.5-t*.63),7.);
    float damage=injurySeparation*(.17+.83*burn)*
      (.43+.57*abs(lum-.48)*2.);
    hsv.x=fract(hsv.x+damage*(.31*signal+
      .18*cos(p.y*5.7-t*.74)));
    hsv.y=clamp(hsv.y*(.8+damage*.88+
      injuryGrain*.3*signal),0.,1.);
    hsv.z=clamp(hsv.z*(.81+.24*signal*damage+
      .35*burn*injuryGlow),0.,1.22);
    vec3 radioactive=piHsvToRgb(hsv);
    vec3 authored=palette(fract(field*.064+t*.041+burn*.21));
    crafted=mix(radioactive,mix(radioactive,authored,.52),
      injuryPalette*damage*.82);
    float scorch=smoothstep(.61,.98,burn);
    crafted+=vec3(1.,.36,.72)*scorch*injuryGlow*
      (1.-injuryPalette*.61)*.36;
  }else if(injuryMode==3){ // SPECTRAL FRACTURE COMB: crossing RGB frequency notches.
    vec2 g=p*(1.2+injuryScale*1.7);
    float angle=atan(g.y,g.x);
    float sw=sin(g.x*2.1+cos(g.y*1.4-t*.46)*1.7);
    float a=g.x*4.2+field*1.8+t*.49+
      sin(angle*5.0-t*.23)*injurySeparation*3.;
    float b=g.y*5.4-field*1.3-t*.63+
      cos(angle*3.0+t*.32)*injurySeparation*2.;
    float c=(g.x+g.y)*3.7+sw*2.1+t*.57;
    vec3 passbands=.5+.5*cos(vec3(a,b,c)+
      injuryVariation*.031*vec3(.73,1.12,1.61));
    passbands=pow(passbands,vec3(1.3+injuryGrain*7.));
    float beat=.5+.5*sin(a-b+sin(c+t*.31)*1.7);
    vec3 split=vec3(passbands.r*beat,
      passbands.g*(1.-beat*.68),
      passbands.b*(.44+.56*sin(b-c)*sin(b-c)));
    vec3 authored=palette(fract(field*.074+t*.031+beat*.32));
    vec3 spectral=mix(split,split*authored*1.5,injuryPalette);
    crafted=original*(.42+.32*beat)+
      spectral*(.44+.91*injurySeparation);
    float sparkle=pow(beat*max(max(split.r,split.g),split.b),7.);
    crafted+=vec3(1.)*sparkle*injuryGlow*.37;
  }else{ // Unsupported print injury mode: leave earlier art unmodified.
    return original;
  }
  return mix(original,clamp(crafted,0.,1.35),injuryAmount);
}
`;
