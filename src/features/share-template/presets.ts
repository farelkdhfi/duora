// share-template/presets.ts

import type { TemplatePreset } from "./types";

export const TEMPLATE_PRESETS: TemplatePreset[] = [
  // 2 preset GRATIS
  {
    id: "sunset",
    name: "Sunset",
    isPremium: false,
    colorFrom: "#ec4899", // pink-500
    colorVia: "#fb7185",  // rose-400
    colorTo: "#fdba74",   // orange-300
    gradientClass: "from-pink-500 via-rose-400 to-orange-300",
  },
  {
    id: "galaxy",
    name: "Galaxy",
    isPremium: false,
    colorFrom: "#9333ea", // purple-600
    colorVia: "#d946ef",  // fuchsia-500
    colorTo: "#ec4899",   // pink-500
    gradientClass: "from-purple-600 via-fuchsia-500 to-pink-500",
  },

  // Preset PREMIUM tambahan
  {
    id: "ocean",
    name: "Ocean",
    isPremium: true,
    colorFrom: "#0ea5e9", // sky-500
    colorVia: "#06b6d4",  // cyan-500
    colorTo: "#14b8a6",   // teal-500
    gradientClass: "from-sky-500 via-cyan-500 to-teal-500",
  },
  {
    id: "forest",
    name: "Forest",
    isPremium: true,
    colorFrom: "#16a34a", // green-600
    colorVia: "#65a30d",  // lime-600
    colorTo: "#eab308",   // yellow-500
    gradientClass: "from-green-600 via-lime-600 to-yellow-500",
  },
  {
    id: "midnight",
    name: "Midnight",
    isPremium: true,
    colorFrom: "#1e293b", // slate-800
    colorVia: "#4338ca",  // indigo-700
    colorTo: "#7e22ce",   // purple-700
    gradientClass: "from-slate-800 via-indigo-700 to-purple-700",
  },
];

export function getPresetById(id: string): TemplatePreset {
  return TEMPLATE_PRESETS.find((p) => p.id === id) ?? TEMPLATE_PRESETS[0];
}

export function getFreePresets(): TemplatePreset[] {
  return TEMPLATE_PRESETS.filter((p) => !p.isPremium);
}