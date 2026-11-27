import React, { useState } from "react";
import {
  Check,
  Plus,
  Minus,
  ArrowLeftRight,
  Shuffle,
  Dices,
  RotateCw,
  Save,
  Palette,
  Trash2,
  EyeOff,
  Star,
} from "lucide-react";
import { palettes, parsePalette, paletteName } from "../data";
import { pickDifferentPalette, generateRandomPalette, shuffleColorStops, reverseColorStops } from "../palette-actions";
import { parsePaletteLibrary, paletteLibraryDocument } from "../palette-io";
import { Parameter, Section, Segmented, Switch, Select, Pill } from "./Controls";
import {alchemyModes,alchemyFamilies,alchemyDescriptions,alchemyPresets,
  applyAlchemyPreset,shuffleAlchemy,hideAlchemy} from "../chromatic-alchemy.js";
import {injuryModes,injuryFamilies,injuryDescriptions,injuryPresets,
  applyInjuryPreset,shuffleInjury,hideInjury} from "../print-spectrum-injury.js";
import {spxModes,spxPresets,applySpxPreset,shuffleSpx,hideSpx}
  from "../subpixel-moire-wave11.js";
import { readFavorites, FAVORITES_KEY } from "../effects-navigation.js";
import { sectionMeta } from "../ui-index.js";
import { illuminantNames } from "../spectral-metamer.js";
import { metamerMotionNames } from "../chromatic-time.js";
import { chromaticGeographyNames } from "../chromatic-geography.js";
import { chromaticSymbiosisNames } from "../chromatic-symbiosis.js";

export function Swatches({ colors }) {
  return (
    <span className="swatches">
      {colors.map((color, i) => (
        <i key={i} style={{ background: color }} />
      ))}
    </span>
  );
}
export default function ColorLab({
  history,
  customPalettes,
  onSavePalette,
  onDeletePalette,
  onImportPaletteLibrary,
}) {
  const state = history.state,
    [selected, setSelected] = useState(0),
    [text, setText] = useState(""),
    [error, setError] = useState(""),
    [name, setName] = useState(""),
    [filter, setFilter] = useState("");
  const pick = (colors) =>
    history.change((s) => ({ ...s, palette: -1, colors }));
  const index = Math.min(selected, state.colors.length - 1);
  function shufflePalette(){
    history.change(s=>{
      const picked=pickDifferentPalette([...palettes,...customPalettes],s.colors);
      if(!picked)return s;
      return {...s,palette:picked.index<palettes.length?picked.index:-1,colors:picked.colors};
    });
  }
  function makeRandomPalette(){
    history.change(s=>({...s,palette:-1,colors:generateRandomPalette()}));
  }
  function shuffleStops(){
    history.change(s=>({...s,palette:-1,colors:shuffleColorStops(s.colors)}));
  }
  function reverseStops(){
    history.change(s=>({...s,palette:-1,colors:reverseColorStops(s.colors)}));
  }
  function importColors(e) {
    e.preventDefault();
    try {
      pick(parsePalette(text));
      setText("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }
  async function importPaletteFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      if(file.size > 2e6)throw Error("Palette file must be under 2 MB.");
      const imported=parsePaletteLibrary(await file.text());
      onImportPaletteLibrary(imported);
      setError("");
    } catch(err) {setError(err.message);}
    finally {e.target.value="";}
  }
  function exportPalettes() {
    const blob=new Blob([JSON.stringify(paletteLibraryDocument([...palettes,...customPalettes]),null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download="glitchbitch-palettes.json";
    document.body.append(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),10000);
  }
  const s=state;
  const [alchemyPreset,setAlchemyPreset]=useState(alchemyPresets[0].name);
  const [injuryPreset,setInjuryPreset]=useState(injuryPresets[0].name);
  const [spxPreset,setSpxPreset]=useState(spxPresets[0].name);
  const [favorites,setFavorites]=useState(()=>{try{return readFavorites(localStorage)}catch{return []}});
  function toggleFavorite(id){
    const selected=favorites.includes(id);
    let previous=favorites;
    try{previous=readFavorites(localStorage)}catch{}
    const next=selected?previous.filter(x=>x!==id):[...new Set([...previous,id])];
    setFavorites(next);
    try{localStorage.setItem(FAVORITES_KEY,JSON.stringify(next))}catch{}
  }
  const body = {
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
    "chromatic-split": <>
      <Parameter label="Chromatic split" name="split" history={history} />
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
    print: <>
      <Parameter label="Bayer dither" name="dither" history={history} />
      <Parameter label="CMY risograph" name="riso" history={history} />
      <Parameter label="Ink misregistration" name="misregister" history={history} />
    </>,
  };
  body["fx-toggles"] = <div className="fx-pills" role="group" aria-label="Quick effect toggles">
    {[["bloom","Bloom"],["posterize","Posterize"],["invert","Invert"]].map(([k,label])=>
      <Pill key={k} label={label} checked={s[k]}
        onChange={()=>history.change(x=>({...x,[k]:!x[k]}))}/>)}
  </div>;

  return (
    <>
      <Section id="chromatic-engine" history={history} defaultOpen>
        <p className="control-note">Change the interpolation mathematics without changing your palette stops.</p>
        <Select label="Color space" value={String(Math.round(state.chromaticSpace??0))} onChange={v=>history.change(s=>({...s,chromaticSpace:Number(v)}))}>{["Original sRGB","Linear light","Oklab","OkLCh","CIELAB (D65)","CIELUV (D65)","LCh(ab)","LCh(uv)","Okhsl","Okhsv","HSLuv","HPLuv","IPT","DIN99","JzAzBz","JzCzhz","ICtCp","CAM16","CAM16-UCS","HCT (Hue Chroma Tone)","Spectral Pigment (Kubelka–Munk)","Spectral Glaze (Optical Density)","Metameric Witchcraft"].map((n,i)=><option key={n} value={String(i)}>{n}</option>)}</Select>
        <button className="button secondary" onClick={()=>history.change(s=>({...s,chromaticSpace:(Math.round(s.chromaticSpace??0)+1+Math.floor(Math.random()*22))%23}))}>Shuffle color space</button>
        {[3,6,7,8,9,10,11,15,17,19].includes(Math.round(state.chromaticSpace??0))&&<>
          <Select label="Hue route" value={String(Math.round(state.chromaticHuePath??0))} onChange={v=>history.change(s=>({...s,chromaticHuePath:Number(v)}))}>{["Shortest arc","Longest arc","Increasing hue","Decreasing hue"].map((n,i)=><option key={n} value={String(i)}>{n}</option>)}</Select>
          <Select label="Extra hue revolutions per stop" value={String(Math.round(state.chromaticTurns??0))} onChange={v=>history.change(s=>({...s,chromaticTurns:Number(v)}))}>{[0,1,2,3].map(n=><option key={n} value={String(n)}>{n}</option>)}</Select>
          <button className="button secondary" onClick={()=>history.change(s=>({...s,chromaticHuePath:Math.floor(Math.random()*4),chromaticTurns:Math.floor(Math.random()*4)}))}>Shuffle hue route</button>
        </>}
        {(state.chromaticSpace??0)>=2&&(state.chromaticSpace??0)!==19&&<>
          <Select label="Gamut mapping" value={String(Math.round(state.chromaticGamut??0))} onChange={v=>history.change(s=>({...s,chromaticGamut:Number(v)}))}>{["Perceptual reduction (default)","Hard RGB clipping","RGB range compression","Reflective gamut folding"].map((n,i)=><option key={n} value={String(i)}>{n}</option>)}</Select>
          <button className="button secondary" onClick={()=>history.change(s=>({...s,chromaticGamut:(Math.round(s.chromaticGamut??0)+1+Math.floor(Math.random()*3))%4}))}>Shuffle gamut mapping</button>
        </>}
        {[17,18].includes(Math.round(state.chromaticSpace??0))&&<>
          <Parameter label="Adapting luminance (log scale)" name="chromaticAmbient" history={history}/>
          <Parameter label="Background luminance" name="chromaticBackground" history={history}/>
          <Select label="Surround" value={String(Math.round(state.chromaticSurround??0))} onChange={v=>history.change(s=>({...s,chromaticSurround:Number(v)}))}>{["Average","Dim","Dark"].map((n,i)=><option key={n} value={String(i)}>{n}</option>)}</Select>
          <Select label="Illuminant adaptation" value={String(Math.round(state.chromaticAdapt??0))} onChange={v=>history.change(s=>({...s,chromaticAdapt:Number(v)}))}><option value="0">Modeled adaptation</option><option value="1">Full adaptation</option></Select>
          <button className="button secondary" onClick={()=>history.change(s=>({...s,chromaticAmbient:Math.random()*100,chromaticBackground:Math.random()*100,chromaticSurround:Math.floor(Math.random()*3),chromaticAdapt:Number(Math.random()<.5)}))}>Shuffle viewing conditions</button>
        </>}
        {[20,21].includes(Math.round(state.chromaticSpace??0))&&<>
          <p className="control-note">38-band reconstructed reflectance. Pigment uses absorption/scattering; glaze uses geometric reflectance (dye-like). Simulated mixtures, not measured paint recipes.</p>
          <Parameter label="Spectral influence" name="chromaticPigmentAmount" history={history}/>
          {Math.round(state.chromaticSpace??0)===20&&<Parameter label="Tint weighting" name="chromaticPigmentWeight" history={history}/>}
          <button className="button secondary" onClick={()=>history.change(s=>({...s,chromaticSpace:Math.round(s.chromaticSpace??0)===20?21:20,chromaticPigmentAmount:35+Math.random()*65,chromaticPigmentWeight:Math.random()*100}))}>Shuffle pigment chemistry</button>
        </>}
        {Math.round(state.chromaticSpace??0)===22&&<>
          <p className="control-note">Hidden spectral variants match under reference daylight but diverge under other light. Choose a lamp to reveal them. Lamps other than daylight are artistic spectral profiles; white balance uses approximate XYZ adaptation.</p>
          <Select label="Spectral illuminant" value={String(Math.round(state.chromaticIlluminant??0))} onChange={v=>history.change(s=>({...s,chromaticIlluminant:Number(v)}))}>{illuminantNames.map((name,i)=><option key={name} value={String(i)}>{name}</option>)}</Select>
          <Parameter label="Hidden spectral contrast" name="chromaticMetaAmount" history={history}/>
          <Parameter label="Metamer bands" name="chromaticMetaBands" history={history}/>
          <Parameter label="Spectral phase" name="chromaticMetaPhase" history={history}/>
          <Parameter label="White balance" name="chromaticMetaAdapt" history={history}/>
          <details className="effect-explanation"><summary>Chromatic Time Travel · animated illumination</summary>
            <Select label="Illumination motion" value={String(Math.round(state.chromaticMetaMotion??0))} onChange={v=>history.change(s=>({...s,chromaticMetaMotion:Number(v)}))}>{metamerMotionNames.map((name,i)=><option key={name} value={String(i)}>{name}</option>)}</Select>
            {(Math.round(state.chromaticMetaMotion??0)>0||Math.round(state.chromaticGeoMode??0)>0||Math.round(state.chromaticSymMode??0)>0)&&<>
              {Math.round(state.chromaticMetaMotion??0)!==2&&<Select label="Second sun" value={String(Math.round(state.chromaticMetaTarget??5))} onChange={v=>history.change(s=>({...s,chromaticMetaTarget:Number(v)}))}>{illuminantNames.map((name,i)=><option key={name} value={String(i)}>{name}</option>)}</Select>}
              <Parameter label="Illumination cycle (color-clock seconds)" name="chromaticMetaPeriod" history={history}/>
              <Parameter label="Illumination time phase" name="chromaticMetaTimePhase" history={history}/>
              <p className="control-note">Lighting repeats after this many color-clock seconds. Color tempo changes real-time duration; Freeze color pauses it. Whole-art export looping still depends on other motion.</p>
            </>}
            <button className="button secondary" onClick={()=>history.change(s=>{const from=Math.floor(Math.random()*6);return {...s,chromaticIlluminant:from,chromaticMetaTarget:(from+1+Math.floor(Math.random()*5))%6,chromaticMetaMotion:1+Math.floor(Math.random()*2),chromaticMetaPeriod:3+Math.floor(Math.random()*13),chromaticMetaTimePhase:Math.random()*100};})}>Shuffle time travel</button>
          </details>
          <details className="effect-explanation"><summary>Chromatic Geography · local spectral territories</summary>
            <p className="control-note">Different regions of the same artwork experience different spectral illumination. Works with Still (two local suns) or animated illumination. Does not move the geometry.</p>
            <Select label="Illumination geography" value={String(Math.round(state.chromaticGeoMode??0))} onChange={v=>history.change(s=>({...s,chromaticGeoMode:Number(v),chromaticGeoAmount:Number(v)>0?Math.max(50,s.chromaticGeoAmount??75):s.chromaticGeoAmount}))}>{chromaticGeographyNames.map((name,i)=><option key={name} value={String(i)}>{name}</option>)}</Select>
            {Math.round(state.chromaticGeoMode??0)>0&&<>
              <Parameter label="Territory contrast" name="chromaticGeoAmount" history={history}/>
              <Parameter label="Territory frequency" name="chromaticGeoScale" history={history}/>
              <Parameter label="Territory angle" name="chromaticGeoAngle" history={history}/>
              <Parameter label="Boundary softness" name="chromaticGeoSoftness" history={history}/>
              <Select label="Front drift cycles per lighting loop" value={String(Math.round(state.chromaticGeoDrift??1))} onChange={v=>history.change(s=>({...s,chromaticGeoDrift:Number(v)}))}>{[0,1,2,3].map(n=><option key={n} value={String(n)}>{n===0?"Stationary":n+" cycles"}</option>)}</Select>
              <p className="control-note">The suns and front drift use the cycle and phase in Chromatic Time Travel. Freeze color pauses the fronts.</p>
            </>}
            <button className="button secondary" onClick={()=>history.change(s=>({...s,chromaticGeoMode:1+Math.floor(Math.random()*5),chromaticGeoAmount:65+Math.random()*35,chromaticGeoScale:1+Math.floor(Math.random()*12),chromaticGeoAngle:Math.random()*360,chromaticGeoSoftness:12+Math.random()*88,chromaticGeoDrift:1+Math.floor(Math.random()*3)}))}>Shuffle chromatic geography</button>
          </details>
          <details className="effect-explanation"><summary>Chromatic Symbiosis · structural pigment</summary>
            <p className="control-note">The primary mathematical field assigns local spectral lighting before other color effects. Works with geography or alone. Gradient modes use hardware derivatives where available; otherwise they use contour coloring.</p>
            <Select label="Structural illumination" value={String(Math.round(state.chromaticSymMode??0))} onChange={v=>history.change(s=>({...s,chromaticSymMode:Number(v),chromaticSymAmount:Number(v)>0?Math.max(50,s.chromaticSymAmount??80):s.chromaticSymAmount}))}>{chromaticSymbiosisNames.map((name,i)=><option key={name} value={String(i)}>{name}</option>)}</Select>
            {Math.round(state.chromaticSymMode??0)>0&&<>
              <Parameter label="Structural pigment influence" name="chromaticSymAmount" history={history}/>
              <Parameter label="Structural frequency" name="chromaticSymFrequency" history={history}/>
              <Parameter label="Gradient sensitivity" name="chromaticSymSensitivity" history={history}/>
              <Parameter label="Structural boundary softness" name="chromaticSymSoftness" history={history}/>
              <Select label="Structural drift cycles" value={String(Math.round(state.chromaticSymDrift??1))} onChange={v=>history.change(s=>({...s,chromaticSymDrift:Number(v)}))}>{[0,1,2,3].map(n=><option key={n} value={String(n)}>{n===0?"Stationary":n+" cycles"}</option>)}</Select>
            </>}
            <button className="button secondary" onClick={()=>history.change(s=>({...s,chromaticSymMode:1+Math.floor(Math.random()*5),chromaticSymAmount:65+Math.random()*35,chromaticSymFrequency:1+Math.floor(Math.random()*16),chromaticSymSensitivity:15+Math.random()*85,chromaticSymSoftness:10+Math.random()*90,chromaticSymDrift:Math.floor(Math.random()*4)}))}>Shuffle chromatic symbiosis</button>
          </details>
          <button className="button secondary" onClick={()=>history.change(s=>({...s,chromaticIlluminant:1+Math.floor(Math.random()*5),chromaticMetaAmount:65+Math.random()*35,chromaticMetaBands:1+Math.floor(Math.random()*8),chromaticMetaPhase:Math.random()*100,chromaticMetaAdapt:35+Math.random()*65}))}>Shuffle hidden spectra</button>
        </>}
        {Math.round(state.chromaticSpace??0)===19&&<p className="control-note">HCT follows CAM16 hue and chroma while preserving interpolated CIELAB tone. It uses its own sRGB chroma-reduction solver.</p>}
        {(state.chromaticSpace??0)>=8&&(state.chromaticSpace??0)<=11&&<Parameter label="Saturation ceiling" name="chromaticSatCap" history={history}/>}
      </Section>
      <p className="control-note">Color effects &amp; print sorcery · all in one place. Open a panel to edit, shuffle or reset it.</p>
      {["alchemy","foil","chromatic-split","fx-toggles","subpixel-moire","print-injury","print"].map(id=><Section key={id} id={id} history={history}
        aside={<button type="button" className="effect-star" aria-label={(favorites.includes(id)?"Unfavorite ":"Favorite ")+sectionMeta(id).title}
          aria-pressed={favorites.includes(id)} onClick={()=>toggleFavorite(id)}><Star size={15} fill={favorites.includes(id)?"currentColor":"none"}/></button>}>
        {body[id]}
      </Section>)}
      <Section
        id="palettes"
        defaultOpen
        aside={<span className="section-count">{palettes.length + customPalettes.length}</span>}
      >
        <div className="palette-action-grid" role="group" aria-label="Palette discovery">
          <button className="button secondary" type="button" onClick={shufflePalette}
            title="Pick a different palette from the full vault and your saved palettes">
            <Shuffle size={15}/> Shuffle palette
          </button>
          <button className="button secondary" type="button" onClick={makeRandomPalette}
            title="Invent a fresh editable palette with four to eight color stops">
            <Dices size={15}/> Random palette
          </button>
        </div>
        <input
          type="search"
          className="search-input"
          aria-label="Find a palette"
          placeholder="Find your kind of loud…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <div className="palette-list">
          {[...palettes, ...customPalettes]
            .map((p, i) => ({ ...p, index: i }))
            .filter((p) => p.name.toLowerCase().includes(filter.toLowerCase()))
            .map((p) => {
              const chosen =
                state.colors.join("").toLowerCase() ===
                p.colors.join("").toLowerCase();
              return (
                <div className="palette-item" key={`${p.name}-${p.index}`}>
                  <button
                    className={"palette-row " + (chosen ? "chosen" : "")}
                    aria-pressed={chosen}
                    onClick={() =>
                      history.change((s) => ({
                        ...s,
                        palette: p.index < palettes.length ? p.index : -1,
                        colors: p.colors,
                      }))
                    }
                  >
                    <Swatches colors={p.colors} />
                    <span>{p.name}</span>
                    {chosen ? <Check size={13} /> : <span className="radio" />}
                  </button>
                  {p.index >= palettes.length && (
                    <button
                      className="delete-palette"
                      title={`Delete palette ${p.name}`}
                      onClick={() => onDeletePalette(p.index - palettes.length)}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              );
            })}
        </div>
        <div className="palette-transfer">
          <button className="button secondary" type="button" onClick={exportPalettes}>
            Export palette library
          </button>
          <label className="button secondary" style={{cursor:"pointer"}}>
            Import palette JSON
            <input type="file" accept=".json,application/json" onChange={importPaletteFile} style={{display:"none"}}/>
          </label>
        </div>
        {error && <p className="field-error" role="alert">{error}</p>}
      </Section>
      <Section
        id="stops"
        defaultOpen
        aside={<span className="section-count">{paletteName(state)}</span>}
      >
        <div className="palette-action-grid" role="group" aria-label="Color stop order">
          <button className="button secondary" type="button" onClick={shuffleStops}
            title="Mix up the order of your current colors without adding or removing stops">
            <Shuffle size={15}/> Shuffle stops
          </button>
          <button className="button secondary" type="button" onClick={reverseStops}
            title="Reverse the current stop order exactly">
            <ArrowLeftRight size={15}/> Reverse stops
          </button>
        </div>
        <div className="color-stops">
          {state.colors.map((c, i) => (
            <button
              key={i}
              className={index === i ? "active" : ""}
              aria-label={`Select color ${i + 1}`}
              aria-pressed={index === i}
              onClick={() => setSelected(i)}
              style={{ "--color": c }}
            >
              <i />
              {i + 1}
            </button>
          ))}
          <button
            className="add-stop"
            title="Add color stop"
            disabled={state.colors.length >= 12}
            onClick={() => {
              pick([...state.colors, "#d6ff62"]);
              setSelected(state.colors.length);
            }}
          >
            <Plus size={14} />
          </button>
        </div>
        <div className="color-edit">
          <input
            type="color"
            aria-label={`Edit color ${index + 1}`}
            value={state.colors[index]}
            onFocus={history.begin}
            onChange={(e) =>
              history.preview((s) => ({
                ...s,
                palette: -1,
                colors: s.colors.map((c, i) =>
                  i === index ? e.target.value : c,
                ),
              }))
            }
            onBlur={history.end}
          />
          <span>{state.colors[index].toUpperCase()}</span>
          <button
            title="Remove selected color"
            disabled={state.colors.length <= 2}
            onClick={() => pick(state.colors.filter((_, i) => i !== index))}
          >
            <Minus size={15} />
          </button>
          <button
            title="Rotate palette stops"
            onClick={() => pick([...state.colors.slice(1), state.colors[0]])}
          >
            <RotateCw size={15} />
          </button>
        </div>
        <form
          className="palette-save"
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim()) {
              onSavePalette({
                name: name.trim().slice(0, 40),
                colors: state.colors,
              });
              setName("");
            }
          }}
        >
          <input
            aria-label="Custom palette name"
            maxLength="40"
            placeholder="Name this palette…"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button title="Save custom palette" disabled={!name.trim()}>
            <Save size={15} />
          </button>
        </form>
        <details className="palette-import">
          <summary>
            <Palette size={13} /> Paste a palette
          </summary>
          <form onSubmit={importColors}>
            <textarea
              aria-label="Palette hex colors"
              placeholder="#ff32b8 #e6ff45 #65ffd2… up to 12 stops, or a Coolors URL"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            {error && (
              <p className="field-error" role="alert">
                {error}
              </p>
            )}
            <button className="button secondary" type="submit">
              Apply colors
            </button>
          </form>
        </details>
      </Section>
      <Section id="rhythm" history={history}>
        <Segmented
          label="Rhythm"
          value={state.colorMode}
          options={[["Traveling wave", "Wave"], ["Color canon", "Canon"], ["Phase vortex", "Vortex"]]}
          onChange={(v) => history.change((s) => ({ ...s, colorMode: v }))}
        />
        <p className="control-note">
          {state.colorMode === "Color canon"
            ? "Three harmonic voices in a 1:2:3 rhythm."
            : state.colorMode === "Phase vortex"
              ? "Color winds around the center as a spiraling phase field."
              : "Color fronts travel across the artwork, independently of the geometry."}
        </p>
        <Parameter label="Rhythm amount" name="colorAmount" history={history} />
        <Parameter
          label="Color tempo"
          name="colorSpeed"
          history={history}
          format={(v) => `${(v / 30).toFixed(1)}×`}
        />
        <Parameter
          label="Palette offset"
          name="colorOffset"
          history={history}
        />
        <Parameter
          label="Color repetition"
          name="colorRepeat"
          history={history}
        />
        <Switch
          label="Freeze color clock"
          name="freezeColor"
          history={history}
        />
      </Section>
      <Section id="grade" history={history}>
        <Parameter label="Saturation" name="saturation" history={history} />
        <Parameter label="Contrast" name="contrast" history={history} />
        <Parameter label="Brightness" name="brightness" history={history} />
      </Section>
    </>
  );
}
