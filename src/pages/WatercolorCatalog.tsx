import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { watercolors, seriesList, catalogMeta, type Watercolor } from "@/lib/watercolors";
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
          {series ? `${lang === "zh" ? series.chineseName : series.englishName}` : `Series ${work.series}`}
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
        <h3 className="text-sm leading-snug product-title">{work.title}</h3>
      </div>
    </article>
  );
};

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

const WatercolorCatalog = () => {
  const { lang, t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-10 py-10 md:py-14">

        <div className="relative z-10 mb-6">
          <Link to="/catalogs" className="font-helvetica text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Art Catalogs
          </Link>
        </div>

        {/* Catalog header */}
        <header className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <h1 className="shop-title text-6xl md:text-7xl leading-none">Chun Wang
            </h1>
            <h1 className="shop-title mt-3 text-4xl text-muted-foreground">
            </h1>
            <p className="mt-3 text-4xl ">{t.watercolorCatalog.subtitle}</p>
            <p className="font-mono text-xs text-muted-foreground/60 mt-1">
              {lang === "zh" ? catalogMeta.mediumZh : catalogMeta.medium}
            </p>
            <p className="font-mono text-xs text-muted-foreground/60 mt-1">
              {watercolors.length} {t.watercolorCatalog.works}
            </p>
            {catalogMeta.descriptionHtml ? (
              <div
                className="description-html text-sm text-muted-foreground mt-3 max-w-prose space-y-3 [&_em]:italic"
                dangerouslySetInnerHTML={{
                  __html: lang === "zh"
                    ? (catalogMeta.descriptionHtmlZh ?? catalogMeta.descriptionHtml)
                    : catalogMeta.descriptionHtml,
                }}
              />
            ) : catalogMeta.description && (
              <p
                className="description-html text-sm text-muted-foreground mt-3 max-w-prose"
                dangerouslySetInnerHTML={{ __html: lang === "zh" ? (catalogMeta.descriptionZh ?? catalogMeta.description) : catalogMeta.description }}
              />
            )}
          </div>
        </header>

        {/* Series list */}
        <section className="mt-10 border-y border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
            {seriesList.map((s) => {
              const count = watercolors.filter((w) => w.series === s.id).length;
              return (
              <div key={s.id} className="py-6 px-1 md:px-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl leading-none">{lang === "zh" ? s.chineseName : s.englishName}</span>
                  <span className="text-lg leading-none text-muted-foreground">{lang === "zh" ? s.englishName : s.chineseName}</span>
                </div>
                <p className="font-mono text-xs mt-2 text-muted-foreground">{count} {t.watercolorCatalog.works}</p>
                {s.description && (
                  <p
                    className="description-html text-sm text-muted-foreground mt-2"
                    dangerouslySetInnerHTML={{ __html: lang === "zh" ? (s.descriptionZh ?? s.description) : s.description }}
                  />
                )}
              </div>
              );
            })}
          </div>
        </section>

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
