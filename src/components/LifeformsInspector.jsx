import React from "react";
import {Parameter,Select} from "./Controls";
import {initial} from "../data.js";
import {readCategoryLocks,writeCategoryLocks,protectCategorySettings} from "../category-locks.js";
const keys=["lifeAmount","lifePopulation","lifeSize","lifeSpeed","lifeVariation","lifeForm","lifeHue","lifeDetail","lifePulse","lifeBlend"];
export default function LifeformsInspector({history}){
 const [locks,setLocks]=React.useState(readCategoryLocks);
 const locked=!!locks.Lifeforms;
 return <section className="weaving-workspace" aria-label="Lifeforms workspace">
 <div className="ecosystem-dock weaving-dock"><strong>LIFEFORMS · THE PETRI DISH</strong>
 <p className="control-note">Seeded independent wall-bouncing entities. Motion is calculated from timeline time, not accumulated frame steps.</p>
 <div className="pane-actions">
 <button className="button primary" disabled={locked} onClick={()=>history.change(s=>protectCategorySettings(s,{...s,...Object.fromEntries(keys.map(k=>[k,15+Math.random()*75]))}))}>Shuffle Lifeforms</button>
 <button className="button secondary" onClick={()=>{const next={...locks,Lifeforms:!locked};writeCategoryLocks(next);setLocks(next)}}>{locked?"Unlock":"Lock"}</button>
 <button className="button secondary" disabled={locked} onClick={()=>history.change(s=>({...s,...Object.fromEntries(keys.map(k=>[k,initial[k]]))}))}>Reset</button>
 </div></div>
 <details open className="effect-explanation"><summary>Population and motion</summary>
<Parameter label="Presence" name="lifeAmount" history={history}/>
<Parameter label="Population (1–24)" name="lifePopulation" history={history}/>
<Parameter label="Body size" name="lifeSize" history={history}/>
<Parameter label="Bounce speed" name="lifeSpeed" history={history}/>
<Parameter label="Size variation" name="lifeVariation" history={history}/>
 </details><details open className="effect-explanation"><summary>Appearance</summary>
 <Select label="Internal structure" value={String(Math.floor(Math.min(99.9,history.state.lifeForm)*4/100))} onChange={v=>history.change(s=>({...s,lifeForm:(Number(v)+.5)*25}))}>{["Retinal rings","Radial spokes","Diatomic ripples","Logarithmic spiral"].map((n,i)=><option key={n} value={String(i)}>{n}</option>)}</Select>
<Parameter label="Palette phase" name="lifeHue" history={history}/>
<Parameter label="Internal detail" name="lifeDetail" history={history}/>
<Parameter label="Breathing" name="lifePulse" history={history}/>
<Parameter label="Difference interaction" name="lifeBlend" history={history}/>
 </details></section>
}
