import headerHTML from "../components/header.html?raw";

export function initHeader(): void {
  const header = document.getElementById("header");
  if (!header) return;

  header.innerHTML = headerHTML;

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

  function toggleMenu() {
    if (mobileMenu.classList.contains("scale-y-0")) openMenu();
    else closeMenu();
  }

  mobileMenuButton.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  const mobileLinks = mobileMenu.querySelectorAll<HTMLAnchorElement>("a");
  mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (!mobileMenu.contains(target) && !mobileMenuButton.contains(target)) {
      closeMenu();
    }
  });

  const navbar = document.getElementById("navbar");
  const sentinel = document.getElementById("top-sentinel");

  if (!navbar || !sentinel) return;

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      navbar.classList.add("bg-transparent", "dark:bg-transparent");
      navbar.classList.remove("bg-gray-100/90", "dark:bg-[#050914]/80", "shadow-xl");
    } else {
      navbar.classList.remove("bg-transparent", "dark:bg-transparent");
      navbar.classList.add("bg-gray-100/90", "dark:bg-[#050914]/80", "shadow-xl");
    }
  });

  observer.observe(sentinel);
}
