import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

export default defineConfig({
  base: isGitHubPages ? "/portfolio/" : "/",
  root: "src",
  build: {
    outDir: "../dist",
    assetsDir: "assets",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: "src/index.html",
        shelf: "src/shelf/index.html",
        puzzles: "src/puzzles/index.html",
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  plugins: [tailwindcss()],
});
