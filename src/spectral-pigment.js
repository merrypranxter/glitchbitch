import { Color } from "./vendor/spectral.js";
import {srgbToLin,linToSrgb} from "./colorspaces.js";
const clampPigment=(x,min=0,max=1)=>Math.max(min,Math.min(max,x));
const safePigment=(x,fallback)=>Number.isFinite(x)?x:fallback;
const lerpPigment=(a,b,t)=>a+(b-a)*t;
// Representative 38-band spectra reconstructed from RGB, not measured paints.
export function pigmentStop(hex){
 const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255);
 const color=new Color(rgb.map(v=>v*255));
 const reflectance=color.R.map(v=>clampPigment(v,.001,1));
 return {rgb,linear:srgbToLin(rgb),reflectance,ks:reflectance.map(r=>(1-r)**2/(2*r)),logR:reflectance.map(Math.log),luminance:clampPigment(color.XYZ[1],.01,1)};
}
// Stable inverse of K/S = (1-R)^2/(2R).
export function reflectanceFromKS(ks){return 1/(1+ks+Math.sqrt(ks*(ks+2)));}
export function mixPigment(a,b,t,{mode=20,amount=100,weight=100,mapGamut=rgb=>rgb.map(v=>clampPigment(v))}={}){
 t=clampPigment(t);
 if(t===0||a.rgb.every((v,i)=>v===b.rgb[i]))return a.rgb.slice();
 if(t===1)return b.rgb.slice();
 const strength=clampPigment(safePigment(amount,100)/100);
 const additive=a.linear.map((v,i)=>lerpPigment(v,b.linear[i],t));
 if(strength===0)return linToSrgb(additive).map(v=>clampPigment(v));
 let R;
 if(mode===21){
  // Geometric reflectance / optical-density blend, not a thickness simulation.
  R=a.logR.map((v,i)=>Math.exp(lerpPigment(v,b.logR[i],t)));
 }else{
  // Infinite-layer KM approximation with optional artistic tint weighting.
  const w=clampPigment(safePigment(weight,100)/100);
  const wa=(1-t)**(1+w)*a.luminance**w,wb=t**(1+w)*b.luminance**w;
  const u=wb/(wa+wb);
  R=a.ks.map((v,i)=>reflectanceFromKS(lerpPigment(v,b.ks[i],u)));
 }
 const mixed=new Color(R).lRGB;
 const result=additive.map((v,i)=>lerpPigment(v,safePigment(mixed[i],v),strength));
 return linToSrgb(mapGamut(result)).map((v,i)=>clampPigment(safePigment(v,lerpPigment(a.rgb[i],b.rgb[i],t))));
}
