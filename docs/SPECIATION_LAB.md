# Wave 18: Speciation Lab

The existing two painted atmospheres (A/B) now contain persistent rival genetic **clades**. Bloodline identity is saved in the normal recipe and inherited by ordinary spore generations.

- **Branch rival families** creates up to two divergent daughters with deterministic site selection. Niche partition, Chromatic divergence, Adaptive radiation, and Territorial invasion each use different allele targets.
- **Contest territory** is an explicit, undoable, overlapping-rival competition round. Fitness + allele + occupied radius determine relative success. It changes size, never kills or silently removes colonies.
- **Lineage census** lists family, population, fitness and territory.
- Pigmentation, boundaries, movement, and exports use the existing genotype shader and normal renderer. No additional shaders, GPU arrays, storage, or dependencies.
- Limit: 16 live colonies / 4095 generations. Preserves all colors, text, fossils and unrelated settings.

Verify WebGL2 compile, Safari mobile layout and high-resolution GIF/MP4 export parity on an actual iPhone before calling the release fully verified.
