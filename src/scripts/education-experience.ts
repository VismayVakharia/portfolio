import education_experience_HTML from "../components/education-experience.html?raw";

export function initEducation(): void {
  const education_experience = document.getElementById("education-experience");
  if (!education_experience) return;

  education_experience.innerHTML = education_experience_HTML;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-fadeInUp");
      } else {
        entry.target.classList.remove("animate-fadeInUp");
      }
    });
  });

  document.querySelectorAll<HTMLDivElement>("#timeline-item").forEach((el) => {
    observer.observe(el);
  });
}
