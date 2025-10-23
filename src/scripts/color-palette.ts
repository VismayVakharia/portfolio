export const colorPalettes = {
  amber: {
    accent0: "#ffb900",
    accent1: "#fe9a00",
    accent2: "#e17100",
  },
  teal: {
    accent0: "#00d5be",
    accent1: "#00bba7",
    accent2: "#009689",
  },
  sky: {
    accent0: "#00bcff",
    accent1: "#00a6f4",
    accent2: "#0084d1",
  },
  indigo: {
    accent0: "#7c86ff",
    accent1: "#615fff",
    accent2: "#4f39f6",
  },
  purple: {
    accent0: "#c27aff",
    accent1: "#ad46ff",
    accent2: "#9810fa",
  },
  rose: {
    accent0: "#ff637e",
    accent1: "#ff2056",
    accent2: "#ec003f",
  },
} as const;

export type ColorPaletteName = keyof typeof colorPalettes;
