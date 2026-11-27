import {Okhsl,Okhsv,HSLuv,HPLuv,srgbToLin,linToSrgb,gamutMap} from "./colorspaces.js";
export const LUT_WIDTH=2048;
export function mapChromaticGamut(rgb,mode=0){
 if(mode===1)return rgb.map(x=>Math.max(0,Math.min(1,x)));
 if(mode===2){const lo=Math.min(0,...rgb),hi=Math.max(1,Math.max(...rgb)-lo);return rgb.map(x=>(x-lo)/hi);}
 if(mode===3)return rgb.map(x=>1-Math.abs(((x%2)+2)%2-1));
 return gamutMap(rgb);
}
export function bakeChromaticPalette(s){
 const space=[Okhsl,Okhsv,HSLuv,HPLuv][Math.round(s.chromaticSpace)-8];
 const colors=s.colors.map(h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255));
 const coords=colors.map(c=>space.fromLin(srgbToLin(c)));
 const out=new Uint8Array(LUT_WIDTH*4);
 const cap=(s.chromaticSatCap??100)/100*(s.chromaticSpace>=10?100:1);
 for(let i=0;i<LUT_WIDTH;i++){
  const q=i/LUT_WIDTH*colors.length,j=Math.floor(q),k=(j+1)%colors.length,f=q-j,t=f*f*(3-2*f);
  let [ha,sa,la]=coords[j],[hb,sb,lb]=coords[k];
  if(!Number.isFinite(ha)||sa<1e-5)ha=hb;
  if(!Number.isFinite(hb)||sb<1e-5)hb=ha;
  if(!Number.isFinite(ha))ha=hb=0;
  let delta=((hb-ha+540)%360)-180;
  if(s.chromaticHuePath===1)delta+=delta>=0?-360:360;
  if(s.chromaticHuePath===2)delta=((hb-ha)%360+360)%360;
  if(s.chromaticHuePath===3)delta=-(((ha-hb)%360+360)%360);
  if(sa<1e-5&&sb<1e-5)delta=0;else delta+=(delta<0?-1:1)*360*(s.chromaticTurns??0);
  const h=((ha+t*delta)%360+360)%360;
  const rgb=linToSrgb(mapChromaticGamut(space.toLin([h,Math.min(cap,sa+(sb-sa)*t),la+(lb-la)*t]),s.chromaticGamut));
  for(let c=0;c<3;c++)out[i*4+c]=Math.round(255*Math.max(0,Math.min(1,Number.isFinite(rgb[c])?rgb[c]:0)));
  out[i*4+3]=255;
 }
 return out;
}
