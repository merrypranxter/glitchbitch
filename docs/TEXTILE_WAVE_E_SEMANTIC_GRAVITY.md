# GLITCHBITCH — Textile Six · Wave E: Semantic Gravity

**Working branch:** feature/semantic-gravity-wave-e  
**Stacked on:** Retrocausal Embroidery (PR #69) → Structural Color Optics (#68) → Quasicrystal Brocade (#67) → Feral Jacquard / Chladni (#66).  
**Separate unrelated draft:** Color Mathematics Lab (#65).  
**Deployment/merge:** No Netlify deployment; main unchanged. This work is opt-in and stays draft for device QA.

## What this actually is

Author-entered lettering becomes an **alpha-mask potential field** that can attract, repel, orbit, shear, and exclude **real filament geometry**. The text itself is not erased or rewritten. This is **glyph-shaped gravity**, **not natural-language understanding** of the words.

The feature is based on the **same `paintLettering` Canvas2D function** as PNG/GIF/MP4 exports, not hand-waved circles or guessed glyph bounding boxes. It accommodates the main text plus two extra text layers, chosen fonts, layouts, rotation, rich formatting, animation and the text compositor's material effects. A visible word is required. **No text entered, no gravity.** The app's Surprise feature never generates a word for the user.

The text painter draws at the exact current renderer timeline into one reusable transparent **512-long-edge** offscreen canvas, maintaining the artwork aspect ratio. A single alpha RGBA texture is uploaded to **WebGL texture unit 6**, with vertical flip to match gl_FragCoord / UV conventions. The shader samples the center and eight neighbors to approximate the gradient and soft potential around painted letter shapes. It is bounded, local and mobile-oriented, without CPU readback or image-to-image frame history. It does **not** compute an exact signed-distance field; its reach and quality depend on the mask resolution and selected radius.

The gravity calculation is integrated **inside filamentField** before its species geometry, materials, self-weaving and hybrid shading:
- It modifies the actual yarn coordinate `q` with an inverse sampling warp for correct apparent attraction direction.
- In **Letter-shaped void**, it also subtracts the glyph alpha from the actual fiber `mask` before stitch core/halo/edge creation.
- Both parent geometries can react separately to the same words using their local phase offsets; it does not destroy different A/B material dressing, structural optics, Quasicrystal, Feral, Chladni, or Retrocausal stitches.
- It is not an unrelated full-screen glow or a type sticker.

## Modes — 7 opt-in forces + Off

1. Glyph attraction — letters pull actual fibers toward glyph silhouettes
2. Letter repulsion — letters push yarn apart, leaving textile clearings
3. Orbital script — tangent flow circles around glyph boundaries
4. Typographic vortex — rotated, oscillating attraction fields
5. Letter-shaped void — cuts letter-shaped gaps in the yarn while keeping visible text
6. Rhizome lettering — root-like perturbations following letter edges
7. Script shear — the glyph force moves thread axes sideways

### Six independent 0–100 controls

`semanticGravityAmount`, `semanticGravityRadius`, `semanticGravityFalloff`, `semanticGravitySwirl`, `semanticGravityPulse`, `semanticGravityVariation`.

### Seven ready-made force prescriptions

- Gravity — Victorian letter magnet
- Gravity — Repulsion typography
- Gravity — Orbital cursive
- Gravity — Vortex manifesto
- Gravity — Cut out the words
- Gravity — Root script
- Gravity — Typewriter fabric shear

The **Effects → Filament Forge → SEMANTIC GRAVITY** foldout includes mode selector, all six controls, a preset dropdown, **Shuffle text gravity**, **Feral linguistic gravity**, and **Release the words**. These actions are undoable through the existing `history.change` and preserve authored text, palette, two-parent material choices, optics, and existing stitch law. The **Text tab** remains the only place to author the lettering.

## Data & safety

- `src/semantic-gravity.js` defines pure modes, preset/shuffle helpers, a strict no-visible-text activation predicate, and a bounded GLSL alpha-gradient module.
- `src/data.js` adds validated mode + numeric ranges, defaulting to **Off/0** for old artwork; Mutate touches controls only while both text and gravity are active. Full Surprise clears user words as before and now explicitly sets gravity Off/0, avoiding a dormant surprise effect that reawakens later.
- `src/filament-forge.js` changes real fiber coordinates only under `#ifdef FILAMENT_SEMANTIC_GRAVITY`; old geometry shader code and all 24 species / 33 stitch indices remain unchanged.
- `src/renderer.js` allocates and uploads the letter alpha texture *only when visible authored text and a positive non-Off gravity setting coexist*. Shader compilation, cache key and uniform wiring reflect that on/off state. Existing exported PNG/GIF/MP4 `createRenderer` calls use this identical module and `paintLettering` at the matching timeline. **No export-only approximation or silent effect removal is allowed** in exactEffects. Texture errors throw parity errors. The live preview can disable the optional effect after a logged shader failure while preserving older artwork; exact exports fail clearly instead of lying.
- `src/ui-index.js` makes the feature searchable and resettable.
- `tests/semantic-gravity-wave-e.test.mjs` covers 7 modes/presets, validation, old saved art, no hidden text, extra text layers, safe shuffles/mutations, true geometry displacement, source alignment and the strict-export contract.

## Verification and remaining limitations

**Verified structurally in the connected repository:** New semantic module executes via JavaScript/V8 smoke evaluation; all seven modes, seven presets and six controls are present; the 24 existing filament geometries and 33 stitch laws retain indices; GLSL brace balance and combined Feral/Quasicrystal + Retrocausal source specialization passes; the alpha texture pipeline references the same export compositor; controls exist in state, renderer, UI and Find/Reset.

**Not yet proven:** A full `npm test` / Vite build, live iOS Safari WebGL fragment shader compile, canvas font readiness, CPU/GPU performance, and pixelwise **preview vs PNG/GIF/MP4** comparisons at identical timestamps. Local code-mode parsing of the full renderer was inconclusive because the same simplified non-module parser also fails on untouched main. Do not confuse source inspection with certified device QA.

**Text parity caveat:** Semantic Gravity uses `paintLettering` to position the glyph force mask. This prevents a separate invented layout inside the fiber shader, but it does not itself cure any independent differences between the DOM/CSS preview text overlay and Canvas2D exported text styles. The gravitational *geometry* uses one code path in both preview and exact export. Full letter overlay appearance parity needs its own matching-frame verification.

**Performance:** Optional, single 512-edge mask canvas and one texture upload per active frame. A single hybrid may perform up to 9 alpha taps per parent per fragment. Test iPhone Safari quality/performance and use moderate force radius first. No new GPU context, no additional FBO, no new server, no network requests.

## Safari acceptance checklist — BEFORE merging or pulling to production

1. Preserve current main artwork. Test the stacked feature branch in a separate workspace.
2. Confirm old saved art with no visible words renders identically. Set mode with invisible words: no dormant unexpected force.
3. Enter short/long authored words in Text tab; test two extra layers, real chosen fonts, rotation, tracking and animated paths. Turn on the seven force laws and move each of six sliders.
4. Compare attraction vs repulsion direction. Check real letter silhouettes are affecting thread geometry—not just lighting or palette. Confirm letter-cutout masks actual fibers.
5. Use two hybrid parents with different materials, structural-color optics, both Quasicrystal and Feral geometry, Chladni/Retrocausal stitches. Confirm each reacts independently and old recipes preserve colors.
6. Run every preset, targeted shuffles, undo, save/load and Mutate; verify original words and typography remain authored.
7. Export matched timestamps as strict PNG, 2-second GIF and MP4. Compare physical fiber geometry and separately compare final lettering appearance; inspect the actual files for missing effects, especially at high-res 1:1 and 9:16. Do not claim parity until observed.
8. On shader/texture errors, retain exact logs and refuse misleading full-effect exports rather than silently dropping glyph gravity.

**Remaining:** The six originally selected textile additions are now implemented across Waves A–E as unmerged staged drafts (two in Wave A, one each B–E). The next phase is integration QA and cautious stacked-PR merge review, not additional blind feature stacking.
