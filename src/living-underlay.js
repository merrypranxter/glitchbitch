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
  "Cellular gauze"
];

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
    underlayRelief:74,underlayHue:18,underlayContrast:82,underlayVariation:71}
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
  }else{
    // Cellular gauze: three tilted knitted thread directions leave eyelets.
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
