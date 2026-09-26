// wrapped/queries.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMoodSummary, getScreenTimeForWrapped } from "./api";
import { getCompletedMeetups } from "./api";
import { getWrappedPreference, upsertWrappedPreference } from "./api";

export const wrappedKeys = {
  all: ["wrapped"] as const,
  moodSummary: (relationshipId: string, since?: string) =>
    [...wrappedKeys.all, "mood-summary", relationshipId, since ?? "all"] as const,
};

export function useMoodSummary(relationshipId: string | undefined, since?: string) {
  return useQuery({
    queryKey: wrappedKeys.moodSummary(relationshipId ?? "", since),
    queryFn: () => getMoodSummary(relationshipId as string, since),
    enabled: !!relationshipId,
  });
}

export function useCompletedMeetups(relationshipId: string | undefined) {
  return useQuery({
    queryKey: [...wrappedKeys.all, "completed-meetups", relationshipId ?? ""],
    queryFn: () => getCompletedMeetups(relationshipId as string),
    enabled: !!relationshipId,
  });
}


export function useWrappedPreference(relationshipId: string | undefined) {
  return useQuery({
    queryKey: [...wrappedKeys.all, "preference", relationshipId ?? ""],
    queryFn: () => getWrappedPreference(relationshipId as string),
    enabled: !!relationshipId,
  });
}

export function useUpsertWrappedPreference() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upsertWrappedPreference,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [...wrappedKeys.all, "preference", data.relationship_id],
      });
    },
  });
}

export function useScreenTimeForWrapped(relationshipId: string | undefined) {
  return useQuery({
    queryKey: [...wrappedKeys.all, "screen-time", relationshipId ?? ""],
    queryFn: () => getScreenTimeForWrapped(relationshipId as string),
    enabled: !!relationshipId,
  });
}