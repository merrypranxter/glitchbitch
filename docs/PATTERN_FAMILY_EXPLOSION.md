# GLITCHBITCH — Pattern Family Explosion
## Three independent, safe PRs

The screenshots request more real animation and more **funky**, maximalist design species across Self-Weaving, Microtexture, Substance, Bio Rot, Living Underlay, Sculpted Threads, Photon Zoo and Backdrop. Each family should maintain old saved names/indices, preserve palettes/text and export using the existing renderer. Novel shader branches must be mathematically distinct and have a moving, time-dependent structure; preset-only additions must be labeled honestly.

### PR 1 — Texture & Matter (implemented in this branch)
**Microtexture:** 6 original + 10 real additional animated shader branches = **16**; grouped Original, Opaline minerals/fabrics, Living microorganisms, Funky contamination. Ten named recipes, selectable native optgroups, spawn, shuffle all, shuffle new, reseed, hide.

New modes: **Mother-of-pearl dust** (interference flake films), **Prism pollen** (seeded refractive spores), **Bubble silk** (moving soap-film micro rims), **Frost lace** (multiscale growing crystal seams), **Cilia swarm** (orienting waving hairs), **Neon barnacles** (pulsing shell pores), **Hallucination pores** (non-Euclidean moving pit mouths), **Mold sequins** (shimmering creeping discs), **Alien dandruff** (polygon flakes drift), **Maggot beadwork** (segmented motile threads).

**Substance:** 4 original + 8 mathematically distinct animated matter branches = **12**; originals including Conformal Chromasoup remain intact. Additional materials: **Oil-slick membrane** (thin-film interference), **Pearlescent cartilage** (pressurized tissue ridges), **Vitreous mucus** (thick moving meniscus), **Silica pulp** (accreting mineral pores), **Foam enamel** (Plateau-like borders), **Candy tumor** (swelling radial tissues), **Alien aspic** (inclusions in translucent gel), **Radioactive sherbet** (electroluminescent fizz). Eight presets, grouped picker, shuffle all/new, reseed, hide.

**Bio Rot:** Eight curated **real Gray–Scott reaction–diffusion feed/kill regimes**, NOT invented simulator modes: Candy mold, Petri cathedral, Rainbow lichen bruise, Toxic bloom, Fungal lace, Neural slime, Spoilage halo, Witch agar. All preserve the existing bounded 96x96 simulation and growth clock; no new GPU system.

**Mobile safeguards:** shader specialization builds only the selected Microtexture and Substance branch (original numeric IDs unchanged), and the renderer program cache keys now include each selected micro/matter ID so changing dropdowns cannot reuse the wrong compiled program. Presence 0 leaves old artwork dormant. No extra textures, framebuffers, dependencies, network calls, or new per-frame JS loops. The existing compilation fallback is left alone.

### PR 2 — Fabric & Relief (next)
- **Living Underlay:** new actual shader geometries for Holographic Brocade, Ghost Quilt, Threadbare Cathedral, Elastic Tartan, Moiré Satin Haze, Haunted Upholstery, Radioactive Afghan, Parasite Upholstery, Wet Relic Cloth and Disco Shroud. Movement is woven fabric pressure, interference, threads and shifting pile, not fading backgrounds.
- **Sculpted Threads:** keep the old five sculpt-mode IDs; implement new distinct relief calculations for Beaded Emboss, Cushion Stitch, Gilded Repoussé, Bas-relief Threadwork, Carved Appliqué, Bone Inlay, Melted Jewelry, Alien Scar Tissue, Fossil Stitching and Ruin Filigree. Shared light direction, thread shape and shadow/depth controls remain.
- **Self-Weaving funky tier:** Parasite Hem, Oracle Tacking, Spasm Tatting, Hologram Darning, Ritual Overlock and Witch-Knot Relay, each with a new needle/core reveal behavior. Retain all fifteen existing motions and dual-parent compatibility.
- Separate modules and shader-specialize the selected family branch. Add per-family shuffle and a targeted *Funky* shuffle.

### PR 3 — Optics & Space (following)
- **Photon Zoo:** preserve the 18 original-plus-wave optical species; add Candy Singularity, Pollen Eclipse, Jelly Cathedral, Haunted Lenticules, Iridescent Spore Halo, Prism Amoeba, Neon Diffraction Fungus, Opal Thunder Lattice. These must be truly distinct optical geometry systems.
- **Backdrop:** extend its existing animated shader with Smog Cathedral, Luminous Dustfall, Aurora Static, Echo Chamber Mist, Candle Plasma Haze, Velvet Signal Fog, Mold Heaven, TV Séance, Hallucinogenic Wallpaper, Synthetic Dusk Ooze, Afterimage Swamp and Ghost Mall Aquarium. Add time-dependent depth/parallax, organized modes, and built-in but disableable subtle motion.
- New presets and family-targeted shuffle for each without harming user text/palette. Protect 9:16 and 1:1 exports, original mode IDs, Safari compile limits.

### Verification requirements
- Run `npm test`, `npm run build`, and actual iPhone Safari WebGL compilation and GIF/MP4 parity after source review. Static JavaScript/GLSL branch checks do **not** prove successful compilation.
- Confirm the initial six/four modes remain bit-for-bit equivalent in their formulas, prior saved recipes round-trip, no hidden effects turn on when presence is zero, every family appears in Find, and changing selected shader modes recompiles the correct cached program.
- No automatic Netlify deploy without approval.
