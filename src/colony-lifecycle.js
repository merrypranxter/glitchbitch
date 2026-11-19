// COLONY WARS: optional continuous-time lifecycle for planted A/B habitats.
// No frame-memory buffer: each frame is a pure function of recipe + time,
// so stills and GIF/MP4 encode the same result as the live preview.
export const colonyLifeModes=[
  "Still",
  "Germinate & bloom",
  "Breathe",
  "Wither & return",
  "Territory war",
];
export const colonyLifeControls=[
  "colonyLifeAmount","colonyLifeSpeed","colonyFrontGlow","colonyCompetition",
];
export const colonyLifePresets=[
  {name:"Neon Petri Conquest",colonyLifeMode:"Territory war",
    colonyLifeAmount:94,colonyLifeSpeed:53,colonyFrontGlow:86,colonyCompetition:87},
  {name:"Germination Opera",colonyLifeMode:"Germinate & bloom",
    colonyLifeAmount:97,colonyLifeSpeed:38,colonyFrontGlow:94,colonyCompetition:22},
  {name:"Breathing Polyp Colony",colonyLifeMode:"Breathe",
    colonyLifeAmount:81,colonyLifeSpeed:64,colonyFrontGlow:51,colonyCompetition:0},
  {name:"Withering Stained Glass",colonyLifeMode:"Wither & return",
    colonyLifeAmount:94,colonyLifeSpeed:48,colonyFrontGlow:90,colonyCompetition:0},
  {name:"Phosphor Border War",colonyLifeMode:"Territory war",
    colonyLifeAmount:99,colonyLifeSpeed:86,colonyFrontGlow:98,colonyCompetition:100},
];
export function applyColonyLifePreset(state,name){
  const recipe=colonyLifePresets.find(p=>p.name===name);
  if(!recipe)return state;
  const {name:ignored,...controls}=recipe;
  return {...state,...controls};
}
export function stopColonyLife(state){
  return {...state,colonyLifeAmount:0,colonyFrontGlow:0,colonyCompetition:0};
}

// Pure JS mirror of the phase law used in shader. Useful for testing
// seam continuity, clock speed and parent-offset semantics without a GPU.
export function colonyGrowthMultiplier(state,time,index=0,parent=0){
  const mode=colonyLifeModes.indexOf(state.colonyLifeMode);
  const amount=(state.colonyLifeAmount||0)/100;
  if(mode<=0||amount<=0)return 1;
  const speed=(state.colonyLifeSpeed||0)/100;
  const t=time*(.2+speed*1.8)+index*.53+parent*Math.PI;
  const wave=.5+.5*Math.sin(t-Math.PI/2);
  const smooth=wave*wave*(3-2*wave);
  let target=1;
  if(mode===1)target=.12+1.25*smooth;
  else if(mode===2)target=1+.22*Math.sin(t)+.085*Math.sin(t*2+index*.9);
  else if(mode===3)target=.08+1.42*Math.pow(smooth,1.7);
  else if(mode===4)target=.58+.92*smooth;
  return Math.max(.045,1+(target-1)*amount);
}
