import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,html}"],
  darkMode: "class", // This enables class-based dark mode
  theme: {
    extend: {
      colors: {},
    },
  },
  plugins: [],
};

export default config;
