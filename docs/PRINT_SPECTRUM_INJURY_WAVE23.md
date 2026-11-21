# Wave 23 — Print & Spectrum Injury

This wave adapts the visual behaviors found in the artist's [Rainblow Ditherscape](https://github.com/merrypranxter/shaderslop_designs/blob/main/by_math/16_dithering_halftone_print/rainblow-ditherscape.js), [Chromadepth Riso](https://github.com/merrypranxter/shaderslop_designs/blob/main/by_math/14_visual_perception_stereograms_phosphenes/chromadepth_riso_20260623_115743.js), [Hypercolor Damage Carnival](https://github.com/merrypranxter/shaderslop_designs/blob/main/by_math/15_signal_processing_vhs_crt_glitch/hypercolor_damage_carnival_engine_20260619_111904.js) and [spectral optical experiments](https://github.com/merrypranxter/shaderslop_designs/tree/main/by_math/13_optics_spectral_color_science). It does **not** copy their full WebGL2/feedback/raymarch architecture.

## Four independent effects

1. **Rainbow XOR Ditherscape:** time-evolving arithmetic XOR parity, pixel thresholds and palette-indexed interference. Does not require WebGL2 bitwise operators; unlike static 4×4 Bayer dithering, the pixel decisions move in time.
2. **Caustic Ink-Dot Erosion:** three rotating halftone plates each receive independent caustic warping, dynamic ink density, near/far brush movement and spectral highlights. Unlike the existing three-angle Riso, dot gain is attached to field-derived illumination.
3. **Hypercolor Damage Reactor:** RGB→HSV→RGB signal processing driven by local luminance, field geometry, traveling hue warp and controlled spectral scorch. It is analytic and does not use frame feedback.
4. **Spectral Fracture Comb:** three differently phased interference channels are modulated by moving high-frequency notches and cross-channel beats. This is a bounded optical-art approximation, **not** a physically exact sampled spectrum or true dispersion.

## Controls

Under **Effects → Glitch → Print & Spectrum Injury**, choose the mode and adjust Presence, Spatial frequency, Motion, Color separation, Dot grain/damage, Neon/white glow, Variation, **Use my current palette** (defaults on). Includes eight instant presets, standard and extreme shuffles, and a Hide button. Every action uses the app's normal `history.change` for Undo.

## Safety and compatibility

- Every old recipe gets `injuryAmount=0` by default and retains all earlier state. The shader is **not compiled when disabled**, and only one selected GLSL mode is compiled when enabled.
- The shader cache key distinguishes all four modes. The renderer's first compile fallback drops only Print & Spectrum Injury; Wave 22 Color Sorcery and the original composition remain visible.
- Uses existing `p`, `v`, `colorTime`, `seed`, `palette` and `res`. No extra texture, framebuffer, GPU pass, timer or dependency.
- Existing typography is a separate 2D compositor and is not recolored by print effects.
- The targeted shuffles preserve colors, artist's text, geometry, previous Color Sorcery and all other effect systems. Full Surprise samples the print effect selectively, and the chaos-budget system counts its cost.
- Existing PNG/GIF/MP4 exporters share `createRenderer`; full export parity and device frame pacing still require testing.

## Gate

Regression file: `tests/print-spectrum-injury.test.mjs` exercises eight cases including mode pruning, full recipe round trips, deterministic shuffles, mobile-safe syntax, cache/fallback wiring, and **a real Vite JSX transform**. Run `npm run verify` (tests and build) through a development environment before trusting the app. Check iPhone Safari preview and 1:1 / 9:16 PNG, two-to-three-second GIF and MP4 at the same animation time.

No new Netlify deployment and no GitHub Actions required.

## Next expedition

Spectral desynchronization with individually different RGB temporal histories is more computationally expensive because the source uses previous-frame feedback. Implement it only as a deliberately opt-in, bounded extension of the existing Frame Memory system—never hidden inside the lightweight Print & Spectrum effects.
