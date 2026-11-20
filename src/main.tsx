import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Pages are prerendered at build time (scripts/prerender.mjs); hydrate them instead of re-rendering.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
