# SELECTION CHAMBER — Wave 13

**Genes finally matter to survival, not just pigment.** This wave connects heritable colony DNA to the mineral nutrient resource field. A mathematical fitness score affects how large and luminous an individual colony becomes; when the user chooses, it also determines which organisms get to reproduce and which weaker competitors are removed from the saved artwork.

This is a **bounded artistic selection model** based on individual trait/environment matching, not a claim to simulate actual population biology. Nothing dies or reproduces during ordinary animation without an explicit user action.

## How to play

Open **Effects → Scene → Selection Chamber**. Select one of four models:

- **Nutrient matching:** Alleles matching the local nutrient value are favored, combined with the existing parent species' A/B nutrient preferences
- **Specialist advantage:** Extreme, well-matched alleles gain an additional bonus
- **Adversarial niche:** Opposing the local chemical signal can become advantageous
- **Hybrid vigor:** Intermediate alleles receive a boost while still balancing mineral compatibility
- **Dormant** is the default, maintaining the old rendering path

Four 0–100 controls:
- **Fitness effect on growth:** how strongly local fitness expands/contracts living boundaries
- **Remove weakest percentage:** manual cull quota; never automatically removes anyone during playback
- **Survivor offspring proportion:** how many fitness-ranked colonies can found new daughter colonies, subject to the existing 16-colony cap
- **Adapted-organism radiance:** additional palette-driven light for fitter regions

Buttons:
- **Awaken selection** loads one named scenario, turns on an actual mineral field and gene expression, and fills *only unassigned* seed alleles. It respects existing personal DNA edits.
- **Shuffle selection** changes the fitness model and parameters while preserving painted positions, text and colors
- **Breed the fittest** explicitly appends daughters from highest-ranked organisms, with inherited/mutated alleles, nearest A/B recombination and original ancestor records; it never erases existing colonies
- **Cull weakest (confirm)** asks for confirmation before removing the least-fit colonies. Even at 100% severity it preserves at least one seed from each species currently present
- **Select + reproduce (confirm)** performs a cull followed by highest-fitness breeding as one Undo transaction
- **Stop selection (keep bloodlines)** turns off the fitness effect without erasing genes, offspring, old stamps or text

A collapsed **Fitness scoreboard** lists up to 16 colonies with species, DNA, generation and normalized fitness. The selected colony's fitness is also visible under **Touch → Habitat Graffiti** when selection is active.

## What actually happens mathematically

The static local resource value is sampled from the existing substrate field. Each individual gene allele maps to a preference in [0,1]. The resource-match score is `1-|gene-resource|`. Parent affinity comes from preexisting `substrateAffinityA/B` settings. A weighted combined score drives the four alternative selection behaviors.

In the GLSL mask shader, this score actually scales each organism's **edge radius** before constructing its smooth, animated silhouette, and contributes a bioluminescent survival response after atmosphere composition. The artist should be able to toggle the selection effect and see thriving/thin colonies react immediately.

For explicit action:
- `rankSelection(state)` ranks real seeds by their fixed, reproducible **center-point** nutrient fitness. Stable tie breaks preserve original seed order.
- `cullWeakest` removes only as many weak seeds as the chosen percentage permits, never wiping out the last A or B seed.
- `breedFittest` chooses the highest-scoring real parents and reuses the **same `daughterSite()` function** as Spore Dynasties and the same **`inheritColonyGene()`** mechanism from Mutation Bloodlines. The children are ordinary editable habitat seeds with saved real IDs and lineage, not ephemeral raster particles.
- `selectionCycle` combines culling and breeding into one undoable history action; no automatic background mutation, hidden frame state or stochastic per-frame births.

The score used for the manual ranking samples the static resource at the **seed center**. The shader responds at the **current pixel**, so a large colony spanning multiple mineral bands can show local variations even when its rank is a single representative number. Those are deliberately different scales of the same analytic fitness function.

## Four editable Lookbook worlds

Total looks: **147**.

- Darwinian Neon Reef
- Quartz Survival Games
- Poison Garden Reversal
- Hybrid Vigor Cathedral

Each includes multiple A/B populations with individually saved gene alleles, living anatomy/cortex, real mineral ecology and animated spores. Different selection modes create different visible competitive dynamics; no automatic culling starts on opening a preset.

## iPhone and backwards compatibility

New `src/selection-chamber.js` contains all four modes, preset selection, fitness functions, selection/breeding actions and a small, opt-in GLSL ES 1.00 module. No additional seed GPU arrays, new render passes, textures, FBOs or frame-history simulation.

New compile-time hooks `/* SELECTION_MODULE */`, `/* SELECTION_EDGE */`, `/* SELECTION_SAMPLE */` piggyback on the existing **single** painted-habitat seed loop and its existing gene marker encoding. The shader uses the original `substrateNutrient` from the existing geology pass. The program cache key separates selection-on and selection-off. When gene expression, mineral substrate, or selection strength is disabled, the entire new material code is absent and the earlier shader remains unchanged. Preview and the PNG/GIF/MP4 renderer use the same path.

Existing user layouts, lettering, palettes, hand-painted forces and genetic family trees are preserved. The conservative **Mutate** action never awakens selection by accident. Full Surprise, Shuffle Ecosystem and Freakshow can introduce selection *only after* genuine planted genes and visible mineral habitat exist, so randomized worlds do not carry invisible extra GPU load.

## QA

New test `tests/selection-chamber.test.mjs`: **12/12 new regression groups passed in a source-level JS harness**.

Verified:
- Exact legacy recipe migration/defaults
- Finite bounded fitness for every mode and multiple nutrient samples
- Preparing ecology never overwrites existing saved DNA
- Stable fitness ranking and species-safe, explicit culls
- Highest-fitness offspring and parent/child inheritance, generation counters and a 16-seed hard cap
- Reversible, serialized selection cycles and original text/palette preservation
- Surprise/Freakshow conditional participation; dormant Mutate remains dormant
- **All 147 distinct Lookbook recipes validate and round-trip exactly**
- Source-level GLSL hooks, shader gating, panel/search controls and JS syntax

**Not verified in this connector environment:** full Node `npm test`, actual Vite build, hardware WebGL shader compilation, iPhone Safari FPS at all 16 organisms and maximum effects, and PNG/GIF/MP4 pixel parity. Pull the merged branch into Google AI Studio and test there before paying for Netlify deployment. No Netlify deployment or paid API calls occurred.

### Suggested first test

Open **Quartz Survival Games**. Visit **Selection Chamber → Fitness scoreboard**, change the fitness model and the Nutrient matching settings, then compare colony sizes with Selection Pressure at 0 versus 95. Hit **Breed the Fittest**: new gene-bearing offspring appear with real ancestor IDs. Try a confirmed **Cull Weakest** at high severity (Undo should restore the exact original colony set), then **Select + Reproduce** to explore a multigeneration ecology.
