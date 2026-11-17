const validHex = (c) => typeof c === "string" && /^#[0-9a-f]{6}$/i.test(c);
export const PALETTE_SCHEMA = "glitchbitch/palette-library/v1";
export function normalizePalette(entry, index = 0) {
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) throw Error("Invalid palette entry.");
  const raw = Array.isArray(entry.colors) ? entry.colors :
    Array.isArray(entry.stops) ? entry.stops.map(s => typeof s === "string" ? s : s.hex) : null;
  if (!raw || raw.length < 2 || raw.length > 12 || !raw.every(validHex))
    throw Error("Palette " + (index + 1) + " needs 2–12 six-digit hex stops.");
  return { name: String(entry.name || "Imported " + (index + 1)).trim().slice(0, 70) || "Imported " + (index + 1), colors: raw.map(c => c.toLowerCase()) };
}
export function parsePaletteLibrary(text) {
  if(typeof text !== "string" || text.length > 2000000) throw Error("Palette file is too large.");
  const value = JSON.parse(text);
  const source = Array.isArray(value) ? value : value?.palettes;
  if(!Array.isArray(source) || source.length > 1000) throw Error("Expected a JSON palette list.");
  const unique = new Set();
  return source.map(normalizePalette).filter(p => {
    const signature = p.colors.join(",");
    if(unique.has(signature))return false;
    unique.add(signature);return true;
  });
}
export function paletteLibraryDocument(palettes) {
  if(!Array.isArray(palettes))throw Error("Missing palettes.");
  return { schema: PALETTE_SCHEMA, exportedAt: new Date().toISOString(),
    palettes: palettes.map(normalizePalette) };
}
export function mergePalettes(existing, incoming, max = 128) {
  const signatures = new Set(existing.map(p => p.colors.map(c => c.toLowerCase()).join(",")));
  const added = [], skipped = [];
  for (const p of incoming.map(normalizePalette)) {
    const signature = p.colors.join(",");
    if(signatures.has(signature) || existing.length + added.length >= max) {skipped.push(p.name);continue;}
    signatures.add(signature);added.push(p);
  }
  return { palettes: [...existing, ...added], added, skipped };
}
