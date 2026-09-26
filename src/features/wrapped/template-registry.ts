// wrapped/template-registry.ts

import type { WrappedTemplateInfo } from "./types";

export const WRAPPED_TEMPLATES: WrappedTemplateInfo[] = [
  {
    id: "soft",
    name: "Soft Story",
    description: "Minimalis, hangat, seperti halaman jurnal",
    isPremium: false,
    supportsCustomColor: false,
  },
  {
    id: "bold",
    name: "Bold Wrapped",
    description: "Gradient penuh warna, gaya Spotify Wrapped",
    isPremium: false,
    supportsCustomColor: true,
  },
  {
    id: "minimal",
    name: "Quiet Minimal",
    description: "Sangat minimalis, fokus ke satu momen utama",
    isPremium: true,
    supportsCustomColor: false,
  },
];

export function getTemplateInfo(id: string): WrappedTemplateInfo {
  return WRAPPED_TEMPLATES.find((t) => t.id === id) ?? WRAPPED_TEMPLATES[0];
}