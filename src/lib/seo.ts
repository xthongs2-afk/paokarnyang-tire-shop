import { useEffect } from "react";

export const SITE_URL = "https://paokarnyang-tire-shop.vercel.app";
export const SITE_NAME = "เป้าการยาง";
export const DEFAULT_IMAGE = `${SITE_URL}/hero-tire-violet-1280.webp`;

type SeoOptions = {
  title: string;
  description: string;
  /** Path of the page, e.g. "/tires". Omit on pages that must not be indexed. */
  path?: string;
  image?: string;
  noindex?: boolean;
  /** Page-specific structured data, written as JSON-LD script tags in <head>. */
  jsonLd?: object[];
};

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

/** Replaces the page-specific JSON-LD blocks (the prerendered ones carry the same marker). */
function setJsonLd(blocks: string) {
  document.head.querySelectorAll("script[data-page-ld]").forEach(el => el.remove());
  for (const block of JSON.parse(blocks) as object[]) {
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.dataset.pageLd = "";
    el.textContent = JSON.stringify(block);
    document.head.appendChild(el);
  }
}

function setCanonical(href: string | null) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!href) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
}

export type ResolvedSeo = Required<Pick<SeoOptions, "title" | "description" | "image" | "noindex" | "jsonLd">> & { url: string | null };

export function resolveSeo({ title, description, path, image = DEFAULT_IMAGE, noindex = false, jsonLd = [] }: SeoOptions): ResolvedSeo {
  return { title, description, image, noindex, jsonLd, url: !noindex && path ? `${SITE_URL}${path}` : null };
}

// During the build-time prerender there is no document: the page's meta is recorded here
// for scripts/prerender.mjs to write into the static HTML.
let ssrSeo: ResolvedSeo | null = null;
export function takeSsrSeo() {
  const value = ssrSeo;
  ssrSeo = null;
  return value;
}

/** Sets title, description, canonical, robots and Open Graph tags for the current page. */
export function useSeo(options: SeoOptions) {
  if (typeof document === "undefined") ssrSeo = resolveSeo(options);
  const { title, description, path, image = DEFAULT_IMAGE, noindex = false } = options;
  // Serialised so a new array literal on every render does not re-run the effect.
  const jsonLd = JSON.stringify(options.jsonLd ?? []);
  useEffect(() => {
    const url = resolveSeo({ title, description, path, image, noindex }).url;
    document.title = title;
    setMeta("name", "description", description);
    setMeta("name", "robots", noindex ? "noindex, follow" : "index, follow");
    setCanonical(noindex ? null : url);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:image", image);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:locale", "th_TH");
    if (url) setMeta("property", "og:url", url);
    setMeta("name", "twitter:card", "summary_large_image");
    setJsonLd(jsonLd);
  }, [title, description, path, image, noindex, jsonLd]);
}
