# MUTATION BLOODLINES — Wave 12

**Individual organisms now have heritable genes.** The old ecology modeled two parent populations, spore reproduction and genuine spatial symbiosis, but each colony still shared the same shape and pigment response as every other colony in its species. This wave adds actual editable, inherited and mutant *individual* traits without exceeding the existing 16-colony iPhone GPU limit.

## What you can do

Go to **Effects → Scene → Mutation Bloodlines**.

- **Gene expression strength:** display strength for each seed's inherited DNA; DNA changes the shape of that specific colony (ruffled growth, lobes, size) and its pigment response
- **Offspring mutation rate:** controls the size of the deterministic mutation the daughter colony receives
- **Nearby A/B gene recombination:** allows offspring to mix DNA with a nearby opposite-species colony *when their landing area permits contact*
- **Gene-specific pigment glow:** controls colored highlights linked to each organism's allele

Buttons: **Seed this gene pool** (named preset and seed activation), **Shuffle all DNA**, **Mutate existing genes**, **Hide DNA (keep ancestry)**. The four ready-made presets are *Ruffled Dynasties*, *Neon Mendelian Circus*, *Quartz Gene Drift*, and *Darwin's Disco Spore*.

Under **Touch → Habitat Graffiti**, choose any seed in **Selected colony**:
- Set its **Individual DNA allele** directly (0–100)
- Click **Mutate this colony** without changing its siblings, other effects, colors or coordinates
- Inspect its generation, founding/parent identity and optional **second genetic contributor**

Daughters born with **Spore Dynasties → Evolve Generation** inherit their parent's allele, plus a repeatable mutation. If an unrelated colony from the opposite parent population lies near the daughter landing site and crossbreeding is enabled, the daughter's allele incorporates a portion of that nearby colony's allele, dependent on physical distance. The saved descendant has a unique ID, unchanged A/B species ownership, a real parent `ancestor` ID, an optional `mate` donor ID, and a nonnegative `generation` number. The next Evolve Generation uses those descendants as new actual parents, so grandchildren can acquire and pass on further mutations.

Inheritance is a compact single-allele artistic system rather than a molecular DNA engine. There is no claim of realistic Mendelian chromosome separation or genetic simulation beyond the coded inheritance/fitness logic.

## The especially useful GPU trick

**No new 16-gene GPU uniform array.** Existing planted habitat seeds already use a `uniform vec4 habitatStamps[16]` with components (x, y, radius, parent). Parent identity was matched by `abs(stamp.w-parent)<.1`. The new renderer encodes each gene's 0..100 value as a small (0.010..0.085) fractional offset on the fourth component **only when genetics is enabled**. The parent match remains valid because its distance stays below 0.1. In the shader:

- original seed: `stamp.w` stays exactly 0 or 1 and uses the original geometry
- gene carrier: fractional part decodes its individual DNA, producing a unique radial shape deformation and an independent pigment expression
- seed identity/positions/radii in saved documents remain unchanged; the marker encoding exists only in the renderer upload buffer

The genome functions are in `src/colony-genetics.js`. The already-present 16-seed painted habitat loop uses compile-time `/* GENE_MODULE */`, `/* GENE_EDGE */`, `/* GENE_SAMPLE */` and an opt-in `/* GENE_GATE */` to keep mutated outer lobes inside the culling envelope. The parent A and parent B shaders have independent per-pixel dominant allele channels captured from that same loop and tinted after their normal atmosphere compositions.

No second seed pass, shader texture, FBO, CPU frame simulation, external asset, or paid service. This remains one deterministic preview/export shader, meaning its animated gene expression uses the same `time` and `colorTime` as preview and high-resolution PNG/GIF/MP4.

**Old artwork stays clean:** `geneAmount=0` by default; legacy seeds have no `gene`, `generation`, `ancestor` or `mate` property; the source compiler omits the entire gene GLSL source and extra sampling code while off. Normal Mutate never wakes dormant DNA. Touch-planted founders get a deterministic gene only when gene expression is enabled.

## Four new editable Lookbook worlds

Total = **143**:
- **Ruffled Dynasties:** variegated lichen margins and radiant sibling organisms
- **Neon Mendelian Circus:** sharply contrasted alleles inside competing A/B atmosphere populations
- **Quartz Gene Drift:** crystalline colonies, cortical rings and ancestry on mineral plates
- **Darwin's Disco Spore:** reproduction and inherited glowing fringes

All new looks have unique DNA values stored per seed, and use existing substrate, spore, cortex, anatomy, atmosphere and symbiosis systems. The old 139 designs remain byte-for-byte identical under their existing validated recipe states.

## Safeguards and verification

- Four bounded 0..100 sliders, plus optional 0..100 integer per-colony `gene` field
- Optional `generation` integer must be 0..4095; `ancestor` and `mate` must be nonempty IDs no more than 80 characters
- Ordinary, explicitly saved genealogy can outlive its ancestors even if the parent seed is later erased
- Per-colony DNA never changes species affiliation, seeded coordinates, radius, force brush marks, typography or the artist's palette
- At most **16** editable colonies, unchanged from earlier waves. Old recipe serialization and Undo/Redo use the same existing state functions
- Offspring DNA mutations are deterministic from saved gene, seed ID, generation and world seed; repeatable exports do not invoke fresh frame-level randomness
- Surprise, Shuffle Ecosystem and Freakshow now randomly generate heritable gene pools only when the recipe has real planted habitats

New test: `tests/mutation-bloodlines.test.mjs`; all ten existing Lookbook-count regression files updated from 139 to **143**.

**Verified in an isolated JavaScript source harness:** **11/11 new regression groups passed**, including parent/child/grandchild inheritance, second-parent recombination and ancestry, genome mutation boundaries, zero-extra-array encoding, legacy migration, mixed randomizers and typed validation. All **143 unique Lookbook recipes** validated and round-tripped their JSON states identically; script-source syntax passed.

**Not verified in this connector environment:** full `npm test`, Vite build, WebGL GPU shader compilation, performance on iPhone Safari with 16 DNA-bearing colonies + other advanced effects, or pixel-perfect GIF/MP4 preview parity. The compact marker encoding uses high-precision GLSL; verify it on iPhone before any Netlify deployment. No Netlify or GitHub Actions actions or paid APIs were used.

### Suggested first test

In Google AI Studio load **Neon Mendelian Circus**, open **Touch → Habitat Graffiti**, choose one colony and drag **Individual DNA allele** from 0 to 100. The organism's outline and pigment should change while neighbors stay the same. Switch to Spore Dynasties and click **Evolve Generation**. Select a daughter and inspect **Gen 1**, its parent and optional second contributor; keep breeding to see descendants diverge.
