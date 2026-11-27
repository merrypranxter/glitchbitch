import test from "node:test";
import assert from "node:assert/strict";
import {pigmentStop} from "../src/spectral-pigment.js";
import {metamerPair,referenceXYZ,makeSpectralObserver,spectralIlluminant} from "../src/spectral-metamer.js";
import {bakeChromaticPalette,LUT_WIDTH} from "../src/chromatic-lut.js";
const delta=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
test("Distinct bounded spectra share reference XYZ",()=>{
 for(const hex of ["#808080","#b66d79","#55ab99","#ff0000","#00ff00","#0000ff","#ffffff","#000000"]){
  const [a,b]=metamerPair(pigmentStop(hex).reflectance,1.1);
  assert.ok([...a,...b].every(v=>Number.isFinite(v)&&v>=0&&v<=1));
  assert.ok(delta(referenceXYZ(a),referenceXYZ(b))<1e-10);
 }
 const [a,b]=metamerPair(pigmentStop("#808080").reflectance,1.1);
 assert.ok(delta(a,b)>.05);
 assert.ok(delta(makeSpectralObserver(5,100)(a),makeSpectralObserver(5,100)(b))>.005);
});
test("White balance normalizes each lamp and spectra stay nonnegative",()=>{
 const white=Array(38).fill(1);
 for(let i=0;i<6;i++){
  assert.ok(spectralIlluminant(i).every(v=>Number.isFinite(v)&&v>0));
  assert.ok(delta(makeSpectralObserver(i,100)(white),referenceXYZ(white))<1e-10);
 }
});
test("Hidden bands disappear in daylight and reveal under alien light",()=>{
 const s={colors:["#808080","#808080"],chromaticSpace:22,chromaticIlluminant:0,chromaticMetaAmount:100,chromaticMetaBands:3,chromaticMetaAdapt:100,chromaticMetaPhase:0};
 const range=v=>{const red=Array.from({length:LUT_WIDTH},(_,i)=>v[4*i]);return Math.max(...red)-Math.min(...red);};
 const day=bakeChromaticPalette(s),alt={...s,chromaticIlluminant:5},night=bakeChromaticPalette(alt);
 assert.ok(range(day)<=1);assert.ok(range(night)>=3);
 assert.ok(range(bakeChromaticPalette({...alt,chromaticMetaAmount:0}))<=1);
 assert.notDeepEqual(night,bakeChromaticPalette({...alt,chromaticMetaPhase:22}));
 assert.notDeepEqual(night,bakeChromaticPalette({...alt,chromaticMetaBands:6}));
 assert.deepEqual(night,bakeChromaticPalette(alt));
 assert.ok(night.every((v,i)=>i%4!==3||v===255));
 for(let i=0;i<3;i++)assert.ok(Math.abs(night[i]-night[night.length-4+i])<=3);
});
