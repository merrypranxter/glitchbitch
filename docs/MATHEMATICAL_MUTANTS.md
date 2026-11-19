# Mathematical Mutants — Shader Vault Wave

Three **new mathematical engines** in GLITCHBITCH, indexed 17–19 (the 17 original engines keep their IDs). Their shader code is a new implementation inspired by the user's existing vault, rather than pasted self-running Three.js code.

| Engine | Actual mechanism | Shader-vault source |
| --- | --- | --- |
| Schottky Lace | A bounded sequence of four overlapping circle inversions with smooth distance-to-boundary halos and radial filigree | `shaderslop_designs/myspace_glitch/04-pixel-dither-halftone/klein-dither.js` |
| Sigil Glass | Animated polygon radial signed-distance contours: hexagons, triangles, circular arcs, etching and optically folded gratings | `shaderslop_designs/GLITCHY/05-psychedelic-glitch-art/prismatic-sigil-glass_20260624_011012.js` |
| Moiré DNA | Three rotating/detuned angular-petal and radial-phase gratings that continuously beat together | `shaderslop_designs/GLITCHY/05-psychedelic-glitch-art/moire-dna.js` |

## Use
Choose a new species in **Math → Engine**, or open **Lookbook → Mathematical Mutants** for six precomposed recipes. Engine parameters, movement, custom palettes, gestural distortions, secondary-engine breeding, underlays, Photon Zoo and materials remain available and editable. No slogans appear automatically.

Output uses the existing WebGL math renderer for both preview and saved PNG/GIF/MP4, rather than a screenshot-only overlay. Rendering is analytic and timed by the existing deterministic clock. No remote rendering or paid API.

## Rollback and safety
- This wave was developed on `feature/math-mutants-klein-sigil-moire`, based on the then-current `main`. The original 17 engines have unchanged indices and shaders.
- The three species compile only when selected, directly or as the secondary engine; all existing looks retain the original lightweight module stub.
- Shader compile failure disables the new species in that renderer instance, falls back to existing 2D field engine, and preserves all recipe state. The legacy shader fallback chain remains active.
- No modification to the text preview/compositor, typography blend modes, export encoders, palette vault, persistence, or Netlify.

## QA before trusting on-device
Run `npm test` and `npm run build` in the usual working environment (Node 20+). Verify three engines individually, three as second engine, touch/undo/recipe reimport, CSS text on top, palette changes and PNG/GIF/MP4 color fidelity in iPhone Safari. No claim of device verification is made here.

## Follow-up candidates from the vault
- Klein-inspired RGB-channel layer separation on inversion-depth slices, as an optional separate material pass.
- True glass refraction via screen-space layer sampling instead of merely etched scalar geometry.
- Pixel-sorting ribbon damage that rides flow-field directions.
