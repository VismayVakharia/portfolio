import headerHTML from "./header.html?raw";

export function initHeader(): void {
  const header = document.getElementById("header");
  if (!header) return;

  header.innerHTML = headerHTML;

  const base = import.meta.env.BASE_URL;
  const isHome = window.location.pathname === base || window.location.pathname === `${base}index.html`;

  (header.querySelector("#nav-home") as HTMLAnchorElement).href = base;
  (header.querySelector("#nav-shelf") as HTMLAnchorElement).href = `${base}shelf/`;
  (header.querySelector("#nav-puzzles") as HTMLAnchorElement).href = `${base}puzzles/`;
  (header.querySelector("#nav-shelf-mobile") as HTMLAnchorElement).href = `${base}shelf/`;
  (header.querySelector("#nav-puzzles-mobile") as HTMLAnchorElement).href = `${base}puzzles/`;

  if (!isHome) {
    document.getElementById("section-subbar")?.remove();
  }

  // Highlight active page link
  const path = window.location.pathname;
  const pageLinks: Record<string, string[]> = {
    shelf: ["#nav-shelf", "#nav-shelf-mobile"],
    puzzles: ["#nav-puzzles", "#nav-puzzles-mobile"],
  };
  for (const [page, selectors] of Object.entries(pageLinks)) {
    if (path.includes(`/${page}/`)) {
      selectors.forEach((sel) => {
        header.querySelector(sel)?.classList.replace("text-foreground-muted", "text-foreground");
      });
    }
  }

  // Mobile menu
  const mobileMenuButton = document.getElementById("mobile-menu-button") as HTMLButtonElement;
  const mobileMenu = document.getElementById("mobile-menu") as HTMLDivElement;
  const menuOverlay = document.getElementById("menu-overlay") as HTMLDivElement;

  function openMenu() {
    mobileMenu.classList.remove("scale-y-0");
    mobileMenu.classList.add("scale-y-100");
    document.body.style.overflow = "hidden";
    menuOverlay.classList.remove("hidden");
  }

  function closeMenu() {
    mobileMenu.classList.add("scale-y-0");
    mobileMenu.classList.remove("scale-y-100");
    document.body.style.overflow = "";
    menuOverlay.classList.add("hidden");
  }

  mobileMenuButton.addEventListener("click", (e) => {
    e.stopPropagation();
    if (mobileMenu.classList.contains("scale-y-0")) openMenu();
    else closeMenu();
  });

  mobileMenu.querySelectorAll<HTMLAnchorElement>("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (!mobileMenu.contains(target) && !mobileMenuButton.contains(target)) {
      closeMenu();
    }
  });
}

export function initScrollSpy(): void {
  const subbar = document.getElementById("section-subbar");
  if (!subbar) return;

  const sectionIds = ["about", "skills", "education-experience", "projects", "publications", "contact"];
  const subbarEl = subbar;

  function setActive(id: string) {
    subbarEl.querySelectorAll<HTMLAnchorElement>(".section-link").forEach((link) => {
      const isActive = link.dataset.section === id;
      link.classList.toggle("text-accent", isActive);
      link.classList.toggle("font-semibold", isActive);
      link.classList.toggle("text-foreground-muted", !isActive);
    });
  }

  // Set first section active initially
  setActive(sectionIds[0]);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    {
      rootMargin: "-57px 0px -55% 0px",
      threshold: 0,
    }
  );

  sectionIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}
