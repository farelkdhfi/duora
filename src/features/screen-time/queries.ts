// screen-time/queries.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyScreenTime, addScreenTime, setScreenTimeIconTheme } from "./api";
import type { IconTheme } from "./types";

export const screenTimeKeys = {
  all: ["screen-time"] as const,
  mine: () => [...screenTimeKeys.all, "mine"] as const,
};

export function useMyScreenTime() {
  return useQuery({
    queryKey: screenTimeKeys.mine(),
    queryFn: getMyScreenTime,
    staleTime: 1000 * 60, // 1 menit
  });
}

export function useAddScreenTime() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (seconds: number) => addScreenTime(seconds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: screenTimeKeys.mine() });
    },
  });
}

export function useSetScreenTimeIconTheme() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (theme: IconTheme) => setScreenTimeIconTheme(theme),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: screenTimeKeys.mine() });
    },
  });
}