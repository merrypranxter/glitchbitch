// UI-only activity indicators. Reuse the renderer's activation rules rather
// than mistaking an unused tuning value or an archived counter for live art.
import { geneEnabled } from "./colony-genetics.js";
import { substrateEnabled } from "./substrate-alchemy.js";
import { apocalypseActive } from "./apocalypse-clock.js";
import { fossilEnabled } from "./fossil-record.js";
import { successionEnabled } from "./ecological-succession.js";
import { foodWebActive } from "./living-food-web.js";
import { symbiosisActive } from "./symbiosis-lab.js";
import { selectionActive } from "./selection-chamber.js";

const hasPaintedSeeds = (state) => (state.habitatStamps || []).some((seed) =>
  seed.parent === 0
    ? state.atmoAmount > 0 && state.atmoMaskMode === "Painted colonies"
    : state.atmoBAmount > 0 && state.atmoBMaskMode === "Painted colonies");
const masked = (state) =>
  (state.atmoAmount > 0 && state.atmoMaskMode !== "Everywhere") ||
  (state.atmoBAmount > 0 && state.atmoBMaskMode !== "Everywhere");

/** Return undefined for sections whose simple metadata already describes activity. */
export function effectActivity(id, state = {}) {
  switch (id) {
    case "fx-toggles": return Boolean(state.bloom || state.posterize || state.invert);
    case "chaos-lab": return false; // An action desk, not an enabled effect.
    case "bio": return state.engine === 15 ||
      (state.blend > 0 && state.secondaryEngine === 15) || state.bioAmount > 0;
    case "stereo": return state.engine === 16 ||
      (state.blend > 0 && state.secondaryEngine === 16) || state.stereoAmount > 0;
    case "substrate-alchemy": return Boolean(substrateEnabled(state));
    case "apocalypse-clock": return Boolean(apocalypseActive(state));
    case "fossil-record": return Boolean(fossilEnabled(state));
    case "ecological-succession": return Boolean(successionEnabled(state));
    case "living-food-web": return foodWebActive(state);
    case "symbiosis-lab": return Boolean(symbiosisActive(state) && hasPaintedSeeds(state));
    case "selection-chamber": return Boolean(selectionActive(state));
    case "mutation-bloodlines": return Boolean(geneEnabled(state));
    // These labs commit changes into existing genomes rather than enabling a
    // separate shader. Only show them while their resulting living DNA is visible.
    case "speciation-lab": return Boolean(geneEnabled(state) &&
      (state.habitatStamps || []).some((seed) => seed.clade));
    case "coevolution-lab": return Boolean(geneEnabled(state) && state.coevoRound > 0);
    case "spore-dynasty": return Boolean(state.sporeAmount > 0 &&
      state.sporeMode !== "Dormant" && hasPaintedSeeds(state));
    case "colony-cortex": return Boolean(state.colonyCortexAmount > 0 && hasPaintedSeeds(state));
    case "colony-anatomy": return Boolean(state.colonyAnatomyAmount > 0 &&
      hasPaintedSeeds(state) &&
      (state.colonyAnatomyPores > 0 || state.colonyAnatomyRim > 0 ||
       state.colonyShapeA !== "Classic disks" || state.colonyShapeB !== "Classic disks"));
    case "colony-life": return Boolean(
      (state.colonyLifeAmount > 0 && state.colonyLifeMode !== "Still" && hasPaintedSeeds(state)) ||
      (state.colonyFrontGlow > 0 && masked(state)));
    default: return undefined;
  }
}
