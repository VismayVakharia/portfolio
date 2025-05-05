import imgURL from "../../public/assets/vismay.png?url";
import resumeURL from "../../public/assets/resume.pdf?url";
import aboutHTML from "../components/about.html?raw";

export function initAbout(): void {
  const about = document.getElementById("about");
  if (!about) return;

  const name = "Vismay Vakharia";

  about.innerHTML = aboutHTML;

  const imageTag = about.querySelector("#about-image") as HTMLImageElement;
  imageTag.setAttribute("src", imgURL);
  imageTag.setAttribute("alt", name);

  const nameTag = about.querySelector("#name") as HTMLSpanElement;
  nameTag.innerText = name;

  const resumeLink = about.querySelector("#about-resume") as HTMLAnchorElement;
  resumeLink.href = resumeURL;
}
