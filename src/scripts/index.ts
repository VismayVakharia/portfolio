import "../styles/main.css";

import { loadFull } from "tsparticles";
import { type Engine, tsParticles } from "@tsparticles/engine";
import { particlesConfig } from "./particles-config";

import { initHeader } from "./header";
import { initAbout } from "./about";
import { initSkills } from "./skills";
import { initContact } from "./contact";

window.addEventListener("DOMContentLoaded", async () => {
  initHeader();
  initAbout();
  initSkills();
  initContact();

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
