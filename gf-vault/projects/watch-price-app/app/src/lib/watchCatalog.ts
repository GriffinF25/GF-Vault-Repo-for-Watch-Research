// Mirrors GF Vault's Watch Pricing Genius brand/model expertise
// (gf-vault/agents/watch-pricing-genius.md) so the form's dropdowns match
// what the pricing methodology actually knows best. "Other" always falls
// back to free text — this list isn't meant to be exhaustive.
export const BRAND_MODELS: Record<string, string[]> = {
  Rolex: ["Submariner", "Daytona", "GMT-Master II", "Day-Date", "Datejust", "Air-King", "Explorer"],
  Tudor: ["Black Bay", "Submariner", "Pelagos", "Day-Date", "Prince"],
  Omega: ["Seamaster", "Speedmaster", "De Ville", "Constellation"],
  "Grand Seiko": ["Sport", "Heritage", "Elegance", "Professional"],
  Breitling: ["Navitimer", "Chronomat", "Superocean", "Avenger"],
  "TAG Heuer": ["Carrera", "Aquaracer", "Monaco", "Formula 1"],
  Cartier: ["Santos", "Tank", "Ballon Bleu", "Panthère", "Drive de Cartier"],
  Panerai: ["Luminor", "Radiomir", "Submersible", "Due"],
};

export const OTHER_BRAND = "__other__";
export const OTHER_MODEL = "__other__";

export const BRAND_OPTIONS = [
  ...Object.keys(BRAND_MODELS).map((b) => ({ label: b, value: b })),
  { label: "Other brand…", value: OTHER_BRAND },
];

export const CONDITION_OPTIONS = [
  { label: "Like-new", value: "Like-new" },
  { label: "Excellent", value: "Excellent" },
  { label: "Very Good", value: "Very Good" },
  { label: "Good", value: "Good" },
  { label: "Fair", value: "Fair" },
];

export const SET_OPTIONS = [
  { label: "Full set (box & papers)", value: "Full set (box & papers)" },
  { label: "Box only", value: "Box only" },
  { label: "Papers only", value: "Papers only" },
  { label: "Watch only (no box/papers)", value: "Watch only (no box/papers)" },
];
