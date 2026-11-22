// SELECTION CHAMBER — resource-dependent evolutionary fitness.
// No hidden deaths or automatic edits: selecting, culling and breeding
// are pure, explicit, single-undo state transitions. The on-canvas growth
// response uses the same analytic fitness equation as these CPU scores.
import {substrateEnabled,substrateResourceAt} from "./substrate-alchemy.js";
import {daughterSite} from "./spore-dynasties.js";
import {inheritColonyGene,founderGene} from "./colony-genetics.js";

export const selectionModes=[
  "Dormant","Nutrient matching","Specialist advantage",
  "Adversarial niche","Hybrid vigor",
];
export const selectionControls=[
  "selectionPressure","selectionSeverity","selectionBrood","selectionGlow",
];
export const selectionPresets=[
  {name:"Darwinian Neon Reef",selectionMode:"Nutrient matching",
    selectionPressure:91,selectionSeverity:37,selectionBrood:64,selectionGlow:95},
  {name:"Quartz Survival Games",selectionMode:"Specialist advantage",
    selectionPressure:95,selectionSeverity:47,selectionBrood:55,selectionGlow:82},
  {name:"Poison Garden Reversal",selectionMode:"Adversarial niche",
    selectionPressure:96,selectionSeverity:44,selectionBrood:78,selectionGlow:90},
  {name:"Hybrid Vigor Cathedral",selectionMode:"Hybrid vigor",
    selectionPressure:88,selectionSeverity:28,selectionBrood:81,selectionGlow:100},
];
const clamp=(n,lo,hi)=>Math.min(hi,Math.max(lo,n));
const unit=rng=>{
  const n=Number(rng());
  return Number.isFinite(n)?clamp(n,0,1-Number.EPSILON):0;
};
export const selectionActive=s=>s.selectionMode!=="Dormant" &&
  s.selectionPressure>0 && substrateEnabled(s) &&
  s.geneAmount>0 && (s.habitatStamps||[]).some(m=>Number.isInteger(m.gene)) &&
  ((s.atmoAmount>0&&s.atmoMaskMode==="Painted colonies")||
   (s.atmoBAmount>0&&s.atmoBMaskMode==="Painted colonies"));
export function fitnessFromEnvironment(allele,resource,parentAffinity,mode){
  const match=1-Math.abs(allele-resource);
  const pref=(1-resource)*(1-parentAffinity)+resource*parentAffinity;
  const core=.75*match+.25*pref;
  if(mode==="Specialist advantage")
    return clamp(.65*core+.35*Math.abs(allele-.5)*2,0,1);
  if(mode==="Adversarial niche")
    return clamp(.65*(1-match)+.35*pref,0,1);
  if(mode==="Hybrid vigor")
    return clamp(.65*core+.35*(1-Math.abs(allele-.5)*2),0,1);
  return clamp(core,0,1);
}
export function colonyFitness(state,stamp){
  if(!substrateEnabled(state)||!Number.isInteger(stamp.gene))
    return .5;
  const resource=substrateResourceAt(state,stamp.x,stamp.y);
  const affinity=(stamp.parent===0?
    state.substrateAffinityA:state.substrateAffinityB)/100;
  return fitnessFromEnvironment(stamp.gene/100,resource,affinity,
    state.selectionMode);
}
export function rankSelection(state){
  return (state.habitatStamps||[]).map((stamp,index)=>({
    stamp,index,fitness:colonyFitness(state,stamp),
  })).sort((a,b)=>b.fitness-a.fitness||a.index-b.index);
}
export function prepareSelection(state){
  const terrain=state.substrateMode==="Bare canvas"
    ? "Nutrient rivers":state.substrateMode;
  const ready={...state,
    substrateMode:terrain,
    substrateAmount:Math.max(72,state.substrateAmount||0),
    geneAmount:Math.max(75,state.geneAmount||0),
    selectionMode:state.selectionMode==="Dormant"?
      "Nutrient matching":state.selectionMode,
    selectionPressure:Math.max(70,state.selectionPressure||0),
    habitatStamps:(state.habitatStamps||[]).map(stamp=>
      Number.isInteger(stamp.gene)?stamp:{
        ...stamp,gene:founderGene(state,stamp),
        generation:stamp.generation??0,
      }),
  };
  return ready;
}
export function applySelectionPreset(state,name){
  const preset=selectionPresets.find(p=>p.name===name);
  if(!preset)return state;
  const {name:ignored,...fields}=preset;
  return {...state,...fields};
}
export function shuffleSelection(state,rng=Math.random){
  return {...state,
    selectionMode:selectionModes[1+Math.floor(unit(rng)*(selectionModes.length-1))],
    selectionPressure:56+unit(rng)*44,
    selectionSeverity:12+unit(rng)*58,
    selectionBrood:30+unit(rng)*69,
    selectionGlow:36+unit(rng)*64,
  };
}
export const stopSelection=s=>({...s,selectionPressure:0});
export function cullWeakest(state){
  const stamps=state.habitatStamps||[];
  if(!selectionActive(state)||stamps.length<=1)return state;
  const n=Math.min(stamps.length-1,
    Math.floor(stamps.length*state.selectionSeverity/100));
  if(n<=0)return state;
  const ranked=rankSelection(state).slice().reverse();
  const current={0:stamps.filter(s=>s.parent===0).length,
    1:stamps.filter(s=>s.parent===1).length};
  const removed=new Set();
  for(const item of ranked){
    if(removed.size>=n)break;
    const species=item.stamp.parent;
    if(current[species]<=1)continue; // never silently erase a species
    removed.add(item.stamp.id);
    current[species]--;
  }
  if(!removed.size)return state;
  return {...state,habitatStamps:stamps.filter(s=>!removed.has(s.id))};
}
export function breedFittest(state){
  const before=state.habitatStamps||[];
  if(!selectionActive(state)||!before.length||before.length>=16||
      (state.sporeGeneration||0)>=4095||state.selectionBrood<=0)
    return state;
  const available=Math.min(16-before.length,
    Math.max(1,Math.ceil(before.length*state.selectionBrood/100)));
  const top=rankSelection(state).slice(0,available);
  const ids=new Set(before.map(m=>m.id));
  const babies=[];
  const gen=state.sporeGeneration||0;
  for(const item of top){
    const {stamp,index}=item;
    const pos=daughterSite(state,index);
    if(!pos)continue;
    const id="adapt-"+gen+"-"+index+"-"+String(state.seed||0);
    if(ids.has(id))continue;
    ids.add(id);
    const tiny=clamp(stamp.radius*
      (.43+.19*((index*.43+gen*.13)%1)),.05,.28);
    babies.push({id,x:pos.x,y:pos.y,radius:tiny,parent:stamp.parent,
      ...inheritColonyGene(state,stamp,index,pos)});
  }
  if(!babies.length)return state;
  return {...state,habitatStamps:[...before,...babies],
    sporeGeneration:gen+1};
}
export const selectionCycle=s=>breedFittest(cullWeakest(s));

// Only inlined for painted genomes on active nutrient-rich mineral grounds.
// No new seed loop, texture, frame buffer, draw pass or GPU array.
export const selectionGLSL=`
uniform int selectionMode;
uniform float selectionPressure,selectionGlow;
float selectionFieldA=0.;
float selectionFieldB=0.;
float adaptiveFitness(float allele,float nutrientLevel,float parent){
  float match=1.-abs(allele-nutrientLevel);
  float affinity=parent<.5?substrateAffinityA:substrateAffinityB;
  float pref=mix(1.-nutrientLevel,nutrientLevel,affinity);
  float core=.75*match+.25*pref;
  if(selectionMode==2)
    return clamp(.65*core+.35*abs(allele-.5)*2.,0.,1.);
  if(selectionMode==3)
    return clamp(.65*(1.-match)+.35*pref,0.,1.);
  if(selectionMode==4)
    return clamp(.65*core+.35*(1.-abs(allele-.5)*2.),0.,1.);
  return clamp(core,0.,1.);
}
vec3 tintAdaptiveSurvival(vec3 base,float mask,float fitness,float hue){
  if(selectionPressure<=.001||selectionGlow<=.001)return base;
  float signal=clamp(fitness*mask*selectionPressure,0.,1.);
  vec3 survival=palette(hue+.26+colorTime*.009);
  base+=survival*(signal*signal)*selectionGlow*.46;
  return clamp(base,vec3(0.),vec3(2.));
}
`;
