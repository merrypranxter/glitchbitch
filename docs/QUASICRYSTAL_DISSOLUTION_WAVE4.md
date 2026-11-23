# Glitchbitch — Shader Vault Wave 4: Order → Dissolution Quasicrystal

Source: https://github.com/merrypranxter/shaderslop_designs/blob/main/quasicrystal-oscillator.html

## Source-grounded behavior

The original source sketch used seven coupled cosine plane waves to create a quasiperiodic lattice, then used time-driven stripe tears, pixel-block quantization, and color phase deterioration to mutate ordered interference. This wave adapts the mathematical mechanism into Glitchbitch's existing art shader. The original was packaged as a standalone Three.js demo; no Three.js dependency or new video renderer was imported.

Wave 4 uses a bounded, fixed maximum of 9 wave iterations and 5/7/9 symmetry choices. Sevenfold is the source-faithful default. Disorder modifies the actual wave coordinates and the geometry sample p: row shifts and cell quantization alter the lattice before the nine-iteration interference computation, then a bounded directional displacement perturbs the base mathematical fields and Filament Forge materials. The original art continues to show through; a final subtle refractive-looking palette overlay and damaged lattice coloration dress it using the existing 176+ palette collection.

Separate from the existing Quasicrystal Brocade stitching and the existing fivefold diffraction engine: this is a *transition between low-entropy order and destroyed phase coherence*, not a duplicate static crystal.

## Controls

Math → Order → Dissolution Quasicrystal:
- Five mutation modes: Crystal Clockwork, Fractured Brocade, Quasi-Mosaic, Phase Schism, Neon Shrapnel.
- Select Fivefold / Sevenfold / Ninefold.
- Six recipes, including Pristine Alien Clock, Faultline Brocade, Pixel Archaeology, Phase Divorce Court, Glittering Ruin and Oscillating Mutation.
- Twelve 0–100 controls: Presence, Dissolution, Auto cycle, Speed, Density, Tears, Pixel rupture, Geometry warp, Filigree, Palette phase, Variation and Luminous seam.
- Shuffle only the quasicrystal or Hide without touching seeds, original palettes, threading species, existing lenses, text, memory feedback or other modules.

Manual Dissolution = 0 is the orderly lattice; 100 is maximum local tearing/mosaic/phase rupture. Auto = 0 holds the slider, Auto = 100 cycles with the app's existing animation clock. An automatic cycle does not by itself guarantee a seamless encoded loop for an arbitrary requested duration; use the app's established loop/export controls and verify the actual result.

## GPU and export contracts

- Presence defaults to zero in old art; optional GLSL is excluded from their compiled program and the cache key segregates active/inactive variants.
- The new effect runs in the existing WebGL shader, with zero new textures, FBOs, CPU simulations or timekeepers.
- Preview can remove the optional new shader if a GPU refuses compilation. Exact-effects PNG/GIF/MP4 capture raises an error rather than silently exporting artwork without the chosen effect.
- Existing Schlieren's true composited-pixel refraction can happen downstream and is unchanged. Original text overlay is untouched. Palette, undo/redo, UI structure and export modules remain unchanged.
- Shuffled presets and active controls are ordinary art-state fields; recipe validation and round-tripping persist them. Surprise Me may activate the new effect and randomize its entire control bank; Mutate never turns it on if it was off.
- No external fetches, GitHub Actions, packages, build pipeline changes or Netlify deployment.

## Verification

tests/quasicrystal-dissolution-wave4.test.mjs covers dormant defaults, choices/ranges, preset separation, round-tripping, shuffle determinism, Mutate guard, real wave interference and damage math, source hooks, shader separation, UI registration and strict export compile failure. Local JavaScript checks and source-level regression inspection are possible through the GitHub connector. A full npm test / Vite build, physical iPhone GPU compile and actual encoded export/loop parity still require an executable project environment.
