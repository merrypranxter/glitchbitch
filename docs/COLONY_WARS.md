# COLONY WARS — Wave 5: Growth, withering and border combat

The opt-in lifecycle engine for **Habitat Graffiti** planted seeds. This changes *how planted territories evolve over time*, not the underlying math engine. It can operate with the existing two-parent Mutant Atmospheres; the normal source renderer remains responsible for the image, color palette, and PNG/GIF/MP4 export.

## Artist workflow

Open **Effects → Scene → Colony Wars**:

- **Still** (default): old painted-colony masks are unchanged.
- **Germinate & bloom**: seed → swelling organic colony → seed; neighboring colonies emerge at phase-shifted times.
- **Breathe**: low-amplitude periodic swelling with a synchronized second harmonic.
- **Wither & return**: collapse into spores, regrow, and bloom again with a smooth power-law envelope.
- **Territory war**: A and B growth pulses in opposite phases. If *both parents are active and their habitats are Painted colonies*, their overlapping territory is divided using an oscillating winner/loser pressure field.

Controls: **Growth / retreat intensity**, **Life-cycle speed**, **Luminous territory edges**, **A versus B competition**.

Five fast presets: Neon Petri Conquest, Germination Opera, Breathing Polyp Colony, Withering Stained Glass, and Phosphor Border War. **Stop ecology (keep seeds)** resets all life strength, border light, and rivalry without deleting planted colonies, masks, parent species, colors, or original work.

The **Colony Wars** Lookbook family adds four fully editable, already-planted starts:

- Fungal Border Apocalypse
- Germination Cathedral
- Breathing Petri Quilt
- Withering Neon Reef

Lookbook total: **118** designs, 20 mathematical engines unchanged.

## Technical invariants

1. Legacy defaults are `colonyLifeMode: "Still"`, `colonyLifeAmount: 0`, `colonyFrontGlow: 0` and `colonyCompetition: 0`. Old art is bit-for-bit unchanged by the new lifestyle code when these are off; the new GLSL uniforms compile only when the user already has a non-Everywhere habitat active.
2. Each of the 16 existing planted seed disks gets a **deterministic analytic radius multiplier** based on the shared `time` uniform, the seed index, and its parent. A/B waves are phase-shifted by π. No extra buffers, no CPU simulation, no random jumps, no network calls, no new renderer.
3. Radius growth is smooth and strictly positive. The simple life-cycle multiplier has an exact `2π / (0.2 + 1.8 * speed)` period in **geometry time units** (for normalized speed in [0,1]); all breathing harmonics share this same period. This *does not guarantee a whole composed image is perfectly loopable*, because other enabled effects have independent frequencies/feedback.
4. With simultaneous A/B Painted colonies, a soft priority comparison partitions overlapping masks. Competition runs only in **Territory war mode** with nonzero life amount and competition strength. When disabled it falls back to exact original independent masks.
5. Palette-linked luminous front edges reuse each mask's feathered transition, adding no extra masks or texture passes. Alpha/mask calculations are reused across color overlay and light.
6. The original warp/repel/chroma brushes, seed painting/dragging, original typography, palette vault, font assets and export encoders were untouched. The 16-seed budget and tiered optional shader fallback remain in force.
7. All recipe fields use the existing JSON validation, undo/redo and persistent saved works. Mutate never activates a dormant lifecycle; Surprise starts with colony lifecycle off. User-applied life presets edit **only** the lifecycle fields.

## QA checklist

Run `npm test` then `npm run build` in an environment with repo checkout (Google AI Studio is acceptable). Smoke-test all four modes and five life presets on iPhone Safari. Try Colony Wars Lookbook entries, changing colors and seeds, dragging handles, saving/reopening, undoing and GIF/MP4 exporting. Watch overlapping A and B colonies in *Territory war* and compare export/preview.

**Checks performed in the GitHub-connector environment:** JavaScript syntax parsing, complete 118-entry Lookbook recipe validation and exact round-trip, isolated JS lifestyle-preset behavior, dormant-state behavior, and 96 periodicity samples. **Not performed here:** complete Node suite, Vite compile, live GPU shader compiler, actual iPhone Safari FPS and export-parity testing. No Netlify deploy, GitHub Actions or paid API calls were initiated.
