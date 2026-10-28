import { useLanguage } from "@/contexts/LanguageContext";
import { MARKET_EVENTS } from "@/lib/markets";

/** Playful flyer palette for the market cards - warm paper tones, cycled. */
const CARD_STYLES = [
  { bg: "#f6efe0", tilt: "-1.6deg" },
  { bg: "#fbe3dd", tilt: "1.2deg" },
  { bg: "#fdf3d8", tilt: "-0.8deg" },
  { bg: "#e3efe2", tilt: "1.5deg" },
];

/** Markets & pop-ups on the About page: where the studio sets up a booth.
 * New dates are announced here - upcoming dates come first with a badge,
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
    <section className="relative pt-8 pb-16 md:pt-12 md:pb-24">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="shop-title -rotate-1 text-center text-3xl md:text-4xl">{t.markets.title}</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                  {zh ? e.nameZh : e.nameEn}
                </div>
                <div className="mt-1.5 text-sm text-[#2b2b2b]/65">{zh ? e.venueZh : e.venueEn}</div>
                <div className="mt-0.5 text-sm font-medium text-[#dc2626]">{zh ? e.timeZh : e.timeEn}</div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MarketsSection;
