import { ReactNode, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const DRAG_THRESHOLD = 4;

// Lets the visitor drag the dialog card around the hero photo. Movement below
// DRAG_THRESHOLD doesn't count as a drag, so clicking the card's links still works.
const useDraggable = () => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef<{ startX: number; startY: number; origX: number; origY: number; moved: boolean } | null>(null);
  // Set true right when a drag ends; consumed (and cleared) by the very next click,
  // so it never lingers to swallow an unrelated later click.
  const justDragged = useRef(false);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    drag.current = { startX: e.clientX, startY: e.clientY, origX: offset.x, origY: offset.y, moved: false };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.startX;
    const dy = e.clientY - drag.current.startY;
    if (!drag.current.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
    if (!drag.current.moved) {
      // Capture only once a real drag starts — capturing on every pointerdown would
      // retarget the resulting click event to this div, breaking the anchor's own clicks.
      (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    }
    drag.current.moved = true;
    setOffset({ x: drag.current.origX + dx, y: drag.current.origY + dy });
  };

  const onPointerUp = () => {
    justDragged.current = !!drag.current?.moved;
    drag.current = null;
  };

  const onClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!justDragged.current) return;
    justDragged.current = false;
    e.preventDefault();
    e.stopPropagation();
  };

  return {
    style: { transform: `translate(${offset.x}px, ${offset.y}px)` },
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onClickCapture,
  };
};

interface HeroSectionProps {
  titleOverride?: ReactNode;
  bordered?: boolean;
  logoSrc?: string;
  aboutLinkBlack?: boolean;
  titleBlack?: boolean;
  yellowBackground?: boolean;
  hideBgImage?: boolean;
  bgImageSrc?: string;
  hideTitle?: boolean;
  hideAboutLink?: boolean;
}

const DEFAULT_BG_IMAGE =
  "https://cdn.myportfolio.com/28e70582c8bd2069899fb42e60980ce2/af3f4d90-9ec9-4349-93f9-b47c33833106_rwc_0x98x1200x938x1200.gif?h=4a7cdfb5fee81de134dd238b6c03c921";

const HeroSection = ({
  titleOverride,
  bordered = false,
  logoSrc,
  aboutLinkBlack = false,
  titleBlack = false,
  yellowBackground = false,
  hideBgImage = false,
  bgImageSrc = DEFAULT_BG_IMAGE,
  hideTitle = false,
  hideAboutLink = false,
}: HeroSectionProps = {}) => {
  const { t, lang } = useLanguage();
  const draggable = useDraggable();

  return (
    <section className={`cargo-hero ${logoSrc ? "cargo-hero-theme-aware" : "cargo-hero-adaptive"} relative ${bordered ? "border-[20px] border-red-600" : ""} ${yellowBackground ? "!bg-yellow-400" : ""}`}>
      {!hideBgImage && (
        <div className="cargo-hero-bg" aria-hidden="true">
          <img
            src={bgImageSrc}
            alt=""
            className="cargo-hero-bg-img"
          />
          <div className="cargo-hero-overlay" />
        </div>
      )}
      <div className="cargo-hero-inner">
        {!hideTitle && (
          <h1 className={`shop-title cargo-hero-title ${lang === "en" ? "gloria-title" : ""} ${titleBlack ? "!text-black" : ""}`}>
            {titleOverride ? (
              <span className="hero-title-brand block">{titleOverride}</span>
            ) : (
              <>
                <span className="hero-title-brand block">{t.shopTitle.line1}</span>
                <span className="hero-title-brand hero-title-sub block">{t.shopTitle.line2}</span>
                <span className={`block hero-title-shop ${titleBlack ? "" : "text-primary"}`}>{t.shopTitle.line3}</span>
              </>
            )}
          </h1>
        )}

        <p className="font-helvetica cargo-hero-description">
          {t.hero.description}
        </p>

        <p className="font-helvetica cargo-hero-byline">
          {/* {t.hero.createdExclusivelyBy}{" "} */}
          {/* <a href="https://www.chunwang.art" target="_blank" rel="noreferrer">
            <span className="text-primary">chun wang</span>
          </a>
          {t.hero.forImaginativeCollectors} */}
        </p>

        {!hideAboutLink && (
          <nav className="cargo-hero-links" aria-label="hero links">
            <a href="/about" className={`cargo-link ${aboutLinkBlack ? "!text-black !border-black" : ""}`}>{t.index.ctaAbout}</a>
          </nav>
        )}

      </div>

      {logoSrc && (
        <div className="hero-message-card-bottom-wrap">
          <div
            className="hero-message-card hero-message-card-tight cursor-grab active:cursor-grabbing touch-none select-none"
            style={draggable.style}
            onPointerDown={draggable.onPointerDown}
            onPointerMove={draggable.onPointerMove}
            onPointerUp={draggable.onPointerUp}
            onClickCapture={draggable.onClickCapture}
          >
            <img
              src={logoSrc}
              alt="Slightly Useful Object logo"
              draggable={false}
              className="mx-auto mb-1 w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] object-contain"
            />
            <h2 className="hero-dialog-title">{t.hero.dialogTitle}</h2>
            <p className="hero-dialog-sub font-helvetica">
              {t.hero.createdExclusivelyBy}{" "}
              <a href="https://www.chunwang.art" target="_blank" rel="noreferrer">
                <span className="text-primary">chun wang</span>
              </a>
              {t.hero.forImaginativeCollectors}
            </p>
            <a className="hero-dialog-btn" href="#products">{t.hero.shopCta}</a>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
