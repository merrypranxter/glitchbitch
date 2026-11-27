import test from "node:test";
import assert from "node:assert/strict";
import {initial,validateRecipe,recipeDocument,parseDocument} from "../src/data.js";
import {textileAlchemyModes,textileAlchemyTargets,textileAlchemyControls,remixTextileAlchemy,filamentGLSL} from "../src/filament-forge.js";
import {textileGroup,protectWeaving} from "../src/weaving-wardrobe.js";
import {remixWeavingSystem} from "../src/weaving-randomizer.js";
import {readFileSync} from "node:fs";
test("material alchemy is separately lockable and keeps geometry and original material",()=>{
 assert.equal(initial.filamentAlchMode,"Stable material");
 assert.equal(textileAlchemyTargets.length,16);
 assert.equal(textileAlchemyModes.length,8);
 const base={...initial,filamentArchitecture:"Rotating tesseract lattice",filamentMeta:"Fractal dichroic glass",filamentDimMode:"Breathing dimensions"};
 for(const mode of textileAlchemyModes){
  const s={...base,filamentAlchMode:mode};
  assert.deepEqual(parseDocument(recipeDocument(s,"alchemy",{time:0,colorTime:0})).state,s);
 }
 for(let i=0;i<6;i++){
  const s=remixTextileAlchemy(base,()=>((i+.5)/6));
  assert.equal(s.filamentAlchMode,textileAlchemyModes[i+2]);
  assert.notEqual(s.filamentAlchTarget,base.filamentMeta);
  assert.doesNotThrow(()=>validateRecipe(s));
  for(const k of Object.keys(base).filter(k=>!textileAlchemyControls.includes(k)))assert.deepEqual(s[k],base[k],k);
  assert.deepEqual(protectWeaving(base,s,["material-alchemy"]),base);
 }
 for(const k of textileAlchemyControls)assert.equal(textileGroup(k),"material-alchemy");
 assert.deepEqual(remixWeavingSystem(base,"material-alchemy",()=>.5),remixTextileAlchemy(base,()=>.5));
});
test("material alchemy blends all finish channels, preserves endpoints and is gated",()=>{
 const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
 assert.match(renderer,/withTextileAlchemy = withTextileMeta/);
 assert.match(renderer,/withTextileAlchemy\?"textile-alchemy"/);
 assert.match(renderer,/#define FILAMENT_ARCH_ALCHEMY 1/);
 assert.match(renderer,/#define filamentAlchTarget /);
 assert.match(filamentGLSL,/mtBands=mix\(bandsA,bandsB,alMix\)/);
 assert.match(filamentGLSL,/mtFinish=mix\(finishA,finishB,alMix\)/);
 assert.match(filamentGLSL,/alMix<=\.00001/);
 assert.match(filamentGLSL,/alMix>=\.99999/);
 assert.match(filamentGLSL,/alBoundary=4\.\*alMix\*\(1\.-alMix\)/);
 for(const k of textileAlchemyControls.slice(2))assert.ok(renderer.includes('"'+k+'"'),k);
});
