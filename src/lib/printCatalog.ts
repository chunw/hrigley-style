import { artistBioHTML, artistBioSegments } from "./artistBio";
import { watercolors, catalogMeta as watercolorMeta } from "./watercolors";
import { remainsWorks, catalogMeta as remainsMeta } from "./remains";
import { spiritWorks, catalogMeta as spiritMeta } from "./21spirit";
import { photographyWorks, catalogMeta as photographyMeta } from "./photography";
import { products, productImages } from "./products";
import { translations } from "./translations";

export type PrintTheme = "light" | "dark";

function spread(left: string, right: string) {
  return `<div class="spread">${left}${right}</div>`;
}

function normalizePrintAsset(origin: string, asset: string | undefined | null): string {
  if (!asset) return "";
  if (/^https?:\/\//.test(asset) || asset.startsWith("data:")) return asset;
  return `${origin}${asset.startsWith("/") ? "" : "/"}${asset}`;
}

function vcCrosshair(color: string): string {
  return `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0;">
    <circle cx="8" cy="8" r="6" stroke="${color}" stroke-width="1"/>
    <line x1="8" y1="0.5" x2="8" y2="3.5" stroke="${color}" stroke-width="1"/>
    <line x1="8" y1="12.5" x2="8" y2="15.5" stroke="${color}" stroke-width="1"/>
    <line x1="0.5" y1="8" x2="3.5" y2="8" stroke="${color}" stroke-width="1"/>
    <line x1="12.5" y1="8" x2="15.5" y2="8" stroke="${color}" stroke-width="1"/>
  </svg>`;
}

function vcEyebrow(line1: string, line2: string): string {
  return `<div class="vc-eyebrow">${line1}<br/>${line2}</div>`;
}

function vcTagTop(text: string): string {
  return `<div class="vc-tag-top">${text}</div>`;
}

function vcFooter(tagText: string, page: number, total: number, muted: string): string {
  return `
    <div class="vc-footer-tag">${tagText}</div>
    <div class="vc-footer-page">${String(page).padStart(2, "0")} / ${String(total).padStart(2, "0")} ${vcCrosshair(muted)}</div>`;
}

function vcEmptyPage(side: "left" | "right"): string {
  return `<div class="vc-page vc-page-${side}"></div>`;
}

interface VendorItem {
  title: string;
  description?: string | null;
  dimensions?: string | null;
  price?: number | null;
  currency?: string | null;
  category: string;
  image_url: string;
}

function vcCoverSpread(
  isZh: boolean,
  intro: string,
  heroImage: string,
  itemCount: number,
  page: number,
  total: number,
  muted: string,
): string {
  const left = `
    <div class="vc-page vc-page-left">
      ${vcEyebrow(isZh ? "王淳工作室" : "CHUN WANG STUDIO", isZh ? "商店目录" : "SHOP CATALOG")}
      ${vcTagTop(isZh ? `#共 ${itemCount} 件` : `#ITEMS ${itemCount}`)}
      <div class="vc-cover-body">
        <div class="vc-cover-intro">${intro}</div>
        <div class="vc-cover-title">${isZh ? "商店<br/>目录" : "SHOP<br/>CATALOG"}</div>
        <div class="vc-cover-sub">${isZh ? "精选作品与商品" : "CURATED WORKS & PRODUCTS"}</div>
      </div>
      ${vcFooter(isZh ? "商店 | 目录" : "SHOP | CATALOG", page, total, muted)}
    </div>`;
  const right = `
    <div class="vc-page vc-page-right">
      ${vcTagTop(isZh ? "#精选" : "#FEATURED")}
      <div class="vc-prod-image-wrap" style="margin-top:70px;">
        <div class="vc-prod-image-block"></div>
        <img src="${heroImage}" alt="" onerror="this.style.visibility='hidden'" />
      </div>
      ${vcFooter(isZh ? "商店 | 精选" : "SHOP | FEATURED", page + 1, total, muted)}
    </div>`;
  return spread(left, right);
}

function vcCategoryDividerSpread(
  category: string,
  items: VendorItem[],
  isZh: boolean,
  catIndex: number,
  page: number,
  total: number,
  muted: string,
): string {
  const mosaic = items.slice(0, 4);
  const mosaicStyle = (count: number, i: number): string => {
    if (count === 1) return "grid-column:1/3;grid-row:1/3;";
    if (count === 2) return "grid-row:1/3;";
    if (count === 3 && i === 0) return "grid-column:1/3;";
    return "";
  };
  const left = `
    <div class="vc-page vc-page-left">
      ${vcEyebrow(isZh ? "王淳工作室" : "CHUN WANG STUDIO", isZh ? "商店目录" : "SHOP CATALOG")}
      ${vcTagTop(`#${String(catIndex).padStart(2, "0")}`)}
      <div class="vc-mosaic">
        ${mosaic.map((it, i) => `<img src="${it.image_url}" style="${mosaicStyle(mosaic.length, i)}" alt="" onerror="this.style.visibility='hidden'" />`).join("")}
      </div>
      ${vcFooter(isZh ? "商店 | 分类" : "SHOP | CATEGORY", page, total, muted)}
    </div>`;
  const right = `
    <div class="vc-page vc-page-right">
      ${vcTagTop(isZh ? `${items.length} 件` : `${items.length} ITEMS`)}
      <div class="vc-cover-body">
        <div class="vc-div-num">${String(catIndex).padStart(2, "0")}</div>
        <div class="vc-cover-title" style="font-size:44px;">${category}</div>
        <div class="vc-cover-sub">${isZh ? "商店目录" : "SHOP CATALOG"}</div>
      </div>
      ${vcFooter(`${isZh ? "商店" : "SHOP"} | ${category}`, page + 1, total, muted)}
    </div>`;
  return spread(left, right);
}

function vcProductPage(
  item: VendorItem,
  side: "left" | "right",
  index: number,
  isZh: boolean,
  page: number,
  total: number,
  muted: string,
): string {
  const priceText = item.price != null ? `${item.currency ?? "USD"} $${item.price}` : (isZh ? "询价" : "Price on request");
  return `
    <div class="vc-page vc-page-${side}">
      ${vcEyebrow(isZh ? "王淳工作室" : "CHUN WANG STUDIO", isZh ? "商店目录" : "SHOP CATALOG")}
      ${vcTagTop(`#${String(index).padStart(2, "0")}`)}
      <div class="vc-prod-head">
        <div class="vc-prod-num">${String(index).padStart(2, "0")}/</div>
        <div class="vc-prod-title">${item.title}</div>
        <div class="vc-prod-category">${item.category}</div>
      </div>
      <div class="vc-prod-image-wrap">
        <div class="vc-prod-image-block"></div>
        <img src="${item.image_url}" alt="${item.title}" onerror="this.style.visibility='hidden'" />
      </div>
      <div class="vc-prod-price">${priceText}</div>
      ${item.dimensions ? `<div class="vc-prod-dimensions">${item.dimensions}</div>` : ""}
      ${item.description ? `<div class="vc-prod-desc">${item.description}</div>` : ""}
      ${vcFooter(`${isZh ? "商店" : "SHOP"} | ${item.category}`, page, total, muted)}
    </div>`;
}

function getVendorCSS(isDark: boolean): string {
  const bg = isDark ? "#0b0b0b" : "#ffffff";
  const fg = isDark ? "#f3efe8" : "#111111";
  const muted = isDark ? "#8f887a" : "#767066";
  const divider = isDark ? "#262626" : "#e5e1da";
  const accentBlock = isDark ? "#1c1c1c" : "#f2efe9";

  return `
  @page { size: landscape; margin: 0; }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: ${bg};
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
  .vc-page {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 46px 40px 76px;
    background: ${bg};
    color: ${fg};
    font-family: 'Aileron', 'Helvetica Neue', Arial, sans-serif;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .vc-page-left { border-right: 1px solid ${divider}; }
  .vc-page a {
    color: hsl(328, 85%, 72%);
    text-decoration: none;
  }
  .vc-eyebrow {
    position: absolute;
    top: 40px; left: 40px;
    font-size: 8px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: ${muted};
    line-height: 1.7;
  }
  .vc-tag-top {
    position: absolute;
    top: 40px; right: 40px;
    font-size: 8px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: ${muted};
    text-align: right;
  }
  .vc-footer-tag {
    position: absolute;
    bottom: 34px; left: 40px;
    font-size: 9px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    padding: 5px 10px;
    border: 1px solid ${fg};
    color: ${fg};
  }
  .vc-footer-page {
    position: absolute;
    bottom: 34px; right: 40px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 9px;
    letter-spacing: 0.1em;
    color: ${muted};
  }
  .vc-cover-body { margin-top: auto; }
  .vc-cover-intro {
    font-size: 10px;
    line-height: 1.7;
    color: ${muted};
    max-width: 280px;
    margin-bottom: 30px;
  }
  .vc-cover-title {
    font-size: 60px;
    font-weight: 800;
    line-height: 0.92;
    letter-spacing: -0.01em;
    text-transform: uppercase;
    margin-bottom: 12px;
  }
  .vc-cover-sub {
    font-size: 11px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: ${muted};
  }
  .vc-div-num {
    display: inline-block;
    font-size: 14px;
    font-weight: 800;
    border: 1px solid ${fg};
    padding: 3px 9px;
    margin-bottom: 16px;
  }
  .vc-mosaic {
    margin-top: 70px;
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 6px;
    min-height: 0;
  }
  .vc-mosaic img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    background: ${accentBlock};
  }
  .vc-prod-head { margin-top: 70px; margin-bottom: 20px; }
  .vc-prod-num {
    font-size: 30px;
    font-weight: 800;
    line-height: 1;
    margin-bottom: 4px;
  }
  .vc-prod-title {
    font-size: 19px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.01em;
    line-height: 1.2;
    margin-bottom: 6px;
  }
  .vc-prod-category {
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: ${muted};
  }
  .vc-prod-image-wrap {
    position: relative;
    flex: 1;
    min-height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 18px;
  }
  .vc-prod-image-block {
    position: absolute;
    width: 78%;
    height: 78%;
    left: 8%;
    top: 6%;
    background: ${accentBlock};
    z-index: 0;
  }
  .vc-prod-image-wrap img {
    position: relative;
    z-index: 1;
    max-width: 88%;
    max-height: 100%;
    object-fit: contain;
    display: block;
  }
  .vc-prod-price {
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 4px;
  }
  .vc-prod-dimensions {
    font-size: 9px;
    color: ${muted};
    margin-bottom: 8px;
  }
  .vc-prod-desc {
    font-size: 9px;
    line-height: 1.6;
    color: ${muted};
    max-width: 300px;
  }
`;}

export function buildVendorCatalogHTML(origin: string, lang: "en" | "zh", theme: PrintTheme = "light"): string {
  const isDark = theme === "dark";
  const isZh = lang === "zh";
  const muted = isDark ? "#8f887a" : "#767066";

  const rawItems: VendorItem[] = [
    ...products.filter((product) => product.showInStorefront !== false).map((product) => ({
      title: isZh ? (product.title_zh ?? product.title) : product.title,
      description: isZh ? (product.description_zh ?? product.description) : product.description,
      dimensions: isZh ? (product.dimensions_zh ?? product.dimensions) : product.dimensions,
      price: product.price,
      currency: product.currency,
      category: isZh ? (product.category_zh ?? product.category ?? "Product") : (product.category ?? "Product"),
      image_url: normalizePrintAsset(origin, product.image_url),
    })),
    ...photographyWorks.filter((work) => work.showInStorefront !== false).map((work) => ({
      title: isZh ? (work.titleZh ?? work.title) : work.title,
      description: isZh ? (work.descriptionZh || photographyMeta.descriptionZh) : (work.description || photographyMeta.description),
      dimensions: isZh ? (work.dimensionsZh || work.printInfoZh) : (work.dimensions || work.printInfo),
      price: work.printPrice ?? 10,
      currency: "USD",
      category: isZh ? "版画" : "Fine Art Prints",
      image_url: normalizePrintAsset(origin, `/photography/${work.id.padStart(2, "0")}/main.jpg`),
    })),
    ...remainsWorks.filter((work) => work.showInStorefront !== false).map((work) => ({
      title: isZh ? (work.titleZh ?? work.title) : work.title,
      description: isZh ? (work.descriptionZh || remainsMeta.descriptionZh) : (work.description || remainsMeta.description),
      dimensions: isZh ? work.dimensionsZh : work.dimensions,
      price: work.price ?? 4,
      currency: "USD",
      category: isZh ? "版画" : "Fine Art Prints",
      image_url: normalizePrintAsset(origin, `/remains/${work.id.padStart(2, "0")}/main.jpg`),
    })),
    ...spiritWorks.filter((work) => work.showInStorefront !== false).map((work) => ({
      title: isZh ? (work.titleZh ?? work.title) : work.title,
      description: isZh ? (work.descriptionZh || spiritMeta.descriptionZh) : (work.description || spiritMeta.description),
      dimensions: isZh ? work.dimensionsZh : work.dimensions,
      price: work.price ?? 4,
      currency: "USD",
      category: isZh ? "版画" : "Fine Art Prints",
      image_url: normalizePrintAsset(origin, `/21spirit/${work.id.padStart(2, "0")}/main.jpg`),
    })),
    ...watercolors.filter((work) => work.showInStorefront !== false).map((work) => ({
      title: isZh ? (work.titleZh ?? work.title) : work.title,
      description: isZh ? (work.descriptionZh || watercolorMeta.descriptionZh) : (work.description || watercolorMeta.description),
      dimensions: isZh ? (work.dimensionsZh || work.printInfoZh) : (work.dimensions || work.printInfo),
      price: work.price ?? work.printPrice ?? 10,
      currency: "USD",
      category: work.series === "III" ? (isZh ? "卡片" : "Cards") : (isZh ? "版画" : "Fine Art Prints"),
      image_url: normalizePrintAsset(origin, `/watercolors/${work.id.padStart(2, "0")}/main.jpg`),
    })),
  ];

  const groups: { category: string; items: VendorItem[] }[] = [];
  for (const item of rawItems) {
    let group = groups.find((g) => g.category === item.category);
    if (!group) {
      group = { category: item.category, items: [] };
      groups.push(group);
    }
    group.items.push(item);
  }

  let totalPages = 2;
  for (const group of groups) {
    totalPages += 2 + Math.ceil(group.items.length / 2) * 2;
  }

  const about = translations[lang].about;
  const intro = `<p>${about.body.split("\n\n")[0]}</p>`;
  const heroImage = rawItems[0]?.image_url ?? "";

  let pageCounter = 1;
  const coverHtml = vcCoverSpread(isZh, intro, heroImage, rawItems.length, pageCounter, totalPages, muted);
  pageCounter += 2;

  let sectionsHtml = "";
  groups.forEach((group, groupIndex) => {
    sectionsHtml += vcCategoryDividerSpread(group.category, group.items, isZh, groupIndex + 1, pageCounter, totalPages, muted);
    pageCounter += 2;
    for (let i = 0; i < group.items.length; i += 2) {
      const left = vcProductPage(group.items[i], "left", i + 1, isZh, pageCounter, totalPages, muted);
      const rightItem = group.items[i + 1];
      const right = rightItem
        ? vcProductPage(rightItem, "right", i + 2, isZh, pageCounter + 1, totalPages, muted)
        : vcEmptyPage("right");
      sectionsHtml += spread(left, right);
      pageCounter += 2;
    }
  });

  const coverTitle = isZh ? "店铺产品目录" : "Shop Product Catalog";
  const now = new Date();
  const dateStamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <title>${coverTitle} ${dateStamp}</title>
  <style>${getVendorCSS(isDark)}</style>
</head>
<body>
  ${coverHtml}
  ${sectionsHtml}
  <script>window.onload = function() { setTimeout(function() { window.print(); }, 300); };<\/script>
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
