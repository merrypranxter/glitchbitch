import {metamerMotionMode,metamerAtlasY,META_ATLAS_ROWS} from "./chromatic-time.js";
export const chromaticGeographyNames=["Off","Traveling spectral fronts","Concentric sun tides","Crossed interference","Warped chromatic territories","Spiral illumination"];
const clampGeo=(x,a,b)=>Math.max(a,Math.min(b,x));
const finiteGeo=(x,f)=>Number.isFinite(x)?x:f;
const fracGeo=x=>x-Math.floor(x);
const TAU_GEO=2*Math.PI;
export function geographyMode(s){
 return Math.round(s.chromaticSpace??0)===22&&finiteGeo(s.chromaticGeoAmount,75)>0?Math.round(clampGeo(finiteGeo(s.chromaticGeoMode,0),0,5)):0;
}
// Still global illumination can nevertheless use two different local suns.
// Existing time travel settings remain unchanged, and off restores old LUT.
export function geographyAtlasState(s){
 return geographyMode(s)&&!metamerMotionMode(s)?{...s,chromaticMetaMotion:1}:s;
}
export function geographyUniforms(s,colorTime){
 const mode=geographyMode(s), motion=metamerMotionMode(s);
 const period=clampGeo(finiteGeo(s.chromaticMetaPeriod,8),2,30);
 const t=fracGeo(finiteGeo(colorTime,0)/period+finiteGeo(s.chromaticMetaTimePhase,0)/100);
 return {mode,atlasMode:metamerMotionMode(geographyAtlasState(s)),
  config:[clampGeo(finiteGeo(s.chromaticGeoAmount,75)/100,0,1),
   clampGeo(finiteGeo(s.chromaticGeoScale,4),1,12),
   finiteGeo(s.chromaticGeoAngle,0)*Math.PI/180,
   clampGeo(finiteGeo(s.chromaticGeoSoftness,55)/100,.01,1)],
  clock:[motion?t:0,fracGeo(t*Math.round(clampGeo(finiteGeo(s.chromaticGeoDrift,1),0,3)))]};
}
// CPU reference for the GLSL field, including aspect correction and periodic phase.
export function geographyRow(s,colorTime,uv,aspect=1){
 const {mode,atlasMode,config,clock}=geographyUniforms(s,colorTime);
 if(!mode)return metamerAtlasY(s,colorTime);
 const [amount,freq,angle,soft]=config,[basePhase,drift]=clock;
 const x=(uv[0]-.5)*aspect,y=uv[1]-.5,c=Math.cos(angle),d=Math.sin(angle);
 const px=c*x-d*y,py=d*x+c*y,r=Math.hypot(px,py),w=TAU_GEO*drift;
 let v;
 if(mode===1)v=Math.sin(TAU_GEO*freq*px+w);
 else if(mode===2)v=Math.sin(TAU_GEO*freq*r-w);
 else if(mode===3)v=.5*(Math.sin(TAU_GEO*freq*px+w)+Math.sin(TAU_GEO*freq*py-w));
 else if(mode===4)v=Math.sin(TAU_GEO*freq*px+1.6*Math.sin(TAU_GEO*freq*.45*py+w))*Math.sin(TAU_GEO*freq*py+1.6*Math.cos(TAU_GEO*freq*.45*px-w));
 else v=Math.sin(TAU_GEO*freq*r+3*Math.atan2(py,px)-w);
 const edge=.03+.97*soft;
 const q=clampGeo((v+edge)/(2*edge),0,1);
 const local=q*q*(3-2*q);
 if(atlasMode===2)return fracGeo(basePhase+amount*local+.5/META_ATLAS_ROWS);
 const u=.5-.5*Math.cos(TAU_GEO*(basePhase+.5*amount*local));
 return (.5+u*(META_ATLAS_ROWS-1))/META_ATLAS_ROWS;
}
// Calculate once per fragment, not once per palette() lookup.
export const geographyGLSL=`
uniform int chromaticGeoMode,chromaticGeoAtlasMode;
uniform vec4 chromaticGeoConfig;
uniform vec2 chromaticGeoClock;
float chromaticFragmentRow;
float chromaticGeographyRow(vec2 uv){
 if(chromaticGeoMode==0)return chromaticAtlasY;
 vec2 p=(uv-.5)*vec2(res.x/res.y,1.);
 float angle=chromaticGeoConfig.z;
 float cs=cos(angle),sn=sin(angle);
 p=vec2(cs*p.x-sn*p.y,sn*p.x+cs*p.y);
 float f=TAU*chromaticGeoConfig.y,w=TAU*chromaticGeoClock.y;
 float r=length(p),v=0.;
 if(chromaticGeoMode==1)v=sin(f*p.x+w);
 else if(chromaticGeoMode==2)v=sin(f*r-w);
 else if(chromaticGeoMode==3)v=.5*(sin(f*p.x+w)+sin(f*p.y-w));
 else if(chromaticGeoMode==4)v=sin(f*p.x+1.6*sin(f*.45*p.y+w))*sin(f*p.y+1.6*cos(f*.45*p.x-w));
 else {float az=r>1e-6?atan(p.y,p.x):0.;v=sin(f*r+3.*az-w);}
 float edge=.03+.97*chromaticGeoConfig.w;
 float fieldValue=smoothstep(-edge,edge,v);
 float a=chromaticGeoConfig.x*fieldValue;
 if(chromaticGeoAtlasMode==2)return fract(chromaticGeoClock.x+a+.5/16.);
 float u=.5-.5*cos(TAU*(chromaticGeoClock.x+.5*a));
 return (.5+u*15.)/16.;
}
`;
