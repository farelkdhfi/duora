import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { cancelPendingRelationship, deleteMyRelationship, getMyRelationship, getMyRelationshipDetails, getPartnerName, updateRelationship } from './api'
import { useRouter } from 'next/navigation'

export const relationshipKeys = {
  all: ['relationship'] as const,
  mine: () => [...relationshipKeys.all, 'mine'] as const,
  details: () => [...relationshipKeys.all, 'details'] as const,
  partner: () => [...relationshipKeys.all, 'partner'] as const,
}

export function useMyRelationship() {
  return useQuery({
    queryKey: relationshipKeys.mine(),
    queryFn: getMyRelationship,
  })
}

export function useMyRelationshipDetails() {
  return useQuery({
    queryKey: relationshipKeys.details(),
    queryFn: getMyRelationshipDetails,
  })
}

export function usePartnerName() {
  return useQuery({
    queryKey: relationshipKeys.partner(),
    queryFn: getPartnerName,
  })
}

export function useUpdateRelationship() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateRelationship,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: relationshipKeys.mine() })
      queryClient.invalidateQueries({ queryKey: relationshipKeys.details() })
    },
  })
}

export function useDeleteMyRelationship() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: deleteMyRelationship,
    onSuccess: () => {
      // buang semua cache: data relationship lama tidak boleh tersisa
      queryClient.clear()
      router.replace('/dashboard')
      router.refresh()
    },
  })
}

export function useCancelPendingRelationship() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: cancelPendingRelationship,
    onSuccess: async () => {
      // tandai semua cache lama basi dan paksa refetch yang sedang aktif
      await queryClient.invalidateQueries()

      // minta server component render ulang dengan data terbaru
      router.refresh()
    },
  })
}