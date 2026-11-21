# Glitch Bitch — Synaptic Plasticity (beyond Neural Loom)

## Why this wave

Filament Forge already had a **Neural Loom**: eight neural signal modes, contact-gated handshakes across sewn hybrid fibers, responsive palette contrast and subtle twitching. This change builds *on that existing system* rather than adding duplicate nerve modes or another animation pipeline.

The new **Synaptic Plasticity** panel shapes the strength, excitation/inhibition, delay and grouping of those nerve signals **in-place, on the actual moving filaments**.

## Six modes (plus Off)

1. **Hebbian bloom:** coincident local palette response and first-parent signal at genuine stitched crossings amplify luminous regions
2. **Inhibitory lace:** damped moving bands darken sections of the actual thread (negative synaptic gain rather than more white glow)
3. **Echo synapses:** delayed-phase versions of nerve packets repeat in groups
4. **Resonant choir:** clusters synchronize their pulses to seeded phase rhythms; overlapping donor signals strengthen the response
5. **Pruning wave:** weak connections dim as a moving patterned front passes
6. **Dream consolidation:** slow rolling recovery envelopes alternate subdued and brighter neural activity

These are **stateless deterministic visual models of adaptive synaptic behavior**, *not* authentic Hebbian learning, biological memory, or an AI that permanently changes weights. They cannot genuinely remember past frames without keeping state. The phrase “learning” here is an artistic metaphor only.

## Controls

- Synaptic behavior: six modes + Off
- Synaptic adaptation strength
- Adaptation rhythm
- Inhibition / damping
- Echo persistence / phase span
- Changing synapse glow

Six one-click looks: Electric orchid brain, Negative-space synapses, Afterthought lightning, Alien textile choir, Fractal synapse pruning, Sleepwalking neurons.

Buttons: **Sculpt synapses**, **Shuffle plasticity**, **Shuffle strange synapses**, **Quiet synapses — keep the nerves**. Selecting a behavior auto-enables the existing Neural Loom if needed. Opting out disables only plasticity and preserves material, stitches, ornaments, palettes, authored text and existing neural/contagion settings.

## Engineering integration

- Each effect takes the Neural Loom's *actual* signal, local palette-gradient stimulus, and donor contact gated by already-sewn thread core masks. The affected material optical response still follows the moving filaments.
- Plasticity is an optional sub-section inside `#ifdef FILAMENT_NEURAL` and is only compiled when `filamentPlasticAmount > 0` and its mode is not Off. Mobile specialization removes the five unused plasticity law branches.
- Shader program caches distinguish active plasticity law changes. Five numeric parameters are uniforms, so turning their sliders does not need to recompile the program.
- A preview GPU fallback disables *only* Synaptic Plasticity before disabling the existing Neural Loom. Strict export still raises an error rather than silently changing the appearance.
- **No new framebuffer, texture, CPU simulation, render pass, time source or exporter logic**. The recent Safari ping-pong history repair remains untouched.
- New recipe fields are bounded, typed, Undo/Reset compatible, saved and randomized. Existing saved art loads with Plasticity **Off / zero strength**, so old artwork remains the same.

## Verification

Added `tests/filament-synaptic-plasticity.test.mjs` for six modes, old defaults, all UI control ranges, recipe round trips, precise shader specialization and the full **22 × 31 = 682** geometry/stitch combinations with existing materials, adornments, contagion and Neural Loom. Also includes checks for source-carrier contact, genuine negative-gain darkening, shader cache, exact-effect export, controls and targeted shuffles.

The core module parsed and executed in V8, and **2,115 structural assertions passed** across shader compositions, opt-in fallback, randomization and source wiring; a final visual-shading improvement to inhibition was checked for balanced GLSL after that count. This **does not** certify full npm/Vite compilation, real WebGL shader compatibility, iPhone Safari preview appearance or visual MP4/GIF export parity.

For device QA: pull updated `main` into Google AI Studio, save current recipe, first try a single-mode 480px strict proof, then a short MP4 before the 1080px 30-second recording. No Netlify deploy was requested or triggered.
