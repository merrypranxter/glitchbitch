# GLITCHBITCH — Loop Surgery: Soft Closure (Wave 1)

**Where:** Export → Video → Loop surgery → **Soft closure · fade ending into the opening**

This is an **opt-in export treatment** for the user's real MP4 and GIF files. It works with the original WebGL render, detailed filament materials, Structural Color, retrocausal stitches, atmospheric layers, complete text styling and Semantic Gravity. It does not replace the underlying shader with a screenshot or a cheap fallback. **Off** remains the default and leaves the original export path unchanged.

## Problem

A video can have an obvious **last → first jump**, even if all frames are correctly rendered and encoded. The Loop Seam Scanner (#75) finds this boundary discontinuity but cannot repair it. The new Soft Closure treatment makes the end-to-start *visual frame* match without requiring shaders to know exact periodic motion.

## How the fix works

1. In the existing `createFrameWorkspace`, capture and save the very first **complete composite frame** after all WebGL pixels and Canvas2D text have been painted. This uses one opaque **Canvas2D anchor**, not a second WebGL context or render.
2. Render **all** original frames at their normal time, including every shader and lettering animation. Only near the end, apply a standard **source-over alpha blend** of the saved opening frame on top of the regular final artwork.
3. Use a smoothstep envelope during the final artist-selected window (0.25, 0.5, 0.75, 1, 1.5 or 2 seconds): the beginning of the blend starts at zero; the final *source* frame uses alpha=1. The end-frame raw composite therefore matches the opening raw composite before encoding. The rest of the clip is unchanged.
4. **GIF:** feed the *post-blend Canvas2D pixels* into the existing per-frame quantizer. This is critical: otherwise GIF would encode the original unmodified WebGL buffer and appear not to support Loop Surgery.
5. **MP4 WebCodecs:** the existing `CanvasSource` reads the blended capture canvas as it already reads the ordinary exact-effects composite.
6. **Safari native MP4:** `captureStream` pre-renders frame 0, so Soft Closure skips a redundant draw of that same frame at i=0. Without this, a feedback-based art engine could advance its history a second time and create an anchor different from the captured opening. The `Off` path preserves the original behavior.
7. The capture anchor canvas is released during workspace cleanup. No permanent duplication of frames or accumulation of GPU contexts. An additional full-resolution Canvas2D bitmap is allocated **only when enabled**.

Export filename includes `-softloop` to differentiate it from an untouched original. The export mode is a **video-export preference**, not a persisted recipe or shader parameter. It can be turned off at any time without changing an artwork or its colors.

## Honest limitations

**This is Soft Closure, not a mathematically perfect periodic motion field.** The last raw composite frame equals the first, but nearby *velocities, texture flow, shadow directions, moving letters, optical phase and feedback history* may not be periodic. The last 0.25–2s can briefly look like ghosting or easing to a halt as the opening image overlays the end. A true temporal loop would require periodic time-law support and careful feedback/history simulation within each engine. GIF is palette-reduced; H.264 is compressed. Their **decoded** end frame may differ slightly from the decoded first frame even if their input RGBA frames match.

This technique does not reverse the simulation, construct a boomerang, invent a new art style, or guarantee that the clip will loop smoothly when mixed by TikTok/CapCut; it *does* give artists direct control over a troublesome loop boundary.

## Using the diagnostics

**Loop Seam Scanner:** directly decodes the real saved end and start frames, so it can assess whether the Soft Closure reduced their difference.

**Full-Clip Motion Forensics:** compares decoded frames against **plain strict PNG references**. Since Loop Surgery deliberately modifies the final section after the base PNG shader render, the original tail PNG reference is expected to differ. The report now suppresses a misleading “possible lost motion” accusation if Soft Closure deliberately changed those ending frames; the UI explains this. Other diagnostics remain available.

## Suggested on-device test

1. Pull `main` in Google AI Studio; choose a very obviously moving textile with bright optical dressing and, if desired, animated lettering.
2. Export a short **480px GIF**, Loop surgery **Off**. Inspect its boundary using the seven-frame **Loop Seam Scanner**.
3. Export the SAME recipe/clock as a **Soft closure 0.75s GIF**. Run the scanner again; the last→first pixel jump should be much smaller. Verify colors, threads and lettering are still present.
4. Repeat with 480/720px **MP4**. Safari native recording may have frame delivery and H.264 compression differences; the scanner should show the actual decoded result.
5. Experiment with 0.25s for subtler repairs, 1–2s for harder discontinuities. If ghosting looks too obvious, reduce the duration or disable Soft Closure.
6. Confirm an older untouched recipe with **Off** still exports exactly as before. Try GIF/MP4, 9:16 and 1:1, fixed/static motion, rich text, save/share, and an artwork with GPU feedback/afterimage.
7. Test high-resolution MP4 where device memory allows. If the output is too demanding, reduce resolution. Do not silently remove effects.

## Testing achieved / not achieved

Targeted regression tests cover the pure smoothstep window, bounded frame counts and invalid options, all three encoder paths, post-blend GIF pixel readback, the native-recorder duplicated-frame safeguard, explicit diagnostic disclosure, and the actual production **frame workspace function executed against a simulated Canvas2D**. The simulation compares all RGBA bytes of the first and last source frames and includes a mocked lettering pass. The default Off mode remains unaltered. Tests do **not** perform real WebGL rendering, browser video encoding, or Safari device validation.

No GH Actions/Netlify build or deployment is explicitly requested. A GitHub merge does not guarantee that automatic third-party deployment rules are disabled.
