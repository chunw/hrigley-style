import { chromium } from 'playwright-core';
import { execSync } from 'child_process';

const execPath = execSync(`find ~/Library/Caches/ms-playwright/chromium-1234 -name "*.app" -maxdepth 3`).toString().trim();
const binary = execPath + '/Contents/MacOS/Google Chrome for Testing';

const browser = await chromium.launch({ executablePath: binary, args: ['--no-sandbox'] });
const dir = '/private/tmp/claude-501/-Users-chunwangpersonallaptop-Documents-hrigley-style/8187d9cb-bca4-4e22-b370-a537a2354e84/scratchpad';
const context = await browser.newContext();
const page = await context.newPage();
const cdp = await context.newCDPSession(page);
await cdp.send('Network.enable');

page.on('response', r => {
  if (/\/(photography|watercolors|remains|21spirit)\//.test(r.url())) {
    console.log('IMG_REQ', r.request().resourceType(), r.status(), r.url());
  }
});
const errors = [];
page.on('pageerror', e => errors.push(e.message));

await page.goto('http://localhost:8081', { waitUntil: 'load', timeout: 60000 });
await page.waitForTimeout(1500);

await cdp.send('Network.emulateNetworkConditions', {
  offline: false,
  latency: 80,
  downloadThroughput: (2 * 1024 * 1024) / 8,
  uploadThroughput: (2 * 1024 * 1024) / 8,
});

const btn = page.getByRole('button', { name: /Show All Items/i });
await btn.waitFor({ state: 'visible', timeout: 15000 });

console.log('--- BEFORE CLICK ---');
await page.screenshot({ path: `${dir}/before.png` });

// Instrument: count img mount/unmount churn in the grid, and log timestamps.
page.on('console', msg => {
  const t = msg.text();
  if (t.startsWith('MUT ')) console.log(t);
});
await page.evaluate(() => {
  const grid = document.querySelector('#shop');
  let addCount = 0, removeCount = 0;
  const t0 = performance.now();
  const obs = new MutationObserver((mutations) => {
    for (const m of mutations) {
      addCount += m.addedNodes.length;
      removeCount += m.removedNodes.length;
    }
    console.log(`MUT t=${(performance.now()-t0).toFixed(0)}ms added=${addCount} removed=${removeCount}`);
  });
  obs.observe(grid, { childList: true, subtree: true });
  window.__stopObs = () => obs.disconnect();
});

console.log('--- CLICKING Show All Items (throttled network) ---');
await btn.click();
for (let i = 0; i < 20; i++) {
  await page.waitForTimeout(100);
  await page.screenshot({ path: `${dir}/throttle_${String(i).padStart(2,'0')}.png` });
}

await page.waitForTimeout(500);
console.log('ERRORS', JSON.stringify(errors));

await context.close();
await browser.close();
