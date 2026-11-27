import { sections, sectionActive, effectCategories } from './ui-index.js';
import { effectSearchTerms } from './effect-search-terms.js';
import { effectDetails } from './effect-details.js';

export const FAVORITES_KEY = 'glitch-effect-favorites-v1';
export const effectSections = sections.filter(s => s.tab === 'Effects');
export const colorEffectSections = sections.filter(s => s.tab === 'Color' && s.group);
export const effectEntries = [
  ...effectSections,
  ...colorEffectSections,
  ...effectDetails.map(d => ({ ...d, group: effectSections.find(s => s.id === d.sectionId)?.group })),
];
export const effectEntry = id => effectEntries.find(e => e.id === id);
export const entryActive = (entry, state) => entry.active ? entry.active(state) : sectionActive(entry, state);
export const parentSection = entry => entry.sectionId || entry.id;
export function readFavorites(storage) {
  try {
    const value = JSON.parse(storage.getItem(FAVORITES_KEY) || '[]');
    return Array.isArray(value) ? [...new Set(value)].filter(id => effectEntry(id)) : [];
  } catch { return []; }
}
export function directoryEntries({ view, category, query, favorites, state }) {
  const q = query.trim().toLowerCase();
  return effectEntries.filter(entry => {
    // Searching is always global, regardless of the selected family/dashboard.
    if (q) return [entry.title, entry.group, ...(entry.keywords || []), ...(entry.reset || []), ...(effectSearchTerms[entry.id] || [])]
      .some(text => text?.toLowerCase().includes(q));
    if (view === 'active') return entryActive(entry, state);
    if (view === 'favorites') return favorites.includes(entry.id);
    return !entry.sectionId && entry.group === category;
  });
}
export const validCategory = value => effectCategories.some(c => c.id === value) ? value : 'Signal';

const ecosystemIds=new Set(["chaos-lab","living-food-web","ecological-succession",
  "fossil-record","speciation-lab","coevolution-lab","apocalypse-clock",
  "selection-chamber","mutation-bloodlines","symbiosis-lab","substrate-alchemy",
  "spore-dynasty","colony-cortex","colony-anatomy","colony-life","atmosphere"]);
export const isEcosystemEntry=id=>{
  const entry=effectEntry(id);
  return Boolean(entry&&ecosystemIds.has(parentSection(entry)));
};
const weavingIds=new Set(["filament","underlay"]);
export const isWeavingEntry=id=>{
  if(id==="living-velvet"||id==="hyperbolic-crochet")return true;
  const entry=effectEntry(id);
  return Boolean(entry&&weavingIds.has(parentSection(entry)));
};
export const entriesForScope=scope=>effectEntries.filter(e=>
  scope==="color"?e.tab==="Color":scope==="ecosystem"?isEcosystemEntry(e.id):scope==="weaving"?isWeavingEntry(e.id):e.tab!=="Color"&&!isEcosystemEntry(e.id)&&!isWeavingEntry(e.id));
