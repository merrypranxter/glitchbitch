// ANCESTRAL RESURRECTION — Wave 16.
// Revivals are ordinary editable colony seeds, not a second renderer.
// Each fossil can produce one descendant per saved epoch. Every operation is
// deterministic, bounded, pure and therefore a single Undo step.
import {substrateEnabled,substrateResourceAt} from "./substrate-alchemy.js";
import {fitnessFromEnvironment} from "./selection-chamber.js";

export const resurrectionModes=[
  "Faithful echo","Ancestral crossover","Adaptive comeback","Kingdom inversion",
];
const clamp=(n,lo,hi)=>Math.max(lo,Math.min(hi,n));
const geneOf=stamp=>Number.isInteger(stamp.gene)?stamp.gene:50;
const hash=text=>{
  let h=2166136261;
  for(let i=0;i<text.length;i++)h=Math.imul(h^text.charCodeAt(i),16777619);
  return h>>>0;
};
const aspect=state=>{
  const [w,h]=String(state.ratio||"1:1").split(":").map(Number);
  return Number.isFinite(w/h)&&w>0&&h>0?w/h:1;
};
const validFossil=record=>record &&
  typeof record.id==="string" && record.id.length>0 &&
  typeof record.origin==="string" && record.origin.length>0 &&
  Number.isFinite(record.x)&&record.x>=0&&record.x<=1&&
  Number.isFinite(record.y)&&record.y>=0&&record.y<=1&&
  Number.isFinite(record.radius)&&record.radius>=.05&&record.radius<=.45&&
  (record.parent===0||record.parent===1)&&
  Number.isInteger(record.gene)&&record.gene>=0&&record.gene<=100 &&
  Number.isInteger(record.epoch)&&record.epoch>=0&&record.epoch<=4095;
export const revivalId=(state,record)=>
  "revival-"+Math.floor(state.apocalypseEpoch||0)+"-"+
  hash(record.id).toString(36);
export const canResurrectRecord=(state,record)=>
  validFossil(record) && (state.habitatStamps||[]).length<16 &&
  !((state.habitatStamps||[]).some(m=>m.id===revivalId(state,record)));

// The closest still-living organism is the genetic graft partner.
// Ancient material remains immutable; the living partner also stays put.
function findPartner(state,record){
  const a=aspect(state);
  const pool=state.habitatStamps||[];
  return pool.reduce((best,m)=>{
    const d=Math.hypot((m.x-record.x)*a,m.y-record.y);
    return !best||d<best.distance?{stamp:m,distance:d}:best;
  },null)?.stamp||null;
}
function descendantGenome(state,record,mode,partner){
  const fossil=record.gene;
  if(mode==="Kingdom inversion")return 100-fossil;
  if(mode!=="Ancestral crossover"||!partner)return fossil;
  const variation=((hash(record.id+":"+String(state.seed||0)+":"+
    String(state.apocalypseEpoch||0))%2001)/1000-1)*
    (state.geneMutation??55)/100*12;
  return clamp(Math.round(.55*fossil+.45*geneOf(partner)+variation),0,100);
}
function chooseSite(state,record,parent,gene,mode){
  const a=aspect(state),existing=state.habitatStamps||[];
  const radius=clamp(record.radius*.62,.05,.24);
  const golden=2.399963229728653;
  const spin=(hash(record.id+":"+String(state.apocalypseEpoch||0))%6283)/1000;
  const active=substrateEnabled(state);
  const affinity=(parent===0?state.substrateAffinityA:state.substrateAffinityB)/100;
  let best=null;
  // Twenty candidate sites; no extra textures or expensive GPU work.
  for(let i=0;i<20;i++){
    const ring=i===0?0:(.045+Math.floor((i-1)/6)*.067);
    const angle=spin+i*golden;
    const x=clamp(record.x+Math.cos(angle)*ring/a,.055,.945);
    const y=clamp(record.y+Math.sin(angle)*ring,.055,.945);
    const distance=Math.hypot((x-record.x)*a,y-record.y);
    const clearance=existing.length?Math.min(...existing.map(m=>
      Math.hypot((x-m.x)*a,y-m.y)-radius-m.radius*.70)):.4;
    const separation=clamp(clearance/(radius*.95),-1,1);
    const resource=active?substrateResourceAt(state,x,y):.5;
    const fitness=fitnessFromEnvironment(gene/100,resource,affinity,
      state.selectionMode==="Dormant"?"Nutrient matching":state.selectionMode);
    const adaptive=mode==="Adaptive comeback";
    const score=(adaptive?1.55:.45)*fitness+
      .56*separation-(adaptive?.18:.52)*distance+
      (i===0?.0001:0);
    if(!best||score>best.score)best={x,y,score};
  }
  return {x:best.x,y:best.y,radius};
}
export function resurrectFossil(state,fossilId,mode="Faithful echo"){
  if(!resurrectionModes.includes(mode))return state;
  const record=(state.fossilRecords||[]).find(r=>r.id===fossilId);
  if(!canResurrectRecord(state,record))return state;
  const partner=findPartner(state,record);
  const parent=mode==="Kingdom inversion"?1-record.parent:record.parent;
  const gene=descendantGenome(state,record,mode,partner);
  const site=chooseSite(state,record,parent,gene,mode);
  const descendant={
    id:revivalId(state,record),...site,parent,gene,
    generation:Math.min(4095,Math.max((state.sporeGeneration||0)+1,
      record.epoch+1)),
    ancestor:record.origin,
    ...(mode==="Ancestral crossover"&&partner?{mate:partner.id}:{}),
  };
  const display=parent===0?
    {atmoMaskMode:"Painted colonies",atmoAmount:Math.max(77,state.atmoAmount||0)}:
    {atmoBMaskMode:"Painted colonies",atmoBAmount:Math.max(77,state.atmoBAmount||0)};
  return {...state,...display,geneAmount:Math.max(78,state.geneAmount||0),
    habitatStamps:[...(state.habitatStamps||[]),descendant]};
}
export function resurrectOldest(state,mode="Faithful echo"){
  const eligible=(state.fossilRecords||[]).filter(r=>canResurrectRecord(state,r))
    .sort((a,b)=>a.epoch-b.epoch||a.id.localeCompare(b.id));
  return eligible.length?resurrectFossil(state,eligible[0].id,mode):state;
}
export function resurrectWholeArchive(state,mode="Faithful echo"){
  if(!resurrectionModes.includes(mode))return state;
  const archive=[...(state.fossilRecords||[])].sort((a,b)=>
    a.epoch-b.epoch||a.id.localeCompare(b.id));
  return archive.reduce((current,record)=>
    resurrectFossil(current,record.id,mode),state);
}
