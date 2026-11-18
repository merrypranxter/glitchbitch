import React from "react";
import {
  Eye, EyeOff, Plus, Trash2, X, Shuffle, Dices, Dna, Sparkles, Move, Type,
  Palette, Waves, Blend, Wand2, Crosshair, RotateCcw, ArrowLeftRight,
} from "lucide-react";
import { numericRanges, initial, letteringStyles } from "../data";
import { Range, Select, Segmented, Toggle, useReveal } from "./Controls";
import { letteringBlendGroups, letteringBlendModes } from "../lettering-blends.js";
import { letteringMotionGroups } from "../lettering-motion.js";
import { textFormatTools, toggleTextFormat, rebaseTextFormats, textStyleAt, wordSelection,
  setTextInk, setTextRainbow, clearTextInk } from "../text-formatting.js";
import { textChoreographyGroups, textChoreographies, applyTextChoreography,
  remixTextChoreography, mutateTextChoreography } from "../text-choreographies.js";
import { retroFonts, retroFontGroups, getRetroFont, ensureRetroFontLoaded } from "../retro-fonts";

// ---------------------------------------------------------------------------
// Layer adapter. Layer 1 is the original quote stored on the root state
// (`lettering`); layers 2–3 live in `letteringLayers`. Both share the same
// field names, so one editor can drive any of them.
// ---------------------------------------------------------------------------
function readLayer(s, i) {
  return i === 0 ? { ...s, text: s.lettering, visible: true } : s.letteringLayers[i - 1];
}
function writeLayer(s, i, next) {
  if (i === 0) {
    const { text, visible, ...rest } = next;
    return { ...s, ...rest, lettering: text };
  }
  return { ...s, letteringLayers: s.letteringLayers.map((x, j) => (j === i - 1 ? next : x)) };
}
const mapLayer = (s, i, fn) => writeLayer(s, i, fn(readLayer(s, i)));
function useLayerTarget(history, index) {
  return {
    index,
    layer: readLayer(history.state, index),
    change: (fn) => history.change((s) => mapLayer(s, index, fn)),
    set: (patch) => history.change((s) => mapLayer(s, index, (l) => ({ ...l, ...patch }))),
    begin: history.begin,
    preview: (fn) => history.preview((s) => mapLayer(s, index, fn)),
    end: history.end,
    cancel: history.cancel,
  };
}
// Empty words aren't "hidden" — there's just nothing there yet.
const isShown = (layer, index) =>
  index === 0 ? !layer.text.trim() || Number(layer.letteringAmount) > 0 : layer.visible !== false;
function newLayer(s) {
  return {
    id: "text-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7),
    text: "", visible: true, letteringFont: s.letteringFont,
    letteringStyle: "Custom ink", letteringAmount: 85, letteringScale: 48,
    letteringTracking: 0, letteringLineSpacing: 118, letteringFormats: [],
    letteringBlendMode: s.letteringBlendMode ?? "Normal", letteringBlendStrength: 100,
    letteringWarp: 0, letteringMotion: 0, letteringX: 50, letteringY: 30,
    letteringMotionPath: "Classic drift", letteringMotionPath2: "None", letteringMotionMix: 65, letteringMotionSpeed: 1,
    letteringMotionStagger: 10, letteringMotionDirection: "Forward",
    letteringRotation: 0, letteringStretchX: 100, letteringStretchY: 100,
    letteringCurve: 0, letteringFillMode: "Solid", letteringFill: "#ff2fbf",
    letteringGradient: ["#ff2fbf", "#00f5ff"], letteringGradientAngle: 0,
    letteringStrokes: [],
  };
}

// ---- small controls ---------------------------------------------------------
function TextParam({ t, name, label, format }) {
  const [min, max] = numericRanges[name];
  return (
    <Range label={label} value={t.layer[name] ?? initial[name]} min={min} max={max} format={format}
      onStart={t.begin} onChange={(v) => t.preview((l) => ({ ...l, [name]: v }))}
      onEnd={t.end} onCancel={t.cancel} />
  );
}
/** Color swatch input; dragging the picker is one undo step. */
function ColorChip({ value, label, onBegin, onPreview, onEnd, children }) {
  return (
    <label className="color-chip" title={label}>
      <input type="color" value={value} aria-label={label}
        onFocus={onBegin} onChange={(e) => onPreview(e.target.value)} onBlur={onEnd} />
      <i style={{ background: value }} />
      {children}
    </label>
  );
}
const degrees = (v) => `${Math.round(v)}°`;
const signedPct = (v) => `${v > 0 ? "+" : ""}${Math.round(v)}%`;
const PANES = [
  ["Font", Type], ["Color", Palette], ["Layout", Move],
  ["Motion", Waves], ["Blend", Blend], ["Recipes", Wand2],
];
const PANE_KEY = "glitch-text-pane-v1";
const inkSwatches = ["#ff32bc", "#00ebff", "#c2ff29", "#ffea3b", "#9357ff", "#ff6a2d", "#ffffff", "#08020c"];
const finePointer = () =>
  typeof window !== "undefined" && window.matchMedia?.("(pointer: fine)").matches;

// ---------------------------------------------------------------------------
export function TextInspector({ history }) {
  const s = history.state;
  const [active, setActive] = React.useState(0);
  const index = Math.min(active, s.letteringLayers.length);
  const t = useLayerTarget(history, index);
  const layer = t.layer;
  const [pane, setPaneState] = React.useState(() => {
    try { return localStorage.getItem(PANE_KEY) || "Font"; } catch { return "Font"; }
  });
  const setPane = (p) => {
    setPaneState(p);
    try { localStorage.setItem(PANE_KEY, p); } catch { /* session only */ }
  };
  useReveal((detail) => {
    if (detail.pane) setPane(detail.pane);
    if (detail.id?.startsWith("text-"))
      requestAnimationFrame(() => document.querySelector(".text-editor")
        ?.scrollIntoView({ block: "start", behavior: "smooth" }));
  });

  // Selection is real state so the style bar always shows what it will hit.
  const [sel, setSel] = React.useState({ start: 0, end: 0 });
  const textareaRef = React.useRef(null);
  React.useEffect(() => setSel({ start: 0, end: 0 }), [index]);
  React.useEffect(() => {
    // Phone selection handles only fire the native selectionchange event.
    const sync = () => {
      const el = textareaRef.current;
      if (el && document.activeElement === el)
        setSel((old) => (old.start === el.selectionStart && old.end === el.selectionEnd
          ? old : { start: el.selectionStart ?? 0, end: el.selectionEnd ?? 0 }));
    };
    document.addEventListener("selectionchange", sync);
    return () => document.removeEventListener("selectionchange", sync);
  }, []);
  const remember = (e) => setSel({
    start: e.currentTarget.selectionStart ?? 0, end: e.currentTarget.selectionEnd ?? 0,
  });
  const range = wordSelection(layer.text, sel.start, sel.end);
  const target = layer.text.slice(range.start, range.end).trim();
  const targetIdx = Array.from({ length: Math.max(0, range.end - range.start) }, (_, i) => range.start + i)
    .filter((i) => !/\s/u.test(layer.text[i] || " "));
  const format = (fn) => {
    const el = textareaRef.current;
    const focused = el && document.activeElement === el;
    t.change((l) => ({ ...l, letteringFormats: fn(l) }));
    if (focused) {
      // Style buttons don't steal focus, so the highlight survives and you can
      // stack B + I + pink. Re-open the typing transaction so later typing
      // still gets its own undo step.
      history.begin();
    } else if (el && finePointer()) {
      // Bring the highlight back (skipped on touch so the keyboard stays down).
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(sel.start, sel.end);
      });
    }
  };

  const [fontError, setFontError] = React.useState("");
  React.useEffect(() => {
    if (!layer.text.trim()) return;
    let live = true;
    ensureRetroFontLoaded(layer.letteringFont)
      .then(() => { if (live) setFontError(""); }, (e) => { if (live) setFontError(e.message); });
    return () => { live = false; };
  }, [layer.letteringFont, layer.text]);

  const lastAmount = React.useRef(85);
  function toggleShown() {
    if (index === 0) {
      if (Number(s.letteringAmount) > 0) {
        lastAmount.current = s.letteringAmount;
        history.change((x) => ({ ...x, letteringAmount: 0 }));
      } else history.change((x) => ({ ...x, letteringAmount: lastAmount.current || 85 }));
    } else t.set({ visible: !layer.visible });
  }
  const layers = [readLayer(s, 0), ...s.letteringLayers];
  const hasText = layer.text.trim().length > 0;

  return (
    <div className="text-inspector">
      {/* 1. Which layer am I editing? */}
      <div className="text-layer-bar" role="tablist" aria-label="Text layers">
        {layers.map((l, i) => (
          <button key={i} type="button" role="tab" aria-selected={i === index}
            className={"text-layer-chip " + (i === index ? "active " : "") + (isShown(l, i) ? "" : "hidden-layer")}
            onClick={() => setActive(i)} title={`Edit text layer ${i + 1}`}>
            <b>{i + 1}</b>
            <span>{l.text.trim().split("\n")[0].slice(0, 14) || "empty"}</span>
            {!isShown(l, i) && <EyeOff size={11} />}
          </button>
        ))}
        {s.letteringLayers.length < 2 && (
          <button type="button" className="text-layer-chip add" title="Add another text layer"
            onClick={() => {
              history.change((x) => ({ ...x, letteringLayers: [...x.letteringLayers, newLayer(x)] }));
              setActive(s.letteringLayers.length + 1);
            }}>
            <Plus size={13} /> Layer
          </button>
        )}
      </div>

      {/* 2. The words + selected-word styling */}
      <div className="text-editor">
        <div className="text-editor-head">
          <span>Layer {index + 1}{index > 0 ? " · stacks above layer 1" : ""}</span>
          <button type="button" className="icon-button" onClick={toggleShown} disabled={index === 0 && !hasText}
            aria-pressed={!isShown(layer, index)}
            title={isShown(layer, index) ? "Hide this layer" : "Show this layer"}>
            {isShown(layer, index) ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
          <button type="button" className="icon-button" disabled={index === 0 && !hasText}
            title={index === 0 ? "Clear these words" : "Delete this layer"}
            onClick={() => {
              if (index === 0) history.change((x) => ({ ...x, lettering: "", letteringFormats: [], letteringAmount: 0 }));
              else {
                history.change((x) => ({ ...x, letteringLayers: x.letteringLayers.filter((_, j) => j !== index - 1) }));
                setActive(index - 1);
              }
            }}>
            <Trash2 size={14} />
          </button>
        </div>
        <textarea ref={textareaRef} className="text-input" rows={3} maxLength={280}
          autoComplete="off" spellCheck={false}
          aria-label={`Words for text layer ${index + 1}`}
          placeholder={"Type anything. Line breaks work."}
          value={layer.text}
          onSelect={remember} onKeyUp={remember} onMouseUp={remember}
          onFocus={t.begin}
          onChange={(e) => {
            const value = e.target.value;
            t.preview((l) => ({
              ...l, text: value,
              letteringFormats: rebaseTextFormats(l.text, value, l.letteringFormats),
              ...(index === 0 ? { letteringAmount: value.trim() ? (l.letteringAmount || 46) : 0 } : {}),
            }));
          }}
          onBlur={t.end} />

        <div className="style-bar" role="group" aria-label="Style selected words">
          <div className="style-target" aria-live="polite">
            {!hasText ? <span>Type something, then highlight words to style them.</span>
              : target ? <>Styling <b>“{target.length > 26 ? target.slice(0, 25) + "…" : target}”</b></>
              : <span>Highlight words (or click into one) to style them.</span>}
          </div>
          <div className="style-row">
            {textFormatTools.map((tool) => {
              const on = targetIdx.length > 0 && targetIdx.every((i) => Boolean(textStyleAt(layer.letteringFormats, i)[tool.key]));
              return (
                <button key={tool.key} type="button" className={"style-btn " + (on ? "on" : "")}
                  aria-pressed={on} disabled={!target} title={tool.label}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => format((l) => toggleTextFormat(l.text, l.letteringFormats, sel.start, sel.end, tool.key))}>
                  {tool.key === "bold" ? <strong>B</strong> : tool.key === "italic" ? <em>I</em>
                    : tool.key === "underline" ? <span style={{ textDecoration: "underline" }}>U</span>
                    : tool.key === "strike" ? <span style={{ textDecoration: "line-through" }}>S</span> : "AA"}
                </button>
              );
            })}
          </div>
          <div className="style-row ink-row">
            {inkSwatches.map((color) => (
              <button key={color} type="button" className="ink-dot" style={{ background: color }}
                disabled={!target} aria-label={"Paint selected words " + color} title={color}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => format((l) => setTextInk(l.text, l.letteringFormats, sel.start, sel.end, color))} />
            ))}
            <label className={"ink-dot custom " + (!target ? "disabled" : "")} title="Any color">
              <input type="color" defaultValue="#ff32bc" disabled={!target} aria-label="Custom color for selected words"
                onFocus={t.begin}
                onChange={(e) => {
                  const color = e.target.value;
                  t.preview((l) => ({ ...l, letteringFormats: setTextInk(l.text, l.letteringFormats, sel.start, sel.end, color) }));
                }}
                onBlur={t.end} />
              <Plus size={11} />
            </label>
            <button type="button" className="ink-dot rainbow" disabled={!target} title="Rainbow letters"
              aria-label="Rainbow selected words" onMouseDown={(e) => e.preventDefault()}
              onClick={() => format((l) => setTextRainbow(l.text, l.letteringFormats, sel.start, sel.end))} />
            <button type="button" className="ink-dot clear" disabled={!target} title="Remove word color"
              aria-label="Clear word color" onMouseDown={(e) => e.preventDefault()}
              onClick={() => format((l) => clearTextInk(l.text, l.letteringFormats, sel.start, sel.end))}>
              <X size={11} />
            </button>
          </div>
        </div>

        <div className="text-quick">
          <TextParam t={t} name="letteringScale" label="Size" />
          <TextParam t={t} name="letteringAmount" label="Opacity" />
        </div>
      </div>

      {/* 3. Everything else, one tab at a time */}
      <div className="text-panes" role="tablist" aria-label="Text settings">
        {PANES.map(([name, Icon]) => (
          <button key={name} type="button" role="tab" aria-selected={pane === name}
            className={pane === name ? "active" : ""} onClick={() => setPane(name)}>
            <Icon size={13} />{name}
          </button>
        ))}
      </div>
      <div className="text-pane" role="tabpanel" aria-label={pane}>
        {pane === "Font" && <FontPane t={t} fontError={fontError} />}
        {pane === "Color" && <ColorPane t={t} />}
        {pane === "Layout" && <LayoutPane t={t} history={history} />}
        {pane === "Motion" && <MotionPane t={t} />}
        {pane === "Blend" && <BlendPane t={t} />}
        {pane === "Recipes" && <RecipesPane t={t} />}
      </div>
    </div>
  );
}

// ---- panes -----------------------------------------------------------------
function FontPane({ t, fontError }) {
  const l = t.layer;
  const font = getRetroFont(l.letteringFont);
  return (
    <>
      <div className="font-row">
        <Select label="Typeface" value={l.letteringFont} onChange={(v) => t.set({ letteringFont: v })}>
          {retroFontGroups.map((group) => (
            <optgroup key={group} label={group}>
              {retroFonts.filter((f) => f.group === group)
                .map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
            </optgroup>
          ))}
        </Select>
        <button type="button" className="icon-button boxed" title="Random font (keeps your words)"
          onClick={() => t.change((x) => {
            const list = retroFonts.filter((f) => f.id !== x.letteringFont);
            return { ...x, letteringFont: list[Math.floor(Math.random() * list.length)].id };
          })}>
          <Shuffle size={14} />
        </button>
      </div>
      <div className="retro-type-preview" style={{ fontFamily: font.family, fontWeight: font.weight }}>
        {l.text.trim().split("\n")[0].slice(0, 46) || "YOUR WORDS. YOUR RULES."}
      </div>
      {fontError && <p className="field-error" role="alert">Font didn't load: {fontError}. Try another.</p>}
      <Select label="Material" value={l.letteringStyle} onChange={(v) => t.set({ letteringStyle: v })}>
        {letteringStyles.map((v) => <option key={v}>{v}</option>)}
      </Select>
      <p className="control-note">Materials add glow, chrome, echoes, etc. Pick <b>Custom ink</b> to use your exact colors.</p>
    </>
  );
}

function ColorPane({ t }) {
  const l = t.layer;
  const gradient = l.letteringFillMode !== "Solid";
  const setStop = (j, c) => t.preview((x) => ({ ...x, letteringGradient: x.letteringGradient.map((v, n) => (n === j ? c : v)) }));
  const setStroke = (j, patch) => (x) => ({ ...x, letteringStrokes: x.letteringStrokes.map((v, n) => (n === j ? { ...v, ...patch } : v)) });
  return (
    <>
      <Segmented label="Fill" value={l.letteringFillMode}
        options={[["Solid", "Solid"], ["Linear gradient", "Linear"], ["Radial gradient", "Radial"]]}
        onChange={(v) => t.set({ letteringFillMode: v })} />
      {!gradient ? (
        <div className="chip-row">
          <ColorChip value={l.letteringFill} label="Fill color" onBegin={t.begin}
            onPreview={(c) => t.preview((x) => ({ ...x, letteringFill: c }))} onEnd={t.end}>
            <span>{l.letteringFill.toUpperCase()}</span>
          </ColorChip>
        </div>
      ) : (
        <>
          <div className="chip-row">
            {l.letteringGradient.map((c, j) => (
              <span className="stop" key={j}>
                <ColorChip value={c} label={`Gradient stop ${j + 1}`} onBegin={t.begin}
                  onPreview={(v) => setStop(j, v)} onEnd={t.end} />
                {l.letteringGradient.length > 2 && (
                  <button type="button" className="stop-x" title="Remove stop"
                    onClick={() => t.change((x) => ({ ...x, letteringGradient: x.letteringGradient.filter((_, n) => n !== j) }))}>
                    <X size={9} />
                  </button>
                )}
              </span>
            ))}
            {l.letteringGradient.length < 8 && (
              <button type="button" className="chip-add" title="Add stop"
                onClick={() => t.change((x) => ({ ...x, letteringGradient: [...x.letteringGradient, "#ffffff"] }))}>
                <Plus size={13} />
              </button>
            )}
            <button type="button" className="chip-add" title="Reverse gradient"
              onClick={() => t.change((x) => ({ ...x, letteringGradient: [...x.letteringGradient].reverse() }))}>
              <ArrowLeftRight size={13} />
            </button>
          </div>
          {l.letteringFillMode === "Linear gradient" &&
            <TextParam t={t} name="letteringGradientAngle" label="Gradient angle" format={degrees} />}
        </>
      )}

      <div className="pane-subhead">
        <span>Outlines</span>
        <small>{l.letteringStrokes.length}/5 · first = closest to letters</small>
      </div>
      {l.letteringStrokes.length === 0 && <p className="control-note">No outlines yet.</p>}
      {l.letteringStrokes.map((stroke, j) => (
        <div className={"stroke-row " + (stroke.enabled ? "" : "off")} key={j}>
          <button type="button" role="switch" aria-checked={stroke.enabled}
            className={"switch " + (stroke.enabled ? "on" : "")}
            title={stroke.enabled ? "Turn outline off" : "Turn outline on"}
            aria-label={`Outline ${j + 1} on/off`}
            onClick={() => t.change(setStroke(j, { enabled: !stroke.enabled }))} />
          <ColorChip value={stroke.color} label={`Outline ${j + 1} color`} onBegin={t.begin}
            onPreview={(c) => t.preview(setStroke(j, { color: c }))} onEnd={t.end} />
          <Range label={`Width`} value={stroke.width} min={0} max={40} format={(v) => `${v}px`}
            onStart={t.begin} onChange={(v) => t.preview(setStroke(j, { width: v }))}
            onEnd={t.end} onCancel={t.cancel} />
          <button type="button" className="icon-button" title="Remove outline"
            onClick={() => t.change((x) => ({ ...x, letteringStrokes: x.letteringStrokes.filter((_, n) => n !== j) }))}>
            <X size={13} />
          </button>
        </div>
      ))}
      <button type="button" className="subtle-button full" disabled={l.letteringStrokes.length >= 5}
        onClick={() => t.change((x) => ({ ...x, letteringStrokes: [...x.letteringStrokes,
          { color: x.letteringStrokes.length ? "#ff00cc" : "#000000", width: x.letteringStrokes.length ? 4 : 6, enabled: true }] }))}>
        <Plus size={13} /> Add outline
      </button>
    </>
  );
}

function LayoutPane({ t, history }) {
  const l = t.layer;
  return (
    <>
      <div className="pane-actions">
        <button type="button" className="button secondary" title="Center it, white fill, black outline, full opacity"
          onClick={() => t.change((x) => ({ ...x, letteringAmount: 100, letteringX: 50, letteringY: 50,
            letteringScale: 65, letteringRotation: 0, letteringStretchX: 100, letteringStretchY: 100,
            letteringCurve: 0, letteringWarp: 0, letteringMotion: 0, letteringFillMode: "Solid",
            letteringFill: "#ffffff", letteringStrokes: [{ color: "#000000", width: 6, enabled: true }] }))}>
          <Crosshair size={13} /> Make readable
        </button>
        <button type="button" className="button secondary" title="Back to centered, unrotated, unstretched"
          onClick={() => t.set({ letteringX: 50, letteringY: 50, letteringRotation: 0,
            letteringStretchX: 100, letteringStretchY: 100, letteringCurve: 0 })}>
          <RotateCcw size={13} /> Reset layout
        </button>
      </div>
      {t.index === 0 && (
        <Toggle label="Drag text on the canvas" note="While on, dragging moves words instead of painting."
          checked={Boolean(history.state.letteringDrag)}
          onChange={(v) => history.change((x) => ({ ...x, letteringDrag: v }))} />
      )}
      <TextParam t={t} name="letteringX" label="Left ↔ right" />
      <TextParam t={t} name="letteringY" label="Down ↕ up" />
      <TextParam t={t} name="letteringRotation" label="Rotate" format={degrees} />
      <TextParam t={t} name="letteringCurve" label="Curve" format={signedPct} />
      <TextParam t={t} name="letteringStretchX" label="Stretch wide" />
      <TextParam t={t} name="letteringStretchY" label="Stretch tall" />
      <TextParam t={t} name="letteringTracking" label="Letter spacing" format={signedPct} />
      <TextParam t={t} name="letteringLineSpacing" label="Line spacing" />
    </>
  );
}

function MotionPathSelect({ label, value, onChange, allowNone }) {
  return (
    <Select label={label} value={value} onChange={onChange}>
      {allowNone && <option>None</option>}
      {letteringMotionGroups.map((group) => (
        <optgroup key={group.label} label={group.label}>
          {group.paths.map((path) => <option key={path}>{path}</option>)}
        </optgroup>
      ))}
    </Select>
  );
}
function MotionPane({ t }) {
  const l = t.layer;
  const stacked = (l.letteringMotionPath2 ?? "None") !== "None";
  return (
    <>
      <MotionPathSelect label="Path" value={l.letteringMotionPath ?? "Classic drift"}
        onChange={(v) => t.set({ letteringMotionPath: v })} />
      <TextParam t={t} name="letteringMotion" label="Amount" />
      <TextParam t={t} name="letteringMotionSpeed" label="Speed" format={(v) => `${Math.round(v)} loop${v > 1 ? "s" : ""}`} />
      <TextParam t={t} name="letteringMotionStagger" label="Per-letter stagger" />
      <Segmented label="Direction" value={l.letteringMotionDirection ?? "Forward"}
        options={["Forward", "Reverse"]} onChange={(v) => t.set({ letteringMotionDirection: v })} />
      <TextParam t={t} name="letteringWarp" label="Liquid bend" />
      <MotionPathSelect label="Stack a second path" value={l.letteringMotionPath2 ?? "None"} allowNone
        onChange={(v) => t.set({ letteringMotionPath2: v })} />
      {stacked && <TextParam t={t} name="letteringMotionMix" label="Second path mix" />}
      <button type="button" className="subtle-button full"
        onClick={() => t.change((x) => remixTextChoreography(x, "motion"))}>
        <Dices size={13} /> Random motion
      </button>
    </>
  );
}

function BlendPane({ t }) {
  const l = t.layer;
  return (
    <>
      <Select label="Blend with the artwork" value={l.letteringBlendMode ?? "Normal"}
        onChange={(v) => t.set({ letteringBlendMode: v })}>
        {letteringBlendGroups.map((group) => (
          <optgroup key={group.label} label={group.label}>
            {group.modes.map((mode) => <option key={mode} value={mode}>{mode}</option>)}
          </optgroup>
        ))}
      </Select>
      <TextParam t={t} name="letteringBlendStrength" label="Intensity" />
      <button type="button" className="subtle-button full"
        onClick={() => t.set({
          letteringBlendMode: letteringBlendModes[Math.floor(Math.random() * letteringBlendModes.length)],
          letteringBlendStrength: 100,
        })}>
        <Dices size={13} /> Random blend
      </button>
      <p className="control-note">0% intensity = plain text. Blink modes flash on purpose.</p>
    </>
  );
}

function RecipesPane({ t }) {
  const [id, setId] = React.useState("opal-orbit");
  const chosen = textChoreographies.find((p) => p.id === id);
  return (
    <>
      <p className="control-note">One tap restyles material, blend and motion. Your words, font, colors and position stay put.</p>
      <Select label="Recipe" value={id} onChange={setId}>
        {textChoreographyGroups.map((group) => (
          <optgroup key={group.label} label={group.label}>
            {group.presets.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </optgroup>
        ))}
      </Select>
      {chosen && <p className="recipe-desc">{chosen.description}</p>}
      <button type="button" className="button primary full" onClick={() => t.change((x) => applyTextChoreography(x, id))}>
        <Sparkles size={14} /> Apply to layer {t.index + 1}
      </button>
      <div className="pane-actions three">
        <button type="button" className="button secondary" title="Random recipe"
          onClick={() => t.change((x) => remixTextChoreography(x, "all"))}>
          <Dices size={13} /> Surprise
        </button>
        <button type="button" className="button secondary" title="New random material + blend"
          onClick={() => t.change((x) => remixTextChoreography(x, "blend"))}>
          <Shuffle size={13} /> Re-look
        </button>
        <button type="button" className="button secondary" title="Small random nudge to the current look"
          onClick={() => t.change((x) => mutateTextChoreography(x))}>
          <Dna size={13} /> Mutate
        </button>
      </div>
    </>
  );
}
