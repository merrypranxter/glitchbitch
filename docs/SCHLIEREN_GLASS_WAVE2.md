# Glitchbitch — Shader Vault Wave 2: Schlieren Refractive Glass

Source inspiration: https://github.com/merrypranxter/shaderslop_designs/blob/main/prismatic_sigil_glass_20260624_004811.html

## What changed

A source-grounded optical behavior, not another hue-shift filter. The live renderer captures the full original artwork in an RGBA texture and executes a second shader pass that samples and displaces the coordinates of those actual pixels. Local glass shapes have signed-distance masks and numerical surface gradients, plus animated haze, RGB dispersion and bright curved edges.

Five modes: Molten portholes, Filament glass, Prismatic blossoms, Ruffled organza, Schlieren pockets. These can distort existing Filament Forge, palettes, texture, backdrop, and scene effects, but are not raytraced 3D optics.

## Memory/export contract

- Without feedback: ONE reusable full-resolution RGBA8 framebuffer, allocated on demand and released when the glass is inactive.
- With afterimage/datamosh: ZERO additional full-resolution framebuffers; the refractive shader directly samples the finished ping-pong history texture. Glass is not fed recursively back into the history.
- The same renderer path drives WebGL preview and exact-effects PNG/GIF/MP4. Strict export throws on shader, texture, framebuffer or draw failures. Preview may fall back to intact original pixels rather than turning white.
- Visible text is overlaid after glass and deliberately not refracted; Semantic Gravity's underlying textile geometry is already in the WebGL art.
- No WebGL readback, backbuffer copying, new animation clock, extra codec, new package, changes to Loop Surgery or True Boomerang, GitHub Actions or Netlify deployment.

## Controls

Effects -> Texture -> Schlieren Refractive Glass: five selectable shapes, presence, scale, bend, movement, dispersion, edge light, heat-ripple, variation, coverage and focus. Five adjustable starting recipes, targeted shuffle and Hide glass. All colors, words and original filament dressings are preserved.

## QA

tests/schlieren-glass-wave2.test.mjs covers recipe migration, bounded modes, presets, shuffles, pixel sampling, framebuffer reuse and strict failures. Actual physical Safari compile and encoded MP4/GIF/PNG parity still require a device test, particularly alongside heavy feedback or animated Semantic Gravity.

Separate Color Mathematics Lab PR #65 untouched. No Netlify deployment.
