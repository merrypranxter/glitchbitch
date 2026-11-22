# Regeneration Loom II: Graft Architectures and Smooth Lifecycle

The existing **Regeneration Loom** already grew actual daughter-thread distance fields from damaged filaments; this wave extends its six forms to **twelve** and repairs the abrupt end-of-cycle disappearance.

## New fiber anatomies

### Traditional repair
- **Darning ladders**: two new parallel rails are joined by transverse rungs. The daughter geometry uses a bounded 2D distance expression in thread-distance and local arclength.
- **Sashiko crosshatch**: crossing diagonal repair fibers meet along each moving parent strand, producing X-shaped stitches.

### Mutant tissue
- **Coral anastomosis**: two arching new fibers leave the parent, separate and reconnect near their endpoints.
- **Axolotl frills**: seeded stations grow many little radial frill-fingers along active thread roots.
- **Opal vesicle lattice**: hollow, loop-like vesicles appear as circular daughter-fiber distance fields.
- **Impossible graft loops**: paired, countercurving strands twist across one another as they grow.

All six are **new geometry**, merged into the actual **core**, **halo**, and **edge** masks before color, existing material physics, scar lighting, stitching, and jewelry. They are procedural 2.5D, not volumetric mesh structures or persistent stateful tissue.

Six new one-click presets: Ladder of the Seam Witch, Repair by Starlight, Electric Coral Arteries, Axolotl Funeral Frills, Vesicles in Velvet, and Graft From Nowhere. The existing twelve-look selector and randomizer require no new artist-facing settings; these designs use the original five Regeneration Loom controls.

## Loop repair

Previously, daughter age used `fract()`, and the geometry could disappear suddenly at the age wrap even though it had been fully grown on the previous frame. This change preserves the **forward-only** growing-tip motion, holds the expanded daughter for part of the cycle, then introduces a smooth senescence fade (`1.0-smoothstep(.79,.985,age)`).

The child opacity is zero on *both* sides of the wrap. The growth tip is not played backward (no boomerang). This avoids flicker at the cycle boundary while still keeping explicit deterministic `time` evaluation for direct MP4/GIF frame sampling.

## Integration and backward compatibility

- Extends existing `filamentRegenModes`, `filamentRegenDescriptions`, `filamentRegenFamilies` and `filamentRegenPresets`.
- `specializeFilamentRegeneration` removes all eleven unused geometry branches before WebGL shader compilation on the iPhone.
- Saved recipes retain their exact existing mode names and numeric values. With Regeneration off, the source compiles the original behavior and leaves old artworks unchanged.
- Existing UI, palette, materials, jewelry, crosses, scar systems, generator and video output remain integrated; Find a Control now indexes all twelve modes and presets.
- No additional GPU textures, frame-history loops, canvas readbacks, independent timers, network calls, encoding changes or Netlify deployment.

## Verification

The module was parsed/evaluated in V8 and **2,154 direct structural checks** passed, including selected-branch pruning, twelve distinct spatial signatures, all **22×31 = 682** geometry/stitch compositions with material/contagion/nerve/ghost-scar stacks, the unchanged strict export guard and existing Safari ping-pong repair. The existing regeneration Node regression was extended with lifecycle-boundary assertions.

**Not verified:** full npm/Vite suite, actual WebGL compilation on the iPhone, or real GIF/MP4 visual parity. For device QA, pull latest `main` into Google AI Studio, select **Darning ladders** or **Coral anastomosis**, check 480px strict-effects proof, then short MP4 before large exports. If the device compiler reports a syntax error, capture its exact text rather than reducing video bitrate.
