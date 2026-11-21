import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {waitForGraphics} from "../src/export.js";

async function withVisibleTab(run) {
  const previous=globalThis.document;
  globalThis.document={hidden:false};
  try {return await run();}
  finally {
    if(previous===undefined)delete globalThis.document;
    else globalThis.document=previous;
  }
}
test("single-frame PNG and video use the same awaited GPU-fence wait",()=>{
  const text=readFileSync(new URL("../src/export.js",import.meta.url),"utf8");
  assert.match(text,/await waitForGraphics\(renderer\);/);
  assert.match(text,/await waitForGraphics\(renderer,signal\);/);
  assert.match(text,/Graphics context was lost during PNG capture/);
  assert.match(text,/Graphics context was lost during video capture/);
  assert.doesNotMatch(text,/const deadline = performance\.now\(\) \+ 30000/);
});
test("already-ready renderer returns without another readback delay",()=>withVisibleTab(async()=>{
  let calls=0;
  await waitForGraphics({ready(){calls++;return true;}},null,100);
  assert.equal(calls,1);
}));
test("GPU wait retries a busy fence and exits once the frame is complete",()=>withVisibleTab(async()=>{
  let polls=0;
  await waitForGraphics({ready(){return ++polls>=3;}},null,200);
  assert.equal(polls,3);
}));
test("a stuck renderer times out with actionable feedback",()=>withVisibleTab(async()=>{
  await assert.rejects(waitForGraphics({ready:()=>false},null,0),
    /graphics processor timed out.*Reduce export resolution/);
}));
test("cancelled rendering aborts even when a frame is already ready",()=>withVisibleTab(async()=>{
  const controller=new AbortController();
  controller.abort();
  await assert.rejects(waitForGraphics({ready:()=>true},controller.signal,100),
    error=>error?.name==="AbortError");
}));
test("hidden browser tab prevents misleading silent export captures",()=>withVisibleTab(async()=>{
  globalThis.document.hidden=true;
  await assert.rejects(waitForGraphics({ready:()=>true},null,100),
    /Keep this tab visible during export/);
}));
