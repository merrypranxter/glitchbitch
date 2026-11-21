# Thread Metamorphosis — living material mutation (Wave Next)

Glitch Bitch's Filament Forge has **22 animated thread geometries**, **31 self-sewing stitch modes**, **14 real fiber finishes**, **12 thread-attached ornament species**, and now **9 moving material-transformation laws** (plus Off).

## The actual idea

Instead of a static shader pretending that a silk thread looks like glass, each strand now computes **two complete versions of the real existing fiber material shading** and transitions between them, using an evolving field evaluated in the moving filament's own coordinate system. The user's **Dress the Threads** selection is the starting material. The Thread Metamorphosis panel chooses an independent target material for parent A and, when hybrid weaving is enabled, parent B. Both target selectors draw from the existing 14 finish types.

This works for normal and bizarre combinations: iridescent silk to opal glass, mercerized cotton to metallic tinsel, chenille to bioluminescent mycelium, oil-slick latex to gelatin nerve cord. Even "Original thread" can be a target.

Material transition laws:
- **Seam sweep:** a traveling sewn boundary
- **Crystal contagion:** discrete mineral facets nucleating along strands
- **Molten migration:** flowing material eddies
- **Moth-eaten portals:** patterned gaps through the previous finish
- **Checker metamorph:** moving checker-woven territories
- **Strange attractor:** two moving material attraction centers
- **Morse rethreading:** signal packets rewiring the dressing
- **Fungal takeover:** branching wavefronts
- **Chromatic tide:** soft optical phase waves

Five controls: strength, patch scale, mutation speed, seam sharpness, and transition frontier glow. There are nine independently named presets, a general random transformation button, a weird-transformation button, and a Stop morphing action that retains the underlying yarn, its geometry, primary material, sewing and jewelry.

## Safety and compatibility

- **Default state is Off, zero morph amount.** Saved legacy art is not changed just by loading it.
- Each existing material branch is duplicated from the actual source's original optical equations to form the target shading. No extra image, pass, framebuffer, CPU animation or external API.
- Shader specialization prunes all unused baseline and target materials. At most two base and two target optical finishes survive to the mobile GPU compiler.
- The code runs in the existing Filament Forge source and reads **the same time / color-time clocks as the fixed strict-effects GIF/MP4/PNG exporter**. We did not touch MP4 encoding or the newly repaired frame-history ping-pong renderer.
- Morph effects are computed on each actual moving thread; stitch reveal and raised relief remain controlled by their original mechanisms.
- If mobile preview cannot compile an optional morph shader, only this optional stage is disabled; strict export still reports a parity failure instead of delivering a downgraded MP4.
- Surprise, Mutate, Undo, recipe save/load, Find a control, and normal effect reset are all wired into the new options.

## Validation

Added `tests/filament-metamorphosis.test.mjs` covering old-default preservation, typed ranges and enum validation, save/load roundtrips, deterministic targeted shuffles, all **196 target-material pairs**, every **22 × 31 geometry/stitch combination**, renderer integration and UI wiring.

Direct V8 checks parsed and evaluated the complete filament module and passed **1,784 structural assertions** (196 × 2 material-pruning/balance checks, 682 × 2 full-shader composition tests, plus presets and wiring). **Full npm tests, actual GPU/GLSL compilation, and physical Safari MP4/GIF preview parity remain unverified.** No Netlify deploy was performed.

For first live device QA, save your current recipe, pull `main` into Google AI Studio, enable one material morph, use the 480px strict effects proof, then run a short square MP4 before a 30-second full-resolution export.
