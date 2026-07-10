import manualBooks from "../data/books.json";
import jeluBooks from "../data/jelu-books.json";
import bookSpineHTML from "../components/book-spine.html?raw";

import { spineVar } from "./dom-utils";

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

  if (reading.length > 0) groups.appendChild(renderShelf("Currently Reading", reading));
  if (finished.length > 0) groups.appendChild(renderShelf("Read", finished));
  if (tbr.length > 0) groups.appendChild(renderShelf("To Read", tbr));
}

// ponytail: fixed per-shelf cap so a big library (esp. To Read) can't grow unbounded;
// the rest collapse into a "+N more" tile that expands on click. Bump if a shelf still feels short.
const MAX_SPINES = 12;

function renderShelf(label: string, books: Book[]): HTMLDivElement {
  const wrap = document.createElement("div");
  const heading = document.createElement("h3");
  heading.className = "text-foreground-muted mb-4 text-xs font-bold uppercase tracking-widest";
  heading.textContent = label;
  const shelf = document.createElement("div");
  // Slabs stacked in a loose pile; slight gap so each book's edge shadow reads.
  shelf.className = "flex flex-col gap-1";

  books.slice(0, MAX_SPINES).forEach((book) => shelf.appendChild(createBookSpine(book)));

  const hidden = books.slice(MAX_SPINES);
  if (hidden.length > 0) {
    const more = createMoreTile(hidden.length);
    more.addEventListener("click", () => {
      hidden.forEach((book) => shelf.insertBefore(createBookSpine(book), more));
      more.remove();
    });
    shelf.appendChild(more);
  }

  wrap.appendChild(heading);
  wrap.appendChild(shelf);
  return wrap;
}

function createMoreTile(count: number): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "more-spine";
  btn.setAttribute("aria-label", `Show ${count} more`);
  btn.innerHTML = `<span class="more-count">+${count}</span><span class="more-label">more</span>`;
  return btn;
}

// ponytail: deterministic string hash, no crypto needed — just picks a spine colour.
function hashString(s: string): number {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

function createBookSpine(book: Book): HTMLDivElement {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = bookSpineHTML;
  const spine = wrapper.firstElementChild as HTMLDivElement;

  spine.querySelectorAll<HTMLElement>(".title, .detail-title").forEach((el) => (el.textContent = book.title));

  // One hash drives colour + the organic pile: varied slab widths and left offsets.
  const h = hashString(book.title);
  spine.style.width = `${72 + ((h >> 3) % 5) * 4}%`; // 72–88%
  spine.style.marginLeft = `${((h >> 6) % 4) * 6}px`; // 0–18px
  // Set the colour as a custom prop so the CSS can layer the curved-spine sheen over it.
  spine.querySelector<HTMLElement>(".spine-face")!.style.setProperty("--spine", spineVar(h));

  const detailCover = spine.querySelector<HTMLImageElement>("img.detail-cover")!;
  if (book.coverUrl) {
    detailCover.src = book.coverUrl;
    detailCover.alt = book.title;
    // Open Library returns HTTP 200 with a near-empty placeholder pixel for editions it
    // has no cover for, so `error` alone won't catch it — check naturalWidth on load too.
    detailCover.addEventListener("load", () => {
      if (detailCover.naturalWidth <= 1) detailCover.remove();
    });
    detailCover.addEventListener("error", () => detailCover.remove());
  } else {
    detailCover.remove();
  }

  spine.querySelector(".spine-author")!.textContent = book.author;
  spine.querySelector(".detail-author")!.textContent = book.author;

  const statusLabel = book.status === "reading" ? "Reading" : book.status === "finished" ? "Read" : "To read";
  spine.querySelector(".detail-meta")!.textContent = [book.year?.toString(), statusLabel].filter(Boolean).join(" · ");

  return spine;
}
