import { optimizeLandingSite } from "./substrate-alchemy.js";
// SPORE DYNASTIES — reversible, deterministic dispersal and real descendants.
// Animation is computed from continuous time. Clicking "Evolve generation"
// copies its landing coordinates into the recipe as permanently editable seeds.
// No time-based CPU state, frame history, textures or new network dependencies.
export const sporeModes=[
  "Dormant","Windborne","Helical drift","Burst scatter",
];
export const sporeControls=[
  "sporeAmount","sporeSpeed","sporeReach","sporeFertility","sporeGlow",
];
export const sporePresets=[
  {name:"Electric Pollen Storm",sporeMode:"Burst scatter",
    sporeAmount:96,sporeSpeed:83,sporeReach:88,sporeFertility:80,sporeGlow:95},
  {name:"Slow Century Spores",sporeMode:"Windborne",
    sporeAmount:91,sporeSpeed:25,sporeReach:43,sporeFertility:63,sporeGlow:72},
  {name:"Helical Gene Escape",sporeMode:"Helical drift",
    sporeAmount:94,sporeSpeed:67,sporeReach:65,sporeFertility:74,sporeGlow:91},
  {name:"Pixie Cup Exodus",sporeMode:"Windborne",
    sporeAmount:83,sporeSpeed:54,sporeReach:76,sporeFertility:92,sporeGlow:87},
];
const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
const unit=rng=>{
  const n=Number(rng());
  return Number.isFinite(n)?clamp(n,0,1-Number.EPSILON):0;
};
export function shuffleSporeDynasty(state,rng=Math.random){
  return {...state,
    sporeMode:sporeModes[1+Math.floor(unit(rng)*(sporeModes.length-1))],
    sporeAmount:63+unit(rng)*36,
    sporeSpeed:20+unit(rng)*77,
    sporeReach:22+unit(rng)*76,
    sporeFertility:28+unit(rng)*70,
    sporeGlow:29+unit(rng)*70,
  };
}
export function applySporePreset(state,name){
  const p=sporePresets.find(p=>p.name===name);
  if(!p)return state;
  const {name:discard,...fields}=p;
  return {...state,...fields};
}
export const stopSpores=state=>({...state,sporeAmount:0});
export const sporeParticipatingCount=(state)=>Math.min(
  (state.habitatStamps||[]).length,
  Math.ceil((state.habitatStamps||[]).length*(state.sporeFertility||0)/100)
);
const aspectRatio=(state)=>{
  const [w,h]=String(state.ratio||"1:1").split(":").map(Number);
  return Number.isFinite(w/h)&&w>0&&h>0?w/h:1;
};
// Matches the GPU landing law: constant irrational angle increments and a
// bounded clockwise turn for each generation. No JS Math.random or dates.
// The UI and the shader both include the current generation in the landing.
export function daughterSite(state,index){
  const stamp=(state.habitatStamps||[])[index];
  if(!stamp)return null;
  const gen=state.sporeGeneration||0;
  const angle=(index*2.399963229728653+gen*1.133);
  const drift=(.10+(state.sporeReach||0)/100*.34)*
    (.72+.24*((index*.37+gen*.23)%1));
  const aspect=aspectRatio(state);
  const base={
    x:clamp(stamp.x+Math.cos(angle)*drift/aspect,.055,.945),
    y:clamp(stamp.y+Math.sin(angle)*drift,.055,.945),
  };
  // One authoritative CPU landing rule for both GPU preview and the
  // persisted offspring, including optional nutrient-site preference.
  return optimizeLandingSite(state,stamp,index,gen,base);
}
export function evolveSporeGeneration(state){
  const before=state.habitatStamps||[];
  if(!before.length||before.length>=16||state.sporeGeneration>=4095)return state;
  const n=sporeParticipatingCount(state);
  if(n<=0)return state;
  const available=Math.min(16-before.length,n);
  const gen=Math.floor(state.sporeGeneration||0);
  const babies=[];
  const ids=new Set(before.map(x=>x.id));
  for(let i=0;i<available;i++){
    const parent=before[i];
    const pos=daughterSite(state,i);
    if(!pos)continue;
    const id=`offspring-${gen}-${i}-${Math.floor(state.seed||0)%99991}`;
    if(ids.has(id))continue;
    ids.add(id);
    babies.push({
      id,x:pos.x,y:pos.y,
      radius:clamp(parent.radius*(.43+.19*((i*.43+gen*.13)%1)),.05,.28),
      parent:parent.parent,
    });
  }
  if(!babies.length)return state;
  return {...state,habitatStamps:[...before,...babies],
    sporeGeneration:Math.min(4095,gen+1)};
}

// GPU module is inserted only if spores are active AND a painted
// atmosphere is actually visible. All variables live inside the fragment.
export const sporeDynastyGLSL=`
uniform int sporeMode;
uniform float sporeAmount,sporeSpeed,sporeReach,sporeFertility,sporeGlow;
uniform float sporeGeneration;
float sporeFlightA=0.;
float sporeFlightB=0.;
uniform vec2 daughterLandings[16];
vec2 daughterLanding(vec2 origin,float index,float aspect){
  // The JS nutrient/landing law is evaluated only 16 times per frame,
  // not for every pixel. These coordinates also become permanent offspring.
  return daughterLandings[int(index)];
}
vec2 sporeSample(vec2 uv,vec4 stamp,float index,float parent,
                float canvasAspect){
  if(sporeMode==0||sporeAmount<=.001)return vec2(0.);
  vec2 landing=daughterLanding(stamp.xy,index,canvasAspect);
  // Each parent uses a phase offset, but the cycle begins/ends with
  // no flying particle or child mask. No boomerang or abrupt teleport.
  float cycle=time*(.35+sporeSpeed*1.8)/TAU+index*.113;
  float phase=fract(cycle);
  float flightT=clamp((phase-.12)/.50,0.,1.);
  float ease=flightT*flightT*(3.-2.*flightT);
  vec2 pos=mix(stamp.xy,landing,ease);
  vec2 span=landing-stamp.xy;
  float bend=sin(flightT*PI);
  if(sporeMode==1){
    pos+=vec2(-span.y*canvasAspect,span.x/canvasAspect)*
      (.15*bend*sin(flightT*TAU+index));
  }else if(sporeMode==2){
    pos+=vec2(-span.y*canvasAspect,span.x/canvasAspect)*
      (.28*bend*sin(flightT*TAU*2.+index*1.17));
  }else if(sporeMode==3){
    pos+=vec2(-span.y*canvasAspect,span.x/canvasAspect)*
      (.23*bend*sin(flightT*TAU*3.+index*1.93));
  }
  float flight=smoothstep(.07,.17,phase)*
    (1.-smoothstep(.53,.64,phase));
  float particleD=length((uv-pos)*vec2(canvasAspect,1.));
  float particle=flight*(1.-smoothstep(.0015,.014,particleD))*
    sporeAmount;
  float sprout=smoothstep(.60,.78,phase)*
    (1.-smoothstep(.91,1.,phase));
  float radius=stamp.z*(.43+.19*fract(index*.43+sporeGeneration*.13))
    *sprout*sporeAmount;
  vec2 delta=(uv-landing)*vec2(canvasAspect,1.);
  float dr=length(delta);
  float daughter=0.;
  if(radius>.003&&dr<radius*1.4){
    float profile=1.;
    if(colonyAnatomyAmount>.001){
      profile=mix(1.,mutantColonyRadius(atan(delta.y,delta.x),
        index+17.,parent),colonyAnatomyAmount);
    }
    daughter=1.-smoothstep(radius*profile*.80,radius*profile*1.08,dr);
  }
  return vec2(daughter,particle);
}
vec3 tintSporeCloud(vec3 base,float particle,float hue){
  if(sporeGlow<=.001)return base;
  return clamp(base+palette(hue+.23+colorTime*.009)*
    particle*sporeGlow*1.7,vec3(0.),vec3(2.));
}
`;
