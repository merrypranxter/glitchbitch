# Glitchbitch — Loop Surgery III: Quilt Reassembly, Clockwork Sweep & Crystal Bloom

## What was added

Three new artist-selectable endings in **Export → Video → Loop surgery**, designed to be as immediately understandable as Weft Zipper. Each is an **artistic closure**: it swaps the final animated composite back toward the saved first composite through a distinct changing-shaped mask. All three preserve every shader, material, optical effect and styled text, because the source is the exact **fully composited frame** from the original workspace.

| Mode | What the ending looks like | Character |
|---|---|---|
| Off | No alteration | Original video / GIF |
| Soft closure | Entire image gradually blends into frame one | Gentle and dreamy |
| Weft zipper | Alternate woven bands zip shut from opposing edges | Textiles, threading |
| Iris portal | A circular reveal expands out of the center | Optical portal |
| **Quilt Reassembly** | Small squares patch the opening image back together at different times | Patchwork, stitching, pixel mosaic |
| **Clockwork Sweep** | A spinning clock-hand wedge sweeps the original image into place | Mesmerizing, mechanical, hypno |
| **Crystal Bloom** | Small diamond-shaped openings bloom outward from the center in staggered rings | Crystalline, prismatic, alien |

The **Tail-to-opening blend** duration selector (0.25–2 seconds depending on clip length) applies to all these styles.

## Real implementation

The exporter already paints the complete animated shader, feedback, special lighting and Canvas2D lettering onto its capture canvas every frame, then optionally overlays the exact saved first-composite frame through a mask during the closing window. This wave adds:

- `quiltReassemblyTiles(width,height,mix)`: bounded deterministic grid (at most 12 × 16). Each tile reveals a center-out patch with a tile-dependent phase, creating a scrambling/stitching-together look. The full tile grid covers every pixel at 100%.
- `clockworkSweep(width,height,mix)`: center, corner-covering radius and eased rotating 0–2π sweep, clipped via a Canvas2D pie-slice path.
- `crystalBloomDiamonds(width,height,mix)`: bounded diamond lattice (at most 9 × 12) with outward radial delay and growing diamond paths made from `moveTo / lineTo / closePath`.
- `src/export.js` uses **one Canvas2D clip path and one `drawImage` of the first full composite** for each visible mask, with no extra WebGL context, no second clip encoding and no effects downgrade.
- At `closureMix >= 1`, the shared original Loop Surgery implementation skips all spatial masks and writes the **entire first frame** directly. The final pre-encode RGBA source pixels match the opening composite.
- All modes work through the existing GIF palette encoder and both existing H.264 MP4 paths (WebCodecs and native Safari recorder), using the full same capture canvas. This does not claim the *lossy decoded* GIF or MP4 bytes will match perfectly.
- Filenames identify the chosen mode: `-quiltloop`, `-clockloop` and `-crystalloop`; preexisting suffixes and Off behavior remain unchanged.
- **Boomerang** remains a separate mode that plays original finished frames forward/backward without another closing mask.

## Tests

`tests/quilt-clockwork-crystal-loop.test.mjs` verifies:

1. All three new mode selections share the existing bounded timing and guarantee 100% first-composite closure at their final source frame.
2. Quilt patch geometry starts empty, increases in staggered groups and at 100% fills the canvas **without gaps or overlap**.
3. Clockwork transitions cover 0°, 180° and 360°, with radius beyond all corners.
4. Crystal diamonds appear first at the center, expand outward and stay within a bounded path budget.
5. Invalid dimensions and nonfinite/out-of-range progress fail explicitly.
6. The real export code routes all modes through the same post-lettering composite and GIF/MP4 encoders.
7. The **actual production `createFrameWorkspace` function run with a clipping-aware simulated Canvas2D** renders different middle vs starting frames, selects the expected rectangular / radial / polygon path for each mode, and makes the last RGBA source frame byte-identical to the first, including an authored lettering pass.

The previous Soft Closure and Weft/Iris suites are preserved and updated to recognize the expanded mode list. Actual mobile Safari GPU/video rendering, Vite build, and encoded playback quality must still be verified on the user's device before being called production-tested.

## Recommended phone test

Pull latest `main` into Google AI Studio. Export a short 480px GIF with a vivid textile, optical fabric or moving lettering. Try each ending at 0.75 seconds and watch the last second: Quilt should reassemble in many little square patches, Clockwork should rotate a wedge around the center, Crystal should reveal a grid of growing diamonds. Compare with the older Weft Zipper. Then export a 480/720px MP4 and run **Loop Seam Scanner** to compare the actual end→start encoded frame jump.

The ending masks are intentionally visible transitions. They are not perfect solutions for every type of flow; the original artwork underneath continues evolving, so some borders, ghosting or texture velocity jumps may remain. If the look is too busy, switch back to Soft Closure or Off.

No Netlify deployment or GitHub Actions run was explicitly requested.
