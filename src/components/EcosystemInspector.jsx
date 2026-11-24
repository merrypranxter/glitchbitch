import React from "react";
import {Dices, Shuffle} from "lucide-react";
import {Select, Toggle} from "./Controls";
import {EffectsInspector} from "./Inspectors";
import {livingRemixGroups,livingRemixDisabled,remixLivingSystem,shuffleLivingWorld,chaosLevels} from "../ecosystem-randomizer.js";

// Separate top-level route. Its primary controls don't depend on the
// Effects inspector's selected family, search, favorites or scroll state.
export default function EcosystemInspector({history,onTool,tool}){
  const s=history.state;
  const [chaosLevel,setChaosLevel]=React.useState("Wild");
  const [allowDual,setAllowDual]=React.useState(true);
  const [allowHeavy,setAllowHeavy]=React.useState(false);
  const [livingRemix,setLivingRemix]=React.useState("feeding");
  const [advanceRemix,setAdvanceRemix]=React.useState(false);
  const remixReason=livingRemixDisabled(s,livingRemix,{allowDual});
  const spinTargeted=()=>history.change(x=>remixLivingSystem(x,livingRemix,Math.random,{
    allowDual,allowHeavy,advance:advanceRemix,intensity:chaosLevels.indexOf(chaosLevel)/3,
  }));
  const spinLiving=()=>history.change(x=>shuffleLivingWorld(x,Math.random,{
    allowDual,allowHeavy,intensity:chaosLevels.indexOf(chaosLevel)/3,
  }));

  return <section className="ecosystem-workspace" aria-label="Ecosystem workspace" data-testid="ecosystem-workspace">
    <div className="ecosystem-dock">
      <strong>LIVING ECOSYSTEM</strong>
      <button type="button" className="button primary" onClick={spinLiving}><Dices size={16}/> Randomize living world</button>
      <p className="control-note">New colonies, feeding, adaptation, genetics, symbiosis and geology. Keeps your core art, palette and text. One Undo restores the previous world.</p>
      <details><summary>Remix only one living system</summary>
        <Select label="Living system" value={livingRemix} onChange={setLivingRemix}>
          {livingRemixGroups.map(g=><option key={g.id} value={g.id}>{g.label}</option>)}
        </Select>
        <p className="control-note">{livingRemixGroups.find(g=>g.id===livingRemix)?.note}</p>
        {["feeding","adaptation","climate","history"].includes(livingRemix)&&<Toggle label="Also advance biological or geological time" checked={advanceRemix} onChange={setAdvanceRemix}/>}
        <button type="button" className="button secondary ecosystem-targeted" onClick={spinTargeted} disabled={!!remixReason}><Shuffle size={15}/> Remix selected system</button>
        {remixReason&&<p className="control-note" role="status">{remixReason}</p>}
        <p className="control-note">No world reset. Your existing colony positions, artwork, text and unrelated controls survive. Undo restores the previous state.</p>
      </details>
      <details><summary>Shuffle options</summary>
        <Select label="Chaos intensity" value={chaosLevel} onChange={setChaosLevel}>{chaosLevels.map(level=><option key={level} value={level}>{level}</option>)}</Select>
        <Toggle label="Allow two atmosphere parents" checked={allowDual} onChange={setAllowDual}/>
        <Toggle label="Allow extra heavyweight GPU combinations" checked={allowHeavy} onChange={setAllowHeavy}/>
      </details>
    </div>
    <EffectsInspector scope="ecosystem" history={history} onTool={onTool} tool={tool}/>
  </section>;
}
