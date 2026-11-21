# GLITCHBITCH — Pattern Family Explosion PR 3: Optics & Space

## The goal

Expand the user's illustrated Photon Zoo and Backdrop dropdowns with **real mathematical motion**, not simple name/palette rebranding. Original work must survive unchanged and the iPhone GPU must only see the selected visual branches. This completes the third requested broad-family PR.

### Photon Zoo: 18 → 26 animated optical creatures

Preserves all eighteen previous species, presets, and shader IDs. Eight new species have their own animated `shape`, `rim`, `glint`, `phase` and `alpha` fields:

- **Candy singularity:** inward spiral caustic ribbons bent like a soft gravitational lens
- **Pollen eclipse:** drifting miniature eclipses with moving coronas and spore halos
- **Jelly cathedral:** rhythmic gelatinous vaults and bright cathedral-like ribs
- **Haunted lenticules:** two sliding refractive copies of anisotropic lens cells
- **Iridescent spore halo:** breathing rings and germinating diffraction coronas
- **Prism amoeba:** undulating refractive body with interference skin
- **Neon diffraction fungus:** oscillating radial gill fans and microscopic spore halos
- **Opal thunder lattice:** moving jagged lattice wavefronts and interference seams

Eight named instant presets are included in the existing picker. A **Shuffle funky cosmic optics** button samples exactly these new eight; the existing all-species and new-weird shuffle buttons still work across their respective expanded sets. Existing saved work can still choose its prior species index.

### Backdrop: 6 → 18 animated atmospheric habitats

Preserves six original mathematical background functions and IDs. Adds twelve independent time-evolving background constructions with explicit near/far parallax and underpainting:

Smog cathedral, Luminous dustfall, Aurora static, Echo chamber mist, Candle plasma haze, Velvet signal fog, Mold heaven, TV séance, Hallucinogenic wallpaper, Synthetic dusk ooze, Afterimage swamp, Ghost mall aquarium.

The picker is grouped into Original atmospheres, Luminous/Architectural, and Funky/Paranormal families. All eighteen have named instant presets. Controls include **Shuffle all backdrops**, **Shuffle new atmospheres**, **Shuffle paranormal habitats**, Reseed and Hide. No user text, color palette, geometry, selected filament art or other effects are touched by these family-targeted actions.

### Important reliability fix

Backdrop previously had a program-cache key distinguishing only **on/off**, not the selected mode. The shader compiler could reuse an incompatible program when switching Backdrop modes. This wave now keys cache programs by `backdropModes.indexOf(s.backdropMode)`, same as Photon. `specializeBackdropGLSL` additionally prunes all unused atmospheric branches *before shader compilation*, instead of compiling eighteen conditional branches on iPhone. Both selected species use macros for their mode IDs and retain the old fallback that disables only the failing optional effect.

The canonical Backdrop name/ID list lives beside its GLSL implementation and is re-exported by `src/data.js`, keeping recipe validation, Full Surprise and shader selection synchronized.

### Verification / high-stakes guardrails

The PR includes an 8-case regression file testing original names and indices, new branches with time movement, 26 optical and 18 backdrop pruning paths, numerical recipe round-trips, targeted shuffles and renderer/UI/cache wiring. Existing Photon Zoo and Photon Menagerie test expectations are upgraded. The previous `tests/inspectors-jsx-syntax.test.mjs` performs a full Vite JSX parse of the component during `npm test`, specifically guarding against another missing closing brace.

**Never mistake V8/GLSL structure checks for proof that Vite built or Safari compiled the actual shaders.** Run `npm test`, `npm run build`, load in iPhone Safari and compare live preview with same-timestamp high-res GIF/MP4 output before calling the update fully verified.

No new GPU passes, textures, buffers, background solvers, dependencies, GitHub Actions, or Netlify deployment are needed.
