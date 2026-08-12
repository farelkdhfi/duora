import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getMyProfile, updateMyAvatar, updateMyProfile } from './api'

export const profileKeys = {
  all: ['profiles'] as const,
  mine: () => [...profileKeys.all, 'mine'] as const,
}

export function useGetMyProfile() {
  return useQuery({
    queryKey: profileKeys.mine(),
    queryFn: getMyProfile,
  })
}

export function useUpdateMyProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.mine() })
      queryClient.invalidateQueries({ queryKey: ['relationship'] })
    },
  })
}

export function useUpdateMyAvatar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateMyAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.mine() })
      queryClient.invalidateQueries({ queryKey: ['relationship'] })
    },
  })
}