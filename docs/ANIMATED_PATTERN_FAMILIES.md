# GLITCHBITCH — Animated Pattern Families
## Side quest: Alien bridal lace × Fractal veinwork

This is an implementation contract *and* the shipped inventory for the first family expansion.

### Ground truth: existing favorite modes

- **Alien bridal lace** is an existing **Filament Forge preset** whose geometry is **Fivefold brocade**. Preserve its original name, values and mathematical shape.
- **Fractal veinwork** is an existing **Filament Forge species** (shader index 5). Preserve its branch verbatim so saved art and existing hybrids remain compatible.

### Ten new genuinely moving geometries (shader indices 6–15)

| Family | Species | Moving mathematical structure |
| --- | --- | --- |
| Alien | Alien lattice | Drifted triple-axis hex mesh and pulsing junctions |
| Alien | Alien scriptwork | Seeded quasi-runic strokes, breathing loops, shifting glyphs |
| Alien | Glyph swarm | Individually rotating rune cells with morphing arc gaps |
| Alien | Xeno filament | Double-helix cable strands, traveling rung modulation |
| Vascular | Capillary bloom | Radial vessel fans with forklets and rhythmic circulation |
| Vascular | Mycelial veinwork | Multiscale rhizomorphic filaments, moving branch intersections |
| Vascular | Lightning lace | Quasi-jagged discharge tributaries and racing micro-sparks |
| Vascular | Root filigree | Gravity-biased curling trunks and branching rootlets |
| Vascular | Coral vasculature | Fan-shaped reef vessels, layered pore/rim motion |
| Vascular | Nerve net | Oscillating dendrites, synaptic halos, signal transmission |

Each species has distinct GLSL branch mathematics (not an alias, layer overlay, or parameter preset). Every new mode uses the existing `time` and `filamentMotion` to animate shapes and highlights. The original six species and exact indices are unchanged.

### Authoring / UI

- Filament Forge has **16 modes**, grouped into original lace, living veins, and alien inscriptions using native `optgroup` labels; the grouping exists for both primary and second-parent selectors.
- Ten corresponding named presets are in the existing preset dropdown, with nonzero motion and high contrast; two crossbreeding recipes bring the new families together.
- **Shuffle alien + veinwork** chooses among the ten new species and rebalances pattern scale, density, motion, thickness, relief and hue. It retains the author's words, color stops, seed, ratio, and other active artwork modules.
- Global **New stitch species**, **Reseed threads**, **Breed wild**, crossbreeding, Thread Alchemy materials and animated stitching continue working with the expanded species list.
- Existing `filamentSpecies` recipe strings stay valid; no new persisted fields, APIs or GPU uniform buffers.

### Safety and testing

- Existing renderer compiles the filament shader *only if active* and specializes geometry IDs. Its current graceful GPU fallback is untouched.
- No new framebuffer, image texture, per-frame JS loop, external dependency or import cycle.
- Do not replace original Fractal veinwork in shader index 5 with a more generic impostor.
- Regression checks: all sixteen species validate and save/load; ten new presets move (nonzero time dependence); all sixteen selectable as a hybrid parent; selection/shuffle retains colors and text; WebGL1 syntax compatibility and brace balance; find/search works; old presets untouched.
- On real device, verify low/mid/high `filamentScale`, PNG/GIF/MP4 equivalence, reduced-motion controls, orientation changes and expensive hybrid + material + stitch combinations.
- **No Netlify deploy** unless explicitly requested.

### Next families to audit (not shipped in this side quest)

These other existing mode-based systems deserve the same treatment, without guessing the user's favorites: **Living Underlay** (textile grounds), **Photon Zoo** (optical creatures), **Microstructure** (surface life), **Substance** (material textures), **Colony Anatomy** and **Cortex** (organic detail), plus **Filament Stitching**, **Material** and **Sculpt** behavior. Look for mathematically distinct animated modes, not just new palette labels. Keep the canvas pinned and tabs compact on iPhone.
