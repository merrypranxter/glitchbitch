/**
 * Glyph sprites for deterministic per-letter export choreography.
 * Uses the same line-fitting rules, fonts, fill gradients, and outside strokes
 * as glyphCanvas, but renders each glyph intact—never slices it into rows.
 */
import { quoteFontCSS } from "./retro-fonts.js";
import { wrapQuote } from "./kinetic-type.js";

const colorRE=/^#[0-9a-f]{6}$/i;
export function createLetteringSprites(text,aspect=1,fontId="original",style={},limit=180){
 if(typeof document==="undefined")return null;
 const ar=Math.max(.35,Math.min(2.8,aspect||1));
 const width=ar>=1?1024:Math.round(1024*ar);
 const height=ar>=1?Math.round(1024/ar):1024;
 const measure=document.createElement("canvas").getContext("2d");
 if(!measure)return null;
 const safeWidth=width*.70,safeHeight=height*.64;
 const maxFont=Math.min(165,Math.floor(width*.255),Math.floor(height*.29));
 let lines=[],fontSize=16,lineHeight=20;
 for(let size=maxFont;size>=16;size-=2){
   measure.font=quoteFontCSS(fontId,size);
   const attempt=wrapQuote(text,safeWidth,t=>measure.measureText(t).width);
   if(attempt.length*size*1.24<=safeHeight||size<=16){
     lines=attempt;fontSize=size;lineHeight=size*1.24;break;
   }
 }
 const total=lines.reduce((n,line)=>n+Array.from(line).filter(c=>!(/\s/u.test(c))).length,0);
 if(total>limit)return null; // iPhone memory safety for essay-length quotes
 measure.font=quoteFontCSS(fontId,fontSize);
 const maxStroke=Math.min(80,(style.letteringStrokes||[]).reduce((n,s)=>n+(s?.enabled?Number(s.width)||0:0),0));
 const padding=Math.ceil(maxStroke+fontSize*.13+5);
 const fill=colorRE.test(style.letteringFill||"")?style.letteringFill:"#ffffff";
 const stops=Array.isArray(style.letteringGradient)?style.letteringGradient.filter(c=>colorRE.test(c)).slice(0,8):[];
 const useGradient=style.letteringFillMode!=="Solid"&&stops.length>=2;
 const baseTop=(height-lines.length*lineHeight)/2+lineHeight/2;
 const sprites=[];let index=0;
 for(let lineIndex=0;lineIndex<lines.length;lineIndex++){
   const line=lines[lineIndex],chars=Array.from(line);
   const fullWidth=measure.measureText(line).width;
   const fit=Math.min(1,safeWidth/Math.max(1,fullWidth));
   let advance=0;
   for(const char of chars){
     const cw=Math.max(0,measure.measureText(char).width);
     const x=width/2+(advance+cw/2-fullWidth/2)*fit;
     const y=baseTop+lineIndex*lineHeight;
     advance+=cw;
     if(/\s/u.test(char))continue;
     const image=document.createElement("canvas");
     image.width=Math.max(2,Math.ceil(cw+padding*2));
     image.height=Math.max(2,Math.ceil(fontSize*1.85+padding*2));
     const c=image.getContext("2d");
     if(!c)continue;
     const localX=image.width/2,localY=image.height/2;
     c.font=quoteFontCSS(fontId,fontSize);
     c.textAlign="center";c.textBaseline="middle";
     c.lineJoin="round";c.miterLimit=2;
     let ink=fill;
     if(useGradient){
       if(style.letteringFillMode==="Radial gradient"){
         ink=c.createRadialGradient(width/2-x+localX,height/2-y+localY,0,
           width/2-x+localX,height/2-y+localY,Math.max(width,height)*.65);
       }else{
         const angle=(Number(style.letteringGradientAngle)||0)*Math.PI/180;
         const dx=Math.cos(angle)*width*.5,dy=Math.sin(angle)*height*.5;
         ink=c.createLinearGradient(width/2-dx-x+localX,height/2-dy-y+localY,
           width/2+dx-x+localX,height/2+dy-y+localY);
       }
       stops.forEach((color,i)=>ink.addColorStop(i/(stops.length-1),color));
     }
     const outlines=(style.letteringStrokes||[]).filter(s=>s?.enabled && Number(s.width)>0).slice(0,5);
     const cumulative=[];let span=0;
     for(const s of outlines){span+=Number(s.width);cumulative.push(span)}
     for(let j=outlines.length-1;j>=0;j--){
       c.strokeStyle=outlines[j].color||"#000";
       c.lineWidth=2*cumulative[j];
       c.strokeText(char,localX,localY);
     }
     c.fillStyle=ink;
     c.fillText(char,localX,localY);
     sprites.push({char,index:index++,total,x,y,image,width:width,height:height,
       widthScale:fit,fontSize});
   }
 }
 return {width,height,fontSize,sprites};
}
