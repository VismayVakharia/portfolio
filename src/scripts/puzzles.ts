import puzzlesData from "../data/puzzles.json";
import puzzleCardHTML from "../components/puzzle-card.html?raw";

type Puzzle = {
  name: string;
  category: string;
  type?: string;
  brand?: string;
  imageUrl?: string;
  notes?: string;
};

export function initPuzzles(): void {
  const section = document.getElementById("puzzles");
  if (!section) return;

  section.innerHTML = `
    <h2 class="section-title text-2xl font-bold mb-10">Puzzle Collection</h2>
    <p class="text-foreground-muted mb-4 text-sm leading-relaxed">
      I like taking things apart — mechanically and mentally. This is a running list of twisty puzzles I've picked up
      along the way: not for speed, just for the satisfaction of figuring out how something clicks together and comes
      apart again.
    </p>
    <p class="text-foreground-muted mb-10 text-sm leading-relaxed">
      I'm also a sucker for the daily digital kind — Wordle, Strands, LinkedIn's puzzle games, and
      <a
        href="https://worldle.teuteuf.fr/"
        target="_blank"
        rel="noopener noreferrer"
        class="text-accent hover:underline"
        >Worldle</a
      >, which is slowly teaching me geography I should've learned in school.
    </p>
    <div id="puzzles-groups" class="space-y-12"></div>
  `;

  const groups = document.getElementById("puzzles-groups")!;

  groupByCategory(puzzlesData as Puzzle[]).forEach(([category, puzzles]) => {
    const wrap = document.createElement("div");
    const heading = document.createElement("h3");
    heading.className = "text-foreground-muted mb-4 text-xs font-bold uppercase tracking-widest";
    heading.textContent = category;
    const grid = document.createElement("div");
    grid.className = "grid grid-cols-1 gap-6 sm:grid-cols-2";
    puzzles.forEach((puzzle) => grid.appendChild(createPuzzleCard(puzzle)));
    wrap.appendChild(heading);
    wrap.appendChild(grid);
    groups.appendChild(wrap);
  });
}

function groupByCategory(puzzles: Puzzle[]): [string, Puzzle[]][] {
  const map = new Map<string, Puzzle[]>();
  puzzles.forEach((puzzle) => {
    if (!map.has(puzzle.category)) map.set(puzzle.category, []);
    map.get(puzzle.category)!.push(puzzle);
  });
  return [...map.entries()];
}

function createPuzzleCard(puzzle: Puzzle): HTMLDivElement {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = puzzleCardHTML;

  wrapper.querySelector(".name")!.textContent = puzzle.name;

  const image = wrapper.querySelector("img.image");
  if (puzzle.imageUrl) {
    image?.setAttribute("src", puzzle.imageUrl);
    image?.setAttribute("alt", puzzle.name);
  } else {
    image?.remove();
  }

  const notes = wrapper.querySelector(".notes");
  if (puzzle.notes) notes!.textContent = puzzle.notes;
  else notes?.remove();

  return wrapper;
}
