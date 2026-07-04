/**
 * Fetches live hobby data from Steam, PSN, and Jelu and writes it to src/data/.
 *
 * Run via: npm run fetch-data
 * Requires env vars: STEAM_API_KEY, STEAM_ID, PSN_NPSSO, JELU_URL, JELU_TOKEN
 *
 * On any fetch failure the existing JSON file is left intact (stale data > error).
 *
 * PSN note: PSN_NPSSO is tied to your PSN session. Retrieve it from
 * https://ca.account.sony.com/api/v1/ssocookie while logged into PSN in a browser.
 * It stays valid until you log out or Sony expires it (typically months).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

// psn-api is a CJS package; use createRequire for named exports in an ESM context.
const require = createRequire(import.meta.url);
const { exchangeNpssoForAccessCode, exchangeAccessCodeForAuthTokens, getUserPlayedGames } =
  require("psn-api") as typeof import("psn-api");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "../src/data");

type VideoGame = {
  title: string;
  platform: string;
  coverUrl: string;
  playtimeHours: number;
};

type JeluBook = {
  title: string;
  author: string;
  year: number;
  rating?: number;
  coverUrl?: string;
};

function safeWrite(filePath: string, data: unknown): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
}

function parseDurationToHours(duration: string): number {
  const m = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  return Math.round((parseInt(m[1] ?? "0") + parseInt(m[2] ?? "0") / 60 + parseInt(m[3] ?? "0") / 3600) * 10) / 10;
}

async function fetchSteam(): Promise<void> {
  const apiKey = process.env.STEAM_API_KEY;
  const steamId = process.env.STEAM_ID;
  if (!apiKey || !steamId) {
    console.warn("[steam] Missing STEAM_API_KEY or STEAM_ID — skipping");
    return;
  }

  const url = `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=${apiKey}&steamid=${steamId}&count=12&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Steam API responded with ${res.status}`);

  const json = (await res.json()) as {
    response: {
      games?: Array<{ appid: number; name: string; playtime_forever: number }>;
    };
  };

  const games: VideoGame[] = (json.response.games ?? []).map((g) => ({
    title: g.name,
    platform: "PC",
    coverUrl: `https://cdn.akamai.steamstatic.com/steam/apps/${g.appid}/header.jpg`,
    playtimeHours: Math.round((g.playtime_forever / 60) * 10) / 10,
  }));

  safeWrite(path.join(DATA_DIR, "steam-games.json"), games);
  console.log(`[steam] Wrote ${games.length} games`);
}

async function fetchPsn(): Promise<void> {
  const npsso = process.env.PSN_NPSSO;
  if (!npsso) {
    console.warn("[psn] Missing PSN_NPSSO — skipping");
    return;
  }

  const accessCode = await exchangeNpssoForAccessCode(npsso);
  const auth = await exchangeAccessCodeForAuthTokens(accessCode);
  const { titles } = await getUserPlayedGames(auth, "me", { limit: 12 });

  const games: VideoGame[] = titles.map((g) => {
    const coverImg = g.concept.media.images.find(
      (img) => img.type === "GAMEHUB_COVER_ART" || img.type === "FOUR_BY_THREE_BANNER"
    );
    const coverUrl = coverImg?.url ?? g.localizedImageUrl;
    const platform = g.category === "ps5_native_game" ? "PS5" : g.category === "ps4_game" ? "PS4" : "PlayStation";

    return {
      title: g.name,
      platform,
      coverUrl,
      playtimeHours: parseDurationToHours(g.playDuration),
    };
  });

  safeWrite(path.join(DATA_DIR, "psn-games.json"), games);
  console.log(`[psn] Wrote ${games.length} games`);
}

async function fetchJelu(): Promise<void> {
  const jeluUrl = process.env.JELU_URL?.replace(/\/$/, "");
  const jeluToken = process.env.JELU_TOKEN;
  if (!jeluUrl || !jeluToken) {
    console.warn("[jelu] Missing JELU_URL or JELU_TOKEN — skipping");
    return;
  }

  const url = `${jeluUrl}/api/v1/userbooks?page=0&pageSize=50&readingEventType=FINISHED`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${jeluToken}` },
  });
  if (!res.ok) throw new Error(`Jelu API responded with ${res.status}`);

  const json = (await res.json()) as {
    content: Array<{
      book: {
        title: string;
        authors: Array<{ name: string }>;
        isbn13?: string;
        isbn10?: string;
      };
      personalRating?: number;
      readingEvents: Array<{ eventType: string; endDate?: string }>;
    }>;
  };

  const books: JeluBook[] = json.content.map((entry) => {
    const author = entry.book.authors.map((a) => a.name).join(", ");

    const finishedEvent = entry.readingEvents.find((e) => e.eventType === "FINISHED");
    const year = finishedEvent?.endDate ? new Date(finishedEvent.endDate).getFullYear() : new Date().getFullYear();

    const rating =
      entry.personalRating != null ? Math.max(1, Math.min(5, Math.round(entry.personalRating / 2))) : undefined;

    const isbn = entry.book.isbn13 ?? entry.book.isbn10;
    const coverUrl = isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg` : undefined;

    return { title: entry.book.title, author, year, rating, coverUrl };
  });

  safeWrite(path.join(DATA_DIR, "jelu-books.json"), books);
  console.log(`[jelu] Wrote ${books.length} books`);
}

async function main() {
  const results = await Promise.allSettled([fetchSteam(), fetchPsn(), fetchJelu()]);

  results.forEach((r, i) => {
    if (r.status === "rejected") {
      const name = ["steam", "psn", "jelu"][i];
      console.error(`[${name}] Error:`, r.reason instanceof Error ? r.reason.message : r.reason);
    }
  });
}

main();
