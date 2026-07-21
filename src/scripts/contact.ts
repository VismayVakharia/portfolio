export function initContact(): void {
  const contact = document.getElementById("contact");
  if (!contact) return;

  contact.innerHTML = `
    <div class="container mx-auto max-w-xl px-6">
      <h2 class="section-title text-3xl font-bold mb-16">Contact</h2>
      <p class="text-foreground-muted mb-8 leading-relaxed">
        I'm open to research collaborations, robotics engineering conversations, and interesting projects.
      </p>

      <div class="space-y-3">
        <div class="flex items-center space-x-3">
          <a href="mailto:contact@vismayvakharia.com" id="email-text"
            class="text-foreground hover:text-accent transition-colors">
            contact@vismayvakharia.com
          </a>
          <button id="copy-email-btn"
            class="text-foreground-muted hover:text-foreground transition-colors" title="Copy email">
            <i class="fas fa-copy text-sm"></i>
          </button>
        </div>
        <p class="text-foreground-muted text-sm">Bengaluru, KA, India</p>
      </div>

      <div class="mt-8 flex space-x-5">
        <a href="https://github.com/vismay-vakharia/" target="_blank" rel="noopener noreferrer"
          class="text-foreground-muted hover:text-foreground transition-colors">
          <i class="fab fa-github text-xl"></i>
        </a>
        <a href="https://linkedin.com/in/vismay-vakharia/" target="_blank" rel="noopener noreferrer"
          class="text-foreground-muted hover:text-foreground transition-colors">
          <i class="fab fa-linkedin-in text-xl"></i>
        </a>
        <a href="https://scholar.google.com/citations?user=Owl4GugAAAAJ" target="_blank" rel="noopener noreferrer"
          class="text-foreground-muted hover:text-foreground transition-colors">
          <i class="fas fa-graduation-cap text-xl"></i>
        </a>
        <a href="https://orcid.org/0009-0001-3400-5534" target="_blank" rel="noopener noreferrer"
          class="text-foreground-muted hover:text-foreground transition-colors">
          <i class="fab fa-orcid text-xl"></i>
        </a>
      </div>

      <div id="copy-popup" class="fixed bottom-8 left-1/2 -translate-x-1/2
        bg-background-muted text-foreground text-sm px-4 py-2 rounded border border-border
        opacity-0 transition-opacity duration-300 pointer-events-none shadow-lg">
        Email copied!
      </div>
    </div>
  `;

  const emailText = document.getElementById("email-text") as HTMLAnchorElement;
  const copyBtn = document.getElementById("copy-email-btn") as HTMLButtonElement;
  const copyPopup = document.getElementById("copy-popup") as HTMLDivElement;

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(emailText.innerText.trim());
      copyPopup.classList.remove("opacity-0");
      copyPopup.classList.add("opacity-100");
      setTimeout(() => {
        copyPopup.classList.remove("opacity-100");
        copyPopup.classList.add("opacity-0");
      }, 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  });
}
