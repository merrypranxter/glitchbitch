# Wave 21 — The Living Food Web

Glitchbitch's colonies now exchange **bounded, conserved nutrient reserves** through a proximity-derived network of six visible, moving phosphor pathways. Each colony may store an optional `webEnergy` integer (0–100), initialized from the existing mineral nutrient resource. A feeding round is an explicit, deterministic Undo step, **not** a background gameplay clock.

**Ecological behaviors**
- **Mutualist exchange:** connected colonies gradually balance their finite resources.
- **Parasitic siphon:** species B takes resources from A at contact; within a single-parent world the higher-allele colony is the thief.
- **Mycelial relay:** stronger redistribution of nutrient reserves along network links.
- **Trophic cascade:** fitter neighbors extract resources from weaker ones, affecting colony radius and, when present, inherited DNA.

**Play:** Effects → Scene → Living Food Web. Choose mode, network reach, feeding pressure, animated speed, filament thickness, brightness and hue. Awaken the network, stage a nearby connection, feed once/three rounds, shuffle, or hide/pause. The network and reserve ledger display current relationships. Drag colonies in Touch to rewire paths.

**Under the hood:** At most six links; link selection uses real 1:1, 9:16, 16:9, etc. aspect-corrected distance, and degree≤3. Each link's two endpoints are supplied via a reusable six-`vec4` uniform buffer, with one optional inline GLSL shader for translucent moving energy packets. No new framebuffer, texture, React animation loop, external dependency or long-running JS simulation. Compilation failure disables the new network material only; colonies and old effects remain.

Feeding preserves total stored resources with integer transfer limits, never deletes organisms, and changes phenotype via radii and inherited alleles; nothing mutates during playback. Records round-trip through recipes and older recipes default OFF. Weighted Surprise/Full Weird can generate a network without forcing a second parent, with a mobile GPU guard for expensive fossil+succession combinations.

**Verification still required:** `npm test`, `npm run build`, preview and export parity, and real iPhone Safari/GIF/MP4 tests. No automatic Netlify redeploy.
