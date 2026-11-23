// Glitchbitch Shader Vault Wave 10 — G2-inspired Torsion Membranes
// Grounded in shaderslop_designs/by_math/11_hyperbolic_non_euclidean_higher_dimensions/
// g2-holonomy.js and g2-membrane.js: competing direction/dual fields,
// torsion-driven geometric wounds, structural colour and healing veins.
// "G2" is the source artwork's *symbolic grammar*, not a numerical simulation
// of exceptional 7D holonomy. Original shader code adapted for WebGL1/2.
export const g2Modes=["Torsion Silk","Kintsugi Ruptures","Photonic Tectonics","Living G₂ Chamber","Scar-Crown Cathedral"];
export const g2Controls=["g2Amount","g2Scale","g2Warp","g2Motion","g2Torsion","g2Fracture","g2Veins","g2Sheen","g2Hue","g2Variation","g2Dispersion"];
export const g2Presets=[
  {
    "name": "Opaline Torsion Satin",
    "g2Mode": "Torsion Silk",
    "g2Amount": 88,
    "g2Scale": 57,
    "g2Warp": 46,
    "g2Motion": 50,
    "g2Torsion": 74,
    "g2Fracture": 58,
    "g2Veins": 91,
    "g2Sheen": 89,
    "g2Hue": 28,
    "g2Variation": 47,
    "g2Dispersion": 76
  },
  {
    "name": "Broken Kintsugi Halo",
    "g2Mode": "Kintsugi Ruptures",
    "g2Amount": 96,
    "g2Scale": 65,
    "g2Warp": 73,
    "g2Motion": 43,
    "g2Torsion": 91,
    "g2Fracture": 97,
    "g2Veins": 93,
    "g2Sheen": 95,
    "g2Hue": 71,
    "g2Variation": 63,
    "g2Dispersion": 87
  },
  {
    "name": "Prismatic Photonic Skin",
    "g2Mode": "Photonic Tectonics",
    "g2Amount": 93,
    "g2Scale": 83,
    "g2Warp": 55,
    "g2Motion": 54,
    "g2Torsion": 67,
    "g2Fracture": 49,
    "g2Veins": 95,
    "g2Sheen": 100,
    "g2Hue": 44,
    "g2Variation": 81,
    "g2Dispersion": 98
  },
  {
    "name": "Strange Living Membrane",
    "g2Mode": "Living G₂ Chamber",
    "g2Amount": 96,
    "g2Scale": 47,
    "g2Warp": 79,
    "g2Motion": 77,
    "g2Torsion": 84,
    "g2Fracture": 62,
    "g2Veins": 70,
    "g2Sheen": 87,
    "g2Hue": 59,
    "g2Variation": 73,
    "g2Dispersion": 62
  },
  {
    "name": "Serrated Jewel Cathedral",
    "g2Mode": "Scar-Crown Cathedral",
    "g2Amount": 98,
    "g2Scale": 72,
    "g2Warp": 91,
    "g2Motion": 61,
    "g2Torsion": 95,
    "g2Fracture": 93,
    "g2Veins": 100,
    "g2Sheen": 100,
    "g2Hue": 86,
    "g2Variation": 90,
    "g2Dispersion": 100
  },
  {
    "name": "Soft Botanical Opal",
    "g2Mode": "Living G₂ Chamber",
    "g2Amount": 71,
    "g2Scale": 37,
    "g2Warp": 22,
    "g2Motion": 33,
    "g2Torsion": 46,
    "g2Fracture": 32,
    "g2Veins": 64,
    "g2Sheen": 86,
    "g2Hue": 23,
    "g2Variation": 24,
    "g2Dispersion": 65
  }
];
export function applyG2Preset(state,name){
  const p=g2Presets.find(x=>x.name===name);
  if(!p)return state;
  const {name:_label,...fields}=p;
  return {...state,...fields};
}
function boundedUnit(random){
  const n=Number(random());
  return Number.isFinite(n)?Math.max(0,Math.min(n,1-Number.EPSILON)):0;
}
export function shuffleG2(state,random=Math.random){
  const next={...state,g2Mode:g2Modes[Math.floor(boundedUnit(random)*g2Modes.length)]};
  for(const k of g2Controls)next[k]=k==="g2Amount"
    ?40+60*boundedUnit(random):100*boundedUnit(random);
  return next;
}
export const hideG2=state=>({...state,g2Amount:0});
export const g2GLSL="uniform int g2Mode;\nuniform float g2Amount,g2Scale,g2Warp,g2Motion,g2Torsion,g2Fracture;\nuniform float g2Veins,g2Sheen,g2Hue,g2Variation,g2Dispersion;\n\n// Adapted from the source vault's G2 *symbolic* orientation + dual\n// response geometry. This is not a simulation of exceptional G2 holonomy.\n// Two bounded folds; no textures, FBOs or ray marching.\nvec4 g2Membrane(inout vec2 p){\n  float t=time*(.018+.23*g2Motion);\n  float id=g2Variation*TAU+seed*.00071+seedHigh*.011;\n  float frequency=.65+g2Scale*2.8;\n  vec2 q=p*frequency+vec2(sin(id),cos(id))*1.9;\n  float strain=.18+.67*g2Torsion;\n  for(int i=0;i<2;i++){\n    float fi=float(i);\n    vec2 v=vec2(sin(q.y*(1.3+fi*.36)+t*(.8+fi*.23)),\n                cos(q.x*(1.6+fi*.23)-t*(.61+fi*.29)));\n    q+=v*strain*.24;\n    q=rotate(.18+fi*.29)*q;\n  }\n  vec3 phi=normalize(vec3(sin(q.x*1.8+t*.63),\n                            cos(q.y*1.6-t*.57),\n                            sin(q.x*q.y*.14+t*.32))+.0001);\n  vec3 dual=normalize(vec3(-phi.y,phi.x,\n                      cos((q.x-q.y)*1.7-t*.5))+.0001);\n  float torsion=clamp(abs(dot(phi,dual)),0.0,1.0);\n  float displacement=sin(length(q)*(4.5+g2Veins*7.0)\n                       -t*1.5+phi.z*3.0);\n  float stress=abs(phi.x-dual.y)*.55+torsion*.65;\n  float fracture=smoothstep(.42,.83,\n     (.5+.5*displacement)*(.48+.72*g2Fracture)+stress*.43);\n  float cellular=sin(q.x*5.7+phi.z*2.4)\n                 *cos(q.y*4.9-dual.z*2.1);\n  float vein=pow(.5+.5*cos((torsion*6.0+\n          cellular*(.6+g2Veins*2.1))*TAU),5.0);\n  float aperture=fracture;\n  float relief=sin(q.x*2.6+torsion*4.0+t)*\n               cos(q.y*2.4-dual.z*3.0-t*.6);\n  vec2 direction=normalize(phi.xy+dual.xy*.32+vec2(.001));\n  vec2 bend=direction*(torsion-.37);\n  if(g2Mode==0){ // Satin-like directional torsion.\n    bend+=vec2(-direction.y,direction.x)*vein*.35;\n  }else if(g2Mode==1){ // Wounds tear the woven manifold.\n    bend+=vec2(-direction.y,direction.x)*aperture*.8;\n  }else if(g2Mode==2){ // Structural photonic tiles.\n    bend+=vec2(cellular,-cellular)*.27;\n  }else if(g2Mode==3){ // Living organic chambers.\n    bend+=direction*relief*.55;\n  }else { // Scar crowns and radiant stress rays.\n    bend+=q/(1.0+length(q))*(vein+.45*fracture);\n  }\n  float damp=1.0/(1.0+length(p)*.08);\n  p+=bend*g2Warp*g2Amount*(.17+.24*g2Torsion)*damp;\n  return vec4(torsion,aperture,vein,relief);\n}\n\nvec3 g2Dress(vec3 col,vec4 field,vec2 p){\n  float tor=field.x,crack=field.y,vein=field.z,relief=field.w;\n  float ridge=pow(clamp(.5+.5*relief,0.0,1.0),3.0);\n  float shimmer=pow(clamp(.5+.5*sin(\n    dot(p,vec2(.83,1.17))*(6.0+g2Veins*12.0)\n      +tor*8.0+time*(.04+.27*g2Motion)),0.0,1.0),7.0);\n  float jewel=clamp(ridge*.34+vein*.49+shimmer*.36,0.0,1.0);\n  float chromaPhase=g2Hue+tor*.29+relief*.16+\n     (colorTime*.014+g2Variation*.31);\n  vec3 film=palette(chromaPhase);\n  float white=.4+.6*pow(jewel,2.0);\n  vec3 shine=mix(film,vec3(1.0),white*.65);\n  if(g2Mode==0){ // Torsion silk: prismatic embossing\n    col=mix(col,col*(.62+.36*ridge)+film*(.3+.95*jewel),\n            g2Amount*(.25+.55*g2Sheen));\n  }else if(g2Mode==1){ // Kintsugi rupture: dark fractures with lit rims\n    col=mix(col,col*(1.0-crack*.79),\n            g2Amount*(.36+.54*g2Fracture));\n    col+=shine*(vein*(.36+.95*g2Veins)+crack*.28)*\n         g2Amount*g2Sheen;\n  }else if(g2Mode==2){ // Photonic cells: optical relief\n    col=mix(col,film*(.26+.69*ridge)+col*.35,\n            g2Amount*(.25+.45*g2Sheen));\n    col+=shine*(.3+jewel)*g2Sheen*g2Amount*.54;\n  }else if(g2Mode==3){ // Organic chambers: light within membranes\n    float core=smoothstep(.20,.72,1.0-crack);\n    col=mix(col,col*(.42+.56*core)+film*(.22+.75*jewel),\n            g2Amount*(.3+.54*g2Fracture));\n  }else{ // Crown scars and gold-in-glass photonic seams\n    col=mix(col,col*(.48+.49*ridge)+film*(.24+.84*jewel),\n            g2Amount*.67);\n    col+=shine*(vein+.28*crack)*g2Amount*g2Sheen*.82;\n  }\n  // Spectral channel divergence tracks *actual* field torsion and seams.\n  // Palette-derived, not hard-coded RGB paint; no extra texture sampling.\n  float separation=g2Dispersion*g2Amount*(.10+.30*tor+.27*crack);\n  vec3 prism=palette(chromaPhase+separation*.13);\n  col.r+=g2Amount*g2Sheen*separation*(shine.r+prism.r)*.40;\n  col.b+=g2Amount*g2Sheen*separation*(shine.b+prism.b)*.40;\n  return col;\n}\n";
