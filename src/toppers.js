export const topperKeys=["broadcast","windowCascade","glitter"];
export function shuffleToppers(state,rng=Math.random,density="Balanced"){
 const next={...state};
 const count=density==="Sparse"?1:density==="Maximalist"?3:2;
 const pool=[...topperKeys];
 for(const key of pool)next[key]=0;
 for(let i=0;i<count;i++){
  const key=pool.splice(Math.min(pool.length-1,Math.floor(rng()*pool.length)),1)[0];
  next[key]=density==="Sparse"?15+30*rng():density==="Maximalist"?55+40*rng():30+45*rng();
 }
 return next;
}
export const clearToppers=state=>({...state,...Object.fromEntries(topperKeys.map(k=>[k,0]))});
