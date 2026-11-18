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
import { engineInfo, engines, touchModes, makeMark, motionModes, tunnelModes, compositionModes, backdropModes, microModes, substanceModes, wiggleModes } from "../data";
import { Parameter, Range, Toggle, Switch, Select, Section, Segmented, Pill, useReveal } from "./Controls";
import { photonSpecies, photonPresets, photonPresetState, nextPhotonSpecies } from "../photon-zoo.js";
import { filamentSpecies, filamentPresets, applyFilamentPreset, nextFilamentSpecies,
  filamentHybridPresets, applyFilamentHybrid, breedFilaments,
  filamentMaterials,filamentMaterialPresets,applyFilamentMaterialPreset,
  remixFilamentMaterials,filamentStitchModes,filamentStitchPresets,
  applyFilamentStitchPreset,stopFilamentStitching,
  filamentSculptModes,filamentSculptPresets,applyFilamentSculptPreset,disableFilamentSculpt } from "../filament-forge.js";
import { sections, sectionActive, effectGroups } from "../ui-index";
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
export function EffectsInspector({ history }) {
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
    mark = s.marks.find((m) => m.id === selected);
  function edit(v) {
    history.preview((x) => ({
      ...x,
      marks: x.marks.map((m) => (m.id === selected ? { ...m, ...v } : m)),
    }));
  }
  return (
    <>
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
