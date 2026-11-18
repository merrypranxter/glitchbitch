import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {initial} from "../src/data.js";
import {glyphCanvas} from "../src/kinetic-type.js";
import {paintLettering} from "../src/text-compositor.js";
import {createLetteringHalo} from "../src/lettering-halo.js";
import {normalTextBlendState} from "../src/text-blend-proof.js";

function canvasSpy(registry) {
 const canvas={width:0,height:0};
 const log=[];
 const stack=[];
 const ctx={
   font:"",fillStyle:"#ffffff",strokeStyle:"#000000",
   globalAlpha:1,globalCompositeOperation:"source-over",
   shadowColor:"transparent",shadowBlur:0,shadowOffsetX:0,shadowOffsetY:0,
   lineWidth:1,filter:"none",textAlign:"center",textBaseline:"middle",
   save(){stack.push({globalAlpha:this.globalAlpha,
     globalCompositeOperation:this.globalCompositeOperation,shadowColor:this.shadowColor,
     shadowBlur:this.shadowBlur,shadowOffsetX:this.shadowOffsetX,shadowOffsetY:this.shadowOffsetY,
     filter:this.filter})},
   restore(){Object.assign(this,stack.pop()||{})},
   clearRect(){},setTransform(){},translate(){},scale(){},rotate(){},transform(){},
   fillRect(){},
   fillText(char){log.push({op:"fillText",char,ink:this.fillStyle})},
   strokeText(){},
   drawImage(source){log.push({op:"drawImage",alpha:this.globalAlpha,
     blend:this.globalCompositeOperation,blur:this.shadowBlur,
     shadow:this.shadowColor,source})},
   measureText(text){return {width:String(text).length*
     Number((this.font.match(/(\d+)px/)||[])[1]||16)*.58}},
   createLinearGradient(){const gradient={type:"linear",stops:[],
     addColorStop(position,color){this.stops.push({position,color})}};
     log.push({op:"gradient",gradient});return gradient},
   createRadialGradient(){const gradient={type:"radial",stops:[],
     addColorStop(position,color){this.stops.push({position,color})}};
     log.push({op:"gradient",gradient});return gradient}
 };
 canvas.getContext=()=>ctx;
 registry.push({canvas,ctx,log});
 return canvas;
}
function withCanvas(run){
 const original=globalThis.document,registry=[];
 globalThis.document={createElement:type=>{
   assert.equal(type,"canvas");return canvasSpy(registry);
 }};
 try{return run(registry);}
 finally{if(original===undefined)delete globalThis.document;
   else globalThis.document=original;}
}
const textState={...initial,lettering:"PINK CYAN",letteringAmount:100,
 letteringStyle:"Custom ink",letteringFill:"#e629b4",letteringFillMode:"Solid",
 letteringBlendMode:"Normal",letteringBlendStrength:100,
 letteringWarp:0,letteringFormats:[],letteringStrokes:[],letteringLayers:[]};

test("Export raster uses the author's solid pink ink, not default white",()=>withCanvas(registry=>{
 const canvas=glyphCanvas("PINK CYAN",1,"original",textState);
 assert.ok(canvas.width>0);
 const inks=registry.at(-1).log.filter(x=>x.op==="fillText").map(x=>x.ink);
 assert.ok(inks.length>=8);
 assert.ok(inks.every(x=>x==="#e629b4"),"solid ink colors must survive rasterization");
}));

test("Gradient export retains all color stops, not a white-letter fallback",()=>withCanvas(registry=>{
 glyphCanvas("IRIDESCENT",1,"original",{...textState,
   letteringFillMode:"Linear gradient",
   letteringGradient:["#f900c7","#00ffdd","#e0ff29"]});
 const gradients=registry.flatMap(c=>c.log.filter(x=>x.op==="gradient").map(x=>x.gradient));
 assert.ok(gradients.length>0);
 assert.deepEqual(gradients[0].stops.map(x=>x.color),
   ["#f900c7","#00ffdd","#e0ff29"]);
 assert.ok(registry.flatMap(c=>c.log.filter(x=>x.op==="fillText")).some(x=>x.ink?.type==="linear"));
}));

test("Per-word custom ink overrides only its selected characters",()=>withCanvas(registry=>{
 glyphCanvas("PINK CYAN",1,"original",{...textState,
   letteringFormats:[{start:5,end:9,ink:"#00ddee"}]});
 const inkByChar=registry.at(-1).log.filter(x=>x.op==="fillText");
 assert.ok(inkByChar.some(x=>x.ink==="#e629b4"));
 assert.ok(inkByChar.some(x=>x.ink==="#00ddee"));
 assert.ok(inkByChar.some(x=>x.char==="C"&&x.ink==="#00ddee"));
}));

test("Halo mask punches out the original letter face after applying colored shadows",()=>withCanvas(registry=>{
 const source=canvasSpy(registry);source.width=128;source.height=128;
 const mask=createLetteringHalo(source,[
   {color:"#ffffff",blur:4},
   {color:"#00ddff",blur:14},
   {color:"#ee32a6",blur:23}
 ],1);
 assert.ok(mask&&mask.width===128&&mask.height===128);
 const log=registry.at(-1).log.filter(x=>x.op==="drawImage");
 assert.equal(log.length,4);
 assert.deepEqual(log.slice(0,3).map(x=>x.shadow),
   ["#ffffff","#00ddff","#ee32a6"]);
 assert.ok(log.slice(0,3).every(x=>x.blend==="source-over"&&x.blur>0));
 assert.equal(log.at(-1).blend,"destination-out",
   "last step must REMOVE opaque letter pixels, preserving only exterior glow");
 assert.equal(log.at(-1).blur,0);
}));

test("Colored letter face is painted AFTER the alpha-only halo in export",()=>withCanvas(registry=>{
 const surface=canvasSpy(registry);surface.width=430;surface.height=430;
 const state={...textState,letteringStyle:"Electric glow",
   letteringFill:"#e629b4",letteringBlendMode:"Difference",
   letteringBlendStrength:100};
 paintLettering(surface.getContext("2d"),state,{textTime:0},430,430);
 const passes=registry.find(x=>x.canvas===surface).log.filter(x=>x.op==="drawImage");
 assert.ok(passes.length>=2);
 assert.equal(passes[0].blend,"difference",
   "classic Difference must blend its halo with the SAME operator as the ink");
 assert.ok(passes.filter(x=>x.blend==="difference").length>=2);
 assert.equal(passes.filter(x=>x.blend==="screen").length,0,
   "no hidden Screen halo should wash out a classic Difference blend");
}));

test("Multiply and Screen remain genuine distinct Canvas blend operations",()=>withCanvas(registry=>{
 const main=canvasSpy(registry);main.width=430;main.height=430;
 paintLettering(main.getContext("2d"),{...textState,
   letteringBlendMode:"Multiply"},{textTime:0},430,430);
 paintLettering(main.getContext("2d"),{...textState,
   letteringBlendMode:"Screen"},{textTime:0},430,430);
 const operations=registry.find(x=>x.canvas===main).log.filter(x=>x.op==="drawImage").map(x=>x.blend);
 assert.ok(operations.includes("multiply"));
 assert.ok(operations.includes("screen"));
}));

test("A/B state changes ONLY blend settings on all three text layers",()=>{
 const state={...textState,letteringBlendMode:"Difference",
   letteringBlendStrength:83,letteringLayers:[
     {id:"one",text:"GLITCH",letteringBlendMode:"Multiply",
      letteringBlendStrength:62,letteringFill:"#00ddee"},
     {id:"two",text:"BITCH",letteringBlendMode:"Screen",
      letteringBlendStrength:12,letteringFill:"#e629b4"}]};
 const normal=normalTextBlendState(state);
 assert.equal(normal.letteringBlendMode,"Normal");
 assert.ok(normal.letteringLayers.every(l=>l.letteringBlendMode==="Normal"));
 assert.ok(normal.letteringLayers.every(l=>l.letteringBlendStrength===100));
 for(const key of ["lettering","letteringFill","letteringFormats","colors","seed",
   "engine","filamentAmount","photonAmount"])
   assert.deepEqual(normal[key],state[key]);
 for(let i=0;i<state.letteringLayers.length;i++){
   assert.equal(normal.letteringLayers[i].text,state.letteringLayers[i].text);
   assert.equal(normal.letteringLayers[i].letteringFill,state.letteringLayers[i].letteringFill);
 }
 assert.equal(state.letteringBlendMode,"Difference",
   "Comparison must not mutate the actual artwork state");
});

test("PNG, GIF, MP4 share the corrected composer and have a real A/B proof",()=>{
 const ui=readFileSync(new URL("../src/components/ExportDialog.jsx",import.meta.url),"utf8");
 const exporter=readFileSync(new URL("../src/export.js",import.meta.url),"utf8");
 assert.match(ui,/Compare actual blend vs Normal \(A\/B\)/);
 assert.match(ui,/normalTextBlendState\(snapshot\)/);
 assert.match(ui,/renderImage\(snapshot,timeline,480\)/);
 assert.match(exporter,/paintLettering\(ctx, state, timeline, width, height\)/);
 assert.match(exporter,/paintLettering\(ctx, state, frameClock, size.width, size.height\)/);
});
