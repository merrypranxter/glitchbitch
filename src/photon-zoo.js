// PHOTON ZOO — eight living optical architectures, WebGL 1/2 compatible.
// No texture reads, framebuffers, external dependencies or expensive raymarch.
// Shader only exists when the user turns this family on.
export const photonSpecies = [
  "Prism rosettes",
  "Cathedral halos",
  "Liquid lenses",
  "Diffraction flowers",
  "Interference organisms",
  "Chromatic ribbons",
  "Op-art shockwaves",
  "Starburst engines"
];
export const photonPresets = [
  {name:"Opal chapel",species:"Cathedral halos",photonAmount:82,photonScale:43,photonMotion:36,photonDensity:67,photonRelief:82,photonHue:26,photonVariation:19},
  {name:"Neon carnivorous flower",species:"Diffraction flowers",photonAmount:91,photonScale:58,photonMotion:70,photonDensity:76,photonRelief:69,photonHue:72,photonVariation:43},
  {name:"Melted gemstone soup",species:"Liquid lenses",photonAmount:88,photonScale:46,photonMotion:54,photonDensity:54,photonRelief:94,photonHue:48,photonVariation:62},
  {name:"Impossible halo machine",species:"Prism rosettes",photonAmount:91,photonScale:38,photonMotion:63,photonDensity:89,photonRelief:80,photonHue:20,photonVariation:84},
  {name:"Interference creature",species:"Interference organisms",photonAmount:87,photonScale:67,photonMotion:68,photonDensity:77,photonRelief:78,photonHue:60,photonVariation:30},
  {name:"Psychedelic ribbon fossil",species:"Chromatic ribbons",photonAmount:92,photonScale:55,photonMotion:48,photonDensity:69,photonRelief:89,photonHue:36,photonVariation:52},
  {name:"Retinal detonation",species:"Op-art shockwaves",photonAmount:91,photonScale:63,photonMotion:72,photonDensity:92,photonRelief:62,photonHue:85,photonVariation:23},
  {name:"Astral jewelry box",species:"Starburst engines",photonAmount:84,photonScale:48,photonMotion:55,photonDensity:71,photonRelief:96,photonHue:13,photonVariation:72}
];
export const photonControlNames = ["photonAmount","photonScale","photonMotion","photonDensity","photonRelief","photonHue","photonVariation"];
export function photonPresetState(state,presetName) {
  const p=photonPresets.find(x=>x.name===presetName);
  if(!p)return state;
  const {name,species,...parameters}=p;
  return {...state,photonSpecies:species,...parameters};
}
export function nextPhotonSpecies(state,rng=Math.random){
  const options=photonSpecies.filter(x=>x!==state.photonSpecies);
  const selection=options[Math.min(options.length-1,Math.floor(Math.min(.999999,Math.max(0,rng()))*options.length))];
  return {...state,photonSpecies:selection,photonAmount:Math.max(50,state.photonAmount||0)};
}
export const photonGLSL = `
// Eight geometry-first luminous optical organisms. The base mathematical
// field provides phase/pigment changes, while the new forms have own kinetics.
uniform int photonSpecies;
uniform float photonAmount,photonScale,photonMotion,photonDensity;
uniform float photonRelief,photonHue,photonVariation;

vec3 livingPhotonZoo(vec3 original,vec2 uv,vec2 p,float v){
  if(photonAmount<.001)return original;
  float t=time*(.13+photonMotion*1.65);
  float ct=colorTime*(.09+photonMotion*.3);
  float density=4.0+photonDensity*13.0;
  float phaseShift=photonVariation*6.2831853+seed*.00003;
  vec2 q=p*(.58+photonScale*1.25);
  q+=.21*photonMotion*vec2(sin(q.y*.87+t*.41),cos(q.x*.69-t*.33));
  float rr=length(q)+.0001;
  float aa=atan(q.y,q.x);
  float shape=0.0, rim=0.0, glint=0.0, phase=0.0, alpha=.0;
  if(photonSpecies==0){ // Polar opal rosettes: nested petal-locked glass ripples.
    float petal=6.0+floor(photonDensity*13.0);
    float warpPetal=.31*cos(aa*petal+t*.29+phaseShift)
      +.13*cos(aa*(petal*.5)+t*.37);
    float f=rr*(7.0+photonScale*8.0)+warpPetal*3.2-t*.78;
    shape=pow(.5+.5*cos(f),12.0);
    rim=pow(.5+.5*sin(f+aa*petal*.3),18.0);
    glint=pow(.5+.5*cos(aa*petal-t*.34),8.0)*exp(-rr*.36);
    phase=f*.18+aa*.23;
    alpha=.23+.58*shape+.42*rim+.2*glint;
  }else if(photonSpecies==1){ // Cathedral halos: luminous multi-arc architecture.
    float spokes=8.0+floor(photonDensity*20.0);
    float rings=rr*(9.0+photonScale*9.0)-t*.72+sin(aa*5.0+t*.3)*.8;
    shape=pow(.5+.5*cos(rings),21.0);
    rim=pow(.5+.5*cos(aa*spokes+rr*2.0+t*.34+phaseShift),33.0);
    glint=pow(.5+.5*cos(aa*spokes*.5-rings*.44),19.0)*.8;
    phase=rings*.1+aa*.33;
    alpha=.14+.64*shape+.34*rim+.25*glint;
  }else if(photonSpecies==2){ // Migrating rounded lenses with thick liquid rims.
    vec2 g=q*(.42+photonDensity*1.6), cell=floor(g), local=fract(g);
    float best=3.0, second=3.0, phaseId=0.0;
    for(int j=-1;j<=1;j++){
      for(int i=-1;i<=1;i++){
        vec2 id=cell+vec2(float(i),float(j));
        float h=hash(id+phaseShift);
        vec2 center=vec2(float(i),float(j))+.5
          +.23*vec2(sin(t*.53+h*6.28),cos(t*.45+h*6.28));
        float d=length(local-center);
        if(d<best){second=best;best=d;phaseId=h;}
        else second=min(second,d);
      }
    }
    float radius=.22+.15*sin(t*.4+phaseId*6.28);
    float core=1.0-smoothstep(radius-.08,radius+.15,best);
    rim=1.0-smoothstep(.025,.085,abs(best-radius));
    shape=pow(.5+.5*cos(best*(19.0+photonDensity*16.0)-t+phaseId*6.28),10.0)*core;
    glint=pow(max(0.0,1.0-best),9.0)+.45*pow(1.0-smoothstep(.02,.14,second-best),2.0);
    phase=phaseId+best*2.8+t*.08;
    alpha=.13+.41*core+.55*rim+.27*shape;
  }else if(photonSpecies==3){ // Diffractive floral fans, not a flat mandala stamp.
    float petals=7.0+floor(photonDensity*16.0);
    float fan=cos(aa*petals+rr*2.0-t*.48+phaseShift);
    float shell=rr*(8.0+photonScale*12.0)+sin(aa*petals)*2.0-t*.8;
    shape=pow(.5+.5*sin(shell),13.0)*(.6+.4*fan*fan);
    rim=pow(.5+.5*cos(aa*petals*2.0-shell*.65),25.0);
    glint=pow(.5+.5*fan,13.0)*exp(-rr*.23);
    phase=aa*.6+shell*.065;
    alpha=.18+.54*shape+.46*rim+.2*glint;
  }else if(photonSpecies==4){ // Two moving wavefront sources grow interference organisms.
    vec2 a=vec2(.8*sin(t*.42),.65*cos(t*.37));
    vec2 b=vec2(.7*cos(t*.34+2.0),.8*sin(t*.31+1.4));
    float d1=length(q-a),d2=length(q-b);
    float u=sin(d1*density*2.1-t*1.1),w=cos(d2*density*2.06+t*.87);
    float interference=u*w;
    shape=pow(.5+.5*interference,10.0);
    rim=pow(.5+.5*cos((d1-d2)*density*3.0+t*.26),18.0);
    glint=pow(.5+.5*sin((d1+d2)*7.0-t*.71),13.0);
    phase=(d1-d2)*1.8+(d1+d2)*.25;
    alpha=.11+.52*shape+.49*rim+.15*glint;
  }else if(photonSpecies==5){ // Folding fabric-like chrome ribbons with specular ridges.
    float fold=q.y+sin(q.x*(1.4+photonDensity*1.7)+t*.47)*(.43+photonRelief*.45)
       +.16*sin(q.x*4.0-q.y*1.3-t*.63+phaseShift);
    float flow=fold*(7.0+photonScale*11.0)+t*.7;
    shape=pow(.5+.5*sin(flow),9.0);
    rim=pow(.5+.5*cos(flow*.52+q.x*.72),25.0);
    glint=pow(.5+.5*sin(flow*.26+v*2.0),7.0);
    phase=flow*.09+q.x*.16;
    alpha=.25+.41*shape+.46*rim+.18*glint;
  }else if(photonSpecies==6){ // Optical pressure waves + checker moire distortions.
    float radius=rr*(9.0+photonScale*9.0)-t*.91;
    float spiral=sin(aa*(7.0+floor(photonDensity*8.0))+radius*.31);
    float grid=sin(q.x*density*1.9+t*.32)*cos(q.y*density*1.78-t*.27);
    shape=pow(.5+.5*sin(radius+grid*2.0),16.0);
    rim=pow(.5+.5*cos(radius*.55+spiral*2.1),19.0);
    glint=pow(.5+.5*grid,9.0);
    phase=radius*.14+grid*.37;
    alpha=.14+.52*shape+.48*rim+.16*glint;
  }else{ // Kinetic starburst engines: polygon mirrors and radial light needles.
    float needles=8.0+floor(photonDensity*24.0);
    float beam=pow(abs(cos(aa*needles*.5+t*.16+phaseShift)),30.0);
    float ring=rr*(7.0+photonScale*11.0)-t*.73+sin(aa*6.0)*.8;
    shape=beam*(.55+.45*sin(ring));
    rim=pow(.5+.5*cos(ring),19.0);
    glint=pow(.5+.5*cos(aa*needles+t*.21),25.0);
    phase=aa*.44+rr*.71+t*.07;
    alpha=.15+.68*shape+.44*rim+.25*glint;
  }
  float chroma=fract(photonHue*.82+phase*.25+ct*.021+phaseShift*.065+v*.09);
  vec3 pigment=palette(chroma);
  vec3 secondPigment=palette(fract(chroma+.28+photonRelief*.18));
  float opticalPhase=phase*(4.0+photonDensity*6.0)+ct*.25+phaseShift;
  vec3 iridescence=.5+.5*cos(opticalPhase*vec3(1.0,1.23,1.49)
    +vec3(0.0,2.094,4.188));
  vec3 jewel=mix(pigment*.9+secondPigment*.32,iridescence*.72+pigment*.6,.28+.47*photonRelief);
  jewel+=secondPigment*rim*(.17+.73*photonRelief);
  jewel+=vec3(1.0,.94,1.0)*glint*.22*photonRelief;
  // A proper new architecture over the base art, not an opaque screenwash.
  float coverage=clamp(alpha*(.5+.45*photonDensity),0.0,.92);
  vec3 result=mix(original,original*.65+jewel,coverage*photonAmount);
  result+=jewel*rim*photonAmount*photonRelief*.22;
  return clamp(result,0.0,1.5);
}
`;
