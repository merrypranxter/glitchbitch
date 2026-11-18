/**
 * FILAMENT FORGE — six procedural filament geometries.
 * True lines, stitches and crossings rather than a color/screen overlay.
 * All species run in WebGL 1.0 / WebGL2 fragment GLSL; they are selected
 * at program compile so inactive geometry does not burden iPhone GPUs.
 */
export const filamentSpecies = [
  "Fivefold brocade",
  "Poincaré crochet",
  "Truchet knotwork",
  "Voronoi lace",
  "Spiral appliqué",
  "Fractal veinwork",
];

export const filamentMaterials = [
  "Original thread",
  "Iridescent silk",
  "Molten chrome",
  "Opaline glass",
  "Velvet flock",
  "Electroluminescent yarn",
];

export const filamentMaterialControls=[
  "filamentNap","filamentLuster","filamentBeads","filamentBeadSize",
  "filamentSecondHue"
];

export function remixFilamentMaterials(state,rng=Math.random){
  const pick=old=>{
    const possibilities=filamentMaterials.filter(x=>x!==old);
    const number=Number(rng());
    return possibilities[Math.floor(Math.max(0,Math.min(.999999,Number.isFinite(number)?number:0))*possibilities.length)];
  };
  return {...state,filamentMaterial:pick(state.filamentMaterial),
    filamentSecondMaterial:pick(state.filamentSecondMaterial),
    filamentNap:Math.max(10,Math.min(100,Number(rng())*100||0)),
    filamentLuster:35+Math.min(.999999,Math.max(0,Number(rng())||0))*65,
    filamentBeads:Math.min(100,Math.max(0,Number(rng())*100||0)),
    filamentAmount:Math.max(50,state.filamentAmount||0)};
}

export const filamentMaterialPresets=[
  {name:"Silk cathedral",filamentMaterial:"Iridescent silk",
    filamentSecondMaterial:"Molten chrome",filamentNap:16,
    filamentLuster:85,filamentBeads:8,filamentBeadSize:32,filamentSecondHue:28},
  {name:"Mercury embroidery",filamentMaterial:"Molten chrome",
    filamentSecondMaterial:"Opaline glass",filamentNap:3,
    filamentLuster:98,filamentBeads:24,filamentBeadSize:58,filamentSecondHue:36},
  {name:"Opal spiderweb",filamentMaterial:"Opaline glass",
    filamentSecondMaterial:"Iridescent silk",filamentNap:18,
    filamentLuster:94,filamentBeads:53,filamentBeadSize:64,filamentSecondHue:47},
  {name:"Feral velvet tapestry",filamentMaterial:"Velvet flock",
    filamentSecondMaterial:"Iridescent silk",filamentNap:93,
    filamentLuster:23,filamentBeads:7,filamentBeadSize:34,filamentSecondHue:18},
  {name:"Electric nerve fiber",filamentMaterial:"Electroluminescent yarn",
    filamentSecondMaterial:"Molten chrome",filamentNap:32,
    filamentLuster:91,filamentBeads:33,filamentBeadSize:48,filamentSecondHue:72},
  {name:"Alien seed-bead couture",filamentMaterial:"Iridescent silk",
    filamentSecondMaterial:"Opaline glass",filamentNap:10,
    filamentLuster:96,filamentBeads:99,filamentBeadSize:82,filamentSecondHue:62}
];

export function applyFilamentMaterialPreset(state,name){
  const preset=filamentMaterialPresets.find(p=>p.name===name);
  if(!preset)return state;
  const {name:label,...material}=preset;
  // Material presets don't change an existing geometry, palette, quote,
  // second parent, crossbreed amount, or anything else in the artwork.
  return {...state,...material,filamentAmount:Math.max(50,state.filamentAmount||0)};
}

export const filamentControls = [
  "filamentAmount","filamentScale","filamentDensity","filamentMotion",
  "filamentWidth","filamentRelief","filamentHue","filamentVariation",
];

export const filamentPresets = [
  {name:"Alien bridal lace",species:"Fivefold brocade",
    filamentAmount:94,filamentScale:47,filamentDensity:75,filamentMotion:31,
    filamentWidth:31,filamentRelief:77,filamentHue:62,filamentVariation:13},
  {name:"Crochet in impossible space",species:"Poincaré crochet",
    filamentAmount:93,filamentScale:54,filamentDensity:64,filamentMotion:41,
    filamentWidth:29,filamentRelief:92,filamentHue:24,filamentVariation:48},
  {name:"Witch's woven circuitry",species:"Truchet knotwork",
    filamentAmount:90,filamentScale:59,filamentDensity:67,filamentMotion:39,
    filamentWidth:42,filamentRelief:87,filamentHue:84,filamentVariation:71},
  {name:"Cellular heirloom",species:"Voronoi lace",
    filamentAmount:88,filamentScale:69,filamentDensity:73,filamentMotion:55,
    filamentWidth:33,filamentRelief:72,filamentHue:35,filamentVariation:38},
  {name:"Spiral organ embroidery",species:"Spiral appliqué",
    filamentAmount:92,filamentScale:50,filamentDensity:72,filamentMotion:61,
    filamentWidth:34,filamentRelief:83,filamentHue:52,filamentVariation:29},
  {name:"Bioluminescent needlework",species:"Fractal veinwork",
    filamentAmount:95,filamentScale:65,filamentDensity:79,filamentMotion:68,
    filamentWidth:29,filamentRelief:81,filamentHue:73,filamentVariation:91},
];

export function applyFilamentPreset(state,name){
  const recipe=filamentPresets.find(p=>p.name===name);
  if(!recipe)return state;
  const {name:unused,species,...controls}=recipe;
  return {...state,filamentSpecies:species,...controls,filamentCrossbreed:0};
}

export function nextFilamentSpecies(state,rng=Math.random){
  const others=filamentSpecies.filter(x=>x!==state.filamentSpecies);
  const v=Number(rng());
  const index=Math.min(others.length-1,Math.max(0,Math.floor((Number.isFinite(v)?v:0)*others.length)));
  return {...state,filamentSpecies:others[index],filamentAmount:Math.max(55,state.filamentAmount||0)};
}

/** Two parents produce one optical fabric; no base-art parameters are touched. */
export const filamentHybridPresets = [
  {name:"Cathedral circuit lace",first:"Poincaré crochet",second:"Truchet knotwork",
    filamentAmount:94,filamentCrossbreed:88,filamentInterlace:80,filamentTwist:12,filamentPhase:23},
  {name:"Quasicrystal cell garden",first:"Fivefold brocade",second:"Voronoi lace",
    filamentAmount:95,filamentCrossbreed:82,filamentInterlace:74,filamentTwist:21,filamentPhase:44},
  {name:"Living nervous embroidery",first:"Fractal veinwork",second:"Spiral appliqué",
    filamentAmount:91,filamentCrossbreed:90,filamentInterlace:63,filamentTwist:43,filamentPhase:76},
  {name:"Alien bridal knot",first:"Truchet knotwork",second:"Fivefold brocade",
    filamentAmount:92,filamentCrossbreed:77,filamentInterlace:93,filamentTwist:33,filamentPhase:55},
  {name:"Psychedelic cellular crochet",first:"Voronoi lace",second:"Poincaré crochet",
    filamentAmount:89,filamentCrossbreed:85,filamentInterlace:87,filamentTwist:14,filamentPhase:68},
  {name:"Spiral crown mycelium",first:"Spiral appliqué",second:"Fractal veinwork",
    filamentAmount:96,filamentCrossbreed:91,filamentInterlace:51,filamentTwist:62,filamentPhase:37},
];
export const filamentHybridControls=[
  "filamentCrossbreed","filamentInterlace","filamentTwist","filamentPhase"
];
export function applyFilamentHybrid(state,name){
 const p=filamentHybridPresets.find(x=>x.name===name);
 if(!p)return state;
 const {name:label,first,second,...controls}=p;
 return {...state,filamentSpecies:first,filamentSecondSpecies:second,...controls};
}
export function breedFilaments(state,rng=Math.random){
 const unit=()=>{const n=Number(rng());return Number.isFinite(n)?Math.max(0,Math.min(.999999,n)):0;};
 const choices=filamentSpecies.filter(x=>x!==state.filamentSpecies);
 const first=choices[Math.floor(unit()*choices.length)];
 const other=filamentSpecies.filter(x=>x!==first);
 const second=other[Math.floor(unit()*other.length)];
 return {...state,filamentSpecies:first,filamentSecondSpecies:second,
   filamentAmount:Math.max(55,state.filamentAmount||0),
   filamentCrossbreed:52+unit()*46,filamentInterlace:34+unit()*64,
   filamentTwist:unit()*100,filamentPhase:unit()*100};
}

/**
 * SELF-WEAVING LOOM — deterministic procedural stitch sequencing.
 * The stitch reveal is driven by the same render clock in preview, PNG,
 * GIF and MP4. No accumulated GPU state, feedback textures or random
 * state can drift between captures.
 */
export const filamentStitchModes=[
  "Needle chase",
  "Loom sweep",
  "Running stitch",
  "Purl breathing",
  "Unfurl & resew",
];
export const filamentStitchControls=[
  "filamentStitchAmount","filamentStitchSpeed",
  "filamentStitchLength","filamentStitchGlow"
];
export const filamentStitchPresets=[
  {name:"Electric needle chase",filamentStitchMode:"Needle chase",
    filamentStitchAmount:92,filamentStitchSpeed:62,
    filamentStitchLength:31,filamentStitchGlow:95},
  {name:"Witch's loom shuttle",filamentStitchMode:"Loom sweep",
    filamentStitchAmount:94,filamentStitchSpeed:43,
    filamentStitchLength:44,filamentStitchGlow:70},
  {name:"Running stitch pulse",filamentStitchMode:"Running stitch",
    filamentStitchAmount:89,filamentStitchSpeed:77,
    filamentStitchLength:61,filamentStitchGlow:81},
  {name:"Velvet breathing lattice",filamentStitchMode:"Purl breathing",
    filamentStitchAmount:84,filamentStitchSpeed:36,
    filamentStitchLength:73,filamentStitchGlow:61},
  {name:"Unfurl the impossible",filamentStitchMode:"Unfurl & resew",
    filamentStitchAmount:97,filamentStitchSpeed:47,
    filamentStitchLength:55,filamentStitchGlow:91}
];
export function applyFilamentStitchPreset(state,name){
 const preset=filamentStitchPresets.find(p=>p.name===name);
 if(!preset)return state;
 const {name:label,...stitch}=preset;
 return {...state,...stitch,filamentAmount:Math.max(55,state.filamentAmount||0)};
}
export function stopFilamentStitching(state){
 return {...state,filamentStitchAmount:0};
}

export const filamentGLSL = `
// Independent structural geometry with stitched, shaded filament ribbons.
uniform int filamentSpecies;
uniform int filamentSecondSpecies;
uniform int filamentMaterial,filamentSecondMaterial;
uniform int filamentStitchMode;
uniform float filamentStitchAmount,filamentStitchSpeed;
uniform float filamentStitchLength,filamentStitchGlow;
uniform float filamentNap,filamentLuster,filamentBeads,filamentBeadSize,filamentSecondHue;
uniform float filamentCrossbreed,filamentInterlace,filamentTwist,filamentPhase;
uniform float filamentAmount,filamentScale,filamentDensity,filamentMotion;
uniform float filamentWidth,filamentRelief,filamentHue,filamentVariation;

vec3 filamentField(vec3 background,vec2 uv,vec2 fieldP,float fieldV,
    int species,int fiberMaterial,float phaseOffset,float twist,float hueOffset,
    out float maskCore){
  float t=time*(.14+filamentMotion*.72)+phaseOffset;
  float ct=colorTime*.12+phaseOffset*.18;
  float freq=3.0+filamentScale*11.0;
  // Artboard UVs are aspect-correct and do not inherit the base engine's
  // kaleidoscope warp. The field modulates color and local movement instead.
  vec2 aspect=vec2(res.x/res.y,1.0);
  vec2 centered=(uv-.5)*aspect;
  vec2 rotated=mat2(cos(twist),-sin(twist),sin(twist),cos(twist))*centered;
  vec2 localUV=.5+rotated/aspect;
  vec2 q=rotated*freq;
  q+=.14*filamentMotion*vec2(sin(q.y*.81+t*.53),cos(q.x*.93-t*.44));
  float density=filamentDensity;
  float seedPhase=filamentVariation*6.28318+seed*.000013+phaseOffset*.61;
  float threadD=1.0,phase=0.0,mask=1.0,highlight=0.0;
  if(species==0){
    // Two five-axis quasiperiodic thread families, never a repeating tile.
    float a=0.0,b=0.0;
    for(int i=0;i<5;i++){
      float fi=float(i);
      float angle=fi*1.256637;
      vec2 axis=vec2(cos(angle),sin(angle));
      float w=dot(q,axis)*(1.4+density*2.7);
      a+=sin(w+t*.19*sin(fi*2.27)+seedPhase*.41);
      b+=cos(w*1.61803-t*.23+fi*1.8+seedPhase*.12);
    }
    a*=.2;b*=.2;
    threadD=min(abs(sin(a*(8.0+density*11.0)+fieldV*.27)),
                abs(sin(b*(8.0+density*9.0)-fieldV*.2)));
    threadD*=.095;
    phase=a*2.4+b*1.8;
    highlight=.5+.5*sin(a*10.0+b*9.0+t*.6);
  }else if(species==1){
    // Poincaré-disk metric: rings contract visually toward the boundary.
    vec2 z=(localUV-.5)*vec2(res.x/res.y,1.0)*(1.25+filamentScale*1.05);
    z+=.065*filamentMotion*vec2(sin(t*.36),cos(t*.32));
    float r=length(z);
    float safeR=min(r,.978);
    float h=log((1.0+safeR)/(1.0-safeR));
    float a=atan(z.y,z.x);
    float sectors=5.0+floor(density*13.0);
    float radial=h*(3.0+density*6.0)-t*.46;
    float lace=sin(a*sectors+radial*.28+seedPhase);
    threadD=min(abs(sin(radial+lace*1.4)),abs(sin(a*sectors+sin(radial*.75))));
    threadD*=.075;
    mask=1.0-smoothstep(.82,.975,r);
    phase=radial*.19+a*.7;
    highlight=.5+.5*cos(radial*.8-a*sectors*.4);
  }else if(species==2){
    // Two arc threads through each deterministic Truchet tile.
    vec2 stitchQ=q*(.72+density*1.35);
    vec2 cell=floor(stitchQ),local=fract(stitchQ);
    float flip=step(.5,hash(cell+seedPhase));
    vec2 cornerA=mix(vec2(0.0,0.0),vec2(1.0,0.0),flip);
    vec2 cornerB=mix(vec2(1.0,1.0),vec2(0.0,1.0),flip);
    // Fixed half-tile arc radius keeps both ends meeting precisely at cell
    // boundaries. Motion happens in the continuous coordinate warp above.
    float radius=.5;
    float arcA=abs(length(local-cornerA)-radius);
    float arcB=abs(length(local-cornerB)-radius);
    threadD=min(arcA,arcB);
    // Faint parallel seams preserve the woven-thread character.
    threadD=min(threadD,abs(min(arcA,arcB)-.12)*.73);
    phase=hash(cell)*1.3+local.x*.4+local.y*.3;
    highlight=.5+.5*cos((local.x+local.y)*6.28+t*.54);
  }else if(species==3){
    // Moving Voronoi stitch boundaries, plus a small stitched rosette in cells.
    vec2 cell=floor(q),local=fract(q);
    float nearD=5.0,secondD=5.0,chosen=0.0;
    for(int j=-1;j<=1;j++){
      for(int i=-1;i<=1;i++){
        vec2 id=cell+vec2(float(i),float(j));
        float h=hash(id+seedPhase);
        vec2 center=vec2(float(i),float(j))+.5+
          .2*filamentMotion*vec2(sin(t*.45+h*6.283),cos(t*.38+h*6.283));
        float dist=length(local-center);
        if(dist<nearD){secondD=nearD;nearD=dist;chosen=h;}
        else secondD=min(secondD,dist);
      }
    }
    float border=max(0.0,secondD-nearD);
    float beaded=abs(sin(nearD*(10.0+density*15.0)+t*.44+chosen*6.28))*.12;
    threadD=min(border*.53,beaded+.018);
    phase=chosen+nearD*.62+fieldV*.13;
    highlight=.5+.5*cos(nearD*13.0+t*.43);
  }else if(species==4){
    // Independent logarithmic curls inside repeatable embroidery hoops.
    vec2 cell=floor(q),local=fract(q)-.5;
    float rand=hash(cell+seedPhase);
    vec2 z=local+.06*filamentMotion*vec2(sin(t*.43+rand*6.28),cos(t*.39+rand*6.28));
    float radius=length(z);
    float angle=atan(z.y,z.x);
    float spirals=3.0+floor(density*5.0);
    float spin=angle*spirals-radius*(29.0+density*35.0)+t*.62+rand*6.28;
    threadD=abs(sin(spin))*.095;
    mask=1.0-smoothstep(.39,.62,radius);
    phase=rand+angle*.17-radius*2.0;
    highlight=.5+.5*cos(spin*.33);
  }else{
    // Self-similar branching contour pairs; no data texture or recursion.
    vec2 z=q*.76;
    float f=0.0,g=0.0;
    float amp=.55;
    for(int i=0;i<3;i++){
      f+=amp*sin(z.y*(1.3+density*1.9)+sin(z.x*1.2+t*.29)*1.4);
      g+=amp*cos(z.x*(1.4+density*1.8)-sin(z.y*.96-t*.26)*1.2);
      z=mat2(.78,-.62,.62,.78)*z*1.93+vec2(1.13,-.78);
      amp*=.54;
    }
    threadD=min(abs(sin(f*(8.0+density*10.0)+fieldV*.48)),
                abs(cos(g*(9.0+density*9.0)-fieldV*.31)))*.092;
    phase=f*1.5+g*.95;
    highlight=.5+.5*sin((f+g)*8.0+t*.6);
  }
  // Signed-distance-like threads: sharp high-resolution core, wider translucent
  // halo and directional raised relief. The majority of pixels stay untouched.
  float aa=max(.005,1.2*freq/min(res.x,res.y));
  float width=.009+filamentWidth*.070;
  float core=(1.0-smoothstep(width,width+aa,threadD))*mask;
  maskCore=core;
  float halo=(1.0-smoothstep(width*2.0,width*5.5+aa,threadD))*mask;
  float edge=(1.0-smoothstep(width*.5,width*2.5+aa,abs(threadD-width*1.25)))*mask;
#ifdef FILAMENT_STITCHING
  // Continuous procedural arclength proxy. No sawtooth resets of accumulated
  // geometry: periodic moving windows fade at both ends of their stitch.
  // Secondary parent has its own phase offset and rotated thread coordinates.
  float sewClock=time*(.08+filamentStitchSpeed*1.12);
  float localProgress=phase*.27+q.x*.11+q.y*.07+
    seedPhase*.093+phaseOffset*.14;
  float span=mix(.055,.47,filamentStitchLength);
  float travel=fract(localProgress-sewClock);
  float movingWindow=smoothstep(.02,.105,travel)*
    (1.0-smoothstep(span,span+.09,travel));
  float visibleStitch=1.0;
  float needle=0.0;
  if(filamentStitchMode==0){ // Sharp migrating tip with short stitched tail.
    visibleStitch=.12+.88*movingWindow;
    needle=pow(clamp(1.0-abs(travel-.11)*10.0,0.0,1.0),2.0);
  }else if(filamentStitchMode==1){ // Wide shuttle crossing the cloth.
    float shuttle=fract(q.x*.093+q.y*.014-sewClock*.53+
      phaseOffset*.08+seedPhase*.031);
    visibleStitch=.08+.92*smoothstep(.025,.12,shuttle)*
      (1.0-smoothstep(.45+span*.67,.58+span*.67,shuttle));
    needle=pow(max(0.0,1.0-abs(shuttle-.13)*7.0),2.0);
  }else if(filamentStitchMode==2){ // Classic separated running stitches.
    float running=.5+.5*cos(6.2831853*travel);
    visibleStitch=.08+.92*smoothstep(.42,.68,running);
    needle=pow(running,14.0);
  }else if(filamentStitchMode==3){ // Thread loops inhale and exhale.
    float breathing=.5+.5*cos(6.2831853*travel);
    visibleStitch=.25+.75*breathing;
    needle=pow(breathing,7.0);
  }else{ // Complete fabric assembles from one edge and reverses smoothly.
    float build=.5+.5*cos(sewClock*.78+phaseOffset*.25);
    float position=clamp(uv.x+.065*sin(uv.y*11.0+seedPhase*.18),0.0,1.0);
    float reveal=1.0-smoothstep(build-.055,build+.055,position);
    visibleStitch=.05+.95*reveal;
    needle=pow(max(0.0,1.0-abs(position-build)*11.0),3.0);
  }
  // Apply to all three geometry masks, including crossbred contact. The
  // underlying art remains visible where the stitch is not yet "sewn".
  float reveal=mix(1.0,visibleStitch,filamentStitchAmount);
  core*=reveal;
  halo*=reveal;
  edge*=reveal;
  maskCore=core;
#endif
  float pigmentPhase=fract(phase*.17+filamentHue*.88+hueOffset+
    seedPhase*.047+ct*(.023+.017*filamentMotion)+fieldV*.06);
  vec3 ink=palette(pigmentPhase);
  vec3 glimmer=palette(fract(pigmentPhase+.23+.16*filamentRelief));
  float sheen=(.38+.62*highlight)*(.3+.7*filamentRelief);
  vec3 thread=ink*(.75+.55*sheen)+glimmer*.21*filamentRelief;
#ifdef FILAMENT_STITCHING
  // Bright traveling needle tip follows the line's own local coordinates.
  // It cannot paint into the background when the line mask is absent.
  thread+=mix(ink,vec3(1.0,.98,.92),.71)*
    needle*filamentStitchGlow*core*(.42+1.25*filamentStitchAmount);
#endif
  // Raised fibers are described in thread-local coordinates, so relief,
  // anisotropic light, and fraying move WITH the stitch rather than sliding
  // over the finished picture as a separate texture.
#ifdef FILAMENT_FIBER_DETAIL
  float luster=filamentLuster;
  float nap=filamentNap;
  float across=clamp(threadD/max(width,.002),0.0,2.0);
  float cord=1.0-smoothstep(.18,1.2,across);
  float twistWave=sin(phase*18.0+q.x*9.0-q.y*6.0+t*.28);
  float spun=.5+.5*twistWave;
  float fibers=.5+.5*sin(q.x*91.0+q.y*54.0+
    sin(q.y*17.0+t*.28)*2.0+seedPhase*1.7);
  float glisten=pow(clamp(.5+.5*cos(across*5.2-1.0+t*.07),0.0,1.0),
    mix(12.0,3.0,luster));
  float extraHalo=0.0;
  if(fiberMaterial==1){ // Iridescent silk: striations and grazing-angle sheen.
    vec3 irid=.5+.5*cos(vec3(0.0,2.094,4.188)+
      pigmentPhase*8.4+across*4.5+spun*2.2+colorTime*.08);
    thread=mix(thread,ink*.53+irid*.75,
      .2+.43*luster);
    thread+=glimmer*(.14+.48*luster)*glisten*cord;
    thread*=.75+.32*spun;
  }else if(fiberMaterial==2){ // Metallic thread: sharp specular core, dark sides.
    float chrome=pow(max(0.0,1.0-abs(across-.38)*1.5),3.0);
    float darkness=.24+.45*abs(twistWave);
    thread=thread*darkness+vec3(.95,1.0,1.0)*chrome*(.37+1.45*luster);
    thread+=glimmer*.3*pow(spun,10.0);
  }else if(fiberMaterial==3){ // Opal glass: thin-film rim and transparent body.
    vec3 spectral=.5+.5*cos(vec3(0.0,2.094,4.188)+
      (pigmentPhase+across*.2)*12.0+spun*.8+colorTime*.06);
    thread=mix(thread*.45,glimmer*.38+spectral*.95,.3+.57*luster);
    thread+=vec3(1.0,.94,1.0)*glisten*cord*(.16+.42*luster);
    extraHalo=.08+.15*luster;
  }else if(fiberMaterial==4){ // Velvet pile: low specularity and fuzzy nap.
    thread=mix(thread*.48,ink*(.55+.37*fibers),.45+.4*nap);
    thread*=.65+.3*spun;
  }else if(fiberMaterial==5){ // Electroluminescent twisted fiber.
    float helix=.5+.5*cos(phase*28.0+t*.39+q.x*7.0+seedPhase);
    thread=ink*.58+glimmer*.48+
      vec3(.92,.97,1.0)*helix*(.23+.6*luster);
    thread*=.75+.3*spun;
    extraHalo=.18+.33*luster;
  }
  // Edge nap is geometric: it expands only near the actual stitch edge.
  float fuzz=nap*(fiberMaterial==4?1.0:.53);
  float fray=(1.0-smoothstep(width,width*3.2+aa,threadD))*
    (1.0-core)*fibers*fuzz*filamentAmount;
  // Beads are pearls separated along the local filament path, not a
  // full-frame dot texture. They work for single and hybrid geometry.
  float beadPeriod=8.0+filamentBeadSize*18.0;
  float pearl=pow(max(0.0,.5+.5*cos(phase*beadPeriod+
    q.x*.3+seedPhase*.17)),mix(24.0,9.0,filamentBeadSize));
  float bead=filamentBeads*pearl*pow(max(0.0,core),1.4)*filamentAmount;
#endif
  float amount=filamentAmount;
  vec3 result=mix(background,background*.48+thread*1.06,core*amount*.91);
  result+=glimmer*halo*amount*(.045+.115*filamentRelief);
  result+=vec3(.89,.95,1.0)*edge*amount*filamentRelief*.11;
#ifdef FILAMENT_STITCHING
  result+=mix(ink,vec3(.94,.98,1.0),.65)*
    needle*core*amount*filamentStitchGlow*.32;
#endif
#ifdef FILAMENT_FIBER_DETAIL
  result+=thread*fray*.36+glimmer*halo*amount*extraHalo;
  if(filamentBeads>.001){
    // Rounded bead interior, tiny directional white highlight, dark
    // attachment socket. All confined to the exact filament mask.
    vec3 pearlColor=mix(ink,glimmer,.46+.3*glisten);
    result=mix(result,pearlColor*.68,bead*.65);
    result+=vec3(1.0,.98,.92)*bead*(.3+.7*luster)*glisten;
  }
#endif
  return clamp(result,0.0,1.6);
}
vec3 livingFilamentForge(vec3 background,vec2 uv,vec2 fieldP,float fieldV){
  if(filamentAmount<.001)return background;
  float firstCore=0.0;
  vec3 first=filamentField(background,uv,fieldP,fieldV,
    filamentSpecies,filamentMaterial,0.0,0.0,0.0,firstCore);
#ifdef FILAMENT_HYBRID
  if(filamentCrossbreed<.001)return first;
  float secondCore=0.0;
  vec3 second=filamentField(first,uv,fieldP,fieldV,
    filamentSecondSpecies,filamentSecondMaterial,
    filamentPhase*6.2831853,filamentTwist*6.2831853,
    filamentSecondHue*.9,secondCore);
  // True under/over crossings: only where two threads overlap. Different
  // paths remain distinct rather than dissolving into a flat opacity mix.
  float contact=clamp(firstCore*secondCore,0.0,1.0);
  float alternating=step(0.0,sin((uv.x*res.x+uv.y*res.y)*.053+
    seed*.000021+filamentPhase*6.2831853+time*.07));
  float tuck=filamentInterlace*contact*(1.0-alternating);
  second=mix(second,first*.82,tuck*.88);
  vec3 crossed=mix(first,second,filamentCrossbreed);
#ifdef FILAMENT_FIBER_DETAIL
  if(filamentBeads>.001){
    // Extra knots exactly where the two genuine thread cores meet.
    float node=pow(clamp(contact,0.0,1.0),.6)*
      filamentBeads*(.6+.4*filamentBeadSize);
    crossed=mix(crossed,crossed*.72+vec3(.8,.89,1.0)*.63,
      clamp(node*.6,0.0,.7));
  }
#endif
  return clamp(crossed,0.0,1.6);
#else
  // Compiled-out secondary layer: original single-thread performance.
  return first;
#endif
}
`;
