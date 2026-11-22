# Glitchbitch · Six Textile Additions · Wave A

Working branch: feature/feral-jacquard-chladni-wave-a
Source issue: #64

## Implemented: 1. Feral Jacquard

**New species index 22**, appended after all 22 existing thread structures. Select in Filament Forge > Thread geometry or load a Feral preset.

Actual shader geometry changes:
- Separately moving warp and weft coordinate systems, with feedback-like coupling and controlled shearing.
- Crossings exchange apparent over/under priority via migration/order parameters.
- Sparse ring-shaped fiber knots occur at seeded crossings; colored light follows the resulting phase.
- Signed-distance-like thread masks are computed with the SAME high-res core, halo and edge logic as every other species.
- Because its geometry runs inside filamentField, it is usable as Parent A or B in crossbred fabrics, with existing material dressing, ornaments, nervous systems, regeneration, and all post-effects.

Five controls (0–100): Corruption, Migration, Order, Knot Population, Mutation.
Five included specimens:
- Feral — Heirloom gone feral
- Feral — Crawling damask
- Feral — Knot parliament
- Feral — Warp eating weft
- Feral — Textile structural collapse

It has a dedicated recipe selector, apply and targeted shuffle inside a collapsible Feral Jacquard section. The normal Fresh Textiles and New Species shuffles can also discover it.

## Implemented: 10. Chladni Needle Orchestra

**New stitch index 31**, appended after all 31 original self-weaving laws.

Actual needle behavior changes:
- A two-mode standing-wave/eigenmode-inspired scalar field is evaluated using LOCAL thread coordinates. Selectable wave order, nodal density, phase coupling and detuning change the topology of the needle locations.
- Stitched reveal masks the real underlying fiber core, edge and halo, including second-parent crossbred contact, rather than painting an unrelated screen-space circle.
- Node-local needle pulses use the same existing sewing clock as all stitch modes.
- Bounded, analytic single-pass GLSL; no added framebuffer, CPU tracking, image readback, physics engine or extra WebGL context.

Five controls (0–100): Order, Resonance, Density, Phase, Detuning.
Five included needle scores:
- Chladni — Violin plate
- Chladni — Cymatic samplers
- Chladni — Detuned bell choir
- Chladni — Broken eigenmode
- Chladni — Ghost diapason

Its section is collapsible inside Self-Weaving Loom. Apply either score to any thread geometry, including Feral Jacquard. Existing 31 modes and their universal four controls remain unchanged.

## Integrations and compatibility

- Filament state data: ten bounded controls in numericRanges, initial defaults and saved recipe validation. Existing saved recipes read the defaults; the original art is untouched because the new species/stitch modes are opt-in by selection.
- Live renderer: uses normal uniform normalization (0–100 to 0–1). Existing per-mode shader compilation/specialization isolates new species index 22 and stitch index 31 (including hybrid geometries) and caches by selected mode. Preview and strict-effects PNG/GIF/MP4 use this same WebGL scene shader and normal export path.
- Effects tab: independent controls, five presets each, targeted shuffle, standard shuffles, Undo/Redo via history.change. Find Control and Reset include every new setting.
- Surprise randomizer samples the expanded mode arrays and populates numeric values; Mutate perturbs the ten settings only while their respective mode is selected. Changing one law never intentionally clears the other.
- Core legacy indices 0–21 (geometry) and 0–30 (stitch) are unmodified. No behavior is enabled by default; no Netlify deploy and no merge to main.

## Verification performed and limitations

A direct V8/JavaScript structural execution of the entire filament forge succeeded:
- 23 geometries, 32 stitch modes, five Feral structure recipes and five Chladni needle scores.
- All existing 22 geometry and 31 stitch branches still individually isolate.
- Geometry 22 isolates to precisely branch [22]; stitch 31 isolates to precisely branch [31]; both specialize simultaneously; braces balanced for full and all selected shaders.
- The specialized combined shader source is substantially smaller than the unspecialized source.

A Node regression file tests new mode identity, recipe round-trip, old-art preservation, combined operation, targeted shuffles, Mutate, UI, shader structure and export wiring. Several old hard-coded count tests were updated to acknowledge additive modes. **The full Node test suite and Vite build have NOT been executed**. No live WebGL compile or matched-frame export proof on iPhone Safari has been done. GLSL structural checks are NOT proof of GPU parity.

## Acceptance checklist (before merging anything)

1. In a test workspace, verify old saved art loads unchanged (no Feral/Chladni selected).
2. Try Feral Jacquard by itself; move all five controls and visually confirm warp/weft geometry changes rather than just color.
3. Try the Chladni score on a familiar species; confirm real thread reveal and traveling needles change. Combine both and then enable a second hybrid thread parent.
4. Run Feral / Chladni targeted shuffles, full Surprise, Mutate, save/reload/undo; verify palette and materials are retained after applying presets.
5. In iPhone Safari, run strict export proof; PNG, two-second GIF and MP4 at matched timestamps, testing low resolution then 1:1 and 9:16 high-resolution.
6. Preserve precise compile error logs if GPU verification fails. Never knowingly omit enabled effects to make an export succeed.

## Remaining four from issue #64

- Quasicrystal Brocade (new quasiperiodic raised structure)
- Structural-Color Optics (thread dressing upgrade)
- Retrocausal Embroidery (analytic temporal lookahead)
- Semantic Gravity (text-to-thread field; requires shared preview/export glyph map)

Color Mathematics Lab remains parked separately in unmerged draft PR #65.
