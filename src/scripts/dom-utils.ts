// Six --color-spine-N cloth tones live in main.css; the modulo keeps callers in range.
export const spineVar = (n: number): string => `var(--color-spine-${(n % 6) + 1})`;
