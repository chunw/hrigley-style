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
 * (see pageKeyOf in CatalogBook.tsx: "preface:0", "plate:<image path>",
 * "opener:spirit:left", ...). Plate keys carry the work's image path,
 * NOT its sequence number — sequence numbers retarget whenever the
 * chapter order changes, and silently repainted other works twice
 * before this was fixed (2026-11-08). Pages not listed follow the
 * toolbar paper choice.
 *
 * The black set below is the union of her editor exports #7–#10
 * (2026-11-08 evening), resolved to works under both chapter orders
 * she exported from (studio site: Residuals-first; #188 preview:
 * Remains-first). One conflict: Remains No. 5 was black in the older
 * export, white in the later Remains-chapter pass — the later, explicit
 * choice wins, so No. 5 stays white (and is not listed here).
 *
 * Export #11 (2026-11-08, later the same evening) restated the whole
 * set unchanged except three Canva pages: plates 3 and 4 move from
 * named black to the sampled near-black #171717, and plate 10 got a
 * warm off-white #ebeae0 — which export #14 then withdrew again, so
 * plate 10 stands at the default background below.
 */
export const PAGE_BACKGROUNDS: Record<string, PageBgValue> = {
  "contents": "white",
  "plate:/remains/01/main.jpg": "black",
  "plate:/remains/02/main.jpg": "black",
  "plate:/remains/03/main.jpg": "black",
  "plate:/remains/04/main.jpg": "black",
  "plate:/remains/06/main.jpg": "black",
  "plate:/watercolors/54/main.jpg": "black",
  "plate:/watercolors/01/main.jpg": "black",
  "plate:/watercolors/05/main.jpg": "black",
  "plate:/watercolors/13/main.jpg": "black",
  "plate:/watercolors/43/main.jpg": "black",
  "plate:/watercolors/14/main.jpg": "black",
  "plate:/watercolors/45/main.jpg": "black",
  "plate:/watercolors/46/main.jpg": "black",
  "plate:/watercolors/47/main.jpg": "black",
  "plate:/watercolors/53/main.jpg": "black",
  "plate:/watercolors/60/main.jpg": "black",
  "canva:21": "black",
  "plate:/photography/07/main.jpg": "black",
  "plate:/book/negotiated/work-chimera-haiku.jpg": "black",
  "plateGrid": "black",
  "canva:11": "black",
  "canva:15": "black",
  "canva:16": "black",
  "canva:3": "#171717",
  // Export #15 (2026-11-09) restates plate 4 as plain black, and her
  // ruling on that export is that the editor wins on picked colours —
  // so plate 4 returns to black here (#171717 stands only on plate 3).
  "canva:4": "black",
};
