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

This is a **vanilla TypeScript + Vite** site with no JS framework.

### Rendering pattern

`src/index.html` defines empty `<section>` placeholders. On `DOMContentLoaded`, `src/index.ts` calls each section's `init*()` function. Each init function:
1. Imports its HTML template via Vite's `?raw` suffix (e.g., `import aboutHTML from "../components/about.html?raw"`)
2. Injects it into the DOM via `innerHTML`
3. Queries the injected elements and wires up event listeners or populates dynamic data

### Key directories

- `src/components/` — HTML templates (some are flat `.html` files, some are directories containing both `.html` and `.ts`)
- `src/scripts/` — One `init*()` function per section; `color-palette.ts` and `particles-config.ts` are shared utilities
- `src/data/` — JSON files (`projects.json`, `publications.json`, `skills.json`) that drive dynamic section content
- `public/assets/` — Static assets (images, PDFs, favicon) served as-is

### Color theming

Accent colors are CSS custom properties (`--color-accent-0/1/2`) defined in `src/styles/main.css` under `@theme`. The color picker lets users select a palette from `src/scripts/color-palette.ts`, which updates these properties on `:root` and persists the choice in `localStorage`. After any accent change, a custom `accentChange` event is dispatched on `document.documentElement` — `index.ts` listens for this to refresh the tsparticles colors.

### Asset imports

- Static asset URLs: use Vite's `?url` suffix (e.g., `import imgURL from "../../public/assets/vismay.png?url"`)
- Raw HTML templates: use Vite's `?raw` suffix

### Tailwind v4

Theme tokens are declared with `@theme` inside `src/styles/main.css` — **not** inside `tailwind.config.ts`. The config file is vestigial; add new design tokens in `main.css`.

### Deployment

Set `GITHUB_PAGES=true` before building to switch the Vite `base` from `/` to `/portfolio/` for GitHub Pages hosting.
