import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SITE_NAME, DEFAULT_OG_IMAGE, absoluteUrl } from "@/lib/seo";

interface SEOOptions {
  /** Page-specific title. "Chun Wang Studio Shop" is appended unless already present. */
  title: string;
  description: string;
  /** Root-relative path or absolute URL. Defaults to the current route. */
  image?: string;
  /** og:type. Defaults to "website"; use "product" on product/artwork pages. */
  type?: string;
  /** Keep search engines from indexing this page (hidden/internal pages). */
  noindex?: boolean;
  /** JSON-LD payload to embed as a <script type="application/ld+json"> tag. */
  structuredData?: Record<string, unknown>;
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function upsertJsonLd(data: Record<string, unknown>) {
  let el = document.querySelector('script[data-seo="jsonld"]') as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.setAttribute("data-seo", "jsonld");
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function useSEO({ title, description, image, type = "website", noindex = false, structuredData }: SEOOptions) {
  const location = useLocation();

  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");

    const canonicalUrl = absoluteUrl(location.pathname);
    upsertLink("canonical", canonicalUrl);

    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:site_name", SITE_NAME);

    const ogImage = image ? absoluteUrl(image) : DEFAULT_OG_IMAGE;
    upsertMeta("property", "og:image", ogImage);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", ogImage);

    const jsonLdEl = document.querySelector('script[data-seo="jsonld"]');
    if (structuredData) {
      upsertJsonLd(structuredData);
    } else if (jsonLdEl) {
      jsonLdEl.remove();
    }
  }, [title, description, image, type, noindex, structuredData, location.pathname]);
}
