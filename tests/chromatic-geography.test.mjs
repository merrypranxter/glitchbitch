import test from "node:test";
import assert from "node:assert/strict";
import {geographyMode,geographyAtlasState,geographyRow,geographyUniforms} from "../src/chromatic-geography.js";
import {metamerAtlasKey,metamerAtlasY} from "../src/chromatic-time.js";
const s={"chromaticSpace":22,"chromaticMetaMotion":0,"chromaticMetaTarget":5,"chromaticMetaPeriod":8,"chromaticMetaTimePhase":0,"chromaticGeoMode":1,"chromaticGeoAmount":100,"chromaticGeoScale":3,"chromaticGeoAngle":0,"chromaticGeoSoftness":65,"chromaticGeoDrift":1};
const pts=Array.from({length:9},(_,i)=>Array.from({length:9},(_,j)=>[i/8,j/8])).flat(),near=(a,b)=>Math.abs(a-b)<1e-9;
test("Geography off preserves the global palette and on enables local suns without changing state",()=>{
 assert.equal(geographyMode({...s,chromaticGeoAmount:0}),0);
 assert.equal(geographyMode({...s,chromaticSpace:20}),0);
 assert.equal(geographyAtlasState(s).chromaticMetaMotion,1);
 assert.equal(s.chromaticMetaMotion,0);
 assert.equal(geographyAtlasState({...s,chromaticMetaMotion:2}).chromaticMetaMotion,2);
 for(const p of pts)assert.ok(near(geographyRow({...s,chromaticGeoMode:0},2,p),metamerAtlasY(s,2)));
});
test("Five distinct spatial fields are bounded and periodic across all motion and drift modes",()=>{
 const fields=[1,2,3,4,5].map(m=>pts.map(p=>geographyRow({...s,chromaticGeoMode:m},1.2,p,1.5)));
 assert.equal(new Set(fields.map(a=>JSON.stringify(a))).size,5);
 for(const f of fields){assert.ok(Math.max(...f)-Math.min(...f)>.25);assert.ok(f.every(v=>v>=.5/16-1e-9&&v<=15.5/16+1e-9));}
 for(const m of [0,1,2])for(const g of [1,2,3,4,5])for(const d of [0,1,2,3])for(const p of pts){
 const a={...s,chromaticMetaMotion:m,chromaticGeoMode:g,chromaticGeoDrift:d};
 assert.ok(near(geographyRow(a,1.2,p),geographyRow(a,9.2,p)));
 }
});
test("Field controls do not rebake the atlas, but enabling/disabling local suns does",()=>{
 assert.deepEqual(metamerAtlasKey(geographyAtlasState(s)),metamerAtlasKey(geographyAtlasState({...s,chromaticGeoMode:5,chromaticGeoScale:8,chromaticGeoAngle:90,chromaticGeoDrift:3})));
 assert.notDeepEqual(metamerAtlasKey(geographyAtlasState(s)),metamerAtlasKey(geographyAtlasState({...s,chromaticGeoMode:0})));
 assert.ok(Object.values(geographyUniforms(s,1)).flat().every(Number.isFinite));
});
