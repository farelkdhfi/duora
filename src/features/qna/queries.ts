// qna/queries.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getRandomQuestion,
  startSession,
  submitAnswer,
  getActiveSession,
  getSessionDetail,
  getHistory,
  deleteSession,
  getSessionsCreatedToday,
  rerollQuestion,
} from "./api";
import type { QnaCategory } from "./types";

export const qnaKeys = {
  all: ["qna"] as const,
  activeSession: () => [...qnaKeys.all, "active-session"] as const,
  sessionDetail: (id: string) => [...qnaKeys.all, "session-detail", id] as const,
  history: () => [...qnaKeys.all, "history"] as const,
  sessionsToday: () => [...qnaKeys.all, "sessions-today"] as const,
};

export function useActiveSession() {
  return useQuery({
    queryKey: qnaKeys.activeSession(),
    queryFn: getActiveSession,
    refetchInterval: 10_000, // poll tiap 10 detik, biar tau kalau partner baru jawab
  });
}

export function useSessionDetail(sessionId: string | undefined) {
  return useQuery({
    queryKey: qnaKeys.sessionDetail(sessionId ?? ""),
    queryFn: () => getSessionDetail(sessionId as string),
    enabled: !!sessionId,
  });
}

export function useQnaHistory() {
  return useQuery({
    queryKey: qnaKeys.history(),
    queryFn: () => getHistory(),
  });
}

export function useSessionsCreatedToday() {
  return useQuery({
    queryKey: qnaKeys.sessionsToday(),
    queryFn: getSessionsCreatedToday,
  });
}

// Gabungan: ambil pertanyaan random LALU langsung mulai sesi
export function useStartNewQna() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: QnaCategory) => {
      const question = await getRandomQuestion(category);
      const session = await startSession(question.id);
      return session;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qnaKeys.activeSession() });
      queryClient.invalidateQueries({ queryKey: qnaKeys.sessionsToday() });
    },
  });
}

export function useSubmitAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, answerText }: { sessionId: string; answerText: string }) =>
      submitAnswer(sessionId, answerText),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qnaKeys.activeSession() });
      queryClient.invalidateQueries({ queryKey: qnaKeys.history() });
    },
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => deleteSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qnaKeys.history() });
    },
  });
}

export function useRerollQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => rerollQuestion(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qnaKeys.activeSession() });
    },
  });
}