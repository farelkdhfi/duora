// qna/components/qna-reveal.tsx

"use client";

import { Heart, Plus, X, Loader2, ArrowUpRight } from "lucide-react";
import { getCategoryInfo } from "../category-info";
import { useSessionDetail, useStartNewQna } from "../queries";

interface QnaRevealProps {
  sessionId: string;
  currentUserId: string;
  onClose?: () => void;
  showNewQuestionButton?: boolean;
}

export function QnaReveal({
  sessionId,
  currentUserId,
  onClose,
  showNewQuestionButton = false,
}: QnaRevealProps) {
  const { data: session, isLoading } = useSessionDetail(sessionId);
  const {
    mutate: startNewQna,
    isPending: isStartingNew,
    error: startError,
  } = useStartNewQna();

  if (isLoading) {
    return (
      <div className="flex min-h-[240px] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-[1rem] border border-black/[0.055] bg-white/70 shadow-[0_15px_35px_-20px_rgba(30,19,24,0.2)]">
            <Loader2
              className="size-4 animate-spin text-black/35"
              strokeWidth={1.7}
            />
          </div>

          <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-black/30">
            Memuat jawaban
          </span>
        </div>
      </div>
    );
  }

  if (!session || session.status !== "completed") {
    return null;
  }

  const category = session.category;
  const categoryInfo = getCategoryInfo(category);

  function handleNewQuestion() {
    startNewQna(category);
  }

  const myAnswer =
    session.answer_a_user_id === currentUserId
      ? session.answer_a_text
      : session.answer_b_text;

  const partnerAnswer =
    session.answer_a_user_id === currentUserId
      ? session.answer_b_text
      : session.answer_a_text;

  return (
    <div className="relative w-full">
      {/* Ambient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[30%] size-[420px] -translate-x-1/2 rounded-full bg-[#d9a9c0]/[0.07] blur-[120px]"
      />

      <div className="relative z-10 mx-auto w-full max-w-2xl">
        {/* ============================================================ */}
        {/* QUESTION                                                     */}
        {/* ============================================================ */}

        <div className="relative overflow-hidden rounded-[2rem] border border-black/[0.055] bg-white/75 shadow-[0_30px_80px_-45px_rgba(30,19,24,0.28)] backdrop-blur-xl">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c995b5]/40 to-transparent" />

          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-semibold uppercase tracking-[0.22em] text-black/25">
                Pertanyaan
              </span>

              <div className="flex items-center gap-1.5">
                <span className="h-px w-5 bg-black/[0.07]" />
                <span className="size-1 rounded-full bg-[#c995b5]/70" />
              </div>
            </div>

            <div className="flex min-h-[150px] items-center justify-center py-8 text-center sm:min-h-[190px]">
              <p className="max-w-xl text-[24px] font-medium leading-[1.2] tracking-[-0.035em] text-[#171717] sm:text-[32px] md:text-[38px]">
                {session.question_text}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="h-px w-8 bg-black/[0.06]" />
              <span className="size-1 rounded-full bg-[#c995b5]/60" />
              <span className="h-px w-8 bg-black/[0.06]" />
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* ANSWERS                                                      */}
        {/* ============================================================ */}

        <div className="mt-4 space-y-3">
          {/* My Answer */}
          <div className="overflow-hidden rounded-[1.75rem] border border-black/[0.055] bg-white/60 shadow-[0_20px_55px_-40px_rgba(30,19,24,0.2)] backdrop-blur-xl">
            <div className="px-5 py-5 sm:px-7 sm:py-6">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-semibold uppercase tracking-[0.22em] text-black/25">
                  Jawaban kamu
                </span>

                <span className="rounded-full bg-[#c995b5]/10 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#9b6683]">
                  Kamu
                </span>
              </div>

              <p className="mt-4 text-[14px] leading-7 tracking-[-0.01em] text-black/65 sm:text-[15px]">
                {myAnswer}
              </p>
            </div>
          </div>

          {/* Partner Answer */}
          <div className="overflow-hidden rounded-[1.75rem] border border-black/[0.055] bg-white/60 shadow-[0_20px_55px_-40px_rgba(30,19,24,0.2)] backdrop-blur-xl">
            <div className="px-5 py-5 sm:px-7 sm:py-6">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-semibold uppercase tracking-[0.22em] text-black/25">
                  Jawaban pasangan
                </span>

                <span className="rounded-full bg-black/[0.035] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-black/40">
                  Pasangan
                </span>
              </div>

              <p className="mt-4 text-[14px] leading-7 tracking-[-0.01em] text-black/65 sm:text-[15px]">
                {partnerAnswer}
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* ERROR                                                        */}
        {/* ============================================================ */}

        {startError && (
          <div className="mt-4 px-1">
            <p className="text-center text-[10px] leading-5 text-amber-600/75">
              {startError.message.includes("QNA_EXHAUSTED")
                ? "Pertanyaan di kategori ini sudah habis. Coba kategori lain."
                : startError.message}
            </p>
          </div>
        )}

        {/* ============================================================ */}
        {/* ACTIONS                                                      */}
        {/* ============================================================ */}

        {showNewQuestionButton ? (
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleNewQuestion}
              disabled={isStartingNew}
              className="group flex h-13 flex-1 items-center justify-center gap-2 rounded-full bg-[#1e1318] px-5 text-sm font-semibold tracking-[-0.01em] text-white shadow-[0_18px_40px_-18px_rgba(30,19,24,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#281a21] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 sm:h-13"
            >
              {isStartingNew ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <span>Pertanyaan baru</span>

                  <ArrowUpRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={1.8}
                  />
                </>
              )}
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex size-12 shrink-0 items-center justify-center rounded-full border border-black/20 bg-white/60 text-black backdrop-blur-xl transition-all duration-300 hover:bg-black/[0.035] hover:text-black/60 sm:size-13"
                aria-label="Tutup"
              >
                <X className="size-4" strokeWidth={1.7} />
              </button>
            )}
          </div>
        ) : (
          onClose && (
            <button
              type="button"
              onClick={onClose}
              className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[1.25rem] border border-black/20 bg-white/60 text-[11px] font-semibold tracking-[-0.01em] text-black/40 backdrop-blur-xl transition-all duration-300 hover:bg-black/[0.035] hover:text-black/65 sm:h-13"
            >
              <X className="size-3.5" strokeWidth={1.7} />
              <span>Tutup</span>
            </button>
          )
        )}
      </div>
    </div>
  );
}