import test from "node:test";
import assert from "node:assert/strict";
import {initial,validateRecipe,recipeDocument,parseDocument} from "../src/data.js";
import {glassCouplingModes,glassCouplingRules,glassCouplingControls,shuffleMathematicalGlass,schlierenFragment,applySchlierenPreset,mathematicalGlassPresets} from "../src/schlieren-glass.js";
test("coupled optical fields save all valid combinations and default to old behavior",()=>{
 assert.equal(initial.schlierenCoupling,"Single field");
 for(const mode of glassCouplingModes)for(const rule of glassCouplingRules){
  const state={...initial,schlierenAmount:90,schlierenMode:"Gyroid membranes",schlierenCoupling:mode,schlierenCouplingRule:rule};
  assert.deepEqual(parseDocument(recipeDocument(state,"coupled glass",{time:2,colorTime:5})).state,state);
 }
 assert.throws(()=>validateRecipe({...initial,schlierenCoupling:"unknown"}));
 assert.throws(()=>validateRecipe({...initial,schlierenLayerAmount:101}));
 assert.match(schlierenFragment,/if\(glassCoupling==0\|\|glassLayerAmount<=\.001\)return first/);
 assert.match(schlierenFragment,/float rx=mathematicalGlassRelief/);
});
test("coupling-only shuffles preserve every other control and existing presets restore single field",()=>{
 const s={...initial,schlierenMode:"Quasicrystal glass",schlierenAmount:92,schlierenCoupling:"Crossed crystal gratings"};
 const next=shuffleMathematicalGlass(s,()=>.71,"coupling");
 assert.notEqual(next.schlierenCoupling,s.schlierenCoupling);
 for(const k of Object.keys(s).filter(k=>!glassCouplingControls.includes(k)))assert.deepEqual(next[k],s[k],k);
 assert.equal(applySchlierenPreset(next,mathematicalGlassPresets[0].name).schlierenCoupling,"Single field");
});
