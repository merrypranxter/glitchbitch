# Shader Vault Wave 10 — G₂-inspired Torsion Membranes

Source inspiration (the user's own vault):
- [g2-holonomy.js](https://github.com/merrypranxter/shaderslop_designs/blob/main/by_math/11_hyperbolic_non_euclidean_higher_dimensions/g2-holonomy.js)
- [g2-membrane.js](https://github.com/merrypranxter/shaderslop_designs/blob/main/by_math/11_hyperbolic_non_euclidean_higher_dimensions/g2-membrane.js)

These original artworks generate competing 3-component direction and dual-response fields, map their misalignment to a symbolic torsion/strain value, and use the resulting seams for fractured structures, light fields and chromatic optics. Their use of **G₂** is *artistically symbolic*: the shader is **not** a mathematical computation of exceptional G₂ holonomy on a seven-dimensional manifold. Wave 10 keeps that inspiration without making a false scientific claim.

## In-app behavior

Location: **Math → G₂ Torsion Membranes** (also searchable in Find).

The new optional GLSL field computes:
1. Two bounded time-evolving coordinate folds,
2. A primary orientation \`phi\` and dual response vector,
3. A scalar strain \`abs(dot(phi,dual))\`, a wound/aperture mask, narrow photonic veins and relief structure,
4. An actual \`inout vec2 p\` domain deformation before the existing composed mathematical scene,
5. A **palette-derived** film-and-relief optical coat *after* the other Shader Vault materials, including spectral channel divergence that grows where the membrane's torsion and cracks are strongest.

This uses the existing main shader, geometry coordinates, palette, time/color clocks and export pipeline. No Three.js dependency, additional shader pass, texture, framebuffer, WebGL2-only requirement or fixed rainbow RGB color scheme.

The five distinct modes:
- **Torsion Silk** — cross-woven strain, directional satin ridges, interference veins
- **Kintsugi Ruptures** — dark open cracks bordered by bright repaired seams
- **Photonic Tectonics** — raised tile optics and jewel-like structural sheen
- **Living G₂ Chamber** — deforming organic chambers and internally lit membranes
- **Scar-Crown Cathedral** — sharp radiant fractures and embossed crowns

Presets: Opaline Torsion Satin, Broken Kintsugi Halo, Prismatic Photonic Skin, Strange Living Membrane, Serrated Jewel Cathedral and Soft Botanical Opal. Each preset sets all controls while leaving seed, artwork geometry engine, palettes, typography, other shader layers and video settings unchanged.

11 controls: presence, scale, geometric bending, motion, torsion, fractures, veins, sheen, palette phase, spatial variation and spectral dispersion. Independent shuffle and Hide buttons. Existing 176+ palette names/color stops remain available.

## Preservation and performance

- **Off by default (\`g2Amount=0\`)** in every old or imported recipe. The new shaders are not inserted into the GLSL source or compiled when off.
- \`Mutate\` never wakes the dormant membrane; it can nudge active membrane controls only.
- \`Surprise Me\` can opt into the membrane and randomizes its controls as part of the wider studio's randomizer.
- Changing a mode or pressing Apply recipe explicitly activates it.
- Preview GPU compilation can gracefully disable only this newest shader, showing a visible “G2 Torsion Membranes” warning. **Exact PNG, GIF and MP4 cannot quietly drop it**: strict shader compilation still raises an actionable parity error.
- The shader uses just two fixed iterations per fragment, with bounded domain displacement. No 150-step raymarch, screen-sized buffers or graphics memory histories.

The new GLSL hooks are inserted into the same shared fragment shader for preview and all exports. It does not change the existing exact MP4/GIF recording path, encoding settings, text compositor or loop-surgery code.

## Verification

Added \`tests/g2-torsion-membranes-wave10.test.mjs\`: seven regression suites for old-recipe defaults and validation, six recipe roundtrips, shuffle determinism including invalid RNG values, Mutate/Surprise behavior, mathematical shader structure, optional shader hook placement, and Math/Find UI wiring.

No Netlify deploys, GitHub Actions workflows or external build credits were used. The connected GitHub editor can inspect and modify repository files, but the local runtime cannot resolve GitHub to clone the repository. Therefore the full Node test suite, Vite build and physical iPhone WebGL shader compilation/MP4 color inspection still need to run in Google AI Studio or the device browser. The source and connector-based checks below are not a substitute for actual device export verification.
