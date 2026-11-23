// Glitchbitch / Shader Vault — Wave 5: Living Velvet & Hyperbolic Crochet
// Sources:
// by_math/03_cellular_automata_lenia_sandpiles/lenia-velvet-damask.js
// by_math/11_hyperbolic_non_euclidean_higher_dimensions/fractal_crochet.js
// Living velvet is Lenia-inspired continuous metaball morphology, not an
// actual stored-state cellular automaton. Crochet is 3D SDF with a capped,
// bounded raymarch; its ruffles are hyperbolic-inspired rather than a claim
// of exact negatively curved isometric embedding.

export const velvetModes=[
  "Royal Bio-Damask","Opal Nap","Alien Velvet","Living Jacquard","Moss Brocade"
];
export const crochetModes=[
  "Hyperbolic Coral","Fractal Lace","Klein Ruffles","Apollonian Loops","Luminous Crochet"
];
export const velvetControls=[
  "vldAmount","vldScale","vldGrowth","vldRelief","vldNap",
  "vldGloss","vldHue","vldVariation","vldDensity"
];
export const crochetControls=[
  "hcrAmount","hcrScale","hcrRuffles","hcrDepth","hcrLace",
  "hcrMotion","hcrYarn","hcrIridescence","hcrQuality","hcrHue"
];
export const textilePresets=[
  {name:"Royal Organelles",velvetMode:"Royal Bio-Damask",crochetMode:"Hyperbolic Coral",
    vldAmount:93,vldScale:61,vldGrowth:55,vldRelief:54,vldNap:78,vldGloss:66,
    vldHue:23,vldVariation:55,vldDensity:76,hcrAmount:0,hcrScale:57,
    hcrRuffles:75,hcrDepth:56,hcrLace:65,hcrMotion:45,hcrYarn:67,hcrIridescence:78,
    hcrQuality:42,hcrHue:28},
  {name:"Opaline Moth Velvet",velvetMode:"Opal Nap",crochetMode:"Luminous Crochet",
    vldAmount:91,vldScale:44,vldGrowth:40,vldRelief:62,vldNap:96,vldGloss:82,
    vldHue:74,vldVariation:46,vldDensity:56,hcrAmount:0,hcrScale:55,
    hcrRuffles:80,hcrDepth:45,hcrLace:49,hcrMotion:52,hcrYarn:94,hcrIridescence:92,
    hcrQuality:45,hcrHue:74},
  {name:"Coral Cathedral",velvetMode:"Moss Brocade",crochetMode:"Hyperbolic Coral",
    vldAmount:0,vldScale:50,vldGrowth:52,vldRelief:58,vldNap:66,vldGloss:48,
    vldHue:49,vldVariation:58,vldDensity:61,hcrAmount:95,hcrScale:60,
    hcrRuffles:98,hcrDepth:80,hcrLace:84,hcrMotion:51,hcrYarn:65,
    hcrIridescence:93,hcrQuality:68,hcrHue:77},
  {name:"Impossible Fractal Lace",velvetMode:"Living Jacquard",crochetMode:"Fractal Lace",
    vldAmount:0,vldScale:50,vldGrowth:48,vldRelief:54,vldNap:61,vldGloss:45,
    vldHue:22,vldVariation:36,vldDensity:53,hcrAmount:98,hcrScale:68,
    hcrRuffles:86,hcrDepth:73,hcrLace:93,hcrMotion:59,hcrYarn:93,
    hcrIridescence:79,hcrQuality:74,hcrHue:32},
  {name:"Biological Wedding Dress",velvetMode:"Alien Velvet",crochetMode:"Klein Ruffles",
    vldAmount:72,vldScale:46,vldGrowth:70,vldRelief:69,vldNap:82,vldGloss:90,
    vldHue:40,vldVariation:63,vldDensity:71,hcrAmount:86,hcrScale:57,
    hcrRuffles:94,hcrDepth:77,hcrLace:75,hcrMotion:60,hcrYarn:80,
    hcrIridescence:89,hcrQuality:46,hcrHue:85},
  {name:"Haunted Damask Cathedral",velvetMode:"Moss Brocade",crochetMode:"Apollonian Loops",
    vldAmount:76,vldScale:71,vldGrowth:63,vldRelief:74,vldNap:90,vldGloss:67,
    vldHue:66,vldVariation:82,vldDensity:91,hcrAmount:90,hcrScale:68,
    hcrRuffles:100,hcrDepth:83,hcrLace:87,hcrMotion:65,hcrYarn:91,
    hcrIridescence:94,hcrQuality:49,hcrHue:54}
];
const safeUnit=random=>{
 const x=Number(random());
 return Number.isFinite(x)?Math.max(0,Math.min(1-Number.EPSILON,x)):0;
};
export function applyTextilePreset(state,name){
 const preset=textilePresets.find(p=>p.name===name);
 if(!preset)return state;
 const {name:_label,...values}=preset;
 return {...state,...values};
}
export function shuffleVelvet(state,random=Math.random){
 const next={...state,
   velvetMode:velvetModes[Math.floor(safeUnit(random)*velvetModes.length)]};
 for(const key of velvetControls)next[key]=key==="vldAmount"
   ?35+65*safeUnit(random):100*safeUnit(random);
 return next;
}
export function shuffleCrochet(state,random=Math.random){
 const next={...state,
   crochetMode:crochetModes[Math.floor(safeUnit(random)*crochetModes.length)]};
 for(const key of crochetControls)next[key]=key==="hcrAmount"
   ?35+65*safeUnit(random):100*safeUnit(random);
 return next;
}
export const hideVelvet=state=>({...state,vldAmount:0});
export const hideCrochet=state=>({...state,hcrAmount:0});

export const velvetGLSL = "\n// Wave 5 — GPU-bounded Lenia-inspired continuous motifs + p4m damask mirroring.\nuniform float vldAmount,vldScale,vldGrowth,vldRelief,vldNap;\nuniform float vldGloss,vldHue,vldVariation,vldDensity;\nuniform int vldMode;\n\n// This is a continuously re-evaluated, Lenia-inspired growth FIELD,\n// not a persistent or physically faithful Lenia cellular automaton.\nfloat vldField(vec2 p){\n  float t=time*(.015+.22*vldGrowth);\n  vec2 uv=p*(.25+.62*vldScale)+vec2(t*.12,t*.17);\n  // Fold a square wallpaper cell into the p4m triangle fundamental domain.\n  vec2 local=abs(fract(uv)-.5)*2.0;\n  if(local.x<local.y)local=local.yx;\n  float density=0.0;\n  for(int i=0;i<7;i++){\n    float fi=float(i);\n    float a=t*(.32+.045*fi)+fi*1.618+vldVariation*TAU*.7;\n    vec2 pos=.5+.31*vec2(sin(a),cos(a*1.3));\n    pos+=.12*vec2(sin(a*2.1+fi),cos(a*1.7-fi));\n    vec2 d=local-pos;\n    density+=(.028+.026*vldDensity)/(dot(d,d)+.015);\n  }\n  float membrane=exp(-pow(density-.8,2.0)*12.0);\n  float inner=exp(-pow(density-1.6,2.0)*16.0);\n  float core=exp(-pow(density-3.0,2.0)*24.0);\n  if(vldMode==1)return membrane*.8+inner*.6+core*.35;\n  if(vldMode==2)return membrane*.45+inner*.9+core*1.15;\n  if(vldMode==3)return membrane*.62+inner*.76+core*.8;\n  if(vldMode==4)return membrane*.9+inner*.48+core*.32;\n  return membrane*.4+inner*.8+core*1.3;\n}\nvec4 vldPrepare(inout vec2 p){\n  float eps=mix(.018,.005,vldDensity);\n  float h=vldField(p);\n  float hx=vldField(p+vec2(eps,0.0));\n  float hy=vldField(p+vec2(0.0,eps));\n  vec2 slope=clamp(vec2(h-hx,h-hy)*8.0,vec2(-1.0),vec2(1.0));\n  p+=slope*vldAmount*vldRelief*.15;\n  return vec4(h,slope,eps);\n}\nvec3 vldDress(vec3 col,vec2 p,vec2 uv,vec4 diagnostic){\n  float h=diagnostic.x;\n  vec3 light=normalize(vec3(sin(time*.19),cos(time*.13),.84));\n  vec2 nap=vec2(sin(p.y*(30.0+vldNap*150.0)+time*.31),\n                cos(p.x*(30.0+vldNap*150.0)-time*.28));\n  vec3 n=normalize(vec3(diagnostic.yz*mix(1.0,3.6,vldRelief)+nap*vldNap*.14,.69));\n  float ndl=max(dot(n,light),0.0);\n  float ndh=max(dot(n,normalize(light+vec3(0.0,0.0,1.0))),0.0);\n  float rim=pow(clamp(1.0-n.z,0.0,1.0),2.6);\n  float wet=pow(ndh,mix(9.0,36.0,vldGloss))*smoothstep(.18,.95,h);\n  vec3 base=palette(fract(vldHue+.06+h*.18+colorTime*.002));\n  vec3 bloom=palette(fract(vldHue+.29+h*.43+colorTime*.003));\n  vec3 tissue=palette(fract(vldHue+.57+h*.35+colorTime*.003));\n  float mantle=smoothstep(.05,.52,h);\n  float organelle=smoothstep(.47,1.17,h);\n  vec3 albedo=mix(base*.32,bloom,mantle);\n  albedo=mix(albedo,tissue,organelle*.8);\n  if(vldMode==1)albedo=mix(albedo,base*.35,rim*.78);\n  if(vldMode==2)albedo=mix(albedo,tissue,wet*.55);\n  if(vldMode==3)albedo=mix(albedo,bloom,organelle*.34);\n  if(vldMode==4)albedo=mix(albedo,base*.4,(1.0-mantle)*.55);\n  float pile=.5+.5*noise(p*(31.0+vldNap*50.0)+time*.08);\n  vec3 velvet=albedo*(.21+.74*ndl)*(.7+.3*pile);\n  velvet+=bloom*(rim*(.3+vldNap*.8)+wet*(.35+vldGloss*1.25));\n  float sparkle=step(.994,hash(floor(p*210.0)+vec2(seed*.01,3.0)))*\n    vldNap*wet;\n  velvet+=vec3(1.0)*sparkle*.42;\n  float coverage=clamp(.38+.55*mantle,0.0,1.0);\n  return mix(col,clamp(velvet,0.0,2.0),\n    clamp(vldAmount*coverage*(.29+.5*vldDensity),0.0,.78));\n}\n\n";
export const crochetGLSL = "// Hyperbolic-inspired ruffles + bounded stereographic inversion lace SDF.\n// Unlike the 150-step source raymarch, this mobile-safe variant uses at\n// most 20 raymarch steps and 3 bounded inversion folds per SDF evaluation.\nuniform float hcrAmount,hcrScale,hcrRuffles,hcrDepth,hcrLace;\nuniform float hcrMotion,hcrYarn,hcrIridescence,hcrQuality,hcrHue;\nuniform int hcrMode;\n\nvec2 hcrRuffle(vec2 p){\n  float r=min(length(p),3.2);\n  float a=atan(p.y,p.x);\n  float t=time*(.015+.16*hcrMotion);\n  float wave=sin(a*(5.0+hcrRuffles*11.0)+r*(5.0+hcrLace*8.0)-t*1.4);\n  float ruffledRadius=r*(1.0+.18*hcrRuffles*wave);\n  float angle=a+hcrRuffles*.28*sin(r*(4.0+hcrRuffles*8.0)-t);\n  return ruffledRadius*vec2(cos(angle),sin(angle));\n}\nfloat hcrMap(vec3 point){\n  vec3 p=point;\n  p.xy=hcrRuffle(p.xy);\n  float r=length(p.xy);\n  float a=atan(p.y,p.x);\n  p.z+=sin(a*(5.0+hcrRuffles*10.0)+r*(3.0+hcrLace*7.0)-\n      time*(.04+.12*hcrMotion))*(.012+.1*hcrRuffles);\n  float fabric=abs(p.z)-mix(.018,.075,hcrDepth);\n  vec3 q=p*(1.0+1.3*hcrScale);\n  float invScale=1.0;\n  for(int i=0;i<3;i++){\n    q=-1.0+2.0*fract(.5*q+.5);\n    float r2=max(dot(q,q),.085);\n    float k=clamp(1.25/r2,.33,3.6);\n    q*=k;\n    invScale=clamp(invScale*k,.03,64.0);\n    q.xy=rotate(.19+time*.007)*q.xy;\n    q.yz=rotate(.14)*q.yz;\n  }\n  float yarn=sin(p.x*(60.0+100.0*hcrYarn))*\n             sin(p.y*(60.0+100.0*hcrYarn))*.002*hcrYarn;\n  float web=(length(q.xy)-mix(.10,.32,hcrLace))/invScale;\n  if(hcrMode==1)web=(length(q.yz)-mix(.12,.29,hcrLace))/invScale;\n  if(hcrMode==2)web=min(web,(length(q.xy-.35)-.11)/invScale);\n  if(hcrMode==3)web=max(web,-(length(q.xy)-.48)/invScale);\n  if(hcrMode==4)web=(length(q.xy)-mix(.16,.35,hcrLace))/invScale;\n  return max(fabric,web)+yarn;\n}\n\nvec3 hcrDress(vec3 col,vec2 uv,vec2 p){\n  vec2 screen=(uv-.5)*vec2(res.x/res.y,1.0);\n  float pace=time*(.01+.08*hcrMotion);\n  vec3 ro=vec3(sin(pace)*.12,cos(pace*.73)*.12,1.1+.16*hcrDepth);\n  vec3 rd=normalize(vec3(screen*(1.45-.65*hcrScale),-1.25));\n  float travel=0.0;\n  float dist=1.0;\n  bool hit=false;\n  int steps=int(8.0+12.0*hcrQuality);\n  vec3 pos=ro;\n  for(int i=0;i<20;i++){\n    if(i>=steps)break;\n    pos=ro+rd*travel;\n    dist=hcrMap(pos);\n    if(dist<.007){hit=true;break;}\n    if(travel>2.8)break;\n    travel+=clamp(dist*.8,.009,.25);\n  }\n  if(!hit)return col;\n  float eps=.012;\n  // Forward differences reuse the computed central SDF to save GPU work.\n  vec3 normal=normalize(vec3(\n    hcrMap(pos+vec3(eps,0.0,0.0))-dist,\n    hcrMap(pos+vec3(0.0,eps,0.0))-dist,\n    hcrMap(pos+vec3(0.0,0.0,eps))-dist));\n  vec3 view=-rd;\n  vec3 light=normalize(vec3(.63,.64,.53));\n  float diffuse=max(0.0,dot(normal,light));\n  float facing=clamp(dot(normal,view),0.0,1.0);\n  float velvet=pow(1.0-facing,3.5);\n  float specular=pow(max(dot(normal,normalize(light+view)),0.0),24.0);\n  float depthFog=1.0-smoothstep(.7,2.9,travel);\n  vec3 ink=palette(fract(hcrHue+length(pos.xy)*.22+colorTime*.005));\n  vec3 sheen=palette(fract(hcrHue+.31+facing*.5+colorTime*.004));\n  float strand=.6+.4*sin(pos.x*(60.0+180.0*hcrYarn)+pos.y*17.0);\n  vec3 textile=ink*(.2+.72*diffuse)*(.7+.3*strand)+\n    sheen*velvet*hcrIridescence*1.2+vec3(1.0)*specular*.31;\n  if(hcrMode==1)textile=mix(textile,sheen,velvet*.5);\n  if(hcrMode==2)textile+=sheen*pow(1.0-facing,4.0)*.36;\n  if(hcrMode==3)textile=mix(textile,ink*.65,smoothstep(.45,1.0,travel)*.5);\n  if(hcrMode==4)textile+=sheen*(specular+.19)*.41;\n  float opacity=clamp(hcrAmount*depthFog*(.43+.53*hcrDepth),0.0,.89);\n  return mix(col,clamp(textile,0.0,2.0),opacity);\n}\n";
