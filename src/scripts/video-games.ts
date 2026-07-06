import steamGames from "../data/steam-games.json";
import psnGames from "../data/psn-games.json";
import gameCardHTML from "../components/game-card.html?raw";

type VideoGame = {
  title: string;
  platform: string;
  coverUrl: string;
  playtimeHours: number;
  genres?: string[];
};

export function initVideoGames(): void {
  const section = document.getElementById("video-games");
  if (!section) return;

  const all: VideoGame[] = [...(steamGames as VideoGame[]), ...(psnGames as VideoGame[])].sort(
    (a, b) => b.playtimeHours - a.playtimeHours
  );

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
  all.forEach((game) => grid.appendChild(createGameCard(game)));
}

function createGameCard(game: VideoGame): HTMLDivElement {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = gameCardHTML;

  const cover = wrapper.querySelector("img.cover")!;
  cover.setAttribute("src", game.coverUrl);
  cover.setAttribute("alt", game.title);

  wrapper.querySelector(".title")!.textContent = game.title;
  wrapper.querySelector(".platform")!.textContent = game.platform;

  const playtime = wrapper.querySelector(".playtime");
  if (game.playtimeHours > 0) playtime!.textContent = `${game.playtimeHours}h`;
  else playtime?.remove();

  const tagList = wrapper.querySelector("div.tag-list")!;
  (game.genres ?? []).forEach((genre) => {
    const chip = document.createElement("span");
    chip.className = "bg-accent/10 text-accent border border-accent/25 px-1.5 py-0.5 rounded text-[10px]";
    chip.textContent = genre;
    tagList.appendChild(chip);
  });

  return wrapper;
}
