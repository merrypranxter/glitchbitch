import {spectralIlluminant,makeSpectralObserver,bakeMetamerPalette} from "./spectral-metamer.js";
export const META_ATLAS_ROWS=16;
export const metamerMotionNames=["Still","Two-sun breathing","Six-sun orbit"];
const clampTime=(v,a,b)=>Math.max(a,Math.min(b,v));
const finiteTime=(v,f)=>Number.isFinite(v)?v:f;
const lampIndex=v=>Math.round(clampTime(finiteTime(v,0),0,5));
export function metamerMotionMode(s){return Math.round(s.chromaticSpace??0)===22?Math.round(clampTime(finiteTime(s.chromaticMetaMotion,0),0,2)):0;}
const blendSpectra=(a,b,t)=>t<=0?a:t>=1?b:a.map((v,i)=>v+(b[i]-v)*t);
// Sample actual illuminant power blends before display conversion.
export function metamerAtlasIlluminant(s,row){
 const mode=metamerMotionMode(s),from=lampIndex(s.chromaticIlluminant),to=lampIndex(s.chromaticMetaTarget??5);
 if(mode===1)return blendSpectra(spectralIlluminant(from),spectralIlluminant(to),row/(META_ATLAS_ROWS-1));
 const q=row/META_ATLAS_ROWS*6,j=Math.floor(q),t=q-j;
 return blendSpectra(spectralIlluminant((from+j)%6),spectralIlluminant((from+j+1)%6),t);
}
export function bakeMetamerAtlas(s,width,mapGamut){
 if(!metamerMotionMode(s))return {height:1,pixels:bakeMetamerPalette(s,width,mapGamut)};
 const pixels=new Uint8Array(width*META_ATLAS_ROWS*4);
 for(let row=0;row<META_ATLAS_ROWS;row++){
  const observer=makeSpectralObserver(metamerAtlasIlluminant(s,row),s.chromaticMetaAdapt??100);
  pixels.set(bakeMetamerPalette(s,width,mapGamut,observer),row*width*4);
 }
 return {height:META_ATLAS_ROWS,pixels};
}
// Speed and phase are draw-time uniforms and never invalidate the atlas.
export function metamerAtlasY(s,colorTime){
 const mode=metamerMotionMode(s);
 if(!mode)return .5;
 const period=clampTime(finiteTime(s.chromaticMetaPeriod,8),2,30);
 const phase=finiteTime(s.chromaticMetaTimePhase,0)/100;
 const t=((finiteTime(colorTime,0)/period+phase)%1+1)%1;
 if(mode===1){const u=.5-.5*Math.cos(2*Math.PI*t);return (.5+u*(META_ATLAS_ROWS-1))/META_ATLAS_ROWS;}
 return ((t+.5/META_ATLAS_ROWS)%1+1)%1;
}
export function metamerAtlasKey(s){
 const mode=metamerMotionMode(s);
 return mode===1?[1,lampIndex(s.chromaticMetaTarget??5)]:[mode];
}
