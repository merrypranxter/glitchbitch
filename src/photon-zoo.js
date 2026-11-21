// PHOTON ZOO — twenty-six living optical architectures, WebGL 1/2 compatible.
// No texture reads, framebuffers, external dependencies or expensive raymarch.
// Shader only exists when the user turns this family on.
export const photonSpecies = [
  "Prism rosettes",
  "Cathedral halos",
  "Liquid lenses",
  "Diffraction flowers",
  "Interference organisms",
  "Chromatic ribbons",
  "Op-art shockwaves",
  "Starburst engines",
  "Caustic anemones",
  "Opal gyroid ghosts",
  "Gravitational lensworms",
  "Lenticular chrysalis",
  "Quasicrystal halos",
  "Plasma jellybells",
  "Moiré pollen",
  "Spectral manta wings",
  "Nerve pearls",
  "Temporal diffraction comb",
  "Candy singularity",
  "Pollen eclipse",
  "Jelly cathedral",
  "Haunted lenticules",
  "Iridescent spore halo",
  "Prism amoeba",
  "Neon diffraction fungus",
  "Opal thunder lattice"
];
export const funkyPhotonSpecies=photonSpecies.slice(18);
export const newPhotonSpecies=photonSpecies.slice(8);
export const photonSpeciesFamilies=[
  {name:"Original optical creatures",species:photonSpecies.slice(0,8)},
  {name:"Living lenses & liquid caustics",species:[
    "Caustic anemones","Gravitational lensworms","Lenticular chrysalis",
    "Plasma jellybells"]},
  {name:"Impossible crystal & light lattices",species:[
    "Opal gyroid ghosts","Quasicrystal halos","Moiré pollen",
    "Temporal diffraction comb"]},
  {name:"Biological spectral organisms",species:[
    "Spectral manta wings","Nerve pearls"]},
  {name:"Funky singularities and spore optics",species:[
    "Candy singularity","Pollen eclipse","Iridescent spore halo",
    "Neon diffraction fungus"]},
  {name:"Haunted prismatic organisms",species:[
    "Jelly cathedral","Haunted lenticules","Prism amoeba",
    "Opal thunder lattice"]},
];
export const photonSpeciesDescriptions={
  "Prism rosettes":"Rotating polar petals with moving opalescent interference rings.",
  "Cathedral halos":"Concentric architectural arcs and mirrored light needles.",
  "Liquid lenses":"Migrating rounded microlenses with thick wet refractive rims.",
  "Diffraction flowers":"Radial floral fans grown from time-shifted diffraction.",
  "Interference organisms":"Two moving wave sources generate emergent bright tissues.",
  "Chromatic ribbons":"Folding metallic optical ribbons with moving specular ridges.",
  "Op-art shockwaves":"Pressure ripples collide with drifting optical checker waves.",
  "Starburst engines":"Spinning polygon mirrors with radiant needle beams.",
  "Caustic anemones":"Tentacular light caustics flutter around undulating bright mouths.",
  "Opal gyroid ghosts":"Gyroid-like zero surfaces drift as spectral crystalline membranes.",
  "Gravitational lensworms":"Spiraling lens rings twist the surrounding diffraction field.",
  "Lenticular chrysalis":"Migrating anisotropic lens cells open and close in optical waves.",
  "Quasicrystal halos":"Fivefold nonperiodic light lattices revolve and beat in phase.",
  "Plasma jellybells":"Pulsing bell-shaped refractions trailing electrified tentacles.",
  "Moiré pollen":"Animated microscopic pollen cells built from crossed wave gratings.",
  "Spectral manta wings":"Interfering wing membranes unfurl in traveling iridescent waves.",
  "Nerve pearls":"Glassy bead chains connect through electrically rippling filaments.",
  "Temporal diffraction comb":"Rotating slit gratings make spectral combs sweep through the field.",
  "Candy singularity":"A soft gravitational candy lens folds its luminous spiral rings inward.",
  "Pollen eclipse":"Tiny traveling eclipses cast shifting bright coronas through spore cells.",
  "Jelly cathedral":"Interlocking translucent bell vaults resonate with moving spectral ribs.",
  "Haunted lenticules":"Ghost reflections slide between gently rotating anisotropic glass lenses.",
  "Iridescent spore halo":"Germinating colored coronas beat against ring-shaped interference shells.",
  "Prism amoeba":"A soft morphing refractive body flows through a sparkling cellular skin.",
  "Neon diffraction fungus":"Branching gills pulse through animated slit diffraction and light spores.",
  "Opal thunder lattice":"Jagged moving opaline wavefronts crackle along a distorted light lattice.",
};
export function remixFunkyPhoton(state,rng=Math.random){
  const n=Number(rng());
  const unit=Number.isFinite(n)?Math.max(0,Math.min(1-Number.EPSILON,n)):0;
  const candidates=funkyPhotonSpecies.filter(name=>name!==state.photonSpecies);
  const options=candidates.length?candidates:funkyPhotonSpecies;
  const species=options[Math.floor(unit*options.length)];
  const preset=photonPresets.find(p=>p.species===species);
  return preset?photonPresetState(state,preset.name):state;
}
// Source-only compile-time pruning avoids compiling eighteen optical
// geometries when one is selected. Existing numerical IDs remain intact.
export function specializePhotonGeometry(source,index){
  if(!Number.isInteger(index)||index<0||index>=photonSpecies.length)return source;
  const opener=i=>i===0?"  if(photonSpecies==0){":
    "  }else if(photonSpecies=="+i+"){";
  const starts=photonSpecies.map((_,i)=>source.indexOf(opener(i)));
  if(starts.some((at,i)=>at<0||(i>0&&at<=starts[i-1])))return source;
  const fallback=source.indexOf("  }else{ // Unsupported photon species",starts[starts.length-1]);
  const end=source.indexOf("  float chroma=fract(",fallback);
  if(fallback<0||end<=fallback)return source;
  const stop=index===starts.length-1?fallback:starts[index+1];
  const branch=source.slice(starts[index]+opener(index).length,stop);
  return source.slice(0,starts[0])+"  if(photonSpecies=="+index+"){"+
    branch+source.slice(fallback,end)+source.slice(end);
}
export function remixPhotonZoo(state,rng=Math.random,onlyNew=false){
  const unit=()=>{
    const n=Number(rng());return Number.isFinite(n)?
      Math.min(1-Number.EPSILON,Math.max(0,n)):0;
  };
  const group=onlyNew?newPhotonSpecies:photonSpecies;
  const candidates=group.filter(x=>x!==state.photonSpecies);
  const pool=candidates.length?candidates:group;
  return {...state,photonSpecies:pool[Math.floor(unit()*pool.length)],
    photonAmount:Math.max(76,state.photonAmount||0),
    photonScale:22+Math.floor(unit()*72),
    photonDensity:48+Math.floor(unit()*52),
    photonMotion:38+Math.floor(unit()*62),
    photonRelief:62+Math.floor(unit()*38),
    photonHue:Math.floor(unit()*101),
    photonVariation:Math.floor(unit()*101)};
}
export const photonPresets = [
  {name:"Opal chapel",species:"Cathedral halos",photonAmount:82,photonScale:43,photonMotion:36,photonDensity:67,photonRelief:82,photonHue:26,photonVariation:19},
  {name:"Neon carnivorous flower",species:"Diffraction flowers",photonAmount:91,photonScale:58,photonMotion:70,photonDensity:76,photonRelief:69,photonHue:72,photonVariation:43},
  {name:"Melted gemstone soup",species:"Liquid lenses",photonAmount:88,photonScale:46,photonMotion:54,photonDensity:54,photonRelief:94,photonHue:48,photonVariation:62},
  {name:"Impossible halo machine",species:"Prism rosettes",photonAmount:91,photonScale:38,photonMotion:63,photonDensity:89,photonRelief:80,photonHue:20,photonVariation:84},
  {name:"Interference creature",species:"Interference organisms",photonAmount:87,photonScale:67,photonMotion:68,photonDensity:77,photonRelief:78,photonHue:60,photonVariation:30},
  {name:"Psychedelic ribbon fossil",species:"Chromatic ribbons",photonAmount:92,photonScale:55,photonMotion:48,photonDensity:69,photonRelief:89,photonHue:36,photonVariation:52},
  {name:"Retinal detonation",species:"Op-art shockwaves",photonAmount:91,photonScale:63,photonMotion:72,photonDensity:92,photonRelief:62,photonHue:85,photonVariation:23},
  {name:"Astral jewelry box",species:"Starburst engines",photonAmount:84,photonScale:48,photonMotion:55,photonDensity:71,photonRelief:96,photonHue:13,photonVariation:72},
  {name:"Anemone caustic disco",species:"Caustic anemones",photonAmount:96,photonScale:67,photonMotion:84,photonDensity:85,photonRelief:93,photonHue:64,photonVariation:79},
  {name:"Opaline impossible anatomy",species:"Opal gyroid ghosts",photonAmount:97,photonScale:60,photonMotion:71,photonDensity:90,photonRelief:98,photonHue:42,photonVariation:67},
  {name:"Black-hole candyworms",species:"Gravitational lensworms",photonAmount:95,photonScale:54,photonMotion:85,photonDensity:78,photonRelief:91,photonHue:83,photonVariation:44},
  {name:"Alien lens cocoon",species:"Lenticular chrysalis",photonAmount:94,photonScale:63,photonMotion:73,photonDensity:81,photonRelief:95,photonHue:58,photonVariation:69},
  {name:"Quasicrystal angel engine",species:"Quasicrystal halos",photonAmount:97,photonScale:57,photonMotion:76,photonDensity:91,photonRelief:94,photonHue:87,photonVariation:54},
  {name:"Bioluminescent plasma medusa",species:"Plasma jellybells",photonAmount:94,photonScale:63,photonMotion:90,photonDensity:78,photonRelief:95,photonHue:76,photonVariation:71},
  {name:"Moiré spore cathedral",species:"Moiré pollen",photonAmount:97,photonScale:70,photonMotion:93,photonDensity:90,photonRelief:86,photonHue:36,photonVariation:62},
  {name:"Spectral manta migration",species:"Spectral manta wings",photonAmount:96,photonScale:61,photonMotion:80,photonDensity:84,photonRelief:94,photonHue:56,photonVariation:78},
  {name:"Electric opal necklace",species:"Nerve pearls",photonAmount:97,photonScale:65,photonMotion:86,photonDensity:89,photonRelief:98,photonHue:88,photonVariation:77},
  {name:"Temporal diffraction witch",species:"Temporal diffraction comb",photonAmount:96,photonScale:64,photonMotion:88,photonDensity:92,photonRelief:89,photonHue:91,photonVariation:49},
  {"name":"Candy Event Horizon","species":"Candy singularity","photonAmount":97,"photonScale":59,"photonMotion":86,"photonDensity":89,"photonRelief":97,"photonHue":68,"photonVariation":77},
  {"name":"Eclipse in the Pollen Cathedral","species":"Pollen eclipse","photonAmount":94,"photonScale":72,"photonMotion":79,"photonDensity":85,"photonRelief":92,"photonHue":25,"photonVariation":68},
  {"name":"Gelatinous Glass Chapel","species":"Jelly cathedral","photonAmount":96,"photonScale":63,"photonMotion":72,"photonDensity":91,"photonRelief":96,"photonHue":44,"photonVariation":60},
  {"name":"Ghost Lens Boardinghouse","species":"Haunted lenticules","photonAmount":93,"photonScale":65,"photonMotion":78,"photonDensity":78,"photonRelief":96,"photonHue":82,"photonVariation":74},
  {"name":"Coronal Spore Rave","species":"Iridescent spore halo","photonAmount":97,"photonScale":67,"photonMotion":83,"photonDensity":90,"photonRelief":93,"photonHue":55,"photonVariation":80},
  {"name":"Refractive Monster Soup","species":"Prism amoeba","photonAmount":97,"photonScale":62,"photonMotion":89,"photonDensity":83,"photonRelief":98,"photonHue":74,"photonVariation":92},
  {"name":"Bioluminescent Diffraction Rot","species":"Neon diffraction fungus","photonAmount":96,"photonScale":70,"photonMotion":93,"photonDensity":94,"photonRelief":90,"photonHue":37,"photonVariation":85},
  {"name":"Opal Lightning Cathedral","species":"Opal thunder lattice","photonAmount":97,"photonScale":55,"photonMotion":91,"photonDensity":93,"photonRelief":98,"photonHue":88,"photonVariation":71}
];
export const photonControlNames = ["photonAmount","photonScale","photonMotion","photonDensity","photonRelief","photonHue","photonVariation"];
export function photonPresetState(state,presetName) {
  const p=photonPresets.find(x=>x.name===presetName);
  if(!p)return state;
  const {name,species,...parameters}=p;
  return {...state,photonSpecies:species,...parameters};
}
export function nextPhotonSpecies(state,rng=Math.random){
  const options=photonSpecies.filter(x=>x!==state.photonSpecies);
  const selection=options[Math.min(options.length-1,Math.floor(Math.min(.999999,Math.max(0,rng()))*options.length))];
  return {...state,photonSpecies:selection,photonAmount:Math.max(50,state.photonAmount||0)};
}
export const photonGLSL = `
// Twenty-six geometry-first luminous optical organisms. The base mathematical
// field provides phase/pigment changes, while the new forms have own kinetics.
uniform int photonSpecies;
uniform float photonAmount,photonScale,photonMotion,photonDensity;
uniform float photonRelief,photonHue,photonVariation;

vec3 livingPhotonZoo(vec3 original,vec2 uv,vec2 p,float v){
  if(photonAmount<.001)return original;
  float t=time*(.13+photonMotion*1.65);
  float ct=colorTime*(.09+photonMotion*.3);
  float density=4.0+photonDensity*13.0;
  float phaseShift=photonVariation*6.2831853+seed*.00003;
  vec2 q=p*(.58+photonScale*1.25);
  q+=.21*photonMotion*vec2(sin(q.y*.87+t*.41),cos(q.x*.69-t*.33));
  float rr=length(q)+.0001;
  float aa=atan(q.y,q.x);
  float shape=0.0, rim=0.0, glint=0.0, phase=0.0, alpha=.0;
  if(photonSpecies==0){ // Polar opal rosettes: nested petal-locked glass ripples.
    float petal=6.0+floor(photonDensity*13.0);
    float warpPetal=.31*cos(aa*petal+t*.29+phaseShift)
      +.13*cos(aa*(petal*.5)+t*.37);
    float f=rr*(7.0+photonScale*8.0)+warpPetal*3.2-t*.78;
    shape=pow(.5+.5*cos(f),12.0);
    rim=pow(.5+.5*sin(f+aa*petal*.3),18.0);
    glint=pow(.5+.5*cos(aa*petal-t*.34),8.0)*exp(-rr*.36);
    phase=f*.18+aa*.23;
    alpha=.23+.58*shape+.42*rim+.2*glint;
  }else if(photonSpecies==1){ // Cathedral halos: luminous multi-arc architecture.
    float spokes=8.0+floor(photonDensity*20.0);
    float rings=rr*(9.0+photonScale*9.0)-t*.72+sin(aa*5.0+t*.3)*.8;
    shape=pow(.5+.5*cos(rings),21.0);
    rim=pow(.5+.5*cos(aa*spokes+rr*2.0+t*.34+phaseShift),33.0);
    glint=pow(.5+.5*cos(aa*spokes*.5-rings*.44),19.0)*.8;
    phase=rings*.1+aa*.33;
    alpha=.14+.64*shape+.34*rim+.25*glint;
  }else if(photonSpecies==2){ // Migrating rounded lenses with thick liquid rims.
    vec2 g=q*(.42+photonDensity*1.6), cell=floor(g), local=fract(g);
    float best=3.0, second=3.0, phaseId=0.0;
    for(int j=-1;j<=1;j++){
      for(int i=-1;i<=1;i++){
        vec2 id=cell+vec2(float(i),float(j));
        float h=hash(id+phaseShift);
        vec2 center=vec2(float(i),float(j))+.5
          +.23*vec2(sin(t*.53+h*6.28),cos(t*.45+h*6.28));
        float d=length(local-center);
        if(d<best){second=best;best=d;phaseId=h;}
        else second=min(second,d);
      }
    }
    float radius=.22+.15*sin(t*.4+phaseId*6.28);
    float core=1.0-smoothstep(radius-.08,radius+.15,best);
    rim=1.0-smoothstep(.025,.085,abs(best-radius));
    shape=pow(.5+.5*cos(best*(19.0+photonDensity*16.0)-t+phaseId*6.28),10.0)*core;
    glint=pow(max(0.0,1.0-best),9.0)+.45*pow(1.0-smoothstep(.02,.14,second-best),2.0);
    phase=phaseId+best*2.8+t*.08;
    alpha=.13+.41*core+.55*rim+.27*shape;
  }else if(photonSpecies==3){ // Diffractive floral fans, not a flat mandala stamp.
    float petals=7.0+floor(photonDensity*16.0);
    float fan=cos(aa*petals+rr*2.0-t*.48+phaseShift);
    float shell=rr*(8.0+photonScale*12.0)+sin(aa*petals)*2.0-t*.8;
    shape=pow(.5+.5*sin(shell),13.0)*(.6+.4*fan*fan);
    rim=pow(.5+.5*cos(aa*petals*2.0-shell*.65),25.0);
    glint=pow(.5+.5*fan,13.0)*exp(-rr*.23);
    phase=aa*.6+shell*.065;
    alpha=.18+.54*shape+.46*rim+.2*glint;
  }else if(photonSpecies==4){ // Two moving wavefront sources grow interference organisms.
    vec2 a=vec2(.8*sin(t*.42),.65*cos(t*.37));
    vec2 b=vec2(.7*cos(t*.34+2.0),.8*sin(t*.31+1.4));
    float d1=length(q-a),d2=length(q-b);
    float u=sin(d1*density*2.1-t*1.1),w=cos(d2*density*2.06+t*.87);
    float interference=u*w;
    shape=pow(.5+.5*interference,10.0);
    rim=pow(.5+.5*cos((d1-d2)*density*3.0+t*.26),18.0);
    glint=pow(.5+.5*sin((d1+d2)*7.0-t*.71),13.0);
    phase=(d1-d2)*1.8+(d1+d2)*.25;
    alpha=.11+.52*shape+.49*rim+.15*glint;
  }else if(photonSpecies==5){ // Folding fabric-like chrome ribbons with specular ridges.
    float fold=q.y+sin(q.x*(1.4+photonDensity*1.7)+t*.47)*(.43+photonRelief*.45)
       +.16*sin(q.x*4.0-q.y*1.3-t*.63+phaseShift);
    float flow=fold*(7.0+photonScale*11.0)+t*.7;
    shape=pow(.5+.5*sin(flow),9.0);
    rim=pow(.5+.5*cos(flow*.52+q.x*.72),25.0);
    glint=pow(.5+.5*sin(flow*.26+v*2.0),7.0);
    phase=flow*.09+q.x*.16;
    alpha=.25+.41*shape+.46*rim+.18*glint;
  }else if(photonSpecies==6){ // Optical pressure waves + checker moire distortions.
    float radius=rr*(9.0+photonScale*9.0)-t*.91;
    float spiral=sin(aa*(7.0+floor(photonDensity*8.0))+radius*.31);
    float grid=sin(q.x*density*1.9+t*.32)*cos(q.y*density*1.78-t*.27);
    shape=pow(.5+.5*sin(radius+grid*2.0),16.0);
    rim=pow(.5+.5*cos(radius*.55+spiral*2.1),19.0);
    glint=pow(.5+.5*grid,9.0);
    phase=radius*.14+grid*.37;
    alpha=.14+.52*shape+.48*rim+.16*glint;
  }else if(photonSpecies==7){ // Original starburst engine, unchanged.
    float needles=8.0+floor(photonDensity*24.0);
    float beam=pow(abs(cos(aa*needles*.5+t*.16+phaseShift)),30.0);
    float ring=rr*(7.0+photonScale*11.0)-t*.73+sin(aa*6.0)*.8;
    shape=beam*(.55+.45*sin(ring));
    rim=pow(.5+.5*cos(ring),19.0);
    glint=pow(.5+.5*cos(aa*needles+t*.21),25.0);
    phase=aa*.44+rr*.71+t*.07;
    alpha=.15+.68*shape+.44*rim+.25*glint;
  }else if(photonSpecies==8){ // CAUSTIC ANEMONES: breathing radial filaments.
    float tentacles=8.0+floor(photonDensity*16.0);
    float rWave=rr*(4.0+photonScale*7.0)-t*.59;
    float fringe=sin(aa*tentacles+sin(rWave*.72+t*.47)*1.3+phaseShift);
    float mouth=sin(rWave*1.6+fringe*2.1);
    shape=pow(.5+.5*mouth,12.0)*(.36+.64*fringe*fringe);
    rim=pow(.5+.5*cos(aa*tentacles*1.5-rWave*1.32),19.0);
    glint=pow(.5+.5*sin(fringe*5.0-rWave+t*.83),13.0);
    phase=aa*.76+rWave*.19+fringe*.45;
    alpha=.10+.53*shape+.43*rim+.18*glint;
  }else if(photonSpecies==9){ // OPAL GYROID GHOSTS: moving gyroid isosurfaces.
    vec3 z=vec3(q*.84,phaseShift+t*.38);
    z.xy+=.23*vec2(sin(z.y*.7+t*.3),cos(z.x*.75-t*.27));
    float gy=sin(z.x)*cos(z.y)+sin(z.y)*cos(z.z)+sin(z.z)*cos(z.x);
    float fine=sin(z.x*2.03)*cos(z.y*1.91)+
      sin(z.y*2.03)*cos(z.z*1.91)+sin(z.z*2.03)*cos(z.x*1.91);
    float iso=abs(gy+fine*.24);
    shape=1.0-smoothstep(.03,.24,iso);
    rim=pow(1.0-smoothstep(.02,.39,abs(gy)),2.4);
    glint=pow(.5+.5*cos(fine*6.0-t*.8),10.0)*rim;
    phase=gy*2.2+fine*.43+z.z*.35;
    alpha=.09+.55*shape+.39*rim+.17*glint;
  }else if(photonSpecies==10){ // GRAVITATIONAL LENSWORMS: spiraling lens rings.
    vec2 core=vec2(.32*sin(t*.26),.25*cos(t*.31));
    vec2 worm=q-core;
    float wR=length(worm)+.04,wA=atan(worm.y,worm.x);
    float bent=wA+1.5/(.37+wR)+sin(t*.48)*.18;
    float orbit=wR*(10.0+photonDensity*14.0)-
      bent*3.1-t*.87+phaseShift;
    shape=pow(.5+.5*cos(orbit),15.0);
    rim=pow(.5+.5*cos(bent*11.0-wR*7.0),20.0);
    glint=pow(.5+.5*sin(wR*28.0+t*.8),16.0)*
      exp(-abs(wR-.58)*1.7);
    phase=bent*.5+orbit*.12;
    alpha=.12+.51*shape+.43*rim+.21*glint;
  }else if(photonSpecies==11){ // LENTICULAR CHRYSALIS: mobile ellipsoidal microlenses.
    vec2 grid=q*(.47+photonDensity*.68);
    vec2 id=floor(grid),u=fract(grid)-.5;
    float h=hash(id+phaseShift);
    float turn=t*(.19+.21*h)+h*6.2831853;
    u=mat2(cos(turn),-sin(turn),sin(turn),cos(turn))*u;
    u.x*=.7+.5*sin(t*.6+h*6.2);
    float lens=length(u*vec2(1.2,.73));
    float radius=.27+.1*sin(t*.39+h*7.0);
    shape=pow(.5+.5*cos(lens*23.0-t*.77),12.0)*
      (1.0-smoothstep(radius,radius+.13,lens));
    rim=1.0-smoothstep(.02,.08,abs(lens-radius));
    glint=pow(max(0.0,1.0-lens),16.0)*
      (.5+.5*cos(turn*2.0));
    phase=h+turn*.36+lens*2.0;
    alpha=.10+.56*shape+.53*rim+.2*glint;
  }else if(photonSpecies==12){ // QUASICRYSTAL HALOS: fivefold quasiperiodic interference.
    float field=0.0,detail=0.0;
    for(int k=0;k<5;k++){
      float angle=float(k)*1.25663706+t*.07;
      vec2 ray=vec2(cos(angle),sin(angle));
      float w=dot(q,ray)*(3.2+photonDensity*9.4);
      field+=cos(w+sin(t*.39+float(k)*1.37)*.73);
      detail+=cos(w*1.61803-t*.31+float(k)*.73);
    }
    float lattice=field*.2,quasi=detail*.2;
    shape=pow(.5+.5*lattice,11.0);
    rim=pow(.5+.5*quasi,15.0);
    glint=pow(.5+.5*cos(lattice*8.0+quasi*3.0-t*.9),13.0);
    phase=lattice*1.7+quasi*.7+aa*.15;
    alpha=.09+.6*shape+.39*rim+.14*glint;
  }else if(photonSpecies==13){ // PLASMA JELLYBELLS: pulsating cups and soft tentacles.
    vec2 cells=q*.35,id=floor(cells),u=fract(cells)-.5;
    float h=hash(id+phaseShift);
    u.x+=.08*sin(t*.44+u.y*3.0+h*7.0);
    float bell=length(vec2(u.x, max(.0,u.y)*1.25));
    float lip=.25+.045*sin(t*.71+h*6.283);
    float cup=1.0-smoothstep(.025,.09,abs(bell-lip));
    float tentacle=abs(sin(u.x*17.0+sin(u.y*11.0-t*.94)*1.7));
    float under=1.0-smoothstep(-.09,.02,u.y);
    shape=cup*(.7+.3*sin(t*.63+h*5.0));
    rim=pow(.5+.5*cos(bell*28.0-t*.82),14.0)*
      (1.0-smoothstep(.3,.51,bell));
    glint=pow(1.0-tentacle,9.0)*under;
    phase=bell*4.0+u.y*.8+h+t*.13;
    alpha=.1+.48*shape+.39*rim+.21*glint;
  }else if(photonSpecies==14){ // MOIRÉ POLLEN: rotating paired wave grating cells.
    vec2 cells=q*(.52+photonDensity*.38),id=floor(cells);
    vec2 u=fract(cells)-.5;
    float h=hash(id+phaseShift),turn=t*.27+h*6.283;
    vec2 d1=vec2(cos(turn),sin(turn));
    vec2 d2=vec2(cos(turn+1.53+.08*sin(t*.54)),
      sin(turn+1.53+.08*sin(t*.54)));
    float a=sin(dot(u,d1)*35.0-t*.82);
    float b=sin(dot(u,d2)*35.2+t*.59);
    float cell=1.0-smoothstep(.32,.69,length(u));
    shape=pow(.5+.5*a*b,8.0)*cell;
    rim=pow(.5+.5*cos((a-b)*7.0),13.0)*cell;
    glint=pow(.5+.5*sin((a+b)*5.0+t*.7),11.0)*cell;
    phase=h+a*.3+b*.47+turn*.2;
    alpha=.08+.56*shape+.38*rim+.19*glint;
  }else if(photonSpecies==15){ // SPECTRAL MANTA WINGS: interference membranes.
    vec2 wings=q*(.68+photonDensity*.2);
    float pulse=.37*sin(wings.x*1.13-t*.43+phaseShift);
    float span=abs(wings.x)+.45*abs(wings.y-pulse);
    float rib=sin(span*(8.0+photonScale*9.0)+t*.76);
    float membrane=sin(wings.y*3.8-sin(wings.x*1.2-t*.54)*2.1);
    shape=pow(.5+.5*rib,12.0)*(.5+.5*membrane*membrane);
    rim=pow(.5+.5*cos(wings.x*4.0+wings.y*3.0-t*.36),18.0);
    glint=pow(.5+.5*cos(wings.x*2.1-wings.y*2.3+t*.82),14.0);
    phase=span*.67+membrane*.9+pulse*.7;
    alpha=.12+.57*shape+.31*rim+.17*glint;
  }else if(photonSpecies==16){ // NERVE PEARLS: opaline nodes on moving axons.
    vec2 chain=q*(.75+photonDensity*.41);
    float wire=sin(chain.y*2.3+sin(chain.x*.8+t*.4)*1.4);
    float cY=chain.y+sin(chain.x*1.37-t*.57)*.25;
    vec2 nearNode=vec2(fract(chain.x*.76)-.5,fract(cY*.76)-.5);
    float bead=length(nearNode);
    float spark=pow(.5+.5*cos(chain.x*6.7-t*2.1+phaseShift),15.0);
    shape=pow(.5+.5*cos(bead*34.0-t*.57),12.0)*
      (1.0-smoothstep(.23,.37,bead));
    rim=1.0-smoothstep(.025,.095,abs(bead-.26));
    glint=pow(.5+.5*wire,12.0)*spark+
      pow(max(0.0,1.0-bead),15.0)*.5;
    phase=bead*5.0+chain.x*.25+t*.1;
    alpha=.08+.43*shape+.47*rim+.25*glint;
  }else if(photonSpecies==17){ // TEMPORAL DIFFRACTION COMB: slit interference.
    float theta=t*.18+phaseShift*.3;
    vec2 axis=vec2(cos(theta),sin(theta));
    float u=dot(q,axis),w=dot(q,vec2(-axis.y,axis.x));
    float slits=sin(u*(13.0+photonDensity*16.0)-t*.7);
    float interference=cos(w*(6.0+photonScale*14.0)+
      sin(u*2.4-t*.47)*3.0);
    float comb=sin(u*29.0-w*3.3+t*1.2);
    shape=pow(.5+.5*slits*interference,14.0);
    rim=pow(.5+.5*comb,17.0);
    glint=pow(.5+.5*cos((u+w)*9.0-t*1.6),18.0);
    phase=u*.48+w*.23+interference*.46;
    alpha=.09+.54*shape+.4*rim+.2*glint;
  }else if(photonSpecies==18){ // CANDY SINGULARITY: folding lens ribbons.
    float swirl=aa+1.35/(rr+.32)+t*.39;
    float inward=rr*(16.0+photonDensity*10.0)-
      6.0*swirl+t*.77+sin(swirl*4.0)*1.7;
    shape=pow(.5+.5*cos(inward),16.0);
    rim=pow(.5+.5*sin(rr*23.0+swirl*3.0-t*.83),18.0);
    glint=pow(.5+.5*cos(swirl*9.0-rr*7.0+t*.53),12.0);
    phase=swirl*.8-inward*.12;
    alpha=.13+.52*shape+.39*rim+.19*glint;
  }else if(photonSpecies==19){ // POLLEN ECLIPSE: migrating cellular dark moons.
    vec2 grid=q*(.66+photonDensity*.48),id=floor(grid),cell=fract(grid)-.5;
    float h=hash(id+phaseShift);
    vec2 orbit=.17*vec2(sin(t*.63+h*6.2831853),cos(t*.58+h*6.2831853));
    float d=length(cell-orbit);
    float moon=.16+.07*sin(t*.41+h*5.0);
    float corona=1.0-smoothstep(.018,.09,abs(d-moon));
    float shadow=1.0-smoothstep(moon-.04,moon+.07,d);
    shape=corona*(.65+.35*sin(t*.75+h*9.0)*sin(t*.75+h*9.0));
    rim=pow(.5+.5*cos(d*46.0-t*.61),17.0)*(1.0-shadow);
    glint=pow(.5+.5*cos(atan(cell.y,cell.x)*8.0+t*.68),14.0)*corona;
    phase=h+d*2.5+shadow*.24;
    alpha=.09+.67*shape+.36*rim+.18*glint;
  }else if(photonSpecies==20){ // JELLY CATHEDRAL: nested living glass vaults.
    vec2 vault=q*.54;
    float arch=abs(sin(vault.x*1.34+t*.32))*.83+
      .33*cos(vault.y*1.89-t*.28);
    float cup=sin(vault.y*4.0-arch*3.5+t*.6);
    float pillars=cos(vault.x*(10.0+photonDensity*11.0)+
      sin(vault.y+t*.27)*2.0);
    shape=pow(.5+.5*cup,13.0);
    rim=pow(.5+.5*cos(arch*12.0-vault.y*5.3-t*.38),18.0);
    glint=pow(.5+.5*pillars,22.0)*(.6+.4*shape);
    phase=arch*.83+cup*.42+vault.y*.32;
    alpha=.11+.47*shape+.49*rim+.23*glint;
  }else if(photonSpecies==21){ // HAUNTED LENTICULES: doubly exposed rotating cells.
    vec2 grid=q*(.6+photonDensity*.54),id=floor(grid),cell=fract(grid)-.5;
    float h=hash(id+phaseShift),angle=t*.22+h*6.2831853;
    vec2 axis=vec2(cos(angle),sin(angle));
    float x=dot(cell,axis),y=dot(cell,vec2(-axis.y,axis.x));
    float lens=length(vec2(x*1.67,y*.79));
    float echo=length(vec2((x-.11*sin(t*.54+h*6.0))*1.49,y*.87));
    shape=pow(.5+.5*cos(lens*28.0-t*.87),15.0);
    rim=1.0-smoothstep(.02,.095,abs(echo-.26));
    glint=pow(.5+.5*cos((lens-echo)*33.0+t*.63),17.0)*
      (1.0-smoothstep(.27,.55,lens));
    phase=angle*.21+echo*3.0+h;
    alpha=.12+.42*shape+.47*rim+.22*glint;
  }else if(photonSpecies==22){ // IRIDESCENT SPORE HALO: breathing coronas.
    vec2 grid=q*(.54+photonDensity*.59),id=floor(grid),cell=fract(grid)-.5;
    float h=hash(id+phaseShift),r=length(cell);
    float breathe=.20+.08*sin(t*.58+h*7.0);
    float field=sin((r-breathe)*35.0-t*.84+h*11.0);
    float outer=1.0-smoothstep(.04,.12,abs(r-breathe));
    shape=pow(.5+.5*field,11.0)*(1.0-smoothstep(.21,.52,r));
    rim=outer;
    glint=pow(.5+.5*cos(atan(cell.y,cell.x)*9.0+
      r*16.0-t*.74),19.0)*outer;
    phase=field*.58+h+r*1.7;
    alpha=.07+.56*shape+.48*rim+.22*glint;
  }else if(photonSpecies==23){ // PRISM AMOEBA: blobby refractive cell membrane.
    vec2 g=q*.42;
    float angle=atan(g.y,g.x),r=length(g);
    float wave=sin(angle*6.0+t*.54+sin(angle*3.0-t*.35)*1.4);
    float contour=.86+.16*wave+.12*sin(angle*11.0-t*.73);
    float distanceToSkin=abs(r-contour);
    float refraction=sin(r*(17.0+photonDensity*9.0)+
      wave*2.3-t*.61);
    shape=(1.0-smoothstep(.07,.3,distanceToSkin))*
      (.64+.36*refraction*refraction);
    rim=1.0-smoothstep(.012,.10,distanceToSkin);
    glint=pow(.5+.5*cos(angle*13.0+wave*2.2+t*.49),16.0)*
      (1.0-smoothstep(.04,.43,distanceToSkin));
    phase=angle*.67+wave*.52+r*.42;
    alpha=.11+.47*shape+.47*rim+.2*glint;
  }else if(photonSpecies==24){ // NEON DIFFRACTION FUNGUS: gilled radial lace.
    vec2 g=q*.59;
    float angle=atan(g.y,g.x),r=length(g);
    float gills=sin(angle*(16.0+floor(photonDensity*20.0))+
      sin(r*3.4-t*.6)*1.5);
    float cap=cos(r*(13.0+photonScale*12.0)-t*.71+
      gills*2.6);
    float spores=cos(g.x*9.0+t*.86)*sin(g.y*11.0-t*.61);
    shape=pow(.5+.5*cap,13.0)*(.55+.45*gills*gills);
    rim=pow(.5+.5*gills,15.0)*(.54+.46*cap*cap);
    glint=pow(.5+.5*spores,16.0);
    phase=gills*.64+cap*.31+r*.4;
    alpha=.12+.51*shape+.43*rim+.18*glint;
  }else if(photonSpecies==25){ // OPAL THUNDER LATTICE: buckled lightning knots.
    vec2 g=q*.9;
    float warp=sin(g.x*2.9+t*.4)*cos(g.y*2.3-t*.53);
    float lightning=sin(g.x*8.0+sin(g.y*3.1+t*.73)*3.2+
      warp*2.0-t*1.1);
    float cross=cos(g.y*9.2+sin(g.x*2.6-t*.61)*3.3-t*.8);
    float seam=abs(lightning*cross);
    shape=pow(.5+.5*lightning,15.0);
    rim=pow(.5+.5*cross,17.0);
    glint=pow(seam,7.0);
    phase=warp*.8+lightning*.52+cross*.31;
    alpha=.07+.49*shape+.49*rim+.23*glint;
  }else{ // Unsupported photon species: keep the original art unmodified.
    return original;
  }
  float chroma=fract(photonHue*.82+phase*.25+ct*.021+phaseShift*.065+v*.09);
  vec3 pigment=palette(chroma);
  vec3 secondPigment=palette(fract(chroma+.28+photonRelief*.18));
  float opticalPhase=phase*(4.0+photonDensity*6.0)+ct*.25+phaseShift;
  vec3 iridescence=.5+.5*cos(opticalPhase*vec3(1.0,1.23,1.49)
    +vec3(0.0,2.094,4.188));
  vec3 jewel=mix(pigment*.9+secondPigment*.32,iridescence*.72+pigment*.6,.28+.47*photonRelief);
  jewel+=secondPigment*rim*(.17+.73*photonRelief);
  jewel+=vec3(1.0,.94,1.0)*glint*.22*photonRelief;
  // A proper new architecture over the base art, not an opaque screenwash.
  float coverage=clamp(alpha*(.5+.45*photonDensity),0.0,.92);
  vec3 result=mix(original,original*.65+jewel,coverage*photonAmount);
  result+=jewel*rim*photonAmount*photonRelief*.22;
  return clamp(result,0.0,1.5);
}
`;
