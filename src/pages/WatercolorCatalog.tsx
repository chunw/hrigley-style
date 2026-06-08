import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { watercolors, seriesList, type Watercolor } from "@/lib/watercolors";

const HIGHLIGHTED = new Set(["1", "9"]);

const WorkCard = ({ work }: { work: Watercolor }) => {
  const padded = work.id.padStart(2, "0");
  const highlighted = HIGHLIGHTED.has(work.id);
  const series = seriesList.find((s) => s.id === work.series);

  return (
    <article>
      <div className="flex justify-between items-center mb-2">
        <span className="font-mono text-xs">P{padded}</span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Series {work.series}
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
        {/* Placeholder — always visible until image loads */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40">
            Upload Image
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
        <p className="font-mono text-xs text-muted-foreground mt-1">{work.note}</p>
      </div>
    </article>
  );
};

const WatercolorCatalog = () => (
  <div className="min-h-screen bg-background text-foreground flex flex-col">
    <Header />

    <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-10 py-10 md:py-14">

      {/* Catalog header */}
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <h1 className="shop-title text-6xl md:text-7xl leading-none">Chun Wang</h1>
          <p className="mt-3 text-sm text-muted-foreground">Visions in Watercolor</p>
          <p className="font-mono text-xs text-muted-foreground/60 mt-1">
            {watercolors.length} works
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
              <p className="font-mono text-xs mt-2 text-muted-foreground">{s.subtitle}</p>
            </div>
          ))}
          <div className="py-6 px-1 md:px-6">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-xs tracking-widest">NOTE</span>
              <span className="text-2xl leading-none">物质性</span>
            </div>
            <p className="font-mono text-xs mt-2 text-muted-foreground">
              Watercolor remains a pursuit of materiality — especially now
            </p>
          </div>
        </div>
      </section>

      {/* Artist statement */}
      <section className="mt-16 border-t border-border pt-8">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <h2 className="shop-title text-2xl leading-tight">Artist Statement</h2>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mt-2">
              CHUN WANG · NEW YORK
            </p>
          </div>
          <div className="md:col-span-2 space-y-4 text-sm leading-relaxed">
            <p>At its core, watercolor remains a pursuit of materiality, especially now.</p>
            <p>水彩说到底还是一种对于物质性的追求，尤其是在今天这个时代。</p>
            <p>
              I run my home as my own private museum. It started with watercolor sketches,
              and my interest in the small trinkets scattered around the house has only grown
              since. These objects, sometimes a little grotesque, are pieces I've salvaged
              from all over for my collection. I often rearrange and combine them into new
              scenes where the imagination can play. As Wang Yuping said, art doesn't have
              to stand above life.
            </p>
            <p className="text-muted-foreground">
              我把家当作自己的"私人博物馆"来经营。从水彩速写开始，我对散落家中的小摆设的兴趣愈发增长。
              这些有时带有怪诞气息的物件，是我从各处打捞的馆藏，也会时常被我排列组合，形成新的景观现场，供想象力嬉戏。
              王玉平说，艺术不必高于生活。我相信日常小物也可以为观者带来新鲜的视觉体验与心理感受。
            </p>
          </div>
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

export default WatercolorCatalog;
