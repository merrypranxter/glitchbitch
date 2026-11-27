// Stateful, optional previous-frame renderer. No external textures or services.
export const feedbackVertex = `attribute vec2 position;
varying vec2 texUV;
void main() { texUV = (position + 1.0) * 0.5; gl_Position = vec4(position, 0., 1.); }`;
export const feedbackFragment = `precision highp float;
varying vec2 texUV;
uniform sampler2D sceneTex, historyTex;
uniform vec2 resolution;
uniform float time, seed, afterimage, datamosh, memoryDrift, memoryDecay, hasMemory;
uniform float topperTime,topperTimeDensity,topperTimeScale,topperTimeMotion,topperTimeHold,topperTimeSlip,topperTimeForm,topperTimeChroma;
float grainHash(vec2 p) { return fract(sin(dot(p,vec2(127.1,311.7)) + seed * .0001) * 43758.5453); }
void main() {
  vec2 uv = texUV;
  vec3 fresh = texture2D(sceneTex, uv).rgb;
  vec2 cells = floor(uv * vec2(26.0 * resolution.x / resolution.y, 26.0));
  float n = grainHash(cells + vec2(floor(time * 2.2), 7.0));
  float corruption = datamosh * smoothstep(.32, .91, n);
  vec2 velocity = vec2(sin(uv.y * 12.0 + time * .63), cos(uv.x * 9.0 - time * .38));
  vec2 blockSlip = vec2(grainHash(cells + 11.0) - .5, grainHash(cells + 37.0) - .5);
  vec2 historyUV = clamp(uv - velocity * memoryDrift * .015 - corruption * blockSlip * .075, .001, .999);
  vec3 past = texture2D(historyTex, historyUV).rgb;
  float persistence = clamp((afterimage * .89 + corruption * .85) * (1.0 - memoryDecay * .57), 0.0, .955) * hasMemory;
  vec3 mixed = mix(fresh, past, persistence);
  // Corrupted blocks can inherit chroma from older frames without producing full-width band seams.
  vec3 slipped = vec3(past.r, mixed.g, past.b);
  mixed = mix(mixed, slipped, corruption * .23 * hasMemory);
  if(topperTime>.001 && hasMemory>.5){
    vec2 q=uv*mix(5.,24.,topperTimeScale)*vec2(resolution.x/resolution.y,1.);
    vec2 cell=floor(q), p=fract(q)-.5;
    float h=grainHash(cell+vec2(219.,37.));
    if(h<mix(.025,.35,topperTimeDensity)){
      float form=floor(min(topperTimeForm,.999)*3.);
      float dist=max(abs(p.x)*.65,abs(p.y)*2.);
      if(form>.5)dist=length(p);
      if(form>1.5)dist=abs(p.x)+abs(p.y);
      float mask=1.-smoothstep(.23,.29,dist);
      float t=time*topperTimeMotion*.4;
      vec2 shift=topperTimeSlip*.06*vec2(sin(h*6.283+t),cos(h*6.283+t));
      vec3 old=texture2D(historyTex,clamp(uv+shift,.001,.999)).rgb;
      float pulse=.8+.2*sin(t+h*6.283);
      old=mix(old,vec3(old.r,fresh.g,old.b),topperTimeChroma);
      mixed=mix(mixed,old,mask*topperTime*mix(.2,.97,topperTimeHold)*pulse);
    }
  }
  gl_FragColor = vec4(clamp(mixed, 0.0, 1.0), 1.0);
}`;


// Fullscreen presentation pass for ping-pong feedback. Unlike copying the
// browser's default framebuffer back into a texture, both history writes
// happen in explicit, complete GPU framebuffers (works on WebGL1 and WebGL2).
export const feedbackDisplayFragment = `precision highp float;
varying vec2 texUV;
uniform sampler2D outputTex;
void main() {
  gl_FragColor = texture2D(outputTex, texUV);
}`;
