import { useEffect, useRef } from 'react'
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import { createClient } from '@/lib/supabase/client'
import {
  createDebate,
  deleteDebate,
  getDebate,
  getDebateMessages,
  getDebates,
  requestAiAnalysis,
  resolveDebate,
  sendDebateMessage,
} from './api'
import type { Debate, DebateMessage } from './types'

export const debatesKeys = {
  all: ['debates'] as const,

  list: (relationshipId: string) =>
    [...debatesKeys.all, 'list', relationshipId] as const,

  detail: (debateId: string) =>
    [...debatesKeys.all, 'detail', debateId] as const,

  messages: (debateId: string) =>
    [...debatesKeys.all, 'messages', debateId] as const,
}

export function useDebates(
  relationshipId: string,
) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: debatesKeys.list(relationshipId),
    queryFn: () => getDebates(relationshipId),
    enabled: Boolean(relationshipId),
  })

  useEffect(() => {
    if (!relationshipId) return

    const supabase = createClient()

    const channel = supabase
      .channel(`debates-list-${relationshipId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'debates',
          filter: `relationship_id=eq.${relationshipId}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: debatesKeys.list(
              relationshipId,
            ),
          })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [relationshipId, queryClient])

  return query
}

export function useCreateDebate(
  relationshipId: string,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createDebate,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: debatesKeys.list(
          relationshipId,
        ),
      })
    },
  })
}

export function useDebate(debateId: string) {
  return useQuery({
    queryKey: debatesKeys.detail(debateId),
    queryFn: () => getDebate(debateId),
    enabled: Boolean(debateId),
  })
}

export function useDeleteDebate(
  relationshipId: string,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteDebate,

    onSuccess: (debateId) => {
      queryClient.invalidateQueries({
        queryKey: debatesKeys.list(
          relationshipId,
        ),
      })

      queryClient.removeQueries({
        queryKey: debatesKeys.detail(debateId),
      })

      queryClient.removeQueries({
        queryKey: debatesKeys.messages(debateId),
      })
    },
  })
}

export function useDebateMessages(
  debateId: string,
) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: debatesKeys.messages(debateId),
    queryFn: () => getDebateMessages(debateId),
    enabled: Boolean(debateId),
  })

  useEffect(() => {
    if (!debateId) return

    const supabase = createClient()

    const channel = supabase
      .channel(`debate-messages-${debateId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'debate_messages',
          filter: `debate_id=eq.${debateId}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey:
              debatesKeys.messages(debateId),
          })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [debateId, queryClient])

  return query
}

export function useSendDebateMessage(
  debateId: string,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sendDebateMessage,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          debatesKeys.messages(debateId),
      })
    },
  })
}

export function useRequestAiAnalysis(
  debateId: string,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: requestAiAnalysis,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          debatesKeys.messages(debateId),
      })

      queryClient.invalidateQueries({
        queryKey:
          debatesKeys.detail(debateId),
      })
    },
  })
}

/**
 * Subscribe ke perubahan status debate secara realtime.
 * Kalau status berubah jadi 'pending_verdict', otomatis
 * panggil AI final verdict SEKALI (dijaga pakai ref
 * supaya nggak double-trigger dari kedua pasangan sekaligus
 * atau dari re-render).
 */
export function useAutoFinalVerdict(
  debateId: string,
) {
  const queryClient = useQueryClient()
  const hasTriggeredRef = useRef(false)

  const analysisMutation =
    useRequestAiAnalysis(debateId)

  useEffect(() => {
    if (!debateId) return

    const supabase = createClient()

    const channel = supabase
      .channel(`debate-status-${debateId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'debates',
          filter: `id=eq.${debateId}`,
        },
        (payload) => {
          const newStatus = (
            payload.new as Debate
          ).status

          queryClient.invalidateQueries({
            queryKey:
              debatesKeys.detail(debateId),
          })

          queryClient.invalidateQueries({
            queryKey:
              debatesKeys.list(debateId),
          })

          if (
            newStatus === 'pending_verdict' &&
            !hasTriggeredRef.current
          ) {
            hasTriggeredRef.current = true

            analysisMutation.mutate({
              debateId,
              mode: 'final_verdict',
            })
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debateId, queryClient])

  return analysisMutation
}

export function useResolveDebate(
  relationshipId: string,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: resolveDebate,

    onSuccess: (debateId) => {
      queryClient.invalidateQueries({
        queryKey: debatesKeys.detail(debateId),
      })

      queryClient.invalidateQueries({
        queryKey: debatesKeys.list(
          relationshipId,
        ),
      })
    },
  })
}