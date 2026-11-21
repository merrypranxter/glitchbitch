# Frame-memory export fix — Safari GPU history copy (2026-11-21)

## Reproduction

On an iPhone in Google AI Studio, **1080 × 1080, MP4, 30 seconds, 30 fps, 16 Mbps** failed with:

> Export stopped rather than remove your special effects: Frame-memory composite failed. GPU detail: GPU history texture copy failed.

This message came from the end of the old frame-memory pass: the renderer composed feedback into the browser's *default framebuffer*, then called `gl.copyTexSubImage2D` on that framebuffer to update the previous-frame texture. A WebGL error was detected after the copy, although the prior code could also have reported a stale GL error at that point.

## The repair

Use GPU ping-pong history render targets instead of copying from Safari's display backbuffer:

1. Draw the original current scene into its normal RGBA8 offscreen scene texture.
2. Run the **unchanged Afterimage/Temporal Datamosh GLSL math** into the *write* history texture attached to an explicit second framebuffer, while sampling only the *read* history texture. The two targets are always distinct.
3. Present the completed write texture to the visible canvas using a tiny fullscreen shader. This is the **same composited image** that the next frame samples.
4. Swap read/write history indices after the presentation succeeds. Reset/resize invalidates history without changing the artist's settings.

The new display program is compatible with WebGL1 and WebGL2. Explicit FBO completeness and scene/composite/presentation GL error checks report the failing stage separately. Failure never advances the history swap. No GPU-to-CPU readback is needed for feedback, and no unbounded frame array is allocated.

Resources for a 1080² render: one scene texture, two ping-pong history textures (three RGBA8 textures in total, about 14 MB of raw texture payload), and two FBOs, independent of the 900-frame clip duration. This is one extra history texture and one extra FBO versus the old copy-based path; it trades a small fixed GPU allocation for safer synchronization on Safari.

## What is intentionally unchanged

- Feedback shader equations and its Afterimage, Datamosh, Drift and Decay controls.
- Five-frame deterministic export pre-roll.
- Exact-effects mode: if the real GPU still rejects a pass, MP4/GIF/PNG must report a parity error rather than silently omit special effects.
- The H.264 encoder, MP4 container, frame rate, bitrate, text composition, palette, geometry and every non-frame-memory art effect.
- Old JSON recipes and existing preview state; no new artist-facing controls or automatic resets.
- No Netlify deploy.

## Verification

New `tests/feedback-pingpong.test.mjs` instruments actual extracted feedback allocation/composition logic against a fake WebGL1/WebGL2 API. It checks alternating FBO writes, never sampling the current write texture, exactly presenting the composited texture, reset/resize/cleanup, a failed draw leaving history unchanged, and a 900-frame simulated 1080px sequence with a bounded 3-texture allocation. All six tests passed in a V8 execution harness. The older copy-based test was updated.

**Remaining real-device QA:** Full npm/Vite build and WebGL shader compilation were not available in this environment. Pull the latest main into the Google AI Studio preview, then try a 480px full-effect export proof and a short 1080p MP4 before the full 30-second 1080p clip. Confirm in Safari that Afterimage/Datamosh survive in the downloaded MP4 and look like the editor. This fix is not presented as hardware-certified until that succeeds.
