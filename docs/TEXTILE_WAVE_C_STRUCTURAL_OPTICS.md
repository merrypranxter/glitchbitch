# Glitchbitch · Textile Six · Wave C: Structural-Color Optics

**Stacked branch**: feature/structural-color-optics-wave-c
**Base**: feature/quasicrystal-brocade-wave-b (Wave B, draft PR #67)
**Earlier Wave A**: Feral Jacquard + Chladni Needle Orchestra (draft PR #66)
**Color Math Lab** remains separate (draft PR #65).
No Netlify deployment, no merge into main.

## New capability: Dress the Threads gets a structural-optics cabinet

Add two **independent optical coats** to the existing fourteen named fiber materials and every filament species. An optical coat augments a dressed fiber in the same shader at its own **actual strand geometry**. It never introduces a screen-wide post-processing filter or overwrites fiberMaterial/morphMaterial. As a consequence, e.g. Velvet flock + pearlescence is still velvet but now has light interacting with its strand structure.

**Separate Parent A / Parent B laws and seven numerical controls each**:
- Mode (Off plus seven named pseudo-optical laws)
- Amount
- Film thickness
- Dispersion
- Anisotropy (directional light)
- Curvature response (along the yarn)
- Pearl layer
- Spectral phase

Fiber A and Fiber B are independent: different materials, optics mode, amounts and all six remaining optical parameters. Parent B is visible only when the existing **Hybrid Breeder** has crossbreed strength > 0, otherwise its controls are retained but inactive. Swap A/B optical coats without swapping base fibers. Remove A, B or both without destroying any other artwork.

### Seven optical laws

1. Soap-film opal
2. Pearlescent floss
3. Diffraction grating
4. Anisotropic chrome
5. Holographic organza
6. Bioluminescent nacre
7. Quantum mother-of-pearl

This is **physically inspired, NOT calibrated physical optics**: WebGL art is an orthographic flat artboard without a tracked 3D viewing direction or measured microstructural reflectance. The shader approximates directional viewing with yarn-cross-section distance, local strand phase, curvature proxy, and light-angle proxy; it computes three pseudo-spectral interference bands and comb-like grating/pearlescent components. Avoid claiming measured wavelengths or actual optical spectroscopy.

### Seven instant paired-fiber specimens

- Abalone ghost thread
- Peacock nacre brocade
- Diffraction guillotine
- Anodized spider silk
- Holographic bridal fungus
- Biophoton pearl rot
- Quantum soap disaster

The UI lives inside **Filament Forge → THREAD ALCHEMY → STRUCTURAL-COLOR OPTICS — DRESS THE THREADS**, with independently collapsible A/B detail controls, targeted shuffles, Shuffle Both, Wild Spectral Wardrobe, Swap, and Restore Original Thread Colors. Find a Control indexes all modes and controls. The seven named coat recipes preserve authored text, colors, materials, second parent, geometry, selected stitch, and other effects.

## Implementation architecture

- src/structural-thread-optics.js holds two-parent modes, descriptions, controls, seven recipes and pure state helpers. Optics are not new indices in the base 14 fiber materials, so older materials have unchanged identities and all existing recipe values survive.
- src/data.js validates two enumerated modes and fourteen 0–100 controls; initial modes and strengths are **Off / 0**. Existing saved designs have no new optics activated. Full Surprise selects optics sparingly; Mutate touches active parents only (for B, hybrid must also be active).
- src/filament-forge.js accepts independent parameters at each call to filamentField() and applies the selected optical response **after** the current material, morph and scar/nerve shading. Because all other existing filament masks already use this same strand field, the effects mix with materials, sewing, neon colors, crossing masks, jewelry, and sculpted fibers. Parent A and B use independent params.
- src/renderer.js enables **FILAMENT_STRUCTURAL_OPTICS** only when a visible parent has non-Off style and positive amount. Otherwise the preprocessor removes all optical math from the GPU. The cache key changes with the active selected optical modes (not every numerical slider). The uniform values, existing time, palette, and filament shader are the SAME ones that render preview and exact-effects PNG/GIF/MP4; no separate export path and no silent export approximation is introduced.
- src/ui-index.js wires reset and searchable controls.
- tests/structural-thread-optics-wave-c.test.mjs checks mode identities, all 14 original fiber dresses, legacy Off defaults, invalid-state rejection, paired presets, swaps, A/B separate shuffles, Mutate, shader specialization and strict export source wiring.

## Verification actually performed

Source-level smoke checks run in V8 against both modified ES modules (sans ESM declaration syntax). Passed:
- 14 original materials and 24 filament geometries preserved
- 7 optical laws + Off, 7 two-parent presets, 7 controls per parent
- Paired and solo shader branch compilers keep balanced GLSL braces
- Independent Parent A/Parent B shaders and state/UI/renderer uniforms present
- Optical code guarded by compile-time FILAMENT_STRUCTURAL_OPTICS macro
- Preset application/swap preserves underlying materials, quotes and geometry

**Not verified yet**: npm test, Vite production build, real device GLSL compilation, strict preview-to-PNG/GIF/MP4 visual parity, high-resolution 1:1 and 9:16. This workspace's local runtime has no network route to clone GitHub (DNS lookup fails), so full build and device proof cannot honestly be claimed.

## Manual Safari QA (before merging)
1. Load an older recipe with Optics Off. Compare colors and rendered frames to prior main.
2. Use Parent A optical law on each of the 14 materials, including Original thread. Exercise all seven A controls and recipes.
3. Enable existing Hybrid Breeder and choose a radically different Parent B material and optical law. Adjust B while A stays unchanged; swap coatings and confirm the fiber material IDs remain the same.
4. Combine with Feral Jacquard, Quasicrystal Brocade, Chladni Needle Orchestra and neural/scars/ornaments, plus palettes and time motion.
5. Test all seven presets, both targeted shuffles, whole shuffle, wild shuffle, swap, Restore and Undo. Save/reload recipe, turn optics Off and confirm exact original appearance.
6. Use strict exact-effects visual proof, PNG, 2-second GIF and MP4, compare matching timestamps on Safari. Start small, then 1:1 and 9:16.
7. If GPU compilation fails on device, inspect logs and keep export honest. Do NOT turn off optical effects silently.

## What's after Wave C (issue #64)

- Retrocausal Embroidery — reversible lookahead temporal needlework, no unbounded frame history
- Semantic Gravity — actual lettering-to-GPU thread interaction with shared preview/export glyph field

Color Mathematics Lab (PR #65) remains separate; future integration must account for stacked branch dependencies.
