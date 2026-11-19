# SMART ECOSYSTEM RANDOMIZER — WAVE 6

The missing bridge between Glitchbitch's standard randomizer and the new mutant atmosphere, touch-painted colonies, and Colony Wars subsystems. No manual seed placement required unless you want it.

## One-tap controls

**Global surprise controls**
- **Surprise me** now has an 80% chance to generate a *meaningful*, editable new ecosystem: an atmospheric species, a coherent habitat, actual painted seeds when needed, optional parent B, and sometimes an active lifecycle. The other 20% retain simple optical art for variety. The existing palette and engine locks now actually work. As before, Surprise creates a new artwork with no invented text.
- **Freakshow** is available beside Surprise in the desktop dock and in the mobile artwork toolbar. It remixes existing mathematical/glitch/texture systems together with new ecology. It keeps your existing written words and font styling. It honors the palette lock; otherwise it may shuffle colors. It is one undo step.

**Effects → Scene → Chaos Lab**
- **Shuffle ecosystem** changes atmospheres, habitats, optional dual parent, growth mode, A/B blend, mask geometry, timing, glow, and planted seeds. It preserves the original math engine, palette, lettering, and other old modules.
- **Full weird shuffle** remixes the old GL effects and new living species together with weighted GPU-aware activation.
- **Chaos intensity:** Gentle, Wild, Feral, Maximum freakshow.
- **Preserve my colors / Preserve my words and text styling / Preserve core math and touch forces** are independent toggles.
- **Allow two atmosphere parents** permits hybrids.
- **Allow extra heavyweight GPU combinations** loosens (but does not remove) the mobile effect budget.

**Effects → Scene → Colony Wars**
- **Shuffle colony wars** changes the lifecycle, growth, border glow and rivalry. If a territorial war is chosen, both species are activated, switched to painted masks and seeded with colonies so the battle is visible rather than imaginary.

**Effects → Scene → Mutant atmospheres**
- **Shuffle ecosystem** right alongside the existing specimen and mask controls.

**Touch → Habitat Graffiti**
- **Shuffle colonies** regenerates a composed planted layout while preserving species, palette, lettering, math engine, and existing lifecycle. The new layout remains fully editable with on-canvas handles.

## Composition-aware but no screenshot sampling

Seven carefully shaped seed distributions create more deliberate arrangements than random confetti:
1. Ring
2. Twin clusters
3. Left / right
4. Top / bottom
5. Diagonal invasion
6. Corner islands
7. Spore field

These are **procedural composition layouts**, not analysis of the pixels in the artwork. No framebuffer readback, internet access, tracking, or GPU uploads during random generation. The 16-seed maximum is enforced. Seed coordinates, IDs, ownership, and radius are stored in ordinary recipe state and survive Undo/Redo and JSON save/reload.

## Guardrails

- **Painted colonies** always receives at least one seed for every participating parent.
- **Inverse first** never pairs with A = Everywhere, which would make B disappear.
- **Territory war** always has actual active A/B painted colonies and meaningful competition strength.
- **Mutate** remains a conservative nudge and never wakes a dormant B or dormant lifecycle. The old artwork/force brush is not erased by ecology-only shuffle buttons.
- **Full weird** samples a bounded set of filament, textile, photons, substance, microtexture, backdrop, film, stereo and other modules rather than enabling everything at once. Default extra-heavy cap on mobile is two modules; this cap is relaxed according to the explicit controls. The Preserve core setting protects a current composition layer even from budget reductions.
- **Words are owned by the artist**. Smart Surprise still leaves lettering blank as it always did; Freakshow and the targeted shuffles preserve existing text by default.
- **Existing color and engine lock toggles now correctly apply to global Surprise** (the previous implementation ignored them).

## Source and tests

- New: `src/ecosystem-randomizer.js`
- Updated: `src/data.js`, `src/main.jsx`, `src/components/Inspectors.jsx`, `src/ui-index.js`
- New: `tests/ecosystem-randomizer.test.mjs`
- Updated: existing `tests/art-state.test.mjs` and `tests/colony-lifecycle.test.mjs` to account for fixed lock semantics and intentional Surprise ecology.

**Validation performed:** isolated source-harness regression cases for all seven layouts, two-parent repair, random seed extremes, letter/color preservation, frame-safe recipe round trips, and all 118 existing Lookbook entries. **Not performed:** full repository Node test suite, Vite bundle, actual WebGL GPU/iPhone Safari preview and GIF/MP4 fidelity test. No Netlify, GitHub Actions or paid service was used.

The entire patch is isolated behind its feature branch / PR and can be reverted independently if anything fails on a real device.
