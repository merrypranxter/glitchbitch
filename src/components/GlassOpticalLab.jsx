import React from "react";
import {Dices} from "lucide-react";
import {Select,Toggle} from "./Controls";
import {opticalSpecimens,glassLabGroups,applyOpticalSpecimen,remixOpticalLab,glassLabNotice} from "../glass-optical-lab.js";
export default function GlassOpticalLab({history}){
 const s=history.state;
 const [specimen,setSpecimen]=React.useState(opticalSpecimens[0].name);
 const [style,setStyle]=React.useState("Curated");
 const [intensity,setIntensity]=React.useState("Wild");
 const [locks,setLocks]=React.useState([]);
 const notice=glassLabNotice(s,locks);
 const allLocked=locks.length===glassLabGroups.length;
 const toggle=(id,on)=>setLocks(old=>on?[...new Set([...old,id])]:old.filter(x=>x!==id));
 return <details className="effect-explanation"><summary>Optical specimen lab · recipes & locks</summary>
   <p className="control-note">Discover full glass combinations while keeping the original artwork. Locks apply to these two lab actions only; manual sliders and other shuffles still work normally.</p>
   <Select label="Optical specimen" value={specimen} onChange={setSpecimen}>
    {opticalSpecimens.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
   </Select>
   <p className="control-note">{opticalSpecimens.find(p=>p.name===specimen)?.note}</p>
   <button type="button" className="button secondary" disabled={allLocked} onClick={()=>history.change(x=>applyOpticalSpecimen(x,specimen,locks))}>Apply specimen</button>
   <Select label="Remix style" value={style} onChange={setStyle}><option>Curated</option><option>Experimental</option></Select>
   <Select label="Parameter intensity" value={intensity} onChange={setIntensity}><option>Gentle</option><option>Balanced</option><option>Wild</option></Select>
   <details><summary>Keep these glass layers · {locks.length} locked</summary>
    {glassLabGroups.map(g=><Toggle key={g.id} label={g.label} checked={locks.includes(g.id)} onChange={on=>toggle(g.id,on)}/>)}
    <div className="pane-actions"><button type="button" className="button secondary" onClick={()=>setLocks(glassLabGroups.map(g=>g.id))}>Lock all</button><button type="button" className="button secondary" onClick={()=>setLocks([])}>Unlock all</button></div>
   </details>
   <button type="button" className="button primary" disabled={allLocked} onClick={()=>history.change(x=>remixOpticalLab(x,Math.random,{locks,style,intensity}))}><Dices size={15}/> Remix unlocked glass</button>
   {notice&&<p className="control-note" role="status">{notice}</p>}
   <p className="control-note">One Undo per action. Gentle and Balanced soften numeric parameter changes, but can still switch unlocked mathematical modes.</p>
 </details>;
}
