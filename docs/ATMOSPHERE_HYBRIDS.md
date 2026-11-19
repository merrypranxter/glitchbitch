# ATMOSPHERE BREEDER & LIVING HABITATS — WAVE 3

Turns the four opt-in shader-vault Mutant Atmospheres into **two independent parents**, with separate morphology/timing/palette controls, multiple blending methods, and *animated spatial habitats*. All shader work remains in the existing GLITCHBITCH WebGL renderer so live preview and the PNG / GIF / MP4 export path see the same art.

## What the artist gets

Go to **Effects → Scene → Mutant atmospheres**, then open the collapsible panels:

**TWO-PARENT ATMOSPHERE BREEDER**: select the second parent and separately set presence, pattern size, density, motion, glow, palette shift and variation. Blend it as Over, Light bloom, Ink stain, or Spectral difference. Controls: Spawn hybrid, Breed wild, New second parent, Swap parents, Hide second, Hide both.

**LIVING HABITATS — MASKS & TERRITORIES**: choose an independently moving placement for each parent, with pattern coverage, soft-edge feather, motion and seeded variation. Shapes: Everywhere (default), Bloom iris (angular rotating lotus), Cell colonies (merging interference domains), Flowing ribbons (sinuous wave bands), Fractured mosaic (seeded tile fractures). Parent B additionally offers **Inverse first**: it occupies the empty space outside Parent A's habitat.

**Five instant breeding recipes**:
1. Fungal Broadcast Storm (mycelium × heartbeat CRT, complementary island habitats)
2. Printed Cosmic Rupture (nebula × print rosettes, ink outside the iris)
3. Mycelium Inside The Moon (luminous fungal structures colonizing a soft-edged nebula)
4. Riso Fungal Infestation (printed rosettes × fungal fractures, spectral difference)
5. Cardiac Moire Organism (heartbeat × CMY rosettes, overlapping moving ribbons)

The five recipes are available as an **Atmospheric Hybrids** family in the Lookbook: total now **111** editable starting points. Their underlying math engines, colors and seeds are editable like every other look.

## Non-destructive implementation

- `atmoBAmount = 0` and `atmoMaskMode = atmoBMaskMode = "Everywhere"` are the defaults. Old recipes **do not compile** the secondary shader, and single-parent old render behavior is unchanged.
- On demand, `specializeAtmosphereVariant` duplicates *only the selected source variant*, renaming its uniforms and helper function for parent B. A preprocessor macro reset between the two prevents parent B replacing parent A's branch. Parent B has an independent motion clock multiplier, and both pigment systems derive colors from the active user palette.
- Masks are continuous-time analytic math with feathered edges. The shader source is injected **only** for active non-Everywhere habitats. B's Inverse-first option fills the complement of A's mask. It naturally produces an empty B mask if A is Everywhere; the inspector explains that.
- Four delta-based B blend rules avoid changing the base when B influence approaches zero.
- Memoryless math uses the normal `time` uniform and seeded hash, so independent GIF/MP4 export can replay the same frame without separate history buffers or external assets.
- Progressive GPU failure: disable only new masking first, then parent B if necessary, then parent A. Existing text compositor, fonts, palette systems, export encoders and 20 math engines are unchanged.
- New string fields and 11 numeric controls are validated in recipe JSON and preserved through undo/import/export. `Mutate` cannot silently activate an off second parent; `Surprise` may choose a hybrid. The Effects On filter detects either active parent.
- **No Netlify / external services / paid APIs / Github Actions.** Only source files in this branch.

## QA

Regression coverage: `tests/atmosphere-hybrids.test.mjs` plus updated Lookbook count checks in `art-state` and `strange-fields`. Static JavaScript source parsing and single-module behavior checks were performed. **Full `npm test`, `npm run build`, live WebGL shader compilation and iPhone Safari export parity were not performed in the source environment.** These must be verified after pulling `main` into Google AI Studio. Pay special attention to using A+B with a habitat and test GIF/MP4 after the first seconds of animation.

## Future

- Touch painting to place/edit habitat attractors directly on the fixed canvas.
- Independent mask shapes/colors for three species (subject to iPhone GPU benchmarks).
- Analytic material thickness, refraction and roughness for fungal-glass hybrids.
