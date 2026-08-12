import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  getCheckinHistory,
  getTodayCheckin,
  upsertCheckin,
} from './api'
import { getPartnerName } from '../relationship/api'

export const checkinKeys = {
  all: ['checkins'] as const,

  today: (
    relationshipId: string,
    date: string,
  ) =>
    [
      ...checkinKeys.all,
      'today',
      relationshipId,
      date,
    ] as const,

  history: (
    relationshipId: string,
  ) =>
    [
      ...checkinKeys.all,
      'history',
      relationshipId,
    ] as const,
}

export function useTodayCheckin(
  relationshipId: string,
  date: string,
) {
  return useQuery({
    queryKey:
      checkinKeys.today(
        relationshipId,
        date,
      ),

    queryFn: () =>
      getTodayCheckin(
        relationshipId,
        date,
      ),

    enabled:
      Boolean(
        relationshipId &&
          date,
      ),
  })
}

export function useCheckinHistory(
  relationshipId: string,
) {
  return useQuery({
    queryKey:
      checkinKeys.history(
        relationshipId,
      ),

    queryFn: () =>
      getCheckinHistory(
        relationshipId,
      ),

    enabled:
      Boolean(relationshipId),
  })
}

export function useUpsertCheckin() {
  const queryClient =
    useQueryClient()

  return useMutation({
    mutationFn: upsertCheckin,

    onSuccess: (
      _data,
      variables,
    ) => {
      queryClient.invalidateQueries({
        queryKey:
          checkinKeys.today(
            variables.relationshipId,
            variables.date,
          ),
      })

      queryClient.invalidateQueries({
        queryKey:
          checkinKeys.history(
            variables.relationshipId,
          ),
      })
    },
  })
}

export function useGetPartnerName () {
  return useQuery({
    queryKey: ['partner'],
    queryFn: getPartnerName
  })
}