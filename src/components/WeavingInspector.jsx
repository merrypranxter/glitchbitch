import React from "react";
import {Dices,Shuffle} from "lucide-react";
import {Select,Toggle,requestReveal} from "./Controls";
import {EffectsInspector,TextileMathControls} from "./Inspectors";
import {weavingRemixGroups,weavingRemixDisabled,remixWeavingSystem,shuffleWeavingWorld} from "../weaving-randomizer.js";
export default function WeavingInspector({history,onTool,tool}){
 const s=history.state;
 const [intensity,setIntensity]=React.useState("Wild");
 const [allowHybrid,setAllowHybrid]=React.useState(true);
 const [allowHeavy,setAllowHeavy]=React.useState(false);
 const [group,setGroup]=React.useState("dress");
 const reason=weavingRemixDisabled(s,group);
 return <section className="weaving-workspace" aria-label="Weaving workspace" data-testid="weaving-workspace">
   <div className="ecosystem-dock weaving-dock">
    <strong>WEAVING & THREAD COUTURE</strong>
    <button type="button" className="button primary" onClick={()=>history.change(x=>shuffleWeavingWorld(x,Math.random,{intensity,allowHybrid,allowHeavy}))}><Dices size={16}/> Randomize all weaving</button>
    <p className="control-note">New weave, thread wardrobe, jewelry, sewing motion and optional optical, living and fabric layers. Keeps your palette, text, ecosystem and underlying art. One Undo.</p>
    <div className="pane-actions">
     <button type="button" className="button secondary" onClick={()=>history.change(x=>remixWeavingSystem(x,"weave"))}><Shuffle size={13}/> Shuffle weave</button>
     <button type="button" className="button secondary" onClick={()=>history.change(x=>remixWeavingSystem(x,"dress"))}><Dices size={13}/> Dress threads</button>
     <button type="button" className="button secondary" onClick={()=>history.change(x=>remixWeavingSystem(x,"stitch"))}><Shuffle size={13}/> Shuffle motion</button>
    </div>
    <details><summary>Randomizer options</summary>
     <Select label="Weaving intensity" value={intensity} onChange={setIntensity}><option>Gentle</option><option>Balanced</option><option>Wild</option></Select>
     <Toggle label="Allow two woven parents" checked={allowHybrid} onChange={setAllowHybrid}/>
     <Toggle label="Full textile chaos (GPU heavy)" checked={allowHeavy} onChange={setAllowHeavy}/>
     <p className="control-note">Intensity controls how often extra layers are activated. Full chaos combines living fibers, optics, velvet and crochet; turn it off if your phone struggles.</p>
    </details>
    <details><summary>Remix only one textile system</summary>
     <Select label="Textile system" value={group} onChange={setGroup}>{weavingRemixGroups.map(g=><option key={g.id} value={g.id}>{g.label}</option>)}</Select>
     <p className="control-note">{weavingRemixGroups.find(g=>g.id===group)?.note}</p>
     <button type="button" className="button secondary ecosystem-targeted" disabled={!!reason} onClick={()=>history.change(x=>remixWeavingSystem(x,group))}><Shuffle size={15}/> Remix selected textile system</button>
     {reason&&<p className="control-note" role="status">{reason}</p>}
     <p className="control-note">A hidden thread or prerequisite layer may be enabled to show the selected effect.</p>
    </details>
    <details><summary>Jump to thread controls</summary>
     <div className="pane-actions">{[["filament","Weave geometry"],["filament-materials","Dress the threads"],["filament-jewelry","Jewelry"],["filament-stitch","Stitch motion"],["filament-optics","Structural color"],["filament-crossbreed","Crossbreed"],["filament-sculpt","Relief"],["underlay","Fabric ground"]].map(([id,label])=><button key={id} type="button" className="button secondary" onClick={()=>requestReveal({id})}>{label}</button>)}</div>
    </details>
   </div>
   <EffectsInspector scope="weaving" history={history} onTool={onTool} tool={tool}/>
   <div className="weaving-math"><TextileMathControls history={history}/></div>
 </section>;
}
