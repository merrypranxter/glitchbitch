import {Okhsl,Okhsv,HSLuv,HPLuv,IPT,DIN99,Jzazbz,JzCzhz,ICtCp,CAM16,CAM16UCS,viewingConditions,srgbToLin,linToSrgb,gamutMap} from "./colorspaces.js";
export const LUT_WIDTH=2048;
export function mapChromaticGamut(rgb,mode=0){
 if(mode===1)return rgb.map(x=>Math.max(0,Math.min(1,x)));
 if(mode===2){const lo=Math.min(0,...rgb),hi=Math.max(1,Math.max(...rgb)-lo);return rgb.map(x=>(x-lo)/hi);}
 if(mode===3)return rgb.map(x=>1-Math.abs(((x%2)+2)%2-1));
 return gamutMap(rgb);
}
export function bakeChromaticPalette(s){
 const space=[Okhsl,Okhsv,HSLuv,HPLuv,IPT,DIN99,Jzazbz,JzCzhz,ICtCp,CAM16,CAM16UCS][Math.round(s.chromaticSpace)-8];
 const colors=s.colors.map(h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255));
 const surround=[{F:1,c:.69,Nc:1},{F:.9,c:.59,Nc:.9},{F:.8,c:.525,Nc:.8}][Math.round(s.chromaticSurround??0)]||{F:1,c:.69,Nc:1};
 const vc=s.chromaticSpace>=17?viewingConditions({LA:Math.pow(10,-1+3*(s.chromaticAmbient??59.5)/100),Yb:1+99*(s.chromaticBackground??17.6)/100,...surround,discount:!!s.chromaticAdapt}):undefined;
 const coords=colors.map(c=>space.fromLin(srgbToLin(c),vc));
 const out=new Uint8Array(LUT_WIDTH*4);
 const cap=(s.chromaticSatCap??100)/100*(s.chromaticSpace>=10?100:1);
 for(let i=0;i<LUT_WIDTH;i++){
  const q=i/LUT_WIDTH*colors.length,j=Math.floor(q),k=(j+1)%colors.length,f=q-j,t=f*f*(3-2*f);
  if(s.chromaticSpace>=12&&s.chromaticSpace!==15&&s.chromaticSpace!==17){
   const c=coords[j].map((v,n)=>v+(coords[k][n]-v)*t);
   const rgb=linToSrgb(mapChromaticGamut(space.toLin(c,vc),s.chromaticGamut));
   for(let n=0;n<3;n++)out[i*4+n]=Math.round(255*Math.max(0,Math.min(1,Number.isFinite(rgb[n])?rgb[n]:0)));
   out[i*4+3]=255;continue;
  }
  const polar=s.chromaticSpace===15||s.chromaticSpace===17;
  let [ha,sa,la]=polar?[coords[j][2],coords[j][1],coords[j][0]]:coords[j], [hb,sb,lb]=polar?[coords[k][2],coords[k][1],coords[k][0]]:coords[k];
  if(s.chromaticSpace===15){if(Math.max(...colors[j])-Math.min(...colors[j])<1e-6)ha=NaN;if(Math.max(...colors[k])-Math.min(...colors[k])<1e-6)hb=NaN;}
  if(!Number.isFinite(ha)||sa<1e-5)ha=hb;
  if(!Number.isFinite(hb)||sb<1e-5)hb=ha;
  if(!Number.isFinite(ha))ha=hb=0;
  let delta=((hb-ha+540)%360)-180;
  if(s.chromaticHuePath===1)delta+=delta>=0?-360:360;
  if(s.chromaticHuePath===2)delta=((hb-ha)%360+360)%360;
  if(s.chromaticHuePath===3)delta=-(((ha-hb)%360+360)%360);
  if(sa<1e-5&&sb<1e-5)delta=0;else delta+=(delta<0?-1:1)*360*(s.chromaticTurns??0);
  const h=((ha+t*delta)%360+360)%360;
  const rgb=linToSrgb(mapChromaticGamut(space.toLin(polar?[la+(lb-la)*t,sa+(sb-sa)*t,h]:[h,Math.min(cap,sa+(sb-sa)*t),la+(lb-la)*t],vc),s.chromaticGamut));
  for(let c=0;c<3;c++)out[i*4+c]=Math.round(255*Math.max(0,Math.min(1,Number.isFinite(rgb[c])?rgb[c]:0)));
  out[i*4+3]=255;
 }
 return out;
}
