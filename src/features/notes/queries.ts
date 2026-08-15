import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  addChecklistItem,
  createNote,
  deleteChecklistItem,
  deleteNote,
  getNotes,
  toggleChecklistItem,
  toggleNoteFavorite,
  toggleNotePin,
  updateNote,
} from './api'

import { activitiesKeys } from '@/features/activities/queries'

export const notesKeys = {
  all: ['notes'] as const,

  list: (relationshipId: string) =>
    [...notesKeys.all, 'list', relationshipId] as const,
}

export function useNotes(
  relationshipId: string,
) {
  return useQuery({
    queryKey: notesKeys.list(
      relationshipId,
    ),

    queryFn: () =>
      getNotes(relationshipId),

    enabled: Boolean(relationshipId),
  })
}

export function useCreateNote(
  relationshipId: string,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createNote,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notesKeys.list(
          relationshipId,
        ),
      })

      queryClient.invalidateQueries({
        queryKey: activitiesKeys.list(
          relationshipId,
        ),
      })
    },
  })
}

export function useUpdateNote(
  relationshipId: string,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateNote,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notesKeys.list(
          relationshipId,
        ),
      })

      queryClient.invalidateQueries({
        queryKey: activitiesKeys.list(
          relationshipId,
        ),
      })
    },
  })
}

export function useDeleteNote(
  relationshipId: string,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteNote,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notesKeys.list(
          relationshipId,
        ),
      })

      queryClient.invalidateQueries({
        queryKey: activitiesKeys.list(
          relationshipId,
        ),
      })
    },
  })
}

export function useToggleNotePin(
  relationshipId: string,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleNotePin,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notesKeys.list(
          relationshipId,
        ),
      })
    },
  })
}

export function useToggleNoteFavorite(
  relationshipId: string,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleNoteFavorite,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notesKeys.list(
          relationshipId,
        ),
      })
    },
  })
}

export function useAddChecklistItem(
  relationshipId: string,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addChecklistItem,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notesKeys.list(
          relationshipId,
        ),
      })
    },
  })
}

export function useToggleChecklistItem(
  relationshipId: string,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleChecklistItem,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notesKeys.list(
          relationshipId,
        ),
      })
    },
  })
}

export function useDeleteChecklistItem(
  relationshipId: string,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteChecklistItem,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notesKeys.list(
          relationshipId,
        ),
      })
    },
  })
}