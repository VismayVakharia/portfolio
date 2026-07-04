import { initThemeButton } from "../../scripts/theme";
import { initEasterEgg } from "../../scripts/color-picker";

import footerHTML from "./footer.html?raw";

export function initFooter(): void {
  const footer = document.getElementById("footer");
  if (!footer) return;

  footer.innerHTML = footerHTML;

  const copyright = footer.querySelector(".footer-copyright") as HTMLParagraphElement;
  copyright.textContent = `© ${new Date().getFullYear()} Vismay Vakharia`;

  initThemeButton();
  initEasterEgg();
}
