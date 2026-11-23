# Effects control room

The baseline is `cc8d06e` (Wave 10, G₂ Torsion Membranes). The complete original control inventory is in [effects-control-inventory.md](effects-control-inventory.md).

## Organization

The previous All/On/five-filter experience still encouraged a long stack of sections. Texture and Scene bundled unrelated behavior, and Filament Forge hid entire laboratories several disclosures deep. Search often led only to their parent section. Activity indicators sometimes mistook a dormant parameter or historical counter for a visible system.

The new directory opens one effect editor at a time. It has three views: Explore, Active, and Favorites. Eight families distinguish what the systems do:

| Family | Role |
| --- | --- |
| Signal | Corruption, analog/CRT, print damage, old web and quick switches |
| Materials | Microtexture, substance, living underlay and filament laboratories |
| Light | Refraction, foil, spectral alchemy and photon sculptures |
| Space | Wiggle/parallax and stereo geometry |
| Organisms | Reaction diffusion, colony bodies, cortex, competition and relationships |
| Evolution | Bloodlines, spores, selection, speciation and coevolution |
| Worlds | Atmospheres, backdrops, soil and the Chaos Lab action desk |
| Time | Feedback, fossils, succession and apocalypse |

Math engines and all Shader Vault additions remain in Math. Color, Text, Touch, Layers and the Export dialog retain their existing responsibilities. Rendering, shader, animation-clock, export, recipe, palette and history code is unchanged.

Explore shows sections in the selected family. Search always spans every family, including 23 nested laboratories. Global Find uses the same vocabulary. A result opens its parent section and all required nested disclosures, focuses/highlights the destination and scrolls only the inspector. A compact sticky editor toolbar keeps Back, search and laboratory switching reachable after deep jumps. Long technical explanations remain available in optional “How it works” disclosures.

Active shows enabled sections and dependent laboratories, using renderer prerequisites for biology and ecology rather than just nonzero tuning values. Parent sections and their active laboratories are separate navigable entries. One-shot fossil operations are searchable/favoritable but are not presented as permanently enabled effects. Favorites are versioned UI preferences in `glitch-effect-favorites-v1`; family preference is `glitch-effect-category-v2`. Neither enters artwork recipes or undo history. Unavailable browser storage falls back to session preferences.

## Touch and desktop

The original canvas/control split and divider logic remain intact. Navigation never writes to the canvas ratio. The existing single inspector scroll surface stays below the canvas. Safe-area insets, `viewport-fit=cover`, dynamic viewport height, 44px primary targets, larger slider hit areas and 16px editable fields improve iPhone use. The divider has a 28px grip and retains pointer and keyboard resizing. Desktop gets a wider Effects panel at larger widths and a two-column directory.

A pre-existing startup defect was repaired: the engine picker had 20 engines but only 17 icons. Unknown indices now use a fallback icon, preserving every engine button.

## Adding more weird systems

1. Add the real control body to `EffectsInspector`, keeping artwork state and history bindings there.
2. Add its section metadata, family and reset keys in `ui-index.js`. Use the existing families where coherent.
3. For a nested laboratory, add a unique `data-effect-detail` anchor and an entry in `effect-details.js` with its parent section. Its activity predicate must include actual parent/dependency gates. One-shot actions should return false.
4. Add a renderer-aware override in `effect-activity.js` only when simple section `on` keys are insufficient. Do not use rendering code to store UI preferences.
5. Run `npm run index:effects` to regenerate the static label/field/action vocabulary. Add synonyms in the section/laboratory metadata. Search tests catch missing control labels.
6. Run unit/build/browser checks. The baseline preservation fixture permits additive controls and navigation while detecting removed or changed original control bindings, callbacks, parameter ranges and reset keys.

The UI adds no dependencies, observers, animation loops or additional renderers. Only the selected editor is mounted; navigation preferences stay outside the artwork state.

## Validation

- Production build passes; Vite retains its existing large-chunk warning.
- Unit suite: 675 pass, 29 fail. The same 29 named failures reproduce on pristine `cc8d06e`; there are no newly introduced unit failures. Existing failures include outdated species counts, historical source-regex expectations and export mock assumptions. They are deliberately not “fixed” by altering rendering or weakening unrelated assertions.
- New regression tests cover all 390 original Effects control instances (388 JSX declarations because the quick-toggle map supplies three instances), 204 artwork actions, 286 numeric slider ranges, original reset keys, all 36 directory entries and all 23 laboratory anchors.
- Browser suite covers phone Chromium, phone WebKit and desktop Chromium: all Effects sections, cross-family global Find, deeply nested optics, sticky laboratory switching, favorites persistence/removal, unavailable storage, sliders, presets, section reset, undo/redo, Active, unchanged drafts/canvas dimensions, and pointer/keyboard divider resizing.
- Phone viewport checks: 320×568, 375×667, 390×844, 430×932 and 844×390. Desktop: 1440×1000. No horizontal document overflow or canvas relocation during navigation.
- No application JavaScript errors or React warnings observed. Chromium software rendering emits an expected GPU ReadPixels performance notice, excluded specifically from the console-health assertion.
- Real iPhone hardware, Safari browser-chrome/keyboard behavior, and full-resolution PNG/GIF/MP4 encodes were not exercised in this environment. Rendering/export files are unchanged and the existing parity tests were run as part of the baseline comparison.

Run `npm run build`, `npm test`, and `npm run test:ui`. Playwright browser engines and their normal OS libraries are prerequisites. In this workspace, WebKit required temporary libraries outside the repository; `GLITCH_WEBKIT_EXECUTABLE` optionally selects that local wrapper. No deployment or GitHub Actions workflows are added. Commits use `[skip netlify]` to suppress Netlify builds/previews; the PR must remain unmerged pending review.
