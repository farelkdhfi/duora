// qna/queries.ts

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  useMutation,
  useMutationState,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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
  startNew: () => [...qnaKeys.all, "start-new"] as const,
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

// Gabungan: ambil pertanyaan random LALU langsung mulai sesi,
// lalu pembuat sesi langsung diarahkan ke halaman session.
export function useStartNewQna() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // isNavigating tetap true sampai perpindahan halaman benar-benar selesai
  const [isNavigating, startNavigation] = useTransition();

  const mutation = useMutation({
    // Key ini dipakai useStartedQnaThisVisit untuk mendeteksi sesi yang baru dibuat
    mutationKey: qnaKeys.startNew(),
    mutationFn: async (category: QnaCategory) => {
      const question = await getRandomQuestion(category);
      const session = await startSession(question.id);
      return session;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: qnaKeys.sessionsToday() });

      // Isi cache sesi aktif dulu, supaya halaman session langsung punya data
      // dan tidak sempat menampilkan "Menyiapkan sesi" atau "Sesi ini sudah berakhir".
      await queryClient.invalidateQueries({ queryKey: qnaKeys.activeSession() });

      startNavigation(() => {
        router.push("/qna/session");
      });
    },
  });

  // Loading baru berhenti setelah halaman berpindah, bukan saat request selesai
  return { ...mutation, isPending: mutation.isPending || isNavigating };
}

/**
 * True kalau user sudah memulai sesi baru sejak halaman ini dibuka.
 *
 * Dipakai halaman menu untuk menahan tampilan "Sesi berlanjut" selama user
 * sedang diarahkan otomatis ke /qna/session. Mutation dari kunjungan
 * sebelumnya tidak dihitung, jadi kalau user kembali ke menu nanti,
 * "Sesi berlanjut" tampil normal.
 */
export function useStartedQnaThisVisit() {
  const [visitStartedAt] = useState(() => Date.now());

  const attempts = useMutationState({
    filters: { mutationKey: qnaKeys.startNew() },
    select: (mutation) => ({
      status: mutation.state.status,
      submittedAt: mutation.state.submittedAt,
    }),
  });

  return attempts.some(
    (attempt) =>
      attempt.submittedAt >= visitStartedAt &&
      (attempt.status === "pending" || attempt.status === "success")
  );
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