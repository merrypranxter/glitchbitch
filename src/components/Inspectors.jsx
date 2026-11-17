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
} from "lucide-react";
import { engineInfo, engines, touchModes, makeMark, motionModes, tunnelModes, letteringStyles, compositionModes, backdropModes, microModes, substanceModes, wiggleModes } from "../data";
import { Parameter, Range, Switch, Select, Section } from "./Controls";
import { letteringBlendGroups, letteringBlendModes } from "../lettering-blends.js";
import { letteringMotionGroups } from "../lettering-motion.js";
import { textFormatTools, toggleTextFormat, rebaseTextFormats, textStyleAt, wordSelection } from "../text-formatting.js";
import { textChoreographyGroups, textChoreographies, applyTextChoreography,
  remixTextChoreography, mutateTextChoreography } from "../text-choreographies.js";
import { retroFonts, retroFontGroups, getRetroFont, ensureRetroFontLoaded } from "../retro-fonts";
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
export function MathInspector({ history, locked, onLock, onLookbook }) {
  const state = history.state;
  const selected = (id) => state.engine === id ||
    (state.blend > 0 && state.secondaryEngine === id);
  return (
    <>
      <Section
        title="THE ENGINE"
        aside={
          <button
            className={"icon-button " + (locked ? "lime" : "")}
            title={
              locked
                ? "Unlock engine for Surprise me"
                : "Lock engine for Surprise me"
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
                <Icon size={16} />
                <span>{e.name}</span>
                {i >= 6 && <i />}
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
          Explore the lookbook{" "}
          <span>
            <ArrowUpRight size={12} />
          </span>
        </button>
      </Section>
      <Section title="SHAPE THE SIGNAL">
        <Parameter label="Complexity" name="complexity" history={history} />
        <Parameter label="Scale" name="scale" history={history} />
        <Parameter label="Domain warp" name="warp" history={history} />
        <Parameter
          label="Rotation"
          name="rotation"
          history={history}
          format={(v) => `${Math.round(v)}°`}
        />
        <Parameter
          label="Kaleidoscope"
          name="symmetry"
          history={history}
          format={(v) => (v < 2 ? "Off" : `${Math.round(v)} folds`)}
        />
        <Switch label="Mirror dimension" name="mirror" history={history} />
      </Section>
      {selected(5) && (
        <Section title="TUNNEL MORPHOLOGY — SEAMLESS" defaultOpen>
          <Select label="360° tunnel species" value={state.tunnelMode}
            onChange={(v)=>history.change(s=>({...s,tunnelMode:v}))}>
            {tunnelModes.map(mode=><option key={mode}>{mode}</option>)}
          </Select>
          <Parameter label="Spiral twist" name="tunnelTwist" history={history}/>
          <Parameter label="Tunnel depth" name="tunnelDepth" history={history}/>
          <Parameter label="Ridges and spiral arms" name="tunnelRidges" history={history}/>
          <Parameter label="Pulse speed" name="tunnelPulse" history={history}/>
          <Parameter label="Central aperture" name="tunnelAperture" history={history}/>
          <Parameter label="Variation" name="tunnelVariation" history={history}/>
          <button type="button" className="button secondary"
            onClick={()=>history.change(s=>({...s,tunnelVariation:
              (s.tunnelVariation+13+Math.random()*71)%100}))}>
            Reshape tunnel only
          </button>
          <p className="control-note">Six different 360-degree structures, including seam-free color spirals. Surprise Me changes all of these; the secondary engine works too.</p>
        </Section>
      )}
      {(selected(12) || selected(13) || selected(14) || selected(15) || selected(16)) && (
        <Section title="IMPOSSIBLE GEOMETRY">
          {selected(12) && <Parameter label="Hyperbolic fold depth" name="hyperbolicFold" history={history} />}
          {selected(13) && (
            <>
              <Parameter label="Fractal deep zoom" name="fractalZoom" history={history} />
              <Parameter label="Mandelbrot ↔ Julia" name="juliaMix" history={history} />
            </>
          )}
          {selected(14) && <Parameter label="Diffraction density" name="quasiDensity" history={history} />}
          {selected(15) && <p className="control-note">This is real two-chemical reaction-diffusion. Change its growth chemistry under Effects → Biological Signal Rot.</p>}
          {selected(16) && <p className="control-note">True 3D signed-distance raymarching and off-axis camera movement. Shape, parallax and material live under Effects → Stereo Ghost Machine.</p>}
          <p className="control-note">These engines can be combined with every original engine, palette, and touch force.</p>
        </Section>
      )}
      <Section title="GEOMETRY IN MOTION">
        <Parameter
          label="Animation speed"
          name="speed"
          history={history}
          format={(v) => `${(v / 30).toFixed(1)}×`}
        />
        <Select
          label="Ambient motion style"
          value={state.motionMode}
          onChange={(v) => history.change((s) => ({...s, motionMode: v}))}
        >
          {motionModes.map((mode) => <option key={mode}>{mode}</option>)}
        </Select>
        <Parameter label="Structure movement" name="motionAmount" history={history} />
        <Parameter label="Motion pace" name="motionRate" history={history} />
        <Parameter label="Living light / shimmer" name="lightMotion" history={history} />
        <p className="control-note">Surprise Me sets all three. Structure motion animates the shape; living light animates the highlights independently, so stable geometry can still feel alive. Pausing stops both.</p>
        <Switch
          label="Freeze geometry clock"
          name="freezeGeometry"
          history={history}
        />
        <p className="control-note">
          Freeze the shape and let the colors keep dancing.
        </p>
      </Section>
    </>
  );
}
function WordStyleToolbar({text,formats,selection,onToggle}){
  const {start,end}=wordSelection(text,selection.current.start,selection.current.end);
  const indices=Array.from({length:Math.max(0,end-start)},(_,i)=>start+i)
    .filter(i=>!/\s/u.test(text[i]||" "));
  return <div className="word-style-toolbar" role="group"
    aria-label="Format highlighted words or the word under your cursor">
    {textFormatTools.map(tool=><button key={tool.key} type="button"
      className="button secondary word-style-button"
      aria-pressed={indices.length>0&&indices.every(i=>Boolean(textStyleAt(formats,i)[tool.key]))}
      title={tool.label+" — selected words only"}
      onClick={()=>onToggle(tool.key)}>
      {tool.key==="bold"?<strong>B</strong>:tool.key==="italic"?<em>I</em>:
       tool.key==="underline"?<span style={{textDecoration:"underline"}}>U</span>:
       tool.key==="strike"?<span style={{textDecoration:"line-through"}}>S</span>:"AA"}
    </button>)}
  </div>;
}
export function TextInspector({ history }) {
  const [fontError,setFontError]=React.useState("");
  const textSelection=React.useRef({start:0,end:0});
  const layerSelections=React.useRef({});
  const remember=(ref,event)=>{ref.current={
    start:event.currentTarget.selectionStart??0,end:event.currentTarget.selectionEnd??0
  };};
  const layerSelection=id=>{
    if(!layerSelections.current[id])layerSelections.current[id]={current:{start:0,end:0}};
    return layerSelections.current[id];
  };
  const [choreographyId,setChoreographyId]=React.useState("opal-orbit");
  const chosenChoreography=textChoreographies.find(p=>p.id===choreographyId);
  const selectedFont=getRetroFont(history.state.letteringFont);
  React.useEffect(()=>{
    if(!history.state.lettering.trim())return;
    let live=true;
    ensureRetroFontLoaded(history.state.letteringFont)
      .then(()=>{if(live)setFontError("");},e=>{if(live)setFontError(e.message);});
    return ()=>{live=false;};
  },[history.state.letteringFont,history.state.lettering]);
  return (
    <>
      <p className="inspector-intro">Your words, your rules. Font closet included.</p>
      <Section title="YOUR WORDS — OPTIONAL QUOTES">
        <label className="select-field kinetic-type-field">
          <span>YOUR QUOTE OR MESSAGE (280 CHARACTERS)</span>
          <textarea rows={4} maxLength={280} autoComplete="off" spellCheck={false}
            onSelect={e=>remember(textSelection,e)}
            onKeyUp={e=>remember(textSelection,e)}
            placeholder={"Type whatever you want.\nLine breaks are welcome."}
            value={history.state.lettering}
            onFocus={history.begin}
            onChange={(e) => history.preview((s) => ({
              ...s, lettering:e.target.value,
              letteringFormats:rebaseTextFormats(s.lettering,e.target.value,s.letteringFormats),
              letteringAmount:e.target.value.trim() ? (s.letteringAmount||46) : 0
            }))}
            onBlur={history.end} />
        </label>
        <WordStyleToolbar text={history.state.lettering}
          formats={history.state.letteringFormats} selection={textSelection}
          onToggle={key=>history.change(s=>({...s,
            letteringFormats:toggleTextFormat(s.lettering,s.letteringFormats,
              textSelection.current.start,textSelection.current.end,key)
          }))}/>
        <p className="control-note">Highlight a word or phrase, then tap B, I, U, S or AA. Without a highlight, the word under your cursor changes. Tap again to remove the style. AA changes appearance without rewriting the original words.</p>
        <Parameter label="Letter spacing (tracking)" name="letteringTracking" history={history}
          format={v=>`${v>0?"+":""}${Math.round(v)}%`}/>
        <Parameter label="Line spacing (leading)" name="letteringLineSpacing" history={history}/>
        <div className="text-engine-status" role="status">
          TEXT ENGINE: DOM v8 · WORD STYLES + SPACING · {history.state.lettering.trim().length} characters ·
          opacity {history.state.letteringAmount ?? 0}%
        </div>
        <button type="button" className="button secondary"
          onClick={() => history.change(s => ({
            ...s, letteringAmount:100, letteringX:50, letteringY:50,
            letteringScale:65, letteringRotation:0,
            letteringStretchX:100, letteringStretchY:100, letteringCurve:0,
            letteringWarp:0, letteringMotion:0,
            letteringFillMode:"Solid", letteringFill:"#ffffff",
            letteringStrokes:[{ color:"#000000", width:6, enabled:true }]
          }))}>
          MAKE WORDS VISIBLE — center + high contrast
        </button>
        <button type="button" className="button secondary"
          onClick={() => history.change((s) => ({...s,lettering:"",letteringAmount:0}))}>
          Remove words from artwork
        </button>
        <Select label="Choose your retro typeface" value={history.state.letteringFont}
          onChange={(value)=>history.change(s=>({...s,letteringFont:value}))}>
          {retroFontGroups.map(group=>
            <optgroup key={group} label={group}>
              {retroFonts.filter(f=>f.group===group)
                .map(font=><option key={font.id} value={font.id}>{font.label}</option>)}
            </optgroup>
          )}
        </Select>
        <div className="retro-type-preview"
          style={{fontFamily:selectedFont.family,fontWeight:selectedFont.weight}}>
          {history.state.lettering.trim().split("\n")[0].slice(0,46) || "YOUR WORDS. YOUR RULES."}
        </div>
        <div className="retro-type-actions">
          <small>{retroFonts.length} fonts · classic, pixel, goth, Y2K, script</small>
          <button type="button" className="button secondary"
            onClick={()=>history.change(s=>{
              const list=retroFonts.filter(f=>f.id!==s.letteringFont);
              return {...s,letteringFont:list[Math.floor(Math.random()*list.length)].id};
            })}>
            Shuffle font (keep your words)
          </button>
        </div>
        {fontError && <p className="field-error" role="alert">Font did not load: {fontError}. Check your connection or choose another font.</p>}
        <Select label="Lettering material" value={history.state.letteringStyle}
          onChange={(v) => history.change((s) => ({ ...s, letteringStyle: v }))}>
          {letteringStyles.map((v) => <option key={v}>{v}</option>)}
        </Select>
        <Section title="TEXT CHOREOGRAPHER — 24 ONE-TAP RECIPES">
          <Select label="Choose a complete text FX choreography" value={choreographyId}
            onChange={setChoreographyId}>
            {textChoreographyGroups.map(group=><optgroup key={group.label} label={group.label}>
              {group.presets.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}
            </optgroup>)}
          </Select>
          <p className="control-note" aria-live="polite">
            {chosenChoreography?.description || "Choose a typography choreography."}
            {" "}Moves: {chosenChoreography?.settings.letteringMotionPath} +
            {" "}{chosenChoreography?.settings.letteringMotionPath2}.
            {" "}Blend: {chosenChoreography?.settings.letteringBlendMode}.
          </p>
          <div className="palette-action-grid text-choreo-grid">
            <button type="button" className="button"
              onClick={()=>history.change(s=>applyTextChoreography(s,choreographyId))}>
              <span>Apply chosen recipe</span>
            </button>
            <button type="button" className="button secondary"
              onClick={()=>history.change(s=>remixTextChoreography(s,"all"))}>
              <span>🎲 Surprise text FX</span>
            </button>
            <button type="button" className="button secondary"
              onClick={()=>history.change(s=>remixTextChoreography(s,"motion"))}>
              <span>Remix movement</span>
            </button>
            <button type="button" className="button secondary"
              onClick={()=>history.change(s=>remixTextChoreography(s,"blend"))}>
              <span>Remix material + blend</span>
            </button>
            <button type="button" className="button secondary"
              onClick={()=>history.change(s=>mutateTextChoreography(s))}>
              <span>🧬 Mutate current recipe</span>
            </button>
          </div>
          <p className="control-note">Every button keeps your exact words, font, gradients, outline rings, text position and artwork. The sliders stay editable, and Undo restores the previous choreography. No Netlify or AI calls needed.</p>
        </Section>
        <Section title="TEXT BLENDING — 44 WAYS TO MISBEHAVE">
          <Select label="Blend text against the artwork" value={history.state.letteringBlendMode ?? "Normal"}
            onChange={v=>history.change(s=>({...s,letteringBlendMode:v}))}>
            {letteringBlendGroups.map(group=><optgroup key={group.label} label={group.label}>
              {group.modes.map(mode=><option key={mode} value={mode}>{mode}</option>)}
            </optgroup>)}
          </Select>
          <Parameter label="Blend intensity (0 = ordinary text, 100 = full effect)"
            name="letteringBlendStrength" history={history}/>
          <button type="button" className="button secondary"
            onClick={()=>history.change(s=>({...s,
              letteringBlendMode:letteringBlendModes[Math.floor(Math.random()*letteringBlendModes.length)],
              letteringBlendStrength:100
            }))}>🎲 Random text blend (keep words & colors)</button>
          <p className="control-note">Standard modes use real browser/canvas compositing. Photoshop-only and invented modes are artistic emulations. Each layer blends separately over the living artwork. Blink modes are intentional flashes.</p>
        </Section>
        <Section title="EXTRA TEXT LAYERS — INDEPENDENT WORDS">
          <p className="control-note">Your original quote is layer one. Add up to two independent layers with their own words, fonts, materials, color, gradients, outlines, placement and animation. New layers stack above the original.</p>
          {history.state.letteringLayers.map((layer,index)=>
            <div key={layer.id} className="retro-type-actions">
              <strong>Text layer {index+2}</strong>
              <label className="select-field"><span>Words</span>
                <textarea rows={2} maxLength={280} value={layer.text}
                  onSelect={e=>remember(layerSelection(layer.id),e)}
                  onKeyUp={e=>remember(layerSelection(layer.id),e)}
                  onChange={e=>history.change(s=>({...s,letteringLayers:s.letteringLayers.map((x,i)=>i===index?{...x,text:e.target.value,letteringFormats:rebaseTextFormats(x.text,e.target.value,x.letteringFormats)}:x)}))}/>
              </label>
              <WordStyleToolbar text={layer.text} formats={layer.letteringFormats}
                selection={layerSelection(layer.id)}
                onToggle={key=>history.change(s=>({...s,
                  letteringLayers:s.letteringLayers.map((x,i)=>i===index?{
                    ...x,letteringFormats:toggleTextFormat(x.text,x.letteringFormats,
                      layerSelection(x.id).current.start,layerSelection(x.id).current.end,key)
                  }:x)
                }))}/>
              <label>Visible <input type="checkbox" checked={layer.visible}
                onChange={e=>history.change(s=>({...s,letteringLayers:s.letteringLayers.map((x,i)=>i===index?{...x,visible:e.target.checked}:x)}))}/></label>
              <Select label="Font" value={layer.letteringFont}
                onChange={v=>history.change(s=>({...s,letteringLayers:s.letteringLayers.map((x,i)=>i===index?{...x,letteringFont:v}:x)}))}>
                {retroFonts.map(f=><option key={f.id} value={f.id}>{f.label}</option>)}
              </Select>
              <Select label="Appearance" value={layer.letteringStyle}
                onChange={v=>history.change(s=>({...s,letteringLayers:s.letteringLayers.map((x,i)=>i===index?{...x,letteringStyle:v}:x)}))}>
                {letteringStyles.map(v=><option key={v}>{v}</option>)}
              </Select>
              <Select label="Letter motion path" value={layer.letteringMotionPath ?? "Classic drift"}
                onChange={v=>history.change(s=>({...s,letteringLayers:s.letteringLayers.map((x,i)=>i===index?{...x,letteringMotionPath:v}:x)}))}>
                {letteringMotionGroups.map(group=><optgroup key={group.label} label={group.label}>
                  {group.paths.map(path=><option key={path}>{path}</option>)}
                </optgroup>)}
              </Select>
              <Select label="Stack a second path" value={layer.letteringMotionPath2 ?? "None"}
                onChange={v=>history.change(s=>({...s,letteringLayers:s.letteringLayers.map((x,i)=>i===index?{...x,letteringMotionPath2:v}:x)}))}>
                <option>None</option>
                {letteringMotionGroups.map(group=><optgroup key={group.label} label={group.label}>
                  {group.paths.map(path=><option key={path}>{path}</option>)}
                </optgroup>)}
              </Select>
              <Select label="Letter motion direction" value={layer.letteringMotionDirection ?? "Forward"}
                onChange={v=>history.change(s=>({...s,letteringLayers:s.letteringLayers.map((x,i)=>i===index?{...x,letteringMotionDirection:v}:x)}))}>
                <option>Forward</option><option>Reverse</option>
              </Select>
              <Select label="Layer blend mode" value={layer.letteringBlendMode ?? "Normal"}
                onChange={v=>history.change(s=>({...s,letteringLayers:s.letteringLayers.map((x,i)=>i===index?{...x,letteringBlendMode:v}:x)}))}>
                {letteringBlendGroups.map(group=><optgroup key={group.label} label={group.label}>
                  {group.modes.map(mode=><option key={mode}>{mode}</option>)}
                </optgroup>)}
              </Select>
              <label className="select-field"><span>Layer blend intensity: {layer.letteringBlendStrength ?? 100}%</span>
                <input type="range" min="0" max="100" step="1" value={layer.letteringBlendStrength ?? 100}
                  onChange={e=>history.change(s=>({...s,letteringLayers:s.letteringLayers.map((x,i)=>i===index?{...x,letteringBlendStrength:Number(e.target.value)}:x)}))}/>
              </label>
              <Select label="Fill" value={layer.letteringFillMode}
                onChange={v=>history.change(s=>({...s,letteringLayers:s.letteringLayers.map((x,i)=>i===index?{...x,letteringFillMode:v}:x)}))}>
                {["Solid","Linear gradient","Radial gradient"].map(v=><option key={v}>{v}</option>)}
              </Select>
              <input type="color" aria-label="Layer fill color" value={layer.letteringFill}
                onChange={e=>history.change(s=>({...s,letteringLayers:s.letteringLayers.map((x,i)=>i===index?{...x,letteringFill:e.target.value}:x)}))}/>
              {layer.letteringFillMode!=="Solid"&&layer.letteringGradient.map((color,j)=>
                <input key={j} type="color" aria-label={"Gradient stop "+(j+1)} value={color}
                  onChange={e=>history.change(s=>({...s,letteringLayers:s.letteringLayers.map((x,i)=>i===index?{...x,letteringGradient:x.letteringGradient.map((c,n)=>n===j?e.target.value:c)}:x)}))}/>)}
              {["letteringX","letteringY","letteringRotation","letteringStretchX","letteringStretchY",
                "letteringCurve","letteringScale","letteringTracking","letteringLineSpacing","letteringAmount","letteringWarp","letteringMotion",
                "letteringMotionStagger","letteringMotionSpeed","letteringMotionMix"].map(key=>{
                const bounds=key==="letteringRotation"?[-180,180]:
                  key==="letteringCurve"?[-100,100]:
                  key==="letteringTracking"?[-20,100]:
                  key==="letteringLineSpacing"?[60,300]:
                  key==="letteringMotionSpeed"?[1,4]:
                  key==="letteringStretchX"||key==="letteringStretchY"?[25,250]:[0,100];
                return <label key={key} className="select-field"><span>{key.replace("lettering","")} {layer[key]}</span>
                  <input type="range" min={bounds[0]} max={bounds[1]} value={layer[key]}
                    onChange={e=>history.change(s=>({...s,letteringLayers:s.letteringLayers.map((x,i)=>i===index?{...x,[key]:Number(e.target.value)}:x)}))}/>
                </label>;
              })}
              <button type="button" className="button secondary"
                onClick={()=>history.change(s=>({...s,
                  letteringLayers:s.letteringLayers.map((x,i)=>i===index
                    ? remixTextChoreography(x,"all"):x)
                }))}>🎲 Surprise FX for this layer</button>
              <button type="button" className="button secondary"
                onClick={()=>history.change(s=>({...s,
                  letteringLayers:s.letteringLayers.map((x,i)=>i===index
                    ? applyTextChoreography(x,choreographyId):x)
                }))}>Apply selected choreography to this layer</button>
              <button type="button" className="button secondary"
                onClick={()=>history.change(s=>({...s,letteringLayers:s.letteringLayers.filter((_,i)=>i!==index)}))}>Delete this layer</button>
            </div>)}
          <button type="button" className="button secondary"
            disabled={history.state.letteringLayers.length>=2}
            onClick={()=>history.change(s=>({...s,letteringLayers:[...s.letteringLayers,{
              id:"text-"+Date.now()+"-"+Math.random().toString(36).slice(2,7),
              text:"",visible:true,letteringFont:s.letteringFont,
              letteringStyle:"Custom ink",letteringAmount:85,letteringScale:48,
              letteringTracking:0,letteringLineSpacing:118,letteringFormats:[],
              letteringBlendMode:s.letteringBlendMode ?? "Normal",letteringBlendStrength:100,
              letteringWarp:0,letteringMotion:0,letteringX:50,letteringY:50,
              letteringMotionPath:"Classic drift",letteringMotionPath2:"None",letteringMotionMix:65,letteringMotionSpeed:1,
              letteringMotionStagger:10,letteringMotionDirection:"Forward",
              letteringRotation:0,letteringStretchX:100,letteringStretchY:100,
              letteringCurve:0,letteringFillMode:"Solid",letteringFill:"#ff2fbf",
              letteringGradient:["#ff2fbf","#00f5ff"],letteringGradientAngle:0,
              letteringStrokes:[]}] }))}>+ Add independent text layer</button>
        </Section>
        <Section title="TEXT FILL — SOLID OR GRADIENT">
          <Select label="Fill type" value={history.state.letteringFillMode}
            onChange={v=>history.change(s=>({...s,letteringFillMode:v}))}>
            {["Solid","Linear gradient","Radial gradient"].map(v=><option key={v}>{v}</option>)}
          </Select>
          <label className="select-field"><span>Font fill color</span>
            <input type="color" value={history.state.letteringFill}
              onChange={e=>history.change(s=>({...s,letteringFill:e.target.value}))}/>
          </label>
          {history.state.letteringFillMode!=="Solid"&&<>
            <Parameter label="Gradient angle" name="letteringGradientAngle" history={history}/>
            {history.state.letteringGradient.map((color,index)=>
              <label className="select-field" key={index}><span>Gradient stop {index+1}</span>
                <input type="color" value={color}
                  onChange={e=>history.change(s=>({...s,letteringGradient:s.letteringGradient.map((c,i)=>i===index?e.target.value:c)}))}/>
                <button type="button" className="button secondary"
                  disabled={history.state.letteringGradient.length<=2}
                  onClick={()=>history.change(s=>({...s,letteringGradient:s.letteringGradient.filter((_,i)=>i!==index)}))}>Remove stop</button>
              </label>)}
            <button type="button" className="button secondary"
              disabled={history.state.letteringGradient.length>=8}
              onClick={()=>history.change(s=>({...s,letteringGradient:[...s.letteringGradient,"#ffffff"]}))}>Add gradient stop</button>
            <button type="button" className="button secondary"
              onClick={()=>history.change(s=>({...s,letteringGradient:[...s.letteringGradient].reverse()}))}>Reverse gradient</button>
          </>}
        </Section>
        <Section title="STACKED OUTSIDE STROKES">
          <p className="control-note">Up to five outer outlines. The first is closest to the letters. Each stroke grows outward, keeping the fill visible.</p>
          {history.state.letteringStrokes.map((stroke,index)=>
            <div className="retro-type-actions" key={index}>
              <label>Stroke {index+1} <input type="checkbox" checked={stroke.enabled}
                onChange={e=>history.change(s=>({...s,letteringStrokes:s.letteringStrokes.map((x,i)=>i===index?{...x,enabled:e.target.checked}:x)}))}/></label>
              <input type="color" value={stroke.color}
                aria-label={"Stroke "+(index+1)+" color"}
                onChange={e=>history.change(s=>({...s,letteringStrokes:s.letteringStrokes.map((x,i)=>i===index?{...x,color:e.target.value}:x)}))}/>
              <label>Outside width: {stroke.width}px
                <input type="range" min="0" max="40" step="1" value={stroke.width}
                  onChange={e=>history.change(s=>({...s,letteringStrokes:s.letteringStrokes.map((x,i)=>i===index?{...x,width:Number(e.target.value)}:x)}))}/>
              </label>
              <button type="button" className="button secondary"
                onClick={()=>history.change(s=>({...s,letteringStrokes:s.letteringStrokes.filter((_,i)=>i!==index)}))}>Remove stroke</button>
            </div>)}
          <button type="button" className="button secondary"
            disabled={history.state.letteringStrokes.length>=5}
            onClick={()=>history.change(s=>({...s,letteringStrokes:[...s.letteringStrokes,{color:"#ff00cc",width:4,enabled:true}]}))}>+ Add outer stroke</button>
        </Section>
        <Section title="POSITION & TRANSFORM — MOVE YOUR WORDS">
          <p className="control-note">Move the lettering without moving the artwork. Turn on drag mode to reposition directly on the canvas; turn it off to paint normally.</p>
          <label className="select-field"><span>Drag lettering on canvas</span>
            <input type="checkbox" checked={history.state.letteringDrag||false}
              onChange={e=>history.change(s=>({...s,letteringDrag:e.target.checked}))}/>
          </label>
          <Parameter label="Horizontal position" name="letteringX" history={history}/>
          <Parameter label="Vertical position" name="letteringY" history={history}/>
          <Parameter label="Rotate lettering" name="letteringRotation" history={history}/>
          <Parameter label="Stretch horizontally" name="letteringStretchX" history={history}/>
          <Parameter label="Stretch vertically" name="letteringStretchY" history={history}/>
          <Parameter label="Curve / bend text" name="letteringCurve" history={history}/>
          <button type="button" className="button secondary"
            onClick={()=>history.change(s=>({...s,letteringX:50,letteringY:50,
              letteringRotation:0,letteringStretchX:100,letteringStretchY:100,letteringCurve:0}))}>
            Reset text placement only
          </button>
        </Section>
        <Parameter label="Lettering opacity" name="letteringAmount" history={history} />
        <Parameter label="Letter size" name="letteringScale" history={history} />
        <Section title="SPARKLEBAE MOTION LAB — NO MORE PAPER SHREDDER">
          <Select label="Text movement path" value={history.state.letteringMotionPath ?? "Classic drift"}
            onChange={v=>history.change(s=>({...s,letteringMotionPath:v}))}>
            {letteringMotionGroups.map(group=><optgroup key={group.label} label={group.label}>
              {group.paths.map(path=><option key={path}>{path}</option>)}
            </optgroup>)}
          </Select>
          <Select label="Second motion (optional stack)" value={history.state.letteringMotionPath2 ?? "None"}
            onChange={v=>history.change(s=>({...s,letteringMotionPath2:v}))}>
            <option>None</option>
            {letteringMotionGroups.map(group=><optgroup key={group.label} label={group.label}>
              {group.paths.map(path=><option key={path}>{path}</option>)}
            </optgroup>)}
          </Select>
          <Parameter label="Second path mixing" name="letteringMotionMix" history={history}/>
          <Parameter label="Movement amount" name="letteringMotion" history={history}/>
          <Parameter label="Path speed / loops per cycle" name="letteringMotionSpeed" history={history} format={v=>`${Math.round(v)} loops`}/>
          <Parameter label="Per-letter stagger" name="letteringMotionStagger" history={history}/>
          <Select label="Path direction" value={history.state.letteringMotionDirection ?? "Forward"}
            onChange={v=>history.change(s=>({...s,letteringMotionDirection:v}))}>
            <option>Forward</option><option>Reverse</option>
          </Select>
          <Parameter label="Continuous liquid letter bending" name="letteringWarp" history={history}/>
          <p className="control-note">Whole-word trajectories and Sparklebae-style independent letter dances. Liquid warp bends complete characters smoothly—no chopped horizontal strips. Motion follows closed mathematical loops for animation exports.</p>
        </Section>
        <p className="control-note">All 14 text materials, 44 blends, 34 movement paths and 24 editable choreography recipes are available. Effects pause with the studio; the liquid engine bends whole glyphs smoothly rather than chopping letters into strips.</p>
        <p className="control-note">No random slogans: you decide every word. The font picker includes classic MySpace fonts and locally bundled retro styles. Saved quotes retain their font, and PNG, GIF and MP4 wait for it to load before export. Surprise Me still clears all text.</p>
      </Section>
    </>
  );
}
export function EffectsInspector({ history }) {
  return (
    <>
      <p className="inspector-intro">
        Beautiful signal. Questionable reception.
      </p>
      <Section title="BREAK THE SIGNAL">
        <Parameter label="Chromatic split" name="split" history={history} />
        <Parameter label="Smooth signal drift" name="glitch" history={history} />
        <Parameter label="Block corruption" name="block" history={history} />
        <Parameter label="Pixelation" name="pixel" history={history} />
      </Section>
      <Section title="ANALOG AFTERLIFE">
        <Parameter label="Scanlines" name="scan" history={history} />
        <Parameter label="Film grain" name="grain" history={history} />
        <Parameter label="Vignette" name="vignette" history={history} />
      </Section>
      <Section title="LIVING BACKDROPS — NO DEAD SPACE">
        <Select label="Animated background species" value={history.state.backdropMode}
          onChange={(v) => history.change((s) => ({...s, backdropMode:v}))}>
          {backdropModes.map((mode) => <option key={mode}>{mode}</option>)}
        </Select>
        <Parameter label="Background presence" name="backdropAmount" history={history} />
        <Parameter label="Far / near parallax depth" name="backdropDepth" history={history} />
        <Parameter label="Texture density" name="backdropDensity" history={history} />
        <Parameter label="Background movement" name="backdropMotion" history={history} />
        <Parameter label="Luminous pigment" name="backdropGlow" history={history} />
        <Parameter label="Palette shift" name="backdropHue" history={history} />
        <Parameter label="Background variation" name="backdropVariation" history={history} />
        <button type="button" className="button secondary full"
          onClick={() => history.change((s) => ({...s,backdropVariation:
            (s.backdropVariation+19+Math.random()*62)%100}))}>
          Shuffle background without changing the math
        </button>
        <p className="control-note">
          Six animated negative-space underpaintings that live behind the main mathematics.
          They move even when the primary structure holds its shape. Surprise Me changes
          the entire background species, its motion, density, depth and colors.
        </p>
      </Section>
      <Section title="WIGGLE STEREOSCOPY — FAKE DEPTH, REAL WEIRD">
        <Select label="View motion" value={history.state.wiggleMode}
          onChange={v=>history.change(s=>({...s,wiggleMode:v}))}>
          {wiggleModes.map(mode=><option key={mode}>{mode}</option>)}
        </Select>
        <Parameter label="Wiggle / view separation" name="wiggleAmount" history={history}/>
        <Parameter label="Depth displacement" name="wiggleDepth" history={history}/>
        <Parameter label="View switching speed" name="wiggleSpeed" history={history}/>
        <Parameter label="Depth strata / texture" name="wiggleLayers" history={history}/>
        <button type="button" className="button secondary full"
          onClick={()=>history.change(s=>({...s,wiggleMode:"Flipbook",
            wiggleAmount:67,wiggleDepth:72,wiggleSpeed:48,wiggleLayers:62}))}>
          Make this artwork wiggle
        </button>
        <p className="control-note">Flipbook alternates exactly two different views.
          Smooth orbit glides between them; Hold left/right show the two eye frames.
          This is a lightweight 2D depth illusion, separate from the 3D engine below.
          The backdrop and your own text stay anchored. Pause or Freeze geometry
          holds the view. Saved recipes, GIF, MP4, PNG, Surprise Me and Mutate
          share the same controls. Zero wiggle restores your original artwork.</p>
      </Section>
      <Section title="STEREO GHOST MACHINE — 3D DEPTH">
        <Select label="3D shape family" value={history.state.stereoShape}
          onChange={(v) => history.change((s) => ({...s, stereoShape: v}))}>
          {["Gyroid Cathedral", "Metaball Choir", "Opal Knot", "Crystal Lattice", "Ribbon Wormhole"]
            .map((m) => <option key={m}>{m}</option>)}
        </Select>
        <Parameter label="3D overlay / opacity" name="stereoAmount" history={history} />
        <Parameter label="Depth + distance fog" name="stereoDepth" history={history} />
        <Parameter label="Stereoscopic parallax" name="stereoParallax" history={history} />
        <Parameter label="Shape deformation" name="stereoMorph" history={history} />
        <Parameter label="Prismatic light + rim" name="stereoGlow" history={history} />
        <Parameter label="Camera wiggle speed" name="stereoWiggle" history={history} />
        <Parameter label="Raymarch detail / GPU load" name="stereoQuality" history={history} />
        <p className="control-note">The 3D engine always shows its raymarched form; on other engines, raise 3D overlay to add moving depth. Higher raymarch detail costs more GPU on iPhone.</p>
      </Section>
      <Section title="LIVING MICROSTRUCTURES">
        <Select label="Texture organism / construction" value={history.state.microMode}
          onChange={(v)=>history.change(s=>({...s,microMode:v}))}>
          {microModes.map(mode=><option key={mode}>{mode}</option>)}
        </Select>
        <Parameter label="Texture presence" name="microAmount" history={history}/>
        <Parameter label="Microscopic scale" name="microScale" history={history}/>
        <Parameter label="Independent texture motion" name="microMotion" history={history}/>
        <Parameter label="Thread / glass relief" name="microRelief" history={history}/>
        <Parameter label="Texture density" name="microDensity" history={history}/>
        <Parameter label="Color shift" name="microHue" history={history}/>
        <Parameter label="Texture variation" name="microVariation" history={history}/>
        <button type="button" className="button secondary"
          onClick={()=>history.change(s=>({...s,microVariation:
            (s.microVariation+23+Math.random()*56)%100}))}>
          Reseed texture only
        </button>
        <p className="control-note">Six moving material textures that ride your mathematical shapes: embroidery, granules, caustics, lace, glass hairlines and fluorescent cilia. Surprise Me changes the texture family and every setting. Set presence to zero to restore the original artwork.</p>
      </Section>
      <Section title="SAMPLE VAULT — SUBSTANCE LAB">
        <Select label="Sample-derived substance family" value={history.state.substanceMode}
          onChange={v=>history.change(s=>({...s,substanceMode:v}))}>
          {substanceModes.map(mode=><option key={mode}>{mode}</option>)}
        </Select>
        <Parameter label="Substance strength" name="substanceAmount" history={history}/>
        <Parameter label="Cells and structure scale" name="substanceScale" history={history}/>
        <Parameter label="Independent living motion" name="substanceMotion" history={history}/>
        <Parameter label="Pigment / film relief" name="substanceRelief" history={history}/>
        <Parameter label="Border luminescence" name="substanceEdge" history={history}/>
        <Parameter label="Palette phase shift" name="substanceHue" history={history}/>
        <Parameter label="Substance variation" name="substanceVariation" history={history}/>
        <button type="button" className="button secondary"
          onClick={()=>history.change(s=>({...s,substanceVariation:
            (s.substanceVariation+19+Math.random()*67)%100}))}>
          Reseed substance only
        </button>
        <p className="control-note">Four living material architectures adapted from your shader samples: evolving CMY Bragg cells, blooming chromatophores, chitin interference and warped Voronoi soup. Every effect uses your palette. Surprise Me changes all controls; old recipes remain unchanged with strength 0.</p>
      </Section>
      <Section title="PRISMATIC TAPE DECK">
        <Parameter label="Thin-film interference" name="filmAmount" history={history} />
        <Parameter label="Optical film thickness" name="filmThickness" history={history} />
        <Parameter label="Opal cell flashes" name="opalAmount" history={history} />
        <Parameter label="Dichroic prism shift" name="prismAmount" history={history} />
        <Parameter label="Micro-relief highlights" name="foilRelief" history={history} />
        <Parameter label="Material animation" name="foilMotion" history={history} />
        <p className="control-note">Animated spectral-film colors, opalescent cells and shape-reactive foil. Works on every math, biological and 3D engine; leave everything at zero for the old appearance.</p>
      </Section>
      <Section title="BIOLOGICAL SIGNAL ROT">
        <Parameter label="Growing organism overlay" name="bioAmount" history={history} />
        <Parameter label="Chemical feed" name="bioFeed" history={history} />
        <Parameter label="Chemical kill" name="bioKill" history={history} />
        <Parameter label="Growth speed" name="bioSpeed" history={history} />
        <Parameter label="Membrane veins" name="bioVeins" history={history} />
        <p className="control-note">Genuine seeded reaction-diffusion; its cells grow even over nonbiological engines. Choose Chromatic infection in Math to make the organism the main structure.</p>
      </Section>
      <Section title="FRAME MEMORY — ACTUAL FEEDBACK">
        <Parameter label="Afterimage persistence" name="afterimage" history={history} />
        <Parameter label="Temporal datamosh" name="datamosh" history={history} />
        <Parameter label="Memory drift" name="memoryDrift" history={history} />
        <Parameter label="Memory decay" name="memoryDecay" history={history} />
        <p className="control-note">These treatments reuse the previously rendered frame. Watch them build while the artwork moves; they work together, with no hard horizontal tracking seams.</p>
      </Section>
      <Section title="SCREEN PHYSICS">
        <Parameter label="CRT phosphor subpixels" name="phosphor" history={history} />
        <Parameter label="Broadcast bars" name="broadcast" history={history} />
        <p className="control-note">Real RGB shadow-mask triads and color-bar interference, not just scanlines.</p>
      </Section>
      <Section title="PRINT DAMAGE">
        <Parameter label="Bayer pixel dither" name="dither" history={history} />
        <Parameter label="CMY risograph" name="riso" history={history} />
        <Parameter label="Ink misregistration" name="misregister" history={history} />
        <p className="control-note">These are independent, stackable color-material treatments.</p>
      </Section>
      <Section title="OLD-WEB HAUNTING">
        <Parameter label="Cascading error windows" name="windowCascade" history={history} />
        <Parameter label="Glitter explosions" name="glitter" history={history} />
        <p className="control-note">Decorative procedural windows and living neon starbursts. Both render into image and video exports.</p>
      </Section>
      <Section title="EXTRA STRANGE">
        <Switch label="Phosphor bloom" name="bloom" history={history} />
        <Switch label="Color posterize" name="posterize" history={history} />
        <Switch label="Invert signal" name="invert" history={history} />
      </Section>
    </>
  );
}
export function LayersInspector({ history }) {
  const s = history.state;
  return (
    <>
      <p className="inspector-intro">
        Crossbreed two mathematical worlds. All of it stays editable.
      </p>
      <Section title="PRIMARY FIELD">
        <div className="layer-card">
          <Layers size={17} />
          <div>
            {engines[s.engine]}
            <small>Change the primary engine in Math.</small>
          </div>
        </div>
      </Section>
      <div className="layer-connector">
        <ArrowDown size={14} />
        <span>
          {s.blend === 0
            ? "SECOND FIELD OFF"
            : `${Math.round(s.blend)}% ${s.blendMode.toUpperCase()}`}
        </span>
      </div>
      <Section title="SECONDARY FIELD">
        <Select
          label="Engine"
          value={s.secondaryEngine}
          onChange={(v) =>
            history.change((x) => ({ ...x, secondaryEngine: +v }))
          }
        >
          {engines.map((e, i) => (
            <option value={i} key={i}>
              {e}
            </option>
          ))}
        </Select>
        <Select
          label="Interaction"
          value={s.blendMode}
          onChange={(v) => history.change((x) => ({ ...x, blendMode: v }))}
        >
          {["Mix", "Multiply", "Difference"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </Select>
        <Parameter label="Field blend" name="blend" history={history} />
        <p className="control-note">
          {s.blendMode === "Mix"
            ? "Fade between the two scalar fields."
            : s.blendMode === "Multiply"
              ? "Multiply both signals to carve new interference structures."
              : "Reveal the absolute difference between the fields."}{" "}
          At 0%, the primary field is untouched.
        </p>
        <button
          className="button secondary full"
          onClick={() =>
            history.change((x) => ({ ...x, blend: x.blend === 0 ? 45 : 0 }))
          }
        >
          {s.blend === 0
            ? "Bring in the second field"
            : "Disable the second field"}
        </button>
      </Section>
      <Section title="SPATIAL COMPOSITION — DIFFERENT WORLDS">
        <Select label="Territory arrangement" value={s.compositionMode}
          onChange={(v) => history.change((x) => ({...x, compositionMode:v}))}>
          {compositionModes.map((mode) => <option key={mode}>{mode}</option>)}
        </Select>
        <Parameter label="Composition strength" name="compositionAmount" history={history} />
        <Parameter label="Territory size / density" name="compositionScale" history={history} />
        <Parameter label="Softness of boundaries" name="compositionFeather" history={history} />
        <Parameter label="Territory movement" name="compositionMotion" history={history} />
        <Parameter label="Second world's palette shift" name="compositionColorShift" history={history} />
        <Parameter label="Territory variation" name="compositionVariation" history={history} />
        <div className="layer-actions" style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <button type="button" className="button secondary"
            onClick={() => history.change((x) => ({...x,compositionVariation:
              (x.compositionVariation+17+Math.random()*61)%100}))}>
            Shuffle territory layout
          </button>
          <button type="button" className="button secondary"
            onClick={() => history.change((x) =>
              ({...x,engine:x.secondaryEngine,secondaryEngine:x.engine}))}>
            Swap mathematical worlds
          </button>
        </div>
        <p className="control-note">
          The second mathematical engine occupies independently animated shapes:
          portals, ribbons, cells, quilt pieces, orbital islands or woven windows.
          Each territory reveals a different structure and a shifted phase of the
          shared palette. Set strength to 0%
          for the original full-canvas blend. Turn on the second field above to see them.
        </p>
      </Section>
      <Section title="WHAT GETS SHARED">
        <p className="control-note">
          Both fields still share your palette, scale, touches and clocks. Spatial
          composition adds separate color-phase territories without discarding
          your original mathematical blend modes.
        </p>
      </Section>
    </>
  );
}
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
      <p className="inspector-intro">
        Paint forces into the math. Pinch to resize; twist to turn. Every
        gesture is undoable.
      </p>
      <Section title="YOUR HAND, YOUR RULES">
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
        <Select
          label="Force type"
          value={s.touchMode}
          onChange={(v) => history.change((x) => ({ ...x, touchMode: v }))}
        >
          {touchModes.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </Select>
        <p className="control-note">
          {
            [
              "Bend the field into liquid ribbons.",
              "Stir a whirlpool into the signal.",
              "Push the field away from your fingers.",
              "Paint local color-phase sources without changing geometry.",
            ][touchModes.indexOf(s.touchMode)]
          }
        </p>
        <Parameter label="Brush strength" name="strength" history={history} />
        <Parameter label="Brush radius" name="radius" history={history} />
        <button
          className="button secondary full"
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
        <button
          className="toggle-row"
          role="switch"
          aria-checked={showHandles}
          onClick={onHandles}
        >
          <span>
            {showHandles ? <Eye size={14} /> : <EyeOff size={14} />}Show touch
            handles
          </span>
          <span className={"switch " + (showHandles ? "on" : "")} />
        </button>
      </Section>
      <Section
        title="TOUCH FIELD"
        aside={<span>{s.marks.length} / 32 SOURCES</span>}
      >
        {!s.marks.length ? (
          <p className="control-note">
            Your field is untouched. Drag on the art, or add a source with the
            button above.
          </p>
        ) : (
          <>
            <Select
              label="Selected source"
              value={mark?.id || ""}
              onChange={onSelect}
            >
              <option value="">Choose a source…</option>
              {s.marks.map((m, i) => (
                <option key={m.id} value={m.id}>
                  {i + 1}. {touchModes[m.mode]}
                </option>
              ))}
            </Select>
            {mark && (
              <div className="source-editor">
                <Range
                  label="Source strength"
                  value={Math.round(mark.power * 100)}
                  min={-200}
                  max={200}
                  onStart={history.begin}
                  onChange={(v) => edit({ power: v / 100 })}
                  onEnd={history.end}
                  onCancel={history.cancel}
                />
                <Range
                  label="Source radius"
                  value={Math.round(mark.radius * 100)}
                  min={5}
                  max={60}
                  onStart={history.begin}
                  onChange={(v) => edit({ radius: v / 100 })}
                  onEnd={history.end}
                  onCancel={history.cancel}
                />
                <Range
                  label="Source angle"
                  value={((((mark.angle * 180) / Math.PI) % 360) + 360) % 360}
                  min={0}
                  max={360}
                  format={(v) => `${Math.round(v)}°`}
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
                  Remove selected source
                </button>
              </div>
            )}
            <button
              className="subtle-button full"
              onClick={() => history.change((x) => ({ ...x, marks: [] }))}
            >
              Clear touch field
            </button>
            <p className="control-note">
              The 32 most recent sources are kept. Move mode lets you reposition
              handles; arrow keys nudge a focused handle.
            </p>
          </>
        )}
      </Section>
    </>
  );
}
