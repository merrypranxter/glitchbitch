import {test,expect} from "@playwright/test";
import {initial} from "../../src/data.js";
import {reveal,conceal} from "./phone-more.js";
const workbench=page=>page.locator(".effects-workbench");
test("Curlwave can wake up, flow, shuffle, hide and undo from the redesigned Materials lab",async({page,isMobile})=>{
  await page.goto("/",{waitUntil:"domcontentloaded"});
  if(isMobile) await page.locator(".mobile-controls")
    .getByRole("button",{name:"Effects",exact:true}).click();
  const room=workbench(page);
  await expect(room).toBeVisible();
  await room.getByRole("searchbox",{name:"Search all effects"}).fill("Curlwave Witchcraft");
  await room.locator(".effect-card-open").first().click();
  const lab=room.locator('[data-section="curlwave-witchcraft"]');
  await expect(lab).toBeVisible();
  const presence=lab.getByRole("slider",{name:"Curlwave presence"});
  await expect(presence).toHaveValue("0");
  await lab.getByRole("combobox",{name:"Living curl species"})
    .selectOption("Bioluminescent River Veins");
  await expect(presence).not.toHaveValue("0");
  await expect(lab.getByRole("slider",{name:"Geometry advection"})).toBeVisible();
  await lab.getByRole("combobox",{name:"Curlwave recipe"})
    .selectOption("Stormglass Vortex Rite");
  await lab.getByRole("button",{name:"Awaken this current"}).click();
  await expect(presence).toHaveValue("99");
  await lab.getByRole("button",{name:"Hide Curlwave"}).click();
  await expect(presence).toHaveValue("0");
  await page.getByTitle("Undo",{exact:true}).click();
  await expect(presence).toHaveValue("99");
});
test("Confirmed NEW CANVAS clears new currents without deleting user colors and saved works",async({page,isMobile})=>{
  await page.goto("/",{waitUntil:"domcontentloaded"});
  if(isMobile) await page.locator(".mobile-controls")
    .getByRole("button",{name:"Effects",exact:true}).click();
  const room=workbench(page);
  await room.getByRole("searchbox",{name:"Search all effects"}).fill("Curlwave Witchcraft");
  await room.locator(".effect-card-open").first().click();
  const lab=room.locator('[data-section="curlwave-witchcraft"]');
  await lab.getByRole("combobox",{name:"Living curl species"})
    .selectOption("Oil-Slick Vortex Velvet");
  await expect(lab.getByRole("slider",{name:"Curlwave presence"})).not.toHaveValue("0");
  await reveal(page);
  await page.getByRole("button",{name:"New Canvas (confirmation required)"}).click();
  const dialog=page.getByRole("dialog",{name:"Start a NEW CANVAS?"});
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button",{name:"Cancel — keep my art"}).click();
  await expect(lab.getByRole("slider",{name:"Curlwave presence"})).not.toHaveValue("0");
  await reveal(page);
  await page.getByRole("button",{name:"New Canvas (confirmation required)"}).click();
  await page.getByRole("dialog",{name:"Start a NEW CANVAS?"})
    .getByRole("button",{name:"Yes, new canvas"}).click();
  await expect.poll(()=>page.evaluate(()=>{
    const draft=JSON.parse(localStorage.getItem("glitch-draft")||"null");
    return draft?.state?.vcAmount;
  })).toBe(0);
  await reveal(page);
  await expect(page.getByRole("spinbutton",{name:"Seed"})).toHaveValue(String(initial.seed));
  await expect(page.getByTitle("Undo",{exact:true})).toBeDisabled();
});
