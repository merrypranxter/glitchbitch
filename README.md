# GLITCHHHHHH · v2

An animated, touch-reactive WebGL art instrument inspired by Merry's [GLITCHY vault](https://github.com/merrypranxter/shaderslop_designs/tree/main/GLITCHY). Built with React and Vite. No account, API key, paid service, or remote rendering required. Fonts are bundled locally with their OFL licenses.

## Run

Use Node 20+.

```sh
npm install
npm run dev
npm run build
npm run preview
npm test
```

The production output is `dist/`. Serve it with a static web server. WebGL and hardware acceleration are required. Video additionally needs WebCodecs with VP8 encoding in a secure browser (HTTPS or localhost).

## Make something strange

**16 engines:** The original 12 mathematical fields, plus Hyperbolic CRT, Candy fractal portal, Fivefold diffraction, and **Chromatic infection**, a real seeded Gray–Scott reaction-diffusion organism. All retain the palette, touch, layering, and animation pipeline. The Lookbook has **43 editable recipes**, including six biological designs.

**Layers:** Mix, multiply, or take the absolute difference of two scalar fields. The fields share structure controls, local touch sources, and a geometry clock. Blend at zero bypasses the second engine completely.

**Shape:** Complexity, scale, domain warp, rotation, 1–12-fold kaleidoscope, and mirror. Choose 1:1, 9:16, 16:9, 3:4, or 4:3; the canvas preserves that exact ratio in both preview and export.

**Color:** All eight original palettes plus eight new ones; create, name, and save up to 32 custom palettes. Import 2–8 six-digit hex colors or a Coolors URL. Add/remove stops, reverse or rotate them, and adjust saturation, contrast, brightness, offset, and repetition. Named source colors are retained without substitution.

**Color choreography:** Independent color and geometry clocks. Opt into traveling phase waves, a harmonic 1:2:3 color canon, or a phase vortex with Rhythm amount. Freeze either clock separately. At zero rhythm amount, the original color-phase mapping is preserved. These are analytic color-phase fields; they are not dye transport or spectral simulations. Palette interpolation uses cyclic smoothstep interpolation in display sRGB, with final sRGB clipping.

**Effects:** Chromatic separation, smooth signal drift (no hard full-width tracking seams), block corruption, pixelation, scanlines, film grain, vignette, phosphor bloom, color posterization, inversion. New appearance controls include CRT subpixels, ordered dithering, CMY risograph, ink misregistration, procedural fake error windows, glitter, and broadcast color bars.

**True frame memory:** Optional GPU feedback adds Afterimage, Temporal Datamosh, Memory Drift and Memory Decay. With both Afterimage and Datamosh at zero, rendering uses the original single-pass path. When enabled, an offscreen framebuffer captures the current scene and reuses the previous composited frame. Image export uses deterministic short history pre-roll; video export simulates feedback across frames. This increases GPU memory use; if an unsupported device fails to initialize feedback, the app falls back to the original renderer.

**Explore:** Surprise me changes independent mechanisms; engine and palette locks protect your choices. Mutate makes smaller parameter changes. Both preserve touch sources and aspect ratio. Undo reverses either action.

## Touch the math

- Paint local Warp, Vortex, Repel, or Chroma sources. Chroma alters the local color phase without deforming geometry.
- Pinch and twist with two fingers to resize, rotate, and reposition a source. Releasing one finger does not accidentally resume painting.
- Move and Erase tools edit existing sources. Show touch handles to inspect them, then use the source inspector for strength, radius, angle, and deletion. Focused handles can be nudged with arrow keys.
- Each stroke or pinch is one undo transaction. Escape, pointer cancellation, app blur, context loss, and canvas resize cancel the active gesture.
- The 32 most recent sources are retained. Declarative source IDs, normalized positions, radii, angles, modes, and strengths are saved in the recipe. Coordinates use bottom-left UV; radius is in normalized artwork-height units.
- Toolbar controls provide a keyboard/mouse alternative to gestures. On phones, artwork stays above collapsible control panels.

Space plays/pauses; Ctrl/Cmd+Z undoes; Shift+Ctrl/Cmd+Z redoes; F enters fullscreen; H toggles Focus mode; ? opens the guide. Native text controls retain their normal keyboard behavior. Reduced-motion preferences pause playback initially.

## Keep your creations

- **PNG:** A separate full-resolution render at 1080, 2160, or 4096 pixels on the long edge, subject to the device's actual WebGL limit. Preview quality never limits export resolution. Interface chrome and touch handles are excluded.
- **Video:** A fully rendered 2, 4, 6, or 10 second WebM clip at 480, 720, or 1080 pixels on the long edge. Every frame is sampled at an explicit timestamp and encoded at 20 fps using WebCodecs and Mediabunny in quality mode, with encoder backpressure and a final packet-count check. Rendering can take longer than playback, without dropping frames or changing duration. Frozen channels stay frozen. Keep the tab visible; cancel remains available. These clips are **not certified seamless loops**. Browsers without VP8 encoding retain PNG and recipe export.
- **Recipes:** Versioned JSON preserves the seed, title, both clocks, palette stops, all effects, both engines, aspect ratio, and touch sources. Invalid or oversized files are rejected before changing the artwork. Original v1 recipes remain loadable. Imports and saved works open paused at the stored frame.
- **Vault:** Bookmark stores up to 40 named snapshots with thumbnails in this browser. Search by title, engine, or palette; sort works; export individual recipes; undo a deletion. Nothing is automatically evicted to make room.
- **Draft:** Settings and title autosave after editing, with periodic clock checkpoints. Browser storage errors are reported. Local storage is not cloud backup; export recipes for portable, durable copies.

## Rendering and resilience

The 12 original engines remain analytic, while frame memory is a separate optional stateful GPU pass. Geometry and color clocks integrate elapsed seconds, independently of preview frame count. Hidden tabs pause both clocks. Opening a dialog holds the preview; video rendering samples an independent exact frame schedule from the chosen frame.

Preview drawing is capped at 30 fps. Eco/Balanced/Sharp use approximate pixel budgets of 0.32/0.8/1.8 megapixels. Auto starts from Balanced and changes only preview scale (100%, 75%, 55%) after sustained load, with a longer recovery dwell. No equation, octave/iteration count, source, seed, or palette changes with quality. The FPS readout measures submitted draw cadence, **not GPU timing**. This governor is conservative; device performance still requires real-device testing.

WebGL resources have no depth, stencil, MSAA, or simulation textures. A single RGBA8 preview color attachment has approximately 1.28 / 3.2 / 7.2 MB payload at those pixel budgets; browser compositor/back buffers and driver overhead are additional and are not measured VRAM. A 4096² RGBA8 export has a 67.1 MB color payload plus encoding/driver overhead. Export rendering and buffers are independent of preview. Video additionally owns reusable RGBA readback/image buffers and a 2D capture canvas; encoder and muxer buffering are additional. Encoded frames are submitted with backpressure rather than retained as an unbounded raw-frame collection.

WebGL2 fences pace submissions so the renderer does not flood a busy GPU; WebGL1 remains a compatibility fallback. Video capture waits for each completed frame, reads its RGBA pixels into a reusable buffer, and encodes it at an explicit timestamp. The renderer caches uniform locations and buffers, bypasses disabled secondary-field/channel work, disposes capture resources, and rebuilds GPU resources after context restoration from the unchanged CPU recipe and clocks. No reseeding occurs during recovery.

## Source provenance

Inspected reference sources:

- [acid-bloom.js](https://github.com/merrypranxter/shaderslop_designs/blob/main/GLITCHY/03-datamosh-digital-rot/acid-bloom.js): ring interference and banded tracking tears.
- [acidic-fractal.js](https://github.com/merrypranxter/shaderslop_designs/blob/main/GLITCHY/05-psychedelic-glitch-art/acidic-fractal.js): iterative coordinates, neon palettes, procedural noise.
- [acidic-analog-glitch.js](https://github.com/merrypranxter/shaderslop_designs/blob/main/GLITCHY/02-vhs-crt-analog/acidic-analog-glitch.js): analog color and channel separation.
- [Hot Pink Glitter Palettes](https://github.com/merrypranxter/shaderslop_designs/blob/main/myspace_glitch/source-library/myspace_aesthetic/myspace_angelfire_graphics_style/03_palette_and_effects/hot_pink_glitter_palettes.md): Bubblegum Shock, Barbie Reactor, and Kiss Badge Pop, preserved verbatim.

New parameterized shaders use direct WebGL without Three.js. These are artist's mathematical models, not calibrated physical simulations.

## Verification and creative crew

`npm test` exercises recipe migration/validation, exact document round trips, palette parsing, locked randomization, actual pinch/source semantics, move/erase, and export dimensions. Browser verification uses installed Chromium through Playwright because no Browser plugin is exposed. Local browser checks cover all engine and layer modes, touch edits and cancellation, palette import/locking, collection workflows, full-resolution PNGs, context recovery, and responsive controls. FFprobe/FFmpeg verified a two-second 720px WebM with 40 distinct decoded frames and exact 20 fps timing. Physical iPhone Safari, thermal behavior, and on-device video encoding remain unverified.

Creative Plugin Ringmaster continues to coordinate this project. Gesture Witch informed touch transactions; Chromatic Choreographer informed independent analytic color phases; Rendering Survivalist informed preview/export separation and context recovery; Frontend App Builder and Frontend Testing Debugging informed interface and visual/browser QA. These were skill-readable guidance, not remotely executed specialist services. Development uses local previews; hosting is configured separately. Reconsider the crew for seamless encoding, additional simulations, or measured device performance work.


## Motion is part of the artwork (Wave 3)
Surprise Me now always gives the design independently adjustable **Structure movement**, **Motion pace**, **Living light/shimmer**, and one of five movement styles: Liquid flow, Breathing, Orbital, Traveling waves, or Internal turbulence. This adds continuous animation even to mathematical structures that otherwise look visually stationary. Older saved recipes default to motion off, preserving their legacy appearance. The existing independent geometry and color clocks still govern animation; Pause freezes both, while Freeze geometry permits light to continue with the color clock. All controls are part of undo/redo, saved recipes, PNG capture and video exports. The shader motion is smooth in space, with no hard horizontal seam bands.

## Biological Signal Rot — Wave 3B
A dedicated, deterministic seeded 96×96 CPU Gray–Scott chemical field with wrapped 9-neighbor Laplacian is uploaded as a low-resolution RGBA texture for the normal WebGL compositor. The growth is real (U/V reactions and diffusion), not a static Voronoi effect. It is selectable as engine 15, compatible with the second-layer blend, and additionally available as a palette-mapped organism overlay on every existing engine. **Effects → Biological Signal Rot** exposes overlay intensity, feed, kill, growth speed and veins. Surprise Me can include it. The biology only allocates/updates when selected or enabled; the default is off for old recipes. Updates are bounded to protect mobile devices, so a large timeline seek may skip intermediate steps rather than replay minutes of chemistry. Video uses the same evolving simulation; export and Lookbook initialize identical seed states, but exact preview history at arbitrary late timestamps is not replayed. Actual iPhone Safari GPU compilation and performance remain to be tested.

## Total-rebirth Surprise and shared palette vault
**Surprise Me** now chooses a DIFFERENT mathematical family, completely new seed, new palette from the 192 included vault entries, regenerated geometry/layers, fresh optional touch marks, new animation clocks, motion style and appearance effects. Current aspect ratio and undo remain. Lock toggles apply to preservation workflows, not the full-rebirth Surprise. **Mutate** remains a gentle editable nudge and retains the current touch marks/engines.
The shared palette vault comes from `lightloom_art/src/palette-vault.js`, preserving all 176 verified named entries, provenance, sequence and their twelve-color source arrangements. With the original 16 Glitchbitch sets this supplies **192 built-in palettes**. The renderer and recipes now support 2–12 ordered colors. Color Lab imports/exports portable JSON palette libraries; up to 128 custom libraries can be retained in browser storage. Older 2–8-stop recipes remain compatible.


## Real animation exports — MP4 and GIF, never WebM
**Video → MP4** exports H.264 in an MP4 container through Mediabunny/WebCodecs, with a Safari-native MP4 MediaRecorder fallback if WebCodecs H.264 is unavailable. This is not WebM renamed to MP4. Choose 24/30 fps, 8/16/24 Mbps bitrate, 2–30 seconds, resolutions up to 2160px on capable devices, and all five aspect ratios (H.264 even-dimension rounding). iPhone share sheet is offered after export if file sharing is supported. If no MP4 encoder is available, the app clearly reports that rather than quietly downloading WebM.
**Video → GIF** locally encodes actual looping animated GIFs at 15 fps, 2–10 seconds, up to 1080px, via bundled MIT-licensed gifenc 1.0.3. This keeps the build dependency lock unchanged and works offline once the app is loaded. GIF uses per-frame quantization; 256-color limits are inherent to the format. PNG still exports full-resolution and recipes remain independent, backward-compatible JSON. All visual layers and palettes feed the same export renderer. Mobile memory limitations still apply, especially for 2160px MP4 and 1080px GIF.


## Stereo Ghost Machine — real 3D depth
Engine 16 raymarches a real, animated signed-distance scene rather than applying a flat RGB offset: five families (gyroid TPMS, breathing metaballs, opal linked torus rings, crystalline lattice and 3D ribbon wormhole), four-tap normals, normal/distance-dependent color from **all 192 existing palettes**, moving specular/rim highlights, distance fog, and sinusoidal off-axis camera/parallax. Its **3D overlay** also combines with any 2D engine, and the ordinary glitch, print, biological, touch, color and frame-memory post-processes still apply. The stereo raymarch module is omitted from shader programs when not selected, preserving old designs' performance. **Effects → Stereo Ghost Machine** controls shape, blend, depth, parallax, deformation, light, wiggle and per-pixel ray steps (20–48). Six new editable spatial presets bring the Lookbook to **49**. Surprise Me can select the 3D engine or overlay; old recipes render unchanged with the 3D amount set to zero. Output passes through the existing PNG / MP4 H.264 / GIF renderer. Real iPhone GPU compilation/performance still requires device testing.

If an iPhone/WebGL driver rejects the 3D shader at compilation time, the renderer automatically switches to the existing 2D Liquid Marble engine and preserves the current recipe instead of leaving a blank canvas. A console warning identifies the fallback. The app does not claim that failed 3D effects were rendered.


## Wave 4A — crossbreed your material and typography
The **Prismatic Tape Deck** is a stackable material renderer for every existing field: simulated thin-film optical phase, opalescent microcells, dichroic prism color and slope-reactive foil highlights, all animated by the existing color clock and matched to the currently selected 2–12-stop artist palette. This is a spectral-inspired approximation, not full wavelength ray optics. The material shader is compiled only when any material amount is nonzero, preserving the old appearance otherwise.
The **Kinetic Type Storm** uses *actual editable text* rendered to a 1024×512 Canvas2D glyph mask and uploaded as a WebGL texture, then animated, warped and composited using four materials (Neon bling, RGB split, Chrome foil, Void stencil). Input can be edited in Effects; it appears in PNG, MP4/H.264 and GIF exports as part of the original renderer. Max 56 printable characters; clears to no overlay. Type textures are updated only when words change, not every animation frame. Shader effects still apply on top, including scanlines and CRT damage. If font/Canvas2D setup fails, text falls back without blanking the art.
**Surprise Me** may spawn new phrases, material coatings and animation parameters while preserving only aspect ratio; Mutate nudges both. Eight additional crossbred looks bring the gallery to **57**. Original recipes default to all new optical and lettering amounts disabled. No paid services or Netlify deployment.

A progressive GPU fallback now disables unsupported kinetic-lettering, prismatic-material or stereo effects individually, in that order, to keep the original mathematical artwork visible if a phone rejects an optional shader. It reports the fallback in the console. This does not pretend an unsupported effect rendered successfully.


## Wave 4B — Composition Witch spatial crossbreeding
On the **Layers** tab, enable the existing second mathematical field, then enable **Spatial Composition**. This is a genuine two-field color compositor, not a texture overlay: the primary structure occupies the canvas while the secondary engine appears in animated masked territories. Six layout species: breathing Iris Portals, flowing Braided Ribbons, Cell Colonies, Patchwork, Orbital Archipelagos and staggered Woven Windows. Controls independently tune territory strength, density, feather, movement, second-field palette phase shift, and a separate territory variation. Territories share your selected palette (not a second independently chosen palette). Previous Mix / Multiply / Difference interactions continue inside those territories. Both mathematical structures use their normal clocks, color vault, and touch inputs. The spatial mask's smooth boundaries are distinct from the old accidental full-width tracking tear.
Zero composition amount retains the original full-canvas blending algorithm exactly; the additional shader module is only compiled when secondary blending and nonzero spatial composition are active. Surprise Me now almost always picks a novel composition species, significant movement and strong crossbreed, while Mutate gently nudges parameters. Ten new editable starting points expand the Lookbook to **67**. This mode also feeds the same 3D/biology/prismatic/lettering layers and PNG/MP4/GIF exports. All new fields are validated and save in recipes. iPhone visual compilation and performance need testing.

Territory layouts have an independent **Variation** setting and a one-click **Shuffle territory layout** button that does not change your underlying math/seed or palette. **Swap mathematical worlds** exchanges the two engines, fully undoable. When the secondary engine is Stereo Ghost Machine, the 3D overlay is also spatially masked to the animated territory geometry, instead of painting across the entire canvas.

An unsupported composition shader is automatically disabled for the current rendering context with a console warning, retaining the original full-canvas two-engine mix. A failed optional effect does not delete recipe settings.


## Wave 4C — living backgrounds and full Surprise coverage
**Effects → Living Backdrops** now adds a separate six-species animated negative-space underpainting: Nebula Veils (moving volumetric-looking fog), Cosmic Pollen (microscopic swarms), Caustic Undercurrent (flowing refracted-like light), Ghost Architecture (soft layers of floating forms), Phosphor Jacquard (woven luminous threads), and Opal Cell Fog (moving translucent membranes). All use the active artist palette with independent hue phase, density, luminosity, depth, motion and variation. A background shuffle button changes only its variation. The effect uses both geometry and color clocks, creates motion even behind visually stationary foregrounds, and runs in the normal GPU render path for stills and MP4/GIF. It is *opt-in* for prior recipes and compiled out entirely when intensity is zero. This is visual negative-space underpainting composited inside the shader, not a separate framebuffer or external image. A device that rejects the shader uses the legacy rendering fallback.
**Surprise Me coverage contract:** all new and existing numerical sliders are instrumented by setter tracking. When a future numeric slider is added without its own aesthetic distribution, Surprise Me automatically assigns a valid random value; purpose-built distributions take priority. The old aspect ratio, undo and pause state are preserved. All visual mode changes are deliberately different where practical: engine family, motion mode, color animation, touches, material type, composition and backdrop species. New Surprise results always have a living background and nonzero animation speed, but every part is editable and can be disabled. Mutate retains the current species and nudges its parameters. Nine curated backdrops bring the Lookbook to **76**. iPhone shader compilation and export speed are still subject to device testing. No paid deployments.

## Words now belong entirely to the artist
Surprise Me never generates typography. Four decorative Type presets were reimagined as material-only art, and decorative words were removed from the backdrop/composition examples. **Effects → Your Words — Optional Quotes** accepts up to 280 characters including line breaks. Typing automatically activates your quote; clear it or set opacity to zero to remove it. Text is wrapped by actual measured glyph width and fitted to the artwork's aspect ratio with generous margins. The same quote canvas is used in PNG/GIF/MP4 exports. Previously saved manually authored text is preserved until you choose to remove it; Surprise Me clears it for a fresh wordless artwork.

## Wave 4D — living microstructures (without decorative words)
Six opt-in animated textural organisms are layered over existing mathematical fields: **Living Embroidery**, **Opal Granulation**, **Gel Caustics**, **Point Lace**, **Glass Filaments** and **Crystalline Cilia**. Each uses independent movement, density, scale, relief, palette offset and variation, with a texture-only reseed control under Effects. This applies to the existing 17 engines and exports through PNG, GIF and actual H.264 MP4. Surprise Me picks a different texture species, explicitly randomizes every new control, but never generates typography; user quotes remain optional and manually written. Eight new wordless looks bring the Lookbook to **84**. Existing recipes default to 0 microtexture and render unchanged. The shader is only compiled when enabled; if an iPhone driver rejects it, the new effect is disabled without losing the underlying art. Device-level Safari shader and encoding performance remain unverified.

## Retro MySpace font closet — 39 font styles
The manually controlled quote tool now includes 39 grouped typeface choices, from period-accurate web-safe classics (Comic Sans MS, Impact, Courier New, Verdana, Georgia, Trebuchet, Tahoma, Papyrus, Old English) to twenty bundled open-license pixel, emo, cursive, goth and Y2K designs. Actual classic Microsoft fonts are **not redistributed**; where a particular proprietary face isn't installed, an openly licensed close-in-spirit bundled replacement takes over. The **font picker has a live text preview** and **Shuffle Font (keep your words)** button. `letteringFont` is validated, saved in recipes, undoable, and changes live in the shader's quote texture. The font asset is loaded on demand; a paused canvas redraws when the asset arrives. PNG and GIF/MP4 exports wait for the chosen bundled typeface instead of silently rendering a generic fallback. The original bold font remains the default for legacy saved recipes. Surprise Me **always clears lettering**, but preselects a new font in case the artist types a quote afterward; it never generates words. No Netlify or paid API. Font license texts are included in `public/fonts/licenses-*.txt`, and the font files are served from the app's own public assets.

## Studio UI — pinned canvas & draggable split editor
On phone/tablet widths (≤980px) the canvas remains pinned in the upper pane while the **only scrollable region is the editor controls**. A touch- and keyboard-accessible grab handle resizes the upper art pane between 30%–78% of the studio viewport; double-tap resets, and the split persists locally. Six editor tabs (Math, Color, Effects, **Text**, Touch, Layers) keep the control pane focused on one task. The 39-font custom-quote tool has been moved from Effects to its own Text inspector, without altering the recipe, fonts, or PNG/MP4/GIF output. Inspector sections are collapsible using accessible disclosure buttons; the most-used section of each panel opens by default on mobile. The layout is fixed inside the viewport to avoid repeated vertical page scrolling and retains the existing full-screen focus mode. The old main artwork is not re-created when changing tabs or dragging the split. A central line seen in an AI Studio screenshot appears to span the dotted stage beyond the canvas; no in-app stage overlay or 3D ruler is intentionally drawn. Actual AI Studio overlay behavior needs checking in preview.

Short mobile viewports keep at least approximately 175px reserved for the editor region while resizing; the mobile split resets on double-click and exposes Up/Down/Home/End keyboard movement. Core inspector sections (Math engine, Palette Vault, Effects signal, manual Text, Layers primary field and Touch) start open, with additional sections collapsed to reduce scrolling. This work was statically checked for mobile layout contract; actual AI Studio/iPhone preview still requires visual verification.
