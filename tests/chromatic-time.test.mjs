import test from "node:test";
import assert from "node:assert/strict";
import {bakeMetamerAtlas,metamerAtlasY,metamerAtlasKey,metamerMotionMode,META_ATLAS_ROWS,metamerAtlasIlluminant} from "../src/chromatic-time.js";
import {spectralIlluminant} from "../src/spectral-metamer.js";
import {bakeChromaticPalette,mapChromaticGamut,LUT_WIDTH} from "../src/chromatic-lut.js";
const s={colors:["#808080","#b66d79","#55ab99","#ff0000"],chromaticSpace:22,chromaticIlluminant:0,chromaticMetaTarget:5,chromaticMetaAmount:100,chromaticMetaBands:3,chromaticMetaAdapt:100,chromaticMetaPhase:0,chromaticMetaPeriod:8,chromaticMetaTimePhase:0,chromaticGamut:0};
const pair={...s,chromaticMetaMotion:1},orbit={...s,chromaticMetaMotion:2};
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-10);
test("Still mode and animated atlas endpoints match static spectral palettes",()=>{
 const staticLut=bakeChromaticPalette(s),atlas=bakeMetamerAtlas(pair,LUT_WIDTH,mapChromaticGamut);
 assert.deepEqual(bakeMetamerAtlas(s,LUT_WIDTH,mapChromaticGamut).pixels,staticLut);
 assert.equal(atlas.height,META_ATLAS_ROWS);
 assert.equal(atlas.pixels.length,LUT_WIDTH*META_ATLAS_ROWS*4);
 assert.deepEqual(atlas.pixels.slice(0,LUT_WIDTH*4),staticLut);
 assert.deepEqual(atlas.pixels.slice(-LUT_WIDTH*4),bakeChromaticPalette({...s,chromaticIlluminant:5}));
 assert.notDeepEqual(atlas.pixels.slice(0,LUT_WIDTH*4),atlas.pixels.slice(-LUT_WIDTH*4));
 assert.deepEqual(metamerAtlasIlluminant(pair,0),spectralIlluminant(0));
 assert.deepEqual(metamerAtlasIlluminant(pair,META_ATLAS_ROWS-1),spectralIlluminant(5));
 assert.ok(atlas.pixels.every((v,i)=>i%4!==3||v===255));
});
test("Two-sun and six-sun coordinates repeat modulo one period",()=>{
 near(metamerAtlasY(pair,0),.5/META_ATLAS_ROWS);
 near(metamerAtlasY(pair,4),(META_ATLAS_ROWS-.5)/META_ATLAS_ROWS);
 for(const t of [0,1,3.7,7.999])for(const mode of [pair,orbit])near(metamerAtlasY(mode,t),metamerAtlasY(mode,t+8));
 near(metamerAtlasY({...pair,chromaticMetaTimePhase:50},0),metamerAtlasY(pair,4));
 near(metamerAtlasY({...pair,chromaticMetaPeriod:16},8),metamerAtlasY(pair,4));
 assert.equal(metamerAtlasY(s,100),.5);
 assert.equal(metamerMotionMode({...pair,chromaticSpace:20}),0);
});
test("Playback does not invalidate atlas; relevant lamp changes do",()=>{
 assert.deepEqual(metamerAtlasKey(pair),metamerAtlasKey({...pair,chromaticMetaPeriod:16,chromaticMetaTimePhase:40}));
 assert.notDeepEqual(metamerAtlasKey(pair),metamerAtlasKey({...pair,chromaticMetaTarget:2}));
 assert.deepEqual(metamerAtlasKey(orbit),metamerAtlasKey({...orbit,chromaticMetaTarget:2}));
});
