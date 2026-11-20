// WAVE 17 — ANCESTRAL ECHOES.
// Explicit, deterministic multi-generation evolution, using existing spores.
// Never mutate archives, add shaders, or bypass the 16 live-colony limit.
import {evolveSporeGeneration} from "./spore-dynasties.js";
export const echoModes=["Genetic atavism","Mutation bloom","Adaptive memory","Rebel descendants"];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
const geneOf=m=>Number.isInteger(m.gene)?m.gene:50;
export function ancestralSignature(state,seed){
  const archive=state.fossilRecords||[];
  const relatives=archive.filter(f=>f.origin===seed.id||f.origin===seed.ancestor||
    f.origin===seed.mate||f.parent===seed.parent);
  if(!relatives.length)return null;
  const weighted=relatives.reduce((a,f)=>{
    const kin=f.origin===seed.id||f.origin===seed.ancestor?3:
      f.origin===seed.mate?2:1;
    return {sum:a.sum+f.gene*kin,count:a.count+kin};
  },{sum:0,count:0});
  return Math.round(weighted.sum/weighted.count);
}
export function echoGene(state,seed,child,mode="Genetic atavism",intensity=65){
  const ancestral=ancestralSignature(state,seed);
  if(ancestral===null)return geneOf(child);
  const strength=clamp(intensity,0,100)/100;
  const random=(hash(seed.id+":"+child.id+":"+String(state.seed||0)+":"+mode)%10001)/10000;
  const original=geneOf(child);
  if(mode==="Genetic atavism")
    return clamp(Math.round(original*(1-strength*.78)+ancestral*strength*.78),0,100);
  if(mode==="Mutation bloom")
    return clamp(Math.round(original+(random*2-1)*strength*38+
      (ancestral-original)*strength*.22),0,100);
  if(mode==="Adaptive memory"){
    const nutrientTarget=seed.parent===0?state.substrateAffinityA:state.substrateAffinityB;
    const target=Number.isFinite(nutrientTarget)?nutrientTarget:50;
    return clamp(Math.round(original*(1-strength*.62)+
      ((ancestral+target)/2)*strength*.62),0,100);
  }
  if(mode==="Rebel descendants")
    return clamp(Math.round(original*(1-strength*.80)+(100-ancestral)*strength*.80),0,100);
  return original;
}
export function evolveAncestralGeneration(state,mode="Genetic atavism",intensity=65){
  if(!echoModes.includes(mode)||!Number.isFinite(intensity))return state;
  const before=state.habitatStamps||[];
  if(!before.length||before.length>=16||state.sporeGeneration>=4095)return state;
  // Reuse the authoritative landing law, parent participation, and ID rules.
  const evolved=evolveSporeGeneration(state);
  if(evolved===state)return state;
  const newborn=evolved.habitatStamps.slice(before.length);
  const altered=newborn.map(baby=>{
    const match=/^offspring-\d+-(\d+)-/.exec(baby.id);
    const index=match?Number(match[1]):-1;
    const seed=before[index];
    if(!seed)return baby;
    return {...baby,gene:echoGene(state,seed,baby,mode,intensity)};
  });
  return {...evolved,geneAmount:Math.max(75,evolved.geneAmount||0),
    habitatStamps:[...before,...altered]};
}
export function evolveAncestralEpochs(state,steps=3,mode="Genetic atavism",intensity=65){
  if(!Number.isInteger(steps)||steps<1||steps>8||!echoModes.includes(mode))return state;
  let current=state;
  for(let i=0;i<steps;i++){
    const next=evolveAncestralGeneration(current,mode,intensity);
    if(next===current)break;
    current=next;
  }
  return current;
}
