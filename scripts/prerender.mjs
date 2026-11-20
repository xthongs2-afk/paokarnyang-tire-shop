// Writes one static HTML file per route after `vite build`, so crawlers get the real
// content, H1 and per-page meta without running JavaScript. Run by `npm run build`.
// Output naming matches vercel.json `cleanUrls`: /tires -> dist/tires.html.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");
const { render, routes } = await import(pathToFileURL(path.join(root, "dist-server", "entry-server.js")).href);
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");

const escapeAttr = value => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const escapeText = value => value.replace(/&/g, "&amp;").replace(/</g, "&lt;");

function setTag(html, pattern, replacement) {
  if (!pattern.test(html)) throw new Error(`prerender: tag not found in index.html: ${pattern}`);
  return html.replace(pattern, replacement);
}

for (const route of routes) {
  const { html: body, seo } = render(route);
  if (!seo) throw new Error(`prerender: page at ${route} did not call useSeo`);
  let html = template.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  html = setTag(html, /<title>[^<]*<\/title>/, `<title>${escapeText(seo.title)}</title>`);
  html = setTag(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeAttr(seo.description)}" />`);
  html = setTag(html, /<meta name="robots" content="[^"]*" \/>/, `<meta name="robots" content="${seo.noindex ? "noindex, follow" : "index, follow"}" />`);
  html = setTag(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${escapeAttr(seo.title)}" />`);
  html = setTag(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${escapeAttr(seo.description)}" />`);
  html = setTag(html, /<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${escapeAttr(seo.image)}" />`);
  if (seo.url) {
    html = setTag(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${seo.url}" />`);
    html = setTag(html, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${seo.url}" />`);
  } else {
    html = setTag(html, /\s*<link rel="canonical" href="[^"]*" \/>/, "");
    html = setTag(html, /\s*<meta property="og:url" content="[^"]*" \/>/, "");
  }
  const ld = seo.jsonLd.map(block => `<script type="application/ld+json" data-page-ld>${JSON.stringify(block).replace(/</g, "\\u003c")}</script>`).join("");
  html = setTag(html, /<\/head>/, `${ld}</head>`);
  const file = route === "/" ? "index.html" : `${route.slice(1)}.html`;
  fs.mkdirSync(path.dirname(path.join(dist, file)), { recursive: true });
  fs.writeFileSync(path.join(dist, file), html);
  console.log(`prerendered ${route} -> dist/${file}`);
}
fs.rmSync(path.join(root, "dist-server"), { recursive: true, force: true });
