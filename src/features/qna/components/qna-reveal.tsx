// qna/components/qna-reveal.tsx

"use client";

import { ArrowUpRight, Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { getQnaErrorKey } from "../errors";
import { useSessionDetail, useStartNewQna } from "../queries";

interface QnaRevealProps {
  sessionId: string;
  currentUserId: string;
  onClose?: () => void;
  showNewQuestionButton?: boolean;
}

/**
 * Animasi masuk kartu, sama dengan di QuestionCard. Didefinisikan lagi di sini
 * karena QuestionCard tidak ter-mount saat reveal tampil, jadi style-nya belum
 * ada di halaman.
 */
const revealStyles = `
  @keyframes qna-card-in {
    0%   { opacity: 0; transform: translateY(18px) scale(0.96) rotate(-1.5deg); }
    100% { opacity: 1; transform: none; }
  }

  .qna-card-in {
    transform-origin: 50% 100%;
    animation: qna-card-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @media (prefers-reduced-motion: reduce) {
    .qna-card-in {
      animation: none !important;
    }
  }
`;

export function QnaReveal({
  sessionId,
  currentUserId,
  onClose,
  showNewQuestionButton = false,
}: QnaRevealProps) {
  const t = useTranslations("qna.reveal");
  const tcat = useTranslations("qna.categories");
  const te = useTranslations("qna.errors");

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
          <div className="flex size-10 items-center justify-center rounded-[1rem] border border-black/[0.055] bg-primary/70 shadow-[0_15px_35px_-20px_rgba(30,19,24,0.2)]">
            <Loader2
              className="size-4 animate-spin text-description"
              strokeWidth={1.7}
            />
          </div>

          <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-description">
            {t("loading")}
          </span>
        </div>
      </div>
    );
  }

  if (!session || session.status !== "completed") {
    return null;
  }

  const category = session.category;

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
      <style>{revealStyles}</style>

      {/* flow-root menjaga margin deck tetap di dalam container */}
      <div className="relative z-10 mx-auto flow-root w-full max-w-2xl">
        {/* ------------------------------------------------------------ */}
        {/* QUESTION CARD (deck), sama dengan QuestionCard               */}
        {/* ------------------------------------------------------------ */}
        <div className="relative my-8">
          {/* Kartu-kartu di belakang (efek tumpukan) */}
          <div
            aria-hidden
            className="absolute inset-0 origin-bottom translate-y-[13px] scale-[0.94] rounded-[2rem] border border-black/[0.05] bg-pink-200"
          />
          <div
            aria-hidden
            className="absolute inset-0 origin-bottom translate-y-[26px] scale-[0.88] rounded-[2rem] border border-black/[0.04] bg-blue-200/50"
          />

          {/* Kartu utama */}
          <div className="qna-card-in relative z-10 flex min-h-[100px] flex-col rounded-[2rem] border border-black/[0.06] bg-primary px-6 py-5 shadow-[0_30px_80px_-45px_rgba(30,19,24,0.35)] sm:min-h-[340px] sm:px-9">
            <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
              <p className="mt-6 max-w-xl text-sm font-medium leading-snug tracking-[-0.02em] text-secondary sm:text-[32px] md:text-[38px]">
                {session.question_text}
              </p>
            </div>

            <div className="mx-auto flex items-center gap-2.5 pt-7">
              <span className="h-[1px] w-7 bg-black/30" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-description">
                {tcat(`${category}.name`)}
              </span>
              <span className="h-[1px] w-7 bg-black/30" />
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* ANSWERS, gaya sama dengan AnswerInput                        */}
        {/* ------------------------------------------------------------ */}
        <div className="space-y-3">
          {/* My Answer */}
          <div className="rounded-[2rem] border border-black/[0.06] bg-primary/65 p-6 shadow-[0_20px_60px_-40px_rgba(30,19,24,0.25)] backdrop-blur-xl sm:p-7">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-description">
                {t("myAnswer")}
              </span>

              <span className="rounded-full bg-[#c995b5]/10 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#9b6683]">
                {t("meBadge")}
              </span>
            </div>

            <p className="mt-4 whitespace-pre-wrap text-[15px] leading-7 tracking-[-0.01em] text-secondary sm:text-[16px]">
              {myAnswer}
            </p>
          </div>

          {/* Partner Answer */}
          <div className="rounded-[2rem] border border-black/[0.06] bg-primary/65 p-6 shadow-[0_20px_60px_-40px_rgba(30,19,24,0.25)] backdrop-blur-xl sm:p-7">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-description">
                {t("partnerAnswer")}
              </span>

              <span className="rounded-full bg-black/[0.035] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-description">
                {t("partnerBadge")}
              </span>
            </div>

            <p className="mt-4 whitespace-pre-wrap text-[15px] leading-7 tracking-[-0.01em] text-secondary sm:text-[16px]">
              {partnerAnswer}
            </p>
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* ERROR                                                        */}
        {/* ------------------------------------------------------------ */}
        {startError && (
          <div className="mx-auto mt-4 max-w-md text-center">
            <p role="alert" className="text-xs leading-5 text-amber-600/80">
              {te(getQnaErrorKey(startError))}
            </p>
          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* ACTIONS                                                      */}
        {/* ------------------------------------------------------------ */}
        {showNewQuestionButton ? (
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleNewQuestion}
              disabled={isStartingNew}
              className="group flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-neutral-800 px-6 text-sm font-semibold tracking-[-0.01em] text-white shadow-[0_18px_40px_-18px_rgba(30,19,24,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#281a21] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            >
              {isStartingNew ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <span>{t("newQuestion")}</span>

                  <ArrowUpRight
                    className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    strokeWidth={1.8}
                  />
                </>
              )}
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label={t("close")}
                className="flex size-12 shrink-0 items-center justify-center rounded-full border border-black/[0.08] bg-primary/65 text-description backdrop-blur-xl transition-all duration-300 hover:bg-primary hover:text-secondary"
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
              className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-black/[0.08] bg-primary/65 text-sm font-semibold tracking-[-0.01em] text-description backdrop-blur-xl transition-all duration-300 hover:bg-primary hover:text-secondary"
            >
              <X className="size-3.5" strokeWidth={1.7} />
              <span>{t("close")}</span>
            </button>
          )
        )}
      </div>
    </div>
  );
}