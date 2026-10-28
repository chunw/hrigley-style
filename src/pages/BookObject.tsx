import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "./catalog-book.css";
import "./book-object.css";
import { usePageMeta } from "@/hooks/usePageMeta";
import {
  BackCoverFace,
  FrontCoverFace,
  InteriorPageView,
  SpineFace,
  spineWidth,
  useBookModelReadOnly,
  type BookContext,
  type InteriorPage,
} from "./CatalogBook";
import { translations } from "@/lib/translations";

// ── The printed book, presented as an object ─────────────────────────────────
// This page shows Remains as the physical hardcover it will become: closed
// (cover, spine, page block) and open (real interior spreads). Nothing here
// re-draws the book - cover faces and interior pages are the very components
// of /catalogs/book, driven by the same book model (useBookModelReadOnly),
// so what a visitor sees is the book itself, not a mock-up of it.

const TRIM_W = 8.5;
const TRIM_H = 11;

type View = "front" | "spine" | "back";

const VIEW_ROTATION: Record<View, string> = {
  front: "rotateX(5deg) rotateY(26deg)",
  spine: "rotateX(4deg) rotateY(63deg)",
  back: "rotateX(5deg) rotateY(154deg)",
};

/** Fit `naturalPx` of layout into the viewport width (the book page's own
 *  zoom approach), capped at `cap`. */
function useFitZoom(naturalPx: number, cap: number) {
  const [zoom, setZoom] = useState(cap);
  useEffect(() => {
    const update = () => setZoom(Math.min(cap, (window.innerWidth - 32) / naturalPx));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [naturalPx, cap]);
  return zoom;
}

function ClosedBook({ ctx, spine, view }: { ctx: BookContext; spine: number; view: View }) {
  return (
    <div className="bk-root bo-bkvars bo-persp">
      <div
        className="bo-book"
        style={{ transform: VIEW_ROTATION[view], "--spine": `${spine}in` } as CSSProperties}
      >
        <div className="bo-half bo-front">
          <FrontCoverFace ctx={ctx} />
        </div>
        <div className="bo-half bo-back">
          <BackCoverFace />
        </div>
        <div className="bo-spine3d">
          <SpineFace ctx={ctx} width={spine} />
        </div>
        <div className="bo-fore" aria-hidden="true" />
        <div className="bo-top" aria-hidden="true" />
        <div className="bo-bottom" aria-hidden="true" />
      </div>
      <div className="bo-floor" aria-hidden="true" />
    </div>
  );
}

/** What a short description of a page is, for the spread caption. */
function pageLabel(p: InteriorPage): string {
  const s = p.spec;
  switch (s.kind) {
    case "title":
      return "Title page · 书名页";
    case "colophon":
      return "Colophon · 版权页";
    case "contents":
      return "Contents · 目录";
    case "preface":
      return "Preface · 前言";
    case "painting-intro":
      return "Painting · 绘画";
    case "about":
      return "About the Artist · 关于艺术家";
    case "collage":
      return "Collage as Method · 拼贴作为方法";
    case "opener":
    case "essay":
      return s.chapter.title;
    case "plate":
      return `${s.chapter.title}, ${s.item.title}`;
    case "exhibitions":
      return `${s.chapter.title} · 相关展览 Exhibitions`;
    case "aphorism":
      return "Aphorism · 警句";
    case "end":
      return "Last page · 末页";
    case "blank":
      return "Blank · 空白页";
  }
}

interface Spread {
  left: InteriorPage | null;
  right: InteriorPage | null;
}

/** The two pages an open book shows when opened at page `n`: a recto stands
 *  alone at the front (page 1, facing the inside front cover); every later
 *  opening is a verso on the left with the next recto on the right. */
function spreadFor(pages: InteriorPage[], n: number): Spread {
  const byNum = (x: number) => pages.find((p) => p.number === x) ?? null;
  if (n <= 1) return { left: null, right: byNum(1) };
  if (n % 2 === 0) return { left: byNum(n), right: byNum(n + 1) };
  return { left: byNum(n - 1), right: byNum(n) };
}

function Endsheet() {
  return <div className="bo-endsheet" aria-hidden="true" />;
}

const BookObject = () => {
  const b = translations.en.catalogBook;
  const { ctx, pages } = useBookModelReadOnly();
  const total = pages.length;
  const spine = spineWidth(total);

  usePageMeta({
    title: `${b.title}：The Printed Book · 实体书`,
    description: "Remains as a physical hardcover: the finished book from the outside, and open at any page.",
    path: "/catalogs/book/object",
    noindex: true,
  });

  const [view, setView] = useState<View>("front");
  const closedZoom = useFitZoom(940, 1);
  const openZoom = useFitZoom(1760, 0.78);

  // Default opening: the first chapter-opener spread - the book's own
  // designed two-page moment.
  const defaultAnchor = useMemo(
    () => pages.find((p) => p.spec.kind === "opener" && p.spec.half === "left")?.number ?? 3,
    [pages],
  );
  const [anchor, setAnchor] = useState<number | null>(null);
  const current = anchor ?? defaultAnchor;
  const spread = useMemo(() => spreadFor(pages, current), [pages, current]);

  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const goToPage = (e: FormEvent) => {
    e.preventDefault();
    const n = Number.parseInt(input.trim(), 10);
    if (!Number.isFinite(n) || n < 1 || n > total) {
      setError(`页码要在 1–${total} 之间 · Enter a page between 1 and ${total}`);
      return;
    }
    setError("");
    setAnchor(n);
  };
  const firstOfSpread = spread.left?.number ?? spread.right?.number ?? 1;
  const lastOfSpread = spread.right?.number ?? spread.left?.number ?? 1;
  const goPrev = () => {
    setError("");
    setAnchor(Math.max(1, firstOfSpread - 1));
  };
  const goNext = () => {
    setError("");
    setAnchor(lastOfSpread + 1);
  };

  const pageVars = {
    "--sheet-w": `${TRIM_W}in`,
    "--sheet-h": `${TRIM_H}in`,
    "--bleed": "0in",
    "--spine": `${spine}in`,
  } as CSSProperties;

  const viewBtn = (v: View, label: string) => (
    <button
      key={v}
      type="button"
      onClick={() => setView(v)}
      className={`bo-chip ${view === v ? "bo-chip-on" : ""}`}
    >
      {label}
    </button>
  );

  return (
    <div className="bo-root">
      <header className="bo-head">
        <Link to="/catalogs/book" className="bo-backlink sans-label">
          <ArrowLeft className="h-3.5 w-3.5" />
          {b.title} · 书页 The book
        </Link>
        <h1 className="bo-title">
          {b.title} <span className="bo-title-zh">遗迹</span>
        </h1>
        <p className="bo-sub">
          The printed book · 实体书预览，a hardcover that does not exist yet, shown at full size from the
          book&rsquo;s own pages and cover.
        </p>
        <p className="bo-specs sans-label">
          {TRIM_W} × {TRIM_H} in · {total} pages 页 · Spine 书脊 {spine.toFixed(3)} in · Hardcover 精装
        </p>
      </header>

      {/* ── 1 · The book from the outside ─────────────────────────────── */}
      <section className="bo-section">
        <h2 className="bo-h2">
          <span className="bo-h2-num">01</span> The book, closed · 合上的书
        </h2>
        <div className="bo-viewbar">
          {viewBtn("front", "Front cover · 封面")}
          {viewBtn("spine", "Spine · 书脊")}
          {viewBtn("back", "Back cover · 封底")}
        </div>
        <div className="bo-closed-zoom" style={{ zoom: closedZoom }}>
          <ClosedBook ctx={ctx} spine={spine} view={view} />
        </div>
        <p className="bo-caption">
          Case binding in the book&rsquo;s settled cover: rust-brown cloth colour field, the David still life at
          the centre, cream serif lettering on the four edges, no Chinese on the front. The spine carries the
          title bilingually, and the page block is {spine.toFixed(2)} in of printed paper.
          <span className="bo-caption-zh">
            封面用的是已经定版的设计：锈棕满底、中央大卫静物、四边奶油衬线字，正面无中文；书脊双语题名；书页侧能看到{" "}
            {total} 页纸的厚度。
          </span>
        </p>
      </section>

      {/* ── 2 · The book open, at any page ────────────────────────────── */}
      <section className="bo-section">
        <h2 className="bo-h2">
          <span className="bo-h2-num">02</span> The book, open · 打开的书
        </h2>

        <form className="bo-controls" onSubmit={goToPage}>
          <label className="bo-label sans-label" htmlFor="bo-page-input">
            Page 页码
          </label>
          <input
            id="bo-page-input"
            className="bo-input"
            type="number"
            min={1}
            max={total}
            placeholder={`1–${total}`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="bo-chip bo-chip-on">
            Open · 打开
          </button>
          <span className="bo-nav">
            <button type="button" className="bo-chip" onClick={goPrev} disabled={firstOfSpread <= 1}>
              ← Prev spread · 上一跨页
            </button>
            <button type="button" className="bo-chip" onClick={goNext} disabled={lastOfSpread >= total}>
              Next spread · 下一跨页
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </span>
        </form>
        {error && <p className="bo-error">{error}</p>}
        <p className="bo-spreadmeta sans-label">
          Pages 页 {spread.left ? spread.left.number : "，"} · {spread.right ? spread.right.number : "，"} of{" "}
          {total}
          {spread.left && <span>, {pageLabel(spread.left)}</span>}
          {spread.right && <span> · {pageLabel(spread.right)}</span>}
        </p>

        <div className="bo-open-zoom" style={{ zoom: openZoom }}>
          <div className="bo-open-persp">
            <div className="bo-open-tilt">
              <div className="bo-open-board" aria-hidden="true" />
              <div className="bk-root bk-paper-cream bo-bkvars bo-open-spread" style={pageVars}>
                <div className="bo-open-side">
                  {spread.left ? (
                    <InteriorPageView page={spread.left} ctx={ctx} pages={pages} />
                  ) : (
                    <Endsheet />
                  )}
                </div>
                <div className="bo-open-side">
                  {spread.right ? (
                    <InteriorPageView page={spread.right} ctx={ctx} pages={pages} />
                  ) : (
                    <Endsheet />
                  )}
                </div>
                <div className="bo-gutter" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>

        <p className="bo-caption">
          Every spread is rendered live from the book&rsquo;s own interior, the same pages, in the same order,
          as the print file. Type a page number above to open the book there.
          <span className="bo-caption-zh">每一个跨页都直接取自书的内页模型，与印刷文件同一套页面、同一个顺序。</span>
        </p>
      </section>

      <footer className="bo-foot">
        <Link to="/catalogs/book" className="bo-backlink sans-label">
          <ArrowLeft className="h-3.5 w-3.5" />
          Read the whole book · 回到书页
        </Link>
      </footer>
    </div>
  );
};

export default BookObject;
