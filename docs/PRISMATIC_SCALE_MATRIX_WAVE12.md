# Shader Vault Wave 12 — Prismatic Scale Matrix / Living Jewel Skin

Original source: https://github.com/merrypranxter/shaderslop_designs/blob/main/by_math/13_optics_spectral_color_science/prismatic_scale_matrix_20260625_145149.js

The source builds a live overlapping scale field (diamondback, shield, elongated, hex packing), chooses a top shingle by cell depth order, and applies dome normals, per-cell identity, angle-sensitive thin-film color and diffraction. Wave 12 adapts the actual mechanism into the shared Glitchbitch WebGL renderer, rather than importing the original Three.js scene or replacing the underlying math artwork.

## Five new scale anatomies

1. Diamondback Prisms — raised faceted chevrons and crystal edges.
2. Opaline Shield Plates — hexagonal, sculpted reptilian shields.
3. Electric Eel Scutes — elongated wet optical ridges.
4. Koi Cathedral Scales — scalloped fish scales with glistening interference.
5. Serrated Alien Leaf — spiked botanical armoring.

Six starting recipes: Iridescent Koi Armor, UV Diamondback, Opaline Shield Sutures, Slick Electric Eel, Xenobotanical Scalpel, Gentle Pearly Fishskin.

Thirteen material controls: amount, density, overlap, dome lift, motion, thin film, diffraction, hue, warp, variation, sheen, edge seams and local complex-domain hue. They are all recipe-persisted and bounded 0–100.

## Organized mobile UI

Find **Effects → Materials → Prismatic Scale Matrix · Living Jewel Skin**. Compatible with Codex's Active/Favorites/Find/Reset control room. The initial panel shows anatomy, preset picker, presence and core surface shape (density, overlap, lift, film). Additional controls are collapsed into two meaningful groups: **Optical alchemy · advanced** (diffraction, hue, sheen, edge, domain) and **Living surface · advanced** (motion, warp, variation). Independent Shuffle and Hide buttons.

## Mechanism

The native fragment shader scans a fixed 3x3 cell neighborhood and selects the front overlapping shingle by height minus directional depth. Five different distance laws create five different physical-style silhouettes. A single bounded relief normal provides diffuse and specular light, without three expensive extra neighborhood scans. Grazing-angle film color, multiband interference, and diffraction stripes use the current Glitchbitch palette and color clock. Deterministic time produces moving scale flow. Density adapts to output resolution so tiny iPhone previews avoid extremely small plates. This is a physically inspired approximation, **not** full 3D ray tracing or calibrated film optics.

The material is composed over the underlying art **before** Glitchbitch's animated light and kinetic lettering, preserving its original shape and words. There are no extra textures, framebuffers, raymarch loops, codec changes or additional rendering passes.

## Compatibility and verification

- Off by default for existing artwork and the exact original New Canvas starter.
- The shader is absent from compiled GLSL programs when off.
- Mutate never wakes the dormant material; Surprise Me can choose and activate it.
- Targeted scale Shuffle does not alter user palette, seed, other shader systems or typography.
- Same shared WebGL shader for preview and exact PNG/GIF/MP4. Preview compile problems visibly warn and disable only the scale skin; strict export refuses silent effect omission.
- No Netlify costs, deployment, new dependencies or GH Actions changes.
- Eight new Node regression suites cover canonical/migrated defaults, presets, save/restore and animation clocks, randomizer, 3x3 geometry and optics, exact-export shader hooks, and control-room integration.

Browser build, GPU compilation on iPhone Safari and actual video color/fidelity are still **unverified** because there is no local repository/browser execution in this connector session.
