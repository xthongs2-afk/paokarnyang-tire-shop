// Build-time prerender entry: rendered once per route by scripts/prerender.mjs.
import { renderToString } from "react-dom/server";
import App from "./App";
import { takeSsrSeo } from "./lib/seo";
import { staticCatalog } from "./shared/commerce/staticCatalog";

export const routes = ["/", "/tires", "/services", "/contact", ...staticCatalog.map(p => `/tires/${p.handle}`), "/404"];

export function render(path: string) {
  const html = renderToString(<App ssrPath={path} />);
  return { html, seo: takeSsrSeo() };
}
