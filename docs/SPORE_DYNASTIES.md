# SPORE DYNASTIES — Wave 9

This wave gives Glitchbitch's planted, morphing, cortical colonies a **reproduction system**. Living seeds shed luminous particles, the particles drift across the artwork, land, and grow temporary daughter colonies. **Evolve generation** converts those daughter landing sites into permanent editable seeds in the normal saved recipe, so the user can build a little population over successive generations.

The architecture deliberately separates **a deterministic visual flight** from **a committed generational change**. It does NOT silently mutate documents in the background during playback and it does NOT claim infinite unconstrained reproductive simulation. That would break repeatable exports and make mobile GPUs collapse under unbounded colony counts.

## Workflow

Go to **Effects → Scene → Spore Dynasties**:

- **Spore transport**: Dormant (default), Windborne, Helical drift, or Burst scatter. The active modes generate different curved flight paths.
- **Spore visibility** controls strength and temporary daughter growth
- **Dispersal speed** determines temporal phase speed
- **Landing distance** determines distance from each parent to the daughter site
- **Fertility / active parents** determines how many existing planted seeds reproduce
- **Spore luminescence** is drawn using the same palette as the corresponding A/B atmosphere

Buttons:
- **Awaken spores:** apply one of four named spore recipes, plant missing parent-A habitat seeds and make its atmosphere visible
- **Shuffle spores:** change reproductive motion and strength while preserving the existing math, colors, words, and settled colony coordinates
- **Evolve generation:** convert the current deterministic daughter landing sites into permanent seeds with inherited A/B parent ownership, unique IDs and adjustable positions/radii. This is one Undo/Redo transaction and is saved with the art.
- **Stop flight (keep offspring):** turn off the spore shader without deleting any committed daughter colonies or parent anatomy/cortex.

The control panel displays planted-seed count (maximum **16**), permanently saved generation count and number of prospective fertile parents. At capacity, Evolve Generation becomes unavailable; the user can erase some seeds to evolve again.

## Four complete editable specimens

The Lookbook now contains **130** designs. The four new **Spore Dynasties** entries are:
- Electric Pollen Storm
- Slow Century Spores
- Helical Gene Escape
- Pixie Cup Exodus

Each has fully editable A/B colonies, living anatomy and cortex, animated lifecycles, and deterministic dispersal. No baked images.

## How reproduction works

**Animated flight** is a time-continuous GLSL ES 1.00 calculation, specialized into the existing habitat shader *only* for active Painted colonies with nonzero Spore Amount and a non-Dormant mode. A bounded 16-seed loop, already present to draw habitat silhouettes, calculates:

1. A deterministic nearby landing location from its saved parent coordinates, seed index, generation index, and canvas aspect ratio
2. A curved flight path from parent to landing destination with mode-specific wind/helix/burst deviations
3. A short, palette-colored visible spore particle flying along that path
4. An analytical daughter mask that swells from the landing point and fades at the end of the cycle, optionally inheriting the parent anatomical silhouette

At the cycle boundary, both flying particles and temporary sprouts fade to zero; there is no per-frame simulation memory, random-per-frame jitter, or hard teleportation. A GIF/MP4 rendered at a specified time follows the same equations as a still preview at that time; whether **the entire artwork** seamlessly loops still depends on other enabled effects' independent periods.

**Evolve Generation** is the optional *permanent* side: `daughterSite(state,index)` in JavaScript mirrors the GPU landing law. `evolveSporeGeneration` commits new real `habitatStamps` and increments the validated integer `sporeGeneration`. These are exactly the same structured objects used by Habitat Graffiti, so every daughter can be repositioned, recolored through its parent palette, erased, or used as a new parent. Only 16 seeds can exist at once.

The floating GPU math and JavaScript mirror use the same analytic formula. Approximate pixel-for-pixel correspondence should be verified on a real device because of JavaScript double vs GLSL float precision and normal device-dependent rendering differences.

## Safety and compatibility

- Legacy defaults are `sporeMode:"Dormant"`, `sporeAmount:0`, `sporeGeneration:0`. Old artwork does not compile the new GLSL branch.
- The spore engine has its own shader-program cache switch; disabled spore code is not compiled into old preview and export shaders.
- Five new bounded numeric controls and validated `sporeMode` enumeration; generation counter must be integer [0,4095].
- New seed IDs are bounded and unique per generation. Daughter radii are legal, A/B ownership inherited, normalized coordinates clamped and aspect-aware.
- `Mutate` does not start a dormant reproduction engine. **Surprise**, **Shuffle Ecosystem**, and **Freakshow** may randomly awaken spores when genuine planted habitats are present.
- No edits to the regular warp/force gesture system, font/text compositor, GIF/MP4 encoders, palettes, backend, package manifest, GitHub Actions, or Netlify deploy settings.

## Source and quality checks

- New: `src/spore-dynasties.js`, `tests/spore-dynasties.test.mjs`
- Updated: `src/data.js`, `src/atmosphere-habitats.js`, `src/renderer.js`, `src/ecosystem-randomizer.js`, `src/components/Inspectors.jsx`, `src/ui-index.js` plus existing Lookbook count regression tests.

**Verified:** 9 new regression cases passed in an isolated JavaScript source harness, including determinism, generation 1/2, 16-seed limit, save/reload, old-art defaults, UI/renderer hooks, and randomized recipes. All **130 unique Lookbook recipes** validated and round-tripped exactly.

**Not verified in this connector environment:** a real `npm test`/Vite build, WebGL shader compilation, iPhone Safari rendering/performance, or high-resolution GIF/MP4 preview parity. Test in Google AI Studio on an iPhone before any deployment or credit-spending activity.

If device shaders become expensive, the existing GPU compatibility fallback can disable optional habitat effects rather than destroy the underlying mathematical art. Reproduction stays optional.
