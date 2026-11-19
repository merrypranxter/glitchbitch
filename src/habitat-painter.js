// Habitat Graffiti: a bounded, non-destructive second touch system.
// Painted colony seeds are recipe data. They never mutate warp-force marks.
// Coordinates are bottom-up normalized UV to match the GL and export canvases.
export const MAX_HABITAT_STAMPS=16;
export const habitatTools=[
  "Plant A","Plant B","Move Colony","Erase Colony",
];
const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
export const habitatDistance=(a,b,aspect=1)=>
  Math.hypot((a.x-b.x)*aspect,a.y-b.y);
export function nearestColony(stamps,p,aspect=1){
  let index=-1,best=.145;
  for(let i=0;i<stamps.length;i++){
    const candidate=stamps[i];
    const d=habitatDistance(candidate,p,aspect);
    if(d<best){best=d;index=i;}
  }
  return index;
}
export function makeColony(state,p,parent=0){
  const id=globalThis.crypto?.randomUUID?.()||
    "colony-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,9);
  return {id,x:clamp(p.x,0,1),y:clamp(p.y,0,1),
    radius:clamp((state.habitatBrushRadius??20)/100,.05,.45),
    parent:parent===1?1:0};
}
export function plantColony(state,p,parent=0){
  const stamps=state.habitatStamps||[];
  if(stamps.length>=MAX_HABITAT_STAMPS)return state;
  const colony=makeColony(state,p,parent);
  const fields=parent===1
    ? {atmoBMaskMode:"Painted colonies",atmoBAmount:Math.max(65,state.atmoBAmount)}
    : {atmoMaskMode:"Painted colonies",atmoAmount:Math.max(65,state.atmoAmount)};
  return {...state,...fields,habitatStamps:[...stamps,colony]};
}
export function clearColonies(state,parent=null){
  return {...state,habitatStamps:(state.habitatStamps||[])
    .filter(s=>parent!==null&&s.parent!==parent)};
}
export class HabitatSession {
  constructor(state,tool,p,aspect=1,targetId=null){
    this.base=state;
    this.draft=state;
    this.tool=tool;
    this.aspect=aspect;
    this.pointers=new Map([[p.id,p]]);
    this.target=(state.habitatStamps||[]).findIndex(s=>s.id===targetId);
    this.suspended=false;
    this.last=null;
    if(this.target<0)this.target=nearestColony(state.habitatStamps||[],p,aspect);
    this.apply(p,true);
  }
  apply(p,first=false){
    const stamps=this.draft.habitatStamps||[];
    if(this.tool==="Plant A"||this.tool==="Plant B"){
      const parent=this.tool==="Plant A"?0:1;
      const spacing=Math.max(.032,(this.base.habitatBrushRadius||20)/100*.32);
      if(!first && this.last && habitatDistance(this.last,p,this.aspect)<spacing)return;
      // Keep the first stamp and the complete undo transaction while limiting
      // a finger stroke to a safe GPU-friendly seed count.
      if(stamps.length>=MAX_HABITAT_STAMPS)return;
      this.draft=plantColony(this.draft,p,parent);
      this.target=this.draft.habitatStamps.length-1;
      this.last=p;
    }else if(this.tool==="Move Colony" && this.target>=0){
      this.draft={...this.draft,habitatStamps:stamps.map((s,i)=>
        i===this.target?{...s,x:clamp(p.x,0,1),y:clamp(p.y,0,1)}:s)};
    }else if(this.tool==="Erase Colony"){
      const index=nearestColony(stamps,p,this.aspect);
      if(index>=0){
        this.draft={...this.draft,habitatStamps:stamps.filter((_,i)=>i!==index)};
        this.target=-1;
      }
    }
  }
  add(p){
    if(this.pointers.size>=2)return;
    this.pointers.set(p.id,p);
    if(this.pointers.size>=2)this.suspended=true;
  }
  move(p){
    if(!this.pointers.has(p.id))return;
    this.pointers.set(p.id,p);
    if(this.suspended||this.pointers.size!==1)return;
    this.apply(p);
  }
  release(id){
    this.pointers.delete(id);
    return this.pointers.size===0;
  }
}
