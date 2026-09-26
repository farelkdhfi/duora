
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { activatePremiumManual, getMySubscription, markExpiryWarningShown, markTrialModalSeen, startTrialManual } from "./api";

export const subscriptionKeys = {
  all: ["subscription"] as const,
  mine: () => [...subscriptionKeys.all, "mine"] as const,
};

export function useMySubscription() {
  return useQuery({
    queryKey: subscriptionKeys.mine(),
    queryFn: getMySubscription,
    staleTime: 1000 * 60, // 1 menit, biar gak terlalu sering re-fetch tapi tetap cukup fresh
  });
}

export function useActivatePremiumManual() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (durationDays?: number) => activatePremiumManual(durationDays),
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

export function useStartTrialManual() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startTrialManual,
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