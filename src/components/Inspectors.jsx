import React from "react";
import {
  Waves,
  Flower,
  Snowflake,
  Orbit,
  Blocks,
  Shell,
  Fingerprint,
  Hexagon,
  Flower2,
  Mountain,
  Grid3X3,
  Gem,
  LockKeyhole,
  Unlock,
  BookOpen,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Move,
  Paintbrush,
  Eraser,
  Layers,
  ArrowDown,
  ArrowUpRight,
  Dna,
  Box,
  Dices,
  Shuffle,
  ArrowLeftRight,
} from "lucide-react";
import { engineInfo, engines, touchModes, makeMark, motionModes, tunnelModes, compositionModes, backdropModes, microModes, substanceModes, wiggleModes, randomize } from "../data";
import { Parameter, Range, Toggle, Switch, Select, Section, Segmented, Pill, useReveal } from "./Controls";
import { photonSpecies, photonPresets, photonPresetState, nextPhotonSpecies } from "../photon-zoo.js";
import { filamentSpecies, filamentPresets, applyFilamentPreset, nextFilamentSpecies,
  filamentHybridPresets, applyFilamentHybrid, breedFilaments,
  filamentMaterials,filamentMaterialPresets,applyFilamentMaterialPreset,
  remixFilamentMaterials,filamentStitchModes,filamentStitchPresets,
  applyFilamentStitchPreset,stopFilamentStitching,
  filamentSculptModes,filamentSculptPresets,applyFilamentSculptPreset,disableFilamentSculpt } from "../filament-forge.js";
import { underlayModes, underlayPresets, applyUnderlayPreset,
  changeUnderlayMode, nextUnderlayMode, disableUnderlay } from "../living-underlay.js";
import { sections, sectionActive, effectGroups } from "../ui-index";
import { atmosphereModes, atmospherePresets, applyAtmospherePreset,
  nextAtmosphereMode, hideAtmosphere, hybridAtmospherePresets,
  applyAtmosphereHybridPreset, nextAtmosphereBMode, breedAtmospheres,
  swapAtmosphereParents, hideAtmospherePair } from "../mutant-atmospheres.js";
import { atmosphereHabitats, atmosphereSecondHabitats,
  atmosphereBlendModes } from "../atmosphere-habitats.js";
import { habitatTools, MAX_HABITAT_STAMPS, clearColonies } from "../habitat-painter.js";
import { colonyLifeModes, colonyLifePresets, applyColonyLifePreset,
  stopColonyLife } from "../colony-lifecycle.js";
import { colonyAnatomyModes, colonyAnatomyPresets, applyColonyAnatomyPreset,
  clearColonyAnatomy, shuffleColonyAnatomy } from "../colony-anatomy.js";
import { colonyCortexModes, colonyCortexPresets, applyColonyCortexPreset,
  clearColonyCortex, shuffleColonyCortex } from "../colony-cortex.js";
import { ensureValidEcosystemState } from "../ecosystem-randomizer.js";
import { shuffleColonies, shuffleColonyLife, shuffleEcosystem,
  fullWeirdShuffle, chaosLevels } from "../ecosystem-randomizer.js";
export { TextInspector } from "./TextInspector";
const icons = [
  Waves,
  Flower,
  Snowflake,
  Orbit,
  Blocks,
  Shell,
  Fingerprint,
  Hexagon,
  Flower2,
  Mountain,
  Grid3X3,
  Gem,
  Orbit,
  Snowflake,
  Grid3X3,
  Dna,
  Box,
];
const deg = (v) => `${Math.round(v)}°`;
/** Small "reseed just this thing" button used across effects. */
function Reseed({ label, onClick }) {
  return (
    <button type="button" className="subtle-button full" onClick={onClick}>
      <Dices size={13} /> {label}
    </button>
  );
}

// ---- Math -------------------------------------------------------------------
export function MathInspector({ history, locked, onLock, onLookbook }) {
  const state = history.state;
  const selected = (id) => state.engine === id ||
    (state.blend > 0 && state.secondaryEngine === id);
  return (
    <>
      <Section
        id="engine"
        defaultOpen
        aside={
          <button
            className={"icon-button " + (locked ? "lime" : "")}
            title={
              locked
                ? "Engine locked: Surprise me won't change it"
                : "Lock engine so Surprise me keeps it"
            }
            aria-pressed={locked}
            onClick={onLock}
          >
            {locked ? <LockKeyhole size={13} /> : <Unlock size={13} />}
          </button>
        }
      >
        <div className="engine-grid">
          {engineInfo.map((e, i) => {
            const Icon = icons[i];
            return (
              <button
                key={i}
                title={e.description}
                className={state.engine === i ? "selected" : ""}
                aria-pressed={state.engine === i}
                onClick={() => history.change((s) => ({ ...s, engine: i }))}
              >
                <Icon size={15} />
                <span>{e.name}</span>
              </button>
            );
          })}
        </div>
        <div className="engine-note">
          <span>{engineInfo[state.engine].family}</span>
          {engineInfo[state.engine].description}
        </div>
        <button className="subtle-button full" onClick={onLookbook}>
          <BookOpen size={13} />
          Browse the lookbook
          <span>
            <ArrowUpRight size={12} />
          </span>
        </button>
      </Section>
      {selected(5) && (
        <Section id="tunnel" history={history} defaultOpen>
          <Select label="Tunnel species" value={state.tunnelMode}
            onChange={(v)=>history.change(s=>({...s,tunnelMode:v}))}>
            {tunnelModes.map(mode=><option key={mode}>{mode}</option>)}
          </Select>
          <Parameter label="Spiral twist" name="tunnelTwist" history={history}/>
          <Parameter label="Depth" name="tunnelDepth" history={history}/>
          <Parameter label="Ridges / spiral arms" name="tunnelRidges" history={history}/>
          <Parameter label="Pulse speed" name="tunnelPulse" history={history}/>
          <Parameter label="Center hole" name="tunnelAperture" history={history}/>
          <Parameter label="Variation" name="tunnelVariation" history={history}/>
          <Reseed label="Reshape tunnel only" onClick={()=>history.change(s=>({...s,tunnelVariation:
            (s.tunnelVariation+13+Math.random()*71)%100}))}/>
        </Section>
      )}
      {(selected(12) || selected(13) || selected(14) || selected(15) || selected(16)) && (
        <Section id="extras" history={history} defaultOpen>
          {selected(12) && <Parameter label="Hyperbolic fold depth" name="hyperbolicFold" history={history} />}
          {selected(13) && (
            <>
              <Parameter label="Fractal deep zoom" name="fractalZoom" history={history} />
              <Parameter label="Mandelbrot ↔ Julia" name="juliaMix" history={history} />
            </>
          )}
          {selected(14) && <Parameter label="Diffraction density" name="quasiDensity" history={history} />}
          {selected(15) && <p className="control-note">Growth chemistry lives in Effects → Bio rot.</p>}
          {selected(16) && <p className="control-note">Shape, parallax and material live in Effects → Stereo 3D.</p>}
        </Section>
      )}
      <Section id="shape" history={history} defaultOpen>
        <Parameter label="Complexity" name="complexity" history={history} />
        <Parameter label="Scale" name="scale" history={history} />
        <Parameter label="Domain warp" name="warp" history={history} />
        <Parameter label="Rotation" name="rotation" history={history} format={deg} />
        <Parameter
          label="Kaleidoscope"
          name="symmetry"
          history={history}
          format={(v) => (v < 2 ? "Off" : `${Math.round(v)} folds`)}
        />
        <Switch label="Mirror" name="mirror" history={history} />
      </Section>
      <Section id="motion" history={history}>
        <Parameter
          label="Animation speed"
          name="speed"
          history={history}
          format={(v) => `${(v / 30).toFixed(1)}×`}
        />
        <Select
          label="Motion style"
          value={state.motionMode}
          onChange={(v) => history.change((s) => ({...s, motionMode: v}))}
        >
          {motionModes.map((mode) => <option key={mode}>{mode}</option>)}
        </Select>
        <Parameter label="Shape movement" name="motionAmount" history={history} />
        <Parameter label="Movement pace" name="motionRate" history={history} />
        <Parameter label="Shimmer (highlights only)" name="lightMotion" history={history} />
        <Switch
          label="Freeze shape"
          note="Shape holds still; colors keep moving."
          name="freezeGeometry"
          history={history}
        />
      </Section>
    </>
  );
}

// ---- Effects ----------------------------------------------------------------
const FILTER_KEY = "glitch-fx-filter-v1";
const effectSections = sections.filter((s) => s.tab === "Effects" && s.id !== "fx-toggles");
export function EffectsInspector({ history, onTool, tool }) {
  const s = history.state;
  const [filter, setFilterState] = React.useState(() => {
    try { return localStorage.getItem(FILTER_KEY) || "All"; } catch { return "All"; }
  });
  const setFilter = (f) => {
    setFilterState(f);
    try { localStorage.setItem(FILTER_KEY, f); } catch { /* session only */ }
  };
  const [photonPreset,setPhotonPreset]=React.useState(photonPresets[0].name);
  const [filamentPreset,setFilamentPreset]=React.useState(filamentPresets[0].name);
  const [hybridPreset,setHybridPreset]=React.useState(filamentHybridPresets[0].name);
  const [materialPreset,setMaterialPreset]=React.useState(filamentMaterialPresets[0].name);
  const [stitchPreset,setStitchPreset]=React.useState(filamentStitchPresets[0].name);
  const [sculptPreset,setSculptPreset]=React.useState(filamentSculptPresets[0].name);
  const [underlayPreset,setUnderlayPreset]=React.useState(underlayPresets[0].name);
  const [atmoPreset,setAtmoPreset]=React.useState(atmospherePresets[0].name);
  const [hybridAtmoPreset,setHybridAtmoPreset]=React.useState(hybridAtmospherePresets[0].name);
  const [colonyLifePreset,setColonyLifePreset]=React.useState(colonyLifePresets[0].name);
  const [colonyAnatomyPreset,setColonyAnatomyPreset]=React.useState(colonyAnatomyPresets[0].name);
  const [colonyCortexPreset,setColonyCortexPreset]=React.useState(colonyCortexPresets[0].name);
  const [chaosLevel,setChaosLevel]=React.useState("Wild");
  const [preserveColors,setPreserveColors]=React.useState(true);
  const [preserveText,setPreserveText]=React.useState(true);
  const [preserveCore,setPreserveCore]=React.useState(false);
  const [allowDual,setAllowDual]=React.useState(true);
  const [allowHeavy,setAllowHeavy]=React.useState(false);
  const spinEcosystem=()=>history.change(x=>shuffleEcosystem(x,Math.random,{
    allowDual,intensity:chaosLevels.indexOf(chaosLevel)/3,
  }));
  const spinFullWeird=()=>history.change(x=>fullWeirdShuffle(x,Math.random,{
    level:chaosLevel,preserveColors,preserveText,preserveCore,
    allowDual,allowHeavy,
    baseRandomizer:(original,rng)=>randomize(original,{},false,rng)
  }));
  // Find jumps to a section that might be filtered out: show everything.
  useReveal((detail) => {
    if (effectSections.some((x) => x.id === detail.id) && filter !== "All") setFilter("All");
  });
  const onCount = effectSections.filter((m) => sectionActive(m, s)).length;
  const visible = (id) => {
    const meta = effectSections.find((m) => m.id === id);
    if (filter === "All") return true;
    if (filter === "On") return sectionActive(meta, s);
    return meta.group === filter;
  };
  const body = {
    "chaos-lab": <>
      <p className="control-note">
        THE BEAUTIFUL RANDOMIZER PROBLEM IS SOLVED. Spin living colonies,
        rival atmosphere species and all the other weird modules together
        without playing 900-slider whack-a-mole. All changes are one Undo.
      </p>
      <Select label="Chaos intensity" value={chaosLevel} onChange={setChaosLevel}>
        {chaosLevels.map(level=><option key={level} value={level}>{level}</option>)}
      </Select>
      <Toggle label="Preserve my colors" checked={preserveColors}
        onChange={setPreserveColors}/>
      <Toggle label="Preserve my words and text styling" checked={preserveText}
        onChange={setPreserveText}/>
      <Toggle label="Preserve core math and touch forces" checked={preserveCore}
        onChange={setPreserveCore}/>
      <Toggle label="Allow two atmosphere parents" checked={allowDual}
        onChange={setAllowDual}/>
      <Toggle label="Allow extra heavyweight GPU combinations" checked={allowHeavy}
        onChange={setAllowHeavy}/>
      <div className="pane-actions">
        <button type="button" className="button secondary"
          onClick={spinEcosystem}>
          <Shuffle size={13}/> Shuffle ecosystem
        </button>
        <button type="button" className="button secondary"
          onClick={spinFullWeird}>
          <Dices size={13}/> Full weird shuffle
        </button>
      </div>
      <p className="control-note">
        Full weird shuffle remixes old and new effects with a mobile GPU budget.
        Uncheck Preserve colors to randomize the palette too. Your text stays
        intact unless you explicitly uncheck its protection. Manual controls
        and all planted seeds remain editable afterward.
      </p>
    </>,
    "colony-cortex": <>
      <p className="control-note">
        LIVING CORTEX — not just the edge! Give planted colonies their own
        inner tissue: years of growth bands, radial fungal veins, or little
        clustered fruiting cups. Parent A and B can grow different materials.
      </p>
      <Select label="Parent A cortex" value={s.colonyCortexA}
        onChange={mode=>history.change(x=>({...x,colonyCortexA:mode}))}>
        {colonyCortexModes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
      </Select>
      <Select label="Parent B cortex" value={s.colonyCortexB}
        onChange={mode=>history.change(x=>({...x,colonyCortexB:mode}))}>
        {colonyCortexModes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
      </Select>
      <Parameter label="Cortex visibility" name="colonyCortexAmount" history={history}/>
      <Parameter label="Growth ring / branching detail" name="colonyCortexDetail" history={history}/>
      <Parameter label="Inner tissue movement" name="colonyCortexMotion" history={history}/>
      <Parameter label="Pigment depth and relief" name="colonyCortexRelief" history={history}/>
      <Select label="Instant cortex" value={colonyCortexPreset}
        onChange={setColonyCortexPreset}>
        {colonyCortexPresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
      </Select>
      <div className="pane-actions">
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>ensureValidEcosystemState({
            ...applyColonyCortexPreset(x,colonyCortexPreset),
            atmoMaskMode:"Painted colonies",
            atmoBMaskMode:"Painted colonies",
            atmoAmount:Math.max(70,x.atmoAmount),
            atmoBAmount:Math.max(65,x.atmoBAmount),
          }))}>
          <Flower2 size={13}/> Spawn cortex pair
        </button>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>ensureValidEcosystemState({
            ...shuffleColonyCortex(x),
            atmoMaskMode:"Painted colonies",
            atmoAmount:Math.max(70,x.atmoAmount),
          }))}>
          <Dices size={13}/> Shuffle cortex
        </button>
        <button type="button" className="button secondary"
          disabled={s.colonyCortexAmount<=0}
          onClick={()=>history.change(clearColonyCortex)}>
          Hide cortex (keep seeds)
        </button>
      </div>
      <p className="control-note">
        Internal markings use each planted seed's local coordinates and its
        living silhouette, not a fixed image texture. These are biological
        motifs interpreted as generative art, not literal 3D lichen anatomy.
        Restoring visibility to zero leaves every older artwork unchanged.
      </p>
    </>,
    "colony-anatomy": <>
      <p className="control-note">
        MUTANT ANATOMY — your hand-planted colonies can be foliose lichen
        plates, coral fringes, crystalline petals or fan-shaped hyphae.
        Both parents have independent geometry. You can keep the original
        circular disks; the zero-strength setting restores them exactly.
      </p>
      <Select label="Parent A anatomy" value={s.colonyShapeA}
        onChange={mode=>history.change(x=>({...x,colonyShapeA:mode}))}>
        {colonyAnatomyModes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
      </Select>
      <Select label="Parent B anatomy" value={s.colonyShapeB}
        onChange={mode=>history.change(x=>({...x,colonyShapeB:mode}))}>
        {colonyAnatomyModes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
      </Select>
      <Parameter label="Shape mutation strength" name="colonyAnatomyAmount" history={history}/>
      <Parameter label="Lobes, spikes and petal detail" name="colonyAnatomyDetail" history={history}/>
      <Parameter label="Anatomy motion" name="colonyAnatomyMotion" history={history}/>
      <Parameter label="Microscopic pores" name="colonyAnatomyPores" history={history}/>
      <Parameter label="Luminous rim" name="colonyAnatomyRim" history={history}/>
      <Select label="Anatomy specimen" value={colonyAnatomyPreset}
        onChange={setColonyAnatomyPreset}>
        {colonyAnatomyPresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
      </Select>
      <div className="pane-actions">
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>ensureValidEcosystemState({
            ...applyColonyAnatomyPreset(x,colonyAnatomyPreset),
            atmoMaskMode:"Painted colonies",
            atmoBMaskMode:"Painted colonies",
            atmoAmount:Math.max(70,x.atmoAmount),
            atmoBAmount:Math.max(65,x.atmoBAmount),
          }))}>
          <Flower2 size={13}/> Spawn anatomy pair
        </button>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>ensureValidEcosystemState({
            ...shuffleColonyAnatomy(x),
            atmoMaskMode:"Painted colonies",
            atmoAmount:Math.max(70,x.atmoAmount),
          }))}>
          <Dices size={13}/> Shuffle anatomy
        </button>
        <button type="button" className="button secondary"
          disabled={s.colonyAnatomyAmount<=0&&s.colonyAnatomyPores<=0&&s.colonyAnatomyRim<=0}
          onClick={()=>history.change(clearColonyAnatomy)}>
          Restore classic outlines
        </button>
      </div>
      <p className="control-note">
        Anatomy is visible only for Painted colonies habitats. Spawn Anatomy
        Pair enables and plants both species; Shuffle Anatomy plants A
        without forcing a second GPU shader. All changes are reversible.
        Your palette supplies the fluorescent edge color, and exports use
        the same clock as the live preview.
      </p>
    </>,
    "colony-life": <>
      <p className="control-note">
        COLONY WARS — give your planted habitats lifecycles.
        Seeds expand and retreat with continuous motion. No frame-history
        textures, no stochastic frame jumps. The Glow slider illuminates
        the moving territory boundaries in your own palette.
      </p>
      <Select label="Lifecycle" value={s.colonyLifeMode}
        onChange={mode=>history.change(x=>({...x,colonyLifeMode:mode,
          colonyLifeAmount:mode==="Still"?0:Math.max(70,x.colonyLifeAmount)}))}>
        {colonyLifeModes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
      </Select>
      <Parameter label="Growth / retreat intensity" name="colonyLifeAmount" history={history}/>
      <Parameter label="Life-cycle speed" name="colonyLifeSpeed" history={history}/>
      <Parameter label="Luminous territory edges" name="colonyFrontGlow" history={history}/>
      <Parameter label="A versus B competition" name="colonyCompetition" history={history}/>
      <Select label="Instant ecology" value={colonyLifePreset} onChange={setColonyLifePreset}>
        {colonyLifePresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
      </Select>
      <div className="pane-actions">
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>applyColonyLifePreset(x,colonyLifePreset))}>
          <Flower2 size={13}/> Awaken ecosystem
        </button>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>shuffleColonyLife(x))}>
          <Shuffle size={13}/> Shuffle colony wars
        </button>
        <button type="button" className="button secondary"
          disabled={s.colonyLifeAmount<=0&&s.colonyFrontGlow<=0&&s.colonyCompetition<=0}
          onClick={()=>history.change(stopColonyLife)}>
          Stop ecology (keep seeds)
        </button>
      </div>
      <p className="control-note">
        Needs painted colony seeds and a parent set to Painted colonies.
        Territory war only makes A/B fight when both use Painted colonies.
        Speed and intensity affect the same timeline used for PNG/GIF/MP4.
        Leave Life at Still and all these effects off to preserve the old art.
        For ready-made experiments try Lookbook → Colony Wars.
      </p>
    </>,
    atmosphere: <>
      <p className="control-note">Four living shader-vault worlds you can stack, crossbreed and mask over any engine: stained-glass mycelium, mandala-constrained gas, double-beat phosphors, and living CMY print rosettes. They respond to your existing palette and keep moving in GIF/MP4 exports.</p>
      <Select label="Atmosphere" value={s.atmoMode}
        onChange={mode=>history.change(x=>({...x,atmoMode:mode,
          atmoAmount:Math.max(62,x.atmoAmount)}))}>
        {atmosphereModes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
      </Select>
      <Parameter label="Presence" name="atmoAmount" history={history}/>
      <Parameter label="Pattern size" name="atmoScale" history={history}/>
      <Parameter label="Structure density" name="atmoDensity" history={history}/>
      <Parameter label="Living motion" name="atmoMotion" history={history}/>
      <Parameter label="Glow / radiance" name="atmoGlow" history={history}/>
      <Parameter label="Palette phase" name="atmoHue" history={history}/>
      <Parameter label="Variation" name="atmoVariation" history={history}/>
      <Select label="Instant atmosphere" value={atmoPreset} onChange={setAtmoPreset}>
        {atmospherePresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
      </Select>
      <div className="pane-actions">
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>applyAtmospherePreset(x,atmoPreset))}>
          Spawn atmosphere
        </button>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>nextAtmosphereMode(x))}>
          <Dices size={13}/> New species
        </button>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>({...x,atmoVariation:
            (x.atmoVariation+21+Math.random()*61)%100}))}>
          <Shuffle size={13}/> Reseed
        </button>
        <button type="button" className="button secondary"
          disabled={s.atmoAmount<=0}
          onClick={()=>history.change(hideAtmosphere)}>
          Hide first parent
        </button>
      </div>
      <details className="filament-crossbreeder">
        <summary>🧬 TWO-PARENT ATMOSPHERE BREEDER</summary>
        <p className="control-note">Breed two of the four living atmospheres. Parent B has its own geometry size, pulse/growth rate, palette phase, glow, and variation. Parent A keeps all its settings. Presence 0 costs no second shader.</p>
        <Select label="Second parent" value={s.atmoBMode}
          onChange={mode=>history.change(x=>({...x,atmoBMode:mode,
            atmoBAmount:Math.max(62,x.atmoBAmount)}))}>
          {atmosphereModes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
        </Select>
        <Parameter label="Second parent presence" name="atmoBAmount" history={history}/>
        <Parameter label="Second parent pattern size" name="atmoBScale" history={history}/>
        <Parameter label="Second parent density" name="atmoBDensity" history={history}/>
        <Parameter label="Second parent motion" name="atmoBMotion" history={history}/>
        <Parameter label="Second parent glow" name="atmoBGlow" history={history}/>
        <Parameter label="Second parent palette shift" name="atmoBHue" history={history}/>
        <Parameter label="Second parent variation" name="atmoBVariation" history={history}/>
        <Select label="How the parents mix" value={s.atmoBBlendMode}
          onChange={mode=>history.change(x=>({...x,atmoBBlendMode:mode}))}>
          {atmosphereBlendModes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
        </Select>
        <Select label="Instant hybrid" value={hybridAtmoPreset} onChange={setHybridAtmoPreset}>
          {hybridAtmospherePresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
        </Select>
        <div className="pane-actions">
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>applyAtmosphereHybridPreset(x,hybridAtmoPreset))}>
            Spawn hybrid
          </button>
          <button type="button" className="button secondary"
            onClick={()=>history.change(breedAtmospheres)}>
            <Dna size={13}/> Breed wild
          </button>
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>nextAtmosphereBMode(x))}>
            <Dices size={13}/> New second parent
          </button>
          <button type="button" className="button secondary"
            onClick={()=>history.change(swapAtmosphereParents)}>
            <ArrowLeftRight size={13}/> Swap parents
          </button>
          <button type="button" className="button secondary"
            disabled={s.atmoBAmount<=0}
            onClick={()=>history.change(x=>({...x,atmoBAmount:0}))}>
            Hide second
          </button>
          <button type="button" className="button secondary"
            disabled={s.atmoAmount<=0&&s.atmoBAmount<=0}
            onClick={()=>history.change(hideAtmospherePair)}>
            Hide both
          </button>
        </div>
      </details>
      <details className="filament-crossbreeder">
        <summary>🪩 LIVING HABITATS — MASKS & TERRITORIES</summary>
        <p className="control-note">Let different species colonize different parts of the same image. The edges flow smoothly, and each mask has an independent placement mode. 'Inverse first' makes parent B fill the spaces parent A leaves.</p>
        <Select label="First parent habitat" value={s.atmoMaskMode}
          onChange={mode=>history.change(x=>({...x,atmoMaskMode:mode}))}>
          {atmosphereHabitats.map(mode=><option key={mode} value={mode}>{mode}</option>)}
        </Select>
        <Select label="Second parent habitat" value={s.atmoBMaskMode}
          onChange={mode=>history.change(x=>({...x,atmoBMaskMode:mode}))}>
          {atmosphereSecondHabitats.map(mode=><option key={mode} value={mode}>{mode}</option>)}
        </Select>
        <Parameter label="Habitat coverage / scale" name="atmoMaskScale" history={history}/>
        <Parameter label="Soft edges" name="atmoMaskFeather" history={history}/>
        <Parameter label="Habitat drift" name="atmoMaskMotion" history={history}/>
        <Parameter label="Habitat mutations" name="atmoMaskVariation" history={history}/>
        <div className="pane-actions">
          <button type="button" className="button secondary"
            aria-pressed={tool==="Plant A"}
            onClick={()=>onTool("Plant A")}>
            <Paintbrush size={13}/> Plant A on image
          </button>
          <button type="button" className="button secondary"
            aria-pressed={tool==="Plant B"}
            onClick={()=>onTool("Plant B")}>
            <Paintbrush size={13}/> Plant B on image
          </button>
          {habitatTools.includes(tool) && <button type="button" className="button secondary"
            onClick={()=>onTool("Paint")}>Return to force brush</button>}
        </div>
        <p className="control-note">
          Finger-paint habitats directly on the fixed canvas. Planting automatically
          chooses Painted colonies and activates that parent; A seeds are pink,
          B seeds cyan. Edit, move or erase them in Touch → Habitat Graffiti.
          Up to {MAX_HABITAT_STAMPS} movable seeds per design; undo works.
        </p>
        {s.atmoBMaskMode==="Inverse first"&&s.atmoMaskMode==="Everywhere"&&
          <p className="control-note">Inverse first is empty while the first habitat is Everywhere. Choose a shape for parent A to reveal parent B.</p>}
        <div className="pane-actions">
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>({...x,atmoMaskMode:"Everywhere",
              atmoBMaskMode:"Everywhere"}))}>
            Full canvas
          </button>
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>({...x,atmoMaskVariation:
              (x.atmoMaskVariation+15+Math.random()*73)%100}))}>
            <Shuffle size={13}/> Reseed habitats
          </button>
          <button type="button" className="button secondary"
            onClick={spinEcosystem}>
            <Dices size={13}/> Shuffle ecosystem
          </button>
        </div>
      </details>
      <p className="control-note">Fully reversible: both parents share your palette and export timeline. Your original engines, artwork, text and all other layers remain untouched when both presences are 0.</p>
    </>,
    underlay: <>
      <p className="control-note">Six mathematical textile grounds that fill the spaces behind the stitched lines. Moving jacquard, shifting moiré, fivefold twill, velvet pile, opaline damask and cellular gauze. Also works as stand-alone animated artwork with Filament Forge turned off.</p>
      <Select label="Fabric ground" value={s.underlayMode}
        onChange={mode=>history.change(x=>changeUnderlayMode(x,mode))}>
        {underlayModes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
      </Select>
      <Parameter label="Underlay presence" name="underlayAmount" history={history}/>
      <Parameter label="Fabric pattern scale" name="underlayScale" history={history}/>
      <Parameter label="Weave / pile density" name="underlayDensity" history={history}/>
      <Parameter label="Fabric motion" name="underlayMotion" history={history}/>
      <Parameter label="Fiber relief and sheen" name="underlayRelief" history={history}/>
      <Parameter label="Palette hue offset" name="underlayHue" history={history}/>
      <Parameter label="Yarn contrast" name="underlayContrast" history={history}/>
      <Parameter label="Pattern variation" name="underlayVariation" history={history}/>
      <Select label="Instant fabric" value={underlayPreset} onChange={setUnderlayPreset}>
        {underlayPresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
      </Select>
      <div className="pane-actions">
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>applyUnderlayPreset(x,underlayPreset))}>
          Weave this ground
        </button>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>nextUnderlayMode(x))}>
          <Dices size={13}/> New fabric
        </button>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>({...x,
            underlayVariation:(x.underlayVariation+19+Math.random()*63)%100}))}>
          <Shuffle size={13}/> Reseed ground
        </button>
        <button type="button" className="button secondary"
          disabled={s.underlayAmount<=0}
          onClick={()=>history.change(disableUnderlay)}>
          Hide underlay
        </button>
      </div>
      <p className="control-note">Underlay is an independent layer: hide it without losing your lace, text, Photon Zoo or underlying math art. It uses the existing palette and normal PNG/GIF/MP4 renderer.</p>
    </>,
    filament: <>
      <p className="control-note">Six animated stitch geometries: actual filament paths, not a blurry texture. They ride your palette without replacing the underlying art, and can stack with Photon Zoo.</p>
      <Select label="Thread geometry" value={s.filamentSpecies}
        onChange={v=>history.change(x=>({...x,filamentSpecies:v,filamentAmount:Math.max(55,x.filamentAmount)}))}>
        {filamentSpecies.map(name=><option key={name} value={name}>{name}</option>)}
      </Select>
      <Parameter label="Thread presence" name="filamentAmount" history={history}/>
      <Parameter label="Pattern scale" name="filamentScale" history={history}/>
      <Parameter label="Stitch density" name="filamentDensity" history={history}/>
      <Parameter label="Living motion" name="filamentMotion" history={history}/>
      <Parameter label="Thread thickness" name="filamentWidth" history={history}/>
      <Parameter label="Raised relief / sheen" name="filamentRelief" history={history}/>
      <Parameter label="Palette shift" name="filamentHue" history={history}/>
      <Parameter label="Variation" name="filamentVariation" history={history}/>
      <div className="preset-row">
        <Select label="Filament sculpture preset" value={filamentPreset} onChange={setFilamentPreset}>
          {filamentPresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
        </Select>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>applyFilamentPreset(x,filamentPreset))}>
          Weave selected preset
        </button>
      </div>
      <div className="pane-actions">
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>nextFilamentSpecies(x))}>
          <Dices size={13}/> New stitch species
        </button>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>({...x,
            filamentVariation:(x.filamentVariation+17+Math.random()*61)%100}))}>
          <Shuffle size={13}/> Reseed threads
        </button>
        <button type="button" className="button secondary"
          disabled={s.filamentAmount<=0}
          onClick={()=>history.change(x=>({...x,filamentAmount:0}))}>
          Hide threads
        </button>
      </div>
      <details className="filament-crossbreeder filament-sculpt-lab">
        <summary>💎 SCULPTED THREADS — RAISED RELIEF & LIGHT</summary>
        <p className="control-note">Give the existing filament paths tactile-looking volume with directional highlights, raised satin, quilted puff, engraved grooves and shadow-cut lace. This is lightweight 2.5D shading—not a heavyweight 3D mesh.</p>
        <Select label="Sculpted thread style" value={s.filamentSculptMode}
          onChange={value=>history.change(x=>({...x,filamentSculptMode:value,
            filamentSculptAmount:Math.max(65,x.filamentSculptAmount),
            filamentAmount:Math.max(55,x.filamentAmount)}))}>
          {filamentSculptModes.map(name=><option key={name} value={name}>{name}</option>)}
        </Select>
        <Parameter label="Tactile relief presence" name="filamentSculptAmount" history={history}/>
        <Parameter label="Thread height / depth" name="filamentSculptDepth" history={history}/>
        <Parameter label="Light direction" name="filamentSculptLight" history={history}/>
        <Parameter label="Soft border shadows" name="filamentSculptShadow" history={history}/>
        <Parameter label="Rounded / pillowy crown" name="filamentSculptPuff" history={history}/>
        <Select label="Sculpted fiber recipe" value={sculptPreset} onChange={setSculptPreset}>
          {filamentSculptPresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
        </Select>
        <div className="pane-actions">
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>applyFilamentSculptPreset(x,sculptPreset))}>
            Sculpt selected preset
          </button>
          <button type="button" className="button secondary"
            disabled={s.filamentSculptAmount<=0}
            onClick={()=>history.change(disableFilamentSculpt)}>
            Flatten relief (keep threads)
          </button>
        </div>
        <p className="control-note">Flat relief means the exact previous thread appearance. This stays compatible with crossbreeding, thread materials, self-weaving, and the existing animation/export clock.</p>
      </details>
      <details className="filament-crossbreeder filament-stitch-lab">
        <summary>🪡 SELF-WEAVING LOOM — STITCH IN MOTION</summary>
        <p className="control-note">Watch the threads sew themselves, chase a glowing needle, advance in running stitches, or unfurl and resew. The stitch travels along the generated geometry instead of fading an unrelated full-screen texture.</p>
        <Select label="Stitch motion" value={s.filamentStitchMode}
          onChange={mode=>history.change(x=>({...x,filamentStitchMode:mode,
            filamentStitchAmount:Math.max(68,x.filamentStitchAmount),
            filamentAmount:Math.max(55,x.filamentAmount)}))}>
          {filamentStitchModes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
        </Select>
        <Parameter label="Self-weaving presence" name="filamentStitchAmount" history={history}/>
        <Parameter label="Stitch travel speed" name="filamentStitchSpeed" history={history}/>
        <Parameter label="Stitch tail length / spacing" name="filamentStitchLength" history={history}/>
        <Parameter label="Traveling needle glow" name="filamentStitchGlow" history={history}/>
        <Select label="Self-weaving recipe" value={stitchPreset} onChange={setStitchPreset}>
          {filamentStitchPresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
        </Select>
        <div className="pane-actions">
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>applyFilamentStitchPreset(x,stitchPreset))}>
            Start weaving
          </button>
          <button type="button" className="button secondary"
            disabled={s.filamentStitchAmount<=0}
            onClick={()=>history.change(stopFilamentStitching)}>
            Hold finished fabric
          </button>
        </div>
        <p className="control-note">When disabled, your original geometry, colors, materials, beads and two-parent weave return unchanged. Runs on the same timeline as PNG, GIF and MP4 exports.</p>
      </details>
      <details className="filament-crossbreeder filament-material-lab">
        <summary>✨ THREAD ALCHEMY — MATERIALS & BEADS</summary>
        <p className="control-note">Dress the actual stitch paths in iridescent silk, molten chrome, translucent opal, velvet fiber, or glowing twisted yarn. Both parents can wear different materials. Original Thread retains the old look.</p>
        <Select label="First parent fiber material" value={s.filamentMaterial}
          onChange={value=>history.change(x=>({...x,filamentMaterial:value,
            filamentAmount:Math.max(50,x.filamentAmount)}))}>
          {filamentMaterials.map(name=><option key={name} value={name}>{name}</option>)}
        </Select>
        <Select label="Second parent fiber material" value={s.filamentSecondMaterial}
          onChange={value=>history.change(x=>({...x,filamentSecondMaterial:value}))}>
          {filamentMaterials.map(name=><option key={name} value={name}>{name}</option>)}
        </Select>
        <Parameter label="Fuzzy fiber nap" name="filamentNap" history={history}/>
        <Parameter label="Specular luster / shine" name="filamentLuster" history={history}/>
        <Parameter label="Seed bead presence" name="filamentBeads" history={history}/>
        <Parameter label="Seed bead size / spacing" name="filamentBeadSize" history={history}/>
        <Parameter label="Second parent color offset" name="filamentSecondHue" history={history}/>
        <Select label="Material recipe" value={materialPreset} onChange={setMaterialPreset}>
          {filamentMaterialPresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
        </Select>
        <div className="pane-actions">
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>applyFilamentMaterialPreset(x,materialPreset))}>
            Dress the threads
          </button>
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>remixFilamentMaterials(x))}>
            <Dices size={13}/> Remix fibers
          </button>
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>({...x,
              filamentMaterial:"Original thread",
              filamentSecondMaterial:"Original thread",
              filamentNap:0,filamentBeads:0,filamentSecondHue:0}))}>
            Restore classic threads
          </button>
        </div>
        <p className="control-note">The color offset applies to the second parent when crossbreeding is on. Material details compile only when used, and the old shader remains the fallback.</p>
      </details>
      <details className="filament-crossbreeder">
        <summary>🧬 CROSSBREED TWO THREAD SPECIES</summary>
        <p className="control-note">A second mathematical lace structure shares the canvas with your first. At crossings the threads can pass over and under each other. This does not change your artwork engine or your words.</p>
        <Select label="Second thread parent" value={s.filamentSecondSpecies}
          onChange={v=>history.change(x=>({...x,
            filamentSecondSpecies:v,filamentCrossbreed:Math.max(60,x.filamentCrossbreed),
            filamentAmount:Math.max(55,x.filamentAmount)}))}>
          {filamentSpecies.map(name=><option key={name} value={name}>{name}</option>)}
        </Select>
        <Parameter label="Second parent presence" name="filamentCrossbreed" history={history}/>
        <Parameter label="Under / over crossing depth" name="filamentInterlace" history={history}/>
        <Parameter label="Secondary thread rotation" name="filamentTwist" history={history}/>
        <Parameter label="Secondary motion phase" name="filamentPhase" history={history}/>
        <Select label="Hybrid breeding recipe" value={hybridPreset} onChange={setHybridPreset}>
          {filamentHybridPresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
        </Select>
        <div className="pane-actions">
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>applyFilamentHybrid(x,hybridPreset))}>
            Spawn hybrid
          </button>
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>breedFilaments(x))}>
            <Dices size={13}/> Breed wild
          </button>
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>({...x,
              filamentSpecies:x.filamentSecondSpecies,
              filamentSecondSpecies:x.filamentSpecies}))}>
            Swap parents
          </button>
          <button type="button" className="button secondary"
            disabled={s.filamentCrossbreed<=0}
            onClick={()=>history.change(x=>({...x,filamentCrossbreed:0}))}>
            Unbreed (keep first)
          </button>
        </div>
      </details>
      <p className="control-note">Presence at 0 leaves existing art untouched. Crossbreed at 0 runs only the original thread shader. Both patterns use the normal PNG/GIF/MP4 renderer.</p>
    </>,
    photon: <>
      <Select label="Species" value={s.photonSpecies}
        onChange={v=>history.change(x=>({...x,photonSpecies:v,photonAmount:Math.max(52,x.photonAmount)}))}>
        {photonSpecies.map(name=><option key={name} value={name}>{name}</option>)}
      </Select>
      <Parameter label="Presence" name="photonAmount" history={history}/>
      <Parameter label="Size" name="photonScale" history={history}/>
      <Parameter label="Fine detail" name="photonDensity" history={history}/>
      <Parameter label="Motion" name="photonMotion" history={history}/>
      <Parameter label="Glass relief" name="photonRelief" history={history}/>
      <Parameter label="Spectrum shift" name="photonHue" history={history}/>
      <Parameter label="Variation" name="photonVariation" history={history}/>
      <div className="preset-row">
        <Select label="Quick-start sculpture" value={photonPreset} onChange={setPhotonPreset}>
          {photonPresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
        </Select>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>photonPresetState(x,photonPreset))}>
          Spawn selected sculpture
        </button>
      </div>
      <div className="pane-actions">
        <button type="button" className="button secondary" onClick={()=>history.change(x=>nextPhotonSpecies(x))}>
          <Dices size={13}/> New creature, keep art
        </button>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>({...x,photonVariation:(x.photonVariation+19+Math.random()*64)%100}))}>
          <Shuffle size={13}/> Reseed
        </button>
        <button type="button" className="button secondary"
          disabled={s.photonAmount<=0}
          onClick={()=>history.change(x=>({...x,photonAmount:0}))}>
          Hide photons
        </button>
      </div>
    </>,
    signal: <>
      <Parameter label="Chromatic split" name="split" history={history} />
      <Parameter label="Signal drift" name="glitch" history={history} />
      <Parameter label="Block corruption" name="block" history={history} />
      <Parameter label="Pixelation" name="pixel" history={history} />
    </>,
    analog: <>
      <Parameter label="Scanlines" name="scan" history={history} />
      <Parameter label="Film grain" name="grain" history={history} />
      <Parameter label="Vignette" name="vignette" history={history} />
    </>,
    screen: <>
      <Parameter label="Phosphor subpixels" name="phosphor" history={history} />
      <Parameter label="Broadcast bars" name="broadcast" history={history} />
    </>,
    print: <>
      <Parameter label="Bayer dither" name="dither" history={history} />
      <Parameter label="CMY risograph" name="riso" history={history} />
      <Parameter label="Ink misregistration" name="misregister" history={history} />
    </>,
    memory: <>
      <Parameter label="Afterimage" name="afterimage" history={history} />
      <Parameter label="Datamosh" name="datamosh" history={history} />
      <Parameter label="Drift" name="memoryDrift" history={history} />
      <Parameter label="Decay" name="memoryDecay" history={history} />
    </>,
    oldweb: <>
      <Parameter label="Error windows" name="windowCascade" history={history} />
      <Parameter label="Glitter explosions" name="glitter" history={history} />
    </>,
    micro: <>
      <Select label="Texture" value={s.microMode}
        onChange={(v)=>history.change(x=>({...x,microMode:v}))}>
        {microModes.map(mode=><option key={mode}>{mode}</option>)}
      </Select>
      <Parameter label="Presence" name="microAmount" history={history}/>
      <Parameter label="Scale" name="microScale" history={history}/>
      <Parameter label="Motion" name="microMotion" history={history}/>
      <Parameter label="Relief" name="microRelief" history={history}/>
      <Parameter label="Density" name="microDensity" history={history}/>
      <Parameter label="Color shift" name="microHue" history={history}/>
      <Parameter label="Variation" name="microVariation" history={history}/>
      <Reseed label="Reseed texture" onClick={()=>history.change(x=>({...x,microVariation:
        (x.microVariation+23+Math.random()*56)%100}))}/>
    </>,
    substance: <>
      <Select label="Substance" value={s.substanceMode}
        onChange={v=>history.change(x=>({...x,substanceMode:v}))}>
        {substanceModes.map(mode=><option key={mode}>{mode}</option>)}
      </Select>
      <Parameter label="Strength" name="substanceAmount" history={history}/>
      <Parameter label="Cell scale" name="substanceScale" history={history}/>
      <Parameter label="Motion" name="substanceMotion" history={history}/>
      <Parameter label="Relief" name="substanceRelief" history={history}/>
      <Parameter label="Edge glow" name="substanceEdge" history={history}/>
      <Parameter label="Palette shift" name="substanceHue" history={history}/>
      <Parameter label="Variation" name="substanceVariation" history={history}/>
      <Reseed label="Reseed substance" onClick={()=>history.change(x=>({...x,substanceVariation:
        (x.substanceVariation+19+Math.random()*67)%100}))}/>
    </>,
    foil: <>
      <Parameter label="Thin-film rainbow" name="filmAmount" history={history} />
      <Parameter label="Film thickness" name="filmThickness" history={history} />
      <Parameter label="Opal flashes" name="opalAmount" history={history} />
      <Parameter label="Dichroic prism" name="prismAmount" history={history} />
      <Parameter label="Relief highlights" name="foilRelief" history={history} />
      <Parameter label="Animation" name="foilMotion" history={history} />
    </>,
    bio: <>
      <Parameter label="Organism" name="bioAmount" history={history} />
      <Parameter label="Feed" name="bioFeed" history={history} />
      <Parameter label="Kill" name="bioKill" history={history} />
      <Parameter label="Growth speed" name="bioSpeed" history={history} />
      <Parameter label="Veins" name="bioVeins" history={history} />
    </>,
    wiggle: <>
      <Select label="View motion" value={s.wiggleMode}
        onChange={v=>history.change(x=>({...x,wiggleMode:v}))}>
        {wiggleModes.map(mode=><option key={mode}>{mode}</option>)}
      </Select>
      <Parameter label="Wiggle" name="wiggleAmount" history={history}/>
      <Parameter label="Depth" name="wiggleDepth" history={history}/>
      <Parameter label="Speed" name="wiggleSpeed" history={history}/>
      <Parameter label="Depth layers" name="wiggleLayers" history={history}/>
      <button type="button" className="subtle-button full"
        onClick={()=>history.change(x=>({...x,wiggleMode:"Flipbook",
          wiggleAmount:67,wiggleDepth:72,wiggleSpeed:48,wiggleLayers:62}))}>
        Make it wiggle
      </button>
    </>,
    stereo: <>
      <Select label="Shape" value={s.stereoShape}
        onChange={(v) => history.change((x) => ({...x, stereoShape: v}))}>
        {["Gyroid Cathedral", "Metaball Choir", "Opal Knot", "Crystal Lattice", "Ribbon Wormhole"]
          .map((m) => <option key={m}>{m}</option>)}
      </Select>
      <Parameter label="Overlay" name="stereoAmount" history={history} />
      <Parameter label="Depth fog" name="stereoDepth" history={history} />
      <Parameter label="Parallax" name="stereoParallax" history={history} />
      <Parameter label="Morph" name="stereoMorph" history={history} />
      <Parameter label="Prism light" name="stereoGlow" history={history} />
      <Parameter label="Camera wiggle" name="stereoWiggle" history={history} />
      <Parameter label="Detail (GPU load)" name="stereoQuality" history={history} />
    </>,
    backdrop: <>
      <Select label="Background" value={s.backdropMode}
        onChange={(v) => history.change((x) => ({...x, backdropMode:v}))}>
        {backdropModes.map((mode) => <option key={mode}>{mode}</option>)}
      </Select>
      <Parameter label="Presence" name="backdropAmount" history={history} />
      <Parameter label="Parallax depth" name="backdropDepth" history={history} />
      <Parameter label="Density" name="backdropDensity" history={history} />
      <Parameter label="Motion" name="backdropMotion" history={history} />
      <Parameter label="Glow" name="backdropGlow" history={history} />
      <Parameter label="Palette shift" name="backdropHue" history={history} />
      <Parameter label="Variation" name="backdropVariation" history={history} />
      <Reseed label="Shuffle background" onClick={() => history.change((x) => ({...x,backdropVariation:
        (x.backdropVariation+19+Math.random()*62)%100}))}/>
    </>,
  };
  const shown = effectSections.filter((m) => visible(m.id));
  return (
    <>
      <div className="fx-pills" role="group" aria-label="Quick effect toggles">
        {[["bloom","Bloom"],["posterize","Posterize"],["invert","Invert"]].map(([k,label])=>
          <Pill key={k} label={label} checked={s[k]}
            onChange={()=>history.change(x=>({...x,[k]:!x[k]}))}/>)}
      </div>
      <div className="fx-filter" role="tablist" aria-label="Show effects">
        {["All", "On", ...effectGroups].map((f) => (
          <button key={f} type="button" role="tab" aria-selected={filter === f}
            className={filter === f ? "active" : ""} onClick={() => setFilter(f)}>
            {f === "On" ? <>On <b>{onCount}</b></> : f}
          </button>
        ))}
      </div>
      {shown.length === 0 && (
        <p className="control-note">Nothing switched on yet. Pick a group above and push a slider.</p>
      )}
      {shown.map((m) => (
        <Section key={m.id} id={m.id} history={history}>{body[m.id]}</Section>
      ))}
    </>
  );
}

// ---- Layers -----------------------------------------------------------------
export function LayersInspector({ history }) {
  const s = history.state;
  const on = s.blend > 0;
  return (
    <>
      <div className="layer-stack">
        <div className="layer-card">
          <Layers size={16} />
          <div>
            {engines[s.engine]}
            <small>Base engine · change it in Math</small>
          </div>
        </div>
        <div className="layer-connector">
          <ArrowDown size={13} />
          <span>{on ? `${Math.round(s.blend)}% ${s.blendMode.toUpperCase()}` : "SECOND ENGINE OFF"}</span>
        </div>
      </div>
      <Section id="second" history={history} defaultOpen>
        <Toggle label="Use a second engine" checked={on}
          onChange={() => history.change((x) => ({ ...x, blend: x.blend === 0 ? 45 : 0 }))} />
        <Select
          label="Second engine"
          value={s.secondaryEngine}
          onChange={(v) => history.change((x) => ({ ...x, secondaryEngine: +v }))}
        >
          {engines.map((e, i) => (
            <option value={i} key={i}>{e}</option>
          ))}
        </Select>
        <Segmented label="How they combine" value={s.blendMode} options={["Mix", "Multiply", "Difference"]}
          onChange={(v) => history.change((x) => ({ ...x, blendMode: v }))} />
        <Parameter label="Amount" name="blend" history={history} />
        <button type="button" className="subtle-button full"
          onClick={() => history.change((x) => ({...x,engine:x.secondaryEngine,secondaryEngine:x.engine}))}>
          <ArrowLeftRight size={13} /> Swap base and second engine
        </button>
      </Section>
      <Section id="territories" history={history}>
        <Select label="Shape of territories" value={s.compositionMode}
          onChange={(v) => history.change((x) => ({...x, compositionMode:v}))}>
          {compositionModes.map((mode) => <option key={mode}>{mode}</option>)}
        </Select>
        <Parameter label="Strength" name="compositionAmount" history={history} />
        <Parameter label="Size / density" name="compositionScale" history={history} />
        <Parameter label="Edge softness" name="compositionFeather" history={history} />
        <Parameter label="Movement" name="compositionMotion" history={history} />
        <Parameter label="Second world's color shift" name="compositionColorShift" history={history} />
        <Parameter label="Variation" name="compositionVariation" history={history} />
        <Reseed label="Shuffle layout" onClick={() => history.change((x) => ({...x,compositionVariation:
          (x.compositionVariation+17+Math.random()*61)%100}))}/>
      </Section>
    </>
  );
}

// ---- Touch ------------------------------------------------------------------
export function TouchInspector({
  history,
  tool,
  onTool,
  showHandles,
  onHandles,
  selected,
  onSelect,
}) {
  const s = history.state,
    mark = s.marks.find((m) => m.id === selected),
    colony = (s.habitatStamps||[]).find((m)=>m.id===selected);
  function edit(v) {
    history.preview((x) => ({
      ...x,
      marks: x.marks.map((m) => (m.id === selected ? { ...m, ...v } : m)),
    }));
  }
  return (
    <>
      <Section id="habitat-paint" history={history}
        aside={<span className="section-count">{(s.habitatStamps||[]).length}/{MAX_HABITAT_STAMPS}</span>}>
        <p className="control-note">
          HABITAT GRAFFITI — paint pink A colonies or cyan B colonies on the live artwork.
          They are independent of warp/vortex forces and visible in PNG/GIF/MP4.
        </p>
        <div className="touch-tools habitat-tools">
          {[[Flower2,"Plant A"],[Orbit,"Plant B"],[Move,"Move Colony"],[Eraser,"Erase Colony"]]
            .map(([Icon,label])=><button type="button" key={label}
              className={tool===label?"selected":""}
              aria-pressed={tool===label}
              onClick={()=>onTool(label)}>
              <Icon size={15}/>{label}
            </button>)}
        </div>
        <Parameter label="New colony size" name="habitatBrushRadius" history={history}/>
        <button type="button" className="subtle-button full"
          onClick={()=>history.change(x=>shuffleColonies(x))}>
          <Shuffle size={13}/> Shuffle colonies
        </button>
        <p className="control-note">
          Tap or drag to plant. Drag a colony handle to move it.
          Paint mode adds; Move mode drags; Erase mode removes.
          Pink A and cyan B are touch guides only, not fixed pigment colors.
        </p>
        {(s.habitatStamps||[]).length>0&&<>
          <Select label="Selected colony" value={colony?.id||""} onChange={onSelect}>
            <option value="">Choose one…</option>
            {s.habitatStamps.map((m,i)=><option key={m.id} value={m.id}>
              {i+1}. {m.parent===0?"A":"B"} colony
            </option>)}
          </Select>
          {colony&&<div className="source-editor">
            <Select label="Belongs to" value={String(colony.parent)}
              onChange={parent=>history.change(x=>({...x,
                habitatStamps:x.habitatStamps.map(m=>m.id===colony.id
                  ?{...m,parent:Number(parent)}:m)}))}>
              <option value="0">Parent A</option>
              <option value="1">Parent B</option>
            </Select>
            <Range label="Colony radius" value={Math.round(colony.radius*100)}
              min={5} max={45}
              onStart={history.begin}
              onChange={radius=>history.preview(x=>({...x,
                habitatStamps:x.habitatStamps.map(m=>m.id===colony.id
                  ?{...m,radius:radius/100}:m)}))}
              onEnd={history.end} onCancel={history.cancel}/>
            <button type="button" className="subtle-button danger full"
              onClick={()=>history.change(x=>({...x,
                habitatStamps:x.habitatStamps.filter(m=>m.id!==colony.id)}))}>
              <Trash2 size={13}/> Delete selected colony
            </button>
          </div>}
          <div className="pane-actions">
            <button type="button" className="button secondary"
              onClick={()=>history.change(x=>clearColonies(x,0))}>
              Clear A seeds
            </button>
            <button type="button" className="button secondary"
              onClick={()=>history.change(x=>clearColonies(x,1))}>
              Clear B seeds
            </button>
            <button type="button" className="button secondary"
              onClick={()=>history.change(x=>clearColonies(x))}>
              Clear all seeds
            </button>
          </div>
        </>}
      </Section>
      <Section id="brush" defaultOpen>
        <div className="touch-tools">
          {[
            [Paintbrush, "Paint"],
            [Move, "Move"],
            [Eraser, "Erase"],
          ].map(([Icon, label]) => (
            <button
              className={tool === label ? "selected" : ""}
              aria-pressed={tool === label}
              onClick={() => onTool(label)}
              key={label}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
        <Segmented label="Force" value={s.touchMode} options={touchModes}
          onChange={(v) => history.change((x) => ({ ...x, touchMode: v }))} />
        <p className="control-note">
          {
            [
              "Bends the field into liquid ribbons.",
              "Stirs a whirlpool into the signal.",
              "Pushes the field away from your finger.",
              "Shifts color only. Shape stays put.",
            ][touchModes.indexOf(s.touchMode)]
          }
        </p>
        <Parameter label="Strength" name="strength" history={history} />
        <Parameter label="Radius" name="radius" history={history} />
        <Toggle
          label="Show touch handles"
          icon={showHandles ? <Eye size={14} /> : <EyeOff size={14} />}
          checked={showHandles}
          onChange={onHandles}
        />
        <button
          className="subtle-button full"
          onClick={() =>
            history.change((x) => {
              const m = makeMark(x);
              onSelect(m.id);
              return { ...x, marks: [...x.marks, m].slice(-32) };
            })
          }
        >
          <Plus size={14} />
          Add force at center
        </button>
      </Section>
      <Section
        id="forces"
        defaultOpen
        aside={<span className="section-count">{s.marks.length}/32</span>}
      >
        {!s.marks.length ? (
          <p className="control-note">
            None yet. Drag on the art to paint some.
          </p>
        ) : (
          <>
            <Select
              label="Selected force"
              value={mark?.id || ""}
              onChange={onSelect}
            >
              <option value="">Choose one…</option>
              {s.marks.map((m, i) => (
                <option key={m.id} value={m.id}>
                  {i + 1}. {touchModes[m.mode]}
                </option>
              ))}
            </Select>
            {mark && (
              <div className="source-editor">
                <Range
                  label="Strength"
                  value={Math.round(mark.power * 100)}
                  min={-200}
                  max={200}
                  onStart={history.begin}
                  onChange={(v) => edit({ power: v / 100 })}
                  onEnd={history.end}
                  onCancel={history.cancel}
                />
                <Range
                  label="Radius"
                  value={Math.round(mark.radius * 100)}
                  min={5}
                  max={60}
                  onStart={history.begin}
                  onChange={(v) => edit({ radius: v / 100 })}
                  onEnd={history.end}
                  onCancel={history.cancel}
                />
                <Range
                  label="Angle"
                  value={((((mark.angle * 180) / Math.PI) % 360) + 360) % 360}
                  min={0}
                  max={360}
                  format={deg}
                  onStart={history.begin}
                  onChange={(v) => edit({ angle: (v * Math.PI) / 180 })}
                  onEnd={history.end}
                  onCancel={history.cancel}
                />
                <button
                  className="subtle-button danger full"
                  onClick={() =>
                    history.change((x) => ({
                      ...x,
                      marks: x.marks.filter((m) => m.id !== selected),
                    }))
                  }
                >
                  <Trash2 size={13} />
                  Remove this force
                </button>
              </div>
            )}
            <button
              className="subtle-button full"
              onClick={() => history.change((x) => ({ ...x, marks: [] }))}
            >
              Clear all forces
            </button>
          </>
        )}
      </Section>
    </>
  );
}
