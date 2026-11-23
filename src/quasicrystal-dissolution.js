// Glitchbitch / Shader Vault — Wave 4: Order → Dissolution Quasicrystal
// Inspired by shaderslop_designs/quasicrystal-oscillator.html:
// its seven-wave interference and time-dependent row tears / quantization.
// Adapted as a reversible, opt-in geometry and color field using the app's
// existing clocks, palette, renderer, preview and strict export pipeline.
export const qdModes=[
  "Crystal Clockwork",
  "Fractured Brocade",
  "Quasi-Mosaic",
  "Phase Schism",
  "Neon Shrapnel"
];
export const qdOrders=["Fivefold","Sevenfold","Ninefold"];
export const qdControls=[
  "qdAmount","qdDissolve","qdAuto","qdRate","qdDensity","qdTear",
  "qdPixel","qdWarp","qdFiligree","qdHue","qdVariation","qdEdge"
];
export const qdPresets=[
  {name:"Pristine Alien Clock",qdMode:"Crystal Clockwork",qdOrder:"Sevenfold",
   qdAmount:90,qdDissolve:0,qdAuto:0,qdRate:40,qdDensity:58,qdTear:44,
   qdPixel:36,qdWarp:35,qdFiligree:93,qdHue:38,qdVariation:25,qdEdge:84},
  {name:"Faultline Brocade",qdMode:"Fractured Brocade",qdOrder:"Fivefold",
   qdAmount:94,qdDissolve:56,qdAuto:20,qdRate:51,qdDensity:66,qdTear:87,
   qdPixel:23,qdWarp:76,qdFiligree:89,qdHue:65,qdVariation:70,qdEdge:76},
  {name:"Pixel Archaeology",qdMode:"Quasi-Mosaic",qdOrder:"Ninefold",
   qdAmount:97,qdDissolve:83,qdAuto:0,qdRate:54,qdDensity:44,qdTear:65,
   qdPixel:96,qdWarp:51,qdFiligree:52,qdHue:48,qdVariation:40,qdEdge:84},
  {name:"Phase Divorce Court",qdMode:"Phase Schism",qdOrder:"Sevenfold",
   qdAmount:91,qdDissolve:72,qdAuto:48,qdRate:73,qdDensity:68,qdTear:72,
   qdPixel:46,qdWarp:86,qdFiligree:96,qdHue:82,qdVariation:90,qdEdge:92},
  {name:"Glittering Ruin",qdMode:"Neon Shrapnel",qdOrder:"Fivefold",
   qdAmount:100,qdDissolve:94,qdAuto:0,qdRate:77,qdDensity:85,qdTear:95,
   qdPixel:81,qdWarp:96,qdFiligree:95,qdHue:91,qdVariation:94,qdEdge:100},
  {name:"Perfect Loop Mutation",qdMode:"Fractured Brocade",qdOrder:"Sevenfold",
   qdAmount:91,qdDissolve:50,qdAuto:100,qdRate:56,qdDensity:51,qdTear:84,
   qdPixel:80,qdWarp:68,qdFiligree:76,qdHue:58,qdVariation:78,qdEdge:87},
];
export function applyQdPreset(state,name){
  const preset=qdPresets.find(x=>x.name===name);
  if(!preset)return state;
  const {name:_label,...fields}=preset;
  return {...state,...fields};
}
const unit=random=>{
  const n=Number(random());
  return Number.isFinite(n)?Math.max(0,Math.min(1-Number.EPSILON,n)):0;
};
export function shuffleQd(state,random=Math.random){
  const next={...state,
    qdMode:qdModes[Math.floor(unit(random)*qdModes.length)],
    qdOrder:qdOrders[Math.floor(unit(random)*qdOrders.length)]};
  for(const key of qdControls){
    next[key]=key==="qdAmount"?35+unit(random)*65:unit(random)*100;
  }
  return next;
}
export const hideQd=state=>({...state,qdAmount:0});

export const qdGLSL = "uniform float qdAmount,qdDissolve,qdAuto,qdRate,qdDensity,qdTear;\nuniform float qdPixel,qdWarp,qdFiligree,qdHue,qdVariation,qdEdge;\nuniform int qdMode,qdOrder;\n\nfloat qdPhase(){\n  float clock=.5+.5*sin(time*(.07+qdRate*.67)+qdVariation*TAU);\n  return clamp(mix(qdDissolve,clock,qdAuto),0.0,1.0);\n}\n\n// Fixed maximum of nine plane waves; WebGL1-safe loop and no textures/FBOs.\n// The reference shader used seven waves; five and nine are optional variants.\nvec4 qdInterfere(inout vec2 p){\n  float entropy=qdPhase();\n  float phase=time*(.025+.11*qdRate);\n  float cells=mix(1.6,5.8,qdDensity);\n  vec2 x=rotate(phase*.32)*p*cells+vec2(seed*.00091,seedHigh*.0021);\n  vec2 grid=floor(x*(5.0+qdPixel*10.0));\n  float epoch=floor(time*(.35+qdRate*1.45));\n  float strip=floor(x.y*(13.0+qdDensity*19.0));\n  float grain=hash(grid+vec2(epoch,epoch*.17));\n  float stripGrain=hash(vec2(strip,epoch+seed*.0003));\n  float tear=step(1.0-entropy*qdTear*.78,stripGrain);\n  float mosaics=step(1.0-entropy*qdPixel*.82,grain);\n  float tearOffset=(stripGrain-.5)*(0.04+qdTear*.55)*tear;\n  // The rupture changes the spatial inputs of the interference pattern.\n  x.x+=tearOffset*entropy;\n  x+=mosaics*entropy*qdPixel*(floor(x*4.0)/4.0+vec2(grain-.5,stripGrain-.5)-x)*.85;\n\n  vec3 q=vec3(0.0);\n  float arms=float(qdOrder);\n  for(int i=0;i<9;i++){\n    if(i<qdOrder){\n      float a=TAU*float(i)/arms+qdVariation*.13;\n      vec2 k=vec2(cos(a),sin(a));\n      float carrier=dot(x,k)*(3.0+qdFiligree*3.5);\n      float waveDrift=time*(.15+.18*qdRate);\n      float rupture=entropy*qdTear*.27*sin(carrier*.73+waveDrift*2.1);\n      float c=carrier+waveDrift+rupture;\n      vec3 bands=vec3(c,c+2.0943951,c+4.1887902);\n      q+=cos(bands);\n    }\n  }\n  q/=arms;\n  vec3 neat=pow(.5+.5*cos(q*(12.0+qdFiligree*18.0)),vec3(1.9));\n  float crystalline=(neat.x+neat.y+neat.z)/3.0;\n  float edge=smoothstep(.22,.75,length(q));\n  float quant=dot(floor(q*mix(3.0,10.0,qdPixel)+.5)/\n    mix(3.0,10.0,qdPixel),vec3(.3333333));\n  float wounds=clamp(entropy*(tear*.72+mosaics*.64),0.0,1.0);\n\n  vec2 directional=vec2(q.x-q.y,q.y-q.z);\n  if(qdMode==1)directional+=vec2(tearOffset,tear)*1.25;\n  if(qdMode==2)directional=mix(directional,\n    vec2(grain-.5,stripGrain-.5)*3.0,entropy*qdPixel);\n  if(qdMode==3)directional=vec2(-directional.y,directional.x)+\n    entropy*vec2(sin(q.x*11.0+phase),cos(q.y*11.0-phase))*.8;\n  if(qdMode==4)directional+=\n    vec2(grain-.5,stripGrain-.5)*entropy*(1.4+qdTear);\n  // Hard cap, including extreme selected controls and exact tear cells.\n  directional=directional/(1.0+length(directional)*.6);\n  p+=qdAmount*qdWarp*(.035+entropy*.23)*directional;\n  return vec4(crystalline,entropy,clamp(wounds,0.0,1.0),\n    mix(edge,quant,entropy*qdPixel));\n}\n\nvec3 qdDress(vec3 col,vec4 data){\n  float phase=data.x,entropy=data.y,wounds=data.z,crystals=data.w;\n  vec3 ink=palette(fract(phase*.66+qdHue+colorTime*.002));\n  float brightness=pow(max(crystals,.0),mix(2.0,7.0,qdFiligree));\n  float orderAmount=(.08+.40*qdFiligree)*qdAmount;\n  float damageAmount=clamp(entropy*(.32+.62*qdTear),0.0,1.0)*qdAmount;\n  if(qdMode==0)orderAmount*=1.25;\n  if(qdMode==1)damageAmount*=1.12;\n  if(qdMode==2)damageAmount*=1.30;\n  if(qdMode==3)orderAmount*=1.35;\n  if(qdMode==4)damageAmount*=1.45;\n  // Non-destructive blending: other original shader materials still show.\n  col=mix(col,col*(.65+.53*brightness)+ink*(.22+.48*brightness),\n          clamp(orderAmount,0.0,.72));\n  vec3 damaged=palette(fract(crystals*.8+qdHue+colorTime*.003+entropy*.17));\n  float injury=clamp(wounds*.60+entropy*.14*qdPixel,0.0,1.0);\n  col=mix(col,damaged*(.4+.9*brightness),clamp(damageAmount*injury,0.0,.68));\n  float seam=pow(clamp(1.0-abs(phase-.5)*2.0,0.0,1.0),13.0);\n  col+=ink*qdAmount*qdEdge*(.04+.19*brightness)*seam;\n  return col;\n}";
