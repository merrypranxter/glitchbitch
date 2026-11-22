# GLITCHBITCH · Textile Six · Wave B: Quasicrystal Brocade

**Stacked on Wave A**, not on main:
- Base branch: feature/feral-jacquard-chladni-wave-a
- Feature branch: feature/quasicrystal-brocade-wave-b
- Main is unchanged; no Netlify deployment.

## New geometry: Quasicrystal Brocade

**New filament species index 23**, appended after 22 legacy thread geometries and Feral Jacquard (22). All original saved species and stitch indices remain stable. This is **not** a renamed version of the existing Fivefold brocade (index 0).

Its fragment shader uses a bounded five-direction, de Bruijn-inspired multigrid: five sets of parallel yarn lines at 72° angular increments, each having independent phason offsets and time-dependent drift. The nearest line becomes the primary thread mask. A second-nearest-line measurement finds crossing junctions, where rare picot/star collar geometry forms. Highlights and palette phase are calculated from these physical-looking local thread relationships.

This is a **quasiperiodic multigrid-inspired textile algorithm**, not an exact Penrose tile generator or proof of aperiodicity. It prioritizes convincing embroidered visuals and bounded mobile performance.

### Six independent controls
- Pentagrid line spacing (filamentQuasiSpacing)
- Phason offset / pattern identity (filamentQuasiPhason)
- Phason drift / living motion (filamentQuasiDrift)
- Embroidered raised relief (filamentQuasiRelief)
- Thread elevation / crown sheen (filamentQuasiElevation)
- Star-point collar ornaments (filamentQuasiOrnament)

Raised embroidery shading is applied inside filamentField to the actual thread core/edge after normal material appearance. It includes a soft dark channel, local highlight, crown and collar glints; it is not a full-screen post-effect. Both parent materials, dress options, existing sculpt relief, stitching, nerve/contagion systems and material palettes can remain in the pipeline. The feature also works as either parent in hybrid breeding.

### Six presets
1. Quasi — Heirloom pentagrid
2. Quasi — Golden cathedral
3. Quasi — Alien silk circuit
4. Quasi — Phason ghost lace
5. Quasi — Opal star-brocade
6. Quasi — Impossible textile ruin

Use Filament Forge > **QUASICRYSTAL BROCADE** to select a recipe, edit individual controls, run **Shuffle quasicrystal geometry**, or **Reseed phason**. A recipe changes the primary geometry and its six parameters, preserving authored text, palettes, current thread materials, hybrid partner and selected stitch motion.

## Compatibility

The new fields are present in numericRanges, initial, recipe validation, undoable state, full Surprise and guarded Mutate. Old art loads identically because the new species is opt-in and old modes never use the new settings. Find a Control and Reset know every parameter.

Only the selected geometry branch is compiled through specializeFilamentGeometry. All other 23 geometric branches are removed from that shader variant. The same selected fragment shader is used in live preview and exact-effects PNG/GIF/MP4 exports. No new context, FBO, texture atlas, CPU sampling, 3D geometry or API is needed. No alternative export implementation was added.

**Compatibility with color lab PR #65:** Color Mathematics Lab remains a separate draft based on main. Neither wave merged the color lab; a later integration will require a reviewed merge/rebase.

## Verification

Passed: V8 parsing/execution of the full filament-forge module, all 24 geometry and 32 stitch mode specializations, quasicrystal solo and hybrid mode selection, Chladni plus Quasicrystal combined, balanced GLSL braces and UI/recipe/renderer wiring checks. Added tests/quasicrystal-brocade-wave-b.test.mjs. Adjusted legacy count assertions without reindexing.

**Not yet run:** Full npm test, Vite production build, real iPhone Safari GLSL compilation, screenshot preview parity, exact-effects GIF/MP4 visual proof, high-resolution 1:1 and 9:16. Static shader specialization is not a guarantee of hardware rendering or export parity.

## QA plan before merging

1. Pull the Quasicrystal stacked branch in a controlled test workspace, without overwriting active Google AI Studio changes.
2. Load older art: verify same appearance. Select quasicrystal manually and compare it to original Fivefold brocade; they must visibly differ.
3. Exercise each of the six sliders, six presets, both shuffle buttons, undo, recipe round-trip, palettes and every parent dress.
4. Set Quasicrystal as parent A and B in separate tests; crossbreed with Feral Jacquard. Add Chladni Needle Orchestra on top.
5. Use exact-effects export proof, two-second GIF and MP4, compare to preview at identical timeline timestamps. Repeat 1:1 and 9:16, starting small on iPhone Safari.
6. On GPU failure, capture exact compile/validation logs. Never silently omit effects to permit download.

## Next three selected textile additions (issue #64)

- Structural-Color Optics — thread-local optical dressing of both independent parents
- Retrocausal Embroidery — deterministic lookahead stitch motion
- Semantic Gravity — typography-to-thread geometry interaction, including strict export parity

Wave A (Feral Jacquard + Chladni) is a distinct, unmerged draft; this branch contains it as its base.
