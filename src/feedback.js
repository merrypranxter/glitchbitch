// Stateful, optional previous-frame renderer. No external textures or services.
export const feedbackVertex = `attribute vec2 position;
varying vec2 texUV;
void main() { texUV = (position + 1.0) * 0.5; gl_Position = vec4(position, 0., 1.); }`;
export const feedbackFragment = `precision highp float;
varying vec2 texUV;
uniform sampler2D sceneTex, historyTex;
uniform vec2 resolution;
uniform float time, seed, afterimage, datamosh, memoryDrift, memoryDecay, hasMemory;
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
