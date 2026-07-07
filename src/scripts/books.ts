import manualBooks from "../data/books.json";
import jeluBooks from "../data/jelu-books.json";
import bookSpineHTML from "../components/book-spine.html?raw";

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
  // Spines stand on a hairline "shelf edge"; wrap (not scroll) so hover popovers never clip.
  shelf.className = "border-border flex flex-wrap items-end gap-x-3 gap-y-8 border-b-2 pb-3";

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

function createBookSpine(book: Book): HTMLDivElement {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = bookSpineHTML;
  const spine = wrapper.firstElementChild as HTMLDivElement;

  spine.querySelectorAll<HTMLElement>(".title, .detail-title").forEach((el) => (el.textContent = book.title));

  spine.querySelectorAll("img.cover, img.detail-cover").forEach((img) => {
    if (book.coverUrl) {
      img.setAttribute("src", book.coverUrl);
      img.setAttribute("alt", book.title);
    } else {
      img.remove();
    }
  });

  spine.querySelector(".detail-author")!.textContent = book.author;

  const statusLabel = book.status === "reading" ? "Reading" : book.status === "finished" ? "Read" : "To read";
  spine.querySelector(".detail-meta")!.textContent = [book.year?.toString(), statusLabel].filter(Boolean).join(" · ");

  return spine;
}
