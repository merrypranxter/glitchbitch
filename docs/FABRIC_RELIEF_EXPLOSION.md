# GLITCHBITCH — Pattern Family Explosion: PR 2 Fabric & Relief

## Shipped architecture

This wave extends the existing Living Underlay, Sculpted Threads and Self-Weaving Loom systems without introducing any additional GPU passes or independent animation loops. Their original saved species/mode names and numerical shader IDs are preserved. The normal preview, PNG, GIF and MP4 clocks already sample the same stateless shader-time motion.

### Living Underlay — 6 → 16 actual geometries

Original six unchanged: Ornamental jacquard, Breathing moiré organza, Quasicrystal twill, Velvet pile, Opalescent damask and Cellular gauze.

New ten distinct time-driven weaving grounds:
- **Holographic brocade** — diffractive raised medallions and moving yarn interference.
- **Ghost quilt** — phantom quilt cells swell with self-repairing illuminated seams.
- **Threadbare cathedral** — traveling Gothic rib arch geometry and fraying gaps.
- **Elastic tartan** — two independently stretching plaid lattices.
- **Moiré satin haze** — beating rotating close-frequency silk gratings.
- **Haunted upholstery** — ghost ornamental masks emerge from stippled woven residuals.
- **Radioactive afghan** — animated crochet/granny-square chevrons and luminous knots.
- **Parasite upholstery** — multiscale invasion filaments and expanding branch networks.
- **Wet relic cloth** — drifting film menisci over eroded woven surfaces.
- **Disco shroud** — rotating triangular sequins and migrating iridescent weave highlights.

Sixteen named presets, family-grouped picker, all-ground shuffle, new-haunted-fabric shuffle, preservation of existing art and one-action Undo. Shader specialization removes unselected textile geometries prior to compilation; the existing cache is keyed by `underlayMode`.

### Sculpted Threads — 5 → 15 optical relief laws

The original five styles are intact, with **ten genuinely different 2.5D local yarn-relief shaders**: Beaded emboss, Cushion stitch, Gilded repoussé, Bas-relief threadwork, Carved appliqué, Bone inlay, Melted jewelry, Alien scar tissue, Fossil stitching and Ruin filigree. Each produces geometry-constrained changes in shadow, highlight, fabric cross-section, contact light or relief. The name does not imply physically modeled 3D geometry; it's directional material shading tied to the existing two-parent thread and needle reveal masks.

Fifteen named presets, grouped selector, all-sculpt shuffle, alien-relic-only shuffle. The new `specializeFilamentSculptMotion` compiles only the selected relief branch in a shader that still specializes thread geometry and stitch motion.

### Self-Weaving Loom — 15 → 21 moving stitch laws

New six: Parasite hem, Oracle tacking, Spasm tatting, Hologram darning, Ritual overlock and Witch-knot relay. These are six new explicit math branches driven by the existing `sewClock`, producing their own `visibleStitch` and `needle` fields inside the actual filament mask. Each can follow any of the sixteen thread geometries, including crossbred parents and materials.

Six new presets, a new Ritual/Funky group and dedicated **Shuffle ritual stitches** button; the existing all-motion and new-weird-motion shuffles sample the expanded arrays without rework.

## Guardrails and review

- Original mode names/IDs and mathematical branches remain valid. Presence 0 preserves legacy work without any additional generated content.
- All randomizers change only their local family controls; user's original words, colors, aspect ratio, engines, underlying artwork, and other effect families are preserved.
- All new controls remain grouped inside existing iPhone Effects/Texture sections; no new screens and no jumping canvas.
- Shader specialization plus the existing compile-error fallback protects expensive mobile combinations. No new textures, CPU solvers, framebuffers, external packages, background tasks or Netlify deploy.
- Regression suite checks sixteen textile grounds, fifteen relief styles, twenty-one stitch motions, all presets, save/restore, shuffles, legacy count updates, renderer wiring, and all 16×21 shader composition paths.
- **Still required before claiming a tested device build:** full `npm test`, `npm run build`, Safari WebGL compilation on iPhone, and real preview-vs-GIF/MP4 export parity.

## Next PR 3: Optics & Space

Extend Photon Zoo (preserve all eighteen currently available species) and Backdrop (preserve six), adding separate real animated optical/atmospheric geometries, bespoke presets, grouped modes and targeted funky shuffles. Suggested Photon species: Candy Singularity, Pollen Eclipse, Jelly Cathedral, Haunted Lenticules, Iridescent Spore Halo, Prism Amoeba, Neon Diffraction Fungus, Opal Thunder Lattice. Suggested Backdrop grounds: Smog Cathedral, Luminous Dustfall, Aurora Static, Echo Chamber Mist, Candle Plasma Haze, Velvet Signal Fog, Mold Heaven, TV Séance, Hallucinogenic Wallpaper, Synthetic Dusk Ooze, Afterimage Swamp, Ghost Mall Aquarium.
