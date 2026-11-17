import test from "node:test";
import assert from "node:assert/strict";
import { toggleTextFormat, textStyleAt, wordSelection,
  rebaseTextFormats, textFormattingSegments } from "../src/text-formatting.js";
import { layoutLettering } from "../src/lettering-layout.js";
import { glyphCanvas } from "../src/kinetic-type.js";
import { createLetteringSprites } from "../src/lettering-sprites.js";
import { initial, validateRecipe } from "../src/data.js";
const measure=()=>({
  font:"",textAlign:"",textBaseline:"",lineJoin:"",miterLimit:2,
  fillStyle:"#fff",strokeStyle:"#000",lineWidth:1,
  measureText(text){const size=Number(this.font.match(/(\d+)px/)?.[1]||16);
    return {width:Array.from(text).length*size*.55};},
  clearRect(){},strokeText(){},fillRect(){},fillText(){},drawImage(){},
  createLinearGradient:()=>({addColorStop(){}}),
  createRadialGradient:()=>({addColorStop(){}})
});
test("all five rich typography tools work on one word without rewriting the text",()=>{
 const text="the weird moon sings";
 let spans=[];
 for(const key of ["bold","italic","underline","strike","caps"])
   spans=toggleTextFormat(text,spans,4,9,key);
 assert.equal(spans.length,1);
 assert.equal(spans[0].start,4);
 assert.equal(spans[0].end,9);
 assert.equal(textFormattingSegments(text,spans)[1].display,"WEIRD");
 for(const key of ["bold","italic","underline","strike","caps"])
   assert.equal(textStyleAt(spans,5)[key],true);
 assert.equal(textStyleAt(spans,0).bold,false);
 spans=toggleTextFormat(text,spans,4,9,"caps");
 assert.equal(textFormattingSegments(text,spans)[1].display,"weird");
 assert.equal(textStyleAt(spans,5).bold,true);
});
test("caret formats one word and selected phrase formats multiple words",()=>{
 const t="quiet  SUPER weird";
 assert.deepEqual(wordSelection(t,2,2),{start:0,end:5});
 const t1=toggleTextFormat(t,[],8,8,"italic");
 assert.equal(textStyleAt(t1,8).italic,true);
 assert.equal(textStyleAt(t1,1).italic,false);
 const t2=toggleTextFormat(t,t1,0,13,"underline");
 assert.equal(textStyleAt(t2,0).underline,true);
 assert.equal(textStyleAt(t2,8).underline,true);
});
test("tracked formats shift predictably when typing and deleting",()=>{
 const t="one two three";
 const marked=toggleTextFormat(t,[],4,7,"bold");
 const moved=rebaseTextFormats(t,"hello "+t,marked);
 assert.equal(textStyleAt(moved,10).bold,true);
 assert.equal(textStyleAt(moved,4).bold,false);
 const removed=rebaseTextFormats("hello "+t,t,moved);
 assert.equal(textStyleAt(removed,5).bold,true);
});
test("tracking changes width and leading changes vertical line distance",()=>{
 const ctx=measure();
 const narrow=layoutLettering(ctx,"A B C",1,"original",{letteringTracking:-20});
 const normal=layoutLettering(ctx,"A B C",1,"original",{letteringTracking:0});
 const wide=layoutLettering(ctx,"A B C",1,"original",{letteringTracking:100});
 assert.ok(wide.size<=normal.size);
 assert.ok(narrow.tracking<normal.tracking && wide.tracking>normal.tracking);
 const tight=layoutLettering(ctx,"A\nB",1,"original",{letteringLineSpacing:60});
 const airy=layoutLettering(ctx,"A\nB",1,"original",{letteringLineSpacing:240});
 assert.ok(tight.leading<airy.leading);
 assert.ok(airy.glyphs[1].y-airy.glyphs[0].y >
   tight.glyphs[1].y-tight.glyphs[0].y);
});
test("static and animated export glyph atlases show caps and decorations",()=>{
 const saved=globalThis.document;
 const filled=[],ctx=measure();
 ctx.fillText=(t,x,y)=>filled.push(t);
 globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};
 try {
   const phrase="left right";
   const styles=toggleTextFormat(phrase,[],5,10,"caps");
   const options={letteringFillMode:"Solid",letteringFill:"#ffffff",
     letteringTracking:38,letteringLineSpacing:140,
     letteringFormats:styles,letteringStrokes:[]};
   const c=glyphCanvas(phrase,1,"original",options);
   assert.equal(c.width,1024);
   assert.ok(filled.includes("R"));
   assert.ok(filled.includes("T"));
   filled.length=0;
   const sprites=createLetteringSprites(phrase,1,"original",options);
   assert.equal(sprites.sprites.length,9);
   assert.ok(filled.includes("R"));
 }finally{if(saved===undefined)delete globalThis.document;else globalThis.document=saved}
});
test("old recipes stay compatible; new formats and spacing round trip",()=>{
 const old=validateRecipe({...initial,engine:0,lettering:"legacy"});
 assert.equal(old.letteringTracking,0);
 assert.equal(old.letteringLineSpacing,118);
 assert.deepEqual(old.letteringFormats,[]);
 const text="hi there";
 const formats=toggleTextFormat(text,[],3,8,"underline");
 const saved=validateRecipe({...initial,engine:0,lettering:text,
   letteringTracking:55,letteringLineSpacing:190,letteringFormats:formats,
   letteringLayers:[{id:"two",text:"LOUD",visible:true,
     letteringTracking:-10,letteringLineSpacing:240,
     letteringFormats:toggleTextFormat("LOUD",[],0,4,"caps")}]});
 assert.equal(saved.letteringTracking,55);
 assert.equal(saved.letteringLineSpacing,190);
 assert.deepEqual(saved.letteringFormats,formats);
 assert.equal(saved.letteringLayers[0].letteringFormats[0].caps,true);
 assert.throws(()=>validateRecipe({...initial,engine:0,letteringTracking:101}),/Invalid letteringTracking/);
 assert.throws(()=>validateRecipe({...initial,engine:0,letteringFormats:[{start:4,end:700,bold:true}]}),/Invalid rich text range/);
});
