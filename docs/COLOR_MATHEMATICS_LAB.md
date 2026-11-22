# GLITCHBITCH — Color Mathematics Lab (Wave 01)

## The artist's eleven selected color laws
1. RGB Cube Folding
2. OKLab Opponent Mirror
3. Hue Origami
4. Modular Color Arithmetic
5. Möbius Chroma
6. Julia Set Color Dynamics
7. Strange Attractor Dye
8. Chromatic Bifurcation
9. Color-Space Kaleidoscope
10. Spectral Counterfeit
11. Recursive Color Automaton

Every law has a separate, actual GPU color equation and a one-click Chromatic Spell preset. Its Color-tab panel includes **Transformation law**, **Amount**, **Mathematical depth**, **Color-space evolution**, **Variation**, **Preserve perceptual lightness**, **Shuffle color mathematics**, **Shuffle impossible colors**, and **Restore original colors**.

## Architecture and integration
- src/color-math-lab.js: manifest, descriptions, presets, randomizer and a per-law GLSL generator. Only **one selected law** compiles at a time. Off or amount zero means no extra shader is compiled. Stacking two or more laws is a future addition, not part of this wave.
- src/renderer.js: apply after existing WebGL artwork, optics/grade and appearance so it instantly reinterprets final artwork pixels like Invert, not the geometry. The existing palette vault, editable stops and color motion feed it upstream; Spectral Counterfeit also samples the existing palette function. Typography uses a separate Canvas2D/DOM layer and is not recolored.
- src/data.js: default Off/zero amount; all new numeric ranges, mode enum, boolean validation, recipe round-trips, undo-compatible state, Mutate and full Surprise logic. Existing saved art retains its original appearance.
- src/components/ColorLab.jsx: controls, presets, targeted/whole shuffles.
- src/ui-index.js: Find a Control, Reset, active indicator keywords.
- Does not introduce an extra framebuffer, WebGL context, GPU simulation, texture LUT, readback, independent clock, or encoder.

## Export constraints
The selected law is injected into the SAME WebGL scene shader used by live preview and existing exactEffects=true exports for PNG, GIF, and MP4. No export-only reinterpretation or silent substitution was introduced. The original strict parity error behavior remains and should visibly fail rather than knowingly omit an enabled effect.

No Netlify deploy.

## Mathematical precision
- OKLab routines use sRGB/linear-light/LMS conversion and inverse; perceptual L restoration can be modified by gamut clipping.
- Möbius Chroma is a bounded complex fractional map, with guarded denominator.
- Julia and Strange Attractor color maps use short fixed iteration counts (six and five).
- Chromatic Bifurcation uses bounded logistic-map updates.
- Recursive Color Automaton is a per-pixel quantized state transition, **not** a spatial cellular automaton.
- Spectral Counterfeit is deliberately fake false-color spectroscopy, not a physically calibrated wavelength simulator.
- Some laws have intentionally sharp color discontinuities; arbitrary motion settings are **not guaranteed seamless loops**.

## Tests and limitations
Eleven shader variants were generated and checked in V8 for unique branch selection and balanced GLSL braces. tests/color-math-lab.test.mjs adds coverage of selections, saved recipes, validation, Find/Reset, targeted shuffle, Mutate, shader specialization, and strict export wiring.

**Not hardware-certified:** full npm test/Vite build, real GLSL compilation on iPhone Safari, visual preview/GIF/MP4 pixel comparison, and high-resolution 9:16/1:1 GPU performance still require live testing.

## iPhone QA
1. Pull the reviewed color-math feature branch into a test workspace; do not clobber unrelated Google AI Studio edits.
2. Load old art and confirm the Color Math Off state leaves it unchanged.
3. Try all eleven laws and presets; test preserve-lightness, both shuffles, recipe save/load, Undo, custom palettes, and animated palette rhythm.
4. Run the small-size **See flattened export proof**, then 2 s GIF and 2 s MP4, comparing with preview at matched timeline moments.
5. Test 1:1 and 9:16 at 480px before raising resolution. On exact-effects failures, capture the precise WebGL error; never silently strip the shader.

## What's next
After this Color Lab is verified, return to the six selected textile additions recorded in issue #64: Feral Jacquard, Quasicrystal Brocade, Structural-Color Optics, Chladni Needle Orchestra, Semantic Gravity and Retrocausal Embroidery. The previously created feral-jacquard branch remains unmodified; neither it nor main was merged by this color wave.
