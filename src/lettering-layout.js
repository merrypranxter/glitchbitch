/**
 * Deterministic text layout shared by export glyph atlas and intact-glyph
 * animation sprites. Supports negative/positive tracking, adjustable leading,
 * and mixed font weights/slants without turning formatting into literal text.
 */
import { getRetroFont } from "./retro-fonts.js";
import { textStyleAt } from "./text-formatting.js";

const clamp=(n,a,b)=>Math.min(b,Math.max(a,Number.isFinite(+n)?+n:a));
export function textTrackingFraction(style) {return clamp(style?.letteringTracking??0,-20,100)/100;}
export function textLeadingRatio(style) {return clamp(style?.letteringLineSpacing??118,60,300)/100;}
export function richCanvasFont(id,size,format={}){
 const font=getRetroFont(id);
 const weight=format.bold?900:font.weight;
 return `${format.italic?"italic ":""}${weight} ${Math.max(8,Math.round(size))}px ${font.family}`;
}
export function layoutLettering(ctx,text,aspect=1,fontId="original",style={}){
 const value=String(text||"");
 const ar=clamp(aspect,.35,2.8);
 const w=ar>=1?1024:Math.round(1024*ar);
 const h=ar>=1?Math.round(1024/ar):1024;
 const safeWidth=w*.70,safeHeight=h*.64;
 const maxFont=Math.min(165,Math.floor(w*.255),Math.floor(h*.29));
 const leading=textLeadingRatio(style);
 const tracking=textTrackingFraction(style);
 const formats=style.letteringFormats||[];

 const tokens=[];
 const rx=/\n|[^\S\n]+|[^\s\n]+/gu;
 for(const match of value.matchAll(rx)){
   let index=match.index;
   const chars=[];
   for(const char of match[0]){
     const format=textStyleAt(formats,index);
     chars.push({char,index,format,display:format.caps?char.toUpperCase():char});
     index+=char.length;
   }
   tokens.push({lineBreak:match[0]==="\n",whitespace:!match[0].includes("\n")&&/^\s+$/u.test(match[0]),chars});
 }
 function atSize(size){
   const track=size*tracking,lines=[];
   let current=[],length=0;
   const flush=()=>{lines.push({chars:current,width:Math.max(0,length)});current=[];length=0;};
   function sized(char){
     ctx.font=richCanvasFont(fontId,size,char.format);
     const raw=Math.max(0,ctx.measureText(char.display).width);
     return {...char,raw,advance:Math.max(raw*.2,raw+track)};
   }
   for(const token of tokens){
     if(token.lineBreak){flush();continue;}
     const group=token.chars.map(sized);
     const tokenWidth=group.reduce((n,c)=>n+c.advance,0);
     if(token.whitespace){
       if(!current.length)continue;
       if(length+tokenWidth>safeWidth){flush();continue;}
       current.push(...group);length+=tokenWidth;
       continue;
     }
     if(current.length && length+tokenWidth>safeWidth)flush();
     if(tokenWidth<=safeWidth){
       current.push(...group);length+=tokenWidth;
     }else for(const c of group){
       if(current.length && length+c.advance>safeWidth)flush();
       current.push(c);length+=c.advance;
     }
   }
   flush();
   const lineHeight=size*leading;
   return {size,lineHeight,lines,w,h};
 }
 let layout;
 for(let size=maxFont;size>=16;size-=2){
   layout=atSize(size);
   if(layout.lines.length*layout.lineHeight<=safeHeight||size<=16)break;
 }
 const top=(h-layout.lines.length*layout.lineHeight)/2+layout.lineHeight/2;
 const glyphs=[];
 for(let k=0;k<layout.lines.length;k++){
   const line=layout.lines[k];
   let x=(w-line.width)/2;
   for(const c of line.chars){
     if(!/\s/u.test(c.char))glyphs.push({...c,
       x:x+c.raw/2,y:top+k*layout.lineHeight,line:k});
     x+=c.advance;
   }
 }
 return {...layout,glyphs,tracking,leading};
}
export function drawLetteringDecoration(ctx,glyph,size,x,y,stroke=0){
 if(!glyph.format.underline && !glyph.format.strike)return;
 // Decorations have their own narrow ribbons and must not alter text strokes.
 const h=Math.max(1,size*.055),w=Math.max(1,glyph.raw);
 if(glyph.format.underline)ctx.fillRect?.(x-w/2,y+size*.45,w,h);
 if(glyph.format.strike)ctx.fillRect?.(x-w/2,y-size*.015,w,h);
}
