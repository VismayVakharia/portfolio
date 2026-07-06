import "../styles/main.css";

import darkFaviconURL from "../dark-favicon.png?url";
import { initTheme } from "../scripts/theme";
import { initHeader } from "../components/header/header";
import { initFooter } from "../components/footer/footer";
import { initPuzzles } from "../scripts/puzzles";

window.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initFavicon();
  initHeader();
  initPuzzles();
  initFooter();
});

function initFavicon(): void {
  const linkFavicon = document.getElementById("favicon") as HTMLLinkElement;
  linkFavicon.href = darkFaviconURL;
}
