// WAVE 19: COEVOLUTION LAB — genetic responses between nearby rival clades.
// All simulation is deterministic, pure and event-driven: no per-frame JS,
// extra shader variants, GPU arrays, background updates, or silent deaths.
import {founderGene} from "./colony-genetics.js";
import {colonyFitness} from "./selection-chamber.js";
import {cladeOf} from "./speciation-lab.js";

export const coevolutionModes=[
  "Predator-prey","Mimicry","Defensive arms race","Mutualism",
];
const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
const round6=n=>Number(n.toFixed(6));
const geneOf=(s,m)=>Number.isInteger(m.gene)?m.gene:founderGene(s,m);
const canvasAspect=s=>{
  const [w,h]=String(s.ratio||"1:1").split(":").map(Number);
  return w>0&&h>0?w/h:1;
};
const distance=(a,b,aspect)=>
  Math.hypot((a.x-b.x)*aspect,a.y-b.y);
const power=(s,m)=>.66*colonyFitness(s,m)+.18*geneOf(s,m)/100+
  .16*clamp(m.radius/.45,0,1);

// Naturalistic proximity: close colonies can exchange spores/chemistry
// before their visible disks actually overlap. Far organisms do nothing.
export function encounterNetwork(state){
  const stamps=state.habitatStamps||[];
  const aspect=canvasAspect(state),edges=[];
  for(let i=0;i<stamps.length;i++){
    for(let j=i+1;j<stamps.length;j++){
      const a=stamps[i],b=stamps[j];
      if(cladeOf(a)===cladeOf(b))continue;
      const d=distance(a,b,aspect);
      const reach=a.radius+b.radius+.12;
      if(d>=reach)continue;
      const influence=clamp((reach-d)/reach,0,1);
      if(influence<=0)continue;
      edges.push({i,j,first:cladeOf(a),second:cladeOf(b),
        distance:round6(d),influence:round6(influence)});
    }
  }
  return edges.sort((a,b)=>b.influence-a.influence||a.i-b.i||a.j-b.j);
}

// Bring one nearest different-family pair together without creating any
// seeds; artist can also position their colonies manually through Touch.
export function stageEncounter(state){
  const stamps=state.habitatStamps||[];
  if(stamps.length<2)return state;
  const aspect=canvasAspect(state);
  let best=null;
  for(let i=0;i<stamps.length;i++)for(let j=i+1;j<stamps.length;j++){
    const a=stamps[i],b=stamps[j];
    if(cladeOf(a)===cladeOf(b))continue;
    const d=distance(a,b,aspect);
    // Prefer A/B encounters when available; don't create a new GPU parent.
    const score=d+(a.parent===b.parent?.25:0);
    if(!best||score<best.score)best={i,j,d,score};
  }
  if(!best)return state;
  const a=stamps[best.i],b=stamps[best.j];
  const target=(a.radius+b.radius)*.72;
  if(best.d<=target+1e-9)return state;
  const fraction=target/best.d;
  const x=clamp(a.x+(b.x-a.x)*fraction,.055,.945);
  const y=clamp(a.y+(b.y-a.y)*fraction,.055,.945);
  if(x===b.x&&y===b.y)return state;
  return {...state,habitatStamps:stamps.map((m,i)=>
    i===best.j?{...m,x,y}:m)};
}
function reveal(state,stamps){
  const hasA=stamps.some(m=>m.parent===0);
  const hasB=stamps.some(m=>m.parent===1);
  return {...state,geneAmount:Math.max(state.geneAmount||0,82),
    geneGlow:Math.max(state.geneGlow||0,78),
    atmoAmount:hasA?Math.max(state.atmoAmount||0,76):state.atmoAmount,
    atmoBAmount:hasB?Math.max(state.atmoBAmount||0,76):state.atmoBAmount,
    atmoMaskMode:hasA?"Painted colonies":state.atmoMaskMode,
    atmoBMaskMode:hasB?"Painted colonies":state.atmoBMaskMode};
}
function oneExchange(state,mode,intensity){
  const stamps=state.habitatStamps||[];
  const round=state.coevoRound||0;
  if(round>=4095||stamps.length<2||intensity<=0)return state;
  const edges=encounterNetwork(state);
  if(!edges.length)return state;
  const degree=clamp(intensity,0,100)/100;
  const changes=stamps.map(()=>({gene:0,radius:0,active:false}));
  for(const edge of edges){
    const a=stamps[edge.i],b=stamps[edge.j],gA=geneOf(state,a),gB=geneOf(state,b);
    const pA=power(state,a),pB=power(state,b);
    const weight=edge.influence*degree;
    if(weight<=0)continue;
    const firstWins=pA===pB?a.id.localeCompare(b.id)<0:pA>pB;
    const winner=firstWins?edge.i:edge.j,loser=firstWins?edge.j:edge.i;
    const gw=firstWins?gA:gB,gl=firstWins?gB:gA;
    changes[edge.i].active=true;changes[edge.j].active=true;
    if(mode==="Predator-prey"){
      // Predation selects defensive difference in prey and changing host
      // preference in predator. Radii express ecological success, never death.
      const away=gl>=gw?1:-1;
      changes[winner].gene+=(gl-gw)*.16*weight;
      changes[loser].gene+=away*17*weight;
      changes[winner].radius+=.075*weight;
      changes[loser].radius-=.065*weight;
    }else if(mode==="Mimicry"){
      // Less fit clade copies the model's pigment/edge genome.
      changes[loser].gene+=(gw-gl)*.47*weight;
      changes[loser].radius+=.025*weight;
      changes[winner].radius+=.004*weight;
    }else if(mode==="Defensive arms race"){
      const sign=gA===gB?(a.id.localeCompare(b.id)<0?-1:1):
        (gA<gB?-1:1);
      changes[edge.i].gene+=sign*21*weight;
      changes[edge.j].gene-=sign*21*weight;
      changes[edge.i].radius+=.012*weight;
      changes[edge.j].radius+=.012*weight;
    }else if(mode==="Mutualism"){
      changes[edge.i].gene+=(gB-gA)*.19*weight;
      changes[edge.j].gene+=(gA-gB)*.19*weight;
      changes[edge.i].radius+=.045*weight;
      changes[edge.j].radius+=.045*weight;
    }
  }
  let changed=false;
  const next=stamps.map((m,i)=>{
    const d=changes[i];
    if(!d.active)return m;
    const gene=clamp(Math.round(geneOf(state,m)+clamp(d.gene,-29,29)),0,100);
    const radius=clamp(round6(m.radius*(1+clamp(d.radius,-.24,.24))),.05,.45);
    const clade=cladeOf(m);
    if(gene!==m.gene||radius!==m.radius||clade!==m.clade)changed=true;
    return {...m,gene,radius,clade};
  });
  if(!changed)return state;
  return {...reveal(state,next),habitatStamps:next,coevoRound:round+1};
}
// Multiple rounds are a single Undo action and never run during playback.
export function evolveCoevolution(state,mode="Defensive arms race",
  intensity=75,steps=1){
  if(!coevolutionModes.includes(mode)||!Number.isFinite(intensity)||
     !Number.isInteger(steps)||steps<1||steps>8)return state;
  let current=state;
  for(let i=0;i<steps;i++){
    const next=oneExchange(current,mode,intensity);
    if(next===current)break;
    current=next;
  }
  return current;
}
