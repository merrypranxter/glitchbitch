import {test,expect} from "@playwright/test";
import {initial} from "../../src/data.js";

const newButton=page=>page.getByRole("button",{name:"New Canvas (confirmation required)"});
const titleInput=page=>page.getByRole("textbox",{name:"Artwork title"});
const seedInput=page=>page.getByRole("spinbutton",{name:"Seed"});

test("New Canvas is an explicit two-step action; cancelling keeps the existing artwork",async({page})=>{
  await page.goto("/",{waitUntil:"domcontentloaded"});
  await titleInput(page).fill("Please keep my canvas");
  await seedInput(page).fill("424242");
  await seedInput(page).blur();
  await newButton(page).click();
  const confirm=page.getByRole("dialog");
  await expect(confirm).toBeVisible();
  await expect(confirm).toContainText("unsaved canvas");
  await expect(confirm).toContainText("Saved works vault");
  await confirm.getByRole("button",{name:"Cancel — keep my art"}).click();
  await expect(confirm).toHaveCount(0);
  await expect(titleInput(page)).toHaveValue("Please keep my canvas");
  await expect(seedInput(page)).toHaveValue("424242");
  await expect(page.getByTitle("Undo",{exact:true})).toBeEnabled();
});

test("Confirm New Canvas restores original starter and clears history, not saved vault",async({page})=>{
  await page.goto("/",{waitUntil:"domcontentloaded"});
  await titleInput(page).fill("I made this yesterday");
  await seedInput(page).fill("333333");
  await seedInput(page).blur();
  await page.evaluate(()=>{
    localStorage.setItem("glitch-saved","this is a sentinel, not a valid gallery");
    localStorage.setItem("glitch-palettes","do not delete my palettes");
    localStorage.setItem("glitch-studio-pane-v1",".61");
  });
  await newButton(page).click();
  const dialog=page.getByRole("dialog");
  await expect(dialog.getByRole("button",{name:"Yes, new canvas"})).toBeVisible();
  // No accidental reset until this second deliberate tap.
  await expect(seedInput(page)).toHaveValue("333333");
  await dialog.getByRole("button",{name:"Yes, new canvas"}).click();
  await expect(dialog).toHaveCount(0);
  await expect(titleInput(page)).toHaveValue("Untitled exploration");
  await expect(seedInput(page)).toHaveValue(String(initial.seed));
  await expect(page.getByTitle("Undo",{exact:true})).toBeDisabled();
  await expect(page.getByTitle("Redo",{exact:true})).toBeDisabled();
  await expect.poll(async()=>page.evaluate(()=>{
    const doc=JSON.parse(localStorage.getItem("glitch-draft")||"null");
    return doc?.state?.seed;
  })).toBe(initial.seed);
  const observed=await page.evaluate(()=>({
    doc:JSON.parse(localStorage.getItem("glitch-draft")),
    saved:localStorage.getItem("glitch-saved"),
    palettes:localStorage.getItem("glitch-palettes"),
    divider:localStorage.getItem("glitch-studio-pane-v1")
  }));
  expect(observed.doc.state.marks).toEqual([]);
  expect(observed.doc.state.g2Amount).toBe(0);
  expect(observed.doc.timeline.time).toBe(0);
  expect(observed.doc.timeline.colorTime).toBe(0);
  expect(observed.saved).toBe("this is a sentinel, not a valid gallery");
  expect(observed.palettes).toBe("do not delete my palettes");
  expect(observed.divider).toBe(".61");
});

test("New Canvas stays reachable in a narrow phone-sized workspace",async({page,isMobile})=>{
  test.skip(!isMobile,"Phone viewport test");
  await page.goto("/",{waitUntil:"domcontentloaded"});
  await page.setViewportSize({width:390,height:844});
  await expect(newButton(page)).toBeVisible();
  const button=await newButton(page).boundingBox();
  expect(button).not.toBeNull();
  expect(button.x).toBeGreaterThanOrEqual(0);
  expect(button.x+button.width).toBeLessThanOrEqual(390);
  await newButton(page).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(seedInput(page)).toHaveValue(String(initial.seed));
});
