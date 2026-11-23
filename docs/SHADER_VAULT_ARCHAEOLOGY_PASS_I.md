# GLITCHBITCH — SHADER VAULT ARCHAEOLOGY, PASS I
## Source-grounded comparison and build candidates, November 22, 2026

**Purpose:** Decide what to build after several rounds of real GIF/MP4 looping exports and Loop Surgery effects. This is **research and candidate triage**, not a claim that every archived shader has been read or integrated.

### Where the original shader vault actually lives

- **[shaderslop_designs/by_math/](https://github.com/merrypranxter/shaderslop_designs/tree/main/by_math)** — its own README describes **697 collected .js sources** from shader_files_2, shaderfiles3 and repo_script_js5_code; it says **164 exact duplicates**, **533 distinct sketches**, **427 headless-WebGL-tested working designs** across **19 math families**, and **106 unsuccessful variants** documented in `_not_working.md`. These counts are claims in the existing archive README, not a fresh re-test.
- **[shaderslop_designs/sewing/](https://github.com/merrypranxter/shaderslop_designs/tree/main/sewing)** — includes finished shader pairs, textile/embroidery demos and multiple GLSL utility sources. Its README describes 24 complete animated shader pairs, 16 reusable GLSL snippets and 13 demos/utilities. A useful direct source for threaded material behavior.
- **[shaderslop_designs/GLITCHY/](https://github.com/merrypranxter/shaderslop_designs/tree/main/GLITCHY)** — cross-indexed MySpace/webcore, VHS, datamosh, dither, psychedelic and hybrid shaders, including recovered older files. Good reference gallery for deliberate transition/texture corruption.
- Source archives **[shader_files_2](https://github.com/merrypranxter/shader_files_2)** and **[shaderfiles3](https://github.com/merrypranxter/shaderfiles3)** contain the original .js/.html pairs, alongside many timestamped revisions.
- **[design_catalog.json](https://github.com/merrypranxter/shaderslop_designs/blob/main/design_catalog.json)** describes 164 older root designs with moods, scores, mathematical ingredients and known duplicates. Its scores reflect an earlier site's aesthetic assessment, not current Glitchbitch engine coverage.

### What we already have — please don't reimplement it blindly

The November 22 `glitchbitch/main` source inspection found all these existing modules:

- `src/chromatic-alchemy.js`: **Birefringent Cellophane**, **Chromadepth Risograph**, **Phosphene Gem**, **OKLab Chroma Oracle**.
- `src/structural-thread-optics.js`: soap-film/opal, diffraction grating, anisotropic chrome, holographic organza and related thread coats.
- `src/print-spectrum-injury.js`: moving XOR ditherscape, caustic ink dots, hypercolor damage and spectral fracture.
- `src/microstructure.js`: 16 microtexture families, including mother-of-pearl, cilia, frost lace, bubble silk and funky contaminants.
- `src/substance.js`: 12 animated tissue/material families, including chromatophore reef, chitin, oil-slick membrane, silica pulp, foam enamel and alien gelatin.
- `src/renderer.js`, `src/filament-forge.js` and `src/ui-index.js` also already include **fivefold diffraction, extensive filament families, digital/print corruption, complex textile interactions and stereoscopic effects**. Avoid renaming existing preset IDs or silently bypassing exactEffects export.
- Loop Surgery & True Boomerang are merged and working in source-level regression checks; real physical iPhone Safari/GIF/MP4 output remains the acceptance test.

## Verified deep-dive candidates (actual shader code inspected)

### 1. HEXAGRAM TERRACES / ORACLE MORPHOGENESIS — strongest short-term candidate

**Exact source:** [by_math/19_symbolic_systems_tarot_iching_zodiac/acid-iching.js](https://github.com/merrypranxter/shaderslop_designs/blob/main/by_math/19_symbolic_systems_tarot_iching_zodiac/acid-iching.js); another older [acid-iching.html](https://github.com/merrypranxter/shaderslop_designs/blob/main/acid-iching.html) has a related, different embedded shader.

**Distinct mechanism:** six individually sampled noise bands become a **6-bit hexagram identity (64 states)**; the JS source function `evaluateHexagramField` quantizes/terraces noise, tracks near-threshold changing lines and **warps the next bit's coordinate with the previous bit** (an XOR-ghost / nonlinear field). It computes a relief normal from multiple height samples and uses specular + interference to visualize changing regions.

**Glitchbitch opportunity:** an independent *geometry/relief/mask field*, optionally driving a filament region, structural-color coat, spatial material selection, or automatic two-tone palette assignments. The interesting part is the **64-state boundary network and changing-line transition**, not literal divination or just a picture of an I Ching hexagram.

**Implementation cautions:** sample counts (6 × multiple height samples) and GLSL precision; keep a cheap 2D version for iPhone. Make it color-palette aware and usable without enabling typography. Do not label the result "physical I Ching physics".

### 2. SCHLIEREN REFRACTIVE GLASS / DISTORTION AS MATERIAL — higher-impact, more complex

**Exact source:** [prismatic_sigil_glass_20260624_004811.html](https://github.com/merrypranxter/shaderslop_designs/blob/main/prismatic_sigil_glass_20260624_004811.html), whose self-contained embedded shader was decoded for this inspection.

**Distinct mechanism:** animated 2D fBm haze, SDF shape boundaries, **finite-difference SDF normals**, displaced sample positions (`refUV = uv + normal * 0.06`) and bright, specular glass rims. Moving schlieren ripple bands bend the background underneath floating glass symbols. This is not merely hue shift or color fringes.

**Glitchbitch opportunity:** let living lace, filament or cellular art behave like **heat-haze refractive glass** and distort adjacent layers. Expose spatial refraction radius, edge curvature and dispersive intensity, tied to material/filament masks rather than covering the screen indiscriminately. Background should remain rich, not flat.

**Implementation cautions:** to refract the *already composited* artwork may require sampling a previous-pass texture instead of only running equations on original UVs. A simple one-pass color shift is **not the same effect**. Prioritize exactEffects parity for PNG/GIF/MP4 and iOS GPU memory. Use the current renderer architecture's existing textures/pass(es) rather than adding an unbounded FBO chain.

### 3. COMPLEX POLES & ZEROS / DOMAIN-COLOR SPATIAL REMAPPING — new structural mathematics

**Exact source:** [art_20260709_142745.html](https://github.com/merrypranxter/shaderslop_designs/blob/main/art_20260709_142745.html), whose embedded source was decoded.

**Distinct mechanism:** explicit complex arithmetic (`cdiv`, `cexp`, `clog` and complex power); a moving **rational map (z^5 − 1)/(z^2 + moving pole)**, then Voronoi cell identification and edge distances drive interference color and microglints. It also uses a separate signed-distance heart shape, so **do not claim** that the source's heart or Voronoi cells are automatically an Apollonian gasket in implementation.

**Glitchbitch opportunity:** treat the complex rational transformation as an optional coordinate-warp *before* existing threading, substrate, growth and colors. Poles create dramatic local stretching; zeros create collapsed filigree zones. Build the warp as a non-destructive, strength-controlled math transform rather than copying the entire hot-pink heart scene.

**Implementation cautions:** singularity clamps, predictable source sizes, fragment budget, mobile touch controls and seed reproducibility. On the base renderer it may be easier as a new engine species rather than a global post-process.

### 4. ORDER → DISSOLUTION QUASICRYSTAL / PHASE-CHANGE TRANSITION — intriguing and interactive

**Exact source:** [quasicrystal-oscillator.html](https://github.com/merrypranxter/shaderslop_designs/blob/main/quasicrystal-oscillator.html), embedded shader inspected.

**Distinct mechanism:** multi-direction wave interference gives quasicrystalline order; a `dissolve` factor evolves from an oscillator; **block-quantized positions, RGB separation, threshold palette regions and timed scan-head tears** degrade its order into glitch. Not just a static fivefold diffraction image.

**Glitchbitch opportunity:** a **structure-injury continuum** controlling *whether* a filament, woven field or tile lattice remains coherent before melting into granular signal. Could become a more interesting motion mode than simply changing color or adding random noise. Existing fivefold optics make naive cloning a duplicate; prioritize actual **ordered↔broken phase transitions**.

**Implementation cautions:** make the transition reversible and deterministic for Boomerang; the original shader changes some components with continuous clock. Ensure randomizer and both 15/30 fps exports inherit all controls.

### 5. HYPERBOLIC CROCHET / 3D SELF-INVERTING LACE — exotic, expensive

**Exact source:** [by_math/11_hyperbolic_non_euclidean_higher_dimensions/fractal_crochet.js](https://github.com/merrypranxter/shaderslop_designs/blob/main/by_math/11_hyperbolic_non_euclidean_higher_dimensions/fractal_crochet.js).

**Distinct mechanism:** hyperbolic radial ruffling, iterative inverted-coordinate **3D lace fractal / IFS**, yarn-scale noise and SDF surface raymarching. It suggests scalloped organza, ruffled shell-like fabric, impossible crochet and rich silhouette geometry beyond the flat 2D weave.

**Glitchbitch opportunity:** a new thread geometry or deep background species to introduce *actual folded depth* under existing surface dressings and optical materials. The 3D image could also serve as a secondary layer so it doesn't displace the main artwork.

**Implementation cautions:** the reference shader uses a **150-step raymarch budget** and iterative field evaluation, so do not drop it directly into the already massive main fragment. Consider a capped/LOD renderer variant and explicit resolution/mobile limits; test fallback without silently dropping effects.

### 6. LENIA-STYLE VELVET DAMASK — tactile thread crossbreeding, not a literal full simulation

**Exact source:** [by_math/03_cellular_automata_lenia_sandpiles/lenia-velvet-damask.js](https://github.com/merrypranxter/shaderslop_designs/blob/main/by_math/03_cellular_automata_lenia_sandpiles/lenia-velvet-damask.js).

**Distinct mechanism:** reflected wallpaper-group folding (p4m), moving Gaussian cellular rings, directional **velvet pile / nap pseudo-normal shading**, and mouse-driven local growth brightness. The source itself describes a **fake continuous Lenia** built from Gaussian growth rings; it is **not** proof of a true persistent, neighbor-coupled Lenia CA simulator.

**Glitchbitch opportunity:** *material dressing* driven by directional micro-velvet orientation on filament or larger textiles, while reusing the current ecosystem's real feedback/growth systems where available. Make the velvet's sheen a function of orientation and motion rather than a blanket fuzzy blur.

**Implementation cautions:** avoid double-counting existing filament fur and thread anisotropic gloss. Focus on nap orientation and localized interactive change.

## Proposed build sequence

**Pass II — Grounded prototype wave:** start with **Hexagram Terraces** as a new mathematical surface/relief layer with 6-bit region borders and palette-aware illumination. Test visually in the live canvas, PNG, GIF and MP4, including randomization and iPhone sizing. This is a genuinely different structural generator.

**Pass III — Color/light behaving like matter:** extend the source's SDF **Schlieren Glass**, but only after comparing with `src/structural-thread-optics.js` and confirming the renderer has a safely sampleable color pass. Show refraction of actual artwork pixels, not just color grading.

**Pass IV — Structure morphing:** bring in **Complex Poles & Zeros** as a non-destructive coordinate transform, and an **Order↔Dissolution** control for quasicrystal/filament systems. Include Surprise Me/strong randomization integration, unchanged palettes and export parity.

**Pass V — expensive/new species:** evaluate low-cost Hyperbolic Crochet and tactile Velvet Damask overlays. Preserve 2D/3D framing and no extra hidden huge FBOs on iOS.

Do not import entire standalone Three.js HTML programs or inject dynamic `new Function` code into the app. Extract and adapt only the mathematical behaviors, preserve the existing app's state/effects/export architecture, and isolate numerically risky GLSL behind opt-in settings. **Do not deploy Netlify as part of shader triage.**

## What remains from the previous export wave

No unfinished merge blocks shader archaeology. The new loop/boomerang PRs were merged into main and source-level tests ran, but **full Vite build, real iPhone Safari encoding, and exact decoded-file comparison** were not run in this assessment. If any new shader changes the export appearance, validate the same recipe as PNG/GIF/MP4 at the same clock before merging.

**Scope note:** This pass read the archive's README/catalog plus a handpicked subset of actual shader sources and compared them with Glitchbitch's current UI-index and core optics/material modules. It did **not** visually play or line-by-line audit all 427 shaders. Follow-up passes should use the archive's category galleries and exact source links for specific novel math not yet listed here.
