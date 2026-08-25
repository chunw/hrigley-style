import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { remainsWorks, catalogMeta, type RemainsWork } from "@/lib/remains";
import { useLanguage } from "@/contexts/LanguageContext";
import { products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useImageHoverExpand } from "@/hooks/useImageHoverExpand";

const printPacket = products.find((p) => p.id === "remains-fine-art-print-packet");

const WorkCard = ({ work }: { work: RemainsWork }) => {
  const { lang } = useLanguage();
  const padded = work.id.padStart(2, "0");
  const title = lang === "zh" ? (work.titleZh ?? work.title) : work.title;
  const { imgRef, imgStyle, hoverHandlers, wrapperHoverClassName } = useImageHoverExpand("contain");

  return (
    <article>
      <div className="flex justify-between items-center mb-2">
        <span className="font-mono text-xs">R{padded}</span>
      </div>

      <Link
        to={`/remains/${work.id}`}
        className={`block relative overflow-hidden border border-border ${wrapperHoverClassName}`}
        style={{
          aspectRatio: "8.5/11",
          backgroundColor: "#111",
        }}
        {...hoverHandlers}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40">
            {padded}
          </span>
        </div>

        <img
          ref={imgRef}
          src={`/remains/${padded}/main.jpg`}
          alt={work.title}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            opacity: 0,
            ...imgStyle,
            transition: `opacity 0.2s, ${imgStyle.transition}`,
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
        <h3 className="text-sm leading-snug product-title">{title}</h3>
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

  usePageMeta({
    title: lang === "zh" ? catalogMeta.zh : `${catalogMeta.en} — Surreal Mixed-Media Wall Art & Prints`,
    description: lang === "zh"
      ? catalogMeta.descriptionZh
      : "Remains — a humorous, surreal mixed-media series recombining ancient terracotta figures into contemporary life. Original art and fine art prints, perfect as a unique gift.",
    image: "/remains/01/main.jpg",
    path: "/remains-catalog",
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-10 py-10 md:py-14">

        <div className="relative z-10 mb-6">
          <Link to="/catalogs" className="font-helvetica text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Catalogs
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
              is_active={printPacket.is_active}
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
