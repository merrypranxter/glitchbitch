# MUTANT ATMOSPHERES — Shader Vault, Wave 2

Four new optional *scene overlays* that live on top of any math engine and below typography, rather than replacing the whole app.

## Modes

| Mode | Actual design rule | Shader-vault inspiration |
| --- | --- | --- |
| Prismatic mycelium | Gyroid cross-sections, luminous capillary lines, wandering hyphae and seed-based spore pearls | `GLITCHY/05-psychedelic-glitch-art/prismatic-mycelium_20260623_132723.js` |
| Mandala gas leak | Fractal noise advected through a rotating lotus / square containment field, with soft leakage at the boundaries | `GLITCHY/05-psychedelic-glitch-art/tibetan-nebula_20260617_091030.js` |
| Heartbeat phosphor | Smooth double cardiac pulse deforming three detuned moiré carriers under a physical RGB shadow-mask grid | `GLITCHY/05-psychedelic-glitch-art/neon-heartbeat.js` |
| Misprint rosette | Four angled halftone carriers drift at slightly different frequencies, forming bright moving registration rosettes | `GLITCHY/05-psychedelic-glitch-art/structural-moire.js` |

These are original self-contained GPU shader implementations. Source sketches are creative/mechanical references, **not copied Three.js applications**.

## Artist workflow

Open **Effects → Scene → Mutant atmospheres**. Select a mode (automatically makes it visible), adjust its seven controls, or hit an instant preset:

- Fungal stained glass
- Luminous hyphal skeleton
- Nebula breaks the mandala
- The machine has a pulse
- CMY registration riot

**New species** changes only the atmospheric mode; **Reseed** changes just its variation. **Hide atmosphere** makes its amount zero; all original engine, palette, text and other effect settings remain. Preset application only changes atmosphere controls.

## Technical invariants

- `atmoAmount: 0` is the default, and the shader module is not compiled at all when off. This preserves all old recipes and the pre-existing renderer output.
- `atmoMode` is validated against a closed list; seven numeric controls are bounded [0, 100] and included in recipe import/export, undo, Mutate and Surprise.
- The active mode is specialized with a compile-time macro; the other three shader branches are eliminated by the driver. No additional FBO, textures, network requests, external services or animation loops.
- Shared palette colors and `time` are sampled directly from the normal math shader. The atmospheres participate in the same preview and deterministic PNG/GIF/MP4 export path.
- GPU compile failure explicitly disables this layer for the affected renderer, not the whole artwork.
- Text compositor, native blend/parity diagnostics, fonts, live fixed preview, palettes and export encoders are not modified. No Netlify deploy or GitHub Actions jobs.
- The source `main` at the start of the change is available as the pre-wave rollback commit. The branch is `feature/mutant-atmospheres-v1`.

## Testing

Test source contracts are in `tests/mutant-atmospheres.test.mjs`. Run `npm test` and `npm run build` in an environment with repository access. Also verify each mode on iPhone Safari for live animation, palette changes, undo/save/reimport, PNG and GIF/MP4 export, and that the text color fixes remain unchanged. **Tests are not a substitute for device QA.**

## Next avenues

- Independently mixed dual atmospheres (one structural, one gaseous)
- Masked placement so living layers inhabit selected canvas territories
- Dendritic growth simulation seeded by touch gestures, with deterministic export replay
- Per-species lighting / material roughness controls

