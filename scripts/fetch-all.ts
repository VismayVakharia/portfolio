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
  genres?: string[];
};

type BookStatus = "reading" | "finished" | "tbr";

type JeluBook = {
  title: string;
  author: string;
  status: BookStatus;
  year?: number;
  rating?: number;
  coverUrl?: string;
};

function safeWrite(filePath: string, data: unknown): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseDurationToHours(duration: string): number {
  const m = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  return Math.round((parseInt(m[1] ?? "0") + parseInt(m[2] ?? "0") / 60 + parseInt(m[3] ?? "0") / 3600) * 10) / 10;
}

// Steam's Store API is unofficial/undocumented and can rate-limit bursts of requests.
async function fetchSteamGenres(appid: number): Promise<string[]> {
  try {
    const res = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appid}&filters=genres&cc=us`);
    if (!res.ok) return [];
    const json = (await res.json()) as Record<
      string,
      { success: boolean; data?: { genres?: Array<{ description: string }> } }
    >;
    const entry = json[String(appid)];
    if (!entry?.success) return [];
    return (entry.data?.genres ?? []).map((g) => g.description);
  } catch {
    return [];
  }
}

async function fetchSteam(): Promise<void> {
  const apiKey = process.env.STEAM_API_KEY;
  const steamId = process.env.STEAM_ID;
  if (!apiKey || !steamId) {
    console.warn("[steam] Missing STEAM_API_KEY or STEAM_ID — skipping");
    return;
  }

  const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${steamId}&include_appinfo=true&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Steam API responded with ${res.status}`);

  const json = (await res.json()) as {
    response: {
      games?: Array<{ appid: number; name: string; playtime_forever: number }>;
    };
  };

  const top12 = (json.response.games ?? [])
    .slice()
    .sort((a, b) => b.playtime_forever - a.playtime_forever)
    .slice(0, 12);

  const games: VideoGame[] = [];
  for (const g of top12) {
    const genres = await fetchSteamGenres(g.appid);
    games.push({
      title: g.name,
      platform: "PC",
      coverUrl: `https://cdn.akamai.steamstatic.com/steam/apps/${g.appid}/header.jpg`,
      playtimeHours: Math.round((g.playtime_forever / 60) * 10) / 10,
      genres,
    });
    await delay(300);
  }

  safeWrite(path.join(DATA_DIR, "steam-games.json"), games);
  console.log(`[steam] Wrote ${games.length} games`);
}

// PSN's played-games API surfaces non-game apps (Prime Video, Netflix, Spotify, etc.) as "titles"
// with session time. The `categories` filter excludes the "unknown" bucket those land in server-side;
// the name denylist is a defensive second layer in case a non-game slips through some other category.
const PSN_NON_GAME_DENYLIST = [
  "netflix",
  "spotify",
  "youtube",
  "prime video",
  "disney+",
  "hulu",
  "twitch",
  "hbo max",
  "crunchyroll",
];

async function fetchPsn(): Promise<void> {
  const npsso = process.env.PSN_NPSSO?.trim();
  if (!npsso) {
    console.warn("[psn] Missing PSN_NPSSO — skipping");
    return;
  }

  const accessCode = await exchangeNpssoForAccessCode(npsso);
  const auth = await exchangeAccessCodeForAuthTokens(accessCode);
  const { titles } = await getUserPlayedGames(auth, "me", {
    limit: 24,
    categories: "ps4_game,ps5_native_game,pspc_game",
  });

  const games: VideoGame[] = titles
    .filter((g) => !PSN_NON_GAME_DENYLIST.some((d) => g.name.toLowerCase().includes(d)))
    .slice(0, 12)
    .map((g) => {
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

// Jelu's /userbooks response includes each entry's own status (verified against the bayang/jelu
// source: UserBookWithoutEventsAndUserDto has `lastReadingEvent` + `toRead` fields), so a single
// unfiltered fetch plus client-side classification is simpler and more robust than filtering
// server-side by `lastEventTypes` (the actual query param — the previous `readingEventType` param
// this code used doesn't exist on the endpoint and was silently ignored by Jelu).
function mapJeluStatus(entry: {
  lastReadingEvent?: string | null;
  lastReadingEventDate?: string | null;
  userAvgRating?: number | null;
  toRead?: boolean | null;
}): BookStatus {
  if (entry.lastReadingEvent === "CURRENTLY_READING") return "reading";
  if (entry.lastReadingEvent === "FINISHED") return "finished";
  // Some books have a reading date or rating recorded without a recognized event type
  // (e.g. imported without event history) — treat those as finished too, rather than
  // silently dropping books the user has actually read.
  if (entry.lastReadingEventDate || entry.userAvgRating != null) return "finished";
  // Everything else — owned but unread, whether or not it's on the to-read list — is
  // surfaced as "To Read" rather than dropped, so the whole library shows on the shelf.
  return "tbr";
}

async function fetchOpenLibraryCover(title: string, author: string): Promise<string | undefined> {
  try {
    const params = new URLSearchParams({ title, author, limit: "1" });
    const res = await fetch(`https://openlibrary.org/search.json?${params}`);
    if (!res.ok) return undefined;
    const json = (await res.json()) as { docs?: Array<{ cover_i?: number }> };
    const coverId = json.docs?.[0]?.cover_i;
    return coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : undefined;
  } catch {
    return undefined;
  }
}

async function fetchJelu(): Promise<void> {
  const jeluUrl = process.env.JELU_URL?.replace(/\/$/, "");
  const jeluToken = process.env.JELU_TOKEN;
  if (!jeluUrl || !jeluToken) {
    console.warn("[jelu] Missing JELU_URL or JELU_TOKEN — skipping");
    return;
  }

  const url = `${jeluUrl}/api/v1/userbooks?page=0&size=200&sort=modificationDate,desc`;
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
      userAvgRating?: number;
      lastReadingEventDate?: string;
      lastReadingEvent?: string;
      toRead?: boolean;
    }>;
  };

  const books: JeluBook[] = [];
  for (const entry of json.content) {
    const status = mapJeluStatus(entry);
    const author = entry.book.authors.map((a) => a.name).join(", ");

    const year =
      status === "finished" && entry.lastReadingEventDate
        ? new Date(entry.lastReadingEventDate).getFullYear()
        : undefined;

    const rating =
      status === "finished" && entry.userAvgRating != null
        ? Math.max(1, Math.min(5, Math.round(entry.userAvgRating / 2)))
        : undefined;

    const isbn = entry.book.isbn13 ?? entry.book.isbn10;
    const coverUrl = isbn
      ? `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`
      : await fetchOpenLibraryCover(entry.book.title, author);

    books.push({ title: entry.book.title, author, status, year, rating, coverUrl });
    if (!isbn) await delay(300);
  }

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
