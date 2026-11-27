import test from "node:test";
import assert from "node:assert/strict";
import {bakeChromaticPalette,LUT_WIDTH} from "../src/chromatic-lut.js";
import {HCT,srgbToLin} from "../src/colorspaces.js";
const base={chromaticSpace:19,chromaticHuePath:0,chromaticTurns:0,colors:["#ff0000","#0000ff"]};
const pixel=(v,i)=>Array.from(v.slice(i*4,i*4+3));
test("HCT preserves exact palette stops and opaque LUT",()=>{
 const lut=bakeChromaticPalette(base);
 assert.equal(lut.length,LUT_WIDTH*4);
 assert.deepEqual(pixel(lut,0),[255,0,0]);
 assert.deepEqual(pixel(lut,LUT_WIDTH/2),[0,0,255]);
 for(let i=3;i<lut.length;i+=4)assert.equal(lut[i],255);
});
test("HCT grayscale is neutral and tone is monotone within a segment",()=>{
 const lut=bakeChromaticPalette({...base,colors:["#000000","#ffffff"]});
 let last=0;
 for(let i=0;i<=LUT_WIDTH/2;i++){
  const [r,g,b]=pixel(lut,i);
  assert.equal(r,g);assert.equal(g,b);assert.ok(r>=last);last=r;
 }
 assert.equal(last,255);
});
test("HCT hue routes are distinct, cyclic and deterministic",()=>{
 const a=bakeChromaticPalette(base),b=bakeChromaticPalette({...base,chromaticHuePath:1});
 assert.notDeepEqual(a,b);assert.deepEqual(a,bakeChromaticPalette(base));
 for(let c=0;c<3;c++)assert.ok(Math.abs(a[c]-a[a.length-4+c])<=5);
});
test("HCT midpoint preserves target tone within solver and LUT tolerance",()=>{
 const lut=bakeChromaticPalette(base);
 const tone=rgb=>HCT.fromLin(srgbToLin(rgb.map(v=>v/255)))[2];
 const expected=(tone([255,0,0])+tone([0,0,255]))/2;
 assert.ok(Math.abs(tone(pixel(lut,LUT_WIDTH/4))-expected)<2);
});
test("HCT works with black, white and a saturated multistop palette",()=>{
 const lut=bakeChromaticPalette({...base,colors:["#000000","#ff00ff","#00ff00","#ffffff"],chromaticHuePath:2,chromaticTurns:2});
 for(const [i,rgb] of [[0,[0,0,0]],[512,[255,0,255]],[1024,[0,255,0]],[1536,[255,255,255]]])assert.deepEqual(pixel(lut,i),rgb);
});
