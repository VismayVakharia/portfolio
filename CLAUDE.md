# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server at localhost:5173
npm run build        # Type-check + Vite production build → dist/
npm run preview      # Serve the production build locally
npm run lint         # ESLint on all .ts files
npm run format       # Prettier (write)
npm run format:check # Prettier (check only)
```

The pre-commit hook runs `lint-staged`, which auto-runs Prettier + ESLint on staged `.ts`, `.html`, and `.css` files.

## Architecture

This is a **vanilla TypeScript + Vite** MPA (multi-page app) with no JS framework.

### Pages

| Entry HTML | Entry TS | URL |
|---|---|---|
| `src/index.html` | `src/index.ts` | `/` — professional portfolio |
| `src/shelf/index.html` | `src/shelf/shelf.ts` | `/shelf/` — books, video games, board games |
| `src/puzzles/index.html` | `src/puzzles/puzzles.ts` | `/puzzles/` — puzzle collection |

All three are registered in `vite.config.ts` under `rollupOptions.input`. Vite `root` is `src/`, so script `src` attributes in HTML use paths like `/index.ts`, `/shelf/shelf.ts`.

### Rendering pattern

Each page's entry TS file calls shared `init*()` functions on `DOMContentLoaded`. Each init function:
1. Imports its HTML template via Vite's `?raw` suffix (e.g., `import aboutHTML from "../components/about.html?raw"`)
2. Injects it into the DOM via `innerHTML`
3. Queries the injected elements and wires up event listeners or populates dynamic data

Every page calls `initTheme()` first (applies saved theme/palette), then `initHeader()`, section inits, `initFooter()`. The homepage also calls `initScrollSpy()` last (after all sections are rendered).

### Key directories

- `src/components/` — HTML templates; components with both HTML and TS logic live in subdirectories (`header/`, `footer/`, `color-picker/`, `project-card/`)
- `src/scripts/` — Section init functions (`about.ts`, `skills.ts`, etc.) and shared utilities (`theme.ts`, `color-picker.ts`)
- `src/data/` — JSON files driving dynamic content: `projects.json`, `publications.json`, `skills.json`, `puzzles.json`, plus the shelf's manual (`books.json`, `board-games.json`) and auto-refreshed (`jelu-books.json`, `steam-games.json`, `psn-games.json`) files — see "Hobby data pipeline" below
- `public/assets/` — Static assets (images, PDFs, favicon) served as-is

### Navigation

The header has two layers, both fixed:
- **Main navbar** (`z-50`, `h-[57px]`): title + Shelf/Puzzles page links. On non-home pages the section sub-bar is removed by `initHeader()`.
- **Section sub-bar** (`z-40`, `top: 57px`): homepage-only horizontal bar with anchor links. `initScrollSpy()` uses `IntersectionObserver` to highlight the active section.

The footer is `fixed bottom-0 z-50 h-11`. All pages add `pb-11` to `<main>` to avoid content overlap. The homepage adds `pt-[94px]` (navbar + sub-bar); sub-pages add `pt-[73px]` (navbar only).

### Color theming

All color tokens are CSS custom properties in `src/styles/main.css` under `@theme`. Light mode overrides live in `html.light { }`. The single accent is `--color-accent`.

**Easter egg palette system**: Six accent palettes are defined as `html[data-accent="name"] { --color-accent: ...; }` rules in `main.css`. `src/scripts/color-picker.ts` sets `document.documentElement.dataset.accent` and saves to `localStorage` key `accentPalette`. `initTheme()` (in `theme.ts`) reapplies the saved palette on load. The trigger is a barely-visible palette icon in the footer.

**Light/dark toggle**: `html.light` class on `<html>`, toggled by `theme.ts`. Saved to `localStorage` key `theme`. An inline `<script>` in each HTML `<head>` applies the class before CSS renders to prevent flash.

### Asset imports

- Static asset URLs: Vite's `?url` suffix (e.g., `import imgURL from "../../public/assets/vismay.png?url"`)
- Raw HTML templates: Vite's `?raw` suffix
- Vite client types (`import.meta.env.BASE_URL`) are available via `/// <reference types="vite/client" />` in `src/declarations.d.ts`

### Tailwind v4

Theme tokens are declared with `@theme` inside `src/styles/main.css` — **not** in `tailwind.config.ts` (that file is vestigial). Add new design tokens in `main.css`.

### Hobby data pipeline

The shelf page (`/shelf/`) mixes manually-curated and auto-refreshed data:

- **Manual** (hand-edited, never overwritten by automation): `src/data/books.json`, `src/data/board-games.json`
- **Auto-refreshed**: `src/data/jelu-books.json`, `src/data/steam-games.json`, `src/data/psn-games.json`

`scripts/fetch-all.ts` (run via `npm run fetch-data`) pulls from the Steam Web API, the `psn-api` package, and a self-hosted Jelu instance, and writes the three auto-refreshed files. `.github/workflows/refresh-hobby-data.yml` runs it daily (plus manual `workflow_dispatch`) and commits any changes to those three files via the GitHub Contents API (not a git push). A failing source leaves its existing JSON file untouched rather than erroring out. Books and board games are merged/grouped client-side in `src/scripts/books.ts`/`board-games.ts` by a `status` field (`reading`/`finished`/`tbr` for books, `offline`/`online`/`both`/`wishlist` for board games — `both` fans into both the "Played" and "Played Online" groups).

`board-games.json` entries only need `title`/`status` filled in by hand — the rest (`imageUrl`/`players`/`genre`/`bggUrl`) gets looked up on request rather than fetched by a script: BoardGameGeek's XML API now requires a registered app + auth token for all requests (not just cloud IPs), so there's no unauthenticated automation path.

### Deployment

Set `GITHUB_PAGES=true` before building to switch the Vite `base` from `/` to `/portfolio/`. Navigation hrefs in `header.ts` use `import.meta.env.BASE_URL` so page links work on both local dev and GitHub Pages.
