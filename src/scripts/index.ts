import "../styles/main.css";

import { loadFull } from "tsparticles";
import { type Engine, tsParticles } from "@tsparticles/engine";

import darkFaviconURL from "../dark-favicon.png?url";

import { particlesConfig } from "./particles-config";
import { initHeader } from "./header";
import { initAbout } from "./about";
import { initColorPicker } from "./color-picker";
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
  initColorPicker();
  initSkills();
  initEducation();
  initProjects();
  initPublications();
  initContact();
  initFooter();

  await initParticles(tsParticles);

  document.documentElement.addEventListener("accentChange", updateParticlesColor);
});

async function initParticles(engine: Engine): Promise<void> {
  try {
    await loadFull(engine);
    await engine.load(particlesConfig);
    updateParticlesColor();
  } catch (error) {
    console.error("Failed to load particles:", error);
  }
}

function initFavicon() {
  const linkFavicon = document.getElementById("favicon") as HTMLLinkElement;
  linkFavicon.href = darkFaviconURL;
}

async function updateParticlesColor() {
  const accent1 = getComputedStyle(document.documentElement).getPropertyValue("--color-accent-1").trim();
  const accent2 = getComputedStyle(document.documentElement).getPropertyValue("--color-accent-2").trim();

  const container = tsParticles.domItem(0);
  if (container) {
    container.options.particles.color.value = accent2;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (container.options.particles as any).links.color.value = accent1;
    // container.options.interactivity.modes.grab.links.color = accent1;
    await container.refresh();
  }
}
