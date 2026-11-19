# MUTANT COLONY ANATOMY — Wave 7

The painted-colony subsystem previously drew moving rounded disks, even after adding lifecycles and ecosystem randomizers. **Mutant Anatomy** lets parent A and parent B grow biologically suggestive, prismatic, continuously moving silhouettes of their own. It is not a static decal or a new baked visual. Morphology changes the actual shader habitat masks used by every parent atmosphere and competition engine.

## Artist controls

**Effects → Scene → Mutant Anatomy**

Choose **Parent A anatomy** and **Parent B anatomy** independently:

1. **Classic disks** — preserved original default
2. **Lichen lobes** — foliose thallus-like scalloped margins with secondary cortex ripples
3. **Coral fringe** — long sparse tips radiating from connected cores
4. **Crystal petals** — faceted lens/petal edges with geometric repeat symmetry
5. **Hyphal fans** — branching fungus-inspired radial filaments and fan-like peaks

Five numerical controls:
- **Shape mutation strength** interpolates smoothly between the old disks and selected forms
- **Lobes, spikes and petal detail** controls angular frequency and branching
- **Anatomy motion** controls internal oscillation
- **Microscopic pores** introduces optional perforations into the pigment mask
- **Luminous rim** accentuates the colored boundary, using your selected palette

Four presets: Fractal Thallus Cathedral, Coral Signal Reef, Glass Spore Lace, and Mutant Ribbon Plague. All four appear as **editable Lookbook designs**, bringing the collection to **122**, each with two parent species and planted habitat seeds.

Buttons:
- **Spawn anatomy pair** creates/enables painted habitats for both parents and applies the selected preset
- **Shuffle anatomy** creates a new pair of silhouette species and enables parent A, but never activates an unneeded second GPU atmosphere
- **Restore classic outlines** resets morph, pores and dedicated rim strength to zero without deleting the seeds, parent species settings, colony wars, colors or underlying design

## Integration with existing chaos

`src/ecosystem-randomizer.js` integrates morphology into **Shuffle Ecosystem**, **Surprise Me** and **Freakshow** whenever Painted colonies is selected. Approximately 84% of ecosystem randomizations that select painted habitats gain noncircular anatomy. A/B shapes are distinct when both are present. Nonpainted scenes get classic/off geometry, not an invisible expensive effect.

`Mutate` keeps dormant anatomy dormant while still nudging active species. Automatic Lookbook selection and old single-parent creations remain unchanged.

## Technical details

- New `src/colony-anatomy.js` holds shape modes, four presets, a deterministic pure JS shuffler, reset and a small procedural GLSL source module.
- Morphology source is embedded into the existing `src/atmosphere-habitats.js` and used only by **Painted colonies** masks.
- Parent-specific integer mode uniforms plus five normalized float uniforms use the same existing WebGL1/WebGL2 path; no texture, external asset, shader buffer, FBO, CPU history, paid API, AI image, or deployment.
- The original radius, original frill, and original soft mask remain unchanged if morphology strength = 0. All new features are opt-in; default is Classic disks / amount 0 / pores 0 / rim 0.
- A normalized local radial equation gives the four silhouette topologies. Pore holes are tiny analytic sine-wave perforations, distinct from physical photorealistic 3D anatomy. This is deliberate stylized generative art, **not** a fully biologically accurate lichen mesh.
- Morph transitions and pores depend only on current UV, existing seed coordinates, parent identity, and shared `time`. Preview and GIF/MP4 export share the source math.
- Luminous rim uses the existing parent mask transitions and palette selection; no additional mask samples or GPU passes.
- Shapes are persisted in recipe JSON and normal undo/redo state. The 16 planted-seed maximum is unchanged.

## Verification and known unknowns

Source parser, isolated JS shuffling and all **7 new regression groups passed**. All **122 Lookbook designs validated and returned identical recipes** from the existing validator. New tests: `tests/colony-anatomy.test.mjs`; existing Lookbook counts updated in art-state/strange-fields/ecosystem-randomizer tests.

Still to validate in the actual browser:
- `npm test`, `npm run build`, WebGL shader compilation on iPhone Safari
- Performance with 16 morphing colonies plus both atmospheres and optional pores
- Preview parity for high-res PNG/GIF/MP4, especially older export edge cases
- Touch handle/seed movement and undo/redo with morphology active

Do this in Google AI Studio before spending any Netlify credits. No Netlify deploy or GitHub Actions were initiated by this patch.

If a device cannot compile the heavier habitat shader, the existing fallback first disables optional habitat masks, preserving the underlying atmospheric or mathematical artwork.
