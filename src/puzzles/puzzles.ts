import "../styles/main.css";

import darkFaviconURL from "../dark-favicon.png?url";
import { initTheme } from "../scripts/theme";
import { initHeader } from "../components/header/header";
import { initFooter } from "../components/footer/footer";
import puzzlesData from "../data/puzzles.json";

type Puzzle = {
  name: string;
  type: string;
  brand?: string;
  solved: boolean;
  bestTime?: string;
  notes?: string;
};

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

function initPuzzles(): void {
  const section = document.getElementById("puzzles");
  if (!section) return;

  section.innerHTML = `
    <h2 class="section-title text-2xl font-bold mb-10">Puzzle Collection</h2>
    <p class="text-foreground-muted mb-10 text-sm leading-relaxed">
      Twisty puzzles and other mechanical curiosities. Collected and solved over the years.
    </p>
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2" id="puzzles-grid"></div>
  `;

  const grid = document.getElementById("puzzles-grid")!;
  (puzzlesData as Puzzle[]).forEach((puzzle) => {
    const div = document.createElement("div");
    div.className = "border-border bg-background-muted rounded border p-5";
    div.innerHTML = `
      <div class="flex items-start justify-between mb-2">
        <h3 class="text-foreground font-semibold">${puzzle.name}</h3>
        <span class="text-xs ${puzzle.solved ? "text-accent" : "text-foreground-muted"}">
          ${puzzle.solved ? "solved" : "unsolved"}
        </span>
      </div>
      <p class="text-foreground-muted text-xs mb-1">${puzzle.type}${puzzle.brand ? ` · ${puzzle.brand}` : ""}</p>
      ${puzzle.bestTime ? `<p class="text-foreground-muted text-xs">Best: ${puzzle.bestTime}</p>` : ""}
      ${puzzle.notes ? `<p class="text-foreground-muted mt-2 text-xs italic">${puzzle.notes}</p>` : ""}
    `;
    grid.appendChild(div);
  });
}
