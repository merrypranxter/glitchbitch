import {metamerMotionMode,META_ATLAS_ROWS,metamerAtlasY} from "./chromatic-time.js";
export const chromaticSymbiosisNames=["Off","Contour chromatography","Gradient metabolism","Directional pigment","Symmetry inheritance","Contour-gradient hybrid"];
const clampSym=(x,a,b)=>Math.max(a,Math.min(b,x));
const finiteSym=(x,f)=>Number.isFinite(x)?x:f;
const fracSym=x=>x-Math.floor(x);
const TAU_SYM=Math.PI*2;
export function symbiosisMode(s){
 return Math.round(s.chromaticSpace??0)===22&&finiteSym(s.chromaticSymAmount,80)>0?Math.round(clampSym(finiteSym(s.chromaticSymMode,0),0,5)):0;
}
export function symbiosisAtlasState(s){
 return symbiosisMode(s)&&!metamerMotionMode(s)?{...s,chromaticMetaMotion:1}:s;
}
export function symbiosisUniforms(s,colorTime){
 const mode=symbiosisMode(s),motion=metamerMotionMode(s);
 const phase=fracSym(finiteSym(colorTime,0)/clampSym(finiteSym(s.chromaticMetaPeriod,8),2,30)+finiteSym(s.chromaticMetaTimePhase,0)/100);
 return {mode,atlasMode:motion||Number(mode>0),
  config:[clampSym(finiteSym(s.chromaticSymAmount,80)/100,0,1),clampSym(finiteSym(s.chromaticSymFrequency,4),1,16),clampSym(finiteSym(s.chromaticSymSensitivity,55)/100,0,1),clampSym(finiteSym(s.chromaticSymSoftness,50)/100,0,1)],
  clock:[motion?phase:0,fracSym(phase*Math.round(clampSym(finiteSym(s.chromaticSymDrift,1),0,3)))]};
}
export function symbiosisBaseRow(s,colorTime){
 return symbiosisMode(s)&&!metamerMotionMode(s)? .5/META_ATLAS_ROWS:metamerAtlasY(s,colorTime);
}
// CPU reference uses the final primary scalar field value and its screen-space
// gradient normalized to a 720-pixel reference height; p is the warped point.
export function structuralSignal(mode,v,gradient,p,frequency,sensitivity,drift,folds=1){
 const w=TAU_SYM*drift,mag=Math.hypot(...gradient),angle=Math.atan2(p[1],p[0]);
 const strength=1-Math.exp(-mag*(2+58*sensitivity));
 const contour=.5+.5*Math.sin(TAU_SYM*frequency*v+w);
 if(mode===1)return contour;
 if(mode===2)return strength;
 if(mode===3)return mag>1e-8?.5+.5*Math.cos(Math.atan2(gradient[1],gradient[0])*frequency+w):.5;
 if(mode===4)return .5+.5*Math.cos(angle*Math.max(1,Math.floor(folds))*frequency+w);
 return contour*strength;
}
export function structuralRow(s,colorTime,baseRow,v,gradient,p,folds=1){
 const {mode,atlasMode,config,clock}=symbiosisUniforms(s,colorTime);
 if(!mode)return baseRow;
 const [amount,frequency,sensitivity,softness]=config;
 const signal=structuralSignal(mode,v,gradient,p,frequency,sensitivity,clock[1],folds);
 const edge=.025+.475*softness,q=clampSym((signal-.5+edge)/(2*edge),0,1),local=q*q*(3-2*q);
 if(atlasMode===2){
  const target=fracSym(clock[0]+local+.5/META_ATLAS_ROWS);
  const delta=fracSym(target-baseRow+.5)-.5;
  return fracSym(baseRow+amount*delta);
 }
 const target=(.5+(.5-.5*Math.cos(TAU_SYM*(clock[0]+.5*local)))*(META_ATLAS_ROWS-1))/META_ATLAS_ROWS;
 return baseRow+(target-baseRow)*amount;
}
export const symbiosisGLSL=`
uniform int chromaticSymMode,chromaticSymAtlasMode;
uniform vec4 chromaticSymConfig;
uniform vec2 chromaticSymClock;
float chromaticStructuralRow(float row,float val,vec2 p){
 if(chromaticSymMode==0)return row;
 float freq=chromaticSymConfig.y,sense=chromaticSymConfig.z,w=TAU*chromaticSymClock.y;
 float contour=.5+.5*sin(TAU*freq*val+w);
 vec2 grad=vec2(0.);
 // Hardware derivatives are evaluated in a uniform branch, before any
 // fragment-dependent discard. Normalize for export resolution.
 #ifdef CHROMATIC_DERIVATIVES
 if(chromaticSymMode==2||chromaticSymMode==3||chromaticSymMode==5)
  grad=vec2(dFdx(val),dFdy(val))*res.y/720.;
 #endif
 float mag=length(grad);
 float response=1.-exp(-mag*(2.+58.*sense));
 float signal=contour;
 if(chromaticSymMode==2)signal=response;
 else if(chromaticSymMode==3)signal=mag>1e-8?.5+.5*cos(atan(grad.y,grad.x)*freq+w):.5;
 else if(chromaticSymMode==4){
  float az=length(p)>1e-6?atan(p.y,p.x):0.;
  signal=.5+.5*cos(az*max(1.,floor(symmetry))*freq+w);
 }
 else if(chromaticSymMode==5)signal=contour*response;
 // WebGL1 without OES_standard_derivatives keeps a visible contour fallback.
 #ifndef CHROMATIC_DERIVATIVES
 if(chromaticSymMode==2||chromaticSymMode==3||chromaticSymMode==5)signal=contour;
 #endif
 float edge=.025+.475*chromaticSymConfig.w;
 float local=smoothstep(.5-edge,.5+edge,signal);
 float amount=chromaticSymConfig.x;
 if(chromaticSymAtlasMode==2){
  float target=fract(chromaticSymClock.x+local+.5/16.);
  float delta=fract(target-row+.5)-.5;
  return fract(row+amount*delta);
 }
 float u=.5-.5*cos(TAU*(chromaticSymClock.x+.5*local));
 return mix(row,(.5+u*15.)/16.,amount);
}
`;
