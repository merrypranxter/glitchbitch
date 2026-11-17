export const kineticGLSL = "\nuniform sampler2D letteringTex;\nuniform bool letteringAvailable;\nuniform float letteringAmount,letteringScale,letteringWarp,letteringMotion;\nuniform int letteringStyle;\nvec3 drawKineticLetters(vec3 col,vec2 uv){\n  if(!letteringAvailable||letteringAmount<.001)return col;\n  float zoom=mix(.63,.97,letteringScale);\n  vec2 q=(uv-.5)/zoom+.5;\n  float t=time*(.22+letteringMotion*.95);\n  q+=letteringMotion*.009*vec2(sin(q.y*8.+t*.61),cos(q.x*7.-t*.48));\n  q+=letteringWarp*.009*vec2(\n    sin(q.y*13.+t*.81)+.3*cos(q.x*9.-t*.27),\n    cos(q.x*11.-t*.67)+.3*sin(q.y*7.+t*.48));\n  vec2 insideRange=step(vec2(0.),q)*step(q,vec2(1.));\n  float inside=insideRange.x*insideRange.y;\n  float mask=texture2D(letteringTex,clamp(q,0.,1.)).a*inside;\n  vec2 offset=vec2(.004+.004*letteringWarp,0.);\n  float left=texture2D(letteringTex,clamp(q-offset,0.,1.)).a*inside;\n  float right=texture2D(letteringTex,clamp(q+offset,0.,1.)).a*inside;\n  float rim=clamp(max(left,right)-mask,0.,1.);\n  vec3 primary=palette(fract(q.x*.62+q.y*.28+colorTime*.021));\n  vec3 secondary=palette(fract(.44+q.y*.45-colorTime*.013));\n  if(letteringStyle==0){\n    col+=letteringAmount*(rim*.8*secondary+mask*(.35+1.13*primary));\n  }else if(letteringStyle==1){\n    vec3 rgb=vec3(left,mask,right)*vec3(1.,.8,1.);\n    col=mix(col,rgb+primary*.38,max(mask,max(left,right))*letteringAmount*.95);\n  }else if(letteringStyle==2){\n    float shine=pow(.5+.5*sin(q.y*13.-colorTime*.65),6.);\n    vec3 chrome=mix(vec3(.72,.9,1.),primary,.53)+shine*secondary*.83;\n    col=mix(col,chrome,mask*letteringAmount);\n    col+=rim*letteringAmount*secondary*.44;\n  }else{\n    col=mix(col,col*.075+secondary*.22,mask*letteringAmount);\n    col+=rim*letteringAmount*primary*.75;\n  }\n  return col;\n}";

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
export function glyphCanvas(text,aspect=1) {
  if(!Number.isFinite(aspect)||aspect<=0)throw Error("Invalid artwork aspect ratio.");
  const canvas=document.createElement("canvas");
  const ar=Math.max(.35,Math.min(2.8,aspect));
  canvas.width=ar>=1?1024:Math.round(1024*ar);
  canvas.height=ar>=1?Math.round(1024/ar):1024;
  const ctx=canvas.getContext("2d");
  if(!ctx)throw Error("Canvas text rendering is unavailable.");
  const w=canvas.width,h=canvas.height;
  const safeWidth=w*.76,safeHeight=h*.70;
  const maxFont=Math.min(165,Math.floor(w*.255),Math.floor(h*.29));
  let lines=[],size=16,lineHeight=20;
  for(let candidate=maxFont;candidate>=16;candidate-=2){
    ctx.font="900 "+candidate+"px system-ui, 'Arial Black', sans-serif";
    const attempt=wrapQuote(text,safeWidth,t=>ctx.measureText(t).width);
    if(attempt.length*candidate*1.24<=safeHeight || candidate<=16){
      lines=attempt;size=candidate;lineHeight=candidate*1.24;break;
    }
  }
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle="#ffffff";ctx.strokeStyle="#ffffff";
  ctx.textAlign="center";ctx.textBaseline="middle";
  ctx.font="900 "+size+"px system-ui, 'Arial Black', sans-serif";
  ctx.lineJoin="round";ctx.miterLimit=2;
  ctx.lineWidth=Math.max(1,size*.028);
  const top=(h-lines.length*lineHeight)/2+lineHeight/2;
  for(let i=0;i<lines.length;i++){
    const y=top+i*lineHeight;
    ctx.strokeText(lines[i],w/2,y,safeWidth);
    ctx.fillText(lines[i],w/2,y,safeWidth);
  }
  return canvas;
}
