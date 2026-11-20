# SYMBIOSIS LAB — Wave 11

**Two different organisms can produce a third artwork where they touch.** Earlier waves added two atmosphere species, hand-planted colonies, life cycles, shaped anatomy, cortex, spores, and reactive geology. This wave adds actual **spatial contact biology**: relationship-dependent pixels that only appear where two independent painted habitat masks overlap.

## Four relationships

Effects → Scene → **Symbiosis Lab**:

- **Mutualistic lace:** fluorescent intertwined fungal threads form a cooperative cross-stitched texture in A/B contact regions.
- **Parasitic rot:** invasive shadow channels, infected borders and blackish corrosion consume the contact tissue. A/B dominance chooses which parent's palette colors invade.
- **Hybrid membrane:** a third, time-varying prismatic color family is born where both masks overlap, with laminated spectral structures and independent motion.
- **Electric synapse:** bright, thin bioelectric filaments arc across living contact surfaces.

**Dormant** is the original/default state. Nothing changes in older documents until the user explicitly activates a relationship or chooses a new Lookbook specimen.

Five sliders: Contact chemistry strength, Filigree/lesions/arcs detail, Interface motion, Bioluminescent reaction glow, Parasitic dominance A→B. All bounded 0–100, stateful, undoable and JSON validated.

The new UI buttons are:
- **Spawn symbiosis** applies one of four named relationship specimens and makes both painted parents visible
- **Shuffle symbiosis** draws a new relationship type and parameters, preserving existing art
- **Plant contact pair** adds a small nearby partner colony only if the existing A/B populations are not yet touching; it does not delete or move existing painted seeds
- **Disable reaction (keep colonies)** returns to the original rendering without removing painted seeds, spore generations, palettes, lettering or morphology

At 16 planted seeds, the app never silently evicts or repositions hand-painted art. If two populations are disjoint at capacity, the user can drag existing A/B seeds together. If there is capacity to add a missing contact partner, it appends an ordinary editable Habitat Graffiti seed.

## Four new editable Lookbook worlds

Lookbook count increases from 135 to **139**:

1. **Mycelial Handshake** — electric, mutually beneficial lichen lace
2. **Neon Necrotic Siege** — parasitic black corrosion across territorial borders
3. **Chromatic Third Kingdom** — incompatible colors breed a third prismatic membrane
4. **Synaptic Coral Covenant** — fungal-coral contact becomes bioelectric signaling

All four start with populated, touching A/B colonies, detailed anatomy, living cortex, mineral niches and active spores. These are fully editable procedural recipes, not pre-rendered texture files.

## Shader architecture

- New `src/symbiosis-lab.js` is a small pure-JS relationship state module plus a compact GLSL ES 1.00 effect.
- The renderer already evaluates `atmoAMask` and `atmoBMask` once for each pixel. Wave 11 snapshots their original masks into `symbioticAMask` and `symbioticBMask` *before* the colony-wars priority partition. Symbiotic reaction is calculated from the **pre-competition physical overlap**, so even a territorial war can generate an organism contact layer.
- The relationship shader runs after both independent parent atmosphere compositions and adds no further 16-seed scans, framebuffer reads, FBOs, textures, persistent frame history, network APIs or resource-consuming agents.
- `symbioticContact(a,b)` uses `smoothstep(.10,.65,min(a,b))`, ensuring the relationship exists only inside overlap—never as an independent global paint overlay.
- All movement uses the same continuous `time` and `colorTime` as the preview and high-resolution PNG/GIF/MP4 exporter. The full composition's seamless loop still depends on other enabled effects' frequencies.
- **Compile-on-demand:** the Symbiosis GLSL module is omitted entirely unless `symbiosisAmount>0`, mode isn't Dormant, both A and B atmospheres are enabled, and *both* use Painted colonies. The GPU program cache key distinguishes symbiosis-on/off, preserving the older lean shader.
- Existing Mutate stays conservative and never wakes a dormant symbiotic interaction. Surprise, Shuffle Ecosystem and Freakshow now select relationships automatically when dual atmosphere parents are allowed, including a real contact pair. The **Allow two atmosphere parents** option is honored: no dual means no symbiosis.

## Testing and safety

New test: `tests/symbiosis-lab.test.mjs`. All nine legacy Lookbook-count assertions were updated to 139, including the previously out-of-date wiggle and colony-lifecycle suites.

**Passed in isolated JavaScript source harness:** 8/8 new regression groups, 139 unique validated Lookbook states, 139 exact JSON round trips, safe contact-pair addition and 16-seed cap, real contact in all preset worlds, preserved custom lettering/colors/engine, disabled shader source gating, no-dual setting, and legacy opt-out. Test fixture was corrected when supposed non-touching samples actually touched and correctly caused no redundant seed allocation.

**Still unverified in an actual browser:** full `npm test` and Vite compile, GLSL GPU compilation, iPhone Safari performance with two atmosphere parents + cortex + spores + substrate + symbiosis, actual screenshot appearance, and high-resolution export parity. Pull `main` into Google AI Studio, test mobile preview, undo, seed dragging, and GIF/MP4 exports before using Netlify credits.

Suggested first test: select **Chromatic Third Kingdom** from Lookbook. Toggle **Disable reaction** to compare original A/B masks with the colored third membrane. Move a parent B seed until it no longer overlaps A and watch the membrane vanish. Use **Shuffle symbiosis** for a new relationship, then **Plant contact pair** where room exists.
