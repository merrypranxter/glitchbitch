# GLITCHBITCH / FILAMENT FORGE — Self-Weaving Motion Zoo

## Design intent

This wave expands **animation behavior**, not the underlying geometry species. The screenshot shows the five existing stitch motions. All five retain their exact names, indices and operational logic, including `Unfurl & resew`. The shader still reveals **actual** generated thread cores, halos, highlights, sculpted relief, hybrid crossings and materials, rather than drawing an unrelated fullscreen mask.

## Ten new stitch motion laws

| Mode | Geometry-following motion |
| --- | --- |
| Helix handoff | Two counter-moving carriers transfer luminous needle pulses |
| Knot cascade | Individual seeded stitch nodes fire consecutively |
| Synaptic firing | Traveling neuronal bursts with decaying afterglow |
| Alien Morse | Deterministic seeded dash/dot symbols traveling through thread |
| Coral accretion | Expanding nested reef rings advance along the filament |
| Tidal darning | Two interfering drifting fronts build soft crossed seams |
| Fractal infestation | Three nested growth frequencies advance at different speeds |
| Reverse unpick | A moving region erases thread and resews it from behind |
| Ricochet needle | A bidirectional needle scans back and forth over stitch positions |
| Wormhole crochet | Logarithmic/angle-dependent spiral reconstruction |

These motions use the same normalized `time`, `filamentStitchSpeed`, length, presence, glow and seeded phase as the previous five. No timers, JS per-frame loops, shader textures, second renderer or external dependencies were introduced.

## Mobile UI

**Effects → Texture → Filament Forge → Self-Weaving Loom** now offers four optgroups in the motion dropdown, a one-line explanation of the selected stitch, a total of 15 ready-made recipes, Shuffle stitch motions, Shuffle new weird stitches, Start weaving, and Hold finished fabric.

Both shuffle buttons keep the author's words, colors, palette, ratio, underlying engine, chosen thread species, thread materials, crossbreed and existing effects. Only stitch-related controls are randomized. Global Surprise also samples the new modes because it already uses `filamentStitchModes`.

## Performance and preservation

The original filament renderer already prunes geometry to one or two species. This patch additionally prunes unselected **stitch-mode branches** when the stitch shader is active: the GPU compiles only the selected stitch behavior, even when the dropdown has 15 entries. It preserves the existing optional stitch shader fallback and PNG/GIF/MP4 export-time sampling.

Old recipes default to Needle chase with the stitch presence at zero. Existing five-mode recipes continue to use the same indices and control values. Stitching never forces old dormant artwork to become active.

## Verification to perform

Run `npm test` and `npm run build` and exercise every mode in iOS Safari, in single and hybrid Filament Forge, with Thread Alchemy and Sculpted Threads on/off. Verify GIF/MP4 encode parity in the same aspect ratios as live preview. This commit does not trigger a deploy.

## Future follow-up

Use the same behavior-first thinking to expand *other* existing mode dropdowns, starting with Photons, Living Underlays, Microstructure and Material Systems. Avoid generic parameter aliases; each addition should have its own mathematical reason to move.
