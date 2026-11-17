/**
 * Landed picture edits for the Remains book, keyed by the picture's
 * own src (stable across pagination shifts, like the page
 * backgrounds). These are the defaults baked into the book itself;
 * the book editor's staged edits (localStorage) override them, and
 * her exported book-edits.json (field imageEdits) is what lands here.
 * The shape mirrors the ImgEdit interface in CatalogBook.tsx.
 */
export interface LandedImgEdit {
  scale?: number;
  dx?: number;
  dy?: number;
  full?: boolean;
  pos?: { x: number; y: number };
  src?: string;
}

export const IMAGE_EDITS: Record<string, LandedImgEdit> = {
  // Exports #11 and #13 (2026-11-08) set full-bleed edits on two
  // Canva facsimile pictures (p10.jpg cropped, p04.jpg centred);
  // export #14, seven minutes later from the same editor store (it
  // carries #11's #171717 backgrounds but none of the Canva items),
  // withdrew both edits and the warm background on canva:10. The
  // withdrawals are landed here: the record stands empty.
  //
  // Export #15 (2026-11-09): the Canva facsimile plate 3 picture is
  // scaled up a touch and nudged — her editor values, verbatim.
  "/book/canva-paintings/p03.jpg": { scale: 1.121, dx: 6.055278761279304, dy: -4.433956606725688, full: false },
  // Export #17 (2026-11-09): her newest export re-asserts the two
  // full-bleed Canva edits that #14 withdrew (p04 centred, p10
  // cropped), adds a hairline nudge on p02, and a scale-up on the
  // watercolor plate 14 — her editor values, verbatim.
  "/book/canva-paintings/p04.jpg": { full: true },
  "/book/canva-paintings/p10.jpg": { full: true },
  "/book/canva-paintings/p02.jpg": { full: false, scale: 1, dx: 0.042613218914391515, dy: -0.0634831823366115 },
  // The watercolor plate 14 (Still Things No. 8), full-bleed
  // (her direction, 2026-11-15). History: export #17's scale-up
  // (scale 1.343, dx -7.2721581120530026, dy 2.9039708327036458)
  // was withdrawn by PR #304 because at that scale the painting
  // painted over the plate's caption; the plate then stood in a
  // natural frame on a page ground sampled from the painting's
  // own paper (#D3CEC3) — but the flat ground read as a visible
  // band against the photograph's uneven paper ("不太融合啊 要
  // 看不出来有底色"), so she directed the full-bleed version
  // instead, with the caption standing on the picture. The #17
  // scale-up alone was re-checked first: it still leaves the
  // flat ground showing at the sheet's right and bottom (pixel-
  // sampled #D3CEC3 in the render), so the plate stands as a
  // true edge-to-edge bleed. The crop position (50/44) is set
  // from the painting itself: it keeps the hood's top inside
  // the sheet and lands the overlay caption on the empty paper
  // below the figure (figure pixels end at 85% of the picture's
  // height in the caption's span; the grey shadow at the lower
  // right stays clear of it). The caption overlay itself is
  // rendered by the plate case in CatalogBook.tsx.
  "/watercolors/14/main.jpg": { full: true, pos: { x: 50, y: 44 } },
  // Export book-edits-5 (2026-11-10): the watercolor plate 46
  // full-bleed is restated plain — her newest export carries
  // { full: true } and nothing else for this picture, superseding
  // export #17's positioned full-bleed (pos 57.9/50, dy hairline).
  // The crop position returns to centre. Her value, verbatim.
  "/watercolors/46/main.jpg": { full: true },
  // Exports book-edits__1-2 / __2-3 / __3-3 (2026-11-11, three
  // successive exports folded into one landing): five picture edits,
  // her editor values verbatim. From __1-2: the Canva facsimile
  // plate 16 picture goes full-bleed, crop anchored right-centre
  // (pos 100/50). From __2-3: hairline nudges on the Canva plate 21
  // and 22 pictures (scale 1, small offsets), and the
  // watercolors/55 plate (Notes from the Road, the pigeon) goes
  // full-bleed. From __3-3: the Beijing castle-cake plate goes
  // full-bleed, crop anchored near the top (pos 50/4.2).
  "/book/canva-paintings/p16.jpg": { full: true, pos: { x: 100, y: 50 } },
  "/book/canva-paintings/p21.jpg": { full: false, scale: 1, dx: 0.8101345770781698, dy: 2.169518520031037 },
  "/book/canva-paintings/p22.jpg": { full: false, scale: 1, dx: -0.07166107953165234, dy: 0.10316980326585791 },
  "/watercolors/55/main.jpg": { full: true },
  // Export book-edits-7 (2026-11-11) set the Still Things No. 14
  // plate (watercolors/43) full-bleed with a slight offset, its page
  // ground going white in the same export (pageBackgrounds.ts — the
  // white ground stands). Withdrawn 2026-11-14, her call: the
  // full-bleed portal painted over the plate's caption and folio
  // (pixel test: forcing the caption bright red changed 0 pixels —
  // the same failure as the watercolors/14 scale-up withdrawn in
  // PR #304). The record stands empty: the plate sits in its
  // natural frame and its caption prints.
  // Export book-edits-8 (2026-11-15): she re-asserts the full-bleed
  // on this same picture — { full: true } plain, no offset — so the
  // 2026-11-14 withdrawal above is superseded by her newest export.
  // The export's pageBg table (47 keys) and all three pageBgImages
  // entries were verified identical to the landed state, so this
  // picture edit is its only change; the white page ground from
  // book-edits-7 stands. Her value, verbatim.
  // Export book-edits-9 (2026-11-16) supersedes it again: the
  // full-bleed comes OFF this picture, replaced by a scale-and-shift
  // in its frame (scale 1.19, dx 2.94, dy 5.19). Her newest value,
  // verbatim — the plate's overlay caption goes with the bleed, and
  // its framed caption prints under the frame again.
  "/watercolors/43/main.jpg": { full: false, scale: 1.19, dx: 2.9424380807853736, dy: 5.188778758173049 },
  // Export book-edits-9 (2026-11-16): three Canva facsimile
  // pictures — pp. 13 and 14 go full-bleed, p. 12 takes a
  // scale-1 shift. Her editor values, verbatim.
  "/book/canva-paintings/p13.jpg": { full: true },
  "/book/canva-paintings/p14.jpg": { full: true },
  "/book/canva-paintings/p12.jpg": { full: false, scale: 1, dx: 0.49999999999999867, dy: 0.36611824675147747 },
  // Export book-edits__1-3 (2026-11-16): the Residuals #5 plate
  // (watercolors/05) is reframed — scaled down to 0.563 and shifted
  // up-left in its frame. Her editor value, verbatim.
  "/watercolors/05/main.jpg": { full: false, scale: 0.563, dx: -1.7063532991926138, dy: -8.404055233704803 },
  // Her direction (2026-11-16): the shop cover of watercolor 1
  // (Breakfast Residuals) becomes a framed photograph (the new
  // main.jpg), but the book's plate of the same work must show the
  // painting itself — a clean scan she sent for the book. The swap
  // is book-only: EdBookImage renders the book file for this plate,
  // while the shop keeps reading main.jpg. The plate's page ground
  // (black, pageBackgrounds.ts) and caption are keyed to the
  // unchanged image_url and stand as they were.
  "/watercolors/01/main.jpg": { src: "/book/residuals/residuals-01-scan.jpg" },
};
