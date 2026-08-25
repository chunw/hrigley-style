import { useCallback, useRef, useState, type CSSProperties } from "react";

// How large a thumbnail is allowed to grow, and how much viewport edge to
// always leave clear (so the expanded image never touches the screen edge).
const MAX_SCALE = 1.5;
const VIEWPORT_MARGIN = 24;

const supportsHover = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;

/**
 * Grows a grid thumbnail in place toward its native resolution on hover.
 * `objectFit` must match the image's actual CSS object-fit so the scale
 * math lines up: "cover" images are cropped to fill their box (limiting
 * axis needs the *smaller* natural/rendered ratio to reach 1:1 pixels),
 * "contain" images are fully visible inside their box (needs the *larger*
 * ratio).
 */
export function useImageHoverExpand(objectFit: "cover" | "contain" = "cover") {
  const imgRef = useRef<HTMLImageElement>(null);
  const [hovered, setHovered] = useState(false);
  const [scale, setScale] = useState(1);

  const [origin, setOrigin] = useState("50% 50%");

  const onMouseEnter = useCallback(() => {
    if (!supportsHover()) return;
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
      const rect = img.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const widthRatio = img.naturalWidth / rect.width;
        const heightRatio = img.naturalHeight / rect.height;
        const nativeScale = objectFit === "cover"
          ? Math.min(widthRatio, heightRatio)
          : Math.max(widthRatio, heightRatio);

        // Bias the growth toward whichever side of the viewport has more
        // room, so a card sitting flush against the left/top edge still
        // gets to expand — instead of being capped by a symmetric,
        // center-anchored margin it can't actually use on the tight side.
        const originXPct = rect.left < window.innerWidth / 3 ? 0 : rect.right > (window.innerWidth * 2) / 3 ? 100 : 50;
        const originYPct = rect.top < window.innerHeight / 3 ? 0 : rect.bottom > (window.innerHeight * 2) / 3 ? 100 : 50;
        setOrigin(`${originXPct}% ${originYPct}%`);

        const roomFor = (pct: number, start: number, end: number, size: number, viewportSize: number) => {
          if (pct === 0) return (viewportSize - start - VIEWPORT_MARGIN) / size;
          if (pct === 100) return (end - VIEWPORT_MARGIN) / size;
          const roomBefore = start - VIEWPORT_MARGIN;
          const roomAfter = viewportSize - end - VIEWPORT_MARGIN;
          return 1 + (2 * Math.min(roomBefore, roomAfter)) / size;
        };
        const viewportScaleW = roomFor(originXPct, rect.left, rect.right, rect.width, window.innerWidth);
        const viewportScaleH = roomFor(originYPct, rect.top, rect.bottom, rect.height, window.innerHeight);

        setScale(Math.max(1, Math.min(nativeScale, MAX_SCALE, viewportScaleW, viewportScaleH)));
      }
    }
    setHovered(true);
  }, [objectFit]);

  const onMouseLeave = useCallback(() => setHovered(false), []);

  const imgStyle: CSSProperties = {
    transform: hovered ? `scale(${scale})` : undefined,
    transformOrigin: origin,
    transition: "transform 350ms cubic-bezier(0.22, 1, 0.36, 1)",
    willChange: "transform",
  };

  return {
    imgRef,
    hovered,
    imgStyle,
    hoverHandlers: { onMouseEnter, onMouseLeave },
    // Append to the wrapper's className: lets the scaled image bleed past
    // its normally-clipping box and paint above sibling grid cards.
    wrapperHoverClassName: hovered ? "!overflow-visible !z-40" : "",
  };
}
