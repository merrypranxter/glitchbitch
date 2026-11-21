# Glitch Bitch — Contagion Loom

## What this adds

The Thread Metamorphosis family gains **six** independently selectable transmission laws, with a dormant **Off** state: Stitch relay, Crossing fever, Mycelial bridge, Spark jump, Knot epidemic, and Spore drift.

**Actual hybrid contact:** `filamentField` now exports its already-sewn core mask and a material-transformation carrier to the next hybrid parent. The second parent computes a handoff using the product of **the first parent's core, the second parent's current core, and the first parent's active material carrier**. If either parent is absent at that pixel, or the first carrier isn't active, contact transmission is zero. The signal influences how the second-parent target material emerges at genuine crossings.

**Along-fiber propagation:** Phase-coupled, seeded procedural wavefronts run along the real moving filament's coordinates, for single- and dual-parent textiles. There is a controllable delay and a material-boundary glow. The six laws differ: sewn packets, crossing responses, seeded fungal rings, intermittent sparks, knot clusters, and soft spore clouds. All transmission is combined with the **existing real two-material rendering**, not a fullscreen tint.

**Important technical distinction:** this is deterministic *analytic propagation*, not a stateful reaction–diffusion or graph simulation that permanently remembers every infected segment. The crossing handoff is grounded in real overlapping thread masks, while longer-range spread is a time-dependent approximation. It deliberately avoids new feedback buffers after the recent iOS GPU history-copy issue.

## Artist controls

Under Filament Forge → **Contagion Loom**:
- Transmission behavior (7 options including Off)
- Transmission intensity
- Neighbor reach / contact handoff
- Propagation velocity
- Recipient response lag
- Infection boundary glow
- Six one-click paired-dressing presets
- Shuffle contagions, shuffle cursed infections
- Quarantine — keep transformed threads

Contagion automatically activates the existing material-morph controls when selected. If a material's existing target equals its source, the selector picks a different actual finish. It does **not overwrite** the base 'Dress the Threads' material, geometry, sewing, ornaments, color or text. A crossbred weave is recommended to see real two-parent transmission at touching stitch cores.

## GPU, recipes and exports

- The contagion computations live inside the already selected filament fragment shader; no textures, second render pass, CPU loop, network or independent timeline.
- The engine's source string is specialized to **only the selected contagion law**, and is compiled only with active material morphing and nonzero contagion intensity.
- Preview GPU fallback disables only Contagion first, keeping the underlying material-morph effect. Strict export **does not silently omit** contagion, consistent with the repaired MP4/GIF exporter.
- Original saved recipes migrate with Contagion **Off, intensity 0**.
- New settings are included in recipes, validation, Undo, Surprise, Mutate, Find a control and Reset.
- The frame-memory ping-pong fix, GIF/MP4 encoders and text overlay logic were not modified.

## Verification and remaining QA

Added a Node regression suite for disabled defaults, recipe roundtrip, each one-tap look, deterministic shuffles, actual core-based carrier handoff and source isolation across the **22 × 31 filament geometry/stitch combinations**. Direct V8 evaluation ran **2,119 structural assertions**, which passed, including specialization, brace balance, UI links, and preserved strict-effect guardrails. Recipient-lag equations were improved afterward; the six laws were also checked again for structural correctness.

**Not verified:** real WebGL shader compilation on iPhone Safari, complete npm/Vite suite or exact GIF/MP4 visual output. Testing in Google AI Studio should start with a saved recipe, a 480px full-effects proof and a short MP4 with two parent threads touching before attempting high-resolution 30-second exports.

No Netlify credits were used.
