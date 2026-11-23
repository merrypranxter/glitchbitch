# Effects control inventory and architecture audit

Baseline: `cc8d06e` (latest main when inspected; includes G₂ Torsion Membranes). This inventory records the existing UI before navigation changes. No renderer or recipe schema is changed by the rearchitecture.

## Findings

- Effects contained **36 indexed entries**: 35 collapsible sections and one three-switch quick strip. Five broad filters still defaulted to All, leaving a long succession of drawers.
- Scene mixed composition, ecosystems, genetics, geology, archives and action-only laboratories; users needed to remember implementation history to locate a tool.
- Filament Forge alone contained most of the textile instrument, including several nested disclosures. A single section search hit could not distinguish materials, optics, nervous systems or temporal stitching.
- Find already had a global metadata index and reveal events, but changed Effects to All when jumping across filters. This restored the very long list and did not open nested details.
- The On filter used truthiness of parameter keys. Dormant ecology with stored tuning, historical encounter counters, and quick switches could be represented incorrectly or omitted.
- Existing controls already share state/history helpers; moving their React bodies is preferable to rebuilding controls or touching numerical ranges.

## State, presets, renderer and navigation boundaries

`Parameter` reads `history.state[name]` and `numericRanges[name]`, begins a history transaction on interaction, previews values, and ends/cancels it with the existing handlers. `Switch` and action buttons use `history.change`. `Select` handlers deliberately sometimes awaken prerequisite systems. These behaviors must remain verbatim. Preset selection alone is often local UI state; apply buttons call the existing pure preset functions and commit one undoable change.

`Section` uses `ui-index.js` for titles, hints, activity keys and reset keys. Reset copies only listed keys from `initial`; fossil and succession archive resets have meaningful historical consequences and must retain the original key lists. Disclosure memory (`glitch-sections-v2`), Effects filters and new favorites belong to UI preference storage, never artwork recipes.

`renderer.js` specializes effects using amount and mode gates. Biology uses the existing Gray–Scott resources. Frame memory is a distinct previous-frame feedback pass. Schlieren samples the composed image. Ecological helpers such as `geneEnabled`, `selectionActive`, `apocalypseActive`, `fossilEnabled`, `successionEnabled` and `foodWebActive` encode real prerequisites and should supply activity status instead of slider truthiness.

Math contains Engine, G₂, shader crossbreeding, living velvet, crochet, dissolution, complex poles, hexagram terrain, shape and motion. They remain in Math. Color owns palettes, color stops/motion and grading. Text uses its own Font/Color/Layout/Motion/Blend/Recipes panes. Layers owns engine blending and composition masks. Touch owns paint tools, habitat seeds and forces. Export owns PNG/GIF/MP4 and diagnostic tools. Global search must keep reaching all of these.

The canvas/control divider and canvas gestures are owned outside the Effects inspector. Navigation should scroll only the inspector, preserve canvas sizing, and keep the existing rendering/undo objects.

## Semantic organization

A flat family level plus direct effect selection gives future additions a clear place without deep navigation. Suggested families: Signal; Materials & Textiles; Light & Optics; Space & Depth; Living Colonies; Evolution; Worlds & Memory. Chaos Lab is an action desk, useful as a direct launch point. Some cross-cutting tools merit search synonyms rather than duplicates (Schlieren is optics although formerly Texture; Bio rot is biology although formerly Texture; fossils connect memory, geology and genetics). The implemented category names may be shorter for touch layouts.

## Complete original control inventory

Tables preserve the original labels and underlying bindings. `s.foo` values are artwork state; unprefixed recipe/intensity variables are component UI state applied by explicit actions. Actions and nested drawers are also listed. Conditional controls remain available under their original prerequisite settings.

### Bloom · Posterize · Invert (`fx-toggles`)

Post-processing switches for phosphor bloom, palette quantization and image inversion.

Original family: **Glitch**. Activity keys: none. Reset keys: none.

| Control | Binding |
| --- | --- |
| Bloom | `bloom` |
| Posterize | `posterize` |
| Invert | `invert` |

### Signal break (`signal`)

RGB channel separation, scanline drift, rectangular corruption and pixel quantization.

Original family: **Glitch**. Activity keys: `split`, `glitch`, `block`, `pixel`. Reset keys: `split`, `glitch`, `block`, `pixel`.

| Control | Type | Original binding |
| --- | --- | --- |
| Chromatic split | Parameter | `split` |
| Signal drift | Parameter | `glitch` |
| Block corruption | Parameter | `block` |
| Pixelation | Parameter | `pixel` |

### Analog (`analog`)

Scanlines, film grain and edge vignette.

Original family: **Glitch**. Activity keys: `scan`, `grain`, `vignette`. Reset keys: `scan`, `grain`, `vignette`.

| Control | Type | Original binding |
| --- | --- | --- |
| Scanlines | Parameter | `scan` |
| Film grain | Parameter | `grain` |
| Vignette | Parameter | `vignette` |

### CRT screen (`screen`)

CRT subpixel structure and broadcast color bars.

Original family: **Glitch**. Activity keys: `phosphor`, `broadcast`. Reset keys: `phosphor`, `broadcast`.

| Control | Type | Original binding |
| --- | --- | --- |
| Phosphor subpixels | Parameter | `phosphor` |
| Broadcast bars | Parameter | `broadcast` |

### Print damage (`print`)

Bayer dithering, CMY/Riso plate treatment and plate misregistration.

Original family: **Glitch**. Activity keys: `dither`, `riso`, `misregister`. Reset keys: `dither`, `riso`, `misregister`.

| Control | Type | Original binding |
| --- | --- | --- |
| Bayer dither | Parameter | `dither` |
| CMY risograph | Parameter | `riso` |
| Ink misregistration | Parameter | `misregister` |

### Print & Spectrum Injury (`print-injury`)

Four animated print/color laws: XOR dither, caustic ink erosion, hypercolor burn, spectral fracture.

Original family: **Glitch**. Activity keys: `injuryAmount`. Reset keys: `injuryMode`, `injuryAmount`, `injuryScale`, `injuryMotion`, `injurySeparation`, `injuryGrain`, `injuryGlow`, `injuryVariation`, `injuryPalette`.

| Control | Type | Original binding |
| --- | --- | --- |
| Print mutation | Select | `s.injuryMode` |
| Presence | Parameter | `injuryAmount` |
| Spatial frequency | Parameter | `injuryScale` |
| Motion | Parameter | `injuryMotion` |
| Color separation | Parameter | `injurySeparation` |
| Dot grain / damage | Parameter | `injuryGrain` |
| Neon / white glow | Parameter | `injuryGlow` |
| Variation | Parameter | `injuryVariation` |
| Use my current palette | Switch | `injuryPalette` |
| Instant print mutation | Select | `injuryPreset` |

Actions: Summon print mutation; Shuffle print injury; Shuffle extreme damage; Hide print injury.

### Frame memory (`memory`)

Previous-frame GPU feedback: trails and datamosh with decay and spatial drift. Distinct from analytic time effects.

Original family: **Glitch**. Activity keys: `afterimage`, `datamosh`. Reset keys: `afterimage`, `datamosh`, `memoryDrift`, `memoryDecay`.

| Control | Type | Original binding |
| --- | --- | --- |
| Afterimage | Parameter | `afterimage` |
| Datamosh | Parameter | `datamosh` |
| Drift | Parameter | `memoryDrift` |
| Decay | Parameter | `memoryDecay` |

### Old web (`oldweb`)

Cascading error windows and glitter/starbursts.

Original family: **Glitch**. Activity keys: `windowCascade`, `glitter`. Reset keys: `windowCascade`, `glitter`.

| Control | Type | Original binding |
| --- | --- | --- |
| Error windows | Parameter | `windowCascade` |
| Glitter explosions | Parameter | `glitter` |

### Microtexture (`micro`)

Sixteen animated microscopic surface patterns, including optical dust, cilia, sequins and contaminants.

Original family: **Texture**. Activity keys: `microAmount`. Reset keys: `microMode`, `microAmount`, `microScale`, `microMotion`, `microRelief`, `microDensity`, `microHue`, `microVariation`.

| Control | Type | Original binding |
| --- | --- | --- |
| Microscopic species | Select | `s.microMode` |
| Presence | Parameter | `microAmount` |
| Scale | Parameter | `microScale` |
| Motion | Parameter | `microMotion` |
| Relief | Parameter | `microRelief` |
| Density | Parameter | `microDensity` |
| Color shift | Parameter | `microHue` |
| Variation | Parameter | `microVariation` |
| Instant microtexture | Select | `microPreset` |

Actions: Spawn microtexture; Shuffle microtextures; Shuffle new contaminants; Hide microtexture; Reseed texture.

### Substance (`substance`)

Twelve analytic animated material systems, with relief and edge color: oil membranes, cartilage, foam and mutant tissue.

Original family: **Texture**. Activity keys: `substanceAmount`. Reset keys: `substanceMode`, `substanceAmount`, `substanceScale`, `substanceMotion`, `substanceRelief`, `substanceEdge`, `substanceHue`, `substanceVariation`.

| Control | Type | Original binding |
| --- | --- | --- |
| Living material | Select | `s.substanceMode` |
| Strength | Parameter | `substanceAmount` |
| Cell scale | Parameter | `substanceScale` |
| Motion | Parameter | `substanceMotion` |
| Relief | Parameter | `substanceRelief` |
| Edge glow | Parameter | `substanceEdge` |
| Palette shift | Parameter | `substanceHue` |
| Variation | Parameter | `substanceVariation` |
| Instant living material | Select | `substancePreset` |

Actions: Spawn selected material; Shuffle substances; Shuffle mutant matter; Hide substance; Reseed substance.

### Schlieren Refractive Glass (`schlieren`)

Post-composite refraction actually samples/displaces the current artwork pixels; not merely a translucent overlay.

Original family: **Texture**. Activity keys: `schlierenAmount`. Reset keys: `schlierenMode`, `schlierenAmount`, `schlierenScale`, `schlierenBend`, `schlierenMotion`, `schlierenDispersion`, `schlierenRim`, `schlierenRipple`, `schlierenVariation`, `schlierenMask`, `schlierenFocus`.

| Control | Type | Original binding |
| --- | --- | --- |
| Glass structure | Select | `s.schlierenMode` |
| Glass presence | Parameter | `schlierenAmount` |
| Lens scale | Parameter | `schlierenScale` |
| Actual pixel refraction | Parameter | `schlierenBend` |
| Lens movement | Parameter | `schlierenMotion` |
| Spectral dispersion | Parameter | `schlierenDispersion` |
| Glass edge lighting | Parameter | `schlierenRim` |
| Heat-ripple | Parameter | `schlierenRipple` |
| Pattern variation | Parameter | `schlierenVariation` |
| Glass coverage | Parameter | `schlierenMask` |
| Lens focus | Parameter | `schlierenFocus` |
| Glass recipe | Select | `schlierenPreset` |

Actions: Apply refractive glass; Shuffle refractive glass; Hide glass.

### Prism foil (`foil`)

Thin-film interference, opal/dichroic optical coating and relief highlights.

Original family: **Texture**. Activity keys: `filmAmount`, `opalAmount`, `prismAmount`, `foilRelief`. Reset keys: `filmAmount`, `filmThickness`, `opalAmount`, `prismAmount`, `foilRelief`, `foilMotion`.

| Control | Type | Original binding |
| --- | --- | --- |
| Thin-film rainbow | Parameter | `filmAmount` |
| Film thickness | Parameter | `filmThickness` |
| Opal flashes | Parameter | `opalAmount` |
| Dichroic prism | Parameter | `prismAmount` |
| Relief highlights | Parameter | `foilRelief` |
| Animation | Parameter | `foilMotion` |

### Bio rot (`bio`)

Real Gray–Scott reaction-diffusion overlay, using the existing biology engine and eight feed/kill regimes.

Original family: **Texture**. Activity keys: `bioAmount`. Reset keys: `bioAmount`, `bioFeed`, `bioKill`, `bioSpeed`, `bioVeins`.

| Control | Type | Original binding |
| --- | --- | --- |
| Petri-dish growth recipe | Select | `bioRotPreset` |
| Organism | Parameter | `bioAmount` |
| Feed | Parameter | `bioFeed` |
| Kill | Parameter | `bioKill` |
| Growth speed | Parameter | `bioSpeed` |
| Veins | Parameter | `bioVeins` |

Actions: Cultivate selected growth; Shuffle the petri dish; Hide bio overlay.

### Living underlay (`underlay`)

Sixteen animated woven grounds; independent of filament top-work.

Original family: **Texture**. Activity keys: `underlayAmount`. Reset keys: `underlayMode`, `underlayAmount`, `underlayScale`, `underlayDensity`, `underlayMotion`, `underlayRelief`, `underlayHue`, `underlayContrast`, `underlayVariation`.

| Control | Type | Original binding |
| --- | --- | --- |
| Fabric ground | Select | `s.underlayMode` |
| Underlay presence | Parameter | `underlayAmount` |
| Fabric pattern scale | Parameter | `underlayScale` |
| Weave / pile density | Parameter | `underlayDensity` |
| Fabric motion | Parameter | `underlayMotion` |
| Fiber relief and sheen | Parameter | `underlayRelief` |
| Palette hue offset | Parameter | `underlayHue` |
| Yarn contrast | Parameter | `underlayContrast` |
| Pattern variation | Parameter | `underlayVariation` |
| Instant fabric | Select | `underlayPreset` |

Actions: Weave this ground; New fabric; Shuffle textile grounds; Shuffle haunted fabrics; Reseed ground; Hide underlay.

### Filament forge (`filament`)

A full textile instrument: 24 thread geometries, two-parent crossbreeding, 33 stitch laws, 14 fiber materials, independent optical coats, jewelry, metamorphosis, contagion, neural/plastic/scar/regeneration systems, and sculpted relief. Most behavior is deterministic analytic math on the normal animation clock.

Original family: **Texture**. Activity keys: `filamentAmount`. Reset keys: `filamentSpecies`, `filamentAmount`, `filamentScale`, `filamentDensity`, `filamentMotion`, `filamentWidth`, `filamentRelief`, `filamentHue`, `filamentVariation`, `filamentFeralCorruption`, `filamentFeralMigration`, `filamentFeralOrder`, `filamentFeralKnots`, `filamentFeralMutation`, `filamentQuasiSpacing`, `filamentQuasiPhason`, `filamentQuasiDrift`, `filamentQuasiRelief`, `filamentQuasiElevation`, `filamentQuasiOrnament`, `semanticGravityMode`, `semanticGravityAmount`, `semanticGravityRadius`, `semanticGravityFalloff`, `semanticGravitySwirl`, `semanticGravityPulse`, `semanticGravityVariation`, `filamentSecondSpecies`, `filamentCrossbreed`, `filamentInterlace`, `filamentTwist`, `filamentPhase`, `filamentMaterial`, `filamentSecondMaterial`, `filamentNap`, `filamentLuster`, `filamentBeads`, `filamentBeadSize`, `filamentSecondHue`, `filamentOpticsMode`, `filamentOpticsAmount`, `filamentOpticsThickness`, `filamentOpticsDispersion`, `filamentOpticsAnisotropy`, `filamentOpticsCurvature`, `filamentOpticsPearl`, `filamentOpticsPhase`, `filamentSecondOpticsMode`, `filamentSecondOpticsAmount`, `filamentSecondOpticsThickness`, `filamentSecondOpticsDispersion`, `filamentSecondOpticsAnisotropy`, `filamentSecondOpticsCurvature`, `filamentSecondOpticsPearl`, `filamentSecondOpticsPhase`, `filamentAdornmentMode`, `filamentSecondAdornmentMode`, `filamentMorphMode`, `filamentMorphTarget`, `filamentSecondMorphTarget`, `filamentMorphAmount`, `filamentMorphScale`, `filamentMorphSpeed`, `filamentMorphSharpness`, `filamentMorphGlow`, `filamentContagionMode`, `filamentContagionAmount`, `filamentContagionReach`, `filamentContagionSpeed`, `filamentContagionLag`, `filamentContagionGlow`, `filamentNeuralMode`, `filamentNeuralAmount`, `filamentNeuralSpeed`, `filamentNeuralCoupling`, `filamentNeuralThreshold`, `filamentNeuralGlow`, `filamentPlasticMode`, `filamentPlasticAmount`, `filamentPlasticRate`, `filamentPlasticInhibition`, `filamentPlasticRetention`, `filamentPlasticGlow`, `filamentScarMode`, `filamentScarAmount`, `filamentScarDensity`, `filamentScarPersistence`, `filamentScarRoughness`, `filamentScarGlow`, `filamentRegenMode`, `filamentRegenAmount`, `filamentRegenBranches`, `filamentRegenSpeed`, `filamentRegenHealing`, `filamentRegenGlow`, `filamentAdornmentAmount`, `filamentAdornmentSpacing`, `filamentAdornmentSize`, `filamentAdornmentMotion`, `filamentAdornmentGlow`, `filamentStitchMode`, `filamentStitchAmount`, `filamentStitchSpeed`, `filamentStitchLength`, `filamentStitchGlow`, `filamentChladniOrder`, `filamentChladniResonance`, `filamentChladniDensity`, `filamentChladniPhase`, `filamentChladniDetune`, `filamentRetroLead`, `filamentRetroEcho`, `filamentRetroParadox`, `filamentRetroKnots`, `filamentRetroReversal`, `filamentRetroCoherence`, `filamentSculptMode`, `filamentSculptAmount`, `filamentSculptDepth`, `filamentSculptLight`, `filamentSculptShadow`, `filamentSculptPuff`.

| Control | Type | Original binding |
| --- | --- | --- |
| Thread geometry | Select | `s.filamentSpecies` |
| Thread presence | Parameter | `filamentAmount` |
| Pattern scale | Parameter | `filamentScale` |
| Stitch density | Parameter | `filamentDensity` |
| Living motion | Parameter | `filamentMotion` |
| Thread thickness | Parameter | `filamentWidth` |
| Raised relief / sheen | Parameter | `filamentRelief` |
| Palette shift | Parameter | `filamentHue` |
| Variation | Parameter | `filamentVariation` |
| Semantic force law | Select | `s.semanticGravityMode` |
| Word gravitational strength | Parameter | `semanticGravityAmount` |
| Text influence radius | Parameter | `semanticGravityRadius` |
| Influence falloff / sharpness | Parameter | `semanticGravityFalloff` |
| Orbit and shear swirl | Parameter | `semanticGravitySwirl` |
| Time-varying pull | Parameter | `semanticGravityPulse` |
| Nonlinear textile variation | Parameter | `semanticGravityVariation` |
| Word-warped textile specimen | Select | `semanticPreset` |
| Quasicrystal embroidery specimen | Select | `quasiPreset` |
| Pentagrid line spacing | Parameter | `filamentQuasiSpacing` |
| Phason offset / pattern identity | Parameter | `filamentQuasiPhason` |
| Phason drift / living motion | Parameter | `filamentQuasiDrift` |
| Embroidered raised relief | Parameter | `filamentQuasiRelief` |
| Thread elevation / crown sheen | Parameter | `filamentQuasiElevation` |
| Star-point collar ornaments | Parameter | `filamentQuasiOrnament` |
| Jacquard structure recipe | Select | `feralPreset` |
| Controlled corruption | Parameter | `filamentFeralCorruption` |
| Warp / weft migration | Parameter | `filamentFeralMigration` |
| Structural order / interlace | Parameter | `filamentFeralOrder` |
| Knot population | Parameter | `filamentFeralKnots` |
| Mutational branching | Parameter | `filamentFeralMutation` |
| Filament sculpture preset | Select | `filamentPreset` |
| Sculpted thread style | Select | `s.filamentSculptMode` |
| Tactile relief presence | Parameter | `filamentSculptAmount` |
| Thread height / depth | Parameter | `filamentSculptDepth` |
| Light direction | Parameter | `filamentSculptLight` |
| Soft border shadows | Parameter | `filamentSculptShadow` |
| Rounded / pillowy crown | Parameter | `filamentSculptPuff` |
| Sculpted fiber recipe | Select | `sculptPreset` |
| Stitch motion | Select | `s.filamentStitchMode` |
| Self-weaving presence | Parameter | `filamentStitchAmount` |
| Stitch travel speed | Parameter | `filamentStitchSpeed` |
| Stitch tail length / spacing | Parameter | `filamentStitchLength` |
| Traveling needle glow | Parameter | `filamentStitchGlow` |
| Needle orchestra score | Select | `chladniPreset` |
| Eigenmode / overtone order | Parameter | `filamentChladniOrder` |
| Resonance / oscillation | Parameter | `filamentChladniResonance` |
| Nodal needle density | Parameter | `filamentChladniDensity` |
| Coupled phase | Parameter | `filamentChladniPhase` |
| Detune / broken symmetry | Parameter | `filamentChladniDetune` |
| Temporal embroidery score | Select | `retroPreset` |
| Needle future lookahead | Parameter | `filamentRetroLead` |
| Pre-echo ghost stitches | Parameter | `filamentRetroEcho` |
| Paradox seam crossings | Parameter | `filamentRetroParadox` |
| Knots tied before arrival | Parameter | `filamentRetroKnots` |
| Reverse-time stitch wave | Parameter | `filamentRetroReversal` |
| Seam coherence / softness | Parameter | `filamentRetroCoherence` |
| Self-weaving recipe | Select | `stitchPreset` |
| First parent fiber material | Select | `s.filamentMaterial` |
| Second parent fiber material | Select | `s.filamentSecondMaterial` |
| Fuzzy fiber nap | Parameter | `filamentNap` |
| Specular luster / shine | Parameter | `filamentLuster` |
| Seed bead presence | Parameter | `filamentBeads` |
| Seed bead size / spacing | Parameter | `filamentBeadSize` |
| Second parent color offset | Parameter | `filamentSecondHue` |
| Material recipe | Select | `materialPreset` |
| Structural-color twin-fiber recipe | Select | `opticsPreset` |
| First parent optical law | Select | `s.filamentOpticsMode` |
| First fiber structural-color strength | Parameter | `filamentOpticsAmount` |
| First fiber film thickness | Parameter | `filamentOpticsThickness` |
| First fiber dispersion | Parameter | `filamentOpticsDispersion` |
| First fiber optical anisotropy | Parameter | `filamentOpticsAnisotropy` |
| First fiber curvature response | Parameter | `filamentOpticsCurvature` |
| First fiber pearlescent layer | Parameter | `filamentOpticsPearl` |
| First fiber spectral phase | Parameter | `filamentOpticsPhase` |
| Second parent optical law | Select | `s.filamentSecondOpticsMode` |
| Second fiber structural-color strength | Parameter | `filamentSecondOpticsAmount` |
| Second fiber film thickness | Parameter | `filamentSecondOpticsThickness` |
| Second fiber dispersion | Parameter | `filamentSecondOpticsDispersion` |
| Second fiber optical anisotropy | Parameter | `filamentSecondOpticsAnisotropy` |
| Second fiber curvature response | Parameter | `filamentSecondOpticsCurvature` |
| Second fiber pearlescent layer | Parameter | `filamentSecondOpticsPearl` |
| Second fiber spectral phase | Parameter | `filamentSecondOpticsPhase` |
| Transformation law | Select | `s.filamentMorphMode` |
| First parent transforms into | Select | `s.filamentMorphTarget` |
| Second parent transforms into | Select | `s.filamentSecondMorphTarget` |
| Material transformation strength | Parameter | `filamentMorphAmount` |
| Transformation patch scale | Parameter | `filamentMorphScale` |
| Transformation speed | Parameter | `filamentMorphSpeed` |
| Seam sharpness / diffusion | Parameter | `filamentMorphSharpness` |
| Transformation frontier glow | Parameter | `filamentMorphGlow` |
| Metamorphosis preset | Select | `morphPreset` |
| Transmission behavior | Select | `s.filamentContagionMode` |
| Transmission intensity | Parameter | `filamentContagionAmount` |
| Neighbor reach / contact handoff | Parameter | `filamentContagionReach` |
| Propagation velocity | Parameter | `filamentContagionSpeed` |
| Recipient response lag | Parameter | `filamentContagionLag` |
| Infection boundary glow | Parameter | `filamentContagionGlow` |
| Contagion recipe | Select | `contagionPreset` |
| Nervous-system behavior | Select | `s.filamentNeuralMode` |
| Nerve signal intensity | Parameter | `filamentNeuralAmount` |
| Impulse travel speed | Parameter | `filamentNeuralSpeed` |
| Synaptic coupling / thread synchrony | Parameter | `filamentNeuralCoupling` |
| Color sensitivity threshold | Parameter | `filamentNeuralThreshold` |
| Electrical highlight / glow | Parameter | `filamentNeuralGlow` |
| Nervous system recipe | Select | `neuralPreset` |
| Synaptic behavior | Select | `s.filamentPlasticMode` |
| Synaptic adaptation strength | Parameter | `filamentPlasticAmount` |
| Adaptation rhythm | Parameter | `filamentPlasticRate` |
| Inhibition / damping | Parameter | `filamentPlasticInhibition` |
| Echo persistence / phase span | Parameter | `filamentPlasticRetention` |
| Changing synapse glow | Parameter | `filamentPlasticGlow` |
| Plasticity recipe | Select | `plasticPreset` |
| Scar morphology | Select | `s.filamentScarMode` |
| Ghost scar intensity | Parameter | `filamentScarAmount` |
| Scar spacing and pattern density | Parameter | `filamentScarDensity` |
| Apparent aftertrace lifetime | Parameter | `filamentScarPersistence` |
| Fracture roughness | Parameter | `filamentScarRoughness` |
| Scar phosphor glow | Parameter | `filamentScarGlow` |
| Scar recipe | Select | `scarPreset` |
| Regrowth anatomy | Select | `s.filamentRegenMode` |
| Daughter-thread presence | Parameter | `filamentRegenAmount` |
| Branching frequency | Parameter | `filamentRegenBranches` |
| Growth and repair cycle speed | Parameter | `filamentRegenSpeed` |
| Regrowth reach / repair thickness | Parameter | `filamentRegenHealing` |
| Fresh fiber glow | Parameter | `filamentRegenGlow` |
| Regeneration recipe | Select | `regenPreset` |
| First parent jewelry | Select | `s.filamentAdornmentMode` |
| Second parent jewelry (when crossbred) | Select | `s.filamentSecondAdornmentMode` |
| Jewelry presence | Parameter | `filamentAdornmentAmount` |
| Stations / ornament spacing | Parameter | `filamentAdornmentSpacing` |
| Jewelry size / fringe reach | Parameter | `filamentAdornmentSize` |
| Living ornaments / movement | Parameter | `filamentAdornmentMotion` |
| Jewel shine / phosphor | Parameter | `filamentAdornmentGlow` |
| Thread jewelry recipe | Select | `adornmentPreset` |
| Second thread parent | Select | `s.filamentSecondSpecies` |
| Second parent presence | Parameter | `filamentCrossbreed` |
| Under / over crossing depth | Parameter | `filamentInterlace` |
| Secondary thread rotation | Parameter | `filamentTwist` |
| Secondary motion phase | Parameter | `filamentPhase` |
| Hybrid breeding recipe | Select | `hybridPreset` |

Nested drawers: 🪄 SEMANTIC GRAVITY — LET WORDS BEND THE WEAVE; 💠 QUASICRYSTAL BROCADE — IMPOSSIBLE RAISED EMBROIDERY; 🧶 FERAL JACQUARD — STRUCTURAL CORRUPTION; 💎 SCULPTED THREADS — RAISED RELIEF & LIGHT; 🪡 SELF-WEAVING LOOM — STITCH IN MOTION; 🎻 CHLADNI NEEDLE ORCHESTRA — CYMATIC STITCHES; 🕰️ RETROCAUSAL EMBROIDERY — STITCHES FROM TOMORROW; ✨ THREAD ALCHEMY — MATERIALS & BEADS; 🌈 STRUCTURAL-COLOR OPTICS — DRESS THE THREADS; 🧵 PARENT A — FIRST FIBER OPTICS; 🧵 PARENT B — SECOND FIBER OPTICS; 🦋 THREAD METAMORPHOSIS — FABRIC THAT CHANGES MATERIAL; 🦠 CONTAGION LOOM — MAKE YOUR THREADS INFECT EACH OTHER; 🧠 NEURAL LOOM — A NERVOUS SYSTEM FOR YOUR FABRIC; 🧠 SYNAPTIC PLASTICITY — TEACH THE THREADS NEW TRICKS; 👻 GHOST SCARS — LET THE ELECTRIC THREADS LEAVE MARKS; 🌱 REGENERATION LOOM — GROW NEW THREADS FROM THE SCARS; 💎 THREAD JEWELRY — CHARMS, FRINGE & WEIRD SHIT; 🧬 CROSSBREED TWO THREAD SPECIES.

Actions: Let the words haunt the fibers; Shuffle text gravity; Feral linguistic gravity; Release the words (keep text and fibers); Embroider selected specimen; Shuffle quasicrystal geometry; Reseed phason; Weave feral recipe; Shuffle feral structure; Weave selected preset; New stitch species; Shuffle alien + veinwork; Shuffle fresh textile geometries; Reseed threads; Hide threads; Sculpt selected preset; Shuffle sculpted relief; Shuffle alien relic relief; Flatten relief (keep threads); Play selected needle score; Shuffle Chladni orchestra; Sew selected temporal score; Shuffle future seams; Feral chronology shuffle; Start weaving; Shuffle stitch motions; Shuffle new weird stitches; Shuffle ritual stitches; Hold finished fabric; Dress the threads; Remix fibers; Dress in weird shit; Outfit roulette — fibers + jewelry; Restore classic threads; Dress BOTH fibers in spectral weirdness; Shuffle both optical coats; Wild spectral wardrobe; Shuffle first optics; Remove first coat; Shuffle second optics; Remove second coat; Swap optical coats A ↔ B; Restore original thread colors; Metamorphose threads; Shuffle transformations; Shuffle fungal & impossible; Stop morphing — keep fabric; Infect the loom; Shuffle contagions; Shuffle cursed infections; Quarantine — keep transformed threads; Electrify the threads; Shuffle nervous systems; Shuffle feral synapses; Sedate the weave — keep everything else; Sculpt synapses; Shuffle plasticity; Shuffle strange synapses; Quiet synapses — keep the nerves; Scar the threads; Shuffle scar tissue; Shuffle haunted scars; Heal all scars — keep nerves; Regrow the weave; Shuffle regeneration; Shuffle alien healing; Stop growing — keep scars; Adorn the threads; Shuffle all thread jewelry; Shuffle cursed jewelry; Full cursed couture; Strip jewelry (keep materials); Spawn hybrid; Breed wild; Swap parents; Unbreed (keep first).

### Photon zoo (`photon`)

Twenty-six animated optical/sculptural creatures: caustics, diffraction, lensing, gyroids and spectral organisms.

Original family: **Light**. Activity keys: `photonAmount`. Reset keys: `photonSpecies`, `photonAmount`, `photonScale`, `photonDensity`, `photonMotion`, `photonRelief`, `photonHue`, `photonVariation`.

| Control | Type | Original binding |
| --- | --- | --- |
| Optical creature | Select | `s.photonSpecies` |
| Presence | Parameter | `photonAmount` |
| Size | Parameter | `photonScale` |
| Fine detail | Parameter | `photonDensity` |
| Motion | Parameter | `photonMotion` |
| Glass relief | Parameter | `photonRelief` |
| Spectrum shift | Parameter | `photonHue` |
| Variation | Parameter | `photonVariation` |
| Quick-start sculpture | Select | `photonPreset` |

Actions: Spawn selected sculpture; New creature, keep art; Shuffle optical creatures; Shuffle new weird optics; Shuffle funky cosmic optics; Reseed; Hide photons.

### Chromatic Alchemy (`alchemy`)

Four palette-aware animated color laws applied to existing artwork; does not replace geometry or separately composited text.

Original family: **Light**. Activity keys: `alchemyAmount`. Reset keys: `alchemyMode`, `alchemyAmount`, `alchemyScale`, `alchemyMotion`, `alchemySeparation`, `alchemySoftness`, `alchemyWhite`, `alchemyVariation`, `alchemyPalette`.

| Control | Type | Original binding |
| --- | --- | --- |
| Color sorcery | Select | `s.alchemyMode` |
| Presence | Parameter | `alchemyAmount` |
| Field scale | Parameter | `alchemyScale` |
| Color motion | Parameter | `alchemyMotion` |
| Spectral separation | Parameter | `alchemySeparation` |
| Softness | Parameter | `alchemySoftness` |
| White crown | Parameter | `alchemyWhite` |
| Variation | Parameter | `alchemyVariation` |
| Use my current palette | Switch | `alchemyPalette` |
| Instant color sorcery | Select | `alchemyPreset` |

Actions: Summon this color; Shuffle color sorcery; Shuffle funky colors; Hide color sorcery.

### Wiggle 3D (`wiggle`)

Two-view wiggle-gram/parallax illusion with configurable depth layers.

Original family: **Depth**. Activity keys: `wiggleAmount`. Reset keys: `wiggleMode`, `wiggleAmount`, `wiggleDepth`, `wiggleSpeed`, `wiggleLayers`.

| Control | Type | Original binding |
| --- | --- | --- |
| View motion | Select | `s.wiggleMode` |
| Wiggle | Parameter | `wiggleAmount` |
| Depth | Parameter | `wiggleDepth` |
| Speed | Parameter | `wiggleSpeed` |
| Depth layers | Parameter | `wiggleLayers` |

Actions: Make it wiggle.

### Stereo 3D (`stereo`)

Raymarched 3D geometry, fog, morphology and camera wiggle. Also drives the Stereo Ghost Machine engine.

Original family: **Depth**. Activity keys: `stereoAmount`. Reset keys: `stereoShape`, `stereoAmount`, `stereoDepth`, `stereoParallax`, `stereoMorph`, `stereoGlow`, `stereoWiggle`, `stereoQuality`.

| Control | Type | Original binding |
| --- | --- | --- |
| Shape | Select | `s.stereoShape` |
| Overlay | Parameter | `stereoAmount` |
| Depth fog | Parameter | `stereoDepth` |
| Parallax | Parameter | `stereoParallax` |
| Morph | Parameter | `stereoMorph` |
| Prism light | Parameter | `stereoGlow` |
| Camera wiggle | Parameter | `stereoWiggle` |
| Detail (GPU load) | Parameter | `stereoQuality` |

### Backdrop (`backdrop`)

Eighteen atmospheric scenes with independent near/far depth and palette-linked motion.

Original family: **Scene**. Activity keys: `backdropAmount`. Reset keys: `backdropMode`, `backdropAmount`, `backdropDepth`, `backdropDensity`, `backdropMotion`, `backdropGlow`, `backdropHue`, `backdropVariation`.

| Control | Type | Original binding |
| --- | --- | --- |
| Atmospheric habitat | Select | `s.backdropMode` |
| Presence | Parameter | `backdropAmount` |
| Parallax depth | Parameter | `backdropDepth` |
| Density | Parameter | `backdropDensity` |
| Motion | Parameter | `backdropMotion` |
| Glow | Parameter | `backdropGlow` |
| Palette shift | Parameter | `backdropHue` |
| Variation | Parameter | `backdropVariation` |
| Instant atmosphere | Select | `backdropPreset` |

Actions: Spawn this atmosphere; Shuffle all backdrops; Shuffle new atmospheres; Shuffle paranormal habitats; Hide atmosphere; Reseed background.

### Chaos Lab (`chaos-lab`)

Action desk for weighted ecosystem/global randomization, with UI-only preservation preferences and mobile GPU budget.

Original family: **Scene**. Activity keys: none. Reset keys: none.

| Control | Type | Original binding |
| --- | --- | --- |
| Chaos intensity | Select | `chaosLevel` |
| Preserve my colors | Toggle | `preserveColors` |
| Preserve my words and text styling | Toggle | `preserveText` |
| Preserve core math and touch forces | Toggle | `preserveCore` |
| Allow two atmosphere parents | Toggle | `allowDual` |
| Allow extra heavyweight GPU combinations | Toggle | `allowHeavy` |

Actions: Shuffle ecosystem; Full weird shuffle.

### Living Food Web (`living-food-web`)

Real saved nutrient reserves and explicit conserved transfers between nearby colonies; luminous deterministic pathways visualize connections.

Original family: **Scene**. Activity keys: `foodWebAmount`. Reset keys: `foodWebMode`, `foodWebAmount`, `foodWebReach`, `foodWebPressure`, `foodWebPulse`, `foodWebWidth`, `foodWebGlow`, `foodWebHue`.

| Control | Type | Original binding |
| --- | --- | --- |
| Ecological relationship | Select | `s.foodWebMode` |
| Luminous web visibility | Parameter | `foodWebAmount` |
| How far food pathways connect | Parameter | `foodWebReach` |
| Nutrient exchange intensity | Parameter | `foodWebPressure` |
| Traveling energy pulse speed | Parameter | `foodWebPulse` |
| Mycelial thread thickness | Parameter | `foodWebWidth` |
| Bioluminescent brightness | Parameter | `foodWebGlow` |
| Feeding pathway palette offset | Parameter | `foodWebHue` |

Nested drawers: Connection map · … nutrient highways; Stored nutrient reserves · … organisms.

Actions: Awaken food web; Stage nearest connection; Feed once; Feed three rounds; Shuffle the food web; Hide web / pause feeding.

### Ecological Succession (`ecological-succession`)

Explicitly advances saved geological deposits which alter local nutrients, ecological fitness and offspring landing.

Original family: **Scene**. Activity keys: `successionAmount`. Reset keys: `successionMode`, `successionAmount`, `successionDepth`, `successionSpread`, `successionMotion`, `successionGlow`, `successionHue`, `successionBurial`.

| Control | Type | Original binding |
| --- | --- | --- |
| Chemistry of the next deposit | Select | `s.successionMode` |
| Legacy visibility / strength | Parameter | `successionAmount` |
| Chemical depth | Parameter | `successionDepth` |
| Soil spread | Parameter | `successionSpread` |
| Subsurface motion | Parameter | `successionMotion` |
| Sediment glow | Parameter | `successionGlow` |
| Sediment pigment | Parameter | `successionHue` |
| Percent of live seeds depositing soil | Parameter | `successionBurial` |

Nested drawers: Soil chemistry beneath living colonies; Geological sediment · … deposits.

Actions: Awaken living rock; Deposit one century; Advance three centuries; Century + descendants; Shuffle soil chemistry; Hide memory (keep archive); Clear ecological history (confirm).

### Fossil Record (`fossil-record`)

Archives actual organism shapes, positions and DNA without deleting living seeds; fossils alter substrate resources. Includes resurrection, ancestral evolution and archive management.

Original family: **Scene**. Activity keys: `fossilAmount`. Reset keys: `fossilMode`, `fossilAmount`, `fossilDepth`, `fossilMotion`, `fossilGlow`, `fossilHue`, `fossilBurial`, `fossilRecords`.

| Control | Type | Original binding |
| --- | --- | --- |
| What the dead leave behind | Select | `s.fossilMode` |
| Fossil visibility | Parameter | `fossilAmount` |
| Nutrient residue depth | Parameter | `fossilDepth` |
| Stratigraphic shimmer | Parameter | `fossilMotion` |
| Ghost phosphor glow | Parameter | `fossilGlow` |
| Historical pigment offset | Parameter | `fossilHue` |
| Percent of living seeds to archive | Parameter | `fossilBurial` |
| Ancient-world specimen | Select | `fossilPreset` |
| Revival method | Select | `resurrectionMode` |
| Evolutionary pressure | Select | `echoMode` |
| ancestral-echo-intensity | input | `echoIntensity` |

Nested drawers: Resurrection Chamber · raise ancient bloodlines; Ancestral Echoes · evolve civilizations; Geological archive · …/….

Actions: Summon fossils; Shuffle ancient chemistry; Archive this generation; Bury and advance epoch; Hide fossils (keep record); Clear fossil archive (confirm); Revive oldest ancestor; Raise the whole graveyard; Evolve ancestral generation; Evolve three generations; Revive.

### Speciation Lab (`speciation-lab`)

Explicitly branches inherited clades, changes genomes/territory, and runs reversible territory contests; no independent always-running overlay.

Original family: **Scene**. Activity keys: `geneAmount`. Reset keys: none.

| Control | Type | Original binding |
| --- | --- | --- |
| Divergence pattern | Select | `speciesMode` |
| species-strength | input | `speciesStrength` |

Nested drawers: Lineage census · … families.

Actions: Branch rival families; Contest territory (confirm).

### Coevolution Lab (`coevolution-lab`)

Explicit nearby-rival encounters change actual inherited DNA and territory; includes staging and encounter ledger.

Original family: **Scene**. Activity keys: `coevoRound`. Reset keys: none.

| Control | Type | Original binding |
| --- | --- | --- |
| Relationship between bloodlines | Select | `coevoMode` |
| coevo-intensity | input | `coevoIntensity` |

Nested drawers: Encounter network · … relationships.

Actions: Stage closest rivals; Evolve one encounter; Evolve three encounters; Surprise me with coevolution.

### Apocalypse Clock (`apocalypse-clock`)

Five catastrophe systems affect visible mineral terrain and nutrient maps. Geology changes only on explicit epoch advance.

Original family: **Scene**. Activity keys: `apocalypseAmount`. Reset keys: `apocalypseMode`, `apocalypseAmount`, `apocalypseScale`, `apocalypseMotion`, `apocalypsePressure`, `apocalypseGlow`, `apocalypseHue`, `apocalypseEpoch`.

| Control | Type | Original binding |
| --- | --- | --- |
| Geological catastrophe | Select | `s.apocalypseMode` |
| Cataclysm visibility | Parameter | `apocalypseAmount` |
| Disaster texture density | Parameter | `apocalypseScale` |
| Heat / rain / mineral shimmer | Parameter | `apocalypseMotion` |
| Ecological shock intensity | Parameter | `apocalypsePressure` |
| Ionized mineral radiance | Parameter | `apocalypseGlow` |
| Cataclysm pigment offset | Parameter | `apocalypseHue` |
| Catastrophe specimen | Select | `apocalypsePreset` |

Actions: Summon catastrophe; Shuffle disasters; Advance epoch; Epoch + selection cycle (confirm); Hide catastrophe (keep history).

### Selection Chamber (`selection-chamber`)

DNA/resource-based growth and fitness model plus explicit cull/breed actions; actions preserve undo and existing confirmation safeguards.

Original family: **Scene**. Activity keys: `selectionPressure`. Reset keys: `selectionMode`, `selectionPressure`, `selectionSeverity`, `selectionBrood`, `selectionGlow`.

| Control | Type | Original binding |
| --- | --- | --- |
| Evolutionary fitness model | Select | `s.selectionMode` |
| Fitness effect on growth | Parameter | `selectionPressure` |
| Remove weakest percentage | Parameter | `selectionSeverity` |
| Survivor offspring proportion | Parameter | `selectionBrood` |
| Adapted-organism radiance | Parameter | `selectionGlow` |
| Selection specimen | Select | `selectionPreset` |

Nested drawers: Fitness scoreboard · … organisms.

Actions: Awaken selection; Shuffle selection; Breed the fittest; Cull weakest (confirm); Select + reproduce (confirm); Stop selection (keep bloodlines).

### Mutation Bloodlines (`mutation-bloodlines`)

Per-colony inherited DNA changes geometry and pigment, including mutation and contact recombination.

Original family: **Scene**. Activity keys: `geneAmount`. Reset keys: `geneAmount`, `geneMutation`, `geneCrossbreed`, `geneGlow`.

| Control | Type | Original binding |
| --- | --- | --- |
| Gene expression strength | Parameter | `geneAmount` |
| Offspring mutation rate | Parameter | `geneMutation` |
| Nearby A/B gene recombination | Parameter | `geneCrossbreed` |
| Gene-specific pigment glow | Parameter | `geneGlow` |
| Bloodline specimen | Select | `genePreset` |

Actions: Seed this gene pool; Shuffle all DNA; Mutate existing genes; Hide DNA (keep ancestry).

### Symbiosis Lab (`symbiosis-lab`)

Two painted populations interact at actual overlap through mutualism, corrosion, third pigment or electric synapses.

Original family: **Scene**. Activity keys: `symbiosisAmount`. Reset keys: `symbiosisMode`, `symbiosisAmount`, `symbiosisDetail`, `symbiosisMotion`, `symbiosisGlow`, `symbiosisDominance`.

| Control | Type | Original binding |
| --- | --- | --- |
| Relationship between A and B | Select | `s.symbiosisMode` |
| Contact chemistry strength | Parameter | `symbiosisAmount` |
| Filigree, lesions and arcs | Parameter | `symbiosisDetail` |
| Interface motion | Parameter | `symbiosisMotion` |
| Bioluminescent reaction glow | Parameter | `symbiosisGlow` |
| Parasitic dominance (A → B) | Parameter | `symbiosisDominance` |
| Relationship specimen | Select | `symbiosisPreset` |

Actions: Spawn symbiosis; Shuffle symbiosis; Plant contact pair; Disable reaction (keep colonies).

### Substrate Alchemy (`substrate-alchemy`)

Geological resource fields; A/B nutrient affinities influence organisms and offspring landing.

Original family: **Scene**. Activity keys: `substrateAmount`. Reset keys: `substrateMode`, `substrateAmount`, `substrateScale`, `substrateMotion`, `substratePressure`, `substrateAffinityA`, `substrateAffinityB`, `substrateGlow`, `substrateHue`.

| Control | Type | Original binding |
| --- | --- | --- |
| Living geological substrate | Select | `s.substrateMode` |
| Mineral visibility | Parameter | `substrateAmount` |
| Fracture/vein density | Parameter | `substrateScale` |
| Living mineral shimmer | Parameter | `substrateMotion` |
| Nutrient pressure on growth | Parameter | `substratePressure` |
| Parent A prefers high nutrients | Parameter | `substrateAffinityA` |
| Parent B prefers high nutrients | Parameter | `substrateAffinityB` |
| Luminous mineral edges | Parameter | `substrateGlow` |
| Mineral palette offset | Parameter | `substrateHue` |
| Geological specimen | Select | `substratePreset` |

Actions: Summon terrain; Shuffle geology; Colonize rock; Hide substrate.

### Spore Dynasties (`spore-dynasty`)

Analytic flying spores and temporary daughter organisms, plus explicit committing of landed offspring as editable seeds.

Original family: **Scene**. Activity keys: `sporeAmount`. Reset keys: `sporeMode`, `sporeAmount`, `sporeSpeed`, `sporeReach`, `sporeFertility`, `sporeGlow`.

| Control | Type | Original binding |
| --- | --- | --- |
| Spore transport | Select | `s.sporeMode` |
| Spore visibility | Parameter | `sporeAmount` |
| Dispersal speed | Parameter | `sporeSpeed` |
| Landing distance | Parameter | `sporeReach` |
| Fertility / active parents | Parameter | `sporeFertility` |
| Spore luminescence | Parameter | `sporeGlow` |
| Spore specimen | Select | `sporePreset` |

Actions: Awaken spores; Shuffle spores; Evolve generation; Stop flight (keep offspring).

### Living Cortex (`colony-cortex`)

Animated radial bands, vascular structures and fruiting cups inside painted colonies.

Original family: **Scene**. Activity keys: `colonyCortexAmount`. Reset keys: `colonyCortexA`, `colonyCortexB`, `colonyCortexAmount`, `colonyCortexDetail`, `colonyCortexMotion`, `colonyCortexRelief`.

| Control | Type | Original binding |
| --- | --- | --- |
| Parent A cortex | Select | `s.colonyCortexA` |
| Parent B cortex | Select | `s.colonyCortexB` |
| Cortex visibility | Parameter | `colonyCortexAmount` |
| Growth ring / branching detail | Parameter | `colonyCortexDetail` |
| Inner tissue movement | Parameter | `colonyCortexMotion` |
| Pigment depth and relief | Parameter | `colonyCortexRelief` |
| Instant cortex | Select | `colonyCortexPreset` |

Actions: Spawn cortex pair; Shuffle cortex; Hide cortex (keep seeds).

### Mutant Anatomy (`colony-anatomy`)

Changes planted colony outlines (lichen, coral, petals, hyphae), intracellular pores and edge light.

Original family: **Scene**. Activity keys: `colonyAnatomyAmount`, `colonyAnatomyPores`, `colonyAnatomyRim`. Reset keys: `colonyShapeA`, `colonyShapeB`, `colonyAnatomyAmount`, `colonyAnatomyDetail`, `colonyAnatomyMotion`, `colonyAnatomyPores`, `colonyAnatomyRim`.

| Control | Type | Original binding |
| --- | --- | --- |
| Parent A anatomy | Select | `s.colonyShapeA` |
| Parent B anatomy | Select | `s.colonyShapeB` |
| Shape mutation strength | Parameter | `colonyAnatomyAmount` |
| Lobes, spikes and petal detail | Parameter | `colonyAnatomyDetail` |
| Anatomy motion | Parameter | `colonyAnatomyMotion` |
| Microscopic pores | Parameter | `colonyAnatomyPores` |
| Luminous rim | Parameter | `colonyAnatomyRim` |
| Anatomy specimen | Select | `colonyAnatomyPreset` |

Actions: Spawn anatomy pair; Shuffle anatomy; Restore classic outlines.

### Colony Wars (`colony-life`)

Analytic continuous-time growth/decay and A/B territory competition; stopping preserves planted seeds.

Original family: **Scene**. Activity keys: `colonyLifeAmount`, `colonyFrontGlow`, `colonyCompetition`. Reset keys: `colonyLifeMode`, `colonyLifeAmount`, `colonyLifeSpeed`, `colonyFrontGlow`, `colonyCompetition`.

| Control | Type | Original binding |
| --- | --- | --- |
| Lifecycle | Select | `s.colonyLifeMode` |
| Growth / retreat intensity | Parameter | `colonyLifeAmount` |
| Life-cycle speed | Parameter | `colonyLifeSpeed` |
| Luminous territory edges | Parameter | `colonyFrontGlow` |
| A versus B competition | Parameter | `colonyCompetition` |
| Instant ecology | Select | `colonyLifePreset` |

Actions: Awaken ecosystem; Shuffle colony wars; Stop ecology (keep seeds).

### Mutant atmospheres (`atmosphere`)

Two independent palette-linked shader worlds, blend modes and animated territory masks; painted masks connect to Touch and ecology.

Original family: **Scene**. Activity keys: `atmoAmount`, `atmoBAmount`. Reset keys: `atmoMode`, `atmoAmount`, `atmoScale`, `atmoDensity`, `atmoMotion`, `atmoGlow`, `atmoHue`, `atmoVariation`, `atmoBMode`, `atmoBAmount`, `atmoBScale`, `atmoBDensity`, `atmoBMotion`, `atmoBGlow`, `atmoBHue`, `atmoBVariation`, `atmoBBlendMode`, `atmoMaskMode`, `atmoBMaskMode`, `atmoMaskScale`, `atmoMaskFeather`, `atmoMaskMotion`, `atmoMaskVariation`.

| Control | Type | Original binding |
| --- | --- | --- |
| Atmosphere | Select | `s.atmoMode` |
| Presence | Parameter | `atmoAmount` |
| Pattern size | Parameter | `atmoScale` |
| Structure density | Parameter | `atmoDensity` |
| Living motion | Parameter | `atmoMotion` |
| Glow / radiance | Parameter | `atmoGlow` |
| Palette phase | Parameter | `atmoHue` |
| Variation | Parameter | `atmoVariation` |
| Instant atmosphere | Select | `atmoPreset` |
| Second parent | Select | `s.atmoBMode` |
| Second parent presence | Parameter | `atmoBAmount` |
| Second parent pattern size | Parameter | `atmoBScale` |
| Second parent density | Parameter | `atmoBDensity` |
| Second parent motion | Parameter | `atmoBMotion` |
| Second parent glow | Parameter | `atmoBGlow` |
| Second parent palette shift | Parameter | `atmoBHue` |
| Second parent variation | Parameter | `atmoBVariation` |
| How the parents mix | Select | `s.atmoBBlendMode` |
| Instant hybrid | Select | `hybridAtmoPreset` |
| First parent habitat | Select | `s.atmoMaskMode` |
| Second parent habitat | Select | `s.atmoBMaskMode` |
| Habitat coverage / scale | Parameter | `atmoMaskScale` |
| Soft edges | Parameter | `atmoMaskFeather` |
| Habitat drift | Parameter | `atmoMaskMotion` |
| Habitat mutations | Parameter | `atmoMaskVariation` |

Nested drawers: 🧬 TWO-PARENT ATMOSPHERE BREEDER; 🪩 LIVING HABITATS — MASKS & TERRITORIES.

Actions: Spawn atmosphere; New species; Reseed; Hide first parent; Spawn hybrid; Breed wild; New second parent; Swap parents; Hide second; Hide both; Plant A on image; Plant B on image; Return to force brush; Full canvas; Reseed habitats; Shuffle ecosystem.

## Coverage totals

390 original labeled controls/input declarations (including three mapped quick toggles) across 36 Effects entries. Dynamically repeated selects or sliders are recorded once per declaration; the original data arrays continue to supply every mode and recipe option. All original action buttons, reseed actions and nested details are enumerated above. Original per-section reset actions are supplied by the shared Section component.

## Regression risks to verify

- Category, favorite, search and effect selection must not call `history.change` or replace artwork state.
- Search needs to reveal nested Filament drawers as well as the selected effect; waiting for mount must not scroll the document/canvas.
- An Active list should retain the selected controls when an amount reaches zero, so the user can turn the effect back up.
- Repeated control labels (Strength, Motion, Presence) need effect context. Searching biological synonyms should reach both overlay biology and planted-colony systems.
- iPhone layout should use dynamic viewport height and safe-area insets; the control pane is the sole editing scroller below the canvas. All navigation should retain comfortable touch targets.
- Tests should compare original control declarations/bindings and ranges, not just number of rendered section headings.
