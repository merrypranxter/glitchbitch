import { test, expect } from '@playwright/test';
import { effectSections } from '../../src/effects-navigation.js';

const room = page => page.locator('.effects-workbench');
async function start(page, isMobile) {
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await expect(page.locator('.engine-grid button')).toHaveCount(20);
  if (isMobile) await page.locator('.mobile-controls').getByRole('button', {name:'Effects', exact:true}).click();
  await expect(room(page)).toBeVisible();
}
async function search(page, term) {
  await room(page).getByRole('searchbox', {name:'Search all effects'}).fill(term);
}
const editor = (page,id) => room(page).locator(`[data-section="${id}"]`);

test('every original Effects section opens without changing artwork or canvas', async ({ page, isMobile }) => {
  const errors=[]; page.on('pageerror', e=>errors.push(e.message));
  await start(page,isMobile);
  const canvas=await page.locator('.art-stage').boundingBox();
  await expect.poll(()=>page.evaluate(()=>localStorage.getItem('glitch-draft'))).not.toBeNull();
  const draft=await page.evaluate(()=>localStorage.getItem('glitch-draft'));
  for (const entry of effectSections) {
    await search(page,entry.title);
    await room(page).locator('.effect-card-open').filter({has:page.getByText(entry.title,{exact:true})}).click();
    await expect(editor(page,entry.id)).toBeVisible();
    await expect(editor(page,entry.id).locator('.section-disclosure')).toHaveAttribute('aria-expanded','true');
    await expect(editor(page,entry.id).locator('.section-body')).toBeVisible();
    await room(page).locator('.effect-editor-nav button').first().click();
  }
  expect(await page.locator('.art-stage').boundingBox()).toEqual(canvas);
  expect(await page.evaluate(()=>localStorage.getItem('glitch-draft'))).toEqual(draft);
  expect(errors).toEqual([]);
});

test('global search opens deepest labs; sticky switch and favorites survive reload', async ({page,isMobile})=>{
  const warnings=[];page.on('console',m=>{if(m.type()==='error'||m.type()==='warning')warnings.push(m.text())});
  await start(page,isMobile);
  const canvas=await page.locator('.art-stage').boundingBox();
  await page.getByTitle('Find a control (Ctrl/Cmd+K or /)').click();
  await page.getByRole('combobox', {name:'Find a control'}).fill('second fiber dispersion');
  await page.locator('.find-results button').first().click();
  const target=room(page).locator('[data-effect-detail="filament-optics-b"]');
  await expect(target).toHaveAttribute('open','');
  await expect(room(page).locator('[data-effect-detail="filament-materials"]')).toHaveAttribute('open','');
  await expect(room(page).locator('[data-effect-detail="filament-optics"]')).toHaveAttribute('open','');
  const back=room(page).locator('.effect-editor-nav button').first();
  await expect(back).toBeInViewport();
  await room(page).getByLabel('Jump to a laboratory').selectOption('filament-neural');
  await expect(room(page).locator('[data-effect-detail="filament-neural"]')).toHaveAttribute('open','');
  await expect(back).toBeInViewport();
  await back.click();
  await search(page,'Neural loom');
  await room(page).getByRole('button',{name:'Favorite Neural loom',exact:true}).click();
  await room(page).getByRole('button',{name:/^Favorites ·/}).click();
  await expect(room(page).locator('.effect-card')).toHaveCount(1);
  expect(await page.locator('.art-stage').boundingBox()).toEqual(canvas);
  await page.reload({waitUntil:'domcontentloaded'});
  if(isMobile)await page.locator('.mobile-controls').getByRole('button',{name:'Effects',exact:true}).click();
  await room(page).getByRole('button',{name:/^Favorites ·/}).click();
  await expect(room(page).locator('.effect-card')).toHaveCount(1);
  await expect(room(page).getByRole('button',{name:'Unfavorite Neural loom',exact:true})).toHaveAttribute('aria-pressed','true');
  const draft=await page.evaluate(()=>JSON.parse(localStorage.getItem('glitch-draft')));
  expect(JSON.stringify(draft)).not.toContain('favorites');
  await room(page).getByRole('button',{name:'Unfavorite Neural loom',exact:true}).click();
  await expect(room(page).locator('.effect-empty')).toContainText('Tap a star');
  expect(warnings.filter(message => !/GL Driver Message .*GPU stall due to ReadPixels/.test(message))).toEqual([]);
});

test('controls, preset, reset, undo/redo and Active use original state', async ({page,isMobile})=>{
  await start(page,isMobile);
  await search(page,'Signal break');
  await room(page).locator('.effect-card-open').click();
  const slider=page.getByRole('slider',{name:'Chromatic split',exact:true});
  await slider.fill('70');await slider.blur();
  await expect(slider).toHaveValue('70');
  await room(page).locator('.effect-editor-nav button').first().click();
  await room(page).getByRole('button',{name:/^Active ·/}).click();
  await expect(room(page).locator('.effect-card-open').filter({hasText:'Signal break'})).toBeVisible();
  await room(page).locator('.effect-card-open').filter({hasText:'Signal break'}).click();
  await expect(slider).toHaveValue('70');
  await page.getByTitle('Undo',{exact:true}).click();
  await expect(slider).not.toHaveValue('70');
  await page.getByTitle('Redo',{exact:true}).click();
  await expect(slider).toHaveValue('70');
  await editor(page,'signal').getByRole('button',{name:'Reset signal break'}).click();
  await expect(slider).not.toHaveValue('70');
  await room(page).locator('.effect-editor-nav button').first().click();
  await search(page,'Bio rot');await room(page).locator('.effect-card-open').click();
  await page.getByRole('button',{name:'Cultivate selected growth',exact:true}).click();
  await expect(page.getByRole('slider',{name:'Organism',exact:true})).not.toHaveValue('0');
  await page.getByTitle('Undo',{exact:true}).click();
  await expect(page.getByRole('slider',{name:'Organism',exact:true})).toHaveValue('0');
});

test('phone divider and responsive layout stay bounded',async({page,isMobile})=>{
  test.skip(!isMobile,'phone divider');
  await start(page,isMobile);
  for(const [width,height] of [[320,568],[375,667],[390,844],[430,932],[844,390]]){
    await page.setViewportSize({width,height});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    const stage=await page.locator('.art-stage').boundingBox();
    expect(stage.y).toBeGreaterThanOrEqual(0);expect(stage.height).toBeGreaterThan(0);
    expect(stage.y+stage.height).toBeLessThan(height);
  }
  await page.setViewportSize({width:390,height:844});
  const divider=page.getByRole('separator');
  const previous=await page.locator('.art-stage').boundingBox();
  await divider.focus();await page.keyboard.press('ArrowUp');
  expect((await page.locator('.art-stage').boundingBox()).height).toBeLessThan(previous.height);
  const b=await divider.boundingBox();await page.mouse.move(b.x+b.width/2,b.y+b.height/2);await page.mouse.down();await page.mouse.move(b.x+b.width/2,b.y-60,{steps:8});await page.mouse.up();
  expect((await page.locator('.art-stage').boundingBox()).height).toBeLessThan(previous.height);
});

test('blocked browser storage keeps navigation and session favorites usable',async({page,isMobile})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>Object.defineProperty(window,'localStorage',{configurable:true,get(){throw new DOMException('Storage blocked','SecurityError')}}));
  await start(page,isMobile);
  await search(page,'Signal break');
  await room(page).getByRole('button',{name:'Favorite Signal break',exact:true}).click();
  await room(page).getByRole('button',{name:/^Favorites ·/}).click();
  await expect(room(page).locator('.effect-card')).toHaveCount(1);
  expect(errors).toEqual([]);
});
