import { useState } from "react";
import { Instagram, Linkedin, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { INSTAGRAM_URL } from "@/lib/constants";

const LINKEDIN_URL = "https://www.linkedin.com/company/107686784/";

// Footer styled after doublestandard.nyc (her call, 2026-11-24): always a
// pure-black block with white type — big italic serif lowercase group
// headings, small uppercase wide-tracked links, social icons top-right, a
// centered copyright line, and a giant lowercase wordmark filling the full
// width at the very bottom. Content is unchanged from the previous footer.
const Footer = () => {
  const { t } = useLanguage();
  const [showEmail, setShowEmail] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribeState, setSubscribeState] = useState<"idle" | "sending" | "done" | "error">("idle");

  // Static site: subscriptions post to FormSubmit's AJAX endpoint, which
  // forwards each signup to the studio inbox as an email. The address owner
  // activates the endpoint once via a confirmation email from FormSubmit.
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = subscribeEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSubscribeState("error");
      return;
    }
    setSubscribeState("sending");
    try {
      const res = await fetch("https://formsubmit.co/ajax/chunwang.me@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email,
          _subject: "New studio friend subscription",
          _template: "table",
          _captcha: "false",
        }),
      });
      const data = await res.json().catch(() => null);
      // FormSubmit delivered the signup to the inbox in testing even when its
      // AJAX response did not come back as clean success JSON, so only an
      // explicit success:"false" (or a network failure) counts as an error.
      if (data && String(data.success) === "false") {
        setSubscribeState("error");
      } else {
        setSubscribeState("done");
      }
    } catch {
      setSubscribeState("error");
    }
  };

  const exploreLinks = [
    { href: "/#products", label: t.footer.navShop },
    { href: "/catalogs", label: t.footer.navCatalogs },
    { href: "/about", label: t.footer.navAbout },
    { href: "/cart", label: t.footer.navCart },
  ];

  const headingClass =
    "small-title lowercase leading-none text-[38px]";
  const linkClass =
    "text-[11px] uppercase leading-[1.4] tracking-[0.14em] underline-offset-[3px] transition-opacity hover:underline";

  return (
    <footer className="site-footer">
      <div className="mx-auto max-w-[1400px] px-5 pb-[42px] pt-[52px] sm:px-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr_1.4fr_0.7fr] lg:gap-8">
          <nav
            aria-label="Footer"
            className="border-t f-border pt-5 lg:border-t-0 lg:pt-0"
          >
            <div className={headingClass}>{t.footer.exploreTitle}</div>
            <ul className="mt-5 flex flex-col gap-3">
              {exploreLinks.map(({ href, label }) => (
                <li key={href}>
                  <a href={href} className={linkClass}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t f-border pt-5 lg:border-t-0 lg:pt-0">
            <div className={headingClass}>{t.footer.contactTitle}</div>
            <ul className="mt-5 flex flex-col gap-3">
              <li>
                <button type="button" onClick={() => setShowEmail(true)} className={linkClass}>
                  {t.footer.emailLabel}
                </button>
              </li>
            </ul>
          </div>

          <div className="border-t f-border pt-5 lg:border-t-0 lg:pt-0">
            <p className="max-w-[380px] font-serif text-[28px] italic leading-[1.15] tracking-[-0.03em]">
              {t.footer.locationShipping}
            </p>
          </div>

          <div className="flex items-start gap-4 border-t f-border pt-5 lg:justify-end lg:border-t-0 lg:pt-1">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              aria-label={t.footer.instagramLabel}
              className="transition-opacity hover:opacity-70"
            >
              <Instagram className="h-[26px] w-[26px]" />
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              aria-label={t.footer.linkedinLabel}
              className="transition-opacity hover:opacity-70"
            >
              <Linkedin className="h-[26px] w-[26px]" />
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-5 pb-4 sm:px-10">
        <div className="max-w-2xl border-t f-border pt-10 lg:border-t-0 lg:pt-2">
          <div className="gloria-title text-5xl leading-none sm:text-6xl">
            {t.footer.subscribeTitle}
          </div>
          <p className="mt-5 f-muted text-xs uppercase leading-relaxed tracking-[0.22em]">
            {t.footer.subscribeText}
          </p>
          {subscribeState === "done" ? (
            <p className="mt-8 border-b f-border pb-3 text-base">
              {t.footer.subscribeSuccess}
            </p>
          ) : (
            <form onSubmit={handleSubscribe} noValidate>
              <div className="mt-8 flex items-baseline gap-4 border-b f-border pb-3">
                <input
                  type="email"
                  value={subscribeEmail}
                  onChange={(e) => {
                    setSubscribeEmail(e.target.value);
                    if (subscribeState === "error") setSubscribeState("idle");
                  }}
                  placeholder={t.footer.subscribePlaceholder}
                  aria-label={t.footer.subscribePlaceholder}
                  className="f-input min-w-0 flex-1 bg-transparent text-base focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={subscribeState === "sending"}
                  className="shrink-0 font-serif text-lg normal-case italic tracking-normal text-primary transition-opacity hover:opacity-80 disabled:opacity-50"
                >
                  {t.footer.subscribeJoin}
                </button>
              </div>
              {subscribeState === "error" && (
                <p className="f-muted mt-3 text-sm">{t.footer.subscribeError}</p>
              )}
            </form>
          )}
        </div>
      </div>

      <div className="overflow-hidden px-2.5" aria-hidden="true">
        <div className="whitespace-nowrap text-center font-extrabold lowercase leading-[0.8] tracking-[-0.04em] text-[10.5vw]">
          chun wang studio
        </div>
      </div>

      <div className="f-faint px-5 pb-20 pt-12 text-center text-[11px] uppercase tracking-[0.18em]">
        © Chun Wang Studio 2026 · {t.footer.copyright}
      </div>

      {showEmail && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4"
          onClick={() => setShowEmail(false)}
        >
          <div
            className="relative border border-white/40 bg-black px-8 py-6 text-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setShowEmail(false)}
              className="absolute right-3 top-3 text-white/60 transition-colors hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="text-base">{t.footer.emailPopup}</p>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
