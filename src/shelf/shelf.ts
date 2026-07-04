import "../styles/main.css";

import darkFaviconURL from "../dark-favicon.png?url";
import { initTheme } from "../scripts/theme";
import { initHeader } from "../components/header/header";
import { initFooter } from "../components/footer/footer";
import manualBooks from "../data/books.json";
import jeluBooks from "../data/jelu-books.json";
import steamGames from "../data/steam-games.json";
import psnGames from "../data/psn-games.json";
import boardGames from "../data/board-games.json";

type Book = {
  title: string;
  author: string;
  year: number;
  rating?: number;
  genre?: string;
  notes?: string;
  coverUrl?: string;
};

type VideoGame = {
  title: string;
  platform: string;
  coverUrl: string;
  playtimeHours: number;
};

type BoardGame = {
  title: string;
  platform?: string;
  status: string;
  rating?: number;
  genre?: string;
};

window.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initFavicon();
  initHeader();
  initBooks();
  initVideoGames();
  initBoardGames();
  initFooter();
});

function initFavicon(): void {
  const linkFavicon = document.getElementById("favicon") as HTMLLinkElement;
  linkFavicon.href = darkFaviconURL;
}

function stars(rating: number): string {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

function initBooks(): void {
  const section = document.getElementById("books");
  if (!section) return;

  const all: Book[] = [...(manualBooks as Book[]), ...(jeluBooks as Book[])].sort((a, b) => b.year - a.year);

  section.innerHTML = `
    <h2 class="section-title text-2xl font-bold mb-10">Books</h2>
    <div class="space-y-6" id="books-list"></div>
  `;

  const list = document.getElementById("books-list")!;
  all.forEach((book) => {
    const div = document.createElement("div");
    div.className = "border-b border-border pb-6";
    div.innerHTML = `
      <div class="flex items-start gap-4">
        ${
          book.coverUrl
            ? `<img src="${book.coverUrl}" alt="" class="w-10 h-14 shrink-0 rounded object-cover" loading="lazy" />`
            : ""
        }
        <div class="flex-1 flex items-start justify-between gap-4">
          <div>
            <h3 class="text-foreground font-semibold">${book.title}</h3>
            <p class="text-foreground-muted text-sm">${book.author}${book.genre ? ` · ${book.genre}` : ""} · ${book.year}</p>
            ${book.notes ? `<p class="text-foreground-muted mt-1 text-xs italic">${book.notes}</p>` : ""}
          </div>
          ${book.rating != null ? `<span class="text-accent shrink-0 text-sm tracking-widest">${stars(book.rating)}</span>` : ""}
        </div>
      </div>
    `;
    list.appendChild(div);
  });
}

function initVideoGames(): void {
  const section = document.getElementById("video-games");
  if (!section) return;

  const all: VideoGame[] = [...(steamGames as VideoGame[]), ...(psnGames as VideoGame[])];

  section.innerHTML = `
    <h2 class="section-title text-2xl font-bold mb-10">Video Games</h2>
    ${
      all.length === 0
        ? `<p class="text-foreground-muted text-sm">No recent activity.</p>`
        : `<div class="grid grid-cols-2 gap-3 sm:grid-cols-3" id="video-games-grid"></div>`
    }
  `;

  if (all.length === 0) return;

  const grid = document.getElementById("video-games-grid")!;
  all.forEach((game) => {
    const div = document.createElement("div");
    div.className = "rounded border border-border overflow-hidden";
    div.innerHTML = `
      <img src="${game.coverUrl}" alt="${game.title}" class="w-full aspect-video object-cover" loading="lazy" />
      <div class="p-3">
        <h3 class="text-foreground text-sm font-semibold leading-tight">${game.title}</h3>
        <div class="flex items-center justify-between mt-1 gap-2">
          <span class="text-foreground-muted text-xs">${game.platform}</span>
          ${game.playtimeHours > 0 ? `<span class="text-foreground-muted text-xs">${game.playtimeHours}h</span>` : ""}
        </div>
      </div>
    `;
    grid.appendChild(div);
  });
}

function initBoardGames(): void {
  const section = document.getElementById("board-games");
  if (!section) return;

  const games = boardGames as BoardGame[];

  section.innerHTML = `
    <h2 class="section-title text-2xl font-bold mb-10">Board Games</h2>
    ${
      games.length === 0
        ? `<p class="text-foreground-muted text-sm">Nothing here yet.</p>`
        : `<div class="space-y-6" id="board-games-list"></div>`
    }
  `;

  if (games.length === 0) return;

  const list = document.getElementById("board-games-list")!;
  games.forEach((game) => {
    const div = document.createElement("div");
    div.className = "border-b border-border pb-6";
    div.innerHTML = `
      <div class="flex items-start justify-between gap-4">
        <div>
          <h3 class="text-foreground font-semibold">${game.title}</h3>
          <p class="text-foreground-muted text-sm">${game.platform ? `${game.platform} · ` : ""}${game.genre ? `${game.genre} · ` : ""}<span>${game.status}</span></p>
        </div>
        ${game.rating != null ? `<span class="text-accent shrink-0 text-sm tracking-widest">${stars(game.rating)}</span>` : ""}
      </div>
    `;
    list.appendChild(div);
  });
}
