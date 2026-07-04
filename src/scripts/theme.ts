import { applyPalette, type PaletteName } from "./color-picker";

export function initTheme(): void {
  if (localStorage.getItem("theme") === "light") {
    document.documentElement.classList.add("light");
  }

  const saved = localStorage.getItem("accentPalette") as PaletteName | null;
  if (saved) applyPalette(saved);
}

export function toggleTheme(): void {
  const isLight = document.documentElement.classList.toggle("light");
  localStorage.setItem("theme", isLight ? "light" : "dark");
  updateThemeIcon();
}

export function initThemeButton(): void {
  updateThemeIcon();
  const btn = document.getElementById("theme-toggle-btn");
  if (!btn) return;
  btn.addEventListener("click", toggleTheme);
}

function updateThemeIcon(): void {
  const btn = document.getElementById("theme-toggle-btn");
  if (!btn) return;
  const isLight = document.documentElement.classList.contains("light");
  btn.innerHTML = isLight ? '<i class="fas fa-moon text-xs"></i>' : '<i class="fas fa-sun text-xs"></i>';
}
