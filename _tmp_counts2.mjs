import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
await page.waitForSelector('#shop', { timeout: 15000 });
await page.waitForTimeout(1200);

async function countCards() {
  return await page.$$eval('#shop .grid > div.h-full', els => els.length);
}

const defaultCount = await countCards();
console.log('default (visible only) card count:', defaultCount);

// click "Show All Items"
const allBtn = await page.$('#shop button:has-text("Show All Items")');
await allBtn.click();
await page.waitForTimeout(800);
const allCount = await countCards();
const allLabel = await allBtn.textContent();
console.log('after Show All Items click ->', allLabel.trim(), 'actual cards:', allCount);

// click it again to turn off, then click "Show Hidden Items Only"
await allBtn.click();
await page.waitForTimeout(500);
const hiddenBtn = await page.$('#shop button:has-text("Show Hidden Items Only")');
await hiddenBtn.click();
await page.waitForTimeout(800);
const hiddenCount = await countCards();
const hiddenLabel = await hiddenBtn.textContent();
console.log('after Show Hidden Items Only click ->', hiddenLabel.trim(), 'actual cards:', hiddenCount);

await browser.close();
