import "../styles/main.css";

import darkFaviconURL from "../dark-favicon.png?url";
import { initTheme } from "../scripts/theme";
import { initHeader } from "../components/header/header";
import { initFooter } from "../components/footer/footer";
import books from "../data/books.json";
import games from "../data/games.json";

type Book = {
  title: string;
  author: string;
  year: number;
  rating: number;
  genre?: string;
  notes?: string;
};

type Game = {
  title: string;
  platform: string;
  status: string;
  rating?: number;
  genre?: string;
};

window.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initFavicon();
  initHeader();
  initBooks();
  initGames();
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

  section.innerHTML = `
    <h2 class="section-title text-2xl font-bold mb-10">Books</h2>
    <div class="space-y-6" id="books-list"></div>
  `;

  const list = document.getElementById("books-list")!;
  (books as Book[]).forEach((book) => {
    const div = document.createElement("div");
    div.className = "border-b border-border pb-6";
    div.innerHTML = `
      <div class="flex items-start justify-between gap-4">
        <div>
          <h3 class="text-foreground font-semibold">${book.title}</h3>
          <p class="text-foreground-muted text-sm">${book.author}${book.genre ? ` · ${book.genre}` : ""} · ${book.year}</p>
          ${book.notes ? `<p class="text-foreground-muted mt-1 text-xs italic">${book.notes}</p>` : ""}
        </div>
        <span class="text-accent shrink-0 text-sm tracking-widest">${stars(book.rating)}</span>
      </div>
    `;
    list.appendChild(div);
  });
}

function initGames(): void {
  const section = document.getElementById("games");
  if (!section) return;

  section.innerHTML = `
    <h2 class="section-title text-2xl font-bold mb-10">Games</h2>
    <div class="space-y-6" id="games-list"></div>
  `;

  const list = document.getElementById("games-list")!;
  (games as Game[]).forEach((game) => {
    const div = document.createElement("div");
    div.className = "border-b border-border pb-6";
    div.innerHTML = `
      <div class="flex items-start justify-between gap-4">
        <div>
          <h3 class="text-foreground font-semibold">${game.title}</h3>
          <p class="text-foreground-muted text-sm">${game.platform}${game.genre ? ` · ${game.genre}` : ""} · <span class="text-foreground-muted">${game.status}</span></p>
        </div>
        ${game.rating !== undefined ? `<span class="text-accent shrink-0 text-sm tracking-widest">${stars(game.rating)}</span>` : ""}
      </div>
    `;
    list.appendChild(div);
  });
}
