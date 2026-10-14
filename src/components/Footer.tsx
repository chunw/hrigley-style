import { ArrowUpRight, Instagram, Linkedin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CONTACT_EMAIL, INSTAGRAM_URL, SITE_URL } from "@/lib/constants";

const LINKEDIN_URL = "https://www.linkedin.com/company/107686784/";

const socialLinks = [
  { href: INSTAGRAM_URL, label: "Instagram", icon: Instagram },
  { href: LINKEDIN_URL, label: "LinkedIn", icon: Linkedin },
];

const Footer = () => {
  const { t } = useLanguage();

  const exploreLinks = [
    { href: "/#products", label: t.footer.navShop },
    { href: "/catalogs", label: t.footer.navCatalogs },
    { href: "/about", label: t.footer.navAbout },
    { href: "/cart", label: t.footer.navCart },
  ];

  const contactLinks = [
    { href: `mailto:${CONTACT_EMAIL}`, label: t.footer.emailLabel, external: false },
    { href: INSTAGRAM_URL, label: t.footer.instagramLabel, external: true },
    { href: LINKEDIN_URL, label: t.footer.linkedinLabel, external: true },
  ];

  return (
    <footer className="border-t border-border bg-background text-foreground">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-5 lg:px-7">
        <div className="grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.22em]">
              Chun Wang Studio Shop
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-foreground/70">
              {t.footer.locationShipping}
            </p>
            <div className="mt-5 flex items-center gap-2">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/80 transition-colors hover:bg-foreground hover:text-background"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Footer">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/60">
              {t.footer.exploreTitle}
            </div>
            <ul className="mt-4 space-y-2.5 text-sm">
              {exploreLinks.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-foreground/75 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/60">
              {t.footer.contactTitle}
            </div>
            <ul className="mt-4 space-y-2.5 text-sm">
              {contactLinks.map(({ href, label, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="group inline-flex items-center gap-1 text-foreground/75 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    {label}
                    {external && (
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-60" />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-border py-5 text-[11px] uppercase tracking-[0.18em] text-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <div>© Chun Wang Studio Shop 2026 · {t.footer.copyright}</div>
          <a
            href={SITE_URL}
            target="_blank"
            rel="noreferrer"
            className="text-sm normal-case tracking-normal underline-offset-4 hover:text-foreground hover:underline"
          >
            {t.footer.artistSiteLabel}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
