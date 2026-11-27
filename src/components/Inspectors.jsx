import {categoryOwns,readCategoryLocks,writeCategoryLocks,protectCategorySettings} from "../category-locks.js";
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
import { engineInfo, engines, touchModes, makeMark, motionModes, tunnelModes, compositionModes, backdropModes, microModes, substanceModes, wiggleModes, randomize, initial, numericRanges } from "../data";
import {hexagramPresets,applyHexagramPreset,remixHexagram,disableHexagram} from "../hexagram-terraces.js";
import {polesModes,polesPresets,applyPolesPreset,shufflePoles,hidePoles} from "../complex-poles.js";
import {qdModes,qdOrders,qdPresets,applyQdPreset,shuffleQd,hideQd} from "../quasicrystal-dissolution.js";
import {velvetModes,crochetModes,textilePresets,applyTextilePreset,
  shuffleVelvet,shuffleCrochet,hideVelvet,hideCrochet} from "../living-textiles-wave5.js";
import {breedModes,breedPresets,breedRequiredParents,breedActive,
  activateBreed,applyBreedPreset,shuffleBreed,hideBreed} from "../crossbreed-lab.js";
import {g2Modes,g2Presets,applyG2Preset,shuffleG2,hideG2}
  from "../g2-torsion-membranes.js";
import { Parameter, Range, Toggle, Switch, Select, Section, Segmented, Pill } from "./Controls";
import GlassOpticalLab from "./GlassOpticalLab";
import {microFamilies,microPresets,applyMicroPreset,remixMicro} from "../microstructure.js";
import {substanceFamilies,substancePresets,applySubstancePreset,remixSubstance} from "../substance.js";
import {bioRotPresets,applyBioRotPreset,remixBioRot} from "../bio-rot-presets.js";
import { photonSpecies, photonSpeciesFamilies, photonSpeciesDescriptions,
  photonPresets, photonPresetState, nextPhotonSpecies,
  remixPhotonZoo,remixFunkyPhoton } from "../photon-zoo.js";
import { backdropFamilies,backdropDescriptions,backdropPresets,
  applyBackdropPreset,remixBackdrop } from "../backdrops.js";
import {alchemyModes,alchemyFamilies,alchemyDescriptions,alchemyPresets,
  applyAlchemyPreset,shuffleAlchemy,hideAlchemy} from "../chromatic-alchemy.js";
import {schlierenModes,schlierenPresets,mathematicalGlassModes,mathematicalGlassPresets,glassEtchingModes,glassMotionModes,glassCouplingModes,glassCouplingRules,glassMaterialModes,glassTransportModes,shuffleMathematicalGlass,applySchlierenPreset,shuffleSchlieren,hideSchlieren} from "../schlieren-glass.js";
import {injuryModes,injuryFamilies,injuryDescriptions,injuryPresets,
  applyInjuryPreset,shuffleInjury,hideInjury} from "../print-spectrum-injury.js";
import {spxModes,spxPresets,applySpxPreset,shuffleSpx,hideSpx}
  from "../subpixel-moire-wave11.js";
import {psModes,psPresets,applyPsPreset,shufflePs,hidePs}
  from "../prismatic-scale-matrix-wave12.js";
import {kdModes,kdPresets,applyKdPreset,shuffleKd,hideKd}
  from "../kleinian-dither-wave13.js";
import {vcModes,vcPresets,applyVcPreset,shuffleVc,hideVc}
  from "../curlwave-witchcraft-wave14.js";
import { filamentSpecies, filamentSpeciesFamilies, remixXenoVascular,
  xenoVascularSpecies, filamentPresets, applyFilamentPreset, nextFilamentSpecies, remixFreshFilaments,
  filamentHybridPresets, applyFilamentHybrid, breedFilaments,
  filamentMaterials,filamentMaterialPresets,applyFilamentMaterialPreset,remixUnusualFilamentMaterials,
  filamentAdornmentModes,filamentAdornmentFamilies,filamentAdornmentDescriptions,jewelryPlacementModes,jewelryKineticModes,remixJewelryChoreography,jewelryFinishModes,remixJewelryFinish,jewelryInteriorModes,remixJewelryInterior,jewelryColonyModes,remixJewelryColony,
  filamentAdornmentPresets,applyFilamentAdornmentPreset,remixFilamentAdornments,remixThreadCouture,
  filamentMorphModes,filamentMorphFamilies,filamentMorphDescriptions,
  filamentMorphPresets,applyFilamentMorphPreset,remixFilamentMorph,
  filamentContagionModes,filamentContagionFamilies,filamentContagionDescriptions,
  filamentContagionPresets,applyFilamentContagionPreset,remixFilamentContagion,
  filamentNeuralModes,filamentNeuralFamilies,filamentNeuralDescriptions,
  filamentNeuralPresets,applyFilamentNeuralPreset,remixFilamentNeural,
  filamentPlasticModes,filamentPlasticFamilies,filamentPlasticDescriptions,
  filamentPlasticPresets,applyFilamentPlasticPreset,remixFilamentPlastic,
  filamentScarModes,filamentScarFamilies,filamentScarDescriptions,
  filamentScarPresets,applyFilamentScarPreset,remixFilamentScars,
  filamentRegenModes,filamentRegenFamilies,filamentRegenDescriptions,
  filamentRegenPresets,applyFilamentRegenPreset,remixFilamentRegeneration,
  remixFilamentMaterials,fiberConstructionModes,remixFiberConstruction,microloomModes,remixMicroloom,textilePhysicsModes,remixTextilePhysics,textileChromaModes,remixTextileChroma,textileEcologyModes,remixTextileEcology,textileArchitectureModes,remixTextileArchitecture,textileDimensionModes,textileDimensionTargets,remixTextileDimension,textileMetaModes,remixTextileMeta,textileEngravingModes,remixTextileEngraving,textileAlchemyModes,textileAlchemyTargets,remixTextileAlchemy,filamentStitchModes,filamentStitchFamilies,
  filamentStitchDescriptions,remixFilamentStitchMotion,remixRitualStitches,
  filamentStitchPresets,applyFilamentStitchPreset,stopFilamentStitching,
  feralJacquardPresets,applyFeralJacquardPreset,remixFeralJacquard,
  quasicrystalBrocadePresets,applyQuasicrystalBrocadePreset,remixQuasicrystalBrocade,
  chladniNeedlePresets,applyChladniNeedlePreset,remixChladniNeedles,
  retrocausalEmbroideryPresets,applyRetrocausalEmbroideryPreset,remixRetrocausalEmbroidery,
  filamentSculptModes,filamentSculptFamilies,filamentSculptPresets,
  applyFilamentSculptPreset,remixFilamentSculpt,disableFilamentSculpt } from "../filament-forge.js";
import {structuralOpticsModes,structuralOpticsDescriptions,structuralOpticsPresets,
  applyStructuralOpticsPreset,remixStructuralOptics,disableStructuralOptics,
  swapStructuralOptics} from "../structural-thread-optics.js";
import {semanticGravityModes,semanticGravityDescriptions,semanticGravityPresets,
  applySemanticGravityPreset,remixSemanticGravity,disableSemanticGravity} from "../semantic-gravity.js";
import { underlayModes,underlayFamilies,underlayDescriptions,remixUnderlay,
  underlayPresets,applyUnderlayPreset,changeUnderlayMode,
  nextUnderlayMode,disableUnderlay } from "../living-underlay.js";
import EffectsWorkbench from "./EffectsWorkbench";
import { atmosphereModes, atmospherePresets, applyAtmospherePreset,
  nextAtmosphereMode, hideAtmosphere, hybridAtmospherePresets,
  applyAtmosphereHybridPreset, nextAtmosphereBMode, breedAtmospheres,
  swapAtmosphereParents, hideAtmospherePair } from "../mutant-atmospheres.js";
import { atmosphereHabitats, atmosphereSecondHabitats,
  atmosphereBlendModes } from "../atmosphere-habitats.js";
import { habitatTools, MAX_HABITAT_STAMPS, clearColonies } from "../habitat-painter.js";
import { colonyLifeModes, colonyLifePresets, applyColonyLifePreset,
  stopColonyLife } from "../colony-lifecycle.js";
import { colonyAnatomyModes, colonyAnatomyPresets, colonyPoreModes, applyColonyAnatomyPreset,
  clearColonyAnatomy, shuffleColonyAnatomy } from "../colony-anatomy.js";
import { colonyCortexModes, colonyCortexPresets, applyColonyCortexPreset,
  clearColonyCortex, shuffleColonyCortex } from "../colony-cortex.js";
import { sporeModes, sporePresets, applySporePreset, shuffleSporeDynasty,
  evolveSporeGeneration, stopSpores, sporeParticipatingCount } from "../spore-dynasties.js";
import { substrateModes, substratePresets, applySubstratePreset,
  clearSubstrate, shuffleSubstrate } from "../substrate-alchemy.js";
import { symbiosisModes, symbiosisPresets, applySymbiosisPreset,
  shuffleSymbiosis, stopSymbiosis, ensureSymbioticContact } from "../symbiosis-lab.js";
import { genePresets, seedGenePool, mutateGenePool, mutateSelectedGene,
  applyGenePreset, hideGenetics } from "../colony-genetics.js";
import {selectionModes,selectionPresets,selectionActive,
  applySelectionPreset,prepareSelection,shuffleSelection,
  rankSelection,colonyFitness,cullWeakest,breedFittest,
  selectionCycle,stopSelection} from "../selection-chamber.js";
import {apocalypseModes,apocalypsePresets,apocalypseActive,
  applyApocalypsePreset,shuffleApocalypse,advanceApocalypseEpoch,
  haltApocalypse} from "../apocalypse-clock.js";
import {MAX_FOSSILS,fossilModes,fossilPresets,applyFossilPreset,
  shuffleFossils,archiveFossils,archiveAndAdvance,hideFossils,
  clearFossilArchive} from "../fossil-record.js";
import {resurrectionModes,canResurrectRecord,resurrectFossil,
  resurrectOldest,resurrectWholeArchive} from "../ancestral-resurrection.js";
import {echoModes,evolveAncestralGeneration,evolveAncestralEpochs} from "../ancestral-echoes.js";
import {speciationModes,branchSpecies,contestTerritory,lineageCensus} from "../speciation-lab.js";
import {coevolutionModes,encounterNetwork,stageEncounter,evolveCoevolution} from "../coevolution-lab.js";
import {MAX_SUCCESSION,successionModes,prepareSuccession,
  advanceSuccession,advanceSuccessionAges,successionCensus,
  shuffleSuccession,hideSuccession,clearSuccession} from "../ecological-succession.js";
import { ensureValidEcosystemState } from "../ecosystem-randomizer.js";
import {substrateResourceAt} from "../substrate-alchemy.js";
import {foodWebModes,foodWebLinks,foodWebActive,foodWebLedger,
  prepareFoodWeb,stageFoodWeb,feedFoodWeb,shuffleFoodWeb,
  hideFoodWeb,MAX_FOOD_WEB_LINKS} from "../living-food-web.js";
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
export function TextileMathControls({history}){
  const state=history.state;
  const [textilePreset,setTextilePreset]=React.useState(textilePresets[0].name);
  return <>      <Section id="living-velvet" history={history}>
        <p className="control-note">
          P4m-mirrored seven-orbit Lenia-inspired tissue blooms into raised
          living damask. Simulated soft pile has directional nap, velvet sheen,
          wet organelles and your editable art palette. Existing threads
          stay visible underneath.
        </p>
        <Select label="Velvet species" value={state.velvetMode}
          onChange={mode=>history.change(s=>({...s,velvetMode:mode,
            vldAmount:Math.max(s.vldAmount,60)}))}>
          {velvetModes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
        </Select>
        <Parameter label="Living velvet presence" name="vldAmount" history={history}/>
        {state.vldAmount>0&&<>
          <Parameter label="Damask wallpaper scale" name="vldScale" history={history}/>
          <Parameter label="Morphological growth pace" name="vldGrowth" history={history}/>
          <Parameter label="Raised tissue / geometry relief" name="vldRelief" history={history}/>
          <Parameter label="Fuzzy velvet pile direction" name="vldNap" history={history}/>
          <Parameter label="Wet motif gloss" name="vldGloss" history={history}/>
          <Parameter label="Palette phase" name="vldHue" history={history}/>
          <Parameter label="Living organism variation" name="vldVariation" history={history}/>
          <Parameter label="Metaball tissue density" name="vldDensity" history={history}/>
        </>}
        <div className="pane-actions">
          <button type="button" className="button secondary"
            onClick={()=>history.change(s=>shuffleVelvet(s))}>
            <Shuffle size={13}/> Shuffle velvet only
          </button>
          <button type="button" className="button secondary"
            disabled={state.vldAmount<=0}
            onClick={()=>history.change(hideVelvet)}>
            <EyeOff size={13}/> Hide velvet
          </button>
        </div>
        <p className="control-note">
          This is continuously animated Lenia-inspired morphology, not a
          stored-state biological cellular simulation. It responds to existing
          brush coordinate deformation and shares the normal render clock.
        </p>
      </Section>
      <Section id="hyperbolic-crochet" history={history}>
        <p className="control-note">
          Ruffled negative-curvature-inspired geometry meets inversion-folded
          3D fractal lace. A bounded 8–20-step SDF raymarch builds luminous
          yarn surfaces without the 150-step shader that cooked the reference.
        </p>
        <Select label="Fractal crochet species" value={state.crochetMode}
          onChange={mode=>history.change(s=>({...s,crochetMode:mode,
            hcrAmount:Math.max(s.hcrAmount,55)}))}>
          {crochetModes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
        </Select>
        <Parameter label="Crochet visibility" name="hcrAmount" history={history}/>
        {state.hcrAmount>0&&<>
          <Parameter label="Crochet geometry scale" name="hcrScale" history={history}/>
          <Parameter label="Hyperbolic ruffles" name="hcrRuffles" history={history}/>
          <Parameter label="Lace thickness / relief" name="hcrDepth" history={history}/>
          <Parameter label="Inversion lattice density" name="hcrLace" history={history}/>
          <Parameter label="Living crochet motion" name="hcrMotion" history={history}/>
          <Parameter label="Bouclé yarn / fuzz" name="hcrYarn" history={history}/>
          <Parameter label="Prismatic edge color" name="hcrIridescence" history={history}/>
          <Parameter label="Raymarch detail (mobile cost)" name="hcrQuality" history={history}/>
          <Parameter label="Crochet palette phase" name="hcrHue" history={history}/>
        </>}
        <div className="pane-actions">
          <button type="button" className="button secondary"
            onClick={()=>history.change(s=>shuffleCrochet(s))}>
            <Shuffle size={13}/> Shuffle crochet only
          </button>
          <button type="button" className="button secondary"
            disabled={state.hcrAmount<=0}
            onClick={()=>history.change(hideCrochet)}>
            <EyeOff size={13}/> Hide crochet
          </button>
        </div>
        <Select label="Velvet + crochet crossbreed recipe" value={textilePreset}
          onChange={setTextilePreset}>
          {textilePresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
        </Select>
        <button type="button" className="button secondary"
          onClick={()=>history.change(s=>applyTextilePreset(s,textilePreset))}>
          Apply textile crossbreed
        </button>
        <p className="control-note">
          Quality adds raymarch steps, not resolution: reduce it for iPhone
          preview or high-resolution exports. Crochet and velvet work
          independently. Old artwork keeps both off until activated.
        </p>
      </Section>
</>;
}
export function MathInspector({ history, locked, onLock, onLookbook }) {
  const state = history.state;
  const [hexagramPreset,setHexagramPreset]=React.useState(hexagramPresets[0].name);
  const [polesPreset,setPolesPreset]=React.useState(polesPresets[0].name);
  const [qdPreset,setQdPreset]=React.useState(qdPresets[0].name);
  const [breedPreset,setBreedPreset]=React.useState(breedPresets[0].name);
  const [g2Preset,setG2Preset]=React.useState(g2Presets[0].name);
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
            const Icon = icons[i] || Orbit;
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
      <Section id="g2-membrane" history={history}>
        <p className="control-note">
          From your original g2-holonomy and g2-membrane shader sketches:
          two competing orientation fields generate strain, photonic
          veins, broken apertures and living folds. Real domain deformation
          comes BEFORE geometry; palette-fed structural color comes AFTER.
          Inspired by the source shader's symbolic G₂ grammar, not a
          literal seven-dimensional holonomy simulation.
        </p>
        <Select label="Torsion membrane organism" value={state.g2Mode}
          onChange={mode=>history.change(s=>({...s,g2Mode:mode,
            g2Amount:Math.max(s.g2Amount,65)}))}>
          {g2Modes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
        </Select>
        <div className="preset-row">
          <Select label="G₂ membrane mutation" value={g2Preset}
            onChange={setG2Preset}>
            {g2Presets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
          </Select>
          <button type="button" className="button secondary"
            onClick={()=>history.change(s=>applyG2Preset(s,g2Preset))}>
            Activate membrane recipe
          </button>
        </div>
        <Parameter label="Membrane presence" name="g2Amount" history={history}/>
        {state.g2Amount>0&&<>
          <Parameter label="Chamber / field scale" name="g2Scale" history={history}/>
          <Parameter label="Bend underlying geometry" name="g2Warp" history={history}/>
          <Parameter label="Torsion motion" name="g2Motion" history={history}/>
          <Parameter label="Dual-field strain" name="g2Torsion" history={history}/>
          <Parameter label="Rupture / aperture intensity" name="g2Fracture" history={history}/>
          <Parameter label="Embossed photonic veins" name="g2Veins" history={history}/>
          <Parameter label="Wet structural shine" name="g2Sheen" history={history}/>
          <Parameter label="Palette phase" name="g2Hue" history={history}/>
          <Parameter label="Topological variation" name="g2Variation" history={history}/>
          <Parameter label="Prismatic spectral divergence" name="g2Dispersion" history={history}/>
        </>}
        <div className="pane-actions">
          <button type="button" className="button secondary"
            onClick={()=>history.change(s=>shuffleG2(s))}>
            <Shuffle size={13}/> Shuffle G₂ membrane
          </button>
          <button type="button" className="button secondary"
            disabled={state.g2Amount<=0}
            onClick={()=>history.change(hideG2)}>
            <EyeOff size={13}/> Hide membrane
          </button>
        </div>
        <p className="control-note">
          Opt-in only. All six recipes stay editable, and Surprise Me can
          breed the material into other active shader layers.
          Preview, PNG, GIF and MP4 use the same shader implementation.
        </p>
      </Section>
      <Section id="crossbreed-lab" history={history}>
        <p className="control-note">
          Breed the previous Shader Vault structures together. This engine
          reads the ACTUAL oracle, singularity, quasicrystal, velvet and
          crochet fields, then bends the living geometry according to the
          interaction. Not just two color overlays stacked like pancakes.
        </p>
        <Select label="Offspring species" value={state.breedMode}
          onChange={mode=>history.change(s=>activateBreed(s,mode))}>
          {breedModes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
        </Select>
        <p className="control-note">
          Required active parents:
          {" "}{breedRequiredParents(state.breedMode).map(k=>
            ({
              hexagramAmount:"Hexagram Terraces",
              polesAmount:"Complex Poles & Zeros",
              qdAmount:"Quasicrystal Dissolution",
              vldAmount:"Living Velvet",
              hcrAmount:"Hyperbolic Crochet"
            }[k]||k)
          ).join(" + ")}
          {breedActive(state)?" — offspring alive.":" — enable parents to breed."}
        </p>
        <Select label="Crossbreed recipe" value={breedPreset}
          onChange={setBreedPreset}>
          {breedPresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
        </Select>
        <div className="pane-actions">
          <button type="button" className="button secondary"
            onClick={()=>history.change(s=>applyBreedPreset(s,breedPreset))}>
            Activate crossbreed recipe
          </button>
          <button type="button" className="button secondary"
            onClick={()=>history.change(s=>activateBreed(s))}>
            Activate missing parents
          </button>
        </div>
        <Parameter label="Offspring visibility" name="breedAmount" history={history}/>
        {state.breedAmount>0&&<>
          <Parameter label="Parent coupling intensity" name="breedCoupling" history={history}/>
          <Parameter label="Crossbred geometry bending" name="breedWarp" history={history}/>
          <Parameter label="Chromatic filament density" name="breedFiligree" history={history}/>
          <Parameter label="Luminous inheritance" name="breedGlow" history={history}/>
          <Parameter label="Interbreeding motion" name="breedMotion" history={history}/>
          <Parameter label="Palette phase" name="breedHue" history={history}/>
          <Parameter label="Geometry restraint / tension" name="breedTension" history={history}/>
          <Parameter label="Spatial offspring variation" name="breedVariation" history={history}/>
          <Parameter label="Parent resonance" name="breedResonance" history={history}/>
        </>}
        <div className="pane-actions">
          <button type="button" className="button secondary"
            onClick={()=>history.change(s=>shuffleBreed(s))}>
            <Shuffle size={13}/> Shuffle crossbreed only
          </button>
          <button type="button" className="button secondary"
            disabled={state.breedAmount<=0}
            onClick={()=>history.change(hideBreed)}>
            <EyeOff size={13}/> Hide offspring only
          </button>
        </div>
        <p className="control-note">
          Existing parent modes remain independently editable. All-parent
          Chimera is especially GPU-heavy: crochet quality starts conservatively
          when it is first activated. Offspring is off for all legacy art.
        </p>
      </Section>
      <TextileMathControls history={history}/>
      <Section id="quasi-dissolution" history={history}>
        <p className="control-note">
          Make an organized quasicrystal from five, seven, or nine coupled
          interference waves, then fracture that SAME lattice into torn strips,
          phase splits, and digital tesserae. The source oscillator uses sevenfold.
          Dissolve = 0 is mathematical order; 100 breaks it to glorious hell.
        </p>
        <div className="preset-row">
          <Select label="Quasicrystal mutation" value={state.qdMode}
            onChange={mode=>history.change(s=>({...s,qdMode:mode,
              qdAmount:Math.max(s.qdAmount,60)}))}>
            {qdModes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
          </Select>
          <Select label="Quasiperiodic order" value={state.qdOrder}
            onChange={order=>history.change(s=>({...s,qdOrder:order,
              qdAmount:Math.max(s.qdAmount,60)}))}>
            {qdOrders.map(order=><option key={order} value={order}>{order}</option>)}
          </Select>
        </div>
        <div className="preset-row">
          <Select label="Start with a recipe" value={qdPreset} onChange={setQdPreset}>
            {qdPresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
          </Select>
          <button type="button" className="button secondary"
            onClick={()=>history.change(s=>applyQdPreset(s,qdPreset))}>
            Apply quasicrystal recipe
          </button>
        </div>
        <Parameter label="Quasicrystal presence" name="qdAmount" history={history}/>
        {state.qdAmount>0&&<>
          <Parameter label="Dissolution (0 order → 100 ruin)" name="qdDissolve" history={history}/>
          <Parameter label="Automatic order / ruin cycle" name="qdAuto" history={history}/>
          <Parameter label="Oscillation and mutation speed" name="qdRate" history={history}/>
          <Parameter label="Quasiperiodic lattice density" name="qdDensity" history={history}/>
          <Parameter label="Faultline / row tears" name="qdTear" history={history}/>
          <Parameter label="Quantized pixel rupture" name="qdPixel" history={history}/>
          <Parameter label="Displace real geometry" name="qdWarp" history={history}/>
          <Parameter label="Filigree stripe complexity" name="qdFiligree" history={history}/>
          <Parameter label="Palette phase" name="qdHue" history={history}/>
          <Parameter label="Spatial variation" name="qdVariation" history={history}/>
          <Parameter label="Luminous lattice seams" name="qdEdge" history={history}/>
        </>}
        <div className="pane-actions">
          <button type="button" className="button secondary"
            onClick={()=>history.change(s=>shuffleQd(s))}>
            <Shuffle size={13}/> Shuffle quasicrystal only
          </button>
          <button type="button" className="button secondary"
            disabled={state.qdAmount<=0}
            onClick={()=>history.change(hideQd)}>
            <EyeOff size={13}/> Hide crystal decay
          </button>
        </div>
        <p className="control-note">
          Auto at 0 holds your Dissolution slider; Auto at 100 oscillates
          between order and ruin. This shares the regular preview and
          PNG/GIF/MP4 renderer (no separate simulation or capture).
          Disabled presets leave older artwork unchanged.
        </p>
      </Section>
      <Section id="complex-poles" history={history}>
        <p className="control-note">
          Actual complex-plane distortion from (z⁵ − 1)/(z² + moving pole).
          Five zeros pull filament and engine coordinates into impossible
          lace; poles whirl geometry around moving singularities.
          Bounded mapping keeps the canvas stable.
        </p>
        <Select label="Complex behavior" value={state.polesMode}
          onChange={mode=>history.change(s=>({...s,polesMode:mode,
            polesAmount:Math.max(s.polesAmount,58)}))}>
          {polesModes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
        </Select>
        <div className="preset-row">
          <Select label="Complex-plane recipe" value={polesPreset}
            onChange={setPolesPreset}>
            {polesPresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
          </Select>
          <button type="button" className="button secondary"
            onClick={()=>history.change(s=>applyPolesPreset(s,polesPreset))}>
            Apply pole / zero recipe
          </button>
        </div>
        <Parameter label="Math distortion strength" name="polesAmount" history={history}/>
        {state.polesAmount>0&&<>
          <Parameter label="Complex-plane zoom" name="polesScale" history={history}/>
          <Parameter label="Geometry displacement" name="polesWarp" history={history}/>
          <Parameter label="Pole orbit radius" name="polesOrbit" history={history}/>
          <Parameter label="Singularity movement" name="polesMotion" history={history}/>
          <Parameter label="Singularity softening" name="polesSoftness" history={history}/>
          <Parameter label="Attract toward five zeros" name="polesZeroPull" history={history}/>
          <Parameter label="Phase filament density" name="polesFiligree" history={history}/>
          <Parameter label="Luminous phase accents" name="polesGlow" history={history}/>
          <Parameter label="Palette phase" name="polesHue" history={history}/>
          <Parameter label="Spatial variation" name="polesVariation" history={history}/>
          <div className="pane-actions">
            <button type="button" className="button secondary"
              onClick={()=>history.change(s=>shufflePoles(s))}>
              <Shuffle size={13}/> Shuffle poles & zeros only
            </button>
            <button type="button" className="button secondary"
              onClick={()=>history.change(hidePoles)}>
              <EyeOff size={13}/> Hide complex field
            </button>
          </div>
        </>}
      </Section>
      <Section id="hexagram" history={history}>
        <p className="control-note">
          Six coupled binary noise fields make 64 shifting terrace identities.
          Borders glow, regions borrow your palette, and the field can bend
          the geometry underneath existing textile and optical effects.
        </p>
        <Select label="Terrace recipe" value={hexagramPreset}
          onChange={(v)=>{
            setHexagramPreset(v);
            history.change(s=>applyHexagramPreset(s,v));
          }}>
          {hexagramPresets.map(p=><option key={p.name}>{p.name}</option>)}
        </Select>
        <Parameter label="Terrace strength" name="hexagramAmount" history={history}/>
        {state.hexagramAmount>0&&<>
          <Parameter label="Region scale" name="hexagramScale" history={history}/>
          <Parameter label="Geometry bend" name="hexagramWarp" history={history}/>
          <Parameter label="Territory motion" name="hexagramMotion" history={history}/>
          <Parameter label="Raised enamel / relief" name="hexagramRelief" history={history}/>
          <Parameter label="Changing-line width" name="hexagramBorder" history={history}/>
          <Parameter label="Palette offset" name="hexagramHue" history={history}/>
          <Parameter label="Bit-to-bit coupling" name="hexagramCoupling" history={history}/>
          <Parameter label="Pattern variation" name="hexagramVariation" history={history}/>
          <Parameter label="Region threshold" name="hexagramThreshold" history={history}/>
          <Reseed label="Shuffle terraces only" onClick={()=>history.change(
            s=>remixHexagram(s,Math.random))}/>
          <button className="subtle-button full" type="button"
            onClick={()=>history.change(disableHexagram)}>
            Hide terraces (keep artwork)
          </button>
        </>}
      </Section>
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
export function EffectsInspector({ history, onTool, tool, scope = "effects" }) {
  const s = history.state;
  const [photonPreset,setPhotonPreset]=React.useState(photonPresets[0].name);
  const [alchemyPreset,setAlchemyPreset]=React.useState(alchemyPresets[0].name);
  const [injuryPreset,setInjuryPreset]=React.useState(injuryPresets[0].name);
  const [spxPreset,setSpxPreset]=React.useState(spxPresets[0].name);
  const [kdPreset,setKdPreset]=React.useState(kdPresets[0].name);
  const [vcPreset,setVcPreset]=React.useState(vcPresets[0].name);
  const [schlierenPreset,setSchlierenPreset]=React.useState(schlierenPresets[0].name);
  const [backdropPreset,setBackdropPreset]=React.useState(backdropPresets[0].name);
  const [filamentPreset,setFilamentPreset]=React.useState(filamentPresets[0].name);
  const [hybridPreset,setHybridPreset]=React.useState(filamentHybridPresets[0].name);
  const [materialPreset,setMaterialPreset]=React.useState(filamentMaterialPresets[0].name);
  const [opticsPreset,setOpticsPreset]=React.useState(structuralOpticsPresets[0].name);
  const [adornmentPreset,setAdornmentPreset]=React.useState(filamentAdornmentPresets[0].name);
  const [morphPreset,setMorphPreset]=React.useState(filamentMorphPresets[0].name);
  const [contagionPreset,setContagionPreset]=React.useState(filamentContagionPresets[0].name);
  const [neuralPreset,setNeuralPreset]=React.useState(filamentNeuralPresets[0].name);
  const [plasticPreset,setPlasticPreset]=React.useState(filamentPlasticPresets[0].name);
  const [scarPreset,setScarPreset]=React.useState(filamentScarPresets[0].name);
  const [regenPreset,setRegenPreset]=React.useState(filamentRegenPresets[0].name);
  const [stitchPreset,setStitchPreset]=React.useState(filamentStitchPresets[0].name);
  const [feralPreset,setFeralPreset]=React.useState(feralJacquardPresets[0].name);
  const [quasiPreset,setQuasiPreset]=React.useState(quasicrystalBrocadePresets[0].name);
  const [chladniPreset,setChladniPreset]=React.useState(chladniNeedlePresets[0].name);
  const [retroPreset,setRetroPreset]=React.useState(retrocausalEmbroideryPresets[0].name);
  const [semanticPreset,setSemanticPreset]=React.useState(semanticGravityPresets[0].name);
  const [sculptPreset,setSculptPreset]=React.useState(filamentSculptPresets[0].name);
  const [underlayPreset,setUnderlayPreset]=React.useState(underlayPresets[0].name);
  const [atmoPreset,setAtmoPreset]=React.useState(atmospherePresets[0].name);
  const [hybridAtmoPreset,setHybridAtmoPreset]=React.useState(hybridAtmospherePresets[0].name);
  const [colonyLifePreset,setColonyLifePreset]=React.useState(colonyLifePresets[0].name);
  const [colonyAnatomyPreset,setColonyAnatomyPreset]=React.useState(colonyAnatomyPresets[0].name);
  const [colonyCortexPreset,setColonyCortexPreset]=React.useState(colonyCortexPresets[0].name);
  const [sporePreset,setSporePreset]=React.useState(sporePresets[0].name);
  const [substratePreset,setSubstratePreset]=React.useState(substratePresets[0].name);
  const [symbiosisPreset,setSymbiosisPreset]=React.useState(symbiosisPresets[0].name);
  const [genePreset,setGenePreset]=React.useState(genePresets[0].name);
  const [selectionPreset,setSelectionPreset]=React.useState(selectionPresets[0].name);
  const [microPreset,setMicroPreset]=React.useState(microPresets[0].name);
  const [psPreset,setPsPreset]=React.useState(psPresets[0].name);
  const [substancePreset,setSubstancePreset]=React.useState(substancePresets[0].name);
  const [bioRotPreset,setBioRotPreset]=React.useState(bioRotPresets[0].name);
  const [apocalypsePreset,setApocalypsePreset]=React.useState(apocalypsePresets[0].name);
  const [fossilPreset,setFossilPreset]=React.useState(fossilPresets[0].name);
  const [resurrectionMode,setResurrectionMode]=React.useState(resurrectionModes[0]);
  const [echoMode,setEchoMode]=React.useState(echoModes[0]);
  const [echoIntensity,setEchoIntensity]=React.useState(65);
  const [speciesMode,setSpeciesMode]=React.useState(speciationModes[0]);
  const [speciesStrength,setSpeciesStrength]=React.useState(75);
  const [coevoMode,setCoevoMode]=React.useState(coevolutionModes[2]);
  const [coevoIntensity,setCoevoIntensity]=React.useState(75);
  const [chaosLevel,setChaosLevel]=React.useState("Wild");
  const [preserveColors,setPreserveColors]=React.useState(true);
  const [preserveText,setPreserveText]=React.useState(true);
  const [preserveCore,setPreserveCore]=React.useState(false);
  const [allowDual,setAllowDual]=React.useState(true);
  const [allowHeavy,setAllowHeavy]=React.useState(false);
  const [categoryLocks,setCategoryLocks]=React.useState(readCategoryLocks);
  const protectCategories=(original,next)=>protectCategorySettings(original,next,categoryLocks);
  const resetCategory=(original,name)=>{
    const next={...original};
    for(const key of Object.keys(initial))if(categoryOwns(name,key))next[key]=initial[key];
    return protectCategories(original,next);
  };
  const spinEcosystem=()=>history.change(x=>shuffleEcosystem(x,Math.random,{
    allowDual,intensity:chaosLevels.indexOf(chaosLevel)/3,
  }));
  const spinFullWeird=()=>history.change(x=>protectCategories(x,fullWeirdShuffle(x,Math.random,{
    level:chaosLevel,preserveColors,preserveText,preserveCore,
    allowDual,allowHeavy,
    baseRandomizer:(original,rng)=>randomize(original,{},false,rng)
  })));
  // Category spins use the same activation-aware recipes as individual panels.
  const [categoryStrength,setCategoryStrength]=React.useState("Wild");
  const spinLegacy=(keys)=>(x,r)=>{
    const next={...x};
    for(const key of keys){
      const range=numericRanges[key];
      if(!range)continue;
      const [lo,hi]=range;
      const band=categoryStrength==="Subtle"?[.08,.30]:categoryStrength==="Wild"?[.22,.80]:[.55,.98];
      next[key]=lo+(hi-lo)*(band[0]+(band[1]-band[0])*r());
    }
    return next;
  };
  const categorySpins = [
    ["Living currents",shuffleVc,[shuffleAlchemy]],
    ["Mathematical membranes",shuffleG2,[remixHexagram,shufflePoles,shuffleQd]],
    ["Hybrid mathematics",shuffleBreed,[]],
    ["Prismatic surfaces",shufflePs,[remixSubstance]],
    ["Screen interference",shuffleSpx,[shuffleKd]],
    ["Animation & motion",(x,r)=>({...spinLegacy(["motionAmount","motionRate","lightMotion","speed","colorSpeed"])(x,r),motionMode:motionModes[Math.floor(r()*motionModes.length)],freezeGeometry:false,freezeColor:false}),[]],
    ["Digital corruption",spinLegacy(["split","glitch","block","pixel"]),[]],
    ["Analog & CRT",spinLegacy(["scan","grain","vignette","phosphor","broadcast"]),[]],
    ["Temporal feedback",spinLegacy(["afterimage","datamosh","memoryDrift","memoryDecay"]),[]],
    ["MySpace nostalgia",spinLegacy(["windowCascade","glitter"]),[]],
    ["Spectral foil",spinLegacy(["filmAmount","filmThickness","opalAmount","prismAmount","foilRelief","foilMotion"]),[]],
    ["Print textures",spinLegacy(["dither","riso","misregister"]),[]],
    ["View motion & depth",(x,r)=>({...spinLegacy(["wiggleAmount","wiggleDepth","wiggleSpeed","wiggleLayers"])(x,r),wiggleMode:wiggleModes.filter(m=>m!=="Off")[Math.floor(r()*wiggleModes.filter(m=>m!=="Off").length)]}),[
      (x,r)=>({...spinLegacy(["stereoAmount","stereoDepth","stereoParallax","stereoMorph","stereoGlow","stereoWiggle"])(x,r),stereoShape:["Gyroid Cathedral","Metaball Choir","Opal Knot","Crystal Lattice","Ribbon Wormhole"][Math.floor(r()*5)],stereoQuality:Math.min(40,x.stereoQuality||40)})]],
    ["Microscopic shapes", remixMicro, [shuffleQd]],
    ["Glass & refraction", shuffleMathematicalGlass, [
      (x,r)=>shuffleMathematicalGlass(x,r,"interior"),
      (x,r)=>shuffleMathematicalGlass(x,r,"motion"),
      (x,r)=>shuffleMathematicalGlass(x,r,"material"),
      (x,r)=>shuffleMathematicalGlass(x,r,"transport"),
      (x,r)=>shuffleMathematicalGlass(x,r,"coupling")]],
    ["Materials & textures", remixSubstance, [shuffleVelvet,shuffleCrochet]],
    ["Light & optical ornaments", remixPhotonZoo, [shuffleAlchemy]],
    ["Chromatic alchemy", shuffleAlchemy, [shuffleSpx]],
    ["Print & signal damage", shuffleInjury, [shufflePs,shuffleKd]],
    ["Biological growth", remixBioRot, [remixMicro]],
    ["Backgrounds & atmosphere", remixBackdrop, [remixUnderlay]],
  ];
  const spinCategory=(original,primary,extras,rng=Math.random)=>{
    let next=primary(original,rng);
    const pool=[...extras];
    const count=categoryStrength==="Subtle"?0:categoryStrength==="Wild"?1:pool.length;
    for(let i=0;i<count&&pool.length;i++){
      const index=Math.min(pool.length-1,Math.floor(rng()*pool.length));
      next=pool.splice(index,1)[0](next,rng);
    }
    // Keep artist-authored content and core composition intact.
    return protectCategories(original,{...next,ratio:original.ratio,marks:original.marks,
      palette:original.palette,colors:original.colors});
  };
  const body = {
    "chaos-lab": <>
      <div className="pane-actions">
        <Select label="Category shuffle strength" value={categoryStrength} onChange={setCategoryStrength}>
          {["Subtle","Wild","Unhinged"].map(level=><option key={level} value={level}>{level}</option>)}
        </Select>
        {categorySpins.map(([name,spin,extras])=><div key={name} className="pane-actions">
          <button type="button" className="button secondary" disabled={!!categoryLocks[name]}
            onClick={()=>history.change(x=>spinCategory(x,spin,extras))}>
            <Shuffle size={13}/> {name}
          </button>
          <button type="button" className="button secondary" aria-pressed={!!categoryLocks[name]}
            onClick={()=>{const next={...categoryLocks,[name]:!categoryLocks[name]};writeCategoryLocks(next);setCategoryLocks(next);}}>
            {categoryLocks[name]?"Unlock":"Lock"}
          </button>
          <button type="button" className="button secondary" disabled={!!categoryLocks[name]}
            onClick={()=>history.change(x=>resetCategory(x,name))}>Reset</button>
        </div>)}
        <p className="control-note">Locks protect shared category settings during category spins and Full weird shuffle. Reset restores unlocked category defaults. Locks also protect main Surprise Me and persist on this device.</p>
      </div>
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
      <details className="effect-explanation"><summary>How it works</summary><p className="control-note">
        Full weird shuffle remixes old and new effects with a mobile GPU budget.
        Uncheck Preserve colors to randomize the palette too. Your text stays
        intact unless you explicitly uncheck its protection. Manual controls
        and all planted seeds remain editable afterward.
      </p></details>
    </>,
    "living-food-web": <>
      <p className="control-note">
        THE LIVING FOOD WEB — fluorescent feeding highways between
        neighbors. Colonies hold a real, saved nutrient reserve.
        Feeding rounds trade or steal that reserve and change individual
        growth and inherited genes. No invisible deaths or playback edits.
      </p>
      <Select label="Ecological relationship" value={s.foodWebMode}
        onChange={mode=>history.change(x=>({...x,foodWebMode:mode}))}>
        {foodWebModes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
      </Select>
      <Parameter label="Luminous web visibility" name="foodWebAmount" history={history}/>
      <Parameter label="How far food pathways connect" name="foodWebReach" history={history}/>
      <Parameter label="Nutrient exchange intensity" name="foodWebPressure" history={history}/>
      <Parameter label="Traveling energy pulse speed" name="foodWebPulse" history={history}/>
      <Parameter label="Mycelial thread thickness" name="foodWebWidth" history={history}/>
      <Parameter label="Bioluminescent brightness" name="foodWebGlow" history={history}/>
      <Parameter label="Feeding pathway palette offset" name="foodWebHue" history={history}/>
      <p className="control-note">
        Connected pathways: {foodWebLinks(s).length}/{MAX_FOOD_WEB_LINKS}
        {" · "}Completed feeding rounds: {s.foodWebRound||0}/4095.
        Connections follow the real colony positions; drag the organisms
        in Touch to rewire the network.
      </p>
      <div className="pane-actions">
        <button type="button" className="button secondary"
          disabled={!s.habitatStamps?.length}
          onClick={()=>history.change(prepareFoodWeb)}>
          <Flower2 size={13}/> Awaken food web
        </button>
        <button type="button" className="button secondary"
          disabled={(s.habitatStamps||[]).length<2}
          onClick={()=>history.change(x=>prepareFoodWeb(stageFoodWeb(x)))}>
          <Orbit size={13}/> Stage nearest connection
        </button>
        <button type="button" className="button secondary"
          disabled={!foodWebActive(s)||s.foodWebRound>=4095||
            s.foodWebPressure<=0}
          onClick={()=>history.change(feedFoodWeb)}>
          <Dna size={13}/> Feed once
        </button>
        <button type="button" className="button secondary"
          disabled={!foodWebActive(s)||s.foodWebRound>=4095||
            s.foodWebPressure<=0}
          onClick={()=>history.change(x=>feedFoodWeb(x,3))}>
          <Orbit size={13}/> Feed three rounds
        </button>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>prepareFoodWeb(shuffleFoodWeb(x)))}>
          <Dices size={13}/> Shuffle the food web
        </button>
        <button type="button" className="button secondary"
          disabled={s.foodWebAmount<=0}
          onClick={()=>history.change(hideFoodWeb)}>
          <EyeOff size={13}/> Hide web / pause feeding
        </button>
      </div>
      <details className="filament-crossbreeder">
        <summary>Connection map · {foodWebLinks(s).length} nutrient highways</summary>
        <ol>
          {foodWebLinks(s).map(link=><li key={link.from+"-"+link.to}>
            {link.from} ↔ {link.to}
            {" · "}contact {Math.round(link.strength*100)}%
          </li>)}
        </ol>
        {!foodWebLinks(s).length&&<p className="control-note">
          No organisms close enough. Drag two near each other in Touch
          or stage a nearest connection.
        </p>}
      </details>
      <details className="filament-crossbreeder">
        <summary>Stored nutrient reserves · {foodWebLedger(s).length} organisms</summary>
        <ol>
          {foodWebLedger(s).map(m=><li key={m.id}>
            {m.parent===0?"A":"B"} · {m.id}
            {" · "}{m.energy}% energy
          </li>)}
        </ol>
      </details>
      <details className="effect-explanation"><summary>How it works</summary><p className="control-note">
        Mutualists even out resources; parasites siphon them; mycelial
        relays distribute reserves rapidly; and trophic cascades reward
        stronger feeders. Total stored energy is conserved per feeding
        round, except for natural saturation at the 0–100 boundaries.
        The network animates in the existing GIF and MP4 renderer.
        Every feeding batch is one Undo; no extra canvas or render pass.
      </p></details>
    </>,
    "ecological-succession": <>
      <p className="control-note">
        ECOLOGICAL SUCCESSION — organisms rewrite their own rock.
        Local chemical memories change actual nutrients, fitness, and spore
        landing. Geological time advances only when you click.
      </p>
      <Select label="Chemistry of the next deposit" value={s.successionMode}
        onChange={mode=>history.change(x=>({...x,successionMode:mode}))}>
        {successionModes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
      </Select>
      <Parameter label="Legacy visibility / strength" name="successionAmount" history={history}/>
      <Parameter label="Chemical depth" name="successionDepth" history={history}/>
      <Parameter label="Soil spread" name="successionSpread" history={history}/>
      <Parameter label="Subsurface motion" name="successionMotion" history={history}/>
      <Parameter label="Sediment glow" name="successionGlow" history={history}/>
      <Parameter label="Sediment pigment" name="successionHue" history={history}/>
      <Parameter label="Percent of live seeds depositing soil" name="successionBurial" history={history}/>
      <p className="control-note">
        Century {s.successionEpoch||0}/4095
        {" · "}{(s.successionRecords||[]).length}/{MAX_SUCCESSION} soil layers.
        Each layer retains its original chemistry when you change modes.
      </p>
      <div className="pane-actions">
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>ensureValidEcosystemState({
            ...prepareSuccession(x),atmoMaskMode:"Painted colonies",
            atmoAmount:Math.max(73,x.atmoAmount||0),
          }))}>
          <Flower2 size={13}/> Awaken living rock
        </button>
        <button type="button" className="button secondary"
          disabled={!s.habitatStamps?.length||s.successionEpoch>=4095||
            s.successionBurial<=0}
          onClick={()=>history.change(advanceSuccession)}>
          <Layers size={13}/> Deposit one century
        </button>
        <button type="button" className="button secondary"
          disabled={!s.habitatStamps?.length||s.successionEpoch>=4095||
            s.successionBurial<=0}
          onClick={()=>history.change(x=>advanceSuccessionAges(x,3))}>
          <Orbit size={13}/> Advance three centuries
        </button>
        <button type="button" className="button secondary"
          disabled={!s.habitatStamps?.length||s.habitatStamps.length>=16||
            s.sporeGeneration>=4095||s.sporeFertility<=0||
            s.successionEpoch>=4095||s.successionBurial<=0}
          onClick={()=>history.change(x=>evolveSporeGeneration(
            advanceSuccession(x)))}>
          <Dna size={13}/> Century + descendants
        </button>
        <button type="button" className="button secondary"
          onClick={()=>history.change(shuffleSuccession)}>
          <Dices size={13}/> Shuffle soil chemistry
        </button>
        <button type="button" className="button secondary"
          disabled={s.successionAmount<=0}
          onClick={()=>history.change(hideSuccession)}>
          <EyeOff size={13}/> Hide memory (keep archive)
        </button>
        <button type="button" className="button secondary"
          disabled={!s.successionRecords?.length}
          onClick={()=>{if(window.confirm(
            "Erase all ecological soil strata? Living colonies, fossils, words and colors stay. You can Undo."
          ))history.change(clearSuccession);}}>
          <Trash2 size={13}/> Clear ecological history (confirm)
        </button>
      </div>
      <details className="filament-crossbreeder">
        <summary>Soil chemistry beneath living colonies</summary>
        <ol>
          {successionCensus(s,substrateResourceAt).map(sample=><li key={sample.id}>
            {sample.parent===0?"A":"B"} · {sample.id}
            {" · "}nutrients {Math.round(sample.before*100)}%
            {" → "}{Math.round(sample.after*100)}%
          </li>)}
        </ol>
      </details>
      <details className="filament-crossbreeder">
        <summary>Geological sediment · {(s.successionRecords||[]).length} deposits</summary>
        <ol>
          {(s.successionRecords||[]).map(record=><li key={record.id}>
            Century {record.epoch} · {record.parent===0?"A":"B"}
            {" · "}{record.mode} · {record.origin}
          </li>)}
        </ol>
      </details>
      <details className="effect-explanation"><summary>How it works</summary><p className="control-note">
        Living organisms are never deleted by deposition. Oldest memories
        cycle out only on an explicit advance; fossils remain independent.
        Hiding chemistry doesn't erase it. Descendant spores and natural
        selection use the same nutrient changes visible on the substrate.
      </p></details>
    </>,
    "fossil-record": <>
      <details className="effect-explanation"><summary>How it works</summary><p className="control-note">
        FOSSIL RECORD — your past organisms leave actual mineral impressions.
        Their archived shapes, species, DNA and geological ages determine
        where future nutrients accumulate or disappear. They glow like
        ancient cross-sections, and spores can settle differently around
        their remains. Nothing gets deleted when you archive.
      </p></details>
      <Select label="What the dead leave behind" value={s.fossilMode}
        onChange={mode=>history.change(x=>mode==="Dormant"
          ?hideFossils({...x,fossilMode:mode})
          :{...x,fossilMode:mode,
             fossilAmount:Math.max(72,x.fossilAmount),
             substrateMode:x.substrateMode==="Bare canvas"
               ?"Nutrient rivers":x.substrateMode,
             substrateAmount:Math.max(72,x.substrateAmount)})}>
        {fossilModes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
      </Select>
      <Parameter label="Fossil visibility" name="fossilAmount" history={history}/>
      <Parameter label="Nutrient residue depth" name="fossilDepth" history={history}/>
      <Parameter label="Stratigraphic shimmer" name="fossilMotion" history={history}/>
      <Parameter label="Ghost phosphor glow" name="fossilGlow" history={history}/>
      <Parameter label="Historical pigment offset" name="fossilHue" history={history}/>
      <Parameter label="Percent of living seeds to archive" name="fossilBurial" history={history}/>
      <Select label="Ancient-world specimen" value={fossilPreset}
        onChange={setFossilPreset}>
        {fossilPresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
      </Select>
      <div className="pane-actions">
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>archiveFossils(
            applyFossilPreset({
              ...x,substrateMode:x.substrateMode==="Bare canvas"
                ?"Nutrient rivers":x.substrateMode,
              substrateAmount:Math.max(73,x.substrateAmount),
            },fossilPreset)))}>
          <Flower2 size={13}/> Summon fossils
        </button>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>shuffleFossils({...x,
            substrateMode:x.substrateMode==="Bare canvas"
              ?"Nutrient rivers":x.substrateMode,
            substrateAmount:Math.max(73,x.substrateAmount)}))}>
          <Dices size={13}/> Shuffle ancient chemistry
        </button>
        <button type="button" className="button secondary"
          disabled={!s.habitatStamps?.length ||
            s.fossilRecords.length>=MAX_FOSSILS ||
            s.fossilBurial<=0}
          onClick={()=>history.change(archiveFossils)}>
          <Gem size={13}/> Archive this generation
        </button>
        <button type="button" className="button secondary"
          disabled={(!s.habitatStamps?.length&&!s.fossilRecords.length)||
            s.apocalypseEpoch>=4095}
          onClick={()=>history.change(archiveAndAdvance)}>
          <Orbit size={13}/> Bury and advance epoch
        </button>
        <button type="button" className="button secondary"
          disabled={s.fossilAmount<=0}
          onClick={()=>history.change(hideFossils)}>
          Hide fossils (keep record)
        </button>
        <button type="button" className="button secondary"
          disabled={!s.fossilRecords.length}
          onClick={()=>{if(window.confirm(
            "Permanently clear the saved fossil archive? Living colonies and genes remain unchanged. You can Undo."
          ))history.change(clearFossilArchive);}}>
          <Trash2 size={13}/> Clear fossil archive (confirm)
        </button>
      </div>
      <details data-effect-detail="fossil-resurrection" className="filament-crossbreeder">
        <summary>Resurrection Chamber · raise ancient bloodlines</summary>
        <p className="control-note">
          Fossil DNA can become real editable colonies again, even after a
          population goes extinct. Each ancestor may be revived once per
          geological epoch. Their original historical records stay buried.
        </p>
        <Select label="Revival method" value={resurrectionMode}
          onChange={setResurrectionMode}>
          {resurrectionModes.map(mode=>
            <option key={mode} value={mode}>{mode}</option>)}
        </Select>
        <div className="pane-actions">
          <button type="button" className="button secondary"
            disabled={!s.fossilRecords.some(record=>canResurrectRecord(s,record))}
            onClick={()=>history.change(x=>resurrectOldest(x,resurrectionMode))}>
            <Dna size={13}/> Revive oldest ancestor
          </button>
          <button type="button" className="button secondary"
            disabled={!s.fossilRecords.some(record=>canResurrectRecord(s,record))}
            onClick={()=>history.change(x=>resurrectWholeArchive(x,resurrectionMode))}>
            <Flower2 size={13}/> Raise the whole graveyard
          </button>
        </div>
        <details className="effect-explanation"><summary>How it works</summary><p className="control-note">
          Faithful echo preserves ancestral DNA. Ancestral crossover grafts
          it with a living relative. Adaptive comeback seeks a viable new
          mineral niche. Kingdom inversion swaps A/B and flips the allele.
          All four honor the sixteen-colony limit, your colors and your
          artwork. One Undo restores the prior population.
        </p></details>
      </details>
      <details data-effect-detail="fossil-echoes" className="filament-crossbreeder">
        <summary>Ancestral Echoes · evolve civilizations</summary>
        <p className="control-note">
          Fossil genes can influence new generations of real offspring.
          Revive ancestors first, then evolve them. This uses the existing
          spore landing engine and never changes the fossil archive.
        </p>
        <Select label="Evolutionary pressure" value={echoMode}
          onChange={setEchoMode}>
          {echoModes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
        </Select>
        <label className="control-note" htmlFor="ancestral-echo-intensity">
          Ancestral influence · {echoIntensity}%
        </label>
        <input id="ancestral-echo-intensity" type="range" min="0" max="100"
          value={echoIntensity} onChange={event=>
            setEchoIntensity(Number(event.target.value))}/>
        <div className="pane-actions">
          <button type="button" className="button secondary"
            disabled={!s.habitatStamps?.length||s.habitatStamps.length>=16||
              s.sporeGeneration>=4095||s.sporeFertility<=0}
            onClick={()=>history.change(x=>evolveAncestralGeneration(
              x,echoMode,echoIntensity))}>
            <Dna size={13}/> Evolve ancestral generation
          </button>
          <button type="button" className="button secondary"
            disabled={!s.habitatStamps?.length||s.habitatStamps.length>=16||
              s.sporeGeneration>=4095||s.sporeFertility<=0}
            onClick={()=>history.change(x=>evolveAncestralEpochs(
              x,3,echoMode,echoIntensity))}>
            <Orbit size={13}/> Evolve three generations
          </button>
        </div>
        <details className="effect-explanation"><summary>How it works</summary><p className="control-note">
          Atavism recalls old genes; Mutation bloom makes them unstable;
          Adaptive memory blends ancestral and mineral affinities;
          Rebel descendants invert ancestral traits. The three-generation
          button is one Undo. Existing organisms and saved history stay put.
          The living-colony limit of sixteen still applies.
        </p></details>
      </details>
      <details className="filament-crossbreeder">
        <summary>Geological archive · {s.fossilRecords.length}/{MAX_FOSSILS}</summary>
        <p className="control-note">
          Each impression stores the original individual, its DNA,
          which population it belonged to and when it was buried.
        </p>
        <ol>
          {s.fossilRecords.map(record=>
            <li key={record.id}>
              Epoch {record.epoch} · {record.parent===0?"A":"B"}
              {" · "}DNA {record.gene}
              {" · "}Ancestor {record.origin}
              {" "}
              <button type="button" className="subtle-button"
                disabled={!canResurrectRecord(s,record)}
                onClick={()=>history.change(x=>resurrectFossil(
                  x,record.id,resurrectionMode))}>
                <Dna size={12}/> Revive
              </button>
            </li>)}
        </ol>
      </details>
      <details className="effect-explanation"><summary>How it works</summary><p className="control-note">
        Fossils: {s.fossilRecords.length}/{MAX_FOSSILS}
        {" · "}Current geological epoch: {s.apocalypseEpoch}.
        Ancestral compost enriches, toxic relics deplete, opal relics
        express ancestral genes, ghost roots favor different populations,
        and mirrored strata reverse local conditions. Burial keeps all
        living seeds; only the explicit clear action erases history.
      </p></details>
    </>,
    "speciation-lab": <>
      <p className="control-note">
        SPECIATION LAB — genetically divergent bloodlines grow into rival
        ecological families. Existing organisms, color palettes and fossils
        remain intact. No extra shader or invisible extinctions.
      </p>
      <Select label="Divergence pattern" value={speciesMode} onChange={setSpeciesMode}>
        {speciationModes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
      </Select>
      <label className="control-note" htmlFor="species-strength">
        Evolutionary pressure · {speciesStrength}%
      </label>
      <input id="species-strength" type="range" min="0" max="100"
        value={speciesStrength}
        onChange={event=>setSpeciesStrength(Number(event.target.value))}/>
      <div className="pane-actions">
        <button type="button" className="button secondary"
          disabled={!s.habitatStamps?.length}
          onClick={()=>history.change(x=>branchSpecies(x,speciesMode,speciesStrength))}>
          <Dna size={13}/> Branch rival families
        </button>
        <button type="button" className="button secondary"
          disabled={(s.habitatStamps||[]).length<2}
          onClick={()=>{if(window.confirm(
            "Run one territory contest? Overlapping rival colonies grow or shrink. No deaths; you can Undo."
          ))history.change(x=>contestTerritory(x,speciesStrength));}}>
          <Orbit size={13}/> Contest territory (confirm)
        </button>
      </div>
      <details className="filament-crossbreeder">
        <summary>Lineage census · {lineageCensus(s).length} families</summary>
        <ol>
          {lineageCensus(s).map(f=><li key={f.clade}>
            {f.clade} · {f.parent===0?"A":"B"}
            {" · "}{f.count} organism{f.count===1?"":"s"}
            {" · "}fitness {Math.round(f.fitness*100)}%
            {" · "}territory {(f.area*100).toFixed(1)}
          </li>)}
        </ol>
      </details>
      <details className="effect-explanation"><summary>How it works</summary><p className="control-note">
        Branching turns existing painted seeds into founding clades and
        adds up to two new species. Their DNA changes visible boundaries
        and pigmentation, and normal spore offspring inherit their clade.
        To fight, move rivals into contact with Touch first. Contest is a
        single undoable step, never automatic. Sixteen live seeds maximum.
      </p></details>
    </>,
    "coevolution-lab": <>
      <p className="control-note">
        COEVOLUTION LAB — let neighboring species change each other's
        actual inherited genome and occupied territory. Predator/prey
        pressure, mimicry, defensive arms races or cooperation all use
        your existing moving painted organisms and palette.
      </p>
      <Select label="Relationship between bloodlines" value={coevoMode}
        onChange={setCoevoMode}>
        {coevolutionModes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
      </Select>
      <label className="control-note" htmlFor="coevo-intensity">
        Interaction pressure · {coevoIntensity}%
      </label>
      <input id="coevo-intensity" type="range" min="0" max="100"
        value={coevoIntensity}
        onChange={e=>setCoevoIntensity(Number(e.target.value))}/>
      <p className="control-note">
        Committed encounters: {s.coevoRound||0}/4095
        {" · "}Nearby rival pairs: {encounterNetwork(s).length}.
        No pair nearby? Stage an encounter, or move organisms together in Touch.
      </p>
      <div className="pane-actions">
        <button type="button" className="button secondary"
          disabled={(s.habitatStamps||[]).length<2}
          onClick={()=>history.change(stageEncounter)}>
          <Move size={13}/> Stage closest rivals
        </button>
        <button type="button" className="button secondary"
          disabled={!encounterNetwork(s).length||coevoIntensity<=0||
            (s.coevoRound||0)>=4095}
          onClick={()=>history.change(x=>evolveCoevolution(
            x,coevoMode,coevoIntensity))}>
          <Dna size={13}/> Evolve one encounter
        </button>
        <button type="button" className="button secondary"
          disabled={!encounterNetwork(s).length||coevoIntensity<=0||
            (s.coevoRound||0)>=4095}
          onClick={()=>history.change(x=>evolveCoevolution(
            x,coevoMode,coevoIntensity,3))}>
          <Orbit size={13}/> Evolve three encounters
        </button>
        <button type="button" className="button secondary"
          disabled={(s.habitatStamps||[]).length<2||
            (s.coevoRound||0)>=4095}
          onClick={()=>history.change(x=>evolveCoevolution(
            stageEncounter(x),
            coevolutionModes[Math.floor(Math.random()*coevolutionModes.length)],
            45+Math.random()*55))}>
          <Dices size={13}/> Surprise me with coevolution
        </button>
      </div>
      <details className="filament-crossbreeder">
        <summary>Encounter network · {encounterNetwork(s).length} relationships</summary>
        {encounterNetwork(s).length===0
          ?<p className="control-note">
            No genetic contact yet. Stage a meeting or use Touch to
            move rival families together.
          </p>
          :<ol>
            {encounterNetwork(s).slice(0,10).map(pair=><li
              key={pair.i+"-"+pair.j}>
              {pair.first} ↔ {pair.second}
              {" · "}contact {Math.round(pair.influence*100)}%
            </li>)}
          </ol>}
      </details>
      <details className="effect-explanation"><summary>How it works</summary><p className="control-note">
        Each button commits an explicit genetic encounter: DNA changes real
        outline geometry and pigmentation, while territory size changes
        the visible colony. Mimics copy fitter models; prey adapt defensive
        alleles; arms races diverge; mutualists converge. No hidden deaths,
        no changes during playback, and no new shaders. Three rounds = one
        Undo. Fossils, palettes and text remain untouched.
      </p></details>
    </>,
    "apocalypse-clock": <>
      <details className="effect-explanation"><summary>How it works</summary><p className="control-note">
        APOCALYPSE CLOCK — geological epochs reshape the living nutrient
        map. Crystal freezes, acid rains, solar flares, tectonic fissures
        and glowing radiation gardens can change which DNA thrives.
        Time-based shimmer animates continuously; resource chemistry only
        changes when you advance the saved epoch.
      </p></details>
      <Select label="Geological catastrophe" value={s.apocalypseMode}
        onChange={mode=>history.change(x=>mode==="Dormant"
          ?haltApocalypse({...x,apocalypseMode:mode})
          :{...x,apocalypseMode:mode,
             apocalypseAmount:Math.max(72,x.apocalypseAmount),
             substrateMode:x.substrateMode==="Bare canvas"
               ?"Nutrient rivers":x.substrateMode,
             substrateAmount:Math.max(72,x.substrateAmount)})}>
        {apocalypseModes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
      </Select>
      <Parameter label="Cataclysm visibility" name="apocalypseAmount" history={history}/>
      <Parameter label="Disaster texture density" name="apocalypseScale" history={history}/>
      <Parameter label="Heat / rain / mineral shimmer" name="apocalypseMotion" history={history}/>
      <Parameter label="Ecological shock intensity" name="apocalypsePressure" history={history}/>
      <Parameter label="Ionized mineral radiance" name="apocalypseGlow" history={history}/>
      <Parameter label="Cataclysm pigment offset" name="apocalypseHue" history={history}/>
      <Select label="Catastrophe specimen" value={apocalypsePreset}
        onChange={setApocalypsePreset}>
        {apocalypsePresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
      </Select>
      <div className="pane-actions">
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>applyApocalypsePreset({
            ...x,substrateMode:x.substrateMode==="Bare canvas"
              ?"Nutrient rivers":x.substrateMode,
            substrateAmount:Math.max(75,x.substrateAmount),
          },apocalypsePreset))}>
          <Flower2 size={13}/> Summon catastrophe
        </button>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>shuffleApocalypse({
            ...x,substrateMode:x.substrateMode==="Bare canvas"
              ?"Nutrient rivers":x.substrateMode,
            substrateAmount:Math.max(75,x.substrateAmount),
          }))}>
          <Dices size={13}/> Shuffle disasters
        </button>
        <button type="button" className="button secondary"
          disabled={!apocalypseActive(s)||s.apocalypseEpoch>=4095}
          onClick={()=>history.change(advanceApocalypseEpoch)}>
          <Orbit size={13}/> Advance epoch
        </button>
        <button type="button" className="button secondary"
          disabled={!apocalypseActive(s)||!selectionActive(s)||
            s.apocalypseEpoch>=4095}
          onClick={()=>{if(window.confirm(
            "Advance geological time, then apply natural selection? Weaker colonies may be removed. This entire change can be undone."
          ))history.change(x=>selectionCycle(advanceApocalypseEpoch(x)));}}>
          <Shuffle size={13}/> Epoch + selection cycle (confirm)
        </button>
        <button type="button" className="button secondary"
          disabled={s.apocalypseAmount<=0}
          onClick={()=>history.change(haltApocalypse)}>
          Hide catastrophe (keep history)
        </button>
      </div>
      <details className="effect-explanation"><summary>How it works</summary><p className="control-note">
        Saved geological epoch: {s.apocalypseEpoch||0} / 4095.
        Advancing an epoch changes the mineral resource field, future
        spore destinations, individual fitness and adaptive growth.
        It NEVER kills, moves or reproduces existing seeds automatically.
        Epoch + Selection Cycle is the only combined destructive action,
        and it always asks you first. All actions support Undo.
      </p></details>
    </>,
    "selection-chamber": <>
      <details className="effect-explanation"><summary>How it works</summary><p className="control-note">
        SELECTION CHAMBER — inherited DNA now determines which organisms
        flourish on a specific mineral landscape. Nutrient compatibility
        controls REAL growth margins and bioluminescence. Actions to cull
        or reproduce are explicit, saved and undoable — no surprise deaths.
      </p></details>
      <Select label="Evolutionary fitness model" value={s.selectionMode}
        onChange={mode=>history.change(x=>mode==="Dormant"
          ?stopSelection({...x,selectionMode:mode})
          :prepareSelection(ensureValidEcosystemState({
            ...x,selectionMode:mode,atmoMaskMode:"Painted colonies",
            atmoAmount:Math.max(70,x.atmoAmount)
          })))}>
        {selectionModes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
      </Select>
      <Parameter label="Fitness effect on growth" name="selectionPressure" history={history}/>
      <Parameter label="Remove weakest percentage" name="selectionSeverity" history={history}/>
      <Parameter label="Survivor offspring proportion" name="selectionBrood" history={history}/>
      <Parameter label="Adapted-organism radiance" name="selectionGlow" history={history}/>
      <Select label="Selection specimen" value={selectionPreset}
        onChange={setSelectionPreset}>
        {selectionPresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
      </Select>
      <div className="pane-actions">
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>applySelectionPreset(
            prepareSelection(ensureValidEcosystemState({...x,
              atmoMaskMode:"Painted colonies",
              atmoAmount:Math.max(75,x.atmoAmount)})),
            selectionPreset))}>
          <Flower2 size={13}/> Awaken selection
        </button>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>shuffleSelection(
            prepareSelection(ensureValidEcosystemState({...x,
              atmoMaskMode:"Painted colonies",
              atmoAmount:Math.max(75,x.atmoAmount)}))))}>
          <Dices size={13}/> Shuffle selection
        </button>
        <button type="button" className="button secondary"
          disabled={!selectionActive(s)||s.habitatStamps.length>=MAX_HABITAT_STAMPS ||
            s.sporeGeneration>=4095 || s.selectionBrood<=0}
          onClick={()=>history.change(breedFittest)}>
          <Dna size={13}/> Breed the fittest
        </button>
        <button type="button" className="button secondary"
          disabled={!selectionActive(s)||s.selectionSeverity<=0 ||
            s.habitatStamps.length<=2}
          onClick={()=>{if(window.confirm(
            "Remove the least-adapted colonies? This is one undoable change, and at least one of each existing parent population survives."
          ))history.change(cullWeakest);}}>
          <Trash2 size={13}/> Cull weakest (confirm)
        </button>
        <button type="button" className="button secondary"
          disabled={!selectionActive(s)||s.selectionSeverity<=0 ||
            s.habitatStamps.length<=2}
          onClick={()=>{if(window.confirm(
            "Run one selection cycle: remove poorly adapted colonies and breed fitter survivors? You can Undo."
          ))history.change(selectionCycle);}}>
          <Orbit size={13}/> Select + reproduce (confirm)
        </button>
        <button type="button" className="button secondary"
          disabled={s.selectionPressure<=0}
          onClick={()=>history.change(stopSelection)}>
          Stop selection (keep bloodlines)
        </button>
      </div>
      <details className="filament-crossbreeder">
        <summary>Fitness scoreboard · {s.habitatStamps.length} organisms</summary>
        <p className="control-note">
          Higher scores are better matches between each seed's inherited
          DNA and the local mineral nutrients. Scores are evaluated at
          each colony center, not inferred from how much it glows.
        </p>
        <ol>
          {rankSelection(s).map(({stamp,index,fitness})=>
            <li key={stamp.id}>
              {index+1}. {stamp.parent===0?"A":"B"} colony
              {" · "}DNA {stamp.gene??"unassigned"}
              {" · "}Fitness {Math.round(fitness*100)}%
              {" · "}Gen {stamp.generation??0}
            </li>)}
        </ol>
      </details>
      <details className="effect-explanation"><summary>How it works</summary><p className="control-note">
        Awaken starts the nutrient field and assigns genes only to
        unassigned seeds; existing custom DNA is never overwritten.
        The cull action preserves at least one living seed from each
        population present. Breed adds real editable descendants up to
        the existing 16-colony limit. No automatic extinction on playback.
      </p></details>
    </>,
    "mutation-bloodlines": <>
      <details className="effect-explanation"><summary>How it works</summary><p className="control-note">
        MUTATION BLOODLINES — every planted colony can carry a unique
        heritable DNA allele (0–100). Its gene changes its actual silhouette
        and palette reaction. Daughter colonies inherit their parent's
        gene, mutate, and can recombine with a nearby opposing population.
      </p></details>
      <Parameter label="Gene expression strength" name="geneAmount" history={history}/>
      <Parameter label="Offspring mutation rate" name="geneMutation" history={history}/>
      <Parameter label="Nearby A/B gene recombination" name="geneCrossbreed" history={history}/>
      <Parameter label="Gene-specific pigment glow" name="geneGlow" history={history}/>
      <Select label="Bloodline specimen" value={genePreset}
        onChange={setGenePreset}>
        {genePresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
      </Select>
      <div className="pane-actions">
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>applyGenePreset(
            ensureValidEcosystemState({...x,
              atmoMaskMode:"Painted colonies",
              atmoAmount:Math.max(70,x.atmoAmount)}),
            genePreset))}>
          <Dna size={13}/> Seed this gene pool
        </button>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>seedGenePool(
            ensureValidEcosystemState({...x,
              atmoMaskMode:"Painted colonies",
              atmoAmount:Math.max(70,x.atmoAmount)})))}>
          <Dices size={13}/> Shuffle all DNA
        </button>
        <button type="button" className="button secondary"
          onClick={()=>history.change(mutateGenePool)}
          disabled={!s.habitatStamps?.length}>
          <Shuffle size={13}/> Mutate existing genes
        </button>
        <button type="button" className="button secondary"
          disabled={s.geneAmount<=0}
          onClick={()=>history.change(hideGenetics)}>
          Hide DNA (keep ancestry)
        </button>
      </div>
      <details className="effect-explanation"><summary>How it works</summary><p className="control-note">
        Use Touch → Habitat Graffiti → Selected colony to edit one
        organism's allele and inspect its ancestry. Gene mutations are
        inherited only when you press Evolve Generation. The existing
        16-colony limit stays intact, and enabling DNA adds no new GPU
        uniform arrays or textures. All changes are undoable.
      </p></details>
    </>,
    "symbiosis-lab": <>
      <p className="control-note">
        SYMBIOSIS LAB — when two painted populations meet, their contact
        zone can become an illuminated third organism, linked fungal lace,
        parasitic corrosion or an electrical synapse. This effect only
        develops where parent A and B actually overlap.
      </p>
      <Select label="Relationship between A and B" value={s.symbiosisMode}
        onChange={mode=>history.change(x=>mode==="Dormant"
          ?stopSymbiosis({...x,symbiosisMode:mode})
          :ensureSymbioticContact({...x,symbiosisMode:mode,
             symbiosisAmount:Math.max(70,x.symbiosisAmount)}))}>
        {symbiosisModes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
      </Select>
      <Parameter label="Contact chemistry strength" name="symbiosisAmount" history={history}/>
      <Parameter label="Filigree, lesions and arcs" name="symbiosisDetail" history={history}/>
      <Parameter label="Interface motion" name="symbiosisMotion" history={history}/>
      <Parameter label="Bioluminescent reaction glow" name="symbiosisGlow" history={history}/>
      <Parameter label="Parasitic dominance (A → B)" name="symbiosisDominance" history={history}/>
      <Select label="Relationship specimen" value={symbiosisPreset}
        onChange={setSymbiosisPreset}>
        {symbiosisPresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
      </Select>
      <div className="pane-actions">
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>applySymbiosisPreset(x,symbiosisPreset))}>
          <Flower2 size={13}/> Spawn symbiosis
        </button>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>shuffleSymbiosis(x))}>
          <Dices size={13}/> Shuffle symbiosis
        </button>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>ensureSymbioticContact(x))}>
          <Orbit size={13}/> Plant contact pair
        </button>
        <button type="button" className="button secondary"
          disabled={s.symbiosisAmount<=0}
          onClick={()=>history.change(stopSymbiosis)}>
          Disable reaction (keep colonies)
        </button>
      </div>
      <details className="effect-explanation"><summary>How it works</summary><p className="control-note">
        The relationship depends on both painted habitats being visible
        and physically touching. Plant contact pair adds only missing
        interaction seeds, never deletes hand-painted colonies.
        At the 16-colony limit, use Touch to move existing seeds together.
        All changes save and undo normally, and the reaction uses the same
        timeline as high-resolution exports.
      </p></details>
    </>,
    "substrate-alchemy": <>
      <details className="effect-explanation"><summary>How it works</summary><p className="control-note">
        SUBSTRATE ALCHEMY — give the organisms somewhere to live:
        mineral fissures, nutrient rivers, faceted quartz beds and
        slow chemical tides. The mineral network changes the actual
        growing territory, not just the background. A and B can favor
        opposite nutrient conditions.
      </p></details>
      <Select label="Living geological substrate" value={s.substrateMode}
        onChange={mode=>history.change(x=>mode==="Bare canvas"
          ?clearSubstrate({...x,substrateMode:mode})
          :{...x,substrateMode:mode,
             substrateAmount:Math.max(65,x.substrateAmount)})}>
        {substrateModes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
      </Select>
      <Parameter label="Mineral visibility" name="substrateAmount" history={history}/>
      <Parameter label="Fracture/vein density" name="substrateScale" history={history}/>
      <Parameter label="Living mineral shimmer" name="substrateMotion" history={history}/>
      <Parameter label="Nutrient pressure on growth" name="substratePressure" history={history}/>
      <Parameter label="Parent A prefers high nutrients" name="substrateAffinityA" history={history}/>
      <Parameter label="Parent B prefers high nutrients" name="substrateAffinityB" history={history}/>
      <Parameter label="Luminous mineral edges" name="substrateGlow" history={history}/>
      <Parameter label="Mineral palette offset" name="substrateHue" history={history}/>
      <Select label="Geological specimen" value={substratePreset}
        onChange={setSubstratePreset}>
        {substratePresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
      </Select>
      <div className="pane-actions">
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>applySubstratePreset(x,substratePreset))}>
          <Flower2 size={13}/> Summon terrain
        </button>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>shuffleSubstrate(x))}>
          <Dices size={13}/> Shuffle geology
        </button>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>ensureValidEcosystemState({
            ...applySubstratePreset(x,substratePreset),
            atmoMaskMode:"Painted colonies",
            atmoAmount:Math.max(72,x.atmoAmount),
          }))}>
          <Orbit size={13}/> Colonize rock
        </button>
        <button type="button" className="button secondary"
          disabled={s.substrateAmount<=0}
          onClick={()=>history.change(clearSubstrate)}>
          Hide substrate
        </button>
      </div>
      <details className="effect-explanation"><summary>How it works</summary><p className="control-note">
        High affinity favors nutrient-rich veins; low affinity favors
        nutrient-poor areas. Pressure changes the actual living outlines.
        Spores evaluate prospective landing sites on the CPU, upload the
        chosen destination to the renderer, and save that exact location
        when you Evolve Generation. All changes are undoable.
      </p></details>
    </>,
    "spore-dynasty": <>
      <p className="control-note">
        SPORE DYNASTIES — reproductive particles emerge from colonies, travel
        along a mathematically determined wind path, land, and grow temporary
        daughter organisms. Evolve Generation commits the landing sites as
        real, movable colonies you can keep breeding.
      </p>
      <Select label="Spore transport" value={s.sporeMode}
        onChange={mode=>history.change(x=>mode==="Dormant"
          ?stopSpores({...x,sporeMode:mode})
          :ensureValidEcosystemState({
            ...x,sporeMode:mode,sporeAmount:Math.max(70,x.sporeAmount),
            atmoMaskMode:"Painted colonies",
            atmoAmount:Math.max(70,x.atmoAmount),
          }))}>
        {sporeModes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
      </Select>
      <Parameter label="Spore visibility" name="sporeAmount" history={history}/>
      <Parameter label="Dispersal speed" name="sporeSpeed" history={history}/>
      <Parameter label="Landing distance" name="sporeReach" history={history}/>
      <Parameter label="Fertility / active parents" name="sporeFertility" history={history}/>
      <Parameter label="Spore luminescence" name="sporeGlow" history={history}/>
      <Select label="Spore specimen" value={sporePreset} onChange={setSporePreset}>
        {sporePresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
      </Select>
      <div className="pane-actions">
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>ensureValidEcosystemState({
            ...applySporePreset(x,sporePreset),
            atmoMaskMode:"Painted colonies",
            atmoAmount:Math.max(74,x.atmoAmount),
          }))}>
          <Flower2 size={13}/> Awaken spores
        </button>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>ensureValidEcosystemState({
            ...shuffleSporeDynasty(x),
            atmoMaskMode:"Painted colonies",
            atmoAmount:Math.max(74,x.atmoAmount),
          }))}>
          <Dices size={13}/> Shuffle spores
        </button>
        <button type="button" className="button secondary"
          disabled={!s.habitatStamps?.length ||
            s.habitatStamps.length>=MAX_HABITAT_STAMPS ||
            s.sporeGeneration>=4095 ||
            s.sporeMode==="Dormant" || s.sporeAmount<=0 ||
            s.sporeFertility<=0}
          onClick={()=>history.change(evolveSporeGeneration)}>
          <Dna size={13}/> Evolve generation
        </button>
        <button type="button" className="button secondary"
          disabled={s.sporeAmount<=0}
          onClick={()=>history.change(stopSpores)}>
          Stop flight (keep offspring)
        </button>
      </div>
      <details className="effect-explanation"><summary>How it works</summary><p className="control-note">
        Living seeds: {(s.habitatStamps||[]).length}/{MAX_HABITAT_STAMPS}
        {" · "}Saved generations: {s.sporeGeneration||0}
        {" · "}Potential parents: {sporeParticipatingCount(s)}.
        Flight and temporary daughters loop smoothly. Evolve Generation
        permanently adds the current parents' offspring to the saved
        document in one undoable action. When the 16-seed budget is full,
        erase some colonies before evolving further.
      </p></details>
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
      <details className="effect-explanation"><summary>How it works</summary><p className="control-note">
        Internal markings use each planted seed's local coordinates and its
        living silhouette, not a fixed image texture. These are biological
        motifs interpreted as generative art, not literal 3D lichen anatomy.
        Restoring visibility to zero leaves every older artwork unchanged.
      </p></details>
    </>,
    "colony-anatomy": <>
      <details className="effect-explanation"><summary>How it works</summary><p className="control-note">
        MUTANT ANATOMY — your hand-planted colonies can be foliose lichen
        plates, coral fringes, crystalline petals or fan-shaped hyphae.
        Both parents have independent geometry. You can keep the original
        circular disks; the zero-strength setting restores them exactly.
      </p></details>
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
      <Select label="Perforation pattern" value={s.colonyPoreMode} onChange={mode=>history.change(x=>({...x,colonyPoreMode:mode,colonyAnatomyAmount:Math.max(70,x.colonyAnatomyAmount||0),colonyAnatomyPores:Math.max(60,x.colonyAnatomyPores||0)}))}>
        {colonyPoreModes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
      </Select>
      <Parameter label="Pore density" name="colonyPoreDensity" history={history}/>
      <Parameter label="Pore size" name="colonyPoreSize" history={history}/>
      <button type="button" className="button secondary" onClick={()=>history.change(x=>({...x,colonyPoreMode:colonyPoreModes[Math.floor(Math.random()*colonyPoreModes.length)],colonyPoreDensity:20+Math.random()*75,colonyPoreSize:20+Math.random()*70,colonyAnatomyAmount:Math.max(70,x.colonyAnatomyAmount||0),colonyAnatomyPores:Math.max(65,x.colonyAnatomyPores||0)}))}><Dices size={13}/> Shuffle pores only</button>
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
      <details className="effect-explanation"><summary>How it works</summary><p className="control-note">
        Anatomy is visible only for Painted colonies habitats. Spawn Anatomy
        Pair enables and plants both species; Shuffle Anatomy plants A
        without forcing a second GPU shader. All changes are reversible.
        Your palette supplies the fluorescent edge color, and exports use
        the same clock as the live preview.
      </p></details>
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
      <details className="effect-explanation"><summary>How it works</summary><p className="control-note">
        Needs painted colony seeds and a parent set to Painted colonies.
        Territory war only makes A/B fight when both use Painted colonies.
        Speed and intensity affect the same timeline used for PNG/GIF/MP4.
        Leave Life at Still and all these effects off to preserve the old art.
        For ready-made experiments try Lookbook → Colony Wars.
      </p></details>
    </>,
    atmosphere: <>
      <details className="effect-explanation"><summary>How it works</summary><p className="control-note">Four living shader-vault worlds you can stack, crossbreed and mask over any engine: stained-glass mycelium, mandala-constrained gas, double-beat phosphors, and living CMY print rosettes. They respond to your existing palette and keep moving in GIF/MP4 exports.</p></details>
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
      <details data-effect-detail="atmosphere-breeder" className="filament-crossbreeder">
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
      <details data-effect-detail="atmosphere-habitats" className="filament-crossbreeder">
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
        <details className="effect-explanation"><summary>How it works</summary><p className="control-note">
          Finger-paint habitats directly on the fixed canvas. Planting automatically
          chooses Painted colonies and activates that parent; A seeds are pink,
          B seeds cyan. Edit, move or erase them in Touch → Habitat Graffiti.
          Up to {MAX_HABITAT_STAMPS} movable seeds per design; undo works.
        </p></details>
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
      <p className="control-note">Sixteen moving textile grounds: six original woven fabrics plus ten new ghosts, invasion cloths, soft moiré, and maximalist cursed upholstery. Use them alone or behind your filament art.</p>
      <Select label="Fabric ground" value={s.underlayMode}
        onChange={mode=>history.change(x=>changeUnderlayMode(x,mode))}>
        {underlayFamilies.map(family=><optgroup key={family.name}
          label={family.name}>
          {family.modes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
        </optgroup>)}
      </Select>
      {underlayDescriptions[s.underlayMode] && (
        <p className="control-note">{underlayDescriptions[s.underlayMode]}</p>
      )}
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
          onClick={()=>history.change(x=>remixUnderlay(x))}>
          <Shuffle size={13}/> Shuffle textile grounds
        </button>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>remixUnderlay(x,Math.random,true))}>
          <Dices size={13}/> Shuffle haunted fabrics
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
      <p className="control-note">Twenty-four animated geometries with thirty-two stitch laws, fourteen fiber materials and an independent thread-jewelry cabinet. Mix practical sewing with gloriously deranged textile mathematics.</p>
      <Select label="Thread geometry" value={s.filamentSpecies}
        onChange={v=>history.change(x=>({...x,filamentSpecies:v,
          filamentAmount:Math.max(73,x.filamentAmount),
          filamentMotion:xenoVascularSpecies.includes(v)
            ?Math.max(45,x.filamentMotion):x.filamentMotion}))}>
        {filamentSpeciesFamilies.map(family=><optgroup
          key={family.name} label={family.name}>
          {family.species.map(name=><option key={name} value={name}>{name}</option>)}
        </optgroup>)}
      </Select>
      <Parameter label="Thread presence" name="filamentAmount" history={history}/>
      <Parameter label="Pattern scale" name="filamentScale" history={history}/>
      <Parameter label="Stitch density" name="filamentDensity" history={history}/>
      <Parameter label="Living motion" name="filamentMotion" history={history}/>
      <Parameter label="Thread thickness" name="filamentWidth" history={history}/>
      <Parameter label="Raised relief / sheen" name="filamentRelief" history={history}/>
      <Parameter label="Palette shift" name="filamentHue" history={history}/>
      <Parameter label="Variation" name="filamentVariation" history={history}/>
      <details data-effect-detail="filament-semantic" className="filament-crossbreeder filament-semantic-gravity">
        <summary>🪄 SEMANTIC GRAVITY — LET WORDS BEND THE WEAVE</summary>
        <details className="effect-explanation"><summary>How it works</summary><p className="control-note">This is actual type-to-thread physics-inspired geometry: your own visible letters become moving gravitational fields that attract, repel, orbit, shear and even cut holes through the yarn. It borrows the SAME glyph shapes and animation from the real text-export compositor. No default slogans are ever generated.</p></details>
        <p className="control-note"><strong>First, enter words in the Text tab and turn their visibility/opacity up.</strong> If no words are visible, gravity stays dormant. Existing text layers, rich styling and font choices are kept, not overwritten.</p>
        <Select label="Semantic force law" value={s.semanticGravityMode}
          onChange={mode=>history.change(x=>({...x,semanticGravityMode:mode,
            filamentAmount:mode==="Off"?x.filamentAmount:Math.max(68,x.filamentAmount),
            semanticGravityAmount:mode==="Off"?0:Math.max(70,x.semanticGravityAmount)}))}>
          {semanticGravityModes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
        </Select>
        <p className="control-note">{semanticGravityDescriptions[s.semanticGravityMode]}</p>
        <Parameter label="Word gravitational strength" name="semanticGravityAmount" history={history}/>
        <Parameter label="Text influence radius" name="semanticGravityRadius" history={history}/>
        <Parameter label="Influence falloff / sharpness" name="semanticGravityFalloff" history={history}/>
        <Parameter label="Orbit and shear swirl" name="semanticGravitySwirl" history={history}/>
        <Parameter label="Time-varying pull" name="semanticGravityPulse" history={history}/>
        <Parameter label="Nonlinear textile variation" name="semanticGravityVariation" history={history}/>
        <Select label="Word-warped textile specimen" value={semanticPreset} onChange={setSemanticPreset}>
          {semanticGravityPresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
        </Select>
        <div className="pane-actions">
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>applySemanticGravityPreset(x,semanticPreset))}>
            Let the words haunt the fibers
          </button>
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>remixSemanticGravity(x))}>
            <Shuffle size={13}/> Shuffle text gravity
          </button>
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>remixSemanticGravity(x,Math.random,true))}>
            <Dices size={13}/> Feral linguistic gravity
          </button>
          <button type="button" className="button secondary"
            disabled={s.semanticGravityAmount<=0}
            onClick={()=>history.change(disableSemanticGravity)}>
            Release the words (keep text and fibers)
          </button>
        </div>
        <details className="effect-explanation"><summary>How it works</summary><p className="control-note">The field moves the actual filaments before their geometry, stitching, material and crossbreeding are drawn. The letter-shaped void law also subtracts from fiber coverage. Your words remain visible on top as usual. This is a glyph-shaped force field, not an AI interpretation of their meaning.</p></details>
      </details>
      <details data-effect-detail="filament-quasi" className="filament-crossbreeder filament-quasi-lab">
        <summary>💠 QUASICRYSTAL BROCADE — IMPOSSIBLE RAISED EMBROIDERY</summary>
        <details className="effect-explanation"><summary>How it works</summary><p className="control-note">Genuinely new five-direction quasiperiodic multigrid threads—not the old fivefold sine-pattern. Each of the five thread families has its own phason offset. Where yarns meet, raised star collars and local highlights catch the light. It works with both hybrid parents, material dressing, the needle orchestra, and your existing palettes.</p></details>
        <Select label="Quasicrystal embroidery specimen" value={quasiPreset} onChange={setQuasiPreset}>
          {quasicrystalBrocadePresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
        </Select>
        <Parameter label="Pentagrid line spacing" name="filamentQuasiSpacing" history={history}/>
        <Parameter label="Phason offset / pattern identity" name="filamentQuasiPhason" history={history}/>
        <Parameter label="Phason drift / living motion" name="filamentQuasiDrift" history={history}/>
        <Parameter label="Embroidered raised relief" name="filamentQuasiRelief" history={history}/>
        <Parameter label="Thread elevation / crown sheen" name="filamentQuasiElevation" history={history}/>
        <Parameter label="Star-point collar ornaments" name="filamentQuasiOrnament" history={history}/>
        <div className="pane-actions">
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>applyQuasicrystalBrocadePreset(x,quasiPreset))}>
            Embroider selected specimen
          </button>
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>remixQuasicrystalBrocade(x))}>
            <Dices size={13}/> Shuffle quasicrystal geometry
          </button>
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>({...x,filamentQuasiPhason:(x.filamentQuasiPhason+23+Math.random()*64)%100}))}>
            <Shuffle size={13}/> Reseed phason
          </button>
        </div>
        <p className="control-note">The six controls modify the actual selected thread geometry and highlight, not a screen-wide effect. Presets preserve your current palette, fiber dresses, second parent, original text and stitch motion. Selecting another geometry leaves old art unchanged.</p>
      </details>
      <details data-effect-detail="filament-feral" className="filament-crossbreeder filament-feral-lab">
        <summary>🧶 FERAL JACQUARD — STRUCTURAL CORRUPTION</summary>
        <p className="control-note">A genuine warp/weft geometry: moving strands shear, exchange over-under precedence, and form knot collars within actual thread outlines. No glitch overlay. Use as either parent in hybrid fabrics.</p>
        <Select label="Jacquard structure recipe" value={feralPreset} onChange={setFeralPreset}>
          {feralJacquardPresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
        </Select>
        <Parameter label="Controlled corruption" name="filamentFeralCorruption" history={history}/>
        <Parameter label="Warp / weft migration" name="filamentFeralMigration" history={history}/>
        <Parameter label="Structural order / interlace" name="filamentFeralOrder" history={history}/>
        <Parameter label="Knot population" name="filamentFeralKnots" history={history}/>
        <Parameter label="Mutational branching" name="filamentFeralMutation" history={history}/>
        <div className="pane-actions">
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>applyFeralJacquardPreset(x,feralPreset))}>
            Weave feral recipe
          </button>
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>remixFeralJacquard(x))}>
            <Shuffle size={13}/> Shuffle feral structure
          </button>
        </div>
        <p className="control-note">Feral recipes preserve your materials, color palette, text, stitch style and second parent. To crossbreed, choose Feral Jacquard in either thread parent selector.</p>
      </details>
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
          onClick={()=>history.change(x=>remixXenoVascular(x))}>
          <Shuffle size={13}/> Shuffle alien + veinwork
        </button>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>remixFreshFilaments(x))}>
          <Dices size={13}/> Shuffle fresh textile geometries
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
      <details data-effect-detail="filament-sculpt" className="filament-crossbreeder filament-sculpt-lab">
        <summary>💎 SCULPTED THREADS — RAISED RELIEF & LIGHT</summary>
        <p className="control-note">Fifteen geometry-constrained 2.5D relief styles, including new gilded metalwork, bone inlays, molten jewels and scarred alien sutures. No heavyweight 3D mesh; the tactile lighting stays on your actual yarn.</p>
        <Select label="Sculpted thread style" value={s.filamentSculptMode}
          onChange={value=>history.change(x=>({...x,filamentSculptMode:value,
            filamentSculptAmount:Math.max(65,x.filamentSculptAmount),
            filamentAmount:Math.max(55,x.filamentAmount)}))}>
          {filamentSculptFamilies.map(family=><optgroup
            key={family.name} label={family.name}>
            {family.modes.map(name=><option key={name} value={name}>{name}</option>)}
          </optgroup>)}
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
            onClick={()=>history.change(x=>remixFilamentSculpt(x))}>
            <Shuffle size={13}/> Shuffle sculpted relief
          </button>
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>remixFilamentSculpt(x,Math.random,true))}>
            <Dices size={13}/> Shuffle alien relic relief
          </button>
          <button type="button" className="button secondary"
            disabled={s.filamentSculptAmount<=0}
            onClick={()=>history.change(disableFilamentSculpt)}>
            Flatten relief (keep threads)
          </button>
        </div>
        <p className="control-note">Flat relief means the exact previous thread appearance. This stays compatible with crossbreeding, thread materials, self-weaving, and the existing animation/export clock.</p>
      </details>
      <details data-effect-detail="filament-stitch" className="filament-crossbreeder filament-stitch-lab">
        <summary>🪡 SELF-WEAVING LOOM — STITCH IN MOTION</summary>
        <p className="control-note">Thirty-three animated stitch laws: classic chain, cross, satin, blanket, feather and cable stitches, plus ghost bobbins, quantum unraveling and mutant zipper nightmares. All follow the actual thread paths.</p>
        <Select label="Stitch motion" value={s.filamentStitchMode}
          onChange={mode=>history.change(x=>({...x,filamentStitchMode:mode,
            filamentStitchAmount:Math.max(68,x.filamentStitchAmount),
            filamentAmount:Math.max(55,x.filamentAmount)}))}>
          {filamentStitchFamilies.map(family=><optgroup
            key={family.name} label={family.name}>
            {family.modes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
          </optgroup>)}
        </Select>
        <p className="control-note">{filamentStitchDescriptions[s.filamentStitchMode]}</p>
        <Parameter label="Self-weaving presence" name="filamentStitchAmount" history={history}/>
        <Parameter label="Stitch travel speed" name="filamentStitchSpeed" history={history}/>
        <Parameter label="Stitch tail length / spacing" name="filamentStitchLength" history={history}/>
        <Parameter label="Traveling needle glow" name="filamentStitchGlow" history={history}/>
        <details data-effect-detail="filament-chladni" className="filament-crossbreeder filament-chladni-lab">
          <summary>🎻 CHLADNI NEEDLE ORCHESTRA — CYMATIC STITCHES</summary>
          <p className="control-note">Real sewing reveals fibers along dynamic standing-wave nodes and eigenmode crossings. Resonance, detuning and mode order change the actual stitched geometry, not a decorative screen pattern.</p>
          <Select label="Needle orchestra score" value={chladniPreset} onChange={setChladniPreset}>
            {chladniNeedlePresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
          </Select>
          <Parameter label="Eigenmode / overtone order" name="filamentChladniOrder" history={history}/>
          <Parameter label="Resonance / oscillation" name="filamentChladniResonance" history={history}/>
          <Parameter label="Nodal needle density" name="filamentChladniDensity" history={history}/>
          <Parameter label="Coupled phase" name="filamentChladniPhase" history={history}/>
          <Parameter label="Detune / broken symmetry" name="filamentChladniDetune" history={history}/>
          <div className="pane-actions">
            <button type="button" className="button secondary"
              onClick={()=>history.change(x=>applyChladniNeedlePreset(x,chladniPreset))}>
              Play selected needle score
            </button>
            <button type="button" className="button secondary"
              onClick={()=>history.change(x=>remixChladniNeedles(x))}>
              <Dices size={13}/> Shuffle Chladni orchestra
            </button>
          </div>
          <p className="control-note">Compatible with all thread species, including Feral Jacquard, both hybrid parents and every fiber dressing. The selected law is compiled once into the shared preview/export shader.</p>
        </details>
        <details data-effect-detail="filament-retrocausal" className="filament-crossbreeder filament-retrocausal-lab">
          <summary>🕰️ RETROCAUSAL EMBROIDERY — STITCHES FROM TOMORROW</summary>
          <details className="effect-explanation"><summary>How it works</summary><p className="control-note">The needle samples its future analytic position before arriving. Pre-echo seams reveal the real underlying threads, phantom knots appear before they are tied, and reversed waves sew against time. No saved future frames, actual time travel, or disconnected background decals—one deterministic law on the SAME animation clock as your export.</p></details>
          <Select label="Temporal embroidery score" value={retroPreset} onChange={setRetroPreset}>
            {retrocausalEmbroideryPresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
          </Select>
          <Parameter label="Needle future lookahead" name="filamentRetroLead" history={history}/>
          <Parameter label="Pre-echo ghost stitches" name="filamentRetroEcho" history={history}/>
          <Parameter label="Paradox seam crossings" name="filamentRetroParadox" history={history}/>
          <Parameter label="Knots tied before arrival" name="filamentRetroKnots" history={history}/>
          <Parameter label="Reverse-time stitch wave" name="filamentRetroReversal" history={history}/>
          <Parameter label="Seam coherence / softness" name="filamentRetroCoherence" history={history}/>
          <div className="pane-actions">
            <button type="button" className="button secondary"
              onClick={()=>history.change(x=>applyRetrocausalEmbroideryPreset(x,retroPreset))}>
              Sew selected temporal score
            </button>
            <button type="button" className="button secondary"
              onClick={()=>history.change(x=>remixRetrocausalEmbroidery(x))}>
              <Shuffle size={13}/> Shuffle future seams
            </button>
            <button type="button" className="button secondary"
              onClick={()=>history.change(x=>remixRetrocausalEmbroidery(x,Math.random,true))}>
              <Dices size={13}/> Feral chronology shuffle
            </button>
          </div>
          <details className="effect-explanation"><summary>How it works</summary><p className="control-note">Scores preserve both hybrid thread parents, existing optical coats, fiber materials, palettes, text, shape and all other effects. This stitch law is selectable alongside every geometry; swapping modes leaves your old stitchwork unchanged. A future sample is calculated from time—not fetched from the actual future.</p></details>
        </details>
        <Select label="Self-weaving recipe" value={stitchPreset} onChange={setStitchPreset}>
          {filamentStitchPresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
        </Select>
        <div className="pane-actions">
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>applyFilamentStitchPreset(x,stitchPreset))}>
            Start weaving
          </button>
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>remixFilamentStitchMotion(x))}>
            <Shuffle size={13}/> Shuffle stitch motions
          </button>
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>remixFilamentStitchMotion(x,Math.random,true))}>
            <Dices size={13}/> Shuffle new weird stitches
          </button>
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>remixRitualStitches(x))}>
            <Shuffle size={13}/> Shuffle ritual stitches
          </button>
          <button type="button" className="button secondary"
            disabled={s.filamentStitchAmount<=0}
            onClick={()=>history.change(stopFilamentStitching)}>
            Hold finished fabric
          </button>
        </div>
        <p className="control-note">When disabled, your original geometry, colors, materials, beads and two-parent weave return unchanged. Runs on the same timeline as PNG, GIF and MP4 exports.</p>
      </details>
      <details data-effect-detail="filament-materials" className="filament-crossbreeder filament-material-lab">
        <summary>✨ THREAD ALCHEMY — MATERIALS & BEADS</summary>
        <details className="effect-explanation"><summary>How it works</summary><p className="control-note">Fourteen dressable fiber materials: from cotton, pearl floss, chenille and metallic tinsel to rainbow fiber optics, oil-slick latex, gelatin nerves and living bioluminescent mycelium. Both parents can wear DIFFERENT materials. Original Thread retains the old look.</p></details>
        <Select label="First parent fiber material" value={s.filamentMaterial}
          onChange={value=>history.change(x=>({...x,filamentMaterial:value,
            filamentAmount:Math.max(50,x.filamentAmount)}))}>
          {filamentMaterials.map(name=><option key={name} value={name}>{name}</option>)}
        </Select>
        <Select label="Second parent fiber material" value={s.filamentSecondMaterial}
          onChange={value=>history.change(x=>({...x,filamentSecondMaterial:value}))}>
          {filamentMaterials.map(name=><option key={name} value={name}>{name}</option>)}
        </Select>
        <details data-effect-detail="filament-architecture"><summary>Parasitic architecture · living scaffolds</summary>
          <p className="control-note">Projected openwork structures grow out from the fiber envelope. Independent of jewelry and surface organisms; not persistent 3D geometry.</p>
          <Select label="Architecture law" value={s.filamentArchitecture} onChange={v=>history.change(x=>({...x,filamentArchitecture:v}))}>{textileArchitectureModes.slice(0,1).map(v=><option key={v} value={v}>{v}</option>)}<optgroup label="Living scaffolds">{textileArchitectureModes.slice(1,9).map(v=><option key={v} value={v}>{v}</option>)}</optgroup><optgroup label="Impossible topology">{textileArchitectureModes.slice(9).map(v=><option key={v} value={v}>{v}</option>)}</optgroup></Select>
          <Parameter label="Architecture influence" name="filamentArchitectureAmount" history={history}/>
          <Parameter label="Structure frequency" name="filamentArchitectureScale" history={history}/>
          <Parameter label="Growth reach" name="filamentArchitectureReach" history={history}/>
          <Parameter label="Openwork / porosity" name="filamentArchitectureOpenwork" history={history}/>
          <Parameter label="Growth cycle speed" name="filamentArchitectureSpeed" history={history}/>
          <Parameter label="Architecture palette offset" name="filamentArchitectureHue" history={history}/>
          <button type="button" className="button secondary" disabled={!s.filamentAmount} onClick={()=>history.change(x=>remixTextileArchitecture(x))}><Dices size={13}/> Shuffle architecture only</button>
        </details>
        <details data-effect-detail="filament-dimension"><summary>Dimensional metamorphosis · impossible transitions</summary>
          <p className="control-note">Morph projected scaffold distance fields into a second architecture. Existing structure controls and optical materials are preserved.</p>
          <Select label="Transition law" value={s.filamentDimMode} onChange={v=>history.change(x=>({...x,filamentDimMode:v}))}>{textileDimensionModes.map(v=><option key={v} value={v}>{v}</option>)}</Select>
          <Select label="Destination structure" value={s.filamentDimTarget} onChange={v=>history.change(x=>({...x,filamentDimTarget:v}))}><optgroup label="Living scaffolds">{textileDimensionTargets.slice(0,8).map(v=><option key={v} value={v}>{v}</option>)}</optgroup><optgroup label="Impossible topology">{textileDimensionTargets.slice(8).map(v=><option key={v} value={v}>{v}</option>)}</optgroup></Select>
          <Parameter label="Transition influence" name="filamentDimAmount" history={history}/>
          <Parameter label="Manual progress / phase offset" name="filamentDimProgress" history={history}/>
          <Parameter label="Transition speed" name="filamentDimSpeed" history={history}/>
          <Parameter label="Midpoint deformation" name="filamentDimWarp" history={history}/>
          <Parameter label="Hybrid connectivity / fusion" name="filamentDimFusion" history={history}/>
          {(s.filamentArchitecture==="Bare architecture"||s.filamentArchitecture===s.filamentDimTarget)&&<p className="control-note" role="status">Choose a visible source architecture different from the destination.</p>}
          <button type="button" className="button secondary" disabled={!s.filamentAmount} onClick={()=>history.change(x=>remixTextileDimension(x))}><Dices size={13}/> Shuffle metamorphosis only</button>
        </details>
        <details data-effect-detail="filament-meta"><summary>Optical metamaterials · structural light</summary>
          <p className="control-note">Wavelength-inspired color, reflection, apparent translucency and emission on Parasitic Architecture. Requires a visible scaffold. Projected optical approximation, not ray tracing.</p>
          <Select label="Optical material" value={s.filamentMeta} onChange={v=>history.change(x=>({...x,filamentMeta:v}))}>{textileMetaModes.slice(0,1).map(v=><option key={v} value={v}>{v}</option>)}<optgroup label="Structural optics">{textileMetaModes.slice(1,9).map(v=><option key={v} value={v}>{v}</option>)}</optgroup><optgroup label="Impossible materials">{textileMetaModes.slice(9).map(v=><option key={v} value={v}>{v}</option>)}</optgroup></Select>
          <Parameter label="Optical influence" name="filamentMetaAmount" history={history}/>
          <Parameter label="Microstructure frequency" name="filamentMetaFrequency" history={history}/>
          <Parameter label="Optical thickness" name="filamentMetaThickness" history={history}/>
          <Parameter label="Spectral / palette mix" name="filamentMetaDispersion" history={history}/>
          <Parameter label="Optical motion" name="filamentMetaMotion" history={history}/>
          <Parameter label="Polish / spectral sharpness" name="filamentMetaPolish" history={history}/>
          {s.filamentArchitecture==="Bare architecture"&&<p className="control-note" role="status">Choose a Parasitic Architecture law to see optical metamaterials.</p>}
          <button type="button" className="button secondary" disabled={!s.filamentAmount} onClick={()=>history.change(x=>remixTextileMeta(x))}><Dices size={13}/> Shuffle metamaterials only</button>
        </details>
        <details data-effect-detail="filament-engraving"><summary>Mathematical surface engraving · microcarving</summary>
          <p className="control-note">Etch mathematical grooves, reflective rims and perforations into an existing architectural scaffold. Compatible with material alchemy.</p>
          <Select label="Engraving law" value={s.filamentEngraveMode} onChange={v=>history.change(x=>({...x,filamentEngraveMode:v}))}>{textileEngravingModes.map(v=><option key={v} value={v}>{v}</option>)}</Select>
          <Parameter label="Engraving presence" name="filamentEngraveAmount" history={history}/>
          <Parameter label="Pattern scale" name="filamentEngraveScale" history={history}/>
          <Parameter label="Cut depth" name="filamentEngraveDepth" history={history}/>
          <Parameter label="Groove width" name="filamentEngraveWidth" history={history}/>
          <Parameter label="Engraving motion" name="filamentEngraveMotion" history={history}/>
          <Parameter label="Engraved rim hue" name="filamentEngraveHue" history={history}/>
          {(s.filamentArchitecture==="Bare architecture"||!s.filamentArchitectureAmount)&&<p className="control-note" role="status">Choose a visible Parasitic Architecture law to see engraving.</p>}
          <button type="button" className="button secondary" disabled={!s.filamentAmount} onClick={()=>history.change(x=>remixTextileEngraving(x))}><Dices size={13}/> Shuffle engraving only</button>
        </details>
        <details data-effect-detail="filament-material-alchemy"><summary>Material alchemy · phase transitions</summary>
          <p className="control-note">Blend optical properties, opacity, highlights and emission between two materials without changing scaffold geometry. Requires a visible architecture and optical material.</p>
          <Select label="Transmutation law" value={s.filamentAlchMode} onChange={v=>history.change(x=>({...x,filamentAlchMode:v}))}>{textileAlchemyModes.map(v=><option key={v} value={v}>{v}</option>)}</Select>
          <Select label="Destination material" value={s.filamentAlchTarget} onChange={v=>history.change(x=>({...x,filamentAlchTarget:v}))}><optgroup label="Structural optics">{textileAlchemyTargets.slice(0,8).map(v=><option key={v} value={v}>{v}</option>)}</optgroup><optgroup label="Impossible materials">{textileAlchemyTargets.slice(8).map(v=><option key={v} value={v}>{v}</option>)}</optgroup></Select>
          <Parameter label="Transmutation influence" name="filamentAlchAmount" history={history}/>
          <Parameter label="Manual progress / phase offset" name="filamentAlchProgress" history={history}/>
          <Parameter label="Transition speed" name="filamentAlchSpeed" history={history}/>
          <Parameter label="Territory / wave scale" name="filamentAlchScale" history={history}/>
          <Parameter label="Transition glow" name="filamentAlchGlow" history={history}/>
          {(s.filamentArchitecture==="Bare architecture"||!s.filamentArchitectureAmount||s.filamentMeta==="Natural scaffold"||!s.filamentMetaAmount||s.filamentMeta===s.filamentAlchTarget)&&<p className="control-note" role="status">Choose a visible scaffold and source material different from the destination.</p>}
          <button type="button" className="button secondary" disabled={!s.filamentAmount} onClick={()=>history.change(x=>remixTextileAlchemy(x))}><Dices size={13}/> Shuffle material alchemy only</button>
        </details>
        <details data-effect-detail="filament-ecology"><summary>Textile surface ecology · living fiber deposits</summary>
          <p className="control-note">Microscopic organisms and minerals grow and recede along the local thread surface. Separate from jewelry and the painted ecosystem. Growth is procedural and reversible, not a persistent biological simulation.</p>
          <Select label="Fiber colonizer" value={s.filamentEcology} onChange={v=>history.change(x=>({...x,filamentEcology:v}))}>{textileEcologyModes.slice(0,1).map(v=><option key={v} value={v}>{v}</option>)}<optgroup label="Individual organisms">{textileEcologyModes.slice(1,17).map(v=><option key={v} value={v}>{v}</option>)}</optgroup><optgroup label="Mixed cultures · Symbiogenesis">{textileEcologyModes.slice(17).map(v=><option key={v} value={v}>{v}</option>)}</optgroup></Select>
          <Parameter label="Colonization influence" name="filamentEcologyAmount" history={history}/>
          <Parameter label="Colony scale / density" name="filamentEcologyScale" history={history}/>
          <Parameter label="Surface population" name="filamentEcologyCoverage" history={history}/>
          <Parameter label="Growth cycle speed" name="filamentEcologySpeed" history={history}/>
          <Parameter label="Microscopic relief" name="filamentEcologyRelief" history={history}/>
          <Parameter label="Colony palette offset" name="filamentEcologyHue" history={history}/>
          <button type="button" className="button secondary" disabled={!s.filamentAmount} onClick={()=>history.change(x=>remixTextileEcology(x))}><Dices size={13}/> Shuffle fiber ecology only</button>
        </details>
        <details data-effect-detail="filament-chroma"><summary>Chromatic weaving · moving pigment mathematics</summary>
          <p className="control-note">Redistribute the current palette inside individual threads. Both parents keep their materials and hue offsets. Crossing pigment exchange uses the first parent's actual pigment coordinate only at overlapping thread cores.</p>
          <Select label="Chromatic weaving law" value={s.filamentChroma} onChange={v=>history.change(x=>({...x,filamentChroma:v}))}>{textileChromaModes.map(v=><option key={v} value={v}>{v}</option>)}</Select>
          <Parameter label="Pigment influence" name="filamentChromaAmount" history={history}/>
          <Parameter label="Color band frequency" name="filamentChromaScale" history={history}/>
          <Parameter label="Palette travel range" name="filamentChromaSpread" history={history}/>
          <Parameter label="Pigment motion speed" name="filamentChromaSpeed" history={history}/>
          <Parameter label="Band sharpness" name="filamentChromaContrast" history={history}/>
          <Parameter label="Crossing color exchange" name="filamentChromaExchange" history={history}/>
          {s.filamentChroma==="Crossing pigment exchange"&&!s.filamentCrossbreed&&<p className="control-note" role="status">Enable a second woven parent for pigment exchange.</p>}
          <button type="button" className="button secondary" disabled={!s.filamentAmount} onClick={()=>history.change(x=>remixTextileChroma(x))}><Dices size={13}/> Shuffle chromatic weaving only</button>
        </details>
        <details data-effect-detail="filament-physics"><summary>Impossible textile physics · split, fray & rejoin</summary>
          <p className="control-note">Animate the projected carrier distance before fiber construction, microloom and stitch reveal. These are reversible procedural deformations, not persistent simulated breaks. Crossbreed grafts require a second woven parent.</p>
          <Select label="Textile physics law" value={s.filamentPhysics} onChange={v=>history.change(x=>({...x,filamentPhysics:v}))}>{textilePhysicsModes.map(v=><option key={v} value={v}>{v}</option>)}</Select>
          <Parameter label="Deformation influence" name="filamentPhysicsAmount" history={history}/>
          <Parameter label="Rupture / split frequency" name="filamentPhysicsScale" history={history}/>
          <Parameter label="Branch reach" name="filamentPhysicsReach" history={history}/>
          <Parameter label="Deformation speed" name="filamentPhysicsSpeed" history={history}/>
          <Parameter label="Rejoining / repair" name="filamentPhysicsRepair" history={history}/>
          <Parameter label="Active seam glow" name="filamentPhysicsGlow" history={history}/>
          {s.filamentPhysics==="Crossbreed grafts"&&!s.filamentCrossbreed&&<p className="control-note" role="status">Enable a second woven parent to see grafts.</p>}
          <button type="button" className="button secondary" disabled={!s.filamentAmount} onClick={()=>history.change(x=>remixTextilePhysics(x))}><Dices size={13}/> Shuffle textile physics only</button>
        </details>
        <details data-effect-detail="filament-microloom"><summary>Recursive microloom · fabric inside fabric</summary>
          <p className="control-note">Two nested scales of miniature weave, projected into the real thread core. Combines independently with fiber construction, material and jewelry. Fine patterns fade below the pixel footprint.</p>
          <Select label="Microloom pattern" value={s.filamentMicroloom} onChange={v=>history.change(x=>({...x,filamentMicroloom:v}))}>{microloomModes.map(v=><option key={v} value={v}>{v}</option>)}</Select>
          <Parameter label="Microloom influence" name="filamentMicroloomAmount" history={history}/>
          <Parameter label="Internal weave scale" name="filamentMicroloomScale" history={history}/>
          <Parameter label="Nested scale depth" name="filamentMicroloomDepth" history={history}/>
          <Parameter label="Micro-openwork" name="filamentMicroloomOpenwork" history={history}/>
          <Parameter label="Internal weave motion" name="filamentMicroloomMotion" history={history}/>
          <Parameter label="Microloom palette contrast" name="filamentMicroloomColor" history={history}/>
          <button type="button" className="button secondary" disabled={!s.filamentAmount} onClick={()=>history.change(x=>remixMicroloom(x))}><Dices size={13}/> Shuffle microloom only</button>
        </details>
        <details data-effect-detail="filament-construction"><summary>Fiber construction · braids & cable anatomy</summary>
          <p className="control-note">Split the existing strand core into projected subfibers, gaps and winding highlights. Shared construction for both parents; material and jewelry remain independent.</p>
          <Select label="Fiber construction" value={s.filamentConstruction} onChange={v=>history.change(x=>({...x,filamentConstruction:v}))}>{fiberConstructionModes.map(v=><option key={v} value={v}>{v}</option>)}</Select>
          <Parameter label="Construction influence" name="filamentConstructionAmount" history={history}/>
          <Parameter label="Twist pitch / packing" name="filamentConstructionPitch" history={history}/>
          <Parameter label="Fiber separation / openings" name="filamentConstructionGap" history={history}/>
          <Parameter label="Internal winding speed" name="filamentConstructionMotion" history={history}/>
          <Parameter label="Subfiber relief" name="filamentConstructionRelief" history={history}/>
          <button type="button" className="button secondary" disabled={!s.filamentAmount} onClick={()=>history.change(x=>remixFiberConstruction(x))}><Dices size={13}/> Shuffle fiber construction only</button>
        </details>
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
            onClick={()=>history.change(x=>remixUnusualFilamentMaterials(x))}>
            <Shuffle size={13}/> Dress in weird shit
          </button>
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>remixThreadCouture(x))}>
            <Dices size={13}/> Outfit roulette — fibers + jewelry
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

        <details data-effect-detail="filament-optics" className="filament-crossbreeder filament-structural-optics">
          <summary>🌈 STRUCTURAL-COLOR OPTICS — DRESS THE THREADS</summary>
          <details className="effect-explanation"><summary>How it works</summary><p className="control-note">Light caught INSIDE the selected fabric. Seven pseudo-optical laws alter the already-dressed individual yarn, with angle/curvature/film-thickness-responsive interference, directional reflection and palette-dependent pearlescence. Both parents have completely independent coats. The original 14 materials remain underneath, unmodified.</p></details>
          <Select label="Structural-color twin-fiber recipe" value={opticsPreset} onChange={setOpticsPreset}>
            {structuralOpticsPresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
          </Select>
          <div className="pane-actions">
            <button type="button" className="button secondary"
              onClick={()=>history.change(x=>applyStructuralOpticsPreset(x,opticsPreset))}>
              Dress BOTH fibers in spectral weirdness
            </button>
            <button type="button" className="button secondary"
              onClick={()=>history.change(x=>remixStructuralOptics(x))}>
              <Shuffle size={13}/> Shuffle both optical coats
            </button>
            <button type="button" className="button secondary"
              onClick={()=>history.change(x=>remixStructuralOptics(x,Math.random,"both",true))}>
              <Dices size={13}/> Wild spectral wardrobe
            </button>
          </div>
          <details data-effect-detail="filament-optics-a" className="filament-crossbreeder" open>
            <summary>🧵 PARENT A — FIRST FIBER OPTICS</summary>
            <Select label="First parent optical law" value={s.filamentOpticsMode}
              onChange={mode=>history.change(x=>({...x,filamentOpticsMode:mode,
                filamentAmount:mode==="Off"?x.filamentAmount:Math.max(65,x.filamentAmount),
                filamentOpticsAmount:mode==="Off"?0:Math.max(75,x.filamentOpticsAmount)}))}>
              {structuralOpticsModes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
            </Select>
            <p className="control-note">{structuralOpticsDescriptions[s.filamentOpticsMode]}</p>
            <Parameter label="First fiber structural-color strength" name="filamentOpticsAmount" history={history}/>
            <Parameter label="First fiber film thickness" name="filamentOpticsThickness" history={history}/>
            <Parameter label="First fiber dispersion" name="filamentOpticsDispersion" history={history}/>
            <Parameter label="First fiber optical anisotropy" name="filamentOpticsAnisotropy" history={history}/>
            <Parameter label="First fiber curvature response" name="filamentOpticsCurvature" history={history}/>
            <Parameter label="First fiber pearlescent layer" name="filamentOpticsPearl" history={history}/>
            <Parameter label="First fiber spectral phase" name="filamentOpticsPhase" history={history}/>
            <div className="pane-actions">
              <button type="button" className="button secondary"
                onClick={()=>history.change(x=>remixStructuralOptics(x,Math.random,"first"))}>
                <Shuffle size={13}/> Shuffle first optics
              </button>
              <button type="button" className="button secondary"
                disabled={s.filamentOpticsAmount<=0}
                onClick={()=>history.change(x=>disableStructuralOptics(x,"first"))}>
                Remove first coat
              </button>
            </div>
          </details>
          <details data-effect-detail="filament-optics-b" className="filament-crossbreeder">
            <summary>🧵 PARENT B — SECOND FIBER OPTICS</summary>
            <p className="control-note">This parent's coat becomes visible only when Hybrid Breeder has a second thread parent turned on. It does NOT mirror Parent A's coating unless you choose the same optical law.</p>
            <Select label="Second parent optical law" value={s.filamentSecondOpticsMode}
              onChange={mode=>history.change(x=>({...x,filamentSecondOpticsMode:mode,
                filamentSecondOpticsAmount:mode==="Off"?0:Math.max(75,x.filamentSecondOpticsAmount)}))}>
              {structuralOpticsModes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
            </Select>
            <p className="control-note">{structuralOpticsDescriptions[s.filamentSecondOpticsMode]}</p>
            <Parameter label="Second fiber structural-color strength" name="filamentSecondOpticsAmount" history={history}/>
            <Parameter label="Second fiber film thickness" name="filamentSecondOpticsThickness" history={history}/>
            <Parameter label="Second fiber dispersion" name="filamentSecondOpticsDispersion" history={history}/>
            <Parameter label="Second fiber optical anisotropy" name="filamentSecondOpticsAnisotropy" history={history}/>
            <Parameter label="Second fiber curvature response" name="filamentSecondOpticsCurvature" history={history}/>
            <Parameter label="Second fiber pearlescent layer" name="filamentSecondOpticsPearl" history={history}/>
            <Parameter label="Second fiber spectral phase" name="filamentSecondOpticsPhase" history={history}/>
            <div className="pane-actions">
              <button type="button" className="button secondary"
                onClick={()=>history.change(x=>remixStructuralOptics(x,Math.random,"second"))}>
                <Dices size={13}/> Shuffle second optics
              </button>
              <button type="button" className="button secondary"
                disabled={s.filamentSecondOpticsAmount<=0}
                onClick={()=>history.change(x=>disableStructuralOptics(x,"second"))}>
                Remove second coat
              </button>
            </div>
          </details>
          <div className="pane-actions">
            <button type="button" className="button secondary"
              onClick={()=>history.change(swapStructuralOptics)}>
              Swap optical coats A ↔ B
            </button>
            <button type="button" className="button secondary"
              disabled={s.filamentOpticsAmount<=0 && s.filamentSecondOpticsAmount<=0}
              onClick={()=>history.change(x=>disableStructuralOptics(x))}>
              Restore original thread colors
            </button>
          </div>
          <details className="effect-explanation"><summary>How it works</summary><p className="control-note">Light is pseudo-view and yarn-curvature sensitive within the existing 2D artboard—not physically measured spectral reflectance. Your 14 original dressable fibers, palettes, over-under stitches, hybrid materials, jewelry and exact-effects export pipeline remain intact. Off compiles no optical color pass.</p></details>
        </details>

      </details>
      <details data-effect-detail="filament-morph" className="filament-crossbreeder filament-metamorphosis">
        <summary>🦋 THREAD METAMORPHOSIS — FABRIC THAT CHANGES MATERIAL</summary>
        <details className="effect-explanation"><summary>How it works</summary><p className="control-note">Your original Dress the Threads selection stays intact. Pick what each parent's material MUTATES INTO, then choose how the transformation travels through the actual moving threads. Silk can turn opaline, gelatin can sprout luminous mycelium, and every combination still uses the real fiber shading. Off by default.</p></details>
        <Select label="Transformation law" value={s.filamentMorphMode}
          onChange={mode=>history.change(x=>({...x,filamentMorphMode:mode,
            filamentAmount:mode==="Off"?x.filamentAmount:Math.max(72,x.filamentAmount),
            filamentMorphAmount:mode==="Off"?x.filamentMorphAmount:Math.max(80,x.filamentMorphAmount)}))}>
          {filamentMorphFamilies.map(family=><optgroup key={family.name} label={family.name}>
            {family.modes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
          </optgroup>)}
        </Select>
        <p className="control-note">{filamentMorphDescriptions[s.filamentMorphMode]}</p>
        <Select label="First parent transforms into" value={s.filamentMorphTarget}
          onChange={target=>history.change(x=>({...x,filamentMorphTarget:target,
            filamentAmount:Math.max(72,x.filamentAmount)}))}>
          {filamentMaterials.map(name=><option key={name} value={name}>{name}</option>)}
        </Select>
        <Select label="Second parent transforms into" value={s.filamentSecondMorphTarget}
          onChange={target=>history.change(x=>({...x,filamentSecondMorphTarget:target,
            filamentAmount:Math.max(72,x.filamentAmount)}))}>
          {filamentMaterials.map(name=><option key={name} value={name}>{name}</option>)}
        </Select>
        <Parameter label="Material transformation strength" name="filamentMorphAmount" history={history}/>
        <Parameter label="Transformation patch scale" name="filamentMorphScale" history={history}/>
        <Parameter label="Transformation speed" name="filamentMorphSpeed" history={history}/>
        <Parameter label="Seam sharpness / diffusion" name="filamentMorphSharpness" history={history}/>
        <Parameter label="Transformation frontier glow" name="filamentMorphGlow" history={history}/>
        <Select label="Metamorphosis preset" value={morphPreset} onChange={setMorphPreset}>
          {filamentMorphPresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
        </Select>
        <div className="pane-actions">
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>applyFilamentMorphPreset(x,morphPreset))}>
            Metamorphose threads
          </button>
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>remixFilamentMorph(x))}>
            <Dices size={13}/> Shuffle transformations
          </button>
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>remixFilamentMorph(x,Math.random,true))}>
            <Shuffle size={13}/> Shuffle fungal & impossible
          </button>
          <button type="button" className="button secondary"
            disabled={s.filamentMorphAmount===0}
            onClick={()=>history.change(x=>({...x,filamentMorphAmount:0}))}>
            Stop morphing — keep fabric
          </button>
        </div>
        <p className="control-note">Separate from stitch motion, geometric weaving, jewelry, color and lettering. Crossbred parents can transform toward completely different materials. The same deterministic shader is used for the artwork preview and MP4/GIF/PNG exports.</p>
      </details>
      <details data-effect-detail="filament-contagion" className="filament-crossbreeder filament-contagion-lab">
        <summary>🦠 CONTAGION LOOM — MAKE YOUR THREADS INFECT EACH OTHER</summary>
        <details className="effect-explanation"><summary>How it works</summary><p className="control-note">Stitch-local waves carry material changes down the active threads. In a two-parent crossbreed, actual overlapping stitched cores provide a real first-to-second contact signal. The moving waves are deterministic, not an accumulating GPU simulation, so your exports use the exact same math.</p></details>
        <Select label="Transmission behavior" value={s.filamentContagionMode}
          onChange={mode=>history.change(x=>({...x,filamentContagionMode:mode,
            filamentAmount:mode==="Off"?x.filamentAmount:Math.max(70,x.filamentAmount),
            filamentMorphMode:mode==="Off"?x.filamentMorphMode:
              x.filamentMorphMode==="Off"?"Seam sweep":x.filamentMorphMode,
            // If someone already dressed a thread in the target material,
            // picking a transmission law must still create a visible change.
            filamentMorphTarget:mode==="Off"||x.filamentMorphTarget!==x.filamentMaterial?
              x.filamentMorphTarget:filamentMaterials.find(m=>m!=="Original thread"&&m!==x.filamentMaterial),
            filamentSecondMorphTarget:mode==="Off"||x.filamentSecondMorphTarget!==x.filamentSecondMaterial?
              x.filamentSecondMorphTarget:filamentMaterials.find(m=>m!=="Original thread"&&m!==x.filamentSecondMaterial),
            filamentMorphAmount:mode==="Off"?x.filamentMorphAmount:Math.max(82,x.filamentMorphAmount),
            filamentContagionAmount:mode==="Off"?x.filamentContagionAmount:
              Math.max(82,x.filamentContagionAmount)}))}>
          {filamentContagionFamilies.map(family=><optgroup key={family.name} label={family.name}>
            {family.modes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
          </optgroup>)}
        </Select>
        <p className="control-note">{filamentContagionDescriptions[s.filamentContagionMode]}</p>
        <Parameter label="Transmission intensity" name="filamentContagionAmount" history={history}/>
        <Parameter label="Neighbor reach / contact handoff" name="filamentContagionReach" history={history}/>
        <Parameter label="Propagation velocity" name="filamentContagionSpeed" history={history}/>
        <Parameter label="Recipient response lag" name="filamentContagionLag" history={history}/>
        <Parameter label="Infection boundary glow" name="filamentContagionGlow" history={history}/>
        <Select label="Contagion recipe" value={contagionPreset} onChange={setContagionPreset}>
          {filamentContagionPresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
        </Select>
        <div className="pane-actions">
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>applyFilamentContagionPreset(x,contagionPreset))}>
            Infect the loom
          </button>
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>remixFilamentContagion(x))}>
            <Dices size={13}/> Shuffle contagions
          </button>
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>remixFilamentContagion(x,Math.random,true))}>
            <Shuffle size={13}/> Shuffle cursed infections
          </button>
          <button type="button" className="button secondary"
            disabled={s.filamentContagionAmount===0}
            onClick={()=>history.change(x=>({...x,filamentContagionAmount:0}))}>
            Quarantine — keep transformed threads
          </button>
        </div>
        <details className="effect-explanation"><summary>How it works</summary><p className="control-note">Uses the two morph targets from Thread Metamorphosis, so no original fiber dressing or colors get overwritten. Crossbreed two thread species to see transfer at real stitched intersections. Effect defaults off; strict PNG/GIF/MP4 exporting never removes it silently.</p></details>
      </details>
      <details data-effect-detail="filament-neural" className="filament-crossbreeder filament-neural-lab">
        <summary>🧠 NEURAL LOOM — A NERVOUS SYSTEM FOR YOUR FABRIC</summary>
        <details className="effect-explanation"><summary>How it works</summary><p className="control-note">Thread-local electrical pulses now travel down genuine moving stitches, react to nearby colors, slightly twitch the thread geometry and pass synaptic signals between the two hybrid parents only at real stitched intersections. Independent from Metamorphosis, Contagion and thread dressing. Choose a neural behavior or try a one-tap preset.</p></details>
        <Select label="Nervous-system behavior" value={s.filamentNeuralMode}
          onChange={mode=>history.change(x=>({...x,filamentNeuralMode:mode,
            filamentNeuralAmount:mode==="Off"?x.filamentNeuralAmount:Math.max(78,x.filamentNeuralAmount),
            filamentAmount:mode==="Off"?x.filamentAmount:Math.max(70,x.filamentAmount)}))}>
          {filamentNeuralFamilies.map(family=><optgroup key={family.name} label={family.name}>
            {family.modes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
          </optgroup>)}
        </Select>
        <p className="control-note">{filamentNeuralDescriptions[s.filamentNeuralMode]}</p>
        <Parameter label="Nerve signal intensity" name="filamentNeuralAmount" history={history}/>
        <Parameter label="Impulse travel speed" name="filamentNeuralSpeed" history={history}/>
        <Parameter label="Synaptic coupling / thread synchrony" name="filamentNeuralCoupling" history={history}/>
        <Parameter label="Color sensitivity threshold" name="filamentNeuralThreshold" history={history}/>
        <Parameter label="Electrical highlight / glow" name="filamentNeuralGlow" history={history}/>
        <Select label="Nervous system recipe" value={neuralPreset} onChange={setNeuralPreset}>
          {filamentNeuralPresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
        </Select>
        <div className="pane-actions">
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>applyFilamentNeuralPreset(x,neuralPreset))}>
            Electrify the threads
          </button>
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>remixFilamentNeural(x))}>
            <Dices size={13}/> Shuffle nervous systems
          </button>
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>remixFilamentNeural(x,Math.random,true))}>
            <Shuffle size={13}/> Shuffle feral synapses
          </button>
          <button type="button" className="button secondary"
            disabled={s.filamentNeuralAmount<=0}
            onClick={()=>history.change(x=>({...x,filamentNeuralAmount:0}))}>
            Sedate the weave — keep everything else
          </button>
        </div>
        <details className="effect-explanation"><summary>How it works</summary><p className="control-note">Crossbreed two thread species to see synaptic handshakes at their overlaps. Other laws also work on a single thread family. Pulse behavior is mathematical, not a self-learning biological brain; no new simulation buffers or separate video clock. Preview, GIF and MP4 use the same shader and strict-effects checks.</p></details>
      </details>
      <details data-effect-detail="filament-plasticity" className="filament-crossbreeder filament-plasticity-lab">
        <summary>🧠 SYNAPTIC PLASTICITY — TEACH THE THREADS NEW TRICKS</summary>
        <details className="effect-explanation"><summary>How it works</summary><p className="control-note">Build on Neural Loom: amplify coincident pulses, create inhibitory dark bands, echo a nerve signal, entrain clusters, prune weak connections, or let the whole weave dream. This is mathematical, time-based adaptation—not a permanent AI brain or stored learning. Real crossed thread masks affect synaptic coupling.</p></details>
        <Select label="Synaptic behavior" value={s.filamentPlasticMode}
          onChange={mode=>history.change(x=>({...x,filamentPlasticMode:mode,
            filamentAmount:mode==="Off"?x.filamentAmount:Math.max(70,x.filamentAmount),
            filamentNeuralMode:mode==="Off"?x.filamentNeuralMode:
              x.filamentNeuralMode==="Off"?"Axon train":x.filamentNeuralMode,
            filamentNeuralAmount:mode==="Off"?x.filamentNeuralAmount:
              Math.max(80,x.filamentNeuralAmount),
            filamentPlasticAmount:mode==="Off"?x.filamentPlasticAmount:
              Math.max(80,x.filamentPlasticAmount)}))}>
          {filamentPlasticFamilies.map(family=><optgroup key={family.name} label={family.name}>
            {family.modes.map(name=><option key={name} value={name}>{name}</option>)}
          </optgroup>)}
        </Select>
        <p className="control-note">{filamentPlasticDescriptions[s.filamentPlasticMode]}</p>
        <Parameter label="Synaptic adaptation strength" name="filamentPlasticAmount" history={history}/>
        <Parameter label="Adaptation rhythm" name="filamentPlasticRate" history={history}/>
        <Parameter label="Inhibition / damping" name="filamentPlasticInhibition" history={history}/>
        <Parameter label="Echo persistence / phase span" name="filamentPlasticRetention" history={history}/>
        <Parameter label="Changing synapse glow" name="filamentPlasticGlow" history={history}/>
        <Select label="Plasticity recipe" value={plasticPreset} onChange={setPlasticPreset}>
          {filamentPlasticPresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
        </Select>
        <div className="pane-actions">
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>applyFilamentPlasticPreset(x,plasticPreset))}>
            Sculpt synapses
          </button>
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>remixFilamentPlastic(x))}>
            <Dices size={13}/> Shuffle plasticity
          </button>
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>remixFilamentPlastic(x,Math.random,true))}>
            <Shuffle size={13}/> Shuffle strange synapses
          </button>
          <button type="button" className="button secondary"
            disabled={s.filamentPlasticAmount<=0}
            onClick={()=>history.change(x=>({...x,filamentPlasticAmount:0}))}>
            Quiet synapses — keep the nerves
          </button>
        </div>
        <p className="control-note">Choose a Neural Loom behavior first or use one of these presets to turn it on. Your materials, lettering, geometry, color palettes, and ornaments remain untouched. Plasticity defaults off in existing recipes, and strict MP4/GIF uses this same animated shader.</p>
      </details>
      <details data-effect-detail="filament-scars" className="filament-crossbreeder filament-ghost-scar-lab">
        <summary>👻 GHOST SCARS — LET THE ELECTRIC THREADS LEAVE MARKS</summary>
        <details className="effect-explanation"><summary>How it works</summary><p className="control-note">Six nerve-activated scars live ON the woven filaments: phosphor aftertraces, branching burns, repaired gilded sutures, spectral bruises, tiny knot fossils, and ghostly mycelial marks. They follow the same neural signal and color palette as your fabric. These are deterministic old-pulse illusions, not extra GPU frame-memory textures.</p></details>
        <Select label="Scar morphology" value={s.filamentScarMode}
          onChange={mode=>history.change(x=>({...x,filamentScarMode:mode,
            filamentAmount:mode==="Off"?x.filamentAmount:Math.max(72,x.filamentAmount),
            filamentNeuralMode:mode==="Off"?x.filamentNeuralMode:
              x.filamentNeuralMode==="Off"?"Axon train":x.filamentNeuralMode,
            filamentNeuralAmount:mode==="Off"?x.filamentNeuralAmount:
              Math.max(82,x.filamentNeuralAmount),
            filamentScarAmount:mode==="Off"?x.filamentScarAmount:
              Math.max(82,x.filamentScarAmount)}))}>
          {filamentScarFamilies.map(family=><optgroup key={family.name} label={family.name}>
            {family.modes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
          </optgroup>)}
        </Select>
        <p className="control-note">{filamentScarDescriptions[s.filamentScarMode]}</p>
        <Parameter label="Ghost scar intensity" name="filamentScarAmount" history={history}/>
        <Parameter label="Scar spacing and pattern density" name="filamentScarDensity" history={history}/>
        <Parameter label="Apparent aftertrace lifetime" name="filamentScarPersistence" history={history}/>
        <Parameter label="Fracture roughness" name="filamentScarRoughness" history={history}/>
        <Parameter label="Scar phosphor glow" name="filamentScarGlow" history={history}/>
        <Select label="Scar recipe" value={scarPreset} onChange={setScarPreset}>
          {filamentScarPresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
        </Select>
        <div className="pane-actions">
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>applyFilamentScarPreset(x,scarPreset))}>
            Scar the threads
          </button>
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>remixFilamentScars(x))}>
            <Dices size={13}/> Shuffle scar tissue
          </button>
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>remixFilamentScars(x,Math.random,true))}>
            <Shuffle size={13}/> Shuffle haunted scars
          </button>
          <button type="button" className="button secondary"
            disabled={s.filamentScarAmount<=0}
            onClick={()=>history.change(x=>({...x,filamentScarAmount:0}))}>
            Heal all scars — keep nerves
          </button>
        </div>
        <p className="control-note">Old recipes stay scar-free until you opt in. Keep dressing, stitches, geometry, crossbreeding, lettering and palette exactly as they are. Scars render with the same strict-effects shader as GIF/MP4. For hardware-heavy recipes, test a short MP4 first.</p>
      </details>
      <details data-effect-detail="filament-regeneration" className="filament-crossbreeder filament-regeneration-lab">
        <summary>🌱 REGENERATION LOOM — GROW NEW THREADS FROM THE SCARS</summary>
        <details className="effect-explanation"><summary>How it works</summary><p className="control-note">Twelve actual daughter-thread geometries: classic darning ladders and Sashiko repairs, coral branches that reconnect, axolotl frills, vesicle loops, and impossible grafts alongside the original six. New fibers are constructed before palette, material, and nerve shading. Growth now advances forward and softly fades before repeating: no abrupt vanishing frames and no extra GPU history.</p></details>
        <Select label="Regrowth anatomy" value={s.filamentRegenMode}
          onChange={mode=>history.change(x=>({...x,filamentRegenMode:mode,
            filamentAmount:mode==="Off"?x.filamentAmount:Math.max(72,x.filamentAmount),
            filamentNeuralMode:mode==="Off"?x.filamentNeuralMode:
              x.filamentNeuralMode==="Off"?"Axon train":x.filamentNeuralMode,
            filamentNeuralAmount:mode==="Off"?x.filamentNeuralAmount:
              Math.max(82,x.filamentNeuralAmount),
            filamentScarMode:mode==="Off"?x.filamentScarMode:
              x.filamentScarMode==="Off"?"Phosphor aftertrace":x.filamentScarMode,
            filamentScarAmount:mode==="Off"?x.filamentScarAmount:
              Math.max(65,x.filamentScarAmount),
            filamentRegenAmount:mode==="Off"?x.filamentRegenAmount:
              Math.max(82,x.filamentRegenAmount)}))}>
          {filamentRegenFamilies.map(group=><optgroup key={group.name} label={group.name}>
            {group.modes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
          </optgroup>)}
        </Select>
        <p className="control-note">{filamentRegenDescriptions[s.filamentRegenMode]}</p>
        <Parameter label="Daughter-thread presence" name="filamentRegenAmount" history={history}/>
        <Parameter label="Branching frequency" name="filamentRegenBranches" history={history}/>
        <Parameter label="Growth and repair cycle speed" name="filamentRegenSpeed" history={history}/>
        <Parameter label="Regrowth reach / repair thickness" name="filamentRegenHealing" history={history}/>
        <Parameter label="Fresh fiber glow" name="filamentRegenGlow" history={history}/>
        <Select label="Regeneration recipe" value={regenPreset} onChange={setRegenPreset}>
          {filamentRegenPresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
        </Select>
        <div className="pane-actions">
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>applyFilamentRegenPreset(x,regenPreset))}>
            Regrow the weave
          </button>
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>remixFilamentRegeneration(x))}>
            <Dices size={13}/> Shuffle regeneration
          </button>
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>remixFilamentRegeneration(x,Math.random,true))}>
            <Shuffle size={13}/> Shuffle alien healing
          </button>
          <button type="button" className="button secondary"
            disabled={s.filamentRegenAmount<=0}
            onClick={()=>history.change(x=>({...x,filamentRegenAmount:0}))}>
            Stop growing — keep scars
          </button>
        </div>
        <p className="control-note">An advancing growth-and-fade cycle, not reversed or permanently accumulated yarn. Existing threads, text, jewelry, materials, sewing and original artwork stay intact. GPU-heavy combinations should be proof-exported at 480px before a long MP4.</p>
      </details>
      <details data-effect-detail="filament-jewelry" className="filament-crossbreeder filament-adornment-lab">
        <summary>💎 THREAD JEWELRY — CHARMS, FRINGE & WEIRD SHIT</summary>
        <p className="control-note">Twenty-two stitch-attached ornaments, from classic pearls to silica cages, diffraction sequins and mathematical glass charms. Each hybrid parent can wear DIFFERENT jewelry over its own material. No random screen-wide stickers.</p>
        <Select label="First parent jewelry" value={s.filamentAdornmentMode}
          onChange={mode=>history.change(x=>({...x,filamentAdornmentMode:mode,
            filamentAdornmentAmount:mode==="Bare threads"?x.filamentAdornmentAmount:
              Math.max(72,x.filamentAdornmentAmount),
            filamentAmount:Math.max(65,x.filamentAmount)}))}>
          {filamentAdornmentFamilies.map(group=><optgroup key={group.name} label={group.name}>
            {group.modes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
          </optgroup>)}
        </Select>
        <p className="control-note">{filamentAdornmentDescriptions[s.filamentAdornmentMode]}</p>
        <Select label="Second parent jewelry (when crossbred)" value={s.filamentSecondAdornmentMode}
          onChange={mode=>history.change(x=>({...x,filamentSecondAdornmentMode:mode,
            filamentAdornmentAmount:mode==="Bare threads"?x.filamentAdornmentAmount:
              Math.max(72,x.filamentAdornmentAmount)}))}>
          {filamentAdornmentFamilies.map(group=><optgroup key={group.name} label={group.name}>
            {group.modes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
          </optgroup>)}
        </Select>
        <Parameter label="Jewelry presence" name="filamentAdornmentAmount" history={history}/>
        <Parameter label="Stations / ornament spacing" name="filamentAdornmentSpacing" history={history}/>
        <Parameter label="Jewelry size / fringe reach" name="filamentAdornmentSize" history={history}/>
        <Parameter label="Living ornaments / movement" name="filamentAdornmentMotion" history={history}/>
        <Parameter label="Jewel shine / phosphor" name="filamentAdornmentGlow" history={history}/>
        <details><summary>Mixed jewelry populations · microscopic charm colonies</summary>
          <p className="control-note">Mix three additional species with the selected ornament on each decorated parent. Deterministic station identities vary shape, size, finish and interior along the carrier. Uniform jewelry restores the original collection. Bare parents remain bare.</p>
          <Select label="Jewelry population" value={s.filamentAdornmentColony} onChange={v=>history.change(x=>({...x,filamentAdornmentColony:v}))}>{jewelryColonyModes.map(v=><option key={v} value={v}>{v}</option>)}</Select>
          <Parameter label="Species diversity" name="filamentAdornmentDiversity" history={history}/>
          <Parameter label="Individual size variation" name="filamentAdornmentSizeVariance" history={history}/>
          <Parameter label="Individual finish variation" name="filamentAdornmentFinishVariance" history={history}/>
          <Parameter label="Individual anatomy variation" name="filamentAdornmentAnatomyVariance" history={history}/>
          <button type="button" className="button secondary" disabled={!s.filamentAmount||!s.filamentAdornmentAmount} onClick={()=>history.change(x=>remixJewelryColony(x))}><Dices size={13}/> Shuffle charm population only</button>
        </details>
        <details><summary>Ornament microarchitecture · engraving & openwork</summary>
          <p className="control-note">Add microscopic patterns inside the current ornaments. Openwork reveals the underlying yarn/art through the ornament layer; it does not erase the yarn or canvas. Both parents share this interior law.</p>
          <Select label="Ornament interior" value={s.filamentAdornmentInterior} onChange={v=>history.change(x=>({...x,filamentAdornmentInterior:v}))}>{jewelryInteriorModes.map(v=><option key={v} value={v}>{v}</option>)}</Select>
          <Parameter label="Interior pattern influence" name="filamentAdornmentInteriorAmount" history={history}/>
          <Parameter label="Microscopic pattern density" name="filamentAdornmentInteriorDensity" history={history}/>
          <Parameter label="Openwork / perforation depth" name="filamentAdornmentInteriorOpenwork" history={history}/>
          <Parameter label="Internal pattern drift" name="filamentAdornmentInteriorDrift" history={history}/>
          <button type="button" className="button secondary" disabled={!s.filamentAmount||!s.filamentAdornmentAmount} onClick={()=>history.change(x=>remixJewelryInterior(x))}><Dices size={13}/> Shuffle ornament interior only</button>
        </details>
        <details><summary>Ornament material alchemy · optical finishes</summary>
          <p className="control-note">Both parents keep their individual ornament shapes and yarn materials. This independent finish changes only ornament shading and highlights, not the underlying threads.</p>
          <Select label="Jewelry optical finish" value={s.filamentAdornmentFinish} onChange={v=>history.change(x=>({...x,filamentAdornmentFinish:v}))}>{jewelryFinishModes.map(v=><option key={v} value={v}>{v}</option>)}</Select>
          <Parameter label="Finish influence" name="filamentAdornmentFinishAmount" history={history}/>
          <Parameter label="Optical film thickness" name="filamentAdornmentFilm" history={history}/>
          <Parameter label="Microfacet / engraving detail" name="filamentAdornmentFacet" history={history}/>
          <Parameter label="Jewelry polish" name="filamentAdornmentPolish" history={history}/>
          <button type="button" className="button secondary" disabled={!s.filamentAmount||!s.filamentAdornmentAmount} onClick={()=>history.change(x=>remixJewelryFinish(x))}><Dices size={13}/> Shuffle jewelry finish only</button>
        </details>
        <details><summary>Jewelry choreography · placement & movement</summary>
          <p className="control-note">Change how ornaments are distributed and move on the actual thread coordinate field, independently of their shapes. Original modes restore classic placement and motion.</p>
          <Select label="Ornament distribution" value={s.filamentAdornmentPlacement} onChange={v=>history.change(x=>({...x,filamentAdornmentPlacement:v}))}>{jewelryPlacementModes.map(v=><option key={v} value={v}>{v}</option>)}</Select>
          <Parameter label="Ornament population / coverage" name="filamentAdornmentPopulation" history={history}/>
          <Select label="Ornament choreography" value={s.filamentAdornmentKinetics} onChange={v=>history.change(x=>({...x,filamentAdornmentKinetics:v}))}>{jewelryKineticModes.map(v=><option key={v} value={v}>{v}</option>)}</Select>
          <Parameter label="Choreography strength" name="filamentAdornmentRhythm" history={history}/>
          <div className="pane-actions">
            {[["all","Shuffle jewelry choreography"],["placement","Shuffle placement only"],["motion","Shuffle ornament motion only"]].map(([part,label])=><button key={part} type="button" className="button secondary" disabled={!s.filamentAmount||!s.filamentAdornmentAmount} onClick={()=>history.change(x=>remixJewelryChoreography(x,Math.random,part))}><Shuffle size={13}/> {label}</button>)}
          </div>
        </details>
        <Select label="Thread jewelry recipe" value={adornmentPreset} onChange={setAdornmentPreset}>
          {filamentAdornmentPresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
        </Select>
        <div className="pane-actions">
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>applyFilamentAdornmentPreset(x,adornmentPreset))}>
            Adorn the threads
          </button>
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>remixFilamentAdornments(x))}>
            <Shuffle size={13}/> Shuffle all thread jewelry
          </button>
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>remixFilamentAdornments(x,Math.random,true))}>
            <Dices size={13}/> Shuffle cursed jewelry
          </button>
          <button type="button" className="button secondary" onClick={()=>history.change(x=>remixFilamentAdornments(x,Math.random,"mathematical"))}>
            <Dices size={13}/> Shuffle mathematical jewelry
          </button>
          <button type="button" className="button secondary"
            onClick={()=>history.change(x=>remixThreadCouture(x,Math.random,true))}>
            <Dices size={13}/> Full cursed couture
          </button>
          <button type="button" className="button secondary"
            disabled={s.filamentAdornmentAmount<=0}
            onClick={()=>history.change(x=>({...x,filamentAdornmentAmount:0}))}>
            Strip jewelry (keep materials)
          </button>
        </div>
        <p className="control-note">Each ornament follows the current thread’s own geometry, stitch reveal and clock. Choosing bare or presence 0 adds nothing. Jewelry preserves your words, colors, shape, fiber dressing and crossbred parents; PNG, GIF and MP4 use the same shader.</p>
      </details>
      <details data-effect-detail="filament-crossbreed" className="filament-crossbreeder">
        <summary>🧬 CROSSBREED TWO THREAD SPECIES</summary>
        <p className="control-note">A second mathematical lace structure shares the canvas with your first. At crossings the threads can pass over and under each other. This does not change your artwork engine or your words.</p>
        <Select label="Second thread parent" value={s.filamentSecondSpecies}
          onChange={v=>history.change(x=>({...x,
            filamentSecondSpecies:v,filamentCrossbreed:Math.max(60,x.filamentCrossbreed),
            filamentAmount:Math.max(55,x.filamentAmount)}))}>
          {filamentSpeciesFamilies.map(family=><optgroup
            key={family.name} label={family.name}>
            {family.species.map(name=><option key={name} value={name}>{name}</option>)}
          </optgroup>)}
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
      <p className="control-note">Twenty-six animated optical organisms, including eight new candy singularities, spectral spore eclipses and dimensional jellyfish cathedrals. Each runs its own time-dependent geometry.</p>
      <Select label="Optical creature" value={s.photonSpecies}
        onChange={v=>history.change(x=>({...x,photonSpecies:v,
          photonAmount:Math.max(62,x.photonAmount),
          photonMotion:Math.max(32,x.photonMotion)}))}>
        {photonSpeciesFamilies.map(family=><optgroup key={family.name}
          label={family.name}>
          {family.species.map(name=><option key={name} value={name}>{name}</option>)}
        </optgroup>)}
      </Select>
      <p className="control-note">{photonSpeciesDescriptions[s.photonSpecies]}</p>
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
          onClick={()=>history.change(x=>remixPhotonZoo(x))}>
          <Shuffle size={13}/> Shuffle optical creatures
        </button>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>remixPhotonZoo(x,Math.random,true))}>
          <Dices size={13}/> Shuffle new weird optics
        </button>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>remixFunkyPhoton(x))}>
          <Shuffle size={13}/> Shuffle funky cosmic optics
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
    "subpixel-moire": <>
      <p className="control-note">
        Original Shader Vault: two rotating RGB shadowmasks interfere.
        Cross-channel collisions form secondary-color beats rather than
        another screen-grain overlay. From silky CRT to retinal warfare.
      </p>
      <Select label="Subpixel interference species" value={s.spxMode}
        onChange={mode=>history.change(x=>({...x,spxMode:mode,
          spxAmount:Math.max(x.spxAmount,60)}))}>
        {spxModes.map(mode=><option value={mode} key={mode}>{mode}</option>)}
      </Select>
      <div className="preset-row">
        <Select label="Subpixel recipe" value={spxPreset}
          onChange={setSpxPreset}>
          {spxPresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
        </Select>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>applySpxPreset(x,spxPreset))}>
          Apply interference recipe
        </button>
      </div>
      <Parameter label="Subpixel interference presence" name="spxAmount" history={history}/>
      {s.spxAmount>0&&<>
        <Parameter label="Triad grid density" name="spxDensity" history={history}/>
        <Parameter label="Grid frequency mismatch" name="spxMismatch" history={history}/>
        <Parameter label="Cross-grid tilt" name="spxAngle" history={history}/>
        <Parameter label="Slow subpixel drift" name="spxDrift" history={history}/>
        <Parameter label="Geometric screen curvature" name="spxCurvature" history={history}/>
        <Parameter label="Retinal flicker strength" name="spxFlicker" history={history}/>
        <Parameter label="Chromatic cross-product strength" name="spxCross" history={history}/>
        <Parameter label="Screen material relief" name="spxRelief" history={history}/>
        <Parameter label="Palette interference hue" name="spxHue" history={history}/>
        <Parameter label="Color bleed / opacity" name="spxBleed" history={history}/>
        <Parameter label="Pattern variation" name="spxVariation" history={history}/>
      </>}
      <div className="pane-actions">
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>shuffleSpx(x))}>
          <Shuffle size={13}/> Shuffle subpixels
        </button>
        <button type="button" className="button secondary"
          disabled={s.spxAmount<=0} onClick={()=>history.change(hideSpx)}>
          <EyeOff size={13}/> Hide interference
        </button>
      </div>
      <p className="control-note">
        Off on old artwork. PNG/GIF/MP4 and preview use the same material,
        and unsupported GPUs get a visible warning, not a silent export downgrade.
      </p>
    </>,
    "kleinian-dither": <>
      <p className="control-note">
        Living printmaking from Klein geometry: Möbius distortions, circle
        inversions and RGB-offset ordered dithering across up to three
        moving depth planes. From delicate inversion lace to fractured
        spectral cathedrals — with your actual artwork underneath.
      </p>
      <Select label="Inversion print species" value={s.kdMode}
        onChange={mode=>history.change(x=>({...x,kdMode:mode,
          kdAmount:Math.max(x.kdAmount,58)}))}>
        {kdModes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
      </Select>
      <div className="preset-row">
        <Select label="Klein Dither recipe" value={kdPreset}
          onChange={setKdPreset}>
          {kdPresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
        </Select>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>applyKdPreset(x,kdPreset))}>
          Print this geometry
        </button>
      </div>
      <Parameter label="Kleinian print presence" name="kdAmount" history={history}/>
      {s.kdAmount>0&&<>
        <Parameter label="Inversion field scale" name="kdScale" history={history}/>
        <Parameter label="Print depth planes (GPU load)" name="kdLayers" history={history}/>
        <Parameter label="Circle inversion radius" name="kdInversion" history={history}/>
        <Parameter label="Orbit rotation and speed" name="kdSpin" history={history}/>
        <Parameter label="Plane parallax separation" name="kdParallax" history={history}/>
        <Parameter label="Ordered Bayer stipple" name="kdDither" history={history}/>
        <Parameter label="Chromatic ink offset" name="kdChroma" history={history}/>
        <Parameter label="Palette color phase" name="kdHue" history={history}/>
        <Parameter label="Ink coverage" name="kdInk" history={history}/>
        <Parameter label="Luminous inversion edges" name="kdGlow" history={history}/>
        <Parameter label="Geometry response / warp" name="kdWarp" history={history}/>
        <Parameter label="Seeded pattern variation" name="kdVariation" history={history}/>
      </>}
      <div className="pane-actions">
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>shuffleKd(x))}>
          <Shuffle size={13}/> Shuffle inversion printing
        </button>
        <button type="button" className="button secondary"
          disabled={s.kdAmount<=0} onClick={()=>history.change(hideKd)}>
          <EyeOff size={13}/> Hide Klein Dither
        </button>
      </div>
      <p className="control-note">
        Off by default for older art. Shared preview/export renderer;
        unsupported GPU combinations show visible preview fallback and
        strict exports refuse to omit required effects.
      </p>
    </>,
    "curlwave-witchcraft": <>
      <p className="control-note">
        Divergence-free curl currents genuinely advect the underlying
        geometry, while moving wave crests generate thin-film highlights,
        flowing filaments and glints. All pigment comes from your current
        palette, not somebody else's mandatory purple.
      </p>
      <Select label="Living curl species" value={s.vcMode}
        onChange={mode=>history.change(x=>({...x,vcMode:mode,
          vcAmount:Math.max(x.vcAmount,58)}))}>
        {vcModes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
      </Select>
      <div className="preset-row">
        <Select label="Curlwave recipe" value={vcPreset}
          onChange={setVcPreset}>
          {vcPresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
        </Select>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>applyVcPreset(x,vcPreset))}>
          Awaken this current
        </button>
      </div>
      <Parameter label="Curlwave presence" name="vcAmount" history={history}/>
      {s.vcAmount>0&&<>
        <Parameter label="Current scale" name="vcScale" history={history}/>
        <Parameter label="Flow speed" name="vcSpeed" history={history}/>
        <Parameter label="Geometry advection" name="vcAdvection" history={history}/>
        <Parameter label="Curvature crests" name="vcCrest" history={history}/>
        <Parameter label="Thin-film rainbow" name="vcFilm" history={history}/>
        <Parameter label="Flowing star dust" name="vcDust" history={history}/>
        <Parameter label="Bioluminescent glow" name="vcGlow" history={history}/>
        <Parameter label="Palette color phase" name="vcHue" history={history}/>
        <Parameter label="Fluid body depth" name="vcDepth" history={history}/>
        <Parameter label="Current turbulence" name="vcTurbulence" history={history}/>
        <Parameter label="Seeded wave variation" name="vcVariation" history={history}/>
        <Parameter label="Ribbons and filaments" name="vcStrands" history={history}/>
      </>}
      <div className="pane-actions">
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>shuffleVc(x))}>
          <Shuffle size={13}/> Shuffle living currents
        </button>
        <button type="button" className="button secondary"
          disabled={s.vcAmount<=0} onClick={()=>history.change(hideVc)}>
          <EyeOff size={13}/> Hide Curlwave
        </button>
      </div>
      <p className="control-note">
        Off on existing art; one shared preview/export renderer.
        Current motion bends the scene itself, not just a decorative
        video layer. On weak GPUs, preview reports missing effects
        and exact export refuses an incomplete rendering.
      </p>
    </>,
    print: <>
      <Parameter label="Bayer dither" name="dither" history={history} />
      <Parameter label="CMY risograph" name="riso" history={history} />
      <Parameter label="Ink misregistration" name="misregister" history={history} />
    </>,
    "schlieren": <>
      <GlassOpticalLab history={history}/>
      <p className="control-note">
        Real refractive pixel displacement: glass bends your completed
        artwork, including the existing filament dresses, palettes, and
        special effects. No fake RGB-only substitution.
      </p>
      <Select label="Glass structure" value={s.schlierenMode}
        onChange={mode=>history.change(x=>({...x,schlierenMode:mode,
          schlierenAmount:Math.max(x.schlierenAmount,65)}))}>
        {schlierenModes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
      </Select>
      <Parameter label="Glass presence" name="schlierenAmount" history={history}/>
      <Parameter label="Lens scale" name="schlierenScale" history={history}/>
      <Parameter label="Actual pixel refraction" name="schlierenBend" history={history}/>
      <Parameter label="Lens movement" name="schlierenMotion" history={history}/>
      <Parameter label="Spectral dispersion" name="schlierenDispersion" history={history}/>
      <Parameter label="Glass edge lighting" name="schlierenRim" history={history}/>
      <Parameter label="Heat-ripple" name="schlierenRipple" history={history}/>
      <Parameter label="Pattern variation" name="schlierenVariation" history={history}/>
      <Parameter label="Glass coverage" name="schlierenMask" history={history}/>
      <Parameter label="Lens focus" name="schlierenFocus" history={history}/>
      <details className="effect-explanation"><summary>Glass material alchemy</summary>
        <p className="control-note">Change optical material independently of shape, etching or motion. Original glass restores unmodified refraction. Frosted and birefringent materials use extra pixel samples.</p>
        <Select label="Optical material" value={s.schlierenMaterial} onChange={v=>history.change(x=>({...x,schlierenMaterial:v,schlierenAmount:Math.max(x.schlierenAmount,65)}))}>
          {glassMaterialModes.map(v=><option key={v} value={v}>{v}</option>)}
        </Select>
        <Parameter label="Material influence" name="schlierenMaterialAmount" history={history}/>
        <Parameter label="Optical film thickness" name="schlierenFilmThickness" history={history}/>
        <Parameter label="Microscopic surface grain" name="schlierenMicrograin" history={history}/>
        <Parameter label="Surface polish" name="schlierenPolish" history={history}/>
        <button type="button" className="button secondary" disabled={!s.schlierenAmount} onClick={()=>history.change(x=>shuffleMathematicalGlass(x,Math.random,"material"))}><Dices size={13}/> Shuffle glass material only</button>
      </details>
      <details className="effect-explanation"><summary>Mathematical glass · optical architecture</summary>
        <p className="control-note">Eight non-floral optical structures. Interior relief bends real artwork pixels; moving caustic-like contours add spectral light. The original five modes are unchanged.</p>
        <Select label="Interior etching geometry" value={s.schlierenEtching} onChange={v=>history.change(x=>({...x,schlierenEtching:v}))}>
          {glassEtchingModes.map(v=><option key={v} value={v}>{v}</option>)}
        </Select>
        <Select label="Internal optical motion" value={s.schlierenKinetics} onChange={v=>history.change(x=>({...x,schlierenKinetics:v}))}>
          {glassMotionModes.map(v=><option key={v} value={v}>{v}</option>)}
        </Select>
        <Parameter label="Internal refractive relief" name="schlierenStructure" history={history}/>
        <Parameter label="Lattice and etching density" name="schlierenDetail" history={history}/>
        <Parameter label="Moving caustic highlights" name="schlierenCaustics" history={history}/>
        <details><summary>Caustic cartography · focal light networks</summary>
          <p className="control-note">Highlights follow local curvature of the moving mathematical relief. Choose a focusing model, rather than another static overlay. Original highlights disables this layer.</p>
          <Select label="Light transport" value={s.schlierenTransport} onChange={v=>history.change(x=>({...x,schlierenTransport:v}))}>
            {glassTransportModes.map(v=><option key={v} value={v}>{v}</option>)}
          </Select>
          <Parameter label="Focal light intensity" name="schlierenTransportAmount" history={history}/>
          <Parameter label="Optical focusing power" name="schlierenLightFocus" history={history}/>
          <Parameter label="Caustic line sharpness" name="schlierenLightSharpness" history={history}/>
          <Parameter label="Optical shadow depth" name="schlierenOpticalShadow" history={history}/>
          <button type="button" className="button secondary" disabled={!mathematicalGlassModes.includes(s.schlierenMode)||!s.schlierenAmount} onClick={()=>history.change(x=>shuffleMathematicalGlass(x,Math.random,"transport"))}><Dices size={13}/> Shuffle focal light only</button>
        </details>
        <details><summary>Coupled optical fields · second glass layer</summary>
          <p className="control-note">Interfere a second mathematical field with the existing inner relief. Changes the real artwork displacement and moving optical contours. Single field restores the original behavior.</p>
          <Select label="Second optical field" value={s.schlierenCoupling} onChange={v=>history.change(x=>({...x,schlierenCoupling:v}))}>
            {glassCouplingModes.map(v=><option key={v} value={v}>{v}</option>)}
          </Select>
          <Select label="Field interaction" value={s.schlierenCouplingRule} onChange={v=>history.change(x=>({...x,schlierenCouplingRule:v}))}>
            {glassCouplingRules.map(v=><option key={v} value={v}>{v}</option>)}
          </Select>
          <Parameter label="Second field influence" name="schlierenLayerAmount" history={history}/>
          <Parameter label="Relative grating angle (0–180°)" name="schlierenLayerAngle" history={history}/>
          <Parameter label="Relative lattice frequency" name="schlierenLayerRatio" history={history}/>
          <button type="button" className="button secondary" disabled={!mathematicalGlassModes.includes(s.schlierenMode)||!s.schlierenAmount} onClick={()=>history.change(x=>shuffleMathematicalGlass(x,Math.random,"coupling"))}><Dices size={13}/> Shuffle optical coupling only</button>
        </details>
        <div className="pane-actions">
          <button type="button" className="button secondary" onClick={()=>history.change(x=>shuffleMathematicalGlass(x))}><Dices size={13}/> Shuffle mathematical glass</button>
          <button type="button" className="button secondary" onClick={()=>history.change(x=>shuffleMathematicalGlass(x,Math.random,"architecture"))}><Shuffle size={13}/> Shuffle glass architecture only</button>
          <button type="button" className="button secondary" disabled={!mathematicalGlassModes.includes(s.schlierenMode)||!s.schlierenAmount} onClick={()=>history.change(x=>shuffleMathematicalGlass(x,Math.random,"interior"))}><Shuffle size={13}/> Shuffle glass interior only</button>
          <button type="button" className="button secondary" disabled={!mathematicalGlassModes.includes(s.schlierenMode)||!s.schlierenAmount} onClick={()=>history.change(x=>shuffleMathematicalGlass(x,Math.random,"motion"))}><Shuffle size={13}/> Shuffle glass motion only</button>
        </div>
      </details>
      <div className="preset-row">
        <Select label="Glass recipe" value={schlierenPreset}
          onChange={setSchlierenPreset}>
          {[...schlierenPresets,...mathematicalGlassPresets].map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
        </Select>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>applySchlierenPreset(x,schlierenPreset))}>
          Apply refractive glass
        </button>
      </div>
      <div className="pane-actions">
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>shuffleSchlieren(x))}>
          <Shuffle size={13}/> Shuffle refractive glass
        </button>
        <button type="button" className="button secondary"
          disabled={s.schlierenAmount<=0}
          onClick={()=>history.change(hideSchlieren)}>
          <EyeOff size={13}/> Hide glass
        </button>
      </div>
      <p className="control-note">
        Refracts full-effects pixels before visible text overlay.
        Uses the final feedback image when afterimage is on; otherwise
        one reusable GPU target. Strength 0 preserves your old art.
      </p>
    </>,
    "print-injury": <>
      <p className="control-note">Print and spectrum mutations: animated XOR pixel decisions, living caustic print plates, reactive hypercolor injury and spectral frequency combs. Your actual art stays underneath.</p>
      <Select label="Print mutation" value={s.injuryMode}
        onChange={v=>history.change(x=>({...x,injuryMode:v,
          injuryAmount:Math.max(x.injuryAmount,63)}))}>
        {injuryFamilies.map(family=><optgroup key={family.name} label={family.name}>
          {family.modes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
        </optgroup>)}
      </Select>
      {injuryDescriptions[s.injuryMode] ? (
        <p className="control-note">{injuryDescriptions[s.injuryMode]}</p>
      ) : null}
      <Parameter label="Presence" name="injuryAmount" history={history}/>
      <Parameter label="Spatial frequency" name="injuryScale" history={history}/>
      <Parameter label="Motion" name="injuryMotion" history={history}/>
      <Parameter label="Color separation" name="injurySeparation" history={history}/>
      <Parameter label="Dot grain / damage" name="injuryGrain" history={history}/>
      <Parameter label="Neon / white glow" name="injuryGlow" history={history}/>
      <Parameter label="Variation" name="injuryVariation" history={history}/>
      <Switch label="Use my current palette" name="injuryPalette" history={history}/>
      <div className="preset-row">
        <Select label="Instant print mutation" value={injuryPreset}
          onChange={setInjuryPreset}>
          {injuryPresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
        </Select>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>applyInjuryPreset(x,injuryPreset))}>
          Summon print mutation
        </button>
      </div>
      <div className="pane-actions">
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>shuffleInjury(x))}>
          <Shuffle size={13}/> Shuffle print injury
        </button>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>shuffleInjury(x,Math.random,"funky"))}>
          <Dices size={13}/> Shuffle extreme damage
        </button>
        <button type="button" className="button secondary"
          disabled={s.injuryAmount<=0}
          onClick={()=>history.change(hideInjury)}>
          <EyeOff size={13}/> Hide print injury
        </button>
      </div>
      <p className="control-note">Works alongside Color Sorcery with the normal PNG/GIF/MP4 clock. Undo restores previous settings. Presence 0 means untouched old art.</p>
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
    "prismatic-scales": <>
      <p className="control-note">
        Sculpted reptilian / alien plates from your original Prismatic
        Scale Matrix shader: staggered shingle packing, directional
        dome lighting, curved spectral films and holographic grooves.
        This coats the actual underlying artwork; it is not a flat texture.
      </p>
      <Select label="Scale anatomy" value={s.psMode}
        onChange={mode=>history.change(x=>({...x,psMode:mode,
          psAmount:Math.max(x.psAmount,65)}))}>
        {psModes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
      </Select>
      <div className="preset-row">
        <Select label="Scale recipe" value={psPreset} onChange={setPsPreset}>
          {psPresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
        </Select>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>applyPsPreset(x,psPreset))}>
          Grow crystalline scales
        </button>
      </div>
      <Parameter label="Scales presence" name="psAmount" history={history}/>
      {s.psAmount>0&&<>
        <Parameter label="Plate density / scale" name="psScale" history={history}/>
        <Parameter label="Shingle overlap" name="psOverlap" history={history}/>
        <Parameter label="Sculpted dome height" name="psLift" history={history}/>
        <Parameter label="Thin-film iridescence" name="psFilm" history={history}/>
        <details className="effect-explanation">
          <summary>Optical alchemy · advanced</summary>
          <Parameter label="Diffraction grooves" name="psDiffraction" history={history}/>
          <Parameter label="Palette phase / tint" name="psHue" history={history}/>
          <Parameter label="Wet-light specular luster" name="psSheen" history={history}/>
          <Parameter label="Scale edges / seams" name="psEdge" history={history}/>
          <Parameter label="Complex-domain color shifts" name="psDomain" history={history}/>
        </details>
        <details className="effect-explanation">
          <summary>Living surface · advanced</summary>
          <Parameter label="Downward growth flow" name="psMotion" history={history}/>
          <Parameter label="Dorsal bend / scene distortion" name="psWarp" history={history}/>
          <Parameter label="Cell identity variation" name="psVariation" history={history}/>
        </details>
      </>}
      <div className="pane-actions">
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>shufflePs(x))}>
          <Shuffle size={13}/> Shuffle all scales
        </button>
        <button type="button" className="button secondary"
          disabled={s.psAmount<=0} onClick={()=>history.change(hidePs)}>
          <EyeOff size={13}/> Hide scale skin
        </button>
      </div>
      <p className="control-note">
        Original art, geometry, other effects and typography are preserved.
        Full Surprise Me may activate this species; Mutate leaves it asleep
        when off. Preview/PNG/GIF/MP4 use the same shared material shader.
      </p>
    </>,
    micro: <>
      <p className="control-note">Sixteen animated microscopic constructions, from opal dust and bubble silk to creeping mold sequins and alien dandruff. New shapes use distinct real-time shader geometry.</p>
      <Select label="Microscopic species" value={s.microMode}
        onChange={v=>history.change(x=>({...x,microMode:v,
          microAmount:Math.max(68,x.microAmount),
          microMotion:Math.max(40,x.microMotion)}))}>
        {microFamilies.map(family=><optgroup key={family.name} label={family.name}>
          {family.modes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
        </optgroup>)}
      </Select>
      <Parameter label="Presence" name="microAmount" history={history}/>
      <Parameter label="Scale" name="microScale" history={history}/>
      <Parameter label="Motion" name="microMotion" history={history}/>
      <Parameter label="Relief" name="microRelief" history={history}/>
      <Parameter label="Density" name="microDensity" history={history}/>
      <Parameter label="Color shift" name="microHue" history={history}/>
      <Parameter label="Variation" name="microVariation" history={history}/>
      <div className="preset-row">
        <Select label="Instant microtexture" value={microPreset} onChange={setMicroPreset}>
          {microPresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
        </Select>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>applyMicroPreset(x,microPreset))}>
          Spawn microtexture
        </button>
      </div>
      <div className="pane-actions">
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>remixMicro(x))}>
          <Shuffle size={13}/> Shuffle microtextures
        </button>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>remixMicro(x,Math.random,true))}>
          <Dices size={13}/> Shuffle new contaminants
        </button>
        <button type="button" className="button secondary"
          disabled={!s.microAmount}
          onClick={()=>history.change(x=>({...x,microAmount:0}))}>
          <EyeOff size={13}/> Hide microtexture
        </button>
      </div>
      <Reseed label="Reseed texture" onClick={()=>history.change(x=>({...x,microVariation:
        (x.microVariation+23+Math.random()*56)%100}))}/>
    </>,
    substance: <>
      <p className="control-note">Twelve living materials with distinct motion and optics: soft opal, oil membranes, glassy mucus, silica foam and a few deeply questionable candy-tissue experiments.</p>
      <Select label="Living material" value={s.substanceMode}
        onChange={v=>history.change(x=>({...x,substanceMode:v,
          substanceAmount:Math.max(72,x.substanceAmount),
          substanceMotion:Math.max(39,x.substanceMotion)}))}>
        {substanceFamilies.map(family=><optgroup key={family.name} label={family.name}>
          {family.modes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
        </optgroup>)}
      </Select>
      <Parameter label="Strength" name="substanceAmount" history={history}/>
      <Parameter label="Cell scale" name="substanceScale" history={history}/>
      <Parameter label="Motion" name="substanceMotion" history={history}/>
      <Parameter label="Relief" name="substanceRelief" history={history}/>
      <Parameter label="Edge glow" name="substanceEdge" history={history}/>
      <Parameter label="Palette shift" name="substanceHue" history={history}/>
      <Parameter label="Variation" name="substanceVariation" history={history}/>
      <div className="preset-row">
        <Select label="Instant living material" value={substancePreset} onChange={setSubstancePreset}>
          {substancePresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
        </Select>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>applySubstancePreset(x,substancePreset))}>
          Spawn selected material
        </button>
      </div>
      <div className="pane-actions">
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>remixSubstance(x))}>
          <Shuffle size={13}/> Shuffle substances
        </button>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>remixSubstance(x,Math.random,true))}>
          <Dices size={13}/> Shuffle mutant matter
        </button>
        <button type="button" className="button secondary"
          disabled={!s.substanceAmount}
          onClick={()=>history.change(x=>({...x,substanceAmount:0}))}>
          <EyeOff size={13}/> Hide substance
        </button>
      </div>
      <Reseed label="Reseed substance" onClick={()=>history.change(x=>({...x,substanceVariation:
        (x.substanceVariation+19+Math.random()*67)%100}))}/>
    </>,
    alchemy: <>
      <p className="control-note">Four animated color engines from your shader vault. They change the light and pigment on your existing art—not your geometry, palettes or separately composited words.</p>
      <Select label="Color sorcery" value={s.alchemyMode}
        onChange={v=>history.change(x=>({...x,alchemyMode:v,
          alchemyAmount:Math.max(65,x.alchemyAmount)}))}>
        {alchemyFamilies.map(family=><optgroup key={family.name}
          label={family.name}>
          {family.modes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
        </optgroup>)}
      </Select>
      {alchemyDescriptions[s.alchemyMode] ? (
        <p className="control-note">{alchemyDescriptions[s.alchemyMode]}</p>
      ) : null}
      <Parameter label="Presence" name="alchemyAmount" history={history}/>
      <Parameter label="Field scale" name="alchemyScale" history={history}/>
      <Parameter label="Color motion" name="alchemyMotion" history={history}/>
      <Parameter label="Spectral separation" name="alchemySeparation" history={history}/>
      <Parameter label="Softness" name="alchemySoftness" history={history}/>
      <Parameter label="White crown" name="alchemyWhite" history={history}/>
      <Parameter label="Variation" name="alchemyVariation" history={history}/>
      <Switch label="Use my current palette" name="alchemyPalette" history={history}/>
      <div className="preset-row">
        <Select label="Instant color sorcery" value={alchemyPreset}
          onChange={setAlchemyPreset}>
          {alchemyPresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
        </Select>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>applyAlchemyPreset(x,alchemyPreset))}>
          Summon this color
        </button>
      </div>
      <div className="pane-actions">
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>shuffleAlchemy(x))}>
          <Shuffle size={13}/> Shuffle color sorcery
        </button>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>shuffleAlchemy(x,Math.random,"funky"))}>
          <Dices size={13}/> Shuffle funky colors
        </button>
        <button type="button" className="button secondary"
          disabled={s.alchemyAmount<=0}
          onClick={()=>history.change(hideAlchemy)}>
          <EyeOff size={13}/> Hide color sorcery
        </button>
      </div>
      <p className="control-note">All four modes use the normal animation clock and PNG/GIF/MP4 renderer. Presence at 0 is identical to old art. Undo restores the previous effect.</p>
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
      <p className="control-note">Real Gray–Scott chemistry, eight curated growth regimes. These are genuine feed/kill combinations, not imaginary extra solvers. Growth remains continuous along the existing animation timeline.</p>
      <div className="preset-row">
        <Select label="Petri-dish growth recipe" value={bioRotPreset} onChange={setBioRotPreset}>
          {bioRotPresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
        </Select>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>applyBioRotPreset(x,bioRotPreset))}>
          Cultivate selected growth
        </button>
      </div>
      <div className="pane-actions">
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>remixBioRot(x))}>
          <Dices size={13}/> Shuffle the petri dish
        </button>
        <button type="button" className="button secondary"
          disabled={!s.bioAmount}
          onClick={()=>history.change(x=>({...x,bioAmount:0}))}>
          <EyeOff size={13}/> Hide bio overlay
        </button>
      </div>
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
      <p className="control-note">Eighteen animated atmospheric species—radiant fog, ghost architecture, weird wallpaper, mold heaven and abandoned aquarium malls. Independent near/far depth with optional palette-linked motion.</p>
      <Select label="Atmospheric habitat" value={s.backdropMode}
        onChange={v=>history.change(x=>({...x,backdropMode:v,
          backdropAmount:Math.max(55,x.backdropAmount),
          backdropMotion:Math.max(22,x.backdropMotion)}))}>
        {backdropFamilies.map(family=><optgroup key={family.name}
          label={family.name}>
          {family.modes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
        </optgroup>)}
      </Select>
      {backdropDescriptions[s.backdropMode] ? (
        <p className="control-note">{backdropDescriptions[s.backdropMode]}</p>
      ) : null}
      <Parameter label="Presence" name="backdropAmount" history={history} />
      <Parameter label="Parallax depth" name="backdropDepth" history={history} />
      <Parameter label="Density" name="backdropDensity" history={history} />
      <Parameter label="Motion" name="backdropMotion" history={history} />
      <Parameter label="Glow" name="backdropGlow" history={history} />
      <Parameter label="Palette shift" name="backdropHue" history={history} />
      <Parameter label="Variation" name="backdropVariation" history={history} />
      <div className="preset-row">
        <Select label="Instant atmosphere" value={backdropPreset} onChange={setBackdropPreset}>
          {backdropPresets.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}
        </Select>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>applyBackdropPreset(x,backdropPreset))}>
          Spawn this atmosphere
        </button>
      </div>
      <div className="pane-actions">
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>remixBackdrop(x))}>
          <Shuffle size={13}/> Shuffle all backdrops
        </button>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>remixBackdrop(x,Math.random,"new"))}>
          <Dices size={13}/> Shuffle new atmospheres
        </button>
        <button type="button" className="button secondary"
          onClick={()=>history.change(x=>remixBackdrop(x,Math.random,"funky"))}>
          <Shuffle size={13}/> Shuffle paranormal habitats
        </button>
        <button type="button" className="button secondary"
          disabled={s.backdropAmount<=0}
          onClick={()=>history.change(x=>({...x,backdropAmount:0}))}>
          <EyeOff size={13}/> Hide atmosphere
        </button>
      </div>
      <Reseed label="Reseed background" onClick={() => history.change((x) => ({...x,backdropVariation:
        (x.backdropVariation+19+Math.random()*62)%100}))}/>
    </>,
  };
  body["fx-toggles"] = <div className="fx-pills" role="group" aria-label="Quick effect toggles">
    {[["bloom","Bloom"],["posterize","Posterize"],["invert","Invert"]].map(([k,label])=>
      <Pill key={k} label={label} checked={s[k]}
        onChange={()=>history.change(x=>({...x,[k]:!x[k]}))}/>)}
  </div>;
  return <EffectsWorkbench history={history} body={body} quickToggles={body["fx-toggles"]} scope={scope}/>;
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
            <Range label="Individual DNA allele"
              value={Number.isInteger(colony.gene)?colony.gene:50}
              min={0} max={100}
              onStart={history.begin}
              onChange={gene=>history.preview(x=>({...x,
                geneAmount:Math.max(67,x.geneAmount),
                habitatStamps:x.habitatStamps.map(m=>m.id===colony.id
                  ?{...m,gene:Math.round(gene),
                     generation:m.generation??0}:m)}))}
              onEnd={history.end} onCancel={history.cancel}/>
            <button type="button" className="subtle-button full"
              onClick={()=>history.change(x=>mutateSelectedGene(x,colony.id))}>
              <Dna size={13}/> Mutate this colony
            </button>
            <p className="control-note">
              Gen {colony.generation??0}
              {" · "}DNA {Number.isInteger(colony.gene)?colony.gene:"unassigned"}
              {selectionActive(s)?" · Fitness "+Math.round(colonyFitness(s,colony)*100)+"%":""}
              {" · "}Ancestor: {colony.ancestor||"founder"}
              {colony.mate ? " · Second contributor: "+colony.mate : ""}
            </p>
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
