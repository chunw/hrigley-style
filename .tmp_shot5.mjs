import { chromium } from 'playwright-core';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 350 } });
await page.goto('http://127.0.0.1:5173/slightlyusefulobject?lang=en', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
await page.screenshot({ path: '/private/tmp/claude-501/-Users-chunwangpersonallaptop-Documents-hrigley-style/118a285a-482d-49d4-8fa5-715e62c513bb/scratchpad/header-biggest.png', fullPage: false });
await browser.close();
