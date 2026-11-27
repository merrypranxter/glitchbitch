export const topperKeys=["broadcast","windowCascade","glitter","topperShrapnel","topperJewel","topperIsland","topperVoronoi","topperTape","topperPortal","topperTime","topperHex","topperTri","topperKagome","topperQuasi","topperTruchet"];
export const topperParameters={
 "topperTruchet":["topperTruchetDensity","topperTruchetScale","topperTruchetMotion","topperTruchetGap","topperTruchetTexture","topperTruchetHue","topperTruchetBlend","topperTruchetPulse","topperTruchetTwinkle","topperTruchetWidth"],
 "topperQuasi":["topperQuasiDensity","topperQuasiScale","topperQuasiMotion","topperQuasiGap","topperQuasiTexture","topperQuasiHue","topperQuasiBlend","topperQuasiPulse","topperQuasiTwinkle"],
 "topperKagome":["topperKagomeDensity","topperKagomeScale","topperKagomeMotion","topperKagomeGap","topperKagomeTexture","topperKagomeHue","topperKagomeBlend","topperKagomePulse","topperKagomeTwinkle","topperKagomeBalance"],
 "topperTri":["topperTriDensity","topperTriScale","topperTriMotion","topperTriGap","topperTriTexture","topperTriHue","topperTriBlend","topperTriPulse","topperTriTwinkle"],
 "topperHex":["topperHexDensity","topperHexScale","topperHexMotion","topperHexGap","topperHexTexture","topperHexHue","topperHexBlend"],
  "topperShrapnel": [
    "topperDensity",
    "topperScale",
    "topperMotion",
    "topperHue",
    "topperShape",
    "topperBlend"
  ],
  "topperJewel": [
    "topperJewelDensity",
    "topperJewelScale",
    "topperJewelMotion",
    "topperJewelDetail",
    "topperJewelHue",
    "topperJewelForm",
    "topperJewelBlend","topperJewelOutline","topperJewelPulse","topperJewelPulseRate","topperJewelTwinkle","topperJewelTwinkleRate","topperJewelSpin","topperJewelSpinRate","topperJewelDirection","topperJewelIndependence"
  ],
  "topperIsland": [
    "topperIslandDensity",
    "topperIslandScale",
    "topperIslandMotion",
    "topperIslandForm",
    "topperIslandMapping",
    "topperIslandHue",
    "topperIslandFeather","topperIslandPulse","topperIslandPulseRate","topperIslandTwinkle","topperIslandTwinkleRate","topperIslandSpin","topperIslandSpinRate","topperIslandSpinDirection","topperIslandIndependence"
  ],
  "topperVoronoi": [
    "topperVoronoiDensity",
    "topperVoronoiScale",
    "topperVoronoiMotion",
    "topperVoronoiGap",
    "topperVoronoiTexture",
    "topperVoronoiHue",
    "topperVoronoiBlend"
  ],
  "topperTape": [
    "topperTapeDensity",
    "topperTapeScale",
    "topperTapeMotion",
    "topperTapeWidth",
    "topperTapeDispersion",
    "topperTapeHue",
    "topperTapePalette"
  ],
  "topperPortal": [
    "topperPortalDensity",
    "topperPortalScale",
    "topperPortalMotion",
    "topperPortalZoom",
    "topperPortalForm",
    "topperPortalWarp",
    "topperPortalHue"
  ],
  "topperTime": [
    "topperTimeDensity",
    "topperTimeScale",
    "topperTimeMotion",
    "topperTimeHold",
    "topperTimeSlip",
    "topperTimeForm",
    "topperTimeChroma"
  ]
};
export const heavyToppers=["topperPortal","topperTime"];
export function remixTopper(state,key,rng=Math.random,density="Balanced"){
 if(!topperKeys.includes(key))return state;
 const next={...state};
 const band=density==="Sparse"?[15,40]:density==="Maximalist"?[50,90]:[30,70];
 next[key]=band[0]+(band[1]-band[0])*rng();
 for(const k of topperParameters[key]||[]){
   const population=k.endsWith("Density");
   next[k]=population?band[0]+(band[1]-band[0])*rng():10+80*rng();
   if(population&&heavyToppers.includes(key))next[k]=Math.min(40,next[k]);
 }
 return next;
}
export function shuffleToppers(state,rng=Math.random,density="Balanced",allowHeavy=false){
 let next=clearToppers(state);
 const count=density==="Sparse"?1:density==="Maximalist"?4:2;
 const pool=topperKeys.filter(k=>allowHeavy||!heavyToppers.includes(k));
 for(let i=0;i<count&&pool.length;i++){
   const key=pool.splice(Math.min(pool.length-1,Math.floor(rng()*pool.length)),1)[0];
   next=remixTopper(next,key,rng,density);
   if(heavyToppers.includes(key))for(const h of heavyToppers){const j=pool.indexOf(h);if(j>=0)pool.splice(j,1);}
 }
 return next;
}
export const clearToppers=state=>({...state,...Object.fromEntries(topperKeys.map(k=>[k,0]))});
export function resetTopper(state,key,defaults){
 const next={...state};
 for(const k of [key,...(topperParameters[key]||[])])next[k]=defaults[k];
 return next;
}
