import { useEffect } from "react";
import { SHOP_URL, SITE_NAME } from "@/lib/constants";

const DEFAULT_OG_IMAGE = "/og-image.jpg";

interface PageMetaOptions {
  /** Page-specific title. Rendered as "Chun Wang Studio Shop — {title}". */
  title: string;
  /** Plain-text description (HTML tags are stripped automatically). */
  description?: string;
  /** Absolute or root-relative image URL for og:image. */
  image?: string;
  /** Route path, e.g. "/watercolors/44". Used to build canonical + og:url. */
  path: string;
  type?: "website" | "article" | "product" | "og:image";
  /** One or more JSON-LD objects to embed as <script type="application/ld+json">. */
  jsonLd?: object | object[];
  /** Keep this page out of search indexes (internal tools, hidden/unlisted catalogs, 404s). */
  noindex?: boolean;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + "…";
}

function resolveUrl(pathOrUrl: string): string {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return `${SHOP_URL.replace(/\/$/, "")}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Sets per-page <title>, meta description, canonical link, OG tags, and
 * (optionally) JSON-LD structured data. Needed because this is a client-only
 * SPA with a single static index.html — without this every route shares the
 * same generic title/description.
 */
export function usePageMeta({ title, description, image, path, type = "website", jsonLd, noindex = false }: PageMetaOptions) {
  useEffect(() => {
    document.title = `${SITE_NAME} — ${title}`;

    const cleanDescription = description ? truncate(stripHtml(description), 160) : undefined;
    if (cleanDescription) upsertMeta("name", "description", cleanDescription);
    upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");

    const url = resolveUrl(path);
    upsertMeta("property", "og:title", `${SITE_NAME} — ${title}`);
    if (cleanDescription) upsertMeta("property", "og:description", cleanDescription);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", resolveUrl(image || DEFAULT_OG_IMAGE));
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertLink("canonical", url);

    let script: HTMLScriptElement | null = null;
    if (jsonLd) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      script?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, image, path, type, JSON.stringify(jsonLd), noindex]);
}
