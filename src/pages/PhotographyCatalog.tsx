import { Link } from "react-router-dom";
import { Printer } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { photographyWorks, seriesList, catalogMeta, type PhotographyWork } from "@/lib/photography";
import { useLanguage } from "@/contexts/LanguageContext";


const WorkCard = ({ work }: { work: PhotographyWork }) => {
  const { lang } = useLanguage();
  const padded = work.id.padStart(2, "0");
  const title = lang === "zh" ? (work.titleZh ?? work.title) : work.title;
  const series = seriesList.find((s) => s.id === work.series);

  return (
    <article>
      <div className="flex justify-between items-center mb-2">
        <span className="font-mono text-xs">PH{padded}</span>
        {series && (
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {lang === "zh" ? series.chineseName : series.englishName}
          </span>
        )}
      </div>

      <Link
        to={`/photography/${work.id}`}
        className="block relative border border-border"
        style={{ backgroundColor: "#111", minHeight: "2rem" }}
      >
        <img
          src={`/photography/${padded}/main.jpg`}
          alt={work.title}
          style={{
            display: "block",
            width: "100%",
            height: "auto",
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
      </Link>

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
// Page component
// ---------------------------------------------------------------------------

const PhotographyCatalog = () => {
  const { lang, t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-10 py-10 md:py-14">

        <header className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <h1 className="shop-title text-6xl md:text-7xl leading-none">Chun Wang</h1>
            <p className="mt-3 text-4xl">{t.photographyCatalog.subtitle}</p>
            <p className="font-mono text-xs text-muted-foreground/60 mt-1">
              {lang === "zh" ? catalogMeta.mediumZh : catalogMeta.medium}
            </p>
            <p className="font-mono text-xs text-muted-foreground/60 mt-1">
              {photographyWorks.length} {t.photographyCatalog.works}
            </p>
            {catalogMeta.description && (
              <div className="mt-3 max-w-prose space-y-3">
                {(lang === "zh" ? (catalogMeta.descriptionZh ?? catalogMeta.description) : catalogMeta.description)
                  .split("\n\n")
                  .map((para, i) => (
                    <p key={i} className="text-sm text-muted-foreground leading-relaxed">{para}</p>
                  ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 self-start">
            {/* <Link
              to="/photography-photobook"
              className="flex items-center gap-2 px-4 py-2 border border-border font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
            >
              <BookOpen className="h-3 w-3 shrink-0" />
              Print Photobook
            </Link> */}
            {/* <a
              href="/cargo-print.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border border-border font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
            >
              <Printer className="h-3 w-3 shrink-0" />
              Print Cargo
            </a> */}
          </div>
        </header>

        {/* Series list */}
        <section className="mt-10 border-y border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
            {seriesList.map((s) => {
              const count = photographyWorks.filter((w) => w.series === s.id).length;
              return (
                <div key={s.id} className="py-6 px-1 md:px-6">
                  <span className="text-2xl leading-none">{lang === "zh" ? s.chineseName : s.englishName}</span>
                  <p className="font-mono text-xs mt-2 text-muted-foreground">{count} {t.photographyCatalog.works}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Works in array order */}
        <section className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {photographyWorks.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default PhotographyCatalog;
