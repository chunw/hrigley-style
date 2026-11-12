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
  "/watercolors/14/main.jpg": { full: false, scale: 1.343, dx: -7.2721581120530026, dy: 2.9039708327036458 },
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
  "/book/road/road-castle-cake.jpg": { full: true, pos: { x: 50, y: 4.2 } },
};
