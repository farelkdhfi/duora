// notifications/queries.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyNotifications, getUnreadCount, markAsRead } from "./api";

export const notificationKeys = {
  all: ["notifications"] as const,
  list: () => [...notificationKeys.all, "list"] as const,
  unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
};

export function useMyNotifications() {
  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn: () => getMyNotifications(),
    refetchInterval: 15_000,
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: getUnreadCount,
    refetchInterval: 15_000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
    },
  });
}