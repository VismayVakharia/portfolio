import steamGames from "../data/steam-games.json";
import psnGames from "../data/psn-games.json";
import gameCardHTML from "../components/game-card.html?raw";

type RawGame = {
  title: string;
  platform: string;
  coverUrl: string;
  playtimeHours: number;
  genres?: string[];
};

type VideoGame = {
  title: string;
  coverUrl: string;
  genres: string[];
  platforms: { platform: string; playtimeHours: number }[];
};

// PSN titles carry a trailing ®/™ that Steam titles don't, so the same game owned on
// both platforms (e.g. "Rocket League" / "Rocket League®") needs normalizing to merge.
function normalizeTitle(title: string): string {
  return title
    .replace(/[®™]/g, "")
    .trim()
    .toLowerCase();
}

function mergeGames(raw: RawGame[]): VideoGame[] {
  const byKey = new Map<string, VideoGame>();

  raw.forEach((game) => {
    const key = normalizeTitle(game.title);
    const existing = byKey.get(key);
    if (existing) {
      existing.platforms.push({ platform: game.platform, playtimeHours: game.playtimeHours });
      (game.genres ?? []).forEach((genre) => {
        if (!existing.genres.includes(genre)) existing.genres.push(genre);
      });
      return;
    }
    byKey.set(key, {
      title: game.title.replace(/[®™]/g, "").trim(),
      coverUrl: game.coverUrl,
      genres: [...(game.genres ?? [])],
      platforms: [{ platform: game.platform, playtimeHours: game.playtimeHours }],
    });
  });

  return [...byKey.values()];
}

function totalPlaytime(game: VideoGame): number {
  return game.platforms.reduce((sum, p) => sum + p.playtimeHours, 0);
}

export function initVideoGames(): void {
  const section = document.getElementById("video-games");
  if (!section) return;

  const all = mergeGames([...(steamGames as RawGame[]), ...(psnGames as RawGame[])]).sort(
    (a, b) => totalPlaytime(b) - totalPlaytime(a)
  );

  section.innerHTML = `
    <h2 class="section-title text-2xl font-bold mb-10">Video Games</h2>
    ${
      all.length === 0
        ? `<p class="text-foreground-muted text-sm">No recent activity.</p>`
        : `<div class="floppy-grid" id="video-games-grid"></div>`
    }
  `;

  if (all.length === 0) return;

  const grid = document.getElementById("video-games-grid")!;
  all.forEach((game, i) => grid.appendChild(createFloppy(game, i)));
}

function createFloppy(game: VideoGame, index: number): HTMLDivElement {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = gameCardHTML;
  const floppy = wrapper.firstElementChild as HTMLDivElement;

  floppy.querySelector(".title")!.textContent = game.title;

  const cover = floppy.querySelector<HTMLImageElement>("img.floppy-cover")!;
  cover.src = game.coverUrl;
  cover.alt = game.title;
  cover.addEventListener("error", () => cover.remove());

  // Reuse the muted book-spine palette so the shelf reads as one unified set.
  floppy.style.setProperty("--floppy-body", `var(--color-spine-${(index % 6) + 1})`);

  const platforms = game.platforms.map((p) => p.platform).join("/");
  floppy.querySelector(".floppy-meta")!.textContent = `${platforms} · ${Math.round(totalPlaytime(game))}h`;

  return floppy;
}
