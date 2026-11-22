# GLITCHBITCH — Loop Surgery II: Weft Zipper & Iris Portal

The original Loop Surgery (PR #76) offered **Off** and **Soft closure**, which crossfades the end of the video back to its first complete rendered frame. This second wave adds two **artistic spatial closure styles** while preserving the same source-frame endpoint guarantee and ALL real shader/lettering effects.

## Export → Video → Loop surgery

| Mode | How the ending changes | Best for |
|---|---|---|
| **Off** | No closure at all; the original artwork and clip remain untouched | Already seamless animations, original loops, intentional jumps |
| **Soft closure** | Gentle full-frame crossfade to first image | Smooth, conventional repairs; soft optical forms and atmospheric art |
| **Weft zipper** | Alternating horizontal woven ribbons reveal the opening from opposite sides, with deterministic staggered phases | Lace, filament, Witch's Loom, jacquard, embroidery, textile art |
| **Iris portal** | A circular window expands from the middle until the first complete frame fills the canvas | Alien blooms, optics, glass, tunnel/portal effects, living structures |

The same **tail-to-opening blend** duration selector (.25, .5, .75, 1, 1.5 or 2 seconds, bounded by clip length) applies to every active mode. All are optional. Your saved recipe, colors and shader values do **not** change. The exported filename distinguishes `-softloop`, `-weftloop`, or `-irisloop`.

## Why effects and text survive

This isn't a replacement shader, still-image substitute or cheap preview-to-video converter. The renderer draws the **actual** design at every frame, including hybrid threads, retrocausal stitches, real text styling, physical optics, image layers and accumulated frame feedback. The first **fully composited** canvas (including text) is saved in one temporary Canvas2D anchor.

During the chosen final window:

- Soft closure crossfades source-over with a smoothstep alpha, as before.
- Weft zipper constructs an opaque Canvas2D clipping path from up to 48 alternating horizontal ribbon rectangles, with width progressing from zero to full canvas and staggered onset. One `drawImage` reveals the saved opening composite through all visible ribbons at once.
- Iris portal constructs a centered expanding circular Canvas2D clipping path, then draws the saved opening composite inside the window.

At the final frame, every mode draws the full first composite directly with no clipping boundary. **Before the lossy encoder**, the ending pixels match the opening pixels. No extra WebGL renderer is allocated and no stream of decoded frames is stored. A single extra full-size 2D anchor exists only when a closure mode is active; the prior Off performance path stays unchanged.

Every encoder consumes this same post-composited output:

- **Real H.264 WebCodecs MP4:** CanvasSource reads the full composite capture canvas.
- **Native Safari MP4:** the existing MediaRecorder reads the same canvas stream. The original prior fix prevents a second frame-zero render in closure modes.
- **Real GIF:** its palette quantizer explicitly reads the post-closure canvas pixels, not the previous raw GPU buffer.

## Limitations worth knowing

All modes can produce intentional transition artifacts near the ending. Weft zipper has ribbon boundaries; Iris portal has a moving circular edge; Soft closure can ghost moving objects. An H.264 MP4 frame can differ after lossy compression; the GIF's individual palettes can also differ. Exact endpoint equality of the **pre-encode source** is not a mathematically guaranteed perfect loop in perception, velocity or audio.

The seven-frame **Loop Seam Scanner** can still inspect the *actual decoded file* end→start. The PNG-vs-video motion inspector continues to disclose that any active Loop Surgery intentionally changes the tail relative to plain strict PNG references. It does not mistake this deliberate treatment for lost shader effects.

## Manual test on iPhone (recommended)

1. Pull `main` into Google AI Studio. Choose a living textile with clear filament outlines and some wild structural color.
2. Export one **480px GIF, Off** and run Loop Seam Scanner.
3. Export the same preset with **Weft zipper, 0.75s**. Verify the last part closes in alternating ribbons, the filament/optical effects remain present, and the loop seam is reduced.
4. Repeat with **Iris portal**. The circular reveal should expand from center, with all effects still visible.
5. Try **Soft closure** again to confirm it behaves identically to the prior release.
6. Repeat with MP4 at 480px/720px; check normal and heavily styled moving text, 1:1 and 9:16, and any feedback/afterimage effect. Inspect the resulting encoded samples with the diagnostic.
7. Try a large 1080/2160p MP4 only if the device can handle it. All modes use a full-resolution temporary first-frame image, but no extra WebGL context or saved sequence.

## Test status

Targeted V8 validation: **6/6 new Weft/Iris tests plus 7/7 preexisting Soft closure tests**. Includes input rejection, spatial mask geometry, deterministic phase, terminal full coverage, source-frame equality through the **production render workspace executed against a Canvas2D simulation with actual rectangle/circle clipping**, and unchanged GIF/MP4 post-composite capture wiring.

Actual Safari WebGL encoding, live UI/Vite build and decoded GIF/MP4 visual parity remain unverified by these source-level checks. No Netlify deployment requested or explicitly initiated.
