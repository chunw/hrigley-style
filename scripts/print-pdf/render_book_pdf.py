#!/usr/bin/env python3
"""Render /catalogs/book to a full-size RGB PDF with headless Chromium.

Why chunked: Chromium's printToPDF silently shrinks the output (content at
2/3 size, top-left) when the document is very tall — the book is 275 sheets
(~290,000 CSS px). Printing in chunks of sheets and merging the chunks with
pikepdf avoids the shrink. Each chunk also gains one spurious trailing
blank page (verified pure-white); the merge drops it.

Usage: render_book_pdf.py <preview_base_url> <out_pdf> [chunk_size]
Requires: playwright (chromium), pikepdf.
"""
import asyncio
import sys

import pikepdf
from playwright.async_api import async_playwright

URL_PATH = "/catalogs/book?lang=en"
EXPECTED_PAGES = 275


async def render_chunk(browser, base, start, end, out_path):
    page = await browser.new_page(viewport={"width": 1400, "height": 1000})
    await page.emulate_media(media="print")
    await page.goto(base + URL_PATH, wait_until="networkidle", timeout=180000)
    await page.evaluate("() => document.fonts.ready.then(() => true)")
    for _ in range(90):
        pending = await page.evaluate(
            "() => Array.from(document.images).filter(i => !i.complete).length"
        )
        if pending == 0:
            break
        await page.wait_for_timeout(2000)
    await page.evaluate(
        """([a, b]) => {
            document.querySelectorAll('.bk-sheet').forEach((s, i) => {
                if (i < a || i >= b) s.style.display = 'none';
            });
        }""",
        [start, end],
    )
    await page.wait_for_timeout(600)
    await page.pdf(path=out_path, prefer_css_page_size=True, print_background=True)
    await page.close()


async def main():
    base = sys.argv[1].rstrip("/")
    out_pdf = sys.argv[2]
    chunk_size = int(sys.argv[3]) if len(sys.argv) > 3 else 46
    import os
    import tempfile

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1400, "height": 1000})
        await page.emulate_media(media="print")
        await page.goto(base + URL_PATH, wait_until="networkidle", timeout=180000)
        total = await page.evaluate(
            "() => document.querySelectorAll('.bk-sheet').length"
        )
        await page.close()
        print(f"sheets: {total}", flush=True)

        tmpdir = tempfile.mkdtemp(prefix="book-chunks-")
        chunk_files = []
        starts = list(range(0, total, chunk_size))
        for ci, start in enumerate(starts):
            end = min(total, start + chunk_size)
            path = os.path.join(tmpdir, f"chunk-{ci:02d}.pdf")
            await render_chunk(browser, base, start, end, path)
            chunk_files.append(path)
            print(f"chunk {ci}: sheets {start}-{end - 1} -> {path}", flush=True)
        await browser.close()

    merged = pikepdf.new()
    for ci, path in enumerate(chunk_files):
        src = pikepdf.open(path)
        pages = list(src.pages)
        if ci < len(chunk_files) - 1:
            pages = pages[:-1]  # drop the spurious trailing blank page
        merged.pages.extend(pages)
    total_pages = len(merged.pages)
    print(f"merged pages: {total_pages}")
    if total_pages != EXPECTED_PAGES:
        raise SystemExit(
            f"ERROR: expected {EXPECTED_PAGES} pages, got {total_pages} — refusing to write output"
        )
    merged.save(out_pdf)
    print(f"wrote {out_pdf}")


if __name__ == "__main__":
    asyncio.run(main())
