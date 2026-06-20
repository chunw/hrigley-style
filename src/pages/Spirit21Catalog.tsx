import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { spiritWorks, catalogMeta, type SpiritWork } from "@/lib/21spirit";
import { seriesIntro } from "@/lib/constants";
import { useLanguage } from "@/contexts/LanguageContext";

function renderInlineMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}


const WorkCard = ({ work }: { work: SpiritWork }) => {
  const { lang } = useLanguage();
  const padded = work.id.padStart(2, "0");
  const title = lang === "zh" ? (work.titleZh ?? work.title) : work.title;

  return (
    <article>
      <div className="flex justify-between items-center mb-2">
        <span className="font-mono text-xs">S{padded}</span>
      </div>

      <Link
        to={`/21spirit/${work.id}`}
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

const Spirit21Catalog = () => {
  const { lang, t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-10 py-10 md:py-14">

        {/* Catalog header */}
        <header className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <h1 className="shop-title text-6xl md:text-7xl leading-none">Chun Wang</h1>
            <p className="mt-3 text-4xl">{t.spirit21Catalog.subtitle}</p>
            <p className="font-mono text-xs text-muted-foreground/60 mt-1">
              {lang === "zh" ? catalogMeta.mediumZh : catalogMeta.medium}
            </p>
            <p className="font-mono text-xs text-muted-foreground/60 mt-1">
              {spiritWorks.length} {t.spirit21Catalog.works}
            </p>
            {catalogMeta.description && (
              <p className="text-sm text-muted-foreground mt-3 max-w-prose">
                {lang === "zh" ? (catalogMeta.descriptionZh ?? catalogMeta.description) : catalogMeta.description}
              </p>
            )}
          </div>
        </header>

        {/* Series intro */}
        <div className="mt-8 max-w-prose space-y-4 text-sm text-muted-foreground">
          {(lang === "zh" ? seriesIntro.zh : seriesIntro.en)
            .split("\n\n")
            .map((para, i) => (
              <p key={i}>{renderInlineMarkdown(para)}</p>
            ))}
        </div>

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
