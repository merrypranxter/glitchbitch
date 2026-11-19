// Smart weighted ecosystem mutation for Glitchbitch.
// This module intentionally DOES NOT import data.js: it can be reused by
// Surprise, Scene buttons and Touch controls without creating an import cycle.
import { atmosphereModes } from "./mutant-atmospheres.js";
import { atmosphereHabitats, atmosphereBlendModes } from "./atmosphere-habitats.js";
import { colonyLifeModes } from "./colony-lifecycle.js";
import { MAX_HABITAT_STAMPS } from "./habitat-painter.js";

const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
const unit=rng=>{
  const n=Number(rng());
  return Number.isFinite(n)?clamp(n,0,1-Number.EPSILON):0;
};
const range=(min,max,rng)=>min+(max-min)*unit(rng);
const roll=(prob,rng)=>unit(rng)<prob;
const choose=(items,rng)=>items[Math.min(items.length-1,Math.floor(unit(rng)*items.length))];
const weighted=(items,rng)=>{
  const total=items.reduce((a,entry)=>a+entry[1],0);
  let choice=unit(rng)*total;
  for(const [value,weight] of items){choice-=weight;if(choice<0)return value;}
  return items.at(-1)[0];
};
export const habitatLayouts=[
  "Ring","Twin clusters","Left / right","Top / bottom",
  "Diagonal invasion","Corner islands","Spore field",
];
export const chaosLevels=["Gentle","Wild","Feral","Maximum freakshow"];
const radius=(rng)=>range(.09,.29,rng);
function point(layout,i,count,parent,rng){
  const theta=i/Math.max(1,count)*Math.PI*2+range(-.22,.22,rng);
  const sx=()=>range(-.14,.14,rng),sy=()=>range(-.13,.13,rng);
  let x,y;
  switch(layout){
    case "Ring": {
      const r=range(.18,.34,rng);
      x=.5+Math.cos(theta)*r;
      y=.5+Math.sin(theta)*r;
      break;
    }
    case "Twin clusters":
      x=(parent===0?.31:.69)+sx();
      y=(parent===0?.32:.68)+sy();
      break;
    case "Left / right":
      x=parent===0?range(.14,.42,rng):range(.58,.86,rng);
      y=range(.12,.88,rng);
      break;
    case "Top / bottom":
      x=range(.12,.88,rng);
      y=parent===0?range(.58,.86,rng):range(.14,.42,rng);
      break;
    case "Diagonal invasion":
      x=clamp((i+.65)/count+sx(),.10,.90);
      y=clamp(parent===0?.8-x*.48:.25+x*.48,.10,.90)+sy();
      break;
    case "Corner islands": {
      const corners=[[.21,.22],[.79,.24],[.19,.80],[.79,.80]];
      const center=corners[(i+parent)%4];
      x=center[0]+sx()*.8;
      y=center[1]+sy()*.8;
      break;
    }
    default:
      x=range(.10,.90,rng);
      y=range(.10,.90,rng);
  }
  return {x:clamp(x,.07,.93),y:clamp(y,.07,.93)};
}
// Deterministic, unique *within a recipe*. No Date.now / crypto / hidden
// randomness: the same seeded RNG input creates an identical saved layout.
export function generateHabitatStamps(state,rng=Math.random,opts={}){
  const requiredA=opts.needA!==false;
  const requiredB=!!opts.needB;
  const both=requiredA&&requiredB;
  const count=clamp(Math.round(opts.count??range(both?5:3,11,rng)),both?2:1,MAX_HABITAT_STAMPS);
  const layout=habitatLayouts.includes(opts.layout)
    ? opts.layout:choose(habitatLayouts,rng);
  const stampId=Math.floor(unit(rng)*999999999);
  const output=[];
  for(let i=0;i<count;i++){
    let parent=requiredB&&!requiredA?1:0;
    if(both)parent=i===0?0:i===1?1:
      layout==="Left / right"||layout==="Top / bottom"||layout==="Twin clusters"
        ? i%2:roll(.5,rng)?1:0;
    const pos=point(layout,i,count,parent,rng);
    output.push({
      id:`eco-${state.seed??0}-${stampId}-${i}`,
      x:pos.x,y:pos.y,radius:radius(rng),parent
    });
  }
  return output;
}
function appendMissing(stamps,state,parent,rng){
  if(stamps.some(m=>m.parent===parent))return stamps;
  const newStamp=generateHabitatStamps(state,rng,{
    count:1,needA:parent===0,needB:parent===1,
  })[0];
  // If the artist already painted 16 seeds, an explicit ecosystem shuffle
  // can repurpose just the last one; never exceed the WebGL uniform bound.
  if(stamps.length>=MAX_HABITAT_STAMPS)return [...stamps.slice(0,-1),newStamp];
  if(stamps.some(m=>m.id===newStamp.id))
    newStamp.id += "-"+stamps.length;
  return [...stamps,newStamp];
}
export function ensureValidEcosystemState(state,rng=Math.random){
  const s={...state,habitatStamps:[...(state.habitatStamps||[])]};
  const fighting=s.colonyLifeMode==="Territory war"&&s.colonyLifeAmount>0;
  if(fighting){
    s.atmoAmount=Math.max(60,s.atmoAmount||0);
    s.atmoBAmount=Math.max(60,s.atmoBAmount||0);
    s.atmoMaskMode="Painted colonies";
    s.atmoBMaskMode="Painted colonies";
    s.colonyCompetition=Math.max(35,s.colonyCompetition||0);
  }
  if(s.atmoBMaskMode==="Inverse first"&&s.atmoMaskMode==="Everywhere")
    s.atmoMaskMode=weighted([
      ["Painted colonies",4],["Bloom iris",2],["Cell colonies",2],
      ["Flowing ribbons",1],["Fractured mosaic",1]],rng);
  const aPaint=s.atmoMaskMode==="Painted colonies";
  const bPaint=s.atmoBMaskMode==="Painted colonies";
  if(aPaint)s.atmoAmount=Math.max(55,s.atmoAmount||0);
  if(bPaint)s.atmoBAmount=Math.max(55,s.atmoBAmount||0);
  if(aPaint||bPaint){
    if(!s.habitatStamps.length){
      s.habitatStamps=generateHabitatStamps(s,rng,{needA:aPaint,needB:bPaint});
    }else{
      if(aPaint)s.habitatStamps=appendMissing(s.habitatStamps,s,0,rng);
      if(bPaint)s.habitatStamps=appendMissing(s.habitatStamps,s,1,rng);
    }
  }
  return s;
}
export function shuffleColonies(state,rng=Math.random,opts={}){
  const s={...state};
  // Making a new infestation must actually DISPLAY the new seed geometry,
  // even when the current piece had only analytic masks before.
  s.atmoMaskMode="Painted colonies";
  s.atmoAmount=Math.max(s.atmoAmount||0,65);
  if(s.atmoBAmount>0 && s.atmoBMaskMode==="Everywhere")
    s.atmoBMaskMode=roll(.55,rng)?"Painted colonies":"Inverse first";
  const second=s.atmoBAmount>0&&s.atmoBMaskMode==="Painted colonies"||
    s.colonyLifeMode==="Territory war"&&s.colonyLifeAmount>0;
  s.habitatStamps=generateHabitatStamps(s,rng,{
    ...opts,needA:true,needB:second,
  });
  return ensureValidEcosystemState(s,rng);
}
export function shuffleColonyLife(state,rng=Math.random){
  const s={...state};
  s.colonyLifeMode=weighted([
    ["Germinate & bloom",3],["Breathe",3],
    ["Wither & return",2],["Territory war",3]],rng);
  s.colonyLifeAmount=range(58,99,rng);
  s.colonyLifeSpeed=range(20,91,rng);
  s.colonyFrontGlow=range(27,98,rng);
  s.colonyCompetition=s.colonyLifeMode==="Territory war"?range(49,98,rng):0;
  if(s.colonyLifeMode!=="Territory war"){
    s.atmoMaskMode="Painted colonies";
    s.atmoAmount=Math.max(64,s.atmoAmount||0);
  }
  return ensureValidEcosystemState(s,rng);
}
const atmoMaskWeights=[
  ["Painted colonies",6],["Bloom iris",2],["Cell colonies",2],
  ["Flowing ribbons",2],["Fractured mosaic",2],["Everywhere",1],
];
export function shuffleEcosystem(state,rng=Math.random,opts={}){
  const s={...state};
  const dual=opts.allowDual!==false&&roll(opts.dualChance??.63,rng);
  const intensity=clamp(Number.isFinite(opts.intensity)?opts.intensity:.7,0,1);
  s.atmoMode=choose(atmosphereModes,rng);
  s.atmoBMode=choose(atmosphereModes.filter(mode=>mode!==s.atmoMode),rng);
  s.atmoAmount=range(51,98,rng);
  s.atmoBAmount=dual?range(47,96,rng):0;
  s.atmoMaskMode=weighted(atmoMaskWeights,rng);
  s.atmoBMaskMode=dual
    ?weighted([...atmoMaskWeights,["Inverse first",4]],rng):"Everywhere";
  s.atmoBBlendMode=choose(atmosphereBlendModes,rng);
  for(const prefix of ["atmo","atmoB"]){
    s[prefix+"Scale"]=range(22,90,rng);
    s[prefix+"Density"]=range(32,98,rng);
    s[prefix+"Motion"]=range(20,92,rng);
    s[prefix+"Glow"]=range(33,99,rng);
    s[prefix+"Hue"]=range(0,100,rng);
    s[prefix+"Variation"]=range(0,100,rng);
  }
  s.atmoMaskScale=range(20,90,rng);
  s.atmoMaskFeather=range(18,78,rng);
  s.atmoMaskMotion=range(16,88,rng);
  s.atmoMaskVariation=range(0,100,rng);
  s.habitatBrushRadius=range(11,32,rng);
  s.habitatStamps=[];
  const lifeChance=opts.lifeChance??(.27+.55*intensity);
  const live=roll(lifeChance,rng);
  if(live){
    const born=shuffleColonyLife(s,rng);
    Object.assign(s,born);
    if(!dual && s.colonyLifeMode==="Territory war"){
      // Dedicated ecology shuffle may create a second parent for a real war;
      // allowing dual parents=false means avoid war, not break the setting.
      s.colonyLifeMode="Germinate & bloom";
      s.atmoBAmount=0;
      s.atmoBMaskMode="Everywhere";
      s.colonyCompetition=0;
    }
  }else{
    s.colonyLifeMode="Still";s.colonyLifeAmount=0;
    s.colonyLifeSpeed=range(22,80,rng);
    s.colonyFrontGlow=0;s.colonyCompetition=0;
  }
  return ensureValidEcosystemState(s,rng);
}
// Old shader systems can be very costly together on mobile Safari. Explicit
// freakshow randomization samples a capped set, never turns ALL on at once.
const extras=[
  "filamentAmount","underlayAmount","photonAmount","microAmount",
  "substanceAmount","backdropAmount","bioAmount","filmAmount","prismAmount",
  "stereoAmount","wiggleAmount","compositionAmount",
];
export function enforceChaosBudget(state,rng=Math.random,opts={}){
  const s={...state};
  const max=opts.allowHeavy===false?2:(opts.level==="Maximum freakshow"?5:
    opts.level==="Feral"?4:opts.level==="Wild"?3:2);
  const protectedKeys=new Set(opts.protectedKeys||[]);
  const candidates=extras.filter(key=>(s[key]||0)>10&&!protectedKeys.has(key));
  let active=extras.filter(key=>(s[key]||0)>10).length;
  while(active>max && candidates.length){
    const index=Math.floor(unit(rng)*candidates.length);
    const key=candidates.splice(index,1)[0];
    s[key]=0;
    active--;
  }
  // The rasterized 3D mode + two atmospheric shaders can be expensive.
  if((s.atmoBAmount||0)>0 && (s.stereoAmount||0)>0 &&
     opts.allowHeavy!==true)s.stereoAmount=0;
  return s;
}
const textKeys=s=>Object.keys(s).filter(key=>key.startsWith("lettering"));
const copyKeys=(from,to,keys)=>{
  for(const key of keys)if(Object.hasOwn(from,key))to[key]=from[key];
};
export function fullWeirdShuffle(state,rng=Math.random,opts={}){
  const level=chaosLevels.includes(opts.level)?opts.level:"Feral";
  const intensity=[.22,.49,.78,1][chaosLevels.indexOf(level)];
  // The caller can inject the existing full Surprise generator to shuffle
  // old and new systems together, without introducing a data.js cycle.
  const base=typeof opts.baseRandomizer==="function"
    ?opts.baseRandomizer(state,rng):{...state};
  const s=shuffleEcosystem(base,rng,{
    allowDual:opts.allowDual!==false,
    intensity,
    dualChance:.25+intensity*.58,
    lifeChance:.38+intensity*.54
  });
  const participation=.20+intensity*.66;
  for(const key of extras){
    s[key]=roll(participation,rng)?range(24,68+intensity*31,rng):0;
  }
  // A full shuffle should remain novel, while never erasing the artist's
  // written words without explicit consent.
  if(opts.preserveColors!==false)
    copyKeys(state,s,["palette","colors"]);
  if(opts.preserveText!==false)
    copyKeys(state,s,textKeys(state));
  if(opts.preserveCore===true)
    copyKeys(state,s,["seed","engine","secondaryEngine","blend","blendMode",
      "complexity","scale","warp","rotation","symmetry","mirror",
      "marks","compositionMode","compositionAmount","compositionScale"]);
  s.ratio=state.ratio;
  return ensureValidEcosystemState(enforceChaosBudget(s,rng,{
    allowHeavy:opts.allowHeavy===true,level,
    protectedKeys:opts.preserveCore===true?["compositionAmount"]:[]
  }),rng);
}
// Called by the application's existing Surprise Me — unlike Mutate, it can
// seed the new ecology. 20% of surprises keep the living subsystem off for
// variety; old results can still be simple optical compositions.
export function mixEcosystemIntoSurprise(state,rng=Math.random,opts={}){
  let s={...state};
  if(!roll(.80,rng)){
    if(opts.preserveColors===true)
      copyKeys(opts.original||state,s,["palette","colors"]);
    s.atmoMaskMode="Everywhere";
    s.atmoBMaskMode="Everywhere";
    s.atmoBAmount=0;
    s.habitatStamps=[];
    s.colonyLifeMode="Still";s.colonyLifeAmount=0;
    s.colonyFrontGlow=0;s.colonyCompetition=0;
    return s;
  }
  s=shuffleEcosystem(s,rng,{
    allowDual:true,dualChance:.57,lifeChance:.61,intensity:.75
  });
  if(opts.preserveColors===true)
    copyKeys(opts.original||state,s,["palette","colors"]);
  // Surprise already draws a lot of old GL effects. Thin them out only
  // when adding a new, expensive two-parent colony ecology.
  if(s.atmoBAmount>0)s=enforceChaosBudget(s,rng,{level:"Feral"});
  return s;
}
