import { useCallback, useRef, useState, type CSSProperties } from "react";

// How large a thumbnail is allowed to grow, and how much viewport edge to
// always leave clear (so the expanded image never touches the screen edge).
const MAX_SCALE = 2.5;
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

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const maxHalfW = Math.min(centerX, window.innerWidth - centerX) - VIEWPORT_MARGIN;
        const maxHalfH = Math.min(centerY, window.innerHeight - centerY) - VIEWPORT_MARGIN;
        const viewportScale = Math.min((maxHalfW * 2) / rect.width, (maxHalfH * 2) / rect.height);

        setScale(Math.max(1, Math.min(nativeScale, MAX_SCALE, viewportScale)));
      }
    }
    setHovered(true);
  }, [objectFit]);

  const onMouseLeave = useCallback(() => setHovered(false), []);

  const imgStyle: CSSProperties = {
    transform: hovered ? `scale(${scale})` : undefined,
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
