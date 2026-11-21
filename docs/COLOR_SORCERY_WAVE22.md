# Color Sorcery — Wave 22 (four independently animated single-pass color engines)

Wave based on the [Chromatic Contraband Cabinet](./CHROMATIC_CONTRABAND_CABINET.md). The underlying source inspirations were inspected in `merrypranxter/shaderslop_designs`; formulas were adapted for WebGL1 rather than copied whole. This is **not** a 3D ray-traced polarization or a physically exact spectral rendering pipeline.

## Engines

1. **OKLab Chroma Oracle** — sRGB↔linear↔OKLab conversion rotates the chromatic axes while keeping the original OKLab L coordinate. Controls influence warped angle, saturation and optional local palette borrowing.
2. **Birefringent Cellophane** — two independently moving optic-axis phases produce retardation-like iridescent interference. It is a visually motivated approximation without polarization matrices or a second raymarch pass.
3. **Chromadepth Risograph** — dynamic depth/hue mapping plus three independently rotated and time-shifted printable ink screens. Distinct from the already-existing stationary CMY print filter.
4. **Phosphene Gem** — geometry-attached neon halos and broad soft-white crowns driven by the current mathematical field, with separate softness, white intensity and chromatic separation controls.

All four use existing `p`, `v`, `colorTime`, `palette`, `seed` and `res`. Motion follows `colorTime` so **Freeze Color** freezes their intrinsic movement (the underlying geometry may still move). No second framebuffer, no new texture allocation, no WebGL2 integer functions or extra animation clock. `alchemyAmount:0` removes the entire module from the compiled shader, leaving previous art byte-for-byte through the unchanged source path. Lettering remains a separate compositor and is not color-treated by default. The chosen mode changes the shader cache key and the selected branch alone is kept before compilation.

## Controls / iPhone placement

**Effects → Light → Chromatic Alchemy** has a grouped mode picker; Presence, Field scale, Color motion, Spectral separation, Softness, White crown, Variation; **Use my current palette** (default on); eight named presets; **Shuffle color sorcery**, **Shuffle funky colors** and **Hide color sorcery**. Buttons use existing `history.change` so Undo works. A new mode selection raises Presence if the effect was previously hidden. The current canvas remains pinned under the existing layout.

Full Surprise samples color alchemy with a bounded probability (~38%), while targeted shuffles only modify their own settings. The whole-scene randomizer's optional GPU budget recognizes the new effect. Recipes save the selected mode and every scalar; old recipe documents restore with Presence 0, user palette intact.

## Validation / device caveat

The regression test file `tests/chromatic-alchemy.test.mjs` checks exact mode isolation, old recipe restoration, validation, 9:16 recipe round trips, target shuffles, renderer/cache integration and a **real Vite JSX transform** of the complete Inspector component. Run `npm run verify` (node tests plus production Vite build) before accepting the code on a development machine. Then use iPhone Safari to compare the same clock/seed in live preview, full PNG, and 2-3 second GIF/MP4, with and without Freeze Color. Watch for native MP4 wall-clock stutter, GPU compile warnings and saturation clipping.

**No local Vite build or physical iPhone/WebGL/GIF/MP4 run has been completed from ChatGPT's connector-only runtime; direct syntax and structure checks are not a substitute.** No Netlify deploy or GitHub Actions needed.
