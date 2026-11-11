#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Remains — press-ready CMYK print PDF pipeline
#
# Produces the print file for the book (kept distinct from the on-page RGB
# "Download PDF" proof): 275 pages, 8.5x11in Letter, CMYK, fonts embedded,
# PDF/X-4 with an embedded output intent. NO bleed (this edition's press
# spec is no-bleed Letter; the printer adds blanks). TrimBox = MediaBox.
#
# Steps
#   1. vite build + preview of the current tree.
#   2. Render /catalogs/book?lang=en to an RGB PDF with headless Chromium
#      (scripts/print-pdf/render_book_pdf.py — chunked rendering, see its
#      header for why; asserts exactly 275 pages).
#   3. Convert RGB -> CMYK with scripts/print-pdf/convert_cmyk.py
#      (pikepdf + lcms via Pillow). It rewrites ONLY colour operators and
#      image data — fonts, text and page structure are untouched, so text
#      stays vector and extractable.
#        - ICC: $PRINT_ICC_PROFILE, else GRACoL2013_CRPC6.icc, else
#          CoatedGRACoL2006.icc (bundled in scripts/print-pdf/, from
#          Adobe's official ICC bundle). GRACoL2013 (CRPC6) is the US
#          commercial-printing default and the preferred target; to use
#          it, drop the file into scripts/print-pdf/ — nothing else
#          changes. If the printer supplies their own profile, point
#          PRINT_ICC_PROFILE at it.
#        - Vector colours: sRGB -> ICC, relative colorimetric.
#          Achromatic colours -> K-only (body text prints on one plate);
#          large-area pure-black fills (page grounds) -> the profile's
#          rich black (GRACoL2006: C88 M79 Y74 K99, 340% total ink).
#        - Images: converted via their embedded profile -> ICC,
#          perceptual; DCT images re-encode as JPEG q90 4:2:0 with
#          samples stored as true ink values (see converter header).
#      Why not Ghostscript pdfwrite: measured on this book, GS 10.07's
#      PDF interpreter drops text set in Chromium's Type 3 subset fonts
#      (an essay page went from 367 extractable chars to 12) and its
#      -dBlackVector forcing turns the rust chapter grounds K-only
#      black. The pikepdf route loses nothing: per-page extracted text
#      is byte-identical before/after (149,197 chars over 275 pages).
#   4. Verify: pdfinfo page count/size, pdffonts (every font embedded),
#      OutputIntent present, extracted-text total matches the RGB source.
#
# Prerequisites: node/npm, python3 with playwright (+ chromium), pikepdf
# and Pillow, poppler-utils (pdfinfo / pdffonts / pdftotext).
#
# Usage:  scripts/make-print-pdf.sh [output.pdf]
#         PRINT_ICC_PROFILE=/path/to/profile.icc scripts/make-print-pdf.sh
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORK="${PRINT_WORK_DIR:-$REPO_ROOT/.print-work}"
OUT="${1:-$REPO_ROOT/Remains-print.pdf}"
PORT="${PRINT_PORT:-4319}"
mkdir -p "$WORK"

# ── ICC profile ──────────────────────────────────────────────────────────────
find_icc() {
  if [[ -n "${PRINT_ICC_PROFILE:-}" ]]; then echo "$PRINT_ICC_PROFILE"; return; fi
  local name dir
  for name in GRACoL2013_CRPC6.icc CoatedGRACoL2006.icc; do
    for dir in "$REPO_ROOT/scripts/print-pdf" /usr/share/color/icc "$HOME/.color/icc"; do
      [[ -f "$dir/$name" ]] && { echo "$dir/$name"; return; }
    done
  done
  return 1
}
ICC="$(find_icc)" || { echo "ERROR: no GRACoL ICC profile found (set PRINT_ICC_PROFILE)"; exit 1; }
case "$(basename "$ICC")" in
  GRACoL2013*) export PRINT_ICC_CONDITION="GRACoL 2013 (CRPC6) - commercial printing, coated"
               export PRINT_ICC_IDENT="GRACoL2013_CRPC6"
               export PRINT_ICC_INFO="GRACoL2013_CRPC6.icc - GRACoL 2013 reference print condition (CGATS.21-2 CRPC6)";;
  *)           export PRINT_ICC_CONDITION="GRACoL 2006 - commercial printing, coated"
               export PRINT_ICC_IDENT="CoatedGRACoL2006"
               export PRINT_ICC_INFO="CoatedGRACoL2006.icc - GRACoL 2006 reference print condition, ISO 12647-2:2004";;
esac
echo "ICC profile: $ICC ($PRINT_ICC_IDENT)"

# ── 1. Build + preview ───────────────────────────────────────────────────────
(cd "$REPO_ROOT" && npx vite build)
(cd "$REPO_ROOT" && npx vite preview --port "$PORT" --host 127.0.0.1 >"$WORK/preview.log" 2>&1) &
PREVIEW_PID=$!
trap 'kill $PREVIEW_PID 2>/dev/null || true' EXIT
for _ in $(seq 1 30); do
  curl -sf -o /dev/null "http://127.0.0.1:$PORT/catalogs/book" && break
  sleep 1
done

# ── 2. Render RGB PDF (chunked) ──────────────────────────────────────────────
python3 "$REPO_ROOT/scripts/print-pdf/render_book_pdf.py" \
  "http://127.0.0.1:$PORT" "$WORK/book-rgb.pdf"
kill $PREVIEW_PID 2>/dev/null || true
trap - EXIT

# ── 3. CMYK conversion (PDF/X-4) ─────────────────────────────────────────────
python3 "$REPO_ROOT/scripts/print-pdf/convert_cmyk.py" \
  "$WORK/book-rgb.pdf" "$OUT" "$ICC"

# ── 4. Verify ────────────────────────────────────────────────────────────────
echo "── Verification ──────────────────────────────────────────────"
pdfinfo "$OUT" | egrep 'Pages|Page size|PDF version' || true
NOTEMB="$(pdffonts "$OUT" | tail -n +3 | grep -vc 'yes yes yes' || true)"
echo "Font rows not fully embedded: $NOTEMB (of $(pdffonts "$OUT" | tail -n +3 | wc -l))"
SRC_CHARS="$(pdftotext "$WORK/book-rgb.pdf" - 2>/dev/null | tr -d '[:space:]' | wc -m)"
OUT_CHARS="$(pdftotext "$OUT" - 2>/dev/null | tr -d '[:space:]' | wc -m)"
echo "Extracted text chars: RGB source $SRC_CHARS -> print PDF $OUT_CHARS"
python3 - "$OUT" <<'PYEOF'
import sys
import pikepdf
pdf = pikepdf.open(sys.argv[1])
intents = pdf.Root.get("/OutputIntents")
assert intents, "no OutputIntent!"
oi = intents[0]
print("OutputIntent:", oi.get("/OutputConditionIdentifier"),
      "| profile bytes:", len(oi.DestOutputProfile.read_bytes()))
print("GTS_PDFXVersion:", pdf.docinfo.get("/GTS_PDFXVersion"))
tb = sum(1 for p in pdf.pages if "/TrimBox" in p)
print(f"TrimBox present on {tb}/{len(pdf.pages)} pages")
PYEOF
echo "Done: $OUT"
