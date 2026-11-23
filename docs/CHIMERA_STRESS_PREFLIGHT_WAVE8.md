# Shader Vault Wave 8 — The Chimera Torture Chamber

## Why this exists

Glitchbitch already has good AFTER-export forensic tools:
- Encoded Frame Truth Serum decodes an actual MP4 or GIF frame and compares it to a strict-effects, clock-matched PNG.
- Full-Clip Motion Forensics inspects opening, middle and ending frames, reporting color differences and motion retention.
- Loop Seam Scanner audits the actual encoded ending and wrap.

Those tools are not a way to know whether a particular GPU can compile and execute five shader families at the *selected* output size BEFORE recording. The new Chimera Torture Chamber is an optional export preflight, not a new exporter or a replacement for decoded-file inspection.

## How to use it

Open Export -> Video. Select MP4/GIF, aspect ratio, longest edge, duration and frame rate/playback direction. Press **Stress-test exact shader at this size**.

The app temporarily releases the live preview's WebGL context (using the same existing onExportBusy flow as normal PNG/MP4 export) and allocates a fresh strict-effects renderer. It draws the current recipe at the exact selected pixel dimensions. It samples five source frame times inside the specified clip (for Boomerang, mapped to the relevant forward source time), warming up the shader on the first draw and measuring four subsequent draws. WebGL2 uses the same awaited GPU fence as strict GIF/MP4 export. It then destroys the test renderer and restores the live canvas. No user's settings, animation clocks or palette are changed.

A Cancel stress test button aborts the operation; failing shader compilation, lost GPU context or unsupported dimensions report a real error. There is no automatic downgrade to simplified art.

## What the result means

The report shows:
- Observed median, minimum and maximum frame latency across **four** measured exact-effect draws (after a warm-up draw)
- The selected FPS reference time, useful for interpreting load but **not** an encoder performance guarantee
- An exact single RGBA frame size estimate in MiB; it is **not** a measurement of total RAM or GPU/codec memory
- A descriptive load category for WebGL2, subject to the limitations of a tiny sample
- Clear backend disclosure: WebGL2 GPU-fence timing vs WebGL1 CPU-submission-only timing

Crucially, WebGL1 has no GPU fence. If the browser uses WebGL1, the report says **GPU unmeasured**, never "fast" merely because CPU submission was quick.

Download **Save shader stress report (JSON)** to capture the numerical timing, pixel dimensions, FPS, duration, playback mode, context type and scope. The JSON excludes users' text, recipes, palette colors and image pixels.

Results are hidden if the selected format, image size, duration, playback mode, frame rate, aspect ratio or recipe reference changes. Stress testing is user-triggered, never an invisible task that runs on app startup or every frame.

## After exporting

The stress check does not decode or verify a real MP4/GIF. A successful shader pass means the exact effect *could be drawn in this brief test*. It is NOT proof that:
- The entire clip can run without thermal throttling or memory pressure
- H.264 hardware/software encoding will work at the chosen size
- The codec will reproduce optical colors, bright filaments, overlays or kinetic text
- A recorded loop will close seamlessly

For actual export fidelity, first produce a **480p/720p sample**, then click **Full-Clip Motion Forensics**, which compares opening/middle/end frames actually decoded from the exported file to same-clock strict-effect PNGs. The single-frame integrity view and seam scanner are also available. Those existing features are untouched.

## Engineering and compatibility

New file: src/shader-stress-preflight.js
Updated: src/components/ExportDialog.jsx, src/renderer.js
Tests: tests/shader-stress-preflight-wave8.test.mjs (6 cases)

The benchmark reuses createRenderer(exactEffects:true), clockAt, waitForGraphics and the already-known Boomerang source-time mapping. It allocates a short-lived GPU canvas and immediately destroys it in a finally block. No PNG/GIF/MP4 encoder changes, changes to physics/shader source, Netlify use, GitHub Actions, third-party dependencies or cloud telemetry.

Source logic was parsed and measured deterministically with injected fake renderers; full npm tests, production build, device timing and decoded export verification still must happen in a real browser/CI environment.
