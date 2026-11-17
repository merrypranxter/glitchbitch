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
