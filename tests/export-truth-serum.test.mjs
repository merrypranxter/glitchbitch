import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {
 withoutTextForExport,exportTextLayerSummary,analyzeTextExportFrames,
 exportBlobPixels,exportDiagnosticReport
} from "../src/text-export-diagnostics.js";

function pixels(colors){
 return {width:colors.length,height:1,
   data:new Uint8ClampedArray(colors.flatMap(rgb=>[...rgb,255]))};
}
const original={
 seed:7790,ratio:"1:1",lettering:"THE SECRET QUOTE",letteringAmount:92,
 letteringBlendMode:"Difference",letteringBlendStrength:84,
 letteringStyle:"Neon bling",letteringFillMode:"Linear gradient",
 letteringFont:"comic-sans",colors:["#fe12dd","#24e9ff"],
 letteringLayers:[
  {id:"second",text:"ALSO PRIVATE",letteringAmount:70,visible:true,
    letteringBlendMode:"Multiply",letteringBlendStrength:54,
    letteringStyle:"Iridescent",letteringFillMode:"Solid"},
  {id:"third",text:"HIDDEN",letteringAmount:70,visible:false,
    letteringBlendMode:"Screen"}
 ]
};

test("Third reference frame turns off all text WITHOUT deleting user words",()=>{
 const absent=withoutTextForExport(original);
 assert.equal(absent.letteringAmount,0);
 assert.ok(absent.letteringLayers.every(x=>x.visible===false));
 assert.equal(absent.lettering,original.lettering);
 assert.equal(absent.letteringLayers[0].text,original.letteringLayers[0].text);
 assert.equal(absent.seed,original.seed);
 assert.deepEqual(absent.colors,original.colors);
 assert.equal(original.letteringAmount,92,"Original artwork must remain untouched");
 assert.equal(original.letteringLayers[0].visible,true);
});

test("Color diagnostics measure only changed text pixels, not background",()=>{
 const bg=pixels([[100,100,100],[90,90,90],[0,0,0],[150,150,150]]);
 const normal=pixels([[200,50,50],[90,90,90],[0,0,0],[170,170,170]]);
 const selected=pixels([[50,220,50],[90,90,90],[0,0,0],[170,170,170]]);
 const m=analyzeTextExportFrames({background:bg,normal,selected});
 assert.equal(m.samples,4);
 assert.equal(m.textAffectedPixels,2);
 assert.equal(m.textCoveragePercent,50);
 assert.equal(m.blendChangedPercent,50);
 assert.equal(m.meanBlendDifference,85);
 assert.ok(m.selectedBrightness>m.normalBrightness);
 assert.ok(m.selectedChroma>m.normalChroma);
});

test("No changed pixels produce zeros instead of NaNs or a false error",()=>{
 const a=pixels([[50,60,70],[50,60,70]]);
 const m=analyzeTextExportFrames({background:a,normal:a,selected:a});
 assert.equal(m.textCoveragePercent,0);
 assert.equal(m.blendChangedPercent,0);
 assert.equal(m.meanBlendDifference,0);
 assert.equal(m.chromaChange,0);
});

test("Normal vs Normal should have no blend delta despite visible text",()=>{
 const bg=pixels([[0,0,0],[0,0,0]]);
 const letters=pixels([[40,220,200],[0,0,0]]);
 const m=analyzeTextExportFrames({
   background:bg,normal:letters,selected:letters
 });
 assert.equal(m.textAffectedPixels,1);
 assert.equal(m.blendChangedPercent,0);
 assert.equal(m.textCoveragePercent,50);
 assert.ok(m.normalChroma>0);
});

test("Frames must have matching dimensions and valid pixel buffers",()=>{
 const bg=pixels([[0,0,0],[0,0,0]]),nm=pixels([[2,3,4]]);
 assert.throws(()=>analyzeTextExportFrames({background:bg,normal:nm,selected:bg}),
   /identical dimensions/);
 assert.throws(()=>analyzeTextExportFrames({background:bg,
   normal:{width:2,height:1,data:new Uint8Array(2)},selected:bg}),
   /missing or malformed/);
});

test("Stats sample large images with a bounded CPU workload",()=>{
 const width=720,height=720,count=width*height*4;
 const all={width,height,data:new Uint8Array(count)};
 const m=analyzeTextExportFrames({background:all,normal:all,selected:all});
 assert.ok(m.samples<=240000);
 assert.equal(m.blendChangedPercent,0);
 assert.equal(m.textAffectedPixels,0);
});

test("Report includes relevant modes and Safari support, but never user quotes",()=>{
 const metrics={width:480,height:480,
   textCoveragePercent:6,blendChangedPercent:42};
 const report=exportDiagnosticReport({
   state:original,ratio:"1:1",
   timeline:{time:13,colorTime:42,textTime:7.5},metrics,
   canvasFilterSupported:false,mp4Available:true,
   userAgent:"Example mobile browser"
 });
 assert.equal(report.type,"glitchbitch-export-truth-serum");
 assert.equal(report.browser.canvas2dFilter,"fallback");
 assert.equal(report.browser.mp4Available,true);
 assert.equal(report.textLayers.length,3);
 assert.equal(report.textLayers[0].blend,"Difference");
 assert.equal(report.textLayers[1].blend,"Multiply");
 assert.equal(report.textLayers[2].enabled,false);
 assert.equal(report.frameClock.textTime,7.5);
 assert.equal(report.measurements.blendChangedPercent,42);
 const serialized=JSON.stringify(report);
 assert.ok(!serialized.includes("THE SECRET QUOTE"));
 assert.ok(!serialized.includes("ALSO PRIVATE"));
 assert.ok(!serialized.includes("HIDDEN"));
 assert.ok(!serialized.includes("#fe12dd"));
 assert.ok(!serialized.includes("#24e9ff"));
});

test("Safari-compatible PNG decode cleans up bitmap and temporary canvas",async()=>{
 const oldDoc=globalThis.document,oldBitmap=globalThis.createImageBitmap;
 const flags={closed:false};
 let testCanvas=null;
 globalThis.createImageBitmap=async()=>({
   width:2,height:1,
   close(){flags.closed=true}
 });
 globalThis.document={createElement:()=>{
   const item={width:0,height:0,getContext:()=>({
     drawImage(){},
     getImageData:()=>({data:new Uint8ClampedArray([1,2,3,255,4,5,6,255])})
   })};testCanvas=item;return item;
 }};
 try{
   const frame=await exportBlobPixels({size:16});
   assert.equal(frame.width,2);
   assert.equal(frame.height,1);
   assert.deepEqual([...frame.data],[1,2,3,255,4,5,6,255]);
   assert.equal(flags.closed,true);
   assert.equal(testCanvas.width,1);
   assert.equal(testCanvas.height,1);
 }finally{
   if(oldDoc===undefined)delete globalThis.document;else globalThis.document=oldDoc;
   if(oldBitmap===undefined)delete globalThis.createImageBitmap;
   else globalThis.createImageBitmap=oldBitmap;
 }
});

test("Export UI renders three deterministic frames, shows metrics and saves JSON",()=>{
 const ui=readFileSync(new URL("../src/components/ExportDialog.jsx",import.meta.url),"utf8");
 const exportPath=readFileSync(new URL("../src/export.js",import.meta.url),"utf8");
 assert.match(ui,/renderImage\(normalTextBlendState\(snapshot\),timeline,480\)/);
 assert.match(ui,/renderImage\(snapshot,timeline,480\)/);
 assert.match(ui,/renderImage\(withoutTextForExport\(snapshot\),timeline,480\)/);
 assert.match(ui,/analyzeTextExportFrames\(/);
 assert.match(ui,/canvasImageFiltersWork\(\)/);
 assert.match(ui,/Save diagnostic report \(JSON\)/);
 assert.match(ui,/URL\.revokeObjectURL/);
 assert.match(ui,/blendProof\.stateAt===state/);
 assert.match(exportPath,/paintLettering\(ctx, state, timeline, width, height\)/);
 assert.match(exportPath,/paintLettering\(ctx, state, frameClock, size.width, size.height\)/);
});
