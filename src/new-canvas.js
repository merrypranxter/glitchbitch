// A genuine blank-session reset, not Surprise Me and not an engine reseed.
// Keep it derived from the exact same original starter used by first launch.
import {initial} from "./data.js";

export const STARTER_TITLE="Untitled exploration";
export function createNewCanvas(){
  // The default palette/brush arrays must never share mutable references
  // with a previous art session or the module's canonical initial recipe.
  return {
    state:JSON.parse(JSON.stringify(initial)),
    title:STARTER_TITLE,
    timeline:{time:0,colorTime:0,textTime:0}
  };
}
