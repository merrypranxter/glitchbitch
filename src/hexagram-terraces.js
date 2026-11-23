// GLITCHBITCH — Hexagram Terraces, source: acid-iching.js in shaderslop_designs.
// This is a 2D, palette-aware six-bit relief field, not divination software.
// Kept optional to avoid paying for six noise evaluations on vintage recipes.
export const hexagramControls=[
  "hexagramAmount","hexagramScale","hexagramWarp","hexagramMotion",
  "hexagramRelief","hexagramBorder","hexagramHue","hexagramCoupling",
  "hexagramVariation","hexagramThreshold"
];
export const hexagramPresets=[
  {name:"Gilded Faultlines",hexagramAmount:80,hexagramScale:61,
   hexagramWarp:39,hexagramMotion:37,hexagramRelief:89,
   hexagramBorder:56,hexagramHue:14,hexagramCoupling:75,
   hexagramVariation:21,hexagramThreshold:48},
  {name:"Oracle Resin",hexagramAmount:94,hexagramScale:43,
   hexagramWarp:67,hexagramMotion:54,hexagramRelief:91,
   hexagramBorder:87,hexagramHue:80,hexagramCoupling:90,
   hexagramVariation:45,hexagramThreshold:51},
  {name:"Bit Orchard",hexagramAmount:77,hexagramScale:83,
   hexagramWarp:23,hexagramMotion:61,hexagramRelief:59,
   hexagramBorder:38,hexagramHue:57,hexagramCoupling:74,
   hexagramVariation:69,hexagramThreshold:37},
  {name:"Changelings Brocade",hexagramAmount:85,hexagramScale:66,
   hexagramWarp:80,hexagramMotion:72,hexagramRelief:78,
   hexagramBorder:74,hexagramHue:34,hexagramCoupling:97,
   hexagramVariation:91,hexagramThreshold:62},
  {name:"Quiet Topography",hexagramAmount:48,hexagramScale:29,
   hexagramWarp:12,hexagramMotion:19,hexagramRelief:55,
   hexagramBorder:23,hexagramHue:25,hexagramCoupling:42,
   hexagramVariation:14,hexagramThreshold:50}
];
export function applyHexagramPreset(state,name){
  const preset=hexagramPresets.find(p=>p.name===name);
  if(!preset)return state;
  return {...state,...Object.fromEntries(hexagramControls.map(k=>[k,preset[k]]))};
}
const unit=(random)=>{
  const n=Number(random());
  return Number.isFinite(n)?Math.max(0,Math.min(n,1-Number.EPSILON)):0;
};
export function remixHexagram(state,random=Math.random){
  const out={...state};
  for(const key of hexagramControls)
    out[key]=key==="hexagramAmount" ?
      40+unit(random)*60 : 6+unit(random)*94;
  return out;
}
export const disableHexagram=(state)=>({...state,hexagramAmount:0});

export const hexagramGLSL = "uniform float hexagramAmount,hexagramScale,hexagramWarp,hexagramMotion;\nuniform float hexagramRelief,hexagramBorder,hexagramHue,hexagramCoupling;\nuniform float hexagramVariation,hexagramThreshold;\n\n// Six individually thresholded noise fields, each domain-warped by the\n// previous bits. This yields 64 possible region identities in a single pass.\nvec4 hexagramTerraceField(vec2 position){\n  float tempo=time*(.015+hexagramMotion*.18);\n  vec2 q=position*(.70+hexagramScale*2.65)\n       +vec2(hexagramVariation*15.13,-hexagramVariation*9.72)\n       +.42*vec2(sin(tempo*.73),cos(tempo*.59));\n  float hexId=0.0;\n  float terrain=0.0;\n  float border=0.0;\n  float changing=0.0;\n  float weight=1.0;\n  float threshold=(hexagramThreshold-.5)*.55;\n  for(int i=0;i<6;i++){\n    float fi=float(i);\n    float n=noise(q*(1.0+fi*.34)+vec2(fi*7.31,fi*11.17)\n      +vec2(tempo*.31,-tempo*.19));\n    float signedNoise=n-.5+threshold;\n    float bit=step(0.0,signedNoise);\n    float proximity=1.0-smoothstep(.009,mix(.045,.19,hexagramBorder),\n      abs(signedNoise));\n    hexId+=bit*exp2(fi);\n    terrain+=(n-.5+(bit-.5)*.43)*weight;\n    border=max(border,proximity);\n    changing+=proximity*exp2(fi)/63.0;\n    // XOR-ghost coupling: a previous bit shifts the next field's coordinates.\n    float angle=fi*2.39996+bit*PI+hexId*.093+tempo*.27;\n    q+=hexagramCoupling*.31*weight*vec2(cos(angle),sin(angle));\n    weight*=.68;\n  }\n  return vec4(hexId/63.0,clamp(border,0.0,1.0),\n    clamp(.5+terrain*.53,0.0,1.0),clamp(changing,0.0,1.0));\n}\n\nvec2 hexagramTerraceWarp(vec2 p,vec4 terrace){\n  float phase=terrace.x*TAU*7.0+time*(.025+hexagramMotion*.1);\n  vec2 shove=vec2(cos(phase),sin(phase))*(.35+.65*terrace.y);\n  vec2 lift=vec2(terrace.z-.5,.5-terrace.z);\n  return p+hexagramAmount*hexagramWarp*(shove*.28+lift*.21);\n}\n\nvec3 hexagramTerraceColor(vec3 col,vec4 terrace){\n  vec3 region=palette(fract(terrace.x*.985+hexagramHue*.8+colorTime*.012));\n  // The existing palette and all earlier painting remain the source of hue.\n  float coverage=hexagramAmount*(.27+.28*hexagramRelief);\n  col=mix(col,region*(.7+.64*terrace.z),coverage);\n  float crests=pow(terrace.y,1.5)*hexagramAmount*hexagramRelief;\n  col+=crests*mix(region,vec3(1.0),.70)*.83;\n  col+=hexagramAmount*terrace.w*hexagramRelief*.20*\n    palette(fract(terrace.x+hexagramHue*.5+.24));\n  col*=1.0+hexagramAmount*hexagramRelief*(terrace.z-.5)*.23;\n  return col;\n}";
