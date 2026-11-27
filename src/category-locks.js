export const categoryPrefixes={
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
    "Backgrounds & atmosphere":["backdrop","underlay"]
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
 return result;
}
