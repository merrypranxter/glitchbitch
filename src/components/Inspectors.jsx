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
} from "lucide-react";
import { engineInfo, engines, touchModes, makeMark, motionModes } from "../data";
import { Parameter, Range, Switch, Select, Section } from "./Controls";
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
      {(selected(12) || selected(13) || selected(14) || selected(15)) && (
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
      <Section title="WHAT GETS SHARED">
        <p className="control-note">
          Both fields share your scale, warp, complexity, touch sources, and
          clock. The combined structure flows through one color palette and
          effect chain.
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
