import {test,expect} from "@playwright/test";
test("Ecosystem opens its own dock at top, not the Effects family",async({page,isMobile})=>{
 await page.goto("/",{waitUntil:"domcontentloaded"});
 const tabs=isMobile?page.locator(".mobile-controls"):page.locator(".right-panel .inspector-tabs");
 await tabs.getByRole("button",{name:"Effects",exact:true}).click();
 await expect(page.getByText("CONTROL ROOM",{exact:true})).toBeVisible();
 await page.locator(".right-panel .inspector-scroll").evaluate(el=>el.scrollTop=el.scrollHeight);
 await tabs.getByRole("button",{name:"Ecosystem",exact:true}).click();
 const panel=page.locator('.right-panel [data-panel="Ecosystem"]');
 const workspace=panel.getByTestId("ecosystem-workspace");
 await expect(workspace).toBeVisible();
 await expect(workspace.getByRole("button",{name:"Randomize living world"})).toBeInViewport();
 await expect(workspace.getByText("LIVING LABS",{exact:true})).toBeVisible();
 await expect(workspace.getByRole("searchbox",{name:"Search ecosystem"})).toBeVisible();
 await workspace.getByRole("searchbox",{name:"Search ecosystem"}).fill("Backdrop");
 await expect(workspace.locator(".effect-card")).toHaveCount(0);
 await tabs.getByRole("button",{name:"Effects",exact:true}).click();
 await expect(page.getByTestId("ecosystem-workspace")).toHaveCount(0);
});
