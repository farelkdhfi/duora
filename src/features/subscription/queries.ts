// subscription/queries.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMySubscription,
  activatePlanManual,
  startTrialManual,
  markTrialModalSeen,
  markExpiryWarningShown,
  getDebateRoomsCreatedThisMonth,
} from "./api";

export const subscriptionKeys = {
  all: ["subscription"] as const,
  mine: () => [...subscriptionKeys.all, "mine"] as const,
};

export function useMySubscription() {
  return useQuery({
    queryKey: subscriptionKeys.mine(),
    queryFn: getMySubscription,
    staleTime: 1000 * 60,
  });
}

// GANTI nama hook: useActivatePremiumManual -> useActivatePlanManual
export function useActivatePlanManual() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      planType,
      durationDays,
    }: {
      planType: "plus" | "pro";
      durationDays?: number;
    }) => activatePlanManual(planType, durationDays),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.mine() });
    },
  });
}

export function useStartTrialManual() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startTrialManual,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.mine() });
    },
  });
}

export function useMarkTrialModalSeen() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markTrialModalSeen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.mine() });
    },
  });
}

export function useMarkExpiryWarningShown() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markExpiryWarningShown,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.mine() });
    },
  });
}

// TAMBAH BARU
export function useDebateRoomsCreatedThisMonth(relationshipId: string | undefined) {
  return useQuery({
    queryKey: [...subscriptionKeys.all, "debate-rooms-this-month", relationshipId ?? ""],
    queryFn: () => getDebateRoomsCreatedThisMonth(relationshipId as string),
    enabled: !!relationshipId,
  });
}