import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/portfolio/',
  root: "src",
  build: {
    outDir: '../dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'src/index.html',
      },
    },
  },
  server: {
    port: 5173,
    open: true
  },
  plugins: [
    tailwindcss(),
  ]
});