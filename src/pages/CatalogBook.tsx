import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Printer } from "lucide-react";
import "./catalog-book.css";
import { usePageMeta } from "@/hooks/usePageMeta";
import { artistBioHTML } from "@/lib/artistBio";
import { SHOP_URL, SITE_URL } from "@/lib/constants";
import { getCombinedCatalogSections, type CatalogItem, type CatalogSection, type CatalogSectionKey } from "@/lib/printCatalog";
import { translations, type Translations } from "@/lib/translations";
import { PAGE_BACKGROUNDS, type PageBgKind } from "@/lib/pageBackgrounds";
import { BOOK_SERIES } from "@/lib/bookSeries";
import { SERIES_PLATES, DEATH_VALLEY_PLATES } from "@/lib/seriesPlates";
import { SPIRIT_BACKGROUNDS, SPIRIT_MOMENT } from "@/lib/spiritBackgrounds";
import { photographyWorks } from "@/lib/photography";
import { EXHIBITIONS } from "@/lib/exhibitions";

// ── Book geometry ─────────────────────────────────────────────────────────────
// US Letter trim so the PDF prints 1:1 on a home/office printer, and matches the standard
// 8.5 × 11 in portrait size offered by print-on-demand services (Lulu, Blurb, IngramSpark).
const TRIM_W = 8.5;
const TRIM_H = 11;
const BLEED = 0.125;
const PX_PER_IN = 96;
// Interior page counts are padded to a multiple of 4 (one printed signature).
const SIGNATURE = 4;
// Spine width estimate for a perfect-bound paperback on ~80# (120gsm) uncoated stock:
// pages / 444 in + 0.06 in for the cover board. Swap in your printer's own formula.
export const spineWidth = (pages: number) => Math.round((pages / 444 + 0.06) * 1000) / 1000;

type Part = "complete" | "interior" | "cover";
type Side = "verso" | "recto" | "single";

interface Chapter {
  key: string;
  number: number;
  title: string;
  descriptionHtml: string;
  items: { item: CatalogItem; plate: number }[];
  years: string;
  seriesOnly?: boolean;
  seriesTextId?: string;
  /** A chapter may hold back this many trailing essay chunks so paginate()
   * emits them right after the plate whose image_url matches, instead of
   * with the chapter's leading essays. Set where the chapter's essay chunks
   * are built (shop chapter only: the ceramics method note). */
  essayAfterPlate?: { imageUrl: string; trailingChunks: number };
}

type PageSpec =
  | { kind: "title" }
  | { kind: "colophon" }
  | { kind: "contents"; chunk: number }
  | { kind: "preface"; chunk: number }
  | { kind: "painting-intro"; chunk: number }
  | { kind: "opener"; half: "left" | "right"; chapter: Chapter }
  | { kind: "essay"; chapter: Chapter; chunk: number }
  | { kind: "exhibitions"; chapter: Chapter }
  | { kind: "plate"; chapter: Chapter; item: CatalogItem; plate: number }
  | { kind: "aphorism"; half: "left" | "right"; aphorism: Aphorism }
  | { kind: "about"; chunk: number }
  | { kind: "collage"; chunk: number }
  | { kind: "blank" }
  | { kind: "end" };

export interface InteriorPage {
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
const hasCjk = (s: string) => /[\u4e00-\u9fff]/.test(s);

/** Chapter opener spreads are uniformly black with white type
 *  (her direction, 2026-10-18); each chapter's epigraph sits in the
 *  spread's upper field (CHAPTER_EPIGRAPH below). */

/** One short epigraph per chapter, printed small in the upper field of
 *  the chapter's opener spread.
 *  Sourcing rule (her discipline): only lines that already stand in this book
 *  for that chapter — the chapter's own text, verbatim — or her own words.
 *  Nothing is written for the slot. Chapters whose book text carries no such
 *  line (Still Things, Unfinished Archive) get none. */
const CHAPTER_EPIGRAPH: Record<string, { en: string; zh: string }> = {
  spirit: {
    en: "This book is more than a retrospective. It is an argument for slowness, demanding the kind of looking that contemporary life rarely permits.",
    zh: "这本书不只是一次回顾。它为缓慢辩护，要求一种当代生活难得允许的凝视。",
  },
  remains: {
    en: "The figurines have outlasted an empire. They will probably outlast the video call.",
    zh: "陶俑熬过了一个帝国。它们大概也将熬过视频会议。",
  },
  residuals: {
    en: "Residuals is a watercolor series about the traces and objects of everyday life, and the beauty found in them.",
    zh: "《残留》是一个关于日常生活痕迹与物件的水彩系列，记下其中的美。",
  },
  road: {
    en: "The journeys end. The moments remain.",
    zh: "旅程会结束，瞬间留下来。",
  },
  innerwilderness: {
    en: "The land comes first — before language, before the self.",
    zh: "土地在先——在语言之前，在自我之前。",
  },
  deathvalley: {
    en: "The salt flats become mirrors at dawn, doubling the sky.",
    zh: "盐滩在黎明时分成为镜子，复制天空。",
  },
  sahara: {
    en: "An archive of the desert kept by the clock — hour by hour, from 6 to 10.",
    zh: "按钟点保存的沙漠档案——逐小时，从 6 点到 10 点。",
  },
  highlands: {
    en: "Scottish Highlands: Heroism of the Vista.",
    zh: "苏格兰高地：眺望的英雄主义。",
  },
  theater: {
    en: "Theatrical moments found on the street.",
    zh: "街头抓到的戏剧感瞬间。",
  },
  photography: {
    en: "We never meet ourselves directly. We arrive by way of other faces.",
    zh: "我们从不直接遇见自己，我们总是绕道他人的面孔抵达。",
  },
  "series:nostalgia": {
    en: "An online space for meditation and self-reflection.",
    zh: "一个用于冥想与自我反思的线上空间。",
  },
  shop: {
    en: "My ceramics begin as functional forms - a candle holder, a cup, a bowl - then leak into surreal landscapes.",
    zh: "我的陶艺从功能性的形态开始，一只烛台、一只杯子、一只碗，然后渗漏成超现实的风景。",
  },
  "series:immemory": {
    en: "When machines learn to create, what remains human?",
    zh: "当机器学会了创造，人身上还剩下什么？",
  },
  "series:negotiated": {
    en: "Who can we still be?",
    zh: "我们还能成为谁？",
  },
  "series:google": {
    en: "Your internet search history is a recycling bin for traces of intellectual and emotional output from your brain.",
    zh: "你的互联网搜索历史，是大脑智力与情感输出痕迹的回收箱。",
  },
  "series:feedscanner": {
    en: "On the Internet, I read a lot, but not really, anything.",
    zh: "在互联网上，我读了很多，但其实什么也没读到。",
  },
  "series:cavedance": {
    en: "To revive the music and dance depicted in the Dunhuang cave paintings.",
    zh: "让敦煌壁画中的音乐与舞蹈重现。",
  },
  "series:soliloquy": {
    en: "A temple for meditation and reflection.",
    zh: "一座冥想与自我反思的庙宇。",
  },
  "series:artempath": {
    en: "Opening dialogues between the artist and the viewer as well as among viewers themselves.",
    zh: "在艺术家与观众之间、观众与观众之间开启对话。",
  },
  "series:interview": {
    en: "Art, for me, is not just a form of expression but a mode of exploration and discovery.",
    zh: "对我来说，艺术不只是一种表达方式，更是一种探索与发现的方式。",
  },
};

/** Exhibition lines are free text carrying their date at the end; pull the year out
 *  to lead the line in bold, leaving the rest of the wording untouched. A range
 *  (2025 – 2026) leads with its first year and drops the range from the rest,
 *  and a 年 right after the year goes with it. */
function exhibitionParts(text: string): { year: string; rest: string } {
  const matches = [...text.matchAll(/\d{4}/g)];
  if (matches.length === 0) return { year: "", rest: text.trim() };
  const last = matches[matches.length - 1];
  const lastIdx = last.index ?? 0;
  const before = text.slice(0, lastIdx).replace(/\s+$/, "");
  let year = last[0];
  let cutStart = lastIdx;
  const cutEnd = lastIdx + 4;
  if ((before.endsWith("–") || before.endsWith("-") || before.endsWith("—")) && matches.length > 1) {
    year = matches[0][0];
    cutStart = matches[0].index ?? 0;
  }
  let tail = text.slice(cutEnd);
  if (tail.startsWith("年")) tail = tail.slice(1);
  const rest = (text.slice(0, cutStart) + tail)
    .replace(/\s+/g, " ")
    .replace(/,\s*,/g, ",")
    .replace(/^[\s,，、·–—-]+/, "")
    .replace(/[\s,，、·–—-]+$/, "")
    .trim();
  return { year, rest };
}

/** Split paragraphs into page-sized chunks of at most ~maxChars each. */

interface ParaItem {
  text: string;
  edit: string;
}

interface EssayItem {
  html: string;
  edit: string;
}

interface EssayChunk {
  items: EssayItem[];
}

/** Chunk paragraphs (carrying their source edit ids) by plain length. */
function chunkParas(paras: ParaItem[], maxChars: number): { paras: ParaItem[] }[] {
  const out: { paras: ParaItem[] }[] = [];
  let cur: ParaItem[] = [];
  let len = 0;
  for (const p of paras) {
    if (cur.length > 0 && len + p.text.length > maxChars) {
      out.push({ paras: cur });
      cur = [];
      len = 0;
    }
    cur.push(p);
    len += p.text.length;
  }
  if (cur.length > 0) out.push({ paras: cur });
  return out.length > 0 ? out : [{ paras: [] }];
}

/** Chunk essay items (paragraph blocks carrying their edit ids) by plain-text length. */
function chunkItems(items: EssayItem[], maxChars: number): EssayItem[][] {
  const out: EssayItem[][] = [];
  let cur: EssayItem[] = [];
  let len = 0;
  for (const it of items) {
    const n = plainText(it.html).length;
    if (cur.length > 0 && len + n > maxChars) {
      out.push(cur);
      cur = [];
      len = 0;
    }
    cur.push(it);
    len += n;
  }
  if (cur.length > 0) out.push(cur);
  return out;
}

/** Group a chapter essay's <p> blocks into page-sized chunks by plain-text length. */

/** A "remains" aphorism spread: one sentence of hers alone across two
 * pages, set between chapters as a pause (her direction, 2026-10-18).
 * Sentences are verbatim from her own texts (see
 * remains-book/source-texts/remains-aphorisms.md). */
interface Aphorism {
  id: string;
  en?: string;
  zh?: string;
}

const APHORISMS: Record<string, Aphorism> = {
  "what-remains": { id: "what-remains", en: "What remains?", zh: "留下了什么？" },
  journeys: { id: "journeys", en: "The journeys end. The moments remain.", zh: "旅程会结束，瞬间留下来。" },
  keep: { id: "keep", en: "I keep what is about to disappear.", zh: "我存留那些即将消失的东西。" },
  "human-touch": { id: "human-touch", en: "The 'human touch' remains a refuge, a place machines cannot tread." },
  theme: {
    id: "theme",
    en: "The theme of this book is what remains, and its method is the archive.",
    zh: "主题是存留，方法是档案。",
  },
};

/** Aphorism spreads placed immediately before these chapters. The first
 * one ("What remains?") goes after the front matter, before chapter one. */
const APHORISM_BEFORE_CHAPTER: Record<string, string> = {
  "series:nostalgia": "journeys",
  shop: "keep",
  "series:immemory": "human-touch",
  "series:interview": "theme",
};

/** "Collage as Method" — a short front-matter essay standing right after
 * About the Artist and before the first chapter (her direction, 2026-10-20).
 * Her own text, verbatim; English page first, Chinese page second, like the
 * preface. */
const COLLAGE_METHOD = {
  en: "Collage is how I think. A pottery figurine made to accompany the dead stands in a museum case; I cut it loose and set it down in a video meeting, next to a toilet, beside a limousine, and the two thousand years between them collapse into one flat, funny surface. A search history, that small pile of electronic waste, is cut out of the browser and pasted next to a stranger's testimony from the other side of a pandemic. Portraits of others and self-portraits take turns on the same page, lending each other a self. Nothing keeps its original context. Everything keeps its edges. I do not blend the fragments into one smooth voice. I let them stand side by side, seam showing, until the spark of continuity jumps across the gap. That is what an archive is, the way I make one: not a box where the past is stored, but a table where what is about to disappear is laid out next to what has already survived, so they can keep each other company.",
  zh: "拼贴是我思考的方式。一个为陪伴逝者而做的陶俑，站在博物馆的玻璃柜里；我把它剪下来，放进一场视频会议，放在一只马桶旁边，一辆豪车旁边，它们之间的两千年，就塌成了一个扁平的、好笑的表面。搜索记录，那一小堆电子垃圾，从浏览器里剪出来，贴在一份来自疫情另一端的陌生人证言旁边。他人的肖像与自画像在同一页上轮流出现，互相借出一个自我。没有什么还留在原来的语境里。每一块都留着自己的边缘。我不把这些碎片融成一个光滑的声音。我让它们并排站着，接缝露在外面，直到连续性的火花从缝隙里跳过去。这就是档案，按我的做法：不是一只收纳过去的箱子，而是一张桌子，即将消失的东西被摆在已经幸存下来的东西旁边，让它们彼此做伴。",
};

// ── Pagination ────────────────────────────────────────────────────────────────
// Odd pages are rectos (right-hand), even pages versos. Chapter openers are two-page spreads,
// so they must start on a verso; a blank is inserted before them whenever needed.
function paginate(chapters: Chapter[], prefaceChunkCount: number, paintingChunkCount: number, essayChunkCounts: Record<string, number>): InteriorPage[] {
  const specs: PageSpec[] = [];
  const nextIsVerso = () => (specs.length + 1) % 2 === 0;
  const pushAphorism = (a: Aphorism) => {
    if (!nextIsVerso()) specs.push({ kind: "blank" });
    specs.push({ kind: "aphorism", half: "left", aphorism: a });
    specs.push({ kind: "aphorism", half: "right", aphorism: a });
  };

  specs.push({ kind: "title" });
  specs.push({ kind: "colophon" });
  const tocPages = Math.max(1, Math.ceil((chapters.length + 4) / 9));
  for (let i = 0; i < tocPages; i++) specs.push({ kind: "contents", chunk: i });
  for (let i = 0; i < prefaceChunkCount; i++) specs.push({ kind: "preface", chunk: i });
  // About the Artist stands at the front of the book, right after the preface
  // (her direction, 2026-10-18).
  specs.push({ kind: "about", chunk: 0 });
  specs.push({ kind: "about", chunk: 1 });
  // Collage as Method follows About the Artist, before chapter one and its
  // "What remains?" aphorism spread: English page, then Chinese page.
  specs.push({ kind: "collage", chunk: 0 });
  specs.push({ kind: "collage", chunk: 1 });

  let firstChapter = true;
  for (const chapter of chapters) {
    if (firstChapter) {
      pushAphorism(APHORISMS["what-remains"]);
      for (let i = 0; i < paintingChunkCount; i++) specs.push({ kind: "painting-intro", chunk: i });
      firstChapter = false;
    }
    const aphorismId = APHORISM_BEFORE_CHAPTER[chapter.key];
    if (aphorismId) pushAphorism(APHORISMS[aphorismId]);
    // One opening per chapter (her direction, 2026-10-18): the big-type
    // opener spread alone — no separate title page before it. Series-only
    // chapters open with the same spread; their essay count can be 0.
    if (!nextIsVerso()) specs.push({ kind: "blank" });
    specs.push({ kind: "opener", half: "left", chapter });
    specs.push({ kind: "opener", half: "right", chapter });
    const essayCount = essayChunkCounts[chapter.key] ?? (chapter.seriesOnly ? 0 : 1);
    // Held-back trailing essay chunks (see Chapter.essayAfterPlate) are
    // emitted right after their marked plate; if that plate is absent they
    // close the plate sequence instead, so no text is ever dropped.
    const holdBack = chapter.essayAfterPlate;
    const leadCount = holdBack ? Math.max(0, essayCount - holdBack.trailingChunks) : essayCount;
    for (let i = 0; i < leadCount; i++) specs.push({ kind: "essay", chapter, chunk: i });
    let heldBackEmitted = false;
    for (const { item, plate } of chapter.items) {
      specs.push({ kind: "plate", chapter, item, plate });
      if (holdBack && !heldBackEmitted && item.image_url === holdBack.imageUrl) {
        for (let i = leadCount; i < essayCount; i++) specs.push({ kind: "essay", chapter, chunk: i });
        heldBackEmitted = true;
      }
    }
    if (holdBack && !heldBackEmitted) {
      for (let i = leadCount; i < essayCount; i++) specs.push({ kind: "essay", chapter, chunk: i });
    }
    if (EXHIBITIONS[chapter.key]?.length) specs.push({ kind: "exhibitions", chapter });
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

function Page({ side, tone = "paper", className = "", id, bg, ctl, style, children }: { side: Side; tone?: "paper" | "ink" | "accent"; className?: string; id?: string; bg?: PageBgKind; ctl?: ReactNode; style?: CSSProperties; children?: ReactNode }) {
  return (
    <section id={id} style={style} className={`bk-page bk-${side} bk-tone-${tone} ${bg ? `bk-bg-${bg}` : ""} ${className}`}>
      {ctl}
      {children}
    </section>
  );
}

/** Stable identity for a page, used by per-page background overrides (src/lib/pageBackgrounds.ts). */
function pageKeyOf(spec: PageSpec): string | null {
  switch (spec.kind) {
    case "blank":
      return null;
    case "preface":
      return `preface:${spec.chunk}`;
    case "painting-intro":
      return `painting:${spec.chunk}`;
    case "essay":
      return `essay:${spec.chapter.key}:${spec.chunk}`;
    case "exhibitions":
      return `exhibitions:${spec.chapter.key}`;
    case "opener":
      return `opener:${spec.chapter.key}:${spec.half}`;
    case "aphorism":
      return `aphorism:${spec.aphorism.id}:${spec.half}`;
    case "plate":
      return `plate:${spec.plate}`;
    case "about":
      return `about:${spec.chunk}`;
    case "collage":
      return `collage:${spec.chunk}`;
    default:
      return spec.kind;
  }
}

const BG_OPTIONS: [PageBgKind | "global", string][] = [
  ["global", "全局"],
  ["white", "白"],
  ["cream", "米"],
  ["black", "黑"],
  ["pink", "粉"],
];

function PageBgCtl({ current, onPick }: { current?: PageBgKind; onPick: (kind: PageBgKind | "global") => void }) {
  return (
    <div className="bk-pagebg-ctl" data-noprint>
      {BG_OPTIONS.map(([kind, label]) => (
        <button
          key={kind}
          type="button"
          className={`bk-pagebg-btn ${(current ?? "global") === kind ? "bk-pagebg-on" : ""}`}
          onClick={() => onPick(kind)}
        >
          {label}
        </button>
      ))}
    </div>
  );
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
export interface BookContext {
  t: Translations;
  lang: "en" | "zh";
  chapters: Chapter[];
  years: string;
  coverFront?: CatalogItem;
  coverBack?: CatalogItem;
  prefaceChunks: { paras: ParaItem[] }[];
  essayChunks: Record<string, EssayChunk[]>;
  editMode: boolean;
  fieldTexts: Record<string, string>;
  openEditor: (edit: string, label: string, current: string) => void;
  pageBgFor: (key: string | null) => PageBgKind | undefined;
  setPageBg: (key: string, kind: PageBgKind | "global") => void;
  paintingChunks: { paras: ParaItem[] }[];
}

export function FrontCoverFace({ ctx }: { ctx: BookContext }) {
  // Final cover (her direction, 2026-10-18): a full rust-brown field, the David
  // still life from the Still Things section whole at the centre, and cream serif lettering walking the four edges — Chun across the
  // top, Wang down the right side, Remains up the left side. No Chinese on
  // the front cover (her call, 2026-10-18): English lettering only.
  const still = ctx.chapters.find((c) => c.key === "stillthings");
  // The cover piece is pinned by image, not by title: the plain title
  // "Still Things" is shared by more than one plate in the section. It
  // was originally settled with the landscape plate (watercolors/43);
  // on 2026-10-24 she asked to try the portrait plate that joined the
  // section in 2026 (watercolors/48) as the cover centre instead.
  const art = still?.items.find(({ item }) => item.image_url.includes("/watercolors/48/"))?.item ?? still?.items[0]?.item ?? ctx.coverFront;
  return (
    <div className="bk-face bk-face-front bk-face-rust">
      <span className="bk-cover-word bk-cover-top">Chun</span>
      <span className="bk-cover-word bk-cover-right">Wang</span>
      <span className="bk-cover-word bk-cover-left">Remains</span>
      {art && (
        <div className="bk-cover-art">
          <BookImage src={art.image_url} fallback={art.fallback_image_url} alt="Still Things" />
        </div>
      )}
    </div>
  );
}


export function BackCoverFace() {
  // Back cover, after the Nauman-style reference she chose (2026-10-18): one text
  // block high on the page, a large quiet field below, the studio line at lower
  // left and a blank white barcode box at lower right (the ISBN is still to come).
  // The first sentence carries who she is, so the book explains itself.
  return (
    <div className="bk-face bk-face-back">
      <div className="bk-back-body">
        <p className="bk-back-blurb">
          Remains gathers a decade of work by Chun Wang, a multidisciplinary artist and curator based in New York City, across painting, photography, ceramics and objects, web-based projects, and live performance. Ancient figurines clock back in for video meetings. A stranger's face is held for one second before the train moves on. Search histories, pandemic testimony, and fleeting performances are gathered before they can disappear. The materials change from series to series. The habit underneath them does not. The theme of this book is what remains, and its method is the archive, assembled slowly, in print, the older technology of staying.
        </p>
        <p className="bk-back-blurb">
          《Remains》收拢了王淳十年的作品。王淳是常驻纽约的跨领域艺术家与策展人，创作横跨绘画、摄影、陶艺与物件、网络项目与现场表演。古代陶俑重新上岗，去开视频会议；火车开动之前，一张陌生人的脸被多留了一秒；搜索记录、疫情证言、转瞬即逝的表演，在消失之前先被收集起来。材料从一个系列到下一个系列一直在变，其下的习惯不变。这本书的主题是存留，方法是档案，用印刷慢慢装订起来，用更古老的存留技术。
        </p>
      </div>
      <div className="bk-back-foot">
        <div className="bk-back-mark shop-title gloria-title">{translations.en.catalogBook.publisher} · {translations.zh.catalogBook.publisher}</div>
        <div className="bk-back-barcode" aria-hidden="true" />
      </div>
    </div>
  );
}


export function SpineFace({ ctx, width }: { ctx: BookContext; width: number }) {
  // Below ~1/4 in most printers won't allow spine text.
  if (width < 0.25) return <div className="bk-spine" />;
  return (
    <div className="bk-spine">
      <div className="bk-spine-text">
        <span className="shop-title gloria-title">Chun Wang · 王淳</span>
        <span className="bk-spine-dot">·</span>
        <span className="shop-title gloria-title">{translations.en.catalogBook.title} {"遗迹"}</span>
      </div>
    </div>
  );
}

// ── Interior pages ────────────────────────────────────────────────────────────
export function InteriorPageView({ page, ctx, pages }: { page: InteriorPage; ctx: BookContext; pages: InteriorPage[] }) {
  const { spec, number } = page;
  const { t, chapters, years } = ctx;
  const b = t.catalogBook;
  const side: Side = number % 2 === 0 ? "verso" : "recto";
  const pageId = `bk-page-${number}`;
  const pageKey = pageKeyOf(spec);
  const bg = ctx.pageBgFor(pageKey);
  const ctl =
    ctx.editMode && pageKey ? <PageBgCtl current={bg} onPick={(kind) => ctx.setPageBg(pageKey, kind)} /> : null;
  const author = "Chun Wang · 王淳";
  const bookHead = `${author} — ${b.title}`;

  switch (spec.kind) {
    case "title":
      return (
        <Page id={pageId} side={side} bg={bg} ctl={ctl} className="bk-title-page">
          <div className="bk-title-body">
            <h1 className="bk-title-main shop-title gloria-title" style={{ fontSize: displaySize(translations.en.catalogBook.title, 6.8, 1.35) }}>
              {translations.en.catalogBook.title}
            </h1>
            <div className="bk-rule" />
            <div className="bk-title-meta">
              <span>{years}</span>
            </div>
          </div>
        </Page>
      );

    case "colophon": {
      const year = new Date().getFullYear();
      return (
        <Page id={pageId} side={side} bg={bg} ctl={ctl} className="bk-colophon">
          <div className="bk-colophon-body">
            <p className="bk-colophon-title shop-title">{translations.en.catalogBook.title} · {"遗迹"}</p>
            <p>© {year} Chun Wang. {translations.en.catalogBook.rights}</p>
            <p>© {year} 王淳。{translations.zh.catalogBook.rights}</p>
            <p>
              {translations.en.catalogBook.publisher}, {translations.en.catalogBook.city} · {translations.zh.catalogBook.publisher}，{translations.zh.catalogBook.city}
              <br />
              {SITE_URL.replace(/^https?:\/\/|\/$/g, "")} · {SHOP_URL.replace(/^https?:\/\/|\/$/g, "")}
            </p>
            <p>
              {translations.en.catalogBook.edition}, {year} · {translations.zh.catalogBook.edition}，{year}
            </p>
          </div>
        </Page>
      );
    }

    case "contents": {
      const startOf = (pred: (s: PageSpec) => boolean) => pages.find((p) => pred(p.spec))?.number ?? 0;
      const rows = [
        { num: "", title: `${translations.en.catalogBook.preface} · ${translations.zh.catalogBook.preface}`, sub: "", page: startOf((s) => s.kind === "preface") },
        { num: "", title: `${translations.en.catalogBook.aboutArtist} · ${translations.zh.catalogBook.aboutArtist}`, sub: "", page: startOf((s) => s.kind === "about") },
        { num: "", title: "Collage as Method · 拼贴作为方法", sub: "", page: startOf((s) => s.kind === "collage") },
        { num: "", title: `${translations.en.catalogBook.paintingIntro} · ${translations.zh.catalogBook.paintingIntro}`, sub: "", page: startOf((s) => s.kind === "painting-intro") },
        ...chapters.map((c) => ({
          num: pad2(c.number),
          title: c.title,
          sub: c.years,
          page: startOf((s) => "chapter" in s && s.chapter.key === c.key),
        })),
      ];
      const pageRows = rows.slice(spec.chunk * 9, spec.chunk * 9 + 9);
      return (
        <Page id={pageId} side={side} bg={bg} ctl={ctl}>
          {spec.chunk === 0 && (
            <div className="bk-eyebrow">{translations.en.catalogBook.contents} · {translations.zh.catalogBook.contents}</div>
          )}
          <div className="bk-contents">
            {spec.chunk === 0 && <h2 className="bk-section-title shop-title gloria-title">{translations.en.catalogBook.contents} {translations.zh.catalogBook.contents}</h2>}
            <ol>
              {pageRows.map((r) => (
                <li
                  key={r.title}
                  className="bk-contents-link"
                  onClick={() => document.getElementById(`bk-page-${r.page}`)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                >
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
      const paras = ctx.prefaceChunks[spec.chunk]?.paras ?? [];
      const long = paras.map((p) => p.text).join("").length > 1400;
      return (
        <Page id={pageId} side={side} bg={bg} ctl={ctl}>
          <RunningHead side={side} left={bookHead} right={`${translations.en.catalogBook.preface} · ${translations.zh.catalogBook.preface}`} />
          <div className="bk-essay">
            {spec.chunk === 0 && (
              <div className="bk-essay-head">
                <h2 className="bk-section-title shop-title gloria-title">{translations.en.catalogBook.preface} {translations.zh.catalogBook.preface}</h2>
              </div>
            )}
            <div className={`bk-essay-text description-html ${long ? "bk-essay-long" : ""}`}>
              {paras.map((p, i) => (
                <p
                  key={i}
                  className={ctx.editMode ? "bk-editable" : undefined}
                  onDoubleClick={ctx.editMode ? () => ctx.openEditor(p.edit, `${b.preface} · ${spec.chunk + 1}-${i + 1}`, p.text) : undefined}
                >
                  {p.text}
                </p>
              ))}
            </div>
          </div>
          <Folio number={number} tag={`${b.title} | ${translations.en.catalogBook.preface} · ${translations.zh.catalogBook.preface}`} />
        </Page>
      );
    }

    case "painting-intro": {
      const paras = ctx.paintingChunks[spec.chunk]?.paras ?? [];
      const long = paras.map((p) => p.text).join("").length > 1400;
      return (
        <Page id={pageId} side={side} bg={bg} ctl={ctl}>
          <RunningHead side={side} left={bookHead} right={`${translations.en.catalogBook.paintingIntro} · ${translations.zh.catalogBook.paintingIntro}`} />
          <div className="bk-essay">
            {spec.chunk === 0 && (
              <div className="bk-essay-head">
                <h2 className="bk-section-title shop-title gloria-title">{translations.en.catalogBook.paintingIntro} {translations.zh.catalogBook.paintingIntro}</h2>
              </div>
            )}
            <div className={`bk-essay-text description-html ${long ? "bk-essay-long" : ""}`}>
              {paras.map((p, i) => (
                <p
                  key={i}
                  className={ctx.editMode ? "bk-editable" : undefined}
                  onDoubleClick={ctx.editMode ? () => ctx.openEditor(p.edit, `${b.paintingIntro} · ${spec.chunk + 1}-${i + 1}`, p.text) : undefined}
                >
                  {p.text}
                </p>
              ))}
            </div>
          </div>
          <Folio number={number} tag={`${b.title} | ${translations.en.catalogBook.paintingIntro} · ${translations.zh.catalogBook.paintingIntro}`} />
        </Page>
      );
    }

    case "opener": {
      const { chapter, half } = spec;
      // The chapter's only opening (her direction, 2026-10-18): a black
      // spread with white type throughout. The big handwritten title runs
      // across the bottom; the chapter's epigraph, where its own book text
      // carries one, sits small in the upper field. Text only: no artwork
      // appears before the section itself.
      const epigraph = CHAPTER_EPIGRAPH[chapter.key];
      return (
        <Page id={pageId} side={side} bg={bg} ctl={ctl} className={`bk-opener bk-opener-${half}`}>
          <div className="bk-spread-canvas">
            {epigraph && (
              <p className="bk-opener-epigraph">
                {epigraph.en}
                <span className="bk-opener-epigraph-zh">{epigraph.zh}</span>
              </p>
            )}
            <Collage
              title={chapter.title}
              // Two lines across the ~16 in spread at most.
              titleSize={displaySize(chapter.title, 2 * 15.5, 1.9)}
              above={
                <div className="bk-collage-row">
                  <span className="bk-opener-label">
                    <span className="bk-num-box">{pad2(chapter.number)}</span>
                    {translations.en.catalogBook.chapter.replace("{n}", pad2(chapter.number))} · {translations.zh.catalogBook.chapter.replace("{n}", pad2(chapter.number))}
                  </span>
                  <span>{chapter.years}</span>
                </div>
              }
            />
          </div>
        </Page>
      );
    }

    case "aphorism": {
      const a = spec.aphorism;
      return (
        <Page id={pageId} side={side} bg={bg} ctl={ctl} className={`bk-aphorism bk-aphorism-${spec.half}`}>
          <div className="bk-spread-canvas">
            <div className="bk-aphorism-body">
              {a.en && <p className="bk-aphorism-en">{a.en}</p>}
              {a.zh && <p className="bk-aphorism-zh">{a.zh}</p>}
            </div>
          </div>
        </Page>
      );
    }

    case "essay": {
      const { chapter } = spec;
      const chunk = ctx.essayChunks[chapter.key]?.[spec.chunk];
      const items = chunk?.items ?? [];
      return (
        <Page id={pageId} side={side} bg={bg} ctl={ctl}>
          <RunningHead side={side} left={bookHead} right={chapter.title} />
          <div className="bk-essay">
            {spec.chunk === 0 && (
              <div className="bk-essay-head">
                <span className="bk-num-box">{pad2(chapter.number)}</span>
                <h2 className="bk-section-title shop-title">{chapter.title}</h2>
                <div className="bk-essay-meta sans-label">{chapter.years}</div>
              </div>
            )}
            <div className="bk-essay-text description-html">
              {items.map((it, i) => (
                <p
                  key={i}
                  className={ctx.editMode ? "bk-editable" : undefined}
                  onDoubleClick={
                    ctx.editMode
                      ? () => ctx.openEditor(it.edit, `${chapter.title} · ${chunk?.lang === "zh" ? "中文" : "EN"}`, ctx.fieldTexts[it.edit] ?? plainText(it.html))
                      : undefined
                  }
                  dangerouslySetInnerHTML={{ __html: it.html.replace(/^<p[^>]*>/, "").replace(/<\/p>$/, "") }}
                />
              ))}
            </div>
          </div>
          <Folio number={number} tag={`${b.title} | ${chapter.title}`} />
        </Page>
      );
    }

    case "plate": {
      const { item, chapter } = spec;
      return (
        <Page id={pageId} side={side} bg={bg} ctl={ctl} className="bk-plate-page">
          <RunningHead side={side} left={bookHead} right={chapter.title} />
          <div className="bk-plate-frame">
            <BookImage src={item.image_url} fallback={item.fallback_image_url} alt={item.title} />
          </div>
          <div className="bk-caption">
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
        <Page id={pageId} side={side} bg={bg} ctl={ctl}>
          <RunningHead side={side} left={bookHead} right={`${translations.en.catalogBook.aboutArtist} · ${translations.zh.catalogBook.aboutArtist}`} />
          <div className="bk-essay">
            <div className="bk-essay-head">
              <div className="bk-essay-meta sans-label">{translations.en.catalogBook.aboutArtist} · {translations.zh.catalogBook.aboutArtist}</div>
              <h2 className="bk-section-title shop-title gloria-title">{author}</h2>
            </div>
            <div className="bk-essay-text description-html" dangerouslySetInnerHTML={{ __html: spec.chunk === 0 ? artistBioHTML("en") : artistBioHTML("zh") }} />
          </div>
          <Folio number={number} tag={`${b.title} | ${translations.en.catalogBook.aboutArtist} · ${translations.zh.catalogBook.aboutArtist}`} />
        </Page>
      );

    case "collage":
      return (
        <Page id={pageId} side={side} bg={bg} ctl={ctl}>
          <RunningHead side={side} left={bookHead} right="Collage as Method · 拼贴作为方法" />
          <div className="bk-essay">
            {spec.chunk === 0 && (
              <div className="bk-essay-head">
                <div className="bk-essay-meta sans-label">Collage as Method · 拼贴作为方法</div>
                <h2 className="bk-section-title shop-title gloria-title">Collage as Method 拼贴作为方法</h2>
              </div>
            )}
            <div className="bk-essay-text description-html">
              <p>{spec.chunk === 0 ? COLLAGE_METHOD.en : COLLAGE_METHOD.zh}</p>
            </div>
          </div>
          <Folio number={number} tag={`${b.title} | Collage as Method · 拼贴作为方法`} />
        </Page>
      );

    case "exhibitions": {
      const entries = EXHIBITIONS[spec.chapter.key] ?? [];
      return (
        <Page id={pageId} side={side} bg={bg} ctl={ctl}>
          <div className="bk-eyebrow">相关展览 · Exhibitions</div>
          <div className="bk-exhibitions">
            <h3 className="bk-exhibitions-head shop-title">{spec.chapter.title}</h3>
            <ul>
              {entries.map((e, i) => {
                const en = exhibitionParts(e.en);
                const zh = exhibitionParts(e.zh);
                return (
                  <li key={i}>
                    <span className="bk-exhibitions-en">
                      {en.year && <strong>{en.year}</strong>}
                      {en.year ? " " : ""}
                      {en.rest}
                    </span>
                    <span className="bk-exhibitions-zh">
                      {zh.year && <strong>{zh.year}</strong>}
                      {zh.year ? " " : ""}
                      {zh.rest}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </Page>
      );
    }

    case "end":
      return (
        <Page id={pageId} side={side} bg={bg} ctl={ctl} className="bk-center">
          <div className="bk-end">
            <div className="shop-title gloria-title">{translations.en.catalogBook.publisher} · {translations.zh.catalogBook.publisher}</div>
            <div className="bk-end-sub">{years}</div>
          </div>
        </Page>
      );

    case "blank":
      return <Page id={pageId} side={side} bg={bg} ctl={ctl} />;
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


// ── Book model ─────────────────────────────────────────────────────────────
// The book's chapters, page contents and pagination, built once and shared:
// the book page itself lays the volume out from this model, and read-only
// presentation pages (the physical-object view at /catalogs/book/object)
// render the same pages and cover faces from it.
const EMPTY_TEXT_EDITS: Record<string, string> = {};
const EMPTY_BG_EDITS: Record<string, PageBgKind | "global"> = {};

function useBookModel(args: {
  editMode: boolean;
  textEdits: Record<string, string>;
  pageBgEdits: Record<string, PageBgKind | "global">;
  pageBgFor: BookContext["pageBgFor"];
  setPageBg: BookContext["setPageBg"];
  openEditor: BookContext["openEditor"];
}): { ctx: BookContext; pages: InteriorPage[] } {
  const { editMode, textEdits, pageBgEdits, pageBgFor, setPageBg, openEditor } = args;
  const t = translations.en;
  const ctx = useMemo<BookContext>(() => {
    let plate = 0;
    // The book is one bilingual edition (print-book rule): English first, Chinese immediately
    // after, everywhere. Nothing in the book waits on the site language toggle.
    const sectionsEn = getCombinedCatalogSections("", "en");
    const sectionsZh = getCombinedCatalogSections("", "zh");
    const descOf = (list: CatalogSection[], key: CatalogSectionKey) => list.find((x) => x.key === key)?.descriptionHtml || "";
    const asParas = (html: string) =>
      html.includes("<p") ? html : html.split(/\n\s*\n/).filter(Boolean).map((p) => `<p>${p.trim()}</p>`).join("");
    const bilingualDesc = (key: CatalogSectionKey) => {
      const en = descOf(sectionsEn, key);
      const zh = descOf(sectionsZh, key);
      return asParas(en && zh && en !== zh ? en + "\n\n" + zh : en || zh);
    };
    const bilingualTitle = (en: string, zh: string) => (en === zh ? en : `${en} ${zh}`);
    const catalogChapters: Chapter[] = getCombinedCatalogSections("", "en")
      .filter((s) => s.items.length > 0)
      .map((s, i) => ({
        key: s.key,
        number: i + 1,
        title: bilingualTitle(CHAPTER_TITLE[s.key](translations.en), CHAPTER_TITLE[s.key](translations.zh)),
        // Sections without an essay of their own fall back to the copy the site already uses for them.
        descriptionHtml:
          s.key === "remains"
            ? t.catalogBook.remainsEssayBody.map((p) => `<p>${p}</p>`).join("")
            : s.key === "photography"
              ? bilingualDesc("photography") +
                `<p>El Otro, El Mismo</p>` +
                t.catalogBook.elOtroEssayBody.map((p) => `<p>${p}</p>`).join("")
              : bilingualDesc(s.key) ||
                (s.key === "watercolor"
                  ? `<p>${translations.en.watercolorCatalog.noteText}</p><p>${translations.zh.watercolorCatalog.noteText}</p>`
                  : s.key === "shop"
                    ? `<p>${translations.en.hero.description}</p><p>${translations.zh.hero.description}</p>`
                    : ""),
        items: s.items.map((item, ii) => {
          // Bilingual plate titles from the sample chapter draft; only No.1 and No.4 have titles so far.
          const caption =
            s.key === "remains" && ii === 0
              ? "<p>EVERY FLUSH IS A NEW BEGINNING<br />每一次冲水都是新的开始</p>"
              : s.key === "remains" && ii === 3
                ? "<p>THE MEETING HAS BEGUN / WE HAVE NOTHING TO CONTRIBUTE<br />会议已经开始 / 我们无可奉告</p>"
                : undefined;
          return { item: { ...item, title: item.title || t.catalogBook.untitled, ...(caption ? { description: caption } : {}) }, plate: ++plate };
        }),
        years: yearRange(s.items.map((item) => item.year)),
      }));
    // Series sections that complete the outline but have no catalog plates yet
    // (Nostalgia, Visions in Ceramics, the Screen & Archive and Live chapters),
    // merged with the catalog chapters in the book outline's order.
    const seriesChapters: Chapter[] = BOOK_SERIES.filter((s) => !s.mergedInto).map((s) => ({
      key: `series:${s.id}`,
      number: 0,
      title: !s.titleZh || s.titleEn === s.titleZh ? s.titleEn : `${s.titleEn} ${s.titleZh}`,
      descriptionHtml: "",
      items: (SERIES_PLATES[s.id] ?? []).map((item) => ({ item, plate: 0 })),
      years: s.years,
      seriesOnly: true,
    }));
    // The watercolor catalog dissolves into its three named series (her call:
    // no "Visions in Watercolor" umbrella chapter). Plates split from the
    // watercolor catalog by title; the texts live in BOOK_SERIES.
    const wcChapter = catalogChapters.find((ch) => ch.key === "watercolor");
    const wcSplit = (id: string, title: string, prefix: string): Chapter => {
      const items = (wcChapter?.items ?? []).filter(({ item }) => (item.title ?? "").startsWith(prefix));
      return { key: id, number: 0, title, descriptionHtml: "", items, years: yearRange(items.map(({ item }) => item.year)), seriesTextId: id };
    };
    const splitChapters: Chapter[] = [
      wcSplit("residuals", "Residuals 残留", "Residuals"),
      wcSplit("stillthings", "Still Things 静物", "Still Things"),
      wcSplit("road", "Notes from the Road 旅途笔记", "Notes from the Road"),
    ];
    const SECTION_ORDER = [
      "spirit", "remains", "residuals", "stillthings", "road", "innerwilderness", "deathvalley", "sahara", "highlands", "theater", "photography", "series:nostalgia",
      "shop",
      "series:immemory", "series:negotiated", "series:unfinished", "series:google",
      "series:feedscanner", "series:cavedance",
      "series:soliloquy", "series:artempath",
      "series:interview",
    ];
    // Photography, restructured at her direction (2026-10-18): the part is
    // "Inner Wilderness 内在荒原" — an opening text chapter carrying the
    // landscape statement — then each series stands as its own section with
    // its own text: Death Valley, Sahara, Scottish Highlands, Theater, and
    // El Otro, El Mismo (the old mixed photography chapter) closing the part.
    // Sahara and Theater #2/#3 are printInCatalog=false on the site, so they
    // never reached the book through the catalog sections; they are added
    // here directly from the photography data.
    const photoParent = catalogChapters.find((ch) => ch.key === "photography");
    const photoItems = photoParent?.items ?? [];
    const titleHas = (pair: { item: CatalogItem }, ...needles: string[]) =>
      needles.some((n) => (pair.item.title ?? "").includes(n));
    const yrOf = (pairs: { item: CatalogItem }[]) => {
      const ys = pairs.map(({ item }) => parseInt(item.year ?? "", 10)).filter((y) => !Number.isNaN(y));
      if (ys.length === 0) return "";
      const lo = Math.min(...ys);
      const hi = Math.max(...ys);
      return lo === hi ? `${lo}` : `${lo} – ${hi}`;
    };
    const mkPhotoItem = (workId: string): CatalogItem | null => {
      const w = photographyWorks.find((x) => x.id === workId);
      if (!w) return null;
      const tpl = photoItems[0]?.item.image_url ?? "";
      const img = tpl.includes("/photography/")
        ? tpl.replace(/\/photography\/\d+\//, `/photography/${workId.padStart(2, "0")}/`)
        : `/photography/${workId.padStart(2, "0")}/main.jpg`;
      return {
        title: w.title,
        metaLine: [w.year, w.medium].filter(Boolean).join(" · "),
        year: w.year,
        medium: w.medium,
        dimensions: w.dimensions,
        description: w.description,
        category: "Inner Wilderness",
        image_url: img,
        fallback_image_url: img,
      };
    };
    const dvItems = photoItems.filter((p) => titleHas(p, "Death Valley", "死亡谷"));
    const hgItems = photoItems.filter((p) => titleHas(p, "Highland", "高地"));
    const thKnown = photoItems.filter((p) => titleHas(p, "Theater", "死亡的戏剧"));
    const thItems = [...thKnown, ...["10", "11"].map(mkPhotoItem).filter((x): x is CatalogItem => !!x).map((item) => ({ item, plate: 0 }))];
    const saharaItem = mkPhotoItem("7");
    const usedPhoto = new Set([...dvItems, ...hgItems, ...thKnown]);
    const elOtroItems = photoItems.filter((p) => !usedPhoto.has(p));
    const photoChapters: Chapter[] = photoParent
      ? [
          { key: "innerwilderness", number: 0, title: "Inner Wilderness 内在荒原", descriptionHtml: "", years: "2017 – 2025", items: [], seriesTextId: "innerwilderness" },
          { key: "deathvalley", number: 0, title: "Death Valley 死亡谷", descriptionHtml: "", years: yrOf(dvItems), items: [...dvItems, ...DEATH_VALLEY_PLATES.map((item) => ({ item, plate: 0 }))], seriesTextId: "deathvalley" },
          { key: "sahara", number: 0, title: "Sahara 撒哈拉", descriptionHtml: "", years: saharaItem?.year ?? "", items: saharaItem ? [{ item: saharaItem, plate: 0 }] : [], seriesTextId: "sahara" },
          { key: "highlands", number: 0, title: "Scottish Highlands 苏格兰高地", descriptionHtml: "", years: yrOf(hgItems), items: hgItems, seriesTextId: "highlands" },
          { key: "theater", number: 0, title: "Theater 登场", descriptionHtml: "", years: yrOf(thItems), items: thItems, seriesTextId: "theater" },
          { ...photoParent, title: "El Otro, El Mismo 另一个，同一个", descriptionHtml: "", years: yrOf(elOtroItems), items: elOtroItems },
        ]
      : [];
    const byChapterKey = new Map([...catalogChapters, ...photoChapters, ...seriesChapters, ...splitChapters].map((ch) => [ch.key, ch]));
    const chapters = SECTION_ORDER.map((k) => byChapterKey.get(k))
      .filter((ch): ch is Chapter => !!ch)
      .map((ch, i) => ({ ...ch, number: i + 1 }));
    // Slightly Useful Objects opens the shop chapter (Visions in Ceramics is
    // merged into it): the artist's Instagram images go ahead of the shop
    // catalog plates, in the order registered in SERIES_PLATES.shop.
    const suoChapter = chapters.find((ch) => ch.key === "shop");
    if (suoChapter) {
      suoChapter.items = [
        ...(SERIES_PLATES.shop ?? []).map((item) => ({ item, plate: 0 })),
        ...suoChapter.items,
      ];
    }
    // Plates are numbered in book order across the whole volume.
    let plateSeq = 0;
    for (const ch of chapters) ch.items = ch.items.map(({ item }) => ({ item, plate: ++plateSeq }));

    // Essay layout rule: English gets its own pages, Chinese gets its own pages.
    // The two languages never share an essay page, so the book does not read like a translation.
    // Editor: every paragraph carries the id of the source text it came from (see api/book-pr.js).
    const txParas = (field: "prefaceBody" | "paintingIntroBody" | "remainsEssayBody" | "elOtroEssayBody"): ParaItem[] =>
      translations.en.catalogBook[field].map((p, i) => ({ text: textEdits[`tx:${field}:${i}`] ?? p, edit: `tx:${field}:${i}` }));
    const fieldText = (key: CatalogSectionKey, which: "en" | "zh") =>
      textEdits[`field:${key}:${which}`] ?? descOf(which === "en" ? sectionsEn : sectionsZh, key);
    const fieldTexts: Record<string, string> = {};
    for (const key of ["spirit", "watercolor"] as const) {
      fieldTexts[`field:${key}:en`] = fieldText(key, "en");
      fieldTexts[`field:${key}:zh`] = fieldText(key, "zh");
    }
    fieldTexts["tx:watercolorNote:en"] = textEdits["tx:watercolorNote:en"] ?? translations.en.watercolorCatalog.noteText;
    fieldTexts["tx:watercolorNote:zh"] = textEdits["tx:watercolorNote:zh"] ?? translations.zh.watercolorCatalog.noteText;
    fieldTexts["tx:heroDesc:en"] = textEdits["tx:heroDesc:en"] ?? translations.en.hero.description;
    fieldTexts["tx:heroDesc:zh"] = textEdits["tx:heroDesc:zh"] ?? translations.zh.hero.description;
    const pBlocks = (html: string) => html.match(/<p[^>]*>[\s\S]*?<\/p>/g) ?? (html ? [html] : []);
    const fieldItems = (key: CatalogSectionKey, which: "en" | "zh"): EssayItem[] =>
      pBlocks(asParas(fieldText(key, which))).map((html) => ({ html, edit: `field:${key}:${which}` }));
    const paraItems = (paras: ParaItem[]): EssayItem[] => paras.map((p) => ({ html: `<p>${p.text}</p>`, edit: p.edit }));
    const langChunks = (en: EssayItem[], zh: EssayItem[]): EssayChunk[] => {
      const all = [
        ...chunkItems(en, 1500).map((items) => ({ lang: "en" as const, items })),
        ...chunkItems(zh, 1000).map((items) => ({ lang: "zh" as const, items })),
      ];
      return all.length > 0 ? all : [{ lang: "en", items: [] }];
    };
    const essayChunks: Record<string, EssayChunk[]> = {};
    for (const chapter of chapters) {
      if (chapter.key.startsWith("series:")) {
        const s = BOOK_SERIES.find((x) => `series:${x.id}` === chapter.key);
        const enT = (s && (textEdits[`series:${s.id}:en`] ?? s.textEn)) || "";
        const zhT = (s && (textEdits[`series:${s.id}:zh`] ?? s.textZh)) || "";
        if (s) {
          fieldTexts[`series:${s.id}:en`] = enT;
          fieldTexts[`series:${s.id}:zh`] = zhT;
        }
        essayChunks[chapter.key] =
          !enT && !zhT
            ? []
            : langChunks(
                enT ? pBlocks(asParas(enT)).map((html) => ({ html, edit: `series:${s?.id}:en` })) : [],
                zhT ? pBlocks(asParas(zhT)).map((html) => ({ html, edit: `series:${s?.id}:zh` })) : [],
              );
      } else if (chapter.key === "remains") {
        const paras = txParas("remainsEssayBody");
        const leadEn: EssayItem = { html: "<p>Remains was a mixed media series born from a subtle sense of the absurd. While studying ancient terracotta figurines, I was captivated by their familiar, awkward, and caught mid-nothing expressions.</p>" };
        const leadZh: EssayItem = { html: "<p>《遗迹》是一个源于微妙荒诞感的综合媒材系列。研读古代陶俑时，我被它们那种熟悉、笨拙、僵在无所事事半途的表情迷住了。</p>" };
        essayChunks[chapter.key] = langChunks([leadEn, ...paraItems(paras.filter((p) => !hasCjk(p.text)))], [leadZh, ...paraItems(paras.filter((p) => hasCjk(p.text)))]);
      } else if (chapter.key === "photography") {
        const head: EssayItem = { html: "<p>El Otro, El Mismo</p>" };
        const otro = txParas("elOtroEssayBody");
        const en = [head, ...paraItems(otro.filter((p) => !hasCjk(p.text)))];
        const zh = [head, ...paraItems(otro.filter((p) => hasCjk(p.text)))];
        essayChunks[chapter.key] = langChunks(en, zh);
      } else if (chapter.seriesTextId) {
        const s = BOOK_SERIES.find((x) => x.id === chapter.seriesTextId);
        const enT = (s && (textEdits[`series:${s.id}:en`] ?? s.textEn)) || "";
        const zhT = (s && (textEdits[`series:${s.id}:zh`] ?? s.textZh)) || "";
        if (s) {
          fieldTexts[`series:${s.id}:en`] = enT;
          fieldTexts[`series:${s.id}:zh`] = zhT;
        }
        essayChunks[chapter.key] = langChunks(
          enT ? pBlocks(asParas(enT)).map((html) => ({ html, edit: `series:${s?.id}:en` })) : [],
          zhT ? pBlocks(asParas(zhT)).map((html) => ({ html, edit: `series:${s?.id}:zh` })) : [],
        );
      } else if (chapter.key === "spirit") {
        // The series overview, then the eight sub-series' background texts from her
        // Portfolio pages: English only, as published there, each group headed by
        // its bilingual title and closed by its source credit in small type.
        const bgItems: EssayItem[] = SPIRIT_BACKGROUNDS.flatMap((g) => [
          { html: `<p><strong>${g.titleEn} ${g.titleZh}</strong></p>`, edit: `spiritbg:${g.id}` },
          ...(g.workTitle ? [{ html: `<p><strong>${g.workTitle}</strong></p>`, edit: `spiritbg:${g.id}` }] : []),
          ...g.paras.map((para) => ({
            html: typeof para === "string" ? `<p>${para}</p>` : `<p><strong>${para.head}</strong></p>`,
            edit: `spiritbg:${g.id}`,
          })),
          ...(g.credit ? [{ html: `<p><span class="bk-credit">${g.credit}</span></p>`, edit: `spiritbg:${g.id}` }] : []),
        ]);
        // Her own first-person post on the painting Inundated (WeChat
        // Moments, March 28, 2018) stands right after the series overview,
        // ahead of the borrowed background texts: her voice first, then the
        // texts the paintings answer to. Bilingual, like her other texts.
        const momentItems = (which: "en" | "zh"): EssayItem[] => [
          { html: `<p><span class="bk-credit">${which === "en" ? SPIRIT_MOMENT.labelEn : SPIRIT_MOMENT.labelZh}</span></p>`, edit: "spiritmoment:inundated" },
          { html: `<p>${which === "en" ? SPIRIT_MOMENT.textEn : SPIRIT_MOMENT.textZh}</p>`, edit: "spiritmoment:inundated" },
        ];
        essayChunks[chapter.key] = langChunks([...fieldItems("spirit", "en"), ...momentItems("en"), ...bgItems], [...fieldItems("spirit", "zh"), ...momentItems("zh")]);
      } else if (fieldText(chapter.key, "en") || fieldText(chapter.key, "zh")) {
        essayChunks[chapter.key] = langChunks(fieldItems(chapter.key, "en"), fieldItems(chapter.key, "zh"));
      } else if (chapter.key === "watercolor") {
        essayChunks[chapter.key] = [
          { lang: "en", items: [{ html: `<p>${fieldTexts["tx:watercolorNote:en"]}</p>`, edit: "tx:watercolorNote:en" }] },
          { lang: "zh", items: [{ html: `<p>${fieldTexts["tx:watercolorNote:zh"]}</p>`, edit: "tx:watercolorNote:zh" }] },
        ];
      } else if (chapter.key === "shop") {
        // Slightly Useful Objects: the Visions in Ceramics texts are this same series,
        // so they lead the chapter, ahead of the shop's own description.
        const cer = BOOK_SERIES.find((x) => x.id === "ceramics");
        const cerEn = (cer && (textEdits["series:ceramics:en"] ?? cer.textEn)) || "";
        const cerZh = (cer && (textEdits["series:ceramics:zh"] ?? cer.textZh)) || "";
        if (cer) {
          fieldTexts["series:ceramics:en"] = cerEn;
          fieldTexts["series:ceramics:zh"] = cerZh;
        }
        // Paginated exactly like every other series text: paragraphs are
        // split into <p> blocks and chunked by length, English pages first,
        // then Chinese pages (see langChunks). The series text now carries a
        // full essay, which no longer fits the old single page per language.
        //
        // One exception, at the artist's direction (2026-10-24): the first
        // paragraph of the ceramics text is the method note ("My ceramics
        // begin as functional forms…"). It leaves the introduction and
        // stands as its own essay page pair right after the After Hours
        // Altar plate — the work first, then the note on how the ceramics
        // are made. The two method chunks are appended after the leading
        // chunks and paginate() emits them at the marked plate (see
        // Chapter.essayAfterPlate); the split is computed from the field
        // text itself, so inline text edits keep the arrangement.
        const cerEnBlocks = cerEn ? pBlocks(asParas(cerEn)) : [];
        const cerZhBlocks = cerZh ? pBlocks(asParas(cerZh)) : [];
        const methodEn = cerEnBlocks[0];
        const methodZh = cerZhBlocks[0];
        essayChunks[chapter.key] = [
          ...langChunks(
            [
              ...cerEnBlocks.slice(1).map((html) => ({ html, edit: "series:ceramics:en" })),
              { html: `<p>${fieldTexts["tx:heroDesc:en"]}</p>`, edit: "tx:heroDesc:en" },
            ],
            [
              ...cerZhBlocks.slice(1).map((html) => ({ html, edit: "series:ceramics:zh" })),
              { html: `<p>${fieldTexts["tx:heroDesc:zh"]}</p>`, edit: "tx:heroDesc:zh" },
            ],
          ),
          ...(methodEn && methodZh
            ? [
                { lang: "en" as const, items: [{ html: methodEn, edit: "series:ceramics:en" }] },
                { lang: "zh" as const, items: [{ html: methodZh, edit: "series:ceramics:zh" }] },
              ]
            : []),
        ];
        if (methodEn && methodZh) {
          chapter.essayAfterPlate = { imageUrl: "/book/suo/candle.jpg", trailingChunks: 2 };
        }
      } else {
        essayChunks[chapter.key] = [{ lang: "en", items: [] }];
      }
    }
    const byKey = (key: CatalogSectionKey) => chapters.find((c) => c.key === key)?.items.map((i) => i.item) ?? [];
    const prefaceParas = txParas("prefaceBody");
    const paintingParas = txParas("paintingIntroBody");
    return {
      t,
      chapters,
      prefaceChunks: [
        ...chunkParas(prefaceParas.filter((p) => !hasCjk(p.text)), 1500),
        ...chunkParas(prefaceParas.filter((p) => hasCjk(p.text)), 1000),
      ],
      paintingChunks: [
        ...chunkParas(paintingParas.filter((p) => !hasCjk(p.text)), 1500),
        ...chunkParas(paintingParas.filter((p) => hasCjk(p.text)), 1000),
      ],
      essayChunks,
      editMode,
      fieldTexts,
      openEditor,
      pageBgFor,
      setPageBg,
      years: yearRange(chapters.flatMap((c) => c.items.map((i) => i.item.year))),
      coverFront: byKey("residuals")[0] ?? chapters[0]?.items[0]?.item,
      coverBack: byKey("photography")[0] ?? chapters[0]?.items[1]?.item,
    };
  }, [textEdits, editMode, pageBgEdits]);
  const pages = useMemo(() => paginate(ctx.chapters, ctx.prefaceChunks.length, ctx.paintingChunks.length, Object.fromEntries(Object.entries(ctx.essayChunks).map(([k, v]) => [k, v.length]))), [ctx]);
  return { ctx, pages };
}

/** The book model with the editor off and no staged edits — for pages that
 *  present the finished book rather than lay it out. Page backgrounds still
 *  honour the settled per-page overrides in src/lib/pageBackgrounds.ts. */
export function useBookModelReadOnly(): { ctx: BookContext; pages: InteriorPage[] } {
  const pageBgFor = (key: string | null): PageBgKind | undefined => (key ? PAGE_BACKGROUNDS[key] : undefined);
  const setPageBg = () => {};
  const openEditor = () => {};
  return useBookModel({ editMode: false, textEdits: EMPTY_TEXT_EDITS, pageBgEdits: EMPTY_BG_EDITS, pageBgFor, setPageBg, openEditor });
}

const CatalogBook = () => {
  // The book is one bilingual edition: its labels never follow the site's
  // language toggle, so the book page reads English first, Chinese right after.
  const t = translations.en;
  const lang = "en" as const;
  const b = t.catalogBook;
  const [part, setPart] = useState<Part>("complete");
  const [bleed, setBleed] = useState(false);
  const [paper, setPaper] = useState<"white" | "cream" | "black">("white");
  const [preparing, setPreparing] = useState(false);
  const [zoom, setZoom] = useState(1);
  // ── Book editor (edit mode): staged text edits + per-page backgrounds ──
  const loadJSON = <T,>(key: string, fallback: T): T => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  };
  const [editMode, setEditMode] = useState(false);
  const [textEdits, setTextEdits] = useState<Record<string, string>>(() => loadJSON("remains-book-text-edits", {}));
  const [pageBgEdits, setPageBgEdits] = useState<Record<string, PageBgKind | "global">>(() => loadJSON("remains-book-page-bg", {}));
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    JSON.stringify({ t: loadJSON("remains-book-text-edits", {}), b: loadJSON("remains-book-page-bg", {}) }),
  );
  const [panel, setPanel] = useState<{ edit: string; label: string; value: string } | null>(null);
  const [prMsg, setPrMsg] = useState("");
  const editorDirty = JSON.stringify({ t: textEdits, b: pageBgEdits }) !== savedSnapshot;
  const openEditor = (edit: string, label: string, current: string) => setPanel({ edit, label, value: current });
  const pageBgFor = (key: string | null): PageBgKind | undefined => {
    if (!key) return undefined;
    const e = pageBgEdits[key];
    if (e && e !== "global") return e;
    return PAGE_BACKGROUNDS[key];
  };
  const setPageBg = (key: string, kind: PageBgKind | "global") => setPageBgEdits((prev) => ({ ...prev, [key]: kind }));
  const saveAllEdits = () => {
    localStorage.setItem("remains-book-text-edits", JSON.stringify(textEdits));
    localStorage.setItem("remains-book-page-bg", JSON.stringify(pageBgEdits));
    setSavedSnapshot(JSON.stringify({ t: textEdits, b: pageBgEdits }));
    setPrMsg(lang === "zh" ? "已保存到本机浏览器。" : "Saved in this browser.");
  };
  const generatePR = async () => {
    setPrMsg(lang === "zh" ? "正在生成 PR…" : "Creating PR…");
    const pageBg: Record<string, PageBgKind> = { ...PAGE_BACKGROUNDS };
    for (const [k, v] of Object.entries(pageBgEdits)) {
      if (v === "global") delete pageBg[k];
      else pageBg[k] = v;
    }
    const payload = { textEdits, pageBg };
    try {
      const res = await fetch("/api/book-pr", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (res.ok && data.url) {
        setPrMsg(`PR: ${data.url}`);
        return;
      }
      throw new Error(data.error || `HTTP ${res.status}`);
    } catch (err) {
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "book-edits.json";
      a.click();
      URL.revokeObjectURL(a.href);
      setPrMsg(
        lang === "zh"
          ? `自动生成失败（${err instanceof Error ? err.message : "网络问题"}），已下载 book-edits.json，把它发给 Beignet 即可生成同样的 PR。`
          : "Automatic PR failed; book-edits.json downloaded instead — send it to Beignet.",
      );
    }
  };
  const stageRef = useRef<HTMLDivElement>(null);

  usePageMeta({
    title: `${b.title} — ${b.cta}`,
    description: "Remains, a print-ready art book by Chun Wang. Covers and interior pages laid out for PDF export.",
    path: "/catalogs/book",
    noindex: true,
  });

  const { ctx, pages } = useBookModel({ editMode, textEdits, pageBgEdits, pageBgFor, setPageBg, openEditor });
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
              <div className="bk-wrap-back"><BackCoverFace /></div>
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
      ...interior,
      { key: "back", side: "single", node: <section className="bk-page bk-single bk-tone-ink"><BackCoverFace /></section> },
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
    <div className={`bk-root bk-paper-${paper}`} style={rootStyle}>
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
            <div className="flex">
              {(
                [
                  ["white", "White", "白色"],
                  ["cream", "Cream", "米色"],
                  ["black", "Black", "黑色"],
                ] as const
              ).map(([k, en, zh]) => (
                <button key={k} type="button" onClick={() => setPaper(k)} className={`${toggleClass(paper === k)} -ml-px first:ml-0`}>
                  {lang === "zh" ? zh : en}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setEditMode((v) => !v)} className={toggleClass(editMode)}>
              {lang === "zh" ? "编辑模式" : "Edit mode"}
            </button>
            {editMode && (
              <>
                <button type="button" onClick={saveAllEdits} disabled={!editorDirty} className={toggleClass(false)}>
                  {lang === "zh" ? "保存内容修改" : "Save edits"}
                  {editorDirty ? " *" : ""}
                </button>
                <button type="button" onClick={generatePR} className={toggleClass(false)}>
                  {lang === "zh" ? "生成PR" : "Make PR"}
                </button>
              </>
            )}
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

      {panel && (
        <div data-noprint className="bk-editor-panel">
          <div className="bk-editor-head">
            <span className="sans-label">{panel.label}</span>
            <span className="bk-editor-hint">{lang === "zh" ? "改完点「确定」应用到页面，再点工具栏「保存内容修改」存好" : "Apply, then Save edits in the toolbar"}</span>
          </div>
          <textarea value={panel.value} onChange={(e) => setPanel({ ...panel, value: e.target.value })} rows={10} />
          <div className="bk-editor-actions">
            <button
              type="button"
              onClick={() => {
                setTextEdits((prev) => ({ ...prev, [panel.edit]: panel.value }));
                setPanel(null);
              }}
            >
              {lang === "zh" ? "确定" : "Apply"}
            </button>
            <button type="button" onClick={() => setPanel(null)}>
              {lang === "zh" ? "取消" : "Cancel"}
            </button>
          </div>
        </div>
      )}
      {prMsg && (
        <div data-noprint className="bk-editor-msg sans-label">
          {prMsg}
        </div>
      )}

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
