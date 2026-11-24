// Smart weighted ecosystem mutation for Glitchbitch.
// This module intentionally DOES NOT import data.js: it can be reused by
// Surprise, Scene buttons and Touch controls without creating an import cycle.
import { atmosphereModes } from "./mutant-atmospheres.js";
import { atmosphereHabitats, atmosphereBlendModes } from "./atmosphere-habitats.js";
import { colonyLifeModes } from "./colony-lifecycle.js";
import { shuffleColonyAnatomy } from "./colony-anatomy.js";
import { shuffleColonyCortex } from "./colony-cortex.js";
import { shuffleSporeDynasty } from "./spore-dynasties.js";
import { shuffleSubstrate } from "./substrate-alchemy.js";
import { shuffleSymbiosis, ensureSymbioticContact } from "./symbiosis-lab.js";
import { seedGenePool } from "./colony-genetics.js";
import {shuffleSelection} from "./selection-chamber.js";
import {shuffleApocalypse} from "./apocalypse-clock.js";
import {archiveFossils,shuffleFossils} from "./fossil-record.js";
import { MAX_HABITAT_STAMPS } from "./habitat-painter.js";
import {branchSpecies,speciationModes} from "./speciation-lab.js";
import {coevolutionModes,evolveCoevolution,stageEncounter} from "./coevolution-lab.js";
import {advanceSuccession,shuffleSuccession} from "./ecological-succession.js";
import {foodWebLinks,shuffleFoodWeb,feedFoodWeb,prepareFoodWeb,stageFoodWeb} from "./living-food-web.js";

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
  s.sporeGeneration=0;
  s.coevoRound=0;s.foodWebRound=0;
  const settled=ensureValidEcosystemState(s,rng);
  return settled.geneAmount>0 ? seedGenePool(settled,rng) : settled;
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
const spawnFossilMemory=(world,rng,opts={})=>{
  if(opts.allowHeavy!==false &&
     world.substrateAmount>0&&world.substrateMode!=="Bare canvas"&&
     world.habitatStamps.length>0 &&roll(.42,rng)){
    return archiveFossils(shuffleFossils(world,rng));
  }
  return {...world,fossilMode:"Dormant",fossilAmount:0,fossilRecords:[]};
};
// Speciation joins weighted ecosystem/Full Weird/Surprise shuffles instead
// of requiring hundreds of manual clicks. Preserve the no-dual GPU choice.
const maybeSpeciate=(state,rng,opts={})=>{
  if(!state.habitatStamps?.length||state.geneAmount<=0||
    (opts.allowDual===false&&state.habitatStamps.some(m=>m.parent===1))||
    !roll(.43,rng))return state;
  return branchSpecies(state,choose(speciationModes,rng),range(35,100,rng));
};
// Mutation is committed only by an explicit shuffle action; normal
// playback remains read-only. A single-parent request never awakens B.
const maybeCoevolve=(state,rng,opts={})=>{
  if(!state.habitatStamps||state.habitatStamps.length<2||
    (state.coevoRound||0)>=4095||state.geneAmount<=0||
    (opts.allowDual===false&&state.habitatStamps.some(m=>m.parent===1))||
    !roll(.32,rng))return state;
  const staged=stageEncounter(state);
  return evolveCoevolution(staged,choose(coevolutionModes,rng),
    range(45,95,rng),roll(.33,rng)?2:1);
};
const maybeSuccede=(s,rng,opts={})=>{
  // On mobile avoid stacking both fossil and succession resource loops by
  // default. Explicit artists can still layer both in the Scene controls.
  if(!s.habitatStamps?.length||s.substrateAmount<=0||
     s.substrateMode==="Bare canvas"||
     (s.fossilAmount>0&&s.fossilRecords?.length&&opts.allowHeavy!==true)||
     !roll(opts.allowHeavy===true?.34:.16,rng))return s;
  return advanceSuccession({...shuffleSuccession(s,rng),
    successionBurial:45+unit(rng)*54});
};
const maybeFoodWeb=(s,rng,opts={})=>{
  if((s.habitatStamps||[]).length<2||!foodWebLinks(s).length||
    (opts.allowDual===false&&s.habitatStamps.some(m=>m.parent===1))||
    ((s.fossilAmount>0&&s.fossilRecords?.length)&&
     (s.successionAmount>0&&s.successionRecords?.length)&&
     opts.allowHeavy!==true)||
    !roll(opts.allowHeavy===true?.42:.24,rng))return s;
  const network=prepareFoodWeb(shuffleFoodWeb(s,rng));
  return roll(.48,rng)?feedFoodWeb(network,1):network;
};
const evolveRandomEcosystem=(state,rng,opts)=>
  maybeFoodWeb(maybeSuccede(maybeCoevolve(
    maybeSpeciate(state,rng,opts),rng,opts),rng,opts),rng,opts);
export function shuffleEcosystem(state,rng=Math.random,opts={}){
  const s={...state};
  s.foodWebAmount=0;s.foodWebRound=0;
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
  // Minerals and nutrients create an independent, optional living ground.
  // A and B receive different affinities, so the same rock favors different
  // colonization fronts rather than just decorating the background.
  if(roll(.76,rng))Object.assign(s,shuffleSubstrate(s,rng));
  else{s.substrateMode="Bare canvas";s.substrateAmount=0;s.substratePressure=0;}
  s.habitatStamps=[];
  s.sporeGeneration=0;
  s.coevoRound=0;
  s.fossilRecords=[];
  s.fossilAmount=0;s.fossilMode="Dormant";
  s.successionRecords=[];s.successionEpoch=0;
  s.successionAmount=0;s.successionMode="Pioneer enrichment";
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
  // Opt-in morphology is part of every full ecosystem spin: new plant
  // species can have radically different outlines without hand-editing.
  // Unplanted/analytic worlds stay free of dormant decorative shaders.
  if(s.atmoMaskMode==="Painted colonies"||s.atmoBMaskMode==="Painted colonies"){
    if(roll(.84,rng))Object.assign(s,shuffleColonyAnatomy(s,rng));
    else{
      s.colonyShapeA="Classic disks";s.colonyShapeB="Classic disks";
      s.colonyAnatomyAmount=0;s.colonyAnatomyPores=0;s.colonyAnatomyRim=0;
    }
  }else{
    s.colonyShapeA="Classic disks";s.colonyShapeB="Classic disks";
    s.colonyAnatomyAmount=0;s.colonyAnatomyPores=0;s.colonyAnatomyRim=0;
  }
  // Interior material is opt-in even when the silhouette has no anatomy.
  // When a colony is planted, it can be ringed, vascular, fruiting or mixed.
  if(s.atmoMaskMode==="Painted colonies"||s.atmoBMaskMode==="Painted colonies"){
    if(roll(.72,rng))Object.assign(s,shuffleColonyCortex(s,rng));
    else{
      s.colonyCortexA="Bare cortex";s.colonyCortexB="Bare cortex";
      s.colonyCortexAmount=0;
    }
  }else{
    s.colonyCortexA="Bare cortex";s.colonyCortexB="Bare cortex";
    s.colonyCortexAmount=0;
  }
  // Bounded animated dispersal joins the breeding system only when there's
  // a real planted habitat. Otherwise no spore shader is compiled or run.
  if(s.atmoMaskMode==="Painted colonies"||s.atmoBMaskMode==="Painted colonies"){
    if(roll(.68,rng))Object.assign(s,shuffleSporeDynasty(s,rng));
    else{s.sporeMode="Dormant";s.sporeAmount=0;}
  }else{s.sporeMode="Dormant";s.sporeAmount=0;}
  // A genuine A/B overlap may birth third-kingdom chemistry. The
  // no-dual switch is absolute: never override it to force a second GPU.
  if(dual && roll(.69,rng)){
    Object.assign(s,shuffleSymbiosis(s,rng));
  }else{
    s.symbiosisMode="Dormant";s.symbiosisAmount=0;
  }
  const settled=ensureValidEcosystemState(s,rng);
  // Catastrophes are sampled only for an actual mineral world; chemistry
  // cannot become invisible/active on a bare canvas.
  if(settled.substrateAmount>0&&settled.substrateMode!=="Bare canvas"&&
     roll(.61,rng))Object.assign(settled,shuffleApocalypse(settled,rng));
  else{
    settled.apocalypseMode="Dormant";
    settled.apocalypseAmount=0;
    settled.apocalypseEpoch=0;
  }
  // Every selectable environment can breed individual genetic differences.
  // Gene pool activation comes AFTER contact pairing, so newborn contact
  // seeds also carry alleles instead of being visually identical.
  if(roll(.73,rng) &&
     (settled.atmoMaskMode==="Painted colonies"||
      settled.atmoBMaskMode==="Painted colonies")){
    settled.geneAmount=range(66,100,rng);
    settled.geneMutation=range(27,91,rng);
    settled.geneCrossbreed=range(18,94,rng);
    settled.geneGlow=range(38,99,rng);
    const genePool=seedGenePool(settled,rng);
    if(genePool.substrateAmount>0 &&
       genePool.substrateMode!=="Bare canvas"&&roll(.66,rng)){
      return evolveRandomEcosystem(
        spawnFossilMemory(shuffleSelection(genePool,rng),rng,opts),rng,
        {...opts,allowDual:dual});
    }
    genePool.selectionMode="Dormant";
    genePool.selectionPressure=0;
    return evolveRandomEcosystem(
      spawnFossilMemory(genePool,rng,opts),rng,
      {...opts,allowDual:dual});
  }
  settled.geneAmount=0;
  settled.selectionMode="Dormant";
  settled.selectionPressure=0;
  return spawnFossilMemory(settled,rng,opts); // DNA is off: no hidden speciation
}
// Old shader systems can be very costly together on mobile Safari. Explicit
// freakshow randomization samples a capped set, never turns ALL on at once.
const extras=[
  "filamentAmount","underlayAmount","photonAmount","microAmount",
  "substanceAmount","backdropAmount","bioAmount","filmAmount","prismAmount",
  "alchemyAmount","injuryAmount","stereoAmount","wiggleAmount","compositionAmount",
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
    lifeChance:.38+intensity*.54,
    allowHeavy:opts.allowHeavy===true
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
    s.colonyShapeA="Classic disks";s.colonyShapeB="Classic disks";
    s.colonyAnatomyAmount=0;s.colonyAnatomyPores=0;s.colonyAnatomyRim=0;
    s.colonyCortexA="Bare cortex";s.colonyCortexB="Bare cortex";
    s.colonyCortexAmount=0;
    s.sporeMode="Dormant";s.sporeAmount=0;s.sporeGeneration=0;s.coevoRound=0;
    s.substrateMode="Bare canvas";s.substrateAmount=0;s.substratePressure=0;
    s.symbiosisMode="Dormant";s.symbiosisAmount=0;
    s.geneAmount=0;
    s.selectionMode="Dormant";s.selectionPressure=0;
    s.apocalypseMode="Dormant";s.apocalypseAmount=0;s.apocalypseEpoch=0;
    s.fossilMode="Dormant";s.fossilAmount=0;s.fossilRecords=[];
    s.successionMode="Pioneer enrichment";s.successionAmount=0;
    s.successionRecords=[];s.successionEpoch=0;
    s.foodWebAmount=0;s.foodWebRound=0;
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

/** Dedicated, intentional living-world reroll. Unlike Surprise, always
 * produces real colonies, a connected food web and an evolved encounter.
 * Core art, lettering, palette, marks and unrelated effect values survive.
 * Only explicit user actions evolve the saved recipe. */
export function shuffleLivingWorld(state,rng=Math.random,opts={}){
  const intensity=clamp(Number.isFinite(opts.intensity)?opts.intensity:.7,0,1);
  const dual=opts.allowDual!==false;
  const heavy=opts.allowHeavy===true;
  let s=shuffleEcosystem(state,rng,{allowDual:dual,dualChance:dual?1:0,
    lifeChance:1,intensity,allowHeavy:false});
  // Start a genuinely new ecology rather than retaining obsolete ledgers.
  s={...s,atmoMaskMode:"Painted colonies",atmoBMaskMode:dual?"Painted colonies":"Everywhere",
    atmoBAmount:dual?Math.max(65,s.atmoBAmount||0):0,
    habitatStamps:generateHabitatStamps(s,rng,{needA:true,needB:dual,count:Math.round(range(4,10,rng))}),
    sporeGeneration:0,coevoRound:0,foodWebRound:0,apocalypseEpoch:0,
    fossilRecords:[],fossilAmount:0,fossilMode:"Dormant",
    successionRecords:[],successionEpoch:0,successionAmount:0};
  if(!dual&&s.colonyLifeMode==="Territory war"){
    s.colonyLifeMode="Germinate & bloom";s.colonyCompetition=0;
  }
  s=shuffleSubstrate(s,rng);
  s=shuffleColonyAnatomy(s,rng);
  s=shuffleColonyCortex(s,rng);
  s=shuffleSporeDynasty(s,rng);
  if(dual) s=ensureSymbioticContact(shuffleSymbiosis(s,rng));
  else s={...s,symbiosisMode:"Dormant",symbiosisAmount:0};
  s=seedGenePool({...s,geneAmount:range(72,100,rng),geneMutation:range(22,92,rng),
    geneCrossbreed:range(20,95,rng),geneGlow:range(40,95,rng)},rng);
  s=shuffleSelection(s,rng);
  s=branchSpecies(s,choose(speciationModes,rng),range(45,90,rng));
  s=evolveCoevolution(stageEncounter(s),choose(coevolutionModes,rng),
    range(45,95,rng),intensity>.75?2:1);
  s=shuffleApocalypse(s,rng);
  // Rotate geology rather than stacking every expensive archive by default.
  if(heavy||roll(.5,rng)) s=advanceSuccession(shuffleSuccession(s,rng));
  if(heavy||!s.successionAmount) s=archiveFossils(shuffleFossils(s,rng));
  s=prepareFoodWeb(stageFoodWeb(shuffleFoodWeb(s,rng)));
  s=feedFoodWeb(s,intensity>.75?3:1);
  return ensureValidEcosystemState(s,rng);
}
