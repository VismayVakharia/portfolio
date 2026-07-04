const palettes = {
  teal: { darkAccent: "#5b9ca3", lightAccent: "#3d7a82" },
  copper: { darkAccent: "#c8845a", lightAccent: "#9a5a30" },
  indigo: { darkAccent: "#7c86ff", lightAccent: "#4a52cc" },
  rose: { darkAccent: "#e05a7a", lightAccent: "#b03050" },
  emerald: { darkAccent: "#5aad7a", lightAccent: "#3a8558" },
  violet: { darkAccent: "#a45ad4", lightAccent: "#7a38a8" },
} as const;

export type PaletteName = keyof typeof palettes;

export function applyPalette(name: PaletteName): void {
  if (name === "teal") {
    document.documentElement.removeAttribute("data-accent");
  } else {
    document.documentElement.dataset.accent = name;
  }
  localStorage.setItem("accentPalette", name);
}

export function initEasterEgg(): void {
  const trigger = document.getElementById("color-easter-egg");
  if (!trigger) return;

  let panel: HTMLDivElement | null = null;
  let open = false;

  function showPanel() {
    panel = document.createElement("div");
    panel.className =
      "fixed bottom-14 right-4 z-[60] flex gap-2 rounded border border-border bg-background p-3 shadow-xl";

    Object.entries(palettes).forEach(([name, palette]) => {
      const btn = document.createElement("button");
      btn.className = "h-6 w-6 rounded-full transition-transform hover:scale-125 focus:outline-none";
      btn.style.background = `linear-gradient(135deg, ${palette.darkAccent}, ${palette.lightAccent})`;
      btn.setAttribute("aria-label", `Switch to ${name} accent`);
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        applyPalette(name as PaletteName);
        hidePanel();
      });
      panel!.appendChild(btn);
    });

    document.body.appendChild(panel);
    open = true;
  }

  function hidePanel() {
    panel?.remove();
    panel = null;
    open = false;
  }

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    if (open) hidePanel();
    else showPanel();
  });

  document.addEventListener("click", () => {
    if (open) hidePanel();
  });
}
