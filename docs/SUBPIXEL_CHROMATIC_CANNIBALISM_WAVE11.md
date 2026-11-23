# Shader Vault Wave 11 — Subpixel Moiré / Chromatic Cannibalism

**Original source:** [subpixel-moire.js](https://github.com/merrypranxter/shaderslop_designs/blob/main/by_math/08_waves_interference_moire_cymatics/subpixel-moire.js), in the user's original shader vault.

The original source constructs **two RGB shadowmask/trinitron triad arrays** rotated and scaled slightly differently. Beyond ordinary light/dark moiré alignment, it computes R×G, R×B and G×B **cross-channel products**, forming extra chromatic beats (sometimes described by the source as “Chromatic Cannibalism”). The scale mismatch and slow phase drift make a moving interference structure. This mechanism is distinct from Glitchbitch’s existing moiré **math engine**: it is an independent optional **screen material** applied to whatever art/engine is currently selected.

## Five Species

- **Shadowmask Silk:** restrained directional subpixel screen sheen
- **Chromatic Cannibalism:** amplified channel-crossing iridescent beats
- **Prism Bruise:** off-axis spectral sidebands and dynamic color halos
- **Optical Rosette:** rotary moiré patterns and interference lace
- **Ghost Screen Cathedral:** dark optical grilles with luminous interference

Six complete presets: Soft CRT Silk, Cross-Channel Carnivore, Prism Eye Bruise, Printing-Press Mirage, Dead Pixel Cathedral, Barely-There Film.

Twelve independently adjustable sliders: presence, triad density, scale mismatch, crossing angle, drift, curvature, flicker, cross-channel intensity, relief, palette phase, bleeding and variation.

All controls are grouped under **Effects → Signal → Subpixel Moiré · Chromatic Cannibalism** inside Codex's new Effect Control Room. It participates in **Active**, **Favorites** and global **Find**. It has independent Shuffle / Hide.

## Real Shader Implementation

`src/subpixel-moire-wave11.js` defines a single opt-in GLSL module:

1. Build two triad masks using smoothly bounded R/G/B subpixel windows and vertical scanline gaps.
2. Apply independent animated rotations, offsets, mismatch and optional geometric curvature.
3. Compute aligned same-channel intensity and three true cross-products `RG`, `RB` and `GB`.
4. Use the **existing live user palette** and color clock for the channel-crossing colors. No hardcoded “every composition must be cyan-magenta-yellow” tint.
5. Modulate the existing finished art in a selected optical mode, before final appearance treatment.

The grid density is clamped to approximate minimum 5px per whole triad stripe at small preview resolutions. This is a mobile aliasing/performance precaution; the actual exported pixel representation changes with selected resolution, as expected for screen microstructure.

**No extra WebGL passes, textures, FBOs, 70-step raymarch, 3D scene setup, offscreen buffers, canvas blitting or media codecs.** The module is part of the **same GPU renderer** used by live preview, PNG, GIF and MP4 export. There is no separate fake export implementation.

### Compatibility

- `spxAmount=0` for all newly created and imported legacy artworks. Shader module and optical work do not compile/execute while off.
- Added proper recipe numeric ranges, mode validation and JSON roundtrip.
- `Surprise Me` can activate the effect and randomizes all its parameter values.
- `Mutate` cannot wake a sleeping Subpixel Moiré; active settings can be nudged.
- Targeted shuffle changes ONLY the Subpixel Moiré fields and mode, leaving core geometry, other effects, text, seed and palette unchanged.
- If a WebGL preview cannot compile this optional shader, it disables only that optional feature **with a visible notice**. Strict exact-effects export continues to **fail rather than silently remove art**.
- No alterations to New Canvas, Codex's navigation architecture, saved gallery, textual compositing, other shader families, export encoders or Netlify workflow.

## Verification and limits

New `tests/subpixel-chromatic-cannibalism-wave11.test.mjs` includes eight Node regression suites covering original-state defaults, all six presets and saved clocks, old recipes, targeted shuffle, Mutate and Surprise Me, dual-triad physics, shader gating, and Effects Workbench search/active/favorites.

A connector-only source and JS function check is not an actual GPU execution test. The full npm/Vite build, a real WebGL shader compile on iPhone Safari and decoded MP4/GIF-vs-preview color parity need verification in a browser environment. No Netlify or GitHub Actions deployment requested.
