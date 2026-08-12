import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  createChecklistItem,
  deleteChecklistItem,
  getChecklist,
  toggleChecklistItem,
} from './checklist-api'

export const checklistKeys = {
  all: ['goal-checklist'] as const,

  list: (goalId: string) =>
    [
      ...checklistKeys.all,
      goalId,
    ] as const,
}

export function useChecklist(
  goalId: string,
) {
  return useQuery({
    queryKey: checklistKeys.list(
      goalId,
    ),

    queryFn: () =>
      getChecklist(goalId),

    enabled: Boolean(goalId),
  })
}

export function useCreateChecklistItem() {
  const queryClient =
    useQueryClient()

  return useMutation({
    mutationFn: createChecklistItem,

    onSuccess: (
      _data,
      variables,
    ) => {
      queryClient.invalidateQueries({
        queryKey:
          checklistKeys.list(
            variables.goalId,
          ),
      })
    },
  })
}

export function useToggleChecklistItem() {
  const queryClient =
    useQueryClient()

  return useMutation({
    mutationFn: toggleChecklistItem,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey:
          checklistKeys.list(
            data.goal_id,
          ),
      })
    },
  })
}

export function useDeleteChecklistItem() {
  const queryClient =
    useQueryClient()

  return useMutation({
    mutationFn:
      deleteChecklistItem,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          checklistKeys.all,
      })
    },
  })
}