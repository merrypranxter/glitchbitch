import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { initial,validateRecipe,parseDocument,recipeDocument } from "../src/data.js";
import { HabitatSession, habitatTools, makeColony, plantColony,
  clearColonies, MAX_HABITAT_STAMPS, nearestColony } from "../src/habitat-painter.js";
import { TouchSession } from "../src/gestures.js";
import { atmosphereHabitats,atmosphereSecondHabitats,habitatGLSL } from "../src/atmosphere-habitats.js";
import { sectionMeta,findControls } from "../src/ui-index.js";

const art={...initial,engine:17,seed:33592,
  colors:["#00ffff","#ff00bb","#ffff00"],lettering:"DON'T EAT MY WORDS",
  marks:[],atmoAmount:0,atmoBAmount:0,habitatStamps:[]};
const p=(id,x,y)=>({id,x,y});
test("old recipes default to zero planted colonies and unchanged atmosphere output",()=>{
  const old={...art};
  delete old.habitatStamps;
  delete old.habitatBrushRadius;
  const migrated=validateRecipe(old);
  assert.deepEqual(migrated.habitatStamps,[]);
  assert.equal(migrated.habitatBrushRadius,19);
  assert.equal(migrated.atmoMaskMode,"Everywhere");
  assert.equal(migrated.atmoBMaskMode,"Everywhere");
  assert.equal(migrated.atmoAmount,0);
  assert.equal(migrated.atmoBAmount,0);
  assert.equal(migrated.engine,art.engine);
  assert.equal(migrated.lettering,art.lettering);
});
test("stamping parent A/B stores normalized editable, independently seeded colonies",()=>{
  const a=plantColony(art,p(1,.37,.22),0);
  assert.equal(a.habitatStamps.length,1);
  assert.equal(a.habitatStamps[0].parent,0);
  assert.equal(a.habitatStamps[0].radius,art.habitatBrushRadius/100);
  assert.equal(a.atmoMaskMode,"Painted colonies");
  assert.ok(a.atmoAmount>=65);
  assert.equal(a.atmoBAmount,0);
  const b=plantColony(a,p(2,.73,.69),1);
  assert.equal(b.habitatStamps.length,2);
  assert.equal(b.habitatStamps[1].parent,1);
  assert.equal(b.atmoBMaskMode,"Painted colonies");
  assert.ok(b.atmoBAmount>=65);
  assert.equal(b.engine,art.engine);
  assert.equal(b.lettering,art.lettering);
  assert.deepEqual(b.colors,art.colors);
  assert.deepEqual(b.marks,art.marks);
  assert.notEqual(b.habitatStamps[0].id,b.habitatStamps[1].id);
  const restored=parseDocument(recipeDocument(b,"Planted",{time:7,colorTime:11})).state;
  assert.deepEqual(restored.habitatStamps,b.habitatStamps);
  assert.equal(restored.atmoMaskMode,b.atmoMaskMode);
  assert.equal(restored.atmoBMaskMode,b.atmoBMaskMode);
});
test("sixteen-colony bound is hard, even over very long finger strokes",()=>{
  let state=art;
  for(let i=0;i<MAX_HABITAT_STAMPS;i++){
    const next=plantColony(state,p(i,(i+.2)/17,.5),i%2);
    assert.equal(next.habitatStamps.length,i+1);
    state=next;
  }
  assert.equal(plantColony(state,p(200,.8,.8)),state);
  const session=new HabitatSession(state,"Plant A",p(7,.15,.15));
  session.move(p(7,.6,.6));
  assert.equal(session.draft.habitatStamps.length,MAX_HABITAT_STAMPS);
  assert.equal(session.release(7),true);
  assert.equal(atmosphereHabitats.at(-1),"Painted colonies");
  assert.ok(atmosphereSecondHabitats.includes("Inverse first"));
});
test("plant gesture is a single coherent document change; second finger suspends painting",()=>{
  const start=art;
  const session=new HabitatSession(start,"Plant A",p(1,.1,.2));
  session.move(p(1,.18,.2));
  const n=session.draft.habitatStamps.length;
  assert.ok(n>=2);
  session.add(p(2,.4,.5));
  session.move(p(1,.8,.8));
  session.move(p(2,.9,.9));
  assert.equal(session.draft.habitatStamps.length,n);
  assert.equal(session.release(2),false);
  session.move(p(1,.2,.8));
  assert.equal(session.draft.habitatStamps.length,n);
  assert.equal(session.release(1),true);
  assert.deepEqual(start.habitatStamps,[]);
});
test("dragging existing colony does not plant and respects canvas bounds",()=>{
  const state=plantColony(art,p(1,.4,.5),0);
  const target=state.habitatStamps[0].id;
  const session=new HabitatSession(state,"Move Colony",p(2,.4,.5),1,target);
  session.move(p(2,1.2,-.3));
  const moved=session.draft.habitatStamps[0];
  assert.equal(moved.id,target);
  assert.equal(moved.x,1);
  assert.equal(moved.y,0);
  assert.equal(session.draft.habitatStamps.length,1);
  assert.equal(session.release(2),true);
  const erased=new HabitatSession(session.draft,"Erase Colony",p(3,1,0));
  assert.equal(erased.draft.habitatStamps.length,0);
  assert.deepEqual(state.habitatStamps.map(x=>x.id),[target]);
  assert.equal(nearestColony(state.habitatStamps,p(2,.4,.5),1),0);
});
test("clear A/B/all acts on seed data only, original math and touch marks stay",()=>{
  let state=plantColony(art,p(1,.2,.4),0);
  state=plantColony(state,p(2,.7,.6),1);
  assert.equal(clearColonies(state,0).habitatStamps.length,1);
  assert.equal(clearColonies(state,0).habitatStamps[0].parent,1);
  assert.equal(clearColonies(state,1).habitatStamps[0].parent,0);
  assert.deepEqual(clearColonies(state).habitatStamps,[]);
  assert.equal(clearColonies(state).atmoAmount,state.atmoAmount);
  assert.equal(clearColonies(state).lettering,art.lettering);
});
test("reject invalid colony input before it reaches WebGL",()=>{
  const good=makeColony(art,p(1,.2,.4),0);
  const invalid=[
    {...good,x:-.1},{...good,y:1.1},{...good,radius:2},
    {...good,parent:7},{...good,id:""},{...good,radius:NaN},
  ];
  for(const bad of invalid)
    assert.throws(()=>validateRecipe({...art,habitatStamps:[bad]}));
  assert.throws(()=>validateRecipe({...art,habitatStamps:[good,good]}));
  assert.throws(()=>validateRecipe({...art,habitatStamps:
    Array.from({length:17},(_,i)=>({...good,id:"colony-"+i}))}));
  assert.throws(()=>validateRecipe({...art,habitatBrushRadius:70}));
});
test("paint masks use the shared export shader and never bake handles into pixels",()=>{
  const renderer=readFileSync(new URL("../src/renderer.js",import.meta.url),"utf8");
  const canvas=readFileSync(new URL("../src/ArtCanvas.jsx",import.meta.url),"utf8");
  const inspectors=readFileSync(new URL("../src/components/Inspectors.jsx",import.meta.url),"utf8");
  assert.ok(habitatGLSL.includes("vec4 habitatStamps[16]"));
  assert.ok(habitatGLSL.includes("float paintedHabitat("));
  assert.ok(habitatGLSL.includes("if(kind==5)return paintedHabitat("));
  assert.ok(habitatGLSL.includes("ATM_MASK_B==6"));
  assert.ok(renderer.includes('gl.uniform4fv(loc("habitatStamps[0]"),habitatBuffer)'));
  assert.ok(renderer.includes('gl.uniform1i(loc("habitatStampCount"),plantedCount)'));
  assert.ok(canvas.includes("new HabitatSession("));
  assert.ok(canvas.includes("new TouchSession("));
  assert.ok(canvas.includes("onPointerCancel={cancel}"));
  assert.ok(canvas.includes("onLostPointerCapture="));
  assert.ok(canvas.includes("data-colony={m.id}"));
  assert.ok(inspectors.includes("HABITAT GRAFFITI"));
  assert.ok(inspectors.includes("Plant A on image"));
  assert.ok(inspectors.includes("Plant B on image"));
  assert.equal(sectionMeta("habitat-paint").tab,"Touch");
  assert.equal(findControls("habitat graffiti")[0].id,"habitat-paint");
  assert.ok(habitatTools.includes("Erase Colony"));
});
