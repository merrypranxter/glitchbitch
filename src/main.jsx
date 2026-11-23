import React, { useState, useRef, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import {
  Asterisk,
  FilePlus2,
  Download,
  Shuffle,
  Dices,
  Pause,
  Play,
  Undo2,
  Redo2,
  Maximize,
  Minimize,
  Hand,
  Sparkles,
  ArrowUpRight,
  Check,
  Bookmark,
  Upload,
  RotateCcw,
  LockKeyhole,
  Unlock,
  HelpCircle,
  BookOpen,
  SlidersHorizontal,
  Palette,
  Layers,
  Type,
  ChevronDown,
  LoaderCircle,
  X,
  Search,
} from "lucide-react";
import ArtCanvas from "./ArtCanvas";
import ColorLab from "./components/ColorLab";
import {
  MathInspector,
  EffectsInspector,
  TextInspector,
  LayersInspector,
  TouchInspector,
} from "./components/Inspectors";
import ExportDialog from "./components/ExportDialog";
import Lookbook from "./components/Lookbook";
import Modal from "./components/Modal";
import Collection from "./components/Collection";
import FindControl from "./components/FindControl";
import { requestReveal } from "./components/Controls";
import { engines, engineInfo, ratios, parseDocument, randomize } from "./data";
import { fullWeirdShuffle } from "./ecosystem-randomizer.js";
import useHistory from "./useHistory";
import {createNewCanvas} from "./new-canvas.js";
import {
  loadDraft,
  saveDraft,
  loadCollection,
  storeCollection,
  loadCustomPalettes,
} from "./storage";
import { thumbnail } from "./export";
import { mergePalettes } from "./palette-io";
import "./style.css";
const formatTime = (t) => {
  const seconds = Math.max(0, Math.floor(t));
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
};
function App() {
  const [draft] = useState(loadDraft),
    history = useHistory(draft.state),
    state = history.state;
  const [title, setTitle] = useState(draft.title),
    [playing, setPlaying] = useState(
      () => !matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
    [timeline, setTimeline] = useState(draft.timeline),
    [status, setStatus] = useState({}),
    [quality, setQuality] = useState("Auto");
  const [leftTab, setLeftTab] = useState("Math"),
    [rightTab, setRightTab] = useState("Effects"),
    [page, setPage] = useState("Studio"),
    [mobilePanel, setMobilePanel] = useState("Math"),
    [focus, setFocus] = useState(false),
    [modal, setModal] = useState(null);
  // Avoid two simultaneous WebGL renderers on memory-limited iPhones.
  const [exportRendererBusy,setExportRendererBusy] = useState(false);
  const [exportStill,setExportStill] = useState(null);
  const [tool, setTool] = useState("Paint"),
    [handles, setHandles] = useState(false),
    [selected, setSelected] = useState(null),
    [locks, setLocks] = useState({ engine: false, color: false });
  const [saved, setSaved] = useState(loadCollection),
    [customPalettes, setCustomPalettes] = useState(loadCustomPalettes),
    [saving, setSaving] = useState(false),
    [notice, setNotice] = useState(null);
  const [canvasPaneRatio,setCanvasPaneRatio] = useState(()=>{
    try {
      const n=Number(localStorage.getItem("glitch-studio-pane-v1"));
      return n>=.30&&n<=.78?n:.58;
    }catch{return .58;}
  });
  const studioMainRef=useRef(null),dragDividerRef=useRef(null);
  const clampPane=n=>{
    const height=studioMainRef.current?.getBoundingClientRect().height||0;
    const upper=height>0 ? Math.min(.78,Math.max(.30,1-175/height)) : .78;
    return Math.max(.30,Math.min(upper,n));
  };
  function resizeDividerDown(e) {
    if(e.pointerType==="mouse" && e.button!==0)return;
    dragDividerRef.current=e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
  }
  function resizeDividerMove(e) {
    if(dragDividerRef.current!==e.pointerId)return;
    const rect=studioMainRef.current?.getBoundingClientRect();
    if(!rect||rect.height<1)return;
    setCanvasPaneRatio(clampPane((e.clientY-rect.top)/rect.height));
  }
  function resizeDividerEnd(e) {
    if(dragDividerRef.current!==e.pointerId)return;
    dragDividerRef.current=null;
    try{localStorage.setItem("glitch-studio-pane-v1",String(canvasPaneRatio));}
    catch{/* Private mode still allows resizing during this session. */}
  }
  function resizeDividerKey(e) {
    let next=null;
    if(e.key==="ArrowDown")next=canvasPaneRatio+.04;
    if(e.key==="ArrowUp")next=canvasPaneRatio-.04;
    if(e.key==="Home")next=.30;
    if(e.key==="End")next=.78;
    if(next!==null){
      e.preventDefault();
      setCanvasPaneRatio(clampPane(next));
      try{localStorage.setItem("glitch-studio-pane-v1",String(clampPane(next)));}catch{}
    }
  }
  const canvasRef = useRef(null),
    timelineRef = useRef({ ...draft.timeline }),
    fileRef = useRef(null),
    noticeTimer = useRef(null),
    latest = useRef(null),
    savingRef = useRef(false),
    storageWarning = useRef(false);
  const onExportBusy=useCallback((value)=>{
    if(value){
      // Keep an image of the preview visible while its GPU is released.
      // WebGL preserveDrawingBuffer is enabled in createRenderer().
      let still=null;
      try{
        if(canvasRef.current?.width>0)still=canvasRef.current.toDataURL("image/png");
      }catch{/* Safari may deny canvas capture under memory pressure. */}
      setExportStill(still);
    }else setExportStill(null);
    setExportRendererBusy(Boolean(value));
  },[]);
  latest.current = {
    history,
    title,
    saved,
    customPalettes,
    playing,
    page,
    modal,
  };
  const toast = useCallback((message, action) => {
    clearTimeout(noticeTimer.current);
    setNotice({ message, action });
    noticeTimer.current = setTimeout(
      () => setNotice(null),
      action ? 7000 : 4200,
    );
  }, []);
  function persistDraft() {
    if (latest.current.history.isEditing()) return;
    try {
      saveDraft(
        latest.current.history.current.current,
        latest.current.title,
        timelineRef.current,
      );
    } catch {
      if (!storageWarning.current) {
        storageWarning.current = true;
        toast("Browser storage is full. Export a recipe to keep your work.");
      }
    }
  }
  useEffect(() => {
    const timer = setTimeout(persistDraft, 350);
    return () => clearTimeout(timer);
  }, [state, history.revision, title]);
  useEffect(() => {
    const id = setInterval(persistDraft, 2500);
    window.addEventListener("pagehide", persistDraft);
    return () => {
      clearInterval(id);
      clearTimeout(noticeTimer.current);
      window.removeEventListener("pagehide", persistDraft);
    };
  }, []);
  function showMobile(name) {
    setFocus(false);
    setMobilePanel(name);
    if (["Math", "Color"].includes(name)) setLeftTab(name);
    else setRightTab(name);
  }
  function fullscreen() {
    const stage = canvasRef.current?.closest(".art-stage");
    if (document.fullscreenElement) document.exitFullscreen?.();
    else if (stage?.requestFullscreen)
      stage
        .requestFullscreen()
        .catch(() =>
          toast(
            "Fullscreen is unavailable. Use Focus mode for a larger canvas.",
          ),
        );
    else setFocus((x) => !x);
  }
  useEffect(() => {
    function key(e) {
      const target = e.target,
        typing =
          target.isContentEditable ||
          ["TEXTAREA", "SELECT"].includes(target.tagName) ||
          (target.tagName === "INPUT" && target.type !== "range");
      if (latest.current.modal) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setModal("find");
        return;
      }
      if (typing) return;
      if (e.key === "/") {
        e.preventDefault();
        setModal("find");
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        e.shiftKey
          ? latest.current.history.redo()
          : latest.current.history.undo();
        return;
      }
      if (e.key.toLowerCase() === "h") setFocus((x) => !x);
      if (e.key.toLowerCase() === "f") fullscreen();
      if (e.key === "?") setModal("help");
      if (target.closest("button,input")) return;
      if (e.code === "Space") {
        e.preventDefault();
        setPlaying((x) => !x);
      }
    }
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  function confirmNewCanvas() {
    // The native modal explicitly required a second, conscious tap.
    // Reset the document and every editing clock; never touch saved works.
    const fresh=createNewCanvas();
    history.reset(fresh.state);
    setTitle(fresh.title);
    timelineRef.current={...fresh.timeline};
    setTimeline({...fresh.timeline});
    setStatus({});
    setSelected(null);
    setTool("Paint");
    setHandles(false);
    setLocks({engine:false,color:false});
    setFocus(false);
    setPage("Studio");
    setPlaying(!matchMedia("(prefers-reduced-motion: reduce)").matches);
    setModal(null);
    // Persist immediately, not just on the next autosave timer, so a
    // subsequent reload cannot revive the discarded old in-progress draft.
    try {
      saveDraft(fresh.state,fresh.title,fresh.timeline);
    } catch {
      toast("New canvas loaded. Storage is unavailable; export a recipe to keep it.");
      return;
    }
    toast("Fresh starter canvas. Original seed, palette, effects and clocks restored.");
  }
  function surprise(mutate = false) {
    history.change((s) => randomize(s, locks, mutate));
    toast(
      mutate
        ? "A small mutation. A new direction."
        : "Complete rebirth. New math, colors, strokes and motion. Undo takes you back.",
    );
  }
  function freakshow() {
    history.change(s=>fullWeirdShuffle(s,Math.random,{
      level:"Wild", preserveColors:!!locks.color,
      preserveText:true, preserveCore:false,
      allowDual:true, allowHeavy:false,
      baseRandomizer:(original,rng)=>randomize(original,locks,false,rng),
    }));
    toast("Freakshow! Weird ecosystems + old effects reshuffled. Your words survive. Undo is ready.");
  }
  async function saveWork() {
    if (savingRef.current) return;
    if (latest.current.saved.length >= 40) {
      toast("Your vault has 40 works. Export or remove one to make room.");
      return;
    }
    savingRef.current = true;
    setSaving(true);
    const snapshot = history.current.current,
      at = { ...timelineRef.current },
      name = title;
    try {
      const thumb = await thumbnail(snapshot, at),
        entry = {
          id: Date.now(),
          title: name,
          state: snapshot,
          timeline: at,
          thumb,
        };
      const next = [entry, ...latest.current.saved];
      storeCollection(next);
      setSaved(next);
      toast("Saved to your personal glitch vault.");
    } catch (e) {
      toast(
        e.message.includes("quota")
          ? "Browser storage is full. Export a recipe instead."
          : `Could not save: ${e.message}`,
      );
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }
  function deleteWork(id) {
    const entry = saved.find((s) => s.id === id);
    try {
      const next = saved.filter((s) => s.id !== id);
      storeCollection(next);
      setSaved(next);
      toast("Removed from your vault.", {
        label: "Undo",
        run: () => {
          try {
            const restored = [entry, ...latest.current.saved].sort(
              (a, b) => b.id - a.id,
            );
            storeCollection(restored);
            setSaved(restored);
            toast("Artwork restored.");
          } catch {
            toast("Could not restore artwork. Browser storage is full.");
          }
        },
      });
    } catch {
      toast("Could not update browser storage.");
    }
  }
  function loadWork(work) {
    history.change(work.state);
    setTitle(work.title);
    timelineRef.current = { ...work.timeline };
    setTimeline({ ...work.timeline });
    setPlaying(false);
    setPage("Studio");
    setSelected(null);
    toast("Back to the exact frame you saved.");
  }
  async function importRecipe(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      if (file.size > 1e6) throw Error("Recipes must be smaller than 1 MB.");
      const doc = parseDocument(JSON.parse(await file.text()));
      history.change(doc.state);
      setTitle(doc.title);
      timelineRef.current = { ...doc.timeline };
      setTimeline({ ...doc.timeline });
      setPlaying(false);
      setPage("Studio");
      setSelected(null);
      toast("Recipe restored. Press play to keep exploring.");
    } catch (err) {
      toast(`Could not load recipe: ${err.message}`);
    } finally {
      e.target.value = "";
    }
  }
  function importPaletteLibrary(incoming) {
    try {
      const result = mergePalettes(customPalettes, incoming, 128);
      localStorage.setItem("glitch-palettes", JSON.stringify(result.palettes));
      setCustomPalettes(result.palettes);
      toast(`${result.added.length} palettes imported; ${result.skipped.length} duplicates or over-limit skipped.`);
    } catch (e) {
      toast(`Palette import failed: ${e.message}`);
    }
  }
  function savePalette(p) {
    if (customPalettes.length >= 128) {
      toast("You have 128 custom palettes. Remove one to add another.");
      return;
    }
    try {
      const next = [...customPalettes, p];
      localStorage.setItem("glitch-palettes", JSON.stringify(next));
      setCustomPalettes(next);
      toast(`“${p.name}” added to your palette vault.`);
    } catch {
      toast("Could not save palette. Browser storage is full.");
    }
  }
  function deletePalette(index) {
    try {
      const next = customPalettes.filter((_, i) => i !== index);
      localStorage.setItem("glitch-palettes", JSON.stringify(next));
      setCustomPalettes(next);
    } catch {
      toast("Could not update browser storage.");
    }
  }
  function applyLook(look) {
    history.change((s) => ({ ...look.state, ratio: s.ratio, marks: s.marks }));
    setModal(null);
    toast(`Exploring “${look.name}”. Undo takes you back.`);
  }
  function pickControl(hit) {
    setModal(null);
    if (hit.kind === "action") {
      if (hit.id === "export") setModal("export");
      else if (hit.id === "new-canvas") setModal("new-canvas");
      else if (hit.id === "lookbook") setModal("lookbook");
      else if (hit.id === "help") setModal("help");
      else if (hit.id === "save") saveWork();
      else if (hit.id === "surprise") surprise();
      return;
    }
    setPage("Studio");
    showMobile(hit.tab);
    requestReveal({ id: hit.id, pane: hit.pane });
  }
  const active =
    state.blend > 0
      ? `${engines[state.engine]} × ${engines[state.secondaryEngine]}`
      : engines[state.engine];
  return (
    <div className={"app " + (focus ? "focus-mode " : "") + (page==="Studio" ? "studio-page" : "")}>
      <header>
        <button
          className="brand"
          onClick={() => setPage("Studio")}
          aria-label="GLITCHHHHHH studio"
        >
          <Asterisk className="brand-mark" size={43} strokeWidth={2.3} />
          <span>
            GLITCHHHHHH<small>YOUR HAPPY LITTLE ACCIDENT MACHINE</small>
          </span>
        </button>
        <nav aria-label="Main navigation">
          {["Studio", "Saved works"].map((t) => (
            <button
              className={page === t ? "active" : ""}
              aria-current={page === t ? "page" : undefined}
              onClick={() => setPage(t)}
              key={t}
            >
              {t}
              {t === "Saved works" && <span>{saved.length}</span>}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="find-button"
            title="Find a control (Ctrl/Cmd+K or /)"
            onClick={() => setModal("find")}
          >
            <Search size={14} />
            <span>Find a control</span>
            <kbd>/</kbd>
          </button>
          <button
            className="icon-button help-button"
            title="How to play"
            onClick={() => setModal("help")}
          >
            <HelpCircle size={17} />
          </button>
          <button
            className="button secondary load-button"
            onClick={() => fileRef.current.click()}
          >
            <Upload size={14} />
            <span>Load recipe</span>
          </button>
          <button
            className="button primary export-button"
            onClick={() => setModal("export")}
          >
            <Download size={15} />
            <span>Export</span>
            <ArrowUpRight size={14} />
          </button>
        </div>
      </header>
      {page === "Studio" ? (
        <main className="studio-main" ref={studioMainRef}
          style={{"--canvas-pane-ratio": `${Math.round(canvasPaneRatio*100)}%`}}>
          <aside
            className={
              "left-panel inspector " +
              (["Math", "Color"].includes(mobilePanel) ? "mobile-open" : "")
            }
          >
            <div className="inspector-tabs">
              {[
                ["Math", SlidersHorizontal],
                ["Color", Palette],
              ].map(([t, Icon]) => (
                <button
                  key={t}
                  className={leftTab === t ? "active" : ""}
                  onClick={() => setLeftTab(t)}
                >
                  <Icon size={14} />
                  {t}
                </button>
              ))}
            </div>
            <div className="inspector-scroll">
              {leftTab === "Math" ? (
                <MathInspector
                  history={history}
                  locked={locks.engine}
                  onLock={() => setLocks((l) => ({ ...l, engine: !l.engine }))}
                  onLookbook={() => setModal("lookbook")}
                />
              ) : (
                <ColorLab
                  history={history}
                  customPalettes={customPalettes}
                  onSavePalette={savePalette}
                  onDeletePalette={deletePalette}
                  onImportPaletteLibrary={importPaletteLibrary}
                />
              )}
            </div>
          </aside>
          <div className="workspace">
            <div className="workspace-heading">
              <div className="art-heading">
                <span className="eyebrow">
                  THE PLAYGROUND{" "}
                  <span>/ {engineInfo[state.engine].family.toUpperCase()}</span>
                </span>
                <input
                  className="art-title"
                  aria-label="Artwork title"
                  value={title}
                  maxLength="100"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="seed">
                <label htmlFor="seed">SEED</label>
                <input
                  id="seed"
                  type="number"
                  aria-label="Seed"
                  min="0"
                  max="999999999"
                  value={state.seed}
                  onFocus={history.begin}
                  onChange={(e) => {
                    if (Number.isFinite(+e.target.value))
                      history.preview((s) => ({
                        ...s,
                        seed: Math.floor(
                          Math.max(0, Math.min(999999999, +e.target.value)),
                        ),
                      }));
                  }}
                  onBlur={history.end}
                />
                <button
                  className="icon-button"
                  title="Reseed"
                  onClick={() =>
                    history.change((s) => ({
                      ...s,
                      seed: Math.floor(Math.random() * 999999999),
                    }))
                  }
                >
                  <Shuffle size={14} />
                </button>
              </div>
            </div>
            <div className="canvas-context">
              <span>
                <i className="live-dot" />
                {active}
              </span>
              <div>
                <select
                  aria-label="Artwork aspect ratio"
                  value={state.ratio}
                  onChange={(e) =>
                    history.change((s) => ({ ...s, ratio: e.target.value }))
                  }
                >
                  {ratios.map((r) => (
                    <option key={r.id}>{r.id}</option>
                  ))}
                </select>
                <button
                  className="icon-button"
                  title={focus ? "Show controls" : "Focus mode"}
                  aria-pressed={focus}
                  onClick={() => setFocus((x) => !x)}
                >
                  {focus ? <Minimize size={14} /> : <Maximize size={14} />}
                </button>
              </div>
            </div>
            {exportRendererBusy ? (
              <div className="art-stage" aria-label="Live GPU preview temporarily parked during accurate export">
                <div className="art-surface"
                  style={{width:"100%",height:"100%",display:"grid",placeItems:"center"}}>
                  {exportStill ? <img src={exportStill}
                    alt="Frozen preview while the export renderer uses the GPU"
                    style={{width:"100%",height:"100%",objectFit:"contain"}}/> :
                    <p className="control-note">Preserving GPU memory for the exact-effects export…</p>}
                </div>
              </div>
            ) : (
              <ArtCanvas
                playing={playing && !modal}
                {...{ history, timelineRef, canvasRef, quality, tool, selected }}
                onStatus={setStatus}
                onTime={setTimeline}
                showHandles={handles}
                onSelect={setSelected}
              />
            )}
            <div className="transport">
              <button
                className="play"
                title={playing ? "Pause animation" : "Play animation"}
                onClick={() => setPlaying((x) => !x)}
              >
                {playing ? (
                  <Pause size={17} fill="currentColor" />
                ) : (
                  <Play size={17} fill="currentColor" />
                )}
              </button>
              <div className="undo-group">
                <button
                  className="icon-button"
                  title="Undo"
                  disabled={!history.canUndo}
                  onClick={history.undo}
                >
                  <Undo2 size={16} />
                </button>
                <button
                  className="icon-button"
                  title="Redo"
                  disabled={!history.canRedo}
                  onClick={history.redo}
                >
                  <Redo2 size={16} />
                </button>
              </div>
              <div
                className="time"
                title={`Geometry: ${timeline.time.toFixed(2)}s / Color: ${timeline.colorTime.toFixed(2)}s`}
              >
                <i className={playing ? "live-dot" : "paused-dot"} />
                <span>{playing ? "PLAYING" : "PAUSED"}</span>
                <b>{formatTime(timeline.time)}</b>
              </div>
              <button
                className="icon-button restart"
                title="Restart animation clocks"
                onClick={() => {
                  timelineRef.current = { time: 0, colorTime: 0, textTime: 0 };
                  setTimeline({ time: 0, colorTime: 0, textTime: 0 });
                }}
              >
                <RotateCcw size={14} />
              </button>
              <div className="quality-control">
                <select
                  aria-label="Preview quality"
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                >
                  {["Auto", "Eco", "Balanced", "Sharp"].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
                <span title="Measured animation frame cadence, not GPU timing">
                  {status.fps != null ? `${status.fps} fps` : "—"}
                </span>
              </div>
              <button
                className={"icon-button bookmark " + (saving ? "lime" : "")}
                title="Save artwork"
                disabled={saving}
                onClick={saveWork}
              >
                {saving ? (
                  <LoaderCircle size={17} className="spin" />
                ) : (
                  <Bookmark size={17} />
                )}
              </button>
              <button
                className="icon-button"
                title="Fullscreen artwork"
                onClick={fullscreen}
              >
                <Maximize size={16} />
              </button>
            </div>
            <div className="workspace-bottom">
              <button onClick={() => setModal("lookbook")}>
                <BookOpen size={14} />
                <span>
                  Lookbook <ArrowUpRight size={12} />
                </span>
              </button>
              <button
                type="button"
                className="new-canvas-button"
                title="New Canvas — restore the original starter after confirmation"
                aria-label="New Canvas (confirmation required)"
                onClick={() => setModal("new-canvas")}
              >
                <FilePlus2 size={14} />
                <span>New Canvas</span>
              </button>
              <span>
                {status.width && `${status.width} × ${status.height}`}
              </span>
              <div className="mobile-chaos">
                <button title="Mutate design" onClick={() => surprise(true)}>
                  <Shuffle size={14} />
                </button>
                <button title="Full weird shuffle, preserve your words" onClick={freakshow}>
                  <Dices size={14} /> Weird
                </button>
                <button onClick={() => surprise()}>
                  <Sparkles size={13} />
                  Surprise me
                </button>
              </div>
            </div>
          </div>
          <div className="studio-splitter" role="separator" aria-orientation="horizontal"
            aria-label="Resize artwork and controls" aria-valuemin={30}
            aria-valuemax={78} aria-valuenow={Math.round(canvasPaneRatio*100)}
            tabIndex={0}
            onPointerDown={resizeDividerDown}
            onPointerMove={resizeDividerMove}
            onPointerUp={resizeDividerEnd}
            onPointerCancel={resizeDividerEnd}
            onLostPointerCapture={resizeDividerEnd}
            onKeyDown={resizeDividerKey}
            onDoubleClick={()=>{
              setCanvasPaneRatio(.58);
              try{localStorage.setItem("glitch-studio-pane-v1",".58");}catch{}
            }}
            title="Drag to resize artwork and editor. Double-tap to reset."
          >
            <span className="splitter-grip"><i/><i/><i/></span>
            <span className="splitter-label">DRAG TO RESIZE</span>
          </div>
          <div className="mobile-controls" aria-label="Studio controls">
            {[
              ["Math", SlidersHorizontal],
              ["Color", Palette],
              ["Effects", Sparkles],
              ["Text", Type],
              ["Touch", Hand],
              ["Layers", Layers],
            ].map(([t, Icon]) => (
              <button
                key={t}
                className={mobilePanel === t ? "active" : ""}
                aria-expanded={mobilePanel === t}
                onClick={() => showMobile(t)}
              >
                <Icon size={16} />
                {t}
              </button>
            ))}
          </div>
          <aside
            className={
              "right-panel inspector " +
              (["Effects", "Text", "Touch", "Layers"].includes(mobilePanel)
                ? "mobile-open"
                : "")
            }
          >
            <div className="inspector-tabs">
              {[
                ["Effects", Sparkles],
                ["Text", Type],
                ["Touch", Hand],
                ["Layers", Layers],
              ].map(([t, Icon]) => (
                <button
                  className={rightTab === t ? "active" : ""}
                  onClick={() => setRightTab(t)}
                  key={t}
                  title={t}
                >
                  <Icon size={13} />
                  <span>{t}</span>
                </button>
              ))}
            </div>
            <div className="inspector-scroll">
              {rightTab === "Effects" ? (
                <EffectsInspector history={history} onTool={setTool} tool={tool} />
              ) : rightTab === "Text" ? (
                <TextInspector history={history} />
              ) : rightTab === "Layers" ? (
                <LayersInspector history={history} />
              ) : (
                <TouchInspector
                  {...{ history, tool, selected }}
                  onTool={setTool}
                  showHandles={handles}
                  onHandles={() => setHandles((x) => !x)}
                  onSelect={setSelected}
                />
              )}
            </div>
            <div className="chaos-dock compact">
              <button
                className={"dock-lock " + (locks.color ? "locked" : "")}
                aria-pressed={locks.color}
                title={locks.color ? "Palette locked: Surprise me keeps your colors" : "Lock palette so Surprise me keeps your colors"}
                onClick={() => setLocks((l) => ({ ...l, color: !l.color }))}
              >
                {locks.color ? <LockKeyhole size={13} /> : <Unlock size={13} />}
                <Palette size={13} />
              </button>
              <button className="dock-mutate" title="Small random nudge to the current design" onClick={() => surprise(true)}>
                <Shuffle size={13} /> Mutate
              </button>
              <button className="dock-mutate" title="Full weird shuffle: old effects + living colonies, preserves your text" onClick={freakshow}>
                <Dices size={13} /> Freakshow
              </button>
              <button className="surprise" title="Randomize math, palettes and now the new living ecosystems. Undo always works." onClick={() => surprise()}>
                <Sparkles size={16} />
                <span>Surprise me</span>
              </button>
            </div>
          </aside>
        </main>
      ) : (
        <Collection
          saved={saved}
          onLoad={loadWork}
          onDelete={deleteWork}
          onStudio={() => setPage("Studio")}
        />
      )}
      <footer>
        <span>
          <i className="live-dot" />
          ALL SYSTEMS A LITTLE UNSTABLE
        </span>
        <a
          href="https://github.com/merrypranxter/shaderslop_designs/tree/main/GLITCHY"
          target="_blank"
          rel="noreferrer"
        >
          INSPIRED BY THE GLITCHY VAULT <ArrowUpRight size={11} />
        </a>
        <span>
          BUILT TO GET WEIRD. <Asterisk size={12} />
        </span>
      </footer>
      <input
        type="file"
        hidden
        accept=".json,application/json"
        ref={fileRef}
        onChange={importRecipe}
      />
      {modal === "new-canvas" && (
        <Modal
          title="Start a NEW CANVAS?"
          subtitle="Return to Glitchbitch's original starter artwork."
          onClose={() => setModal(null)}
        >
          <div className="new-canvas-confirm">
            <p>
              This replaces the current unsaved canvas, including its strokes,
              effects, palette, text and animation position, with the exact
              original starter. The canvas undo/redo history starts fresh.
            </p>
            <p>
              <strong>Your Saved works vault and custom palettes will not be deleted.</strong>
              {" "}Save or export your current artwork first if you want to keep it.
            </p>
            <div className="new-canvas-confirm-actions">
              <button className="button secondary" type="button"
                onClick={() => setModal(null)}>
                Cancel — keep my art
              </button>
              <button className="button primary" type="button"
                onClick={confirmNewCanvas}>
                <FilePlus2 size={15}/> Yes, new canvas
              </button>
            </div>
          </div>
        </Modal>
      )}
      {modal === "export" && (
        <ExportDialog
          state={state}
          title={title}
          timelineRef={timelineRef}
          onClose={() => setModal(null)}
          onNotice={toast}
          onExportBusy={onExportBusy}
        />
      )}
      {modal === "find" && (
        <FindControl onPick={pickControl} onClose={() => setModal(null)} />
      )}
      {modal === "lookbook" && (
        <Lookbook onClose={() => setModal(null)} onApply={applyLook} />
      )}
      {modal === "help" && (
        <Modal
          title="Permission to get weird."
          subtitle="A little guide to your infinite art instrument."
          onClose={() => setModal(null)}
        >
          <div className="help-grid">
            <div>
              <Hand size={23} />
              <h3>Touch the math.</h3>
              <p>
                Drag to paint local forces. In Touch, choose Warp, Vortex,
                Repel, or Chroma. Use two fingers to resize, turn, and move a
                source. Move and Erase let you edit it later.
              </p>
            </div>
            <div>
              <Layers size={23} />
              <h3>Make worlds collide.</h3>
              <p>
                Pick an engine in Math. In Layers, mix in a second one. In
                Color, build a palette or choreograph color waves independently
                of the shape.
              </p>
            </div>
            <div>
              <Bookmark size={23} />
              <h3>Keep the good accidents.</h3>
              <p>
                Bookmark saves a frame in this browser. Export high-resolution
                PNGs, short videos, or a JSON recipe to restore every setting
                and both clocks. Saved work is local, not cloud-synced.
              </p>
            </div>
            <div>
              <Undo2 size={23} />
              <h3>Nothing is too precious.</h3>
              <p>
                Each stroke, pinch, slider gesture, or mutation is a single undo
                step. Escape or an interrupted touch cancels the active gesture.
                Surprise Me replaces everything but the aspect ratio; Mutate keeps and nudges your current design.
              </p>
            </div>
          </div>
          <div className="shortcuts">
            <span>
              <kbd>SPACE</kbd>Play / pause
            </span>
            <span>
              <kbd>Ctrl/Cmd Z</kbd>Undo
            </span>
            <span>
              <kbd>Shift Ctrl/Cmd Z</kbd>Redo
            </span>
            <span>
              <kbd>F</kbd>Fullscreen
            </span>
            <span>
              <kbd>H</kbd>Focus mode
            </span>
            <span>
              <kbd>?</kbd>This guide
            </span>
            <span>
              <kbd>/</kbd>Find a control
            </span>
          </div>
          <p className="modal-footnote">
            Preview quality only changes render resolution. Your equations,
            seed, palettes, and exports keep their full fidelity. Auto pauses
            the clocks when the tab is hidden.
          </p>
        </Modal>
      )}
      {notice && (
        <div className="toast" role="status">
          <Check size={16} />
          <span>{notice.message}</span>
          {notice.action && (
            <button
              onClick={() => {
                const action = notice.action;
                setNotice(null);
                action.run();
              }}
            >
              {notice.action.label}
            </button>
          )}
          <button
            className="toast-close"
            title="Dismiss notification"
            onClick={() => setNotice(null)}
          >
            <X size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
