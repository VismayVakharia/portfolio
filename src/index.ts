import "./styles/main.css";

import darkFaviconURL from "./dark-favicon.png?url";
import { initTheme } from "./scripts/theme";
import { initHeader, initScrollSpy } from "./components/header/header";
import { initAbout } from "./scripts/about";
import { initSkills } from "./scripts/skills";
import { initEducation } from "./scripts/education-experience";
import { initProjects } from "./scripts/projects";
import { initPublications } from "./scripts/publications";
import { initContact } from "./scripts/contact";
import { initFooter } from "./components/footer/footer";

window.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initFavicon();
  initHeader();
  initAbout();
  initSkills();
  initEducation();
  initProjects();
  initPublications();
  initContact();
  initFooter();
  initScrollSpy();
});

function initFavicon(): void {
  const linkFavicon = document.getElementById("favicon") as HTMLLinkElement;
  linkFavicon.href = darkFaviconURL;
}
