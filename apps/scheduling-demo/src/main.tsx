import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";

import { App } from "./App";
import "./index.css";

// HashRouter keeps every route behind a `#`, so a hard refresh or deep link on
// GitHub Pages never hits the server for a path it doesn't have — no 404s.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
