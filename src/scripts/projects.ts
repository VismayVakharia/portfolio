import projects from "../data/projects.json";
import projectsHTML from "../components/projects.html?raw";
import projectCardHTML from "../components/project-card.html?raw";

type Project = {
  title: string;
  subtitle: string;
  details: string[];
  tags: string[];
  github: string;
  link: string;
  image: string;
};

export function initProjects(): void {
  const projectsSection = document.getElementById("projects");
  if (!projectsSection) return;

  projectsSection.innerHTML = projectsHTML;

  const projectsContainer = document.getElementById("projects-container");
  if (!(projectsContainer instanceof HTMLDivElement)) return;

  renderProjects(projectsContainer, projects);

  const buttons = document.querySelectorAll("[data-toggle-btn]");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const desc = btn.previousElementSibling as HTMLElement;

      if (desc.classList.contains("line-clamp-3")) {
        desc.classList.remove("line-clamp-3");
        btn.textContent = "Show Less";
      } else {
        desc.classList.add("line-clamp-3");
        btn.textContent = "Show More";
      }
    });
  });
}

function renderProjects(container: HTMLElement, projects: Project[]): void {
  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    const card = createProjectCard(project);
    container.appendChild(card);
  }
}

function createProjectCard(project: Project): HTMLDivElement {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = projectCardHTML;

  wrapper.querySelector(".title")!.textContent = project.title;
  wrapper.querySelector(".subtitle")!.textContent = project.subtitle;
  wrapper.querySelector(".subtitle")!.textContent = project.subtitle;

  const detailsList = wrapper.querySelector("ul.details") as HTMLUListElement;
  project.details.forEach((detail) => {
    const listItem = document.createElement("li");
    listItem.innerText = detail;
    detailsList.appendChild(listItem);
  });

  const tagListDiv = wrapper.querySelector("div.tag-list") as HTMLDivElement;
  project.tags.forEach((tag) => {
    const tagDiv = document.createElement("div");
    tagListDiv.appendChild(tagDiv);
    const tagSpan = document.createElement("span");
    tagDiv.appendChild(tagSpan);

    tagSpan.className =
      "bg-indigo-100/60 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs px-3 py-1 rounded-full hover:bg-gray-800 hover:ring-1 hover:ring-indigo-700";
    tagSpan.innerText = tag;
  });

  const imageTag = wrapper.querySelector("img.image");
  if (project.image) {
    imageTag?.setAttribute("src", project.image);
    imageTag?.setAttribute("alt", project.title);
  } else {
    imageTag?.remove();
  }

  const githubLink = wrapper.querySelector("a.github");
  if (project.github) githubLink?.setAttribute("href", `${project.github}`);
  else {
    githubLink?.remove();
  }

  const link = wrapper.querySelector("a.link");
  if (project.link) link?.setAttribute("href", `${project.link}`);
  else {
    link?.remove();
  }

  return wrapper;
}
