export type CountdownPlanAccess =
  | "free"
  | "plus"
  | "pro";

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
  minPlan: CountdownPlanAccess;
  colorFrom: string;
  colorVia: string;
  colorTo: string;
  gradientClass: string;
}

export function canAccessTemplate(
  preset: TemplatePreset,
  plan: CountdownPlanAccess,
): boolean {
  if (plan === "pro") {
    return true;
  }

  if (plan === "plus") {
    return (
      preset.minPlan === "free" ||
      preset.minPlan === "plus"
    );
  }

  return preset.minPlan === "free";
}