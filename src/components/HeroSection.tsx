import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const HeroSection = () => {
  const { t } = useLanguage();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ pointerId: number; offsetX: number; offsetY: number } | null>(null);
  const [dialogPosition, setDialogPosition] = useState(() => ({
    x: 18 + Math.random() * 62,
    y: 32 + Math.random() * 26,
  }));

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!dragRef.current || !dialogRef.current) return;

      const dialog = dialogRef.current;
      const rect = dialog.parentElement?.getBoundingClientRect();
      if (!rect) return;

      const nextX = ((event.clientX - rect.left - dragRef.current.offsetX) / rect.width) * 100;
      const nextY = ((event.clientY - rect.top - dragRef.current.offsetY) / rect.height) * 100;

      setDialogPosition({
        x: clamp(nextX, 12, 88),
        y: clamp(nextY, 18, 82),
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
    if (!dialogRef.current || !dialogRef.current.parentElement) return;

    const rect = dialogRef.current.getBoundingClientRect();
    const parentRect = dialogRef.current.parentElement.getBoundingClientRect();
    dragRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    };

    const nextX = ((event.clientX - parentRect.left - (rect.width / 2)) / parentRect.width) * 100;
    const nextY = ((event.clientY - parentRect.top - (rect.height / 2)) / parentRect.height) * 100;
    setDialogPosition({
      x: clamp(nextX, 12, 88),
      y: clamp(nextY, 18, 82),
    });

    event.preventDefault();
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
          {t.hero.createdExclusivelyBy}{" "}
          <a href="https://www.chunwang.art/" target="_blank" rel="noreferrer">
            <span className="text-primary">chun wang</span>
          </a>
          {t.hero.forImaginativeCollectors}
        </p>

        <nav className="cargo-hero-links" aria-label="hero links">
          <a href="/about" className="cargo-link">{t.index.ctaAbout}</a>
        </nav>
        <div
          ref={dialogRef}
          className="hero-dialog"
          role="dialog"
          aria-label="hero message"
          style={{ left: `${dialogPosition.x}%`, top: `${dialogPosition.y}%` }}
          onPointerDown={handlePointerDown}
        >
          <h2 className="hero-dialog-title">Handmade & one of a kind.</h2>
          <p className="hero-dialog-sub">Ceramics with big feelings!</p>
          <a className="hero-dialog-btn" href="#shop">Shop</a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
