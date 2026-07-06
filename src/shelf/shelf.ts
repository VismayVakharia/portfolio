import "../styles/main.css";

import { initTheme, initFavicon } from "../scripts/theme";
import { initHeader } from "../components/header/header";
import { initFooter } from "../components/footer/footer";
import { initBooks } from "../scripts/books";
import { initVideoGames } from "../scripts/video-games";
import { initBoardGames } from "../scripts/board-games";

window.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initFavicon();
  initHeader();
  initBooks();
  initVideoGames();
  initBoardGames();
  initFooter();
});
