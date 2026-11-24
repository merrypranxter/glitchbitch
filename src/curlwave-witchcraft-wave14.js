// Wave 14 — Curlwave Witchcraft from the original violet-curl-waves.js.
// A mathematically divergence-free curl field advects underlying geometry;
// crest curvature, oil-film chroma and sparkles are applied in the SAME
// Glitchbitch renderer as preview and PNG/GIF/MP4; no new FBOs or contexts.
export const vcModes=["Violet Curl Sea","Hairpin Caustic Ribbons","Bioluminescent River Veins","Oil-Slick Vortex Velvet","Stormglass Interference"];
export const vcControls=["vcAmount","vcScale","vcSpeed","vcAdvection","vcCrest","vcFilm","vcDust","vcGlow","vcHue","vcDepth","vcTurbulence","vcVariation","vcStrands"];
export const vcPresets=[
  {
    "name": "Violet Deepwater",
    "vcMode": "Violet Curl Sea",
    "vcAmount": 78,
    "vcScale": 58,
    "vcSpeed": 42,
    "vcAdvection": 50,
    "vcCrest": 72,
    "vcFilm": 68,
    "vcDust": 29,
    "vcGlow": 57,
    "vcHue": 54,
    "vcDepth": 74,
    "vcTurbulence": 48,
    "vcVariation": 45,
    "vcStrands": 50
  },
  {
    "name": "Caustic Hairpin Halo",
    "vcMode": "Hairpin Caustic Ribbons",
    "vcAmount": 93,
    "vcScale": 70,
    "vcSpeed": 58,
    "vcAdvection": 76,
    "vcCrest": 95,
    "vcFilm": 80,
    "vcDust": 17,
    "vcGlow": 93,
    "vcHue": 62,
    "vcDepth": 64,
    "vcTurbulence": 74,
    "vcVariation": 77,
    "vcStrands": 95
  },
  {
    "name": "River of Alien Nerves",
    "vcMode": "Bioluminescent River Veins",
    "vcAmount": 92,
    "vcScale": 54,
    "vcSpeed": 61,
    "vcAdvection": 71,
    "vcCrest": 84,
    "vcFilm": 82,
    "vcDust": 44,
    "vcGlow": 90,
    "vcHue": 27,
    "vcDepth": 73,
    "vcTurbulence": 66,
    "vcVariation": 49,
    "vcStrands": 99
  },
  {
    "name": "Oil Spill From Heaven",
    "vcMode": "Oil-Slick Vortex Velvet",
    "vcAmount": 97,
    "vcScale": 59,
    "vcSpeed": 38,
    "vcAdvection": 63,
    "vcCrest": 77,
    "vcFilm": 100,
    "vcDust": 19,
    "vcGlow": 89,
    "vcHue": 84,
    "vcDepth": 92,
    "vcTurbulence": 59,
    "vcVariation": 66,
    "vcStrands": 74
  },
  {
    "name": "Stormglass Vortex Rite",
    "vcMode": "Stormglass Interference",
    "vcAmount": 99,
    "vcScale": 82,
    "vcSpeed": 85,
    "vcAdvection": 91,
    "vcCrest": 100,
    "vcFilm": 98,
    "vcDust": 68,
    "vcGlow": 100,
    "vcHue": 51,
    "vcDepth": 95,
    "vcTurbulence": 98,
    "vcVariation": 92,
    "vcStrands": 89
  },
  {
    "name": "Subtle Oceanic Sheen",
    "vcMode": "Violet Curl Sea",
    "vcAmount": 33,
    "vcScale": 37,
    "vcSpeed": 31,
    "vcAdvection": 28,
    "vcCrest": 39,
    "vcFilm": 48,
    "vcDust": 12,
    "vcGlow": 30,
    "vcHue": 45,
    "vcDepth": 38,
    "vcTurbulence": 27,
    "vcVariation": 24,
    "vcStrands": 22
  }
];
export function applyVcPreset(state,name){
  const p=vcPresets.find(candidate=>candidate.name===name);
  if(!p)return state;
  const {name:_label,...fields}=p;
  return {...state,...fields};
}
function unit(random){
  const x=Number(random());
  return Number.isFinite(x)?Math.max(0,Math.min(1-Number.EPSILON,x)):0;
}
export function shuffleVc(state,random=Math.random){
  const result={...state,vcMode:vcModes[Math.floor(unit(random)*vcModes.length)]};
  for(const key of vcControls)
    result[key]=key==="vcAmount"?35+unit(random)*65:unit(random)*100;
  return result;
}
export const hideVc=state=>({...state,vcAmount:0});
export const vcGLSL="// From \"violet-curl-waves\": animated curl advection, curvature crests,\n// thin-film interference and sparkling advection. Uses shared noise,\n// palette, seed/time, res and field. Zero new buffers/passes.\nuniform int vcMode;\nuniform float vcAmount,vcScale,vcSpeed,vcAdvection,vcCrest,vcFilm;\nuniform float vcDust,vcGlow,vcHue,vcDepth,vcTurbulence,vcVariation,vcStrands;\n// A stream function psi; rotating its gradient by 90 degrees gives\n// a divergence-free velocity, so swirls don't artificially compress.\nfloat vcPsi(vec2 q,float t){\n  float a=sin(q.x*1.9+t*.48)*cos(q.y*2.1-t*.31);\n  float b=.48*sin(q.x*2.8+q.y*1.5-t*.73);\n  float c=.29*cos(q.x*.9-q.y*3.1+t*.57);\n  return a+b*vcTurbulence+c;\n}\nvec2 vcCurl(vec2 q,float t){\n  float e=.042;\n  float dx=(vcPsi(q+vec2(e,0.0),t)-\n            vcPsi(q-vec2(e,0.0),t))/(2.0*e);\n  float dy=(vcPsi(q+vec2(0.0,e),t)-\n            vcPsi(q-vec2(0.0,e),t))/(2.0*e);\n  return vec2(dy,-dx);\n}\nvec2 vcWarpPoint(vec2 p){\n  float clock=time*(.055+vcSpeed*.33)+vcVariation*4.0;\n  vec2 velocity=vcCurl(p*(.48+vcScale*1.35),clock);\n  return velocity*vcAdvection*vcAmount*(.035+.090*vcTurbulence);\n}\nfloat vcHeight(vec2 z,float t){\n  float n1=noise(z*1.06+vec2(t*.22,-t*.16));\n  float n2=noise(rotate(.55)*z*2.13+vec2(-t*.27,t*.19));\n  float waves=sin(z.x*2.3+sin(z.y*1.9-t*.5)*.9+t*.75);\n  return n1*.52+n2*.29+waves*.19;\n}\nvec3 vcDress(vec3 col,vec2 uv,vec2 sceneP,float sceneValue){\n  float aspect=res.x/max(res.y,1.0);\n  float clock=time*(.055+vcSpeed*.33);\n  float seedPhase=seed*.00071+seedHigh*.019+vcVariation*6.2831853;\n  vec2 q=(uv-.5)*vec2(aspect,1.0)*(2.7+vcScale*5.8);\n  q+=.24*vcTurbulence*vec2(\n    sin(sceneP.y*.7+clock*.7+seedPhase),\n    cos(sceneP.x*.6-clock*.5-seedPhase));\n  vec2 flow=vcCurl(q*.85,clock+seedPhase*.21);\n  vec2 advected=q+flow*vcAdvection*(.24+.28*vcDepth)-\n                  vec2(clock*.07,-clock*.10);\n  float e=.065;\n  float h=vcHeight(advected,clock);\n  float hxp=vcHeight(advected+vec2(e,0.0),clock);\n  float hxm=vcHeight(advected-vec2(e,0.0),clock);\n  float hyp=vcHeight(advected+vec2(0.0,e),clock);\n  float hym=vcHeight(advected-vec2(0.0,e),clock);\n  vec2 gradient=vec2(hxp-hxm,hyp-hym)/(2.0*e);\n  float lap=(hxp+hxm+hyp+hym-4.0*h)/(e*e);\n  float crest=clamp(max(0.0,-lap)*.011,0.0,1.0);\n  crest=smoothstep(.14,.78,crest*(.35+.85*vcCrest));\n  float wavePhase=atan(flow.y,flow.x)+h*10.0-clock*.73;\n  float rivulet=pow(.5+.5*sin(\n    advected.x*(8.0+vcStrands*19.0)+\n    advected.y*(2.0+vcDepth*6.0)+\n    h*12.0-clock*2.2),12.0);\n  float swirls=pow(.5+.5*sin(\n    wavePhase*3.0+length(advected)*5.0+\n    sin(h*6.0)*2.0),5.0);\n  float ribbons=pow(.5+.5*cos(\n    advected.y*(9.0+vcStrands*14.0)-\n    flow.x*(5.0+vcAdvection*9.0)+clock),9.0);\n  float dustNoise=noise(advected*8.0+\n      vec2(clock*.33,-clock*.42)+seedPhase);\n  float dust=pow(max(0.0,dustNoise),13.0)*\n    (.45+.55*sin(clock*5.0+dustNoise*18.0));\n  vec3 normal=normalize(vec3(-gradient*vcDepth*.35,1.0));\n  float grazing=pow(clamp(1.0-normal.z,0.0,1.0),.7);\n  float phase=vcHue+colorTime*.018+sceneValue*.019+\n    h*.37+length(flow)*.044+seedPhase*.013;\n  vec3 deep=palette(phase+.17);\n  vec3 thinFilm=palette(phase+\n    .27*sin(h*(8.0+vcFilm*19.0)+grazing*2.1-clock*.8));\n  vec3 glitter=palette(phase+.42);\n  float gleam=crest*(.2+.8*vcFilm)*(.22+.78*vcGlow);\n  float filaments=rivulet*vcStrands*(.18+.65*vcGlow);\n  float texture=clamp(crest*.58+ribbons*.32+\n    swirls*.20,0.0,1.0);\n  vec3 material=col;\n  if(vcMode==0){ // Violet Curl Sea: iridescent troughs and crests\n    material=col*(.66+.20*h)+deep*(.22+.24*vcDepth)+\n      thinFilm*(gleam*.9+filaments*.16);\n  }else if(vcMode==1){ // Hairpin Caustic Ribbons\n    material=col*(.48+.36*texture)+\n      thinFilm*(crest*1.04+ribbons*.72*vcStrands)+\n      glitter*(filaments*.9);\n  }else if(vcMode==2){ // Bioluminescent River Veins\n    float vessels=clamp(filaments+swirls*.35*vcStrands,0.0,1.0);\n    material=col*(.56+.33*(1.0-vessels))+\n      deep*(.13+.12*vcDepth)+\n      thinFilm*vessels*(.67+.65*vcGlow);\n  }else if(vcMode==3){ // Oil-Slick Vortex Velvet\n    float silk=.5+.5*sin(h*17.0+grazing*6.0-clock*.5);\n    material=col*(.34+.37*silk)+\n      mix(deep,thinFilm,silk)*( .22+.46*vcDepth)+\n      glitter*(gleam*.72+grazing*.50*vcFilm);\n  }else{ // Stormglass Interference\n    float foam=clamp(crest*.9+swirls*.55+ribbons*.56,0.0,1.0);\n    material=col*(.35+.36*(1.0-foam))+\n      thinFilm*foam*(.42+.74*vcGlow)+\n      glitter*(filaments*.54+gleam*.63);\n  }\n  material+=thinFilm*dust*vcDust*(.18+.62*vcGlow);\n  // A layer can flow over and transform the artwork, but never deletes\n  // original geometry/palette. Tone may still be processed downstream.\n  float coverage=clamp(vcAmount*(.34+.49*vcDepth),0.0,1.0);\n  return mix(col,material,coverage);\n}";
