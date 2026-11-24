// Explicit, bounded ecological time. No animation-frame mutations or new
// recipe schema: use the same saved counters, organisms and archives as the labs.
import {foodWebActive,feedFoodWeb} from "./living-food-web.js";
import {coevolutionModes,encounterNetwork,evolveCoevolution} from "./coevolution-lab.js";
import {mutateGenePool} from "./colony-genetics.js";
import {selectionActive,cullWeakest,breedFittest} from "./selection-chamber.js";
import {evolveSporeGeneration} from "./spore-dynasties.js";
import {advanceApocalypseEpoch,apocalypseActive} from "./apocalypse-clock.js";
import {advanceSuccession} from "./ecological-succession.js";
import {archiveFossils} from "./fossil-record.js";

export const evolutionRhythms=["Balanced","Feeding frenzy","Adaptive radiation","Geological upheaval"];
const weights={
  "Balanced":[.8,.8,.75,.7],
  "Feeding frenzy":[1,.35,.45,.2],
  "Adaptive radiation":[.5,1,1,.35],
  "Geological upheaval":[.45,.55,.5,1],
};
const unit=rng=>{const n=Number(rng());return Number.isFinite(n)?Math.max(0,Math.min(1-Number.EPSILON,n)):0;};
export function ecosystemCensus(s){
  const stamps=s.habitatStamps||[];
  return {colonies:stamps.length,feeding:s.foodWebRound||0,
    adaptation:s.coevoRound||0,generations:s.sporeGeneration||0,
    climate:s.apocalypseEpoch||0,soil:s.successionEpoch||0,
    fossils:(s.fossilRecords||[]).length};
}
export function advanceLivingTimeline(state,rng=Math.random,opts={}){
  const steps=opts.steps??1;
  if(!Number.isInteger(steps)||steps<1||steps>12||!(state.habitatStamps||[]).length)return state;
  const [food,adapt,birth,geo]=weights[opts.rhythm]||weights.Balanced;
  let s=state;
  for(let i=0;i<steps;i++){
    // Only evolve enabled systems; no hidden reactivation or parent creation.
    // A geological event precedes adaptation to its resulting environment.
    if(unit(rng)<geo){
      if(apocalypseActive(s))s=advanceApocalypseEpoch(s);
      if(s.fossilAmount>0&&s.fossilMode!=="Dormant")s=archiveFossils(s);
      if(s.successionAmount>0&&s.substrateAmount>0&&s.substrateMode!=="Bare canvas")s=advanceSuccession(s);
    }
    if(unit(rng)<food&&foodWebActive(s))s=feedFoodWeb(s,1);
    if(unit(rng)<adapt&&s.geneAmount>0){
      s=mutateGenePool(s,rng);
      if(encounterNetwork(s).length){
        const mode=coevolutionModes[Math.floor(unit(rng)*coevolutionModes.length)];
        s=evolveCoevolution(s,mode,35+unit(rng)*60,1);
      }
    }
    if(unit(rng)<birth){
      // Population turnover is a separate, explicit opt-in. Default never
      // removes an existing colony; selection already preserves both species.
      if(opts.allowTurnover===true&&selectionActive(s))s=cullWeakest(s);
      if(selectionActive(s))s=breedFittest(s);
      else if(s.sporeAmount>0&&s.sporeMode!=="Dormant")s=evolveSporeGeneration(s);
    }
  }
  return s;
}
