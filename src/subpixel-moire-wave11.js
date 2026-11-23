// Shader Vault Wave 11: Subpixel Moiré & Chromatic Cannibalism
// Source: shaderslop_designs/by_math/08_waves_interference_moire_cymatics/
// subpixel-moire.js (dual RGB triad masks, direct vs cross-channel
// interference, slow mismatch/drift and curved screen geometry).
// New shader shares native palette/time/geometry of Glitchbitch, rather
// than importing the Three.js standalone renderer. No new FBO or codec.
export const spxModes=["Shadowmask Silk","Chromatic Cannibalism","Prism Bruise","Optical Rosette","Ghost Screen Cathedral"];
export const spxControls=["spxAmount","spxDensity","spxMismatch","spxAngle","spxDrift","spxCurvature","spxFlicker","spxCross","spxRelief","spxHue","spxBleed","spxVariation"];
export const spxPresets=[
  {
    "name": "Soft CRT Silk",
    "spxMode": "Shadowmask Silk",
    "spxAmount": 42,
    "spxDensity": 48,
    "spxMismatch": 30,
    "spxAngle": 11,
    "spxDrift": 25,
    "spxCurvature": 22,
    "spxFlicker": 16,
    "spxCross": 32,
    "spxRelief": 39,
    "spxHue": 29,
    "spxBleed": 44,
    "spxVariation": 30
  },
  {
    "name": "Cross-Channel Carnivore",
    "spxMode": "Chromatic Cannibalism",
    "spxAmount": 96,
    "spxDensity": 73,
    "spxMismatch": 77,
    "spxAngle": 62,
    "spxDrift": 52,
    "spxCurvature": 57,
    "spxFlicker": 25,
    "spxCross": 94,
    "spxRelief": 89,
    "spxHue": 48,
    "spxBleed": 92,
    "spxVariation": 64
  },
  {
    "name": "Prism Eye Bruise",
    "spxMode": "Prism Bruise",
    "spxAmount": 93,
    "spxDensity": 61,
    "spxMismatch": 87,
    "spxAngle": 75,
    "spxDrift": 46,
    "spxCurvature": 74,
    "spxFlicker": 57,
    "spxCross": 90,
    "spxRelief": 74,
    "spxHue": 78,
    "spxBleed": 90,
    "spxVariation": 83
  },
  {
    "name": "Printing-Press Mirage",
    "spxMode": "Optical Rosette",
    "spxAmount": 83,
    "spxDensity": 82,
    "spxMismatch": 73,
    "spxAngle": 56,
    "spxDrift": 38,
    "spxCurvature": 64,
    "spxFlicker": 35,
    "spxCross": 83,
    "spxRelief": 96,
    "spxHue": 31,
    "spxBleed": 78,
    "spxVariation": 58
  },
  {
    "name": "Dead Pixel Cathedral",
    "spxMode": "Ghost Screen Cathedral",
    "spxAmount": 99,
    "spxDensity": 79,
    "spxMismatch": 98,
    "spxAngle": 88,
    "spxDrift": 65,
    "spxCurvature": 89,
    "spxFlicker": 71,
    "spxCross": 100,
    "spxRelief": 92,
    "spxHue": 68,
    "spxBleed": 100,
    "spxVariation": 93
  },
  {
    "name": "Barely-There Film",
    "spxMode": "Shadowmask Silk",
    "spxAmount": 28,
    "spxDensity": 32,
    "spxMismatch": 18,
    "spxAngle": 18,
    "spxDrift": 20,
    "spxCurvature": 12,
    "spxFlicker": 5,
    "spxCross": 15,
    "spxRelief": 19,
    "spxHue": 37,
    "spxBleed": 21,
    "spxVariation": 24
  }
];
export function applySpxPreset(state,name){
  const match=spxPresets.find(x=>x.name===name);
  if(!match)return state;
  const {name:_label,...fields}=match;
  return {...state,...fields};
}
const unit=random=>{
  const value=Number(random());
  return Number.isFinite(value)?Math.max(0,Math.min(1-Number.EPSILON,value)):0;
};
export function shuffleSpx(state,random=Math.random){
  const next={...state,
    spxMode:spxModes[Math.floor(unit(random)*spxModes.length)]};
  for(const key of spxControls)next[key]=key==="spxAmount"
    ?38+unit(random)*62:unit(random)*100;
  return next;
}
export const hideSpx=state=>({...state,spxAmount:0});
export const spxGLSL="// Two physical-style RGB shadow masks at mismatched frequency/angle.\n// Cross-products (R*G, R*B, G*B) create new secondary interference\n// rather than simply alpha-blending two colored grids.\nuniform int spxMode;\nuniform float spxAmount,spxDensity,spxMismatch,spxAngle,spxDrift;\nuniform float spxCurvature,spxFlicker,spxCross,spxRelief,spxHue;\nuniform float spxBleed,spxVariation;\n\nvec3 spxTriad(vec2 q) {\n  vec2 f=fract(q);\n  float r=smoothstep(.01,.08,f.x)*(1.0-smoothstep(.27,.33,f.x));\n  float g=smoothstep(.34,.41,f.x)*(1.0-smoothstep(.60,.67,f.x));\n  float b=smoothstep(.68,.75,f.x)*(1.0-smoothstep(.92,.99,f.x));\n  float mask=smoothstep(.03,.19,f.y)*(1.0-smoothstep(.77,.96,f.y));\n  return vec3(r,g,b)*mask;\n}\nvec3 spxInterference(vec2 uv,vec2 p,float sceneColorPhase,vec3 baseColor) {\n  // 5+ physical pixels per stripe at small preview resolutions where\n  // possible. No fixed 300-strip alias bomb in low-res iPhone previews.\n  float cells=min(28.0+spxDensity*146.0,max(18.0,res.y/5.2));\n  vec2 aspect=vec2(res.x/max(res.y,1.0),1.0);\n  vec2 q=(uv-.5)*aspect;\n  float seedPhase=seed*.00117+seedHigh*.027+spxVariation*TAU;\n  float t=time*(.025+.34*spxDrift);\n  float r2=dot(q,q);\n  q*=1.0+r2*spxCurvature*.27;\n  // Microscopic curvature follows the *real* current geometry and field.\n  q+=.021*spxCurvature*vec2(\n    sin(p.y*2.3+sceneColorPhase*1.7+t),\n    cos(p.x*2.5-sceneColorPhase*1.3-t*.8));\n  float tilt=.013+spxAngle*.13+.006*sin(t*.22);\n  float unequal=1.006+spxMismatch*.066;\n  vec2 shiftA=vec2(sin(t*.63+seedPhase),cos(t*.4-seedPhase))*.22;\n  vec2 shiftB=vec2(cos(t*.51+seedPhase*.3),-sin(t*.7-seedPhase*.4))*.26;\n  vec3 a=spxTriad(rotate(t*.018)*q*cells+shiftA);\n  vec3 b=spxTriad(rotate(tilt+t*.014)*q*cells*unequal+shiftB);\n  float aligned=dot(a,b)*.83;\n  float rg=a.r*b.g+a.g*b.r;\n  float rb=a.r*b.b+a.b*b.r;\n  float gb=a.g*b.b+a.b*b.g;\n  vec3 beats=vec3(rg+rb,rg+gb,rb+gb);\n  float collision=dot(beats,vec3(.3333));\n  float breath=.82+.18*sin(t*(1.3+spxFlicker*4.3)+r2*6.);\n  float strobe=mix(1.0,breath,spxFlicker);\n  float raw=clamp(aligned*(.7+.8*spxRelief)+\n                  collision*(.65+1.6*spxCross),0.0,1.0);\n  float phase=spxHue+colorTime*.017+seedPhase*.017+\n       sceneColorPhase*.02+spxVariation*.19;\n  vec3 inkA=palette(phase+q.x*.17);\n  vec3 inkB=palette(phase+.33+q.y*.13);\n  vec3 inkC=palette(phase+.67+(q.x-q.y)*.12);\n  // Each of the three pair products is assigned its own editable\n  // palette phase, preserving user chromatics rather than fixed RGB hues.\n  vec3 chroma=(inkA*rg+inkB*rb+inkC*gb)/\n              max(.18,rg+rb+gb);\n  vec3 iridescent=palette(phase+raw*.34+sin(t*.37)*.1);\n  float amt=clamp(spxAmount,0.0,1.0);\n  float bright=clamp(raw*1.9*strobe,0.0,1.0);\n  vec3 target=baseColor;\n  if(spxMode==0) { // Shadowmask Silk: subtle conventional screen finish\n    target=baseColor*(.71+.30*aligned)+\n           mix(iridescent,chroma,.48)*bright*.55;\n    return mix(baseColor,target,amt*(.2+.52*spxBleed));\n  }\n  if(spxMode==1) { // Chromatic Cannibalism: mixed-channel crossbeats\n    target=baseColor*(.38+.32*aligned)+\n           chroma*bright*(.57+1.1*spxCross)+\n           iridescent*aligned*.24;\n    return mix(baseColor,target,amt*(.38+.59*spxBleed));\n  }\n  if(spxMode==2) { // Prism Bruise: bleeding opposite sidebands\n    float crest=sin((q.x+q.y)*TAU*(2.0+spxMismatch*7.0)+t);\n    vec3 fringe=palette(phase+.5+crest*.23);\n    target=baseColor*(.46+.44*raw)+\n           mix(chroma,fringe,.48+.4*spxBleed)*bright*1.1;\n    return mix(baseColor,target,amt*(.34+.61*spxBleed));\n  }\n  if(spxMode==3) { // Optical Rosette: moire beat resonating with relief\n    float rosette=pow(.5+.5*cos(\n      atan(q.y,q.x)*8.0+length(q)*TAU*(3.0+spxMismatch*8.0)-t),3.0);\n    float lace=clamp(bright*(.45+.85*rosette),0.0,1.0);\n    target=baseColor*(.5+.37*aligned)+\n           mix(chroma,iridescent,rosette)*lace;\n    return mix(baseColor,target,amt*(.33+.66*spxRelief));\n  }\n  // Ghost Screen Cathedral: architectural dark gaps and radiant hits\n  float gate=pow(clamp(.5+.5*sin(\n    length(q)*TAU*(6.0+spxDensity*8.0)-t*.8+\n    atan(q.y,q.x)*6.0),0.0,1.0),2.0);\n  float glow=clamp(bright*(.5+gate*1.7),0.0,1.0);\n  target=baseColor*(.25+.6*(1.0-glow))+\n         mix(chroma,iridescent,gate)*glow*(.8+spxCross*.9);\n  return mix(baseColor,target,amt*(.32+.66*spxBleed));\n}";
