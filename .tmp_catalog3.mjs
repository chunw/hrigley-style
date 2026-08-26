import { chromium } from 'playwright-core';

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
const page = await context.newPage();
await page.goto('http://127.0.0.1:5173/slightlyusefulobject?lang=en', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);

const printToggle = page.getByRole('button', { name: /print shop catalog/i });
await printToggle.click();
await page.waitForTimeout(300);
const lightOption = page.getByRole('button', { name: /^light$/i });

const [newPage] = await Promise.all([
  context.waitForEvent('page', { timeout: 8000 }),
  lightOption.click(),
]);
await newPage.waitForLoadState('load');
await newPage.waitForTimeout(500);

const spreadCount = await newPage.locator('.spread').count();
console.log('spread count:', spreadCount);

// Identify which spreads have an empty right page (vc-page with no children)
const info = await newPage.evaluate(() => {
  const spreads = Array.from(document.querySelectorAll('.spread'));
  return spreads.map((s, i) => {
    const pages = Array.from(s.querySelectorAll('.vc-page'));
    return pages.map((p) => ({ childCount: p.children.length, classes: p.className, text: p.textContent.trim().slice(0, 40) }));
  });
});
info.forEach((s, i) => console.log(i, JSON.stringify(s)));

await browser.close();
