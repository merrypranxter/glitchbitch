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
} from "lucide-react";
import { palettes, parsePalette, paletteName } from "../data";
import { pickDifferentPalette, generateRandomPalette, shuffleColorStops, reverseColorStops } from "../palette-actions";
import { parsePaletteLibrary, paletteLibraryDocument } from "../palette-io";
import { Parameter, Section, Segmented, Switch, Select } from "./Controls";
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
  return (
    <>
      <details open className="effect-explanation"><summary>Chromatic engine</summary>
        <p className="control-note">Change the interpolation mathematics without changing your palette stops.</p>
        <Select label="Color space" value={String(Math.round(state.chromaticSpace??0))} onChange={v=>history.change(s=>({...s,chromaticSpace:Number(v)}))}>{["Original sRGB","Linear light","Oklab","OkLCh","CIELAB (D65)","CIELUV (D65)","LCh(ab)","LCh(uv)","Okhsl","Okhsv","HSLuv","HPLuv","IPT","DIN99","JzAzBz","JzCzhz","ICtCp","CAM16","CAM16-UCS"].map((n,i)=><option key={n} value={String(i)}>{n}</option>)}</Select>
        <button className="button secondary" onClick={()=>history.change(s=>({...s,chromaticSpace:(Math.round(s.chromaticSpace??0)+1+Math.floor(Math.random()*18))%19}))}>Shuffle color space</button>
        {[3,6,7,8,9,10,11,15,17].includes(Math.round(state.chromaticSpace??0))&&<>
          <Select label="Hue route" value={String(Math.round(state.chromaticHuePath??0))} onChange={v=>history.change(s=>({...s,chromaticHuePath:Number(v)}))}>{["Shortest arc","Longest arc","Increasing hue","Decreasing hue"].map((n,i)=><option key={n} value={String(i)}>{n}</option>)}</Select>
          <Select label="Extra hue revolutions per stop" value={String(Math.round(state.chromaticTurns??0))} onChange={v=>history.change(s=>({...s,chromaticTurns:Number(v)}))}>{[0,1,2,3].map(n=><option key={n} value={String(n)}>{n}</option>)}</Select>
          <button className="button secondary" onClick={()=>history.change(s=>({...s,chromaticHuePath:Math.floor(Math.random()*4),chromaticTurns:Math.floor(Math.random()*4)}))}>Shuffle hue route</button>
        </>}
        {(state.chromaticSpace??0)>=2&&<>
          <Select label="Gamut mapping" value={String(Math.round(state.chromaticGamut??0))} onChange={v=>history.change(s=>({...s,chromaticGamut:Number(v)}))}>{["Perceptual reduction (default)","Hard RGB clipping","RGB range compression","Reflective gamut folding"].map((n,i)=><option key={n} value={String(i)}>{n}</option>)}</Select>
          <button className="button secondary" onClick={()=>history.change(s=>({...s,chromaticGamut:(Math.round(s.chromaticGamut??0)+1+Math.floor(Math.random()*3))%4}))}>Shuffle gamut mapping</button>
        </>}
        {(state.chromaticSpace??0)>=17&&<>
          <Parameter label="Adapting luminance (log scale)" name="chromaticAmbient" history={history}/>
          <Parameter label="Background luminance" name="chromaticBackground" history={history}/>
          <Select label="Surround" value={String(Math.round(state.chromaticSurround??0))} onChange={v=>history.change(s=>({...s,chromaticSurround:Number(v)}))}>{["Average","Dim","Dark"].map((n,i)=><option key={n} value={String(i)}>{n}</option>)}</Select>
          <Select label="Illuminant adaptation" value={String(Math.round(state.chromaticAdapt??0))} onChange={v=>history.change(s=>({...s,chromaticAdapt:Number(v)}))}><option value="0">Modeled adaptation</option><option value="1">Full adaptation</option></Select>
          <button className="button secondary" onClick={()=>history.change(s=>({...s,chromaticAmbient:Math.random()*100,chromaticBackground:Math.random()*100,chromaticSurround:Math.floor(Math.random()*3),chromaticAdapt:Number(Math.random()<.5)}))}>Shuffle viewing conditions</button>
        </>}
        {(state.chromaticSpace??0)>=8&&(state.chromaticSpace??0)<=11&&<Parameter label="Saturation ceiling" name="chromaticSatCap" history={history}/>}
      </details>
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
