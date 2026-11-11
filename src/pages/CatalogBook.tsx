import { useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Download, Printer } from "lucide-react";
import "./catalog-book.css";
import { usePageMeta } from "@/hooks/usePageMeta";
import { artistBioHTML } from "@/lib/artistBio";
import { SHOP_URL, SITE_URL } from "@/lib/constants";
import { getCombinedCatalogSections, type CatalogItem, type CatalogSection, type CatalogSectionKey } from "@/lib/printCatalog";
import { translations, type Translations } from "@/lib/translations";
import { PAGE_BACKGROUNDS, hexToRgb, isHexPageBg, rgbToHex, type PageBgKind, type PageBgValue } from "@/lib/pageBackgrounds";
import { IMAGE_EDITS } from "@/lib/imageEdits";
import { PAGE_BACKGROUND_IMAGES, type PageBgImage } from "@/lib/pageBackgroundImages";
import { BOOK_SERIES } from "@/lib/bookSeries";
import { SERIES_PLATES, DEATH_VALLEY_PLATES, EL_OTRO_EXTRA_PLATES, THEATER_EXTRA_PLATES, REMAINS_ORIGIN_PLATES, PRE_IPHONE_ERA_PLATE } from "@/lib/seriesPlates";
import { SPIRIT_BACKGROUNDS, SPIRIT_MOMENT } from "@/lib/spiritBackgrounds";
import { photographyWorks } from "@/lib/photography";
import { EXHIBITIONS, PART_WEBSITES } from "@/lib/exhibitions";
import { watercolors } from "@/lib/watercolors";

// ── Book geometry ─────────────────────────────────────────────────────────────
// US Letter trim so the PDF prints 1:1 on a home/office printer, and matches the standard
// 8.5 × 11 in portrait size offered by print-on-demand services (Lulu, Blurb, IngramSpark).
const TRIM_W = 8.5;
const TRIM_H = 11;
const BLEED = 0.125;
const PX_PER_IN = 96;
// Spine width estimate for a perfect-bound paperback on ~80# (120gsm) uncoated stock:
// pages / 444 in + 0.06 in for the cover board. Swap in your printer's own formula.
export const spineWidth = (pages: number) => Math.round((pages / 444 + 0.06) * 1000) / 1000;

type Part = "complete" | "interior" | "cover";
type Side = "verso" | "recto" | "single";

interface Chapter {
  key: string;
  number: number;
  title: string;
  titleEn?: string;
  titleZh?: string;
  descriptionHtml: string;
  items: { item: CatalogItem; plate: number }[];
  years: string;
  seriesOnly?: boolean;
  /** A big-chapter opening (the websites triptych): paginated like a
   * chapter but stands outside the chapter numbering — number 0, and no
   * num-box in the contents, on the opener or on its essay pages. */
  partIntro?: boolean;
  /** A big chapter's own opening chapter (Inner Wilderness, the objects
   * chapter): keeps its number and plates, but its opener and essay head
   * take the part treatment — rust ground, oversized title. */
  partHead?: boolean;
  seriesTextId?: string;
  /** A chapter may hold back this many trailing essay chunks so paginate()
   * emits them right after the plate whose image_url matches, instead of
   * with the chapter's leading essays. Set where the chapter's essay chunks
   * are built (shop chapter only: the ceramics method note). */
  essayAfterPlate?: { imageUrl: string; trailingChunks: number };
  /** Illustrated long-text chapters (her direction, 2026-11-05): the essay
   * runs in English/Chinese paragraph pairs and specific plates belong at
   * specific points inside that flow. Maps a plate's image_url to the
   * number of essay chunks paginate() emits before that plate. Plates of
   * the chapter that are not listed are emitted after the essay flow, in
   * their original order. Set where the chapter's essay chunks are built. */
  plateBreaks?: Record<string, number>;
  /** Anchor order for plates that share the same break chunk (they are
   * emitted as a group after that chunk, in this order). */
  plateAnchorOrder?: string[];
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
  | { kind: "part-exhibitions"; part: number; chunk: number }
  | { kind: "plate"; chapter: Chapter; item: CatalogItem; plate: number }
  | { kind: "plateGrid"; chapter: Chapter; entries: { item: CatalogItem; plate: number }[] }
  | { kind: "plateSpread"; half: "left" | "right"; chapter: Chapter; entries: { item: CatalogItem; plate: number }[] }
  | { kind: "bleed"; half: "left" | "right"; chapter: Chapter; item: CatalogItem }
  | { kind: "aphorism"; half: "left" | "right"; aphorism: Aphorism }
  | { kind: "motto"; chapter: Chapter; text: { en: string; zh: string }; keySuffix?: string }
  | { kind: "about"; chunk: number }
  | { kind: "collage"; chunk: number }
  | { kind: "reverse-index"; chunk: number }
  | { kind: "canva"; page: number }
  | { kind: "blank" };

export interface InteriorPage {
  spec: PageSpec;
  number: number;
}

/** Facsimile pages printed full bleed, edge to edge, instead of framed
 * inside the page (her direction, 2026-11-08: the light-blue cloth page,
 * p. 18, fills the sheet; aligned right when cover-fit so the crop eats
 * the scan's blank margin, not the painting). */
const CANVA_FULL_BLEED_PAGES = new Set([18]);

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

/** Her direction (2026-11-05): a bilingual display title never runs the two
 * languages together — English on its own line, Chinese on the line below. */
function stackedPair(en: string, zh?: string): ReactNode {
  if (zh && zh !== en) {
    return (
      <>
        {en}
        <span className="bk-title-zh-line">{zh}</span>
      </>
    );
  }
  return en;
}

function stackedTitle(chapter: Chapter): ReactNode {
  return stackedPair(chapter.titleEn ?? chapter.title, chapter.titleZh);
}
const plainText = (html: string) => html.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
const hasCjk = (s: string) => /[\u4e00-\u9fff]/.test(s);
// Dated passages — her own writings that carry a date — are indented
// into a narrower column, date line included (design E, her pick,
// 2026-11-06; it replaces the white-space setting of PR #145). The
// text itself is untouched, only its measure narrows.
const indentItem = (item: EssayItem, end = false): EssayItem => ({
  ...item,
  html: item.html.replace(/^<p>/, `<p><span class="bk-indent${end ? " bk-indent--end" : ""}">`).replace(/<\/p>$/, "</span></p>"),
});

/** Chapter opener spreads are uniformly black with white type
 *  (her direction, 2026-10-18); each chapter's epigraph sits in the
 *  spread's upper field (CHAPTER_EPIGRAPH below). */

/** One short epigraph per chapter, printed small in the upper field of
 *  the chapter's opener spread.
 *  Sourcing rule (her discipline): only lines that already stand in this book
 *  for that chapter, the chapter's own text, verbatim, or her own words.
 *  Nothing is written for the slot. Chapters whose book text carries no such
 *  line (Still Things, Unfinished Archive) get none. */
const CHAPTER_EPIGRAPH: Record<string, { en: string; zh: string }> = {
  // Spirit keeps its title spread, but its sentence stands on its own
  // quiet page inside the chapter (her direction, 2026-11-09 — the
  // small-type page from her screenshot of the old book, its p. 30):
  // the empty entry holds the spread open with no sentence printed on
  // it. The sentence itself lives in SPIRIT_QUIET_TEXT below.
  spirit: {
    en: "",
    zh: "",
  },
  // Still Things gets its opener spread (her direction, 2026-11-10):
  // the section had none because it carried no epigraph. The empty
  // entry holds the spread open with no sentence printed on it (the
  // IMMEMORY/Spirit precedent) — title and number only.
  stillthings: {
    en: "",
    zh: "",
  },
  remains: {
    en: "The figurines have outlasted an empire. They will probably outlast the video call.",
    zh: "陶俑熬过了一个帝国。它们大概也将熬过视频会议。",
  },
  residuals: {
    en: "These ostensibly insignificant leftovers are transformed by the artist into physical evidence of the passage of time.",
    zh: "这些看似微不足道的残余，被艺术家转化成了时间流逝的实物证据。",
  },
  road: {
    en: "The journeys end. The moments remain.",
    zh: "旅程会结束，瞬间留下来。",
  },
  "series:unfinishedpart": {
    en: "When machines learn to create, what remains human?",
    zh: "当机器学会了创造，人身上还剩下什么？",
  },
  // IMMEMORY keeps its title spread, but its sentence moved to the
  // Part 3 opener above (her direction, 2026-11-08): the empty entry
  // holds the spread open with no sentence printed on it.
  "series:immemory": {
    en: "",
    zh: "",
  },
  // Her direction, 2026-11-10: the Part 1 introduction question is
  // deleted from the book (paintingIntroBody emptied the same day);
  // this epigraph was that text's second sentence, printed on this
  // same opener spread. The empty entry holds the Part 1 opener
  // spread open with no sentence printed on it (the IMMEMORY/Spirit
  // precedent).
  "part:afterimages": {
    en: "",
    zh: "",
  },
  // Her direction, 2026-11-09: the sentence that stood here is deleted
  // from the book. The empty entry holds the Part 4 opener spread open
  // with no sentence printed on it (the IMMEMORY/Spirit precedent).
  "series:triptych": {
    en: "",
    zh: "",
  },
  innerwilderness: {
    en: "The land comes first, before language, before the self.",
    zh: "土地在先，在语言之前，在自我之前。",
  },
  deathvalley: {
    en: "The salt flats become mirrors at dawn, doubling the sky.",
    zh: "盐滩在黎明时分成为镜子，复制天空。",
  },
  sahara: {
    en: "An archive of the desert kept by the clock, hour by hour, from 6 to 10.",
    zh: "按钟点保存的沙漠档案，逐小时，从 6 点到 10 点。",
  },
  highlands: {
    en: "Scottish Highlands - Heroism of the Vista.",
    zh: "苏格兰高地：视域的英雄主义。",
  },
  theater: {
    en: "Theatrical moments found on the street.",
    zh: "街头抓到的戏剧感瞬间。",
  },
  photography: {
    en: "We never meet ourselves directly. We arrive by way of other faces.",
    zh: "我们从不直接遇见自己，我们总是绕道他人的面孔抵达。",
  },
  // Shop chapter: no standalone epigraph (her direction, 2026-11-10:
  // the ceramics sentence is folded into the chapter's essay text as
  // its opening line instead of standing alone on the opener spread).
  // Her direction, 2026-11-10: the short question that stood here is
  // replaced by the full sentence (the same sentence the Awwwards
  // nominee page caption quotes).
  "series:negotiated": {
    en: "When machines learn to make art, who can we still be?",
    zh: "当机器学会了做艺术，我们还能成为谁？",
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
  "series:artempath": {
    en: "Opening dialogues between the artist and the viewer as well as among viewers themselves.",
    zh: "在艺术家与观众之间、观众与观众之间开启对话。",
  },
  // Her direction, 2026-11-10: the interview chapter's opener spread
  // is deleted — its epigraph is removed here so no opener is pushed
  // and the chapter begins with its first content page. (The sentence
  // itself stays inside the interview body, where it is quoted from
  // the Shoutout Atlanta interview.)
};

/** The Spirit chapter's sentence, standing alone on a quiet page right
 *  after the chapter's opener spread (the "motto" page spec in
 *  paginate()). Verbatim — it is the chapter's former opener epigraph,
 *  moved, not rewritten. */
const SPIRIT_QUIET_TEXT = {
  en: "This book is more than a retrospective. It is an argument for slowness, demanding the kind of looking that contemporary life rarely permits.",
  zh: "这本书不只是一次回顾。它为缓慢辩护，要求一种当代生活难得允许的凝视。",
};

/** The Spirit chapter's bridge sentence (chosen by her, 2026-11-05),
 *  standing alone on a quiet page at the END of the chapter, after its
 *  last plate and before Part 1's exhibition pages (her direction,
 *  2026-11-09). It used to sit in the essay body; the wording is
 *  verbatim, moved, not rewritten. Book-only: it speaks for this
 *  volume, so it stays out of the shop's shared series description in
 *  21spirit.ts. */
const SPIRIT_BRIDGE_TEXT = {
  en: "Reports and data get washed away by newer information. These paintings fix them in place, this era's way of leaving something of itself.",
  zh: "报道和数据会被新的信息冲走。这些画把它们固定下来，是这个时代留下自己的方式。",
};

/** Exhibition lines are free text carrying their date at the end; pull the
 *  date's first year out to lead the line in bold, leaving the rest of the
 *  wording untouched. The trailing date is identified as a whole first:
 *  every year belonging to it (both ends of a range like "November 1, 2025 –
 *  March 1, 2026" / "2025年11月1日 – 2026年3月1日") comes out, while years
 *  that are part of a name ("LIC-A@Atlantic 2020", "The Wrong Biennale
 *  2025-2026 Edition") stay in place. A 年 right after a removed year goes
 *  with it, and the ", " an English date puts after its day number goes
 *  too, so no separator is left dangling. */
function exhibitionParts(text: string): { year: string; rest: string } {
  const matches = [...text.matchAll(/\d{4}/g)];
  if (matches.length === 0) return { year: "", rest: text.trim() };
  const MONTHS = "January|February|March|April|May|June|July|August|September|October|November|December";
  // A gap between two year tokens belongs to one date expression when it
  // holds only date characters, digits, separators and month names.
  const isDateGap = (gap: string) =>
    gap.replace(new RegExp(MONTHS, "g"), "").replace(/[\s,，、·–—\-\d年月日]/g, "") === "";
  // Walk left from the last year across date-expression gaps to the first
  // year of the trailing date. A compact "YYYY-YYYY" inside a name (an
  // edition label) is not a date range: never cross into its tail year over
  // a bare punctuation gap.
  let start = matches.length - 1;
  while (start > 0) {
    const prev = matches[start - 1];
    const cur = matches[start];
    const prevIdx = prev.index ?? 0;
    const gap = text.slice(prevIdx + 4, cur.index ?? 0);
    if (!isDateGap(gap)) break;
    const barePunctuation = gap.replace(/[\s,，、·–—-]/g, "") === "";
    if (barePunctuation && /\d{4}-$/.test(text.slice(Math.max(0, prevIdx - 5), prevIdx))) break;
    start--;
  }
  const dateYears = matches.slice(start);
  let rest = text;
  // Remove the date's years from last to first so indices stay valid.
  for (let i = dateYears.length - 1; i >= 0; i--) {
    const idx = dateYears[i].index ?? 0;
    let from = idx;
    // An English date sets its year off with ", " after the day number
    // ("November 1, 2025"): that comma goes too. A comma after a word is a
    // segment separator ("online, 2021 – permanent") and stays.
    if (rest.slice(Math.max(0, idx - 2), idx) === ", " && /\d/.test(rest[idx - 3] ?? "")) from = idx - 2;
    let to = idx + 4;
    if (rest[to] === "年") to++;
    rest = rest.slice(0, from) + rest.slice(to);
  }
  rest = rest
    .replace(/\s+/g, " ")
    .replace(/,\s*,/g, ",")
    .replace(/，\s*，/g, "，")
    .replace(/,\s*[–—-]\s*/g, ", ")
    .replace(/，\s*[–—-]\s*/g, "，")
    .replace(/^[\s,，、·–—-]+/, "")
    .replace(/[\s,，、·–—-]+$/, "")
    .trim();
  return { year: dateYears[0][0], rest };
}

/** ── Exhibition & award credits, consolidated at each part's end ──────────
 * Her direction, 2026-11-08: every work's exhibition and award information
 * is listed once, at the end of the part the work belongs to, grouped by
 * section — no longer as a separate closing page per section. The single
 * data source stays EXHIBITIONS (src/lib/exhibitions.ts), keyed by section;
 * this block only regroups it under the book's five parts (the same
 * membership the contents page uses) and splits each part's list across as
 * many pages as it needs, breaks falling between groups where possible.
 * Sections that stand outside the five parts (the closing interview) keep
 * their own per-section exhibitions page. */
const PART_SECTIONS: Record<number, string[]> = {
  1: ["remains", "residuals", "stillthings", "road", "spirit"],
  2: ["innerwilderness", "deathvalley", "sahara", "highlands", "theater", "photography"],
  3: ["series:unfinished", "series:google", "series:feedscanner", "series:artempath"],
  4: ["series:immemory", "series:cavedance", "series:negotiated"],
  5: ["shop"],
};
const SECTION_PART: Record<string, number> = Object.fromEntries(
  Object.entries(PART_SECTIONS).flatMap(([part, keys]) => keys.map((k) => [k, Number(part)] as [string, number])),
);

/** Canonical section titles for the credits lists (her rule, 2026-11-08:
 * chapter and series names print in one canonical form everywhere). The
 * three photography sections were renamed the same day — Reflections in
 * the Death Valley; Sahara from 6 to 10: An Archive (撒哈拉晚六时至早十时,
 * the full titleZh in her photography data); Scottish Highlands -
 * Heroism of the Vista — and the lists use the new names even while a
 * rename is still landing in the chapter data itself; once it lands,
 * this table and the chapter titles agree. */
const CANONICAL_SECTION_TITLE: Record<string, { en: string; zh?: string }> = {
  deathvalley: { en: "Reflections in the Death Valley", zh: "死亡谷" },
  sahara: { en: "Sahara from 6 to 10: An Archive", zh: "撒哈拉晚六时至早十时" },
  highlands: { en: "Scottish Highlands - Heroism of the Vista", zh: "苏格兰高地：视域的英雄主义" },
};

/** Fixed title of every credits page (her direction, 2026-11-08: a part's
 * closing list must say plainly that it is the exhibition & award list).
 * The fixed bilingual title heads the page; the part or chapter name
 * moves up into the eyebrow as the attribution. */
const CREDITS_TITLE = { en: "Exhibitions and Awards", zh: "展览与奖项" };

/** A credits entry; website lines carry `url` + `nameKey` instead of the
 * en/zh pair (their printed name follows the named section's title). */
type ExhibitionChunkEntry = { en: string; zh: string; url?: string; nameKey?: string };
type ExhibitionGroupChunk = { key: string; entries: ExhibitionChunkEntry[]; continued: boolean };
/** Page budgets in inches for the credits lists, from the .bk-exhibitions
 * metrics (page content height 9.15in; first page also pays the list's top
 * margin and the part head, continuation pages only the top margin). Entry
 * heights are estimated from text length at the set line metrics, kept
 * conservative so a list page never clips. */
const EXHIBITIONS_FIRST_PAGE_IN = 7.55;
const EXHIBITIONS_CONT_PAGE_IN = 8.55;
const EXHIBITIONS_GROUP_HEAD_IN = 0.92;
const exhibitionEntryIn = (e: ExhibitionChunkEntry): number =>
  e.url
    ? 0.52
    : Math.ceil(e.en.length / 82) * 0.219 + Math.ceil(e.zh.length / 50) * 0.201 + 0.26;

function partExhibitionChunks(part: number): ExhibitionGroupChunk[][] {
  const groups: { key: string; entries: ExhibitionChunkEntry[] }[] = (PART_SECTIONS[part] ?? [])
    .filter((k) => EXHIBITIONS[k]?.length)
    .map((k) => ({ key: k, entries: EXHIBITIONS[k] }));
  // The part's website lines stand as the credits list's last group,
  // after every exhibition and award entry (her direction, 2026-11-09);
  // the chunker flows the group to the next page when it no longer fits.
  const sites = PART_WEBSITES[part] ?? [];
  if (sites.length) {
    groups.push({
      key: "__websites__",
      entries: sites.map((s) => ({ en: "", zh: "", url: s.url, nameKey: s.key })),
    });
  }
  const pages: ExhibitionGroupChunk[][] = [];
  let cur: ExhibitionGroupChunk[] = [];
  let budget = EXHIBITIONS_FIRST_PAGE_IN;
  const flush = () => {
    if (cur.length) pages.push(cur);
    cur = [];
    budget = EXHIBITIONS_CONT_PAGE_IN;
  };
  for (const g of groups) {
    let rest = [...g.entries];
    let headPending = true;
    while (rest.length) {
      const headCost = headPending ? EXHIBITIONS_GROUP_HEAD_IN : 0;
      let take = 0;
      let used = headCost;
      while (take < rest.length && used + exhibitionEntryIn(rest[take]) <= budget) {
        used += exhibitionEntryIn(rest[take]);
        take++;
      }
      if (take === 0) {
        if (cur.length) {
          flush();
          continue;
        }
        take = 1;
        used = headCost + exhibitionEntryIn(rest[0]);
      }
      cur.push({ key: g.key, entries: rest.slice(0, take), continued: !headPending });
      budget -= used;
      rest = rest.slice(take);
      headPending = false;
      if (rest.length) flush();
    }
  }
  flush();
  return pages;
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
  lang?: "en" | "zh" | "mixed";
  items: EssayItem[];
}

/** Chunk paragraphs (carrying their source edit ids) by plain length.
 * Each paragraph also pays `overhead` characters for the vertical space its
 * paragraph break takes on the page (the essay paragraph gap is ~0.56 of a
 * line); counting characters alone under-measures many-paragraph texts and
 * lets the last chunk overflow the page (see chunkItems). */
function chunkParas(paras: ParaItem[], maxChars: number, overhead = 0): { paras: ParaItem[] }[] {
  const out: { paras: ParaItem[] }[] = [];
  let cur: ParaItem[] = [];
  let len = 0;
  for (const p of paras) {
    if (cur.length > 0 && len + p.text.length + overhead > maxChars) {
      out.push({ paras: cur });
      cur = [];
      len = 0;
    }
    cur.push(p);
    len += p.text.length + overhead;
  }
  if (cur.length > 0) out.push({ paras: cur });
  return out.length > 0 ? out : [{ paras: [] }];
}

/** Chunk essay items (paragraph blocks carrying their edit ids) by cost.
 * The old rule counted plain characters only, which silently assumed every
 * character costs the same page space. It does not: a paragraph break costs
 * ~0.56 of a line, each <br /> costs a full line, and a first chunk shares
 * its page with the chapter head. Many-paragraph essays (the interview,
 * Negotiated Intelligence, Art.empath.io) therefore overflowed their last
 * page: text ran into the folio band and the tail of a paragraph was
 * clipped off the sheet (seen on the interview's first Chinese page,
 * 2026-10-25). The cost model below charges for breaks and line breaks,
 * and `headSeed` pre-charges the first chunk for the chapter head. */
interface ChunkCost {
  /** Characters charged per paragraph for its paragraph break. */
  overhead: number;
  /** Characters charged per <br /> (one full line). */
  brCost: number;
  /** Cost pre-charged to the first chunk (the chapter head shares its page). */
  headSeed?: number;
}
function chunkItems(items: EssayItem[], maxChars: number, cost: ChunkCost): EssayItem[][] {
  const out: EssayItem[][] = [];
  let cur: EssayItem[] = [];
  let len = cost.headSeed ?? 0;
  for (const it of items) {
    const n = plainText(it.html).length + cost.overhead + (it.html.match(/<br/g) ?? []).length * cost.brCost;
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
  /** Longer breathing texts (a short paragraph, not one sentence) set smaller. */
  long?: boolean;
  /** Quiet pages (her direction, 2026-11-09): the spread is set small
   *  like the old book's motto page — a short rule, small serif type,
   *  the languages stacked on the spread's left page, its right page
   *  left empty. See the .bk-quiet styles. */
  quiet?: boolean;
}

const APHORISMS: Record<string, Aphorism> = {
  // Her direction, 2026-11-09: both lines are deleted from this spread —
  // first the English, then (follow-up the same day) the Chinese too.
  // What stands is the painting itself and, on the right page, the small
  // work credit for the painting (Notes from the Road #2).
  "what-remains": { id: "what-remains" },
  journeys: { id: "journeys", en: "The journeys end. The moments remain.", zh: "旅程一次次散场，这些瞬间留了下来。" },
  "human-touch": { id: "human-touch", en: "The 'human touch' remains a refuge, a place machines cannot tread." },
  theme: {
    id: "theme",
    quiet: true,
    en: "The theme of this book is what remains, and its method is the archive.",
    zh: "留下了什么，是这本书的主题；档案，是它的方法。",
  },
  "cover-story": {
    id: "cover-story",
    long: true,
    en: "Ah, the glamorous cover being the story they sell: AI for humanity, curing disease, abundance for all. The shinier the mission looks, the less anyone asks what's underneath it: the capex machine, the credit, the concentration of compute and power in a handful of hands. Profit extraction works best when it looks like salvation.",
    zh: "啊，光鲜的封面正是他们兜售的故事：AI 为了人类，治愈疾病，人人富足。使命看上去越闪亮，越没有人追问它底下盖着什么：资本开支的机器、信贷、集中在一小撮人手里的算力和权力。利润的榨取，在看起来像救赎的时候，最为奏效。",
  },
};

/** Aphorism text with the question mark picked out in rust — the only
 * colour on the spread (her direction, 2026-11-06). Applies to both the
 * halfwidth "?" and the fullwidth "？"; the mark inherits the surrounding
 * size, so it stays huge in the English and small in the Chinese. */
const withRustQ = (text: string) =>
  text.split(/([?？])/g).map((part, i) =>
    part === "?" || part === "？" ? (
      <span key={i} className="bk-aphorism-q">{part}</span>
    ) : (
      part
    ),
  );

/** Aphorism spreads placed immediately before these chapters. The first
 * one ("What remains?") goes after the front matter, before chapter one. */
const APHORISM_BEFORE_CHAPTER: Record<string, string> = {
  // Her direction, 2026-11-09: the "human-touch" aphorism spread before
  // IMMEMORY is deleted — the binding is removed so the spread is never
  // pushed. (The sentence still stands inside the Spirit essay, where it
  // is body text, not an aphorism page.)
  // Her direction, 2026-11-10: the "theme" aphorism spread before the
  // interview is deleted — the binding is removed so the spread is
  // never pushed, and the interview follows what precedes it directly.
  // Her direction, 2026-11-10: the "cover-story" aphorism no longer
  // stands as a spread before Negotiated Intelligence — it is a single
  // quiet page inside the chapter, right after its opener spread (see
  // the motto push in paginate() below). The binding is removed so the
  // spread is never pushed.
};

/** "Collage as Method", a short front-matter essay standing right after
 * About the Artist and before the first chapter (her direction, 2026-10-20).
 * English page first, Chinese page second, like the preface. Note: the
 * Chinese text is a drafted translation, not her own wording (item D-1 in
 * the drafted-text audit) — never describe it as her verbatim text. */
const COLLAGE_METHOD = {
  en: "Collage is how I think. A pottery figurine made to accompany the dead stands in a museum case; I cut it loose and set it down in a video meeting, next to a toilet, beside a limousine, and the two thousand years between them collapse into one flat, funny surface. A search history, that small pile of electronic waste, is cut out of the browser and pasted next to a stranger's testimony from the other side of a pandemic. Portraits of others and self-portraits take turns on the same page, lending each other a self. Nothing keeps its original context. Everything keeps its edges. I do not blend the fragments into one smooth voice. I let them stand side by side, seam showing, until the spark of continuity jumps across the gap. That is what an archive is, the way I make one: not a box where the past is stored, but a table where what is about to disappear is laid out next to what has already survived, so they can keep each other company.",
  zh: "拼贴是我思考的方式。一个为陪伴逝者而做的陶俑，站在博物馆的玻璃柜里；我把它剪下来，放进一场视频会议，放在一只马桶旁边，一辆豪车旁边，它们之间的两千年，就塌成了一个扁平的、好笑的表面。搜索记录，那一小堆电子垃圾，从浏览器里剪出来，贴在一份来自疫情另一端的陌生人证言旁边。他人的肖像与自画像在同一页上轮流出现，互相借出一个自我。没有什么还留在原来的语境里。每一块都留着自己的边缘。我不把这些碎片融成一个光滑的声音。我让它们并排站着，接缝露在外面，直到连续性的火花从缝隙里跳过去。这就是档案，按我的做法：不是一只收纳过去的箱子，而是一张桌子，即将消失的东西被摆在已经幸存下来的东西旁边，让它们彼此做伴。",
};

/** The reverse index (her idea; sample page approved 2026-11-05): back
 * matter that indexes the book not by page but by what remains — a sound,
 * a temperature, an unfinished sentence. It stands after the last chapter,
 * before the closing page. The first 21 entries are exactly as approved
 * on the sample page; do not edit those phrases. Later the same day she
 * asked for the index's pages filled by adding entries rather than by
 * stretching the leading, so 19 more remainders were added at the end of
 * each group, every one drawn from the book's own contents (series texts,
 * plate captions, her preface, her diary pages and object texts).
 * Pointers name the chapter or work each remainder lives in, in the
 * book's current names. */
const REVERSE_INDEX = {
  titleZh: "反向索引",
  titleEn: "An Index of What Remains",
  taglineZh: "这份索引不按页码。按还剩下什么。",
  taglineEn: "Nothing here is found by page. Everything is found by what remains.",
  groups: [
    {
      zh: "声音",
      en: "Sounds",
      entries: [
        { zh: "一次冲水的声音", en: "a toilet, flushing once", to: "遗迹 Remains" },
        { zh: "陶俑对着电话的喊声", en: "a figurine, shouting into a phone", to: "遗迹 Remains" },
        { zh: "玻璃柜里的安静", en: "the quiet inside a glass case", to: "前言 Preface" },
        { zh: "白立方里的沉默", en: "the silence of the white cube", to: "Art.empath.io" },
        { zh: "成千上万样东西的尖叫", en: "a thousand things, screaming for attention", to: "信息流扫描仪 Feed Scanner" },
        { zh: "在巴黎教堂偶然听到的维瓦尔第", en: "Vivaldi, overheard in a Paris church", to: "出发 Notes from the Road" },
      ],
    },
    {
      zh: "温度",
      en: "Temperatures",
      entries: [
        { zh: "恶水盆地上热得发亮的盐", en: "salt glittering with heat at Badwater", to: "死亡谷 Reflections in the Death Valley" },
        { zh: "按钟点存下的沙漠的热", en: "desert heat, kept by the hour", to: "撒哈拉晚六时至早十时 Sahara from 6 to 10" },
        { zh: "一趟旅程散掉之后，变了的天气", en: "the weather, changed after a journey ends", to: "前言 Preface" },
        { zh: "一个没被自动化的决定的温度", en: "the warmth of a decision not automated", to: "协商智能 Negotiated Intelligence" },
        { zh: "Quiraing 雾里的冷", en: "the cold inside the Quiraing fog", to: "苏格兰高地：视域的英雄主义 Scottish Highlands - Heroism of the Vista" },
      ],
    },
    {
      zh: "光",
      en: "Light",
      entries: [
        { zh: "罗斯科要求的低垂的灯光", en: "the low light Rothko asked for", to: "Art.empath.io" },
        { zh: "画前八英尺的距离", en: "eight feet from the painting", to: "Art.empath.io" },
        { zh: "把陶俑照得像珠宝的灯光", en: "light that makes a figurine look like a jewel", to: "前言 Preface" },
        { zh: "不会再以同样方式回来的光", en: "light that will not come back the same way", to: "前言 Preface" },
        { zh: "一具由光组成的舞者身体", en: "a dancer's body, made of light", to: "窟舞 Cave Dance" },
        { zh: "黎明里成为镜子的盐滩", en: "salt flats, turned mirrors at dawn", to: "死亡谷 Reflections in the Death Valley" },
        { zh: "冰岛纯净到让人落泪的蓝", en: "a blue so pure it made her cry, in Iceland", to: "出发 Notes from the Road" },
      ],
    },
    {
      zh: "痕迹",
      en: "Traces",
      entries: [
        { zh: "早餐过后，盘子上的污渍", en: "stains on a plate after breakfast", to: "早餐残留 Breakfast Residuals" },
        { zh: "被清空之前的一小堆搜索记录", en: "a small heap of searches, about to be cleared", to: "谷歌搜索 Google Searches" },
        { zh: "一万份对疫情的回应", en: "ten thousand answers to a pandemic", to: "IMMEMORY" },
        { zh: "一张车票，一块石头", en: "a ticket stub, a stone", to: "前言 Preface" },
        { zh: "被观众撕下带走的字条", en: "paper slips, torn off and taken away", to: "Art.empath.io" },
        { zh: "一条从巴塞罗那到马德里的火车票", en: "one search: a train ticket to Madrid", to: "谷歌搜索 Google Searches" },
        { zh: "在信息流上移动的扫描线", en: "a scan line, moving down the feed", to: "信息流扫描仪 Feed Scanner" },
        { zh: "剪开又重新拼起的碎片", en: "fragments, cut apart and reassembled", to: "遗迹 Remains" },
        { zh: "一页 2020 年的疫情日志", en: "one page of a pandemic journal, 2020", to: "IMMEMORY" },
        { zh: "一份没有身体的舞谱", en: "a dance score, without its body", to: "窟舞 Cave Dance" },
      ],
    },
    {
      zh: "没说完的话",
      en: "Unfinished Words",
      entries: [
        { zh: "访谈里一句没说完的话", en: "a sentence in an interview, left unfinished", to: "艺术家访谈 Artist Interview" },
        { zh: "会议上的一句「无可奉告」", en: "“nothing to contribute,” said at a meeting", to: "遗迹 Remains" },
        { zh: "先于陶俑消失的语言", en: "the language that vanished before the figurine did", to: "前言 Preface" },
        { zh: "机械臂写到一半的「我是人……」", en: "“I am huma—”, by a robot arm", to: "协商智能 Negotiated Intelligence" },
        { zh: "没人回答的问题：我们还能成为谁", en: "unanswered: who can we still be?", to: "协商智能 Negotiated Intelligence" },
      ],
    },
    {
      zh: "没吃完的",
      en: "Left on the Plate",
      entries: [
        { zh: "盘子被收走前的一顿早餐", en: "a breakfast, before the plate is taken away", to: "早餐残留 Breakfast Residuals" },
        { zh: "用陶重做的一顿早餐", en: "a breakfast, remade in clay", to: "Slightly Useful Objects" },
        { zh: "快要被扔掉、又被戴起来的东西", en: "things nearly thrown away, worn again", to: "Slightly Useful Objects" },
        { zh: "一块陶做的短蛋糕", en: "a shortcake, made of clay", to: "Slightly Useful Objects" },
        { zh: "一台缩成吊坠的烤面包机", en: "a toaster, shrunk to a pendant", to: "Slightly Useful Objects" },
        { zh: "悬崖上，金刚鹦鹉的早餐", en: "breakfast on a cliff, at four in the morning", to: "出发 Notes from the Road" },
      ],
    },
  ],
};

/** Which groups stand on which page of the reverse index (her direction,
 * 2026-11-05, refined the same day): the index may run to several pages —
 * enough air between and inside the groups, even at the cost of another
 * page — but it must stay an index: dotted leaders, right-aligned
 * pointers, group heads with their hairlines. Breaks fall between groups. */
const REVERSE_INDEX_CHUNKS: number[][] = [
  [0, 1, 2], // 声音 · 温度 · 光
  [3, 4, 5], // 痕迹 · 没说完的话 · 没吃完的
];

/** Print rule (her direction, 2026-11-06): no online-lookup lines and no
 * bare URLs are printed anywhere in the book. (The 2026-10-25 apparatus
 * that wrote each web work's URL out at the end of its essay is removed.) */

/** In-text plate anchors for the illustrated long-text chapters (her
 * direction, 2026-11-05): each listed plate is emitted right after the
 * essay paragraph pair it belongs to (indexes are 0-based into the
 * section's English text), restoring the image to the spot its own text
 * refers to. Plates of these chapters that are not listed keep the
 * plates-after-text position, in their original order. */
const SERIES_PLATE_ANCHORS: Record<string, { image: string; afterPair: number }[]> = {
  // Art.empath.io: every image is referred to inside the text — the
  // responses and interface figures sit under their own caption lines.
  artempath: [
    { image: "/book/artempath/printer.jpg", afterPair: 13 }, // after the system description
    { image: "/book/artempath/sfmoma-bench.jpg", afterPair: 15 }, // with the SFMOMA bench photo paragraph
    { image: "/book/artempath/interface-sf.jpg", afterPair: 15 },
    { image: "/book/artempath/responses-rothko.jpg", afterPair: 17 }, // under the Responses figure caption
    { image: "/book/artempath/anderson-wide.jpg", afterPair: 19 }, // with the Anderson Collection paragraph
    { image: "/book/artempath/interface-and.jpg", afterPair: 19 },
    { image: "/book/artempath/responses-mitchell.jpg", afterPair: 25 }, // under the Visualization caption
    { image: "/book/artempath/visualization.jpg", afterPair: 27 }, // end of the visualization account
    { image: "/book/artempath/sfmoma-grid.jpg", afterPair: 28 }, // the closing works paragraph
    { image: "/book/artempath/anderson-grid.jpg", afterPair: 28 },
  ],
  // IMMEMORY: only the Webby nominees screenshot is referred to in the
  // text (the nomination paragraph). The open-call poster and the journal
  // pages are not tied to a paragraph and stay after the text.
  immemory: [{ image: "/book/immemory/webby-nominees.jpg", afterPair: 3 }],
  // Negotiated Intelligence handbook: the diary page belongs to its own
  // dated entry, the pavilion photograph to the review passage that
  // describes the entrance, the nominee badge to the closing question.
  // Seven participating works from the pavilion site are spread through
  // the flow between them (her direction, 2026-11-05).
  negotiated: [
    { image: "/book/negotiated/diary-page.jpg", afterPair: 6 },
    { image: "/book/negotiated/work-elsewhere.jpg", afterPair: 12 },
    { image: "/book/negotiated/work-ave-maria.jpg", afterPair: 19 },
    { image: "/book/negotiated/work-fractured-star.jpg", afterPair: 26 },
    { image: "/book/negotiated/work-silence.jpg", afterPair: 33 },
    { image: "/book/negotiated/work-chimera-haiku.jpg", afterPair: 40 },
    { image: "/book/negotiated/work-dierenleven.jpg", afterPair: 46 },
    { image: "/book/negotiated/pavilion-entrance.jpg", afterPair: 49 },
    { image: "/book/negotiated/work-mythology.jpg", afterPair: 51 },
    { image: "/book/negotiated/awwwards-nominee.jpg", afterPair: 52 },
  ],
  // Feed Scanner: interfaces 1–2 show the homepage walkthrough, interface
  // 3 the font-size control walkthrough. Poster and installation views
  // are not tied to a paragraph and stay after the text.
  feedscanner: [
    { image: "/book/feedscanner/interface-1.jpg", afterPair: 0 },
    { image: "/book/feedscanner/interface-2.jpg", afterPair: 0 },
    { image: "/book/feedscanner/interface-3.jpg", afterPair: 2 },
  ],
  // "My Google Search History …": the film still and interface belong to
  // the reading-aloud film account, the instructions image to the
  // instruction booklet paragraph. Poster and exhibition views stay after.
  google: [
    { image: "/book/google/film-still.jpg", afterPair: 1 },
    { image: "/book/google/interface.jpg", afterPair: 1 },
    { image: "/book/google/instructions.jpg", afterPair: 2 },
  ],
};

/** Which Spirit sub-series have a painting in the book, and where its
 * image lives. Four of the eight background groups have no painting
 * (consumerism, blackmirror, covid, genai — their works are not among
 * this chapter's plates), so only these four anchor into the text flow. */
const SPIRIT_GROUP_PLATES: Record<string, string> = {
  climate: "/21spirit/02/main.jpg",
  attention: "/21spirit/04/main.jpg",
  alonetogether: "/21spirit/01/main.jpg",
  surveillance: "/21spirit/03/main.jpg",
};

// ── Pagination ────────────────────────────────────────────────────────────────
// Odd pages are rectos (right-hand), even pages versos. Chapter openers are two-page spreads,
// so they must start on a verso; a blank is inserted before them whenever needed.
/** Objects-chapter smalls (her grouping rule, 2026-11-07: only this
 *  chapter groups; every work still gets its own caption). A work is
 *  groupable when its largest stated dimension is at most 8 in (or
 *  200 mm), or when it is one of the Slightly Useful Objects series
 *  photographs — the plates that carry the series title itself rather
 *  than a work title: the series' small objects, documented in use.
 *  No stated size and a title of its own -> keeps its own page. */
const smallObject = (item: CatalogItem): boolean => {
  const d = `${item.dimensions ?? ""} ${item.medium ?? ""}`;
  const inNums = [...d.matchAll(/(\d+(?:\.\d+)?)\s*(?:"|″|inches|in\b)/gi)].map((m) => parseFloat(m[1]));
  if (inNums.length) return Math.max(...inNums) <= 8;
  const mmNums = [...d.matchAll(/(\d+(?:\.\d+)?)\s*mm/gi)].map((m) => parseFloat(m[1]));
  if (mmNums.length) return Math.max(...mmNums) <= 200;
  return false;
};

function paginate(chapters: Chapter[], prefaceChunkCount: number, paintingChunkCount: number, essayChunkCounts: Record<string, number>): InteriorPage[] {
  const specs: PageSpec[] = [];
  const nextIsVerso = () => (specs.length + 1) % 2 === 0;
  const pushAphorism = (a: Aphorism) => {
    if (!nextIsVerso()) specs.push({ kind: "blank" });
    specs.push({ kind: "aphorism", half: "left", aphorism: a });
    specs.push({ kind: "aphorism", half: "right", aphorism: a });
  };
  // IMMEMORY's pandemic journal plates are the artist's informal
  // handnotes, not formal works (her direction, 2026-11-09): they no
  // longer take a page each. A contiguous run of them is packed into
  // dense grid fields that fill whole spreads — one continuous canvas
  // across both pages, up to 18 cells (6 x 3) per spread, each image
  // keeping only its small title + meta caption.
  const isJournalPlate = (chapter: Chapter, item: CatalogItem) =>
    chapter.key === "series:immemory" && item.image_url.includes("/book/immemory/journal-");
  const JOURNAL_PER_SPREAD = 18;
  const pushJournalRun = (chapter: Chapter, run: { item: CatalogItem; plate: number }[]) => {
    for (let i = 0; i < run.length; i += JOURNAL_PER_SPREAD) {
      const entries = run.slice(i, i + JOURNAL_PER_SPREAD);
      if (!nextIsVerso()) specs.push({ kind: "blank" });
      specs.push({ kind: "plateSpread", half: "left", chapter, entries });
      specs.push({ kind: "plateSpread", half: "right", chapter, entries });
    }
  };

  specs.push({ kind: "title" });
  specs.push({ kind: "colophon" });
  // The contents is one designed spread (a map, not a list — see the
  // contents render in renderPage): always exactly two pages.
  const tocPages = 2;
  for (let i = 0; i < tocPages; i++) specs.push({ kind: "contents", chunk: i });
  for (let i = 0; i < prefaceChunkCount; i++) specs.push({ kind: "preface", chunk: i });
  // About the Artist stands at the front of the book, right after the preface
  // (her direction, 2026-10-18).
  specs.push({ kind: "about", chunk: 0 });
  specs.push({ kind: "about", chunk: 1 });

  let firstChapter = true;
  for (let chapterIdx = 0; chapterIdx < chapters.length; chapterIdx++) {
    const chapter = chapters[chapterIdx];
    if (firstChapter) {
      pushAphorism(APHORISMS["what-remains"]);
      // Part 1 opens with the same rust-brown spread as every other
      // part (her direction, 2026-11-08 evening). The part has no head
      // chapter of its own — its introduction is the painting essay —
      // so a synthetic part head carries the spread; the painting
      // introduction follows it as the part's sentences.
      const part1Head: Chapter = {
        key: "part:afterimages",
        number: 1,
        title: "Afterimages 余像",
        titleEn: "Afterimages",
        titleZh: "余像",
        descriptionHtml: "",
        items: [],
        years: "",
        partHead: true,
      };
      if (!nextIsVerso()) specs.push({ kind: "blank" });
      specs.push({ kind: "opener", half: "left", chapter: part1Head });
      specs.push({ kind: "opener", half: "right", chapter: part1Head });
      // No standalone introduction page (her direction, 2026-11-08,
      // late): the bilingual introduction text moves onto the right
      // page of the Part 1 opener spread above (see the opener render),
      // and its old page plus the blank that faced it are both
      // cancelled — an even shift, so every later verso alignment and
      // the part page numbers in the contents simply move up two.
      // Collage as Method no longer stands here (her direction,
      // 2026-11-09): the 2018 collage plate and the method essay close
      // Part 1 instead — they are emitted at the part boundary below,
      // after the Spirit chapter, before the part's exhibition pages.
      firstChapter = false;
    }
    // The earlier printed painting book (Canva, "Chun Wang: Paintings
    // 2019–2026") is bound into the painting part as a facsimile (her
    // direction, 2026-11-06: add it in as it stands, duplicates kept).
    // Her review cuts the same day: the Canva cover (p.1), the egg page
    // (p.5) and the whole tail from the Remains divider to the back
    // cover (pp. 23–44) are removed; pp. 2–4 and 6–22 stand.
    // Placement (her direction, 2026-11-08, replacing the same day's
    // earlier single-block placement after Still Things): the
    // facsimile no longer stands as its own block — its pages merge
    // into the two sections they belong to, so Residuals and Still
    // Things each read as one continuous run. The facsimile front
    // matter (pp. 2–4 and 6–10) opens the pair, ahead of the Residuals
    // opener; the facsimile Still Things chapter (pp. 17–22) closes
    // Still Things, emitted at the end of its chapter's run, below.
    // The facsimile pages pp. 11–16 stand as one cluster in page
    // order at the head of Still Things (her direction, 2026-11-09:
    // pp. 13–16 move behind pp. 11–12), emitted with the Still Things
    // chapter pages below.
    // Placement update (her direction, 2026-11-09, later): the
    // Residuals opener spread stands directly after the last Remains
    // plate, so the facsimile front matter (pp. 2–4 and 6–10) no
    // longer precedes it — the front pages are emitted right after
    // the opener spread, below, and open the section's run from
    // there.
    const CANVA_KEPT_PAGES = [2, 3, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 21, 22];
    const CANVA_FRONT_PAGES = CANVA_KEPT_PAGES.filter((p) => p < 11);
    const CANVA_RESIDUALS_PAGES = CANVA_KEPT_PAGES.filter((p) => p >= 13 && p < 17);
    const CANVA_STILLTHINGS_PAGES = CANVA_KEPT_PAGES.filter((p) => p >= 17 && p <= 20);
    // Facsimile placement updates (her direction, 2026-11-08, later the
    // same day): p. 11 — the printed book's "II. Still Things" chapter
    // page — opens the Still Things section as its only chapter page
    // (the section's own text page no longer prints a title head), and
    // pp. 21–22 (the three small still lifes and the brown box) close
    // Notes from the Road instead of Still Things, the section she
    // assigns them to.
    const CANVA_ROAD_PAGES = [21, 22];
    if (chapter.key === "stillthings") {
      specs.push({ kind: "canva", page: 11 });
      // Her review (2026-11-08): facsimile p. 12 — the red-dog still
      // life — moves out of the Residuals run and opens the Still
      // Things section as its first page, right after the section's
      // own chapter page above; facsimile pp. 19–20 (the green chair
      // and the blue bag) are deleted from the book (removed from
      // CANVA_KEPT_PAGES above).
      specs.push({ kind: "canva", page: 12 });
      // Her direction (2026-11-09): the facsimile Residuals chapter
      // (pp. 13–16), which used to close the Residuals section, moves
      // behind pp. 11–12, so the six facsimile pages pp. 11–16 stand
      // as one cluster in page order at the head of Still Things,
      // right after the Residuals plates.
      for (const p of CANVA_RESIDUALS_PAGES) specs.push({ kind: "canva", page: p });
    }
    const aphorismId = APHORISM_BEFORE_CHAPTER[chapter.key];
    if (aphorismId) pushAphorism(APHORISMS[aphorismId]);
    // One opening per chapter (her direction, 2026-10-18): the big-type
    // opener spread alone, no separate title page before it. Series-only
    // chapters open with the same spread; their essay count can be 0.
    // Her direction (2026-11-08): a spread that carries nothing but the
    // chapter's name duplicates the contents and the head of the
    // chapter's own text, so section openers print only where the
    // chapter's epigraph gives the spread content of its own. Section
    // chapters without an epigraph (Still Things, the Life section)
    // open directly with their first text or plate page.
    // Her direction (2026-11-08, evening — supersedes the same-day rule
    // for part heads): every part opens with the rust-brown opener
    // spread, the Inner Wilderness pattern, whether or not its head
    // carries an epigraph; the part's introduction or first work
    // follows the spread. Part heads without an epigraph (the
    // Unfinished Archive, which has no introduction text at all) print
    // the title alone.
    // Her direction, 2026-11-10: the Pre-iPhone Era full-bleed spread
    // leaves the shop chapter and stands immediately before the Part 5
    // opener spread, as the last spread of Part 4 (it was previously
    // pushed inside the shop chapter, after its opening text).
    if (chapter.key === "shop") {
      if (!nextIsVerso()) specs.push({ kind: "blank" });
      specs.push({ kind: "bleed", half: "left", chapter, item: PRE_IPHONE_ERA_PLATE });
      specs.push({ kind: "bleed", half: "right", chapter, item: PRE_IPHONE_ERA_PLATE });
    }
    if (CHAPTER_EPIGRAPH[chapter.key] || chapter.partHead || chapter.partIntro) {
      if (!nextIsVerso()) specs.push({ kind: "blank" });
      specs.push({ kind: "opener", half: "left", chapter });
      specs.push({ kind: "opener", half: "right", chapter });
    }
    // The cover-story text stands as ONE quiet page inside Negotiated
    // Intelligence, immediately after the chapter's opener spread and
    // before its essay (her direction, 2026-11-10 — it was an aphorism
    // spread before the chapter; she asked for a single page in the
    // quiet-page treatment instead). Texts verbatim from APHORISMS.
    if (chapter.key === "series:negotiated") {
      const cs = APHORISMS["cover-story"];
      if (cs.en && cs.zh) {
        specs.push({ kind: "motto", chapter, text: { en: cs.en, zh: cs.zh }, keySuffix: "cover-story" });
      }
    }
    // The facsimile front matter follows the Residuals opener (her
    // direction, 2026-11-09): the opener spread stands directly after
    // the last Remains plate, and pp. 2–4 and 6–10 open the section's
    // run behind it.
    if (chapter.key === "residuals") {
      for (const p of CANVA_FRONT_PAGES) specs.push({ kind: "canva", page: p });
    }
    // The Spirit chapter's sentence stands on its own quiet page,
    // right after the opener spread, before the chapter's text and
    // plates (her direction, 2026-11-09; the text is SPIRIT_QUIET_TEXT).
    // NOTE 2026-11-10: two same-day orders touched this page — one
    // ordered a page deleted that was described as carrying BOTH the
    // machines sentence and this slowness text, and a later one ordered
    // THIS page (slowness text alone) moved before the Contents.
    // Source inspection shows no page carries both sentences: the
    // machines sentence renders only on the Part 3 opener and inside
    // the Negotiated Intelligence text. Both orders are therefore
    // HELD, unexecuted, pending her decision on which one wins; the
    // page stands here exactly as before.
    if (chapter.key === "spirit") {
      specs.push({ kind: "motto", chapter, text: SPIRIT_QUIET_TEXT });
    }
    const essayCount = essayChunkCounts[chapter.key] ?? (chapter.seriesOnly ? 0 : 1);
    // Illustrated chapters with plates anchored inside the essay flow (see
    // Chapter.plateBreaks): essay chunks and anchored plates are emitted in
    // one merged sequence; unanchored plates follow the essay, in order.
    const breaks = chapter.plateBreaks;
    if (breaks) {
      let emitted = 0;
      const anchored = chapter.items
        .filter(({ item }) => breaks[item.image_url] !== undefined)
        .sort((a, b) => {
          const d = (breaks[a.item.image_url] ?? 0) - (breaks[b.item.image_url] ?? 0);
          if (d !== 0) return d;
          const order = chapter.plateAnchorOrder ?? [];
          const ia = order.indexOf(a.item.image_url);
          const ib = order.indexOf(b.item.image_url);
          return (ia === -1 ? Number.MAX_SAFE_INTEGER : ia) - (ib === -1 ? Number.MAX_SAFE_INTEGER : ib);
        });
      const anchoredUrls = new Set(anchored.map(({ item }) => item.image_url));
      for (const { item, plate } of anchored) {
        const target = Math.min(breaks[item.image_url] ?? 0, essayCount);
        while (emitted < target) {
          specs.push({ kind: "essay", chapter, chunk: emitted });
          emitted++;
        }
        specs.push({ kind: "plate", chapter, item, plate });
      }
      while (emitted < essayCount) {
        specs.push({ kind: "essay", chapter, chunk: emitted });
        emitted++;
      }
      const unanchored = chapter.items.filter(({ item }) => !anchoredUrls.has(item.image_url));
      for (let ui = 0; ui < unanchored.length; ui++) {
        const { item, plate } = unanchored[ui];
        if (isJournalPlate(chapter, item)) {
          const run: { item: CatalogItem; plate: number }[] = [];
          while (ui < unanchored.length && isJournalPlate(chapter, unanchored[ui].item)) {
            run.push(unanchored[ui]);
            ui++;
          }
          ui--;
          pushJournalRun(chapter, run);
        } else {
          specs.push({ kind: "plate", chapter, item, plate });
        }
      }
    } else {
      // Held-back trailing essay chunks (see Chapter.essayAfterPlate) are
      // emitted right after their marked plate; if that plate is absent they
      // close the plate sequence instead, so no text is ever dropped.
      const holdBack = chapter.essayAfterPlate;
      // Residuals (her direction, 2026-11-10): the section's review
      // (the chapter essay) no longer interrupts the plates. The other
      // plates run first, then the review (EN page, then ZH page),
      // then Residuals #1 and #26 close the section as its final
      // spread, in that left/right order. So for this chapter the
      // essay lead count is zero and the essay chunks are emitted
      // inside the plate loop, right before the #1/#26 pair.
      const leadCount = chapter.key === "residuals" ? 0 : holdBack ? Math.max(0, essayCount - holdBack.trailingChunks) : essayCount;
      for (let i = 0; i < leadCount; i++) specs.push({ kind: "essay", chapter, chunk: i });
      // The Pre-iPhone Era full-bleed spread no longer stands here:
      // it moved to just before this chapter's opener spread, as the
      // last spread of Part 4 (her direction, 2026-11-10; see the
      // bleed push ahead of the opener in this loop).
      let heldBackEmitted = false;
      const emitHeldBack = () => {
        if (holdBack && !heldBackEmitted) {
          for (let i = leadCount; i < essayCount; i++) specs.push({ kind: "essay", chapter, chunk: i });
          heldBackEmitted = true;
        }
      };
      if (chapter.key === "shop") {
        // Objects chapter only: small works share a page, up to four to
        // a grid, each with its own caption (her grouping rule,
        // 2026-11-07). Everything else keeps a page of its own, and
        // every other chapter stays one work per page.
        let group: { item: CatalogItem; plate: number }[] = [];
        const flushGroup = () => {
          if (group.length >= 2) specs.push({ kind: "plateGrid", chapter, entries: group });
          else if (group.length === 1) specs.push({ kind: "plate", chapter, item: group[0].item, plate: group[0].plate });
          group = [];
        };
        for (const { item, plate } of chapter.items) {
          if (item.title === chapter.titleEn || smallObject(item)) {
            group.push({ item, plate });
            if (group.length === 4) flushGroup();
          } else {
            flushGroup();
            specs.push({ kind: "plate", chapter, item, plate });
          }
          if (holdBack && item.image_url === holdBack.imageUrl) {
            flushGroup();
            emitHeldBack();
          }
        }
        flushGroup();
      } else {
        // Residuals plate order (her direction, 2026-11-10): rotate
        // the two lead plates (#1, #26) to the end of the run so the
        // review can stand before them (see the leadCount note above);
        // every other chapter keeps its item order untouched.
        const plateSeq = chapter.key === "residuals" ? [...chapter.items.slice(2), ...chapter.items.slice(0, 2)] : chapter.items;
        for (let ii = 0; ii < plateSeq.length; ii++) {
          const { item, plate } = plateSeq[ii];
          if (isJournalPlate(chapter, item)) {
            const run: { item: CatalogItem; plate: number }[] = [];
            while (ii < plateSeq.length && isJournalPlate(chapter, plateSeq[ii].item)) {
              run.push(plateSeq[ii]);
              ii++;
            }
            ii--;
            pushJournalRun(chapter, run);
          } else {
            specs.push({ kind: "plate", chapter, item, plate });
          }
          if (chapter.key === "residuals" && ii === plateSeq.length - 3) {
            for (let ci = 0; ci < essayCount; ci++) specs.push({ kind: "essay", chapter, chunk: ci });
          }
          if (holdBack && item.image_url === holdBack.imageUrl) emitHeldBack();
        }
      }
      if (holdBack && !heldBackEmitted) {
        for (let i = leadCount; i < essayCount; i++) specs.push({ kind: "essay", chapter, chunk: i });
      }
    }
    // Facsimile chapters close their own sections (see the placement
    // note at the facsimile block above): the printed book's Still
    // Things chapter ends the Still Things run, so no page of the
    // section stands apart. (The facsimile Residuals chapter moved to
    // the head of Still Things with pp. 11–12 — see above.)
    if (chapter.key === "stillthings") {
      for (const p of CANVA_STILLTHINGS_PAGES) specs.push({ kind: "canva", page: p });
    }
    if (chapter.key === "road") {
      for (const p of CANVA_ROAD_PAGES) specs.push({ kind: "canva", page: p });
    }
    // The Spirit chapter's bridge sentence closes the chapter on its own
    // quiet page (her direction, 2026-11-09): taken out of the essay body
    // (see the spirit essay assembly below) and set alone after the
    // chapter's last plate, before the part's exhibition pages — the
    // same motto treatment as the chapter's opening quiet page (the
    // text is SPIRIT_BRIDGE_TEXT).
    if (chapter.key === "spirit") {
      specs.push({ kind: "motto", chapter, text: SPIRIT_BRIDGE_TEXT, keySuffix: "bridge" });
    }
    // Exhibition & award credits close the part, not the section (her
    // direction, 2026-11-08): when the next chapter belongs to another
    // part — or the book's chapters run out — the part's consolidated
    // list is emitted here, grouped by section. Chapters outside the
    // five parts (the closing interview) keep their own closing page.
    const sectionPart = SECTION_PART[chapter.key];
    if (sectionPart) {
      const nextChapter = chapters[chapterIdx + 1];
      const nextPart = nextChapter ? SECTION_PART[nextChapter.key] : undefined;
      if (nextPart !== sectionPart) {
        // Collage as Method closes Part 1 (her direction, 2026-11-09):
        // the 2018 Untitled (Collage) plate and the method essay stand
        // together after the part's last chapter, before its credits.
        if (sectionPart === 1) {
          const collageChapter: Chapter = { key: "collage", number: 0, title: "Collage as Method · 作为方法的拼贴", titleEn: "Collage as Method", titleZh: "作为方法的拼贴", descriptionHtml: "", items: [], years: "2018" };
          specs.push({ kind: "plate", chapter: collageChapter, item: REMAINS_ORIGIN_PLATES[0], plate: 0 });
          specs.push({ kind: "collage", chunk: 0 });
        }
        const chunks = partExhibitionChunks(sectionPart);
        for (let i = 0; i < chunks.length; i++) specs.push({ kind: "part-exhibitions", part: sectionPart, chunk: i });
      }
    } else if (EXHIBITIONS[chapter.key]?.length) {
      specs.push({ kind: "exhibitions", chapter });
    }
  }

  // The reverse index closes the book's text: after the last chapter,
  // before the closing page (her direction, 2026-11-05). It runs to more
  // than one page — air first, density never (her word the same day) —
  // with the breaks falling between groups, never inside one.
  for (let chunk = 0; chunk < REVERSE_INDEX_CHUNKS.length; chunk++) {
    specs.push({ kind: "reverse-index", chunk });
  }

  // The book ends at its last content page: the closing imprint page and the
  // trailing signature padding are both deleted (her direction, 2026-11-09),
  // so the total is no longer padded to a multiple of 4.

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

/** One staged picture edit (edit mode): a size change and/or a swapped-in
 * replacement for a picture already in the book, keyed by the picture's
 * own src — stable across pagination shifts, unlike page numbers. It
 * applies everywhere that src is rendered as a framed picture (plates,
 * object grids, facsimile pages), travels in the exported book-edits.json
 * as imageEdits, and persists in this browser like the background-image
 * drafts. */
export interface ImgEdit {
  scale?: number;
  /** Offset of the picture from its default centred position, in
   * percent of its frame (x: of the frame's width, y: of its height). */
  dx?: number;
  dy?: number;
  /** The picture fills its whole page edge to edge (object-fit cover). */
  full?: boolean;
  /** Full-bleed crop position (object-position, percent 0–100): which
   * part of the picture shows inside the page when it is cropped.
   * Adjusted by dragging the picture while it is full bleed. */
  pos?: { x: number; y: number };
  src?: string;
}

/** Live geometry of one rendered picture, registered by EdBookImage so
 * the panel can resize around the picture's centre: the default
 * contain-fitted rect as fractions of its frame. */
const imgGeom = new Map<string, { fx: number; fy: number }>();

/** A framed book picture with the picture-edit tool applied (her
 * direction, 2026-11-08; interaction reworked the same day after her
 * trial: the first version resized around the picture's centre from a
 * handle parked at the frame's corner, so the picture seemed to move
 * while it resized — "跟 Canva 似的" is the bar). Direct manipulation,
 * Canva-style: the selection hugs the picture's own visible rect (the
 * contain-fitted area), dragging a corner resizes with the OPPOSITE
 * corner pinned, dragging the picture itself moves it, and the panel
 * adds a one-click full bleed (the picture covers its whole page).
 * Geometry lives in the edit as scale + offset from the default
 * centred rect, in percent of the frame; outside edit mode the staged
 * edit simply renders, so toggling edit mode off previews the result. */
function EdBookImage({ ctx, src, fallback, alt = "", className, style }: { ctx: BookContext; src: string; fallback?: string; alt?: string; className?: string; style?: CSSProperties }) {
  const edit = ctx.imgEditFor(src);
  const displaySrc = edit?.src ?? src;
  const scale = edit?.scale && edit.scale > 0 ? edit.scale : 1;
  const dx = edit?.dx ?? 0;
  const dy = edit?.dy ?? 0;
  const full = !!edit?.full;
  const selected = ctx.editMode && ctx.imgSel === src;
  const wrapRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    mode: "move" | "nw" | "ne" | "sw" | "se";
    start: { x: number; y: number };
    fr: { width: number; height: number };
    base: { scale: number; dx: number; dy: number };
    baseRect: { x: number; y: number; w: number; h: number };
    fullAtStart: boolean;
    startPos: { x: number; y: number };
    pagePx: { w: number; h: number } | null;
  } | null>(null);
  const [aspect, setAspect] = useState(0);
  const [frameAspect, setFrameAspect] = useState(0);
  const [pageRel, setPageRel] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [pageEl, setPageEl] = useState<Element | null>(null);

  // The picture's natural aspect, via a probe on the same URL.
  useEffect(() => {
    let live = true;
    const probe = new Image();
    probe.onload = () => {
      if (live && probe.naturalHeight > 0) setAspect(probe.naturalWidth / probe.naturalHeight);
    };
    probe.src = displaySrc;
    return () => {
      live = false;
    };
  }, [displaySrc]);

  // Frame aspect + the page's rect relative to the frame (for full
  // bleed). Measured through the always-mounted anchor span after
  // every render: the overlay itself only exists in edit mode, and a
  // mount-only measurement through it left the geometry dead when edit
  // mode was switched on after the page had mounted — the picture
  // looked selected but never responded to drags (her report,
  // 2026-11-08). A ResizeObserver on the frame covers zoom/resize
  // changes that do not re-render.
  useEffect(() => {
    const frame = anchorRef.current?.parentElement;
    if (!frame) return;
    const measured = { fa: 0, rel: null as null | { x: number; y: number; w: number; h: number }, el: null as Element | null };
    const measure = () => {
      const fr = frame.getBoundingClientRect();
      if (fr.width > 0 && fr.height > 0) {
        const fa = fr.width / fr.height;
        if (Math.abs(fa - measured.fa) > 0.0005) {
          measured.fa = fa;
          setFrameAspect(fa);
        }
        const page = frame.closest('[id^="bk-page-"]');
        if (page) {
          if (measured.el !== page) {
            measured.el = page;
            setPageEl(page);
          }
          const pr = page.getBoundingClientRect();
          const rel = { x: ((pr.left - fr.left) / fr.width) * 100, y: ((pr.top - fr.top) / fr.height) * 100, w: (pr.width / fr.width) * 100, h: (pr.height / fr.height) * 100 };
          const prev = measured.rel;
          if (!prev || Math.abs(prev.x - rel.x) > 0.01 || Math.abs(prev.y - rel.y) > 0.01 || Math.abs(prev.w - rel.w) > 0.01 || Math.abs(prev.h - rel.h) > 0.01) {
            measured.rel = rel;
            setPageRel(rel);
          }
        }
      }
    };
    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    ro?.observe(frame);
    return () => ro?.disconnect();
  });

  // Default contain-fitted rect as fractions of the frame.
  const ready = aspect > 0 && frameAspect > 0;
  const fx = ready ? (aspect > frameAspect ? 1 : aspect / frameAspect) : 1;
  const fy = ready ? (aspect > frameAspect ? frameAspect / aspect : 1) : 1;
  if (ready) imgGeom.set(src, { fx, fy });
  // The picture's current rect, in percent of the frame.
  const rect = full && pageRel
    ? pageRel
    : {
        x: (1 - fx) * 50 + dx + ((fx * (1 - scale)) / 2) * 100,
        y: (1 - fy) * 50 + dy + ((fy * (1 - scale)) / 2) * 100,
        w: fx * scale * 100,
        h: fy * scale * 100,
      };
  const imgStyle: CSSProperties = ready
    ? {
        left: `${rect.x}%`,
        top: `${rect.y}%`,
        width: `${rect.w}%`,
        height: `${rect.h}%`,
        objectFit: full ? "cover" : "contain",
        ...(full ? { objectPosition: `${edit?.pos?.x ?? 50}% ${edit?.pos?.y ?? 50}%` } : {}),
      }
    : {};
  const showFullPortal = full && ready && !!pageEl;
  const merged: CSSProperties = showFullPortal ? { ...style, ...imgStyle, visibility: "hidden" } : { ...style, ...imgStyle };

  type Pt = { x: number; y: number };
  /** Canva-standard direct manipulation (v3, 2026-11-08): one press
   * both selects and starts the drag, the pressed element captures
   * the pointer so mouse, touch and pen all track the same way, and
   * touch scrolling is disabled on the tool so a phone drag moves the
   * picture instead of the page. */
  const onDragStart = (e: React.PointerEvent, mode: "move" | "nw" | "ne" | "sw" | "se") => {
    e.preventDefault();
    e.stopPropagation();
    ctx.selectImg(src);
    const frame = anchorRef.current?.parentElement;
    const fr = frame?.getBoundingClientRect();
    if (!fr || fr.width === 0) return;
    try {
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
    } catch {
      /* capture is a progressive enhancement; window tracking below still applies */
    }
    const startRect = { ...rect };
    // Leaving full bleed by dragging: continue from the page rect as
    // plain geometry (its size becomes the new scale baseline).
    const exitFull = full
      ? (() => {
          const s = Math.max(0.1, startRect.w / (fx * 100));
          return {
            scale: s,
            dx: startRect.x - (1 - fx) * 50 - ((fx * (1 - s)) / 2) * 100,
            dy: startRect.y - (1 - fy) * 50 - ((fy * (1 - s)) / 2) * 100,
          };
        })()
      : null;
    const base = exitFull ?? { scale, dx, dy };
    const baseRect = exitFull
      ? { x: startRect.x, y: startRect.y, w: fx * base.scale * 100, h: fy * base.scale * 100 }
      : startRect;
    const prNow = pageEl?.getBoundingClientRect();
    dragRef.current = { pointerId: e.pointerId, mode, start: { x: e.clientX, y: e.clientY }, fr: { width: fr.width, height: fr.height }, base, baseRect, fullAtStart: full, startPos: { x: edit?.pos?.x ?? 50, y: edit?.pos?.y ?? 50 }, pagePx: prNow && prNow.width > 0 ? { w: prNow.width, h: prNow.height } : null };
  };
  const onDragMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d || e.pointerId !== d.pointerId) return;
    e.preventDefault();
    let ddx = ((e.clientX - d.start.x) / d.fr.width) * 100;
    let ddy = ((e.clientY - d.start.y) / d.fr.height) * 100;
    const cur = ctx.imgEditFor(src) ?? {};
    if (d.mode === "move" && d.fullAtStart && (d.pagePx || pageRel)) {
      // Full bleed: dragging slides the crop window over the picture
      // (Canva's fill-position drag) instead of moving the frame.
      const pageWpx = d.pagePx ? d.pagePx.w : (pageRel!.w / 100) * d.fr.width;
      const pageHpx = d.pagePx ? d.pagePx.h : (pageRel!.h / 100) * d.fr.height;
      if (pageWpx > 0 && pageHpx > 0 && aspect > 0) {
        const pageAspect = pageWpx / pageHpx;
        const overX = aspect > pageAspect ? pageHpx * aspect - pageWpx : 0;
        const overY = aspect < pageAspect ? pageWpx / aspect - pageHpx : 0;
        const px = e.clientX - d.start.x;
        const py = e.clientY - d.start.y;
        const nx = overX > 0 ? Math.min(100, Math.max(0, d.startPos.x - (px / overX) * 100)) : d.startPos.x;
        const ny = overY > 0 ? Math.min(100, Math.max(0, d.startPos.y - (py / overY) * 100)) : d.startPos.y;
        ctx.setImgEdit(src, { ...cur, full: true, pos: { x: Math.round(nx * 10) / 10, y: Math.round(ny * 10) / 10 } });
      }
      return;
    }
    // The picture lives on ONE page of a spread: it may bleed to its
    // page's edges but never onto the neighbouring page — past the
    // page edge its handles physically cannot exist (the neighbour
    // page owns those pixels), so movement and growth stop at the
    // page bounds, exactly like a print trim (v5, 2026-11-08).
    if (d.mode === "move") {
      if (pageRel) {
        ddx = Math.min(Math.max(ddx, pageRel.x - d.baseRect.x), pageRel.x + pageRel.w - (d.baseRect.x + d.baseRect.w));
        ddy = Math.min(Math.max(ddy, pageRel.y - d.baseRect.y), pageRel.y + pageRel.h - (d.baseRect.y + d.baseRect.h));
      }
      ctx.setImgEdit(src, { ...cur, full: false, scale: d.base.scale, dx: d.base.dx + ddx, dy: d.base.dy + ddy });
      return;
    }
    // Corner drag: the opposite corner of the rect stays pinned.
    const mode = d.mode;
    const anchor: Pt =
      mode === "se"
        ? { x: d.baseRect.x, y: d.baseRect.y }
        : mode === "nw"
          ? { x: d.baseRect.x + d.baseRect.w, y: d.baseRect.y + d.baseRect.h }
          : mode === "ne"
            ? { x: d.baseRect.x, y: d.baseRect.y + d.baseRect.h }
            : { x: d.baseRect.x + d.baseRect.w, y: d.baseRect.y };
    const corner0: Pt =
      mode === "se"
        ? { x: d.baseRect.x + d.baseRect.w, y: d.baseRect.y + d.baseRect.h }
        : mode === "nw"
          ? { x: d.baseRect.x, y: d.baseRect.y }
          : mode === "ne"
            ? { x: d.baseRect.x + d.baseRect.w, y: d.baseRect.y }
            : { x: d.baseRect.x, y: d.baseRect.y + d.baseRect.h };
    const now: Pt = { x: corner0.x + ddx, y: corner0.y + ddy };
    const d0 = Math.hypot(corner0.x - anchor.x, corner0.y - anchor.y) || 1;
    const d1 = Math.hypot(now.x - anchor.x, now.y - anchor.y);
    let s = Math.min(4, Math.max(0.1, d.base.scale * (d1 / d0)));
    if (pageRel) {
      // Growth stops when the dragged corner reaches the page edge:
      // cap the scale by the room left from the pinned corner to the
      // page bounds, on whichever axis runs out first.
      const availW = mode === "se" || mode === "ne" ? pageRel.x + pageRel.w - anchor.x : anchor.x - pageRel.x;
      const availH = mode === "se" || mode === "sw" ? pageRel.y + pageRel.h - anchor.y : anchor.y - pageRel.y;
      s = Math.min(s, availW / (fx * 100), availH / (fy * 100));
    }
    const w = fx * s * 100;
    const h = fy * s * 100;
    const nx = mode === "se" || mode === "ne" ? anchor.x : anchor.x - w;
    const ny = mode === "se" || mode === "sw" ? anchor.y : anchor.y - h;
    ctx.setImgEdit(src, {
      ...cur,
      full: false,
      scale: Math.round(s * 1000) / 1000,
      dx: nx - (1 - fx) * 50 - ((fx * (1 - s)) / 2) * 100,
      dy: ny - (1 - fy) * 50 - ((fy * (1 - s)) / 2) * 100,
    });
  };
  const onDragEnd = (e: React.PointerEvent) => {
    if (dragRef.current && e.pointerId === dragRef.current.pointerId) dragRef.current = null;
  };
  const dragHandlers = { onPointerMove: onDragMove, onPointerUp: onDragEnd, onPointerCancel: onDragEnd };

  const corners = [
    { k: "nw", cls: "bk-imgedit-h-nw", cursor: "nwse-resize" },
    { k: "ne", cls: "bk-imgedit-h-ne", cursor: "nesw-resize" },
    { k: "sw", cls: "bk-imgedit-h-sw", cursor: "nesw-resize" },
    { k: "se", cls: "bk-imgedit-h-se", cursor: "nwse-resize" },
  ] as const;

  return (
    <>
      <span ref={anchorRef} className="bk-imgedit-anchor" aria-hidden="true" />
      <BookImage src={displaySrc} fallback={edit?.src ? undefined : fallback} alt={alt} className={className} style={merged} />
      {showFullPortal &&
        pageEl &&
        createPortal(
          <img
            src={displaySrc}
            alt={alt}
            draggable={false}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: `${edit?.pos?.x ?? 50}% ${edit?.pos?.y ?? 50}%`,
              pointerEvents: ctx.editMode ? "auto" : "none",
              touchAction: "none",
            }}
            onPointerDown={ctx.editMode ? (e) => onDragStart(e, "move") : undefined}
            {...(ctx.editMode ? dragHandlers : {})}
          />,
          pageEl,
        )}
      {ctx.editMode &&
        (() => {
          // The selection layer renders into the PAGE, not the frame:
          // pages clip at their edges (overflow hidden), and a frame-
          // level layer lost its corner handles whenever the picture
          // was dragged partly past the frame (her Canva-standard
          // retest, 2026-11-08). Page-relative geometry keeps every
          // handle on the page and grabbable.
          const inPage = !!(pageEl && pageRel && ready);
          const oStyle: CSSProperties | undefined = !ready
            ? undefined
            : inPage && pageRel
              ? {
                  left: `${((rect.x - pageRel.x) / pageRel.w) * 100}%`,
                  top: `${((rect.y - pageRel.y) / pageRel.h) * 100}%`,
                  width: `${(rect.w / pageRel.w) * 100}%`,
                  height: `${(rect.h / pageRel.h) * 100}%`,
                  right: "auto",
                  bottom: "auto",
                }
              : { left: `${rect.x}%`, top: `${rect.y}%`, width: `${rect.w}%`, height: `${rect.h}%`, right: "auto", bottom: "auto" };
          const node = (
            <div
              ref={wrapRef}
              className={`bk-imgedit-overlay ${selected ? "bk-imgedit-on" : ""}`}
              style={oStyle}
              onClick={(e) => {
                e.stopPropagation();
                ctx.selectImg(src);
              }}
              onPointerDown={(e) => onDragStart(e, "move")}
              {...dragHandlers}
            >
              {selected &&
                corners.map((cn) => (
                  <div
                    key={cn.k}
                    className={`bk-imgedit-handle ${cn.cls}`}
                    style={{ cursor: cn.cursor }}
                    onPointerDown={(e) => onDragStart(e, cn.k)}
                    {...dragHandlers}
                    title="拖动改大小 · Drag to resize"
                  />
                ))}
            </div>
          );
          return inPage && pageEl ? createPortal(node, pageEl) : node;
        })()}
    </>
  );
}

/** Inline ground for an eyedropper-picked hex background (see PageBgValue):
 * the colour itself as the paper, plus the text variables of whichever
 * preset (white / black) its luminance sits closer to, so type stays
 * legible on any picked colour. Named kinds keep the .bk-bg-* classes. */
function hexBgStyle(hex: string): CSSProperties {
  const rgb = hexToRgb(hex);
  const lum = rgb ? (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255 : 1;
  const dark = lum < 0.5;
  return {
    background: hex,
    "--paper": hex,
    "--text": dark ? "#f0e9da" : "#111111",
    "--muted": dark ? "#a79c86" : "#767066",
    "--rule": dark ? "#3a352a" : "#ddd8ce",
  } as CSSProperties;
}

function Page({ side, tone = "paper", className = "", id, bg, ctl, style, children }: { side: Side; tone?: "paper" | "ink" | "accent"; className?: string; id?: string; bg?: PageBgValue; ctl?: ReactNode; style?: CSSProperties; children?: ReactNode }) {
  const hex = isHexPageBg(bg) ? bg : undefined;
  return (
    <section id={id} style={hex ? { ...hexBgStyle(hex), ...style } : style} className={`bk-page bk-${side} bk-tone-${tone} ${bg && !hex ? `bk-bg-${bg}` : ""} ${className}`}>
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
    case "part-exhibitions":
      return `part-exhibitions:${spec.part}:${spec.chunk}`;
    case "opener":
      return `opener:${spec.chapter.key}:${spec.half}`;
    case "aphorism":
      return `aphorism:${spec.aphorism.id}:${spec.half}`;
    case "motto":
      return `motto:${spec.chapter.key}${spec.keySuffix ? `:${spec.keySuffix}` : ""}`;
    case "plate":
      // Stable by work, not by sequence number (her exports, 2026-11-08:
      // backgrounds keyed to plate numbers silently retargeted other
      // works whenever the chapter order changed — Remains moving first
      // in Part 1 would have repainted six other pages). The image path
      // is unique per work and survives any reorder.
      return `plate:${spec.item.image_url}`;
    case "plateSpread":
      return `plateSpread:${spec.chapter.key}:${spec.entries[0]?.item.image_url ?? ""}:${spec.half}`;
    case "bleed":
      return `bleed:${spec.chapter.key}:${spec.half}`;
    case "about":
      return `about:${spec.chunk}`;
    case "collage":
      return `collage:${spec.chunk}`;
    case "reverse-index":
      return `reverse-index:${spec.chunk}`;
    case "canva":
      return `canva:${spec.page}`;
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

function PageBgCtl({ current, onPick, onEyedrop }: { current?: PageBgValue; onPick: (kind: PageBgValue | "global") => void; onEyedrop: () => void }) {
  const hex = isHexPageBg(current) ? current : undefined;
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
      {hex && <span className="bk-pagebg-swatch" style={{ background: hex }} title={hex} />}
      <button type="button" className="bk-pagebg-btn" onClick={onEyedrop}>
        取色
      </button>
    </div>
  );
}

/** Which spread the background-image panel edits: the two page keys of the
 * open spread (either may be null — blank pages carry no key of their own). */
export interface BgImagePanelInfo {
  leftKey: string | null;
  rightKey: string | null;
  leftNumber: number;
  rightNumber: number | null;
}

function PageBgImgCtl({ marked, onOpen }: { marked: boolean; onOpen: () => void }) {
  return (
    <div className="bk-pagebgimg-ctl" data-noprint>
      <button type="button" className={`bk-pagebg-btn ${marked ? "bk-pagebg-on" : ""}`} onClick={onOpen}>
        背景图 Bg img
      </button>
    </div>
  );
}

type BgImgScope = "spread" | "left" | "right";

/** Background-image picker (edit mode): pick a picture from the book itself,
 * paste a URL, or upload a local file (downscaled, stored as a data URL),
 * then choose where it goes — the whole spread, the left page or the right
 * page — and Apply. Clear removes the chosen scope's image again, back to
 * the page's paper ground. Staged like every other editor change: it only
 * persists via Save edits / Make PR in the toolbar. */
/** Picture-edit panel (edit mode): opens when a framed picture is
 * clicked. The size can also be set by dragging the picture's corner
 * handle directly; this panel mirrors it with a slider, swaps the
 * picture for a file from the computer, and resets both. Changes apply
 * immediately and auto-save to this browser's draft. */
function ImgEditPanel({
  src,
  title,
  edit,
  sent,
  onScale,
  onFull,
  onReplace,
  onReset,
  onClose,
  lang,
}: {
  src: string;
  title: string;
  edit: ImgEdit | undefined;
  sent?: boolean;
  onScale: (scale: number) => void;
  onFull: (on: boolean) => void;
  onReplace: (dataUrl: string) => void;
  onReset: () => void;
  onClose: () => void;
  lang: "en" | "zh";
}) {
  const zh = lang === "zh";
  const scale = edit?.scale && edit.scale > 0 ? edit.scale : 1;
  const onFile = (f: File | undefined) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      // Keep the original unless it is very large; past ~2400px a
      // downscale keeps the export file manageable at print size.
      const img = new Image();
      img.onload = () => {
        if (Math.max(img.width, img.height) <= 2400 && f.size <= 10 * 1024 * 1024) {
          onReplace(dataUrl);
          return;
        }
        const k = 2400 / Math.max(img.width, img.height);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * k);
        canvas.height = Math.round(img.height * k);
        canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
        onReplace(canvas.toDataURL("image/jpeg", 0.9));
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(f);
  };
  return (
    <div data-noprint className="bk-editor-panel bk-imgedit-panel">
      <div className="bk-editor-head">
        <span className="sans-label">{zh ? "图片" : "Picture"} · {title || src}{sent && edit ? <span className="bk-sent-chip">已发送 Sent</span> : null}</span>
        <span className="bk-editor-hint">{edit?.full ? (zh ? "满版中：拖动图片调整取景位置；拖角退出满版改大小" : "Full bleed: drag the picture to reposition the crop; drag a corner to leave full bleed and resize") : zh ? "拖图片四个角改大小（对角不动）、拖图片本身移动；改动自动存到本机草稿" : "Drag a corner to resize (opposite corner stays), drag the picture to move — changes save to this browser automatically"}</span>
      </div>
      <div className="bk-imgedit-row">
        <span>{zh ? "大小" : "Size"}</span>
        <input type="range" min={20} max={300} step={1} value={Math.round(scale * 100)} onChange={(e) => onScale(Number(e.target.value) / 100)} />
        <span className="bk-imgedit-pct">
          <input type="number" min={20} max={300} step={1} value={Math.round(scale * 100)} onChange={(e) => { const v = Number(e.target.value); if (Number.isFinite(v) && v >= 20 && v <= 300) onScale(v / 100); }} />%
        </span>
        {edit?.src && <span className="bk-imgedit-swapped">{zh ? "已换成本地图片" : "Swapped image"}</span>}
      </div>
      <div className="bk-editor-actions">
        <button type="button" className={edit?.full ? "bk-pagebg-btn bk-pagebg-on" : "bk-pagebg-btn"} onClick={() => onFull(!edit?.full)}>
          {zh ? (edit?.full ? "取消满版" : "满版（铺满整页）") : edit?.full ? "Un-full-bleed" : "Full bleed"}
        </button>
        <label className="bk-pagebg-btn bk-bgimg-upload">
          {zh ? "从电脑换一张图片" : "Replace from computer"}
          <input type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
        </label>
        <button type="button" disabled={!edit} onClick={onReset}>
          {zh ? "恢复原图和大小" : "Reset picture"}
        </button>
        <button type="button" onClick={onClose}>
          {zh ? "完成" : "Done"}
        </button>
      </div>
    </div>
  );
}

function BgImagePanel({
  info,
  images,
  current,
  onApply,
  onClear,
  onClose,
  lang,
}: {
  info: BgImagePanelInfo;
  images: { src: string; title: string }[];
  current: { spread?: PageBgImage; left?: PageBgImage; right?: PageBgImage };
  onApply: (scope: BgImgScope, src: string) => void;
  onClear: (scope: BgImgScope) => void;
  onClose: () => void;
  lang: "en" | "zh";
}) {
  const zh = lang === "zh";
  const [scope, setScope] = useState<BgImgScope>("spread");
  // The preselected image is DERIVED from the live `current` of the chosen
  // scope until the editor explicitly picks another one. (A useState copy
  // of `current` went stale: after Clear it still highlighted — and would
  // re-Apply — the image that had just been removed, so the panel and the
  // page disagreed about whether a background existed.)
  const [picked, setPicked] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const currentForScope = scope === "spread" ? current.spread : scope === "left" ? current.left : current.right;
  const src = picked ?? currentForScope?.src ?? "";
  const onFile = (f: File | undefined) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, 1600 / Math.max(img.width, img.height));
        if (scale >= 1) {
          setPicked(dataUrl);
          return;
        }
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
        setPicked(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(f);
  };
  const scopeBtn = (k: BgImgScope, label: string, disabled: boolean) => (
    <button key={k} type="button" disabled={disabled} className={`bk-pagebg-btn ${scope === k ? "bk-pagebg-on" : ""}`} onClick={() => setScope(k)}>
      {label}
    </button>
  );
  return (
    <div data-noprint className="bk-editor-panel bk-bgimg-panel">
      <div className="bk-editor-head">
        <span className="sans-label">
          {zh ? "背景图" : "Background image"} · p.{info.leftNumber}
          {info.rightNumber ? `–${info.rightNumber}` : ""}
        </span>
        <span className="bk-editor-hint">
          {zh ? "选图、选范围、点「应用」；背景图改动会自动存到本机草稿" : "Pick an image, choose a scope, Apply — background changes save to this browser automatically"}
        </span>
      </div>
      <div className="bk-bgimg-scopes">
        {scopeBtn("spread", zh ? "整个跨页" : "Whole spread", false)}
        {scopeBtn("left", zh ? `左半页 p.${info.leftNumber}` : `Left page p.${info.leftNumber}`, !info.leftKey)}
        {scopeBtn("right", info.rightNumber ? (zh ? `右半页 p.${info.rightNumber}` : `Right page p.${info.rightNumber}`) : zh ? "右半页" : "Right page", !info.rightKey)}
        <span className="bk-bgimg-current">{currentForScope ? (zh ? "这个范围已设背景图" : "This scope has a background") : zh ? "这个范围暂无背景图" : "No background on this scope"}</span>
      </div>
      <div className="bk-bgimg-grid">
        {images.map((im) => (
          <button key={im.src} type="button" title={im.title} className={`bk-bgimg-thumb ${src === im.src ? "bk-bgimg-thumb-on" : ""}`} onClick={() => setPicked(im.src)}>
            <img src={im.src} alt={im.title} loading="lazy" />
          </button>
        ))}
      </div>
      <div className="bk-bgimg-custom">
        <input type="text" placeholder={zh ? "或粘贴图片链接…" : "Or paste an image URL…"} value={url} onChange={(e) => setUrl(e.target.value)} />
        <button type="button" className="bk-pagebg-btn" onClick={() => url.trim() && setPicked(url.trim())}>
          {zh ? "用这个链接" : "Use URL"}
        </button>
        <label className="bk-pagebg-btn bk-bgimg-upload">
          {zh ? "上传本地图片" : "Upload image"}
          <input type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
        </label>
        {src && <img className="bk-bgimg-preview" src={src} alt="" />}
      </div>
      <div className="bk-editor-actions">
        <button type="button" disabled={!src} onClick={() => onApply(scope, src)}>
          {zh ? "应用" : "Apply"}
        </button>
        <button
          type="button"
          disabled={!currentForScope}
          onClick={() => {
            setPicked(null);
            onClear(scope);
          }}
        >
          {zh ? "清除这个范围的背景" : "Clear this scope"}
        </button>
        <button type="button" onClick={onClose}>
          {zh ? "关闭" : "Close"}
        </button>
      </div>
    </div>
  );
}

/** Which spread the eyedropper acts on, and which side's 取色 button opened
 * it — that side is the panel's preselected apply scope. */
export interface EyedropInfo extends BgImagePanelInfo {
  fromSide: "left" | "right";
}

interface EyeDropperResult {
  sRGBHex: string;
}
interface EyeDropperInstance {
  open: () => Promise<EyeDropperResult>;
}
type EyeDropperCtor = new () => EyeDropperInstance;

/** The native EyeDropper (Chrome / Edge): a magnifier that picks any pixel
 * in the window. Undefined in other browsers — the page component's
 * startEyedrop falls back to in-page canvas sampling there. */
function nativeEyeDropper(): EyeDropperCtor | undefined {
  return (window as unknown as { EyeDropper?: EyeDropperCtor }).EyeDropper;
}

type SampleResult = { hex: string } | { blocked: true } | null;

/** One offscreen canvas per <img>, drawn once at natural size and reused
 * across hover moves, so fallback sampling stays cheap. A cross-origin
 * image taints its canvas: the draw succeeds but the pixel read throws,
 * and sampleImagePixel reports that as "blocked" instead of guessing. */
const sampleCanvasCache = new WeakMap<HTMLImageElement, HTMLCanvasElement | null>();

function sampleImagePixel(img: HTMLImageElement, clientX: number, clientY: number): string | "blocked" | null {
  let canvas = sampleCanvasCache.get(img);
  if (canvas === undefined) {
    canvas = null;
    try {
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const g = c.getContext("2d", { willReadFrequently: true });
      if (g) {
        g.drawImage(img, 0, 0);
        canvas = c;
      }
    } catch {
      canvas = null;
    }
    sampleCanvasCache.set(img, canvas);
  }
  if (!canvas) return null;
  const rect = img.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return null;
  // The viewer scales pages with CSS zoom; the rendered rect already
  // carries that scale, so the rect → natural-size ratio cancels it out.
  const px = Math.floor(((clientX - rect.left) / rect.width) * img.naturalWidth);
  const py = Math.floor(((clientY - rect.top) / rect.height) * img.naturalHeight);
  if (px < 0 || py < 0 || px >= img.naturalWidth || py >= img.naturalHeight) return null;
  try {
    const g = canvas.getContext("2d", { willReadFrequently: true });
    if (!g) return null;
    const d = g.getImageData(px, py, 1, 1).data;
    return d[3] === 0 ? null : rgbToHex(d[0], d[1], d[2]);
  } catch {
    return "blocked";
  }
}

/** A computed "rgb(a)" background → hex, or null when fully transparent. */
function cssColorToHex(css: string): string | null {
  const m = /rgba?\(([^)]+)\)/.exec(css);
  if (!m) return null;
  const parts = m[1].split(",").map((s) => parseFloat(s));
  if (parts.length < 3) return null;
  const alpha = parts.length > 3 ? parts[3] : 1;
  if (!alpha) return null;
  return rgbToHex(parts[0], parts[1], parts[2]);
}

/** The colour under a viewport point, for the fallback eyedropper: walk the
 * paint stack top-down — an image pixel where the point is over a picture
 * (canvas sampling), otherwise the first non-transparent computed
 * background, which on bare paper is the page's ground colour. */
function sampleColorAtPoint(clientX: number, clientY: number): SampleResult {
  for (const el of document.elementsFromPoint(clientX, clientY)) {
    if (el instanceof HTMLImageElement && el.naturalWidth > 0) {
      const r = sampleImagePixel(el, clientX, clientY);
      if (r === "blocked") return { blocked: true };
      if (r) return { hex: r };
      continue;
    }
    const hex = cssColorToHex(window.getComputedStyle(el).backgroundColor);
    if (hex) return { hex };
  }
  return null;
}

/** Eyedropper result (edit mode): the sampled colour as a swatch + hex, and
 * where it goes — the page whose 取色 button was pressed (preselected), the
 * other page, or the whole spread (both page keys written together). Apply
 * goes through setPageBg exactly like a preset pick, so the export carries
 * the hex in pageBg; like every editor change it only persists via Save
 * edits / Make PR in the toolbar. */
function EyedropPanel({
  info,
  color,
  onApply,
  onPickAgain,
  onClose,
  lang,
}: {
  info: EyedropInfo;
  color: string;
  onApply: (scope: BgImgScope, hex: string) => void;
  onPickAgain: () => void;
  onClose: () => void;
  lang: "en" | "zh";
}) {
  const zh = lang === "zh";
  const [scope, setScope] = useState<BgImgScope>(info.fromSide);
  const scopeBtn = (k: BgImgScope, label: string, disabled: boolean) => (
    <button key={k} type="button" disabled={disabled} className={`bk-pagebg-btn ${scope === k ? "bk-pagebg-on" : ""}`} onClick={() => setScope(k)}>
      {label}
    </button>
  );
  return (
    <div data-noprint className="bk-editor-panel bk-eyedrop-panel">
      <div className="bk-editor-head">
        <span className="sans-label">
          {zh ? "取色" : "Eyedropper"} · p.{info.leftNumber}
          {info.rightNumber ? `–${info.rightNumber}` : ""}
        </span>
        <span className="bk-editor-hint">{zh ? "选范围、点「应用」设为背景色，再点工具栏「保存内容修改」存好" : "Choose a scope, Apply as the background — then Save edits in the toolbar"}</span>
      </div>
      <div className="bk-eyedrop-row">
        <span className="bk-eyedrop-swatch" style={{ background: color }} />
        <input className="bk-eyedrop-hex" readOnly value={color} aria-label="hex" onFocus={(e) => e.target.select()} />
      </div>
      <div className="bk-bgimg-scopes">
        {scopeBtn("spread", zh ? "整个跨页" : "Whole spread", false)}
        {scopeBtn("left", zh ? `左半页 p.${info.leftNumber}` : `Left page p.${info.leftNumber}`, !info.leftKey)}
        {scopeBtn("right", info.rightNumber ? (zh ? `右半页 p.${info.rightNumber}` : `Right page p.${info.rightNumber}`) : zh ? "右半页" : "Right page", !info.rightKey)}
      </div>
      <div className="bk-editor-actions">
        <button type="button" onClick={() => onApply(scope, color)}>
          {zh ? "应用" : "Apply"}
        </button>
        <button type="button" onClick={onPickAgain}>
          {zh ? "重新取色" : "Pick again"}
        </button>
        <button type="button" onClick={onClose}>
          {zh ? "关闭" : "Close"}
        </button>
      </div>
    </div>
  );
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
  pageBgFor: (key: string | null) => PageBgValue | undefined;
  setPageBg: (key: string, kind: PageBgValue | "global") => void;
  bgImgFor: (key: string | null) => PageBgImage | undefined;
  setBgImg: (key: string, value: PageBgImage | null) => void;
  openBgImagePanel: (info: BgImagePanelInfo) => void;
  imgEditFor: (src: string) => ImgEdit | undefined;
  setImgEdit: (src: string, edit: ImgEdit | null) => void;
  imgSel: string | null;
  selectImg: (src: string | null) => void;
  startEyedrop: (info: EyedropInfo) => void;
  paintingChunks: { paras: ParaItem[] }[];
}

export function FrontCoverFace({ ctx }: { ctx: BookContext }) {
  // Final cover (her direction, 2026-10-18): a full rust-brown field, the David
  // still life from the Still Things section whole at the centre, and cream serif lettering walking the four edges, Chun across the
  // top, Wang down the right side, Remains up the left side. The Chinese title
  // 遗迹 stands at the lower right (removed 2026-10-18 at her call, restored
  // 2026-11-05 when she settled 遗迹 as the book's Chinese name and directed
  // it back onto the cover).
  const still = ctx.chapters.find((c) => c.key === "stillthings");
  // The cover piece is pinned by image, not by title: the plain title
  // "Still Things" is shared by more than one plate in the section. It
  // was originally settled with the landscape plate (watercolors/43);
  // on 2026-10-24 she asked to try the portrait plate that joined the
  // section in 2026 (watercolors/48) as the cover centre instead. The
  // plate page left the Still Things section on 2026-11-08 (her
  // direction), but the piece stays the cover centre, so it is found
  // in the watercolor catalog rather than in the chapter.
  const catalogArt = getCombinedCatalogSections("", "en")
    .find((s) => s.key === "watercolor")
    ?.items.find((item) => item.image_url.includes("/watercolors/48/"));
  const art = catalogArt ?? still?.items[0]?.item ?? ctx.coverFront;
  return (
    <div className="bk-face bk-face-front bk-face-rust">
      <span className="bk-cover-word bk-cover-top">Chun</span>
      <span className="bk-cover-word bk-cover-right">Wang</span>
      <span className="bk-cover-word bk-cover-left">Remains</span>
      <span className="bk-cover-word bk-cover-zh">遗迹</span>
      {art && (
        <div className="bk-cover-art">
          <BookImage src={art.image_url} fallback={art.fallback_image_url} alt="Still Things" />
        </div>
      )}
    </div>
  );
}


export function BackCoverFace() {
  // Back cover, after the Nauman-style reference she chose (2026-10-18): text
  // high on the page, a large quiet field below, and a blank white barcode
  // box at lower right (the ISBN is still to come). The studio imprint line
  // that sat at lower left is deleted (her direction, 2026-11-09).
  // Layout mock (2026-11-10, local only, awaiting her approval): two columns,
  // English left / Chinese right, the English following the Chinese structure
  // （英文按照中文来） — blurb first (image sentences, then materials/theme),
  // then the author bio under a small heading in each language. The blurb no
  // longer carries the identity sentence; that role moved to the bio block.
  // EN bio = the official site's CURRENT EN About, pulled 2026-11-10 from
  // chunwangart main about.html (inline i18n aboutText, links stripped);
  // ZH bio = the site's CN About, both verbatim.
  return (
    <div className="bk-face bk-face-back">
      <div className="bk-back-body bk-back-cols">
        <div className="bk-back-col">
          <p className="bk-back-blurb">
            Ancient figurines clock back in for video meetings. After the show, the red velvet seats sit empty in the dark, waiting for the next one. Search histories, pandemic testimony, and fleeting performances are gathered before they can disappear.
          </p>
          <p className="bk-back-blurb">
            The materials change from series to series. The habit underneath them does not. The theme of this book is what remains, and its method is the archive, assembled slowly, in print, the older technology of staying.
          </p>
          <div className="bk-back-bio">
            <h3 className="bk-back-bio-head">About the Author</h3>
            <p className="bk-back-blurb">
              Chun Wang (b. 1991) is a multidisciplinary artist, technologist, and curator based in New York City. Her practice spans photography, painting, art objects, and digital works. With the archive as her method, she moves among ancient remains, everyday remnants, and digital records, tracing how things are preserved, forgotten, and reactivated. She was previously Lead Creative Technologist and Strategy Researcher at Harvard University’s FAS CAMLab.
            </p>
            <p className="bk-back-blurb">
              Negotiated Intelligence: Unearthing Power Dynamics in Human-AI Co-Creation and IMMEMORY: On COVID-19, both initiated, curated, and produced by her, have received international recognition: the former is an official pavilion of the seventh edition of the Wrong Biennale and received a Silver Award in the Arts and Culture Websites category at the 21st w3 Awards; the latter was an Official Nominee in the Cultural Blog/Website category at the 25th Webby Awards. Her curatorial work consistently centers on individuals in the midst of the upheavals of their time, tracing how they comprehend, absorb, and transform the disruption around them.
            </p>
            <p className="bk-back-blurb">
              Her photography has also won recognition from the International Photography Awards (IPA), the London International Creative Competition (LICC), the Siena International Photo Awards, the International Color Awards, and the Moscow International Foto Awards, among others. Her work has also been featured in print, including Artsin Square’s 5x7 Photobook (Vol. 1, 2025; Vol. 2, 2026) and the Passepartout Photo Prize Catalogue. Her work has been exhibited at the United Nations Headquarters in New York, SFMOMA, Harvard University, and the Anderson Collection at Stanford University, and has also been presented in Shanghai, London, Istanbul, Budapest, and Kitakyushu, among other places.
            </p>
          </div>
        </div>
        <div className="bk-back-col">
          <p className="bk-back-blurb">
            古代陶俑重新上岗，去开视频会议。散场之后，红丝绒座椅在暗处空着，等下一场。搜索记录、疫情证言、转瞬即逝的表演，都在消失之前被收了进来。
          </p>
          <p className="bk-back-blurb">
            材料从一个系列到下一个系列一直在变。材料之下的习惯不变。这本书问的是：什么留得下来？她的方法是档案。用印刷慢慢装订成书，一种更古老的存留技术。
          </p>
          <div className="bk-back-bio">
            <h3 className="bk-back-bio-head">关于作者</h3>
            <p className="bk-back-blurb">
              王淳 Chun Wang（1991年生）是一位现居纽约的多学科艺术家、工程师与策展人。她的创作横跨摄影、绘画、艺术物件与数字作品。她以档案为方法，在古代遗存、日常残余与数字记录之间，追踪事物如何被保存、遗忘，又被重新激活。她曾任哈佛大学文理学院 CAMLab（FAS CAMLab）首席创意技术专家与战略研究员。
            </p>
            <p className="bk-back-blurb">
              她发起、策展并制作的《Negotiated Intelligence: Unearthing Power Dynamics in Human-AI Co-Creation》与《IMMEMORY: On COVID-19》均获国际奖项：前者为The Wrong Biennale第七届官方展馆，并获第 21 届 w3 Awards艺术与文化类网站银奖；后者获第 25 届 Webby 奖文化类网站官方提名。她的策展工作始终以时代动荡中的个体为核心，记录他们理解、吸纳并转化外部冲击的历程。
            </p>
            <p className="bk-back-blurb">
              其摄影多次获奖，包括国际摄影奖（IPA）、伦敦国际创意大赛（LICC）、锡耶纳国际摄影奖、国际色彩奖与莫斯科国际摄影奖等。她的作品还收录于Artsin Square《5x7 Photobook》（第一辑，2025；第二辑，2026）与《Passepartout 摄影奖图录》等出版物。作品曾在纽约联合国总部、旧金山现代艺术博物馆（SFMOMA）、哈佛大学与斯坦福大学安德森收藏馆展出，并在上海、伦敦、伊斯坦布尔、布达佩斯与北九州等地呈现。
            </p>
          </div>
        </div>
      </div>
      <div className="bk-back-foot">
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
  // Background image (editor, 2026-11-08): a "page"-scope entry covers this
  // page alone; a "spread"-scope entry stored on either page of the spread
  // runs one image across both pages — rendered as the same shifted
  // full-spread canvas the bleed spreads use, so the picture stays
  // continuous over the gutter. The layer sits behind the page content and
  // the printed ground returns when the entry is cleared.
  const partnerPage = pages.find((p) => p.number === (side === "verso" ? number + 1 : number - 1));
  const partnerKey = partnerPage ? pageKeyOf(partnerPage.spec) : null;
  const ownBgImg = ctx.bgImgFor(pageKey);
  const partnerBgImg = ctx.bgImgFor(partnerKey);
  const spreadBgImg = ownBgImg?.scope === "spread" ? ownBgImg : partnerBgImg?.scope === "spread" ? partnerBgImg : undefined;
  const bgImg = ownBgImg?.scope === "page" ? ownBgImg : spreadBgImg;
  const bgImgLayer = bgImg ? (
    <div className={bgImg.scope === "spread" ? "bk-spread-canvas bk-bgimg-layer" : "bk-bgimg-layer"} aria-hidden="true">
      <img src={bgImg.src} alt="" />
    </div>
  ) : null;
  const bgImgCls = bgImg
    ? ` bk-has-bgimg${bgImg.scope === "spread" ? (side === "verso" ? " bk-bgimg-anchor-left" : " bk-bgimg-anchor-right") : ""}`
    : "";
  const spreadInfo: BgImagePanelInfo = {
    leftKey: side === "verso" ? pageKey : partnerKey,
    rightKey: side === "verso" ? partnerKey : pageKey,
    leftNumber: side === "verso" ? number : number - 1,
    rightNumber: partnerPage ? partnerPage.number : null,
  };
  const ctl =
    ctx.editMode && pageKey ? (
      <PageBgCtl
        current={bg}
        onPick={(kind) => ctx.setPageBg(pageKey, kind)}
        onEyedrop={() => ctx.startEyedrop({ ...spreadInfo, fromSide: side === "verso" ? "left" : "right" })}
      />
    ) : null;
  const bgImgCtl =
    ctx.editMode && (pageKey || partnerKey) ? <PageBgImgCtl marked={!!bgImg} onOpen={() => ctx.openBgImagePanel(spreadInfo)} /> : null;
  const ctlAll = (
    <>
      {ctl}
      {bgImgCtl}
    </>
  );

  switch (spec.kind) {
    case "title":
      return (
        <Page id={pageId} side={side} bg={bg} ctl={ctlAll} className={`bk-title-page${bgImgCls}`}>{bgImgLayer}
          <div className="bk-title-body">
            <h1 className="bk-title-main shop-title gloria-title" style={{ fontSize: displaySize(translations.en.catalogBook.title, 6.8, 1.35) }}>
              {translations.en.catalogBook.title}
            </h1>
            <div className="bk-title-zh">遗迹</div>
            <div className="bk-rule" />
            <div className="bk-title-meta">
              <span>{years}</span>
            </div>
            <div className="bk-title-decade">十年选集 2017–2026 · A Ten-Year Anthology, 2017–2026</div>
          </div>
        </Page>
      );

    case "colophon": {
      const year = new Date().getFullYear();
      return (
        <Page id={pageId} side={side} bg={bg} ctl={ctlAll} className={`bk-colophon${bgImgCls}`}>{bgImgLayer}
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
      type TocRow = { num: string; titleEn: string; titleZh?: string; sub: string; page: number; part?: string; inPart?: boolean };
      const chapterRow = (c: Chapter): TocRow => ({
        num: c.number > 0 ? pad2(c.number) : "",
        titleEn: c.titleEn ?? c.title,
        titleZh: c.titleZh,
        sub: c.years,
        page: startOf((s) => "chapter" in s && s.chapter.key === c.key),
      });
      // The contents shows the book's five parts as header rows with their
      // sections nested beneath them (her direction, 2026-11-05: the flat
      // list did not show how the parts and the sections relate). Part
      // headers carry an arabic numeral, and every title prints English
      // and Chinese on separate lines. A section whose Chinese title
      // repeats its part's title is not listed again (the part header
      // already names it), and the collage unit is not listed at all:
      // the contents stays clean, the body text is untouched.
      const PART_OF: Record<string, number> = {
        spirit: 1, remains: 1, residuals: 1, stillthings: 1, road: 1,
        innerwilderness: 2, deathvalley: 2, sahara: 2, highlands: 2, theater: 2, photography: 2,
        "series:unfinished": 3, "series:google": 3, "series:feedscanner": 3, "series:artempath": 3,
        "series:immemory": 4, "series:cavedance": 4, "series:negotiated": 4,
        shop: 5,
      };
      const PART_NUMERAL = ["1", "2", "3", "4", "5"];
      const PART_HEAD_KEY: Record<number, string> = { 2: "innerwilderness", 3: "series:unfinishedpart", 4: "series:triptych", 5: "shop" };
      const partTitlePair = (p: number): { en: string; zh?: string } => {
        if (p === 1) return { en: translations.en.catalogBook.paintingIntro, zh: translations.zh.catalogBook.paintingIntro };
        const head = chapters.find((c) => c.key === PART_HEAD_KEY[p]);
        return { en: head?.titleEn ?? head?.title ?? "", zh: head?.titleZh };
      };
      const partPage = (p: number): number => {
        if (p === 1) return startOf((s) => s.kind === "opener" && "chapter" in s && s.chapter.key === "part:afterimages") || startOf((s) => s.kind === "painting-intro");
        const headPage = startOf((s) => "chapter" in s && s.chapter.key === PART_HEAD_KEY[p]);
        if (headPage > 0) return headPage;
        // A part head that prints no page of its own (the Unfinished
        // Archive divider chapter, retired 2026-11-08) opens at its
        // first section's first page instead of printing folio 0.
        const first = chapters.find((c) => PART_OF[c.key] === p);
        return first ? startOf((s) => "chapter" in s && s.chapter.key === first.key) : 0;
      };
      const rows: TocRow[] = [
        { num: "", titleEn: translations.en.catalogBook.preface, titleZh: translations.zh.catalogBook.preface, sub: "", page: startOf((s) => s.kind === "preface") },
        { num: "", titleEn: translations.en.catalogBook.aboutArtist, titleZh: translations.zh.catalogBook.aboutArtist, sub: "", page: startOf((s) => s.kind === "about") },
      ];
      const headed = new Set<number>();
      const pushPart = (p: number) => {
        if (headed.has(p)) return;
        headed.add(p);
        const t = partTitlePair(p);
        rows.push({ num: "", titleEn: t.en, titleZh: t.zh, sub: "", page: partPage(p), part: PART_NUMERAL[p - 1] });
      };
      for (const c of chapters) {
        if (c.key === "series:triptych") { pushPart(4); continue; }
        if (c.key === "series:unfinishedpart") { pushPart(3); continue; }
        const p = PART_OF[c.key];
        if (p) {
          pushPart(p);
          const pz = partTitlePair(p).zh;
          if (pz && c.titleZh && (c.titleZh === pz || c.titleZh.startsWith(pz + "：") || c.titleZh.startsWith(pz + ":"))) continue;
        }
        rows.push({ ...chapterRow(c), inPart: p ? true : undefined });
      }
      rows.push({ num: pad2(Math.max(...chapters.map((c) => c.number)) + 1), titleEn: "An Index of What Remains", titleZh: "反向索引", sub: "", page: startOf((s) => s.kind === "reverse-index") });
      // The contents as a map, not a list (her direction, 2026-11-05,
      // from the design mock she approved): one spread, the five parts
      // as clusters scattered down the two pages, each led by its
      // arabic numeral in rust, English and Chinese on separate lines
      // at the same size in the part heads, repeated titles and the
      // collage unit left out. The layout is a vertical flow with the
      // clusters spaced apart, so nothing can overlap; the dotted
      // route segments are flow elements between clusters, never a
      // background under text. Front matter and the closing rows
      // (interview, index) sit small at the corners.
      type TocCluster = { part?: TocRow; rows: TocRow[] };
      const front: TocRow[] = [];
      const tail: TocRow[] = [];
      const clusters: TocCluster[] = [];
      let cur: TocCluster | null = null;
      for (const r of rows) {
        if (r.part) {
          cur = { part: r, rows: [] };
          clusters.push(cur);
        } else if (r.inPart && cur) {
          cur.rows.push(r);
        } else if (clusters.length === 0) {
          front.push(r);
        } else {
          tail.push(r);
        }
      }
      const go = (page: number) => document.getElementById(`bk-page-${page}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      const renderSmall = (r: TocRow) => (
        <div key={r.titleEn} className="bk-tocmap-small" onClick={() => go(r.page)}>
          <span className="bk-tocmap-sec-no">{r.num}</span>
          <span className="bk-tocmap-small-en">{r.titleEn}</span>
          {r.titleZh && <span className="bk-tocmap-small-zh">{r.titleZh}</span>}
          <span className="bk-tocmap-pg">{pad2(r.page)}</span>
        </div>
      );
      const renderSection = (r: TocRow) => (
        <div key={r.titleEn} className="bk-tocmap-sec" onClick={() => go(r.page)}>
          <span className="bk-tocmap-sec-no">{r.num}</span>
          <span className="bk-tocmap-sec-titles">
            <span className="bk-tocmap-sec-en">{r.titleEn}<span className="bk-tocmap-pg">{pad2(r.page)}</span></span>
            {r.titleZh && <span className="bk-tocmap-sec-zh">{r.titleZh}</span>}
          </span>
        </div>
      );
      const renderCluster = (cl: TocCluster | undefined, cls: string) => {
        if (!cl?.part) return null;
        const head = cl.part;
        return (
          <div className={`bk-tocmap-cluster ${cls}`}>
            <div className="bk-tocmap-head" onClick={() => go(head.page)}>
              <span className="bk-tocmap-num">{head.part}</span>
              <span className="bk-tocmap-head-titles">
                <span className="bk-tocmap-pen">{head.titleEn}</span>
                {head.titleZh && <span className="bk-tocmap-pzh">{head.titleZh}</span>}
                <span className="bk-tocmap-ppage">P. {head.page}</span>
              </span>
            </div>
            {cl.rows.length > 0 && (
              <div className={`bk-tocmap-secs${cl.rows.length > 4 ? " bk-tocmap-secs-2col" : ""}`}>{cl.rows.map(renderSection)}</div>
            )}
          </div>
        );
      };
      return (
        <Page id={pageId} side={side} bg={bg} ctl={ctlAll} className={bgImgCls}>{bgImgLayer}
          <div className={`bk-tocmap bk-tocmap-${spec.chunk === 0 ? "left" : "right"}`}>
            {spec.chunk === 0 ? (
              <>
                <div>
                  <div className="bk-tocmap-kicker">{translations.en.catalogBook.contents} · {translations.zh.catalogBook.contents}</div>
                  <div className="bk-tocmap-front">{front.map(renderSmall)}</div>
                </div>
                {renderCluster(clusters[0], "bk-tocmap-p1")}
                <div className="bk-tocmap-route" />
                {renderCluster(clusters[1], "bk-tocmap-p2")}
              </>
            ) : (
              <>
                {renderCluster(clusters[2], "bk-tocmap-p3")}
                <div className="bk-tocmap-route" />
                {renderCluster(clusters[3], "bk-tocmap-p4")}
                <div className="bk-tocmap-route" />
                {renderCluster(clusters[4], "bk-tocmap-p5")}
                <div className="bk-tocmap-tail">{tail.map(renderSmall)}</div>
              </>
            )}
          </div>
        </Page>
      );
    }

    case "preface": {
      const paras = ctx.prefaceChunks[spec.chunk]?.paras ?? [];
      const long = paras.map((p) => p.text).join("").length > 1400;
      return (
        <Page id={pageId} side={side} bg={bg} ctl={ctlAll} className={bgImgCls}>{bgImgLayer}
          <div className="bk-essay">
            {spec.chunk === 0 && (
              <div className="bk-essay-head">
                <h2 className="bk-section-title shop-title gloria-title">{stackedPair(translations.en.catalogBook.preface, translations.zh.catalogBook.preface)}</h2>
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
        <Page id={pageId} side={side} bg={bg} ctl={ctlAll} className={bgImgCls}>{bgImgLayer}
          <div className="bk-essay">
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
      const partOpener = !!(chapter.partIntro || chapter.partHead);
      // The big opener numeral belongs to the five parts only, and it
      // is the PART number (her direction, 2026-11-09, superseding the
      // chapter-number scope): Part 1's synthetic head, then the head
      // chapters of Parts 2–5 — the same heads PART_HEAD_KEY resolves
      // for the contents. Section openers carry no number in any form.
      const PART_NUMBER: Record<string, number> = {
        "part:afterimages": 1,
        innerwilderness: 2,
        "series:unfinishedpart": 3,
        "series:triptych": 4,
        shop: 5,
      };
      const partNumber = partOpener ? PART_NUMBER[chapter.key] : undefined;
      // The Notes from the Road opener is a full-bleed pair of paintings
      // (the editor's per-page background images — see
      // pageBackgroundImages.ts). Her direction (2026-11-09): the giant
      // title comes off this spread — it shows only the artwork. Her
      // corrections the same day: not a credit per painting and no work
      // titles — the spread carries ONE credit block (year-and-medium
      // line plus the Sugamo production-note line) at the LEFT page's
      // bottom-left corner; the right page carries no credit. Values
      // from the watercolor catalog record (/watercolors/18 — both
      // paintings are 2025 watercolors on paper, so one line covers
      // the spread). The section is left with no title page; that is
      // her call, not an oversight.
      const roadWork = chapter.key === "road" && half === "left"
        ? watercolors.find((w) => w.id === "18")
        : undefined;
      const titleEn = chapter.titleEn ?? chapter.title;
      // Two lines across the ~16 in spread at most — but a title's
      // longest word cannot wrap, so the size must ALSO fit that word
      // on one line across the spread. The old formula spent the whole
      // two-line budget on any title: the one-word ART.EMPATH.IO ran
      // off the spread's right edge, and INNER WILDERNESS's second word
      // overflowed the same way (her screenshot, 2026-11-10). Titles
      // that already fit keep their exact old size: the longest-word
      // constraint binds only where the old size overflowed.
      const titleWords = titleEn.trim().split(/\s+/);
      const longestWord = Math.max(4, ...titleWords.map((w) => w.length));
      const titleSize = displaySize(
        titleEn,
        Math.min(2 * 15.5, (15.5 * Math.max(titleEn.length, 4)) / longestWord),
        partOpener ? 2.6 : 1.9,
      );
      return (
        <Page id={pageId} side={side} bg={bg} ctl={ctlAll} className={`bk-opener bk-opener-${half}${partOpener ? " bk-opener-part" : ""}${bgImgCls}`}>{bgImgLayer}
          <div className="bk-spread-canvas">
            {epigraph && epigraph.en && (
              <p className="bk-opener-epigraph">
                {epigraph.en}
                <span className="bk-opener-epigraph-zh">{epigraph.zh}</span>
              </p>
            )}
            {chapter.key === "part:afterimages" && (
              <div className="bk-opener-intro">
                {(ctx.paintingChunks[0]?.paras ?? []).map((p, i) => (
                  <p key={i}>{p.text}</p>
                ))}
              </div>
            )}
            {chapter.key !== "road" && (
            <Collage
              title={stackedTitle(chapter)}
              titleSize={titleSize}
              above={
                <>
                  {/* Part number as a large plain-sans display numeral,
                      its own block above the title, on the five part
                      openers only (her direction, 2026-11-09) — styled
                      by .bk-opener-num. Section openers show no number
                      in any form: no big numeral, no small box. */}
                  {partNumber !== undefined && <div className="bk-opener-num">{pad2(partNumber)}</div>}
                  <div className="bk-collage-row">
                    <span className="bk-opener-label" />
                    <span>{chapter.years}</span>
                  </div>
                </>
              }
            />
            )}
          </div>
          {roadWork && (
            <div className="bk-opener-credit bk-opener-credit-left">
              <div className="bk-caption-meta">{[roadWork.year, roadWork.medium, roadWork.mediumZh].filter(Boolean).join(" · ")}</div>
              {/* Production note for this spread, her wording (2026-11-09):
                  painted at a residence in Sugamo, Tokyo, during a Japan
                  trip. (It was first mis-filed to the Japanese Pottery
                  caption; she ruled it belongs here, on the Road opener.) */}
              <div className="bk-caption-meta">Painted during a trip to Japan, at a residence in Sugamo, Tokyo · 绘于日本旅行中位于东京巢鸭的住所</div>
            </div>
          )}
        </Page>
      );
    }

    case "aphorism": {
      const a = spec.aphorism;
      // Redesigned spread (her direction, 2026-11-06): the two languages no
      // longer sit together over the gutter. English stands alone on the
      // left page, huge ink-black serif anchored low-left — the spread's
      // protagonist; Chinese stands alone on the right page, kept small
      // like a footnote, vertical when it is a short question, anchored
      // top-right. Plain white ground (the rust-and-cream full ground was
      // retired the same day: the cover, title page and part pages already
      // use it too much) — the only rust on the page is the question mark.
      // Quiet aphorisms (her direction, 2026-11-09) leave the poster
      // tiers below: the whole sentence, both languages stacked, is set
      // small on the spread's left page in the motto-page treatment
      // (.bk-quiet); the right page stays empty.
      if (a.quiet) {
        return (
          <Page id={pageId} side={side} bg={bg} ctl={ctlAll} className={`bk-aphorism bk-aphorism-${spec.half} bk-aph-${a.id} bk-aphorism-quiet${bgImgCls}`}>{bgImgLayer}
            {spec.half === "left" && (
              <div className="bk-quiet">
                <div className="bk-quiet-rule" />
                {a.en && <p className="bk-quiet-p">{a.en}</p>}
                {a.zh && <p className="bk-quiet-p">{a.zh}</p>}
              </div>
            )}
          </Page>
        );
      }
      // Size tiers keep the longer sentences and the one paragraph-length
      // text readable on one page.
      const enTier = a.long ? "para" : (a.en ?? "").length <= 24 ? "huge" : "big";
      const zhLen = (a.zh ?? "").length;
      const zhTier = a.long ? "para" : zhLen <= 8 ? "huge-v" : zhLen <= 30 ? "huge" : "big";
      // Each language has its own page: English only ever on the left,
      // Chinese only ever on the right. A spread with neither line
      // (what-remains) leaves both pages to the painting; its right page
      // still carries the painting's work credit, rendered below
      // independently of any zh line.
      return (
        <Page id={pageId} side={side} bg={bg} ctl={ctlAll} className={`bk-aphorism bk-aphorism-${spec.half} bk-aph-${a.id}${a.long ? " bk-aphorism-long" : ""}${bgImgCls}`}>{bgImgLayer}
          {spec.half === "left" ? (
            a.en ? (
              <p className={`bk-aphorism-en bk-aphorism-en-${enTier}`}>{withRustQ(a.en)}</p>
            ) : null
          ) : (
            <>
              {a.zh && (
                <p className={`bk-aphorism-zh bk-aphorism-zh-${zhTier}`}>{withRustQ(a.zh)}</p>
              )}
              {a.id === "what-remains" && (
                <div className="bk-aphorism-workinfo">
                  <div className="bk-caption-title product-title">Notes from the Road #2 行旅拾记 其二</div>
                  <div className="bk-caption-meta">2026 · Watercolor on paper 纸本水彩</div>
                  <div className="bk-caption-meta">San Cristóbal de las Casas, Chiapas, Mexico · 墨西哥，恰帕斯州，圣克里斯托瓦尔-德拉斯卡萨斯</div>
                </div>
              )}
            </>
          )}
        </Page>
      );
    }

    case "essay": {
      const { chapter } = spec;
      const chunk = ctx.essayChunks[chapter.key]?.[spec.chunk];
      const items = chunk?.items ?? [];
      return (
        <Page id={pageId} side={side} bg={bg} ctl={ctlAll} className={bgImgCls}>{bgImgLayer}
          <div className="bk-essay">
            {spec.chunk === 0 && !chapter.partIntro && !chapter.partHead && chapter.key !== "stillthings" && (
              <div className="bk-essay-head">
                {chapter.number > 0 && <span className="bk-num-box">{pad2(chapter.number)}</span>}
                <h2 className="bk-section-title shop-title">{stackedTitle(chapter)}</h2>
                <div className="bk-essay-meta sans-label">{chapter.years}</div>
              </div>
            )}
            <div className={`bk-essay-text description-html ${items.reduce((n, it) => n + plainText(it.html).length, 0) > 450 ? "bk-essay-cols" : ""}`}>
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
        <Page id={pageId} side={side} bg={bg} ctl={ctlAll} className={`bk-plate-page${bgImgCls}`}>{bgImgLayer}
          <div className="bk-plate-frame">
            <EdBookImage ctx={ctx} src={item.image_url} fallback={item.fallback_image_url} alt={item.title} />
          </div>
          <div className="bk-caption">
            <div className="bk-caption-body">
              <div className="bk-caption-title product-title">{item.title}{item.titleZh && item.titleZh !== item.title ? ` ${item.titleZh}` : ""}</div>
              {(item.metaLine || item.dimensions || item.mediumZh || item.dimensionsZh) && (
                <div className="bk-caption-meta">{[item.metaLine, item.dimensions, item.mediumZh && item.mediumZh !== item.medium && !(item.metaLine ?? "").includes(item.mediumZh) ? item.mediumZh : "", item.dimensionsZh && item.dimensionsZh !== item.dimensions ? item.dimensionsZh : ""].filter(Boolean).join(" · ")}</div>
              )}
              {item.description && <div className="bk-caption-desc description-html" dangerouslySetInnerHTML={{ __html: item.description }} />}
            </div>
          </div>
          <Folio number={number} tag={`${b.title} | ${chapter.title}`} />
        </Page>
      );
    }

    case "plateGrid": {
      const { chapter, entries } = spec;
      return (
        <Page id={pageId} side={side} bg={bg} ctl={ctlAll} className={`bk-plate-page${bgImgCls}`}>{bgImgLayer}
          <div className={`bk-plate-grid bk-grid-${entries.length}`}>
            {entries.map(({ item }) => (
              <div className="bk-grid-cell" key={item.image_url}>
                <div className="bk-grid-frame">
                  <EdBookImage ctx={ctx} src={item.image_url} fallback={item.fallback_image_url} alt={item.title} />
                </div>
                <div className="bk-grid-caption">
                  <div className="bk-caption-title product-title">{item.title}{item.titleZh && item.titleZh !== item.title ? ` ${item.titleZh}` : ""}</div>
                  {(item.metaLine || item.dimensions) && (
                    <div className="bk-caption-meta">{[item.metaLine, item.dimensions].filter(Boolean).join(" · ")}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Folio number={number} tag={`${b.title} | ${chapter.title}`} />
        </Page>
      );
    }

    case "plateSpread": {
      // One continuous dense grid field across the whole spread (the
      // opener/bleed canvas trick): each half renders the same canvas,
      // shifted, so the journal handnotes pack both pages edge to edge.
      // Cells carry only the small title + meta caption — the plates'
      // shared boilerplate description is not repeated here.
      const { chapter, entries } = spec;
      return (
        <Page id={pageId} side={side} bg={bg} ctl={ctlAll} className={`bk-plate-spread bk-plate-spread-${spec.half}${bgImgCls}`}>{bgImgLayer}
          <div className="bk-spread-canvas">
            <div className="bk-journal-grid">
              {entries.map(({ item }) => (
                <div className="bk-journal-cell" key={item.image_url}>
                  <div className="bk-journal-frame">
                    <EdBookImage ctx={ctx} src={item.image_url} fallback={item.fallback_image_url} alt={item.title} />
                  </div>
                  <div className="bk-journal-caption">
                    <div className="bk-caption-title product-title">{item.title}{item.titleZh && item.titleZh !== item.title ? ` ${item.titleZh}` : ""}</div>
                    {item.metaLine && <div className="bk-caption-meta">{item.metaLine}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Folio number={number} tag={`${b.title} | ${chapter.title}`} />
        </Page>
      );
    }

    case "bleed": {
      const { item } = spec;
      return (
        <Page id={pageId} side={side} bg={bg} ctl={ctlAll} className={`bk-bleed bk-bleed-${spec.half}${bgImgCls}`}>{bgImgLayer}
          <div className="bk-spread-canvas">
            <BookImage src={item.image_url} fallback={item.fallback_image_url} alt={item.title} className="bk-bleed-img" />
            {spec.half === "right" && (
              <div className="bk-bleed-caption">
                <div className="bk-caption-title product-title">{item.title}</div>
                <div className="bk-caption-meta">{item.metaLine}</div>
                {item.metaZh && <div className="bk-caption-meta">{item.metaZh}</div>}
              </div>
            )}
          </div>
        </Page>
      );
    }

    case "about":
      return (
        <Page id={pageId} side={side} bg={bg} ctl={ctlAll} className={bgImgCls}>{bgImgLayer}
          <div className="bk-essay">
            {spec.chunk === 0 && (
              <div className="bk-essay-head">
                <h2 className="bk-section-title shop-title gloria-title">{stackedPair("About the Author", "关于作者")}</h2>
              </div>
            )}
            <div className="bk-essay-text bk-about-text description-html" dangerouslySetInnerHTML={{ __html: spec.chunk === 0 ? artistBioHTML("en") : artistBioHTML("zh") }} />
          </div>
          <Folio number={number} tag={`${b.title} | ${translations.en.catalogBook.aboutArtist} · ${translations.zh.catalogBook.aboutArtist}`} />
        </Page>
      );

    case "collage":
      return (
        <Page id={pageId} side={side} bg={bg} ctl={ctlAll} className={bgImgCls}>{bgImgLayer}
          <div className="bk-essay">
            {spec.chunk === 0 && (
              <div className="bk-essay-head">
                <div className="bk-essay-meta sans-label">Collage as Method · 作为方法的拼贴</div>
                <h2 className="bk-section-title bk-collage-method-title shop-title gloria-title">{stackedPair("Collage as Method", "作为方法的拼贴")}</h2>
              </div>
            )}
            <div className="bk-essay-text description-html">
              <p>{COLLAGE_METHOD.en}</p>
              <p>{COLLAGE_METHOD.zh}</p>
            </div>
          </div>
          <Folio number={number} tag={`${b.title} | Collage as Method · 作为方法的拼贴`} />
        </Page>
      );

    case "exhibitions": {
      const entries = EXHIBITIONS[spec.chapter.key] ?? [];
      return (
        <Page id={pageId} side={side} bg={bg} ctl={ctlAll} className={bgImgCls}>{bgImgLayer}
          <div className="bk-eyebrow">{[spec.chapter.titleZh, spec.chapter.titleEn ?? spec.chapter.title].filter(Boolean).join(" · ")}</div>
          <div className="bk-exhibitions">
            <h3 className="bk-exhibitions-head shop-title">{stackedPair(CREDITS_TITLE.en, CREDITS_TITLE.zh)}</h3>
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
            {/* Her direction, 2026-11-10: the interview's Online Archives
                block (the Shoutout Atlanta link) is deleted; the credits
                entries above stand alone. */}
          </div>
        </Page>
      );
    }

    case "part-exhibitions": {
      // The part's consolidated exhibition & award credits (her direction,
      // 2026-11-08): the fixed list title heads the first page and the
      // part name rides in the eyebrow as the attribution; under the
      // title the part's sections stand as group heads in book order,
      // each with its entries from EXHIBITIONS, English first and
      // Chinese following, years leading each line — the same setting
      // as the per-section exhibitions pages this replaces.
      const chunks = partExhibitionChunks(spec.part);
      const groups = chunks[spec.chunk] ?? [];
      const PART_HEAD_KEY: Record<number, string> = { 2: "innerwilderness", 3: "series:unfinishedpart", 4: "series:triptych", 5: "shop" };
      const headChapter = spec.part === 1 ? undefined : chapters.find((c) => c.key === PART_HEAD_KEY[spec.part]);
      const partTitle =
        spec.part === 1
          ? { en: translations.en.catalogBook.paintingIntro, zh: translations.zh.catalogBook.paintingIntro }
          : { en: headChapter?.titleEn ?? headChapter?.title ?? "", zh: headChapter?.titleZh };
      const groupTitle = (key: string) => {
        const canon = CANONICAL_SECTION_TITLE[key];
        const ch = chapters.find((c) => c.key === key);
        return stackedPair(canon?.en ?? ch?.titleEn ?? ch?.title ?? key, canon?.zh ?? ch?.titleZh);
      };
      /** One-line section name for the website lines: EN · 中文, from the
       * same canonical sources as the group heads above. */
      const sectionName = (key: string) => {
        const canon = CANONICAL_SECTION_TITLE[key];
        const ch = chapters.find((c) => c.key === key);
        const en = canon?.en ?? ch?.titleEn ?? ch?.title ?? key;
        const zh = canon?.zh ?? ch?.titleZh;
        return zh ? `${en} · ${zh}` : en;
      };
      return (
        <Page id={pageId} side={side} bg={bg} ctl={ctl}>
          <div className="bk-eyebrow">{[partTitle.zh, partTitle.en].filter(Boolean).join(" · ")}</div>
          <div className="bk-exhibitions">
            {spec.chunk === 0 && (
              <h3 className="bk-exhibitions-head shop-title">{stackedPair(CREDITS_TITLE.en, CREDITS_TITLE.zh)}</h3>
            )}
            {groups.map((g) => (
              <div className={`bk-exhibitions-group${g.key === "__websites__" ? " bk-exhibitions-websites" : ""}`} key={`${g.key}${g.continued ? "-cont" : ""}`}>
                {g.key === "__websites__" ? (
                  <h4 className="bk-exhibitions-subhead shop-title">线上查阅 · Online Archives</h4>
                ) : (
                  <h4 className="bk-exhibitions-subhead shop-title">{groupTitle(g.key)}</h4>
                )}
                <ul>
                  {g.entries.map((e, i) => {
                    if (e.url) {
                      return (
                        <li key={i}>
                          <span className="bk-exhibitions-en">
                            {sectionName(e.nameKey ?? "")} — {e.url}
                          </span>
                        </li>
                      );
                    }
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
            ))}
          </div>
        </Page>
      );
    }

    case "canva": {
      const src = `/book/canva-paintings/p${String(spec.page).padStart(2, "0")}.jpg`;
      if (CANVA_FULL_BLEED_PAGES.has(spec.page)) {
        // Full bleed like the bleed spreads: the image covers the whole
        // sheet and, as there, no folio is printed over it.
        return (
          <Page id={pageId} side={side} bg={bg} ctl={ctlAll} className={`bk-canva-page bk-canva-bleed-page${bgImgCls}`}>{bgImgLayer}
            <div className="bk-canva-bleed">
              <BookImage src={src} alt={`Paintings 2019–2026 — earlier printed edition, page ${spec.page}`} />
            </div>
          </Page>
        );
      }
      return (
        <Page id={pageId} side={side} bg={bg} ctl={ctlAll} className={`bk-canva-page${bgImgCls}`}>{bgImgLayer}
          <div className="bk-canva-frame">
            <EdBookImage ctx={ctx} src={src} alt={`Paintings 2019–2026 — earlier printed edition, page ${spec.page}`} />
          </div>
          {spec.page === 21 && (
            <div className="bk-caption">
              <div className="bk-caption-body">
                <div className="bk-caption-title product-title">Japanese Pottery 日本陶器</div>
                <div className="bk-caption-meta">2025 · Watercolor on paper · 纸本水彩</div>
                <div className="bk-caption-desc description-html" dangerouslySetInnerHTML={{ __html: "Japan.<br />日本。" }} />
              </div>
            </div>
          )}
          <Folio number={number} tag={`${b.title} | Paintings 2019–2026`} />
        </Page>
      );
    }

    case "reverse-index": {
      // Set as the sample page she sent back on 2026-11-05 and ordered
      // into the book as-is: an index page proper — big title, the short
      // red rule, group heads whose hairline runs out to the right, and
      // every remainder carried by a dotted leader to the chapter it
      // lives in, right-aligned. (The "quiet text page" setting tried
      // first was rejected: too plain, and not this book.) The index runs
      // to several pages (REVERSE_INDEX_CHUNKS), the title head standing
      // on the first only; the closing footer line the sample carried was
      // struck at her word the same day.
      const splitPointer = (to: string) => {
        const m = to.match(/^([一-鿿]+)\s*(.*)$/);
        return m ? { zh: m[1], en: m[2] } : { zh: "", en: to };
      };
      const chunkGroups = (REVERSE_INDEX_CHUNKS[spec.chunk] ?? []).map((gi) => REVERSE_INDEX.groups[gi]);
      return (
        <Page id={pageId} side={side} bg={bg} ctl={ctlAll} className={`bk-revindex-page${bgImgCls}`}>{bgImgLayer}
          <div className="bk-revindex">
            {spec.chunk === 0 && (
              <header className="bk-revindex-head">
                <h2 className="bk-revindex-title">{REVERSE_INDEX.titleZh}</h2>
                <div className="bk-revindex-title-en">{REVERSE_INDEX.titleEn}</div>
                <div className="bk-revindex-rule" />
                <p className="bk-revindex-tagline">{REVERSE_INDEX.taglineZh}</p>
                <p className="bk-revindex-tagline-en">{REVERSE_INDEX.taglineEn}</p>
              </header>
            )}
            {chunkGroups.map((g) => (
              <section key={g.zh} className="bk-revindex-group">
                <h3 className="bk-revindex-group-name">
                  <span className="bk-revindex-group-zh">{g.zh}</span>
                  <span className="bk-revindex-group-en">{g.en}</span>
                  <span className="bk-revindex-group-line" />
                </h3>
                {g.entries.map((e) => {
                  const ptr = splitPointer(e.to);
                  return (
                    <div key={e.zh} className="bk-revindex-entry">
                      <p className="bk-revindex-phrase">
                        {e.zh}
                        <span className="bk-revindex-phrase-en">{e.en}</span>
                      </p>
                      <span className="bk-revindex-leader" />
                      <p className="bk-revindex-to">
                        {ptr.zh}
                        {ptr.en && <span className="bk-revindex-to-en">{ptr.en}</span>}
                      </p>
                    </div>
                  );
                })}
              </section>
            ))}
          </div>
          <Folio number={number} tag={`${b.title} | An Index of What Remains · 反向索引`} />
        </Page>
      );
    }

    case "motto": {
      // A quiet page (her direction, 2026-11-09): one text alone on a
      // white page, set small in the treatment of the old book's p. 30 —
      // see the .bk-quiet styles. The Spirit chapter carries two: its
      // former epigraph after the opener (SPIRIT_QUIET_TEXT) and its
      // bridge sentence closing the chapter (SPIRIT_BRIDGE_TEXT).
      const { chapter } = spec;
      return (
        <Page id={pageId} side={side} bg={bg} ctl={ctlAll} className={`bk-motto-page${bgImgCls}`}>{bgImgLayer}
          <div className="bk-quiet">
            <div className="bk-quiet-rule" />
            <p className="bk-quiet-p">{spec.text.en}</p>
            <p className="bk-quiet-p">{spec.text.zh}</p>
          </div>
          <Folio number={number} tag={`${b.title} | ${chapter.title}`} />
        </Page>
      );
    }

    case "blank":
      return <Page id={pageId} side={side} bg={bg} ctl={ctlAll} />;
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
// The book's chapters, page contents and pagination, built once: the book
// page lays the volume out from this model.

function useBookModel(args: {
  editMode: boolean;
  textEdits: Record<string, string>;
  pageBgEdits: Record<string, PageBgValue | "global">;
  pageBgFor: BookContext["pageBgFor"];
  setPageBg: BookContext["setPageBg"];
  bgImgEdits: Record<string, PageBgImage | null>;
  bgImgFor: BookContext["bgImgFor"];
  setBgImg: BookContext["setBgImg"];
  openBgImagePanel: BookContext["openBgImagePanel"];
  startEyedrop: BookContext["startEyedrop"];
  openEditor: BookContext["openEditor"];
  imgEdits: Record<string, ImgEdit>;
  imgEditFor: BookContext["imgEditFor"];
  setImgEdit: BookContext["setImgEdit"];
  imgSel: string | null;
  selectImg: BookContext["selectImg"];
}): { ctx: BookContext; pages: InteriorPage[] } {
  const { editMode, textEdits, pageBgEdits, pageBgFor, setPageBg, bgImgEdits, bgImgFor, setBgImg, openBgImagePanel, startEyedrop, openEditor, imgEdits, imgEditFor, setImgEdit, imgSel, selectImg } = args;
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
        title: bilingualTitle(s.key === "shop" ? "Slightly Useful Objects" : CHAPTER_TITLE[s.key](translations.en), s.key === "shop" ? "微用之物" : CHAPTER_TITLE[s.key](translations.zh)),
        titleEn: s.key === "shop" ? "Slightly Useful Objects" : CHAPTER_TITLE[s.key](translations.en),
        titleZh: s.key === "shop" ? "微用之物" : CHAPTER_TITLE[s.key](translations.zh),
        partHead: s.key === "shop",
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
    // (Visions in Ceramics, the Screen & Archive and Live chapters),
    // merged with the catalog chapters in the book outline's order.
    const seriesChapters: Chapter[] = BOOK_SERIES.filter((s) => !s.mergedInto).map((s) => ({
      key: `series:${s.id}`,
      number: 0,
      title: !s.titleZh || s.titleEn === s.titleZh ? s.titleEn : `${s.titleEn} ${s.titleZh}`,
      titleEn: s.titleEn,
      titleZh: s.titleZh,
      descriptionHtml: "",
      items: (SERIES_PLATES[s.id] ?? []).map((item) => ({ item, plate: 0 })),
      years: s.years,
      seriesOnly: true,
      partIntro: !!s.partIntro,
      partHead: !!s.partIntro,
    }));
    // The watercolor catalog dissolves into its three named series (her call:
    // no "Visions in Watercolor" umbrella chapter). Plates split from the
    // watercolor catalog by title; the texts live in BOOK_SERIES.
    const wcChapter = catalogChapters.find((ch) => ch.key === "watercolor");
    const wcSplit = (id: string, titleEn: string, titleZh: string, prefix: string): Chapter => {
      const items = (wcChapter?.items ?? []).filter(({ item }) => (item.title ?? "").startsWith(prefix));
      return { key: id, number: 0, title: `${titleEn} ${titleZh}`, titleEn, titleZh, descriptionHtml: "", items, years: yearRange(items.map(({ item }) => item.year)), seriesTextId: id };
    };
    const splitChapters: Chapter[] = [
      wcSplit("residuals", "Residuals", "残留", "Residuals"),
      wcSplit("stillthings", "Still Things", "静物", "Still Things"),
      wcSplit("road", "Notes from the Road", "出发", "Notes from the Road"),
    ];
    // Her review (2026-11-08): the Forms Before Dissolving exhibition
    // poster plate and the Residuals #2 and #3 plates are deleted from
    // the book (the works stay in the watercolor catalog). The plates
    // open with Residuals #1, then the newly added Residuals #26; the
    // rest keep their catalog order. (Order revised 2026-11-09,
    // superseding her 2026-11-04 direction: the chapter's essay IS the
    // Forms Before Dissolving exhibition review of the Breakfast
    // Residuals works, so Residuals #1 leads the plates and stands
    // immediately after its review, with no other work between.)
    const residualsChapter = splitChapters.find((ch) => ch.key === "residuals");
    if (residualsChapter) {
      const kept = residualsChapter.items.filter(({ item }) => item.title !== "Residuals #2" && item.title !== "Residuals #3");
      const byTitle = (t: string) => kept.findIndex(({ item }) => item.title === t);
      const lead: typeof kept = [];
      for (const t of ["Residuals #1", "Residuals #26"]) {
        const i = byTitle(t);
        if (i >= 0) lead.push(kept[i]);
      }
      residualsChapter.items = [...lead, ...kept.filter(({ item }) => item.title !== "Residuals #26" && item.title !== "Residuals #1")];
    }
    // Her direction (2026-11-08): the road chapter's plates are grouped
    // by country — Mexico first (the chapter's original run), then
    // Colombia, Thailand, Costa Rica, the United States and Norway;
    // within a country the plates keep their numeric order.
    const roadChapter = splitChapters.find((ch) => ch.key === "road");
    if (roadChapter) {
      const ROAD_COUNTRY_ORDER = [
        "Notes from the Road #2", "Notes from the Road #3", "Notes from the Road #4", "Notes from the Road #9", "Notes from the Road #14",
        "Notes from the Road #5", "Notes from the Road #8",
        "Notes from the Road #6", "Notes from the Road #7", "Notes from the Road #12",
        "Notes from the Road #13",
        "Notes from the Road #10",
        "Notes from the Road #11",
        "Notes from the Road #15",
      ];
      const rank = (t: string) => {
        const i = ROAD_COUNTRY_ORDER.indexOf(t);
        return i === -1 ? ROAD_COUNTRY_ORDER.length : i;
      };
      roadChapter.items = [...roadChapter.items].sort((a, b) => rank(a.item.title ?? "") - rank(b.item.title ?? ""));
      // Her direction (2026-11-10): Notes from the Road #9 (Oaxaca,
      // 2023) moves to the head of the section's plate sequence — the
      // first work after the opener spread and the chapter's essay
      // pages. All other plates keep the country order above.
      const nineIdx = roadChapter.items.findIndex(({ item }) => item.title === "Notes from the Road #9");
      if (nineIdx > 0) {
        const [nine] = roadChapter.items.splice(nineIdx, 1);
        roadChapter.items.unshift(nine);
      }
    }
    // Her direction (2026-11-08): the Still Things plate on
    // /watercolors/48/ — the section's last plate page — is deleted
    // from the book. The piece itself stays in the watercolor catalog
    // and keeps its place as the front cover's centre image (chosen
    // 2026-10-24); FrontCoverFace now finds it in the catalog, not in
    // this chapter.
    const stillThingsChapter = splitChapters.find((ch) => ch.key === "stillthings");
    if (stillThingsChapter) {
      stillThingsChapter.items = stillThingsChapter.items.filter(({ item }) => !item.image_url.includes("/watercolors/48/"));
    }
    // The three websites stand as one big chapter (her direction,
    // 2026-11-05): a part opening, "Rooms, Scores, Decisions", then the
    // triptych in the order the IMMEMORY text itself names — first panel
    // first: IMMEMORY, Cave Dance, Negotiated Intelligence.
    // Part order (her direction, 2026-11-07): the website works move to
    // the back — Painting, Inner Wilderness, The Unfinished Archive,
    // Rooms/Scores/Decisions, Slightly Useful Objects.
    // Her direction (2026-11-08): In the Spirit of the 21st Century
    // closes Part 1 instead of opening it, and Remains moves after
    // Still Things — the part now runs Residuals, Still Things,
    // Remains, Notes from the Road, and Spirit last.
    // Her direction (2026-11-08, later): Notes from the Road moves
    // ahead of Remains — the part now runs Residuals, Still Things,
    // Notes from the Road, Remains, and Spirit last.
    const SECTION_ORDER = [
      "remains", "residuals", "stillthings", "road", "spirit",
      "innerwilderness", "deathvalley", "sahara", "highlands", "theater", "photography",
      "series:unfinishedpart", "series:unfinished", "series:google",
      "series:feedscanner", "series:artempath",
      "series:triptych", "series:immemory", "series:cavedance", "series:negotiated",
      "shop",
      "series:interview",
    ];
    // Photography, restructured at her direction (2026-10-18): the part is
    // "Inner Wilderness 内在荒原", an opening text chapter carrying the
    // landscape statement, then each series stands as its own section with
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
        titleZh: w.titleZh ?? null,
        metaLine: [w.year, w.medium].filter(Boolean).join(" · "),
        year: w.year,
        medium: w.medium,
        mediumZh: w.mediumZh ?? null,
        dimensions: w.dimensions,
        dimensionsZh: w.dimensionsZh ?? null,
        description: w.description,
        category: "Inner Wilderness",
        image_url: img,
        fallback_image_url: img,
      };
    };
    const dvItems = photoItems.filter((p) => titleHas(p, "Death Valley", "死亡谷"));
    const hgItems = photoItems.filter((p) => titleHas(p, "Highland", "高地"));
    const thKnown = photoItems.filter((p) => titleHas(p, "Theater", "死亡的戏剧"));
    // Her direction (2026-11-10): two theatre balcony photographs and
    // one PLACEHOLDER festival photograph close the Theater chapter
    // (see THEATER_EXTRA_PLATES — the placeholder is its last entry).
    const thItems = [...thKnown, ...["10", "11"].map(mkPhotoItem).filter((x): x is CatalogItem => !!x).map((item) => ({ item, plate: 0 })), ...THEATER_EXTRA_PLATES.map((item) => ({ item, plate: 0 }))];
    const saharaItem = mkPhotoItem("7");
    const usedPhoto = new Set([...dvItems, ...hgItems, ...thKnown]);
    // Her direction (2026-11-10): the puppetry photograph she sent
    // closes the El Otro, El Mismo chapter (see EL_OTRO_EXTRA_PLATES).
    const elOtroItems = [
      ...photoItems.filter((p) => !usedPhoto.has(p)),
      ...EL_OTRO_EXTRA_PLATES.map((item) => ({ item, plate: 0 })),
    ];
    const photoChapters: Chapter[] = photoParent
      ? [
          { key: "innerwilderness", number: 0, title: "Inner Wilderness 内在荒原", titleEn: "Inner Wilderness", titleZh: "内在荒原", descriptionHtml: "", years: "2017 – 2025", items: [], seriesTextId: "innerwilderness", partHead: true },
          { key: "deathvalley", number: 0, title: "Reflections in the Death Valley 死亡谷", titleEn: "Reflections in the Death Valley", titleZh: "死亡谷", descriptionHtml: "", years: yrOf(dvItems), items: [...dvItems, ...DEATH_VALLEY_PLATES.map((item) => ({ item, plate: 0 }))], seriesTextId: "deathvalley" },
          { key: "sahara", number: 0, title: "Sahara from 6 to 10: An Archive 撒哈拉晚六时至早十时", titleEn: "Sahara from 6 to 10: An Archive", titleZh: "撒哈拉晚六时至早十时", descriptionHtml: "", years: saharaItem?.year ?? "", items: saharaItem ? [{ item: saharaItem, plate: 0 }] : [], seriesTextId: "sahara" },
          { key: "highlands", number: 0, title: "Scottish Highlands - Heroism of the Vista 苏格兰高地：视域的英雄主义", titleEn: "Scottish Highlands - Heroism of the Vista", titleZh: "苏格兰高地：视域的英雄主义", descriptionHtml: "", years: yrOf(hgItems), items: hgItems, seriesTextId: "highlands" },
          { key: "theater", number: 0, title: "Theater 登场", titleEn: "Theater", titleZh: "登场", descriptionHtml: "", years: yrOf(thItems), items: thItems, seriesTextId: "theater" },
          { ...photoParent, title: "El Otro, El Mismo 另一个，同一个", titleEn: "El Otro, El Mismo", titleZh: "另一个，同一个", descriptionHtml: "", years: yrOf(elOtroItems), items: elOtroItems },
        ]
      : [];
    // Her direction (2026-11-10): in the Theater section, the
    // Theater #3 plate moves to immediately after Theater #1, so the
    // run starts #1, #3, then the remaining plates in their current
    // relative order. Caption and background key travel with the work
    // (backgrounds key on the image path, not the sequence).
    const theaterChapter = photoChapters.find((ch) => ch.key === "theater");
    if (theaterChapter) {
      const t3 = theaterChapter.items.findIndex(({ item }) => item.title === "Theater #3");
      const t1 = theaterChapter.items.findIndex(({ item }) => item.title === "Theater #1");
      if (t3 >= 0 && t1 >= 0 && t3 !== t1 + 1) {
        const [moved] = theaterChapter.items.splice(t3, 1);
        const t1After = theaterChapter.items.findIndex(({ item }) => item.title === "Theater #1");
        theaterChapter.items.splice(t1After + 1, 0, moved);
      }
    }
    const byChapterKey = new Map([...catalogChapters, ...photoChapters, ...seriesChapters, ...splitChapters].map((ch) => [ch.key, ch]));
    let chapterNo = 0;
    const chapters = SECTION_ORDER.map((k) => byChapterKey.get(k))
      .filter((ch): ch is Chapter => !!ch)
      .map((ch) => (ch.partIntro ? { ...ch, number: 0 } : { ...ch, number: ++chapterNo }));
    // Her direction (2026-11-06): no chapter carries a year — openers and
    // essay heads print number and title only. (Asked first for the
    // Spirit chapter, then extended to all chapters the same evening.)
    for (const ch of chapters) ch.years = "";
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
    // Essay page budgets, calibrated to the two-column measure the essay
    // renderer now uses for long pages (her direction, 2026-11-07, after
    // Kim Hastreiter's STUFF: dense text pages against the book's quiet
    // ones). First pass (budgets 2200/1300) still left the lower half of
    // text pages empty, so the budgets were re-measured in a faithful
    // render harness (real CSS, real texts, checked against her preview
    // screenshots): EN 2800, CN 1400, with thicker headSeed so first
    // pages keep clear of the foot, and the two-column switch lowered
    // to pages over 450 chars — a many-short-paragraphs page overflows
    // the narrow single column long before it fills a two-column page.
    // Preface and painting-intro pages keep their own smaller
    // chunkParas budgets: they are the quiet pole.
    const langChunks = (en: EssayItem[], zh: EssayItem[]): EssayChunk[] => {
      const all = [
        ...chunkItems(en, 2800, { overhead: 14, brCost: 48, headSeed: 330 }).map((items) => ({ lang: "en" as const, items })),
        ...chunkItems(zh, 1400, { overhead: 15, brCost: 24, headSeed: 230 }).map((items) => ({ lang: "zh" as const, items })),
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
        const anchors = s ? SERIES_PLATE_ANCHORS[s.id] : undefined;
        if (s && anchors && enT && zhT) {
          // Illustrated long-text chapter: plates anchored inside the
          // text flow (see SERIES_PLATE_ANCHORS / plateBreaks). The text
          // itself runs as language blocks, English first, then Chinese
          // (her direction, 2026-11-07, replacing the 2026-11-05
          // paragraph-pair interleave).
          const enBlocks = pBlocks(asParas(enT)).map((html) => ({ html, edit: `series:${s.id}:en` }));
          let zhBlocks = pBlocks(asParas(zhT)).map((html) => ({ html, edit: `series:${s.id}:zh` }));
          let zhExtras: Map<number, EssayItem[]> | undefined;
          if (s.id === "artempath" && zhBlocks.length === enBlocks.length + 2) {
            // The Chinese side carries two extra blocks after paragraph 9:
            // her Rothko post, kept whole at her direction, plus its date
            // line. They belong to that paragraph's pair; the rest of the
            // Chinese text realigns by the same offset.
            zhExtras = new Map([[9, zhBlocks.slice(10, 12)]]);
            zhBlocks = [...zhBlocks.slice(0, 10), ...zhBlocks.slice(12)];
          }
          if (s.id === "artempath") {
            // Her diary entry of February 15, 2018 opens the text: a
            // dated passage, indented into a narrower column (design E,
            // 2026-11-06) up to the "(c. 2018)" block, where the project
            // text begins. Her original post kept whole inside the
            // Chinese flow, and its date line, are indented with it.
            const cut = enBlocks.findIndex((b) => b.html.includes("(c. 2018)"));
            const diaryEnd = cut === -1 ? enBlocks.length : cut;
            for (let i = 0; i < diaryEnd; i++) {
              const last = i === diaryEnd - 1;
              enBlocks[i] = indentItem(enBlocks[i], last);
              if (zhBlocks[i]) zhBlocks[i] = indentItem(zhBlocks[i], last);
            }
            const extra = zhExtras?.get(9);
            if (extra) zhExtras?.set(9, extra.map((it, i) => indentItem(it, i === extra.length - 1)));
          }
          if (zhBlocks.length === enBlocks.length) {
            // Dual-stream: chunk each language on its own (same budgets
            // as langChunks), English chunks first, then Chinese. Plates
            // anchor inside the English flow, after the chunk holding
            // their anchor paragraph. Chinese-only extras keep their
            // aligned place inside the Chinese flow, right after the
            // block they belong to.
            const enChunked = chunkItems(enBlocks, 2800, { overhead: 14, brCost: 48, headSeed: 330 });
            const enItemChunk = new Map<EssayItem, number>();
            enChunked.forEach((items, ci) => items.forEach((it) => enItemChunk.set(it, ci)));
            const zhStream: EssayItem[] = [];
            zhBlocks.forEach((it, i) => {
              zhStream.push(it);
              const extras = zhExtras?.get(i);
              if (extras) zhStream.push(...extras);
            });
            essayChunks[chapter.key] = [
              ...enChunked.map((items) => ({ lang: "en" as const, items })),
              ...chunkItems(zhStream, 1400, { overhead: 15, brCost: 24, headSeed: 230 }).map((items) => ({ lang: "zh" as const, items })),
            ];
            chapter.plateBreaks = {};
            chapter.plateAnchorOrder = anchors.map((a) => a.image);
            for (const a of anchors) {
              const anchorItem = enBlocks[a.afterPair];
              const ci = anchorItem ? enItemChunk.get(anchorItem) : undefined;
              if (ci !== undefined) {
                chapter.plateBreaks[a.image] = ci + 1;
              }
            }
          } else {
            essayChunks[chapter.key] = langChunks(enBlocks, zhBlocks);
          }
        } else {
          essayChunks[chapter.key] =
            !enT && !zhT
              ? []
              : langChunks(
                  enT ? pBlocks(asParas(enT)).map((html) => ({ html, edit: `series:${s?.id}:en` })) : [],
                  zhT ? pBlocks(asParas(zhT)).map((html) => ({ html, edit: `series:${s?.id}:zh` })) : [],
                );
        }
      } else if (chapter.key === "remains") {
        const paras = txParas("remainsEssayBody");
        const leadEn: EssayItem = { html: "<p>In the profound atmosphere of the Anahuacalli Museum, I gaze at these ancient handmade works, following Diego Rivera's vision as I look for a spark of continuity between modern art and pre-Columbian aesthetics. The figures in these works of the ancient civilizations of the Americas are strikingly artless and strange. Though carved in a refined, stylized manner, they are simple and powerful.</p>" };
        const leadZh: EssayItem = { html: "<p>在 Anahuacalli 博物馆的深邃氛围中，我凝视这些远古的手作，按照迭戈·里维拉的构想，在现代艺术与前哥伦布时期美学之间寻找延续的火花。这些美洲古文明的作品形象格外憨朴奇崛，尽管是以洗练的风格化手法雕成，却简洁有力。</p>" };
        // The two paragraphs are her own Facebook post (July 12, 2023); as with
        // her other diary-like texts in this book, a small source line closes
        // the text, in the bk-credit style. Place per the post's own
        // location tag: Mexico · Azcapotzalco. No URL is printed, per her
        // rule for source lines in the book.
        const noteEn: EssayItem = { html: "<p><span class=\"bk-credit\">July 12, 2023, Mexico · Azcapotzalco</span></p>" };
        const noteZh: EssayItem = { html: "<p><span class=\"bk-credit\">2023 年 7 月 12 日，墨西哥 · Azcapotzalco</span></p>" };
        // Her series statement from the Canva painting book follows the
        // Facebook-post text (her order, 2026-11-06: the Rivera text in
        // front, this statement after). The English is her own wording,
        // verbatim; the Chinese is Beignet's translation, pending her
        // review. It stands after the source line, which belongs to the
        // Facebook post alone.
        const stmtEn1: EssayItem = { html: "<p>Remains is a series made by collaging drawings on paper with digital drawings, born from a subtle sense of the absurd. While studying ancient terracotta figurines, I was captivated by their familiar, awkward, and caught mid-nothing expressions.</p>" };
        const stmtEn2: EssayItem = { html: "<p>The series borrows its visual grammar from these figurines from different civilizations and historical periods, and drops them into the theater of contemporary daily life.</p>" };
        const stmtZh1: EssayItem = { html: "<p>《遗迹》是纸上绘画与数字绘图拼贴而成的系列，源于一种微妙的荒诞感。研究古代陶俑时，我被它们的表情吸引：亲切，笨拙，像是什么都没有做，就停在那一刻。</p>" };
        const stmtZh2: EssayItem = { html: "<p>这个系列的视觉语法就借自这些陶俑。它们来自不同的文明、不同的历史时期，我把它们放进当代日常生活的剧场。</p>" };
        essayChunks[chapter.key] = langChunks([indentItem(leadEn), ...paraItems(paras.filter((p) => !hasCjk(p.text))).map(indentItem), indentItem(noteEn, true), stmtEn1, stmtEn2], [indentItem(leadZh), ...paraItems(paras.filter((p) => hasCjk(p.text))).map(indentItem), indentItem(noteZh, true), stmtZh1, stmtZh2]);
      } else if (chapter.key === "photography") {
        // No title line inside the text (her direction, 2026-11-08): a
        // hardcoded "El Otro, El Mismo" head item used to be prepended to
        // both language streams, so the section title printed three times
        // on the opening spread — the essay head on the first page already
        // carries it. The body text stands on its own now.
        const otro = txParas("elOtroEssayBody");
        const en = paraItems(otro.filter((p) => !hasCjk(p.text)));
        const zh = paraItems(otro.filter((p) => hasCjk(p.text)));
        essayChunks[chapter.key] = langChunks(en, zh);
      } else if (chapter.seriesTextId) {
        const s = BOOK_SERIES.find((x) => x.id === chapter.seriesTextId);
        const enT = (s && (textEdits[`series:${s.id}:en`] ?? s.textEn)) || "";
        const zhT = (s && (textEdits[`series:${s.id}:zh`] ?? s.textZh)) || "";
        if (s) {
          fieldTexts[`series:${s.id}:en`] = enT;
          fieldTexts[`series:${s.id}:zh`] = zhT;
        }
        // Still Things long carried no body text at all (its
        // BOOK_SERIES entry was empty): langChunks' empty-text
        // sentinel would give the section one blank text page. She
        // deleted that page (her direction, 2026-11-09), so an empty
        // text here means zero essay chunks. Since 2026-11-10 the
        // entry carries her placeholder "todo" (the Unfinished
        // Archive convention), so the section paginates intro pages
        // like its siblings until she supplies the real text.
        essayChunks[chapter.key] =
          chapter.key === "stillthings" && !enT && !zhT
            ? []
            : langChunks(
                enT ? pBlocks(asParas(enT)).map((html) => ({ html, edit: `series:${s?.id}:en` })) : [],
                zhT ? pBlocks(asParas(zhT)).map((html) => ({ html, edit: `series:${s?.id}:zh` })) : [],
              );
      } else if (chapter.key === "spirit") {
        // Essay layout (her direction, 2026-11-06, replacing the
        // 2026-11-05 paragraph-pair interleave): the whole English essay
        // runs first, then the whole Chinese essay, no interleaving. Each
        // background group's painting anchors inside the English essay,
        // right after the chunk where its group text ends (see
        // plateBreaks); the Chinese essay then runs clean. Her GenAI
        // statement has no Chinese text (no parasZh) and stays
        // English-only inside the flow.
        const enStream: EssayItem[] = [];
        const zhStream: EssayItem[] = [];
        const enGroupEnd = new Map<string, number>();
        const pushBoth = (en: EssayItem, zh?: EssayItem) => {
          enStream.push(en);
          if (zh) zhStream.push(zh);
        };
        const ovEn = fieldItems("spirit", "en");
        const ovZh = fieldItems("spirit", "zh");
        ovEn.forEach((it, i) => pushBoth(it, ovZh[i]));
        for (let j = ovEn.length; j < ovZh.length; j++) zhStream.push(ovZh[j]);
        // Her bridge sentence (chosen by her, 2026-11-05) no longer
        // stands in this essay body: it closes the chapter on its own
        // quiet page instead (her direction, 2026-11-09 — see
        // SPIRIT_BRIDGE_TEXT and the motto push at the end of this
        // chapter in paginate()).
        // Her own first-person post on the painting Inundated (WeChat
        // Moments, March 28, 2018) stands right after the series overview,
        // ahead of the borrowed background texts: her voice first, then the
        // texts the paintings answer to.
        pushBoth(
          indentItem({ html: `<p><span class="bk-credit">${SPIRIT_MOMENT.labelEn}</span></p>`, edit: "spiritmoment:inundated" }),
          indentItem({ html: `<p><span class="bk-credit">${SPIRIT_MOMENT.labelZh}</span></p>`, edit: "spiritmoment:inundated" }),
        );
        pushBoth(
          indentItem({ html: `<p>${SPIRIT_MOMENT.textEn}</p>`, edit: "spiritmoment:inundated" }, true),
          indentItem({ html: `<p>${SPIRIT_MOMENT.textZh}</p>`, edit: "spiritmoment:inundated" }, true),
        );
        for (const g of SPIRIT_BACKGROUNDS) {
          enStream.push({ html: `<p><strong>${g.titleEn}</strong></p>`, edit: `spiritbg:${g.id}` });
          if (g.titleZh) zhStream.push({ html: `<p><strong>${g.titleZh}</strong></p>`, edit: `spiritbg:${g.id}` });
          if (g.workTitle) enStream.push({ html: `<p><strong>${g.workTitle}</strong></p>`, edit: `spiritbg:${g.id}` });
          const toBg = (para: string | { head: string }): EssayItem => ({
            html: typeof para === "string" ? `<p>${para}</p>` : `<p><strong>${para.head}</strong></p>`,
            edit: `spiritbg:${g.id}`,
          });
          g.paras.forEach((para, i) => {
            enStream.push(toBg(para));
            if (g.parasZh?.[i]) zhStream.push(toBg(g.parasZh[i]));
          });
          if (g.credit) {
            // The group's source line closes the group in both essays.
            enStream.push({ html: `<p><span class="bk-credit">${g.credit}</span></p>`, edit: `spiritbg:${g.id}` });
            zhStream.push({ html: `<p><span class="bk-credit">${g.credit}</span></p>`, edit: `spiritbg:${g.id}` });
          }
          enGroupEnd.set(g.id, enStream.length - 1);
        }
        const enChunked = chunkItems(enStream, 2800, { overhead: 14, brCost: 48, headSeed: 330 });
        const zhChunked = chunkItems(zhStream, 1400, { overhead: 15, brCost: 24, headSeed: 230 });
        essayChunks[chapter.key] = [
          ...enChunked.map((items) => ({ lang: "en" as const, items })),
          ...zhChunked.map((items) => ({ lang: "zh" as const, items })),
        ];
        const enItemChunk = new Map<EssayItem, number>();
        enChunked.forEach((items, ci) => items.forEach((it) => enItemChunk.set(it, ci)));
        chapter.plateBreaks = {};
        chapter.plateAnchorOrder = SPIRIT_BACKGROUNDS.map((g) => SPIRIT_GROUP_PLATES[g.id]).filter(Boolean);
        for (const [groupId, suffix] of Object.entries(SPIRIT_GROUP_PLATES)) {
          const endIx = enGroupEnd.get(groupId);
          const found = chapter.items.find(({ item }) => item.image_url.endsWith(suffix));
          if (endIx !== undefined && found) {
            const ci = enItemChunk.get(enStream[endIx]);
            if (ci !== undefined) chapter.plateBreaks[found.item.image_url] = ci + 1;
          }
        }
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
        // Altar plate, the work first, then the note on how the ceramics
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
    // (No online-lookup lines are appended: print rule, 2026-11-06.)
    const byKey = (key: CatalogSectionKey) => chapters.find((c) => c.key === key)?.items.map((i) => i.item) ?? [];
    const prefaceParas = txParas("prefaceBody");
    const paintingParas = txParas("paintingIntroBody");
    return {
      t,
      chapters,
      prefaceChunks: [
        ...chunkParas(prefaceParas.filter((p) => !hasCjk(p.text)), 1500, 20),
        ...chunkParas(prefaceParas.filter((p) => hasCjk(p.text)), 880, 22),
      ],
      // One page, both languages (her direction, 2026-11-08): the
      // introduction is short (553 EN + 218 ZH chars) and the old
      // language split left its second page nearly empty. English
      // first, Chinese right after, on a single page.
      paintingChunks: [
        { paras: [...paintingParas.filter((p) => !hasCjk(p.text)), ...paintingParas.filter((p) => hasCjk(p.text))] },
      ],
      essayChunks,
      editMode,
      fieldTexts,
      openEditor,
      pageBgFor,
      setPageBg,
      bgImgFor,
      setBgImg,
      openBgImagePanel,
      imgEditFor,
      setImgEdit,
      imgSel,
      selectImg,
      startEyedrop,
      years: yearRange(chapters.flatMap((c) => c.items.map((i) => i.item.year))),
      coverFront: byKey("residuals")[0] ?? chapters[0]?.items[0]?.item,
      coverBack: byKey("photography")[0] ?? chapters[0]?.items[1]?.item,
    };
  }, [textEdits, editMode, pageBgEdits, bgImgEdits, imgEdits, imgSel]);
  const pages = useMemo(() => paginate(ctx.chapters, ctx.prefaceChunks.length, ctx.paintingChunks.length, Object.fromEntries(Object.entries(ctx.essayChunks).map(([k, v]) => [k, v.length]))), [ctx]);
  return { ctx, pages };
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
  // Phone preview (<=768px): one page per row, scaled to the screen width,
  // with a thumb navigation bar. Desktop keeps the two-page spread layout.
  const MOBILE_MQ = "(max-width: 768px)";
  const [isMobile, setIsMobile] = useState<boolean>(
    () => typeof window !== "undefined" && window.matchMedia(MOBILE_MQ).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  // Initial zoom is computed during the first render, not in an effect: at
  // zoom 1 the inch-wide spreads are ~1632px across, and a phone browser
  // answers that first paint by widening its layout viewport, after which
  // every later measurement (and the zoom itself) is off.
  const [zoom, setZoom] = useState<number>(() => {
    if (typeof window === "undefined") return 1;
    const rowIn = window.matchMedia(MOBILE_MQ).matches ? TRIM_W : 2 * TRIM_W;
    return Math.min(1, (window.innerWidth - 32) / (rowIn * PX_PER_IN));
  });
  // ── Book editor (edit mode): staged text edits + per-page backgrounds ──
  /** Structural equality for the small JSON-shaped editor values. */
  const eqJSON = (a: unknown, b: unknown): boolean => JSON.stringify(a) === JSON.stringify(b);
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
  const [pageBgEdits, setPageBgEdits] = useState<Record<string, PageBgValue | "global">>(() => loadJSON("remains-book-page-bg", {}));
  const [bgImgEdits, setBgImgEdits] = useState<Record<string, PageBgImage | null>>(() => loadJSON("remains-book-bgimg", {}));
  // Picture edits (size / replacement), keyed by picture src.
  const [imgEdits, setImgEdits] = useState<Record<string, ImgEdit>>(() => loadJSON("remains-book-img-edits", {}));
  // "Sent" marks (her request, 2026-11-08): Make PR used to snapshot
  // the editor stores and show a 已发送 chip on items still equal
  // to the snapshot. Superseded 2026-11-09 by clear-after-PR (see
  // clearAllEdits): the stores and this snapshot are wiped at Make PR,
  // so in practice the snapshot stays empty and no chips accumulate.
  // Local only (localStorage), never part of book-edits.json.
  interface SentSnap {
    t: Record<string, string>;
    b: Record<string, PageBgValue | "global">;
    i: Record<string, PageBgImage | null>;
    g: Record<string, ImgEdit>;
  }
  const [sentSnap, setSentSnap] = useState<SentSnap>(() => loadJSON("remains-book-sent", { t: {}, b: {}, i: {}, g: {} }));
  useEffect(() => {
    localStorage.setItem("remains-book-sent", JSON.stringify(sentSnap));
  }, [sentSnap]);
  // One-time cleanup (2026-11-10): the per-page note editor was removed;
  // drop any stale notes store a browser still carries so nothing lingers.
  useEffect(() => {
    localStorage.removeItem("remains-book-page-notes");
  }, []);
  const [imgSel, setImgSel] = useState<string | null>(null);
  // Leaving edit mode drops the picture selection with it.
  useEffect(() => {
    if (!editMode) setImgSel(null);
  }, [editMode]);
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    JSON.stringify({ t: loadJSON("remains-book-text-edits", {}), b: loadJSON("remains-book-page-bg", {}), i: loadJSON("remains-book-bgimg", {}), g: loadJSON("remains-book-img-edits", {}) }),
  );
  const [panel, setPanel] = useState<{ edit: string; label: string; value: string } | null>(null);
  const [bgPanel, setBgPanel] = useState<BgImagePanelInfo | null>(null);
  const [eyedrop, setEyedrop] = useState<{ info: EyedropInfo; color: string } | null>(null);
  const [eyedropPick, setEyedropPick] = useState<EyedropInfo | null>(null);
  const [eyedropHover, setEyedropHover] = useState<{ hex: string; x: number; y: number } | null>(null);
  const pickHoverRaf = useRef(0);
  const [prMsg, setPrMsg] = useState("");
  const editorDirty = JSON.stringify({ t: textEdits, b: pageBgEdits, i: bgImgEdits, g: imgEdits }) !== savedSnapshot;
  const openEditor = (edit: string, label: string, current: string) => setPanel({ edit, label, value: current });
  const pageBgFor = (key: string | null): PageBgValue | undefined => {
    if (!key) return undefined;
    const e = pageBgEdits[key];
    if (e && e !== "global") return e;
    return PAGE_BACKGROUNDS[key];
  };
  const setPageBg = (key: string, kind: PageBgValue | "global") => setPageBgEdits((prev) => ({ ...prev, [key]: kind }));
  // Background-image editor state (PR #159): these five helpers were used
  // by useBookModel / InteriorPageView / BgImagePanel but never defined, so
  // evaluating the useBookModel argument object threw a ReferenceError on
  // mount and the book viewer never rendered. Definitions mirror pageBgFor /
  // setPageBg above: local edits win, a null edit clears the committed entry.
  const bgImgFor = (key: string | null): PageBgImage | undefined => {
    if (!key) return undefined;
    if (key in bgImgEdits) return bgImgEdits[key] ?? undefined;
    return PAGE_BACKGROUND_IMAGES[key];
  };
  const setBgImg = (key: string, value: PageBgImage | null) => setBgImgEdits((prev) => ({ ...prev, [key]: value }));
  const openBgImagePanel = (info: BgImagePanelInfo) => setBgPanel(info);
  // Picture edits: read / write the staged edit for one picture src; a
  // null edit (or one with neither field) clears the entry.
  // Landed picture edits (src/lib/imageEdits.ts) apply everywhere;
  // a staged editor edit for the same picture overrides them.
  const imgEditFor = (src: string): ImgEdit | undefined => imgEdits[src] ?? IMAGE_EDITS[src];
  const setImgEdit = (src: string, edit: ImgEdit | null) =>
    setImgEdits((prev) => {
      const next = { ...prev };
      if (!edit || (edit.scale === undefined && !edit.src && !edit.full && !edit.dx && !edit.dy && !edit.pos)) delete next[src];
      else next[src] = edit;
      return next;
    });
  const selectImg = (src: string | null) => setImgSel(src);
  const applyBgImg = (scope: BgImgScope, src: string) => {
    if (!bgPanel) return;
    if (scope === "spread") {
      const key = bgPanel.leftKey ?? bgPanel.rightKey;
      if (!key) return;
      // A spread entry may live on either page key; drop a stale one on the
      // other side so exactly one spread entry remains.
      const other = key === bgPanel.leftKey ? bgPanel.rightKey : bgPanel.leftKey;
      if (other && bgImgFor(other)?.scope === "spread") setBgImg(other, null);
      setBgImg(key, { src, scope: "spread" });
      return;
    }
    const key = scope === "left" ? bgPanel.leftKey : bgPanel.rightKey;
    if (key) setBgImg(key, { src, scope: "page" });
  };
  const clearBgImg = (scope: BgImgScope) => {
    if (!bgPanel) return;
    if (scope === "spread") {
      for (const key of [bgPanel.leftKey, bgPanel.rightKey]) {
        if (key && bgImgFor(key)?.scope === "spread") setBgImg(key, null);
      }
      return;
    }
    const key = scope === "left" ? bgPanel.leftKey : bgPanel.rightKey;
    if (key) setBgImg(key, null);
  };
  // Background-image drafts persist on EVERY change, unlike the staged
  // text / paper edits, which wait for the toolbar's Save. A clear that
  // lived only in component state was lost on refresh: bgImgFor then fell
  // back to the committed PAGE_BACKGROUND_IMAGES entry and the panel
  // "revived" that image — preselected — although it had just been
  // cleared. Writing the draft through (nulls included, so a cleared key
  // keeps shadowing the committed entry) makes a clear stick. The saved
  // snapshot moves with the write, so the toolbar's unsaved-changes
  // marker treats the auto-save as saved.
  useEffect(() => {
    try {
      localStorage.setItem("remains-book-bgimg", JSON.stringify(bgImgEdits));
      setSavedSnapshot((prev) => {
        try {
          const snap = JSON.parse(prev) as { t: unknown; b: unknown; i: unknown };
          return JSON.stringify({ ...snap, i: bgImgEdits });
        } catch {
          return prev;
        }
      });
    } catch {
      // Storage full (uploaded data URLs are large): the in-memory draft
      // still applies for this session, and Save / Make PR work as before.
    }
  }, [bgImgEdits]);
  // Picture drafts persist on EVERY change too, same reasoning as the
  // background-image drafts above: a resize or a swap that survived only
  // in component state would vanish on refresh.
  useEffect(() => {
    try {
      localStorage.setItem("remains-book-img-edits", JSON.stringify(imgEdits));
      setSavedSnapshot((prev) => {
        try {
          const snap = JSON.parse(prev) as Record<string, unknown>;
          return JSON.stringify({ ...snap, g: imgEdits });
        } catch {
          return prev;
        }
      });
    } catch {
      // Storage full (a swapped-in original is large): the in-memory
      // draft still applies for this session and the export carries it.
    }
  }, [imgEdits]);
  // Eyedropper (edit mode): the native EyeDropper where the browser has
  // one; otherwise an in-page picking state — the stage's capture-phase
  // click samples instead of acting (see onStagePickClick), and Esc or the
  // hint bar's Cancel leaves it. Either way the sampled hex lands in
  // eyedrop state and EyedropPanel offers the apply scopes. All five
  // helpers are defined here next to their pageBg / bgImg counterparts.
  const startEyedrop = (info: EyedropInfo) => {
    const ED = nativeEyeDropper();
    if (ED) {
      new ED().open().then(
        ({ sRGBHex }) => setEyedrop({ info, color: sRGBHex.toLowerCase() }),
        () => {
          /* aborted in the native UI — nothing to apply */
        },
      );
      return;
    }
    setEyedropHover(null);
    setEyedropPick(info);
  };
  const applyEyedrop = (scope: BgImgScope, hex: string) => {
    if (!eyedrop) return;
    if (scope === "spread") {
      if (eyedrop.info.leftKey) setPageBg(eyedrop.info.leftKey, hex);
      if (eyedrop.info.rightKey) setPageBg(eyedrop.info.rightKey, hex);
      return;
    }
    const key = scope === "left" ? eyedrop.info.leftKey : eyedrop.info.rightKey;
    if (key) setPageBg(key, hex);
  };
  const endEyedropPick = () => {
    setEyedropPick(null);
    setEyedropHover(null);
  };
  const onStagePickClick = (e: ReactMouseEvent) => {
    if (!eyedropPick) return;
    // Capture phase: the sampling click must not reach whatever it lands
    // on — no TOC jump, no text editor, no other edit gesture.
    e.preventDefault();
    e.stopPropagation();
    // A click on an editor control (the 取色 button again, a panel) just
    // leaves picking mode without triggering that control.
    if ((e.target as HTMLElement).closest("[data-noprint]")) {
      endEyedropPick();
      return;
    }
    const r = sampleColorAtPoint(e.clientX, e.clientY);
    if (r && "blocked" in r) {
      setPrMsg(lang === "zh" ? "这张图跨域，取不了色，换个位置试试。" : "That image is cross-origin and cannot be sampled — try another spot.");
      return;
    }
    if (r && "hex" in r) {
      setEyedrop({ info: eyedropPick, color: r.hex });
      endEyedropPick();
      return;
    }
    setPrMsg(lang === "zh" ? "这个位置取不到颜色，换个位置试试。" : "No colour could be sampled there — try another spot.");
  };
  const onStagePickMove = (e: ReactMouseEvent) => {
    if (!eyedropPick || pickHoverRaf.current) return;
    const { clientX, clientY } = e;
    pickHoverRaf.current = requestAnimationFrame(() => {
      pickHoverRaf.current = 0;
      const r = sampleColorAtPoint(clientX, clientY);
      setEyedropHover(r && "hex" in r ? { hex: r.hex, x: clientX, y: clientY } : null);
    });
  };
  useEffect(() => {
    if (!eyedropPick) return;
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") endEyedropPick();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (pickHoverRaf.current) cancelAnimationFrame(pickHoverRaf.current);
      pickHoverRaf.current = 0;
    };
  }, [eyedropPick]);
  const saveAllEdits = () => {
    localStorage.setItem("remains-book-text-edits", JSON.stringify(textEdits));
    localStorage.setItem("remains-book-page-bg", JSON.stringify(pageBgEdits));
    localStorage.setItem("remains-book-bgimg", JSON.stringify(bgImgEdits));
    localStorage.setItem("remains-book-img-edits", JSON.stringify(imgEdits));
    setSavedSnapshot(JSON.stringify({ t: textEdits, b: pageBgEdits, i: bgImgEdits, g: imgEdits }));
    setPrMsg(lang === "zh" ? "已保存到本机浏览器。" : "Saved in this browser.");
  };
  const buildEditsPayload = () => {
    const pageBg: Record<string, PageBgValue> = { ...PAGE_BACKGROUNDS };
    for (const [k, v] of Object.entries(pageBgEdits)) {
      if (v === "global") delete pageBg[k];
      else pageBg[k] = v;
    }
    const pageBgImages: Record<string, PageBgImage> = { ...PAGE_BACKGROUND_IMAGES };
    for (const [k, v] of Object.entries(bgImgEdits)) {
      if (v === null) delete pageBgImages[k];
      else pageBgImages[k] = v;
    }
    // Picture edits ride along keyed by picture src: { scale?, src? } —
    // src is a replacement image's data URL when the picture was swapped.
    return { textEdits, pageBg, pageBgImages, imageEdits: imgEdits };
  };
  const sentStats = useMemo(() => {
    let total = 0;
    let sent = 0;
    for (const [k, v] of Object.entries(textEdits)) { total++; if (sentSnap.t?.[k] === v) sent++; }
    for (const [k, v] of Object.entries(pageBgEdits)) { total++; if (sentSnap.b?.[k] === v) sent++; }
    for (const [k, v] of Object.entries(bgImgEdits)) { total++; if (eqJSON(sentSnap.i?.[k], v)) sent++; }
    for (const [k, v] of Object.entries(imgEdits)) { total++; if (eqJSON(sentSnap.g?.[k], v)) sent++; }
    return { total, sent };
  }, [textEdits, pageBgEdits, bgImgEdits, imgEdits, sentSnap]);
  // Rule (artist, 2026-11-09): once Make PR has handed the edits off,
  // the editor clears ALL local edits — the next Make PR must contain
  // only new edits, never accumulated stock (「不要记存量」). This
  // replaces the 2026-11-08 "sent" snapshot: instead of marking what
  // was sent, the stores are wiped, and the sent snapshot goes with
  // them so no stale 已发送 mark can resurface on a future edit.
  // buildEditsPayload's pageBg / pageBgImages maps are NOT affected:
  // they are rebuilt from the committed source maps on every Make PR,
  // which is how revocations still propagate server-side; only the
  // local edit stores are cleared.
  const clearAllEdits = () => {
    setTextEdits({});
    setPageBgEdits({});
    setBgImgEdits({});
    setImgEdits({});
    setSentSnap({ t: {}, b: {}, i: {}, g: {} });
    for (const k of ["remains-book-text-edits", "remains-book-page-bg", "remains-book-bgimg", "remains-book-img-edits", "remains-book-sent"]) {
      localStorage.removeItem(k);
    }
    setSavedSnapshot(JSON.stringify({ t: {}, b: {}, i: {}, g: {} }));
  };
  const generatePR = async () => {
    setPrMsg(lang === "zh" ? "正在生成 PR…" : "Creating PR…");
    const payload = buildEditsPayload();
    try {
      const res = await fetch("/api/book-pr", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (res.ok && data.url) {
        clearAllEdits();
        setPrMsg(
          lang === "zh"
            ? `PR: ${data.url} 编辑已清空 — 下次生成 PR 只包含新的编辑。`
            : `PR: ${data.url} Edits cleared — the next Make PR will include only new edits.`,
        );
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
      clearAllEdits();
      setPrMsg(
        lang === "zh"
          ? `自动生成失败（${err instanceof Error ? err.message : "网络问题"}），已下载 book-edits.json，把它发给 Beignet 即可生成同样的 PR。编辑已清空 — 下次生成 PR 只包含新的编辑。`
          : "Automatic PR failed; book-edits.json downloaded instead, send it to Beignet. Edits cleared — the next Make PR will include only new edits.",
      );
    }
  };
  const stageRef = useRef<HTMLDivElement>(null);

  usePageMeta({
    title: `${b.title} - ${b.cta}`,
    description: "Remains, a print-ready art book by Chun Wang. Covers and interior pages laid out for PDF export.",
    path: "/catalogs/book",
    noindex: true,
  });

  const { ctx, pages } = useBookModel({ editMode, textEdits, pageBgEdits, pageBgFor, setPageBg, bgImgEdits, bgImgFor, setBgImg, openBgImagePanel, startEyedrop, openEditor, imgEdits, imgEditFor, setImgEdit, imgSel, selectImg });
  // Every picture already in the book, for the background-image picker.
  const bookImages = useMemo(() => {
    const seen = new Map<string, string>();
    for (const c of ctx.chapters) for (const { item } of c.items) if (!seen.has(item.image_url)) seen.set(item.image_url, item.title);
    return [...seen.entries()].map(([src, title]) => ({ src, title }));
  }, [ctx]);
  const bgPanelCurrent = bgPanel
    ? {
        spread: [bgImgFor(bgPanel.leftKey), bgImgFor(bgPanel.rightKey)].find((e) => e?.scope === "spread"),
        left: bgImgFor(bgPanel.leftKey)?.scope === "page" ? bgImgFor(bgPanel.leftKey) : undefined,
        right: bgImgFor(bgPanel.rightKey)?.scope === "page" ? bgImgFor(bgPanel.rightKey) : undefined,
      }
    : null;
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
  // On phones the unit is a single page instead, so a page fills the screen width.
  useEffect(() => {
    const update = () => {
      const rowWidthPx = (part === "cover" ? wrapW : isMobile ? pageW : 2 * pageW) * PX_PER_IN;
      setZoom(Math.min(1, (window.innerWidth - 32) / rowWidthPx));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [part, pageW, wrapW, isMobile]);

  // ── Phone page navigation: track the sheet nearest the middle of the
  // screen and offer prev/next + a jump slider in a fixed bottom bar. ──
  const [currentSheet, setCurrentSheet] = useState(0);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    setCurrentSheet(0);
  }, [part]);
  useEffect(() => {
    if (!isMobile) return;
    const rows = rowRefs.current;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.sheetIndex);
            if (!Number.isNaN(idx)) setCurrentSheet(idx);
          }
        }
      },
      { rootMargin: "-38% 0px -55% 0px", threshold: 0 },
    );
    rows.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [isMobile, sheets, part]);
  const goToSheet = (idx: number, behavior: ScrollBehavior = "smooth") => {
    const target = Math.max(0, Math.min(sheets.length - 1, idx));
    setCurrentSheet(target);
    rowRefs.current[target]?.scrollIntoView({ behavior, block: "start" });
  };
  const sheetLabel = (key: string): string => {
    if (key === "front") return "Front cover";
    if (key === "back") return "Back cover";
    if (key === "wrap") return "Cover wrap";
    const m = /^p(\d+)$/.exec(key);
    return m ? `Page ${m[1]} / ${pages.length}` : key;
  };

  // ── Deep links ────────────────────────────────────────────────────────────
  // A shared link can name the page it opens on: ?page=<folio> jumps to that
  // printed page, ?section=<key> to a section's opening page — the same
  // first page the contents page prints for that chapter. Section keys:
  // title, contents, preface, about, collage, painting-intro, reverse-index,
  // canva (the facsimile painting book bound into Part 1),
  // or any chapter key (spirit, remains, residuals, shop, ...).
  // Series-driven chapters are keyed "series:<id>" in the book model while
  // shared links name them by the bare series id (?section=negotiated), so
  // both spellings resolve: exact chapter key first, then the series:
  // namespace. (Before this, the bare id never matched a chapter key and
  // the link silently opened at the cover.) With neither parameter nothing
  // changes: the book still opens at the front, and pagination and print
  // are untouched.
  const deepLinkPage = useMemo(() => {
    if (typeof window === "undefined") return null;
    const q = new URLSearchParams(window.location.search);
    const pageParam = q.get("page");
    if (pageParam !== null) {
      const n = Number(pageParam);
      if (Number.isInteger(n) && n >= 1 && n <= pages.length) return n;
    }
    const section = q.get("section");
    if (!section) return null;
    if (section === "painting-intro") {
      // The introduction lives on the Part 1 opener spread now.
      return pages.find((p) => p.spec.kind === "opener" && "chapter" in p.spec && p.spec.chapter.key === "part:afterimages")?.number ?? null;
    }
    if (
      section === "title" ||
      section === "contents" ||
      section === "preface" ||
      section === "about" ||
      section === "reverse-index" ||
      section === "canva"
    ) {
      const kind = section as PageSpec["kind"];
      return pages.find((p) => p.spec.kind === kind)?.number ?? null;
    }
    if (section === "collage") {
      return pages.find((p) => p.spec.kind === "plate" && "chapter" in p.spec && p.spec.chapter.key === "collage")?.number ?? null;
    }
    const chapterStart = (key: string) =>
      pages.find((p) => "chapter" in p.spec && p.spec.chapter.key === key)?.number ?? null;
    return chapterStart(section) ?? chapterStart(`series:${section}`);
  }, [pages]);
  useEffect(() => {
    if (deepLinkPage === null) return;
    let cancelled = false;
    let landedY: number | null = null;
    const target = () => document.getElementById(`bk-page-${deepLinkPage}`);
    if (!target()) return;
    const stop = () => {
      cancelled = true;
    };
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("keydown", stop);
    const jump = () => {
      if (cancelled) return;
      target()?.scrollIntoView({ behavior: "auto", block: "start" });
      landedY = window.scrollY;
    };
    // Jump once the stage has been painted at its final layout: fonts
    // resolved and two frames in, the inch-sized rows no longer move.
    // Then correct once after full load, when image decoding has settled
    // any residual drift — but only if the reader is still where the jump
    // left them, so a reader who scrolled away is never yanked back.
    let raf1 = 0;
    let raf2 = 0;
    document.fonts?.ready.then(() => {
      if (cancelled) return;
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(jump);
      });
    });
    const correct = () => {
      const el = target();
      if (cancelled || landedY === null || !el) return;
      if (Math.abs(window.scrollY - landedY) > 4) return;
      if (Math.abs(el.getBoundingClientRect().top) > 4) jump();
    };
    if (document.readyState === "complete") correct();
    else window.addEventListener("load", correct, { once: true });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.removeEventListener("load", correct);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", stop);
    };
  }, [deepLinkPage]);

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

  // Download PDF (artist, 2026-11-10): the prominent reader-facing export.
  // Always prints the standard file — part "complete", bleed off, exact
  // 8.5×11in pages — whatever the toolbar currently shows, then restores
  // the previous part/bleed selection once the print dialog closes.
  const handleDownloadPdf = async () => {
    if (!stageRef.current || preparing) return;
    const prevPart = part;
    const prevBleed = bleed;
    if (prevPart !== "complete" || prevBleed) {
      setPart("complete");
      setBleed(false);
      const restore = () => {
        setPart(prevPart);
        setBleed(prevBleed);
      };
      const timer = window.setTimeout(restore, 600_000);
      window.addEventListener(
        "afterprint",
        () => {
          window.clearTimeout(timer);
          restore();
        },
        { once: true }
      );
      // Wait for the standard layout (and its @page rule) to render.
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      );
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    await handleSave();
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
    <div className={`bk-root bk-paper-${paper}${isMobile ? " bk-mobile" : ""}${eyedropPick ? " bk-eyedropping" : ""}`} style={rootStyle}>
      {/* One @page size per export: interior/complete pages, or the wide cover wrap. */}
      <style>{`@page { size: ${sheetW}in ${pageH}in; margin: 0; }`}</style>

      {/* Pending-edits reminder (artist, 2026-11-09): while unsent edits
          exist, a bar sits at the very top of the editor so they are not
          forgotten before export. Pending = entries in the five edit
          stores that differ from the sent snapshot (same count as the
          toolbar's Unsent). Make PR clears the stores, so the bar
          disappears on its own; it never renders outside edit mode. */}
      {editMode && sentStats.total - sentStats.sent > 0 && (
        <div data-noprint className="bk-pending-bar">
          {lang === "zh"
            ? `有 pending 编辑，记得导出（${sentStats.total - sentStats.sent}）`
            : `You have pending edits — remember to export (${sentStats.total - sentStats.sent})`}
        </div>
      )}

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
                {sentStats.total > 0 && (
                  <span className="bk-sent-summary sans-label">
                    {lang === "zh" ? `已发送 ${sentStats.sent} · 未发送 ${sentStats.total - sentStats.sent}` : `Sent ${sentStats.sent} · Unsent ${sentStats.total - sentStats.sent}`}
                  </span>
                )}
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
            <div className="ml-auto flex flex-col items-end gap-1">
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={preparing}
                className="sans-label inline-flex items-center gap-2 text-xs tracking-widest px-4 py-2 bg-primary text-primary-foreground disabled:opacity-60"
              >
                <Download className="h-4 w-4" />
                {preparing ? b.preparing : b.downloadPdf}
              </button>
              <span className="max-w-[340px] text-[11px] normal-case tracking-normal leading-snug text-right text-foreground/60">
                In the dialog, choose “Save as PDF” — size, margins and backgrounds are already set. 在弹窗里选「另存为 PDF」即可，尺寸、边距和背景都已设好。
              </span>
            </div>
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

      {imgSel && editMode && (
        <ImgEditPanel
          src={imgSel}
          title={bookImages.find((im) => im.src === imgSel)?.title ?? ""}
          edit={imgEdits[imgSel]}
          sent={!!imgEdits[imgSel] && eqJSON(sentSnap.g?.[imgSel], imgEdits[imgSel])}
          onScale={(s) => {
            // The slider resizes around the picture's centre: shift the
            // offset by half the size change so the centre stays put.
            const g = imgGeom.get(imgSel);
            const cur = imgEdits[imgSel] ?? {};
            const prev = cur.scale && cur.scale > 0 ? cur.scale : 1;
            if (g && !cur.full) {
              setImgEdit(imgSel, { ...cur, scale: s, dx: (cur.dx ?? 0) + ((g.fx * (prev - s)) / 2) * 100, dy: (cur.dy ?? 0) + ((g.fy * (prev - s)) / 2) * 100 });
            } else {
              setImgEdit(imgSel, { ...cur, full: false, scale: s });
            }
          }}
          onFull={(on) => setImgEdit(imgSel, { ...(imgEdits[imgSel] ?? {}), full: on })}
          onReplace={(dataUrl) => setImgEdit(imgSel, { ...(imgEdits[imgSel] ?? {}), src: dataUrl })}
          onReset={() => setImgEdit(imgSel, null)}
          onClose={() => setImgSel(null)}
          lang={lang}
        />
      )}
      {bgPanel && bgPanelCurrent && (
        <BgImagePanel
          key={`${bgPanel.leftKey}|${bgPanel.rightKey}`}
          info={bgPanel}
          images={bookImages}
          current={bgPanelCurrent}
          onApply={applyBgImg}
          onClear={clearBgImg}
          onClose={() => setBgPanel(null)}
          lang={lang}
        />
      )}

      {eyedropPick && (
        <div data-noprint className="bk-editor-panel bk-eyedrop-hint">
          <div className="bk-editor-head">
            <span className="sans-label">{lang === "zh" ? "取色中" : "Picking a colour"}</span>
            <span className="bk-editor-hint">{lang === "zh" ? "点页面上任意一点取它的颜色，Esc 取消" : "Click anywhere on the page to sample its colour — Esc cancels"}</span>
          </div>
          <div className="bk-editor-actions">
            <button type="button" onClick={endEyedropPick}>
              {lang === "zh" ? "取消" : "Cancel"}
            </button>
          </div>
        </div>
      )}
      {eyedrop && (
        <EyedropPanel
          key={`${eyedrop.info.leftKey}|${eyedrop.info.rightKey}|${eyedrop.color}`}
          info={eyedrop.info}
          color={eyedrop.color}
          onApply={applyEyedrop}
          onPickAgain={() => {
            const info = eyedrop.info;
            setEyedrop(null);
            startEyedrop(info);
          }}
          onClose={() => setEyedrop(null)}
          lang={lang}
        />
      )}
      {eyedropPick && eyedropHover && (
        <div data-noprint className="bk-eyedrop-chip" style={{ left: eyedropHover.x + 14, top: eyedropHover.y + 14 }}>
          <span className="bk-eyedrop-swatch" style={{ background: eyedropHover.hex }} />
          <span>{eyedropHover.hex}</span>
        </div>
      )}

      <div
        ref={stageRef}
        className="bk-stage"
        style={{ zoom }}
        onClickCapture={eyedropPick ? onStagePickClick : undefined}
        onMouseMove={eyedropPick ? onStagePickMove : undefined}
      >
        {(isMobile ? sheets.map((s) => [s]) : toSpreads(sheets)).map((row, i) => (
          <div
            key={i}
            ref={isMobile ? (el) => { rowRefs.current[i] = el; } : undefined}
            data-sheet-index={isMobile ? i : undefined}
            className={`bk-spread ${row.length === 1 && row[0]?.side === "single" ? "bk-spread-single" : ""}`}
          >
            {row.map((sheet, j) =>
              sheet ? <div key={sheet.key} className="bk-sheet">{sheet.node}</div> : <div key={`gap-${j}`} className="bk-sheet bk-sheet-empty" data-noprint />,
            )}
          </div>
        ))}
      </div>

      {isMobile && sheets.length > 1 && (
        <div data-noprint className="bk-mobilenav">
          <button type="button" aria-label="Previous page" disabled={currentSheet <= 0} onClick={() => goToSheet(currentSheet - 1)}>
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="bk-mobilenav-mid">
            <span className="bk-mobilenav-label">{sheetLabel(sheets[currentSheet]?.key ?? "")}</span>
            <input
              type="range"
              aria-label="Jump to page"
              min={0}
              max={sheets.length - 1}
              value={currentSheet}
              onChange={(e) => goToSheet(Number(e.target.value), "auto")}
            />
          </div>
          <button type="button" aria-label="Next page" disabled={currentSheet >= sheets.length - 1} onClick={() => goToSheet(currentSheet + 1)}>
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CatalogBook;

