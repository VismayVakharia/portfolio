import publications from "../data/publications.json";
import publicationsHTML from "../components/publications.html?raw";
import publicationCardHTML from "../components/publication-card.html?raw";

type Publication = {
  title: string;
  authors: string[];
  conference: string;
  year: number;
  doi: string;
  file: string;
  icon: string;
};

type Citation = {
  title: string;
  authors: string[];
  conference: string;
  year: number;
  doi: string;
};

export function initPublications(): void {
  const publicationsSection = document.getElementById("publications");
  if (!publicationsSection) return;

  publicationsSection.innerHTML = publicationsHTML;

  const publicationsContainer = document.getElementById("publications-container");
  if (!(publicationsContainer instanceof HTMLDivElement)) return;

  renderPublications(publicationsContainer, publications);

  setupGlobalModalEvents();

  const copyButton = document.getElementById("button-copy-citation") as HTMLButtonElement;
  const closeButton = document.getElementById("button-close-modal") as HTMLButtonElement;

  copyButton.addEventListener("click", copyCitationToClipboard);
  closeButton.addEventListener("click", closeCitationModal);
}

function renderPublications(container: HTMLElement, papers: Publication[]): void {
  const evenCount = papers.length % 2 !== 0 ? papers.length - 1 : papers.length;

  for (let i = 0; i < evenCount; i++) {
    const paper = papers[i];
    const card = createPublicationCard(paper);
    container.appendChild(card);
  }

  container.addEventListener("click", (event) => {
    const target = (event.target as HTMLElement).closest(".cite") as HTMLElement;
    if (target) {
      event.stopPropagation();
      showCitationModal(target.dataset);
    }
  });
}

function createPublicationCard(paper: Publication): HTMLDivElement {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = publicationCardHTML;

  wrapper.querySelector(".title")!.textContent = paper.title;
  wrapper.querySelector(".conference")!.textContent = paper.conference;
  wrapper.querySelector(".year")!.textContent = paper.year.toString();

  const doiLink = wrapper.querySelector("a.doi");
  if (paper.doi) doiLink?.setAttribute("href", `https://doi.org/${paper.doi}`);
  else {
    doiLink?.remove();
  }

  const paperURL = new URL(`../../public/assets/publications/${paper.file}`, import.meta.url).href;
  wrapper.querySelector("a.file")!.setAttribute("href", paperURL);

  const citeButton = wrapper.querySelector(".cite")! as HTMLAnchorElement;
  citeButton.dataset.title = paper.title;
  citeButton.dataset.conference = paper.conference;
  citeButton.dataset.year = paper.year.toString();
  citeButton.dataset.doi = paper.doi;
  citeButton.dataset.authors = JSON.stringify(paper.authors);

  return wrapper;
}

function showCitationModal(data: DOMStringMap): void {
  if (!data.title || !data.authors || !data.conference || !data.year) return;

  const citationTextElement = document.getElementById("citation-text");
  const modal = document.getElementById("citation-modal") as HTMLDivElement;
  const content = modal.querySelector("div") as HTMLDivElement;

  if (!citationTextElement) return;

  const citation: Citation = {
    title: data.title,
    authors: JSON.parse(data.authors),
    conference: data.conference,
    year: parseInt(data.year),
    doi: data.doi ?? "",
  };

  citationTextElement.textContent = formatChicagoCitation(citation);

  modal.classList.remove("hidden", "opacity-0", "pointer-events-none");
  modal.classList.add("opacity-100");
  content.classList.remove("scale-95");
  content.classList.add("scale-100");

  document.body.style.overflow = "hidden";
}

function closeCitationModal(): void {
  const modal = document.getElementById("citation-modal") as HTMLDivElement;
  const content = modal.querySelector("div") as HTMLDivElement;

  modal.classList.add("hidden", "opacity-0", "pointer-events-none");
  modal.classList.remove("opacity-100");
  content.classList.remove("scale-100");
  content.classList.add("scale-95");

  document.body.style.overflow = "";
}

function setupGlobalModalEvents(): void {
  const modal = document.getElementById("citation-modal") as HTMLDivElement;

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeCitationModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("opacity-0")) {
      closeCitationModal();
    }
  });
}

function formatChicagoCitation(citation: Citation): string {
  const authors = formatChicagoAuthors(citation.authors);
  const base = `${authors}, "${citation.title}," ${citation.conference}, ${citation.year}`;
  return citation.doi ? `${base}, doi: ${citation.doi}.` : `${base}.`;
}

function formatChicagoAuthors(authors: string[]): string {
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return `${authors[0]} and ${authors[1]}`;
  if (authors.length <= 10) {
    const last = authors.pop();
    return `${authors.join(", ")}, and ${last}`;
  }
  return `${authors.slice(0, 7).join(", ")}, and et al.`;
}

async function copyCitationToClipboard(): Promise<void> {
  const text = document.getElementById("citation-text")?.textContent;
  if (!text) return;

  const popup = document.getElementById("copy-citation-popup") as HTMLDivElement;
  await navigator.clipboard.writeText(text);

  popup.classList.remove("opacity-0");
  popup.classList.add("opacity-100");

  setTimeout(() => {
    popup.classList.remove("opacity-100");
    popup.classList.add("opacity-0");
  }, 2000);
}
