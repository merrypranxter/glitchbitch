import test from "node:test";
import assert from "node:assert/strict";
import {initial} from "../src/data.js";
import {textileEngravingModes,textileEngravingControls,remixTextileEngraving} from "../src/filament-forge.js";
import {textileGroup,protectWeaving} from "../src/weaving-wardrobe.js";
import {remixWeavingSystem} from "../src/weaving-randomizer.js";
test("engraving defaults off and shuffles independently",()=>{
 assert.equal(initial.filamentEngraveMode,"Unengraved");
 assert.equal(textileEngravingModes.length,9);
 const base={...initial,filamentAmount:90};
 for(let j=0;j<8;j++){
  const next=remixTextileEngraving(base,()=>j/8);
  assert.equal(next.filamentEngraveMode,textileEngravingModes[j+1]);
  for(const k of Object.keys(base))if(!textileEngravingControls.includes(k))assert.equal(next[k],base[k]);
  assert.deepEqual(protectWeaving(base,next,["surface-engraving"]),base);
 }
 for(const k of textileEngravingControls)assert.equal(textileGroup(k),"surface-engraving");
 assert.deepEqual(remixWeavingSystem(base,"surface-engraving",()=>.5),remixTextileEngraving(base,()=>.5));
});