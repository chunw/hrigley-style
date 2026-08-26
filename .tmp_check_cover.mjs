import { createServer } from "vite";

const server = await createServer({ configFile: "./vite.config.ts", server: { middlewareMode: true } });
const mod = await server.ssrLoadModule("/src/lib/products.ts");
const { products, productImages } = mod;

let bad = [];
for (const p of products) {
  const imgs = productImages.filter(i => i.product_id === p.id);
  if (imgs.length === 0) continue;
  if (imgs[0].image_url !== p.image_url) {
    bad.push({ id: p.id, expected: p.image_url, got: imgs[0].image_url, count: imgs.length });
  }
}
console.log("Total products:", products.length);
console.log("Products with mismatched cover:", bad.length);
console.log(JSON.stringify(bad, null, 2));

const packet = productImages.filter(i => i.product_id === "notes-from-the-road-postcard-packet");
console.log("postcard packet images:", packet.map(p => p.image_url));

await server.close();
