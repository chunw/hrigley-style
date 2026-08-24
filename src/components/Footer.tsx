import { ArrowUp, Instagram, Linkedin } from "lucide-react";

const socialLinks = [
  { href: "https://www.instagram.com/chunwang.art/", label: "Instagram", icon: Instagram },
  { href: "https://www.linkedin.com/company/107686784/", label: "LinkedIn", icon: Linkedin },
];

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-black/10 bg-background text-black">
      <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-5 lg:px-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-black/70 text-black transition-colors hover:bg-black hover:text-background"
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>

          <div className="text-left text-[0.5rem] uppercase tracking-[0.18em] text-black/70 sm:text-center lg:text-right">
            <div>© Chun Wang Studio Shop 2026</div>
            <div>All rights reserved.</div>
            <div className="mt-1 normal-case">Designed & shipped from New York City. Ships worldwide.</div>
          </div>

          <button
            type="button"
            aria-label="Back to top"
            onClick={scrollToTop}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-black bg-black text-background transition-transform duration-200 hover:scale-105"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;