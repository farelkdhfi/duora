// notifications/api.ts

import { createClient } from "@/lib/supabase/client";
import type { Notification } from "./types";

const supabase = createClient();

export async function getMyNotifications(limit: number = 20): Promise<Notification[]> {
  const { data, error } = await supabase.rpc("get_my_notifications", {
    p_limit: limit,
  });

  if (error) throw error;
  return data ?? [];
}

export async function getUnreadCount(): Promise<number> {
  const { data, error } = await supabase.rpc("get_unread_notification_count");
  if (error) throw error;
  return data as number;
}

export async function markAsRead(notificationId: string): Promise<void> {
  const { error } = await supabase.rpc("mark_notification_read", {
    p_notification_id: notificationId,
  });

  if (error) throw error;
}