import type { ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { MARKET_EVENTS } from "@/lib/markets";

/** Playful flyer palette for the market cards, warm paper tones, cycled. */
const CARD_STYLES = [
  { bg: "#f6efe0", tilt: "-1.6deg" },
  { bg: "#fbe3dd", tilt: "1.2deg" },
  { bg: "#fdf3d8", tilt: "-0.8deg" },
  { bg: "#e3efe2", tilt: "1.5deg" },
];

/** Wrap `part` of `text` (default: the whole string) in an external link to
 * the market's or venue's official site. The visible text never changes. */
const linked = (text: string, url?: string, part?: string): ReactNode => {
  if (!url) return text;
  const needle = part ?? text;
  const i = text.indexOf(needle);
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <a className="market-link" href={url} target="_blank" rel="noreferrer">
        {needle}
      </a>
      {text.slice(i + needle.length)}
    </>
  );
};

/** Markets & pop-ups: the first column of the About page's column layout
 * (leftmost on desktop, first on mobile). Where the studio sets up a booth.
 * New dates are announced here, upcoming dates come first with a badge,
 * then past dates newest first. Data lives in src/lib/markets.ts.
 * Cards are styled as little taped-up paper flyers. */
const MarketsSection = () => {
  const { t, lang } = useLanguage();
  const zh = lang === "zh";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const parsed = MARKET_EVENTS.map((e) => ({ ...e, d: new Date(`${e.date}T12:00:00`) }));
  const upcoming = parsed.filter((e) => e.d >= today).sort((a, b) => +a.d - +b.d);
  const past = parsed.filter((e) => e.d < today).sort((a, b) => +b.d - +a.d);
  const ordered = [
    ...upcoming.map((e) => ({ ...e, up: true })),
    ...past.map((e) => ({ ...e, up: false })),
  ];

  const fmtDate = (d: Date) =>
    zh
      ? `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
      : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="about-markets-column">
      <h2 className="shop-title about-markets-heading">{t.markets.title}</h2>
      <div className="about-markets-cards">
        {ordered.map((e, i) => {
          const s = CARD_STYLES[i % CARD_STYLES.length];
          return (
            <article
              key={`${e.date}-${e.nameEn}`}
              className="group relative p-5 pt-7 text-[#2b2b2b] shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:!rotate-0 hover:scale-[1.04]"
              style={{ backgroundColor: s.bg, transform: `rotate(${s.tilt})`, borderRadius: "6px 14px 8px 16px" }}
            >
              <span
                aria-hidden="true"
                className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-2 rounded-[2px] bg-white/60 shadow-sm"
              />
              {e.up && (
                <span className="absolute -right-2 -top-2 rotate-6 rounded-sm bg-[#dc2626] px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-white shadow-md">
                  {t.markets.upcoming}
                </span>
              )}
              <div
                className="text-[26px] leading-none"
                style={{ fontFamily: "'Gloria Hallelujah', cursive" }}
              >
                {fmtDate(e.d)}
              </div>
              <div className="mt-3 border-t-2 border-dashed border-[#2b2b2b]/20 pt-3 text-lg font-bold leading-snug">
                {linked(zh ? e.nameZh : e.nameEn, e.nameUrl, zh ? e.nameLinkTextZh : e.nameLinkTextEn)}
              </div>
              <div className="mt-1.5 text-sm text-[#2b2b2b]/65">
                {linked(zh ? e.venueZh : e.venueEn, e.venueUrl, zh ? e.venueLinkTextZh : e.venueLinkTextEn)}
              </div>
              <div className="mt-0.5 text-sm font-medium text-[#dc2626]">{zh ? e.timeZh : e.timeEn}</div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default MarketsSection;
