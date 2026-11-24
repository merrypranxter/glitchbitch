import React from "react";
import {Dices, Shuffle, Hourglass} from "lucide-react";
import {evolutionRhythms,ecosystemCensus,advanceLivingTimeline} from "../ecosystem-timeline.js";
import {Select, Toggle} from "./Controls";
import {microbialCollections,microbialVisible,remixMicrobes,applyMicrobialCollection} from "../microbial-remix.js";
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
  const [rhythm,setRhythm]=React.useState("Balanced");
  const [microbialCollection,setMicrobialCollection]=React.useState(microbialCollections[0].name);
  const canRemixMicrobes=microbialVisible(s);
  const [turnover,setTurnover]=React.useState(false);
  const census=ecosystemCensus(s);
  const advanceWorld=steps=>history.change(x=>advanceLivingTimeline(x,Math.random,{steps,rhythm,allowTurnover:turnover}));
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
      <details><summary>Microbial zoo · shapes & dots</summary>
        <p className="control-note">Remix the organisms already on your canvas, not the ecosystem underneath. Mixed collections give different colonies their own silhouette and interior, even inside a single parent population.</p>
        <Select label="Mixed population" value={microbialCollection} onChange={setMicrobialCollection}>
          {microbialCollections.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
        </Select>
        <button type="button" className="button secondary ecosystem-targeted" disabled={!canRemixMicrobes} onClick={()=>history.change(x=>applyMicrobialCollection(x,microbialCollection))}><Dices size={15}/> Apply mixed population</button>
        <div className="pane-actions">
          {[["shapes","Shuffle shapes only"],["pores","Shuffle dots only"],["tissue","Shuffle interiors only"]].map(([part,label])=><button key={part} type="button" className="button secondary" disabled={!canRemixMicrobes} onClick={()=>history.change(x=>remixMicrobes(x,part))}><Shuffle size={13}/> {label}</button>)}
        </div>
        <p className="control-note">{canRemixMicrobes?"All colony positions, genetics, nutrients and histories stay intact. A hidden layer may be enabled to show the selected change. Mixed assignments follow the saved colony order.":"Randomize a living world or plant visible colonies first."}</p>
      </details>
      <details><summary>Evolution clock · advance this world</summary>
        <p className="control-note">Keep this world and run randomized ecological events through the systems you have enabled. Each batch is one Undo.</p>
        <Select label="Evolution rhythm" value={rhythm} onChange={setRhythm}>
          {evolutionRhythms.map(r=><option key={r} value={r}>{r}</option>)}
        </Select>
        <Toggle label="Allow population turnover (cull weak colonies)" checked={turnover} onChange={setTurnover}/>
        <div className="pane-actions">
          {[1,3,12].map(n=><button key={n} type="button" className="button secondary" disabled={!census.colonies} onClick={()=>advanceWorld(n)}><Hourglass size={13}/> Advance {n} {n===1?"cycle":"cycles"}</button>)}
        </div>
        <p className="control-note">{!census.colonies?"Randomize a living world or plant colonies first.":"Existing seeds stay in place. Births stop at 16 colonies; turnover is off unless you allow it."}</p>
        <div className="ecosystem-census" aria-label="Current ecological history">
          {[[ "Colonies",census.colonies+"/16"],["Feeding rounds",census.feeding],["Coevolution rounds",census.adaptation],["Birth generations",census.generations],["Climate epochs",census.climate],["Soil epochs",census.soil],["Fossils",census.fossils+"/8"]].map(([label,value])=><div key={label}><span>{label}</span><strong>{value}</strong></div>)}
        </div>
        <p className="control-note">Cycles are discrete events, not a new video timeline. Counters reflect completed events; inactive systems and full archives may not advance.</p>
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
