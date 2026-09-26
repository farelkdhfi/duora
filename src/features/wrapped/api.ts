// wrapped/api.ts

import { createClient } from "@/lib/supabase/client";
import type { WrappedPreference, WrappedTemplateId, MoodSummaryItem } from "./types";


const supabase = createClient();

export async function getMoodSummary(
  relationshipId: string,
  since?: string // format "YYYY-MM-DD", opsional — kalau kosong berarti dari awal
): Promise<MoodSummaryItem[]> {
  const { data, error } = await supabase.rpc("get_mood_summary", {
    p_relationship_id: relationshipId,
    p_since: since ?? "1900-01-01",
  });

  if (error) throw error;
  return data as MoodSummaryItem[];
}

export async function getCompletedMeetups(relationshipId: string) {
  const { data, error } = await supabase
    .from("meetup_countdowns")
    .select("id, title, distance_km, meetup_date")
    .eq("relationship_id", relationshipId)
    .eq("is_completed", true);

  if (error) throw error;
  return data;
}


export async function getWrappedPreference(
  relationshipId: string
): Promise<WrappedPreference | null> {
  const { data, error } = await supabase
    .from("wrapped_preferences")
    .select("*")
    .eq("relationship_id", relationshipId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function upsertWrappedPreference(input: {
  relationshipId: string;
  templateId: WrappedTemplateId;
  showMood: boolean;
  showMeetup: boolean;
  showGoals: boolean;
  showScreenTime: boolean;
  customColorPrimary?: string | null;
  customColorSecondary?: string | null;
}): Promise<WrappedPreference> {
  const { data, error } = await supabase
    .from("wrapped_preferences")
    .upsert(
      {
        relationship_id: input.relationshipId,
        template_id: input.templateId,
        show_mood: input.showMood,
        show_meetup: input.showMeetup,
        show_goals: input.showGoals,
        show_screen_time: input.showScreenTime,
        custom_color_primary: input.customColorPrimary ?? null,
        custom_color_secondary: input.customColorSecondary ?? null,
      },
      { onConflict: "relationship_id" }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getScreenTimeForWrapped(relationshipId: string) {
  const { data, error } = await supabase
    .from("screen_time_tracking")
    .select("total_seconds, icon_theme")
    .eq("relationship_id", relationshipId)
    .maybeSingle();

  if (error) throw error;
  return data;
}