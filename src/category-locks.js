import {breedRequiredParents} from "./crossbreed-lab.js";
export const categoryPrefixes={
    "Living currents":["vc","alchemy"],
    "Mathematical membranes":["g2","hexagram","poles","qd"],
    "Hybrid mathematics":["breed","g2","hexagram","poles","qd","vc","vld","hcr","bio"],
    "Prismatic surfaces":["ps","substance","filmAmount","filmThickness","opalAmount","prismAmount","foilRelief","foilMotion"],
    "Screen interference":["spx","kd","phosphor","scan","broadcast"],
    "Animation & motion":["motion","lightMotion","speed","colorSpeed","freezeGeometry","freezeColor"],
    "Digital corruption":["split","glitch","block","pixel"],
    "Analog & CRT":["scan","grain","vignette","phosphor","broadcast"],
    "Temporal feedback":["afterimage","datamosh","memoryDrift","memoryDecay"],
    "MySpace nostalgia":["windowCascade","glitter"],
    "Spectral foil":["filmAmount","filmThickness","opalAmount","prismAmount","foilRelief","foilMotion"],
    "Print textures":["dither","riso","misregister"],
    "View motion & depth":["wiggle","stereo"],
    "Microscopic shapes":["micro","qd"],
    "Glass & refraction":["schlieren"],
    "Materials & textures":["substance","vld","velvet","hcr","crochet"],
    "Light & optical ornaments":["photon","alchemy"],
    "Chromatic alchemy":["alchemy","spx"],
    "Print & signal damage":["injury","ps","kd"],
    "Biological growth":["bio","micro"],
    "Backgrounds & atmosphere":["backdrop","underlay","atmo","habitat","colony","spore","substrate","symbiosis","gene","selection","apocalypse","fossil","succession","foodWeb","coevo"]
  };
export const categoryOwns=(name,key)=>(categoryPrefixes[name]||[]).some(p=>key.startsWith(p));
const storageKey="glitchbitch.categoryLocks.v1";
let current={};
try {current=JSON.parse(globalThis.localStorage?.getItem(storageKey)||"{}")||{};} catch {}
export function readCategoryLocks(){return {...current};}
export function writeCategoryLocks(next){current={...next};try{globalThis.localStorage?.setItem(storageKey,JSON.stringify(current));}catch{}}
export function protectCategorySettings(original,next,locks=current){
 const result={...next};
 for(const key of Object.keys(original))
 if(Object.keys(locks).some(name=>locks[name]&&categoryOwns(name,key)))result[key]=original[key];
 // A locked dormant parent must not be silently activated by a hybrid spin.
 if(result.breedAmount>0 && !breedRequiredParents(result.breedMode).every(k=>result[k]>0)){
   // Restore the original hybrid and its parents as a coherent unit if it was active.
   const originalParents=breedRequiredParents(original.breedMode);
   if(original.breedAmount>0 && originalParents.every(k=>original[k]>0)){
     for(const key of Object.keys(original))if(key.startsWith("breed")||originalParents.includes(key))result[key]=original[key];
   }else result.breedAmount=0;
 }
 return result;
}
