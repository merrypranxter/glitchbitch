// Curated Gray–Scott regimes. Real feed/kill parameters, not fictional
// separate reaction-diffusion solvers. All remain opt-in and undoable.
export const bioRotPresets=[
  {name:"Candy mold",bioAmount:87,bioFeed:42,bioKill:33,bioSpeed:77,bioVeins:82},
  {name:"Petri cathedral",bioAmount:91,bioFeed:33,bioKill:48,bioSpeed:54,bioVeins:92},
  {name:"Rainbow lichen bruise",bioAmount:84,bioFeed:37,bioKill:43,bioSpeed:64,bioVeins:88},
  {name:"Toxic bloom",bioAmount:90,bioFeed:55,bioKill:41,bioSpeed:89,bioVeins:76},
  {name:"Fungal lace",bioAmount:96,bioFeed:28,bioKill:45,bioSpeed:58,bioVeins:97},
  {name:"Neural slime",bioAmount:94,bioFeed:42,bioKill:32,bioSpeed:91,bioVeins:94},
  {name:"Spoilage halo",bioAmount:88,bioFeed:47,bioKill:57,bioSpeed:62,bioVeins:70},
  {name:"Witch agar",bioAmount:97,bioFeed:35,bioKill:40,bioSpeed:80,bioVeins:90},
];
export function applyBioRotPreset(state,name){
  const p=bioRotPresets.find(x=>x.name===name);
  if(!p)return state;
  return {...state,bioAmount:p.bioAmount,bioFeed:p.bioFeed,
    bioKill:p.bioKill,bioSpeed:p.bioSpeed,bioVeins:p.bioVeins};
}
export function remixBioRot(state,rng=Math.random){
  const n=Number(rng());
  const r=Number.isFinite(n)?Math.min(1-Number.EPSILON,Math.max(0,n)):0;
  const next=bioRotPresets[Math.floor(r*bioRotPresets.length)];
  return applyBioRotPreset(state,next.name);
}
