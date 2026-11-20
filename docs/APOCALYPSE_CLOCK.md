# APOCALYPSE CLOCK — Wave 14

The world evolves too. **Geological epochs now change the actual mineral resource field beneath the colonies**, creating new conditions for spore settlement, DNA fitness and survivor breeding. This is a deterministic generative-art model, not a literal biosphere or automatic extinction simulator.

## Five new ecological catastrophes

Open **Effects → Scene → Apocalypse Clock**:

- **Crystal winter:** glacial banded nutrient starvation and frozen opal-looking radiance
- **Acid monsoon:** corrosive chemical waves that invert nutrient conditions
- **Solar flare:** alternating desiccated regions and glowing survival windows
- **Tectonic rupture:** fresh geometric fissures that restructure useful mineral pathways
- **Radiation garden:** concentric rings of new environmental variation around a changing center

Six controls, all 0–100: Cataclysm visibility, Disaster texture density, animated Heat/Rain/Mineral shimmer, **Ecological shock intensity**, ionized mineral radiance, and palette pigment offset. The currently saved integer **epoch** is displayed (0..4095).

Buttons:
1. **Summon catastrophe** — apply a selected named geological specimen, keep existing seeds, text, palette and genetics; activate a mineral substrate only when one is missing
2. **Shuffle disasters** — reroll catastrophe type, intensity, spatial texture, pigment and a small seeded starting epoch without touching artist placement
3. **Advance epoch** — change the saved geological epoch by one; this reshapes the static nutrient resource field, which in turn changes selection rankings, per-pixel adaptation and prospective offspring landing sites, but **does not move, kill or automatically breed any colony**
4. **Epoch + selection cycle (confirm)** — after confirmation, advance the epoch, cull weak organisms under existing Selection Chamber rules (preserving one of each present population) and breed fitter descendants as **one undoable action**
5. **Hide catastrophe (keep history)** — disable the geological shock and visual effect without erasing saved epoch, genomes, offspring or artist design

The API implementation is `src/apocalypse-clock.js` (pure state transformations, static shock fields and GLSL ES 1.00 rendering). `apocalypseEpoch` is stored as a validated integer; no animation frame advances it. Shimmer is time-continuous, but the **chemistry is static within an epoch**. This matters for exact PDF/PNG/GIF/MP4 reconstruction and correct saved spore landings.

## The physical coupling

The previous `substrateResourceAt(state,x,y)` returns the mineral resource strength in [0,1]. When the catastrophe is active, this function passes its base resource through `apocalypseResource(state,x,y,base)`. The GPU's `substrateResource(uv)` uses the **same analytic transformation** (five cases with matched geometry, epoch phase and strength), via a compile-time resource hook. The transformed per-pixel substrate resource drives:

- the mineral rendering itself (before atmosphere and colonies)
- parent A/B growth preferences and each genome's **Selection Chamber adaptive fitness**, which affects actual colony radius and glow
- fitness ranking and survival/culling actions sampled at each colony center
- `daughterSite` selecting the best nearby static nutrient site for animated spore flight and future **Evolve Generation**
- `breedFittest` selection, location and permanent genealogical offspring

All of this remains spatially meaningful. No fake global texture overlay is substituted for an actual food/resource field.

**No spontaneous extinction:** ordinary animation can show glowing ion storms but never deletes colonies or mutates the saved epoch or document. Any destructive selection step asks for confirmation, is undoable, and preserves at least one individual of each existing species.

## Five new Lookbook worlds — 152 total

- **Cryogenic Opal Graveyard**
- **Acid Monsoon Cathedral**
- **Solar Flare Carapace**
- **Tectonic Mycelium Rift**
- **Radiation Garden Rebirth**

Each is a complete editable recipe with real mineral nutrients, A/B populations, individually stored genes, actual adaptive selection and optional spores, cortical structures or symbiosis. Five preset catastrophes produce different ecological mathematics, not just recolors.

## Mobile compatibility

No paid APIs, network calls, new buffers or offscreen render passes. The existing habitat shader and 16-seed cap are unchanged. A single compact apocalypse shader module is inserted **only** when both `apocalypseAmount>0` and a real visible substrate is enabled. The renderer's program cache key separates apocalypse-on/off. With the effect off, the original substrate source returns `n` unchanged. With it on, it returns `apocalypseResource(uv,n)`; no other module performs duplicate ecological selection.

The ecology uses normalized saved state with integer epoch and continuous `time/colorTime` pigments. Preview and export share the same shader assembly, but actual browser GPU compilation and pixel parity have not been verified in this connector environment.

Global **Surprise**, **Shuffle Ecosystem** and **Freakshow** can now summon catastrophes on real mineral landscapes. Ordinary conservative **Mutate** never wakes a dormant catastrophe.

## QA and limitations

New `tests/apocalypse-clock.test.mjs` passes **10/10 isolated JavaScript source regression groups**. All **152 unique Lookbook recipes validate and round-trip exactly**, including the five new epoched worlds. Previous legacy count tests were brought up to 152. Checks include valid finite static resource fields, exact original chemistry with apocalypse off, epoch changes without modifying seeds, changed spore landing with epoch, full save/reload and shader source gating.

**Not verified:** complete local `npm test`, actual Vite compilation, GLSL shader compiler on iPhone Safari, performance with all heavyweight effects, or high-resolution GIF/MP4 pixel-by-pixel parity. Test in Google AI Studio before any paid Netlify deployment.

### Recommended first playtest

Open **Acid Monsoon Cathedral** from Lookbook. Go to **Effects → Scene → Apocalypse Clock**, set Ecological Shock Intensity to 95, then use **Advance Epoch** a few times. Expand **Selection Chamber → Fitness scoreboard** to see which organisms become better adapted, then choose **Breed the Fittest** or a confirmed **Epoch + Selection Cycle**. Disable Apocalypse Amount to restore baseline nutrient geometry and compare the resulting colony silhouettes.
