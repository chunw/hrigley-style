import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { spiritWorks, type SpiritWork } from "@/lib/21spirit";
import { useLanguage } from "@/contexts/LanguageContext";

const WorkCard = ({ work }: { work: SpiritWork }) => {
  const { lang } = useLanguage();
  const padded = work.id.padStart(2, "0");
  const title = lang === "zh" ? (work.titleZh ?? work.title) : work.title;

  return (
    <article>
      <div className="flex justify-between items-center mb-2">
        <span className="font-mono text-xs">S{padded}</span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          21 Spirit · 廿一灵
        </span>
      </div>

      <div
        className="block relative overflow-hidden border border-border"
        style={{
          aspectRatio: "8.5/11",
          backgroundColor: "#111",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40">
            {padded}
          </span>
        </div>

        <img
          src={`/21spirit/${padded}/main.jpg`}
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
      </div>

      <div className="mt-3">
        <h3 className="text-sm leading-snug">{title}</h3>
        {work.year && (
          <p className="font-mono text-xs text-muted-foreground mt-1">{work.year}</p>
        )}
      </div>
    </article>
  );
};

// ---------------------------------------------------------------------------
// Print helpers
// ---------------------------------------------------------------------------

function buildPrintHTML(origin: string, lang: "en" | "zh"): string {
  const isZh = lang === "zh";
  const printable = spiritWorks.filter((w) => w.printInCatalog !== false);

  const pairs: (SpiritWork | null)[][] = [];
  for (let i = 0; i < printable.length; i += 2) {
    pairs.push([printable[i], printable[i + 1] ?? null]);
  }

  const workPage = (work: SpiritWork | null, side: "left" | "right") => {
    if (!work) return `<div class="page page-${side}"></div>`;
    const padded = work.id.padStart(2, "0");
    const title = isZh ? (work.titleZh ?? work.title) : work.title;
    const medium = isZh ? (work.mediumZh ?? work.medium) : work.medium;
    const dimensions = isZh ? (work.dimensionsZh ?? work.dimensions) : work.dimensions;
    return `
      <div class="page page-${side}">
        <div class="page-num">S${padded}</div>
        <div class="img-area">
          <img src="${origin}/21spirit/${padded}/${work.printInCatalogImage ?? 'main'}.jpg" alt="${work.title}" onerror="this.style.visibility='hidden'" />
        </div>
        <div class="meta">
          <div class="meta-title">${title}</div>
          <div class="meta-year">${work.year}</div>
          ${medium ? `<div class="meta-sub">${medium}</div>` : ""}
          ${dimensions ? `<div class="meta-dimensions">${dimensions}</div>` : ""}
        </div>
      </div>`;
  };

  const coverSpread = `
    <div class="spread">
      <div class="page page-left cover-left">
        <div class="cover-series-list">
          <div class="cover-series-item">
            <span class="cs-label">${isZh ? "系列" : "Series"}</span>
            <span class="cs-name">${isZh ? "廿一灵" : "21 Spirit"}</span>
            <span class="cs-sub">${isZh ? `第1–${printable.length}件 · 廿一灵` : `Works 1–${printable.length} · 21 Spirit`}</span>
          </div>
          <div class="cover-count">${isZh ? `${printable.length} 件作品` : `${printable.length} works`}</div>
        </div>
      </div>
      <div class="page page-right cover-right">
        <div class="cover-body">
          <div class="cover-title">Chun Wang</div>
          <div class="cover-subtitle">${isZh ? "廿一灵" : "21 Spirit"}</div>
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
  <title>Chun Wang — 21 Spirit</title>
  <style>${css}</style>
</head>
<body>
  ${coverSpread}
  ${workSpreads}
  <script>window.onload = function() { setTimeout(function() { window.print(); }, 300); };<\/script>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

const Spirit21Catalog = () => {
  const { lang } = useLanguage();

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
            <h1 className="shop-title text-6xl md:text-7xl leading-none">Chun Wang</h1>
            <p className="mt-3 text-4xl">{lang === "zh" ? "廿一灵" : "21 Spirit"}</p>
            <p className="font-mono text-xs text-muted-foreground/60 mt-1">
              {spiritWorks.length} {lang === "zh" ? "件作品" : "works"}
            </p>
          </div>
        </header>

        {/* Works grid */}
        <section className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {spiritWorks.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default Spirit21Catalog;
