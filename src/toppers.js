export const topperKeys=["broadcast","windowCascade","glitter","topperShrapnel","topperJewel","topperIsland"];
export function shuffleToppers(state,rng=Math.random,density="Balanced"){
 const next={...state};
 const count=density==="Sparse"?1:density==="Maximalist"?3:2;
 const pool=[...topperKeys];
 for(const key of pool)next[key]=0;
 for(let i=0;i<count;i++){
  const key=pool.splice(Math.min(pool.length-1,Math.floor(rng()*pool.length)),1)[0];
  next[key]=density==="Sparse"?15+30*rng():density==="Maximalist"?55+40*rng():30+45*rng();
 }
 if(next.topperShrapnel>0){for(const key of ["topperDensity","topperScale","topperMotion","topperHue","topperShape","topperBlend"])next[key]=15+70*rng();}
 if(next.topperJewel>0){for(const key of ["topperJewelDensity","topperJewelScale","topperJewelMotion","topperJewelDetail","topperJewelHue","topperJewelForm","topperJewelBlend"])next[key]=rng()*100;}
 if(next.topperIsland>0){for(const key of ["topperIslandDensity","topperIslandScale","topperIslandMotion","topperIslandForm","topperIslandMapping","topperIslandHue","topperIslandFeather"])next[key]=rng()*100;}
 return next;
}
export const clearToppers=state=>({...state,...Object.fromEntries(topperKeys.map(k=>[k,0]))});
