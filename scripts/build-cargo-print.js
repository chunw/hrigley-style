#!/usr/bin/env node
// Preprocesses each saved Cargo HTML page (strips scripts, fixes paths),
// writes clean versions to public/cargo/, then generates public/cargo-print.html
// as a two-page-spread viewer with same-origin iframes.
//
// Run with: node scripts/build-cargo-print.js

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "fs";
import { resolve, dirname, basename } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT       = resolve(__dirname, "..");
const CARGO_SRC  = resolve(ROOT, "cargo");
const CARGO_OUT  = resolve(ROOT, "public", "cargo");
const OUT        = resolve(ROOT, "public", "cargo-print.html");

// ── Fallback CSS injected into every page ─────────────────────────────────────
// Makes Cargo custom elements display sensibly when JS doesn't run.
const FALLBACK_CSS = `
<style id="cargo-print-fallback">
  /* Show images even without Cargo's JS initialising custom elements */
  media-item               { display: block; }
  media-item img           { display: block; width: 100%; height: auto; }
  column-set               { display: flex; width: 100%; gap: 0; }
  column-unit              { display: block; min-width: 0; }
  gallery-grid             { display: block; }
  gallery-columnized       { display: block; }
  gallery-justify          { display: flex; flex-wrap: wrap; gap: 4px; }
  gallery-justify img      { flex: 1 1 200px; object-fit: cover; }
  gallery-slideshow        { display: block; }
  gallery-freeform         { display: block; }
  /* Ensure backdrop contents are visible (class is already set in saved HTML) */
  .backdrop-contents       { opacity: 1 !important; }
  /* Remove the fixed viewport height so content flows naturally */
  .page                    { min-height: unset !important; }
</style>`;

function processHtml(html, filename) {
  // 1. Strip ALL <script> tags (inline and src).
  //    The Cargo app JS (index.js + inline __PRELOADED_STATE__) resets the DOM.
  html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");

  // 2. Fix the relative CSS link so it resolves from /cargo/ correctly.
  //    The saved href looks like: ./PageName_files/index.css
  //    When served from /cargo/PageName.html the relative path is fine,
  //    but spaces in the filename need URL-encoding.
  html = html.replace(
    /<link([^>]+)href="(\.\/[^"]+_files\/index\.css)"([^>]*)>/gi,
    (match, pre, href, post) => {
      const encoded = href.replace(/ /g, "%20").replace(/—/g, "%E2%80%94");
      return `<link${pre}href="${encoded}"${post}>`;
    }
  );

  // 3. Inject fallback CSS just before </head> (or at start of <body>).
  if (/<\/head>/i.test(html)) {
    html = html.replace(/<\/head>/i, `${FALLBACK_CSS}\n</head>`);
  } else {
    html = html.replace(/<body/i, `${FALLBACK_CSS}\n<body`);
  }

  return html;
}

// ── 1. Process and write each HTML file ──────────────────────────────────────
mkdirSync(CARGO_OUT, { recursive: true });

// Copy _files directories (CSS only — skip JS)
for (const entry of readdirSync(CARGO_SRC, { withFileTypes: true })) {
  if (entry.isDirectory() && entry.name.endsWith("_files")) {
    const srcDir  = resolve(CARGO_SRC, entry.name);
    const outDir  = resolve(CARGO_OUT, entry.name);
    mkdirSync(outDir, { recursive: true });

    for (const f of readdirSync(srcDir)) {
      if (f.endsWith(".js")) continue; // Skip JS entirely
      const src = readFileSync(resolve(srcDir, f));
      writeFileSync(resolve(outDir, f), src);
    }
  }
}

// Process HTML files
// macOS HFS+ uses NFD (decomposed) Unicode; normalize to NFC for comparison.
const htmlFiles = readdirSync(CARGO_SRC)
  .filter(f => f.endsWith(".html"))
  .map(f => f.normalize("NFC"));
for (const fname of htmlFiles) {
  const raw       = readFileSync(resolve(CARGO_SRC, fname), "utf8");
  const processed = processHtml(raw, fname);
  writeFileSync(resolve(CARGO_OUT, fname), processed, "utf8");
  console.log(`  processed: ${fname.slice(0, 60)}`);
}

// ── 2. Book order ─────────────────────────────────────────────────────────────
const PAGES = [
  { file: "Chun Wang - Photography Portfolio.html",                                                label: "Cover" },
  { file: "Table of Content — Chun Wang - Photography Portfolio.html",                             label: "Table of Contents" },
  { file: "El Otro, El Mismo - Cover — Chun Wang - Photography Portfolio.html",                    label: "El Otro, El Mismo — Cover" },
  { file: "El Otro, El Mismo - Intro — Chun Wang - Photography Portfolio.html",                    label: "El Otro, El Mismo — Intro" },
  { file: "El Otro, El Mismo - Doppelganger — Chun Wang - Photography Portfolio.html",             label: "Doppelgänger" },
  { file: "El Otro, El Mismo - Lonely Hour — Chun Wang - Photography Portfolio.html",              label: "In The Lonely Hour" },
  { file: "El Otro, El Mismo - Puppetry — Chun Wang - Photography Portfolio.html",                 label: "Puppetry" },
  { file: "El Otro, El Mismo - Rebirth — Chun Wang - Photography Portfolio.html",                  label: "Rebirth" },
  { file: "El Otro, El Mismo - Being And Time — Chun Wang - Photography Portfolio.html",           label: "Being And Time" },
  { file: "Departures - Cover — Chun Wang - Photography Portfolio.html",                           label: "Departures — Cover" },
  { file: "All The World Is A Stage - Aquí No Hay Soledad — Chun Wang - Photography Portfolio.html", label: "Aquí No Hay Soledad" },
  { file: "All The World Is A Stage - Archive from 5 to 9 — Chun Wang - Photography Portfolio.html",  label: "Archive from 5 to 9" },
  { file: "All The World Is A Stage - Reflection In The Death Valley — Chun Wang - Photography Portfolio.html", label: "Reflection In The Death Valley" },
  { file: "Nostalgia — Chun Wang - Photography Portfolio.html",                                    label: "Nostalgia" },
  { file: "About — Chun Wang - Photography Portfolio.html",                                        label: "About" },
].filter(p => htmlFiles.includes(p.file));

// ── 3. Pair into spreads ──────────────────────────────────────────────────────
const spreads = [];
for (let i = 0; i < PAGES.length; i += 2) {
  spreads.push([PAGES[i], PAGES[i + 1] ?? null]);
}

// ── 4. Generate cargo-print.html ──────────────────────────────────────────────
function slot(page) {
  if (!page) return `<div class="slot slot-empty"></div>`;
  const src = `/cargo/${encodeURIComponent(page.file)}`;
  return `
    <div class="slot">
      <div class="slot-label">${page.label}</div>
      <div class="slot-frame-wrap">
        <iframe src="${src}" title="${page.label}" scrolling="no" onload="fitFrame(this)"></iframe>
      </div>
    </div>`;
}

const spreadsHtml = spreads.map(([l, r]) => `
  <div class="spread">
    ${slot(l)}
    <div class="spine"></div>
    ${slot(r)}
  </div>`).join("\n");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Cargo Print — Chun Wang</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #d8d8d8; font-family: -apple-system, sans-serif; }

    /* ── toolbar ── */
    #toolbar {
      position: sticky; top: 0; z-index: 100;
      background: #fff; border-bottom: 1px solid #ccc;
      padding: 10px 20px; display: flex; align-items: center; gap: 16px;
      font-size: 10px; letter-spacing: .2em; text-transform: uppercase; color: #888;
    }
    #toolbar a { color: #888; text-decoration: none; }
    #toolbar button {
      margin-left: auto; background: #111; color: #fff; border: none;
      padding: 7px 18px; cursor: pointer;
      font-size: 10px; letter-spacing: .2em; text-transform: uppercase;
    }

    /* ── book ── */
    #book { padding: 28px 20px; display: flex; flex-direction: column; gap: 28px; max-width: 1400px; margin: 0 auto; }

    /* ── spread: two pages side by side ── */
    .spread {
      display: flex; position: relative;
      width: 100%; aspect-ratio: 22 / 17;
      background: #fff; box-shadow: 0 2px 16px rgba(0,0,0,.15);
      overflow: hidden;
    }
    .spine {
      position: absolute; left: 50%; top: 0; width: 1px; height: 100%;
      background: rgba(0,0,0,.12); z-index: 10; pointer-events: none;
    }

    /* ── page slot ── */
    .slot { width: 50%; height: 100%; display: flex; flex-direction: column; overflow: hidden; }
    .slot-empty { background: #fafafa; }
    .slot-label {
      flex-shrink: 0; padding: 5px 8px;
      font-size: 9px; letter-spacing: .2em; text-transform: uppercase; color: #bbb;
    }
    .slot-frame-wrap { flex: 1 1 0; position: relative; overflow: hidden; }

    /* iframe sits at natural Cargo size; JS scales it to fill the slot */
    iframe {
      border: none; display: block;
      width: 1338px;   /* Cargo page natural width from saved HTML */
      height: 900px;
      transform-origin: top left;
      transform: scale(0.4); /* overridden by fitFrame() */
      pointer-events: none;
    }

    /* ── print ── */
    @page { size: letter landscape; margin: 0; }
    @media print {
      *, *::before, *::after { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      body { background: #fff; }
      #toolbar { display: none !important; }
      #book { padding: 0; max-width: 100%; gap: 0; }
      .spread {
        box-shadow: none; aspect-ratio: unset;
        width: 100vw; height: 100vh;
        page-break-before: always; break-before: page;
      }
      .spread:first-child { page-break-before: avoid; break-before: avoid; }
      .slot-label { display: none; }
      /* letter landscape = 11in × 8.5in; half-width = 5.5in = ~528px at 96dpi
         Cargo page width = 1338px → scale = 528/1338 ≈ 0.3946 */
      iframe { transform: scale(0.3946) !important; }
    }
  </style>
</head>
<body>
  <div id="toolbar">
    <a href="/photography-catalog">← Catalog</a>
    <span>${PAGES.length} pages · ${spreads.length} spreads</span>
    <button onclick="window.print()">Print / Save as PDF</button>
  </div>
  <div id="book">
    ${spreadsHtml}
  </div>
  <script>
    function fitFrame(iframe) {
      const wrap = iframe.parentElement;
      const scaleX = wrap.clientWidth  / 1338;
      const scaleY = wrap.clientHeight / 900;
      iframe.style.transform = \`scale(\${Math.min(scaleX, scaleY)})\`;
    }
    window.addEventListener("resize", () => {
      document.querySelectorAll("iframe").forEach(fitFrame);
    });
  </script>
</body>
</html>`;

writeFileSync(OUT, html, "utf8");
console.log(`\nWrote ${OUT}`);
console.log(`${PAGES.length} pages → ${spreads.length} spreads`);
