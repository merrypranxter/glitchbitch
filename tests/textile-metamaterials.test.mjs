import test from "node:test";
import assert from "node:assert/strict";
import {initial,validateRecipe,recipeDocument,parseDocument} from "../src/data.js";
import {textileMetaModes,textileMetaControls,remixTextileMeta,filamentGLSL} from "../src/filament-forge.js";
import {textileGroup,protectWeaving} from "../src/weaving-wardrobe.js";
import {remixWeavingSystem} from "../src/weaving-randomizer.js";
import {readFileSync} from "node:fs";
test("metamaterials preserve architecture and recipe compatibility",()=>{
 assert.equal(initial.filamentMeta,"Natural scaffold");
 assert.equal(textileMetaModes.length,17);
 assert.deepEqual(textileMetaModes.slice(9),["Liquid crystal membrane","Translucent aerogel","Ferrofluid embroidery","Fractal dichroic glass","Anisotropic liquid metal","Bioluminescent gelatin","Opalescent cellular foam","Iridescent crystalline velvet"]);
 const base={...initial,filamentArchitecture:"Microbial lace"};
 for(let i=1;i<textileMetaModes.length;i++){
  const s=remixTextileMeta(base,()=>((i-.5)/(textileMetaModes.length-1)));
  assert.equal(s.filamentMeta,textileMetaModes[i]);
  assert.doesNotThrow(()=>validateRecipe(s));
  assert.deepEqual(parseDocument(recipeDocument(s,"meta",{time:0,colorTime:0})).state,s);
  assert.ok(filamentGLSL.includes("mtMode=="+i+"){"));
  for(const k of Object.keys(base).filter(k=>!textileMetaControls.includes(k)))assert.deepEqual(s[k],base[k],k);
  assert.deepEqual(protectWeaving(base,s,["metamaterials"]),base);
 }
 for(const k of textileMetaControls)assert.equal(textileGroup(k),"metamaterials");
 assert.deepEqual(remixWeavingSystem(base,"metamaterials",()=>.5),remixTextileMeta(base,()=>.5));
});
test("optical materials are specialized only for visible architecture",()=>{
 const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
 assert.match(renderer,/withTextileMeta = withTextileArchitecture/);
 assert.match(renderer,/withTextileMeta\?"textile-meta"/);
 assert.match(renderer,/#define FILAMENT_ARCH_META 1/);
 assert.match(renderer,/#define filamentMeta /);
 assert.match(filamentGLSL,/mtMix=filamentMetaAmount\*mtVisible/);
 assert.match(filamentGLSL,/arInk=mix\(arInk,mtColor,mtMix\)/);
 for(const k of textileMetaControls.slice(1))assert.ok(renderer.includes('"'+k+'"'),k);
});

test("new material effects are scaffold-local and preserve neutral defaults",()=>{
 assert.match(filamentGLSL,/mtOpacity=1\.,mtSpecular=0\.,mtEmission=0\./);
 assert.match(filamentGLSL,/arWeight\*=mix\(1\.,clamp\(mtOpacity,0\.,1\.\),mtMix\)/);
 assert.match(filamentGLSL,/arMesh\*arWeight\*mtSpecular\*mtMix/);
 assert.match(filamentGLSL,/arMesh\*arWeight\*mtEmission\*mtMix/);
});
