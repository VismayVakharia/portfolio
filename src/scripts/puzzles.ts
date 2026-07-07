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
    <div id="puzzles-grid" class="grid grid-cols-2 gap-3 sm:grid-cols-3"></div>
  `;

  const grid = document.getElementById("puzzles-grid")!;
  (puzzlesData as Puzzle[]).forEach((puzzle) => grid.appendChild(createPuzzleCard(puzzle)));
}

function createPuzzleCard(puzzle: Puzzle): HTMLDivElement {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = puzzleCardHTML;

  wrapper.querySelector(".name")!.textContent = puzzle.name;
  wrapper.querySelector(".category")!.textContent = puzzle.category;

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
