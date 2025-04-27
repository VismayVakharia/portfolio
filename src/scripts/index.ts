import "../styles/main.css";

import { initAbout } from "./about";
import { initContact } from "./contact";

window.addEventListener("DOMContentLoaded", async () => {
  initAbout();
  initContact();
});
