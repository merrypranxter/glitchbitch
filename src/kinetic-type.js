// Typed Canvas2D glyph masks feed the existing single-pass WebGL compositing stack.
// Source mechanism: myspace_glitch/01-myspace-geocities-webcore/urcute_texture.js.
export const kineticGLSL = "\nuniform sampler2D letteringTex;\nuniform bool letteringAvailable;\nuniform float letteringAmount,letteringScale,letteringWarp,letteringMotion;\nuniform int letteringStyle;\nvec3 drawKineticLetters(vec3 col,vec2 uv){\n  if(!letteringAvailable||letteringAmount<.001)return col;\n  vec2 q=uv-.5;\n  float ar=res.x/res.y;\n  q.x*=ar;\n  float zoom=mix(1.85,.68,letteringScale);\n  q/=zoom;\n  q.x/=2.1;\n  q.y/=1.14;\n  float t=time*(.31+letteringMotion*1.15);\n  q.y+=letteringMotion*.043*sin(q.x*9.+t*.82);\n  q.x+=letteringMotion*.035*cos(q.y*8.-t*.57);\n  q+=letteringWarp*.045*vec2(\n    sin(q.y*19.+t*1.4)+.34*cos(q.x*23.-t*.63),\n    cos(q.x*14.-t*.92)+.3*sin(q.y*17.+t*.52));\n  q+=.5;\n  vec2 outside=step(vec2(0.),q)*step(q,vec2(1.));\n  float inside=outside.x*outside.y;\n  float mask=texture2D(letteringTex,clamp(q,0.,1.)).a*inside;\n  vec2 offset=vec2(.006+.009*letteringWarp,0.);\n  float left=texture2D(letteringTex,clamp(q-offset,0.,1.)).a*inside;\n  float right=texture2D(letteringTex,clamp(q+offset,0.,1.)).a*inside;\n  float rim=clamp(max(left,right)-mask,0.,1.);\n  vec3 primary=palette(fract(q.x*.62+q.y*.28+colorTime*.021));\n  vec3 secondary=palette(fract(.44+q.y*.45-colorTime*.013));\n  if(letteringStyle==0){ // Blingee pink / cyan neon\n    col+=letteringAmount*(rim*.8*secondary+mask*(.35+1.13*primary));\n  } else if(letteringStyle==1){ // Split-channel cyber text\n    vec3 rgb=vec3(left,mask,right)*vec3(1.,.8,1.);\n    col=mix(col,rgb+primary*.38,max(mask,max(left,right))*letteringAmount*.95);\n  } else if(letteringStyle==2){ // Chrome / holographic foil\n    float shine=pow(.5+.5*sin(q.y*13.-colorTime*.65),6.);\n    vec3 chrome=mix(vec3(.72,.9,1.),primary,.53)+shine*secondary*.83;\n    col=mix(col,chrome,mask*letteringAmount);\n    col+=rim*letteringAmount*secondary*.44;\n  } else { // Void cutout / shadow stencil\n    col=mix(col,col*.075+secondary*.22,mask*letteringAmount);\n    col+=rim*letteringAmount*primary*.75;\n  }\n  return col;\n}";
export function glyphCanvas(text) {
  const canvas=document.createElement("canvas");
  canvas.width=1024;canvas.height=512;
  const ctx=canvas.getContext("2d");
  if(!ctx)throw Error("This browser cannot draw lettering textures.");
  const words=text.trim().split(/\s+/).filter(Boolean);
  const lines=[""];
  // Word-wrapping keeps the rendered letters live, crisp and fully editable.
  for(const word of words){
    const current=lines[lines.length-1];
    if(current && current.length+word.length>15 && lines.length<3)
      lines.push(word);
    else lines[lines.length-1]=current?current+" "+word:word;
  }
  ctx.clearRect(0,0,1024,512);
  ctx.fillStyle="#ffffff";ctx.textAlign="center";ctx.textBaseline="middle";
  const max=lines.length===1?175:lines.length===2?138:110;
  ctx.font="900 "+max+"px system-ui, 'Arial Black', sans-serif";
  const lineHeight=lines.length===3?125:lines.length===2?170:195;
  const top=256-(lines.length-1)*lineHeight*.5;
  ctx.lineJoin="round";ctx.miterLimit=2;
  for(let i=0;i<lines.length;i++){
    const y=top+i*lineHeight;
    ctx.lineWidth=max*.046;ctx.strokeStyle="#ffffff";
    ctx.strokeText(lines[i],512,y,938);
    ctx.fillText(lines[i],512,y,938);
  }
  return canvas;
}
