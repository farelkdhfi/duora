'use client'

import {
  useEffect,
} from 'react'

import {
  useQueryClient,
} from '@tanstack/react-query'

import {
  createClient,
} from '@/lib/supabase/client'

import {
  savingsKeys,
} from './queries'

interface UseSavingsRealtimeProps {
  goalId: string
}

export function useSavingsRealtime({
  goalId,
}: UseSavingsRealtimeProps) {
  const queryClient =
    useQueryClient()

  useEffect(() => {
    if (!goalId) {
      return
    }

    const supabase =
      createClient()

    const channel =
      supabase
        .channel(
          `savings:${goalId}`,
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'savings',
            filter: `goal_id=eq.${goalId}`,
          },
          () => {
            queryClient.invalidateQueries({
              queryKey:
                savingsKeys.goal(
                  goalId,
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
    goalId,
    queryClient,
  ])
}