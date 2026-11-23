# Shader Vault Wave 3 — Complex Poles & Zeros

Source: https://github.com/merrypranxter/shaderslop_designs/blob/main/art_20260709_142745.html

## Mathematics, not a fake color effect

The original Shader Vault weather system contains the rational complex function (z^5 - 1) / (z^2 + moving pole) and Voronoi/phase effects. This wave extracts the rational coordinate dynamics, not the old Three.js standalone scene or any claim of a literal Apollonian gasket.

Complex Poles calculates z squared, fourth and fifth powers using proper complex multiplication, and divides by an animated complex denominator using a squared epsilon to keep singularities finite. The bounded complex result displaces the actual p coordinates that Glitchbitch's base math engines, filament geometry, optical textures and layered effects sample. A bounded Newton correction (z^5 - 1)/(5*z^4) draws geometry toward all five fifth roots of unity. Diagnostic proximity to poles/zeros and phase striations provide luminous filigree through the active, editable palette.

Five distinct geometry-flow modes:
- Rational Bloom: balanced rational field and root attraction
- Pole Vortex: rotational flows close to moving denominator zeros
- Zero Gravity: pull toward the numerator's five fifth roots
- Phase Web: phase-contour geometry oscillation
- Impossible Lattice: mixed angular/rational lattice

The shader has no extra framebuffer, no other timekeeper and no per-frame CPU allocations. Animated geometry uses the same time clock, while filigree coloration uses the shared color clock. This is 2D analytic complex-plane mathematics, not a 3D force-field simulation. Epsilon-regularized divisions and bounded vector outputs prevent true infinities.

## Controls and shuffles

Math -> Complex Poles & Zeros provides five modes, five presets, strength, complex zoom, geometry displacement, pole orbit, movement, softening, five-root gravity, phase density, phase glow, palette phase and spatial variation. Presets, Shuffle poles & zeros only and Hide preserve original palettes, author words, other effects and geometry.

Existing recipes have polesAmount = 0, so the module is not compiled at all when unused. Surprise Me can select new complex behavior; normal Mutate nudges existing active settings but cannot wake an old inactive field. All controls round-trip through JSON recipes. No Netlify deployment.

## Renderer and exact exports

Conditional POLES_MODULE / POLES_PRE / POLES_POST insertion maintains the old source verbatim when off, and the WebGL program cache segregates active vs dormant configurations. Both preview and PNG/GIF/MP4 exact-effects exports use the same renderer. On a graphics driver compilation failure, preview may disable the optional complex field; exactEffects throws rather than silently losing the effect. Existing Schlieren refractive pass, Hexagram Terraces and all older threading/text code are untouched.

QA: tests/complex-poles-wave3.test.mjs checks mode/controls, old recipe compatibility, presets, deterministic shuffle, root/pole GLSL operations, optional compilation, and strict export behavior. Physical iPhone Safari GPU compilation and encoded MP4/GIF comparison still need real-device verification.
