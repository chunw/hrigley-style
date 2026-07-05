import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { remainsWorks, catalogMeta, type RemainsWork } from "@/lib/remains";
import { seriesIntro } from "@/lib/constants";
import { useLanguage } from "@/contexts/LanguageContext";
import { products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

const printPacket = products.find((p) => p.id === "remains-fine-art-print-packet");

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



const WorkCard = ({ work }: { work: RemainsWork }) => {
  const { lang } = useLanguage();
  const padded = work.id.padStart(2, "0");
  const title = lang === "zh" ? (work.titleZh ?? work.title) : work.title;

  return (
    <article>
      <div className="flex justify-between items-center mb-2">
        <span className="font-mono text-xs">R{padded}</span>
      </div>

      <Link
        to={`/remains/${work.id}`}
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

const RemainsCatalog = () => {
  const { lang, t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-10 py-10 md:py-14">

        <div className="mb-6">
          <Link to="/catalogs" className="font-helvetica text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Art Catalogs
          </Link>
        </div>

        <header className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <h1 className="shop-title text-6xl md:text-7xl leading-none">Chun Wang</h1>
            <p className="mt-3 text-4xl">{t.remainsCatalog.subtitle}</p>
            <p className="font-mono text-xs text-muted-foreground/60 mt-1">
              {lang === "zh" ? catalogMeta.mediumZh : catalogMeta.medium}
            </p>
            <p className="font-mono text-xs text-muted-foreground/60 mt-1">
              {remainsWorks.length} {t.remainsCatalog.works}
            </p>
            {catalogMeta.description && (
              <p
                className="description-html text-sm text-muted-foreground mt-3 max-w-prose"
                dangerouslySetInnerHTML={{ __html: lang === "zh" ? (catalogMeta.descriptionZh ?? catalogMeta.description) : catalogMeta.description }}
              />
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

        {/* Print packet */}
        {printPacket && (
          <section className="mt-12 max-w-xs">
            <ProductCard
              id={printPacket.id}
              name={printPacket.name}
              title={printPacket.title}
              title_zh={printPacket.title_zh}
              description={printPacket.description}
              description_zh={printPacket.description_zh}
              price={printPacket.price}
              currency={printPacket.currency}
              image_url={printPacket.image_url}
              category={printPacket.category}
              category_zh={printPacket.category_zh}
              paylink={printPacket.paylink}
            />
          </section>
        )}

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
