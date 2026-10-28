import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, ArrowUpRight, BookOpen, ChevronLeft, ChevronRight,
  Minus, Plus, Printer, ShoppingBag,
} from "lucide-react";
import "./book-print.css";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageMeta } from "@/hooks/usePageMeta";
import { CONTACT_EMAIL, INSTAGRAM_URL, SHOP_URL, seriesIntro } from "@/lib/constants";
import { artistBioSegments } from "@/lib/artistBio";
import { catalogMeta as remainsMeta } from "@/lib/remains";
import { catalogMeta as spiritMeta } from "@/lib/21spirit";
import {
  BOOK, CONTENTS, allPlates, bookProduct, coverImages, honours,
  remainsPlates, residualsPlates, spiritPlates, spiritThemes, stillThingsPlates,
  type Plate,
} from "@/lib/bookData";

type Lang2 = "en" | "zh";
type Side = "recto" | "verso" | "single";
type Paper = "cream" | "white" | "dark";

const plain = (s?: string) => (s ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const pad2 = (n: number) => String(n).padStart(2, "0");

function Crosshair({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1" />
      <line x1="8" y1="0.5" x2="8" y2="3.5" stroke="currentColor" strokeWidth="1" />
      <line x1="8" y1="12.5" x2="8" y2="15.5" stroke="currentColor" strokeWidth="1" />
      <line x1="0.5" y1="8" x2="3.5" y2="8" stroke="currentColor" strokeWidth="1" />
      <line x1="12.5" y1="8" x2="15.5" y2="8" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function BImg({ src, alt = "", className = "", style }: { src: string; alt?: string; className?: string; style?: CSSProperties }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className={`book-img-fallback ${className}`} style={style}>{alt || "Image"}</div>;
  return <img src={src} alt={alt} className={className} style={style} onError={() => setFailed(true)} />;
}

function Guides({ n }: { n: number }) {
  return (
    <div className="book-guides" aria-hidden="true">
      <div className="g-trim" /><div className="g-safe" />
      <span className="g-label">p.{pad2(n)} · trim 6×6in · safe 0.35in</span>
      <span className="g-crop tl" /><span className="g-crop tr" /><span className="g-crop bl" /><span className="g-crop br" />
    </div>
  );
}

function Page({
  n, side, kind = "interior", runhead, folio = true, children,
}: {
  n: number; side: Side; kind?: "cover" | "interior"; runhead?: string; folio?: boolean; children: ReactNode;
}) {
  return (
    <section id={`book-p${n}`} className="book-page" data-side={side} data-kind={kind} aria-label={`Page ${n} of ${BOOK.totalPages}`}>
      {runhead && kind !== "cover" ? <div className="book-runhead">{runhead}</div> : null}
      {children}
      {folio && kind !== "cover" ? (
        <div className="book-folio"><span>{pad2(n)} / {BOOK.totalPages}</span><Crosshair /></div>
      ) : null}
      <Guides n={n} />
    </section>
  );
}

function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`book-eyebrow ${className}`}>{children}</p>;
}

function PlateCaption({ plate, lang, compact = false }: { plate: Plate; lang: Lang2; compact?: boolean }) {
  const zh = lang === "zh";
  return (
    <div className={compact ? "mt-[3%]" : "mt-[4%]"}>
      <div className="flex items-baseline gap-[3%]">
        <span className="book-eyebrow" style={{ color: "hsl(328 85% 62%)" }}>{plate.n}/</span>
        <h3 className="book-plate-title">{zh ? plate.titleZh : plate.titleEn}</h3>
      </div>
      <p className="book-caption mt-[1%]">
        {[plate.year, zh ? plate.mediumZh : plate.mediumEn, zh ? plate.detailZh : plate.detailEn].filter(Boolean).join(" · ")}
      </p>
      {!compact && <p className="book-caption" style={{ opacity: 0.75 }}>{zh ? plate.titleEn : plate.titleZh}</p>}
    </div>
  );
}

function PlateFigure({ plate, lang, tall = "62%", compact = false }: { plate: Plate; lang: Lang2; tall?: string; compact?: boolean }) {
  return (
    <figure className="flex min-h-0 flex-1 flex-col">
      <div className="relative w-full overflow-hidden" style={{ height: tall }}>
        <BImg src={plate.src} alt={`${plate.titleEn}, ${plate.year}`} className="h-full w-full object-contain" />
      </div>
      <PlateCaption plate={plate} lang={lang} compact={compact} />
    </figure>
  );
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function CoverImages({ left, right, leftAlt, rightAlt }: { left: string; right: string; leftAlt: string; rightAlt: string }) {
  const mask = "linear-gradient(to bottom, black 52%, transparent 100%)";
  return (
    <>
      <div className="absolute right-0 top-0 overflow-hidden" style={{ width: "38%", height: "44%", zIndex: 5, maskImage: mask, WebkitMaskImage: mask }}>
        <BImg src={right} alt={rightAlt} className="h-full w-full object-cover" />
      </div>
      <div className="absolute left-0 top-0 overflow-hidden" style={{ width: "41%", height: "54%", zIndex: 20, maskImage: mask, WebkitMaskImage: mask }}>
        <BImg src={left} alt={leftAlt} className="h-full w-full object-cover" />
      </div>
    </>
  );
}

function frontPages(lang: Lang2): ReactNode[] {
  const zh = lang === "zh";
  const rh = zh ? "王淳绘画集 2019–2026" : "Chun Wang Paintings 2019–2026";
  return [
    /* p.1 - Front cover (full-bleed, echoes the /catalogs tiles) */
    <Page key="p1" n={1} side="single" kind="cover" folio={false}>
      <div className="absolute inset-0 bg-black" />
      <CoverImages left={coverImages.frontLeft} right={coverImages.frontRight} leftAlt="Residuals #1, watercolor" rightAlt="Remains No. 1, mixed media" />
      <div className="book-safe" style={{ zIndex: 30 }}>
        <div className="flex items-start justify-between gap-4">
          <Eyebrow>{zh ? "王淳工作室" : "Chun Wang Studio"}</Eyebrow>
          <Eyebrow>{zh ? "绘画 · 水彩与综合媒材" : "Paintings · Watercolor & Mixed Media"}</Eyebrow>
        </div>
        <div className="mt-auto">
          <p className="book-eyebrow mb-[3%]" style={{ color: "hsl(328 85% 72%)" }}>{BOOK.dateRange}</p>
          <h1 className="shop-title gloria-title leading-none text-white" style={{ fontSize: "calc(var(--book-page-w) * 0.108)" }}>
            {zh ? <>王淳<br />绘画集</> : <>Chun Wang<br />Paintings</>}
          </h1>
          <div className="mt-[5%] flex items-end justify-between gap-4 border-t border-white/20 pt-[4%]">
            <p className="book-caption" style={{ color: "rgba(255,255,255,0.65)" }}>
              {zh ? "残留 · 静物 · 遗迹 · 21世纪精神" : "Residuals · Still Things · Remains · Spirit of the 21st Century"}
            </p>
            <span className="book-caption shrink-0 border border-white/70 px-2 py-1 uppercase tracking-widest" style={{ color: "#fff" }}>
              {zh ? "第一版" : "First edition"}
            </span>
          </div>
        </div>
      </div>
    </Page>,

    /* p.2 - Inside front cover */
    <Page key="p2" n={2} side="verso" folio={false}>
      <div className="book-safe">
        <Eyebrow>{zh ? "关于本书" : "About this book"}</Eyebrow>
        <h2 className="shop-title mt-[6%] leading-none" style={{ fontSize: "calc(var(--book-page-w) * 0.075)" }}>
          {zh ? "需要凝视的绘画" : "Paintings that ask you to look"}
        </h2>
        <p className="book-body-serif mt-[6%]">
          {zh
            ? "收录跨越七年的绘画作品，从水彩到综合媒材，涵盖四个系列：《残留》《静物》《遗迹》与《21世纪精神》。它们需要那种当代生活鲜少容许的凝视。"
            : "Collects paintings spanning seven years, from watercolour to mixed media, across four series: Residuals, Still Things, Remains, and In the Spirit of the 21st Century, demanding the kind of looking that contemporary life rarely permits."}
        </p>
        <div className="book-rule mt-auto pt-[5%]">
          <div className="grid grid-cols-2 gap-[6%]">
            {(zh
              ? [["I", "残留", "纸本水彩"], ["II", "静物", "纸本水彩"], ["III", "遗迹", "综合媒材"], ["IV", "21世纪精神", "综合媒材"]]
              : [["I", "Residuals", "Watercolor"], ["II", "Still Things", "Watercolor"], ["III", "Remains", "Mixed media"], ["IV", "21st Century", "Mixed media"]]
            ).map(([n, t, m]) => (
              <div key={n} className="border-t pt-[8%]" style={{ borderColor: "var(--book-rule)" }}>
                <p className="book-eyebrow">{zh ? `第${n}章` : `Chapter ${n}`}</p>
                <p className="book-plate-title mt-[2%]">{t}</p>
                <p className="book-caption">{m}</p>
              </div>
            ))}
          </div>
          <p className="book-caption mt-[7%]">{BOOK.trim} · {BOOK.extend} · {BOOK.binding}</p>
        </div>
      </div>
    </Page>,

    /* p.3 - Half-title */
    <Page key="p3" n={3} side="recto" folio={false}>
      <div className="book-safe items-start justify-center">
        <Eyebrow>{BOOK.dateRange}</Eyebrow>
        <h2 className="shop-title mt-[4%] leading-none" style={{ fontSize: "calc(var(--book-page-w) * 0.085)" }}>
          {zh ? "王淳绘画集" : "Chun Wang Paintings"}
        </h2>
        <p className="book-caption mt-[4%]">{zh ? "Chun Wang Paintings 2019–2026" : "王淳绘画集 2019–2026"}</p>
      </div>
    </Page>,

    /* p.4 - Frontispiece */
    <Page key="p4" n={4} side="verso" folio={false}>
      <div className="book-safe">
        <Eyebrow>{zh ? "卷首插图" : "Frontispiece"}</Eyebrow>
        <PlateFigure plate={residualsPlates[0]} lang={lang} tall="68%" />
        <p className="book-caption">
          {zh ? "曾在英国伦敦 Apsara Studio Gallery《Forms Before Dissolving》展览中展出。" : "Exhibited in Forms Before Dissolving, Apsara Studio Gallery, London."}
        </p>
      </div>
    </Page>,

    /* p.5 - Title page */
    <Page key="p5" n={5} side="recto" folio={false}>
      <div className="book-safe">
        <div className="flex items-start justify-between">
          <Eyebrow>{zh ? "王淳工作室" : "Chun Wang Studio"}</Eyebrow>
          <Eyebrow>{zh ? "纽约" : "New York"}</Eyebrow>
        </div>
        <div className="mt-auto">
          <p className="book-eyebrow mb-[4%]" style={{ color: "hsl(328 85% 62%)" }}>{BOOK.dateRange} · {zh ? BOOK.editionZh : BOOK.editionEn}</p>
          <h2 className="shop-title leading-none" style={{ fontSize: "calc(var(--book-page-w) * 0.108)" }}>
            {zh ? <>王淳<br />绘画集</> : <>Chun Wang<br />Paintings</>}
          </h2>
          <p className="book-body-serif mt-[6%] italic">
            {zh ? "残留 · 静物 · 遗迹 · 21世纪精神" : "Residuals · Still Things · Remains · In the Spirit of the 21st Century"}
          </p>
          <div className="book-rule mt-[8%] flex items-end justify-between pt-[4%]">
            <p className="book-caption">{zh ? "绘画与文字 · 王淳" : "Paintings & texts · Chun Wang"}</p>
            <p className="book-caption">chunwangshop.com</p>
          </div>
        </div>
      </div>
    </Page>,

    /* p.6 - Copyright / imprint */
    <Page key="p6" n={6} side="verso" folio={false}>
      <div className="book-safe">
        <Eyebrow>{zh ? "版权页" : "Imprint"}</Eyebrow>
        <div className="book-caption mt-[8%] space-y-[5%] text-left" style={{ color: "var(--book-ink)" }}>
          <p><strong>{zh ? "王淳绘画集 2019–2026" : "Chun Wang Paintings 2019–2026"}</strong><br />{zh ? BOOK.editionZh : BOOK.editionEn}</p>
          <p>{zh ? "© 2026 王淳。保留所有权利。未经书面许可，不得复制或传播本书任何部分，评论中简短引用除外。" : "© 2026 Chun Wang. All rights reserved. No part of this book may be reproduced or transmitted without written permission, except for brief quotations in reviews."}</p>
          <p>{zh ? "出版：王淳工作室，纽约。" : "Published by Chun Wang Studio, New York."}<br />{SHOP_URL.replace(/\/$/, "")} · {CONTACT_EMAIL}</p>
          <p>{BOOK.isbn} · {zh ? "平装" : "Softcover"}</p>
          <p>{BOOK.trim} · {BOOK.extend}<br />{BOOK.binding}</p>
          <p>{zh ? "作品图片由艺术家提供。目录与在线阅读版见 /book；完整作品目录见 /catalogs。" : "All artwork images courtesy of the artist. Read this edition online at /book; browse the complete catalogs at /catalogs."}</p>
        </div>
        <div className="book-rule mt-auto flex items-center justify-between pt-[4%]">
          <p className="book-caption">{zh ? "于纽约设计并发货，全球配送。" : "Designed & shipped from New York City. Ships worldwide."}</p>
          <Crosshair />
        </div>
      </div>
    </Page>,

    /* p.7 - Contents */
    <Page key="p7" n={7} side="recto" runhead={rh}>
      <div className="book-safe">
        <Eyebrow>{zh ? "目录" : "Contents"}</Eyebrow>
        <h2 className="shop-title mt-[4%] leading-none" style={{ fontSize: "calc(var(--book-page-w) * 0.09)" }}>{zh ? "目录" : "Contents"}</h2>
        <nav className="mt-[7%] space-y-[3.8%]" aria-label="Book contents">
          {CONTENTS.map((row) => (
            <button key={row.id} type="button" data-noprint-jump onClick={() => scrollToId(row.id)} className="book-toc-row group">
              <span className="book-eyebrow w-[9%] shrink-0">{row.n}</span>
              <span className="book-plate-title group-hover:text-[hsl(328_85%_62%)]">{zh ? row.zh : row.en}</span>
              <span className="book-toc-leader" /><span className="book-caption shrink-0">{pad2(row.page)}</span>
            </button>
          ))}
        </nav>
        <p className="book-caption mt-auto">{zh ? "图版 01–24 · 完整清单见第 35 页。" : "Plates 01–24 · Full checklist on page 35."}</p>
      </div>
    </Page>,

    /* p.8 - Foreword */
    <Page key="p8" n={8} side="verso" runhead={rh}>
      <div className="book-safe">
        <Eyebrow>{zh ? "序言" : "Foreword"}</Eyebrow>
        <h2 className="shop-title mt-[4%] leading-none" style={{ fontSize: "calc(var(--book-page-w) * 0.072)" }}>{zh ? "凝视之道" : "The kind of looking"}</h2>
        <blockquote className="book-body-serif mt-[7%] italic" style={{ fontSize: "calc(var(--book-page-w) * 0.034)" }}>
          {zh ? "“水彩依然是对物质性的追寻，尤其是在当下。”" : "“Watercolor remains a pursuit of materiality，especially now.”"}
        </blockquote>
        <div className="book-body-serif mt-[6%] space-y-[5%]">
          <p>{zh ? "这本书请您慢下来。水彩拒绝匆忙：水把颜料带到手没有安排的地方，纸面记住每一次迟疑。综合媒材同样留下了制作的痕迹，层层叠加、修改与保留，都在表面可读。" : "This book asks for slowness. Watercolour refuses haste: water carries pigment where the hand did not plan, and the paper remembers every hesitation. The mixed-media works keep their making visible too，layered, revised, and left legible on the surface."}</p>
          <p>{zh ? "七年间，四个系列以不同方式回到同一件事：日常生活在被使用之后、消失之前，还留下了什么。请把图版当作原作来观看，先看整体，再看边缘，最后才读说明。" : "Across seven years, four series return in different ways to one question: what does everyday life leave behind, just after it has been used and just before it disappears? Treat each plate as an original，look first at the whole, then at the edges, and only then at the caption."}</p>
        </div>
        <p className="book-eyebrow mt-auto">， {zh ? "王淳，纽约" : "Chun Wang, New York"}</p>
      </div>
    </Page>,

    /* p.9 - Introduction */
    <Page key="p9" n={9} side="recto" runhead={rh}>
      <div className="book-safe">
        <Eyebrow>{zh ? "导言" : "Introduction"}</Eyebrow>
        <h2 className="shop-title mt-[4%] leading-none" style={{ fontSize: "calc(var(--book-page-w) * 0.072)" }}>{zh ? "七年，四组系列" : "Seven years, four series"}</h2>
        <div className="book-body-serif mt-[7%] space-y-[5%]">
          <p>{plain(seriesIntro[lang].split("\n\n")[0])}</p>
          <p>{zh ? "在纸上，《残留》与《静物》先行：它们是安静的练习，看残留的痕迹与静置的物件。随后，《遗迹》与《21世纪精神》把视线转向社会本身，前者以冷面荒诞，后者以研究为据，完成同一个诊断。" : "On the page, Residuals and Still Things come first: quiet studies of what remains and of objects at rest. Remains and In the Spirit of the 21st Century then turn the same attention outward to society itself，one through deadpan absurdity, the other through research."}</p>
        </div>
        <div className="book-rule mt-auto grid grid-cols-4 gap-[4%] pt-[4%] text-center">
          {["I", "II", "III", "IV"].map((n) => <span key={n} className="book-eyebrow">{n}</span>)}
        </div>
      </div>
    </Page>,

    /* p.10 - How to read / reproductions */
    <Page key="p10" n={10} side="verso" runhead={rh}>
      <div className="book-safe">
        <Eyebrow>{zh ? "阅读说明" : "A note on this edition"}</Eyebrow>
        <h2 className="book-plate-title mt-[5%]" style={{ fontSize: "calc(var(--book-page-w) * 0.045)" }}>{zh ? "如何读这本书" : "How to read this book"}</h2>
        <div className="mt-[7%] space-y-[6%]">
          {(zh
            ? [["01", "先看图版", "每章以一页文字开场，随后图版连续展开。图注给出题名、年代、媒材与尺寸；完整的展览与收藏信息见作品清单。"], ["02", "注意边缘", "水彩保留了纸边与未完成感，综合媒材保留了拼贴的接缝。复制版尽量保留这些边缘，不裁切为整齐的矩形。"], ["03", "中英并置", "正文以所选语言为主，另一语言的题名以小字并置，便于两地读者互相参照。"]]
            : [["01", "Plates first", "Each chapter opens with a short text, then lets the plates run uninterrupted. Captions give title, year, medium, and size; the checklist holds the full record."], ["02", "Mind the edges", "Watercolours keep their paper edges and unfinished passages; mixed-media works keep their seams. Reproductions preserve those edges rather than cropping to tidy rectangles."], ["03", "Two languages", "Body text follows your chosen language, with titles in the other language set small alongside, so readers in either language can cross-check."]]
          ).map(([n, t, d]) => (
            <div key={n} className="flex gap-[5%]">
              <span className="book-eyebrow shrink-0 pt-1" style={{ color: "hsl(328 85% 62%)" }}>{n}/</span>
              <div><p className="book-plate-title">{t}</p><p className="book-body-serif mt-[1%]">{d}</p></div>
            </div>
          ))}
        </div>
        <p className="book-caption mt-auto">{zh ? "色彩说明：屏幕与纸面色彩会有细微差别；印刷版以哑光纸的实际呈色为准。" : "A note on colour: screen and matte paper differ slightly; the printed edition is colour-managed for matte stock."}</p>
      </div>
    </Page>,
  ];
}

function ChapterDivider({
  n, roman, lang, titleEn, titleZh, subEn, subZh, left, right, plateRange,
}: {
  n: number; roman: string; lang: Lang2; titleEn: string; titleZh: string; subEn: string; subZh: string; left: string; right: string; plateRange: string;
}) {
  const zh = lang === "zh";
  return (
    <Page n={n} side="recto" kind="cover" folio={false}>
      <div className="absolute inset-0 bg-black" />
      <CoverImages left={left} right={right} leftAlt={titleEn} rightAlt={titleEn} />
      <div className="book-safe" style={{ zIndex: 30 }}>
        <div className="flex items-start justify-between">
          <Eyebrow>{zh ? `第${roman}章` : `Chapter ${roman}`}</Eyebrow>
          <Eyebrow>{zh ? "图版" : "Plates"} {plateRange}</Eyebrow>
        </div>
        <div className="mt-auto">
          <span className="book-caption inline-block border border-white/80 px-2 py-1" style={{ color: "#fff" }}>{roman}</span>
          <h2 className="shop-title gloria-title mt-[4%] leading-none text-white" style={{ fontSize: "calc(var(--book-page-w) * 0.082)" }}>
            {zh ? titleZh : titleEn}
          </h2>
          <p className="book-caption mt-[3%]" style={{ color: "rgba(255,255,255,0.6)" }}>{zh ? `${titleEn} · ${subZh}` : `${titleZh} · ${subEn}`}</p>
          <div className="mt-[5%] border-t border-white/20 pt-[3%]">
            <p className="book-eyebrow">{zh ? subZh : subEn}</p>
          </div>
        </div>
      </div>
    </Page>
  );
}

function TwoUpPage({ n, side, runhead, a, b, lang }: { n: number; side: Side; runhead: string; a: Plate; b: Plate; lang: Lang2 }) {
  return (
    <Page n={n} side={side} runhead={runhead}>
      <div className="book-safe" style={{ gap: "4%" }}>
        <PlateFigure plate={a} lang={lang} tall="74%" compact />
        <div className="book-rule" />
        <PlateFigure plate={b} lang={lang} tall="74%" compact />
      </div>
    </Page>
  );
}

function FullPlatePage({ n, side, runhead, plate, lang, noteEn, noteZh }: { n: number; side: Side; runhead: string; plate: Plate; lang: Lang2; noteEn?: string; noteZh?: string }) {
  const zh = lang === "zh";
  const note = zh ? noteZh : noteEn;
  return (
    <Page n={n} side={side} runhead={runhead}>
      <div className="book-safe">
        <PlateFigure plate={plate} lang={lang} tall="70%" />
        {note ? <p className="book-body-serif mt-[2%] italic">{note}</p> : null}
      </div>
    </Page>
  );
}

function EssayPage({
  n, side, runhead, eyebrow, title, children, footer,
}: {
  n: number; side: Side; runhead: string; eyebrow: string; title: string; children: ReactNode; footer?: ReactNode;
}) {
  return (
    <Page n={n} side={side} runhead={runhead}>
      <div className="book-safe">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="book-plate-title mt-[4%]" style={{ fontSize: "calc(var(--book-page-w) * 0.048)" }}>{title}</h2>
        <div className="book-body-serif mt-[6%] space-y-[5%]">{children}</div>
        {footer ? <div className="mt-auto">{footer}</div> : null}
      </div>
    </Page>
  );
}

function chapterPages(lang: Lang2): ReactNode[] {
  const zh = lang === "zh";
  const rhI = zh ? "I · 残留" : "I · Residuals";
  const rhII = zh ? "II · 静物" : "II · Still Things";
  const rhIII = zh ? "III · 遗迹" : "III · Remains";
  const rhIV = zh ? "IV · 21世纪精神" : "IV · In the Spirit of the 21st Century";
  const R = residualsPlates, S = stillThingsPlates, M = remainsPlates, P = spiritPlates;
  return [
    /* I - Residuals (11–16) */
    <ChapterDivider key="p11" n={11} roman="I" lang={lang} titleEn="Residuals" titleZh="残留" subEn="Watercolor on paper" subZh="纸本水彩" left={R[1].src} right={R[2].src} plateRange="01–07" />,
    <EssayPage key="p12" n={12} side="verso" runhead={rhI} eyebrow={zh ? "第一章 · 残留" : "Chapter I · Residuals"} title={zh ? "被使用之后" : "Just after use"}
      footer={<p className="book-caption border-t pt-[4%]" style={{ borderColor: "var(--book-rule)" }}>{zh ? "图版 01（卷首）–07 · 纸本水彩" : "Plates 01 (frontispiece)–07 · Watercolor on paper"}</p>}>
      <p>{zh ? "《残留》捕捉日常在被用过之后、消失之前的样子：痕迹、余渍与未干的边缘。水彩的不可逆性正合题意，一旦落笔，纸就记住了。" : "Residuals catches the everyday just after it has been used, just before it disappears: traces, stains, and edges not yet dry. Watercolour's irreversibility suits the subject，once a mark lands, the paper remembers."}</p>
      <p>{zh ? "这些作品以 9×12 英寸档案哑光艺术纸印制版画与装裱原作形式发售，收于《王淳艺术礼盒 02》。阅读时请留意白色：那不是空白，而是被留下的光。" : "Works from this series are issued as 9×12 in archival matte fine-art prints and framed originals, gathered in Chun Wang Artbox 02. As you read, watch the whites: they are not empty，they are light, left behind."}</p>
    </EssayPage>,
    <FullPlatePage key="p13" n={13} side="recto" runhead={rhI} plate={R[1]} lang={lang} />,
    <TwoUpPage key="p14" n={14} side="verso" runhead={rhI} a={R[2]} b={R[3]} lang={lang} />,
    <TwoUpPage key="p15" n={15} side="recto" runhead={rhI} a={R[4]} b={R[5]} lang={lang} />,
    <FullPlatePage key="p16" n={16} side="verso" runhead={rhI} plate={R[6]} lang={lang}
      noteEn="End of Chapter I. The everyday, used，and still present." noteZh="第一章终。日常被用过，却仍在场。" />,

    /* II - Still Things (17–22) */
    <ChapterDivider key="p17" n={17} roman="II" lang={lang} titleEn="Still Things" titleZh="静物" subEn="Watercolor on paper" subZh="纸本水彩" left={S[0].src} right={S[1].src} plateRange="08–14" />,
    <EssayPage key="p18" n={18} side="verso" runhead={rhII} eyebrow={zh ? "第二章 · 静物" : "Chapter II · Still Things"} title={zh ? "静置之物" : "Objects at rest"}
      footer={<p className="book-caption border-t pt-[4%]" style={{ borderColor: "var(--book-rule)" }}>{zh ? "图版 08–14 · 纸本水彩" : "Plates 08–14 · Watercolor on paper"}</p>}>
      <p>{zh ? "若《残留》看的是痕迹，《静物》看的是物本身在无人打扰时的状态。杯、器与日常小物不表演，只是在场，水彩以薄涂与留白让它们获得呼吸的空间。" : "Where Residuals looks at traces, Still Things looks at things themselves, undisturbed. Cups, vessels, and small daily objects do not perform; they are simply present，thin washes and reserved whites give them room to breathe."}</p>
      <p>{zh ? "静物画是最古老的耐心练习。在屏幕以秒计时的年代，把一页留给一件静物，本身就是一种主张。" : "Still life is the oldest exercise in patience. In an age timed in seconds, giving a full page to a single quiet object is itself a position."}</p>
    </EssayPage>,
    <TwoUpPage key="p19" n={19} side="recto" runhead={rhII} a={S[0]} b={S[1]} lang={lang} />,
    <TwoUpPage key="p20" n={20} side="verso" runhead={rhII} a={S[2]} b={S[3]} lang={lang} />,
    <TwoUpPage key="p21" n={21} side="recto" runhead={rhII} a={S[4]} b={S[5]} lang={lang} />,
    <FullPlatePage key="p22" n={22} side="verso" runhead={rhII} plate={S[6]} lang={lang}
      noteEn="End of Chapter II. Still things, made permanent." noteZh="第二章终。静物，由此留存。" />,

    /* III - Remains (23–28) */
    <ChapterDivider key="p23" n={23} roman="III" lang={lang} titleEn="Remains" titleZh="遗迹" subEn="Mixed media · LICC Official Selection 2024" subZh="综合媒材 · 2024 LICC 官方入选" left={M[0].src} right={M[1].src} plateRange="15–20" />,
    <EssayPage key="p24" n={24} side="verso" runhead={rhIII} eyebrow={zh ? "第三章 · 遗迹" : "Chapter III · Remains"} title={zh ? "办公室里的陶俑" : "Terracotta figures in the office"}
      footer={<p className="book-caption border-t pt-[4%]" style={{ borderColor: "var(--book-rule)" }}>{zh ? "2024年伦敦国际创意大赛（LICC）官方入选 · 艺术创作类" : "2024 London International Creative Competition (LICC) Official Selection · Create/Art"}</p>}>
      <p>{plain(zh ? remainsMeta.descriptionZh : remainsMeta.description)}</p>
      <p>{zh ? "这种隐喻双向延伸：从足够远的距离望去，企业日常生活与其他所有文明的日常生活并无二致；而当过去被拉近，它便显得超现实。" : "The implication runs in both directions: from a sufficient distance, corporate daily life looks very much like every other civilization's daily life; and the past, brought close, looks surreal."}</p>
    </EssayPage>,
    <TwoUpPage key="p25" n={25} side="recto" runhead={rhIII} a={M[0]} b={M[1]} lang={lang} />,
    <TwoUpPage key="p26" n={26} side="verso" runhead={rhIII} a={M[2]} b={M[3]} lang={lang} />,
    <TwoUpPage key="p27" n={27} side="recto" runhead={rhIII} a={M[4]} b={M[5]} lang={lang} />,
    <Page key="p28" n={28} side="verso" runhead={rhIII}>
      <div className="book-safe">
        <Eyebrow>{zh ? "从绘画到物件" : "From painting to object"}</Eyebrow>
        <h2 className="book-plate-title mt-[4%]" style={{ fontSize: "calc(var(--book-page-w) * 0.045)" }}>{zh ? "《遗迹》走入日常" : "Remains in daily life"}</h2>
        <p className="book-body-serif mt-[5%]">{zh ? "《遗迹》的人俑离开了画布，登上托特包、T恤、贴纸与浴室地垫，企业超现实主义，陪你通勤。绘画批评日常，物件则把这批评带回日常之中。" : "The Remains figures leave the canvas for tote bags, tees, stickers, and bath mats：corporate surrealism for the daily commute. The paintings critique daily life; the objects carry that critique back into it."}</p>
        <div className="book-rule mt-auto pt-[5%]">
          <p className="book-eyebrow mb-[3%]">{zh ? "同系列物件" : "Also in this series"}</p>
          {(zh ? ["《遗迹》托特包", "《遗迹》中性宽松T恤", "《遗迹》贴纸套装", "“每次冲水都是新的开始”浴室地垫"] : ["Remains Tote Bag", "The Meeting Has Begun Tee", "Remains Sticker Packet", "Every Flush Is a New Beginning Bath Mat"]).map((t) => (
            <div key={t} className="flex items-baseline gap-2 border-t py-[2.5%]" style={{ borderColor: "var(--book-rule)" }}>
              <span className="book-caption" style={{ color: "var(--book-ink)" }}>{t}</span>
              <span className="book-toc-leader" /><span className="book-caption">chunwangshop.com</span>
            </div>
          ))}
        </div>
      </div>
    </Page>,

    /* IV - In the Spirit of the 21st Century (29–34) */
    <ChapterDivider key="p29" n={29} roman="IV" lang={lang} titleEn="In the Spirit of the 21st Century" titleZh="21世纪精神" subEn="Mixed media · LICC Finalist 2021" subZh="综合媒材 · 2021 LICC 决赛入围" left={P[0].src} right={P[1].src} plateRange="21–24" />,
    <EssayPage key="p30" n={30} side="verso" runhead={rhIV} eyebrow={zh ? "第四章 · 21世纪精神" : "Chapter IV · In the Spirit of the 21st Century"} title={zh ? "让看不见的被看见" : "Making the invisible visible"}
      footer={
        <div className="border-t pt-[4%]" style={{ borderColor: "var(--book-rule)" }}>
          <p className="book-eyebrow mb-[2%]">{zh ? "研究主题" : "Research themes"}</p>
          <p className="book-caption">{spiritThemes[lang].join(" · ")}</p>
        </div>}>
      <p>{plain(zh ? spiritMeta.descriptionZh : spiritMeta.description).slice(0, 520)}{"…"}</p>
      <p>{zh ? "每件作品都建立在一项学术或新闻研究之上。图版之后的文字保持简短，论点已在画面里，页面请留给观看。" : "Each painting is built on a piece of academic or journalistic research. The texts that follow stay short，the argument is already in the image, and the page is left for looking."}</p>
    </EssayPage>,
    <FullPlatePage key="p31" n={31} side="recto" runhead={rhIV} plate={P[0]} lang={lang}
      noteEn="Alone together: digital life's central paradox，constant contact, fundamental solitude." noteZh="孤独在一起：数字生活的核心悖论，时刻相连，根本孤独。" />,
    <FullPlatePage key="p32" n={32} side="verso" runhead={rhIV} plate={P[1]} lang={lang}
      noteEn="Climate collapse, drawn as a negotiation that power keeps winning，for now." noteZh="气候崩溃，被画成一场权力暂时仍在赢得谈判。" />,
    <FullPlatePage key="p33" n={33} side="recto" runhead={rhIV} plate={P[2]} lang={lang}
      noteEn="A portrait assembled the way platforms assemble us: from data, in profile, without asking." noteZh="一幅以平台拼凑我们的方式拼成的画像：来自数据、呈侧面、无需征询。" />,
    <FullPlatePage key="p34" n={34} side="verso" runhead={rhIV} plate={P[3]} lang={lang}
      noteEn="Captured，attention as the century's scarce resource, and its most traded one. End of Chapter IV." noteZh="被俘，注意力是本世纪最稀缺、也最被交易的资源。第四章终。" />,
  ];
}

function backPages(lang: Lang2): ReactNode[] {
  const zh = lang === "zh";
  const rh = zh ? "王淳绘画集 2019–2026" : "Chun Wang Paintings 2019–2026";
  const bio = artistBioSegments[lang];
  const bioText = plain(`${bio.intro}Negotiated Intelligence${bio.mid}IMMEMORY: On COVID-19${bio.outro}`);
  const specs: [string, string][] = zh
    ? [["成品尺寸", "6 × 6 英寸（152 × 152 毫米），方形"], ["出血", "四边各 0.125 英寸；含出血文件 6.25 × 6.25 英寸"], ["安全区", "文字距裁切边 ≥ 0.35 英寸；订口侧 ≥ 0.5 英寸"], ["页数", "40 页全彩（4 的倍数，适合骑马订/平装胶订）"], ["装订", "平装，封面覆哑膜软触感；书脊过窄不印字"], ["内页纸张", "建议哑光铜版纸，以还原水彩的哑光质感（请与印厂确认克重）"], ["色彩", "本页导出为 RGB；送印胶印前请转 CMYK 并打样校色"], ["字体", "标题：Gloria Hallelujah / 朱雀仿宋；正文：Cormorant Garamond；标注：Aileron"]]
    : [["Trim", "6 × 6 in (152 × 152 mm), square"], ["Bleed", "0.125 in on all sides; file with bleed 6.25 × 6.25 in"], ["Safe zone", "Live text ≥ 0.35 in from trim; ≥ 0.5 in at the gutter"], ["Extent", "40 pages, full colour (multiple of 4 for saddle-stitch / perfect binding)"], ["Binding", "Softcover, soft-touch matte laminate; spine too narrow for spine text"], ["Text stock", "Matte coated stock recommended to match the watercolours (confirm weight with your printer)"], ["Colour", "This page exports RGB; convert to CMYK and proof before offset printing"], ["Fonts", "Titles: Gloria Hallelujah / Zhuque Fangsong · Text: Cormorant Garamond · Labels: Aileron"]];
  return [
    /* p.35 - Checklist */
    <Page key="p35" n={35} side="recto" runhead={rh}>
      <div className="book-safe">
        <Eyebrow>{zh ? "作品清单" : "Checklist of works"}</Eyebrow>
        <h2 className="shop-title mt-[2%] leading-none" style={{ fontSize: "calc(var(--book-page-w) * 0.055)" }}>{zh ? "作品清单" : "Checklist"}</h2>
        <div className="mt-[4%] grid flex-1 grid-cols-2 gap-x-[7%]">
          {[allPlates.slice(0, 12), allPlates.slice(12)].map((col, ci) => (
            <div key={ci}>
              {col.map((p) => (
                <button key={p.n} type="button" onClick={() => scrollToId(`book-p${p.page}`)} className="book-toc-row border-t py-[2%]" style={{ borderColor: "var(--book-rule)" }}>
                  <span className="book-eyebrow shrink-0">{p.n}</span>
                  <span className="min-w-0 text-left leading-snug" style={{ fontFamily: "'Zhuque Fangsong (technical preview)', serif", fontSize: "calc(var(--book-page-w) * 0.019)" }}>
                    {zh ? p.titleZh : p.titleEn}
                    <span className="book-caption"> · {p.year}</span>
                  </span>
                  <span className="book-toc-leader" /><span className="book-caption shrink-0">{pad2(p.page)}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
        <p className="book-caption">{zh ? "尺寸从略处见在线目录对应条目。点按条目可跳至该图版。" : "Where dimensions are abbreviated, see the matching entry in the online catalogs. Select an entry to jump to its plate."}</p>
      </div>
    </Page>,

    /* p.36 - About the artist */
    <Page key="p36" n={36} side="verso" runhead={rh}>
      <div className="book-safe">
        <Eyebrow>{zh ? "关于艺术家" : "About the artist"}</Eyebrow>
        <h2 className="shop-title mt-[4%] leading-none" style={{ fontSize: "calc(var(--book-page-w) * 0.075)" }}>{zh ? "王淳" : "Chun Wang"}</h2>
        <p className="book-caption mt-[2%]">{zh ? "Chun Wang · 纽约" : "王淳 · New York City"}</p>
        <p className="book-body-serif mt-[6%]">{bioText.slice(0, zh ? 420 : 640)}{bioText.length > 640 ? "…" : ""}</p>
        <div className="book-rule mt-auto pt-[4%]">
          <p className="book-eyebrow">{zh ? "联系" : "Contact"}</p>
          <p className="book-caption mt-[2%]" style={{ color: "var(--book-ink)" }}>{CONTACT_EMAIL} · chunwang.art · chunwangshop.com</p>
        </div>
      </div>
    </Page>,

    /* p.37 - Recognition & acknowledgements */
    <Page key="p37" n={37} side="recto" runhead={rh}>
      <div className="book-safe">
        <Eyebrow>{zh ? "荣誉与致谢" : "Recognition & acknowledgements"}</Eyebrow>
        <h2 className="book-plate-title mt-[4%]" style={{ fontSize: "calc(var(--book-page-w) * 0.045)" }}>{zh ? "展览与荣誉（节选）" : "Selected recognition"}</h2>
        <div className="mt-[5%] space-y-[3.5%]">
          {honours[lang].map((h, i) => (
            <div key={i} className="flex gap-[4%] border-t pt-[3%]" style={{ borderColor: "var(--book-rule)" }}>
              <span className="book-eyebrow shrink-0 pt-1">{pad2(i + 1)}/</span>
              <p className="book-body-serif" style={{ fontSize: "calc(var(--book-page-w) * 0.0225)", lineHeight: 1.5 }}>{h}</p>
            </div>
          ))}
        </div>
        <p className="book-body-serif mt-auto italic">{zh ? "致谢：感谢每一位愿意慢下来观看的人，这本书是为你们印的。" : "With thanks to everyone willing to slow down and look：this book was printed for you."}</p>
      </div>
    </Page>,

    /* p.38 - Colophon & production notes */
    <Page key="p38" n={38} side="verso" runhead={rh}>
      <div className="book-safe">
        <Eyebrow>{zh ? "版记与制作说明" : "Colophon & production notes"}</Eyebrow>
        <h2 className="book-plate-title mt-[4%]" style={{ fontSize: "calc(var(--book-page-w) * 0.045)" }}>{zh ? "印制规格" : "Production specification"}</h2>
        <div className="mt-[5%] flex-1">
          {specs.map(([k, v]) => (
            <div key={k} className="flex gap-[4%] border-t py-[2.6%]" style={{ borderColor: "var(--book-rule)" }}>
              <span className="book-eyebrow w-[22%] shrink-0 pt-[1%]">{k}</span>
              <span className="book-caption" style={{ color: "var(--book-ink)" }}>{v}</span>
            </div>
          ))}
        </div>
        <p className="book-caption">{zh ? "设计系统与 chunwangshop.com/catalogs 一致：黑色满版封面、Gloria/仿宋大标题压图、奶油色内页、粉色点缀（hsl 328 85% 72%）、直角与细分割线。" : "Design system matches chunwangshop.com/catalogs: black full-bleed covers, Gloria/Fangsong titles over layered images, cream interiors, pink accent (hsl 328 85% 72%), square corners, and hairline rules."}</p>
      </div>
    </Page>,

    /* p.39 - Inside back cover */
    <Page key="p39" n={39} side="recto" folio={false}>
      <div className="book-safe">
        <Eyebrow>{zh ? "继续观看" : "Continue looking"}</Eyebrow>
        <h2 className="shop-title mt-[4%] leading-none" style={{ fontSize: "calc(var(--book-page-w) * 0.06)" }}>{zh ? "别停在这里" : "Don't stop here"}</h2>
        <div className="mt-[5%] space-y-0">
          {([
            [zh ? "水彩视界" : "Visions in Watercolor", "/watercolor-catalog"],
            [zh ? "遗迹" : "Remains", "/remains-catalog"],
            [zh ? "21世纪精神" : "In the Spirit of the 21st Century", "/21spirit-catalog"],
            [zh ? "内在荒原（摄影）" : "Inner Wilderness (Photography)", "/photography-catalog"],
            [zh ? "摄影画册（在线阅读）" : "Photography Photobook (read online)", "/photography-photobook"],
            [zh ? "小有用的物件" : "Slightly Useful Object", "/slightlyusefulobject"],
          ] as [string, string][]).map(([label, href]) => (
            <Link key={href} to={href} className="group flex items-center gap-2 border-t py-[2.1%]" style={{ borderColor: "var(--book-rule)" }}>
              <span className="book-plate-title group-hover:text-[hsl(328_85%_62%)]" style={{ fontSize: "calc(var(--book-page-w) * 0.026)" }}>{label}</span>
              <span className="book-toc-leader" />
              <span className="book-caption shrink-0">{href}</span>
              <ArrowUpRight className="h-3 w-3 shrink-0 opacity-50" />
            </Link>
          ))}
        </div>
        <div className="mt-auto border p-[4%]" style={{ borderColor: "var(--book-ink)" }}>
          <p className="book-eyebrow">{zh ? "购买印刷版" : "Buy the printed book"}</p>
          <p className="book-body-serif mt-[2%]">{zh ? "《王淳绘画集 2019–2026》· 全彩 40 页 · 6×6 英寸 · 覆哑膜软触感平装 · US $40" : "Chun Wang Paintings 2019–2026 · Full colour, 40 pages · 6 × 6 in · Soft-touch matte softcover · US $40"}</p>
          <p className="book-caption mt-[2%]">chunwangshop.com/product/book-paintings-2019-2026</p>
        </div>
      </div>
    </Page>,

    /* p.40 - Back cover */
    <Page key="p40" n={40} side="single" kind="cover" folio={false}>
      <div className="absolute inset-0 bg-black" />
      <CoverImages left={coverImages.backLeft} right={coverImages.backRight} leftAlt="Residuals #2, watercolor" rightAlt="Alone Together, mixed media" />
      <div className="book-safe" style={{ zIndex: 30 }}>
        <div className="flex items-start justify-between">
          <Eyebrow>{zh ? "王淳工作室商店" : "Chun Wang Studio Shop"}</Eyebrow>
          <Eyebrow>{BOOK.dateRange}</Eyebrow>
        </div>
        <div className="mt-auto">
          <p className="italic leading-snug text-white/90" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "calc(var(--book-page-w) * 0.037)" }}>
            {zh ? "“它们需要那种当代生活鲜少容许的凝视。”" : "“Demanding the kind of looking that contemporary life rarely permits.”"}
          </p>
          <p className="book-caption mt-[4%]" style={{ color: "rgba(255,255,255,0.65)" }}>
            {zh ? "七年绘画，四个系列：残留 · 静物 · 遗迹 · 21世纪精神。《遗迹》2024 LICC 官方入选；《21世纪精神》2021 LICC 决赛入围。" : "Seven years of painting in four series: Residuals · Still Things · Remains · In the Spirit of the 21st Century. Remains，LICC Official Selection 2024. Spirit，LICC Finalist 2021."}
          </p>
          <div className="mt-[6%] flex items-end justify-between gap-4 border-t border-white/20 pt-[4%]">
            <div>
              <p className="book-caption" style={{ color: "#fff" }}>chunwangshop.com/book</p>
              <p className="book-caption" style={{ color: "rgba(255,255,255,0.55)" }}>{zh ? "于纽约设计并发货 · 全球配送" : "Designed & shipped from NYC · Ships worldwide"} · US $40</p>
            </div>
            <div className="shrink-0 bg-white px-2 py-1.5 text-right">
              <div className="flex h-5 items-stretch gap-[1.5px]" aria-hidden="true">
                {[2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 2].map((w, i) => (
                  <span key={i} style={{ width: w, background: "#111" }} />
                ))}
              </div>
              <p style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 7, color: "#111", marginTop: 2 }}>{BOOK.isbn}</p>
            </div>
          </div>
        </div>
      </div>
    </Page>,
  ];
}

const ZOOMS = [0.7, 0.85, 1, 1.15];

export default function Book() {
  const { lang, setLang } = useLanguage();
  const zh = lang === "zh";
  const [view, setView] = useState<"spread" | "single">("spread");
  const [paper, setPaper] = useState<Paper>("cream");
  const [guides, setGuides] = useState(false);
  const [zoomIdx, setZoomIdx] = useState(2);
  const [spreadIdx, setSpreadIdx] = useState(0);
  const product = bookProduct();

  usePageMeta({
    title: zh ? "王淳绘画集 2019–2026：印刷版整书" : "Chun Wang Paintings 2019–2026：The Book",
    description: "Read and print Chun Wang Paintings 2019–2026, a 40-page, 6×6 in full-colour book collecting Residuals, Still Things, Remains, and In the Spirit of the 21st Century. Print-ready PDF layout with covers, folios, and production notes.",
    path: "/book",
    image: product?.image_url,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Book",
      name: "Chun Wang Paintings 2019–2026",
      author: { "@type": "Person", name: "Chun Wang" },
      numberOfPages: 40,
      bookFormat: "https://schema.org/Paperback",
      inLanguage: ["en", "zh"],
      url: `${SHOP_URL.replace(/\/$/, "")}/book`,
    },
  });

  const pages = useMemo(() => [...frontPages(lang), ...chapterPages(lang), ...backPages(lang)], [lang]);

  const spreads = useMemo(() => {
    const out: ReactNode[][] = [[pages[0]]];
    for (let i = 1; i < pages.length - 1; i += 2) out.push(pages.slice(i, i + 2));
    out.push([pages[pages.length - 1]]);
    return out;
  }, [pages]);

  const spreadLabel = (i: number) => {
    if (i === 0) return zh ? "封面" : "Front cover";
    if (i === spreads.length - 1) return zh ? "封底" : "Back cover";
    const a = i * 2, b = a + 1;
    return zh ? `第 ${a}–${b} 页` : `Pages ${a}–${b}`;
  };

  const goSpread = (next: number) => {
    const clamped = Math.max(0, Math.min(spreads.length - 1, next));
    setSpreadIdx(clamped);
    scrollToId(`book-spread-${clamped}`);
  };

  const zoom = ZOOMS[zoomIdx];
  const btn = "inline-flex items-center gap-1.5 border border-white/25 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-white/85 transition-colors hover:border-white hover:text-white disabled:cursor-not-allowed disabled:opacity-35";
  const btnOn = " !border-[hsl(328_85%_72%)] !text-[hsl(328_85%_72%)]";
  const sel = "border border-white/25 bg-black px-2 py-1.5 font-mono text-[10px] uppercase tracking-widest text-white/85";

  return (
    <div
      className="book-root min-h-screen"
      data-paper={paper}
      data-guides={guides ? "on" : "off"}
      style={{ "--book-page-w": `min(${Math.round(576 * zoom)}px, 94vw)` } as CSSProperties}
    >
      {/* Screen-only toolbar - never prints */}
      <header data-noprint className="sticky top-0 z-50 border-b border-white/15 bg-black text-white">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 sm:px-6">
          <Link to="/catalogs" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/70 transition-colors hover:text-[hsl(328_85%_72%)]">
            <ArrowLeft className="h-3.5 w-3.5" /> {zh ? "作品目录" : "Catalogs"}
          </Link>
          <span className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/45 md:inline-flex">
            <BookOpen className="h-3.5 w-3.5" /> {zh ? "王淳绘画集 2019–2026 · 40页 · 6×6英寸" : "Chun Wang Paintings 2019–2026 · 40 pp · 6×6 in"}
          </span>
          <div className="ms-auto flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="book-jump">{zh ? "跳到章节" : "Jump to section"}</label>
            <select id="book-jump" className={sel} defaultValue="" aria-label="Jump to section"
              onChange={(e) => { if (e.target.value) scrollToId(e.target.value); e.currentTarget.value = ""; }}>
              <option value="">{zh ? "跳到…" : "Jump to…"}</option>
              <option value="book-p1">{zh ? "封面" : "Cover"}</option>
              {CONTENTS.map((c) => <option key={c.id} value={c.id}>{`${pad2(c.page)} · ${zh ? c.zh : c.en}`}</option>)}
              <option value="book-p40">{zh ? "封底" : "Back cover"}</option>
            </select>
            <button type="button" className={btn} onClick={() => goSpread(spreadIdx - 1)} disabled={spreadIdx === 0} aria-label="Previous spread"><ChevronLeft className="h-3.5 w-3.5" /></button>
            <span className="min-w-[110px] text-center font-mono text-[10px] uppercase tracking-widest text-white/60" aria-live="polite">
              {spreadIdx + 1}/{spreads.length} · {spreadLabel(spreadIdx)}
            </span>
            <button type="button" className={btn} onClick={() => goSpread(spreadIdx + 1)} disabled={spreadIdx === spreads.length - 1} aria-label="Next spread"><ChevronRight className="h-3.5 w-3.5" /></button>
            <button type="button" className={`${btn}${view === "spread" ? btnOn : ""}`} onClick={() => setView("spread")} aria-pressed={view === "spread"}>{zh ? "对页" : "Spreads"}</button>
            <button type="button" className={`${btn}${view === "single" ? btnOn : ""}`} onClick={() => setView("single")} aria-pressed={view === "single"}>{zh ? "单页" : "Single"}</button>
            <select className={sel} value={paper} onChange={(e) => setPaper(e.target.value as Paper)} aria-label="Paper">
              <option value="cream">{zh ? "奶油纸" : "Cream paper"}</option>
              <option value="white">{zh ? "白纸" : "White paper"}</option>
              <option value="dark">{zh ? "深色" : "Dark gallery"}</option>
            </select>
            <button type="button" className={`${btn}${guides ? btnOn : ""}`} onClick={() => setGuides((g) => !g)} aria-pressed={guides}>{zh ? "裁切线" : "Trim guides"}</button>
            <span className="inline-flex items-center">
              <button type="button" className={btn} onClick={() => setZoomIdx((i) => Math.max(0, i - 1))} disabled={zoomIdx === 0} aria-label="Zoom out"><Minus className="h-3.5 w-3.5" /></button>
              <span className="w-11 text-center font-mono text-[10px] text-white/70">{Math.round(zoom * 100)}%</span>
              <button type="button" className={btn} onClick={() => setZoomIdx((i) => Math.min(ZOOMS.length - 1, i + 1))} disabled={zoomIdx === ZOOMS.length - 1} aria-label="Zoom in"><Plus className="h-3.5 w-3.5" /></button>
            </span>
            <button type="button" className={btn} onClick={() => setLang(zh ? "en" : "zh")}>{zh ? "EN" : "中文"}</button>
            <Link to="/product/book-paintings-2019-2026" className={btn}><ShoppingBag className="h-3.5 w-3.5" />{zh ? "买印刷版 $40" : "Buy print $40"}</Link>
            <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-1.5 border border-[hsl(328_85%_72%)] bg-[hsl(328_85%_72%)] px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-black transition-opacity hover:opacity-85">
              <Printer className="h-3.5 w-3.5" />{zh ? "打印 / 存为PDF" : "Print / Save PDF"}
            </button>
          </div>
        </div>
        <details className="border-t border-white/10">
          <summary className="cursor-pointer px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-white/55 hover:text-white sm:px-6">
            {zh ? "如何得到正确的印刷 PDF（点开看 4 步）" : "How to export a correct print PDF (4 steps)"}
          </summary>
          <ol className="grid gap-2 px-4 pb-4 font-mono text-[11px] leading-relaxed text-white/75 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
            {(zh
              ? ["1 · 点右上角“打印 / 存为PDF”，目标选“另存为 PDF”。", "2 · 纸张选自定义 6 × 6 英寸；边距选“无”；缩放 100%。", "3 · 勾选“背景图形”，否则黑色封面与满版图不会印出。", "4 · 得到 40 页单页 PDF。送印厂时再按第 38 页规格加 0.125 英寸出血并转 CMYK 打样。"]
              : ["1 · Press Print / Save PDF and choose “Save as PDF”.", "2 · Paper size: custom 6 × 6 in. Margins: None. Scale: 100%.", "3 · Tick “Background graphics”, without it, black covers won't print.", "4 · You get a 40-page single-page PDF. For press, add 0.125 in bleed and convert to CMYK per page 38, then proof."]
            ).map((s) => <li key={s} className="border border-white/15 px-3 py-2">{s}</li>)}
          </ol>
          <p className="px-4 pb-4 font-mono text-[10px] text-white/45 sm:px-6">
            {zh ? "规格速览：6×6 英寸方形 · 40 页全彩 · 平装覆哑膜软触感 · 与商店在售实体书一致。也可" : "Spec at a glance: 6×6 in square · 40 pp full colour · soft-touch matte softcover · matches the physical book in the shop. You can also "}
            <Link to="/product/book-paintings-2019-2026" className="text-[hsl(328_85%_72%)] underline underline-offset-4">{zh ? "直接购买印刷版（$40）" : "buy the printed book ($40)"}</Link>
            {zh ? "，或在 " : ", browse "}
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="text-[hsl(328_85%_72%)] underline underline-offset-4">Instagram</a>
            {zh ? " 看工作室近况。" : " for studio updates."}
          </p>
        </details>
      </header>

      {/* The book */}
      <main className="px-3 py-10 sm:px-6">
        {view === "spread" ? (
          <div className="book-stack mx-auto flex max-w-[1400px] flex-col items-center gap-12">
            {spreads.map((pair, i) => (
              <div key={i} id={`book-spread-${i}`} className="scroll-mt-32">
                <p data-noprint className="mb-3 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                  {zh ? "跨页" : "Spread"} {pad2(i + 1)} · {spreadLabel(i)}
                </p>
                <div className="book-spread">{pair}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="book-stack mx-auto flex max-w-[900px] flex-col items-center gap-12">
            {pages.map((p, i) => (
              <div key={i} className="scroll-mt-32">
                <p data-noprint className="mb-3 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                  {zh ? "第" : "Page"} {pad2(i + 1)} / {BOOK.totalPages}
                </p>
                <div className="book-spread">{p}</div>
              </div>
            ))}
          </div>
        )}

        <div data-noprint className="mx-auto mt-16 max-w-2xl border border-white/15 bg-black/40 px-6 py-6 text-center text-white">
          <p className="shop-title gloria-title text-2xl leading-none">{zh ? "读完了？" : "Finished reading?"}</p>
          <p className="mt-3 font-mono text-[11px] leading-relaxed text-white/65">
            {zh ? "把印刷版带回家（$40，全球发货），或继续浏览四个系列的完整目录与原作、版画。" : "Take the printed book home ($40, ships worldwide), or keep browsing the full catalogs，originals and prints included."}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Link to="/product/book-paintings-2019-2026" className="inline-flex items-center gap-1.5 bg-[hsl(328_85%_72%)] px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-black hover:opacity-85">
              <ShoppingBag className="h-3.5 w-3.5" />{zh ? "购买印刷版" : "Buy the printed book"}
            </Link>
            <Link to="/catalogs" className={btn}>{zh ? "浏览全部目录" : "Browse all catalogs"}</Link>
            <button type="button" className={btn} onClick={() => window.print()}><Printer className="h-3.5 w-3.5" />{zh ? "打印 / 存为PDF" : "Print / Save PDF"}</button>
          </div>
        </div>
      </main>
    </div>
  );
}
