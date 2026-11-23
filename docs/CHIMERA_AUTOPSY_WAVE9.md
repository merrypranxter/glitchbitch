# Shader Vault Wave 9 — Chimera Autopsy

**Purpose:** Make the existing Wave 8 stress test actionable. Instead of a generic “your shader is expensive” message, an artist can inspect which of the five original Shader Vault families changes observed render latency when temporarily omitted.

## Where to use

Export -> Video -> **Chimera Autopsy · which parent is expensive?** -> **Autopsy active shader parents**.

The autopsy appears alongside the Wave 8 exact-size GPU stress test and the existing **real decoded MP4/GIF-versus-PNG forensic** tools. It never replaces the latter. It only benchmarks the shader portion of the composition.

## What the autopsy actually does

A diagnostic, strict-effects WebGL renderer is created after the live preview context is freed through the existing export flow.

At a *maximum of 720px on the longest edge* (smaller for more modest selected video sizes), it measures **three different source-frame times per variant**, excluding the first (shader compile/warmup) from latency statistics. For a five-parent chimera, the sequence is:

1. Complete artwork, including its crossbred offspring (if that offspring is actually enabled).
2. All parents enabled with only the offspring disabled — the parents-only anchor.
3. Parents-only minus Hexagram Terraces.
4. Parents-only minus Complex Poles & Zeros.
5. Parents-only minus Quasicrystal Dissolution.
6. Parents-only minus Living Velvet Damask.
7. Parents-only minus Hyperbolic Crochet.
8. Parents-only anchor REPEATED at the end, to check whether the GPU drifted significantly over the run.

Absent parents are automatically excluded from the plan, so a single Crochet artwork requires only three variants.

Crucial: when a parent is removed, the crossbreed child is already off. Otherwise the child would implicitly disable because it lacks a required parent, creating a misleading “parent cost” comparison. The removed parent is a temporary **shallow state clone**, not an edit to the live history; text, palettes, seeds and all other settings remain untouched.

Only one GPU context exists for the whole autopsy. Each variant resets feedback/biology **inside that disposable context only**, warms its own specialized shader, and waits for the actual WebGL2 GPU fence. Cancellation, hidden-tab detection, context loss, shader compilation errors and resource cleanup are handled.

## Reading the output

The parent-only baseline and repeated baseline show typical latency and measured drift.

- A **positive** timing difference means the variant ran faster without the named parent in the sampled conditions. This does *not* mean the parent is visually disposable.
- A **negative** difference means removing the parent actually measured slower; shader specialization and caching can do that.
- Small changes are classified as **no clear difference** rather than confident conclusions.
- If repeated anchor timing drifts by more than the greater of 3ms or 20%, the run becomes **inconclusive** to avoid false blame during thermal throttling.
- WebGL1 lacks actual GPU completion fences: **GPU timing unavailable**. No fake rankings based on CPU-only timings.
- With the child itself active, the report also compares the complete hybrid to the parents-only field, but does not claim a causal speedup or exact-frame visual fidelity.

At most 720px, results are *comparative screening*, not authoritative prediction of the requested 2160px export. For that, run the separate Wave 8 **Stress-test exact shader at this size** using the chosen output resolution. For actual encoded fidelity, export a 480/720px sample and use the existing **Full-Clip Motion Forensics** and Loop Seam Scanner, which decode the real MP4/GIF output.

Reports are downloadable JSON without artwork, words, palette colors or pixels. Results hide automatically if the selected dimensions, format, FPS, playback, clip duration or recipe identity change.

## Safety, performance and scope

- Original source art, shaders, user presets, text compositor, randomizer, exact GPU renderer and all codecs **unchanged**.
- The diagnostic has a Cancel button and yields to the browser after each variant.
- No Netlify, no GitHub Actions, no third-party dependency, no automatic/background profiling and no silent visual simplification.
- The added Node regression tests cover plan correctness, immutability, multi-parent isolation, stable and drifting baselines, WebGL1 limitations, exact-resolution capping, Boomerang clocks, cancellation and cleanup.
- The actual device benchmark has not yet been run. Real iOS Safari timings and decoded pixel comparisons must be collected in the browser.
