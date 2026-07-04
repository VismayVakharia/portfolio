import skills from "../data/skills.json";

export function initSkills(): void {
  const skillsSection = document.getElementById("skills");
  if (!(skillsSection instanceof HTMLElement)) return;

  skillsSection.innerHTML = `
    <div class="container mx-auto max-w-4xl px-6">
      <h2 class="section-title text-3xl font-bold mb-16">Skills</h2>
      <div id="skills-container" class="space-y-6"></div>
    </div>
  `;

  const container = document.getElementById("skills-container");
  if (!(container instanceof HTMLDivElement)) return;

  const chipClass = "bg-accent/10 text-accent border border-accent/25 px-3 py-1 rounded text-xs";

  skills.forEach((category) => {
    const div = document.createElement("div");
    div.className = "flex flex-col gap-2 sm:grid sm:grid-cols-[120px_1fr] sm:gap-4 sm:items-start";
    div.innerHTML = `
      <span class="text-xs font-bold text-foreground-muted uppercase tracking-widest sm:pt-1">
        ${category.category}
      </span>
      <div class="flex flex-wrap gap-2">
        ${category.skills.map((s) => `<span class="${chipClass}">${s}</span>`).join("")}
      </div>
    `;
    container.appendChild(div);
  });
}
