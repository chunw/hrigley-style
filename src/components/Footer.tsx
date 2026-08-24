import { ArrowUp, Instagram, Linkedin } from "lucide-react";

const footerMeta: [string, string][] = [];

const socialLinks = [
  { href: "https://www.instagram.com/chunwang.art/", label: "Instagram", icon: Instagram },
  { href: "https://www.linkedin.com/company/107686784/", label: "LinkedIn", icon: Linkedin },
];

const Footer = () => {
  return (
    <footer className="bg-background text-black">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-5 lg:px-7">
        <div className="pt-4 pb-4 sm:pt-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-center gap-2">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-black/70 text-black transition-colors hover:bg-black hover:text-background"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>

            <div className="grid gap-2 text-[0.5rem] uppercase tracking-[0.2em] text-black/75 sm:grid-cols-2 lg:grid-cols-7">
              {footerMeta.map(([label, value]) => (
                <div key={label} className="flex items-baseline gap-2">
                  {label && <span className="font-semibold text-black">{label}</span>}
                  {value && <span>{value}</span>}
                </div>
              ))}
            </div>

            <div className="flex items-end justify-between gap-4 lg:justify-end">
              <div className="text-right text-[0.48rem] uppercase tracking-[0.18em] leading-relaxed text-black/70">
                <span>© Chun Wang Studio Shop 2026</span> — all rights reserved
                <br />
                E-commerce partner Calcantus — P.IVA 0375...
              </div>

              <button
                type="button"
                aria-label="Back to top"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-black bg-black text-background transition-transform duration-200 hover:scale-105"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;