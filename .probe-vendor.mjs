import { chromium } from 'playwright-core';
import { execSync } from 'child_process';

const execPath = execSync(`find ~/Library/Caches/ms-playwright/chromium-1234 -name "*.app" -maxdepth 3`).toString().trim();
const binary = execPath + '/Contents/MacOS/Google Chrome for Testing';
const dir = '/private/tmp/claude-501/-Users-chunwangpersonallaptop-Documents-hrigley-style/da0aa3e8-369b-4c2c-9109-67f75880a011/scratchpad';

const browser = await chromium.launch({ executablePath: binary, args: ['--no-sandbox'] });
const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
const page = await context.newPage();

const errors = [];
page.on('pageerror', e => errors.push(e.message));

await page.goto('http://127.0.0.1:5173/catalogs', { waitUntil: 'load', timeout: 60000 });
await page.waitForTimeout(1000);

const printBtn = page.getByRole('button', { name: /Print Complete Catalog/i });
await printBtn.waitFor({ state: 'visible', timeout: 15000 });
await printBtn.click();
await page.waitForTimeout(300);

const vendorBtn = page.locator('button', { hasText: /vendor/i }).first();
await vendorBtn.waitFor({ state: 'visible', timeout: 15000 });

const [popup] = await Promise.all([
  context.waitForEvent('page'),
  vendorBtn.click(),
]);

await popup.waitForLoadState('load');
await popup.waitForTimeout(800);

await popup.setViewportSize({ width: 1400, height: 900 });

const spreadCount = await popup.locator('.spread').count();
console.log('SPREAD COUNT', spreadCount);

for (let i = 0; i < Math.min(spreadCount, 6); i++) {
  await popup.locator('.spread').nth(i).scrollIntoViewIfNeeded();
  await popup.screenshot({ path: `${dir}/vendor_spread_${i}.png` });
}

console.log('ERRORS', JSON.stringify(errors));

await context.close();
await browser.close();
