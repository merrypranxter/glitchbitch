# ANCESTRAL RESURRECTION — Wave 16

The fossil archive is now a **genetic seed bank**, not just glowing geological wallpaper. You can use an ancestor's stored species, DNA, epoch and coordinates to grow a new editable colony. Fossils are never consumed: history remains immutable while descendants become ordinary movable, selectable, breedable living seeds.

## Where it lives

**Effects → Scene → Fossil Record → Resurrection Chamber.**

Choose a **Revival method**, then use **Revive oldest ancestor** or **Raise the whole graveyard**, or open **Geological archive** and tap **Revive** beside an individual fossil. Each action is one Undo step.

The four methods change real saved offspring:

- **Faithful echo**: preserves the fossil's exact DNA allele and population A/B, planting its descendant near the ancestral site (respecting other living organisms).
- **Ancestral crossover**: grafts 55% ancestral and 45% nearest living organism DNA, with bounded, deterministic mutation tied to the current Mutation Bloodlines strength. It records the living mate's ID.
- **Adaptive comeback**: retains the ancestral gene but searches 20 finite candidate landing sites, balancing current nutrient fitness, space from living neighbors and proximity to ancestral ground. Geological epoch, minerals, and even toxic fossils affect the choice.
- **Kingdom inversion**: inverts the allele (DNA 20 → 80) and swaps population A/B, enabling that population's atmosphere mask so the actual inverted organism is visible.

## Safety and ecology

- **Saved fossil archives stay byte-for-byte unchanged** during every revival.
- The **16 live colony limit** is absolute. Batch revival stops at capacity, rather than deleting or replacing living organisms.
- Each fossil may be revived **once per geological epoch**. A later epoch permits another descendant. This makes multi-century family trees possible without unbounded cloning.
- Revivals receive collision-safe deterministic IDs and keep an explicit ancestral ID, integer DNA, genetic generation, and optional mating partner, all conforming to existing document validation.
- DNA effects and the appropriate A/B painted habitat are activated if necessary, so an extinct population can return visibly without forcing new shaders, textures, CPU animation loops or exports.
- Color palettes, typography, base engine, touch marks, other populations and the historical archive remain untouched.
- Full saved recipe JSON, old projects, PNG/GIF/MP4 rendering and established selection/spore systems use the same existing structures.

## Two Review Repairs

1. **Bury and advance epoch** now increments time even when every organism was already archived or the eight-record archive is full. It never duplicates a buried organism, and stops at the saved 4095-epoch cap. A fully empty world with no living or archival history still does nothing.
2. On a GPU that cannot compile the fossil shader, the renderer may suppress the heavy *graphical fossil layer*. It now chooses preview spore landing coordinates from the canonical saved ecological state—not from the degraded graphical fallback. The displayed temporary daughter and permanently committed offspring therefore share the same ecological landing rule.

## Suggested first experiment

1. Load **Opal Necropolis** (a populated fossil-era Lookbook world).
2. Open **Fossil Record → Resurrection Chamber** and try **Adaptive comeback**. Revive the oldest fossil.
3. Change the mineral substrate or the Apocalypse Clock epoch, then revive another ancestor and compare landing sites.
4. Change to **Ancestral crossover** and raise more, then use **Selection Chamber** to breed the surviving bloodlines.
5. Undo any unwanted revival; none of the original fossils will have disappeared.

## Engineering / verification

- New pure CPU state transition module: `src/ancestral-resurrection.js`.
- Added inspector UI buttons, modes and Find-control synonyms.
- New regression tests: `tests/ancestral-resurrection.test.mjs`, plus expanded fossil regression coverage for geological time and renderer preview parity.
- No new shader material, uniforms, render passes, permissions, third-party dependencies or deployment.
- Actual browser compilation, `npm test`, iPhone Safari stress/performance, and PNG/GIF/MP4 parity must still be verified in a runnable checkout. No claim of a fully tested device build is made in this change set.
