export interface PageBgImage {
  src: string;
  scope: "spread" | "page";
}

/**
 * Per-spread / per-page background images for the book, keyed by stable page
 * key (see pageKeyOf in CatalogBook.tsx: "preface:0", "aphorism:remains:left",
 * "plate:41", ...). An entry with scope "page" covers that one page full
 * bleed; an entry with scope "spread" is stored on either page of the
 * spread and one image runs across both pages, continuous over the gutter.
 * Pages not listed have no background image and keep their paper ground
 * (see pageBackgrounds.ts for the colour overrides underneath).
 * Written by the book editor's 生成PR flow (api/book-pr.js); edit by hand if needed.
 */
export const PAGE_BACKGROUND_IMAGES: Record<string, PageBgImage> = {
  "aphorism:what-remains:left": { src: "/watercolors/45/main.jpg", scope: "spread" },
  "opener:road:left": { src: "/watercolors/19/main.jpg", scope: "page" },
  "opener:road:right": { src: "/watercolors/18/main.jpg", scope: "page" },
};
