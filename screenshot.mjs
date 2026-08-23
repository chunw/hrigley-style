import { chromium } from 'playwright-core';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1200 } });
page.on('console', msg => console.log('CONSOLE:', msg.text()));
page.on('pageerror', err => console.log('PAGEERROR:', err.message));

await page.goto('http://127.0.0.1:5174/product/spiked-cupcake-choker', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
await page.screenshot({ path: '/tmp/product-detail.png', fullPage: true });

const imgs = await page.evaluate(() => Array.from(document.querySelectorAll('img')).map(i => i.src));
console.log('IMAGES:', JSON.stringify(imgs, null, 2));

await browser.close();
console.log('done');
