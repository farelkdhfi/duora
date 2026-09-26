// share-template/types.ts

export interface ShareTemplatePreference {
  id: string;
  relationship_id: string;
  template_mode: "preset" | "custom";
  preset_id: string;
  custom_color_from: string | null;
  custom_color_via: string | null;
  custom_color_to: string | null;
}

export interface TemplatePreset {
  id: string;
  name: string;
  isPremium: boolean;
  colorFrom: string;
  colorVia: string;
  colorTo: string;
  // tailwind class untuk dipakai langsung (biar konsisten dengan gradient yang sudah ada)
  gradientClass: string;
}