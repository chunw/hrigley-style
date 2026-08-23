import { chromium } from "playwright-core";

const outDir = "/private/tmp/claude-501/-Users-chunwangpersonallaptop-Documents-hrigley-style/1cf8cb2c-8939-4d51-a4a8-e30057f17345/scratchpad";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 300 } });

const errors = [];
page.on("pageerror", (err) => errors.push(String(err)));

await page.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
await page.waitForSelector("header");
await page.screenshot({ path: `${outDir}/06-header-about-icon.png`, clip: { x: 900, y: 0, width: 380, height: 112 } });

await page.getByRole("link", { name: /about/i }).first().click();
await page.waitForURL("**/about");
console.log("navigated to:", page.url());

console.log("ERRORS:", errors.length ? errors : "none");
await browser.close();
