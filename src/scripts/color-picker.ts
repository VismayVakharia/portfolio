import colorPickerHTML from "../components/color-picker.html?raw";

import { colorPalettes, ColorPaletteName } from "./color-palette.ts";

function setAccentColor(color: ColorPaletteName): void {
  const root = document.documentElement;
  const palette = colorPalettes[color];

  root.style.setProperty("--color-accent-0", palette.accent0);
  root.style.setProperty("--color-accent-1", palette.accent1);
  root.style.setProperty("--color-accent-2", palette.accent2);

  localStorage.setItem("accentColor", color);

  document.documentElement.dispatchEvent(new Event("accentChange"));
}

export function initColorPicker(): void {
  const colorPicker = document.getElementById("color-picker");
  if (!colorPicker) return;

  colorPicker.innerHTML = colorPickerHTML;

  const colorSwatches = document.getElementById("color-swatches")!;

  let buttons = "";

  Object.keys(colorPalettes).forEach((color) => {
    const palette = colorPalettes[color as ColorPaletteName];
    buttons = buttons.concat(`
      <button
      class="h-6 w-6 rounded-full hover:border-foreground border-gray-700"
      style="background: linear-gradient(to right, ${palette.accent0}, ${palette.accent2}); border-width: 2px"
      data-color="${color}"></button>
      `);
  });

  colorSwatches.innerHTML = buttons;

  colorSwatches.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const color = btn.getAttribute("data-color");
      if (!color) return;

      setAccentColor(color as ColorPaletteName);
    });
  });

  const savedColor = localStorage.getItem("accentColor") as ColorPaletteName;
  if (savedColor) {
    setAccentColor(savedColor);
    return;
  }
  setAccentColor("teal");
}
