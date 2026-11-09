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
  // Export #11 (2026-11-08): this Canva facsimile page goes full
  // bleed, its crop window dragged to the right (object-position
  // 85.7% / 50%).
  "/book/canva-paintings/p10.jpg": { full: true, scale: 1, dx: 0.10201373453206383, dy: 0, pos: { x: 85.7, y: 50 } },
};
