# GLITCHBITCH — Textile Six, Wave D: Retrocausal Embroidery

**Branch:** feature/retrocausal-embroidery-wave-d
**Stacked on:** feature/structural-color-optics-wave-c (PR #68)
**Prior waves:** Quasicrystal Brocade PR #67; Feral Jacquard & Chladni Needle Orchestra PR #66
**Separate, untouched:** Color Mathematics Lab PR #65 (targets main)

Neither this wave nor the previous waves are merged into main. No Netlify deployment.

## New stitch law: Retrocausal Embroidery

**Stitch mode index 32** (33rd option, appended after the existing 32), available to all 24 filament geometries, both hybrid parents, all 14 original fiber materials, the new Structural-Color Optics coats, relief and ornament modes.

The new law creates a *perceptual time paradox*, not a real time-travel simulation. It samples the known analytic thread phase at the current timeline and at **t + bounded temporal lead**. A predicted ghost stitch becomes visible before the current-time needle reaches its position. A counterpropagating sinusoidal needle creates reversals. Seed-anchored knot stations create future-timed knots in the underlying thread. The core, edge and halo of the **real fiber** are revealed by these analytic stitch fields.

### Six controls (0–100)

1. Needle future lookahead — displacement of future-seam sample
2. Pre-echo ghost stitches — mixing of the future seam into the visible yarn
3. Paradox seam crossings — disagreement/intersections between forward and reverse forecasts
4. Knots tied before arrival — amplitude of anticipatory knot stations
5. Reverse-time stitch wave — counterpropagating sequence
6. Seam coherence / softness — smoothness/contrast of stitch-reveal pulses

All six are independent of universal stitch speed, length, amount and glow.

### Six presets
- Retrocausal — Ghost of tomorrow
- Retrocausal — Knots before thread
- Retrocausal — Reverse causality loom
- Retrocausal — Phantom seam ledger
- Retrocausal — Paradox cathedral
- Retrocausal — Quiet predestination

**Find it:** Effects → Filament Forge → Self-Weaving Loom → Retrocausal Embroidery — Stitches from Tomorrow. Choose a score, tune each parameter, **Shuffle future seams** or **Feral chronology shuffle**. The conventional stitch picker also lists Retrocausal Embroidery.

## Data and compatibility

- `src/filament-forge.js` appends a single new stitch branch (mode 32), six presets, two targeted randomizers and six parameters. No indices 0–31 are changed. The original 24 geometry identities remain unchanged.
- `src/data.js` adds six validated 0–100 fields with harmless defaults, old-recipe round-trips, full Surprise and opt-in Mutate (touches temporal fields only while a visible retrocausal stitch is active).
- `src/renderer.js` binds the six uniforms in the same GLSL shader used by live preview and the existing strict-effects PNG/GIF/MP4 path. The per-mode shader specialization emits ONLY branch 32 for mobile, and retains existing geometry/hybrid/material/shader logic.
- `src/components/Inspectors.jsx` adds the six-slider collapsible cabinet, score selector, two shuffles, preserving history undo and existing UI navigation.
- `src/ui-index.js` includes Find, Reset, help keywords and new 33 stitch count.
- Existing count tests updated additively. Added `tests/retrocausal-embroidery-wave-d.test.mjs` for old-mode preservation, schema/recipe, score/shuffle, dormant Mutate, temporal shader snippets, all 33 shader specializations, Find/Reset and exact export wiring.

## Mathematical and technical honesty

- The stitch is **analytic and deterministic**, not a saved or predicted future video frame and not a history buffer.
- `sewClock` is derived from the renderer's existing `time` uniform, so at each matched timestamp the same math is available to live WebGL preview and exact-effects PNG/GIF/MP4.
- Future echoes are shifted analytic time samples of periodic moving stitch waves; they are **not proofs of actual causality reversal**, truly autonomous stitches, or exact real-world time delay.
- Repeating sinusoids may cause apparent jumps between some export loop endpoints depending on selected parameters. **Perfect seamless looping is not guaranteed** for every seed and speed; use the same export-clock path and check endpoints.
- Unlike a screen-space overlay, the field computes `visibleStitch` and `needle` inside `filamentField`; the same `reveal` gates **core, halo, edge and sculpt** masks. It works for each hybrid parent's local coordinates.
- Bounded GLSL math (cosines, smoothsteps, no extra texture, FBO, CPU readback or feedback history); inactive modes are pruned from the specialized shader.

## Verification

**Completed:** Pure JavaScript/V8 structural execution of the actual filament module, mode registry (33), 42 existing/new stitch presets, all 33 isolated stitch modes, hybrid Feral/Quasicrystal branch plus Retrocausal branch, balanced GLSL braces, six ranges and uniform/UI/index wiring, preset preservation. Added Node regression tests.

**NOT completed:** running `npm test`, Vite production build, device WebGL shader compilation, exact GIF/MP4 pixel comparison, or high-resolution Safari 1:1 / 9:16 load tests. Local container cannot clone GitHub via the network, so no hardware or build success is claimed.

## Safari acceptance (before any merge)

1. Open the stacked feature branch in a controlled Google AI Studio workspace. Don't overwrite existing user edits.
2. Load saved old art first. The new mode must be opt-in and preserve its appearance.
3. Enable Retrocausal Embroidery; inspect the ghost stitch appearing before the traveling needle, reversing seam and anticipatory knots, adjusting six sliders and all six scores.
4. Test with Feral + Quasicrystal as both hybrid parents, Structural-Color Optics on each, and different palettes/materials. Undo, save/load and Mutate.
5. Compare matched-clock frames between preview and strict PNG, 2-second GIF and 2-second MP4. Test 480px first, then 1:1 and 9:16.
6. If a WebGL program fails, inspect the exact compile log. Never substitute a simpler animation or omit enabled effects silently.

## Next selected textile addition (issue #64)
**Semantic Gravity:** typography should physically attract, displace or reroute nearby threads. This demands a verified shared glyph field between text and WebGL, in preview **and** exact PNG/GIF/MP4 export, to avoid earlier text/export mismatch. Build it independently on the next stacked branch, after reviewing this wave.
