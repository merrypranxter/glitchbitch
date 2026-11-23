# Shader Vault Wave 6 — Crossbreed Lab

The sixth wave interbreeds the five prior Shader Vault inventions. Modules 1–5 were already merged and stay independently editable:
- Hexagram Terraces: six binary fields with 64 possible changing regions
- Complex Poles & Zeros: moving rational singularities and complex phase
- Order / Dissolution Quasicrystal: bounded wave interference, entropy and rupture
- Living Velvet Damask: p4m cellular motifs and finite-difference velvet normals
- Hyperbolic Crochet: ruffled 3D signed-distance lace with a capped 20-step raymarch

## Genuine coupling, not preset stacking

Crossbreed Lab reuses the parent fields that the shared Glitchbitch shader already evaluated in its main fragment shader. Specifically:
- Hexagram diagnostics: region, changing-line boundary, terrain and motion
- Pole diagnostics: complex phase, proximity to poles/zeros, phase ridges
- Quasicrystal diagnostics: order, dissolution, damage, quantized structure
- Velvet diagnostics: cellular growth height and surface-normal components
- Crochet diagnostics: bounded 2D polar ruffle displacement

After reading these sources, an offspring changes the actual main geometry coordinates BEFORE base mathematical engines, filament layers and crochet SDF shading sample them. In velvet hybrids, parent events also change tissue height and slope BEFORE velvet material shading. A small optical reaction then uses the already-selected editable palette. This does NOT compute parent functions again or introduce extra raymarches.

## Modes and actual parent requirements

1. Oracle Singularity Brocade — Hexagram + Complex: changing-line borders steer moving pole directions
2. Dissolving Crochet — Quasicrystal + Crochet: damage and dissolution deform real ruffled crochet geometry
3. Velvet Event Horizon — Complex + Velvet: near-zero/pole intensity changes tissue height, wet sheen and geometry flow
4. Hexagram Bio-Jacquard — Hexagram + Velvet: changing oracle borders seed active biological velvet growth
5. Five-Way Chimera — all five fields provide an interdependent deformation and tissue-growth signal

Seven named presets include Oracle Silk Event Horizon, Chladni Faultline Crochet, Five Roots of Velvet, Biological Oracle Brocade, Five-Way Mutant Cathedral, Opalescent Neuro-Textile, and Ruptured Alien Lace.

## UI

Math -> Shader Vault Crossbreed Lab: five offspring species, seven recipes, one-click Activate Missing Parents, isolated Shuffle Crossbreed, Hide Offspring and ten sliders (Amount, Coupling, Geometry Warp, Filigree, Glow, Motion, Hue, Tension, Variation, Resonance).

Selecting a species or recipe automatically enables required dormant parents, preserving other artwork, author lettering and palette. Parent settings remain editable individually. Hide Offspring sets only breedAmount to zero; parents stay active. If a parent is disabled, the offspring turns off by design until its requirements are restored.

The full Chimera is much heavier than a two-parent cross. When it first awakens an inactive crochet engine, quality is limited to 32/100 (roughly 11 raymarch steps); it does not override a pre-existing manually selected crochet quality. For iPhone and large exports start with two-parent hybrids and low crochet quality.

## Compatibility and exact-export safeguards

- All legacy recipes default to breedAmount = 0, so no new offspring shader code compiles for old art.
- Breeding shaders are only built if all required parent shaders are enabled. Each output draws from pre-existing parent diagnostics; no extra framebuffer, GPU readback, texture, CPU simulation or independent clock is added.
- Compatible-shader preview may disable the offspring on compilation failure, preserving parents. Exact-effect export throws the existing parity error rather than silently omitting the offspring.
- All ten numeric controls are 0–100 and persisted in saved recipes. Mutation does not awaken an absent offspring; full Surprise Me may enable the parents and offspring together.
- The live renderer and GIF/MP4/PNG capture share the same shader with consistent geometry and color clocks. This does not by itself guarantee flawless encoded looping for arbitrary durations.
- No Netlify deployment, GitHub Actions, dependencies, video encoder, existing shaders, text compositor or image assets were modified.

Source-level regression suite: tests/crossbreed-lab-wave6.test.mjs (seven tests). Mobile GPU compilation, full npm test/Vite build, performance and decoded GIF/MP4 parity still require an executable repository and a real device.
