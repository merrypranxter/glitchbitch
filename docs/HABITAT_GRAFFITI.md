# HABITAT GRAFFITI — Wave 4

A safe, deliberately bounded finger-painting system for the two-parent Mutant Atmospheres. **Plant living shader habitats directly on the artwork**, then drag, resize, reassign or erase each colony. It operates separately from the original deformation-force brush and preserves original artworks when not in use.

## Artist flow

Open **Effects → Scene → Mutant atmospheres → Living Habitats** and hit **Plant A on image** (pink handles) or **Plant B on image** (cyan handles). Or go to **Touch → Habitat Graffiti** and choose:

- **Plant A / Plant B:** tap or drag to plant a series of live habitat seeds; both parent presence and its Painted colonies mask automatically turn on. One undo action groups an entire continuous stroke.
- **Move Colony:** drag an on-canvas handle to relocate a seed without spawning another. Arrow keys nudge an accessible focused handle; + / - resize it.
- **Erase Colony:** touch individual colonies to erase them.
- **Selected colony:** choose from a list, reassign it between parents, adjust its stored radius independently.
- **Clear A seeds / Clear B seeds / Clear all seeds**; normal force brushes remain unchanged.
- **New colony size:** change the radius of stamps you plant *next* (existing radius is kept).

Up to **16 seeds per design**: a deliberate small-WebGL GPU budget. Additional finger strokes never silently discard old stamps. A second finger suspends painting until both fingers release; losing pointer capture, blurring the window, or cancelling safely returns to the last committed state.

## Three new fully editable Lookbook designs

- **Fungal Territory War:** six rival painted fungal and print-rossette habitats over moving cellular math
- **Phosphor Petri Sky:** five planted phosphor islands with a complementary nebula filling their negative space
- **Cathedral Colonization:** interleaved fungal and glowing gas chambers over stained-glass geometric fields

They appear in the new **Painted Habitats** family. **114 Lookbook starts** total. Every seed is editable in Touch; no baked images.

## Engineering invariants

- `habitatStamps: []` in all old recipes. Two masks remain `Everywhere`, both atmosphere presences stay opt-in. Old artwork and unpainted hybrid worlds use the identical original shader.
- Independently validated `habitatStamps` list of at most 16 objects, each with ID, normalized bottom-left x/y, radius in [.05,.45], and parent [0,1]. String IDs must be unique. `habitatBrushRadius` bounded [5,45]. All are stored in normal JSON/undo history.
- Original `src/gestures.js` TouchSession untouched. New `src/habitat-painter.js` handles only the four habitat tools. The live canvas chooses a session by tool, and preview-only seed handles never show up in encoded image/video output.
- Existing GLSL habitat masks remain the same; a sixth optional mode **Painted colonies** adds moving soft-edged SDF unions from the 16 seeds. B's **Inverse first** remains the complement of A's mask (enum index updated).
- One preallocated 64-float upload buffer; `habitatStamps[16]` is compiled **only** when an active atmosphere uses a non-Everywhere mask. No extra FBO, API, network, GPU readback, paid tool or Netlify credits.
- GL render and export use the same seeded, continuous-time formula. Old text compositor, fonts, palette vault, export codecs, mathematical engines and original force brush are untouched.
- GPU fallback from prior wave still disables habitat masking before disabling parent B or A when the device cannot compile these optional shaders.

## Verification / open QA

Source syntax, standalone gesture behavior, JSON/validation round-trips and the 114 Lookbook states checked with source harness. Regression tests added in `tests/habitat-graffiti.test.mjs`; the existing atmosphere-hybrids tests updated for the new enum. Actual iPhone Safari multi-touch visuals, WebGL shader compilation, Vite build, full `npm test` and GIF/MP4 device export still require local execution in Google AI Studio.

After pulling main, try a **Painted Habitats** Lookbook preset and drag A/B handles around. Test Undo/Redo and save/reopen, then GIF/MP4 to confirm the masks follow the same animation and colors.
