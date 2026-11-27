import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {findControls,sectionMeta} from "../src/ui-index.js";
import {entriesForScope,readFavorites} from "../src/effects-navigation.js";
const read=p=>readFileSync(new URL("../src/components/"+p,import.meta.url),"utf8");
const color=read("ColorLab.jsx"), effects=read("Inspectors.jsx");
const cases=["alchemy","foil","chromatic-split","fx-toggles","subpixel-moire","print-injury","print"];
test("Standalone color and print panels have one home, in Color",()=>{
 for(const id of cases){
  assert.equal(sectionMeta(id).tab,"Color");
  assert.ok(entriesForScope("color").some(e=>e.id===id));
  assert.ok(!entriesForScope("effects").some(e=>e.id===id));
  assert.ok(!new RegExp('^    (?:"'+id+'"|'+id+'): <>','m').test(effects),id);
  assert.ok(new RegExp('^    (?:"'+id+'"|'+id+'): <>','m').test(color)||id==="fx-toggles",id);
 }
 assert.ok(!effects.includes('name="split"'));
 assert.ok(color.includes('name="split"'));
});
test("Find follows the relocated modules and preserves the old favorites",()=>{
 for(const [query,id] of [["Chromatic Alchemy","alchemy"],["Print & Spectrum Injury","print-injury"],["print sorcery","print-injury"],["CMY risograph","print"],["Chromatic split","chromatic-split"],["Prism foil","foil"],["Spectral pigment","chromatic-engine"]]){
  assert.ok(findControls(query,30).some(e=>e.id===id&&e.tab==="Color"),query);
 }
 assert.deepEqual(readFavorites({getItem:()=>JSON.stringify(cases)}),cases);
});
