import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { remainsWorks, type RemainsWork } from "@/lib/remains";
import { useLanguage } from "@/contexts/LanguageContext";
import { buildCombinedPrintHTML } from "@/lib/printCatalog";


const WorkCard = ({ work }: { work: RemainsWork }) => {
  const { lang } = useLanguage();
  const padded = work.id.padStart(2, "0");
  const title = lang === "zh" ? (work.titleZh ?? work.title) : work.title;

  return (
    <article>
      <div className="flex justify-between items-center mb-2">
        <span className="font-mono text-xs">R{padded}</span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Remains · 遗存
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
          src={`/remains/${padded}/main.jpg`}
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
// Page component
// ---------------------------------------------------------------------------

const RemainsCatalog = () => {
  const { lang } = useLanguage();

  const handlePrint = () => {
    const blob = new Blob([buildCombinedPrintHTML(window.location.origin, lang)], { type: "text/html" });
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
            <p className="mt-3 text-4xl">{lang === "zh" ? "遗存" : "Remains"}</p>
            <p className="font-mono text-xs text-muted-foreground/60 mt-1">
              {remainsWorks.length} {lang === "zh" ? "件作品" : "works"}
            </p>
          </div>
        </header>

        {/* Works grid */}
        <section className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {remainsWorks.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default RemainsCatalog;
