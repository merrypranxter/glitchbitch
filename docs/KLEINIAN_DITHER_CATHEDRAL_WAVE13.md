# Wave 13 — Kleinian Dither Cathedral

## Origin

Adapted from the original [`klein-dither.js`](https://github.com/merrypranxter/shaderslop_designs/blob/main/by_math/16_dithering_halftone_print/klein-dither.js) in the owner's `shaderslop_designs` vault, category **16 · Dithering, halftone & print**.

The source combines three interesting mathematical systems:

1. Complex-number Möbius transformations to bend the field.
2. Schottky-style iterative circle inversions with visible depth / boundary loci.
3. A 4×4 Bayer ordered-dither matrix, RGB channel-separated with different spatial offsets and stacked parallax depth planes.

The standalone archive sketch runs Three.js/WebGL2, eight planes, up to 12 iterations × four candidate circles **per layer, per color**, and its own independent canvas/palette. That would add extraordinary shader load to Glitchbitch on iPhone.

## Adaptation

**Wave 13 uses a single opt-in shader module** within Glitchbitch's **existing shared preview and exact-export renderer**, with **a maximum of three planes × seven bounded circle inversions per plane**. It computes separate RGB Bayer thresholds, and uses the user's *live palette* and color clock rather than forcing a fixed neon RGB gradient. It bends the print field with existing scene geometry and deterministic seed/time.

No new render targets, FBOs, texture sampling, codec changes, canvas layers, dependencies, Netlify, GitHub Actions or rendering APIs. Pixel-aligned Bayer print can look different at different physical output resolutions by its very nature; we preserve the **same equations and scene time** across preview and exact export rather than pretending a 390px display contains the same individual pixels as a 2160px video.

Five **Kleinian Dither Cathedral** species:

- **Schottky Lace Press** — refined orbit boundaries in ordered printable ink.
- **Kleinian Stained Glass** — luminous colored depth contours and dark fracture lines.
- **Cantor Confetti** — finely fragmented inversion depth, speckles and floating islands.
- **Möbius Film Strips** — twisting spectral bands on separate parallax planes.
- **Parallax Dither Cathedral** — high-contrast, RGB-split architectural inversion print.

Six instant recipes: Electric Lace Inversion, Wormhole Stained Glass, Cantor Disco Dust, Möbius Neon Matinee, Cathedral of Broken Pixels, Gentle Print Ghost.

Thirteen full-range adjustable fields:

- Presence, inversion scale, plane count, circle inversion radius, orbit spin/speed, depth parallax.
- Bayer print density, RGB chromatic offset, palette hue, print ink coverage, glowing boundary intensity, geometry warp, variation.

## Interaction

Find under **Effects → Signal → Kleinian Dither Cathedral** in Codex's new Effects Control Room. It is fully indexed for **Find**, **Favorites**, **Active Effects** and section **Reset**. Select a mode, apply a recipe, or use targeted **Shuffle inversion printing** / **Hide Klein Dither**. Controls use progressive disclosure: mode, recipe and presence always show; the 12 advanced sliders appear when the effect is active.

`kdAmount=0` and `kdMode="Schottky Lace Press"` in the canonical starter and in older recipes. The shader isn't compiled or executed while the effect is disabled; all previous artwork should be unchanged. `Surprise Me` can activate and randomize this new family; `Mutate` does not wake it accidentally.

Existing title, letter styling, material species, palette stops, brushes, saved works, exact export features and the confirmed NEW CANVAS button remain untouched. The new material can be paired with Velvet Damask, Prismatic Scale Matrix or Subpixel Moiré.

## Failure policy

- Fast preview: if the GPU cannot compile this optional shader, disable only it and show an explicit **Kleinian Dither Cathedral** fallback notice, preserving earlier art.
- Exact PNG/GIF/MP4 export: compile failures raise an artwork-parity error; **never silently omit** the effect.
- The shader has two bounded for-loops (up to 3 × 7), no framebuffer and no image history. This improves performance predictability but is **not** a substitute for actual Safari GPU tests.

## Verification

- Eight Node regression tests in `tests/kleinian-dither-wave13.test.mjs`.
- Two Playwright browser scenarios in `tests/e2e/kleinian-dither-wave13.spec.js` verifying the new Effect Control Room, mode/preset/Undo/Hide, and confirmed NEW CANVAS.
- Source-level validation and direct JS helper tests can be run via the GitHub connector. Full Vite build, actual iPhone Safari WebGL compile and encoded GIF/MP4 vs preview optical parity must still be tested with a checked-out repo on a real browser; they are **not certified** by source-only tests.
