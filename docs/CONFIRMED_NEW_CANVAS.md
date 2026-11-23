# Confirmed NEW CANVAS

In the studio, click **New Canvas** beside Lookbook (compact **New** action beside the artwork on phones). The same action is searchable through **Find → New Canvas / Fresh start / Reset artwork**.

The first click does **not** alter the artwork. A native, accessible `<dialog>` explicitly warns that the current unsaved canvas, paint strokes, effects, palette, text and animation will be replaced, with options **Cancel — keep my art** and **Yes, new canvas**. Escape, outside click or Cancel dismisses without changing state.

After confirmation:
- Deep-clone Glitchbitch's original `initial` recipe from `src/data.js` (including starter seed 82491 and original color stops).
- Clear all current brush marks, geometry/effect settings, lettering and active shader modes to that exact starter recipe, **not** to a newly randomized seed.
- Restore the original title `Untitled exploration`.
- Reset geometry, color and text clocks to 0.
- Reset the active editing tool to Paint, clear selected handles, close Focus and reset active math/color Surprise Me locks.
- Start fresh undo/redo stacks and cancel any unfinished gesture/slider transaction. Unlike Surprise Me, a confirmed fresh canvas is a **new document**, not a reversible change to the current document.
- Immediately autosave the new default draft in `glitch-draft`, with normal timed autosave continuing afterward.

**These are NOT deleted or modified:** Saved works gallery, custom palette library, favorite effect groups, effect navigation preferences, current canvas-pane divider size, exported files, GitHub repo content, and user-created palettes.

Implementation:
- `src/new-canvas.js`: pure `createNewCanvas()` from the canonical initial recipe.
- `src/useHistory.js`: explicit document-reset method that clears edit transactions and undo stacks.
- `src/main.jsx`: labelled button, confirmation, reset handler and Find routing.
- `src/ui-index.js`: findable global action.
- `src/style.css`: touch-friendly button and confirmation actions.
- `tests/new-canvas.test.mjs`: six Node regression cases (including deep cloning, round-trip, gating and Find).
- `tests/e2e/new-canvas.spec.js`: three browser checks for cancellation, full reset and saved-vault preservation, plus mobile visibility.

No changes to shaders, renderers, export formats, codecs, effects, advanced inspectors or Codex's reworked Effects navigation. No Netlify/GitHub Actions build is triggered. Full Vite/Playwright/browser verification should be run on a machine with repository access, since this connector-only session does not have a local checkout.
