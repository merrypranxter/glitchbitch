# Glitch Bitch — Ghost Scars (Neural Loom aftermath)

## Concept
Six new, opt-in on-thread marks use the **existing Neural Loom impulse**, *real sewn filament masks*, and existing palette optics. These are mathematical impressions of a recent nerve signal; they are NOT genuine cumulative memory or a saved history of the pixel. No additional GPU framebuffer, cache, render pass, texture, new timer, encoder, or server is involved.

The six looks:

1. **Phosphor aftertrace** — electric-line echoes, offset along the already moving strand
2. **Lichtenberg burn** — branching charred-looking fracture patterns
3. **Kintsugi sutures** — thin, illuminated repairs along the current filament
4. **Spectral bruising** — soft opal/prismatic color bruises across nerve-carrying threads
5. **Ghost knot fossils** — little ring-like buried electrical impressions
6. **Mycelial nerve scars** — fibrous branching ghosts and glowing spore-like flecks

Scars only draw where the original *sewn* filament core exists. Their colors come from the current palette; pulses derive from the already-established neural time and geometry. The scar clock is evaluated deterministically, so seeking directly to export frame 450 reproduces that frame regardless of previously drawn history.

## User controls

Filament Forge → Ghost Scars includes: scar morphology; intensity, pattern density, apparent persistence, fracture roughness, glow; six named recipes; **Scar the threads**, **Shuffle scar tissue**, **Shuffle haunted scars**, and **Heal all scars — keep nerves**. Selecting a scar automatically enables Neural Loom's 'Axon train' when neural behavior is dormant, while preserving authored geometry, underlying textile materials, stitch law, crossbreeding, jewelry, palettes and text.

The existing Plasticity and Contagion systems are independent and stay untouched.

## Saved recipes and GPU handling

- Default: scar mode **Off**, amount **0**; old recipes render with exactly the old shader path.
- Five bounded numeric controls plus typed mode are included in recipe validation, Undo/Redo, Surprise, Mutate, Reset and Find a Control.
- Only the chosen scar morphology branch is retained through `specializeFilamentScars`, then compiled in the same Filament Forge shader used by editor and strict PNG/GIF/MP4 exports.
- If the iPhone GPU cannot compile these optional scars in the **live preview**, it can disable only scars while preserving the existing neural effects. Strict export maintains its hard-fail parity policy and never silently deletes enabled scars.
- The repaired WebGL ping-pong frame history and H.264 MP4 encoder were not modified, and no Netlify build was triggered.

## Testing and limits

Added `tests/filament-ghost-scars.test.mjs` covering default-off compatibility, six-mode specialization, six presets, deterministic shuffles, recipe validation/save/load, existing shader assembly and full **22 × 31** geometry/stitch combinations composed with material, jewelry, contagion, nerve and plasticity modules.

The Filament Forge JS source was parsed and run in V8; **2,121 targeted structural checks passed**, including 682 combined weave/stitch configurations. The regression file was parsed. Actual Node/npm full suite, GLSL/WebGL compilation on real Safari, and visual MP4/GIF parity **have not been verified yet**.

Recommended first device test: pull the newest GitHub main into Google AI Studio, test 'Phosphor aftertrace' on a simple existing weave, run a 480px strict export proof, and then a short MP4 before attempting the 1440px/15s export again. If the old reserved-word error returns, ensure AI Studio refreshed to load new main.
