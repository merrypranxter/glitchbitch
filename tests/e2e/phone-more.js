// Studio 6 tucks the title, seed, shape, New Canvas, Lookbook, Load recipe,
// quality and help into the ⋯ More sheet on phones. These helpers open/close
// it when present; on wide screens the controls are already visible, so both
// are no-ops.
export async function reveal(page) {
  const more = page.getByRole("button", { name: "More options" });
  if (await more.isVisible() && !(await page.locator("dialog.sheet[open]").count()))
    await more.click();
}
export async function conceal(page) {
  const sheet = page.locator("dialog.sheet[open]");
  if (await sheet.count()) {
    await sheet.getByRole("button", { name: "Close", exact: true }).click();
    await sheet.waitFor({ state: "detached" });
  }
}
