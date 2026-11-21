# Exact-Effects Export Hotfix

## User-visible failure: beautiful preview, stripped MP4
Source audit confirmed a direct cause: `createFrameWorkspace()` constructed a **new WebGL renderer**. Its normal progressive shader fallback silently disabled active layers (new Color Sorcery / Print & Spectrum Injury first, then food web, atmospheres, living fabrics, filaments, optics, substance, microtexture, background, material, even whole scene engines) when shader compilation failed. The frame was still encoded, so a downloadable MP4 could be **a substantially different artwork**. Biology simulation and frame-memory feedback had additional silent fallbacks. This is code-confirmed as a mechanism, not device-level proof of which particular shader failed in the artist's unprovided MP4s.

## Changes

1. `createRenderer(canvas,{exactEffects:true})` turns off every silent shader downgrade for export. Live preview keeps its non-fatal fallback for editing.
2. Both full-resolution PNG and the common GIF/MP4 frame workspace use this strict path. The Export Proof button also calls strict PNG. A failed shader compile, biological simulation, frame-memory allocation/composition, GL fence, WebGL context or pixel readback produces **ArtworkParityError** with actionable feedback. **No fake-success download**.
3. `recordClip` refuses to swallow an `ArtworkParityError` and retry as native H.264—codec fallbacks are for genuine encoder support issues, not for missing visual effects.
4. Both full PNG and GIF/MP4 frame streams use an identical short deterministic feedback pre-roll, reducing cold-start differences when afterimage/datamosh or Gray–Scott biology is enabled.
5. The tiny JPEG `thumbnail()` still opts into preview-friendly fallback; failure to compile at 240px should not block saving an artist's recipe. This does not relax downloadable output.
6. New regression file `tests/export-exact-effects.test.mjs` checks the critical source wiring and parity error contract. Existing `npm run verify` runs all tests and Vite production build.

## Limitations
- Static code checks and a coherent shader path **do not prove** that all shader combinations will compile on every iPhone. If they do not, the user now gets an error instead of a wrong MP4. If the error occurs, collect the GPU detail and try a smaller requested export size or optimize the culprit shader; do **not** silently remove it.
- Live feedback uses historical GPU frames accumulated across the editing session. An export renderer cannot reconstruct an arbitrary long unrecorded history exactly, even after deterministic short pre-roll. Exporting the current frame with very long afterimage memories can still differ in feedback history. A future upgrade could snapshot/restore preview feedback textures with memory limits.
- Native Safari MediaRecorder remains wall-clock and can produce timing jitter; this patch does not promise smooth 30fps under overload. High-quality WebCodecs H.264 remains preferable when available.
- PNG proof uses a distinct temporary renderer from preview (same effect equations and state), so the real device still needs visual confirmation.
- **Do not Netlify deploy as a way to run tests.** Run `npm run verify`, then test iPhone 1:1/9:16 PNG, 2s GIF, 2s and 6s MP4 for Color Sorcery + Print Injury + Underlay + Photon with shared timestamps.

## Artist workflow
Open a saved original recipe, select an MP4 size (start at 480 or 720), and click **See flattened export proof**. If that succeeds, make a 2-second MP4. An unsupported GPU combination now fails visibly rather than producing a stripped-down video. Save the recipe to preserve the configuration, independently of the current device's encoding limits.
