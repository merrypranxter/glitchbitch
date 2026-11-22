# Regeneration Loom — growing new fiber geometry from Ghost Scars

## Purpose

Glitch Bitch's previous Ghost Scars shader changed the lighting, color and surface of *existing* electrical fibers. This wave creates **additional procedural daughter-line geometry**. The new thread core, halo and edge masks are combined into the original moving fiber geometry **before** coloring, material dressing, neural signals, stitch-driven surface shading, trinkets, and output composition.

This is **procedural 2.5D line growth**, not permanently accumulated yarn meshes or a stateful cellular-growth simulation. It uses the current frame time to simulate repeatable growth/recede cycles. Exporting any frame at the same time reproduces the same result without storing prior GPU frames.

## Six new regrowth behaviors

1. **Forked nerve shoots** — diverging daughter fibers follow a scar-centered local phase.
2. **Wound bridges** — thin bridging sutures across local gaps in the daughter growth field (not removal of the original thread).
3. **Mycelial fan** — three offshoot distances create layered fungal-looking filaments.
4. **Pearly callus** — periodic bulges grow into fresh raised fiber geometry.
5. **Gold repair vines** — a sinuous prismatic repair vein follows the existing nerve-carrying line. The existing artist palette determines its actual color.
6. **Synaptic grafts** — child-fiber reach responds to actual incoming crossing-core contact when a second parent is interwoven; solo fibers still sprout.

Five continuous controls: presence, branching frequency, growth speed, reach/thickness, fresh-fiber glow. Six presets, randomization of all/alien subset, plus **Stop growing — keep scars**. The controls live under Filament Forge → Regeneration Loom, with standard undo, save, validation, search, reset, Surprise and Mutate.

## Implementation and export safety

- A new `#ifdef FILAMENT_REGENERATION` block is located after the original stitching reveal but **before the palette and shading passes**. It generates `childCore` and `childHalo` from thread-local distance fields, then updates `core`, `halo`, `edge`, and `maskCore`. The original core remains intact.
- A small new-fiber glow is shaded on those generated fibers by the same fragment program and palette. This is not a postprocess sticker or different export-only effect.
- Branches adhere to the already-sewn mask when animated stitching is on; the crossbred donor contact is based on the original parent's actual core.
- The shader is compiled only if Neural Loom + Ghost Scars + Regeneration are all enabled, and only the chosen one of six shape branches survives specialization. Selecting a preset activates dormant prerequisites while preserving existing art settings.
- Preview-only GPU fallback can disable only regrowth if the mobile fragment compiler cannot handle it; strict-effects PNG/GIF/MP4 remains **strict** and refuses to silently omit selected artwork effects.
- The prior Safari frame-history ping-pong and MP4 encoders are untouched. No extra GPU textures, history buffers, render pass, network requests, or independent time source. Old recipes default Off/zero.

## QA

`tests/filament-regeneration-loom.test.mjs` covers default-inert recipes, typed controls, presets/save-load, deterministic randomization, individual branch pruning, all 22 × 31 geometry/stitch combinations composed with previous materials, ornaments, contagion, Neural Loom, synaptic plasticity and Ghost Scars, search/reset and strict export invariants.

The module parsed and executed in a V8 harness. **2,070 direct structural assertions passed** and the new GLSL was scanned for reserved identifiers. These are not proof of actual WebGL compilation. The full npm test run, real iPhone Safari GLSL compiler, and visual PNG/GIF/MP4 parity remain unverified.

**First hardware test:** Save current recipe, pull latest `main` into Google AI Studio, pick **Forked nerve shoots** on an existing weave, use the 480px strict export proof, then a short MP4. After that, try 1440px/15s/30fps. If compilation fails on device, capture the exact error message. Do not reduce bitrate for a shader syntax error.

No Netlify deployment.
