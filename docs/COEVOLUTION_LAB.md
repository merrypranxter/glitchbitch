# Wave 19 — Coevolution Lab

Wave 19 builds on the **Speciation Lab**. Existing saved colony clades can now influence each other's DNA and territory through proximity. It is an **artistic evolutionary model**, not a species-accurate predator ecology or autonomous simulation.

## The four interaction laws

- **Predator-prey**: fitter attackers grow territory and track prey traits; nearby prey lose some area but adapt defensive alleles. Never erases either population.
- **Mimicry**: weaker genetic patterns shift toward the fitter neighboring model, which makes their existing gene-driven boundaries and pigments resemble one another.
- **Defensive arms race**: neighboring lineages push their allele values apart and slightly reinforce territory.
- **Mutualism**: clades converge genetically while sharing a positive growth benefit.

## Controls

In **Effects → Scene → Coevolution Lab**, pick a relationship and strength, then **Stage closest rivals**, **Evolve one encounter**, **Evolve three encounters**, or **Surprise me with coevolution**. Inspect nearby rival relationships via the **Encounter network** disclosure. Each action is one Undo/Redo step.

**One/two/three rounds** change the saved colony alleles, appearance and radius. They do not mutate during playback. Only nearby clades interact; distant colonies require a manual drag or **Stage**.

## Guarantees

- Reuses existing A/B atmospheres, gene-driven shape/pigment, timeline, and still/GIF/MP4 render pipeline.
- No new shader, GPU uniform, offscreen buffer, external dependency, timer, or per-frame CPU simulation.
- Preserves titles, editable text, colors, fossils, genealogy, seed identities, canvas ratio.
- No new colony is created or removed by encounters, and at most 16 living colonies exist.
- State round counter `coevoRound` is saved (0..4095), validates on import, and resets for new ecosystems.
- Weighted ecosystem/full-weird/shuffle may choose a staged coevolution, respecting the no-second-parent choice.

## Verification

Run `npm test` and `npm run build`, then verify mobile WebGL2, screen navigation, saved/loaded state and export parity on iPhone Safari. No deploy is required for this source change.
