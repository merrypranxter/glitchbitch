# SUBSTRATE ALCHEMY — Wave 10

**The canvas becomes a living mineral ecology.** Colonies no longer grow in a completely indifferent environment: an optional resource field changes their actual outlines and the landing sites of their future offspring. Parent A and B can prefer opposite levels of the same resource, producing genuinely different niches and directional selective pressure while keeping everything psychedelic and mathematically editable.

## Five mineral worlds

Choose **Effects → Scene → Substrate Alchemy**:

- **Fractured basalt** — intricate cracks and mineral fissures
- **Nutrient rivers** — branching/curved resource waterways
- **Quartz tesserae** — angular crystal lattice islands
- **Chemical tidepools** — chemical standing waves and luminous pools
- **Petrified mycelium** — wormlike fossil fungal patterns in the rock
- **Bare canvas** — the default, fully disables mineral shading and ecological pressure

Each field is an analytic function of normalized canvas coordinates; visible palette mineral colors shimmer continuously while nutrient resources remain static so selection is repeatable.

Eight controls: mineral visibility, fracture density, mineral shimmer, nutrient pressure, independent parent A/B high-nutrient preference, luminous mineral glow and palette offset. When **Nutrient pressure** is on and a Painted colonies habitat is active, the actual colony edge expands in preferred resource areas and contracts in hostile areas. When no painted colonies are present, the visual geology still works as a gorgeous animated background/underlay.

Controls: **Summon terrain** (apply selected world without resetting art), **Shuffle geology** (change only the mineral habitat), **Colonize rock** (enable and populate parent A on your selected terrain if needed), **Hide substrate** (set amount to zero; maintain all existing art and colonies).

Named presets and Lookbook entries (now **135** fully editable starts):
1. Basalt Blood Vessels
2. Electric Nutrient Delta
3. Opal Fossil Tiles
4. Acid Bath Symbiosis
5. Petrified Spore Network

These new Lookbook designs combine 2 planted atmosphere populations, mutant anatomy, cortex, living growth, spore reproduction and opposing mineral affinities.

## The most important interaction: reproduction now follows resources

The original Spore Dynasties step computed deterministic daughter landing locations with trigonometric dispersal. Wave 10 optionally samples **three nearby candidate locations per spore on the CPU**, scores each candidate against the mineral resource field and its parent A/B preference, and takes the best.

**Rendering and saved offspring now use one authoritative landing calculation.** In every preview/export frame, the renderer computes at most 16 daughter locations into a reused Float32Array(32) and uploads the coordinates as a vec2[16] uniform. The shader uses those same coordinates to draw flying spores and temporary daughter organisms. Clicking **Evolve Generation** uses the same JavaScript `daughterSite()` function to save real editable offspring. There is no divergent GPU-vs-JS selection algorithm and no per-pixel GPU resource search for offspring.

If substrate is disabled or nutrient pressure is zero, `optimizeLandingSite()` returns the original landing site **without change**. Existing Spore Dynasties artwork does not inherit resource bias until you deliberately activate the landscape. Committed generations preserve A/B ownership, seed identities, artist text, palettes, morphology and existing bounds.

This isn't a full agent-based nutrient consumption simulation, and it doesn't pretend to be. It is **continuous analytical growth pressure** and **deterministic fitness-weighted settlement**, both visible and controllable.

## Engineering and compatibility

New module `src/substrate-alchemy.js` exports modes, five presets, pure JavaScript nutrient sampling/selection, JS shuffling and a compact GLSL ES 1.00 module. No FBO, texture, additional uniform textures, WebGL2-only features or paid services.

The fragment shader has two new opt-in hooks:

- `/* SUBSTRATE_MODULE */` defines nutrient/resource sampling and tinting functions only when `substrateAmount>0` AND the selected mode isn't Bare canvas
- `/* SUBSTRATE_POST */` composites the animated mineral bed **before** atmosphere/colony layers, setting the current pixel's resource
- `/* SUBSTRATE_EDGE */` expands/shrinks the painted habitat boundary according to that same pixel resource and each parent's affinity; only inserted in active substrate shaders
- `/* SUBSTRATE_GATE */` expands the local seed radius culling envelope so mineral-driven radial swell doesn't get clipped

The original no-substrate shader contains **none** of the new mineral code or growth pressure; GPU program cache keys distinguish substrate on/off. As with previous waves, the original baseline shape, force brush, lettering, palette renderer and GIF/MP4 encoder are unchanged.

Data: validated `substrateMode`, 8 numeric controls bounded 0..100, defaults to Bare canvas / Amount 0 / Pressure 0. Old documents load unchanged. Normal conservative Mutate leaves dormant geology off. Global Surprise, Shuffle Ecosystem and Freakshow can sample five mineral biomes and parent preferences automatically.

UI: Effects → Scene → Substrate Alchemy, integrated with existing pinned artwork / tabbed inspector.

## QA

New `tests/substrate-alchemy.test.mjs` checks:
- all mineral models vary over the canvas and remain finite
- parent A and B can favor opposing resource levels
- nutrient-biased landing is never worse than the original candidate for the corresponding parent
- saved offspring coordinate equals the CPU position uploaded to GPU
- all legacy states default to geology off
- all five manual presets preserve text, colors, marks and painted seeds
- Surprise and Freakshow safely participate; Mutate remains dormant
- all **135 unique Lookbook documents** validate and serialize/deserialize exactly
- GLSL source gating, 16-daughter uniform buffering, and UI bindings

**Verified:** 9/9 new cases passed in isolated source harness, plus all 135 Lookbook validations and round trips. Two stale test counts in earlier colony-lifecycle and wiggle-stereo test suites were also brought up to 135.

**Not verified here:** complete Node test suite, actual Vite bundle and browser/WebGL shader compile, iPhone Safari GPU FPS, high-resolution preview/export parity. Pull into Google AI Studio and test on an iPhone before any deployment. No Netlify, GitHub Actions, or paid APIs were used.

### Recommended first smoke test

Start from **Electric Nutrient Delta**. Under Substrate Alchemy, set Parent A high-nutrient affinity to 100 and Parent B to 0, pressure around 90. Turn off Substrate Amount and back on to compare the real colony boundary and spore destinations. Then use Evolve Generation and move/erase its permanently planted offspring with Habitat Graffiti.
