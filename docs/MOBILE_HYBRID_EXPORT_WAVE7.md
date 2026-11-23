# Shader Vault Wave 7 — Mobile Performance & Export Fidelity Surgery

Status: targeted source fixes, without altering recipes, colors, text, encoder selection, GIF/MP4 dimensions, canvas pinning, or export output format.

## Audit findings and fixes

### 1. Duplicate full-resolution video frame allocation (fixed)

Previously, the shared GIF/MP4 frame workspace allocated an ImageData RGBA array plus a second, full-sized Uint8Array just for WebGL readPixels. It copied every bottom-up GL row to top-down ImageData every single frame.

Now src/frame-buffer-memory.js creates a Uint8Array view on the already-existing ImageData pixel buffer (including any byteOffset) and reverses the image vertically **in place**, using one reusable scanline scratch allocation. readPixels still receives the correct Uint8Array type. ctx.putImageData receives exactly the same top-down RGBA bytes; text compositing, first-frame loop anchors, boomerang caches, palette quantization, the CanvasSource H.264 encoder and the native recorder keep their existing logic.

The replaced duplicate allocation was 10,506,240 bytes (~10.02 MiB) for 1216×2160 and 18,662,400 bytes (~17.80 MiB) for 2160×2160. The new row scratch is only width×4 bytes. This reduces JavaScript peak capture memory, not total GPU texture or encoder memory. It does not promise that 4K recording will work on every iPhone.

### 2. Crochet raymarch wasted early empty-space samples (fixed)

The crochet SDF is an intersection of a thin fabric slab and a fractal lace network. Before Wave 7, each ray started at the camera and spent several of its fixed 8–20 samples walking toward the surface.

The raw z coordinate at a visible hit must fall within ±0.196 because the model has at most 0.112 wave deflection + 0.075 slab half-thickness + 0.007 hit threshold + 0.002 yarn perturbation. A conservative ±0.20 z interval can therefore be used to enter the relevant volume directly. Rays still evaluate the original SDF, normal calculations and all five crochet modes, with the same bounded maximum of 20 steps and three inversion folds; only provably empty camera-space segments are skipped. A far limit also stops marching when the ray has passed beyond that slab.

This is a GPU cost/quality improvement, not a reduced-resolution export or removal of any material.

### 3. Preview-only GPU fallbacks were silent (fixed for the seven archaeology effects)

The renderer already allowed live preview to disable optional expensive effects on WebGL shader compilation failures. Exact-effect export correctly throws rather than changing the artwork, but the artist was not told the preview was already simplified.

Wave 7 exposes a read-only fallbackNotice(state) from the renderer, naming currently requested missing effects (Crossbreed Lab, Hyperbolic Crochet, Living Velvet, Quasicrystal, Poles, Hexagram and Schlieren; plus Color Sorcery and Print/Spectrum Injury). ArtCanvas shows a compact non-interactive warning on the canvas when the preview is simplified, without stealing iPhone touch gestures or changing the recipe. The warning updates only when the missing-effect list changes. When the selected effect is turned off or the renderer is reset, the notice clears.

This does not try to silently simplify an exact MP4/GIF. The existing strict export error is intentionally preserved.

## User workflow

For the most intense new offspring, start with a two-parent Crossbreed and moderate Crochet Quality, then try the Five-Way Chimera. If the warning appears, don't assume the live picture matches an exact export: simplify the requested layers or try the same recipe on a stronger GPU. Your original artwork and saved recipe remain intact.

The app's existing built-in real encoded-frame vs PNG diagnostic is still the appropriate way to check actual decoded MP4/GIF fidelity. This patch cannot assert finished export parity without a real browser, codec and mobile hardware.

## Regression coverage

tests/mobile-hybrid-export-wave7.test.mjs checks:
- exact shared Uint8Array ↔ Uint8ClampedArray backing-store behavior, including offsets
- byte-perfect vertical reversal on odd and even portrait and landscape frames; double flip identity and repeated frame reuse
- bounded scanline allocation; unchanged GIF, MP4, closure and boomerang integration points
- mathematically conservative crochet slab clipping and unchanged inversion/raymarch/velvet GLSL
- visible preview fallback diagnostics and fail-loud exact effect export

The six tests have been added to the repository, and the byte reversal was directly evaluated against a reference for multiple frame shapes in the GitHub edit session. Full npm test, Vite build, iPhone/WebGL device profiling and actual encoded pixel comparison still require the runnable app.

No Netlify deployment, GitHub Actions workflows, dependency changes or new render targets were introduced.
