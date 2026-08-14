import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  createGoal,
  getGoal,
  getGoals,
  getGoalsWithContributionSummary,
} from './api'

export const goalKeys = {
  all: ['goals'] as const,

  list: (relationshipId: string) =>
    [...goalKeys.all, 'list', relationshipId] as const,

  detail: (goalId: string) =>
    [...goalKeys.all, 'detail', goalId] as const,
}

export function useGoals(
  relationshipId: string,
) {
  return useQuery({
    queryKey: goalKeys.list(
      relationshipId,
    ),

    queryFn: () =>
      getGoals(relationshipId),

    enabled: Boolean(
      relationshipId,
    ),
  })
}

export function useGoal(
  goalId: string,
) {
  return useQuery({
    queryKey: goalKeys.detail(
      goalId,
    ),

    queryFn: () =>
      getGoal(goalId),

    enabled: Boolean(goalId),
  })
}

export function useCreateGoal() {
  const queryClient =
    useQueryClient()

  return useMutation({
    mutationFn: createGoal,

    onSuccess: (
      _data,
      variables,
    ) => {
      queryClient.invalidateQueries({
        queryKey: goalKeys.list(
          variables.relationshipId,
        ),
      })
    },
  })
}

export function useGoalsWithContributions(relationshipId: string) {
  return useQuery({
    queryKey: ['goals', relationshipId, 'with-contributions'],
    queryFn: () => getGoalsWithContributionSummary(relationshipId),
    enabled: !!relationshipId,
  })
}