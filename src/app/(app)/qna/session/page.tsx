// app/(dashboard)/qna/session/page.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useMyRelationshipDetails } from "@/features/relationship/queries";
import { useGetMyProfile } from "@/features/profiles/queries";
import { useActiveSession } from "@/features/qna/queries";
import { useQnaRealtime } from "@/features/qna/use-qna-realtime";
import { QuestionCard } from "@/features/qna/components/question-card";
import { AnswerInput } from "@/features/qna/components/answer-input";
import { QnaReveal } from "@/features/qna/components/qna-reveal";

const GRACE_PERIOD_MS = 2000;

export default function QnaSessionPage() {
  const router = useRouter();

  const { data: relationshipDetails, isLoading: isLoadingRelationship } =
    useMyRelationshipDetails();

  const { data: profile, isLoading: isLoadingProfile } = useGetMyProfile();

  const { data: activeSession, isLoading: isLoadingSession } =
    useActiveSession();

  const relationshipId = relationshipDetails?.relationship.id;

  const [pendingRevealSessionId, setPendingRevealSessionId] = useState<
    string | null
  >(null);

  const [showEmptyState, setShowEmptyState] = useState(false);

  // Status shuffle kartu pertanyaan, dipakai untuk mengunci input jawaban
  const [isShuffling, setIsShuffling] = useState(false);

  const graceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useQnaRealtime({
    relationshipId,
    onSessionCompleted: (sessionId) => {
      if (graceTimerRef.current) {
        clearTimeout(graceTimerRef.current);
        graceTimerRef.current = null;
      }

      setShowEmptyState(false);
      setPendingRevealSessionId(sessionId);
    },
    onNewSessionStarted: () => {
      if (graceTimerRef.current) {
        clearTimeout(graceTimerRef.current);
        graceTimerRef.current = null;
      }

      setShowEmptyState(false);
      setPendingRevealSessionId(null);
    },
  });

  useEffect(() => {
    const trulyEmpty =
      !isLoadingSession && !activeSession && !pendingRevealSessionId;

    if (trulyEmpty) {
      graceTimerRef.current = setTimeout(() => {
        setShowEmptyState(true);
      }, GRACE_PERIOD_MS);
    } else {
      setShowEmptyState(false);

      if (graceTimerRef.current) {
        clearTimeout(graceTimerRef.current);
        graceTimerRef.current = null;
      }
    }

    return () => {
      if (graceTimerRef.current) {
        clearTimeout(graceTimerRef.current);
        graceTimerRef.current = null;
      }
    };
  }, [isLoadingSession, activeSession, pendingRevealSessionId]);

  function handleCloseReveal() {
    setPendingRevealSessionId(null);
    router.push("/qna");
  }

  const isLoading =
    isLoadingRelationship || isLoadingProfile || isLoadingSession;

  if (isLoading) {
    return (
      <main className="min-h-dvh w-full bg-[#ffffff] px-5 py-7 sm:px-8 sm:py-10">
        <div className="mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-3xl flex-col">
          <header className="flex shrink-0 items-start justify-between">
            <div>
              <div className="h-3 w-20 animate-pulse rounded-full bg-black/[0.06]" />
              <div className="mt-3 h-9 w-56 animate-pulse rounded-xl bg-black/[0.06]" />
            </div>

            <div className="size-9 animate-pulse rounded-full bg-black/[0.06]" />
          </header>

          <div className="flex flex-1 items-center justify-center">
            <div className="h-[360px] w-full animate-pulse rounded-[2rem] bg-black/[0.035]" />
          </div>

          <div className="h-13 w-full animate-pulse rounded-full bg-black/[0.05]" />
        </div>
      </main>
    );
  }

  if (!relationshipDetails || !profile) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#fff] px-6">
        <div className="max-w-sm text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#1e1318]">
            <span className="text-sm text-white">♡</span>
          </div>

          <h2 className="mt-5 text-lg font-semibold tracking-tight text-[#171717]">
            Belum terhubung
          </h2>

          <p className="mt-2 text-sm leading-6 text-black/45">
            Hubungkan pasanganmu terlebih dahulu untuk mulai menggunakan Q&A
            bersama.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-dvh w-full overflow-hidden bg-[#ffffff]">
      {/* Tanpa padding di wrapper. Tiap section mengatur jaraknya sendiri. */}
      <div className="relative z-10 flex min-h-dvh w-full flex-col">
        {/* Header */}
        <header className="flex shrink-0 items-start justify-between gap-5 px-5 pt-7 sm:px-8 sm:pt-10">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
              Q&A for two
            </p>

            <h1 className="mt-2 text-[28px] font-medium leading-tight tracking-[-0.045em] text-neutral-950 sm:text-[32px]">
              Answer anything.
            </h1>
          </div>

          <button
            type="button"
            onClick={() => router.push("/qna")}
            aria-label="Kembali ke Q&A"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-black/[0.05] bg-neutral-800 text-white shadow-sm transition-all duration-200 hover:bg-white hover:text-neutral-900 active:scale-95"
          >
            <X className="size-4" strokeWidth={1.8} />
          </button>
        </header>

        {/* Session content */}
        <section className="relative flex min-h-0 flex-1 items-center justify-center">
          {/* Center glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 size-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-200/[0.10] blur-[125px]"
          />

          <div className="relative z-10 flex w-full max-w-3xl items-center justify-center">
            {pendingRevealSessionId ? (
              <div className="w-full max-w-[46rem] px-5 pb-7 sm:px-8 sm:pb-10">
                <QnaReveal
                  sessionId={pendingRevealSessionId}
                  currentUserId={profile.id}
                  onClose={handleCloseReveal}
                  showNewQuestionButton
                />
              </div>
            ) : activeSession ? (
              // 46rem = 672px (max-w-2xl) + 2 x 32px inset, jadi kartu di desktop
              // tetap selebar 672px seperti sebelumnya.
              <div className="w-full max-w-[46rem]">
                {/* Section kartu: tanpa padding */}
                <QuestionCard
                  session={activeSession}
                  onShufflingChange={setIsShuffling}
                />

                {/* Section input: punya padding sendiri */}
                <div className="px-5 pb-7 sm:px-8 sm:pb-10">
                  <AnswerInput session={activeSession} disabled={isShuffling} />
                </div>
              </div>
            ) : showEmptyState ? (
              <div className="flex w-full max-w-md flex-col items-center px-5 pb-7 text-center sm:pb-10">
                <div className="flex items-center justify-center gap-3">
                  <span className="h-px w-8 bg-black/10" />

                  <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-black/30">
                    Sesi selesai
                  </span>

                  <span className="size-1.5 rounded-full bg-[#c995b5]" />

                  <span className="h-px w-8 bg-black/10" />
                </div>

                <h2 className="mt-7 text-[34px] font-medium leading-[1.08] tracking-[-0.055em] text-[#171717] sm:text-[48px]">
                  Sesi ini sudah berakhir.
                </h2>

                <p className="mt-5 max-w-sm text-[13px] leading-6 text-black/40 sm:text-[15px]">
                  Tidak ada percakapan yang sedang berlangsung. Kalian bisa
                  kembali ke Q&A dan memilih sesuatu yang ingin dibicarakan.
                </p>

                <button
                  type="button"
                  onClick={() => router.push("/qna")}
                  className="mt-8 flex h-13 w-full items-center justify-center rounded-full bg-[#1e1318] px-6 text-sm font-semibold tracking-[-0.01em] text-white shadow-[0_18px_40px_-18px_rgba(30,19,24,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#281a21] active:translate-y-0"
                >
                  Kembali ke Q&A
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center px-5 pb-7 text-center sm:pb-10">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-black/10" />

                  <span className="size-1.5 rounded-full bg-[#c995b5]" />

                  <span className="h-px w-8 bg-black/10" />
                </div>

                <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-black/30">
                  Menyiapkan sesi
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}