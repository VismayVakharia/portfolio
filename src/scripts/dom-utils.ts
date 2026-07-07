export function stars(rating: number): string {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

export function renderGroup(label: string, rows: HTMLElement[], containerClass = "space-y-6"): HTMLDivElement {
  const wrap = document.createElement("div");
  const heading = document.createElement("h3");
  heading.className = "text-foreground-muted mb-4 text-xs font-bold uppercase tracking-widest";
  heading.textContent = label;
  const list = document.createElement("div");
  list.className = containerClass;
  rows.forEach((row) => list.appendChild(row));
  wrap.appendChild(heading);
  wrap.appendChild(list);
  return wrap;
}
