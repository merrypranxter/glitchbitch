# Fix: reserved GLSL names blocking strict-effects MP4 export

## Reported symptom (November 21, 2026)

The Google AI Studio iPhone preview repeatedly stopped strict MP4 exports with:

```text
Full-effect shader failed to compile
ERROR: 0:1650: 'resource' : Illegal use of reserved word
ERROR: 0:1650: 'resource' : syntax error
```

Example settings: 9:16 portrait, 1440px long edge, 15 seconds, 30fps, 24 Mbps. **Resolution, bitrate and clip duration cannot fix a shader syntax error.** The strict-effects export correctly refuses to silently remove artwork effects.

## Root cause and corrections

Some GLSL shader strings used words that JavaScript allows as variable names but the GLSL ES compiler reserves:

- `src/selection-chamber.js` — the `adaptiveFitness` GLSL parameter `resource` is now `nutrientLevel`. JS `fitnessFromEnvironment` and its underlying mathematics were deliberately not changed.
- `src/ecological-succession.js` — the `successionResource` GLSL local variable `resource` is now `nutrientLevel`. Its nutrient-polarity and accumulation formulas are unchanged.
- `src/symbiosis-lab.js` — a second latent GLSL reserved identifier, `interface`, was changed to `contactRim`. The visual contact and fungal membrane formulas remain identical.

No artist-facing parameters, colors, text, recipes, MP4/GIF encoders, frame-history ping-pong textures, or effect behavior were removed or changed.

The `artworkParityError` user message now distinguishes shader syntax problems from actual GPU resource shortages. Syntax errors explain that lowering resolution/bitrate cannot help; resource limits retain the original lower-resolution recommendation.

## Regression safety

- Updated Selection Chamber's preexisting test to match the legal GLSL parameter name.
- New `tests/glsl-reserved-identifiers.test.mjs` scans every static shader module imported by the shared preview/export renderer, plus inline renderer GLSL, for prohibited typed identifiers. It includes preserved-algebra tests for the three edited shaders and intentionally bad examples to verify the guard.
- Added an error-message regression verifying that reserved-word failures do not recommend resolution changes.

A direct connector-powered audit identified 21 static GLSL templates in 37 renderer imports, and found no prohibited typed identifiers after the fixes. The four targeted new algebra/guard tests were executed in V8 and passed. The export-parity error function was separately evaluated in V8; correct syntax vs. GPU-shortage guidance was verified.

**Still pending on hardware:** full npm test/Vite build, actual iPhone Safari WebGL shader compilation, and MP4 output parity. The app was not deployed to Netlify.

## Artist testing

1. Save your current artwork recipe.
2. Pull updated `main` into Google AI Studio (a stale preview will continue running the invalid shader).
3. Refresh and try **See flattened export proof (480px)** with all the same effects enabled.
4. If it renders, retry the exact portrait MP4 settings. If another different compiler error appears, capture the error text; lowering bitrate is only useful for actual memory/performance errors.
