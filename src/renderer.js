import { appearanceGLSL } from "./appearance.js";
import { geometryGLSL } from "./geometry.js";
import { motionGLSL } from "./motion.js";
import { feedbackVertex, feedbackFragment } from "./feedback.js";
import { createBiology, BIO_SIZE } from "./biology.js";
import { bioGLSL } from "./bio-shader.js";
import { stereoGLSL } from "./stereo.js";
import { wiggleGLSL } from "./wiggle.js";
import { materialGLSL } from "./materials.js";
import { kineticGLSL, glyphCanvas } from "./kinetic-type.js";
import { ensureRetroFontLoaded, retroFontReady, retroFontRevision } from "./retro-fonts.js";
import { compositionGLSL } from "./composition.js";
import { backdropGLSL } from "./backdrops.js";
import { microGLSL } from "./microstructure.js";
import { substanceGLSL } from "./substance.js";
import { photonGLSL, photonSpecies } from "./photon-zoo.js";
import { filamentGLSL, filamentSpecies, filamentMaterials, filamentStitchModes, filamentSculptModes } from "./filament-forge.js";
import { underlayGLSL, underlayModes } from "./living-underlay.js";
import { tunnelGLSL } from "./tunnels.js";
import { strangeFieldsGLSL } from "./strange-fields.js";
import { atmosphereGLSL, atmosphereModes, specializeAtmosphereVariant } from "./mutant-atmospheres.js";
import { colonyLifeModes } from "./colony-lifecycle.js";
import { atmosphereHabitats, atmosphereSecondHabitats, atmosphereBlendModes,
  habitatGLSL, atmosphereHybridGLSL } from "./atmosphere-habitats.js";

const vertex = `attribute vec2 position;void main(){gl_Position=vec4(position,0.,1.);}`;
const fragment = `precision highp float;
#define PI 3.14159265359
#define TAU 6.28318530718
uniform vec2 res;
uniform float time,colorTime,seed,seedHigh,complexity,scale,warp,split,scan,grain,glitch,rotation,symmetry,blend,block,pixel,vignette;
uniform float saturation,contrast,brightness,colorOffset,colorRepeat,colorAmount;
uniform int engine,secondaryEngine,blendMode,count,colorCount,colorMode;
uniform bool bloom,posterize,mirror,invert;
uniform vec3 colors[12];uniform vec4 marks[32];uniform vec2 markShape[32];
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7))+seed+seedHigh*7.83)*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=mat2(.8,-.6,.6,.8)*p*2.03+3.4;a*=.5;}return v;}
mat2 rotate(float a){return mat2(cos(a),-sin(a),sin(a),cos(a));}
vec3 palette(float t){float q=fract(t)*float(colorCount);int a=int(floor(q));vec3 c=colors[0],d=colors[0];for(int i=0;i<12;i++){if(i==a)c=colors[i];if(i==a+1)d=colors[i];}if(a==colorCount-1)d=colors[0];return mix(c,d,smoothstep(0.,1.,fract(q)));}
${geometryGLSL}
${motionGLSL}
${bioGLSL}
/* WIGGLE_MODULE */
/* STEREO_MODULE */
/* TUNNEL_MODULE */
/* STRANGE_FIELDS_MODULE */
float field(vec2 p,int kind){float t=time*.3,f=0.;
if(kind==0){for(int i=0;i<5;i++){float n=float(i)+1.;p+=warp*.32*vec2(sin(p.y*n+t/n),cos(p.x*n-t/n));f+=sin(p.x*n+cos(p.y*n+t))/n;}f=f*.25+length(p)*.12;}
else if(kind==1){f=sin(length(p-vec2(sin(t),cos(t)))*12.)*sin(length(p+vec2(cos(t*.7),sin(t*.8)))*13.);f=f*.4+length(p)*.15;}
else if(kind==2){vec2 z=p*.5;for(int i=0;i<7;i++){z=abs(z)/clamp(dot(z,z),.2,2.)-vec2(.8+warp*.5,.65+sin(t)*.12);}f=length(z)*.25+.1*sin(atan(z.y,z.x)*2.+length(z)*2.3);}
else if(kind==3){f=sin(p.x*(12.+complexity*20.)+t)*sin((p.x*cos(.4+t*.04)+p.y*sin(.4+t*.04))*20.)*.4+sin(length(p)*10.-t)*.2;}
else if(kind==4){vec2 b=floor(p*(8.+complexity*30.));f=hash(b+floor(t*3.))*.7+sin(b.x*.2+b.y*.3+t)*.3;}
else if(kind==5){f=seamlessTunnel(p);}
else if(kind==6){vec2 q=vec2(fbm(p+t*.14),fbm(p+vec2(4.3,7.1)-t*.12));vec2 r=vec2(fbm(p+q*4.*warp+vec2(1.7,9.2)+t*.13),fbm(p+q*4.*warp+vec2(8.3,2.8)-t*.11));f=fbm(p+r*(2.+warp*4.));}
else if(kind==7){vec2 z=p*(1.2+complexity*1.8),g=floor(z),q=fract(z);float first=8.,second=8.;for(int j=-1;j<=1;j++){for(int i=-1;i<=1;i++){vec2 o=vec2(float(i),float(j));vec2 h=vec2(hash(g+o),hash(g+o+19.));vec2 point=.5+.42*sin(TAU*h+t*(.3+warp));float d=length(o+point-q);if(d<first){second=first;first=d;}else second=min(second,d);}}f=(second-first)*.65+first*.35;}
else if(kind==8){float r=length(p),a=atan(p.y,p.x);float petals=3.+floor(complexity*9.);f=sin(r*(5.+warp*8.)-t)*.18+cos(a*petals+t*.7)*exp(-r*.23)*.2+sin(r*3.+a*2.+t)*.16;}
else if(kind==9){vec2 flow=p+warp*vec2(sin(p.y*.8+t*.4),cos(p.x*.6-t*.3));f=fbm(flow*.8+vec2(t*.12,-t*.08));f+=sin(p.x*.5+p.y*.3+t*.15)*.14;}
else if(kind==10){vec2 z=p+warp*.3*vec2(sin(p.y*3.+t),cos(p.x*3.-t));float x=sin(z.x*(8.+complexity*15.)+t),y=sin(z.y*(8.+complexity*15.)-t);f=mix(x*.17+y*.17,abs(x)-abs(y),.22)+step(0.,x*y)*.09;}
else if(kind==11){float a=atan(p.y,p.x),r=length(p);float n=3.+floor(complexity*7.);float wedge=cos(floor(.5+a/(TAU/n))*(TAU/n)-a)*r;f=sin(wedge*(5.+warp*9.)-t)*.18+sin(r*7.+t)*.12+floor(r*2.5)*.07;}
else if(kind==12){f=hyperbolicCRT(p);}
else if(kind==13){f=candyFractalPortal(p);}
else if(kind==14){f=fivefoldDiffraction(p);}
else if(kind==15){f=biologicalField(p);}
else if(kind==16){f=.18*sin(length(p)*3.+time*.47)+.12*cos(atan(p.y,p.x)*5.-time*.22);}
else if(kind==17 || kind==18 || kind==19){f=strangeField(p,kind);}
else {f=0.;}
return f;}
float composed(vec2 p){float a=field(p,engine);if(blend<.001)return a;float b=field(rotate(.43)*p+vec2(.37,-.21),secondaryEngine);float c=b;if(blendMode==1)c=a*b*2.;if(blendMode==2)c=abs(a-b);return mix(a,c,blend);}
float phaseOf(float value,vec2 uv,float source){float bands=(2.+complexity*5.)*pow(2.,(colorRepeat-.5)*2.);float phase=value*bands+seed*.001+seedHigh*.017+colorTime*.04+colorOffset;
if(colorAmount>.0){float t=colorTime/12.;vec2 s=(uv-.5)*3.;float voice=0.;if(colorMode==0){voice=t+.55*s.x+.22*s.y+.2*sin(TAU*(t+s.y))+.1*sin(TAU*(2.*t+s.x));}else if(colorMode==1){voice=t+.25*s.x+.15*s.y+.24*sin(TAU*(t+.19*s.x+.17*s.y))+.12*sin(TAU*(2.*t+.38*s.x+.17*s.y)+1.7)+.07*sin(TAU*(3.*t+.57*s.x+.17*s.y)+3.4);}else{
  float angle=atan(s.y,s.x),radial=length(s);
  voice=t+.27*sin(angle*2.+radial*3.1-t*TAU)+.22*cos(angle*3.-radial*2.2+t*.6);
}phase+=colorAmount*voice;}
phase+=source;if(posterize)phase=floor(phase*7.)/7.;return phase;}
/* COMPOSITION_MODULE */
/* BACKDROP_MODULE */
/* MICRO_MODULE */
/* SUBSTANCE_MODULE */
/* PHOTON_MODULE */
/* UNDERLAY_MODULE */
/* FILAMENT_MODULE */
/* MATERIAL_MODULE */
/* ATMOSPHERE_MODULE */
/* HABITAT_MODULE */
/* LETTERING_MODULE */
${appearanceGLSL}
void main(){vec2 uv=gl_FragCoord.xy/res;vec2 aspect=vec2(res.x/res.y,1.);vec2 sampleUV=uv;
if(pixel>.001){float cells=mix(600.,24.,pow(pixel,.65));sampleUV=(floor(uv*vec2(cells*aspect.x,cells))+.5)/vec2(cells*aspect.x,cells);}
vec2 p=(sampleUV-.5)*aspect*(2.+scale*5.);p=rotate(rotation)*p;
p=animateCoordinates(p);
if(mirror)p.x=abs(p.x);if(symmetry>1.5){float wedge=TAU/floor(symmetry);float angle=mod(atan(p.y,p.x)+wedge*.5,wedge)-wedge*.5;p=length(p)*vec2(cos(angle),sin(angle));}
// Continuous analog signal drift. Neighboring bands blend smoothly, with no horizontal UV jumps.
float bandPos=uv.y*25.+time*.17;
float bandId=floor(bandPos);
float bandFade=smoothstep(0.,1.,fract(bandPos));
float v0=hash(vec2(bandId,floor(time*1.6)+4.));
float v1=hash(vec2(bandId+1.,floor(time*1.6)+4.));
float w0=(v0-.5)*smoothstep(.72,.92,v0);
float w1=(v1-.5)*smoothstep(.72,.92,v1);
float drift=mix(w0,w1,bandFade);
float tear=clamp(abs(drift)*glitch*2.5,0.,1.);
p.x+=drift*glitch*.72;
float blocks=step(1.-block*.32,hash(floor(uv*vec2(17.,24.))+floor(time*2.)));p+=blocks*block*vec2(hash(floor(uv*16.))-.5,hash(floor(uv*14.)+2.)-.5)*2.;
float source=0.;for(int i=0;i<32;i++){if(i<count){vec2 d=(uv-marks[i].xy)*aspect;float radius=max(markShape[i].x,.05);float influence=exp(-dot(d,d)/(radius*radius));float force=marks[i].z*influence;float a=markShape[i].y;vec2 local=rotate(a)*d;
if(marks[i].w<.5)p+=rotate(a)*vec2(sin(local.y*15.+time),cos(local.x*15.-time))*force;
else if(marks[i].w<1.5)p+=vec2(-d.y,d.x)*force*8.;else if(marks[i].w<2.5)p+=d*force*8.;else source+=force*(.5+.5*sin(2.*atan(d.y,d.x)+colorTime*.5+a));}}
/* WIGGLE_POST */
float v=composed(p);vec3 col=palette(phaseOf(v,uv,source));float edge=pow(.5+.5*sin(v*(2.+complexity*5.)*TAU),18.);col*=.72+edge*.5;if(bloom)col+=edge*col*.24;
/* BACKDROP_POST */
/* COMPOSITION_POST */
/* STEREO_POST */
/* MATERIAL_POST */
/* SUBSTANCE_POST */
/* MICRO_POST */
/* PHOTON_POST */
/* UNDERLAY_POST */
/* FILAMENT_POST */
/* ATMOSPHERE_POST */
/* ATMOSPHERE_B_POST */
col=animateLight(col,uv,v);
col=stainWithBiology(col,uv,p);
/* LETTERING_POST */
if(split>.001){col.r=mix(col.r,palette(phaseOf(composed(p+vec2(split*.09,0.)),uv,source)).r,split);col.b=mix(col.b,palette(phaseOf(composed(p-vec2(split*.09,0.)),uv,source)).b,split);}
col*=1.-scan*(.5+.5*sin(uv.y*900.))*.55;col+=(hash(floor(uv*1000.)+fract(time))-.5)*grain*.3;col=mix(col,col.brg,tear*.65);col=mix(col,col.gbr,blocks*block*.6);
float luma=dot(col,vec3(.2126,.7152,.0722));col=mix(vec3(luma),col,saturation*2.);col=(col-.5)*(.5+contrast)+.5;col*=.5+brightness;col*=1.-vignette*smoothstep(.15,.8,length((uv-.5)*aspect));if(invert)col=1.-col;
col=applyAppearance(col,uv);
gl_FragColor=vec4(clamp(col,0.,1.),1.);}`;

export function createRenderer(canvas) {
  const options = {
    preserveDrawingBuffer: true,
    antialias: false,
    alpha: false,
    depth: false,
    stencil: false,
    powerPreference: "high-performance",
  };
  const gl2 = canvas.getContext("webgl2", options),
    gl = gl2 || canvas.getContext("webgl", options);
  if (!gl)
    throw Error(
      "WebGL is unavailable. Enable hardware acceleration to use the studio.",
    );
  const programs = new Map();
  let active, fence = null, memory = null, memoryShader = null, memoryDisabled = false;
  let stereoUnavailable = false, materialUnavailable = false,
    strangeUnavailable = false, atmosphereUnavailable = false,
    atmosphereBUnavailable = false, habitatUnavailable = false,
    typeShaderUnavailable = false, compositionUnavailable = false,
    backdropUnavailable = false, microUnavailable = false,
    substanceUnavailable = false, wiggleUnavailable = false,
    photonUnavailable = false, filamentUnavailable = false,
    filamentHybridUnavailable = false, filamentMaterialUnavailable = false,
    filamentStitchUnavailable = false, filamentSculptUnavailable = false,
    underlayUnavailable = false;
  function compatibleShaderState(s){
    const source = stereoUnavailable ? safe2DSelection(s) : s;
    if(!materialUnavailable && !typeShaderUnavailable &&
       !compositionUnavailable && !backdropUnavailable &&
       !microUnavailable && !substanceUnavailable && !wiggleUnavailable &&
       !photonUnavailable && !filamentUnavailable && !filamentHybridUnavailable &&
       !filamentMaterialUnavailable && !filamentStitchUnavailable &&
       !filamentSculptUnavailable && !underlayUnavailable &&
       !strangeUnavailable && !atmosphereUnavailable &&
       !atmosphereBUnavailable && !habitatUnavailable)return source;
    return {
      ...source,
      ...(materialUnavailable ? {filmAmount:0,opalAmount:0,prismAmount:0,foilRelief:0}:{}),
      ...(typeShaderUnavailable ? {letteringAmount:0}:{}),
      ...(compositionUnavailable ? {compositionAmount:0}:{}),
      ...(backdropUnavailable ? {backdropAmount:0}:{}),
      ...(microUnavailable ? {microAmount:0}:{}),
      ...(substanceUnavailable ? {substanceAmount:0}:{}),
      ...(photonUnavailable ? {photonAmount:0}:{}),
      ...(filamentUnavailable ? {filamentAmount:0}:{}),
      ...(filamentHybridUnavailable ? {filamentCrossbreed:0}:{}),
      ...(filamentStitchUnavailable ? {filamentStitchAmount:0}:{}),
      ...(filamentSculptUnavailable ? {filamentSculptAmount:0}:{}),
      ...(underlayUnavailable ? {underlayAmount:0}:{}),
      ...(atmosphereUnavailable ? {atmoAmount:0}:{}),
      ...(atmosphereBUnavailable ? {atmoBAmount:0}:{}),
      ...(habitatUnavailable ? {atmoMaskMode:"Everywhere",atmoBMaskMode:"Everywhere"}:{}),
      ...(strangeUnavailable ? {
        engine: source.engine>=17 && source.engine<=19 ? 0 : source.engine,
        secondaryEngine: source.secondaryEngine>=17 && source.secondaryEngine<=19 ? 1 : source.secondaryEngine
      }:{}),
      ...(filamentMaterialUnavailable ? {filamentMaterial:"Original thread",filamentSecondMaterial:"Original thread",
        filamentNap:0,filamentBeads:0}:{}),
      ...(wiggleUnavailable ? {wiggleAmount:0}:{})
    };
  }
  let typeTexture=null, typeKey="", typeUnavailable=false;
  const extraTypeTextures=[null,null],extraTypeKeys=["",""];
  const pendingFontLoads=new Set(), failedFontLoads=new Set();
  function releaseLettering(){
    for(let i=0;i<2;i++){
      if(extraTypeTextures[i])gl.deleteTexture(extraTypeTextures[i]);
      extraTypeTextures[i]=null;extraTypeKeys[i]="";
    }
    if(typeTexture)gl.deleteTexture(typeTexture);
    typeTexture=null;typeKey="";
  }
  function updateLettering(s,width,height){
    if(typeUnavailable || !s.letteringAmount || !s.lettering.trim())return false;
    const fontId=s.letteringFont||"original";
    if(!retroFontReady(fontId) && !pendingFontLoads.has(fontId) && !failedFontLoads.has(fontId)){
      pendingFontLoads.add(fontId);
      ensureRetroFontLoaded(fontId).then(
        ()=>{pendingFontLoads.delete(fontId);typeKey="";},
        err=>{failedFontLoads.add(fontId);pendingFontLoads.delete(fontId);
          console.warn("Typeface unavailable: displaying a fallback.",err);}
      );
    }
    try{
      if(!typeTexture) {
        typeTexture=gl.createTexture();
        if(!typeTexture)throw Error("Could not allocate a lettering texture.");
        gl.activeTexture(gl.TEXTURE3);gl.bindTexture(gl.TEXTURE_2D,typeTexture);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
      }
      const aspect=width/Math.max(1,height);
      const key=s.lettering+"|"+aspect.toFixed(4)+"|"+fontId+"|"+retroFontRevision()+"|"+JSON.stringify([s.letteringFillMode,s.letteringFill,s.letteringGradient,s.letteringGradientAngle,s.letteringStrokes]);
      if(key!==typeKey){
        const glyphs=glyphCanvas(s.lettering,aspect,fontId,s);
        gl.activeTexture(gl.TEXTURE3);gl.bindTexture(gl.TEXTURE_2D,typeTexture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
        try{gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,glyphs);}
        finally{gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);}
        typeKey=key;
      }
      gl.activeTexture(gl.TEXTURE3);gl.bindTexture(gl.TEXTURE_2D,typeTexture);
      gl.activeTexture(gl.TEXTURE0);return true;
    }catch(error){
      typeUnavailable=true;releaseLettering();gl.activeTexture(gl.TEXTURE0);
      console.warn("Kinetic lettering unavailable, original artwork preserved.",error);
      return false;
    }
  }
  function updateExtraLettering(s,width,height){
    const layers=s.letteringLayers||[];
    for(let i=0;i<2;i++){
      const layer=layers[i];
      if(!layer||!layer.visible||!layer.text.trim())continue;
      const fontId=layer.letteringFont||"original";
      if(!retroFontReady(fontId)&&!pendingFontLoads.has(fontId)&&!failedFontLoads.has(fontId)){
        pendingFontLoads.add(fontId);
        ensureRetroFontLoaded(fontId).then(()=>{pendingFontLoads.delete(fontId);extraTypeKeys[i]="";},
          err=>{pendingFontLoads.delete(fontId);failedFontLoads.add(fontId);console.warn("Extra text font unavailable",err);});
      }
      try{
        if(!extraTypeTextures[i]){
          extraTypeTextures[i]=gl.createTexture();
          gl.activeTexture(gl.TEXTURE4+i);gl.bindTexture(gl.TEXTURE_2D,extraTypeTextures[i]);
          gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
        }
        const aspect=width/Math.max(1,height);
        const key=JSON.stringify([layer,aspect.toFixed(4),retroFontRevision()]);
        gl.activeTexture(gl.TEXTURE4+i);gl.bindTexture(gl.TEXTURE_2D,extraTypeTextures[i]);
        if(key!==extraTypeKeys[i]){
          const glyphs=glyphCanvas(layer.text,aspect,fontId,layer);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
          try{gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,glyphs);}
          finally{gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);}
          extraTypeKeys[i]=key;
        }
      }catch(e){console.warn("Extra text layer skipped",e);extraTypeKeys[i]="";}
    }
    gl.activeTexture(gl.TEXTURE0);
  }

  // Text is composited AFTER the artwork and feedback passes. The main art
  // shader never depends on typography, so an unsupported font effect cannot
  // disable the canvas or silently swallow all words.
  let textOverlayProgram=null, textOverlayFailed=false;
  function overlayText(s,timeline,width,height){
    const layers=[{
      text:s.lettering,visible:true,letteringAmount:s.letteringAmount,
      letteringX:s.letteringX,letteringY:s.letteringY,
      letteringRotation:s.letteringRotation,letteringScale:s.letteringScale,
      letteringStretchX:s.letteringStretchX,letteringStretchY:s.letteringStretchY,
      letteringCurve:s.letteringCurve,letteringWarp:s.letteringWarp,
      letteringMotion:s.letteringMotion
    },...(s.letteringLayers||[]).slice(0,2)];
    if(!layers.some(l=>l.visible!==false&&l.text?.trim()&&l.letteringAmount>0))return;
    if(textOverlayFailed)return;
    try{
      if(!textOverlayProgram){
        const vs=gl2
          ? "#version 300 es\nin vec2 position;void main(){gl_Position=vec4(position,0.,1.);}"
          : "attribute vec2 position;void main(){gl_Position=vec4(position,0.,1.);}";
        const fs=(gl2?"#version 300 es\n":"")+`precision mediump float;
          ${gl2?"out vec4 fragColor;":""}
          uniform sampler2D ink;
          uniform vec2 resolution,pivot,stretch;
          uniform float angle,zoom,curve,warp,motion,time,opacity;
          void main(){
            vec2 uv=gl_FragCoord.xy/resolution;
            vec2 q=uv-pivot;
            float a=-angle*0.01745329252;
            q=mat2(cos(a),-sin(a),sin(a),cos(a))*q;
            q/=max(stretch,vec2(.25));
            q/=mix(.63,.97,zoom);
            q.x-=curve*.18*(q.y*q.y-.065);
            q+=.5;
            float t=time*(.22+motion*.95);
            q+=motion*.009*vec2(sin(q.y*8.+t*.61),cos(q.x*7.-t*.48));
            q+=warp*.009*vec2(sin(q.y*13.+t*.81),cos(q.x*11.-t*.67));
            vec2 inside=step(vec2(0.),q)*step(q,vec2(1.));
            vec4 c=${gl2?"texture":"texture2D"}(ink,clamp(q,0.,1.));
            c.a*=inside.x*inside.y*opacity;
            ${gl2?"fragColor":"gl_FragColor"}=c;
          }`;
        const v=compile(gl.VERTEX_SHADER,vs),f=compile(gl.FRAGMENT_SHADER,fs);
        const program=gl.createProgram();
        try{
          gl.attachShader(program,v);gl.attachShader(program,f);
          gl.bindAttribLocation(program,0,"position");
          gl.linkProgram(program);
          if(!gl.getProgramParameter(program,gl.LINK_STATUS))
            throw Error(gl.getProgramInfoLog(program));
          textOverlayProgram=program;
        }finally{gl.deleteShader(v);gl.deleteShader(f);if(!textOverlayProgram)gl.deleteProgram(program);}
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER,null);
      gl.viewport(0,0,width,height);
      gl.useProgram(textOverlayProgram);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
      const u=(name)=>gl.getUniformLocation(textOverlayProgram,name);
      gl.uniform2f(u("resolution"),width,height);
      gl.uniform1f(u("time"),timeline.time);
      for(let i=0;i<layers.length;i++){
        const l=layers[i],texture=i===0?typeTexture:extraTypeTextures[i-1];
        const ready=i===0?!!typeKey:!!extraTypeKeys[i-1];
        if(!l||l.visible===false||!l.text?.trim()||!l.letteringAmount||!texture||!ready)continue;
        const unit=i===0?3:3+i;
        gl.activeTexture(gl.TEXTURE0+unit);
        gl.bindTexture(gl.TEXTURE_2D,texture);
        gl.uniform1i(u("ink"),unit);
        gl.uniform2f(u("pivot"),(l.letteringX??50)/100,(l.letteringY??50)/100);
        gl.uniform2f(u("stretch"),(l.letteringStretchX??100)/100,(l.letteringStretchY??100)/100);
        gl.uniform1f(u("angle"),l.letteringRotation??0);
        gl.uniform1f(u("zoom"),(l.letteringScale??48)/100);
        gl.uniform1f(u("curve"),(l.letteringCurve??0)/100);
        gl.uniform1f(u("warp"),(l.letteringWarp??0)/100);
        gl.uniform1f(u("motion"),(l.letteringMotion??0)/100);
        gl.uniform1f(u("opacity"),(l.letteringAmount??0)/100);
        gl.drawArrays(gl.TRIANGLES,0,6);
      }
    }catch(e){
      textOverlayFailed=true;
      console.warn("Independent text overlay unavailable; artwork remains safe.",e);
    }finally{
      gl.disable(gl.BLEND);
      gl.activeTexture(gl.TEXTURE0);
    }
  }
  // Do not let an unsupported high-cost 3D shader blank out existing artwork.
  const safe2DSelection = (s) => ({
    ...s,
    engine: s.engine === 16 ? 6 : s.engine,
    secondaryEngine: s.secondaryEngine === 16 ? 6 : s.secondaryEngine,
    stereoAmount: 0,
  });
  let memoryIdentity = "", lastMemoryTime = -Infinity, lastMemoryColorTime = -Infinity;
  let biology = null, biologySeed = null, biologyTexture = null;
  let biologyLastTime = null, biologyFraction = 0, biologyDisabled = false;
  let biologyFeed = 44, biologyKill = 42;
  const emptyBioTexture = gl.createTexture();
  if (!emptyBioTexture) throw Error("Cannot allocate the fallback biology texture.");
  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, emptyBioTexture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
    new Uint8Array([0, 0, 0, 255]));
  gl.activeTexture(gl.TEXTURE0);
  function releaseBiology() {
    if (biologyTexture) gl.deleteTexture(biologyTexture);
    biologyTexture = null;
    biology = null;
    biologySeed = null;
    biologyLastTime = null;
    biologyFraction = 0;
  }
  function updateBiology(s, timeline) {
    const needed = s.engine === 15 || (s.blend > 0 && s.secondaryEngine === 15) || s.bioAmount > 0;
    if (!needed || biologyDisabled) return false;
    try {
      if (!biology || biologySeed !== s.seed) {
        releaseBiology();
        biology = createBiology(s.seed);
        biologySeed = s.seed;
        biologyFeed = s.bioFeed;
        biologyKill = s.bioKill;
        biology.advance(48, biologyFeed, biologyKill);
        biologyLastTime = timeline.time;
        biologyTexture = gl.createTexture();
        if (!biologyTexture) throw Error("Biological texture allocation failed.");
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, biologyTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, BIO_SIZE, BIO_SIZE, 0,
          gl.RGBA, gl.UNSIGNED_BYTE, biology.pixels());
      } else {
        const elapsed = biologyLastTime === null ? 0 : timeline.time - biologyLastTime;
        biologyFeed = s.bioFeed;
        biologyKill = s.bioKill;
        if (elapsed < -.0001) {
          biology.reset();
          biology.advance(48, s.bioFeed, s.bioKill);
          biologyFraction = 0;
        } else if (elapsed > 0) {
          const desired = elapsed * (9 + s.bioSpeed * .23) + biologyFraction;
          const steps = Math.min(9, Math.floor(desired));
          // Bounded catch-up: large seeks never freeze an iPhone for hundreds of steps.
          biologyFraction = elapsed > 2 ? 0 : desired - Math.floor(desired);
          if (steps) biology.advance(steps, s.bioFeed, s.bioKill);
        }
        biologyLastTime = timeline.time;
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, biologyTexture);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, BIO_SIZE, BIO_SIZE,
          gl.RGBA, gl.UNSIGNED_BYTE, biology.pixels());
      }
      gl.activeTexture(gl.TEXTURE0);
      return true;
    } catch (error) {
      // The biology engine must never take the original art down with it.
      biologyDisabled = true;
      releaseBiology();
      console.warn("Biology simulation disabled; original art preserved.", error);
      gl.activeTexture(gl.TEXTURE0);
      return false;
    }
  }
  function releaseMemory() {
    if (memory) {
      gl.deleteTexture(memory.scene);
      gl.deleteTexture(memory.history);
      gl.deleteFramebuffer(memory.fbo);
      memory = null;
    }
    memoryIdentity = "";
    lastMemoryTime = lastMemoryColorTime = -Infinity;
  }
  function createMemoryTexture(w, h) {
    const tex = gl.createTexture();
    if (!tex) throw Error("GPU texture allocation failed.");
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    return tex;
  }
  function memoryProgram() {
    if (memoryShader) return memoryShader;
    const vs = gl2 ? "#version 300 es\n" +
      feedbackVertex.replace("attribute vec2", "in vec2").replace("varying vec2", "out vec2") : feedbackVertex;
    const fs = gl2 ? "#version 300 es\n" +
      feedbackFragment.replace("precision highp float;", "precision highp float;\nout vec4 fragColor;")
        .replace("varying vec2", "in vec2").replaceAll("texture2D(", "texture(")
        .replaceAll("gl_FragColor", "fragColor") : feedbackFragment;
    let vert, frag, program;
    try {
      vert = compile(gl.VERTEX_SHADER, vs);
      frag = compile(gl.FRAGMENT_SHADER, fs);
      program = gl.createProgram();
      gl.attachShader(program, vert);
      gl.attachShader(program, frag);
      gl.bindAttribLocation(program, 0, "position");
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        throw Error(gl.getProgramInfoLog(program));
      memoryShader = {
        program,
        uniforms: new Map(),
      };
      return memoryShader;
    } catch (e) {
      if (program) gl.deleteProgram(program);
      throw e;
    } finally {
      if (vert) gl.deleteShader(vert);
      if (frag) gl.deleteShader(frag);
    }
  }
  function prepareMemory(w, h) {
    const shader = memoryProgram();
    if (memory && memory.width === w && memory.height === h) return { shader, memory };
    releaseMemory();
    let scene, history, fbo;
    try {
      gl.activeTexture(gl.TEXTURE0);
      scene = createMemoryTexture(w, h);
      history = createMemoryTexture(w, h);
      fbo = gl.createFramebuffer();
      if (!fbo) throw Error("GPU framebuffer allocation failed.");
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, scene, 0);
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE)
        throw Error("Previous-frame buffer unsupported by this device.");
      memory = { scene, history, fbo, width: w, height: h, valid: false };
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return { shader, memory };
    } catch (e) {
      if (scene) gl.deleteTexture(scene);
      if (history) gl.deleteTexture(history);
      if (fbo) gl.deleteFramebuffer(fbo);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      throw e;
    }
  }
  function compositeFeedback(s, timeline, w, h) {
    const shader = memoryShader;
    const uniform = (name) => {
      if (!shader.uniforms.has(name))
        shader.uniforms.set(name, gl.getUniformLocation(shader.program, name));
      return shader.uniforms.get(name);
    };
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, w, h);
    gl.useProgram(shader.program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, memory.scene);
    gl.uniform1i(uniform("sceneTex"), 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, memory.history);
    gl.uniform1i(uniform("historyTex"), 1);
    gl.uniform2f(uniform("resolution"), w, h);
    gl.uniform1f(uniform("time"), timeline.time + timeline.colorTime * .17);
    gl.uniform1f(uniform("seed"), s.seed);
    for (const k of ["afterimage", "datamosh", "memoryDrift", "memoryDecay"])
      gl.uniform1f(uniform(k), s[k] / 100);
    gl.uniform1f(uniform("hasMemory"), memory.valid ? 1 : 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    // Copy the displayed, fully composited frame into the previous-frame texture.
    // No CPU readback or accumulating frame array: memory use stays bounded.
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, memory.history);
    gl.copyTexSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 0, 0, w, h);
    if (gl.getError() !== gl.NO_ERROR)
      throw Error("GPU history texture copy failed.");
    gl.activeTexture(gl.TEXTURE0);
    memory.valid = true;
  }
  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw Error(error);
    }
    return shader;
  }
  function programFor(s) {
    const blended = s.blend > 0,
      withStereo = s.engine === 16 || (blended && s.secondaryEngine === 16) || s.stereoAmount > 0,
      withWiggle = s.wiggleAmount > 0,
      withMaterial = s.filmAmount>0 || s.opalAmount>0 || s.prismAmount>0 || s.foilRelief>0,
      withLettering = false, // Lettering is a separate, fail-safe GPU compositing pass.
      withComposition = blended && s.compositionAmount>0,
      withBackdrop = s.backdropAmount>0,
      withMicro = s.microAmount>0,
      withSubstance = s.substanceAmount>0,
      withPhoton = s.photonAmount>0,
      withUnderlay = s.underlayAmount>0,
      withFilament = s.filamentAmount>0,
      withHybrid = withFilament && s.filamentCrossbreed>0,
      withStitch = withFilament && s.filamentStitchAmount>0,
      withSculpt = withFilament && s.filamentSculptAmount>0,
      withFiberDetail = withFilament && (
        s.filamentMaterial!=="Original thread" ||
        withHybrid && s.filamentSecondMaterial!=="Original thread" ||
        s.filamentNap>0 || s.filamentBeads>0
      ),
      withTunnel = s.engine===5 || (blended && s.secondaryEngine===5),
      withAtmosphere = s.atmoAmount>0,
      withAtmosphereB = s.atmoBAmount>0,
      withHabitat = (withAtmosphere && s.atmoMaskMode!=="Everywhere") ||
        (withAtmosphereB && s.atmoBMaskMode!=="Everywhere"),
      withStrange = (s.engine>=17 && s.engine<=19) ||
        (blended && s.secondaryEngine>=17 && s.secondaryEngine<=19),
      key = `${s.engine}/${blended ? s.secondaryEngine : "off"}/${s.split > 0.1}/${withStereo ? "stereo" : "flat"}/${withMaterial ? "foil" : "plain"}/${withLettering ? "letters" : "unlettered"}/${withComposition ? "territories" : "full"}/${withBackdrop ? "backdrop" : "unbacked"}/${withMicro ? "micro" : "untextured"}/${withSubstance ? "substance" : "bare"}/${withPhoton ? `photon${photonSpecies.indexOf(s.photonSpecies)}` : "unlit"}/${withUnderlay ? `underlay${underlayModes.indexOf(s.underlayMode)}` : "bare-ground"}/${withFilament ? `filament${filamentSpecies.indexOf(s.filamentSpecies)}` : "unstitched"}/${withHybrid ? `hybrid${filamentSpecies.indexOf(s.filamentSecondSpecies)}` : "single"}/${withFilament ? `fiber${filamentMaterials.indexOf(s.filamentMaterial)}` : "barefiber"}/${withHybrid ? `fiber2${filamentMaterials.indexOf(s.filamentSecondMaterial)}` : "singlefiber"}/${withFiberDetail ? "fiber-detail" : "classic-fiber"}/${withStitch ? "sewing"+filamentStitchModes.indexOf(s.filamentStitchMode) : "still-loom"}/${withSculpt ? "relief"+filamentSculptModes.indexOf(s.filamentSculptMode) : "flat-thread"}/${withAtmosphere ? `atmo${atmosphereModes.indexOf(s.atmoMode)}` : "no-atmo"}/${withAtmosphereB ? `atmoB${atmosphereModes.indexOf(s.atmoBMode)}blend${atmosphereBlendModes.indexOf(s.atmoBBlendMode)}` : "no-atmoB"}/${withHabitat ? `habA${atmosphereHabitats.indexOf(s.atmoMaskMode)}habB${atmosphereSecondHabitats.indexOf(s.atmoBMaskMode)}` : "no-habitat"}/${withWiggle ? "wiggle" : "still"}`;
    if (programs.has(key)) {
      const cached = programs.get(key);
      programs.delete(key);
      programs.set(key, cached);
      return cached;
    }
    // Compile only the selected fields. Literal engine IDs let the driver eliminate
    // unused branches before GPU code generation; the equations are unchanged.
    let source = fragment.replace(
      "uniform int engine,secondaryEngine,blendMode,count,colorCount,colorMode;",
      `uniform int blendMode,count,colorCount,colorMode;\n#define engine ${s.engine}\n#define secondaryEngine ${s.secondaryEngine}`,
    );
    if (!blended)
      source = source.replace("if(blend<.001)return a;", "return a;");
    source = source.replace("/* STRANGE_FIELDS_MODULE */",withStrange ? strangeFieldsGLSL :
      "float strangeField(vec2 p,int kind){return 0.;}");
    source = source.replace("/* WIGGLE_MODULE */", withWiggle ? wiggleGLSL : "");
    source = source.replace("/* WIGGLE_POST */", withWiggle ? "p=wiggleCoordinates(p);" : "");
    source = source.replace("/* STEREO_MODULE */", withStereo ? stereoGLSL : "");
    source = source.replace("/* TUNNEL_MODULE */", withTunnel ? tunnelGLSL :
      "float seamlessTunnel(vec2 p){return 0.;}");
    source = source.replace("/* STEREO_POST */", withStereo
      ? `vec4 ghost=ghostTrace(p,uv);
         float ghostOpacity=engine==16 ? max(.83,stereoAmount) :
           (secondaryEngine==16 && blend>.001 ? max(stereoAmount,blend*.78) : stereoAmount);
         ${withComposition ? "if(engine!=16 && secondaryEngine==16) ghostOpacity*=territoryMask(uv)*compositionAmount;" : ""}
         col=mix(col,ghost.rgb,clamp(ghostOpacity*(.52+.48*ghost.a),0.,1.));`
      : "");
    source=source.replace("/* SUBSTANCE_MODULE */",withSubstance?substanceGLSL:"");
    source=source.replace("/* SUBSTANCE_POST */",
      withSubstance?"col=livingSubstance(col,uv,p,v);":"");
    // Specialize to the chosen species: dead branches disappear at compile
    // time instead of making iPhone GPUs carry all eight architectures.
    const specializedPhoton = withPhoton
      ? photonGLSL.replace("uniform int photonSpecies;",
          "#define photonSpecies "+Math.max(0,photonSpecies.indexOf(s.photonSpecies)))
      : "";
    source=source.replace("/* PHOTON_MODULE */",specializedPhoton);
    source=source.replace("/* PHOTON_POST */",withPhoton?"col=livingPhotonZoo(col,uv,p,v);":"");
    // Textile ground is independent from filament visibility. Inject it
    // directly behind the stitches and specialize to the selected pattern.
    const selectedUnderlay = withUnderlay
      ? underlayGLSL.replace("uniform int underlayMode;",
          "#define underlayMode "+Math.max(0,underlayModes.indexOf(s.underlayMode)))
      : "";
    source=source.replace("/* UNDERLAY_MODULE */",selectedUnderlay);
    source=source.replace("/* UNDERLAY_POST */",
      withUnderlay?"col=livingTextileUnderlay(col,uv,v);":"");
    // Do not compile the second geometry at all for old or single-parent art.
    const selectedFilament=withFilament
      ? (withHybrid ? "#define FILAMENT_HYBRID 1\n" : "") +
        (withFiberDetail ? "#define FILAMENT_FIBER_DETAIL 1\n" : "") +
        (withStitch ? "#define FILAMENT_STITCHING 1\n" : "") +
        (withSculpt ? "#define FILAMENT_SCULPT 1\n" : "") +
        filamentGLSL.replace("uniform int filamentSpecies;",
          "#define filamentSpecies "+Math.max(0,filamentSpecies.indexOf(s.filamentSpecies)))
          .replace("uniform int filamentSecondSpecies;",
            "#define filamentSecondSpecies "+Math.max(0,filamentSpecies.indexOf(s.filamentSecondSpecies)))
          .replace("uniform int filamentMaterial;",
            "#define filamentMaterial "+Math.max(0,filamentMaterials.indexOf(s.filamentMaterial)))
          .replace("uniform int filamentStitchMode;",
            "#define filamentStitchMode "+Math.max(0,filamentStitchModes.indexOf(s.filamentStitchMode)))
          .replace("uniform int filamentSculptMode;",
            "#define filamentSculptMode "+Math.max(0,filamentSculptModes.indexOf(s.filamentSculptMode)))
          .replace("uniform int filamentSecondMaterial;",
            "#define filamentSecondMaterial "+Math.max(0,filamentMaterials.indexOf(s.filamentSecondMaterial)))
      : "";
    source=source.replace("/* FILAMENT_MODULE */",selectedFilament);
    source=source.replace("/* FILAMENT_POST */",
      withFilament?"col=livingFilamentForge(col,uv,p,v);":"");
    const chosenAtmosphere = withAtmosphere
      ? atmosphereGLSL.replace("/* ATMOSPHERE_VARIANT */",
          "#define ATMO_MODE "+Math.max(0,atmosphereModes.indexOf(s.atmoMode)))
      : "";
    const chosenAtmosphereB=withAtmosphereB
      ? specializeAtmosphereVariant(s.atmoBMode,true) : "";
    // The second shader is a separately named function with its own normalized
    // uniforms. Macro reset prevents the second variant from changing parent A.
    source=source.replace("/* ATMOSPHERE_MODULE */",chosenAtmosphere+
      (withAtmosphereB ? (withAtmosphere ? "\n#undef ATMO_MODE\n" : "")+
        chosenAtmosphereB : ""));
    const masks=withHabitat
      ? habitatGLSL
          .replace("/* ATMO_MASK_A */",
            String(Math.max(0,atmosphereHabitats.indexOf(s.atmoMaskMode))))
          .replace("/* ATMO_MASK_B */",
            String(Math.max(0,atmosphereSecondHabitats.indexOf(s.atmoBMaskMode))))
      : "";
    const hybrid=withAtmosphereB
      ? "#define ATM_BLEND_B "+Math.max(0,atmosphereBlendModes.indexOf(s.atmoBBlendMode))+
        "\n"+atmosphereHybridGLSL : "";
    source=source.replace("/* HABITAT_MODULE */",masks+"\n"+hybrid);
    const maskedA=withAtmosphere && s.atmoMaskMode!=="Everywhere";
    const maskedB=withAtmosphereB && s.atmoBMaskMode!=="Everywhere";
    const rivalry=maskedA && maskedB &&
      s.atmoMaskMode==="Painted colonies" &&
      s.atmoBMaskMode==="Painted colonies";
    // Evaluate each mask once per pixel; the same masks govern color and
    // front-lighting. No extra texture pass or unstable frame-history buffer.
    const maskPrelude=withHabitat
      ? "float atmoAMask="+(maskedA?"atmosphereMaskForA(uv)":"1.")+";"+
        "float atmoBMask="+(maskedB?"atmosphereMaskForB(uv)":"1.")+";"+
        (rivalry ? `if(colonyLifeMode==4 && colonyLifeAmount>.001 && colonyCompetition>.001){
            float pressure=.22*sin(time*(.19+colonyLifeSpeed*1.37)+uv.x*4.8-uv.y*3.7);
            float aWins=smoothstep(-.2,.2,atmoAMask-atmoBMask+pressure);
            float conflict=colonyCompetition*colonyLifeAmount;
            atmoAMask*=mix(1.,aWins,conflict);
            atmoBMask*=mix(1.,1.-aWins,conflict);
          }` : "")
      : "";
    const glowA=maskedA
      ? "col+=palette(atmoHue+colorTime*.009)*"+
        "(4.*atmoAMask*(1.-atmoAMask))*colonyFrontGlow*.72;"
      : "";
    const glowB=maskedB
      ? "col+=palette(atmoBHue+.28+colorTime*.009)*"+
        "(4.*atmoBMask*(1.-atmoBMask))*colonyFrontGlow*.72;"
      : "";
    source=source.replace("/* ATMOSPHERE_POST */",
      maskPrelude+(withAtmosphere
        ? (maskedA
          ? "vec3 atmoParent=livingMutantAtmosphere(col,uv,p,v);"+
            "col=mix(col,atmoParent,atmoAMask);"+glowA
          : "col=livingMutantAtmosphere(col,uv,p,v);")
        : ""));
    source=source.replace("/* ATMOSPHERE_B_POST */",
      withAtmosphereB ? ("vec3 atmoChild=livingMutantAtmosphereB(col,uv,p,v);"+
        "vec3 atmoResult=crossbreedAtmospheres(col,atmoChild,uv,v);"+
        (maskedB
          ? "col=mix(col,atmoResult,atmoBMask);"+glowB
          : "col=atmoResult;")) : "");
    source=source.replace("/* MICRO_MODULE */",withMicro?microGLSL:"");
    source=source.replace("/* MICRO_POST */",withMicro?"col=movingMicrostructure(col,p,uv,v);":"");
    source=source.replace("/* BACKDROP_MODULE */",withBackdrop?backdropGLSL:"");
    source=source.replace("/* BACKDROP_POST */",withBackdrop?"col=livingBackdrop(col,uv,v);":"");
    source=source.replace("/* COMPOSITION_MODULE */",withComposition?compositionGLSL:"");
    source=source.replace("/* COMPOSITION_POST */",
      withComposition?"col=territoryComposite(col,p,uv,source);":"");
    if(withComposition)source=source.replace("float v=composed(p);","float v=field(p,engine);");
    source=source.replace("/* MATERIAL_MODULE */",withMaterial?materialGLSL:"");
    source=source.replace("/* MATERIAL_POST */",withMaterial?"col=prismaticTape(col,uv,p,v);":"");
    source=source.replace("/* LETTERING_MODULE */",withLettering?kineticGLSL:"");
    source=source.replace("/* LETTERING_POST */",withLettering?"col=drawKineticLetters(col,uv);":"");
    if (s.split <= 0.1) source = source.replace("if(split>.001)", "if(false)");
    const vs = gl2
      ? "#version 300 es\n" + vertex.replace("attribute vec2", "in vec2")
      : vertex;
    const fs = gl2
      ? "#version 300 es\n" +
        source
          .replace(
            "precision highp float;",
            "precision highp float;\nout vec4 fragColor;",
          )
          .replaceAll("gl_FragColor", "fragColor")
          .replaceAll("texture2D(", "texture(")
      : source;
    let vertexShader, fragmentShader, program;
    try {
      vertexShader = compile(gl.VERTEX_SHADER, vs);
      fragmentShader = compile(gl.FRAGMENT_SHADER, fs);
      program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.bindAttribLocation(program, 0, "position");
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        throw Error(gl.getProgramInfoLog(program));
      gl.detachShader(program, vertexShader);
      gl.detachShader(program, fragmentShader);
    } catch (e) {
      if (program) gl.deleteProgram(program);
      throw e;
    } finally {
      if (vertexShader) gl.deleteShader(vertexShader);
      if (fragmentShader) gl.deleteShader(fragmentShader);
    }
    const descriptor = { program, locations: new Map(), paletteKey: "" };
    programs.set(key, descriptor);
    if (programs.size > 6) {
      const oldest = programs.keys().next().value;
      gl.deleteProgram(programs.get(oldest).program);
      programs.delete(oldest);
    }
    return descriptor;
  }
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const loc = (key) => {
    if (!active.locations.has(key))
      active.locations.set(key, gl.getUniformLocation(active.program, key));
    return active.locations.get(key);
  };
  const colorBuffer = new Float32Array(36),
    marksBuffer = new Float32Array(128),
    shapeBuffer = new Float32Array(64),
    habitatBuffer = new Float32Array(64); // 16 planted habitat seeds, 4 floats per stamp
  const maxSize = Math.min(
    gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
    gl.getParameter(gl.MAX_TEXTURE_SIZE),
    4096,
  );
  return {
    maxSize,
    readFrame(target) {
      gl.readPixels(
        0,
        0,
        canvas.width,
        canvas.height,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        target,
      );
    },
    ready() {
      if (gl.isContextLost()) return false;
      if (!fence) return true;
      const status = gl.clientWaitSync(fence, 0, 0);
      if (status === gl.TIMEOUT_EXPIRED) return false;
      gl.deleteSync(fence);
      fence = null;
      return true;
    },
    draw(s, timeline, width = canvas.width, height = canvas.height) {
      if (gl.isContextLost()) return false;
      width = Math.max(1, Math.round(width));
      height = Math.max(1, Math.round(height));
      if (width > maxSize || height > maxSize)
        throw Error(
          `This device supports exports up to ${maxSize}px per side.`,
        );
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      // Progressive shader fallback: the newest optional effects are disabled
      // one at a time if the driver cannot compile them. Legacy fields stay visible.
      let lastCompileError = null;
      for(let attempt=0;attempt<16;attempt++){
        const candidate=compatibleShaderState(s);
        try {
          active=programFor(candidate);
          lastCompileError=null;
          break;
        }catch(e){
          lastCompileError=e;
          if((candidate.atmoAmount>0||candidate.atmoBAmount>0) &&
            (candidate.atmoMaskMode!=="Everywhere"||candidate.atmoBMaskMode!=="Everywhere") &&
            !habitatUnavailable){
            habitatUnavailable=true;
            console.warn("Atmospheric habitat mask too expensive for this GPU; preserving both full-canvas parents.",e);
          }else if(candidate.atmoBAmount>0){
            atmosphereBUnavailable=true;
            console.warn("Second atmosphere shader unsupported by this GPU; keeping primary atmosphere and art.",e);
          }else if(candidate.atmoAmount>0){
            atmosphereUnavailable=true;
            console.warn("Mutant Atmosphere unsupported by this GPU; protecting the original artwork.",e);
          }else if(candidate.underlayAmount>0){
            underlayUnavailable=true;
            console.warn("Living textile underlay unsupported by this GPU; preserving the original artwork and filaments.",e);
          }else if(candidate.filamentAmount>0 && candidate.filamentSculptAmount>0){
            filamentSculptUnavailable=true;
            console.warn("Sculpted thread shading unsupported; preserving woven geometry, materials and stitching.",e);
          }else if(candidate.filamentAmount>0 && candidate.filamentStitchAmount>0){
            filamentStitchUnavailable=true;
            console.warn("Animated stitches unsupported by this GPU; keeping the lace and materials.",e);
          }else if(candidate.filamentAmount>0 &&
            (candidate.filamentMaterial!=="Original thread" ||
             candidate.filamentCrossbreed>0 && candidate.filamentSecondMaterial!=="Original thread" ||
             candidate.filamentNap>0 || candidate.filamentBeads>0)){
            filamentMaterialUnavailable=true;
            console.warn("Detailed fiber shader unsupported; retaining classic filament geometry.",e);
          }else if(candidate.filamentAmount>0 && candidate.filamentCrossbreed>0){
            filamentHybridUnavailable=true;
            console.warn("Filament hybrid too demanding for this GPU; retaining the primary threads.",e);
          }else if(candidate.filamentAmount>0){
            filamentUnavailable=true;
            console.warn("Filament Forge unsupported by this GPU; original artwork remains intact.",e);
          }else if(candidate.photonAmount>0){
            photonUnavailable=true;
            console.warn("Photon Zoo shader unsupported by this GPU; protecting the original artwork.",e);
          }else if(candidate.wiggleAmount>0){
            wiggleUnavailable=true;
            console.warn("Wiggle stereoscopy unsupported; preserving the original artwork.",e);
          }else if(candidate.letteringAmount>0 && candidate.lettering.trim()){
            typeShaderUnavailable=true;
            console.warn("Kinetic lettering shader unavailable, preserving original art.",e);
          }else if(candidate.substanceAmount>0){
            substanceUnavailable=true;
            console.warn("Sample-vault substance shader unsupported; preserving the original artwork.",e);
          }else if(candidate.microAmount>0){
            microUnavailable=true;
            console.warn("Living microtexture unsupported; continuing with the original artwork.",e);
          }else if(candidate.backdropAmount>0){
            backdropUnavailable=true;
            console.warn("Living backdrop unsupported; keeping the original artwork.",e);
          }else if(candidate.compositionAmount>0 && candidate.blend>0){
            compositionUnavailable=true;
            console.warn("Spatial composition unsupported; using the original full-canvas blend.",e);
          }else if(candidate.filmAmount>0 || candidate.opalAmount>0 ||
            candidate.prismAmount>0 || candidate.foilRelief>0){
            materialUnavailable=true;
            console.warn("Prismatic material shader unavailable, preserving original art.",e);
          }else if((candidate.engine>=17 && candidate.engine<=19) ||
            (candidate.blend>0 && candidate.secondaryEngine>=17 && candidate.secondaryEngine<=19)){
            strangeUnavailable=true;
            console.warn("Shader-vault mathematical mutant unsupported by this GPU; showing safe original engine.",e);
          }else if(candidate.engine===16 ||
             (candidate.blend>0 && candidate.secondaryEngine===16) ||
             candidate.stereoAmount>0){
            stereoUnavailable=true;
            console.warn("3D shader unsupported on this device: showing 2D fallback, no artwork lost.",e);
          }else{ throw e; }
        }
      }
      if(lastCompileError)throw lastCompileError;
      const hasBiology = updateBiology(s, timeline);
      // Typography now lives entirely in the DOM preview / 2D export pipeline.
      // Avoid redundant GL texture uploads (especially expensive on iPhone Safari).
      const hasLettering = false;
      const hasMemoryEffects = (s.afterimage > 0 || s.datamosh > 0) && !memoryDisabled;
      let drawWithMemory = false;
      if (hasMemoryEffects) {
        try {
          prepareMemory(width, height);
          const identity = [s.seed, s.engine, s.secondaryEngine, s.ratio, s.colors.join(":")].join("/");
          if (memoryIdentity !== identity ||
              timeline.time < lastMemoryTime - .0001 ||
              timeline.colorTime < lastMemoryColorTime - .0001) memory.valid = false;
          memoryIdentity = identity;
          drawWithMemory = true;
        } catch (e) {
          // A device with inadequate texture/FBO support must retain the original artwork.
          memoryDisabled = true;
          releaseMemory();
          console.warn("Frame-memory effects disabled; using original art renderer.", e);
        }
      } else if (memory) {
        memory.valid = false;
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, drawWithMemory ? memory.fbo : null);
      gl.viewport(0, 0, width, height);
      gl.useProgram(active.program);
      gl.uniform2f(loc("res"), width, height);
      gl.uniform1f(loc("time"), timeline.time);
      gl.uniform1f(loc("colorTime"), timeline.colorTime);
      gl.uniform1f(loc("seed"), s.seed % 1000000);
      gl.uniform1f(loc("seedHigh"), Math.floor(s.seed / 1000000));
      for (const k of [
        "complexity",
        "scale",
        "warp",
        "split",
        "scan",
        "grain",
        "glitch",
        "blend",
        "block",
        "pixel",
        "vignette",
        "phosphor",
        "dither",
        "riso",
        "windowCascade",
        "glitter",
        "broadcast",
        "misregister",
        "saturation",
        "contrast",
        "brightness",
        "colorOffset",
        "colorRepeat",
        "colorAmount",
        "hyperbolicFold",
        "fractalZoom",
        "juliaMix",
        "quasiDensity",
        "motionAmount",
        "motionRate",
        "lightMotion",
        "bioAmount",
        "bioVeins",
        "wiggleAmount", "wiggleDepth", "wiggleSpeed", "wiggleLayers",
        "stereoAmount",
        "stereoDepth",
        "stereoParallax",
        "stereoMorph",
        "stereoGlow",
        "stereoWiggle",
        "stereoQuality",
        "filmAmount", "filmThickness", "opalAmount", "prismAmount",
        "foilRelief", "foilMotion", "letteringAmount", "letteringScale",
        "letteringWarp", "letteringMotion",
        "compositionAmount","compositionScale","compositionFeather",
        "compositionMotion","compositionColorShift","compositionVariation",
        "backdropAmount","backdropDepth","backdropDensity","backdropMotion",
        "backdropGlow","backdropHue","backdropVariation",
        "microAmount","microScale","microMotion","microRelief",
        "microDensity","microHue","microVariation",
        "filamentAmount","filamentScale","filamentMotion","filamentDensity",
        "filamentWidth","filamentRelief","filamentHue","filamentVariation",
        "filamentCrossbreed","filamentInterlace","filamentTwist","filamentPhase",
        "filamentNap","filamentLuster","filamentBeads","filamentBeadSize","filamentSecondHue",
        "filamentStitchAmount","filamentStitchSpeed",
        "filamentStitchLength","filamentStitchGlow",
        "filamentSculptAmount","filamentSculptDepth","filamentSculptLight",
        "filamentSculptShadow","filamentSculptPuff",
        "underlayAmount","underlayScale","underlayDensity","underlayMotion",
        "underlayRelief","underlayHue","underlayContrast","underlayVariation",
        "photonAmount","photonScale","photonMotion","photonDensity",
        "photonRelief","photonHue","photonVariation",
        "substanceAmount","substanceScale","substanceMotion",
        "substanceRelief","substanceEdge","substanceHue","substanceVariation",
        "atmoAmount","atmoScale","atmoDensity","atmoMotion",
        "atmoGlow","atmoHue","atmoVariation",
        "atmoBAmount","atmoBScale","atmoBDensity","atmoBMotion",
        "atmoBGlow","atmoBHue","atmoBVariation",
        "atmoMaskScale","atmoMaskFeather","atmoMaskMotion","atmoMaskVariation",
        "colonyLifeAmount","colonyLifeSpeed","colonyFrontGlow","colonyCompetition",
        "tunnelTwist","tunnelDepth","tunnelRidges","tunnelPulse",
        "tunnelAperture","tunnelVariation",
      ])
        gl.uniform1f(loc(k), s[k] / 100);
      gl.uniform1f(loc("rotation"), (s.rotation * Math.PI) / 180);
      gl.uniform1f(loc("symmetry"), s.symmetry);
      for (const k of ["bloom", "posterize", "mirror", "invert"])
        gl.uniform1i(loc(k), s[k] ? 1 : 0);
      gl.uniform1i(
        loc("blendMode"),
        ["Mix", "Multiply", "Difference"].indexOf(s.blendMode),
      );
      gl.uniform1i(
        loc("colorMode"),
        ["Traveling wave", "Color canon", "Phase vortex"].indexOf(s.colorMode),
      );
      gl.uniform1i(loc("colorCount"), s.colors.length);
      // No framebuffer readbacks and no per-frame allocations. The same
      // normalized stamp geometry is used by preview and export renders.
      const planted=s.habitatStamps||[];
      const plantedCount=Math.min(16,planted.length);
      habitatBuffer.fill(0);
      for(let i=0;i<plantedCount;i++){
        const m=planted[i],j=i*4;
        habitatBuffer[j]=m.x;
        habitatBuffer[j+1]=m.y;
        habitatBuffer[j+2]=m.radius;
        habitatBuffer[j+3]=m.parent;
      }
      gl.uniform1i(loc("colonyLifeMode"),colonyLifeModes.indexOf(s.colonyLifeMode));
      gl.uniform1i(loc("habitatStampCount"),plantedCount);
      gl.uniform4fv(loc("habitatStamps[0]"),habitatBuffer);
      gl.uniform1i(loc("tunnelMode"), [
        "Infinite spiral","Conch cathedral","Braided wormhole",
        "Moiré throat","Living iris","Liquid vortex"
      ].indexOf(s.tunnelMode));
      gl.uniform1i(loc("microMode"), ["Living embroidery","Opal granulation",
        "Gel caustics","Point lace","Glass filaments","Crystalline cilia"].indexOf(s.microMode));
      gl.uniform1i(loc("photonSpecies"), photonSpecies.indexOf(s.photonSpecies));
      gl.uniform1i(loc("filamentSpecies"), filamentSpecies.indexOf(s.filamentSpecies));
      gl.uniform1i(loc("filamentSecondSpecies"), filamentSpecies.indexOf(s.filamentSecondSpecies));
      gl.uniform1i(loc("filamentMaterial"), filamentMaterials.indexOf(s.filamentMaterial));
      gl.uniform1i(loc("filamentSecondMaterial"), filamentMaterials.indexOf(s.filamentSecondMaterial));
      gl.uniform1i(loc("filamentStitchMode"), filamentStitchModes.indexOf(s.filamentStitchMode));
      gl.uniform1i(loc("filamentSculptMode"), filamentSculptModes.indexOf(s.filamentSculptMode));
      gl.uniform1i(loc("underlayMode"), underlayModes.indexOf(s.underlayMode));
      gl.uniform1i(loc("substanceMode"), [
        "CMY lithogenesis","Chromatophore reef",
        "Chitin interference","Conformal chromasoup"].indexOf(s.substanceMode));
      gl.uniform1i(loc("backdropMode"), ["Nebula veils","Cosmic pollen",
        "Caustic undercurrent","Ghost architecture","Phosphor jacquard",
        "Opal cell fog"].indexOf(s.backdropMode));
      gl.uniform1i(loc("compositionMode"), [
        "Iris portals","Braided ribbons","Cell colonies","Patchwork",
        "Orbital archipelagos","Woven windows"].indexOf(s.compositionMode));
      gl.uniform1f(loc("letteringX"),s.letteringX/100);
      gl.uniform1f(loc("letteringY"),s.letteringY/100);
      gl.uniform1f(loc("letteringRotation"),s.letteringRotation);
      gl.uniform1f(loc("letteringStretchX"),s.letteringStretchX/100);
      gl.uniform1f(loc("letteringStretchY"),s.letteringStretchY/100);
      gl.uniform1f(loc("letteringCurve"),s.letteringCurve/100);
      gl.uniform1i(loc("letteringStyle"), ["Neon bling","RGB split","Chrome foil","Void stencil","Custom ink","Holographic","Electric glow","Liquid candy","Ghost echo","Chromatic shimmer","Heatwave","Glitter ink","Prism pulse","Soft shadow"].indexOf(s.letteringStyle));
      gl.uniform1i(loc("letteringAvailable"), hasLettering ? 1 : 0);
      gl.uniform1i(loc("letteringTex"), 3);
      // Additional lettering layers are also composited outside WebGL.
      const extras=s.letteringLayers||[];
      gl.uniform1i(loc("letteringExtraCount"),extras.length);
      for(let i=0;i<2;i++){
        const layer=extras[i];
        const available=!!(layer&&layer.visible&&layer.text.trim()&&extraTypeTextures[i]&&extraTypeKeys[i]);
        gl.uniform1f(loc("letteringExtraVisible["+i+"]"),available?1:0);
        gl.uniform4f(loc("letteringExtraTransform["+i+"]"),
          (layer?.letteringX??50)/100,(layer?.letteringY??50)/100,
          layer?.letteringRotation??0,(layer?.letteringScale??48)/100);
        gl.uniform4f(loc("letteringExtraShape["+i+"]"),
          (layer?.letteringStretchX??100)/100,(layer?.letteringStretchY??100)/100,
          (layer?.letteringCurve??0)/100,(layer?.letteringAmount??0)/100);
        gl.uniform2f(loc("letteringExtraFX["+i+"]"),
          (layer?.letteringWarp??0)/100,(layer?.letteringMotion??0)/100);
        gl.uniform1i(loc("letteringExtraStyle["+i+"]"),
          ["Neon bling","RGB split","Chrome foil","Void stencil","Custom ink",
           "Holographic","Electric glow","Liquid candy","Ghost echo",
           "Chromatic shimmer","Heatwave","Glitter ink","Prism pulse","Soft shadow"].indexOf(layer?.letteringStyle));
        gl.activeTexture(gl.TEXTURE4+i);
        gl.bindTexture(gl.TEXTURE_2D,extraTypeTextures[i]);
        gl.uniform1i(loc(i===0?"letteringTexExtra0":"letteringTexExtra1"),4+i);
      }
      gl.activeTexture(gl.TEXTURE0);
      gl.uniform1i(loc("wiggleMode"), ["Flipbook", "Smooth orbit", "Hold left", "Hold right"].indexOf(s.wiggleMode));
      gl.uniform1i(loc("stereoShape"), ["Gyroid Cathedral", "Metaball Choir", "Opal Knot",
        "Crystal Lattice", "Ribbon Wormhole"].indexOf(s.stereoShape));
      gl.uniform1i(loc("motionMode"), ["Liquid flow", "Breathing", "Orbital", "Traveling waves", "Internal turbulence"].indexOf(s.motionMode));
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, hasBiology ? biologyTexture : emptyBioTexture);
      gl.uniform1i(loc("bioTex"), 2);
      gl.uniform1i(loc("bioAvailable"), hasBiology ? 1 : 0);
      gl.activeTexture(gl.TEXTURE0);
      const key = s.colors.join("");
      if (key !== active.paletteKey) {
        active.paletteKey = key;
        for (let i = 0; i < 12; i++)
          for (let j = 0; j < 3; j++)
            colorBuffer[i * 3 + j] =
              parseInt(
                s.colors[i % s.colors.length].slice(1 + j * 2, 3 + j * 2),
                16,
              ) / 255;
        gl.uniform3fv(loc("colors[0]"), colorBuffer);
      }
      marksBuffer.fill(0);
      shapeBuffer.fill(0);
      s.marks.forEach((m, i) => {
        marksBuffer.set([m.x, m.y, m.power, m.mode], i * 4);
        shapeBuffer.set([m.radius, m.angle], i * 2);
      });
      gl.uniform4fv(loc("marks[0]"), marksBuffer);
      gl.uniform2fv(loc("markShape[0]"), shapeBuffer);
      gl.uniform1i(loc("count"), s.marks.length);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (drawWithMemory) {
        try {
          compositeFeedback(s, timeline, width, height);
          lastMemoryTime = timeline.time;
          lastMemoryColorTime = timeline.colorTime;
        } catch (e) {
          // GPU failure cannot black out the art: redraw original output to the canvas.
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
          gl.viewport(0, 0, width, height);
          gl.useProgram(active.program);
          gl.drawArrays(gl.TRIANGLES, 0, 6);
          memoryDisabled = true;
          releaseMemory();
          console.warn("GPU frame-memory pass failed; using original renderer.", e);
        }
      }
      // Text is painted in the independent Canvas2D compositing layer, not WebGL.
      // This keeps Safari and AI Studio shader quirks from swallowing user's words.
      if (gl2) {
        if (fence) gl.deleteSync(fence);
        fence = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
      }
      return true;
    },
    resetBiology() {
      if (biology) {
        biology.reset();
        biology.advance(48, biologyFeed, biologyKill);
        biologyLastTime = null;
        biologyFraction = 0;
      }
    },
    resetFeedback() {
      if (memory) memory.valid = false;
      memoryIdentity = "";
      lastMemoryTime = lastMemoryColorTime = -Infinity;
    },
    destroy(release = false) {
      if (fence) gl.deleteSync(fence);
      releaseMemory();
      releaseBiology();
      releaseLettering();
      if(textOverlayProgram)gl.deleteProgram(textOverlayProgram);
      gl.deleteTexture(emptyBioTexture);
      if (memoryShader) gl.deleteProgram(memoryShader.program);
      memoryShader = null;
      programs.forEach((p) => gl.deleteProgram(p.program));
      programs.clear();
      gl.deleteBuffer(buffer);
      if (release) gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
export function previewDimensions(
  width,
  height,
  quality = "Balanced",
  autoScale = 1,
) {
  const budget =
    { Eco: 320000, Balanced: 800000, Sharp: 1800000, Auto: 800000 }[quality] ||
    800000;
  const dpr = Math.min(globalThis.devicePixelRatio || 1, 2),
    factor =
      Math.min(dpr, Math.sqrt(budget / Math.max(1, width * height))) *
      (quality === "Auto" ? autoScale : 1);
  return {
    width: Math.max(1, Math.round(width * factor)),
    height: Math.max(1, Math.round(height * factor)),
  };
}
