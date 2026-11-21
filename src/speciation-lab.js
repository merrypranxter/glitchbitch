// Wave 18: deterministic speciation on the existing painted colony renderer.
import {founderGene} from "./colony-genetics.js";
import {colonyFitness} from "./selection-chamber.js";
import {substrateEnabled,substrateResourceAt} from "./substrate-alchemy.js";
export const speciationModes=["Niche partition","Chromatic divergence","Adaptive radiation","Territorial invasion"];
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0};
const allele=(s,m)=>Number.isInteger(m.gene)?m.gene:founderGene(s,m);
const ratio=s=>{const [a,b]=String(s.ratio||"1:1").split(":").map(Number);return a>0&&b>0?a/b:1};
export const cladeOf=m=>m.clade||((m.parent===0?"A-":"B-")+hash(m.id).toString(36));
const dist=(a,b,r)=>Math.hypot((a.x-b.x)*r,a.y-b.y);
function expression(s,founder,i,mode,strength,pos){
  const old=allele(s,founder),bit=hash(founder.id+":"+i+":"+s.seed)%2;
  let target=bit?94:6;
  if(mode==="Niche partition")target=founder.parent===0?12:88;
  if(mode==="Adaptive radiation"&&substrateEnabled(s))
    target=Math.round(substrateResourceAt(s,pos.x,pos.y)*100);
  if(mode==="Territorial invasion")target=100-old;
  return clamp(Math.round(old+(target-old)*(.35+strength*.60)),0,100);
}
function landing(s,m,index,mode,strength,existing){
  const a=ratio(s),phase=hash(m.id+":"+mode+":"+index+":"+s.seed)/4294967296*Math.PI*2;
  let best=null;
  for(let k=0;k<24;k++){
    const angle=phase+k*2.399963229728653,rad=(.08+strength*.16)*(.70+Math.floor(k/6)*.24);
    const pos={x:clamp(m.x+Math.cos(angle)*rad/a,.055,.945),
      y:clamp(m.y+Math.sin(angle)*rad,.055,.945)};
    const clearance=existing.length?Math.min(...existing.map(p=>dist(pos,p,a)-p.radius*.68)):.4;
    const nutrient=substrateEnabled(s)?substrateResourceAt(s,pos.x,pos.y):.5;
    const gene=expression(s,m,index,mode,strength,pos)/100;
    const score=.9*clamp(clearance/Math.max(.08,m.radius),-1,1)+
      (mode==="Adaptive radiation"?.6:.15)*(1-Math.abs(gene-nutrient))+
      (k===0?.00001:0);
    if(!best||score>best.score)best={...pos,score};
  }
  return {x:best.x,y:best.y};
}
function reveal(s,seeds){
  const hasA=seeds.some(m=>m.parent===0),hasB=seeds.some(m=>m.parent===1);
  return {...s,geneAmount:Math.max(s.geneAmount||0,84),
    geneGlow:Math.max(s.geneGlow||0,78),
    atmoAmount:hasA?Math.max(s.atmoAmount||0,75):s.atmoAmount,
    atmoBAmount:hasB?Math.max(s.atmoBAmount||0,75):s.atmoBAmount,
    atmoMaskMode:hasA?"Painted colonies":s.atmoMaskMode,
    atmoBMaskMode:hasB?"Painted colonies":s.atmoBMaskMode};
}
export function branchSpecies(s,mode="Niche partition",intensity=75){
  if(!speciationModes.includes(mode)||!Number.isFinite(intensity))return s;
  const stamps=s.habitatStamps||[];
  if(!stamps.length)return s;
  // Existing organisms are never culled or displaced by branching.
  const founders=stamps.map(m=>({...m,clade:cladeOf(m),gene:allele(s,m),
    generation:m.generation??0}));
  const slots=16-founders.length,gen=s.sporeGeneration||0;
  if(slots<=0||gen>=4095){
    return {...reveal(s,founders),habitatStamps:founders};
  }
  const candidates=[founders.find(m=>m.parent===0),
    founders.find(m=>m.parent===1)].filter(Boolean);
  const origins=candidates.length?candidates:[founders[0]];
  const strength=clamp(intensity,0,100)/100,babies=[],ids=new Set(founders.map(m=>m.id));
  for(let i=0;i<Math.min(slots,intensity>=40?2:1);i++){
    const m=origins[i%origins.length],pos=landing(s,m,i,mode,strength,[...founders,...babies]);
    const id="species-"+gen+"-"+i+"-"+hash(m.id+":"+s.seed+":"+mode).toString(36);
    if(ids.has(id))continue;
    ids.add(id);
    babies.push({id,...pos,radius:clamp(m.radius*(.50+strength*.19),.05,.28),
      parent:m.parent,gene:expression(s,m,i,mode,strength,pos),
      generation:clamp(m.generation+1,0,4095),ancestor:m.id,
      clade:(m.parent===0?"A-":"B-")+hash(id).toString(36)});
  }
  const joined=[...founders,...babies],both=joined.some(m=>m.parent===0)&&joined.some(m=>m.parent===1);
  return {...reveal(s,joined),habitatStamps:joined,
    sporeGeneration:babies.length?Math.min(4095,gen+1):gen,
    colonyLifeMode:both?"Territory war":s.colonyLifeMode,
    colonyLifeAmount:both?Math.max(s.colonyLifeAmount||0,70):s.colonyLifeAmount,
    colonyCompetition:both?Math.max(s.colonyCompetition||0,60):s.colonyCompetition};
}
export function lineageCensus(s){
  const map=new Map();
  for(const m of s.habitatStamps||[]){
    const id=cladeOf(m),entry=map.get(id)||{clade:id,parent:m.parent,count:0,fitness:0,area:0};
    entry.count++;entry.fitness+=colonyFitness(s,m);entry.area+=Math.PI*m.radius*m.radius;
    map.set(id,entry);
  }
  return [...map.values()].map(x=>({...x,fitness:x.fitness/x.count}))
    .sort((a,b)=>b.area-a.area||a.clade.localeCompare(b.clade));
}
// An explicit skirmish changes radii only for genuinely intersecting rival territories.
// No deletion, no time stepping, and no hidden mutation during playback.
export function contestTerritory(s,intensity=75){
  if(!Number.isFinite(intensity)||intensity<=0)return s;
  const seeds=s.habitatStamps||[];if(seeds.length<2)return s;
  const changes=new Array(seeds.length).fill(0),a=ratio(s);
  for(let i=0;i<seeds.length;i++)for(let j=i+1;j<seeds.length;j++){
    const x=seeds[i],y=seeds[j];
    if(cladeOf(x)===cladeOf(y))continue;
    const reach=x.radius+y.radius,d=dist(x,y,a);
    if(d>=reach||reach<=0)continue;
    const powX=colonyFitness(s,x)*.75+allele(s,x)/100*.15+x.radius*.1;
    const powY=colonyFitness(s,y)*.75+allele(s,y)/100*.15+y.radius*.1;
    if(Math.abs(powX-powY)<.0001)continue;
    const pressure=clamp(intensity,0,100)/100*(1-d/reach)*.16*
      clamp(Math.abs(powX-powY)*2,.12,1);
    changes[i]+=(powX>powY?pressure:-pressure);
    changes[j]+=(powY>powX?pressure:-pressure);
  }
  const result=seeds.map((m,i)=>changes[i]===0?m:{...m,
    radius:clamp(Number((m.radius*(1+clamp(changes[i],-.26,.26))).toFixed(6)),.05,.45)});
  if(result.every((m,i)=>m.radius===seeds[i].radius))return s;
  return {...s,habitatStamps:result};
}
