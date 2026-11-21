import {apocalypseResource} from "./apocalypse-clock.js";
import {fossilResourceAt} from "./fossil-record.js";
import {successionResourceAt} from "./ecological-succession.js";
// SUBSTRATE ALCHEMY — a mineral/nutrient landscape that organisms respond to.
// Deliberately pure and analytically mirrored between JS and GLSL, so
// spore daughter landing sites remain EXACTLY the sites exported in the art.
export const substrateModes=[
  "Bare canvas","Fractured basalt","Nutrient rivers",
  "Quartz tesserae","Chemical tidepools","Petrified mycelium",
];
export const substrateControls=[
  "substrateAmount","substrateScale","substrateMotion",
  "substratePressure","substrateAffinityA","substrateAffinityB",
  "substrateGlow","substrateHue",
];
export const substratePresets=[
  {name:"Basalt Blood Vessels",substrateMode:"Fractured basalt",
    substrateAmount:93,substrateScale:68,substrateMotion:37,
    substratePressure:86,substrateAffinityA:97,substrateAffinityB:18,
    substrateGlow:74,substrateHue:39},
  {name:"Electric Nutrient Delta",substrateMode:"Nutrient rivers",
    substrateAmount:98,substrateScale:57,substrateMotion:79,
    substratePressure:94,substrateAffinityA:92,substrateAffinityB:11,
    substrateGlow:91,substrateHue:74},
  {name:"Opal Fossil Tiles",substrateMode:"Quartz tesserae",
    substrateAmount:94,substrateScale:82,substrateMotion:29,
    substratePressure:73,substrateAffinityA:67,substrateAffinityB:41,
    substrateGlow:97,substrateHue:19},
  {name:"Acid Bath Symbiosis",substrateMode:"Chemical tidepools",
    substrateAmount:100,substrateScale:45,substrateMotion:90,
    substratePressure:88,substrateAffinityA:13,substrateAffinityB:95,
    substrateGlow:84,substrateHue:88},
  {name:"Petrified Spore Network",substrateMode:"Petrified mycelium",
    substrateAmount:93,substrateScale:65,substrateMotion:67,
    substratePressure:97,substrateAffinityA:98,substrateAffinityB:5,
    substrateGlow:76,substrateHue:53},
];
const clamp=(value,min,max)=>Math.max(min,Math.min(value,max));
const fract=value=>value-Math.floor(value);
const unit=rng=>{
  const n=Number(rng());
  return Number.isFinite(n)?clamp(n,0,1-Number.EPSILON):0;
};
const choose=(list,rng)=>list[Math.floor(unit(rng)*list.length)];
const TAU=Math.PI*2;
export const substrateEnabled=state=>
  (state.substrateAmount||0)>0 && state.substrateMode!=="Bare canvas";
// This field is static from the ecosystem's perspective: only the visible
// iridescent lighting is animated. Therefore the same genes/nutrients govern
// preview and the permanent descendants no matter when Evolve is clicked.
export function substrateResourceAt(state,x,y){
  if(!substrateEnabled(state))return .5;
  const f=2+(state.substrateScale||0)/100*7;
  const u=x,v=y;
  let n=.5;
  switch(state.substrateMode){
    case "Fractured basalt": {
      const a=Math.pow(1-Math.abs(Math.sin((u+v*.22)*f*TAU)),5);
      const b=Math.pow(1-Math.abs(Math.sin((v-u*.11)*f*TAU)),5);
      n=clamp(Math.max(a,b),0,1);
      break;
    }
    case "Nutrient rivers": {
      const wave=Math.sin((u*1.12+.14*Math.sin(v*4.4))*f*TAU);
      n=1-Math.min(1,Math.max(0,(Math.abs(wave)-.18)/.78));
      break;
    }
    case "Quartz tesserae": {
      const diamond=Math.abs(Math.sin((u+v*.55)*f*TAU)*
        Math.cos((v-u*.31)*f*TAU));
      n=1-diamond;
      break;
    }
    case "Chemical tidepools":
      n=.5+.5*Math.sin((u*.8+v*.6)*f*TAU+.7*Math.sin(v*12));
      break;
    case "Petrified mycelium":
      n=.5+.5*Math.sin(u*f*TAU+.9*Math.cos(v*7))*
        Math.cos(v*f*TAU-.7*Math.sin(u*9));
      break;
  }
  return successionResourceAt(state,x,y,fossilResourceAt(state,x,y,
    apocalypseResource(state,x,y,clamp(n,0,1))));
}
export const substratePreference=(state,resource,parent)=>
  (parent===0?state.substrateAffinityA:state.substrateAffinityB)/100*
  resource + (1-(parent===0?state.substrateAffinityA:state.substrateAffinityB)/100)*
  (1-resource);
export function optimizeLandingSite(state,stamp,index,generation,baseSite){
  if(!substrateEnabled(state)||(state.substratePressure||0)<=0)
    return baseSite;
  const split=String(state.ratio||"1:1").split(":").map(Number);
  const aspect=split[0]>0&&split[1]>0?split[0]/split[1]:1;
  const angle=index*2.399963229728653+generation*1.133;
  const reach=(.10+(state.sporeReach||0)/100*.34)*
    (.72+.24*fract(index*.37+generation*.23));
  const candidate=(offset)=>({
    x:clamp(stamp.x+Math.cos(angle+offset)*reach/aspect,.055,.945),
    y:clamp(stamp.y+Math.sin(angle+offset)*reach,.055,.945),
  });
  let best=baseSite;
  let bestValue=substratePreference(state,
    substrateResourceAt(state,best.x,best.y),stamp.parent);
  // Two nearby alternative directions. Fewer calculations than image
  // sampling, deterministic and cheap on the CPU (not per GPU fragment).
  for(const offset of [-.93,.93]){
    const pos=candidate(offset);
    const value=substratePreference(state,
      substrateResourceAt(state,pos.x,pos.y),stamp.parent);
    if(value>bestValue){best=pos;bestValue=value;}
  }
  return best;
}
export function shuffleSubstrate(state,rng=Math.random){
  const mode=choose(substrateModes.slice(1),rng);
  return {...state,substrateMode:mode,
    substrateAmount:65+unit(rng)*35,
    substrateScale:22+unit(rng)*77,
    substrateMotion:18+unit(rng)*79,
    substratePressure:42+unit(rng)*57,
    substrateAffinityA:unit(rng)<.5?5+unit(rng)*35:67+unit(rng)*33,
    substrateAffinityB:unit(rng)<.5?5+unit(rng)*35:67+unit(rng)*33,
    substrateGlow:24+unit(rng)*75,
    substrateHue:unit(rng)*100,
  };
}
export function applySubstratePreset(state,name){
  const preset=substratePresets.find(p=>p.name===name);
  if(!preset)return state;
  const {name:ignored,...settings}=preset;
  return {...state,...settings};
}
export const clearSubstrate=state=>({...state,substrateAmount:0});
// GLSL ES 1.00, non-textured, with static geometric resource and
// continuously shimmering pigments. Compiled only if substrate is active.
export const substrateGLSL=`
uniform int substrateMode;
uniform float substrateAmount,substrateScale,substrateMotion;
uniform float substratePressure,substrateAffinityA,substrateAffinityB;
uniform float substrateGlow,substrateHue;
float substrateNutrient=.5;
float substrateResource(vec2 uv){
  float f=2.+substrateScale*7.;
  float u=uv.x,v=uv.y;
  float n=.5;
  if(substrateMode==1){
    float a=pow(1.-abs(sin((u+v*.22)*f*TAU)),5.);
    float b=pow(1.-abs(sin((v-u*.11)*f*TAU)),5.);
    n=max(a,b);
  }else if(substrateMode==2){
    float wave=sin((u*1.12+.14*sin(v*4.4))*f*TAU);
    n=1.-clamp((abs(wave)-.18)/.78,0.,1.);
  }else if(substrateMode==3){
    float diamond=abs(sin((u+v*.55)*f*TAU)*
      cos((v-u*.31)*f*TAU));
    n=1.-diamond;
  }else if(substrateMode==4){
    n=.5+.5*sin((u*.8+v*.6)*f*TAU+.7*sin(v*12.));
  }else if(substrateMode==5){
    n=.5+.5*sin(u*f*TAU+.9*cos(v*7.))*
      cos(v*f*TAU-.7*sin(u*9.));
  }
  return clamp(/* SUCCESSION_RESOURCE */ /* FOSSIL_RESOURCE */ /* APOCALYPSE_RESOURCE */n /* FOSSIL_RESOURCE_END */ /* SUCCESSION_RESOURCE_END */,0.,1.);
}
vec3 shadeSubstrate(vec3 col,vec2 uv){
  substrateNutrient=substrateResource(uv);
  float shimmer=.5+.5*sin(time*(.06+substrateMotion*.65)+
    substrateNutrient*11.+uv.x*7.-uv.y*5.);
  float veins=pow(substrateNutrient,2.);
  vec3 mineral=palette(substrateHue+substrateNutrient*.29+
    colorTime*.006);
  float coverage=substrateAmount*(.14+.57*veins);
  col=mix(col,col*.40+mineral*.68,coverage);
  col+=mineral*substrateGlow*substrateAmount*veins*
    (.12+.27*shimmer);
  return clamp(col,vec3(0.),vec3(2.));
}
`;
