import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', err => errors.push('pageerror: ' + err.message));
await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
await page.waitForSelector('#shop', { timeout: 15000 });
await page.waitForTimeout(1500);

const buttons = await page.$$eval('#shop button', (btns) =>
  btns.map(b => b.textContent.trim()).filter(t => /Show/i.test(t))
);
console.log('buttons:', buttons);
console.log('errors:', errors);
await browser.close();
