/**
 * LIVING UNDERLAY — independent palette-linked procedural textile grounds.
 *
 * The underlay is drawn BETWEEN the existing Photon Zoo and Filament Forge
 * steps. It also works when filamentAmount is zero. Nothing is sampled or
 * accumulated, so each frame is reproducible by the existing export clock.
 */
export const underlayModes=[
  "Ornamental jacquard",
  "Breathing moiré organza",
  "Quasicrystal twill",
  "Velvet pile",
  "Opalescent damask",
  "Cellular gauze",
  "Holographic brocade",
  "Ghost quilt",
  "Threadbare cathedral",
  "Elastic tartan",
  "Moiré satin haze",
  "Haunted upholstery",
  "Radioactive afghan",
  "Parasite upholstery",
  "Wet relic cloth",
  "Disco shroud"
];
export const newUnderlayModes=underlayModes.slice(6);
export const underlayFamilies=[
  {name:"Original living textiles",modes:underlayModes.slice(0,6)},
  {name:"Spectral fabrics & luminous lace",modes:underlayModes.slice(6,11)},
  {name:"Haunted & mutant upholstery",modes:underlayModes.slice(11)},
];
export const underlayDescriptions={
  "Holographic brocade":"Time-interleaved warp facets and hologram-like shifted medallions.",
  "Ghost quilt":"Translucent quilt cells expand and fade through spectral seams.",
  "Threadbare cathedral":"Flying buttress threadwork grows and unthreads its own gaps.",
  "Elastic tartan":"Two stretching tartan meshes breathe at independent frequencies.",
  "Moiré satin haze":"Superposed rotating silk gratings yield crawling satin highlights.",
  "Haunted upholstery":"Stippled damask faces dissolve through drifting negative space.",
  "Radioactive afghan":"Crochet chevrons race with phosphorescent cellular bursts.",
  "Parasite upholstery":"Branching self-propagating threads colonize a woven substrate.",
  "Wet relic cloth":"Meniscus ripples circulate over drowned etched yarn.",
  "Disco shroud":"Shimmering triangular sequins unfold across a sweeping weave.",
};
export function remixUnderlay(state,rng=Math.random,newOnly=false){
  const unit=()=>{const n=Number(rng());return Number.isFinite(n)?
    Math.min(1-Number.EPSILON,Math.max(0,n)):0;};
  const list=newOnly?newUnderlayModes:underlayModes;
  const candidates=list.filter(x=>x!==state.underlayMode);
  const options=candidates.length?candidates:list;
  return {...state,underlayMode:options[Math.floor(unit()*options.length)],
    underlayAmount:Math.max(78,state.underlayAmount||0),
    underlayScale:28+Math.floor(unit()*68),
    underlayDensity:38+Math.floor(unit()*60),
    underlayMotion:40+Math.floor(unit()*60),
    underlayRelief:53+Math.floor(unit()*46),
    underlayContrast:51+Math.floor(unit()*48),
    underlayHue:Math.floor(unit()*100),
    underlayVariation:Math.floor(unit()*100)};
}
/** Compile exactly one textile ground instead of 16 in mobile Safari. */
export function specializeUnderlayGLSL(source,id){
  if(!Number.isInteger(id)||id<0||id>=underlayModes.length)return source;
  const opener=i=>i===0?"  if(underlayMode==0){":
    "  }else if(underlayMode=="+i+"){";
  const starts=underlayModes.map((_,i)=>source.indexOf(opener(i)));
  if(starts.some((n,i)=>n<0||(i&&n<=starts[i-1])))return source;
  const fallback=source.indexOf("  }else{ // Unsupported textile mode",starts[15]);
  const end=source.indexOf("  // The underlying painting survives",fallback);
  if(fallback<0||end<0)return source;
  const body=source.slice(starts[id]+opener(id).length,id===15?fallback:starts[id+1]);
  return source.slice(0,starts[0])+"  if(underlayMode=="+id+"){"+
    body+source.slice(fallback,end)+source.slice(end);
}


export const underlayControls=[
  "underlayAmount","underlayScale","underlayDensity","underlayMotion",
  "underlayRelief","underlayHue","underlayContrast","underlayVariation"
];

export const underlayPresets=[
  {name:"Radioactive Jacquard",underlayMode:"Ornamental jacquard",
    underlayAmount:90,underlayScale:54,underlayDensity:68,underlayMotion:35,
    underlayRelief:83,underlayHue:62,underlayContrast:77,underlayVariation:31},
  {name:"Organza Interference",underlayMode:"Breathing moiré organza",
    underlayAmount:86,underlayScale:66,underlayDensity:72,underlayMotion:55,
    underlayRelief:64,underlayHue:38,underlayContrast:88,underlayVariation:44},
  {name:"Alien Twill Fossil",underlayMode:"Quasicrystal twill",
    underlayAmount:93,underlayScale:53,underlayDensity:74,underlayMotion:42,
    underlayRelief:85,underlayHue:77,underlayContrast:92,underlayVariation:63},
  {name:"Electric Velvet",underlayMode:"Velvet pile",
    underlayAmount:89,underlayScale:47,underlayDensity:82,underlayMotion:31,
    underlayRelief:95,underlayHue:24,underlayContrast:73,underlayVariation:89},
  {name:"Opal Damask Cathedral",underlayMode:"Opalescent damask",
    underlayAmount:95,underlayScale:48,underlayDensity:67,underlayMotion:46,
    underlayRelief:91,underlayHue:58,underlayContrast:86,underlayVariation:51},
  {name:"Neon Cellular Gauze",underlayMode:"Cellular gauze",
    underlayAmount:91,underlayScale:59,underlayDensity:79,underlayMotion:64,
    underlayRelief:74,underlayHue:18,underlayContrast:82,underlayVariation:71},
  {"name":"Cybernetic Hologram Fabric","underlayMode":"Holographic brocade","underlayAmount":90,"underlayScale":36,"underlayDensity":56,"underlayMotion":57,"underlayRelief":73,"underlayHue":29,"underlayContrast":68,"underlayVariation":41},
  {"name":"Ancestral Ghost Quilt","underlayMode":"Ghost quilt","underlayAmount":93,"underlayScale":45,"underlayDensity":63,"underlayMotion":62,"underlayRelief":80,"underlayHue":42,"underlayContrast":75,"underlayVariation":52},
  {"name":"Cathedral Shroud","underlayMode":"Threadbare cathedral","underlayAmount":96,"underlayScale":54,"underlayDensity":70,"underlayMotion":67,"underlayRelief":87,"underlayHue":55,"underlayContrast":82,"underlayVariation":63},
  {"name":"Tartan Elastic Fever","underlayMode":"Elastic tartan","underlayAmount":90,"underlayScale":63,"underlayDensity":77,"underlayMotion":72,"underlayRelief":94,"underlayHue":68,"underlayContrast":89,"underlayVariation":74},
  {"name":"Moire Silk Vapor","underlayMode":"Moiré satin haze","underlayAmount":93,"underlayScale":72,"underlayDensity":84,"underlayMotion":77,"underlayRelief":74,"underlayHue":81,"underlayContrast":96,"underlayVariation":85},
  {"name":"Haunted Sitting Room","underlayMode":"Haunted upholstery","underlayAmount":96,"underlayScale":81,"underlayDensity":91,"underlayMotion":82,"underlayRelief":81,"underlayHue":94,"underlayContrast":73,"underlayVariation":96},
  {"name":"Uranium Granny Square","underlayMode":"Radioactive afghan","underlayAmount":90,"underlayScale":90,"underlayDensity":58,"underlayMotion":87,"underlayRelief":88,"underlayHue":7,"underlayContrast":80,"underlayVariation":7},
  {"name":"Vermin Jacquard","underlayMode":"Parasite upholstery","underlayAmount":93,"underlayScale":44,"underlayDensity":65,"underlayMotion":92,"underlayRelief":95,"underlayHue":20,"underlayContrast":87,"underlayVariation":18},
  {"name":"Drowned Relic Brocade","underlayMode":"Wet relic cloth","underlayAmount":96,"underlayScale":53,"underlayDensity":72,"underlayMotion":57,"underlayRelief":75,"underlayHue":33,"underlayContrast":94,"underlayVariation":29},
  {"name":"Disco Funeral Veil","underlayMode":"Disco shroud","underlayAmount":90,"underlayScale":62,"underlayDensity":79,"underlayMotion":62,"underlayRelief":82,"underlayHue":46,"underlayContrast":71,"underlayVariation":40}
];

export function applyUnderlayPreset(state,name){
  const preset=underlayPresets.find(p=>p.name===name);
  if(!preset)return state;
  const {name:label,...underlay}=preset;
  return {...state,...underlay};
}

export function changeUnderlayMode(state,mode){
  if(!underlayModes.includes(mode))return state;
  return {...state,underlayMode:mode,underlayAmount:Math.max(55,state.underlayAmount||0)};
}

export function nextUnderlayMode(state,rng=Math.random){
  const options=underlayModes.filter(x=>x!==state.underlayMode);
  const number=Number(rng());
  const unit=Number.isFinite(number)?Math.max(0,Math.min(.999999,number)):0;
  return changeUnderlayMode(state,options[Math.floor(unit*options.length)]);
}

export function disableUnderlay(state){
  return {...state,underlayAmount:0};
}

export const underlayGLSL = `
// Surface-only textile geometries; no texture buffers or derivative extensions.
uniform int underlayMode;
uniform float underlayAmount,underlayScale,underlayDensity,underlayMotion;
uniform float underlayRelief,underlayHue,underlayContrast,underlayVariation;

vec3 livingTextileUnderlay(vec3 original,vec2 uv,float baseField){
  if(underlayAmount<.001)return original;
  float t=time*(.08+underlayMotion*.48);
  float pigmentTime=colorTime*(.008+.035*underlayMotion);
  float phaseSeed=underlayVariation*6.2831853+seed*.000014;
  float freq=3.5+underlayScale*11.0;
  vec2 q=(uv-.5)*vec2(res.x/res.y,1.0)*freq;
  // Displace the cloth itself; the two yarn directions share this warp.
  q+=.11*underlayMotion*vec2(sin(q.y*.54+t*.35+phaseSeed),
    cos(q.x*.49-t*.33+phaseSeed*.7));
  float yarnFreq=1.6+underlayDensity*3.7;
  float fiber=0.0,ornament=0.0,shimmer=0.0,shadow=0.0,phase=0.0;
  if(underlayMode==0){
    // Jacquard: separately crossing warp/weft, with raised floral motifs.
    float warp=sin(q.x*yarnFreq+sin(q.y*.88+t*.2)*.72);
    float weft=cos(q.y*yarnFreq+sin(q.x*.86-t*.23)*.65);
    float motif=cos(q.x*1.38+q.y*.48+phaseSeed)*
      sin(q.y*1.46-q.x*.38-t*.14);
    fiber=.5+.5*(warp*.51+weft*.49);
    ornament=.5+.5*sin((q.x+q.y)*1.6+motif*3.1+phaseSeed);
    shimmer=pow(max(0.0,.5+.5*(warp-weft)),7.0);
    shadow=.5-.5*warp*weft;
    phase=motif*.35+q.x*.045;
  }else if(underlayMode==1){
    // Two translucent skewed meshes slowly rotate against one another.
    float angle=t*.08+phaseSeed*.18;
    vec2 a=vec2(cos(angle),sin(angle));
    vec2 b=vec2(cos(angle+.085+underlayDensity*.15),
      sin(angle+.085+underlayDensity*.15));
    float mesh1=cos(dot(q,a)*yarnFreq*2.4);
    float mesh2=cos(dot(q,b)*yarnFreq*2.4);
    float cross1=cos(dot(q,vec2(-a.y,a.x))*yarnFreq*1.9);
    fiber=.5+.5*(mesh1*.5+mesh2*.26+cross1*.24);
    ornament=.5+.5*cos((mesh1-mesh2)*4.1+q.y*.24);
    shimmer=pow(max(0.0,.5+.5*mesh1*mesh2),8.0);
    shadow=.5-.5*cross1;
    phase=(mesh1-mesh2)*.45;
  }else if(underlayMode==2){
    // Five-axis quasiperiodic twill; non-repeating crossing structures.
    float f=0.0,g=0.0;
    for(int j=0;j<5;j++){
      float axis=float(j)*1.2566371;
      vec2 direction=vec2(cos(axis),sin(axis));
      float stripe=dot(q,direction)*(1.0+underlayDensity*1.5);
      f+=cos(stripe+t*.14*sin(axis*2.0)+phaseSeed*.11);
      g+=sin(stripe*1.618034-t*.11+float(j)*1.2);
    }
    f*=.2;g*=.2;
    fiber=.5+.5*sin(f*6.2+g*5.3);
    ornament=.5+.5*cos(f*8.1-g*6.3+phaseSeed*.12);
    shimmer=pow(.5+.5*sin(f*12.5+g*7.4),8.0);
    shadow=.5-.5*f*g;
    phase=f*.75+g*.36;
  }else if(underlayMode==3){
    // Short anisotropic pile, with dense but low-frequency tuft clusters.
    vec2 pile=floor(q*(2.7+underlayDensity*3.6));
    float h=hash(pile+phaseSeed);
    float h2=hash(pile+vec2(13.0,37.0));
    float tufts=sin(q.x*(10.0+underlayDensity*15.0)+
      sin(q.y*7.0+h*4.0)*.9);
    fiber=.5+.5*tufts;
    ornament=.55+.45*sin(q.y*1.9+q.x*.25+h*.3+t*.18);
    shimmer=pow(max(0.0,.5+.5*cos(q.y*8.2-h2*3.0+t*.11)),9.0);
    shadow=.25+.6*h;
    phase=h*.44+q.y*.03;
  }else if(underlayMode==4){
    // Curved damask arabesques carrying thin-film opalescent halos.
    float a=atan(q.y,q.x),r=length(q);
    float bloomAngle=cos(a*(6.0+floor(underlayDensity*7.0))+
      sin(r*1.85-t*.22)*.9);
    float curl=sin(q.x*1.12+sin(q.y*1.36+t*.23)+phaseSeed*.14);
    float vines=cos(q.y*1.29-cos(q.x*.98-t*.17)*1.4);
    fiber=.5+.5*sin((curl+vines)*3.4+r*.3);
    ornament=.5+.5*bloomAngle*curl;
    shimmer=pow(.5+.5*cos((curl-vines)*7.3+r*.85),12.0);
    shadow=.5-.5*vines*bloomAngle;
    phase=(curl-vines)*.35+a*.1;
  }else if(underlayMode==5){
    // Original cellular gauze geometry — preserved exactly.
    vec2 h=q*(1.2+.65*underlayDensity);
    float a=sin(dot(h,vec2(1.0,0.0))*3.0+t*.2);
    float b=sin(dot(h,vec2(.5,.8660254))*3.0-t*.15);
    float c=sin(dot(h,vec2(-.5,.8660254))*3.0+t*.13);
    float strand=min(abs(a),min(abs(b),abs(c)));
    fiber=1.0-smoothstep(.055,.27,strand);
    float eyelet=clamp((abs(a)+abs(b)+abs(c))*.32,0.0,1.0);
    ornament=.5+.5*cos((a+b-c)*4.3+phaseSeed*.17);
    shimmer=pow(max(0.0,1.0-strand*2.5),8.0);
    shadow=eyelet;
    phase=(a+b-c)*.19;
  }else if(underlayMode==6){ // HOLOGRAPHIC BROCADE: diffractive medallions.
    vec2 g=q*(.69+.36*underlayDensity);
    float warp=sin(g.x*yarnFreq+sin(g.y*.61+t*.34)*1.1);
    float weft=cos(g.y*yarnFreq*.88+sin(g.x*.52-t*.43)*.91);
    float medallion=cos(length(g)*3.6-t*.57+phaseSeed*.2)*
      cos(atan(g.y,g.x)*7.0+t*.24);
    fiber=.5+.5*(warp*.52+weft*.48);
    ornament=.5+.5*sin(medallion*4.7+warp*1.6);
    shimmer=pow(.5+.5*cos((warp-weft)*6.0+t*.91),13.0);
    shadow=.5-.5*warp*weft;
    phase=medallion*.63+g.y*.04;
  }else if(underlayMode==7){ // GHOST QUILT: migrating stitched pillows.
    vec2 cell=floor(q*.73),d=fract(q*.73)-.5;
    float h=hash(cell+phaseSeed),r=length(d);
    float puff=sin(t*.49+h*6.283)*.095+.3;
    float seam=abs(max(abs(d.x),abs(d.y))-puff);
    fiber=1.0-smoothstep(.02,.09,seam);
    ornament=.5+.5*cos(r*15.0-t*.81+h*6.2);
    shimmer=pow(.5+.5*cos(seam*39.0+t*.74),10.0);
    shadow=clamp(r*1.5+h*.3,0.0,1.0);
    phase=r*1.2+h*.64+t*.13;
  }else if(underlayMode==8){ // THREADBARE CATHEDRAL: structural rib arches.
    vec2 g=q*.65;
    float arch=abs(g.x-.46*sin(g.y*1.1+t*.29));
    float vault=sin(g.y*2.8+sin(g.x*.94+t*.16)*1.7);
    float rib=sin((arch*5.3+vault*.8)*yarnFreq);
    float ruin=sin(g.x*3.2+g.y*4.3-t*.4+phaseSeed);
    fiber=pow(.5+.5*rib,4.0);
    ornament=.5+.5*cos(vault*6.0+t*.28);
    shimmer=pow(.5+.5*cos(ruin*6.0+t*.42),10.0);
    shadow=.5-.5*ruin*vault;
    phase=vault*.6+arch*.35;
  }else if(underlayMode==9){ // ELASTIC TARTAN: deforming independent plaid directions.
    vec2 stretch=q+vec2(sin(q.y*.9+t*.61)*.29,
      cos(q.x*.84-t*.44)*.27);
    float xx=sin(stretch.x*yarnFreq*2.6+
      sin(t*.41+stretch.y*.8)*1.7);
    float yy=cos(stretch.y*yarnFreq*2.2+
      cos(t*.38-stretch.x*.72)*1.5);
    fiber=.5+.5*(xx*.5+yy*.5);
    ornament=pow(.5+.5*xx*yy,2.0);
    shimmer=pow(.5+.5*cos((xx-yy)*4.5+t*.4),12.0);
    shadow=.5-.5*xx*yy;
    phase=xx*.22+yy*.42;
  }else if(underlayMode==10){ // MOIRÉ SATIN HAZE: evolving two-axis interference.
    float angle=t*.055+phaseSeed*.17;
    vec2 dir=vec2(cos(angle),sin(angle));
    vec2 other=vec2(cos(angle+.034+.17*underlayDensity),
      sin(angle+.034+.17*underlayDensity));
    float a=cos(dot(q,dir)*yarnFreq*3.8);
    float b=cos(dot(q,other)*yarnFreq*3.7+t*.21);
    float difference=a-b;
    fiber=.5+.5*(a*.54+b*.46);
    ornament=.5+.5*sin(difference*7.4+t*.57);
    shimmer=pow(.5+.5*cos(difference*10.0+q.x*.27),14.0);
    shadow=.5-.5*a*b;
    phase=difference*.47;
  }else if(underlayMode==11){ // HAUNTED UPHOLSTERY: phantom ornament emergence.
    vec2 g=q*.58;
    float a=sin(g.x*1.74+t*.3+sin(g.y*1.1)*1.2);
    float b=cos(g.y*1.87-t*.22+sin(g.x*.93)*1.4);
    float ghost=sin((a+b)*5.4+t*.37+phaseSeed*.2);
    float residue=sin(g.x*yarnFreq*3.2+g.y*2.6-t*.45);
    fiber=.5+.5*residue;
    ornament=pow(.5+.5*ghost,2.0);
    shimmer=pow(.5+.5*cos((ghost-residue)*6.0),9.0);
    shadow=.5-.5*a*b;
    phase=ghost*.46+residue*.16;
  }else if(underlayMode==12){ // RADIOACTIVE AFGHAN: pulsing granny squares.
    vec2 cell=floor(q*.67),d=fract(q*.67)-.5;
    float r=max(abs(d.x),abs(d.y));
    float h=hash(cell+phaseSeed);
    float crocheted=sin(r*(22.0+underlayDensity*19.0)-t*.63+h*3.0);
    float diagonal=sin((d.x+d.y)*yarnFreq*5.0+t*.74);
    fiber=.5+.5*crocheted;
    ornament=.5+.5*diagonal*crocheted;
    shimmer=pow(.5+.5*cos(r*38.0-t*.91),13.0);
    shadow=clamp(r*.93+h*.37,0.0,1.0);
    phase=r*2.4+h*.5;
  }else if(underlayMode==13){ // PARASITE UPHOLSTERY: recursive invasive vine paths.
    vec2 z=q*.48;
    float growth=0.0,fork=0.0,amp=.58;
    for(int i=0;i<3;i++){
      growth+=amp*sin(z.x*1.7+sin(z.y*1.1+t*.46)*2.1);
      fork+=amp*cos(z.y*1.9-cos(z.x*.89-t*.43)*2.3);
      z=mat2(.77,-.64,.64,.77)*z*1.91+vec2(.82,1.13);
      amp*=.52;
    }
    fiber=pow(.5+.5*cos(growth*(9.0+yarnFreq)+t*.42),6.0);
    ornament=.5+.5*sin((growth-fork)*7.0+t*.53);
    shimmer=pow(.5+.5*cos(fork*13.0-t*.88),11.0);
    shadow=.5-.5*growth*fork;
    phase=growth*.77+fork*.38;
  }else if(underlayMode==14){ // WET RELIC CLOTH: meniscus-film on ancient threads.
    float r=length(q*.26);
    float meniscus=sin(q.x*2.1+sin(q.y*.77+t*.35)*1.4);
    float warp=cos(q.y*yarnFreq*2.3-t*.42+meniscus*.8);
    float drip=sin(r*15.0-t*.61+phaseSeed*.17);
    fiber=.5+.5*(warp*.7+meniscus*.3);
    ornament=.5+.5*drip*meniscus;
    shimmer=pow(.5+.5*cos((drip-warp)*4.4+t*.72),14.0);
    shadow=.5-.5*meniscus*warp;
    phase=meniscus*.54+drip*.35;
  }else if(underlayMode==15){ // DISCO SHROUD: moving triangular sequin interference.
    vec2 grid=q*(.87+.17*underlayDensity);
    vec2 cell=floor(grid),d=fract(grid)-.5;
    float h=hash(cell+phaseSeed);
    float angle=t*(.21+.27*h)+h*6.2831853;
    d=mat2(cos(angle),-sin(angle),sin(angle),cos(angle))*d;
    float tri=max(d.y*.9-d.x*.52,-d.y*.69);
    float fringe=sin(tri*22.0-t*.93+h*6.2);
    fiber=.5+.5*fringe;
    ornament=1.0-smoothstep(.17,.36,abs(tri));
    shimmer=pow(.5+.5*cos(tri*39.0+t*.66),15.0);
    shadow=.5-.5*fringe*tri;
    phase=angle*.2+tri*2.0;
  }else{ // Unsupported textile mode should not change the canvas.
    return original;
  }
  // The underlying painting survives; top filaments are composited AFTER
  // this function. Keep a broad, visible material field without blank areas.
  float threadContrast=mix(.48,1.35,underlayContrast);
  float weave=clamp((fiber-.5)*threadContrast+.5,0.0,1.0);
  float motif=clamp(ornament,0.0,1.0);
  float hue=fract(underlayHue*.87+phase*.23+pigmentTime+
    baseField*.055+underlayVariation*.006);
  vec3 pigment=palette(hue);
  vec3 second=palette(fract(hue+.2+.17*underlayRelief));
  float highlight=pow(clamp(shimmer,0.0,1.0),.75);
  float raised=weave*(.23+.48*underlayRelief)+motif*.19;
  float shade=.53+.37*raised-.17*clamp(shadow,0.0,1.0);
  vec3 cloth=original*shade+
    pigment*(.26+.47*weave)+second*(.14+.31*motif);
  cloth+=mix(pigment,vec3(1.0,.98,1.0),.38)*
    highlight*underlayRelief*.18;
  return clamp(mix(original,cloth,underlayAmount*.93),0.0,1.6);
}
`;
