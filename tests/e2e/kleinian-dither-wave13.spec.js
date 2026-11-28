import {test,expect} from "@playwright/test";
import {initial} from "../../src/data.js";
import {reveal,conceal} from "./phone-more.js";
const workbench=page=>page.locator(".effects-workbench");
test("Kleinian Dither is discoverable, toggleable, preset-ready and undoable on the real UI",async({page,isMobile})=>{
  await page.goto("/",{waitUntil:"domcontentloaded"});
  if(isMobile)
    await page.locator(".mobile-controls").getByRole("button",{name:"Effects",exact:true}).click();
  const room=workbench(page);
  await expect(room).toBeVisible();
  await room.getByRole("searchbox",{name:"Search all effects"}).fill("Kleinian Dither");
  await room.locator(".effect-card-open").first().click();
  const section=room.locator('[data-section="kleinian-dither"]');
  await expect(section).toBeVisible();
  await expect(section.getByRole("slider",{name:"Kleinian print presence"})).toHaveValue("0");
  await section.getByRole("combobox",{name:"Inversion print species"}).selectOption("Cantor Confetti");
  await expect(section.getByRole("slider",{name:"Kleinian print presence"})).not.toHaveValue("0");
  await expect(section.getByRole("slider",{name:"Circle inversion radius"})).toBeVisible();
  await section.getByRole("combobox",{name:"Klein Dither recipe"}).selectOption("Cathedral of Broken Pixels");
  await section.getByRole("button",{name:"Print this geometry"}).click();
  await expect(section.getByRole("slider",{name:"Kleinian print presence"})).toHaveValue("100");
  await section.getByRole("button",{name:"Hide Klein Dither"}).click();
  await expect(section.getByRole("slider",{name:"Kleinian print presence"})).toHaveValue("0");
  await page.getByTitle("Undo",{exact:true}).click();
  await expect(section.getByRole("slider",{name:"Kleinian print presence"})).toHaveValue("100");
});
test("Kleinian Dither is absent from the original starter and recoverable by NEW CANVAS",async({page,isMobile})=>{
  await page.goto("/",{waitUntil:"domcontentloaded"});
  await reveal(page);
  await expect(page.getByRole("spinbutton",{name:"Seed"})).toHaveValue(String(initial.seed));
  await conceal(page);
  if(isMobile)
    await page.locator(".mobile-controls").getByRole("button",{name:"Effects",exact:true}).click();
  const room=workbench(page);
  await room.getByRole("searchbox",{name:"Search all effects"}).fill("Kleinian Dither");
  await room.locator(".effect-card-open").first().click();
  const section=room.locator('[data-section="kleinian-dither"]');
  await section.getByRole("combobox",{name:"Inversion print species"}).selectOption("Parallax Dither Cathedral");
  await expect(section.getByRole("slider",{name:"Kleinian print presence"})).not.toHaveValue("0");
  await reveal(page);
  await page.getByRole("button",{name:"New Canvas (confirmation required)"}).click();
  const modal=page.getByRole("dialog",{name:"Start a NEW CANVAS?"});
  await expect(modal).toBeVisible();
  await modal.getByRole("button",{name:"Yes, new canvas"}).click();
  await expect(modal).toHaveCount(0);
  await expect.poll(async()=>page.evaluate(()=>{
    const doc=JSON.parse(localStorage.getItem("glitch-draft")||"null");
    return doc?.state?.kdAmount;
  })).toBe(0);
  await expect(page.getByTitle("Undo",{exact:true})).toBeDisabled();
});
