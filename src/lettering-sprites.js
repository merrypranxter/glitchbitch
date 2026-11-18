/**
 * Export-time individual glyph atlas with mixed typography.
 * Shares exact tracking, line breaks and rich-text spans with the static
 * Canvas lettering compositor. Never slices glyphs into horizontal strips.
 */
import { layoutLettering, richCanvasFont, drawLetteringDecoration } from "./lettering-layout.js";
import { formattedGlyphInk } from "./text-formatting.js";

const colorRE=/^#[0-9a-f]{6}$/i;
export function createLetteringSprites(text,aspect=1,fontId="original",style={},limit=180){
 if(typeof document==="undefined")return null;
 const measuring=document.createElement("canvas").getContext("2d");
 if(!measuring)return null;
 const layout=layoutLettering(measuring,text,aspect,fontId,style);
 const {w:width,h:height,size:fontSize,glyphs}=layout;
 if(glyphs.length>limit)return null; // never allocate huge sprite atlas on iPhone
 const outlines=(style.letteringStrokes||[]).filter(x=>x?.enabled&&Number(x.width)>0).slice(0,5);
 const totals=[];let sum=0;
 for(const ring of outlines){sum+=Number(ring.width);totals.push(sum);}
 const padding=Math.ceil(Math.min(80,sum)+fontSize*.2+6);
 const fill=colorRE.test(style.letteringFill||"")?style.letteringFill:"#ffffff";
 const stops=Array.isArray(style.letteringGradient)
   ?style.letteringGradient.filter(x=>colorRE.test(x)).slice(0,8):[];
 const gradient=style.letteringFillMode!=="Solid"&&stops.length>=2;
 const sprites=[];
 for(let i=0;i<glyphs.length;i++){
   const glyph=glyphs[i];
   const image=document.createElement("canvas");
   image.width=Math.max(2,Math.ceil(glyph.raw+padding*2));
   image.height=Math.max(2,Math.ceil(fontSize*1.85+padding*2));
   const ctx=image.getContext("2d");
   if(!ctx)continue;
   const localX=image.width/2,localY=image.height/2;
   ctx.font=richCanvasFont(fontId,fontSize,glyph.format);
   ctx.textAlign="center";ctx.textBaseline="middle";
   ctx.lineJoin="round";ctx.miterLimit=2;
   let ink=fill;
   if(gradient){
     if(style.letteringFillMode==="Radial gradient"){
       ink=ctx.createRadialGradient(width/2-glyph.x+localX,height/2-glyph.y+localY,0,
         width/2-glyph.x+localX,height/2-glyph.y+localY,Math.max(width,height)*.65);
     }else{
       const angle=(Number(style.letteringGradientAngle)||0)*Math.PI/180;
       const dx=Math.cos(angle)*width*.5,dy=Math.sin(angle)*height*.5;
       ink=ctx.createLinearGradient(width/2-dx-glyph.x+localX,height/2-dy-glyph.y+localY,
         width/2+dx-glyph.x+localX,height/2+dy-glyph.y+localY);
     }
     stops.forEach((color,n)=>ink.addColorStop(n/(stops.length-1),color));
   }
   for(let j=outlines.length-1;j>=0;j--){
     ctx.strokeStyle=outlines[j].color;
     ctx.lineWidth=2*totals[j];
     ctx.strokeText(glyph.display,localX,localY);
   }
   ctx.fillStyle=formattedGlyphInk(glyph.format,glyph.index,ink);
   ctx.fillText(glyph.display,localX,localY);
   drawLetteringDecoration(ctx,glyph,fontSize,localX,localY);
   sprites.push({char:glyph.char,index:i,total:glyphs.length,
     x:glyph.x,y:glyph.y,image,width,height,widthScale:1,fontSize});
 }
 return {width,height,fontSize,sprites};
}
