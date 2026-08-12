import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  createPlannerEvent,
  deletePlannerEvent,
  getPlannerEvents,
} from './api'

export const plannerKeys = {
  all: ['planner'] as const,

  relationship: (
    relationshipId: string,
  ) =>
    [
      ...plannerKeys.all,
      relationshipId,
    ] as const,
}

export function usePlannerEvents(
  relationshipId: string,
) {
  return useQuery({
    queryKey:
      plannerKeys.relationship(
        relationshipId,
      ),

    queryFn: () =>
      getPlannerEvents(
        relationshipId,
      ),

    enabled:
      Boolean(relationshipId),
  })
}

export function useCreatePlannerEvent() {
  const queryClient =
    useQueryClient()

  return useMutation({
    mutationFn:
      createPlannerEvent,

    onSuccess: (
      _data,
      variables,
    ) => {
      queryClient.invalidateQueries({
        queryKey:
          plannerKeys.relationship(
            variables.relationshipId,
          ),
      })
    },
  })
}

export function useDeletePlannerEvent() {
  const queryClient =
    useQueryClient()

  return useMutation({
    mutationFn:
      deletePlannerEvent,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          plannerKeys.all,
      })
    },
  })
}