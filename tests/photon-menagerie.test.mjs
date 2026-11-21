import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial,validateRecipe,recipeDocument,parseDocument} from "../src/data.js";
import {findControls,sectionMeta,sectionActive} from "../src/ui-index.js";
import {photonSpecies,photonSpeciesFamilies,photonSpeciesDescriptions,
  newPhotonSpecies,funkyPhotonSpecies,photonPresets,photonPresetState,photonGLSL,
  remixPhotonZoo,specializePhotonGeometry,nextPhotonSpecies} from "../src/photon-zoo.js";

const originals=["Prism rosettes","Cathedral halos","Liquid lenses",
  "Diffraction flowers","Interference organisms","Chromatic ribbons",
  "Op-art shockwaves","Starburst engines"];
const additions=["Caustic anemones","Opal gyroid ghosts",
  "Gravitational lensworms","Lenticular chrysalis",
  "Quasicrystal halos","Plasma jellybells","Moiré pollen",
  "Spectral manta wings","Nerve pearls","Temporal diffraction comb"];
const funky=["Candy singularity","Pollen eclipse","Jelly cathedral",
  "Haunted lenticules","Iridescent spore halo","Prism amoeba",
  "Neon diffraction fungus","Opal thunder lattice"];
const allAdditions=[...additions,...funky];
const artwork={...initial,engine:12,seed:87411,ratio:"9:16",
  photonAmount:0,photonMotion:70,photonSpecies:"Cathedral halos",
  lettering:"WITNESS THE LUMINESCENT WEIRD",colors:["#ff00ff","#00eeff","#ddff22"],
  filamentSpecies:"Fractal veinwork",filamentAmount:74,
  filamentStitchAmount:63,underlayAmount:52};
test("first eight optical modes retain old shader indices and every new creature has a preset",()=>{
  assert.deepEqual(photonSpecies.slice(0,8),originals);
  assert.deepEqual(photonSpecies.slice(8,18),additions);
  assert.deepEqual(photonSpecies.slice(18),funky);
  assert.deepEqual(newPhotonSpecies,allAdditions);
  assert.deepEqual(funkyPhotonSpecies,funky);
  assert.equal(photonPresets.length,26);
  assert.equal(new Set(photonPresets.map(p=>p.species)).size,26);
  const all=photonSpeciesFamilies.flatMap(f=>f.species);
  assert.equal(all.length,26);
  assert.equal(new Set(all).size,26);
  assert.deepEqual(new Set(all),new Set(photonSpecies));
  for(const name of photonSpecies)
    assert.ok(photonSpeciesDescriptions[name],name+" missing description");
});
test("all new optical presets remain visibly animated and save/load cleanly",()=>{
  for(const name of allAdditions){
    const preset=photonPresets.find(p=>p.species===name);
    assert.ok(preset);
    assert.ok(preset.photonMotion>=70,name);
    assert.ok(preset.photonAmount>=90,name);
    const loaded=photonPresetState(artwork,preset.name);
    assert.equal(loaded.photonSpecies,name);
    for(const field of ["ratio","seed","engine","lettering","colors",
      "filamentSpecies","filamentAmount","filamentStitchAmount","underlayAmount"])
      assert.deepEqual(loaded[field],artwork[field],name+" "+field);
    assert.deepEqual(validateRecipe(loaded),loaded);
    assert.deepEqual(parseDocument(recipeDocument(loaded,"Spectral creature",
      {time:1,colorTime:4})).state,loaded);
  }
});
test("selected shader species are really isolated before compiling on Safari",()=>{
  const balance=s=>[...s].reduce((a,c)=>a+(c==="{")-(c==="}"),0);
  const branches=s=>[...s.matchAll(/(?:if|else if)\(photonSpecies==(\d+)\)/g)]
    .map(m=>Number(m[1]));
  for(let id=0;id<26;id++){
    const source=specializePhotonGeometry(photonGLSL,id);
    assert.deepEqual(branches(source),[id],String(id));
    assert.equal(balance(source),0,String(id));
    assert.ok(source.length<photonGLSL.length);
    assert.ok(source.includes("vec3 livingPhotonZoo"));
    assert.ok(source.includes("vec3 pigment=palette("));
    assert.ok(source.includes("return clamp(result,0.0,1.5);"));
    assert.ok(!/\bactive\b|\buint\b|texture2D|texelFetch|\bfwidth\b/.test(source));
  }
  assert.equal(specializePhotonGeometry(photonGLSL,-1),photonGLSL);
  assert.equal(specializePhotonGeometry(photonGLSL,26),photonGLSL);
  assert.equal(specializePhotonGeometry(photonGLSL,2.5),photonGLSL);
});
test("new modes each have unique evolving optical geometry, not just renamed presets",()=>{
  for(let i=8;i<26;i++){
    const start="  }else if(photonSpecies=="+i+"){";
    const end=i===25?"  }else{ // Unsupported photon species":
      "  }else if(photonSpecies=="+(i+1)+"){";
    const a=photonGLSL.indexOf(start),b=photonGLSL.indexOf(end,a);
    assert.ok(a>=0&&b>a);
    const code=photonGLSL.slice(a,b);
    assert.ok(code.length>450,"not enough structure: "+i);
    assert.ok(/\bt\b/.test(code),"motion needs time: "+i);
    for(const token of ["shape=","rim=","glint=","phase=","alpha="])
      assert.ok(code.includes(token),i+" lacks "+token);
  }
});
test("optic shuffles are bounded, seeded and preserve the rest of the artwork",()=>{
  for(const onlyNew of [false,true]){
    for(const n of [0,.12,.44,.75,.999]){
      const next=remixPhotonZoo(artwork,()=>n,onlyNew);
      assert.deepEqual(next,remixPhotonZoo(artwork,()=>n,onlyNew));
      assert.notEqual(next.photonSpecies,artwork.photonSpecies);
      assert.ok((onlyNew?allAdditions:photonSpecies).includes(next.photonSpecies));
      assert.ok(next.photonAmount>=76);
      for(const k of ["ratio","seed","engine","lettering","colors",
        "filamentSpecies","filamentAmount","filamentStitchAmount","underlayAmount"])
        assert.deepEqual(next[k],artwork[k],k);
      assert.deepEqual(validateRecipe(next),next);
    }
  }
  const next=nextPhotonSpecies(artwork,()=>.99);
  assert.ok(photonSpecies.includes(next.photonSpecies));
});
test("mobile family picker, one-line descriptions, render safety and Find are connected",()=>{
  const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
  const ui=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
  assert.equal(sectionMeta("photon").group,"Light");
  assert.equal(sectionActive(sectionMeta("photon"),initial),false);
  for(const name of allAdditions)assert.ok(findControls(name).some(x=>x.id==="photon"),name);
  assert.ok(ui.includes("photonSpeciesFamilies.map(family=>"));
  assert.ok(ui.includes("photonSpeciesDescriptions[s.photonSpecies]"));
  assert.ok(ui.includes("Shuffle optical creatures"));
  assert.ok(ui.includes("Shuffle new weird optics"));
  assert.ok(ui.includes("remixPhotonZoo(x,Math.random,true)"));
  assert.ok(renderer.includes("specializePhotonGeometry(photonGLSL.replace"));
  assert.ok(renderer.includes('photonUnavailable=true'));
  assert.ok(renderer.includes('col=livingPhotonZoo(col,uv,p,v);'));
});
