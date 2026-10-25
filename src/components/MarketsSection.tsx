import { useLanguage } from "@/contexts/LanguageContext";
import { MARKET_EVENTS } from "@/lib/markets";

/** Markets & pop-ups on the About page: where the studio sets up a booth.
 * New dates are announced here — upcoming dates come first with a badge,
 * then past dates newest first. Data lives in src/lib/markets.ts. */
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
    <section className="relative py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="shop-title text-center text-3xl md:text-4xl">{t.markets.title}</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ordered.map((e) => (
            <article
              key={`${e.date}-${e.nameEn}`}
              className="relative rounded-2xl border border-border bg-card/40 p-5"
            >
              {e.up && (
                <span className="absolute right-4 top-4 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
                  {t.markets.upcoming}
                </span>
              )}
              <div className="text-xl font-semibold">{fmtDate(e.d)}</div>
              <div className="mt-2 text-base">{zh ? e.nameZh : e.nameEn}</div>
              <div className="mt-1 text-sm text-muted-foreground">{zh ? e.venueZh : e.venueEn}</div>
              <div className="mt-1 text-sm text-muted-foreground">{zh ? e.timeZh : e.timeEn}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarketsSection;
