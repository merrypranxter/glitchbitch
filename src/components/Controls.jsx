import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, RotateCcw } from "lucide-react";
import { numericRanges, initial } from "../data";
import { sectionMeta, sectionActive } from "../ui-index";
import { effectDetails } from "../effect-details.js";

export function Range({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onStart,
  onChange,
  onEnd,
  onCancel,
  format,
}) {
  const editing = useRef(false);
  const start = () => {
    if (!editing.current) {
      editing.current = true;
      onStart?.();
    }
  };
  const end = () => {
    if (editing.current) {
      editing.current = false;
      onEnd?.();
    }
  };
  return (
    <label className="slider">
      <span>
        {label}
        <output>{format ? format(value) : `${Math.round(value)}%`}</output>
      </span>
      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ "--value": `${((value - min) / (max - min)) * 100}%` }}
        onPointerDown={start}
        onChange={(e) => {
          start();
          onChange(+e.target.value);
        }}
        onPointerUp={end}
        onPointerCancel={() => {
          editing.current = false;
          onCancel?.();
        }}
        onLostPointerCapture={end}
        onBlur={end}
        onKeyDown={(e) => {
          if (
            [
              "ArrowLeft",
              "ArrowRight",
              "ArrowUp",
              "ArrowDown",
              "Home",
              "End",
              "PageUp",
              "PageDown",
            ].includes(e.key)
          )
            start();
        }}
        onKeyUp={end}
      />
    </label>
  );
}
export function Parameter({ label, name, history, format }) {
  const [min, max] = numericRanges[name];
  return (
    <Range
      label={label}
      value={history.state[name]}
      min={min}
      max={max}
      format={format}
      onStart={history.begin}
      onChange={(v) => history.preview((s) => ({ ...s, [name]: v }))}
      onEnd={history.end}
      onCancel={history.cancel}
    />
  );
}
/** One switch look for every on/off control in the app. */
export function Toggle({ label, note, checked, onChange, icon }) {
  return (
    <button
      type="button"
      className="toggle-row"
      role="switch"
      aria-checked={Boolean(checked)}
      onClick={() => onChange(!checked)}
    >
      <span>
        {icon}
        {label}
        {note && <small>{note}</small>}
      </span>
      <span className={"switch " + (checked ? "on" : "")} />
    </button>
  );
}
export function Switch({ label, name, history, note }) {
  return (
    <Toggle
      label={label}
      note={note}
      checked={history.state[name]}
      onChange={() => history.change((s) => ({ ...s, [name]: !s[name] }))}
    />
  );
}
/** Pill toggle for compact on/off rows (Bloom · Posterize · Invert). */
export function Pill({ label, checked, onChange, title }) {
  return (
    <button
      type="button"
      className={"pill " + (checked ? "on" : "")}
      aria-pressed={Boolean(checked)}
      title={title}
      onClick={() => onChange(!checked)}
    >
      <i />
      {label}
    </button>
  );
}
/** Segmented control: use instead of a <select> when there are 2–4 choices. */
export function Segmented({ label, value, options, onChange, className = "" }) {
  return (
    <div className={"segmented-field " + className}>
      {label && <span className="segmented-label">{label}</span>}
      <div className="segmented" role="radiogroup" aria-label={label}>
        {options.map((option) => {
          const [id, text] = Array.isArray(option) ? option : [option, option];
          return (
            <button
              type="button"
              role="radio"
              key={id}
              aria-checked={value === id}
              className={value === id ? "active" : ""}
              onClick={() => onChange(id)}
            >
              {text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
export function Select({ label, value, onChange, children }) {
  return (
    <label className="select-field">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {children}
      </select>
    </label>
  );
}

// ---- Section: collapsible, remembered, revealable --------------------------
const OPEN_KEY = "glitch-sections-v2";
function readOpen() {
  try {
    return JSON.parse(localStorage.getItem(OPEN_KEY) || "{}") || {};
  } catch {
    return {};
  }
}
function writeOpen(id, open) {
  try {
    localStorage.setItem(OPEN_KEY, JSON.stringify({ ...readOpen(), [id]: open }));
  } catch {
    /* Private mode: the section still toggles for this session. */
  }
}
let pendingReveal = null;
/** Ask a section (or text pane) to open, scroll into view and flash. */
export function requestReveal(detail) {
  pendingReveal = { ...detail, at: Date.now() };
  // Two frames: lets the target tab mount before sections look for it.
  requestAnimationFrame(() =>
    requestAnimationFrame(() =>
      window.dispatchEvent(new CustomEvent("glitch:reveal", { detail })),
    ),
  );
}
/** Subscribe to reveal requests; also replays one that arrived before mount. */
export function useReveal(handler) {
  const latest = useRef(handler);
  latest.current = handler;
  useEffect(() => {
    if (pendingReveal && Date.now() - pendingReveal.at < 1500)
      latest.current(pendingReveal);
    const listen = (e) => latest.current(e.detail);
    window.addEventListener("glitch:reveal", listen);
    return () => window.removeEventListener("glitch:reveal", listen);
  }, []);
}
/**
 * A collapsible group of controls.
 * - `id` looks up the short title, "is it on?" keys and reset keys in ui-index.
 * - Open/closed is remembered per section.
 * - A lime dot shows when the effect is currently affecting the artwork.
 */
export function Section({ id, title, aside, children, defaultOpen = false, forceOpen = false, history }) {
  const meta = id ? sectionMeta(id) : null;
  const label = title || meta?.title || id;
  const key = id || label;
  const [expanded, setExpanded] = useState(() => {
    const saved = readOpen()[key];
    return forceOpen || (typeof saved === "boolean" ? saved : defaultOpen);
  });
  const [flash, setFlash] = useState(false);
  const ref = useRef(null);
  useReveal((detail) => {
    const destination = effectDetails.find(d => d.id === detail.id);
    if (!id || (detail.id !== id && destination?.sectionId !== id)) return;
    pendingReveal = null;
    setExpanded(true);
    writeOpen(key, true);
    requestAnimationFrame(() => {
      const section = ref.current;
      if (!section) return;
      const target = destination ? section.querySelector(`[data-effect-detail="${destination.id}"]`) : section;
      // Open every ancestor laboratory, including nested optics and stitch systems.
      let ancestor = target;
      while (ancestor && ancestor !== section) {
        if (ancestor.tagName === "DETAILS") ancestor.open = true;
        ancestor = ancestor.parentElement;
      }
      // Only scroll the control panel; scrollIntoView can move the mobile canvas.
      const panel = section.closest('.inspector-scroll');
      if (panel && target) panel.scrollTo({
        top: panel.scrollTop + target.getBoundingClientRect().top - panel.getBoundingClientRect().top -
          (section.closest('.effects-workbench')?.querySelector('.effects-nav')?.getBoundingClientRect().height || 0) - 12,
        behavior: 'instant',
      });
      if (destination && target) {
        target.classList.remove('is-flashing');
        requestAnimationFrame(() => target.classList.add('is-flashing'));
        setTimeout(() => target.classList.remove('is-flashing'), 1400);
        target.querySelector('summary')?.focus({preventScroll: true});
      } else section.querySelector('.section-disclosure')?.focus({preventScroll: true});
    });
    setFlash(true);
    setTimeout(() => setFlash(false), 1400);
  });
  const active = history && meta ? sectionActive(meta, history.state) : false;
  const resettable = history && meta?.reset?.length;
  function toggle() {
    setExpanded((v) => {
      writeOpen(key, !v);
      return !v;
    });
  }
  return (
    <section
      ref={ref}
      className={
        "control-section " + (expanded ? "" : "is-collapsed ") + (flash ? "is-flashing" : "")
      }
      data-section={id}
    >
      <div className="section-heading">
        <button
          type="button"
          className="section-disclosure"
          aria-expanded={expanded}
          onClick={toggle}
        >
          <span className="section-title">
            {label}
            {active && <i className="on-dot" title="Currently affecting your artwork" />}
          </span>
          <ChevronDown size={15} className={expanded ? "expanded" : ""} />
        </button>
        {aside}
      </div>
      {expanded && (
        <div className="section-body">
          {meta?.hint && <p className="section-hint">{meta.hint}</p>}
          {children}
          {resettable && (
            <button
              type="button"
              className="reset-link"
              onClick={() =>
                history.change((s) => {
                  const next = { ...s };
                  for (const k of meta.reset) if (initial[k] !== undefined) next[k] = initial[k];
                  return next;
                })
              }
            >
              <RotateCcw size={11} /> Reset {label.toLowerCase()}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
