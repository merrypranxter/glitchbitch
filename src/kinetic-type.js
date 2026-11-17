import { quoteFontCSS } from "./retro-fonts.js";
import { layoutLettering, richCanvasFont, drawLetteringDecoration } from "./lettering-layout.js";
export const kineticGLSL = "\nuniform sampler2D letteringTex;\nuniform bool letteringAvailable;\nuniform float letteringAmount,letteringScale,letteringWarp,letteringMotion;\nuniform int letteringStyle;\nuniform float letteringX,letteringY,letteringRotation,letteringStretchX,letteringStretchY,letteringCurve;\nvec3 drawKineticLetters(vec3 col,vec2 uv){\n if(!letteringAvailable||letteringAmount<.001)return col;\n float zoom=mix(.63,.97,letteringScale);\n vec2 pivot=vec2(letteringX,letteringY);\n vec2 q=uv-pivot;\n float angle=-letteringRotation*3.14159265/180.;\n q=mat2(cos(angle),-sin(angle),sin(angle),cos(angle))*q;\n q/=vec2(max(.25,letteringStretchX),max(.25,letteringStretchY));\n q/=zoom;\n q.x-=letteringCurve*.18*(q.y*q.y-.065);\n q+=.5;\n float t=time*(.22+letteringMotion*.95);\n q+=letteringMotion*.009*vec2(sin(q.y*8.+t*.61),cos(q.x*7.-t*.48));\n q+=letteringWarp*.009*vec2(sin(q.y*13.+t*.81)+.3*cos(q.x*9.-t*.27),\n cos(q.x*11.-t*.67)+.3*sin(q.y*7.+t*.48));\n vec2 insideRange=step(vec2(0.),q)*step(q,vec2(1.));\n float inside=insideRange.x*insideRange.y;\n vec4 sampleInk=texture2D(letteringTex,clamp(q,0.,1.));\n float mask=sampleInk.a*inside;\n vec3 ink=sampleInk.rgb;\n vec2 offset=vec2(.004+.004*letteringWarp,0.);\n float left=texture2D(letteringTex,clamp(q-offset,0.,1.)).a*inside;\n float right=texture2D(letteringTex,clamp(q+offset,0.,1.)).a*inside;\n float rim=clamp(max(left,right)-mask,0.,1.);\n vec3 primary=palette(fract(q.x*.62+q.y*.28+colorTime*.021));\n vec3 secondary=palette(fract(.44+q.y*.45-colorTime*.013));\n float wave=.5+.5*sin(q.x*18.+q.y*9.+colorTime*1.5);\n vec3 themed=ink;\n if(letteringStyle==0)themed=ink+primary*.38+secondary*rim*.35;\n else if(letteringStyle==1)themed=ink+vec3(left-mask,0.,right-mask)*.4;\n else if(letteringStyle==2)themed=mix(ink,vec3(.72,.9,1.),.25)+pow(wave,6.)*secondary*.65;\n else if(letteringStyle==3)themed=ink*.35+secondary*.2;\n else if(letteringStyle==5)themed=mix(ink,primary,.45*wave);\n else if(letteringStyle==6)themed=ink+primary*wave*.65;\n else if(letteringStyle==7)themed=mix(ink,secondary,.35*wave);\n else if(letteringStyle==8)themed=mix(ink,vec3(.75,.85,1.),.45);\n else if(letteringStyle==9)themed=mix(ink,primary,.48*wave);\n else if(letteringStyle==10)themed=mix(ink,secondary,.28*wave);\n else if(letteringStyle==11)themed=ink+vec3(wave*.32);\n else if(letteringStyle==12)themed=mix(ink,primary,.6*wave);\n else if(letteringStyle==13)themed=ink*.72;\n return mix(col,themed,clamp(mask*letteringAmount,0.,1.));\n}\n";

// Author-owned type only: auto Surprise Me never generates words.
export function wrapQuote(text,maxWidth,measure) {
  const result=[];
  for(const paragraph of text.replace(/\r\n?/g,"\n").split("\n")){
    if(!paragraph.trim()){result.push("");continue;}
    let line="";
    for(const word of paragraph.trim().split(/\s+/)){
      const candidate=line?line+" "+word:word;
      if(measure(candidate)<=maxWidth){line=candidate;continue;}
      if(line){result.push(line);line="";}
      if(measure(word)<=maxWidth){line=word;continue;}
      let piece="";
      for(const char of word){
        if(piece && measure(piece+char)>maxWidth){result.push(piece);piece="";}
        piece+=char;
      }
      line=piece;
    }
    result.push(line);
  }
  return result;
}
export function glyphCanvas(text,aspect=1,fontId="original",style={}) {
 if(!Number.isFinite(aspect)||aspect<=0)throw Error("Invalid artwork aspect ratio.");
 const canvas=document.createElement("canvas");
 const ar=Math.max(.35,Math.min(2.8,aspect));
 canvas.width=ar>=1?1024:Math.round(1024*ar);
 canvas.height=ar>=1?Math.round(1024/ar):1024;
 const ctx=canvas.getContext("2d");
 if(!ctx)throw Error("Canvas text rendering is unavailable.");
 const layout=layoutLettering(ctx,text,aspect,fontId,style);
 const {w,h,glyphs,size}=layout;
 ctx.clearRect(0,0,w,h);
 const hex=/^#[0-9a-f]{6}$/i;
 const fill=hex.test(style.letteringFill||"")?style.letteringFill:"#ffffff";
 const stops=Array.isArray(style.letteringGradient)?style.letteringGradient.filter(c=>hex.test(c)).slice(0,8):[];
 let ink=fill;
 if(style.letteringFillMode!=="Solid"&&stops.length>=2){
   const angle=(style.letteringGradientAngle||0)*Math.PI/180;
   let gradient;
   if(style.letteringFillMode==="Radial gradient")
     gradient=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,Math.max(w,h)*.65);
   else{
     const dx=Math.cos(angle)*w*.5,dy=Math.sin(angle)*h*.5;
     gradient=ctx.createLinearGradient(w/2-dx,h/2-dy,w/2+dx,h/2+dy);
   }
   stops.forEach((color,i)=>gradient.addColorStop(i/(stops.length-1),color));
   ink=gradient;
 }
 ctx.textAlign="center";ctx.textBaseline="middle";
 ctx.lineJoin="round";ctx.miterLimit=2;
 const outlines=Array.isArray(style.letteringStrokes)
   ?style.letteringStrokes.filter(x=>x.enabled&&x.width>0).slice(0,5):[];
 const totals=[];let sum=0;
 for(const x of outlines){sum+=Number(x.width);totals.push(sum);}
 for(const glyph of glyphs){
   ctx.font=richCanvasFont(fontId,size,glyph.format);
   for(let i=outlines.length-1;i>=0;i--){
     ctx.strokeStyle=outlines[i].color;
     ctx.lineWidth=2*totals[i];
     ctx.strokeText(glyph.display,glyph.x,glyph.y,w*.70);
   }
   ctx.fillStyle=ink;
   ctx.fillText(glyph.display,glyph.x,glyph.y,w*.70);
   drawLetteringDecoration(ctx,glyph,size,glyph.x,glyph.y);
 }
 return canvas;
}
