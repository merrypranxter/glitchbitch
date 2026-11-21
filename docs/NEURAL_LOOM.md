# Neural Loom — a nervous system woven into Glitch Bitch

## Artistic concept

Neural Loom is a new opt-in layer inside **Filament Forge**, independent of the 22 fiber geometries, 31 stitch laws, 14 material finishes, 12 jewelry modes, material metamorphosis, and Contagion Loom.

It creates electrical-looking pulses, coordinating light and **small moving disturbances of the actual filament geometry**. The signal tracks the current procedural stitch path. The first parent sends a pulse and its actual palette luminance to the second parent; the latter receives the signal **only where their already-revealed thread cores overlap**. No unrelated fullscreen post-effect or overlay.

### Eight behaviors

1. **Axon Train:** moving trains of luminous action-potential-like pulses
2. **Chromatic Reflex:** rhythmic activation gated by the difference between adjacent positions in the existing art palette; at crossbred contacts, receiving strands can also respond to the actual donor's color luminance
3. **Synaptic Handshake:** first-to-second transmission at true thread crossings, with traveling axon pulses
4. **Ganglion Chorus:** seeded clusters share rhythmic timing, giving the appearance of coordinated movements
5. **Reflex Arc:** propagation speeds periodically reverse, creating returning waves
6. **Myelin Skip:** fast saltatory-style leaps between periodic fiber nodes
7. **Nerve Storm:** seeded irregular spikes at selected strand sites
8. **Resting Potential:** slower subdued drifting bioluminescence

All modes share the existing palette and color clocks.

### Five controls and creative shortcuts

- Nerve signal intensity
- Impulse travel speed
- Synaptic coupling / thread synchrony
- Color sensitivity threshold (most apparent in Chromatic Reflex)
- Electrical highlight / glow

There are eight matching one-click recipes, plus **Electrify the Threads**, **Shuffle Nervous Systems**, **Shuffle Feral Synapses** and **Sedate the Weave — Keep Everything Else**. The last turns off neural intensity without changing the user's base fibers, pattern, animations, text, adornments, or material transformations.

This is **deterministic procedural signal propagation**, not a learned neural net or a persistent stateful electrophysiology simulation. It does not autonomously remember previous signals, and the palette sampling for Chromatic Reflex is a local palette-coordinate difference rather than a sampled neighboring pixel. Real cross-parent communication is based on actual stitched overlap masks and donor luminance.

## Technical implementation

The same `filamentField` function now accepts two additional read-only incoming neural parameters and returns neural strength plus palette luminance for each thread parent. It adds local position perturbation **only behind `FILAMENT_NEURAL`**, and modulates rendered fiber color/light **only where the existing sewn core is present**. A separate `specializeFilamentNeural` helper removes seven unselected laws before compiling on mobile.

The main renderer uses a `withNeural` feature guard independent of material morphing, so basic Original Thread and normal lace can also have neural activity. An isolated preview GPU fallback disables **only** neural animation when that particular shader fails. Strict-effects PNG/GIF/MP4 exporting still throws an error if the effect cannot be rendered, rather than delivering an unfaithful video.

No new WebGL framebuffer, CPU simulation loop, audio clock, external service, shader textures or export process is introduced. The recent **history-texture ping-pong** fix is preserved.

## Data and compatibility

New validated and saved fields are `filamentNeuralMode`, `filamentNeuralAmount`, `filamentNeuralSpeed`, `filamentNeuralCoupling`, `filamentNeuralThreshold`, and `filamentNeuralGlow`. Existing recipes get **Off / zero amount** and behave as before. Undo/redo, seeded shuffles, Surprise, Mutate, Find a Control and Reset all understand the new fields.

## Verification

Added `tests/filament-neural-loom.test.mjs` to cover all eight selections, inherited recipe defaults, saved state, palettes/text preservation, real core-gated handoff, deterministic shuffles, user controls and existing export safeguards.

The source module was evaluated in V8 and **2,104 structural assertions passed** covering all **22 × 31** filament geometry/stitch compositions with prior material, jewelry, metamorphosis and contagion shaders, plus neural law specialization, UI and renderer wiring. These are **not** a substitute for a real full npm/Vite test run, WebGL shader compilation on iPhone Safari or inspecting an actual downloaded MP4/GIF.

**Suggested device QA:** Pull current `main` into Google AI Studio, save the existing recipe, enable **Axon Train** with some bright fabric first, then try **Synaptic Handshake** with two crossbred species. Use the 480px strict effect proof and a 3–5-second high-resolution MP4 before a 30-second one. If WebGL reports an error, keep the exact error message for diagnosis.

No Netlify deploy, token expenditure, or encoder changes are part of this feature.
