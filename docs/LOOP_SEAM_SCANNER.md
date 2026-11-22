# Glitchbitch — Loop Seam Scanner and Temporal Jump Audit

The next diagnostic after **Real Encoded Frame Truth Serum** (#73) and **Full-Clip Motion Forensics** (#74).

## What it does

After a GIF or MP4 export completes in the Video tab, choose **Loop Seam Scanner · seven decoded checkpoints**. This uses the **actual saved encoded file**, not an approximation, another recording, CSS preview frames, or additional strict PNG draws.

It looks at seven frames selected by *encoded frame index*: `0, 1, mid-1, mid, mid+1, last-1, last`. A clip needs at least seven frames. The check compares:

- **End → Start**: last decoded frame against first decoded frame — the actual jump an infinitely repeated clip makes when it wraps
- **Opening and ending local steps**: frame 0 → 1 and penultimate → final — typical one-frame changes near either end
- **Midpoint transitions**: mid-1 → mid, and mid → mid+1 — sudden local changes which might be intentional glitchery or an encode artifact

The new source `src/loop-seam-forensics.js` classifies a *possible visible loop seam* only if the final-to-first mean RGB change is meaningful, affects a substantial number of pixels, **and** is at least three times the typical adjacent end-frame movement. A midpoint alert requires a separate large, abrupt change. Both are **descriptive clues**, not declarations of broken encoders. A perfect loop should have a last-to-first change comparable to an ordinary one-frame step, not necessarily identical last and first frames.

The UI shows the encoded-frame difference, local edge movement, a wrap-to-edge ratio, and midpoint change. Three selectable triptychs show the corresponding **real decoded frame A**, **real decoded frame B**, and an amplified **difference heatmap** (end→start, entering midpoint, exiting midpoint). A compact JSON export contains only frame indices, time metadata, numerical measurements, and encoder metadata; no user text, palettes, raw pixels, or video is included.

## Decoding and clock caveats

For GIF, the app uses the already-tested bundled GIF89a LZW decoder that understands Glitchbitch's own **full-frame, opaque, noninterlaced GIFs**. Its safe bounded frame selection now accepts either **three** checkpoints (old motion check) or **seven** (new scanner), preserving the old workflow and refusing partial/interlaced frames. GIF frame delay quantization remains at 10ms, so its presentation time may slightly differ from the original index/fps rendering clock.

For MP4, it reuses the previous invisible muted HTMLVideoElement and sequentially seeks seven times. A **stale-frame seek race was found and fixed**: each new seek now requires a fresh decoder event rather than immediately accepting an already-ready prior frame merely because its timestamp is numerically close. The scanner checks decoded timestamps against target times and requires monotonic progress. A missing/repeated/implausible seek result is marked **inconclusive**, not a failed loop. This does not prove that Safari displayed the exact coded frame at that time: seek/keyframe precision is browser-dependent.

The scanner is optional after completed **480px or 720px** exports. It downsamples decoded frames to at most **480px** per side for comparison, caps GIF source files as the existing motion check does, and temporarily releases the live GPU preview while inspecting. It does **not** call `renderImage`, re-encode the file, alter the user recipe, or change the MP4/GIF export pipeline. Nine small preview image URLs are revoked when the dialog closes, an output is replaced, or format/tab changes.

## How to test on iPhone

1. Pull the new `main`. Render a 2–6-second **480px GIF** with clearly continuous movement.
2. Choose **Loop Seam Scanner**. Select **End → Start**, then each midpoint pair; inspect the actual encoded frames and heatmaps.
3. Repeat with a design deliberately **not built to loop**; a large wrap discontinuity should be more apparent.
4. Repeat with a 480px **MP4**. If Safari's seek behavior cannot retrieve seven distinct timestamps, the diagnostic should show **Inconclusive** rather than falsely blaming encoding.
5. Check a slow, intentionally static, or cyclically returning composition. The scanner should not invent a missing loop seam merely because the last and first frames are not pixel-identical.
6. Use 720px if 480px succeeds. The scanner refuses 1080px+ with a clear size message to protect mobile memory.

## Verified vs unverified

**Verified source/V8 checks:** 11/11 new seam-scanner regression cases and 11/11 preexisting motion-forensics cases passed (**22/22 total**). Coverage includes index clocks, smooth/static/noisy art, true wrap snap, intentional hard midpoint cut, MP4 timestamp uncertainty, JSON privacy, matching geometry guards, and actual seven-frame roundtrip through the **bundled gifenc** GIF encoder. The earlier three-frame decoder remains supported. A separate simulated seek-event test confirmed that a new MP4 frame cannot be accepted based solely on stale ready-state. Syntax checks passed for the JavaScript scanner and changed decoder.

**Not yet verified:** complete Vite/React production build or full npm test suite, running the browser decoder and GUI on iPhone Safari, perceptual smoothness of arbitrary motion, seamless loops across the full clip, or visual matching to the DOM/CSS preview. Results are heuristics, not a proof that a loop is mathematically seamless or that the video encoder failed.

**Netlify:** No deploy/build request or GitHub Actions rerun is initiated. The scanner is merged into `main` so Google AI Studio can pull it directly.
