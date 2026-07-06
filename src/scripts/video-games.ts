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
        : `<div class="grid grid-cols-2 gap-3 sm:grid-cols-3" id="video-games-grid"></div>`
    }
  `;

  if (all.length === 0) return;

  const grid = document.getElementById("video-games-grid")!;
  all.forEach((game) => grid.appendChild(createGameCard(game)));
}

// Tailwind's content scanner needs literal class strings (not interpolated), hence the switch.
function platformTagClass(platform: string): string {
  return platform === "PC"
    ? "bg-platform-pc/10 text-platform-pc border border-platform-pc/25 px-1.5 py-0.5 rounded text-[10px]"
    : "bg-platform-playstation/10 text-platform-playstation border border-platform-playstation/25 px-1.5 py-0.5 rounded text-[10px]";
}

function createGameCard(game: VideoGame): HTMLDivElement {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = gameCardHTML;

  const cover = wrapper.querySelector("img.cover")!;
  cover.setAttribute("src", game.coverUrl);
  cover.setAttribute("alt", game.title);

  wrapper.querySelector(".title")!.textContent = game.title;

  const platformTags = wrapper.querySelector(".platform-tags")!;
  game.platforms.forEach(({ platform, playtimeHours }) => {
    const tag = document.createElement("span");
    tag.className = platformTagClass(platform);
    tag.textContent = playtimeHours > 0 ? `${platform} · ${playtimeHours}h` : platform;
    platformTags.appendChild(tag);
  });

  const tagList = wrapper.querySelector("div.tag-list")!;
  game.genres.forEach((genre) => {
    const chip = document.createElement("span");
    chip.className = "bg-accent/10 text-accent border border-accent/25 px-1.5 py-0.5 rounded text-[10px]";
    chip.textContent = genre;
    tagList.appendChild(chip);
  });

  return wrapper;
}
