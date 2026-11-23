// Wave 13 — Kleinian Dither Cathedral, adapted from the user's own
// shaderslop_designs/by_math/16_dithering_halftone_print/klein-dither.js.
// Three maximum paper/depth planes rather than the standalone 8x12x4
// multi-sampled WebGL2/Three.js renderer; all drawing is on the exact
// shared Glitchbitch WebGL1/WebGL2 GPU and export pipeline.
export const kdModes=["Schottky Lace Press","Kleinian Stained Glass","Cantor Confetti","Möbius Film Strips","Parallax Dither Cathedral"];
export const kdControls=["kdAmount","kdScale","kdLayers","kdInversion","kdSpin","kdParallax","kdDither","kdChroma","kdHue","kdInk","kdGlow","kdWarp","kdVariation"];
export const kdPresets=[
  {
    "name": "Electric Lace Inversion",
    "kdMode": "Schottky Lace Press",
    "kdAmount": 86,
    "kdScale": 58,
    "kdLayers": 47,
    "kdInversion": 69,
    "kdSpin": 43,
    "kdParallax": 40,
    "kdDither": 81,
    "kdChroma": 64,
    "kdHue": 34,
    "kdInk": 75,
    "kdGlow": 79,
    "kdWarp": 60,
    "kdVariation": 54
  },
  {
    "name": "Wormhole Stained Glass",
    "kdMode": "Kleinian Stained Glass",
    "kdAmount": 94,
    "kdScale": 67,
    "kdLayers": 86,
    "kdInversion": 78,
    "kdSpin": 55,
    "kdParallax": 77,
    "kdDither": 53,
    "kdChroma": 81,
    "kdHue": 78,
    "kdInk": 90,
    "kdGlow": 91,
    "kdWarp": 67,
    "kdVariation": 66
  },
  {
    "name": "Cantor Disco Dust",
    "kdMode": "Cantor Confetti",
    "kdAmount": 93,
    "kdScale": 72,
    "kdLayers": 91,
    "kdInversion": 88,
    "kdSpin": 61,
    "kdParallax": 69,
    "kdDither": 99,
    "kdChroma": 82,
    "kdHue": 39,
    "kdInk": 83,
    "kdGlow": 98,
    "kdWarp": 82,
    "kdVariation": 76
  },
  {
    "name": "Möbius Neon Matinee",
    "kdMode": "Möbius Film Strips",
    "kdAmount": 89,
    "kdScale": 48,
    "kdLayers": 77,
    "kdInversion": 59,
    "kdSpin": 71,
    "kdParallax": 84,
    "kdDither": 69,
    "kdChroma": 97,
    "kdHue": 65,
    "kdInk": 93,
    "kdGlow": 80,
    "kdWarp": 92,
    "kdVariation": 49
  },
  {
    "name": "Cathedral of Broken Pixels",
    "kdMode": "Parallax Dither Cathedral",
    "kdAmount": 100,
    "kdScale": 83,
    "kdLayers": 100,
    "kdInversion": 91,
    "kdSpin": 69,
    "kdParallax": 100,
    "kdDither": 100,
    "kdChroma": 100,
    "kdHue": 64,
    "kdInk": 97,
    "kdGlow": 100,
    "kdWarp": 100,
    "kdVariation": 88
  },
  {
    "name": "Gentle Print Ghost",
    "kdMode": "Schottky Lace Press",
    "kdAmount": 35,
    "kdScale": 35,
    "kdLayers": 26,
    "kdInversion": 42,
    "kdSpin": 24,
    "kdParallax": 25,
    "kdDither": 34,
    "kdChroma": 36,
    "kdHue": 48,
    "kdInk": 34,
    "kdGlow": 31,
    "kdWarp": 17,
    "kdVariation": 20
  }
];
export function applyKdPreset(state,name){
  const preset=kdPresets.find(p=>p.name===name);
  if(!preset)return state;
  const {name:_label,...fields}=preset;
  return {...state,...fields};
}
function sampleUnit(random){
  const number=Number(random());
  return Number.isFinite(number)?Math.max(0,Math.min(1-Number.EPSILON,number)):0;
}
export function shuffleKd(state,random=Math.random){
  const next={...state,kdMode:kdModes[Math.floor(sampleUnit(random)*kdModes.length)]};
  for(const key of kdControls)next[key]=key==="kdAmount"
    ?35+sampleUnit(random)*65:sampleUnit(random)*100;
  return next;
}
export const hideKd=state=>({...state,kdAmount:0});
export const kdGLSL="// Vault Wave 13: Schottky inversions, Mobius mapping and Bayer print.\n// Camera-independent 3 layers max, 7 inversions per layer, no FBO.\nuniform int kdMode;\nuniform float kdAmount,kdScale,kdLayers,kdInversion,kdSpin,kdParallax;\nuniform float kdDither,kdChroma,kdHue,kdInk,kdGlow,kdWarp,kdVariation;\nvec2 kdMultiply(vec2 a,vec2 b) {\n  return vec2(a.x*b.x-a.y*b.y,a.x*b.y+a.y*b.x);\n}\nvec2 kdDivide(vec2 a,vec2 b) {\n  return vec2(dot(a,b),a.y*b.x-a.x*b.y)/max(.018,dot(b,b));\n}\nfloat kdBayer(vec2 pixel) {\n  // Exactly the 4x4 ordered threshold matrix, without GLSL3 int arrays.\n  vec2 q=mod(floor(pixel),4.0);\n  float odd=mod(q.x,2.0);\n  float hi=floor(q.x*.5);\n  float rank=odd*8.0+hi*2.0;\n  if(q.y<.5)rank=odd*8.0+hi*2.0;\n  else if(q.y<1.5)rank=12.0-odd*8.0+hi*2.0;\n  else if(q.y<2.5)rank=3.0+odd*8.0-hi*2.0;\n  else rank=15.0-odd*8.0-hi*2.0;\n  return (rank+.5)/16.0;\n}\n// Return normalized inversion depth, illuminated circle edges, final phase.\nvec3 kdOrbit(vec2 z,float clock,float origin) {\n  vec2 a=z+vec2(.11*sin(clock*.3+origin),.13*cos(clock*.29-origin));\n  vec2 b=kdMultiply(vec2(.21*cos(clock*.22),.17*sin(clock*.18)),z)+vec2(1.0,0.0);\n  z=kdDivide(a,b);\n  float inversions=0.0,edge=0.0;\n  float radius=.38+.22*kdInversion+.05*sin(clock*.3+origin);\n  for(int stepIndex=0;stepIndex<7;stepIndex++){\n    float f=float(stepIndex);\n    float angle=TAU*mod(f,4.0)*.25+clock*.075;\n    vec2 center=rotate(angle)*vec2(.60+.045*sin(f*3.5+origin),0.0);\n    vec2 delta=z-center;\n    float d2=dot(delta,delta);\n    float dist=sqrt(max(d2,1e-5));\n    float border=exp(-abs(dist-radius)*(12.0+25.0*kdGlow));\n    edge=max(edge,border);\n    if(d2<radius*radius){\n      z=center+delta*min(16.0,radius*radius/max(.016,d2));\n      inversions+=1.0;\n    }\n  }\n  float ph=atan(z.y,z.x)/TAU+.5;\n  ph+=.11*log(max(length(z),.04));\n  return vec3(inversions/7.0,edge,fract(ph));\n}\nvec3 kdDress(vec3 base,vec2 uv,vec2 sceneP,float sceneValue) {\n  float aspect=res.x/max(1.0,res.y);\n  float clock=time*(.035+.34*kdSpin);\n  float origin=seed*.00071+seedHigh*.03+kdVariation*TAU;\n  // Grain resolves in actual physical pixels, with stable phase in GIF/MP4.\n  float thresholdR=kdBayer(gl_FragCoord.xy);\n  float thresholdG=kdBayer(gl_FragCoord.xy+vec2(2.0,3.0));\n  float thresholdB=kdBayer(gl_FragCoord.xy+vec2(3.0,1.0));\n  vec3 accumulated=base;\n  float screenLimit=min(2.0+kdScale*4.0,max(1.5,res.y/230.0));\n  for(int plane=0;plane<3;plane++){\n    float layer=float(plane);\n    if(layer>kdLayers*2.12+.06)continue;\n    float depth=(layer+.5)/3.0;\n    vec2 z=(uv-.5)*vec2(aspect,1.0)*screenLimit;\n    z*=1.0+layer*(.20+.20*kdParallax);\n    z+=vec2(sin(sceneP.y*1.2+clock+origin),\n            cos(sceneP.x*1.1-clock*.65+origin))*.13*kdWarp;\n    z+=vec2(sin(clock*.3+origin),cos(clock*.36-origin))*\n         (depth-.5)*kdParallax*.52;\n    vec3 orbit=kdOrbit(z,clock+layer*.72,origin+layer*.21);\n    float rings=.5+.5*sin((orbit.z*TAU)*(4.0+kdScale*9.0)\n                      -clock*(.6+layer*.2));\n    float chains=.5+.5*cos((orbit.x*11.0+orbit.z)*TAU\n                      +layer*1.2+clock*.2);\n    float contours=smoothstep(.48,.89,\n                     mix(rings,chains,.37+.25*kdWarp));\n    float detail=clamp(orbit.y*(.4+.6*kdGlow)+\n                       orbit.x*(.13+.5*kdInversion)+\n                       contours*(.19+.27*kdScale),0.0,1.0);\n    float crystal=pow(max(.0,orbit.y),2.0);\n    float mask=detail;\n    if(kdMode==0)mask=clamp(orbit.y*.66+contours*.55,0.0,1.0);\n    if(kdMode==1)mask=clamp(.23+orbit.x*.75+rings*.3,0.0,1.0);\n    if(kdMode==2)mask=clamp(orbit.x*.92+crystal*.7,0.0,1.0);\n    if(kdMode==3)mask=clamp(contours*.65+chains*.35+orbit.y*.28,0.0,1.0);\n    if(kdMode==4)mask=clamp(orbit.x*.6+orbit.y*.7+contours*.55,0.0,1.0);\n    // Channel-shifted thresholds turn circle-inversion outlines into\n    // actual color-separated *ordered print*, not random RGB static.\n    vec3 smoothInk=clamp(vec3(\n       mask+kdChroma*.19*sin(orbit.z*TAU+layer*2.1),\n       mask+kdChroma*.17*cos(orbit.z*TAU*1.5-layer),\n       mask+kdChroma*.18*sin(orbit.z*TAU*2.0+layer)),0.0,1.0);\n    vec3 stipple=vec3(step(thresholdR,smoothInk.r),\n                     step(thresholdG,smoothInk.g),\n                     step(thresholdB,smoothInk.b));\n    vec3 printMask=mix(smoothInk,stipple,kdDither);\n    float phase=kdHue+colorTime*.012+origin*.013+\n                depth*.27+sceneValue*.022+orbit.z*.45;\n    vec3 pigment=palette(phase);\n    vec3 splitPigment=vec3(\n       palette(phase+kdChroma*.11).r,\n       palette(phase+.29+kdChroma*.13).g,\n       palette(phase+.61+kdChroma*.15).b);\n    vec3 ink=mix(pigment,splitPigment,kdChroma*.68);\n    vec3 colored=ink*printMask;\n    float glow=pow(max(0.0,orbit.y),2.0)*kdGlow;\n    if(kdMode==1)colored+=palette(phase+.38)*glow*.65;\n    else if(kdMode==2)colored+=palette(phase+.6)*glow*.8;\n    else if(kdMode==3)colored+=palette(phase+.16)*glow*.52;\n    else if(kdMode==4)colored+=palette(phase+.45)*glow*.75;\n    else colored+=ink*glow*.34;\n    float opacity=(.24+.54*kdInk)*(.34+depth*.48);\n    accumulated=mix(accumulated,\n      accumulated*(.52+.22*(1.0-mask))+\n      colored*(.64+.68*kdGlow),opacity);\n  }\n  // Keep original artwork underneath, never erase the background to void.\n  return mix(base,accumulated,clamp(kdAmount*(.3+.7*kdInk),0.0,1.0));\n}";
