export type PageBgKind = "white" | "cream" | "black" | "pink";

/**
 * Per-page paper overrides for the book, keyed by stable page key
 * (see pageKeyOf in CatalogBook.tsx: "preface:0", "essay:photography:1",
 * "plate:41", "divider:remains", "opener:spirit:left", ...).
 * Pages not listed follow the toolbar paper choice.
 * Written by the book editor's 生成PR flow (api/book-pr.js); edit by hand if needed.
 */
export const PAGE_BACKGROUNDS: Record<string, PageBgKind> = {
  contents: "white",
};
