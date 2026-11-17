import test from "node:test";
import assert from "node:assert/strict";
import {letteringMotionPaths,letteringMotionAt,letteringMotionCombinedAt,
  letteringMotionNeedsGlyphs,letteringLiquidAt,letteringComposeGlyph} from "../src/lettering-motion.js";
import {createLetteringSprites} from "../src/lettering-sprites.js";
import {initial,validateRecipe,parseDocument} from "../src/data.js";

const same=(a,b)=>Math.abs(a-b)<1e-7;
function assertClosed(a,b,label){
  for(const k of Object.keys(a))
    assert.ok(same(a[k],b[k]),label+" "+k+" "+a[k]+" ≠ "+b[k]);
}
test("all 34 Sparklebae-style trajectories close exactly at four seconds",()=>{
  assert.equal(letteringMotionPaths.length,34);
  assert.equal(new Set(letteringMotionPaths).size,34);
  for(const path of letteringMotionPaths){
    const layer={letteringMotionPath:path,letteringMotion:100,
      letteringMotionStagger:19,letteringMotionSpeed:2,
      letteringMotionDirection:"Reverse"};
    const idx=path.startsWith("Letter ")?3:-1;
    assertClosed(letteringMotionAt(layer,0,430,430,idx,9,60),
      letteringMotionAt(layer,4,430,430,idx,9,60),path);
  }
});
test("two paths stack without shifting the loop seam",()=>{
  const s={letteringMotionPath:"Figure eight",letteringMotionPath2:"Letter wave",
    letteringMotionMix:72,letteringMotion:100,letteringMotionSpeed:3,
    letteringMotionStagger:21};
  assert.equal(letteringMotionNeedsGlyphs(s),true);
  for(const i of [-1,0,4])
    assertClosed(letteringMotionCombinedAt(s,0,430,430,i,8,64),
      letteringMotionCombinedAt(s,4,430,430,i,8,64),"stack"+i);
  assert.equal(letteringMotionNeedsGlyphs({...s,letteringMotionPath2:"None"}),false);
});
test("liquid warp is continuous, full-letter motion with no discontinuity",()=>{
  const s={letteringWarp:100,letteringMotionSpeed:1,
    letteringMotionDirection:"Forward"};
  for(const i of [0,2,10])
    assertClosed(letteringLiquidAt(s,0,i,11,64),
      letteringLiquidAt(s,4,i,11,64),"liquid"+i);
  const zero=letteringLiquidAt({...s,letteringWarp:0},.4,2,11,64);
  assert.equal(zero.dx,0);assert.equal(zero.skewX,0);
  const strong=letteringLiquidAt(s,.4,2,11,64);
  assert.ok(Math.abs(strong.skewX)>1||Math.abs(strong.dx)>1);
  const pose=letteringComposeGlyph({dx:5,dy:0,rotation:4,scaleX:1,scaleY:1,alpha:1},strong);
  assert.ok(Number.isFinite(pose.rotation));
});
test("legacy text recipe loads with default motion, new values round-trip",()=>{
 const saved=validateRecipe({...initial,engine:0,lettering:"FLOW",
   letteringMotionPath:"Orbit",letteringMotionPath2:"Letter wave",
   letteringMotionMix:68,letteringMotionSpeed:3,letteringMotionStagger:18,
   letteringMotionDirection:"Reverse"});
 assert.equal(saved.letteringMotionPath2,"Letter wave");
 assert.equal(saved.letteringMotionMix,68);
 assert.equal(saved.letteringMotionSpeed,3);
 assert.equal(validateRecipe({...initial,engine:0,lettering:"old"}).letteringMotionPath,"Classic drift");
 assert.throws(()=>validateRecipe({...initial,engine:0,letteringMotionPath:"fake"}),/Unknown letteringMotionPath/);
 const parsed=parseDocument({...initial,engine:0,timeline:{time:.4,colorTime:1,textTime:7.25}});
 assert.equal(parsed.timeline.textTime,7.25);
 const legacy=parseDocument({...initial,engine:0,timeline:{time:2,colorTime:3}});
 assert.equal(legacy.timeline.textTime,0);
});
test("sprite generation draws complete glyphs rather than cutting them into strips",()=>{
 const saved=globalThis.document;
 const glyphs=[];
 const ctx=()=>({
   font:"",textAlign:"",textBaseline:"",lineJoin:"",miterLimit:2,
   measureText:s=>({width:Array.from(s).length*22}),
   createLinearGradient:()=>({addColorStop(){}}),
   createRadialGradient:()=>({addColorStop(){}}),
   strokeText(){},fillText:s=>glyphs.push(s)
 });
 globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>ctx()})};
 try{
  const scene=createLetteringSprites("ABC",1,"original",{letteringFillMode:"Solid",
    letteringFill:"#ffffff",letteringStrokes:[]});
  assert.equal(scene.sprites.length,3);
  assert.deepEqual(scene.sprites.map(g=>g.char),["A","B","C"]);
  assert.deepEqual(glyphs,["A","B","C"]);
 }finally{globalThis.document=saved}
});
