import test from "node:test";
import assert from "node:assert/strict";
import {initial,validateRecipe,recipeDocument,parseDocument} from "../src/data.js";
import {textileDimensionModes,textileDimensionTargets,textileDimensionControls,remixTextileDimension,filamentGLSL} from "../src/filament-forge.js";
import {textileGroup,protectWeaving} from "../src/weaving-wardrobe.js";
import {remixWeavingSystem} from "../src/weaving-randomizer.js";
import {readFileSync} from "node:fs";
test("dimension settings preserve original architecture, optical material and lock",()=>{
 assert.equal(initial.filamentDimMode,"Static architecture");
 assert.equal(textileDimensionTargets.length,16);
 assert.equal(textileDimensionModes.length,8);
 const base={...initial,filamentArchitecture:"Möbius membrane",filamentMeta:"Photonic crystal"};
 for(const mode of textileDimensionModes){
  const s={...base,filamentDimMode:mode};
  assert.deepEqual(parseDocument(recipeDocument(s,"dimension",{time:0,colorTime:0})).state,s);
 }
 for(let i=0;i<6;i++){
  const s=remixTextileDimension(base,()=>((i+.5)/6));
  assert.equal(s.filamentDimMode,textileDimensionModes[i+2]);
  assert.notEqual(s.filamentDimTarget,base.filamentArchitecture);
  assert.doesNotThrow(()=>validateRecipe(s));
  for(const k of Object.keys(base).filter(k=>!textileDimensionControls.includes(k)))assert.deepEqual(s[k],base[k],k);
  assert.deepEqual(protectWeaving(base,s,["dimension"]),base);
 }
 for(const k of textileDimensionControls)assert.equal(textileGroup(k),"dimension");
 assert.deepEqual(remixWeavingSystem(base,"dimension",()=>.5),remixTextileDimension(base,()=>.5));
});
test("morph uses geometric fields, bounded midpoint fusion and opt-in shader specialization",()=>{
 const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
 assert.match(renderer,/withTextileDimension = withTextileArchitecture/);
 assert.match(renderer,/withTextileDimension\?"textile-dim"/);
 assert.match(renderer,/#define FILAMENT_ARCH_DIMENSION 1/);
 assert.match(renderer,/#define filamentDimTarget /);
 assert.match(filamentGLSL,/arForm=mix\(arPrimary,arTarget,arBlend\)/);
 assert.match(filamentGLSL,/dmMid=4\.\*arBlend\*\(1\.-arBlend\)/);
 assert.match(filamentGLSL,/arBlend<=\.00001/);
 assert.match(filamentGLSL,/arBlend>=\.99999/);
 for(const k of textileDimensionControls.slice(2))assert.ok(renderer.includes('"'+k+'"'),k);
});
