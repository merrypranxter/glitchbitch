# Glitchbitch — TRUE Boomerang Playback (frame-cache wave)

**Export → Video → Playback direction → Boomerang**

This is the next major animation option after Loop Surgery II (#77). Its purpose is to reverse the **actual fully rendered image frames**, not merely reverse shader time.

## Why this matters

Some Glitchbitch effects are stateful: retrocausal stitches, feedback/afterimages, filament systems and compositor effects can depend on their previous frames. Simply calling the same shader with decreasing time is not pixel-reversible and often produces different textures or materials on the backwards leg.

This mode caches the exact **finished RGBA frames** from the first half of the exported animation. These frames already contain the complete GPU shader artwork and **all Canvas2D lettering**. The exporter then restores those very same source pixels into the shared capture canvas in reverse order, with no new WebGL draw for the reverse half.

- **H.264 MP4 via WebCodecs** uses the existing `CanvasSource` and adds source pixels at the same monotonic fixed-rate *output* timestamps. Only the image content reverses.
- **Native Safari MP4 via MediaRecorder** uses the same restored canvas and `requestFrame` while keeping the existing wall-clock pacing. Native recording may vary timing or drop/duplicate frames; the feature guarantees the **source image sequence**, not the resulting native H.264 decoded stream.
- **GIF** uses the same existing palette quantizer on the cached post-lettering RGBA pixels, not a fake shader preview.
- **Forward** remains the default and preserves the old time path, recorder behavior, PNG export, recipes, text styling and Loop Surgery.

## The exact frame sequence

For a ten-frame clip the saved **source image** ordering is:

`0 → 1 → 2 → 3 → 4 → 5 → 4 → 3 → 2 → 1 → (0 on the next loop)`

The boomerang is forward and then backward, with no duplicated opening frame at the wrap. The last frame and first frame are **adjacent images** from the same originally rendered forward sequence. The wrap thus has one normal forward movement step, rather than a snap from the far end.

For an odd frame count, the peak has a one-frame hold (`0,1,2,3,4,4,3,2,1` for nine). GIF exports at 15 fps with 3s or 5s may have this slight pause. The full selected clip length includes both directions: a 6-second Boomerang has about 3 seconds of forward source-time movement and 3 seconds in reverse. The reversed images are *not* newly recomputed through altered time.

## Mobile RAM budget

Exact source-frame reversal requires keeping a copy of each forward source frame until its backward playback. This is an artist-quality choice, but full-resolution pixel arrays get big on iPhone.

- Strict raw cache cap: **128 MiB**, calculated as roughly `(frames / 2) × width × height × 4` before the exporter allocates a WebGL workspace.
- The Video tab displays the estimate in **MiB** and prevents Boomerang export if the cap would be exceeded. Lower duration, longest edge or fps; **Forward** remains available at all original resolutions.
- The reverse cache releases each frame after use, and the whole cache is cleared in `finally` after success, cancellation or error.
- Only the cached source images consume extra memory; there is **no new WebGL renderer**, duplicated shaders, frame-sequence JPEG compression or WebP output.
- Native MP4 encoding and the browser may use additional memory beyond the explicit RGBA cache budget. A device can still run out of memory under unusually demanding conditions. Start with a **480px short clip**, then try 720px.

Examples at 30 fps: 6s at 720×406 uses roughly 100 MiB of cache and fits; a 6s 1080p sequence exceeds the limit. The limit is a protective preflight, not proof that every supported phone can handle the permitted clip.

## Interaction with existing Loop Surgery

The new **Playback direction** selector is **Forward** or **Boomerang**. Boomerang uses the natural backwards-image seam, so Loop Surgery's separate Soft / Weft / Iris closure effects are offered only in **Forward** mode. Choosing Boomerang switches Loop Surgery to Off automatically. Both cannot be active at once; a direct API call combining them rejects the request instead of silently dropping an effect. Switch back to Forward to use any artistic Loop Surgery mode.

Completed Boomerang files use the distinct `-boomerang.mp4` or `-boomerang.gif` suffix.

## Diagnostics

The saved frame-integrity and three-checkpoint Full-Clip Motion Forensics comparisons now map the encoded time to the appropriate original **mirrored source index** for Boomerang, while keeping the older Forward reference timing unchanged. This avoids blaming the expected reversed motion as an incorrect output. Fresh strict PNG references still won't precisely reconstruct accumulated GPU feedback from the original forward history. That limitation is disclosed in the Video tab. The seven-frame Loop Seam Scanner remains the best way to inspect the **actual decoded output** end→start.

## Test evidence and important caveats

Source/V8 regression coverage includes even/odd frame sequences, 128 MiB preflight, source-frame retention despite a stateful fake renderer, legacy Forward timing, a real GIF roundtrip through Glitchbitch's bundled GIF encoder and decoder, and an execution of the **production capture workspace against a simulated Canvas2D with authored lettering** proving reverse images match the exact forward composite and that neither shaders nor text are repainted backward.

The architecture is a **real source-frame Boomerang**. MP4 H.264 compression, GIF color palettes and Safari MediaRecorder can change the **decoded** result. A browser hardware test, complete Vite build and on-device iPhone Safari validation are still required before claiming final parity or smooth playback. No Netlify deployment was explicitly requested.
