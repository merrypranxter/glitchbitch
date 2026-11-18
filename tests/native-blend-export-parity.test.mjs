import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {letteringBlendGroups,getLetteringBlendRecipe,isFoundationBlend} from "../src/lettering-blends.js";
import {letteringMaterial,letteringExportColorFilter} from "../src/lettering-materials.js";
import {paintLettering} from "../src/text-compositor.js";

const firstTwo=letteringBlendGroups.slice(0,2).flatMap(g=>g.modes);
const animated={letteringStyle:"Neon bling",letteringFill:"#f518ad",
  letteringFillMode:"Solid",letteringGradient:[],letteringFormats:[],
  lettering:"PINK OVER CYAN",letteringFont:"original",letteringAmount:100,
  letteringScale:48,letteringX:50,letteringY:50,letteringStrokes:[],
  letteringStretchX:100,letteringStretchY:100,letteringMotion:0,
  letteringWarp:0,letteringMotionPath:"Still",letteringLayers:[],
  colors:["#ff12dd","#18f4ef","#a6ef25"]};
function spy(log,documentCanvas=false){
 const stack=[];
 const ctx={font:"",fillStyle:"",strokeStyle:"",textAlign:"center",
   textBaseline:"middle",globalAlpha:1,globalCompositeOperation:"source-over",
   shadowBlur:0,shadowColor:"transparent",shadowOffsetX:0,shadowOffsetY:0,
   filter:"none",lineWidth:1,
   save(){stack.push({globalAlpha:this.globalAlpha,
     globalCompositeOperation:this.globalCompositeOperation,filter:this.filter,
     shadowBlur:this.shadowBlur,shadowColor:this.shadowColor,
     shadowOffsetX:this.shadowOffsetX,shadowOffsetY:this.shadowOffsetY})},
   restore(){Object.assign(this,stack.pop()||{})},
   setTransform(){},clearRect(){},fillRect(){},fillText(){},strokeText(){},
   scale(){},rotate(){},translate(){},transform(){},
   drawImage(){log.push({blend:this.globalCompositeOperation,filter:this.filter,
      alpha:this.globalAlpha,blur:this.shadowBlur})},
   measureText(text){return {width:String(text).length*Number((this.font.match(/(\d+)px/)||[])[1]||16)*.58}},
   createLinearGradient(){return {addColorStop(){}}},
   createRadialGradient(){return {addColorStop(){}}}
 };
 return documentCanvas?{width:0,height:0,getContext:()=>ctx}:ctx;
}
function render(mode,material="Neon bling",seconds=.9){
 const old=globalThis.document,log=[];
 globalThis.document={createElement:()=>spy([],true)};
 try{
   paintLettering(spy(log),{...animated,letteringStyle:material,
      letteringBlendMode:mode,letteringBlendStrength:100},{textTime:seconds},430,430);
   return log;
 }finally{if(old===undefined)delete globalThis.document;else globalThis.document=old;}
}
test("Classic and Add/Subtract are exactly the 27 foundation modes",()=>{
 assert.equal(firstTwo.length,27);
 for(const mode of firstTwo) {
   assert.equal(isFoundationBlend(mode),true,mode);
   assert.equal(getLetteringBlendRecipe(mode).foundation,true,mode);
 }
 for(const group of letteringBlendGroups.slice(2))
   for(const mode of group.modes)
     assert.equal(getLetteringBlendRecipe(mode).foundation,false,mode);
});
test("All foundation halo and face passes inherit the selected COMPOSITING mode",()=>{
 for(const mode of firstTwo){
   const recipe=getLetteringBlendRecipe(mode);
   const drawn=render(mode);
   assert.ok(drawn.length>=1,mode);
   assert.ok(drawn.every(draw=>draw.blend===recipe.canvasBlend),
      mode+": unexpected Screen veil or mismatched text compositing");
   if(!recipe.whiteInk)
     assert.ok(drawn.length>=2,mode+": should paint halo and text face");
   else assert.equal(drawn.length,1,
     mode+": mathematical white-ink inversion should not have a forced halo");
 }
});
test("Multiply, Difference, Burn, and Subtract do not hide beneath a Screen glow",()=>{
 for(const mode of ["Multiply","Difference","Color burn","Subtract","Linear burn"]){
   const draws=render(mode);
   assert.ok(draws.length>=2,mode);
   assert.equal(draws[0].blend,getLetteringBlendRecipe(mode).canvasBlend);
   assert.ok(draws.every(x=>x.blend!=="screen"),mode);
 }
});
test("Neon brightness / saturation animation matches the live material keyframe intensity",()=>{
 const glow=letteringMaterial(animated,animated.colors);
 const start=letteringExportColorFilter(glow,0);
 const peak=letteringExportColorFilter(glow,1.85*.48);
 assert.match(start,/brightness\(1\.000\) saturate\(1\.000\)/);
 assert.match(peak,/brightness\(1\.600\) saturate\(1\.700\)/);
 const multiply=render("Multiply","Neon bling",1.85*.48);
 assert.ok(multiply.every(x=>x.filter.includes("brightness(1.600)")),multiply[0]?.filter);
 assert.ok(multiply.every(x=>x.filter.includes("saturate(1.700)")));
});
test("Holographic gradient animation uses the preview's stronger saturation peak",()=>{
 const holo=letteringMaterial({...animated,letteringStyle:"Holographic"},animated.colors);
 const peak=letteringExportColorFilter(holo,3.3*.5);
 assert.match(peak,/brightness\(1\.360\) saturate\(1\.700\)/);
 const draws=render("Color add","Holographic",3.3*.5);
 assert.ok(draws.every(x=>x.filter.includes("brightness(1.360)")));
 assert.ok(draws.every(x=>x.filter.includes("saturate(1.700)")));
});
test("Custom ink stays unfiltered and exact under native blends",()=>{
 const plain=render("Difference","Custom ink");
 assert.equal(plain.length,1);
 assert.equal(plain[0].blend,"difference");
 assert.equal(plain[0].filter,"none");
});
test("Already-working advanced/experimental glow composition remains unchanged",()=>{
 const advanced=render("Vivid light");
 assert.equal(advanced[0].blend,"screen");
 assert.ok(advanced.some(x=>x.blend==="color-dodge"));
 assert.ok(advanced.some(x=>x.blend==="color-burn"));
 const weird=render("Prism bleed");
 assert.equal(weird[0].blend,"screen");
 assert.ok(weird.length>=3);
});
test("Live DOM and export both read native blend recipes and same shared text materials",()=>{
 const preview=readFileSync(new URL("../src/LiveTextOverlay.jsx",import.meta.url),"utf8");
 const exportSource=readFileSync(new URL("../src/text-compositor.js",import.meta.url),"utf8");
 const encode=readFileSync(new URL("../src/export.js",import.meta.url),"utf8");
 assert.match(preview,/mixBlendMode:pass\.cssBlend/);
 assert.match(exportSource,/paintFoundationHalo=blend\.foundation/);
 assert.match(exportSource,/letteringExportColorFilter\(material,seconds\)/);
 assert.match(exportSource,/if\(glowLayers\.length && !blend\.foundation\)/);
 assert.match(encode,/paintLettering\(ctx, state, timeline, width, height\)/);
 assert.match(encode,/paintLettering\(ctx, state, frameClock, size.width, size.height\)/);
});
