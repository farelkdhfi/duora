// app/(dashboard)/qna/session/page.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useMyRelationshipDetails } from "@/features/relationship/queries";
import { useGetMyProfile } from "@/features/profiles/queries";
import { useActiveSession } from "@/features/qna/queries";
import { useQnaRealtime } from "@/features/qna/use-qna-realtime";
import { AnswerForm } from "@/features/qna/components/answer-form";
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
      <main className="min-h-dvh w-full bg-[#fafaf9] px-5 py-7 sm:px-8 sm:py-10">
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
      <main className="flex min-h-dvh items-center justify-center bg-[#fafaf9] px-6">
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
      {/* Ambient background */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
      >
        <div className="absolute left-1/2 top-[38%] size-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-200/[0.12] blur-[130px]" />

        <div className="absolute left-[12%] top-[18%] size-[260px] rounded-full bg-pink-200/[0.07] blur-[110px]" />

        <div className="absolute bottom-[-120px] right-[8%] size-[320px] rounded-full bg-purple-200/[0.06] blur-[120px]" />

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0)_68%)]" />
      </div>

      <div className="relative z-10 flex min-h-dvh w-full flex-col px-5 py-7 sm:px-8 sm:py-10">
        {/* Header */}
        <header className="flex shrink-0 items-start justify-between gap-5">
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
              <div className="w-full max-w-2xl">
                <QnaReveal
                  sessionId={pendingRevealSessionId}
                  currentUserId={profile.id}
                  onClose={handleCloseReveal}
                  showNewQuestionButton
                />
              </div>
            ) : activeSession ? (
              <div className="w-full max-w-2xl">
                <AnswerForm session={activeSession} />
              </div>
            ) : showEmptyState ? (
              <div className="flex w-full max-w-md flex-col items-center px-5 text-center">
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
              <div className="flex flex-col items-center text-center">
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