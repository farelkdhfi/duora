import type { TemplatePreset } from "./types";

export const TEMPLATE_PRESETS: TemplatePreset[] = [
  {
    id: "sunset",
    name: "Sunset",
    minPlan: "free",
    colorFrom: "#ec4899",
    colorVia: "#fb7185",
    colorTo: "#fdba74",
    gradientClass:
      "from-pink-500 via-rose-400 to-orange-300",
  },
  {
    id: "galaxy",
    name: "Galaxy",
    minPlan: "free",
    colorFrom: "#9333ea",
    colorVia: "#d946ef",
    colorTo: "#ec4899",
    gradientClass:
      "from-purple-600 via-fuchsia-500 to-pink-500",
  },
  {
    id: "ocean",
    name: "Ocean",
    minPlan: "plus",
    colorFrom: "#0ea5e9",
    colorVia: "#06b6d4",
    colorTo: "#14b8a6",
    gradientClass:
      "from-sky-500 via-cyan-500 to-teal-500",
  },
  {
    id: "forest",
    name: "Forest",
    minPlan: "plus",
    colorFrom: "#16a34a",
    colorVia: "#65a30d",
    colorTo: "#eab308",
    gradientClass:
      "from-green-600 via-lime-600 to-yellow-500",
  },
  {
    id: "midnight",
    name: "Midnight",
    minPlan: "plus",
    colorFrom: "#1e293b",
    colorVia: "#4338ca",
    colorTo: "#7e22ce",
    gradientClass:
      "from-slate-800 via-indigo-700 to-purple-700",
  },
];

export function getPresetById(
  id: string,
): TemplatePreset {
  return (
    TEMPLATE_PRESETS.find(
      (preset) => preset.id === id,
    ) ?? TEMPLATE_PRESETS[0]
  );
}

export function getFreePresets(): TemplatePreset[] {
  return TEMPLATE_PRESETS.filter(
    (preset) => preset.minPlan === "free",
  );
}