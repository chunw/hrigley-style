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
  const { t, lang } = useLanguage();
  const zh = lang === "zh";
  const [showEmail, setShowEmail] = useState(false);

  const exploreLinks = [
    { href: "/#products", label: t.footer.navShop },
    { href: "/catalogs", label: t.footer.navCatalogs },
    { href: "/about", label: t.footer.navAbout },
    { href: "/cart", label: t.footer.navCart },
  ];

  const headingClass =
    "font-serif italic lowercase leading-none tracking-[-0.04em] text-[38px]";
  const linkClass =
    "text-[11px] uppercase leading-[1.4] tracking-[0.14em] text-white underline-offset-[3px] transition-opacity hover:underline";

  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-[1400px] px-5 pb-[42px] pt-[52px] sm:px-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr_1.4fr_0.7fr] lg:gap-8">
          <nav
            aria-label="Footer"
            className="border-t border-white pt-5 lg:border-t-0 lg:pt-0"
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

          <div className="border-t border-white pt-5 lg:border-t-0 lg:pt-0">
            <div className={headingClass}>{t.footer.contactTitle}</div>
            <ul className="mt-5 flex flex-col gap-3">
              <li>
                <button type="button" onClick={() => setShowEmail(true)} className={linkClass}>
                  {t.footer.emailLabel}
                </button>
              </li>
            </ul>
          </div>

          <div className="border-t border-white pt-5 lg:border-t-0 lg:pt-0">
            <p className="max-w-[380px] font-serif text-[28px] italic leading-[1.15] tracking-[-0.03em]">
              {t.footer.locationShipping}
            </p>
          </div>

          <div className="flex items-start gap-4 border-t border-white pt-5 lg:justify-end lg:border-t-0 lg:pt-1">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              aria-label={t.footer.instagramLabel}
              className="text-white transition-opacity hover:opacity-70"
            >
              <Instagram className="h-[26px] w-[26px]" />
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              aria-label={t.footer.linkedinLabel}
              className="text-white transition-opacity hover:opacity-70"
            >
              <Linkedin className="h-[26px] w-[26px]" />
            </a>
          </div>
        </div>
      </div>

      <div className="px-5 text-center text-[11px] uppercase tracking-[0.18em] text-white/50">
        © Chun Wang Studio 2026 · {t.footer.copyright}
      </div>

      <div className="mt-24 overflow-hidden px-2.5 pb-2.5" aria-hidden="true">
        <div
          className={`whitespace-nowrap text-center font-extrabold lowercase leading-[0.8] tracking-[-0.04em] ${
            zh ? "text-[19vw]" : "text-[10.5vw]"
          }`}
        >
          {zh ? "王淳工作室" : "chun wang studio"}
        </div>
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
