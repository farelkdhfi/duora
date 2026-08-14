import { useQuery } from '@tanstack/react-query'

import { getMyRelationship, getMyRelationshipDetails, getPartnerName } from './api'

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