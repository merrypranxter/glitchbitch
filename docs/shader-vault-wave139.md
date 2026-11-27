# Wave 139 — Shader vault mining
Inspected trees: shaderfiles3 (143 entries), shaderslop_designs (3086), shader_files_2 (741). Counts include directories and HTML/JS pairs, not unique shaders.

## Inspected shaderfiles3 source files
- jewel_phosphenes_20260705_162313.js: retinotopic mapping, complex domain coloring, chromostereopsis, false color, temporal adaptation toward complement. Extract stateless optical mapping first; actual retinal feedback requires shared history buffers.
- chroma-soup_20260704_194823.js: asymmetric Gaussian CIE color matching functions (Wyman et al.), spectral mapping. Adapt to existing palette controls with optional independent spectral color.
- BEST_SHADER_EVER_20260704_205826.js and temporal_desync_oracle_20260704_205813.js: same apparent implementation, predictive ghost, radial tunnel and spiral phosphene field, ping-pong history. Deduplicate before porting.
- neon_trash_oracle_20260725_234300.js: Voronoi/hash noise, localized masks, rings, mutation clock. Adapt bounded local accents.

## Next implementation
First create dedicated Toppers inspector and move or alias existing broadcast/error window controls without changing defaults. Then add deterministic bounded local masks and procedural accents in shared renderer, with density, scale, motion, opacity, palette and blend controls. Integrate category lock/reset, Surprise Me, preview and export. Start with stateless geometry; reserve real temporal sampling for later shared feedback integration. Avoid high-frequency full-screen flashing. Test sparse and dense configurations on mobile.
No shader port or runtime validation in this wave.
