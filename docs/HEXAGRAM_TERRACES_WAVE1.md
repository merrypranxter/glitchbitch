# Glitchbitch — Hexagram Terraces (Shader Vault Wave 1)

**Source:** [shaderslop_designs / acid-iching.js](https://github.com/merrypranxter/shaderslop_designs/blob/main/by_math/19_symbolic_systems_tarot_iching_zodiac/acid-iching.js)

This is an opt-in, single-pass adaptation of the **mathematical behavior** of the original sketch, not a pasted Three.js scene or literal divination display.

## What actually happens

- Six distinct, thresholded noise samples contribute binary bits 1, 2, 4, 8, 16, and 32: 64 potential spatial identities.
- Each current bit and accumulated identity steer the coordinates sampled by the *next* bit; this coupling makes the boundaries nontrivial.
- Region identities select colors from **the active Glitchbitch palette**; near-threshold changing-line regions glow. They do not replace the palette or generate unwanted words.
- The field also creates a limited, user-adjustable **coordinate offset before the existing composed engine, filaments and subsequent material passes**. It is a real geometry influence, not merely a screen-space color filter.
- Relief is a lightweight, height-driven *visual emboss* rather than a three-sample physical normal-map raymarch. This is deliberate for iPhone performance and must not be mislabeled physically simulated 3D.
- All effects share geometry time, color time, the seed, and the same renderer state for PNG/GIF/MP4. No new frame-history buffer or standalone animation timer is involved.

## Controls

Find **Math → Hexagram Terraces**, where five editable starter recipes lead to ten 0–100 controls: strength, region scale, geometry bend, territory motion, raised enamel, changing-line width, palette offset, bit coupling, pattern variation and threshold. The panel has **Shuffle terraces only** and **Hide terraces**. The standard palette editor, engine picker, filament dressing and scene controls remain unchanged.

Existing recipes load with Hexagram strength 0, so the six-bit shader is **not compiled** when dormant. Regular Mutate nudges enabled effects but will not wake up dormant terraces; full Surprise Me may enable the new system on some results.

## Renderer/export protection

The optional shader goes through the same createRenderer drawing path for live view, exact PNG, GIF and MP4. A shader compile failure may switch *preview* to the earlier artwork; exactEffects **must fail explicitly** rather than silently removing terraces from exports. The new source does not edit any codec, closure, boomerang or text compositor code.

## QA and caveats

The test file tests/hexagram-terraces-wave1.test.mjs checks registration, recipe round-trip, old artwork safety, target shuffles, shader injection and strict export compile behavior. Tests are source-level contracts; actual GPU compilation and encoded file parity **still require a local npm test && npm run build and an iPhone Safari preview/PNG/GIF/MP4 comparison**. The six noise evaluations per active pixel are intended to be lighter than the source's 3× 3D simplex full-normal samples, but high-density combinations may still exceed mobile budget.

No Netlify deployment was initiated. The separate Color Mathematics Lab PR #65 is untouched.
