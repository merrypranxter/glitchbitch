// WAVE 21 — THE LIVING FOOD WEB
// Six deterministic, visible links; finite resource transfers on explicit
// Undo steps only. Never a hidden simulation running during rendering.
import {substrateResourceAt} from "./substrate-alchemy.js";
export const MAX_FOOD_WEB_LINKS=6;
export const foodWebModes=[
  "Mutualist exchange","Parasitic siphon","Mycelial relay","Trophic cascade",
];
export const foodWebControls=[
  "foodWebAmount","foodWebReach","foodWebPressure","foodWebPulse",
  "foodWebWidth","foodWebGlow","foodWebHue",
];
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
const unit=rng=>{const v=Number(rng());return Number.isFinite(v)?clamp(v,0,1-Number.EPSILON):0;};
const aspect=s=>{const [w,h]=String(s.ratio||"1:1").split(":").map(Number);return w>0&&h>0?w/h:1;};
const gap=(a,b,r)=>Math.hypot((a.x-b.x)*r,a.y-b.y);
const baseline=(s,m)=>Number.isInteger(m.webEnergy)?m.webEnergy:
  clamp(Math.round(substrateResourceAt(s,m.x,m.y)*100),0,100);
export function foodWebLinks(s){
  const seeds=s.habitatStamps||[];
  if(seeds.length<2)return [];
  const r=aspect(s),reach=.10+clamp((s.foodWebReach??58)/100,0,1)*.52;
  const candidates=[];
  for(let i=0;i<seeds.length;i++)for(let j=i+1;j<seeds.length;j++){
    const d=gap(seeds[i],seeds[j],r);
    if(d>=reach)continue;
    const strength=clamp(1-d/reach,0,1);
    candidates.push({i,j,from:seeds[i].id,to:seeds[j].id,
      distance:d,strength});
  }
  candidates.sort((a,b)=>a.distance-b.distance||a.i-b.i||a.j-b.j);
  const degree=new Uint8Array(seeds.length);
  const chosen=[];
  for(const c of candidates){
    if(degree[c.i]>=3||degree[c.j]>=3)continue;
    degree[c.i]++;degree[c.j]++;
    chosen.push(c);
    if(chosen.length>=MAX_FOOD_WEB_LINKS)break;
  }
  return chosen;
}
export const foodWebActive=s=>Boolean(
  (s.foodWebAmount||0)>0 && foodWebLinks(s).length>0 &&
  (s.atmoAmount>0&&s.atmoMaskMode==="Painted colonies" ||
   s.atmoBAmount>0&&s.atmoBMaskMode==="Painted colonies"));
export function prepareFoodWeb(s){
  if(!(s.habitatStamps||[]).length)return s;
  const hasA=s.habitatStamps.some(m=>m.parent===0);
  const hasB=s.habitatStamps.some(m=>m.parent===1);
  return {...s,foodWebAmount:Math.max(77,s.foodWebAmount||0),
    foodWebGlow:Math.max(68,s.foodWebGlow||0),
    foodWebPressure:Math.max(55,s.foodWebPressure||0),
    atmoAmount:hasA?Math.max(75,s.atmoAmount||0):s.atmoAmount,
    atmoMaskMode:hasA?"Painted colonies":s.atmoMaskMode,
    atmoBAmount:hasB?Math.max(75,s.atmoBAmount||0):s.atmoBAmount,
    atmoBMaskMode:hasB?"Painted colonies":s.atmoBMaskMode};
}
export function stageFoodWeb(s){
  const seeds=s.habitatStamps||[];
  if(seeds.length<2||foodWebLinks(s).length)return s;
  const r=aspect(s),reach=.10+clamp((s.foodWebReach??58)/100,0,1)*.52;
  let best=null;
  for(let i=0;i<seeds.length;i++)for(let j=i+1;j<seeds.length;j++){
    const d=gap(seeds[i],seeds[j],r);
    if(d<.000001)continue;
    if(!best||d<best.d)best={i,j,d};
  }
  if(!best)return s;
  const p=seeds[best.i],q=seeds[best.j];
  const fraction=Math.min(1,reach*.55/best.d);
  const x=clamp(p.x+(q.x-p.x)*fraction,.055,.945);
  const y=clamp(p.y+(q.y-p.y)*fraction,.055,.945);
  if(x===q.x&&y===q.y)return s;
  return {...s,habitatStamps:seeds.map((m,i)=>i===best.j?{...m,x,y}:m)};
}
const shift=(energy,from,to,amount)=>{
  const n=Math.min(energy[from],100-energy[to],Math.max(0,amount));
  if(n<=0)return 0;
  energy[from]-=n;energy[to]+=n;
  return n;
};
function feedOnce(s){
  const seeds=s.habitatStamps||[],round=s.foodWebRound||0;
  if(round>=4095||(s.foodWebAmount||0)<=0||
     (s.foodWebPressure||0)<=0)return s;
  const links=foodWebLinks(s);
  if(!links.length)return s;
  const before=seeds.map(m=>baseline(s,m));
  const energy=[...before],pressure=clamp(s.foodWebPressure/100,0,1);
  for(const e of links){
    const {i,j,strength}=e,mode=s.foodWebMode;
    if(mode==="Mutualist exchange"||mode==="Mycelial relay"){
      const donor=energy[i]>=energy[j]?i:j;
      const receiver=donor===i?j:i,difference=energy[donor]-energy[receiver];
      if(difference<=1)continue;
      const rate=mode==="Mycelial relay"?.44:.26;
      shift(energy,donor,receiver,Math.min(Math.floor(difference/2),
        Math.max(1,Math.round(difference*rate*strength*pressure))));
    }else if(mode==="Parasitic siphon"){
      // B parasites extract from A. Same-parent webs use the higher allele
      // as the predator. No new B shader is ever forced on single-parent art.
      const bTakes=seeds[i].parent!==seeds[j].parent
        ?seeds[j].parent===1
        :(seeds[j].gene??50)>(seeds[i].gene??50);
      const thief=bTakes?j:i,host=thief===i?j:i;
      shift(energy,host,thief,
        Math.max(1,Math.round(19*strength*pressure)));
    }else if(mode==="Trophic cascade"){
      const a=(seeds[i].gene??50)+seeds[i].radius*90+energy[i]*.15;
      const b=(seeds[j].gene??50)+seeds[j].radius*90+energy[j]*.15;
      const winner=a>=b?i:j,loser=winner===i?j:i;
      shift(energy,loser,winner,
        Math.max(1,Math.round((8+Math.abs(a-b)*.16)*strength*pressure)));
    }
  }
  if(energy.every((value,i)=>value===before[i]))return s;
  const next=seeds.map((m,i)=>{
    const delta=energy[i]-before[i];
    const radius=clamp(Number((m.radius*(1+clamp(delta*.004,-.13,.13)))
      .toFixed(6)),.05,.45);
    const gene=Number.isInteger(m.gene)
      ?clamp(m.gene+Math.round(delta*.26),0,100):undefined;
    return {...m,radius,webEnergy:energy[i],
      ...(gene===undefined?{}:{gene})};
  });
  const any=next.some((m,i)=>m.radius!==seeds[i].radius ||
    m.webEnergy!==seeds[i].webEnergy || m.gene!==seeds[i].gene);
  if(!any)return s;
  return {...s,habitatStamps:next,foodWebRound:round+1,
    foodWebAmount:Math.max(65,s.foodWebAmount||0)};
}
export function feedFoodWeb(s,steps=1){
  if(!Number.isInteger(steps)||steps<1||steps>8)return s;
  let current=s;
  for(let i=0;i<steps;i++){
    const next=feedOnce(current);
    if(next===current)break;
    current=next;
  }
  return current;
}
export const hideFoodWeb=s=>({...s,foodWebAmount:0});
export function shuffleFoodWeb(s,rng=Math.random){
  const take=()=>unit(rng);
  return {...s,foodWebMode:foodWebModes[Math.floor(take()*foodWebModes.length)],
    foodWebAmount:68+take()*32,foodWebReach:38+take()*62,
    foodWebPressure:35+take()*65,foodWebPulse:24+take()*76,
    foodWebWidth:18+take()*62,foodWebGlow:46+take()*54,
    foodWebHue:take()*100};
}
export const foodWebLedger=s=>(s.habitatStamps||[]).map(m=>({
  id:m.id,parent:m.parent,energy:baseline(s,m),x:m.x,y:m.y,
}));
// A tiny extra optional shader, never compiled for legacy/off worlds.
// Stable positions are encoded in six vec4s: ax,ay,bx,by. Animation is
// only a phase in time, shared by preview and GIF/MP4 export.
export const foodWebGLSL=`
uniform int foodWebCount,foodWebMode;
uniform vec4 foodWebPairs[6];
uniform float foodWebAmount,foodWebPulse,foodWebWidth,foodWebGlow,foodWebHue;
vec3 shadeFoodWeb(vec3 col,vec2 uv){
  vec2 p=uv*vec2(res.x/res.y,1.);
  vec3 light=vec3(0.);
  float beamWidth=.0013+foodWebWidth*.0052;
  for(int i=0;i<6;i++){
    if(i>=foodWebCount)break;
    vec4 pair=foodWebPairs[i];
    vec2 a=pair.xy*vec2(res.x/res.y,1.);
    vec2 b=pair.zw*vec2(res.x/res.y,1.);
    vec2 d=b-a;
    float distance2=max(dot(d,d),.00001);
    float t=clamp(dot(p-a,d)/distance2,0.,1.);
    float radial=length(p-a-d*t);
    float filament=exp(-pow(radial/beamWidth,2.));
    float aura=exp(-pow(radial/(beamWidth*4.),2.));
    float speed=.4+foodWebPulse*2.4;
    float direction=foodWebMode==1?-1.:1.;
    float packet=pow(.5+.5*sin(t*31.-time*speed*direction+
      float(i)*2.27),8.);
    float pulse=.5+.5*sin(time*speed+t*18.+float(i)*1.8);
    float stripes=foodWebMode==2 ? (.4+.6*abs(sin(t*55.-time*speed))) : 1.;
    float dots=foodWebMode==3 ? (.45+.55*packet) : 1.;
    vec3 pigment=palette(foodWebHue+float(i)*.09+t*.32+
      colorTime*.006);
    light+=pigment*(filament*(.32+.78*packet)+aura*.13*pulse)*
      stripes*dots;
  }
  return clamp(col+light*foodWebGlow*foodWebAmount,
    vec3(0.),vec3(2.));
}
`;
