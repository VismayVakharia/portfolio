import boardGames from "../data/board-games.json";
import boardGameRowHTML from "../components/board-game-row.html?raw";

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

function stars(rating: number): string {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

export function initBoardGames(): void {
  const section = document.getElementById("board-games");
  if (!section) return;

  const games = boardGames as BoardGame[];
  const played = games.filter((g) => g.status === "offline" || g.status === "both");
  const playedOnline = games.filter((g) => g.status === "online" || g.status === "both");
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

  if (played.length > 0) groups.appendChild(renderGroup("Played", played.map(createBoardGameRow)));
  if (playedOnline.length > 0) groups.appendChild(renderGroup("Played Online", playedOnline.map(createBoardGameRow)));
  if (wishlist.length > 0) groups.appendChild(renderGroup("Wishlist", wishlist.map(createBoardGameRow)));
}

function renderGroup(label: string, rows: HTMLElement[]): HTMLDivElement {
  const wrap = document.createElement("div");
  const heading = document.createElement("h3");
  heading.className = "text-foreground-muted mb-4 text-xs font-bold uppercase tracking-widest";
  heading.textContent = label;
  const list = document.createElement("div");
  list.className = "space-y-6";
  rows.forEach((row) => list.appendChild(row));
  wrap.appendChild(heading);
  wrap.appendChild(list);
  return wrap;
}

function createBoardGameRow(game: BoardGame): HTMLDivElement {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = boardGameRowHTML;

  wrapper.querySelector(".title")!.textContent = game.title;

  const cover = wrapper.querySelector("img.cover");
  if (game.imageUrl) {
    cover?.setAttribute("src", game.imageUrl);
    cover?.setAttribute("alt", game.title);
  } else {
    cover?.remove();
  }

  const subtitleParts = [game.genre, game.players ? `${game.players} players` : undefined].filter(Boolean);
  const subtitle = wrapper.querySelector(".subtitle");
  if (subtitleParts.length > 0) subtitle!.textContent = subtitleParts.join(" · ");
  else subtitle?.remove();

  const notes = wrapper.querySelector(".notes");
  if (game.notes) notes!.textContent = game.notes;
  else notes?.remove();

  const bggLink = wrapper.querySelector("a.bgg-link");
  if (game.bggUrl) bggLink?.setAttribute("href", game.bggUrl);
  else bggLink?.remove();

  const rating = wrapper.querySelector(".rating");
  if (game.status !== "wishlist" && game.rating != null) rating!.textContent = stars(game.rating);
  else rating?.remove();

  return wrapper;
}
