import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./photobook-print.css";

// ── Cargo CDN image paths ──────────────────────────────────────────────────────
const CDN = "https://freight.cargo.site";

const IMGS = {
  cover: `${CDN}/w/1920/q/75/i/F1824870955058396920018707674354/chun.png`,

  doppelganger: [
    `${CDN}/w/586/q/75/i/U1824528236855620981664530298098/Wang_PolaroidStudy2.jpg`,
    `${CDN}/w/1500/q/75/i/T1824529500549823751137363752178/group-3.JPEG`,
    `${CDN}/w/936/q/75/i/U1824568775383503877627742516466/238274869_5930384967035749_4739715939466583831_n.jpg`,
  ],

  lonelyHour: [
    "/photography/02/main.jpg",
    "/photography/02/1.png",
    "/photography/02/2.png",
    "/photography/02/3.jpg",
    "/photography/02/4.jpg",
    "/photography/02/5.jpg",
    "/photography/02/6.jpg",
    "/photography/02/7.jpg",
    "/photography/02/8.jpg",
  ],

  puppetry: [
    `${CDN}/w/1080/q/75/i/S1824562787717951504096964375794/263364969_137691385299181_8417519640618276339_n.jpg`,
    `${CDN}/w/1080/q/75/i/R1824562787607271039654707066098/257467093_577517436884770_4157324737680949849_n.jpg`,
  ],

  rebirth: [
    "/photography/03/main.jpg",
    "/photography/03/2.jpg",
    "/photography/03/3.jpg",
    "/photography/03/4.jpg",
    "/photography/03/5.jpg",
    "/photography/03/6.jpg",
    "/photography/03/7.jpg",
  ],

  beingAndTime: [
    "/photography/04/main.jpg",
    "/photography/04/1.png",
    "/photography/04/2.png",
    "/photography/04/3.png",
  ],

  aquiNoHaySoledad: [
    "/photography/06/main.jpg",
    "/photography/06/1.jpg",
    "/photography/06/2.jpg",
  ],

  archive5to9: [
    "/photography/07/main.jpg",
    "/photography/07/1.jpg",
    "/photography/07/2.jpg",
    "/photography/07/3.jpg",
    "/photography/07/4.jpg",
    "/photography/07/5.jpg",
    "/photography/07/6.jpg",
    "/photography/07/7.jpg",
    "/photography/07/8.jpg",
  ],

  deathValley: [
    "/photography/05/main.jpg",
    "/photography/05/1.jpg",
    "/photography/05/2.jpg",
    "/photography/05/3.jpg",
    "/photography/05/4.jpg",
  ],

  nostalgia: ["/photography/08/main.jpg"],
};

// ── Section IDs & labels ──────────────────────────────────────────────────────
const SECTION_IDS = [
  "cover",
  "toc",
  "el-otro-header",
  "el-otro-intro",
  "doppelganger",
  "lonely-hour",
  "puppetry",
  "rebirth",
  "being-and-time",
  "nostalgia",
  "departures-header",
  "aqui-no-hay-soledad",
  "archive-5-to-9",
  "death-valley",
  "about",
] as const;

type SectionId = (typeof SECTION_IDS)[number];

const SECTION_LABELS: Record<SectionId, string> = {
  cover: "",
  toc: "Table of Contents",
  "el-otro-header": "El Otro, El Mismo",
  "el-otro-intro": "El Otro, El Mismo",
  doppelganger: "Doppelgänger",
  "lonely-hour": "In The Lonely Hour",
  puppetry: "Puppetry",
  rebirth: "Rebirth",
  "being-and-time": "Being And Time",
  "departures-header": "All the world is a stage",
  "aqui-no-hay-soledad": "Aquí No Hay Soledad",
  "archive-5-to-9": "Archive from 5 to 9",
  "death-valley": "Reflection In The Death Valley",
  nostalgia: "Nostalgia",
  about: "About",
};

// ── Utility: lazy-loading image ───────────────────────────────────────────────
function PBImg({
  src,
  alt = "",
  className = "",
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <img
      src={src}
      alt={alt}
      className={`transition-opacity duration-700 ${visible ? "opacity-100" : "opacity-0"} ${className}`}
      onLoad={() => setVisible(true)}
      onError={() => setFailed(true)}
    />
  );
}

// ── Divider line ──────────────────────────────────────────────────────────────
function Divider() {
  return <div className="w-full h-px bg-white/10" />;
}

// ── Cover ─────────────────────────────────────────────────────────────────────
function Cover() {
  return (
    <section
      id="cover"
      className="pb-full-page relative flex flex-col items-start justify-between min-h-screen bg-black overflow-hidden px-10 md:px-20 py-14"
    >
      <img
        src={IMGS.cover}
        alt=""
        className="pb-cover-bg absolute inset-0 w-full h-full object-cover object-center opacity-30"
      />

      {/* Top row */}
      <div className="relative z-10 flex w-full justify-between items-start">
        <span className="font-mono text-[10px] tracking-[0.35em] text-white/40 uppercase">
          Chun Wang
        </span>
        <span className="font-mono text-[10px] tracking-[0.35em] text-white/40 uppercase">
          Photography Portfolio
        </span>
      </div>

      {/* Center title */}
      <div className="relative z-10 w-full">
        <h1
          className="shop-title leading-none text-white"
          style={{ fontSize: "clamp(3.5rem, 12vw, 10rem)" }}
        >
          Visions In
          <br />
          Photography
        </h1>
      </div>

      {/* Bottom row */}
      <div className="relative z-10 flex w-full justify-between items-end">
        <button
          data-noprint
          onClick={() =>
            document
              .getElementById("toc")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="font-mono text-[10px] tracking-[0.35em] text-white/40 uppercase hover:text-white/70 transition-colors"
        >
          start reading ↓
        </button>
        <span className="font-mono text-[10px] tracking-[0.35em] text-white/30 uppercase">
          2019-2026
        </span>
      </div>
    </section>
  );
}

// ── Table of Contents ─────────────────────────────────────────────────────────
function TableOfContents() {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  const chapters = [
    {
      id: "el-otro-header",
      roman: "I",
      title: "El Otro, El Mismo",
      subtitle: "Portraits & Self-Portraits",
      works: [
        "Doppelgänger",
        "In The Lonely Hour",
        "Puppetry",
        "Rebirth",
        "Being And Time",
        "Nostalgia",
      ],
    },
    {
      id: "departures-header",
      roman: "II",
      title: "All the world is a stage",
      subtitle: "Travel Monologue",
      works: [
        "Aquí No Hay Soledad",
        "Archive from 5 to 9",
        "Reflection In The Death Valley",
      ],
    },
    { id: "about", roman: "III", title: "About", subtitle: "", works: [] },
  ];

  return (
    <section
      id="toc"
      className="pb-page pb-full-page min-h-screen bg-black flex flex-col justify-center px-10 md:px-20 py-24"
    >
      <p className="font-mono text-[10px] tracking-[0.4em] text-white/30 uppercase mb-14">
        Table of Contents
      </p>

      <div className="space-y-10">
        {chapters.map(({ id, roman, title, subtitle, works }) => (
          <div key={id} className="group">
            <button
              onClick={() => scrollTo(id)}
              className="flex items-baseline gap-8 text-left w-full"
            >
              <span className="font-mono text-[10px] text-white/25 w-6 shrink-0">
                {roman}
              </span>
              <div className="flex-1">
                <h2
                  className="shop-title text-white group-hover:text-primary transition-colors leading-none"
                  style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)" }}
                >
                  {title}
                </h2>
                {subtitle && (
                  <p className="font-mono text-[10px] text-white/35 mt-1.5 tracking-widest">
                    {subtitle}
                  </p>
                )}
                {works.length > 0 && (
                  <p className="font-mono text-[10px] text-white/20 mt-1">
                    {works.join(" · ")}
                  </p>
                )}
              </div>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Chapter header ────────────────────────────────────────────────────────────
function ChapterHeader({
  id,
  number,
  title,
  subtitle,
}: {
  id: string;
  number: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section
      id={id}
      className="pb-recto pb-full-page min-h-screen bg-black flex flex-col justify-end px-10 md:px-20 pb-20"
    >
      <Divider />
      <div className="pt-12 flex items-end justify-between flex-wrap gap-6">
        <div>
          <p className="font-mono text-[10px] tracking-[0.4em] text-white/30 uppercase mb-5">
            Chapter {number}
          </p>
          <h2
            className="shop-title leading-none text-white"
            style={{ fontSize: "clamp(3.5rem, 10vw, 9rem)" }}
          >
            {title}
          </h2>
          {subtitle && (
            <p className="font-mono text-xs text-white/40 mt-3 tracking-widest">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

// ── El Otro, El Mismo — Intro ─────────────────────────────────────────────────
function ElOtroIntro() {
  return (
    <section
      id="el-otro-intro"
      className="pb-page bg-black px-10 md:px-20 py-24 md:py-32"
    >
      <div className="max-w-prose">
        <p className="font-mono text-[10px] tracking-[0.4em] text-white/30 uppercase mb-10">
          Artist Statement
        </p>

        <blockquote
          className="text-white/90 leading-relaxed mb-10 italic"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(1.2rem, 2.5vw, 1.7rem)",
          }}
        >
          "I aim to capture the essence of human experience in my photographs,
          exploring fundamental concerns such as mortality, solitude, freedom,
          and meaning of life — truths of life that shape our existential
          conflicts."
        </blockquote>

        <p className="font-mono text-[10px] text-white/30 mb-16">— Chun Wang</p>

        <div
          className="space-y-8 text-white/65 leading-relaxed"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1rem" }}
        >
          <p>
            The title of the series{" "}
            <em className="text-white/80">"El Otro, El Mismo"</em> is derived
            from Jorge Luis Borges' book of the same name, which translates to{" "}
            <em>"The Other, The Same."</em>
          </p>

          <p>
            According to Dr. Yalom, there are four ultimate concerns of
            existence:
          </p>

          <div className="pl-6 border-l border-white/15 space-y-6">
            {[
              {
                label: "Death.",
                text: 'We exist now, but one day, this existence will end. Death will arrive as scheduled, with no escape. In the words of Spinoza, "Every thing strives to persist in its own being" — and a core conflict of existence is the tension between the awareness of the inevitability of death and the desire to continue living.',
              },
              {
                label: "Freedom.",
                text: "Freedom, paradoxically, implies a terrifying responsibility: we have no pre-given structure, no design, no purpose — we are the sole authors of our own existence.",
              },
              {
                label: "Isolation.",
                text: "No matter how close we become to another, there always remains a last unbridgeable gap. We enter life alone and must depart it alone.",
              },
              {
                label: "Meaninglessness.",
                text: "If we must die, if we are each alone, if we have no pre-given purpose — then what meaning does life have? We must construct our own meaning.",
              },
            ].map(({ label, text }) => (
              <div key={label}>
                <p className="font-mono text-[10px] tracking-widest text-white/50 uppercase mb-2">
                  {label}
                </p>
                <p>{text}</p>
              </div>
            ))}
          </div>

          <p className="font-mono text-[10px] text-white/25">
            [1] Yalom, Irvin D. <em>Existential Psychotherapy</em>. New York:
            Basic Books, 1980.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Work section layouts ──────────────────────────────────────────────────────
type Layout = "single" | "two-col" | "three-col" | "grid" | "strip" | "large-with-three";

function ImageBlock({
  images,
  title,
  layout,
}: {
  images: string[];
  title: string;
  layout: Layout;
}) {
  if (layout === "single") {
    return (
      <div className="w-full">
        <PBImg src={images[0]} alt={title} className="w-full h-auto" />
      </div>
    );
  }

  if (layout === "two-col") {
    return (
      <div className="grid grid-cols-2 gap-0.5">
        {images.slice(0, 2).map((src, i) => (
          <PBImg
            key={i}
            src={src}
            alt={`${title} ${i + 1}`}
            className="w-full h-auto"
          />
        ))}
      </div>
    );
  }

  if (layout === "three-col") {
    return (
      <div className="grid grid-cols-3 gap-0.5">
        {images.slice(0, 3).map((src, i) => (
          <PBImg
            key={i}
            src={src}
            alt={`${title} ${i + 1}`}
            className="w-full h-auto"
          />
        ))}
      </div>
    );
  }

  if (layout === "grid") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0.5">
        {images.map((src, i) => (
          <PBImg
            key={i}
            src={src}
            alt={`${title} ${i + 1}`}
            className="w-full h-auto"
          />
        ))}
      </div>
    );
  }

  if (layout === "strip") {
    return (
      <div className="pb-strip-wrapper overflow-x-auto">
        <div className="pb-strip-track flex gap-0.5 w-max">
          {images.map((src, i) => (
            <div key={i} className="pb-strip-item shrink-0 w-[42vw] md:w-[28vw]">
              <PBImg
                src={src}
                alt={`${title} ${i + 1}`}
                className="w-full h-auto"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (layout === "large-with-three") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5">
        <div className="md:col-span-2">
          <PBImg src={images[0]} alt={title} className="w-full h-full object-cover" />
        </div>
        <div className="grid grid-rows-3 gap-0.5">
          {images.slice(1, 4).map((src, i) => (
            <PBImg
              key={i}
              src={src}
              alt={`${title} ${i + 2}`}
              className="w-full h-full object-cover"
            />
          ))}
        </div>
      </div>
    );
  }

  return null;
}

// ── Generic work section ──────────────────────────────────────────────────────
function WorkSection({
  id,
  title,
  year,
  medium,
  location,
  description,
  images,
  layout,
}: {
  id: string;
  title: string;
  year?: string;
  medium?: string;
  location?: string;
  description: React.ReactNode;
  images: string[];
  layout: Layout;
}) {
  return (
    <section id={id} className="pb-page bg-black py-20 md:py-28">
      {/* Header */}
      <div className="px-10 md:px-20 mb-12">
        <h3
          className="shop-title leading-none text-white"
          style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
        >
          {title}
        </h3>
        <div className="flex flex-wrap gap-6 mt-3">
          {year && (
            <span className="font-mono text-[10px] text-white/35 tracking-widest">
              {year}
            </span>
          )}
          {medium && (
            <span className="font-mono text-[10px] text-white/35 tracking-widest">
              {medium}
            </span>
          )}
          {location && (
            <span className="font-mono text-[10px] text-white/35 tracking-widest">
              {location}
            </span>
          )}
        </div>
      </div>

      {/* Images */}
      <div
        className={`pb-no-break ${layout === "strip" ? "" : "px-10 md:px-20"}`}
      >
        <ImageBlock images={images} title={title} layout={layout} />
      </div>

      {/* Description */}
      <div className="px-10 md:px-20 mt-12 max-w-prose">
        <div
          className="description-html text-white/60 leading-relaxed text-sm"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1rem" }}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>

      <div className="px-10 md:px-20 mt-16">
        <Divider />
      </div>
    </section>
  );
}

// ── Nostalgia ─────────────────────────────────────────────────────────────────
function Nostalgia() {
  return (
    <section id="nostalgia" className="pb-page bg-black py-20 md:py-28">
      <div className="px-10 md:px-20 mb-14">
        <p className="font-mono text-[10px] tracking-[0.4em] text-white/30 uppercase mb-5">
          Chapter I · El Otro, El Mismo
        </p>
        <h2
          className="shop-title leading-none text-white"
          style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
        >
          Nostalgia
        </h2>
        <p
          className="mt-3"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "1.1rem",
            color: "rgba(255,255,255,0.4)",
            fontStyle: "italic",
          }}
        >
          For The Pre-iPhone Era (2018)
        </p>
      </div>

      <div className="px-10 md:px-20">
        <PBImg
          src={IMGS.nostalgia[0]}
          alt="Nostalgia For The Pre-iPhone Era"
          className="w-full max-w-2xl h-auto"
        />
      </div>

      <div className="px-10 md:px-20 mt-16">
        <Divider />
      </div>
    </section>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────
function About() {
  const honors = [
    {
      year: "2025",
      text: "18th International Color Awards Honorable Mention · Portrait · Hours, Minutes",
    },
    {
      year: "2024",
      text: "London International Creative Competition (LICC) Shortlist · Photo/Video · Highland Scottlands: The heroism of the vista",
    },
    {
      year: "2023",
      text: "16th International Color Awards Official Nominee · Portrait · In The Lonely Hour",
    },
    {
      year: "2022",
      text: "International Photography Awards (IPA 2022) Official Selection · In The Lonely Hour",
    },
    {
      year: "2022",
      text: "15th International Color Awards Winner & Honorable Mention · Portrait · Self Portrait",
    },
    {
      year: "2022",
      text: "15th International Color Awards Official Nominee · Portrait · Metaphor",
    },
    {
      year: "2022",
      text: "15th International Color Awards Official Nominee · Fine Art · Rebirth",
    },
    {
      year: "2022",
      text: "Moscow International Foto Award Honorable Mentions · Self Portrait, Polaroid Study",
    },
    {
      year: "2022",
      text: "Passepartout Photo Prize Winner of Catalogue Prize · The Other, The Same photo series",
    },
    {
      year: "2022",
      text: "Siena International Photo Awards Finalist · Fascinating Faces And Characters · Self Portrait",
    },
    {
      year: "2021",
      text: "London International Creative Competition Official Selection · Photo/Video · The Other, The Same",
    },
  ];

  return (
    <section
      id="about"
      className="pb-page pb-full-page bg-black px-10 md:px-20 py-24 md:py-32 min-h-screen flex flex-col justify-center"
    >
      <p className="font-mono text-[10px] tracking-[0.4em] text-white/30 uppercase mb-12">
        Chapter III · About
      </p>

      <div className="max-w-prose">
        <p
          className="text-white/80 leading-relaxed mb-16"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
          }}
        >
          Chun Wang lives and works in New York. Besides creating photographs,
          she also paints.
        </p>

        <p className="font-mono text-[10px] tracking-[0.4em] text-white/30 uppercase mb-8">
          Honors & Recognition
        </p>

        <ul className="space-y-5">
          {honors.map(({ year, text }, i) => (
            <li key={i} className="flex gap-6 items-baseline">
              <span className="font-mono text-[10px] text-white/25 shrink-0 w-10">
                {year}
              </span>
              <span
                className="text-white/55 text-sm leading-relaxed"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                {text}
              </span>
            </li>
          ))}
        </ul>

        <div data-noprint className="mt-20 pt-10 border-t border-white/10 flex flex-wrap gap-6">
          <Link
            to="/photography-catalog"
            className="font-mono text-[10px] tracking-[0.3em] text-white/30 uppercase hover:text-white/60 transition-colors"
          >
            ← Photography Catalog
          </Link>
          <Link
            to="/"
            className="font-mono text-[10px] tracking-[0.3em] text-white/30 uppercase hover:text-white/60 transition-colors"
          >
            ← Home
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function PhotographyPhotobook() {
  const [activeSection, setActiveSection] = useState<SectionId>("cover");

  useEffect(() => {
    // Force all images visible and set the PDF document title before the
    // print dialog renders.
    const originalTitle = document.title;
    function onBeforePrint() {
      const d = new Date();
      const stamp =
        String(d.getFullYear()) +
        String(d.getMonth() + 1).padStart(2, "0") +
        String(d.getDate()).padStart(2, "0");
      document.title = `Chun Wang Photobook ${stamp}`;
      document.querySelectorAll<HTMLImageElement>("img").forEach((img) => {
        img.style.opacity = "1";
        img.style.transition = "none";
      });
    }
    function onAfterPrint() {
      document.title = originalTitle;
    }
    window.addEventListener("beforeprint", onBeforePrint);
    window.addEventListener("afterprint", onAfterPrint);
    return () => {
      window.removeEventListener("beforeprint", onBeforePrint);
      window.removeEventListener("afterprint", onAfterPrint);
    };
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
      );

      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Fixed nav — hidden in print */}
      <nav data-noprint className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-black/70 backdrop-blur-md border-b border-white/5">
        <Link
          to="/photography-catalog"
          className="font-mono text-[10px] tracking-[0.3em] text-white/35 uppercase hover:text-white/70 transition-colors"
        >
          ← Photography
        </Link>
        <div className="flex items-center gap-8">
          <p className="font-mono text-[10px] tracking-[0.2em] text-white/35 uppercase truncate max-w-[40vw] text-right">
            {SECTION_LABELS[activeSection]}
          </p>
          <button
            onClick={() => window.print()}
            className="font-mono text-[10px] tracking-[0.3em] text-white/35 uppercase hover:text-white/70 transition-colors"
          >
            Print ↗
          </button>
        </div>
      </nav>

      {/* Sections */}
      <Cover />
      <TableOfContents />

      {/* ── Chapter I: El Otro, El Mismo ── */}
      <ChapterHeader
        id="el-otro-header"
        number="I"
        title="El Otro, El Mismo"
        subtitle="Portraits & Self-Portraits · 2021–2024"
      />

      <ElOtroIntro />

      <WorkSection
        id="doppelganger"
        title="Doppelgänger"
        year="2022"
        medium="Polaroid · giclée (archival pigment) print · 40 cm × 30.25 cm · Ed. 2 + AP"
        images={IMGS.doppelganger}
        layout="three-col"
        description={
          <>
            <p className="mb-4">
              In a series of Polaroid photos, my friend Junyi and I were taking
              turns to wear the same dress and pose for the other. She gave me
              an evocative gaze that I felt as if a real soul connection was
              happening when I took this snapshot.
            </p>
            <p>
              It was as if we were not just mirroring each other's physical
              presence but also touching upon the deeper essence of the
              Doppelgänger, where our identities blurred and intertwined,
              revealing the profound interconnectedness and duality of our
              beings. In the vast array of symbols that populate our visual
              landscape, mirrors and doubles particularly resonate with me —
              they reflect the idea that we are not isolated beings.
            </p>
          </>
        }
      />

      <WorkSection
        id="lonely-hour"
        title="In The Lonely Hour"
        medium="Self Portrait · giclée (archival pigment) print · 70 × 50 cm · Ed. 2 + AP"
        images={IMGS.lonelyHour}
        layout="large-with-three"
        description={
          <>
            <p className="mb-4">
              <em>In The Lonely Hour</em> is a self-portrait in double
              exposure, enhanced with digital painting. The curtain of reality
              sometimes pulls back, allowing us a glimpse of the backstage
              structure.
            </p>
            <p className="mb-4">
              I believe every introspective individual has experienced such
              moments: a sense of alienation emerges, all meaning is stripped
              from things, symbols completely disintegrate, and the individual
              detaches from that familiar safe anchor. In these moments, there
              is profound existential pain, and the relationship between people
              and the world is severely shaken.
            </p>
            <p>
              Otto Rank believes that the process of growth is a process of
              separation, autonomy, self-reliance, independence,
              individualization, becoming oneself, and being independent. Not
              separating means not growing, and the cost of separation and
              growth is loneliness.
            </p>
          </>
        }
      />

      <WorkSection
        id="puppetry"
        title="Puppetry"
        year="2022"
        images={IMGS.puppetry}
        layout="two-col"
        description={
          <>
            <p className="mb-4">
              Paradise, Lost Paradise. Crossing the valley of youthful
              innocence, do you still remember that carefree shade of green?
              Has your Oscar Wilde died? Has your Godot arrived?
            </p>
            <p className="mb-4">
              In this journey from innocence to experience, we grapple with the
              paradoxes of freedom and control. The unrestrained freedom of
              youth often gives way to the realization of the forces that seek
              to control and shape us. We confront the loss of naive liberty
              and face the complexities of being both the agents of control and
              those controlled by societal norms, expectations, and the passage
              of time. Amidst these transitions, we strive to reclaim our
              autonomy and redefine what it means to be free.
            </p>
            <p className="font-mono text-xs text-white/40 tracking-widest">
              Published in the{" "}
              <a
                href="https://artsinsquare.com/photo-book-2"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/70 transition-colors"
              >
                5×7 PHOTO BOOK VOLUME II
              </a>{" "}
              by Artsin Square
            </p>
          </>
        }
      />

      <WorkSection
        id="rebirth"
        title="Rebirth"
        medium="giclée (archival pigment) print · 50 × 70 cm · Ed. 2 + AP"
        images={IMGS.rebirth}
        layout="strip"
        description={
          <>
            <p className="mb-4">
              Coffin. Womb. Life. Death. Rebirth. Fear. Anxiety. Beauty?
            </p>
            <p className="mb-4">
              In ancient Egypt, pharaohs crossed their arms diagonally when
              they were mummified, symbolizing Osiris, the king of the
              netherworld or god of the dead. Crossed arms indicated the
              mummy's gender — only males were mummified with their arms
              crossed.
            </p>
            <p>
              Here, my female model perverts this context and embodies an
              otherworldly sense of renewal.
            </p>
          </>
        }
      />

      <WorkSection
        id="being-and-time"
        title="Being And Time"
        year="2024"
        medium="Hours, Minutes · giclée (archival pigment) print · 46 × 65 cm · Ed. 2 + AP"
        images={IMGS.beingAndTime}
        layout="grid"
        description={
          <>
            <p className="mb-4">
              Taking the title from <em>Being and Time</em> (
              <em>Sein und Zeit</em>), Heidegger's seminal work, these
              portraits encapsulate a moment suspended, where light and shadows
              forge a clock upon pensive visages.
            </p>
            <p className="mb-4">
              This imagery subtly alludes to our profound bond with time — each
              face a ticking clock, etched by life's flux.
            </p>
            <blockquote className="pl-4 border-l border-white/15 text-white/40 italic mb-4">
              "The old woman walked on the quiet street, swinging her large
              men's shoes. This is time, bare and raw time. It slowly comes
              into being; it makes you wait, but when it arrives, you feel
              nauseous because you realize it has always been here."
              <br />
              <span className="not-italic text-white/25 text-xs mt-2 block">
                — Jean-Paul Sartre, <em>Nausea</em>
              </span>
            </blockquote>
            <p className="font-mono text-[10px] text-white/25">
              Exhibition: <em>El Otro, El Mismo — Hours, Minutes</em>. PH21
              Gallery, Budapest, 2024.
            </p>
            <p className="font-mono text-xs text-white/40 tracking-widest mt-4">
              Published in the{" "}
              <a
                href="https://artsinsquare.com/photo-book-1"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/70 transition-colors"
              >
                5×7 PHOTO BOOK VOLUME I
              </a>{" "}
              by Artsin Square
            </p>
          </>
        }
      />

      <Nostalgia />

      {/* ── Chapter II: All the world is a stage ── */}
      <ChapterHeader
        id="departures-header"
        number="II"
        title="All the world is a stage"
        subtitle="Travel Monologue · 2017–2021"
      />

      <WorkSection
        id="aqui-no-hay-soledad"
        title="Aquí No Hay Soledad"
        year="2019"
        location="New York, USA"
        images={IMGS.aquiNoHaySoledad}
        layout="two-col"
        description={
          <p>
            There is no loneliness here. New York, 2019 — the city as stage,
            the street as theater. Every corner a cast of characters, every
            crowd a confirmation: you are never truly alone.
          </p>
        }
      />

      <WorkSection
        id="archive-5-to-9"
        title="Archive from 5 to 9"
        year="2021"
        location="Sahara, Morocco"
        images={IMGS.archive5to9}
        layout="grid"
        description={
          <p>
            Sahara from 6 to 10: An Archive. Morocco, 2021 — light changes
            slowly in the desert. From the blue hour before dawn through the
            burning midday, each frame in this archive captures the passage of
            time across a vast, ancient silence.
          </p>
        }
      />

      <WorkSection
        id="death-valley"
        title="Reflection In The Death Valley"
        year="2017"
        location="Death Valley, USA"
        images={IMGS.deathValley}
        layout="strip"
        description={
          <>
            <p className="mb-4">
              Death Valley, 2017. At Badwater Basin — the lowest point in North
              America — the salt flats become mirrors at dawn, doubling the sky
              and dissolving the boundary between earth and atmosphere. To stand
              here is to stand at the threshold of something larger than
              oneself.
            </p>
            <p className="font-mono text-xs text-white/40 tracking-widest">
              <a
                href="https://sfmoma.tumblr.com/post/169630613975/reflections-in-the-death-valley-chun-wang/amp"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/70 transition-colors"
              >
                SFMOMA
              </a>
              {" · "}
              <a
                href="https://www.lensculture.com/projects/1619117-reflections-in-death-valley"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/70 transition-colors"
              >
                LENSCULTURE
              </a>
            </p>
          </>
        }
      />

      {/* ── Chapter III: About ── */}
      <About />
    </div>
  );
}
