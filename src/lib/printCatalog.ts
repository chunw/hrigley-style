import { artistBioHTML } from "./artistBio";
import { watercolors, seriesList, catalogMeta as watercolorMeta, type Watercolor } from "./watercolors";
import { remainsWorks, catalogMeta as remainsMeta, type RemainsWork } from "./remains";
import { spiritWorks, catalogMeta as spiritMeta, type SpiritWork } from "./21spirit";
import { photographyWorks, catalogMeta as photographyMeta, type PhotographyWork } from "./photography";
import { products, productImages } from "./products";

function getCSS(isDark: boolean): string {
  const bg = isDark ? "#0a0a0a" : "#fff";
  const fg = isDark ? "#e0e0e0" : "#111";
  const divider = isDark ? "#2a2a2a" : "#d4d4d4";
  const muted = isDark ? "#555" : "#aaa";
  const meta = isDark ? "#666" : "#999";
  const desc = isDark ? "#777" : "#666";
  const csLabel = isDark ? "#444" : "#bbb";
  const csName = isDark ? "#999" : "#555";
  const csSub = isDark ? "#555" : "#999";
  const countColor = isDark ? "#3a3a3a" : "#ccc";
  const countBorder = isDark ? "#1e1e1e" : "#ececec";
  const coverTitle = isDark ? "#e8e8e8" : "#111";
  const coverSubtitle = isDark ? "#555" : "#777";
  const coverYear = isDark ? "#3a3a3a" : "#bbb";

  return `
  @page { size: landscape; margin: 0; }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: ${bg};
    color: ${fg};
    font-family: 'Courier New', Courier, monospace;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .spread {
    width: 100vw;
    height: 100vh;
    display: flex;
    page-break-after: always;
    break-after: page;
  }
  .spread:last-child { page-break-after: avoid; break-after: avoid; }

  .page {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 52px 44px 44px;
    position: relative;
    background: ${bg};
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page-left { border-right: 1px solid ${divider}; }

  .page-num {
    font-size: 9px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: ${muted};
    margin-bottom: 18px;
  }
  .img-area {
    flex-shrink: 0;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    overflow: hidden;
  }
  .img-area img {
    max-width: 100%;
    max-height: 65vh;
    object-fit: contain;
    display: block;
  }
  .meta {
    margin-top: 18px;
  }
  .meta-title {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 10px;
    letter-spacing: 0.08em;
    margin-bottom: 6px;
    line-height: 1.2;
    font-style: italic;
    color: ${meta};
  }
  .meta-year {
    font-size: 10px;
    color: ${meta};
    letter-spacing: 0.12em;
    margin-top: 2px;
  }
  .meta-sub {
    font-size: 10px;
    letter-spacing: 0.08em;
    color: ${meta};
    margin-top: 4px;
  }
  .meta-dimensions {
    font-size: 10px;
    color: ${meta};
    margin-top: 4px;
    letter-spacing: 0.08em;
  }
  .meta-description {
    font-size: 9px;
    color: ${desc};
    margin-top: 6px;
    line-height: 1.4;
  }

  .cover-left { justify-content: flex-end; }
  .cover-right { justify-content: center; }

  .cover-series-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .cover-series-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 10px;
  }
  .cs-label {
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${csLabel};
  }
  .cs-name { color: ${csName}; }
  .cs-sub {
    color: ${csSub};
    font-size: 9px;
    line-height: 1.2;
  }
  .cover-count {
    font-size: 9px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${countColor};
    margin-top: 8px;
    padding-top: 16px;
    border-top: 1px solid ${countBorder};
  }

  .cover-body { display: flex; flex-direction: column; gap: 0; }
  .cover-title {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 60px;
    line-height: 1;
    letter-spacing: -0.01em;
    color: ${coverTitle};
    margin-bottom: 16px;
  }
  .cover-subtitle {
    font-size: 48px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: ${coverSubtitle};
  }
  .cover-medium {
    font-size: 11px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${coverSubtitle};
    margin-top: 10px;
  }
  .cover-description {
    font-size: 9px;
    color: ${desc};
    margin-top: 16px;
    line-height: 1.5;
    max-width: 280px;
  }
  .cover-year {
    font-size: 9px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${coverYear};
    margin-top: 28px;
  }

  .bio-page {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 52px 44px 44px;
  }
  .bio-name {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 22px;
    letter-spacing: 0.04em;
    color: ${coverTitle};
    margin-bottom: 20px;
  }
  .bio-label {
    font-size: 9px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: ${muted};
    margin-bottom: 14px;
  }
  .bio-text {
    font-size: 9px;
    color: ${desc};
    line-height: 1.7;
    max-width: 340px;
  }
  .bio-text em {
    font-style: italic;
  }
`;}

export type PrintTheme = "light" | "dark";

function spread(left: string, right: string) {
  return `<div class="spread">${left}${right}</div>`;
}

function emptyPage(side: "left" | "right") {
  return `<div class="page page-${side}"></div>`;
}

function sectionCoverSpread(
  titleEn: string,
  titleZh: string,
  mediumEn: string,
  mediumZh: string,
  itemsEn: Array<{ label?: string; name: string; sub?: string; desc?: string }>,
  itemsZh: Array<{ label?: string; name: string; sub?: string; desc?: string }>,
  count: number,
  isZh: boolean,
  descriptionEn?: string,
  descriptionZh?: string,
): string {
  const items = isZh ? itemsZh : itemsEn;
  const medium = isZh ? mediumZh : mediumEn;
  const description = isZh ? (descriptionZh ?? descriptionEn) : descriptionEn;
  const left = `
    <div class="page page-left cover-left">
      <div class="cover-series-list">
        ${items.map((item) => `
          <div class="cover-series-item">
            ${item.label ? `<span class="cs-label">${item.label}</span>` : ""}
            <span class="cs-name">${item.name}</span>
            ${item.sub ? `<span class="cs-sub">${item.sub}</span>` : ""}
            ${item.desc ? `<span class="cs-sub">${item.desc}</span>` : ""}
          </div>
        `).join("")}
        <div class="cover-count">${isZh ? `${count} 件作品` : `${count} works`}</div>
      </div>
    </div>`;
  const right = `
    <div class="page page-right cover-right">
      <div class="cover-body">
        <div class="cover-title">Chun Wang</div>
        <div class="cover-subtitle">${isZh ? titleZh : titleEn}</div>
        ${medium ? `<div class="cover-medium">${medium}</div>` : ""}
        ${description ? `<div class="cover-description">${description}</div>` : ""}
        <div class="cover-year">${isZh ? `纽约 · ${new Date().getFullYear()}` : `New York · ${new Date().getFullYear()}`}</div>
      </div>
    </div>`;
  return spread(left, right);
}

function watercolorPage(
  work: Watercolor,
  side: "left" | "right",
  origin: string,
  isZh: boolean,
): string {
  const padded = work.id.padStart(2, "0");
  const title = isZh ? (work.titleZh ?? work.title) : work.title;
  const medium = isZh
    ? (work.mediumZh || watercolorMeta.mediumZh || watercolorMeta.medium)
    : (work.medium || watercolorMeta.medium);
  const dimensions = isZh ? (work.dimensionsZh ?? work.dimensions) : work.dimensions;
  const description = isZh ? (work.descriptionZh ?? work.description) : work.description;
  return `
    <div class="page page-${side}">
      <div class="page-num">P${padded}</div>
      <div class="img-area">
        <img src="${origin}/watercolors/${padded}/${work.printInCatalogImage ?? "main"}.jpg" alt="${work.title}" onerror="this.style.visibility='hidden'" />
      </div>
      <div class="meta">
        <div class="meta-title">${title}</div>
        <div class="meta-year">${work.year}</div>
        ${medium ? `<div class="meta-sub">${medium}</div>` : ""}
        ${dimensions ? `<div class="meta-dimensions">${dimensions}</div>` : ""}
        ${description ? `<div class="meta-description">${description}</div>` : ""}
      </div>
    </div>`;
}

function remainsPage(
  work: RemainsWork,
  side: "left" | "right",
  origin: string,
  isZh: boolean,
): string {
  const padded = work.id.padStart(2, "0");
  const title = isZh ? (work.titleZh ?? work.title) : work.title;
  const medium = isZh
    ? (work.mediumZh || remainsMeta.mediumZh || remainsMeta.medium)
    : (work.medium || remainsMeta.medium);
  const dimensions = isZh ? (work.dimensionsZh ?? work.dimensions) : work.dimensions;
  const description = isZh ? (work.descriptionZh ?? work.description) : work.description;
  return `
    <div class="page page-${side}">
      <div class="page-num">R${padded}</div>
      <div class="img-area">
        <img src="${origin}/remains/${padded}/${work.printInCatalogImage ?? "main"}.jpg" alt="${work.title}" onerror="this.style.visibility='hidden'" />
      </div>
      <div class="meta">
        <div class="meta-title">${title}</div>
        <div class="meta-year">${work.year}</div>
        ${medium ? `<div class="meta-sub">${medium}</div>` : ""}
        ${dimensions ? `<div class="meta-dimensions">${dimensions}</div>` : ""}
        ${description ? `<div class="meta-description">${description}</div>` : ""}
      </div>
    </div>`;
}

function spiritPage(
  work: SpiritWork,
  side: "left" | "right",
  origin: string,
  isZh: boolean,
): string {
  const padded = work.id.padStart(2, "0");
  const title = isZh ? (work.titleZh ?? work.title) : work.title;
  const medium = isZh
    ? (work.mediumZh || spiritMeta.mediumZh || spiritMeta.medium)
    : (work.medium || spiritMeta.medium);
  const dimensions = isZh ? (work.dimensionsZh ?? work.dimensions) : work.dimensions;
  const description = isZh ? (work.descriptionZh ?? work.description) : work.description;
  return `
    <div class="page page-${side}">
      <div class="page-num">S${padded}</div>
      <div class="img-area">
        <img src="${origin}/21spirit/${padded}/${work.printInCatalogImage ?? "main"}.jpg" alt="${work.title}" onerror="this.style.visibility='hidden'" />
      </div>
      <div class="meta">
        <div class="meta-title">${title}</div>
        <div class="meta-year">${work.year}</div>
        ${medium ? `<div class="meta-sub">${medium}</div>` : ""}
        ${dimensions ? `<div class="meta-dimensions">${dimensions}</div>` : ""}
        ${description ? `<div class="meta-description">${description}</div>` : ""}
      </div>
    </div>`;
}

function photographyPage(
  work: PhotographyWork,
  side: "left" | "right",
  origin: string,
  isZh: boolean,
): string {
  const padded = work.id.padStart(2, "0");
  const title = isZh ? (work.titleZh ?? work.title) : work.title;
  const medium = isZh
    ? (work.mediumZh || photographyMeta.mediumZh || photographyMeta.medium)
    : (work.medium || photographyMeta.medium);
  const dimensions = isZh ? (work.dimensionsZh ?? work.dimensions) : work.dimensions;
  const description = isZh ? (work.descriptionZh ?? work.description) : work.description;
  return `
    <div class="page page-${side}">
      <div class="page-num">PH${padded}</div>
      <div class="img-area">
        <img src="${origin}/photography/${padded}/${work.printInCatalogImage ?? "main"}.jpg" alt="${work.title}" onerror="this.style.visibility='hidden'" />
      </div>
      <div class="meta">
        <div class="meta-title">${title}</div>
        <div class="meta-year">${work.year}</div>
        ${medium ? `<div class="meta-sub">${medium}</div>` : ""}
        ${dimensions ? `<div class="meta-dimensions">${dimensions}</div>` : ""}
        ${description ? `<div class="meta-description">${description}</div>` : ""}
      </div>
    </div>`;
}

function productPage(
  p: (typeof products)[number],
  side: "left" | "right",
  isZh: boolean,
): string {
  const imgs = productImages.filter((img) => img.product_id === p.id);
  const imgSrc = imgs.length > 0 ? imgs[0].image_url : p.image_url;
  const title = isZh ? (p.title_zh ?? p.title) : p.title;
  const description = isZh ? (p.description_zh ?? p.description) : p.description;
  const longDescription = isZh
    ? (p.detailed_description_html_zh ?? p.detailed_description_html)
    : p.detailed_description_html;
  return `
    <div class="page page-${side}">
      <div class="page-num">${isZh ? "商店" : "SHOP"}</div>
      <div class="img-area">
        <img src="${imgSrc}" alt="${p.title}" onerror="this.style.visibility='hidden'" />
      </div>
      <div class="meta">
        <div class="meta-title">${title}</div>
        ${p.dimensions ? `<div class="meta-sub">${p.dimensions}</div>` : ""}
        ${description ? `<div class="meta-description">${description}</div>` : ""}
        ${longDescription ? `<div class="meta-description">${longDescription}</div>` : ""}
      </div>
    </div>`;
}

function normalizePrintAsset(origin: string, asset: string | undefined | null): string {
  if (!asset) return "";
  if (/^https?:\/\//.test(asset) || asset.startsWith("data:")) return asset;
  return `${origin}${asset.startsWith("/") ? "" : "/"}${asset}`;
}

function vendorProductEntry(product: {
  id: string;
  title: string;
  title_zh?: string | null;
  description?: string | null;
  description_zh?: string | null;
  detailed_description_html?: string | null;
  detailed_description_html_zh?: string | null;
  dimensions?: string | null;
  dimensions_zh?: string | null;
  price?: number | null;
  currency?: string | null;
  category?: string | null;
  category_zh?: string | null;
  image_url?: string | null;
}, isZh: boolean, origin: string): string {
  const title = isZh ? (product.title_zh ?? product.title) : product.title;
  const description = isZh ? (product.description_zh ?? product.description) : product.description;
  const longDescription = isZh
    ? (product.detailed_description_html_zh ?? product.detailed_description_html)
    : product.detailed_description_html;
  const dimensions = isZh ? (product.dimensions_zh ?? product.dimensions) : product.dimensions;
  const category = isZh ? (product.category_zh ?? product.category ?? "Product") : (product.category ?? "Product");
  const image = normalizePrintAsset(origin, product.image_url);
  const priceText = product.price != null ? `${product.currency ?? "USD"} $${product.price}` : "Price available on request";

  return `
    <article class="vendor-item">
      <div class="vendor-image-wrap">
        <img src="${image}" alt="${title}" onerror="this.style.display='none'" />
      </div>
      <div class="vendor-copy">
        <div class="vendor-topline">${category}</div>
        <h3>${title}</h3>
        <div class="vendor-price">${priceText}</div>
        ${dimensions ? `<div class="vendor-dimensions">${dimensions}</div>` : ""}
        ${description ? `<p>${description}</p>` : ""}
        ${longDescription && longDescription !== description ? `<div class="vendor-long-description">${longDescription}</div>` : ""}
      </div>
    </article>
  `;
}

export function buildVendorCatalogHTML(origin: string, lang: "en" | "zh", theme: PrintTheme = "light"): string {
  const isDark = theme === "dark";
  const isZh = lang === "zh";
  const bg = isDark ? "#0b0b0b" : "#ffffff";
  const fg = isDark ? "#ece6dc" : "#111111";
  const muted = isDark ? "#aaa08a" : "#666666";
  const panel = isDark ? "#121212" : "#f6f3ee";
  const border = isDark ? "#2d2d2d" : "#ded7ce";
  const accent = isDark ? "#d8c8a8" : "#8c6d4d";

  const vendorProducts = [
    ...products.filter((product) => product.showInStorefront !== false).map((product) => ({
      id: product.id,
      title: product.title,
      title_zh: product.title_zh,
      description: product.description,
      description_zh: product.description_zh,
      detailed_description_html: product.detailed_description_html,
      detailed_description_html_zh: product.detailed_description_html_zh,
      dimensions: product.dimensions,
      dimensions_zh: product.dimensions_zh,
      price: product.price,
      currency: product.currency,
      category: product.category,
      category_zh: product.category_zh,
      image_url: product.image_url,
    })),
    ...photographyWorks.filter((work) => work.showInStorefront !== false).map((work) => ({
      id: `photography-${work.id}`,
      title: work.title,
      title_zh: work.titleZh,
      description: work.description || photographyMeta.description,
      description_zh: work.descriptionZh || photographyMeta.descriptionZh,
      dimensions: work.dimensions || work.printInfo,
      dimensions_zh: work.dimensionsZh || work.printInfoZh,
      price: work.printPrice ?? 10,
      currency: "USD",
      category: "Fine Art Prints",
      category_zh: "版画",
      image_url: normalizePrintAsset(origin, `/photography/${work.id.padStart(2, "0")}/main.jpg`),
    })),
    ...remainsWorks.filter((work) => work.showInStorefront !== false).map((work) => ({
      id: `remains-${work.id}`,
      title: work.title,
      title_zh: work.titleZh,
      description: work.description || remainsMeta.description,
      description_zh: work.descriptionZh || remainsMeta.descriptionZh,
      dimensions: work.dimensions,
      dimensions_zh: work.dimensionsZh,
      price: work.price ?? 4,
      currency: "USD",
      category: "Fine Art Prints",
      category_zh: "版画",
      image_url: normalizePrintAsset(origin, `/remains/${work.id.padStart(2, "0")}/main.jpg`),
    })),
    ...spiritWorks.filter((work) => work.showInStorefront !== false).map((work) => ({
      id: `spirit-${work.id}`,
      title: work.title,
      title_zh: work.titleZh,
      description: work.description || spiritMeta.description,
      description_zh: work.descriptionZh || spiritMeta.descriptionZh,
      dimensions: work.dimensions,
      dimensions_zh: work.dimensionsZh,
      price: work.price ?? 4,
      currency: "USD",
      category: "Fine Art Prints",
      category_zh: "版画",
      image_url: normalizePrintAsset(origin, `/21spirit/${work.id.padStart(2, "0")}/main.jpg`),
    })),
    ...watercolors.filter((work) => work.showInStorefront !== false).map((work) => ({
      id: `watercolor-${work.id}`,
      title: work.title,
      title_zh: work.titleZh,
      description: work.description || watercolorMeta.description,
      description_zh: work.descriptionZh || watercolorMeta.descriptionZh,
      dimensions: work.dimensions || work.printInfo,
      dimensions_zh: work.dimensionsZh || work.printInfoZh,
      price: work.price ?? work.printPrice ?? 10,
      currency: "USD",
      category: work.series === "III" ? "Cards" : "Fine Art Prints",
      category_zh: work.series === "III" ? "卡片" : "版画",
      image_url: normalizePrintAsset(origin, `/watercolors/${work.id.padStart(2, "0")}/main.jpg`),
    })),
  ];

  const coverTitle = isZh ? "店铺产品目录" : "Shop Product Catalog";
  const footerText = isZh ? `更新于 ${new Date().getFullYear()} · 材料与价格如图为准` : `Updated ${new Date().getFullYear()} · Pricing and availability subject to change`;

  const content = vendorProducts.map((product) => vendorProductEntry(product, isZh, origin)).join("");

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${coverTitle}</title>
  <style>
    @page { size: A4 portrait; margin: 16mm; }
    * { box-sizing: border-box; }
    html, body { margin: 0; background: ${bg}; color: ${fg}; font-family: "Avenir Next", "Helvetica Neue", Arial, sans-serif; }
    body { padding: 18px; }
    .page { max-width: 100%; }
    .cover {
      border: 1px solid ${border};
      background: ${panel};
      padding: 28px 24px 20px;
      margin-bottom: 18px;
    }
    .cover-topline {
      font-size: 10px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: ${muted};
      margin-bottom: 18px;
    }
    .cover-title {
      font-family: Georgia, "Times New Roman", serif;
      font-size: 34px;
      line-height: 1.05;
      letter-spacing: -0.04em;
      margin: 0 0 10px;
      color: ${fg};
    }
    .catalog-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 14px;
    }
    .vendor-item {
      display: grid;
      grid-template-columns: 380px 1fr;
      gap: 14px;
      padding: 12px 0;
      border-top: 1px solid ${border};
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .vendor-image-wrap {
      width: 380px;
      height: 380px;
      background: ${panel};
      border: 1px solid ${border};
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .vendor-image-wrap img {
      max-width: 100%;
      max-height: 100%;
      object-fit: cover;
      display: block;
    }
    .vendor-copy h3 {
      font-size: 18px;
      line-height: 1.2;
      margin: 0 0 8px;
      font-weight: 500;
      color: ${fg};
    }
    .vendor-topline {
      font-size: 9px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: ${accent};
      margin-bottom: 6px;
    }
    .vendor-price {
      font-size: 12px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: ${muted};
      margin-bottom: 6px;
    }
    .vendor-dimensions {
      font-size: 11px;
      color: ${muted};
      margin-bottom: 8px;
    }
    .vendor-copy p {
      font-size: 11px;
      line-height: 1.6;
      margin: 0;
      color: ${muted};
      max-width: 58ch;
    }
    .vendor-long-description {
      font-size: 11px;
      line-height: 1.6;
      margin-top: 6px;
      color: ${muted};
      max-width: 58ch;
    }
    .vendor-long-description p {
      margin: 0 0 6px;
    }
    .vendor-long-description p:last-child {
      margin-bottom: 0;
    }
    .footer {
      margin-top: 14px;
      border-top: 1px solid ${border};
      padding-top: 10px;
      font-size: 9px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: ${muted};
    }
    @media print {
      body { margin: 0; }
      .page { width: 100%; }
    }
  </style>
</head>
<body>
  <div class="page">
    <header class="cover">
      <div class="cover-topline">${isZh ? "Chun Wang Studio Shop" : "Chun Wang Studio Shop"}</div>
      <h1 class="cover-title">${coverTitle}</h1>
    </header>

    <main class="catalog-grid">
      ${content}
    </main>

    <div class="footer">${footerText}</div>
  </div>
  <script>window.onload = function() { setTimeout(function() { window.print(); }, 250); };</script>
</body>
</html>`;
}

function bioSpread(): string {
  const enBio = artistBioHTML("en");
  const zhBio = artistBioHTML("zh");

  const left = `
    <div class="page page-left bio-page">
      <div class="bio-label">关于艺术家</div>
      <div class="bio-name">王淳</div>
      <div class="bio-text">${zhBio}</div>
    </div>`;

  const right = `
    <div class="page page-right bio-page">
      <div class="bio-label">About the Artist</div>
      <div class="bio-name">Chun Wang</div>
      <div class="bio-text">${enBio}</div>
    </div>`;

  return spread(left, right);
}

function pairSpreads<T>(
  items: T[],
  renderPage: (item: T, side: "left" | "right") => string,
): string {
  const spreads: string[] = [];
  for (let i = 0; i < items.length; i += 2) {
    const left = renderPage(items[i], "left");
    const right = items[i + 1] ? renderPage(items[i + 1], "right") : emptyPage("right");
    spreads.push(spread(left, right));
  }
  return spreads.join("\n");
}

export function buildCombinedPrintHTML(origin: string, lang: "en" | "zh", theme: PrintTheme = "light"): string {
  const isDark = theme === "dark";
  const isZh = lang === "zh";
  const css = getCSS(isDark);

  const printableWatercolors = watercolors.filter((w) => w.printInCatalog !== false);
  const printableRemains = remainsWorks.filter((w) => w.printInCatalog !== false);
  const printableSpirit = spiritWorks.filter((w) => w.printInCatalog !== false);
  const printablePhotography = photographyWorks.filter((w) => w.printInCatalog !== false);
  const printableProducts = products.filter((p) => p.printInCatalog !== false);

  const totalArt = printableWatercolors.length + printableRemains.length + printableSpirit.length + printablePhotography.length;

  // Master cover
  const masterCover = sectionCoverSpread(
    "Complete Catalog",
    "目录",
    "",
    "",
    [
      { label: watercolorMeta.en, name: `${printableWatercolors.length} works` },
      { label: remainsMeta.en, name: `${printableRemains.length} works` },
      { label: spiritMeta.en, name: `${printableSpirit.length} works` },
      { label: photographyMeta.en, name: `${printablePhotography.length} works` },
      { label: "Shop", name: `${printableProducts.length} items` },
    ],
    [
      { label: watercolorMeta.zh, name: `${printableWatercolors.length} 件` },
      { label: remainsMeta.zh, name: `${printableRemains.length} 件` },
      { label: spiritMeta.zh, name: `${printableSpirit.length} 件` },
      { label: photographyMeta.zh, name: `${printablePhotography.length} 件` },
      { label: "商店", name: `${printableProducts.length} 件` },
    ],
    totalArt,
    isZh,
  );

  // Watercolors section
  const watercolorCover = sectionCoverSpread(
    watercolorMeta.en,
    watercolorMeta.zh,
    watercolorMeta.medium,
    watercolorMeta.mediumZh,
    seriesList.map((s) => ({
      name: s.englishName,
      sub: s.subtitle,
      desc: s.description,
    })),
    seriesList.map((s) => ({
      name: s.chineseName,
      sub: s.subtitleZh ?? s.subtitle,
      desc: s.descriptionZh ?? s.description,
    })),
    printableWatercolors.length,
    isZh,
    watercolorMeta.description,
    watercolorMeta.descriptionZh,
  );
  const watercolorSpreads = pairSpreads(
    printableWatercolors,
    (w, side) => watercolorPage(w, side, origin, isZh),
  );

  // Remains section
  const remainsCover = sectionCoverSpread(
    remainsMeta.en,
    remainsMeta.zh,
    remainsMeta.medium,
    remainsMeta.mediumZh,
    [{ name: remainsMeta.en, sub: `Works 1–${printableRemains.length}` }],
    [{ name: remainsMeta.zh, sub: `第1–${printableRemains.length}件` }],
    printableRemains.length,
    isZh,
    remainsMeta.description,
    remainsMeta.descriptionZh,
  );
  const remainsSpreads = pairSpreads(
    printableRemains,
    (w, side) => remainsPage(w, side, origin, isZh),
  );

  // 21 Spirit section
  const spiritCover = sectionCoverSpread(
    spiritMeta.en,
    spiritMeta.zh,
    spiritMeta.medium,
    spiritMeta.mediumZh,
    [{ name: spiritMeta.en, sub: `Works 1–${printableSpirit.length}` }],
    [{ name: spiritMeta.zh, sub: `第1–${printableSpirit.length}件` }],
    printableSpirit.length,
    isZh,
    spiritMeta.description,
    spiritMeta.descriptionZh,
  );
  const spiritSpreads = pairSpreads(
    printableSpirit,
    (w, side) => spiritPage(w, side, origin, isZh),
  );

  // Photography section
  const photographyCover = sectionCoverSpread(
    photographyMeta.en,
    photographyMeta.zh,
    photographyMeta.medium,
    photographyMeta.mediumZh,
    [{ label: "Photography Works", name: photographyMeta.en, sub: `Works 1–${printablePhotography.length}` }],
    [{ label: "摄影作品", name: photographyMeta.zh, sub: `第1–${printablePhotography.length}件` }],
    printablePhotography.length,
    isZh,
    photographyMeta.description,
    photographyMeta.descriptionZh,
  );
  const photographySpreads = pairSpreads(
    printablePhotography,
    (w, side) => photographyPage(w, side, origin, isZh),
  );

  // Shop section
  const shopCover = `
    <div class="spread">
      <div class="page page-left cover-left">
        <div class="cover-series-list">
          ${printableProducts.map((p) => `
            <div class="cover-series-item">
              <span class="cs-name">${isZh ? (p.title_zh ?? p.title) : p.title}</span>
            </div>
          `).join("")}
          <div class="cover-count">${isZh ? `${printableProducts.length} 件商品` : `${printableProducts.length} item${printableProducts.length !== 1 ? "s" : ""}`}</div>
        </div>
      </div>
      <div class="page page-right cover-right">
        <div class="cover-body">
          <div class="cover-title">Chun Wang</div>
          <div class="cover-subtitle">${isZh ? "商店" : "Shop"}</div>
          <div class="cover-year">${isZh ? `chunwangshop.com · ${new Date().getFullYear()}` : `chunwangshop.com · ${new Date().getFullYear()}`}</div>
        </div>
      </div>
    </div>`;
  const shopSpreads = pairSpreads(
    printableProducts,
    (p, side) => productPage(p, side, isZh),
  );

  const now = new Date();
  const dateStamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <title>Chun Wang Complete Catalog ${dateStamp} ${lang.toUpperCase()}</title>
  <style>${css}</style>
</head>
<body>
  ${masterCover}
  ${bioSpread()}
  ${spiritCover}
  ${spiritSpreads}
  ${remainsCover}
  ${remainsSpreads}
  ${watercolorCover}
  ${watercolorSpreads}
  ${photographyCover}
  ${photographySpreads}
  ${shopCover}
  ${shopSpreads}
  <script>window.onload = function() { setTimeout(function() { window.print(); }, 300); };<\/script>
</body>
</html>`;
}
