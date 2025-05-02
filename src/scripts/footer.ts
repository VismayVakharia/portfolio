import footerHTML from "../components/footer.html?raw";

export function initFooter(): void {
  const footer = document.getElementById("footer");
  if (!footer) return;

  footer.innerHTML = footerHTML;

  const copyRightText = footer.querySelector(".footer-copyright") as HTMLParagraphElement;
  copyRightText.textContent = `© ${new Date().getFullYear().toString()} Vismay Vakharia. All rights reserved.`;
}
