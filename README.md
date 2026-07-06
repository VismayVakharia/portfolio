# Portfolio

My personal portfolio, live at **[vismayvakharia.com](https://vismayvakharia.com)**.

A vanilla TypeScript + Vite multi-page app — no JS framework. Styled with Tailwind CSS v4.

## Pages

| URL         | Description                                                                       |
| ----------- | --------------------------------------------------------------------------------- |
| `/`         | Professional portfolio — about, skills, timeline, projects, publications, contact |
| `/shelf/`   | Books, video games, and board games I've played/read                              |
| `/puzzles/` | My twisty puzzle collection                                                       |

## Getting started

```bash
git clone https://github.com/VismayVakharia/portfolio.git
cd portfolio
npm install
npm run dev   # http://localhost:5173
```

## Commands

```bash
npm run dev          # Start dev server at localhost:5173
npm run build        # Type-check + Vite production build → dist/
npm run preview      # Serve the production build locally
npm run lint         # ESLint on all .ts files
npm run format       # Prettier (write)
npm run format:check # Prettier (check only)
npm run fetch-data   # Refresh hobby data from Steam, PSN, and Jelu
```

A pre-commit hook runs `lint-staged`, auto-formatting and linting staged `.ts`, `.html`, and `.css` files.

## Project structure

```
src/
  index.html, index.ts       # Homepage entry
  shelf/                     # /shelf/ entry
  puzzles/                   # /puzzles/ entry
  components/                # HTML templates + component logic
  scripts/                   # Section init functions and shared utilities
  data/                      # JSON content (projects, publications, skills, puzzles, books, games)
  styles/                    # Tailwind v4 theme (main.css)
public/assets/                # Static assets (images, PDFs, favicon)
scripts/fetch-all.ts          # Pulls Steam/PSN/Jelu data for the shelf page
```

See `CLAUDE.md` for a deeper dive into the architecture, rendering pattern, and theming system.

## Hobby data pipeline

The shelf page mixes hand-curated data (books read status, board games) with auto-refreshed data pulled from the Steam Web API, `psn-api`, and a self-hosted Jelu instance. A GitHub Actions workflow runs this refresh daily and commits any changes automatically.

## Deployment

Hosted on **Cloudflare Pages**, connected to this repo — every push to `main` triggers a fresh build and deploy.
