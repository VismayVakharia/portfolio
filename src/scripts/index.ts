import "../styles/main.css";

import { initHeader } from "./header";
import { initAbout } from "./about";
import { initContact } from "./contact";

window.addEventListener("DOMContentLoaded", async () => {
  initHeader();
  initAbout();
  initContact();
});
