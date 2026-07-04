import { colorPalettes, ColorPaletteName } from "../../scripts/color-palette.ts";

import colorPickerHTML from "./color-picker.html?raw";

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
  const colorPicker = document.getElementById("color-picker") as HTMLDivElement;

  colorPicker.innerHTML = colorPickerHTML;
  colorPicker.children[0].classList.add(
    ..."group overflow-hidden transition-all duration-300 ease-in-out hover:w-59".split(" ")
  );

  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  if (isTouch) {
    colorPicker.addEventListener("click", () => {
      if (colorSwatches.classList.contains("opacity-0")) {
        colorPicker.children[0].classList.remove("w-10");
        colorPicker.children[0].classList.add("w-59");
        colorSwatches.classList.remove("opacity-0");
        colorSwatches.classList.add("opacity-100");
      } else {
        colorPicker.children[0].classList.remove("w-59");
        colorPicker.children[0].classList.add("w-10");
        colorSwatches.classList.remove("opacity-100");
        colorSwatches.classList.add("opacity-0");
      }
    });
  }

  const colorPickerMobile = document.getElementById("color-picker-mobile") as HTMLDivElement;

  colorPickerMobile.innerHTML = colorPickerHTML;

  const colorSwatches = document.createElement("div");
  (colorPicker.children[0] as HTMLDivElement).appendChild(colorSwatches);
  colorSwatches.classList.add(
    ..."ml-2 flex gap-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100".split(
      " "
    )
  );

  const colorSwatchesMobile = document.createElement("div");
  colorPickerMobile.appendChild(colorSwatchesMobile);
  colorSwatchesMobile.classList.add(..."ml-2 py-2 flex gap-2".split(" "));

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
  colorSwatchesMobile.innerHTML = buttons;

  colorSwatches.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const color = btn.getAttribute("data-color");
      if (!color) return;

      setAccentColor(color as ColorPaletteName);
    });
  });
  colorSwatchesMobile.querySelectorAll("button").forEach((btn) => {
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
