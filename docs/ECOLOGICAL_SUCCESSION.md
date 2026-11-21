# Wave 20 — Ecological Succession

**An ecosystem starts changing its own geology.** The substrate is no longer just an independent nutrient map. Living colonies leave inherited chemical deposits that become local, saved, visible soil histories.

## What changed

- **Five soil chemistries:** Pioneer enrichment, Nutrient exhaustion, Allelopathic scars (A poisons, B enriches), Niche inversion, and Symbiotic compost.
- **Six-layer sediment memory:** One explicit century archives 1–3 living colonies according to deposit percentage; the original organisms and fossils are untouched. When six records are full, newly deposited generations replace the oldest *soil* impressions. Historical chemistry is stored per record, so changing the pending mode does not retcon existing strata.
- **Real ecology:** Each soil layer is applied *after* catastrophe and fossil chemistry in the CPU `substrateResourceAt` and identically in the GLSL substrate resource field. Selection fitness, nutrient-directed spore landing, descendant placement and visible sediment therefore respond to the same chemistry.
- **Scene controls:** Awaken living rock; deposit one/three centuries; deposit then evolve offspring (single Undo); shuffle the soil; hide without deleting; explicitly clear (confirm); soil nutrient census; read the geological archive.
- **Surprise/Full Weird:** Weighted optional ecological history, suppressed by default when an active fossil render loop is already present, unless heavy effects are allowed.
- **Mobile safety:** At most six `vec4` patches; no additional render pass, texture or feedback. Compile only if succession is active and the mineral substrate exists. GPU compile failure falls back to the previous mineral renderer.

## Guarantees

One Undo per gesture, 16 living colony maximum, up to 4095 geological centuries; no hidden death, no background CPU evolution, no mutation on normal animation playback. All existing text, color palettes, fossils, and other creative settings remain intact. Existing recipes migrate to succession OFF.

## Still to verify on device

Run `npm test` and `npm run build`, then check iPhone Safari WebGL2 compilation, PNG/GIF/MP4 parity, and the iOS control layout. No Netlify deploy is requested.
