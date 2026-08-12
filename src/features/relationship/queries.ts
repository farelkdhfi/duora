import { useQuery } from '@tanstack/react-query'

import { getMyRelationship, getMyRelationshipDetails } from './api'

export const relationshipKeys = {
  all: ['relationship'] as const,
  mine: () => [...relationshipKeys.all, 'mine'] as const,
}

export function useMyRelationship() {
  return useQuery({
    queryKey: relationshipKeys.mine(),
    queryFn: getMyRelationship,
  })
}

export function useMyRelationshipDetails() {
  return useQuery({
    queryKey: [
      ...relationshipKeys.all,
      'details',
    ],
    queryFn: getMyRelationshipDetails,
  })
}