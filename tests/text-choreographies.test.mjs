import test from "node:test";
import assert from "node:assert/strict";
import { textChoreographyGroups, textChoreographies, textChoreographyKeys,
  applyTextChoreography, remixTextChoreography, mutateTextChoreography } from "../src/text-choreographies.js";
import { letteringStyles, initial, validateRecipe } from "../src/data.js";
import { letteringMotionPaths } from "../src/lettering-motion.js";
import { letteringBlendModes } from "../src/lettering-blends.js";

const original={ ...initial,
  lettering:"My own words!", letteringFont:"comic-sans",
  letteringFill:"#aabbcc",letteringGradient:["#aabbcc","#77ee44"],
  letteringStrokes:[{color:"#123456",width:4,enabled:true}],
  letteringX:27,letteringY:78,letteringRotation:23,
  letteringAmount:87,letteringScale:67,
  letteringLayers:[{id:"two",text:"More words",visible:true}]
};
const protectedFields=["lettering","text","letteringFont","letteringFill","letteringGradient",
  "letteringStrokes","letteringX","letteringY","letteringRotation",
  "letteringAmount","letteringScale","letteringLayers","colors","marks","seed"];
function preserves(before,after){
 for(const key of protectedFields)assert.deepEqual(after[key],before[key],key+" must be preserved");
}
test("24 distinct named choreography recipes have valid existing FX settings",()=>{
 assert.equal(textChoreographies.length,24);
 assert.equal(new Set(textChoreographies.map(p=>p.id)).size,24);
 assert.deepEqual(textChoreographyGroups.flatMap(g=>g.presets),textChoreographies);
 for(const p of textChoreographies){
  assert.ok(p.label.length>2);
  assert.ok(p.description.length>10);
  assert.ok(letteringStyles.includes(p.settings.letteringStyle),p.id+" style");
  assert.ok(letteringBlendModes.includes(p.settings.letteringBlendMode),p.id+" blend");
  assert.ok(letteringMotionPaths.includes(p.settings.letteringMotionPath),p.id+" movement");
  assert.ok(letteringMotionPaths.includes(p.settings.letteringMotionPath2),p.id+" second movement");
  for(const key of textChoreographyKeys){
    if(key==="letteringMotionDirection")continue;
    assert.ok(Object.hasOwn(p.settings,key),p.id+" missing "+key);
  }
  const state=applyTextChoreography(original,p.id);
  preserves(original,state);
  const recipe=validateRecipe({...state,engine:0});
  assert.equal(recipe.letteringMotionPath,p.settings.letteringMotionPath);
  assert.equal(recipe.letteringBlendMode,p.settings.letteringBlendMode);
 }
});
test("preset selection preserves the user's type, gradient, strokes and full artwork",()=>{
 for(const p of textChoreographies){
  preserves(original,applyTextChoreography(original,p.id));
 }
 assert.equal(applyTextChoreography(original,"unknown"),original);
});
test("surprise presets do not repeat current recipe and do not write slogans",()=>{
 const current=applyTextChoreography(original,textChoreographies[0].id);
 const surprise=remixTextChoreography(current,"all",()=>0);
 preserves(current,surprise);
 assert.notEqual(surprise.letteringMotionPath,current.letteringMotionPath);
});
test("movement-only and color/blend-only remixes are genuinely independent",()=>{
 const current=applyTextChoreography(original,"myspace-afterlife");
 const motion=remixTextChoreography(current,"motion",()=>0.3);
 preserves(current,motion);
 assert.equal(motion.letteringStyle,current.letteringStyle);
 assert.equal(motion.letteringBlendMode,current.letteringBlendMode);
 assert.notEqual(motion.letteringMotionPath,current.letteringMotionPath);
 const blend=remixTextChoreography(current,"blend",()=>0.42);
 preserves(current,blend);
 assert.equal(blend.letteringMotionPath,current.letteringMotionPath);
 assert.notEqual(blend.letteringBlendMode,current.letteringBlendMode);
});
test("mutation stays inside numeric ranges without affecting authored content",()=>{
 const current=applyTextChoreography(original,"acid-carnival");
 for(const rng of [()=>0,()=>.5,()=>.999999]){
  const out=mutateTextChoreography(current,rng);
  preserves(current,out);
  for(const key of ["letteringMotion","letteringMotionMix","letteringMotionStagger",
    "letteringWarp","letteringBlendStrength"]){
    assert.ok(out[key]>=0&&out[key]<=100,key);
  }
  assert.ok(out.letteringMotionSpeed>=1&&out.letteringMotionSpeed<=4);
  validateRecipe({...out,engine:0});
 }
});
test("extra-layer remixes keep separate text, font and stroke settings",()=>{
 const layer={...original,text:"SECOND LAYER",lettering:"irrelevant",id:"layer2",visible:true};
 const result=remixTextChoreography(layer,"all",()=>0.6);
 assert.equal(result.text,layer.text);
 assert.equal(result.id,layer.id);
 assert.equal(result.letteringFont,layer.letteringFont);
 assert.deepEqual(result.letteringStrokes,layer.letteringStrokes);
});
