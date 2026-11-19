// Spatial habitats let two moving atmospheres inhabit different canvas regions.
// All masks are continuous-time and deterministic. No texture/FBO allocations.
export const atmosphereHabitats = [
  "Everywhere", "Bloom iris", "Cell colonies", "Flowing ribbons", "Fractured mosaic", "Painted colonies",
];
export const atmosphereSecondHabitats = [...atmosphereHabitats, "Inverse first"];
export const atmosphereBlendModes = ["Over", "Light bloom", "Ink stain", "Spectral difference"];

export const habitatGLSL = `
#define ATM_MASK_A /* ATMO_MASK_A */
#define ATM_MASK_B /* ATMO_MASK_B */
uniform float atmoMaskScale,atmoMaskFeather,atmoMaskMotion,atmoMaskVariation;
uniform int habitatStampCount;
uniform vec4 habitatStamps[16];
// Seeded, reversible growth masks: each four-vector is (UV x, UV y, radius, parent).
// The mask moves but never introduces a frame-to-frame state or a seam.
float paintedHabitat(vec2 uv,float parent){
  vec2 aspect=vec2(res.x/res.y,1.);
  float t=time*(.08+atmoMaskMotion*.48);
  float inside=0.;
  for(int i=0;i<16;i++){
    if(i<habitatStampCount){
      vec4 stamp=habitatStamps[i];
      if(abs(stamp.w-parent)<.1){
        vec2 delta=(uv-stamp.xy)*aspect;
        float angle=atan(delta.y,delta.x);
        float index=float(i);
        float r=max(stamp.z,.05);
        float pulse=1.+(.03+.055*atmoMaskMotion)*sin(t+index*1.618);
        float frill=.055*sin(angle*(5.+floor(atmoMaskVariation*9.))+t*.6+index*2.1);
        float edge=r*(pulse+frill);
        float softness=mix(.01,.38,atmoMaskFeather)*r;
        float disk=1.-smoothstep(edge-softness,edge+softness,length(delta));
        inside=max(inside,disk);
      }
    }
  }
  return clamp(inside,0.,1.);
}
float atmosphereHabitat(vec2 uv,float phase,int kind){
  if(kind==0)return 1.;
  if(kind==5)return paintedHabitat(uv,phase<.1?0.:1.);
  vec2 q=(uv-.5)*vec2(res.x/res.y,1.);
  float t=time*(.06+atmoMaskMotion*.66)+phase*TAU;
  float sc=1.4+atmoMaskScale*5.6;
  float f=0.;
  if(kind==1){
    // A rotating, breathing angular silhouette, not a static circle clip.
    float angle=atan(q.y,q.x);
    float radius=length(q)*(1.3+atmoMaskScale*.9);
    float petals=5.+floor(atmoMaskVariation*8.);
    float wall=.55+.18*sin(petals*angle+t*.51)+.09*cos(angle*3.-t*.32);
    f=(wall-radius)*2.4;
  }else if(kind==2){
    // Multiple merging islands, growing from continuous interference fields.
    vec2 x=q*sc*.86+vec2(.25*sin(t*.17),.22*cos(t*.2));
    float h=sin(x.x*2.1+.72*sin(x.y*1.7+t*.23))
      *cos(x.y*2.3-.64*sin(x.x*1.2-t*.26));
    f=h+.28*fbm(x*1.16+vec2(t*.12,-t*.08))-.19;
  }else if(kind==3){
    // Distorted stream ribbons that snake across the whole canvas.
    vec2 x=q*sc;
    float wave=x.y*2.6+.7*sin(x.x*1.34+t*.42)
      +.35*cos(x.x*2.37-t*.25);
    f=sin(wave+t*.12)-.03;
  }else if(kind==4){
    // Soft-edged fractured polygon cells, jittering without popping.
    vec2 x=q*sc*1.3+vec2(.13*sin(t*.14),.12*cos(t*.16));
    vec2 cell=floor(x);
    vec2 tile=fract(x)-.5;
    vec2 offset=vec2(hash(cell+19.)-.5,hash(cell+79.)-.5)*.32;
    float edge=max(abs(tile.x-offset.x),abs(tile.y-offset.y));
    float threshold=.30+.11*(hash(cell+7.)-.5);
    f=(threshold-edge)*3.+.17*sin(t*.33+hash(cell+11.)*TAU);
  }else{return 1.;}
  float width=mix(.025,.48,atmoMaskFeather);
  return smoothstep(-width,width,f);
}
float atmosphereMaskForA(vec2 uv){
  return atmosphereHabitat(uv,0.,ATM_MASK_A);
}
float atmosphereMaskForB(vec2 uv){
  if(ATM_MASK_B==6)return 1.-atmosphereMaskForA(uv);
  return atmosphereHabitat(uv,.27,ATM_MASK_B);
}
`;

// Secondary atmosphere compositing remains delta-based: when B strength goes
// to zero, every blend mode also goes to exactly zero influence.
export const atmosphereHybridGLSL = `
vec3 crossbreedAtmospheres(vec3 base,vec3 child,vec2 uv,float fieldValue){
  vec3 delta=child-base;
  vec3 mixed=child;
#if ATM_BLEND_B == 1
  // Optical additive bloom: pigment highlights, with shadow retention.
  mixed=base+max(delta,vec3(0.))*1.6+min(delta,vec3(0.))*.25;
#elif ATM_BLEND_B == 2
  // An actual printed ink stain: darker portions are emphasized.
  mixed=base+min(delta,vec3(0.))*1.7+max(delta,vec3(0.))*.26;
#elif ATM_BLEND_B == 3
  // Spectral difference is strongest where the second parent changed color.
  vec3 differential=abs(delta);
  float phase=.5+.5*sin(fieldValue*7.3+time*.19+uv.x*5.);
  mixed=base+mix(delta,differential*vec3(-.3,.8,1.),phase*.82);
#endif
  return clamp(mixed,vec3(0.),vec3(2.));
}
`;
