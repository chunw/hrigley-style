import { useState } from "react";
import { ArrowUpRight, ChevronDown, Instagram, Linkedin, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CONTACT_EMAIL, INSTAGRAM_URL, SITE_URL } from "@/lib/constants";

const LINKEDIN_URL = "https://www.linkedin.com/company/107686784/";

const Footer = () => {
  const { t } = useLanguage();
  const [openSection, setOpenSection] = useState<string | null>(null);

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

  const socials = [
    { href: INSTAGRAM_URL, label: "Instagram", Icon: Instagram },
    { href: LINKEDIN_URL, label: "LinkedIn", Icon: Linkedin },
    { href: `mailto:${CONTACT_EMAIL}`, label: t.footer.emailLabel, Icon: Mail },
  ];

  const sections = [
    {
      id: "explore",
      title: t.footer.exploreTitle,
      content: (
        <ul className="space-y-2.5 text-sm">
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
      ),
    },
    {
      id: "contact",
      title: t.footer.contactTitle,
      content: (
        <ul className="space-y-2.5 text-sm">
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
      ),
    },
    {
      id: "shipping",
      title: t.footer.shippingTitle,
      content: (
        <p className="max-w-md text-sm leading-relaxed text-foreground/75">
          {t.footer.locationShipping}
        </p>
      ),
    },
  ];

  return (
    <footer className="border-t border-border bg-background text-foreground">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-5 lg:px-7">
        <div className="grid gap-12 py-14 lg:grid-cols-[1.35fr_1fr] lg:gap-20">
          {/* Left: accordion sections, after the Miu Miu footer */}
          <div>
            {sections.map((section, i) => {
              const open = openSection === section.id;
              return (
                <div
                  key={section.id}
                  className={`border-t border-foreground/15 ${i === sections.length - 1 ? "border-b" : ""}`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenSection(open ? null : section.id)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between py-5 text-left"
                  >
                    <span className="text-sm font-semibold uppercase tracking-[0.18em]">
                      {section.title}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                  {open && <div className="pb-6">{section.content}</div>}
                </div>
              );
            })}
          </div>

          {/* Right: updates + follow */}
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.18em]">
              {t.footer.updatesTitle}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-foreground/75">
              {t.footer.updatesLine}{" "}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="text-foreground underline underline-offset-4 hover:text-primary"
              >
                @chunwang.art
              </a>
            </p>

            <div className="mt-10 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/60">
              {t.footer.followTitle}
            </div>
            <div className="mt-4 flex items-center gap-3">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background transition-opacity hover:opacity-75"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Giant cropped wordmark, after the Miu Miu footer */}
      <div aria-hidden className="select-none overflow-hidden px-1">
        <div className="translate-y-[13%] whitespace-nowrap text-center font-display text-[18.5vw] uppercase leading-[0.8] tracking-[0.01em] text-foreground">
          Chun Wang
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 sm:px-5 lg:px-7">
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
