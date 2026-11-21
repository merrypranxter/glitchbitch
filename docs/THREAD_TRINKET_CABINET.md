# Glitch Bitch · Thread Trinket Cabinet

Filament Forge now offers an independent fifth dimension of textile control: thread-attached ornaments. The original geometry, self-weaving, dressing, and sculpting choices remain separate and composable.

## 12 genuinely distinct ornament modes

**Traditional:** Pearl stations (rounded optical beads), Sequin chain (flashing faceted foil), French knots (coiled ridgelets), Tassel fringe (combed protruding fibers), Lace picots (open looplets), Glass bugles (elongated faceted bars).

**Funky:** Opal barnacles (growing rings), Electric thorns (charge-driven points), Watching eyes (iris + pupil), Mycelium spores (pulsing buds), Neon teeth (animated zipper jaws), Orbiting halos (moving optical collars).

These are procedural 2.5D embellishments around the thread's real field-distance mask, not 3D meshes or fullscreen stickers. They use the same filament-local coordinates as the moving fabric, inherit stitch-reveal masking, and can attach DIFFERENT ornaments to the two hybrid parents. Color comes from the existing palette.

## UI and combined wardrobe

Effects > Texture > Filament Forge > **Thread Jewelry** has two selectors, five controls (amount, stations/spacing, size, motion, shine), 12 paired recipes, and targeted shuffles for all jewelry or weird jewelry. Strip jewelry retains the underlying material and weave.

Existing **Dress the Threads** controls are retained. A new **Outfit roulette — fibers + jewelry** combines the existing material dressing with attached ornament choices across both parents; **Full cursed couture** limits choices to weird materials and weird ornaments. Both leave existing geometry, palettes, text, background and self-weaving law untouched.

## Resilience and exports

Opt-in and default-off: legacy recipes retain Bare threads and zero jewelry presence. Two parent choices and five controls are typed, validated, undoable, and included in new recipe snapshots and Surprise/Mutate. Only selected ornament shader branches compile. The ornament effect adds no second render pass, texture, independent timer or external API, and it uses the existing deterministic frame clock consumed by preview, PNG, GIF and MP4.

An isolated preview GPU fallback disables jewelry first while retaining thread geometry, fiber materials, stitches and text. Export's strict full-effects mode raises a parity error instead of silently omitting jewelry if full shader compilation fails.

## Verification

Pure JavaScript parsing and 1,727 direct shader-structure/wiring assertions passed for all 169 parent-pair configurations and 682 geometry/stitch combinations. A Node test suite was added for saved recipes, presets, no-change legacy behavior, shuffles and renderer/UI wiring. Real device shader compilation, the complete npm suite, iPhone Safari, and visual MP4/GIF parity have **not yet been tested**. No Netlify deploy or changes to the repaired exporter.
