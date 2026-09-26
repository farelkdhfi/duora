// countdown/api.ts

import { createClient } from "@/lib/supabase/client";
import type {
  MeetupCountdown,
  CreateCountdownInput,
  UpdateCountdownInput,
} from "./types";

const supabase = createClient();

export async function getCountdowns(
  relationshipId: string
): Promise<MeetupCountdown[]> {
  const { data, error } = await supabase
    .from("meetup_countdowns")
    .select("*")
    .eq("relationship_id", relationshipId)
    .order("meetup_date", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getCountdownById(
  id: string
): Promise<MeetupCountdown> {
  const { data, error } = await supabase
    .from("meetup_countdowns")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createCountdown(
  input: CreateCountdownInput
): Promise<MeetupCountdown> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("meetup_countdowns")
    .insert({
      ...input,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCountdown(
  input: UpdateCountdownInput
): Promise<MeetupCountdown> {
  const { id, ...rest } = input;

  const { data, error } = await supabase
    .from("meetup_countdowns")
    .update(rest)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCountdown(id: string): Promise<void> {
  const { error } = await supabase
    .from("meetup_countdowns")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function markCountdownCompleted(
  id: string
): Promise<MeetupCountdown> {
  const { data, error } = await supabase
    .from("meetup_countdowns")
    .update({
      is_completed: true,
      completed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getActiveCountdownsCount(
  relationshipId: string
): Promise<number> {
  const { count, error } = await supabase
    .from("meetup_countdowns")
    .select("*", { count: "exact", head: true })
    .eq("relationship_id", relationshipId)
    .eq("is_completed", false);

  if (error) throw error;
  return count ?? 0;
}