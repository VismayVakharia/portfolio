export function initContact(): void {
  const contact = document.getElementById("contact");
  if (!contact) return;

  contact.innerHTML = `
    <div class="container mx-auto px-6">
        <h2 class="section-title text-3xl font-bold text-center mb-16">Get In Touch</h2>

        <div class="flex flex-col lg:flex-row gap-12">
            <!-- Contact Info -->
            <div class="w-full lg:w-1/3">
                <div class="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
                    <h3 class="text-xl font-semibold mb-4">Contact Information</h3>
                    <div class="space-y-4">
                        <div id="email-container" class="flex items-start relative group">
                            <div class="bg-indigo-400/20 dark:bg-indigo-600/20 p-3 rounded-lg mr-4 w-12 text-center">
                                <i class="fas fa-envelope text-indigo-600 dark:text-indigo-400"></i>
                            </div>

                            <div class="block items-center space-x-2">
                                <div class="flex">
                                    <p class="text-gray-600 dark:text-gray-400 text-sm">Email</p>
                                    <button id="copy-email-btn"
                                        class="ml-2 opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity duration-300 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 cursor-pointer top-0 right-0"
                                        title="Copy email">
                                        <i class="fas fa-copy"></i>
                                    </button>
                                </div>
                                <a href="mailto:contact@vismayvakharia.com" id="email-text"
                                    class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
                                    contact@vismayvakharia.com
                                </a>
                            </div>

                            <div id="copy-popup" class="fixed bottom-8 left-1/2 transform -translate-x-1/2
                                            bg-green-500 text-white text-sm px-4 py-2 rounded-lg
                                            opacity-0 transition-all duration-300 pointer-events-none
                                            shadow-lg">
                                Email copied to clipboard!
                            </div>
                        </div>
                        <div class="flex items-start">
                            <div class="bg-indigo-400/20 dark:bg-indigo-600/20 p-3 rounded-lg mr-4 w-12 text-center">
                                <i class="fas fa-map-marker-alt text-indigo-600 dark:text-indigo-400"></i>
                            </div>
                            <div>
                                <p class="text-gray-600 dark:text-gray-400 text-sm">Location</p>
                                <p class="text-black dark:text-white">Bengaluru, KA, India</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 class="text-xl font-semibold mb-4">Connect With Me</h3>
                    <div class="flex space-x-4 mt-4">
                        <a href="https://github.com/VismayVakharia" target="_blank" rel="noopener noreferrer"
                            class="group flex items-center overflow-hidden bg-gray-300 dark:bg-gray-700 hover:bg-indigo-400 dark:hover:bg-indigo-600 transition-all duration-300 ease-in-out rounded-full pr-4 pl-3 h-10 w-10 hover:w-24">
                            <i class="fab fa-github text-black dark:text-white fa-md"></i>
                            <span
                                class="ml-2 text-black dark:text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-[-10px] transition-all duration-300 text-sm whitespace-nowrap">
                                GitHub
                            </span>
                        </a>
                        <a href="https://www.linkedin.com/in/vismay-vakharia/" target="_blank" rel="noopener noreferrer"
                            class="group flex items-center overflow-hidden bg-gray-300 dark:bg-gray-700 hover:bg-indigo-400 dark:hover:bg-indigo-600 transition-all duration-300 ease-in-out rounded-full pr-4 pl-3 h-10 w-10 hover:w-26">
                            <i class="fab fa-linkedin-in text-black dark:text-white fa-md"></i>
                            <span
                                class="ml-2 text-black dark:text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-[-10px] transition-all duration-300 text-sm whitespace-nowrap">
                                Linkedin
                            </span>
                        </a>
                        <a href="https://scholar.google.com/citations?user=Owl4GugAAAAJ" target="_blank"
                            rel="noopener noreferrer"
                            class="group flex items-center overflow-hidden bg-gray-300 dark:bg-gray-700 hover:bg-indigo-400 dark:hover:bg-indigo-600 transition-all duration-300 ease-in-out rounded-full pr-4 pl-3 h-10 w-10 hover:w-39">
                            <i class="fas fa-graduation-cap text-black dark:text-white fa-md"></i>
                            <span
                                class="ml-2 text-black dark:text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-[-10px] transition-all duration-300 text-sm whitespace-nowrap">
                                Google Scholar
                            </span>
                        </a>
                        <a href="https://orcid.org/0009-0001-3400-5534" target="_blank" rel="noopener noreferrer"
                            class="group flex items-center overflow-hidden bg-gray-300 dark:bg-gray-700 hover:bg-indigo-400 dark:hover:bg-indigo-600 transition-all duration-300 ease-in-out rounded-full pr-4 pl-3 h-10 w-10 hover:w-22">
                            <i class="fab fa-brands fa-orcid text-black dark:text-white fa-md"></i>
                            <span
                                class="ml-2 text-black dark:text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-[-10px] transition-all duration-300 text-sm whitespace-nowrap">
                                Orcid
                            </span>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Contact Form -->
            <div class="w-full lg:w-2/3">
                <div class="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 class="text-xl font-semibold mb-6">Send Me a Message</h3>
                    <form id="contact-form" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label for="name"
                                    class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Your
                                    Name</label>
                                <input type="text" id="name" name="name" class="bg-gray-300 dark:bg-gray-700 border border-gray-400 dark:border-gray-600 text-black dark:text-white text-sm rounded-lg focus:ring-indigo-500
                                            focus:border-indigo-500 block w-full p-3" placeholder="John Doe" required>
                            </div>
                            <div>
                                <label for="email"
                                    class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Your
                                    Email</label>
                                <input type="email" id="email" name="email" class="bg-gray-300 dark:bg-gray-700 border border-gray-400 dark:border-gray-600 text-black dark:text-white text-sm rounded-lg focus:ring-indigo-500
                                            focus:border-indigo-500 block w-full p-3" placeholder="john@example.com"
                                    required>
                            </div>
                        </div>

                        <div>
                            <label for="subject"
                                class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                            <input type="text" id="subject" name="subject" class="bg-gray-300 dark:bg-gray-700 border border-gray-400 dark:border-gray-600 text-black dark:text-white text-sm rounded-lg focus:ring-indigo-500
                                        focus:border-indigo-500 block w-full p-3" placeholder="Project Inquiry" required>
                        </div>

                        <div>
                            <label for="message"
                                class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Your Message</label>
                            <textarea id="message" rows="6" name="message" class="bg-gray-300 dark:bg-gray-700 border border-gray-400 dark:border-gray-600 text-black dark:text-white text-sm rounded-lg focus:ring-indigo-500
                                            focus:border-indigo-500 block w-full p-3"
                                placeholder="I'd like to discuss a project..." required></textarea>
                        </div>

                        <button type="submit" id="submit-button" class="w-full bg-indigo-400 dark:bg-indigo-600 hover:bg-indigo-300 dark:hover:bg-indigo-700 text-black dark:text-white font-medium py-3 px-6 rounded-lg
                                        transition-colors duration-300 shadow-lg flex items-center justify-center">
                            <i class="fas fa-paper-plane mr-2"></i> Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
  `;

  const emailText = document.getElementById("email-text") as HTMLAnchorElement;
  const copyIconButton = document.getElementById("copy-email-btn") as HTMLButtonElement;
  const copyPopup = document.getElementById("copy-popup") as HTMLDivElement;

  async function copyEmail() {
    const email = emailText.innerText.trim();

    try {
      await navigator.clipboard.writeText(email);

      copyPopup.classList.remove("opacity-0");
      copyPopup.classList.add("opacity-100");

      copyIconButton.classList.add("animate-spin");

      setTimeout(() => {
        copyPopup.classList.remove("opacity-100");
        copyPopup.classList.add("opacity-0");

        copyIconButton.classList.remove("animate-spin");
      }, 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  }

  copyIconButton.addEventListener("click", copyEmail);

  const contactForm = document.getElementById("contact-form") as HTMLFormElement;
  const submitButton = document.getElementById("submit-button") as HTMLButtonElement;

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);

      submitButton.disabled = true;
      submitButton.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> Sending...`;

      try {
        const response = await fetch("https://formspree.io/f/xwpkvdjo", {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          console.log(response);
          alert("Thank you for your message!");
          contactForm.reset();
        } else {
          alert("Oops! There was a problem submitting your form.");
        }
      } catch (error) {
        console.error(error);
        alert("There was an error submitting the form.");
      } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = `<i class="fas fa-paper-plane mr-2"></i> Send Message`;
      }
    });
  }
}
