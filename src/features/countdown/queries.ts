// countdown/queries.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCountdowns,
  getCountdownById,
  createCountdown,
  updateCountdown,
  deleteCountdown,
  markCountdownCompleted,
  getActiveCountdownsCount,
} from "./api";
import type {
  CreateCountdownInput,
  UpdateCountdownInput,
} from "./types";

export const countdownKeys = {
  all: ["countdowns"] as const,
  lists: () => [...countdownKeys.all, "list"] as const,
  list: (relationshipId: string) =>
    [...countdownKeys.lists(), relationshipId] as const,
  details: () => [...countdownKeys.all, "detail"] as const,
  detail: (id: string) => [...countdownKeys.details(), id] as const,
};

export function useCountdowns(relationshipId: string | undefined) {
  return useQuery({
    queryKey: countdownKeys.list(relationshipId ?? ""),
    queryFn: () => getCountdowns(relationshipId as string),
    enabled: !!relationshipId,
  });
}

export function useCountdown(id: string | undefined) {
  return useQuery({
    queryKey: countdownKeys.detail(id ?? ""),
    queryFn: () => getCountdownById(id as string),
    enabled: !!id,
  });
}

export function useCreateCountdown() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCountdownInput) => createCountdown(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: countdownKeys.list(data.relationship_id),
      });
    },
  });
}

export function useUpdateCountdown() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateCountdownInput) => updateCountdown(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: countdownKeys.list(data.relationship_id),
      });
      queryClient.invalidateQueries({
        queryKey: countdownKeys.detail(data.id),
      });
    },
  });
}

export function useDeleteCountdown(relationshipId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCountdown(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: countdownKeys.list(relationshipId),
      });
    },
  });
}

export function useMarkCountdownCompleted() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markCountdownCompleted(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: countdownKeys.list(data.relationship_id),
      });
      queryClient.invalidateQueries({
        queryKey: countdownKeys.detail(data.id),
      });
    },
  });
}

export function useActiveCountdownsCount(relationshipId: string | undefined) {
  return useQuery({
    queryKey: [...countdownKeys.all, "active-count", relationshipId ?? ""],
    queryFn: () => getActiveCountdownsCount(relationshipId as string),
    enabled: !!relationshipId,
  });
}