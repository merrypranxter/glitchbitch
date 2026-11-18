/**
 * Safari/iPhone Canvas2D text-filter fallback.
 *
 * The DOM preview has CSS brightness/saturate/contrast; as of iOS Safari 27.2
 * CanvasRenderingContext2D.filter is STILL disabled by default. A property
 * presence check cannot establish support. Probe an actual drawn pixel.
 *
 * On unsupported browsers, bake a bounded, static approximation into cached
 * colored glyph atlases ONCE (not every GIF/MP4 frame). Preserve ink gradients,
 * per-word colors, stroke geometry and alpha. No full-size video framebuffer,
 * DOM screenshot, WebGL shader or external dependency.
 */
let filterWorks;
export function canvasImageFiltersWork(){
 if(filterWorks!==undefined)return filterWorks;
 if(typeof document==="undefined")return true; // Node-only test helpers.
 try{
   const source=document.createElement("canvas");
   source.width=source.height=1;
   const s=source.getContext("2d");
   const target=document.createElement("canvas");
   target.width=target.height=1;
   const c=target.getContext("2d",{willReadFrequently:true});
   if(!s||!c||typeof c.getImageData!=="function")return true;
   s.fillStyle="#ffffff";s.fillRect(0,0,1,1);
   c.filter="brightness(0)";
   c.drawImage(source,0,0);
   const rgb=c.getImageData(0,0,1,1).data;
   // Valid black is a genuine filter result. White means Safari ignored it.
   filterWorks=rgb[0]<24&&rgb[1]<24&&rgb[2]<24;
   source.width=target.width=source.height=target.height=1;
   return filterWorks;
 }catch{
   // If pixel probes fail, apply the compatible CPU route rather than
   // silently dropping all material energy on an iPhone.
   filterWorks=false;
   return false;
 }
}

export function fallbackMaterialFilter(material) {
 if(!material?.pulseAnimation && !material?.hueAnimation)return "";
 // A stable intermediate frame is safer than choppy per-frame whole-atlas
 // pixel manipulation during a 30fps iPhone export. Moving thread/text
 // choreography continues through the normal deterministic timeline.
 return material.hueAnimation
   ?"brightness(1.25) saturate(1.48)"
   :"brightness(1.40) saturate(1.48)";
}

const number=(s,fallback=1)=>{
 const n=parseFloat(s);
 return Number.isFinite(n)?n:fallback;
};
const clamp=x=>Math.max(0,Math.min(255,Math.round(x)));
function filteredRGB(r,g,b,filters){
 let R=r,G=g,B=b;
 for(const [name,value] of filters){
   if(name==="brightness"){
     const k=number(value);
     // Smooth shoulder prevents bright neon highlights from clipping
     // into chalky white while bringing out the midtones.
     const tone=x=>k<=1?x*k:255*(1-Math.pow(1-x/255,k));
     R=tone(R);G=tone(G);B=tone(B);
   }else if(name==="saturate"){
     const sat=number(value);
     const y=R*.2126+G*.7152+B*.0722;
     R=y+(R-y)*sat;G=y+(G-y)*sat;B=y+(B-y)*sat;
   }else if(name==="contrast"){
     const k=number(value);
     R=(R-127.5)*k+127.5;G=(G-127.5)*k+127.5;B=(B-127.5)*k+127.5;
   }else if(name==="invert"){
     const k=number(value,0);
     R=R*(1-k)+(255-R)*k;
     G=G*(1-k)+(255-G)*k;
     B=B*(1-k)+(255-B)*k;
   }else if(name==="hue-rotate"){
     const rad=number(value,0)*Math.PI/180;
     const c=Math.cos(rad),s=Math.sin(rad);
     const rr=R*(.213+.787*c-.213*s)+G*(.715-.715*c-.715*s)+B*(.072-.072*c+.928*s);
     const gg=R*(.213-.213*c+.143*s)+G*(.715+.285*c+.140*s)+B*(.072-.072*c-.283*s);
     const bb=R*(.213-.213*c-.787*s)+G*(.715-.715*c+.715*s)+B*(.072+.928*c+.072*s);
     R=rr;G=gg;B=bb;
   }
   R=clamp(R);G=clamp(G);B=clamp(B);
 }
 return [clamp(R),clamp(G),clamp(B)];
}
export function bakeTextCanvasFilter(source,filter=""){
 if(!source||!source.width||!source.height)return source;
 const functions=[...String(filter).matchAll(/(brightness|saturate|contrast|invert|hue-rotate)\(([^)]+)\)/gi)]
   .map(([,fn,value])=>[fn.toLowerCase(),value]);
 if(!functions.length)return source;
 try{
   const output=document.createElement("canvas");
   output.width=source.width;output.height=source.height;
   const c=output.getContext("2d",{willReadFrequently:true});
   if(!c||typeof c.getImageData!=="function"||typeof c.putImageData!=="function")
     return source;
   c.drawImage(source,0,0);
   const frame=c.getImageData(0,0,output.width,output.height),bytes=frame.data;
   for(let i=0;i<bytes.length;i+=4){
     if(bytes[i+3]===0)continue;
     const [r,g,b]=filteredRGB(bytes[i],bytes[i+1],bytes[i+2],functions);
     bytes[i]=r;bytes[i+1]=g;bytes[i+2]=b;
   }
   c.putImageData(frame,0,0);
   return output;
 }catch{
   return source;
 }
}
