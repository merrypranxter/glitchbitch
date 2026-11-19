# LIVING CORTEX — WAVE 8

**Colony interiors become alive.** Earlier waves added two-parent atmosphere genetics, finger-painted habitat territories, reversible lifecycles, smart randomization, and noncircular mutant silhouettes. Wave 8 adds **local, layered biological-looking surface patterning** *inside those evolving silhouettes*.

## What artists can do

Open **Effects → Scene → Living Cortex**. Parent A and parent B each get an independently selectable motif:

- **Bare cortex** (default): untouched atmosphere and shape
- **Growth bands**: radial cortical strata, time-animated and warped around the actual lichen/flower/coral silhouette
- **Hyphal veins**: sharply tapered vascular-looking spokes and branching stemlets
- **Fruiting cups**: little repeated apothecia-like discs, distributed along a drifting internal ring
- **Living cortex**: all three motifs layered simultaneously for maximalist tissue

Four sliders govern visibility, internal detail, motion and pigment relief.

Controls:
- **Spawn cortex pair**: applies a named pair preset, turns on both Painted colonies habitats, awakens both atmospheres and creates missing A/B seed positions when necessary
- **Shuffle cortex**: randomizes internal material modes and controls, turns on parent A if necessary, but does **not** wake parent B unnecessarily
- **Hide cortex (keep seeds)**: immediately restores the old rendering with all painted seeds, anatomy shape, palette, words, force brush and growth cycle intact

All normal sliders and on-canvas planted seed handles remain fully editable.

## Ready-to-play samples

Four editable designs under the new **Living Cortex** Lookbook family, bringing the total to **126**:
1. **Centuries in a Petri Dish**
2. **Pixie Cup Broadcast**
3. **Luminous Vascular Cathedral**
4. **Opal Apothecia Colony**

Each combines two independently selected cortical patterns with seeded A/B territories, mutant anatomy, continuously moving lifecycles and the full palette vault.

**Shuffle Ecosystem, Freakshow and Surprise** now optionally generate interior cortex as well as colony outlines. The smart randomizer keeps ordinary optical designs free of invisible cortical settings. Default Cortex Amount = 0 so all older art and nonpainted masks continue rendering identically.

## Architecture

New module `src/colony-cortex.js` exports modes, four presets, a deterministic material shuffler, a zeroing reset, and the GLSL ES 1.00 cortex module.

Four new range-validated recipe fields:
- `colonyCortexAmount`
- `colonyCortexDetail`
- `colonyCortexMotion`
- `colonyCortexRelief`

Two new mode selectors: `colonyCortexA` and `colonyCortexB`. These fields default to Bare cortex; `colonyCortexAmount=0`. They are saved through existing recipe JSON, Undo/Redo and local vault.

**No extra texture samples, framebuffer, second mask pass or source buffer.** The original seeded habitat GLSL loop computes `distanceToSeed`, shape edge, mask softness, and parent identity. Wave 8 reuses these values and accumulates three cortex channels per parent *within that same loop*. The shared renderer colors these channels after its usual atmosphere compositing, using live palette, geometric mask and time. The computation is gated behind cortex amount and painted-habitat mode.

Material is time-continuous and deterministic. The visible motifs are artistically stylized mathematical analogues of cortex, hyphae and fruiting bodies, not genuinely protruding 3D photorealistic apothecia or a scientific lichen model.

## Compatibility and QA

No edits to the text compositor, font system, GIF/MP4 encoders, normal touch gesture engine or deployment files.

New test `tests/colony-cortex.test.mjs` checks:
- old recipes remain cortex-off and preserve original painted coordinates and colors
- presets and shuffles preserve seed positions, lettering, math engine, palette and lifecycle
- all invalid modes / numeric controls rejected by recipe validator
- all 126 Lookbook entries validate and round-trip exactly
- renderer injects each parent material only when its habitat is Painted colonies
- zero additional shader textures, seed-loop duplication or WebGL2-only syntax in the cortex module
- smart Surprise / Freakshow / Ecosystem shufflers participate and Mutate keeps dormant cortex off

**Verified in source harness:** 7 new regression cases passed, all 126 Looks validated, 126 unique names and 126 exact serialized state round trips, JavaScript syntax parsing passed.

**Still to test in a real browser:** full `npm test`, Vite build, WebGL GPU compilation, iPhone Safari speed, and pixel-perfect PNG/GIF/MP4 preview parity at 16 seeds, 2 atmospheres, maximum cortex relief.

Do not spend Netlify credits before testing in Google AI Studio. This is a standalone reversible PR.
