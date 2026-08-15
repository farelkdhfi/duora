import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  createGoal,
  deleteGoal,
  getGoal,
  getGoals,
  updateGoal,
} from './api'
import { savingsKeys } from '../savings/queries'

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

      queryClient.invalidateQueries({
        queryKey: savingsKeys.summary(
          variables.relationshipId,
        ),
      })
    },
  })
}

export function useUpdateGoal(
  relationshipId: string,
) {
  const queryClient =
    useQueryClient()

  return useMutation({
    mutationFn: updateGoal,

    onSuccess: (
      data,
    ) => {
      queryClient.invalidateQueries({
        queryKey: goalKeys.detail(
          data.id,
        ),
      })

      queryClient.invalidateQueries({
        queryKey: goalKeys.list(
          relationshipId,
        ),
      })

      queryClient.invalidateQueries({
        queryKey: savingsKeys.summary(
          relationshipId,
        ),
      })
    },
  })
}

export function useDeleteGoal(
  relationshipId: string,
) {
  const queryClient =
    useQueryClient()

  return useMutation({
    mutationFn: deleteGoal,

    onSuccess: (
      goalId,
    ) => {
      queryClient.invalidateQueries({
        queryKey: goalKeys.list(
          relationshipId,
        ),
      })

      queryClient.invalidateQueries({
        queryKey: savingsKeys.summary(
          relationshipId,
        ),
      })

      queryClient.removeQueries({
        queryKey: goalKeys.detail(
          goalId,
        ),
      })

      queryClient.removeQueries({
        queryKey: savingsKeys.goal(
          goalId,
        ),
      })
    },
  })
}