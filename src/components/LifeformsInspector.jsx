import React from "react";
import {lifeGroups,shuffleLife,lifeRecipes} from "../life-recipes.js";
import {Parameter,Select} from "./Controls";
import {initial} from "../data.js";
import {readCategoryLocks,writeCategoryLocks,protectCategorySettings} from "../category-locks.js";
const keys=Object.values(lifeGroups).flat();
export default function LifeformsInspector({history}){
 const [locks,setLocks]=React.useState(readCategoryLocks);
 const locked=!!locks.Lifeforms;
 const apply=patch=>history.change(s=>protectCategorySettings(s,{...s,...patch}));
 const shuffle=group=>apply(shuffleLife(Math.random,group));
 const groupButton=group=><button className="button secondary" disabled={locked} onClick={()=>shuffle(group)}>Shuffle {group}</button>;
 return <section className="weaving-workspace" aria-label="Lifeforms workspace">
 <div className="ecosystem-dock weaving-dock"><strong>LIFEFORMS · THE PETRI DISH</strong>
 <p className="control-note">Seeded fixed-step physics with wall and optional body collisions.</p>
 <div className="pane-actions">
 <button className="button primary" disabled={locked} onClick={()=>shuffle()}>Shuffle Lifeforms</button>
 <button className="button secondary" onClick={()=>{const next={...locks,Lifeforms:!locked};writeCategoryLocks(next);setLocks(next)}}>{locked?"Unlock":"Lock"}</button>
 <button className="button secondary" disabled={locked} onClick={()=>history.change(s=>({...s,...Object.fromEntries(keys.map(k=>[k,initial[k]]))}))}>Reset</button>
 </div><Select label="Creature recipe" value="" onChange={v=>{if(!locked&&lifeRecipes[v])apply({...Object.fromEntries(keys.map(k=>[k,initial[k]])),...lifeRecipes[v]})}}><option value="">Choose a recipe…</option>{Object.keys(lifeRecipes).map(n=><option key={n} value={n}>{n}</option>)}</Select></div>
 <details open className="effect-explanation"><summary>Population and motion</summary>
{groupButton("motion")}
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
{groupButton("appearance")}
<Parameter label="Shell rim" name="lifeShell" history={history}/>
<Parameter label="Shell perforation" name="lifePores" history={history}/>
<Parameter label="Species diversity" name="lifeSpecies" history={history}/>
 <Select label="Internal structure" value={String(Math.floor(Math.min(99.9,history.state.lifeForm)*12/100))} onChange={v=>history.change(s=>({...s,lifeForm:(Number(v)+.5)*100/12}))}>{["Retinal rings","Radial spokes","Diatomic ripples","Logarithmic spiral","Radiolarian cage","Triangular diatom","Hexagonal diatom","Silica lattice","Seven-point rosette","Fractal star","Segmented capsule","Mixed species"].map((n,i)=><option key={n} value={String(i)}>{n}</option>)}</Select>
<Parameter label="Palette phase" name="lifeHue" history={history}/>
<Parameter label="Internal detail" name="lifeDetail" history={history}/>
<Parameter label="Breathing" name="lifePulse" history={history}/>
<Parameter label="Difference interaction" name="lifeBlend" history={history}/>
 </details><details className="effect-explanation"><summary>Alien appendages</summary>
{groupButton("appendages")}
 <Select label="Appendage type" value={String(Math.floor(Math.min(99.9,history.state.lifeAppendageDetail??0)*4/100))} onChange={v=>history.change(s=>({...s,lifeAppendageDetail:(Number(v)+.5)*25}))}>{["Cilia","Flagellum","Undulating tentacles","Medusa tendrils"].map((n,i)=><option key={n} value={String(i)}>{n}</option>)}</Select>
<Parameter label="Appendage presence" name="lifeAppendage" history={history}/>
<Parameter label="Appendage length" name="lifeAppendageLength" history={history}/>
<Parameter label="Wriggle speed" name="lifeAppendageMotion" history={history}/>
<Parameter label="Membrane pulsation" name="lifeMembrane" history={history}/>
 </details><details className="effect-explanation"><summary>Optical parasites</summary>
{groupButton("optics")}
 <Select label="Optical mode" value={String(Math.floor(Math.min(99.9,history.state.lifeOpticMode??0)*7/100))} onChange={v=>history.change(s=>({...s,lifeOpticMode:(Number(v)+.5)*100/7}))}>{["Magnifying lens","Iridescent film","Prismatic dispersion","False color","Inverted reality","Ripple glass","Chromatic aberration"].map((n,i)=><option key={n} value={String(i)}>{n}</option>)}</Select>
 <Parameter label="Optical presence" name="lifeOptics" history={history}/>
 <Parameter label="Optical power" name="lifeOpticPower" history={history}/>
 <Parameter label="Spectral separation" name="lifeOpticDispersion" history={history}/>
 </details><details className="effect-explanation"><summary>Mitosis and evolution</summary>
{groupButton("evolution")}
 <p className="control-note">Population becomes the starting count; offspring share the 24-body limit.</p>
<Parameter label="Lifecycle activity" name="lifeEvolution" history={history}/>
<Parameter label="Division rate" name="lifeBirthRate" history={history}/>
<Parameter label="Mutation" name="lifeMutation" history={history}/>
<Parameter label="Mortality" name="lifeMortality" history={history}/>
 </details><details className="effect-explanation"><summary>Thread secretion</summary>
{groupButton("threads")}
 <p className="control-note">Recent movement trails from up to eight organisms.</p>
 <Select label="Thread style" value={String(Math.floor(Math.min(99.9,history.state.lifeTrailStyle??0)*5/100))} onChange={v=>history.change(s=>({...s,lifeTrailStyle:(Number(v)+.5)*20}))}>{["Silk filament","Running stitch","Double ribbon","Beaded thread","Luminous filament"].map((n,i)=><option key={n} value={String(i)}>{n}</option>)}</Select>
<Parameter label="Thread presence" name="lifeTrail" history={history}/>
<Parameter label="Trail length" name="lifeTrailLength" history={history}/>
<Parameter label="Thread thickness" name="lifeTrailWidth" history={history}/>
 </details><details className="effect-explanation"><summary>Ecological vandalism</summary>
 {groupButton("impact")}
 <Select label="Environmental effect" value={String(Math.floor(Math.min(99.9,history.state.lifeImpactMode??0)*5/100))} onChange={v=>history.change(s=>({...s,lifeImpactMode:(Number(v)+.5)*20}))}>{["Chromatic aura","Pigment disturbance","Pulsating shockwaves","Gravity lens","Texture infection"].map((n,i)=><option key={n} value={String(i)}>{n}</option>)}</Select>
 <Parameter label="Environmental presence" name="lifeImpact" history={history}/>
 <Parameter label="Influence radius" name="lifeImpactReach" history={history}/>
 <Parameter label="Disturbance strength" name="lifeImpactPower" history={history}/>
 </details><details className="effect-explanation"><summary>Collision alchemy</summary>
 {groupButton("alchemy")}
 <Select label="Impact style" value={String(Math.floor(Math.min(99.9,history.state.lifeAlchemyMode??0)*5/100))} onChange={v=>history.change(s=>({...s,lifeAlchemyMode:(Number(v)+.5)*20}))}>{["Chromatic burst","Interference ripples","Geometric spores","Embroidery sparks","Collision scars"].map((n,i)=><option key={n} value={String(i)}>{n}</option>)}</Select>
 <Parameter label="Impact presence" name="lifeAlchemy" history={history}/>
 <Parameter label="Impact size" name="lifeAlchemySize" history={history}/>
 <Parameter label="Impact lifetime" name="lifeAlchemyDuration" history={history}/>
 </details><details className="effect-explanation"><summary>Symbiotic networks</summary>
 {groupButton("network")}
 <Select label="Connection style" value={String(Math.floor(Math.min(99.9,history.state.lifeNetworkMode??0)*5/100))} onChange={v=>history.change(s=>({...s,lifeNetworkMode:(Number(v)+.5)*20}))}>{["Constellation","Stitched bonds","Curved field lines","Double silk","Oscillating nerve fibers"].map((n,i)=><option key={n} value={String(i)}>{n}</option>)}</Select>
 <Parameter label="Network presence" name="lifeNetwork" history={history}/>
 <Parameter label="Connection distance" name="lifeNetworkReach" history={history}/>
 <Parameter label="Fiber thickness" name="lifeNetworkWidth" history={history}/>
 </details></section>
}
