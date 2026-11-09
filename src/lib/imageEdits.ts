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
};
