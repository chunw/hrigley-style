export type PageBgKind = "white" | "cream" | "black" | "pink";

/**
 * A page background value: one of the named paper kinds above, or an
 * arbitrary colour as a CSS hex string ("#a3b18a") sampled from the page
 * itself with the book editor's eyedropper. Renderers branch on
 * isHexPageBg: named kinds go through the .bk-bg-* classes in
 * catalog-book.css, hex values are painted with an inline style. The
 * editor's export (book-edits.json, field pageBg) carries both forms
 * verbatim, so a picked colour lands here unchanged.
 */
export type PageBgValue = PageBgKind | string;

export const isHexPageBg = (value: string | undefined): boolean => !!value && value.startsWith("#");

/** "#a3b18a" (or "#abc") → { r, g, b } in 0–255, or null when unparseable. */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#([0-9a-f]{6}|[0-9a-f]{3})$/i.exec(hex.trim());
  if (!m) return null;
  let h = m[1];
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
}

/** r, g, b in 0–255 → "#a3b18a". */
export function rgbToHex(r: number, g: number, b: number): string {
  const c = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

/**
 * Per-page paper overrides for the book, keyed by stable page key
 * (see pageKeyOf in CatalogBook.tsx: "preface:0", "essay:photography:1",
 * "plate:41", "divider:remains", "opener:spirit:left", ...).
 * Pages not listed follow the toolbar paper choice.
 * Written by the book editor's 生成PR flow (api/book-pr.js); edit by hand if needed.
 */
export const PAGE_BACKGROUNDS: Record<string, PageBgValue> = {
  "contents": "white",
  "plate:31": "black",
  "plate:32": "black",
  "plate:103": "black",
  "plateGrid": "black",
  "canva:11": "black",
  "canva:15": "black",
  "canva:16": "black",
  "canva:3": "black",
  "canva:4": "black",
};
