import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { watercolors, seriesList, type Watercolor } from "@/lib/watercolors";
import { products, productImages } from "@/lib/products";
import { useLanguage } from "@/contexts/LanguageContext";

const HIGHLIGHTED = new Set(["1", "9"]);

const WorkCard = ({ work }: { work: Watercolor }) => {
  const { lang, t } = useLanguage();
  const padded = work.id.padStart(2, "0");
  const highlighted = HIGHLIGHTED.has(work.id);
  const series = seriesList.find((s) => s.id === work.series);

  return (
    <article>
      <div className="flex justify-between items-center mb-2">
        <span className="font-mono text-xs">P{padded}</span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {series ? `${series.label} · ${lang === "zh" ? series.chineseName : series.englishName}` : `Series ${work.series}`}
        </span>
      </div>

      <Link
        to={`/watercolors/${work.id}`}
        className={`block relative overflow-hidden ${
          highlighted ? "border-2" : "border border-border"
        }`}
        style={{
          aspectRatio: "8.5/11",
          backgroundColor: "#111",
          borderColor: highlighted ? "rgba(244,114,182,0.7)" : undefined,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40">
            {t.watercolorCatalog.uploadImage}
          </span>
        </div>

        <img
          src={`/watercolors/${padded}/main.jpg`}
          alt={work.title}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0,
            transition: "opacity 0.2s",
          }}
          onLoad={(e) => {
            (e.target as HTMLImageElement).style.opacity = "1";
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />

        {highlighted && (
          <div
            className="absolute top-2 left-2 w-2 h-2 rounded-full"
            style={{ backgroundColor: "rgba(244,114,182,0.8)" }}
          />
        )}
      </Link>

      <div className="mt-3">
        <h3 className="text-sm leading-snug">{work.title}</h3>
      </div>
    </article>
  );
};

// ---------------------------------------------------------------------------
// Print helpers
// ---------------------------------------------------------------------------

function buildPrintHTML(origin: string, lang: "en" | "zh"): string {
  const isZh = lang === "zh";
  const printableWatercolors = watercolors.filter((work) => work.printInCatalog !== false);
  const printableProducts = products.filter((product) => product.printInCatalog !== false);

  const pairs: (Watercolor | null)[][] = [];
  for (let i = 0; i < printableWatercolors.length; i += 2) {
    pairs.push([printableWatercolors[i], printableWatercolors[i + 1] ?? null]);
  }

  const workPage = (work: Watercolor | null, side: "left" | "right") => {
    if (!work) return `<div class="page page-${side}"></div>`;
    const padded = work.id.padStart(2, "0");
    const title = isZh ? work.titleZh ?? work.title : work.title;
    const medium = isZh ? work.mediumZh ?? work.medium : work.medium;
    const dimensions = isZh ? work.dimensionsZh ?? work.dimensions : work.dimensions;
    return `
      <div class="page page-${side}">
        <div class="page-num">P${padded}</div>
        <div class="img-area">
          <img src="${origin}/watercolors/${padded}/${work.printInCatalogImage ?? 'main'}.jpg" alt="${work.title}" onerror="this.style.visibility='hidden'" />
        </div>
        <div class="meta">
          <div class="meta-title">${title}</div>
          <div class="meta-year">${work.year}</div>
          ${medium ? `<div class="meta-sub">${medium}</div>` : ""}
          ${dimensions ? `<div class="meta-dimensions">${dimensions}</div>` : ""}
        </div>
      </div>`;
  };

  const totalItems = printableWatercolors.length + printableProducts.length;

  const coverSpread = `
    <div class="spread">
      <div class="page page-left cover-left">
        <div class="cover-series-list">
          ${seriesList.map((s) => `
            <div class="cover-series-item">
              <span class="cs-label">${s.label}</span>
              <span class="cs-name">${isZh ? s.chineseName : s.englishName}</span>
              ${((isZh ? s.subtitleZh ?? s.subtitle : s.subtitle) ? `<span class="cs-sub">${isZh ? s.subtitleZh ?? s.subtitle : s.subtitle}</span>` : "")}
            </div>
          `).join("")}
          <div class="cover-count">${isZh ? `${totalItems} 件作品` : `${totalItems} works`}</div>
        </div>
      </div>
      <div class="page page-right cover-right">
        <div class="cover-body">
          <div class="cover-title">Chun Wang</div>
          <div class="cover-subtitle">${isZh ? "水彩视界" : "Visions in Watercolor"}</div>
          <div class="cover-year">${isZh ? `纽约 · ${new Date().getFullYear()}` : `New York · ${new Date().getFullYear()}`}</div>
        </div>
      </div>
    </div>`;

  const workSpreads = pairs
    .map(([a, b]) => `
      <div class="spread">
        ${workPage(a, "left")}
        ${workPage(b, "right")}
      </div>`)
    .join("\n");

  const shopDividerSpread = `
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

  const productPage = (p: typeof products[number] | null, side: "left" | "right") => {
    if (!p) return `<div class="page page-${side}"></div>`;
    const imgs = productImages.filter((img) => img.product_id === p.id);
    const imgSrc = imgs.length > 0 ? imgs[0].image_url : p.image_url;
    const title = isZh ? (p.title_zh ?? p.title) : p.title;
    const description = isZh ? (p.description_zh ?? p.description) : p.description;
    const longDescription = isZh ? (p.detailed_description_html_zh ?? p.detailed_description_html) : p.detailed_description_html;
    const dimensions = p.dimensions;
    return `
      <div class="page page-${side}">
        <div class="page-num">${isZh ? "商店" : "SHOP"}</div>
        <div class="img-area">
          <img src="${imgSrc}" alt="${p.title}" onerror="this.style.visibility='hidden'" />
        </div>
        <div class="meta">
          <div class="meta-title">${title}</div>
          ${dimensions ? `<div class="meta-sub">${dimensions}</div>` : ""}
          ${description ? `<div class="meta-description">${description}</div>` : ""}
          ${longDescription ? `<div class="meta-description">${longDescription}</div>` : ""}
        </div>
      </div>`;
  };

  const productPairs: (typeof products[number] | null)[][] = [];
  for (let i = 0; i < printableProducts.length; i += 2) {
    productPairs.push([printableProducts[i], printableProducts[i + 1] ?? null]);
  }
  const productSpreads = productPairs
    .map(([a, b]) => `
      <div class="spread">
        ${productPage(a, "left")}
        ${productPage(b, "right")}
      </div>`)
    .join("\n");

  const css = `
    @page { size: landscape; margin: 0; }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #fff; color: #111; font-family: 'Courier New', Courier, monospace; }

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
    }
    .page-left { border-right: 1px solid #d4d4d4; }

    /* Work page */
    .page-num {
      font-size: 9px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #aaa;
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
      color: #999;
    }
    .meta-year {
      font-size: 10px;
      color: #999;
      letter-spacing: 0.12em;
      margin-top: 2px;
    }
    .meta-sub {
      font-size: 10px;
      letter-spacing: 0.08em;
      color: #999;
      margin-top: 4px;
    }
    .meta-dimensions {
      font-size: 10px;
      color: #999;
      margin-top: 4px;
      letter-spacing: 0.08em;
    }
    .meta-note {
      font-size: 10px;
      color: #999;
      margin-top: 8px;
      line-height: 1.4;
    }
    .meta-description {
      font-size: 9px;
      color: #666;
      margin-top: 6px;
      line-height: 1.4;
    }

    /* Cover */
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
      color: #bbb;
    }
    .cs-name { color: #555; }
    .cs-sub {
      color: #999;
      font-size: 9px;
      line-height: 1.2;
    }
    .cover-count {
      font-size: 9px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #ccc;
      margin-top: 8px;
      padding-top: 16px;
      border-top: 1px solid #ececec;
    }

    .cover-body { display: flex; flex-direction: column; gap: 0; }
    .cover-title {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 60px;
      line-height: 1;
      letter-spacing: -0.01em;
      color: #111;
      margin-bottom: 16px;
    }
    .cover-subtitle {
      font-size: 48px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: #777;
    }
    .cover-year {
      font-size: 9px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #bbb;
      margin-top: 28px;
    }
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Chun Wang — Visions in Watercolor</title>
  <style>${css}</style>
</head>
<body>
  ${coverSpread}
  ${workSpreads}
  ${shopDividerSpread}
  ${productSpreads}
  <script>window.onload = function() { setTimeout(function() { window.print(); }, 300); };<\/script>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

const WatercolorCatalog = () => {
  const { lang, t } = useLanguage();

  const handlePrint = () => {
    const blob = new Blob([buildPrintHTML(window.location.origin, lang)], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header onPrintCatalog={handlePrint} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-10 py-10 md:py-14">

        {/* Catalog header */}
        <header className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <h1 className="shop-title text-6xl md:text-7xl leading-none">Chun Wang
            </h1>
            <h1 className="shop-title mt-3 text-4xl text-muted-foreground">
            </h1>
            <p className="mt-3 text-4xl ">{t.watercolorCatalog.subtitle}</p>
            <p className="font-mono text-xs text-muted-foreground/60 mt-1">
              {watercolors.length} {t.watercolorCatalog.works}
            </p>
          </div>
        </header>

        {/* Series list */}
        <section className="mt-10 border-y border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
            {seriesList.map((s) => (
              <div key={s.id} className="py-6 px-1 md:px-6">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs tracking-widest">{s.label}</span>
                  <span className="text-2xl leading-none">{s.englishName}</span>
                  <span className="text-lg leading-none text-muted-foreground">{s.chineseName}</span>
                </div>
                <p className="font-mono text-xs mt-2 text-muted-foreground">{lang === "zh" ? (s.subtitleZh ?? s.subtitle) : s.subtitle}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Artist statement */}
        {/* <section className="mt-16 border-t border-border pt-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h2 className="shop-title text-2xl leading-tight">{t.watercolorCatalog.artistStatement}</h2>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mt-2">
                {t.watercolorCatalog.artistLocation}
              </p>
            </div>
            <div className="md:col-span-2 text-sm leading-relaxed">
              {lang === "en" ? (
                <p>
                  I run my home as my own private museum. It started with watercolor sketches,
                  and my interest in the small trinkets scattered around the house has only grown
                  since. These objects, sometimes a little grotesque, are pieces I've salvaged
                  from all over for my collection. I often rearrange and combine them into new
                  scenes where the imagination can play. As Wang Yuping said, art doesn't have
                  to stand above life. I believe that everyday objects can also offer fresh visual and psychological experiences to the viewers.
                </p>
              ) : (
                <p>
                  我把家当作自己的"私人博物馆"来经营。从水彩速写开始，我对散落家中的小摆设的兴趣愈发增长。
                  这些有时带有怪诞气息的物件，是我从各处打捞的馆藏，也会时常被我排列组合，形成新的景观现场，供想象力嬉戏。
                  我相信日常小物也可以为观者带来新鲜的视觉体验与心理感受。
                </p>
              )}
            </div>
          </div>
        </section> */}

        {/* Works grid */}
        <section className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {watercolors.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default WatercolorCatalog;
