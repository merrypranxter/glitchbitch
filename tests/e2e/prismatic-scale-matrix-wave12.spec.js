import {test,expect} from "@playwright/test";
import {initial} from "../../src/data.js";
import {reveal,conceal} from "./phone-more.js";

async function openScales(page,isMobile){
  await page.goto("/",{waitUntil:"domcontentloaded"});
  if(isMobile)
    await page.locator(".mobile-controls").getByRole("button",
      {name:"Effects",exact:true}).click();
  const controlRoom=page.locator(".effects-workbench");
  await expect(controlRoom).toBeVisible();
  await controlRoom.getByLabel("Effect family").selectOption("Materials");
  await controlRoom.locator(".effect-card-open")
    .filter({hasText:"Prismatic Scale Matrix"}).click();
  return controlRoom;
}

test("Wave 12 material editor exposes sensible advanced groups and real state-preserving presets",
  async({page,isMobile})=>{
    const room=await openScales(page,isMobile);
    const presence=page.getByRole("slider",{name:"Scales presence"});
    await expect(presence).toHaveValue("0");
    await expect(page.getByRole("slider",{name:"Shingle overlap"})).not.toBeVisible();
    await room.getByRole("button",{name:"Grow crystalline scales"}).click();
    await expect(presence).not.toHaveValue("0");
    await expect(page.getByRole("slider",{name:"Shingle overlap"})).toBeVisible();
    await page.getByText("Optical alchemy · advanced",{exact:true}).click();
    await expect(page.getByRole("slider",{name:"Diffraction grooves"})).toBeVisible();
    await page.getByText("Living surface · advanced",{exact:true}).click();
    await expect(page.getByRole("slider",{name:"Downward growth flow"})).toBeVisible();
    await room.getByRole("button",{name:"Hide scale skin"}).click();
    await expect(presence).toHaveValue("0");
    await page.getByTitle("Undo",{exact:true}).click();
    await expect(presence).not.toHaveValue("0");
  });

test("Wave 12 Materials navigation, Favorites, Find and original NEW CANVAS remain coherent",
  async({page,isMobile})=>{
    const room=await openScales(page,isMobile);
    await page.getByRole("slider",{name:"Scales presence"}).fill("86");
    await page.getByRole("slider",{name:"Scales presence"}).blur();
    await room.locator(".effect-editor-nav button").first().click();
    await room.getByRole("button",{name:/^Active ·/}).click();
    await expect(room.locator(".effect-card-open")
      .filter({hasText:"Prismatic Scale Matrix"})).toBeVisible();
    await room.getByRole("button",{name:/^Favorites ·/}).click();
    await room.getByRole("button",{name:/^Active ·/}).click();
    await room.locator(".effect-card-open")
      .filter({hasText:"Prismatic Scale Matrix"}).click();
    await room.getByRole("button",{name:/^Favorite Prismatic Scale Matrix/}).click();
    await room.locator(".effect-editor-nav button").first().click();
    await room.getByRole("button",{name:/^Favorites ·/}).click();
    await expect(room.locator(".effect-card-open")
      .filter({hasText:"Prismatic Scale Matrix"})).toBeVisible();
    await reveal(page);
    await page.getByRole("button",{name:"New Canvas (confirmation required)"}).click();
    const dialog=page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button",{name:"Yes, new canvas"}).click();
    await expect(dialog).toHaveCount(0);
    await reveal(page);
    await expect(page.getByRole("spinbutton",{name:"Seed"}))
      .toHaveValue(String(initial.seed));
    await conceal(page);
    await room.getByRole("button",{name:/^Active ·/}).click();
    await expect(room.locator(".effect-card-open")
      .filter({hasText:"Prismatic Scale Matrix"})).toHaveCount(0);
    await room.getByRole("button",{name:/^Favorites ·/}).click();
    await expect(room.locator(".effect-card-open")
      .filter({hasText:"Prismatic Scale Matrix"})).toBeVisible();
  });
