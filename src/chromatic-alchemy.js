// Color Sorcery — opt-in, palette-aware single-pass looks for existing art.
// Adapted from the user's inspected spectral, birefringence, chromadepth,
// risograph and phosphene shaders; no HDR buffers or WebGL2 requirements.
export const alchemyModes=[
  "OKLab Chroma Oracle",
  "Birefringent Cellophane",
  "Chromadepth Risograph",
  "Phosphene Gem"
];
export const alchemyFamilies=[
  {name:"Perceptual color science",modes:alchemyModes.slice(0,1)},
  {name:"Polarized optical materials",modes:alchemyModes.slice(1,2)},
  {name:"Depth printing & luminous jewels",modes:alchemyModes.slice(2)}
];
export const alchemyDescriptions={
  "OKLab Chroma Oracle":"Perceptual hue and chroma rotate while the artwork's original OKLab lightness stays protected.",
  "Birefringent Cellophane":"Two moving optic axes create unequal rainbow phase delays and interference panes.",
  "Chromadepth Risograph":"Near/far optical hues are printed with three independently angled living halftones.",
  "Phosphene Gem":"Soft white crowns and fuzzy neon fringes grow around the mathematical field's bright ridges."
};
export const alchemyControls=[
  "alchemyAmount","alchemyScale","alchemyMotion","alchemySeparation",
  "alchemySoftness","alchemyWhite","alchemyVariation"
];
export const alchemyPresets=[
  {name:"Acid Chroma Oracle",mode:alchemyModes[0],alchemyAmount:88,alchemyScale:65,alchemyMotion:65,alchemySeparation:83,alchemySoftness:44,alchemyWhite:12,alchemyVariation:38,alchemyPalette:true},
  {name:"Perceptual Velvet Poison",mode:alchemyModes[0],alchemyAmount:82,alchemyScale:37,alchemyMotion:33,alchemySeparation:54,alchemySoftness:79,alchemyWhite:18,alchemyVariation:76,alchemyPalette:true},
  {name:"Alien Cellophane Reef",mode:alchemyModes[1],alchemyAmount:92,alchemyScale:76,alchemyMotion:61,alchemySeparation:86,alchemySoftness:43,alchemyWhite:50,alchemyVariation:31,alchemyPalette:true},
  {name:"Double Rainbow Autopsy",mode:alchemyModes[1],alchemyAmount:95,alchemyScale:53,alchemyMotion:83,alchemySeparation:96,alchemySoftness:27,alchemyWhite:32,alchemyVariation:81,alchemyPalette:false},
  {name:"Witch-Printed Chromadepth",mode:alchemyModes[2],alchemyAmount:90,alchemyScale:59,alchemyMotion:60,alchemySeparation:83,alchemySoftness:45,alchemyWhite:28,alchemyVariation:62,alchemyPalette:true},
  {name:"Chromatic Riso Hallucination",mode:alchemyModes[2],alchemyAmount:96,alchemyScale:84,alchemyMotion:79,alchemySeparation:94,alchemySoftness:22,alchemyWhite:20,alchemyVariation:27,alchemyPalette:false},
  {name:"White Crown Phosphene",mode:alchemyModes[3],alchemyAmount:96,alchemyScale:45,alchemyMotion:43,alchemySeparation:72,alchemySoftness:86,alchemyWhite:96,alchemyVariation:48,alchemyPalette:true},
  {name:"Soft Neon Jewel Spores",mode:alchemyModes[3],alchemyAmount:87,alchemyScale:78,alchemyMotion:67,alchemySeparation:91,alchemySoftness:75,alchemyWhite:81,alchemyVariation:77,alchemyPalette:true}
];
export function applyAlchemyPreset(state,name){
  const p=alchemyPresets.find(x=>x.name===name);
  if(!p)return state;
  const {name:unused,mode,...settings}=p;
  return {...state,alchemyMode:mode,...settings};
}
export function shuffleAlchemy(state,rng=Math.random,kind="all"){
  const n=Number(rng());
  const unit=Number.isFinite(n)?Math.max(0,Math.min(1-Number.EPSILON,n)):0;
  const pool=kind==="funky"?alchemyPresets.filter(p=>
    p.name==="Double Rainbow Autopsy"||
    p.name==="Chromatic Riso Hallucination"||
    p.name==="Soft Neon Jewel Spores"||
    p.name==="Acid Chroma Oracle"):alchemyPresets;
  // A color shuffle should genuinely change the underlying color engine.
  const candidates=pool.filter(p=>p.mode!==state.alchemyMode);
  const target=(candidates.length?candidates:pool)[
    Math.floor(unit*(candidates.length?candidates.length:pool.length))];
  return {...applyAlchemyPreset(state,target.name)};
}
export function hideAlchemy(state){return {...state,alchemyAmount:0};}

// specialization operates on actual source branches rather than relying on
// a desktop GPU to optimize 4 modes out of the full monster fragment.
export function specializeAlchemyGLSL(source,id){
  if(!Number.isInteger(id)||id<0||id>=alchemyModes.length)return source;
  const opener=i=>i===0?"  if(alchemyMode==0){":
    "  }else if(alchemyMode=="+i+"){";
  const starts=alchemyModes.map((_,i)=>source.indexOf(opener(i)));
  if(starts.some((v,i)=>v<0||(i>0&&v<=starts[i-1])))return source;
  const fallback=source.indexOf("  }else{ // Unsupported alchemy mode",starts[3]);
  const end=source.indexOf("  return mix(original,",fallback);
  if(fallback<0||end<=fallback)return source;
  const stop=id===3?fallback:starts[id+1];
  const body=source.slice(starts[id]+opener(id).length,stop);
  return source.slice(0,starts[0])+"  if(alchemyMode=="+id+"){"+body+
    source.slice(fallback,end)+source.slice(end);
}
export const alchemyGLSL=`
uniform int alchemyMode;
uniform float alchemyAmount,alchemyScale,alchemyMotion,alchemySeparation;
uniform float alchemySoftness,alchemyWhite,alchemyVariation,alchemyPalette;
vec3 caToLinear(vec3 c){
  c=clamp(c,0.,1.);
  return mix(c/12.92,pow((c+0.055)/1.055,vec3(2.4)),step(vec3(.04045),c));
}
vec3 caToSrgb(vec3 c){
  c=max(c,vec3(0.));
  return mix(c*12.92,1.055*pow(c,vec3(.416666667))-.055,step(vec3(.0031308),c));
}
vec3 caToLab(vec3 rgb){
  vec3 x=caToLinear(rgb);
  float l=.4122214708*x.r+.5363325363*x.g+.0514459929*x.b;
  float m=.2119034982*x.r+.6806995451*x.g+.1073969566*x.b;
  float s=.0883024619*x.r+.2817188376*x.g+.6299787005*x.b;
  vec3 q=pow(max(vec3(l,m,s),vec3(0.)),vec3(.333333333));
  return vec3(.2104542553*q.x+.7936177850*q.y-.0040720468*q.z,
    1.9779984951*q.x-2.4285922050*q.y+.4505937099*q.z,
    .0259040371*q.x+.7827717662*q.y-.8086757660*q.z);
}
vec3 caFromLab(vec3 lab){
  float l=lab.x+.3963377774*lab.y+.2158037573*lab.z;
  float m=lab.x-.1055613458*lab.y-.0638541728*lab.z;
  float s=lab.x-.0894841775*lab.y-1.2914855480*lab.z;
  l=l*l*l;m=m*m*m;s=s*s*s;
  return caToSrgb(vec3(
    4.0767416621*l-3.3077115913*m+.2309699292*s,
   -1.2684380046*l+2.6097574011*m-.3413193965*s,
   -.0041960863*l-.7034186147*m+1.7076147010*s));
}
float caInkDot(vec2 uv,float angle,float density,float ink){
  vec2 q=rotate(angle)*(uv-.5)*vec2(res.x/res.y,1.)*density;
  float d=length(fract(q)-.5);
  float radius=.04+.40*sqrt(clamp(ink,0.,1.));
  return 1.-smoothstep(radius-.035,radius+.035,d);
}
vec3 livingColorAlchemy(vec3 original,vec2 uv,vec2 p,float v){
  float t=colorTime*(.07+alchemyMotion*1.18);
  float seedPhase=alchemyVariation*8.1+seed*.00017;
  float f=v*(3.5+alchemyScale*11.)+
    .38*sin(p.x*1.4+p.y*.9+seedPhase*.34);
  vec3 crafted=original;
  if(alchemyMode==0){ // OKLAB CHROMA ORACLE: preserve actual perceived L.
    vec3 lab=caToLab(original);
    float angle=atan(lab.z,lab.y);
    float radius=length(lab.yz);
    float motion=sin(f*1.7+t*.78+seedPhase)*.72+
      .31*cos(p.y*2.2-t*.53+f*.25);
    float turn=motion*(.3+alchemySeparation*3.5);
    vec2 hue=vec2(cos(angle+turn),sin(angle+turn));
    float chromaBoost=1.+alchemySeparation*(.35+.3*motion);
    vec2 ab=hue*max(.018,radius)*chromaBoost;
    vec3 paletteLab=caToLab(palette(fract(
      f*.083+t*.043+alchemyVariation*.12)));
    ab=mix(ab,paletteLab.yz,.10+.42*alchemyPalette);
    float muted=1.-alchemySoftness*.2;
    crafted=caFromLab(vec3(lab.x,ab*muted));
  }else if(alchemyMode==1){ // BIREFRINGENT CELLOPHANE: two moving optic axes.
    float a=atan(p.y,p.x)+sin(p.y*.68+t*.28)*.46;
    vec2 axisA=vec2(cos(a),sin(a));
    vec2 axisB=vec2(-axisA.y,axisA.x);
    float phaseA=dot(p,axisA)*(2.6+alchemyScale*6.0)+v*9.8+t*.87;
    float phaseB=dot(p,axisB)*(3.1+alchemyScale*7.4)-v*7.3-t*.69;
    float retarder=sin(phaseA+seedPhase*.2)*cos(phaseB*1.12);
    float band=sin(phaseA*.67-phaseB*.81+t*.35);
    vec3 optical=.5+.5*cos(vec3(0.,2.09,4.19)+
      retarder*(3.0+alchemySeparation*6.0)+
      band*vec3(.67,1.39,2.19)+t*.18);
    vec3 base=palette(fract(f*.094+.22*retarder+t*.023));
    vec3 tint=mix(optical,mix(base,optical,.45),alchemyPalette);
    float pane=pow(.5+.5*retarder,1.3+alchemySoftness*4.);
    float gleam=pow(.5+.5*cos(phaseA-phaseB),7.);
    crafted=original*(.57+.25*pane)+tint*(.36+.53*pane)+
      vec3(1.)*gleam*alchemyWhite*.31;
  }else if(alchemyMode==2){ // CHROMADEPTH RISOGRAPH: live separate ink plates.
    float depth=.5+.5*sin(f*1.12+t*.41+seedPhase*.24);
    vec3 hot=vec3(1.,.04,.42),cool=vec3(.02,.86,1.);
    vec3 target=mix(hot,cool,depth);
    vec3 authored=palette(fract(depth*.76+f*.043+t*.025));
    target=mix(target,authored,alchemyPalette);
    float press=29.+alchemyScale*77.;
    float c=caInkDot(uv+vec2(t*.0009,0.),.31,press,
      clamp(1.-target.r+.14*sin(f),0.,1.));
    float m=caInkDot(uv-vec2(t*.0006,0.),.82,press,
      clamp(1.-target.g+.1*cos(f),0.,1.));
    float y=caInkDot(uv+vec2(0.,t*.0008),1.29,press,
      clamp(1.-target.b,0.,1.));
    vec3 printed=vec3(1.-c*.79,1.-m*.79,1.-y*.79);
    float coverage=(c+m+y)/3.;
    float amount=(.28+.72*alchemySeparation);
    vec3 impression=mix(target,printed,.32+.49*amount);
    crafted=mix(original*(.78+.15*depth),impression,
      (.39+.42*coverage)*amount);
    crafted+=alchemyWhite*.08*vec3(1.-coverage);
  }else if(alchemyMode==3){ // PHOSPHENE GEM: broad white crown, soft neon halo.
    float spiral=sin(f*1.55+sin(p.x*1.3-t*.2)*2.0+seedPhase*.13);
    float ridge=.5+.5*spiral;
    float bloom=pow(ridge,1.2+alchemySoftness*2.5);
    float halo=exp(-abs(spiral)*(.9+alchemySoftness*3.7));
    float pulse=.61+.39*sin(t*.74+f*.32);
    vec3 neon=.5+.5*cos(vec3(0.,2.1,4.2)+
      f*1.12+t*.29+seedPhase*.4);
    vec3 hue=palette(fract(f*.081+t*.025+alchemyVariation*.017));
    neon=mix(neon,hue,alchemyPalette);
    float strand=(.25+.75*alchemySeparation);
    crafted=original*(.71+.18*bloom)+neon*halo*strand*.61*pulse+
      vec3(1.)*bloom*alchemyWhite*.9*pulse;
  }else{ // Unsupported alchemy mode: preserve the original composition.
    return original;
  }
  return mix(original,clamp(crafted,0.,1.3),alchemyAmount);
}
`;
