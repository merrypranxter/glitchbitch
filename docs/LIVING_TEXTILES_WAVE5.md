# Shader Vault Wave 5 — Living Velvet Damask + Hyperbolic Crochet

Source files in the user's Shader Vault (untouched):
- https://github.com/merrypranxter/shaderslop_designs/blob/main/by_math/03_cellular_automata_lenia_sandpiles/lenia-velvet-damask.js
- https://github.com/merrypranxter/shaderslop_designs/blob/main/by_math/11_hyperbolic_non_euclidean_higher_dimensions/fractal_crochet.js

## Intent

Build two independently opt-in textile engines in the existing Glitchbitch WebGL geometry and optical pipeline. Do not import the original standalone Three.js wrappers, add another renderer, or fork PNG/GIF/MP4 export.

### Living Velvet Damask

The source uses seven orbiting metaballs, p4m (square wallpaper) mirror-folded fabric cells and three Gaussian growth-shell functions. Wave 5 reimplements this continuous cellular morphology using seven fixed orbital motifs, double mirror folding, Gaussian membranes and a relief-gradient normal from two finite differences. The material adds directional velvet pile, moving diffuse light, grazing sheen, wet biological highlights, sparse fiber scintillation and the user's active color palette.

A bounded gradient shift also moves the real base field coordinates, so this is not an RGB overlay. However, this is **Lenia-inspired continuous morphology**, not a real stored-state Lenia automaton or physically accurate cellular evolution.

Five species: Royal Bio-Damask, Opal Nap, Alien Velvet, Living Jacquard and Moss Brocade.

Controls: presence, wallpaper scale, morphological growth pace, raised relief, directional nap, wet gloss, palette phase, organism variation and motif density.

### Hyperbolic Crochet & Fractal Lace

The source uses a ruffled radial-pseudosphere approximation, spherical-inversion fractal folds, a 3D signed-distance intersection between fabric slab and tubular lace network, and a 150-step raymarch with six extra SDF normal samples.

Wave 5 retains actual 3D signed-distance crochet, ruffled polar coordinates, inversion and rotation folds, yarn microstructure and angle-dependent optical yarn shading, but bounds inversion to **3 passes** and raymarching to **8–20 steps**, with 3 forward-difference samples for normals only on hits. The 2D ruffle field also bends original engine coordinates in a limited range.

The ruffling is hyperbolic-inspired rather than an exact isometric embedding of the hyperbolic plane. The five species names are artistic distinctions, not rigorous geometric topology claims: Hyperbolic Coral, Fractal Lace, Klein Ruffles, Apollonian Loops and Luminous Crochet.

Controls: presence, scale, ruffle amount, material depth, lace/inversion size, motion, yarn fuzz, iridescence, raymarch quality and palette phase.

### Crossbreeds

Six recipes cover pure velvet, pure crochet and mixed textile layering: Royal Organelles, Opaline Moth Velvet, Coral Cathedral, Impossible Fractal Lace, Biological Wedding Dress and Haunted Damask Cathedral.

Separate Shuffle Velvet, Shuffle Crochet, Hide Velvet and Hide Crochet controls affect only the chosen family; combined preset buttons select both. Other seeds, palettes, Filament Forge structures, lighting, lettering, previous Shader Vault layers and history remain intact.

## Compatibility and exact-effect export

Old artwork defaults to vldAmount = 0 and hcrAmount = 0. Optional GLSL is **completely excluded** from compiled programs unless activated; separate shader cache variants ensure the right program. All shaders use the exact same time/color-time clocks as preview and the existing PNG/GIF/MP4 export renderer, with no extra framebuffer or CPU simulation. If a GPU refuses an optional shader, preview can drop it and preserve the existing art; exact-effect export raises an error rather than silently changing the artwork.

All 19 numeric controls are range-validated and saved in normal recipes. Mutate never wakes a dormant textile engine. Full Surprise Me can randomize both families.

Mobile performance is meaningfully bounded versus the original 150-step raymarch, but real iPhone GPU speed, Vite build and actual encoded GIF/MP4 parity remain unverified. Reduce Crochet Quality if phone preview struggles, particularly with other heavy shaders active. A perfectly seamless loop is not guaranteed by an arbitrary export duration.

No Netlify deployment, GitHub Actions, new dependencies, image assets, encoder or render targets were changed.

Tests: tests/living-textiles-wave5.test.mjs includes six source-level regression checks; full Node test execution still needs a runtime with the repository available.
