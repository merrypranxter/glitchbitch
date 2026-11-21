# Photon Zoo — The Living Optical Menagerie

## The request

Expand the existing Photon Zoo like the Filament Forge and Self-Weaving Loom expansions. Each new name must represent **different animated optics**, not just a preset of the same effect. Keep the original eight names, mathematical equations, default behavior and saved-index order untouched. Support compact grouped controls on iPhone and give the artist an all-creature and a new-species-only shuffle.

## Eighteen optical architectures

The original eight are unchanged: Prism rosettes, Cathedral halos, Liquid lenses, Diffraction flowers, Interference organisms, Chromatic ribbons, Op-art shockwaves and Starburst engines.

The ten additional creatures are:

| Mode | Independent animated optics |
| --- | --- |
| Caustic anemones | Tentacular radial caustics surrounding flexing luminous mouths |
| Opal gyroid ghosts | Traveling 3D gyroid-like interference isosurfaces with moving seams |
| Gravitational lensworms | Rotating vortex lens distortion, curved orbit arcs and chromatic shells |
| Lenticular chrysalis | Migrating rotating elliptical microlenses that swell and close |
| Quasicrystal halos | Fivefold nonperiodic beating interference with golden-ratio frequencies |
| Plasma jellybells | Pulsating gelatinous refractive bells with trailing light fibers |
| Moiré pollen | Moving cell-local rotated paired grating interference |
| Spectral manta wings | Interfering luminous wing membranes that breathe and unfurl |
| Nerve pearls | Opalescent nodes and axonal waves carrying light pulses |
| Temporal diffraction comb | Rotating optical slits producing sweeping high-frequency diffraction |

Each mode contains its own shader branch for `shape`, `rim`, `glint`, `phase` and `alpha`, driven by the original render clock `time` and `colorTime`. Ten new ready-made presets select each corresponding mode with motion enabled. They use the existing palette, prism relief, amount, detail, scale and variation controls.

## User experience

In **Effects → Light → Photon Zoo**, the picker now groups Original optical creatures, Living lenses & liquid caustics, Impossible crystal & light lattices, and Biological spectral organisms. A short description explains each species. New **Shuffle optical creatures** and **Shuffle new weird optics** buttons remix only Photon Zoo controls. Existing text, color palette, filament work, layering, underlying math and aspect ratio remain intact. Surprise and the general New Creature function already pick from the `photonSpecies` list, so the new creatures participate without adding randomizer dependencies.

## iPhone safety

Before shader compilation, `specializePhotonGeometry` extracts **only the currently chosen optical branch**, rather than leaving eighteen alternatives to the compiler. It changes no GPU uniforms, no buffers, adds no render passes and requires no WebGL2-only texture extensions. It preserves the existing GPU compile fallback that disables Photon Zoo alone. Hidden photons still compile no optical module. No background JS simulation or Netlify deploy is introduced.

## Verify

New tests exercise all 18 modes, the saved original eight IDs, every new preset, recipe round-trips, source branch pruning, original shader pigment integration, shuffles, mobile controls and Find search. **Still run `npm test`, `npm run build`, on-device iPhone Safari WebGL compilation and GIF/MP4 preview-versus-export parity before considering device-level verification complete.**

Next pattern families to consider: Living Underlay, Microstructure and Substance/material morphology.
