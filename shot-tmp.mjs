import { chromium } from 'playwright-core';
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await mobile.goto('http://127.0.0.1:5173/slightlyusefulobject', { waitUntil: 'networkidle', timeout: 20000 });
await mobile.waitForTimeout(1000);
const heroM = await mobile.$('.cargo-hero');
await heroM.screenshot({ path: 'hero-mobile-inside.png' });

const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await desktop.goto('http://127.0.0.1:5173/slightlyusefulobject', { waitUntil: 'networkidle', timeout: 20000 });
await desktop.waitForTimeout(1000);
const heroD = await desktop.$('.cargo-hero');
await heroD.screenshot({ path: 'hero-desktop-inside.png' });

await browser.close();
