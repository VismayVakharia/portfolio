import manualBooks from "../data/books.json";
import jeluBooks from "../data/jelu-books.json";
import bookRowHTML from "../components/book-row.html?raw";

import { stars, renderGroup } from "./dom-utils";

type BookStatus = "reading" | "finished" | "tbr";

type Book = {
  title: string;
  author: string;
  status: BookStatus;
  year?: number;
  rating?: number;
  genre?: string;
  notes?: string;
  coverUrl?: string;
};

export function initBooks(): void {
  const section = document.getElementById("books");
  if (!section) return;

  const all: Book[] = [...(manualBooks as Book[]), ...(jeluBooks as Book[])];
  const reading = all.filter((b) => b.status === "reading");
  const finished = all.filter((b) => b.status === "finished").sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
  const tbr = all.filter((b) => b.status === "tbr").sort((a, b) => a.title.localeCompare(b.title));

  section.innerHTML = `
    <h2 class="section-title text-2xl font-bold mb-10">Books</h2>
    <div id="books-groups" class="space-y-12"></div>
  `;

  const groups = document.getElementById("books-groups")!;

  if (reading.length === 0 && finished.length === 0 && tbr.length === 0) {
    groups.innerHTML = `<p class="text-foreground-muted text-sm">Nothing here yet.</p>`;
    return;
  }

  if (reading.length > 0) {
    groups.appendChild(renderGroup("Currently Reading", reading.map(createBookRow)));
  }
  if (finished.length > 0) {
    groups.appendChild(renderGroup("Read", finished.map(createBookRow)));
  }
  if (tbr.length > 0) {
    groups.appendChild(renderTbrGroup(tbr));
  }
}

function renderTbrGroup(tbr: Book[]): HTMLDivElement {
  const wrap = document.createElement("div");
  const heading = document.createElement("h3");
  heading.className = "text-foreground-muted mb-4 text-xs font-bold uppercase tracking-widest";
  heading.textContent = "To Read";
  const list = document.createElement("div");
  list.className = "grid grid-cols-1 gap-x-8 gap-y-1 text-sm sm:grid-cols-2";
  tbr.forEach((book) => {
    const line = document.createElement("p");
    line.className = "text-foreground-muted";
    line.textContent = `${book.title} — ${book.author}`;
    list.appendChild(line);
  });
  wrap.appendChild(heading);
  wrap.appendChild(list);
  return wrap;
}

function createBookRow(book: Book): HTMLDivElement {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = bookRowHTML;

  wrapper.querySelector(".title")!.textContent = book.title;

  const badge = wrapper.querySelector(".badge");
  if (book.status === "reading") badge!.textContent = "reading";
  else badge?.remove();

  const subtitleParts = [book.author, book.genre, book.status === "finished" ? book.year?.toString() : undefined];
  wrapper.querySelector(".subtitle")!.textContent = subtitleParts.filter(Boolean).join(" · ");

  const notes = wrapper.querySelector(".notes");
  if (book.notes) notes!.textContent = book.notes;
  else notes?.remove();

  const cover = wrapper.querySelector("img.cover");
  if (book.coverUrl) {
    cover?.setAttribute("src", book.coverUrl);
    cover?.setAttribute("alt", book.title);
  } else {
    cover?.remove();
  }

  const rating = wrapper.querySelector(".rating");
  if (book.status === "finished" && book.rating != null) rating!.textContent = stars(book.rating);
  else rating?.remove();

  return wrapper;
}
