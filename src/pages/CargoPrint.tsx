import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { photographyWorks } from "@/lib/photography";
import "./cargo-print.css";

// Discover all images for a folder by probing until a 404.
// Mirrors the same logic in PhotographyDetail.
const MAX_IMAGES = 20;

async function discoverImages(folder: string): Promise<string[]> {
  const candidates = [
    `/photography/${folder}/main.jpg`,
    ...Array.from({ length: MAX_IMAGES }, (_, i) => `/photography/${folder}/${i + 1}.jpg`),
    ...Array.from({ length: MAX_IMAGES }, (_, i) => `/photography/${folder}/${i + 1}.png`),
  ];
  const results = await Promise.all(
    candidates.map(
      (src) =>
        new Promise<string | null>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(src);
          img.onerror = () => resolve(null);
          img.src = src;
        })
    )
  );
  // deduplicate (png/jpg probes may both pass if server is lenient) and filter nulls
  const seen = new Set<string>();
  return results.filter((s): s is string => {
    if (!s) return false;
    const base = s.replace(/\.(jpg|png)$/, "");
    if (seen.has(base)) return false;
    seen.add(base);
    return true;
  });
}

interface SeriesData {
  folder: string;
  id: string;
  title: string;
  year: string;
  images: string[];
}

// One page of the book: shows all images for one series.
function SeriesPage({ series }: { series: SeriesData }) {
  const { folder, id, title, year, images } = series;
  const mainImg = images[0] ?? null;
  const subImgs = images.slice(1);

  return (
    <div
      className="page-slot"
      style={{
        width: "50%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "5%",
        boxSizing: "border-box",
        background: "#fff",
        overflow: "hidden",
        gap: 12,
      }}
    >
      {/* header */}
      <div style={{ flexShrink: 0 }}>
        <p style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: "#aaa", margin: 0 }}>
          PH{folder}
        </p>
        {title && (
          <p style={{ fontFamily: "monospace", fontSize: 11, color: "#333", margin: "2px 0 0", letterSpacing: "0.05em" }}>
            {title}{year ? ` · ${year}` : ""}
          </p>
        )}
      </div>

      {/* main image */}
      {mainImg && (
        <div style={{ flex: "0 0 auto", maxHeight: "55%", display: "flex", alignItems: "flex-start" }}>
          <img
            src={mainImg}
            alt={title || folder}
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }}
          />
        </div>
      )}

      {/* sub-images grid */}
      {subImgs.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(subImgs.length, 4)}, 1fr)`,
            gap: 4,
            flex: "1 1 0",
            overflow: "hidden",
            alignContent: "start",
          }}
        >
          {subImgs.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`${title} ${i + 1}`}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", maxHeight: 120 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// A spread = 2 series side by side = 1 landscape print page.
function Spread({ left, right, index }: { left: SeriesData; right: SeriesData | null; index: number }) {
  return (
    <div
      className="spread"
      style={{
        display: "flex",
        width: "100%",
        aspectRatio: "11 / 8.5",
        background: "#fff",
        border: "1px solid #e0e0e0",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* spine */}
      <div style={{ position: "absolute", top: "5%", left: "50%", width: 1, height: "90%", background: "#e0e0e0", zIndex: 1 }} />

      <SeriesPage series={left} />

      {right ? (
        <SeriesPage series={right} />
      ) : (
        <div style={{ width: "50%", background: "#fff" }} />
      )}
    </div>
  );
}

export default function CargoPrint() {
  const [allSeries, setAllSeries] = useState<SeriesData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const folders = photographyWorks.map((w) => w.id.padStart(2, "0"));

    Promise.all(
      folders.map(async (folder, i) => {
        const work = photographyWorks[i];
        const images = await discoverImages(folder);
        return { folder, id: work.id, title: work.title ?? "", year: work.year ?? "", images };
      })
    ).then((series) => {
      setAllSeries(series);
      setLoading(false);
    });
  }, []);

  // Pair series into spreads
  const spreads: [SeriesData, SeriesData | null][] = [];
  for (let i = 0; i < allSeries.length; i += 2) {
    spreads.push([allSeries[i], allSeries[i + 1] ?? null]);
  }

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh" }}>
      {/* toolbar */}
      <div
        className="no-print"
        style={{
          position: "sticky", top: 0, zIndex: 10, background: "#fff",
          borderBottom: "1px solid #e5e5e5", padding: "12px 24px",
          display: "flex", alignItems: "center", gap: 24,
        }}
      >
        <Link
          to="/photography-catalog"
          style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "#888", textDecoration: "none" }}
        >
          ← Catalog
        </Link>
        <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "#aaa" }}>
          {loading ? "Loading…" : `${allSeries.length} series · ${spreads.length} spreads`}
        </span>
        <button
          onClick={() => window.print()}
          disabled={loading}
          style={{
            marginLeft: "auto", fontFamily: "monospace", fontSize: 10,
            letterSpacing: "0.3em", textTransform: "uppercase",
            background: loading ? "#ccc" : "#111", color: "#fff",
            border: "none", padding: "8px 20px", cursor: loading ? "default" : "pointer",
          }}
        >
          {loading ? "Loading images…" : "Print / Save as PDF"}
        </button>
      </div>

      {/* spreads */}
      <div style={{ padding: "32px 24px", display: "flex", flexDirection: "column", gap: 32, maxWidth: 1100, margin: "0 auto" }}>
        {spreads.map(([left, right], i) => (
          <Spread key={i} left={left} right={right} index={i} />
        ))}
      </div>
    </div>
  );
}
