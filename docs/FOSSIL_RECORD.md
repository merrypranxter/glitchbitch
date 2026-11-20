# FOSSIL RECORD — Wave 15

**The alien ecosystem finally has a past.** Earlier waves made living colonies, mutations, offspring, resource-dependent survival, and discrete ecological catastrophes. Now individual organisms can leave permanent **archival impressions** that affect the nutrient field experienced by future generations.

The artistic purpose is stratigraphic, psychedelic and ecological: fluorescent fossil beds, opalescent anatomical ghosts, buried fungal families, chemical scars, and geology with actual inherited memory. It is not a biological paleontology simulator.

## Five different histories

Open **Effects → Scene → Fossil Record**:

- **Ancestral compost:** past organisms enrich the mineral nutrients near their original sites.
- **Toxic reliquary:** former colonies create barren, corrosive scars where future organisms struggle.
- **Opal reliquary:** the *archived individual DNA allele* governs whether its deposit enriches or depletes local nutrient conditions.
- **Ghost mycelium:** fossils from population A make favorable residue while those from B produce opposing depleted patches.
- **Stratigraphic mirror:** ancient deposits locally invert the existing nutrient field, so future populations can find a niche where their ancestors could not.

Each has six 0–100 controls: Fossil Visibility, Nutrient Residue Depth, Stratigraphic Shimmer, Ghost Phosphor Glow, Historical Pigment Offset and Percentage of Living Seeds to Archive.

Each archival record stores a bounded **unique record ID, originating live colony ID, original normalized coordinates and radius, A/B species affiliation, individual DNA allele and geological epoch**. Fossils are not just copies of the current active colony pixels: they retain this metadata even if the original live colony is moved or eventually removed.

The historical archive has a **hard cap of eight** compact impressions, separate from the existing sixteen **living** colony seeds. At capacity the app does not evict earlier history. Clearing the archive is an explicit, confirmed and undoable choice.

### Buttons and behavior

- **Summon fossils:** choose a named relic preset, make sure the geology is active, and archive eligible current organisms. Preserves the existing live colonies, colors, text and genetics.
- **Shuffle ancient chemistry:** change the fossil behavior and visual pigment while preserving all historical records and living organisms.
- **Archive this generation:** save several current living organisms into the fossil archive, alternating A/B families for balanced source material. It does not delete or move the sources. A specific organism is never duplicated in the *same* epoch.
- **Bury and advance epoch:** add archival impressions and advance the saved geological epoch in one Undo action. Existing live seeds remain where they are.
- **Hide fossils (keep record):** disable fossil nutrient effects and shading without altering either the archive or future ancestry.
- **Clear fossil archive (confirm):** clear just the saved fossil records, with confirmation and Undo. The living species are not touched.

The collapsed **Geological archive** inspector lists each record's original source, population, DNA, and epoch so archaeological history is visible and understandable.

## The mathematics is functional, not merely decorative

Previously `substrateResourceAt(state,x,y)` combined mineral geology with the explicit Apocalypse Clock's epoch transform.

It now passes that result through `fossilResourceAt(state,x,y,base)`. Every archived impression contributes a smooth radial influence near its original location. Its contribution decays with **`1/(1+age*0.24)`**, where age is the number of geological epochs since burial. The deposit's polarity depends on one of the five modes; the Opal Reliquary mode uses the exact individual's saved DNA rather than a random pigment.

The same ecological resource is consumed by:

1. **Selection Chamber** — inherited genetic fitness, actual animated growth margins, survival glow and ordered ranking of living colonies
2. **Spore Dynasties** — CPU-chosen daughter landing locations and permanent, editable offspring produced by Evolve Generation
3. **Natural selection actions** — which living organisms are best suited to grow and reproduce under the historically modified geology
4. **Mineral visualization** — old impressions become luminous layered strata under living atmosphere colonies

These influence fertility and structure *only through the existing shared resource function*; there is no second inconsistent copy of the nutrient simulator.

### GPU implementation

The source module `src/fossil-record.js` includes a pure deterministic CPU ecological transform and a compact GLSL ES 1.00 historical shader.

A single `uniform vec4 fossilStamps[8]` stores each imprint's (x, y, radius, compact marker). The marker's **sign** encodes species A/B, its integer part encodes the archived epoch, and its fractional part encodes the ancestor's saved gene. The archived records preserve their ordinary explicit fields in JSON; packing only happens at GPU upload.

When fossil memory is active, the existing **substrate resource function** is specialized to:
`fossilResource(uv, apocalypseResource(uv, baseResource))` (with inactive layers omitted). It updates both the per-pixel nutrient field and a fluorescent fossil material which is composited *behind* living colony atmospheres. Animation is only in the visual shimmer; saved nutrient resources remain static until an explicit epoch action.

**When fossil memory is dormant, archive empty, or substrate absent:** no `fossilStamps[8]` shader uniform, no new eight-record loop, no fossil post effect, and no additional GPU program work. Program cache keys distinguish optional fossil material from original artwork.

**iPhone GPU safety:** if an unusually heavy shader combination fails to compile, the progressive fallback disables **only fossilAmount** before sacrificing expensive habitat/atmosphere layers. The renderer then uses that successfully compiled state for CPU spore landing, avoiding hidden fossil-dependent trajectories in a scene where fossils were disabled by the GPU driver. This is a safety measure, not a substitute for real mobile QA.

No new texture, framebuffer/FBO, per-frame CPU simulation, paid service, server state, external API, export encoder, font, or deployment action.

## New editable Lookbook worlds

Five new curated and genealogically populated designs raise the Lookbook to **157**:

1. **Ancestral Compost Cathedral** — fluorescent ancestral nutrient beds
2. **Toxic Time Capsule** — dangerous chemical history embedded in volcanic rock
3. **Opal Necropolis** — ancient opalescent DNA-specific mineral relics
4. **Ghost Roots of Atlantis** — opposing ancient species leaving bright/dark resource regions
5. **Stratigraphic Time Machine** — repeated epochs reverse old mineral ecological preferences

Each contains four to six genuinely archived historical records alongside eight to twelve **living, editable, separately stored colonies**, plus appropriate preconfigured anatomy, gene expression, selection, spores, symbiosis and mineral ecology.

The same five names are available as manual fossil material presets.

## Randomization and save safety

- **Surprise / Shuffle Ecosystem:** may opt into buried historical colonies when real minerals and planted organisms exist. The color/pigment controls follow the existing user palette and design.
- **Full Weird Shuffle:** honors the existing **Allow extra heavyweight GPU combinations** checkbox. With that checkbox off, it generates **no fossil shader or archive**. This avoids silently increasing iPhone workload.
- **Mutate:** never activates fossil rendering on old artwork. A user can deliberately mutate an already-awake fossil material.
- **Save/Load:** validates every record (unique ID, origin, geometry, species, gene and integer epoch 0..4095). Old documents without fossil fields migrate to `fossilMode:"Dormant"`, `fossilAmount:0` and an empty archive. The original saved populations, typography and palette are unchanged.

## Verification and browser QA

New tests `tests/fossil-record.test.mjs` exercise archival preservation, old state compatibility, exact package/unpackage of 8-slot genomic epoch markers, hard cap and duplicate prevention, five distinct nutrient effects, time decay, actual survival and daughter settlement consequences, pure manual interactions, smart shuffle participation, invalid-record rejection, optional shader assembly and fallback, UI and save round trips.

**Verified in isolated JavaScript source harness:** **13/13 regression groups passed** following a fixed RNG adapter bug. All **157 unique Lookbook recipes** validated and returned identical structured state after save/reload. JavaScript source syntax checks passed. Tests also cover that disabling fossil memory restores baseline resource chemistry exactly.

**Still not verified here:** complete local `npm test`, actual Vite React bundle, GLSL hardware shader compilation, frame rates on iPhone Safari with maximum modules, GIF/MP4 high-resolution pixel parity and full browser interaction. Pull this branch into Google AI Studio and test on a real iPhone before spending Netlify credits.

### Suggested first experiment

Select **Opal Necropolis**, open the Fossil Record inspector, and read the archived genetic alleles. Switch between **Opal reliquary**, **Ancestral compost** and **Toxic reliquary**, then inspect how the Selection Chamber's fitness scoreboard changes. Use **Bury and advance epoch** to add the current living organisms as a new layer. Keep evolving offspring; the descendants are now growing in a landscape changed by their ancestors.

The game is no longer merely about survival today; the previous generation changes the mathematics of the next one.
