import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {canvasImageFiltersWork,bakeTextCanvasFilter,fallbackMaterialFilter}
 from "../src/lettering-filter-fallback.js";
import {letteringMaterial} from "../src/lettering-materials.js";

/* Fake Canvas2D behaves like Safari: CanvasRenderingContext2D.filter does
 * not alter drawImage results, but pixel read/write and blending are valid. */
function noFilterDocument(){
 const created=[];
 function canvas(){
   const item={width:0,height:0,rgba:null};
   const ctx={
     filter:"none",fillStyle:"#000000",
     fillRect(){
       item.rgba=new Uint8ClampedArray(item.width*item.height*4);
       for(let i=0;i<item.rgba.length;i+=4){
         const white=this.fillStyle==="#ffffff";
         item.rgba[i]=item.rgba[i+1]=item.rgba[i+2]=white?255:0;
         item.rgba[i+3]=255;
       }
     },
     drawImage(source){
       item.rgba=new Uint8ClampedArray(source.rgba ||
         new Uint8ClampedArray(item.width*item.height*4));
     },
     getImageData(){
       return {data:new Uint8ClampedArray(item.rgba ||
         new Uint8ClampedArray(item.width*item.height*4))};
     },
     putImageData(frame){item.rgba=new Uint8ClampedArray(frame.data)}
   };
   item.getContext=()=>ctx;
   created.push(item);
   return item;
 }
 return {created,document:{createElement:tag=>{
   assert.equal(tag,"canvas");
   return canvas();
 }}};
}
test("Actual pixel probe recognizes Safari when filter assignment is silently ignored",()=>{
 const old=globalThis.document;
 const d=noFilterDocument();
 globalThis.document=d.document;
 try {
   assert.equal(canvasImageFiltersWork(),false);
   assert.equal(d.created.length,2);
 }finally{
   if(old===undefined)delete globalThis.document;else globalThis.document=old;
 }
});
test("CPU fallback increases chroma while preserving alpha and individual pixel colors",()=>{
 const old=globalThis.document,d=noFilterDocument();
 globalThis.document=d.document;
 try {
   const src=d.document.createElement("canvas");
   src.width=2;src.height=1;
   src.rgba=new Uint8ClampedArray([63,105,177,255,220,45,88,64]);
   const result=bakeTextCanvasFilter(src,
     "brightness(1.4) saturate(1.55) contrast(1.1)");
   assert.notEqual(result,src);
   assert.equal(result.width,2);
   assert.equal(result.height,1);
   assert.equal(result.rgba[3],255);
   assert.equal(result.rgba[7],64);
   assert.ok(result.rgba[2]-result.rgba[0]>114,
     "indigo-blue must become more saturated, not wash toward white");
   assert.notDeepEqual([...result.rgba.slice(0,3)],[...src.rgba.slice(0,3)]);
   assert.notDeepEqual([...result.rgba.slice(4,7)],[...src.rgba.slice(4,7)]);
 }finally{if(old===undefined)delete globalThis.document;else globalThis.document=old;}
});
test("Unrecognized filter transforms never corrupt the original glyph atlas",()=>{
 const old=globalThis.document,d=noFilterDocument();globalThis.document=d.document;
 try{
   const src=d.document.createElement("canvas");
   src.width=1;src.height=1;src.rgba=new Uint8ClampedArray([80,120,220,255]);
   assert.equal(bakeTextCanvasFilter(src,"none"),src);
   assert.equal(bakeTextCanvasFilter(src,"drop-shadow(2px 2px blue)"),src);
 }finally{if(old===undefined)delete globalThis.document;else globalThis.document=old;}
});
test("Active neon and spectral materials receive stable Safari pigment boost",()=>{
 const palette=["#ff11cb","#00fafa","#c6ff24"];
 const neon=letteringMaterial({letteringStyle:"Neon bling",letteringFill:"#ffffff"},palette);
 const prism=letteringMaterial({letteringStyle:"Prism pulse",letteringFill:"#ffffff"},palette);
 const plain=letteringMaterial({letteringStyle:"Custom ink",letteringFill:"#ff22bd"},palette);
 assert.match(fallbackMaterialFilter(neon),/brightness\(1\.40\) saturate\(1\.48\)/);
 assert.match(fallbackMaterialFilter(prism),/brightness\(1\.25\) saturate\(1\.48\)/);
 assert.equal(fallbackMaterialFilter(plain),"");
});
test("Fallback runs from a bounded atlas cache, never each MP4 frame",()=>{
 const source=readFileSync(new URL("../src/text-compositor.js",import.meta.url),"utf8");
 assert.match(source,/canvasImageFiltersWork\(\)/);
 assert.match(source,/bakeTextCanvasFilter\(source,filter\)/);
 assert.match(source,/entry\.cpuCanvases\.get\(source\)/);
 assert.match(source,/cached\.size>=2/);
 assert.match(source,/const cpuFilter=useCpuFilters/);
 assert.match(source,/paintShape\(\{halo:true,cpuFilter\}\)/);
 assert.match(source,/paintShape\(\{tint:recipe\.whiteInk\?"#ffffff":opts\.tint,cpuFilter\}\)/);
});
