// Six original modes are kept at their original numerical shader indices.
export const microModes=[
  "Living embroidery",
  "Opal granulation",
  "Gel caustics",
  "Point lace",
  "Glass filaments",
  "Crystalline cilia",
  "Mother-of-pearl dust",
  "Prism pollen",
  "Bubble silk",
  "Frost lace",
  "Cilia swarm",
  "Neon barnacles",
  "Hallucination pores",
  "Mold sequins",
  "Alien dandruff",
  "Maggot beadwork"
];
export const microFamilies=[
  {name:"Original microscopic materials",modes:microModes.slice(0,6)},
  {name:"Opaline minerals & microfabrics",modes:[
    "Mother-of-pearl dust","Prism pollen","Bubble silk","Frost lace"]},
  {name:"Living microscopic organisms",modes:[
    "Cilia swarm","Neon barnacles","Hallucination pores","Mold sequins"]},
  {name:"Funky laboratory contaminants",modes:[
    "Alien dandruff","Maggot beadwork"]},
];
export const newMicroModes=microModes.slice(6);
export const microPresets=newMicroModes.map((mode,i)=>({
  name:["Nacre dust cloud","Hyperprism spores","Wet bubble brocade",
    "Frost cathedral","Swimming cilia disco","Neon barnacle bloom",
    "Hallucination skin","Mold sequin sequencer","Extraterrestrial dandruff",
    "Beadworm embroidery"][i],
  mode,microAmount:89+i%3*4,microScale:38+(i*11)%51,
  microMotion:64+(i*7)%35,microRelief:70+(i*9)%28,
  microDensity:68+(i*5)%30,microHue:(24+i*13)%100,
  microVariation:(43+i*9)%100,
}));
export function applyMicroPreset(state,name){
  const p=microPresets.find(item=>item.name===name);
  return p?{...state,microMode:p.mode,microAmount:p.microAmount,
    microScale:p.microScale,microMotion:p.microMotion,microRelief:p.microRelief,
    microDensity:p.microDensity,microHue:p.microHue,
    microVariation:p.microVariation}:state;
}
export function remixMicro(state,rng=Math.random,onlyNew=false){
  const rand=()=>{const n=Number(rng());return Number.isFinite(n)?
    Math.min(1-Number.EPSILON,Math.max(0,n)):0;};
  const group=onlyNew?newMicroModes:microModes;
  const choices=group.filter(x=>x!==state.microMode);
  const mode=(choices.length?choices:group)[
    Math.floor(rand()*(choices.length?choices:group).length)];
  return {...state,microMode:mode,microAmount:Math.max(72,state.microAmount||0),
    microScale:23+Math.floor(rand()*74),
    microMotion:42+Math.floor(rand()*57),
    microRelief:56+Math.floor(rand()*43),
    microDensity:43+Math.floor(rand()*56),
    microHue:Math.floor(rand()*100),microVariation:Math.floor(rand()*100)};
}
// Strip 15 irrelevant conditional branches from the shader before Safari
// compiles it. One selected mode uses its old shader ID exactly.
export function specializeMicroGLSL(src,index){
  if(!Number.isInteger(index)||index<0||index>=microModes.length)return src;
  const opening=id=>id===0?"  if(microMode==0){":
    "  }else if(microMode=="+id+"){";
  const starts=microModes.map((_,id)=>src.indexOf(opening(id)));
  if(starts.some((x,i)=>x<0||(i>0&&x<=starts[i-1])))return src;
  const fallback=src.indexOf("  }else{ // Unknown mode:",starts[15]);
  const end=src.indexOf("  float pulse=.7+",fallback);
  if(fallback<0||end<=fallback)return src;
  const body=src.slice(starts[index]+opening(index).length,
    index===15?fallback:starts[index+1]);
  return src.slice(0,starts[0])+
    "  if(microMode=="+index+"){"+body+
    src.slice(fallback,end)+src.slice(end);
}

export const microGLSL = "\n// Shader-native living microtexture: sixteen distinct animated constructions.\nuniform int microMode;\nuniform float microAmount,microScale,microMotion,microRelief,microDensity,microHue,microVariation;\nvec3 movingMicrostructure(vec3 col,vec2 p,vec2 uv,float fieldValue) {\n  if(microAmount<.001) return col;\n  float t=time*(.17+microMotion*1.65);\n  float ct=colorTime*(.13+microMotion*.94);\n  float freq=2.2+microScale*14.3;\n  float vari=microVariation*6.2831853;\n  vec2 q=p*(.68+microScale*1.86)+vec2(sin(vari*1.4),cos(vari*.89))*1.7;\n  q+=vec2(.27*sin(t*.6+q.y*.5),.21*cos(t*.48-q.x*.38));\n  float coverage=0.,edge=0.,hue=0.;\n  if(microMode==0){ // Living embroidery: interlacing true animated warp and weft.\n    float wa=.6*sin(q.y*2.2-t*.69)+.3*cos(q.x*1.1+t*.34);\n    float wb=.5*cos(q.x*1.9+t*.61)+.25*sin(q.y*2.6-t*.48);\n    float warpThread=pow(.5+.5*sin(q.x*freq*.62+wa),20.);\n    float weftThread=pow(.5+.5*cos(q.y*freq*.57+wb),20.);\n    coverage=clamp(warpThread+weftThread,0.,1.);\n    edge=warpThread*weftThread;\n    hue=warpThread*.48+weftThread*.22;\n  }else if(microMode==1){ // Opal granulation: swimming, shimmering micro-rings.\n    vec2 g=q*(.48+microDensity*2.3),cell=floor(g),local=fract(g)-.5;\n    float dist=4.;\n    for(int i=0;i<4;i++){\n      vec2 o=vec2(mod(float(i),2.),floor(float(i)*.5));\n      vec2 n=cell+o;\n      vec2 center=o-.5+.3*(vec2(hash(n+4.1),hash(n+7.7))-.5);\n      center+=.12*vec2(sin(t*.37+n.x),cos(t*.39+n.y));\n      dist=min(dist,length(local-center));\n    }\n    coverage=pow(1.-smoothstep(.12,.49,abs(dist-.25)),2.);\n    edge=1.-smoothstep(.02,.18,dist);\n    hue=dist*.7;\n  }else if(microMode==2){ // Gel caustics: traveling intersections, not noisy static.\n    float flow=sin(q.x*(3.+microDensity*7.)+sin(q.y*2.2+t*.57))+\n      cos(q.y*(3.6+microDensity*8.)-sin(q.x*1.6-t*.43));\n    coverage=pow(.5+.5*sin(flow*4.6-t*.83),14.);\n    edge=pow(.5+.5*cos(flow*2.9+t*.34),9.);\n    hue=.5+.5*sin(flow*3.1+ct*.37);\n  }else if(microMode==3){ // Point lace: breathing dot field / illuminated rings.\n    vec2 g=q*(.9+microDensity*3.7),cell=floor(g),local=fract(g)-.5;\n    vec2 drift=.22*vec2(sin(t*.71+hash(cell)*6.),cos(t*.57+hash(cell+8.2)*6.));\n    vec2 point=.23*(vec2(hash(cell+1.7),hash(cell+3.3))-.5)+drift;\n    float d=length(local-point);\n    float radius=.13+.055*sin(t*.82+hash(cell+9.1)*6.);\n    coverage=1.-smoothstep(radius*.68,radius,d);\n    edge=1.-smoothstep(.03,.09,abs(d-radius*1.5));\n    hue=hash(cell+11.3);\n  }else if(microMode==4){ // Glass filaments: luminous flowing hairline vortices.\n    float a=sin(q.x*freq*.62+sin(q.y*1.8+t*.44)*3.1-t*.49);\n    float b=cos(q.y*freq*.42+cos(q.x*1.4-t*.31)*2.6+t*.62);\n    coverage=pow(.5+.5*sin(a*4.2+b*3.4),18.);\n    edge=pow(.5+.5*cos((a-b)*6.1),26.);\n    hue=.5+.5*sin(a+b+t*.23);\n  }else if(microMode==5){ // Crystalline cilia: growing directional rods and fan crowns.\n    vec2 g=q*(.65+microDensity*2.7),cell=floor(g),local=fract(g)-.5;\n    float angle=hash(cell+2.3)*6.2831853+sin(t*.35+hash(cell+9.1)*6.)*.44;\n    vec2 dir=vec2(cos(angle),sin(angle));\n    float longitudinal=dot(local,dir);\n    float lateral=abs(dot(local,vec2(-dir.y,dir.x)));\n    float shape=smoothstep(-.32,-.04,longitudinal)*(1.-smoothstep(.20,.47,longitudinal));\n    float rod=1.-smoothstep(.016,.073,lateral);\n    coverage=shape*rod;\n    edge=shape*pow(.5+.5*cos(lateral*38.-t*.53),8.);\n    hue=hash(cell+4.7);\n  }else if(microMode==6){ // MOTHER OF PEARL DUST — animated multilayered interference flakes.\n    vec2 g=q*(.63+microDensity*2.1),cell=floor(g),z=fract(g)-.5;\n    float h=hash(cell+vec2(1.4,3.7)),a=atan(z.y,z.x);\n    float r=length(z),flake=sin(a*(5.+floor(h*4.))+t*.4+h*6.283);\n    float nacre=sin(r*38.+flake*2.2-t*.9+ct*.14);\n    coverage=pow(.5+.5*nacre,9.)*(1.-smoothstep(.27,.62,r));\n    edge=pow(.5+.5*cos(r*27.-t*.54),16.)*(1.-smoothstep(.37,.65,r));\n    hue=.5+.5*sin(flake*2.3+r*11.+ct*.36);\n  }else if(microMode==7){ // PRISM POLLEN — seeded moving refractive spore grains.\n    vec2 g=q*(.86+microDensity*3.2),cell=floor(g),z=fract(g)-.5;\n    float h=hash(cell+3.9),k=hash(cell+8.7);\n    z-=.15*vec2(sin(t*.53+h*6.28),cos(t*.46+k*6.28));\n    float angle=h*6.283+t*.21;\n    z=mat2(cos(angle),-sin(angle),sin(angle),cos(angle))*z;\n    float r=length(z*vec2(.75+h*.65,1.1));\n    coverage=(1.-smoothstep(.08,.2,r))*(.58+.42*sin(t+h*6.)*sin(t+h*6.));\n    edge=1.-smoothstep(.012,.075,abs(r-.19));\n    hue=h*.55+k*.2+sin(t*.36+h*6.)*.13;\n  }else if(microMode==8){ // BUBBLE SILK — expanding hex foam and thin-film micro rims.\n    vec2 grid=q*(.48+microDensity*2.6);\n    vec2 h=vec2(grid.x+grid.y*.5,grid.y*.8660254);\n    vec2 cell=floor(h),z=fract(h)-.5;\n    float k=hash(cell+6.3),r=length(z);\n    float radius=.29+.055*sin(t*.63+k*6.283);\n    float film=sin(r*52.-t*.91+k*9.);\n    coverage=(1.-smoothstep(.015,.085,abs(r-radius)))*(.65+.35*film*film);\n    edge=pow(.5+.5*cos(r*31.+t*.68),13.)*(1.-smoothstep(.3,.6,r));\n    hue=.5+.5*sin(film*3.1+ct*.42+k*6.);\n  }else if(microMode==9){ // FROST LACE — self-similar crystalline fronts.\n    vec2 z=q*(.69+microDensity*.35);\n    float crystal=0.,branch=0.,amp=.58;\n    for(int k=0;k<3;k++){\n      float star=sin(z.x*2.4+sin(z.y*1.4-t*.3))*\n        cos(z.y*2.2+cos(z.x*1.3+t*.22));\n      crystal+=amp*star;\n      branch+=amp*sin(z.x*3.1-z.y*3.7-t*.47);\n      z=mat2(.81,-.59,.59,.81)*z*1.89+vec2(.37,1.17);\n      amp*=.56;\n    }\n    coverage=pow(.5+.5*cos(crystal*22.+t*.36),17.);\n    edge=pow(.5+.5*sin(branch*28.-t*.72),17.);\n    hue=crystal*.28+branch*.13+ct*.13;\n  }else if(microMode==10){ // CILIA SWARM — seeded, directionally swimming hair fields.\n    vec2 g=q*(.62+microDensity*2.9),cell=floor(g),z=fract(g)-.5;\n    float h=hash(cell+2.8),angle=h*6.283+t*.39+sin(t*.43+h*8.)*.55;\n    vec2 dir=vec2(cos(angle),sin(angle));\n    float longitudinal=dot(z,dir),transverse=dot(z,vec2(-dir.y,dir.x));\n    float bend=sin(longitudinal*11.-t*1.23+h*5.)*.065;\n    float tip=smoothstep(-.3,-.08,longitudinal)*\n      (1.-smoothstep(.18,.43,longitudinal));\n    coverage=tip*(1.-smoothstep(.01,.076,abs(transverse-bend)));\n    edge=tip*pow(.5+.5*cos(longitudinal*17.-t*.91),12.);\n    hue=h+.18*sin(t*.53+longitudinal*9.);\n  }else if(microMode==11){ // NEON BARNACLES — living shell pores and concentric ribs.\n    vec2 g=q*(.52+microDensity*2.1),id=floor(g),z=fract(g)-.5;\n    float h=hash(id+1.9),r=length(z),a=atan(z.y,z.x);\n    float shell=sin(r*(32.+h*22.)-a*7.-t*.77);\n    float cup=.20+.085*sin(t*.45+h*7.);\n    coverage=pow(.5+.5*shell,9.)*(1.-smoothstep(.24,.63,r));\n    edge=1.-smoothstep(.018,.082,abs(r-cup));\n    hue=h*.5+.5+.5*cos(a*6.-r*19.+t*.6);\n  }else if(microMode==12){ // HALLUCINATION PORES — breathing non-Euclidean pit mouths.\n    vec2 z=q*(.66+microDensity*2.4);\n    z+=.27*vec2(sin(z.y*1.7+t*.47),cos(z.x*1.4-t*.36));\n    vec2 id=floor(z),d=fract(z)-.5;\n    float h=hash(id+5.1),r=length(d);\n    float mouth=.18+.12*sin(t*.58+h*6.28);\n    float edgeDist=abs(r-mouth);\n    coverage=(1.-smoothstep(.022,.12,edgeDist))*\n      (.53+.47*cos(r*18.-t*.9)*cos(r*18.-t*.9));\n    edge=1.-smoothstep(.05,.19,r);\n    hue=h+.5+.5*sin((r-mouth)*24.+ct*.35);\n  }else if(microMode==13){ // MOLD SEQUINS — creeping overlapping micro-discs.\n    vec2 g=q*(.9+microDensity*2.1),id=floor(g),d=fract(g)-.5;\n    float h=hash(id+8.1),crawl=t*.31+h*6.283;\n    d+=.12*vec2(cos(crawl),sin(crawl));\n    float r=length(d),ring=.21+.055*sin(t*.73+h*9.);\n    float glimmer=pow(.5+.5*sin(r*34.-t*1.3+h*8.),13.);\n    coverage=(1.-smoothstep(.04,.13,abs(r-ring)))*(.45+.55*glimmer);\n    edge=pow(.5+.5*cos(r*44.-t*.64),17.)*\n      (1.-smoothstep(.18,.46,r));\n    hue=h*.69+sin(t*.54+h*8.)*.22;\n  }else if(microMode==14){ // ALIEN DANDRUFF — drifting polygonal crystalline flakes.\n    vec2 g=q*(.78+microDensity*2.4),cell=floor(g),d=fract(g)-.5;\n    float h=hash(cell+3.3),k=hash(cell+7.9);\n    float a=h*6.283+t*(.14+.25*k);\n    d=mat2(cos(a),-sin(a),sin(a),cos(a))*d;\n    float angle=atan(d.y,d.x),r=length(d);\n    float n=5.+floor(h*4.);\n    float polygon=cos(floor(.5+angle/6.283*n)*6.283/n-angle)*r;\n    coverage=1.-smoothstep(.12+.05*k,.2+.09*k,polygon);\n    edge=1.-smoothstep(.012,.06,abs(polygon-(.19+.03*k)));\n    hue=k+.22*sin(t*.52+h*8.);\n  }else if(microMode==15){ // MAGGOT BEADWORK — migrating segmented silk grains.\n    vec2 g=q*(.58+microDensity*2.),id=floor(g),z=fract(g)-.5;\n    float h=hash(id+1.8),phase=t*(.42+.35*h)+h*6.283;\n    z.x+=.18*sin(z.y*7.+phase);\n    z.y+=.13*cos(z.x*5.-phase);\n    float spine=abs(z.x-.13*sin(z.y*9.-t*.63));\n    float beads=.5+.5*cos(z.y*27.-phase*1.8);\n    coverage=(1.-smoothstep(.014,.093,spine))*pow(beads,4.);\n    edge=pow(.5+.5*cos(spine*36.+phase),12.)*\n      (1.-smoothstep(.1,.27,spine));\n    hue=h*.53+beads*.31+ct*.03;\n  }else{ // Unknown mode: never disturb original artwork.\n    return col;\n  }\n  float pulse=.7+.3*sin(ct*.57+fieldValue*10.+vari);\n  vec3 pigments=palette(fract(microHue*.87+hue*.45+ct*.014+vari*.021));\n  vec3 lit=pigments*(coverage*(.67+.57*microRelief)*pulse+\n    edge*(.1+.6*microRelief));\n  // Preserve legible primary geometry; small material features ride it.\n  float blend=clamp(microAmount*(.45+.45*microDensity),0.,.88);\n  return clamp(mix(col,col*(.84+.17*coverage)+lit,blend),0.,1.4);\n}";
