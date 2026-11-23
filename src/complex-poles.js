// GLITCHBITCH | Shader Vault Wave 3 | Complex Poles & Zeros
// Source: shaderslop_designs/art_20260709_142745.html
// Bounded, actual rational-map coordinate transformation, not RGB displacement.
export const polesModes=[
  "Rational Bloom",
  "Pole Vortex",
  "Zero Gravity",
  "Phase Web",
  "Impossible Lattice"
];
export const polesControls=[
  "polesAmount","polesScale","polesWarp","polesOrbit","polesMotion",
  "polesSoftness","polesZeroPull","polesFiligree","polesGlow",
  "polesHue","polesVariation"
];
export const polesPresets=[
  {name:"Singularity Lace",polesMode:"Rational Bloom",
    polesAmount:88,polesScale:57,polesWarp:77,polesOrbit:42,polesMotion:45,
    polesSoftness:42,polesZeroPull:63,polesFiligree:86,polesGlow:73,
    polesHue:25,polesVariation:36},
  {name:"Vortex Cathedral",polesMode:"Pole Vortex",
    polesAmount:95,polesScale:39,polesWarp:89,polesOrbit:78,polesMotion:72,
    polesSoftness:57,polesZeroPull:19,polesFiligree:62,polesGlow:84,
    polesHue:79,polesVariation:61},
  {name:"Five-Fold Gravity Well",polesMode:"Zero Gravity",
    polesAmount:93,polesScale:68,polesWarp:88,polesOrbit:37,polesMotion:57,
    polesSoftness:72,polesZeroPull:100,polesFiligree:53,polesGlow:67,
    polesHue:47,polesVariation:14},
  {name:"Chromatic Pole Web",polesMode:"Phase Web",
    polesAmount:84,polesScale:73,polesWarp:68,polesOrbit:59,polesMotion:61,
    polesSoftness:39,polesZeroPull:64,polesFiligree:96,polesGlow:91,
    polesHue:72,polesVariation:82},
  {name:"Impossible Embroidery",polesMode:"Impossible Lattice",
    polesAmount:100,polesScale:51,polesWarp:95,polesOrbit:66,polesMotion:74,
    polesSoftness:58,polesZeroPull:76,polesFiligree:91,polesGlow:98,
    polesHue:91,polesVariation:49}
];
export function applyPolesPreset(state,name){
  const preset=polesPresets.find(item=>item.name===name);
  if(!preset)return state;
  const {name:_label,...fields}=preset;
  return {...state,...fields};
}
const boundedRandom=random=>{
  const n=Number(random());
  return Number.isFinite(n)?Math.max(0,Math.min(n,1-Number.EPSILON)):0;
};
export function shufflePoles(state,random=Math.random){
  const next={...state,polesMode:polesModes[
    Math.floor(boundedRandom(random)*polesModes.length)]};
  for(const key of polesControls)
    next[key]=key==="polesAmount"
      ? 35+boundedRandom(random)*65
      : 5+boundedRandom(random)*95;
  return next;
}
export const hidePoles=state=>({...state,polesAmount:0});

export const polesGLSL = "uniform int polesMode;\nuniform float polesAmount,polesScale,polesWarp,polesOrbit,polesMotion;\nuniform float polesSoftness,polesZeroPull,polesFiligree,polesGlow,polesHue,polesVariation;\n\nvec2 pzMultiply(vec2 a,vec2 b){\n  return vec2(a.x*b.x-a.y*b.y,a.x*b.y+a.y*b.x);\n}\nvec2 pzDivide(vec2 numerator,vec2 denominator,float safeRadius){\n  float norm2=max(dot(denominator,denominator),safeRadius*safeRadius);\n  return vec2(dot(numerator,denominator),\n              numerator.y*denominator.x-numerator.x*denominator.y)/norm2;\n}\nvec2 pzBound(vec2 v,float tension){\n  return v/(1.0+length(v)*tension);\n}\n\n// Non-destructive domain warp from the rational map (z^5 - 1)/(z^2 + a(t)).\n// The epsilon and bounded vectors protect mobile GPUs around singularities.\nvec2 pzWarpPoint(vec2 p,out vec4 diagnostics){\n  float t=time*(.045+.34*polesMotion);\n  float spin=polesVariation*TAU+seed*.00037+seedHigh*.013;\n  vec2 z=rotate(spin*.35)*p*(.17+.34*polesScale);\n  z=pzBound(z,.075);\n  vec2 z2=pzMultiply(z,z);\n  vec2 z4=pzMultiply(z2,z2);\n  vec2 z5=pzMultiply(z4,z);\n  vec2 numerator=z5-vec2(1.0,0.0);\n  float poleAngle=t*1.35+spin*.83;\n  vec2 movingPole=(.11+.64*polesOrbit)*vec2(cos(poleAngle),sin(poleAngle));\n  vec2 denominator=z2+movingPole;\n  float safeRadius=mix(.025,.26,polesSoftness);\n  vec2 rational=pzDivide(numerator,denominator,safeRadius);\n  float amplitude=length(rational);\n  float poleRange=length(denominator);\n  float poleGlow=1.0/(1.0+poleRange*(4.0+2.0*polesSoftness));\n  float zeroGlow=1.0/(1.0+length(numerator)*3.8);\n  float phase=atan(rational.y,rational.x);\n  float density=mix(4.0,21.0,polesFiligree);\n  float phaseRidges=pow(.5+.5*cos(phase*density+\n      log(1.0+amplitude)*2.7-t*.62),9.0);\n  diagnostics=vec4(fract(phase/TAU+.5),poleGlow,zeroGlow,phaseRidges);\n\n  vec2 rationalFlow=pzBound(rational,.52);\n  vec2 poleSwirl=vec2(-denominator.y,denominator.x)/\n    max(length(denominator),safeRadius);\n  // Newton correction converges on ALL FIVE fifth roots of unity.\n  vec2 newton=pzDivide(numerator,5.0*z4,safeRadius);\n  vec2 zeroAttractor=-pzBound(newton,1.0)*polesZeroPull*(.28+.72*zeroGlow);\n  vec2 direction=rationalFlow;\n  if(polesMode==1){\n    direction=mix(rationalFlow,poleSwirl*(.55+.75*poleGlow),.86);\n  }else if(polesMode==2){\n    direction=mix(rationalFlow,zeroAttractor*2.1,.88);\n  }else if(polesMode==3){\n    vec2 phaseFlow=vec2(cos(phase*density*.5+t*.17),\n                        sin(phase*density*.5-t*.17));\n    direction=mix(rationalFlow,phaseFlow*(.4+.6*phaseRidges),.73);\n  }else if(polesMode==4){\n    direction=mix(rationalFlow,poleSwirl, .42)+\n      .55*vec2(sin(phase*density*.29+t),cos(phase*density*.29-t));\n  }\n  direction+=zeroAttractor*.65;\n  direction=pzBound(direction,.35);\n  float fieldExtent=.3+.7/(1.0+length(z)*.15);\n  // Max displacement remains finite even exactly on a denominator zero.\n  vec2 delta=direction*(.055+.50*polesWarp)*polesAmount*fieldExtent;\n  return p+delta;\n}\n\nvec3 pzDressColor(vec3 col,vec4 d){\n  float sheen=polesAmount*polesGlow;\n  float contour=d.w*sheen;\n  float eventHaze=(d.y*.64+d.z*.62)*sheen;\n  vec3 ink=palette(fract(d.x+.6*polesHue+colorTime*.004));\n  col+=ink*(contour*.66+eventHaze*.26);\n  col=mix(col,col*(.87+.32*d.y)+ink*.22,\n          clamp(sheen*d.z*.26,0.0,.35));\n  col+=vec3(1.0)*contour*.11;\n  return col;\n}";
