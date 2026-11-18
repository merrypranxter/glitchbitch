import test from "node:test";
import assert from "node:assert/strict";
import {
  setTextInk,setTextRainbow,clearTextInk,toggleTextFormat,
  rebaseTextFormats,textStyleAt,textFormattingSegments,spectrumInk,
  formattedGlyphInk,formatCharStyle
} from "../src/text-formatting.js";
import { glyphCanvas } from "../src/kinetic-type.js";
import { createLetteringSprites } from "../src/lettering-sprites.js";
import { initial,validateRecipe } from "../src/data.js";

test("color selected word without modifying the authored words or other formats",()=>{
 const text="MY BEAUTIFUL CHAOS";
 let spans=toggleTextFormat(text,[],3,12,"bold");
 spans=setTextInk(text,spans,3,12,"#FF39BE");
 assert.equal(textStyleAt(spans,4).ink,"#ff39be");
 assert.equal(textStyleAt(spans,4).bold,true);
 assert.equal(textStyleAt(spans,0).ink,null);
 assert.equal(textFormattingSegments(text,spans)[1].raw,"BEAUTIFUL");
 assert.equal(textFormattingSegments(text,spans)[1].display,"BEAUTIFUL");
 spans=clearTextInk(text,spans,3,12);
 assert.equal(textStyleAt(spans,4).ink,null);
 assert.equal(textStyleAt(spans,4).bold,true);
});
test("rainbow selected word paints each glyph a different deterministic hue",()=>{
 const text="glitter jelly";
 let spans=setTextRainbow(text,[],0,7);
 const segments=textFormattingSegments(text,spans);
 assert.equal(segments.slice(0,7).map(s=>s.raw).join(""),"glitter");
 assert.equal(textStyleAt(spans,1).rainbow,true);
 assert.equal(textStyleAt(spans,8).rainbow,false);
 const a=formatCharStyle(textStyleAt(spans,0),0);
 const b=formatCharStyle(textStyleAt(spans,1),1);
 assert.notEqual(a.WebkitTextFillColor,b.WebkitTextFillColor);
 assert.equal(a.WebkitTextFillColor,spectrumInk(0));
 assert.equal(formattedGlyphInk(textStyleAt(spans,3),3,"#ffffff"),spectrumInk(3));
 assert.equal(formattedGlyphInk(textStyleAt(spans,8),8,"#ffffff"),"#ffffff");
});
test("switching between solid ink and rainbow does not discard other rich-word styles",()=>{
 const t="these two words";
 let formats=toggleTextFormat(t,[],6,9,"underline");
 formats=setTextInk(t,formats,6,9,"#00ffff");
 formats=setTextRainbow(t,formats,6,9);
 assert.equal(textStyleAt(formats,7).ink,null);
 assert.equal(textStyleAt(formats,7).rainbow,true);
 assert.equal(textStyleAt(formats,7).underline,true);
 formats=setTextInk(t,formats,6,9,"#ccff22");
 assert.equal(textStyleAt(formats,7).rainbow,false);
 assert.equal(textStyleAt(formats,7).ink,"#ccff22");
 assert.equal(textStyleAt(formats,7).underline,true);
});
test("rich word colors survive inserts/deletions and persist in saved layers",()=>{
 const t="blue neon";
 let formats=setTextInk(t,[],5,9,"#123abc");
 formats=rebaseTextFormats(t,"hello "+t,formats);
 assert.equal(textStyleAt(formats,11).ink,"#123abc");
 const obj=validateRecipe({...initial,engine:0,lettering:"hello "+t,letteringFormats:formats,
   letteringLayers:[{id:"extra",text:"rainbow",visible:true,
      letteringFormats:setTextRainbow("rainbow",[],0,7)}]});
 assert.equal(textStyleAt(obj.letteringFormats,11).ink,"#123abc");
 assert.equal(textStyleAt(obj.letteringLayers[0].letteringFormats,2).rainbow,true);
 assert.throws(()=>validateRecipe({...initial,engine:0,lettering:"X",
   letteringFormats:[{start:0,end:1,ink:"red"}]}),/Invalid rich text ink/);
 assert.throws(()=>validateRecipe({...initial,engine:0,letteringLayers:[{
   id:"extra",text:"X",visible:true,letteringFormats:[{start:0,end:1,ink:"evil"}]
 }]}),/Invalid layer text ink/);
});
test("the static and animated Canvas typography layers paint custom word colors",()=>{
 const old=globalThis.document;
 const fills=[];
 const context=()=>{
   const c={
    font:"",fillStyle:"#ffffff",strokeStyle:"#000",
    textAlign:"",textBaseline:"",lineJoin:"",miterLimit:2,
    measureText(s){return {width:Array.from(s).length*Number((this.font.match(/(\d+)px/)||[])[1]||16)*.55}},
    clearRect(){},strokeText(){},fillRect(){},save(){},restore(){},
    fillText(char){fills.push([char,this.fillStyle])},
    createLinearGradient(){return {addColorStop(){}}},
    createRadialGradient(){return {addColorStop(){}}}
   };
   return c;
 };
 globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>context()})};
 try{
   const t="HELLO MAGIC";
   let formats=setTextInk(t,[],6,11,"#e733ff");
   const style={letteringFill:"#ffffff",letteringFillMode:"Solid",
     letteringFormats:formats,letteringStrokes:[]};
   glyphCanvas(t,1,"original",style);
   assert.ok(fills.some(([c,color])=>c==="M"&&color==="#e733ff"));
   assert.ok(fills.some(([c,color])=>c==="H"&&color==="#ffffff"));
   fills.length=0;
   const sprites=createLetteringSprites(t,1,"original",style);
   assert.equal(sprites.sprites.length,10);
   assert.ok(fills.some(([c,color])=>c==="M"&&color==="#e733ff"));
   formats=setTextRainbow(t,[],6,11);
   fills.length=0;
   glyphCanvas(t,1,"original",{...style,letteringFormats:formats});
   const magic=fills.filter(([c])=>"MAGIC".includes(c));
   assert.ok(new Set(magic.map(([,color])=>color)).size>=4);
 }finally{if(old===undefined)delete globalThis.document;else globalThis.document=old}
});
