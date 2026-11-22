/**
 * COLOR MATHEMATICS LAB — eleven color-domain laws, no geometry mutation.
 * One selected law is compiled into the scene fragment program; Off is absent.
 * Deterministic time/seed, same WebGL path for preview and strict exports.
 */
export const colorMathModes=[
  "Off",
  "RGB Cube Folding",
  "OKLab Opponent Mirror",
  "Hue Origami",
  "Modular Color Arithmetic",
  "Möbius Chroma",
  "Julia Set Color Dynamics",
  "Strange Attractor Dye",
  "Chromatic Bifurcation",
  "Color-Space Kaleidoscope",
  "Spectral Counterfeit",
  "Recursive Color Automaton",
];
export const colorMathFamilies=[
  {name:"Off",modes:colorMathModes.slice(0,1)},
  {name:"Prismatic algebra",modes:colorMathModes.slice(1,5)},
  {name:"Nonlinear color-space dynamics",modes:colorMathModes.slice(5,9)},
  {name:"Counterfeit spectra & symbolic systems",modes:colorMathModes.slice(9)},
];
export const colorMathDescriptions={
  Off:"Your original colors are unchanged. The extra shader does not compile.",
  "RGB Cube Folding":"Fold and reflect RGB coordinates through coupled mirrored walls.",
  "OKLab Opponent Mirror":"Reflect perceptual red/green and blue/yellow opponent axes.",
  "Hue Origami":"Fold the hue circle into repeated mirrored wedges.",
  "Modular Color Arithmetic":"Wrap multiplied RGB channels through modular boundaries.",
  "Möbius Chroma":"A bounded complex fractional transform bends chroma neighborhoods.",
  "Julia Set Color Dynamics":"Iterated complex color coordinates generate strange chromatic basins.",
  "Strange Attractor Dye":"Iterate a nonlinear De Jong-like dye mapping in opponent space.",
  "Chromatic Bifurcation":"Logistic-map bifurcations split tones into chaotic color families.",
  "Color-Space Kaleidoscope":"Fold and rotate the three-dimensional color cube itself.",
  "Spectral Counterfeit":"Forge false spectral color from luminance and palette samples.",
  "Recursive Color Automaton":"A compact deterministic state-machine remaps quantized color.",
};
const recipes=[
  ["Folded Prism Wreckage",1,96,79,25,60,false],
  ["Perceptual Anti-Rainbow",2,91,75,0,41,true],
  ["Five-Sector Witchwheel",3,97,55,16,36,true],
  ["Modulo Candy Assault",4,98,89,27,71,false],
  ["Chroma Möbius Ribbon",5,94,74,23,54,true],
  ["Julia Dye Catastrophe",6,96,79,15,62,true],
  ["Attractor Poison Bloom",7,94,73,25,83,true],
  ["Bifurcation Fever Dream",8,98,93,0,64,false],
  ["Hue Cathedral Kaleidoscope",9,97,87,12,51,false],
  ["Counterfeit Thermal Relic",10,98,72,35,79,false],
  ["Recursive Fluorescent Automaton",11,95,81,0,56,false],
];
export const colorMathPresets=recipes.map(([name,idx,amount,depth,motion,variation,preserve])=>({
  name,colorMathMode:colorMathModes[idx],colorMathAmount:amount,
  colorMathDepth:depth,colorMathMotion:motion,colorMathVariation:variation,
  colorMathPreserveLuma:preserve,
}));
export function applyColorMathPreset(state,name){
  const p=colorMathPresets.find(p=>p.name===name);
  if(!p)return state;
  const {name:label,...values}=p;
  return {...state,...values};
}
export function disableColorMath(state){
  return {...state,colorMathMode:"Off",colorMathAmount:0};
}
export function remixColorMath(state,rng=Math.random,onlyWeird=false){
  const unit=()=>{const n=Number(rng());return Number.isFinite(n)?Math.max(0,Math.min(.999999,n)):0;};
  const pool=onlyWeird?colorMathModes.slice(5):colorMathModes.slice(1);
  const choices=pool.filter(n=>n!==state.colorMathMode);
  const mode=(choices.length?choices:pool)[Math.floor(unit()*(choices.length||pool.length))];
  return {...state,colorMathMode:mode,
    colorMathAmount:onlyWeird?83+unit()*17:65+unit()*35,
    colorMathDepth:onlyWeird?72+unit()*28:25+unit()*74,
    colorMathVariation:unit()*100,colorMathMotion:unit()*75,
    colorMathPreserveLuma:unit()>.45};
}
// Shared helpers are dead-code-eliminated by the GPU compiler when unused.
const header=String.raw`
uniform float colorMathAmount,colorMathDepth,colorMathMotion,colorMathVariation;
uniform float colorMathPreserveLuma;
const float CM_TAU=6.283185307179586;
float cmFold(float x){return 1.0-abs(fract(x)*2.0-1.0);}
vec2 cmComplexMul(vec2 a,vec2 b){return vec2(a.x*b.x-a.y*b.y,a.x*b.y+a.y*b.x);}
vec3 cmToLab(vec3 srgb){
  vec3 c=clamp(srgb,0.0,1.0);
  vec3 v=mix(c/12.92,pow((c+.055)/1.055,vec3(2.4)),step(vec3(.04045),c));
  vec3 lms=vec3(
    dot(v,vec3(.4122214708,.5363325363,.0514459929)),
    dot(v,vec3(.2119034982,.6806995451,.1073969566)),
    dot(v,vec3(.0883024619,.2817188376,.6299787005)));
  vec3 q=pow(max(lms,vec3(0.0)),vec3(1.0/3.0));
  return vec3(
    dot(q,vec3(.2104542553,.7936177850,-.0040720468)),
    dot(q,vec3(1.9779984951,-2.4285922050,.4505937099)),
    dot(q,vec3(.0259040371,.7827717662,-.8086757660)));
}
vec3 cmFromLab(vec3 x){
  float l=x.x+.3963377774*x.y+.2158037573*x.z;
  float m=x.x-.1055613458*x.y-.0638541728*x.z;
  float s=x.x-.0894841775*x.y-1.2914855480*x.z;
  vec3 q=vec3(l*l*l,m*m*m,s*s*s);
  vec3 lin=vec3(
    dot(q,vec3(4.0767416621,-3.3077115913,.2309699292)),
    dot(q,vec3(-1.2684380046,2.6097574011,-.3413193965)),
    dot(q,vec3(-.0041960863,-.7034186147,1.7076147010)));
  return clamp(mix(lin*12.92,1.055*pow(max(lin,vec3(0.0)),vec3(1.0/2.4))-.055,
    step(vec3(.0031308),lin)),0.0,1.0);
}
vec3 cmLaw(vec3 original){
  float d=colorMathDepth;
  float variation=colorMathVariation;
  float clock=time*(.12+colorMathMotion*1.6);
  float spin=sin(clock)*colorMathMotion*1.65+variation*CM_TAU;
  vec3 lab=cmToLab(original);
  vec2 ab=lab.yz;
  /* COLOR_MATH_LAW */
}
vec3 applyColorMath(vec3 original){
  vec3 base=clamp(original,0.0,1.0);
  vec3 altered=clamp(cmLaw(base),0.0,1.0);
  if(colorMathPreserveLuma>.5){
    vec3 a=cmToLab(altered);
    a.x=cmToLab(base).x;
    altered=cmFromLab(a);
  }
  return mix(base,altered,clamp(colorMathAmount,0.0,1.0));
}
`;
const laws=[
  null,
  String.raw`vec3 p=original+.15*vec3(original.g-original.b,original.b-original.r,original.r-original.g)*d;
  vec3 f=vec3(cmFold(p.r*(1.5+4.0*d)+spin*.31),
    cmFold(p.g*(1.2+3.4*d)-spin*.24),
    cmFold(p.b*(1.8+3.2*d)+spin*.18));
  return mix(f,f.brg,.25*d);`,
  String.raw`float theta=spin*.65;
  vec2 r=mat2(cos(theta),-sin(theta),sin(theta),cos(theta))*ab;
  r=vec2(-r.x*(.7+1.4*d),mix(r.y,-r.y,d));
  r=mat2(cos(-theta),-sin(-theta),sin(-theta),cos(-theta))*r;
  return cmFromLab(vec3(lab.x,r));`,
  String.raw`float hue=atan(ab.y,ab.x)/CM_TAU;
  float count=floor(3.0+d*9.0);
  float folded=abs(fract((hue+spin/CM_TAU)*count)-.5)*2.0;
  float h=folded/count+variation*.37;
  return cmFromLab(vec3(lab.x,length(ab)*vec2(cos(h*CM_TAU),sin(h*CM_TAU))));`,
  String.raw`float scale=1.5+6.0*d;
  vec3 p=original+vec3(original.g-original.b,original.b-original.r,original.r-original.g)*(.15+.55*d);
  vec3 m=fract(p*vec3(scale,scale*.87,scale*1.13)+vec3(spin*.16,-spin*.11,variation));
  return clamp(m,0.0,1.0);`,
  String.raw`vec2 z=ab*2.8;
  vec2 aa=vec2(cos(spin),sin(spin))*(.5+1.4*d);
  vec2 bb=vec2(.33*variation,-.27);
  vec2 cc=vec2(.25+.85*d,-.25+variation*.5);
  vec2 num=cmComplexMul(aa,z)+bb;
  vec2 den=cmComplexMul(cc,z)+vec2(1.0,0.0);
  vec2 m=vec2(num.x*den.x+num.y*den.y,num.y*den.x-num.x*den.y)/
    max(.035,dot(den,den));
  vec2 bounded=m/(1.0+.55*length(m));
  return cmFromLab(vec3(lab.x,bounded*.25));`,
  String.raw`vec2 z=ab*3.1+vec2(.13,-.17);
  vec2 c=vec2(-.75+.32*d+.12*cos(spin),.12+.48*variation+.12*sin(spin));
  float escape=0.0;
  for(int i=0;i<6;i++){
    z=cmComplexMul(z,z)+c;
    float norm2=dot(z,z);
    escape+=smoothstep(1.0,4.0,norm2)*.15;
    z=clamp(z,vec2(-2.0),vec2(2.0));
  }
  float h=atan(z.y,z.x)+spin*.13+escape*2.2;
  float r=clamp(length(z)*.09+.08+.16*d,.04,.4);
  return cmFromLab(vec3(lab.x,r*vec2(cos(h),sin(h))));`,
  String.raw`vec2 p=ab*3.2+vec2(.14,-.16);
  float a=-2.0+.8*d,b=-1.5+variation*.8;
  float c=1.3+variation*.5,f=.6+.7*d;
  for(int i=0;i<5;i++){
    p=vec2(sin(a*p.y)+c*cos(a*p.x),
      sin(b*p.x)+f*cos(b*p.y));
    p=clamp(p,vec2(-2.5),vec2(2.5));
  }
  float ang=atan(p.y,p.x)+spin*.18;
  return cmFromLab(vec3(lab.x,(.15+.14*d)*vec2(cos(ang),sin(ang))));`,
  String.raw`float rate=3.1+.88*d;
  vec3 v=clamp(original*.85+.06+variation*.09,vec3(.001),vec3(.999));
  for(int i=0;i<6;i++){
    v=clamp(rate*v*(vec3(1.0)-v),vec3(.0001),vec3(.9999));
    v=mix(v,v.gbr,.13*variation);
  }
  return mix(v,v.brg,.35*d);`,
  String.raw`vec3 p=original-.5;
  float a=spin*.5;
  p.xy=mat2(cos(a),-sin(a),sin(a),cos(a))*p.xy;
  p.yz=mat2(cos(a*.7),-sin(a*.7),sin(a*.7),cos(a*.7))*p.yz;
  vec3 f=abs(p);
  float folded=(f.r+f.g+f.b)*(.3+.7*d);
  vec3 q=vec3(f.g,f.b,f.r)+vec3(folded)*.17;
  return clamp(q*(1.8+.55*d),0.0,1.0);`,
  String.raw`float angle=atan(ab.y,ab.x)/CM_TAU;
  float spectral=fract(angle*1.7+lab.x*.82+spin*.08+.23*variation);
  vec3 spectralDye=palette(spectral);
  vec3 thermal=vec3(cmFold(spectral*1.8),cmFold(spectral*1.8+.31),cmFold(spectral*1.8+.66));
  return mix(spectralDye,thermal,.2+.68*d);`,
  String.raw`vec3 v=floor(clamp(original,0.0,1.0)*(4.0+20.0*d));
  float count=5.0+floor(variation*12.0);
  for(int i=0;i<5;i++){
    v=mod(v*vec3(3.0,5.0,7.0)+vec3(v.g,v.b,v.r)+
      vec3(1.0,3.0,5.0)+floor(spin*.5),count);
  }
  return clamp(v/max(1.0,count-1.0),0.0,1.0);`,
];
export const colorMathGLSL=header;
export function specializeColorMathGLSL(index){
  if(!Number.isInteger(index)||index<1||index>=colorMathModes.length)return "";
  return header.replace("/* COLOR_MATH_LAW */",laws[index]);
}
