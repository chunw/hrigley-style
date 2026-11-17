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
 * choice won at the time, so No. 5 stayed white. (Superseded by the
 * export #17 ruling below: her #17 table is applied wholesale, and it
 * says black — No. 5 is listed again.)
 *
 * Export #11 (2026-11-08, later the same evening) restated the whole
 * set unchanged except three Canva pages: plates 3 and 4 move from
 * named black to the sampled near-black #171717, and plate 10 got a
 * warm off-white #ebeae0 — which export #14 then withdrew again, so
 * plate 10 stands at the default background below.
 *
 * Exports book-edits-4, book-edits__1, then book-edits__2-2
 * (2026-11-10): the full-table rule applied each time, with __2-2
 * governing as the final state (41 keys). Against main, the actual
 * changes are four added photography grounds: photography/02 white,
 * photography/03 black, photography/04 black, photography/08 black.
 * photography/01 went black -> white (__1) -> black (__2-2), so it
 * stands at black, unchanged; watercolors/55 went pink -> cream
 * (book-edits-4) -> pink (__1), also unchanged. All other entries
 * (canva:3/4 at #171717 included) and all three pageBgImages entries
 * were already in effect verbatim.
 *
 * Export #17 (2026-11-09): her ruling — the export's pageBg table is
 * applied wholesale; wherever the book differed, the table won.
 * canva:21 goes white and watercolor 60 goes cream; nine Notes from
 * the Road plates (watercolors 49–52, 55–59) get grounds for the
 * first time — black, pink (55) and cream (56, 58). The table's
 * legacy positional keys were resolved under the current plate
 * order: plate:5 → Remains No. 5 and plate:36 → Photography No. 1,
 * both now black per the table (plate:6/7/8/9/10 already resolved to
 * black pages).
 *
 * 2026-11-10 (her direction in chat): watercolors/55 — Notes from
 * the Road #10, the pigeon — goes from pink to cream, the paper the
 * editor palette itself labels 米色 (#FAF5EA). No other page moves.
 *
 * Export book-edits-6 (2026-11-11): full-table rule again. The table
 * matches the landed state on 41 of 42 keys; the one change is
 * Remains No. 5, which the table carries as white against the landed
 * black — so No. 5 goes back to white. (This page has flipped before:
 * black in an early export, white in her later Remains pass, black
 * again under the #17 wholesale table; this export is the newest
 * word.) textEdits / imageEdits empty; all three pageBgImages
 * entries already in effect verbatim.
 *
 * 2026-11-11 (her direction in chat): watercolors/58 — Notes from
 * the Road #13, the capuchin monkeys — leaves its trial full-bleed
 * spread and stands as a single plate page again ("这张不要做跨页，
 * 要做成一个单页"), on a black ground ("黑色底"): cream -> black.
 * The cream dated from the export #17 table, set while the plate
 * last stood as a single page; the spread itself never read this
 * key (bleed pages key separately).
 *
 * Export book-edits-7 (2026-11-11, later): full-table rule again.
 * By the time it was processed, the two entries that were in flight
 * at export time had landed: Remains No. 5 white (PR #255 merged)
 * and the Residuals No. 1 exhibition plate black (PR #257 merged,
 * file and ground both in main). The table matches the landed state
 * on the other 42 of 43 keys; the one change is the Still Things
 * No. 14 plate (watercolors/43), black → white. The export's single
 * imageEdit is on the same picture (full-bleed, slight offset) and
 * lands in imageEdits.ts. textEdits empty; pageBgImages unchanged.
 */
export const PAGE_BACKGROUNDS: Record<string, PageBgValue> = {
  "contents": "white",
  "plate:/remains/01/main.jpg": "black",
  // Remains No. 1 as a full-bleed spread (her direction, 2026-11-11):
  // both halves stand on black, so the fit picture's slack on the
  // right reads as the picture's own black ground.
  "bleed:remains:left": "black",
  "bleed:remains:right": "black",
  // White-ground rule (her direction, 2026-11-15): a framed plate
  // page whose picture does not fill the sheet stands on WHITE,
  // not black — the Ratchadamnoen plate (watercolors/50) first,
  // then every plate page of the same class, flipped in the same
  // pass: remains/02, /03, /04, /06, watercolors/05, /49, /50, /51,
  // /53, /59, photography/01, /03, /04, /07, /08 and the Negotiated
  // Intelligence chimera-haiku plate. Only the ground changes:
  // picture, caption and folio are untouched, and the light ground
  // flips each caption to the white-paper grey via the --cap rules,
  // as on every white page. Held back, unchanged, at her standing
  // page-specific directions: the Residuals No. 1 pair
  // (watercolors/01 + its exhibition page — a designed black
  // spread), the monkeys plate (watercolors/58 — directed to a
  // single black page, 2026-11-11), the plateGrid ground (the
  // Rothko 2×2 grid and the objects grid stand on it by design)
  // and the black Canva facsimile pages (canva:15, canva:16 —
  // p. 16's black was confirmed by her, 2026-11-11). Full-bleed
  // plates (watercolors/46) and the bleed spreads keep their
  // grounds: there the black is the picture itself.
  "plate:/remains/02/main.jpg": "white",
  "plate:/remains/03/main.jpg": "white",
  "plate:/remains/04/main.jpg": "white",
  "plate:/remains/05/main.jpg": "white",
  "plate:/remains/06/main.jpg": "white",
  // Residuals #26 (watercolors/54): black → white (her direction,
  // 2026-11-15 — the page takes the white ground of her sample
  // page). Only the ground changes: the plate keeps its folio and
  // its facing partner (the untitled teapot plate, itself on
  // white), so the spread and the book's pagination are untouched;
  // the light ground flips the caption to the white-paper grey via
  // the --cap rules, as on every white page.
  "plate:/watercolors/54/main.jpg": "white",
  "plate:/watercolors/01/main.jpg": "black",
  "plate:/book/residuals/residuals-01-exhibition.jpg": "black",
  "plate:/watercolors/05/main.jpg": "white",
  "plate:/watercolors/13/main.jpg": "black",
  "plate:/watercolors/43/main.jpg": "white",
  // Still Things No. 8 (watercolors/14), restored by PR #304: the page
  // ground takes the painting's own paper colour — #D3CEC3, the median
  // of the picture's paper region — instead of black (her direction,
  // 2026-11-14: "其八的底色 不要黑色 要复制画里本身的背景色"). The
  // picture file itself is unchanged; only the page ground moves, and
  // the light ground flips the caption to the dark-text preset via
  // hexBgStyle, as on white/cream pages.
  "plate:/watercolors/14/main.jpg": "#D3CEC3",
  "plate:/watercolors/45/main.jpg": "black",
  "plate:/watercolors/46/main.jpg": "black",
  "plate:/watercolors/47/main.jpg": "black",
  "plate:/watercolors/53/main.jpg": "white",
  "plate:/watercolors/60/main.jpg": "cream",
  "plate:/book/road/road-castle-cake.jpg": "cream",
  "canva:21": "white",
  "plate:/watercolors/49/main.jpg": "white",
  "plate:/watercolors/50/main.jpg": "white",
  "plate:/watercolors/51/main.jpg": "white",
  // Medellín rooftops plate (watercolors/52): black → white (her
  // direction, 2026-11-15: "background for this image should be
  // white"). Only the ground changes: image, caption and folio are
  // untouched, and the facing page (folio 65, the Colombia diary) is
  // already on white, so the spread stands white/white; the light
  // ground flips the caption to the white-paper grey via the --cap
  // rules, as on every white page. This also supersedes the
  // book-edits-8 export table, which still carried this plate as
  // black — her chat direction is the newer word.
  // Superseded 2026-11-16 (her direction in chat: "这张背景改成
  // 米色"): white → warm beige #E9E1CF, the solid mid tone of the
  // beige gradient in her reference mock (#f2eee3 → #e0d8c4). Only
  // this page's ground changes; the picture also takes a soft drop
  // shadow on this page only (see .bk-plate-frame-shadow in
  // catalog-book.css). Caption, folio and facing page untouched.
  "plate:/watercolors/52/main.jpg": "#E9E1CF",
  "plate:/watercolors/57/main.jpg": "black",
  "plate:/watercolors/59/main.jpg": "white",
  "plate:/watercolors/55/main.jpg": "cream",
  "plate:/watercolors/56/main.jpg": "cream",
  "plate:/watercolors/58/main.jpg": "black",
  "plate:/photography/01/main.jpg": "white",
  "plate:/photography/02/main.jpg": "white",
  "plate:/photography/03/main.jpg": "white",
  "plate:/photography/04/main.jpg": "white",
  "plate:/photography/08/main.jpg": "white",
  "plate:/photography/07/main.jpg": "white",
  "plate:/book/negotiated/work-chimera-haiku.jpg": "white",
  "plateGrid": "black",
  "canva:11": "black",
  "canva:15": "black",
  "canva:16": "black",
  // Export book-edits-9 (2026-11-16): the full table carries
  // canva:14 as white; the book had no entry for the page (it
  // followed the white toolbar default, so the sheet already
  // rendered white). The entry lands to align the table; no
  // visible change.
  "canva:14": "white",
  "canva:3": "#171717",
  "canva:4": "#171717",
  // Still Things title spread (her direction, 2026-11-11): the ground
  // takes the collage graphic's own ground colour — #06050A, sampled
  // from canva p. 11 — so the square graphic standing on the spread
  // blends into it without a visible edge.
  "opener:stillthings:left": "#06050A",
  "opener:stillthings:right": "#06050A",
};
