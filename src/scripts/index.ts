import "../styles/main.css";

import { loadFull } from "tsparticles";
import { type Engine, tsParticles } from "@tsparticles/engine";

import darkFaviconURL from "../dark-favicon.png?url";

import { particlesConfig } from "./particles-config";
import { initHeader } from "./header";
import { initAbout } from "./about";
import { initSkills } from "./skills";
import { initEducation } from "./education-experience";
import { initProjects } from "./projects";
import { initPublications } from "./publications";
import { initContact } from "./contact";
import { initFooter } from "./footer";

window.addEventListener("DOMContentLoaded", async () => {
  initFavicon();
  initHeader();
  initAbout();
  initSkills();
  initEducation();
  initProjects();
  initPublications();
  initContact();
  initFooter();

  await initParticles(tsParticles);
});

async function initParticles(engine: Engine): Promise<void> {
  try {
    await loadFull(engine);
    await engine.load(particlesConfig);
  } catch (error) {
    console.error("Failed to load particles:", error);
  }
}

function initFavicon() {
  const linkFavicon = document.getElementById("favicon") as HTMLLinkElement;
  linkFavicon.href = darkFaviconURL;
}
