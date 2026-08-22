import { chromium } from "playwright-core";

const base = "http://127.0.0.1:5176";
const out = "/private/tmp/claude-501/-Users-chunwangpersonallaptop-Documents-hrigley-style/eafd5a49-9335-448c-94a6-a0431dc08c73/scratchpad";

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage();
const errors = [];
page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
page.on("pageerror", (err) => errors.push(String(err)));

// Step 0: clean localStorage
await page.goto(base + "/");
await page.evaluate(() => localStorage.clear());

// Step 1: load root, expect ?lang=en to appear
await page.goto(base + "/");
await page.waitForTimeout(500);
console.log("STEP1 url:", page.url());
await page.screenshot({ path: out + "/step1-root-en.png" });

// Step 2: toggle language
await page.click('button[aria-label="Toggle language"]');
await page.waitForTimeout(500);
console.log("STEP2 url after toggle:", page.url());
await page.screenshot({ path: out + "/step2-toggled-zh.png" });

// Step 3: deep link directly to /about?lang=zh
await page.goto(base + "/about?lang=zh");
await page.waitForTimeout(500);
console.log("STEP3 url:", page.url());
await page.screenshot({ path: out + "/step3-about-zh-deeplink.png" });
const bodyTextZh = await page.evaluate(() => document.body.innerText.slice(0, 300));
console.log("STEP3 body sample:", bodyTextZh);

// Step 4: deep link to root with ?lang=en
await page.goto(base + "/?lang=en");
await page.waitForTimeout(500);
console.log("STEP4 url:", page.url());
await page.screenshot({ path: out + "/step4-root-en-deeplink.png" });

console.log("CONSOLE ERRORS:", errors);

await browser.close();
