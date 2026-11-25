import React, { useRef, useState } from 'react';
import { ArrowLeft, Search, Star, ArrowUpRight } from 'lucide-react';
import { effectCategories } from '../ui-index.js';
import { effectDetails } from '../effect-details.js';
import { effectEntries, effectEntry, entryActive, parentSection, readFavorites,
  directoryEntries, validCategory, FAVORITES_KEY, entriesForScope } from '../effects-navigation.js';
import { Section, requestReveal, useReveal } from './Controls';
import '../effects-workbench.css';

const NAV_KEY = 'glitch-effect-category-v2';
const ECOSYSTEM_NAV_KEY = 'glitch-ecosystem-category-v1';
const WEAVING_NAV_KEY = 'glitch-weaving-category-v1';
const navKey=scope=>scope==='ecosystem'?ECOSYSTEM_NAV_KEY:scope==='weaving'?WEAVING_NAV_KEY:NAV_KEY;
function initialCategory(scope) {
  const fallback=scope==="ecosystem"?"Organisms":scope==="weaving"?"Materials":"Signal";
  try { const value=localStorage.getItem(navKey(scope)); return value?validCategory(value):fallback; } catch { return fallback; }
}
export default function EffectsWorkbench({ history, body, quickToggles, scope = "effects" }) {
  const scoped = entriesForScope(scope);
  const categories = effectCategories.filter(c=>scoped.some(e=>e.group===c.id));
  const inScope = e=>Boolean(e&&scoped.some(item=>item.id===e.id));
  const [category, setCategory] = useState(()=>categories.some(c=>c.id===initialCategory(scope))?initialCategory(scope):categories[0].id);
  const [view, setView] = useState('browse');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [favorites, setFavorites] = useState(() => { try { return readFavorites(localStorage); } catch { return []; } });
  const root = useRef(null);
  const search = useRef(null);
  const selectedEntry = effectEntry(selected);
  const meta = selectedEntry && effectEntry(parentSection(selectedEntry));
  const activeCount = scoped.filter(e => entryActive(e, history.state)).length;
  const entries = directoryEntries({view, category, query, favorites, state: history.state}).filter(e=>scope==="effects"&&query.trim()?true:inScope(e));
  const family = effectCategories.find(c => c.id === (meta?.group || category));
  const scrollTop = () => root.current?.closest('.inspector-scroll')?.scrollTo({top: 0});
  function chooseFamily(value) {
    setCategory(value);
    try { localStorage.setItem(navKey(scope), value); } catch { /* session only */ }
    setSelected(null); setQuery(''); scrollTop();
  }
  function bookmark(id) {
    setFavorites(previous => {
      const next = previous.includes(id) ? previous.filter(x => x !== id) : [...previous, id];
      try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(next)); } catch { /* session only */ }
      return next;
    });
  }
  function open(entry) {
    setSelected(entry.id);
    requestReveal({id: entry.id});
  }
  useReveal(detail => {
    const entry = effectEntry(detail.id);
    if (inScope(entry)) {
      setSelected(entry.id);
      setCategory(entry.group);
    }
  });
  function back() { setSelected(null); scrollTop(); }
  function star(entry) {
    return <button type="button" className="effect-star"
      aria-label={`${favorites.includes(entry.id) ? 'Unfavorite' : 'Favorite'} ${entry.title}`}
      aria-pressed={favorites.includes(entry.id)} onClick={() => bookmark(entry.id)}>
      <Star size={17} fill={favorites.includes(entry.id) ? 'currentColor' : 'none'}/>
    </button>;
  }
  return <div className={"effects-workbench " + (selectedEntry ? "is-editing" : "")} ref={root} style={{'--family-color': family.color}}>
    <div className="effects-nav">
      <div className="effects-heading"><span>{scope==="ecosystem"?"LIVING LABS":scope==="weaving"?"TEXTILE LABS":"CONTROL ROOM"}</span><small>{activeCount} active systems</small></div>
      <div className="effects-views" role="group" aria-label="Effects views">
        {[["browse", "Explore"], ["active", `Active · ${activeCount}`], ["favorites", `Favorites · ${favorites.filter(id=>scoped.some(e=>e.id===id)).length}`]].map(([id,label]) =>
          <button type="button" key={id} aria-pressed={view === id}
            onClick={() => {setView(id); setSelected(null); setQuery(''); scrollTop();}}>{label}</button>)}
      </div>
      {selectedEntry ? <><div className="effect-editor-nav">
        <button type="button" onClick={back}><ArrowLeft size={16}/> {query ? 'Search results' : view === 'browse' ? category : view === 'active' ? 'Active effects' : 'Favorites'}</button>
        <button type="button" aria-label={scope==="ecosystem"?"Search ecosystem":scope==="weaving"?"Search weaving":"Search all effects"} onClick={() => {back(); requestAnimationFrame(() => search.current?.focus());}}><Search size={17}/></button>
      </div>
      {effectDetails.some(d => d.sectionId === meta.id) && <label className="effect-lab-jump">
        <select aria-label="Jump to a laboratory" value={selectedEntry.sectionId ? selectedEntry.id : ''}
          onChange={e => e.target.value && open(effectEntry(e.target.value))}>
          <option value="">Jump to a laboratory…</option>
          {effectDetails.filter(d => d.sectionId === meta.id).map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
        </select>
      </label>}</> : <div className="effect-browse-tools">
        {view === 'browse' && <label className="effect-family-select"><span className="sr-only">Effect family</span>
          <select aria-label="Effect family" value={category} onChange={e => chooseFamily(e.target.value)}>
            {categories.map(c => <option key={c.id} value={c.id}>{c.id} · {scoped.filter(e => !e.sectionId && e.group === c.id).length}</option>)}
          </select>
        </label>}
        <label className="effects-search"><Search size={16}/><input ref={search} type="search" value={query}
          aria-label={scope==="ecosystem"?"Search ecosystem":scope==="weaving"?"Search weaving":"Search all effects"} placeholder={scope==="ecosystem"?"Find a living laboratory…":scope==="weaving"?"Find a weave, stitch or fiber…":"Find any effect or laboratory…"} onChange={e => setQuery(e.target.value)}/></label>
      </div>}
    </div>
    {selectedEntry ? <div className="effect-editor">
      <Section key={meta.id} id={meta.id} history={history} defaultOpen forceOpen aside={star(selectedEntry)}>
        {body[meta.id]}
      </Section>

    </div> : <>
      <div className="effect-directory-heading"><h2>{query ? 'Search results' : view === 'browse' ? category : view === 'active' ? 'In the mix' : 'Your favorites'}</h2><span>{entries.length}</span></div>
      <p className="effect-directory-note">{query ? 'Across the available families, including nested laboratories.' : view === 'browse' ? family.description : view === 'active' ? 'Enabled sections and laboratories. Open one to tune its controls.' : 'Your shortcuts, saved on this device separately from artwork.'}</p>
      <div className="effect-directory">
        {entries.map(entry => <div className="effect-card" key={entry.id}>
          <button className="effect-card-open" type="button" onClick={() => open(entry)}>
            <span className={'effect-status ' + (entryActive(entry, history.state) ? 'is-on' : '')} aria-label={entryActive(entry, history.state) ? 'Active' : 'Inactive'}/>
            <span><strong>{entry.title}</strong><small>{entry.sectionId ? `${entry.group} / ${effectEntry(entry.sectionId).title}` : entry.group}</small></span>
            <ArrowUpRight size={15}/>
          </button>{star(entry)}
        </div>)}
      </div>
      {!entries.length && <p className="effect-empty">{query ? 'No effects found. Try a material, behavior or control name.' : view === 'favorites' ? 'Tap a star beside an effect or laboratory to keep it here.' : 'No effects enabled yet. Explore a family and turn something up.'}</p>}
      {scope === "effects" && <div className="effect-quick-strip"><span>Quick switches</span>{quickToggles}</div>}
      <p className="effect-directory-foot">{scope==="weaving"?"Velvet and fractal crochet controls are also below.":"Math engines & Shader Vault live in Math."} Artwork stays unchanged while you explore.</p>
    </>}
  </div>;
}
