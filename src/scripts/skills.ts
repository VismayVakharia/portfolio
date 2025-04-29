import skills from "../data/skills.json";

export function initSkills(): void {
  const skills_section = document.getElementById("skills");
  if (!(skills_section instanceof HTMLElement)) return;

  skills_section.innerHTML = `
    <div class="container mx-auto px-6">
      <h2 class="section-title text-3xl font-bold text-center mb-16">My Skills</h2>
      <div id="skills-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"></div>
    </div>
  `;

  const skills_container = document.getElementById("skills-container");
  if (!(skills_container instanceof HTMLDivElement)) return;

  skills.forEach((category) => {
    const section = document.createElement("div");
    section.className =
      "bg-gray-200 dark:bg-gray-800 p-8 rounded-lg shadow-lg transition-transform transform hover:scale-105 group hover:shadow-2xl hover:ring-2 hover:ring-indigo-400/50";

    section.innerHTML = `
    <h3 class="text-xl font-semibold mb-4 flex items-center">
      <i class="${category.icon} text-indigo-500 mr-2"></i> ${category.category}
    </h3>
    <div class="space-y-4">
      ${category.skills
        .map(
          (skill) => `
      <div>
        <div class="flex justify-between mb-1">
          <span>${skill.name}</span>
        </div>
        <div class="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2.5">
          <div
            class="skill-bar h-2.5 rounded-full bg-gradient-to-r dark:from-indigo-600 dark:to-indigo-400 transition-all duration-1000 opacity-0"
            style="width: 0%"
            data-level="${skill.level}%"></div>
        </div>
      </div>
      `
        )
        .join("")}
    </div>
  `;
    skills_container.appendChild(section);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target as HTMLElement;
        const level = el.dataset.level || "0%";

        if (entry.isIntersecting) {
          el.style.width = level;
          el.classList.remove("opacity-0");
        } else {
          el.style.width = "0%";
          el.classList.add("opacity-0");
        }
      });
    },
    { threshold: 0.3 }
  );

  document.querySelectorAll<HTMLDivElement>(".skill-bar").forEach((el) => {
    observer.observe(el);
  });
}
