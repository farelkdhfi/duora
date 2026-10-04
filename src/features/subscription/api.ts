// subscription/api.ts

import { createClient } from "@/lib/supabase/client";
import type { MySubscription, SubscriptionPlanType } from "./types";

const supabase = createClient();

export async function getMySubscription(): Promise<MySubscription | null> {
  const { data, error } = await supabase.rpc("get_my_subscription");
  if (error) throw error;
  return data?.[0] ?? null;
}

// GANTI: activatePremiumManual -> activatePlanManual, terima parameter plan
export async function activatePlanManual(
  planType: "plus" | "pro",
  durationDays: number = 30
): Promise<MySubscription> {
  const { data, error } = await supabase.rpc("activate_plan_manual", {
    p_plan_type: planType,
    p_duration_days: durationDays,
  });

  if (error) throw error;
  return data;
}

export async function startTrialManual(): Promise<MySubscription> {
  const { data, error } = await supabase.rpc("start_trial_manual");
  if (error) throw error;
  return data;
}

export async function markTrialModalSeen(): Promise<void> {
  const { error } = await supabase.rpc("mark_trial_modal_seen");
  if (error) throw error;
}

export async function markExpiryWarningShown(): Promise<void> {
  const { error } = await supabase.rpc("mark_expiry_warning_shown");
  if (error) throw error;
}

// TAMBAH BARU
export async function getDebateRoomsCreatedThisMonth(
  relationshipId: string
): Promise<number> {
  const { data, error } = await supabase.rpc(
    "get_debate_rooms_created_this_month",
    { p_relationship_id: relationshipId }
  );

  if (error) throw error;
  return data as number;
}