// Book editor → PR bridge.
// POST { textEdits: { [editId]: newText }, pageBg: { [pageKey]: kind } }
// Applies the edits to the source files on a fresh branch and opens a PR.
// Requires env GITHUB_TOKEN (fine-grained, this repo: Contents + Pull requests RW).
// Edit ids (see CatalogBook.tsx): tx:<arrayField>:<index> | tx:watercolorNote:<lang> |
// tx:heroDesc:<lang> | field:<chapterKey>:<lang> | series:<seriesId>:<lang>

export const config = { maxDuration: 60 };

const OWNER = "chunw";
const REPO = "hrigley-style";
const API = "https://api.github.com";

const META_FILES = {
  spirit: { path: "src/lib/21spirit.ts", en: "description", zh: "descriptionZh" },
  photography: { path: "src/lib/photography.ts", en: "description", zh: "descriptionZh" },
  watercolor: { path: "src/lib/watercolors.ts", en: "descriptionHtml", zh: "descriptionHtmlZh" },
};
const ARRAY_FIELDS = ["prefaceBody", "paintingIntroBody", "remainsEssayBody", "elOtroEssayBody"];

async function gh(token, method, url, body) {
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`GitHub ${method} ${url.split("/").slice(-2).join("/")} → ${res.status} ${data.message || ""}`);
  return data;
}

// ── String surgery helpers ──────────────────────────────────────────────────

function findLiteralEnd(s, start) {
  const q = s[start];
  for (let i = start + 1; i < s.length; i++) {
    if (s[i] === "\\") i++;
    else if (s[i] === q) return i;
  }
  throw new Error("unterminated literal");
}

/** Replace the idx-th top-level string element in every `<field>: [ ... ]` block. */
function replaceArrayElement(content, field, idx, newText) {
  let replaced = 0;
  let searchFrom = 0;
  for (;;) {
    const at = content.indexOf(`${field}: [`, searchFrom);
    if (at < 0) break;
    let i = content.indexOf("[", at);
    const blockStart = i;
    let depth = 0;
    let blockEnd = -1;
    const elements = [];
    for (; i < content.length; i++) {
      const ch = content[i];
      if (ch === '"' || ch === "'" || ch === "`") {
        const end = findLiteralEnd(content, i);
        if (depth === 1) elements.push([i, end]);
        i = end;
      } else if (ch === "[") depth++;
      else if (ch === "]") {
        depth--;
        if (depth === 0) {
          blockEnd = i;
          break;
        }
      }
    }
    if (blockEnd < 0 || idx >= elements.length) throw new Error(`${field}[${idx}] not found`);
    const [s0, s1] = elements[idx];
    content = content.slice(0, s0) + JSON.stringify(newText) + content.slice(s1 + 1);
    replaced++;
    searchFrom = blockStart + 1;
  }
  if (replaced === 0) throw new Error(`${field} block not found`);
  return content;
}

function nthIndexOf(s, needle, n) {
  let i = -1;
  for (let k = 0; k <= n; k++) {
    i = s.indexOf(needle, i + 1);
    if (i < 0) return -1;
  }
  return i;
}

/** Replace the string literal of `key:` inside the nth block starting with blockNeedle. */
function replaceBlockScalar(content, blockNeedle, blockIdx, key, newText) {
  const blockAt = nthIndexOf(content, blockNeedle, blockIdx);
  if (blockAt < 0) throw new Error(`block ${blockNeedle} #${blockIdx} not found`);
  const keyAt = content.indexOf(`${key}:`, blockAt);
  if (keyAt < 0) throw new Error(`${key} not found in block`);
  let i = keyAt + key.length + 1;
  while (content[i] === " ") i++;
  const end = findLiteralEnd(content, i);
  return content.slice(0, i) + JSON.stringify(newText) + content.slice(end + 1);
}

/** Replace a field inside `catalogMeta` (template literal or quoted string). */
function replaceMetaField(content, field, newText) {
  const metaAt = content.indexOf("catalogMeta");
  if (metaAt < 0) throw new Error("catalogMeta not found");
  const keyAt = content.indexOf(`${field}:`, metaAt);
  if (keyAt < 0) throw new Error(`${field} not found in catalogMeta`);
  let i = keyAt + field.length + 1;
  while (content[i] === " ") i++;
  const end = findLiteralEnd(content, i);
  if (content[i] === "`") {
    const escaped = newText.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
    return content.slice(0, i + 1) + escaped + content.slice(end);
  }
  return content.slice(0, i) + JSON.stringify(newText) + content.slice(end + 1);
}

function renderPageBackgrounds(pageBg) {
  const keys = Object.keys(pageBg).sort();
  const lines = keys.map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(pageBg[k])},`).join("\n");
  return `export type PageBgKind = "white" | "cream" | "black" | "pink";

/**
 * Per-page paper overrides for the book, keyed by stable page key
 * (see pageKeyOf in CatalogBook.tsx: "preface:0", "essay:photography:1",
 * "plate:41", "divider:remains", "opener:spirit:left", ...).
 * Pages not listed follow the toolbar paper choice.
 * Written by the book editor's 生成PR flow (api/book-pr.js); edit by hand if needed.
 */
export const PAGE_BACKGROUNDS: Record<string, PageBgKind> = {
${lines}
};
`;
}

// ── Handler ─────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method-not-allowed" });
  const token = process.env.GITHUB_TOKEN;
  if (!token) return res.status(501).json({ error: "not-configured: GITHUB_TOKEN is not set in Vercel" });

  const { textEdits = {}, pageBg = null } = req.body || {};
  const editIds = Object.keys(textEdits);
  if (editIds.length === 0 && !pageBg) return res.status(400).json({ error: "nothing-to-do" });

  try {
    // Route edits to files.
    const byFile = new Map(); // path -> [{id, newText, apply(content)}]
    const add = (path, entry) => {
      if (!byFile.has(path)) byFile.set(path, []);
      byFile.get(path).push(entry);
    };
    for (const id of editIds) {
      const newText = String(textEdits[id]);
      let m;
      if ((m = id.match(/^tx:(prefaceBody|paintingIntroBody|remainsEssayBody|elOtroEssayBody):(\d+)$/))) {
        const [, field, idx] = m;
        add("src/lib/translations.ts", { id, apply: (c) => replaceArrayElement(c, field, Number(idx), newText) });
      } else if ((m = id.match(/^tx:watercolorNote:(en|zh)$/))) {
        add("src/lib/translations.ts", {
          id,
          apply: (c) => replaceBlockScalar(c, "watercolorCatalog: {", m[1] === "en" ? 0 : 1, "noteText", newText),
        });
      } else if ((m = id.match(/^tx:heroDesc:(en|zh)$/))) {
        add("src/lib/translations.ts", {
          id,
          apply: (c) => replaceBlockScalar(c, "hero: {", m[1] === "en" ? 0 : 1, "description", newText),
        });
      } else if ((m = id.match(/^series:([a-z]+):(en|zh)$/))) {
        add("src/lib/bookSeries.ts", {
          id,
          apply: (c) => replaceBlockScalar(c, `id: "${m[1]}"`, 0, m[2] === "en" ? "textEn" : "textZh", newText),
        });
      } else if ((m = id.match(/^field:(spirit|photography|watercolor):(en|zh)$/))) {
        const meta = META_FILES[m[1]];
        const field = m[2] === "en" ? meta.en : meta.zh;
        add(meta.path, { id, apply: (c) => replaceMetaField(c, field, newText) });
      } else {
        return res.status(422).json({ error: "apply-failed", failures: [`${id}: unknown edit id`] });
      }
    }

    // Fetch + apply in memory first: nothing is written unless everything applies.
    const changed = new Map(); // path -> newContent
    const failures = [];
    for (const [path, entries] of byFile) {
      const file = await gh(token, "GET", `${API}/repos/${OWNER}/${REPO}/contents/${path}?ref=main`);
      let content = Buffer.from(file.content, "base64").toString("utf8");
      for (const e of entries) {
        try {
          content = e.apply(content);
        } catch (err) {
          failures.push(`${e.id}: ${err.message}`);
        }
      }
      changed.set(path, content);
    }
    if (failures.length > 0) return res.status(422).json({ error: "apply-failed", failures });
    if (pageBg) changed.set("src/lib/pageBackgrounds.ts", renderPageBackgrounds(pageBg));

    // Branch, commit, PR.
    const stamp = new Date().toISOString().replace(/[:.]/g, "-").replace("T", "-").slice(0, 19);
    const branch = `book-edits-${stamp}`;
    const mainRef = await gh(token, "GET", `${API}/repos/${OWNER}/${REPO}/git/ref/heads/main`);
    await gh(token, "POST", `${API}/repos/${OWNER}/${REPO}/git/refs`, { ref: `refs/heads/${branch}`, sha: mainRef.object.sha });
    for (const [path, content] of changed) {
      const cur = await gh(token, "GET", `${API}/repos/${OWNER}/${REPO}/contents/${path}?ref=${branch}`);
      await gh(token, "PUT", `${API}/repos/${OWNER}/${REPO}/contents/${path}`, {
        message: `Book editor: update ${path}`,
        content: Buffer.from(content, "utf8").toString("base64"),
        sha: cur.sha,
        branch,
      });
    }
    const preview = `https://hrigley-style-git-${branch}-chunws-projects.vercel.app/catalogs/book?lang=en`;
    const pr = await gh(token, "POST", `${API}/repos/${OWNER}/${REPO}/pulls`, {
      title: "Book edits from the web editor",
      head: branch,
      base: "main",
      body: `Text edits: ${editIds.length} (${editIds.slice(0, 12).join(", ")}${editIds.length > 12 ? ", …" : ""}).\nPage backgrounds: ${pageBg ? Object.keys(pageBg).length : 0} page(s) set.\n\nPreview: ${preview}\n\nMade from the book page's edit mode (double-click text, per-page background swatches).`,
    });
    return res.status(200).json({ url: pr.html_url, branch });
  } catch (err) {
    return res.status(500).json({ error: String(err && err.message ? err.message : err) });
  }
}
