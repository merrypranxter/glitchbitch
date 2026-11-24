// LIVING CORTEX: layered interior material for planted atmospheric colonies.
// A/B can wear different tissue motifs; no textures, offscreen passes or CPU
// history. The masks' existing per-seed loop computes these channels ONCE.
export const colonyCortexModes=[
  "Bare cortex","Growth bands","Hyphal veins","Fruiting cups","Living cortex",
  "Silica puncta","Diatom ribbing","Glass honeycomb","Nucleoid clusters",
  "Ciliate fringe","Radiolarian lace","Pearl chains","Bacterial granules",
  "Mixed living tissues","Silica tissue mix","Microbial cytoplasm mix",
];
export const colonyCortexControls=[
  "colonyCortexAmount","colonyCortexDetail","colonyCortexMotion",
  "colonyCortexRelief",
];
export const colonyCortexPresets=[
  {name:"Centuries in a Petri Dish",
    colonyCortexA:"Growth bands",colonyCortexB:"Hyphal veins",
    colonyCortexAmount:92,colonyCortexDetail:76,colonyCortexMotion:40,
    colonyCortexRelief:81},
  {name:"Pixie Cup Broadcast",
    colonyCortexA:"Fruiting cups",colonyCortexB:"Living cortex",
    colonyCortexAmount:97,colonyCortexDetail:69,colonyCortexMotion:58,
    colonyCortexRelief:88},
  {name:"Luminous Vascular Cathedral",
    colonyCortexA:"Hyphal veins",colonyCortexB:"Growth bands",
    colonyCortexAmount:90,colonyCortexDetail:86,colonyCortexMotion:74,
    colonyCortexRelief:95},
  {name:"Opal Apothecia Colony",
    colonyCortexA:"Living cortex",colonyCortexB:"Fruiting cups",
    colonyCortexAmount:100,colonyCortexDetail:94,colonyCortexMotion:64,
    colonyCortexRelief:91},
];
export const applyColonyCortexPreset=(state,name)=>{
  const match=colonyCortexPresets.find(p=>p.name===name);
  if(!match)return state;
  const {name:ignored,...fields}=match;
  return {...state,...fields};
};
export const clearColonyCortex=state=>({...state,colonyCortexAmount:0});
const unit=rng=>{
  const n=Number(rng());
  return Number.isFinite(n)?Math.max(0,Math.min(n,1-Number.EPSILON)):0;
};
const pick=(a,rng)=>a[Math.floor(unit(rng)*a.length)];
export function shuffleColonyCortex(state,rng=Math.random){
  const a=pick(colonyCortexModes.slice(1),rng);
  const b=pick(colonyCortexModes.filter(m=>m!==a&&m!=="Bare cortex"),rng);
  return {...state,
    colonyCortexA:a,colonyCortexB:b,
    colonyCortexAmount:64+unit(rng)*36,
    colonyCortexDetail:26+unit(rng)*73,
    colonyCortexMotion:19+unit(rng)*78,
    colonyCortexRelief:39+unit(rng)*60,
  };
}
export const colonyCortexGLSL=`
uniform int colonyCortexA,colonyCortexB;
uniform float colonyCortexAmount,colonyCortexDetail,
  colonyCortexMotion,colonyCortexRelief;
// Data accumulated DURING the existing painted mask loop. GLSL ES 1.00
// variables are fragment-local, not a persistent shader memory buffer.
vec3 colonyCortexFieldA=vec3(0.);
vec3 colonyCortexFieldB=vec3(0.);
// .x cortical growth rings, .y vascular ridges, .z reproductive cups.
// Shapes are mathematical stylizations inspired by lichen microanatomy,
// not photorealistic physical cup meshes.
vec3 colonyCortexSample(vec2 cell,float angle,float radial,
                       float index,float parent){
  int mode=parent<.5?colonyCortexA:colonyCortexB;
  if(mode==13)mode=1+int(mod(index*5.+parent*3.,12.));
  else if(mode==14){
    int variant=int(mod(index*3.+parent,4.));
    mode=variant==0?5:variant==1?6:variant==2?7:10;
  }else if(mode==15){
    int variant=int(mod(index*3.+parent,4.));
    mode=variant==0?8:variant==1?9:variant==2?11:12;
  }
  if(mode==0)return vec3(0.);
  float t=time*(.028+colonyCortexMotion*.31)+index*.73+parent*2.3;
  float detail=colonyCortexDetail;
  float interior=smoothstep(.10,.22,radial)*
    (1.-smoothstep(.83,1.17,radial));
  float rings=0.;
  float veins=0.;
  float cups=0.;
  if(mode==1 || mode==4){
    float years=3.+floor(detail*10.);
    float band=sin(radial*years*TAU+angle*1.7
      +.42*sin(angle*5.+t*.11)-t*.15);
    rings=smoothstep(.60,.94,band)*interior;
  }
  if(mode==2 || mode==4){
    float branches=7.+floor(detail*15.);
    float spokes=cos(angle*branches+
      .62*sin(radial*11.-t*.18)+index*.17);
    veins=pow(max(0.,spokes),12.)*interior;
    // Central branching stems make the filaments feel rooted.
    veins=max(veins,.32*pow(max(0.,cos(angle*(branches*.5)
      +radial*4.+t*.16)),16.)*interior);
  }
  if(mode==3 || mode==4){
    // Apothecia-like dots arranged on a meandering internal circular
    // belt, with a bright rim and a shadowed recessed center.
    float count=7.+floor(detail*16.);
    float position=.48+.12*sin(angle*3.+t*.09+index);
    float radialBelt=exp(-pow((radial-position)*18.,2.));
    float head=pow(max(0.,cos(angle*count+t*.07+index*1.9)),18.);
    cups=head*radialBelt;
    cups*=.6+.4*sin(t*.12+angle*4.)*sin(t*.12+angle*4.);
  }
  if(mode>=5){
    float pitch=5.+floor(detail*17.);
    float rot=index*2.399963+parent*.64;
    vec2 q=mat2(cos(rot),-sin(rot),sin(rot),cos(rot))*cell;
    vec2 g=q*pitch;
    if(mode==5 || mode==7)g.x+=.5*mod(floor(g.y),2.);
    vec2 f=fract(g)-.5;
    float d=length(f);
    if(mode==5){ // punched glass dots with glowing rims
      cups=1.-smoothstep(.075,.16,d);
      rings=1.-smoothstep(.035,.09,abs(d-.24));
    }else if(mode==6){ // pennate silica ribs and central raphe
      veins=pow(abs(cos(q.y*pitch*TAU)),12.);
      rings=exp(-abs(q.x)*24.);
      cups=(1.-smoothstep(.10,.22,d))*.8;
    }else if(mode==7){ // offset silica mesh
      float hex=max(abs(f.x),dot(abs(f),vec2(.5,.866)));
      veins=1.-smoothstep(.025,.075,abs(hex-.39));
      cups=(1.-smoothstep(.075,.15,d))*.7;
    }else if(mode==8){ // bacterial nucleoid and granular cytoplasm
      vec2 n=q*vec2(1.8,3.);
      veins=exp(-dot(n,n))*pow(abs(sin(q.x*18.+sin(q.y*21.+t*.12))),4.);
      cups=1.-smoothstep(.08,.19,d);
    }else if(mode==9){ // edge-local ciliate comb
      float n=18.+floor(detail*26.);
      veins=pow(max(0.,cos(angle*n+t*.15)),10.)*smoothstep(.50,.85,radial);
      cups=(1.-smoothstep(.10,.21,d))*.65;
    }else if(mode==10){ // radial glass skeleton
      rings=pow(abs(cos(radial*pitch*PI)),12.);
      veins=pow(max(0.,cos(angle*(8.+floor(detail*14.)))),9.);
      cups=rings*veins;
    }else if(mode==11){ // beaded strings follow curved paths
      g.y+=.43*sin(g.x*.81+t*.13);
      f=fract(g)-.5;
      cups=1.-smoothstep(.12,.29,length(f));
      rings=1.-smoothstep(.025,.075,abs(f.y));
    }else{ // scattered microgranules
      vec2 id=floor(g);
      float noise=fract(sin(dot(id,vec2(127.1,311.7))+index*3.1)*43758.5453);
      cups=(1.-smoothstep(.06,.12+noise*.24,d))*noise;
    }
  }
  return vec3(rings,veins,cups)*interior;
}
vec3 tintColonyCortex(vec3 base,float mask,vec3 material,float hue){
  if(colonyCortexAmount<=.001)return base;
  float level=colonyCortexAmount*clamp(mask,0.,1.);
  float ridges=material.x*.77+material.y*.95+material.z*.82;
  float shadow=material.x*.26+material.y*.31+material.z*.42;
  // Real color from the current palette, not hard-coded pigment.
  vec3 pigment=palette(hue+.16+colorTime*.009);
  vec3 highlights=palette(hue+.39+colorTime*.009);
  base*=1.-shadow*colonyCortexRelief*level*.48;
  base+=level*(pigment*(material.x*.47+material.y*.58)+
    highlights*material.z*.81)*( .46+.54*colonyCortexRelief);
  return clamp(base,vec3(0.),vec3(2.));
}
`;
