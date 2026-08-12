'use client'

import { useEffect } from 'react'

import {
  useQueryClient,
} from '@tanstack/react-query'

import {
  createClient,
} from '@/lib/supabase/client'

import {
  plannerKeys,
} from './queries'

interface UsePlannerRealtimeProps {
  relationshipId: string
}

export function usePlannerRealtime({
  relationshipId,
}: UsePlannerRealtimeProps) {
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
          `planner:${relationshipId}`,
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'planner_events',
            filter: `relationship_id=eq.${relationshipId}`,
          },
          () => {
            queryClient.invalidateQueries({
              queryKey:
                plannerKeys.relationship(
                  relationshipId,
                ),
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