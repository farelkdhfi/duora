// qna/use-qna-realtime.ts

"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { qnaKeys } from "./queries";

interface UseQnaRealtimeOptions {
  relationshipId: string | undefined;
  onSessionCompleted?: (sessionId: string) => void;
  onNewSessionStarted?: () => void;
}

export function useQnaRealtime({
  relationshipId,
  onSessionCompleted,
  onNewSessionStarted,
}: UseQnaRealtimeOptions) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!relationshipId) return;

    const supabase = createClient();

    const channel = supabase
      .channel(`qna-sessions-${relationshipId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "qna_sessions",
          filter: `relationship_id=eq.${relationshipId}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: qnaKeys.activeSession() });
          queryClient.invalidateQueries({ queryKey: qnaKeys.history() });
          queryClient.invalidateQueries({ queryKey: qnaKeys.sessionsToday() });

          // Deteksi: UPDATE yang bikin status jadi 'completed'
          if (
            payload.eventType === "UPDATE" &&
            payload.new?.status === "completed" &&
            payload.old?.status !== "completed"
          ) {
            const sessionId = payload.new.id as string;
            onSessionCompleted?.(sessionId);
          }

          // Deteksi: INSERT sesi baru (pending) -> clear reveal yang sedang tampil
          if (payload.eventType === "INSERT" && payload.new?.status === "pending") {
            onNewSessionStarted?.();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [relationshipId, queryClient, onSessionCompleted, onNewSessionStarted]);
}