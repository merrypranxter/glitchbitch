import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {feedbackVertex,feedbackFragment,feedbackDisplayFragment} from "../src/feedback.js";
const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");

function makeFakeGL(){
  let id=0, boundFbo=null, activeUnit=0, program=null, error=0;
  const textures=new Map(), attachments=new Map(), bindings=new Map();
  const calls=[], uniforms=new Map(), deleted=[];
  const gl={
    TEXTURE0:1000,TEXTURE1:1001,TEXTURE_2D:100, FRAMEBUFFER:200,
    COLOR_ATTACHMENT0:201,FRAMEBUFFER_COMPLETE:202,
    RGBA:203,UNSIGNED_BYTE:204,LINEAR:205,CLAMP_TO_EDGE:206,
    TEXTURE_MIN_FILTER:207,TEXTURE_MAG_FILTER:208,TEXTURE_WRAP_S:209,
    TEXTURE_WRAP_T:210,VERTEX_SHADER:301,FRAGMENT_SHADER:302,
    LINK_STATUS:303,TRIANGLES:304,NO_ERROR:0,
    createTexture(){const t={id:++id,kind:"texture"};textures.set(t.id,t);return t;},
    deleteTexture(t){deleted.push(t);},
    activeTexture(unit){activeUnit=unit-gl.TEXTURE0;},
    bindTexture(target,tex){bindings.set(activeUnit,tex);},
    texParameteri(){},texImage2D(){},
    createFramebuffer(){return {id:++id,kind:"fbo"};},
    deleteFramebuffer(fbo){deleted.push(fbo);},
    bindFramebuffer(target,fbo){boundFbo=fbo;},
    framebufferTexture2D(target,attachment,textarget,tex){
      attachments.set(boundFbo?.id,tex);
      calls.push(["attach",boundFbo?.id,tex?.id]);
    },
    checkFramebufferStatus(){return gl.FRAMEBUFFER_COMPLETE;},
    createProgram(){return {id:++id,kind:"program"};},
    deleteProgram(program){deleted.push(program);},
    attachShader(){},deleteShader(){},bindAttribLocation(){},linkProgram(){},
    getProgramParameter(){return true;},getProgramInfoLog(){return "";},
    getUniformLocation(p,name){return name;},
    useProgram(p){program=p;},
    uniform1i(loc,value){uniforms.set(loc,value);},
    uniform1f(loc,value){uniforms.set(loc,value);},
    uniform2f(loc,a,b){uniforms.set(loc,[a,b]);},
    viewport(){},
    drawArrays(){
      const target=attachments.get(boundFbo?.id);
      // If a render target is simultaneously sampled, real WebGL has an
      // undefined read/write feedback loop. The new code must prevent it.
      if(target && [...bindings.values()].includes(target))
        throw Error("read/write sampling hazard on texture "+target.id);
      calls.push(["draw",boundFbo?.id||"screen",target?.id||null,
        bindings.get(0)?.id||null,bindings.get(1)?.id||null,
        uniforms.get("hasMemory"),program?.id||null]);
    },
    getError(){const e=error;error=0;return e;},
  };
  return {gl,calls,attachments,bindings,deleted,forceError:(value)=>error=value};
}
function actualFeedbackMachine(fake,webgl2=false){
  const start=renderer.indexOf("  function releaseMemory() {");
  const end=renderer.indexOf("  function compile(type, source) {",start);
  assert.ok(start>0&&end>start);
  const source=renderer.slice(start,end);
  const compiled=[];
  // This is the actual renderer's allocation/compositing logic executed
  // with an instrumented GPU fake. It cannot certify a real Safari driver.
  const build=new Function("gl","gl2","feedbackVertex","feedbackFragment",
    "feedbackDisplayFragment","compile",
    `let memory=null,memoryShader=null,memoryIdentity="",lastMemoryTime=-Infinity,
      lastMemoryColorTime=-Infinity;
      ${source}
      return {prepareMemory,compositeFeedback,releaseMemory,
        reset:()=>{if(memory)memory.valid=false;},
        current:()=>memory,shader:()=>memoryShader};`);
  const machine=build(fake.gl,webgl2?fake.gl:null,feedbackVertex,
    feedbackFragment,feedbackDisplayFragment,
    (type,source)=>{compiled.push([type,source]);return {type,source};});
  return {...machine,compiled};
}
const sample={seed:4567,afterimage:80,datamosh:43,memoryDrift:32,memoryDecay:8};
const clock={time:2.1,colorTime:1.9};

test("GPU frame memory no longer copies browser default framebuffer",()=>{
  assert.doesNotMatch(renderer,/gl\\.copyTexSubImage2D\\(/);
  assert.match(renderer,/memory\\.history\\[writeIndex\\]/);
  assert.match(renderer,/memory\\.history\\[readIndex\\]/);
  assert.match(renderer,/memory\\.readIndex=writeIndex/);
  assert.match(renderer,/outputFbo/);
  assert.match(renderer,/gl\\.bindFramebuffer\\(gl\\.FRAMEBUFFER,null\\)/);
  assert.match(renderer,/assertMemoryGl\\("GPU source scene draw failed"\\)/);
  assert.match(renderer,/assertMemoryGl\\("GPU history composite draw failed"\\)/);
  assert.match(renderer,/assertMemoryGl\\("GPU history presentation draw failed"\\)/);
  assert.match(renderer,/if\\(exactEffects\\)throw artworkParityError\\("Frame-memory composite failed",e\\)/);
  assert.match(feedbackFragment,/uniform sampler2D sceneTex, historyTex/);
  assert.match(feedbackDisplayFragment,/uniform sampler2D outputTex/);
});

for(const webgl2 of [false,true]){
  test("real ping-pong logic does not sample its active target (WebGL"+
    (webgl2?"2":"1")+")",()=>{
    const fake=makeFakeGL();
    const machine=actualFeedbackMachine(fake,webgl2);
    machine.prepareMemory(64,64);
    const original=machine.current();
    assert.equal(original.history.length,2);
    assert.equal(original.valid,false);
    assert.equal(original.readIndex,0);
    for(let i=0;i<12;i++){
      machine.compositeFeedback(sample,{...clock,time:clock.time+i*.033},64,64);
      assert.equal(machine.current().valid,true);
      assert.equal(machine.current().readIndex,(i+1)%2);
    }
    const composited=fake.calls.filter(x=>x[0]==="draw"&&x[1]!=="screen");
    const presented=fake.calls.filter(x=>x[0]==="draw"&&x[1]==="screen");
    assert.equal(composited.length,12);
    assert.equal(presented.length,12);
    for(let i=0;i<12;i++){
      assert.notEqual(composited[i][2],composited[i][4],
        "history input and output must be different");
      assert.equal(presented[i][3],composited[i][2],
        "present the exact framebuffer composite, not an intermediate");
      assert.equal(composited[i][5],i===0?0:1);
    }
    const shader=machine.shader();
    assert.ok(shader.program);
    assert.ok(shader.displayProgram);
    assert.ok(machine.compiled.length>=4);
    if(webgl2){
      assert.ok(machine.compiled.every(([type,src])=>src.startsWith("#version 300 es")));
    }else{
      assert.ok(machine.compiled.every(([type,src])=>!src.startsWith("#version 300 es")));
    }
    machine.reset();
    assert.equal(machine.current().valid,false);
    machine.compositeFeedback(sample,clock,64,64);
    assert.equal(fake.calls.filter(x=>x[0]==="draw").at(-2)[5],0,
      "history resets without turning off the feedback shader");
    machine.prepareMemory(128,64);
    assert.equal(machine.current().width,128);
    assert.equal(machine.current().valid,false);
    assert.ok(fake.deleted.length>=5,
      "resize must delete old scene/history buffers and both FBOs");
    machine.releaseMemory();
    assert.equal(machine.current(),null);
  });
}

test("composite failure cannot advance history index or pretend it succeeded",()=>{
  const fake=makeFakeGL(),machine=actualFeedbackMachine(fake);
  machine.prepareMemory(32,32);
  const previous=machine.current().readIndex;
  fake.forceError(0x0502);
  assert.throws(()=>machine.compositeFeedback(sample,clock,32,32),
    /GPU history composite draw failed \\(WebGL 0x502\\)/);
  assert.equal(machine.current().readIndex,previous);
  assert.equal(machine.current().valid,false);
  assert.equal(fake.bindings.get(0),null);
  assert.equal(fake.bindings.get(1),null);
});

test("no other user effects or animation settings are altered by the fix",()=>{
  const exportSource=readFileSync(new URL("../src/export.js",import.meta.url),"utf8");
  assert.match(exportSource,/renderer = createRenderer\\(canvas,\\{exactEffects\\}\\)/);
  assert.match(exportSource,/await primeFrameHistory\\(renderer,state,timeline,size,signal\\)/);
  assert.match(exportSource,/renderer\\.readFrame\\(bytes\\)/);
  assert.match(renderer,/const hasMemoryEffects = \\(s.afterimage > 0 \\|\\| s.datamosh > 0\\)/);
});
