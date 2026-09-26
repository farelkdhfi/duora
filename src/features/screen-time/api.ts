// screen-time/api.ts

import { createClient } from "@/lib/supabase/client";
import type { ScreenTimeTracking, IconTheme } from "./types";

const supabase = createClient();

export async function getMyScreenTime(): Promise<ScreenTimeTracking | null> {
  const { data, error } = await supabase.rpc("get_my_screen_time");
  if (error) throw error;
  return data;
}

export async function addScreenTime(seconds: number): Promise<ScreenTimeTracking> {
  const { data, error } = await supabase.rpc("add_screen_time", {
    p_seconds: seconds,
  });
  if (error) throw error;
  return data;
}

export async function setScreenTimeIconTheme(
  theme: IconTheme
): Promise<ScreenTimeTracking> {
  const { data, error } = await supabase.rpc("set_screen_time_icon_theme", {
    p_theme: theme,
  });
  if (error) throw error;
  return data;
}