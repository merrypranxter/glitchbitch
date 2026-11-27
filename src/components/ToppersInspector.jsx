import React from "react";
import {Shuffle,LockKeyhole,Unlock,EyeOff} from "lucide-react";
import {Parameter,Select} from "./Controls";
import {shuffleToppers,clearToppers} from "../toppers.js";
import {readCategoryLocks,writeCategoryLocks,protectCategorySettings} from "../category-locks.js";
export default function ToppersInspector({history}){
 const [density,setDensity]=React.useState("Balanced");
 const [locks,setLocks]=React.useState(readCategoryLocks);
 const locked=!!locks.Toppers;
 const toggle=()=>{const next={...locks,Toppers:!locked};writeCategoryLocks(next);setLocks(next);};
 return <section className="weaving-workspace" aria-label="Toppers workspace">
  <div className="ecosystem-dock weaving-dock">
   <strong>TOPPERS · THE SPRINKLE LAB</strong>
   <p className="control-note">Small accents on your existing artwork. These controls share the original effect settings, not duplicate layers.</p>
   <Select label="Topper density" value={density} onChange={setDensity}>{["Sparse","Balanced","Maximalist"].map(v=><option key={v}>{v}</option>)}</Select>
   <div className="pane-actions">
    <button type="button" className="button primary" disabled={locked} onClick={()=>history.change(x=>protectCategorySettings(x,shuffleToppers(x,Math.random,density)))}><Shuffle size={15}/> Shuffle toppers</button>
    <button type="button" className="button secondary" aria-pressed={locked} onClick={toggle}>{locked?<Unlock size={14}/>:<LockKeyhole size={14}/>} {locked?"Unlock":"Lock"}</button>
    <button type="button" className="button secondary" disabled={locked} onClick={()=>history.change(x=>protectCategorySettings(x,clearToppers(x)))}><EyeOff size={14}/> Clear toppers</button>
   </div>
   <p className="control-note">Locks protect randomization; manual sliders remain editable. Other category locks can preserve overlapping effects.</p>
  </div>
  <details open className="effect-explanation"><summary>Classic signal sprinkles</summary>
   <Parameter label="Broadcast bars" name="broadcast" history={history}/>
   <Parameter label="Error windows" name="windowCascade" history={history}/>
   <Parameter label="Glitter" name="glitter" history={history}/>
  </details>
  <details open className="effect-explanation"><summary>Transmission shrapnel</summary>
   <Parameter label="Shrapnel presence" name="topperShrapnel" history={history}/>
   <Parameter label="Fragment density" name="topperDensity" history={history}/>
   <Parameter label="Fragment scale" name="topperScale" history={history}/>
   <Parameter label="Drift motion" name="topperMotion" history={history}/>
   <Parameter label="Palette phase" name="topperHue" history={history}/>
   <Parameter label="Fragment geometry" name="topperShape" history={history}/>
   <Parameter label="Color interaction" name="topperBlend" history={history}/>
  </details>
  <details className="effect-explanation"><summary>Phosphene jewels</summary>
   <Parameter label="Jewel presence" name="topperJewel" history={history}/>
   <Parameter label="Jewel density" name="topperJewelDensity" history={history}/>
   <Parameter label="Jewel scale" name="topperJewelScale" history={history}/>
   <Parameter label="Retinal drift" name="topperJewelMotion" history={history}/>
   <Parameter label="Interference detail" name="topperJewelDetail" history={history}/>
   <Parameter label="Palette phase" name="topperJewelHue" history={history}/>
   <Parameter label="Retinal geometry" name="topperJewelForm" history={history}/>
   <Parameter label="Complement interaction" name="topperJewelBlend" history={history}/>
  </details>
 </section>;
}
