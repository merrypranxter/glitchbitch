import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {letteringMaterial,letteringExportGlowLayers} from "../src/lettering-materials.js";
import {paintLettering} from "../src/text-compositor.js";

/* A stateful Canvas2D spy, with enough canvas methods for real glyph/sprite
   creation and effects. No browser screenshot or unavailable WebGL required. */
function fakeContext(log=[]){
 const stack=[];
 const state=()=>({
   globalAlpha:context.globalAlpha,
   globalCompositeOperation:context.globalCompositeOperation,
   shadowBlur:context.shadowBlur,
   shadowColor:context.shadowColor,
   shadowOffsetX:context.shadowOffsetX,
   shadowOffsetY:context.shadowOffsetY,
   filter:context.filter
 });
 const context={
   font:"",fillStyle:"#ffffff",strokeStyle:"#000000",textAlign:"",
   textBaseline:"",lineJoin:"",miterLimit:2,globalAlpha:1,
   globalCompositeOperation:"source-over",shadowBlur:0,shadowColor:"transparent",
   shadowOffsetX:0,shadowOffsetY:0,filter:"none",
   save(){stack.push(state())},
   restore(){Object.assign(this,stack.pop()||{})},
   setTransform(){},scale(){},rotate(){},transform(){},clearRect(){},
   translate(x,y){log.push({kind:"move",x,y})},
   fillRect(){},
   fillText(){},strokeText(){},
   drawImage(){log.push({kind:"draw",...state()})},
   measureText(text){const size=Number((this.font.match(/(\d+)px/)||[])[1]||16);
     return {width:Array.from(String(text)).length*size*.58}},
   createLinearGradient:()=>({addColorStop(){}}),
   createRadialGradient:()=>({addColorStop(){}})
 };
 return context;
}
function withDocument(run){
 const original=globalThis.document;
 globalThis.document={createElement:()=>({
   width:0,height:0,getContext:()=>fakeContext()
 })};
 try{return run()}finally{
   if(original===undefined)delete globalThis.document;
   else globalThis.document=original;
 }
}
const base={
 lettering:"EAT MY ASS",letteringAmount:100,letteringStyle:"Electric glow",
 letteringFont:"original",letteringFill:"#ffffff",letteringFillMode:"Solid",
 letteringStrokes:[],letteringFormats:[],letteringTracking:0,
 letteringLineSpacing:118,letteringScale:48,
 letteringX:50,letteringY:50,letteringRotation:0,
 letteringStretchX:100,letteringStretchY:100,letteringCurve:0,
 letteringMotion:0,letteringWarp:0,
 letteringMotionPath:"Still",letteringBlendMode:"Difference",
 letteringBlendStrength:100,letteringLayers:[],colors:["#ff00ff","#00eeff","#ffff00"]
};
test("Neon exporter derives the same colored halo layers as the live material",()=>{
 const m=letteringMaterial(base,base.colors);
 const layers=letteringExportGlowLayers(m);
 assert.equal(layers.length,3);
 assert.deepEqual(layers.map(x=>x.color),["#ffffff","#00aaff","#b0ff1a"]);
 assert.ok(layers[2].blur>layers[0].blur);
 const holo=letteringExportGlowLayers(letteringMaterial({...base,letteringStyle:"Holographic"},base.colors));
 assert.equal(holo.length,2);
 assert.deepEqual(letteringExportGlowLayers(letteringMaterial({...base,letteringStyle:"Custom ink"},base.colors)),[]);
});
test("Luminous text remains glowing after a darkening blend operation in export",()=>withDocument(()=>{
 const log=[],ctx=fakeContext(log);
 paintLettering(ctx,base,{textTime:.5},430,430);
 const draws=log.filter(x=>x.kind==="draw");
 const main=draws.findIndex(x=>x.globalCompositeOperation==="difference");
 const halo=draws.findIndex(x=>x.globalCompositeOperation==="screen");
 assert.ok(main>=0);
 assert.ok(halo>main,"optical halos must be applied AFTER the text blend");
 const lit=draws.filter(x=>x.globalCompositeOperation==="screen");
 assert.ok(lit.length>=4,"at least three halos and an inner core");
 assert.ok(lit.some(x=>x.shadowBlur>=27&&x.shadowColor==="#00aaff"));
 assert.ok(lit.some(x=>x.shadowColor==="#b0ff1a"));
 assert.ok(lit.every(x=>x.globalAlpha>0));
}));
test("Plain text stays plain with no forced glow passes",()=>withDocument(()=>{
 const log=[];
 paintLettering(fakeContext(log),{
   ...base,letteringStyle:"Custom ink",letteringBlendMode:"Normal"
 },{textTime:0},430,430);
 const draws=log.filter(x=>x.kind==="draw");
 assert.ok(draws.length>0);
 assert.equal(draws.filter(x=>x.globalCompositeOperation==="screen").length,0);
}));
test("Animated RGB echoes offset BOTH SIDES of full glyphs, not just static bitmaps",()=>withDocument(()=>{
 const log=[];
 paintLettering(fakeContext(log),{
   ...base,lettering:"RGB",letteringStyle:"RGB split",
   letteringBlendMode:"Normal",letteringWarp:70
 },{textTime:0},430,430);
 const positions=log.filter(x=>x.kind==="move").slice(1).map(x=>x.x);
 assert.ok(positions.length>=9);
 // The first three positions are left red echo, next three are right cyan
 // echo and final three are the original characters. Each corresponding
 // letter must actually shift, despite being animated intact glyph sprites.
 const n=positions.length/3;
 assert.ok(Number.isInteger(n),positions.length);
 for(let i=0;i<n;i++){
   assert.ok(positions[i]<positions[n+i],"red and cyan echoes must separate");
   assert.ok(positions[n+i]>positions[2*n+i],"cyan echo must be right of the text");
 }
}));
test("Export-dialog proof renders via the real PNG and video text compositor",()=>{
 const ui=readFileSync(new URL("../src/components/ExportDialog.jsx",import.meta.url),"utf8");
 const exporter=readFileSync(new URL("../src/export.js",import.meta.url),"utf8");
 assert.match(ui,/See flattened export proof/);
 assert.match(ui,/renderImage\(snapshot,timeline,480\)/);
 assert.match(ui,/URL\.revokeObjectURL/);
 assert.match(exporter,/paintLettering\(ctx, state, timeline, width, height\)/);
 assert.match(exporter,/paintLettering\(ctx, state, frameClock, size.width, size.height\)/);
});
