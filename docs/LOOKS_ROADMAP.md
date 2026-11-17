# GLITCHBITCH — visual expansion roadmap

Source vault: https://github.com/merrypranxter/shaderslop_designs/tree/main/myspace_glitch

## Design rules
- Preserve every existing engine, palette, recipe, gesture, undo path, export option, and saved-work format.
- New looks are editable starting states, not baked JPEG backgrounds or independent mini-apps.
- Old recipes default to zero for the new appearance settings; their original visuals must remain unchanged.
- Controls must work on iPhone, stay compact in the Effects panel, and save in recipe JSON.
- All effects appear in independent full-resolution render and encoded video output.
- Do not use Netlify, external APIs, remote rendering, or new paid services.
- Keep all old files' licensing/attribution intact.

## Phase A — first shipped checkpoint
Independent image treatments: CRT RGB shadow-mask phosphors, Bayer ordered dithering, angled CMY halftone printing, ink misregistration, synthetic error-window cascades, animated sparkle/blink fields, and damaged broadcast color bars. 12 additional editable looks, bringing the lookbook to 18.

Sources:
- `02-vhs-crt-subpixels/rgb_subpixels.js`, `subpixel-moire.js`
- `04-pixel-dither-halftone/git-art.js`, `rainblow-ditherscape.js`
- `01-myspace-geocities-webcore/myspace-glitch.js`, `glitchscape.js`
- `02-vhs-crt-subpixels/vhs_glitch.js`

These are new self-contained implementations influenced by the source mechanisms; not code pasted from self-initializing Three.js sketches.

## Phase B — stateful feedback
Add optional ping-pong textures and a separate feedback render path supporting genuine previous-frame datamosh, motion advection, phosphor persistence, dropout memories, and contaminated chroma. Input: existing analytic art + history texture. Critical: deterministic exact-frame replay for export, frame resolution limits, and resetting state on seed/recipe changes. Fallback to the current stateless renderer on WebGL1 / unavailable formats.

Sources: `03-datamosh-corruption/chroma_codec_shrine_20260618_192031.js`, `02-vhs-crt-subpixels/phosphor_reef_engine_20260620_151508.js`, `06-glitch-math-hybrids/prismatic_tape_oracle_20260625_161140.js`.

## Phase C — genuine new art engines
- Hyperbolic CRT: complex Möbius / Poincaré tessellation (`06-glitch-math-hybrids/hyperbolic-led.js`).
- Complex escape-time portals: Mandelbrot and Julia orbit traps (`03-datamosh-corruption/mandelbrot-candy-glitch.js`).
- Aperiodic diffraction: fivefold quasicrystal moiré (`06-glitch-math-hybrids/git-flow.js`).
- Biological codec infection: actual evolving Gray-Scott / Lenia-like textures (`02-vhs-crt-subpixels/vhs-coral.js`, `03-datamosh-corruption/neon_media_rot.js`).
- 3D stereoscopic ghosts with device-adaptive ray budgets (`05-retro-patterns-and-uncanny-ui/neon-wiggle-stereo_20260622_182025.js`).

## Phase D — full mixing studio
Separate controls for Structure / Material / Damage / Ornaments / Motion, with per-layer opacity, independent seed/timing and meaningful independent toggles. Procedural typography overlay uses editable text rather than fake glyph rectangles. Add lookbook filtering, source provenance, favorites and Surprise Me category weighting. Do not split user artwork into unrelated mini-apps.

## QA gates
- Run `npm test` and `npm run build` in AI Studio / local Node 20+; actual iPhone Safari WebGL2 compile and frame-rate checks are still required.
- Manually verify legacy recipe import, new recipe save/reimport, undo, palette change, touch interaction, PNG/video export, and fullscreen.
- With all new sliders at 0, output must be identical to the pre-expansion renderer.
- UI must not blank on a shader compilation error. Test fallback and recovery before merging any future stateful engine.

## Wave 2 — first stateful implementation
The optional previous-frame framebuffer renderer is now available under Effects / Frame Memory. Afterimage, Temporal Datamosh, Memory Drift and Memory Decay are recipe fields (0..100). Old recipes have memory off. The preview uses bounded GPU textures, and video export advances actual feedback from frame to frame. Still-image export uses five deterministic pre-roll frames. A device unable to allocate the memory framebuffer falls back to the original art path. High resolution + feedback increases GPU memory pressure; verify actual iPhone Safari performance at the selected export resolution. This is the first feedback engine, not yet the full biological simulation system.


## Phase C checkpoint 1 — mathematical species and living motion
Three shader-native scalar fields have been added as engines 12–14, with edit-ready controls and separate references to the originals: `06-glitch-math-hybrids/hyperbolic-led.js`, `03-datamosh-corruption/mandelbrot-candy-glitch.js`, and `06-glitch-math-hybrids/git-flow.js`. These are implementations of the underlying mathematical principles, not copies of Three.js sketch wrappers.
User feedback: surprise-generated art often appeared motionless. The new Ambient Motion feature introduces five smooth coordinate-motion styles, amplitude and pace controls, plus a second shader clock for living-light interference. Surprise Me always selects perceptible motion and shimmer. Existing recipes preserve their visuals with both controls disabled by default. The 37-look gallery includes nine math-species looks and six movement-first looks. Visual QA and iPhone WebGL2 compilation still need device verification.

## Phase C checkpoint 2 — true reaction-diffusion infection
Implement Gray–Scott U/V chemistry (96² cells; seeded spores, wrapped Laplacian, chemical feed/kill, frame-bounded growth) as an optional live organism texture. Source reference: `02-vhs-crt-subpixels/vhs-coral.js`; the other vault reference `03-datamosh-corruption/neon_media_rot.js` uses Lenia and remains a **different future simulator**. `Chromatic infection` is engine 15; the same live chemical field can also overlay any other engine with the Biology effect. Six animated editable designs bring the Lookbook to 43. No extra services and no Netlify. Preview/video are forward-stateful, deterministic by seed and sequence; seeking does not guarantee exact full-time reconstruction.


## Phase C checkpoint 3 — stereoscopic ghosts
Based on the actual mechanisms in `myspace_glitch/05-retro-patterns-and-uncanny-ui/neon-wiggle-stereo_20260622_182025.js` (moving camera, SDF raymarching, chromadepth), add engine 16 as a GPU-bounded 3D spatial scene. Five selectable SDF families; proper normals, depth-aware pigment, iridescence, camera wiggle and animated lighting. Separate module injection means standard 2D shaders do not pay the raymarching cost when the 3D overlay is disabled. A 2D engine may also be overlaid with independent 3D depth, mixed through normal palette/effect/export pipeline. Added six lookbook presets (49 total) and all new parameters to Surprise Me, Mutate, validation, undo and recipe serialization. Notes: camera stereo is an animated alternating-eye *wiggle*, not dual-eye VR or hidden-depth autostereograms; high detail may slow iPhone. Verify real Safari GPU compile before relying on maximum settings.


## Wave 4A — material/type crossbreeding checkpoint
Source-derived mechanics: `myspace_glitch/06-glitch-math-hybrids/prismatic_tape_oracle_20260625_161140.js` thin-film / pigment modulation and `myspace_glitch/01-myspace-geocities-webcore/urcute_texture.js` editable Canvas2D glyph texture compositing; see also `derek_sux_texture.js` for animated optical phase. Standalone originals required their own Three.js runtime. Instead, the mechanisms are implemented as opt-in extensions to GLITCHBITCH's existing full-screen shader.
Material family: thin film, film thickness, opalescence, prism shift, optical relief and material clock. Type family: editable text, four styles, opacity, scale, warp and independent speed response. All are saved in recipes and Undo, exported through the existing renderer, and randomized by Surprise Me; eight distinct lookbook presets (57 total). Old artwork retains its previous output when effects are zero. Safari compilation, font rasterization and mobile export performance need actual-device verification.


## Wave 4B — spatial composition checkpoint
Implemented a real spatial secondary-field compositor with independently animated 2D masks and a color-phase-offset second mathematical engine. Six mask families, six numeric controls, compatibility with existing blend modes, modular shader injection, full Surprise Me / Mutate integration, ten lookbook recipes (67 total), and backwards-compatible recipes. The old compositor is unmodified with compositionAmount=0, and standard single-field renders have zero additional compile code. Unlike shape warping, this shifts where distinct mathematical media are visible in a single frame. Source is `src/composition.js`. Test on Safari with high-cost 3D and browser MP4 encoding before claiming mobile GPU performance.


## Wave 4C — living underpainting and future-proof Surprise
The older fullscreen analytic engines can leave uninteresting negative space, even when mathematically animated. A new optional shader module `src/backdrops.js` fills low-activity regions with six distinctive moving palette-linked underpainting species. It has parallax depth, density, rate, glow, hue shift and independent seed variation, all saved in recipes and consumed by video exports. Old recipes use amount 0 and the shader is omitted from compilation; simulated fallback disables only the new module. The factory now instruments Surprise Me numeric assignments and fills in any untouched numericRanges values automatically. The nine new editable looks bring Lookbook to 76, and a test simulates adding a future numeric slider to enforce coverage. Verify on real iPhone Safari before claims of actual fps and H.264 viability.

## Wave 4D — microtexture and opt-in typography
The artist requested no automatic giant words in the canvas. All prior word-bearing starter looks were converted into materials, manual quotes extended to 280 characters with portrait-aware wrapping, and Surprise Me now sets text to empty with opacity 0. A separate optional animated shader module `src/microstructure.js` adds six fundamentally different small-scale spatial structures (threads, beads, caustics, point lace, filaments, cilia) and seven numeric controls. The new module is omitted when inactive and is wired to the standard shader's palette and clocks, recipe serialization, Mutate, Surprise Me, exports, and GPU fallback. Eight editable preset looks bring the collection to 84; test on actual iPhone before relying on maximum complexity.


## Wave 4E — seam-free polar tunnel geometry
The latest iPhone Tunnel Vision screenshot exposed a straight radial artifact. Source inspection confirmed a raw `atan(p.y,p.x)` term in engine 5; it jumps at ±π along negative X. The shared Phase Vortex color field also used `atan/TAU` directly; Fractal Melt and the 4.5-angle Orbital Archipelagos mask had related discontinuities. Replaced with integer-winding trigonometric harmonics and introduced six physically distinct tunnel shapes, controlled by six [0,100] properties and a mode dropdown in Math. The new full-screen shader module compiles only when tunnel is the primary or active secondary engine, with a safe no-op stub for all other shaders. Surprise Me changes all tunnel properties and the selected style; all 8 new wordless looks (92 total) use existing palette/existing export and save functionality. Validate on actual iPhone Safari to confirm the old visible line is gone at multiple positions and Phase Vortex colors stay seamless.
