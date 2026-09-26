// share-template/utils.ts

import { getPresetById } from "./presets";
import type { ShareTemplatePreference } from "./types";

export interface ResolvedTemplateColors {
  gradientClass: string;
}

export function resolveTemplateColors(
  preference: ShareTemplatePreference | null
): ResolvedTemplateColors {
  // Default (belum pernah set preference): pakai preset pertama (sunset)
  if (!preference) {
    return { gradientClass: getPresetById("sunset").gradientClass };
  }

  if (preference.template_mode === "custom" &&
      preference.custom_color_from &&
      preference.custom_color_via &&
      preference.custom_color_to) {
    // Custom pakai inline style, bukan tailwind class (karena warnanya dinamis)
    return {
      gradientClass: "", // dikosongkan, akan pakai inline style
    };
  }

  return { gradientClass: getPresetById(preference.preset_id).gradientClass };
}

// Untuk custom mode, generate inline style CSS
export function getCustomGradientStyle(
  preference: ShareTemplatePreference | null
): React.CSSProperties | undefined {
  if (
    preference?.template_mode === "custom" &&
    preference.custom_color_from &&
    preference.custom_color_via &&
    preference.custom_color_to
  ) {
    return {
      backgroundImage: `linear-gradient(to bottom right, ${preference.custom_color_from}, ${preference.custom_color_via}, ${preference.custom_color_to})`,
    };
  }
  return undefined;
}