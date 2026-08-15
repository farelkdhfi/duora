import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  createSaving,
  deleteSaving,
  getGoalSavings,
  getGoalsWithSavingsSummary,
} from './api'

export const savingsKeys = {
  all: ['savings'] as const,

  goal: (goalId: string) =>
    [
      ...savingsKeys.all,
      'goal',
      goalId,
    ] as const,

  summary: (relationshipId: string) =>
    [
      ...savingsKeys.all,
      'relationship',
      relationshipId,
      'summary',
    ] as const,
}

export function useGoalSavings(
  goalId: string,
) {
  return useQuery({
    queryKey:
      savingsKeys.goal(goalId),

    queryFn: () =>
      getGoalSavings(goalId),

    enabled: Boolean(goalId),
  })
}

export function useCreateSaving() {
  const queryClient =
    useQueryClient()

  return useMutation({
    mutationFn: createSaving,

    onSuccess: (
      _data,
      variables,
    ) => {
      queryClient.invalidateQueries({
        queryKey:
          savingsKeys.goal(
            variables.goalId,
          ),
      })
    },
  })
}

export function useGoalsWithSavingsSummary(
  relationshipId: string,
) {
  return useQuery({
    queryKey: savingsKeys.summary(
      relationshipId,
    ),
    queryFn: () =>
      getGoalsWithSavingsSummary(
        relationshipId,
      ),
    enabled: Boolean(relationshipId),
  })
}

export function useDeleteSaving({
  goalId,
  relationshipId,
}: {
  goalId: string
  relationshipId: string
}) {
  const queryClient =
    useQueryClient()

  return useMutation({
    mutationFn: deleteSaving,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          savingsKeys.goal(goalId),
      })

      queryClient.invalidateQueries({
        queryKey:
          savingsKeys.summary(
            relationshipId,
          ),
      })
    },
  })
}