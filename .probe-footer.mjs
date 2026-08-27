import { chromium } from "/Users/chunwangpersonallaptop/.npm/_npx/b4d0e755c13a17e0/node_modules/playwright-core/index.mjs";

const outDir = "/private/tmp/claude-501/-Users-chunwangpersonallaptop-Documents-hrigley-style/b0377696-c03e-4e9a-8e85-b52a4c73ba79/scratchpad";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

const errors = [];
page.on("pageerror", (err) => errors.push(String(err)));

await page.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
await page.waitForSelector("footer");
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(300);
await page.screenshot({ path: `${outDir}/footer.png`, clip: { x: 0, y: 0, width: 1400, height: 900 } });

const footerText = await page.locator("footer").innerText();
console.log("FOOTER TEXT:\n", footerText);

const mailLink = await page.locator('footer a[href^="mailto:"]').getAttribute("href");
const igLink = await page.locator('footer a[href*="instagram.com"]').last().getAttribute("href");
console.log("mailto href:", mailLink);
console.log("instagram href:", igLink);

console.log("ERRORS:", errors.length ? errors : "none");
await browser.close();
