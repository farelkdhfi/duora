// share-template/queries.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTemplatePreference, upsertTemplatePreference } from "./api";

export const shareTemplateKeys = {
  all: ["share-template"] as const,
  preference: (relationshipId: string) =>
    [...shareTemplateKeys.all, "preference", relationshipId] as const,
};

export function useTemplatePreference(relationshipId: string | undefined) {
  return useQuery({
    queryKey: shareTemplateKeys.preference(relationshipId ?? ""),
    queryFn: () => getTemplatePreference(relationshipId as string),
    enabled: !!relationshipId,
  });
}

export function useUpsertTemplatePreference() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upsertTemplatePreference,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: shareTemplateKeys.preference(data.relationship_id),
      });
    },
  });
}