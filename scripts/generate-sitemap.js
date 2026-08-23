#!/usr/bin/env node
// Generates public/sitemap.xml from the same product/catalog data the app renders,
// so it stays in sync automatically instead of being hand-maintained.
//
// Run with: node scripts/generate-sitemap.js
// (runs automatically before `npm run build` via the "prebuild" script)

import { createServer } from "vite";
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SITE_URL = "https://www.chunwangshop.com";

const STATIC_ROUTES = [
  "/",
  "/about",
  "/catalogs",
  "/all-items",
  "/watercolor-catalog",
  "/remains-catalog",
  "/21spirit-catalog",
  "/photography-catalog",
  "/photography-photobook",
];

async function main() {
  const server = await createServer({
    root: ROOT,
    configFile: resolve(ROOT, "vite.config.ts"),
    server: { middlewareMode: true },
    appType: "custom",
  });

  const { watercolors } = await server.ssrLoadModule("/src/lib/watercolors.ts");
  const { remainsWorks } = await server.ssrLoadModule("/src/lib/remains.ts");
  const { spiritWorks } = await server.ssrLoadModule("/src/lib/21spirit.ts");
  const { photographyWorks } = await server.ssrLoadModule("/src/lib/photography.ts");
  const { products } = await server.ssrLoadModule("/src/lib/products.ts");

  await server.close();

  // Only public, storefront-listed items belong in the sitemap — items marked
  // showInStorefront: false are intentionally unlisted (see HiddenItems page).
  const urls = [
    ...STATIC_ROUTES,
    ...watercolors.filter((w) => w.showInStorefront === true).map((w) => `/watercolors/${w.id}`),
    ...remainsWorks.filter((w) => w.showInStorefront === true).map((w) => `/remains/${w.id}`),
    ...spiritWorks.filter((w) => w.showInStorefront === true).map((w) => `/21spirit/${w.id}`),
    ...photographyWorks.filter((w) => w.showInStorefront === true).map((w) => `/photography/${w.id}`),
    ...products.filter((p) => p.is_active && p.showInStorefront).map((p) => `/product/${p.id}`),
  ];

  const lastmod = new Date().toISOString().slice(0, 10);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>\n    <loc>${SITE_URL}${u}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`).join("\n")}
</urlset>
`;

  writeFileSync(resolve(ROOT, "public", "sitemap.xml"), xml);
  console.log(`Generated public/sitemap.xml with ${urls.length} URLs`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
