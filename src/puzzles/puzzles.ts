import "../styles/main.css";

import { initTheme, initFavicon } from "../scripts/theme";
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
