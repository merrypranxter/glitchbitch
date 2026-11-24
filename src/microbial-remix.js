import {colonyAnatomyModes,colonyPoreModes} from "./colony-anatomy.js";
import {colonyCortexModes} from "./colony-cortex.js";

export const microbialCollections=[
  {name:"Mixed microbial soup",shapeA:"Mixed microbial soup",shapeB:"Mixed kingdoms",cortexA:"Mixed living tissues",cortexB:"Microbial cytoplasm mix",pore:"Mixed perforations"},
  {name:"Silica aquarium",shapeA:"Diatom assemblage",shapeB:"Diatom assemblage",cortexA:"Silica tissue mix",cortexB:"Silica tissue mix",pore:"Diatom perforation mix"},
  {name:"Bacterial disco",shapeA:"Bacterial culture",shapeB:"Bacterial culture",cortexA:"Microbial cytoplasm mix",cortexB:"Mixed living tissues",pore:"Mixed perforations"},
  {name:"Alien biodiversity",shapeA:"Mixed kingdoms",shapeB:"Mixed microbial soup",cortexA:"Mixed living tissues",cortexB:"Mixed living tissues",pore:"Mixed perforations"},
];
const unit=rng=>{const n=Number(rng());return Number.isFinite(n)?Math.max(0,Math.min(1-Number.EPSILON,n)):0;};
const pick=(xs,rng)=>xs[Math.floor(unit(rng)*xs.length)];
const different=(xs,old,rng)=>pick(xs.filter(x=>x!==old),rng);
export const microbialVisible=s=>(s.habitatStamps||[]).some(m=>m.parent===0?s.atmoAmount>0&&s.atmoMaskMode==="Painted colonies":s.atmoBAmount>0&&s.atmoBMaskMode==="Painted colonies");
export function remixMicrobes(state,part,rng=Math.random){
  if(!microbialVisible(state))return state;
  switch(part){
    case "shapes":
      return {...state,colonyShapeA:different(colonyAnatomyModes.slice(1),state.colonyShapeA,rng),
        colonyShapeB:different(colonyAnatomyModes.slice(1),state.colonyShapeB,rng),
        colonyAnatomyAmount:state.colonyAnatomyAmount||90};
    case "pores":
      return {...state,colonyPoreMode:different(colonyPoreModes,state.colonyPoreMode,rng),
        colonyPoreDensity:20+unit(rng)*75,colonyPoreSize:20+unit(rng)*70,
        colonyAnatomyPores:state.colonyAnatomyPores||75,colonyAnatomyAmount:state.colonyAnatomyAmount||90};
    case "tissue":
      return {...state,colonyCortexA:different(colonyCortexModes.slice(1),state.colonyCortexA,rng),
        colonyCortexB:different(colonyCortexModes.slice(1),state.colonyCortexB,rng),
        colonyCortexAmount:state.colonyCortexAmount||90};
    default:return state;
  }
}
export function applyMicrobialCollection(state,name){
  const p=microbialCollections.find(p=>p.name===name);
  if(!p||!microbialVisible(state))return state;
  return {...state,colonyShapeA:p.shapeA,colonyShapeB:p.shapeB,
    colonyCortexA:p.cortexA,colonyCortexB:p.cortexB,colonyPoreMode:p.pore,
    colonyAnatomyAmount:Math.max(85,state.colonyAnatomyAmount||0),
    colonyCortexAmount:Math.max(80,state.colonyCortexAmount||0),
    colonyAnatomyPores:Math.max(60,state.colonyAnatomyPores||0)};
}
