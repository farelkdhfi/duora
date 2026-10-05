import type {
  WrappedPlanAccess,
  WrappedTemplateInfo,
} from "./types";

export const WRAPPED_TEMPLATES: WrappedTemplateInfo[] = [
  {
    id: "soft",
    name: "Soft Story",
    description: "Minimalis, hangat, seperti halaman jurnal",
    minPlan: "free",
    supportsCustomColor: false,
  },
  {
    id: "bold",
    name: "Bold Wrapped",
    description: "Gradient penuh warna, gaya Spotify Wrapped",
    minPlan: "free",
    supportsCustomColor: true,
  },
  {
    id: "minimal",
    name: "Quiet Minimal",
    description: "Sangat minimalis, fokus ke satu momen utama",
    minPlan: "plus",
    supportsCustomColor: false,
  },
  {
    id: "noir",
    name: "Noir",
    description: "Dark editorial with a refined feel",
    minPlan: "plus",
    supportsCustomColor: false,
  },
  {
    id: "bloom",
    name: "Bloom",
    description: "Romantic, airy and softly layered",
    minPlan: "plus",
    supportsCustomColor: false,
  },
  {
    id: "night",
    name: "Night",
    description: "Cinematic dark with subtle blue glow",
    minPlan: "pro",
    supportsCustomColor: false,
  },
];

export function getTemplateInfo(
  id: string,
): WrappedTemplateInfo {
  return (
    WRAPPED_TEMPLATES.find((t) => t.id === id) ??
    WRAPPED_TEMPLATES[0]
  );
}

export function canAccessWrappedTemplate(
  template: WrappedTemplateInfo,
  plan: WrappedPlanAccess,
): boolean {
  if (plan === "pro") {
    return true;
  }

  if (plan === "plus") {
    return (
      template.minPlan === "free" ||
      template.minPlan === "plus"
    );
  }

  return template.minPlan === "free";
}