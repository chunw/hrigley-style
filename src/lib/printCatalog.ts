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

export interface CatalogItem {
  title: string;
  metaLine?: string | null;
  year?: string | null;
  medium?: string | null;
  description?: string | null;
  dimensions?: string | null;
  category: string;
  image_url: string;
  /** Used when image_url (a work's printInCatalogImage) is missing - falls back to its main.jpg. */
  fallback_image_url?: string;
}

interface CatalogBrand {
  eyebrow1: string;
  eyebrow2: string;
  footerWord: string;
}

function vcBrand(isZh: boolean, kind: "vendor" | "combined"): CatalogBrand {
  const studio = isZh ? "王淳工作室" : "CHUN WANG STUDIO";
  if (kind === "vendor") {
    return {
      eyebrow1: studio,
      eyebrow2: isZh ? "商店目录" : "SHOP CATALOG",
      footerWord: isZh ? "商店" : "SHOP",
    };
  }
  return {
    eyebrow1: studio,
    eyebrow2: isZh ? "完整目录" : "COMPLETE CATALOG",
    footerWord: isZh ? "目录" : "CATALOG",
  };
}

function vcCoverSpread(
  brand: CatalogBrand,
  isZh: boolean,
  intro: string,
  titleHtml: string,
  subtitleText: string,
  heroImage: string,
  itemCount: number,
  page: number,
  total: number,
  muted: string,
): string {
  const left = `
    <div class="vc-page vc-page-left">
      ${vcEyebrow(brand.eyebrow1, brand.eyebrow2)}
      ${vcTagTop(isZh ? `#共 ${itemCount} 件` : `#ITEMS ${itemCount}`)}
      <div class="vc-cover-body">
        <div class="vc-cover-intro">${intro}</div>
        <div class="vc-cover-title">${titleHtml}</div>
        <div class="vc-cover-sub">${subtitleText}</div>
      </div>
      ${vcFooter(`${brand.footerWord} | ${isZh ? "封面" : "COVER"}`, page, total, muted)}
    </div>`;
  const right = `
    <div class="vc-page vc-page-right">
      ${vcTagTop(isZh ? "#精选" : "#FEATURED")}
      <div class="vc-prod-image-wrap" style="margin-top:70px;">
        <div class="vc-prod-image-block"></div>
        <img src="${heroImage}" alt="" onerror="this.style.visibility='hidden'" />
      </div>
      ${vcFooter(`${brand.footerWord} | ${isZh ? "精选" : "FEATURED"}`, page + 1, total, muted)}
    </div>`;
  return spread(left, right);
}

function vcCategoryDividerPage(
  brand: CatalogBrand,
  category: string,
  items: CatalogItem[],
  isZh: boolean,
  catIndex: number,
  page: number,
  total: number,
  muted: string,
): string {
  const content = `
    <div class="vc-page vc-page-right">
      ${vcEyebrow(brand.eyebrow1, brand.eyebrow2)}
      ${vcTagTop(isZh ? `${items.length} 件` : `${items.length} ITEMS`)}
      <div class="vc-cover-body">
        <div class="vc-div-num">${String(catIndex).padStart(2, "0")}</div>
        <div class="vc-cover-title" style="font-size:44px;">${category}</div>
        <div class="vc-cover-sub">${brand.eyebrow2}</div>
      </div>
      ${vcFooter(`${brand.footerWord} | ${category}`, page, total, muted)}
    </div>`;
  return spread(content, "");
}

function vcProductPage(
  brand: CatalogBrand,
  item: CatalogItem,
  side: "left" | "right",
  index: number,
  page: number,
  total: number,
  muted: string,
): string {
  return `
    <div class="vc-page vc-page-${side}">
      ${vcEyebrow(brand.eyebrow1, brand.eyebrow2)}
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
      ${item.metaLine ? `<div class="vc-prod-price">${item.metaLine}</div>` : ""}
      ${item.dimensions ? `<div class="vc-prod-dimensions">${item.dimensions}</div>` : ""}
      ${item.description ? `<div class="vc-prod-desc">${item.description}</div>` : ""}
      ${vcFooter(`${brand.footerWord} | ${item.category}`, page, total, muted)}
    </div>`;
}

function vcBioSpread(brand: CatalogBrand, page: number, total: number, muted: string): string {
  const enBio = artistBioHTML("en");
  const zhBio = artistBioHTML("zh");
  const left = `
    <div class="vc-page vc-page-left">
      ${vcEyebrow(brand.eyebrow1, brand.eyebrow2)}
      ${vcTagTop("#关于")}
      <div class="vc-cover-body">
        <div class="vc-cover-sub" style="margin-bottom:14px;">关于艺术家</div>
        <div class="vc-cover-title" style="font-size:36px;margin-bottom:20px;">王淳</div>
        <div class="vc-prod-desc" style="max-width:340px;font-size:10px;line-height:1.8;">${zhBio}</div>
      </div>
      ${vcFooter(`${brand.footerWord} | 关于`, page, total, muted)}
    </div>`;
  const right = `
    <div class="vc-page vc-page-right">
      ${vcTagTop("#ABOUT")}
      <div class="vc-cover-body">
        <div class="vc-cover-sub" style="margin-bottom:14px;">About the Artist</div>
        <div class="vc-cover-title" style="font-size:36px;margin-bottom:20px;">Chun Wang</div>
        <div class="vc-prod-desc" style="max-width:340px;font-size:10px;line-height:1.8;">${enBio}</div>
      </div>
      ${vcFooter(`${brand.footerWord} | ABOUT`, page + 1, total, muted)}
    </div>`;
  return spread(left, right);
}

function getCatalogCSS(isDark: boolean): string {
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
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  /* Fixed landscape page size (US Letter @ 96dpi) instead of 100vw/100vh, so the
     catalog lays out the same two-page spread on a narrow mobile viewport as it does
     on desktop, rather than squeezing into a tall, narrow strip. */
  .spread {
    width: 1056px;
    height: 816px;
    flex: none;
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
  const brand = vcBrand(isZh, "vendor");

  const priceLine = (price: number | null | undefined, currency: string | null | undefined, label?: string): string =>
    label ? `${currency ?? "USD"} ${label}` : price != null ? `${currency ?? "USD"} $${price}` : (isZh ? "询价" : "Price on request");

  const rawItems: CatalogItem[] = [
    ...products.filter((product) => product.showInStorefront !== false).map((product) => ({
      title: isZh ? (product.title_zh ?? product.title) : product.title,
      metaLine: priceLine(product.price, product.currency, product.priceLabel),
      description: isZh ? (product.description_zh ?? product.description) : product.description,
      dimensions: isZh ? (product.dimensions_zh ?? product.dimensions) : product.dimensions,
      category: isZh ? (product.category_zh ?? product.category ?? "Product") : (product.category ?? "Product"),
      image_url: normalizePrintAsset(origin, product.image_url),
    })),
    ...photographyWorks.filter((work) => work.showInStorefront !== false).map((work) => ({
      title: isZh ? (work.titleZh ?? work.title) : work.title,
      metaLine: priceLine(work.printPrice ?? 10, "USD", work.printPrice && work.printPrice12x18 ? `$${work.printPrice} / $${work.printPrice12x18}` : undefined),
      description: isZh ? (work.descriptionZh || photographyMeta.descriptionZh) : (work.description || photographyMeta.description),
      dimensions: isZh ? (work.dimensionsZh || work.printInfoZh) : (work.dimensions || work.printInfo),
      category: isZh ? "版画" : "Fine Art Prints",
      image_url: normalizePrintAsset(origin, `/photography/${work.id.padStart(2, "0")}/main.jpg`),
    })),
    ...remainsWorks.filter((work) => work.showInStorefront !== false).map((work) => ({
      title: isZh ? (work.titleZh ?? work.title) : work.title,
      metaLine: priceLine(work.price ?? 4, "USD"),
      description: isZh ? (work.descriptionZh || remainsMeta.descriptionZh) : (work.description || remainsMeta.description),
      dimensions: isZh ? work.dimensionsZh : work.dimensions,
      category: isZh ? "版画" : "Fine Art Prints",
      image_url: normalizePrintAsset(origin, `/remains/${work.id.padStart(2, "0")}/main.jpg`),
    })),
    ...spiritWorks.filter((work) => work.showInStorefront !== false).map((work) => ({
      title: isZh ? (work.titleZh ?? work.title) : work.title,
      metaLine: priceLine(work.price ?? 4, "USD", work.priceLabel),
      description: isZh ? (work.descriptionZh || spiritMeta.descriptionZh) : (work.description || spiritMeta.description),
      dimensions: isZh ? work.dimensionsZh : work.dimensions,
      category: isZh ? "版画" : "Fine Art Prints",
      image_url: normalizePrintAsset(origin, `/21spirit/${work.id.padStart(2, "0")}/main.jpg`),
    })),
    ...watercolors.filter((work) => work.showInStorefront !== false).map((work) => ({
      title: isZh ? (work.titleZh ?? work.title) : work.title,
      metaLine: priceLine(work.price ?? work.printPrice ?? 10, "USD", work.priceLabel),
      description: isZh ? (work.descriptionZh || watercolorMeta.descriptionZh) : (work.description || watercolorMeta.description),
      dimensions: isZh ? (work.dimensionsZh || work.printInfoZh) : (work.dimensions || work.printInfo),
      category: work.series === "III" ? (isZh ? "卡片" : "Cards") : (isZh ? "版画" : "Fine Art Prints"),
      image_url: normalizePrintAsset(origin, `/watercolors/${work.id.padStart(2, "0")}/main.jpg`),
    })),
  ];

  const groups: { category: string; items: CatalogItem[] }[] = [];
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
    totalPages += 1 + group.items.length;
  }

  const about = translations[lang].about;
  const intro = `<p>${about.body.split("\n\n")[0]}</p>`;
  const heroImage = rawItems[0]?.image_url ?? "";

  let pageCounter = 1;
  const coverHtml = vcCoverSpread(
    brand,
    isZh,
    intro,
    isZh ? "商店<br/>目录" : "SHOP<br/>CATALOG",
    isZh ? "精选作品与商品" : "CURATED WORKS & PRODUCTS",
    heroImage,
    rawItems.length,
    pageCounter,
    totalPages,
    muted,
  );
  pageCounter += 2;

  let sectionsHtml = "";
  groups.forEach((group, groupIndex) => {
    sectionsHtml += vcCategoryDividerPage(brand, group.category, group.items, isZh, groupIndex + 1, pageCounter, totalPages, muted);
    pageCounter += 1;
    for (let i = 0; i < group.items.length; i += 2) {
      const rightItem = group.items[i + 1];
      if (rightItem) {
        const left = vcProductPage(brand, group.items[i], "left", i + 1, pageCounter, totalPages, muted);
        const right = vcProductPage(brand, rightItem, "right", i + 2, pageCounter + 1, totalPages, muted);
        sectionsHtml += spread(left, right);
        pageCounter += 2;
      } else {
        const solo = vcProductPage(brand, group.items[i], "right", i + 1, pageCounter, totalPages, muted);
        sectionsHtml += spread(solo, "");
        pageCounter += 1;
      }
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
  <style>${getCatalogCSS(isDark)}</style>
</head>
<body>
  ${coverHtml}
  ${sectionsHtml}
</body>
</html>`;
}

export type CatalogSectionKey = "spirit" | "remains" | "watercolor" | "photography" | "shop";

export interface CatalogSection {
  key: CatalogSectionKey;
  category: string;
  descriptionHtml: string;
  items: CatalogItem[];
}

/**
 * The artwork + product sections shown in the Complete Catalog, in print order. Shared by the
 * HTML print catalog below and the /catalogs/book art-book page, so both always list the same
 * works with the same titles, metadata and images.
 */
export function getCombinedCatalogSections(origin: string, lang: "en" | "zh"): CatalogSection[] {
  const isZh = lang === "zh";

  const artMetaLine = (year: string, medium?: string | null): string => `${year}${medium ? ` · ${medium}` : ""}`;

  interface ArtWork {
    id: string;
    title: string;
    titleZh?: string;
    year: string;
    medium?: string;
    mediumZh?: string;
    dimensions?: string;
    dimensionsZh?: string;
    description?: string;
    descriptionZh?: string;
    printInCatalog?: boolean;
    printInCatalogImage?: string;
  }
  interface ArtMeta {
    en: string;
    zh: string;
    medium: string;
    mediumZh?: string;
  }

  const artItems = (works: ArtWork[], meta: ArtMeta, dir: string): CatalogItem[] =>
    works.filter((work) => work.printInCatalog !== false).map((work) => {
      const padded = work.id.padStart(2, "0");
      const medium = isZh
        ? (work.mediumZh || meta.mediumZh || meta.medium)
        : (work.medium || meta.medium);
      return {
        title: isZh ? (work.titleZh ?? work.title) : work.title,
        metaLine: artMetaLine(work.year, medium),
        year: work.year,
        medium,
        dimensions: isZh ? (work.dimensionsZh ?? work.dimensions) : work.dimensions,
        description: isZh ? (work.descriptionZh ?? work.description) : work.description,
        category: isZh ? meta.zh : meta.en,
        image_url: normalizePrintAsset(origin, `/${dir}/${padded}/${work.printInCatalogImage ?? "main"}.jpg`),
        fallback_image_url: normalizePrintAsset(origin, `/${dir}/${padded}/main.jpg`),
      };
    });

  const shopItems: CatalogItem[] = products.filter((p) => p.printInCatalog !== false).map((p) => {
    const imgs = productImages.filter((img) => img.product_id === p.id);
    const imgSrc = imgs.length > 0 ? imgs[0].image_url : p.image_url;
    return {
      title: isZh ? (p.title_zh ?? p.title) : p.title,
      dimensions: isZh ? (p.dimensions_zh ?? p.dimensions) : p.dimensions,
      description: isZh ? (p.description_zh ?? p.description) : p.description,
      category: isZh ? "商店" : "Shop",
      image_url: normalizePrintAsset(origin, imgSrc),
    };
  });

  return [
    { key: "spirit", category: isZh ? spiritMeta.zh : spiritMeta.en, descriptionHtml: isZh ? spiritMeta.descriptionZh : spiritMeta.description, items: artItems(spiritWorks, spiritMeta, "21spirit") },
    { key: "remains", category: isZh ? remainsMeta.zh : remainsMeta.en, descriptionHtml: isZh ? remainsMeta.descriptionZh : remainsMeta.description, items: artItems(remainsWorks, remainsMeta, "remains") },
    { key: "watercolor", category: isZh ? watercolorMeta.zh : watercolorMeta.en, descriptionHtml: isZh ? watercolorMeta.descriptionHtmlZh : watercolorMeta.descriptionHtml, items: artItems(watercolors, watercolorMeta, "watercolors") },
    { key: "photography", category: isZh ? photographyMeta.zh : photographyMeta.en, descriptionHtml: isZh ? photographyMeta.descriptionZh : photographyMeta.description, items: artItems(photographyWorks, photographyMeta, "photography") },
    { key: "shop", category: isZh ? "商店" : "Shop", descriptionHtml: "", items: shopItems },
  ];
}

export function buildCombinedPrintHTML(origin: string, lang: "en" | "zh", theme: PrintTheme = "light"): string {
  const isDark = theme === "dark";
  const isZh = lang === "zh";
  const muted = isDark ? "#8f887a" : "#767066";
  const brand = vcBrand(isZh, "combined");

  const sections = getCombinedCatalogSections(origin, lang);
  const sectionItems = (key: CatalogSectionKey) => sections.find((s) => s.key === key)?.items ?? [];

  const totalItems = sections.reduce((sum, s) => sum + s.items.length, 0);

  let totalPages = 4; // master cover (2) + bio spread (2)
  for (const section of sections) {
    totalPages += 1 + section.items.length;
  }

  const bioIntro = `<p>${artistBioSegments[lang].intro.split("<br><br>")[0]}</p>`;
  const heroImage = sectionItems("watercolor")[0]?.image_url || sectionItems("spirit")[0]?.image_url || sectionItems("remains")[0]?.image_url || sectionItems("photography")[0]?.image_url || "";

  let pageCounter = 1;
  const coverHtml = vcCoverSpread(
    brand,
    isZh,
    bioIntro,
    isZh ? "完整<br/>目录" : "COMPLETE<br/>CATALOG",
    isZh ? "绘画 · 摄影 · 器物" : "PAINTINGS · PHOTOGRAPHY · OBJECTS",
    heroImage,
    totalItems,
    pageCounter,
    totalPages,
    muted,
  );
  pageCounter += 2;

  const bioHtml = vcBioSpread(brand, pageCounter, totalPages, muted);
  pageCounter += 2;

  let sectionsHtml = "";
  sections.forEach((section, sectionIndex) => {
    sectionsHtml += vcCategoryDividerPage(brand, section.category, section.items, isZh, sectionIndex + 1, pageCounter, totalPages, muted);
    pageCounter += 1;
    for (let i = 0; i < section.items.length; i += 2) {
      const rightItem = section.items[i + 1];
      if (rightItem) {
        const left = vcProductPage(brand, section.items[i], "left", i + 1, pageCounter, totalPages, muted);
        const right = vcProductPage(brand, rightItem, "right", i + 2, pageCounter + 1, totalPages, muted);
        sectionsHtml += spread(left, right);
        pageCounter += 2;
      } else {
        const solo = vcProductPage(brand, section.items[i], "right", i + 1, pageCounter, totalPages, muted);
        sectionsHtml += spread(solo, "");
        pageCounter += 1;
      }
    }
  });

  const now = new Date();
  const dateStamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <title>Chun Wang Complete Catalog ${dateStamp} ${lang.toUpperCase()}</title>
  <style>${getCatalogCSS(isDark)}</style>
</head>
<body>
  ${coverHtml}
  ${bioHtml}
  ${sectionsHtml}
</body>
</html>`;
}
