# Glitchbitch — first post-merge textile integrity pass

## Scope

This pass audits the newly merged textile stack (Feral Jacquard, Chladni Needle Orchestra, Quasicrystal Brocade, Structural-Color Optics, Retrocausal Embroidery, Semantic Gravity). It does **not** add another visual mode. It fixes two real integration problems and one dormant-mutation guard; preserves existing recipes and every material/stitch ID; and keeps main pullable in Google AI Studio.

## Fix A — honest text blend A/B proof with Semantic Gravity active

**Before:** ExportDialog constructed its background reference by setting `letteringAmount=0` and hiding extra text layers. But Semantic Gravity activates only when text is visible, so the reference accidentally changed the actual underlying textile geometry as well as the final lettering. This contaminated text coverage and blend measurements.

**Now:** `renderImage` accepts an optional `{compositeLettering:false}` setting. It always passes the exact original state and timeline into WebGL; the setting skips **only** the final Canvas2D text compositing pass, preserving letter-driven fiber deformations, Structural-Color Optics, both hybrid threads and all other shader effects. The A/B comparison uses the untouched original recipe to create this reference. The existing default is `compositeLettering:true`; PNG/GIF/MP4 and thumbnail behavior is unchanged.

Additionally, the geometry mask generated from lettering is normalized to the **Normal** compositing blend (via existing `normalTextBlendState`) before painting it with the existing `paintLettering` compositor. Actual word content, font, positions, rich layout, strokes, material, time and motion stay the same. This keeps thread geometry stable when the user tests different visible *blend operations*, so the A/B measurements assess the lettering blend instead of inadvertently modifying the substrate. **This is a glyph-shape field, not color-semantic AI.**

These repairs also improve the integrity of the single-frame export proof path without adding a texture upload or a second WebGL renderer.

## Fix B — preview frame loop no longer dies from one shader failure

**Before:** ArtCanvas caught render exceptions then returned from `tick` **without requesting the next animation frame**. A transient WebGL shader/texture failure could leave the preview permanently frozen or white until manual recovery. It also ignored `renderer.draw()===false` and updated the last-drawn state as though the draw succeeded.

**Now:** An unsuccessful draw is considered a failure. The RAF loop remains scheduled, and the error appears in the existing render error UI. It retries at once when user state, output dimensions or a font revision changes; otherwise it throttles repeated GPU attempts to **one every 1.8 seconds**. After a successful frame, transient errors clear. The existing manual **Retry renderer** still recreates a fresh context.

This is a bounded, cautious recovery mechanism. It is **not** a replacement for testing Safari shader compatibility; a driver-level failure may persist and should show a clear error, not silently alter exact exported frames.

## Fix C — no hidden Feral/Chladni mutation

Mutate no longer touches Feral Jacquard controls when there are no visible filaments or only a dormant, inactive second parent. Chladni controls similarly remain unchanged when filaments themselves are off. When active, the user may still mutate these parameters normally.

## Verification

Source/V8 verification completed successfully: **17 / 17 checks** for exact-export opt-out semantics, text-blend comparison, shared glyph compositor, RAF recovery, dormant Mutate guards, updated existing test references, JavaScript parsing of modified export helpers and actual text activation. The new file `tests/textile-export-integrity-recovery.test.mjs` documents the intended contracts; existing tests were adjusted.

**Not tested:** full `npm test` or `npm run build` (container cannot clone GitHub), real Safari/WebGL runtime, actual decoded MP4/GIF pixel equivalence, or performance on 9:16 iPhone exports. Any export feature discrepancy after this fix needs the exact error / screenshot and corresponding flattened export proof. No Netlify deploy is requested.

## Manual acceptance

1. Pull `main` into Google AI Studio. Start with a known older recipe and check the live canvas does not freeze on toggling new effects.
2. With text and Semantic Gravity on, go to Export → **Compare actual blend vs Normal (A/B)**. The background reference should now retain the same displaced threads, with only the final visible text removed. Switch Normal/Multiply/Difference; the underlying fiber structure should not jump.
3. Test both hybrid parents, two optical dressings, Retrocausal stitches, and Feral/Quasicrystal. Run Export → **See flattened export proof (480px)**.
4. Capture PNG and MP4/GIF at the same time and compare frames. Strict exports must either include all active effects or fail visibly; never silently downgrade.
5. If the preview hits a transient shader error, the loop should keep running and retry a maximum of once per 1.8s unless something changes. The **Retry renderer** button remains available.
6. Verify older saved recipes, Undo/Redo, and Mutate with dormant filament layers.
