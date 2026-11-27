import React from "react";
import {Parameter,Select} from "./Controls";
import {initial} from "../data.js";
import {readCategoryLocks,writeCategoryLocks,protectCategorySettings} from "../category-locks.js";
const keys=["lifeOptics","lifeOpticMode","lifeOpticPower","lifeOpticDispersion","lifeAppendage","lifeAppendageLength","lifeAppendageMotion","lifeAppendageDetail","lifeMembrane","lifeShell","lifePores","lifeSpecies","lifeBehavior","lifeForce","lifeCollision","lifeElasticity","lifeAmount","lifePopulation","lifeSize","lifeSpeed","lifeVariation","lifeForm","lifeHue","lifeDetail","lifePulse","lifeBlend"];
export default function LifeformsInspector({history}){
 const [locks,setLocks]=React.useState(readCategoryLocks);
 const locked=!!locks.Lifeforms;
 return <section className="weaving-workspace" aria-label="Lifeforms workspace">
 <div className="ecosystem-dock weaving-dock"><strong>LIFEFORMS · THE PETRI DISH</strong>
 <p className="control-note">Seeded fixed-step physics with wall and optional body collisions.</p>
 <div className="pane-actions">
 <button className="button primary" disabled={locked} onClick={()=>history.change(s=>protectCategorySettings(s,{...s,...Object.fromEntries(keys.map(k=>[k,15+Math.random()*75]))}))}>Shuffle Lifeforms</button>
 <button className="button secondary" onClick={()=>{const next={...locks,Lifeforms:!locked};writeCategoryLocks(next);setLocks(next)}}>{locked?"Unlock":"Lock"}</button>
 <button className="button secondary" disabled={locked} onClick={()=>history.change(s=>({...s,...Object.fromEntries(keys.map(k=>[k,initial[k]]))}))}>Reset</button>
 </div></div>
 <details open className="effect-explanation"><summary>Population and motion</summary>
<Select label="Behavior" value={String(Math.floor(Math.min(99.9,history.state.lifeBehavior??0)*9/100))} onChange={v=>history.change(s=>({...s,lifeBehavior:(Number(v)+.5)*100/9}))}>{["Billiard","Drunken amoeba","Orbital","Magnetic","Murmuration","Vortex currents","Hyperactive","Predator / prey","Mixed population"].map((n,i)=><option key={n} value={String(i)}>{n}</option>)}</Select>
<Parameter label="Behavior strength" name="lifeForce" history={history}/>
<Parameter label="Body collision strength" name="lifeCollision" history={history}/>
<Parameter label="Elasticity" name="lifeElasticity" history={history}/>
<Parameter label="Presence" name="lifeAmount" history={history}/>
<Parameter label="Population (1–24)" name="lifePopulation" history={history}/>
<Parameter label="Body size" name="lifeSize" history={history}/>
<Parameter label="Bounce speed" name="lifeSpeed" history={history}/>
<Parameter label="Size variation" name="lifeVariation" history={history}/>
 </details><details open className="effect-explanation"><summary>Appearance</summary>
<Parameter label="Shell rim" name="lifeShell" history={history}/>
<Parameter label="Shell perforation" name="lifePores" history={history}/>
<Parameter label="Species diversity" name="lifeSpecies" history={history}/>
 <Select label="Internal structure" value={String(Math.floor(Math.min(99.9,history.state.lifeForm)*12/100))} onChange={v=>history.change(s=>({...s,lifeForm:(Number(v)+.5)*100/12}))}>{["Retinal rings","Radial spokes","Diatomic ripples","Logarithmic spiral","Radiolarian cage","Triangular diatom","Hexagonal diatom","Silica lattice","Seven-point rosette","Fractal star","Segmented capsule","Mixed species"].map((n,i)=><option key={n} value={String(i)}>{n}</option>)}</Select>
<Parameter label="Palette phase" name="lifeHue" history={history}/>
<Parameter label="Internal detail" name="lifeDetail" history={history}/>
<Parameter label="Breathing" name="lifePulse" history={history}/>
<Parameter label="Difference interaction" name="lifeBlend" history={history}/>
 </details><details className="effect-explanation"><summary>Alien appendages</summary>
 <Select label="Appendage type" value={String(Math.floor(Math.min(99.9,history.state.lifeAppendageDetail??0)*4/100))} onChange={v=>history.change(s=>({...s,lifeAppendageDetail:(Number(v)+.5)*25}))}>{["Cilia","Flagellum","Undulating tentacles","Medusa tendrils"].map((n,i)=><option key={n} value={String(i)}>{n}</option>)}</Select>
<Parameter label="Appendage presence" name="lifeAppendage" history={history}/>
<Parameter label="Appendage length" name="lifeAppendageLength" history={history}/>
<Parameter label="Wriggle speed" name="lifeAppendageMotion" history={history}/>
<Parameter label="Membrane pulsation" name="lifeMembrane" history={history}/>
 </details><details className="effect-explanation"><summary>Optical parasites</summary>
 <Select label="Optical mode" value={String(Math.floor(Math.min(99.9,history.state.lifeOpticMode??0)*7/100))} onChange={v=>history.change(s=>({...s,lifeOpticMode:(Number(v)+.5)*100/7}))}>{["Magnifying lens","Iridescent film","Prismatic dispersion","False color","Inverted reality","Ripple glass","Chromatic aberration"].map((n,i)=><option key={n} value={String(i)}>{n}</option>)}</Select>
 <Parameter label="Optical presence" name="lifeOptics" history={history}/>
 <Parameter label="Optical power" name="lifeOpticPower" history={history}/>
 <Parameter label="Spectral separation" name="lifeOpticDispersion" history={history}/>
 </details></section>
}
