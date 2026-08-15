import { useInfiniteQuery } from '@tanstack/react-query'

import { getRelationshipActivities } from './api'
import type { Activity } from './types'

export const activitiesKeys = {
  all: ['activities'] as const,

  list: (relationshipId: string) =>
    [...activitiesKeys.all, 'list', relationshipId] as const,
}

const PAGE_SIZE = 30

export function useRelationshipActivities(
  relationshipId: string,
) {
  return useInfiniteQuery({
    queryKey: activitiesKeys.list(
      relationshipId,
    ),

    queryFn: ({ pageParam }) =>
      getRelationshipActivities({
        relationshipId,
        before: pageParam,
        limit: PAGE_SIZE,
      }),

    initialPageParam: undefined as
      | string
      | undefined,

    getNextPageParam: (
      lastPage: Activity[],
    ) => {
      if (lastPage.length < PAGE_SIZE) {
        return undefined
      }

      return lastPage[lastPage.length - 1]
        .created_at
    },

    enabled: Boolean(relationshipId),
  })
}