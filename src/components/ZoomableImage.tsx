import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface Props {
  src: string;
  alt: string;
  imgClassName?: string;
  images?: string[];
  startIndex?: number;
  onNavigate?: (index: number) => void;
}

export const ZoomableImage = ({
  src,
  alt,
  imgClassName = "",
  images,
  startIndex = 0,
  onNavigate,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [natural, setNatural] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(startIndex);

  const allImages = images ?? [src];
  const hasMultiple = allImages.length > 1;

  // Sync startIndex only while lightbox is closed (avoid loop with onNavigate)
  useEffect(() => {
    if (!open) setLightboxIndex(startIndex);
  }, [startIndex, open]);

  const navigate = useCallback(
    (delta: number) => {
      setLightboxIndex((prev) => {
        const next = (prev + delta + allImages.length) % allImages.length;
        onNavigate?.(next);
        return next;
      });
      setNatural(false);
    },
    [allImages.length, onNavigate]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); setNatural(false); }
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, navigate]);

  const currentLightboxSrc = allImages[lightboxIndex];

  return (
    <>
      <div
        className="relative group cursor-zoom-in h-full"
        onClick={() => { setLightboxIndex(startIndex); setOpen(true); }}
      >
        <img src={src} alt={alt} className={imgClassName} />
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-black/60 rounded p-1">
            <ZoomIn size={14} className="text-white/80" />
          </div>
        </div>
      </div>

      {open && (
        <div
          className={`fixed inset-0 z-50 bg-black/95 ${
            natural
              ? "overflow-auto cursor-zoom-out"
              : "flex items-center justify-center cursor-zoom-in"
          }`}
          onClick={() => { if (natural) setNatural(false); else setOpen(false); }}
        >
          {/* Close */}
          <button
            className="fixed top-4 right-4 z-10 p-2 text-white/40 hover:text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); setOpen(false); setNatural(false); }}
          >
            <X size={18} />
          </button>

          {/* Prev / Next */}
          {hasMultiple && (
            <>
              <button
                className="fixed left-3 top-1/2 -translate-y-1/2 z-10 p-3 text-white/40 hover:text-white transition-colors"
                onClick={(e) => { e.stopPropagation(); navigate(-1); }}
              >
                <ChevronLeft size={26} />
              </button>
              <button
                className="fixed right-3 top-1/2 -translate-y-1/2 z-10 p-3 text-white/40 hover:text-white transition-colors"
                onClick={(e) => { e.stopPropagation(); navigate(1); }}
              >
                <ChevronRight size={26} />
              </button>
            </>
          )}

          {/* Counter / hint */}
          <p className="fixed bottom-4 left-1/2 -translate-x-1/2 font-mono text-xs text-white/25 pointer-events-none select-none">
            {hasMultiple ? `${lightboxIndex + 1} / ${allImages.length} · ` : ""}
            click to zoom · ← → to browse · esc to close
          </p>

          {/* Main image */}
          <img
            src={currentLightboxSrc}
            alt={alt}
            className={natural ? "block" : "max-w-[92vw] max-h-[92vh] object-contain"}
            style={
              natural
                ? { maxWidth: "none", maxHeight: "none", margin: "2rem auto", display: "block" }
                : undefined
            }
            onClick={(e) => { e.stopPropagation(); setNatural(!natural); }}
          />
        </div>
      )}
    </>
  );
};
