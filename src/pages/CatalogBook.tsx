import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Printer } from "lucide-react";
import "./catalog-book.css";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageMeta } from "@/hooks/usePageMeta";
import { artistBioHTML, artistBioSegments } from "@/lib/artistBio";
import { SHOP_URL, SITE_URL } from "@/lib/constants";
import { getCombinedCatalogSections, type CatalogItem, type CatalogSectionKey } from "@/lib/printCatalog";
import type { Translations } from "@/lib/translations";

// ── Book geometry ─────────────────────────────────────────────────────────────
// US Letter trim so the PDF prints 1:1 on a home/office printer, and matches the standard
// 8.5 × 11 in portrait size offered by print-on-demand services (Lulu, Blurb, IngramSpark).
const TRIM_W = 8.5;
const TRIM_H = 11;
const BLEED = 0.125;
const PX_PER_IN = 96;
// Interior page counts are padded to a multiple of 4 (one printed signature).
const SIGNATURE = 4;
// The first List of Plates page also carries the section title, so it holds fewer rows.
const INDEX_ROWS_FIRST = 19;
const INDEX_ROWS_REST = 24;

// Spine width estimate for a perfect-bound paperback on ~80# (120gsm) uncoated stock:
// pages / 444 in + 0.06 in for the cover board. Swap in your printer's own formula.
const spineWidth = (pages: number) => Math.round((pages / 444 + 0.06) * 1000) / 1000;

type Part = "complete" | "interior" | "cover";
type Side = "verso" | "recto" | "single";

interface Chapter {
  key: CatalogSectionKey;
  number: number;
  title: string;
  descriptionHtml: string;
  items: { item: CatalogItem; plate: number }[];
  years: string;
}

type PageSpec =
  | { kind: "half-title" }
  | { kind: "frontispiece"; item: CatalogItem }
  | { kind: "title" }
  | { kind: "colophon" }
  | { kind: "contents" }
  | { kind: "preface"; chunk: number }
  | { kind: "opener"; half: "left" | "right"; chapter: Chapter }
  | { kind: "essay"; chapter: Chapter }
  | { kind: "plate"; chapter: Chapter; item: CatalogItem; plate: number }
  | { kind: "about" }
  | { kind: "plates-index"; from: number; to: number }
  | { kind: "blank" }
  | { kind: "end" };

interface InteriorPage {
  spec: PageSpec;
  number: number;
}

const CHAPTER_TITLE: Record<CatalogSectionKey, (t: Translations) => string> = {
  spirit: (t) => t.spirit21Catalog.subtitle,
  remains: (t) => t.remainsCatalog.subtitle,
  watercolor: (t) => t.watercolorCatalog.subtitle,
  photography: (t) => t.photographyCatalog.subtitle,
  shop: (t) => t.usefulCatalog.subtitle,
};

function yearRange(years: (string | null | undefined)[]): string {
  const all = years.flatMap((y) => (y ?? "").match(/\d{4}/g) ?? []).map(Number);
  if (all.length === 0) return "";
  const min = Math.min(...all);
  const max = Math.max(...all);
  return min === max ? String(min) : `${min}–${max}`;
}

/**
 * Font size (in) for an uppercase Gloria Hallelujah display title: shrinks with title length so
 * `text` fits within `lineInches` of total line length. ~0.8em per glyph including tracking.
 */
const displaySize = (text: string, lineInches: number, max: number) =>
  `${Math.min(max, lineInches / (Math.max(text.length, 4) * 0.8)).toFixed(2)}in`;

const pad2 = (n: number) => String(n).padStart(2, "0");
const plainText = (html: string) => html.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

/** Split paragraphs into page-sized chunks of at most ~maxChars each. */
function chunkParagraphs(paras: readonly string[], maxChars: number): string[][] {
  const chunks: string[][] = [];
  let cur: string[] = [];
  let len = 0;
  for (const p of paras) {
    if (cur.length > 0 && len + p.length > maxChars) {
      chunks.push(cur);
      cur = [];
      len = 0;
    }
    cur.push(p);
    len += p.length;
  }
  if (cur.length > 0) chunks.push(cur);
  return chunks;
}

// ── Pagination ────────────────────────────────────────────────────────────────
// Odd pages are rectos (right-hand), even pages versos. Chapter openers are two-page spreads,
// so they must start on a verso; a blank is inserted before them whenever needed.
function paginate(chapters: Chapter[], frontispiece: CatalogItem | undefined, plateCount: number, prefaceChunkCount: number): InteriorPage[] {
  const specs: PageSpec[] = [];
  const nextIsVerso = () => (specs.length + 1) % 2 === 0;

  specs.push({ kind: "half-title" });
  specs.push(frontispiece ? { kind: "frontispiece", item: frontispiece } : { kind: "blank" });
  specs.push({ kind: "title" });
  specs.push({ kind: "colophon" });
  specs.push({ kind: "contents" });
  for (let i = 0; i < prefaceChunkCount; i++) specs.push({ kind: "preface", chunk: i });

  for (const chapter of chapters) {
    if (!nextIsVerso()) specs.push({ kind: "blank" });
    specs.push({ kind: "opener", half: "left", chapter });
    specs.push({ kind: "opener", half: "right", chapter });
    specs.push({ kind: "essay", chapter });
    for (const { item, plate } of chapter.items) specs.push({ kind: "plate", chapter, item, plate });
  }

  // Back matter opens on a recto, as is conventional.
  if (nextIsVerso()) specs.push({ kind: "blank" });
  specs.push({ kind: "about" });
  if (!nextIsVerso()) specs.push({ kind: "blank" });
  for (let from = 1; from <= plateCount; ) {
    const to = Math.min(plateCount, from + (from === 1 ? INDEX_ROWS_FIRST : INDEX_ROWS_REST) - 1);
    specs.push({ kind: "plates-index", from, to });
    from = to + 1;
  }

  // Closing page sits on the final (verso) page of the last signature.
  while ((specs.length + 1) % SIGNATURE !== 0) specs.push({ kind: "blank" });
  specs.push({ kind: "end" });

  return specs.map((spec, i) => ({ spec, number: i + 1 }));
}

// ── Shared pieces ─────────────────────────────────────────────────────────────
function Crosshair() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1" />
      <line x1="8" y1="0.5" x2="8" y2="3.5" stroke="currentColor" strokeWidth="1" />
      <line x1="8" y1="12.5" x2="8" y2="15.5" stroke="currentColor" strokeWidth="1" />
      <line x1="0.5" y1="8" x2="3.5" y2="8" stroke="currentColor" strokeWidth="1" />
      <line x1="12.5" y1="8" x2="15.5" y2="8" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/** <img> that falls back to `fallback` (e.g. a work's main.jpg) and then hides itself if both fail. */
function BookImage({ src, fallback, alt = "", className, style }: { src: string; fallback?: string; alt?: string; className?: string; style?: CSSProperties }) {
  const [current, setCurrent] = useState(src);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setCurrent(src);
    setFailed(false);
  }, [src]);
  if (failed || !current) return null;
  return (
    <img
      src={current}
      alt={alt}
      className={className}
      style={style}
      loading="eager"
      decoding="sync"
      onError={() => (fallback && current !== fallback ? setCurrent(fallback) : setFailed(true))}
    />
  );
}

function Page({ side, tone = "paper", className = "", children }: { side: Side; tone?: "paper" | "ink" | "accent"; className?: string; children?: ReactNode }) {
  return <section className={`bk-page bk-${side} bk-tone-${tone} ${className}`}>{children}</section>;
}

function RunningHead({ side, left, right }: { side: Side; left: string; right: string }) {
  return <div className="bk-runhead">{side === "verso" ? left : right}</div>;
}

function Folio({ number, tag }: { number: number; tag?: string }) {
  return (
    <>
      {tag && <div className="bk-folio-tag">{tag}</div>}
      <div className="bk-folio">
        {pad2(number)} <Crosshair />
      </div>
    </>
  );
}

/**
 * The layered collage from the /catalogs tiles: a back image (top right) sits behind the
 * title block, a front image (top left) rests on top of it, both feathered out at the bottom.
 */
function Collage({ front, back, title, titleSize, above, below }: { front?: CatalogItem; back?: CatalogItem; title: ReactNode; titleSize: string; above?: ReactNode; below?: ReactNode }) {
  return (
    <div className="bk-collage">
      {back && (
        <div className="bk-collage-back">
          <BookImage src={back.image_url} fallback={back.fallback_image_url} alt={back.title} />
        </div>
      )}
      <div className="bk-collage-titleblock">
        {above}
        <h2 className="bk-collage-title shop-title gloria-title" style={{ fontSize: titleSize }}>
          {title}
        </h2>
        {below}
      </div>
      {front && (
        <div className="bk-collage-front">
          <BookImage src={front.image_url} fallback={front.fallback_image_url} alt={front.title} />
        </div>
      )}
    </div>
  );
}

// ── Covers ────────────────────────────────────────────────────────────────────
interface BookContext {
  t: Translations;
  lang: "en" | "zh";
  chapters: Chapter[];
  years: string;
  coverFront?: CatalogItem;
  coverBack?: CatalogItem;
  prefaceChunks: string[][];
}

function FrontCoverFace({ ctx }: { ctx: BookContext }) {
  const { t, years } = ctx;
  return (
    <div className="bk-face bk-face-front">
      <Collage
        front={ctx.coverFront}
        back={ctx.coverBack}
        title={t.catalogBook.title}
        titleSize={displaySize(t.catalogBook.title, 7.2, 1.6)}
        above={
          <div className="bk-collage-row">
            <span>{ctx.lang === "zh" ? "王淳" : "Chun Wang"}</span>
            <span>{years}</span>
          </div>
        }
        below={<div className="bk-face-sub sans-label">{t.catalogBook.subtitle}</div>}
      />
    </div>
  );
}

function BackCoverFace({ ctx }: { ctx: BookContext }) {
  const { t, lang, chapters } = ctx;
  const blurb = plainText(artistBioSegments[lang].intro.split("<br><br>")[0]);
  return (
    <div className="bk-face bk-face-back">
      <div className="bk-face-eyebrow">
        <span>{t.catalogBook.publisher}</span>
        <span>{t.catalogBook.city}</span>
      </div>
      <div className="bk-back-body">
        <p className="bk-back-blurb">{blurb}</p>
        <ul className="bk-back-chapters">
          {chapters.map((c) => (
            <li key={c.key}>
              <span className="bk-num-box">{pad2(c.number)}</span>
              <span className="shop-title gloria-title">{c.title}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bk-back-foot">
        <div className="bk-back-mark shop-title gloria-title">{t.catalogBook.publisher}</div>
        <div className="bk-back-urls">
          {SITE_URL.replace(/^https?:\/\/|\/$/g, "")} · {SHOP_URL.replace(/^https?:\/\/|\/$/g, "")}
        </div>
      </div>
    </div>
  );
}

function SpineFace({ ctx, width }: { ctx: BookContext; width: number }) {
  // Below ~1/4 in most printers won't allow spine text.
  if (width < 0.25) return <div className="bk-spine" />;
  return (
    <div className="bk-spine">
      <div className="bk-spine-text">
        <span className="shop-title gloria-title">{ctx.lang === "zh" ? "王淳" : "Chun Wang"}</span>
        <span className="bk-spine-dot">·</span>
        <span className="shop-title gloria-title">{ctx.t.catalogBook.title}</span>
      </div>
    </div>
  );
}

// ── Interior pages ────────────────────────────────────────────────────────────
function InteriorPageView({ page, ctx, pages }: { page: InteriorPage; ctx: BookContext; pages: InteriorPage[] }) {
  const { spec, number } = page;
  const { t, lang, chapters, years } = ctx;
  const b = t.catalogBook;
  const side: Side = number % 2 === 0 ? "verso" : "recto";
  const author = lang === "zh" ? "王淳" : "Chun Wang";
  const bookHead = `${author} — ${b.title}`;

  switch (spec.kind) {
    case "half-title":
      return (
        <Page side={side} className="bk-center">
          <div className="bk-half-title shop-title">{b.title}</div>
        </Page>
      );

    case "frontispiece":
      return (
        <Page side={side} tone="ink">
          <div className="bk-frontis">
            <BookImage src={spec.item.image_url} fallback={spec.item.fallback_image_url} alt={spec.item.title} />
          </div>
          <div className="bk-frontis-caption">
            {b.frontispiece} · <span className="product-title">{spec.item.title}</span>
            {spec.item.year ? `, ${spec.item.year}` : ""}
          </div>
        </Page>
      );

    case "title":
      return (
        <Page side={side} className="bk-title-page">
          <div className="bk-eyebrow">
            {b.publisher}
            <br />
            {b.city}
          </div>
          <div className="bk-title-body">
            <div className="bk-title-author sans-label">{author}</div>
            <h1 className="bk-title-main shop-title gloria-title" style={{ fontSize: displaySize(b.title, 6.8, 1.35) }}>
              {b.title}
            </h1>
            <div className="bk-rule" />
            <div className="bk-title-meta">
              <span className="sans-label">{b.subtitle}</span>
              <span>{years}</span>
            </div>
          </div>
        </Page>
      );

    case "colophon": {
      const year = new Date().getFullYear();
      return (
        <Page side={side} className="bk-colophon">
          <div className="bk-colophon-body">
            <p className="bk-colophon-title shop-title">{b.title}</p>
            <p>{b.subtitle} · {years}</p>
            <p>© {year} {author}. {b.rights}</p>
            <p>{b.artworkCredit}</p>
            <p>{b.design} {b.typeset}</p>
            <p>
              {b.publisher}, {b.city}
              <br />
              {SITE_URL.replace(/^https?:\/\/|\/$/g, "")} · {SHOP_URL.replace(/^https?:\/\/|\/$/g, "")}
            </p>
            <p>
              {b.edition}, {year}
            </p>
          </div>
        </Page>
      );
    }

    case "contents": {
      const startOf = (pred: (s: PageSpec) => boolean) => pages.find((p) => pred(p.spec))?.number ?? 0;
      const rows = [
        { num: "", title: b.preface, sub: "", page: startOf((s) => s.kind === "preface") },
        ...chapters.map((c) => ({
          num: pad2(c.number),
          title: c.title,
          sub: `${c.items.length} ${b.works}${c.years ? ` · ${c.years}` : ""}`,
          page: startOf((s) => s.kind === "opener" && s.chapter.key === c.key),
        })),
        { num: "", title: b.aboutArtist, sub: "", page: startOf((s) => s.kind === "about") },
        { num: "", title: b.listOfPlates, sub: "", page: startOf((s) => s.kind === "plates-index") },
      ];
      return (
        <Page side={side}>
          <div className="bk-eyebrow">{b.contents}</div>
          <div className="bk-contents">
            <h2 className="bk-section-title shop-title gloria-title">{b.contents}</h2>
            <ol>
              {rows.map((r) => (
                <li key={r.title}>
                  <span className="bk-contents-num">{r.num && <span className="bk-num-box">{r.num}</span>}</span>
                  <span className="bk-contents-title">
                    <span className="shop-title">{r.title}</span>
                    {r.sub && <span className="bk-contents-sub">{r.sub}</span>}
                  </span>
                  <span className="bk-contents-page">{pad2(r.page)}</span>
                </li>
              ))}
            </ol>
          </div>
        </Page>
      );
    }

    case "preface": {
      const paras = ctx.prefaceChunks[spec.chunk] ?? [];
      const long = paras.join("").length > 1400;
      return (
        <Page side={side}>
          <RunningHead side={side} left={bookHead} right={b.preface} />
          <div className="bk-essay">
            {spec.chunk === 0 && (
              <div className="bk-essay-head">
                <h2 className="bk-section-title shop-title gloria-title">{b.preface}</h2>
              </div>
            )}
            <div className={`bk-essay-text description-html ${long ? "bk-essay-long" : ""}`}>
              {paras.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
          <Folio number={number} tag={`${b.title} | ${b.preface}`} />
        </Page>
      );
    }

    case "opener": {
      const { chapter, half } = spec;
      const front = chapter.items[0]?.item;
      const back = chapter.items[1]?.item ?? front;
      return (
        <Page side={side} tone="ink" className={`bk-opener bk-opener-${half}`}>
          <div className="bk-spread-canvas">
            <Collage
              front={front}
              back={back}
              title={chapter.title}
              // Two lines across the ~16 in spread at most.
              titleSize={displaySize(chapter.title, 2 * 15.5, 1.9)}
              above={
                <div className="bk-collage-row">
                  <span className="bk-opener-label">
                    <span className="bk-num-box">{pad2(chapter.number)}</span>
                    {b.chapter.replace("{n}", pad2(chapter.number))}
                  </span>
                  <span>
                    {chapter.items.length} {b.works}
                    {chapter.years ? ` · ${chapter.years}` : ""}
                  </span>
                </div>
              }
            />
          </div>
        </Page>
      );
    }

    case "essay": {
      const { chapter } = spec;
      const first = chapter.items[0]?.plate;
      const last = chapter.items[chapter.items.length - 1]?.plate;
      const long = plainText(chapter.descriptionHtml).length > 1400;
      return (
        <Page side={side}>
          <RunningHead side={side} left={bookHead} right={chapter.title} />
          <div className="bk-essay">
            <div className="bk-essay-head">
              <span className="bk-num-box">{pad2(chapter.number)}</span>
              <h2 className="bk-section-title shop-title">{chapter.title}</h2>
              <div className="bk-essay-meta sans-label">
                {chapter.items.length} {b.works}
                {chapter.years ? ` · ${chapter.years}` : ""}
                {first ? ` · ${b.plates} ${first}–${last}` : ""}
              </div>
            </div>
            <div className={`bk-essay-text description-html ${long ? "bk-essay-long" : ""}`} dangerouslySetInnerHTML={{ __html: chapter.descriptionHtml }} />
          </div>
          <Folio number={number} tag={`${b.title} | ${chapter.title}`} />
        </Page>
      );
    }

    case "plate": {
      const { item, chapter, plate } = spec;
      return (
        <Page side={side} className="bk-plate-page">
          <RunningHead side={side} left={bookHead} right={chapter.title} />
          <div className="bk-plate-frame">
            <BookImage src={item.image_url} fallback={item.fallback_image_url} alt={item.title} />
          </div>
          <div className="bk-caption">
            <div className="bk-caption-num">
              {b.plate} {pad2(plate)}
            </div>
            <div className="bk-caption-body">
              <div className="bk-caption-title product-title">{item.title}</div>
              {(item.metaLine || item.dimensions) && (
                <div className="bk-caption-meta">{[item.metaLine, item.dimensions].filter(Boolean).join(" · ")}</div>
              )}
              {item.description && <div className="bk-caption-desc description-html" dangerouslySetInnerHTML={{ __html: item.description }} />}
            </div>
          </div>
          <Folio number={number} tag={`${b.title} | ${chapter.title}`} />
        </Page>
      );
    }

    case "about":
      return (
        <Page side={side}>
          <RunningHead side={side} left={bookHead} right={b.aboutArtist} />
          <div className="bk-essay">
            <div className="bk-essay-head">
              <div className="bk-essay-meta sans-label">{b.aboutArtist}</div>
              <h2 className="bk-section-title shop-title gloria-title">{author}</h2>
            </div>
            <div className="bk-essay-text description-html" dangerouslySetInnerHTML={{ __html: artistBioHTML(lang) }} />
          </div>
          <Folio number={number} tag={`${b.title} | ${b.aboutArtist}`} />
        </Page>
      );

    case "plates-index": {
      const plateRows = chapters.flatMap((c) =>
        c.items.filter(({ plate }) => plate >= spec.from && plate <= spec.to).map(({ item, plate }) => ({
          item,
          plate,
          chapter: c.title,
          page: pages.find((p) => p.spec.kind === "plate" && p.spec.plate === plate)?.number ?? 0,
        })),
      );
      return (
        <Page side={side}>
          <RunningHead side={side} left={bookHead} right={b.listOfPlates} />
          <div className="bk-index">
            {spec.from === 1 && <h2 className="bk-section-title shop-title gloria-title">{b.listOfPlates}</h2>}
            <table>
              <thead>
                <tr>
                  <th>{b.plate}</th>
                  <th />
                  <th />
                  <th>{b.page}</th>
                </tr>
              </thead>
              <tbody>
                {plateRows.map((r) => (
                  <tr key={r.plate}>
                    <td className="bk-index-num">{pad2(r.plate)}</td>
                    <td className="bk-index-title product-title">{r.item.title}</td>
                    <td className="bk-index-meta">{[r.item.metaLine ?? r.chapter, r.item.dimensions].filter(Boolean).join(" · ")}</td>
                    <td className="bk-index-page">{pad2(r.page)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Folio number={number} tag={`${b.title} | ${b.listOfPlates}`} />
        </Page>
      );
    }

    case "end":
      return (
        <Page side={side} className="bk-center">
          <div className="bk-end">
            <div className="shop-title gloria-title">{b.publisher}</div>
            <div className="bk-end-sub">
              {b.city} · {years}
            </div>
          </div>
        </Page>
      );

    case "blank":
      return <Page side={side} />;
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────
type Sheet = { key: string; side: Side; node: ReactNode };

/** Groups sheets into what you see when the book lies open: covers alone, everything else as verso|recto spreads. */
function toSpreads(sheets: Sheet[]): (Sheet | null)[][] {
  const rows: (Sheet | null)[][] = [];
  for (const sheet of sheets) {
    const last = rows[rows.length - 1];
    if (sheet.side === "single") rows.push([sheet]);
    else if (sheet.side === "verso") rows.push([sheet]);
    else if (last && last.length === 1 && last[0]?.side === "verso") last.push(sheet);
    else rows.push([null, sheet]);
  }
  return rows.map((row) => (row.length === 1 && row[0]?.side === "verso" ? [row[0], null] : row));
}

async function waitForAssets(root: HTMLElement) {
  await document.fonts.ready;
  // A few passes: a failed image may swap to its fallback src after the first round settles.
  for (let pass = 0; pass < 3; pass++) {
    const pending = Array.from(root.querySelectorAll("img")).filter((img) => !img.complete);
    if (pending.length === 0) return;
    await Promise.all(
      pending.map(
        (img) =>
          new Promise<void>((resolve) => {
            img.addEventListener("load", () => resolve(), { once: true });
            img.addEventListener("error", () => resolve(), { once: true });
          }),
      ),
    );
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}

const CatalogBook = () => {
  const { lang, toggleLang, t } = useLanguage();
  const b = t.catalogBook;
  const [part, setPart] = useState<Part>("complete");
  const [bleed, setBleed] = useState(false);
  const [cream, setCream] = useState(true);
  const [preparing, setPreparing] = useState(false);
  const [zoom, setZoom] = useState(1);
  const stageRef = useRef<HTMLDivElement>(null);

  usePageMeta({
    title: `${b.title} — ${b.cta}`,
    description: "Remains, a print-ready art book by Chun Wang. Covers and interior pages laid out for PDF export.",
    path: "/catalogs/book",
    noindex: true,
  });

  const ctx = useMemo<BookContext>(() => {
    let plate = 0;
    const chapters: Chapter[] = getCombinedCatalogSections("", lang)
      .filter((s) => s.items.length > 0)
      .map((s, i) => ({
        key: s.key,
        number: i + 1,
        title: CHAPTER_TITLE[s.key](t),
        // Sections without an essay of their own fall back to the copy the site already uses for them.
        descriptionHtml:
          s.key === "remains"
            ? t.catalogBook.remainsEssayBody.map((p) => `<p>${p}</p>`).join("")
            : s.descriptionHtml ||
              (s.key === "watercolor" ? `<p>${t.watercolorCatalog.noteText}</p>` : s.key === "shop" ? `<p>${t.hero.description}</p>` : ""),
        items: s.items.map((item) => ({ item: { ...item, title: item.title || t.catalogBook.untitled }, plate: ++plate })),
        years: yearRange(s.items.map((item) => item.year)),
      }));
    const byKey = (key: CatalogSectionKey) => chapters.find((c) => c.key === key)?.items.map((i) => i.item) ?? [];
    return {
      t,
      lang,
      chapters,
      prefaceChunks: chunkParagraphs(t.catalogBook.prefaceBody, 1500),
      years: yearRange(chapters.flatMap((c) => c.items.map((i) => i.item.year))),
      coverFront: byKey("watercolor")[0] ?? chapters[0]?.items[0]?.item,
      coverBack: byKey("photography")[0] ?? chapters[0]?.items[1]?.item,
    };
  }, [lang, t]);

  const plateCount = ctx.chapters.reduce((sum, c) => sum + c.items.length, 0);
  const frontispiece = ctx.chapters.find((c) => c.key === "photography")?.items[1]?.item ?? ctx.coverBack;
  const pages = useMemo(() => paginate(ctx.chapters, frontispiece, plateCount, ctx.prefaceChunks.length), [ctx, frontispiece, plateCount]);
  const spine = spineWidth(pages.length);

  const bleedIn = bleed ? BLEED : 0;
  const pageW = TRIM_W + 2 * bleedIn;
  const pageH = TRIM_H + 2 * bleedIn;
  const wrapW = 2 * TRIM_W + spine + 2 * bleedIn;
  const sheetW = part === "cover" ? wrapW : pageW;

  const sheets: Sheet[] = useMemo(() => {
    if (part === "cover") {
      return [
        {
          key: "wrap",
          side: "single",
          node: (
            <section className="bk-page bk-wrap bk-tone-ink">
              <div className="bk-wrap-back"><BackCoverFace ctx={ctx} /></div>
              <div className="bk-wrap-spine"><SpineFace ctx={ctx} width={spine} /></div>
              <div className="bk-wrap-front"><FrontCoverFace ctx={ctx} /></div>
            </section>
          ),
        },
      ];
    }
    const interior: Sheet[] = pages.map((p) => ({
      key: `p${p.number}`,
      side: p.number % 2 === 0 ? "verso" : "recto",
      node: <InteriorPageView page={p} ctx={ctx} pages={pages} />,
    }));
    if (part === "interior") return interior;
    return [
      { key: "front", side: "single", node: <section className="bk-page bk-single bk-tone-ink"><FrontCoverFace ctx={ctx} /></section> },
      { key: "ifc", side: "verso", node: <Page side="verso" tone="accent" /> },
      ...interior,
      { key: "ibc", side: "recto", node: <Page side="recto" tone="accent" /> },
      { key: "back", side: "single", node: <section className="bk-page bk-single bk-tone-ink"><BackCoverFace ctx={ctx} /></section> },
    ];
  }, [part, pages, ctx, spine]);

  // Scale the on-screen preview so a full spread (or the cover wrap) fits the viewport width.
  useEffect(() => {
    const update = () => {
      const rowWidthPx = (part === "cover" ? wrapW : 2 * pageW) * PX_PER_IN;
      setZoom(Math.min(1, (window.innerWidth - 32) / rowWidthPx));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [part, pageW, wrapW]);

  const handleSave = async () => {
    if (!stageRef.current) return;
    setPreparing(true);
    try {
      await waitForAssets(stageRef.current);
    } finally {
      setPreparing(false);
    }
    window.print();
  };

  const rootStyle = {
    "--bleed": `${bleedIn}in`,
    "--spine": `${spine}in`,
    "--sheet-w": `${sheetW}in`,
    "--sheet-h": `${pageH}in`,
  } as CSSProperties;

  const partLabels: Record<Part, string> = { complete: b.partComplete, interior: b.partInterior, cover: b.partCover };
  const toggleClass = (on: boolean) =>
    `sans-label font-normal text-xs uppercase tracking-widest px-3 py-2 border transition-colors ${
      on ? "border-foreground bg-foreground text-background" : "border-border hover:text-primary"
    }`;

  return (
    <div className={`bk-root ${cream ? "bk-cream" : ""}`} style={rootStyle}>
      {/* One @page size per export: interior/complete pages, or the wide cover wrap. */}
      <style>{`@page { size: ${sheetW}in ${pageH}in; margin: 0; }`}</style>

      <div data-noprint className="bk-toolbar border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/catalogs"
            className="sans-label font-normal inline-flex items-center gap-2 text-xs uppercase tracking-widest transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t.footer.navCatalogs}
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex">
              {(["complete", "interior", "cover"] as const).map((p) => (
                <button key={p} type="button" onClick={() => setPart(p)} className={`${toggleClass(part === p)} -ml-px first:ml-0`}>
                  {partLabels[p]}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setBleed((v) => !v)} className={toggleClass(bleed)}>
              {b.bleed} {BLEED}in
            </button>
            <button type="button" onClick={() => setCream((v) => !v)} className={toggleClass(cream)}>
              {b.creamPaper}
            </button>
            <button type="button" onClick={toggleLang} className={toggleClass(false)}>
              {lang === "en" ? "中文" : "EN"}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={preparing}
              className="sans-label inline-flex items-center gap-2 text-xs uppercase tracking-widest px-4 py-2 bg-primary text-primary-foreground disabled:opacity-60"
            >
              <Printer className="h-4 w-4" />
              {preparing ? b.preparing : b.savePdf}
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3 flex flex-wrap justify-between gap-2 text-[11px] uppercase tracking-[0.18em] text-foreground/60">
          <span>
            {part === "cover" ? `${wrapW.toFixed(3)} × ${pageH.toFixed(3)} in` : `${pageW} × ${pageH} in`} · {pages.length} {b.pagesShort} · {b.spine}{" "}
            {spine.toFixed(3)} in
          </span>
          <span className="normal-case tracking-normal">{b.printHint}</span>
        </div>
      </div>

      <div ref={stageRef} className="bk-stage" style={{ zoom }}>
        {toSpreads(sheets).map((row, i) => (
          <div key={i} className={`bk-spread ${row.length === 1 && row[0]?.side === "single" ? "bk-spread-single" : ""}`}>
            {row.map((sheet, j) =>
              sheet ? <div key={sheet.key} className="bk-sheet">{sheet.node}</div> : <div key={`gap-${j}`} className="bk-sheet bk-sheet-empty" data-noprint />,
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatalogBook;
