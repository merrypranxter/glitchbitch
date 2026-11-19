// Shader-vault reinterpretations, not pasted Three.js demos.
// Source influences:
// - shaderslop_designs/myspace_glitch/04-pixel-dither-halftone/klein-dither.js
// - shaderslop_designs/GLITCHY/05-psychedelic-glitch-art/prismatic-sigil-glass_20260624_011012.js
// - shaderslop_designs/GLITCHY/05-psychedelic-glitch-art/moire-dna.js
// Palette, timeline and brush deformation are supplied by Glitchbitch's normal engine.
export const strangeFieldsGLSL = `
float strangeSchottky(vec2 p){
  vec2 z=rotate(time*.09+seed*.00004)*p*.43;
  float crossings=0.,edge=2.;
  // Four overlapping inversion disks form a breathing Schottky-like limit set.
  // Explicit floors prevent singular inversions/NaNs on mobile GPUs.
  for(int i=0;i<8;i++){
    bool crossed=false;
    for(int j=0;j<4;j++){
      float fj=float(j),ang=fj*TAU*.25+.08*sin(time*.2+fj*1.7);
      vec2 center=.68*vec2(cos(ang),sin(ang));
      float radius=.65+.06*sin(time*.23+fj*1.1);
      vec2 d=z-center;
      float rr=max(dot(d,d),.0001);
      edge=min(edge,abs(sqrt(rr)-radius));
      if(!crossed && rr<radius*radius){
        z=clamp(center+d*(radius*radius/max(rr,.025)),vec2(-7.),vec2(7.));
        crossings+=1.;
        crossed=true;
      }
    }
    if(!crossed)break;
  }
  float lace=sin(atan(z.y,z.x)*(8.+floor(complexity*14.))
    +length(z)*(7.+warp*11.)-time*.54);
  float rings=sin(length(z)*(9.+complexity*15.)+time*.37);
  return crossings*.108+exp(-edge*(12.+warp*25.))*.43
    +lace*.23+rings*.19;
}
float strangeSigil(vec2 p){
  vec2 q=rotate(time*.08+seed*.00003)*p*.44;
  float radius=length(q),angle=atan(q.y,q.x);
  // Radial polygon SDFs: changing hexagon and triangle glass etchings.
  float hexAngle=mod(angle+PI/6.,TAU/6.)-PI/6.;
  float triAngle=mod(angle-time*.04+PI/3.,TAU/3.)-PI/3.;
  float hexR=.73*cos(PI/6.)/max(.25,cos(hexAngle));
  float triR=.46*cos(PI/3.)/max(.25,cos(triAngle));
  float h=abs(radius-hexR*(1.+.08*sin(time*.35+angle*5.)));
  float triangle=abs(radius-triR);
  float ring=abs(radius-(.88+.09*sin(angle*8.-time*.45)));
  float spokes=abs(sin(angle*(5.+floor(complexity*8.))+time*.25))
    *(.17+.08*sin(radius*19.-time));
  float etching=exp(-min(min(h,triangle),ring)*(25.+warp*34.));
  float iridescence=sin(radius*(18.+warp*18.)+
    sin(angle*6.+time*.35)*3.-time*.58);
  float folded=sin((q.x+sin(q.y*4.+time*.17)*.15)*18.)
    *cos((q.y+sin(q.x*3.-time*.21)*.12)*15.);
  return etching*.58+iridescence*.29+folded*.19
    +spokes*.31+sin(radius*11.-time*.3)*.12;
}
float strangeMoireDNA(vec2 p){
  vec2 q=rotate(time*.025)*p*.38;
  float radius=length(q),angle=atan(q.y,q.x);
  float petals=6.+floor(complexity*13.);
  float filaments=0.;
  // Three slightly detuned, counter-rotating rose gratings:
  // beating geometry changes organically rather than strobing.
  for(int i=0;i<3;i++){
    float fi=float(i);
    float phase=angle*(petals+fi*.17)
      +time*(.30+fi*.18)*(mod(fi,2.)<.5?1.:-1.);
    float petal=sin(phase)*radius*(.8+warp*.8);
    float ring=sin(radius*(29.+warp*26.)+petal*3.2
      +time*(.32-fi*.24)+fi*2.1);
    filaments+=ring*(.38-fi*.058);
  }
  float lattice=sin(q.x*(30.+complexity*25.)+time*.3)
    *sin(q.y*(29.+complexity*23.)-time*.25);
  float core=sin(radius*13.-time*.38+sin(angle*petals-time*.27)*2.);
  return filaments*.65+lattice*.20+core*.22;
}
float strangeField(vec2 p,int kind){
  if(kind==17)return strangeSchottky(p);
  if(kind==18)return strangeSigil(p);
  if(kind==19)return strangeMoireDNA(p);
  return 0.;
}
`;
