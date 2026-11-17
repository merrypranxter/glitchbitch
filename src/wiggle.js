// Lightweight 2D wiggle stereoscopy. Disparity is derived from stable
// pseudo-depth planes, not true binocular scene geometry or an RGB channel split.
// Background and text remain anchored in the surrounding renderer.
export const wiggleGLSL = `
uniform float wiggleAmount,wiggleDepth,wiggleSpeed,wiggleLayers;
uniform int wiggleMode;
float wiggleEye() {
  if(wiggleMode==2) return -1.; // Inspect left eye.
  if(wiggleMode==3) return 1.;  // Inspect right eye.
  float phase=time*TAU*(.65+wiggleSpeed*1.65);
  if(wiggleMode==1) return sin(phase); // Smooth orbit.
  return sin(phase)>=0. ? 1. : -1.;   // Two discrete flipbook views.
}
vec2 wiggleCoordinates(vec2 p) {
  float density=.36+wiggleLayers*.93;
  float granular=noise(p*density+vec2(3.71,9.19));
  float bands=.5+.5*sin(p.x*(.5+wiggleLayers*1.2)+p.y*.67
                       +.34*sin(p.y*1.7));
  float depth=clamp(mix(granular,bands,.3),0.,.999);
  float planeCount=2.+floor(wiggleLayers*6.);
  float stepped=floor(depth*planeCount)/max(1.,planeCount-1.);
  depth=mix(depth,stepped,wiggleLayers*.68);
  float nearFactor=smoothstep(.1,.91,depth);
  float disparity=mix(.025,.23,wiggleDepth)*wiggleAmount;
  float offset=wiggleEye()*disparity*mix(.10,1.,nearFactor);
  return p+vec2(offset,offset*.018*(nearFactor-.5));
}
`;
