'use client'

import { useEffect } from 'react'

import {
  useQueryClient,
} from '@tanstack/react-query'

import {
  createClient,
} from '@/lib/supabase/client'

import {
  checkinKeys,
} from './queries'

interface UseCheckinRealtimeProps {
  relationshipId: string
}

export function useCheckinRealtime({
  relationshipId,
}: UseCheckinRealtimeProps) {
  const queryClient =
    useQueryClient()

  useEffect(() => {
    if (!relationshipId) {
      return
    }

    const supabase =
      createClient()

    const channel =
      supabase
        .channel(
          `checkins:${relationshipId}`,
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'daily_checkins',
            filter: `relationship_id=eq.${relationshipId}`,
          },
          () => {
            queryClient.invalidateQueries({
              queryKey:
                checkinKeys.all,
            })
          },
        )
        .subscribe()

    return () => {
      supabase.removeChannel(
        channel,
      )
    }
  }, [
    relationshipId,
    queryClient,
  ])
}