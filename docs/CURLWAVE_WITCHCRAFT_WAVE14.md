# Wave 14 — Curlwave Witchcraft / Living Currents

## Original shader and real mathematical foundation

Adapted from the artist's own [`violet-curl-waves.js`](https://github.com/merrypranxter/shaderslop_designs/blob/main/by_math/05_noise_flow_fluid_fields/violet-curl-waves.js). That original combines a curl field derived from a noise potential, advected flowing texture, a finite-difference Laplacian to isolate curved wave crests, moving thin-film rainbow interference and sparse advected star dust.

The new shader isn't a straight copy of the original standalone Three.js renderer. Instead, `src/curlwave-witchcraft-wave14.js` makes the idea a **single optional shader module in Glitchbitch's original GPU pipeline**.

Specifically, it defines a time-evolving stream function `vcPsi(x,y,t)` and forms a divergence-free curl velocity

`v = (∂psi/∂y, -∂psi/∂x)`

using central differences. That actual 2D flow field warps the coordinates **before the user's chosen math engine evaluates them**. A second fragment-side calculation advects a two-octave/noise wave height field, estimates its gradient and Laplacian from four neighbors, highlights high-curvature crests, and creates palette-dependent flowing filaments, iridescence and sparse glints. Animated `time`, `colorTime`, original seed, scene position and the owner's actual palette all participate.

No new canvas, independent Three.js scene, feedback buffer, shader texture/FBO, file format or export pathway. The effect runs inside the **same programmable WebGL renderer used by preview and strict PNG/GIF/MP4 exports**. Animated optical patterns are deterministic functions of the same project clocks and recipe. That is necessary for export fidelity, but true GPU/color comparison still requires browser testing.

## Five fluid species

1. **Violet Curl Sea** — luminous wave crests on moving deep water.
2. **Hairpin Caustic Ribbons** — narrow flowing interference ribbons and hairpin caustics.
3. **Bioluminescent River Veins** — living vein-like streams, filaments and glowing pathways.
4. **Oil-Slick Vortex Velvet** — flowing glassy oil-film colors and dark velvet troughs.
5. **Stormglass Interference** — foamy crest collisions and high-intensity spectral stormwaves.

Six ready-to-use recipes: Violet Deepwater, Caustic Hairpin Halo, River of Alien Nerves, Oil Spill From Heaven, Stormglass Vortex Rite, Subtle Oceanic Sheen.

The **13** independent, validated 0–100 controls are presence, scale, animation speed, actual geometry advection strength, curvature-crest emphasis, interference-film color, moving dust, glow, palette phase, fluid-body depth, curl turbulence, seeded variation and flowing filament density.

## Control Room UX and safety

Find the lab in **Effects → Materials → Curlwave Witchcraft · Living Currents**. It is also indexed in Active Effects, Favorites and Find. Apply a recipe, choose a species, and use independent **Shuffle living currents** or **Hide Curlwave**. The body controls appear progressively when presence is nonzero, not in another endless ungrouped column.

- `vcAmount=0` on new canvases and on every older recipe. The new shader is not present in the compiled program at all while disabled.
- The full **Surprise Me** randomizer can choose the new lab and randomize all its parameters. **Mutate** never activates an off lab; active labs can be nudged without changing their species.
- Scoped shuffle changes only the `vc*` parameters. It leaves title, original palettes, text/quotes, touch marks, unrelated shader effects and saved works unchanged.
- A confirmed **NEW CANVAS** restores `vcAmount=0` and the canonical starter, together with the existing reset semantics.
- Fast preview can disable Curlwave only if that GPU can't compile the combined optional shader, with a visible effect warning. Strict exact-effects export throws instead of silently dropping Curlwave.
- No Netlify deploy, Actions run, dependencies or GitHub page rebuild requested.

## Verification status

Added **eight Node regression suites** in `tests/curlwave-witchcraft-wave14.test.mjs`, including a numerical divergence-free field check, saved recipe and clock round-trip, all 13 field ranges, missing-field migration, deliberate Surprise Me and protected Mutate behavior, five real shader branches and their source function families, source renderer/strict-export gating and Control Room metadata.

Added **two Playwright browser cases** in `tests/e2e/curlwave-witchcraft-wave14.spec.js` covering touch-friendly selection, presets, hide/undo and confirmed New Canvas.

Source/JavaScript checks are not a substitute for a Vite build or GPU test. Verify actual iPhone Safari compilation, 30-second MP4/GIF encoded output, and frame-by-frame visual parity with representative complicated combinations before labeling this a fully proven GPU effect.
