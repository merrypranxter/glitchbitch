# GLITCH BITCH — The Thread Wardrobe Wave
## Real looms, impossible stitches, and Dress the Threads

**Append only**: 16 → **22** filament geometries, 21 → **31** self-sewing modes, 6 → **14** selectable fiber materials. Each new element works with the old two-parent filament crossbreeder, palettes, text, sculpted relief, beads, Underlay, and the shared deterministic renderer.

### New warp and weave geometries
- **Basket twill**: alternating warp/weft centers with over-under luster rhythm.
- **Chevron herringbone**: reflected directional rails with living chevron highlights.
- **Macramé diamonds**: knot sockets and paired diamond networks.
- **Bobbin lace**: diagonal thread pairs meeting circular pinhole motifs.
- **Möbius cable**: spiral twisting partner cables with mobile crossing highlights.
- **Parasitic ladder**: crawling rails, rung interfaces, and traveling infestations.

These are new geometry branches in the filament's real line masks, not fullscreen overlays. Old indices 0–15 are unchanged; the six new ones use indices 16–21.

### Ten new self-sewing motions
Traditional: **Chain stitch**, **Cross-stitch**, **Satin fill**, **Blanket stitch**, **Feather stitch**, **Cable knit**.

Unconventional: **Ghost bobbin**, **Quantum unpick**, **Mutant zipper**, **Fractal mending**.

They modulate visible cores/halos/edges and traveling needle light **inside** whichever single or hybrid filament geometry is selected. Previous stitch IDs 0–20 are unchanged. Four sliders and all old stitching shuffles still apply.

### Eight new ways to Dress the Threads
Wearable and craft-derived: **Mercerized cotton**, **Metallic tinsel**, **Chenille plush**, **Pearl embroidery floss**.

Weird: **Fiber-optic rainbow**, **Gelatin nerve cord**, **Oil-slick latex**, **Bioluminescent mycelium**.

Each has its own strand-local appearance equations—luster direction, traveling color, pilosity, translucent interior, spectral coating or living pulse. No new textures, external APIs, parameters, or GPU passes. Both hybrid parents can wear different material choices. **Dress the Threads** gets eight new full material recipes and **Dress in weird shit**, a targeted randomizer for the four weird materials only. **Remix fibers** already samples all materials; all presets preserve the current shape, parent pairing, palette, hand-written text and background effects.

### UI and survival
- New quick shuffle **Shuffle fresh textile geometries** touches only the new six shapes + their filament structure controls.
- Existing **New stitch species**, **Shuffle stitch motions**, **Shuffle new weird stitches**, **Shuffle ritual stitches**, and **Start weaving** remain available.
- All new modes are in existing picker groups and Find a control index. Undo, recipe validation, and Surprise/Mutate draw from the expanded shared arrays.
- Geometry and stitch paths compile only for selected IDs, and new **fiber specialization** also prunes all unselected dressed-material GLSL, helping iPhone GPUs.
- All color, optics, text and stitch reveals still use the **same renderer** in preview, PNG, GIF and MP4. No independent animation loop or separate video-only fake effects were introduced.
- Old recipes remain valid and dormant until the user enables filament / self-weaving effects. Original materials / stitching formulas were not changed.

### Verification
JavaScript source was parsed and executed in a V8 isolate; 682 geometry × stitch compositions with two weird fibers were checked for correct branch isolation and balanced GLSL braces. Added comprehensive repo tests covering every 14×14 material pairing, 22×31 composition, saved recipe round trips, new preset preservation, findability and wiring. **Cannot certify real WebGL shader compilation, full npm suite, iPhone GPU behavior or exported MP4/GIF pixels without an actual app/browser runtime**. This feature branch deliberately does not deploy Netlify or modify the corrected video export pipeline.
