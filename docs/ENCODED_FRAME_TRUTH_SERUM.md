# GLITCHBITCH — Encoded Frame Truth Serum (Video QA Wave 1)

**New UI:** Export → Video → export a GIF or MP4 → **Inspect REAL GIF/MP4 frame vs PNG**.

## Why this exists

Previously Glitchbitch's "Export Truth Serum" measured actual PNG text blends against a third PNG reference, and code-level source checks confirmed that MP4/GIF used the intended renderers. That does **not** establish what survived the final video encoder. A real encoded file can legitimately have different colors from 2D/RGBA previews, and some failures are only visible when decoding it.

This module tests pixels from the **actual saved GIF/MP4 Blob** against a separate, fresh, strict-effects PNG reference rendered from the SAME recipe and same playback timestamp. It never substitutes a lookalike shader preview and never claims to inspect the entire exported video.

### Workflow

1. Export an MP4 or GIF normally. The exact output Blob, original state, timeline, frame rate, encoding method, original video dimensions and clip length are retained in the Export dialog while open.
2. Tap **Inspect REAL MP4 frame vs PNG** (or GIF). The live WebGL canvas is temporarily released, as in ordinary exports. Only exports up to **1080px** are eligible for this iPhone-safe diagnostic.
3. Decode the FIRST available frame from the actual exported file:
   - GIF or PNG: use `createImageBitmap` for a frozen first frame; fallback to `HTMLImageElement` with explicit uncertainty about animation timing.
   - MP4: load the actual H.264 Blob through an invisible, muted, plays-inline `HTMLVideoElement`. Use a first paused frame, or request the first available displayed frame via `requestVideoFrameCallback` (with a `loadeddata` fallback). Sample its actual media time. Browser-specific decoding failures are **reported**, never counted as correct results.
4. Use **the same `clockAt(state,timeline,seconds)`** function as the GIF/MP4 encoder. Re-render a **strict-effects PNG** at the decoded frame's media timestamp. Use the **exact encoded frame dimensions**, not the ordinary still-image dimensions: H.264 sometimes rounds a 9:16 width from 405 to 406.
5. Downsample the reference and decoded frame to a maximum 480px long edge (aspect preserved) *after* rendering both at their original dimensions. This bounds CPU pixel comparisons and allows high-res fidelity to remain in the GPU reference.
6. Show side-by-side:
   - Same-clock strict PNG
   - **Actually decoded GIF/MP4**
   - A 4× enhanced pixel-difference heatmap
7. Compute real sampled RGB mean absolute difference, maximum-channel mean, p95 peak channel error, percentage of sampled pixels exceeding 36/255 per-channel, and red/green/blue deltas.
8. Provide a text/palette-free JSON report with output dimensions, decoder, encoder method, sampled timestamp and measurements. No pixels or user wording leave the browser.

### What counts as a problem?

Low/moderate/high discrepancy labels are **descriptive** thresholds, not pass/fail certifications. A nonzero difference does NOT prove dropped shader effects. H.264 compression, chroma subsampling, GIF per-frame quantization, image color management and imperfect native recorder frame timing cause normal differences. Large regions of obvious missing materials in the heatmap are evidence worth investigating.

Especially if afterimage, datamosh or other feedback accumulators are enabled, one fresh strict PNG at a mid-video timestamp can have different prehistory from the encoded video. A first-frame comparison reduces but does not completely eliminate this limitation on native MP4 recorders.

**This check does NOT** compare the CSS/DOM live text overlay against the export, check all frames, certify loop seamlessness, detect all frozen-motion issues, prove every device color profile, or establish pixel-perfect preview/export parity. It is one valuable actual-decoder check with honest limitations.

### Engineering

- `src/encoded-frame-truth-serum.js`: browser decoders, direct pixel metrics, heatmap, privacy-safe diagnostic report, aggressive media URL/canvas cleanup, timeouts.
- `src/export.js`: exports existing deterministic `clockAt` and allows a diagnostic-only `outputSize` override for strict PNG capture. Default PNG, GIF, MP4, thumbnail and recipe behavior unchanged.
- `src/components/ExportDialog.jsx`: optional post-export frame check. Saves the existing encoded Blob; no second MP4/GIF encoding. Safely releases preview WebGL while sampling, supports a three-image comparison, avoids confusing the inspection with ordinary export progress, and revokes preview URLs.
- `tests/encoded-frame-truth-serum.test.mjs`: pure numeric tests for identical images, significant color differences, p95/thresholds, missing image data, heatmaps, privacy, aspect/codec dimension rounding, shared clock and exact output API.

### Manual verification needed BEFORE claiming it works on the user's device

1. Pull this feature from main. Export a short 480px GIF; tap Inspect. Confirm first frame, strict reference and heatmap display; typical palette-quantization noise is expected.
2. Export short 480px H.264 MP4. Tap Inspect. If Safari cannot decode the first video frame, capture the **exact error**; do not mark this as a success. Test with a strong material effect such as Soap-film opal plus retrocausal stitches.
3. Repeat with animated user lettering and Semantic Gravity, then with plain thread art.
4. Inspect a 9:16 MP4 at 720px; note H.264 even-dimension rounding and verify PNG uses the same target size.
5. Compare substantial differences visually, including the location of missing thread highlights and material colors. Compression-only noise generally distributes differently from entirely missing shader layers.
6. Repeat at 720/1080 on iPhone if memory allows. Verify 1440/2160 inspections explain the 1080px cap rather than crashing.
7. Ensure baseline PNG/GIF/MP4 exports, Save/Share and older text-blend Truth Serum still work unchanged.

**Verification achieved so far:** connected-repository source/V8 validation of the new module, direct numeric pixel-math tests, and source wiring; no installed build runner or iOS Safari GPU/video decoder is available to certify real media output here. GitHub source merge alone cannot prove hardware parity.

**Deployment:** no Netlify build/deploy requested. Merge changes into `main` to remain directly pullable by Google AI Studio.
