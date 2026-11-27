import React from "react";
import {Shuffle,LockKeyhole,Unlock,EyeOff} from "lucide-react";
import {Parameter,Select} from "./Controls";
import {initial} from "../data.js";
import {shuffleToppers,clearToppers,remixTopper,resetTopper,topperKeys} from "../toppers.js";
import {readCategoryLocks,writeCategoryLocks,protectCategorySettings} from "../category-locks.js";
export default function ToppersInspector({history}){
 const [allowHeavy,setAllowHeavy]=React.useState(false);
 const [density,setDensity]=React.useState("Balanced");
 const [locks,setLocks]=React.useState(readCategoryLocks);
 const locked=!!locks.Toppers;
 const toggle=()=>{const next={...locks,Toppers:!locked};writeCategoryLocks(next);setLocks(next);};
 return <section className="weaving-workspace" aria-label="Toppers workspace">
  <div className="ecosystem-dock weaving-dock">
   <strong>TOPPERS · THE SPRINKLE LAB</strong>
   <p className="control-note">Small accents on your existing artwork. These controls share the original effect settings, not duplicate layers.</p>
   <Select label="Topper density" value={density} onChange={setDensity}>{["Sparse","Balanced","Maximalist"].map(v=><option key={v}>{v}</option>)}</Select>
   <label><input type="checkbox" checked={allowHeavy} onChange={e=>setAllowHeavy(e.target.checked)}/> Include expensive portals and frame memory in shuffle</label>
   <p className="control-note">{topperKeys.filter(k=>history.state[k]>0).length} of {topperKeys.length} toppers active</p>
   <div className="pane-actions">
    <button type="button" className="button primary" disabled={locked} onClick={()=>history.change(x=>protectCategorySettings(x,shuffleToppers(x,Math.random,density,allowHeavy)))}><Shuffle size={15}/> Shuffle toppers</button>
    <button type="button" className="button secondary" aria-pressed={locked} onClick={toggle}>{locked?<Unlock size={14}/>:<LockKeyhole size={14}/>} {locked?"Unlock":"Lock"}</button>
    <button type="button" className="button secondary" disabled={locked} onClick={()=>history.change(x=>protectCategorySettings(x,clearToppers(x)))}><EyeOff size={14}/> Clear toppers</button>
   </div>
   <p className="control-note">Locks protect randomization; manual sliders remain editable. Other category locks can preserve overlapping effects.</p>
  </div>
  <details open className="effect-explanation"><summary>Classic signal sprinkles</summary>
   <Parameter label="Broadcast bars" name="broadcast" history={history}/>
   <div className="pane-actions"><button type="button" className="button secondary" disabled={locked} onClick={()=>history.change(x=>protectCategorySettings(x,remixTopper(x,"broadcast",Math.random,density)))}>Remix</button><button type="button" className="button secondary" disabled={locked} onClick={()=>history.change(x=>protectCategorySettings(x,resetTopper(x,"broadcast",initial)))}>Reset</button></div>
   <Parameter label="Error windows" name="windowCascade" history={history}/>
   <div className="pane-actions"><button type="button" className="button secondary" disabled={locked} onClick={()=>history.change(x=>protectCategorySettings(x,remixTopper(x,"windowCascade",Math.random,density)))}>Remix</button><button type="button" className="button secondary" disabled={locked} onClick={()=>history.change(x=>protectCategorySettings(x,resetTopper(x,"windowCascade",initial)))}>Reset</button></div>
   <Parameter label="Glitter" name="glitter" history={history}/>
   <div className="pane-actions"><button type="button" className="button secondary" disabled={locked} onClick={()=>history.change(x=>protectCategorySettings(x,remixTopper(x,"glitter",Math.random,density)))}>Remix</button><button type="button" className="button secondary" disabled={locked} onClick={()=>history.change(x=>protectCategorySettings(x,resetTopper(x,"glitter",initial)))}>Reset</button></div>
  </details>
  <details open className="effect-explanation"><summary>Transmission shrapnel</summary>
   <Parameter label="Shrapnel presence" name="topperShrapnel" history={history}/>
   <div className="pane-actions"><button type="button" className="button secondary" disabled={locked} onClick={()=>history.change(x=>protectCategorySettings(x,remixTopper(x,"topperShrapnel",Math.random,density)))}>Remix</button><button type="button" className="button secondary" disabled={locked} onClick={()=>history.change(x=>protectCategorySettings(x,resetTopper(x,"topperShrapnel",initial)))}>Reset</button></div>
   <Parameter label="Fragment density" name="topperDensity" history={history}/>
   <Parameter label="Fragment scale" name="topperScale" history={history}/>
   <Parameter label="Drift motion" name="topperMotion" history={history}/>
   <Parameter label="Palette phase" name="topperHue" history={history}/>
   <Select label="Fragment geometry" value={String(Math.floor(Math.min(99.9,history.state.topperShape)*4/100))} onChange={v=>history.change(s=>({...s,topperShape:(Number(v)+.5)*100/4}))}>{["Bars","Interrupted","Angular","Slivers"].map((name,i)=><option key={name} value={String(i)}>{name}</option>)}</Select>
   <Parameter label="Color interaction" name="topperBlend" history={history}/>
  </details>
  <details className="effect-explanation"><summary>Phosphene jewels</summary>
   <Parameter label="Jewel presence" name="topperJewel" history={history}/>
   <Select label="Jewel outline" value={String(Math.floor(Math.min(99.9,history.state.topperJewelOutline)*5/100))} onChange={v=>history.change(s=>({...s,topperJewelOutline:(Number(v)+.5)*100/5}))}>{["Circle","Triangle","Hexagon","Square","Mixed"].map((name,i)=><option key={name} value={String(i)}>{name}</option>)}</Select>
   <div className="pane-actions"><button type="button" className="button secondary" disabled={locked} onClick={()=>history.change(x=>protectCategorySettings(x,remixTopper(x,"topperJewel",Math.random,density)))}>Remix</button><button type="button" className="button secondary" disabled={locked} onClick={()=>history.change(x=>protectCategorySettings(x,resetTopper(x,"topperJewel",initial)))}>Reset</button></div>
   <Parameter label="Jewel density" name="topperJewelDensity" history={history}/>
   <Parameter label="Jewel scale" name="topperJewelScale" history={history}/>
   <Parameter label="Retinal drift" name="topperJewelMotion" history={history}/>
   <Parameter label="Interference detail" name="topperJewelDetail" history={history}/>
   <Parameter label="Palette phase" name="topperJewelHue" history={history}/>
   <Select label="Retinal geometry" value={String(Math.floor(Math.min(99.9,history.state.topperJewelForm)*4/100))} onChange={v=>history.change(s=>({...s,topperJewelForm:(Number(v)+.5)*100/4}))}>{["Rings","Spirals","Cobwebs","Rosettes"].map((name,i)=><option key={name} value={String(i)}>{name}</option>)}</Select>
   <Parameter label="Complement interaction" name="topperJewelBlend" history={history}/>
   <details className="effect-explanation"><summary>Independent jewel animation</summary>
   <Parameter label="Size breathing" name="topperJewelPulse" history={history}/>
   <Parameter label="Breathing speed" name="topperJewelPulseRate" history={history}/>
   <Parameter label="Twinkle / vanish" name="topperJewelTwinkle" history={history}/>
   <Parameter label="Twinkle speed" name="topperJewelTwinkleRate" history={history}/>
   <Parameter label="Spin amount" name="topperJewelSpin" history={history}/>
   <Parameter label="Spin speed" name="topperJewelSpinRate" history={history}/>
   <Select label="Spin direction" value={String(Math.floor(Math.min(99.9,history.state.topperJewelDirection)*3/100))} onChange={v=>history.change(s=>({...s,topperJewelDirection:(Number(v)+.5)*100/3}))}>{["Clockwise","Counterclockwise","Mixed directions"].map((name,i)=><option key={name} value={String(i)}>{name}</option>)}</Select>
   <Parameter label="Individual timing variation" name="topperJewelIndependence" history={history}/>
   </details>
  </details>
  <details className="effect-explanation"><summary>False-color islands</summary>
   <Parameter label="Island presence" name="topperIsland" history={history}/>
   <div className="pane-actions"><button type="button" className="button secondary" disabled={locked} onClick={()=>history.change(x=>protectCategorySettings(x,remixTopper(x,"topperIsland",Math.random,density)))}>Remix</button><button type="button" className="button secondary" disabled={locked} onClick={()=>history.change(x=>protectCategorySettings(x,resetTopper(x,"topperIsland",initial)))}>Reset</button></div>
   <Parameter label="Island density" name="topperIslandDensity" history={history}/>
   <Parameter label="Island scale" name="topperIslandScale" history={history}/>
   <Parameter label="Island motion" name="topperIslandMotion" history={history}/>
   <Select label="Island shape" value={String(Math.floor(Math.min(99.9,history.state.topperIslandForm)*4/100))} onChange={v=>history.change(s=>({...s,topperIslandForm:(Number(v)+.5)*100/4}))}>{["Circle","Rectangle","Diamond","Organic"].map((name,i)=><option key={name} value={String(i)}>{name}</option>)}</Select>
   <Select label="Color mapping" value={String(Math.floor(Math.min(99.9,history.state.topperIslandMapping)*5/100))} onChange={v=>history.change(s=>({...s,topperIslandMapping:(Number(v)+.5)*100/5}))}>{["Luminance","Spectral cosine","Opponent","Quantized","Complement"].map((name,i)=><option key={name} value={String(i)}>{name}</option>)}</Select>
   <Parameter label="Color phase" name="topperIslandHue" history={history}/>
   <Parameter label="Edge feather" name="topperIslandFeather" history={history}/>
   <details className="effect-explanation"><summary>Independent island animation</summary>
   <Parameter label="Size breathing" name="topperIslandPulse" history={history}/>
   <Parameter label="Breathing speed" name="topperIslandPulseRate" history={history}/>
   <Parameter label="Twinkle / vanish" name="topperIslandTwinkle" history={history}/>
   <Parameter label="Twinkle speed" name="topperIslandTwinkleRate" history={history}/>
   <Parameter label="Spin amount" name="topperIslandSpin" history={history}/>
   <Parameter label="Spin speed" name="topperIslandSpinRate" history={history}/>
   <Select label="Spin direction" value={String(Math.floor(Math.min(99.9,history.state.topperIslandSpinDirection)*3/100))} onChange={v=>history.change(s=>({...s,topperIslandSpinDirection:(Number(v)+.5)*100/3}))}>{["Clockwise","Counterclockwise","Mixed directions"].map((name,i)=><option key={name} value={String(i)}>{name}</option>)}</Select>
   <Parameter label="Individual timing variation" name="topperIslandIndependence" history={history}/>
   </details>
   <p className="control-note">Mapping: palette luminance, spectral-style cosine, opponent channels, quantized palette, complement/channel rotation.</p>
  </details>
  <details className="effect-explanation"><summary>Voronoi confetti</summary>
   <Parameter label="Confetti presence" name="topperVoronoi" history={history}/>
   <div className="pane-actions"><button type="button" className="button secondary" disabled={locked} onClick={()=>history.change(x=>protectCategorySettings(x,remixTopper(x,"topperVoronoi",Math.random,density)))}>Remix</button><button type="button" className="button secondary" disabled={locked} onClick={()=>history.change(x=>protectCategorySettings(x,resetTopper(x,"topperVoronoi",initial)))}>Reset</button></div>
   <Parameter label="Cell population" name="topperVoronoiDensity" history={history}/>
   <Parameter label="Cell scale" name="topperVoronoiScale" history={history}/>
   <Parameter label="Cell motion" name="topperVoronoiMotion" history={history}/>
   <Parameter label="Fragment gaps" name="topperVoronoiGap" history={history}/>
   <Select label="Interior texture" value={String(Math.floor(Math.min(99.9,history.state.topperVoronoiTexture)*4/100))} onChange={v=>history.change(s=>({...s,topperVoronoiTexture:(Number(v)+.5)*100/4}))}>{["Solid","Stripes","Rings","Stipple"].map((name,i)=><option key={name} value={String(i)}>{name}</option>)}</Select>
   <Parameter label="Palette phase" name="topperVoronoiHue" history={history}/>
   <Parameter label="Difference interaction" name="topperVoronoiBlend" history={history}/>
   <p className="control-note">Interior textures: solid, diagonal stripes, radial rings, stippled cells.</p>
  </details>
  <details className="effect-explanation"><summary>Spectral tape</summary>
   <Parameter label="Tape presence" name="topperTape" history={history}/>
   <div className="pane-actions"><button type="button" className="button secondary" disabled={locked} onClick={()=>history.change(x=>protectCategorySettings(x,remixTopper(x,"topperTape",Math.random,density)))}>Remix</button><button type="button" className="button secondary" disabled={locked} onClick={()=>history.change(x=>protectCategorySettings(x,resetTopper(x,"topperTape",initial)))}>Reset</button></div>
   <Parameter label="Tape population" name="topperTapeDensity" history={history}/>
   <Parameter label="Tape scale" name="topperTapeScale" history={history}/>
   <Parameter label="Optical motion" name="topperTapeMotion" history={history}/>
   <Parameter label="Strip width" name="topperTapeWidth" history={history}/>
   <Parameter label="Spectral dispersion" name="topperTapeDispersion" history={history}/>
   <Parameter label="Wavelength phase" name="topperTapeHue" history={history}/>
   <Parameter label="Palette mixing" name="topperTapePalette" history={history}/>
  </details>
  <details className="effect-explanation"><summary>Reality cutouts</summary>
   <Parameter label="Portal presence" name="topperPortal" history={history}/>
   <div className="pane-actions"><button type="button" className="button secondary" disabled={locked} onClick={()=>history.change(x=>protectCategorySettings(x,remixTopper(x,"topperPortal",Math.random,density)))}>Remix</button><button type="button" className="button secondary" disabled={locked} onClick={()=>history.change(x=>protectCategorySettings(x,resetTopper(x,"topperPortal",initial)))}>Reset</button></div>
   <Parameter label="Portal population" name="topperPortalDensity" history={history}/>
   <Parameter label="Portal scale" name="topperPortalScale" history={history}/>
   <Parameter label="Portal motion" name="topperPortalMotion" history={history}/>
   <Parameter label="Field zoom" name="topperPortalZoom" history={history}/>
   <Select label="Portal geometry" value={String(Math.floor(Math.min(99.9,history.state.topperPortalForm)*4/100))} onChange={v=>history.change(s=>({...s,topperPortalForm:(Number(v)+.5)*100/4}))}>{["Circle","Rectangle","Diamond","Radial"].map((name,i)=><option key={name} value={String(i)}>{name}</option>)}</Select>
   <Parameter label="Coordinate distortion" name="topperPortalWarp" history={history}/>
   <Parameter label="Color phase" name="topperPortalHue" history={history}/>
   <p className="control-note">Resamples the base mathematical field, not the fully composited artwork.</p>
  </details>
  <details className="effect-explanation"><summary>Temporal shrapnel</summary>
   <Parameter label="Temporal presence" name="topperTime" history={history}/>
   <div className="pane-actions"><button type="button" className="button secondary" disabled={locked} onClick={()=>history.change(x=>protectCategorySettings(x,remixTopper(x,"topperTime",Math.random,density)))}>Remix</button><button type="button" className="button secondary" disabled={locked} onClick={()=>history.change(x=>protectCategorySettings(x,resetTopper(x,"topperTime",initial)))}>Reset</button></div>
   <Parameter label="Fragment population" name="topperTimeDensity" history={history}/>
   <Parameter label="Fragment scale" name="topperTimeScale" history={history}/>
   <Parameter label="Temporal pulse" name="topperTimeMotion" history={history}/>
   <Parameter label="Memory persistence" name="topperTimeHold" history={history}/>
   <Parameter label="History displacement" name="topperTimeSlip" history={history}/>
   <Select label="Fragment geometry" value={String(Math.floor(Math.min(99.9,history.state.topperTimeForm)*3/100))} onChange={v=>history.change(s=>({...s,topperTimeForm:(Number(v)+.5)*100/3}))}>{["Bars","Circle","Diamond"].map((name,i)=><option key={name} value={String(i)}>{name}</option>)}</Select>
   <Parameter label="Chroma separation" name="topperTimeChroma" history={history}/>
   <p className="control-note">Uses actual previous-frame feedback; history accumulates while playing.</p>
  </details>
  <details className="effect-explanation"><summary>Hexagonal confetti</summary>
   <div className="pane-actions"><button type="button" className="button secondary" disabled={locked} onClick={()=>history.change(x=>protectCategorySettings(x,remixTopper(x,"topperHex",Math.random,density)))}>Remix</button><button type="button" className="button secondary" disabled={locked} onClick={()=>history.change(x=>protectCategorySettings(x,resetTopper(x,"topperHex",initial)))}>Reset</button></div>
   <Parameter label="Hex presence" name="topperHex" history={history}/>
   <Parameter label="Cell population" name="topperHexDensity" history={history}/>
   <Parameter label="Cell scale" name="topperHexScale" history={history}/>
   <Parameter label="Color motion" name="topperHexMotion" history={history}/>
   <Parameter label="Cell gaps" name="topperHexGap" history={history}/>
<Select label="Interior texture" value={String(Math.floor(Math.min(99.9,history.state.topperHexTexture)*5/100))} onChange={v=>history.change(s=>({...s,topperHexTexture:(Number(v)+.5)*100/5}))}>{["Solid","Nested hexagons","Stripes","Stipple","Hollow"].map((name,i)=><option key={name} value={String(i)}>{name}</option>)}</Select>
   <Parameter label="Palette phase" name="topperHexHue" history={history}/>
   <Parameter label="Difference interaction" name="topperHexBlend" history={history}/>
  </details>
  <details className="effect-explanation"><summary>Triangular confetti</summary>
   <div className="pane-actions"><button type="button" className="button secondary" disabled={locked} onClick={()=>history.change(x=>protectCategorySettings(x,remixTopper(x,"topperTri",Math.random,density)))}>Remix</button><button type="button" className="button secondary" disabled={locked} onClick={()=>history.change(x=>protectCategorySettings(x,resetTopper(x,"topperTri",initial)))}>Reset</button></div>
   <Parameter label="Triangle presence" name="topperTri" history={history}/>
   <Parameter label="Cell population" name="topperTriDensity" history={history}/>
   <Parameter label="Cell scale" name="topperTriScale" history={history}/>
   <Parameter label="Animation speed" name="topperTriMotion" history={history}/>
   <Parameter label="Cell gaps" name="topperTriGap" history={history}/>
<Select label="Interior texture" value={String(Math.floor(Math.min(99.9,history.state.topperTriTexture)*5/100))} onChange={v=>history.change(s=>({...s,topperTriTexture:(Number(v)+.5)*20}))}>{["Solid","Nested triangles","Stripes","Stipple","Hollow"].map((name,i)=><option key={name} value={String(i)}>{name}</option>)}</Select>
   <Parameter label="Palette phase" name="topperTriHue" history={history}/>
   <Parameter label="Difference interaction" name="topperTriBlend" history={history}/>
   <Parameter label="Independent breathing" name="topperTriPulse" history={history}/>
   <Parameter label="Independent twinkle" name="topperTriTwinkle" history={history}/>
  </details>
  <details className="effect-explanation"><summary>Kagome confetti</summary>
   <div className="pane-actions"><button type="button" className="button secondary" disabled={locked} onClick={()=>history.change(x=>protectCategorySettings(x,remixTopper(x,"topperKagome",Math.random,density)))}>Remix</button><button type="button" className="button secondary" disabled={locked} onClick={()=>history.change(x=>protectCategorySettings(x,resetTopper(x,"topperKagome",initial)))}>Reset</button></div>
   <Parameter label="Kagome presence" name="topperKagome" history={history}/>
   <Parameter label="Cell population" name="topperKagomeDensity" history={history}/>
   <Parameter label="Cell scale" name="topperKagomeScale" history={history}/>
   <Parameter label="Animation speed" name="topperKagomeMotion" history={history}/>
   <Parameter label="Cell gaps" name="topperKagomeGap" history={history}/>
<Select label="Interior texture" value={String(Math.floor(Math.min(99.9,history.state.topperKagomeTexture)*5/100))} onChange={v=>history.change(s=>({...s,topperKagomeTexture:(Number(v)+.5)*20}))}>{["Solid","Nested polygons","Stripes","Stipple","Hollow"].map((name,i)=><option key={name} value={String(i)}>{name}</option>)}</Select>
   <Parameter label="Palette phase" name="topperKagomeHue" history={history}/>
   <Parameter label="Difference interaction" name="topperKagomeBlend" history={history}/>
   <Parameter label="Independent breathing" name="topperKagomePulse" history={history}/>
   <Parameter label="Independent twinkle" name="topperKagomeTwinkle" history={history}/>
   <Parameter label="Triangle to hexagon balance" name="topperKagomeBalance" history={history}/>
  </details>
  <details className="effect-explanation"><summary>Quasicrystal confetti</summary>
   <div className="pane-actions"><button type="button" className="button secondary" disabled={locked} onClick={()=>history.change(x=>protectCategorySettings(x,remixTopper(x,"topperQuasi",Math.random,density)))}>Remix</button><button type="button" className="button secondary" disabled={locked} onClick={()=>history.change(x=>protectCategorySettings(x,resetTopper(x,"topperQuasi",initial)))}>Reset</button></div>
   <Parameter label="Quasicrystal presence" name="topperQuasi" history={history}/>
   <Parameter label="Fragment population" name="topperQuasiDensity" history={history}/>
   <Parameter label="Fragment scale" name="topperQuasiScale" history={history}/>
   <Parameter label="Animation speed" name="topperQuasiMotion" history={history}/>
   <Parameter label="Fragment gaps" name="topperQuasiGap" history={history}/>
<Select label="Interior texture" value={String(Math.floor(Math.min(99.9,history.state.topperQuasiTexture)*5/100))} onChange={v=>history.change(s=>({...s,topperQuasiTexture:(Number(v)+.5)*20}))}>{["Solid","Nested bands","Stripes","Stipple","Hollow"].map((name,i)=><option key={name} value={String(i)}>{name}</option>)}</Select>
   <Parameter label="Palette phase" name="topperQuasiHue" history={history}/>
   <Parameter label="Difference interaction" name="topperQuasiBlend" history={history}/>
   <Parameter label="Breathing" name="topperQuasiPulse" history={history}/>
   <Parameter label="Twinkle" name="topperQuasiTwinkle" history={history}/>
   <p className="control-note">Five-direction quasiperiodic grid intersections; not an exact Penrose tiling.</p>
  </details>
 </section>;
}
