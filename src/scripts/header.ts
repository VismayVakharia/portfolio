export function initHeader(): void {
  const header = document.getElementById("header");
  if (!header) return;

  header.innerHTML = `
    <nav
      class="fixed top-0 left-0 w-full bg-gray-100/90 dark:bg-[#050914]/80 backdrop-blur-sm py-4 px-6 flex justify-between items-center shadow-xl z-50">
      <a href="#" id="header-name" class="text-2xl font-bold text-white flex items-center">
        <span
          class="bg-gradient-to-r from-indigo-400 to-indigo-600 dark:from-indigo-600 dark:to-indigo-400 bg-clip-text text-transparent">Vismay
          Vakharia</span>
      </a>

      <div class="hidden md:flex space-x-8">
        <a href="#about"
          class="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">About</a>
        <a href="#contact"
          class="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Contact</a>
      </div>

      <button id="mobile-menu-button" class="md:hidden text-black dark:text-white focus:outline-none">
        <i class="fas fa-bars text-2xl"></i>
      </button>
    </nav>

    <div id="menu-overlay" class="hidden fixed inset-0 bg-black/50 z-40"></div>

    <div id="mobile-menu"
      class="fixed top-16 right-0 w-full bg-gray-800 shadow-lg rounded-b-lg transform scale-y-0 origin-top text-center transition-transform duration-300 md:hidden z-50">
      <div class="flex flex-col p-4 divide-y divide-gray-700">
        <a href="#about"
          class="py-3 text-gray-200 hover:bg-gray-700 hover:text-white transition-colors rounded">About</a>
        <a href="#contact"
          class="py-3 text-gray-200 hover:bg-gray-700 hover:text-white transition-colors rounded">Contact</a>
      </div>
    </div>
  `;

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
}
