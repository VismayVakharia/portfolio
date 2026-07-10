import boardGames from "../data/board-games.json";
import boardGameCardHTML from "../components/board-game-card.html?raw";

import { renderGroup } from "./dom-utils";

const GRID = "grid grid-cols-2 gap-3 sm:grid-cols-3";

type BoardGameStatus = "offline" | "online" | "both" | "wishlist";

type BoardGame = {
  title: string;
  status: BoardGameStatus;
  players?: string;
  rating?: number;
  genre?: string;
  notes?: string;
  bggUrl?: string;
  imageUrl?: string;
};

export function initBoardGames(): void {
  const section = document.getElementById("board-games");
  if (!section) return;

  const games = boardGames as BoardGame[];
  // Online vs offline isn't a meaningful split — everything not on the wishlist is just "played".
  const played = games.filter((g) => g.status !== "wishlist");
  const wishlist = games.filter((g) => g.status === "wishlist");

  section.innerHTML = `
    <h2 class="section-title text-2xl font-bold mb-10">Board Games</h2>
    <div id="board-games-groups" class="space-y-12"></div>
  `;

  const groups = document.getElementById("board-games-groups")!;

  if (games.length === 0) {
    groups.innerHTML = `<p class="text-foreground-muted text-sm">Nothing here yet.</p>`;
    return;
  }

  if (played.length > 0) {
    // Single group — no redundant subheading, so render the grid directly.
    const grid = document.createElement("div");
    grid.className = GRID;
    played.map(createBoardGameCard).forEach((card) => grid.appendChild(card));
    groups.appendChild(grid);
  }
  if (wishlist.length > 0) groups.appendChild(renderGroup("Wishlist", wishlist.map(createBoardGameCard), GRID));
}

function createBoardGameCard(game: BoardGame, index: number): HTMLDivElement {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = boardGameCardHTML;
  const card = wrapper.firstElementChild as HTMLDivElement;

  // Same muted book-spine palette as the floppies, cycled per card.
  card.style.setProperty("--card-bg", `var(--color-spine-${(index % 6) + 1})`);

  card.querySelector(".title")!.textContent = game.title;

  const cover = card.querySelector("img.card-cover");
  if (game.imageUrl) {
    cover?.setAttribute("src", game.imageUrl);
    cover?.setAttribute("alt", game.title);
  } else {
    cover?.remove();
  }

  const players = card.querySelector(".players");
  if (game.players) card.querySelector(".players-count")!.textContent = game.players;
  else players?.remove();

  const genre = card.querySelector(".genre");
  if (game.genre) genre!.textContent = game.genre;
  else genre?.remove();

  const bggLink = card.querySelector("a.bgg-link");
  if (game.bggUrl) bggLink?.setAttribute("href", game.bggUrl);
  else bggLink?.remove();

  return card;
}
