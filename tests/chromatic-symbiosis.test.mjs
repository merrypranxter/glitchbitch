import test from "node:test";
import assert from "node:assert/strict";
import {symbiosisMode,symbiosisAtlasState,symbiosisBaseRow,structuralSignal,structuralRow} from "../src/chromatic-symbiosis.js";
import {metamerAtlasKey} from "../src/chromatic-time.js";
const s={"chromaticSpace":22,"chromaticMetaMotion":0,"chromaticMetaTarget":5,"chromaticMetaPeriod":8,"chromaticMetaTimePhase":0,"chromaticSymMode":1,"chromaticSymAmount":100,"chromaticSymFrequency":4,"chromaticSymSensitivity":55,"chromaticSymSoftness":50,"chromaticSymDrift":1};
const near=(a,b)=>Math.abs(a-b)<1e-9;
test("Structural lighting is opt-in and can use two local suns without global motion",()=>{
 assert.equal(symbiosisMode({...s,chromaticSymAmount:0}),0);
 assert.equal(symbiosisMode({...s,chromaticSpace:20}),0);
 assert.equal(symbiosisAtlasState(s).chromaticMetaMotion,1);
 assert.equal(s.chromaticMetaMotion,0);
 assert.equal(symbiosisBaseRow(s,0),.5/16);
 assert.equal(structuralRow({...s,chromaticSymMode:0},3,.77,.3,[.1,.2],[.2,.3]),.77);
});
test("Structural rules respond to field values, gradients, orientation and geometry",()=>{
 const pts=Array.from({length:81},(_,i)=>{const a=(i%9)/8-.5,b=Math.floor(i/9)/8-.5;return {p:[a,b],v:Math.sin(a*6)*Math.cos(b*7),g:[.06*Math.cos(a*6)*Math.cos(b*7),-.07*Math.sin(a*6)*Math.sin(b*7)]};});
 const fields=[1,2,3,4,5].map(m=>pts.map(({p,v,g})=>structuralRow({...s,chromaticSymMode:m},1.2,symbiosisBaseRow(s,1.2),v,g,p,3)));
 assert.equal(new Set(fields.map(x=>JSON.stringify(x))).size,5);
 for(const f of fields){assert.ok(Math.max(...f)-Math.min(...f)>.2);assert.ok(f.every(x=>x>=.5/16-1e-9&&x<=15.5/16+1e-9));}
 assert.ok(structuralSignal(2,0,[.1,.1],[0,0],4,.55,0)>structuralSignal(2,0,[0,0],[0,0],4,.55,0));
 for(const m of [0,1,2])for(const g of [1,2,3,4,5])for(const d of [0,1,2,3])for(const {p,v,g:grad} of pts){
  const a={...s,chromaticMetaMotion:m,chromaticSymMode:g,chromaticSymDrift:d};
  const x=structuralRow(a,1.2,symbiosisBaseRow(a,1.2),v,grad,p,3),y=structuralRow(a,9.2,symbiosisBaseRow(a,9.2),v,grad,p,3);
  assert.ok(near(x,y)||(m===2&&near(Math.abs(x-y),1)));
 }
});
test("Structural settings do not invalidate the spectral atlas",()=>{
 assert.deepEqual(metamerAtlasKey(symbiosisAtlasState(s)),metamerAtlasKey(symbiosisAtlasState({...s,chromaticSymMode:5,chromaticSymFrequency:11,chromaticSymDrift:3})));
});

test("Partial-strength orbit has no artificial shortest-arc seam",()=>{
 const a={...s,chromaticMetaMotion:2,chromaticSymAmount:40,chromaticSymDrift:0};
 const circ=(x,y)=>Math.min(Math.abs(x-y),1-Math.abs(x-y));
 for(let i=0;i<1000;i++){
  const x=structuralRow(a,0,.95,i/1000,[.1,.2],[.2,.3]);
  const y=structuralRow(a,0,.95,(i+1)/1000,[.1,.2],[.2,.3]);
  assert.ok(circ(x,y)<.05);
 }
});
