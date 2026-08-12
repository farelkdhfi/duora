import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  createSaving,
  getGoalSavings,
} from './api'

export const savingsKeys = {
  all: ['savings'] as const,

  goal: (goalId: string) =>
    [
      ...savingsKeys.all,
      'goal',
      goalId,
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