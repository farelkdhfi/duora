// share-template/api.ts

import { createClient } from "@/lib/supabase/client";
import type { ShareTemplatePreference } from "./types";

const supabase = createClient();

export async function getTemplatePreference(
  relationshipId: string
): Promise<ShareTemplatePreference | null> {
  const { data, error } = await supabase
    .from("share_template_preferences")
    .select("*")
    .eq("relationship_id", relationshipId)
    .maybeSingle(); // boleh gak ada (belum pernah set)

  if (error) throw error;
  return data;
}

export async function upsertTemplatePreference(input: {
  relationshipId: string;
  templateMode: "preset" | "custom";
  presetId: string;
  customColorFrom?: string | null;
  customColorVia?: string | null;
  customColorTo?: string | null;
}): Promise<ShareTemplatePreference> {
  const { data, error } = await supabase
    .from("share_template_preferences")
    .upsert(
      {
        relationship_id: input.relationshipId,
        template_mode: input.templateMode,
        preset_id: input.presetId,
        custom_color_from: input.customColorFrom ?? null,
        custom_color_via: input.customColorVia ?? null,
        custom_color_to: input.customColorTo ?? null,
      },
      { onConflict: "relationship_id" }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}