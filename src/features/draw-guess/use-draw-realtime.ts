'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { drawKeys } from './queries'

export function useDrawRealtime(relationshipId: string | undefined) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!relationshipId) return

    const supabase = createClient()
    const filter = `relationship_id=eq.${relationshipId}`

    const refresh = () => {
      queryClient.invalidateQueries({ queryKey: drawKeys.round() })
    }

    const channel = supabase
      .channel(`draw-state-${relationshipId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'draw_sessions', filter }, refresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'draw_rounds', filter }, refresh)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'draw_guesses', filter }, (payload) => {
        const roundId = (payload.new as { round_id: string }).round_id
        queryClient.invalidateQueries({ queryKey: drawKeys.guesses(roundId) })
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'relationship_chemistry', filter }, () => {
        queryClient.invalidateQueries({ queryKey: drawKeys.chemistry() })
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [relationshipId, queryClient])
}