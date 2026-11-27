import test from "node:test";
import assert from "node:assert/strict";
import {pigmentStop,mixPigment,reflectanceFromKS} from "../src/spectral-pigment.js";
import {bakeChromaticPalette,LUT_WIDTH} from "../src/chromatic-lut.js";
const a=pigmentStop("#0000ff"),b=pigmentStop("#ffff00"),opts={mode:20,amount:100,weight:100};
test("38 wavelength bands and stable KM inverse",()=>{
 assert.equal(a.reflectance.length,38);
 assert.ok(a.reflectance.every(v=>v>0&&v<=1));
 for(const r of [.001,.01,.1,.4,.9,1])assert.ok(Math.abs(reflectanceFromKS((1-r)**2/(2*r))-r)<1e-9);
});
test("Exact stops and identity",()=>{
 assert.deepEqual(mixPigment(a,b,0,opts),a.rgb);
 assert.deepEqual(mixPigment(a,b,1,opts),b.rgb);
 assert.deepEqual(mixPigment(b,b,.42,opts),b.rgb);
});
test("Blue plus yellow gives green; controls and modes differ",()=>{
 const mid=mixPigment(a,b,.5,opts);
 assert.ok(mid[1]>mid[0]&&mid[1]>mid[2]);
 for(const change of [{mode:21},{amount:0},{weight:0}])assert.ok(mixPigment(a,b,.5,{...opts,...change}).some((v,i)=>Math.abs(v-mid[i])>.01));
 const x=mixPigment(a,b,.32,opts),y=mixPigment(b,a,.68,opts);
 assert.ok(x.every((v,i)=>Math.abs(v-y[i])<1e-8));
});
test("All sampled color pairs remain finite and bounded",()=>{
 const stops=["#000000","#ffffff","#ff0000","#00ff00","#0000ff","#ffff00","#ff00ff","#00ffff","#ab236b","#ddeea0"].map(pigmentStop);
 for(const x of stops)for(const y of stops)for(const mode of [20,21])for(const t of [.001,.1,.5,.9,.999])
 assert.ok(mixPigment(x,y,t,{...opts,mode}).every(v=>Number.isFinite(v)&&v>=0&&v<=1));
});
test("LUT deterministic, cyclic and mode sensitive",()=>{
 const s={chromaticSpace:20,colors:["#0000ff","#ffff00"],chromaticPigmentAmount:100,chromaticPigmentWeight:100};
 const lut=bakeChromaticPalette(s),pixel=i=>Array.from(lut.slice(i*4,i*4+3));
 assert.equal(lut.length,LUT_WIDTH*4);
 assert.deepEqual(pixel(0),[0,0,255]);
 assert.deepEqual(pixel(LUT_WIDTH/2),[255,255,0]);
 assert.ok(lut.every((v,i)=>i%4!==3||v===255));
 assert.deepEqual(lut,bakeChromaticPalette(s));
 assert.notDeepEqual(lut,bakeChromaticPalette({...s,chromaticSpace:21}));
 assert.ok(pixel(LUT_WIDTH-1).every((v,i)=>Math.abs(v-pixel(0)[i])<=3));
});
