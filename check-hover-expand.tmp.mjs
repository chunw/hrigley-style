import { chromium } from "playwright-core";

const BASE = "http://127.0.0.1:5173";
const OUT = "/private/tmp/claude-501/-Users-chunwangpersonallaptop-Documents-hrigley-style/0dedf08b-efb3-46fe-abb2-35e86749b740/scratchpad";

const pages = [
  { path: "/", label: "shop", cardSel: null }, // homepage may not have product grid; use /shop or similar if needed
  { path: "/watercolor-catalog", label: "watercolor" },
  { path: "/remains-catalog", label: "remains" },
  { path: "/21spirit-catalog", label: "spirit21" },
  { path: "/photography-catalog", label: "photography" },
];

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const context = await browser.newContext({ viewport: { width: 1400, height: 1000 } });
const page = await context.newPage();
const consoleErrors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(`[${page.url()}] ${msg.text()}`);
});
page.on("pageerror", (err) => consoleErrors.push(`[pageerror ${page.url()}] ${err.message}`));

for (const { path, label } of pages) {
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  // find first <img> inside a grid card (heuristic: img with loading=lazy or inside article/Link)
  const img = page.locator("img").first();
  const count = await page.locator("img").count();
  console.log(`${label}: found ${count} imgs on page`);

  if (count > 0) {
    const box = await img.boundingBox();
    if (box) {
      // screenshot before hover
      await page.screenshot({ path: `${OUT}/${label}-before.png` });

      // hover
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(500); // allow transition
      await page.screenshot({ path: `${OUT}/${label}-hover.png` });

      const transform = await img.evaluate((el) => getComputedStyle(el).transform);
      console.log(`${label}: hover transform = ${transform}`);

      // move away
      await page.mouse.move(5, 5);
      await page.waitForTimeout(500);
      await page.screenshot({ path: `${OUT}/${label}-after.png` });
    } else {
      console.log(`${label}: first img has no bounding box (hidden?)`);
    }
  }
}

console.log("Console errors:", JSON.stringify(consoleErrors, null, 2));

await browser.close();
