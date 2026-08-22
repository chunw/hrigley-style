import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const HeroSection = () => {
  const { t } = useLanguage();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ pointerId: number; offsetX: number; offsetY: number } | null>(null);
  const [dialogPosition, setDialogPosition] = useState({ x: 24, y: 24 });
  const hasPositionedRef = useRef(false);

  useLayoutEffect(() => {
    if (hasPositionedRef.current) return;
    const dialog = dialogRef.current;
    const parent = dialog?.parentElement;
    if (!dialog || !parent) return;

    const parentRect = parent.getBoundingClientRect();
    const dialogRect = dialog.getBoundingClientRect();

    setDialogPosition({
      x: 24 - 200,
      y: clamp(parentRect.height - dialogRect.height - 24, 0, parentRect.height - dialogRect.height),
    });
    hasPositionedRef.current = true;
  }, []);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!dragRef.current || !dialogRef.current) return;

      const dialog = dialogRef.current;
      const parent = dialog.parentElement;
      if (!parent) return;

      const parentRect = parent.getBoundingClientRect();
      const dialogRect = dialog.getBoundingClientRect();

      const nextX = event.clientX - parentRect.left - dragRef.current.offsetX;
      const nextY = event.clientY - parentRect.top - dragRef.current.offsetY;

      setDialogPosition({
        x: clamp(nextX, 0, parentRect.width - dialogRect.width),
        y: clamp(nextY, 0, parentRect.height - dialogRect.height),
      });
    };

    const handlePointerUp = () => {
      dragRef.current = null;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dialogRef.current) return;
    if ((event.target as HTMLElement).closest("a")) return;

    const dialogRect = dialogRef.current.getBoundingClientRect();
    dragRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - dialogRect.left,
      offsetY: event.clientY - dialogRect.top,
    };

    dialogRef.current.setPointerCapture(event.pointerId);
  };

  return (
    <section className="cargo-hero relative">
      <div className="cargo-hero-bg" aria-hidden="true">
        <img
          src="https://cdn.myportfolio.com/28e70582c8bd2069899fb42e60980ce2/af3f4d90-9ec9-4349-93f9-b47c33833106_rwc_0x98x1200x938x1200.gif?h=4a7cdfb5fee81de134dd238b6c03c921"
          alt=""
          className="cargo-hero-bg-img"
        />
        <div className="cargo-hero-overlay" />
      </div>
      <div className="cargo-hero-inner">
        <h1 className="shop-title cargo-hero-title">
          <span>{t.shopTitle.line1}</span>
          <br />
          <span>{t.shopTitle.line2}</span>
          <br />
          <span className="text-primary">{t.shopTitle.line3}</span>
        </h1>

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

        <nav className="cargo-hero-links" aria-label="hero links">
          <a href="/about" className="cargo-link !text-white">{t.index.ctaAbout}</a>
          <a href="/catalogs" className="cargo-link !text-white">{t.index.ctaCatalogs}</a>
        </nav>
        <div
          ref={dialogRef}
          className="hero-dialog"
          role="dialog"
          aria-label="hero message"
          style={{ left: `${dialogPosition.x}px`, top: `${dialogPosition.y}px` }}
          onPointerDown={handlePointerDown}
        >
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
    </section>
  );
};

export default HeroSection;
