// Wave 2: independent post-composite refractive pass.
// Inputs are the ACTUAL final artwork texture, not a recolored approximation.
// Owns one full-resolution buffer ONLY when no feedback texture is available.
import {schlierenFragment,schlierenModes,glassEtchingModes,glassMotionModes,glassCouplingModes,glassCouplingRules,glassMaterialModes,glassTransportModes} from "./schlieren-glass.js";

export function createSchlierenPass({gl,gl2,vertex,compile,createTexture,assertGl}){
  let buffer=null,program=null;
  const uniforms=new Map();
  function releaseBuffer(){
    if(!buffer)return;
    gl.deleteTexture(buffer.texture);
    gl.deleteFramebuffer(buffer.framebuffer);
    buffer=null;
  }
  function prepareBuffer(w,h){
    if(buffer&&buffer.width===w&&buffer.height===h)return buffer;
    releaseBuffer();
    let texture=null,framebuffer=null;
    try{
      gl.activeTexture(gl.TEXTURE0);
      texture=createTexture(w,h);
      framebuffer=gl.createFramebuffer();
      if(!framebuffer)throw Error("Schlieren framebuffer allocation failed.");
      gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,texture,0);
      if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)
        throw Error("Schlieren pixel-source buffer incomplete.");
      assertGl("Schlieren texture allocation failed");
      buffer={texture,framebuffer,width:w,height:h};
      return buffer;
    }catch(error){
      if(texture)gl.deleteTexture(texture);
      if(framebuffer)gl.deleteFramebuffer(framebuffer);
      throw error;
    }finally{
      gl.bindFramebuffer(gl.FRAMEBUFFER,null);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D,null);
    }
  }
  function getProgram(){
    if(program)return program;
    const vs=gl2?"#version 300 es\n"+vertex.replace("attribute vec2","in vec2"):vertex;
    const fs=gl2?"#version 300 es\n"+schlierenFragment
      .replace("precision highp float;","precision highp float;\nout vec4 fragColor;")
      .replaceAll("gl_FragColor","fragColor")
      .replaceAll("texture2D(","texture("):schlierenFragment;
    let vert=null,frag=null,p=null;
    try{
      vert=compile(gl.VERTEX_SHADER,vs);
      frag=compile(gl.FRAGMENT_SHADER,fs);
      p=gl.createProgram();
      if(!p)throw Error("Schlieren program allocation failed.");
      gl.attachShader(p,vert);
      gl.attachShader(p,frag);
      gl.bindAttribLocation(p,0,"position");
      gl.linkProgram(p);
      if(!gl.getProgramParameter(p,gl.LINK_STATUS))
        throw Error(gl.getProgramInfoLog(p)||"Schlieren shader link failed.");
      program=p;
      return program;
    }catch(error){
      if(p)gl.deleteProgram(p);
      throw error;
    }finally{
      if(vert)gl.deleteShader(vert);
      if(frag)gl.deleteShader(frag);
    }
  }
  function present(texture,state,timeline,w,h){
    const shader=getProgram();
    const loc=name=>{
      if(!uniforms.has(name))uniforms.set(name,gl.getUniformLocation(shader,name));
      return uniforms.get(name);
    };
    gl.bindFramebuffer(gl.FRAMEBUFFER,null);
    gl.viewport(0,0,w,h);
    gl.useProgram(shader);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D,texture);
    try{
      gl.uniform1i(loc("artTex"),0);
      gl.uniform2f(loc("resolution"),w,h);
      gl.uniform1f(loc("time"),timeline.time);
      gl.uniform1i(loc("glassMode"),Math.max(0,schlierenModes.indexOf(state.schlierenMode)));
      gl.uniform1i(loc("glassEtching"),Math.max(0,glassEtchingModes.indexOf(state.schlierenEtching)));
      gl.uniform1i(loc("glassKinetics"),Math.max(0,glassMotionModes.indexOf(state.schlierenKinetics)));
      gl.uniform1i(loc("glassCoupling"),Math.max(0,glassCouplingModes.indexOf(state.schlierenCoupling)));
      gl.uniform1i(loc("glassCouplingRule"),Math.max(0,glassCouplingRules.indexOf(state.schlierenCouplingRule)));
      gl.uniform1i(loc("glassMaterial"),Math.max(0,glassMaterialModes.indexOf(state.schlierenMaterial)));
      gl.uniform1i(loc("glassTransport"),Math.max(0,glassTransportModes.indexOf(state.schlierenTransport)));
      const parameters=[
        ["glassAmount","schlierenAmount"],
        ["glassScale","schlierenScale"],
        ["glassBend","schlierenBend"],
        ["glassMotion","schlierenMotion"],
        ["glassDispersion","schlierenDispersion"],
        ["glassRim","schlierenRim"],
        ["glassRipple","schlierenRipple"],
        ["glassVariation","schlierenVariation"],
        ["glassMask","schlierenMask"],
        ["glassFocus","schlierenFocus"],["glassStructure","schlierenStructure"],["glassDetail","schlierenDetail"],["glassCaustics","schlierenCaustics"],["glassLayerAmount","schlierenLayerAmount"],["glassLayerAngle","schlierenLayerAngle"],["glassLayerRatio","schlierenLayerRatio"],["glassMaterialAmount","schlierenMaterialAmount"],["glassFilmThickness","schlierenFilmThickness"],["glassMicrograin","schlierenMicrograin"],["glassPolish","schlierenPolish"],["glassTransportAmount","schlierenTransportAmount"],["glassLightFocus","schlierenLightFocus"],["glassLightSharpness","schlierenLightSharpness"],["glassOpticalShadow","schlierenOpticalShadow"]
      ];
      for(const [name,key] of parameters)gl.uniform1f(loc(name),(state[key]??0)/100);
      gl.drawArrays(gl.TRIANGLES,0,6);
      assertGl("Schlieren refraction draw failed");
    }finally{
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D,null);
    }
  }
  function destroy(){
    releaseBuffer();
    if(program)gl.deleteProgram(program);
    program=null;uniforms.clear();
  }
  return {prepareBuffer,present,releaseBuffer,destroy};
}
