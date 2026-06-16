import { watercolors, seriesList, type Watercolor } from "./watercolors";
import { remainsWorks, type RemainsWork } from "./remains";
import { spiritWorks, type SpiritWork } from "./21spirit";
import { photographyWorks, type PhotographyWork } from "./photography";
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
    flex: 1;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    overflow: hidden;
  }
  .img-area img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    display: block;
  }
  .meta {
    margin-top: 22px;
    padding-top: 16px;
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
  .cover-year {
    font-size: 9px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${coverYear};
    margin-top: 28px;
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
  _subtitleEn: string,
  _subtitleZh: string,
  itemsEn: Array<{ label?: string; name: string; sub?: string }>,
  itemsZh: Array<{ label?: string; name: string; sub?: string }>,
  count: number,
  isZh: boolean,
): string {
  const items = isZh ? itemsZh : itemsEn;
  const left = `
    <div class="page page-left cover-left">
      <div class="cover-series-list">
        ${items.map((item) => `
          <div class="cover-series-item">
            ${item.label ? `<span class="cs-label">${item.label}</span>` : ""}
            <span class="cs-name">${item.name}</span>
            ${item.sub ? `<span class="cs-sub">${item.sub}</span>` : ""}
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
  const medium = isZh ? (work.mediumZh ?? work.medium) : work.medium;
  const dimensions = isZh ? (work.dimensionsZh ?? work.dimensions) : work.dimensions;
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
  const medium = isZh ? (work.mediumZh ?? work.medium) : work.medium;
  const dimensions = isZh ? (work.dimensionsZh ?? work.dimensions) : work.dimensions;
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
  const medium = isZh ? (work.mediumZh ?? work.medium) : work.medium;
  const dimensions = isZh ? (work.dimensionsZh ?? work.dimensions) : work.dimensions;
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
  const medium = isZh ? (work.mediumZh ?? work.medium) : work.medium;
  const dimensions = isZh ? (work.dimensionsZh ?? work.dimensions) : work.dimensions;
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
    "全集",
    "",
    "",
    [
      { label: "Visions in Watercolor", name: `${printableWatercolors.length} works` },
      { label: "Remains", name: `${printableRemains.length} works` },
      { label: "21 Spirit", name: `${printableSpirit.length} works` },
      { label: "Photography", name: `${printablePhotography.length} works` },
      { label: "Shop", name: `${printableProducts.length} items` },
    ],
    [
      { label: "水彩视界", name: `${printableWatercolors.length} 件` },
      { label: "遗存", name: `${printableRemains.length} 件` },
      { label: "廿一灵", name: `${printableSpirit.length} 件` },
      { label: "摄影", name: `${printablePhotography.length} 件` },
      { label: "商店", name: `${printableProducts.length} 件` },
    ],
    totalArt,
    isZh,
  );

  // Watercolors section
  const watercolorCover = sectionCoverSpread(
    "Visions in Watercolor",
    "水彩视界",
    "",
    "",
    seriesList.map((s) => ({
      label: s.label,
      name: s.englishName,
      sub: s.subtitle,
    })),
    seriesList.map((s) => ({
      label: s.label,
      name: s.chineseName,
      sub: s.subtitleZh ?? s.subtitle,
    })),
    printableWatercolors.length,
    isZh,
  );
  const watercolorSpreads = pairSpreads(
    printableWatercolors,
    (w, side) => watercolorPage(w, side, origin, isZh),
  );

  // Remains section
  const remainsCover = sectionCoverSpread(
    "Remains",
    "遗存",
    "",
    "",
    [{ name: isZh ? "遗存" : "Remains", sub: isZh ? `第1–${printableRemains.length}件` : `Works 1–${printableRemains.length}` }],
    [{ name: "遗存", sub: `第1–${printableRemains.length}件` }],
    printableRemains.length,
    isZh,
  );
  const remainsSpreads = pairSpreads(
    printableRemains,
    (w, side) => remainsPage(w, side, origin, isZh),
  );

  // 21 Spirit section
  const spiritCover = sectionCoverSpread(
    "21 Spirit",
    "廿一灵",
    "",
    "",
    [{ name: isZh ? "廿一灵" : "21 Spirit", sub: isZh ? `第1–${printableSpirit.length}件` : `Works 1–${printableSpirit.length}` }],
    [{ name: "廿一灵", sub: `第1–${printableSpirit.length}件` }],
    printableSpirit.length,
    isZh,
  );
  const spiritSpreads = pairSpreads(
    printableSpirit,
    (w, side) => spiritPage(w, side, origin, isZh),
  );

  // Photography section
  const photographyCover = sectionCoverSpread(
    "Photography",
    "摄影",
    "",
    "",
    [{ name: isZh ? "摄影" : "Photography", sub: isZh ? `第1–${printablePhotography.length}件` : `Works 1–${printablePhotography.length}` }],
    [{ name: "摄影", sub: `第1–${printablePhotography.length}件` }],
    printablePhotography.length,
    isZh,
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

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <title>Chun Wang — ${isZh ? "全集" : "Complete Catalog"}</title>
  <style>${css}</style>
</head>
<body>
  ${masterCover}
  ${watercolorCover}
  ${watercolorSpreads}
  ${remainsCover}
  ${remainsSpreads}
  ${spiritCover}
  ${spiritSpreads}
  ${photographyCover}
  ${photographySpreads}
  ${shopCover}
  ${shopSpreads}
  <script>window.onload = function() { setTimeout(function() { window.print(); }, 300); };<\/script>
</body>
</html>`;
}
