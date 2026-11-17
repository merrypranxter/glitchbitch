import test from "node:test";
import assert from "node:assert/strict";
import { LETTERING_MATERIALS, letteringMaterial, textMotion } from "../src/lettering-materials.js";

const colors=["#ff00cc","#00ddff","#f4ff00","#cb52ff"];
const base={letteringFill:"#ffffff",letteringFillMode:"Solid",letteringGradient:[]};

test("all fourteen named lettering materials produce distinct visible appearances",()=>{
  assert.equal(LETTERING_MATERIALS.length,14);
  const fingerprints=new Set();
  for(const name of LETTERING_MATERIALS){
    const result=letteringMaterial({...base,letteringStyle:name},colors);
    assert.equal(result.preset,name);
    fingerprints.add(JSON.stringify([result.ink,result.gradient,result.previewShadow,result.echoes]));
    if(name!=="Custom ink")assert.ok(result.gradient||result.previewShadow!=="none"||result.echoes.length);
  }
  assert.equal(fingerprints.size,14,"A font-material selector must not contain visual no-ops");
});
test("user gradient override remains editable in every material preset",()=>{
  const user=["#e01290","#48ff00"];
  for(const style of LETTERING_MATERIALS){
    const look=letteringMaterial({...base,letteringStyle:style,
      letteringFillMode:"Radial gradient",letteringGradient:user},colors);
    assert.deepEqual(look.stops,user);
    assert.match(look.gradient,/radial-gradient/);
  }
});
test("kinetic and liquid warp sliders are independently strong at 100%",()=>{
  assert.deepEqual(textMotion({letteringMotion:0,letteringWarp:0}),{motion:0,warp:0});
  assert.deepEqual(textMotion({letteringMotion:100,letteringWarp:100}),{motion:1,warp:1});
  assert.deepEqual(textMotion({letteringMotion:100,letteringWarp:0}),{motion:1,warp:0});
  assert.deepEqual(textMotion({letteringMotion:0,letteringWarp:100}),{motion:0,warp:1});
});

test("custom solid fill affects the preset ink without disabling its material",()=>{
  for(const style of LETTERING_MATERIALS){
    const look=letteringMaterial({...base,letteringStyle:style,letteringFill:"#17ff80"},colors);
    assert.ok(look.ink.toLowerCase()==="#17ff80" ||
      look.stops?.some(color=>color.toLowerCase()==="#17ff80"));
  }
});
