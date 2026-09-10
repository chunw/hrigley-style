import { Instagram, Linkedin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CONTACT_EMAIL, INSTAGRAM_URL } from "@/lib/constants";

const socialLinks = [
  { href: "https://www.instagram.com/chunwang.art/", label: "Instagram", icon: Instagram },
  { href: "https://www.linkedin.com/company/107686784/", label: "LinkedIn", icon: Linkedin },
];

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-background text-foreground">
      <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-5 lg:px-7">
        <div className="flex flex-col items-center gap-5 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <div className="flex items-center gap-2 lg:justify-self-start">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>

          <div className="text-center text-[11px] uppercase tracking-[0.18em] text-foreground/70">
            <div>© Chun Wang Studio Shop 2026</div>
            <div>{t.footer.copyright}</div>
            <div className="mt-1 normal-case">{t.footer.locationShipping}</div>
          </div>

          <div className="text-center text-[11px] uppercase tracking-[0.18em] text-foreground/70 lg:justify-self-end lg:text-right">
            <div>
              {t.footer.contactPrefix}{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="normal-case underline hover:text-foreground">
                {CONTACT_EMAIL}
              </a>{" "}
              {t.footer.contactOr}{" "}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="normal-case underline hover:text-foreground"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;