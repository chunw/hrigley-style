import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { photographyWorks, seriesList, catalogMeta, type PhotographyWork } from "@/lib/photography";
import { useLanguage } from "@/contexts/LanguageContext";


const WorkCard = ({ work, uniformHeight }: { work: PhotographyWork; uniformHeight: boolean }) => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const padded = work.id.padStart(2, "0");
  const title = lang === "zh" ? (work.titleZh ?? work.title) : work.title;
  const series = seriesList.find((s) => s.id === work.series);

  const [objPos, setObjPos] = useState(work.cropPosition ?? { x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    startObjX: number;
    startObjY: number;
    containerW: number;
    containerH: number;
    moved: boolean;
  } | null>(null);

  useEffect(() => {
    if (!uniformHeight) {
      setObjPos(work.cropPosition ?? { x: 50, y: 50 });
      return;
    }
    const onMouseMove = (e: MouseEvent) => {
      if (!drag.current?.active) return;
      const dx = e.clientX - drag.current.startX;
      const dy = e.clientY - drag.current.startY;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) drag.current.moved = true;
      const x = Math.max(0, Math.min(100, drag.current.startObjX - (dx / drag.current.containerW) * 100));
      const y = Math.max(0, Math.min(100, drag.current.startObjY - (dy / drag.current.containerH) * 100));
      setObjPos({ x, y });
    };
    const onMouseUp = () => {
      if (drag.current) drag.current.active = false;
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [uniformHeight]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!uniformHeight) return;
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    drag.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      startObjX: objPos.x,
      startObjY: objPos.y,
      containerW: rect.width,
      containerH: rect.height,
      moved: false,
    };
  };

  const handleClick = (e: React.MouseEvent) => {
    if (drag.current?.moved) {
      e.preventDefault();
      return;
    }
    navigate(`/photography/${work.id}`);
  };

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

      <div
        ref={containerRef}
        className="block relative border border-border overflow-hidden"
        style={{
          backgroundColor: "#111",
          minHeight: "2rem",
          ...(uniformHeight ? { height: 280, cursor: "grab" } : {}),
        }}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
      >
        <img
          src={`/photography/${padded}/main.jpg`}
          alt={work.title}
          draggable={false}
          style={{
            display: "block",
            width: "100%",
            height: uniformHeight ? "100%" : "auto",
            objectFit: uniformHeight ? "cover" : undefined,
            objectPosition: uniformHeight ? `${objPos.x}% ${objPos.y}%` : undefined,
            opacity: 0,
            transition: "opacity 0.2s",
            userSelect: "none",
          }}
          onLoad={(e) => {
            (e.target as HTMLImageElement).style.opacity = "1";
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        {uniformHeight && (Math.round(objPos.x) !== 50 || Math.round(objPos.y) !== 50) && (
          <div style={{
            position: "absolute", bottom: 6, right: 6,
            fontFamily: "monospace", fontSize: 9, letterSpacing: "0.08em",
            color: "#fff", background: "rgba(0,0,0,0.55)",
            padding: "2px 6px", pointerEvents: "none",
          }}>
            {Math.round(objPos.x)}% {Math.round(objPos.y)}%
          </div>
        )}
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

const PhotographyCatalog = () => {
  const { lang, t } = useLanguage();
  const [uniformHeight, setUniformHeight] = useState(true);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-10 py-10 md:py-14">

        <div className="relative z-10 mb-6">
          <Link to="/catalogs" className="font-helvetica text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Art Catalogs
          </Link>
        </div>

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
                    <p key={i} className="description-html text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: para }} />
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
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setUniformHeight((v) => !v)}
              className={`font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 border transition-colors ${
                uniformHeight
                  ? "border-primary text-primary bg-primary/10"
                  : "border-border text-muted-foreground hover:text-primary hover:border-primary"
              }`}
            >
              {uniformHeight ? "View Original Image Height" : "Uniform Height"}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {photographyWorks.map((work) => (
              <WorkCard key={work.id} work={work} uniformHeight={uniformHeight} />
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default PhotographyCatalog;
